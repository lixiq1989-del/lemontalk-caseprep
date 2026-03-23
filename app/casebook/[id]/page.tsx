"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CaseSections {
  clarifying?: string;
  framework?: string;
  exhibit1?: string;
  exhibit2?: string;
  qa?: string;
  recommendation?: string;
  tips?: string;
  deep_analysis?: string;
  issue_tree_img?: string;
  exhibit1_img?: string;
  exhibit2_img?: string;
}

interface CaseDetail {
  id: number;
  title: string;
  title_cn: string;
  type: string;
  difficulty: string;
  industry: string;
  source: string;
  prompt_en: string;
  prompt_cn: string;
  content: string;
  sections: CaseSections;
  tags: string[];
  created_at: string;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  Profitability: "bg-blue-100 text-blue-700",
  "Market Entry": "bg-purple-100 text-purple-700",
  Pricing: "bg-orange-100 text-orange-700",
  "M&A": "bg-pink-100 text-pink-700",
  "Market Sizing": "bg-teal-100 text-teal-700",
  "Growth Strategy": "bg-indigo-100 text-indigo-700",
  Operations: "bg-cyan-100 text-cyan-700",
};

// Parse content into structured sections
function parseContent(content: string) {
  const sections: { title: string; body: string }[] = [];
  const lines = content.split("\n");
  let currentTitle = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    // Detect section headers (lines that end with ":" or are short and distinctive)
    if (
      line.match(/^(Key areas|Framework|Approach|Key data|Key tension|Expected)/i) ||
      line.match(/^\d+\.\s/) ||
      line.match(/^[A-Z][a-z]+ (side|analysis|strategy|risk|assessment)/i)
    ) {
      if (currentBody.length > 0) {
        sections.push({
          title: currentTitle || "分析要点",
          body: currentBody.join("\n").trim(),
        });
      }
      currentTitle = line.trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentBody.length > 0 || currentTitle) {
    sections.push({
      title: currentTitle || "分析要点",
      body: currentBody.join("\n").trim(),
    });
  }

  return sections.length > 0 ? sections : [{ title: "分析要点", body: content }];
}

