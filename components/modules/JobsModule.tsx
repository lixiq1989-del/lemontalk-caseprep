"use client";

import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  link: string;
  tags: string[];
  description: string;
  region: string;
  source: string;
  created_at: string;
}

const typeColors: Record<string, string> = {
  "实习": "bg-blue-100 text-blue-700",
  "校招": "bg-green-100 text-green-700",
  "社招": "bg-purple-100 text-purple-700",
  "Internship": "bg-blue-100 text-blue-700",
  "Graduate": "bg-green-100 text-green-700",
  "Full-time": "bg-purple-100 text-purple-700",
};

const REGIONS = [
  { key: "all", label: "全部", emoji: "🌍" },
  { key: "CN", label: "国内", emoji: "🇨🇳" },
  { key: "UK", label: "英国", emoji: "🇬🇧" },
  { key: "US", label: "美国", emoji: "🇺🇸" },
  { key: "HK", label: "香港", emoji: "🇭🇰" },
  { key: "SG", label: "新加坡", emoji: "🇸🇬" },
];

const TYPE_FILTERS = ["全部", "实习/Internship", "校招/Graduate", "社招/Full-time"];

function daysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function matchType(jobType: string, filter: string): boolean {
  if (filter === "全部") return true;
  const parts = filter.split("/");
  return parts.some((p) => jobType === p);
}

interface JobsModuleProps {
  initialFilter?: string;
  initialRegion?: string;
}

