"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "calendar" | "aristocrats" | "estimates" | "screens";

const UPCOMING_DIVIDENDS = [
  { ticker: "AAPL", name: "Apple Inc", exDate: "Nov 25", payDate: "Dec 15", amount: 0.25, yield: 0.52, frequency: "Q", status: "CONFIRMED" },
  { ticker: "MSFT", name: "Microsoft Corp", exDate: "Nov 27", payDate: "Dec 12", amount: 0.75, yield: 0.72, frequency: "Q", status: "CONFIRMED" },
  { ticker: "JNJ", name: "Johnson & Johnson", exDate: "Nov 28", payDate: "Jan 7", amount: 1.24, yield: 3.15, frequency: "Q", status: "CONFIRMED" },
  { ticker: "PG", name: "Procter & Gamble", exDate: "Dec 2", payDate: "Jan 15", amount: 1.0065, yield: 2.42, frequency: "Q", status: "CONFIRMED" },
  { ticker: "KO", name: "Coca-Cola Co", exDate: "Dec 5", payDate: "Dec 29", amount: 0.485, yield: 3.08, frequency: "Q", status: "ESTIMATED" },
  { ticker: "XOM", name: "Exxon Mobil", exDate: "Dec 9", payDate: "Jan 10", amount: 0.95, yield: 3.42, frequency: "Q", status: "CONFIRMED" },
  { ticker: "T", name: "AT&T Inc", exDate: "Dec 12", payDate: "Jan 3", amount: 0.2775, yield: 6.45, frequency: "Q", status: "ESTIMATED" },
  { ticker: "O", name: "Realty Income", exDate: "Dec 15", payDate: "Dec 29", amount: 0.263, yield: 5.82, frequency: "M", status: "CONFIRMED" },
];

const ARISTOCRATS = [
  { ticker: "JNJ", name: "Johnson & Johnson", years: 62, yield: 3.15, growth5y: 5.8, payout: 42, sector: "Healthcare" },
  { ticker: "PG", name: "Procter & Gamble", years: 68, yield: 2.42, growth5y: 6.2, payout: 58, sector: "Consumer" },
  { ticker: "KO", name: "Coca-Cola", years: 62, yield: 3.08, growth5y: 3.5, payout: 72, sector: "Consumer" },
  { ticker: "MMM", name: "3M Company", years: 66, yield: 5.85, growth5y: 1.2, payout: 85, sector: "Industrial" },
  { ticker: "EMR", name: "Emerson Electric", years: 67, yield: 2.05, growth5y: 2.8, payout: 45, sector: "Industrial" },
  { ticker: "CL", name: "Colgate-Palmolive", years: 61, yield: 2.18, growth5y: 3.0, payout: 55, sector: "Consumer" },
  { ticker: "SWK", name: "Stanley Black", years: 56, yield: 3.92, growth5y: 4.5, payout: 68, sector: "Industrial" },
  { ticker: "ABT", name: "Abbott Labs", years: 52, yield: 1.85, growth5y: 12.5, payout: 38, sector: "Healthcare" },
];

