"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ModuleParams } from "@/lib/modules/registry";

// ── Sub-menu types ───────────────────────────────────────────────────────────
interface SubMenuItem {
  icon: string;
  label: string;
  href?: string; // navigate directly
  text?: string; // or send as chat
  hint?: string; // AI banner hint text for the target page
}

// ── Drill submenu → navigate to /drill with category param ──────────────────
const DRILL_SUBMENU: SubMenuItem[] = [
  { icon: "📏", label: "市场估算", href: "/drill?category=market_sizing&hint=练习市场估算（Market+Sizing）" },
  { icon: "💰", label: "盈利分析", href: "/drill?category=profitability&hint=练习盈利分析（Profitability）" },
  { icon: "🏢", label: "并购战略", href: "/drill?category=ma&hint=练习并购/战略（M%26A）" },
  { icon: "⚙️", label: "运营改善", href: "/drill?category=operations&hint=练习运营改善（Operations）" },
  { icon: "🎲", label: "随机出题", href: "/drill" },
];

// ── PEI submenu → navigate to /ai/pei with questionId param ─────────────────
const PEI_SUBMENU: SubMenuItem[] = [
  { icon: "❓", label: "Why咨询", href: "/ai/pei?questionId=why_consulting&hint=练习%22Why+Consulting%22——展示动机和匹配度" },
  { icon: "👑", label: "领导力",  href: "/ai/pei?questionId=leadership&hint=练习领导力题目——用STAR结构展示带队经历" },
  { icon: "❌", label: "失败经历", href: "/ai/pei?questionId=failure&hint=练习失败经历——重点在反思和成长" },
  { icon: "⚡", label: "冲突处理", href: "/ai/pei?questionId=conflict&hint=练习冲突处理——展示主动解决问题的能力" },
  { icon: "🏆", label: "最大成就", href: "/ai/pei?questionId=impact&hint=练习最大成就——量化你的影响力" },
];

// ── Cheatsheet submenu → navigate to /ai/cheatsheet ─────────────────────────
const CHEATSHEET_SUBMENU: SubMenuItem[] = [
  { icon: "🌳", label: "Case框架总览", href: "/ai/cheatsheet?category=frameworks" },
  { icon: "🔢", label: "数学公式速查", href: "/ai/cheatsheet?category=formulas" },
  { icon: "📊", label: "行业关键数据", href: "/ai/cheatsheet?category=industry" },
  { icon: "💡", label: "面试Tips",    href: "/ai/cheatsheet?category=tips" },
];

// ── Industry submenu → navigate to /ai/industry ──────────────────────────────
const INDUSTRY_SUBMENU: SubMenuItem[] = [
  { icon: "🛍️", label: "零售/消费品", href: "/ai/industry?id=retail" },
  { icon: "🏥", label: "医疗健康",    href: "/ai/industry?id=healthcare" },
  { icon: "💻", label: "科技互联网",  href: "/ai/industry?id=technology" },
  { icon: "💰", label: "金融银行",    href: "/ai/industry?id=finance" },
  { icon: "⚡", label: "能源电力",    href: "/ai/industry?id=energy" },
  { icon: "📚", label: "教育培训",    href: "/ai/industry?id=education" },
];

// ── Quick-action chips on home screen ────────────────────────────────────────
const GUIDED_PROMPTS: {
  icon: string; text: string; desc: string;
  href?: string; subMenu?: SubMenuItem[] | null;
}[] = [
  { icon: "🤝", text: "帮我找个Partner练Case", desc: "匹配合适的练习搭档",     href: "/partner", subMenu: null },
  { icon: "🧠", text: "出一道题考我",           desc: "市场估算/盈利/并购/运营",  href: undefined,  subMenu: DRILL_SUBMENU },
  { icon: "📚", text: "做一套完整Case",          desc: "完整背景+框架+数据+建议",  href: undefined,  subMenu: null },
  { icon: "📋", text: "帮我准备今天的面试",      desc: "输入公司/岗位，AI生成专属小抄", href: "/ai/sprint", subMenu: null },
  { icon: "💬", text: "练PEI行为面试",          desc: "Why咨询/领导力/失败经历",  href: undefined,  subMenu: PEI_SUBMENU },
  { icon: "📄", text: "帮我改简历",             desc: "粘贴文字，按咨询思维优化", href: "/ai/resume", subMenu: null },
  { icon: "📌", text: "面试小抄速查",           desc: "框架/公式/行业数据速查",   href: undefined,  subMenu: CHEATSHEET_SUBMENU },
  { icon: "🏭", text: "讲一个行业给我听",       desc: "零售/医疗/科技/金融/能源", href: undefined,  subMenu: INDUSTRY_SUBMENU },
  { icon: "📊", text: "看我的练习进度",         desc: "正确率/弱项分析/刷题记录", href: undefined,  subMenu: null },
  { icon: "💼", text: "看最新实习岗位",         desc: "咨询/投行/互联网实习",     href: "/jobs",    subMenu: null },
];

