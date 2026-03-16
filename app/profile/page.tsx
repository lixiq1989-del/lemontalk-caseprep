"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Student = {
  id: number;
  name: string;
  wechat: string;
  school: string;
  target_firms: string;
  level: string;
  case_types: string;
  availability: string;
  language: string;
  bio: string;
};

type MatchRequest = {
  id: number;
  from_id: number;
  to_id: number;
  from_name?: string;
  to_name?: string;
  message: string;
  status: string;
  created_at: string;
};

const levelLabels: Record<string, string> = {
  beginner: "初学者",
  intermediate: "进阶",
  advanced: "高级",
};

export default function ProfilePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [matches, setMatches] = useState<MatchRequest[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []));
  }, []);

  useEffect(() => {
    if (selected) {
      fetch(`/api/match?student_id=${selected.id}`)
        .then((r) => r.json())
        .then((d) => setMatches(d.matches || []))
        .catch(() => setMatches([]));
    }
  }, [selected]);

  if (!selected) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">选择你的账号</h1>
        {students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">还没有注册的用户</p>
            <Link
              href="/partner/register"
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              去注册
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="card-hover border border-border rounded-xl p-4 text-left hover:border-primary transition-colors"
              >
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-muted">{s.school}</div>
                <div className="text-xs text-muted mt-1">
                  {levelLabels[s.level] || s.level}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const firms = JSON.parse(selected.target_firms || "[]");
  const types = JSON.parse(selected.case_types || "[]");
  const avail = JSON.parse(selected.availability || "[]");

  return (
    <div>
      <button
        onClick={() => setSelected(null)}
        className="text-primary text-sm mb-4 hover:underline"
      >
        &larr; 切换账号
      </button>

      <div className="border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-2xl font-bold text-primary">
            {selected.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{selected.name}</h1>
            <p className="text-muted">{selected.school}</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {levelLabels[selected.level] || selected.level}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted mb-1">微信号</div>
            <div className="font-medium">{selected.wechat}</div>
          </div>
          <div>
            <div className="text-muted mb-1">语言偏好</div>
            <div className="font-medium">
              {selected.language === "cn"
                ? "中文"
                : selected.language === "en"
                ? "English"
                : "中英双语"}
            </div>
          </div>
          <div>
            <div className="text-muted mb-1">目标公司</div>
            <div className="flex flex-wrap gap-1">
              {firms.map((f: string) => (
                <span
                  key={f}
                  className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-muted mb-1">Case类型</div>
            <div className="flex flex-wrap gap-1">
              {types.map((t: string) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-muted mb-1">可用时间</div>
            <div className="flex flex-wrap gap-1">
              {avail.map((a: string) => (
                <span
                  key={a}
                  className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          {selected.bio && (
            <div className="col-span-2">
              <div className="text-muted mb-1">简介</div>
              <p>{selected.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Match Requests */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">匹配请求</h2>
        {matches.length === 0 ? (
          <p className="text-muted text-sm">暂无匹配请求</p>
        ) : (
          <div className="space-y-2">
            {matches.map((m) => (
              <div
                key={m.id}
                className="border border-border rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">
                    {m.from_id === selected.id
                      ? `你 → ${m.to_name}`
                      : `${m.from_name} → 你`}
                  </span>
                  {m.message && (
                    <span className="text-muted text-sm ml-2">
                      &ldquo;{m.message}&rdquo;
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    m.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : m.status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {m.status === "pending"
                    ? "待回复"
                    : m.status === "accepted"
                    ? "已接受"
                    : "已拒绝"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/partner"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
        >
          找搭档
        </Link>
        <Link
          href="/community"
          className="px-4 py-2 border border-border rounded-lg text-sm"
        >
          去社区
        </Link>
      </div>
    </div>
  );
}
