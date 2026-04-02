// Target company career page database
// Used by cron to search LinkedIn by company name + scrape career pages

export interface CompanyInfo {
  name: string;
  category: "MBB" | "Big4" | "Strategy" | "IB_Global" | "IB_China" | "PE_VC" | "Tech_China" | "Tech_Global" | "Consumer";
  careerUrl: string;
  campusUrl?: string;
  chinaUrl?: string;
  linkedInName: string; // for LinkedIn search
}

export const COMPANIES: CompanyInfo[] = [
  // ===== MBB + Strategy Consulting =====
  { name: "McKinsey", category: "MBB", careerUrl: "https://www.mckinsey.com/careers/home", campusUrl: "https://www.mckinsey.com/careers/students", linkedInName: "McKinsey" },
  { name: "BCG", category: "MBB", careerUrl: "https://careers.bcg.com/global/en/", campusUrl: "https://careers.bcg.com/global/en/early-careers", linkedInName: "Boston Consulting Group" },
  { name: "Bain", category: "MBB", careerUrl: "https://www.bain.com/careers/", campusUrl: "https://careers.bain.com/jobs", linkedInName: "Bain" },
  { name: "Roland Berger", category: "Strategy", careerUrl: "https://www.rolandberger.com/en/Join/All-Jobs/", linkedInName: "Roland Berger" },
  { name: "Kearney", category: "Strategy", careerUrl: "https://www.kearney.com/careers/opportunities", linkedInName: "Kearney" },
  { name: "Oliver Wyman", category: "Strategy", careerUrl: "https://www.oliverwyman.com/careers.html", linkedInName: "Oliver Wyman" },
  { name: "L.E.K.", category: "Strategy", careerUrl: "https://www.lek.com/join-lek/apply", linkedInName: "L.E.K. Consulting" },
  { name: "Simon-Kucher", category: "Strategy", careerUrl: "https://www.simon-kucher.com/en/careers", linkedInName: "Simon-Kucher" },
  { name: "Strategy&", category: "Strategy", careerUrl: "https://www.strategyand.pwc.com/gx/en/careers.html", chinaUrl: "https://www.strategyand.pwc.com/cn/zh/careers.html", linkedInName: "Strategy&" },
  { name: "Accenture Strategy", category: "Strategy", careerUrl: "https://www.accenture.com/us-en/careers", linkedInName: "Accenture strategy" },

  // ===== Big 4 =====
  { name: "Deloitte", category: "Big4", careerUrl: "https://www.deloitte.com/global/en/careers/job-search.html", chinaUrl: "https://www.deloitte.com/cn/zh/cn-careers/students.html", linkedInName: "Deloitte consulting" },
  { name: "PwC", category: "Big4", careerUrl: "https://www.pwc.com/gx/en/careers.html", chinaUrl: "https://www.pwccn.com/zh/careers.html", linkedInName: "PwC consulting" },
  { name: "EY", category: "Big4", careerUrl: "https://www.ey.com/en_gl/careers", chinaUrl: "https://www.ey.com/zh_cn/careers", linkedInName: "EY consulting" },
  { name: "KPMG", category: "Big4", careerUrl: "https://kpmg.com/xx/en/home/careers.html", chinaUrl: "https://kpmg.com/cn/en/careers.html", linkedInName: "KPMG consulting" },

  // ===== Investment Banks (Global) =====
  { name: "Goldman Sachs", category: "IB_Global", careerUrl: "https://www.goldmansachs.com/careers", campusUrl: "https://www.goldmansachs.com/careers/students", linkedInName: "Goldman Sachs" },
  { name: "Morgan Stanley", category: "IB_Global", careerUrl: "https://www.morganstanley.com/people", campusUrl: "https://www.morganstanley.com/people-opportunities/students-graduates", linkedInName: "Morgan Stanley" },
  { name: "JP Morgan", category: "IB_Global", careerUrl: "https://careers.jpmorgan.com/us/en/home", linkedInName: "JPMorgan Chase" },
  { name: "UBS", category: "IB_Global", careerUrl: "https://www.ubs.com/global/en/careers.html", linkedInName: "UBS" },
  { name: "Deutsche Bank", category: "IB_Global", careerUrl: "https://careers.db.com/", campusUrl: "https://careers.db.com/students-graduates/", linkedInName: "Deutsche Bank" },
  { name: "HSBC", category: "IB_Global", careerUrl: "https://www.hsbc.com/careers", campusUrl: "https://www.hsbc.com/careers/students-and-graduates", linkedInName: "HSBC" },
  { name: "Citi", category: "IB_Global", careerUrl: "https://jobs.citi.com", linkedInName: "Citi" },
  { name: "Barclays", category: "IB_Global", careerUrl: "https://home.barclays/careers/", linkedInName: "Barclays" },
  { name: "BofA", category: "IB_Global", careerUrl: "https://careers.bankofamerica.com/en-us", campusUrl: "https://campus.bankofamerica.com/", linkedInName: "Bank of America" },

  // ===== Investment Banks (China) =====
  { name: "中金CICC", category: "IB_China", careerUrl: "https://cicc.zhiye.com/", campusUrl: "https://cicc.zhiye.com/campus", linkedInName: "CICC" },
  { name: "中信证券", category: "IB_China", careerUrl: "https://careers.citics.com/", linkedInName: "CITIC Securities" },
  { name: "华泰证券", category: "IB_China", careerUrl: "https://www.hotjob.cn/wt/HTSC/", linkedInName: "Huatai Securities" },
  { name: "国泰君安", category: "IB_China", careerUrl: "https://hr.gtja.com/", linkedInName: "Guotai Junan" },
  { name: "中信建投", category: "IB_China", careerUrl: "https://csc108.zhiye.com/campus/jobs", linkedInName: "China Securities" },

  // ===== PE/VC =====
  { name: "KKR", category: "PE_VC", careerUrl: "https://www.kkr.com/careers", linkedInName: "KKR" },
  { name: "Blackstone", category: "PE_VC", careerUrl: "https://www.blackstone.com/careers/careers-blackstone/", linkedInName: "Blackstone" },
  { name: "Carlyle", category: "PE_VC", careerUrl: "https://www.carlyle.com/careers", linkedInName: "Carlyle Group" },
  { name: "Apollo", category: "PE_VC", careerUrl: "https://www.apollo.com/careers", linkedInName: "Apollo Global" },
  { name: "Bain Capital", category: "PE_VC", careerUrl: "https://www.baincapital.com/careers", linkedInName: "Bain Capital" },
  { name: "高瓴Hillhouse", category: "PE_VC", careerUrl: "https://hillhouse.gllue.com/", linkedInName: "Hillhouse Investment" },
  { name: "红杉HongShan", category: "PE_VC", careerUrl: "https://hongshan.jobs.feishu.cn/", linkedInName: "HongShan" },

  // ===== Tech (China) =====
  { name: "字节跳动", category: "Tech_China", careerUrl: "https://jobs.bytedance.com/", campusUrl: "https://jobs.bytedance.com/campus", linkedInName: "ByteDance" },
  { name: "腾讯", category: "Tech_China", careerUrl: "https://careers.tencent.com/", campusUrl: "https://join.qq.com/", linkedInName: "Tencent" },
  { name: "阿里巴巴", category: "Tech_China", careerUrl: "https://talent.alibaba.com/", campusUrl: "https://talent.alibaba.com/campus/", linkedInName: "Alibaba Group" },
  { name: "美团", category: "Tech_China", careerUrl: "https://zhaopin.meituan.com/", campusUrl: "https://campus.meituan.com/", linkedInName: "Meituan" },
  { name: "拼多多", category: "Tech_China", careerUrl: "https://careers.pddglobalhr.com/", campusUrl: "https://careers.pddglobalhr.com/campus/", linkedInName: "PDD Holdings" },
  { name: "京东", category: "Tech_China", careerUrl: "https://zhaopin.jd.com/", campusUrl: "https://campus.jd.com/", linkedInName: "JD.com" },
  { name: "小米", category: "Tech_China", careerUrl: "https://hr.xiaomi.com/", linkedInName: "Xiaomi" },
  { name: "华为", category: "Tech_China", careerUrl: "https://career.huawei.com/", campusUrl: "https://career.huawei.com/reccampportal/portal5/campus-recruitment.html", linkedInName: "Huawei" },
  { name: "百度", category: "Tech_China", careerUrl: "https://talent.baidu.com/", linkedInName: "Baidu" },
  { name: "网易", category: "Tech_China", careerUrl: "https://hr.163.com/", campusUrl: "https://campus.163.com/", linkedInName: "NetEase" },
  { name: "快手", category: "Tech_China", careerUrl: "https://zhaopin.kuaishou.cn/", campusUrl: "https://campus.kuaishou.cn/", linkedInName: "Kuaishou" },
  { name: "小红书", category: "Tech_China", careerUrl: "https://job.xiaohongshu.com/", campusUrl: "https://campus.xiaohongshu.com/", linkedInName: "Xiaohongshu" },
  { name: "滴滴", category: "Tech_China", careerUrl: "https://talent.didiglobal.com/", campusUrl: "https://campus.didiglobal.com/", linkedInName: "DiDi Global" },
  { name: "蚂蚁集团", category: "Tech_China", careerUrl: "https://talent.antgroup.com/", campusUrl: "https://talent.antgroup.com/campus", linkedInName: "Ant Group" },
  { name: "B站", category: "Tech_China", careerUrl: "https://jobs.bilibili.com/", campusUrl: "https://jobs.bilibili.com/campus/", linkedInName: "Bilibili" },
  { name: "携程", category: "Tech_China", careerUrl: "https://job.ctrip.com/", campusUrl: "https://campus.ctrip.com/", linkedInName: "Trip.com Group" },
  { name: "蔚来", category: "Tech_China", careerUrl: "https://www.nio.cn/careers", campusUrl: "https://campus.nio.com/", linkedInName: "NIO" },
  { name: "理想汽车", category: "Tech_China", careerUrl: "https://www.lixiang.com/employ/", linkedInName: "Li Auto" },
  { name: "小鹏汽车", category: "Tech_China", careerUrl: "https://www.xiaopeng.com/join.html", linkedInName: "XPeng" },

  // ===== Consumer/FMCG =====
  { name: "P&G", category: "Consumer", careerUrl: "https://www.pgcareers.com/", campusUrl: "https://www.pgcareers.com/global/en/recent-grads", linkedInName: "Procter & Gamble" },
  { name: "Unilever", category: "Consumer", careerUrl: "https://careers.unilever.com/en", linkedInName: "Unilever" },
  { name: "L'Oreal", category: "Consumer", careerUrl: "https://careers.loreal.com/", linkedInName: "L'Oreal" },
  { name: "Nike", category: "Consumer", careerUrl: "https://careers.nike.com/", linkedInName: "Nike" },
  { name: "LVMH", category: "Consumer", careerUrl: "https://www.lvmh.com/en/join-us/our-job-offers", linkedInName: "LVMH" },
  { name: "Mars", category: "Consumer", careerUrl: "https://careers.mars.com/global/en", linkedInName: "Mars" },
  { name: "Nestle", category: "Consumer", careerUrl: "https://www.nestle.com/jobs", linkedInName: "Nestle" },
];

