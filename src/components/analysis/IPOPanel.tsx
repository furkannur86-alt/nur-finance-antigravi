"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const UPCOMING_IPOS = [
  { company: "NovaTech AI", ticker: "NVAI", sector: "Technology", exchange: "NASDAQ", priceRange: "$22-$26", shares: "45M", valuation: "$12.8B", date: "Nov 25", lead: "Goldman Sachs", rating: "HOT" },
  { company: "GreenHydrogen Corp", ticker: "GHYD", sector: "Energy", exchange: "NYSE", priceRange: "$18-$21", shares: "60M", valuation: "$8.4B", date: "Nov 26", lead: "Morgan Stanley", rating: "WARM" },
  { company: "MedGenomics", ticker: "MEDG", sector: "Healthcare", exchange: "NASDAQ", priceRange: "$14-$17", shares: "35M", valuation: "$4.2B", date: "Nov 28", lead: "JPMorgan", rating: "HOT" },
  { company: "QuantumSecure", ticker: "QSEC", sector: "Cybersecurity", exchange: "NASDAQ", priceRange: "$28-$32", shares: "30M", valuation: "$6.5B", date: "Dec 02", lead: "Barclays", rating: "WARM" },
  { company: "SolarGrid Systems", ticker: "SGRD", sector: "Utilities", exchange: "NYSE", priceRange: "$12-$15", shares: "80M", valuation: "$5.8B", date: "Dec 04", lead: "Citi", rating: "COOL" },
  { company: "DataBridge Analytics", ticker: "DBRA", sector: "Software", exchange: "NASDAQ", priceRange: "$35-$40", shares: "25M", valuation: "$9.2B", date: "Dec 06", lead: "BofA Securities", rating: "HOT" },
];

const RECENT_IPOS = [
  { company: "CyberFlux Inc", ticker: "CFLX", ipoPrice: 24.00, currentPrice: 38.50, change: 60.4, firstDay: 42.0, volume: "12.4M", date: "Nov 15" },
  { company: "BioPharm Holdings", ticker: "BPHM", ipoPrice: 19.00, currentPrice: 16.80, change: -11.6, firstDay: -4.2, volume: "3.8M", date: "Nov 12" },
  { company: "CloudNine Labs", ticker: "CLD9", ipoPrice: 32.00, currentPrice: 45.20, change: 41.3, firstDay: 28.5, volume: "8.2M", date: "Nov 08" },
  { company: "TerraMetals", ticker: "TMET", ipoPrice: 15.00, currentPrice: 14.20, change: -5.3, firstDay: 2.1, volume: "2.1M", date: "Nov 05" },
  { company: "NeuroLink Tech", ticker: "NLNK", ipoPrice: 28.00, currentPrice: 52.80, change: 88.6, firstDay: 65.0, volume: "18.5M", date: "Oct 28" },
];

type Tab = "upcoming" | "recent" | "pipeline" | "stats";

