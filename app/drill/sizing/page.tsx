"use client";

import { useState } from "react";
import Link from "next/link";
import { SIZING_CASES, type SizingCase, type SizingStep } from "@/lib/sizing";

type Mode = "list" | "play" | "result";

function DiffBadge({ d }: { d: string }) {
  const cls =
    d === "easy"
      ? "bg-green-100 text-green-700"
      : d === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>
      {d === "easy" ? "简单" : d === "medium" ? "中等" : "困难"}
    </span>
  );
}

export default function SizingPage() {
  const [mode, setMode] = useState<Mode>("list");
  const [activeCase, setActiveCase] = useState<SizingCase | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ value: number; correct: boolean }[]>([]);
  const [numberInput, setNumberInput] = useState("");
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [runningValue, setRunningValue] = useState(0);

  const startCase = (c: SizingCase) => {
    setActiveCase(c);
    setStep(0);
    setAnswers([]);
    setNumberInput("");
    setStepSubmitted(false);
    setRunningValue(0);
    setMode("play");
  };

  const handleChoice = (opt: { value: number; explanation?: string }) => {
    if (stepSubmitted || !activeCase) return;
    submitStep(opt.value);
  };

  const handleNumber = () => {
    if (stepSubmitted || !numberInput.trim() || !activeCase) return;
    const val = parseFloat(numberInput);
    if (isNaN(val)) return;
    submitStep(val);
  };

  const submitStep = (userValue: number) => {
    if (!activeCase) return;
    const s = activeCase.steps[step];
    const ref = s.referenceValue;
    const tol = s.tolerance;
    const isClose = Math.abs(userValue - ref) / Math.abs(ref) <= tol;

    // Use reference value for calculation (to keep the flow consistent)
    const calcValue = ref;
    let newRunning = runningValue;
    if (s.operation === "set") {
      newRunning = calcValue;
    } else if (s.operation === "multiply") {
      newRunning = runningValue * calcValue;
    } else if (s.operation === "divide") {
      newRunning = runningValue / calcValue;
    }

    setRunningValue(newRunning);
    setAnswers([...answers, { value: userValue, correct: isClose }]);
    setStepSubmitted(true);
  };

  const nextStep = () => {
    if (!activeCase) return;
    if (step + 1 >= activeCase.steps.length) {
      setMode("result");
      return;
    }
    setStep(step + 1);
    setNumberInput("");
    setStepSubmitted(false);
  };

  // ====== LIST ======
  if (mode === "list") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Market Sizing 闯关</h1>
            <p className="text-muted text-sm mt-1">
              分步引导，像真面试一样一步步估算
            </p>
          </div>
          <Link
            href="/drill"
            className="text-sm text-muted hover:text-primary"
          >
            ← 返回刷题
          </Link>
        </div>

        <div className="space-y-3">
          {SIZING_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => startCase(c)}
              className="card-hover w-full text-left border border-border rounded-xl p-5 bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-base">{c.title}</h3>
                  <p className="text-muted text-xs mt-1">
                    {c.approach} · {c.steps.length} 步 · {c.category}
                  </p>
                </div>
                <DiffBadge d={c.difficulty} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ====== PLAY ======
  if (mode === "play" && activeCase) {
    const s = activeCase.steps[step];
    const progress = ((step + 1) / activeCase.steps.length) * 100;

    // Format running value for display
    const formatNum = (n: number) => {
      if (n >= 100000000) return (n / 100000000).toFixed(1) + " 亿";
      if (n >= 10000) return (n / 10000).toFixed(1) + " 万";
      return n.toLocaleString();
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setMode("list")}
            className="text-sm text-muted hover:text-primary"
          >
            ✕ 退出
          </button>
          <div className="text-sm font-medium">{activeCase.title}</div>
          <div className="text-sm text-muted">
            第 {step + 1}/{activeCase.steps.length} 步
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Running calculation */}
        {step > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-blue-600 font-medium">当前推算</p>
            <div className="text-sm text-blue-800 mt-1">
              {answers.map((a, i) => {
                const s = activeCase.steps[i];
                const opSymbol =
                  s.operation === "set"
                    ? ""
                    : s.operation === "multiply"
                    ? " × "
                    : " ÷ ";
                return (
                  <span key={i}>
                    {i > 0 && opSymbol}
                    <span className="font-mono font-semibold">
                      {s.referenceValue.toLocaleString()}
                    </span>
                  </span>
                );
              })}
              <span className="text-blue-500"> = </span>
              <span className="font-bold">{formatNum(runningValue)}</span>
            </div>
          </div>
        )}

        {/* Step card */}
        <div className="border border-border rounded-xl p-6 bg-white mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Step {step + 1}
            </span>
            {s.operation !== "set" && (
              <span className="text-xs text-muted">
                {s.operation === "multiply" ? "× 乘以" : "÷ 除以"}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold leading-relaxed mt-2 mb-1">
            {s.question}
          </h2>
          {s.hint && (
            <p className="text-xs text-muted italic mb-4">💡 {s.hint}</p>
          )}

          {/* Choice type */}
          {s.type === "choice" && s.options && (
            <div className="space-y-2 mt-4">
              {s.options.map((opt, idx) => {
                const isRef = opt.value === s.referenceValue;
                const wasSelected =
                  stepSubmitted && answers[step]?.value === opt.value;
                let cls =
                  "border border-border bg-white hover:border-primary hover:bg-primary/5";
                if (stepSubmitted) {
                  if (isRef) {
                    cls = "border-2 border-green-500 bg-green-50";
                  } else if (wasSelected && !isRef) {
                    cls = "border-2 border-yellow-400 bg-yellow-50";
                  } else {
                    cls = "border border-border bg-gray-50 opacity-50";
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoice(opt)}
                    disabled={stepSubmitted}
                    className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-all ${cls}`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    {stepSubmitted && opt.explanation && (
                      <div className="text-xs text-muted mt-1">
                        {opt.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Number type */}
          {s.type === "number" && (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNumber()}
                  placeholder="输入你的估算..."
                  disabled={stepSubmitted}
                  autoFocus
                  className="flex-1 border-2 border-border rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-primary disabled:bg-gray-50"
                />
                {s.unit && (
                  <span className="text-sm text-muted font-medium">
                    {s.unit}
                  </span>
                )}
              </div>
              {!stepSubmitted && (
                <button
                  onClick={handleNumber}
                  disabled={!numberInput.trim()}
                  className="mt-3 w-full bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0A2E4A] transition-colors disabled:opacity-30"
                >
                  确认
                </button>
              )}
              {stepSubmitted && (
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      answers[step]?.correct
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {answers[step]?.correct
                      ? "很接近！"
                      : `你答: ${numberInput}，有点偏`}
                  </div>
                  <div className="text-sm text-muted">
                    参考值:{" "}
                    <span className="font-semibold text-foreground">
                      {s.referenceValue} {s.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next */}
        {stepSubmitted && (
          <button
            onClick={nextStep}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0A2E4A] transition-colors"
          >
            {step + 1 >= activeCase.steps.length
              ? "查看最终结果 →"
              : "下一步 →"}
          </button>
        )}
      </div>
    );
  }

  // ====== RESULT ======
  if (mode === "result" && activeCase) {
    const correctCount = answers.filter((a) => a.correct).length;
    const total = activeCase.steps.length;

    // Format final value
    const formatFinal = (n: number, unit: string) => {
      if (unit === "亿杯" || unit === "亿条" || unit === "亿元") {
        return `${(n / 100000000).toFixed(0)} ${unit}`;
      }
      if (unit === "万人") {
        return `${(n / 10000).toFixed(1)} ${unit}`;
      }
      if (n >= 10000) {
        return `${Math.round(n).toLocaleString()} ${unit}`;
      }
      return `${Math.round(n).toLocaleString()} ${unit}`;
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-1">{activeCase.title}</h1>
            <p className="text-muted text-sm">估算完成</p>
          </div>

          {/* Final answer */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6 text-center">
            <p className="text-xs text-primary font-medium mb-1">最终估算</p>
            <div className="text-3xl font-bold text-primary">
              {formatFinal(runningValue, activeCase.finalUnit)}
            </div>
          </div>

          {/* Calculation chain */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-muted mb-2">推算过程</p>
            <div className="space-y-2">
              {activeCase.steps.map((s, i) => {
                const a = answers[i];
                return (
                  <div key={s.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        a?.correct
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a?.correct ? "✓" : "~"}
                    </span>
                    <span className="text-muted flex-1">{s.question}</span>
                    <span className="font-mono font-medium">
                      {s.referenceValue}
                      {s.unit ? ` ${s.unit}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border mt-3 pt-3 text-sm">
              <span className="text-muted">估算准确度：</span>
              <span className="font-semibold">
                {correctCount}/{total} 步接近参考值
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">解析</h3>
              <p className="text-sm text-foreground leading-relaxed">
                {activeCase.finalExplanation}
              </p>
            </div>
            {activeCase.sanityCheck && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  Sanity Check
                </p>
                <p className="text-sm text-amber-900">
                  {activeCase.sanityCheck}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setMode("list")}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0A2E4A] transition-colors"
          >
            做下一题
          </button>
          <Link
            href="/drill"
            className="block w-full text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50 transition-colors"
          >
            返回刷题首页
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
