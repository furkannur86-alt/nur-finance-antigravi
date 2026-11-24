"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "filings" | "holders" | "activists" | "insiders";

export default function InstitutionalOwnershipPanel() {
  const [tab, setTab] = useState<Tab>("filings");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏛️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INSTITUTIONAL OWNERSHIP</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg 13F</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["filings", "holders", "activists", "insiders"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "filings" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATEST 13F FILINGS</div>
            {[
              { filer: "Berkshire Hathaway", date: "Nov 14", aum: "$312B", changes: 8, top: "AAPL 28.9%", action: "Reduced OXY" },
              { filer: "Bridgewater Associates", date: "Nov 14", aum: "$15.8B", changes: 42, top: "SPY 8.2%", action: "New NVDA pos" },
              { filer: "Renaissance Tech", date: "Nov 14", aum: "$68B", changes: 285, top: "Various", action: "Rotated tech" },
              { filer: "Citadel Advisors", date: "Nov 14", aum: "$58B", changes: 520, top: "SPY opts", action: "Increased AI" },
              { filer: "Soros Fund Mgmt", date: "Nov 14", aum: "$5.5B", changes: 18, top: "RIVN 12%", action: "New AI bets" },
            ].map(f => (
              <div key={f.filer} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.filer}</span>
                  <span className="font-mono" style={{ color: "#00e5a0" }}>{f.aum}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Filed:</span> <span>{f.date}</span></div>
                  <div><span style={{ color: "#64748b" }}>Changes:</span> <span className="font-mono">{f.changes}</span></div>
                  <div><span style={{ color: "#64748b" }}>Top:</span> <span className="font-mono">{f.top}</span></div>
                  <div><span style={{ color: "#fbbf24" }}>{f.action}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "holders" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP INSTITUTIONAL HOLDERS — NVDA</div>
            {[
              { holder: "Vanguard Group", shares: "225.8M", pct: 9.2, value: "$32.3B", change: "Increased" },
              { holder: "BlackRock", shares: "198.5M", pct: 8.1, value: "$28.4B", change: "Increased" },
              { holder: "State Street", shares: "112.2M", pct: 4.6, value: "$16.0B", change: "Unchanged" },
              { holder: "Fidelity (FMR)", shares: "95.8M", pct: 3.9, value: "$13.7B", change: "Increased" },
              { holder: "T. Rowe Price", shares: "58.5M", pct: 2.4, value: "$8.4B", change: "Decreased" },
              { holder: "Capital Research", shares: "52.2M", pct: 2.1, value: "$7.5B", change: "New" },
              { holder: "Geode Capital", shares: "48.8M", pct: 2.0, value: "$7.0B", change: "Increased" },
            ].map(h => (
              <div key={h.holder} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{h.holder}</span>
                <span className="font-mono w-16 text-right">{h.shares}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#a78bfa" }}>{h.pct}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#fbbf24" }}>{h.value}</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: h.change === "Increased" || h.change === "New" ? "rgba(34,197,94,0.1)" : h.change === "Decreased" ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)",
                  color: h.change === "Increased" || h.change === "New" ? "#22c55e" : h.change === "Decreased" ? "#ef4444" : "#64748b",
                }}>{h.change}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "activists" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVIST POSITIONS — ACTIVE CAMPAIGNS</div>
            {[
              { activist: "Elliott Management", target: "SWK", stake: "5.2%", campaign: "Board seats, cost cuts", status: "Active", filed: "Oct 2024" },
              { activist: "Starboard Value", target: "PFIZER", stake: "1.0B", campaign: "Strategic review", status: "New", filed: "Nov 2024" },
              { activist: "Third Point", target: "BATH", stake: "3.8%", campaign: "Spinoff division", status: "Active", filed: "Sep 2024" },
              { activist: "Icahn Enterprises", target: "JCI", stake: "2.1%", campaign: "Board representation", status: "Settled", filed: "Aug 2024" },
            ].map(a => (
              <div key={a.target} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{a.activist}</span>
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{a.target}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: a.status === "Active" ? "rgba(239,68,68,0.15)" : a.status === "New" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                    color: a.status === "Active" ? "#ef4444" : a.status === "New" ? "#fbbf24" : "#22c55e",
                  }}>{a.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Stake:</span> <span className="font-mono">{a.stake}</span></div>
                  <div><span style={{ color: "#64748b" }}>Filed:</span> <span>{a.filed}</span></div>
                  <div><span style={{ color: "#fbbf24" }}>{a.campaign}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "insiders" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>INSIDER TRANSACTIONS — LATEST</div>
            {[
              { date: "Nov 22", insider: "Jensen Huang", company: "NVDA", title: "CEO", type: "Sale", shares: "120K", value: "$17.1M", price: "$142.50" },
              { date: "Nov 21", insider: "Tim Cook", company: "AAPL", title: "CEO", type: "Sale", shares: "50K", value: "$9.6M", price: "$192.00" },
              { date: "Nov 20", insider: "Jamie Dimon", company: "JPM", title: "CEO", type: "Sale", shares: "80K", value: "$18.4M", price: "$230.00" },
              { date: "Nov 19", insider: "Satya Nadella", company: "MSFT", title: "CEO", type: "Sale", shares: "25K", value: "$10.7M", price: "$428.00" },
              { date: "Nov 18", insider: "Lisa Su", company: "AMD", title: "CEO", type: "Purchase", shares: "15K", value: "$2.4M", price: "$160.00" },
              { date: "Nov 15", insider: "Mark Cuban", company: "COST", title: "Director", type: "Purchase", shares: "5K", value: "$4.5M", price: "$900.00" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono text-[9px] w-14" style={{ color: "#64748b" }}>{t.date}</span>
                <span className="w-28 truncate">{t.insider}</span>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{t.company}</span>
                <span className="text-[8px] w-10" style={{ color: "#64748b" }}>{t.title}</span>
                <span className="font-mono w-10" style={{ color: t.type === "Purchase" ? "#22c55e" : "#ef4444" }}>{t.type === "Purchase" ? "BUY" : "SELL"}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#fbbf24" }}>{t.value}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{t.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
