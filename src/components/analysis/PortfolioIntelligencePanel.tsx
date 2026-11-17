"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const HOLDINGS = [
  { ticker: "NVDA", name: "NVIDIA Corp", shares: 850, avgCost: 118.40, price: 285.60, weight: 24.2 },
  { ticker: "AAPL", name: "Apple Inc", shares: 1200, avgCost: 165.20, price: 198.40, weight: 18.8 },
  { ticker: "MSFT", name: "Microsoft", shares: 600, avgCost: 310.50, price: 425.80, weight: 16.1 },
  { ticker: "AMZN", name: "Amazon", shares: 400, avgCost: 142.80, price: 195.20, weight: 9.8 },
  { ticker: "JPM", name: "JPMorgan Chase", shares: 700, avgCost: 148.60, price: 212.40, weight: 9.3 },
  { ticker: "INTC", name: "Intel Corp", shares: 3500, avgCost: 42.80, price: 28.50, weight: 6.2 },
  { ticker: "XOM", name: "Exxon Mobil", shares: 900, avgCost: 98.20, price: 118.60, weight: 8.4 },
  { ticker: "TLT", name: "iShares 20Y Tsy", shares: 800, avgCost: 92.40, price: 88.20, weight: 7.2 },
];

const INSIGHTS = [
  { title: "Concentration Risk", detail: "42% allocated to Technology sector — exceeds 35% threshold. Consider trimming NVDA or MSFT to reduce single-sector exposure.", severity: "HIGH", action: "Reduce tech allocation by 7% → redistribute to Healthcare & Industrials" },
  { title: "Tax-Loss Harvest", detail: "INTC position unrealized loss of -$50,050 (-33.4%). Harvesting before Dec 31 saves ~$18.5K at 37% bracket.", severity: "HIGH", action: "Sell INTC, replace with AMD or QCOM for 31-day wash-sale period" },
  { title: "Rebalance Trigger", detail: "Portfolio drift of 7.2% exceeds 5% policy threshold. US Equities overweight +8.2%, Fixed Income underweight -4.1%.", severity: "MEDIUM", action: "Execute systematic rebalance — sell equities, buy fixed income" },
  { title: "Dividend Shortfall", detail: "Current yield 1.42% vs 2.0% target. Annual income $34.1K vs $48K goal — $13.9K gap.", severity: "LOW", action: "Swap growth names for dividend equivalents: SCHD, VYM, or JEPI" },
  { title: "Correlation Alert", detail: "Rolling 60d correlation between NVDA-MSFT spiked to 0.91 (from 0.72). Diversification benefit eroded.", severity: "MEDIUM", action: "Add uncorrelated asset: Gold (GLD), Managed Futures (DBMF), or Commodities (DBC)" },
];

const SCENARIOS = [
  { name: "Rate Hike +50bp", impact: -3.8, dollarImpact: -91200, desc: "Fed surprises with additional tightening", affected: [
    { ticker: "TLT", impact: -6.2 }, { ticker: "NVDA", impact: -4.5 }, { ticker: "JPM", impact: +2.1 }, { ticker: "XOM", impact: -0.8 },
  ]},
  { name: "Recession Scenario", impact: -12.4, dollarImpact: -297600, desc: "GDP contracts 2 consecutive quarters", affected: [
    { ticker: "AMZN", impact: -18.5 }, { ticker: "NVDA", impact: -22.0 }, { ticker: "JPM", impact: -15.2 }, { ticker: "TLT", impact: +8.4 },
  ]},
  { name: "AI Boom Continues", impact: +18.6, dollarImpact: +446400, desc: "AI capex doubles, adoption accelerates", affected: [
    { ticker: "NVDA", impact: +35.0 }, { ticker: "MSFT", impact: +15.2 }, { ticker: "AMZN", impact: +12.8 }, { ticker: "INTC", impact: +8.5 },
  ]},
  { name: "USD Weakness -10%", impact: +4.2, dollarImpact: +100800, desc: "Dollar index drops to 90", affected: [
    { ticker: "XOM", impact: +8.5 }, { ticker: "AAPL", impact: +5.2 }, { ticker: "NVDA", impact: +3.8 }, { ticker: "TLT", impact: -1.2 },
  ]},
];

