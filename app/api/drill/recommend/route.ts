import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

/**
 * GET /api/drill/recommend?user_id=xxx&interview_date=2026-05-01
 *
 * Returns personalized drill recommendations based on:
 * 1. Weakness detection (low accuracy categories)
 * 2. Coverage gaps (categories never practiced)
 * 3. Interview countdown (changes strategy based on days left)
 * 4. Target firm (MBB emphasizes structuring, IB emphasizes math)
 */

interface CategoryStats {
  category: string;
  total: number;
  correct: number;
  accuracy: number;
  lastPracticed: string;
}

const ALL_CATEGORIES = ["structuring", "case_math", "chart", "creativity", "synthesis"];

const CATEGORY_LABELS: Record<string, string> = {
  structuring: "框架搭建",
  case_math: "商业计算",
  chart: "图表解读",
  creativity: "头脑风暴",
  synthesis: "总结推荐",
  calculation: "数学速算",
};

// Firm-specific weights (which categories matter more)
const FIRM_WEIGHTS: Record<string, Record<string, number>> = {
  MBB: { structuring: 1.5, case_math: 1.2, chart: 1.3, creativity: 1.0, synthesis: 1.4 },
  "Big4": { structuring: 1.2, case_math: 1.4, chart: 1.3, creativity: 0.8, synthesis: 1.0 },
  IB: { structuring: 0.8, case_math: 1.8, chart: 1.5, creativity: 0.5, synthesis: 1.0 },
  互联网: { structuring: 1.3, case_math: 1.0, chart: 1.0, creativity: 1.5, synthesis: 1.2 },
  default: { structuring: 1.0, case_math: 1.0, chart: 1.0, creativity: 1.0, synthesis: 1.0 },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  const interviewDate = searchParams.get("interview_date");
  const targetFirm = searchParams.get("target_firm") || "default";

  // Get user's drill history
  let stats: CategoryStats[] = [];

  if (userId) {
    const { data } = await supabaseAdmin
      .from("drill_records")
      .select("category, correct, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const catMap: Record<string, { total: number; correct: number; last: string }> = {};
      for (const r of data) {
        if (!catMap[r.category]) catMap[r.category] = { total: 0, correct: 0, last: r.created_at };
        catMap[r.category].total++;
        if (r.correct) catMap[r.category].correct++;
      }
      stats = Object.entries(catMap).map(([cat, s]) => ({
        category: cat,
        total: s.total,
        correct: s.correct,
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
        lastPracticed: s.last,
      }));
    }
  }

  // Detect weaknesses and gaps
  const practicedCats = new Set(stats.map((s) => s.category));
  const gaps = ALL_CATEGORIES.filter((c) => !practicedCats.has(c));
  const weakest = [...stats].sort((a, b) => a.accuracy - b.accuracy);

  // Calculate days until interview
  let daysLeft = 999;
  if (interviewDate) {
    daysLeft = Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86400000);
  }

  // Determine strategy based on countdown
  let strategy: string;
  let dailyPlan: { category: string; label: string; count: number; reason: string }[] = [];

  const weights = FIRM_WEIGHTS[targetFirm] || FIRM_WEIGHTS.default;

  if (stats.length === 0) {
    // New user: balanced intro
    strategy = "新手入门：每个类型都试试，找到你的薄弱环节";
    dailyPlan = ALL_CATEGORIES.map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      count: 2,
      reason: "先摸底",
    }));
  } else if (daysLeft <= 7) {
    // Sprint mode: focus on weakest + synthesis
    strategy = `冲刺模式（还剩${daysLeft}天）：聚焦最薄弱环节 + 总结推荐`;
    const weakCat = weakest[0]?.category || "structuring";
    dailyPlan = [
      { category: weakCat, label: CATEGORY_LABELS[weakCat], count: 5, reason: `正确率最低（${weakest[0]?.accuracy || 0}%），突击提升` },
      { category: "synthesis", label: "总结推荐", count: 3, reason: "面试最后一步，冲刺必练" },
      { category: "structuring", label: "框架搭建", count: 2, reason: "框架是第一印象" },
    ];
    // Deduplicate
    const seen = new Set<string>();
    dailyPlan = dailyPlan.filter((d) => { if (seen.has(d.category)) return false; seen.add(d.category); return true; });
  } else if (daysLeft <= 30) {
    // Focused mode: 70% weakness, 30% maintain
    strategy = `重点突破（还剩${daysLeft}天）：70%薄弱项 + 30%保持`;
    const weak1 = weakest[0];
    const weak2 = weakest[1];

    if (weak1) dailyPlan.push({ category: weak1.category, label: CATEGORY_LABELS[weak1.category], count: 4, reason: `正确率${weak1.accuracy}%，需要重点练` });
    if (weak2) dailyPlan.push({ category: weak2.category, label: CATEGORY_LABELS[weak2.category], count: 3, reason: `正确率${weak2.accuracy}%，第二薄弱` });

    // Add gaps
    for (const g of gaps.slice(0, 2)) {
      dailyPlan.push({ category: g, label: CATEGORY_LABELS[g], count: 2, reason: "还没练过，需要摸底" });
    }

    // Fill remaining with firm-weighted categories
    const remaining = ALL_CATEGORIES.filter((c) => !dailyPlan.some((d) => d.category === c));
    for (const c of remaining.sort((a, b) => (weights[b] || 1) - (weights[a] || 1)).slice(0, 1)) {
      dailyPlan.push({ category: c, label: CATEGORY_LABELS[c], count: 1, reason: `${targetFirm}面试重点` });
    }
  } else {
    // Long-term: balanced with gap filling
    strategy = `均衡提升（还剩${daysLeft}天）：补齐短板 + 全面练习`;

    // Gaps first
    for (const g of gaps) {
      dailyPlan.push({ category: g, label: CATEGORY_LABELS[g], count: 2, reason: "还没练过" });
    }
    // Weak categories
    for (const w of weakest.filter((s) => s.accuracy < 60).slice(0, 2)) {
      dailyPlan.push({ category: w.category, label: CATEGORY_LABELS[w.category], count: 3, reason: `正确率${w.accuracy}%，需提升` });
    }
    // Fill remaining
    const inPlan = new Set(dailyPlan.map((d) => d.category));
    for (const c of ALL_CATEGORIES.filter((c) => !inPlan.has(c))) {
      dailyPlan.push({ category: c, label: CATEGORY_LABELS[c], count: 1, reason: "保持手感" });
    }
  }

  // Sort by count descending
  dailyPlan.sort((a, b) => b.count - a.count);

  return NextResponse.json({
    strategy,
    daysLeft: daysLeft < 999 ? daysLeft : null,
    targetFirm,
    stats,
    gaps: gaps.map((g) => ({ category: g, label: CATEGORY_LABELS[g] })),
    weaknesses: weakest.slice(0, 3).map((w) => ({ category: w.category, label: CATEGORY_LABELS[w.category], accuracy: w.accuracy, total: w.total })),
    dailyPlan,
    totalPracticed: stats.reduce((sum, s) => sum + s.total, 0),
  });
}
