import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/extracted_math");

async function callDeepSeek(prompt: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.4, max_tokens: 3000 }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 2000)); }
  }
  throw new Error("Unreachable");
}

function buildPrompt(title: string, content: string): string {
  return `你是咨询面试出题专家。从以下Case中提取2道商业计算题。必须用case中的真实数据。

Case: ${title}
${content.slice(0, 2500)}

要求：
- type="open", category="case_math"
- 题目把所有需要的数据写在题干里（学生不需要额外信息就能算）
- question末尾加"请写出完整的计算过程和最终答案。"
- referenceAnswer: 完整计算过程（公式→代入→结果→含义），200字以上
- keyPoints: 包含正确答案数字+关键公式名
- explanation: 这道题考察什么能力
- timeLimit: 90-120
- difficulty: easy/medium/hard

题型覆盖（每道不同）：
- 利润/收入计算（Revenue = Price × Volume）
- 盈亏平衡（BEP = Fixed Cost / (Price - Variable Cost)）
- 增长率/CAGR
- 市场份额计算
- ROI / 投资回报
- 成本结构分析（占比、变化）
- 单位经济学（LTV, CAC, Contribution Margin）

只返回JSON数组（2个对象），不要markdown代码块。`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const cases: { name: string; content: string }[] = [];

  // firm_cases
  const firmDir = path.join(process.env.HOME!, "Desktop/casebooks_all/firm_cases");
  for (const f of fs.readdirSync(firmDir).filter((f: string) => f.endsWith(".txt"))) {
    cases.push({ name: f.replace("_full.txt", "").replace(/_/g, " "), content: fs.readFileSync(path.join(firmDir, f), "utf-8") });
  }
  // cases_data
  const raw = fs.readFileSync(path.join(process.env.HOME!, "case-partner/lib/cases_data.ts"), "utf-8");
  const match = raw.match(/export const CASES_DATA[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
  if (match) {
    try {
      for (const c of JSON.parse(match[1])) {
        cases.push({ name: c.title, content: [c.prompt_en, c.prompt_cn, c.sections?.framework?.slice(0, 500), c.sections?.exhibit1?.slice(0, 500)].filter(Boolean).join("\n") });
      }
    } catch {}
  }
  // CaseCoach PDFs
  const pdfDir = path.join(process.env.HOME!, "Desktop/casebooks_all/casecoach_cases");
  for (const f of fs.readdirSync(pdfDir).filter((f: string) => f.endsWith(".pdf"))) {
    try {
      const text = execSync(`pdftotext -l 5 "${path.join(pdfDir, f)}" -`, { encoding: "utf-8", timeout: 10000 });
      if (text.length > 100) cases.push({ name: f.replace(".pdf", "").replace(/^CC_\d+_/, "").replace(/_/g, " "), content: text });
    } catch {}
  }

  console.log(`Total cases: ${cases.length}`);
  let allDrills: any[] = [];
  let drillId = 9000;

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const safeName = c.name.replace(/[^a-zA-Z0-9_ -]/g, "").slice(0, 50);
    const outFile = path.join(OUTPUT_DIR, `${safeName}.json`);
    if (fs.existsSync(outFile)) { const ex = JSON.parse(fs.readFileSync(outFile, "utf-8")); if (ex.length > 0) { allDrills.push(...ex); drillId += ex.length; continue; } }
    if (i % 10 === 0) console.log(`[${i + 1}/${cases.length}] Processing...`);
    try {
      const response = await callDeepSeek(buildPrompt(c.name, c.content));
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { fs.writeFileSync(outFile, "[]"); continue; }
      let drills: any[];
      try { drills = JSON.parse(jsonMatch[0]); } catch { try { drills = JSON.parse(jsonMatch[0].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}")); } catch { drills = []; } }
      const valid = drills.filter((d: any) => d.question && d.referenceAnswer && d.referenceAnswer.length > 50)
        .map((d: any) => {
          for (const k of Object.keys(d)) { if (d[k] === null) delete d[k]; }
          if (!["easy", "medium", "hard"].includes(d.difficulty)) d.difficulty = "medium";
          for (const k of Object.keys(d)) { if (!['id','type','category','difficulty','source','question','referenceAnswer','keyPoints','explanation','timeLimit'].includes(k)) delete d[k]; }
          return { ...d, id: drillId++, category: "case_math", type: "open", source: d.source || c.name, timeLimit: d.timeLimit || 90 };
        });
      fs.writeFileSync(outFile, JSON.stringify(valid, null, 2));
      allDrills.push(...valid);
      await new Promise(r => setTimeout(r, 800));
    } catch (e: any) { fs.writeFileSync(outFile, "[]"); }
  }
  console.log(`\nMath drills extracted: ${allDrills.length}`);
  fs.writeFileSync(path.join(OUTPUT_DIR, "_ALL_MATH.json"), JSON.stringify(allDrills, null, 2));
}
main().catch(console.error);