// ── Map module action → page URL ──────────────────────────────────────────────
function getPageUrl(moduleId: string, params: ModuleParams, hint?: string): string {
  const q = new URLSearchParams();
  if (hint) q.set("hint", hint.slice(0, 150));

  switch (moduleId) {
    case "drill":
      if (params.category) q.set("category", params.category);
      return `/drill?${q}`;
    case "partner":
      if (params.level) q.set("level", params.level);
      if (params.firm) q.set("firm", params.firm);
      if (params.caseType) q.set("caseType", params.caseType);
      return `/partner?${q}`;
    case "casebook":
      if (params.type) q.set("type", params.type);
      return `/casebook?${q}`;
    case "jobs":
      if (params.filter) q.set("filter", params.filter);
      return hint ? `/jobs?${q}` : "/jobs";
    case "pei":
      if (params.questionId) q.set("questionId", params.questionId);
      return `/ai/pei?${q}`;
    case "sprint":
      if (params.company) q.set("company", params.company);
      if (params.role) q.set("role", params.role);
      return `/ai/sprint?${q}`;
    case "cheatsheet":
      if (params.category) q.set("category", params.category);
      return `/ai/cheatsheet?${q}`;
    case "industry":
      if (params.industryId) q.set("id", params.industryId);
      return `/ai/industry?${q}`;
    case "mock":
      if (params.caseType) q.set("caseType", params.caseType);
      return `/ai/mock?${q}`;
    case "resume":
      return hint ? `/ai/resume?${q}` : "/ai/resume";
    default:
      return "/";
  }
}

// ── Module label map ──────────────────────────────────────────────────────────
const MODULE_LABELS: Record<string, string> = {
  drill: "每日一练", partner: "Case Partner", casebook: "案例题库",
  jobs: "实习岗位", pei: "PEI 行为面试", sprint: "面试突击小抄",
  cheatsheet: "速查手册", industry: "行业速览", mock: "模拟面试", resume: "简历优化",
};

// ── Message types ─────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  navUrl?: string;   // link card in chat
  navLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionData?: any;  // progress data (show_progress still inline)
}

// ── Progress inline card (only action still shown inline) ─────────────────────
interface Progress {
  total: number;
  correct: number;
  accuracy: number;
  byCategory: Record<string, { total: number; correct: number }>;
}

