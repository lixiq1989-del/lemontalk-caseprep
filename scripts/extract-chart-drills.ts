/**
 * Extract CHART drills specifically from all case sources
 * Focuses on creating chart interpretation drills with chartData
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/extracted_charts");

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
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Unreachable");
}

function buildChartPrompt(title: string, content: string): string {
  return `你是一名咨询面试出题专家。根据以下Case内容，构造2道图表解读练习题。

Case: ${title}
${content.slice(0, 2500)}

要求：
- 每道题必须包含chartData，用case中的真实数据（或基于case合理推导的数据）
- chartData格式：{"type":"bar"|"line"|"pie"|"stacked_bar"|"waterfall"|"horizontal_bar", "title":"图表标题", ...}
  - bar/horizontal_bar: "categories":["A","B"], "values":[10,20], "unit":"M"
  - line: "categories":["Q1","Q2"], "series":[{"name":"收入","values":[10,20]}]
  - pie: "segments":[{"label":"A","value":40},{"label":"B","value":60}]
  - stacked_bar: "categories":["2024","2025"], "series":[{"name":"线上","values":[10,20]},{"name":"线下","values":[30,25]}]
  - waterfall: "waterfall":[{"label":"收入","value":100,"type":"increase"},{"label":"成本","value":-60,"type":"decrease"},{"label":"利润","value":40,"type":"total"}]

- type="open"，学生看图写洞察
- question: 中文，1-2句背景+问题（"请分析下图..."/"这张图表反映了什么问题？"/"基于数据给出你的建议"）
- referenceAnswer: 200字以上，结构化（洞察1/2/3 + 建议）
- keyPoints: 5-8个关键词
- explanation: 答题要点
- timeLimit: 120
- difficulty: easy/medium/hard
- source: "${title}"
- category: "chart"

只返回JSON数组（2个对象），不要markdown代码块。`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load all case sources
  const cases: { name: string; content: string }[] = [];

  // 1. firm_cases txt
  const firmDir = path.join(process.env.HOME!, "Desktop/casebooks_all/firm_cases");
  for (const f of fs.readdirSync(firmDir).filter((f: string) => f.endsWith(".txt"))) {
    cases.push({
      name: f.replace("_full.txt", "").replace(/_/g, " "),
      content: fs.readFileSync(path.join(firmDir, f), "utf-8"),
    });
  }

  // 2. cases_data
  const raw = fs.readFileSync(path.join(process.env.HOME!, "case-partner/lib/cases_data.ts"), "utf-8");
  const match = raw.match(/export const CASES_DATA[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
  if (match) {
    try {
      const cd = JSON.parse(match[1]);
      for (const c of cd) {
        const text = [c.prompt_en, c.prompt_cn, c.sections?.framework?.slice(0, 500), c.sections?.exhibit1?.slice(0, 500)].filter(Boolean).join("\n");
        cases.push({ name: c.title, content: text });
      }
    } catch {}
  }

  // 3. CaseCoach PDFs
  const pdfDir = path.join(process.env.HOME!, "Desktop/casebooks_all/casecoach_cases");
  for (const f of fs.readdirSync(pdfDir).filter((f: string) => f.endsWith(".pdf"))) {
    try {
      const text = execSync(`pdftotext -l 5 "${path.join(pdfDir, f)}" -`, { encoding: "utf-8", timeout: 10000 });
      const name = f.replace(".pdf", "").replace(/^CC_\d+_/, "").replace(/_/g, " ");
      if (text.length > 100) cases.push({ name, content: text });
    } catch {}
  }

  console.log(`Total cases: ${cases.length}`);

  let allDrills: any[] = [];
  let drillId = 8000;

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const safeName = c.name.replace(/[^a-zA-Z0-9_ -]/g, "").slice(0, 50);
    const outFile = path.join(OUTPUT_DIR, `${safeName}.json`);

    if (fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      if (existing.length > 0) {
        allDrills.push(...existing);
        drillId += existing.length;
        continue;
      }
    }

    if (i % 10 === 0) console.log(`[${i + 1}/${cases.length}] Processing...`);

    try {
      const response = await callDeepSeek(buildChartPrompt(c.name, c.content));
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { fs.writeFileSync(outFile, "[]"); continue; }

      let drills: any[];
      try { drills = JSON.parse(jsonMatch[0]); }
      catch { try { drills = JSON.parse(jsonMatch[0].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}")); } catch { drills = []; } }

      const valid = drills
        .filter((d: any) => d.question && d.chartData && d.chartData.type)
        .filter((d: any) => ["bar", "horizontal_bar", "line", "pie", "stacked_bar", "waterfall", "bubble"].includes(d.chartData.type))
        .filter((d: any) => d.referenceAnswer && d.referenceAnswer.length > 50)
        .map((d: any) => {
          // Clean
          for (const k of Object.keys(d)) { if (d[k] === null) delete d[k]; }
          if (!["easy", "medium", "hard"].includes(d.difficulty)) d.difficulty = "medium";
          // Fix waterfall items
          if (d.chartData.type === "waterfall" && d.chartData.waterfall) {
            d.chartData.waterfall = d.chartData.waterfall.filter((w: any) => typeof w === "object" && w.label);
            for (const w of d.chartData.waterfall) {
              if (!w.value && w.value !== 0) w.value = 0;
              if (!["increase", "decrease", "total"].includes(w.type)) {
                w.type = w.value >= 0 ? "increase" : "decrease";
              }
              if (w.name && !w.label) { w.label = w.name; delete w.name; }
            }
          }
          // Fix pie segments
          if (d.chartData.type === "pie" && d.chartData.segments) {
            for (const s of d.chartData.segments) {
              if (s.name && !s.label) { s.label = s.name; delete s.name; }
            }
          }
          return {
            ...d,
            id: drillId++,
            category: "chart",
            type: "open",
            source: d.source || c.name,
            timeLimit: d.timeLimit || 120,
          };
        });

      fs.writeFileSync(outFile, JSON.stringify(valid, null, 2));
      allDrills.push(...valid);
      await new Promise((r) => setTimeout(r, 800));
    } catch (e: any) {
      fs.writeFileSync(outFile, "[]");
    }
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`Chart drills extracted: ${allDrills.length}`);

  // Chart type breakdown
  const types: Record<string, number> = {};
  for (const d of allDrills) {
    const t = d.chartData?.type || "?";
    types[t] = (types[t] || 0) + 1;
  }
  for (const [t, n] of Object.entries(types).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t}: ${n}`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "_ALL_CHARTS.json"), JSON.stringify(allDrills, null, 2));
}

main().catch(console.error);
