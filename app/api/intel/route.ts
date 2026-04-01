import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  // Try to get from job_intel table
  const { data, error } = await supabaseAdmin
    .from("job_intel")
    .select("*")
    .gte("confidence", 50)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    return NextResponse.json({ intel: STATIC_INTEL });
  }

  return NextResponse.json({ intel: data });
}

// Demo data until cron runs
const STATIC_INTEL = [
  {
    type: "process_update",
    company: "McKinsey",
    role: "BA暑期实习",
    region: "CN",
    content: "McKinsey中国区2026暑期BA实习已开始发笔试（PST），预计4月第二周出笔试结果。北京/上海/深圳三个office。",
    source_platform: "小红书",
    confidence: 85,
    tags: ["MBB", "笔试", "PST"],
    process_stage: "笔试中",
    process_date: "2026-04-01",
    created_at: "2026-04-01",
  },
  {
    type: "process_update",
    company: "BCG",
    role: "Associate",
    region: "CN",
    content: "BCG上海office春招第一轮Case面试本周进行中，两轮case（一轮interviewer-led + 一轮candidate-led）。有同学反馈case难度适中，重点考察结构化思维。",
    source_platform: "牛客",
    confidence: 80,
    tags: ["MBB", "一面", "Case"],
    process_stage: "一面",
    process_date: "2026-03-31",
    created_at: "2026-03-31",
  },
  {
    type: "process_update",
    company: "Bain",
    role: "AC实习",
    region: "CN",
    content: "Bain北京office 2026暑期AC实习网申截止日延长至4月15日。今年新增了Written Case环节，在一面之前。",
    source_platform: "公众号",
    confidence: 90,
    tags: ["MBB", "网申", "Written Case"],
    process_stage: "网申开放",
    process_date: "2026-04-15",
    created_at: "2026-03-30",
  },
  {
    type: "interview_exp",
    company: "McKinsey",
    role: "BA",
    region: "CN",
    content: "刚做完McKinsey PST笔试，26题65分钟，比往年难。数学题增加了，有3-4道需要多步计算。图表题也比较多，建议提前练chart interpretation。",
    source_platform: "小红书",
    confidence: 70,
    tags: ["MBB", "PST", "笔试经验"],
    created_at: "2026-03-29",
  },
  {
    type: "process_update",
    company: "Goldman Sachs",
    role: "IB Analyst",
    region: "HK",
    content: "Goldman Sachs香港IB Summer Analyst已进入superday阶段。TMT和Healthcare组面试人数比去年多，竞争激烈。",
    source_platform: "脉脉",
    confidence: 75,
    tags: ["投行", "终面", "superday"],
    process_stage: "终面",
    process_date: "2026-03-28",
    created_at: "2026-03-28",
  },
  {
    type: "process_update",
    company: "BCG",
    role: "Associate",
    region: "UK",
    content: "BCG London office第一轮面试已结束，本周开始发二面邀请。据说今年申请量同比+30%，通过率更低。",
    source_platform: "LinkedIn",
    confidence: 75,
    tags: ["MBB", "UK", "二面"],
    process_stage: "二面",
    process_date: "2026-04-01",
    created_at: "2026-03-28",
  },
  {
    type: "referral",
    company: "字节跳动",
    role: "战略分析实习",
    region: "CN",
    content: "字节跳动商业化战略分析团队暑期实习内推开放中，base北京/上海。需要较强的数据分析能力，有咨询实习经验加分。内推码有效期至4月10日。",
    source_platform: "牛客",
    confidence: 80,
    tags: ["互联网", "战略", "内推"],
    created_at: "2026-03-27",
  },
  {
    type: "hiring_news",
    company: "Deloitte",
    role: "Strategy Analyst",
    region: "SG",
    content: "Deloitte新加坡Monitor Deloitte团队扩招，Strategy Analyst和Senior Analyst各招3-5人。接受所有专业背景，侧重problem-solving能力。",
    source_platform: "LinkedIn",
    confidence: 85,
    tags: ["四大", "战略", "新加坡"],
    created_at: "2026-03-26",
  },
  {
    type: "interview_exp",
    company: "Bain",
    role: "Summer Associate",
    region: "US",
    content: "刚完成Bain NYC final round。两轮case+一轮fit。Case1是digital transformation（SaaS公司），Case2是market entry（东南亚电商）。Fit面重点问了leadership和teamwork。",
    source_platform: "小红书",
    confidence: 65,
    tags: ["MBB", "面试经验", "US", "Case真题"],
    created_at: "2026-03-25",
  },
  {
    type: "process_update",
    company: "Morgan Stanley",
    role: "IB Analyst",
    region: "CN",
    content: "Morgan Stanley中国区IBD校招已开始发offer，今年base salary和去年持平。听说今年招了比往年多10%的人。",
    source_platform: "脉脉",
    confidence: 70,
    tags: ["投行", "offer"],
    process_stage: "发offer",
    process_date: "2026-03-25",
    created_at: "2026-03-25",
  },
];
