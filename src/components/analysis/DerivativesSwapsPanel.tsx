"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "irs" | "cds" | "options" | "exotics";

export default function DerivativesSwapsPanel() {
  const [tab, setTab] = useState<Tab>("irs");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔄</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>DERIVATIVES & SWAPS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Bloomberg SWPM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["irs", "cds", "options", "exotics"] as Tab[]).map(t => (
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
          { label: "USD IRS 10Y", value: "4.28%", color: "#ef4444" },
          { label: "CDX IG", value: "+52bp", color: "#22c55e" },
          { label: "SWAPTION VOL", value: "68.5", color: "#fbbf24" },
          { label: "OTC NOTIONAL", value: "$632T", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "irs" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>INTEREST RATE SWAP CURVES</div>
            {[
              { ccy: "USD", y1: 4.52, y2: 4.38, y5: 4.15, y10: 4.28, y30: 4.42, basis: "SOFR" },
              { ccy: "EUR", y1: 3.42, y2: 3.18, y5: 2.85, y10: 2.95, y30: 3.05, basis: "ESTR" },
              { ccy: "GBP", y1: 4.85, y2: 4.62, y5: 4.28, y10: 4.35, y30: 4.48, basis: "SONIA" },
              { ccy: "JPY", y1: 0.42, y2: 0.55, y5: 0.78, y10: 1.12, y30: 1.65, basis: "TONA" },
              { ccy: "CHF", y1: 1.28, y2: 1.15, y5: 1.02, y10: 1.08, y30: 1.18, basis: "SARON" },
            ].map(c => (
              <div key={c.ccy} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#ef4444" }}>{c.ccy} Swaps</span>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Ref: {c.basis}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div className="text-center"><div className="text-[8px]" style={{ color: "#64748b" }}>1Y</div><div className="font-mono font-bold">{c.y1}%</div></div>
                  <div className="text-center"><div className="text-[8px]" style={{ color: "#64748b" }}>2Y</div><div className="font-mono font-bold">{c.y2}%</div></div>
                  <div className="text-center"><div className="text-[8px]" style={{ color: "#64748b" }}>5Y</div><div className="font-mono font-bold">{c.y5}%</div></div>
                  <div className="text-center"><div className="text-[8px]" style={{ color: "#64748b" }}>10Y</div><div className="font-mono font-bold">{c.y10}%</div></div>
                  <div className="text-center"><div className="text-[8px]" style={{ color: "#64748b" }}>30Y</div><div className="font-mono font-bold">{c.y30}%</div></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>SWAP SPREAD (vs Treasury)</div>
            {[
              { tenor: "2Y", spread: -12, change: -2 },
              { tenor: "5Y", spread: -8, change: 1 },
              { tenor: "10Y", spread: -5, change: 0 },
              { tenor: "30Y", spread: -18, change: -3 },
            ].map(s => (
              <div key={s.tenor} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-8">{s.tenor}</span>
                <div className="flex-1 mx-3 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.abs(s.spread) * 3}%`, background: s.spread < 0 ? "#ef4444" : "#22c55e", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: s.spread < 0 ? "#ef4444" : "#22c55e" }}>{s.spread}bp</span>
                <span className="font-mono w-10 text-right text-[9px]" style={{ color: s.change <= 0 ? "#ef4444" : "#22c55e" }}>{s.change > 0 ? "+" : ""}{s.change}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "cds" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>CREDIT DEFAULT SWAP INDICES</div>
            {[
              { index: "CDX NA IG S41", spread: 52, change: -2, roll: "Dec 2026", notional: "$85B" },
              { index: "CDX NA HY S41", spread: 345, change: 8, roll: "Dec 2026", notional: "$42B" },
              { index: "iTraxx Europe Main S40", spread: 58, change: -1, roll: "Dec 2026", notional: "$65B" },
              { index: "iTraxx Europe Xover S40", spread: 312, change: 5, roll: "Dec 2026", notional: "$28B" },
              { index: "CDX EM S40", spread: 185, change: 12, roll: "Dec 2026", notional: "$15B" },
            ].map(i => (
              <div key={i.index} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{i.index}</span>
                  <span className="font-mono font-bold" style={{ color: i.spread > 200 ? "#ef4444" : "#22c55e" }}>+{i.spread}bp</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: i.change <= 0 ? "#22c55e" : "#ef4444" }}>{i.change > 0 ? "+" : ""}{i.change}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Roll:</span> <span className="font-mono">{i.roll}</span></div>
                  <div><span style={{ color: "#64748b" }}>Notional:</span> <span className="font-mono">{i.notional}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>SINGLE-NAME CDS — WIDEST MOVERS</div>
            {[
              { name: "First Republic Bank", spread: 1250, change: 185, rating: "CCC+" },
              { name: "Dish Network", spread: 2800, change: -120, rating: "CCC-" },
              { name: "Spirit Airlines", spread: 3200, change: 450, rating: "CCC" },
              { name: "Rite Aid", spread: 4500, change: 280, rating: "CC" },
              { name: "Tupperware", spread: 8500, change: 1200, rating: "D" },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <span className="font-bold">{c.name}</span>
                  <span className="ml-2 text-[8px] font-mono" style={{ color: "#ef4444" }}>{c.rating}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px]">
                  <span style={{ color: "#ef4444" }}>{c.spread}bp</span>
                  <span style={{ color: c.change > 0 ? "#ef4444" : "#22c55e" }}>{c.change > 0 ? "+" : ""}{c.change}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "options" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SWAPTION VOLATILITY (USD, ATM Normal Vol in bp)</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Expiry\Tenor</th>
                    {["1Y","2Y","5Y","10Y","30Y"].map(t => <th key={t} className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { exp: "1M", vals: [42, 55, 68, 72, 65] },
                    { exp: "3M", vals: [48, 60, 72, 78, 70] },
                    { exp: "6M", vals: [52, 64, 76, 82, 74] },
                    { exp: "1Y", vals: [55, 68, 80, 85, 78] },
                    { exp: "5Y", vals: [62, 72, 82, 88, 82] },
                    { exp: "10Y", vals: [58, 68, 78, 84, 80] },
                  ].map(r => (
                    <tr key={r.exp} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#fbbf24" }}>{r.exp}</td>
                      {r.vals.map((v, i) => (
                        <td key={i} className="text-right px-2 py-1.5 font-mono" style={{ color: v > 80 ? "#ef4444" : v > 65 ? "#fbbf24" : "#22c55e" }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CAP/FLOOR PRICING (USD SOFR, Notl: $100M)</div>
            {[
              { type: "Cap 5.00% 2Y", premium: "42bp", delta: 0.25, gamma: 0.08 },
              { type: "Cap 5.00% 5Y", premium: "185bp", delta: 0.35, gamma: 0.05 },
              { type: "Floor 3.50% 2Y", premium: "28bp", delta: -0.18, gamma: 0.06 },
              { type: "Floor 3.50% 5Y", premium: "125bp", delta: -0.28, gamma: 0.04 },
            ].map(c => (
              <div key={c.type} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{c.type}</span>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#fbbf24" }}>{c.premium}</span>
                  <span><span style={{ color: "#64748b" }}>Δ:</span> {c.delta}</span>
                  <span><span style={{ color: "#64748b" }}>Γ:</span> {c.gamma}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "exotics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRUCTURED PRODUCTS PRICING</div>
            {[
              { product: "Callable Range Accrual (10Y)", coupon: "SOFR + 180bp", barrier: "3.0%-6.0%", indicative: "98.5" },
              { product: "CMS Spread Note (5Y)", coupon: "4× (10Y-2Y CMS)", barrier: ">0bp", indicative: "99.2" },
              { product: "Autocallable (3Y)", coupon: "12% p.a.", barrier: "70% SPX", indicative: "100.0" },
              { product: "Worst-of Barrier (2Y)", coupon: "15% p.a.", barrier: "60% (AAPL/MSFT/GOOGL)", indicative: "99.8" },
              { product: "Snowball (3Y)", coupon: "18% if no KI", barrier: "75% SX5E", indicative: "100.0" },
            ].map(p => (
              <div key={p.product} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="font-bold mb-1" style={{ color: "#ef4444" }}>{p.product}</div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Coupon:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{p.coupon}</span></div>
                  <div><span style={{ color: "#64748b" }}>Barrier:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{p.barrier}</span></div>
                  <div><span style={{ color: "#64748b" }}>Ind:</span> <span className="font-mono">{p.indicative}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>TOTAL RETURN SWAP RATES</div>
            {[
              { underlier: "S&P 500 TRS", funding: "SOFR + 35bp", term: "1Y", notional: "$5B/day" },
              { underlier: "Euro Stoxx 50 TRS", funding: "ESTR + 25bp", term: "1Y", notional: "$2B/day" },
              { underlier: "Nikkei 225 TRS", funding: "TONA + 45bp", term: "1Y", notional: "$800M/day" },
              { underlier: "IG Corp Bond TRS", funding: "SOFR + 55bp", term: "6M", notional: "$1.2B/day" },
            ].map(t => (
              <div key={t.underlier} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{t.underlier}</span>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#22c55e" }}>{t.funding}</span>
                  <span style={{ color: "#64748b" }}>{t.term}</span>
                  <span style={{ color: "#fbbf24" }}>{t.notional}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
