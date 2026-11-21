"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "funds" | "projects" | "ppp" | "esg";

export default function InfrastructurePanel() {
  const [tab, setTab] = useState<Tab>("funds");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏗️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INFRASTRUCTURE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg INFR</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["funds", "projects", "ppp", "esg"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "ppp" ? "PPP/DEALS" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "GLOBAL INFRA AUM", value: "$1.2T", color: "#38bdf8" },
          { label: "DEAL VOLUME", value: "$485B", color: "#fbbf24" },
          { label: "AVG IRR (10Y)", value: "9.8%", color: "#22c55e" },
          { label: "DRY POWDER", value: "$380B", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "funds" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>TOP INFRASTRUCTURE FUNDS</div>
            {[
              { name: "Brookfield Infra Fund V", aum: "$28B", vintage: 2024, irr: 12.5, moic: 1.65, dpi: 0.4, strategy: "Core+" },
              { name: "Global Infrastructure Partners V", aum: "$22B", vintage: 2023, irr: 14.2, moic: 1.82, dpi: 0.6, strategy: "Value-Add" },
              { name: "Macquarie Asia Infra Fund 3", aum: "$8.5B", vintage: 2024, irr: 11.8, moic: 1.48, dpi: 0.3, strategy: "Core" },
              { name: "KKR Global Infra Investors IV", aum: "$18B", vintage: 2023, irr: 15.5, moic: 1.92, dpi: 0.5, strategy: "Value-Add" },
              { name: "EQT Infrastructure VI", aum: "$14B", vintage: 2024, irr: 13.2, moic: 1.55, dpi: 0.2, strategy: "Core+" },
              { name: "Stonepeak Infra Fund V", aum: "$12B", vintage: 2023, irr: 16.8, moic: 2.05, dpi: 0.7, strategy: "Opportunistic" },
            ].map(f => (
              <div key={f.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{f.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{f.strategy}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>{f.aum}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>IRR:</span> <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{f.irr}%</span></div>
                  <div><span style={{ color: "#64748b" }}>MOIC:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{f.moic}x</span></div>
                  <div><span style={{ color: "#64748b" }}>DPI:</span> <span className="font-mono">{f.dpi}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Vintage:</span> <span className="font-mono">{f.vintage}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "projects" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MAJOR INFRASTRUCTURE PROJECTS</div>
            {[
              { project: "NEOM (Saudi Arabia)", value: "$500B", sector: "Mega-city", status: "CONSTRUCTION", completion: "2039" },
              { project: "HS2 Phase 2 (UK)", value: "$85B", sector: "Rail", status: "REVIEW", completion: "2040+" },
              { project: "Mumbai-Ahmedabad HSR (India)", value: "$18B", sector: "Rail", status: "CONSTRUCTION", completion: "2028" },
              { project: "Grand Ethiopian Dam (GERD)", value: "$4.8B", sector: "Energy", status: "FILLING", completion: "2026" },
              { project: "Jakarta-Bandung HSR", value: "$7.3B", sector: "Rail", status: "OPERATIONAL", completion: "2023" },
              { project: "Baltic Pipe (EU)", value: "$2.5B", sector: "Energy", status: "OPERATIONAL", completion: "2022" },
            ].map(p => (
              <div key={p.project} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{p.project}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: p.status === "OPERATIONAL" ? "rgba(34,197,94,0.15)" : p.status === "CONSTRUCTION" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                    color: p.status === "OPERATIONAL" ? "#22c55e" : p.status === "CONSTRUCTION" ? "#38bdf8" : "#fbbf24"
                  }}>{p.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Value:</span> <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{p.value}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sector:</span> <span>{p.sector}</span></div>
                  <div><span style={{ color: "#64748b" }}>Completion:</span> <span className="font-mono">{p.completion}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "ppp" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PPP & CONCESSION DEALS (2026)</div>
            {[
              { deal: "Athens Airport Concession Extension", country: "Greece", value: "$4.2B", tenor: "20yr", sponsor: "AviAlliance/PSP", sector: "Transport" },
              { deal: "India National Highway Bundle 12", country: "India", value: "$2.8B", tenor: "30yr", sponsor: "NHAI/Multiple", sector: "Roads" },
              { deal: "Chile Solar/Wind Package", country: "Chile", value: "$1.5B", tenor: "25yr", sponsor: "Enel/ACWA", sector: "Renewables" },
              { deal: "Lagos Light Rail Phase 2", country: "Nigeria", value: "$1.2B", tenor: "25yr", sponsor: "CRRC/Local", sector: "Rail" },
              { deal: "UK Water Sector AMP8", country: "UK", value: "$85B", tenor: "5yr cycle", sponsor: "Multiple", sector: "Water" },
            ].map(d => (
              <div key={d.deal} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{d.deal}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{d.value}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Country:</span> <span>{d.country}</span></div>
                  <div><span style={{ color: "#64748b" }}>Tenor:</span> <span className="font-mono">{d.tenor}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sponsor:</span> <span style={{ color: "#94a3b8" }}>{d.sponsor}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sector:</span> <span style={{ color: "#38bdf8" }}>{d.sector}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "esg" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SUSTAINABLE INFRASTRUCTURE</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Green Infra AUM", value: "$485B", sub: "+35% YoY" },
                { label: "Renewable Deals", value: "$142B", sub: "2026 YTD" },
                { label: "EV Charging", value: "$28B", sub: "+52% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#22c55e" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>ENERGY TRANSITION INVESTMENT BY SECTOR</div>
            {[
              { sector: "Solar", investment: "$382B", growth: 25, share: 32 },
              { sector: "Wind (Onshore+Offshore)", investment: "$245B", growth: 18, share: 21 },
              { sector: "Battery Storage", investment: "$142B", growth: 48, share: 12 },
              { sector: "EV Infrastructure", investment: "$128B", growth: 42, share: 11 },
              { sector: "Hydrogen / Green Fuel", investment: "$85B", growth: 65, share: 7 },
              { sector: "Grid / Transmission", investment: "$198B", growth: 22, share: 17 },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36">{s.sector}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${s.share * 3}%`, background: "#22c55e", opacity: 0.6 }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: "#22c55e" }}>{s.investment}</span>
                <span className="font-mono text-[9px] w-10 text-right" style={{ color: "#fbbf24" }}>+{s.growth}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
