"use client";

import { useState, useEffect } from "react";
import DemoBadge from "../ui/DemoBadge";

interface OptionsFlowEntry {
  id: string;
  ticker: string;
  strike: number;
  expiry: string;
  type: "call" | "put";
  volume: number;
  oi: number;
  premium: number;
  unusual: boolean;
  sentiment: "bullish" | "bearish" | "neutral";
}

interface SectorActivity {
  sector: string;
  callVolume: number;
  putVolume: number;
  pcRatio: number;
}

const MOCK_FLOW: OptionsFlowEntry[] = [
  { id: "1", ticker: "NVDA", strike: 850, expiry: "2026-01-16", type: "call", volume: 42500, oi: 185000, premium: 38_250_000, unusual: true, sentiment: "bullish" },
  { id: "2", ticker: "SPY",  strike: 440, expiry: "2025-12-19", type: "put",  volume: 88000, oi: 320000, premium: 44_000_000, unusual: false, sentiment: "bearish" },
  { id: "3", ticker: "TSLA", strike: 220, expiry: "2026-02-20", type: "call", volume: 31200, oi: 95000,  premium: 15_600_000, unusual: true, sentiment: "bullish" },
  { id: "4", ticker: "AAPL", strike: 195, expiry: "2025-11-21", type: "call", volume: 24100, oi: 78000,  premium: 7_712_000, unusual: false, sentiment: "neutral" },
  { id: "5", ticker: "META", strike: 500, expiry: "2026-01-16", type: "call", volume: 18800, oi: 42000,  premium: 28_200_000, unusual: true, sentiment: "bullish" },
  { id: "6", ticker: "QQQ",  strike: 370, expiry: "2025-12-19", type: "put",  volume: 55000, oi: 210000, premium: 27_500_000, unusual: false, sentiment: "bearish" },
  { id: "7", ticker: "AMZN", strike: 185, expiry: "2026-03-20", type: "call", volume: 15400, oi: 38000,  premium: 12_320_000, unusual: false, sentiment: "bullish" },
  { id: "8", ticker: "GME",  strike: 15,  expiry: "2025-11-21", type: "call", volume: 68000, oi: 32000,  premium: 4_080_000, unusual: true, sentiment: "bullish" },
  { id: "9", ticker: "MSFT", strike: 420, expiry: "2026-01-16", type: "call", volume: 11200, oi: 29000,  premium: 16_800_000, unusual: false, sentiment: "neutral" },
  { id: "10", ticker: "IWM", strike: 190, expiry: "2025-12-19", type: "put",  volume: 42000, oi: 165000, premium: 8_400_000, unusual: false, sentiment: "bearish" },
];

const SECTOR_ACTIVITY: SectorActivity[] = [
  { sector: "Technology", callVolume: 142800, putVolume: 48200, pcRatio: 0.34 },
  { sector: "Consumer Cyclical", callVolume: 99200, putVolume: 72100, pcRatio: 0.73 },
  { sector: "ETF (Index)", callVolume: 55000, putVolume: 185000, pcRatio: 3.36 },
  { sector: "Communication", callVolume: 18800, putVolume: 4100, pcRatio: 0.22 },
  { sector: "Consumer Defensive", callVolume: 24100, putVolume: 11400, pcRatio: 0.47 },
];

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  return `$${(n/1e3).toFixed(0)}K`;
}

