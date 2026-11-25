"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TABS = [
  { id: "elections", label: "Election Risk", icon: "🗳️" },
  { id: "regime", label: "Regime Stability", icon: "🏛️" },
  { id: "sanctions", label: "Sanctions Tracker", icon: "🚫" },
  { id: "sovereign", label: "Sovereign Default", icon: "💀" },
];

const ELECTIONS = [
  { country: "Germany", date: "2027-09", type: "Federal", incumbentRisk: "HIGH", marketImpact: "EUR, DAX", volatilityPremium: "+2.1%", populistThreat: 42 },
  { country: "South Korea", date: "2027-03", type: "Presidential", incumbentRisk: "CRITICAL", marketImpact: "KRW, KOSPI", volatilityPremium: "+3.8%", populistThreat: 38 },
  { country: "United Kingdom", date: "2029-01", type: "General", incumbentRisk: "MEDIUM", marketImpact: "GBP, FTSE", volatilityPremium: "+1.4%", populistThreat: 31 },
  { country: "India", date: "2029-05", type: "General", incumbentRisk: "LOW", marketImpact: "INR, NIFTY", volatilityPremium: "+1.8%", populistThreat: 55 },
  { country: "Brazil", date: "2026-10", type: "Municipal", incumbentRisk: "MEDIUM", marketImpact: "BRL, IBOV", volatilityPremium: "+2.5%", populistThreat: 61 },
  { country: "Mexico", date: "2027-06", type: "Midterm", incumbentRisk: "HIGH", marketImpact: "MXN, IPC", volatilityPremium: "+3.2%", populistThreat: 48 },
  { country: "Turkey", date: "2028-06", type: "General", incumbentRisk: "HIGH", marketImpact: "TRY, BIST", volatilityPremium: "+4.1%", populistThreat: 67 },
  { country: "Japan", date: "2028-10", type: "General", incumbentRisk: "MEDIUM", marketImpact: "JPY, N225", volatilityPremium: "+0.9%", populistThreat: 18 },
];

const REGIME_STABILITY = [
  { country: "Russia", score: 32, trend: -4.2, protests: 12, freePress: 8, corruption: 28, category: "AUTHORITARIAN" },
  { country: "China", score: 41, trend: -1.8, protests: 3, freePress: 11, corruption: 42, category: "AUTHORITARIAN" },
  { country: "Iran", score: 22, trend: -6.1, protests: 28, freePress: 5, corruption: 24, category: "UNSTABLE" },
  { country: "Venezuela", score: 18, trend: -2.3, protests: 34, freePress: 9, corruption: 15, category: "UNSTABLE" },
  { country: "Myanmar", score: 15, trend: -8.4, protests: 45, freePress: 4, corruption: 18, category: "CONFLICT" },
  { country: "Pakistan", score: 29, trend: -3.7, protests: 19, freePress: 22, corruption: 27, category: "FRAGILE" },
  { country: "Nigeria", score: 34, trend: 1.2, protests: 8, freePress: 31, corruption: 25, category: "FRAGILE" },
  { country: "Egypt", score: 28, trend: -2.0, protests: 5, freePress: 12, corruption: 30, category: "AUTHORITARIAN" },
  { country: "Ethiopia", score: 21, trend: -5.6, protests: 22, freePress: 14, corruption: 20, category: "CONFLICT" },
];

