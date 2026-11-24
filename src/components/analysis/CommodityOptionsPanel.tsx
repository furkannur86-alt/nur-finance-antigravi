"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "board" | "greeks" | "strategies" | "skew";

export default function CommodityOptionsPanel() {
  const [tab, setTab] = useState<Tab>("board");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛢️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>COMMODITY OPTIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>CME OPTS</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["board", "greeks", "strategies", "skew"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "board" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WTI CRUDE OIL — JAN 2027 OPTIONS</div>
            <div className="flex gap-2 mb-1 text-[8px]">
              <span style={{ color: "#64748b" }}>Underlying: <span className="font-mono" style={{ color: "#e2e8f0" }}>$72.50</span></span>
              <span style={{ color: "#64748b" }}>DTE: <span className="font-mono">35</span></span>
              <span style={{ color: "#64748b" }}>ATM IV: <span className="font-mono" style={{ color: "#fbbf24" }}>32.5%</span></span>
            </div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#22c55e" }}>Call Bid</th>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#22c55e" }}>Call Ask</th>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#64748b" }}>IV</th>
                    <th className="px-1.5 py-1 text-center font-bold" style={{ color: "#fbbf24" }}>Strike</th>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#64748b" }}>IV</th>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#ef4444" }}>Put Bid</th>
                    <th className="px-1.5 py-1 text-right" style={{ color: "#ef4444" }}>Put Ask</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { strike: 65, cBid: 7.85, cAsk: 8.05, cIV: 38.2, pBid: 0.32, pAsk: 0.42, pIV: 39.5 },
                    { strike: 67.5, cBid: 5.65, cAsk: 5.85, cIV: 35.8, pBid: 0.58, pAsk: 0.72, pIV: 37.2 },
                    { strike: 70, cBid: 3.82, cAsk: 3.98, cIV: 33.5, pBid: 1.25, pAsk: 1.42, pIV: 34.8 },
                    { strike: 72.5, cBid: 2.35, cAsk: 2.52, cIV: 32.5, pBid: 2.28, pAsk: 2.45, pIV: 32.5 },
                    { strike: 75, cBid: 1.28, cAsk: 1.42, cIV: 31.8, pBid: 3.72, pAsk: 3.88, pIV: 31.2 },
                    { strike: 77.5, cBid: 0.62, cAsk: 0.75, cIV: 31.5, pBid: 5.55, pAsk: 5.72, pIV: 30.5 },
                    { strike: 80, cBid: 0.25, cAsk: 0.35, cIV: 32.2, pBid: 7.68, pAsk: 7.85, pIV: 30.2 },
                  ].map(r => (
                    <tr key={r.strike} style={{
                      borderTop: "1px solid rgba(255,255,255,0.03)",
                      background: r.strike === 72.5 ? "rgba(0,229,160,0.05)" : "transparent",
                    }}>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#22c55e" }}>{r.cBid.toFixed(2)}</td>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#22c55e" }}>{r.cAsk.toFixed(2)}</td>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#64748b" }}>{r.cIV}%</td>
                      <td className="px-1.5 py-1 text-center font-mono font-bold" style={{ color: "#fbbf24" }}>{r.strike}</td>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#64748b" }}>{r.pIV}%</td>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#ef4444" }}>{r.pBid.toFixed(2)}</td>
                      <td className="px-1.5 py-1 text-right font-mono" style={{ color: "#ef4444" }}>{r.pAsk.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "greeks" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>POSITION GREEKS — CRUDE OIL BOOK</div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "Delta", value: "+2,850", color: "#22c55e" },
                { label: "Gamma", value: "+125", color: "#22c55e" },
                { label: "Theta", value: "-$42K/d", color: "#ef4444" },
                { label: "Vega", value: "+$185K/pt", color: "#38bdf8" },
                { label: "Rho", value: "-$8K/1%", color: "#64748b" },
              ].map(g => (
                <div key={g.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{g.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: g.color }}>{g.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMMODITY VOL SURFACE</div>
            {[
              { commodity: "WTI Crude", atm1m: 32.5, atm3m: 30.8, atm6m: 29.2, atm1y: 28.5, skew25d: 4.2 },
              { commodity: "Gold", atm1m: 15.2, atm3m: 14.8, atm6m: 15.5, atm1y: 16.2, skew25d: -1.5 },
              { commodity: "Nat Gas", atm1m: 85.5, atm3m: 72.8, atm6m: 58.2, atm1y: 48.5, skew25d: 12.5 },
              { commodity: "Copper", atm1m: 22.8, atm3m: 21.5, atm6m: 20.2, atm1y: 19.8, skew25d: 2.8 },
              { commodity: "Corn", atm1m: 28.5, atm3m: 25.8, atm6m: 24.2, atm1y: 22.5, skew25d: 5.5 },
              { commodity: "Silver", atm1m: 28.2, atm3m: 26.5, atm6m: 25.8, atm1y: 24.2, skew25d: 1.2 },
            ].map(c => (
              <div key={c.commodity} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{c.commodity}</span>
                <span className="font-mono w-12 text-right">{c.atm1m}%</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{c.atm3m}%</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{c.atm6m}%</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{c.atm1y}%</span>
                <span className="font-mono w-14 text-right" style={{ color: c.skew25d > 0 ? "#ef4444" : "#22c55e" }}>Skew:{c.skew25d > 0 ? "+" : ""}{c.skew25d}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "strategies" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE COMMODITY OPTION STRATEGIES</div>
            {[
              { name: "WTI Put Spread (Protection)", legs: "Long 70P / Short 65P", cost: "$1.25", maxProfit: "$3.75", breakeven: "$68.75", expiry: "Jan 27" },
              { name: "Gold Call Butterfly", legs: "Long 2000C / Short 2x 2050C / Long 2100C", cost: "$8.50", maxProfit: "$41.50", breakeven: "$2008.50-$2091.50", expiry: "Mar 27" },
              { name: "Nat Gas Straddle (Vol Play)", legs: "Long 3.00 Straddle", cost: "$0.85", maxProfit: "Unlimited", breakeven: "$2.15 / $3.85", expiry: "Feb 27" },
              { name: "Copper Collar (Hedging)", legs: "Long 4.00P / Short 4.50C", cost: "Zero-cost", maxProfit: "Capped at $4.50", breakeven: "$4.00-$4.50", expiry: "Jun 27" },
              { name: "Soybean Calendar Spread", legs: "Short Jan 1200C / Long Mar 1200C", cost: "$0.15", maxProfit: "$0.85", breakeven: "Time-dependent", expiry: "Jan/Mar 27" },
            ].map(s => (
              <div key={s.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.name}</span>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Exp: {s.expiry}</span>
                </div>
                <div className="text-[9px] mb-1" style={{ color: "#38bdf8" }}>{s.legs}</div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Cost:</span> <span className="font-mono">{s.cost}</span></div>
                  <div><span style={{ color: "#64748b" }}>Max:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{s.maxProfit}</span></div>
                  <div><span style={{ color: "#64748b" }}>BE:</span> <span className="font-mono">{s.breakeven}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "skew" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VOLATILITY SKEW — WTI CRUDE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 100" className="w-full">
                {[25, 30, 35, 40].map(v => (
                  <g key={v}>
                    <line x1="40" y1={100 - (v - 25) * 5} x2="380" y2={100 - (v - 25) * 5} stroke="rgba(255,255,255,0.05)" />
                    <text x="35" y={103 - (v - 25) * 5} textAnchor="end" fill="#64748b" fontSize="7">{v}%</text>
                  </g>
                ))}
                <polyline
                  points="60,20 100,35 140,50 180,60 220,65 260,62 300,58 340,55 360,52"
                  fill="none" stroke="#00e5a0" strokeWidth="2" />
                <polyline
                  points="60,25 100,38 140,52 180,62 220,67 260,65 300,62 340,60 360,58"
                  fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
                {["10P","25P","40P","ATM","60C","75C","90C"].map((label, i) => (
                  <text key={label} x={60 + i * 45} y="97" textAnchor="middle" fill="#64748b" fontSize="6">{label}</text>
                ))}
                <text x="375" y="12" fill="#00e5a0" fontSize="7" textAnchor="end">Current</text>
                <text x="375" y="22" fill="#64748b" fontSize="7" textAnchor="end">30d ago</text>
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SKEW METRICS</div>
            {[
              { metric: "25D Risk Reversal (C-P)", value: "-4.2 vol pts", interp: "Puts bid — downside protection demand elevated" },
              { metric: "25D Butterfly", value: "2.8 vol pts", interp: "Moderate wing demand — tail hedging active" },
              { metric: "Skew Percentile (1Y)", value: "72nd", interp: "Above average put skew" },
              { metric: "Term Structure Slope", value: "-3.3 vol pts", interp: "Front month vol premium — near-term event risk" },
            ].map(m => (
              <div key={m.metric} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold">{m.metric}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{m.value}</span>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{m.interp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
