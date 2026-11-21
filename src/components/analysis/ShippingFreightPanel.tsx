"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const FREIGHT_RATES = [
  { route: "Baltic Dry Index", code: "BDI", value: 1842, change: 2.4, unit: "pts", category: "Dry Bulk" },
  { route: "BCI (Capesize)", code: "BCI", value: 2456, change: 3.8, unit: "pts", category: "Dry Bulk" },
  { route: "BPI (Panamax)", code: "BPI", value: 1685, change: 1.2, unit: "pts", category: "Dry Bulk" },
  { route: "BSI (Supramax)", code: "BSI", value: 1248, change: -0.8, unit: "pts", category: "Dry Bulk" },
  { route: "BDTI (Dirty Tanker)", code: "BDTI", value: 1125, change: -2.1, unit: "pts", category: "Tanker" },
  { route: "BCTI (Clean Tanker)", code: "BCTI", value: 848, change: 1.5, unit: "pts", category: "Tanker" },
  { route: "VLCC TD3C (MEG-China)", code: "TD3C", value: 42500, change: -4.2, unit: "$/day", category: "Tanker" },
  { route: "Suezmax TD20 (WAF-UKC)", code: "TD20", value: 35800, change: 2.8, unit: "$/day", category: "Tanker" },
  { route: "SCFI (Shanghai-EU)", code: "SCFI", value: 2850, change: -5.4, unit: "$/TEU", category: "Container" },
  { route: "SCFI (Shanghai-USWC)", code: "SCFI-WC", value: 3420, change: -3.2, unit: "$/FEU", category: "Container" },
  { route: "FBX Global Container", code: "FBX", value: 2680, change: -4.8, unit: "$/FEU", category: "Container" },
];

type Tab = "rates" | "routes" | "fleet" | "ports";

