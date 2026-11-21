"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const RISK_EVENTS = [
  { region: "Taiwan Strait", level: "HIGH", score: 82, trend: "rising", assets: "TSMC, USD/TWD, VIX", impact: "Tech supply chain, semiconductor access", lastUpdate: "2h ago" },
  { region: "Middle East", level: "ELEVATED", score: 74, trend: "stable", assets: "Brent, Gold, USD/ILS", impact: "Oil supply, shipping lanes, defense stocks", lastUpdate: "4h ago" },
  { region: "Ukraine-Russia", level: "ELEVATED", score: 68, trend: "declining", assets: "NatGas, Wheat, EUR", impact: "Energy prices, food security, EU economy", lastUpdate: "6h ago" },
  { region: "South China Sea", level: "MODERATE", score: 55, trend: "rising", assets: "Shipping ETFs, CNY", impact: "Trade route disruption, ASEAN markets", lastUpdate: "8h ago" },
  { region: "US-China Trade", level: "MODERATE", score: 52, trend: "stable", assets: "KWEB, FXI, SOX", impact: "Tariffs, tech decoupling, rare earths", lastUpdate: "12h ago" },
  { region: "Iran Nuclear", level: "ELEVATED", score: 65, trend: "rising", assets: "Oil, Gold, Uranium", impact: "Oil supply shock risk, nuclear proliferation", lastUpdate: "1d ago" },
];

const SANCTIONS = [
  { country: "Russia", programs: 42, entities: 4850, newThisMonth: 28, sector: "Energy, Finance, Tech" },
  { country: "Iran", programs: 18, entities: 2420, newThisMonth: 12, sector: "Oil, Shipping, Banks" },
  { country: "China", programs: 8, entities: 680, newThisMonth: 5, sector: "Tech, Military" },
  { country: "North Korea", programs: 12, entities: 540, newThisMonth: 2, sector: "WMD, Finance" },
  { country: "Venezuela", programs: 6, entities: 285, newThisMonth: 0, sector: "Oil, Government" },
];

type Tab = "risks" | "sanctions" | "elections" | "scenarios";

