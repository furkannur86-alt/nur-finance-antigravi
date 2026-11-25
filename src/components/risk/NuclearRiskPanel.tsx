"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TABS = [
  { id: "facility", label: "Facility Status", icon: "☢️" },
  { id: "iaea", label: "IAEA Reports", icon: "📋" },
  { id: "proliferation", label: "Proliferation Index", icon: "🌍" },
  { id: "fallout", label: "Fallout Model", icon: "💨" },
];

const FACILITIES = [
  { name: "Zaporizhzhia NPP", country: "Ukraine", type: "PWR", capacity: "6,000 MW", status: "COLD SHUTDOWN", risk: "CRITICAL", lastInspection: "2026-09-14" },
  { name: "Flamanville 3 (EPR)", country: "France", type: "EPR", capacity: "1,650 MW", status: "OPERATIONAL", risk: "LOW", lastInspection: "2026-10-22" },
  { name: "Barakah Unit 4", country: "UAE", type: "APR-1400", capacity: "1,400 MW", status: "COMMISSIONING", risk: "LOW", lastInspection: "2026-11-01" },
  { name: "Bushehr II", country: "Iran", type: "VVER-1000", capacity: "1,000 MW", status: "CONSTRUCTION", risk: "HIGH", lastInspection: "2026-07-30" },
  { name: "Hinkley Point C", country: "UK", type: "EPR", capacity: "3,260 MW", status: "CONSTRUCTION", risk: "LOW", lastInspection: "2026-10-05" },
  { name: "Akkuyu Unit 1", country: "Turkey", type: "VVER-1200", capacity: "1,200 MW", status: "COMMISSIONING", risk: "MEDIUM", lastInspection: "2026-08-18" },
  { name: "Rooppur Unit 1", country: "Bangladesh", type: "VVER-1200", capacity: "1,200 MW", status: "CONSTRUCTION", risk: "MEDIUM", lastInspection: "2026-06-25" },
  { name: "Shin Kori 5", country: "South Korea", type: "APR-1400", capacity: "1,400 MW", status: "OPERATIONAL", risk: "LOW", lastInspection: "2026-10-30" },
];

const IAEA_REPORTS = [
  { id: "GOV/2026/58", country: "Iran", finding: "Excess enrichment above 60% threshold detected at Fordow", compliance: 32, date: "2026-11-10", severity: "CRITICAL" },
  { id: "GOV/2026/55", country: "DPRK", finding: "Continued plutonium reprocessing activity at Yongbyon", compliance: 0, date: "2026-10-28", severity: "CRITICAL" },
  { id: "GOV/2026/52", country: "Russia", finding: "Limited inspector access to Novaya Zemlya test site perimeter", compliance: 45, date: "2026-10-15", severity: "HIGH" },
  { id: "GOV/2026/49", country: "Pakistan", finding: "New centrifuge cascade installation at Kahuta confirmed", compliance: 58, date: "2026-09-20", severity: "HIGH" },
  { id: "GOV/2026/46", country: "China", finding: "Rapid expansion of Lop Nur underground storage confirmed", compliance: 71, date: "2026-09-05", severity: "MEDIUM" },
  { id: "GOV/2026/44", country: "India", finding: "Routine safeguards verification completed — no anomalies", compliance: 92, date: "2026-08-22", severity: "LOW" },
];

const PROLIFERATION = [
  { country: "DPRK", index: 97, warheads: "50–70", trend: "INCREASING", delivery: "ICBM operational", treaty: "NPT withdrawn" },
  { country: "Iran", index: 84, warheads: "0 (threshold)", trend: "INCREASING", delivery: "MRBM/IRBM capable", treaty: "JCPOA non-compliant" },
  { country: "Pakistan", index: 72, warheads: "170–180", trend: "STABLE", delivery: "MRBM operational", treaty: "Non-NPT" },
  { country: "India", index: 65, warheads: "170–180", trend: "INCREASING", delivery: "ICBM testing", treaty: "Non-NPT" },
  { country: "Israel", index: 60, warheads: "90 (est.)", trend: "STABLE", delivery: "IRBM / SLBM", treaty: "Non-NPT (undeclared)" },
  { country: "Russia", index: 55, warheads: "5,580", trend: "MODERNIZING", delivery: "Full triad", treaty: "New START expiring" },
  { country: "China", index: 52, warheads: "500+", trend: "INCREASING", delivery: "Full triad", treaty: "No bilateral treaty" },
  { country: "United States", index: 35, warheads: "5,044", trend: "MODERNIZING", delivery: "Full triad", treaty: "New START" },
  { country: "France", index: 20, warheads: "290", trend: "STABLE", delivery: "SLBM / ALCM", treaty: "NPT compliant" },
  { country: "United Kingdom", index: 18, warheads: "225", trend: "STABLE", delivery: "SLBM only", treaty: "NPT compliant" },
];

