"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
};

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id;
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/casebook" className="text-primary text-sm hover:underline mb-4 inline-block">
        &larr; 返回题库
      </Link>

      <div className="border border-border rounded-xl p-6 bg-white mb-6">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              typeColors[caseData.type] || "bg-gray-100 text-gray-600"
            }`}
          >
            {caseData.type}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              difficultyColors[caseData.difficulty] || "bg-gray-100 text-gray-600"
            }`}
          >
            {caseData.difficulty}
          </span>
          <span className="rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600">
            {caseData.industry}
          </span>
          {caseData.source && (
            <span className="text-xs text-muted">来源: {caseData.source}</span>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-1">{caseData.title}</h1>
        {caseData.title_cn && (
          <p className="text-muted text-lg mb-6">{caseData.title_cn}</p>
        )}

        {caseData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {caseData.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-xs bg-primary-light text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* English Prompt */}
      {caseData.prompt_en && (
        <div className="border border-border rounded-xl p-6 bg-white mb-6">
          <h2 className="text-lg font-semibold mb-3">Case Prompt (English)</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.prompt_en}</p>
        </div>
      )}

      {/* Chinese Prompt */}
      {caseData.prompt_cn && (
        <div className="border border-border rounded-xl p-6 bg-white mb-6">
          <h2 className="text-lg font-semibold mb-3">Case 题目（中文）</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.prompt_cn}</p>
        </div>
      )}

      {/* Additional Content */}
      {caseData.content && (
        <div className="border border-border rounded-xl p-6 bg-white">
          <h2 className="text-lg font-semibold mb-3">详细内容</h2>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.content}</div>
        </div>
      )}
    </div>
  );
}
