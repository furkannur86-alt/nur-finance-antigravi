"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "risk-index" | "conflicts" | "sanctions" | "trade-policy";

export default function GeopoliticalRiskPanel() {
  const [tab, setTab] = useState<Tab>("risk-index");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌍</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>GEOPOLITICAL RISK</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters GEO</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["risk-index", "conflicts", "sanctions", "trade-policy"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "risk-index" ? "INDEX" : t === "trade-policy" ? "TRADE" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "risk-index" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL GEOPOLITICAL RISK INDEX</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "GPR Index", val: "142", color: "#ef4444", sub: "Elevated" },
                { label: "GPR Threats", val: "168", color: "#ef4444", sub: "High" },
                { label: "GPR Acts", val: "95", color: "#fbbf24", sub: "Moderate" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: s.color }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REGIONAL RISK SCORES (0-100)</div>
            {[
              { region: "Middle East", score: 82, chg: 5, level: "Critical" },
              { region: "Eastern Europe", score: 75, chg: -2, level: "High" },
              { region: "East Asia", score: 68, chg: 8, level: "High" },
              { region: "South Asia", score: 55, chg: 3, level: "Elevated" },
              { region: "Sub-Saharan Africa", score: 52, chg: 1, level: "Elevated" },
              { region: "Latin America", score: 38, chg: -5, level: "Moderate" },
              { region: "Western Europe", score: 22, chg: 2, level: "Low" },
              { region: "North America", score: 18, chg: 0, level: "Low" },
            ].map(r => (
              <div key={r.region} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32">{r.region}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${r.score}%`,
                    background: r.score > 70 ? "rgba(239,68,68,0.5)" : r.score > 50 ? "rgba(251,191,36,0.5)" : r.score > 30 ? "rgba(34,197,94,0.3)" : "rgba(100,116,139,0.3)",
                  }} />
                </div>
                <span className="font-mono w-8 text-right font-bold" style={{
                  color: r.score > 70 ? "#ef4444" : r.score > 50 ? "#fbbf24" : "#22c55e",
                }}>{r.score}</span>
                <span className="font-mono w-10 text-right" style={{ color: r.chg > 0 ? "#ef4444" : r.chg < 0 ? "#22c55e" : "#64748b" }}>{r.chg >= 0 ? "+" : ""}{r.chg}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "conflicts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE CONFLICT MONITOR</div>
            {[
              { region: "Ukraine-Russia", status: "Active", intensity: "High", marketImpact: "Energy, Grain, EUR", risk: 85 },
              { region: "Israel-Palestine", status: "Active", intensity: "High", marketImpact: "Oil, Safe Havens", risk: 80 },
              { region: "Taiwan Strait", status: "Tensions", intensity: "Elevated", marketImpact: "Semis, CNY, Tech", risk: 65 },
              { region: "South China Sea", status: "Tensions", intensity: "Moderate", marketImpact: "Shipping, ASEAN", risk: 48 },
              { region: "Korean Peninsula", status: "Monitoring", intensity: "Low", marketImpact: "KRW, Defense", risk: 32 },
            ].map(c => (
              <div key={c.region} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.region}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: c.status === "Active" ? "rgba(239,68,68,0.15)" : c.status === "Tensions" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                      color: c.status === "Active" ? "#ef4444" : c.status === "Tensions" ? "#fbbf24" : "#38bdf8",
                    }}>{c.status}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: c.risk > 70 ? "#ef4444" : c.risk > 50 ? "#fbbf24" : "#22c55e" }}>{c.risk}/100</span>
                </div>
                <div className="text-[9px]" style={{ color: "#64748b" }}>Market Impact: <span style={{ color: "#fbbf24" }}>{c.marketImpact}</span></div>
              </div>
            ))}
          </div>
        )}

        {tab === "sanctions" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SANCTIONS & RESTRICTIONS TRACKER</div>
            {[
              { target: "Russia", authority: "US/EU/UK", sectors: "Energy, Finance, Tech", since: "2022", entities: 2850 },
              { target: "Iran", authority: "US/EU", sectors: "Oil, Finance, Nuclear", since: "2018", entities: 1200 },
              { target: "China (select)", authority: "US", sectors: "Semiconductors, AI, Mil", since: "2019", entities: 450 },
              { target: "North Korea", authority: "UN/US", sectors: "All sectors", since: "2006", entities: 380 },
              { target: "Venezuela", authority: "US", sectors: "Oil, Gold, Finance", since: "2017", entities: 185 },
              { target: "Myanmar", authority: "US/EU/UK", sectors: "Military, Mining", since: "2021", entities: 120 },
            ].map(s => (
              <div key={s.target} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.target}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>by {s.authority}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#ef4444" }}>{s.entities.toLocaleString()} entities</span>
                </div>
                <div className="text-[9px]"><span style={{ color: "#64748b" }}>Sectors:</span> <span style={{ color: "#fbbf24" }}>{s.sectors}</span></div>
              </div>
            ))}
          </div>
        )}

        {tab === "trade-policy" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TRADE POLICY TRACKER</div>
            {[
              { policy: "US Tariffs on China", status: "Active", rate: "25-100%", impact: "High", sectors: "Tech, EVs, Steel" },
              { policy: "EU Carbon Border Adj.", status: "Phase-in", rate: "€50-80/tCO2", impact: "Medium", sectors: "Steel, Cement, Alum" },
              { policy: "US CHIPS Act", status: "Active", rate: "$52B subsidy", impact: "High", sectors: "Semiconductors" },
              { policy: "EU Digital Markets Act", status: "Enforcing", rate: "10% revenue", impact: "Medium", sectors: "Big Tech" },
              { policy: "India PLI Scheme", status: "Active", rate: "4-6% subsidy", impact: "Medium", sectors: "Electronics, Pharma" },
            ].map(p => (
              <div key={p.policy} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{p.policy}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: p.status === "Active" ? "rgba(34,197,94,0.15)" : p.status === "Phase-in" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                    color: p.status === "Active" ? "#22c55e" : p.status === "Phase-in" ? "#fbbf24" : "#38bdf8",
                  }}>{p.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Rate:</span> <span className="font-mono">{p.rate}</span></div>
                  <div><span style={{ color: "#64748b" }}>Impact:</span> <span style={{ color: p.impact === "High" ? "#ef4444" : "#fbbf24" }}>{p.impact}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sectors:</span> <span>{p.sectors}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