export default function ShippingFreightPanel() {
  const [tab, setTab] = useState<Tab>("rates");
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? FREIGHT_RATES : FREIGHT_RATES.filter(r => r.category === filter);

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🚢</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SHIPPING & FREIGHT</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Bloomberg BMAP</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["rates", "routes", "fleet", "ports"] as Tab[]).map(t => (
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
          { label: "BDI", value: "1,842", change: "+2.4%", color: "#22c55e" },
          { label: "VLCC", value: "$42.5K/d", change: "-4.2%", color: "#ef4444" },
          { label: "SCFI", value: "2,850", change: "-5.4%", color: "#ef4444" },
          { label: "BUNKER 380", value: "$548/mt", change: "+1.2%", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold" style={{ color: "#e2e8f0" }}>{s.value}</span>
              <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "rates" && (
          <div className="space-y-1">
            <div className="flex gap-1 mb-2">
              {["All", "Dry Bulk", "Tanker", "Container"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className="px-2 py-0.5 rounded text-[9px]"
                  style={{ background: filter === f ? "rgba(6,182,212,0.2)" : "transparent", color: filter === f ? "#06b6d4" : "#64748b" }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>ROUTE</span><span>CODE</span><span className="text-right">VALUE</span>
              <span className="text-right">UNIT</span><span className="text-right">CHG%</span><span>TYPE</span>
            </div>
            {filtered.map((r, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 px-2 py-1.5 rounded items-center"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="font-bold truncate" style={{ color: "#00e5a0" }}>{r.route}</span>
                <span className="font-mono" style={{ color: "#38bdf8" }}>{r.code}</span>
                <span className="font-mono text-right font-bold">{r.value.toLocaleString()}</span>
                <span className="text-right text-[9px]" style={{ color: "#64748b" }}>{r.unit}</span>
                <span className="font-mono text-right" style={{ color: r.change >= 0 ? "#22c55e" : "#ef4444" }}>
                  {r.change >= 0 ? "+" : ""}{r.change}%
                </span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{r.category}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "routes" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>KEY TRADE ROUTES — DISRUPTION MONITOR</div>
            {[
              { route: "Suez Canal", status: "DISRUPTED", throughput: "-42%", cause: "Houthi attacks", impact: "Asia-EU container +$1,200/TEU", reroute: "Cape of Good Hope (+12 days)" },
              { route: "Panama Canal", status: "RESTRICTED", throughput: "-28%", cause: "Drought / low water", impact: "US Gulf-Asia +$800/TEU", reroute: "Suez or trans-Pacific" },
              { route: "Strait of Hormuz", status: "ELEVATED", throughput: "Normal", cause: "Iran tensions", impact: "VLCC war risk premium +WS15", reroute: "No viable alternative" },
              { route: "Malacca Strait", status: "NORMAL", throughput: "Normal", cause: "—", impact: "—", reroute: "Lombok/Sunda (+2-3 days)" },
              { route: "Turkish Straits", status: "NORMAL", throughput: "Normal", cause: "—", impact: "—", reroute: "—" },
            ].map(r => (
              <div key={r.route} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${r.status === "DISRUPTED" ? "rgba(239,68,68,0.2)" : r.status === "RESTRICTED" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{r.route}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: r.status === "DISRUPTED" ? "rgba(239,68,68,0.2)" : r.status === "RESTRICTED" ? "rgba(251,191,36,0.15)" : r.status === "ELEVATED" ? "rgba(249,115,22,0.15)" : "rgba(34,197,94,0.15)",
                    color: r.status === "DISRUPTED" ? "#ef4444" : r.status === "RESTRICTED" ? "#fbbf24" : r.status === "ELEVATED" ? "#f97316" : "#22c55e"
                  }}>{r.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Throughput:</span> <span className="font-mono" style={{ color: r.throughput.includes("-") ? "#ef4444" : "#22c55e" }}>{r.throughput}</span></div>
                  <div><span style={{ color: "#64748b" }}>Cause:</span> <span style={{ color: "#94a3b8" }}>{r.cause}</span></div>
                  <div><span style={{ color: "#64748b" }}>Impact:</span> <span style={{ color: "#fbbf24" }}>{r.impact}</span></div>
                  <div><span style={{ color: "#64748b" }}>Reroute:</span> <span style={{ color: "#94a3b8" }}>{r.reroute}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "fleet" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL FLEET UTILIZATION</div>
            {[
              { type: "VLCC", fleet: 850, utilization: 88, orderbook: 12, avgAge: 8.2, scrapping: 15 },
              { type: "Suezmax", fleet: 580, utilization: 85, orderbook: 8, avgAge: 9.5, scrapping: 12 },
              { type: "Aframax", fleet: 720, utilization: 82, orderbook: 10, avgAge: 10.2, scrapping: 18 },
              { type: "Capesize", fleet: 1850, utilization: 78, orderbook: 15, avgAge: 7.8, scrapping: 22 },
              { type: "Panamax (Dry)", fleet: 2200, utilization: 75, orderbook: 18, avgAge: 11.5, scrapping: 28 },
              { type: "Container (12K+ TEU)", fleet: 680, utilization: 92, orderbook: 25, avgAge: 5.4, scrapping: 4 },
            ].map(f => (
              <div key={f.type} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.type}</span>
                  <span className="font-mono text-[9px]" style={{ color: f.utilization > 85 ? "#22c55e" : f.utilization > 75 ? "#fbbf24" : "#ef4444" }}>
                    {f.utilization}% util
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${f.utilization}%`, background: f.utilization > 85 ? "#22c55e" : f.utilization > 75 ? "#fbbf24" : "#ef4444", opacity: 0.6 }} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Fleet:</span> <span className="font-mono">{f.fleet}</span></div>
                  <div><span style={{ color: "#64748b" }}>Orderbook:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{f.orderbook}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Avg Age:</span> <span className="font-mono">{f.avgAge}yr</span></div>
                  <div><span style={{ color: "#64748b" }}>Scrapped:</span> <span className="font-mono">{f.scrapping}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "ports" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PORT CONGESTION MONITOR</div>
            {[
              { port: "Shanghai", country: "China", vessels: 142, avgWait: "1.2d", congestion: "LOW", throughput: "4.2M TEU/mo" },
              { port: "Singapore", country: "Singapore", vessels: 108, avgWait: "0.8d", congestion: "LOW", throughput: "3.4M TEU/mo" },
              { port: "Rotterdam", country: "Netherlands", vessels: 85, avgWait: "2.4d", congestion: "MODERATE", throughput: "1.2M TEU/mo" },
              { port: "Los Angeles", country: "USA", vessels: 62, avgWait: "3.8d", congestion: "HIGH", throughput: "0.8M TEU/mo" },
              { port: "Jeddah", country: "Saudi Arabia", vessels: 48, avgWait: "4.2d", congestion: "HIGH", throughput: "0.5M TEU/mo" },
              { port: "Hamburg", country: "Germany", vessels: 54, avgWait: "1.8d", congestion: "MODERATE", throughput: "0.7M TEU/mo" },
            ].map(p => (
              <div key={p.port} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{p.port}</span>
                    <span className="text-[9px]" style={{ color: "#64748b" }}>{p.country}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[9px]">
                    <span><span style={{ color: "#64748b" }}>Vessels:</span> <span className="font-mono">{p.vessels}</span></span>
                    <span><span style={{ color: "#64748b" }}>Wait:</span> <span className="font-mono">{p.avgWait}</span></span>
                    <span><span style={{ color: "#64748b" }}>Throughput:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{p.throughput}</span></span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                  background: p.congestion === "HIGH" ? "rgba(239,68,68,0.15)" : p.congestion === "MODERATE" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                  color: p.congestion === "HIGH" ? "#ef4444" : p.congestion === "MODERATE" ? "#fbbf24" : "#22c55e"
                }}>{p.congestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
