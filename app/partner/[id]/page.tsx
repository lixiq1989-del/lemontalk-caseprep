"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Student {
  id: number;
  name: string;
  wechat: string;
  school: string;
  level: string;
  target_firms: string[];
  case_types: string[];
  availability: string[];
  language: string;
  bio: string;
  created_at: string;
}

interface Session {
  id: number;
  scheduled_at: string;
  duration: number;
  status: string;
  partner_name?: string;
  case_title?: string;
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

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id;
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchMsg, setMatchMsg] = useState("");
  const [matchFromId, setMatchFromId] = useState("");
  const [matchSending, setMatchSending] = useState(false);
  const [matchResult, setMatchResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStudent(data.student || null);
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const sendMatch = async () => {
    if (!matchFromId) {
      setMatchResult({ ok: false, msg: "请输入你的用户 ID" });
      return;
    }
    setMatchSending(true);
    setMatchResult(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_id: Number(matchFromId),
          to_id: Number(id),
          message: matchMsg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发送失败");
      setMatchResult({ ok: true, msg: "匹配请求已发送！" });
    } catch (err: unknown) {
      setMatchResult({
        ok: false,
        msg: err instanceof Error ? err.message : "发送失败",
      });
    } finally {
      setMatchSending(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted">加载中...</div>;
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-lg">用户不存在</p>
        <Link href="/partner" className="text-primary text-sm mt-2 inline-block">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/partner" className="text-primary text-sm hover:underline mb-4 inline-block">
        &larr; 返回列表
      </Link>

      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-muted text-sm mt-1">{student.school}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              levelColors[student.level] || "bg-gray-100 text-gray-600"
            }`}
          >
            {levelLabels[student.level] || student.level}
          </span>
        </div>

        {student.bio && (
          <p className="text-sm text-foreground mb-5 leading-relaxed">{student.bio}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">目标公司</p>
            <div className="flex flex-wrap gap-1.5">
              {student.target_firms.map((f) => (
                <span
                  key={f}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-primary-light text-primary"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">Case 类型</p>
            <div className="flex flex-wrap gap-1.5">
              {student.case_types.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">可用时间</p>
            <div className="flex flex-wrap gap-1.5">
              {student.availability.map((a) => (
                <span
                  key={a}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-green-50 text-green-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">语言偏好</p>
            <span className="rounded-full px-2.5 py-0.5 text-xs bg-yellow-50 text-yellow-700">
              {student.language}
            </span>
          </div>
        </div>
      </div>

      {/* Match request section */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <h2 className="text-lg font-semibold mb-4">发起匹配</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted mb-1">你的用户 ID</label>
            <input
              type="number"
              value={matchFromId}
              onChange={(e) => setMatchFromId(e.target.value)}
              placeholder="输入你的 ID"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">留言（可选）</label>
            <textarea
              value={matchMsg}
              onChange={(e) => setMatchMsg(e.target.value)}
              placeholder="简单介绍下自己，或说明想练什么类型的 Case..."
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>
          <button
            onClick={sendMatch}
            disabled={matchSending}
            className="bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {matchSending ? "发送中..." : "发送匹配请求"}
          </button>
          {matchResult && (
            <p
              className={`text-sm ${
                matchResult.ok ? "text-success" : "text-danger"
              }`}
            >
              {matchResult.msg}
            </p>
          )}
        </div>
      </div>

      {/* Sessions */}
      {sessions.length > 0 && (
        <div className="border border-border rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">已安排的 Sessions</h2>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border border-border rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {s.case_title || "Case Practice"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {s.scheduled_at} · {s.duration}分钟
                    {s.partner_name && ` · 与 ${s.partner_name}`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.status === "open"
                      ? "bg-green-100 text-green-700"
                      : s.status === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
