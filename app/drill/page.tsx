"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DRILLS, DRILL_CATEGORIES, shuffleDrills, type DrillQuestion } from "@/lib/drills";

type Mode = "home" | "drill" | "result";

// Stats stored in component state (resets on refresh for MVP)
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

export default function DrillPage() {
  const [mode, setMode] = useState<Mode>("home");
  const [queue, setQueue] = useState<DrillQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dailyCount] = useState(10);

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
      let pool = [...DRILLS];
      if (category !== "all") {
        pool = pool.filter((d) => d.category === category);
      }
      const shuffled = shuffleDrills(pool).slice(0, dailyCount);
      setQueue(shuffled);
      setCurrent(0);
      setSelected(null);
      setShowAnswer(false);
      setTimedOut(false);
      setSessionCorrect(0);
      setSessionTotal(0);
      setFilterCategory(category);
      if (shuffled.length > 0) {
        setTimeLeft(shuffled[0].timeLimit);
      }
      setMode("drill");
    },
    [dailyCount]
  );

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);

    const q = queue[current];
    const isCorrect = idx === q.answer;
    setSessionTotal((t) => t + 1);
    if (isCorrect) setSessionCorrect((c) => c + 1);

    setStats((prev) => {
      const cat = prev.byCategory[q.category] || { total: 0, correct: 0 };
      return {
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        streak: isCorrect ? prev.streak + 1 : 0,
        maxStreak: isCorrect ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
        byCategory: {
          ...prev.byCategory,
          [q.category]: {
            total: cat.total + 1,
            correct: cat.correct + (isCorrect ? 1 : 0),
          },
        },
      };
    });
  };

  const nextQuestion = () => {
    if (current + 1 >= queue.length) {
      setMode("result");
      return;
    }
    const next = current + 1;
    setCurrent(next);
    setSelected(null);
    setShowAnswer(false);
    setTimedOut(false);
    setTimeLeft(queue[next].timeLimit);
  };

  // ====== HOME ======
  if (mode === "home") {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Case 每日一练</h1>
          <p className="text-muted text-sm">
            碎片化刷题，每题 30 秒，不知不觉提升 Case 能力
          </p>
        </div>

        {/* Stats bar */}
        {stats.total > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-[10px] text-muted">已刷题数</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-[10px] text-muted">正确率</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-orange-500">{stats.streak}🔥</div>
              <div className="text-[10px] text-muted">连续正确</div>
            </div>
            <div className="text-center border border-border rounded-xl py-3 bg-white">
              <div className="text-2xl font-bold text-purple-600">{stats.maxStreak}</div>
              <div className="text-[10px] text-muted">最长连对</div>
            </div>
          </div>
        )}

        {/* Quick start */}
        <button
          onClick={() => startDrill("all")}
          className="w-full bg-primary text-white rounded-xl py-4 text-base font-semibold hover:bg-blue-700 transition-colors mb-6 shadow-sm"
        >
          开始今日刷题 · {dailyCount} 题
        </button>

        {/* Category cards */}
        <h2 className="text-sm font-semibold mb-3">按专项刷题</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {DRILL_CATEGORIES.map((cat) => {
            const catDrills = DRILLS.filter((d) => d.category === cat.key);
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
                <div className="text-xs opacity-70 mt-1">{catDrills.length} 题</div>
                {catAccuracy !== null && (
                  <div className="text-xs font-medium mt-2">正确率 {catAccuracy}%</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted hover:text-primary">
            ← 返回首页
          </Link>
        </div>
      </div>
    );
  }

  // ====== DRILL ======
  if (mode === "drill") {
    const q = queue[current];
    if (!q) return null;
    const progress = ((current + 1) / queue.length) * 100;
    const isCorrect = selected === q.answer;
    const timePercent = (timeLeft / q.timeLimit) * 100;

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
              <span className="text-sm text-orange-500 font-medium">{stats.streak}🔥</span>
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
                timePercent > 30 ? "bg-green-400" : timePercent > 10 ? "bg-yellow-400" : "bg-red-400"
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        )}

        {/* Question card */}
        <div className="border border-border rounded-xl p-6 bg-white mb-4">
          {/* Category + difficulty badge */}
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
              {q.difficulty === "easy" ? "简单" : q.difficulty === "medium" ? "中等" : "困难"}
            </span>
            <span className="text-[10px] text-muted ml-auto">来源: {q.source}</span>
          </div>

          {/* Question */}
          <h2 className="text-base font-semibold leading-relaxed mb-5">{q.question}</h2>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              let cls = "border border-border bg-white hover:border-primary hover:bg-primary/5";
              if (showAnswer) {
                if (idx === q.answer) {
                  cls = "border-2 border-green-500 bg-green-50";
                } else if (idx === selected && !isCorrect) {
                  cls = "border-2 border-red-400 bg-red-50";
                } else {
                  cls = "border border-border bg-gray-50 opacity-50";
                }
              } else if (selected === idx) {
                cls = "border-2 border-primary bg-primary/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !showAnswer && !timedOut && handleSelect(idx)}
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
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="border border-border rounded-xl p-5 bg-white mb-4">
            <div className="flex items-center gap-2 mb-2">
              {timedOut ? (
                <span className="text-sm font-semibold text-orange-600">⏰ 时间到！</span>
              ) : isCorrect ? (
                <span className="text-sm font-semibold text-green-600">正确！</span>
              ) : (
                <span className="text-sm font-semibold text-red-500">答错了</span>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {showAnswer && (
          <button
            onClick={nextQuestion}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {current + 1 >= queue.length ? "查看结果" : "下一题 →"}
          </button>
        )}
      </div>
    );
  }

  // ====== RESULT ======
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const grade =
    accuracy >= 90
      ? { label: "Case 大神", emoji: "🏆", color: "text-yellow-600" }
      : accuracy >= 70
      ? { label: "准备充分", emoji: "💪", color: "text-green-600" }
      : accuracy >= 50
      ? { label: "继续加油", emoji: "📚", color: "text-blue-600" }
      : { label: "需要突击", emoji: "🔥", color: "text-red-600" };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="border border-border rounded-2xl p-8 bg-white mb-6">
        <div className="text-5xl mb-4">{grade.emoji}</div>
        <h1 className={`text-2xl font-bold mb-1 ${grade.color}`}>{grade.label}</h1>
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
            <div className="text-3xl font-bold text-orange-500">{stats.maxStreak}</div>
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
                      pct >= 70 ? "bg-green-400" : pct >= 40 ? "bg-yellow-400" : "bg-red-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Cumulative stats */}
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted">
            累计刷题 {stats.total} 道 · 总正确率{" "}
            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => startDrill(filterCategory)}
          className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
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
