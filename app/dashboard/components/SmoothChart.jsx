"use client";

import { useState, useMemo } from "react";

export default function SmoothChart({ data = [], activeTab = "Collected Amount", height = 200 }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const isCountTab = activeTab === "Orders";

  // Normalize points and resolve plotValue based on tab
  const points = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { label: "1", amount: 0, count: 0 },
        { label: "2", amount: 0, count: 0 },
        { label: "3", amount: 0, count: 0 },
        { label: "4", amount: 0, count: 0 },
        { label: "5", amount: 0, count: 0 }
      ];
    }
    return data;
  }, [data]);

  const maxVal = useMemo(() => {
    const highest = Math.max(
      ...points.map((p) => (isCountTab ? (p.count || 0) : (p.amount || 0))),
      0
    );
    if (highest === 0) return isCountTab ? 5 : 100;
    // Round up to nearest clean ceiling
    const magnitude = Math.pow(10, Math.max(0, Math.floor(Math.log10(highest))));
    return Math.ceil(highest / magnitude) * magnitude || (isCountTab ? 5 : 100);
  }, [points, isCountTab]);

  // Width & height calculation
  const width = 1000;
  const paddingX = 52;
  const paddingY = 24;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Compute coordinate array
  const coords = useMemo(() => {
    const len = points.length;
    if (len === 1) {
      const val = isCountTab ? (points[0].count || 0) : (points[0].amount || 0);
      return [{ x: width / 2, y: height - paddingY - (val / maxVal) * chartHeight, ...points[0] }];
    }
    return points.map((p, idx) => {
      const val = isCountTab ? (p.count || 0) : (p.amount || 0);
      const x = paddingX + (idx / (len - 1)) * chartWidth;
      const y = height - paddingY - (val / maxVal) * chartHeight;
      return { x, y, ...p };
    });
  }, [points, maxVal, width, height, chartWidth, chartHeight, paddingX, paddingY, isCountTab]);

  // Cubic Bezier curve path generator
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length === 0) return { linePath: "", areaPath: "" };
    if (coords.length === 1) {
      const pt = coords[0];
      return {
        linePath: `M ${pt.x - 10} ${pt.y} L ${pt.x + 10} ${pt.y}`,
        areaPath: `M ${pt.x - 10} ${pt.y} L ${pt.x + 10} ${pt.y} L ${pt.x + 10} ${height - paddingY} L ${pt.x - 10} ${height - paddingY} Z`
      };
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      // Catmull-Rom to Cubic Bezier control points
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const bottomY = height - paddingY;
    const area = `${d} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    return { linePath: d, areaPath: area };
  }, [coords, height, paddingY]);

  // Format axis metric
  const formatAmt = (val) => {
    if (isCountTab) return `${val}`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-Axis Horizontal Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = height - paddingY - pct * chartHeight;
          const val = Math.round(pct * maxVal);
          return (
            <g key={pct}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray={pct === 0 ? "none" : "3 3"}
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                className="fill-slate-400 font-sans"
              >
                {formatAmt(val)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Curved Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & Interactive Hover/Touch Hitboxes */}
        {coords.map((pt, idx) => {
          const isHovered = hoverIndex === idx;
          return (
            <g
              key={idx}
              className="cursor-pointer"
              onTouchStart={() => setHoverIndex(idx)}
            >
              {/* Invisible hit area for fingers / cursor */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="20"
                fill="transparent"
                onMouseEnter={() => setHoverIndex(idx)}
              />

              {/* Point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "4.5" : "2.75"}
                fill={isHovered ? "#2563eb" : "#ffffff"}
                stroke="#2563eb"
                strokeWidth={isHovered ? "2" : "1.75"}
                className="transition-all duration-150"
              />

              {/* X-axis label */}
              {(coords.length <= 8 || idx % Math.ceil(coords.length / 7) === 0 || idx === coords.length - 1) && (
                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-slate-400 font-sans"
                >
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Active Hover Guide Line */}
        {hoverIndex !== null && coords[hoverIndex] && (
          <g pointerEvents="none">
            <line
              x1={coords[hoverIndex].x}
              y1={paddingY}
              x2={coords[hoverIndex].x}
              y2={height - paddingY}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </g>
        )}
      </svg>

      {/* Floating HTML Tooltip with edge-clamping */}
      {hoverIndex !== null && coords[hoverIndex] && (() => {
        const xPct = (coords[hoverIndex].x / width) * 100;
        const clampedLeft = Math.max(10, Math.min(90, xPct));
        const transformClass = xPct < 20
          ? "translate-x-0 -translate-y-full"
          : xPct > 80
          ? "-translate-x-full -translate-y-full"
          : "-translate-x-1/2 -translate-y-full";

        return (
          <div
            className={`absolute z-20 pointer-events-none transform ${transformClass} mb-2 bg-slate-900 text-white rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs shadow-xl border border-slate-700 whitespace-nowrap`}
            style={{
              left: `${clampedLeft}%`,
              top: `${Math.max(10, (coords[hoverIndex].y / height) * 100)}%`,
            }}
          >
            <div className="font-medium text-slate-300 text-[9px] sm:text-[10px]">{coords[hoverIndex].label}</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">
              {isCountTab 
                ? `${coords[hoverIndex].count || 0} order${coords[hoverIndex].count === 1 ? "" : "s"}` 
                : `₹${(coords[hoverIndex].amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            </div>
            {!isCountTab && coords[hoverIndex].count !== undefined && (
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                {coords[hoverIndex].count} payment{coords[hoverIndex].count === 1 ? "" : "s"}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
