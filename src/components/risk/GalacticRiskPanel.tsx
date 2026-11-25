"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TABS = [
  { id: "neo", label: "Near-Earth Objects", icon: "☄️" },
  { id: "solar", label: "Solar Storms", icon: "☀️" },
  { id: "debris", label: "Space Debris", icon: "🛰️" },
  { id: "impact", label: "Impact Assessment", icon: "🎯" },
];

const NEO_OBJECTS = [
  { name: "99942 Apophis", diameter: "370 m", closeApproach: "2029-04-13", distance: "31,600 km", velocity: "30.73 km/s", hazardous: true, torino: 0, palermo: -2.81 },
  { name: "2024 YR4", diameter: "55 m", closeApproach: "2032-12-22", distance: "0.0014 AU", velocity: "18.44 km/s", hazardous: true, torino: 1, palermo: -1.69 },
  { name: "101955 Bennu", diameter: "492 m", closeApproach: "2182-09-24", distance: "0.0012 AU", velocity: "6.02 km/s", hazardous: true, torino: 0, palermo: -1.71 },
  { name: "29075 (1950 DA)", diameter: "1.3 km", closeApproach: "2880-03-16", distance: "0.0014 AU", velocity: "14.38 km/s", hazardous: true, torino: 0, palermo: -2.20 },
  { name: "2023 TL4", diameter: "120 m", closeApproach: "2119-10-08", distance: "0.0048 AU", velocity: "22.11 km/s", hazardous: true, torino: 0, palermo: -3.44 },
  { name: "4179 Toutatis", diameter: "2.5 km", closeApproach: "2069-11-05", distance: "0.0198 AU", velocity: "10.19 km/s", hazardous: false, torino: 0, palermo: -5.80 },
  { name: "3200 Phaethon", diameter: "5.1 km", closeApproach: "2093-12-14", distance: "0.0194 AU", velocity: "32.73 km/s", hazardous: false, torino: 0, palermo: -8.12 },
];

const SOLAR_EVENTS = [
  { event: "X9.1 Solar Flare", region: "AR 3978", date: "2026-11-22", kpIndex: 8, radio: "R3 (Strong)", geoStorm: "G4 Severe", satRisk: "HIGH" },
  { event: "M7.4 Solar Flare", region: "AR 3972", date: "2026-11-19", kpIndex: 6, radio: "R2 (Moderate)", geoStorm: "G2 Moderate", satRisk: "MEDIUM" },
  { event: "CME (Halo)", region: "AR 3978", date: "2026-11-21", kpIndex: 7, radio: "R2 (Moderate)", geoStorm: "G3 Strong", satRisk: "HIGH" },
  { event: "X2.3 Solar Flare", region: "AR 3965", date: "2026-11-15", kpIndex: 5, radio: "R2 (Moderate)", geoStorm: "G2 Moderate", satRisk: "MEDIUM" },
  { event: "Solar Proton Event", region: "Multiple", date: "2026-11-20", kpIndex: 4, radio: "R1 (Minor)", geoStorm: "G1 Minor", satRisk: "LOW" },
  { event: "M4.8 Solar Flare", region: "AR 3980", date: "2026-11-24", kpIndex: 5, radio: "R1 (Minor)", geoStorm: "G1 Minor", satRisk: "LOW" },
];

const DEBRIS_ZONES = [
  { orbit: "LEO (200–2000 km)", tracked: 28400, estimated: "1M+", collisionRisk: "HIGH", trend: "+3.2%/yr", keyAssets: "ISS, Starlink, spy sats" },
  { orbit: "MEO (2000–35786 km)", tracked: 1200, estimated: "~15K", collisionRisk: "LOW", trend: "+0.8%/yr", keyAssets: "GPS, Galileo, GLONASS" },
  { orbit: "GEO (35786 km)", tracked: 850, estimated: "~3K", collisionRisk: "MEDIUM", trend: "+1.4%/yr", keyAssets: "Comms, weather, defense" },
  { orbit: "HEO / Molniya", tracked: 340, estimated: "~800", collisionRisk: "LOW", trend: "+0.3%/yr", keyAssets: "SIGINT, early warning" },
  { orbit: "Graveyard (>36100 km)", tracked: 420, estimated: "~1K", collisionRisk: "NEGLIGIBLE", trend: "+2.1%/yr", keyAssets: "Decommissioned GEO" },
];

const IMPACT_SCENARIOS = [
  { scenario: "Apophis 2029 Close Pass", probability: "0% (flyby)", damage: "$0", affectedPop: "0", category: "SAFE", note: "Passes inside GEO orbit — no impact" },
  { scenario: "2024 YR4 (55m impact)", probability: "~0.4%", damage: "$12–45B", affectedPop: "1–5M (local)", category: "ELEVATED", note: "Tunguska-class airburst; could devastate a metro area" },
  { scenario: "Bennu-class (500m)", probability: "0.037%", damage: "$4–8T", affectedPop: "50–200M", category: "CATASTROPHIC", note: "Continent-scale devastation, climate effects" },
  { scenario: "Carrington-class Solar", probability: "~12%/decade", damage: "$2–10T", affectedPop: "Global", category: "HIGH", note: "Grid collapse, satellite loss, comms blackout" },
  { scenario: "Kessler Syndrome", probability: "Growing", damage: "$500B+", affectedPop: "Global", category: "ELEVATED", note: "Cascading debris renders LEO unusable" },
];

