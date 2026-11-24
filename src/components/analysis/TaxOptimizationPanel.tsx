"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "harvest" | "lots" | "wash" | "planning";

export default function TaxOptimizationPanel() {
  const [tab, setTab] = useState<Tab>("harvest");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🧾</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>TAX OPTIMIZATION</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg TAX</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["harvest", "lots", "wash", "planning"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "harvest" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TAX-LOSS HARVESTING OPPORTUNITIES</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "YTD Realized Gains", value: "$2.85M", color: "#ef4444" },
                { label: "Available Losses", value: "$1.42M", color: "#22c55e" },
                { label: "Net Tax Savings", value: "$485K", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {[
              { ticker: "PYPL", loss: -185000, basis: 85.20, current: 62.40, shares: 8500, substitute: "SQ", trackErr: 0.15 },
              { ticker: "DIS", loss: -125000, basis: 108.50, current: 92.80, shares: 7800, substitute: "CMCSA", trackErr: 0.22 },
              { ticker: "BABA", loss: -210000, basis: 142.00, current: 78.50, shares: 3200, substitute: "JD", trackErr: 0.35 },
              { ticker: "INTC", loss: -98000, basis: 42.80, current: 28.50, shares: 6800, substitute: "AMD", trackErr: 0.28 },
              { ticker: "BA", loss: -152000, basis: 225.00, current: 178.50, shares: 3200, substitute: "LMT", trackErr: 0.42 },
            ].map(h => (
              <div key={h.ticker} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{h.ticker}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{h.shares.toLocaleString()} shares</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>
                    ${Math.abs(h.loss).toLocaleString()} harvestable
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Basis:</span> <span className="font-mono">${h.basis}</span></div>
                  <div><span style={{ color: "#64748b" }}>Current:</span> <span className="font-mono" style={{ color: "#ef4444" }}>${h.current}</span></div>
                  <div><span style={{ color: "#64748b" }}>Swap to:</span> <span className="font-mono" style={{ color: "#00e5a0" }}>{h.substitute}</span></div>
                  <div><span style={{ color: "#64748b" }}>TE:</span> <span className="font-mono">{h.trackErr}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "lots" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TAX LOT ANALYSIS — AAPL</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Date", "Shares", "Basis", "Current", "Gain/Loss", "Term", "Tax Rate"].map(h => (
                      <th key={h} className="px-2 py-1.5 text-right first:text-left" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "Mar 2022", shares: 500, basis: 165.20, current: 232.50, gl: 33650, term: "LTCG", rate: 20 },
                    { date: "Aug 2022", shares: 300, basis: 172.80, current: 232.50, gl: 17910, term: "LTCG", rate: 20 },
                    { date: "Jan 2023", shares: 400, basis: 142.50, current: 232.50, gl: 36000, term: "LTCG", rate: 20 },
                    { date: "Jun 2024", shares: 200, basis: 195.80, current: 232.50, gl: 7340, term: "LTCG", rate: 20 },
                    { date: "Mar 2026", shares: 350, basis: 218.50, current: 232.50, gl: 4900, term: "LTCG", rate: 20 },
                    { date: "Sep 2026", shares: 150, basis: 228.90, current: 232.50, gl: 540, term: "STCG", rate: 37 },
                  ].map(l => (
                    <tr key={l.date} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5" style={{ color: "#38bdf8" }}>{l.date}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{l.shares}</td>
                      <td className="px-2 py-1.5 text-right font-mono">${l.basis}</td>
                      <td className="px-2 py-1.5 text-right font-mono">${l.current}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: l.gl >= 0 ? "#22c55e" : "#ef4444" }}>
                        ${l.gl.toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <span className="px-1 py-0.5 rounded text-[7px]" style={{
                          background: l.term === "LTCG" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                          color: l.term === "LTCG" ? "#22c55e" : "#ef4444",
                        }}>{l.term}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono">{l.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "wash" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WASH SALE MONITOR</div>
            <div className="p-3 rounded" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="text-[9px] font-bold mb-1" style={{ color: "#ef4444" }}>IRS WASH SALE RULE (30-DAY WINDOW)</div>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>Loss disallowed if substantially identical security purchased 30 days before or after the sale. Applies across all accounts including IRAs and spouse accounts.</div>
            </div>

            {[
              { ticker: "TSLA", soldDate: "Nov 5", boughtDate: "Nov 22", daysGap: 17, loss: -42000, status: "DISALLOWED", risk: "Same security repurchased within 30d" },
              { ticker: "META", soldDate: "Oct 28", boughtDate: null, daysGap: null, loss: -28500, status: "SAFE", risk: "30-day window expires Nov 27" },
              { ticker: "AMZN", soldDate: "Nov 10", boughtDate: null, daysGap: null, loss: -18200, status: "CAUTION", risk: "14 days remaining — do not repurchase before Dec 10" },
              { ticker: "GOOGL", soldDate: "Nov 15", boughtDate: null, daysGap: null, loss: -35800, status: "CAUTION", risk: "19 days remaining — do not repurchase before Dec 15" },
            ].map(w => (
              <div key={w.ticker} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${w.status === "DISALLOWED" ? "rgba(239,68,68,0.3)" : w.status === "CAUTION" ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)"}`,
              }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: w.status === "DISALLOWED" ? "rgba(239,68,68,0.15)" : w.status === "CAUTION" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                      color: w.status === "DISALLOWED" ? "#ef4444" : w.status === "CAUTION" ? "#fbbf24" : "#22c55e",
                    }}>{w.status}</span>
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{w.ticker}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#ef4444" }}>${Math.abs(w.loss).toLocaleString()}</span>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{w.risk}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "planning" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>YEAR-END TAX PLANNING</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Estimated Federal Tax", value: "$1.28M", color: "#ef4444" },
                { label: "State Tax (CA)", value: "$425K", color: "#ef4444" },
                { label: "NIIT (3.8%)", value: "$108K", color: "#ef4444" },
                { label: "Potential Savings", value: "$485K", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>OPTIMIZATION STRATEGIES</div>
            {[
              { strategy: "Tax-Loss Harvesting", savings: "$285K", priority: "HIGH", deadline: "Dec 31", action: "Sell 5 positions with unrealized losses, substitute with similar ETFs" },
              { strategy: "Charitable Giving (Appreciated Stock)", savings: "$95K", priority: "HIGH", deadline: "Dec 31", action: "Donate $500K of AAPL shares (basis $165) to DAF" },
              { strategy: "Qualified Opportunity Zone", savings: "$42K", priority: "MEDIUM", deadline: "Dec 31", action: "Reinvest $850K capital gains into QOZ fund" },
              { strategy: "Roth Conversion", savings: "$28K", priority: "LOW", deadline: "Dec 31", action: "Convert $200K Traditional IRA — pay tax now at lower bracket" },
              { strategy: "STCG to LTCG Conversion", savings: "$35K", priority: "MEDIUM", deadline: "Mar 2027", action: "Hold 3 positions until LTCG qualification — 2-5 weeks away" },
            ].map(s => (
              <div key={s.strategy} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                      background: s.priority === "HIGH" ? "rgba(239,68,68,0.15)" : s.priority === "MEDIUM" ? "rgba(251,191,36,0.15)" : "rgba(100,116,139,0.15)",
                      color: s.priority === "HIGH" ? "#ef4444" : s.priority === "MEDIUM" ? "#fbbf24" : "#64748b",
                    }}>{s.priority}</span>
                    <span className="font-bold">{s.strategy}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{s.savings}</span>
                </div>
                <div className="text-[9px] mb-0.5" style={{ color: "#94a3b8" }}>{s.action}</div>
                <div className="text-[8px]" style={{ color: "#64748b" }}>Deadline: {s.deadline}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
