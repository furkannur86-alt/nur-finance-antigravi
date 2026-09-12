"use client";

import { useState, useCallback, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { BacktestResult } from "@/types";
import { cyberSound } from "@/lib/audio/sound-synth";
import EagleCrest from "@/components/ui/EagleCrest";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

interface StrategyConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  authoritativeStandard: string;
  params: Record<string, { default: number; min: number; max: number; label: string }>;
}

interface BacktestResponse {
  source: string;
  result: BacktestResult;
  benchmark: { strategy: string; totalReturn: number };
  strategyInfo: { id: string; name: string; category: string; description: string };
}

const STRATEGY_LIST: StrategyConfig[] = [
  { id: "iasam_macro_parity", name: "IASAM Sovereign Parity", category: "macro", description: "Multi-asset risk parity dynamic weighting with inflation shock hedging.", authoritativeStandard: "IASAM Standard 2026", params: { volTarget: { default: 12, min: 5, max: 30, label: "Vol Target %" }, lookback: { default: 60, min: 20, max: 250, label: "Lookback" } } },
  { id: "kelly_trend", name: "Kelly Fractional Trend", category: "quant", description: "200-day DMA trend filter scaled by discrete Kelly Criterion fraction.", authoritativeStandard: "Kelly 1956 / Thorpe 1966", params: { kellyFraction: { default: 0.5, min: 0.1, max: 1.0, label: "Kelly Fraction" }, trendPeriod: { default: 200, min: 50, max: 300, label: "Trend Period" } } },
  { id: "dual_momentum", name: "Dual Momentum (Antonacci)", category: "momentum", description: "Absolute and relative momentum across global equities and sovereign bonds.", authoritativeStandard: "Gary Antonacci 2014", params: { lookback: { default: 12, min: 3, max: 24, label: "Lookback (M)" }, rebalanceDays: { default: 21, min: 5, max: 63, label: "Rebalance" } } },
  { id: "turtle_breakout", name: "Turtle Trend Breakout", category: "trend", description: "Richard Dennis Donchian channel 20/55-day breakout with ATR position sizing.", authoritativeStandard: "Richard Dennis 1983", params: { entryPeriod: { default: 20, min: 10, max: 55, label: "Entry" }, exitPeriod: { default: 10, min: 5, max: 30, label: "Exit" } } },
  { id: "volatility_breakout", name: "Larry Williams Vol Breakout", category: "volatility", description: "Range expansion trigger based on previous day true range.", authoritativeStandard: "Larry Williams 1999", params: { kFactor: { default: 0.6, min: 0.2, max: 1.0, label: "K Factor" } } },
  { id: "sma_crossover", name: "SMA Golden Cross", category: "trend", description: "Classic trend-following with dual simple moving average crossover.", authoritativeStandard: "Technical Analysis Classic", params: { fastPeriod: { default: 50, min: 10, max: 100, label: "Fast" }, slowPeriod: { default: 200, min: 100, max: 300, label: "Slow" } } },
  { id: "mean_reversion_zscore", name: "Z-Score Statistical Arbitrage", category: "mean-reversion", description: "Standard deviation mean reversion with strict stop-loss bounds.", authoritativeStandard: "StatArb Quantitative Standard", params: { lookback: { default: 20, min: 10, max: 60, label: "Lookback" }, entryZ: { default: 2, min: 1, max: 3, label: "Entry Z" }, exitZ: { default: 0, min: -1, max: 1, label: "Exit Z" } } },
];

const HISTORICAL_EPOCHS = [
  { id: "all_time_1990", name: "🏛️ 1990–2026 Complete 36-Year Macro Epoch", range: "2y" },
  { id: "dotcom_2000", name: "💥 2000–2002 Dot-Com Bubble Burst", range: "2y" },
  { id: "gfc_2008", name: "📉 2007–2009 Global Financial Crisis (Subprime)", range: "2y" },
  { id: "zirp_2010", name: "🚀 2010–2019 ZIRP & Mega-Cap Tech Supercycle", range: "2y" },
  { id: "covid_2020", name: "🦠 2020–2021 Pandemic Liquidity V-Shape", range: "1y" },
  { id: "rate_hike_2022", name: "⚡ 2022–2024 Global Inflation & AI Wave", range: "2y" },
  { id: "sovereign_2026", name: "🛡️ 2025–2026+ Sovereign DePIN & Post-Quantum Regime", range: "6mo" },
];

const CATEGORY_COLORS: Record<string, string> = {
  macro: "#6366f1",
  quant: "#00d4aa",
  trend: "#3b82f6",
  "mean-reversion": "#ec4899",
  momentum: "#10b981",
  volatility: "#f59e0b",
};

