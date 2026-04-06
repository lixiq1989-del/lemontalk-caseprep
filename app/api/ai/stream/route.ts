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

你可以一边回复一边操作右侧面板。在回复文字中间插入面板指令：

面板指令格式：[PANEL:模块:动作:参数]
可用指令：
- [PANEL:drill:open] 打开练习面板
- [PANEL:drill:open:structuring] 打开框架搭建练习
- [PANEL:drill:open:case_math] 打开商业计算练习
- [PANEL:drill:open:chart] 打开图表解读练习
- [PANEL:drill:open:creativity] 打开头脑风暴练习
- [PANEL:drill:open:synthesis] 打开总结推荐练习
- [PANEL:casebook:open] 打开Case题库
- [PANEL:jobs:open] 打开岗位列表
- [PANEL:jobs:open:CN] 打开中国岗位
- [PANEL:jobs:open:UK] 打开英国岗位
- [PANEL:jobs:open:US] 打开美国岗位
- [PANEL:jobs:open:HK] 打开香港岗位
- [PANEL:mock:open] 打开模拟面试
- [PANEL:pei:open] 打开PEI练习
- [PANEL:resume:open] 打开简历优化
- [PANEL:partner:open] 打开Partner配对
- [PANEL:cheatsheet:open] 打开框架速查
- [PANEL:sprint:open] 打开面试突击
- [PANEL:industry:open] 打开行业速查
- [PANEL:preference:set:target_firm=MBB] 记住目标公司
- [PANEL:preference:set:weakness=structuring] 记住薄弱项

使用规则：
- 当用户想做某件事时，在回复中自然地插入面板指令。用户看不到这些指令。
- 指令可以出现在回复的任何位置（开头、中间、结尾都行）
- 一次回复可以有多个指令
- 回复要简洁（100字以内），重点是帮用户做事而非长篇大论

示例：
用户："我想练图表解读"
回复："好的，帮你打开图表解读练习。[PANEL:drill:open:chart]这类题重点是从数据中提炼insight，注意看趋势和异常值。"

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
        max_tokens: 500,
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
      max_tokens: 500,
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
