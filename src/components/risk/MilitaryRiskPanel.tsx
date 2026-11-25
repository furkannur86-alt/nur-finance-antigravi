"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TABS = [
  { id: "deployments", label: "Deployments", icon: "🎖️" },
  { id: "conflicts", label: "Conflicts", icon: "⚔️" },
  { id: "defense", label: "Defense Spending", icon: "💰" },
  { id: "arms", label: "Arms Trade", icon: "🔫" },
];

const DEPLOYMENTS = [
  { country: "United States", region: "Indo-Pacific", type: "Naval / Air", forceSize: "58,000", bases: 12, alert: "ELEVATED" },
  { country: "United States", region: "Europe (NATO)", type: "Ground / Air", forceSize: "105,000", bases: 24, alert: "HIGH" },
  { country: "Russia", region: "Western Military District", type: "Combined Arms", forceSize: "340,000", bases: 45, alert: "HIGH" },
  { country: "China", region: "South China Sea", type: "Naval / Missile", forceSize: "72,000", bases: 8, alert: "ELEVATED" },
  { country: "China", region: "Taiwan Strait", type: "Amphibious / Air", forceSize: "180,000", bases: 15, alert: "CRITICAL" },
  { country: "Israel", region: "Northern Border", type: "Ground / Air / AD", forceSize: "120,000", bases: 6, alert: "CRITICAL" },
  { country: "India", region: "LAC (Ladakh)", type: "Mountain / Air", forceSize: "65,000", bases: 4, alert: "ELEVATED" },
  { country: "NATO", region: "Baltic States", type: "Battlegroups", forceSize: "12,000", bases: 6, alert: "HIGH" },
  { country: "France", region: "Sahel (Africa)", type: "Counter-terror", forceSize: "3,500", bases: 3, alert: "MEDIUM" },
];

const CONFLICTS = [
  { zone: "Ukraine – Eastern Front", parties: "RUS vs UKR", intensity: 9.2, casualties2026: "45,000+", status: "ACTIVE", type: "Interstate" },
  { zone: "Gaza / West Bank", parties: "ISR vs Hamas/PIJ", intensity: 8.8, casualties2026: "32,000+", status: "ACTIVE", type: "Asymmetric" },
  { zone: "Sudan Civil War", parties: "SAF vs RSF", intensity: 8.1, casualties2026: "18,000+", status: "ACTIVE", type: "Civil War" },
  { zone: "Myanmar (Burma)", parties: "Junta vs Resistance", intensity: 7.4, casualties2026: "12,000+", status: "ACTIVE", type: "Civil War" },
  { zone: "Red Sea / Houthi", parties: "Coalition vs Ansar Allah", intensity: 6.8, casualties2026: "2,400+", status: "ACTIVE", type: "Maritime" },
  { zone: "DR Congo (M23)", parties: "FARDC vs M23 / RDF", intensity: 6.5, casualties2026: "8,000+", status: "ACTIVE", type: "Proxy War" },
  { zone: "Sahel (Burkina / Mali)", parties: "Juntas vs JNIM/ISGS", intensity: 6.2, casualties2026: "5,500+", status: "ACTIVE", type: "Insurgency" },
  { zone: "Taiwan Strait", parties: "PRC vs ROC tensions", intensity: 4.5, casualties2026: "0", status: "TENSION", type: "Interstate" },
];

const DEFENSE_SPENDING = [
  { country: "United States", spending: 886.0, gdpPct: 3.4, yoy: 3.2, rank: 1, personnel: "1.4M" },
  { country: "China", spending: 296.0, gdpPct: 1.6, yoy: 7.1, rank: 2, personnel: "2.0M" },
  { country: "Russia", spending: 109.0, gdpPct: 5.9, yoy: 24.0, rank: 3, personnel: "1.3M" },
  { country: "India", spending: 83.6, gdpPct: 2.4, yoy: 4.5, rank: 4, personnel: "1.5M" },
  { country: "Saudi Arabia", spending: 75.8, gdpPct: 7.1, yoy: 6.8, rank: 5, personnel: "257K" },
  { country: "United Kingdom", spending: 74.9, gdpPct: 2.3, yoy: 5.1, rank: 6, personnel: "153K" },
  { country: "Germany", spending: 66.8, gdpPct: 1.6, yoy: 12.3, rank: 7, personnel: "183K" },
  { country: "France", spending: 61.3, gdpPct: 2.1, yoy: 3.8, rank: 8, personnel: "205K" },
  { country: "Japan", spending: 50.2, gdpPct: 1.2, yoy: 16.5, rank: 9, personnel: "247K" },
  { country: "South Korea", spending: 46.4, gdpPct: 2.7, yoy: 4.2, rank: 10, personnel: "500K" },
];

