#!/usr/bin/env node
/**
 * Playwright-based scraper for Chinese company career pages (SPA)
 * Renders each page with a headless browser, extracts job listings, pushes to Supabase
 *
 * Usage: node scripts/scrape-company-sites.js
 */

const { chromium } = require('/tmp/node_modules/playwright');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Company career pages to scrape (SPA sites that need browser rendering)
const SITES = [
  // Tech China - Campus/暑期实习
  { name: "字节跳动", url: "https://jobs.bytedance.com/campus/position", region: "CN", hint: "link必须以jobs.bytedance.com开头。只提取战略/商业分析/产品/运营类岗位。" },
  { name: "腾讯", url: "https://join.qq.com/post.html?query=2&tid=2", region: "CN", hint: "link必须以join.qq.com开头。只提取战略/商分/产品类岗位。" },
  { name: "阿里巴巴", url: "https://talent.alibaba.com/campus/position-list", region: "CN", hint: "link必须以talent.alibaba.com开头。" },
  { name: "美团", url: "https://campus.meituan.com/recruit/search", region: "CN", hint: "link必须以campus.meituan.com开头。" },
  { name: "京东", url: "https://campus.jd.com/web/job/job_info_list/3", region: "CN", hint: "link必须以campus.jd.com开头。" },
  { name: "拼多多", url: "https://careers.pddglobalhr.com/campus/grad", region: "CN", hint: "link必须以pddglobalhr.com开头。" },
  { name: "小红书", url: "https://campus.xiaohongshu.com/", region: "CN", hint: "link必须以xiaohongshu.com开头。" },
  { name: "快手", url: "https://campus.kuaishou.cn/recruit/e/#/official/jobs/", region: "CN", hint: "link必须以kuaishou.cn开头。" },
  { name: "B站", url: "https://jobs.bilibili.com/campus/positions", region: "CN", hint: "link必须以jobs.bilibili.com开头。" },
  { name: "网易", url: "https://campus.163.com/app/index", region: "CN", hint: "link必须以163.com开头。" },
  { name: "华为", url: "https://career.huawei.com/reccampportal/portal5/campus-recruitment.html", region: "CN", hint: "link必须以career.huawei.com开头。" },
  { name: "小米", url: "https://hr.xiaomi.com/", region: "CN", hint: "link必须以hr.xiaomi.com开头。" },
  // Auto/EV
  { name: "比亚迪", url: "https://hr.byd.com/", region: "CN", hint: "link必须以hr.byd.com开头。" },
  { name: "蔚来", url: "https://campus.nio.com/", region: "CN", hint: "link必须以nio.com开头。" },
  // More
  { name: "滴滴", url: "https://campus.didiglobal.com/", region: "CN", hint: "link必须以didiglobal.com开头。" },
  { name: "大疆", url: "https://we.dji.com/", region: "CN", hint: "link必须以we.dji.com开头。" },
  { name: "米哈游", url: "https://join.mihoyo.com/#/campus/position", region: "CN", hint: "link必须以join.mihoyo.com开头。" },
  { name: "蚂蚁集团", url: "https://talent.antgroup.com/campus", region: "CN", hint: "link必须以antgroup.com开头。" },
];

async function callAI(prompt) {
  if (ANTHROPIC_KEY) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', messages: [{ role: 'user', content: prompt }], max_tokens: 3000 })
    });
    const d = await r.json();
    return d.content?.[0]?.text || '[]';
  }
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.1, max_tokens: 3000 })
  });
  const d = await r.json();
  return d.choices?.[0]?.message?.content || '[]';
}

async function upsertJobs(jobs) {
  if (!jobs.length || !SUPABASE_URL) return;
  const rows = jobs.map(j => ({
    title: j.title || '', company: j.company || '', location: j.location || '',
    type: j.type || '实习', deadline: j.deadline || '', link: j.link || '',
    description: j.description || '', tags: j.tags || [], region: j.region || 'CN',
    source: j.source || '', active: true
  }));
  const r = await fetch(SUPABASE_URL + '/rest/v1/jobs', {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows)
  });
  console.log(`  Upserted ${rows.length} jobs, status: ${r.status}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const allJobs = [];

  for (const site of SITES) {
    console.log(`Scraping: ${site.name} (${site.url})`);
    try {
      const page = await browser.newPage();
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);

      const text = await page.textContent('body').catch(() => '');
      await page.close();

      if (!text || text.length < 100) {
        console.log(`  Empty page, skipping`);
        continue;
      }

      // Extract with AI
      const prompt = `从以下公司招聘页面内容中提取岗位信息。返回JSON数组。

公司: ${site.name}
页面内容:
${text.slice(0, 8000)}

每条岗位:
- title: 岗位名称（具体的，如"产品经理实习生"而非"实习"）
- company: "${site.name}"
- location: 城市
- type: "实习" 或 "校招"
- deadline: 截止日期（无则空）
- link: 岗位详情链接（${site.hint}）。如果原文没有具体链接，用公司招聘主页"${site.url}"
- description: 1句话描述
- tags: 标签数组

只提取战略/商业分析/产品/运营/管理培训生/咨询类岗位，跳过纯技术研发岗。
最多10条。只返回JSON数组。
严格规则：只提取页面中明确存在的岗位，不要编造。`;

      const aiText = await callAI(prompt);
      const m = aiText.match(/\[[\s\S]*\]/);
      if (!m) { console.log('  No JSON'); continue; }

      const jobs = JSON.parse(m[0])
        .filter(j => j.title && j.link)
        .map(j => ({ ...j, region: site.region, source: site.name + '官网' }));

      console.log(`  Found ${jobs.length} jobs`);
      allJobs.push(...jobs);

      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  await browser.close();

  console.log(`\nTotal: ${allJobs.length} jobs from company sites`);
  await upsertJobs(allJobs);
})();
