"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "current" | "history" | "signals" | "playbook";
type Regime = "RISK-ON" | "RISK-OFF" | "TRANSITION";
type Signal = "green" | "yellow" | "red";

const CURRENT_REGIME: Regime = "RISK-ON";

const INDICATORS = [
  { name: "VIX Level", value: 14.2, threshold: 20, unit: "", direction: "below" as const, signal: "green" as Signal },
  { name: "Yield Curve (10Y-2Y)", value: 0.42, threshold: 0, unit: "bp", direction: "above" as const, signal: "green" as Signal },
  { name: "IG Credit Spread", value: 92, threshold: 150, unit: "bp", direction: "below" as const, signal: "green" as Signal },
  { name: "Equity Momentum (SPX 200d)", value: 8.4, threshold: 0, unit: "%", direction: "above" as const, signal: "green" as Signal },
  { name: "Market Breadth (A/D)", value: 1.35, threshold: 1.0, unit: "", direction: "above" as const, signal: "green" as Signal },
  { name: "USD Strength (DXY)", value: 104.8, threshold: 105, unit: "", direction: "below" as const, signal: "yellow" as Signal },
  { name: "Commodity Trend (CRB)", value: -1.2, threshold: 0, unit: "%", direction: "above" as const, signal: "yellow" as Signal },
  { name: "Liquidity (Fed B/S QoQ)", value: -2.1, threshold: -5, unit: "%", direction: "above" as const, signal: "yellow" as Signal },
];

const HISTORY: { month: string; regime: Regime }[] = [
  { month: "Dec 25", regime: "RISK-ON" },
  { month: "Jan 26", regime: "RISK-ON" },
  { month: "Feb 26", regime: "TRANSITION" },
  { month: "Mar 26", regime: "RISK-OFF" },
  { month: "Apr 26", regime: "RISK-OFF" },
  { month: "May 26", regime: "TRANSITION" },
  { month: "Jun 26", regime: "RISK-ON" },
  { month: "Jul 26", regime: "RISK-ON" },
  { month: "Aug 26", regime: "RISK-ON" },
  { month: "Sep 26", regime: "TRANSITION" },
  { month: "Oct 26", regime: "RISK-ON" },
  { month: "Nov 26", regime: "RISK-ON" },
];

const SIGNALS = [
  { date: "2026-11-12", indicator: "VIX", direction: "↓ Below 15", strength: "Strong", confirmed: true },
  { date: "2026-11-08", indicator: "SPX Breadth", direction: "↑ Above 1.3", strength: "Strong", confirmed: true },
  { date: "2026-11-01", indicator: "IG Spreads", direction: "↓ Tightening", strength: "Moderate", confirmed: true },
  { date: "2026-10-28", indicator: "Yield Curve", direction: "↑ Steepening", strength: "Moderate", confirmed: true },
  { date: "2026-10-22", indicator: "DXY", direction: "↓ Weakening", strength: "Weak", confirmed: false },
  { date: "2026-10-15", indicator: "CRB Index", direction: "↓ Declining", strength: "Weak", confirmed: false },
  { date: "2026-10-08", indicator: "Fed Liquidity", direction: "↓ Tightening", strength: "Moderate", confirmed: true },
  { date: "2026-09-30", indicator: "VIX Term Struct", direction: "↑ Contango", strength: "Strong", confirmed: true },
  { date: "2026-09-22", indicator: "HY Spreads", direction: "↓ Tightening", strength: "Strong", confirmed: true },
  { date: "2026-09-15", indicator: "Equity Momentum", direction: "↑ Accelerating", strength: "Strong", confirmed: true },
];

