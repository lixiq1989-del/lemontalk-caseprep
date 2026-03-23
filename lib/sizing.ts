// Market Sizing - step-by-step guided flow

export interface SizingStep {
  id: string;
  question: string;
  hint?: string;
  type: "choice" | "number";
  // For choice
  options?: { label: string; value: number; explanation?: string }[];
  // For number
  unit?: string;
  referenceValue: number;
  tolerance: number; // e.g. 0.3 = ±30%
  // Used to compute running total
  operation: "set" | "multiply" | "divide";
}

export interface SizingCase {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string; // industry tag
  prompt: string;
  approach: string; // top-down or bottom-up
  steps: SizingStep[];
  finalUnit: string;
  finalExplanation: string;
  sanityCheck?: string;
}

export const SIZING_CASES: SizingCase[] = [
  {
    id: 1,
    title: "北京有多少家理发店？",
    difficulty: "easy",
    category: "服务业",
    prompt: "请估算北京市大约有多少家理发店。",
    approach: "自上而下（需求端）",
    steps: [
      {
        id: "population",
        question: "北京常住人口大约多少？",
        type: "choice",
        options: [
          { label: "约 1,500 万", value: 1500, explanation: "偏低，实际更多" },
          { label: "约 2,200 万", value: 2200, explanation: "接近实际数据（约2,180万）" },
          { label: "约 3,000 万", value: 3000, explanation: "偏高，含流动人口也没这么多" },
        ],
        referenceValue: 2200,
        tolerance: 0.2,
        operation: "set",
      },
      {
        id: "frequency",
        question: "平均每人多久理一次发？",
        hint: "想想男性和女性的区别",
        type: "choice",
        options: [
          { label: "每月 1 次（12次/年）", value: 12, explanation: "男性差不多，但女性频率更低" },
          { label: "约 6 周一次（8次/年）", value: 8, explanation: "男女平均比较合理" },
          { label: "每季度 1 次（4次/年）", value: 4, explanation: "偏低，大部分人不会等3个月" },
        ],
        referenceValue: 8,
        tolerance: 0.3,
        operation: "multiply",
      },
      {
        id: "daily_capacity",
        question: "一家理发店每天能服务多少位客人？",
        hint: "想想有几个理发师，每人每天接几单",
        type: "number",
        unit: "人/天",
        referenceValue: 20,
        tolerance: 0.4,
        operation: "divide",
      },
      {
        id: "working_days",
        question: "理发店一年营业多少天？",
        type: "choice",
        options: [
          { label: "约 300 天", value: 300, explanation: "大部分理发店全年几乎无休" },
          { label: "约 350 天", value: 350, explanation: "很多理发店只春节休几天" },
          { label: "约 250 天（和上班族一样）", value: 250, explanation: "偏低，服务业比坐班多" },
        ],
        referenceValue: 330,
        tolerance: 0.15,
        operation: "divide",
      },
    ],
    finalUnit: "家",
    finalExplanation: "2,200万人 × 8次/年 ÷ 20人/天 ÷ 330天 ≈ 26,700 家。实际北京约有 3-4 万家理发相关门店（含美容美发），我们的估算在合理范围内。",
    sanityCheck: "可以反过来验证：如果每个小区周围有 3-5 家理发店，北京约 7,000 个小区，得出 21,000-35,000 家，量级一致。",
  },
  {
    id: 2,
    title: "中国一年卖多少杯奶茶？",
    difficulty: "easy",
    category: "消费品",
    prompt: "请估算中国每年销售的奶茶杯数。",
    approach: "自上而下（需求端）",
    steps: [
      {
        id: "target_pop",
        question: "中国喝奶茶的目标人群有多大？",
        hint: "主要是城镇年轻人，不是所有14亿人",
        type: "choice",
        options: [
          { label: "约 3 亿（城镇15-45岁）", value: 3, explanation: "比较保守但合理的核心人群" },
          { label: "约 5 亿（含偶尔喝的人群）", value: 5, explanation: "包含了低频消费者" },
          { label: "约 8 亿", value: 8, explanation: "偏高，农村和老年人喝奶茶很少" },
        ],
        referenceValue: 4,
        tolerance: 0.3,
        operation: "set",
      },
      {
        id: "frequency",
        question: "目标人群平均多久喝一杯？",
        type: "choice",
        options: [
          { label: "每周 1 杯（52杯/年）", value: 52, explanation: "重度用户才这样，平均偏高" },
          { label: "每 2 周 1 杯（26杯/年）", value: 26, explanation: "比较合理的平均频率" },
          { label: "每月 1 杯（12杯/年）", value: 12, explanation: "考虑到很多人偶尔喝，可能偏保守但合理" },
        ],
        referenceValue: 20,
        tolerance: 0.4,
        operation: "multiply",
      },
    ],
    finalUnit: "亿杯",
    finalExplanation: "4亿人 × 20杯/年 = 80亿杯。行业数据显示中国奶茶年销量约 100-150 亿杯（含所有茶饮），我们的估算量级正确。关键洞察：这是一个千亿级市场。",
    sanityCheck: "反向验证：全国约 50 万家奶茶店，每店日均卖 50 杯，50万 × 50 × 365 ≈ 91 亿杯，量级一致。",
  },
  {
    id: 3,
    title: "估算中国健身房市场规模",
    difficulty: "medium",
    category: "服务业",
    prompt: "请估算中国商业健身房的年收入市场规模（单位：亿元人民币）。",
    approach: "自上而下（需求端）",
    steps: [
      {
        id: "urban_pop",
        question: "中国城镇人口约多少？",
        type: "choice",
        options: [
          { label: "约 7 亿", value: 7, explanation: "中国城镇化率约65%，14亿×65%≈9亿，7亿偏低" },
          { label: "约 9 亿", value: 9, explanation: "城镇化率约65%，比较准确" },
          { label: "约 12 亿", value: 12, explanation: "偏高" },
        ],
        referenceValue: 9,
        tolerance: 0.2,
        operation: "set",
      },
      {
        id: "gym_rate",
        question: "城镇人口中，健身房会员渗透率大约多少？",
        hint: "中国健身渗透率远低于欧美（约20%），想想你身边有多少人办了卡",
        type: "number",
        unit: "%",
        referenceValue: 5,
        tolerance: 0.4,
        operation: "multiply",
      },
      {
        id: "annual_spend",
        question: "健身房会员平均年消费多少？",
        hint: "包含年卡+私教+其他消费",
        type: "choice",
        options: [
          { label: "约 2,000 元（只买年卡）", value: 2000, explanation: "纯年卡价格，没算私教" },
          { label: "约 4,000 元（年卡+少量私教）", value: 4000, explanation: "比较合理的平均值" },
          { label: "约 8,000 元（重度用户）", value: 8000, explanation: "偏高，大部分人不买很多私教" },
        ],
        referenceValue: 4000,
        tolerance: 0.3,
        operation: "multiply",
      },
    ],
    finalUnit: "亿元",
    finalExplanation: "9亿城镇人口 × 5%渗透率 = 4,500万会员 × 4,000元/年 = 1,800亿元。行业报告显示中国健身行业市场规模约 1,500-2,500 亿元，我们的估算在合理范围。",
    sanityCheck: "供给侧验证：全国约 10 万家健身房，平均年收入 150-200 万，10万 × 175万 = 1,750 亿，量级一致。",
  },
  {
    id: 4,
    title: "上海外卖骑手有多少人？",
    difficulty: "medium",
    category: "互联网",
    prompt: "请估算上海每天活跃的外卖骑手数量。",
    approach: "自上而下（需求端推供给）",
    steps: [
      {
        id: "population",
        question: "上海常住人口约多少？",
        type: "choice",
        options: [
          { label: "约 1,800 万", value: 1800 },
          { label: "约 2,500 万", value: 2500, explanation: "上海常住人口约2,480万" },
          { label: "约 3,200 万", value: 3200 },
        ],
        referenceValue: 2500,
        tolerance: 0.15,
        operation: "set",
      },
      {
        id: "order_rate",
        question: "平均每人每天点多少单外卖？",
        hint: "不是每个人每天都点，要算人均",
        type: "number",
        unit: "单/人/天",
        referenceValue: 0.15,
        tolerance: 0.4,
        operation: "multiply",
      },
      {
        id: "orders_per_rider",
        question: "一个骑手每天平均送多少单？",
        hint: "考虑高峰/低峰，一单约30分钟",
        type: "choice",
        options: [
          { label: "约 20 单", value: 20, explanation: "偏低" },
          { label: "约 30 单", value: 30, explanation: "行业平均水平" },
          { label: "约 50 单", value: 50, explanation: "只有极少数高效骑手能达到" },
        ],
        referenceValue: 30,
        tolerance: 0.25,
        operation: "divide",
      },
    ],
    finalUnit: "万人",
    finalExplanation: "2,500万人 × 0.15单/天 = 37.5万单/天 ÷ 30单/骑手 ≈ 12,500 名骑手。实际上海日活跃骑手约 10,000-15,000 人，估算合理。",
    sanityCheck: "美团+饿了么在上海的注册骑手可能有 5-8 万，但日活跃率约 20-30%，所以日活 1-2 万也合理。",
  },
  {
    id: 5,
    title: "全球每天发多少条微信消息？",
    difficulty: "hard",
    category: "互联网",
    prompt: "请估算微信平台每天处理的消息总量（包括文字、语音、图片等）。",
    approach: "自上而下",
    steps: [
      {
        id: "mau",
        question: "微信月活跃用户约多少？",
        type: "choice",
        options: [
          { label: "约 8 亿", value: 8 },
          { label: "约 13 亿", value: 13, explanation: "微信MAU约13.4亿（含海外WeChat）" },
          { label: "约 18 亿", value: 18 },
        ],
        referenceValue: 13,
        tolerance: 0.2,
        operation: "set",
      },
      {
        id: "dau_rate",
        question: "日活/月活比例（DAU/MAU）大约多少？",
        hint: "微信是超高频应用",
        type: "choice",
        options: [
          { label: "约 60%", value: 0.6 },
          { label: "约 80%", value: 0.8, explanation: "微信DAU/MAU极高，约80%+" },
          { label: "约 95%", value: 0.95 },
        ],
        referenceValue: 0.8,
        tolerance: 0.15,
        operation: "multiply",
      },
      {
        id: "msgs_per_user",
        question: "活跃用户每天平均发多少条消息？",
        hint: "包括私聊、群聊、语音、图片，想想你自己一天发多少",
        type: "number",
        unit: "条/天",
        referenceValue: 50,
        tolerance: 0.4,
        operation: "multiply",
      },
    ],
    finalUnit: "亿条",
    finalExplanation: "13亿 × 80% = 10.4亿日活 × 50条/天 = 520亿条/天。腾讯曾披露微信日均消息量约 450 亿条，我们的估算非常接近。这道题的关键是对 DAU/MAU ratio 和人均发送量的判断。",
    sanityCheck: "如果觉得50条太多，可以分场景：私聊20条 + 群聊25条 + 工作群5条 = 50条，其实很合理。",
  },
];
