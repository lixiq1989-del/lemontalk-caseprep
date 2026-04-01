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

const QA_SYSTEM = `你是一位资深咨询顾问，专门帮助学生准备Case Interview。
- 回答要简洁实用，直接可用
- 用具体例子说明，不说废话
- 全程中文
- 每次回复200字以内`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { type, message, history } = body;

    if (!message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ response: "AI服务未配置，请联系管理员。" });
    }

    const systemPrompt = type === "mock" ? MOCK_SYSTEM : QA_SYSTEM;

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    const recentHistory = (history || []).slice(-6);
    for (const h of recentHistory) {
      messages.push({
        role: h.role === "ai" ? "assistant" : "user",
        content: h.text,
      });
    }
    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
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
