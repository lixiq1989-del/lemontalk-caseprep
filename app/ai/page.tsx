"use client";

import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "AI 模拟面试",
    desc: "和AI进行模拟Case面试，实时反馈，真实面试官风格",
    href: "/ai/mock",
    color: "bg-red-50 text-red-600",
    tag: "Case",
  },
  {
    icon: "🌟",
    title: "PEI 行为面试",
    desc: "Why consulting / Leadership / Failure等高频行为面试题，STAR框架引导",
    href: "/ai/pei",
    color: "bg-pink-50 text-pink-600",
    tag: "行为面试",
  },
  {
    icon: "💡",
    title: "Case 问答",
    desc: "关于Case框架、分析思路的任何问题，AI帮你解答",
    href: "/ai/qa",
    color: "bg-amber-50 text-amber-600",
    tag: "Q&A",
  },
  {
    icon: "📄",
    title: "简历优化",
    desc: "上传简历，AI按咨询思维帮你重写，量化impact，突出核心卖点",
    href: "/ai/resume",
    color: "bg-teal-50 text-teal-600",
    tag: "简历",
  },
  {
    icon: "🏭",
    title: "行业 Insights",
    desc: "医疗/零售/能源/科技/金融等行业速览，面试前10分钟快速了解",
    href: "/ai/industry",
    color: "bg-blue-50 text-blue-600",
    tag: "行业知识",
  },
  {
    icon: "⚡",
    title: "面试突击小抄",
    desc: "输入公司+岗位+简历，AI生成专属面试准备清单",
    href: "/ai/sprint",
    color: "bg-indigo-50 text-indigo-600",
    tag: "冲刺",
  },
  {
    icon: "📋",
    title: "框架速查",
    desc: "常用框架、公式、行业数据速查",
    href: "/ai/cheatsheet",
    color: "bg-green-50 text-green-600",
    tag: "参考",
  },
];

export default function AIZonePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">🤖 AI 助手</h1>
        <p className="text-muted">AI驱动的面试准备工具，随时随地练习</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <Link key={f.href} href={f.href}>
            <div className="card-hover border border-border rounded-xl p-6 cursor-pointer h-full relative">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {f.tag}
              </span>
              <div className={`w-12 h-12 rounded-lg ${f.color} flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h2 className="text-base font-semibold mb-2">{f.title}</h2>
              <p className="text-muted text-sm">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
