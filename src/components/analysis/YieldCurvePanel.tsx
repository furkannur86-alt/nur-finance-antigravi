"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "curves" | "spreads" | "history" | "forwards";

const US_CURVE = [
  { tenor: "1M", yield: 4.52, prev: 4.55, chg: -0.03 },
  { tenor: "3M", yield: 4.48, prev: 4.50, chg: -0.02 },
  { tenor: "6M", yield: 4.35, prev: 4.38, chg: -0.03 },
  { tenor: "1Y", yield: 4.18, prev: 4.22, chg: -0.04 },
  { tenor: "2Y", yield: 3.95, prev: 4.02, chg: -0.07 },
  { tenor: "3Y", yield: 3.82, prev: 3.90, chg: -0.08 },
  { tenor: "5Y", yield: 3.78, prev: 3.85, chg: -0.07 },
  { tenor: "7Y", yield: 3.85, prev: 3.90, chg: -0.05 },
  { tenor: "10Y", yield: 3.92, prev: 3.98, chg: -0.06 },
  { tenor: "20Y", yield: 4.18, prev: 4.22, chg: -0.04 },
  { tenor: "30Y", yield: 4.25, prev: 4.28, chg: -0.03 },
];

const GLOBAL_CURVES = [
  { country: "Germany", flag: "🇩🇪", y2: 2.15, y10: 2.42, slope: 27, chg10: -0.04 },
  { country: "UK", flag: "🇬🇧", y2: 4.08, y10: 4.22, slope: 14, chg10: -0.06 },
  { country: "Japan", flag: "🇯🇵", y2: 0.42, y10: 1.05, slope: 63, chg10: 0.02 },
  { country: "France", flag: "🇫🇷", y2: 2.45, y10: 2.95, slope: 50, chg10: -0.03 },
  { country: "Italy", flag: "🇮🇹", y2: 2.85, y10: 3.68, slope: 83, chg10: -0.05 },
  { country: "Canada", flag: "🇨🇦", y2: 3.42, y10: 3.28, slope: -14, chg10: -0.08 },
  { country: "Australia", flag: "🇦🇺", y2: 3.78, y10: 4.15, slope: 37, chg10: -0.02 },
  { country: "Turkey", flag: "🇹🇷", y2: 38.5, y10: 28.2, slope: -1030, chg10: -0.45 },
];

