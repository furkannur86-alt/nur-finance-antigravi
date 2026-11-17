"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const MUNI_BONDS = [
  { issuer: "State of California", cusip: "13063D...", coupon: 5.0, maturity: "2035-06-01", yield: 3.42, teYield: 5.72, price: 112.50, rating: "AA-", sector: "GO", state: "CA", callable: true, taxStatus: "Tax-Exempt" },
  { issuer: "NYC Municipal Water", cusip: "649603...", coupon: 4.5, maturity: "2032-06-15", yield: 3.18, teYield: 5.32, price: 108.25, rating: "AA+", sector: "Water/Sewer", state: "NY", callable: false, taxStatus: "Tax-Exempt" },
  { issuer: "Texas Transportation", cusip: "882830...", coupon: 4.0, maturity: "2033-08-01", yield: 3.55, teYield: 5.93, price: 104.75, rating: "AAA", sector: "Transportation", state: "TX", callable: true, taxStatus: "Tax-Exempt" },
  { issuer: "Illinois GO Bonds", cusip: "452151...", coupon: 5.5, maturity: "2030-01-01", yield: 4.85, teYield: 8.10, price: 102.10, rating: "BBB+", sector: "GO", state: "IL", callable: false, taxStatus: "Tax-Exempt" },
  { issuer: "Florida Board of Education", cusip: "341271...", coupon: 3.5, maturity: "2034-07-01", yield: 3.22, teYield: 5.38, price: 101.80, rating: "AAA", sector: "Education", state: "FL", callable: true, taxStatus: "Tax-Exempt" },
  { issuer: "NJ Turnpike Authority", cusip: "646136...", coupon: 5.25, maturity: "2031-01-01", yield: 3.95, teYield: 6.60, price: 106.40, rating: "A+", sector: "Transportation", state: "NJ", callable: false, taxStatus: "Tax-Exempt" },
  { issuer: "Denver Airport", cusip: "249182...", coupon: 4.25, maturity: "2036-11-15", yield: 3.78, teYield: 6.32, price: 105.20, rating: "A", sector: "Airport", state: "CO", callable: true, taxStatus: "AMT" },
  { issuer: "Puerto Rico COFINA", cusip: "745177...", coupon: 0.0, maturity: "2058-07-01", yield: 8.50, teYield: 14.20, price: 42.80, rating: "NR", sector: "Sales Tax", state: "PR", callable: false, taxStatus: "Tax-Exempt" },
];

type Tab = "market" | "analysis" | "curves";

