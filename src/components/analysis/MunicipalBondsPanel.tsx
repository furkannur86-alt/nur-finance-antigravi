"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "market" | "sectors" | "credits" | "calendar";

export default function MunicipalBondsPanel() {
  const [tab, setTab] = useState<Tab>("market");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏛️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MUNICIPAL BONDS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Bloomberg MUNI</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["market", "sectors", "credits", "calendar"] as Tab[]).map(t => (
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
          { label: "AAA 10Y", value: "3.12%", color: "#22c55e" },
          { label: "MUNI/TSY", value: "72.5%", color: "#38bdf8" },
          { label: "HY MUNI", value: "+285bp", color: "#fbbf24" },
          { label: "WEEKLY SUPPLY", value: "$8.5B", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AAA MMD BENCHMARK CURVE</div>
            {[
              { tenor: "1Y", yield: 2.65, change: -2, taxEq: 4.42, ratio: 58.5 },
              { tenor: "2Y", yield: 2.72, change: -3, taxEq: 4.53, ratio: 62.4 },
              { tenor: "5Y", yield: 2.88, change: -1, taxEq: 4.80, ratio: 68.2 },
              { tenor: "10Y", yield: 3.12, change: 2, taxEq: 5.20, ratio: 72.5 },
              { tenor: "20Y", yield: 3.68, change: 3, taxEq: 6.13, ratio: 78.4 },
              { tenor: "30Y", yield: 3.85, change: 4, taxEq: 6.42, ratio: 82.5 },
            ].map(t => (
              <div key={t.tenor} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-8 font-bold" style={{ color: "#22c55e" }}>{t.tenor}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(t.yield / 4.5) * 100}%`, background: "#22c55e", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-14 text-right font-bold">{t.yield}%</span>
                <span className="font-mono w-10 text-right text-[9px]" style={{ color: t.change >= 0 ? "#ef4444" : "#22c55e" }}>{t.change >= 0 ? "+" : ""}{t.change}bp</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#38bdf8" }}>TEY: {t.taxEq}%</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>M/T: {t.ratio}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>FUND FLOWS (WEEKLY)</div>
            {[
              { period: "This Week", flow: 1.2, cumulative: 42.5 },
              { period: "Last Week", flow: 0.8, cumulative: 41.3 },
              { period: "4-Week Avg", flow: 0.95, cumulative: 0 },
              { period: "YTD Total", flow: 42.5, cumulative: 42.5 },
            ].map(f => (
              <div key={f.period} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span>{f.period}</span>
                <span className="font-mono font-bold" style={{ color: f.flow >= 0 ? "#22c55e" : "#ef4444" }}>
                  {f.flow >= 0 ? "+" : ""}${f.flow}B
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "sectors" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>SECTOR SPREAD COMPARISON (AA, 10Y)</div>
            {[
              { sector: "General Obligation", spread: 15, change: -2, volume: "$185B", default: "0.00%" },
              { sector: "Water & Sewer Revenue", spread: 25, change: -1, volume: "$142B", default: "0.00%" },
              { sector: "Transportation (Toll)", spread: 45, change: 3, volume: "$85B", default: "0.02%" },
              { sector: "Electric Revenue", spread: 35, change: -2, volume: "$68B", default: "0.01%" },
              { sector: "Hospital/Healthcare", spread: 65, change: 5, volume: "$52B", default: "0.42%" },
              { sector: "Higher Education", spread: 42, change: 0, volume: "$38B", default: "0.05%" },
              { sector: "Housing (MFH)", spread: 55, change: 2, volume: "$28B", default: "0.08%" },
              { sector: "Tax Increment (TIF)", spread: 125, change: 8, volume: "$15B", default: "0.85%" },
              { sector: "Tobacco Settlement", spread: 185, change: -5, volume: "$12B", default: "1.25%" },
            ].map(s => (
              <div key={s.sector} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.sector}</span>
                  <span className="font-mono" style={{ color: "#22c55e" }}>+{s.spread}bp</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: s.change <= 0 ? "#22c55e" : "#ef4444" }}>{s.change > 0 ? "+" : ""}{s.change}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{s.volume}</span></div>
                  <div><span style={{ color: "#64748b" }}>Def Rate:</span> <span className="font-mono" style={{ color: parseFloat(s.default) > 0.5 ? "#ef4444" : parseFloat(s.default) > 0.1 ? "#fbbf24" : "#22c55e" }}>{s.default}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "credits" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CREDIT WATCH — RECENT RATING ACTIONS</div>
            {[
              { issuer: "City of Chicago GO", action: "UPGRADE", from: "BBB-", to: "BBB", agency: "S&P", date: "Nov 2026" },
              { issuer: "Puerto Rico COFINA", action: "UPGRADE", from: "BB", to: "BB+", agency: "Fitch", date: "Oct 2026" },
              { issuer: "NYC Transitional Finance", action: "AFFIRM", from: "AAA", to: "AAA", agency: "Moody's", date: "Nov 2026" },
              { issuer: "Illinois GO", action: "OUTLOOK+", from: "BBB+", to: "BBB+", agency: "S&P", date: "Sep 2026" },
              { issuer: "San Francisco Airport", action: "DOWNGRADE", from: "AA", to: "AA-", agency: "Fitch", date: "Oct 2026" },
              { issuer: "NJ Turnpike Authority", action: "AFFIRM", from: "A+", to: "A+", agency: "S&P", date: "Nov 2026" },
            ].map(c => (
              <div key={`${c.issuer}-${c.agency}`} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.issuer}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: c.action === "UPGRADE" || c.action === "OUTLOOK+" ? "rgba(34,197,94,0.15)" : c.action === "DOWNGRADE" ? "rgba(239,68,68,0.15)" : "rgba(56,189,248,0.15)",
                    color: c.action === "UPGRADE" || c.action === "OUTLOOK+" ? "#22c55e" : c.action === "DOWNGRADE" ? "#ef4444" : "#38bdf8"
                  }}>{c.action}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Rating:</span> <span className="font-mono">{c.from} → {c.to}</span></div>
                  <div><span style={{ color: "#64748b" }}>Agency:</span> <span>{c.agency}</span></div>
                  <div><span style={{ color: "#64748b" }}>Date:</span> <span className="font-mono">{c.date}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calendar" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NEW ISSUE CALENDAR — THIS WEEK</div>
            {[
              { issuer: "State of California GO", size: "$2.5B", coupon: "5.00%", maturity: "2054", rating: "Aa2/AA-", pricing: "Mon", type: "Competitive" },
              { issuer: "NYC Water Authority", size: "$1.2B", coupon: "5.25%", maturity: "2048", rating: "Aa1/AA+", pricing: "Tue", type: "Negotiated" },
              { issuer: "TX Transportation Comm", size: "$850M", coupon: "5.00%", maturity: "2052", rating: "Aaa/AAA", pricing: "Tue", type: "Competitive" },
              { issuer: "IL Finance Authority", size: "$425M", coupon: "5.50%", maturity: "2044", rating: "A1/A+", pricing: "Wed", type: "Negotiated" },
              { issuer: "Denver Airport Revenue", size: "$680M", coupon: "5.25%", maturity: "2050", rating: "A1/A+", pricing: "Thu", type: "Negotiated" },
            ].map(i => (
              <div key={i.issuer} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#22c55e" }}>{i.issuer}</span>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{i.size}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Cpn:</span> <span className="font-mono">{i.coupon}</span></div>
                  <div><span style={{ color: "#64748b" }}>Mat:</span> <span className="font-mono">{i.maturity}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rtg:</span> <span className="font-mono">{i.rating}</span></div>
                  <div><span style={{ color: "#64748b" }}>Price:</span> <span>{i.pricing}</span></div>
                  <div><span style={{ color: "#64748b" }}>{i.type}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>30-DAY VISIBLE SUPPLY</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total Supply", value: "$38.5B" },
                { label: "Competitive", value: "$12.8B" },
                { label: "Negotiated", value: "$25.7B" },
                { label: "vs 30d Avg", value: "+15%" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#22c55e" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
