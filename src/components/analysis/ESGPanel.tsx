"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const ESG_SCORES = [
  { ticker: "MSFT", name: "Microsoft", esg: 82, e: 85, s: 78, g: 84, risk: "LOW", trend: "up", controversies: 1, sector: "Technology" },
  { ticker: "AAPL", name: "Apple", esg: 76, e: 72, s: 80, g: 75, risk: "LOW", trend: "up", controversies: 2, sector: "Technology" },
  { ticker: "JPM", name: "JPMorgan", esg: 61, e: 55, s: 68, g: 60, risk: "MEDIUM", trend: "flat", controversies: 5, sector: "Financials" },
  { ticker: "XOM", name: "Exxon Mobil", esg: 38, e: 22, s: 48, g: 45, risk: "HIGH", trend: "down", controversies: 12, sector: "Energy" },
  { ticker: "TSLA", name: "Tesla", esg: 52, e: 82, s: 28, g: 45, risk: "MEDIUM", trend: "down", controversies: 8, sector: "Auto" },
  { ticker: "NVDA", name: "NVIDIA", esg: 71, e: 68, s: 72, g: 74, risk: "LOW", trend: "up", controversies: 1, sector: "Technology" },
  { ticker: "JNJ", name: "J&J", esg: 68, e: 70, s: 62, g: 72, risk: "MEDIUM", trend: "flat", controversies: 6, sector: "Healthcare" },
  { ticker: "BP", name: "BP plc", esg: 42, e: 35, s: 52, g: 40, risk: "HIGH", trend: "up", controversies: 9, sector: "Energy" },
];

type Tab = "scores" | "analysis" | "screening" | "carbon";

