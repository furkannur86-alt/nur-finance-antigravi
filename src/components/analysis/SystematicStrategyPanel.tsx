"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "strategies" | "performance" | "risk" | "execution";

export default function SystematicStrategyPanel() {
  const [tab, setTab] = useState<Tab>("strategies");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SYSTEMATIC STRATEGY</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>AQR Style</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["strategies", "performance", "risk", "execution"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "strategies" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE SYSTEMATIC STRATEGIES</div>
            {[
              { name: "Trend Following — Multi-Asset", aum: 2.8, ytd: 12.5, sharpe: 1.15, signals: 42, long: 65, short: 35, status: "LIVE" },
              { name: "Statistical Arbitrage — Equity", aum: 1.5, ytd: 8.2, sharpe: 2.25, signals: 180, long: 52, short: 48, status: "LIVE" },
              { name: "Carry Trade — G10 FX", aum: 0.8, ytd: 5.8, sharpe: 0.95, signals: 12, long: 70, short: 30, status: "LIVE" },
              { name: "Mean Reversion — Commodity", aum: 0.6, ytd: -2.5, sharpe: -0.35, signals: 28, long: 45, short: 55, status: "REVIEW" },
              { name: "Momentum — Sector Rotation", aum: 1.2, ytd: 15.8, sharpe: 1.42, signals: 11, long: 80, short: 20, status: "LIVE" },
              { name: "Vol Carry — Options", aum: 0.4, ytd: 18.5, sharpe: 1.85, signals: 85, long: 20, short: 80, status: "LIVE" },
              { name: "Machine Learning — Equity L/S", aum: 0.9, ytd: 22.5, sharpe: 2.52, signals: 350, long: 55, short: 45, status: "BETA" },
            ].map(s => (
              <div key={s.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                      background: s.status === "LIVE" ? "rgba(34,197,94,0.15)" : s.status === "BETA" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                      color: s.status === "LIVE" ? "#22c55e" : s.status === "BETA" ? "#38bdf8" : "#fbbf24",
                    }}>{s.status}</span>
                    <span className="font-bold">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: s.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{s.ytd >= 0 ? "+" : ""}{s.ytd}%</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>AUM:</span> <span className="font-mono">${s.aum}B</span></div>
                  <div><span style={{ color: "#64748b" }}>Sharpe:</span> <span className="font-mono" style={{ color: s.sharpe > 1 ? "#22c55e" : s.sharpe > 0 ? "#fbbf24" : "#ef4444" }}>{s.sharpe.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Signals:</span> <span className="font-mono">{s.signals}</span></div>
                  <div><span style={{ color: "#22c55e" }}>L:{s.long}%</span></div>
                  <div><span style={{ color: "#ef4444" }}>S:{s.short}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "performance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MONTHLY PERFORMANCE GRID — 2026</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1" style={{ color: "#64748b" }}>Strategy</th>
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"].map(m => (
                      <th key={m} className="text-center px-1 py-1" style={{ color: "#64748b" }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Trend", months: [2.1,1.5,-0.8,3.2,0.5,1.8,-1.2,2.5,0.8,1.2,0.9] },
                    { name: "StatArb", months: [0.8,1.2,0.5,0.9,0.3,1.1,0.6,0.8,1.0,0.5,0.5] },
                    { name: "Carry", months: [0.5,0.8,0.2,1.2,-0.5,0.8,0.5,0.3,1.2,0.5,0.3] },
                    { name: "Momentum", months: [1.8,2.5,1.2,0.5,2.8,1.5,0.8,1.2,1.5,0.8,1.2] },
                    { name: "ML Eq", months: [2.5,1.8,2.2,1.5,3.2,2.1,1.8,2.5,1.2,1.8,1.9] },
                  ].map(s => (
                    <tr key={s.name} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1 font-bold" style={{ color: "#38bdf8" }}>{s.name}</td>
                      {s.months.map((v, i) => (
                        <td key={i} className="text-center px-1 py-1 font-mono" style={{
                          color: v >= 0 ? "#22c55e" : "#ef4444",
                          background: `rgba(${v >= 0 ? "34,197,94" : "239,68,68"}, ${Math.min(Math.abs(v) * 0.08, 0.3)})`,
                        }}>{v >= 0 ? "+" : ""}{v.toFixed(1)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMPOSITE STATISTICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Composite YTD", value: "+14.2%", color: "#22c55e" },
                { label: "Composite Sharpe", value: "1.65", color: "#22c55e" },
                { label: "Max Drawdown", value: "-4.8%", color: "#ef4444" },
                { label: "Win Rate", value: "62%", color: "#fbbf24" },
                { label: "Avg Win/Loss", value: "1.8x", color: "#22c55e" },
                { label: "Correlation to SPX", value: "0.15", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRATEGY RISK DECOMPOSITION</div>
            {[
              { factor: "Market Beta", contrib: 2.5, pct: 18 },
              { factor: "Momentum", contrib: 4.2, pct: 30 },
              { factor: "Carry", contrib: 1.8, pct: 13 },
              { factor: "Value", contrib: 1.2, pct: 8 },
              { factor: "Volatility", contrib: 2.8, pct: 20 },
              { factor: "Idiosyncratic", contrib: 1.7, pct: 12 },
            ].map(f => (
              <div key={f.factor} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{f.factor}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: "#00e5a0", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-14 text-right">{f.contrib}% vol</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{f.pct}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TAIL RISK SCENARIOS</div>
            {[
              { scenario: "Flash Crash (-5% SPX in 1d)", impact: -3.2, hedged: -1.5 },
              { scenario: "Bond Tantrum (+100bp UST)", impact: -2.8, hedged: -1.2 },
              { scenario: "USD Crash (-10%)", impact: -1.5, hedged: -0.5 },
              { scenario: "Vol Spike (VIX > 40)", impact: -4.5, hedged: -2.2 },
              { scenario: "Liquidity Crisis", impact: -6.8, hedged: -3.5 },
            ].map(s => (
              <div key={s.scenario} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="flex-1">{s.scenario}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#ef4444" }}>{s.impact}%</span>
                <span className="font-mono w-16 text-right" style={{ color: "#fbbf24" }}>{s.hedged}%</span>
              </div>
            ))}
            <div className="flex justify-end gap-6 text-[8px] pr-2">
              <span style={{ color: "#ef4444" }}>Unhedged</span>
              <span style={{ color: "#fbbf24" }}>Hedged</span>
            </div>
          </div>
        )}

        {tab === "execution" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXECUTION QUALITY — TODAY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Orders", value: "12,450" },
                { label: "Fill Rate", value: "98.5%" },
                { label: "Avg Slippage", value: "0.8bp" },
                { label: "Implementation Shortfall", value: "1.2bp" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXECUTION ALGO BREAKDOWN</div>
            {[
              { algo: "TWAP", orders: 3200, fillRate: 99.2, slippage: 0.5, pctVolume: 2.5 },
              { algo: "VWAP", orders: 4500, fillRate: 98.8, slippage: 0.8, pctVolume: 3.8 },
              { algo: "IS (Implementation Shortfall)", orders: 2800, fillRate: 97.5, slippage: 1.5, pctVolume: 5.2 },
              { algo: "Arrival Price", orders: 1200, fillRate: 99.0, slippage: 1.2, pctVolume: 4.5 },
              { algo: "Dark Pool", orders: 750, fillRate: 85.5, slippage: -0.2, pctVolume: 1.2 },
            ].map(a => (
              <div key={a.algo} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32 font-bold">{a.algo}</span>
                <span className="font-mono w-14 text-right">{a.orders.toLocaleString()}</span>
                <span className="font-mono w-14 text-right" style={{ color: a.fillRate > 98 ? "#22c55e" : "#fbbf24" }}>{a.fillRate}%</span>
                <span className="font-mono w-14 text-right" style={{ color: a.slippage <= 0 ? "#22c55e" : a.slippage < 1 ? "#fbbf24" : "#ef4444" }}>{a.slippage}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{a.pctVolume}% vol</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
