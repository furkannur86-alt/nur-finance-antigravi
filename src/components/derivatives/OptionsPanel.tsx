"use client";

import { useState, useMemo } from "react";

type Strategy = "long-call" | "long-put" | "covered-call" | "protective-put" | "bull-call-spread" | "bear-put-spread" | "straddle" | "strangle" | "iron-condor" | "butterfly" | "calendar-spread" | "collar";

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

const strategies: StrategyInfo[] = [
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

function BSCallPrice(S: number, K: number, T: number, r: number, sigma: number): number {
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
}

function BSPutPrice(S: number, K: number, T: number, r: number, sigma: number): number {
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
}

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

function computeGreeks(S: number, K: number, T: number, r: number, sigma: number) {
  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return {
    callPrice: BSCallPrice(S, K, T, r, sigma),
    putPrice: BSPutPrice(S, K, T, r, sigma),
    delta: { call: normCDF(d1), put: normCDF(d1) - 1 },
    gamma: normPDF(d1) / (S * sigma * Math.sqrt(T)),
    theta: {
      call: (-S * normPDF(d1) * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365,
      put: (-S * normPDF(d1) * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCDF(-d2)) / 365,
    },
    vega: S * normPDF(d1) * Math.sqrt(T) / 100,
    rho: {
      call: K * T * Math.exp(-r * T) * normCDF(d2) / 100,
      put: -K * T * Math.exp(-r * T) * normCDF(-d2) / 100,
    },
  };
}

export default function OptionsPanel() {
  const [tab, setTab] = useState<"calculator" | "strategies" | "chain">("calculator");
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(105);
  const [expiry, setExpiry] = useState(30);
  const [rate, setRate] = useState(5);
  const [vol, setVol] = useState(25);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const greeks = useMemo(
    () => computeGreeks(spot, strike, expiry / 365, rate / 100, vol / 100),
    [spot, strike, expiry, rate, vol]
  );

  const payoffPoints = useMemo(() => {
    const points: { price: number; callPnL: number; putPnL: number }[] = [];
    for (let p = spot * 0.7; p <= spot * 1.3; p += spot * 0.01) {
      points.push({
        price: p,
        callPnL: Math.max(0, p - strike) - greeks.callPrice,
        putPnL: Math.max(0, strike - p) - greeks.putPrice,
      });
    }
    return points;
  }, [spot, strike, greeks.callPrice, greeks.putPrice]);

  const maxPnL = Math.max(...payoffPoints.map((p) => Math.max(Math.abs(p.callPnL), Math.abs(p.putPnL))));

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--ag-accent)">
          <circle cx="8" cy="8" r="6" fill="none" stroke="var(--ag-accent)" strokeWidth="1.5" />
          <path d="M5 8h6M8 5v6" stroke="var(--ag-accent)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Options & Derivatives</span>
        <div className="flex gap-1 ml-4">
          {(["calculator", "strategies", "chain"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 text-xs rounded transition-colors capitalize"
              style={{
                background: tab === t ? "rgba(0,212,170,0.15)" : "transparent",
                color: tab === t ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {t === "chain" ? "Option Chain" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ag-muted)" }}>
                Black-Scholes Parameters
              </h2>
              <div className="space-y-3 p-4 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                {[
                  { label: "Spot Price ($)", value: spot, set: setSpot, min: 1, max: 10000, step: 1 },
                  { label: "Strike Price ($)", value: strike, set: setStrike, min: 1, max: 10000, step: 1 },
                  { label: "Days to Expiry", value: expiry, set: setExpiry, min: 1, max: 730, step: 1 },
                  { label: "Risk-Free Rate (%)", value: rate, set: setRate, min: 0, max: 20, step: 0.1 },
                  { label: "Implied Volatility (%)", value: vol, set: setVol, min: 1, max: 200, step: 1 },
                ].map((param) => (
                  <div key={param.label}>
                    <div className="flex justify-between mb-1">
                      <label className="text-[11px]" style={{ color: "var(--ag-muted)" }}>{param.label}</label>
                      <input
                        type="number"
                        value={param.value}
                        onChange={(e) => param.set(Number(e.target.value))}
                        className="w-20 text-right text-xs bg-transparent border-b outline-none"
                        style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                      />
                    </div>
                    <input
                      type="range"
                      value={param.value}
                      onChange={(e) => param.set(Number(e.target.value))}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: "var(--ag-accent)" }}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>Call Price</div>
                  <div className="text-xl font-bold" style={{ color: "#00d4aa" }}>${greeks.callPrice.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>Put Price</div>
                  <div className="text-xl font-bold" style={{ color: "#e06c75" }}>${greeks.putPrice.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ag-muted)" }}>The Greeks</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Delta (Call)", value: greeks.delta.call.toFixed(4), color: "#00d4aa" },
                    { label: "Delta (Put)", value: greeks.delta.put.toFixed(4), color: "#e06c75" },
                    { label: "Gamma", value: greeks.gamma.toFixed(4), color: "#6366f1" },
                    { label: "Theta (Call)", value: greeks.theta.call.toFixed(4), color: "#f0b429" },
                    { label: "Vega", value: greeks.vega.toFixed(4), color: "#c678dd" },
                    { label: "Rho (Call)", value: greeks.rho.call.toFixed(4), color: "#56b6c2" },
                  ].map((g) => (
                    <div key={g.label} className="flex justify-between items-center py-1">
                      <span className="text-[11px]" style={{ color: "var(--ag-muted)" }}>{g.label}</span>
                      <span className="text-xs font-mono font-semibold" style={{ color: g.color }}>{g.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ag-muted)" }}>
                Payoff at Expiration
              </h2>
              <div className="p-4 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <svg viewBox="0 0 400 200" className="w-full">
                  <line x1="0" y1="100" x2="400" y2="100" stroke="var(--ag-border)" strokeWidth="0.5" />
                  <line x1={((strike - spot * 0.7) / (spot * 0.6)) * 400} y1="0" x2={((strike - spot * 0.7) / (spot * 0.6)) * 400} y2="200" stroke="var(--ag-border)" strokeWidth="0.5" strokeDasharray="4" />
                  <text x={((strike - spot * 0.7) / (spot * 0.6)) * 400} y="195" fill="var(--ag-muted)" fontSize="8" textAnchor="middle">K={strike}</text>
                  <text x="5" y="10" fill="var(--ag-muted)" fontSize="7">P&L ($)</text>
                  <polyline
                    points={payoffPoints.map((p, i) => `${(i / payoffPoints.length) * 400},${100 - (p.callPnL / maxPnL) * 90}`).join(" ")}
                    fill="none" stroke="#00d4aa" strokeWidth="1.5"
                  />
                  <polyline
                    points={payoffPoints.map((p, i) => `${(i / payoffPoints.length) * 400},${100 - (p.putPnL / maxPnL) * 90}`).join(" ")}
                    fill="none" stroke="#e06c75" strokeWidth="1.5"
                  />
                  <rect x="310" y="5" width="85" height="30" rx="3" fill="var(--ag-bg)" fillOpacity="0.8" />
                  <line x1="315" y1="15" x2="330" y2="15" stroke="#00d4aa" strokeWidth="1.5" />
                  <text x="335" y="18" fill="var(--ag-muted)" fontSize="7">Call</text>
                  <line x1="315" y1="27" x2="330" y2="27" stroke="#e06c75" strokeWidth="1.5" />
                  <text x="335" y="30" fill="var(--ag-muted)" fontSize="7">Put</text>
                </svg>
              </div>

              <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Quick Summary</h3>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span style={{ color: "var(--ag-muted)" }}>Intrinsic (Call)</span><span style={{ color: "var(--ag-text)" }}>${Math.max(0, spot - strike).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ag-muted)" }}>Time Value (Call)</span><span style={{ color: "var(--ag-text)" }}>${(greeks.callPrice - Math.max(0, spot - strike)).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ag-muted)" }}>Intrinsic (Put)</span><span style={{ color: "var(--ag-text)" }}>${Math.max(0, strike - spot).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ag-muted)" }}>Moneyness</span><span style={{ color: spot > strike ? "#00d4aa" : spot < strike ? "#e06c75" : "var(--ag-text)" }}>{spot > strike ? "ITM" : spot < strike ? "OTM" : "ATM"}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ag-muted)" }}>Put-Call Parity</span><span style={{ color: "var(--ag-text)" }}>${(greeks.callPrice - greeks.putPrice + strike * Math.exp(-rate / 100 * expiry / 365) - spot).toFixed(4)}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "strategies" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Strategies</h2>
              {strategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStrategy(s.id)}
                  className="w-full text-left p-2.5 rounded-lg border transition-all text-xs"
                  style={{
                    borderColor: selectedStrategy === s.id ? "var(--ag-accent)" : "var(--ag-border)",
                    background: selectedStrategy === s.id ? "rgba(0,212,170,0.05)" : "var(--ag-surface)",
                    color: "var(--ag-text)",
                  }}
                >
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>{s.outlook}</div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              {selectedStrategy ? (() => {
                const s = strategies.find((x) => x.id === selectedStrategy)!;
                return (
                  <div className="p-4 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                    <h2 className="text-base font-bold mb-1" style={{ color: "var(--ag-text)" }}>{s.name}</h2>
                    <p className="text-xs mb-4" style={{ color: "var(--ag-muted)" }}>{s.description}</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Outlook", value: s.outlook },
                        { label: "Risk", value: s.risk },
                        { label: "Reward", value: s.reward },
                      ].map((item) => (
                        <div key={item.label} className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>{item.label}</div>
                          <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--ag-text)" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Legs</h3>
                      <div className="space-y-1">
                        {s.legs.map((leg, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>{i + 1}</span>
                            {leg}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "Max Profit", value: s.maxProfit },
                        { label: "Max Loss", value: s.maxLoss },
                        { label: "Breakeven", value: s.breakeven },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-xs py-1 border-b" style={{ borderColor: "var(--ag-border)" }}>
                          <span style={{ color: "var(--ag-muted)" }}>{item.label}</span>
                          <span className="font-mono" style={{ color: "var(--ag-text)" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="flex items-center justify-center h-full rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  <p className="text-xs" style={{ color: "var(--ag-muted)" }}>Select a strategy to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "chain" && (
          <div className="text-center py-12">
            <svg width="40" height="40" viewBox="0 0 16 16" fill="var(--ag-muted)" className="mx-auto mb-3 opacity-30">
              <circle cx="8" cy="8" r="6" fill="none" stroke="var(--ag-muted)" strokeWidth="1" />
              <path d="M5 8h6M8 5v6" stroke="var(--ag-muted)" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ag-text)" }}>Option Chain</p>
            <p className="text-xs" style={{ color: "var(--ag-muted)" }}>
              Real-time option chain data requires CBOE or exchange feed connection.<br />
              Enter a symbol in the terminal: OPT AAPL to view live chains.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
