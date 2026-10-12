"use client";

import { useMemo } from "react";

export default function MethodSplitDonut({ split = {} }) {
  const categories = useMemo(() => [
    { key: "upi", label: "UPI", color: "#3B82F6", count: split.upi?.count || 0, amount: split.upi?.amount || 0 },
    { key: "card", label: "Credit Cards", color: "#60A5FA", count: split.card?.count || 0, amount: split.card?.amount || 0 },
    { key: "netbanking", label: "Netbanking", color: "#1D4ED8", count: split.netbanking?.count || 0, amount: split.netbanking?.amount || 0 },
    { key: "other", label: "Others", color: "#93C5FD", count: split.other?.count || 0, amount: split.other?.amount || 0 },
  ], [split]);

  const totalCount = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.count, 0);
  }, [categories]);

  // Donut SVG circumference calculation
  const size = 100;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const slices = categories.map((c) => {
    const fraction = totalCount > 0 ? c.count / totalCount : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += fraction * circumference;
    return { ...c, strokeDasharray, strokeDashoffset, fraction };
  });

  return (
    <div className="flex items-center justify-between gap-2.5 sm:gap-6">
      {/* Legend list */}
      <div className="space-y-1.5 sm:space-y-2.5 flex-1 min-w-0">
        {categories.map((c) => {
          const pct = totalCount > 0 ? Math.round((c.count / totalCount) * 100) : 0;
          return (
            <div key={c.key} className="flex items-center justify-between text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 truncate mr-1.5">
                <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 font-medium truncate">{c.label}</span>
              </div>
              <div className="flex items-center gap-1 text-right shrink-0">
                <span className="font-semibold text-slate-800">{c.count}</span>
                {totalCount > 0 && (
                  <span className="text-[9px] text-slate-400 font-normal">({pct}%)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Donut */}
      <div className="relative shrink-0 flex items-center justify-center w-[84px] h-[84px] sm:w-[100px] sm:h-[100px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          {/* Base empty ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {totalCount > 0 && slices.map((s) => (
            <circle
              key={s.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={s.strokeDasharray}
              strokeDashoffset={s.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">{totalCount}</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider font-medium">Total</span>
        </div>
      </div>
    </div>
  );
}
