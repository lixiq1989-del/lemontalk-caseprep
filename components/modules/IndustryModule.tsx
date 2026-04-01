"use client";

import { useState } from "react";

const INDUSTRIES = [
  {
    id: "retail",
    name: "零售 & 消费品",
    icon: "🛍️",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    keyMetrics: ["同店销售增长（SSSG）", "客单价", "存货周转率", "毛利率", "门店坪效"],
    trends: ["线上线下融合（O2O）", "私域流量运营", "DTC直面消费者", "供应链数字化", "可持续/ESG压力"],
    commonCases: ["利润下降（渠道结构变化）", "新市场进入（跨区域/跨国扩张）", "新品类定价策略", "供应链优化"],
    keyPlayers: ["阿里巴巴", "京东", "唯品会", "名创优品", "泡泡玛特"],
    insight: "中国零售市场正经历结构性变革：电商渗透率已超30%，但线下体验店复兴趋势明显。关注直播电商、社区团购等新业态对传统零售的冲击。",
  },
  {
    id: "healthcare",
    name: "医疗 & 健康",
    icon: "🏥",
    color: "bg-red-50 border-red-200",
    iconBg: "bg-red-100",
    keyMetrics: ["研发费用率（R&D/Revenue）", "药品毛利率", "床位使用率", "患者获取成本", "医院EBITDA"],
    trends: ["互联网医疗平台崛起", "创新药国产替代", "医保控费压力", "老龄化驱动需求", "AI辅助诊断"],
    commonCases: ["医院盈利改善", "药企新产品市场进入", "医疗器械定价策略", "并购医院的整合"],
    keyPlayers: ["阿里健康", "京东健康", "恒瑞医药", "迈瑞医疗", "爱尔眼科"],
    insight: "中国医疗市场受政策影响极大：带量采购（集采）让仿制药利润空间急剧压缩，倒逼企业向创新药和医疗服务转型。关注DRG支付改革对医院运营的冲击。",
  },
  {
    id: "technology",
    name: "科技 & 互联网",
    icon: "💻",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    keyMetrics: ["MAU/DAU（月/日活用户）", "ARPU（用户均值收入）", "GMV", "Take Rate（佣金率）", "LTV/CAC比"],
    trends: ["AI大模型商业化", "To B（企业服务）崛起", "出海（东南亚/中东）", "硬科技投资热潮", "数据安全合规"],
    commonCases: ["平台商业化路径", "新市场/新用户增长", "ToB产品定价", "技术公司并购整合"],
    keyPlayers: ["字节跳动", "腾讯", "阿里云", "华为云", "百度AI"],
    insight: "互联网红利期结束，增长逻辑从用户数量转向用户质量和变现效率。AI是当前最大变量：大模型既是机会（降本增效）也是威胁（颠覆现有商业模式）。",
  },
  {
    id: "finance",
    name: "金融 & 保险",
    icon: "💰",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    keyMetrics: ["净息差（NIM）", "不良贷款率（NPL）", "资本充足率", "综合成本率（保险）", "AUM（资产管理规模）"],
    trends: ["利率市场化压缩银行利润", "金融科技冲击传统银行", "保险增速放缓", "资管行业净值化转型", "监管趋严"],
    commonCases: ["银行盈利能力分析", "保险公司新产品策略", "金融机构数字化转型", "资产管理规模增长"],
    keyPlayers: ["招商银行", "平安集团", "蚂蚁集团", "陆金所", "天天基金"],
    insight: "中国金融业处于深度变革期：利率市场化让银行息差持续收窄，倒逼发展中间业务；保险行业代理人模式受冲击，线上化转型加速；监管严格是所有Case分析的重要约束条件。",
  },
  {
    id: "energy",
    name: "能源 & 工业",
    icon: "⚡",
    color: "bg-yellow-50 border-yellow-200",
    iconBg: "bg-yellow-100",
    keyMetrics: ["LCOE（平准化电力成本）", "产能利用率", "EBITDA margin", "资本回报率（ROIC）", "碳排放强度"],
    trends: ["双碳目标（2030/2060）", "光伏储能成本快速下降", "新能源汽车渗透", "氢能布局", "能源安全国产化"],
    commonCases: ["能源公司转型战略", "新能源市场进入", "传统制造业运营优化", "工厂选址与供应链"],
    keyPlayers: ["宁德时代", "比亚迪", "隆基绿能", "国家电网", "中石化"],
    insight: "中国能源结构转型是全球最大规模的工业革命：光伏和储能成本10年下降90%，新能源装机量连续多年全球第一。但「弃风弃光」和电网改造是当前核心瓶颈。",
  },
  {
    id: "education",
    name: "教育 & 培训",
    icon: "📚",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    keyMetrics: ["学生获客成本（CAC）", "续课率", "教师产能（人均收入）", "班型结构（1v1/小班/大班）", "NPS净推荐值"],
    trends: ["双减政策（K12受限）", "职业教育政策利好", "出海（留学/海外市场）", "AI辅助教学", "企业培训需求增长"],
    commonCases: ["教培机构盈利下滑", "新业务方向选择", "线下转线上策略", "定价与产品组合优化"],
    keyPlayers: ["新东方", "好未来", "猿辅导", "作业帮", "Boss直聘"],
    insight: "2021年双减政策彻底重塑K12赛道：大机构向素质教育、成人教育、职业培训转型。咨询Case中需要把「政策风险」作为核心约束条件，不能用双减前的逻辑分析。",
  },
];

