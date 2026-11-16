"use client";

import { useState, useEffect, useRef } from "react";

interface RiskMetrics {
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
  beta: number;
  sharpe: number;
  sortino: number;
  maxDrawdown: number;
  volatility: number;
  correlation: Record<string, Record<string, number>>;
}

interface StressTest {
  scenario: string;
  impact: number;
  description: string;
}

interface McResult {
  percentile5: number;
  percentile50: number;
  percentile95: number;
  paths: number[][];
}

const MOCK_METRICS: RiskMetrics = {
  var95: -2.84,
  var99: -4.21,
  cvar95: -3.72,
  cvar99: -5.88,
  beta: 1.24,
  sharpe: 1.87,
  sortino: 2.44,
  maxDrawdown: -18.4,
  volatility: 22.1,
  correlation: {
    "Technology": { "Technology": 1.0, "Financials": 0.42, "Healthcare": 0.31, "Energy": 0.18, "Materials": 0.24 },
    "Financials":  { "Technology": 0.42, "Financials": 1.0, "Healthcare": 0.38, "Energy": 0.52, "Materials": 0.44 },
    "Healthcare":  { "Technology": 0.31, "Financials": 0.38, "Healthcare": 1.0, "Energy": 0.22, "Materials": 0.28 },
    "Energy":      { "Technology": 0.18, "Financials": 0.52, "Healthcare": 0.22, "Energy": 1.0, "Materials": 0.61 },
    "Materials":   { "Technology": 0.24, "Financials": 0.44, "Healthcare": 0.28, "Energy": 0.61, "Materials": 1.0 },
  },
};

const STRESS_TESTS: StressTest[] = [
  { scenario: "+200bp Rate Shock", impact: -8.4, description: "Fed hikes 200bp overnight — bond proxy sectors hit hardest" },
  { scenario: "-20% Equity Crash", impact: -24.8, description: "S&P 500 drops 20% over 5 trading days — systematic selloff" },
  { scenario: "Oil Spike +80%", impact: -5.1, description: "Brent crude surges to $160 — energy inflation shock" },
  { scenario: "USD +15% Rally", impact: -6.3, description: "Dollar Index surges — EM and multinational earnings hit" },
  { scenario: "Credit Crunch", impact: -11.7, description: "HY spreads widen 500bp — liquidity crunch scenario" },
  { scenario: "Tech Bubble -40%", impact: -18.2, description: "NASDAQ crashes 40% — tech weight drag on portfolio" },
];

function generateMCPaths(n = 20, steps = 52, mu = 0.08, sigma = 0.22): McResult {
  const paths: number[][] = [];
  for (let i = 0; i < n; i++) {
    const path = [100];
    for (let t = 1; t < steps; t++) {
      const r = mu / 52 + sigma / Math.sqrt(52) * (Math.random() * 2 - 1) * 1.2;
      path.push(path[t-1] * (1 + r));
    }
    paths.push(path);
  }
  const finals = paths.map(p => p[p.length - 1]).sort((a,b) => a-b);
  return {
    percentile5: finals[Math.floor(n * 0.05)],
    percentile50: finals[Math.floor(n * 0.50)],
    percentile95: finals[Math.floor(n * 0.95)],
    paths,
  };
}

const SECTORS = ["Technology", "Financials", "Healthcare", "Energy", "Materials"];

function corrColor(v: number): string {
  if (v === 1) return "#1e3a5f";
  if (v >= 0.6) return "#7f1d1d";
  if (v >= 0.4) return "#78350f";
  if (v >= 0.2) return "#14532d";
  return "#0f172a";
}

function corrText(v: number): string {
  if (v === 1) return "#93c5fd";
  if (v >= 0.6) return "#fca5a5";
  if (v >= 0.4) return "#fcd34d";
  if (v >= 0.2) return "#86efac";
  return "#64748b";
}

