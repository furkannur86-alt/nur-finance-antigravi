"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const TRADE_IDEAS = [
  { id: 1, type: "LONG" as const, ticker: "NVDA", name: "NVIDIA", catalyst: "AI capex cycle acceleration", thesis: "Hyperscaler capex rising 40% YoY; NVDA sole GPU supplier for training workloads. Blackwell ramp exceeds consensus.",
    entry: 138.50, target: 175.00, stop: 122.00, rr: 2.21, conviction: "HIGH", timeframe: "3-6mo", sector: "Semiconductors",
    factors: { momentum: 92, value: 25, quality: 88, growth: 95 }, date: "2026-11-15" },
  { id: 2, type: "PAIR" as const, ticker: "XOM/CVX", name: "Exxon vs Chevron", catalyst: "Permian Basin production divergence", thesis: "XOM Permian output +12% QoQ vs CVX flat. Pioneer integration complete, synergies flowing ahead of schedule.",
    entry: 1.08, target: 1.18, stop: 1.02, rr: 1.67, conviction: "MEDIUM", timeframe: "2-4mo", sector: "Energy",
    factors: { momentum: 68, value: 72, quality: 85, growth: 60 }, date: "2026-11-14" },
  { id: 3, type: "SHORT" as const, ticker: "BYND", name: "Beyond Meat", catalyst: "Cash burn + debt maturity", thesis: "2027 convert maturity with no refi capacity. Cash runway < 8 months at current burn. Restaurant partnerships declining.",
    entry: 8.20, target: 3.50, stop: 11.00, rr: 1.68, conviction: "HIGH", timeframe: "6-12mo", sector: "Consumer Staples",
    factors: { momentum: 15, value: 8, quality: 12, growth: 5 }, date: "2026-11-13" },
  { id: 4, type: "LONG" as const, ticker: "CRWD", name: "CrowdStrike", catalyst: "Federal cyber mandate + NDR expansion", thesis: "CISA mandates zero-trust by Q2 2027; CRWD wins 60% of federal RFPs. NDR module gaining 40% QoQ.",
    entry: 382.00, target: 480.00, stop: 340.00, rr: 2.33, conviction: "HIGH", timeframe: "3-6mo", sector: "Cybersecurity",
    factors: { momentum: 85, value: 32, quality: 90, growth: 88 }, date: "2026-11-12" },
  { id: 5, type: "LONG" as const, ticker: "VST", name: "Vistra Corp", catalyst: "Nuclear power + AI data center demand", thesis: "Nuclear fleet uniquely positioned for 24/7 baseload AI data center PPAs. Comanche Peak PPA pipeline $4B+.",
    entry: 142.00, target: 195.00, stop: 118.00, rr: 2.21, conviction: "MEDIUM", timeframe: "6-12mo", sector: "Utilities",
    factors: { momentum: 95, value: 45, quality: 70, growth: 78 }, date: "2026-11-11" },
  { id: 6, type: "SHORT" as const, ticker: "SNAP", name: "Snap Inc.", catalyst: "Ad revenue deceleration + user churn", thesis: "Gen-Z shifting to TikTok/BeReal. ARPU declining in US/EU. CFO departure signals internal concern.",
    entry: 14.50, target: 8.00, stop: 18.00, rr: 1.86, conviction: "MEDIUM", timeframe: "3-6mo", sector: "Communication",
    factors: { momentum: 22, value: 18, quality: 30, growth: 20 }, date: "2026-11-10" },
];

type Filter = "ALL" | "LONG" | "SHORT" | "PAIR";

export default function TradeIdeaPanel() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === "ALL" ? TRADE_IDEAS : TRADE_IDEAS.filter(t => t.type === filter);
  const highConviction = TRADE_IDEAS.filter(t => t.conviction === "HIGH").length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💡</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>TRADE IDEAS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Bloomberg IDEA</span>
          <DemoBadge />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px]" style={{ color: "#64748b" }}>{highConviction} high conviction</span>
          <div className="flex gap-1">
            {(["ALL", "LONG", "SHORT", "PAIR"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-2 py-0.5 rounded text-[9px] font-bold"
                style={{ background: filter === f ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.03)", color: filter === f ? "#00e5a0" : "#64748b" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
        {filtered.map(idea => (
          <div key={idea.id} className="rounded cursor-pointer"
            onClick={() => setExpanded(expanded === idea.id ? null : idea.id)}
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === idea.id ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.05)"}` }}>
            <div className="flex items-center gap-2 p-3">
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                style={{ background: idea.type === "LONG" ? "rgba(34,197,94,0.15)" : idea.type === "SHORT" ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.15)",
                         color: idea.type === "LONG" ? "#22c55e" : idea.type === "SHORT" ? "#ef4444" : "#a855f7" }}>
                {idea.type}
              </span>
              <span className="font-bold" style={{ color: "#00e5a0" }}>{idea.ticker}</span>
              <span style={{ color: "#94a3b8" }}>{idea.name}</span>
              <div className="flex-1" />
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                style={{ background: idea.conviction === "HIGH" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
                         color: idea.conviction === "HIGH" ? "#fbbf24" : "#64748b" }}>
                {idea.conviction}
              </span>
              <span className="text-[9px]" style={{ color: "#64748b" }}>{idea.timeframe}</span>
              <span className="font-mono text-[9px]" style={{ color: "#38bdf8" }}>R:R {idea.rr.toFixed(2)}</span>
            </div>

            <div className="px-3 pb-2 text-[9px]" style={{ color: "#94a3b8" }}>
              <span className="font-bold" style={{ color: "#fbbf24" }}>Catalyst:</span> {idea.catalyst}
            </div>

            {expanded === idea.id && (
              <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="pt-2 text-[10px]" style={{ color: "#e2e8f0" }}>{idea.thesis}</div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>ENTRY</div>
                    <div className="font-mono font-bold" style={{ color: "#e2e8f0" }}>${idea.entry}</div>
                  </div>
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(34,197,94,0.05)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>TARGET</div>
                    <div className="font-mono font-bold" style={{ color: "#22c55e" }}>${idea.target}</div>
                  </div>
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(239,68,68,0.05)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>STOP</div>
                    <div className="font-mono font-bold" style={{ color: "#ef4444" }}>${idea.stop}</div>
                  </div>
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(56,189,248,0.05)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>R:R</div>
                    <div className="font-mono font-bold" style={{ color: "#38bdf8" }}>{idea.rr.toFixed(2)}</div>
                  </div>
                </div>

                <div className="text-[8px] font-bold mb-1" style={{ color: "#fbbf24" }}>FACTOR SCORES</div>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(idea.factors).map(([key, val]) => (
                    <div key={key} className="flex flex-col items-center gap-0.5">
                      <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${val}%`, background: val > 70 ? "#22c55e" : val > 40 ? "#fbbf24" : "#ef4444" }} />
                      </div>
                      <span className="text-[7px] uppercase" style={{ color: "#64748b" }}>{key} {val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
