"use client";

import { useMemo, useEffect, useState } from "react";

interface PortfolioIntelligenceBarProps {
  totalValue: number;
  totalPnL: number;
  totalReturn: number;
  avgChange: number;
  positionCount: number;
  portfolio: Array<{
    symbol: string;
    changePercent: number;
    currentPrice: number;
    quantity: number;
  }>;
}

const INSIGHTS = [
  "AI: Momentum divergence detected in tech sector — consider rotation to defensive assets",
  "QUANT: Sharpe ratio improved 0.18 vs 30-day avg — portfolio efficiency increasing",
  "SIGNAL: VIX below 20 threshold — options premiums at 6-month low",
  "ALERT: Correlation cluster forming in mega-cap — diversification risk elevated",
  "AI: MACD bullish crossover on 3 of your top 5 holdings",
  "MACRO: Fed dot-plot suggests 2 more cuts in 2026 — bond yields softening",
  "QUANT: Beta-adjusted return outperforms SPX by +1.4% this week",
  "AI: Smart money flow diverging from retail — institutional accumulation detected",
];

function MiniSparkLine({ change }: { change: number }) {
  const color = change >= 0 ? "#00d4aa" : "#ef4444";
  // Generate a simple svg sparkline
  const points = useMemo(() => {
    const base = 20;
    return Array.from({ length: 12 }, (_, i) => {
      const noise = (Math.sin(i * 1.3 + change) + Math.sin(i * 0.7)) * 4;
      const trend = (i / 11) * change * 0.8;
      return `${i * 5},${base - trend - noise}`;
    }).join(" ");
  }, [change]);

  return (
    <svg width="60" height="24" viewBox="0 0 55 24" fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioIntelligenceBar({
  totalValue,
  totalPnL,
  totalReturn,
  avgChange,
  positionCount,
  portfolio,
}: PortfolioIntelligenceBarProps) {
  const [insightIdx, setInsightIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setInsightIdx((i) => (i + 1) % INSIGHTS.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const pnlColor = totalPnL >= 0 ? "#00d4aa" : "#ef4444";
  const returnColor = totalReturn >= 0 ? "#00d4aa" : "#ef4444";

  const topMovers = useMemo(() =>
    [...portfolio]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5),
    [portfolio]
  );

  const gainers = portfolio.filter(p => p.changePercent > 0).length;
  const losers = portfolio.filter(p => p.changePercent < 0).length;
  const winRate = positionCount > 0 ? (gainers / positionCount) * 100 : 0;

  return (
    <div
      className="flex items-stretch gap-0 border-t overflow-hidden"
      style={{
        borderColor: "var(--ag-border)",
        background: "linear-gradient(135deg, rgba(0,212,170,0.03) 0%, var(--ag-surface) 50%, rgba(99,102,241,0.03) 100%)",
        minHeight: 72,
        maxHeight: 72,
      }}
    >
      {/* LEFT: Live clock + session stats */}
      <div
        className="flex flex-col justify-center px-4 border-r shrink-0"
        style={{ borderColor: "var(--ag-border)", minWidth: 140 }}
      >
        <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "var(--ag-muted)" }}>
          NUR Terminal
        </div>
        <div className="text-[15px] font-mono font-bold tabular-nums" style={{ color: "var(--ag-accent)" }}>
          {time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>
          {time.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* MIDDLE-LEFT: Portfolio P&L */}
      <div
        className="flex flex-col justify-center px-4 border-r shrink-0"
        style={{ borderColor: "var(--ag-border)", minWidth: 160 }}
      >
        <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "var(--ag-muted)" }}>
          Portfolio NAV
        </div>
        <div className="text-[15px] font-mono font-bold tabular-nums" style={{ color: "var(--ag-text)" }}>
          ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold" style={{ color: pnlColor }}>
            {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono px-1 rounded" style={{ background: pnlColor + "18", color: pnlColor }}>
            {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* MIDDLE: Win/Loss Gauge */}
      <div
        className="flex flex-col justify-center px-4 border-r shrink-0"
        style={{ borderColor: "var(--ag-border)", minWidth: 130 }}
      >
        <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>
          {positionCount} Positions · Win Rate
        </div>
        <div className="flex items-center gap-1.5">
          {/* Segmented bar */}
          <div className="flex-1 h-2 rounded-full overflow-hidden flex" style={{ background: "var(--ag-border)" }}>
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${winRate}%`, background: "linear-gradient(to right, #00d4aa, #00a880)" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono font-bold" style={{ color: "#00d4aa" }}>▲ {gainers}</span>
          <span className="text-[10px] font-mono font-bold" style={{ color: "#ef4444" }}>▼ {losers}</span>
          <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{winRate.toFixed(0)}% win</span>
        </div>
      </div>

      {/* MIDDLE: Top Movers with sparklines */}
      <div className="flex items-center gap-1 px-3 border-r flex-shrink overflow-hidden" style={{ borderColor: "var(--ag-border)" }}>
        {topMovers.map((p) => (
          <div key={p.symbol} className="flex flex-col items-center gap-0.5 shrink-0">
            <MiniSparkLine change={p.changePercent} />
            <div className="text-[8px] font-bold font-mono" style={{ color: "var(--ag-accent)" }}>{p.symbol}</div>
            <div
              className="text-[8px] font-mono"
              style={{ color: p.changePercent >= 0 ? "#00d4aa" : "#ef4444" }}
            >
              {p.changePercent >= 0 ? "+" : ""}{p.changePercent.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: AI Insight ticker */}
      <div className="flex flex-col justify-center px-4 flex-1 min-w-0 border-r" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#6366f1" }}
          />
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "#6366f1" }}>
            AI Intelligence
          </span>
        </div>
        <div
          className="text-[10px] leading-relaxed truncate transition-all duration-300"
          style={{
            color: "var(--ag-text)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
          }}
        >
          {INSIGHTS[insightIdx]}
        </div>
        <div className="flex items-center gap-0.5 mt-1">
          {INSIGHTS.map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300"
              style={{
                width: i === insightIdx ? 14 : 4,
                background: i === insightIdx ? "#6366f1" : "var(--ag-border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* FAR RIGHT: Avg change + market status */}
      <div className="flex flex-col justify-center px-4 shrink-0" style={{ minWidth: 120 }}>
        <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "var(--ag-muted)" }}>
          Avg Change
        </div>
        <div
          className="text-[18px] font-mono font-bold"
          style={{ color: avgChange >= 0 ? "#00d4aa" : "#ef4444" }}
        >
          {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
        </div>
        <div
          className="text-[9px] px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-0.5 w-fit"
          style={{
            background: avgChange >= 0.5 ? "rgba(0,212,170,0.1)" : avgChange <= -0.5 ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)",
            color: avgChange >= 0.5 ? "#00d4aa" : avgChange <= -0.5 ? "#ef4444" : "#6366f1",
          }}
        >
          <span className="w-1 h-1 rounded-full inline-block animate-pulse" style={{ background: "currentColor" }} />
          {avgChange >= 0.5 ? "BULL MODE" : avgChange <= -0.5 ? "BEAR MODE" : "NEUTRAL"}
        </div>
      </div>
    </div>
  );
}
