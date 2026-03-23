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

export default function StudentDetailPage() {
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

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStudent(data.student || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

      {/* Profile card */}
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
            <p className="text-xs text-muted mb-1.5 font-medium">语言偏好</p>
            <span className="rounded-full px-2.5 py-0.5 text-xs bg-yellow-50 text-yellow-700">
              {student.language}
            </span>
          </div>
        </div>
      </div>

      {/* Availability & Booking */}
      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <h2 className="text-lg font-semibold mb-1">选择时间预约</h2>
        <p className="text-xs text-muted mb-4">点击蓝色格子选择时间段，然后填写信息预约</p>

        <AvailabilityGrid
          availability={student.availability}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
        />

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
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              bookingResult.ok
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-danger border border-danger"
            }`}
          >
            {bookingResult.msg}
          </div>
        )}
      </div>
    </div>
  );
}
