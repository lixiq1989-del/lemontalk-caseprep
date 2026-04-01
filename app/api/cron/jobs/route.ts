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
- title: 职位名称
- company: 公司名称
- location: 城市
- type: "实习"/"校招"/"社招"/"Internship"/"Graduate"/"Full-time"
- deadline: 截止日期YYYY-MM-DD（无则""）
- link: 原链接（无则""）
- description: 1-2句描述
- tags: 标签数组
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

// ===== Google Search scraper (covers ALL platforms) =====
async function googleSearch(query: string): Promise<string> {
  // Use Google's public search page and extract snippets
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=20&tbs=qdr:w`; // last week
  const html = await fetchPage(url);
  return html;
}

// ===== LinkedIn Guest API (no auth needed) =====
async function fetchLinkedIn(keyword: string, location: string): Promise<string> {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&start=0&f_TPR=r604800`;
  return fetchPage(url);
}

// ===== 搜狗微信搜索 (covers all WeChat public accounts) =====
async function fetchSogouWeixin(query: string): Promise<string> {
  const url = `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}&ie=utf8`;
  return fetchPage(url);
}

// ===== Source definitions =====

interface JobSource {
  name: string;
  region: string;
  fetcher: () => Promise<ParsedJob[]>;
}

const SOURCES: JobSource[] = [
  // ========== CHINA (全网聚合) ==========
  // Google搜索覆盖Boss直聘、猎聘、拉勾、脉脉等所有平台
  {
    name: "Google-CN-咨询实习",
    region: "CN",
    fetcher: async () => {
      const html = await googleSearch("咨询 实习 2026 site:zhipin.com OR site:liepin.com OR site:shixiseng.com OR site:nowcoder.com");
      return parseWithDeepSeek(html, "全网搜索", "CN", "从Google搜索结果中提取岗位信息。每条结果可能包含title和snippet。");
    },
  },
  {
    name: "Google-CN-投行校招",
    region: "CN",
    fetcher: async () => {
      const html = await googleSearch("投行 校招 2026 site:zhipin.com OR site:liepin.com OR site:nowcoder.com");
      return parseWithDeepSeek(html, "全网搜索", "CN", "从Google搜索结果中提取岗位信息。");
    },
  },
  {
    name: "Google-CN-战略咨询",
    region: "CN",
    fetcher: async () => {
      const html = await googleSearch("MBB BCG McKinsey Bain 招聘 2026 中国");
      return parseWithDeepSeek(html, "全网搜索", "CN", "从Google搜索结果提取MBB咨询公司最新招聘信息。");
    },
  },
  // 公众号（通过搜狗微信搜索）
  {
    name: "微信公众号-咨询实习",
    region: "CN",
    fetcher: async () => {
      const html = await fetchSogouWeixin("咨询 实习 招聘 2026");
      return parseWithDeepSeek(html, "公众号", "CN", "从搜狗微信搜索结果中提取公众号文章里的招聘信息。文章标题和摘要中可能包含岗位信息。");
    },
  },
  {
    name: "微信公众号-投行招聘",
    region: "CN",
    fetcher: async () => {
      const html = await fetchSogouWeixin("投行 校招 春招 2026");
      return parseWithDeepSeek(html, "公众号", "CN");
    },
  },
  // 直接抓实习僧和牛客
  {
    name: "实习僧-咨询",
    region: "CN",
    fetcher: async () => {
      const html = await fetchPage("https://www.shixiseng.com/interns?keyword=%E5%92%A8%E8%AF%A2&city=all&type=intern");
      return parseWithDeepSeek(html, "实习僧", "CN");
    },
  },
  {
    name: "实习僧-投行",
    region: "CN",
    fetcher: async () => {
      const html = await fetchPage("https://www.shixiseng.com/interns?keyword=%E6%8A%95%E8%A1%8C&city=all&type=intern");
      return parseWithDeepSeek(html, "实习僧", "CN");
    },
  },

  // ========== UK ==========
  {
    name: "LinkedIn-UK-Consulting",
    region: "UK",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting graduate analyst", "United Kingdom");
      return parseWithDeepSeek(html, "LinkedIn", "UK", "提取LinkedIn job cards中的职位信息。");
    },
  },
  {
    name: "LinkedIn-UK-Finance",
    region: "UK",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst graduate", "United Kingdom");
      return parseWithDeepSeek(html, "LinkedIn", "UK");
    },
  },
  {
    name: "Google-UK-Consulting",
    region: "UK",
    fetcher: async () => {
      const html = await googleSearch("consulting graduate scheme 2026 UK site:targetjobs.co.uk OR site:gradcracker.com OR site:brightnetwork.co.uk");
      return parseWithDeepSeek(html, "UK求职网站", "UK");
    },
  },

  // ========== US ==========
  {
    name: "LinkedIn-US-Consulting",
    region: "US",
    fetcher: async () => {
      const html = await fetchLinkedIn("management consulting analyst", "United States");
      return parseWithDeepSeek(html, "LinkedIn", "US");
    },
  },
  {
    name: "LinkedIn-US-IB",
    region: "US",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst summer", "United States");
      return parseWithDeepSeek(html, "LinkedIn", "US");
    },
  },
  {
    name: "Google-US-Consulting",
    region: "US",
    fetcher: async () => {
      const html = await googleSearch("consulting analyst 2026 hiring McKinsey BCG Bain site:wayup.com OR site:glassdoor.com");
      return parseWithDeepSeek(html, "US求职网站", "US");
    },
  },

  // ========== Hong Kong ==========
  {
    name: "LinkedIn-HK-Consulting",
    region: "HK",
    fetcher: async () => {
      const html = await fetchLinkedIn("consulting analyst", "Hong Kong");
      return parseWithDeepSeek(html, "LinkedIn", "HK");
    },
  },
  {
    name: "LinkedIn-HK-Finance",
    region: "HK",
    fetcher: async () => {
      const html = await fetchLinkedIn("investment banking analyst", "Hong Kong");
      return parseWithDeepSeek(html, "LinkedIn", "HK");
    },
  },
  {
    name: "Google-HK-Jobs",
    region: "HK",
    fetcher: async () => {
      const html = await googleSearch("consulting finance graduate 2026 Hong Kong site:jobsdb.com OR site:cpjobs.com");
      return parseWithDeepSeek(html, "HK求职网站", "HK");
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
    name: "Google-SG-Jobs",
    region: "SG",
    fetcher: async () => {
      const html = await googleSearch("consulting finance graduate 2026 Singapore site:mycareersfuture.gov.sg");
      return parseWithDeepSeek(html, "SG求职网站", "SG");
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
