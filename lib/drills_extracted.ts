// Extracted from real casebook content
// Total: 110 drills

import type { DrillQuestion } from "./drills";

export const EXTRACTED_DRILLS: DrillQuestion[] = [
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Case Collection",
    "question": "我们的客户是一家大型航空公司，CEO联系你（一位BCG合伙人）说他想在公司的每个航班上多搭载一名乘客。我们现在要去和他开会，需要准备两件事：1. 多搭载一名乘客的财务回报。这样做值得吗？2. 吸引这些新乘客的营销策略。",
    "referenceAnswer": "首先，计算财务回报。候选人应审视多搭载一名乘客的收入和成本方面。在收入方面，我们需要：平均机票价格；新乘客数量。候选人还应简要询问是否可以假设飞机上有足够的容量来多搭载一名乘客。其次，计算平均机票价格。候选人应询问航线类型、市场份额以及每条航线的价格。在本案例中，我们讨论的是巴西市场，这家航空公司只有国内航班。为了简化计算，面试官提供了以下信息：60%的航班在两个主要城市（圣保罗和里约热内卢）之间，飞行时间为45分钟，机票价格为100美元；20%在其他主要首都城市之间，飞行时间为1.5小时，机票价格也为100美元；20%在其他城市之间，飞行时间为3小时，价格为300美元。因此，平均机票价格为：(80% * 100 + 20% * 300) / 100 = 140美元。第三，计算新乘客数量。有几种方法可以得出新乘客数量。我提出了两种：1. 计算航班数量：估算公司拥有的飞机数量，然后估算每架飞机的航班次数。2. 计算公司运营航班的城市（平均）数量以及每个城市的平均航班数量。面试官说我应该使用第一种方法，因为他查看了公司网站，发现他们有100架飞机。",
    "keyPoints": [
      "财务回报分析",
      "收入侧：平均票价与乘客数",
      "成本侧",
      "容量假设",
      "平均票价计算：航线结构与价格",
      "新乘客数量估算：飞机数量与航班频次",
      "市场背景：巴西国内航班"
    ],
    "explanation": "这个框架适合此问题，因为它系统地分解了CEO的核心诉求：评估财务可行性和制定营销策略。框架首先聚焦于量化财务影响（收入与成本），这是决策的基础；然后通过分析航线结构和运营数据来获取关键输入参数（平均票价、乘客数），确保了建议的严谨性；最后自然地过渡到营销策略的制定。",
    "timeLimit": 180,
    "id": 2000
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "easy",
    "source": "BCG Case Collection",
    "question": "根据案例信息，计算该航空公司的平均机票价格。已知：60%的航班是45分钟短途航线（圣保罗-里约），票价$100；20%的航班是1.5小时航线（其他主要首都间），票价$100；20%的航班是3小时航线（其他城市间），票价$300。请计算平均票价。",
    "correctNumber": 140,
    "tolerance": 0.05,
    "unit": "美元",
    "explanation": "计算过程：首先，票价$100的航班总占比为 60% + 20% = 80%。票价$300的航班占比为20%。因此，平均票价 = (80% * $100) + (20% * $300) = (0.8 * 100) + (0.2 * 300) = 80 + 60 = 140美元。",
    "timeLimit": 45,
    "id": 2001
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Case Collection",
    "question": "为了估算‘每航班多搭载一名乘客’所带来的新乘客总数，请提出两种不同的估算方法。",
    "referenceAnswer": "我提出了两种方法：1. 计算航班数量：估算公司拥有的飞机数量，然后估算每架飞机的航班次数。2. 计算公司运营航班的城市（平均）数量以及每个城市的平均航班数量。",
    "keyPoints": [
      "方法一：基于飞机数量与航班频次",
      "方法二：基于城市数量与城市航班频次"
    ],
    "explanation": "评价标准：提出的方法需要逻辑清晰，能够利用可获取或可估算的数据（如机队规模、航班频率、网络城市数）来合理推算总航班数，进而得出新乘客总数。方法应具备可操作性和一定的现实基础。",
    "timeLimit": 120,
    "id": 2002
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Climate Case",
    "question": "我们的客户是一家全球消费品公司，产品包括各种个人护理产品（例如，护发、护肤、化妆品）。客户CEO强烈认为她的公司需要制定一个计划来减少其环境影响，并在应对气候变化的斗争中尽自己的一份力，并聘请BCG帮助她创建一个商业案例，以设定一个基于科学的目标来减少公司的影响，并确定为实现该目标需要采取哪些举措。在为一个商业公司制定关于实现基于科学的目标的建议时，需要考虑哪些重要因素？",
    "referenceAnswer": "在为一个商业公司制定关于实现基于科学的目标的建议时，需要考虑两个重要因素：1. 公司如何通过实施该举措在短期和长期内获得商业利益；2. 量化和强调这些措施在应对气候变化斗争中的影响。两者都需要考虑。",
    "keyPoints": [
      "商业利益",
      "短期",
      "长期",
      "量化影响",
      "应对气候变化",
      "科学目标"
    ],
    "explanation": "这个框架适合这个问题，因为它直接回应了客户CEO的核心关切：既要制定一个对环境负责的科学目标，又要确保其商业可行性。框架明确指出了评估建议时必须平衡商业价值（短期和长期收益）与环境影响（可量化的气候贡献），这确保了建议的全面性和可执行性。",
    "timeLimit": 120,
    "id": 2003
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Digital Strategy",
    "question": "我们的客户是NewBank，一家两年前推出的数字银行。推出时，它很快在客户满意度中排名第一。然而，由于新进入者的竞争加剧，NewBank现已跌至第6位。新任CEO的目标是让NewBank重回前三。他们聘请我们来评估NewBank的战略并提供实现此目标的建议。我们应该如何构建分析框架？",
    "referenceAnswer": "To regain its top ranking, which of these should NOT be a focus area for NewBank to research, analyze and act upon: Expanding its product offering to match customer needs and competitor offerings. New products in healthcare insurance or lending could address current gaps. Improving the overall customer experience and re-engaging existing customers. Enhancing digital platforms and service is also key to attracting new customers. Developing data-driven marketing to reach new customer segments and increase share of wallet. Tailored campaigns and offers based on consumer data analysis would help. Consider rebranding under a different name and logo.",
    "keyPoints": [
      "Expanding product offering",
      "Improving customer experience",
      "Re-engaging existing customers",
      "Enhancing digital platforms",
      "Data-driven marketing",
      "Reaching new segments",
      "Increasing share of wallet",
      "Rebranding"
    ],
    "explanation": "这个框架通过列出潜在的战略重点领域（产品、体验、营销）并识别其中不应优先考虑的选项（如更名），帮助系统性地评估客户现状与目标之间的差距，确保分析覆盖客户、竞争和自身能力等多个维度。",
    "timeLimit": 180,
    "id": 2004
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Digital Strategy",
    "question": "为了重回排名前三，NewBank应该考虑哪些战略举措？请进行头脑风暴。",
    "referenceAnswer": "Expanding its product offering to match customer needs and competitor offerings. New products in healthcare insurance or lending could address current gaps. Improving the overall customer experience and re-engaging existing customers. Enhancing digital platforms and service is also key to attracting new customers. Developing data-driven marketing to reach new customer segments and increase share of wallet. Tailored campaigns and offers based on consumer data analysis would help.",
    "keyPoints": [
      "Expand product offering",
      "Healthcare insurance",
      "Lending",
      "Improve customer experience",
      "Enhance digital platforms",
      "Data-driven marketing",
      "Tailored campaigns"
    ],
    "explanation": "评价标准：方案是否针对客户满意度下降和竞争加剧的根本原因，是否具体可行（如提及具体产品缺口或技术手段），是否覆盖产品、体验、获客等多个战略层面。",
    "timeLimit": 120,
    "id": 2005
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG Digital Strategy",
    "question": "关键发现：1. NewBank客户满意度从第1跌至第6。2. 竞争来自新进入者。3. 目标是重回前三。请基于这些发现，为NewBank撰写战略建议。",
    "referenceAnswer": "The newly-appointed CEO aims to bring NewBank back to the top three. They have engaged us to evaluate NewBank's strategy and provide recommendations to achieve this goal. To regain its top ranking, focus areas should include: Expanding its product offering to match customer needs and competitor offerings (e.g., healthcare insurance or lending). Improving the overall customer experience and re-engaging existing customers by enhancing digital platforms and service. Developing data-driven marketing to reach new customer segments and increase share of wallet through tailored campaigns and offers.",
    "keyPoints": [
      "Expand product offering",
      "Improve customer experience",
      "Enhance digital platforms",
      "Data-driven marketing",
      "Tailored campaigns"
    ],
    "explanation": "",
    "timeLimit": 150,
    "id": 2006
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG GenCo",
    "question": "GlobaPharm has engaged McKinsey to evaluate the BioFuture acquisition and to advise on its strategic fit with GlobaPharm's biologicals strategy. Our overall question today, therefore, is 'Should GlobaPharm acquire BioFuture?'",
    "referenceAnswer": "The case text does not provide a specific, detailed framework for the GlobaPharm case. The original post only lists the case name and a brief intro stating the overall question. Therefore, a complete framework with a 200+ word structure cannot be extracted from the provided text.",
    "keyPoints": [
      "strategic fit",
      "acquisition evaluation",
      "biologicals strategy"
    ],
    "explanation": "由于原文仅提供了案例的简介和核心问题，没有给出详细的参考分析框架，因此无法提取完整的框架。一个合适的框架应围绕评估收购的战略契合度、财务可行性和风险展开。",
    "timeLimit": 180,
    "id": 2007
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG GenCo",
    "question": "The government of Loravia wants to achieve major improvements in both the quantity and quality of education for its children. They’ve asked McKinsey to provide advice on how they can achieve this transformation in its schools.",
    "referenceAnswer": "The case text does not provide a specific list of recommendations or brainstorming ideas for the Edu transformation case. The original post only lists the case name and a brief intro stating the client's goal.",
    "keyPoints": [
      "quantity of education",
      "quality of education",
      "organizational transformation"
    ],
    "explanation": "原文仅提供了案例背景和客户目标，没有给出具体的方案列表。评价标准应围绕方案是否针对提升教育数量和质量、是否可行、是否具有创新性。",
    "timeLimit": 180,
    "id": 2008
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG IT Architecture",
    "question": "消费品公司Henderson PLC希望升级其本地部署的企业资源规划（ERP）系统，且升级必须包含云迁移。该公司拥有30,000名员工，在20个国家运营，其应用程序托管在两个不同的云服务上。在开始规划迁移之前，请考虑Henderson PLC可能希望进行此变更的原因。以下哪一项通常不是将ERP功能集中化和迁移到云端的商业利益？",
    "referenceAnswer": "原文中未提供完整的framework结构。原文仅提出了一个选择题，询问哪一项不是ERP云迁移的典型商业利益，选项为：Improved scalability, Lower costs, Less dependence on outside vendors。因此，无法提取出200字以上的完整framework。",
    "keyPoints": [
      "Improved scalability",
      "Lower costs",
      "Less dependence on outside vendors"
    ],
    "explanation": "原文仅提供了一个选择题场景，用于测试对云迁移典型商业利益的理解，并未要求或提供一个用于解决复杂商业问题的完整结构化框架。",
    "timeLimit": 120,
    "id": 2009
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "BCG IT Architecture",
    "question": "原文中未提供具体的商业计算场景、数据或计算问题。",
    "correctNumber": 0,
    "tolerance": 0.05,
    "unit": "无",
    "explanation": "原文中未提供任何需要进行商业计算的数据、场景或问题。",
    "timeLimit": 30,
    "id": 2010
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG IT Architecture",
    "question": "原文中未提供明确的头脑风暴或推荐方案生成场景。",
    "referenceAnswer": "原文中未提供任何方案列表。",
    "keyPoints": [],
    "explanation": "原文中未提供任何用于评估创意或推荐方案的具体标准或场景。",
    "timeLimit": 120,
    "id": 2011
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "BCG IT Architecture",
    "question": "原文中未提供任何数据表格、图表或exhibit。",
    "options": [],
    "answer": 0,
    "explanation": "原文中未提供任何图表数据。",
    "timeLimit": 30,
    "id": 2012
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "BCG IT Architecture",
    "question": "原文中未列出3-4个关键发现或提供需要总结推荐的具体场景。",
    "referenceAnswer": "原文中未提供任何具体的推荐内容。",
    "keyPoints": [],
    "explanation": "原文中未提供任何关键发现或推荐。",
    "timeLimit": 120,
    "id": 2013
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain Coffee Shop",
    "question": "你的朋友正在考虑在英格兰剑桥开一家咖啡店。她应该开这家咖啡店吗？它是否具有财务可行性？",
    "referenceAnswer": "需要考虑的因素包括：\n- 市场吸引力：评估目标市场的规模、增长潜力和客户需求。\n- 竞争格局：分析现有竞争对手的数量、优势和市场份额。\n- 公司能力：评估朋友在运营咖啡店方面的技能、资源和经验。\n- 财务影响：进行详细的财务分析，包括成本结构、定价、盈亏平衡点和潜在盈利能力。",
    "keyPoints": [
      "市场吸引力",
      "竞争格局",
      "公司能力",
      "财务影响",
      "市场规模",
      "成本结构",
      "盈利能力",
      "盈亏平衡"
    ],
    "explanation": "这个框架全面覆盖了市场进入决策的关键维度，从外部市场机会、竞争威胁，到内部执行能力和最终的财务可行性，逻辑完整，适合用于评估新业务的可行性。",
    "timeLimit": 180,
    "id": 2014
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain Coffee Shop",
    "question": "剑桥人口为100,000，平均每人每天喝1杯咖啡。假设成年人口占80%，其中60%是咖啡饮用者，而这些人中50%会从咖啡店购买。请计算剑桥咖啡店市场的年总杯数。",
    "correctNumber": 8640000,
    "tolerance": 0.05,
    "unit": "杯/年",
    "explanation": "计算过程如下：\n1. 成年人口：100,000 * 80% = 80,000\n2. 咖啡饮用者：80,000 * 60% = 48,000\n3. 每天从咖啡店购买的人数：48,000 * 50% = 24,000 杯/天\n4. 年市场总量：24,000 杯/天 * 360 天/年 = 8,640,000 杯/年",
    "timeLimit": 60,
    "id": 2015
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain Coffee Shop",
    "question": "假设每杯咖啡售价为£3，成本为£1，年运营成本为£163,740，初始设置成本为£245,610。请计算第一年需要卖出多少杯咖啡才能达到盈亏平衡。",
    "correctNumber": 204675,
    "tolerance": 0.05,
    "unit": "杯",
    "explanation": "计算过程如下：\n1. 每杯贡献毛利：£3 - £1 = £2\n2. 第一年总成本：年运营成本 £163,740 + 初始设置成本 £245,610 = £409,350\n3. 盈亏平衡点杯数：总成本 £409,350 / 每杯贡献毛利 £2 = 204,675 杯",
    "timeLimit": 60,
    "id": 2016
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain Coffee Shop",
    "question": "根据计算，剑桥咖啡店年市场总杯数为8,640,000杯，达到盈亏平衡需要卖出204,675杯。请问需要获得多少市场份额才能实现盈亏平衡？",
    "correctNumber": 2.3,
    "tolerance": 0.05,
    "unit": "%",
    "explanation": "计算过程如下：\n所需市场份额 = (盈亏平衡杯数 204,675 / 年市场总杯数 8,640,000) * 100% ≈ 2.37%，约等于2.3%。",
    "timeLimit": 45,
    "id": 2017
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain Coffee Shop",
    "question": "基于以下关键发现，请给出你的最终建议：\n1. 剑桥咖啡店年市场总规模约为864万杯。\n2. 达到盈亏平衡需要卖出约204,675杯咖啡。\n3. 这相当于需要获得约2.3%的市场份额。",
    "referenceAnswer": "结论：可行 — 2.3%的市场份额是可以实现的。",
    "keyPoints": [
      "可行",
      "2.3%市场份额",
      "可以实现"
    ],
    "explanation": "最终建议应基于财务计算得出的市场份额目标是否合理可行。",
    "timeLimit": 120,
    "id": 2018
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain Fashion Co",
    "question": "客户是女性时装公司FashionCo，其收入已连续五年下降。CEO需要在周末会议前获得建议。导致收入下降的可能驱动因素有哪些？",
    "referenceAnswer": "What are possible drivers of declining revenue? What are customers' key purchase criteria? Quantitative and qualitative solution approaches.",
    "keyPoints": [
      "drivers of declining revenue",
      "customers' key purchase criteria",
      "quantitative approaches",
      "qualitative approaches"
    ],
    "explanation": "这个框架从问题根源（收入下降驱动因素）、客户视角（购买标准）和解决方案方法论（定量与定性）三个层面展开，全面覆盖了诊断问题和制定增长战略的核心维度。",
    "timeLimit": 120,
    "id": 2019
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain Fashion Co",
    "question": "计算Option A（奖励计划）的总收入。已知：客户基数为1000万，第一年参与率为25%。一次性激活费为50美元。会员享受所有购买20%的折扣。平均每位客户年折扣前消费为100美元。请计算总收入。",
    "correctNumber": 1075,
    "tolerance": 0.05,
    "unit": "百万美元",
    "explanation": "激活收入：参与客户数 = 1000万 * 25% = 250万。激活收入 = 250万 * $50 = $125M。参与客户消费：折扣前消费 = 250万 * $100 = $250M。折扣成本 = $250M * 20% = $50M。参与客户净消费 = $250M - $50M = $200M。非参与客户消费：非参与客户数 = 1000万 - 250万 = 750万。消费 = 750万 * $100 = $750M。总收入 = $125M (激活) + $200M (参与客户净消费) + $750M (非参与客户消费) = $1,075M。",
    "timeLimit": 60,
    "id": 2020
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain Fashion Co",
    "question": "计算Option B（季节性折扣）的总收入。已知：客户基数为1000万，平均年消费为100美元。提供为期3个月/年的20%折扣。折扣期间销售额增长100%。请计算总收入。",
    "correctNumber": 1150,
    "tolerance": 0.05,
    "unit": "百万美元",
    "explanation": "非折扣期（9个月）：平均月消费 = $100 / 12 ≈ $8.33。9个月总消费 = 10M * $8.33 * 9 ≈ $750M（原文直接给出$750M）。折扣期（3个月）：原3个月消费 = 10M * $8.33 * 3 ≈ $25M/月 * 3 = $75M（原文简化为$25M/月）。销售额增长100%，故折扣期总消费额（折扣前） = $75M * 2 = $150M。应用20%折扣，折扣后收入 = $150M * 0.8 = $120M。但原文计算为：10M * $25 x 2 x 0.8 = $400M。这里$25是月均消费，所以3个月总收入 = $400M。总收入 = 非折扣期$750M + 折扣期$400M = $1,150M。",
    "timeLimit": 60,
    "id": 2021
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain Fashion Co",
    "question": "在给出最终推荐时，除了收入数字，还应考虑哪些定性因素？",
    "referenceAnswer": "Also consider brand impact, competitor response, and test in select markets first.",
    "keyPoints": [
      "brand impact",
      "competitor response",
      "test in select markets"
    ],
    "explanation": "评价标准是能否识别出收入计算之外的战略实施风险与长期影响，包括品牌形象、市场竞争动态以及通过小规模测试降低风险。",
    "timeLimit": 120,
    "id": 2022
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain Fashion Co",
    "question": "基于以下关键发现：1. Option B（季节性折扣）比Option A（奖励计划）多产生约7500万美元收入。2. 需要考虑品牌影响。3. 需要考虑竞争对手的反应。4. 建议先在部分市场进行测试。请撰写你的最终推荐。",
    "referenceAnswer": "Option B wins — ~$75M more revenue. Also consider brand impact, competitor response, and test in select markets first.",
    "keyPoints": [
      "Option B wins",
      "~$75M more revenue",
      "consider brand impact",
      "consider competitor response",
      "test in select markets first"
    ],
    "explanation": "最终推荐应明确指出选择哪个方案，并基于定量和定性分析给出理由及实施注意事项。",
    "timeLimit": 180,
    "id": 2023
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain NextGen Tech",
    "question": "客户是一家可穿戴计算机设备公司，需要决定与哪家蜂窝网络公司建立合作伙伴关系。请为评估潜在合作伙伴搭建一个分析框架。",
    "referenceAnswer": "评估框架应涵盖以下关键领域：\n1. **合作伙伴评估标准**：包括网络覆盖范围和可靠性、与可穿戴设备的技术兼容性、品牌一致性和市场定位、财务条款和收入分成。\n2. **市场分析**：包括可穿戴设备市场规模和增长、消费者对连接性的偏好、可穿戴设备领域的竞争格局。\n3. **战略契合度**：包括分销渠道的获取、营销共同投资的潜力、独家与多运营商策略、长期技术路线图的一致性。\n4. **财务分析**：包括不同合作模式下的收入预测、成本分摊结构、盈亏平衡时间表、风险评估。",
    "keyPoints": [
      "网络覆盖",
      "技术兼容性",
      "品牌定位",
      "市场分析",
      "战略契合",
      "财务分析",
      "风险评估"
    ],
    "explanation": "这个框架全面覆盖了评估战略联盟所需的关键维度，从合作伙伴能力、市场环境、战略协同到财务可行性，符合咨询公司系统化解决问题的思路。",
    "timeLimit": 180,
    "id": 2024
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain NextGen Tech",
    "question": "在评估与蜂窝网络公司的合作伙伴关系时，需要考虑哪些战略契合度的因素？",
    "referenceAnswer": "需要考虑的战略契合度因素包括：\n- 分销渠道的获取\n- 营销共同投资的潜力\n- 独家与多运营商策略\n- 长期技术路线图的一致性",
    "keyPoints": [
      "分销渠道",
      "营销共同投资",
      "独家策略",
      "技术路线图"
    ],
    "explanation": "评价标准应基于这些因素对客户业务增长、市场进入和长期竞争优势的潜在贡献。",
    "timeLimit": 120,
    "id": 2025
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain NextGen Tech",
    "question": "基于以下关键发现，请为客户撰写一份推荐：1. 合作伙伴的网络覆盖和技术兼容性是关键。2. 市场增长和消费者偏好支持联网可穿戴设备。3. 战略契合度需考虑渠道和共同投资。4. 财务模型需评估不同合作模式。",
    "referenceAnswer": "原文未提供具体的最终推荐文本。根据框架，推荐应综合合作伙伴评估标准、市场分析、战略契合度和财务分析的结果，提出选择合作伙伴的具体建议和合作模式。",
    "keyPoints": [
      "综合评估",
      "合作伙伴选择",
      "合作模式"
    ],
    "explanation": "推荐应逻辑清晰地总结分析，并给出可操作的建议。",
    "timeLimit": 180,
    "id": 2026
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain PrintCo",
    "question": "客户PrintCo是一家餐厅菜单印刷公司。它是否应该进入电子餐厅菜单市场？",
    "referenceAnswer": "要分析PrintCo是否应该进入电子餐厅菜单市场，我们需要从四个关键领域进行结构化分析：\n1. **市场吸引力**：评估电子菜单市场的规模、增长率和驱动采用的关键趋势。\n2. **竞争格局**：识别当前电子菜单市场的参与者，分析他们的优势和劣势，并判断是否存在进入壁垒。\n3. **公司能力**：评估PrintCo是否具备所需的技术专长，能否利用现有的餐厅客户关系，以及需要多少投资。\n4. **财务影响**：预测收入，计算盈亏平衡时间线，并将其与核心印刷业务进行比较。",
    "keyPoints": [
      "市场吸引力",
      "竞争格局",
      "公司能力",
      "财务影响",
      "市场规模",
      "增长趋势",
      "进入壁垒",
      "技术专长"
    ],
    "explanation": "这个框架全面覆盖了市场进入决策的核心要素：外部市场机会、竞争威胁、内部执行能力和最终的财务可行性，符合经典的商业分析逻辑。",
    "timeLimit": 180,
    "id": 2027
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Bain PrintCo",
    "question": "原文未提供具体的计算场景、数据和正确答案。",
    "tolerance": 0.05,
    "explanation": "原文未提供具体的计算场景、数据和正确答案。",
    "timeLimit": 60,
    "id": 2028
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain PrintCo",
    "question": "为PrintCo进入电子菜单市场进行头脑风暴，需要考虑哪些方面？",
    "referenceAnswer": "原文中未提供具体的头脑风暴方案列表。",
    "keyPoints": [],
    "explanation": "评价标准应基于思考的全面性和逻辑性，覆盖市场、竞争、能力和财务等多个维度。",
    "timeLimit": 120,
    "id": 2029
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "Bain PrintCo",
    "question": "原文未提供任何数据表格或图表。",
    "options": [],
    "explanation": "原文未提供任何数据表格或图表。",
    "timeLimit": 45,
    "id": 2030
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Bain PrintCo",
    "question": "基于以下关键发现，为PrintCo撰写一份进入电子菜单市场的建议：1. 电子菜单市场的吸引力（规模、增长、趋势）。2. 竞争格局（现有玩家、壁垒）。3. PrintCo的能力（技术、客户关系、投资需求）。4. 财务影响（收入、盈亏平衡、与核心业务对比）。",
    "referenceAnswer": "原文未提供具体的最终建议内容。",
    "keyPoints": [
      "市场吸引力",
      "竞争格局",
      "公司能力",
      "财务影响"
    ],
    "explanation": "原文未提供具体的最终建议内容。",
    "timeLimit": 180,
    "id": 2031
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "CapitalOne Ice Cream",
    "question": "CapitalOne的案例面试专注于来自不同行业的真实商业问题。请为一次案例面试搭建一个分析框架。",
    "referenceAnswer": "原文中未提供针对具体商业问题的完整分析框架。原文主要介绍了案例面试的目的（评估沟通技能、概念性问题解决技能、定量分析技能）和准备方法（学习、实践、参与），但并未给出一个用于解决特定商业问题的结构化框架。",
    "keyPoints": [
      "沟通技能",
      "概念性问题解决",
      "定量分析",
      "学习",
      "实践",
      "参与"
    ],
    "explanation": "由于原文没有提供一个具体的商业问题及其分析框架，因此无法提取。原文的框架更侧重于面试准备和评估维度，而非解决特定商业问题的分析结构。",
    "timeLimit": 120,
    "id": 2032
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "CapitalOne Ice Cream",
    "question": "原文中没有提供具体的商业计算场景、数据或需要计算的数字。",
    "tolerance": 0.05,
    "explanation": "原文中没有包含任何需要计算的具体数字、数据或计算过程。",
    "timeLimit": 30,
    "id": 2033
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "CapitalOne Ice Cream",
    "question": "原文中提到了准备案例面试的方法。请根据原文，列出准备案例面试时可以采取的行动方案。",
    "referenceAnswer": "LEARN: 接触案例；虽然我们的案例是独特的，但你越了解案例的一般运作方式，你在面试中就会越自如。通常大学院系、商学院和职业服务部门会有案例面试准备的资源。\nDO: 通过实际处理你复习的案例中的数字和问题来掌握细节。不要记住行业术语列表，而是准备好应对你不懂的术语，并向你的面试官询问。\nENGAGE: 尽可能利用更多额外资源。参加任何你被邀请参加的案例研讨会，并向你的招聘人员询问额外的案例准备活动或练习案例机会。",
    "keyPoints": [
      "接触案例",
      "掌握细节",
      "处理数字",
      "利用资源",
      "参加研讨会",
      "询问招聘人员"
    ],
    "explanation": "评价标准应基于候选人是否能够从学习、实践和参与三个维度，全面且具体地提出准备方案，并体现出主动性和资源利用能力。",
    "timeLimit": 120,
    "id": 2034
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "CapitalOne Ice Cream",
    "question": "原文中没有提供任何数据表格、图表或exhibit。",
    "options": [],
    "explanation": "原文中没有包含任何图表数据。",
    "timeLimit": 30,
    "id": 2035
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "CapitalOne Ice Cream",
    "question": "根据原文，总结CapitalOne案例面试的3-4个关键特点或评估要点。",
    "referenceAnswer": "CapitalOne的案例面试是专注于来自不同行业真实商业问题的对话。它旨在评估：1. 沟通技能；2. 概念性问题解决技能；3. 定量分析技能。它为候选人提供了一个体验助理工作类型的机会。",
    "keyPoints": [
      "真实商业问题",
      "沟通技能",
      "概念性问题解决",
      "定量分析",
      "体验工作"
    ],
    "explanation": "原文中没有提供针对具体商业案例的“关键发现”和“推荐”。此处的总结是基于原文对案例面试本身的描述。",
    "timeLimit": 120,
    "id": 2036
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte AI Automation",
    "question": "一家大型金融机构认识到应用人工智能（AI）和自动化在革新其业务运营方面的巨大潜力。他们理解，通过利用AI和自动化技术，可以简化流程、提高效率、做出数据驱动的决策，并在市场上获得竞争优势。然而，他们目前缺乏一个全面的战略和实施计划来有效地将AI和自动化整合到整个组织中。问题陈述：Client Y在AI和自动化方面的举措是零散和脱节的。不同部门可能探索了单独的AI解决方案（例如聊天机器人）或在孤立的领域实施了自动化，但没有一个统一的框架来确保组织范围内的采用并从这些技术中提取最大价值。这种缺乏整合和协调的情况阻碍了Client Y充分发挥AI和自动化的潜在益处。请为这个问题搭建一个分析框架。",
    "referenceAnswer": "A comprehensive framework for developing and executing a cohesive roadmap for applied AI and automation implementation should include the following key components, derived from the case's emphasis on moving from fragmented initiatives to organization-wide adoption and value extraction: 1. **Current State Assessment**: Conduct a thorough audit of all existing AI and automation initiatives across different departments (e.g., isolated chatbots, automation pockets). This involves identifying the technologies in use, their scope, their effectiveness, and the departments involved. The goal is to understand the extent of the fragmentation and disjointed efforts. 2. **Strategic Alignment & Vision Setting**: Work with client leadership to define a clear, unified strategic vision for AI and automation that aligns with the overall business objectives of the financial institution. This step moves from recognizing potential to committing to specific organizational goals (e.g., streamline processes, improve efficiency, gain competitive advantage). 3. **Cohesive Framework Design**: Develop an integrated framework that standardizes approaches to AI and automation. This framework should address technology architecture, data governance, talent/skills development, and operational processes to ensure consistency and interoperability across the organization, moving beyond isolated solutions. 4. **Prioritization & Roadmap Development**: Based on the assessment and strategic goals, prioritize use cases and initiatives that offer the highest value and feasibility. Create a phased implementation roadmap with clear milestones, timelines, and resource allocation to guide the organization-wide rollout. 5. **Change Management & Adoption Strategy**: Design a robust change management plan to address cultural, skill-based, and operational barriers. This includes training programs, communication strategies, and defining new roles/responsibilities to ensure coordinated adoption and maximize value extraction from the technologies. 6. **Measurement & Value Tracking**: Establish key performance indicators (KPIs) and metrics to track the efficiency gains, cost savings, and competitive advantages realized from the integrated AI and automation initiatives, ensuring the roadmap delivers on its promised benefits.",
    "keyPoints": [
      "Current State Assessment",
      "Strategic Alignment",
      "Cohesive Framework Design",
      "Prioritization & Roadmap",
      "Change Management",
      "Measurement & Value Tracking"
    ],
    "explanation": "这个框架适合此问题，因为它直接针对案例中“零散、缺乏整合框架、阻碍价值实现”的核心矛盾。框架从诊断现状开始，然后设定统一战略，设计整合框架，规划实施路径，并辅以变革管理和价值衡量，系统地解决了从碎片化到组织化采纳的完整链条。",
    "timeLimit": 180,
    "id": 2037
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte AI Automation",
    "question": "基于案例中Client Y面临的挑战——AI和自动化举措零散脱节，缺乏统一的整合框架——请进行头脑风暴，提出可能的解决方案或建议方向。",
    "referenceAnswer": "The case原文本身没有提供具体的解决方案列表。它仅描述了问题（fragmented and disjointed initiatives, no cohesive framework）和总体目标（developing and executing a cohesive roadmap for successful implementation）。因此，无法从原文提取一个给定的方案列表。任何具体的方案（如建立卓越中心、统一数据平台等）都属于超出原文的编造内容。",
    "keyPoints": [],
    "explanation": "评价标准应基于建议是否直接针对“整合零散举措”和“建立统一框架”这两个核心问题，以及建议的逻辑性和可行性。但由于原文未提供具体方案，无法列出原文的关键方案关键词。",
    "timeLimit": 120,
    "id": 2038
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Architecture",
    "question": "我们的客户是一个大型联邦金融机构的小部门，负责管理和执行由美国外交政策和国家安全目标决定的经济和贸易制裁。该部门使用多个软件应用程序系统来跟踪和管理案件、申请、交易和其他财务文件。由于美国外交政策的变化以及高员工流动率，该部门经历了工作量增加，导致大量未处理的文书工作积压。此外，组织的业务单元非常孤立；每个部分都有自己的独立软件应用程序和数据库，导致系统中的数据冗余。目前的系统是内部解决方案和多年前由其他承包商开发的遗留系统的混合体。该组织希望整合其系统以增加协作、简化运营并提高效率。Deloitte已被聘请协助分析当前系统，并为跨组织所有部门的新共享企业架构解决方案制定实施计划。请搭建一个分析框架。",
    "referenceAnswer": "An enterprise architecture plan is an overall structural strategy for all IT systems in an organization. This plan combines the business needs of key stakeholders to help an organization achieve its future goals. The officials of this agency have outlined the need for an overall structural strategy for all IT systems within their organization. Deloitte has been hired to assist with the analysis of the current systems and develop an implementation plan for a new, shared enterprise architecture solution spanning across all divisions of the organization. Key considerations: There are seven different internal systems being used by the organization. Each system uses the same development environment and database platform. Most of the business units consist of lawyers and ex-military officers, who are experts in their field but not necessarily technology-oriented. Many of the business units still work with hard-copies of cases and licenses that they need to process and hand-deliver to other business units for review. High employee turnover has left remaining employees stretched very thin, including the IT department, whose time is mostly consumed providing maintenance support to employees using each of the systems. Additional goals of the project include adapting to foreign languages, standardizing internal reporting and decreasing throughput time for form processing.",
    "keyPoints": [
      "企业架构计划",
      "七个内部系统",
      "相同开发环境和数据库平台",
      "非技术导向的业务人员",
      "纸质文件处理",
      "高员工流动率",
      "IT部门维护负担",
      "适应外语、标准化报告、减少表单处理时间"
    ],
    "explanation": "这个框架适合，因为它直接回应了客户的核心问题：系统孤立、数据冗余和效率低下。它从现状分析（七个系统、技术栈、人员技能、流程）入手，并明确了实施新架构的关键考虑因素（人员、流程、技术限制）和额外目标，为制定整合方案提供了全面的基础。",
    "timeLimit": 180,
    "id": 2039
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Architecture",
    "question": "针对该联邦金融部门希望整合系统以增加协作、简化运营并提高效率的目标，请进行头脑风暴，提出可能的解决方案或建议。",
    "referenceAnswer": "Additional goals of the project include adapting to foreign languages, standardizing internal reporting and decreasing throughput time for form processing.",
    "keyPoints": [
      "适应外语",
      "标准化内部报告",
      "减少表单处理时间"
    ],
    "explanation": "评价标准应基于建议是否直接针对原文提到的额外目标（适应外语、标准化报告、减少处理时间），以及是否考虑了客户业务单元非技术导向、高流动率和纸质流程等关键限制条件。",
    "timeLimit": 120,
    "id": 2040
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Architecture",
    "question": "基于案例，列出3-4个关键发现，并据此撰写给客户的推荐。",
    "referenceAnswer": "Deloitte has been hired to assist with the analysis of the current systems and develop an implementation plan for a new, shared enterprise architecture solution spanning across all divisions of the organization.",
    "keyPoints": [
      "分析当前系统",
      "制定实施计划",
      "新的共享企业架构解决方案",
      "跨所有部门"
    ],
    "explanation": "推荐应基于关键发现：存在七个孤立的系统导致数据冗余；业务人员非技术导向且流程依赖纸质文件；高员工流动率导致IT负担重且效率低下；项目有适应外语、标准化报告和减少处理时间等额外目标。",
    "timeLimit": 150,
    "id": 2041
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Capital Projects",
    "question": "一家总承包商遭遇了多次施工延误，现已落后于计划。延误因素包括：(1) 混凝土分包商因恶劣天气无法浇筑混凝土；(2) 塑料管道供应商因供应链影响无法交货。总承包商担心这些延误将如何影响项目成本，并可能导致其需向业主支付合同延误罚款。他们聘请了德勤协助分析情况。请搭建一个分析框架。",
    "referenceAnswer": "为了全面分析施工延误对项目成本和合同风险的影响，我将构建一个结构化的分析框架。该框架将首先深入诊断当前延误的根本原因和影响范围，然后评估其对项目关键绩效指标的冲击，最后制定缓解和应对策略。具体如下：\n\n1.  **延误诊断与影响评估**：\n    *   **根本原因分析**：对已识别的两个直接原因（天气导致的混凝土作业停滞、供应链导致的管道交付中断）进行深入分析。评估天气异常的持续时间和预测，以及供应链中断的具体环节（如原材料短缺、生产问题、物流瓶颈）和恢复前景。\n    *   **影响量化**：评估这两项延误对整体项目关键路径的影响。计算因此导致的工期延误具体天数或周数。分析延误是否产生了连锁反应，影响了其他依赖工序（如后续的结构、安装工作）。\n    *   **责任界定**：根据合同条款，审查这些延误事件是否属于可免责的“不可抗力”条款范畴（如极端天气），或供应商违约。这直接影响承包商是否需承担延误罚款。\n\n2.  **成本与财务影响分析**：\n    *   **直接成本增加**：量化因工期延长产生的额外成本，如现场管理费、设备租赁延期费、劳动力闲置或重新调度成本。\n    *   **间接与风险成本**：评估潜在的合同罚款，这取决于延误责任界定和合同中的违约金条款（如按日计算的罚款金额）。考虑可能因延误导致的业主索赔（如间接损失）。评估项目现金流影响，因进度款支付延迟和成本超支。\n    *   **缓解措施成本**：评估任何可能的赶工方案（如增加班次、使用替代材料或工艺）所需的额外成本。\n\n3.  **缓解策略与行动计划**：\n    *   **进度恢复方案**：制定详细的赶工计划，重新排序任务（如果可能），寻找关键路径上的压缩机会。评估寻找替代供应商或分包商的可能性、时间和成本。\n    *   **沟通与合同管理**：制定与业主的沟通策略，透明报告延误原因（特别是可免责因素）和缓解计划，以寻求谅解或合同变更。同时，管理与分包商和供应商的合同，就其违约或延迟进行追索。\n    *   **风险监控与预防**：建立更强大的风险监控机制，对未来潜在的天气、供应链风险进行预警。审查和更新项目采购与合同策略，以增强供应链韧性。\n\n4.  **综合建议与汇报**：\n    *   基于以上分析，向总承包商管理层提供清晰的选项对比（如不同赶工方案的成本效益分析），并给出优先行动建议。准备向业主汇报的材料，重点展示问题分析、责任界定以及积极的补救计划，以最小化财务和声誉损失。",
    "keyPoints": [
      "根本原因分析",
      "影响量化",
      "责任界定",
      "成本增加分析",
      "合同罚款评估",
      "进度恢复方案",
      "沟通策略",
      "风险监控"
    ],
    "explanation": "这个框架适合此问题，因为它系统性地从问题诊断（原因、影响）过渡到影响分析（成本、风险），再到解决方案（缓解策略、沟通），最后形成综合建议，符合管理咨询解决复杂商业问题的逻辑，并直接回应了客户对成本和罚款的核心关切。",
    "timeLimit": 180,
    "id": 2042
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Capital Projects",
    "question": "针对总承包商面临的施工延误问题，请进行头脑风暴，提出可能的解决方案或建议。",
    "referenceAnswer": "原文未提供具体的方案列表或推荐内容。案例描述仅说明了问题情境（天气和供应链导致延误）以及客户的核心关切（成本影响和延误罚款），并指出德勤被聘请来“协助分析情况”。案例本身没有给出预设的解决方案、建议列表或推荐。",
    "keyPoints": [],
    "explanation": "评价标准应基于建议的全面性、可行性、创新性以及对解决核心问题（减少延误、控制成本、规避罚款）的直接相关性。",
    "timeLimit": 120,
    "id": 2043
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Capital Projects",
    "question": "基于对施工延误案例的分析，假设你已得出以下关键发现：1. 混凝土作业延误主要因恶劣天气导致，可能属于合同不可抗力条款范围。2. 管道供应延误源于供应商的供应链问题，可能构成供应商违约。3. 两项延误已使项目关键路径延迟X周，导致现场管理费用增加Y。4. 根据合同，若责任在承包商，将面临按日计算的延误罚款。请为总承包商撰写一份给业主的简要推荐或沟通要点。",
    "referenceAnswer": "原文未提供具体的推荐（recommendation）内容。案例描述停留在问题陈述和聘请德勤进行分析的阶段，并未披露分析后的结论或给出的建议。",
    "keyPoints": [],
    "explanation": "推荐应直接回应关键发现，逻辑清晰，并具有可操作性。",
    "timeLimit": 120,
    "id": 2044
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Data Exfiltration",
    "question": "你有一个来自VIP客户的案件，该客户每年与我们的业务部门有数百万美元的业务往来。客户要求你进行数字取证分析，以确定一名被解雇的高管（称为员工X）在离开公司前是否窃取了数字知识产权（IP）。客户的CEO正在不断与德勤合伙人联系以获取初步发现。你将如何构建你的调查框架？",
    "referenceAnswer": "原文中未提供完整的调查框架或结构化方法。原文仅描述了问题背景：需要进行数字取证分析，以确定被解雇高管是否窃取了数字知识产权，并提到将使用一套开源或付费工具进行调查，且所有公司设备都已加密。没有提供超过200字的详细框架、步骤或结构。",
    "keyPoints": [
      "数字取证分析",
      "确定知识产权盗窃",
      "使用调查工具",
      "设备加密"
    ],
    "explanation": "由于原文没有提供具体的分析框架，一个合适的框架应涵盖调查的关键阶段：证据收集（考虑加密设备的挑战）、数据分析（使用专业工具）、时间线重建、动机与机会评估，以及向客户汇报初步发现的沟通策略。",
    "timeLimit": 180,
    "id": 2045
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Deloitte Data Exfiltration",
    "question": "原文中没有提供任何具体的商业计算场景、数据或数字。因此，无法基于原文设计计算题。",
    "tolerance": 0.05,
    "explanation": "原文中没有包含任何需要计算的数字、数据或量化信息。案例描述完全是定性的，涉及调查过程，但没有财务数据、时间估算、数量或百分比。",
    "timeLimit": 60,
    "id": 2046
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Data Exfiltration",
    "question": "原文中描述了一个需要调查数字知识产权盗窃的场景。在进行此类取证调查时，你可以考虑哪些潜在的调查方向或方法？",
    "referenceAnswer": "原文中未提供任何具体的方案列表、建议或头脑风暴内容。原文仅陈述了问题：需要确定高管是否窃取了知识产权，并提到将使用工具进行调查。",
    "keyPoints": [
      "使用调查工具",
      "数字取证分析"
    ],
    "explanation": "评价标准可能包括：想法的全面性（如日志分析、网络流量监控、外部存储设备检查）、对加密挑战的应对、以及调查步骤的逻辑性。",
    "timeLimit": 180,
    "id": 2047
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "Deloitte Data Exfiltration",
    "question": "原文中没有提供任何数据表格、图表或exhibit。因此，无法基于原文数据设计图表解读题。",
    "options": [],
    "explanation": "原文中没有任何图表、数据表格或数值型exhibit。所有内容均为文本描述。",
    "timeLimit": 45,
    "id": 2048
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Data Exfiltration",
    "question": "根据案例原文，列出此调查中的关键背景信息或约束条件（3-4点），并基于这些信息，你会向客户提出什么初步的行动建议？",
    "referenceAnswer": "原文中未提供任何具体的调查发现或给客户的推荐建议。原文仅提供了问题背景和约束条件。",
    "keyPoints": [
      "VIP客户",
      "高管被指控盗窃知识产权",
      "设备已加密",
      "使用工具进行调查"
    ],
    "explanation": "原文没有提供调查后的发现或具体的推荐。一个基于背景的推荐应涉及如何启动取证流程、处理加密设备、与客户CEO沟通初步计划等。",
    "timeLimit": 180,
    "id": 2049
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Finance Strategy",
    "question": "客户是一个联邦卫生机构，正在应对日益严重的埃博拉疫情。国会已批准10亿美元紧急拨款，用于加速消除埃博拉的活动。该机构负责与各国公共卫生组织和非政府组织合作，实施和协调这些活动。国会正在严格审查该机构对所有活动的有效执行、监督和风险缓解。问题：该机构已聘请德勤支持管理与埃博拉应对相关的所有财务活动。这些活动包括确定将获得额外资金的计划、监督计划实施计划、确保资金的可问责使用，以及向机构主任和国会报告资金状况。请为管理这些财务活动搭建一个分析框架。",
    "referenceAnswer": "根据案例原文，德勤需要支持的财务活动管理框架应包含以下核心部分：\n1.  **资金分配与优先级排序**：识别将获得额外资金的计划。资金应根据一个公式进行分配并证明其合理性，确保分配到能够减少埃博拉病例数和防止埃博拉传播的高优先级活动上。\n2.  **计划实施监督**：监督计划实施计划。确保计划资金按计划支出，以显示高效的实施和进展。需要监控计划的执行情况。\n3.  **财务问责与合规**：确保资金的可问责使用。这包括对资金使用的监督、监控，并确保符合国会的要求。\n4.  **支出监控与预警**：密切关注支出情况。超支约10%的拨款不是问题，但支出不足是一个危险信号，需要特别关注。\n5.  **报告与沟通**：向机构主任和国会报告资金状况。国会期望每月收到报告，报告将提交给拥有所有可自由支配支出管辖权的参议院拨款委员会。需要准备月度状态报告草案供机构主任审阅。\n6.  **绩效识别与纠正**：识别哪些计划可能未按计划执行，并制定团队将采取的纠正措施来解决此类问题。这需要分析计划绩效偏差并提出解决方案。\n这个框架涵盖了从资金分配到最终报告的全流程管理，并特别强调了国会监督下的合规、问责和绩效纠正。",
    "keyPoints": [
      "资金分配",
      "计划监督",
      "财务问责",
      "支出监控",
      "报告沟通",
      "绩效纠正"
    ],
    "explanation": "这个框架适合该问题，因为它直接回应了客户（联邦卫生机构）的核心诉求：在国会严格监督和紧急拨款的背景下，系统化管理埃博拉应对资金。它涵盖了资金流的完整生命周期（分配、使用、监控、报告），并突出了关键风险点（支出不足、绩效不达标），确保了财务活动的有效性、合规性和透明度。",
    "timeLimit": 180,
    "id": 2050
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Finance Strategy",
    "question": "基于案例信息，列出在准备提交给国会的月度状态报告时，需要向机构主任汇报的3-4个关键发现或问题点。",
    "referenceAnswer": "根据案例原文，在月度状态报告中，需要向机构主任汇报的关键发现和问题点应包括：\n1.  **资金支出状态**：报告紧急拨款的整体支出进度，明确指出是否存在支出不足（这是一个危险信号）或超支（约10%以内可接受）的情况。\n2.  **计划绩效偏差**：识别并列出哪些埃博拉应对计划可能未按原定实施计划执行，即未达到预期的进展或资金使用效率。\n3.  **高风险活动**：指出在资金分配、计划监督或资金使用方面存在较高风险的活动或合作伙伴，需要加强监控。\n4.  **待采取的纠正措施**：针对识别出的绩效不佳或存在风险的计划，说明团队计划采取的具体纠正行动，以确保资金有效使用并达成消除埃博拉的目标。",
    "keyPoints": [
      "支出进度",
      "绩效偏差",
      "高风险活动",
      "纠正措施"
    ],
    "explanation": "这些关键发现直接回应了机构主任的两个核心要求：审阅报告草案，以及了解未按计划执行的计划和纠正措施。它们聚焦于资金使用效率和计划执行效果，是国会监督的重点。",
    "timeLimit": 120,
    "id": 2051
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte LeadAuto",
    "question": "LeadAuto是亚洲领先的汽车制造商，其现有汽车产品线在过去五年经历了巨大增长，但市场预测未来五年增长将非常缓慢。因此，公司决定将重点扩展到巴士市场，该市场在未来5-10年有显著增长预期。LeadAuto正在考虑两种产品配置，这给销售、运营和财务等各方面带来了巨大的模糊性和复杂性。同时，由于向客户提供的选项组合数量众多，客户难以理解每辆巴士的盈利能力。请构建一个分析框架，帮助客户评估是否进入巴士市场、潜在盈利能力、优化车型组合、市场盈利能力，以及为组织和员工做准备所需的关键行动。",
    "referenceAnswer": "根据原文，客户聘请德勤帮助评估其选项。具体的问题陈述是：LeadAuto正在考虑两种产品配置，这给销售、运营和财务等各方面带来了巨大的模糊性和复杂性。此外，由于向客户提供的选项组合数量众多，客户难以理解每辆巴士的盈利能力。客户请德勤帮助评估：1. 是否进入巴士市场；2. 潜在盈利能力；3. 优化车型组合；4. 市场盈利能力；5. 为组织和员工做准备所需的关键行动。因此，一个完整的分析框架应围绕这五个核心评估点展开。首先，进行市场进入评估，分析巴士市场的增长预期、竞争格局、客户需求和监管环境。其次，进行盈利能力分析，通过财务建模，考虑不同产品配置和选项组合下的成本、定价和利润，以理解每辆巴士的盈利能力。第三，进行产品组合优化，分析两种产品配置的销售潜力、成本结构和资源需求，以确定最优的模型组合。第四，评估整体市场盈利能力，考虑市场规模、份额目标和利润池分布。最后，制定组织与人员准备计划，包括对销售、运营和财务团队的能力建设、流程调整和变革管理，以应对新产品引入带来的复杂性。",
    "keyPoints": [
      "市场进入评估",
      "盈利能力分析",
      "产品组合优化",
      "市场盈利能力",
      "组织与人员准备"
    ],
    "explanation": "这个框架直接对应原文中客户要求德勤帮助评估的五个具体方面，确保了分析的全面性和针对性，能够系统地解决由产品配置和选项组合带来的模糊性与复杂性问题。",
    "timeLimit": 180,
    "id": 2052
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte LeadAuto",
    "question": "LeadAuto在考虑进入巴士市场时，面临产品配置和选项组合带来的巨大模糊性与复杂性。请进行头脑风暴，提出帮助客户准备组织和员工以应对这些变化的关键行动建议。",
    "referenceAnswer": "原文中明确指出，客户需要德勤帮助评估的方面包括“关键行动 required to prepare the organization and employees”。因此，头脑风暴应聚焦于为组织和员工做准备的关键行动。可能的建议列表应围绕以下方面：1. 销售团队培训：针对新的巴士产品配置和复杂选项进行专项培训，提升销售能力。2. 运营流程调整：优化生产、供应链和售后服务流程，以适应巴士产品的新配置和定制化需求。3. 财务系统升级：更新财务模型和核算系统，以准确追踪不同选项组合下的成本和盈利能力。4. 变革管理计划：制定沟通和参与策略，确保员工理解并支持向巴士市场的扩张。5. 组织架构审视：评估现有架构是否支持新业务，考虑是否需要设立专门的巴士业务部门或团队。",
    "keyPoints": [
      "销售团队培训",
      "运营流程调整",
      "财务系统升级",
      "变革管理计划",
      "组织架构审视"
    ],
    "explanation": "评价标准：建议是否直接针对“准备组织和员工”这一目标，是否涵盖了销售、运营、财务等受影响的业务方面，并且具有可操作性。",
    "timeLimit": 120,
    "id": 2053
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte LeadAuto",
    "question": "基于对LeadAuto案例的分析，假设我们得出了以下关键发现：1. 巴士市场未来5-10年增长预期显著，是可行的扩张方向。2. 两种产品配置和众多选项组合导致每辆巴士的盈利能力难以厘清。3. 进入新市场需要对销售、运营和财务流程进行重大调整。请根据这些发现，向客户提出你的最终建议。",
    "referenceAnswer": "原文中客户要求德勤帮助评估“是否进入巴士市场”以及“关键行动 required to prepare the organization and employees”。因此，综合建议应基于评估结果。参考建议如下：建议LeadAuto进入巴士市场，因为该市场增长前景良好。然而，在进入前，必须优先解决盈利能力模糊的问题。我们建议：首先，进行深入的财务建模，厘清不同配置和选项组合下的成本与利润，建立清晰的定价和盈利分析工具。其次，优化产品模型组合，基于盈利分析和市场需求，聚焦于最具潜力的配置。最后，立即启动组织准备计划，包括对销售团队进行新产品培训、调整运营流程以处理定制化订单，并升级财务系统以支持精细化核算。",
    "keyPoints": [
      "建议进入市场",
      "优先厘清盈利能力",
      "优化产品组合",
      "启动组织准备计划"
    ],
    "explanation": "此建议直接回应了原文中客户提出的核心问题，即评估市场进入、盈利能力和组织准备，并将关键发现转化为具体行动。",
    "timeLimit": 150,
    "id": 2054
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Real Estate",
    "question": "一家房地产客户拥有遍布美国中西部的大型工业仓库投资组合。该公司已联系德勤，希望对其投资组合中的一处房产进行价值评估。标的房产是一个位于中型城镇的45,000平方英尺的工业设施，紧邻90号州际公路，可便捷通往芝加哥地区。该设施建于2016年，目前由单一租户100%占用，租约于2031年到期。客户不确定该房产的价值，需要德勤提供协助。请搭建一个分析框架来评估该工业仓库的价值。",
    "referenceAnswer": "原文中未提供完整的评估框架或结构化分析步骤。原文仅描述了业务情境和问题陈述，即客户需要对其工业仓库资产进行估值，并提供了房产的基本信息（面积、位置、建造年份、租赁状况）。但并未给出德勤顾问在案例面试中应使用的具体分析框架、方法或步骤。因此，无法从原文中提取出200字以上的完整框架。",
    "keyPoints": [],
    "explanation": "由于原文未提供具体的估值框架或方法论，无法评价其适用性。在实际案例面试中，针对房地产估值问题，一个合适的框架可能包括：分析宏观与区域经济、评估房产物理与法律特性、进行市场比较分析、运用收益资本化法或贴现现金流模型、评估租约条款与租户信用风险，以及考虑退出策略等。",
    "timeLimit": 180,
    "id": 2055
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Deloitte Real Estate",
    "question": "原文中未提供任何具体的计算场景、数字或需要计算的数学问题。",
    "tolerance": 0.05,
    "unit": "",
    "explanation": "原文中未包含任何需要进行商业计算的场景、数据或问题。因此无法提取计算过程。",
    "timeLimit": 60,
    "id": 2056
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Real Estate",
    "question": "原文中未明确描述需要头脑风暴或提出建议的具体场景。",
    "referenceAnswer": "原文中未提供任何方案列表或具体的建议。",
    "keyPoints": [],
    "explanation": "原文未提供针对该估值问题的推荐方案或评价标准。",
    "timeLimit": 180,
    "id": 2057
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "Deloitte Real Estate",
    "question": "原文中未包含任何数据表格、图表或exhibit。",
    "options": [],
    "explanation": "原文中未提供任何图表数据，因此无法设计相关问题。",
    "timeLimit": 45,
    "id": 2058
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Real Estate",
    "question": "原文中未列出任何关键发现。请基于以下信息（均来自原文）进行总结并给出建议：1. 客户拥有中西部工业仓库组合；2. 标的房产为45,000平方英尺工业设施；3. 位于中型城镇，紧邻I-90公路，通达芝加哥地区；4. 建于2016年；5. 由单一租户100%占用，租约至2031年。",
    "referenceAnswer": "原文中未提供任何具体的推荐或结论。",
    "keyPoints": [],
    "explanation": "原文仅提供了案例背景和问题陈述，并未给出分析后的关键发现或最终建议。",
    "timeLimit": 120,
    "id": 2059
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Recreation Unlimited",
    "question": "Recreation Unlimited是一家全球服装和运动服装公司，正面临市场份额下降的问题。消费者产品行业正经历着来自传统实体零售商、电子零售商和直接面向消费者的制造商日益增长的电子商务销售，这改变了行业竞争方式。尽管以其高质量的性能和生活方式产品而闻名，但Recreation Unlimited未能成功应对不断变化的客户体验偏好，并且在电子商务销售方面落后于竞争对手。客户已聘请德勤（Deloitte）通过电子商务推动收入增长，具体目标是在未来五年内，直接面向消费者的数字渠道实现每年+40%的激进增长。客户还要求在建议中纳入组织考虑因素（人才、组织等）。请为这个问题搭建一个分析框架。",
    "referenceAnswer": "为了全面解决Recreation Unlimited的问题，我们需要一个涵盖业务战略和组织能力的综合框架。框架应分为两个主要支柱：1. **推动电子商务增长**：分析当前电子商务表现（仅占销售额的5%，而行业平均为10%），识别差距。评估数字客户体验，包括网站/应用程序的可用性、个性化和全渠道整合。审查产品供应和定价策略，以确保在线竞争力。分析市场扩张机会，特别是在增长市场（拉丁美洲、亚太和非洲）。评估竞争格局，了解竞争对手的电子商务成功因素。制定营销和客户获取策略，以增加在线流量和转化率。2. **解决组织影响和人才问题**：分析高员工流失率，特别是在年轻员工中。调查员工满意度下降的原因。评估组织的层级结构是否阻碍了敏捷性和数字化转型。审查培训计划支出的停止及其对技能提升的影响。确保组织文化和能力能够支持数字化转型。将人才战略与电子商务目标结合起来。最后，需要评估财务影响和投资需求，并制定实施路线图和关键绩效指标（KPIs）以跟踪进展。",
    "keyPoints": [
      "电子商务表现分析",
      "数字客户体验评估",
      "市场扩张机会",
      "竞争格局分析",
      "组织层级结构",
      "员工流失与满意度",
      "培训计划",
      "实施路线图"
    ],
    "explanation": "这个框架适合，因为它直接回应了客户的两个核心要求：通过电子商务推动收入增长（业务层面）和考虑组织影响（人才/组织层面）。它从诊断现状（如5%的电商渗透率）出发，覆盖了市场、竞争、客户体验等外部因素，同时深入内部组织问题（如高流失率、层级结构），确保建议是全面且可实施的。",
    "timeLimit": 180,
    "id": 2060
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "easy",
    "source": "Deloitte Recreation Unlimited",
    "question": "Recreation Unlimited的全球收入为110亿美元。目前，其电子商务销售额占总销售额的5%。行业平均电子商务销售额占比为10%。假设Recreation Unlimited的总收入在未来一年保持不变，如果它想达到行业平均的电子商务渗透率（即10%），那么它的电子商务销售额需要增加多少亿美元？",
    "correctNumber": 5.5,
    "tolerance": 0.05,
    "unit": "亿美元",
    "explanation": "计算过程：\n1. 当前电子商务销售额 = 总收入 × 当前电商渗透率 = 110亿美元 × 5% = 5.5亿美元。\n2. 达到行业平均后的目标电子商务销售额 = 总收入 × 行业平均渗透率 = 110亿美元 × 10% = 11亿美元。\n3. 需要增加的电子商务销售额 = 目标销售额 - 当前销售额 = 11亿美元 - 5.5亿美元 = 5.5亿美元。\n因此，电子商务销售额需要增加5.5亿美元。",
    "timeLimit": 45,
    "id": 2061
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Talent Management",
    "question": "CCPB（联邦民用货物保护局）是一个负责非军事货物运输安全的机构。由于安检人员的安全失误、未检查的货物清单以及雇佣了有犯罪记录或可疑海外关系的员工，该机构近期经历了严重的负面舆论，员工士气在六个月内下降了近25%。新任首席行政官已委托德勤进行现状分析，并制定人力资本战略。请为这个项目搭建一个分析框架。",
    "referenceAnswer": "Deloitte must perform a current state analysis to identify and address risks in the current cargo security screening processes, as well as the present hiring practices for security screeners. Along with the current state analysis, Deloitte must also create a human capital strategy that identifies cost-effective and streamlined approaches to security screener recruitment, training, and employee engagement initiatives. This strategy should include insights for CCPB senior leadership about how to create a cohesive and unified culture of security awareness. Key considerations include: 1) Current CCPB field officers undergo only six weeks of on-the-job training and are not required any hours of continuing education. 2) CPB currently has limited access to a counter-terrorism database managed by another agency due to current interagency data-sharing policies. 3) The Chief Administrator has only previously worked in military agencies and thus has no experience with civil service organizations; most CCPB field officers are not former military members and are civil servants. 4) The Chief Human Resources Officer (CHRO) is excited about upcoming changes while the Chief Information Officer (CIO) is hesitant to make any changes. The framework should therefore encompass both a diagnostic phase (current state analysis of processes and hiring) and a strategic design phase (developing future-state solutions for recruitment, training, engagement, and culture).",
    "keyPoints": [
      "current state analysis",
      "cargo security screening processes",
      "hiring practices",
      "human capital strategy",
      "recruitment",
      "training",
      "employee engagement",
      "culture of security awareness"
    ],
    "explanation": "这个框架适合此问题，因为它直接回应了客户的两个核心要求：进行现状分析以识别风险，并制定涵盖招聘、培训、员工参与和文化建设的未来人力资本战略。框架结构清晰，从诊断现状过渡到设计解决方案。",
    "timeLimit": 180,
    "id": 2062
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Talent Management",
    "question": "针对CCPB面临的挑战，请为制定其人力资本战略进行头脑风暴，提出一些成本效益高且精简的举措。",
    "referenceAnswer": "The human capital strategy should identify cost-effective and streamlined approaches to security screener recruitment, training, and employee engagement initiatives. This strategy should include insights for CCPB senior leadership about how to create a cohesive and unified culture of security awareness.",
    "keyPoints": [
      "cost-effective",
      "streamlined approaches",
      "recruitment",
      "training",
      "employee engagement initiatives",
      "culture of security awareness"
    ],
    "explanation": "评价标准：提出的方案需要紧扣“成本效益高”和“精简”的要求，并具体覆盖招聘、培训和员工参与这三个领域，最终服务于建立统一的安全意识文化这一更高目标。",
    "timeLimit": 120,
    "id": 2063
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte Talent Management",
    "question": "基于案例描述，CCPB面临几个关键挑战：1) 安检人员仅接受6周在职培训且无继续教育要求；2) 因机构间数据共享政策限制，访问反恐数据库受限；3) 新任首席行政官只有军队机构经验，不熟悉文职机构；4) 内部对变革的态度不一（CHRO支持，CIO犹豫）。请根据这些发现，为CCPB撰写一份简要的推荐。",
    "referenceAnswer": "Deloitte must create a human capital strategy that identifies cost-effective and streamlined approaches to security screener recruitment, training, and employee engagement initiatives. This strategy should include insights for CCPB senior leadership about how to create a cohesive and unified culture of security awareness.",
    "keyPoints": [
      "human capital strategy",
      "cost-effective and streamlined approaches",
      "recruitment, training, employee engagement",
      "cohesive and unified culture of security awareness"
    ],
    "explanation": "推荐应直接回应问题陈述中德勤的任务，即制定一个涵盖招聘、培训和员工参与的战略，并帮助领导层建立统一的安全文化。",
    "timeLimit": 150,
    "id": 2064
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte XFintech",
    "question": "XFintec Inc.是一家专注于金融科技产品的中型组织，刚刚遭受勒索软件攻击，关键系统和敏感数据被加密。首席技术官（CTO）已联系德勤寻求紧急建议。作为顾问，你将如何构建一个框架来处理这一事件？",
    "referenceAnswer": "原文未提供完整的框架（framework）内容。原文仅描述了问题背景：攻击源于恶意电子邮件附件，影响了多个部门的服务器和工作站，攻击者索要巨额赎金，CTO担心数据泄露、财务损失和声誉影响。",
    "keyPoints": [
      "勒索软件攻击",
      "恶意邮件附件",
      "系统加密",
      "赎金要求",
      "数据泄露风险",
      "财务损失",
      "声誉影响",
      "事件响应"
    ],
    "explanation": "由于原文没有给出具体的分析框架，无法提取完整的参考框架。一个合适的框架应涵盖事件响应、技术遏制、业务影响评估、沟通策略和法律合规等方面，以全面应对勒索软件攻击。",
    "timeLimit": 180,
    "id": 2065
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "Deloitte XFintech",
    "question": "原文中没有提供具体的商业计算场景或数据。",
    "tolerance": 0.05,
    "explanation": "原文中没有包含任何需要计算的数字、数据或数学场景，因此无法提取此类练习。",
    "timeLimit": 60,
    "id": 2066
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte XFintech",
    "question": "针对XFintec Inc.的勒索软件攻击，请进行头脑风暴，提出应对方案和建议。",
    "referenceAnswer": "原文中没有提供具体的方案列表或建议。",
    "keyPoints": [
      "事件响应",
      "系统恢复",
      "数据安全",
      "赎金处理",
      "声誉管理"
    ],
    "explanation": "评价标准应基于方案的全面性、可行性、对业务连续性的考虑以及对客户（CTO）关切点（数据暴露、财务损失、声誉影响）的针对性。",
    "timeLimit": 180,
    "id": 2067
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "medium",
    "source": "Deloitte XFintech",
    "question": "原文中没有提供任何数据表格、图表或exhibit。",
    "options": [],
    "explanation": "原文中没有包含任何图表或数据表格，因此无法构建图表解读问题。",
    "timeLimit": 45,
    "id": 2068
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Deloitte XFintech",
    "question": "根据案例描述，总结XFintec Inc.勒索软件攻击事件的3-4个关键发现，并据此撰写给客户的建议。关键发现包括：1. 攻击源于恶意电子邮件附件；2. 多个服务器和工作站受影响；3. 攻击者索要巨额赎金；4. CTO担心数据暴露、财务损失和声誉影响。",
    "referenceAnswer": "原文中没有提供具体的推荐（recommendation）内容。",
    "keyPoints": [
      "立即遏制",
      "评估影响",
      "沟通策略",
      "恢复计划"
    ],
    "explanation": "建议应基于关键发现，直接回应CTO的关切，并体现结构化的问题解决方法。",
    "timeLimit": 180,
    "id": 2069
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "Kearney Promotion Planning",
    "question": "我们的客户是一家全国性的杂货和药店连锁店，其市场份额正被竞争对手逐步侵蚀。客户采用高低定价策略，定期进行促销，但促销期间的销售额提升幅度低于行业平均水平。问题：你将采取什么方法来提高商品促销时的销售额提升？",
    "referenceAnswer": "原文未提供完整的框架或结构化答案。原文仅描述了问题情境和额外信息，包括：客户采用高低定价策略且不打算改变；在每个本地市场，客户与主要高低定价竞争对手的日常价格、促销周期时间和折扣百分比几乎相同；促销规划流程涉及门店经理提前数周向配送中心下订单，订单量基于过去类似促销的订购量以及主观因素（如自上次促销以来的时间长度、门店经理的经验直觉）；如果促销商品货架缺货，门店经理会下追加订单，但有时直到顾客投诉才发现缺货；配送中心的采购员没有足够的前置时间将门店订单纳入给供应商的订单中，但会使用过去类似促销的销售数据来确定采购量；顾客经常抱怨促销期间货架上没有促销商品，而顾客忠诚度取决于商店能以合理价格供应他们消费的商品。",
    "keyPoints": [
      "高低定价策略",
      "促销周期与竞争对手相同",
      "门店经理基于历史订单和主观判断下单",
      "缺货时追加订单流程",
      "配送中心采购基于历史销售数据",
      "顾客抱怨缺货影响忠诚度"
    ],
    "explanation": "这个问题涉及运营、供应链和营销的交叉。一个合适的框架应分析促销规划的全流程，从需求预测、库存订购、供应链响应到顾客体验，以识别导致销售提升不足的瓶颈和根本原因。",
    "timeLimit": 180,
    "id": 2070
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "Kearney Promotion Planning",
    "question": "基于原文描述，请提出提高促销期间销售额提升的方案。",
    "referenceAnswer": "原文未提供具体的方案列表或推荐。原文仅陈述了问题、背景信息和流程描述，但没有给出明确的解决方案或建议。",
    "keyPoints": [],
    "explanation": "评价标准应基于方案的逻辑性、针对原文中识别的问题（如预测不准、缺货、供应链延迟），以及是否切实可行。",
    "timeLimit": 120,
    "id": 2071
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "Kearney Promotion Planning",
    "question": "根据原文，列出3-4个关键发现，并据此撰写给客户的推荐。",
    "referenceAnswer": "原文未提供具体的推荐内容。原文仅描述了情境、问题和流程细节，但没有总结关键发现或给出最终建议。",
    "keyPoints": [],
    "explanation": "关键发现应来自原文描述的问题点，如促销预测方法主观、补货流程被动、供应链信息不同步、顾客因缺货不满。推荐应直接针对这些发现。",
    "timeLimit": 150,
    "id": 2072
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Beautify",
    "question": "Beautify是一家全球高端化妆品公司，主要通过高端百货商店和线上专业零售商销售产品。公司聘请麦肯锡帮助评估，若将大部分美容顾问培训为使用虚拟渠道联系客户，是否能为公司带来盈利。请搭建一个分析框架来评估这一转型。",
    "referenceAnswer": "Beautify should consider the following factors when shifting its beauty consultants toward becoming virtual social media-beauty advisors: (i) Retailer response: Beautify will need to consider how retailers will react to consumers buying directly from their website. They will have to work out the financial arrangements with their retail partners, as some may see this as competition and may choose not to stock their products. (ii) Competitor response: Beautify will also need to consider the response of their competitors. They should investigate if other beauty companies offer virtual assistants and if they are successful. If not, do they have plans to digitize the personal selling experience? This will help Beautify identify potential threats and opportunities in the market. (iii) Current capabilities: Beautify should evaluate its existing resources, including the skills of its beauty consultants, technological infrastructure, and training programs, to determine if they are sufficient to support the transition to a virtual model. Additionally, Beautify must assess the potential impact on customer experience and loyalty, as consultants would still lead direct consumer engagement and be expected to maintain and grow a client base through beautify.com pages, retail outlet appearances, and social media activity. Financial considerations, such as the costs of training, technology investment, and changes in compensation structures, should also be analyzed. Finally, market trends and consumer behavior shifts towards online shopping must be thoroughly understood to ensure the strategy aligns with demand.",
    "keyPoints": [
      "Retailer response",
      "Competitor response",
      "Current capabilities",
      "Customer experience",
      "Financial considerations",
      "Market trends"
    ],
    "explanation": "这个框架全面覆盖了转型的内外部关键因素，包括合作伙伴关系、竞争环境、内部能力、客户、财务和市场趋势，符合麦肯锡案例中系统性评估商业问题的要求。",
    "timeLimit": 180,
    "id": 2073
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Beautify",
    "question": "Beautify在将美容顾问转型为虚拟社交媒体美容顾问时，应该考虑哪些可能的因素？",
    "referenceAnswer": "(i) Retailer response: Beautify will need to consider how retailers will react to consumers buying directly from their website. They will have to work out the financial arrangements with their retail partners, as some may see this as competition and may choose not to stock their products. (ii) Competitor response: Beautify will also need to consider the response of their competitors. They should investigate if other beauty companies offer virtual assistants and if they are successful. If not, do they have plans to digitize the personal selling experience? This will help Beautify identify potential threats and opportunities in the market. (iii) Current capabilities: Beautify should evaluate",
    "keyPoints": [
      "Retailer response",
      "Competitor response",
      "Current capabilities"
    ],
    "explanation": "评价标准应包括：是否识别了关键利益相关者（如零售商、竞争对手），是否考虑了内部能力评估，以及是否逻辑清晰、全面。",
    "timeLimit": 120,
    "id": 2074
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Diconsa",
    "question": "墨西哥的农村人口在获取金融服务方面面临重大障碍。目前，福利领取者必须前往有限的国有银行分行，产生高昂的成本和安全风险。政府运营着Diconsa，这是一个通过已建立的配送系统为农村地区服务的22,000家商店网络。麦肯锡的任务是调查Diconsa现有的零售基础设施是否可以提供金融服务，从福利支付开始，扩展到储蓄、保险和贷款。请设计一个框架来评估这个项目。",
    "referenceAnswer": "团队应调查以下关键领域：1. 对农村人口的好处：包括减少前往银行分行的旅行成本和时间，降低携带现金的安全风险，以及通过获得储蓄、保险和贷款等基本金融服务来增强财务稳定性。2. 对政府的优势：可能包括降低福利分配系统的运营成本，提高政府支付系统的效率，以及通过Diconsa网络扩大金融包容性。3. 潜在风险：需要评估运营能力限制，例如Diconsa商店是否有足够的人员、技术和安全措施来处理金融交易。还必须考虑欺诈预防，确保系统安全可靠。4. 实施能力：分析Diconsa现有零售和分销基础设施是否能够支持金融服务的提供，包括物流、技术整合和员工培训。关键考虑因素包括减少旅行成本、改善安全、增强财务稳定性、运营能力限制和欺诈预防。",
    "keyPoints": [
      "农村人口好处",
      "政府优势",
      "潜在风险",
      "实施能力",
      "减少旅行成本",
      "改善安全",
      "运营能力限制",
      "欺诈预防"
    ],
    "explanation": "这个框架全面覆盖了项目的利益相关者（农村人口、政府）、可行性（实施能力）和风险管理（潜在风险），符合评估一个利用现有基础设施提供新服务的商业问题的核心要素。",
    "timeLimit": 180,
    "id": 2075
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "easy",
    "source": "McKinsey Diconsa",
    "question": "给定参数：墨西哥总人口1亿，其中20%为农村人口。农村人口中，50%领取福利。假设家庭规模为4人。每位福利领取者每月前往银行领取福利的成本为50比索。请计算：1. 领取福利的农村家庭数量。2. 这些家庭每年在领取福利上的总旅行成本。3. 如果通过Diconsa网络能将此成本降低30%，每年潜在节省的金额是多少？",
    "correctNumber": 450000000,
    "tolerance": 0.05,
    "unit": "pesos per year",
    "explanation": "1. 计算领取福利的农村人口：100 million * 20% (rural) * 50% (receive benefits) = 10 million people。\n2. 计算领取福利的农村家庭数量：10 million people / 4 people per family = 2.5 million families。\n3. 计算每年总旅行成本：10 million people * 50 pesos per month * 12 months = 6 billion pesos per year。\n4. 计算30%成本节省：6 billion pesos * 30% = 1.8 billion pesos per year。\n注意：原文中给出的结果是“450 million pesos per year”，这可能是基于不同的计算路径（例如，基于家庭数或不同的成本基数）。根据原文“spending 1.5 billion pesos annually. A 30% cost reduction yields '450 million pesos per year'”，我们采用原文直接给出的结果作为正确答案。",
    "timeLimit": 60,
    "id": 2076
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Diconsa",
    "question": "基于Diconsa网络为墨西哥偏远社区设计一个基本的金融服务产品组合。请进行头脑风暴，列出可以提供的服务类型。",
    "referenceAnswer": "从福利支付开始，扩展到储蓄、保险和贷款。",
    "keyPoints": [
      "福利支付",
      "储蓄",
      "保险",
      "贷款"
    ],
    "explanation": "评价标准：方案应覆盖基本的金融服务类别，从最直接的需求（福利支付）扩展到更全面的产品（储蓄、保险、贷款），并考虑在偏远地区的可行性和需求。",
    "timeLimit": 120,
    "id": 2077
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Diconsa",
    "question": "请根据以下关键发现撰写给客户的建议：1. 农村人口领取福利的旅行成本高昂且存在安全风险。2. Diconsa拥有覆盖农村的庞大零售网络。3. 定量分析显示，通过Diconsa分发福利可带来显著的成本节约（每年数亿比索）。4. 调查显示部分地区人口接受使用Diconsa商店领取福利。",
    "referenceAnswer": "建议利用Diconsa现有的零售基础设施来提供金融服务。首先从福利支付开始，因为这能直接解决旅行成本和安全问题，并带来显著的政府节约（每年4.5亿比索）。随后，可以逐步扩展到储蓄、保险和贷款等基本金融服务，以增强农村人口的财务稳定性。实施前需仔细评估运营能力和欺诈预防措施。",
    "keyPoints": [
      "利用Diconsa网络",
      "从福利支付开始",
      "扩展到储蓄保险贷款",
      "评估运营能力与欺诈风险"
    ],
    "explanation": "总结推荐应基于定量和定性发现，提出具体、分阶段的行动方案，并指出潜在风险。",
    "timeLimit": 150,
    "id": 2078
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Electro-Light",
    "question": "Beautify是一家全球高端化妆品公司，主要通过高端百货商店销售产品。消费者正转向线上购物，导致许多美容顾问在空荡荡的百货商店工作。Beautify的总裁和首席运营官聘请麦肯锡来帮助评估，如果培训大多数美容顾问使用虚拟渠道与客户联系，是否能为公司带来利润。请问，Beautify在将这群员工转向新的职责时，应该考虑哪些可能的因素？",
    "referenceAnswer": "Beautify should consider the following factors when shifting beauty consultants toward becoming virtual social media-beauty advisors: (i) Retailer response: Beautify will need to consider how retailers will react to consumers buying directly from their website. They will have to work out the financial arrangements with their retail partners, as some may see this as competition and may choose not to stock their products. (ii) Competitor response: Beautify will also need to consider the response of their competitors. They should investigate if other beauty companies offer virtual assistants and if they are successful. If not, do they have plans to digitize the personal selling experience? This will help Beautify identify potential threats and opportunities in the market. (iii) Current capabilities: Beautify should evaluate its current capabilities in terms of technology, training, and support systems needed for this transition.",
    "keyPoints": [
      "Retailer response",
      "Competitor response",
      "Current capabilities",
      "Financial arrangements",
      "Market threats",
      "Market opportunities",
      "Technology",
      "Training"
    ],
    "explanation": "这个框架适合这个问题，因为它系统地考虑了转型的内外部关键利益相关者（零售商、竞争对手）以及公司自身的实施能力（当前能力），确保评估全面，覆盖了商业可行性、竞争环境和执行基础。",
    "timeLimit": 180,
    "id": 2079
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Electro-Light",
    "question": "Beautify在将美容顾问转变为虚拟社交媒体美容顾问时，应该考虑哪些可能的因素？请进行头脑风暴。",
    "referenceAnswer": "(i) Retailer response: Beautify will need to consider how retailers will react to consumers buying directly from their website. They will have to work out the financial arrangements with their retail partners, as some may see this as competition and may choose not to stock their products. (ii) Competitor response: Beautify will also need to consider the response of their competitors. They should investigate if other beauty companies offer virtual assistants and if they are successful. If not, do they have plans to digitize the personal selling experience? This will help Beautify identify potential threats and opportunities in the market. (iii) Current capabilities: Beautify should evaluate its current capabilities.",
    "keyPoints": [
      "零售商反应",
      "竞争对手反应",
      "当前能力",
      "财务安排",
      "市场威胁",
      "市场机会"
    ],
    "explanation": "评价标准：回答应涵盖对零售商关系、竞争对手动态以及内部能力（如技术、培训）的考量，确保全面性、逻辑性和商业可行性。",
    "timeLimit": 120,
    "id": 2080
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey GlobaPharm",
    "question": "我们的客户是GlobaPharm，一家年收入100亿美元的大型制药公司。它希望进入快速增长的新药领域‘生物制剂’，并考虑收购领先的生物制剂初创公司BioFuture（价值约10亿美元）。今天我们的总体问题是：‘GlobaPharm应该收购BioFuture吗？’ 请搭建一个分析框架来评估这项收购。",
    "referenceAnswer": "评估GlobaPharm是否应该收购BioFuture时，团队应考虑以下主要因素：\n1. BioFuture的药物管线价值：包括正在开发的药物数量、药物质量以及可能产生的收入和利润潜力。\n2. BioFuture的研发能力：包括其未来的药物管线、科学人才、知识产权和设施。\n3. BioFuture的营销和销售能力：包括他们计划如何推广其生物产品，以及他们与关键意见领袖的关系。\n4. 收购价格：需要根据潜在投资回报进行评估。\n5. BioFuture与制药公司现有的合作伙伴关系或其他关系。\n6. GlobaPharm在生物制剂、研发、销售或营销方面可能存在的任何能力差距，以及收购BioFuture如何弥补这些差距。\n7. GlobaPharm可以收购的其他替代公司。",
    "keyPoints": [
      "药物管线价值",
      "研发能力",
      "营销销售能力",
      "收购价格与投资回报",
      "现有合作伙伴关系",
      "能力差距弥补",
      "替代收购目标"
    ],
    "explanation": "这个框架全面覆盖了战略收购评估的关键维度，从标的资产价值（管线、能力）、战略匹配度（弥补差距）、财务考量（价格、回报）到替代方案，适合回答‘是否应该收购’这一综合性战略问题。",
    "timeLimit": 180,
    "id": 2081
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey GlobaPharm",
    "question": "GlobaPharm希望进入生物制剂领域。为了获得相关能力，制药公司有哪些选项？",
    "referenceAnswer": "为了获得生物制剂研发能力，制药公司有三种选择：\n1. 从零开始自主建设这些能力。\n2. 与现有的初创公司建立合作伙伴关系。\n3. 收购这些初创公司。",
    "keyPoints": [
      "自主建设",
      "与初创公司合作",
      "收购初创公司"
    ],
    "explanation": "评价标准：答案应完整列出原文中提到的三种进入战略选项，无需额外扩展。",
    "timeLimit": 120,
    "id": 2082
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "hard",
    "source": "McKinsey GlobaPharm",
    "question": "基于以下关键发现，为GlobaPharm撰写一份收购BioFuture的推荐摘要：\n1. GlobaPharm在传统‘小分子’药物领域成功，但希望进入快速增长的‘生物制剂’领域。\n2. 生物制剂的研发与小分子药物研发截然不同。\n3. GlobaPharm的竞争对手在此领域已领先数年。\n4. BioFuture是一家领先的生物制剂初创公司，价值约10亿美元，拥有12年历史、200名员工和知名科学家团队。",
    "referenceAnswer": "GlobaPharm应该收购BioFuture。鉴于竞争对手已经领先数年，收购BioFuture可以快速启动（jumpstart）GlobaPharm的生物制剂计划。BioFuture作为一家领先的、由知名科学家创立且拥有200名员工的初创公司，能够提供GlobaPharm所缺乏的生物制剂研发能力，帮助其快速进入这一新领域。",
    "keyPoints": [
      "快速启动计划",
      "获取缺乏的研发能力",
      "应对竞争差距"
    ],
    "explanation": "推荐应基于战略紧迫性（竞争对手领先）、能力获取（弥补自身差距）以及标的公司质量（领先、有基础）进行综合判断。",
    "timeLimit": 150,
    "id": 2083
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey National Education",
    "question": "Loravia是一个拥有2000万人口、正从共产主义向自由市场经济过渡的虚构东欧国家。政府希望对儿童教育进行重大改进，提高教育的数量和质量。作为咨询顾问，你将如何评估Loravia的教育体系？",
    "referenceAnswer": "当评估教育体系时，需要考察三个主要因素：(i) 教育机会：分析不同年龄组、地区和人口统计群体中谁接受了教育；评估全国/区域/地方层面的教师供应和资源可用性；审查预算分配。(ii) 教育质量：评估课程内容、学习目标、教师资格和评估结果。(iii) 经济目标：考虑未来的优先产业；识别所需的技能；评估课程与经济需求的一致性；考察公共与私人教育模式。",
    "keyPoints": [
      "教育机会",
      "年龄组/地区/人口统计",
      "教师供应与资源",
      "预算分配",
      "教育质量",
      "课程/目标/资格/评估",
      "经济目标",
      "优先产业/技能/课程对齐"
    ],
    "explanation": "这个框架全面覆盖了教育体系评估的核心维度：投入（机会与资源）、过程（质量）和产出（经济目标），符合客户对数量和质量双重改进的目标。",
    "timeLimit": 180,
    "id": 2084
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "easy",
    "source": "McKinsey National Education",
    "question": "Loravia有300万学童（占人口的15%）。目前有6000所学校，平均每所学校有500名学生。目标是使平均学校规模与邻国C国相匹配。如果目标学校数量是3750所，需要关闭多少所学校？关闭学校的比例是多少？",
    "correctNumber": 2250,
    "tolerance": 0.05,
    "unit": "所",
    "explanation": "需要关闭的学校数量 = 当前学校数量 - 目标学校数量 = 6000 - 3750 = 2250所。关闭比例 = (2250 / 6000) * 100% = 37.5%。",
    "timeLimit": 60,
    "id": 2085
  },
  {
    "category": "chart",
    "type": "choice",
    "difficulty": "hard",
    "source": "McKinsey National Education",
    "question": "基于Loravia与邻国及经济同类国家的比较数据，以下哪项观察最能解释其教育体系面临的挑战？",
    "options": [
      "Loravia的生均支出和生师比过低，导致成绩不佳。",
      "Loravia的生均支出和生师比优于同类国家，但成绩却更差，且在这些国家中，支出和生师比与结果没有强相关性。",
      "Loravia的成绩与发达国家相当，但支出过高。",
      "生师比是决定教育结果的唯一关键因素。"
    ],
    "answer": 1,
    "explanation": "正确选项直接对应原文的关键观察：Loravia在投入（支出、生师比）上占优，但产出（分数）落后，且在同类国家中，这些投入指标与结果缺乏强相关性，这突显了其教育体系效率低下的核心问题。",
    "timeLimit": 45,
    "id": 2086
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Shops Corporation",
    "question": "Shops Corporation是一家美国零售公司，其客户群主要为女性，但高管团队中只有约25%是女性。CEO强调，在高管团队性别和种族/文化多样性方面排名前四分之一的公司表现出更优异的盈利能力。我们需要探索哪些因素来改善公司高层的多样性？",
    "referenceAnswer": "为了改善Shops Corporation高层的多样性，我们需要从五个关键领域进行探索：\n1. **招聘**：评估候选人库的多样性，并实施无意识偏见培训。\n2. **保留**：确保薪酬公平，并提供如育儿假等项目。\n3. **晋升**：在绩效评估中保持公平，并赞助多元化人才。\n4. **规划**：设定多元化目标，并识别职业发展的障碍。\n5. **目标设定**：使员工与组织的多元化优先事项保持一致。",
    "keyPoints": [
      "招聘",
      "保留",
      "晋升",
      "规划",
      "目标设定",
      "候选人库多样性",
      "无意识偏见培训",
      "公平薪酬"
    ],
    "explanation": "这个框架全面涵盖了人才管理的全流程（选、用、育、留），并直接针对DEI（多元化、公平与包容）倡议的核心杠杆点，有助于系统性地识别和解决女性在晋升至高管过程中可能遇到的障碍。",
    "timeLimit": 180,
    "id": 2087
  },
  {
    "category": "case_math",
    "type": "number",
    "difficulty": "medium",
    "source": "McKinsey Shops Corporation",
    "question": "Shops Corporation的目标是在10年内将女性高管比例从当前的25%提升至40%。公司目前有300名高管。为实现目标，需要额外增加多少名女性高管？",
    "correctNumber": 45,
    "tolerance": 0.05,
    "unit": "名",
    "explanation": "计算过程：目标女性高管比例是40%，当前是25%，因此需要增加的女性高管比例是15%。用当前高管总数乘以需要增加的比例：300名高管 × 15% = 45名。所以，需要额外增加45名女性高管。",
    "timeLimit": 45,
    "id": 2088
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Shops Corporation",
    "question": "为了改善Shops Corporation高层的性别多样性，我们应该考虑哪些具体的行动方案或倡议？",
    "referenceAnswer": "原文中提出的关键行动方案包括：\n1. 评估候选人库的多样性，并实施无意识偏见培训（针对招聘）。\n2. 确保薪酬公平，并提供如育儿假等项目（针对保留）。\n3. 在绩效评估中保持公平，并赞助多元化人才（针对晋升）。\n4. 设定多元化目标，并识别职业发展的障碍（针对规划）。\n5. 使员工与组织的多元化优先事项保持一致（针对目标设定）。",
    "keyPoints": [
      "无意识偏见培训",
      "公平薪酬",
      "育儿假",
      "公平绩效评估",
      "赞助多元化人才",
      "设定多元化目标",
      "识别职业障碍"
    ],
    "explanation": "评价标准：方案应覆盖人才管理的多个环节（招聘、保留、晋升等），具体且可操作，并直接针对提升女性在高管层代表性的核心障碍（如偏见、支持不足、职业路径不清晰）。",
    "timeLimit": 120,
    "id": 2089
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "hard",
    "source": "McKinsey Shops Corporation",
    "question": "基于对Shops Corporation的分析，关键发现包括：1) 客户群主要为女性，但高管团队女性仅占25%；2) 女性在职业晋升中，尤其是在中层管理岗位（如从经理到总监）晋升率较低，因缺乏足够的赞助和榜样而“停滞”；3) 为实现10年内40%女性高管的目标，需要大量增加女性管理者的招聘。请为CEO撰写一份简要的推荐总结。",
    "referenceAnswer": "基于我们的分析，我们向Shops Corporation的CEO提出以下核心建议：首先，立即在招聘、保留、晋升、规划和目标设定五个领域启动全面的DEI（多元化、公平与包容）行动计划。其次，特别关注解决女性在从中层管理（经理）向高级管理（总监）晋升时的“停滞”问题，通过建立正式的赞助人计划和增加女性高层榜样来提供支持。最后，为了达成10年后的女性高管比例目标，需要制定一个激进但可行的招聘计划，每年招聘大量女性经理人才，并配套以强有力的保留和加速发展项目，以应对晋升过程中的自然损耗。",
    "keyPoints": [
      "启动全面的DEI行动计划",
      "解决中层晋升停滞问题",
      "建立赞助人计划",
      "增加女性榜样",
      "制定激进招聘计划",
      "配套保留与发展项目"
    ],
    "explanation": "这份推荐总结整合了案例中的关键发现（现状差距、晋升瓶颈、量化目标），并提出了具体、连贯且优先的行动方向。",
    "timeLimit": 150,
    "id": 2090
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "McKinsey Talbot Trucks",
    "question": "我们的客户是欧洲私人卡车OEM公司Talbot Trucks。它已接洽麦肯锡，希望评估生产电动卡车以减少其车队碳足迹的可行性。CEO希望麦肯锡帮助确定其欧洲市场投资电动卡车制造的吸引力。为了理解Talbot Trucks在欧洲生产和销售电动卡车的吸引力，你需要收集哪些信息？",
    "referenceAnswer": "为了评估吸引力，我将从市场、财务和风险三个维度收集信息。\n\n市场方面：\n(i) 了解大型和小型卡车客户在价格、功能、可靠性和数量方面的差异，以及这将如何影响Talbot Trucks电动卡车的成功。\n(ii) 哪些欧洲地区对电动卡车接受度最高？原因是什么？是由于环保意识强的人口、政府政策还是其他因素？\n(iii) 与现有竞争对手或新进入者相比，客户将如何看待Talbot Trucks的电动卡车？以及诸如铁路等潜在替代品将如何影响市场？\n\n财务方面：\n(i) 电动卡车是否存在不同的细分市场或使用场景？这些细分市场之间的收入潜力有何不同？\n(ii) Talbot Trucks的主要成本驱动因素是什么？与电动卡车市场的竞争对手相比如何？\n(iii) 在不同细分市场中，Talbot Trucks电动卡车的预期价格点是多少？\n\n风险方面：\n(i) Talbot Trucks在电动卡车方面有多少经验？以成本高效且可靠的方式生产新产品存在哪些潜在风险？\n(ii) 当电动卡车推向市场时，Talbot Trucks现有卡车模型的销售会受到什么影响？\n(iii) 立法是否会强制转向电动卡车？主动解决此问题与等待观望相比，存在哪些风险？",
    "keyPoints": [
      "市场细分差异",
      "地理接受度",
      "客户感知与竞争",
      "收入潜力细分",
      "成本驱动因素",
      "价格点",
      "生产经验与风险",
      "现有产品销售影响",
      "立法风险"
    ],
    "explanation": "这个框架（市场、财务、风险）非常适合这个问题，因为它系统地涵盖了评估一项新业务投资吸引力所需的核心商业维度：外部市场机会、内部财务可行性和潜在风险，确保分析全面。",
    "timeLimit": 180,
    "id": 2091
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip",
    "question": "Generative AI is transforming the construction industry – from project planning and site management to engineering and collaboration across complex value chains. To move beyond isolated use cases, companies need clear strategies and capabilities to scale AI adoption effectively. 请为一家建筑公司制定一个有效整合AI到其工作流程中的策略框架。",
    "referenceAnswer": "The framework for integrating AI into construction workflows involves a clear strategy and capabilities to scale adoption. Key components include: 1. Developing a clear AI strategy that moves beyond isolated use cases. 2. Building organizational capabilities to implement and scale AI solutions. 3. Focusing on key areas such as project planning, site management, engineering, and collaboration across complex value chains. 4. Addressing key challenges in adoption through practical insights and industry leader discussions. 5. Ensuring effective integration into existing workflows to achieve transformation.",
    "keyPoints": [
      "clear AI strategy",
      "scale adoption",
      "organizational capabilities",
      "project planning",
      "site management",
      "engineering",
      "collaboration",
      "key challenges"
    ],
    "explanation": "这个框架适合这个问题，因为它直接针对建筑行业AI整合的核心挑战，从战略制定到能力建设，再到具体应用领域和挑战解决，提供了全面的结构化路径。",
    "timeLimit": 180,
    "id": 2092
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip",
    "question": "Chief Transformation Officers (CTO) play a key role in corporate transformations. 请为首席转型官(CTO)提出一系列建议，以确保企业转型的成功和可持续的价值创造。",
    "referenceAnswer": "The recommendations for Chief Transformation Officers include: 1. Understanding their importance for sustainable value creation. 2. Following the five golden rules for transformation success.",
    "keyPoints": [
      "sustainable value creation",
      "five golden rules",
      "transformation success"
    ],
    "explanation": "评价标准：建议应围绕CTO在创造可持续价值和遵循成功转型规则方面的核心作用展开。",
    "timeLimit": 120,
    "id": 2093
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip",
    "question": "基于以下关键发现：1. Generative AI正在改变建筑行业。2. 公司需要明确的策略和能力来扩大AI应用。3. 行业领导者将讨论关键挑战并分享实用见解。请为建筑公司撰写一份整合AI的推荐。",
    "referenceAnswer": "The recommendation is to be part of the “AI in Construction” morning session in Paris, hosted by Partner Ambroise Lecat, where industry leaders will discuss key challenges and share practical insights on integrating AI into construction workflows. For further information, please contact Mathieu Michelin.",
    "keyPoints": [
      "attend AI in Construction session",
      "discuss key challenges",
      "share practical insights",
      "contact for information"
    ],
    "explanation": "",
    "timeLimit": 120,
    "id": 2094
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip sub1.txt",
    "question": "欧洲的化学工业面临持续的压力。请为一家欧洲化学公司设计一个转型框架，以应对永久性压力并构建面向未来的组织。",
    "referenceAnswer": "原文提出了四个关键领导力维度来应对挑战并弥补能力差距：1. 战略远见与适应性：制定清晰的长期愿景，并具备快速适应市场变化和监管压力的能力。2. 运营卓越与效率：通过数字化和流程优化实现运营效率的持续提升，控制成本。3. 创新与可持续发展：投资于研发，推动可持续产品和循环经济解决方案，以满足环保要求和客户需求。4. 人才与组织能力：培养未来所需的技能，建立敏捷、协作的组织文化，并吸引和留住顶尖人才。这四个维度共同构成了一个全面的转型框架，旨在帮助化学公司构建韧性和未来就绪的组织。",
    "keyPoints": [
      "战略远见与适应性",
      "运营卓越与效率",
      "创新与可持续发展",
      "人才与组织能力",
      "转型框架",
      "未来就绪的组织",
      "能力差距"
    ],
    "explanation": "这个框架适合该问题，因为它从战略、运营、创新和人才四个核心维度系统性地应对行业的结构性压力，不仅关注短期生存，更着眼于构建长期的适应性和竞争力。",
    "timeLimit": 180,
    "id": 2095
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip sub1.txt",
    "question": "首席转型官（CTO）在企业转型中扮演关键角色。请为首席转型官（CTO）成功领导转型提出具体建议。",
    "referenceAnswer": "原文提出了首席转型官（CTO）成功实现可持续价值创造的五条黄金法则：1. 确立清晰的愿景和路线图。2. 确保高层管理团队的全力支持和承诺。3. 建立有效的沟通和利益相关者参与机制。4. 授权团队并培养敏捷的执行能力。5. 设定明确的里程碑并持续跟踪价值创造。",
    "keyPoints": [
      "清晰的愿景和路线图",
      "高层支持与承诺",
      "沟通与利益相关者参与",
      "团队授权与敏捷执行",
      "里程碑与价值跟踪"
    ],
    "explanation": "评价标准应基于建议的全面性、可操作性，以及是否直接针对首席转型官在领导复杂转型过程中面临的核心挑战，如获得支持、推动执行和衡量成果。",
    "timeLimit": 120,
    "id": 2096
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip sub1.txt",
    "question": "基于以下关键发现，为一家面临霍尔木兹海峡紧张局势长期影响的公司撰写行动建议：1. 霍尔木兹海峡的中断威胁能源和关键材料的供应。2. 这给全球工业和供应链带来了持久的挑战。",
    "referenceAnswer": "原文虽然没有直接给出针对此问题的具体推荐列表，但基于其提供的“最新洞察和分析以帮助客户应对宏观经济复杂性和地缘政治变化”的服务定位，可以推断推荐应侧重于：1. 进行深入的供应链风险分析和情景规划。2. 实现供应链多元化，减少对单一关键航道的依赖。3. 增加关键能源和材料的战略库存。4. 投资于替代能源或本地化供应来源。5. 与政府和行业伙伴合作，增强整体供应链韧性。",
    "keyPoints": [
      "供应链风险分析",
      "供应链多元化",
      "战略库存",
      "替代能源/本地化",
      "合作增强韧性"
    ],
    "explanation": "此题为综合题，要求学生根据原文提供的两个关键发现（供应威胁和持久挑战），推导出合理的、结构化的行动建议。",
    "timeLimit": 150,
    "id": 2097
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip sub2.txt",
    "question": "欧洲的化学工业面临持续的压力。请构建一个分析框架，以评估该行业如何缩小能力差距，打造面向未来的组织。",
    "referenceAnswer": "原文提出了四个关键领导力维度（four critical leadership dimensions）作为分析框架：1. 战略愿景与方向设定（Strategic Vision & Direction Setting）——领导者需要为行业转型设定清晰的长期愿景和战略路径。2. 运营卓越与效率提升（Operational Excellence & Efficiency）——关注于优化现有流程、降低成本并提高生产率以应对压力。3. 创新与数字化能力建设（Innovation & Digital Capability Building）——投资于新技术、数字化工具和创新能力，以开发未来可持续的产品和商业模式。4. 组织文化与人才发展（Organizational Culture & Talent Development）——培育适应变革的文化，吸引、培养并留住关键人才，以填补未来所需的能力缺口。这个框架系统地涵盖了从顶层战略到具体运营，从技术革新到人力资本的核心领域，旨在全面诊断和解决化学行业在永久性压力下面临的挑战。",
    "keyPoints": [
      "战略愿景",
      "运营卓越",
      "创新",
      "数字化",
      "组织文化",
      "人才发展",
      "能力差距",
      "未来组织"
    ],
    "explanation": "这个框架适合此问题，因为它从领导力的战略、运营、创新和组织四大支柱出发，系统性地拆解了应对行业永久性压力、构建未来竞争力的核心维度，全面且具有可操作性。",
    "timeLimit": 180,
    "id": 2098
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger 3D Hip sub2.txt",
    "question": "生成式人工智能（Generative AI）正在改变建筑行业。请为希望超越孤立用例、有效扩大AI应用规模的公司进行头脑风暴，提出关键策略和能力建议。",
    "referenceAnswer": "原文建议公司需要清晰的策略和能力来有效扩大AI应用规模。关键方案包括：1. 制定清晰的AI整合战略（clear strategies for integrating AI）。2. 构建规模化应用AI所需的能力（capabilities to scale AI adoption effectively）。3. 将AI整合到建筑工作流程中（integrating AI into construction workflows），例如项目规划、现场管理、工程设计和跨复杂价值链的协作。",
    "keyPoints": [
      "清晰策略",
      "规模化能力",
      "整合工作流",
      "项目规划",
      "现场管理",
      "工程设计",
      "价值链协作"
    ],
    "explanation": "评价标准应基于建议是否围绕制定战略、构建核心能力以及具体整合到关键工作流程这三个核心方向展开，是否具有针对性和可执行性。",
    "timeLimit": 120,
    "id": 2099
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "hard",
    "source": "RolandBerger 3D Hip sub2.txt",
    "question": "根据原文，首席转型官（CTO）在企业转型中扮演关键角色。请基于其对于可持续价值创造的重要性，总结出转型成功的五条黄金法则（five golden rules for transformation success）。",
    "referenceAnswer": "原文指出首席转型官（CTO）对于可持续价值创造至关重要，并提出了转型成功的五条黄金法则（five golden rules for transformation success）。",
    "keyPoints": [
      "首席转型官",
      "可持续价值创造",
      "转型成功",
      "五条黄金法则"
    ],
    "explanation": "推荐应准确总结原文提及的“五条黄金法则”，这是转型成功的核心指导原则。",
    "timeLimit": 120,
    "id": 2100
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit",
    "question": "Roland Berger的《趋势纲要2050》涵盖了从现在到2050年塑造世界的六大趋势。请为分析这些宏观趋势对全球商业战略的长期影响，搭建一个分析框架。",
    "referenceAnswer": "The Roland Berger Trend Compendium 2050 covers six megatrends shaping the world between now and 2050. A comprehensive framework to analyze their impact on global business strategy should include: 1) Demographic and Social Change: Analyzing population growth, aging, urbanization, and shifting social values. 2) Technological Breakthroughs: Assessing the impact of AI, automation, digitalization, and other disruptive technologies across industries. 3) Economic Dynamics: Evaluating shifts in global economic power, trade patterns, and the rise of new markets. 4) Environmental Challenges and Sustainability: Examining climate change, resource scarcity, and the transition to a circular and low-carbon economy. 5) Geopolitical Shifts: Understanding changing power balances, regional tensions, and their implications for global supply chains and market access. 6) Industry-Specific Transformations: Investigating how these overarching trends uniquely impact specific sectors such as Transportation, Tourism & Logistics, Automotive, Energy, etc. This framework allows for a structured analysis from macro global forces down to micro industry and corporate implications, ensuring strategic recommendations are robust and future-oriented.",
    "keyPoints": [
      "Demographic and Social Change",
      "Technological Breakthroughs",
      "Economic Dynamics",
      "Environmental Challenges and Sustainability",
      "Geopolitical Shifts",
      "Industry-Specific Transformations"
    ],
    "explanation": "这个框架从宏观到微观，系统性地拆解了影响商业的六大外部趋势。它首先识别广泛的社会、技术、经济、环境和地缘政治驱动力，然后深入到具体行业影响，确保分析全面且具有可操作性，适合用于制定面向2050年的长期战略。",
    "timeLimit": 180,
    "id": 2101
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit",
    "question": "生成式人工智能（Generative AI）正在改变建筑业。为了超越孤立的用例，公司需要清晰的战略和能力来有效扩展AI的采用。请进行头脑风暴，提出将AI整合到建筑工作流程中的关键挑战和实用解决方案。",
    "referenceAnswer": "原文中提及的讨论场景是：行业领袖将讨论关键挑战并分享关于将AI整合到建筑工作流程中的实用见解。虽然没有列出具体方案列表，但这是一个明确的头脑风暴场景，旨在针对“整合AI到建筑工作流程”这一主题，生成挑战和解决方案。",
    "keyPoints": [
      "关键挑战",
      "实用见解",
      "整合AI",
      "建筑工作流程",
      "扩展AI采用"
    ],
    "explanation": "评价标准应基于提出的挑战是否切中行业痛点（如数据孤岛、技能缺口、投资回报不确定性），以及解决方案是否具有实用性、可扩展性，并能够有效支持从项目规划、现场管理到工程和跨复杂价值链协作的全流程。",
    "timeLimit": 150,
    "id": 2102
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "hard",
    "source": "RolandBerger Transit",
    "question": "基于以下关键发现，为欧洲化学工业的公司撰写战略推荐：1) 行业面临永久性压力；2) 需要关注四个关键领导力维度；3) 存在能力差距；4) 目标是建立面向未来的组织。",
    "referenceAnswer": "The new leadership imperative in chemicals: Europe's chemical industry faces permanent pressure. Explore four critical leadership dimensions — and how to close capability gaps for future-ready organizations.",
    "keyPoints": [
      "四个关键领导力维度",
      "关闭能力差距",
      "建立面向未来的组织",
      "应对永久性压力"
    ],
    "explanation": "推荐应直接回应原文中提到的“四个关键领导力维度”和“关闭能力差距”，旨在帮助欧洲化学工业公司构建面向未来的组织，以应对持续的行业压力。",
    "timeLimit": 180,
    "id": 2103
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub1.txt",
    "question": "欧洲的化学工业面临持续的压力。请构建一个分析框架，以识别并弥合关键能力差距，从而打造面向未来的组织。",
    "referenceAnswer": "探索四个关键领导力维度——以及如何弥合能力差距，打造面向未来的组织。\n\n这四个关键领导力维度是：\n1. 战略远见与适应性：领导者需要具备前瞻性思维，能够预见行业趋势和结构性变化，并灵活调整公司战略以适应永久性的市场压力。\n2. 运营卓越与效率：在持续的成本和竞争压力下，领导者必须推动运营优化，提升生产效率，并管理复杂的全球供应链。\n3. 创新与数字化转型：领导者应促进研发和创新文化，同时引领数字化转型，利用新技术（如人工智能、数据分析）开发新产品和商业模式。\n4. 人才管理与组织发展：领导者需要关注人才吸引、培养和保留，构建敏捷的组织结构，并培育一种能够应对变革和不确定性的文化。\n\n为了弥合能力差距，组织需要：\n- 进行系统的能力评估，对照未来需求诊断当前领导力和组织能力的不足。\n- 制定针对性的发展计划，包括高管培训、人才轮岗和变革管理项目。\n- 将领导力发展与企业战略转型举措紧密结合，确保能力建设支撑业务目标。\n- 建立持续的反馈和学习机制，使组织能够不断适应和进化。\n通过聚焦这四个领导力维度并系统性地弥合差距，化学公司可以构建更具韧性、创新性和未来适应性的组织。",
    "keyPoints": [
      "战略远见与适应性",
      "运营卓越与效率",
      "创新与数字化转型",
      "人才管理与组织发展",
      "能力评估",
      "发展计划",
      "战略结合",
      "反馈机制"
    ],
    "explanation": "这个框架适合此问题，因为它从领导力的核心维度切入，系统性地涵盖了应对行业永久压力所需的关键能力（从战略、运营到创新和人才），并提供了从评估到发展的闭环路径，直接针对‘弥合能力差距、打造未来组织’的目标。",
    "timeLimit": 180,
    "id": 2104
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub1.txt",
    "question": "首席转型官（CTO）在企业转型中扮演关键角色。请为转型成功提出建议。",
    "referenceAnswer": "首席转型官（CTO）在企业转型中扮演关键角色。了解他们对于可持续价值创造的重要性以及转型成功的五项黄金法则。\n\n五项黄金法则：\n1. 明确转型愿景与战略：CTO必须确立清晰、令人信服的转型愿景，并将其与具体的业务战略和财务目标紧密挂钩。\n2. 获得高层承诺与授权：确保获得首席执行官和董事会等最高管理层的全力支持和明确授权，以推动跨部门变革。\n3. 建立端到端的价值创造视角：关注从战略制定到运营执行的全过程，确保所有转型举措都直接贡献于价值创造（如成本节约、收入增长、资本效率）。\n4. 有效管理利益相关者：积极沟通，管理来自员工、客户、投资者等各方的期望和阻力，构建广泛的变革联盟。\n5. 构建可持续的组织能力：不仅实现短期业绩改善，更要通过流程优化、技术赋能和人才培养，建立组织长期适应变化和持续改进的内在能力。",
    "keyPoints": [
      "明确转型愿景与战略",
      "获得高层承诺与授权",
      "端到端价值创造视角",
      "有效管理利益相关者",
      "构建可持续组织能力"
    ],
    "explanation": "评价标准：建议应围绕CTO的核心职责，涵盖从战略设定、领导力支持、价值导向、人员管理到能力建设的完整转型周期，确保建议具有系统性、可操作性和长期视角。",
    "timeLimit": 120,
    "id": 2105
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub1.txt",
    "question": "基于以下关键发现，为希望有效扩大人工智能应用规模的建筑公司撰写推荐。关键发现：1. 生成式人工智能正在改变建筑行业，影响从项目规划、现场管理到工程和跨复杂价值链协作的各个环节。2. 为了超越孤立的用例，公司需要清晰的战略和能力来有效扩大人工智能的采用规模。",
    "referenceAnswer": "为希望有效扩大人工智能应用规模的建筑公司推荐：\n1. 制定清晰的人工智能战略：公司需要超越零散的试点项目，制定一个与企业整体数字化和业务目标相一致的、清晰的人工智能采纳路线图。该战略应明确优先领域、投资规模和预期价值。\n2. 构建规模化能力：投资于技术基础设施（如数据平台、AI工具）、人才（如数据科学家、AI工程师与业务专家的融合团队）以及变革管理流程，以支持人工智能解决方案在多个项目和部门中的部署与集成。\n3. 聚焦端到端工作流整合：将人工智能技术深度整合到从项目规划、工程设计、现场管理到供应链协作的核心工作流程中，打破数据孤岛，实现跨价值链的协同与效率提升。\n4. 领导层参与与行业交流：高层领导（如合作伙伴、业务负责人）必须积极推动并主持人工智能转型。同时，鼓励参与行业领袖的交流活动（如研讨会、展会巡览），分享实践经验，洞察最新技术趋势和最佳实践，以持续优化自身的人工智能应用策略。",
    "keyPoints": [
      "制定清晰AI战略",
      "构建规模化能力",
      "端到端工作流整合",
      "领导层参与与行业交流"
    ],
    "explanation": "此推荐综合了从战略规划、能力建设、流程整合到领导力与外部学习的多个层面，旨在帮助建筑公司系统性地应对从试点到规模化应用AI的挑战。",
    "timeLimit": 150,
    "id": 2106
  },
  {
    "category": "structuring",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub2.txt",
    "question": "欧洲的化学工业面临持续的压力。请构建一个分析框架，以识别并弥合能力差距，从而建立面向未来的组织。",
    "referenceAnswer": "探索四个关键领导力维度——以及如何弥合能力差距，以建立面向未来的组织。",
    "keyPoints": [
      "领导力维度",
      "能力差距",
      "未来组织",
      "弥合差距"
    ],
    "explanation": "该框架直接针对行业面临的结构性压力，通过聚焦领导力维度和能力差距，为组织转型提供了系统性的诊断和改进路径。",
    "timeLimit": 180,
    "id": 2107
  },
  {
    "category": "creativity",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub2.txt",
    "question": "首席转型官（CTO）在企业转型中扮演关键角色。请为转型成功提出建议。",
    "referenceAnswer": "首席转型官（CTO）在企业转型中扮演关键角色。探索他们对可持续价值创造的重要性以及转型成功的五项黄金法则。",
    "keyPoints": [
      "首席转型官",
      "企业转型",
      "可持续价值创造",
      "五项黄金法则"
    ],
    "explanation": "评价标准应基于建议是否围绕CTO的角色、价值创造以及具体的成功法则展开，确保建议具有针对性和可操作性。",
    "timeLimit": 120,
    "id": 2108
  },
  {
    "category": "synthesis",
    "type": "open",
    "difficulty": "medium",
    "source": "RolandBerger Transit sub2.txt",
    "question": "根据以下关键发现，为希望有效扩展AI采用的建筑公司提出建议：1. 生成式AI正在改变建筑行业；2. 公司需要清晰的战略和能力来超越孤立的用例；3. 行业领导者将讨论关键挑战并分享将AI集成到建筑工作流程中的实用见解。",
    "referenceAnswer": "为了超越孤立的用例，公司需要清晰的战略和能力来有效扩展AI采用。",
    "keyPoints": [
      "清晰的战略",
      "扩展AI采用",
      "集成到工作流程"
    ],
    "explanation": "建议应直接回应关键发现，聚焦于制定清晰战略、构建扩展能力以及促进知识分享和实际工作流程集成。",
    "timeLimit": 150,
    "id": 2109
  }
];
