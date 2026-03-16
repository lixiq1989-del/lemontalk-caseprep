"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "ai" | "user"; text: string };

const SUGGESTED_QUESTIONS = [
  "什么是Market Entry框架？",
  "Profitability分析怎么做？",
  "如何做Market Sizing？",
  "M&A的估值方法有哪些？",
  "怎么做Brainstorming？",
  "Case面试常见陷阱",
];

const QA_PAIRS: Record<string, string> = {
  "什么是Market Entry框架？": `Market Entry（市场进入）框架帮助分析一家公司是否应该进入一个新市场。核心分四个维度：

📊 **1. 市场吸引力 (Market Attractiveness)**
- 市场规模和增长率
- 利润率水平
- 客户需求和痛点

🏢 **2. 竞争格局 (Competitive Landscape)**
- 现有玩家数量和市场集中度
- 进入壁垒（资金、技术、品牌、渠道）
- 替代品威胁

💪 **3. 公司能力 (Company Capabilities)**
- 核心竞争力是否可迁移
- 资金和资源是否充足
- 品牌和渠道优势

🚀 **4. 进入方式 (Entry Mode)**
- 自建 (Greenfield)：完全控制，但投入大、速度慢
- 收购 (Acquisition)：速度快，但价格高、整合风险
- 合资 (Joint Venture)：共享风险，但控制力弱
- 战略联盟/授权 (Alliance/Licensing)：轻资产，但依赖合作方

💡 使用技巧：不需要每个维度都深入，根据Case的关键问题聚焦2-3个最重要的维度。`,

  "Profitability分析怎么做？": `Profitability（盈利能力）分析是最常见的Case类型。核心公式：

📐 **基本公式**
Profit = Revenue - Cost
Revenue = Price × Volume
Cost = Fixed Cost + Variable Cost

📈 **收入端分析 (Revenue)**
- Price（价格）：定价策略变化？竞争导致价格下降？
- Volume（销量）：市场份额变化？客户流失？新客户获取？
- Mix（产品组合）：高利润vs低利润产品的占比变化？

📉 **成本端分析 (Cost)**
- Fixed Cost（固定成本）：租金、人员、设备折旧
- Variable Cost（可变成本）：原材料、运输、销售佣金
- 注意规模效应和成本结构变化

🔍 **分析步骤**
1. 先确认问题范围：是利润下降还是利润率下降？从什么时候开始？
2. 画出利润树 (Profit Tree)
3. 通过提问获取数据，逐层拆解
4. 定位根本原因
5. 提出解决方案并量化影响

⚠️ 常见错误：不要一上来就猜原因，要系统性地拆解！`,

  "如何做Market Sizing？": `Market Sizing（市场估算）考察的是结构化思维和数学能力。

🧮 **两种基本方法**

**需求端 (Demand-side)**
从消费者出发：人口 × 使用率 × 频次 × 单价
例：中国咖啡市场 = 14亿人 × 30%喝咖啡 × 每周2杯 × 52周 × 25元/杯

**供给端 (Supply-side)**
从供给方出发：门店数 × 日均销量 × 单价 × 365天
例：咖啡市场 = 15万家店 × 200杯/天 × 25元 × 365天

📋 **答题步骤**
1. **明确范围**：什么产品？哪个地区？哪一年？收入还是数量？
2. **选择方法**：需求端or供给端（最好两种交叉验证）
3. **搭建框架**：画出计算公式树
4. **做出假设**：每个变量给出合理假设，说明理由
5. **计算**：大声说出过程，用整数简化
6. **Sanity Check**：结果是否合理？用其他方式验证

💡 **关键技巧**
- 数字取整方便计算（用3亿而不是3.3亿）
- 分segment估算更准确（城市vs农村，年龄段）
- 准备常用数字：中国14亿人，美国3.3亿人，中国GDP约120万亿
- 结果给一个范围，不要只给一个精确数字`,

  "M&A的估值方法有哪些？": `M&A（并购）中常用的估值方法有三种：

💰 **1. DCF（折现现金流法）**
- 预测未来5-10年自由现金流 (FCF)
- 用加权平均资本成本 (WACC) 折现
- 计算终值 (Terminal Value)
- 企业价值 = 折现FCF之和 + 折现终值
- 适用：现金流稳定可预测的公司

📊 **2. 可比公司法 (Comparable Companies)**
- 找到同行业、类似规模的上市公司
- 用EV/EBITDA、P/E、EV/Revenue等倍数
- 将倍数应用到目标公司的财务指标
- 适用：有足够多可比公司的情况

🤝 **3. 可比交易法 (Precedent Transactions)**
- 找到同行业近期的M&A交易
- 分析这些交易的估值倍数
- 通常包含控制权溢价 (Control Premium)
- 适用：分析收购方应该支付的合理价格

📐 **M&A分析框架**
1. **战略价值**：为什么要收购？协同效应在哪？
2. **目标评估**：财务表现、市场地位、管理团队
3. **估值**：用以上方法确定合理价格区间
4. **整合**：文化融合、业务整合、成本协同

⚠️ 面试中通常不需要做完整DCF，但要知道方法论和适用场景。`,

  "怎么做Brainstorming？": `Brainstorming（头脑风暴）是Case面试中的创意类题目，考察思维广度和结构化能力。

🧠 **常见题型**
- "如何增加收入？"
- "这个产品可以有哪些新功能？"
- "为什么销量下降了？列出可能原因"
- "如何提高客户满意度？"

📋 **答题结构 - 用Bucket法**
把想法分成3-4个类别（Bucket），每个类别下2-3个具体想法。

例："如何增加星巴克的收入？"

**Bucket 1: 提高客单价**
- 推出高端产品线
- 增加食品搭配套餐
- 会员升级服务

**Bucket 2: 增加客户数量**
- 进入三四线城市
- 针对学生群体推出平价线
- 外卖平台深度合作

**Bucket 3: 提高购买频次**
- 限时促销活动
- 积分翻倍日
- 季节限定产品制造话题

**Bucket 4: 新业务拓展**
- 零售包装咖啡（超市渠道）
- 企业定制服务
- 咖啡课程和体验

💡 **关键技巧**
1. 先说清楚你的分类维度
2. 从最有影响力的bucket开始
3. 想法要具体，不要太抽象
4. 最后优先排序：推荐最值得做的2-3个
5. 用MECE原则确保不遗漏`,

  "Case面试常见陷阱": `Case面试中有很多容易踩的坑，提前了解可以避免很多失误：

❌ **1. 没有确认问题就开始分析**
- 正确做法：复述问题，确认范围、目标和时间框架
- "让我确认一下，客户的目标是在两年内将利润率提高5个百分点，对吗？"

❌ **2. 生搬硬套框架**
- 正确做法：根据具体问题定制框架
- 面试官一眼能看出你在背模板

❌ **3. 沉默太久**
- 正确做法：思考时说出你的思路
- "我在考虑从几个维度来分析..."

❌ **4. 计算不说过程**
- 正确做法：大声说出每步计算
- 面试官要看你的思路，不只是答案

❌ **5. 忽略面试官的引导**
- 面试官的追问往往是提示
- 如果他反复问某个方向，说明那里有重要发现

❌ **6. 没有优先级**
- 正确做法：分析后要排序
- "这三个因素中，我认为最重要的是...因为..."

❌ **7. 结尾没有总结**
- 正确做法：用30秒做CEO-level的总结
- 结论 → 关键原因 → 建议行动 → 风险和下一步

❌ **8. 数学粗心**
- 百万和十亿的零写错
- 百分比方向搞反
- 正确做法：写下来，检查一遍

💡 **面试官最看重的能力**
1. 结构化思维（不是背框架，而是自己搭结构）
2. 商业直觉（能提出有洞察的假设）
3. 数据敏感度（能从数据中发现问题）
4. 沟通能力（清晰、简洁、有逻辑）`,
};