export default function IPOPanel() {
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔔</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>IPO CENTER</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg ECM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["upcoming", "recent", "pipeline", "stats"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "upcoming" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>UPCOMING IPOs</div>
            {UPCOMING_IPOS.map((ipo, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{ipo.company}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#38bdf8" }}>{ipo.ticker}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{ipo.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{ipo.date}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: ipo.rating === "HOT" ? "rgba(239,68,68,0.15)" : ipo.rating === "WARM" ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.15)",
                      color: ipo.rating === "HOT" ? "#ef4444" : ipo.rating === "WARM" ? "#fbbf24" : "#94a3b8"
                    }}>{ipo.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Range:</span> <span className="font-mono font-bold">{ipo.priceRange}</span></div>
                  <div><span style={{ color: "#64748b" }}>Shares:</span> <span className="font-mono">{ipo.shares}</span></div>
                  <div><span style={{ color: "#64748b" }}>Valuation:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{ipo.valuation}</span></div>
                  <div><span style={{ color: "#64748b" }}>Exchange:</span> <span className="font-mono">{ipo.exchange}</span></div>
                  <div><span style={{ color: "#64748b" }}>Lead:</span> <span>{ipo.lead}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recent" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>RECENT IPO PERFORMANCE</div>
            {RECENT_IPOS.map((ipo, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{ipo.company}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#38bdf8" }}>{ipo.ticker}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>IPO: {ipo.date}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>IPO $:</span> <span className="font-mono">${ipo.ipoPrice.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Now:</span> <span className="font-mono" style={{ color: "#e2e8f0" }}>${ipo.currentPrice.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Return:</span> <span className="font-mono font-bold" style={{ color: ipo.change >= 0 ? "#22c55e" : "#ef4444" }}>{ipo.change >= 0 ? "+" : ""}{ipo.change}%</span></div>
                  <div><span style={{ color: "#64748b" }}>1st Day:</span> <span className="font-mono" style={{ color: ipo.firstDay >= 0 ? "#22c55e" : "#ef4444" }}>{ipo.firstDay >= 0 ? "+" : ""}{ipo.firstDay}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{ipo.volume}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "pipeline" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL ECM PIPELINE — $142B in filings</div>
            {[
              { region: "North America", deals: 48, volume: "$62.4B", pct: 44 },
              { region: "Europe", deals: 32, volume: "$38.2B", pct: 27 },
              { region: "Asia-Pacific", deals: 28, volume: "$28.5B", pct: 20 },
              { region: "Middle East", deals: 8, volume: "$8.4B", pct: 6 },
              { region: "Latin America", deals: 5, volume: "$4.5B", pct: 3 },
            ].map(r => (
              <div key={r.region} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{r.region}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "#a855f7", opacity: 0.7 }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: "#a855f7" }}>{r.volume}</span>
                <span className="font-mono text-[9px] w-10 text-right" style={{ color: "#64748b" }}>{r.deals} deals</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>SECTOR BREAKDOWN</div>
            {[
              { sector: "Technology", deals: 35, volume: "$48.2B", color: "#38bdf8" },
              { sector: "Healthcare", deals: 22, volume: "$24.8B", color: "#22c55e" },
              { sector: "Financials", deals: 18, volume: "$22.5B", color: "#fbbf24" },
              { sector: "Energy/Clean", deals: 15, volume: "$18.4B", color: "#10b981" },
              { sector: "Industrials", deals: 12, volume: "$14.2B", color: "#f97316" },
              { sector: "Consumer", deals: 19, volume: "$13.9B", color: "#e879f9" },
            ].map(s => (
              <div key={s.sector} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span>{s.sector}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: s.color }}>{s.volume}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{s.deals} deals</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "stats" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>2026 IPO MARKET STATISTICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total IPOs", value: "342", sub: "+18% YoY" },
                { label: "Total Raised", value: "$128.4B", sub: "+24% YoY" },
                { label: "Avg First-Day Return", value: "+22.4%", sub: "vs +15.2% 2025" },
                { label: "Above Range", value: "38%", sub: "of priced deals" },
                { label: "Avg Deal Size", value: "$375M", sub: "+8% YoY" },
                { label: "Withdrawn", value: "28", sub: "8.2% of filed" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#00e5a0" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>MONTHLY IPO VOLUME (2026)</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-end gap-1" style={{ height: 80 }}>
                {[
                  { m: "J", v: 8.2 }, { m: "F", v: 10.4 }, { m: "M", v: 15.8 }, { m: "A", v: 12.2 },
                  { m: "M", v: 14.5 }, { m: "J", v: 11.8 }, { m: "J", v: 8.4 }, { m: "A", v: 6.2 },
                  { m: "S", v: 16.8 }, { m: "O", v: 18.5 }, { m: "N", v: 14.2 },
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full rounded-t" style={{ height: `${(d.v / 20) * 60}px`, background: "#a855f7", opacity: 0.6 }} />
                    <span className="text-[7px] mt-1" style={{ color: "#64748b" }}>{d.m}</span>
                    <span className="text-[7px] font-mono" style={{ color: "#94a3b8" }}>${d.v}B</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
