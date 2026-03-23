"use client";

import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "AI 模拟面试",
    desc: "和AI进行模拟Case面试，实时反馈",
    href: "/ai/mock",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: "💡",
    title: "Case 问答",
    desc: "关于Case的任何问题，AI帮你解答",
    href: "/ai/qa",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "⚡",
    title: "面试突击小抄",
    desc: "输入公司+岗位+简历，AI生成专属面试准备清单",
    href: "/ai/sprint",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: "📋",
    title: "框架速查",
    desc: "常用框架、公式、行业数据速查",
    href: "/ai/cheatsheet",
    color: "bg-green-50 text-green-600",
  },
];

export default function AIZonePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">🤖 AI 助手</h1>
        <p className="text-muted">AI驱动的面试准备工具，随时随地练习</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link key={f.href} href={f.href}>
            <div className="card-hover border border-border rounded-xl p-6 cursor-pointer h-full">
              <div
                className={`w-12 h-12 rounded-lg ${f.color} flex items-center justify-center text-2xl mb-4`}
              >
                {f.icon}
              </div>
              <h2 className="text-lg font-semibold mb-2">{f.title}</h2>
              <p className="text-muted text-sm">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
