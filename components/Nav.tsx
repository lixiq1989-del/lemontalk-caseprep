"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/partner", label: "Case Partner", icon: "🤝" },
  { href: "/drill", label: "每日一练", icon: "⚡" },
  { href: "/casebook", label: "题库", icon: "📚" },
  { href: "/community", label: "社区", icon: "💬" },
  { href: "/ai", label: "AI 助手", icon: "🤖" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-1">
        <Link href="/" className="font-bold text-lg text-primary mr-6 shrink-0">
          LemonTalk
        </Link>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-gray-50 hover:text-foreground"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="ml-auto">
          <Link
            href="/profile"
            className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            我的
          </Link>
        </div>
      </div>
    </nav>
  );
}
