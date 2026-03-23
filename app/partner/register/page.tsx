"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const firmOptions = ["MBB", "Big4", "Boutique", "Internal Strategy", "Other"];
const levelOptions = [
  { value: "beginner", label: "初学者" },
  { value: "intermediate", label: "进阶" },
  { value: "advanced", label: "高级" },
];
const caseTypeOptions = [
  { value: "Profitability", label: "盈利分析 Profitability" },
  { value: "Market Entry", label: "市场进入 Market Entry" },
  { value: "Pricing", label: "定价 Pricing" },
  { value: "M&A", label: "并购 M&A" },
  { value: "Market Sizing", label: "市场规模 Market Sizing" },
  { value: "Growth Strategy", label: "增长战略 Growth Strategy" },
];
const languageOptions = [
  { value: "中文", label: "中文" },
  { value: "English", label: "English" },
  { value: "Both", label: "Both 双语" },
];

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

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[] | string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item.value);
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => toggle(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function WeeklyGrid({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((s) => s !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  const toggleDay = (dayKey: string) => {
    const daySlots = SLOTS.map((s) => `${dayKey}_${s.key}`);
    const allSelected = daySlots.every((s) => selected.includes(s));
    if (allSelected) {
      onChange(selected.filter((s) => !daySlots.includes(s)));
    } else {
      onChange([...new Set([...selected, ...daySlots])]);
    }
  };

  const toggleSlot = (slotKey: string) => {
    const slotCells = DAYS.map((d) => `${d.key}_${slotKey}`);
    const allSelected = slotCells.every((s) => selected.includes(s));
    if (allSelected) {
      onChange(selected.filter((s) => !slotCells.includes(s)));
    } else {
      onChange([...new Set([...selected, ...slotCells])]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-1.5"></th>
            {DAYS.map((d) => (
              <th
                key={d.key}
                className="p-1.5 text-center font-medium text-muted cursor-pointer hover:text-primary"
                onClick={() => toggleDay(d.key)}
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((slot) => (
            <tr key={slot.key}>
              <td
                className="p-1.5 text-right text-muted whitespace-nowrap cursor-pointer hover:text-primary"
                onClick={() => toggleSlot(slot.key)}
              >
                <div>{slot.label}</div>
                <div className="text-[10px] opacity-60">{slot.sub}</div>
              </td>
              {DAYS.map((d) => {
                const key = `${d.key}_${slot.key}`;
                const active = selected.includes(key);
                return (
                  <td key={key} className="p-1">
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className={`w-full h-10 rounded-lg border transition-all ${
                        active
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {active ? "✓" : ""}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted mt-1.5">点击日期/时段标题可整行选择</p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [wechat, setWechat] = useState("");
  const [school, setSchool] = useState("");
  const [targetFirms, setTargetFirms] = useState<string[]>([]);
  const [level, setLevel] = useState("beginner");
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [language, setLanguage] = useState("Both");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !wechat || !school || targetFirms.length === 0) {
      setError("请填写必填项：姓名、微信号、学校、目标公司");
      return;
    }
    if (availability.length === 0) {
      setError("请至少选择一个可用时间段");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          wechat,
          school,
          target_firms: targetFirms,
          level,
          case_types: caseTypes,
          availability,
          language,
          bio,
          user_id: user?.id || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "注册失败");
      }
      router.push("/partner");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">注册 Case Partner</h1>
      <p className="text-muted text-sm mb-8">填写信息后，其他同学可以找到你并预约练习</p>

      {error && (
        <div className="bg-red-50 border border-danger text-danger rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            姓名 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的昵称或真名"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            微信号 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            placeholder="用于匹配后联系"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            学校 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="例如：北京大学 / LSE / INSEAD"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            目标公司 <span className="text-danger">*</span>
          </label>
          <MultiSelect
            options={firmOptions}
            selected={targetFirms}
            onChange={setTargetFirms}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">水平</label>
          <div className="flex gap-3">
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLevel(opt.value)}
                className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                  level === opt.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">擅长/想练的 Case 类型</label>
          <MultiSelect
            options={caseTypeOptions}
            selected={caseTypes}
            onChange={setCaseTypes}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            每周可用时间 <span className="text-danger">*</span>
          </label>
          <WeeklyGrid selected={availability} onChange={setAvailability} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">语言偏好</label>
          <div className="flex gap-3">
            {languageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLanguage(opt.value)}
                className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                  language === opt.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">自我介绍</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="简单介绍下你的背景和面试准备情况..."
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "提交中..." : "提交注册"}
        </button>
      </form>
    </div>
  );
}
