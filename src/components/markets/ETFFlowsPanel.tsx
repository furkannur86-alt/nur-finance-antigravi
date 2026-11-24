"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "flows" | "premium" | "sector" | "creation";

export default function ETFFlowsPanel() {
  const [tab, setTab] = useState<Tab>("flows");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📈</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ETF FLOWS & ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters ETF</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["flows", "premium", "sector", "creation"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP ETF FLOWS — WEEKLY</div>
            {[
              { ticker: "SPY", name: "S&P 500 SPDR", flow: 8.5, aum: "$560B", price: 592.45, chg: 0.85 },
              { ticker: "QQQ", name: "Nasdaq 100 Invesco", flow: 4.2, aum: "$285B", price: 505.80, chg: 1.25 },
              { ticker: "IWM", name: "Russell 2000 iShares", flow: 2.8, aum: "$72B", price: 235.60, chg: -0.42 },
              { ticker: "TLT", name: "20+ Year Treasury", flow: -3.5, aum: "$48B", price: 88.25, chg: -1.85 },
              { ticker: "HYG", name: "High Yield Corp Bond", flow: 1.2, aum: "$18B", price: 78.45, chg: 0.15 },
              { ticker: "GLD", name: "Gold SPDR", flow: 2.1, aum: "$65B", price: 245.80, chg: 0.65 },
              { ticker: "EEM", name: "Emerging Markets", flow: -1.8, aum: "$22B", price: 42.35, chg: -0.95 },
              { ticker: "XLF", name: "Financial Select", flow: 1.5, aum: "$42B", price: 45.20, chg: 0.42 },
            ].map(e => (
              <div key={e.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{e.ticker}</span>
                <span className="w-36 truncate">{e.name}</span>
                <span className="font-mono w-16 text-right font-bold" style={{ color: e.flow >= 0 ? "#22c55e" : "#ef4444" }}>{e.flow >= 0 ? "+" : ""}{e.flow}B</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{e.aum}</span>
                <span className="font-mono w-16 text-right">${e.price}</span>
                <span className="font-mono w-14 text-right" style={{ color: e.chg >= 0 ? "#22c55e" : "#ef4444" }}>{e.chg >= 0 ? "+" : ""}{e.chg}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "premium" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PREMIUM / DISCOUNT TO NAV</div>
            {[
              { ticker: "ARKK", name: "ARK Innovation", prem: -0.12, avg: -0.08, vol: "12.5M" },
              { ticker: "BITO", name: "ProShares Bitcoin", prem: 0.45, avg: 0.22, vol: "28M" },
              { ticker: "JEPI", name: "JPM Equity Premium", prem: -0.02, avg: -0.01, vol: "5.2M" },
              { ticker: "SCHD", name: "Schwab US Div Equity", prem: 0.01, avg: 0.00, vol: "8.5M" },
              { ticker: "EMB", name: "EM USD Bond", prem: -0.35, avg: -0.15, vol: "2.8M" },
              { ticker: "IBIT", name: "iShares Bitcoin Trust", prem: 0.08, avg: 0.05, vol: "45M" },
            ].map(e => (
              <div key={e.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{e.ticker}</span>
                    <span>{e.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: e.prem >= 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    color: e.prem >= 0 ? "#22c55e" : "#ef4444",
                  }}>{e.prem >= 0 ? "+" : ""}{e.prem}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>30D Avg:</span> <span className="font-mono">{e.avg >= 0 ? "+" : ""}{e.avg}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Avg Vol:</span> <span className="font-mono">{e.vol}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sector" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR ROTATION — 30D FLOWS ($B)</div>
            {[
              { sector: "Technology", ticker: "XLK", flow: 5.8, pct: 2.2, momentum: "Strong" },
              { sector: "Financials", ticker: "XLF", flow: 3.2, pct: 1.5, momentum: "Positive" },
              { sector: "Healthcare", ticker: "XLV", flow: 1.5, pct: 0.8, momentum: "Neutral" },
              { sector: "Energy", ticker: "XLE", flow: -2.1, pct: -1.2, momentum: "Weak" },
              { sector: "Real Estate", ticker: "XLRE", flow: -1.8, pct: -2.5, momentum: "Weak" },
              { sector: "Utilities", ticker: "XLU", flow: 0.5, pct: 0.3, momentum: "Neutral" },
              { sector: "Consumer Disc.", ticker: "XLY", flow: 2.5, pct: 1.1, momentum: "Positive" },
              { sector: "Materials", ticker: "XLB", flow: -0.8, pct: -0.6, momentum: "Weak" },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{s.sector}</span>
                <span className="font-mono w-10" style={{ color: "#64748b" }}>{s.ticker}</span>
                <span className="font-mono w-14 text-right font-bold" style={{ color: s.flow >= 0 ? "#22c55e" : "#ef4444" }}>{s.flow >= 0 ? "+" : ""}{s.flow}B</span>
                <span className="font-mono w-12 text-right" style={{ color: s.pct >= 0 ? "#22c55e" : "#ef4444" }}>{s.pct >= 0 ? "+" : ""}{s.pct}%</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: s.momentum === "Strong" ? "rgba(34,197,94,0.15)" : s.momentum === "Positive" ? "rgba(34,197,94,0.1)" : s.momentum === "Weak" ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)",
                  color: s.momentum === "Strong" ? "#22c55e" : s.momentum === "Positive" ? "#22c55e" : s.momentum === "Weak" ? "#ef4444" : "#64748b",
                }}>{s.momentum}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "creation" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CREATION / REDEMPTION ACTIVITY</div>
            {[
              { ticker: "SPY", created: 25, redeemed: 12, net: 13, shares: "32.5M" },
              { ticker: "QQQ", created: 18, redeemed: 8, net: 10, shares: "22.0M" },
              { ticker: "IWM", created: 12, redeemed: 5, net: 7, shares: "15.5M" },
              { ticker: "TLT", created: 2, redeemed: 15, net: -13, shares: "28.0M" },
              { ticker: "GLD", created: 8, redeemed: 3, net: 5, shares: "12.0M" },
            ].map(c => (
              <div key={c.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                  <span className="font-mono font-bold" style={{ color: c.net >= 0 ? "#22c55e" : "#ef4444" }}>Net: {c.net >= 0 ? "+" : ""}{c.net} units</span>
                </div>
                <div className="flex items-center gap-4 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Created:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{c.created}</span></div>
                  <div><span style={{ color: "#64748b" }}>Redeemed:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{c.redeemed}</span></div>
                  <div className="ml-auto"><span style={{ color: "#64748b" }}>Shares:</span> <span className="font-mono">{c.shares}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