export default function ESGPanel() {
  const [tab, setTab] = useState<Tab>("scores");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ESG ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Bloomberg ESG</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["scores", "analysis", "screening", "carbon"] as Tab[]).map(t => (
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
          { label: "AVG ESG", value: "61.3", color: "#22c55e" },
          { label: "LOW RISK", value: "3/8", color: "#38bdf8" },
          { label: "CONTROVERSIES", value: "44", color: "#ef4444" },
          { label: "GREEN REV %", value: "32.4%", color: "#10b981" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "scores" && (
          <div className="space-y-1.5">
            {ESG_SCORES.map((s, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                    <span style={{ color: "#94a3b8" }}>{s.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{s.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px]" style={{ color: s.trend === "up" ? "#22c55e" : s.trend === "down" ? "#ef4444" : "#94a3b8" }}>
                      {s.trend === "up" ? "▲" : s.trend === "down" ? "▼" : "─"}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.risk === "LOW" ? "rgba(34,197,94,0.15)" : s.risk === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                      color: s.risk === "LOW" ? "#22c55e" : s.risk === "HIGH" ? "#ef4444" : "#fbbf24"
                    }}>{s.risk}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]" style={{ color: "#64748b" }}>ESG:</span>
                    <div className="w-16 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.esg}%`, background: s.esg > 70 ? "#22c55e" : s.esg > 50 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold" style={{ color: s.esg > 70 ? "#22c55e" : s.esg > 50 ? "#fbbf24" : "#ef4444" }}>{s.esg}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]" style={{ color: "#22c55e" }}>E:{s.e}</span>
                    <span className="text-[9px]" style={{ color: "#38bdf8" }}>S:{s.s}</span>
                    <span className="text-[9px]" style={{ color: "#a855f7" }}>G:{s.g}</span>
                  </div>
                  <span className="text-[9px]" style={{ color: s.controversies > 5 ? "#ef4444" : "#94a3b8" }}>
                    {s.controversies} controversies
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analysis" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>E / S / G BREAKDOWN BY SECTOR</div>
            {[
              { sector: "Technology", e: 75, s: 77, g: 78, avg: 76.7 },
              { sector: "Financials", e: 55, s: 68, g: 60, avg: 61.0 },
              { sector: "Energy", e: 28, s: 50, g: 42, avg: 40.0 },
              { sector: "Healthcare", e: 70, s: 62, g: 72, avg: 68.0 },
              { sector: "Auto", e: 82, s: 28, g: 45, avg: 51.7 },
            ].map(s => (
              <div key={s.sector} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{s.sector}</span>
                  <span className="font-mono font-bold" style={{ color: s.avg > 70 ? "#22c55e" : s.avg > 50 ? "#fbbf24" : "#ef4444" }}>{s.avg.toFixed(1)}</span>
                </div>
                {[
                  { label: "Environmental", value: s.e, color: "#22c55e" },
                  { label: "Social", value: s.s, color: "#38bdf8" },
                  { label: "Governance", value: s.g, color: "#a855f7" },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-2 mb-1">
                    <span className="w-24 text-[9px]" style={{ color: "#64748b" }}>{d.label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color, opacity: 0.7 }} />
                    </div>
                    <span className="font-mono text-[9px] w-8 text-right" style={{ color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "screening" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXCLUSION SCREENS</div>
            {[
              { screen: "Controversial Weapons", excluded: 42, pctFlagged: 2.1 },
              { screen: "Thermal Coal (>30% rev)", excluded: 18, pctFlagged: 0.9 },
              { screen: "Tobacco Production", excluded: 8, pctFlagged: 0.4 },
              { screen: "UN Global Compact Violators", excluded: 24, pctFlagged: 1.2 },
              { screen: "Palm Oil (Deforestation)", excluded: 15, pctFlagged: 0.7 },
              { screen: "Private Prison Operators", excluded: 3, pctFlagged: 0.1 },
            ].map(s => (
              <div key={s.screen} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ color: "#e2e8f0" }}>{s.screen}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px]" style={{ color: "#ef4444" }}>{s.excluded} excluded</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{s.pctFlagged}% of universe</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>POSITIVE SCREENING CRITERIA</div>
            {[
              { criteria: "Green Revenue >50%", matches: 128, avgReturn: 12.4 },
              { criteria: "Board Diversity >40%", matches: 245, avgReturn: 10.8 },
              { criteria: "Science-Based Targets", matches: 342, avgReturn: 11.2 },
              { criteria: "Net-Zero Committed (2050)", matches: 456, avgReturn: 9.8 },
            ].map(s => (
              <div key={s.criteria} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ color: "#e2e8f0" }}>{s.criteria}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px]" style={{ color: "#22c55e" }}>{s.matches} matches</span>
                  <span className="font-mono text-[9px]" style={{ color: "#38bdf8" }}>Avg +{s.avgReturn}% YTD</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "carbon" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PORTFOLIO CARBON FOOTPRINT</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Carbon Intensity", value: "142 tCO2/$M", benchmark: "185 tCO2/$M", better: true },
                { label: "Weighted Avg Carbon", value: "8.4 tCO2/$M rev", benchmark: "12.1 tCO2/$M rev", better: true },
                { label: "Fossil Fuel Exposure", value: "8.4%", benchmark: "12.2%", better: true },
              ].map(m => (
                <div key={m.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="font-mono font-bold mt-1" style={{ color: m.better ? "#22c55e" : "#ef4444" }}>{m.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#64748b" }}>Bench: {m.benchmark}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SCOPE 1+2 EMISSIONS BY HOLDING</div>
            {ESG_SCORES.map(s => {
              const emissions = s.ticker === "XOM" ? 850 : s.ticker === "BP" ? 720 : s.ticker === "JPM" ? 180 : s.ticker === "TSLA" ? 45 : s.ticker === "MSFT" ? 28 : s.ticker === "AAPL" ? 35 : s.ticker === "NVDA" ? 22 : 15;
              const maxEmission = 850;
              return (
                <div key={s.ticker} className="flex items-center gap-2 p-1.5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <span className="font-mono w-10" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${(emissions / maxEmission) * 100}%`,
                      background: emissions > 500 ? "#ef4444" : emissions > 100 ? "#fbbf24" : "#22c55e"
                    }} />
                  </div>
                  <span className="font-mono text-[9px] w-20 text-right" style={{
                    color: emissions > 500 ? "#ef4444" : emissions > 100 ? "#fbbf24" : "#22c55e"
                  }}>{emissions} ktCO2e</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
