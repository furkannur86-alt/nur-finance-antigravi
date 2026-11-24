"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "factors" | "exposure" | "backtest" | "signals";

export default function FactorInvestingPanel() {
  const [tab, setTab] = useState<Tab>("factors");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🧮</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FACTOR INVESTING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>MSCI BARRA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["factors", "exposure", "backtest", "signals"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "factors" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FACTOR PERFORMANCE — YTD</div>
            {[
              { factor: "Value", ticker: "VLUE", ytd: 8.2, mtd: 1.5, sharpe: 0.82, desc: "P/E, P/B, Dividend Yield" },
              { factor: "Momentum", ticker: "MTUM", ytd: 14.5, mtd: 3.2, sharpe: 1.15, desc: "12-1 month price momentum" },
              { factor: "Quality", ticker: "QUAL", ytd: 11.8, mtd: 2.1, sharpe: 1.02, desc: "ROE, Debt/Equity, Earnings variability" },
              { factor: "Low Volatility", ticker: "USMV", ytd: 6.4, mtd: 0.8, sharpe: 0.95, desc: "Min variance optimization" },
              { factor: "Size (Small Cap)", ticker: "SIZE", ytd: -2.1, mtd: -1.2, sharpe: -0.18, desc: "Market cap tilt to small" },
              { factor: "Growth", ticker: "IWF", ytd: 18.2, mtd: 4.1, sharpe: 1.28, desc: "EPS growth, sales growth" },
              { factor: "Dividend", ticker: "DVY", ytd: 5.8, mtd: 0.4, sharpe: 0.68, desc: "High dividend yield screen" },
              { factor: "Min Vol", ticker: "SPLV", ytd: 7.2, mtd: 1.1, sharpe: 0.88, desc: "Low beta, low vol stocks" },
            ].map(f => (
              <div key={f.factor} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{f.factor}</span>
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>{f.ticker}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: f.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{f.ytd >= 0 ? "+" : ""}{f.ytd}%</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{f.desc}</span>
                  <div className="flex gap-3">
                    <span><span style={{ color: "#64748b" }}>MTD:</span> <span className="font-mono" style={{ color: f.mtd >= 0 ? "#22c55e" : "#ef4444" }}>{f.mtd >= 0 ? "+" : ""}{f.mtd}%</span></span>
                    <span><span style={{ color: "#64748b" }}>Sharpe:</span> <span className="font-mono" style={{ color: f.sharpe > 0.8 ? "#22c55e" : f.sharpe > 0 ? "#fbbf24" : "#ef4444" }}>{f.sharpe.toFixed(2)}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "exposure" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PORTFOLIO FACTOR EXPOSURE (Z-SCORES)</div>
            {[
              { factor: "Value", port: 0.42, bench: -0.15, active: 0.57 },
              { factor: "Momentum", port: 0.85, bench: 0.22, active: 0.63 },
              { factor: "Quality", port: 1.12, bench: 0.35, active: 0.77 },
              { factor: "Size", port: -0.28, bench: 0.00, active: -0.28 },
              { factor: "Volatility", port: -0.65, bench: 0.00, active: -0.65 },
              { factor: "Growth", port: 0.72, bench: 0.18, active: 0.54 },
              { factor: "Leverage", port: -0.35, bench: 0.08, active: -0.43 },
              { factor: "Liquidity", port: 0.18, bench: 0.00, active: 0.18 },
            ].map(e => (
              <div key={e.factor} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{e.factor}</span>
                <div className="flex-1 relative h-5 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                  <div className="absolute top-1 bottom-1 rounded" style={{
                    left: e.active < 0 ? `${50 + e.active * 25}%` : "50%",
                    width: `${Math.abs(e.active) * 25}%`,
                    background: e.active >= 0 ? "#22c55e" : "#ef4444",
                    opacity: 0.6,
                  }} />
                </div>
                <div className="w-28 grid grid-cols-3 gap-1 text-[9px] font-mono text-right">
                  <span style={{ color: "#38bdf8" }}>{e.port >= 0 ? "+" : ""}{e.port.toFixed(2)}</span>
                  <span style={{ color: "#64748b" }}>{e.bench >= 0 ? "+" : ""}{e.bench.toFixed(2)}</span>
                  <span style={{ color: e.active >= 0 ? "#22c55e" : "#ef4444" }}>{e.active >= 0 ? "+" : ""}{e.active.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-3 text-[8px] pr-2">
              <span style={{ color: "#38bdf8" }}>Port</span>
              <span style={{ color: "#64748b" }}>Bench</span>
              <span style={{ color: "#fbbf24" }}>Active</span>
            </div>
          </div>
        )}

        {tab === "backtest" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FACTOR BACKTEST — 10 YEAR CUMULATIVE RETURN</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 120" className="w-full">
                {[0, 50, 100, 150, 200].map(v => (
                  <g key={v}>
                    <line x1="40" y1={100 - v * 0.45} x2="380" y2={100 - v * 0.45} stroke="rgba(255,255,255,0.05)" />
                    <text x="35" y={103 - v * 0.45} textAnchor="end" fill="#64748b" fontSize="7">{v}%</text>
                  </g>
                ))}
                {[
                  { name: "Quality", points: [0,8,22,15,35,52,48,65,82,95,112], color: "#22c55e" },
                  { name: "Momentum", points: [0,12,28,18,42,68,55,78,98,125,145], color: "#38bdf8" },
                  { name: "Value", points: [0,5,12,8,18,25,38,52,65,72,82], color: "#fbbf24" },
                  { name: "Low Vol", points: [0,6,14,18,24,32,38,45,55,62,72], color: "#a78bfa" },
                ].map(line => (
                  <polyline key={line.name}
                    points={line.points.map((p, i) => `${40 + i * 34},${100 - p * 0.45}`).join(" ")}
                    fill="none" stroke={line.color} strokeWidth="1.5" />
                ))}
                <text x="385" y="12" fill="#22c55e" fontSize="7" textAnchor="end">Quality</text>
                <text x="385" y="22" fill="#38bdf8" fontSize="7" textAnchor="end">Momentum</text>
                <text x="385" y="32" fill="#fbbf24" fontSize="7" textAnchor="end">Value</text>
                <text x="385" y="42" fill="#a78bfa" fontSize="7" textAnchor="end">Low Vol</text>
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FACTOR STATISTICS — 10Y</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Factor", "CAGR", "Vol", "Sharpe", "Max DD", "Win Rate"].map(h => (
                      <th key={h} className="px-2 py-1.5 text-right first:text-left" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { factor: "Momentum", cagr: 14.5, vol: 16.2, sharpe: 0.90, maxDD: -22.5, winRate: 62 },
                    { factor: "Quality", cagr: 11.2, vol: 12.8, sharpe: 0.88, maxDD: -18.2, winRate: 65 },
                    { factor: "Value", cagr: 8.2, vol: 14.5, sharpe: 0.57, maxDD: -28.5, winRate: 55 },
                    { factor: "Low Vol", cagr: 7.2, vol: 10.2, sharpe: 0.71, maxDD: -15.8, winRate: 60 },
                    { factor: "Size", cagr: 5.8, vol: 18.5, sharpe: 0.31, maxDD: -35.2, winRate: 48 },
                    { factor: "Dividend", cagr: 6.8, vol: 11.8, sharpe: 0.58, maxDD: -20.5, winRate: 58 },
                  ].map(r => (
                    <tr key={r.factor} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{r.factor}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: "#22c55e" }}>{r.cagr}%</td>
                      <td className="px-2 py-1.5 text-right font-mono">{r.vol}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: r.sharpe > 0.7 ? "#22c55e" : "#fbbf24" }}>{r.sharpe.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: "#ef4444" }}>{r.maxDD}%</td>
                      <td className="px-2 py-1.5 text-right font-mono">{r.winRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "signals" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CURRENT FACTOR SIGNALS</div>
            {[
              { factor: "Value", signal: "OVERWEIGHT", strength: 72, rationale: "P/E spread at 85th percentile — value cheap vs growth" },
              { factor: "Momentum", signal: "OVERWEIGHT", strength: 85, rationale: "Strong breadth with tech + financials leading" },
              { factor: "Quality", signal: "NEUTRAL", strength: 55, rationale: "Quality premium compressed after long outperformance" },
              { factor: "Low Vol", signal: "UNDERWEIGHT", strength: 35, rationale: "Risk-on regime — low vol underperforming in up markets" },
              { factor: "Size", signal: "UNDERWEIGHT", strength: 28, rationale: "Small caps struggling with tight credit conditions" },
              { factor: "Growth", signal: "OVERWEIGHT", strength: 78, rationale: "AI capex cycle driving earnings revisions higher" },
            ].map(s => (
              <div key={s.factor} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.signal === "OVERWEIGHT" ? "rgba(34,197,94,0.15)" : s.signal === "UNDERWEIGHT" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                      color: s.signal === "OVERWEIGHT" ? "#22c55e" : s.signal === "UNDERWEIGHT" ? "#ef4444" : "#fbbf24",
                    }}>{s.signal}</span>
                    <span className="font-bold">{s.factor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.strength}%`, background: s.strength > 60 ? "#22c55e" : s.strength > 40 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                    <span className="font-mono text-[8px]">{s.strength}%</span>
                  </div>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{s.rationale}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
