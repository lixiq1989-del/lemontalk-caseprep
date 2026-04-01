import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

/**
 * AI-Powered Job Intelligence Engine
 *
 * Instead of scraping specific job boards, this engine:
 * 1. Searches the open web for recruiting signals (social media, forums, news, blogs)
 * 2. Uses AI to extract structured intelligence from unstructured content
 * 3. Deduplicates and scores each signal by confidence and freshness
 *
 * Sources: Google Search (covers everything), Sogou WeChat, LinkedIn guest API
 * Signal types: job posting, hiring news, timeline info, interview experience, internal referral
 */

interface IntelSignal {
  type: "job_posting" | "hiring_news" | "timeline" | "interview_exp" | "referral" | "process_update";
  company: string;
  role: string;
  location: string;
  region: string;
  content: string;
  source_url: string;
  source_platform: string;
  deadline: string;
  confidence: number;
  tags: string[];
  raw_snippet: string;
  // Recruiting process tracking
  process_stage?: string;   // "网申开放" | "笔试中" | "一面" | "二面" | "终面" | "发offer" | "已结束"
  process_date?: string;    // when this stage happened/starts
}

// ===== Search helpers =====

async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    clearTimeout(timeout);
    return await res.text();
  } catch {
    clearTimeout(timeout);
    return "";
  }
}

async function googleSearch(query: string): Promise<string> {
  return fetchWithTimeout(`https://www.google.com/search?q=${encodeURIComponent(query)}&num=15&tbs=qdr:w`);
}

async function sogouWeixin(query: string): Promise<string> {
  return fetchWithTimeout(`https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}&ie=utf8`);
}

async function linkedInJobs(keyword: string, location: string): Promise<string> {
  return fetchWithTimeout(`https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&start=0&f_TPR=r604800`);
}

// ===== AI Intelligence Extraction =====

async function extractIntelligence(content: string, searchContext: string, region: string): Promise<IntelSignal[]> {
  if (!content || content.length < 100) return [];

  const prompt = `你是一个招聘情报分析师。从以下搜索结果中提取所有与咨询/金融/战略岗位相关的招聘情报。

搜索上下文：${searchContext}
地区：${region}

内容：
${content.slice(0, 10000)}

对每条情报，判断它的类型和可信度：
- job_posting: 明确的岗位发布（公司招XX岗位）→ confidence 80-100
- hiring_news: 招聘相关新闻（XX公司扩招/裁员/开放申请）→ confidence 60-90
- process_update: 招聘流程进度（XX公司开始发笔试/一面邀请/offer已发）→ confidence 60-90
- timeline: 招聘时间线信息（XX公司N月开始面试/发offer）→ confidence 50-80
- interview_exp: 面试经验分享（刚面完XX公司，case题是...）→ confidence 40-70
- referral: 内推信息 → confidence 70-90

特别注意提取「招聘流程进度」信息，比如：
- "收到McKinsey笔试邀请了" → process_update, process_stage="笔试中"
- "BCG一面刚结束" → process_update, process_stage="一面"
- "Bain开始发offer了" → process_update, process_stage="发offer"
- "Deloitte网申下周截止" → process_update, process_stage="网申开放"

返回JSON数组，每条包含：
{
  "type": "job_posting|hiring_news|process_update|timeline|interview_exp|referral",
  "company": "公司名",
  "role": "岗位名（如无具体岗位写'未知'）",
  "location": "城市",
  "content": "AI整理的情报摘要（1-3句话，中文）",
  "source_url": "原文链接（从搜索结果提取，无则空）",
  "source_platform": "来源平台（小红书/公众号/脉脉/牛客/LinkedIn/新闻/官网/论坛）",
  "deadline": "截止日期YYYY-MM-DD（无则空）",
  "confidence": 数字0-100,
  "tags": ["标签数组"],
  "raw_snippet": "原文中的关键片段（20-50字）",
  "process_stage": "网申开放|笔试中|一面|二面|终面|发offer|已结束（仅process_update类型需要）",
  "process_date": "该阶段发生日期YYYY-MM-DD（仅process_update类型需要）"
}

注意：
- 只提取咨询/金融/互联网战略相关的
- 招聘流程进度是最有价值的信息——优先提取
- 面试经验中如果提到了具体case题目/面试形式，一定要写进content
- 过滤掉广告、培训机构推销
- 每条情报必须有明确的公司名
- 最多返回15条
- 只返回JSON数组`;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 4000 }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "[]";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const signals = JSON.parse(match[0]) as IntelSignal[];
    return signals
      .filter((s) => s.company && s.confidence >= 40)
      .map((s) => ({ ...s, region }));
  } catch {
    return [];
  }
}

