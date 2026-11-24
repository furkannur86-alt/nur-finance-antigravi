"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "deals" | "spreads" | "timeline" | "risk";

const DEALS = [
  { target: "Figma Inc", acquirer: "Adobe Systems", dealValue: "$20.0B", offerPrice: 348.00, currentPrice: 342.50, spread: 1.6, annSpread: 8.2, closingProb: 92, status: "REGULATORY", sector: "Tech", announced: "Sep 2026", expectedClose: "Q1 2027" },
  { target: "Activision Blizzard", acquirer: "Microsoft Corp", dealValue: "$68.7B", offerPrice: 95.00, currentPrice: 94.20, spread: 0.8, annSpread: 4.1, closingProb: 97, status: "APPROVED", sector: "Gaming", announced: "Jan 2026", expectedClose: "Dec 2026" },
  { target: "Albertsons Cos", acquirer: "Kroger Co", dealValue: "$24.6B", offerPrice: 34.10, currentPrice: 31.85, spread: 7.1, annSpread: 14.2, closingProb: 65, status: "CHALLENGED", sector: "Retail", announced: "Oct 2026", expectedClose: "Q2 2027" },
  { target: "iRobot Corp", acquirer: "Amazon.com", dealValue: "$1.7B", offerPrice: 61.00, currentPrice: 58.40, spread: 4.4, annSpread: 18.5, closingProb: 72, status: "REGULATORY", sector: "Consumer", announced: "Aug 2026", expectedClose: "Q1 2027" },
  { target: "Capri Holdings", acquirer: "Tapestry Inc", dealValue: "$8.5B", offerPrice: 57.00, currentPrice: 48.20, spread: 18.3, annSpread: 36.5, closingProb: 42, status: "LITIGATION", sector: "Luxury", announced: "Aug 2026", expectedClose: "TBD" },
  { target: "US Steel Corp", acquirer: "Nippon Steel", dealValue: "$14.1B", offerPrice: 55.00, currentPrice: 51.80, spread: 6.2, annSpread: 12.4, closingProb: 58, status: "POLITICAL", sector: "Materials", announced: "Dec 2025", expectedClose: "Q1 2027" },
  { target: "Hess Corp", acquirer: "Chevron Corp", dealValue: "$53.0B", offerPrice: 171.00, currentPrice: 168.50, spread: 1.5, annSpread: 6.0, closingProb: 88, status: "ARBITRATION", sector: "Energy", announced: "Oct 2025", expectedClose: "Q2 2027" },
];

