"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const ASSET_CLASSES = [
  { name: "US Equities", ticker: "SPY", weight: 35, targetWeight: 30, return1y: 24.5, vol: 15.2, sharpe: 1.61, color: "#22c55e" },
  { name: "Intl Equities", ticker: "EFA", weight: 15, targetWeight: 20, return1y: 12.8, vol: 14.8, sharpe: 0.86, color: "#38bdf8" },
  { name: "EM Equities", ticker: "EEM", weight: 8, targetWeight: 10, return1y: 8.4, vol: 18.5, sharpe: 0.45, color: "#a855f7" },
  { name: "US Treasuries", ticker: "TLT", weight: 15, targetWeight: 15, return1y: 2.1, vol: 12.4, sharpe: 0.17, color: "#fbbf24" },
  { name: "IG Credit", ticker: "LQD", weight: 8, targetWeight: 8, return1y: 4.8, vol: 7.2, sharpe: 0.67, color: "#06b6d4" },
  { name: "HY Credit", ticker: "HYG", weight: 5, targetWeight: 5, return1y: 8.2, vol: 8.5, sharpe: 0.96, color: "#f97316" },
  { name: "Commodities", ticker: "DBC", weight: 5, targetWeight: 5, return1y: 6.5, vol: 14.1, sharpe: 0.46, color: "#ef4444" },
  { name: "Real Estate", ticker: "VNQ", weight: 4, targetWeight: 4, return1y: 11.2, vol: 16.8, sharpe: 0.67, color: "#e879f9" },
  { name: "Cash", ticker: "BIL", weight: 5, targetWeight: 3, return1y: 5.2, vol: 0.3, sharpe: 17.3, color: "#94a3b8" },
];

const MODELS = [
  { name: "Strategic (60/40)", equity: 60, fi: 30, alt: 10, expectedReturn: 8.2, vol: 11.5 },
  { name: "Aggressive Growth", equity: 80, fi: 10, alt: 10, expectedReturn: 10.5, vol: 16.2 },
  { name: "Conservative Income", equity: 30, fi: 55, alt: 15, expectedReturn: 5.8, vol: 7.4 },
  { name: "Risk Parity", equity: 25, fi: 50, alt: 25, expectedReturn: 7.1, vol: 8.8 },
  { name: "All Weather", equity: 30, fi: 40, alt: 30, expectedReturn: 6.5, vol: 7.2 },
];

type Tab = "current" | "optimizer" | "models" | "rebalance";

