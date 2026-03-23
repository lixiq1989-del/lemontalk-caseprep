"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

// Admin emails - add yours here
const ADMIN_EMAILS = ["simon@lemontalk.com", "lixiq1989@gmail.com"];

type Tab = "dashboard" | "users" | "posts" | "cases" | "matches";

interface UserRow {
  id: number;
  name: string;
  wechat: string;
  school: string;
  level: string;
  active: boolean;
  created_at: string;
}

interface PostRow {
  id: number;
  title: string;
  category: string;
  likes: number;
  views: number;
  created_at: string;
  author_name?: string;
}

interface MatchRow {
  id: number;
  from_name: string;
  from_wechat: string;
  to_id: number;
  message: string;
  slot: string;
  status: string;
  created_at: string;
}

interface DashboardStats {
  users: number;
  posts: number;
  comments: number;
  matches: number;
  drills: number;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<DashboardStats>({ users: 0, posts: 0, comments: 0, matches: 0, drills: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin, tab]);

  async function loadData() {
    setLoading(true);

    if (tab === "dashboard" || tab === "users") {
      const { data, count } = await supabase.from("students").select("*", { count: "exact" }).order("created_at", { ascending: false });
      setUsers((data as UserRow[]) || []);
      setStats(prev => ({ ...prev, users: count || 0 }));
    }

    if (tab === "dashboard" || tab === "posts") {
      const { data, count } = await supabase.from("posts").select("*", { count: "exact" }).order("created_at", { ascending: false });
      setPosts((data as PostRow[]) || []);
      setStats(prev => ({ ...prev, posts: count || 0 }));
    }

    if (tab === "dashboard" || tab === "matches") {
      const { data, count } = await supabase.from("match_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
      setMatches((data as MatchRow[]) || []);
      setStats(prev => ({ ...prev, matches: count || 0 }));
    }

    if (tab === "dashboard") {
      const { count: commentCount } = await supabase.from("comments").select("*", { count: "exact", head: true });
      const { count: drillCount } = await supabase.from("drill_records").select("*", { count: "exact", head: true });
      setStats(prev => ({ ...prev, comments: commentCount || 0, drills: drillCount || 0 }));
    }

    setLoading(false);
  }

  async function toggleUserActive(id: number, active: boolean) {
    await supabase.from("students").update({ active: !active }).eq("id", id);
    setUsers(users.map(u => u.id === id ? { ...u, active: !active } : u));
  }

  async function deletePost(id: number) {
    if (!confirm("确定删除这篇帖子？")) return;
    await supabase.from("comments").delete().eq("post_id", id);
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter(p => p.id !== id));
  }

  if (authLoading) return <div className="text-center py-20 text-muted">加载中...</div>;

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-bold mb-2">无权限访问</h1>
        <p className="text-muted text-sm">管理后台仅限管理员使用</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "数据看板", icon: "📊" },
    { key: "users", label: "用户管理", icon: "👥" },
    { key: "posts", label: "内容审核", icon: "📝" },
    { key: "matches", label: "匹配记录", icon: "🤝" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">管理后台</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? "bg-primary text-white" : "bg-white border border-border text-muted hover:bg-gray-50"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-10 text-muted">加载中...</div>}

      {/* Dashboard */}
      {!loading && tab === "dashboard" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "注册用户", value: stats.users, color: "text-primary" },
              { label: "帖子", value: stats.posts, color: "text-purple-600" },
              { label: "评论", value: stats.comments, color: "text-green-600" },
              { label: "匹配请求", value: stats.matches, color: "text-orange-600" },
              { label: "刷题次数", value: stats.drills, color: "text-pink-600" },
            ].map(s => (
              <div key={s.label} className="border border-border rounded-xl p-4 bg-white text-center">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent users */}
          <div className="border border-border rounded-xl bg-white p-5 mb-6">
            <h3 className="text-sm font-semibold mb-3">最近注册用户</h3>
            {users.length === 0 ? (
              <p className="text-muted text-sm">暂无注册用户</p>
            ) : (
              <div className="space-y-2">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                    <div>
                      <span className="font-medium">{u.name}</span>
                      <span className="text-muted ml-2">{u.school}</span>
                    </div>
                    <span className="text-xs text-muted">{new Date(u.created_at).toLocaleDateString("zh-CN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent matches */}
          <div className="border border-border rounded-xl bg-white p-5">
            <h3 className="text-sm font-semibold mb-3">最近匹配</h3>
            {matches.length === 0 ? (
              <p className="text-muted text-sm">暂无匹配记录</p>
            ) : (
              <div className="space-y-2">
                {matches.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                    <div>
                      <span className="font-medium">{m.from_name || m.from_wechat}</span>
                      <span className="text-muted mx-1">→</span>
                      <span>#{m.to_id}</span>
                      {m.slot && <span className="text-xs text-muted ml-2">[{m.slot}]</span>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}>{m.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users */}
      {!loading && tab === "users" && (
        <div className="border border-border rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">姓名</th>
                <th className="text-left px-4 py-3 font-medium">微信</th>
                <th className="text-left px-4 py-3 font-medium">学校</th>
                <th className="text-left px-4 py-3 font-medium">水平</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-left px-4 py-3 font-medium">注册时间</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.wechat}</td>
                  <td className="px-4 py-3">{u.school}</td>
                  <td className="px-4 py-3">{u.level}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.active ? "活跃" : "已禁"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{new Date(u.created_at).toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUserActive(u.id, u.active)}
                      className={`text-xs px-2 py-1 rounded ${u.active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                    >
                      {u.active ? "禁用" : "启用"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-muted">暂无注册用户</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Posts / Content moderation */}
      {!loading && tab === "posts" && (
        <div className="border border-border rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">标题</th>
                <th className="text-left px-4 py-3 font-medium">分类</th>
                <th className="text-left px-4 py-3 font-medium">赞/看</th>
                <th className="text-left px-4 py-3 font-medium">时间</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted">{p.id}</td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.likes}/{p.views}</td>
                  <td className="px-4 py-3 text-muted text-xs">{new Date(p.created_at).toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deletePost(p.id)}
                      className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted">暂无帖子</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Matches */}
      {!loading && tab === "matches" && (
        <div className="border border-border rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">发起人</th>
                <th className="text-left px-4 py-3 font-medium">接收人</th>
                <th className="text-left px-4 py-3 font-medium">时段</th>
                <th className="text-left px-4 py-3 font-medium">留言</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-left px-4 py-3 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr key={m.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted">{m.id}</td>
                  <td className="px-4 py-3 font-medium">{m.from_name || m.from_wechat || "-"}</td>
                  <td className="px-4 py-3">#{m.to_id}</td>
                  <td className="px-4 py-3 text-xs text-muted">{m.slot || "-"}</td>
                  <td className="px-4 py-3 text-xs max-w-[150px] truncate">{m.message || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{new Date(m.created_at).toLocaleDateString("zh-CN")}</td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-muted">暂无匹配记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
