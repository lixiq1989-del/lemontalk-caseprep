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

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  tags: string[];
  comment: string;
  created_at: string;
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
  { key: "mon", label: "周一" },
  { key: "tue", label: "周二" },
  { key: "wed", label: "周三" },
  { key: "thu", label: "周四" },
  { key: "fri", label: "周五" },
  { key: "sat", label: "周六" },
  { key: "sun", label: "周日" },
];

const SLOTS = [
  { key: "morning", label: "上午", sub: "9-12" },
  { key: "afternoon", label: "下午", sub: "13-17" },
  { key: "evening", label: "晚上", sub: "19-22" },
];

const REVIEW_TAGS = [
  "准时守约", "讲解清晰", "提问到位", "进度合适",
  "态度认真", "反馈有用", "鼓励友好", "会再约",
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-2xl transition-transform ${onChange ? "hover:scale-110 cursor-pointer" : "cursor-default"} ${
            star <= value ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function AvailabilityGrid({ availability, selectedSlot, onSelectSlot }: {
  availability: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string | null) => void;
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2"></th>
          {DAYS.map((d) => (
            <th key={d.key} className="p-2 text-center font-medium text-muted text-xs">
              {d.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SLOTS.map((slot) => (
          <tr key={slot.key}>
            <td className="p-2 text-right text-muted text-xs whitespace-nowrap">
              <div>{slot.label}</div>
              <div className="text-[10px] opacity-50">{slot.sub}</div>
            </td>
            {DAYS.map((d) => {
              const key = `${d.key}_${slot.key}`;
              const available = availability.includes(key);
              const isSelected = selectedSlot === key;
              return (
                <td key={key} className="p-1">
                  {available ? (
                    <button
                      onClick={() => onSelectSlot(isSelected ? null : key)}
                      className={`w-full h-11 rounded-lg border-2 transition-all text-xs font-medium ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-md scale-105"
                          : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                      }`}
                    >
                      {isSelected ? "已选" : "可约"}
                    </button>
                  ) : (
                    <div className="w-full h-11 rounded-lg bg-gray-50 border border-gray-100" />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PartnerProfileClient() {
  const params = useParams();
  const id = params.id;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingWechat, setBookingWechat] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewWechat, setReviewWechat] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStudent(data.student || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`/api/reviews?student_id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvgRating(data.avg || null);
      });
  }, [id]);

  const handleBook = async () => {
    if (!selectedSlot) {
      setBookingResult({ ok: false, msg: "请先选择一个时间段" });
      return;
    }
    if (!bookingName || !bookingWechat) {
      setBookingResult({ ok: false, msg: "请填写你的姓名和微信号" });
      return;
    }
    setBookingSending(true);
    setBookingResult(null);
    try {
      const [day, time] = selectedSlot.split("_");
      const dayLabel: Record<string, string> = {
        mon: "周一", tue: "周二", wed: "周三", thu: "周四",
        fri: "周五", sat: "周六", sun: "周日",
      };
      const slotLabel: Record<string, string> = {
        morning: "上午", afternoon: "下午", evening: "晚上",
      };
      const msg = `[预约${dayLabel[day]}${slotLabel[time]}] ${bookingMsg}`.trim();

      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: bookingName,
          from_wechat: bookingWechat,
          to_id: Number(id),
          message: msg,
          slot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "预约失败");
      setBookingResult({
        ok: true,
        msg: `预约成功！对方微信：${student?.wechat}，请添加微信确认练习时间。`,
      });
    } catch (err: unknown) {
      setBookingResult({
        ok: false,
        msg: err instanceof Error ? err.message : "预约失败",
      });
    } finally {
      setBookingSending(false);
    }
  };

  const handleReview = async () => {
    if (reviewRating === 0) {
      setReviewResult({ ok: false, msg: "请先选择星级评分" });
      return;
    }
    if (!reviewName.trim()) {
      setReviewResult({ ok: false, msg: "请填写你的昵称" });
      return;
    }
    setReviewSubmitting(true);
    setReviewResult(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: Number(id),
          rating: reviewRating,
          tags: reviewTags,
          comment: reviewComment,
          reviewer_name: reviewName,
          reviewer_wechat: reviewWechat,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "提交失败");

      setReviewResult({ ok: true, msg: "评价提交成功，感谢你的反馈！" });
      setShowReviewForm(false);
      // Refresh reviews
      fetch(`/api/reviews?student_id=${id}`)
        .then((r) => r.json())
        .then((d) => { setReviews(d.reviews || []); setAvgRating(d.avg || null); });
    } catch (err: unknown) {
      setReviewResult({
        ok: false,
        msg: err instanceof Error ? err.message : "提交失败",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-muted">加载中...</div>;

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-lg">用户不存在</p>
        <Link href="/partner" className="text-primary text-sm mt-2 inline-block">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/partner" className="text-primary text-sm hover:underline mb-4 inline-block">
        &larr; 返回列表
      </Link>

      {/* Profile card */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-muted text-sm mt-1">{student.school}</p>
            {avgRating !== null && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</span>
                <span className="text-sm font-semibold">{avgRating}</span>
                <span className="text-xs text-muted">({reviews.length} 条评价)</span>
              </div>
            )}
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${levelColors[student.level] || "bg-gray-100 text-gray-600"}`}>
            {levelLabels[student.level] || student.level}
          </span>
        </div>

        {student.bio && <p className="text-sm text-foreground mb-5 leading-relaxed">{student.bio}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">目标公司</p>
            <div className="flex flex-wrap gap-1.5">
              {student.target_firms.map((f) => (
                <span key={f} className="rounded-full px-2.5 py-0.5 text-xs bg-primary-light text-primary">{f}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">Case 类型</p>
            <div className="flex flex-wrap gap-1.5">
              {student.case_types.map((t) => (
                <span key={t} className="rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1.5 font-medium">语言偏好</p>
            <span className="rounded-full px-2.5 py-0.5 text-xs bg-yellow-50 text-yellow-700">{student.language}</span>
          </div>
        </div>
      </div>

      {/* Availability & Booking */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <h2 className="text-lg font-semibold mb-1">选择时间预约</h2>
        <p className="text-xs text-muted mb-4">点击蓝色格子选择时间段，然后填写信息预约</p>

        <AvailabilityGrid availability={student.availability} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />

        {selectedSlot && (
          <div className="mt-5 pt-5 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1">你的姓名 *</label>
                <input
                  type="text"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">你的微信号 *</label>
                <input
                  type="text"
                  value={bookingWechat}
                  onChange={(e) => setBookingWechat(e.target.value)}
                  placeholder="方便对方加你"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">留言（可选）</label>
              <textarea
                value={bookingMsg}
                onChange={(e) => setBookingMsg(e.target.value)}
                placeholder="想练什么类型的case，或简单介绍下自己..."
                rows={2}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
            <button
              onClick={handleBook}
              disabled={bookingSending}
              className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {bookingSending ? "预约中..." : "确认预约"}
            </button>
          </div>
        )}

        {bookingResult && (
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${bookingResult.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-danger border border-danger"}`}>
            {bookingResult.msg}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Partner 评价</h2>
            {avgRating !== null && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={Math.round(avgRating)} />
                <span className="text-sm font-bold">{avgRating}</span>
                <span className="text-xs text-muted">/ {reviews.length} 条</span>
              </div>
            )}
          </div>
          <button
            onClick={() => { setShowReviewForm(!showReviewForm); setReviewResult(null); }}
            className="text-sm bg-primary text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            {showReviewForm ? "取消" : "写评价"}
          </button>
        </div>

        {/* Review form */}
        {showReviewForm && (
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-5">
            <h3 className="text-sm font-semibold mb-3">练完一次就可以留一条评价</h3>

            {/* Star rating */}
            <div className="mb-4">
              <p className="text-xs text-muted mb-1.5">整体评分 *</p>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <p className="text-xs text-muted mb-1.5">选择标签（可多选）</p>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setReviewTags(reviewTags.includes(tag) ? reviewTags.filter(t => t !== tag) : [...reviewTags, tag])}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      reviewTags.includes(tag)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border text-muted hover:border-primary"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <p className="text-xs text-muted mb-1.5">评价内容（可选）</p>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="这次练习体验如何？对下一个想约他的同学说点什么..."
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none bg-white"
              />
            </div>

            {/* Reviewer info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-muted mb-1">你的昵称 *</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="如：清华Kevin"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">你的微信（可选）</label>
                <input
                  type="text"
                  value={reviewWechat}
                  onChange={(e) => setReviewWechat(e.target.value)}
                  placeholder="防止重复评价"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={handleReview}
              disabled={reviewSubmitting}
              className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {reviewSubmitting ? "提交中..." : "提交评价"}
            </button>

            {reviewResult && (
              <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${reviewResult.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {reviewResult.msg}
              </div>
            )}
          </div>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <p className="text-muted text-sm text-center py-6">还没有评价，练完了来留一条吧</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {r.reviewer_name[0]}
                    </div>
                    <span className="text-sm font-medium">{r.reviewer_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`text-sm ${s <= r.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                    ))}
                  </div>
                </div>
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{tag}</span>
                    ))}
                  </div>
                )}
                {r.comment && <p className="text-sm text-foreground">{r.comment}</p>}
                <p className="text-xs text-muted mt-2">{new Date(r.created_at).toLocaleDateString("zh-CN")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