const SANCTIONS = [
  { target: "Russia (Full Regime)", sectors: "Energy, Finance, Tech, Defense", imposedBy: "US, EU, UK, JP, AU", since: "2022", impact: "SEVERE", compliance: 92 },
  { target: "Iran (Nuclear)", sectors: "Oil, Banking, Shipping", imposedBy: "US, EU, UN", since: "2018 (re-imposed)", impact: "SEVERE", compliance: 78 },
  { target: "China (Tech/Chips)", sectors: "Semiconductors, AI, Quantum", imposedBy: "US, NL, JP", since: "2022", impact: "HIGH", compliance: 85 },
  { target: "DPRK (Full)", sectors: "All sectors", imposedBy: "UN, US, EU, JP, KR", since: "2006", impact: "TOTAL", compliance: 71 },
  { target: "Myanmar (Military)", sectors: "Gems, Timber, State Enterprises", imposedBy: "US, EU, UK", since: "2021", impact: "MODERATE", compliance: 64 },
  { target: "Belarus (Lukashenko)", sectors: "Potash, Finance, Travel", imposedBy: "US, EU, UK", since: "2020", impact: "MODERATE", compliance: 88 },
  { target: "Venezuela (Maduro)", sectors: "Oil, Gold, Finance", imposedBy: "US, EU, CA", since: "2017", impact: "HIGH", compliance: 73 },
];

const SOVEREIGN_DEFAULT = [
  { country: "Sri Lanka", probability: 68, spread: 2840, rating: "SD", debtGDP: 128, reserves: "$1.8B", imfProgram: true },
  { country: "Ghana", probability: 52, spread: 1920, rating: "SD", debtGDP: 93, reserves: "$5.1B", imfProgram: true },
  { country: "Pakistan", probability: 38, spread: 1150, rating: "CCC+", debtGDP: 78, reserves: "$9.4B", imfProgram: true },
  { country: "Egypt", probability: 31, spread: 890, rating: "B-", debtGDP: 92, reserves: "$35B", imfProgram: true },
  { country: "Ethiopia", probability: 45, spread: 1680, rating: "CCC-", debtGDP: 56, reserves: "$1.2B", imfProgram: false },
  { country: "Tunisia", probability: 42, spread: 1340, rating: "CCC", debtGDP: 83, reserves: "$7.8B", imfProgram: false },
  { country: "Argentina", probability: 29, spread: 780, rating: "CCC", debtGDP: 85, reserves: "$28B", imfProgram: true },
  { country: "Kenya", probability: 22, spread: 620, rating: "B", debtGDP: 71, reserves: "$6.9B", imfProgram: true },
];

function riskColor(r: string) {
  return r === "CRITICAL" ? "#ef4444" : r === "HIGH" ? "#f59e0b" : r === "MEDIUM" ? "#3b82f6" : "#10b981";
}

function stabilityColor(score: number) {
  return score >= 60 ? "#10b981" : score >= 40 ? "#f59e0b" : score >= 25 ? "#f97316" : "#ef4444";
}

function defaultColor(prob: number) {
  return prob >= 50 ? "#ef4444" : prob >= 30 ? "#f59e0b" : prob >= 15 ? "#3b82f6" : "#10b981";
}

