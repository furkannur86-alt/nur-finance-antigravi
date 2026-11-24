"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "pricing" | "risk-models" | "backtesting" | "signals";

export default function QuantitativeModelsPanel() {
  const [tab, setTab] = useState<Tab>("pricing");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🧮</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>QUANTITATIVE MODELS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg QMOD</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["pricing", "risk-models", "backtesting", "signals"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "risk-models" ? "Risk" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "pricing" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>OPTION PRICING MODELS</div>
            {[
              { model: "Black-Scholes", asset: "SPX Call 5500 Mar27", bsPrice: 182.50, mktPrice: 185.20, diff: -1.46, vol: "implied" },
              { model: "Heston SV", asset: "SPX Call 5500 Mar27", bsPrice: 184.80, mktPrice: 185.20, diff: -0.22, vol: "stochastic" },
              { model: "SABR", asset: "EUR/USD 1.0850C Mar27", bsPrice: 0.0142, mktPrice: 0.0145, diff: -2.07, vol: "SABR" },
              { model: "Local Vol", asset: "AAPL Put 180 Mar27", bsPrice: 5.85, mktPrice: 5.92, diff: -1.18, vol: "local" },
              { model: "Jump Diffusion", asset: "BTC Call 100K Mar27", bsPrice: 4250, mktPrice: 4480, diff: -5.13, vol: "Merton" },
            ].map(m => (
              <div key={m.asset} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{m.model}</span>
                    <span className="font-bold">{m.asset}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Vol: {m.vol}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Model:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{typeof m.bsPrice === "number" && m.bsPrice > 100 ? `$${m.bsPrice.toLocaleString()}` : m.bsPrice}</span></div>
                  <div><span style={{ color: "#64748b" }}>Market:</span> <span className="font-mono" style={{ color: "#00e5a0" }}>{typeof m.mktPrice === "number" && m.mktPrice > 100 ? `$${m.mktPrice.toLocaleString()}` : m.mktPrice}</span></div>
                  <div><span style={{ color: "#64748b" }}>Diff:</span> <span className="font-mono" style={{ color: Math.abs(m.diff) < 1 ? "#22c55e" : Math.abs(m.diff) < 3 ? "#fbbf24" : "#ef4444" }}>{m.diff > 0 ? "+" : ""}{m.diff}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "risk-models" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PORTFOLIO RISK METRICS</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "VaR (95%, 1D)", val: "$2.4M", color: "#ef4444" },
                { label: "CVaR (95%)", val: "$3.8M", color: "#ef4444" },
                { label: "Max Drawdown", val: "-12.5%", color: "#fbbf24" },
                { label: "Sharpe Ratio", val: "1.85", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FACTOR RISK DECOMPOSITION</div>
            {[
              { factor: "Market Beta", contrib: 65, vol: 12.5, beta: 1.05 },
              { factor: "Size (SMB)", contrib: 8, vol: 4.2, beta: -0.15 },
              { factor: "Value (HML)", contrib: 5, vol: 3.8, beta: 0.22 },
              { factor: "Momentum", contrib: 12, vol: 5.5, beta: 0.35 },
              { factor: "Quality", contrib: 4, vol: 2.8, beta: 0.18 },
              { factor: "Idiosyncratic", contrib: 6, vol: 8.2, beta: 0 },
            ].map(f => (
              <div key={f.factor} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{f.factor}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${f.contrib}%`, background: "#6366f1", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-10 text-right">{f.contrib}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>σ {f.vol}%</span>
                <span className="font-mono w-12 text-right" style={{ color: f.beta > 0 ? "#22c55e" : f.beta < 0 ? "#ef4444" : "#64748b" }}>β {f.beta}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRESS SCENARIOS</div>
            {[
              { scenario: "2008 GFC Replay", impact: -28.5, prob: "5%" },
              { scenario: "COVID Crash (Mar 2020)", impact: -18.2, prob: "8%" },
              { scenario: "Rate Shock (+200bp)", impact: -8.5, prob: "15%" },
              { scenario: "USD Surge (+15%)", impact: -5.2, prob: "12%" },
              { scenario: "Oil Spike ($150)", impact: -6.8, prob: "10%" },
            ].map(s => (
              <div key={s.scenario} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="flex-1">{s.scenario}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#ef4444" }}>{s.impact}%</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{s.prob}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "backtesting" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRATEGY BACKTEST RESULTS</div>
            {[
              { name: "Momentum (12M-1M)", cagr: 14.2, sharpe: 1.42, maxDD: -18.5, calmar: 0.77, win: 62, trades: 1250 },
              { name: "Mean Reversion (Pairs)", cagr: 8.5, sharpe: 1.85, maxDD: -8.2, calmar: 1.04, win: 55, trades: 4800 },
              { name: "Carry Trade (G10)", cagr: 6.8, sharpe: 0.95, maxDD: -22.5, calmar: 0.30, win: 58, trades: 520 },
              { name: "Vol Selling (Iron Condor)", cagr: 12.5, sharpe: 1.65, maxDD: -15.8, calmar: 0.79, win: 72, trades: 2400 },
              { name: "Statistical Arb", cagr: 18.5, sharpe: 2.15, maxDD: -6.5, calmar: 2.85, win: 54, trades: 12500 },
            ].map(s => (
              <div key={s.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="font-bold mb-1">{s.name}</div>
                <div className="grid grid-cols-6 gap-2 text-[9px]">
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>CAGR</div><div className="font-mono font-bold" style={{ color: "#22c55e" }}>{s.cagr}%</div></div>
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>Sharpe</div><div className="font-mono font-bold" style={{ color: s.sharpe > 1.5 ? "#22c55e" : "#fbbf24" }}>{s.sharpe}</div></div>
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>Max DD</div><div className="font-mono font-bold" style={{ color: "#ef4444" }}>{s.maxDD}%</div></div>
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>Calmar</div><div className="font-mono font-bold" style={{ color: s.calmar > 1 ? "#22c55e" : "#fbbf24" }}>{s.calmar}</div></div>
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>Win%</div><div className="font-mono font-bold">{s.win}%</div></div>
                  <div className="text-center"><div className="text-[7px]" style={{ color: "#64748b" }}>Trades</div><div className="font-mono">{s.trades.toLocaleString()}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "signals" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LIVE QUANTITATIVE SIGNALS</div>
            {[
              { signal: "Equity Momentum", direction: "LONG", strength: 78, assets: "US Large Cap", timestamp: "14:32 UTC" },
              { signal: "Credit Spread Mean Rev", direction: "SHORT", strength: 65, assets: "HY CDX", timestamp: "14:28 UTC" },
              { signal: "FX Carry", direction: "LONG", strength: 82, assets: "MXN, BRL, INR", timestamp: "14:15 UTC" },
              { signal: "Vol Term Structure", direction: "SHORT", strength: 55, assets: "VIX Futures", timestamp: "14:05 UTC" },
              { signal: "Rates Momentum", direction: "SHORT", strength: 72, assets: "UST 10Y", timestamp: "13:55 UTC" },
              { signal: "Commodity Trend", direction: "LONG", strength: 68, assets: "Gold, Copper", timestamp: "13:45 UTC" },
              { signal: "Equity Value", direction: "LONG", strength: 42, assets: "Europe Value", timestamp: "13:30 UTC" },
            ].map(s => (
              <div key={s.signal} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.signal}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.direction === "LONG" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: s.direction === "LONG" ? "#22c55e" : "#ef4444",
                    }}>{s.direction}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{s.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{s.assets}</span>
                  <div className="flex-1 h-1.5 rounded-full ml-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.strength}%`, background: s.strength > 70 ? "#22c55e" : s.strength > 50 ? "#fbbf24" : "#64748b", opacity: 0.6 }} />
                  </div>
                  <span className="font-mono w-10 text-right" style={{ color: s.strength > 70 ? "#22c55e" : s.strength > 50 ? "#fbbf24" : "#64748b" }}>{s.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
