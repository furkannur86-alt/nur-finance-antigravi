"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "markets" | "allowances" | "offsets" | "regulation";

export default function CarbonEmissionsPanel() {
  const [tab, setTab] = useState<Tab>("markets");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CARBON & EMISSIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Bloomberg CARB</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["markets", "allowances", "offsets", "regulation"] as Tab[]).map(t => (
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
          { label: "EU ETS (EUA)", value: "€68.50", change: "+2.4%", color: "#22c55e" },
          { label: "UK ETS", value: "£42.80", change: "-1.2%", color: "#ef4444" },
          { label: "CA CaT (CCA)", value: "$38.50", change: "+0.8%", color: "#22c55e" },
          { label: "RGGI", value: "$15.20", change: "+3.2%", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold" style={{ color: "#e2e8f0" }}>{s.value}</span>
              <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "markets" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMPLIANCE CARBON MARKETS</div>
            {[
              { market: "EU ETS", price: "€68.50", volume: "12.4M", oi: "€42.8B", ytdReturn: 15.2, phase: "Phase 4", cap: "1.39B tCO2" },
              { market: "UK ETS", price: "£42.80", volume: "2.1M", oi: "£8.5B", ytdReturn: -8.4, phase: "Phase 1", cap: "0.14B tCO2" },
              { market: "California CaT", price: "$38.50", volume: "4.2M", oi: "$12.5B", ytdReturn: 6.8, phase: "Period 4", cap: "0.32B tCO2" },
              { market: "RGGI (US NE)", price: "$15.20", volume: "1.8M", oi: "$3.2B", ytdReturn: 12.4, phase: "Period 4", cap: "0.09B tCO2" },
              { market: "China National", price: "¥72.40", volume: "8.5M", oi: "¥28.4B", ytdReturn: 22.5, phase: "Phase 2", cap: "4.5B tCO2" },
              { market: "Korea K-ETS", price: "₩12,850", volume: "0.8M", oi: "₩2.4T", ytdReturn: 4.2, phase: "Phase 3", cap: "0.59B tCO2" },
            ].map(m => (
              <div key={m.market} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{m.market}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{m.phase}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#e2e8f0" }}>{m.price}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Volume:</span> <span className="font-mono">{m.volume}</span></div>
                  <div><span style={{ color: "#64748b" }}>OI:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{m.oi}</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: m.ytdReturn >= 0 ? "#22c55e" : "#ef4444" }}>{m.ytdReturn >= 0 ? "+" : ""}{m.ytdReturn}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Cap:</span> <span className="font-mono">{m.cap}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "allowances" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EU ETS FUTURES CURVE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 100" className="w-full">
                <line x1="40" y1="10" x2="40" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {[60, 65, 70, 75].map(v => (
                  <g key={v}>
                    <line x1="40" y1={80 - (v - 55) * 3.5} x2="380" y2={80 - (v - 55) * 3.5} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <text x="35" y={84 - (v - 55) * 3.5} textAnchor="end" fill="#64748b" fontSize="7">€{v}</text>
                  </g>
                ))}
                <polyline
                  points="60,33 110,30 160,27 210,25 260,24 310,22 360,21"
                  fill="none" stroke="#22c55e" strokeWidth="2" />
                {["Dec26", "Mar27", "Jun27", "Sep27", "Dec27", "Mar28", "Dec28"].map((l, i) => (
                  <text key={l} x={60 + i * 50} y="95" textAnchor="middle" fill="#64748b" fontSize="7">{l}</text>
                ))}
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AUCTION RESULTS</div>
            {[
              { date: "Nov 18", platform: "EEX", volume: "4.2M EUA", clearPrice: "€68.42", coverRatio: 2.8, bidders: 24 },
              { date: "Nov 15", platform: "ICE", volume: "3.8M UKA", clearPrice: "£42.65", coverRatio: 2.2, bidders: 18 },
              { date: "Nov 12", platform: "EEX", volume: "4.0M EUA", clearPrice: "€67.85", coverRatio: 3.1, bidders: 26 },
              { date: "Nov 08", platform: "RGGI", volume: "24.5M", clearPrice: "$15.08", coverRatio: 2.5, bidders: 42 },
            ].map(a => (
              <div key={`${a.date}-${a.platform}`} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] w-14" style={{ color: "#64748b" }}>{a.date}</span>
                  <span className="font-bold w-10">{a.platform}</span>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>{a.volume}</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span style={{ color: "#fbbf24" }}>{a.clearPrice}</span>
                  <span style={{ color: a.coverRatio > 2.5 ? "#22c55e" : "#fbbf24" }}>Cover: {a.coverRatio}x</span>
                  <span style={{ color: "#64748b" }}>{a.bidders} bidders</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "offsets" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VOLUNTARY CARBON MARKET</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "VCM Volume", value: "$2.4B", sub: "+18% YoY" },
                { label: "Avg Price", value: "$8.50/t", sub: "vs $6.20 2025" },
                { label: "Credits Retired", value: "285M tCO2", sub: "+22% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#22c55e" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>OFFSET PRICING BY TYPE</div>
            {[
              { type: "REDD+ (Forestry)", price: "$12.50", volume: "85M", quality: "HIGH", vintage: "2024-26" },
              { type: "Cookstove", price: "$4.80", volume: "42M", quality: "MEDIUM", vintage: "2023-26" },
              { type: "Renewable Energy", price: "$3.20", volume: "120M", quality: "LOW", vintage: "2022-26" },
              { type: "Direct Air Capture", price: "$285.00", volume: "0.5M", quality: "PREMIUM", vintage: "2026" },
              { type: "Blue Carbon (Mangrove)", price: "$18.50", volume: "12M", quality: "HIGH", vintage: "2025-26" },
              { type: "Biochar", price: "$125.00", volume: "2.8M", quality: "HIGH", vintage: "2025-26" },
            ].map(o => (
              <div key={o.type} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{o.type}</div>
                  <div className="text-[9px] mt-0.5"><span style={{ color: "#64748b" }}>Vintage:</span> <span>{o.vintage}</span></div>
                </div>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{o.price}/t</span>
                  <span className="font-mono" style={{ color: "#64748b" }}>{o.volume}t</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: o.quality === "PREMIUM" ? "rgba(168,85,247,0.15)" : o.quality === "HIGH" ? "rgba(34,197,94,0.15)" : o.quality === "MEDIUM" ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.15)",
                    color: o.quality === "PREMIUM" ? "#a855f7" : o.quality === "HIGH" ? "#22c55e" : o.quality === "MEDIUM" ? "#fbbf24" : "#94a3b8"
                  }}>{o.quality}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "regulation" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CARBON REGULATION TRACKER</div>
            {[
              { regulation: "EU CBAM (Carbon Border Adjustment)", status: "ACTIVE", phase: "Transition", effectiveDate: "Oct 2023", impact: "€2.5B/yr steel/cement imports" },
              { regulation: "EU Fit for 55 — ETS Reform", status: "ACTIVE", phase: "Implementation", effectiveDate: "Jan 2024", impact: "-62% by 2030 vs 2005" },
              { regulation: "US EPA Power Plant Rule", status: "LITIGATION", phase: "Challenged", effectiveDate: "TBD", impact: "1,000+ coal/gas plants" },
              { regulation: "China National ETS Expansion", status: "PENDING", phase: "Consultation", effectiveDate: "2027", impact: "Add cement, steel, aluminium" },
              { regulation: "Article 6 (Paris Agreement)", status: "ACTIVE", phase: "Operational", effectiveDate: "2024", impact: "International carbon trading rules" },
              { regulation: "Japan GX-ETS", status: "ACTIVE", phase: "Phase 1", effectiveDate: "Apr 2026", impact: "Top 600 emitters mandatory" },
            ].map(r => (
              <div key={r.regulation} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{r.regulation}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: r.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : r.status === "PENDING" ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                      color: r.status === "ACTIVE" ? "#22c55e" : r.status === "PENDING" ? "#fbbf24" : "#ef4444"
                    }}>{r.status}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.phase}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Effective:</span> <span className="font-mono">{r.effectiveDate}</span></div>
                  <div><span style={{ color: "#64748b" }}>Impact:</span> <span style={{ color: "#fbbf24" }}>{r.impact}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
