"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "ai" | "user"; text: string };

const CASE_TYPES = [
  { key: "profitability", label: "Profitability" },
  { key: "market-entry", label: "Market Entry" },
  { key: "pricing", label: "Pricing" },
  { key: "ma", label: "M&A" },
  { key: "market-sizing", label: "Market Sizing" },
] as const;

type CaseType = (typeof CASE_TYPES)[number]["key"];

const CASE_PROMPTS: Record<CaseType, string> = {
  profitability:
    "你的客户是一家全国连锁咖啡品牌，过去三年收入持续增长，但利润率在最近一年下降了5个百分点。CEO请我们来找出原因并提出解决方案。\n\n请问你会如何分析这个问题？",
  "market-entry":
    "你的客户是一家中国领先的新能源汽车公司，年营收500亿元。他们正在考虑进入东南亚市场（以泰国为首站）。\n\n请帮客户分析是否应该进入这个市场，以及如何进入。",
  pricing:
    "你的客户是一家SaaS软件公司，为中小企业提供CRM系统。目前采用按月订阅模式，月费299元/用户。竞争对手推出了免费基础版，客户流失率上升了15%。\n\n请帮客户重新制定定价策略。",
  ma: "你的客户是一家大型制药公司，年营收200亿美元。他们正在考虑以50亿美元收购一家专注于基因疗法的生物科技初创公司（年营收2亿美元，尚未盈利）。\n\n请分析这笔收购是否值得进行。",
  "market-sizing":
    "请估算中国一年消耗多少杯外卖咖啡。\n\n请展示你的分析思路和计算过程。",
};

const FOLLOW_UPS: Record<CaseType, string[]> = {
  profitability: [
    "很好的框架。让我给你一些数据：收入增长了20%，但成本增长了35%。你觉得应该先看收入端还是成本端？",
    "好的思路。进一步来看，固定成本增长了50%（主要是新开了30家门店的租金），可变成本中原材料成本上涨了20%。你有什么发现？",
    "分析得不错。那你认为在短期和长期分别应该采取什么措施？请给出具体建议。",
    "很好的建议。请用30秒做一个总结性的推荐，就像你在向CEO汇报一样。",
  ],
  "market-entry": [
    "不错的分析框架。让我补充一些信息：泰国汽车市场规模约300万辆/年，电动车渗透率仅5%，但政府刚出台了电动车补贴政策。你怎么看市场吸引力？",
    "好的分析。目前泰国市场主要玩家是丰田（40%份额）和本田（20%份额），电动车领域比亚迪已经进入。你觉得竞争格局如何？",
    "那关于进入模式，你觉得应该选择独资建厂、合资还是先出口？各有什么优劣？",
    "很好。请给客户一个最终建议，包括是否进入、如何进入、以及关键风险。",
  ],
  pricing: [
    "好的思路。目前的客户分布是：20%大客户贡献60%收入，80%小客户贡献40%收入。流失主要发生在小客户群体。这对你的分析有什么影响？",
    "有道理。如果我们推出免费版，你觉得应该包含哪些功能？付费版又应该保留哪些差异化功能？",
    "好的方案。那你预计这个新定价策略对收入的影响是什么？请做一个简单的量化分析。",
    "请总结你的定价策略建议，包括具体的价格体系和预期效果。",
  ],
  ma: [
    "好的框架。关于战略契合度：客户目前主要依赖传统小分子药物，专利将在3年内到期，预计收入下降30%。基因疗法是下一代治疗方向。这对收购的战略价值有什么影响？",
    "很好的分析。关于估值：目标公司目前有3个药物在临床二期，成功率预计30%，如果成功每个药物年峰值销售额约20亿美元。你觉得50亿的价格合理吗？",
    "有道理。那整合方面你觉得有哪些关键挑战和风险？",
    "请做最终总结：是否建议收购，关键理由，以及主要风险。",
  ],
  "market-sizing": [
    "你的方法论很清晰。不过我想了解一下，你是从需求端还是供给端估算的？有没有考虑过用另一种方法交叉验证？",
    "好的验证思路。你的估算中有哪些关键假设？哪个假设对结果影响最大？",
    "不错的敏感性分析。你的最终估算数字是多少？你对这个数字有多大信心？",
  ],
};

export default function MockInterviewPage() {
  const [caseType, setCaseType] = useState<CaseType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startCase(type: CaseType) {
    setCaseType(type);
    setMessages([{ role: "ai", text: CASE_PROMPTS[type] }]);
    setFollowUpIndex(0);
  }

  function reset() {
    setCaseType(null);
    setMessages([]);
    setInput("");
    setFollowUpIndex(0);
  }

  function send() {
    if (!input.trim() || !caseType) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const followUps = FOLLOW_UPS[caseType];
      let aiText: string;
      if (followUpIndex < followUps.length) {
        aiText = followUps[followUpIndex];
        setFollowUpIndex((i) => i + 1);
      } else {
        aiText =
          "非常好！这个Case就到这里。总体来说你的分析逻辑清晰，框架使用合理。\n\n💡 改进建议：\n1. 可以更主动地提出假设\n2. 数据分析时注意做sensitivity analysis\n3. 最终建议可以更加具体和可执行\n\n点击「重新开始」选择新的Case类型继续练习吧！";
      }
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
      setLoading(false);
    }, 800);
  }

  // Case type selection screen
  if (!caseType) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/ai"
            className="text-muted text-sm hover:text-primary transition-colors"
          >
            ← 返回 AI 助手
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">🎯 AI 模拟面试</h1>
        <p className="text-muted mb-8">选择Case类型开始模拟面试</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CASE_TYPES.map((ct) => (
            <button
              key={ct.key}
              onClick={() => startCase(ct.key)}
              className="card-hover border border-border rounded-xl p-5 text-left cursor-pointer hover:border-primary transition-colors"
            >
              <div className="font-semibold mb-1">{ct.label}</div>
              <div className="text-xs text-muted">点击开始练习</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <Link
            href="/ai"
            className="text-muted text-sm hover:text-primary transition-colors"
          >
            ← 返回 AI 助手
          </Link>
          <h1 className="text-lg font-bold mt-1">
            🎯 模拟面试 —{" "}
            {CASE_TYPES.find((c) => c.key === caseType)?.label}
          </h1>
        </div>
        <button
          onClick={reset}
          className="text-sm px-4 py-2 rounded-lg border border-border text-muted hover:text-danger hover:border-danger transition-colors"
        >
          重新开始
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-gray-100 text-foreground rounded-bl-md"
              }`}
            >
              {msg.role === "ai" && (
                <div className="text-xs font-medium text-muted mb-1">
                  AI 面试官
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-muted">
              AI 正在思考...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border pt-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="输入你的分析..."
            rows={2}
            className="flex-1 border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            发送
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          Shift + Enter 换行，Enter 发送
        </p>
      </div>
    </div>
  );
}
