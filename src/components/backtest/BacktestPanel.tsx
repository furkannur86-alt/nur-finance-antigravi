"use client";

import { useState, useCallback } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

interface StrategyConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  params: Record<string, { default: number; min: number; max: number; label: string }>;
}

interface BacktestResponse {
  source: string;
  result: BacktestResult;
  benchmark: { strategy: string; totalReturn: number };
  strategyInfo: { id: string; name: string; category: string; description: string };
}

const STRATEGY_LIST: StrategyConfig[] = [
  { id: "sma_crossover", name: "SMA Crossover", category: "trend", description: "Classic trend-following with dual SMA.", params: { fastPeriod: { default: 10, min: 3, max: 50, label: "Fast" }, slowPeriod: { default: 30, min: 10, max: 200, label: "Slow" } } },
  { id: "ema_crossover", name: "EMA Crossover", category: "trend", description: "Exponential MA crossover for faster signals.", params: { fastPeriod: { default: 12, min: 3, max: 50, label: "Fast" }, slowPeriod: { default: 26, min: 10, max: 200, label: "Slow" } } },
  { id: "rsi_mean_reversion", name: "RSI Mean Reversion", category: "mean-reversion", description: "Wilder's RSI overbought/oversold.", params: { period: { default: 14, min: 5, max: 30, label: "Period" }, oversold: { default: 30, min: 10, max: 40, label: "Oversold" }, overbought: { default: 70, min: 60, max: 90, label: "Overbought" } } },
  { id: "momentum", name: "Momentum", category: "momentum", description: "Jegadeesh & Titman momentum.", params: { lookback: { default: 20, min: 5, max: 60, label: "Lookback" }, threshold: { default: 2, min: 0.5, max: 10, label: "Threshold %" } } },
  { id: "macd_signal", name: "MACD Signal", category: "trend", description: "Appel's MACD crossover system.", params: { fastPeriod: { default: 12, min: 5, max: 20, label: "Fast" }, slowPeriod: { default: 26, min: 15, max: 50, label: "Slow" }, signalPeriod: { default: 9, min: 3, max: 15, label: "Signal" } } },
  { id: "bollinger_squeeze", name: "Bollinger Squeeze", category: "volatility", description: "Low volatility precedes big moves.", params: { period: { default: 20, min: 10, max: 50, label: "Period" }, stdDev: { default: 2, min: 1, max: 3, label: "Std Dev" }, squeezeThreshold: { default: 4, min: 1, max: 10, label: "Squeeze %" } } },
  { id: "bollinger_bounce", name: "Bollinger Bounce", category: "mean-reversion", description: "Band-to-band mean reversion.", params: { period: { default: 20, min: 10, max: 50, label: "Period" }, stdDev: { default: 2, min: 1, max: 3, label: "Std Dev" } } },
  { id: "adx_trend", name: "ADX Trend", category: "trend", description: "Wilder's DMI + ADX filter.", params: { adxPeriod: { default: 14, min: 7, max: 30, label: "ADX Period" }, adxThreshold: { default: 25, min: 15, max: 40, label: "Threshold" }, smaPeriod: { default: 20, min: 10, max: 50, label: "SMA" } } },
  { id: "ichimoku", name: "Ichimoku Cloud", category: "composite", description: "Complete Japanese trading system.", params: { tenkanPeriod: { default: 9, min: 5, max: 20, label: "Tenkan" }, kijunPeriod: { default: 26, min: 15, max: 52, label: "Kijun" }, senkouBPeriod: { default: 52, min: 30, max: 100, label: "Senkou B" } } },
  { id: "stochastic_rsi", name: "Stochastic + RSI", category: "composite", description: "Dual confirmation reduces false signals.", params: { rsiPeriod: { default: 14, min: 5, max: 30, label: "RSI" }, stochPeriod: { default: 14, min: 5, max: 30, label: "Stoch" }, oversold: { default: 20, min: 10, max: 35, label: "Oversold" }, overbought: { default: 80, min: 65, max: 90, label: "Overbought" } } },
  { id: "turtle_breakout", name: "Turtle Breakout", category: "trend", description: "Richard Dennis' Turtle system.", params: { entryPeriod: { default: 20, min: 10, max: 55, label: "Entry" }, exitPeriod: { default: 10, min: 5, max: 30, label: "Exit" } } },
  { id: "mean_reversion_zscore", name: "Z-Score Reversion", category: "mean-reversion", description: "Trade on standard deviation extremes.", params: { lookback: { default: 20, min: 10, max: 60, label: "Lookback" }, entryZ: { default: 2, min: 1, max: 3, label: "Entry Z" }, exitZ: { default: 0, min: -1, max: 1, label: "Exit Z" } } },
  { id: "dual_momentum", name: "Dual Momentum", category: "momentum", description: "Antonacci's dual momentum.", params: { lookback: { default: 12, min: 3, max: 24, label: "Lookback" }, rebalanceDays: { default: 21, min: 5, max: 63, label: "Rebalance" } } },
  { id: "volatility_breakout", name: "Vol Breakout", category: "volatility", description: "Larry Williams' range expansion.", params: { kFactor: { default: 0.6, min: 0.2, max: 1.0, label: "K Factor" } } },
];

