"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TABS = [
  { id: "systemic", label: "Systemic Risk", icon: "🏦" },
  { id: "contagion", label: "Contagion Map", icon: "🔗" },
  { id: "liquidity", label: "Liquidity Stress", icon: "💧" },
  { id: "stability", label: "Financial Stability", icon: "🛡️" },
];

const SYSTEMIC_INDICATORS = [
  { name: "SRISK (Global Banks)", value: "$2.14T", change: 8.3, severity: "HIGH", desc: "Capital shortfall in a crisis" },
  { name: "CoVaR (95th pctl)", value: "-4.72%", change: -1.1, severity: "CRITICAL", desc: "Conditional value-at-risk spillover" },
  { name: "DTCC Netting Ratio", value: "97.8%", change: 0.2, severity: "LOW", desc: "Clearing efficiency" },
  { name: "TED Spread", value: "42 bps", change: 6.0, severity: "MEDIUM", desc: "Interbank lending stress" },
  { name: "MOVE Index", value: "118.4", change: 3.7, severity: "MEDIUM", desc: "Bond market volatility" },
  { name: "VIX Term Structure", value: "Backwardation", change: 0, severity: "HIGH", desc: "Near-term fear elevated" },
  { name: "Credit Impulse (G7)", value: "-1.8% GDP", change: -0.4, severity: "MEDIUM", desc: "Credit growth deceleration" },
  { name: "Global Margin Debt", value: "$891B", change: 12.4, severity: "HIGH", desc: "Leveraged positions" },
];

const CONTAGION = [
  { from: "US Banks", to: "EU Banks", correlation: 0.87, channel: "Interbank lending", stress: "HIGH" },
  { from: "China Property", to: "EM Bonds", correlation: 0.72, channel: "Capital flight", stress: "CRITICAL" },
  { from: "Japan Rates", to: "FX Carry", correlation: 0.91, channel: "Yen carry unwind", stress: "HIGH" },
  { from: "Oil Markets", to: "GCC Sovereign", correlation: 0.84, channel: "Fiscal linkage", stress: "MEDIUM" },
  { from: "Tech Sector", to: "VC / PE", correlation: 0.78, channel: "Valuation repricing", stress: "MEDIUM" },
  { from: "EU Periphery", to: "ECB Balance Sheet", correlation: 0.69, channel: "Sovereign debt", stress: "MEDIUM" },
  { from: "Crypto Markets", to: "Stablecoin Reserves", correlation: 0.93, channel: "Redemption risk", stress: "HIGH" },
];

const LIQUIDITY = [
  { market: "US Treasuries", bidAsk: "0.8 bps", depth: "$480M", resilience: 92, status: "NORMAL" },
  { market: "Corporate IG", bidAsk: "3.2 bps", depth: "$120M", resilience: 78, status: "TIGHT" },
  { market: "Corporate HY", bidAsk: "12.5 bps", depth: "$45M", resilience: 54, status: "STRESSED" },
  { market: "EM Sovereign", bidAsk: "8.1 bps", depth: "$85M", resilience: 63, status: "TIGHT" },
  { market: "FX G10", bidAsk: "0.2 pips", depth: "$2.1B", resilience: 96, status: "NORMAL" },
  { market: "FX EM", bidAsk: "4.8 pips", depth: "$180M", resilience: 71, status: "TIGHT" },
  { market: "S&P 500 Futures", bidAsk: "0.25 pts", depth: "$890M", resilience: 94, status: "NORMAL" },
  { market: "Bitcoin / USD", bidAsk: "$18.50", depth: "$340M", resilience: 81, status: "NORMAL" },
];

const STABILITY = [
  { indicator: "Basel III CET1 (G-SIBs)", value: "13.4%", threshold: ">10.5%", status: "PASS", trend: 0.3 },
  { indicator: "Leverage Ratio (Median)", value: "5.8%", threshold: ">3%", status: "PASS", trend: -0.1 },
  { indicator: "NSFR (Net Stable Funding)", value: "118%", threshold: ">100%", status: "PASS", trend: 1.2 },
  { indicator: "LCR (Liquidity Coverage)", value: "142%", threshold: ">100%", status: "PASS", trend: -2.4 },
  { indicator: "NPL Ratio (Global Avg)", value: "3.1%", threshold: "<5%", status: "PASS", trend: 0.4 },
  { indicator: "Shadow Banking Assets", value: "$68.2T", threshold: "Monitor", status: "WATCH", trend: 4.8 },
  { indicator: "Derivatives Notional", value: "$632T", threshold: "Monitor", status: "WATCH", trend: 2.1 },
  { indicator: "Household Debt/GDP (G7)", value: "78.3%", threshold: "<80%", status: "PASS", trend: 1.6 },
];