export default function JobsModule({ initialFilter, initialRegion }: JobsModuleProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(initialFilter || "全部");
  const [regionFilter, setRegionFilter] = useState(initialRegion || "all");
  const [tab, setTab] = useState<"jobs" | "intel">("jobs");
  const [intel, setIntel] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/intel").then((r) => r.json()).catch(() => ({ intel: [] })),
    ]).then(([jobsData, intelData]) => {
      setJobs(jobsData.jobs || []);
      setIntel(intelData.intel || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const visible = jobs.filter((j) => {
    if (regionFilter !== "all" && j.region !== regionFilter) return false;
    if (!matchType(j.type, typeFilter)) return false;
    return true;
  });

  // Sort: non-expired first, then by deadline (soonest first)
  const sorted = [...visible].sort((a, b) => {
    const aExp = daysUntil(a.deadline) < 0;
    const bExp = daysUntil(b.deadline) < 0;
    if (aExp !== bExp) return aExp ? 1 : -1;
    return daysUntil(a.deadline) - daysUntil(b.deadline);
  });

  // Count per region
  const regionCounts: Record<string, number> = {};
  for (const j of jobs) {
    regionCounts[j.region] = (regionCounts[j.region] || 0) + 1;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">岗位信息</h1>
        <p className="text-muted text-sm mt-1">
          多国咨询/金融/战略岗位聚合，每日自动更新
        </p>
      </div>

      {/* Tab switch: Jobs vs Intel */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setTab("jobs")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "jobs" ? "bg-white text-[#051C2C] shadow-sm" : "text-muted"
          }`}
        >
          岗位列表
        </button>
        <button
          onClick={() => setTab("intel")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "intel" ? "bg-white text-[#051C2C] shadow-sm" : "text-muted"
          }`}
        >
          招聘情报 {intel.length > 0 && <span className="text-xs ml-1 bg-[#C4071B]/10 text-[#C4071B] px-1.5 py-0.5 rounded-full">{intel.length}</span>}
        </button>
      </div>

      {/* Region filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {REGIONS.map((r) => {
          const count = r.key === "all" ? jobs.length : (regionCounts[r.key] || 0);
          return (
            <button
              key={r.key}
              onClick={() => setRegionFilter(r.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                regionFilter === r.key
                  ? "bg-[#051C2C] text-white border-[#051C2C]"
                  : "bg-white text-gray-700 border-border hover:border-gray-400"
              }`}
            >
              <span>{r.emoji}</span>
              <span>{r.label}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  regionFilter === r.key ? "bg-white/20" : "bg-gray-100"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===== JOBS TAB ===== */}
      {tab === "jobs" && (
        <>
          {/* Type filter */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  typeFilter === f ? "bg-[#051C2C] text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted">加载中...</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-lg mb-2">暂无岗位</p>
              <p className="text-sm">该地区/类型暂无岗位，换个筛选条件试试</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((job) => {
            const days = daysUntil(job.deadline);
            const isExpired = days < 0;
            const regionInfo = REGIONS.find((r) => r.key === job.region);
            return (
              <div
                key={`${job.title}-${job.company}`}
                className={`border rounded-xl p-4 bg-white transition-all ${
                  isExpired ? "opacity-50 border-gray-200" : "border-border hover:border-[#051C2C]/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      {regionInfo && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-50 text-gray-600">
                          {regionInfo.emoji} {regionInfo.label}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[job.type] || "bg-gray-100 text-gray-700"}`}>
                        {job.type}
                      </span>
                      {!isExpired && days <= 7 && days >= 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          还剩{days}天
                        </span>
                      )}
                      {isExpired && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">已截止</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[15px] leading-snug">{job.title}</h3>
                    <p className="text-sm text-muted mt-0.5">{job.company} · {job.location}</p>
                    {job.description && (
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{job.description}</p>
                    )}
                  </div>
                  {!isExpired && job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-4 py-2 bg-[#051C2C] text-white rounded-lg text-sm font-medium hover:bg-[#0A2E4A] transition-colors"
                    >
                      投递
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {(job.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[11px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {job.source && (
                      <span className="text-[11px] text-gray-400 px-1">
                        via {job.source}
                      </span>
                    )}
                  </div>
                  {job.deadline && (
                    <span className="text-[11px] text-muted shrink-0">截止 {job.deadline}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* ===== INTEL TAB ===== */}
      {tab === "intel" && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-20 text-muted">加载中...</div>
          ) : intel.length === 0 ? (
            <div className="text-center py-20 text-muted">暂无情报</div>
          ) : (
            intel
              .filter((s) => regionFilter === "all" || s.region === regionFilter)
              .map((s, i) => {
                const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
                  job_posting: { label: "岗位发布", color: "bg-[#00836E]/10 text-[#00836E]", icon: "💼" },
                  hiring_news: { label: "招聘动态", color: "bg-[#2251FF]/10 text-[#2251FF]", icon: "📢" },
                  process_update: { label: "流程进度", color: "bg-[#E87722]/10 text-[#E87722]", icon: "🔔" },
                  timeline: { label: "时间线", color: "bg-[#E87722]/10 text-[#E87722]", icon: "📅" },
                  interview_exp: { label: "面试真题", color: "bg-[#007680]/10 text-[#007680]", icon: "🎤" },
                  referral: { label: "内推", color: "bg-[#C4071B]/10 text-[#C4071B]", icon: "🤝" },
                };
                const stageConfig: Record<string, { label: string; color: string }> = {
                  "网申开放": { label: "网申开放", color: "bg-[#2251FF]/10 text-[#2251FF]" },
                  "笔试中": { label: "笔试中", color: "bg-[#E87722]/10 text-[#E87722]" },
                  "一面": { label: "一面进行中", color: "bg-[#007680]/10 text-[#007680]" },
                  "二面": { label: "二面进行中", color: "bg-[#007680]/10 text-[#007680]" },
                  "终面": { label: "终面/Superday", color: "bg-[#C4071B]/10 text-[#C4071B]" },
                  "发offer": { label: "已发Offer", color: "bg-[#00836E]/10 text-[#00836E]" },
                  "已结束": { label: "已结束", color: "bg-gray-100 text-gray-500" },
                };
                const tc = typeConfig[s.type] || typeConfig.hiring_news;
                const regionInfo = REGIONS.find((r) => r.key === s.region);
                return (
                  <div key={i} className="border border-border rounded-xl p-4 bg-white hover:border-[#051C2C]/20 transition-all">
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <span className="text-sm">{tc.icon}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{tc.label}</span>
                      {s.process_stage && stageConfig[s.process_stage] && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${stageConfig[s.process_stage].color}`}>
                          {stageConfig[s.process_stage].label}
                        </span>
                      )}
                      {regionInfo && <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">{regionInfo.emoji} {regionInfo.label}</span>}
                      <span className="text-[11px] text-gray-400 ml-auto">via {s.source_platform}</span>
                    </div>
                    <div className="mb-1.5">
                      <span className="font-semibold text-sm text-[#051C2C]">{s.company}</span>
                      {s.role && s.role !== "未知" && <span className="text-sm text-muted"> · {s.role}</span>}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.content}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex flex-wrap gap-1">
                        {(s.tags || []).slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{s.created_at?.slice(0, 10)}</span>
                        {s.confidence && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            s.confidence >= 80 ? "bg-[#00836E]/10 text-[#00836E]" :
                            s.confidence >= 60 ? "bg-[#FFB81C]/10 text-[#9A6B00]" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            可信度 {s.confidence}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}
