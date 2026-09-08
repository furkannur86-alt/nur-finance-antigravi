"use client";

import { useState, useEffect, useRef } from "react";

interface Stats {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  totalReturn: number;
}

interface Props {
  totalValue: number;
  totalPnL: number;
  totalReturn: number;
}

export default function LiveMetrics({ totalValue, totalPnL, totalReturn }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    let cancelled = false;
    fetch("/api/indicators?symbol=SPY&indicator=stats&range=1y")
      .then((r) => r.json())
      .then((data) => { if (!cancelled && data.stats) setStats(data.stats); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const metrics = [
    {
      label: "Portfolio Value",
      value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "var(--ag-accent)",
    },
    {
      label: "Total P&L",
      value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: totalPnL >= 0 ? "var(--ag-success)" : "var(--ag-danger)",
    },
    {
      label: "Return",
      value: `${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`,
      color: totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)",
    },
    {
      label: "Sharpe (SPY)",
      value: stats ? stats.sharpeRatio.toFixed(3) : "...",
      color: "var(--ag-accent2)",
    },
    {
      label: "Max DD (SPY)",
      value: stats ? `-${stats.maxDrawdown.toFixed(2)}%` : "...",
      color: "var(--ag-warning)",
    },
    {
      label: "Vol (SPY)",
      value: stats ? `${stats.volatility.toFixed(2)}%` : "...",
      color: "var(--ag-accent)",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border p-2"
          style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>
            {m.label}
          </div>
          <div className="text-sm font-bold" style={{ color: m.color }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}
