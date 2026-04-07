"use client";

import { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { useAuth } from "@/lib/auth-context";
import { panelBus } from "@/lib/panel-bus";
import { type PlanSpec } from "@/components/PlanPanel";

// Dynamically importable panel modules
const PANELS: Record<string, { label: string; icon: string; component: React.LazyExoticComponent<any> }> = {
  myplan: { label: "我的计划", icon: "🎯", component: lazy(() => import("@/components/PlanPanelWrapper")) },
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

// AI-generated document panel (like Claude artifacts)
function AIDocPanel({ content, title }: { content: string; title: string }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📝</span>
        <h1 className="text-xl font-bold text-[#051C2C]">{title}</h1>
        <span className="text-xs bg-[#051C2C]/10 text-[#051C2C] px-2 py-0.5 rounded-full">AI 生成</span>
      </div>
      <div className="bg-white border border-border rounded-xl p-6 prose prose-sm max-w-none">
        {content.split("\n").map((line, i) => {
          if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
          if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith("### ")) return <h3 key={i} className="text-base font-bold mt-3 mb-1">{line.slice(4)}</h3>;
          if (line.startsWith("- ")) return <li key={i} className="ml-4 text-sm text-gray-700 mb-1">{line.slice(2)}</li>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-sm mt-2">{line.slice(2, -2)}</p>;
          if (line.trim() === "") return <div key={i} className="h-2" />;
          return <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1">{line}</p>;
        })}
      </div>
    </div>
  );
}

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
  const [docContent, setDocContent] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [planSpec, setPlanSpec] = useState<PlanSpec | null>(null);
  const [showChat, setShowChat] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore saved plan on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("caseprep_plan");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.title && parsed?.sections) {
          setPlanSpec(parsed);
          setActivePanel("myplan");
        }
      }
    } catch {}
  }, []);

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

  // Streaming send: AI response streams in real-time, panel markers execute as they appear
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Add a placeholder AI message that we'll stream into
    const aiMsgIndex = messages.length + 1; // +1 for the user msg we just added
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      const panelContext = activePanel ? PANELS[activePanel]?.label || activePanel : "";

      const res = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-8),
          panelContext,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      let executedMarkers = new Set<string>();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const { text: chunk } = JSON.parse(data);
            if (!chunk) continue;

            fullText += chunk;

            // Parse and execute panel markers as they appear (skip already-executed ones)
            const markerRegex = /\[PANEL:([^\]]+)\]/g;
            let match;
            while ((match = markerRegex.exec(fullText)) !== null) {
              const markerKey = match[0] + "_" + match.index;
              if (executedMarkers.has(markerKey)) continue;
              executedMarkers.add(markerKey);
              const parts = match[1].split(":");
              const panelKey = parts[0];
              const action = parts[1] || "open";
              const param = parts[2] || "";

              if (action === "open" && PANELS[panelKey]) {
                const props: Record<string, any> = {};
                if (panelKey === "drill" && param) props.initialCategory = param;
                if (panelKey === "jobs" && param) props.initialRegion = param;
                if (panelKey === "partner") {
                  if (param) props.initialCaseType = param;
                }
                setActivePanel(panelKey);
                setPanelProps(props);
                // Also emit to panelBus so already-mounted components react
                if (panelKey === "drill" && param) panelBus.emit("drill", "start", { category: param });
                if (panelKey === "jobs" && param) panelBus.emit("jobs", "filter", { region: param });
              } else if (action === "filter") {
                // Direct filter command: [PANEL:partner:filter:Profitability,beginner]
                const filterParts = param.split(",");
                if (panelKey === "partner") {
                  panelBus.emit("partner", "filter", {
                    caseType: filterParts[0] || "",
                    level: filterParts[1] || "",
                    firm: filterParts[2] || "",
                  });
                } else if (panelKey === "jobs") {
                  panelBus.emit("jobs", "filter", {
                    region: filterParts[0] || "",
                    type: filterParts[1] || "",
                  });
                } else if (panelKey === "drill") {
                  panelBus.emit("drill", "start", { category: filterParts[0] || "" });
                }
              } else if (panelKey === "preference" && action === "set" && param) {
                const [key, value] = param.split("=");
                if (key && value) localStorage.setItem(`ai_pref_${key}`, value);
              } else if (panelKey === "doc") {
                setActivePanel("_doc");
                setDocTitle(param || "AI 文档");
              } else if (panelKey === "plan") {
                // [PANEL:plan:show:title] — switch to plan mode, plan JSON follows in [PLAN_START]...[PLAN_END]
                setActivePanel("myplan");
              }
            }

            // Extract DOC content blocks
            const docMatch = fullText.match(/\[DOC_START\]([\s\S]*?)(\[DOC_END\]|$)/);
            if (docMatch) {
              setDocContent(docMatch[1].trim());
            }

            // Extract PLAN JSON blocks
            const planStartPos = fullText.indexOf("[PLAN_START]");
            const planEndPos = fullText.indexOf("[PLAN_END]");
            if (planStartPos !== -1) {
              setActivePanel("myplan"); // Switch to plan view immediately
              if (planEndPos !== -1) {
                // Complete JSON
                const planJson = fullText.slice(planStartPos + "[PLAN_START]".length, planEndPos).trim();
                try {
                  const parsed = JSON.parse(planJson);
                  setPlanSpec(parsed);
                  localStorage.setItem("caseprep_plan", JSON.stringify(parsed));
                  window.dispatchEvent(new CustomEvent("plan-updated", { detail: { plan: parsed } }));
                } catch {
                  // Bad JSON
                }
              } else {
                // Try to parse partial JSON (might work if all sections complete)
                const partialJson = fullText.slice(planStartPos + "[PLAN_START]".length).trim();
                // Try adding closing brackets
                for (const suffix of ["", "]}", "]}]}", '"}]}']) {
                  try {
                    const parsed = JSON.parse(partialJson + suffix);
                    if (parsed.title && parsed.sections) {
                      setPlanSpec(parsed);
                      localStorage.setItem("caseprep_plan", JSON.stringify(parsed));
                      window.dispatchEvent(new CustomEvent("plan-updated", { detail: { plan: parsed } }));
                      break;
                    }
                  } catch { /* keep trying */ }
                }
              }
            }

            // Update the AI message with text (strip ALL markers for display)
            let displayText = fullText;
            // Strip panel markers
            displayText = displayText.replace(/\[PANEL:[^\]]+\]/g, "");
            // Strip DOC blocks
            displayText = displayText.replace(/\[DOC_START\][\s\S]*?(\[DOC_END\]|$)/g, "");
            // Strip PLAN blocks — aggressively: from [PLAN_START] to end of text if [PLAN_END] not yet received
            const planStartIdx = displayText.indexOf("[PLAN_START]");
            if (planStartIdx !== -1) {
              const planEndIdx = displayText.indexOf("[PLAN_END]");
              if (planEndIdx !== -1) {
                displayText = displayText.slice(0, planStartIdx) + displayText.slice(planEndIdx + "[PLAN_END]".length);
              } else {
                // PLAN_END not yet received — strip everything from PLAN_START onwards
                displayText = displayText.slice(0, planStartIdx);
              }
            }
            displayText = displayText.trim();
            setMessages((prev) => {
              const updated = [...prev];
              if (updated[aiMsgIndex]) {
                updated[aiMsgIndex] = { ...updated[aiMsgIndex], text: displayText };
              }
              return updated;
            });
          } catch {
            // Skip unparseable chunks
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[aiMsgIndex]) {
          updated[aiMsgIndex] = { ...updated[aiMsgIndex], text: "网络错误，请重试。" };
        }
        return updated;
      });
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
          {activePanel === "_doc" ? (
            <AIDocPanel content={docContent} title={docTitle} />
          ) : ActivePanelComponent ? (
            <Suspense fallback={<div className="text-center py-20 text-muted">加载中...</div>}>
              <ActivePanelComponent {...panelProps} />
            </Suspense>
          ) : !activePanel ? (
            <>{children}</>
          ) : null}
        </div>
      </div>
    </div>
  );
}
