"use client";

import { useState, useRef } from "react";

type Phase = "upload" | "analyzing" | "result";

export default function ResumeModule() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetFirm, setTargetFirm] = useState("McKinsey");
  const [feedback, setFeedback] = useState("");
  const [inputMode, setInputMode] = useState<"paste" | "file">("paste");
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setPhase("analyzing");
    setFeedback("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qa",
          message: `我要申请${targetFirm}的${targetRole || "咨询顾问"}职位，请帮我优化这份简历。

简历内容：
${resumeText}

请按以下格式给出反馈（中文）：

## 总体评估
2-3句话说明这份简历的整体强弱

## 关键问题（最重要的3个）
逐一列出，每个问题给出具体修改建议

## 逐条优化建议
针对每段经历，给出咨询思维的改写建议：
- 用数字量化impact（%增长、$金额、人数规模）
- 突出"问题→分析→解决方案→结果"的结构
- 去掉职责描述，改成成就陈述

## 额外亮点建议
2-3个可以强化的方向`,
          history: [],
        }),
      });
      const data = await res.json();
      setFeedback(data.response || "分析失败，请重试。");
      setPhase("result");
    } catch {
      setFeedback("网络错误，请重试。");
      setPhase("result");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (data.text) setResumeText(data.text);
    } catch {
      alert("文件解析失败，请手动粘贴简历内容");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold">简历优化</h1>
      </div>

      <div className="border border-teal-200 bg-teal-50 rounded-xl p-4 mb-6 text-sm text-teal-800">
        💡 AI按咨询顾问思维帮你重写简历：量化impact、突出问题解决能力、让每条经历都更有说服力。
      </div>

      {phase === "upload" && (
        <div className="space-y-4">
          {/* Target info */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="text-sm font-semibold mb-3">目标职位</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">目标公司</label>
                <select
                  value={targetFirm}
                  onChange={(e) => setTargetFirm(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option>McKinsey</option>
                  <option>BCG</option>
                  <option>Bain</option>
                  <option>Deloitte</option>
                  <option>PwC Strategy&</option>
                  <option>Roland Berger</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">目标岗位（可选）</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="如：Business Analyst"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Resume input */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold">简历内容</h2>
              <div className="flex border border-border rounded-lg overflow-hidden text-xs ml-auto">
                <button
                  onClick={() => setInputMode("paste")}
                  className={`px-3 py-1.5 ${inputMode === "paste" ? "bg-primary text-white" : "text-muted hover:bg-gray-50"}`}
                >
                  粘贴文字
                </button>
                <button
                  onClick={() => setInputMode("file")}
                  className={`px-3 py-1.5 ${inputMode === "file" ? "bg-primary text-white" : "text-muted hover:bg-gray-50"}`}
                >
                  上传文件
                </button>
              </div>
            </div>

            {inputMode === "file" ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-blue-50/30 transition-all"
              >
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm text-muted">点击上传 PDF 或 Word 文件</p>
                <p className="text-xs text-muted mt-1">或拖拽文件到此处</p>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴你的简历文字内容（英文或中文均可）...

示例格式：
教育背景：XX大学，商科，GPA 3.8，2024届
实习经历：
- XX公司，战略部，2023.06-2023.09
  负责XX项目，完成了XX..."
                rows={14}
                className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
              />
            )}

            {resumeText && (
              <p className="text-xs text-muted mt-2">{resumeText.length} 字符</p>
            )}
          </div>

          <button
            onClick={analyze}
            disabled={!resumeText.trim()}
            className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            开始 AI 优化分析
          </button>
        </div>
      )}

      {phase === "analyzing" && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 animate-pulse">🤖</div>
          <p className="text-lg font-semibold mb-2">AI 正在分析你的简历...</p>
          <p className="text-muted text-sm">通常需要15-30秒</p>
        </div>
      )}

      {phase === "result" && (
        <div>
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h2 className="text-sm font-semibold mb-4">🤖 AI 简历优化建议</h2>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{feedback}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setPhase("upload"); setFeedback(""); }}
              className="flex-1 border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              重新分析
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