export default function DividendAnalysisPanel() {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💰</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>DIVIDEND ANALYSIS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Bloomberg DVD</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["calendar", "aristocrats", "estimates", "screens"] as Tab[]).map(t => (
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
          { label: "S&P 500 YIELD", value: "1.42%", color: "#fbbf24" },
          { label: "EX-DATE THIS WEEK", value: "23", color: "#38bdf8" },
          { label: "TOTAL PAYOUT (Q4)", value: "$168.5B", color: "#22c55e" },
          { label: "DIV GROWTH (YOY)", value: "+5.8%", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "calendar" && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>UPCOMING EX-DIVIDEND DATES</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Ticker</th>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Company</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Ex-Date</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Amount</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Yield</th>
                    <th className="text-center px-2 py-1.5" style={{ color: "#64748b" }}>Freq</th>
                    <th className="text-center px-2 py-1.5" style={{ color: "#64748b" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_DIVIDENDS.map(d => (
                    <tr key={d.ticker} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{d.ticker}</td>
                      <td className="px-2 py-1.5 truncate max-w-[120px]">{d.name}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{d.exDate}</td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold" style={{ color: "#22c55e" }}>${d.amount.toFixed(4)}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: d.yield > 4 ? "#fbbf24" : "#e2e8f0" }}>{d.yield.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 text-center">{d.frequency}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                          background: d.status === "CONFIRMED" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                          color: d.status === "CONFIRMED" ? "#22c55e" : "#fbbf24"
                        }}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "aristocrats" && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>DIVIDEND ARISTOCRATS (25+ YEARS CONSECUTIVE INCREASES)</div>
            {ARISTOCRATS.map(a => (
              <div key={a.ticker} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{a.ticker}</span>
                    <span>{a.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{a.sector}</span>
                  </div>
                  <span className="font-mono font-bold px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{a.years}yr streak</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Yield:</span> <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{a.yield}%</span></div>
                  <div><span style={{ color: "#64748b" }}>5Y Growth:</span> <span className="font-mono" style={{ color: a.growth5y > 5 ? "#22c55e" : "#fbbf24" }}>{a.growth5y}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Payout:</span> <span className="font-mono" style={{ color: a.payout > 75 ? "#ef4444" : a.payout > 60 ? "#fbbf24" : "#22c55e" }}>{a.payout}%</span></div>
                  <div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${a.payout}%`, background: a.payout > 75 ? "#ef4444" : a.payout > 60 ? "#fbbf24" : "#22c55e" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "estimates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DIVIDEND CHANGE ESTIMATES (NEXT 12M)</div>
            {[
              { ticker: "AAPL", name: "Apple", current: 1.00, estimated: 1.08, growth: 8.0, confidence: "HIGH", analystCount: 28 },
              { ticker: "MSFT", name: "Microsoft", current: 3.00, estimated: 3.32, growth: 10.7, confidence: "HIGH", analystCount: 32 },
              { ticker: "JPM", name: "JPMorgan", current: 4.60, estimated: 5.00, growth: 8.7, confidence: "HIGH", analystCount: 24 },
              { ticker: "V", name: "Visa", current: 2.08, estimated: 2.40, growth: 15.4, confidence: "MEDIUM", analystCount: 22 },
              { ticker: "ABBV", name: "AbbVie", current: 6.20, estimated: 6.56, growth: 5.8, confidence: "HIGH", analystCount: 20 },
              { ticker: "PFE", name: "Pfizer", current: 1.68, estimated: 1.68, growth: 0.0, confidence: "MEDIUM", analystCount: 18 },
              { ticker: "INTC", name: "Intel", current: 0.50, estimated: 0.50, growth: 0.0, confidence: "LOW", analystCount: 25 },
            ].map(e => (
              <div key={e.ticker} className="flex items-center gap-3 p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-28">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{e.ticker}</span>
                  <span className="text-[9px] ml-1" style={{ color: "#64748b" }}>{e.name}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-mono">${e.current.toFixed(2)}</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span className="font-mono font-bold" style={{ color: e.growth > 0 ? "#22c55e" : "#fbbf24" }}>${e.estimated.toFixed(2)}</span>
                  <span className="font-mono text-[9px]" style={{ color: e.growth > 0 ? "#22c55e" : "#fbbf24" }}>
                    {e.growth > 0 ? "+" : ""}{e.growth}%
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                  background: e.confidence === "HIGH" ? "rgba(34,197,94,0.15)" : e.confidence === "MEDIUM" ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                  color: e.confidence === "HIGH" ? "#22c55e" : e.confidence === "MEDIUM" ? "#fbbf24" : "#ef4444"
                }}>{e.confidence}</span>
                <span className="text-[8px]" style={{ color: "#64748b" }}>{e.analystCount} est.</span>
              </div>
            ))}
          </div>
        )}

        {tab === "screens" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DIVIDEND STRATEGY SCREENS</div>
            {[
              { screen: "High Yield (>4%)", count: 142, avgYield: 5.82, avgGrowth: 2.1, topPick: "MO (8.4%)", risk: "MODERATE" },
              { screen: "Dividend Growth (>10% 5yr)", count: 85, avgYield: 1.45, avgGrowth: 14.2, topPick: "AVGO (12.8%)", risk: "LOW" },
              { screen: "Safe Payout (<50%)", count: 218, avgYield: 1.85, avgGrowth: 8.5, topPick: "AAPL (15%)", risk: "LOW" },
              { screen: "REIT Dividends", count: 165, avgYield: 4.28, avgGrowth: 3.8, topPick: "O (5.8%)", risk: "MODERATE" },
              { screen: "Buyback + Dividend", count: 92, avgYield: 2.15, avgGrowth: 7.2, topPick: "META (0.4% + 8% BB)", risk: "LOW" },
              { screen: "International High Yield", count: 128, avgYield: 4.95, avgGrowth: 4.5, topPick: "SHEL (3.8%)", risk: "HIGH" },
            ].map(s => (
              <div key={s.screen} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{s.screen}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ color: "#38bdf8" }}>{s.count} stocks</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.risk === "LOW" ? "rgba(34,197,94,0.15)" : s.risk === "MODERATE" ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                      color: s.risk === "LOW" ? "#22c55e" : s.risk === "MODERATE" ? "#fbbf24" : "#ef4444"
                    }}>{s.risk} RISK</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Avg Yield:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{s.avgYield}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Avg Growth:</span> <span className="font-mono">{s.avgGrowth}%</span></div>
                  <div className="col-span-2"><span style={{ color: "#64748b" }}>Top Pick:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{s.topPick}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
