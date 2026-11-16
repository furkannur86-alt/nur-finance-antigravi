"use client";

import { useState, useEffect, useRef } from "react";
import DemoBadge from "../ui/DemoBadge";

interface DarkPoolEntry {
  ticker: string;
  name: string;
  atsVolume: number;
  marketVolume: number;
  darkPct: number;
  trend: "up" | "down" | "flat";
  unusual: boolean;
  history: number[];
}

const MOCK_DATA: DarkPoolEntry[] = [
  { ticker: "NVDA", name: "NVIDIA Corp", atsVolume: 42_800_000, marketVolume: 180_000_000, darkPct: 23.8, trend: "up", unusual: true, history: [18, 19, 20, 21, 20, 22, 23, 23, 22, 24, 23, 23.8] },
  { ticker: "AAPL", name: "Apple Inc", atsVolume: 38_500_000, marketVolume: 220_000_000, darkPct: 17.5, trend: "flat", unusual: false, history: [16, 17, 16, 17, 17, 18, 17, 17, 18, 17, 17, 17.5] },
  { ticker: "TSLA", name: "Tesla Inc", atsVolume: 55_200_000, marketVolume: 180_000_000, darkPct: 30.7, trend: "up", unusual: true, history: [22, 23, 25, 26, 27, 28, 28, 29, 30, 30, 31, 30.7] },
  { ticker: "SPY",  name: "SPDR S&P 500 ETF", atsVolume: 95_000_000, marketVolume: 410_000_000, darkPct: 23.2, trend: "flat", unusual: false, history: [22, 22, 23, 23, 22, 23, 23, 23, 23, 23, 23, 23.2] },
  { ticker: "MSFT", name: "Microsoft Corp", atsVolume: 29_100_000, marketVolume: 160_000_000, darkPct: 18.2, trend: "down", unusual: false, history: [20, 20, 19, 19, 18, 19, 19, 18, 18, 18, 18, 18.2] },
  { ticker: "META", name: "Meta Platforms", atsVolume: 18_700_000, marketVolume: 72_000_000, darkPct: 26.0, trend: "up", unusual: true, history: [18, 19, 20, 21, 22, 23, 23, 24, 25, 25, 26, 26.0] },
  { ticker: "AMZN", name: "Amazon.com Inc", atsVolume: 24_600_000, marketVolume: 130_000_000, darkPct: 18.9, trend: "flat", unusual: false, history: [18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 18.9] },
  { ticker: "GME",  name: "GameStop Corp", atsVolume: 8_900_000, marketVolume: 22_000_000, darkPct: 40.5, trend: "up", unusual: true, history: [25, 26, 28, 30, 32, 34, 35, 36, 38, 40, 40, 40.5] },
];

const WEEKS = ["W-11", "W-10", "W-9", "W-8", "W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "NOW"];

function sparkline(history: number[], width: number, height: number, unusual: boolean): string {
  const min = Math.min(...history) - 1;
  const max = Math.max(...history) + 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  });
  return pts.join(" ");
}

function fmt(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return `${(n / 1e3).toFixed(0)}K`;
}

