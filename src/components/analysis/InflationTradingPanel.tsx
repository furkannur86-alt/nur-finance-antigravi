"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "breakevens" | "tips" | "swaps" | "global";

export default function InflationTradingPanel() {
  const [tab, setTab] = useState<Tab>("breakevens");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📈</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INFLATION TRADING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg ILBE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["breakevens", "tips", "swaps", "global"] as Tab[]).map(t => (
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
          { label: "5Y BE", value: "2.35%", color: "#fbbf24" },
          { label: "10Y BE", value: "2.42%", color: "#fbbf24" },
          { label: "5Y5Y FWD", value: "2.48%", color: "#ef4444" },
          { label: "CPI YoY", value: "3.2%", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "breakevens" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US BREAKEVEN INFLATION RATES</div>
            {[
              { tenor: "2Y", be: 2.28, prev: 2.32, real: 1.95, nominal: 4.23, chg: -0.04 },
              { tenor: "5Y", be: 2.35, prev: 2.38, real: 1.52, nominal: 3.87, chg: -0.03 },
              { tenor: "7Y", be: 2.38, prev: 2.40, real: 1.58, nominal: 3.96, chg: -0.02 },
              { tenor: "10Y", be: 2.42, prev: 2.44, real: 1.62, nominal: 4.04, chg: -0.02 },
              { tenor: "20Y", be: 2.48, prev: 2.50, real: 1.78, nominal: 4.26, chg: -0.02 },
              { tenor: "30Y", be: 2.45, prev: 2.46, real: 1.85, nominal: 4.30, chg: -0.01 },
            ].map(r => (
              <div key={r.tenor} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-10" style={{ color: "#38bdf8" }}>{r.tenor}</span>
                <div className="flex-1 grid grid-cols-5 gap-2 text-[9px]">
                  <div className="text-center">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Breakeven</div>
                    <div className="font-mono font-bold" style={{ color: "#fbbf24" }}>{r.be.toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Real Yield</div>
                    <div className="font-mono font-bold" style={{ color: "#22c55e" }}>{r.real.toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Nominal</div>
                    <div className="font-mono">{r.nominal.toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Prev</div>
                    <div className="font-mono" style={{ color: "#64748b" }}>{r.prev.toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px]" style={{ color: "#64748b" }}>Change</div>
                    <div className="font-mono" style={{ color: r.chg <= 0 ? "#22c55e" : "#ef4444" }}>{r.chg >= 0 ? "+" : ""}{(r.chg * 100).toFixed(0)}bp</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BREAKEVEN TERM STRUCTURE</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {[2.0, 2.2, 2.4, 2.6].map(v => (
                <g key={v}>
                  <line x1="40" y1={90 - (v - 2.0) * 120} x2="380" y2={90 - (v - 2.0) * 120} stroke="rgba(255,255,255,0.05)" />
                  <text x="35" y={93 - (v - 2.0) * 120} textAnchor="end" fill="#64748b" fontSize="7">{v.toFixed(1)}%</text>
                </g>
              ))}
              <polyline points="60,56 120,42 180,38 240,34 310,26 370,30" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <polyline points="60,52 120,38 180,34 240,30 310,24 370,28" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
              {["2Y", "5Y", "7Y", "10Y", "20Y", "30Y"].map((t, i) => (
                <text key={t} x={60 + i * 62} y="98" textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
              ))}
            </svg>
          </div>
        )}

        {tab === "tips" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TIPS MARKET DATA</div>
            {[
              { cusip: "912810TL6", maturity: "01/15/2029", coupon: 0.125, realYld: 1.52, indexRatio: 1.285, cleanPx: 94.75, adjPx: 121.76, dur: 4.2 },
              { cusip: "912810TV4", maturity: "01/15/2034", coupon: 1.75, realYld: 1.62, indexRatio: 1.142, cleanPx: 101.25, adjPx: 115.63, dur: 8.5 },
              { cusip: "912810TA0", maturity: "02/15/2044", coupon: 1.375, realYld: 1.78, indexRatio: 1.368, cleanPx: 92.50, adjPx: 126.54, dur: 15.8 },
              { cusip: "912810TM4", maturity: "02/15/2054", coupon: 2.125, realYld: 1.85, indexRatio: 1.088, cleanPx: 104.85, adjPx: 114.08, dur: 21.2 },
              { cusip: "912810SU8", maturity: "04/15/2027", coupon: 0.625, realYld: 1.42, indexRatio: 1.312, cleanPx: 97.50, adjPx: 127.92, dur: 2.8 },
            ].map(t => (
              <div key={t.cusip} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>{t.cusip}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>Mat: {t.maturity}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>Cpn: {t.coupon}%</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{t.realYld.toFixed(2)}% real</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Idx Ratio:</span> <span className="font-mono">{t.indexRatio.toFixed(3)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Clean:</span> <span className="font-mono">{t.cleanPx.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Adj Px:</span> <span className="font-mono font-bold">{t.adjPx.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Dur:</span> <span className="font-mono">{t.dur.toFixed(1)}yr</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "swaps" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>INFLATION SWAP RATES (USD CPI)</div>
            {[
              { tenor: "1Y", rate: 2.85, bid: 2.82, ask: 2.88, chg: -0.05, volume: "High" },
              { tenor: "2Y", rate: 2.52, bid: 2.50, ask: 2.55, chg: -0.03, volume: "High" },
              { tenor: "3Y", rate: 2.45, bid: 2.42, ask: 2.48, chg: -0.02, volume: "Medium" },
              { tenor: "5Y", rate: 2.42, bid: 2.40, ask: 2.45, chg: -0.02, volume: "High" },
              { tenor: "7Y", rate: 2.45, bid: 2.42, ask: 2.48, chg: -0.01, volume: "Medium" },
              { tenor: "10Y", rate: 2.48, bid: 2.45, ask: 2.51, chg: -0.01, volume: "High" },
              { tenor: "30Y", rate: 2.52, bid: 2.48, ask: 2.56, chg: 0.00, volume: "Low" },
            ].map(s => (
              <div key={s.tenor} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-10" style={{ color: "#38bdf8" }}>{s.tenor}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#fbbf24" }}>{s.rate.toFixed(2)}%</span>
                <span className="font-mono w-12 text-[9px]" style={{ color: "#22c55e" }}>{s.bid.toFixed(2)}</span>
                <span className="font-mono w-12 text-[9px]" style={{ color: "#ef4444" }}>{s.ask.toFixed(2)}</span>
                <span className="font-mono w-14 text-[9px]" style={{ color: s.chg <= 0 ? "#22c55e" : "#ef4444" }}>{s.chg >= 0 ? "+" : ""}{(s.chg * 100).toFixed(0)}bp</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded" style={{
                  background: s.volume === "High" ? "rgba(34,197,94,0.1)" : s.volume === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)",
                  color: s.volume === "High" ? "#22c55e" : s.volume === "Medium" ? "#fbbf24" : "#ef4444",
                }}>{s.volume}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ZERO-COUPON INFLATION SWAP CURVE</div>
            <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>USD ZC swap implies 2.4-2.5% average CPI over next decade. Front-end elevated at 2.85% (1Y) reflecting sticky services inflation. Curve inverts slightly at 5Y suggesting market expects disinflation.</div>
            </div>
          </div>
        )}

        {tab === "global" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL INFLATION DASHBOARD</div>
            {[
              { country: "🇺🇸 United States", cpi: 3.2, core: 3.8, target: 2.0, be10y: 2.42, trend: "Declining" },
              { country: "🇪🇺 Eurozone", cpi: 2.4, core: 2.7, target: 2.0, be10y: 2.15, trend: "Stable" },
              { country: "🇬🇧 United Kingdom", cpi: 3.9, core: 4.8, target: 2.0, be10y: 3.52, trend: "Elevated" },
              { country: "🇯🇵 Japan", cpi: 2.8, core: 2.5, target: 2.0, be10y: 1.25, trend: "Rising" },
              { country: "🇨🇦 Canada", cpi: 2.9, core: 3.1, target: 2.0, be10y: 2.08, trend: "Declining" },
              { country: "🇦🇺 Australia", cpi: 3.5, core: 3.8, target: 2.5, be10y: 2.65, trend: "Stable" },
              { country: "🇧🇷 Brazil", cpi: 4.5, core: 3.8, target: 3.0, be10y: 5.85, trend: "Stable" },
              { country: "🇹🇷 Turkey", cpi: 58.5, core: 62.8, target: 5.0, be10y: 28.5, trend: "Declining" },
            ].map(c => (
              <div key={c.country} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.country}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px]" style={{
                    background: c.trend === "Declining" ? "rgba(34,197,94,0.15)" : c.trend === "Rising" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: c.trend === "Declining" ? "#22c55e" : c.trend === "Rising" ? "#ef4444" : "#fbbf24",
                  }}>{c.trend}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>CPI:</span> <span className="font-mono" style={{ color: c.cpi > c.target * 1.5 ? "#ef4444" : c.cpi > c.target ? "#fbbf24" : "#22c55e" }}>{c.cpi}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Core:</span> <span className="font-mono">{c.core}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Target:</span> <span className="font-mono">{c.target}%</span></div>
                  <div><span style={{ color: "#64748b" }}>10Y BE:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{c.be10y}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