// LinkedIn search helper: build query from company names by category
export function getLinkedInQueries(region: string): { keyword: string; location: string }[] {
  const locationMap: Record<string, string> = {
    CN: "China", UK: "United Kingdom", US: "United States", HK: "Hong Kong", SG: "Singapore",
  };
  const loc = locationMap[region] || "China";

  // Group companies by category for batch LinkedIn searches
  const mbb = COMPANIES.filter(c => c.category === "MBB").map(c => c.linkedInName).join(" OR ");
  const big4 = COMPANIES.filter(c => c.category === "Big4").map(c => c.linkedInName).join(" OR ");
  const strategy = COMPANIES.filter(c => c.category === "Strategy").map(c => c.linkedInName).join(" OR ");
  const ib = COMPANIES.filter(c => c.category === "IB_Global").map(c => c.linkedInName).join(" OR ");
  const tech = COMPANIES.filter(c => c.category === "Tech_China").map(c => c.linkedInName).slice(0, 5).join(" OR ");
  const consumer = COMPANIES.filter(c => c.category === "Consumer").map(c => c.linkedInName).join(" OR ");

  return [
    { keyword: `(${mbb}) consultant analyst`, location: loc },
    { keyword: `(${big4}) consultant analyst`, location: loc },
    { keyword: `strategy analyst (${strategy})`, location: loc },
    { keyword: `investment banking analyst (${ib.split(" OR ").slice(0, 4).join(" OR ")})`, location: loc },
    { keyword: `strategy analyst (${tech})`, location: loc },
    { keyword: `management trainee (${consumer})`, location: loc },
  ];
}
