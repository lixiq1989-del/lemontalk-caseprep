"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Case {
  id: number;
  title: string;
  title_cn: string;
  type: string;
  difficulty: string;
  industry: string;
  source: string;
}

const typeOptions = [
  "Profitability",
  "Market Entry",
  "Pricing",
  "M&A",
  "Market Sizing",
  "Growth Strategy",
];
const difficultyOptions = ["Easy", "Medium", "Hard"];
const industryOptions = [
  "Technology",
  "Healthcare",
  "Retail",
  "Financial Services",
  "Consumer Goods",
  "Energy",
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  Profitability: "bg-blue-100 text-blue-700",
  "Market Entry": "bg-purple-100 text-purple-700",
  Pricing: "bg-orange-100 text-orange-700",
  "M&A": "bg-pink-100 text-pink-700",
  "Market Sizing": "bg-teal-100 text-teal-700",
  "Growth Strategy": "bg-indigo-100 text-indigo-700",
};

interface CasebookModuleProps {
  initialType?: string;
}

export default function CasebookModule({ initialType }: CasebookModuleProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(initialType || "");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [studiedCases, setStudiedCases] = useState<string[]>([]);
  const [hideStudied, setHideStudied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studied_cases") || "[]");
    setStudiedCases(saved);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterType) params.set("type", filterType);
    if (filterDifficulty) params.set("difficulty", filterDifficulty);
    if (filterIndustry) params.set("industry", filterIndustry);

    fetch(`/api/cases?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setCases(data.cases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filterType, filterDifficulty, filterIndustry]);

  const visibleCases = hideStudied
    ? cases.filter((c) => !studiedCases.includes(String(c.id)))
    : cases;

  const progressPct =
    cases.length > 0 ? Math.round((studiedCases.length / cases.length) * 100) : 0;

  const Filters = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Case 类型</h3>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">全部</option>
          {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">难度</h3>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">全部</option>
          {difficultyOptions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">行业</h3>
        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">全部</option>
          {industryOptions.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Sidebar — desktop */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="sticky top-20 space-y-6">
          <Filters />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Case 题库</h1>
          <p className="text-muted text-sm mt-1">精选咨询面试 Case，覆盖主流题型</p>
        </div>

        {/* Progress bar */}
        {studiedCases.length > 0 && (
          <div className="border border-green-200 bg-green-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                学习进度：{studiedCases.length} / {cases.length} 题
              </span>
              <span className="text-sm font-bold text-green-700">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-green-100 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Mobile controls */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-2 text-sm text-muted hover:bg-gray-50 min-h-[40px]"
          >
            🔍 筛选
            {(filterType || filterDifficulty || filterIndustry) && (
              <span className="bg-primary text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button
            onClick={() => setHideStudied(!hideStudied)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm min-h-[40px] transition-colors ${
              hideStudied
                ? "border-primary bg-primary text-white"
                : "border-border text-muted hover:bg-gray-50"
            }`}
          >
            只看未学
          </button>
        </div>

        {/* Mobile filter expand */}
        {showFilters && (
          <div className="md:hidden border border-border rounded-xl p-4 mb-4 bg-white">
            <Filters />
          </div>
        )}

        {/* Desktop: hide studied toggle */}
        <div className="hidden md:flex items-center gap-2 mb-4">
          <button
            onClick={() => setHideStudied(!hideStudied)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              hideStudied
                ? "border-primary bg-primary text-white"
                : "border-border text-muted hover:border-primary"
            }`}
          >
            只看未学 ({cases.length - studiedCases.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">加载中...</div>
        ) : visibleCases.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">{hideStudied ? "🎉 全部学完了！" : "暂无 Case"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCases.map((c) => {
              const isStudied = studiedCases.includes(String(c.id));
              return (
                <Link
                  key={c.id}
                  href={`/casebook/${c.id}`}
                  className={`card-hover block border rounded-xl p-5 bg-white relative ${
                    isStudied ? "border-green-200" : "border-border"
                  }`}
                >
                  {isStudied && (
                    <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      ✓ 已学
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        typeColors[c.type] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.type}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        isStudied ? "opacity-50" : ""
                      } ${difficultyColors[c.difficulty] || "bg-gray-100 text-gray-600"}`}
                    >
                      {c.difficulty}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base mb-1 pr-12">{c.title}</h3>
                  {c.title_cn && (
                    <p className="text-muted text-sm mb-3">{c.title_cn}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="rounded-full px-2 py-0.5 bg-gray-50 border border-border">
                      {c.industry}
                    </span>
                    {c.source && <span>{c.source}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