function torinoColor(t: number) {
  return t === 0 ? "#10b981" : t === 1 ? "#3b82f6" : t <= 4 ? "#f59e0b" : t <= 7 ? "#f97316" : "#ef4444";
}

function riskColor(r: string) {
  return r === "HIGH" ? "#ef4444" : r === "MEDIUM" ? "#f59e0b" : r === "LOW" ? "#10b981" : r === "NEGLIGIBLE" ? "#64748b" : r === "ELEVATED" ? "#f59e0b" : r === "CATASTROPHIC" ? "#ef4444" : r === "SAFE" ? "#10b981" : "#64748b";
}

export default function GalacticRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">☄️</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#ef4444" }}>GALACTIC RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · GALACTIC · NASA NEO DATA</span>
      </div>

      <div className="flex gap-0.5 px-3 py-1 border-b border-white/[0.04]" style={{ background: "rgba(0,0,0,0.15)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1 text-[10px] font-mono font-medium rounded transition-all"
            style={{ background: tab === t.id ? "rgba(239,68,68,0.1)" : "transparent", color: tab === t.id ? "#ef4444" : "#64748b", borderBottom: tab === t.id ? "2px solid #ef4444" : "2px solid transparent" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === "neo" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_60px_90px_90px_80px_50px_60px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Object</span><span className="text-right">Size</span><span>Close Approach</span><span className="text-right">Distance</span><span className="text-right">Velocity</span><span>Torino</span><span>PHA</span>
            </div>
            {NEO_OBJECTS.map((n, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_90px_90px_80px_50px_60px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200 font-bold">{n.name}</span>
                <span className="text-[10px] font-mono text-right text-amber-400" style={{ fontVariantNumeric: "tabular-nums" }}>{n.diameter}</span>
                <span className="text-[10px] font-mono text-cyan-400">{n.closeApproach}</span>
                <span className="text-[10px] font-mono text-right text-slate-300" style={{ fontVariantNumeric: "tabular-nums" }}>{n.distance}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{n.velocity}</span>
                <span className="text-[10px] font-mono font-bold text-center px-1 py-0.5 rounded" style={{ color: torinoColor(n.torino), background: `${torinoColor(n.torino)}15` }}>{n.torino}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: n.hazardous ? "#ef4444" : "#10b981" }}>{n.hazardous ? "YES" : "NO"}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "solar" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_90px_60px_100px_100px_70px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Event</span><span>Region</span><span>Date</span><span>Kp</span><span>Radio</span><span>Geo Storm</span><span>Sat Risk</span>
            </div>
            {SOLAR_EVENTS.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_90px_60px_100px_100px_70px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.event}</span>
                <span className="text-[10px] font-mono text-cyan-400">{s.region}</span>
                <span className="text-[10px] font-mono text-slate-400">{s.date}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: s.kpIndex >= 7 ? "#ef4444" : s.kpIndex >= 5 ? "#f59e0b" : "#10b981", fontVariantNumeric: "tabular-nums" }}>{s.kpIndex}</span>
                <span className="text-[10px] font-mono text-slate-400">{s.radio}</span>
                <span className="text-[10px] font-mono" style={{ color: s.geoStorm.includes("Severe") ? "#ef4444" : s.geoStorm.includes("Strong") ? "#f59e0b" : "#3b82f6" }}>{s.geoStorm}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: riskColor(s.satRisk), background: `${riskColor(s.satRisk)}15` }}>{s.satRisk}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "debris" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[140px_80px_80px_90px_80px_1fr] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Orbit Zone</span><span className="text-right">Tracked</span><span className="text-right">Estimated</span><span>Risk</span><span>Trend</span><span>Key Assets</span>
            </div>
            {DEBRIS_ZONES.map((d, i) => (
              <div key={i} className="grid grid-cols-[140px_80px_80px_90px_80px_1fr] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{d.orbit}</span>
                <span className="text-[10px] font-mono text-right text-amber-400" style={{ fontVariantNumeric: "tabular-nums" }}>{d.tracked.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-right text-slate-400">{d.estimated}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: riskColor(d.collisionRisk), background: `${riskColor(d.collisionRisk)}15` }}>{d.collisionRisk}</span>
                <span className="text-[10px] font-mono" style={{ color: "#f59e0b" }}>{d.trend}</span>
                <span className="text-[10px] font-mono text-slate-500">{d.keyAssets}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "impact" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_90px_90px_90px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Scenario</span><span className="text-right">Probability</span><span className="text-right">Damage Est.</span><span>Affected</span><span>Category</span>
            </div>
            {IMPACT_SCENARIOS.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_90px_90px_90px] gap-2 px-2 py-2 rounded hover:bg-white/[0.03] transition-colors border-b border-white/[0.03]">
                <div>
                  <div className="text-[11px] font-mono text-slate-200">{s.scenario}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">{s.note}</div>
                </div>
                <span className="text-[10px] font-mono text-right text-slate-300" style={{ fontVariantNumeric: "tabular-nums" }}>{s.probability}</span>
                <span className="text-[10px] font-mono text-right text-amber-400" style={{ fontVariantNumeric: "tabular-nums" }}>{s.damage}</span>
                <span className="text-[10px] font-mono text-slate-400">{s.affectedPop}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded self-start" style={{ color: riskColor(s.category), background: `${riskColor(s.category)}15` }}>{s.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