// ===== Intelligence Search Queries =====

interface IntelQuery {
  name: string;
  region: string;
  queries: { type: "google" | "sogou_weixin" | "linkedin"; query: string; location?: string }[];
}

const INTEL_QUERIES: IntelQuery[] = [
  // ===== CHINA =====
  {
    name: "CN-MBB春招",
    region: "CN",
    queries: [
      { type: "google", query: "McKinsey BCG Bain 2026 春招 实习 招聘 site:xiaohongshu.com OR site:nowcoder.com OR site:maimai.cn" },
      { type: "sogou_weixin", query: "MBB 咨询 2026 春招 开放申请" },
      { type: "sogou_weixin", query: "麦肯锡 BCG 贝恩 实习 招聘 2026" },
    ],
  },
  {
    name: "CN-投行招聘",
    region: "CN",
    queries: [
      { type: "google", query: "投行 校招 2026 Goldman Morgan Stanley CICC 招聘 site:xiaohongshu.com OR site:nowcoder.com" },
      { type: "sogou_weixin", query: "投行 校招 春招 2026 开放" },
    ],
  },
  {
    name: "CN-四大咨询",
    region: "CN",
    queries: [
      { type: "google", query: "Deloitte PwC EY KPMG 咨询 2026 招聘 实习 site:zhipin.com OR site:liepin.com OR site:nowcoder.com" },
      { type: "sogou_weixin", query: "四大 咨询 2026 招聘" },
    ],
  },
  {
    name: "CN-互联网战略",
    region: "CN",
    queries: [
      { type: "google", query: "字节跳动 腾讯 阿里 战略分析 商业分析 2026 招聘 site:xiaohongshu.com OR site:nowcoder.com" },
      { type: "sogou_weixin", query: "互联网 战略 商业分析 2026 校招" },
    ],
  },
  {
    name: "CN-面经时间线",
    region: "CN",
    queries: [
      { type: "google", query: "咨询 面试 时间线 2026 offer 笔试 site:xiaohongshu.com OR site:nowcoder.com" },
    ],
  },
  // Recruiting process tracking - most valuable signals
  {
    name: "CN-招聘进度",
    region: "CN",
    queries: [
      { type: "google", query: "2026 春招 收到笔试 OT 面试邀请 咨询 投行 site:xiaohongshu.com OR site:nowcoder.com" },
      { type: "sogou_weixin", query: "2026 春招 笔试 面试 offer 进度" },
      { type: "google", query: "McKinsey BCG Bain 2026 笔试 面试 offer timeline site:nowcoder.com" },
    ],
  },
  {
    name: "CN-面试真题",
    region: "CN",
    queries: [
      { type: "google", query: "2026 咨询 case面试 真题 经验 site:xiaohongshu.com OR site:nowcoder.com" },
      { type: "sogou_weixin", query: "咨询面试 case 真题 2026 经验分享" },
    ],
  },

  // ===== UK =====
  {
    name: "UK-Consulting",
    region: "UK",
    queries: [
      { type: "linkedin", query: "consulting graduate analyst", location: "United Kingdom" },
      { type: "google", query: "consulting graduate scheme 2026 UK McKinsey BCG Bain London application open" },
    ],
  },
  {
    name: "UK-Finance",
    region: "UK",
    queries: [
      { type: "linkedin", query: "investment banking analyst graduate", location: "United Kingdom" },
      { type: "google", query: "investment banking graduate 2026 London application deadline" },
    ],
  },

  // ===== US =====
  {
    name: "US-Consulting",
    region: "US",
    queries: [
      { type: "linkedin", query: "management consulting analyst 2026", location: "United States" },
      { type: "google", query: "consulting recruiting 2026 McKinsey BCG Bain hiring timeline application" },
    ],
  },
  {
    name: "US-Finance",
    region: "US",
    queries: [
      { type: "linkedin", query: "investment banking summer analyst 2026", location: "United States" },
    ],
  },

  // ===== Hong Kong =====
  {
    name: "HK-Consulting-Finance",
    region: "HK",
    queries: [
      { type: "linkedin", query: "consulting analyst", location: "Hong Kong" },
      { type: "linkedin", query: "investment banking analyst", location: "Hong Kong" },
      { type: "google", query: "Hong Kong consulting finance graduate 2026 hiring" },
    ],
  },

  // ===== Singapore =====
  {
    name: "SG-Consulting-Finance",
    region: "SG",
    queries: [
      { type: "linkedin", query: "consulting analyst", location: "Singapore" },
      { type: "google", query: "Singapore consulting finance graduate 2026 McKinsey BCG" },
    ],
  },
];