export default function YieldCurvePanel() {
  const [tab, setTab] = useState<Tab>("curves");
  const [overlay, setOverlay] = useState<"us" | "de" | "jp" | "uk">("us");

  const minY = Math.min(...US_CURVE.map(p => p.yield));
  const maxY = Math.max(...US_CURVE.map(p => p.yield));
  const range = maxY - minY || 1;
  const toY = (v: number) => 10 + (1 - (v - minY) / range) * 80;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📐</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>YIELD CURVE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg GC</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["curves", "spreads", "history", "forwards"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "2Y-10Y SPREAD", value: `${((US_CURVE[8].yield - US_CURVE[4].yield) * 100).toFixed(0)}bp`, color: (US_CURVE[8].yield - US_CURVE[4].yield) < 0 ? "#ef4444" : "#22c55e" },
          { label: "3M-10Y SPREAD", value: `${((US_CURVE[8].yield - US_CURVE[1].yield) * 100).toFixed(0)}bp`, color: (US_CURVE[8].yield - US_CURVE[1].yield) < 0 ? "#ef4444" : "#22c55e" },
          { label: "10Y YIELD", value: `${US_CURVE[8].yield}%`, color: "#fbbf24" },
          { label: "CURVE SHAPE", value: US_CURVE[8].yield > US_CURVE[4].yield ? "NORMAL" : "INVERTED", color: US_CURVE[8].yield > US_CURVE[4].yield ? "#22c55e" : "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "curves" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US TREASURY YIELD CURVE</div>
              <div className="flex gap-1">
                {(["us", "de", "jp", "uk"] as const).map(c => (
                  <button key={c} onClick={() => setOverlay(c)}
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
                    style={{ background: overlay === c ? "rgba(0,229,160,0.15)" : "transparent", color: overlay === c ? "#00e5a0" : "#64748b" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 110" className="w-full">
                {[3.5, 4.0, 4.5].map(v => (
                  <g key={v}>
                    <line x1="40" y1={toY(v)} x2="380" y2={toY(v)} stroke="rgba(255,255,255,0.05)" />
                    <text x="35" y={toY(v) + 3} textAnchor="end" fill="#64748b" fontSize="7">{v.toFixed(1)}%</text>
                  </g>
                ))}
                <polyline
                  points={US_CURVE.map((p, i) => `${40 + i * 34},${toY(p.yield)}`).join(" ")}
                  fill="none" stroke="#00e5a0" strokeWidth="2" />
                <polyline
                  points={US_CURVE.map((p, i) => `${40 + i * 34},${toY(p.prev)}`).join(" ")}
                  fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
                {US_CURVE.map((p, i) => (
                  <g key={p.tenor}>
                    <circle cx={40 + i * 34} cy={toY(p.yield)} r="3" fill="#00e5a0" />
                    <text x={40 + i * 34} y="105" textAnchor="middle" fill="#64748b" fontSize="7">{p.tenor}</text>
                  </g>
                ))}
                <text x="385" y="15" fill="#00e5a0" fontSize="7" textAnchor="end">Current</text>
                <text x="385" y="25" fill="#64748b" fontSize="7" textAnchor="end">Previous</text>
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US TREASURY DATA</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Tenor</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Yield</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Prev</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {US_CURVE.map(p => (
                    <tr key={p.tenor} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{p.tenor}</td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold">{p.yield.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: "#64748b" }}>{p.prev.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: p.chg < 0 ? "#22c55e" : "#ef4444" }}>
                        {p.chg >= 0 ? "+" : ""}{(p.chg * 100).toFixed(0)}bp
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "spreads" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL 10Y YIELDS & SPREADS</div>
            {GLOBAL_CURVES.map(c => (
              <div key={c.country} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span className="font-bold">{c.country}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#e2e8f0" }}>{c.y10.toFixed(2)}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>2Y:</span> <span className="font-mono">{c.y2.toFixed(2)}%</span></div>
                  <div><span style={{ color: "#64748b" }}>10Y:</span> <span className="font-mono">{c.y10.toFixed(2)}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Slope:</span> <span className="font-mono" style={{ color: c.slope >= 0 ? "#22c55e" : "#ef4444" }}>{c.slope}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: c.chg10 <= 0 ? "#22c55e" : "#ef4444" }}>{c.chg10 >= 0 ? "+" : ""}{(c.chg10 * 100).toFixed(0)}bp</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>2Y-10Y SPREAD HISTORY</div>
            {[
              { period: "Current", spread: -3, context: "Curve barely inverted — steepening trend" },
              { period: "1 Month Ago", spread: -25, context: "Deeper inversion on sticky inflation" },
              { period: "3 Months Ago", spread: -48, context: "Peak inversion before Fed pivot signal" },
              { period: "6 Months Ago", spread: -65, context: "Aggressive hiking expectations" },
              { period: "1 Year Ago", spread: -82, context: "Max inversion — recession signal strongest" },
              { period: "2 Years Ago", spread: 15, context: "Pre-hiking cycle — normal slope" },
              { period: "5 Years Ago", spread: 78, context: "Post-COVID steepening" },
            ].map(h => (
              <div key={h.period} className="flex items-center gap-3 p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold" style={{ color: "#38bdf8" }}>{h.period}</span>
                <div className="flex-1 relative h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                  {h.spread !== 0 && (
                    <div className="absolute top-0.5 bottom-0.5 rounded" style={{
                      left: h.spread < 0 ? `${50 + (h.spread / 100) * 50}%` : "50%",
                      width: `${Math.abs(h.spread / 100) * 50}%`,
                      background: h.spread < 0 ? "#ef4444" : "#22c55e",
                      opacity: 0.6,
                    }} />
                  )}
                </div>
                <span className="font-mono w-14 text-right" style={{ color: h.spread < 0 ? "#ef4444" : "#22c55e" }}>
                  {h.spread >= 0 ? "+" : ""}{h.spread}bp
                </span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>RECESSION SIGNAL TRACKER</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="space-y-2 text-[9px]">
                {[
                  { signal: "2Y-10Y Inversion Duration", value: "18 months", status: "WARNING", note: "Avg lead time to recession: 12-24mo" },
                  { signal: "3M-10Y Spread", value: "-56bp", status: "WARNING", note: "More reliable than 2Y-10Y historically" },
                  { signal: "Steepening Speed", value: "+47bp / 3mo", status: "ALERT", note: "Rapid steepening often precedes downturn" },
                  { signal: "Real Rate (10Y TIPS)", value: "1.85%", status: "NEUTRAL", note: "Restrictive but declining" },
                ].map(s => (
                  <div key={s.signal} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.status === "ALERT" ? "#ef4444" : s.status === "WARNING" ? "#fbbf24" : "#22c55e" }} />
                    <span className="font-bold w-40">{s.signal}</span>
                    <span className="font-mono w-24" style={{ color: "#e2e8f0" }}>{s.value}</span>
                    <span style={{ color: "#64748b" }}>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "forwards" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>IMPLIED FORWARD RATES</div>
            {[
              { forward: "1Y1Y", rate: 3.42, interp: "Market expects 1Y rate in 1 year at 3.42%" },
              { forward: "2Y1Y", rate: 3.28, interp: "Further easing priced — rate lower in 2 years" },
              { forward: "5Y5Y", rate: 3.65, interp: "Long-term neutral rate expectation" },
              { forward: "1Y2Y", rate: 3.35, interp: "2Y rate in 1 year — steeper curve ahead" },
              { forward: "3M6M", rate: 4.15, interp: "Near-term: modest easing by mid-2027" },
            ].map(f => (
              <div key={f.forward} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{f.forward}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{f.rate.toFixed(2)}%</span>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{f.interp}</div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>FED FUNDS IMPLIED PATH</div>
            {[
              { meeting: "Dec 2026", rate: 4.25, prob50: 72, prob25: 28 },
              { meeting: "Jan 2027", rate: 4.00, prob50: 45, prob25: 55 },
              { meeting: "Mar 2027", rate: 3.75, prob50: 38, prob25: 62 },
              { meeting: "May 2027", rate: 3.50, prob50: 25, prob25: 75 },
              { meeting: "Jul 2027", rate: 3.50, prob50: 15, prob25: 85 },
              { meeting: "Sep 2027", rate: 3.25, prob50: 20, prob25: 80 },
            ].map(m => (
              <div key={m.meeting} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold" style={{ color: "#e2e8f0" }}>{m.meeting}</span>
                <span className="font-mono w-14" style={{ color: "#fbbf24" }}>{m.rate.toFixed(2)}%</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full" style={{ width: `${m.prob50}%`, background: "rgba(239,68,68,0.5)" }} />
                </div>
                <span className="text-[8px] font-mono w-16" style={{ color: "#ef4444" }}>{m.prob50}% −50bp</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
