"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "lc" | "supply-chain" | "factoring" | "market";

export default function TradeFinancePanel() {
  const [tab, setTab] = useState<Tab>("lc");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>TRADE FINANCE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>Reuters TRFI</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["lc", "supply-chain", "factoring", "market"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "lc" ? "L/C" : t === "supply-chain" ? "SCF" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "GLOBAL TRADE VOL", value: "$28.4T", color: "#10b981" },
          { label: "L/C OUTSTANDING", value: "$2.8T", color: "#38bdf8" },
          { label: "SCF MARKET", value: "$1.6T", color: "#a855f7" },
          { label: "TRADE GAP", value: "$2.5T", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "lc" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LETTER OF CREDIT PRICING (Confirmation Fees)</div>
            {[
              { country: "Bangladesh", rating: "Ba3", fee90d: 125, fee180d: 185, fee360d: 280, trend: "rising", volume: "$4.2B" },
              { country: "Turkey", rating: "B3", fee90d: 185, fee180d: 265, fee360d: 420, trend: "stable", volume: "$8.5B" },
              { country: "Egypt", rating: "Caa1", fee90d: 350, fee180d: 480, fee360d: 650, trend: "declining", volume: "$3.8B" },
              { country: "Vietnam", rating: "Ba2", fee90d: 85, fee180d: 125, fee360d: 180, trend: "stable", volume: "$6.2B" },
              { country: "Nigeria", rating: "Caa1", fee90d: 420, fee180d: 580, fee360d: 780, trend: "rising", volume: "$2.4B" },
              { country: "India", rating: "Baa3", fee90d: 45, fee180d: 65, fee360d: 95, trend: "declining", volume: "$12.8B" },
              { country: "Pakistan", rating: "Caa3", fee90d: 650, fee180d: 850, fee360d: 1100, trend: "rising", volume: "$1.2B" },
            ].map(c => (
              <div key={c.country} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.country}</span>
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{c.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px]" style={{ color: c.trend === "rising" ? "#ef4444" : c.trend === "declining" ? "#22c55e" : "#94a3b8" }}>
                      {c.trend === "rising" ? "▲" : c.trend === "declining" ? "▼" : "─"}
                    </span>
                    <span className="font-mono text-[9px]" style={{ color: "#38bdf8" }}>{c.volume}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>90d:</span> <span className="font-mono" style={{ color: c.fee90d > 300 ? "#ef4444" : c.fee90d > 150 ? "#fbbf24" : "#22c55e" }}>{c.fee90d}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>180d:</span> <span className="font-mono" style={{ color: c.fee180d > 400 ? "#ef4444" : c.fee180d > 200 ? "#fbbf24" : "#22c55e" }}>{c.fee180d}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>360d:</span> <span className="font-mono" style={{ color: c.fee360d > 500 ? "#ef4444" : c.fee360d > 250 ? "#fbbf24" : "#22c55e" }}>{c.fee360d}bp</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "supply-chain" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SUPPLY CHAIN FINANCE PROGRAMS</div>
            {[
              { buyer: "Walmart", program: "$18.5B", suppliers: 2400, avgTenor: "90d", rate: "SOFR+45bp", savings: "$285M/yr" },
              { buyer: "Apple", program: "$12.8B", suppliers: 850, avgTenor: "75d", rate: "SOFR+35bp", savings: "$168M/yr" },
              { buyer: "Volkswagen", program: "$8.4B", suppliers: 1800, avgTenor: "120d", rate: "EURIBOR+55bp", savings: "$142M/yr" },
              { buyer: "Nestlé", program: "$6.2B", suppliers: 3200, avgTenor: "90d", rate: "EURIBOR+40bp", savings: "$95M/yr" },
              { buyer: "Samsung", program: "$5.8B", suppliers: 680, avgTenor: "60d", rate: "SOFR+50bp", savings: "$82M/yr" },
            ].map(p => (
              <div key={p.buyer} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{p.buyer}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{p.program}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Suppliers:</span> <span className="font-mono">{p.suppliers.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Tenor:</span> <span className="font-mono">{p.avgTenor}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rate:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{p.rate}</span></div>
                  <div><span style={{ color: "#64748b" }}>Savings:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{p.savings}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "factoring" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL FACTORING MARKET</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Volume", value: "$3.8T", sub: "+6% YoY" },
                { label: "Cross-Border", value: "$580B", sub: "+12% YoY" },
                { label: "Digital Platforms", value: "$420B", sub: "+28% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#10b981" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>TOP FACTORING MARKETS</div>
            {[
              { country: "China", volume: "$842B", growth: 8, share: 22 },
              { country: "France", volume: "$425B", growth: 4, share: 11 },
              { country: "Germany", volume: "$380B", growth: 5, share: 10 },
              { country: "UK", volume: "$342B", growth: 6, share: 9 },
              { country: "Italy", volume: "$285B", growth: 3, share: 7 },
              { country: "USA", volume: "$245B", growth: 12, share: 6 },
            ].map(c => (
              <div key={c.country} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{c.country}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${c.share * 4}%`, background: "#10b981", opacity: 0.6 }} />
                </div>
                <span className="font-mono w-16 text-right" style={{ color: "#10b981" }}>{c.volume}</span>
                <span className="font-mono text-[9px] w-12 text-right" style={{ color: "#22c55e" }}>+{c.growth}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TRADE FINANCE MARKET INDICATORS</div>
            {[
              { indicator: "Global Trade Volume (YoY)", value: "+4.2%", status: "EXPANDING" },
              { indicator: "Container Throughput Index", value: "128.4", status: "ABOVE TREND" },
              { indicator: "Trade Finance Gap (Developing)", value: "$2.5T", status: "WIDENING" },
              { indicator: "Documentary Credit Rejections", value: "12.4%", status: "ELEVATED" },
              { indicator: "Avg Payment Terms (Global)", value: "62 days", status: "LENGTHENING" },
              { indicator: "Trade Credit Insurance Claims", value: "+18%", status: "RISING" },
            ].map(i => (
              <div key={i.indicator} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span>{i.indicator}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>{i.value}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: i.status.includes("EXPAND") || i.status.includes("ABOVE") ? "rgba(34,197,94,0.15)" : i.status.includes("WIDEN") || i.status.includes("RISING") ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: i.status.includes("EXPAND") || i.status.includes("ABOVE") ? "#22c55e" : i.status.includes("WIDEN") || i.status.includes("RISING") ? "#ef4444" : "#fbbf24"
                  }}>{i.status}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>TRADE CORRIDORS — TOP BILATERAL FLOWS</div>
            {[
              { from: "China", to: "USA", volume: "$582B", yoy: -2.4 },
              { from: "China", to: "EU", volume: "$486B", yoy: 1.8 },
              { from: "USA", to: "EU", volume: "$412B", yoy: 3.2 },
              { from: "ASEAN", to: "China", volume: "$385B", yoy: 8.5 },
              { from: "Middle East", to: "Asia", volume: "$342B", yoy: -4.2 },
            ].map(c => (
              <div key={`${c.from}-${c.to}`} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{c.from}</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span style={{ color: "#38bdf8" }}>{c.to}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{c.volume}</span>
                  <span className="font-mono text-[9px]" style={{ color: c.yoy >= 0 ? "#22c55e" : "#ef4444" }}>{c.yoy >= 0 ? "+" : ""}{c.yoy}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
