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

const levelLabels: Record<string, string> = {
  beginner: "初学者",
  intermediate: "进阶",
  advanced: "高级",
};

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [drillStats, setDrillStats] = useState<DrillStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load profile
    supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data as StudentProfile);
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
            Object.entries(byCategory).map(([category, stats]) => ({
              category,
              ...stats,
            }))
          );
        }
      });
  }, [user]);

  if (authLoading || loading) {
    return <div className="text-center py-20 text-muted">加载中...</div>;
  }

  // Not logged in
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

  // Logged in but no profile
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
            <Link
              href="/drill"
              className="block text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              先去刷题
            </Link>
            <Link
              href="/casebook"
              className="block text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              看题库
            </Link>
          </div>
        </div>

        <button
          onClick={signOut}
          className="block w-full text-center text-sm text-muted hover:text-danger mt-8"
        >
          退出登录
        </button>
      </div>
    );
  }

  // Full profile view
  const totalDrills = drillStats.reduce((sum, s) => sum + s.total, 0);
  const totalCorrect = drillStats.reduce((sum, s) => sum + s.correct, 0);
  const accuracy = totalDrills > 0 ? Math.round((totalCorrect / totalDrills) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
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

        {profile.bio && (
          <p className="text-sm text-foreground mb-4">{profile.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted mb-1">目标公司</p>
            <div className="flex flex-wrap gap-1">
              {profile.target_firms?.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Case 类型</p>
            <div className="flex flex-wrap gap-1">
              {profile.case_types?.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drill stats */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <h2 className="text-sm font-semibold mb-4">刷题统计</h2>
        {totalDrills === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted text-sm mb-3">还没有刷题记录</p>
            <Link href="/drill" className="text-sm text-primary hover:underline">
              开始刷题 →
            </Link>
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
                    <span className="w-20 text-xs text-muted">{s.category}</span>
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
        <Link href="/community" className="card-hover border border-border rounded-xl p-4 bg-white text-center">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">社区</p>
        </Link>
      </div>

      <button
        onClick={signOut}
        className="block w-full text-center text-sm text-muted hover:text-danger"
      >
        退出登录
      </button>
    </div>
  );
}
