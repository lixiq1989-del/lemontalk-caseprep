"use client";

import { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { useAuth } from "@/lib/auth-context";

// Dynamically importable panel modules
const PANELS: Record<string, { label: string; icon: string; component: React.LazyExoticComponent<any> }> = {
  drill: { label: "每日一练", icon: "⚡", component: lazy(() => import("@/components/modules/DrillModule")) },
  casebook: { label: "Case 题库", icon: "📚", component: lazy(() => import("@/components/modules/CasebookModule")) },
  jobs: { label: "岗位信息", icon: "💼", component: lazy(() => import("@/components/modules/JobsModule")) },
  partner: { label: "Case Partner", icon: "🤝", component: lazy(() => import("@/components/modules/PartnerModule")) },
  mock: { label: "AI 模拟面试", icon: "🎯", component: lazy(() => import("@/components/modules/MockModule")) },
  pei: { label: "PEI 练习", icon: "🌟", component: lazy(() => import("@/components/modules/PeiModule")) },
  resume: { label: "简历优化", icon: "📄", component: lazy(() => import("@/components/modules/ResumeModule")) },
  cheatsheet: { label: "框架速查", icon: "📋", component: lazy(() => import("@/components/modules/CheatsheetModule")) },
  sprint: { label: "面试突击", icon: "🚀", component: lazy(() => import("@/components/modules/SprintModule")) },
  industry: { label: "行业速查", icon: "🏭", component: lazy(() => import("@/components/modules/IndustryModule")) },
};

interface Message {
  role: "user" | "ai";
  text: string;
  action?: { type: string; payload: string };
}

export default function CoworkLayout({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [panelProps, setPanelProps] = useState<Record<string, any>>({});
  const [showChat, setShowChat] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse AI response for actions
  function parseResponse(text: string, userInput: string): { cleanText: string; action?: { type: string; payload: string } } {
    const actionMatch = text.match(/\[ACTION:(\w+):([^\]]+)\]/);
    if (actionMatch) {
      return {
        cleanText: text.replace(/\[ACTION:[^\]]+\]/g, "").trim(),
        action: { type: actionMatch[1], payload: actionMatch[2] },
      };
    }

    // Fallback: detect intent from user input
    const input = userInput.toLowerCase();
    if (input.includes("练") && (input.includes("框架") || input.includes("structuring"))) return { cleanText: text, action: { type: "panel", payload: "drill:structuring" } };
    if (input.includes("练") && (input.includes("计算") || input.includes("math"))) return { cleanText: text, action: { type: "panel", payload: "drill:case_math" } };
    if (input.includes("练") && (input.includes("图表") || input.includes("chart"))) return { cleanText: text, action: { type: "panel", payload: "drill:chart" } };
    if (input.includes("练") && (input.includes("头脑") || input.includes("brainstorm"))) return { cleanText: text, action: { type: "panel", payload: "drill:creativity" } };
    if (input.includes("练") && (input.includes("总结") || input.includes("synthesis"))) return { cleanText: text, action: { type: "panel", payload: "drill:synthesis" } };
    if (input.includes("开始") && input.includes("练")) return { cleanText: text, action: { type: "panel", payload: "drill" } };
    if (input.includes("模拟面试") || input.includes("mock")) return { cleanText: text, action: { type: "panel", payload: "mock" } };
    if (input.includes("pei") || input.includes("行为面试")) return { cleanText: text, action: { type: "panel", payload: "pei" } };
    if (input.includes("岗位") || input.includes("招聘") || input.includes("job")) return { cleanText: text, action: { type: "panel", payload: "jobs" } };
    if (input.includes("case") && (input.includes("题") || input.includes("库"))) return { cleanText: text, action: { type: "panel", payload: "casebook" } };
    if (input.includes("partner") || input.includes("伙伴") || input.includes("配对")) return { cleanText: text, action: { type: "panel", payload: "partner" } };
    if (input.includes("简历")) return { cleanText: text, action: { type: "panel", payload: "resume" } };
    if (input.includes("框架") && input.includes("速查")) return { cleanText: text, action: { type: "panel", payload: "cheatsheet" } };
    if (input.includes("突击") || input.includes("sprint")) return { cleanText: text, action: { type: "panel", payload: "sprint" } };
    if (input.includes("行业")) return { cleanText: text, action: { type: "panel", payload: "industry" } };

    return { cleanText: text };
  }

  // Execute action: open panel
  const executeAction = useCallback((action: { type: string; payload: string }) => {
    if (action.type === "panel" || action.type === "start_drill" || action.type === "navigate") {
      let panelKey = action.payload;
      let props: Record<string, any> = {};

      // Parse "drill:category" format
      if (panelKey.includes(":")) {
        const [key, param] = panelKey.split(":");
        panelKey = key;
        if (key === "drill") props = { initialCategory: param };
        if (key === "jobs") props = { initialRegion: param };
      }

      // Map navigate paths to panels
      if (panelKey.startsWith("/")) {
        const path = panelKey.replace(/\?.*/, "");
        const params = new URLSearchParams(panelKey.split("?")[1] || "");
        if (path.includes("drill")) { panelKey = "drill"; props = { initialCategory: params.get("category") || undefined }; }
        else if (path.includes("jobs")) { panelKey = "jobs"; props = { initialRegion: params.get("region") || undefined }; }
        else if (path.includes("casebook")) panelKey = "casebook";
        else if (path.includes("mock")) panelKey = "mock";
        else if (path.includes("pei")) panelKey = "pei";
        else if (path.includes("resume")) panelKey = "resume";
        else if (path.includes("partner")) panelKey = "partner";
        else if (path.includes("cheatsheet")) panelKey = "cheatsheet";
        else if (path.includes("sprint")) panelKey = "sprint";
        else if (path.includes("industry")) panelKey = "industry";
      }

      if (PANELS[panelKey]) {
        setActivePanel(panelKey);
        setPanelProps(props);
      }
    } else if (action.type === "set_preference") {
      const [key, value] = action.payload.split("=");
      if (key && value) localStorage.setItem(`ai_pref_${key}`, value);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const panelContext = activePanel ? `用户当前在看: ${PANELS[activePanel]?.label || activePanel}` : "用户刚进入平台";

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          message: `[${panelContext}]${user ? " [已登录]" : ""}\n\n${text.trim()}`,
          history: messages.slice(-8),
        }),
      });

      const data = await res.json();
      const { cleanText, action } = parseResponse(data.response || "抱歉，请重试。", text.trim());

      const aiMsg: Message = { role: "ai", text: cleanText, action };
      setMessages((prev) => [...prev, aiMsg]);

      if (action) setTimeout(() => executeAction(action), 300);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "网络错误，请重试。" }]);
    } finally {
      setLoading(false);
    }
  };

  // Quick action buttons for empty state
  const quickActions = [
    { label: "开始练习", panel: "drill", icon: "⚡" },
    { label: "Case 题库", panel: "casebook", icon: "📚" },
    { label: "模拟面试", panel: "mock", icon: "🎯" },
    { label: "找 Partner", panel: "partner", icon: "🤝" },
    { label: "查岗位", panel: "jobs", icon: "💼" },
    { label: "简历优化", panel: "resume", icon: "📄" },
  ];

  const ActivePanelComponent = activePanel && PANELS[activePanel] ? PANELS[activePanel].component : null;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* ===== LEFT: AI Chat ===== */}
      <div className={`${showChat ? "w-[380px]" : "w-0"} flex-shrink-0 border-r border-border bg-white flex flex-col transition-all duration-200 overflow-hidden`}>
        {/* Chat header */}
        <div className="bg-[#051C2C] text-white px-4 py-3 flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">AI</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">CasePrep AI</div>
            <div className="text-[10px] text-white/50">告诉我你想做什么</div>
          </div>
          <button onClick={() => setShowChat(false)} className="text-white/40 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-3 pt-4">
              <p className="text-xs text-muted text-center">你好！我是你的面试准备助手。</p>
              <p className="text-xs text-muted text-center mb-3">告诉我你想做什么，或者选择：</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((qa) => (
                  <button
                    key={qa.panel}
                    onClick={() => { setActivePanel(qa.panel); setPanelProps({}); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-[#051C2C]/5 text-sm text-gray-700 transition-colors text-left"
                  >
                    <span>{qa.icon}</span>
                    <span>{qa.label}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-[11px] text-muted text-center mb-2">或者直接问我：</p>
                {["我McKinsey面试还有两周，怎么准备？", "帮我分析薄弱环节", "最近有什么好岗位？"].map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} className="block w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors mb-1">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[90%]">
                <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-[#051C2C] text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}>
                  <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                </div>
                {msg.action && PANELS[msg.action.payload?.split(":")[0] || ""] && (
                  <button
                    onClick={() => executeAction(msg.action!)}
                    className="mt-1 flex items-center gap-1.5 text-xs text-[#051C2C] bg-[#051C2C]/5 hover:bg-[#051C2C]/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    打开 {PANELS[msg.action.payload?.split(":")[0] || ""]?.label}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-3 py-2.5 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="告诉我你想做什么..."
              rows={1}
              className="flex-1 resize-none border-0 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#051C2C]/20 max-h-20"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="shrink-0 w-9 h-9 rounded-xl bg-[#051C2C] text-white flex items-center justify-center hover:bg-[#0A2E4A] transition-colors disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat toggle (when collapsed) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-[#051C2C] text-white w-8 h-16 rounded-r-lg flex items-center justify-center hover:w-10 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* ===== RIGHT: Dynamic Panel ===== */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        {/* Panel tabs (when a panel is active) */}
        {activePanel && (
          <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-2 flex items-center gap-2 overflow-x-auto">
            {Object.entries(PANELS).map(([key, panel]) => (
              <button
                key={key}
                onClick={() => { setActivePanel(key); setPanelProps({}); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activePanel === key ? "bg-[#051C2C] text-white" : "text-muted hover:bg-gray-100"
                }`}
              >
                <span>{panel.icon}</span>
                <span>{panel.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Panel content */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {ActivePanelComponent ? (
            <Suspense fallback={<div className="text-center py-20 text-muted">加载中...</div>}>
              <ActivePanelComponent {...panelProps} />
            </Suspense>
          ) : !activePanel ? (
            // Welcome / default view (show children = current page route)
            <>{children}</>
          ) : null}
        </div>
      </div>
    </div>
  );
}
