"use client";

import { useState } from "react";

export interface PlanSection {
  type: "text" | "drill" | "jobs" | "casebook" | "partner" | "mock" | "checklist" | "stats";
  title: string;
  icon: string;
  content?: string;
  drillCategory?: string;
  drillCount?: number;
  jobsRegion?: string;
  caseType?: string;
  partnerCaseType?: string;
  partnerLevel?: string;
  items?: { label: string; done?: boolean }[];
  stats?: { label: string; value: string; color?: string }[];
  phase?: string;
}

export interface PlanSpec {
  title: string;
  subtitle?: string;
  sections: PlanSection[];
}

const drillLabels: Record<string, string> = {
  structuring: "框架搭建", case_math: "商业计算", chart: "图表解读",
  creativity: "头脑风暴", synthesis: "总结推荐",
};

export default function PlanPanel({ plan, onSwitchPanel }: { plan: PlanSpec; onSwitchPanel: (panel: string, props?: Record<string, any>) => void }) {
  const [saved, setSaved] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("caseprep_checklist") || "{}");
    } catch { return {}; }
  });

  const toggleCheck = (idx: number) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      localStorage.setItem("caseprep_checklist", JSON.stringify(next));
      return next;
    });
  };

  const savePlan = () => {
    localStorage.setItem("caseprep_plan", JSON.stringify(plan));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const overview = plan.sections.find((s) => s.type === "text");
  const stats = plan.sections.find((s) => s.type === "stats");
  const checklist = plan.sections.find((s) => s.type === "checklist");
  const drills = plan.sections.filter((s) => s.type === "drill");
  const others = plan.sections.filter((s) => !["text", "stats", "checklist", "drill"].includes(s.type));

  const checklistItems = checklist?.items || [];
  const checkedCount = checklistItems.filter((_, i) => checkedMap[i]).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ===== Header ===== */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#051C2C] flex items-center gap-2">
            <span>🎯</span> {plan.title}
          </h1>
          {plan.subtitle && <p className="text-sm text-muted mt-1">{plan.subtitle}</p>}
        </div>
        <button onClick={savePlan} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${saved ? "bg-[#00836E] text-white" : "bg-[#051C2C] text-white hover:bg-[#0A2E4A]"}`}>
          {saved ? "✓ 已保存" : "保存计划"}
        </button>
      </div>

      {/* ===== Section 1: Overview + Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {overview && (
          <div className="md:col-span-3 bg-[#051C2C] text-white rounded-xl p-5">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">备考路线</h3>
            <div className="space-y-1.5">
              {(overview.content || "").split("\\n").map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/90">
                  <span className="text-white/40 mt-0.5 shrink-0">→</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {stats?.stats && (
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            {stats.stats.map((s, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-3 text-center">
                <div className={`text-xl font-bold ${s.color || "text-[#051C2C]"}`}>{s.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Section 2: 练习任务 ===== */}
      {drills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2251FF]" /> 练习任务
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {drills.map((d, i) => (
              <button
                key={i}
                onClick={() => onSwitchPanel("drill", { initialCategory: d.drillCategory })}
                className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#2251FF]/40 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{d.icon}</span>
                  <span className="text-[10px] bg-[#2251FF]/10 text-[#2251FF] px-2 py-0.5 rounded-full font-medium">
                    {drillLabels[d.drillCategory || ""] || d.drillCategory}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#051C2C] mb-1">{d.title}</h4>
                {d.drillCount && <p className="text-[11px] text-muted">{d.drillCount} 题</p>}
                <div className="mt-2 text-xs text-[#2251FF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  开始练习 →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Section 3: Case 练习 ===== */}
      {others.some((s) => s.type === "casebook") && (
        <div>
          <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E87722]" /> Case 练习
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {others.filter((s) => s.type === "casebook").map((s, i) => (
              <button key={i} onClick={() => onSwitchPanel("casebook")}
                className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#E87722]/40 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] bg-[#E87722]/10 text-[#E87722] px-2 py-0.5 rounded-full font-medium">{s.caseType || "全部"}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#051C2C]">{s.title}</h4>
                <div className="mt-2 text-xs text-[#E87722] font-medium opacity-0 group-hover:opacity-100 transition-opacity">浏览Case →</div>
              </button>
            ))}
            {/* Always show partner here too */}
            {others.filter((s) => s.type === "partner").map((s, i) => (
              <button key={`p${i}`} onClick={() => onSwitchPanel("partner", { initialCaseType: s.partnerCaseType })}
                className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#007680]/40 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] bg-[#007680]/10 text-[#007680] px-2 py-0.5 rounded-full font-medium">Partner</span>
                </div>
                <h4 className="text-sm font-semibold text-[#051C2C]">{s.title}</h4>
                <p className="text-[11px] text-muted mt-1">找 {s.partnerCaseType || "Case"} 练习伙伴</p>
                <div className="mt-2 text-xs text-[#007680] font-medium opacity-0 group-hover:opacity-100 transition-opacity">找Partner →</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Section 4: BQ/PEI 行为面试 ===== */}
      <div>
        <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007680]" /> BQ / PEI 行为面试
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button onClick={() => onSwitchPanel("pei")}
            className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#007680]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌟</span>
              <span className="text-[10px] bg-[#007680]/10 text-[#007680] px-2 py-0.5 rounded-full font-medium">PEI</span>
            </div>
            <h4 className="text-sm font-semibold text-[#051C2C]">PEI 行为面试练习</h4>
            <p className="text-[11px] text-muted mt-1">Why Consulting / Leadership / Failure 等高频题</p>
            <div className="mt-2 text-xs text-[#007680] font-medium opacity-0 group-hover:opacity-100 transition-opacity">开始练习 →</div>
          </button>
          <button onClick={() => onSwitchPanel("sprint")}
            className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#007680]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚀</span>
              <span className="text-[10px] bg-[#007680]/10 text-[#007680] px-2 py-0.5 rounded-full font-medium">突击</span>
            </div>
            <h4 className="text-sm font-semibold text-[#051C2C]">面试突击小抄</h4>
            <p className="text-[11px] text-muted mt-1">输入公司+简历，生成专属面试准备清单</p>
            <div className="mt-2 text-xs text-[#007680] font-medium opacity-0 group-hover:opacity-100 transition-opacity">生成小抄 →</div>
          </button>
        </div>
      </div>

      {/* ===== Section 5: 模拟面试 ===== */}
      {others.some((s) => s.type === "mock") && (
        <div>
          <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4071B]" /> 模拟面试
          </h2>
          <button onClick={() => onSwitchPanel("mock")}
            className="w-full bg-white border border-border rounded-xl p-4 text-left hover:border-[#C4071B]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="text-sm font-semibold text-[#051C2C]">AI 模拟面试</h4>
                <p className="text-[11px] text-muted mt-0.5">和AI面试官做完整Case Interview</p>
              </div>
              <div className="ml-auto text-xs text-[#C4071B] font-medium opacity-0 group-hover:opacity-100 transition-opacity">开始 →</div>
            </div>
          </button>
        </div>
      )}

      {/* ===== Section 6: 岗位投递 ===== */}
      {others.some((s) => s.type === "jobs") && (
        <div>
          <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00836E]" /> 岗位投递
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {others.filter((s) => s.type === "jobs").map((s, i) => (
              <button key={i} onClick={() => onSwitchPanel("jobs", { initialRegion: s.jobsRegion })}
                className="bg-white border border-border rounded-xl p-4 text-left hover:border-[#00836E]/40 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] bg-[#00836E]/10 text-[#00836E] px-2 py-0.5 rounded-full font-medium">
                    {s.jobsRegion === "CN" ? "国内" : s.jobsRegion || "全球"}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#051C2C]">{s.title}</h4>
                <div className="mt-2 text-xs text-[#00836E] font-medium opacity-0 group-hover:opacity-100 transition-opacity">查看岗位 →</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Section 4: 准备清单 ===== */}
      {checklist && checklistItems.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[#051C2C] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00836E]" /> 准备清单
            <span className="text-[10px] font-normal text-muted ml-auto">{checkedCount}/{checklistItems.length} 完成</span>
          </h2>
          {/* Progress */}
          <div className="h-2 bg-gray-100 rounded-full mb-3">
            <div className="h-full bg-[#00836E] rounded-full transition-all duration-300" style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }} />
          </div>
          <div className="bg-white border border-border rounded-xl p-4 space-y-2">
            {checklistItems.map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={!!checkedMap[i]}
                  onChange={() => toggleCheck(i)}
                  className="rounded border-gray-300 w-4 h-4 text-[#00836E]"
                />
                <span className={`text-sm ${checkedMap[i] ? "line-through text-gray-400" : "text-gray-700 group-hover:text-[#051C2C]"}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