export default function DarkPoolFlowPanel() {
  const [sortBy, setSortBy] = useState<"darkPct" | "atsVolume" | "ticker">("darkPct");
  const [filterUnusual, setFilterUnusual] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const data = [...MOCK_DATA]
    .filter(d => !filterUnusual || d.unusual)
    .sort((a, b) => {
      if (sortBy === "ticker") return a.ticker.localeCompare(b.ticker);
      if (sortBy === "atsVolume") return b.atsVolume - a.atsVolume;
      return b.darkPct - a.darkPct;
    });

  const unusualCount = MOCK_DATA.filter(d => d.unusual).length;
  const avgDarkPct = (MOCK_DATA.reduce((s, d) => s + d.darkPct, 0) / MOCK_DATA.length).toFixed(1);

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <div className="flex items-center gap-3">
          <span className="text-[#00c8ff] font-bold text-sm">DARK POOL FLOW</span>
          <DemoBadge />
          <span className="text-[10px] text-slate-500">12-WEEK TREND</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="text-slate-400">AVG DARK%: <span className="text-[#f59e0b] font-bold">{avgDarkPct}%</span></span>
          <span className="text-slate-400">UNUSUAL: <span className="text-red-400 font-bold">{unusualCount}</span></span>
          <div
            onClick={() => setFilterUnusual(v => !v)}
            className={`cursor-pointer px-2 py-0.5 rounded border text-[10px] font-bold transition-colors ${filterUnusual ? "border-red-400 text-red-400 bg-red-900/20" : "border-white/20 text-slate-500 hover:border-white/40"}`}
          >
            ⚠ UNUSUAL ONLY
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-px bg-white/5 border-b border-white/10">
        {[
          { label: "TOTAL ATS VOL", value: fmt(MOCK_DATA.reduce((s,d)=>s+d.atsVolume,0)), color: "#00c8ff" },
          { label: "TOTAL MKT VOL", value: fmt(MOCK_DATA.reduce((s,d)=>s+d.marketVolume,0)), color: "#94a3b8" },
          { label: "UNUSUAL ALERTS", value: `${unusualCount} / ${MOCK_DATA.length}`, color: "#ef4444" },
          { label: "AVG DARK SHARE", value: `${avgDarkPct}%`, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="bg-[#0a0c10] px-3 py-2">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            <div className="text-base font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#12151c] z-10">
            <tr>
              {[
                { key: "ticker", label: "TICKER" },
                { key: null, label: "COMPANY" },
                { key: "atsVolume", label: "ATS VOL" },
                { key: null, label: "MKT VOL" },
                { key: "darkPct", label: "DARK %" },
                { key: null, label: "12W TREND" },
                { key: null, label: "SIGNAL" },
              ].map(col => (
                <th
                  key={col.label}
                  className={`text-left px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 border-b border-white/10 whitespace-nowrap ${col.key ? "cursor-pointer hover:text-[#00c8ff]" : ""}`}
                  onClick={() => col.key && setSortBy(col.key as typeof sortBy)}
                >
                  {col.label} {col.key === sortBy ? "↓" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr
                key={row.ticker}
                className={`border-b border-white/5 transition-colors cursor-pointer ${hovered === row.ticker ? "bg-[#1a1f2e]" : "hover:bg-[#12151c]"} ${row.unusual ? "border-l-2 border-l-red-500/60" : ""}`}
                onMouseEnter={() => setHovered(row.ticker)}
                onMouseLeave={() => setHovered(null)}
              >
                <td className="px-3 py-2.5 font-bold text-[#00c8ff]">{row.ticker}</td>
                <td className="px-3 py-2.5 text-slate-300 max-w-[140px] truncate">{row.name}</td>
                <td className="px-3 py-2.5 text-white tabular-nums">{fmt(row.atsVolume)}</td>
                <td className="px-3 py-2.5 text-slate-400 tabular-nums">{fmt(row.marketVolume)}</td>
                <td className="px-3 py-2.5 font-bold tabular-nums" style={{
                  color: row.darkPct > 30 ? "#ef4444" : row.darkPct > 22 ? "#f59e0b" : "#10b981"
                }}>
                  {row.darkPct.toFixed(1)}%
                </td>
                <td className="px-3 py-2.5">
                  <svg width="80" height="24" viewBox="0 0 80 24">
                    <polyline
                      points={sparkline(row.history, 80, 24, row.unusual)}
                      fill="none"
                      stroke={row.unusual ? "#ef4444" : "#00c8ff"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />
                  </svg>
                </td>
                <td className="px-3 py-2.5">
                  {row.unusual ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-900/40 border border-red-500/40 text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      UNUSUAL
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800/40 border border-white/10 text-slate-500">
                      {row.trend === "up" ? "▲" : row.trend === "down" ? "▼" : "—"} NORMAL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 text-[9px] text-slate-600 flex justify-between">
        <span>DEMO DATA · MOCK MODE</span>
        <span>UNUSUAL = &gt;2σ DEVIATION FROM 12-WEEK MEAN</span>
      </div>
    </div>
  );
}
