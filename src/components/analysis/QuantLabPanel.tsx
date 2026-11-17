"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const MODELS = [
  { name: "Black-Scholes", status: "READY", lastRun: "14:32:08", params: "S=285.4, K=290, σ=0.32, r=5.25%, T=45d", result: "Call: $12.84 | Put: $15.42 | IV: 31.8%", color: "#22c55e" },
  { name: "Monte Carlo VaR", status: "READY", lastRun: "14:28:15", params: "10K sims, 1d horizon, 95% CI, GBM", result: "VaR₉₅: -2.34% | CVaR: -3.18% | Max DD: -5.67%", color: "#ef4444" },
  { name: "Markowitz MVO", status: "RUNNING", lastRun: "14:35:00", params: "12 assets, λ=0.5, min 2% max 25%", result: "E[R]: 11.2% | Vol: 13.8% | Sharpe: 0.81", color: "#38bdf8" },
  { name: "GARCH(1,1)", status: "READY", lastRun: "14:20:44", params: "ω=0.00001, α=0.08, β=0.91, SPX", result: "σ_t+1: 16.4% | Persistence: 0.99 | LR Vol: 15.8%", color: "#fbbf24" },
  { name: "Fama-French 5F", status: "READY", lastRun: "14:15:30", params: "α, MKT, SMB, HML, RMW, CMA", result: "α: 0.12% (t=2.1) | R²: 0.94 | MKT β: 1.08", color: "#a855f7" },
  { name: "Kelly Criterion", status: "READY", lastRun: "14:10:12", params: "W=58%, avg win/loss=1.6, n=200", result: "f*: 21.3% | Half-Kelly: 10.6% | Edge: 0.148", color: "#06b6d4" },
];

const TENOR_DATA = [
  { tenor: "3M", zero: 5.32, fwd: 5.32, par: 5.30 },
  { tenor: "6M", zero: 5.28, fwd: 5.24, par: 5.27 },
  { tenor: "1Y", zero: 5.15, fwd: 4.89, par: 5.14 },
  { tenor: "2Y", zero: 4.85, fwd: 4.25, par: 4.83 },
  { tenor: "3Y", zero: 4.62, fwd: 4.16, par: 4.59 },
  { tenor: "5Y", zero: 4.38, fwd: 3.90, par: 4.34 },
  { tenor: "10Y", zero: 4.42, fwd: 4.50, par: 4.38 },
  { tenor: "30Y", zero: 4.58, fwd: 4.90, par: 4.52 },
];

const STRESS_SCENARIOS = [
  { name: "2008 GFC Replay", equity: -38.5, fi: +8.2, fx: -12.0, portfolio: -22.4 },
  { name: "2020 COVID Crash", equity: -33.9, fi: +5.1, fx: -8.5, portfolio: -19.8 },
  { name: "Rate Shock +200bp", equity: -12.0, fi: -14.8, fx: -3.2, portfolio: -11.2 },
  { name: "USD Crisis -20%", equity: +5.5, fi: -2.0, fx: -20.0, portfolio: -6.8 },
  { name: "Stagflation", equity: -18.2, fi: -8.5, fx: -5.0, portfolio: -13.5 },
];

const FACTOR_EXPOSURES = [
  { factor: "Market", beta: 1.08, contrib: 68 },
  { factor: "Size (SMB)", beta: -0.12, contrib: -4 },
  { factor: "Value (HML)", beta: 0.25, contrib: 8 },
  { factor: "Momentum", beta: 0.42, contrib: 15 },
  { factor: "Quality", beta: 0.18, contrib: 6 },
  { factor: "Volatility", beta: -0.31, contrib: -10 },
  { factor: "Liquidity", beta: 0.08, contrib: 3 },
];

type Tab = "models" | "derivatives" | "yield" | "risk";

