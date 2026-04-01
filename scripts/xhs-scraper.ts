/**
 * 小红书内容下载工具（含图片）
 *
 * 使用系统安装的 Chrome + persistent context，绕过反爬检测
 *
 * 用法:
 *   npx tsx scripts/xhs-scraper.ts "咨询面经 MBB" --limit 10
 */

import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as readline from "readline";

const DEFAULT_OUTPUT = path.join(__dirname, "../docs/xhs");
const USER_DATA_DIR = path.join(__dirname, "../.xhs-chrome-profile");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

interface NoteData {
  id: string;
  url: string;
  title: string;
  author: string;
  content: string;
  likes: string;
  date: string;
  images: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ask = (q: string): Promise<string> => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (a) => { rl.close(); resolve(a); }));
};

const downloadImage = (url: string, filepath: string): Promise<boolean> =>
  new Promise((resolve) => {
    const doGet = (u: string) => {
      https.get(u, { headers: { Referer: "https://www.xiaohongshu.com/" } }, (res) => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          doGet(res.headers.location);
        } else {
          const file = fs.createWriteStream(filepath);
          res.pipe(file);
          file.on("finish", () => { file.close(); resolve(true); });
        }
      }).on("error", () => resolve(false));
    };
    doGet(url);
  });

const sanitize = (s: string) =>
  s.replace(/[\/\\:*?"<>|#\n\r]/g, "_").replace(/[^\w\u4e00-\u9fff_.-]/g, "_").replace(/_+/g, "_").substring(0, 80);

const formatNote = (note: NoteData) => {
  let md = `# ${note.title || "无标题"}\n\n`;
  if (note.author) md += `**作者**: ${note.author}\n`;
  if (note.date) md += `**日期**: ${note.date}\n`;
  if (note.likes) md += `**点赞**: ${note.likes}\n`;
  md += `**来源**: ${note.url}\n\n---\n\n`;
  md += note.content + "\n";
  if (note.images.length > 0) {
    md += `\n## 图片\n\n`;
    note.images.forEach((_, i) => { md += `![图${i + 1}](images/${note.id}_${i + 1}.jpg)\n`; });
  }
  return md;
};

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help") {
    console.log(`
小红书内容下载工具

用法: npx tsx scripts/xhs-scraper.ts "关键词" [--limit N] [--output dir] [--no-images]

使用系统Chrome + 独立profile，首次需登录，登录态持久化。
`);
    process.exit(0);
  }

  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10;
  const outputIdx = args.indexOf("--output");
  const outputDir = outputIdx >= 0 ? args[outputIdx + 1] : DEFAULT_OUTPUT;
  const noImages = args.includes("--no-images");

  const skipIdx = new Set<number>();
  if (limitIdx >= 0) skipIdx.add(limitIdx + 1);
  if (outputIdx >= 0) skipIdx.add(outputIdx + 1);
  const keyword = args.find((a, i) => !a.startsWith("--") && !skipIdx.has(i)) || "";
  if (!keyword) { console.log("请提供搜索关键词"); process.exit(1); }

  fs.mkdirSync(outputDir, { recursive: true });
  const imgDir = path.join(outputDir, "images");
  if (!noImages) fs.mkdirSync(imgDir, { recursive: true });

  console.log("启动 Chrome（使用系统安装的，非Chromium）...");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: false,
    viewport: { width: 1440, height: 900 },
    locale: "zh-CN",
    args: [
      "--disable-blink-features=AutomationControlled", // Hide automation flag
    ],
  });
  const page = context.pages()[0] || await context.newPage();

  // Patch navigator.webdriver to be undefined
  await page.addInitScript(`
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  `);

  // Go to XHS
  await page.goto("https://www.xiaohongshu.com", { waitUntil: "domcontentloaded" });
  await sleep(4000);

  // Check login
  const loggedIn = await page.evaluate(`!!(document.querySelector('a[href*="/user/profile/"]'))`);
  if (!loggedIn) {
    console.log("\n⚠️  请在浏览器中登录小红书（扫码或手机号）");
    await ask("登录完成后按 Enter 继续...");
    await sleep(3000);
  } else {
    console.log("✓ 已登录\n");
  }

  // === SEARCH ===
  const searchUrl = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&source=web_search_result_notes`;
  console.log(`搜索: ${keyword}`);
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await sleep(5000);

  // Close popups
  await page.evaluate(`
    document.querySelectorAll('[class*="close"]').forEach(el => {
      if (el.offsetHeight > 0 && el.offsetHeight < 60 && el.offsetWidth > 0 && el.offsetWidth < 60) el.click();
    });
  `);
  await sleep(1000);

  // Scroll to load
  for (let i = 0; i < 8; i++) {
    await page.evaluate("window.scrollBy(0, 500)");
    await sleep(800);
  }
  await page.evaluate("window.scrollTo(0, 0)");
  await sleep(500);

  const cardCount = await page.evaluate(`document.querySelectorAll('section.note-item').length`) as number;
  console.log(`找到 ${cardCount} 篇笔记\n`);

  if (cardCount === 0) {
    console.log("没有搜索结果");
    await context.close();
    return;
  }

  // === CLICK CARDS AND EXTRACT ===
  const notes: NoteData[] = [];
  const toProcess = Math.min(cardCount, limit);

  for (let i = 0; i < toProcess; i++) {
    console.log(`[${i + 1}/${toProcess}]`);

    try {
      // Scroll card into view
      await page.evaluate(`
        (() => { const c = document.querySelectorAll('section.note-item')[${i}]; if(c) c.scrollIntoView({block:'center'}); })()
      `);
      await sleep(800);

      // Click
      await page.evaluate(`
        (() => { const c = document.querySelectorAll('section.note-item')[${i}]; if(c) { const a = c.querySelector('a'); if(a) a.click(); } })()
      `);
      await sleep(5000);

      // Check for login modal
      const hasLoginModal = await page.evaluate(`!!document.querySelector('.login-modal')`);
      if (hasLoginModal) {
        // Close it and try clicking the card directly with mouse
        console.log("  ⚠️  登录弹窗出现，尝试关闭...");
        await page.evaluate(`
          const m = document.querySelector('.login-modal');
          if (m) {
            const close = m.querySelector('[class*="close"]');
            if (close) close.click();
          }
        `);
        await sleep(1000);
        console.log("  请在浏览器中手动点开一篇笔记，确认能看到内容");
        await ask("  确认后按 Enter...");
        await sleep(2000);
      }

      // Extract note content
      const data = await page.evaluate(`
        (() => {
          let title = '';
          let content = '';
          let author = '';
          let date = '';
          let likes = '';
          const images = [];

          // Look for note detail overlay
          const detail = document.querySelector('[class*="note-detail"]') ||
                         document.querySelector('#noteContainer') ||
                         document.querySelector('[class*="note-container"]');

          if (detail) {
            const t = detail.querySelector('[class*="title"]');
            if (t && t.textContent.trim().length < 200) title = t.textContent.trim();

            const d = detail.querySelector('[class*="desc"]') || detail.querySelector('[class*="content"]');
            if (d) content = d.innerText.trim();

            const a = detail.querySelector('.username');
            if (a) author = a.textContent.trim();

            const dt = detail.querySelector('[class*="date"]');
            if (dt) date = dt.textContent.trim();

            const l = detail.querySelector('[class*="like"] [class*="count"]');
            if (l) likes = l.textContent.trim();

            detail.querySelectorAll('img').forEach(img => {
              const src = img.src || '';
              if (src && (src.includes('xhscdn') || src.includes('sns-img')) && !src.includes('avatar') && img.naturalWidth > 100) {
                const clean = src.split('?')[0];
                if (!images.includes(clean)) images.push(clean);
              }
            });

            return { title, content, author, date, likes, images };
          }

          // No overlay found - check if URL changed to note page
          const urlMatch = window.location.href.match(/explore\\/([a-f0-9]{24})/);
          if (urlMatch) {
            // We're on a note page
            const titleEl = document.querySelector('#detail-title') || document.querySelector('.title');
            if (titleEl) title = titleEl.textContent.trim();

            const descEl = document.querySelector('#detail-desc') || document.querySelector('.desc');
            if (descEl) content = descEl.innerText.trim();

            const authorEl = document.querySelector('.username');
            if (authorEl) author = authorEl.textContent.trim();

            document.querySelectorAll('img').forEach(img => {
              const src = img.src || '';
              if (src && (src.includes('xhscdn') || src.includes('sns-img')) && !src.includes('avatar') && img.naturalWidth > 100) {
                const clean = src.split('?')[0];
                if (!images.includes(clean)) images.push(clean);
              }
            });
          }

          return { title, content, author, date, likes, images };
        })()
      `) as any;

      const noteId = ((await page.evaluate(`
        (() => { const m = window.location.href.match(/explore\\/([a-f0-9]+)/); return m ? m[1] : ''; })()
      `)) as string) || `card_${i}`;

      if (data.content && data.content.length > 50 && !data.content.includes("沪ICP备")) {
        notes.push({
          id: noteId, url: page.url(),
          title: data.title, author: data.author,
          content: data.content, likes: data.likes,
          date: data.date, images: data.images || [],
        });
        console.log(`  ✓ ${data.title || "(untitled)"} | ${data.author || "?"} | ${data.content.length}字 | ${(data.images||[]).length}图`);

        if (!noImages && data.images) {
          for (let j = 0; j < data.images.length; j++) {
            const p = path.join(imgDir, `${noteId}_${j + 1}.jpg`);
            const ok = await downloadImage(data.images[j], p);
            if (ok && fs.existsSync(p) && fs.statSync(p).size > 1000)
              console.log(`    📷 ${(fs.statSync(p).size / 1024).toFixed(0)}K`);
            else if (fs.existsSync(p)) fs.unlinkSync(p);
          }
        }
      } else {
        console.log(`  ✗ no content (${(data.content||'').length} chars)`);
      }

      // Go back
      await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
      await sleep(2000);
      if (!page.url().includes("search_result")) {
        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await sleep(4000);
        for (let s = 0; s < Math.ceil((i+1)/4); s++) { await page.evaluate("window.scrollBy(0,500)"); await sleep(400); }
      }

    } catch (e) {
      console.log(`  Error: ${(e as Error).message.substring(0, 80)}`);
      await page.goto(searchUrl, { waitUntil: "domcontentloaded" }).catch(() => {});
      await sleep(3000);
    }

    await sleep(1000 + Math.random() * 1500);
  }

  // === SAVE ===
  if (notes.length === 0) {
    console.log("\n没有抓到有效内容。");
  } else {
    for (const note of notes) {
      const filename = sanitize(note.title || `note_${note.id}`) + ".md";
      fs.writeFileSync(path.join(outputDir, filename), formatNote(note), "utf-8");
    }
    const combinedPath = path.join(outputDir, `combined_${sanitize(keyword)}.md`);
    fs.writeFileSync(combinedPath, notes.map(formatNote).join("\n\n---\n\n"), "utf-8");
    console.log(`\n✅ ${notes.length} 篇笔记已保存到 ${outputDir}/`);
    console.log(`   合并文件: ${combinedPath}`);
  }

  await context.close();
}

main().catch(console.error);
