"use client";

import { useState } from "react";

interface CheatsheetData {
  company_intel?: {
    culture_keywords?: string[];
    interview_style?: string;
    recent_focus?: string;
  };
  opening_pitch?: string;
  job_core_requirements?: { req: string; detail: string; weight: string }[];
  match_points?: { your_bg: string; connects_to: string; gap?: string }[];
  key_questions?: { q: string; type: string; angle: string; answer_frame: string }[];
  star_stories?: { title: string; s: string; t: string; a: string; r: string; use_for: string[] }[];
  questions_to_ask?: { q: string; why: string; timing?: string }[];
  danger_zones?: { zone: string; how_to_handle: string }[];
  custom_tips?: string[];
}

const TYPE_COLORS: Record<string, string> = {
  Behavioral: "bg-blue-100 text-blue-700",
  Case: "bg-purple-100 text-purple-700",
  Technical: "bg-green-100 text-green-700",
  Motivational: "bg-amber-100 text-amber-700",
};

function toPlainText(data: CheatsheetData, company: string, role: string) {
  const lines: string[] = [];
  lines.push("=".repeat(50));
  lines.push(`  面试小抄 · ${company} · ${role}`);
  lines.push("=".repeat(50));

  const ci = data.company_intel;
  if (ci) {
    lines.push("\n【公司情报】");
    if (ci.culture_keywords?.length) lines.push(`  文化关键词：${ci.culture_keywords.join(" / ")}`);
    if (ci.interview_style) lines.push(`  面试风格：${ci.interview_style}`);
    if (ci.recent_focus) lines.push(`  近期关注：${ci.recent_focus}`);
  }

  lines.push(`\n【开场自我介绍】`);
  lines.push(data.opening_pitch || "");

  lines.push(`\n【高频预测题】`);
  data.key_questions?.forEach((q, i) => {
    lines.push(`  Q${i + 1}. ${q.q} [${q.type}]`);
    lines.push(`      答法：${q.answer_frame}\n`);
  });

  lines.push(`\n【STAR 故事库】`);
  data.star_stories?.forEach((s) => {
    lines.push(`  ▸ ${s.title}`);
    lines.push(`    S: ${s.s}  T: ${s.t}`);
    lines.push(`    A: ${s.a}  R: ${s.r}`);
  });

  return lines.join("\n");
}

interface SprintModuleProps {
  company?: string;
  role?: string;
}

