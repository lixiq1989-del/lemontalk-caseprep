import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

interface ChatRequest {
  type: "mock" | "qa";
  message: string;
  history: ChatMessage[];
}

const MOCK_SYSTEM = `你是一位麦肯锡合伙人，正在主持一场Case Interview。

规则：
- 你只说面试官该说的话，不解释meta信息
- 给出数据时要简洁，一次只给一个challenge
- 学生分析合理时给予肯定但继续追问细节
- 学生分析不当时用"有意思，但..."引导正确方向
- 学生给出最终建议时，给出专业评价并结束面试
- 全程中文，专业但友好
- 每次回复不超过100字`;

const QA_SYSTEM = `你是CasePrep平台的AI助手，帮学生准备咨询面试。你不只是回答问题——你能直接操作页面帮用户完成任务。

规则：
- 回答简洁实用，不超过150字
- 当用户想做某个操作时，不要只"建议"，要直接帮他做——在回复末尾加action标签
- action标签格式：[ACTION:类型:参数]，用户看不到这个标签

可用的action：
- [ACTION:start_drill:structuring] — 开始框架搭建练习
- [ACTION:start_drill:case_math] — 开始商业计算练习
- [ACTION:start_drill:chart] — 开始图表解读练习
- [ACTION:start_drill:creativity] — 开始头脑风暴练习
- [ACTION:start_drill:synthesis] — 开始总结推荐练习
- [ACTION:navigate:/jobs?region=CN] — 跳转到国内岗位（也可以UK/US/HK/SG）
- [ACTION:navigate:/drill] — 跳转到练习页
- [ACTION:navigate:/casebook] — 跳转到Case题库
- [ACTION:navigate:/ai/mock] — 跳转到模拟面试
- [ACTION:navigate:/ai/pei] — 跳转到PEI练习
- [ACTION:set_preference:target_firm=MBB] — 记住用户目标公司
- [ACTION:set_preference:weakness=structuring] — 记住用户薄弱项

示例：
用户："我想练图表解读" → 回复"好，开始图表解读练习。[ACTION:start_drill:chart]"
用户："看看英国的岗位" → 回复"帮你切换到英国岗位。[ACTION:navigate:/jobs?region=UK]"
用户："我McKinsey面试还有两周" → 回复"帮你记住了。建议重点练structuring和synthesis。[ACTION:set_preference:target_firm=MBB]"

全程中文。`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { type, message, history } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use Claude API (better quality, no hallucination) with DeepSeek fallback
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!anthropicKey && !deepseekKey) {
      return NextResponse.json({ response: "AI服务未配置，请联系管理员。" });
    }

    const systemPrompt = type === "mock" ? MOCK_SYSTEM : QA_SYSTEM;

    const recentHistory = (history || []).slice(-6);
    const chatMessages = recentHistory.map((h) => ({
      role: h.role === "ai" ? "assistant" as const : "user" as const,
      content: h.text,
    }));
    chatMessages.push({ role: "user" as const, content: message });

    let response: Response;

    if (anthropicKey) {
      // Claude API
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          system: systemPrompt,
          messages: chatMessages,
          max_tokens: 500,
        }),
      });
    } else {
      // DeepSeek fallback
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: systemPrompt }, ...chatMessages],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    // Claude: data.content[0].text, DeepSeek: data.choices[0].message.content
    const aiResponse =
      data.content?.[0]?.text ||
      data.choices?.[0]?.message?.content ||
      "抱歉，请重新表述你的问题。";

    return NextResponse.json({ response: aiResponse });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({
      response: "系统繁忙，请稍后再试。你可以先思考一下这个问题的分析框架。",
    });
  }
}
