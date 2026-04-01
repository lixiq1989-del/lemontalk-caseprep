/**
 * Casebook-to-Drill Generator
 *
 * Reads case content from multiple sources and uses DeepSeek to generate
 * structured drill questions (framework, math, chart, structuring, creativity, sizing).
 *
 * Usage:
 *   npx ts-node scripts/generate-drills.ts
 *   npx ts-node scripts/generate-drills.ts --source firm_cases
 *   npx ts-node scripts/generate-drills.ts --source cases_data
 */

import fs from "fs";
import path from "path";

const DEEPSEEK_API_KEY = "sk-faa77178e14c4468b4b69c4f97c90512";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const FIRM_CASES_DIR = path.join(process.env.HOME!, "Desktop/casebooks_all/firm_cases");
const CASES_DATA_PATH = path.join(process.env.HOME!, "case-partner/lib/cases_data.ts");
const OUTPUT_DIR = path.join(process.env.HOME!, "case-partner/scripts/generated_drills");

// ===== Types =====
interface GeneratedDrill {
  type: "choice" | "number" | "open";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  question: string;
  // choice
  options?: string[];
  answer?: number;
  // number
  correctNumber?: number;
  tolerance?: number;
  unit?: string;
  // open
  referenceAnswer?: string;
  keyPoints?: string[];
  // chart (optional JSON for chart data)
  chartData?: object;
  // common
  explanation: string;
  timeLimit: number;
}

// ===== DeepSeek API Call =====
async function callDeepSeek(prompt: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
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
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepSeek API error ${res.status}: ${text}`);
      }
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      if (i === retries) throw e;
      console.log(`  Retry ${i + 1}...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Unreachable");
}

// ===== Prompt Template =====
function buildPrompt(caseName: string, caseContent: string, caseType: string): string {
  return `根据以下Case内容，生成3道drill练习题。返回JSON数组。

Case: ${caseName} (${caseType})
${caseContent.slice(0, 2000)}

请生成3道题：
1. 一道framework选择题（type="choice", category="framework", 4个选项, answer=正确选项index 0-3）
2. 一道math计算题（type="number", category="math", correctNumber=正确答案, tolerance=0.05）
3. 一道judgment判断题（type="choice", category="judgment", 4个选项）

每道题包含: type, category, difficulty("easy"/"medium"/"hard"), source, question(中文), explanation(中文100字), timeLimit(秒)
选择题额外: options(4个字符串数组), answer(正确选项index)
计算题额外: correctNumber(数字), tolerance(数字), unit(字符串)

只返回JSON数组，不要markdown代码块，不要任何其他文字。`;
}

// ===== Parse firm_cases txt files =====
function loadFirmCases(): { name: string; content: string; type: string }[] {
  const files = fs.readdirSync(FIRM_CASES_DIR).filter((f) => f.endsWith(".txt"));
  return files.map((f) => {
    const content = fs.readFileSync(path.join(FIRM_CASES_DIR, f), "utf-8");
    const name = f.replace("_full.txt", "").replace(/_/g, " ");
    // Infer case type from content
    let type = "General";
    const lower = content.toLowerCase();
    if (lower.includes("profitability") || lower.includes("profit margin")) type = "Profitability";
    else if (lower.includes("market entry") || lower.includes("enter the market")) type = "Market Entry";
    else if (lower.includes("market sizing") || lower.includes("how many")) type = "Market Sizing";
    else if (lower.includes("pricing") || lower.includes("price")) type = "Pricing";
    else if (lower.includes("m&a") || lower.includes("acquisition") || lower.includes("merger")) type = "M&A";
    else if (lower.includes("growth") || lower.includes("revenue growth")) type = "Growth Strategy";
    else if (lower.includes("digital") || lower.includes("transformation")) type = "Digital Strategy";
    else if (lower.includes("operations") || lower.includes("cost reduction")) type = "Operations";
    return { name, content, type };
  });
}