function bsCall(S: number, K: number, vol: number, r: number, T: number) {
  const d1 = (Math.log(S / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
  const d2 = d1 - vol * Math.sqrt(T);
  const nd1 = 0.5 * (1 + erf(d1 / Math.SQRT2));
  const nd2 = 0.5 * (1 + erf(d2 / Math.SQRT2));
  const call = S * nd1 - K * Math.exp(-r * T) * nd2;
  const put = call - S + K * Math.exp(-r * T);
  const delta = nd1;
  const gamma = Math.exp(-d1 * d1 / 2) / (S * vol * Math.sqrt(T) * Math.sqrt(2 * Math.PI));
  const theta = -(S * vol * Math.exp(-d1 * d1 / 2)) / (2 * Math.sqrt(T) * Math.sqrt(2 * Math.PI)) - r * K * Math.exp(-r * T) * nd2;
  const vega = S * Math.sqrt(T) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
  const rho = K * T * Math.exp(-r * T) * nd2;
  return { call, put, delta, gamma: gamma, theta: theta / 365, vega: vega / 100, rho: rho / 100 };
}

function erf(x: number) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  return sign * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
}

export default function QuantLabPanel() {
  const [tab, setTab] = useState<Tab>("models");
  const [spot, setSpot] = useState(285.4);
  const [strike, setStrike] = useState(290);
  const [vol, setVol] = useState(32);
  const [rate, setRate] = useState(5.25);
  const [days, setDays] = useState(45);

  const bs = bsCall(spot, strike, vol / 100, rate / 100, days / 365);

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🧪</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>QUANT LAB</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>QuantLib + Fincept</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["models", "derivatives", "yield", "risk"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {/* ── MODELS TAB ── */}
        {tab === "models" && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>QUANTITATIVE MODEL LIBRARY</div>
            {MODELS.map(m => (
              <div key={m.name} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: m.color }}>{m.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{ background: m.status === "RUNNING" ? "rgba(56,189,248,0.15)" : "rgba(34,197,94,0.1)", color: m.status === "RUNNING" ? "#38bdf8" : "#22c55e" }}>
                      {m.status}
                    </span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>Last: {m.lastRun}</span>
                </div>
                <div className="text-[9px] mb-1" style={{ color: "#64748b" }}>
                  <span className="font-bold" style={{ color: "#94a3b8" }}>Params:</span> {m.params}
                </div>
                <div className="text-[9px] font-mono" style={{ color: m.color }}>
                  <span className="font-bold" style={{ color: "#94a3b8" }}>Result:</span> {m.result}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DERIVATIVES TAB ── */}
        {tab === "derivatives" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>BLACK-SCHOLES OPTION PRICER</div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Spot (S)", value: spot, set: setSpot, min: 50, max: 500, step: 0.1 },
                  { label: "Strike (K)", value: strike, set: setStrike, min: 50, max: 500, step: 1 },
                  { label: "Vol (%)", value: vol, set: setVol, min: 5, max: 100, step: 1 },
                  { label: "Rate (%)", value: rate, set: setRate, min: 0, max: 15, step: 0.25 },
                  { label: "Days (T)", value: days, set: setDays, min: 1, max: 365, step: 1 },
                ].map(p => (
                  <div key={p.label}>
                    <div className="text-[8px] mb-0.5" style={{ color: "#64748b" }}>{p.label}</div>
                    <input type="number" value={p.value} onChange={e => p.set(Number(e.target.value))}
                      min={p.min} max={p.max} step={p.step}
                      className="w-full px-1.5 py-1 rounded font-mono text-[10px]"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <div className="text-[8px] font-bold" style={{ color: "#64748b" }}>CALL PRICE</div>
                <div className="text-xl font-mono font-bold" style={{ color: "#22c55e" }}>${bs.call.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <div className="text-[8px] font-bold" style={{ color: "#64748b" }}>PUT PRICE</div>
                <div className="text-xl font-mono font-bold" style={{ color: "#ef4444" }}>${bs.put.toFixed(2)}</div>
              </div>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GREEKS</div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "Delta (Δ)", value: bs.delta.toFixed(4), color: "#22c55e" },
                { label: "Gamma (Γ)", value: bs.gamma.toFixed(4), color: "#38bdf8" },
                { label: "Theta (Θ)", value: bs.theta.toFixed(4), color: "#ef4444" },
                { label: "Vega (ν)", value: bs.vega.toFixed(4), color: "#a855f7" },
                { label: "Rho (ρ)", value: bs.rho.toFixed(4), color: "#fbbf24" },
              ].map(g => (
                <div key={g.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{g.label}</div>
                  <div className="font-mono font-bold text-sm mt-0.5" style={{ color: g.color }}>{g.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PAYOFF DIAGRAM</div>
            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 300 100" className="w-full" style={{ maxHeight: 100 }}>
                {[0, 25, 50, 75].map(y => (
                  <line key={y} x1="10" y1={y + 10} x2="290" y2={y + 10} stroke="rgba(255,255,255,0.05)" />
                ))}
                <line x1="10" y1="60" x2="290" y2="60" stroke="rgba(255,255,255,0.1)" strokeDasharray="2" />
                {/* Call payoff */}
                <polyline fill="none" stroke="#22c55e" strokeWidth="1.5"
                  points={Array.from({ length: 28 }, (_, i) => {
                    const s = spot * 0.7 + (spot * 0.6 / 27) * i;
                    const payoff = Math.max(s - strike, 0) - bs.call;
                    const x = 10 + (280 / 27) * i;
                    const y = 60 - payoff * (40 / (spot * 0.15));
                    return `${x},${Math.max(10, Math.min(90, y))}`;
                  }).join(" ")} />
                {/* Put payoff */}
                <polyline fill="none" stroke="#ef4444" strokeWidth="1.5"
                  points={Array.from({ length: 28 }, (_, i) => {
                    const s = spot * 0.7 + (spot * 0.6 / 27) * i;
                    const payoff = Math.max(strike - s, 0) - bs.put;
                    const x = 10 + (280 / 27) * i;
                    const y = 60 - payoff * (40 / (spot * 0.15));
                    return `${x},${Math.max(10, Math.min(90, y))}`;
                  }).join(" ")} />
                <text x="150" y="98" fill="#64748b" fontSize="6" textAnchor="middle">Underlying Price</text>
                <text x="270" y="20" fill="#22c55e" fontSize="6">Call</text>
                <text x="20" y="20" fill="#ef4444" fontSize="6">Put</text>
              </svg>
            </div>
          </div>
        )}

        {/* ── YIELD TAB ── */}
        {tab === "yield" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BOOTSTRAPPED YIELD CURVE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 320 140" className="w-full" style={{ maxHeight: 140 }}>
                {/* Grid */}
                {[3.5, 4.0, 4.5, 5.0, 5.5].map((v, i) => {
                  const y = 120 - (v - 3.5) * (100 / 2);
                  return (
                    <g key={i}>
                      <line x1="35" y1={y} x2="310" y2={y} stroke="rgba(255,255,255,0.05)" />
                      <text x="30" y={y + 3} fill="#64748b" fontSize="6" textAnchor="end">{v.toFixed(1)}%</text>
                    </g>
                  );
                })}

                {/* Zero rate curve */}
                <polyline fill="none" stroke="#00e5a0" strokeWidth="2"
                  points={TENOR_DATA.map((d, i) => {
                    const x = 45 + i * (265 / 7);
                    const y = 120 - (d.zero - 3.5) * (100 / 2);
                    return `${x},${y}`;
                  }).join(" ")} />
                {TENOR_DATA.map((d, i) => {
                  const x = 45 + i * (265 / 7);
                  const y = 120 - (d.zero - 3.5) * (100 / 2);
                  return <circle key={`z-${i}`} cx={x} cy={y} r="3" fill="#00e5a0" />;
                })}

                {/* Forward rate curve */}
                <polyline fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4"
                  points={TENOR_DATA.map((d, i) => {
                    const x = 45 + i * (265 / 7);
                    const y = 120 - (d.fwd - 3.5) * (100 / 2);
                    return `${x},${y}`;
                  }).join(" ")} />
                {TENOR_DATA.map((d, i) => {
                  const x = 45 + i * (265 / 7);
                  const y = 120 - (d.fwd - 3.5) * (100 / 2);
                  return <circle key={`f-${i}`} cx={x} cy={y} r="2" fill="#fbbf24" />;
                })}

                {/* Par rate curve */}
                <polyline fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2"
                  points={TENOR_DATA.map((d, i) => {
                    const x = 45 + i * (265 / 7);
                    const y = 120 - (d.par - 3.5) * (100 / 2);
                    return `${x},${y}`;
                  }).join(" ")} />

                {/* Tenor labels */}
                {TENOR_DATA.map((d, i) => (
                  <text key={`t-${i}`} x={45 + i * (265 / 7)} y="134" fill="#64748b" fontSize="6" textAnchor="middle">{d.tenor}</text>
                ))}

                {/* Legend */}
                <circle cx="50" cy="8" r="3" fill="#00e5a0" />
                <text x="56" y="10" fill="#00e5a0" fontSize="6">Zero</text>
                <circle cx="90" cy="8" r="3" fill="#fbbf24" />
                <text x="96" y="10" fill="#fbbf24" fontSize="6">Forward</text>
                <circle cx="140" cy="8" r="3" fill="#38bdf8" />
                <text x="146" y="10" fill="#38bdf8" fontSize="6">Par</text>
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RATE TABLE</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-4 text-[8px] font-bold px-2 py-1.5" style={{ background: "rgba(0,229,160,0.08)", color: "#00e5a0" }}>
                <span>TENOR</span><span className="text-right">ZERO RATE</span><span className="text-right">FWD RATE</span><span className="text-right">PAR RATE</span>
              </div>
              {TENOR_DATA.map(d => (
                <div key={d.tenor} className="grid grid-cols-4 px-2 py-1 text-[9px]" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <span className="font-mono" style={{ color: "#94a3b8" }}>{d.tenor}</span>
                  <span className="text-right font-mono" style={{ color: "#00e5a0" }}>{d.zero.toFixed(2)}%</span>
                  <span className="text-right font-mono" style={{ color: "#fbbf24" }}>{d.fwd.toFixed(2)}%</span>
                  <span className="text-right font-mono" style={{ color: "#38bdf8" }}>{d.par.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RISK TAB ── */}
        {tab === "risk" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "TOTAL RISK", value: "14.2%", sub: "Ann. Vol", color: "#ef4444" },
                { label: "SYSTEMATIC", value: "11.8%", sub: "83% of total", color: "#38bdf8" },
                { label: "IDIOSYNCRATIC", value: "4.1%", sub: "17% of total", color: "#a855f7" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px] font-bold" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FACTOR EXPOSURES</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 320 120" className="w-full" style={{ maxHeight: 120 }}>
                <line x1="160" y1="5" x2="160" y2="110" stroke="rgba(255,255,255,0.1)" />
                {FACTOR_EXPOSURES.map((f, i) => {
                  const y = 10 + i * 15;
                  const barW = Math.abs(f.contrib) * 1.5;
                  const x = f.contrib >= 0 ? 160 : 160 - barW;
                  return (
                    <g key={f.factor}>
                      <text x="5" y={y + 5} fill="#94a3b8" fontSize="6">{f.factor}</text>
                      <rect x={x} y={y - 3} width={barW} height="10" rx="1"
                        fill={f.contrib >= 0 ? "#22c55e" : "#ef4444"} opacity="0.7" />
                      <text x={f.contrib >= 0 ? 162 + barW : 158 - barW} y={y + 5} fill="#e2e8f0" fontSize="6"
                        textAnchor={f.contrib >= 0 ? "start" : "end"}>
                        β={f.beta.toFixed(2)} ({f.contrib > 0 ? "+" : ""}{f.contrib}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRESS SCENARIOS</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-5 text-[8px] font-bold px-2 py-1.5" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
                <span>SCENARIO</span><span className="text-right">EQUITY</span><span className="text-right">FIXED INC</span><span className="text-right">FX</span><span className="text-right">PORTFOLIO</span>
              </div>
              {STRESS_SCENARIOS.map(s => (
                <div key={s.name} className="grid grid-cols-5 px-2 py-1.5 text-[9px]" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ color: "#e2e8f0" }}>{s.name}</span>
                  {[s.equity, s.fi, s.fx, s.portfolio].map((v, i) => (
                    <span key={i} className="text-right font-mono" style={{ color: v >= 0 ? "#22c55e" : "#ef4444" }}>
                      {v >= 0 ? "+" : ""}{v.toFixed(1)}%
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
