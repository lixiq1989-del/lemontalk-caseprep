"use client";

import { useState, useEffect } from "react";
import PlanPanel, { type PlanSpec } from "./PlanPanel";

/**
 * Wrapper that loads saved plan from localStorage and renders PlanPanel.
 * Used as a tab in CoworkLayout alongside drill/jobs/etc.
 */
export default function PlanPanelWrapper() {
  const [plan, setPlan] = useState<PlanSpec | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("caseprep_plan");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.title && parsed?.sections) setPlan(parsed);
      }
    } catch {}

    // Listen for new plans from AI
    const handler = (e: CustomEvent) => {
      if (e.detail?.plan) setPlan(e.detail.plan);
    };
    window.addEventListener("plan-updated" as any, handler);
    return () => window.removeEventListener("plan-updated" as any, handler);
  }, []);

  if (!plan) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-lg font-bold text-[#051C2C] mb-2">还没有计划</h2>
        <p className="text-sm text-muted mb-4">在左侧对话框告诉AI你的目标，比如：</p>
        <div className="space-y-2 max-w-xs mx-auto">
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">"帮我准备McKinsey面试"</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">"我是新手，制定一个学习计划"</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">"BCG面试还有两周怎么冲刺"</p>
        </div>
      </div>
    );
  }

  // onSwitchPanel not needed here since tabs handle switching
  return <PlanPanel plan={plan} onSwitchPanel={() => {}} />;
}