const FALLOUT_SCENARIOS = [
  { scenario: "Tactical 10kt — Urban Center", radius5psi: "1.4 km", thermalBurn: "2.1 km", falloutRange: "12 km", casualties: "80,000–120,000", probability: "LOW" },
  { scenario: "Strategic 500kt — Metro Area", radius5psi: "5.9 km", thermalBurn: "12.8 km", falloutRange: "150 km", casualties: "1.2M–2.8M", probability: "VERY LOW" },
  { scenario: "Dirty Bomb (RDD) — Financial District", radius5psi: "50 m", thermalBurn: "N/A", falloutRange: "1.5 km", casualties: "50–200 (direct)", probability: "MEDIUM" },
  { scenario: "Reactor Meltdown (Chernobyl-class)", radius5psi: "N/A", thermalBurn: "N/A", falloutRange: "300+ km", casualties: "4,000–93,000 (long-term)", probability: "LOW" },
  { scenario: "EMP Burst — High Altitude 400km", radius5psi: "N/A", thermalBurn: "N/A", falloutRange: "Continental", casualties: "Infrastructure collapse", probability: "VERY LOW" },
];

function riskColor(risk: string) {
  return risk === "CRITICAL" ? "#ef4444" : risk === "HIGH" ? "#f59e0b" : risk === "MEDIUM" ? "#3b82f6" : "#10b981";
}

export default function NuclearRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">☢️</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#f59e0b" }}>NUCLEAR RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · NUCLEAR</span>
      </div>

      <div className="flex gap-0.5 px-3 py-1 border-b border-white/[0.04]" style={{ background: "rgba(0,0,0,0.15)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1 text-[10px] font-mono font-medium rounded transition-all"
            style={{ background: tab === t.id ? "rgba(245,158,11,0.1)" : "transparent", color: tab === t.id ? "#f59e0b" : "#64748b", borderBottom: tab === t.id ? "2px solid #f59e0b" : "2px solid transparent" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === "facility" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_70px_90px_100px_70px_90px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Facility</span><span>Country</span><span>Type</span><span>Capacity</span><span>Status</span><span>Risk</span><span>Inspected</span>
            </div>
            {FACILITIES.map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_70px_90px_100px_70px_90px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-200">{f.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{f.country}</span>
                <span className="text-[10px] font-mono text-cyan-400">{f.type}</span>
                <span className="text-[10px] font-mono text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{f.capacity}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: f.status === "OPERATIONAL" ? "#10b981" : f.status === "COLD SHUTDOWN" ? "#ef4444" : "#f59e0b" }}>{f.status}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: riskColor(f.risk) }}>{f.risk}</span>
                <span className="text-[10px] font-mono text-slate-500">{f.lastInspection}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "iaea" && (
          <div className="space-y-3">
            {IAEA_REPORTS.map((r, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-mono text-cyan-400">{r.id}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: riskColor(r.severity), background: `${riskColor(r.severity)}15` }}>{r.severity}</span>
                  <span className="text-[9px] font-mono text-slate-500">{r.date}</span>
                  <div className="flex-1" />
                  <span className="text-[10px] font-mono text-slate-300">{r.country}</span>
                </div>
                <p className="text-[10px] font-mono text-slate-300 mb-2">{r.finding}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-500">COMPLIANCE</span>
                  <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.compliance}%`, background: r.compliance >= 80 ? "#10b981" : r.compliance >= 50 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: r.compliance >= 80 ? "#10b981" : r.compliance >= 50 ? "#f59e0b" : "#ef4444", fontVariantNumeric: "tabular-nums" }}>{r.compliance}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "proliferation" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_60px_90px_90px_1fr_120px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Country</span><span className="text-right">Index</span><span>Warheads</span><span>Trend</span><span>Delivery</span><span>Treaty</span>
            </div>
            {PROLIFERATION.map((p, i) => (
              <div key={i} className="grid grid-cols-[100px_60px_90px_90px_1fr_120px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-200">{p.country}</span>
                <span className="text-[10px] font-mono font-bold text-right" style={{ color: p.index >= 80 ? "#ef4444" : p.index >= 50 ? "#f59e0b" : "#10b981", fontVariantNumeric: "tabular-nums" }}>{p.index}</span>
                <span className="text-[10px] font-mono text-slate-400">{p.warheads}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: p.trend === "INCREASING" ? "#ef4444" : p.trend === "MODERNIZING" ? "#f59e0b" : "#10b981" }}>{p.trend}</span>
                <span className="text-[10px] font-mono text-slate-400">{p.delivery}</span>
                <span className="text-[10px] font-mono text-slate-500">{p.treaty}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "fallout" && (
          <div className="space-y-3">
            {FALLOUT_SCENARIOS.map((s, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-200">{s.scenario}</span>
                  <div className="flex-1" />
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: s.probability === "MEDIUM" ? "#f59e0b" : "#3b82f6", background: s.probability === "MEDIUM" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)" }}>P: {s.probability}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">5 PSI Radius</div>
                    <div className="text-[11px] font-mono font-bold text-amber-400">{s.radius5psi}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Thermal Burn</div>
                    <div className="text-[11px] font-mono font-bold text-red-400">{s.thermalBurn}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Fallout Range</div>
                    <div className="text-[11px] font-mono font-bold text-purple-400">{s.falloutRange}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Est. Casualties</div>
                    <div className="text-[11px] font-mono font-bold text-red-400">{s.casualties}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
