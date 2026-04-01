"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  likes: number;
  views: number;
  pinned: number;
  created_at: string;
  author_name: string;
  author_avatar: string;
  comment_count: number;
}

const categories = [
  { key: "all", label: "全部" },
  { key: "insights", label: "💡 Insights" },
  { key: "offer", label: "🎉 Offer墙" },
  { key: "interview_exp", label: "面经" },
  { key: "case_discussion", label: "Case讨论" },
  { key: "help", label: "求助" },
  { key: "resource", label: "资源分享" },
  { key: "general", label: "闲聊" },
];

const categoryColors: Record<string, string> = {
  insights: "bg-amber-100 text-amber-700",
  offer: "bg-yellow-100 text-yellow-700",
  interview_exp: "bg-blue-100 text-blue-700",
  case_discussion: "bg-purple-100 text-purple-700",
  help: "bg-orange-100 text-orange-700",
  resource: "bg-green-100 text-green-700",
  general: "bg-gray-100 text-gray-700",
};

const categoryLabels: Record<string, string> = {
  insights: "💡 Insights",
  offer: "🎉 Offer",
  interview_exp: "面经",
  case_discussion: "Case讨论",
  help: "求助",
  resource: "资源分享",
  general: "闲聊",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr + "Z");
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    params.set("sort", sort);

    fetch(`/api/posts?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory, sort]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">社区</h1>
        <Link
          href="/community/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 发帖
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-3 mb-4 text-sm">
        <button
          onClick={() => setSort("latest")}
          className={`font-medium ${
            sort === "latest" ? "text-primary" : "text-muted hover:text-foreground"
          }`}
        >
          最新
        </button>
        <button
          onClick={() => setSort("popular")}
          className={`font-medium ${
            sort === "popular" ? "text-primary" : "text-muted hover:text-foreground"
          }`}
        >
          最热
        </button>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center text-muted py-12">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted py-12">暂无帖子</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className={`block border rounded-lg p-4 card-hover ${
                post.category === "offer"
                  ? "border-yellow-300 bg-yellow-50"
                  : post.category === "insights"
                  ? "border-amber-200 bg-amber-50"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {post.pinned === 1 && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                        置顶
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        categoryColors[post.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[post.category] || post.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base mb-1 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{post.author_name || "匿名"}</span>
                    <span>{timeAgo(post.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {post.comment_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
