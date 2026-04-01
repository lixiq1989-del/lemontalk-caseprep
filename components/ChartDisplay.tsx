"use client";

// Inline chart renderer for drill questions
// Supports: bar, horizontal_bar, line, pie, stacked_bar, waterfall, bubble

export interface ChartData {
  type: "bar" | "horizontal_bar" | "line" | "pie" | "stacked_bar" | "waterfall" | "bubble";
  title?: string;
  xLabel?: string;
  yLabel?: string;
  unit?: string;
  categories?: string[];
  // For bar/line/horizontal_bar
  values?: number[];
  // For multi-series (stacked_bar, multi-line)
  series?: { name: string; values: number[]; color?: string }[];
  // For pie
  segments?: { label: string; value: number; color?: string }[];
  // For waterfall
  waterfall?: { label: string; value: number; type: "increase" | "decrease" | "total" }[];
  // For bubble
  bubbles?: { label: string; x: number; y: number; size: number }[];
}

// McKinsey color palette
const COLORS = [
  "#051C2C", // McKinsey navy
  "#2251FF", // McKinsey blue
  "#00A9F4", // Light blue
  "#007680", // Teal
  "#00836E", // Green
  "#FFB81C", // Gold
  "#E87722", // Orange
  "#C4071B", // Red
  "#6B7A88", // Gray
  "#B1C9E8", // Pale blue
];

const PIE_COLORS = [
  "#051C2C", "#2251FF", "#00A9F4", "#007680",
  "#00836E", "#FFB81C", "#E87722", "#C4071B",
];

export default function ChartDisplay({ data }: { data: ChartData }) {
  const { type } = data;

  if (type === "bar") return <BarChart data={data} />;
  if (type === "horizontal_bar") return <HorizontalBarChart data={data} />;
  if (type === "line") return <LineChart data={data} />;
  if (type === "pie") return <PieChart data={data} />;
  if (type === "stacked_bar") return <StackedBarChart data={data} />;
  if (type === "waterfall") return <WaterfallChart data={data} />;
  if (type === "bubble") return <BubbleChart data={data} />;
  return null;
}

function BarChart({ data }: { data: ChartData }) {
  const values = data.values || [];
  const max = Math.max(...values, 1);

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <div className="flex items-end gap-2 h-40">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="text-[10px] font-mono font-semibold text-gray-700 mb-1">
              {v}{data.unit || ""}
            </div>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{
                height: `${(v / max) * 100}%`,
                backgroundColor: COLORS[i % COLORS.length],
                minHeight: "4px",
              }}
            />
            <div className="text-[10px] text-gray-500 mt-1.5 text-center leading-tight truncate w-full">
              {(data.categories || [])[i]}
            </div>
          </div>
        ))}
      </div>
      {(data.xLabel || data.yLabel) && (
        <div className="flex justify-between mt-2">
          {data.yLabel && <span className="text-[9px] text-gray-400">{data.yLabel}</span>}
          {data.xLabel && <span className="text-[9px] text-gray-400 ml-auto">{data.xLabel}</span>}
        </div>
      )}
    </div>
  );
}

