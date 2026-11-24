"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "allocation" | "optimization" | "rebalancing" | "analytics";

export default function PortfolioConstructionPanel() {
  const [tab, setTab] = useState<Tab>("allocation");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PORTFOLIO CONSTRUCTION</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg PORT</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["allocation", "optimization", "rebalancing", "analytics"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "rebalancing" ? "REBAL" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "allocation" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRATEGIC ASSET ALLOCATION</div>
            {[
              { asset: "US Equities", target: 35, actual: 37.2, diff: 2.2, benchmark: "S&P 500", color: "#38bdf8" },
              { asset: "Intl Developed Eq", target: 15, actual: 14.1, diff: -0.9, benchmark: "MSCI EAFE", color: "#6366f1" },
              { asset: "Emerging Markets Eq", target: 10, actual: 8.8, diff: -1.2, benchmark: "MSCI EM", color: "#a855f7" },
              { asset: "US Fixed Income", target: 20, actual: 21.5, diff: 1.5, benchmark: "BBG Agg", color: "#22c55e" },
              { asset: "Global HY / EM Debt", target: 5, actual: 4.8, diff: -0.2, benchmark: "BBG HY", color: "#fbbf24" },
              { asset: "Real Assets", target: 8, actual: 7.2, diff: -0.8, benchmark: "Custom", color: "#f97316" },
              { asset: "Alternatives", target: 5, actual: 4.5, diff: -0.5, benchmark: "HFRI", color: "#ec4899" },
              { asset: "Cash", target: 2, actual: 1.9, diff: -0.1, benchmark: "T-Bills", color: "#64748b" },
            ].map(a => (
              <div key={a.asset} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-3 h-3 rounded-sm" style={{ background: a.color }} />
                <span className="w-36">{a.asset}</span>
                <div className="flex-1 h-3 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute h-full rounded-full" style={{ width: `${a.actual * 2.5}%`, background: a.color, opacity: 0.4 }} />
                  <div className="absolute h-full w-0.5" style={{ left: `${a.target * 2.5}%`, background: "#e2e8f0", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-12 text-right">{a.actual}%</span>
                <span className="font-mono w-12 text-right" style={{ color: Math.abs(a.diff) > 1.5 ? "#ef4444" : "#64748b" }}>{a.diff >= 0 ? "+" : ""}{a.diff.toFixed(1)}</span>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: "Portfolio Value", val: "$285.4M", color: "#00e5a0" },
                { label: "Tracking Error", val: "1.85%", color: "#fbbf24" },
                { label: "Active Share", val: "42%", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "optimization" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MEAN-VARIANCE OPTIMIZATION</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Expected Return", current: "8.5%", optimal: "9.2%", color: "#22c55e" },
                { label: "Portfolio Vol", current: "12.8%", optimal: "11.5%", color: "#fbbf24" },
                { label: "Sharpe Ratio", current: "0.66", optimal: "0.80", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="flex justify-between mt-1">
                    <div><div className="text-[7px]" style={{ color: "#64748b" }}>Current</div><div className="font-mono">{s.current}</div></div>
                    <div className="text-right"><div className="text-[7px]" style={{ color: "#64748b" }}>Optimal</div><div className="font-mono" style={{ color: s.color }}>{s.optimal}</div></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EFFICIENT FRONTIER</div>
            <svg viewBox="0 0 400 150" className="w-full">
              <text x="200" y="145" textAnchor="middle" fill="#64748b" fontSize="7">Volatility (%)</text>
              <text x="8" y="75" fill="#64748b" fontSize="7" transform="rotate(-90,8,75)">Return (%)</text>
              {[8, 10, 12, 14, 16, 18].map(v => (
                <text key={v} x={30 + (v - 8) * 35} y="135" textAnchor="middle" fill="#64748b" fontSize="6">{v}</text>
              ))}
              {[4, 6, 8, 10, 12].map((r, i) => (
                <text key={r} x="22" y={120 - i * 25} textAnchor="end" fill="#64748b" fontSize="6">{r}</text>
              ))}
              <polyline points="45,105 75,85 110,68 150,55 195,48 240,45 290,48 340,55" fill="none" stroke="#6366f1" strokeWidth={2} />
              <circle cx="195" cy="48" r={5} fill="#00e5a0" stroke="#00e5a0" strokeWidth={1} />
              <text x="195" y="40" textAnchor="middle" fill="#00e5a0" fontSize="7">Optimal</text>
              <circle cx="225" cy="52" r={4} fill="#ef4444" stroke="#ef4444" strokeWidth={1} />
              <text x="225" y="62" textAnchor="middle" fill="#ef4444" fontSize="7">Current</text>
            </svg>
          </div>
        )}

        {tab === "rebalancing" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REBALANCING ACTIONS NEEDED</div>
            {[
              { asset: "US Large Cap", action: "SELL", amount: "$6.3M", from: 37.2, to: 35.0, urgency: "High" },
              { asset: "EM Equities", action: "BUY", amount: "$3.4M", from: 8.8, to: 10.0, urgency: "Medium" },
              { asset: "US Treasuries", action: "SELL", amount: "$4.3M", from: 21.5, to: 20.0, urgency: "Low" },
              { asset: "Real Assets (REIT)", action: "BUY", amount: "$2.3M", from: 7.2, to: 8.0, urgency: "Medium" },
              { asset: "Intl Developed", action: "BUY", amount: "$2.6M", from: 14.1, to: 15.0, urgency: "Low" },
              { asset: "Alternatives", action: "BUY", amount: "$1.4M", from: 4.5, to: 5.0, urgency: "Low" },
            ].map(r => (
              <div key={r.asset} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: r.action === "BUY" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: r.action === "BUY" ? "#22c55e" : "#ef4444",
                    }}>{r.action}</span>
                    <span className="font-bold">{r.asset}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: r.action === "BUY" ? "#22c55e" : "#ef4444" }}>{r.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px]">
                  <span className="font-mono" style={{ color: "#64748b" }}>{r.from}%</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span className="font-mono" style={{ color: "#00e5a0" }}>{r.to}%</span>
                  <span className="ml-auto text-[8px] px-1 py-0.5 rounded" style={{
                    background: r.urgency === "High" ? "rgba(239,68,68,0.1)" : r.urgency === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(100,116,139,0.1)",
                    color: r.urgency === "High" ? "#ef4444" : r.urgency === "Medium" ? "#fbbf24" : "#64748b",
                  }}>{r.urgency}</span>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Est. Transaction Cost", val: "$42K (2.1bp)", color: "#fbbf24" },
                { label: "Tax Impact (Est.)", val: "$185K", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RISK/RETURN ANALYTICS</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Ann. Return", val: "12.8%", color: "#22c55e" },
                { label: "Ann. Vol", val: "12.5%", color: "#fbbf24" },
                { label: "Sharpe", val: "1.02", color: "#38bdf8" },
                { label: "Max DD", val: "-15.2%", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ROLLING 12M RETURNS</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {["Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26", "Q3'26", "Q4'26"].map((q, i) => {
                const rets = [8.5, 12.2, -2.5, 15.8, 10.2, 8.8, 14.5, 12.8];
                const h = Math.abs(rets[i]) * 2.5;
                const y = rets[i] >= 0 ? 45 - h : 45;
                return (
                  <g key={q}>
                    <rect x={15 + i * 48} y={y} width={30} height={h} rx={2} fill={rets[i] >= 0 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"} stroke={rets[i] >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={0.5} />
                    <text x={30 + i * 48} y={rets[i] >= 0 ? y - 3 : y + h + 8} textAnchor="middle" fill={rets[i] >= 0 ? "#22c55e" : "#ef4444"} fontSize="6">{rets[i]}%</text>
                    <text x={30 + i * 48} y="78" textAnchor="middle" fill="#64748b" fontSize="5">{q}</text>
                  </g>
                );
              })}
              <line x1="10" y1="45" x2="395" y2="45" stroke="#1e293b" strokeDasharray="3" />
            </svg>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DRAWDOWN ANALYSIS</div>
            {[
              { period: "Mar 2025", depth: -15.2, duration: "42 days", recovery: "68 days" },
              { period: "Oct 2025", depth: -8.5, duration: "18 days", recovery: "32 days" },
              { period: "Jun 2026", depth: -5.2, duration: "12 days", recovery: "15 days" },
            ].map(d => (
              <div key={d.period} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-mono">{d.period}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#ef4444" }}>{d.depth}%</span>
                <span className="text-[9px]" style={{ color: "#64748b" }}>Duration: {d.duration}</span>
                <span className="text-[9px] ml-auto" style={{ color: "#64748b" }}>Recovery: {d.recovery}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