const PLAYBOOK: Record<Regime, { overweight: string[]; underweight: string[]; color: string }> = {
  "RISK-ON": {
    overweight: ["Growth Equities", "High Yield Credit", "EM Equities", "Cyclical Sectors", "Small Caps", "Commodities (Industrial)"],
    underweight: ["Long-Duration Treasuries", "Gold", "Defensive Sectors", "Cash", "USD", "Volatility Products"],
    color: "#22c55e",
  },
  "RISK-OFF": {
    overweight: ["US Treasuries", "Gold", "USD Cash", "Defensive Equities", "Investment Grade", "Volatility (Long VIX)"],
    underweight: ["High Yield", "EM Debt", "Cyclicals", "Small Caps", "Leveraged Products", "Commodity Currencies"],
    color: "#ef4444",
  },
  "TRANSITION": {
    overweight: ["Quality Factor", "Barbell (Treasuries + Select Growth)", "Optionality (Straddles)", "Market Neutral"],
    underweight: ["Momentum Factor", "Concentrated Bets", "Illiquid Assets", "High Beta"],
    color: "#fbbf24",
  },
};

const regimeColor = (r: Regime) => r === "RISK-ON" ? "#22c55e" : r === "RISK-OFF" ? "#ef4444" : "#fbbf24";

