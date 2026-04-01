import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Vercel Cron runs this daily at 2am UTC (10am Beijing)

interface ParsedJob {
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  link: string;
  description: string;
  tags: string[];
  region: string;
  source: string;
}

// ===== Helpers =====

async function fetchPage(url: string, headers?: Record<string, string>): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
        ...headers,
      },
    });
    clearTimeout(timeout);
    return await res.text();
  } catch {
    clearTimeout(timeout);
    return "";
  }
}

async function parseWithDeepSeek(content: string, sourceName: string, region: string, instructions: string = ""): Promise<ParsedJob[]> {
  if (!content || content.length < 50) return [];

  const prompt = `从以下内容中提取招聘信息。只提取咨询/金融/战略/管理类岗位。返回JSON数组。

每条字段：
- title: 职位名称（具体到岗位+级别，如"Business Analyst 暑期实习"而非泛泛的"咨询"）
- company: 公司名称
- location: 城市（具体到城市，如"上海"/"London"而非"中国"）
- type: "实习"/"校招"/"社招"/"Internship"/"Graduate"/"Full-time"
- deadline: 截止日期YYYY-MM-DD（无则""）
- link: 投递链接（必须是可点击的完整URL，如公司官网申请页或LinkedIn岗位详情页。没有链接的岗位不要）
- description: 1-2句描述（包含：招聘通道如全球/亚洲/欧洲、具体要求、薪资如有）
- tags: 标签数组

重要：link字段是必填的！没有投递链接的岗位请跳过不提取。
${instructions}

最多15条。无招聘信息返回[]。只返回JSON数组。

来源：${sourceName}
内容：
${content.slice(0, 10000)}`;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 3000 }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "[]";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    return (JSON.parse(match[0]) as ParsedJob[]).map((j) => ({ ...j, region, source: sourceName }));
  } catch {
    return [];
  }
}