function severityColor(s: string) {
  return s === "CRITICAL" ? "#ef4444" : s === "HIGH" ? "#f59e0b" : s === "MEDIUM" ? "#3b82f6" : "#10b981";
}

function statusColor(s: string) {
  return s === "PASS" ? "#10b981" : s === "WATCH" ? "#f59e0b" : s === "FAIL" ? "#ef4444" : "#64748b";
}

function resilienceColor(r: number) {
  return r >= 85 ? "#10b981" : r >= 65 ? "#f59e0b" : "#ef4444";
}

export default function FinancialRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">💰</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#ef4444" }}>FINANCIAL RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · FINANCIAL</span>
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
        {tab === "systemic" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_100px_80px_80px_1fr] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Indicator</span><span className="text-right">Value</span><span className="text-right">Change</span><span>Severity</span><span>Description</span>
            </div>
            {SYSTEMIC_INDICATORS.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_80px_80px_1fr] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.name}</span>
                <span className="text-[10px] font-mono text-right font-bold text-slate-100" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                <span className="text-[10px] font-mono text-right" style={{ color: s.change > 0 ? "#ef4444" : s.change < 0 ? "#10b981" : "#64748b", fontVariantNumeric: "tabular-nums" }}>
                  {s.change > 0 ? "+" : ""}{s.change !== 0 ? `${s.change}%` : "—"}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: severityColor(s.severity), background: `${severityColor(s.severity)}15` }}>{s.severity}</span>
                <span className="text-[9px] font-mono text-slate-500">{s.desc}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "contagion" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_1fr_80px_140px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Source</span><span>Target</span><span className="text-right">Corr.</span><span>Channel</span><span>Stress</span>
            </div>
            {CONTAGION.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_140px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-orange-300">{c.from}</span>
                <span className="text-[11px] font-mono text-cyan-300">{c.to}</span>
                <span className="text-[10px] font-mono text-right font-bold" style={{ color: c.correlation >= 0.85 ? "#ef4444" : c.correlation >= 0.75 ? "#f59e0b" : "#3b82f6", fontVariantNumeric: "tabular-nums" }}>{c.correlation.toFixed(2)}</span>
                <span className="text-[10px] font-mono text-slate-400">{c.channel}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: severityColor(c.stress), background: `${severityColor(c.stress)}15` }}>{c.stress}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "liquidity" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_80px_100px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Market</span><span className="text-right">Bid/Ask</span><span className="text-right">Depth</span><span className="text-right">Resilience</span><span>Status</span>
            </div>
            {LIQUIDITY.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_80px_100px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{l.market}</span>
                <span className="text-[10px] font-mono text-right text-slate-300" style={{ fontVariantNumeric: "tabular-nums" }}>{l.bidAsk}</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{l.depth}</span>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${l.resilience}%`, background: resilienceColor(l.resilience) }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: resilienceColor(l.resilience), fontVariantNumeric: "tabular-nums" }}>{l.resilience}</span>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ color: l.status === "NORMAL" ? "#10b981" : l.status === "TIGHT" ? "#f59e0b" : "#ef4444",
                    background: l.status === "NORMAL" ? "#10b98115" : l.status === "TIGHT" ? "#f59e0b15" : "#ef444415" }}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "stability" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_100px_60px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Indicator</span><span className="text-right">Value</span><span>Threshold</span><span>Status</span><span className="text-right">Trend</span>
            </div>
            {STABILITY.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_60px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.indicator}</span>
                <span className="text-[10px] font-mono text-right font-bold text-slate-100" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                <span className="text-[10px] font-mono text-slate-500">{s.threshold}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: statusColor(s.status), background: `${statusColor(s.status)}15` }}>{s.status}</span>
                <span className="text-[10px] font-mono text-right" style={{ color: s.trend > 0 ? "#f59e0b" : "#10b981", fontVariantNumeric: "tabular-nums" }}>
                  {s.trend > 0 ? "+" : ""}{s.trend.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
