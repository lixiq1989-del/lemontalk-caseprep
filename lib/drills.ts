// Case drill questions - broken down from full cases into bite-sized practice

export interface DrillQuestion {
  id: number;
  category: string; // framework | math | chart | sizing | judgment | structure
  difficulty: "easy" | "medium" | "hard";
  source: string; // which case it came from
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
  timeLimit: number; // seconds
}

export const DRILL_CATEGORIES = [
  { key: "framework", label: "框架选择", icon: "🧩", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "math", label: "数学速算", icon: "🔢", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { key: "judgment", label: "商业判断", icon: "💡", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "structure", label: "结构化思维", icon: "🌲", color: "bg-green-50 text-green-700 border-green-200" },
  { key: "sizing", label: "Market Sizing", icon: "📊", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { key: "insight", label: "数据洞察", icon: "🔍", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export const DRILLS: DrillQuestion[] = [
  // === Framework 框架选择 ===
  {
    id: 1,
    category: "framework",
    difficulty: "easy",
    source: "Airline Ancillary Revenue",
    question: "一家低成本航空公司想优化附加服务（行李、选座、WiFi）定价。你应该首先用什么框架切入？",
    options: [
      "波特五力分析",
      "定价三维度：成本、竞争、价值",
      "SWOT 分析",
      "BCG 矩阵",
    ],
    answer: 1,
    explanation: "定价问题的核心框架是三维度分析：Cost-Plus（成本加成）、Competitive Benchmarking（竞争对标）、Value-Based Pricing（价值定价）。波特五力和SWOT太宽泛，不够针对性。",
    timeLimit: 30,
  },
  {
    id: 2,
    category: "framework",
    difficulty: "easy",
    source: "Airline Catering Co",
    question: "一家航空餐饮公司利润率从12%降到5%，收入稳定。最合适的分析框架是？",
    options: [
      "市场进入框架",
      "利润 = 收入 - 成本，重点拆成本端",
      "并购估值 DCF",
      "增长战略 Ansoff 矩阵",
    ],
    answer: 1,
    explanation: "收入稳定但利润下降 → 明显是成本端问题。用 Profit = Revenue - Cost 框架，收入端快速排除后，重点深挖成本端各项变化。",
    timeLimit: 25,
  },
  {
    id: 3,
    category: "framework",
    difficulty: "medium",
    source: "Coffee Roaster",
    question: "一家精品咖啡烘焙商想从 B2B（供应餐厅）拓展到 DTC（直接面向消费者）。用什么框架？",
    options: [
      "利润下降分析框架",
      "市场进入框架：市场吸引力 + 自身能力 + 进入策略",
      "运营优化框架",
      "并购协同效应分析",
    ],
    answer: 1,
    explanation: "进入新渠道/新市场 → 经典的 Market Entry 框架。需要评估 DTC 市场规模、竞争格局、公司是否有品牌/渠道能力、以及具体进入方式（自建电商 vs 第三方平台）。",
    timeLimit: 30,
  },
  {
    id: 4,
    category: "framework",
    difficulty: "medium",
    source: "EdTech Merger",
    question: "一家在线教育公司正在考虑收购一家小型 AI 教育创业公司。你会用什么框架分析？",
    options: [
      "定价策略框架",
      "市场规模估算",
      "并购框架：战略匹配 + 估值 + 协同效应 + 风险",
      "客户细分分析",
    ],
    answer: 2,
    explanation: "M&A 题标准框架：1) Strategic Fit（战略匹配度）2) Valuation（估值合理性）3) Synergies（协同效应）4) Risks（整合风险）。",
    timeLimit: 30,
  },
  {
    id: 5,
    category: "framework",
    difficulty: "hard",
    source: "Gym Chain",
    question: "一家健身连锁品牌发现会员续费率从70%降到50%，同时新会员增长也放缓。应该怎么构建分析框架？",
    options: [
      "单一维度分析续费率下降原因",
      "分两条线：留存问题（为什么老会员流失）+ 获客问题（为什么新客减少），再找交叉根因",
      "直接做市场规模估算",
      "波特五力分析竞争格局",
    ],
    answer: 1,
    explanation: "两个问题可能有共同根因（比如竞争加剧、产品老化），也可能是独立问题。分两条线分析后寻找交叉点，是展示结构化思维的好机会。面试官会加分。",
    timeLimit: 35,
  },

  // === Math 数学速算 ===
  {
    id: 6,
    category: "math",
    difficulty: "easy",
    source: "Airline Catering Co",
    question: "航空餐饮公司年收入 $200M，利润率从 12% 降到 5%。利润减少了多少？",
    options: ["$10M", "$14M", "$24M", "$7M"],
    answer: 1,
    explanation: "原利润 = $200M × 12% = $24M，现利润 = $200M × 5% = $10M，减少 $14M。",
    timeLimit: 20,
  },
  {
    id: 7,
    category: "math",
    difficulty: "easy",
    source: "Burger Palace",
    question: "一家汉堡店日均卖 400 个汉堡，客单价 $8，月运营成本 $75,000。月利润是多少？（按30天算）",
    options: ["$21,000", "$16,000", "$96,000", "$25,000"],
    answer: 0,
    explanation: "月收入 = 400 × $8 × 30 = $96,000。月利润 = $96,000 - $75,000 = $21,000。",
    timeLimit: 25,
  },
  {
    id: 8,
    category: "math",
    difficulty: "medium",
    source: "SaaS Acquisition",
    question: "一家 SaaS 公司 ARR $50M，年增长 30%，客户流失率 10%。净新增 ARR 是多少？",
    options: ["$15M", "$10M", "$20M", "$5M"],
    answer: 1,
    explanation: "新增 ARR = $50M × 30% = $15M。流失 ARR = $50M × 10% = $5M。净新增 = $15M - $5M = $10M。",
    timeLimit: 30,
  },
  {
    id: 9,
    category: "math",
    difficulty: "medium",
    source: "Private Equity Retail",
    question: "PE 以 8x EBITDA 收购一家零售商（EBITDA $30M），持有5年后以 10x 退出，EBITDA 增长到 $45M。投资回报倍数是？",
    options: ["1.5x", "1.875x", "2.5x", "3x"],
    answer: 1,
    explanation: "买入价 = 8 × $30M = $240M。卖出价 = 10 × $45M = $450M。回报倍数 = $450M / $240M = 1.875x。",
    timeLimit: 35,
  },
  {
    id: 10,
    category: "math",
    difficulty: "hard",
    source: "Pharma Drug Pricing",
    question: "新药研发成本 $800M，专利期剩 10 年，目标患者群 200,000 人/年，渗透率预计 15%，需要多少年用药费才能收回研发成本？（假设年药价 $20,000/人）",
    options: ["约 1.3 年", "约 2.7 年", "约 4 年", "约 5.3 年"],
    answer: 1,
    explanation: "年患者数 = 200,000 × 15% = 30,000人。年收入 = 30,000 × $20,000 = $600M。无其他成本简化下，$800M / $600M ≈ 1.33年。但考虑实际运营和营销成本（通常占40-50%），净收入约 $300M/年，回收期 ≈ 2.7 年。",
    timeLimit: 45,
  },

  // === Judgment 商业判断 ===
  {
    id: 11,
    category: "judgment",
    difficulty: "easy",
    source: "Plant Based Meat",
    question: "植物肉品牌发现超市渠道销量停滞，但餐饮渠道增长 40%。以下哪个判断最合理？",
    options: [
      "应该放弃超市渠道",
      "消费者在餐厅更愿意尝试新品，超市购买更保守 → 应加强餐饮渠道同时优化超市策略",
      "植物肉市场已经饱和",
      "价格一定是唯一原因",
    ],
    answer: 1,
    explanation: "餐厅场景降低了尝试门槛（不用整包购买），且有厨师加工。超市停滞不代表要放弃，而是要调整策略（试吃、小包装、联名等）。",
    timeLimit: 30,
  },
  {
    id: 12,
    category: "judgment",
    difficulty: "medium",
    source: "Streaming Service",
    question: "一家流媒体平台用户增长 25%，但 ARPU（每用户收入）下降 15%。总收入是涨了还是跌了？",
    options: [
      "涨了，因为用户增长快于 ARPU 下降",
      "跌了，因为 ARPU 下降影响更大",
      "持平",
      "无法判断",
    ],
    answer: 0,
    explanation: "总收入 = 用户数 × ARPU。设原来100用户×$10 = $1000。现在125用户×$8.5 = $1062.5。涨了约 6.25%。快速心算：1.25 × 0.85 = 1.0625。",
    timeLimit: 30,
  },
  {
    id: 13,
    category: "judgment",
    difficulty: "medium",
    source: "Hotel Chain Luxury",
    question: "一家奢华酒店集团考虑推出中端子品牌。最大的风险是什么？",
    options: [
      "中端市场太小",
      "品牌稀释 — 中端子品牌可能损害主品牌的奢华定位",
      "运营成本太高",
      "员工不够",
    ],
    answer: 1,
    explanation: "奢侈品/高端品牌向下延伸的核心风险是品牌稀释（Brand Dilution）。万豪用不同品牌名（Courtyard vs Ritz-Carlton）就是为了避免这个问题。",
    timeLimit: 30,
  },
  {
    id: 14,
    category: "judgment",
    difficulty: "hard",
    source: "Renewable Energy",
    question: "一家传统能源公司投资新能源，短期利润会下降。以下哪个视角最能说服董事会？",
    options: [
      "环保是趋势，必须跟",
      "竞争对手都在投",
      "用 Real Options 思维：现在小额投资相当于买一个看涨期权，锁定未来大规模转型的能力，不投则失去选择权",
      "政府补贴可以覆盖成本",
    ],
    answer: 2,
    explanation: "Real Options 是说服 financial-minded 董事会的最强逻辑：不是赌博，是用小成本保留战略选择权。如果新能源爆发，我们有能力快速扩张；如果没有，损失有限。",
    timeLimit: 40,
  },

  // === Structure 结构化思维 ===
  {
    id: 15,
    category: "structure",
    difficulty: "easy",
    source: "Call Center Efficiency",
    question: "客户要求分析呼叫中心效率低下的问题。以下哪个拆解最 MECE？",
    options: [
      "人员问题 / 系统问题 / 流程问题 / 管理问题",
      "输入（来电量和类型）→ 处理（人员×效率×工具）→ 输出（解决率和满意度）",
      "成本高 / 质量差",
      "内部原因 / 外部原因",
    ],
    answer: 1,
    explanation: "流程视角（输入→处理→输出）是分析运营效率的最佳 MECE 结构。选项A有重叠（管理影响人员和流程），选项C太粗，选项D不够具体。",
    timeLimit: 30,
  },
  {
    id: 16,
    category: "structure",
    difficulty: "medium",
    source: "Food Delivery",
    question: "外卖平台想提高每单利润。以下哪个拆解方式最好？",
    options: [
      "收入高 vs 成本低",
      "每单利润 = 客单价×抽佣率 - 配送成本 - 补贴 - 分摊固定成本，逐项优化",
      "短期措施 vs 长期措施",
      "供给侧 vs 需求侧",
    ],
    answer: 1,
    explanation: "把 unit economics 拆成公式是最清晰的。每个变量都是一个优化杠杆：提高客单价、调整抽佣、优化配送路线降成本、减少补贴等。",
    timeLimit: 35,
  },

  // === Market Sizing ===
  {
    id: 17,
    category: "sizing",
    difficulty: "easy",
    source: "Pet Insurance",
    question: "估算中国宠物保险市场规模。以下哪个思路最合理？",
    options: [
      "中国人口 × 养宠率 × 买保险率 × 年保费",
      "保险公司数量 × 平均保费收入",
      "GDP × 保险渗透率",
      "宠物医院数量 × 平均转化率",
    ],
    answer: 0,
    explanation: "自上而下：14亿人 → 约3亿养宠家庭 → 宠物保险渗透率约1-2%（中国还很低）→ 300-600万份 × 年保费约1000-2000元 = 30-120亿元市场。",
    timeLimit: 30,
  },
  {
    id: 18,
    category: "sizing",
    difficulty: "medium",
    source: "EV Charging",
    question: "估算2025年中国需要多少个公共充电桩？最佳切入角度是？",
    options: [
      "从充电桩制造商产能估算",
      "从电动车保有量出发：车桩比 × 公共占比",
      "从电网负荷估算",
      "从停车场数量估算",
    ],
    answer: 1,
    explanation: "最直接：中国电动车保有量约2500万辆 → 目标车桩比约3:1 → 需约830万个充电桩 → 公共占比约30% → 约250万个公共充电桩。可以和实际数据对比验证。",
    timeLimit: 35,
  },

  // === Insight 数据洞察 ===
  {
    id: 19,
    category: "insight",
    difficulty: "easy",
    source: "Pharmacy Chain",
    question: "连锁药店数据：门店数增长 20%，总收入增长 10%，利润下降 5%。最关键的洞察是？",
    options: [
      "应该继续开店",
      "新店拉低了整体效率 — 同店收入在下降，且扩张成本侵蚀利润",
      "市场在萎缩",
      "药品降价是唯一原因",
    ],
    answer: 1,
    explanation: "门店+20% 但收入只+10% → 同店收入在下降（可能是新店选址不佳或市场饱和）。利润-5% → 扩张带来的固定成本增加超过了收入增长。核心问题是扩张效率。",
    timeLimit: 30,
  },
  {
    id: 20,
    category: "insight",
    difficulty: "hard",
    source: "Insurance Broker",
    question: "保险经纪公司数据：客户数+15%，保费总额+5%，佣金收入-3%。三个数据走势不一致，根因最可能是？",
    options: [
      "员工偷懒了",
      "获客渠道效果差",
      "新客户倾向买低保费产品（拉低均保费），且保险公司下调了佣金率",
      "市场萎缩",
    ],
    answer: 2,
    explanation: "客户+15%但保费只+5% → 单客保费在下降（新客户买小单）。保费+5%但佣金-3% → 佣金率被压缩。两个结构性问题叠加：客户结构恶化 + 佣金率下降。",
    timeLimit: 40,
  },
];

// Shuffle helper
export function shuffleDrills(drills: DrillQuestion[]): DrillQuestion[] {
  const arr = [...drills];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