function HorizontalBarChart({ data }: { data: ChartData }) {
  const values = data.values || [];
  const max = Math.max(...values, 1);

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="text-[10px] text-gray-600 w-16 text-right truncate">{(data.categories || [])[i]}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-5 relative">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(v / max) * 100}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                  minWidth: "8px",
                }}
              />
            </div>
            <div className="text-[10px] font-mono font-semibold text-gray-700 w-12">
              {v}{data.unit || ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }: { data: ChartData }) {
  const allSeries = data.series || (data.values ? [{ name: "", values: data.values }] : []);
  const allValues = allSeries.flatMap((s) => s.values);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const W = 280;
  const H = 120;
  const pad = { top: 10, right: 10, bottom: 20, left: 10 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={pad.left}
            y1={pad.top + plotH * (1 - pct)}
            x2={W - pad.right}
            y2={pad.top + plotH * (1 - pct)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}
        {/* Lines */}
        {allSeries.map((s, si) => {
          const points = s.values
            .map((v, i) => {
              const x = pad.left + (i / (s.values.length - 1 || 1)) * plotW;
              const y = pad.top + plotH - ((v - min) / range) * plotH;
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <g key={si}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color || COLORS[si % COLORS.length]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => {
                const x = pad.left + (i / (s.values.length - 1 || 1)) * plotW;
                const y = pad.top + plotH - ((v - min) / range) * plotH;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3" fill={s.color || COLORS[si % COLORS.length]} />
                    <text x={x} y={y - 6} textAnchor="middle" fontSize="7" fill="#374151" fontWeight="600">
                      {v}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* X labels */}
        {(data.categories || []).map((cat, i) => {
          const x = pad.left + (i / ((data.categories || []).length - 1 || 1)) * plotW;
          return (
            <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="7" fill="#9ca3af">
              {cat}
            </text>
          );
        })}
      </svg>
      {/* Legend */}
      {allSeries.length > 1 && (
        <div className="flex gap-3 justify-center mt-2">
          {allSeries.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color || COLORS[i % COLORS.length] }} />
              <span className="text-[10px] text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PieChart({ data }: { data: ChartData }) {
  const segments = data.segments || [];
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const R = 50;
  const CX = 70;
  const CY = 60;

  let cumAngle = -Math.PI / 2;
  const arcs = segments.map((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    return {
      d: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: seg.color || PIE_COLORS[i % PIE_COLORS.length],
      pct: Math.round((seg.value / total) * 100),
      label: seg.label,
    };
  });

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 140 120" className="w-32 h-28 flex-shrink-0">
          {arcs.map((arc, i) => (
            <path key={i} d={arc.d} fill={arc.color} stroke="white" strokeWidth="1" />
          ))}
        </svg>
        <div className="space-y-1.5">
          {arcs.map((arc, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: arc.color }} />
              <span className="text-[10px] text-gray-600">{arc.label}</span>
              <span className="text-[10px] font-semibold text-gray-800">{arc.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackedBarChart({ data }: { data: ChartData }) {
  const series = data.series || [];
  if (series.length === 0) return null;
  const cats = data.categories || [];
  const totals = cats.map((_, ci) => series.reduce((sum, s) => sum + (s.values[ci] || 0), 0));
  const maxTotal = Math.max(...totals, 1);

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <div className="flex items-end gap-2 h-40">
        {cats.map((cat, ci) => (
          <div key={ci} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="text-[10px] font-mono font-semibold text-gray-700 mb-1">
              {totals[ci]}{data.unit || ""}
            </div>
            <div
              className="w-full rounded-t-md overflow-hidden flex flex-col-reverse"
              style={{ height: `${(totals[ci] / maxTotal) * 100}%`, minHeight: "4px" }}
            >
              {series.map((s, si) => {
                const pct = totals[ci] > 0 ? (s.values[ci] / totals[ci]) * 100 : 0;
                return (
                  <div
                    key={si}
                    style={{
                      height: `${pct}%`,
                      backgroundColor: s.color || COLORS[si % COLORS.length],
                    }}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-gray-500 mt-1.5 text-center leading-tight truncate w-full">
              {cat}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center mt-3">
        {series.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color || COLORS[i % COLORS.length] }} />
            <span className="text-[10px] text-gray-600">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WaterfallChart({ data }: { data: ChartData }) {
  const items = data.waterfall || [];
  if (items.length === 0) return null;

  // Calculate cumulative positions
  let running = 0;
  const bars = items.map((item) => {
    if (item.type === "total") {
      const bar = { ...item, start: 0, end: running, height: running };
      return bar;
    }
    const start = running;
    running += item.value;
    return { ...item, start, end: running, height: item.value };
  });
  const allEnds = bars.map((b) => Math.max(b.start, b.end));
  const allStarts = bars.map((b) => Math.min(b.start, b.end));
  const maxVal = Math.max(...allEnds, 1);
  const minVal = Math.min(...allStarts, 0);
  const range = maxVal - minVal || 1;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <div className="flex items-end gap-1.5 h-40">
        {bars.map((bar, i) => {
          const bottom = ((Math.min(bar.start, bar.end) - minVal) / range) * 100;
          const height = (Math.abs(bar.height) / range) * 100;
          const color = bar.type === "total" ? "#051C2C" : bar.value >= 0 ? "#00836E" : "#C4071B";
          return (
            <div key={i} className="flex-1 flex flex-col items-center h-full relative">
              <div className="absolute w-full" style={{ bottom: `${bottom}%`, height: `${Math.max(height, 2)}%` }}>
                <div className="text-[9px] font-mono font-semibold text-gray-700 text-center -mt-3.5">
                  {bar.value >= 0 ? "+" : ""}{bar.value}{data.unit || ""}
                </div>
                <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }} />
              </div>
              <div className="absolute bottom-0 text-[9px] text-gray-500 text-center leading-tight w-full" style={{ transform: "translateY(100%)", paddingTop: "4px" }}>
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-4" /> {/* spacing for labels */}
    </div>
  );
}

function BubbleChart({ data }: { data: ChartData }) {
  const bubbles = data.bubbles || [];
  if (bubbles.length === 0) return null;

  const maxX = Math.max(...bubbles.map((b) => b.x), 1);
  const maxY = Math.max(...bubbles.map((b) => b.y), 1);
  const maxSize = Math.max(...bubbles.map((b) => b.size), 1);

  const W = 280;
  const H = 140;
  const pad = { top: 15, right: 15, bottom: 25, left: 15 };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      {data.title && <div className="text-xs font-semibold text-gray-600 mb-3">{data.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line key={`h${pct}`} x1={pad.left} y1={pad.top + (H - pad.top - pad.bottom) * (1 - pct)} x2={W - pad.right} y2={pad.top + (H - pad.top - pad.bottom) * (1 - pct)} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {/* Bubbles */}
        {bubbles.map((b, i) => {
          const x = pad.left + (b.x / maxX) * (W - pad.left - pad.right);
          const y = pad.top + (1 - b.y / maxY) * (H - pad.top - pad.bottom);
          const r = 6 + (b.size / maxSize) * 18;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={COLORS[i % COLORS.length]} opacity={0.6} />
              <text x={x} y={y + 2} textAnchor="middle" fontSize="6" fill="#1f2937" fontWeight="600">
                {b.label}
              </text>
            </g>
          );
        })}
        {/* Axis labels */}
        {data.xLabel && (
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="7" fill="#9ca3af">{data.xLabel}</text>
        )}
        {data.yLabel && (
          <text x={4} y={H / 2} textAnchor="middle" fontSize="7" fill="#9ca3af" transform={`rotate(-90, 4, ${H / 2})`}>{data.yLabel}</text>
        )}
      </svg>
    </div>
  );
}