export default function MarketRegimePanel() {
  const [tab, setTab] = useState<Tab>("current");

  const greenCount = INDICATORS.filter(i => i.signal === "green").length;
  const yellowCount = INDICATORS.filter(i => i.signal === "yellow").length;
  const redCount = INDICATORS.filter(i => i.signal === "red").length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔮</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MARKET REGIME</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Regime Detection</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["current", "history", "signals", "playbook"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "REGIME", value: CURRENT_REGIME, color: regimeColor(CURRENT_REGIME) },
          { label: "GREEN", value: `${greenCount}/8`, color: "#22c55e" },
          { label: "YELLOW", value: `${yellowCount}/8`, color: "#fbbf24" },
          { label: "RED", value: `${redCount}/8`, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-3 py-2">

        {/* ── CURRENT ── */}
        {tab === "current" && (
          <div className="space-y-3">
            {/* Large regime badge */}
            <div className="flex items-center justify-center py-4 rounded"
              style={{ background: `${regimeColor(CURRENT_REGIME)}10`, border: `2px solid ${regimeColor(CURRENT_REGIME)}40` }}>
              <div className="text-center">
                <div className="text-2xl font-black tracking-widest" style={{ color: regimeColor(CURRENT_REGIME) }}>
                  {CURRENT_REGIME}
                </div>
                <div className="text-[9px] mt-1" style={{ color: "#94a3b8" }}>
                  {greenCount} of 8 indicators bullish · Confidence: {Math.round((greenCount / 8) * 100)}%
                </div>
              </div>
            </div>

            {/* Indicator gauges */}
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REGIME INDICATORS</div>
            <div className="space-y-1.5">
              {INDICATORS.map(ind => {
                const sigColor = ind.signal === "green" ? "#22c55e" : ind.signal === "yellow" ? "#fbbf24" : "#ef4444";
                const pct = ind.direction === "below"
                  ? Math.max(0, Math.min(100, ((ind.threshold - ind.value) / ind.threshold) * 100))
                  : Math.max(0, Math.min(100, (ind.value / (ind.threshold * 3 || 1)) * 100));
                return (
                  <div key={ind.name} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: sigColor }} />
                    <span className="w-40 truncate" style={{ color: "#e2e8f0" }}>{ind.name}</span>
                    <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: sigColor }} />
                    </div>
                    <span className="font-mono w-16 text-right" style={{ color: sigColor }}>
                      {ind.value}{ind.unit}
                    </span>
                    <span className="text-[8px] w-20 text-right" style={{ color: "#64748b" }}>
                      thr: {ind.threshold}{ind.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>12-MONTH REGIME TIMELINE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 600 80" className="w-full" style={{ maxHeight: 80 }}>
                {HISTORY.map((h, i) => {
                  const w = 600 / HISTORY.length;
                  const col = regimeColor(h.regime);
                  return (
                    <g key={i}>
                      <rect x={i * w + 1} y={10} width={w - 2} height={35} rx={3} fill={col} opacity={0.7} />
                      <text x={i * w + w / 2} y={58} fill="#94a3b8" fontSize="7" textAnchor="middle">{h.month}</text>
                      <text x={i * w + w / 2} y={31} fill="#0a0e17" fontSize="6" fontWeight="bold" textAnchor="middle">
                        {h.regime === "RISK-ON" ? "ON" : h.regime === "RISK-OFF" ? "OFF" : "TR"}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex justify-center gap-4 mt-2 text-[8px]">
                <span style={{ color: "#22c55e" }}>■ Risk-On</span>
                <span style={{ color: "#fbbf24" }}>■ Transition</span>
                <span style={{ color: "#ef4444" }}>■ Risk-Off</span>
              </div>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REGIME DISTRIBUTION (12M)</div>
            {(["RISK-ON", "RISK-OFF", "TRANSITION"] as Regime[]).map(r => {
              const count = HISTORY.filter(h => h.regime === r).length;
              const pct = (count / HISTORY.length) * 100;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="w-24 font-bold" style={{ color: regimeColor(r) }}>{r}</span>
                  <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: regimeColor(r) }} />
                  </div>
                  <span className="font-mono w-16 text-right" style={{ color: "#e2e8f0" }}>{count}mo ({pct.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SIGNALS ── */}
        {tab === "signals" && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REGIME CHANGE SIGNALS</div>
            <div className="text-[9px] mb-1" style={{ color: "#64748b" }}>Most recent first · Confirmed = signal validated by 2+ corroborating indicators</div>
            {SIGNALS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-mono w-20 text-[9px]" style={{ color: "#64748b" }}>{s.date}</span>
                <span className="font-bold w-28" style={{ color: "#00e5a0" }}>{s.indicator}</span>
                <span className="w-28" style={{ color: s.direction.startsWith("↑") ? "#22c55e" : "#ef4444" }}>{s.direction}</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold w-16 text-center"
                  style={{
                    background: s.strength === "Strong" ? "rgba(34,197,94,0.15)" : s.strength === "Moderate" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
                    color: s.strength === "Strong" ? "#22c55e" : s.strength === "Moderate" ? "#fbbf24" : "#94a3b8"
                  }}>
                  {s.strength}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                  style={{
                    background: s.confirmed ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)",
                    color: s.confirmed ? "#22c55e" : "#ef4444"
                  }}>
                  {s.confirmed ? "CONFIRMED" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── PLAYBOOK ── */}
        {tab === "playbook" && (
          <div className="space-y-3">
            {(["RISK-ON", "TRANSITION", "RISK-OFF"] as Regime[]).map(regime => {
              const book = PLAYBOOK[regime];
              const isCurrent = regime === CURRENT_REGIME;
              return (
                <div key={regime} className="p-3 rounded"
                  style={{
                    background: isCurrent ? `${book.color}08` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isCurrent ? `${book.color}40` : "rgba(255,255,255,0.05)"}`,
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-sm" style={{ color: book.color }}>{regime}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${book.color}20`, color: book.color }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[8px] font-bold mb-1.5" style={{ color: "#22c55e" }}>OVERWEIGHT</div>
                      <div className="space-y-1">
                        {book.overweight.map(item => (
                          <div key={item} className="flex items-center gap-1.5 text-[9px]">
                            <span style={{ color: "#22c55e" }}>▲</span>
                            <span style={{ color: "#e2e8f0" }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold mb-1.5" style={{ color: "#ef4444" }}>UNDERWEIGHT</div>
                      <div className="space-y-1">
                        {book.underweight.map(item => (
                          <div key={item} className="flex items-center gap-1.5 text-[9px]">
                            <span style={{ color: "#ef4444" }}>▼</span>
                            <span style={{ color: "#e2e8f0" }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
