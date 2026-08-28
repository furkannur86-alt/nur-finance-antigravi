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

interface BacktestResponse {
  source: string;
  result: BacktestResult;
  benchmark: { strategy: string; totalReturn: number };
}

const strategies = [
  { id: "sma_crossover", label: "SMA Crossover" },
  { id: "rsi_mean_reversion", label: "RSI Mean Reversion" },
  { id: "momentum", label: "Momentum" },
];

const symbols = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "META", "SPY", "BTC-USD"];
const ranges = ["6mo", "1y", "2y"];

export default function BacktestPanel() {
  const [symbol, setSymbol] = useState("AAPL");
  const [strategy, setStrategy] = useState("sma_crossover");
  const [range, setRange] = useState("1y");
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runBacktest = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/backtest?symbol=${symbol}&strategy=${strategy}&range=${range}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  }, [symbol, strategy, range]);

  const equityChart = result?.result.equity
    ? {
        labels: result.result.equity.map((_, i) => (i % 20 === 0 ? `D${i}` : "")),
        datasets: [
          {
            label: result.result.strategy,
            data: result.result.equity,
            borderColor: "#00d4aa",
            backgroundColor: "rgba(0,212,170,0.1)",
            fill: true,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      }
    : null;

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
          <label className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
          >
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
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

      {result && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total Return", value: `${result.result.totalReturn >= 0 ? "+" : ""}${result.result.totalReturn}%`, color: result.result.totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
              { label: "Sharpe Ratio", value: result.result.sharpeRatio.toFixed(3), color: "var(--ag-accent2)" },
              { label: "Max Drawdown", value: `-${result.result.maxDrawdown}%`, color: "var(--ag-warning)" },
              { label: "Win Rate", value: `${result.result.winRate}%`, color: "var(--ag-success)" },
              { label: "Trades", value: String(result.result.trades), color: "var(--ag-text)" },
              { label: "Volatility", value: `${result.result.volatility}%`, color: "var(--ag-accent)" },
              { label: "Buy & Hold", value: `${result.benchmark.totalReturn >= 0 ? "+" : ""}${result.benchmark.totalReturn}%`, color: result.benchmark.totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
              { label: "Alpha", value: `${(result.result.totalReturn - result.benchmark.totalReturn) >= 0 ? "+" : ""}${(result.result.totalReturn - result.benchmark.totalReturn).toFixed(2)}%`, color: (result.result.totalReturn - result.benchmark.totalReturn) >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border p-2" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>{m.label}</div>
                <div className="text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {equityChart && (
            <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-muted)" }}>EQUITY CURVE</h3>
              <div style={{ height: 280 }}>
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

          <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-muted)" }}>
              TRADE SIGNALS ({result.result.signals.length})
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
            <div className="text-3xl mb-3 opacity-20" style={{ color: "var(--ag-accent)" }}>
              {">>"}
            </div>
            <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
              Select a symbol and strategy, then click Run Backtest
            </div>
            <div className="text-[10px] mt-1" style={{ color: "var(--ag-muted)", opacity: 0.5 }}>
              SMA Crossover | RSI Mean Reversion | Momentum
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
