"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "analytics" | "migration" | "default-prob" | "recovery";

export default function CreditPortfolioPanel() {
  const [tab, setTab] = useState<Tab>("analytics");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💳</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CREDIT PORTFOLIO</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg CRED</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["analytics", "migration", "default-prob", "recovery"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "default-prob" ? "PD" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "analytics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CREDIT PORTFOLIO SUMMARY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Portfolio Par", val: "$4.2B", color: "#00e5a0" },
                { label: "Avg Rating", val: "BBB+", color: "#22c55e" },
                { label: "Spread DV01", val: "$1.85M", color: "#fbbf24" },
                { label: "Credit VaR (95%)", val: "$42M", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RATING DISTRIBUTION</div>
            {[
              { rating: "AAA", pct: 5, par: "$210M", color: "#22c55e" },
              { rating: "AA", pct: 12, par: "$504M", color: "#22c55e" },
              { rating: "A", pct: 28, par: "$1.18B", color: "#38bdf8" },
              { rating: "BBB", pct: 35, par: "$1.47B", color: "#fbbf24" },
              { rating: "BB", pct: 12, par: "$504M", color: "#f97316" },
              { rating: "B", pct: 5, par: "$210M", color: "#ef4444" },
              { rating: "CCC/below", pct: 3, par: "$126M", color: "#ef4444" },
            ].map(r => (
              <div key={r.rating} className="flex items-center gap-2 p-1 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-mono font-bold" style={{ color: r.color }}>{r.rating}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct * 2.5}%`, background: r.color, opacity: 0.5 }} />
                </div>
                <span className="font-mono w-10 text-right">{r.pct}%</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{r.par}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR EXPOSURE</div>
            {[
              { sector: "Financials", pct: 22, spread: 85 },
              { sector: "Technology", pct: 15, spread: 72 },
              { sector: "Healthcare", pct: 12, spread: 95 },
              { sector: "Energy", pct: 10, spread: 125 },
              { sector: "Industrials", pct: 10, spread: 88 },
              { sector: "Consumer", pct: 8, spread: 105 },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-1 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24">{s.sector}</span>
                <span className="font-mono w-10 text-right">{s.pct}%</span>
                <span className="font-mono w-16 text-right" style={{ color: s.spread > 100 ? "#fbbf24" : "#64748b" }}>{s.spread}bp</span>
              </div>
            ))}
          </div>
        )}

        {tab === "migration" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CREDIT MIGRATION MATRIX (1Y TRANSITION %)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[8px]">
                <thead>
                  <tr>
                    <th className="text-left p-1" style={{ color: "#64748b" }}>From\To</th>
                    {["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "D"].map(r => (
                      <th key={r} className="p-1 text-center" style={{ color: "#64748b" }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { from: "AAA", to: [90.8, 7.6, 0.6, 0.1, 0.0, 0.0, 0.0, 0.0] },
                    { from: "AA", to: [0.6, 90.5, 7.8, 0.6, 0.1, 0.1, 0.0, 0.0] },
                    { from: "A", to: [0.1, 2.2, 91.5, 5.2, 0.6, 0.2, 0.0, 0.1] },
                    { from: "BBB", to: [0.0, 0.3, 4.8, 88.5, 4.5, 1.0, 0.2, 0.3] },
                    { from: "BB", to: [0.0, 0.1, 0.5, 6.5, 82.5, 7.5, 1.2, 1.5] },
                    { from: "B", to: [0.0, 0.0, 0.2, 0.4, 5.8, 80.5, 8.5, 4.2] },
                    { from: "CCC", to: [0.0, 0.0, 0.1, 0.3, 1.5, 12.5, 55.0, 28.5] },
                  ].map(row => (
                    <tr key={row.from}>
                      <td className="p-1 font-bold" style={{ color: "#00e5a0" }}>{row.from}</td>
                      {row.to.map((val, j) => (
                        <td key={j} className="p-1 font-mono text-center" style={{
                          color: val > 80 ? "#22c55e" : val > 5 ? "#fbbf24" : val > 1 ? "#f97316" : "#64748b",
                          background: val > 80 ? "rgba(34,197,94,0.05)" : "transparent",
                        }}>{val > 0 ? val.toFixed(1) : "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "default-prob" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>IMPLIED DEFAULT PROBABILITIES</div>
            {[
              { name: "JPMorgan Chase", rating: "AA-", pd1y: 0.03, pd5y: 0.45, cds: 42, zScore: 2.85 },
              { name: "AT&T Inc", rating: "BBB", pd1y: 0.18, pd5y: 2.85, cds: 85, zScore: 1.95 },
              { name: "Ford Motor Co", rating: "BB+", pd1y: 0.65, pd5y: 5.20, cds: 185, zScore: 1.42 },
              { name: "Carnival Corp", rating: "BB-", pd1y: 1.25, pd5y: 8.50, cds: 285, zScore: 1.05 },
              { name: "AMC Networks", rating: "B+", pd1y: 2.85, pd5y: 15.20, cds: 520, zScore: 0.65 },
              { name: "Rite Aid Corp", rating: "CCC", pd1y: 12.50, pd5y: 42.00, cds: 2500, zScore: -0.85 },
            ].map(d => (
              <div key={d.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{d.name}</span>
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{
                      background: d.rating.startsWith("A") ? "rgba(34,197,94,0.1)" : d.rating.startsWith("BB") ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)",
                      color: d.rating.startsWith("A") ? "#22c55e" : d.rating.startsWith("BB") ? "#fbbf24" : "#ef4444",
                    }}>{d.rating}</span>
                  </div>
                  <span className="font-mono" style={{ color: d.zScore > 2 ? "#22c55e" : d.zScore > 1 ? "#fbbf24" : "#ef4444" }}>Z: {d.zScore}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>PD (1Y):</span> <span className="font-mono" style={{ color: d.pd1y > 2 ? "#ef4444" : d.pd1y > 0.5 ? "#fbbf24" : "#22c55e" }}>{d.pd1y}%</span></div>
                  <div><span style={{ color: "#64748b" }}>PD (5Y):</span> <span className="font-mono" style={{ color: d.pd5y > 10 ? "#ef4444" : d.pd5y > 3 ? "#fbbf24" : "#22c55e" }}>{d.pd5y}%</span></div>
                  <div><span style={{ color: "#64748b" }}>CDS 5Y:</span> <span className="font-mono">{d.cds}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Z-Score:</span> <span className="font-mono">{d.zScore}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recovery" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECOVERY RATE ASSUMPTIONS BY SENIORITY</div>
            {[
              { seniority: "Senior Secured (1st Lien)", recovery: 65, range: "50-80%", historical: 67 },
              { seniority: "Senior Secured (2nd Lien)", recovery: 42, range: "25-55%", historical: 45 },
              { seniority: "Senior Unsecured", recovery: 38, range: "20-50%", historical: 40 },
              { seniority: "Senior Subordinated", recovery: 25, range: "10-35%", historical: 28 },
              { seniority: "Subordinated", recovery: 18, range: "5-25%", historical: 20 },
              { seniority: "Junior Subordinated", recovery: 10, range: "2-15%", historical: 12 },
            ].map(r => (
              <div key={r.seniority} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{r.seniority}</span>
                  <span className="font-mono font-bold" style={{ color: r.recovery > 50 ? "#22c55e" : r.recovery > 30 ? "#fbbf24" : "#ef4444" }}>{r.recovery}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${r.recovery}%`, background: r.recovery > 50 ? "rgba(34,197,94,0.5)" : r.recovery > 30 ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.5)" }} />
                  </div>
                  <span className="text-[9px] w-20" style={{ color: "#64748b" }}>{r.range}</span>
                  <span className="font-mono w-10 text-right text-[9px]" style={{ color: "#64748b" }}>{r.historical}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT DEFAULTS & RECOVERIES</div>
            {[
              { name: "Envision Healthcare", date: "Sep 2026", recovery: 28, seniority: "1L Secured" },
              { name: "Rite Aid Corp", date: "Aug 2026", recovery: 15, seniority: "Unsecured" },
              { name: "Yellow Corp", date: "Jul 2026", recovery: 42, seniority: "1L Secured" },
            ].map(d => (
              <div key={d.name} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36 font-bold">{d.name}</span>
                <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{d.date}</span>
                <span className="text-[8px]" style={{ color: "#64748b" }}>{d.seniority}</span>
                <span className="font-mono font-bold ml-auto" style={{ color: d.recovery > 30 ? "#fbbf24" : "#ef4444" }}>{d.recovery}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