export default function MergerArbitragePanel() {
  const [tab, setTab] = useState<Tab>("deals");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔀</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MERGER ARBITRAGE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg MA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["deals", "spreads", "timeline", "risk"] as Tab[]).map(t => (
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
          { label: "ACTIVE DEALS", value: "7", color: "#38bdf8" },
          { label: "AVG SPREAD", value: "5.7%", color: "#fbbf24" },
          { label: "AVG ANN. RETURN", value: "14.3%", color: "#22c55e" },
          { label: "DEAL VALUE", value: "$190.6B", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "deals" && (
          <div className="space-y-2">
            {DEALS.map(d => (
              <div key={d.target} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="font-bold" style={{ color: "#a855f7" }}>{d.target}</span>
                    <span style={{ color: "#64748b" }}> ← </span>
                    <span style={{ color: "#38bdf8" }}>{d.acquirer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{d.dealValue}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: d.status === "APPROVED" ? "rgba(34,197,94,0.15)" : d.status === "LITIGATION" || d.status === "CHALLENGED" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                      color: d.status === "APPROVED" ? "#22c55e" : d.status === "LITIGATION" || d.status === "CHALLENGED" ? "#ef4444" : "#fbbf24"
                    }}>{d.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Offer:</span> <span className="font-mono">${d.offerPrice.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Current:</span> <span className="font-mono">${d.currentPrice.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Spread:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{d.spread}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Ann:</span> <span className="font-mono font-bold" style={{ color: d.annSpread > 15 ? "#fbbf24" : "#22c55e" }}>{d.annSpread}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Close:</span> <span className="font-mono" style={{ color: d.closingProb > 80 ? "#22c55e" : d.closingProb > 60 ? "#fbbf24" : "#ef4444" }}>{d.closingProb}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Exp:</span> <span className="font-mono">{d.expectedClose}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "spreads" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEAL SPREAD VISUALIZATION</div>
            {DEALS.map(d => (
              <div key={d.target} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold truncate" style={{ color: "#a855f7" }}>{d.target}</span>
                <div className="flex-1 relative h-5 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0.5 bottom-0.5 left-0 rounded" style={{
                    width: `${Math.min(d.spread * 3, 100)}%`,
                    background: d.closingProb > 80 ? "rgba(34,197,94,0.4)" : d.closingProb > 60 ? "rgba(251,191,36,0.4)" : "rgba(239,68,68,0.4)"
                  }} />
                  <span className="absolute right-2 top-0.5 text-[8px] font-mono font-bold" style={{ color: "#e2e8f0" }}>{d.annSpread}% ann.</span>
                </div>
                <span className="font-mono w-12 text-right text-[9px]" style={{ color: d.closingProb > 80 ? "#22c55e" : d.closingProb > 60 ? "#fbbf24" : "#ef4444" }}>{d.closingProb}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>RISK-ADJUSTED RETURN RANKING</div>
            {[...DEALS].sort((a, b) => (b.annSpread * b.closingProb / 100) - (a.annSpread * a.closingProb / 100)).map((d, i) => (
              <div key={d.target} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-5 font-bold" style={{ color: "#64748b" }}>#{i + 1}</span>
                <span className="w-28 font-bold truncate">{d.target}</span>
                <span className="font-mono" style={{ color: "#22c55e" }}>{(d.annSpread * d.closingProb / 100).toFixed(1)}%</span>
                <span className="text-[8px]" style={{ color: "#64748b" }}>= {d.annSpread}% × {d.closingProb}% prob</span>
              </div>
            ))}
          </div>
        )}

        {tab === "timeline" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEAL TIMELINE & MILESTONES</div>
            {[
              { deal: "Figma / Adobe", events: [
                { date: "Sep 2026", event: "Deal announced", done: true },
                { date: "Oct 2026", event: "HSR filing", done: true },
                { date: "Nov 2026", event: "EU Phase I review", done: true },
                { date: "Dec 2026", event: "EU Phase II review", done: false },
                { date: "Q1 2027", event: "Expected closing", done: false },
              ]},
              { deal: "Albertsons / Kroger", events: [
                { date: "Oct 2026", event: "Deal announced", done: true },
                { date: "Nov 2026", event: "FTC challenge filed", done: true },
                { date: "Jan 2027", event: "Federal court hearing", done: false },
                { date: "Q2 2027", event: "Expected resolution", done: false },
              ]},
              { deal: "Capri / Tapestry", events: [
                { date: "Aug 2026", event: "Deal announced", done: true },
                { date: "Oct 2026", event: "FTC lawsuit filed", done: true },
                { date: "Nov 2026", event: "Injunction hearing", done: true },
                { date: "TBD", event: "Court ruling pending", done: false },
              ]},
            ].map(d => (
              <div key={d.deal} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="font-bold mb-2" style={{ color: "#a855f7" }}>{d.deal}</div>
                <div className="space-y-1">
                  {d.events.map(e => (
                    <div key={e.event} className="flex items-center gap-2 text-[9px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: e.done ? "#22c55e" : "#64748b", border: e.done ? "none" : "1px solid #64748b" }} />
                      <span className="font-mono w-16" style={{ color: "#64748b" }}>{e.date}</span>
                      <span style={{ color: e.done ? "#e2e8f0" : "#94a3b8" }}>{e.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEAL BREAK RISK ANALYSIS</div>
            {[
              { deal: "Capri / Tapestry", risk: "VERY HIGH", breakProb: 58, factors: ["FTC antitrust challenge", "Luxury market concentration concerns", "Judge skeptical at hearing"], downside: "-35% from current" },
              { deal: "US Steel / Nippon", risk: "HIGH", breakProb: 42, factors: ["National security (CFIUS)", "Political opposition bipartisan", "Union opposition"], downside: "-28% from current" },
              { deal: "Albertsons / Kroger", risk: "HIGH", breakProb: 35, factors: ["FTC grocery competition case", "State AG challenges", "Divestiture package dispute"], downside: "-22% from current" },
              { deal: "iRobot / Amazon", risk: "MODERATE", breakProb: 28, factors: ["EU competition review", "Smart home market share", "Data privacy concerns"], downside: "-18% from current" },
              { deal: "Figma / Adobe", risk: "LOW", breakProb: 8, factors: ["Concessions offered to EU", "UK CMA remedies accepted", "Design tool market growing"], downside: "-12% from current" },
            ].map(d => (
              <div key={d.deal} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${d.risk === "VERY HIGH" ? "rgba(239,68,68,0.2)" : d.risk === "HIGH" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)"}`
              }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{d.deal}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: d.risk === "VERY HIGH" ? "rgba(239,68,68,0.15)" : d.risk === "HIGH" ? "rgba(251,191,36,0.15)" : d.risk === "MODERATE" ? "rgba(56,189,248,0.15)" : "rgba(34,197,94,0.15)",
                      color: d.risk === "VERY HIGH" ? "#ef4444" : d.risk === "HIGH" ? "#fbbf24" : d.risk === "MODERATE" ? "#38bdf8" : "#22c55e"
                    }}>{d.risk}</span>
                    <span className="font-mono" style={{ color: "#ef4444" }}>{d.breakProb}% break</span>
                  </div>
                </div>
                <div className="space-y-1 text-[9px] mb-1">
                  {d.factors.map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span style={{ color: "#ef4444" }}>!</span>
                      <span style={{ color: "#94a3b8" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[9px]"><span style={{ color: "#64748b" }}>Break downside:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{d.downside}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
