// lib/modules/registry.ts
export type ModuleId = "drill" | "partner" | "casebook" | "jobs" | "pei" | "sprint" | "cheatsheet" | "industry" | "mock" | "resume";

export interface ModuleParams {
  category?: string;    // for drill: market_sizing, profitability, ma, strategy, operations, math_input
  questionId?: string;  // for pei: why_consulting, leadership, failure, conflict, impact, why_firm
  type?: string;        // for casebook: Profitability, Market Entry, etc.
  filter?: string;      // for jobs: 实习, 校招, 社招
  module?: string;      // raw module name from AI action
  company?: string;     // for sprint: pre-fill company name
  role?: string;        // for sprint: pre-fill role name
  industryId?: string;  // for industry: pre-select an industry
  caseType?: string;    // for mock: pre-select case type
  level?: string;       // for partner: pre-filter by level (beginner/intermediate/advanced)
  firm?: string;        // for partner: pre-filter by target firm (MBB/Big4/Boutique...)
  hint?: string;        // AI-generated banner hint text
}

export const MODULE_REGISTRY: Record<ModuleId, { label: string; icon: string }> = {
  drill:      { label: "每日一练",      icon: "⚡" },
  partner:    { label: "Case Partner",  icon: "🤝" },
  casebook:   { label: "案例题库",      icon: "📚" },
  jobs:       { label: "实习岗位",      icon: "💼" },
  pei:        { label: "PEI练习",       icon: "💬" },
  sprint:     { label: "面试突击小抄",  icon: "⚡" },
  cheatsheet: { label: "面试速查手册",  icon: "📋" },
  industry:   { label: "行业速览",      icon: "🏭" },
  mock:       { label: "模拟面试",      icon: "🎤" },
  resume:     { label: "简历优化",      icon: "📄" },
};
