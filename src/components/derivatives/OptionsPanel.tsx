"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { cyberSound } from "@/lib/audio/sound-synth";
import EagleCrest from "@/components/ui/EagleCrest";

type Strategy =
  | "long-call"
  | "long-put"
  | "covered-call"
  | "protective-put"
  | "bull-call-spread"
  | "bear-put-spread"
  | "straddle"
  | "strangle"
  | "iron-condor"
  | "butterfly"
  | "calendar-spread"
  | "collar";

interface StrategyInfo {
  id: Strategy;
  name: string;
  outlook: string;
  risk: string;
  reward: string;
  description: string;
  legs: string[];
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
}

const STRATEGIES: StrategyInfo[] = [
  { id: "long-call", name: "Long Call", outlook: "Bullish", risk: "Limited", reward: "Unlimited", description: "Buy a call option to profit from upward price movement.", legs: ["Buy 1 Call"], maxProfit: "Unlimited", maxLoss: "Premium paid", breakeven: "Strike + Premium" },
  { id: "long-put", name: "Long Put", outlook: "Bearish", risk: "Limited", reward: "Substantial", description: "Buy a put option to profit from downward price movement.", legs: ["Buy 1 Put"], maxProfit: "Strike - Premium (if stock goes to 0)", maxLoss: "Premium paid", breakeven: "Strike - Premium" },
  { id: "covered-call", name: "Covered Call", outlook: "Neutral/Mild Bullish", risk: "Substantial", reward: "Limited", description: "Own the stock and sell a call against it for income.", legs: ["Long 100 shares", "Sell 1 OTM Call"], maxProfit: "Strike - Stock Price + Premium", maxLoss: "Stock Price - Premium (if stock goes to 0)", breakeven: "Stock Price - Premium" },
  { id: "protective-put", name: "Protective Put", outlook: "Bullish (with protection)", risk: "Limited", reward: "Unlimited", description: "Own the stock and buy a put as insurance.", legs: ["Long 100 shares", "Buy 1 Put"], maxProfit: "Unlimited", maxLoss: "Stock Price - Strike + Premium", breakeven: "Stock Price + Premium" },
  { id: "bull-call-spread", name: "Bull Call Spread", outlook: "Moderately Bullish", risk: "Limited", reward: "Limited", description: "Buy a call and sell a higher-strike call to reduce cost.", legs: ["Buy 1 Call (lower strike)", "Sell 1 Call (higher strike)"], maxProfit: "Difference in strikes - Net debit", maxLoss: "Net debit paid", breakeven: "Lower Strike + Net Debit" },
  { id: "bear-put-spread", name: "Bear Put Spread", outlook: "Moderately Bearish", risk: "Limited", reward: "Limited", description: "Buy a put and sell a lower-strike put to reduce cost.", legs: ["Buy 1 Put (higher strike)", "Sell 1 Put (lower strike)"], maxProfit: "Difference in strikes - Net debit", maxLoss: "Net debit paid", breakeven: "Higher Strike - Net Debit" },
  { id: "straddle", name: "Long Straddle", outlook: "Volatile (direction unknown)", risk: "Limited", reward: "Unlimited", description: "Buy both a call and put at the same strike to profit from big moves in either direction.", legs: ["Buy 1 ATM Call", "Buy 1 ATM Put"], maxProfit: "Unlimited", maxLoss: "Total premium paid", breakeven: "Strike ± Total Premium" },
  { id: "strangle", name: "Long Strangle", outlook: "Volatile (direction unknown)", risk: "Limited", reward: "Unlimited", description: "Buy an OTM call and OTM put to profit from big moves. Cheaper than straddle but needs bigger move.", legs: ["Buy 1 OTM Call", "Buy 1 OTM Put"], maxProfit: "Unlimited", maxLoss: "Total premium paid", breakeven: "Call Strike + Premium / Put Strike - Premium" },
  { id: "iron-condor", name: "Iron Condor", outlook: "Neutral (low volatility)", risk: "Limited", reward: "Limited", description: "Sell an OTM call spread and OTM put spread. Profits when price stays in a range.", legs: ["Buy 1 OTM Put (lowest)", "Sell 1 OTM Put", "Sell 1 OTM Call", "Buy 1 OTM Call (highest)"], maxProfit: "Net credit received", maxLoss: "Width of either spread - Net credit", breakeven: "Short Call + Credit / Short Put - Credit" },
  { id: "butterfly", name: "Long Butterfly", outlook: "Neutral (pinpoint)", risk: "Limited", reward: "Limited", description: "Buy 1 lower call, sell 2 middle calls, buy 1 higher call. Max profit if stock is at middle strike at expiration.", legs: ["Buy 1 Call (lower)", "Sell 2 Calls (middle)", "Buy 1 Call (higher)"], maxProfit: "Middle - Lower - Net debit", maxLoss: "Net debit paid", breakeven: "Lower + Debit / Upper - Debit" },
  { id: "calendar-spread", name: "Calendar Spread", outlook: "Neutral (short-term)", risk: "Limited", reward: "Limited", description: "Sell a near-term option and buy a longer-term option at the same strike. Profits from time decay differential.", legs: ["Sell 1 Near-term Call/Put", "Buy 1 Longer-term Call/Put (same strike)"], maxProfit: "Variable (max at short option expiry)", maxLoss: "Net debit paid", breakeven: "Complex — depends on IV" },
  { id: "collar", name: "Collar", outlook: "Neutral (protection)", risk: "Limited", reward: "Limited", description: "Own stock, buy a protective put, sell a covered call. Zero-cost or near-zero-cost protection.", legs: ["Long 100 shares", "Buy 1 OTM Put", "Sell 1 OTM Call"], maxProfit: "Call Strike - Stock Price + Net Credit", maxLoss: "Stock Price - Put Strike - Net Debit", breakeven: "Stock Price ± Net Premium" },
];

function normCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function BSCallPrice(S: number, K: number, T: number, r: number, sigma: number): number {
  if (T <= 0) return Math.max(0, S - K);
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
}

function BSPutPrice(S: number, K: number, T: number, r: number, sigma: number): number {
  if (T <= 0) return Math.max(0, K - S);
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
}

function computeGreeks(S: number, K: number, T: number, r: number, sigma: number) {
  const effectiveT = Math.max(0.001, T);
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * effectiveT) / (sigma * Math.sqrt(effectiveT));
  const d2 = d1 - sigma * Math.sqrt(effectiveT);
  return {
    callPrice: BSCallPrice(S, K, effectiveT, r, sigma),
    putPrice: BSPutPrice(S, K, effectiveT, r, sigma),
    delta: { call: normCDF(d1), put: normCDF(d1) - 1 },
    gamma: normPDF(d1) / (S * sigma * Math.sqrt(effectiveT)),
    theta: {
      call: (-S * normPDF(d1) * sigma / (2 * Math.sqrt(effectiveT)) - r * K * Math.exp(-r * effectiveT) * normCDF(d2)) / 365,
      put: (-S * normPDF(d1) * sigma / (2 * Math.sqrt(effectiveT)) + r * K * Math.exp(-r * effectiveT) * normCDF(-d2)) / 365,
    },
    vega: (S * normPDF(d1) * Math.sqrt(effectiveT)) / 100,
    rho: {
      call: (K * effectiveT * Math.exp(-r * effectiveT) * normCDF(d2)) / 100,
      put: (-K * effectiveT * Math.exp(-r * effectiveT) * normCDF(-d2)) / 100,
    },
  };
}