// Fallback response for unmatched questions
function getResponse(question: string): string {
  // Check for exact match
  if (QA_PAIRS[question]) return QA_PAIRS[question];

  // Keyword matching
  const lower = question.toLowerCase();
  if (lower.includes("market entry") || lower.includes("市场进入"))
    return QA_PAIRS["什么是Market Entry框架？"];
  if (lower.includes("profitability") || lower.includes("盈利") || lower.includes("利润"))
    return QA_PAIRS["Profitability分析怎么做？"];
  if (lower.includes("market sizing") || lower.includes("估算") || lower.includes("市场规模"))
    return QA_PAIRS["如何做Market Sizing？"];
  if (lower.includes("m&a") || lower.includes("并购") || lower.includes("估值") || lower.includes("收购"))
    return QA_PAIRS["M&A的估值方法有哪些？"];
  if (lower.includes("brainstorm") || lower.includes("头脑风暴") || lower.includes("创意"))
    return QA_PAIRS["怎么做Brainstorming？"];
  if (lower.includes("陷阱") || lower.includes("错误") || lower.includes("注意") || lower.includes("技巧"))
    return QA_PAIRS["Case面试常见陷阱"];

  return `这是个好问题！以下是一些相关的思路：

1. 在Case面试中，最重要的是展现结构化思维能力
2. 建议从问题的核心出发，搭建分析框架
3. 用数据支撑你的论点，用逻辑推导你的结论

💡 你也可以试试左边的推荐问题，获取更详细的框架讲解。

如果你想深入了解某个具体话题，请告诉我：
- 具体的Case类型（Profitability、Market Entry等）
- 面试技巧和注意事项
- 数学计算方法
- 行业知识`;
}

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "你好！我是Case面试AI助手 👋\n\n你可以问我任何关于Case面试的问题，比如框架怎么用、分析思路、面试技巧等。\n\n试试点击下方的推荐问题开始吧！",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function ask(question: string) {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const answer = getResponse(question);
      setMessages((prev) => [...prev, { role: "ai", text: answer }]);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <Link
          href="/ai"
          className="text-muted text-sm hover:text-primary transition-colors"
        >
          ← 返回 AI 助手
        </Link>
        <h1 className="text-lg font-bold mt-1">💡 Case 问答</h1>
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
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-muted">
              思考中...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="shrink-0 flex flex-wrap gap-2 pb-3">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input.trim()) ask(input.trim());
              }
            }}
            placeholder="输入你的问题..."
            className="flex-1 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={() => input.trim() && ask(input.trim())}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