interface IndustryModuleProps {
  initialIndustryId?: string;
}

export default function IndustryModule({ initialIndustryId }: IndustryModuleProps) {
  const [selected, setSelected] = useState<string | null>(initialIndustryId || null);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const industry = INDUSTRIES.find((i) => i.id === selected);

  const getDeepInsight = async () => {
    if (!industry) return;
    setLoadingAI(true);
    setAiInsight("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          message: `作为咨询顾问，给我${industry.name}行业的深度分析（中文，简洁实用）：

1. 当前最重要的1-2个结构性变化（不超过100字）
2. 面试官最喜欢考的Case类型和常见陷阱
3. 让面试官眼前一亮的行业洞察（1个具体的insight，要有数据支撑）`,
          history: [],
        }),
      });
      const data = await res.json();
      setAiInsight(data.response || "");
    } finally {
      setLoadingAI(false);
    }
  };

  if (!selected || !industry) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold">行业 Insights</h1>
        </div>
        <p className="text-muted text-sm mb-6">面试前10分钟速览行业背景，让你的分析更有深度</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setSelected(ind.id)}
              className={`card-hover border rounded-xl p-5 text-left transition-all ${ind.color}`}
            >
              <div className={`w-10 h-10 rounded-lg ${ind.iconBg} flex items-center justify-center text-xl mb-3`}>
                {ind.icon}
              </div>
              <h3 className="font-semibold text-sm">{ind.name}</h3>
              <p className="text-xs text-muted mt-1">{ind.commonCases[0]}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setSelected(null); setAiInsight(""); }} className="text-muted hover:text-primary text-sm">← 选择行业</button>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-bold">{industry.name}</h1>
      </div>

      {/* Core insight */}
      <div className={`border rounded-xl p-5 mb-4 ${industry.color}`}>
        <h2 className="text-sm font-semibold mb-2">核心洞察</h2>
        <p className="text-sm leading-relaxed">{industry.insight}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Key metrics */}
        <div className="border border-border rounded-xl p-5 bg-white">
          <h2 className="text-sm font-semibold mb-3">📊 核心指标</h2>
          <ul className="space-y-1.5">
            {industry.keyMetrics.map((m) => (
              <li key={m} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trends */}
        <div className="border border-border rounded-xl p-5 bg-white">
          <h2 className="text-sm font-semibold mb-3">🔥 当前趋势</h2>
          <ul className="space-y-1.5">
            {industry.trends.map((t) => (
              <li key={t} className="text-sm flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common cases */}
      <div className="border border-border rounded-xl p-5 bg-white mb-4">
        <h2 className="text-sm font-semibold mb-3">📝 常见 Case 类型</h2>
        <div className="flex flex-wrap gap-2">
          {industry.commonCases.map((c) => (
            <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">{c}</span>
          ))}
        </div>
      </div>

      {/* AI Deep Insight */}
      <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-blue-900">🤖 AI 深度解析</h2>
          <button
            onClick={getDeepInsight}
            disabled={loadingAI}
            className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingAI ? "生成中..." : "生成 AI 洞察"}
          </button>
        </div>
        {aiInsight ? (
          <div className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">{aiInsight}</div>
        ) : (
          <p className="text-sm text-blue-700">点击右上角按钮，获取AI对本行业的深度面试洞察</p>
        )}
      </div>

      {/* Key players */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h2 className="text-sm font-semibold mb-3">🏢 代表性公司（面试常被提及）</h2>
        <div className="flex flex-wrap gap-2">
          {industry.keyPlayers.map((p) => (
            <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-gray-100">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
