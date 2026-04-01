"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface StudentProfile {
  id: number;
  name: string;
  wechat: string;
  school: string;
  target_firms: string[];
  case_types: string[];
  availability: string[];
  level: string;
  language: string;
  bio: string;
}

interface DrillStat {
  category: string;
  total: number;
  correct: number;
}

interface MatchRequest {
  id: number;
  from_name: string;
  from_wechat: string;
  message: string;
  slot: string;
  created_at: string;
  status: string;
}

const levelLabels: Record<string, string> = {
  beginner: "初学者",
  intermediate: "进阶",
  advanced: "高级",
};

const DRILL_CATEGORY_LABELS: Record<string, string> = {
  structuring: "框架搭建",
  calculation: "数学速算",
  case_math: "商业计算",
  sizing: "Market Sizing",
  chart: "图表解读",
  creativity: "头脑风暴",
  synthesis: "总结推荐",
};

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [drillStats, setDrillStats] = useState<DrillStat[]>([]);
  const [pendingMatches, setPendingMatches] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [interviewDate, setInterviewDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [studiedCases, setStudiedCases] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load interview date from localStorage
    const savedDate = localStorage.getItem(`interview_date_${user.id}`);
    if (savedDate) setInterviewDate(savedDate);

    // Load studied cases
    const saved = JSON.parse(localStorage.getItem("studied_cases") || "[]");
    setStudiedCases(saved);

    // Load profile
    supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data as StudentProfile);
          // Load pending match requests for this student
          supabase
            .from("match_requests")
            .select("*")
            .eq("to_id", data.id)
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .then(({ data: matches }) => {
              setPendingMatches((matches as MatchRequest[]) || []);
            });
        }
        setLoading(false);
      });

    // Load drill stats
    supabase
      .from("drill_records")
      .select("category, correct")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const byCategory: Record<string, { total: number; correct: number }> = {};
          for (const r of data) {
            if (!byCategory[r.category]) byCategory[r.category] = { total: 0, correct: 0 };
            byCategory[r.category].total++;
            if (r.correct) byCategory[r.category].correct++;
          }
          setDrillStats(
            Object.entries(byCategory).map(([category, s]) => ({ category, ...s }))
          );
        }
      });
  }, [user]);

  const saveInterviewDate = () => {
    if (!dateInput || !user) return;
    localStorage.setItem(`interview_date_${user.id}`, dateInput);
    setInterviewDate(dateInput);
    setShowDateInput(false);
  };

  const daysLeft = interviewDate
    ? Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86400000)
    : null;

  if (authLoading || loading) {
    return <div className="text-center py-20 text-muted">加载中...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-12">
        <div className="text-5xl mb-4">👤</div>
        <h1 className="text-2xl font-bold mb-2">登录查看个人中心</h1>
        <p className="text-muted text-sm mb-6">
          登录后可保存个人档案、刷题记录、预约历史
        </p>
        <Link
          href="/auth"
          className="inline-block bg-primary text-white rounded-xl px-8 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          登录 / 注册
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">欢迎！</h1>
          <p className="text-muted text-sm">{user.email}</p>
          <p className="text-muted text-sm mt-2">你还没有创建 Case Partner 档案</p>
        </div>
        <div className="space-y-3">
          <Link
            href="/partner/register"
            className="block w-full text-center bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            创建我的档案
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/drill" className="block text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50">
              先去刷题
            </Link>
            <Link href="/casebook" className="block text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50">
              看题库
            </Link>
          </div>
        </div>
        <button onClick={signOut} className="block w-full text-center text-sm text-muted hover:text-danger mt-8">
          退出登录
        </button>
      </div>
    );
  }

  const totalDrills = drillStats.reduce((sum, s) => sum + s.total, 0);
  const totalCorrect = drillStats.reduce((sum, s) => sum + s.correct, 0);
  const accuracy = totalDrills > 0 ? Math.round((totalCorrect / totalDrills) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Interview countdown */}
      {daysLeft !== null && daysLeft >= 0 && (
        <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-800">
              🎯 距离面试还有 <span className="text-2xl font-bold">{daysLeft}</span> 天
            </p>
            <p className="text-xs text-orange-600 mt-0.5">{interviewDate} · 加油冲刺！</p>
          </div>
          <button onClick={() => { setDateInput(interviewDate); setShowDateInput(true); }} className="text-xs text-orange-600 hover:underline">
            修改
          </button>
        </div>
      )}
      {daysLeft === null && (
        <div className="border border-dashed border-border rounded-xl p-3 mb-4 text-center">
          {showDateInput ? (
            <div className="flex items-center gap-2 justify-center">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="border border-border rounded-lg px-3 py-1.5 text-sm"
              />
              <button onClick={saveInterviewDate} className="bg-primary text-white rounded-lg px-3 py-1.5 text-sm">
                保存
              </button>
              <button onClick={() => setShowDateInput(false)} className="text-muted text-sm">
                取消
              </button>
            </div>
          ) : (
            <button onClick={() => setShowDateInput(true)} className="text-sm text-muted hover:text-primary">
              📅 设置面试日期，开始倒计时
            </button>
          )}
        </div>
      )}

      {/* Profile header */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {profile.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-muted text-sm">{profile.school} · {user.email}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {levelLabels[profile.level] || profile.level}
          </span>
        </div>
        {profile.bio && <p className="text-sm text-foreground mb-4">{profile.bio}</p>}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted mb-1">目标公司</p>
            <div className="flex flex-wrap gap-1">
              {profile.target_firms?.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{f}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Case 类型</p>
            <div className="flex flex-wrap gap-1">
              {profile.case_types?.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending match requests */}
      {pendingMatches.length > 0 && (
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-blue-900">
              📬 Partner 邀请
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {pendingMatches.length}
              </span>
            </h2>
            <Link href="/partner" className="text-xs text-blue-600 hover:underline">查看全部 →</Link>
          </div>
          <div className="space-y-2">
            {pendingMatches.slice(0, 3).map((m) => (
              <div key={m.id} className="bg-white rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.from_name || "匿名用户"}</span>
                  {m.slot && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{m.slot}</span>}
                </div>
                {m.message && <p className="text-xs text-muted mt-1 line-clamp-1">{m.message}</p>}
                {m.from_wechat && (
                  <p className="text-xs text-green-600 mt-1">微信：{m.from_wechat}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={async () => {
                      await fetch(`/api/match/${m.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "accepted" }),
                      });
                      setPendingMatches((prev) => prev.filter((x) => x.id !== m.id));
                    }}
                    className="flex-1 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    ✓ 接受
                  </button>
                  <button
                    onClick={async () => {
                      await fetch(`/api/match/${m.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "rejected" }),
                      });
                      setPendingMatches((prev) => prev.filter((x) => x.id !== m.id));
                    }}
                    className="flex-1 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    ✕ 拒绝
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill stats */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <h2 className="text-sm font-semibold mb-4">刷题统计</h2>
        {totalDrills === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted text-sm mb-3">还没有刷题记录</p>
            <Link href="/drill" className="text-sm text-primary hover:underline">开始刷题 →</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalDrills}</div>
                <div className="text-xs text-muted">总刷题</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-xs text-muted">正确率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{totalCorrect}</div>
                <div className="text-xs text-muted">答对</div>
              </div>
            </div>
            <div className="space-y-2">
              {drillStats.map((s) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={s.category} className="flex items-center gap-2 text-sm">
                    <span className="w-20 text-xs text-muted">
                      {DRILL_CATEGORY_LABELS[s.category] || s.category}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? "bg-green-400" : pct >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-12 text-right">{s.correct}/{s.total}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Achievement badges */}
      {totalDrills > 0 && (() => {
        const badges = [
          { id: "first_drill", icon: "⚡", label: "初次刷题", earned: totalDrills >= 1 },
          { id: "drill_10", icon: "🔥", label: "刷题10题", earned: totalDrills >= 10 },
          { id: "drill_50", icon: "💪", label: "刷题50题", earned: totalDrills >= 50 },
          { id: "drill_100", icon: "🏆", label: "刷题百题", earned: totalDrills >= 100 },
          { id: "accuracy_80", icon: "🎯", label: "正确率80%+", earned: accuracy >= 80 },
          { id: "case_1", icon: "📖", label: "第一道Case", earned: studiedCases.length >= 1 },
          { id: "case_10", icon: "📚", label: "学习10道Case", earned: studiedCases.length >= 10 },
          { id: "partner", icon: "🤝", label: "注册档案", earned: true },
        ];
        const earned = badges.filter(b => b.earned);
        return (
          <div className="border border-border rounded-xl p-5 bg-white mb-6">
            <h2 className="text-sm font-semibold mb-3">
              成就徽章
              <span className="ml-2 text-xs text-muted font-normal">{earned.length}/{badges.length}</span>
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {badges.map((b) => (
                <div key={b.id} className={`text-center p-2 rounded-xl ${b.earned ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-dashed border-gray-200 opacity-40"}`}>
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-[10px] text-muted leading-tight">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link href="/partner" className="card-hover border border-border rounded-xl p-4 bg-white text-center">
          <div className="text-xl mb-1">🤝</div>
          <p className="text-xs font-medium">找搭档</p>
        </Link>
        <Link href="/drill" className="card-hover border border-border rounded-xl p-4 bg-white text-center">
          <div className="text-xl mb-1">⚡</div>
          <p className="text-xs font-medium">刷题</p>
        </Link>
        <Link href="/ai" className="card-hover border border-border rounded-xl p-4 bg-white text-center">
          <div className="text-xl mb-1">🤖</div>
          <p className="text-xs font-medium">AI练习</p>
        </Link>
      </div>

      <button onClick={signOut} className="block w-full text-center text-sm text-muted hover:text-danger">
        退出登录
      </button>
    </div>
  );
}