function ProgressCard({ progress }: { progress: Progress }) {
  const categoryLabels: Record<string, string> = {
    market_sizing: "市场估算", profitability: "盈利分析",
    ma: "并购", strategy: "战略", operations: "运营", math_input: "数学速算",
  };
  return (
    <div className="bg-white border border-border rounded-xl p-4 mt-3">
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div><div className="text-xl font-bold text-primary">{progress.total}</div><div className="text-xs text-muted">已刷题</div></div>
        <div><div className="text-xl font-bold text-green-600">{progress.accuracy}%</div><div className="text-xs text-muted">正确率</div></div>
        <div><div className="text-xl font-bold text-orange-500">{progress.correct}</div><div className="text-xs text-muted">答对数</div></div>
      </div>
      <div className="space-y-2">
        {Object.entries(progress.byCategory).map(([cat, s]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-xs text-muted w-16 shrink-0">{categoryLabels[cat] || cat}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${Math.round((s.correct / s.total) * 100)}%` }} />
            </div>
            <span className="text-xs text-muted w-10 text-right">{Math.round((s.correct / s.total) * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <Link href="/drill" className="text-xs text-primary hover:underline">去刷题 →</Link>
      </div>
    </div>
  );
}

// ── Simple markdown renderer ───────────────────────────────────────────────────
function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.startsWith("### ")) return <p key={i} className="font-semibold text-sm mt-2">{line.slice(4)}</p>;
        if (line.startsWith("## ")) return <p key={i} className="font-bold mt-2">{line.slice(3)}</p>;
        if (line.trim() === "---") return <hr key={i} className="border-border my-2" />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-sm">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CoachPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuItem[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userId: user?.id,
        }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        role: "assistant",
        content: data.text,
      };

      // show_module → add nav card to message, then route
      if (data.action?.type === "show_module" && data.action.params?.module) {
        const moduleId = data.action.params.module as string;
        const url = getPageUrl(moduleId, data.action.params, data.text);
        assistantMsg.navUrl = url;
        assistantMsg.navLabel = MODULE_LABELS[moduleId] || moduleId;
        setMessages((prev) => [...prev, assistantMsg]);
        // Small delay so user sees the nav card before routing
        setTimeout(() => router.push(url), 800);
      } else if (data.action?.type === "show_progress" && data.actionData) {
        // Progress is still shown inline
        assistantMsg.actionData = data.actionData;
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "出了点问题，稍后再试试吧。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="flex-1 flex flex-col justify-center px-1 py-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">C</div>
            <h1 className="text-2xl font-bold">咨询面试教练</h1>
            <p className="text-muted text-sm mt-1">告诉我你的情况，帮你制定备战计划</p>
          </div>

          <div className="bg-white border-2 border-border focus-within:border-primary rounded-2xl px-4 py-3 mb-4 transition-colors shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }}}
              placeholder={"例如：我明天有麦肯锡一面，需要帮助准备\n或者：我想练一道 Profitability 题"}
              rows={3}
              className="w-full text-sm outline-none bg-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">Enter 发送 · Shift+Enter 换行</span>
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg disabled:opacity-30 hover:bg-blue-700 transition-colors"
              >
                开始
              </button>
            </div>
          </div>

          {/* Quick action chips / submenus */}
          {activeSubMenu ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setActiveSubMenu(null)} className="text-xs text-muted hover:text-foreground">← 返回</button>
                <span className="text-xs text-muted">选择一项</span>
              </div>
              {activeSubMenu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveSubMenu(null);
                    if (item.href) {
                      router.push(item.href);
                    } else if (item.text) {
                      send(item.text);
                    }
                  }}
                  className="w-full flex items-center gap-3 bg-white border border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl px-4 py-2.5 text-left transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted mb-2 px-1">或者快速开始：</p>
              <div className="flex flex-wrap gap-2">
                {GUIDED_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => {
                      if (p.subMenu) {
                        setActiveSubMenu(p.subMenu);
                      } else if (p.href) {
                        router.push(p.href);
                      } else {
                        send(p.text);
                      }
                    }}
                    className="flex items-center gap-1.5 bg-white border border-border hover:border-primary/50 hover:bg-primary/5 rounded-full px-3 py-1.5 text-sm transition-colors"
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                    {p.subMenu && <span className="text-muted text-xs">›</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Conversation ── */}
      {!isEmpty && (
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
              )}
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white border border-border rounded-tl-sm"
                }`}>
                  <MessageContent content={msg.content} />
                </div>

                {/* Navigation card — when AI routes to a page */}
                {msg.navUrl && (
                  <Link
                    href={msg.navUrl}
                    className="mt-2 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors w-full"
                  >
                    <span className="text-base">→</span>
                    <span>打开 {msg.navLabel}</span>
                  </Link>
                )}

                {/* Progress inline card */}
                {msg.actionData && (
                  <ProgressCard progress={msg.actionData as Progress} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* ── Bottom input (conversation mode) ── */}
      {!isEmpty && (
        <div className="pb-4 pt-2">
          <div className="flex gap-2 bg-white border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="说说你想练什么，或者有什么问题..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="text-primary font-medium text-sm disabled:opacity-30 hover:text-blue-700 transition-colors"
            >
              发送
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-2">
            也可以直接去 <Link href="/partner" className="text-primary hover:underline">找Partner</Link>、
            <Link href="/drill" className="text-primary hover:underline">刷题</Link>、
            <Link href="/casebook" className="text-primary hover:underline">看题库</Link>
          </p>
        </div>
      )}
    </div>
  );
}
