"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/partner", label: "Case Partner", icon: "🤝" },
  { href: "/drill", label: "每日一练", icon: "⚡" },
  { href: "/casebook", label: "题库", icon: "📚" },
  { href: "/ai", label: "AI 工具", icon: "🤖" },
  { href: "/community", label: "社区", icon: "💬" },
  { href: "/jobs", label: "岗位", icon: "💼" },
  { href: "/leaderboard", label: "排行榜", icon: "🏆" },
];

const bottomTabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/partner", label: "Partner", icon: "🤝" },
  { href: "/drill", label: "刷题", icon: "⚡" },
  { href: "/casebook", label: "题库", icon: "📚" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <>
      {/* Top nav — desktop */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-lg text-primary mr-6 shrink-0">
            LemonTalk
          </Link>
          <div className="hidden md:flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const active =
                tab.href === "/" ? pathname === "/" || pathname === "/coach" : pathname.startsWith(tab.href);
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
            {loading ? (
              <div className="w-16 h-8" />
            ) : user ? (
              <Link
                href="/profile"
                className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
              >
                我的
              </Link>
            ) : (
              <Link
                href="/auth"
                className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border md:hidden">
        <div className="flex">
          {bottomTabs.map((tab) => {
            const active =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
          <Link
            href={user ? "/profile" : "/auth"}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              pathname.startsWith("/profile") ? "text-primary" : "text-muted"
            }`}
          >
            <span className="text-lg leading-none">👤</span>
            <span>{user ? "我的" : "登录"}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
