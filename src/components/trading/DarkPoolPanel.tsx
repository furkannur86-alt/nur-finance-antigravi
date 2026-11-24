"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "prints" | "blocks" | "ats-volume" | "short-vol";

export default function DarkPoolPanel() {
  const [tab, setTab] = useState<Tab>("prints");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌑</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>DARK POOL MONITOR</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg ATS</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["prints", "blocks", "ats-volume", "short-vol"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "ats-volume" ? "ATS VOL" : t === "short-vol" ? "SHORT" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "prints" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATEST DARK POOL PRINTS</div>
            {[
              { time: "14:35:22", ticker: "NVDA", price: 142.85, size: 125000, value: "$17.9M", venue: "Sigma X", type: "Block" },
              { time: "14:34:58", ticker: "AAPL", price: 192.40, size: 85000, value: "$16.4M", venue: "POSIT", type: "Block" },
              { time: "14:34:15", ticker: "SPY", price: 592.20, size: 250000, value: "$148M", venue: "Crossfinder", type: "Sweep" },
              { time: "14:33:42", ticker: "TSLA", price: 345.50, size: 42000, value: "$14.5M", venue: "Instinet", type: "Block" },
              { time: "14:33:08", ticker: "MSFT", price: 428.80, size: 65000, value: "$27.9M", venue: "MS Pool", type: "Cross" },
              { time: "14:32:35", ticker: "META", price: 575.20, size: 38000, value: "$21.9M", venue: "Sigma X", type: "Block" },
              { time: "14:32:01", ticker: "AMZN", price: 198.50, size: 95000, value: "$18.9M", venue: "POSIT", type: "Block" },
              { time: "14:31:28", ticker: "GOOG", price: 175.80, size: 72000, value: "$12.7M", venue: "Crossfinder", type: "Block" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono text-[9px] w-16" style={{ color: "#64748b" }}>{p.time}</span>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{p.ticker}</span>
                <span className="font-mono w-16">${p.price}</span>
                <span className="font-mono w-16 text-right">{p.size.toLocaleString()}</span>
                <span className="font-mono w-14 text-right font-bold" style={{ color: "#fbbf24" }}>{p.value}</span>
                <span className="text-[8px] w-20 text-right" style={{ color: "#a855f7" }}>{p.venue}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>{p.type}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "blocks" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BLOCK TRADE SUMMARY — TODAY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Blocks", val: "1,248", color: "#00e5a0" },
                { label: "Total Value", val: "$42.5B", color: "#fbbf24" },
                { label: "Avg Size", val: "$34M", color: "#38bdf8" },
                { label: "vs 20D Avg", val: "+18%", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP BLOCK TRADE TICKERS</div>
            {[
              { ticker: "SPY", blocks: 185, value: "$8.2B", avgSize: "$44M", pctDark: 42 },
              { ticker: "NVDA", blocks: 95, value: "$3.5B", avgSize: "$37M", pctDark: 38 },
              { ticker: "QQQ", blocks: 72, value: "$2.8B", avgSize: "$39M", pctDark: 35 },
              { ticker: "AAPL", blocks: 68, value: "$1.8B", avgSize: "$26M", pctDark: 32 },
              { ticker: "TSLA", blocks: 55, value: "$1.5B", avgSize: "$27M", pctDark: 45 },
            ].map(b => (
              <div key={b.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{b.ticker}</span>
                <span className="font-mono w-10 text-right">{b.blocks}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#fbbf24" }}>{b.value}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{b.avgSize}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${b.pctDark}%`, background: "rgba(139,92,246,0.5)" }} />
                </div>
                <span className="font-mono w-10 text-right" style={{ color: "#8b5cf6" }}>{b.pctDark}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "ats-volume" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ATS MARKET SHARE — WEEKLY</div>
            {[
              { venue: "UBS ATS", share: 18.5, volume: "$42B", trades: "285K" },
              { venue: "Virtu/POSIT", share: 15.2, volume: "$34B", trades: "220K" },
              { venue: "GS Sigma X", share: 12.8, volume: "$29B", trades: "185K" },
              { venue: "MS Pool", share: 11.5, volume: "$26B", trades: "165K" },
              { venue: "JP Crossfinder", share: 10.2, volume: "$23B", trades: "148K" },
              { venue: "Citadel Connect", share: 8.5, volume: "$19B", trades: "125K" },
              { venue: "BIDS Trading", share: 7.8, volume: "$18B", trades: "95K" },
              { venue: "Others", share: 15.5, volume: "$35B", trades: "280K" },
            ].map(v => (
              <div key={v.venue} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{v.venue}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${v.share * 4}%`, background: "rgba(139,92,246,0.4)" }} />
                </div>
                <span className="font-mono w-12 text-right" style={{ color: "#8b5cf6" }}>{v.share}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{v.volume}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "short-vol" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SHORT VOLUME ANALYSIS</div>
            {[
              { ticker: "GME", shortVol: 68, totalVol: "45M", shortRatio: 8.5, daysToCover: 4.2, change: 5.2 },
              { ticker: "AMC", shortVol: 55, totalVol: "32M", shortRatio: 5.2, daysToCover: 3.5, change: -2.1 },
              { ticker: "TSLA", shortVol: 42, totalVol: "120M", shortRatio: 2.8, daysToCover: 1.2, change: 1.5 },
              { ticker: "NVDA", shortVol: 35, totalVol: "280M", shortRatio: 1.5, daysToCover: 0.8, change: -0.5 },
              { ticker: "AAPL", shortVol: 28, totalVol: "85M", shortRatio: 1.2, daysToCover: 0.5, change: 0.2 },
              { ticker: "SMCI", shortVol: 62, totalVol: "55M", shortRatio: 7.2, daysToCover: 3.8, change: 8.5 },
              { ticker: "MSTR", shortVol: 48, totalVol: "25M", shortRatio: 4.5, daysToCover: 2.5, change: -1.8 },
            ].map(s => (
              <div key={s.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.shortVol > 50 ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.1)",
                      color: s.shortVol > 50 ? "#ef4444" : "#64748b",
                    }}>{s.shortVol}% Short</span>
                  </div>
                  <span className="font-mono" style={{ color: s.change > 0 ? "#ef4444" : "#22c55e" }}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{s.totalVol}</span></div>
                  <div><span style={{ color: "#64748b" }}>SI Ratio:</span> <span className="font-mono">{s.shortRatio}x</span></div>
                  <div><span style={{ color: "#64748b" }}>DTC:</span> <span className="font-mono" style={{ color: s.daysToCover > 3 ? "#ef4444" : "#64748b" }}>{s.daysToCover}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
