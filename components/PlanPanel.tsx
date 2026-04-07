"use client";

import { Suspense, lazy, useState } from "react";

/**
 * AI-generated Plan Panel — combines multiple site modules into a personalized plan.
 *
 * AI sends a plan spec via panelBus, this component renders it as a dashboard
 * with embedded module cards that are interactive.
 */

// Lazy load mini versions of modules
const DrillModule = lazy(() => import("@/components/modules/DrillModule"));
const JobsModule = lazy(() => import("@/components/modules/JobsModule"));
const CasebookModule = lazy(() => import("@/components/modules/CasebookModule"));
const PartnerModule = lazy(() => import("@/components/modules/PartnerModule"));
const MockModule = lazy(() => import("@/components/modules/MockModule"));

export interface PlanSection {
  type: "text" | "drill" | "jobs" | "casebook" | "partner" | "mock" | "checklist" | "stats";
  title: string;
  icon: string;
  // For text type
  content?: string;
  // For drill type
  drillCategory?: string;
  drillCount?: number;
  // For jobs type
  jobsRegion?: string;
  // For casebook type
  caseType?: string;
  // For partner type
  partnerCaseType?: string;
  partnerLevel?: string;
  // For checklist type
  items?: { label: string; done?: boolean }[];
  // For stats type
  stats?: { label: string; value: string; color?: string }[];
  // Expand to show full module
  expandable?: boolean;
}

export interface PlanSpec {
  title: string;
  subtitle?: string;
  sections: PlanSection[];
}