function fmtVol(n: number): string {
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`;
  return String(n);
}

export default function OptionsFlowPanel() {
  const [filter, setFilter] = useState<"all" | "call" | "put" | "unusual">("all");
  const [sortBy, setSortBy] = useState<"premium" | "volume" | "ticker">("premium");
  const [pcRatio, setPcRatio] = useState(0);

  useEffect(() => {
    const totalCall = MOCK_FLOW.filter(f => f.type === "call").reduce((s, f) => s + f.volume, 0);
    const totalPut = MOCK_FLOW.filter(f => f.type === "put").reduce((s, f) => s + f.volume, 0);
    setPcRatio(totalPut / totalCall);
  }, []);

  const filtered = MOCK_FLOW
    .filter(f => {
      if (filter === "call") return f.type === "call";
      if (filter === "put") return f.type === "put";
      if (filter === "unusual") return f.unusual;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "ticker") return a.ticker.localeCompare(b.ticker);
      if (sortBy === "volume") return b.volume - a.volume;
      return b.premium - a.premium;
    });

  const totalPremium = MOCK_FLOW.reduce((s, f) => s + f.premium, 0);
  const unusualCount = MOCK_FLOW.filter(f => f.unusual).length;

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <div className="flex items-center gap-2">
          <span className="text-[#00c8ff] font-bold text-sm">OPTIONS FLOW</span>
          <DemoBadge />
        </div>
        <span className="text-[10px] text-slate-500">UNUSUAL ACTIVITY</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-white/5 border-b border-white/10">
        {[
          { label: "TOTAL PREMIUM", value: fmt(totalPremium), color: "#00c8ff" },
          { label: "PUT/CALL RATIO", value: pcRatio.toFixed(2), color: pcRatio > 1 ? "#ef4444" : "#10b981" },
          { label: "UNUSUAL ALERTS", value: `${unusualCount}`, color: "#f59e0b" },
          { label: "ACTIVE TICKERS", value: String(new Set(MOCK_FLOW.map(f=>f.ticker)).size), color: "#94a3b8" },
        ].map(s => (
          <div key={s.label} className="bg-[#0a0c10] px-3 py-2">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            <div className="text-base font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Put/Call ratio bar */}
      <div className="px-4 py-2 border-b border-white/10 bg-[#0d1016]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 w-24">P/C SENTIMENT</span>
          <div className="flex-1 flex h-3 rounded-full overflow-hidden">
            {(() => {
              const totalC = MOCK_FLOW.filter(f=>f.type==="call").reduce((s,f)=>s+f.volume,0);
              const totalP = MOCK_FLOW.filter(f=>f.type==="put").reduce((s,f)=>s+f.volume,0);
              const total = totalC + totalP;
              const callPct = (totalC/total)*100;
              return (
                <>
                  <div style={{ width: `${callPct}%` }} className="bg-emerald-500/70 transition-all" />
                  <div style={{ width: `${100-callPct}%` }} className="bg-red-500/70 transition-all" />
                </>
              );
            })()}
          </div>
          <span className="text-[10px] text-emerald-400 w-10 text-right">CALL</span>
          <span className="text-[10px] text-red-400 w-10">PUT</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-white/10">
        {(["all", "call", "put", "unusual"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${filter === f ? "bg-[#00c8ff] text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
        <div className="flex-1" />
        {(["premium", "volume", "ticker"] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-2 py-1 rounded text-[10px] transition-colors ${sortBy === s ? "text-[#00c8ff] border-b border-[#00c8ff]" : "text-slate-500 hover:text-slate-300"}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Flow table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#12151c] z-10">
            <tr>
              {["TICKER", "TYPE", "STRIKE", "EXPIRY", "VOLUME", "OI", "PREMIUM", "FLAG"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 border-b border-white/10 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className={`border-b border-white/5 hover:bg-[#12151c] transition-colors ${row.unusual ? "border-l-2 border-l-amber-500/60" : ""}`}>
                <td className="px-3 py-2 font-bold text-[#00c8ff]">{row.ticker}</td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${row.type === "call" ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30" : "bg-red-900/40 text-red-400 border border-red-500/30"}`}>
                    {row.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums">${row.strike}</td>
                <td className="px-3 py-2 text-slate-400 tabular-nums">{row.expiry}</td>
                <td className="px-3 py-2 tabular-nums">{fmtVol(row.volume)}</td>
                <td className="px-3 py-2 tabular-nums text-slate-400">{fmtVol(row.oi)}</td>
                <td className="px-3 py-2 font-bold tabular-nums text-[#f59e0b]">{fmt(row.premium)}</td>
                <td className="px-3 py-2">
                  {row.unusual ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-900/40 border border-amber-500/40 text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      UNUSUAL
                    </span>
                  ) : <span className="text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sector activity */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">SECTOR OPTION ACTIVITY</div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {SECTOR_ACTIVITY.map(s => (
            <div key={s.sector} className="flex-shrink-0 bg-[#12151c] border border-white/10 rounded px-2.5 py-1.5 min-w-[110px]">
              <div className="text-[9px] text-slate-500 truncate">{s.sector}</div>
              <div className="text-[10px] font-bold" style={{ color: s.pcRatio < 0.5 ? "#10b981" : s.pcRatio > 1 ? "#ef4444" : "#f59e0b" }}>
                P/C: {s.pcRatio.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
