"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const COMPANIES = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", mktCap: "3.2T",
    epsEst: 2.35, epsAct: 2.41, revEst: 94.2, revAct: 95.8, surprise: 2.55,
    nextDate: "2027-01-28", analystCount: 42, revisions: { up: 8, down: 2, unchanged: 32 },
    history: [1.8, 2.1, 2.2, 2.35, 2.41], guidance: "RAISED" },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", mktCap: "2.9T",
    epsEst: 3.12, epsAct: 3.28, revEst: 65.4, revAct: 66.1, surprise: 5.13,
    nextDate: "2027-01-25", analystCount: 48, revisions: { up: 12, down: 1, unchanged: 35 },
    history: [2.5, 2.7, 2.95, 3.12, 3.28], guidance: "RAISED" },
  { ticker: "NVDA", name: "NVIDIA", sector: "Semiconductors", mktCap: "2.1T",
    epsEst: 0.88, epsAct: 1.02, revEst: 38.5, revAct: 42.1, surprise: 15.91,
    nextDate: "2027-02-19", analystCount: 55, revisions: { up: 22, down: 0, unchanged: 33 },
    history: [0.32, 0.47, 0.65, 0.88, 1.02], guidance: "RAISED" },
  { ticker: "AMZN", name: "Amazon", sector: "Consumer Disc.", mktCap: "1.8T",
    epsEst: 1.14, epsAct: 1.26, revEst: 155.0, revAct: 158.9, surprise: 10.53,
    nextDate: "2027-02-01", analystCount: 51, revisions: { up: 15, down: 3, unchanged: 33 },
    history: [0.65, 0.78, 0.94, 1.14, 1.26], guidance: "IN-LINE" },
  { ticker: "GOOGL", name: "Alphabet", sector: "Communication", mktCap: "1.7T",
    epsEst: 1.85, epsAct: 1.92, revEst: 86.3, revAct: 88.1, surprise: 3.78,
    nextDate: "2027-01-30", analystCount: 46, revisions: { up: 9, down: 4, unchanged: 33 },
    history: [1.44, 1.55, 1.72, 1.85, 1.92], guidance: "IN-LINE" },
  { ticker: "META", name: "Meta Platforms", sector: "Communication", mktCap: "1.4T",
    epsEst: 5.25, epsAct: 5.52, revEst: 40.1, revAct: 41.4, surprise: 5.14,
    nextDate: "2027-01-29", analystCount: 44, revisions: { up: 11, down: 2, unchanged: 31 },
    history: [3.88, 4.39, 4.85, 5.25, 5.52], guidance: "RAISED" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", mktCap: "580B",
    epsEst: 4.44, epsAct: 4.37, revEst: 42.5, revAct: 41.9, surprise: -1.58,
    nextDate: "2027-01-14", analystCount: 28, revisions: { up: 3, down: 6, unchanged: 19 },
    history: [3.57, 3.84, 4.11, 4.44, 4.37], guidance: "IN-LINE" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer Disc.", mktCap: "890B",
    epsEst: 0.74, epsAct: 0.62, revEst: 25.8, revAct: 24.3, surprise: -16.22,
    nextDate: "2027-01-29", analystCount: 39, revisions: { up: 4, down: 14, unchanged: 21 },
    history: [1.05, 0.85, 0.72, 0.74, 0.62], guidance: "LOWERED" },
];

const QUARTERS = ["Q1'26", "Q2'26", "Q3'26", "Q4'26E", "Q1'27E"];

type Tab = "overview" | "revisions" | "calendar" | "history";