export default function PoliticalRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">🏛️</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#ef4444" }}>POLITICAL RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · POLITICAL</span>
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
        {tab === "elections" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_70px_80px_80px_100px_80px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Country</span><span>Date</span><span>Type</span><span>Inc. Risk</span><span>Market Impact</span><span className="text-right">Vol. Prem</span><span className="text-right">Populist %</span>
            </div>
            {ELECTIONS.map((e, i) => (
              <div key={i} className="grid grid-cols-[100px_70px_80px_80px_100px_80px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{e.country}</span>
                <span className="text-[10px] font-mono text-cyan-400">{e.date}</span>
                <span className="text-[10px] font-mono text-slate-400">{e.type}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: riskColor(e.incumbentRisk), background: `${riskColor(e.incumbentRisk)}15` }}>{e.incumbentRisk}</span>
                <span className="text-[10px] font-mono text-amber-300">{e.marketImpact}</span>
                <span className="text-[10px] font-mono text-right" style={{ color: "#ef4444", fontVariantNumeric: "tabular-nums" }}>{e.volatilityPremium}</span>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${e.populistThreat}%`, background: e.populistThreat > 50 ? "#ef4444" : e.populistThreat > 35 ? "#f59e0b" : "#10b981" }} />
                  </div>
                  <span className="text-[10px] font-mono" style={{ fontVariantNumeric: "tabular-nums", color: e.populistThreat > 50 ? "#ef4444" : "#64748b" }}>{e.populistThreat}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "regime" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_70px_60px_60px_60px_60px_100px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Country</span><span className="text-right">Score</span><span className="text-right">Trend</span><span className="text-right">Protest</span><span className="text-right">Press</span><span className="text-right">CPI</span><span>Category</span>
            </div>
            {REGIME_STABILITY.map((r, i) => (
              <div key={i} className="grid grid-cols-[100px_70px_60px_60px_60px_60px_100px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{r.country}</span>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: stabilityColor(r.score) }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: stabilityColor(r.score), fontVariantNumeric: "tabular-nums" }}>{r.score}</span>
                </div>
                <span className="text-[10px] font-mono text-right" style={{ color: r.trend < 0 ? "#ef4444" : "#10b981", fontVariantNumeric: "tabular-nums" }}>{r.trend > 0 ? "+" : ""}{r.trend}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{r.protests}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{r.freePress}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{r.corruption}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ color: r.category === "CONFLICT" ? "#ef4444" : r.category === "UNSTABLE" ? "#f59e0b" : r.category === "FRAGILE" ? "#3b82f6" : "#a855f7",
                    background: r.category === "CONFLICT" ? "#ef444415" : r.category === "UNSTABLE" ? "#f59e0b15" : r.category === "FRAGILE" ? "#3b82f615" : "#a855f715" }}>
                  {r.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "sanctions" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_60px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Target</span><span>Sectors</span><span>Imposed By</span><span>Since</span><span>Impact</span><span className="text-right">Compl %</span>
            </div>
            {SANCTIONS.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px_80px_60px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.target}</span>
                <span className="text-[10px] font-mono text-slate-400">{s.sectors}</span>
                <span className="text-[10px] font-mono text-cyan-400">{s.imposedBy}</span>
                <span className="text-[10px] font-mono text-slate-500">{s.since}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ color: s.impact === "TOTAL" || s.impact === "SEVERE" ? "#ef4444" : s.impact === "HIGH" ? "#f59e0b" : "#3b82f6",
                    background: s.impact === "TOTAL" || s.impact === "SEVERE" ? "#ef444415" : s.impact === "HIGH" ? "#f59e0b15" : "#3b82f615" }}>
                  {s.impact}
                </span>
                <span className="text-[10px] font-mono text-right" style={{ color: s.compliance >= 85 ? "#10b981" : s.compliance >= 70 ? "#f59e0b" : "#ef4444", fontVariantNumeric: "tabular-nums" }}>{s.compliance}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "sovereign" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_70px_80px_60px_80px_70px_60px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Country</span><span className="text-right">Def. Prob</span><span className="text-right">Spread</span><span>Rating</span><span className="text-right">Debt/GDP</span><span className="text-right">Reserves</span><span>IMF</span>
            </div>
            {SOVEREIGN_DEFAULT.map((s, i) => (
              <div key={i} className="grid grid-cols-[100px_70px_80px_60px_80px_70px_60px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.country}</span>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.probability}%`, background: defaultColor(s.probability) }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: defaultColor(s.probability), fontVariantNumeric: "tabular-nums" }}>{s.probability}%</span>
                </div>
                <span className="text-[10px] font-mono text-right text-amber-400" style={{ fontVariantNumeric: "tabular-nums" }}>{s.spread} bps</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: s.rating.includes("SD") ? "#ef4444" : s.rating.includes("CCC") ? "#f59e0b" : "#3b82f6" }}>{s.rating}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{s.debtGDP}%</span>
                <span className="text-[10px] font-mono text-right text-slate-400">{s.reserves}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: s.imfProgram ? "#10b981" : "#64748b" }}>{s.imfProgram ? "YES" : "NO"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