export default function OptionsPanel() {
  const [tab, setTab] = useState<"calculator" | "chain" | "vol_surface" | "strategies">("calculator");
  const [spot, setSpot] = useState(580);
  const [strike, setStrike] = useState(585);
  const [expiryDays, setExpiryDays] = useState(30);
  const [riskFreeRate, setRiskFreeRate] = useState(4.5);
  const [impliedVol, setImpliedVol] = useState(18.5);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>("iron-condor");

  const volCanvasRef = useRef<HTMLCanvasElement>(null);

  const greeks = useMemo(
    () => computeGreeks(spot, strike, expiryDays / 365, riskFreeRate / 100, impliedVol / 100),
    [spot, strike, expiryDays, riskFreeRate, impliedVol]
  );

  // Payoff calculations
  const payoffPoints = useMemo(() => {
    const points: { price: number; callPnL: number; putPnL: number }[] = [];
    const minP = spot * 0.75;
    const maxP = spot * 1.25;
    const step = (maxP - minP) / 60;
    for (let p = minP; p <= maxP; p += step) {
      points.push({
        price: p,
        callPnL: Math.max(0, p - strike) - greeks.callPrice,
        putPnL: Math.max(0, strike - p) - greeks.putPrice,
      });
    }
    return points;
  }, [spot, strike, greeks.callPrice, greeks.putPrice]);

  const maxPnL = Math.max(1, ...payoffPoints.map((p) => Math.max(Math.abs(p.callPnL), Math.abs(p.putPnL))));

  // Simulated Option Chain Matrix around spot
  const optionChain = useMemo(() => {
    const chain = [];
    const baseStrike = Math.round(spot / 5) * 5;
    const strikes = [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25].map((off) => baseStrike + off);

    for (const k of strikes) {
      const g = computeGreeks(spot, k, expiryDays / 365, riskFreeRate / 100, impliedVol / 100);
      const callBid = Math.max(0.05, +(g.callPrice * 0.98).toFixed(2));
      const callAsk = +(g.callPrice * 1.02).toFixed(2);
      const putBid = Math.max(0.05, +(g.putPrice * 0.98).toFixed(2));
      const putAsk = +(g.putPrice * 1.02).toFixed(2);
      const volume = Math.floor(1200 / (1 + Math.abs(k - spot) * 0.2));
      const oi = volume * 8 + Math.floor(Math.random() * 500);

      chain.push({
        strike: k,
        callBid,
        callAsk,
        callDelta: g.delta.call.toFixed(2),
        callTheta: g.theta.call.toFixed(2),
        callVolume: volume,
        callOI: oi,
        putBid,
        putAsk,
        putDelta: g.delta.put.toFixed(2),
        putTheta: g.theta.put.toFixed(2),
        putVolume: Math.floor(volume * 0.85),
        putOI: Math.floor(oi * 0.9),
      });
    }
    return chain;
  }, [spot, expiryDays, riskFreeRate, impliedVol]);

  // 3D Volatility Smile / Surface Canvas
  useEffect(() => {
    if (tab !== "vol_surface") return;
    const canvas = volCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const W = (canvas.width = canvas.offsetWidth);
      const H = (canvas.height = canvas.offsetHeight);

      ctx.clearRect(0, 0, W, H);

      // Cyber background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#020713");
      bg.addColorStop(1, "#081b2b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw Volatility Smile curves for various DTEs (7d, 30d, 90d, 180d)
      const dtes = [
        { label: "7 DTE", color: "#f43f5e", offset: 1.2 },
        { label: "30 DTE", color: "#f59e0b", offset: 1.0 },
        { label: "90 DTE", color: "#00d4aa", offset: 0.85 },
        { label: "180 DTE", color: "#38bdf8", offset: 0.7 },
      ];

      dtes.forEach((dte, idx) => {
        ctx.strokeStyle = dte.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 40; x < W - 40; x += 4) {
          const normX = (x - W / 2) / (W / 2); // -1 to 1 (moneyness)
          // Volatility smile quadratic curve + subtle wave
          const smile = Math.pow(normX, 2) * 28 * dte.offset + Math.sin(normX * 4 + t) * 2;
          const y = H * 0.65 - smile - (idx * 28);

          if (x === 40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = dte.color;
        ctx.font = "10px monospace";
        ctx.fillText(dte.label, W - 65, H * 0.65 - (idx * 28) - 15);
      });

      // Crosshair & Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, 20);
      ctx.lineTo(W / 2, H - 30);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.fillText(`ATM Strike ($${spot})`, W / 2 - 40, H - 15);
      ctx.fillText("Implied Volatility (%)", 15, 25);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [tab, spot]);

  return (
    <div className="h-full flex flex-col overflow-hidden select-none font-sans" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b shrink-0 backdrop-blur-md" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white font-serif">Options &amp; Quantitative Derivatives Suite</h1>
              <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                BLACK-SCHOLES &bull; VOL SURFACE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Institutional derivatives pricing, real-time Greeks risk matrix, live simulated option chain, and volatility smile.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {(
            [
              { id: "calculator" as const, label: "🧮 Calculator & Greeks" },
              { id: "chain" as const, label: "⛓️ Option Chain Matrix" },
              { id: "vol_surface" as const, label: "📊 Volatility Surface" },
              { id: "strategies" as const, label: "📐 Multi-Leg Strategies" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                cyberSound.playClick();
                setTab(t.id);
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                tab === t.id ? "bg-cyan-500 text-black shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        {/* TAB 1: Calculator & Greeks */}
        {tab === "calculator" && (
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Sliders Form */}
              <div className="lg:col-span-6 p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-4 shadow-xl">
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Black-Scholes Input Parameters
                </h2>

                {[
                  { label: "Underlying Spot Price ($)", value: spot, set: setSpot, min: 10, max: 2000, step: 1 },
                  { label: "Option Strike Price ($)", value: strike, set: setStrike, min: 10, max: 2000, step: 1 },
                  { label: "Days to Expiry (DTE)", value: expiryDays, set: setExpiryDays, min: 1, max: 365, step: 1 },
                  { label: "Risk-Free Interest Rate (%)", value: riskFreeRate, set: setRiskFreeRate, min: 0, max: 15, step: 0.1 },
                  { label: "Implied Volatility (%)", value: impliedVol, set: setImpliedVol, min: 5, max: 150, step: 0.5 },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">{p.label}:</span>
                      <span className="text-white font-bold">{p.value}</span>
                    </div>
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={p.value}
                      onChange={(e) => {
                        p.set(Number(e.target.value));
                        cyberSound.playClick();
                      }}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                ))}

                {/* Price Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">Theoretical Call Price</span>
                    <span className="text-xl font-bold font-mono text-emerald-300">${greeks.callPrice.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/20 text-center">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block">Theoretical Put Price</span>
                    <span className="text-xl font-bold font-mono text-rose-300">${greeks.putPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* The Greeks Matrix & Payoff Preview */}
              <div className="lg:col-span-6 space-y-4">
                {/* Greeks Grid */}
                <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    The Greeks Sensitivity Matrix
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      { label: "Delta (Call)", value: greeks.delta.call.toFixed(4), color: "#10b981" },
                      { label: "Delta (Put)", value: greeks.delta.put.toFixed(4), color: "#ef4444" },
                      { label: "Gamma", value: greeks.gamma.toFixed(4), color: "#6366f1" },
                      { label: "Theta (Call/Day)", value: `$${greeks.theta.call.toFixed(2)}`, color: "#f59e0b" },
                      { label: "Vega (per 1% IV)", value: `$${greeks.vega.toFixed(2)}`, color: "#a855f7" },
                      { label: "Rho (per 1% Rate)", value: `$${greeks.rho.call.toFixed(2)}`, color: "#38bdf8" },
                    ].map((g) => (
                      <div key={g.label} className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                        <span className="text-[9px] text-slate-400 block truncate">{g.label}</span>
                        <span className="text-xs font-bold mt-0.5 block" style={{ color: g.color }}>{g.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expiration Payoff Curve */}
                <div className="p-5 rounded-2xl border border-white/10 bg-slate-950 shadow-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Payoff at Expiration (Strike: ${strike})
                    </h3>
                    <div className="flex gap-3 text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold">&bull; Call PnL</span>
                      <span className="text-rose-400 font-bold">&bull; Put PnL</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 400 140" className="w-full h-32">
                    <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <polyline
                      points={payoffPoints.map((p, i) => `${(i / (payoffPoints.length - 1)) * 400},${70 - (p.callPnL / maxPnL) * 60}`).join(" ")}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <polyline
                      points={payoffPoints.map((p, i) => `${(i / (payoffPoints.length - 1)) * 400},${70 - (p.putPnL / maxPnL) * 60}`).join(" ")}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Option Chain Matrix */}
        {tab === "chain" && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-serif">Simulated Multi-Strike Option Chain Matrix</h2>
                <p className="text-[11px] text-slate-400">Live theoretical market bids, asks, Greeks, volume and open interest across strikes.</p>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                SPOT: <span className="text-emerald-400 font-bold">${spot}</span> &bull; DTE: <span className="text-cyan-300 font-bold">{expiryDays}d</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 overflow-x-auto shadow-xl">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 text-left text-emerald-400">Call Bid</th>
                    <th className="py-2 text-left text-emerald-400">Call Ask</th>
                    <th className="py-2 text-left">Call Δ</th>
                    <th className="py-2 text-left">Call Vol</th>
                    <th className="py-2 text-center text-white bg-slate-800/80 px-4 rounded-t">STRIKE</th>
                    <th className="py-2 text-right">Put Vol</th>
                    <th className="py-2 text-right">Put Δ</th>
                    <th className="py-2 text-right text-rose-400">Put Bid</th>
                    <th className="py-2 text-right text-rose-400">Put Ask</th>
                  </tr>
                </thead>
                <tbody>
                  {optionChain.map((row) => {
                    const isATM = Math.abs(row.strike - spot) <= 2.5;
                    return (
                      <tr
                        key={row.strike}
                        className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                          isATM ? "bg-cyan-500/10 font-bold" : ""
                        }`}
                      >
                        <td className="py-1.5 text-emerald-300">${row.callBid}</td>
                        <td className="py-1.5 text-emerald-400">${row.callAsk}</td>
                        <td className="py-1.5 text-slate-400">{row.callDelta}</td>
                        <td className="py-1.5 text-slate-500">{row.callVolume}</td>
                        <td className="py-1.5 text-center font-bold text-white bg-slate-800/40 px-3">
                          ${row.strike}
                        </td>
                        <td className="py-1.5 text-right text-slate-500">{row.putVolume}</td>
                        <td className="py-1.5 text-right text-slate-400">{row.putDelta}</td>
                        <td className="py-1.5 text-right text-rose-300">${row.putBid}</td>
                        <td className="py-1.5 text-right text-rose-400">${row.putAsk}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Volatility Surface */}
        {tab === "vol_surface" && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-serif">Implied Volatility Smile &amp; Term Surface</h2>
                <p className="text-[11px] text-slate-400">Skew and term structure across expiration horizons (7 DTE to 180 DTE).</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-xl">
              <div className="h-[320px] rounded-xl overflow-hidden relative">
                <canvas ref={volCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Multi-Leg Strategies */}
        {tab === "strategies" && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Strategy List */}
            <div className="lg:col-span-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Standard Options Architectures
              </h3>
              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {STRATEGIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      cyberSound.playClick();
                      setSelectedStrategy(s.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      selectedStrategy === s.id
                        ? "bg-slate-800 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        : "bg-slate-900/60 border-white/5 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="font-bold text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.outlook} &bull; {s.risk} Risk</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Strategy Detail */}
            <div className="lg:col-span-8">
              {selectedStrategy && (() => {
                const strat = STRATEGIES.find((x) => x.id === selectedStrategy)!;
                return (
                  <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/80 space-y-5 shadow-xl">
                    <div className="flex justify-between items-start border-b border-white/10 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-white font-serif">{strat.name}</h2>
                        <p className="text-xs text-slate-300 mt-1">{strat.description}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {strat.outlook.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9px] text-slate-400 block">MAX PROFIT</span>
                        <span className="text-emerald-400 font-bold">{strat.maxProfit}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9px] text-slate-400 block">MAX LOSS</span>
                        <span className="text-rose-400 font-bold">{strat.maxLoss}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9px] text-slate-400 block">BREAKEVEN</span>
                        <span className="text-amber-300 font-bold">{strat.breakeven}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Strategy Legs Breakdown
                      </h3>
                      <div className="space-y-1.5">
                        {strat.legs.map((leg, i) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
                              {i + 1}
                            </span>
                            <span className="text-white font-medium">{leg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