// ===== Parse cases_data.ts =====
function loadCasesData(): { name: string; content: string; type: string }[] {
  const raw = fs.readFileSync(CASES_DATA_PATH, "utf-8");
  // Extract JSON array from the TS file
  const match = raw.match(/export const CASES_DATA[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.log("Could not parse cases_data.ts, trying eval approach...");
    return [];
  }

  try {
    const cases = JSON.parse(match[1]);
    return cases.map((c: any) => {
      const content = [
        `Title: ${c.title}`,
        `Title CN: ${c.title_cn}`,
        `Type: ${c.type}`,
        `Industry: ${c.industry}`,
        `Prompt EN: ${c.prompt_en}`,
        `Prompt CN: ${c.prompt_cn}`,
        c.sections?.framework ? `Framework: ${c.sections.framework}` : "",
        c.sections?.exhibit1 ? `Exhibit 1: ${c.sections.exhibit1}` : "",
        c.sections?.qa ? `Q&A: ${c.sections.qa}` : "",
        c.sections?.recommendation ? `Recommendation: ${c.sections.recommendation}` : "",
        c.sections?.deep_analysis ? `Deep Analysis: ${c.sections.deep_analysis.slice(0, 500)}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
      return { name: c.title || c.source, content, type: c.type || "General" };
    });
  } catch (e) {
    console.log("JSON parse failed for cases_data.ts:", e);
    return [];
  }
}

// ===== Extract JSON from LLM response =====
function extractJSON(text: string): GeneratedDrill[] {
  // Try to find JSON array in the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.log("  No JSON array found in response");
    return [];
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    // Try to fix common JSON issues
    let fixed = jsonMatch[0]
      .replace(/,\s*]/g, "]")
      .replace(/,\s*}/g, "}")
      .replace(/'/g, '"');
    try {
      return JSON.parse(fixed);
    } catch {
      console.log("  JSON parse failed even after fixes");
      return [];
    }
  }
}

// ===== Main =====
async function main() {
  const args = process.argv.slice(2);
  const sourceArg = args.find((a) => a.startsWith("--source="))?.split("=")[1] || "all";

  // Ensure output dir exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let allCases: { name: string; content: string; type: string }[] = [];

  if (sourceArg === "all" || sourceArg === "firm_cases") {
    console.log("Loading firm_cases txt files...");
    const firmCases = loadFirmCases();
    console.log(`  Found ${firmCases.length} firm cases`);
    allCases.push(...firmCases);
  }

  if (sourceArg === "all" || sourceArg === "cases_data") {
    console.log("Loading cases_data.ts...");
    const casesData = loadCasesData();
    console.log(`  Found ${casesData.length} cases from cases_data`);
    allCases.push(...casesData);
  }

  console.log(`\nTotal cases to process: ${allCases.length}`);

  const allDrills: GeneratedDrill[] = [];
  let drillId = 1000; // Start from 1000 to avoid conflicts with existing drills

  for (let i = 0; i < allCases.length; i++) {
    const c = allCases[i];
    console.log(`\n[${i + 1}/${allCases.length}] Processing: ${c.name} (${c.type})`);

    // Check if already processed
    const outFile = path.join(OUTPUT_DIR, `${c.name.replace(/[^a-zA-Z0-9_\- ]/g, "")}.json`);
    if (fs.existsSync(outFile)) {
      console.log("  Already processed, loading...");
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      allDrills.push(...existing);
      drillId += existing.length;
      continue;
    }

    try {
      const prompt = buildPrompt(c.name, c.content, c.type);
      const response = await callDeepSeek(prompt);
      const drills = extractJSON(response);

      if (drills.length === 0) {
        console.log("  No drills generated, skipping");
        continue;
      }

      // Assign IDs and validate
      const validDrills = drills
        .filter((d) => d.question && d.explanation && d.category)
        .map((d) => ({
          ...d,
          id: drillId++,
          source: d.source || c.name,
          timeLimit: d.timeLimit || (d.type === "open" ? 120 : d.type === "number" ? 30 : 30),
          difficulty: d.difficulty || "medium",
        }));

      console.log(`  Generated ${validDrills.length} drills`);
      allDrills.push(...validDrills);

      // Save per-case output
      fs.writeFileSync(outFile, JSON.stringify(validDrills, null, 2));

      // Rate limiting
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e: any) {
      console.log(`  Error: ${e.message}`);
    }
  }

  // Write combined output
  const combinedPath = path.join(OUTPUT_DIR, "_ALL_DRILLS.json");
  fs.writeFileSync(combinedPath, JSON.stringify(allDrills, null, 2));
  console.log(`\n========================================`);
  console.log(`Total drills generated: ${allDrills.length}`);
  console.log(`Output: ${combinedPath}`);

  // Also generate a TS import-ready file
  const tsPath = path.join(OUTPUT_DIR, "_generated_drills.ts");
  const tsContent = `// Auto-generated drill questions from casebooks
// Generated: ${new Date().toISOString()}
// Total: ${allDrills.length} drills

import type { DrillQuestion } from "@/lib/drills";
import type { ChartData } from "@/components/ChartDisplay";

export const GENERATED_DRILLS: DrillQuestion[] = ${JSON.stringify(allDrills, null, 2)};
`;
  fs.writeFileSync(tsPath, tsContent);
  console.log(`TS output: ${tsPath}`);
}

main().catch(console.error);
