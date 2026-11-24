"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "issuance" | "frameworks" | "impact" | "pricing";

export default function GreenBondPanel() {
  const [tab, setTab] = useState<Tab>("issuance");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌿</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>GREEN / ESG BONDS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Bloomberg BNEF</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["issuance", "frameworks", "impact", "pricing"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "issuance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GREEN BOND MARKET OVERVIEW</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "2026 YTD Issuance", value: "$485B", chg: "+22% YoY" },
                { label: "Outstanding", value: "$2.8T", chg: "" },
                { label: "Avg Greenium", value: "-4bp", chg: "" },
                { label: "Avg Tenor", value: "8.2Y", chg: "" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: "#22c55e" }}>{s.value}</div>
                  {s.chg && <div className="text-[8px]" style={{ color: "#22c55e" }}>{s.chg}</div>}
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT GREEN BOND ISSUES</div>
            {[
              { issuer: "European Investment Bank", size: "$3.5B", coupon: "3.125%", tenor: "10Y", label: "Green", rating: "AAA", uop: "Renewable Energy" },
              { issuer: "Republic of Germany", size: "€5.0B", coupon: "2.50%", tenor: "30Y", label: "Green", rating: "AAA", uop: "Clean Transport" },
              { issuer: "Apple Inc", size: "$2.0B", coupon: "3.75%", tenor: "7Y", label: "Green", rating: "AA+", uop: "Energy Efficiency" },
              { issuer: "ICBC", size: "$1.5B", coupon: "4.25%", tenor: "5Y", label: "Transition", rating: "A", uop: "Coal Phase-out" },
              { issuer: "Enel SpA", size: "€1.25B", coupon: "3.875%", tenor: "8Y", label: "SLB", rating: "BBB+", uop: "GHG Reduction KPI" },
              { issuer: "World Bank", size: "$2.0B", coupon: "3.00%", tenor: "5Y", label: "Sustainable", rating: "AAA", uop: "SDG Projects" },
            ].map(b => (
              <div key={b.issuer} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{b.issuer}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{
                      background: b.label === "Green" ? "rgba(34,197,94,0.15)" : b.label === "SLB" ? "rgba(56,189,248,0.15)" : b.label === "Transition" ? "rgba(251,191,36,0.15)" : "rgba(168,85,247,0.15)",
                      color: b.label === "Green" ? "#22c55e" : b.label === "SLB" ? "#38bdf8" : b.label === "Transition" ? "#fbbf24" : "#a855f7",
                    }}>{b.label}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#64748b" }}>{b.rating}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono">{b.size}</span></div>
                  <div><span style={{ color: "#64748b" }}>Coupon:</span> <span className="font-mono">{b.coupon}</span></div>
                  <div><span style={{ color: "#64748b" }}>Tenor:</span> <span className="font-mono">{b.tenor}</span></div>
                  <div><span style={{ color: "#64748b" }}>UoP:</span> <span>{b.uop}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "frameworks" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EU TAXONOMY ALIGNMENT</div>
            {[
              { activity: "Renewable Energy", aligned: 92, rev: "$285B" },
              { activity: "Clean Transport", aligned: 78, rev: "$165B" },
              { activity: "Energy Efficiency", aligned: 85, rev: "$120B" },
              { activity: "Circular Economy", aligned: 65, rev: "$42B" },
              { activity: "Biodiversity", aligned: 48, rev: "$18B" },
              { activity: "Water Management", aligned: 72, rev: "$55B" },
            ].map(a => (
              <div key={a.activity} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{a.activity}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.rev}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${a.aligned}%`, background: a.aligned > 80 ? "#22c55e" : a.aligned > 60 ? "#fbbf24" : "#ef4444", opacity: 0.6 }} />
                  </div>
                  <span className="font-mono w-10 text-right" style={{ color: a.aligned > 80 ? "#22c55e" : a.aligned > 60 ? "#fbbf24" : "#ef4444" }}>{a.aligned}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECOND PARTY OPINIONS</div>
            {[
              { provider: "Sustainalytics", rating: "Medium Risk", score: 22, bonds: 1850 },
              { provider: "ISS ESG", rating: "Prime", score: "B+", bonds: 1420 },
              { provider: "CICERO", rating: "Dark Green", score: "—", bonds: 680 },
              { provider: "V.E (Moody's)", rating: "Robust", score: 72, bonds: 920 },
            ].map(p => (
              <div key={p.provider} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{p.provider}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{p.rating}</span>
                <span className="font-mono" style={{ color: "#64748b" }}>Score: {p.score}</span>
                <span className="ml-auto font-mono text-[9px]" style={{ color: "#64748b" }}>{p.bonds} bonds</span>
              </div>
            ))}
          </div>
        )}

        {tab === "impact" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ENVIRONMENTAL IMPACT METRICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "CO2 Avoided", val: "425M tons", icon: "🌍", color: "#22c55e" },
                { label: "Renewable Capacity", val: "185 GW", icon: "⚡", color: "#fbbf24" },
                { label: "Clean Transport", val: "2.8M vehicles", icon: "🚗", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-lg">{s.icon}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ISSUANCE BY USE OF PROCEEDS</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {[
                { label: "Renewable", pct: 35, color: "#22c55e" },
                { label: "Transport", pct: 22, color: "#38bdf8" },
                { label: "Buildings", pct: 18, color: "#fbbf24" },
                { label: "Water", pct: 12, color: "#6366f1" },
                { label: "Waste", pct: 8, color: "#a855f7" },
                { label: "Other", pct: 5, color: "#64748b" },
              ].map((s, i) => {
                const h = s.pct * 2;
                return (
                  <g key={s.label}>
                    <rect x={15 + i * 65} y={80 - h} width={45} height={h} rx={2} fill={s.color} opacity={0.4} stroke={s.color} strokeWidth={0.5} />
                    <text x={37 + i * 65} y={75 - h} textAnchor="middle" fill={s.color} fontSize="7">{s.pct}%</text>
                    <text x={37 + i * 65} y={94} textAnchor="middle" fill="#64748b" fontSize="6">{s.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "pricing" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GREENIUM ANALYSIS (SPREAD vs CONVENTIONAL, bp)</div>
            {[
              { issuer: "Germany 10Y Green vs Conv", greenium: -4, trend: "Stable" },
              { issuer: "France 10Y Green vs Conv", greenium: -6, trend: "Tightening" },
              { issuer: "EIB 5Y Green vs Conv", greenium: -3, trend: "Stable" },
              { issuer: "KfW 7Y Green vs Conv", greenium: -5, trend: "Tightening" },
              { issuer: "Apple 7Y Green vs Conv", greenium: -2, trend: "Widening" },
              { issuer: "Enel SLB vs Conv", greenium: 8, trend: "Stable" },
            ].map(g => (
              <div key={g.issuer} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="flex-1">{g.issuer}</span>
                <span className="font-mono font-bold w-14 text-right" style={{ color: g.greenium < 0 ? "#22c55e" : "#ef4444" }}>{g.greenium > 0 ? "+" : ""}{g.greenium}bp</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded w-20 text-center" style={{
                  background: g.trend === "Tightening" ? "rgba(34,197,94,0.15)" : g.trend === "Widening" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.15)",
                  color: g.trend === "Tightening" ? "#22c55e" : g.trend === "Widening" ? "#ef4444" : "#64748b",
                }}>{g.trend}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GREEN BOND INDICES</div>
            {[
              { index: "Bloomberg MSCI Green Bond", ytd: 4.8, spread: 42, dur: 6.8 },
              { index: "ICE Green Bond", ytd: 5.2, spread: 38, dur: 7.2 },
              { index: "S&P Green Bond Select", ytd: 4.5, spread: 45, dur: 6.5 },
              { index: "Solactive Green Bond EUR", ytd: 3.8, spread: 35, dur: 7.5 },
            ].map(idx => (
              <div key={idx.index} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="flex-1">{idx.index}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#22c55e" }}>+{idx.ytd}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{idx.spread}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{idx.dur}Y</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
