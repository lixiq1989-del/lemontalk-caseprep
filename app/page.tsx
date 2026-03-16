import Link from "next/link";

const features = [
  {
    href: "/partner",
    icon: "🤝",
    title: "Case Partner",
    desc: "找到最合适的Case练习搭档，按水平、时间、目标公司智能匹配",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    href: "/casebook",
    icon: "📚",
    title: "题库",
    desc: "精选Casebook题目，覆盖MBB/Big4常见Case类型，中英双语",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
  },
  {
    href: "/community",
    icon: "💬",
    title: "社区",
    desc: "面经分享、经验交流、求助讨论，和同路人一起准备",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
  {
    href: "/ai",
    icon: "🤖",
    title: "AI 助手",
    desc: "AI模拟面试、Case框架问答、面试小抄速查",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-primary">LemonTalk</span> CasePrep
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto">
          咨询面试一站式准备平台 — 找搭档、刷题库、看面经、AI练习
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/partner"
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            开始匹配
          </Link>
          <Link
            href="/casebook"
            className="px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            浏览题库
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`card-hover border rounded-xl p-6 ${f.color} block`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-2xl shrink-0`}
              >
                {f.icon}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{f.title}</h2>
                <p className="text-muted text-sm mt-1">{f.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-12 text-center">
        {[
          { n: "120+", l: "题库Case" },
          { n: "500+", l: "活跃用户" },
          { n: "2000+", l: "练习场次" },
          { n: "95%", l: "好评率" },
        ].map((s) => (
          <div key={s.l} className="py-4">
            <div className="text-2xl font-bold text-primary">{s.n}</div>
            <div className="text-sm text-muted mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
