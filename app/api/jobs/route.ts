import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return NextResponse.json({ jobs: STATIC_JOBS });
  }

  return NextResponse.json({ jobs: data.length > 0 ? data : STATIC_JOBS });
}

const STATIC_JOBS = [
  {
    id: 1, title: "暑期实习生 - 战略咨询", company: "麦肯锡 McKinsey", location: "上海",
    type: "实习", deadline: "2026-05-31", link: "https://www.mckinsey.com/careers",
    tags: ["战略咨询", "管培生"], description: "参与大型企业战略项目，培养咨询思维与项目管理能力。",
    region: "CN", source: "官网", created_at: "2026-03-01",
  },
  {
    id: 2, title: "Business Analyst 暑期实习", company: "BCG", location: "北京/上海",
    type: "实习", deadline: "2026-05-15", link: "https://www.bcg.com/careers",
    tags: ["BA", "咨询"], description: "加入BCG项目团队，参与数据分析、市场调研和战略建议输出。",
    region: "CN", source: "官网", created_at: "2026-03-02",
  },
  {
    id: 3, title: "Strategy Consulting Intern", company: "Bain & Company", location: "London",
    type: "Internship", deadline: "2026-05-01", link: "https://www.bain.com/careers",
    tags: ["Strategy", "Consulting"], description: "Join client engagement teams on strategy and operations projects across industries.",
    region: "UK", source: "官网", created_at: "2026-03-03",
  },
  {
    id: 4, title: "Investment Banking Summer Analyst", company: "Goldman Sachs", location: "Hong Kong",
    type: "Internship", deadline: "2026-04-20", link: "https://www.goldmansachs.com/careers",
    tags: ["IB", "金融"], description: "Work on IPO, M&A and capital markets transactions across Asia Pacific.",
    region: "HK", source: "官网", created_at: "2026-03-04",
  },
  {
    id: 5, title: "Management Consulting Analyst", company: "McKinsey & Company", location: "New York",
    type: "Graduate", deadline: "2026-06-30", link: "https://www.mckinsey.com/careers",
    tags: ["Consulting", "Analyst"], description: "Solve complex business problems for Fortune 500 clients as a first-year analyst.",
    region: "US", source: "官网", created_at: "2026-03-05",
  },
  {
    id: 6, title: "Strategy Analyst", company: "Deloitte", location: "Singapore",
    type: "Graduate", deadline: "2026-05-15", link: "https://www.deloitte.com/careers",
    tags: ["Strategy", "Consulting"], description: "Support senior consultants on strategy engagements for SEA clients.",
    region: "SG", source: "官网", created_at: "2026-03-06",
  },
  {
    id: 7, title: "战略发展 & 商业分析 实习生", company: "字节跳动", location: "北京",
    type: "实习", deadline: "2026-06-01", link: "https://jobs.bytedance.com",
    tags: ["互联网", "商业分析", "战略"], description: "参与ByteDance海外业务战略分析，输出行业洞察和竞争分析报告。",
    region: "CN", source: "官网", created_at: "2026-03-07",
  },
  {
    id: 8, title: "PE Investment Analyst Intern", company: "KKR", location: "北京",
    type: "实习", deadline: "2026-05-30", link: "https://www.kkr.com/careers",
    tags: ["PE", "私募股权"], description: "支持投资团队开展尽调、财务建模及投资研究工作。",
    region: "CN", source: "官网", created_at: "2026-03-08",
  },
];
