"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface Message {
  role: "user" | "ai";
  text: string;
  action?: PageAction;
}

// Actions AI can trigger on the page
interface PageAction {
  type: "navigate" | "filter" | "start_drill" | "set_preference";
  payload: string; // URL, filter value, category, or preference key=value
}

// Page-aware context and suggested prompts
function getPageContext(pathname: string): { context: string; suggestions: string[] } {
  if (pathname.startsWith("/drill")) {
    return {
      context: "用户在练习页面（Drill），可能在做框架搭建/商业计算/图表解读/头脑风暴/总结推荐练习。",
      suggestions: [
        "我structuring总是不好，怎么提升？",
        "帮我分析这道题哪里做错了",
        "McKinsey面试最爱考什么类型？",
        "给我制定一个7天冲刺计划",
      ],
    };
  }
  if (pathname.startsWith("/jobs")) {
    return {
      context: "用户在岗位/招聘情报页面，查看各国咨询/金融岗位和招聘进度。",
      suggestions: [
        "帮我筛选适合我的岗位",
        "McKinsey现在招聘到什么阶段了？",
        "英国和香港哪个更容易拿offer？",
        "投行和咨询我该选哪个？",
      ],
    };
  }
  if (pathname.startsWith("/casebook")) {
    return {
      context: "用户在Case题库页面，浏览咨询Case Interview练习题。",
      suggestions: [
        "这道case的框架怎么搭？",
        "推荐几道适合新手的case",
        "Profitability case有什么套路？",
        "Market Entry和Growth Strategy有什么区别？",
      ],
    };
  }
  if (pathname.startsWith("/ai")) {
    return {
      context: "用户在AI工具区，可能在用模拟面试/PEI练习/简历优化等功能。",
      suggestions: [
        "帮我准备Why Consulting这个问题",
        "我的简历有哪些可以改进的？",
        "模拟一个McKinsey风格的case",
        "PEI的STAR结构怎么用？",
      ],
    };
  }
  if (pathname.startsWith("/partner")) {
    return {
      context: "用户在Case Partner配对页面，寻找练习伙伴。",
      suggestions: [
        "怎么找到靠谱的case partner？",
        "做interviewer该注意什么？",
        "一周练几次case比较合适？",
        "怎么给partner有用的feedback？",
      ],
    };
  }
  if (pathname.startsWith("/community")) {
    return {
      context: "用户在社区页面，浏览面经和讨论。",
      suggestions: [
        "帮我总结最近的面经要点",
        "今年MBB的面试趋势是什么？",
        "什么时候开始准备最合适？",
      ],
    };
  }
  return {
    context: "用户在CasePrep咨询面试准备平台首页。",
    suggestions: [
      "我是新手，从哪里开始准备？",
      "帮我制定面试准备计划",
      "MBB和Big4的面试有什么区别？",
      "我该先练什么？",
    ],
  };
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { context, suggestions } = getPageContext(pathname);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Execute page actions from AI
  const executeAction = useCallback((action: PageAction) => {
    switch (action.type) {
      case "navigate":
        router.push(action.payload);
        setOpen(false);
        break;
      case "filter":
        // Dispatch custom event that page components can listen to
        window.dispatchEvent(new CustomEvent("ai-filter", { detail: action.payload }));
        break;
      case "start_drill":
        router.push(`/drill?category=${action.payload}`);
        setOpen(false);
        break;
      case "set_preference":
        // Store preference in localStorage
        const [key, value] = action.payload.split("=");
        if (key && value) {
          localStorage.setItem(`ai_pref_${key}`, value);
          window.dispatchEvent(new CustomEvent("ai-preference", { detail: { key, value } }));
        }
        break;
    }
  }, [router]);

  // Parse AI response for embedded actions [ACTION:type:payload]
  function parseResponse(text: string): { cleanText: string; action?: PageAction } {
    const actionMatch = text.match(/\[ACTION:(\w+):([^\]]+)\]/);
    if (actionMatch) {
      const cleanText = text.replace(/\[ACTION:[^\]]+\]/, "").trim();
      return {
        cleanText,
        action: { type: actionMatch[1] as PageAction["type"], payload: actionMatch[2] },
      };
    }
    return { cleanText: text };
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const actionInstructions = `

如果用户的问题暗示需要页面操作，在回复末尾加上一个action标签（用户看不到）：
- 用户想练某类题 → [ACTION:start_drill:structuring] 或 [ACTION:start_drill:chart] 等
- 用户想看某地区岗位 → [ACTION:navigate:/jobs?region=CN] 或 UK/US/HK/SG
- 用户想筛选内容 → [ACTION:filter:值]
- 用户表达了偏好（目标公司/薄弱项）→ [ACTION:set_preference:target_firm=MBB] 或 [ACTION:set_preference:weakness=structuring]

只在明确需要时加action，不要每条都加。action标签放在回复最后一行。`;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          message: `[页面: ${pathname}] [上下文: ${context}]${user ? ` [用户已登录]` : ""}${actionInstructions}\n\n${text.trim()}`,
          history: messages.slice(-8),
        }),
      });

      const data = await res.json();
      const rawResponse = data.response || "抱歉，请重试。";
      const { cleanText, action } = parseResponse(rawResponse);

      const aiMsg: Message = { role: "ai", text: cleanText, action };
      setMessages((prev) => [...prev, aiMsg]);

      // Auto-execute action
      if (action) {
        setTimeout(() => executeAction(action), 500);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "网络错误，请重试。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          open
            ? "bg-gray-600 text-white rotate-0"
            : "bg-[#051C2C] text-white hover:bg-[#0A2E4A] hover:scale-105"
        }`}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#051C2C] text-white px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">AI</div>
            <div>
              <div className="text-sm font-semibold">AI 助手</div>
              <div className="text-[10px] text-white/60">知道你在看什么，随时帮你</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[360px]">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted text-center mb-3">试试问我：</p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-[#051C2C]/5 text-gray-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#051C2C] text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                  </div>
                  {msg.action && (
                    <button
                      onClick={() => executeAction(msg.action!)}
                      className="mt-1.5 flex items-center gap-1.5 text-xs text-[#051C2C] bg-[#051C2C]/5 hover:bg-[#051C2C]/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      {msg.action.type === "navigate" && "跳转页面"}
                      {msg.action.type === "start_drill" && "开始练习"}
                      {msg.action.type === "filter" && "筛选内容"}
                      {msg.action.type === "set_preference" && "已记住偏好"}
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
          <div className="border-t border-border px-3 py-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="输入问题..."
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
      )}
    </>
  );
}
