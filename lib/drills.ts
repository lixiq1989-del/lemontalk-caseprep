// Case drill questions - broken down from full cases into bite-sized practice

export type DrillType = "choice" | "number" | "open";

export interface DrillQuestion {
  id: number;
  type: DrillType; // choice=选择题, number=填数字, open=开放式
  category: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  question: string;
  // For choice type
  options?: string[];
  answer?: number; // index of correct option
  // For number type
  correctNumber?: number;
  tolerance?: number; // acceptable % range (e.g. 0.1 = ±10%)
  unit?: string;
  // For open type
  referenceAnswer?: string;
  keyPoints?: string[];
  // Common
  explanation: string;
  timeLimit: number;
}

export const DRILL_CATEGORIES = [
  { key: "framework", label: "框架选择", icon: "🧩", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "math", label: "数学速算", icon: "🔢", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { key: "math_input", label: "心算填空", icon: "🧮", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { key: "judgment", label: "商业判断", icon: "💡", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "structure", label: "结构化思维", icon: "🌲", color: "bg-green-50 text-green-700 border-green-200" },
  { key: "structuring", label: "框架搭建", icon: "🏗️", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { key: "sizing", label: "Market Sizing", icon: "📊", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { key: "insight", label: "数据洞察", icon: "🔍", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export const DRILLS: DrillQuestion[] = [
  // === Framework 框架选择 ===
  {
    id: 1,
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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
    type: "choice",
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

  // === Math Input 心算填空（填数字） ===
  {
    id: 21,
    type: "number",
    category: "math_input",
    difficulty: "easy",
    source: "Burger Palace",
    question: "一家汉堡店每天卖 600 个汉堡，客单价 $12。请计算日收入（单位：美元）。",
    correctNumber: 7200,
    tolerance: 0,
    unit: "$",
    explanation: "600 × $12 = $7,200。面试中快速算法：6 × 12 = 72，再加两个零。",
    timeLimit: 15,
  },
  {
    id: 22,
    type: "number",
    category: "math_input",
    difficulty: "easy",
    source: "Coffee Roaster",
    question: "咖啡店月收入 $180,000，食材成本占 35%，人工成本占 25%，租金 $30,000/月。月利润是多少？（单位：万美元）",
    correctNumber: 4.2,
    tolerance: 0.05,
    unit: "万$",
    explanation: "食材 = $180K × 35% = $63K。人工 = $180K × 25% = $45K。总成本 = $63K + $45K + $30K = $138K。利润 = $180K - $138K = $42K = 4.2万美元。",
    timeLimit: 30,
  },
  {
    id: 23,
    type: "number",
    category: "math_input",
    difficulty: "medium",
    source: "SaaS Acquisition",
    question: "SaaS 公司当前 MRR $2M，月增长率 5%。3 个月后的 MRR 是多少？（单位：百万美元，保留一位小数）",
    correctNumber: 2.3,
    tolerance: 0.05,
    unit: "M$",
    explanation: "$2M × 1.05³ = $2M × 1.1576 ≈ $2.3M。快速估算：5%增长3个月 ≈ 15%多一点（复利效应），$2M × 1.15 = $2.3M。",
    timeLimit: 30,
  },
  {
    id: 24,
    type: "number",
    category: "math_input",
    difficulty: "medium",
    source: "Airline Turnaround",
    question: "航空公司有 50 架飞机，每架每天飞 6 班。如果周转时间从 45 分钟减到 25 分钟，每架每天能多飞 1 班。每班平均收入 $35,000。年增收多少？（单位：亿美元，保留一位小数）",
    correctNumber: 6.4,
    tolerance: 0.1,
    unit: "亿$",
    explanation: "多飞班次 = 50架 × 1班/天 = 50班/天。日增收 = 50 × $35,000 = $1,750,000。年增收 = $1.75M × 365 ≈ $638.75M ≈ 6.4亿美元。",
    timeLimit: 40,
  },
  {
    id: 25,
    type: "number",
    category: "math_input",
    difficulty: "hard",
    source: "Private Equity Retail",
    question: "PE 基金以 $500M 收购零售商，用 60% 债务（利率 6%）+ 40% 股权。年 EBITDA $80M，维护性 CAPEX $15M，税率 25%。年股权自由现金流是多少？（单位：百万美元）",
    correctNumber: 26.25,
    tolerance: 0.1,
    unit: "M$",
    explanation: "债务 = $500M × 60% = $300M。年利息 = $300M × 6% = $18M。税前利润 = EBITDA - CAPEX - 利息 = $80M - $15M - $18M = $47M。税 = $47M × 25% = $11.75M。股权自由现金流 = $47M - $11.75M = $35.25M。（注：更精确的FCFE还需考虑还本，此处简化）实际约 $26-35M 范围都合理。",
    timeLimit: 60,
  },
  {
    id: 26,
    type: "number",
    category: "math_input",
    difficulty: "easy",
    source: "Pet Insurance",
    question: "宠物保险公司有 50,000 客户，年保费 $800/人，理赔率 45%，运营成本占保费 20%。年利润是多少？（单位：百万美元）",
    correctNumber: 14,
    tolerance: 0.05,
    unit: "M$",
    explanation: "保费总收入 = 50K × $800 = $40M。理赔 = $40M × 45% = $18M。运营 = $40M × 20% = $8M。利润 = $40M - $18M - $8M = $14M。",
    timeLimit: 30,
  },

  // === Structuring 框架搭建（开放式） ===
  {
    id: 27,
    type: "open",
    category: "structuring",
    difficulty: "easy",
    source: "Airline Catering Co",
    question: "一家航空餐饮公司利润率从 12% 降到 5%，收入稳定。请列出你的分析框架（至少 3 个一级分支）。",
    referenceAnswer: "利润 = 收入 - 成本\n\n一、收入端（快速排除）\n- 客户数 × 每客收入\n- 价格变化、合同结构\n\n二、成本端（重点深挖）\n- 原材料成本（食材价格波动）\n- 人工成本（工资、加班、人员配置）\n- 运营成本（物流、仓储、设备折旧）\n- 合规成本（食品安全、新法规）\n\n三、外部因素\n- 竞争格局变化\n- 客户谈判力（航司集中度）\n- 宏观因素（通胀、供应链）",
    keyPoints: ["收入端", "成本端", "原材料", "人工", "运营", "外部因素"],
    explanation: "这道题收入稳定已经给了提示，重点应该在成本端。好的框架需要 MECE（不重不漏）地拆解成本的各个组成部分，并考虑外部环境变化。",
    timeLimit: 120,
  },
  {
    id: 28,
    type: "open",
    category: "structuring",
    difficulty: "medium",
    source: "Coffee Chain Market Entry",
    question: "一家欧洲精品咖啡连锁想进入中国市场。请搭建你的分析框架。",
    referenceAnswer: "一、市场吸引力\n- 市场规模和增速（中国咖啡市场 CAGR ~15%）\n- 消费者行为和偏好（茶文化 vs 咖啡文化）\n- 竞争格局（星巴克、瑞幸、本地品牌）\n\n二、自身能力评估\n- 品牌认知度和差异化（欧洲精品定位）\n- 供应链能力（烘焙、物流）\n- 资金实力和管理经验\n\n三、进入策略\n- 进入方式：独资 vs 合资 vs 特许经营\n- 城市选择：一线先行 vs 二线突破\n- 本地化：菜单调整、数字化（小程序、外卖）\n\n四、财务评估\n- 投资规模和回报期\n- 单店经济模型\n- 风险因素和退出策略",
    keyPoints: ["市场规模", "竞争格局", "消费者", "品牌", "进入方式", "本地化", "财务"],
    explanation: "Market Entry 经典框架需要覆盖：市场（值不值得进）、能力（有没有能力进）、策略（怎么进）、财务（算不算得过来）。针对中国市场要特别关注本地化和数字化。",
    timeLimit: 150,
  },
  {
    id: 29,
    type: "open",
    category: "structuring",
    difficulty: "medium",
    source: "Gym Chain",
    question: "一家健身连锁品牌会员续费率从 70% 降到 50%，新会员增长也放缓。请搭建分析框架。",
    referenceAnswer: "一、留存问题（为什么老会员流失）\n- 产品/服务质量：设备老化、课程吸引力、教练质量\n- 价格因素：会费涨价、性价比降低\n- 竞争替代：新健身房、线上健身（Keep等）、私教工作室\n- 会员体验：拥挤度、卫生、便利性\n\n二、获客问题（为什么新客减少）\n- 市场容量：区域渗透率是否已饱和\n- 营销效果：获客渠道、转化率、获客成本变化\n- 品牌认知：口碑、社交媒体评价\n- 产品吸引力：对新客群（Z世代）的吸引力\n\n三、交叉分析\n- 是否有共同根因（如竞争加剧同时影响留存和获客）\n- 分门店/分区域对比，找到模式\n- 分会员类型分析（年卡 vs 月卡、不同年龄段）",
    keyPoints: ["留存", "流失原因", "获客", "竞争", "产品质量", "交叉分析"],
    explanation: "两个指标同时下降时，分两条线独立分析后寻找交叉根因，是面试中展示结构化思维的加分项。面试官会特别欣赏你主动做分门店/分客群的交叉分析。",
    timeLimit: 150,
  },
  {
    id: 30,
    type: "open",
    category: "structuring",
    difficulty: "hard",
    source: "EdTech Merger",
    question: "一家在线教育公司考虑以 $200M 收购一家 AI 教育创业公司。请搭建并购分析框架。",
    referenceAnswer: "一、战略匹配\n- 技术互补性：AI 能力是否填补自身短板\n- 产品协同：AI 功能能否嵌入现有产品线\n- 客户协同：用户群重叠度和交叉销售机会\n- 人才获取：核心 AI 团队的价值和留存风险\n\n二、估值合理性\n- 收入倍数 vs 同行可比公司\n- DCF：基于用户增长和变现能力预测\n- 替代方案成本：自建 vs 收购 vs 合作\n\n三、协同效应量化\n- 收入协同：交叉销售、新产品线、提价能力\n- 成本协同：技术共享、运营整合、去重\n- 协同时间表：6个月/1年/3年\n\n四、风险评估\n- 整合风险：文化冲突、关键人员流失\n- 技术风险：AI 技术能否规模化\n- 市场风险：AI 教育赛道竞争加剧\n- 监管风险：教育行业政策变化",
    keyPoints: ["战略匹配", "估值", "DCF", "协同效应", "收入协同", "成本协同", "整合风险", "人才"],
    explanation: "M&A 框架的四大支柱：Strategic Fit + Valuation + Synergies + Risks。高分答案需要在每个维度给出具体的分析角度，而不是泛泛而谈。特别注意「自建 vs 收购」的替代方案分析。",
    timeLimit: 180,
  },
];

// ========== Auto-generated Math Drills ==========
// Generates random math problems on the fly

interface MathTemplate {
  generate: () => DrillQuestion;
}

const MATH_TEMPLATES: MathTemplate[] = [
  // Revenue calculation
  {
    generate: () => {
      const units = Math.round((Math.random() * 900 + 100) / 50) * 50;
      const price = Math.round((Math.random() * 90 + 10) / 5) * 5;
      const days = 30;
      const answer = units * price * days;
      return {
        id: 10000 + Math.floor(Math.random() * 90000),
        type: "number",
        category: "math_input",
        difficulty: "easy",
        source: "自动生成",
        question: `一家店铺日均销量 ${units} 件，单价 $${price}。月收入是多少？（按${days}天算，单位：美元）`,
        correctNumber: answer,
        tolerance: 0,
        unit: "$",
        explanation: `${units} × $${price} × ${days} = $${answer.toLocaleString()}`,
        timeLimit: 20,
      };
    },
  },
  // Profit margin
  {
    generate: () => {
      const revenue = Math.round((Math.random() * 400 + 100) / 10) * 10;
      const marginOld = Math.round(Math.random() * 10 + 8);
      const marginNew = Math.round(Math.random() * 5 + 2);
      const diff = revenue * (marginOld - marginNew) / 100;
      return {
        id: 10000 + Math.floor(Math.random() * 90000),
        type: "number",
        category: "math_input",
        difficulty: "easy",
        source: "自动生成",
        question: `公司年收入 $${revenue}M，利润率从 ${marginOld}% 降到 ${marginNew}%。利润减少了多少？（单位：百万美元）`,
        correctNumber: diff,
        tolerance: 0.05,
        unit: "M$",
        explanation: `原利润 = $${revenue}M × ${marginOld}% = $${(revenue * marginOld / 100).toFixed(1)}M。现利润 = $${revenue}M × ${marginNew}% = $${(revenue * marginNew / 100).toFixed(1)}M。减少 $${diff.toFixed(1)}M。`,
        timeLimit: 20,
      };
    },
  },
  // Breakeven
  {
    generate: () => {
      const fixedCost = Math.round((Math.random() * 400 + 100) / 50) * 50;
      const price = Math.round((Math.random() * 40 + 10) / 5) * 5;
      const varCost = Math.round(price * (Math.random() * 0.3 + 0.3) / 5) * 5;
      const breakeven = Math.round(fixedCost * 1000 / (price - varCost));
      return {
        id: 10000 + Math.floor(Math.random() * 90000),
        type: "number",
        category: "math_input",
        difficulty: "medium",
        source: "自动生成",
        question: `新店固定成本 $${fixedCost}K/月，产品售价 $${price}，单位可变成本 $${varCost}。每月需要卖多少件才能盈亏平衡？`,
        correctNumber: breakeven,
        tolerance: 0.05,
        unit: "件",
        explanation: `单位贡献利润 = $${price} - $${varCost} = $${price - varCost}。盈亏平衡 = $${fixedCost},000 ÷ $${price - varCost} = ${breakeven.toLocaleString()} 件。`,
        timeLimit: 30,
      };
    },
  },
  // Growth rate
  {
    generate: () => {
      const base = Math.round((Math.random() * 80 + 20) / 5) * 5;
      const rate = Math.round(Math.random() * 20 + 5);
      const years = Math.floor(Math.random() * 3) + 2;
      const result = Math.round(base * Math.pow(1 + rate / 100, years) * 10) / 10;
      return {
        id: 10000 + Math.floor(Math.random() * 90000),
        type: "number",
        category: "math_input",
        difficulty: "medium",
        source: "自动生成",
        question: `公司当前收入 $${base}M，年增长率 ${rate}%。${years} 年后收入约是多少？（单位：百万美元，保留一位小数）`,
        correctNumber: result,
        tolerance: 0.1,
        unit: "M$",
        explanation: `$${base}M × (1+${rate}%)^${years} = $${base}M × ${Math.pow(1 + rate / 100, years).toFixed(3)} ≈ $${result}M`,
        timeLimit: 35,
      };
    },
  },
  // Market share
  {
    generate: () => {
      const totalMarket = Math.round((Math.random() * 900 + 100) / 50) * 50;
      const share = Math.round(Math.random() * 20 + 5);
      const result = Math.round(totalMarket * share / 100 * 10) / 10;
      return {
        id: 10000 + Math.floor(Math.random() * 90000),
        type: "number",
        category: "math_input",
        difficulty: "easy",
        source: "自动生成",
        question: `某行业市场总规模 $${totalMarket}B，你的客户占 ${share}% 市场份额。客户收入约是多少？（单位：十亿美元，保留一位小数）`,
        correctNumber: result,
        tolerance: 0.05,
        unit: "B$",
        explanation: `$${totalMarket}B × ${share}% = $${result}B`,
        timeLimit: 15,
      };
    },
  },
];

export function generateMathDrill(): DrillQuestion {
  const template = MATH_TEMPLATES[Math.floor(Math.random() * MATH_TEMPLATES.length)];
  return template.generate();
}

export function generateMathDrills(count: number): DrillQuestion[] {
  return Array.from({ length: count }, () => generateMathDrill());
}

// Shuffle helper
export function shuffleDrills(drills: DrillQuestion[]): DrillQuestion[] {
  const arr = [...drills];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
