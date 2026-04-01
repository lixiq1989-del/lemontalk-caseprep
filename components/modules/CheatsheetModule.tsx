"use client";

import { useState } from "react";

type Category = "frameworks" | "formulas" | "industry" | "tips";

interface CheatSheet {
  title: string;
  items: { label: string; content: string }[];
}

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "frameworks", label: "常用框架", icon: "🧩" },
  { key: "formulas", label: "数学公式", icon: "🔢" },
  { key: "industry", label: "行业数据", icon: "📊" },
  { key: "tips", label: "面试Tips", icon: "💡" },
];

const CHEATSHEETS: Record<Category, CheatSheet> = {
  frameworks: {
    title: "常用框架",
    items: [
      {
        label: "Profitability 框架",
        content: `Profit = Revenue - Cost

Revenue（收入）
├── Price（价格）
└── Volume（销量）
    ├── 市场规模 × 市场份额
    └── 新客户 vs 老客户

Cost（成本）
├── Fixed Cost（固定成本）
│   ├── 租金
│   ├── 人员薪资
│   └── 设备折旧
└── Variable Cost（可变成本）
    ├── 原材料
    ├── 运输物流
    └── 销售佣金`,
      },
      {
        label: "Market Entry 框架",
        content: `四大分析维度：

1️⃣ Market Attractiveness（市场吸引力）
   • 市场规模 & 增长率
   • 利润率水平
   • 客户需求趋势

2️⃣ Competitive Landscape（竞争格局）
   • 主要玩家 & 市场份额
   • 进入壁垒
   • 替代品威胁

3️⃣ Company Capabilities（公司能力）
   • 核心竞争力可迁移性
   • 资金/资源充足度
   • 品牌/渠道优势

4️⃣ Entry Mode（进入方式）
   • 自建 Greenfield（高控制，慢速度）
   • 收购 Acquisition（快速度，高成本）
   • 合资 JV（共担风险，低控制）
   • 授权 Licensing（轻资产，依赖他方）`,
      },
      {
        label: "M&A 框架",
        content: `四步分析法：

1️⃣ Strategic Rationale（战略价值）
   • 协同效应：收入协同 + 成本协同
   • 战略缺口填补
   • 市场地位提升

2️⃣ Target Evaluation（目标评估）
   • 财务表现（收入、利润、现金流）
   • 市场地位和竞争优势
   • 管理团队和企业文化
   • 关键风险和负债

3️⃣ Valuation（估值）
   • DCF（折现现金流）
   • 可比公司法（EV/EBITDA, P/E）
   • 可比交易法

4️⃣ Integration（整合）
   • 文化融合
   • 组织架构调整
   • 系统和流程整合
   • 客户和人才保留`,
      },
      {
        label: "Pricing 框架",
        content: `三种定价策略：

1️⃣ Cost-based（成本导向）
   • 成本 + 目标利润率
   • 适用：大宗商品、成本透明的行业
   • 优点：简单直接
   • 缺点：忽略客户价值感知

2️⃣ Competition-based（竞争导向）
   • 参考竞争对手定价
   • 溢价/平价/折价策略
   • 适用：成熟市场、同质化产品
   • 注意：避免价格战

3️⃣ Value-based（价值导向）
   • 基于客户感知价值定价
   • WTP（Willingness to Pay）分析
   • 适用：差异化产品、B2B
   • 最优策略，利润空间最大`,
      },
      {
        label: "Growth Strategy 框架",
        content: `两大增长路径：

🟢 Organic Growth（有机增长）
├── Product（产品维度）
│   • 现有产品改进
│   • 新产品开发
│   • 产品线延伸
├── Market（市场维度）
│   • 现有市场深耕
│   • 新地理市场
│   • 新客户群体
└── Channel（渠道维度）
    • 线上渠道拓展
    • 新分销合作
    • 直销 vs 分销

🔵 Inorganic Growth（非有机增长）
├── M&A（并购）
│   • 完全控制，快速获取能力
├── Joint Venture（合资）
│   • 共担风险，共享资源
└── Strategic Alliance（战略联盟）
    • 轻资产，灵活合作`,
      },
    ],
  },
  formulas: {
    title: "数学公式",
    items: [
      {
        label: "Break-even（盈亏平衡点）",
        content: `公式：Break-even Volume = Fixed Cost / (Price - Variable Cost)

举例：
固定成本 = 100万/年
售价 = 50元/件
可变成本 = 30元/件
盈亏平衡 = 1,000,000 / (50 - 30) = 50,000 件

💡 含义：至少卖5万件才能覆盖成本`,
      },
      {
        label: "ROI（投资回报率）",
        content: `公式：ROI = (Gain - Cost) / Cost × 100%

举例：
投资成本 = 200万
获得收益 = 300万
ROI = (300 - 200) / 200 × 100% = 50%

💡 ROI > 0 即为正回报，越高越好`,
      },
      {
        label: "Market Share（市场份额）",
        content: `公式：Market Share = Company Revenue / Total Market Revenue × 100%

举例：
公司营收 = 5亿
市场总规模 = 100亿
Market Share = 5 / 100 × 100% = 5%

💡 也可以用销量/总销量来算`,
      },
      {
        label: "CAGR（复合年增长率）",
        content: `公式：CAGR = (End Value / Start Value)^(1/n) - 1

举例：
5年前营收 = 100亿
当前营收 = 200亿
CAGR = (200/100)^(1/5) - 1 ≈ 15%

💡 快速估算：72法则
翻倍时间 ≈ 72 / 增长率(%)
增长率10% → 约7.2年翻倍`,
      },
      {
        label: "Payback Period（回收期）",
        content: `公式：Payback Period = Total Investment / Annual Cash Flow

举例：
总投资 = 1000万
每年净现金流 = 250万
回收期 = 1000 / 250 = 4 年

💡 回收期越短越好，通常3-5年可接受`,
      },
    ],
  },
  industry: {
    title: "行业数据",
    items: [
      {
        label: "人口数据",
        content: `🌍 全球人口：~80亿

🇺🇸 美国
• 总人口：~330M（3.3亿）
• 家庭数：~130M（1.3亿）
• 平均家庭人数：2.5人

🇨🇳 中国
• 总人口：~1.4B（14亿）
• 城镇人口：~65%
• 家庭数：~500M（5亿）

🇪🇺 欧盟：~450M
🇮🇳 印度：~1.4B
🇯🇵 日本：~125M`,
      },
      {
        label: "全球市场规模",
        content: `📊 主要行业市场规模（年度）

• 全球航空市场：~$800B
• 全球咨询市场：~$300B
• 全球制药市场：~$1.5T
• 全球零售市场：~$25T
• 全球电商市场：~$6T
• 全球汽车市场：~$3T
• 全球云计算市场：~$500B
• 全球快消 (FMCG)：~$12T`,
      },
      {
        label: "GDP数据",
        content: `💰 主要经济体 GDP

🇺🇸 美国：~$25T
🇨🇳 中国：~$18T（约120万亿人民币）
🇯🇵 日本：~$4T
🇩🇪 德国：~$4T
🇬🇧 英国：~$3T
🇮🇳 印度：~$3.5T

🌍 全球 GDP：~$100T

💡 人均GDP速算：
美国 ~$75,000
中国 ~$13,000`,
      },
      {
        label: "常用换算",
        content: `📐 面试中常用数字

时间：
• 1年 ≈ 365天 ≈ 52周 ≈ 12个月
• 1天 ≈ 24小时 = 1,440分钟 = 86,400秒

距离/面积：
• 1英里 ≈ 1.6公里
• 1平方英里 ≈ 2.6平方公里

货币：
• $1 ≈ ¥7（人民币）
• $1 ≈ €0.9（欧元）

数量级：
• Million (M) = 百万 = 10^6
• Billion (B) = 十亿 = 10^9
• Trillion (T) = 万亿 = 10^12`,
      },
    ],
  },
  tips: {
    title: "面试Tips",
    items: [
      {
        label: "开头：确认问题",
        content: `🎯 拿到Case的第一步

1. 复述问题
   "让我确认一下理解..."

2. 确认关键信息
   • 客户是谁？什么行业？
   • 核心问题是什么？
   • 目标是什么？（定量/定性）
   • 时间框架？
   • 地理范围？

3. 争取思考时间
   "给我一分钟整理一下分析框架"

⚠️ 千万不要直接开始分析！`,
      },
      {
        label: "框架：MECE原则",
        content: `🧩 搭建框架的关键

MECE = Mutually Exclusive, Collectively Exhaustive
（相互独立，完全穷尽）

✅ 正确做法：
1. 先说出框架名称或分析维度
2. 列出2-4个bucket（太多记不住）
3. 简单解释每个维度分析什么
4. 征求面试官意见后深入

❌ 错误做法：
• 生搬硬套教科书框架
• 列出5个以上维度（太散）
• 框架和问题不匹配

💡 最好的框架是根据具体问题定制的`,
      },
      {
        label: "分析：先说结论",
        content: `📊 回答问题的结构

用 Pyramid Principle（金字塔原理）：

结论先行
├── 原因1 + 数据支撑
├── 原因2 + 数据支撑
└── 原因3 + 数据支撑

举例：
❌ "我们来看收入，收入是价格乘以销量，价格没变，销量下降了20%，所以问题在销量..."
✅ "利润下降的主要原因是销量下降了20%。具体来看..."

💡 面试官时间有限，先给结论再展开`,
      },
      {
        label: "数学：大声计算",
        content: `🔢 Case数学的关键

1. 大声说出过程
   不要闷头算！说出每一步
   "5万件 × 20元 = 100万"

2. 简化数字
   330M → 用 300M 算
   $4.99 → 用 $5 算

3. 写下来
   不要心算太多步
   写在纸上，清晰标注单位

4. Sanity Check
   算完检查结果是否合理
   "平均每人每天花$10在咖啡上，这合理吗？"

5. 常见坑
   • 百万/十亿搞混
   • 忘记单位转换
   • 百分比加减错误（30%降到20%是降了10个百分点）`,
      },
      {
        label: "结尾：30秒总结",
        content: `🏁 Case结尾的完美收官

"CEO电梯演讲"格式（30秒内）：

1. 结论（5秒）
   "我建议客户进入泰国市场"

2. 关键原因（15秒）
   "基于三个原因：
   第一，市场增长快（年增15%）
   第二，竞争对手少
   第三，公司有可迁移的核心能力"

3. 建议行动（5秒）
   "建议以合资方式进入，降低风险"

4. 风险/下一步（5秒）
   "主要风险是政策变化，建议进一步研究法规环境"

💡 即使面试官没要求，也要主动给出总结！`,
      },
    ],
  },
};

interface CheatsheetModuleProps {
  initialCategory?: string;
}

export default function CheatsheetModule({ initialCategory }: CheatsheetModuleProps) {
  const [activeCategory, setActiveCategory] = useState<Category>((initialCategory as Category) || "frameworks");
  const [expandedItem, setExpandedItem] = useState<number>(0);

  const sheet = CHEATSHEETS[activeCategory];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-48 shrink-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setExpandedItem(0);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-gray-50 hover:text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-4">{sheet.title}</h2>
          <div className="space-y-3">
            {sheet.items.map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors text-left"
                >
                  <span>{item.label}</span>
                  <span
                    className={`text-muted transition-transform ${
                      expandedItem === i ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedItem === i && (
                  <div className="px-5 pb-4 border-t border-border">
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap text-foreground pt-3 font-[inherit]">
                      {item.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
