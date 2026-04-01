/**
 * Extract drills from casebook content
 *
 * Instead of asking AI to invent questions, we extract real scenarios
 * from casebooks and structure them as drills with reference answers.
 *
 * Usage: npx ts-node scripts/extract-drills.ts
 */

import fs from "fs";
import path from "path";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const FIRM_CASES_DIR = path.join(process.env.HOME!, "Desktop/casebooks_all/firm_cases");
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/extracted_drills");

async function callDeepSeek(prompt: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Unreachable");
}

function buildExtractPrompt(caseName: string, caseContent: string): string {
  return `你是一个咨询面试培训专家。从以下case原文中，提取真实的练习场景。不要编造新内容，只从原文中提取。

Case: ${caseName}
原文：
${caseContent.slice(0, 3500)}

请从原文中提取以下类型的drill（只提取原文有的，没有的不要编）。返回JSON数组。

1. **structuring**（框架搭建）— type="open"
   - question: 用原文的business problem作为题干（1-2句背景+问题）
   - referenceAnswer: 从原文提取的完整framework（保留原文结构，200字以上）
   - keyPoints: 从framework中提取5-8个关键词
   - explanation: 为什么这个框架适合这个问题（50-100字）

2. **case_math**（商业计算）— type="number"
   - question: 用原文的数据和计算场景（把所有需要的数字写在题目里）
   - correctNumber: 原文的正确答案
   - tolerance: 0.05
   - unit: 单位
   - explanation: 完整计算过程

3. **creativity**（头脑风暴）— type="open"
   - question: 原文中的brainstorming/recommendation场景
   - referenceAnswer: 原文给出的方案列表
   - keyPoints: 关键方案关键词
   - explanation: 评价标准

4. **chart**（图表解读）— type="choice"（如果原文有数据表格/exhibit）
   - question: 基于原文数据设计问题
   - chartData: 用原文真实数据构建图表 {type, title, categories, values/series/segments}
   - options: 4个选项
   - answer: 正确选项index

5. **synthesis**（总结推荐）— type="open"
   - question: 列出原文的3-4个关键发现，让学生写推荐
   - referenceAnswer: 原文的recommendation
   - keyPoints: 推荐的关键要素

每道题必须包含：category, type, difficulty, source("${caseName}"), question, explanation, timeLimit
开放题timeLimit=120-180，计算题=30-60，选择题=30-45

重要：所有内容必须来自case原文，不要编造。question用中文写，保留原文中的英文术语和数字。
只返回JSON数组，不要markdown代码块。`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(FIRM_CASES_DIR).filter((f) => f.endsWith(".txt"));
  console.log(`Found ${files.length} case files`);

  let allDrills: any[] = [];
  let drillId = 2000;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const name = f.replace("_full.txt", "").replace(/_/g, " ");
    const outFile = path.join(OUTPUT_DIR, `${name}.json`);

    if (fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      if (existing.length > 0) {
        console.log(`[${i + 1}/${files.length}] ${name}: cached (${existing.length} drills)`);
        allDrills.push(...existing);
        drillId += existing.length;
        continue;
      }
    }

    console.log(`[${i + 1}/${files.length}] Extracting: ${name}`);
    const content = fs.readFileSync(path.join(FIRM_CASES_DIR, f), "utf-8");

    try {
      const response = await callDeepSeek(buildExtractPrompt(name, content));
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.log(`  No JSON found`);
        fs.writeFileSync(outFile, "[]");
        continue;
      }

      let drills: any[];
      try {
        drills = JSON.parse(jsonMatch[0]);
      } catch {
        drills = JSON.parse(jsonMatch[0].replace(/,\s*]/g, "]").replace(/,\s*}/g, "}"));
      }

      const valid = drills
        .filter((d: any) => d.question && d.category)
        .map((d: any) => ({
          ...d,
          id: drillId++,
          source: d.source || name,
          timeLimit: d.timeLimit || (d.type === "open" ? 150 : d.type === "number" ? 40 : 35),
        }));

      console.log(`  Extracted ${valid.length} drills (${valid.map((d: any) => d.category).join(", ")})`);
      fs.writeFileSync(outFile, JSON.stringify(valid, null, 2));
      allDrills.push(...valid);

      await new Promise((r) => setTimeout(r, 1500));
    } catch (e: any) {
      console.log(`  Error: ${e.message}`);
      fs.writeFileSync(outFile, "[]");
    }
  }

  // Summary
  const cats: Record<string, Record<string, number>> = {};
  for (const d of allDrills) {
    if (!cats[d.category]) cats[d.category] = {};
    cats[d.category][d.type] = (cats[d.category][d.type] || 0) + 1;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total extracted: ${allDrills.length} drills`);
  for (const [cat, types] of Object.entries(cats)) {
    const parts = Object.entries(types).map(([t, n]) => `${t}=${n}`).join(", ");
    console.log(`  ${cat}: ${parts}`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "_ALL_EXTRACTED.json"), JSON.stringify(allDrills, null, 2));
  console.log(`Output: ${path.join(OUTPUT_DIR, "_ALL_EXTRACTED.json")}`);
}

main().catch(console.error);
