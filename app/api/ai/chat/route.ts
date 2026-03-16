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

// Simple keyword-based response generator (placeholder for real AI)
function generateMockResponse(message: string, history: ChatMessage[]): string {
  const lower = message.toLowerCase();
  const turnCount = history.filter((m) => m.role === "user").length;

  if (turnCount <= 1) {
    return "好的分析思路。让我给你一些数据来帮助分析。你能把你的框架再展开说说吗？每个维度具体要看什么指标？";
  }

  if (lower.includes("收入") || lower.includes("revenue") || lower.includes("价格") || lower.includes("销量")) {
    return "很好，你提到了收入端。让我告诉你：过去一年收入增长了10%，其中价格没有变化，销量增长了10%。但利润反而下降了，你觉得问题可能在哪？";
  }

  if (lower.includes("成本") || lower.includes("cost") || lower.includes("费用")) {
    return "好的方向。成本端确实有问题：固定成本增长了30%（主要是扩张带来的租金和人员），可变成本增长了15%（原材料涨价）。你觉得应该优先解决哪个？";
  }

  if (lower.includes("建议") || lower.includes("方案") || lower.includes("总结")) {
    return "很好的总结。请用30秒的「电梯演讲」格式做一个最终推荐：结论 → 关键原因 → 建议行动 → 风险和下一步。";
  }

  if (turnCount >= 5) {
    return "非常好的分析！这个Case就到这里。你的表现整体不错，逻辑清晰，框架合理。建议继续保持结构化的分析方式，在数据分析部分可以再深入一些。点击「重新开始」继续练习吧！";
  }

  return "有道理。请继续深入分析，你能用数据来支撑你的观点吗？面试中记住要先说结论再说原因。";
}

function generateQAResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("框架") || lower.includes("framework")) {
    return "Case面试中常用的框架包括：\n\n1. Profitability（盈利能力）：Revenue - Cost\n2. Market Entry（市场进入）：市场吸引力、竞争格局、公司能力、进入方式\n3. M&A（并购）：战略价值、目标评估、估值、整合\n4. Pricing（定价）：成本导向、竞争导向、价值导向\n5. Growth Strategy（增长策略）：有机增长 vs 非有机增长\n\n你想深入了解哪个框架？";
  }

  if (lower.includes("数学") || lower.includes("计算") || lower.includes("公式")) {
    return "Case面试常用公式：\n\n• Break-even = Fixed Cost / (Price - Variable Cost)\n• ROI = (Gain - Cost) / Cost × 100%\n• Market Share = Company Revenue / Total Market Revenue\n• CAGR = (End/Start)^(1/n) - 1\n• Payback Period = Investment / Annual Cash Flow\n\n记住：面试中要大声说出计算过程！";
  }

  if (lower.includes("技巧") || lower.includes("tip") || lower.includes("注意")) {
    return "Case面试核心技巧：\n\n1. 开头：复述问题，确认理解\n2. 框架：说出框架名称，MECE原则\n3. 分析：先说结论，再说原因\n4. 数学：大声说出计算过程\n5. 结尾：30秒总结推荐方案\n\n最重要的是展现结构化思维能力，而不是背框架！";
  }

  return "这是一个好问题！在Case面试中，关键是展现结构化思维和商业直觉。建议你：\n\n1. 先搭建清晰的分析框架\n2. 用数据支撑你的论点\n3. 给出可执行的建议\n\n你可以问我更具体的问题，比如某个框架怎么用，或者某类Case怎么分析。";
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { type, message, history } = body;

    if (!message || !type) {
      return NextResponse.json(
        { error: "Missing required fields: type, message" },
        { status: 400 }
      );
    }

    let response: string;
    if (type === "mock") {
      response = generateMockResponse(message, history || []);
    } else {
      response = generateQAResponse(message);
    }

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