// ===== LinkedIn Guest API (no auth needed, reliable links) =====
async function fetchLinkedIn(keyword: string, location: string): Promise<string> {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&start=0&f_TPR=r604800`;
  return fetchPage(url);
}

// ===== Source definitions =====

interface JobSource {
  name: string;
  region: string;
  fetcher: () => Promise<ParsedJob[]>;
}

// Job listings ONLY from LinkedIn (reliable links + accurate location)
// Google/Sogou moved to intel engine for news/timeline/面经
const SOURCES: JobSource[] = [
  // ========== CHINA ==========
  {
    name: "LinkedIn-CN-Consulting",
    region: "CN",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting analyst", "China");
      return parseWithDeepSeek(html, "LinkedIn", "CN", "提取LinkedIn job cards。location必须在中国境内。");
    },
  },
  {
    name: "LinkedIn-CN-Finance",
    region: "CN",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst", "China");
      return parseWithDeepSeek(html, "LinkedIn", "CN", "提取LinkedIn job cards。location必须在中国境内。");
    },
  },
  {
    name: "LinkedIn-CN-Strategy",
    region: "CN",
    fetcher: async () => {
      const html = await fetchLinkedIn("strategy analyst", "China");
      return parseWithDeepSeek(html, "LinkedIn", "CN", "提取LinkedIn job cards。location必须在中国境内。");
    },
  },
  {
    name: "LinkedIn-CN-MBB",
    region: "CN",
    fetcher: async () => {
      const html = await fetchLinkedIn("McKinsey BCG Bain", "China");
      return parseWithDeepSeek(html, "LinkedIn", "CN", "提取LinkedIn job cards。只要MBB三家。location必须在中国境内。");
    },
  },

  // ========== UK ==========
  {
    name: "LinkedIn-UK-Consulting",
    region: "UK",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting graduate analyst", "United Kingdom");
      return parseWithDeepSeek(html, "LinkedIn", "UK", "location必须在英国。");
    },
  },
  {
    name: "LinkedIn-UK-Finance",
    region: "UK",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst graduate", "United Kingdom");
      return parseWithDeepSeek(html, "LinkedIn", "UK", "location必须在英国。");
    },
  },
  {
    name: "LinkedIn-UK-Strategy",
    region: "UK",
    fetcher: async () => {
      const html = await fetchLinkedIn("strategy consultant graduate", "United Kingdom");
      return parseWithDeepSeek(html, "LinkedIn", "UK", "location必须在英国。");
    },
  },

  // ========== US ==========
  {
    name: "LinkedIn-US-Consulting",
    region: "US",
    fetcher: async () => {
      const html = await fetchLinkedIn("management consulting analyst", "United States");
      return parseWithDeepSeek(html, "LinkedIn", "US", "location必须在美国。");
    },
  },
  {
    name: "LinkedIn-US-IB",
    region: "US",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst", "United States");
      return parseWithDeepSeek(html, "LinkedIn", "US", "location必须在美国。");
    },
  },
  {
    name: "LinkedIn-US-Strategy",
    region: "US",
    fetcher: async () => {
      const html = await fetchLinkedIn("strategy consulting analyst", "United States");
      return parseWithDeepSeek(html, "LinkedIn", "US", "location必须在美国。");
    },
  },

  // ========== Hong Kong ==========
  {
    name: "LinkedIn-HK-Consulting",
    region: "HK",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting analyst", "Hong Kong");
      return parseWithDeepSeek(html, "LinkedIn", "HK", "location必须在香港。");
    },
  },
  {
    name: "LinkedIn-HK-Finance",
    region: "HK",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst", "Hong Kong");
      return parseWithDeepSeek(html, "LinkedIn", "HK", "location必须在香港。");
    },
  },

  // ========== Singapore ==========
  {
    name: "LinkedIn-SG-Consulting",
    region: "SG",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting analyst", "Singapore");
      return parseWithDeepSeek(html, "LinkedIn", "SG");
    },
  },
  {
    name: "LinkedIn-SG-Strategy",
    region: "SG",
    fetcher: async () => {
      const html = await fetchLinkedIn("strategy consulting analyst", "Singapore");
      return parseWithDeepSeek(html, "LinkedIn", "SG", "location必须在新加坡。");
    },
  },
];

// ===== Main handler =====

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { source: string; region: string; found: number; error?: string }[] = [];

  // Run in batches of 4 to avoid rate limits
  for (let i = 0; i < SOURCES.length; i += 4) {
    const batch = SOURCES.slice(i, i + 4);
    const batchResults = await Promise.allSettled(
      batch.map(async (source) => {
        try {
          const jobs = await source.fetcher();
          if (jobs.length > 0) {
            const rows = jobs.map((j) => ({
              title: j.title || "",
              company: j.company || "",
              location: j.location || "",
              type: j.type || "Full-time",
              deadline: j.deadline || "",
              link: j.link || "",
              description: j.description || "",
              tags: j.tags || [],
              region: source.region,
              source: source.name,
              active: true,
            }));
            const { error } = await supabaseAdmin
              .from("jobs")
              .upsert(rows, { onConflict: "title,company", ignoreDuplicates: true });
            return { source: source.name, region: source.region, found: jobs.length, error: error?.message };
          }
          return { source: source.name, region: source.region, found: 0 };
        } catch (err) {
          return { source: source.name, region: source.region, found: 0, error: err instanceof Error ? err.message : "Unknown" };
        }
      })
    );
    for (const r of batchResults) {
      results.push(r.status === "fulfilled" ? r.value : { source: "?", region: "?", found: 0, error: "rejected" });
    }
    if (i + 4 < SOURCES.length) await new Promise((r) => setTimeout(r, 3000));
  }

  const total = results.reduce((sum, r) => sum + r.found, 0);
  const byRegion: Record<string, number> = {};
  for (const r of results) byRegion[r.region] = (byRegion[r.region] || 0) + r.found;

  console.log(`[CRON/jobs] Total: ${total} jobs from ${SOURCES.length} sources`, byRegion);

  return NextResponse.json({ ok: true, total, sources: SOURCES.length, byRegion, results });
}
