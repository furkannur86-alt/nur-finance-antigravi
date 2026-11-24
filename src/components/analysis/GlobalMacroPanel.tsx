"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "dashboard" | "themes" | "trade-ideas" | "calendar";

export default function GlobalMacroPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌐</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>GLOBAL MACRO STRATEGY</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg MACRO</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["dashboard", "themes", "trade-ideas", "calendar"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "trade-ideas" ? "TRADES" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "dashboard" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL MACRO SCORECARD</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { region: "🇺🇸 United States", growth: "Above trend", inflation: "Cooling", policy: "Easing cycle", risk: "Medium", color: "#22c55e" },
                { region: "🇪🇺 Eurozone", growth: "Below trend", inflation: "At target", policy: "Easing cycle", risk: "High", color: "#fbbf24" },
                { region: "🇨🇳 China", growth: "Slowing", inflation: "Deflation risk", policy: "Stimulus", risk: "High", color: "#ef4444" },
                { region: "🇯🇵 Japan", growth: "Recovery", inflation: "Normalizing", policy: "Tightening", risk: "Medium", color: "#38bdf8" },
              ].map(r => (
                <div key={r.region} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${r.color}22` }}>
                  <div className="font-bold mb-1" style={{ color: r.color }}>{r.region}</div>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <div><span style={{ color: "#64748b" }}>Growth:</span> <span>{r.growth}</span></div>
                    <div><span style={{ color: "#64748b" }}>Inflation:</span> <span>{r.inflation}</span></div>
                    <div><span style={{ color: "#64748b" }}>Policy:</span> <span>{r.policy}</span></div>
                    <div><span style={{ color: "#64748b" }}>Risk:</span> <span style={{ color: r.risk === "High" ? "#ef4444" : "#fbbf24" }}>{r.risk}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CROSS-ASSET PERFORMANCE (MTD %)</div>
            {[
              { asset: "S&P 500", ret: 2.8, class: "Equity" },
              { asset: "Euro Stoxx 50", ret: 1.5, class: "Equity" },
              { asset: "UST 10Y (price)", ret: -0.8, class: "Rates" },
              { asset: "Gold", ret: 3.2, class: "Commodity" },
              { asset: "WTI Crude", ret: -2.5, class: "Commodity" },
              { asset: "DXY Index", ret: 0.5, class: "FX" },
              { asset: "EM FX (EMFX)", ret: -0.3, class: "FX" },
              { asset: "HY CDX", ret: 0.8, class: "Credit" },
            ].map(a => (
              <div key={a.asset} className="flex items-center gap-2 p-1 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="w-28">{a.asset}</span>
                <span className="text-[8px] w-16" style={{ color: "#64748b" }}>{a.class}</span>
                <div className="flex-1 h-2 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                  {a.ret !== 0 && (
                    <div className="absolute h-full rounded-full" style={{
                      left: a.ret < 0 ? `${50 + a.ret * 10}%` : "50%",
                      width: `${Math.abs(a.ret) * 10}%`,
                      background: a.ret > 0 ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)",
                    }} />
                  )}
                </div>
                <span className="font-mono w-14 text-right" style={{ color: a.ret >= 0 ? "#22c55e" : "#ef4444" }}>{a.ret >= 0 ? "+" : ""}{a.ret}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "themes" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE MACRO THEMES</div>
            {[
              { theme: "AI Capex Super-Cycle", conviction: 92, horizon: "12-24M", assets: "NVDA, MSFT, Semis, Power Utilities", risk: "Valuation bubble" },
              { theme: "Fed Easing Cycle", conviction: 78, horizon: "6-12M", assets: "Duration, Gold, Rate-sensitive REITs", risk: "Inflation re-acceleration" },
              { theme: "China Deflation Trap", conviction: 72, horizon: "12M+", assets: "Short CNH, Long UST, Short Copper", risk: "Massive fiscal stimulus" },
              { theme: "Japan Normalization", conviction: 68, horizon: "6-12M", assets: "Long JPY, Short JGBs, Japan banks", risk: "Yen too fast → BOJ pause" },
              { theme: "EM Rate Cuts", conviction: 82, horizon: "3-6M", assets: "Long BRL, MXN bonds, EM local debt", risk: "USD strength resurgence" },
              { theme: "Energy Transition", conviction: 75, horizon: "24M+", assets: "Uranium, Grid infra, Battery metals", risk: "Policy reversal" },
            ].map(t => (
              <div key={t.theme} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{t.theme}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{t.horizon}</span>
                    <span className="font-mono font-bold" style={{ color: t.conviction > 80 ? "#22c55e" : t.conviction > 65 ? "#fbbf24" : "#64748b" }}>{t.conviction}%</span>
                  </div>
                </div>
                <div className="text-[9px] mb-1"><span style={{ color: "#64748b" }}>Expressions:</span> <span style={{ color: "#38bdf8" }}>{t.assets}</span></div>
                <div className="text-[9px]"><span style={{ color: "#64748b" }}>Key risk:</span> <span style={{ color: "#ef4444" }}>{t.risk}</span></div>
              </div>
            ))}
          </div>
        )}

        {tab === "trade-ideas" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MACRO TRADE IDEAS</div>
            {[
              { idea: "Long 2Y UST vs Short 10Y Bund", type: "Relative Value", entry: "Spread: +185bp", target: "+220bp", stop: "+160bp", pnl: "+$2.1M", status: "Active" },
              { idea: "Long MXN/JPY Carry", type: "FX Carry", entry: "9.05", target: "9.80", stop: "8.60", pnl: "+$850K", status: "Active" },
              { idea: "Short China Property ETF", type: "Directional", entry: "$18.50", target: "$14.00", stop: "$20.00", pnl: "-$120K", status: "Active" },
              { idea: "Long Gold / Short Silver Ratio", type: "Relative Value", entry: "88x", target: "95x", stop: "84x", pnl: "+$450K", status: "Active" },
              { idea: "Long VIX Dec Calls", type: "Tail Hedge", entry: "$1.85", target: "$5.00+", stop: "$0.50", pnl: "-$180K", status: "Monitoring" },
            ].map(t => (
              <div key={t.idea} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{t.idea}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{t.type}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: t.status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                    color: t.status === "Active" ? "#22c55e" : "#fbbf24",
                  }}>{t.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Entry:</span> <span className="font-mono">{t.entry}</span></div>
                  <div><span style={{ color: "#64748b" }}>Target:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{t.target}</span></div>
                  <div><span style={{ color: "#64748b" }}>Stop:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{t.stop}</span></div>
                  <div><span style={{ color: "#64748b" }}>P&L:</span> <span className="font-mono" style={{ color: t.pnl.startsWith("+") ? "#22c55e" : "#ef4444" }}>{t.pnl}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calendar" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING MACRO EVENTS</div>
            {[
              { date: "Nov 25", time: "08:30", event: "US Durable Goods Orders", prev: "0.3%", cons: "-0.8%", imp: "HIGH", country: "🇺🇸" },
              { date: "Nov 25", time: "15:00", event: "ECB Financial Stability Review", prev: "—", cons: "—", imp: "MED", country: "🇪🇺" },
              { date: "Nov 26", time: "10:00", event: "US Consumer Confidence", prev: "102.6", cons: "101.0", imp: "HIGH", country: "🇺🇸" },
              { date: "Nov 26", time: "19:00", event: "FOMC Meeting Minutes", prev: "—", cons: "—", imp: "HIGH", country: "🇺🇸" },
              { date: "Nov 27", time: "08:30", event: "US GDP (Q3 2nd)", prev: "2.8%", cons: "2.8%", imp: "HIGH", country: "🇺🇸" },
              { date: "Nov 27", time: "08:30", event: "US PCE Price Index", prev: "2.1%", cons: "2.3%", imp: "HIGH", country: "🇺🇸" },
              { date: "Nov 28", time: "—", event: "US Thanksgiving — Markets Closed", prev: "—", cons: "—", imp: "—", country: "🇺🇸" },
              { date: "Nov 29", time: "10:00", event: "Eurozone CPI Flash (Nov)", prev: "2.0%", cons: "2.3%", imp: "HIGH", country: "🇪🇺" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-mono" style={{ color: "#64748b" }}>{e.date}</span>
                <span className="w-10 font-mono text-[9px]" style={{ color: "#64748b" }}>{e.time}</span>
                <span>{e.country}</span>
                <span className="flex-1 font-bold">{e.event}</span>
                {e.imp !== "—" && (
                  <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                    background: e.imp === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: e.imp === "HIGH" ? "#ef4444" : "#fbbf24",
                  }}>{e.imp}</span>
                )}
                <span className="font-mono w-12 text-right text-[9px]" style={{ color: "#64748b" }}>{e.prev}</span>
                <span className="font-mono w-12 text-right text-[9px]" style={{ color: "#00e5a0" }}>{e.cons}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