export default function EarningsAnalysisPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const [sortBy, setSortBy] = useState<"surprise" | "ticker" | "nextDate">("surprise");

  const sorted = [...COMPANIES].sort((a, b) => {
    if (sortBy === "surprise") return Math.abs(b.surprise) - Math.abs(a.surprise);
    if (sortBy === "ticker") return a.ticker.localeCompare(b.ticker);
    return a.nextDate.localeCompare(b.nextDate);
  });

  const avgSurprise = COMPANIES.reduce((s, c) => s + c.surprise, 0) / COMPANIES.length;
  const beatCount = COMPANIES.filter(c => c.surprise > 0).length;
  const missCount = COMPANIES.filter(c => c.surprise < 0).length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>EARNINGS ANALYSIS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>Bloomberg EE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "revisions", "calendar", "history"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "AVG SURPRISE", value: `${avgSurprise > 0 ? "+" : ""}${avgSurprise.toFixed(2)}%`, color: avgSurprise > 0 ? "#22c55e" : "#ef4444" },
          { label: "BEAT", value: `${beatCount}/${COMPANIES.length}`, color: "#22c55e" },
          { label: "MISS", value: `${missCount}/${COMPANIES.length}`, color: "#ef4444" },
          { label: "COVERAGE", value: `${COMPANIES.reduce((s, c) => s + c.analystCount, 0)} analysts`, color: "#38bdf8" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <table className="w-full">
            <thead>
              <tr className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>
                <th className="text-left py-1 cursor-pointer" onClick={() => setSortBy("ticker")}>TICKER</th>
                <th className="text-right py-1">EPS EST</th>
                <th className="text-right py-1">EPS ACT</th>
                <th className="text-right py-1 cursor-pointer" onClick={() => setSortBy("surprise")}>SURPRISE</th>
                <th className="text-right py-1">REV ($B)</th>
                <th className="text-right py-1">GUIDANCE</th>
                <th className="text-right py-1 cursor-pointer" onClick={() => setSortBy("nextDate")}>NEXT RPT</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => (
                <tr key={c.ticker} className="border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-1.5">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                    <span className="ml-1.5 text-[9px]" style={{ color: "#64748b" }}>{c.name}</span>
                  </td>
                  <td className="text-right font-mono">${c.epsEst.toFixed(2)}</td>
                  <td className="text-right font-mono" style={{ color: c.epsAct >= c.epsEst ? "#22c55e" : "#ef4444" }}>
                    ${c.epsAct.toFixed(2)}
                  </td>
                  <td className="text-right font-mono font-bold" style={{ color: c.surprise > 0 ? "#22c55e" : "#ef4444" }}>
                    {c.surprise > 0 ? "+" : ""}{c.surprise.toFixed(2)}%
                  </td>
                  <td className="text-right font-mono">${c.revAct.toFixed(1)}B</td>
                  <td className="text-right">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{
                        background: c.guidance === "RAISED" ? "rgba(34,197,94,0.15)" : c.guidance === "LOWERED" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                        color: c.guidance === "RAISED" ? "#22c55e" : c.guidance === "LOWERED" ? "#ef4444" : "#94a3b8",
                      }}>
                      {c.guidance}
                    </span>
                  </td>
                  <td className="text-right font-mono" style={{ color: "#64748b" }}>{c.nextDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "revisions" && (
          <div className="space-y-2">
            {COMPANIES.map(c => (
              <div key={c.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker} <span style={{ color: "#64748b" }}>{c.name}</span></span>
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{c.analystCount} analysts</span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div style={{ width: `${(c.revisions.up / c.analystCount) * 100}%`, background: "#22c55e" }} />
                    <div style={{ width: `${(c.revisions.unchanged / c.analystCount) * 100}%`, background: "#64748b" }} />
                    <div style={{ width: `${(c.revisions.down / c.analystCount) * 100}%`, background: "#ef4444" }} />
                  </div>
                  <div className="flex gap-2 text-[9px]">
                    <span style={{ color: "#22c55e" }}>▲{c.revisions.up}</span>
                    <span style={{ color: "#64748b" }}>━{c.revisions.unchanged}</span>
                    <span style={{ color: "#ef4444" }}>▼{c.revisions.down}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calendar" && (
          <div className="space-y-1">
            {[...COMPANIES].sort((a, b) => a.nextDate.localeCompare(b.nextDate)).map(c => (
              <div key={c.ticker} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono text-[10px] w-20" style={{ color: "#38bdf8" }}>{c.nextDate}</span>
                <span className="font-bold w-14" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                <span className="flex-1" style={{ color: "#94a3b8" }}>{c.name}</span>
                <span className="text-[9px]" style={{ color: "#64748b" }}>{c.sector}</span>
                <span className="font-mono text-[9px]" style={{ color: "#fbbf24" }}>EPS Est: ${c.epsEst.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-3">
            {COMPANIES.slice(0, 5).map(c => (
              <div key={c.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                  <span style={{ color: "#64748b" }}>EPS Trend (5Q)</span>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {c.history.map((v, i) => {
                    const max = Math.max(...c.history);
                    const pct = (v / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <span className="text-[8px] font-mono" style={{ color: "#94a3b8" }}>${v.toFixed(2)}</span>
                        <div className="w-full rounded-t" style={{ height: `${pct}%`, background: i === c.history.length - 1 ? "#00e5a0" : "#1e3a5f", minHeight: 4 }} />
                        <span className="text-[7px]" style={{ color: "#475569" }}>{QUARTERS[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