type StudyPhase = "prompt" | "think" | "framework" | "analysis" | "full";

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id;
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<StudyPhase>("prompt");
  const [myFramework, setMyFramework] = useState("");
  const [showFullMode, setShowFullMode] = useState(false);

  useEffect(() => {
    fetch(`/api/cases/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCaseData(data.case_item || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-muted">加载中...</div>;
  }

  if (!caseData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-lg">Case 不存在</p>
        <Link href="/casebook" className="text-primary text-sm mt-2 inline-block">
          返回题库
        </Link>
      </div>
    );
  }

  const sec = caseData.sections || {};
  const studySections: { title: string; body: string; key: string }[] = [] as { title: string; body: string; key: string }[];
  if (sec.clarifying) studySections.push({ key: "clarifying", title: "澄清信息 Clarifying Info", body: sec.clarifying });
  if (sec.framework) studySections.push({ key: "framework", title: "分析框架 Framework", body: sec.framework });
  if (sec.exhibit1 || sec.exhibit1_img) studySections.push({ key: "exhibit1", title: "Exhibit #1 — 数据分析", body: sec.exhibit1 || "" });
  if (sec.exhibit2 || sec.exhibit2_img) studySections.push({ key: "exhibit2", title: "Exhibit #2 — 方案对比", body: sec.exhibit2 || "" });
  if (sec.qa) studySections.push({ key: "qa", title: "问题与回答 Q&A", body: sec.qa });
  if (sec.recommendation) studySections.push({ key: "recommendation", title: "建议 Recommendation", body: sec.recommendation });
  if (sec.tips) studySections.push({ key: "tips", title: "面试技巧 Tips", body: sec.tips });
  if (sec.deep_analysis) studySections.push({ key: "deep_analysis", title: "深度分析", body: sec.deep_analysis });
  // Fallback to content parsing if no sections
  const contentSections = studySections.length > 0
    ? studySections
    : parseContent(caseData.content).map((s, i) => ({ ...s, key: `section_${i}` }));

  // Full view mode (traditional)
  if (showFullMode) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/casebook" className="text-primary text-sm hover:underline">
            &larr; 返回题库
          </Link>
          <button
            onClick={() => { setShowFullMode(false); setPhase("prompt"); }}
            className="text-sm text-primary hover:underline"
          >
            切换到学习模式
          </button>
        </div>

        <div className="border border-border rounded-xl p-6 bg-white mb-4">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[caseData.type] || "bg-gray-100 text-gray-600"}`}>
              {caseData.type}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[caseData.difficulty] || "bg-gray-100 text-gray-600"}`}>
              {caseData.difficulty}
            </span>
            <span className="rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600">{caseData.industry}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{caseData.title}</h1>
          {caseData.title_cn && <p className="text-muted text-lg">{caseData.title_cn}</p>}
        </div>

        {caseData.prompt_en && (
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h2 className="text-lg font-semibold mb-3">Prompt (EN)</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.prompt_en}</p>
          </div>
        )}
        {caseData.prompt_cn && (
          <div className="border border-border rounded-xl p-6 bg-white mb-4">
            <h2 className="text-lg font-semibold mb-3">题目（中文）</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.prompt_cn}</p>
          </div>
        )}
        {caseData.content && (
          <div className="border border-border rounded-xl p-6 bg-white">
            <h2 className="text-lg font-semibold mb-3">详细内容</h2>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.content}</div>
          </div>
        )}
      </div>
    );
  }

  // ====== Interactive Study Mode ======
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/casebook" className="text-primary text-sm hover:underline">
          &larr; 返回题库
        </Link>
        <button
          onClick={() => setShowFullMode(true)}
          className="text-xs text-muted hover:text-primary"
        >
          查看完整版
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1.5 mb-6">
        {(["prompt", "think", "framework", "analysis", "full"] as StudyPhase[]).map((p, i) => {
          const labels = ["题目", "思考", "框架", "分析", "总结"];
          const phaseOrder = ["prompt", "think", "framework", "analysis", "full"];
          const currentIdx = phaseOrder.indexOf(phase);
          const isActive = i <= currentIdx;
          return (
            <div key={p} className="flex items-center gap-1.5">
              <button
                onClick={() => i <= currentIdx && setPhase(p)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  p === phase
                    ? "bg-primary text-white"
                    : isActive
                    ? "bg-primary/10 text-primary cursor-pointer"
                    : "bg-gray-100 text-gray-400"
                }`}
                disabled={i > currentIdx}
              >
                {labels[i]}
              </button>
              {i < 4 && (
                <div className={`w-4 h-0.5 ${isActive && i < currentIdx ? "bg-primary" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Case header - always visible */}
      <div className="border border-border rounded-xl p-5 bg-white mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[caseData.type] || "bg-gray-100 text-gray-600"}`}>
            {caseData.type}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[caseData.difficulty] || "bg-gray-100 text-gray-600"}`}>
            {caseData.difficulty}
          </span>
          <span className="rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600">{caseData.industry}</span>
          {caseData.source && <span className="text-xs text-muted">{caseData.source}</span>}
        </div>
        <h1 className="text-xl font-bold mb-1">{caseData.title}</h1>
        {caseData.title_cn && <p className="text-muted text-sm">{caseData.title_cn}</p>}
      </div>

      {/* Phase: Prompt */}
      {phase === "prompt" && (
        <div className="space-y-4">
          {caseData.prompt_en && (
            <div className="border border-border rounded-xl p-6 bg-white">
              <h2 className="text-sm font-semibold text-muted mb-3">Case Prompt</h2>
              <p className="text-base leading-relaxed">{caseData.prompt_en}</p>
            </div>
          )}
          {caseData.prompt_cn && (
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-sm font-semibold text-blue-600 mb-3">中文翻译</h2>
              <p className="text-base leading-relaxed text-blue-900">{caseData.prompt_cn}</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              💡 <strong>先想一想：</strong>看完题目后，先在脑中/纸上想 2 分钟：你会用什么框架？从哪个角度切入？然后再继续。
            </p>
          </div>

          <button
            onClick={() => setPhase("think")}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            我想好了，下一步 →
          </button>
        </div>
      )}

      {/* Phase: Think - write your own framework */}
      {phase === "think" && (
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-6 bg-white">
            <h2 className="text-sm font-semibold mb-3">写下你的分析框架</h2>
            <p className="text-xs text-muted mb-4">
              在看参考答案之前，先写下你的思路。这一步是最有学习价值的。
            </p>
            <textarea
              value={myFramework}
              onChange={(e) => setMyFramework(e.target.value)}
              placeholder={"例如：\n\n一、收入端\n  - 价格 × 销量\n  - 分产品线/渠道分析\n\n二、成本端\n  - 固定成本\n  - 可变成本\n\n三、外部因素\n  - 竞争格局\n  - 市场趋势"}
              rows={10}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none font-mono leading-relaxed"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPhase("prompt")}
              className="flex-1 border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              ← 回看题目
            </button>
            <button
              onClick={() => setPhase("framework")}
              className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              查看参考框架 →
            </button>
          </div>
        </div>
      )}

      {/* Phase: Framework - show reference framework */}
      {phase === "framework" && (
        <div className="space-y-4">
          {/* Your answer vs reference */}
          {myFramework && (
            <div className="border border-border rounded-xl p-6 bg-white">
              <h2 className="text-sm font-semibold text-muted mb-3">你的框架</h2>
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">
                {myFramework}
              </pre>
            </div>
          )}

          {/* Issue Tree Image */}
          {sec.issue_tree_img && (
            <div className="border border-green-200 rounded-xl p-4 bg-green-50">
              <h2 className="text-sm font-semibold text-green-700 mb-3">Issue Tree</h2>
              <img src={sec.issue_tree_img} alt="Issue Tree" className="w-full rounded-lg" />
            </div>
          )}

          <div className="border border-green-200 rounded-xl p-6 bg-green-50">
            <h2 className="text-sm font-semibold text-green-700 mb-3">参考框架</h2>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-green-900">
              {sec.framework || caseData.content.split("\n\n")[0] || "暂无参考框架"}
            </div>
          </div>

          {sec.clarifying && (
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">澄清信息（面试官提供）</h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {sec.clarifying}
              </div>
            </div>
          )}

          {myFramework && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>对比一下：</strong>你的框架和参考框架有什么差异？漏了哪些维度？哪里可以更 MECE？
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setPhase("think")}
              className="flex-1 border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              ← 修改我的框架
            </button>
            <button
              onClick={() => setPhase("analysis")}
              className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              查看详细分析 →
            </button>
          </div>
        </div>
      )}

      {/* Phase: Analysis - detailed breakdown */}
      {phase === "analysis" && (
        <div className="space-y-4">
          {contentSections.map((section, i) => (
            <CollapsibleSection
              key={i}
              title={section.title}
              body={section.body}
              defaultOpen={i === 0}
              image={
                section.key === "exhibit1" ? sec.exhibit1_img :
                section.key === "exhibit2" ? sec.exhibit2_img :
                undefined
              }
            />
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setPhase("framework")}
              className="flex-1 border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50"
            >
              ← 回看框架
            </button>
            <button
              onClick={() => setPhase("full")}
              className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              总结 →
            </button>
          </div>
        </div>
      )}

      {/* Phase: Full - summary + actions */}
      {phase === "full" && (
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-6 bg-white">
            <h2 className="text-sm font-semibold mb-3">学习总结</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-lg">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800">这道 Case 的关键</p>
                  <p className="text-xs text-green-700 mt-1">
                    类型：{caseData.type} · 难度：{caseData.difficulty} · 行业：{caseData.industry}
                  </p>
                </div>
              </div>

              {caseData.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-1.5">涉及知识点</p>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.tags.map((tag) => (
                      <span key={tag} className="rounded-full px-2.5 py-0.5 text-xs bg-primary-light text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/partner"
              className="card-hover border border-border rounded-xl p-4 bg-white text-center"
            >
              <div className="text-2xl mb-1">🤝</div>
              <p className="text-sm font-medium">用这道题找人练</p>
              <p className="text-[10px] text-muted mt-0.5">匹配 Partner 一起练习</p>
            </Link>
            <button
              onClick={() => { setPhase("prompt"); setMyFramework(""); }}
              className="card-hover border border-border rounded-xl p-4 bg-white text-center"
            >
              <div className="text-2xl mb-1">🔄</div>
              <p className="text-sm font-medium">再做一遍</p>
              <p className="text-[10px] text-muted mt-0.5">重新写框架看看进步了没</p>
            </button>
          </div>

          <Link
            href="/casebook"
            className="block w-full text-center border border-border rounded-xl py-3 text-sm text-muted hover:bg-gray-50 transition-colors"
          >
            ← 回到题库选下一题
          </Link>
        </div>
      )}
    </div>
  );
}

// Collapsible section component
function CollapsibleSection({ title, body, defaultOpen, image }: { title: string; body: string; defaultOpen?: boolean; image?: string }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-left">{title}</h3>
        <span className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border">
          {image && (
            <img src={image} alt={title} className="w-full rounded-lg mt-3 mb-3" />
          )}
          <div className="text-sm leading-relaxed whitespace-pre-wrap pt-3">
            {body}
          </div>
        </div>
      )}
    </div>
  );
}
