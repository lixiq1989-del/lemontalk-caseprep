"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DRILLS, DRILL_CATEGORIES, shuffleDrills, generateMathDrills, type DrillQuestion } from "@/lib/drills";
import { SIZING_CASES } from "@/lib/sizing";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import ChartDisplay from "@/components/ChartDisplay";

type Mode = "home" | "drill" | "result";

interface Stats {
  total: number;
  correct: number;
  streak: number;
  maxStreak: number;
  byCategory: Record<string, { total: number; correct: number }>;
}

const emptyStats: Stats = {
  total: 0,
  correct: 0,
  streak: 0,
  maxStreak: 0,
  byCategory: {},
};

interface DrillModuleProps {
  initialCategory?: string;
  onClose?: () => void;
}

export default function DrillModule({ initialCategory, onClose: _onClose }: DrillModuleProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("home");
  const [queue, setQueue] = useState<DrillQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [numberInput, setNumberInput] = useState("");
  const [openInput, setOpenInput] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dailyCount] = useState(10);
  const [answers, setAnswers] = useState<{ category: string; correct: boolean }[]>([]);
  const [showShareCard, setShowShareCard] = useState(false);

  // Timer
  useEffect(() => {
    if (mode !== "drill" || showAnswer || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setTimedOut(true);
          setShowAnswer(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, showAnswer, timeLeft]);

  const startDrill = useCallback(
    (category: string) => {
      let pool: DrillQuestion[];

      if (category === "calculation") {
        pool = generateMathDrills(dailyCount);
      } else {
        pool = [...DRILLS];
        if (category !== "all") {
          pool = pool.filter((d) => d.category === category);
        }
      }

      const shuffled = category === "calculation" ? pool : shuffleDrills(pool).slice(0, dailyCount);
      setQueue(shuffled);
      setCurrent(0);
      setSelected(null);
      setNumberInput("");
      setOpenInput("");
      setShowAnswer(false);
      setTimedOut(false);
      setSessionCorrect(0);
      setSessionTotal(0);
      setAnswers([]);
      setFilterCategory(category);
      if (shuffled.length > 0) {
        setTimeLeft(shuffled[0].timeLimit);
      }
      setMode("drill");
    },
    [dailyCount]
  );

  // Read category from URL directly (works with client-side navigation)
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    const cat = urlCategory || initialCategory;
    if (cat) startDrill(cat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory, initialCategory]);

  const recordAnswer = useCallback(
    (isCorrect: boolean) => {
      const q = queue[current];
      setSessionTotal((t) => t + 1);
      if (isCorrect) setSessionCorrect((c) => c + 1);
      setAnswers((prev) => [...prev, { category: q.category, correct: isCorrect }]);

      setStats((prev) => {
        const cat = prev.byCategory[q.category] || { total: 0, correct: 0 };
        return {
          total: prev.total + 1,
          correct: prev.correct + (isCorrect ? 1 : 0),
          streak: isCorrect ? prev.streak + 1 : 0,
          maxStreak: isCorrect
            ? Math.max(prev.maxStreak, prev.streak + 1)
            : prev.maxStreak,
          byCategory: {
            ...prev.byCategory,
            [q.category]: {
              total: cat.total + 1,
              correct: cat.correct + (isCorrect ? 1 : 0),
            },
          },
        };
      });
    },
    [queue, current]
  );

  // Save drill records to Supabase when session ends
  useEffect(() => {
    if (mode === "result" && user && answers.length > 0) {
      fetch("/api/drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, records: answers }),
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Choice: select option
  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    recordAnswer(idx === queue[current].answer);
  };

  // Number: submit answer
  const handleNumberSubmit = () => {
    if (showAnswer || !numberInput.trim()) return;
    setShowAnswer(true);
    const q = queue[current];
    const userNum = parseFloat(numberInput);
    const correct = q.correctNumber!;
    const tol = q.tolerance || 0.05;
    const isCorrect =
      tol === 0
        ? userNum === correct
        : Math.abs(userNum - correct) / Math.abs(correct) <= tol;
    recordAnswer(isCorrect);
  };

  // Open: show answer + call AI for feedback
  const handleOpenSubmit = async () => {
    if (showAnswer) return;
    setShowAnswer(true);
    // Key points check (quick local check)
    const q = queue[current];
    const input = openInput.toLowerCase();
    const matched = (q.keyPoints || []).filter((kp) =>
      input.includes(kp.toLowerCase())
    );
    const hitRate = q.keyPoints?.length
      ? matched.length / q.keyPoints.length
      : 0;
    recordAnswer(hitRate >= 0.5);

    // Call AI for detailed feedback (non-blocking)
    if (openInput.trim().length > 10) {
      setAiLoading(true);
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `你是一位资深咨询面试官。请评价以下回答的质量。

题目：${q.question}

学生回答：${openInput}

参考答案：${q.referenceAnswer || "无"}

请用以下格式简短评价（总共不超过150字）：
- 亮点：（1-2个做得好的地方）
- 改进：（1-2个最关键的改进建议）
- 评分：⭐⭐⭐（1-5星）`,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiFeedback(data.reply || data.message || "");
        }
      } catch {
        // AI feedback is optional, don't block
      } finally {
        setAiLoading(false);
      }
    }
  };

  const nextQuestion = () => {
    if (current + 1 >= queue.length) {
      setMode("result");
      return;
    }
    const next = current + 1;
    setCurrent(next);
    setSelected(null);
    setNumberInput("");
    setOpenInput("");
    setAiFeedback("");
    setAiLoading(false);
    setShowAnswer(false);
    setTimedOut(false);
    setTimeLeft(queue[next].timeLimit);
  };

  // ====== Personalized Recommendation ======
  interface DailyPlan { category: string; label: string; count: number; reason: string }
  interface Recommendation { strategy: string; daysLeft: number | null; dailyPlan: DailyPlan[]; weaknesses: { category: string; label: string; accuracy: number }[]; gaps: { category: string; label: string }[] }
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (!user) return;
    const interviewDate = localStorage.getItem(`interview_date_${user.id}`) || "";
    fetch(`/api/drill/recommend?user_id=${user.id}&interview_date=${interviewDate}`)
      .then((r) => r.json())
      .then((d) => setRecommendation(d))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ====== HOME ======
  if (mode === "home") {
    const accuracy =
      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Case 每日一练</h1>
          <p className="text-muted text-sm">
            碎片化刷题，每题 30 秒，不知不觉提升 Case 能力
          </p>
        </div>

        {stats.total > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-[10px] text-muted">已刷题数</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-[#00836E]">{accuracy}%</div>
              <div className="text-[10px] text-muted">正确率</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-[#E87722]">
                {stats.streak}
              </div>
              <div className="text-[10px] text-muted">连续正确</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-[#007680]">
                {stats.maxStreak}
              </div>
              <div className="text-[10px] text-muted">最长连对</div>
            </div>
          </div>
        )}

        {/* Personalized recommendation */}
        {recommendation && recommendation.dailyPlan.length > 0 && (
          <div className="border border-[#051C2C]/15 rounded-xl p-4 mb-6 bg-[#051C2C]/[0.02]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🎯</span>
              <h2 className="text-sm font-bold text-[#051C2C]">今日推荐</h2>
              {recommendation.daysLeft !== null && (
                <span className="text-xs bg-[#C4071B]/10 text-[#C4071B] px-2 py-0.5 rounded-full font-medium ml-auto">
                  面试倒计时 {recommendation.daysLeft} 天
                </span>
              )}
            </div>
            <p className="text-xs text-muted mb-3">{recommendation.strategy}</p>
            <div className="space-y-2">
              {recommendation.dailyPlan.map((plan) => (
                <button
                  key={plan.category}
                  onClick={() => startDrill(plan.category)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white border border-border hover:border-[#051C2C]/30 transition-all text-left"
                >
                  <span className="text-lg">
                    {DRILL_CATEGORIES.find((c) => c.key === plan.category)?.icon || "📝"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{plan.label}</div>
                    <div className="text-[11px] text-muted truncate">{plan.reason}</div>
                  </div>
                  <div className="text-xs font-bold text-[#051C2C] bg-[#051C2C]/5 px-2.5 py-1 rounded-lg">
                    {plan.count} 题
                  </div>
                </button>
              ))}
            </div>
            {recommendation.weaknesses.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] text-muted">
                  薄弱项：{recommendation.weaknesses.map((w) => `${w.label}(${w.accuracy}%)`).join("、")}
                  {recommendation.gaps.length > 0 && ` · 未练过：${recommendation.gaps.map((g) => g.label).join("、")}`}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => startDrill("all")}
          className="w-full bg-primary text-white rounded-xl py-4 text-base font-semibold hover:bg-[#0A2E4A] transition-colors mb-6 shadow-sm"
        >
          开始今日刷题 · {dailyCount} 题
        </button>

        <h2 className="text-sm font-semibold mb-3">按专项刷题</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {DRILL_CATEGORIES.map((cat) => {
            const catDrills = DRILLS.filter((d) => d.category === cat.key);
            const isGenerated = cat.key === "calculation";
            const catStats = stats.byCategory[cat.key];
            const catAccuracy =
              catStats && catStats.total > 0
                ? Math.round((catStats.correct / catStats.total) * 100)
                : null;
            return (
              <button
                key={cat.key}
                onClick={() => startDrill(cat.key)}
                className={`card-hover border rounded-xl p-4 text-left transition-all ${cat.color}`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.label}</div>
                <div className="text-xs opacity-70 mt-1">
                  {isGenerated ? "无限题 · 自动生成" : `${catDrills.length} 题`}
                </div>
                {catAccuracy !== null && (
                  <div className="text-xs font-medium mt-2">
                    正确率 {catAccuracy}%
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sizing Flow */}
        <Link
          href="/drill/sizing"
          className="card-hover block border-2 border-pink-200 rounded-xl p-5 bg-gradient-to-r from-pink-50 to-purple-50 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="font-bold text-base">Market Sizing 闯关</h3>
              <p className="text-xs text-muted mt-0.5">
                分步引导估算，像真面试一样一步步推导，完整走完只要 2 分钟
              </p>
            </div>
            <div className="ml-auto text-primary text-sm font-medium">
              {SIZING_CASES.length} 题 →
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ====== DRILL ======
  if (mode === "drill") {
    const q = queue[current];
    if (!q) return null;
    const progress = ((current + 1) / queue.length) * 100;
    const timePercent = (timeLeft / q.timeLimit) * 100;

    // For number type: check correctness
    const numberCorrect =
      q.type === "number" && showAnswer
        ? (() => {
            const userNum = parseFloat(numberInput);
            const correct = q.correctNumber!;
            const tol = q.tolerance || 0.05;
            return tol === 0
              ? userNum === correct
              : Math.abs(userNum - correct) / Math.abs(correct) <= tol;
          })()
        : false;

    // For open type: check key points
    const openMatched =
      q.type === "open" && showAnswer
        ? (q.keyPoints || []).filter((kp) =>
            openInput.toLowerCase().includes(kp.toLowerCase())
          )
        : [];

    return (
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMode("home")}
            className="text-sm text-muted hover:text-primary"
          >
            ✕ 退出
          </button>
          <div className="text-sm text-muted">
            {current + 1} / {queue.length}
          </div>
          <div className="flex items-center gap-2">
            {stats.streak > 0 && (
              <span className="text-sm text-orange-500 font-medium">
                {stats.streak}🔥
              </span>
            )}
            <span className="text-sm font-medium text-green-600">
              {sessionCorrect}/{sessionTotal}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer bar */}
        {!showAnswer && (
          <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timePercent > 30
                  ? "bg-green-400"
                  : timePercent > 10
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        )}

        {/* Question card */}
        <div className="border border-border rounded-xl p-6 bg-white mb-4">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {DRILL_CATEGORIES.find((c) => c.key === q.category)?.label}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                q.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : q.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {q.difficulty === "easy"
                ? "简单"
                : q.difficulty === "medium"
                ? "中等"
                : "困难"}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                q.type === "choice"
                  ? "bg-blue-50 text-blue-600"
                  : q.type === "number"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-teal-50 text-teal-600"
              }`}
            >
              {q.type === "choice"
                ? "选择"
                : q.type === "number"
                ? "填空"
                : "开放"}
            </span>
            <span className="text-[10px] text-muted ml-auto">
              {q.source}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-base font-semibold leading-relaxed mb-5">
            {q.question}
          </h2>

          {/* Chart (if present) */}
          {q.chartData && <ChartDisplay data={q.chartData} />}

          {/* === CHOICE TYPE === */}
          {q.type === "choice" && q.options && (
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                let cls =
                  "border border-border bg-white hover:border-primary hover:bg-primary/5";
                if (showAnswer) {
                  if (idx === q.answer) {
                    cls = "border-2 border-green-500 bg-green-50";
                  } else if (idx === selected && selected !== q.answer) {
                    cls = "border-2 border-red-400 bg-red-50";
                  } else {
                    cls = "border border-border bg-gray-50 opacity-50";
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showAnswer}
                    className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-all ${cls}`}
                  >
                    <span className="font-medium text-muted mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* === NUMBER TYPE === */}
          {q.type === "number" && (
            <div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNumberSubmit()}
                  placeholder="输入你的答案..."
                  disabled={showAnswer}
                  autoFocus
                  className="flex-1 border-2 border-border rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-primary disabled:bg-gray-50"
                />
                {q.unit && (
                  <span className="text-sm text-muted font-medium">
                    {q.unit}
                  </span>
                )}
              </div>
              {!showAnswer && !timedOut && (
                <button
                  onClick={handleNumberSubmit}
                  disabled={!numberInput.trim()}
                  className="mt-3 w-full bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0A2E4A] transition-colors disabled:opacity-30"
                >
                  提交答案
                </button>
              )}
              {showAnswer && (
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      numberCorrect
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {timedOut
                      ? "⏰ 时间到"
                      : numberCorrect
                      ? "正确！"
                      : `答错了 · 你答: ${numberInput}`}
                  </div>
                  <div className="text-sm font-semibold text-green-700">
                    正确答案: {q.correctNumber} {q.unit}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === OPEN TYPE === */}
          {q.type === "open" && (
            <div>
              <textarea
                value={openInput}
                onChange={(e) => setOpenInput(e.target.value)}
                placeholder="写下你的分析框架...&#10;&#10;例如：&#10;一、收入端&#10;  - 价格 × 销量&#10;二、成本端&#10;  - 固定成本&#10;  - 可变成本"
                disabled={showAnswer}
                rows={8}
                className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary disabled:bg-gray-50 resize-none font-mono leading-relaxed"
              />
              {!showAnswer && !timedOut && (
                <button
                  onClick={handleOpenSubmit}
                  disabled={!openInput.trim()}
                  className="mt-3 w-full bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0A2E4A] transition-colors disabled:opacity-30"
                >
                  提交框架
                </button>
              )}
              {showAnswer && (
                <div className="mt-4 space-y-3">
                  {/* AI Feedback */}
                  {aiLoading && (
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-800 mb-1">AI 点评中...</p>
                      <div className="animate-pulse h-3 bg-blue-200 rounded w-3/4" />
                    </div>
                  )}
                  {aiFeedback && !aiLoading && (
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-800 mb-2">AI 面试官点评</p>
                      <pre className="text-sm text-blue-900 whitespace-pre-wrap font-sans leading-relaxed">
                        {aiFeedback}
                      </pre>
                    </div>
                  )}
                  {/* Key points check */}
                  {q.keyPoints && q.keyPoints.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted mb-2">
                        关键点覆盖（{openMatched.length}/{q.keyPoints.length}）
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {q.keyPoints.map((kp) => {
                          const hit = openInput
                            .toLowerCase()
                            .includes(kp.toLowerCase());
                          return (
                            <span
                              key={kp}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                hit
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-50 text-red-500"
                              }`}
                            >
                              {hit ? "✓" : "✕"} {kp}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Reference answer */}
                  {q.referenceAnswer && (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-green-800 mb-2">
                        参考答案
                      </p>
                      <pre className="text-sm text-green-900 whitespace-pre-wrap font-sans leading-relaxed">
                        {q.referenceAnswer}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanation (for choice & number) */}
        {showAnswer && q.type !== "open" && (
          <div className="border border-border rounded-xl p-5 bg-white mb-4">
            <div className="flex items-center gap-2 mb-2">
              {timedOut ? (
                <span className="text-sm font-semibold text-orange-600">
                  ⏰ 时间到！
                </span>
              ) : q.type === "choice" ? (
                selected === q.answer ? (
                  <span className="text-sm font-semibold text-green-600">
                    正确！
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-500">
                    答错了
                  </span>
                )
              ) : numberCorrect ? (
                <span className="text-sm font-semibold text-green-600">
                  正确！
                </span>
              ) : (
                <span className="text-sm font-semibold text-red-500">
                  答错了
                </span>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}

        {/* Explanation for open */}
        {showAnswer && q.type === "open" && (
          <div className="border border-border rounded-xl p-5 bg-white mb-4">
            <p className="text-sm text-foreground leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showAnswer && (
          <button
            onClick={nextQuestion}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0A2E4A] transition-colors"
          >
            {current + 1 >= queue.length ? "查看结果" : "下一题 →"}
          </button>
        )}
      </div>
    );
  }

  // ====== RESULT ======
  const accuracy =
    sessionTotal > 0
      ? Math.round((sessionCorrect / sessionTotal) * 100)
      : 0;
  const grade =
    accuracy >= 90
      ? { label: "Case 大神", emoji: "🏆", color: "text-yellow-600" }
      : accuracy >= 70
      ? { label: "准备充分", emoji: "💪", color: "text-green-600" }
      : accuracy >= 50
      ? { label: "继续加油", emoji: "📚", color: "text-blue-600" }
      : { label: "需要突击", emoji: "🔥", color: "text-red-600" };

  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="max-w-md mx-auto text-center">
      {/* 打卡海报 overlay */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowShareCard(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
            <div id="share-card" className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#051C2C] via-[#0A2E4A] to-[#007680] p-8 text-white text-center shadow-2xl">
              <div className="text-sm font-medium opacity-80 mb-6 tracking-widest">LEMONTALK · CASEPREP</div>
              <div className="text-6xl mb-3">{grade.emoji}</div>
              <div className="text-2xl font-bold mb-1">{grade.label}</div>
              <div className="text-sm opacity-70 mb-6">今日刷题打卡</div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/15 rounded-xl py-3">
                  <div className="text-2xl font-bold">{accuracy}%</div>
                  <div className="text-xs opacity-70 mt-0.5">正确率</div>
                </div>
                <div className="bg-white/15 rounded-xl py-3">
                  <div className="text-2xl font-bold">{sessionCorrect}/{sessionTotal}</div>
                  <div className="text-xs opacity-70 mt-0.5">答对/总题</div>
                </div>
                <div className="bg-white/15 rounded-xl py-3">
                  <div className="text-2xl font-bold">{stats.maxStreak}🔥</div>
                  <div className="text-xs opacity-70 mt-0.5">最长连对</div>
                </div>
              </div>
              <div className="text-xs opacity-60">{today} · 每日刷题，不知不觉提升</div>
            </div>
            <p className="text-white/70 text-xs text-center mt-3">截图保存，分享到朋友圈</p>
            <button onClick={() => setShowShareCard(false)} className="mt-3 w-full bg-white/20 text-white rounded-xl py-2.5 text-sm hover:bg-white/30 transition-colors">
              关闭
            </button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-2xl p-8 bg-white mb-6">
        <div className="text-5xl mb-4">{grade.emoji}</div>
        <h1 className={`text-2xl font-bold mb-1 ${grade.color}`}>
          {grade.label}
        </h1>
        <p className="text-muted text-sm mb-6">本轮刷题完成</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-3xl font-bold text-primary">{accuracy}%</div>
            <div className="text-xs text-muted">正确率</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {sessionCorrect}/{sessionTotal}
            </div>
            <div className="text-xs text-muted">答对/总题</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500">
              {stats.maxStreak}
            </div>
            <div className="text-xs text-muted">最长连对</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="text-left space-y-2 mb-6">
          <h3 className="text-xs font-semibold text-muted">各专项表现</h3>
          {DRILL_CATEGORIES.map((cat) => {
            const s = stats.byCategory[cat.key];
            if (!s || s.total === 0) return null;
            const pct = Math.round((s.correct / s.total) * 100);
            return (
              <div key={cat.key} className="flex items-center gap-2">
                <span className="text-sm">{cat.icon}</span>
                <span className="text-xs flex-1">{cat.label}</span>
                <div className="w-24 h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 70
                        ? "bg-green-400"
                        : pct >= 40
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted">
            累计刷题 {stats.total} 道 · 总正确率{" "}
            {stats.total > 0
              ? Math.round((stats.correct / stats.total) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowShareCard(true)}
          className="w-full bg-gradient-to-r from-[#051C2C] to-[#007680] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          📸 生成打卡海报
        </button>
        <button
          onClick={() => startDrill(filterCategory)}
          className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0A2E4A] transition-colors"
        >
          再刷一轮
        </button>
        <button
          onClick={() => setMode("home")}
          className="w-full border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50 transition-colors"
        >
          返回选题
        </button>
        <Link
          href="/partner"
          className="block text-sm text-primary hover:underline mt-2"
        >
          找个 Partner 一起练 →
        </Link>
      </div>
    </div>
  );
}
