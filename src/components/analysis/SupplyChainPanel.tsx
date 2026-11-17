"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const SUPPLY_CHAINS = [
  { company: "Apple Inc.", ticker: "AAPL", tier1Suppliers: 42, tier2Suppliers: 186, countries: 14,
    riskScore: 32, disruptions: 1, concentration: "Medium",
    topSuppliers: ["TSMC", "Foxconn", "Samsung", "SK Hynix", "LG Display"],
    regions: { asia: 68, europe: 12, americas: 20 } },
  { company: "Tesla Inc.", ticker: "TSLA", tier1Suppliers: 38, tier2Suppliers: 152, countries: 11,
    riskScore: 58, disruptions: 3, concentration: "High",
    topSuppliers: ["Panasonic", "CATL", "LG Energy", "Samsung SDI", "BYD"],
    regions: { asia: 55, europe: 18, americas: 27 } },
  { company: "NVIDIA", ticker: "NVDA", tier1Suppliers: 28, tier2Suppliers: 94, countries: 8,
    riskScore: 71, disruptions: 2, concentration: "Critical",
    topSuppliers: ["TSMC", "SK Hynix", "Micron", "ASE Group", "Amkor"],
    regions: { asia: 82, europe: 5, americas: 13 } },
  { company: "Boeing", ticker: "BA", tier1Suppliers: 65, tier2Suppliers: 420, countries: 22,
    riskScore: 45, disruptions: 4, concentration: "Medium",
    topSuppliers: ["Spirit AeroSystems", "Raytheon", "GE Aerospace", "Safran", "Rolls-Royce"],
    regions: { asia: 15, europe: 35, americas: 50 } },
  { company: "Toyota", ticker: "TM", tier1Suppliers: 55, tier2Suppliers: 310, countries: 18,
    riskScore: 25, disruptions: 0, concentration: "Low",
    topSuppliers: ["Denso", "Aisin", "Toyota Boshoku", "JTEKT", "Panasonic"],
    regions: { asia: 62, europe: 15, americas: 23 } },
];

const DISRUPTIONS = [
  { date: "2026-11-15", type: "GEOPOLITICAL", severity: "HIGH", region: "Taiwan Strait", affected: ["AAPL", "NVDA", "AMD"], desc: "Naval exercises near TSMC fab locations" },
  { date: "2026-11-12", type: "LOGISTICS", severity: "MEDIUM", region: "Red Sea", affected: ["BA", "TSLA"], desc: "Shipping disruption, 14-day reroute via Cape" },
  { date: "2026-11-10", type: "NATURAL", severity: "LOW", region: "Kumamoto, Japan", affected: ["TM"], desc: "Minor earthquake near TSMC Japan fab, no damage" },
  { date: "2026-11-08", type: "LABOR", severity: "MEDIUM", region: "South Korea", affected: ["AAPL", "NVDA"], desc: "Samsung Electronics union strike threat" },
  { date: "2026-11-05", type: "REGULATORY", severity: "HIGH", region: "China", affected: ["AAPL", "TSLA", "NVDA"], desc: "New rare earth export controls announced" },
];

type Tab = "overview" | "disruptions" | "map";

