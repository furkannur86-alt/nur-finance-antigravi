"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "surface" | "skew" | "strategies" | "em-vol";

export default function FXVolatilityPanel() {
  const [tab, setTab] = useState<Tab>("surface");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FX VOLATILITY</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg FXVL</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["surface", "skew", "strategies", "em-vol"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "em-vol" ? "EM VOL" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "surface" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>G10 IMPLIED VOLATILITY MATRIX (ATM)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[8px] font-mono">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th className="px-2 py-1 text-left" style={{ color: "#64748b" }}>Pair</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Spot</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>1W</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>1M</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>3M</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>6M</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>1Y</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Chg 1D</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pair: "EUR/USD", spot: "1.0845", w1: 6.8, m1: 7.2, m3: 7.8, m6: 8.1, y1: 8.4, chg: -0.3 },
                    { pair: "USD/JPY", spot: "154.20", w1: 10.2, m1: 10.8, m3: 11.2, m6: 11.5, y1: 11.8, chg: 0.5 },
                    { pair: "GBP/USD", spot: "1.2650", w1: 7.5, m1: 7.9, m3: 8.4, m6: 8.8, y1: 9.1, chg: -0.1 },
                    { pair: "USD/CHF", spot: "0.8820", w1: 7.1, m1: 7.5, m3: 8.0, m6: 8.3, y1: 8.6, chg: 0.2 },
                    { pair: "AUD/USD", spot: "0.6520", w1: 9.8, m1: 10.2, m3: 10.8, m6: 11.1, y1: 11.4, chg: 0.4 },
                    { pair: "USD/CAD", spot: "1.3680", w1: 6.5, m1: 6.9, m3: 7.4, m6: 7.8, y1: 8.1, chg: -0.2 },
                    { pair: "NZD/USD", spot: "0.5920", w1: 10.5, m1: 11.0, m3: 11.5, m6: 11.9, y1: 12.2, chg: 0.6 },
                    { pair: "USD/NOK", spot: "10.85", w1: 11.2, m1: 11.8, m3: 12.4, m6: 12.8, y1: 13.1, chg: 0.3 },
                  ].map(r => (
                    <tr key={r.pair} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1 font-bold" style={{ color: "#00e5a0" }}>{r.pair}</td>
                      <td className="px-2 py-1 text-right">{r.spot}</td>
                      {[r.w1, r.m1, r.m3, r.m6, r.y1].map((v, i) => (
                        <td key={i} className="px-2 py-1 text-right" style={{ color: v > 11 ? "#ef4444" : v > 9 ? "#fbbf24" : "#22c55e" }}>{v.toFixed(1)}</td>
                      ))}
                      <td className="px-2 py-1 text-right" style={{ color: r.chg >= 0 ? "#ef4444" : "#22c55e" }}>{r.chg >= 0 ? "+" : ""}{r.chg.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "skew" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RISK REVERSAL (25-DELTA, 1M)</div>
            {[
              { pair: "EUR/USD", rr: -0.35, bf: 0.28, desc: "Slight USD call bias" },
              { pair: "USD/JPY", rr: -1.85, bf: 0.65, desc: "Strong JPY call bias (intervention fear)" },
              { pair: "GBP/USD", rr: -0.22, bf: 0.25, desc: "Balanced" },
              { pair: "AUD/USD", rr: -0.95, bf: 0.42, desc: "AUD put premium" },
              { pair: "USD/CNH", rr: 0.85, bf: 0.55, desc: "CNH depreciation hedge demand" },
              { pair: "USD/MXN", rr: 1.20, bf: 0.72, desc: "MXN tail risk premium" },
            ].map(r => (
              <div key={r.pair} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{r.pair}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>25D Risk Reversal</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="absolute top-0 h-full rounded-full" style={{
                          left: r.rr < 0 ? `${50 + r.rr * 15}%` : "50%",
                          width: `${Math.abs(r.rr) * 15}%`,
                          background: r.rr < 0 ? "#ef4444" : "#22c55e",
                          opacity: 0.5
                        }} />
                      </div>
                      <span className="font-mono w-12 text-right" style={{ color: r.rr < 0 ? "#ef4444" : "#22c55e" }}>{r.rr > 0 ? "+" : ""}{r.rr.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Butterfly</div>
                    <span className="font-mono" style={{ color: "#fbbf24" }}>{r.bf.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "strategies" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FX OPTIONS STRATEGIES</div>
            {[
              { name: "EUR/USD 1M Straddle", type: "Straddle", strike: "1.0845", premium: "185 pips", breakeven: "1.0660 / 1.1030", iv: 7.2 },
              { name: "USD/JPY 1M 25D Put", type: "Vanilla Put", strike: "152.00", premium: "95 pips", breakeven: "151.05", iv: 10.8 },
              { name: "AUD/USD 3M RKO", type: "Reverse KO", strike: "0.6400", premium: "45 pips", breakeven: "0.6355", iv: 10.8 },
              { name: "GBP/USD 1M Strangle", type: "Strangle", strike: "1.2500/1.2800", premium: "120 pips", breakeven: "1.2380/1.2920", iv: 7.9 },
              { name: "EUR/GBP 3M Seagull", type: "Seagull", strike: "0.8550/0.8650/0.8750", premium: "Zero cost", breakeven: "0.8550", iv: 5.8 },
            ].map(s => (
              <div key={s.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{s.type}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#fbbf24" }}>IV: {s.iv}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Strike:</span> <span className="font-mono">{s.strike}</span></div>
                  <div><span style={{ color: "#64748b" }}>Premium:</span> <span className="font-mono" style={{ color: "#00e5a0" }}>{s.premium}</span></div>
                  <div><span style={{ color: "#64748b" }}>B/E:</span> <span className="font-mono">{s.breakeven}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "em-vol" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EMERGING MARKET FX VOLATILITY</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: "JP Morgan EM Vol", val: "11.8%", color: "#fbbf24" },
                { label: "EM-G10 Vol Spread", val: "+4.2%", color: "#ef4444" },
                { label: "CVIX Index", val: "9.85", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            {[
              { pair: "USD/TRY", spot: "32.50", atm1m: 22.5, rr25d: 4.8, carry: "45%", regime: "Managed" },
              { pair: "USD/ZAR", spot: "18.85", atm1m: 15.2, rr25d: 2.5, carry: "7.5%", regime: "Float" },
              { pair: "USD/BRL", spot: "5.15", atm1m: 14.8, rr25d: 2.2, carry: "11.5%", regime: "Float" },
              { pair: "USD/MXN", spot: "17.25", atm1m: 12.5, rr25d: 1.8, carry: "9.8%", regime: "Float" },
              { pair: "USD/INR", spot: "83.40", atm1m: 4.2, rr25d: 0.8, carry: "5.5%", regime: "Managed" },
              { pair: "USD/CNH", spot: "7.28", atm1m: 5.8, rr25d: 1.2, carry: "2.5%", regime: "Managed" },
              { pair: "USD/PLN", spot: "4.05", atm1m: 9.5, rr25d: 1.5, carry: "5.0%", regime: "Float" },
            ].map(r => (
              <div key={r.pair} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{r.pair}</span>
                    <span className="font-mono">{r.spot}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: r.regime === "Managed" ? "rgba(168,85,247,0.1)" : "rgba(56,189,248,0.1)", color: r.regime === "Managed" ? "#a855f7" : "#38bdf8" }}>{r.regime}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#fbbf24" }}>Carry: {r.carry}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>1M ATM:</span> <span className="font-mono" style={{ color: r.atm1m > 15 ? "#ef4444" : r.atm1m > 10 ? "#fbbf24" : "#22c55e" }}>{r.atm1m}%</span></div>
                  <div><span style={{ color: "#64748b" }}>25D RR:</span> <span className="font-mono" style={{ color: r.rr25d > 2 ? "#ef4444" : "#fbbf24" }}>+{r.rr25d}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
