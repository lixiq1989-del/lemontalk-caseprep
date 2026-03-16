"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  school: string;
  level: string;
  target_firms: string[];
  case_types: string[];
  availability: string[];
  language: string;
  bio: string;
}

const levelLabels: Record<string, string> = {
  beginner: "初学者",
  intermediate: "进阶",
  advanced: "高级",
};

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

const allFirms = ["MBB", "Big4", "Boutique", "Internal Strategy", "Other"];
const allLevels = ["beginner", "intermediate", "advanced"];
const allCaseTypes = [
  "Profitability",
  "Market Entry",
  "Pricing",
  "M&A",
  "Market Sizing",
  "Growth Strategy",
];

export default function PartnerPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFirm, setFilterFirm] = useState("");
  const [filterCaseType, setFilterCaseType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterLevel) params.set("level", filterLevel);
    if (filterFirm) params.set("firm", filterFirm);
    if (filterCaseType) params.set("case_type", filterCaseType);

    fetch(`/api/students?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filterLevel, filterFirm, filterCaseType]);

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="sticky top-20 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">水平</h3>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">全部</option>
              {allLevels.map((l) => (
                <option key={l} value={l}>
                  {levelLabels[l]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">目标公司</h3>
            <select
              value={filterFirm}
              onChange={(e) => setFilterFirm(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">全部</option>
              {allFirms.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Case 类型</h3>
            <select
              value={filterCaseType}
              onChange={(e) => setFilterCaseType(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">全部</option>
              {allCaseTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/partner/register"
            className="block w-full text-center bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            我要注册
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Case Partner</h1>
            <p className="text-muted text-sm mt-1">找到你的练习搭档，一起备战咨询面试</p>
          </div>
          <Link
            href="/partner/register"
            className="md:hidden bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            我要注册
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">加载中...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无注册用户</p>
            <Link
              href="/partner/register"
              className="inline-block mt-4 bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              成为第一个注册的人
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((s) => (
              <Link
                key={s.id}
                href={`/partner/${s.id}`}
                className="card-hover block border border-border rounded-xl p-5 bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    <p className="text-muted text-xs mt-0.5">{s.school}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      levelColors[s.level] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {levelLabels[s.level] || s.level}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">目标公司</p>
                  <div className="flex flex-wrap gap-1">
                    {s.target_firms.map((f) => (
                      <span
                        key={f}
                        className="rounded-full px-2 py-0.5 text-xs bg-primary-light text-primary"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted mb-1">Case 类型</p>
                  <div className="flex flex-wrap gap-1">
                    {s.case_types.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted mb-1">可用时间</p>
                  <div className="flex flex-wrap gap-1">
                    {s.availability.map((a) => (
                      <span
                        key={a}
                        className="rounded-full px-2 py-0.5 text-xs bg-green-50 text-green-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
