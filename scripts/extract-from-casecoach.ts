/**
 * Extract drills from CaseCoach PDF cases (143 PDFs)
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const PDF_DIR = path.join(process.env.HOME!, "Desktop/casebooks_all/casecoach_cases");
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/extracted_drills_cc");

async function callDeepSeek(prompt: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 4000 }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Unreachable");
}

function readPdf(pdfPath: string): string {
  try {
    const text = execSync(`pdftotext -l 5 "${pdfPath}" -`, { encoding: "utf-8", timeout: 10000 });
    // Clean watermark noise
    return text
      .replace(/Pr\s*Co[\s\S]*?ite\s*d\./g, "")
      .replace(/\(xl6.*?\)/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return "";
  }
}

function buildPrompt(caseName: string, content: string): string {
  return `从以下CaseCoach咨询Case原文中提取练习题。不要编造，只用原文内容。返回JSON数组。

Case: ${caseName}
${content.slice(0, 3000)}

提取规则：

1. structuring（type="open"）— business problem做题干，参考答案从原文framework提取
   需要: question(中文,含1-2句背景), referenceAnswer(200字+), keyPoints(5-8), explanation

2. case_math（type="number"）— 原文数字做计算题，所有数据写在题目里
   需要: question(中文), correctNumber, tolerance(0.05), unit, explanation(计算过程)

3. creativity（type="open"）— brainstorming/建议场景
   需要: question(中文), referenceAnswer(150字+), keyPoints(5+), explanation

4. synthesis（type="open"）— 列3-4个发现让学生写推荐
   需要: question(中文), referenceAnswer(200字+), keyPoints(5+), explanation

5. chart（type="open"或"choice"）— 如果有数据可构建图表
   需要chartData: {type:"bar"|"line"|"pie"|"stacked_bar"|"waterfall"|"horizontal_bar", title, categories?, values?|series?|segments?|waterfall?, unit?}

每题: category, type, difficulty("easy"|"medium"|"hard"), source("CaseCoach: ${caseName}"), question(中文), explanation(中文), timeLimit

只返回JSON数组，不要markdown。`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const pdfs = fs.readdirSync(PDF_DIR).filter((f) => f.endsWith(".pdf")).sort();
  console.log(`Found ${pdfs.length} CaseCoach PDFs`);

  let allDrills: any[] = [];
  let drillId = 5000;

  for (let i = 0; i < pdfs.length; i++) {
    const f = pdfs[i];
    const name = f.replace(".pdf", "").replace(/^CC_\d+_/, "").replace(/_/g, " ");
    const outFile = path.join(OUTPUT_DIR, `${name.slice(0, 60)}.json`);

    if (fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      if (existing.length > 0) {
        console.log(`[${i + 1}/${pdfs.length}] ${name}: cached (${existing.length})`);
        allDrills.push(...existing);
        drillId += existing.length;
        continue;
      }
    }

    const content = readPdf(path.join(PDF_DIR, f));
    if (content.length < 100) {
      console.log(`[${i + 1}/${pdfs.length}] ${name}: too short, skip`);
      fs.writeFileSync(outFile, "[]");
      continue;
    }

    console.log(`[${i + 1}/${pdfs.length}] Extracting: ${name}`);

    try {
      const response = await callDeepSeek(buildPrompt(name, content));
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { fs.writeFileSync(outFile, "[]"); continue; }

      let drills: any[];
      try { drills = JSON.parse(jsonMatch[0]); }
      catch { drills = JSON.parse(jsonMatch[0].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}")); }

      const valid = drills
        .filter((d: any) => d.question && d.category)
        .filter((d: any) => d.type !== "open" || (d.referenceAnswer && !d.referenceAnswer.includes("原文没有")))
        .map((d: any) => {
          if (!["easy", "medium", "hard"].includes(d.difficulty)) d.difficulty = "medium";
          for (const k of Object.keys(d)) { if (d[k] === null) delete d[k]; }
          if (d.chartData && (!d.chartData.type || !["bar", "horizontal_bar", "line", "pie", "stacked_bar", "waterfall", "bubble"].includes(d.chartData.type))) delete d.chartData;
          return { ...d, id: drillId++, source: d.source || `CaseCoach: ${name}` };
        });

      console.log(`  → ${valid.length} drills (${valid.map((d: any) => d.category).join(", ")})`);
      fs.writeFileSync(outFile, JSON.stringify(valid, null, 2));
      allDrills.push(...valid);
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e: any) {
      console.log(`  Error: ${e.message}`);
      fs.writeFileSync(outFile, "[]");
    }
  }

  const cats: Record<string, Record<string, number>> = {};
  for (const d of allDrills) {
    if (!cats[d.category]) cats[d.category] = {};
    cats[d.category][d.type] = (cats[d.category][d.type] || 0) + 1;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total: ${allDrills.length} drills from ${pdfs.length} CaseCoach cases`);
  for (const [cat, types] of Object.entries(cats).sort()) {
    console.log(`  ${cat}: ${Object.entries(types).map(([t, n]) => `${t}=${n}`).join(", ")}`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "_ALL.json"), JSON.stringify(allDrills, null, 2));
}

main().catch(console.error);