export default function RiskDashboardPanel() {
  const [mc, setMc] = useState<McResult | null>(null);
  const [tab, setTab] = useState<"overview" | "stress" | "monte-carlo" | "correlation">("overview");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMc(generateMCPaths(60, 52));
  }, []);

  useEffect(() => {
    if (tab !== "monte-carlo" || !mc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const steps = mc.paths[0].length;
    const allVals = mc.paths.flat();
    const minV = Math.min(...allVals) * 0.95;
    const maxV = Math.max(...allVals) * 1.05;

    const toX = (t: number) => (t / (steps - 1)) * W;
    const toY = (v: number) => H - ((v - minV) / (maxV - minV)) * H;

    mc.paths.forEach((path, i) => {
      ctx.beginPath();
      path.forEach((v, t) => {
        const x = toX(t), y = toY(v);
        t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = `rgba(0,200,255,0.12)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Median line
    const medPath = mc.paths[Math.floor(mc.paths.length / 2)];
    ctx.beginPath();
    medPath.forEach((v, t) => {
      const x = toX(t), y = toY(v);
      t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#00c8ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#64748b";
    ctx.font = "9px monospace";
    ctx.fillText(`P5: $${mc.percentile5.toFixed(0)}`, 4, H - 4);
    ctx.fillText(`P50: $${mc.percentile50.toFixed(0)}`, W/2 - 20, 12);
    ctx.fillText(`P95: $${mc.percentile95.toFixed(0)}`, W - 55, 12);
  }, [tab, mc]);

  const m = MOCK_METRICS;

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <span className="text-[#00c8ff] font-bold text-sm">RISK DASHBOARD</span>
        <span className="text-[10px] text-slate-500">VaR · Monte Carlo · Stress Tests</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-white/10">
        {(["overview", "stress", "monte-carlo", "correlation"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${tab === t ? "bg-[#00c8ff] text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
          >
            {t === "monte-carlo" ? "MONTE CARLO" : t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "overview" && (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "VaR 95% (1D)", value: `${m.var95.toFixed(2)}%`, color: "#ef4444", sub: "Daily Value at Risk" },
                { label: "VaR 99% (1D)", value: `${m.var99.toFixed(2)}%`, color: "#ef4444", sub: "Extreme scenario" },
                { label: "CVaR 95%", value: `${m.cvar95.toFixed(2)}%`, color: "#f97316", sub: "Expected Shortfall" },
                { label: "CVaR 99%", value: `${m.cvar99.toFixed(2)}%`, color: "#f97316", sub: "Tail risk measure" },
                { label: "Beta", value: m.beta.toFixed(2), color: "#f59e0b", sub: "Market sensitivity" },
                { label: "Sharpe Ratio", value: m.sharpe.toFixed(2), color: "#10b981", sub: "Risk-adj return" },
                { label: "Sortino Ratio", value: m.sortino.toFixed(2), color: "#10b981", sub: "Downside-adj return" },
                { label: "Max Drawdown", value: `${m.maxDrawdown.toFixed(1)}%`, color: "#ef4444", sub: "Peak-to-trough" },
              ].map(card => (
                <div key={card.label} className="bg-[#12151c] rounded-lg border border-white/10 p-3">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">{card.label}</div>
                  <div className="text-xl font-bold mt-1 mb-0.5" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-[9px] text-slate-600">{card.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#12151c] rounded-lg border border-white/10 p-3 flex items-center gap-6">
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Portfolio Volatility (Annualized)</div>
                <div className="text-2xl font-bold text-[#f59e0b] mt-1">{m.volatility.toFixed(1)}%</div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.volatility / 50 * 100}%`, background: "linear-gradient(to right, #10b981, #f59e0b, #ef4444)" }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                  <span>LOW (5%)</span><span>MODERATE (25%)</span><span>HIGH (50%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "stress" && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 mb-3">Portfolio impact under stress scenarios (% return)</div>
            {STRESS_TESTS.map(s => (
              <div key={s.scenario} className="bg-[#12151c] rounded-lg border border-white/10 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">{s.scenario}</span>
                  <span className="text-lg font-bold" style={{ color: s.impact < -15 ? "#ef4444" : s.impact < -8 ? "#f97316" : "#f59e0b" }}>
                    {s.impact.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.abs(s.impact) / 30 * 100}%`,
                      backgroundColor: s.impact < -15 ? "#ef4444" : s.impact < -8 ? "#f97316" : "#f59e0b",
                    }}
                  />
                </div>
                <div className="text-[9px] text-slate-600">{s.description}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "monte-carlo" && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400">Monte Carlo simulation: 60 paths × 52 weeks (μ=8%, σ=22%)</div>
            <canvas ref={canvasRef} width={560} height={260} className="w-full rounded-lg border border-white/10 bg-[#0d1016]" />
            {mc && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "5th Percentile", value: `$${mc.percentile5.toFixed(0)}`, color: "#ef4444" },
                  { label: "Median (P50)", value: `$${mc.percentile50.toFixed(0)}`, color: "#00c8ff" },
                  { label: "95th Percentile", value: `$${mc.percentile95.toFixed(0)}`, color: "#10b981" },
                ].map(c => (
                  <div key={c.label} className="bg-[#12151c] rounded-lg border border-white/10 p-3 text-center">
                    <div className="text-[9px] text-slate-500 uppercase">{c.label}</div>
                    <div className="text-xl font-bold mt-1" style={{ color: c.color }}>{c.value}</div>
                    <div className="text-[9px] text-slate-600">(starting $100)</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "correlation" && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400">Cross-sector correlation matrix</div>
            <div className="overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="p-1.5 text-[10px] text-slate-500 text-right pr-3"></th>
                    {SECTORS.map(s => (
                      <th key={s} className="p-1.5 text-[10px] text-slate-500 font-normal text-center min-w-[80px]">{s.substring(0,6)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SECTORS.map(row => (
                    <tr key={row}>
                      <td className="p-1.5 text-[10px] text-slate-400 font-bold text-right pr-3 whitespace-nowrap">{row.substring(0,8)}</td>
                      {SECTORS.map(col => {
                        const v = m.correlation[row][col];
                        return (
                          <td key={col} className="p-0.5">
                            <div
                              className="w-full h-10 rounded flex items-center justify-center text-[11px] font-bold"
                              style={{ backgroundColor: corrColor(v), color: corrText(v) }}
                            >
                              {v.toFixed(2)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[9px] text-slate-600">High correlation (&gt;0.6) = limited diversification benefit</div>
          </div>
        )}
      </div>
    </div>
  );
}