const ARMS_TRADE = [
  { deal: "F-35A Lightning II", seller: "USA", buyer: "Poland", value: 14.5, units: 96, year: 2026, status: "SIGNED" },
  { deal: "Su-57 Felon", seller: "Russia", buyer: "Algeria", value: 8.2, units: 24, year: 2026, status: "NEGOTIATING" },
  { deal: "Eurofighter Typhoon", seller: "Germany / UK", buyer: "Saudi Arabia", value: 11.8, units: 48, year: 2026, status: "PENDING" },
  { deal: "K2 Black Panther MBT", seller: "South Korea", buyer: "Poland", value: 7.6, units: 180, year: 2026, status: "DELIVERING" },
  { deal: "Rafael Trophy APS", seller: "Israel", buyer: "USA (Army)", value: 3.2, units: 400, year: 2026, status: "SIGNED" },
  { deal: "NASAMS III AD", seller: "Norway / USA", buyer: "Ukraine", value: 2.8, units: 12, year: 2026, status: "DELIVERING" },
  { deal: "Scorpene Submarine", seller: "France", buyer: "India", value: 5.1, units: 3, year: 2026, status: "CONSTRUCTION" },
];

function alertColor(a: string) {
  return a === "CRITICAL" ? "#ef4444" : a === "HIGH" ? "#f59e0b" : a === "ELEVATED" ? "#3b82f6" : "#10b981";
}

export default function MilitaryRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">🎖️</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#6366f1" }}>MILITARY RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · MILITARY</span>
      </div>

      <div className="flex gap-0.5 px-3 py-1 border-b border-white/[0.04]" style={{ background: "rgba(0,0,0,0.15)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1 text-[10px] font-mono font-medium rounded transition-all"
            style={{ background: tab === t.id ? "rgba(99,102,241,0.1)" : "transparent", color: tab === t.id ? "#6366f1" : "#64748b", borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === "deployments" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_120px_100px_80px_50px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Country</span><span>Region</span><span>Type</span><span>Forces</span><span>Bases</span><span>Alert</span>
            </div>
            {DEPLOYMENTS.map((d, i) => (
              <div key={i} className="grid grid-cols-[100px_120px_100px_80px_50px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-200">{d.country}</span>
                <span className="text-[10px] font-mono text-slate-400">{d.region}</span>
                <span className="text-[10px] font-mono text-cyan-400">{d.type}</span>
                <span className="text-[10px] font-mono text-slate-300" style={{ fontVariantNumeric: "tabular-nums" }}>{d.forceSize}</span>
                <span className="text-[10px] font-mono text-slate-400 text-center" style={{ fontVariantNumeric: "tabular-nums" }}>{d.bases}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: alertColor(d.alert) }}>{d.alert}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "conflicts" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_120px_60px_80px_70px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Zone</span><span>Parties</span><span className="text-right">Score</span><span className="text-right">Casualties</span><span>Status</span><span>Type</span>
            </div>
            {CONFLICTS.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_120px_60px_80px_70px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-200">{c.zone}</span>
                <span className="text-[10px] font-mono text-slate-400">{c.parties}</span>
                <span className="text-[10px] font-mono font-bold text-right" style={{ color: c.intensity >= 8 ? "#ef4444" : c.intensity >= 6 ? "#f59e0b" : "#3b82f6", fontVariantNumeric: "tabular-nums" }}>{c.intensity.toFixed(1)}</span>
                <span className="text-[10px] font-mono text-red-400 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{c.casualties2026}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: c.status === "ACTIVE" ? "#ef4444" : "#f59e0b" }}>{c.status}</span>
                <span className="text-[10px] font-mono text-slate-500">{c.type}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "defense" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[40px_120px_80px_70px_70px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>#</span><span>Country</span><span className="text-right">$Bn</span><span className="text-right">% GDP</span><span className="text-right">YoY%</span><span className="text-right">Personnel</span>
            </div>
            {DEFENSE_SPENDING.map((d, i) => (
              <div key={i} className="grid grid-cols-[40px_120px_80px_70px_70px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-500" style={{ fontVariantNumeric: "tabular-nums" }}>{d.rank}</span>
                <span className="text-[10px] font-mono text-slate-200">{d.country}</span>
                <span className="text-[10px] font-mono text-emerald-400 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>${d.spending.toFixed(1)}B</span>
                <span className="text-[10px] font-mono text-slate-400 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{d.gdpPct.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-right font-bold" style={{ color: d.yoy >= 10 ? "#ef4444" : d.yoy >= 5 ? "#f59e0b" : "#10b981", fontVariantNumeric: "tabular-nums" }}>+{d.yoy.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-slate-400 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{d.personnel}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "arms" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_90px_90px_60px_50px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>System</span><span>Seller</span><span>Buyer</span><span className="text-right">$Bn</span><span className="text-right">Units</span><span>Status</span>
            </div>
            {ARMS_TRADE.map((a, i) => (
              <div key={i} className="grid grid-cols-[1fr_90px_90px_60px_50px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-slate-200">{a.deal}</span>
                <span className="text-[10px] font-mono text-cyan-400">{a.seller}</span>
                <span className="text-[10px] font-mono text-slate-400">{a.buyer}</span>
                <span className="text-[10px] font-mono text-emerald-400 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>${a.value}B</span>
                <span className="text-[10px] font-mono text-slate-400 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{a.units}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: a.status === "DELIVERING" ? "#10b981" : a.status === "SIGNED" ? "#3b82f6" : "#f59e0b" }}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
