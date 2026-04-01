"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Leader {
  user_id: string;
  name: string;
  school: string;
  level: string;
  total: number;
  correct: number;
  accuracy: number;
}

const levelLabels: Record<string, string> = {
  beginner: "初学者",
  intermediate: "进阶",
  advanced: "高级",
};

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setLeaders(d.leaders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">刷题排行榜</h1>
        <p className="text-muted text-sm mt-1">按刷题总数排名，持续更新</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">加载中...</div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-muted text-sm">还没有刷题记录，成为第一名！</p>
          <Link href="/drill" className="mt-4 inline-block text-sm text-primary hover:underline">
            开始刷题 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader, idx) => (
            <div
              key={leader.user_id}
              className={`border rounded-xl p-4 bg-white flex items-center gap-4 ${
                idx === 0 ? "border-yellow-300 bg-yellow-50" :
                idx === 1 ? "border-gray-300 bg-gray-50" :
                idx === 2 ? "border-orange-200 bg-orange-50" :
                "border-border"
              }`}
            >
              <div className="w-10 text-center font-bold text-lg">
                {idx < 3 ? medals[idx] : <span className="text-muted text-sm">{idx + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{leader.name}</span>
                  {leader.level && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {levelLabels[leader.level] || leader.level}
                    </span>
                  )}
                </div>
                {leader.school && (
                  <p className="text-xs text-muted mt-0.5">{leader.school}</p>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-primary">{leader.total}</div>
                <div className="text-xs text-muted">题</div>
              </div>
              <div className="text-right w-16">
                <div className={`font-semibold text-sm ${
                  leader.accuracy >= 70 ? "text-green-600" :
                  leader.accuracy >= 50 ? "text-yellow-600" : "text-red-500"
                }`}>{leader.accuracy}%</div>
                <div className="text-xs text-muted">正确率</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/drill" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          去刷题冲榜 ⚡
        </Link>
      </div>
    </div>
  );
}
