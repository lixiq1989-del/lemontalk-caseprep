/**
 * Extract drills from cases_data.ts (84 LemonTalk cases)
 * Uses each case's prompt + framework + exhibits + Q&A to create drills
 */

import fs from "fs";
import path from "path";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/extracted_drills_v2");

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

function buildPrompt(title: string, type: string, industry: string, promptEn: string, promptCn: string, framework: string, exhibit1: string, qa: string): string {
  const caseContent = [
    `Title: ${title}`,
    `Type: ${type} | Industry: ${industry}`,
    promptCn ? `场景: ${promptCn}` : `Scenario: ${promptEn}`,
    framework ? `Framework:\n${framework.slice(0, 800)}` : "",
    exhibit1 ? `Exhibit:\n${exhibit1.slice(0, 500)}` : "",
    qa ? `Q&A:\n${qa.slice(0, 800)}` : "",
  ].filter(Boolean).join("\n\n");

  return `从以下咨询Case原文中提取练习题。不要编造，只用原文内容。返回JSON数组。

${caseContent}

提取规则（只提取原文有素材的类型）：

1. structuring（type="open"）— 用原文的business problem做题干，framework做参考答案
   必须有: question, referenceAnswer(200字+), keyPoints(5-8个), explanation

2. case_math（type="number"）— 用原文的数字做计算题，所有数据写在题目里
   必须有: question, correctNumber, tolerance(0.05), unit, explanation(含计算过程)

3. creativity（type="open"）— 用原文的brainstorming/recommendation场景
   必须有: question, referenceAnswer(150字+), keyPoints(5+), explanation

4. synthesis（type="open"）— 列出原文3-4个发现，让学生写推荐
   必须有: question, referenceAnswer(200字+), keyPoints(5+), explanation

5. chart（type="choice" 或 type="open"）— 如果原文有数据，构建图表
   choice: 需要chartData + options(4个) + answer(index)
   open: 需要chartData + referenceAnswer + keyPoints
   chartData格式: {type:"bar"|"line"|"pie"|"stacked_bar"|"waterfall"|"horizontal_bar", title, categories?, values?|series?|segments?|waterfall?, unit?}

每题必须有: category, type, difficulty("easy"|"medium"|"hard"), source("${title}"), question(中文), explanation(中文), timeLimit(open=120-180, number=30-60, choice=30-45)

只返回JSON数组。不要markdown。`;
}

// Load cases_data.ts
function loadCases(): any[] {
  const raw = fs.readFileSync(path.join(process.env.HOME!, "case-partner/lib/cases_data.ts"), "utf-8");
  const match = raw.match(/export const CASES_DATA[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) { console.log("Parse failed"); return []; }
  try { return JSON.parse(match[1]); } catch { console.log("JSON parse failed"); return []; }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const cases = loadCases();
  console.log(`Loaded ${cases.length} cases from cases_data.ts`);

  let allDrills: any[] = [];
  let drillId = 3000;

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const title = c.title || `Case ${i}`;
    const outFile = path.join(OUTPUT_DIR, `${title.replace(/[^a-zA-Z0-9_ -]/g, "").slice(0, 60)}.json`);

    if (fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      if (existing.length > 0) {
        console.log(`[${i + 1}/${cases.length}] ${title}: cached (${existing.length})`);
        allDrills.push(...existing);
        drillId += existing.length;
        continue;
      }
    }

    console.log(`[${i + 1}/${cases.length}] Extracting: ${title} (${c.type})`);

    try {
      const prompt = buildPrompt(
        title, c.type || "", c.industry || "",
        c.prompt_en || "", c.prompt_cn || "",
        c.sections?.framework || "", c.sections?.exhibit1 || "", c.sections?.qa || ""
      );

      const response = await callDeepSeek(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { fs.writeFileSync(outFile, "[]"); continue; }

      let drills: any[];
      try { drills = JSON.parse(jsonMatch[0]); }
      catch { drills = JSON.parse(jsonMatch[0].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}")); }

      const valid = drills
        .filter((d: any) => d.question && d.category)
        .filter((d: any) => d.type !== "open" || (d.referenceAnswer && !d.referenceAnswer.includes("原文没有")))
        .filter((d: any) => d.difficulty === "easy" || d.difficulty === "medium" || d.difficulty === "hard" || (() => { d.difficulty = "medium"; return true; })())
        .map((d: any) => {
          // Clean nulls
          for (const k of Object.keys(d)) { if (d[k] === null) delete d[k]; }
          // Fix chartData
          if (d.chartData && (!d.chartData.type || !["bar","horizontal_bar","line","pie","stacked_bar","waterfall","bubble"].includes(d.chartData.type))) delete d.chartData;
          return { ...d, id: drillId++, source: d.source || title };
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

  // Stats
  const cats: Record<string, Record<string, number>> = {};
  for (const d of allDrills) {
    if (!cats[d.category]) cats[d.category] = {};
    cats[d.category][d.type] = (cats[d.category][d.type] || 0) + 1;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total: ${allDrills.length} drills from ${cases.length} cases`);
  for (const [cat, types] of Object.entries(cats).sort()) {
    console.log(`  ${cat}: ${Object.entries(types).map(([t, n]) => `${t}=${n}`).join(", ")}`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "_ALL.json"), JSON.stringify(allDrills, null, 2));
}

main().catch(console.error);
