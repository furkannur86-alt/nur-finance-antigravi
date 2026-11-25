"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "targets" | "feasibility" | "resources" | "missions";

export default function AsteroidMiningPanel() {
  const [tab, setTab] = useState<Tab>("targets");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">☄️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ASTEROID MINING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>NUR GALACTIC</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["targets", "feasibility", "resources", "missions"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "targets" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HIGH-VALUE NEO TARGETS</div>
            {[
              { name: "Ryugu", type: "C-type", diameter: "900m", value: "$82.76B", deltaV: "4.66 km/s", window: "2028" },
              { name: "Bennu", type: "B-type", diameter: "492m", value: "$669M", deltaV: "5.09 km/s", window: "2027" },
              { name: "1986 DA", type: "M-type", diameter: "2.3km", value: "$12.4T", deltaV: "6.82 km/s", window: "2032" },
              { name: "Nereus", type: "E-type", diameter: "330m", value: "$4.71B", deltaV: "4.98 km/s", window: "2027" },
              { name: "2011 UW158", type: "M-type", diameter: "452m", value: "$5.4T", deltaV: "5.52 km/s", window: "2029" },
              { name: "Psyche", type: "M-type", diameter: "226km", value: "$10Q", deltaV: "9.41 km/s", window: "2029" },
            ].map(a => (
              <div key={a.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{a.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>{a.type}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{a.value}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Dia:</span> <span className="font-mono">{a.diameter}</span></div>
                  <div><span style={{ color: "#64748b" }}>Delta-V:</span> <span className="font-mono">{a.deltaV}</span></div>
                  <div><span style={{ color: "#64748b" }}>Window:</span> <span className="font-mono">{a.window}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "feasibility" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MINING FEASIBILITY SCORES</div>
            {[
              { name: "Ryugu", accessibility: 88, profitability: 72, tech: 65, overall: 75 },
              { name: "Nereus", accessibility: 92, profitability: 68, tech: 70, overall: 77 },
              { name: "Bennu", accessibility: 85, profitability: 45, tech: 80, overall: 70 },
              { name: "1986 DA", accessibility: 55, profitability: 95, tech: 35, overall: 62 },
              { name: "Psyche", accessibility: 25, profitability: 99, tech: 15, overall: 46 },
            ].map(f => (
              <div key={f.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{f.name}</span>
                  <span className="font-mono font-bold text-sm" style={{
                    color: f.overall > 70 ? "#22c55e" : f.overall > 50 ? "#fbbf24" : "#ef4444",
                  }}>{f.overall}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Access", val: f.accessibility },
                    { label: "Profit", val: f.profitability },
                    { label: "Tech", val: f.tech },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-[8px] mb-0.5">
                        <span style={{ color: "#64748b" }}>{s.label}</span>
                        <span className="font-mono">{s.val}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${s.val}%`,
                          background: s.val > 70 ? "rgba(34,197,94,0.5)" : s.val > 50 ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.5)",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "resources" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RESOURCE EXTRACTION ESTIMATES</div>
            {[
              { resource: "Platinum Group", earthPrice: "$31,200/oz", spaceEst: "850,000 tonnes", topTarget: "1986 DA", marketImpact: "Catastrophic" },
              { resource: "Iron-Nickel", earthPrice: "$450/tonne", spaceEst: "2.1B tonnes", topTarget: "Psyche", marketImpact: "Moderate" },
              { resource: "Water Ice", earthPrice: "N/A in-situ", spaceEst: "12M tonnes", topTarget: "Bennu", marketImpact: "Enabling" },
              { resource: "Rare Earths", earthPrice: "$85K/tonne", spaceEst: "45,000 tonnes", topTarget: "Ryugu", marketImpact: "High" },
              { resource: "Cobalt", earthPrice: "$33K/tonne", spaceEst: "120,000 tonnes", topTarget: "Nereus", marketImpact: "High" },
            ].map(r => (
              <div key={r.resource} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{r.resource}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{r.earthPrice}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Space Est:</span> <span className="font-mono">{r.spaceEst}</span></div>
                  <div><span style={{ color: "#64748b" }}>Target:</span> <span style={{ color: "#00e5a0" }}>{r.topTarget}</span></div>
                  <div><span style={{ color: "#64748b" }}>Mkt Impact:</span> <span style={{
                    color: r.marketImpact === "Catastrophic" ? "#ef4444" : r.marketImpact === "High" ? "#fbbf24" : "#22c55e",
                  }}>{r.marketImpact}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "missions" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE & PLANNED MISSIONS</div>
            {[
              { mission: "OSIRIS-APEX", target: "Apophis", agency: "NASA", launch: "In Transit", status: "Active", eta: "2029" },
              { mission: "Hayabusa2 Ext.", target: "1998 KY26", agency: "JAXA", launch: "In Transit", status: "Active", eta: "2031" },
              { mission: "Psyche Mission", target: "16 Psyche", agency: "NASA", launch: "Oct 2023", status: "Active", eta: "2029" },
              { mission: "AstroForge Odin", target: "Undisclosed", agency: "Commercial", launch: "2025", status: "Planned", eta: "2026" },
              { mission: "TransAstra Worker Bee", target: "NEO TBD", agency: "Commercial", launch: "2027", status: "Development", eta: "2028" },
            ].map(m => (
              <div key={m.mission} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{m.mission}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{m.agency}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: m.status === "Active" ? "rgba(34,197,94,0.15)" : m.status === "Planned" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                    color: m.status === "Active" ? "#22c55e" : m.status === "Planned" ? "#38bdf8" : "#fbbf24",
                  }}>{m.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Target:</span> <span style={{ color: "#00e5a0" }}>{m.target}</span></div>
                  <div><span style={{ color: "#64748b" }}>Launch:</span> <span className="font-mono">{m.launch}</span></div>
                  <div><span style={{ color: "#64748b" }}>ETA:</span> <span className="font-mono">{m.eta}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