// ===== Main handler =====

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allSignals: IntelSignal[] = [];
  const results: { name: string; signals: number; error?: string }[] = [];

  for (const iq of INTEL_QUERIES) {
    try {
      let combinedContent = "";

      for (const q of iq.queries) {
        let content = "";
        if (q.type === "google") {
          content = await googleSearch(q.query);
        } else if (q.type === "sogou_weixin") {
          content = await sogouWeixin(q.query);
        } else if (q.type === "linkedin") {
          content = await linkedInJobs(q.query, q.location || "");
        }
        combinedContent += `\n--- ${q.type}: ${q.query} ---\n${content.slice(0, 5000)}\n`;
        await new Promise((r) => setTimeout(r, 1000)); // Rate limit between searches
      }

      const signals = await extractIntelligence(combinedContent, iq.name, iq.region);
      allSignals.push(...signals);
      results.push({ name: iq.name, signals: signals.length });

      await new Promise((r) => setTimeout(r, 2000)); // Rate limit between AI calls
    } catch (err) {
      results.push({ name: iq.name, signals: 0, error: err instanceof Error ? err.message : "Unknown" });
    }
  }

  // Deduplicate by company+role
  const seen = new Set<string>();
  const unique = allSignals.filter((s) => {
    const key = `${s.company}|${s.role}|${s.region}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by confidence descending
  unique.sort((a, b) => b.confidence - a.confidence);

  // Upsert to Supabase jobs table (convert signals to job format)
  const jobRows = unique
    .filter((s) => s.type === "job_posting" && s.confidence >= 70)
    .map((s) => ({
      title: s.role || "Unknown Role",
      company: s.company,
      location: s.location || "",
      type: s.tags?.includes("实习") || s.tags?.includes("intern") ? "实习" : "Graduate",
      deadline: s.deadline || "",
      link: s.source_url || "",
      description: s.content,
      tags: s.tags || [],
      region: s.region,
      source: `AI情报: ${s.source_platform}`,
      active: true,
    }));

  if (jobRows.length > 0) {
    try {
      await supabaseAdmin
        .from("jobs")
        .upsert(jobRows, { onConflict: "title,company", ignoreDuplicates: true });
    } catch { /* table might not exist */ }
  }

  // Store all signals in intel table
  const intelRows = unique.map((s) => ({
    type: s.type,
    company: s.company,
    role: s.role,
    location: s.location,
    region: s.region,
    content: s.content,
    source_url: s.source_url,
    source_platform: s.source_platform,
    deadline: s.deadline,
    confidence: s.confidence,
    tags: s.tags,
    raw_snippet: s.raw_snippet,
  }));

  try {
    await supabaseAdmin
      .from("job_intel")
      .upsert(intelRows, { onConflict: "company,role,region", ignoreDuplicates: true });
  } catch { /* table might not exist */ }

  // Summary
  const byRegion: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const s of unique) {
    byRegion[s.region] = (byRegion[s.region] || 0) + 1;
    byType[s.type] = (byType[s.type] || 0) + 1;
  }

  console.log(`[CRON/intel] ${unique.length} signals (${jobRows.length} job postings)`, byRegion, byType);

  return NextResponse.json({
    ok: true,
    totalSignals: unique.length,
    jobPostings: jobRows.length,
    byRegion,
    byType,
    results,
    // Return top signals for preview
    topSignals: unique.slice(0, 20).map((s) => ({
      type: s.type,
      company: s.company,
      role: s.role,
      region: s.region,
      content: s.content,
      confidence: s.confidence,
      source_platform: s.source_platform,
    })),
  });
}