const OPTIMIZATION = [
  { ticker: "NVDA", current: 24.2, optimized: 18.0 },
  { ticker: "AAPL", current: 18.8, optimized: 16.5 },
  { ticker: "MSFT", current: 16.1, optimized: 14.0 },
  { ticker: "AMZN", current: 9.8, optimized: 10.0 },
  { ticker: "JPM", current: 9.3, optimized: 11.0 },
  { ticker: "INTC", current: 6.2, optimized: 4.0 },
  { ticker: "XOM", current: 8.4, optimized: 10.5 },
  { ticker: "TLT", current: 7.2, optimized: 12.0 },
  { ticker: "GLD", current: 0, optimized: 4.0 },
];

type Tab = "overview" | "ai-insights" | "scenarios" | "optimization";

export default function PortfolioIntelligencePanel() {
  const [tab, setTab] = useState<Tab>("overview");

  const totalValue = 2_400_000;
  const dayPnl = 18420;
  const ytdReturn = 22.4;
  const sharpe = 1.82;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🧠</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PORTFOLIO INTELLIGENCE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>AI-Powered</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "ai-insights", "scenarios", "optimization"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "ai-insights" ? "AI" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "TOTAL VALUE", value: `$${(totalValue / 1e6).toFixed(1)}M`, color: "#38bdf8" },
          { label: "DAY P&L", value: `+$${(dayPnl).toLocaleString()}`, color: "#22c55e" },
          { label: "YTD RETURN", value: `+${ytdReturn}%`, color: "#22c55e" },
          { label: "SHARPE", value: sharpe.toFixed(2), color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-3 py-2">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-8 gap-1 px-2 py-1 text-[9px] font-bold" style={{ color: "#64748b" }}>
              <span>TICKER</span><span>SHARES</span><span>AVG COST</span><span>PRICE</span>
              <span>P&L</span><span>P&L %</span><span>WEIGHT</span><span></span>
            </div>
            {HOLDINGS.map(h => {
              const pnl = (h.price - h.avgCost) * h.shares;
              const pnlPct = ((h.price - h.avgCost) / h.avgCost) * 100;
              const pos = pnl >= 0;
              return (
                <div key={h.ticker} className="grid grid-cols-8 gap-1 items-center px-2 py-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div>
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{h.ticker}</span>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>{h.name}</div>
                  </div>
                  <span className="font-mono">{h.shares.toLocaleString()}</span>
                  <span className="font-mono">${h.avgCost.toFixed(2)}</span>
                  <span className="font-mono">${h.price.toFixed(2)}</span>
                  <span className="font-mono font-bold" style={{ color: pos ? "#22c55e" : "#ef4444" }}>
                    {pos ? "+" : ""}${(pnl / 1000).toFixed(1)}K
                  </span>
                  <span className="font-mono" style={{ color: pos ? "#22c55e" : "#ef4444" }}>
                    {pos ? "+" : ""}{pnlPct.toFixed(1)}%
                  </span>
                  <span className="font-mono">{h.weight}%</span>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(h.weight / 25) * 100}%`, background: "#00e5a0" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── AI INSIGHTS ── */}
        {tab === "ai-insights" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-1" style={{ color: "#64748b" }}>AI-generated portfolio diagnostics — updated every 15 min</div>
            {INSIGHTS.map((ins, i) => {
              const sevColor = ins.severity === "HIGH" ? "#ef4444" : ins.severity === "MEDIUM" ? "#fbbf24" : "#38bdf8";
              return (
                <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ins.severity === "HIGH" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${sevColor}22`, color: sevColor }}>{ins.severity}</span>
                    <span className="font-bold" style={{ color: "#e2e8f0" }}>{ins.title}</span>
                  </div>
                  <div className="text-[10px] mb-2" style={{ color: "#94a3b8" }}>{ins.detail}</div>
                  <div className="p-2 rounded" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.1)" }}>
                    <span className="text-[8px] font-bold" style={{ color: "#00e5a0" }}>RECOMMENDED: </span>
                    <span className="text-[9px]" style={{ color: "#e2e8f0" }}>{ins.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SCENARIOS ── */}
        {tab === "scenarios" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-1" style={{ color: "#64748b" }}>Macro scenario stress testing — Monte Carlo simulated</div>
            {SCENARIOS.map((sc, i) => {
              const pos = sc.impact >= 0;
              return (
                <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold" style={{ color: "#e2e8f0" }}>{sc.name}</span>
                      <div className="text-[9px]" style={{ color: "#64748b" }}>{sc.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm" style={{ color: pos ? "#22c55e" : "#ef4444" }}>
                        {pos ? "+" : ""}{sc.impact}%
                      </div>
                      <div className="font-mono text-[9px]" style={{ color: pos ? "#22c55e" : "#ef4444" }}>
                        {pos ? "+" : ""}${(sc.dollarImpact / 1000).toFixed(1)}K
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sc.affected.map(a => (
                      <div key={a.ticker} className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="font-bold text-[9px]" style={{ color: "#00e5a0" }}>{a.ticker}</div>
                        <div className="font-mono text-[9px]" style={{ color: a.impact >= 0 ? "#22c55e" : "#ef4444" }}>
                          {a.impact >= 0 ? "+" : ""}{a.impact}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── OPTIMIZATION ── */}
        {tab === "optimization" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: "EXPECTED RETURN", before: "+11.2%", after: "+10.8%", note: "Slight reduction for better risk-adjusted" },
                { label: "PORTFOLIO VOL", before: "16.8%", after: "12.4%", note: "-26% volatility reduction" },
                { label: "SHARPE RATIO", before: "1.82", after: "2.15", note: "+18% improvement" },
              ].map(m => (
                <div key={m.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.1)" }}>
                  <div className="text-[8px] font-bold" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-mono" style={{ color: "#ef4444" }}>{m.before}</span>
                    <span style={{ color: "#64748b" }}>→</span>
                    <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{m.after}</span>
                  </div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{m.note}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WEIGHT COMPARISON: CURRENT vs OPTIMIZED</div>
            {OPTIMIZATION.map(o => {
              const diff = o.optimized - o.current;
              return (
                <div key={o.ticker} className="flex items-center gap-2 py-1.5">
                  <span className="font-bold w-10" style={{ color: "#00e5a0" }}>{o.ticker}</span>
                  <div className="flex-1 relative h-4">
                    {/* Current bar */}
                    <div className="absolute top-0 h-1.5 rounded-full" style={{ width: `${o.current * 3.5}%`, background: "rgba(239,68,68,0.5)" }} />
                    {/* Optimized bar */}
                    <div className="absolute bottom-0 h-1.5 rounded-full" style={{ width: `${o.optimized * 3.5}%`, background: "#22c55e" }} />
                  </div>
                  <span className="font-mono w-10 text-right text-[9px]" style={{ color: "#ef4444" }}>{o.current}%</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span className="font-mono w-10 text-[9px]" style={{ color: "#22c55e" }}>{o.optimized}%</span>
                  <span className="font-mono w-12 text-right text-[8px]" style={{ color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#64748b" }}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </div>
              );
            })}

            <div className="flex justify-center gap-4 mt-1 text-[8px]">
              <span style={{ color: "rgba(239,68,68,0.5)" }}>■ Current</span>
              <span style={{ color: "#22c55e" }}>■ Optimized</span>
            </div>

            <button className="w-full py-2 rounded text-[10px] font-bold mt-1" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
              APPLY OPTIMIZED ALLOCATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