export default function AssetAllocationPanel() {
  const [tab, setTab] = useState<Tab>("current");
  const [riskTarget, setRiskTarget] = useState(12);

  const totalWeight = ASSET_CLASSES.reduce((s, a) => s + a.weight, 0);
  const portfolioReturn = ASSET_CLASSES.reduce((s, a) => s + (a.weight / 100) * a.return1y, 0);
  const drift = ASSET_CLASSES.reduce((s, a) => s + Math.abs(a.weight - a.targetWeight), 0) / 2;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ASSET ALLOCATION</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Bloomberg PORT</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["current", "optimizer", "models", "rebalance"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "PORTFOLIO RETURN", value: `+${portfolioReturn.toFixed(1)}%`, color: "#22c55e" },
          { label: "DRIFT", value: `${drift.toFixed(1)}%`, color: drift > 5 ? "#ef4444" : "#fbbf24" },
          { label: "# ASSETS", value: ASSET_CLASSES.length.toString(), color: "#38bdf8" },
          { label: "RISK TARGET", value: `${riskTarget}% vol`, color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "current" && (
          <div className="space-y-2">
            {/* Visual pie-like bar */}
            <div className="flex h-6 rounded-lg overflow-hidden mb-3">
              {ASSET_CLASSES.map(a => (
                <div key={a.ticker} style={{ width: `${a.weight}%`, background: a.color }} title={`${a.name} ${a.weight}%`}
                  className="flex items-center justify-center text-[7px] font-bold text-black/70 overflow-hidden">
                  {a.weight >= 8 ? a.ticker : ""}
                </div>
              ))}
            </div>

            {ASSET_CLASSES.map(a => (
              <div key={a.ticker} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                <span className="font-bold w-20" style={{ color: a.color }}>{a.name}</span>
                <span className="font-mono w-10" style={{ color: "#64748b" }}>{a.ticker}</span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${a.weight * 2.5}%`, background: a.color }} />
                  </div>
                </div>
                <span className="font-mono w-10 text-right" style={{ color: "#e2e8f0" }}>{a.weight}%</span>
                <span className="font-mono w-10 text-right text-[9px]" style={{ color: "#64748b" }}>tgt {a.targetWeight}%</span>
                <span className="font-mono w-14 text-right" style={{ color: a.return1y > 0 ? "#22c55e" : "#ef4444" }}>
                  {a.return1y > 0 ? "+" : ""}{a.return1y}%
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "optimizer" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>MEAN-VARIANCE OPTIMIZER</div>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px]" style={{ color: "#64748b" }}>Risk Target (Annual Vol %)</label>
                  <input type="range" min={5} max={25} value={riskTarget} onChange={e => setRiskTarget(Number(e.target.value))}
                    className="w-full mt-1" />
                  <div className="flex justify-between text-[8px]" style={{ color: "#64748b" }}>
                    <span>Conservative (5%)</span>
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{riskTarget}%</span>
                    <span>Aggressive (25%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>EFFICIENT FRONTIER</div>
              <svg viewBox="0 0 300 150" className="w-full" style={{ maxHeight: 150 }}>
                <rect x="0" y="0" width="300" height="150" fill="transparent" />
                {/* Grid */}
                {[0, 30, 60, 90, 120].map(y => (
                  <line key={y} x1="30" y1={y + 10} x2="290" y2={y + 10} stroke="rgba(255,255,255,0.05)" />
                ))}
                {/* Frontier curve */}
                <path d="M 50 130 Q 100 90, 140 60 Q 180 30, 220 25 Q 260 22, 280 24" fill="none" stroke="#00e5a0" strokeWidth="2" />
                {/* Points */}
                {MODELS.map((m, i) => (
                  <g key={i}>
                    <circle cx={30 + m.vol * 15} cy={140 - m.expectedReturn * 10} r="4" fill={i === 0 ? "#fbbf24" : "#38bdf8"} />
                    <text x={30 + m.vol * 15} y={140 - m.expectedReturn * 10 - 8} fill="#94a3b8" fontSize="6" textAnchor="middle">{m.name.split(" ")[0]}</text>
                  </g>
                ))}
                {/* Current portfolio */}
                <circle cx={30 + 12 * 15} cy={140 - portfolioReturn * 10 / 2.4} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                <text x={30 + 12 * 15 + 10} y={140 - portfolioReturn * 10 / 2.4 + 3} fill="#ef4444" fontSize="7">Current</text>
                {/* Axes */}
                <text x="150" y="148" fill="#64748b" fontSize="7" textAnchor="middle">Volatility (%)</text>
                <text x="10" y="75" fill="#64748b" fontSize="7" textAnchor="middle" transform="rotate(-90,10,75)">Return (%)</text>
              </svg>
            </div>
          </div>
        )}

        {tab === "models" && (
          <div className="space-y-2">
            {MODELS.map((m, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{m.name}</span>
                  <div className="flex gap-2 text-[9px]">
                    <span style={{ color: "#22c55e" }}>E[R]: {m.expectedReturn}%</span>
                    <span style={{ color: "#fbbf24" }}>Vol: {m.vol}%</span>
                  </div>
                </div>
                <div className="flex h-4 rounded overflow-hidden">
                  <div style={{ width: `${m.equity}%`, background: "#22c55e" }} className="flex items-center justify-center text-[7px] font-bold text-black/70">
                    {m.equity}% Eq
                  </div>
                  <div style={{ width: `${m.fi}%`, background: "#38bdf8" }} className="flex items-center justify-center text-[7px] font-bold text-black/70">
                    {m.fi}% FI
                  </div>
                  <div style={{ width: `${m.alt}%`, background: "#a855f7" }} className="flex items-center justify-center text-[7px] font-bold text-black/70">
                    {m.alt}% Alt
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rebalance" && (
          <div className="space-y-2">
            <div className="p-2 rounded mb-2" style={{ background: "rgba(251,191,36,0.08)", color: "#fbbf24" }}>
              <span className="text-[9px]">Rebalance needed — drift exceeds 5% threshold</span>
            </div>
            {ASSET_CLASSES.map(a => {
              const diff = a.targetWeight - a.weight;
              if (Math.abs(diff) < 0.5) return null;
              return (
                <div key={a.ticker} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="font-bold w-20" style={{ color: a.color }}>{a.name}</span>
                  <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{a.weight}%</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span className="font-mono w-10" style={{ color: "#e2e8f0" }}>{a.targetWeight}%</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ background: diff > 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: diff > 0 ? "#22c55e" : "#ef4444" }}>
                    {diff > 0 ? "BUY" : "SELL"} {Math.abs(diff)}%
                  </span>
                </div>
              );
            })}
            <button className="w-full py-2 rounded text-[10px] font-bold mt-2" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
              EXECUTE REBALANCE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
