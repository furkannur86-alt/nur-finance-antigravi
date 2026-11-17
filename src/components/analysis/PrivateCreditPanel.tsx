"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const DEALS = [
  { borrower: "Acme Software Inc.", sector: "Technology", type: "Term Loan B", size: 450, spread: 575, floor: 100, maturity: "2031-06", rating: "B+", leverage: 5.2, coverage: 2.1, status: "FUNDED" },
  { borrower: "MedTech Solutions", sector: "Healthcare", type: "Unitranche", size: 280, spread: 625, floor: 75, maturity: "2030-09", rating: "B", leverage: 5.8, coverage: 1.8, status: "FUNDED" },
  { borrower: "DataFlow Analytics", sector: "Technology", type: "Delayed Draw TL", size: 150, spread: 550, floor: 100, maturity: "2031-03", rating: "B+", leverage: 4.9, coverage: 2.3, status: "COMMITTED" },
  { borrower: "Pacific Logistics Co.", sector: "Industrials", type: "Revolver", size: 75, spread: 500, floor: 50, maturity: "2029-12", rating: "BB-", leverage: 4.2, coverage: 2.8, status: "FUNDED" },
  { borrower: "NexGen Pharma", sector: "Healthcare", type: "Unitranche", size: 520, spread: 650, floor: 100, maturity: "2031-09", rating: "B-", leverage: 6.1, coverage: 1.5, status: "IN MARKET" },
  { borrower: "CloudSec Corp.", sector: "Technology", type: "Term Loan A", size: 320, spread: 475, floor: 75, maturity: "2030-06", rating: "BB-", leverage: 4.5, coverage: 2.5, status: "FUNDED" },
  { borrower: "Green Energy Partners", sector: "Energy", type: "Unitranche", size: 680, spread: 600, floor: 100, maturity: "2032-03", rating: "B", leverage: 5.5, coverage: 1.9, status: "IN MARKET" },
  { borrower: "RetailMax Holdings", sector: "Consumer", type: "Second Lien", size: 200, spread: 850, floor: 150, maturity: "2032-06", rating: "CCC+", leverage: 7.2, coverage: 1.2, status: "WATCHLIST" },
];

type Tab = "pipeline" | "portfolio" | "market";

export default function PrivateCreditPanel() {
  const [tab, setTab] = useState<Tab>("pipeline");

  const totalFunded = DEALS.filter(d => d.status === "FUNDED").reduce((s, d) => s + d.size, 0);
  const avgSpread = DEALS.reduce((s, d) => s + d.spread, 0) / DEALS.length;
  const avgLeverage = DEALS.reduce((s, d) => s + d.leverage, 0) / DEALS.length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PRIVATE CREDIT</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Direct Lending</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["pipeline", "portfolio", "market"] as Tab[]).map(t => (
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
          { label: "FUNDED AUM", value: `$${(totalFunded / 1000).toFixed(1)}B`, color: "#22c55e" },
          { label: "AVG SPREAD", value: `S+${avgSpread.toFixed(0)}bp`, color: "#fbbf24" },
          { label: "AVG LEVERAGE", value: `${avgLeverage.toFixed(1)}x`, color: "#38bdf8" },
          { label: "PIPELINE", value: `$${(DEALS.filter(d => d.status === "IN MARKET").reduce((s, d) => s + d.size, 0))}M`, color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "pipeline" && (
          <div className="space-y-2">
            {DEALS.map((d, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{d.borrower}</span>
                    <span className="ml-2 text-[9px]" style={{ color: "#64748b" }}>{d.sector}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ background: d.status === "FUNDED" ? "rgba(34,197,94,0.15)" : d.status === "IN MARKET" ? "rgba(56,189,248,0.15)" : d.status === "WATCHLIST" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                             color: d.status === "FUNDED" ? "#22c55e" : d.status === "IN MARKET" ? "#38bdf8" : d.status === "WATCHLIST" ? "#ef4444" : "#fbbf24" }}>
                    {d.status}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Type:</span> <span style={{ color: "#e2e8f0" }}>{d.type}</span></div>
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono" style={{ color: "#e2e8f0" }}>${d.size}M</span></div>
                  <div><span style={{ color: "#64748b" }}>Spread:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>S+{d.spread}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rating:</span> <span style={{ color: d.rating.startsWith("C") ? "#ef4444" : "#e2e8f0" }}>{d.rating}</span></div>
                  <div><span style={{ color: "#64748b" }}>Leverage:</span> <span className="font-mono" style={{ color: d.leverage > 6 ? "#ef4444" : "#e2e8f0" }}>{d.leverage}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Coverage:</span> <span className="font-mono" style={{ color: d.coverage < 1.5 ? "#ef4444" : "#22c55e" }}>{d.coverage}x</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "portfolio" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR ALLOCATION</div>
            {["Technology", "Healthcare", "Industrials", "Energy", "Consumer"].map(sector => {
              const sectorDeals = DEALS.filter(d => d.sector === sector);
              const sectorSize = sectorDeals.reduce((s, d) => s + d.size, 0);
              const pct = (sectorSize / DEALS.reduce((s, d) => s + d.size, 0)) * 100;
              return (
                <div key={sector} className="flex items-center gap-2">
                  <span className="w-24" style={{ color: "#94a3b8" }}>{sector}</span>
                  <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#00e5a0" }} />
                  </div>
                  <span className="font-mono w-12 text-right" style={{ color: "#e2e8f0" }}>{pct.toFixed(1)}%</span>
                  <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>${sectorSize}M</span>
                </div>
              );
            })}

            <div className="text-[9px] font-bold mt-4" style={{ color: "#fbbf24" }}>RATING DISTRIBUTION</div>
            {["BB-", "B+", "B", "B-", "CCC+"].map(rating => {
              const count = DEALS.filter(d => d.rating === rating).length;
              return (
                <div key={rating} className="flex items-center gap-2 text-[9px]">
                  <span className="w-12 font-mono" style={{ color: "#94a3b8" }}>{rating}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / DEALS.length) * 100}%`, background: rating.startsWith("C") ? "#ef4444" : "#38bdf8" }} />
                  </div>
                  <span className="font-mono w-6 text-right" style={{ color: "#64748b" }}>{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PRIVATE CREDIT MARKET SNAPSHOT</div>
            {[
              { metric: "Total Market Size", value: "$1.7T", change: "+18% YoY", color: "#22c55e" },
              { metric: "Avg New Deal Spread", value: "S+575bp", change: "+25bp QoQ", color: "#fbbf24" },
              { metric: "Default Rate (12m)", value: "2.8%", change: "+0.4pp YoY", color: "#ef4444" },
              { metric: "Recovery Rate", value: "62%", change: "-3pp YoY", color: "#38bdf8" },
              { metric: "Dry Powder", value: "$420B", change: "+12% QoQ", color: "#a855f7" },
              { metric: "BSL/Private Spread Gap", value: "125bp", change: "-15bp QoQ", color: "#06b6d4" },
              { metric: "Avg Leverage (New Deals)", value: "5.4x", change: "+0.2x YoY", color: "#fbbf24" },
              { metric: "Covenant-Lite %", value: "72%", change: "+5pp YoY", color: "#ef4444" },
            ].map(m => (
              <div key={m.metric} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ color: "#94a3b8" }}>{m.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
