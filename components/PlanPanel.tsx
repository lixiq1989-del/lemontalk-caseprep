"use client";

import { useState, useEffect } from "react";

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
  expandable?: boolean;
  // Kanban phase
  phase?: string;
}

export interface PlanSpec {
  title: string;
  subtitle?: string;
  sections: PlanSection[];
}

// Group sections into phases for kanban view
function groupByPhase(sections: PlanSection[]): Record<string, PlanSection[]> {
  const groups: Record<string, PlanSection[]> = {};
  let currentPhase = "准备";

  for (const s of sections) {
    if (s.phase) currentPhase = s.phase;
    else if (s.type === "text" && s.title.includes("计划") || s.title.includes("概览") || s.title.includes("路径")) {
      continue; // Skip overview text, we'll use it as header
    }
    if (!groups[currentPhase]) groups[currentPhase] = [];
    groups[currentPhase].push(s);
  }

  // If no phases defined, auto-group by type
  if (Object.keys(groups).length <= 1) {
    const auto: Record<string, PlanSection[]> = {
      "基础训练": [],
      "实战练习": [],
      "冲刺模拟": [],
    };
    for (const s of sections) {
      if (s.type === "text" || s.type === "stats") continue;
      if (s.type === "drill" && (s.drillCategory === "structuring" || s.drillCategory === "case_math")) {
        auto["基础训练"].push(s);
      } else if (s.type === "drill" || s.type === "casebook") {
        auto["实战练习"].push(s);
      } else {
        auto["冲刺模拟"].push(s);
      }
    }
    // Remove empty groups
    for (const key of Object.keys(auto)) {
      if (auto[key].length === 0) delete auto[key];
    }
    return Object.keys(auto).length > 0 ? auto : groups;
  }
  return groups;
}

// Task card colors
const typeStyles: Record<string, { bg: string; accent: string; badge: string }> = {
  drill: { bg: "bg-white", accent: "border-l-[#2251FF]", badge: "bg-[#2251FF]/10 text-[#2251FF]" },
  casebook: { bg: "bg-white", accent: "border-l-[#E87722]", badge: "bg-[#E87722]/10 text-[#E87722]" },
  partner: { bg: "bg-white", accent: "border-l-[#007680]", badge: "bg-[#007680]/10 text-[#007680]" },
  jobs: { bg: "bg-white", accent: "border-l-[#00836E]", badge: "bg-[#00836E]/10 text-[#00836E]" },
  mock: { bg: "bg-white", accent: "border-l-[#C4071B]", badge: "bg-[#C4071B]/10 text-[#C4071B]" },
  checklist: { bg: "bg-white", accent: "border-l-[#051C2C]", badge: "bg-[#051C2C]/10 text-[#051C2C]" },
  stats: { bg: "bg-white", accent: "border-l-[#FFB81C]", badge: "bg-[#FFB81C]/15 text-[#9A6B00]" },
  text: { bg: "bg-white", accent: "border-l-gray-300", badge: "bg-gray-100 text-gray-600" },
};

const drillLabels: Record<string, string> = {
  structuring: "框架搭建", case_math: "商业计算", chart: "图表解读",
  creativity: "头脑风暴", synthesis: "总结推荐",
};

