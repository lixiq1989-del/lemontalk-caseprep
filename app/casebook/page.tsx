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

export default function CasebookPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");

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

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="sticky top-20 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Case 类型</h3>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">全部</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
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
              {difficultyOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
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
              {industryOptions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Case 题库</h1>
          <p className="text-muted text-sm mt-1">精选咨询面试 Case，覆盖主流题型</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">加载中...</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">暂无 Case</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/casebook/${c.id}`}
                className="card-hover block border border-border rounded-xl p-5 bg-white"
              >
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
                      difficultyColors[c.difficulty] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="font-semibold text-base mb-1">{c.title}</h3>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
