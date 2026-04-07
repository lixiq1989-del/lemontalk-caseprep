import { NextRequest } from "next/server";

/**
 * Streaming AI chat endpoint for Cowork layout.
 *
 * AI response is streamed as SSE. The frontend parses tokens and splits them:
 * - Normal text → left chat panel
 * - [PANEL:panel_id:action:params] markers → right panel operations
 *
 * Panel markers:
 * [PANEL:drill:open:chart]     → open drill panel with chart category
 * [PANEL:jobs:open:UK]         → open jobs panel filtered to UK
 * [PANEL:jobs:filter:CN]       → filter current jobs panel to CN
 * [PANEL:casebook:open]        → open casebook panel
 * [PANEL:mock:open]            → open mock interview
 * [PANEL:drill:next]           → next drill question
 * [PANEL:preference:set:target_firm=MBB] → store preference
 */

const SYSTEM_PROMPT = `你是CasePrep的AI助手。你在一个分屏界面中工作——左边是聊天，右边是工具面板。

核心规则：你的每一条回复都必须包含至少一个[PANEL:...]指令来操作右侧面板。你不是纯聊天机器人——你是一个能操作界面的agent。用户说任何话，你都要判断应该打开哪个面板。

面板指令格式：[PANEL:模块:动作:参数]（用户看不到这些指令）

可用指令：
[PANEL:drill:open] 练习 | [PANEL:drill:open:structuring] 框架搭建 | [PANEL:drill:open:case_math] 商业计算 | [PANEL:drill:open:chart] 图表解读 | [PANEL:drill:open:creativity] 头脑风暴 | [PANEL:drill:open:synthesis] 总结推荐
[PANEL:casebook:open] Case题库 | [PANEL:jobs:open] 岗位 | [PANEL:jobs:open:CN] 中国岗位 | [PANEL:jobs:open:UK] 英国岗位 | [PANEL:jobs:open:US] 美国岗位 | [PANEL:jobs:open:HK] 香港岗位
[PANEL:mock:open] 模拟面试 | [PANEL:pei:open] PEI练习 | [PANEL:resume:open] 简历优化 | [PANEL:partner:open] Partner配对 | [PANEL:cheatsheet:open] 框架速查 | [PANEL:sprint:open] 面试突击 | [PANEL:industry:open] 行业速查
[PANEL:preference:set:target_firm=MBB] 记住目标 | [PANEL:preference:set:weakness=structuring] 记住薄弱项

筛选指令（在已打开的面板上做筛选）：
[PANEL:partner:filter:Profitability,beginner] 筛选partner为Profitability+初学者
[PANEL:partner:filter:M&A,advanced] 筛选M&A+高级
[PANEL:jobs:filter:UK] 筛选英国岗位
[PANEL:jobs:filter:CN] 筛选中国岗位

方案指令（组合多个站内模块成一个个性化方案）：
当用户需要综合性帮助（如"帮我准备面试""制定计划""全面分析"），用方案模式。方案会在右边展示为一个仪表盘，包含多个可交互的模块卡片。

[PANEL:plan:show]
[PLAN_START]
{"title":"方案标题","subtitle":"一句话说明","sections":[
{"type":"text","title":"📋 计划概览","icon":"📋","content":"第1-2天：框架基础\n第3-4天：计算突破\n第5-6天：综合练习\n第7天：模拟面试"},
{"type":"stats","title":"目标","icon":"🎯","stats":[{"label":"目标公司","value":"MBB"},{"label":"剩余天数","value":"14天","color":"text-[#C4071B]"},{"label":"每日练习","value":"2小时"},{"label":"重点","value":"框架+计算"}]},
{"type":"drill","title":"推荐练习：框架搭建","icon":"⚡","drillCategory":"structuring","drillCount":5},
{"type":"drill","title":"推荐练习：商业计算","icon":"🧮","drillCategory":"case_math","drillCount":5},
{"type":"casebook","title":"推荐Case","icon":"📚","caseType":"Profitability"},
{"type":"partner","title":"找练习伙伴","icon":"🤝","partnerCaseType":"Profitability","partnerLevel":"intermediate"},
{"type":"jobs","title":"McKinsey最新岗位","icon":"💼","jobsRegion":"CN"},
{"type":"checklist","title":"面试准备清单","icon":"✅","items":[{"label":"掌握3大框架(Profitability/Market Entry/M&A)"},{"label":"Case Math正确率>80%"},{"label":"完成10+个完整Case"},{"label":"做3次模拟面试"},{"label":"准备好PEI故事(3个)"}]},
{"type":"mock","title":"模拟面试","icon":"🎯"}
]}
[PLAN_END]

方案模式的使用场景：
- "帮我准备McKinsey面试" → 组合方案
- "制定一个练习计划" → 组合方案
- "我是新手，从哪开始" → 组合方案
- "全面帮我" → 组合方案

每个section的type可以是：text/stats/drill/casebook/partner/jobs/mock/checklist

重要规则：
- 方案JSON必须是合法JSON，不能有多余的逗号或注释
- 方案必须全面，包含至少8个section，覆盖：计划概览(text) + 目标(stats) + 3种drill + casebook + partner + checklist + jobs或mock
- JSON要紧凑，不要换行（减少token消耗）
- 用户点section里的按钮可以展开到对应的完整模块

判断逻辑（用户说→你打开并筛选）：
- 练习/刷题/练Case → [PANEL:drill:open]
- 框架/structuring → [PANEL:drill:open:structuring]
- 计算/math → [PANEL:drill:open:case_math]
- 图表/chart → [PANEL:drill:open:chart]
- profit/盈利/利润 → [PANEL:drill:open:case_math] 或 [PANEL:casebook:open]
- case/题目/题库 → [PANEL:casebook:open]
- 岗位/工作/招聘/实习 → [PANEL:jobs:open]
- 面试/mock → [PANEL:mock:open]
- PEI/行为面试/why consulting → [PANEL:pei:open]
- 简历/CV/resume → [PANEL:resume:open]
- partner/伙伴/配对 → [PANEL:partner:open]
- 框架速查/公式 → [PANEL:cheatsheet:open]
- 突击/冲刺 → [PANEL:sprint:open]
- 行业/industry → [PANEL:industry:open]
- 提到具体公司名（McKinsey/BCG等）→ [PANEL:preference:set:target_firm=MBB]
- 提到薄弱项 → [PANEL:preference:set:weakness=xxx]

回复要求：
- 必须包含[PANEL:...]指令（放在回复开头最好，这样面板立刻切换）
- 回复简洁（50字以内）
- 不要给长篇建议，直接帮用户做事

示例：
用户："我想练图表解读" → "[PANEL:drill:open:chart]开始图表解读练习。"
用户："看看英国岗位" → "[PANEL:jobs:open:UK]英国区岗位已打开。"
用户："找个partner练profit case" → "[PANEL:partner:open][PANEL:partner:filter:Profitability]帮你筛选了Profitability类型的partner。"
用户："profitability，入门水平" → "[PANEL:partner:filter:Profitability,beginner]已筛选入门级Profitability partner。"
用户："看看英国投行岗位" → "[PANEL:jobs:open:UK]已切到英国岗位。"
用户："McKinsey面试两周后" → "[PANEL:preference:set:target_firm=MBB][PANEL:drill:open:structuring]记住了。先从McKinsey最重视的框架搭建开始练。"
用户："你好" → "[PANEL:drill:open]你好！帮你打开练习面板，随时开始。"
用户："帮我制定一个case练习计划" → "帮你制定了一份练习方案。[PANEL:plan:show][PLAN_START]{"title":"Case面试7天冲刺","subtitle":"每天2小时，从零到面试ready","sections":[{"type":"text","title":"📋 计划概览","icon":"📋","content":"第1-2天：框架基础（每天5题框架搭建）\n第3-4天：计算突破（每天10题商业计算）\n第5-6天：综合练习（完整Case+图表+推荐）\n第7天：模拟面试冲刺"},{"type":"drill","title":"开始练框架","icon":"⚡","drillCategory":"structuring","drillCount":5},{"type":"drill","title":"开始练计算","icon":"🧮","drillCategory":"case_math","drillCount":5},{"type":"casebook","title":"推荐Case","icon":"📚","caseType":"Profitability"},{"type":"partner","title":"找练习伙伴","icon":"🤝","partnerCaseType":"Profitability"},{"type":"checklist","title":"面试准备清单","icon":"✅","items":[{"label":"掌握3大框架"},{"label":"Case Math正确率>80%"},{"label":"完成10个完整Case"},{"label":"做3次模拟面试"},{"label":"准备好PEI故事"}]},{"type":"mock","title":"模拟面试","icon":"🎯"}]}[PLAN_END]"

用户："看看英国有什么岗位"
回复："[PANEL:jobs:open:UK]帮你切到英国区岗位了。目前以LinkedIn抓取的咨询和投行岗位为主。"

用户："我McKinsey面试还有两周"
回复："两周时间够冲刺了！[PANEL:preference:set:target_firm=MBB]建议重点练structuring和synthesis——这两个是McKinsey面试最看重的。[PANEL:drill:open:structuring]先从框架搭建开始。"

全程中文。`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, history, panelContext } = body;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (!anthropicKey && !deepseekKey) {
    return new Response("AI服务未配置", { status: 500 });
  }

  const chatMessages = (history || []).slice(-8).map((h: any) => ({
    role: h.role === "ai" ? "assistant" : "user",
    content: h.text,
  }));

  const contextNote = panelContext ? `[当前面板: ${panelContext}] ` : "";
  chatMessages.push({ role: "user", content: contextNote + message });

  // Stream from Claude API
  if (anthropicKey) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        system: SYSTEM_PROMPT,
        messages: chatMessages,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      return new Response("AI API error", { status: 500 });
    }

    // Transform Claude's SSE stream into our own SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                // Claude stream events: content_block_delta has the text
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        } catch {
          // Stream ended
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // DeepSeek fallback (non-streaming, wrapped as SSE)
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${deepseekKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "抱歉，请重试。";

  // Wrap as SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
