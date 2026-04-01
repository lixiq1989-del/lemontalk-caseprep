"use client";

import { useState } from "react";

const PEI_QUESTIONS = [
  {
    id: "why_consulting",
    category: "动机类",
    question: "Why consulting? / 为什么想做咨询？",
    tips: ["展示对咨询本质的理解（问题解决、影响力）", "结合具体经历说明为什么适合", "展现长期职业规划的合理性"],
    structure: "过去经历 → 产生兴趣的具体时刻 → 咨询能帮你实现什么目标",
    example: "在XX实习时，我发现公司的战略决策缺乏数据支撑，导致...这让我意识到咨询顾问的价值在于...",
  },
  {
    id: "why_firm",
    category: "动机类",
    question: "Why this firm? / 为什么选择我们公司？",
    tips: ["具体说出1-2个你真正了解的该公司特点", "避免说'排名第一'这种空话", "结合你的职业目标说为什么match"],
    structure: "公司特色（具体） → 与你的匹配点 → 你能贡献什么",
    example: "McKinsey在零售和消费品领域的深度让我印象深刻，尤其是...这与我在XX的背景高度契合...",
  },
  {
    id: "leadership",
    category: "领导力",
    question: "Tell me about a time you led a team through a challenge.",
    tips: ["选择有实质性困难的经历，不要选'太顺'的", "强调你具体做了什么（而不是团队做了什么）", "量化结果"],
    structure: "S: 情境与挑战 → T: 你的角色 → A: 具体行动（3步） → R: 量化结果",
    example: "",
  },
  {
    id: "failure",
    category: "成长类",
    question: "Tell me about a time you failed. / 说一个失败的经历。",
    tips: ["选真实的失败，不要说'其实成功了'的假失败", "重点在reflection和grown，而不是辩解", "展示你如何改变行为"],
    structure: "情境 → 决策/行动 → 失败结果 → 我的反思 → 改变了什么",
    example: "",
  },
  {
    id: "conflict",
    category: "协作类",
    question: "Tell me about a time you had a conflict with a colleague.",
    tips: ["不要把对方描述成坏人", "展示你主动解决冲突的能力", "结果要是双赢或学到东西"],
    structure: "背景 → 冲突起因 → 你如何主动沟通 → 结果",
    example: "",
  },
  {
    id: "impact",
    category: "影响力",
    question: "Tell me about your greatest achievement.",
    tips: ["量化影响力（%、$、人数）", "选与咨询相关的：分析、说服、结构化问题解决", "STAR结构清晰"],
    structure: "背景规模 → 你的具体贡献 → 量化结果 → 为什么重要",
    example: "",
  },
];

type Phase = "list" | "practice" | "feedback";

interface PeiModuleProps {
  initialQuestionId?: string;
}

export default function PeiModule({ initialQuestionId }: PeiModuleProps) {
  const initialQ = initialQuestionId
    ? PEI_QUESTIONS.find(q => q.id === initialQuestionId) || PEI_QUESTIONS[0]
    : PEI_QUESTIONS[0];
  const [selectedQ, setSelectedQ] = useState(initialQ);
  const [phase, setPhase] = useState<Phase>(initialQuestionId ? "practice" : "list");
  const [myAnswer, setMyAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIFeedback = async () => {
    if (!myAnswer.trim()) return;
    setLoading(true);
    setAiFeedback("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          message: `我在练习PEI行为面试题：「${selectedQ.question}」

我的回答：
${myAnswer}

请按以下维度给出反馈（中文，简洁实用）：
1. **STAR结构** - 是否清晰？缺少哪个环节？
2. **具体性** - 有没有足够具体的细节和量化数据？
3. **亮点** - 这个回答最强的地方
4. **改进建议** - 最重要的1-2个改进点，给出具体修改示例`,
          history: [],
        }),
      });
      const data = await res.json();
      setAiFeedback(data.response || "");
      setPhase("feedback");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "list") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold">PEI 行为面试练习</h1>
        </div>

        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 mb-6 text-sm text-amber-800">
          💡 PEI (Personal Experience Interview) 是MBB必考环节，占面试权重约50%。选一道题，写下你的回答，AI给你专业反馈。
        </div>

        <div className="space-y-3">
          {PEI_QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => { setSelectedQ(q); setMyAnswer(""); setAiFeedback(""); setPhase("practice"); }}
              className="w-full text-left border border-border rounded-xl p-5 bg-white hover:border-primary hover:bg-blue-50/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 inline-block">
                    {q.category}
                  </span>
                  <p className="font-medium text-sm">{q.question}</p>
                </div>
                <span className="text-primary text-sm shrink-0">练习 →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "practice" || phase === "feedback") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setPhase("list")} className="text-muted hover:text-primary text-sm">← 返回题目列表</button>
        </div>

        {/* Question */}
        <div className="border border-border rounded-xl p-5 bg-white mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 inline-block">
            {selectedQ.category}
          </span>
          <h2 className="font-semibold text-base mb-4">{selectedQ.question}</h2>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-blue-800 mb-1">回答要点</p>
            <ul className="text-xs text-blue-700 space-y-0.5">
              {selectedQ.tips.map((t, i) => <li key={i}>• {t}</li>)}
            </ul>
          </div>

          {/* Structure */}
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-800 mb-1">推荐结构（STAR）</p>
            <p className="text-xs text-green-700">{selectedQ.structure}</p>
          </div>
        </div>

        {/* Answer input */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">你的回答</label>
          <textarea
            value={myAnswer}
            onChange={(e) => setMyAnswer(e.target.value)}
            placeholder="用中文或英文写下你的回答，建议2-3分钟的讲述长度（200-400字）..."
            rows={10}
            className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted">{myAnswer.length} 字</span>
            <button
              onClick={getAIFeedback}
              disabled={!myAnswer.trim() || loading}
              className="bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {loading ? "AI分析中..." : "获取 AI 反馈"}
            </button>
          </div>
        </div>

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="border border-green-200 bg-green-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-green-800 mb-3">🤖 AI 反馈</h3>
            <div className="text-sm text-green-900 whitespace-pre-wrap leading-relaxed">{aiFeedback}</div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { setMyAnswer(""); setAiFeedback(""); setPhase("practice"); }}
                className="border border-green-300 text-green-700 rounded-lg px-4 py-2 text-xs hover:bg-green-100"
              >
                重新作答
              </button>
              <button
                onClick={() => { setSelectedQ(PEI_QUESTIONS[(PEI_QUESTIONS.findIndex(q => q.id === selectedQ.id) + 1) % PEI_QUESTIONS.length]); setMyAnswer(""); setAiFeedback(""); setPhase("practice"); }}
                className="bg-green-600 text-white rounded-lg px-4 py-2 text-xs hover:bg-green-700"
              >
                下一题 →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