function SectionCard({ section, onExpand }: { section: PlanSection; onExpand: (s: PlanSection) => void }) {
  const bgColors: Record<string, string> = {
    drill: "border-[#2251FF]/20 bg-[#2251FF]/[0.02]",
    jobs: "border-[#00836E]/20 bg-[#00836E]/[0.02]",
    casebook: "border-[#E87722]/20 bg-[#E87722]/[0.02]",
    partner: "border-[#007680]/20 bg-[#007680]/[0.02]",
    mock: "border-[#C4071B]/20 bg-[#C4071B]/[0.02]",
    text: "border-border bg-white",
    checklist: "border-[#051C2C]/15 bg-[#051C2C]/[0.02]",
    stats: "border-[#FFB81C]/20 bg-[#FFB81C]/[0.03]",
  };

  return (
    <div className={`border rounded-xl p-4 ${bgColors[section.type] || bgColors.text}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <h3 className="font-bold text-sm text-[#051C2C]">{section.title}</h3>
        </div>
        {section.expandable !== false && section.type !== "text" && section.type !== "checklist" && section.type !== "stats" && (
          <button
            onClick={() => onExpand(section)}
            className="text-xs text-[#051C2C] bg-[#051C2C]/5 hover:bg-[#051C2C]/10 px-2.5 py-1 rounded-lg transition-colors"
          >
            展开 →
          </button>
        )}
      </div>

      {/* Text */}
      {section.type === "text" && section.content && (
        <div className="text-sm text-gray-700 leading-relaxed">
          {section.content.split("\n").map((line, i) => (
            <p key={i} className={line.startsWith("- ") ? "ml-3 mb-0.5" : "mb-1"}>{line}</p>
          ))}
        </div>
      )}

      {/* Drill preview */}
      {section.type === "drill" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-[#2251FF]/10 text-[#2251FF] text-xs px-2 py-0.5 rounded-full font-medium">
              {section.drillCategory === "structuring" ? "框架搭建" :
               section.drillCategory === "case_math" ? "商业计算" :
               section.drillCategory === "chart" ? "图表解读" :
               section.drillCategory === "creativity" ? "头脑风暴" :
               section.drillCategory === "synthesis" ? "总结推荐" : section.drillCategory}
            </span>
            {section.drillCount && <span>{section.drillCount} 题</span>}
          </div>
          <button
            onClick={() => onExpand(section)}
            className="w-full bg-[#051C2C] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#0A2E4A] transition-colors"
          >
            开始练习
          </button>
        </div>
      )}

      {/* Jobs preview */}
      {section.type === "jobs" && (
        <div className="text-sm text-gray-600">
          <p>查看{section.jobsRegion === "CN" ? "国内" : section.jobsRegion === "UK" ? "英国" : section.jobsRegion === "US" ? "美国" : "全球"}最新岗位</p>
          <button
            onClick={() => onExpand(section)}
            className="mt-2 w-full border border-[#051C2C] text-[#051C2C] rounded-lg py-2 text-sm font-medium hover:bg-[#051C2C]/5 transition-colors"
          >
            查看岗位
          </button>
        </div>
      )}

      {/* Casebook preview */}
      {section.type === "casebook" && (
        <div className="text-sm text-gray-600">
          <span className="bg-[#E87722]/10 text-[#E87722] text-xs px-2 py-0.5 rounded-full font-medium">
            {section.caseType || "全部类型"}
          </span>
          <button
            onClick={() => onExpand(section)}
            className="mt-2 w-full border border-[#051C2C] text-[#051C2C] rounded-lg py-2 text-sm font-medium hover:bg-[#051C2C]/5 transition-colors"
          >
            浏览Case
          </button>
        </div>
      )}

      {/* Partner preview */}
      {section.type === "partner" && (
        <div className="text-sm text-gray-600">
          <p>找擅长 {section.partnerCaseType || "Case"} 的练习伙伴</p>
          <button
            onClick={() => onExpand(section)}
            className="mt-2 w-full border border-[#051C2C] text-[#051C2C] rounded-lg py-2 text-sm font-medium hover:bg-[#051C2C]/5 transition-colors"
          >
            找Partner
          </button>
        </div>
      )}

      {/* Mock preview */}
      {section.type === "mock" && (
        <div>
          <button
            onClick={() => onExpand(section)}
            className="w-full bg-[#C4071B] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#C4071B]/90 transition-colors"
          >
            开始模拟面试
          </button>
        </div>
      )}

      {/* Checklist */}
      {section.type === "checklist" && section.items && (
        <div className="space-y-1.5">
          {section.items.map((item, i) => (
            <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked={item.done} className="rounded border-gray-300" />
              <span className={item.done ? "line-through text-gray-400" : "text-gray-700"}>{item.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Stats */}
      {section.type === "stats" && section.stats && (
        <div className="grid grid-cols-2 gap-2">
          {section.stats.map((s, i) => (
            <div key={i} className="text-center bg-white rounded-lg p-2 border border-border">
              <div className={`text-lg font-bold ${s.color || "text-[#051C2C]"}`}>{s.value}</div>
              <div className="text-[10px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlanPanel({ plan, onSwitchPanel }: { plan: PlanSpec; onSwitchPanel: (panel: string, props?: Record<string, any>) => void }) {
  const [expanded, setExpanded] = useState<PlanSection | null>(null);

  const handleExpand = (section: PlanSection) => {
    if (section.type === "drill") {
      onSwitchPanel("drill", { initialCategory: section.drillCategory });
    } else if (section.type === "jobs") {
      onSwitchPanel("jobs", { initialRegion: section.jobsRegion });
    } else if (section.type === "casebook") {
      onSwitchPanel("casebook");
    } else if (section.type === "partner") {
      onSwitchPanel("partner", { initialCaseType: section.partnerCaseType, initialLevel: section.partnerLevel });
    } else if (section.type === "mock") {
      onSwitchPanel("mock");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎯</span>
          <h1 className="text-xl font-bold text-[#051C2C]">{plan.title}</h1>
          <span className="text-xs bg-[#051C2C]/10 text-[#051C2C] px-2 py-0.5 rounded-full">AI 方案</span>
        </div>
        {plan.subtitle && <p className="text-sm text-muted ml-8">{plan.subtitle}</p>}
      </div>

      {/* Sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plan.sections.map((section, i) => (
          <div key={i} className={section.type === "text" || section.type === "checklist" ? "md:col-span-2" : ""}>
            <SectionCard section={section} onExpand={handleExpand} />
          </div>
        ))}
      </div>
    </div>
  );
}
