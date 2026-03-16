"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_avatar: string;
  likes: number;
  created_at: string;
}

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
  comments: Comment[];
}

const categoryColors: Record<string, string> = {
  interview_exp: "bg-blue-100 text-blue-700",
  case_discussion: "bg-purple-100 text-purple-700",
  help: "bg-orange-100 text-orange-700",
  resource: "bg-green-100 text-green-700",
  general: "bg-gray-100 text-gray-700",
};

const categoryLabels: Record<string, string> = {
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

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setPost(null);
        } else {
          setPost(data);
          setLikeCount(data.likes);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleLike() {
    const res = await fetch(`/api/posts/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: 1 }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((c) => (data.liked ? c + 1 : c - 1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_id: 1,
          content: commentText.trim(),
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setPost((prev) =>
          prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
        );
        setCommentText("");
      }
    } catch {
      // ignore
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return <div className="text-center text-muted py-12">加载中...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">帖子不存在</p>
        <Link href="/community" className="text-primary hover:underline text-sm">
          返回社区
        </Link>
      </div>
    );
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tags);
  } catch {
    // ignore
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回社区
      </Link>

      {/* Post */}
      <article className="border border-border rounded-lg p-6 bg-white mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              categoryColors[post.category] || "bg-gray-100 text-gray-700"
            }`}
          >
            {categoryLabels[post.category] || post.category}
          </span>
          {post.pinned === 1 && (
            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
              置顶
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold mb-3">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-muted mb-4">
          <span className="font-medium text-foreground">
            {post.author_name || "匿名"}
          </span>
          <span>{timeAgo(post.created_at)}</span>
          <span>{post.views} 次浏览</span>
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-wrap mb-4">
          {post.content}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked
                ? "text-red-500"
                : "text-muted hover:text-red-500"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={liked ? "currentColor" : "none"}
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
            {likeCount > 0 ? likeCount : "点赞"}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <svg
              className="w-5 h-5"
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
            {post.comments.length} 条评论
          </span>
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 className="font-semibold text-base mb-4">
          评论 ({post.comments.length})
        </h2>

        {post.comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-border rounded-lg p-4 bg-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    {comment.author_name || "匿名"}
                  </span>
                  <span className="text-xs text-muted">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <form
          onSubmit={handleComment}
          className="border border-border rounded-lg p-4 bg-white"
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="写下你的评论..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y mb-3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submittingComment ? "发送中..." : "发表评论"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