function TaskCard({ section, onAction }: { section: PlanSection; onAction: (s: PlanSection) => void }) {
  const style = typeStyles[section.type] || typeStyles.text;
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    section.items?.map((item) => item.done || false) || []
  );

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const checkedCount = checkedItems.filter(Boolean).length;
  const totalItems = checkedItems.length;

  return (
    <div className={`${style.bg} border ${style.accent} border-l-4 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm shrink-0">{section.icon}</span>
          <h4 className="text-sm font-semibold text-[#051C2C] truncate">{section.title}</h4>
        </div>
        {section.type !== "text" && section.type !== "checklist" && section.type !== "stats" && (
          <button
            onClick={() => onAction(section)}
            className="shrink-0 text-[10px] bg-[#051C2C] text-white px-2 py-1 rounded-md hover:bg-[#0A2E4A] transition-colors"
          >
            开始
          </button>
        )}
      </div>

      {/* Drill */}
      {section.type === "drill" && (
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${style.badge}`}>
            {drillLabels[section.drillCategory || ""] || section.drillCategory}
          </span>
          {section.drillCount && <span className="text-[10px] text-muted">{section.drillCount} 题</span>}
        </div>
      )}

      {/* Casebook */}
      {section.type === "casebook" && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${style.badge}`}>
          {section.caseType || "全部"}
        </span>
      )}

      {/* Partner */}
      {section.type === "partner" && (
        <p className="text-[11px] text-muted">找 {section.partnerCaseType || "Case"} 练习伙伴</p>
      )}

      {/* Jobs */}
      {section.type === "jobs" && (
        <p className="text-[11px] text-muted">
          {section.jobsRegion === "CN" ? "国内" : section.jobsRegion || "全球"}最新岗位
        </p>
      )}

      {/* Mock */}
      {section.type === "mock" && (
        <p className="text-[11px] text-muted">AI 模拟面试</p>
      )}

      {/* Text */}
      {section.type === "text" && section.content && (
        <p className="text-[11px] text-gray-600 leading-relaxed">{section.content}</p>
      )}

      {/* Stats */}
      {section.type === "stats" && section.stats && (
        <div className="grid grid-cols-2 gap-1.5">
          {section.stats.map((s, i) => (
            <div key={i} className="text-center bg-gray-50 rounded-md py-1.5">
              <div className={`text-sm font-bold ${s.color || "text-[#051C2C]"}`}>{s.value}</div>
              <div className="text-[9px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      {section.type === "checklist" && section.items && (
        <div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-[#00836E] rounded-full transition-all duration-300"
                style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-muted font-medium">{checkedCount}/{totalItems}</span>
          </div>
          <div className="space-y-1">
            {section.items.map((item, i) => (
              <label key={i} className="flex items-center gap-1.5 text-[11px] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkedItems[i]}
                  onChange={() => toggleCheck(i)}
                  className="rounded border-gray-300 w-3.5 h-3.5"
                />
                <span className={`${checkedItems[i] ? "line-through text-gray-400" : "text-gray-700"} group-hover:text-[#051C2C]`}>
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

export default function PlanPanel({ plan, onSwitchPanel }: { plan: PlanSpec; onSwitchPanel: (panel: string, props?: Record<string, any>) => void }) {
  const [saved, setSaved] = useState(false);

  // Auto-save plan to localStorage
  useEffect(() => {
    localStorage.setItem("caseprep_plan", JSON.stringify(plan));
  }, [plan]);

  const handleAction = (section: PlanSection) => {
    if (section.type === "drill") onSwitchPanel("drill", { initialCategory: section.drillCategory });
    else if (section.type === "jobs") onSwitchPanel("jobs", { initialRegion: section.jobsRegion });
    else if (section.type === "casebook") onSwitchPanel("casebook");
    else if (section.type === "partner") onSwitchPanel("partner", { initialCaseType: section.partnerCaseType });
    else if (section.type === "mock") onSwitchPanel("mock");
  };

  // Extract overview and stats from sections
  const overview = plan.sections.find((s) => s.type === "text");
  const stats = plan.sections.find((s) => s.type === "stats");
  const checklist = plan.sections.find((s) => s.type === "checklist");
  const actionSections = plan.sections.filter((s) => s.type !== "text" && s.type !== "stats" && s.type !== "checklist");

  // Group into kanban phases
  const phases = groupByPhase(actionSections);
  const phaseColors = ["bg-[#2251FF]", "bg-[#E87722]", "bg-[#C4071B]", "bg-[#00836E]", "bg-[#007680]"];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎯</span>
            <h1 className="text-xl font-bold text-[#051C2C]">{plan.title}</h1>
          </div>
          {plan.subtitle && <p className="text-sm text-muted ml-8">{plan.subtitle}</p>}
        </div>
        <button
          onClick={() => { localStorage.setItem("caseprep_plan", JSON.stringify(plan)); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-[#00836E] text-white" : "bg-[#051C2C] text-white hover:bg-[#0A2E4A]"
          }`}
        >
          {saved ? "✓ 已保存" : "保存计划"}
        </button>
      </div>

      {/* Top row: Overview + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Overview */}
        {overview && (
          <div className="md:col-span-2 bg-[#051C2C] text-white rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-white/80">{overview.icon} {overview.title}</h3>
            <div className="text-sm leading-relaxed text-white/90">
              {overview.content?.split("\\n").map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && stats.stats && (
          <div className="bg-white border border-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-muted mb-3">{stats.icon} {stats.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg font-bold ${s.color || "text-[#051C2C]"}`}>{s.value}</div>
                  <div className="text-[9px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {Object.entries(phases).map(([phase, sections], phaseIdx) => (
          <div key={phase} className="flex-shrink-0 w-72">
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${phaseColors[phaseIdx % phaseColors.length]}`} />
              <h3 className="text-sm font-bold text-[#051C2C]">{phase}</h3>
              <span className="text-[10px] text-muted bg-gray-100 px-1.5 py-0.5 rounded-full">{sections.length}</span>
            </div>
            {/* Cards */}
            <div className="space-y-2.5">
              {sections.map((section, i) => (
                <TaskCard key={i} section={section} onAction={handleAction} />
              ))}
            </div>
          </div>
        ))}

        {/* Checklist column */}
        {checklist && (
          <div className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00836E]" />
              <h3 className="text-sm font-bold text-[#051C2C]">准备清单</h3>
            </div>
            <TaskCard section={checklist} onAction={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
}
