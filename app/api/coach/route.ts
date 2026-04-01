import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `你是 LemonTalk 的咨询面试教练，帮用户备战 MBB/四大/投行面试。

【核心原则】
- 回复简短，每次聚焦一件事
- 像师兄/师姐发微信，不像写报告
- 出完题就等用户回答，不要提前给答案
- 检测到用户意图后，用 ACTION 触发对应模块展示真实功能界面

【能做的事】
- 练题/刷题/出题 → 触发每日一练模块（可指定题型）
- 找搭档/约练/找partner → 触发 Case Partner 模块
- 看题库/题目浏览 → 触发案例题库模块
- 练PEI/行为面试 → 触发PEI练习模块（可指定题目）
- 看实习/找工作/岗位 → 触发岗位模块
- 准备面试/生成面试小抄 → 触发面试突击模块（可传company/role）
- 查看框架/速查 → 触发速查手册模块
- 了解行业/行业背景 → 触发行业速览模块（可指定行业）
- 模拟面试/Mock → 触发模拟面试模块
- 简历优化/改简历 → 触发简历优化模块
- 完整Case/复杂问题 → 直接对话，不触发模块

【回复格式】
- 最多2段，每段2-3句
- 加粗用 **词语** 标注关键信息
- 末尾如果触发模块，加一行：ACTION:{"type":"show_module","params":{...}}

【ACTION 格式】
触发模块：ACTION:{"type":"show_module","params":{"module":"drill","category":"market_sizing"}}
- module 可选：drill / partner / casebook / jobs / pei / sprint / cheatsheet / industry / mock / resume
- drill 的 category：market_sizing / profitability / ma / strategy / operations / math_input（不填=随机）
- pei 的 questionId：why_consulting / why_firm / leadership / failure / conflict / impact（不填=列表）
- casebook 的 type：Profitability / Market Entry / M&A / Market Sizing / Growth Strategy（不填=全部）
- jobs 的 filter：实习 / 校招 / 社招（不填=全部）
- sprint 的 company/role：面试公司名 和 岗位名（用户告诉了才填）
- cheatsheet：无特殊参数
- industry 的 industryId：retail / healthcare / technology / finance / energy / education
- mock 的 caseType：profitability / market-entry / pricing / ma / market-sizing
- resume：无特殊参数
- partner 的可选参数（用户提到了才填）：
  - level：beginner（初学/入门）/ intermediate（进阶）/ advanced（高级）
  - firm：MBB / Big4 / Boutique / Internal+Strategy（用户提到目标公司类型时填）
  - caseType：Profitability / Market+Entry / M%26A / Market+Sizing / Growth+Strategy（用户提到想练的题型时填）
  - hint：一句话说明为什么这样推荐（中文，10-20字，例如"根据你的情况，已帮你筛选进阶水平+M&A题型的搭档"）`;

async function getProgress(userId: string) {
  const { data } = await supabaseAdmin
    .from("drill_records")
    .select("category, correct, created_at")
    .eq("user_id", userId)
    .limit(200);
  if (!data?.length) return null;

  const total = data.length;
  const correct = data.filter((r) => r.correct).length;
  const byCategory: Record<string, { total: number; correct: number }> = {};
  for (const r of data) {
    if (!byCategory[r.category]) byCategory[r.category] = { total: 0, correct: 0 };
    byCategory[r.category].total++;
    if (r.correct) byCategory[r.category].correct++;
  }
  return { total, correct, accuracy: Math.round((correct / total) * 100), byCategory };
}

export async function POST(request: NextRequest) {
  const { messages, userId } = await request.json();

  // Inject user context into system prompt
  let statsContext = "";
  if (userId) {
    const progress = await getProgress(userId);
    if (progress) {
      statsContext = `\n\n【用户练习数据】共刷题${progress.total}题，正确率${progress.accuracy}%`;
      const weak = Object.entries(progress.byCategory)
        .filter(([, v]) => v.total >= 3 && v.correct / v.total < 0.6)
        .map(([k]) => k);
      if (weak.length) statsContext += `，弱项：${weak.join("/")}`;
    }
  }

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + statsContext },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content || "我这边出了点问题，稍后再试试吧。";

  type ParsedAction = { type: string; params: Record<string, string> };

  // Parse all ACTION lines
  const actionMatches = [...content.matchAll(/ACTION:(\{[^\n]+\})/g)];
  const actions: ParsedAction[] = [];
  const text = content.replace(/ACTION:\{[^\n]+\}/g, "").trim();

  for (const m of actionMatches) {
    try { actions.push(JSON.parse(m[1])); } catch { /* skip */ }
  }

  // Keyword fallback
  const userLastMsg = (messages as Message[]).at(-1)?.content?.toLowerCase() || "";
  if (actions.length === 0) {
    if (userLastMsg.includes("partner") || userLastMsg.includes("搭档") || userLastMsg.includes("找人")) {
      actions.push({ type: "show_module", params: { module: "partner" } });
    } else if (userLastMsg.includes("岗位") || userLastMsg.includes("实习") || userLastMsg.includes("工作")) {
      actions.push({ type: "show_module", params: { module: "jobs" } });
    } else if (userLastMsg.includes("题库") || userLastMsg.includes("casebook")) {
      actions.push({ type: "show_module", params: { module: "casebook" } });
    } else if (userLastMsg.includes("刷题") || userLastMsg.includes("练题") || userLastMsg.includes("出题")) {
      actions.push({ type: "show_module", params: { module: "drill" } });
    } else if (userLastMsg.includes("pei") || userLastMsg.includes("行为面试")) {
      actions.push({ type: "show_module", params: { module: "pei" } });
    }
  }

  const action = actions[0] || null;

  // For show_module, no server-side data needed — modules fetch their own data
  let actionData = null;
  if (action?.type === "show_progress" && userId) {
    actionData = await getProgress(userId);
  }

  return NextResponse.json({ text, action, actions, actionData });
}