const CATEGORY_COLORS: Record<string, string> = {
  trend: "var(--ag-accent)",
  "mean-reversion": "var(--ag-accent2)",
  momentum: "var(--ag-success)",
  volatility: "var(--ag-warning)",
  composite: "var(--ag-info, #8b5cf6)",
};

const symbols = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "META", "SPY", "QQQ", "IWM", "BTC-USD", "ETH-USD", "GC=F"];
const ranges = ["6mo", "1y", "2y"];

export default function BacktestPanel() {
  const [symbol, setSymbol] = useState("AAPL");
  const [strategyId, setStrategyId] = useState("sma_crossover");
  const [range, setRange] = useState("1y");
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [customParams, setCustomParams] = useState<Record<string, number>>({});

  const selectedStrategy = STRATEGY_LIST.find((s) => s.id === strategyId)!;

  const runBacktest = useCallback(async () => {
    setLoading(true);
    try {
      const paramStr = Object.entries(customParams)
        .map(([k, v]) => `&${k}=${v}`)
        .join("");
      const res = await fetch(`/api/backtest?symbol=${symbol}&strategy=${strategyId}&range=${range}${paramStr}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  }, [symbol, strategyId, range, customParams]);

  const equityChart = result?.result.equity
    ? {
        labels: result.result.equity.map((_, i) => (i % 20 === 0 ? `D${i}` : "")),
        datasets: [
          {
            label: result.result.strategy,
            data: result.result.equity,
            borderColor: "#00d4aa",
            backgroundColor: "rgba(0,212,170,0.08)",
            fill: true,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      }
    : null;

  const alpha = result ? result.result.totalReturn - result.benchmark.totalReturn : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>
        Strategy Backtester
      </h2>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
          >
            {symbols.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>Range</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
          >
            {ranges.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <button
          onClick={runBacktest}
          disabled={loading}
          className="px-3 py-1 rounded text-xs font-medium transition-all disabled:opacity-50"
          style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
        >
          {loading ? "Running..." : "Run Backtest"}
        </button>
      </div>

      {/* Strategy Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {STRATEGY_LIST.map((s) => (
          <button
            key={s.id}
            onClick={() => { setStrategyId(s.id); setCustomParams({}); }}
            className="text-left p-1.5 rounded border transition-all"
            style={{
              background: strategyId === s.id ? "var(--ag-surface)" : "transparent",
              borderColor: strategyId === s.id ? (CATEGORY_COLORS[s.category] || "var(--ag-border)") : "var(--ag-border)",
              opacity: strategyId === s.id ? 1 : 0.6,
            }}
          >
            <div className="text-[10px] font-semibold truncate" style={{ color: strategyId === s.id ? (CATEGORY_COLORS[s.category] || "var(--ag-text)") : "var(--ag-text)" }}>
              {s.name}
            </div>
            <div className="text-[8px] uppercase tracking-wider" style={{ color: CATEGORY_COLORS[s.category] || "var(--ag-muted)" }}>
              {s.category}
            </div>
          </button>
        ))}
      </div>

      {/* Strategy Parameters */}
      {selectedStrategy && (
        <div className="flex items-center gap-3 flex-wrap rounded border p-2" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{selectedStrategy.description}</div>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(selectedStrategy.params).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1">
                <label className="text-[9px] uppercase" style={{ color: "var(--ag-muted)" }}>{meta.label}</label>
                <input
                  type="number"
                  min={meta.min}
                  max={meta.max}
                  step={meta.max <= 3 ? 0.1 : 1}
                  value={customParams[key] ?? meta.default}
                  onChange={(e) => setCustomParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }))}
                  className="w-14 text-xs px-1 py-0.5 rounded border outline-none text-center"
                  style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <>
          {/* Core Metrics */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5">
            {[
              { label: "Total Return", value: `${result.result.totalReturn >= 0 ? "+" : ""}${result.result.totalReturn}%`, color: result.result.totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
              { label: "Sharpe", value: result.result.sharpeRatio.toFixed(3), color: "var(--ag-accent2)" },
              { label: "Sortino", value: result.result.sortinoRatio.toFixed(3), color: "var(--ag-accent2)" },
              { label: "Calmar", value: result.result.calmarRatio.toFixed(3), color: "var(--ag-accent2)" },
              { label: "Max DD", value: `-${result.result.maxDrawdown}%`, color: "var(--ag-warning)" },
              { label: "DD Duration", value: `${result.result.maxDrawdownDuration}d`, color: "var(--ag-warning)" },
              { label: "Win Rate", value: `${result.result.winRate}%`, color: "var(--ag-success)" },
              { label: "Trades", value: String(result.result.trades), color: "var(--ag-text)" },
            ].map((m) => (
              <div key={m.label} className="rounded border p-1.5" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>{m.label}</div>
                <div className="text-xs font-bold" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Risk Metrics */}
          <div className="grid grid-cols-4 lg:grid-cols-6 gap-1.5">
            {[
              { label: "Volatility", value: `${result.result.volatility}%`, color: "var(--ag-accent)" },
              { label: "VaR (95%)", value: `${(result.result.valueAtRisk * 100).toFixed(2)}%`, color: "var(--ag-danger)" },
              { label: "ES (95%)", value: `${(result.result.expectedShortfall * 100).toFixed(2)}%`, color: "var(--ag-danger)" },
              { label: "Kelly f", value: result.result.kellyFraction.toFixed(3), color: "var(--ag-accent2)" },
              { label: "Buy & Hold", value: `${result.benchmark.totalReturn >= 0 ? "+" : ""}${result.benchmark.totalReturn}%`, color: result.benchmark.totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
              { label: "Alpha", value: `${alpha >= 0 ? "+" : ""}${alpha.toFixed(2)}%`, color: alpha >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
            ].map((m) => (
              <div key={m.label} className="rounded border p-1.5" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>{m.label}</div>
                <div className="text-xs font-bold" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Equity Curve */}
          {equityChart && (
            <div className="rounded border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Equity Curve</h3>
              <div style={{ height: 240 }}>
                <Line
                  data={equityChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, labels: { color: "#64748b", font: { size: 10 } } },
                      tooltip: {
                        backgroundColor: "#111827",
                        borderColor: "#1e293b",
                        borderWidth: 1,
                        titleColor: "#e0e6f0",
                        bodyColor: "#00d4aa",
                        callbacks: { label: (ctx) => ` $${(ctx.raw as number).toFixed(2)}` },
                      },
                    },
                    scales: {
                      x: { display: true, ticks: { color: "#334155", font: { size: 9 }, maxTicksLimit: 10 }, grid: { color: "#1e293b20" } },
                      y: { display: true, ticks: { color: "#334155", font: { size: 9 }, callback: (v) => `$${v}` }, grid: { color: "#1e293b40" } },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Trade Signals */}
          <div className="rounded border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>
              Trade Signals ({result.result.signals.length})
            </h3>
            <div className="overflow-x-auto max-h-40 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ color: "var(--ag-muted)" }}>
                    <th className="text-left py-1 font-medium">#</th>
                    <th className="text-left py-1 font-medium">Day</th>
                    <th className="text-left py-1 font-medium">Type</th>
                    <th className="text-right py-1 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {result.result.signals.map((s, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: "var(--ag-border)" }}>
                      <td className="py-1" style={{ color: "var(--ag-muted)" }}>{i + 1}</td>
                      <td className="py-1 font-mono" style={{ color: "var(--ag-text)" }}>D{s.index}</td>
                      <td className="py-1 font-bold" style={{ color: s.type === "buy" ? "var(--ag-success)" : "var(--ag-danger)" }}>
                        {s.type.toUpperCase()}
                      </td>
                      <td className="text-right py-1 font-mono" style={{ color: "var(--ag-text)" }}>
                        ${s.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-3 opacity-20" style={{ color: "var(--ag-accent)" }}>{">>>"}</div>
            <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
              Select a strategy and symbol, then click Run Backtest
            </div>
            <div className="text-[10px] mt-1" style={{ color: "var(--ag-muted)", opacity: 0.5 }}>
              14 strategies across trend, mean-reversion, momentum, volatility, and composite
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
