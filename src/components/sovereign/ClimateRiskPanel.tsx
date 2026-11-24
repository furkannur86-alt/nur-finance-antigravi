"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "scores" | "carbon" | "transition" | "physical";

export default function ClimateRiskPanel() {
  const [tab, setTab] = useState<Tab>("scores");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌡️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CLIMATE RISK</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg ESG</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["scores", "carbon", "transition", "physical"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "scores" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLIMATE RISK SCORES — BY SECTOR</div>
            {[
              { sector: "Oil & Gas", score: 85, trend: "Worsening", exposure: "$2.8T", alignment: "3.5°C" },
              { sector: "Utilities", score: 72, trend: "Improving", exposure: "$1.5T", alignment: "2.8°C" },
              { sector: "Materials", score: 68, trend: "Stable", exposure: "$850B", alignment: "3.0°C" },
              { sector: "Transportation", score: 65, trend: "Improving", exposure: "$620B", alignment: "2.5°C" },
              { sector: "Real Estate", score: 55, trend: "Worsening", exposure: "$1.2T", alignment: "2.2°C" },
              { sector: "Agriculture", score: 48, trend: "Stable", exposure: "$380B", alignment: "2.0°C" },
              { sector: "Technology", score: 25, trend: "Improving", exposure: "$180B", alignment: "1.8°C" },
              { sector: "Financial", score: 35, trend: "Stable", exposure: "$950B", alignment: "2.5°C" },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24">{s.sector}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${s.score}%`,
                    background: s.score > 70 ? "rgba(239,68,68,0.5)" : s.score > 50 ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.4)",
                  }} />
                </div>
                <span className="font-mono w-8 text-right font-bold" style={{
                  color: s.score > 70 ? "#ef4444" : s.score > 50 ? "#fbbf24" : "#22c55e",
                }}>{s.score}</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{s.alignment}</span>
                <span className="text-[8px] w-16 text-right" style={{
                  color: s.trend === "Worsening" ? "#ef4444" : s.trend === "Improving" ? "#22c55e" : "#64748b",
                }}>{s.trend}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "carbon" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CARBON EXPOSURE — TOP EMITTERS</div>
            {[
              { company: "Saudi Aramco", scope12: 1250, scope3: 3200, intensity: 285, target: "Net Zero 2060" },
              { company: "ExxonMobil", scope12: 112, scope3: 650, intensity: 195, target: "Scope 1+2 2050" },
              { company: "Shell", scope12: 85, scope3: 520, intensity: 165, target: "Net Zero 2050" },
              { company: "Chevron", scope12: 68, scope3: 480, intensity: 178, target: "Portfolio CI -5%" },
              { company: "BP", scope12: 55, scope3: 350, intensity: 142, target: "Net Zero 2050" },
            ].map(c => (
              <div key={c.company} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.company}</span>
                  <span className="text-[8px]" style={{ color: "#10b981" }}>{c.target}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>S1+2:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{c.scope12} MtCO2e</span></div>
                  <div><span style={{ color: "#64748b" }}>S3:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{c.scope3} MtCO2e</span></div>
                  <div><span style={{ color: "#64748b" }}>CI:</span> <span className="font-mono">{c.intensity} tCO2/$M</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CARBON MARKETS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { market: "EU ETS", price: "€72.50", chg: "+1.2%" },
                { market: "UK ETS", price: "£38.80", chg: "-0.5%" },
                { market: "CA Cap&Trade", price: "$38.50", chg: "+0.3%" },
              ].map(m => (
                <div key={m.market} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.market}</div>
                  <div className="font-mono font-bold" style={{ color: "#00e5a0" }}>{m.price}</div>
                  <div className="font-mono text-[9px]" style={{ color: m.chg.startsWith("+") ? "#22c55e" : "#ef4444" }}>{m.chg}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "transition" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TRANSITION RISK INDICATORS</div>
            {[
              { factor: "Carbon Tax Exposure", level: "High", trend: "Increasing", impact: "$850B stranded" },
              { factor: "Regulatory Tightening", level: "High", trend: "Accelerating", impact: "CBAM, SEC climate" },
              { factor: "Technology Disruption", level: "Medium", trend: "Accelerating", impact: "EV adoption 18%" },
              { factor: "Market Sentiment Shift", level: "Medium", trend: "Stable", impact: "ESG AUM $35T" },
              { factor: "Litigation Risk", level: "Medium", trend: "Increasing", impact: "2,500+ cases filed" },
              { factor: "Reputational Risk", level: "Low", trend: "Stable", impact: "Greenwashing focus" },
            ].map(f => (
              <div key={f.factor} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.factor}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: f.level === "High" ? "rgba(239,68,68,0.15)" : f.level === "Medium" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                    color: f.level === "High" ? "#ef4444" : f.level === "Medium" ? "#fbbf24" : "#22c55e",
                  }}>{f.level}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#64748b" }}>Trend: <span style={{
                    color: f.trend === "Accelerating" ? "#ef4444" : f.trend === "Increasing" ? "#fbbf24" : "#64748b",
                  }}>{f.trend}</span></span>
                  <span style={{ color: "#38bdf8" }}>{f.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "physical" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PHYSICAL RISK — ASSET EXPOSURE</div>
            {[
              { risk: "Flooding", assetsAtRisk: "$4.2T", regions: "SE Asia, US Coast", probability: "High", horizon: "2030" },
              { risk: "Extreme Heat", assetsAtRisk: "$2.8T", regions: "Middle East, S. Asia", probability: "Very High", horizon: "2025" },
              { risk: "Wildfire", assetsAtRisk: "$1.5T", regions: "W. US, Mediterranean", probability: "High", horizon: "2028" },
              { risk: "Sea Level Rise", assetsAtRisk: "$8.5T", regions: "Global coastal", probability: "Medium", horizon: "2050" },
              { risk: "Water Stress", assetsAtRisk: "$3.1T", regions: "MENA, Central Asia", probability: "High", horizon: "2035" },
            ].map(r => (
              <div key={r.risk} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{r.risk}</span>
                  <span className="font-mono font-bold" style={{ color: "#ef4444" }}>{r.assetsAtRisk}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Regions:</span> <span>{r.regions}</span></div>
                  <div><span style={{ color: "#64748b" }}>Prob:</span> <span style={{
                    color: r.probability === "Very High" ? "#ef4444" : r.probability === "High" ? "#fbbf24" : "#22c55e",
                  }}>{r.probability}</span></div>
                  <div><span style={{ color: "#64748b" }}>Horizon:</span> <span className="font-mono">{r.horizon}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