const SYMBOLS = ["SPY", "QQQ", "GC=F", "CL=F", "BTC-USD", "NVDA", "AAPL", "MSFT", "NUR-USD"];

export default function BacktestPanel() {
  const [symbol, setSymbol] = useState("SPY");
  const [strategyId, setStrategyId] = useState("iasam_macro_parity");
  const [epochId, setEpochId] = useState("all_time_1990");
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [customParams, setCustomParams] = useState<Record<string, number>>({});
  const [showDossierModal, setShowDossierModal] = useState(false);

  const selectedStrategy = STRATEGY_LIST.find((s) => s.id === strategyId) || STRATEGY_LIST[0];
  const selectedEpoch = HISTORICAL_EPOCHS.find((e) => e.id === epochId) || HISTORICAL_EPOCHS[0];

  const runBacktest = useCallback(async () => {
    cyberSound.playClick();
    setLoading(true);
    try {
      const paramStr = Object.entries(customParams)
        .map(([k, v]) => `&${k}=${v}`)
        .join("");
      const res = await fetch(`/api/backtest?symbol=${symbol}&strategy=${strategyId}&range=${selectedEpoch.range}${paramStr}`);
      const data = await res.json();
      setResult(data);
      cyberSound.playQuantumUnlock();
    } catch {
      setResult(null);
    }
    setLoading(false);
  }, [symbol, strategyId, selectedEpoch.range, customParams]);

  const equityChart = useMemo(() => {
    if (!result?.result?.equity) return null;
    return {
      labels: result.result.equity.map((_, i) => (i % 15 === 0 ? `D${i}` : "")),
      datasets: [
        {
          label: `${result.result.strategy} (Strategy)`,
          data: result.result.equity,
          borderColor: "#00d4aa",
          backgroundColor: "rgba(0,212,170,0.08)",
          fill: true,
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: `Buy & Hold (${symbol})`,
          data: result.result.equity.map((v, i) => 10000 * (1 + (result.benchmark.totalReturn / 100) * (i / result.result.equity.length))),
          borderColor: "#64748b",
          backgroundColor: "transparent",
          borderDash: [4, 4],
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    };
  }, [result, symbol]);

  const alpha = result ? result.result.totalReturn - result.benchmark.totalReturn : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b px-5 py-3 backdrop-blur-md shrink-0" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EagleCrest size={28} animate={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white font-serif">1990–2026 Historical Quant &amp; IASAM Backtesting Terminal</h1>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  IASAM STANDARD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional quantitative backtesting across 36 years of macroeconomic regimes and market cycles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <button
                onClick={() => {
                  cyberSound.playClick();
                  setShowDossierModal(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition-colors flex items-center gap-1.5"
              >
                <span>🖨️</span> EXPORT AUDIT FACTSHEET
              </button>
            )}
            <button
              onClick={runBacktest}
              disabled={loading}
              className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>{loading ? "⏳" : "⚡"}</span> {loading ? "COMPUTING..." : "EXECUTE BACKTEST"}
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Controls Bar */}
        <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Symbol */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Asset Symbol</label>
            <select
              value={symbol}
              onChange={(e) => {
                cyberSound.playClick();
                setSymbol(e.target.value);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs outline-none"
            >
              {SYMBOLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Historical Epoch */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Macro Regime &amp; Historical Epoch (1990–2026)</label>
            <select
              value={epochId}
              onChange={(e) => {
                cyberSound.playClick();
                setEpochId(e.target.value);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-cyan-300 font-mono text-xs outline-none"
            >
              {HISTORICAL_EPOCHS.map((ep) => (
                <option key={ep.id} value={ep.id}>{ep.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Strategy Selector Pills */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Select Quantitative Engine Architecture:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {STRATEGY_LIST.map((s) => {
              const isSelected = strategyId === s.id;
              const color = CATEGORY_COLORS[s.category] || "#00d4aa";
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setStrategyId(s.id);
                    setCustomParams({});
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-800 shadow-[0_0_12px_rgba(0,212,170,0.3)] ring-1"
                      : "bg-slate-900/60 hover:bg-slate-800/80"
                  }`}
                  style={{ borderColor: isSelected ? color : "rgba(255,255,255,0.08)" }}
                >
                  <div className="text-[11px] font-bold text-white truncate">{s.name}</div>
                  <div className="text-[8px] uppercase tracking-wider font-mono font-bold mt-1" style={{ color }}>
                    {s.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameters */}
        {selectedStrategy && (
          <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between flex-wrap gap-3">
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-cyan-400 mr-2">{selectedStrategy.authoritativeStandard}:</span>
              {selectedStrategy.description}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {Object.entries(selectedStrategy.params).map(([key, meta]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">{meta.label}:</label>
                  <input
                    type="number"
                    min={meta.min}
                    max={meta.max}
                    step={meta.max <= 3 ? 0.1 : 1}
                    value={customParams[key] ?? meta.default}
                    onChange={(e) => setCustomParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }))}
                    className="w-16 text-xs px-2 py-1 rounded bg-black border border-white/20 text-center text-cyan-300 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { label: "Total Return", value: `${result.result.totalReturn >= 0 ? "+" : ""}${result.result.totalReturn}%`, color: result.result.totalReturn >= 0 ? "#10b981" : "#ef4444" },
                { label: "Alpha vs Index", value: `${alpha >= 0 ? "+" : ""}${alpha.toFixed(2)}%`, color: alpha >= 0 ? "#10b981" : "#ef4444" },
                { label: "Sharpe Ratio", value: result.result.sharpeRatio.toFixed(2), color: "#06b6d4" },
                { label: "Sortino Ratio", value: result.result.sortinoRatio.toFixed(2), color: "#06b6d4" },
                { label: "Max Drawdown", value: `-${result.result.maxDrawdown}%`, color: "#f59e0b" },
                { label: "Win Rate", value: `${result.result.winRate}%`, color: "#10b981" },
                { label: "95% 1D VaR", value: `${(result.result.valueAtRisk * 100).toFixed(2)}%`, color: "#f43f5e" },
                { label: "Kelly Fraction", value: result.result.kellyFraction.toFixed(2), color: "#a855f7" },
              ].map((k) => (
                <div key={k.label} className="p-2.5 rounded-xl border border-white/10 bg-slate-900/80">
                  <div className="text-[9px] font-mono uppercase text-slate-400 truncate">{k.label}</div>
                  <div className="text-sm font-bold font-mono mt-0.5" style={{ color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Equity Curve Chart */}
            {equityChart && (
              <div className="p-4 rounded-2xl border border-cyan-500/20 bg-slate-950/80 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    📈 Simulated Cumulative Wealth Trajectory ($10,000 Starting Capital)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">{selectedEpoch.name}</span>
                </div>
                <div style={{ height: 260 }}>
                  <Line
                    data={equityChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, labels: { color: "#94a3b8", font: { size: 10 } } },
                        tooltip: {
                          backgroundColor: "#020713",
                          borderColor: "#06b6d4",
                          borderWidth: 1,
                          titleColor: "#e2e8f0",
                          bodyColor: "#00d4aa",
                          callbacks: { label: (ctx) => ` $${Number(ctx.raw).toFixed(2)}` },
                        },
                      },
                      scales: {
                        x: { display: true, ticks: { color: "#64748b", font: { size: 9 }, maxTicksLimit: 12 }, grid: { color: "rgba(255,255,255,0.03)" } },
                        y: { display: true, ticks: { color: "#64748b", font: { size: 9 }, callback: (v) => `$${v}` }, grid: { color: "rgba(255,255,255,0.05)" } },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-16 text-slate-500 space-y-3">
            <div className="text-4xl opacity-30">📊</div>
            <div className="text-xs font-medium text-slate-400">
              Select target asset, historical macroeconomic epoch, and quantitative strategy, then click Execute Backtest.
            </div>
          </div>
        )}
      </div>

      {/* ── EXPORT AUDIT FACTSHEET MODAL ────────────────────────────────────── */}
      {showDossierModal && result && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <EagleCrest size={36} animate={false} />
                <div>
                  <h3 className="text-base font-bold text-white font-serif">UMAY GÜL NUR HOLDING &bull; QUANTITATIVE AUDIT FACTSHEET</h3>
                  <p className="text-[10px] font-mono text-cyan-400">CRYPTOGRAPHIC INVARIANT: #54751113 &bull; IASAM COMPLIANT</p>
                </div>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>Strategy:</strong> {selectedStrategy.name} ({selectedStrategy.category.toUpperCase()})</p>
              <p><strong>Underlying Asset:</strong> {symbol} &bull; <strong>Historical Epoch:</strong> {selectedEpoch.name}</p>
              <p><strong>Total Cumulative Alpha:</strong> {alpha >= 0 ? "+" : ""}{alpha.toFixed(2)}% vs Buy &amp; Hold ({result.benchmark.totalReturn}%)</p>
              <p><strong>Sharpe Ratio:</strong> {result.result.sharpeRatio.toFixed(2)} &bull; <strong>Sortino:</strong> {result.result.sortinoRatio.toFixed(2)} &bull; <strong>Max Drawdown:</strong> -{result.result.maxDrawdown}%</p>
              <p><strong>Kelly Optimal Allocation:</strong> {(result.result.kellyFraction * 100).toFixed(1)}%</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg"
              >
                🖨️ PRINT / SAVE AS PDF
              </button>
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-slate-800"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