export default function SprintModule(props: SprintModuleProps) {
  const [company, setCompany] = useState(props.company || "");
  const [role, setRole] = useState(props.role || "");
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [result, setResult] = useState<{ data: CheatsheetData; company: string; role: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = (company || role) && (jd || resumeText);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jd, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setResult({ data, company: company || "未知公司", role: role || "未知岗位" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // Result view
  if (result) {
    const { data, company: c, role: r } = result;

    const handleCopy = () => {
      navigator.clipboard.writeText(toPlainText(data, c, r));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setResult(null)} className="text-sm text-muted hover:text-primary mb-4 inline-block">
          ← 新建小抄
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-xl font-bold">面试小抄 · {c} · {r}</h1>
          <div className="flex gap-3 mt-3">
            <button onClick={handleCopy} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
              {copied ? "✓ 已复制" : "📋 复制全文"}
            </button>
          </div>
        </div>

        {/* Company Intel */}
        {data.company_intel && (
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h3 className="text-sm font-bold mb-3">🏢 公司情报</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.company_intel.culture_keywords?.map((k, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{k}</span>
              ))}
            </div>
            {data.company_intel.interview_style && <p className="text-sm text-muted"><b>面试风格：</b>{data.company_intel.interview_style}</p>}
            {data.company_intel.recent_focus && <p className="text-sm text-muted mt-1"><b>近期关注：</b>{data.company_intel.recent_focus}</p>}
          </div>
        )}

        {/* Opening Pitch */}
        {data.opening_pitch && (
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h3 className="text-sm font-bold mb-3">🎯 开场自我介绍（30秒）</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 text-sm leading-relaxed">
              {data.opening_pitch}
            </div>
          </div>
        )}

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {data.job_core_requirements && (
            <div className="border border-border rounded-xl p-6 bg-white">
              <h3 className="text-sm font-bold mb-3">📋 岗位核心要求</h3>
              {data.job_core_requirements.map((r, i) => (
                <div key={i} className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{r.req}</span>
                    <span className={`text-xs font-bold ${r.weight === "高" ? "text-red-500" : "text-amber-500"}`}>{r.weight}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">→ {r.detail}</p>
                </div>
              ))}
            </div>
          )}

          {data.match_points && (
            <div className="border border-border rounded-xl p-6 bg-white">
              <h3 className="text-sm font-bold mb-3">✅ 匹配点</h3>
              {data.match_points.map((mp, i) => (
                <div key={i} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm font-medium">{mp.your_bg}</p>
                  <p className="text-xs text-green-600">→ {mp.connects_to}</p>
                  {mp.gap && <p className="text-xs text-amber-500 mt-0.5">⚠ {mp.gap}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Questions */}
        {data.key_questions && (
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h3 className="text-sm font-bold mb-3">❓ 高频预测题 × {data.key_questions.length}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {data.key_questions.map((q, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-[3px] border-purple-400">
                  <p className="font-semibold text-sm">Q{i + 1}. {q.q}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[q.type] || "bg-gray-100 text-gray-600"}`}>{q.type}</span>
                    <span className="text-xs text-muted">考察：{q.angle}</span>
                  </div>
                  <div className="mt-2 bg-purple-50 rounded px-3 py-2 text-xs">{q.answer_frame}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAR Stories */}
        {data.star_stories && data.star_stories.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {data.star_stories.map((story, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 text-sm mb-3">📖 {story.title}</h4>
                {(["s", "t", "a", "r"] as const).map((key) => (
                  <div key={key} className="mb-1.5">
                    <span className="font-bold text-amber-600 text-xs">{key.toUpperCase()}</span>{" "}
                    <span className="text-sm text-amber-900">{story[key]}</span>
                  </div>
                ))}
                <div className="bg-amber-100 rounded px-3 py-1.5 mt-2 text-xs text-amber-800">
                  🎯 {Array.isArray(story.use_for) ? story.use_for.join(" / ") : story.use_for}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {data.questions_to_ask && (
            <div className="border border-border rounded-xl p-6 bg-white">
              <h3 className="text-sm font-bold mb-3">💬 反问问题</h3>
              {data.questions_to_ask.map((q, i) => (
                <div key={i} className="py-2 border-b border-border last:border-0">
                  <p className="font-medium text-sm">{q.q}</p>
                  <p className="text-xs text-green-600 mt-0.5">→ {q.why}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {data.danger_zones && data.danger_zones.length > 0 && (
              <div className="border border-border rounded-xl p-6 bg-white">
                <h3 className="text-sm font-bold mb-3">🚨 雷区预警</h3>
                {data.danger_zones.map((d, i) => (
                  <div key={i} className="bg-red-50 rounded-lg px-4 py-2.5 mb-2 text-sm">
                    <p className="font-semibold text-red-800">⚠️ {d.zone}</p>
                    <p className="text-xs text-muted mt-0.5">→ {d.how_to_handle}</p>
                  </div>
                ))}
              </div>
            )}

            {data.custom_tips && (
              <div className="border border-border rounded-xl p-6 bg-white">
                <h3 className="text-sm font-bold mb-3">⚡ 临场提醒</h3>
                {data.custom_tips.map((tip, i) => (
                  <div key={i} className="bg-amber-50 rounded-lg px-4 py-2 mb-2 text-sm text-amber-900">
                    💡 {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">⚡ 面试突击小抄</h1>
        <p className="text-muted text-sm">提交简历 + 岗位信息，AI 生成专属面试准备清单</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border rounded-xl p-6 bg-white">
          <h2 className="font-semibold text-sm mb-4">📌 岗位信息</h2>
          <div className="space-y-3">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="公司名称，例：McKinsey、BCG"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="应聘岗位，例：Business Analyst"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="粘贴 JD 全文，越详细越精准..."
              rows={8}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">📄 你的简历</h2>
            <label className="cursor-pointer text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              上传文件
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadStatus("解析中...");
                  try {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
                    const data = await res.json();
                    if (data.text) {
                      setResumeText(data.text);
                      setUploadStatus(data.error ? `⚠ ${data.error}` : `✓ 已导入 ${file.name}`);
                    } else {
                      setUploadStatus(`⚠ ${data.error || "解析失败"}`);
                    }
                  } catch {
                    setUploadStatus("解析失败，请手动粘贴");
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {uploadStatus && (
            <p className={`text-xs mb-2 ${uploadStatus.startsWith("✓") ? "text-green-600" : uploadStatus.startsWith("⚠") ? "text-amber-600" : "text-muted"}`}>
              {uploadStatus}
            </p>
          )}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder={"粘贴简历内容，或点击上方「上传文件」导入 PDF/Word\n\n教育背景、实习经历、项目经验\n\n（越详细，小抄越精准）"}
            rows={11}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-danger rounded-xl px-4 py-3 mt-4 text-sm">{error}</div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || loading}
        className="w-full mt-6 bg-primary text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
      >
        {loading ? "正在生成面试小抄... 约30-60秒" : "⚡ 一键生成面试小抄"}
      </button>
    </div>
  );
}
