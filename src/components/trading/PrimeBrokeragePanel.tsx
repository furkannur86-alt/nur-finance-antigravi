"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "margin" | "lending" | "locates" | "financing";

export default function PrimeBrokeragePanel() {
  const [tab, setTab] = useState<Tab>("margin");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PRIME BROKERAGE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg PB</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["margin", "lending", "locates", "financing"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "margin" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MARGIN SUMMARY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Net Equity", value: "$245.8M", color: "#00e5a0" },
                { label: "Margin Used", value: "$182.5M", color: "#fbbf24" },
                { label: "Available", value: "$63.3M", color: "#22c55e" },
                { label: "Margin Ratio", value: "74.3%", color: "#fbbf24" },
              ].map(m => (
                <div key={m.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MARGIN BY STRATEGY</div>
            {[
              { strategy: "Long Equity", exposure: "$285M", margin: "$85.5M", pct: 46.9 },
              { strategy: "Short Equity", exposure: "$120M", margin: "$48.0M", pct: 26.3 },
              { strategy: "Options Book", exposure: "$65M", margin: "$28.5M", pct: 15.6 },
              { strategy: "Fixed Income", exposure: "$180M", margin: "$12.5M", pct: 6.8 },
              { strategy: "FX Hedges", exposure: "$95M", margin: "$8.0M", pct: 4.4 },
            ].map(s => (
              <div key={s.strategy} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24">{s.strategy}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{s.exposure}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#fbbf24" }}>{s.margin}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: "rgba(0,229,160,0.4)" }} />
                </div>
                <span className="font-mono w-10 text-right text-[9px]" style={{ color: "#64748b" }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "lending" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECURITIES LENDING — ACTIVE BORROWS</div>
            {[
              { ticker: "TSLA", shares: "50,000", rate: "0.85%", value: "$12.5M", days: 45, type: "GC" },
              { ticker: "GME", shares: "25,000", rate: "18.5%", value: "$625K", days: 12, type: "Hard" },
              { ticker: "SMCI", shares: "15,000", rate: "12.2%", value: "$525K", days: 8, type: "Hard" },
              { ticker: "NVDA", shares: "80,000", rate: "0.30%", value: "$11.4M", days: 90, type: "GC" },
              { ticker: "MSTR", shares: "10,000", rate: "8.5%", value: "$3.8M", days: 22, type: "Special" },
            ].map(l => (
              <div key={l.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{l.ticker}</span>
                <span className="font-mono w-16 text-right">{l.shares}</span>
                <span className="font-mono w-12 text-right" style={{
                  color: parseFloat(l.rate) > 10 ? "#ef4444" : parseFloat(l.rate) > 5 ? "#fbbf24" : "#22c55e",
                }}>{l.rate}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{l.value}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{l.days}d</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: l.type === "Hard" ? "rgba(239,68,68,0.1)" : l.type === "Special" ? "rgba(251,191,36,0.1)" : "rgba(100,116,139,0.1)",
                  color: l.type === "Hard" ? "#ef4444" : l.type === "Special" ? "#fbbf24" : "#64748b",
                }}>{l.type}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "locates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LOCATE AVAILABILITY</div>
            {[
              { ticker: "TSLA", available: "2.5M", rate: "0.85%", ease: "Easy", utilization: 42 },
              { ticker: "GME", available: "85K", rate: "18.5%", ease: "Hard", utilization: 92 },
              { ticker: "SMCI", available: "120K", rate: "12.2%", ease: "Hard", utilization: 88 },
              { ticker: "NVDA", available: "8.2M", rate: "0.30%", ease: "Easy", utilization: 15 },
              { ticker: "MSTR", available: "180K", rate: "8.5%", ease: "Medium", utilization: 75 },
              { ticker: "AMC", available: "45K", rate: "22.0%", ease: "Very Hard", utilization: 95 },
              { ticker: "RIVN", available: "350K", rate: "5.2%", ease: "Medium", utilization: 62 },
            ].map(l => (
              <div key={l.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{l.ticker}</span>
                <span className="font-mono w-14 text-right">{l.available}</span>
                <span className="font-mono w-12 text-right" style={{
                  color: parseFloat(l.rate) > 10 ? "#ef4444" : parseFloat(l.rate) > 5 ? "#fbbf24" : "#22c55e",
                }}>{l.rate}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${l.utilization}%`,
                    background: l.utilization > 85 ? "rgba(239,68,68,0.5)" : l.utilization > 60 ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.4)",
                  }} />
                </div>
                <span className="font-mono w-8 text-right text-[9px]" style={{ color: "#64748b" }}>{l.utilization}%</span>
                <span className="text-[8px] w-16 text-right" style={{
                  color: l.ease.includes("Hard") ? "#ef4444" : l.ease === "Medium" ? "#fbbf24" : "#22c55e",
                }}>{l.ease}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "financing" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FINANCING RATES</div>
            {[
              { type: "Long Margin Rate", rate: "SOFR + 45bp", effective: "5.20%", benchmark: "SOFR 4.75%" },
              { type: "Short Credit Rate", rate: "SOFR - 25bp", effective: "4.50%", benchmark: "SOFR 4.75%" },
              { type: "Repo Rate (GC)", rate: "SOFR + 5bp", effective: "4.80%", benchmark: "SOFR 4.75%" },
              { type: "Term Financing (30d)", rate: "SOFR + 55bp", effective: "5.30%", benchmark: "SOFR 4.75%" },
              { type: "Swap Rate (1yr)", rate: "4.65%", effective: "4.65%", benchmark: "Treasury 4.52%" },
            ].map(f => (
              <div key={f.type} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.type}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{f.effective}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#64748b" }}>Spread: {f.rate}</span>
                  <span style={{ color: "#64748b" }}>Bench: {f.benchmark}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DAILY FINANCING COST</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Long Book", cost: "$41,200/day", color: "#ef4444" },
                { label: "Short Credit", cost: "-$14,800/day", color: "#22c55e" },
                { label: "Net Cost", cost: "$26,400/day", color: "#fbbf24" },
              ].map(c => (
                <div key={c.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{c.label}</div>
                  <div className="font-mono font-bold" style={{ color: c.color }}>{c.cost}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