export default function SupplyChainPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const [selected, setSelected] = useState<string | null>(null);

  const avgRisk = SUPPLY_CHAINS.reduce((s, c) => s + c.riskScore, 0) / SUPPLY_CHAINS.length;
  const totalDisruptions = DISRUPTIONS.length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔗</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SUPPLY CHAIN INTEL</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg SPLC</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "disruptions", "map"] as Tab[]).map(t => (
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
          { label: "AVG RISK SCORE", value: avgRisk.toFixed(0) + "/100", color: avgRisk > 50 ? "#ef4444" : avgRisk > 35 ? "#fbbf24" : "#22c55e" },
          { label: "ACTIVE DISRUPTIONS", value: totalDisruptions.toString(), color: "#ef4444" },
          { label: "COMPANIES TRACKED", value: SUPPLY_CHAINS.length.toString(), color: "#38bdf8" },
          { label: "TOTAL SUPPLIERS", value: SUPPLY_CHAINS.reduce((s, c) => s + c.tier1Suppliers + c.tier2Suppliers, 0).toString(), color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <div className="space-y-2">
            {SUPPLY_CHAINS.map(c => (
              <div key={c.ticker} className="p-3 rounded cursor-pointer" onClick={() => setSelected(selected === c.ticker ? null : c.ticker)}
                style={{ background: selected === c.ticker ? "rgba(0,229,160,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected === c.ticker ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                    <span style={{ color: "#94a3b8" }}>{c.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px]" style={{ color: "#64748b" }}>RISK</span>
                      <span className="font-bold font-mono" style={{ color: c.riskScore > 60 ? "#ef4444" : c.riskScore > 40 ? "#fbbf24" : "#22c55e" }}>
                        {c.riskScore}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{ background: c.concentration === "Critical" ? "rgba(239,68,68,0.15)" : c.concentration === "High" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                               color: c.concentration === "Critical" ? "#ef4444" : c.concentration === "High" ? "#fbbf24" : "#22c55e" }}>
                      {c.concentration}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Tier 1:</span> <span style={{ color: "#e2e8f0" }}>{c.tier1Suppliers}</span></div>
                  <div><span style={{ color: "#64748b" }}>Tier 2:</span> <span style={{ color: "#e2e8f0" }}>{c.tier2Suppliers}</span></div>
                  <div><span style={{ color: "#64748b" }}>Countries:</span> <span style={{ color: "#e2e8f0" }}>{c.countries}</span></div>
                  <div><span style={{ color: "#64748b" }}>Disruptions:</span> <span style={{ color: c.disruptions > 0 ? "#ef4444" : "#22c55e" }}>{c.disruptions}</span></div>
                </div>

                {selected === c.ticker && (
                  <div className="mt-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>TOP SUPPLIERS</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.topSuppliers.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded text-[9px]" style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", color: "#00e5a0" }}>{s}</span>
                      ))}
                    </div>
                    <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>GEOGRAPHIC DISTRIBUTION</div>
                    <div className="flex gap-1 items-center">
                      <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                        <div style={{ width: `${c.regions.asia}%`, background: "#ef4444" }} title={`Asia ${c.regions.asia}%`} />
                        <div style={{ width: `${c.regions.europe}%`, background: "#38bdf8" }} title={`Europe ${c.regions.europe}%`} />
                        <div style={{ width: `${c.regions.americas}%`, background: "#22c55e" }} title={`Americas ${c.regions.americas}%`} />
                      </div>
                      <div className="flex gap-2 text-[8px]">
                        <span style={{ color: "#ef4444" }}>Asia {c.regions.asia}%</span>
                        <span style={{ color: "#38bdf8" }}>EU {c.regions.europe}%</span>
                        <span style={{ color: "#22c55e" }}>AM {c.regions.americas}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "disruptions" && (
          <div className="space-y-2">
            {DISRUPTIONS.map((d, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${d.severity === "HIGH" ? "#ef4444" : d.severity === "MEDIUM" ? "#fbbf24" : "#22c55e"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>{d.type}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{d.date}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ background: d.severity === "HIGH" ? "rgba(239,68,68,0.15)" : d.severity === "MEDIUM" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                             color: d.severity === "HIGH" ? "#ef4444" : d.severity === "MEDIUM" ? "#fbbf24" : "#22c55e" }}>
                    {d.severity}
                  </span>
                </div>
                <div className="mb-1" style={{ color: "#e2e8f0" }}>{d.desc}</div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Region:</span>
                  <span className="text-[9px]" style={{ color: "#38bdf8" }}>{d.region}</span>
                  <span className="text-[8px] ml-2" style={{ color: "#64748b" }}>Affected:</span>
                  {d.affected.map(t => (
                    <span key={t} className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "map" && (
          <div className="space-y-3">
            <div className="text-[9px]" style={{ color: "#64748b" }}>Regional supply chain concentration by sector</div>
            {[
              { region: "East Asia (Taiwan, Japan, Korea)", risk: 78, suppliers: 342, critical: true },
              { region: "China Mainland", risk: 65, suppliers: 218, critical: true },
              { region: "Southeast Asia (Vietnam, Thailand)", risk: 35, suppliers: 94, critical: false },
              { region: "Western Europe (Germany, France, UK)", risk: 22, suppliers: 156, critical: false },
              { region: "North America (US, Mexico, Canada)", risk: 18, suppliers: 284, critical: false },
              { region: "India & South Asia", risk: 28, suppliers: 68, critical: false },
            ].map(r => (
              <div key={r.region} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between mb-1">
                  <span style={{ color: r.critical ? "#fbbf24" : "#94a3b8" }}>{r.region} {r.critical && "⚠️"}</span>
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{r.suppliers} suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${r.risk}%`, background: r.risk > 60 ? "#ef4444" : r.risk > 40 ? "#fbbf24" : "#22c55e" }} />
                  </div>
                  <span className="font-mono text-[9px] w-10 text-right" style={{ color: r.risk > 60 ? "#ef4444" : r.risk > 40 ? "#fbbf24" : "#22c55e" }}>
                    {r.risk}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