export default function MunicipalBondPanel() {
  const [tab, setTab] = useState<Tab>("market");
  const [taxRate, setTaxRate] = useState(37);

  const avgYield = MUNI_BONDS.reduce((s, b) => s + b.yield, 0) / MUNI_BONDS.length;
  const avgTeYield = MUNI_BONDS.reduce((s, b) => s + b.teYield, 0) / MUNI_BONDS.length;

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
          {(["market", "analysis", "curves"] as Tab[]).map(t => (
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
          { label: "AVG YIELD", value: `${avgYield.toFixed(2)}%`, color: "#38bdf8" },
          { label: "TAX-EQ YIELD", value: `${avgTeYield.toFixed(2)}%`, color: "#22c55e" },
          { label: "MUNI/TSY RATIO", value: "72%", color: "#fbbf24" },
          { label: "TAX BRACKET", value: `${taxRate}%`, color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "market" && (
          <div className="space-y-1.5">
            {MUNI_BONDS.map((b, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{b.issuer}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{b.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: b.rating.startsWith("A") ? "#22c55e" : b.rating.startsWith("B") ? "#fbbf24" : "#ef4444" }}>
                      {b.rating}
                    </span>
                    <span className="px-1 py-0.5 rounded text-[7px]" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                      {b.sector}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Cpn:</span> <span className="font-mono">{b.coupon}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Mat:</span> <span className="font-mono">{b.maturity.slice(0, 7)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Yield:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{b.yield.toFixed(2)}%</span></div>
                  <div><span style={{ color: "#64748b" }}>TE Yld:</span> <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{b.teYield.toFixed(2)}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Price:</span> <span className="font-mono">{b.price.toFixed(2)}</span></div>
                  <div>
                    {b.callable && <span className="px-1 rounded text-[7px]" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>CALLABLE</span>}
                    {b.taxStatus === "AMT" && <span className="px-1 rounded text-[7px] ml-1" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>AMT</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analysis" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>TAX-EQUIVALENT YIELD CALCULATOR</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px]" style={{ color: "#64748b" }}>Federal Tax Rate:</span>
                <input type="range" min={10} max={40} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="flex-1" />
                <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{taxRate}%</span>
              </div>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>
                Tax-Equivalent Yield = Muni Yield / (1 - Tax Rate)
              </div>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STATE CREDIT OVERVIEW</div>
            {[
              { state: "California", rating: "AA-", spread: 45, outlook: "Stable", debtPerCap: 4850 },
              { state: "New York", rating: "AA+", spread: 25, outlook: "Stable", debtPerCap: 7200 },
              { state: "Texas", rating: "AAA", spread: 15, outlook: "Positive", debtPerCap: 1850 },
              { state: "Illinois", rating: "BBB+", spread: 185, outlook: "Negative", debtPerCap: 5400 },
              { state: "Florida", rating: "AAA", spread: 10, outlook: "Stable", debtPerCap: 1420 },
              { state: "New Jersey", rating: "A+", spread: 85, outlook: "Stable", debtPerCap: 6800 },
            ].map(s => (
              <div key={s.state} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20" style={{ color: "#e2e8f0" }}>{s.state}</span>
                <span className="font-mono w-10" style={{ color: s.rating.startsWith("A") ? "#22c55e" : "#fbbf24" }}>{s.rating}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(s.spread, 200) / 2}%`, background: s.spread > 100 ? "#ef4444" : s.spread > 50 ? "#fbbf24" : "#22c55e" }} />
                </div>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>+{s.spread}bp</span>
                <span className="text-[9px] w-16 text-right" style={{ color: s.outlook === "Positive" ? "#22c55e" : s.outlook === "Negative" ? "#ef4444" : "#94a3b8" }}>
                  {s.outlook}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "curves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AAA MUNI vs TREASURY YIELD CURVE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {[
                  { tenor: "1Y", muni: 2.85, tsy: 4.52 },
                  { tenor: "2Y", muni: 2.92, tsy: 4.38 },
                  { tenor: "3Y", muni: 3.05, tsy: 4.25 },
                  { tenor: "5Y", muni: 3.18, tsy: 4.15 },
                  { tenor: "7Y", muni: 3.28, tsy: 4.22 },
                  { tenor: "10Y", muni: 3.42, tsy: 4.35 },
                  { tenor: "15Y", muni: 3.65, tsy: 4.52 },
                  { tenor: "20Y", muni: 3.78, tsy: 4.65 },
                  { tenor: "30Y", muni: 3.85, tsy: 4.72 },
                ].map(p => (
                  <div key={p.tenor} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full flex gap-px justify-center" style={{ height: 90 }}>
                      <div className="flex flex-col-reverse" style={{ width: "40%" }}>
                        <div className="rounded-t" style={{ height: `${(p.muni / 5) * 100}%`, background: "#22c55e" }} />
                      </div>
                      <div className="flex flex-col-reverse" style={{ width: "40%" }}>
                        <div className="rounded-t" style={{ height: `${(p.tsy / 5) * 100}%`, background: "#38bdf8", opacity: 0.5 }} />
                      </div>
                    </div>
                    <span className="text-[7px]" style={{ color: "#64748b" }}>{p.tenor}</span>
                    <span className="text-[7px] font-mono" style={{ color: "#22c55e" }}>{p.muni}%</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2 text-[8px]">
                <span style={{ color: "#22c55e" }}>■ AAA Muni</span>
                <span style={{ color: "#38bdf8", opacity: 0.5 }}>■ UST</span>
              </div>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MUNI/TREASURY RATIO BY TENOR</div>
            {[
              { tenor: "2Y", ratio: 66.7 }, { tenor: "5Y", ratio: 76.6 }, { tenor: "10Y", ratio: 78.6 },
              { tenor: "20Y", ratio: 81.3 }, { tenor: "30Y", ratio: 81.6 },
            ].map(r => (
              <div key={r.tenor} className="flex items-center gap-2 text-[9px]">
                <span className="font-mono w-8" style={{ color: "#94a3b8" }}>{r.tenor}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.ratio}%`, background: r.ratio > 80 ? "#ef4444" : r.ratio > 70 ? "#fbbf24" : "#22c55e" }} />
                </div>
                <span className="font-mono w-10 text-right" style={{ color: r.ratio > 80 ? "#ef4444" : "#fbbf24" }}>{r.ratio}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
