"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "strategies" | "execution" | "routing" | "latency";

export default function AlgorithmicTradingPanel() {
  const [tab, setTab] = useState<Tab>("strategies");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ALGORITHMIC TRADING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg EMSX</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["strategies", "execution", "routing", "latency"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "strategies" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE ALGO STRATEGIES</div>
            {[
              { name: "VWAP", status: "Running", orders: 42, fillRate: 94.2, slippage: -0.8, avgSize: "$2.5M", venue: "Multi" },
              { name: "TWAP", status: "Running", orders: 28, fillRate: 97.5, slippage: -0.3, avgSize: "$1.8M", venue: "Multi" },
              { name: "Implementation Shortfall", status: "Running", orders: 15, fillRate: 88.5, slippage: -1.2, avgSize: "$5.2M", venue: "Multi" },
              { name: "Iceberg", status: "Running", orders: 8, fillRate: 72.0, slippage: -0.5, avgSize: "$12M", venue: "Dark" },
              { name: "Pairs Arb", status: "Paused", orders: 5, fillRate: 100, slippage: 0.2, avgSize: "$800K", venue: "Lit" },
              { name: "Momentum Ignition Det.", status: "Monitoring", orders: 0, fillRate: 0, slippage: 0, avgSize: "—", venue: "All" },
            ].map(s => (
              <div key={s.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.status === "Running" ? "rgba(34,197,94,0.15)" : s.status === "Paused" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                      color: s.status === "Running" ? "#22c55e" : s.status === "Paused" ? "#fbbf24" : "#38bdf8",
                    }}>{s.status}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{s.venue}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Orders:</span> <span className="font-mono">{s.orders}</span></div>
                  <div><span style={{ color: "#64748b" }}>Fill%:</span> <span className="font-mono" style={{ color: s.fillRate > 90 ? "#22c55e" : "#fbbf24" }}>{s.fillRate}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Slip:</span> <span className="font-mono" style={{ color: s.slippage <= 0 ? "#22c55e" : "#ef4444" }}>{s.slippage}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Avg:</span> <span className="font-mono">{s.avgSize}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "execution" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXECUTION QUALITY ANALYTICS</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Orders", val: "1,248", color: "#00e5a0" },
                { label: "Avg Slippage", val: "-0.6bp", color: "#22c55e" },
                { label: "Fill Rate", val: "94.8%", color: "#38bdf8" },
                { label: "Market Impact", val: "1.2bp", color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TCA — TRANSACTION COST ANALYSIS</div>
            {[
              { broker: "GS Algo", orders: 320, avgSlip: -0.4, impCost: 0.8, timing: 0.2, total: 1.4, rank: 1 },
              { broker: "JPM Execute", orders: 285, avgSlip: -0.5, impCost: 1.0, timing: 0.3, total: 1.8, rank: 2 },
              { broker: "MS Pool", orders: 210, avgSlip: -0.7, impCost: 1.2, timing: 0.4, total: 2.3, rank: 3 },
              { broker: "Citi Cross", orders: 180, avgSlip: -0.8, impCost: 1.5, timing: 0.5, total: 2.8, rank: 4 },
              { broker: "Virtu POSIT", orders: 155, avgSlip: -0.3, impCost: 0.5, timing: 0.1, total: 0.9, rank: 1 },
            ].map(b => (
              <div key={b.broker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24 font-bold">{b.broker}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{b.orders}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#22c55e" }}>{b.avgSlip}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: "#fbbf24" }}>{b.impCost}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{b.timing}bp</span>
                <span className="font-mono w-14 text-right font-bold" style={{ color: b.total < 1.5 ? "#22c55e" : b.total < 2.5 ? "#fbbf24" : "#ef4444" }}>{b.total}bp</span>
              </div>
            ))}
          </div>
        )}

        {tab === "routing" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SMART ORDER ROUTING</div>
            {[
              { venue: "NYSE", type: "Lit", pct: 28, fillRate: 95, avgLatency: "0.8ms", rebate: "$0.0020" },
              { venue: "NASDAQ", type: "Lit", pct: 24, fillRate: 93, avgLatency: "0.6ms", rebate: "$0.0025" },
              { venue: "IEX", type: "Lit", pct: 12, fillRate: 91, avgLatency: "1.2ms", rebate: "$0.0009" },
              { venue: "BATS/EDGX", type: "Lit", pct: 8, fillRate: 92, avgLatency: "0.5ms", rebate: "$0.0022" },
              { venue: "Sigma X", type: "Dark", pct: 10, fillRate: 68, avgLatency: "2.5ms", rebate: "—" },
              { venue: "POSIT", type: "Dark", pct: 8, fillRate: 55, avgLatency: "3.2ms", rebate: "—" },
              { venue: "Crossfinder", type: "Dark", pct: 6, fillRate: 48, avgLatency: "2.8ms", rebate: "—" },
              { venue: "Internalized", type: "Internal", pct: 4, fillRate: 100, avgLatency: "0.1ms", rebate: "—" },
            ].map(v => (
              <div key={v.venue} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24 font-bold">{v.venue}</span>
                <span className="text-[8px] px-1 py-0.5 rounded w-14 text-center" style={{
                  background: v.type === "Lit" ? "rgba(34,197,94,0.1)" : v.type === "Dark" ? "rgba(168,85,247,0.1)" : "rgba(56,189,248,0.1)",
                  color: v.type === "Lit" ? "#22c55e" : v.type === "Dark" ? "#a855f7" : "#38bdf8",
                }}>{v.type}</span>
                <span className="font-mono w-10 text-right">{v.pct}%</span>
                <span className="font-mono w-12 text-right" style={{ color: v.fillRate > 80 ? "#22c55e" : "#fbbf24" }}>{v.fillRate}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{v.avgLatency}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{v.rebate}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "latency" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATENCY METRICS (P50 / P95 / P99)</div>
            {[
              { component: "Market Data Feed", p50: "0.12ms", p95: "0.45ms", p99: "1.2ms", status: "OK" },
              { component: "Order Gateway", p50: "0.25ms", p95: "0.85ms", p99: "2.1ms", status: "OK" },
              { component: "Risk Engine", p50: "0.08ms", p95: "0.22ms", p99: "0.5ms", status: "OK" },
              { component: "Strategy Engine", p50: "0.35ms", p95: "1.2ms", p99: "3.5ms", status: "WARN" },
              { component: "Network (NY4↔DC5)", p50: "0.68ms", p95: "0.85ms", p99: "1.5ms", status: "OK" },
              { component: "FIX Session", p50: "0.15ms", p95: "0.42ms", p99: "0.9ms", status: "OK" },
            ].map(l => (
              <div key={l.component} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36">{l.component}</span>
                <span className="font-mono w-16 text-right">{l.p50}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#fbbf24" }}>{l.p95}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#ef4444" }}>{l.p99}</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                  background: l.status === "OK" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                  color: l.status === "OK" ? "#22c55e" : "#fbbf24",
                }}>{l.status}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TICK-TO-TRADE HISTOGRAM</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {[
                { label: "<0.5ms", h: 15 }, { label: "0.5-1", h: 35 }, { label: "1-2", h: 55 },
                { label: "2-3", h: 42 }, { label: "3-5", h: 25 }, { label: "5-10", h: 12 },
                { label: "10-20", h: 5 }, { label: ">20ms", h: 2 },
              ].map((b, i) => (
                <g key={b.label}>
                  <rect x={15 + i * 48} y={70 - b.h} width={32} height={b.h} rx={2} fill="rgba(99,102,241,0.4)" stroke="#6366f1" strokeWidth={0.5} />
                  <text x={31 + i * 48} y={66 - b.h} textAnchor="middle" fill="#6366f1" fontSize="6">{b.h}%</text>
                  <text x={31 + i * 48} y="78" textAnchor="middle" fill="#64748b" fontSize="5">{b.label}</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
