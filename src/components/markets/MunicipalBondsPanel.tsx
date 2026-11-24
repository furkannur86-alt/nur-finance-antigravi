"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "market" | "curves" | "credit" | "issuance";

export default function MunicipalBondsPanel() {
  const [tab, setTab] = useState<Tab>("market");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏙️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MUNICIPAL BONDS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg MUNI</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["market", "curves", "credit", "issuance"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MUNICIPAL MARKET OVERVIEW</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Outstanding", val: "$4.1T", color: "#00e5a0" },
                { label: "30D Issuance", val: "$42.5B", color: "#38bdf8" },
                { label: "Muni/Treasury Ratio", val: "82%", color: "#fbbf24" },
                { label: "Fund Flows (Wk)", val: "+$1.2B", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BENCHMARK AAA MMD YIELDS</div>
            {[
              { tenor: "1Y", yield: 2.65, chg: -2, ratio: 61 },
              { tenor: "2Y", yield: 2.72, chg: -1, ratio: 63 },
              { tenor: "5Y", yield: 2.85, chg: 0, ratio: 68 },
              { tenor: "10Y", yield: 3.15, chg: 2, ratio: 75 },
              { tenor: "20Y", yield: 3.65, chg: 3, ratio: 82 },
              { tenor: "30Y", yield: 3.85, chg: 2, ratio: 88 },
            ].map(r => (
              <div key={r.tenor} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-10 font-bold">{r.tenor}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#00e5a0" }}>{r.yield}%</span>
                <span className="font-mono w-14" style={{ color: r.chg === 0 ? "#64748b" : r.chg > 0 ? "#ef4444" : "#22c55e" }}>{r.chg >= 0 ? "+" : ""}{r.chg}bp</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.ratio}%`, background: "rgba(167,139,250,0.4)" }} />
                </div>
                <span className="font-mono w-12 text-right" style={{ color: "#a78bfa" }}>{r.ratio}%</span>
                <span className="text-[8px]" style={{ color: "#64748b" }}>M/T</span>
              </div>
            ))}
          </div>
        )}

        {tab === "curves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AAA MUNI vs TREASURY CURVES</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {["1Y", "2Y", "5Y", "10Y", "20Y", "30Y"].map((t, i) => {
                const muni = [2.65, 2.72, 2.85, 3.15, 3.65, 3.85];
                const tsy = [4.35, 4.32, 4.18, 4.20, 4.45, 4.38];
                const mx = 30 + i * 68;
                const my = 90 - (muni[i] - 2.5) * 40;
                const ty = 90 - (tsy[i] - 2.5) * 40;
                return (
                  <g key={t}>
                    <circle cx={mx} cy={my} r={3} fill="#a78bfa" />
                    <circle cx={mx} cy={ty} r={3} fill="#38bdf8" />
                    <text x={mx} y={my - 8} textAnchor="middle" fill="#a78bfa" fontSize="6">{muni[i]}</text>
                    <text x={mx} y={ty - 8} textAnchor="middle" fill="#38bdf8" fontSize="6">{tsy[i]}</text>
                    <text x={mx} y="98" textAnchor="middle" fill="#64748b" fontSize="5">{t}</text>
                  </g>
                );
              })}
              <text x="10" y="10" fill="#a78bfa" fontSize="6">Muni</text>
              <text x="10" y="18" fill="#38bdf8" fontSize="6">Treasury</text>
            </svg>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MUNI/TREASURY RATIOS BY TENOR</div>
            {[
              { tenor: "5Y", ratio: 68, prev: 70, avg: 72 },
              { tenor: "10Y", ratio: 75, prev: 77, avg: 78 },
              { tenor: "30Y", ratio: 88, prev: 85, avg: 85 },
            ].map(r => (
              <div key={r.tenor} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-10 font-bold">{r.tenor}</span>
                <span className="font-mono font-bold" style={{ color: r.ratio < r.avg ? "#22c55e" : "#ef4444" }}>{r.ratio}%</span>
                <span className="text-[9px]" style={{ color: "#64748b" }}>Prev: {r.prev}%</span>
                <span className="text-[9px]" style={{ color: "#64748b" }}>5Y Avg: {r.avg}%</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: r.ratio < r.avg ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: r.ratio < r.avg ? "#22c55e" : "#ef4444",
                }}>{r.ratio < r.avg ? "CHEAP" : "RICH"}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "credit" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MUNI CREDIT SPREADS (vs AAA)</div>
            {[
              { rating: "AA", spread: 15, chg: -1, vol: "$1.8T" },
              { rating: "A", spread: 45, chg: 2, vol: "$850B" },
              { rating: "BBB", spread: 95, chg: 5, vol: "$320B" },
              { rating: "HY (BB)", spread: 185, chg: -8, vol: "$85B" },
              { rating: "HY (B)", spread: 350, chg: 12, vol: "$25B" },
            ].map(c => (
              <div key={c.rating} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-bold">{c.rating}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#fbbf24" }}>{c.spread}bp</span>
                <span className="font-mono w-14" style={{ color: c.chg > 0 ? "#ef4444" : "#22c55e" }}>{c.chg >= 0 ? "+" : ""}{c.chg}bp</span>
                <span className="font-mono ml-auto" style={{ color: "#64748b" }}>{c.vol}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR SPREADS (10Y A-rated)</div>
            {[
              { sector: "GO — State", spread: 35, outlook: "Stable" },
              { sector: "GO — Local", spread: 55, outlook: "Stable" },
              { sector: "Water/Sewer", spread: 42, outlook: "Positive" },
              { sector: "Transportation", spread: 68, outlook: "Stable" },
              { sector: "Healthcare", spread: 85, outlook: "Negative" },
              { sector: "Higher Education", spread: 72, outlook: "Stable" },
              { sector: "Tobacco Settlement", spread: 125, outlook: "Negative" },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32">{s.sector}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#fbbf24" }}>{s.spread}bp</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: s.outlook === "Positive" ? "rgba(34,197,94,0.1)" : s.outlook === "Negative" ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)",
                  color: s.outlook === "Positive" ? "#22c55e" : s.outlook === "Negative" ? "#ef4444" : "#64748b",
                }}>{s.outlook}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "issuance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING NEW ISSUES</div>
            {[
              { issuer: "State of California", type: "GO", size: "$2.5B", rating: "AA-", pricing: "Nov 25", maturity: "2054" },
              { issuer: "NYC Water Authority", type: "Revenue", size: "$1.8B", rating: "AA+", pricing: "Nov 26", maturity: "2049" },
              { issuer: "TX Dept of Trans", type: "Revenue", size: "$1.2B", rating: "AAA", pricing: "Nov 25", maturity: "2044" },
              { issuer: "IL State", type: "GO", size: "$800M", rating: "BBB+", pricing: "Nov 27", maturity: "2039" },
              { issuer: "NJ Turnpike Auth", type: "Revenue", size: "$650M", rating: "A+", pricing: "Nov 26", maturity: "2048" },
            ].map(i => (
              <div key={i.issuer} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{i.issuer}</span>
                  <span className="font-mono" style={{ color: "#00e5a0" }}>{i.size}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Type:</span> <span>{i.type}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rating:</span> <span className="font-mono" style={{ color: i.rating.startsWith("AAA") ? "#22c55e" : i.rating.startsWith("AA") ? "#38bdf8" : "#fbbf24" }}>{i.rating}</span></div>
                  <div><span style={{ color: "#64748b" }}>Price:</span> <span>{i.pricing}</span></div>
                  <div><span style={{ color: "#64748b" }}>Mat:</span> <span className="font-mono">{i.maturity}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
