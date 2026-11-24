"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "curves" | "spreads" | "forward" | "risk";

export default function IRSwapCurvePanel() {
  const [tab, setTab] = useState<Tab>("curves");

  const swapRates = [
    { tenor: "1Y", usd: 4.52, eur: 3.08, gbp: 4.85, jpy: 0.42, chg_usd: -0.03 },
    { tenor: "2Y", usd: 4.28, eur: 2.85, gbp: 4.52, jpy: 0.55, chg_usd: -0.05 },
    { tenor: "3Y", usd: 4.15, eur: 2.72, gbp: 4.38, jpy: 0.62, chg_usd: -0.04 },
    { tenor: "5Y", usd: 4.08, eur: 2.65, gbp: 4.22, jpy: 0.78, chg_usd: -0.02 },
    { tenor: "7Y", usd: 4.12, eur: 2.70, gbp: 4.28, jpy: 0.88, chg_usd: 0.01 },
    { tenor: "10Y", usd: 4.18, eur: 2.78, gbp: 4.35, jpy: 1.05, chg_usd: 0.03 },
    { tenor: "15Y", usd: 4.25, eur: 2.85, gbp: 4.40, jpy: 1.18, chg_usd: 0.04 },
    { tenor: "20Y", usd: 4.30, eur: 2.90, gbp: 4.42, jpy: 1.28, chg_usd: 0.05 },
    { tenor: "30Y", usd: 4.28, eur: 2.88, gbp: 4.38, jpy: 1.35, chg_usd: 0.04 },
  ];

  const basisSpreads = [
    { pair: "USD 3M vs 6M", tenor: "5Y", spread: -8.5, chg: -0.3 },
    { pair: "USD SOFR vs FF", tenor: "5Y", spread: -1.2, chg: 0.1 },
    { pair: "EUR 3M vs 6M", tenor: "5Y", spread: -5.8, chg: -0.2 },
    { pair: "USD/EUR XCCY", tenor: "5Y", spread: -22.5, chg: -1.5 },
    { pair: "USD/JPY XCCY", tenor: "5Y", spread: -55.2, chg: -3.2 },
    { pair: "USD/GBP XCCY", tenor: "5Y", spread: -12.8, chg: -0.8 },
    { pair: "SOFR/ESTR", tenor: "5Y", spread: 142.5, chg: 0.5 },
    { pair: "SONIA vs Gilt", tenor: "10Y", spread: -18.5, chg: 1.2 },
  ];

  const forwardRates = [
    { period: "1Y1Y", rate: 3.85, chg: -0.08, implied: "2 cuts" },
    { period: "2Y1Y", rate: 3.65, chg: -0.05, implied: "3 cuts" },
    { period: "5Y5Y", rate: 4.02, chg: 0.02, implied: "Neutral" },
    { period: "1Y2Y", rate: 3.78, chg: -0.06, implied: "2-3 cuts" },
    { period: "2Y2Y", rate: 3.72, chg: -0.04, implied: "Terminal ~3.75%" },
    { period: "3Y2Y", rate: 3.88, chg: 0.01, implied: "Slight steepening" },
    { period: "5Y10Y", rate: 4.28, chg: 0.05, implied: "Bear steepener" },
    { period: "10Y10Y", rate: 4.35, chg: 0.04, implied: "Long-term neutral" },
  ];

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📐</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>IRS CURVE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg IRSB</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["curves", "spreads", "forward", "risk"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "curves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL IRS CURVES (MID)</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Tenor", "USD SOFR", "EUR ESTR", "GBP SONIA", "JPY TONA", "USD Chg"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {swapRates.map(r => (
                    <tr key={r.tenor} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{r.tenor}</td>
                      <td className="px-2 py-1.5 font-mono font-bold">{r.usd.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 font-mono">{r.eur.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 font-mono">{r.gbp.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 font-mono">{r.jpy.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.chg_usd >= 0 ? "#ef4444" : "#22c55e" }}>{r.chg_usd >= 0 ? "+" : ""}{(r.chg_usd * 100).toFixed(1)}bp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>USD SOFR SWAP CURVE</div>
            <svg viewBox="0 0 400 120" className="w-full">
              <line x1="30" y1="10" x2="30" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
              <line x1="30" y1="100" x2="390" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
              {[3.5, 4.0, 4.5, 5.0].map((v, i) => (
                <g key={v}>
                  <line x1="30" y1={100 - (v - 3.5) * 60} x2="390" y2={100 - (v - 3.5) * 60} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                  <text x="5" y={103 - (v - 3.5) * 60} fill="#64748b" fontSize={7}>{v.toFixed(1)}</text>
                </g>
              ))}
              <polyline
                points={swapRates.map((r, i) => `${30 + i * 45},${100 - (r.usd - 3.5) * 60}`).join(" ")}
                fill="none" stroke="#00e5a0" strokeWidth={1.5}
              />
              {swapRates.map((r, i) => (
                <circle key={r.tenor} cx={30 + i * 45} cy={100 - (r.usd - 3.5) * 60} r={2.5} fill="#00e5a0" />
              ))}
              <polyline
                points={swapRates.map((r, i) => `${30 + i * 45},${100 - (r.eur - 3.5) * 60}`).join(" ")}
                fill="none" stroke="#38bdf8" strokeWidth={1} strokeDasharray="4 2"
              />
              {swapRates.map((r, i) => (
                <text key={`t-${r.tenor}`} x={30 + i * 45} y={112} textAnchor="middle" fill="#64748b" fontSize={7}>{r.tenor}</text>
              ))}
              <text x="350" y={100 - (swapRates[8].usd - 3.5) * 60 - 5} fill="#00e5a0" fontSize={7}>USD</text>
              <text x="350" y={100 - (swapRates[8].eur - 3.5) * 60 - 5} fill="#38bdf8" fontSize={7}>EUR</text>
            </svg>
          </div>
        )}

        {tab === "spreads" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BASIS & CROSS-CURRENCY SPREADS</div>
            {basisSpreads.map(b => (
              <div key={b.pair} className="p-2.5 rounded flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{b.pair}</span>
                  <span className="text-[8px] ml-2" style={{ color: "#64748b" }}>{b.tenor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{b.spread > 0 ? "+" : ""}{b.spread.toFixed(1)}bp</span>
                  <span className="font-mono text-[9px]" style={{ color: b.chg >= 0 ? "#ef4444" : "#22c55e" }}>{b.chg >= 0 ? "+" : ""}{b.chg.toFixed(1)}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SWAP SPREAD (IRS vs Treasury)</div>
            {[
              { tenor: "2Y", spread: -18.5, chg: -1.2 },
              { tenor: "5Y", spread: -12.8, chg: -0.5 },
              { tenor: "10Y", spread: -28.2, chg: -2.1 },
              { tenor: "30Y", spread: -65.5, chg: -3.5 },
            ].map(s => (
              <div key={s.tenor} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-8" style={{ color: "#38bdf8" }}>{s.tenor}</span>
                <div className="flex-1 mx-3 h-2 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute h-full rounded-full" style={{ right: "50%", width: `${Math.abs(s.spread) * 0.5}%`, background: "rgba(239,68,68,0.3)" }} />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                </div>
                <span className="font-mono w-16 text-right">{s.spread.toFixed(1)}bp</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#ef4444" }}>{s.chg.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "forward" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FORWARD STARTING SWAP RATES (USD)</div>
            {forwardRates.map(f => (
              <div key={f.period} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{f.period}</span>
                  <span className="font-mono font-bold">{f.rate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{f.implied}</span>
                  <span className="font-mono" style={{ color: f.chg >= 0 ? "#ef4444" : "#22c55e" }}>{f.chg >= 0 ? "+" : ""}{(f.chg * 100).toFixed(1)}bp</span>
                </div>
              </div>
            ))}

            <div className="p-2.5 rounded" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-1" style={{ color: "#00e5a0" }}>MARKET-IMPLIED FED FUNDS PATH</div>
              <div className="grid grid-cols-4 gap-2 text-[9px]">
                {[
                  { meeting: "Dec 2024", rate: "4.25-4.50%", prob: "88% cut" },
                  { meeting: "Jan 2025", rate: "4.00-4.25%", prob: "65% cut" },
                  { meeting: "Mar 2025", rate: "3.75-4.00%", prob: "72% cut" },
                  { meeting: "Jun 2025", rate: "3.50-3.75%", prob: "58% cut" },
                ].map(m => (
                  <div key={m.meeting}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>{m.meeting}</div>
                    <div className="font-mono font-bold">{m.rate}</div>
                    <div className="text-[8px]" style={{ color: "#22c55e" }}>{m.prob}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>IRS PORTFOLIO RISK METRICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "DV01", val: "$125K", sub: "Per $100M notional" },
                { label: "Convexity", val: "+0.82", sub: "Positive convexity" },
                { label: "VaR (99%, 1D)", val: "$1.8M", sub: "Parametric" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SCENARIO ANALYSIS — $100M 5Y RECEIVE FIXED</div>
            {[
              { scenario: "Parallel +50bp", pnl: "-$2.35M", dv01Chg: "+$2K", comment: "Duration hit" },
              { scenario: "Parallel -50bp", pnl: "+$2.42M", dv01Chg: "-$2K", comment: "Duration gain + convexity" },
              { scenario: "Bull Steepener (2s10s +25bp)", pnl: "+$850K", dv01Chg: "+$500", comment: "Front-end rally" },
              { scenario: "Bear Flattener (2s10s -25bp)", pnl: "-$620K", dv01Chg: "-$300", comment: "2Y selloff" },
              { scenario: "Vol Spike (+5 vol)", pnl: "-$180K", dv01Chg: "+$100", comment: "Swaption gamma" },
              { scenario: "Basis Blowout (+10bp)", pnl: "-$95K", dv01Chg: "Flat", comment: "SOFR-FF basis risk" },
            ].map(s => (
              <div key={s.scenario} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex-1">
                  <span className="font-bold">{s.scenario}</span>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.comment}</div>
                </div>
                <span className="font-mono font-bold w-20 text-right" style={{ color: s.pnl.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.pnl}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