export default function GeopoliticalRiskPanel() {
  const [tab, setTab] = useState<Tab>("risks");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌍</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>GEOPOLITICAL RISK</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters GEOP</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["risks", "sanctions", "elections", "scenarios"] as Tab[]).map(t => (
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
          { label: "GLOBAL GPR INDEX", value: "142.8", color: "#ef4444" },
          { label: "ALERT LEVEL", value: "ELEVATED", color: "#fbbf24" },
          { label: "ACTIVE HOTSPOTS", value: "6", color: "#f97316" },
          { label: "NEW SANCTIONS", value: "+47", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "risks" && (
          <div className="space-y-1.5">
            {RISK_EVENTS.map((r, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${r.level === "HIGH" ? "rgba(239,68,68,0.2)" : r.level === "ELEVATED" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#e2e8f0" }}>{r.region}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: r.level === "HIGH" ? "rgba(239,68,68,0.2)" : r.level === "ELEVATED" ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.15)",
                      color: r.level === "HIGH" ? "#ef4444" : r.level === "ELEVATED" ? "#fbbf24" : "#94a3b8"
                    }}>{r.level}</span>
                    <span className="text-[9px]" style={{ color: r.trend === "rising" ? "#ef4444" : r.trend === "declining" ? "#22c55e" : "#94a3b8" }}>
                      {r.trend === "rising" ? "▲ Rising" : r.trend === "declining" ? "▼ Declining" : "─ Stable"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px]" style={{ color: "#64748b" }}>{r.lastUpdate}</span>
                    <div className="w-12 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.score > 70 ? "#ef4444" : r.score > 50 ? "#fbbf24" : "#22c55e" }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold" style={{ color: r.score > 70 ? "#ef4444" : r.score > 50 ? "#fbbf24" : "#22c55e" }}>{r.score}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Affected Assets:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{r.assets}</span></div>
                  <div><span style={{ color: "#64748b" }}>Impact:</span> <span style={{ color: "#94a3b8" }}>{r.impact}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sanctions" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE SANCTIONS PROGRAMS</div>
            {SANCTIONS.map((s, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#e2e8f0" }}>{s.country}</span>
                  <span className="font-mono text-[9px]" style={{ color: s.newThisMonth > 10 ? "#ef4444" : "#94a3b8" }}>+{s.newThisMonth} this month</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Programs:</span> <span className="font-mono">{s.programs}</span></div>
                  <div><span style={{ color: "#64748b" }}>Entities:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{s.entities.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sectors:</span> <span style={{ color: "#94a3b8" }}>{s.sector}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "elections" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING POLITICAL EVENTS</div>
            {[
              { event: "South Korea Presidential Election", date: "Dec 2026", marketImpact: "HIGH", assets: "KRW, KOSPI, Samsung", volatilityExpected: "+15%" },
              { event: "Italy Budget Deadline", date: "Nov 30", marketImpact: "MEDIUM", assets: "BTP-Bund Spread, EUR", volatilityExpected: "+8%" },
              { event: "Japan BoJ Rate Decision", date: "Dec 19", marketImpact: "HIGH", assets: "USD/JPY, JGB, Nikkei", volatilityExpected: "+12%" },
              { event: "ECB Rate Decision", date: "Dec 12", marketImpact: "HIGH", assets: "EUR, Bund, Euro Stoxx", volatilityExpected: "+10%" },
              { event: "OPEC+ Meeting", date: "Dec 05", marketImpact: "HIGH", assets: "Brent, WTI, Energy ETFs", volatilityExpected: "+18%" },
              { event: "US Government Funding Deadline", date: "Dec 20", marketImpact: "MEDIUM", assets: "UST, USD, VIX", volatilityExpected: "+6%" },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold mb-0.5">{e.event}</div>
                  <div className="text-[9px]"><span style={{ color: "#64748b" }}>Assets:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{e.assets}</span></div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.date}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                      background: e.marketImpact === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                      color: e.marketImpact === "HIGH" ? "#ef4444" : "#fbbf24"
                    }}>{e.marketImpact}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#f97316" }}>Vol: {e.volatilityExpected}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "scenarios" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TAIL RISK SCENARIO ANALYSIS</div>
            {[
              { scenario: "Taiwan Conflict Escalation", probability: 8, spxImpact: -18, oilImpact: 45, goldImpact: 22, vixImpact: 65, severity: "EXTREME" },
              { scenario: "Iran-Israel Military Conflict", probability: 12, spxImpact: -8, oilImpact: 35, goldImpact: 15, vixImpact: 42, severity: "SEVERE" },
              { scenario: "Russia-NATO Escalation", probability: 5, spxImpact: -22, oilImpact: 55, goldImpact: 28, vixImpact: 72, severity: "EXTREME" },
              { scenario: "US Sovereign Downgrade", probability: 15, spxImpact: -6, oilImpact: 5, goldImpact: 8, vixImpact: 32, severity: "HIGH" },
              { scenario: "China Property Contagion", probability: 18, spxImpact: -10, oilImpact: -12, goldImpact: 10, vixImpact: 38, severity: "SEVERE" },
              { scenario: "EU Fragmentation Risk", probability: 8, spxImpact: -5, oilImpact: 2, goldImpact: 12, vixImpact: 28, severity: "HIGH" },
            ].map((s, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.scenario}</span>
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.severity === "EXTREME" ? "rgba(239,68,68,0.2)" : s.severity === "SEVERE" ? "rgba(251,191,36,0.15)" : "rgba(249,115,22,0.15)",
                      color: s.severity === "EXTREME" ? "#ef4444" : s.severity === "SEVERE" ? "#fbbf24" : "#f97316"
                    }}>{s.severity}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#94a3b8" }}>P: {s.probability}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>S&P 500:</span> <span className="font-mono font-bold" style={{ color: "#ef4444" }}>{s.spxImpact}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Oil:</span> <span className="font-mono" style={{ color: s.oilImpact > 0 ? "#22c55e" : "#ef4444" }}>{s.oilImpact > 0 ? "+" : ""}{s.oilImpact}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Gold:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>+{s.goldImpact}%</span></div>
                  <div><span style={{ color: "#64748b" }}>VIX:</span> <span className="font-mono" style={{ color: "#ef4444" }}>+{s.vixImpact}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
