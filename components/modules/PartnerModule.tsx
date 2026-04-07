"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { panelBus } from "@/lib/panel-bus";

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
  avg_rating?: number;
  review_count?: number;
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

const DAYS = [
  { key: "mon", label: "一" },
  { key: "tue", label: "二" },
  { key: "wed", label: "三" },
  { key: "thu", label: "四" },
  { key: "fri", label: "五" },
  { key: "sat", label: "六" },
  { key: "sun", label: "日" },
];

const SLOTS = [
  { key: "morning", label: "上午" },
  { key: "afternoon", label: "下午" },
  { key: "evening", label: "晚上" },
];

const slotLabel: Record<string, string> = {
  morning: "上午",
  afternoon: "下午",
  evening: "晚上",
};

const dayLabel: Record<string, string> = {
  mon: "周一",
  tue: "周二",
  wed: "周三",
  thu: "周四",
  fri: "周五",
  sat: "周六",
  sun: "周日",
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

type ViewMode = "cards" | "sessions";

// Mini weekly grid for card view
function MiniGrid({ availability, highlight }: { availability: string[]; highlight?: string[] }) {
  return (
    <div className="grid grid-cols-7 gap-0.5">
      {DAYS.map((d) => (
        <div key={d.key} className="text-center">
          <div className="text-[9px] text-muted mb-0.5">{d.label}</div>
          {SLOTS.map((s) => {
            const key = `${d.key}_${s.key}`;
            const active = availability.includes(key);
            const isHighlight = highlight?.includes(key);
            return (
              <div
                key={key}
                className={`w-full h-2.5 rounded-sm mb-0.5 ${
                  isHighlight
                    ? "bg-green-400"
                    : active
                    ? "bg-primary/70"
                    : "bg-gray-100"
                }`}
                title={`${dayLabel[d.key]}${slotLabel[s.key]}${active ? " ✓" : ""}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Compute match score between current user's availability and a student
function computeScore(
  student: Student,
  myAvailability: string[],
  myLevel: string,
  myCaseTypes: string[]
): number {
  let score = 0;

  // Time overlap (most important, up to 50 points)
  if (myAvailability.length > 0) {
    const overlap = student.availability.filter((a) => myAvailability.includes(a)).length;
    score += Math.min(overlap * 10, 50);
  }

  // Level compatibility (up to 20 points) — same or adjacent level
  const levels = ["beginner", "intermediate", "advanced"];
  if (myLevel) {
    const myIdx = levels.indexOf(myLevel);
    const theirIdx = levels.indexOf(student.level);
    const diff = Math.abs(myIdx - theirIdx);
    score += diff === 0 ? 20 : diff === 1 ? 12 : 5;
  }

  // Case type overlap (up to 30 points)
  if (myCaseTypes.length > 0) {
    const overlap = student.case_types.filter((c) => myCaseTypes.includes(c)).length;
    score += Math.min(overlap * 10, 30);
  }

  return score;
}

interface PartnerModuleProps {
  initialLevel?: string;
  initialFirm?: string;
  initialCaseType?: string;
}

export default function PartnerModule({ initialLevel, initialFirm, initialCaseType }: PartnerModuleProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState(initialLevel || "");
  const [filterFirm, setFilterFirm] = useState(initialFirm || "");
  const [filterCaseType, setFilterCaseType] = useState(initialCaseType || "");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  // For smart matching
  const [myAvailability, setMyAvailability] = useState<string[]>([]);
  const [myLevel, setMyLevel] = useState("");
  const [myCaseTypes, setMyCaseTypes] = useState<string[]>([]);
  const [smartSort, setSmartSort] = useState(false);

  // Listen for AI commands
  useEffect(() => {
    return panelBus.on("partner", (cmd) => {
      if (cmd.action === "filter") {
        if (cmd.params.caseType) setFilterCaseType(cmd.params.caseType);
        if (cmd.params.level) setFilterLevel(cmd.params.level);
        if (cmd.params.firm) setFilterFirm(cmd.params.firm);
      }
    });
  }, []);

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

  // Sort students by match score if smart sort is on
  const sortedStudents = smartSort
    ? [...students].sort(
        (a, b) =>
          computeScore(b, myAvailability, myLevel, myCaseTypes) -
          computeScore(a, myAvailability, myLevel, myCaseTypes)
      )
    : students;

  // Generate available sessions from students
  const sessions = sortedStudents.flatMap((s) =>
    s.availability.map((slot) => {
      const [day, time] = slot.split("_");
      return { student: s, slot, day, time };
    })
  );

  // Deduplicate and sort sessions by day order
  const dayOrder: Record<string, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
  const slotOrder: Record<string, number> = { morning: 0, afternoon: 1, evening: 2 };
  const sortedSessions = sessions.sort(
    (a, b) => dayOrder[a.day] - dayOrder[b.day] || slotOrder[a.time] - slotOrder[b.time]
  );

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-60 shrink-0 hidden md:block">
        <div className="sticky top-20 space-y-5">
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

          {/* Smart match section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">智能推荐</h3>
              <button
                onClick={() => setSmartSort(!smartSort)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  smartSort
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {smartSort ? "ON" : "OFF"}
              </button>
            </div>

            {smartSort && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted mb-1">你的水平</p>
                  <select
                    value={myLevel}
                    onChange={(e) => setMyLevel(e.target.value)}
                    className="w-full border border-border rounded-lg px-2 py-1.5 text-xs"
                  >
                    <option value="">未选择</option>
                    {allLevels.map((l) => (
                      <option key={l} value={l}>
                        {levelLabels[l]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">你想练的类型</p>
                  <div className="flex flex-wrap gap-1">
                    {allCaseTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          setMyCaseTypes(
                            myCaseTypes.includes(t)
                              ? myCaseTypes.filter((c) => c !== t)
                              : [...myCaseTypes, t]
                          )
                        }
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          myCaseTypes.includes(t)
                            ? "bg-primary text-white border-primary"
                            : "border-border text-muted hover:border-primary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">你的可用时间</p>
                  <div className="grid grid-cols-7 gap-0.5">
                    {DAYS.map((d) => (
                      <div key={d.key} className="text-center">
                        <div className="text-[8px] text-muted">{d.label}</div>
                        {SLOTS.map((s) => {
                          const key = `${d.key}_${s.key}`;
                          const active = myAvailability.includes(key);
                          return (
                            <button
                              key={key}
                              onClick={() =>
                                setMyAvailability(
                                  active
                                    ? myAvailability.filter((a) => a !== key)
                                    : [...myAvailability, key]
                                )
                              }
                              className={`w-full h-3 rounded-sm mb-0.5 transition-colors ${
                                active ? "bg-primary" : "bg-gray-100 hover:bg-gray-200"
                              }`}
                              title={`${dayLabel[d.key]}${slotLabel[s.key]}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
            <p className="text-muted text-sm mt-1">
              {sortedStudents.length} 位同学在线 · 找到你的练习搭档
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === "cards"
                    ? "bg-primary text-white"
                    : "bg-white text-muted hover:bg-gray-50"
                }`}
              >
                Partner
              </button>
              <button
                onClick={() => setViewMode("sessions")}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === "sessions"
                    ? "bg-primary text-white"
                    : "bg-white text-muted hover:bg-gray-50"
                }`}
              >
                时间表
              </button>
            </div>
            <Link
              href="/partner/register"
              className="md:hidden bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              注册
            </Link>
          </div>
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
        ) : viewMode === "cards" ? (
          /* Card view */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedStudents.map((s) => {
              const score = smartSort
                ? computeScore(s, myAvailability, myLevel, myCaseTypes)
                : 0;
              const overlap = myAvailability.filter((a) => s.availability.includes(a));
              return (
                <Link
                  key={s.id}
                  href={`/partner/${s.id}`}
                  className="card-hover block border border-border rounded-xl p-5 bg-white relative"
                >
                  {smartSort && score > 0 && (
                    <div className="absolute top-3 right-3 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      匹配 {score}%
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-base">{s.name}</h3>
                      <p className="text-muted text-xs mt-0.5">{s.school}</p>
                      {s.avg_rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">{"★".repeat(Math.round(s.avg_rating))}</span>
                          <span className="text-xs font-medium">{s.avg_rating}</span>
                          <span className="text-xs text-muted">({s.review_count})</span>
                        </div>
                      )}
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
                    <p className="text-xs text-muted mb-1">Case 类型</p>
                    <div className="flex flex-wrap gap-1">
                      {s.case_types.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                      {s.case_types.length > 4 && (
                        <span className="text-xs text-muted">+{s.case_types.length - 4}</span>
                      )}
                    </div>
                  </div>

                  {/* Mini weekly grid */}
                  <div>
                    <p className="text-xs text-muted mb-1.5">
                      可用时间 · {s.availability.length} 个时段
                      {overlap.length > 0 && (
                        <span className="text-green-600 ml-1">
                          ({overlap.length} 个重叠)
                        </span>
                      )}
                    </p>
                    <MiniGrid
                      availability={s.availability}
                      highlight={smartSort ? overlap : undefined}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Sessions view */
          <div>
            <p className="text-xs text-muted mb-4">
              所有同学的可预约时间段 · 点击预约练习
            </p>
            <div className="space-y-2">
              {Object.entries(
                sortedSessions.reduce<Record<string, typeof sortedSessions>>(
                  (acc, session) => {
                    const dayKey = session.day;
                    if (!acc[dayKey]) acc[dayKey] = [];
                    acc[dayKey].push(session);
                    return acc;
                  },
                  {}
                )
              ).map(([day, daySessions]) => (
                <div key={day} className="border border-border rounded-xl bg-white overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-border">
                    <h3 className="text-sm font-semibold">{dayLabel[day]}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {daySessions.map((session, i) => {
                      const isOverlap = myAvailability.includes(session.slot);
                      return (
                        <Link
                          key={`${session.student.id}-${session.slot}-${i}`}
                          href={`/partner/${session.student.id}`}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                            isOverlap ? "bg-green-50/50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-block w-16 text-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                session.time === "morning"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : session.time === "afternoon"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {slotLabel[session.time]}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{session.student.name}</p>
                              <p className="text-xs text-muted">
                                {session.student.school} ·{" "}
                                {session.student.case_types.slice(0, 2).join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                levelColors[session.student.level]
                              }`}
                            >
                              {levelLabels[session.student.level]}
                            </span>
                            {isOverlap && (
                              <span className="text-xs text-green-600 font-medium">
                                时间匹配
                              </span>
                            )}
                            <span className="text-xs text-primary">预约 →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
