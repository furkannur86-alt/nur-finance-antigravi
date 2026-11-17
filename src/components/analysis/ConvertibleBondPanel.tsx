"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const CONVERTIBLES = [
  { issuer: "Tesla Inc.", ticker: "TSLA", coupon: 2.0, maturity: "2028-05-15", convPrice: 310.00, stockPrice: 285.40, parity: 92.06, premium: 8.6, delta: 0.62, yield: 3.8, size: 1800, rating: "BBB-", bondPrice: 99.75 },
  { issuer: "MicroStrategy", ticker: "MSTR", coupon: 0.0, maturity: "2029-06-15", convPrice: 480.00, stockPrice: 425.80, parity: 88.71, premium: 12.4, delta: 0.55, yield: 2.1, size: 2050, rating: "B", bondPrice: 99.60 },
  { issuer: "Airbnb Inc.", ticker: "ABNB", coupon: 0.0, maturity: "2027-03-15", convPrice: 190.00, stockPrice: 158.20, parity: 83.26, premium: 20.1, delta: 0.42, yield: 4.2, size: 2000, rating: "NR", bondPrice: 100.10 },
  { issuer: "Palo Alto Networks", ticker: "PANW", coupon: 0.375, maturity: "2028-06-01", convPrice: 420.00, stockPrice: 395.50, parity: 94.17, premium: 6.2, delta: 0.72, yield: 1.5, size: 1500, rating: "BBB+", bondPrice: 100.00 },
  { issuer: "Shopify Inc.", ticker: "SHOP", coupon: 0.125, maturity: "2027-11-01", convPrice: 92.00, stockPrice: 108.40, parity: 117.83, premium: -15.1, delta: 0.95, yield: -1.8, size: 920, rating: "NR", bondPrice: 100.25 },
  { issuer: "Snap Inc.", ticker: "SNAP", coupon: 0.75, maturity: "2028-08-01", convPrice: 22.00, stockPrice: 14.50, parity: 65.91, premium: 51.7, delta: 0.18, yield: 8.5, size: 1100, rating: "B-", bondPrice: 99.50 },
  { issuer: "Unity Software", ticker: "U", coupon: 2.0, maturity: "2027-11-15", convPrice: 48.00, stockPrice: 32.80, parity: 68.33, premium: 46.3, delta: 0.22, yield: 7.2, size: 850, rating: "NR", bondPrice: 100.00 },
];

type Tab = "overview" | "greeks" | "new";

export default function ConvertibleBondPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const [sortBy, setSortBy] = useState<"premium" | "delta" | "yield">("premium");

  const sorted = [...CONVERTIBLES].sort((a, b) => {
    if (sortBy === "premium") return a.premium - b.premium;
    if (sortBy === "delta") return b.delta - a.delta;
    return b.yield - a.yield;
  });

  const totalSize = CONVERTIBLES.reduce((s, c) => s + c.size, 0);
  const avgPremium = CONVERTIBLES.reduce((s, c) => s + c.premium, 0) / CONVERTIBLES.length;
  const itmCount = CONVERTIBLES.filter(c => c.stockPrice > c.convPrice).length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔀</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CONVERTIBLE BONDS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Bloomberg CNVT</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "greeks", "new"] as Tab[]).map(t => (
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
          { label: "TOTAL OUTSTANDING", value: `$${(totalSize / 1000).toFixed(1)}B`, color: "#38bdf8" },
          { label: "AVG PREMIUM", value: `${avgPremium.toFixed(1)}%`, color: "#fbbf24" },
          { label: "IN-THE-MONEY", value: `${itmCount}/${CONVERTIBLES.length}`, color: "#22c55e" },
          { label: "AVG DELTA", value: (CONVERTIBLES.reduce((s, c) => s + c.delta, 0) / CONVERTIBLES.length).toFixed(2), color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <>
            <div className="flex gap-1 mb-2">
              {(["premium", "delta", "yield"] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className="px-2 py-0.5 rounded text-[9px] font-bold uppercase"
                  style={{ background: sortBy === s ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.03)", color: sortBy === s ? "#00e5a0" : "#64748b" }}>
                  Sort: {s}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {sorted.map(c => {
                const itm = c.stockPrice > c.convPrice;
                return (
                  <div key={c.ticker} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${itm ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                        <span style={{ color: "#94a3b8" }}>{c.issuer}</span>
                        <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{c.coupon}% {c.maturity.slice(0, 7)}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                        style={{ background: itm ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: itm ? "#22c55e" : "#ef4444" }}>
                        {itm ? "ITM" : "OTM"}
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-[9px]">
                      <div><span style={{ color: "#64748b" }}>Stock:</span> <span className="font-mono" style={{ color: "#e2e8f0" }}>${c.stockPrice}</span></div>
                      <div><span style={{ color: "#64748b" }}>Conv:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>${c.convPrice}</span></div>
                      <div><span style={{ color: "#64748b" }}>Parity:</span> <span className="font-mono" style={{ color: c.parity > 100 ? "#22c55e" : "#e2e8f0" }}>{c.parity.toFixed(1)}</span></div>
                      <div><span style={{ color: "#64748b" }}>Prem:</span> <span className="font-mono" style={{ color: c.premium < 0 ? "#22c55e" : c.premium > 30 ? "#ef4444" : "#fbbf24" }}>{c.premium.toFixed(1)}%</span></div>
                      <div><span style={{ color: "#64748b" }}>Delta:</span> <span className="font-mono" style={{ color: "#a855f7" }}>{c.delta.toFixed(2)}</span></div>
                      <div><span style={{ color: "#64748b" }}>Yield:</span> <span className="font-mono" style={{ color: c.yield > 5 ? "#22c55e" : "#e2e8f0" }}>{c.yield.toFixed(1)}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "greeks" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-2" style={{ color: "#64748b" }}>Convertible bond sensitivity analysis (Greeks)</div>
            {CONVERTIBLES.map(c => (
              <div key={c.ticker} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker} {c.coupon}% {c.maturity.slice(0, 7)}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>${c.size}M outstanding</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    { label: "Delta", value: c.delta.toFixed(2), color: "#a855f7" },
                    { label: "Gamma", value: (c.delta * 0.08).toFixed(3), color: "#38bdf8" },
                    { label: "Vega", value: (c.delta * 15).toFixed(1), color: "#22c55e" },
                    { label: "Theta", value: (-0.02 * (1 - c.delta)).toFixed(3), color: "#ef4444" },
                    { label: "Rho", value: (c.delta * -0.5).toFixed(2), color: "#fbbf24" },
                  ].map(g => (
                    <div key={g.label} className="p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="text-[8px]" style={{ color: "#64748b" }}>{g.label}</div>
                      <div className="font-mono font-bold" style={{ color: g.color }}>{g.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "new" && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>NEW ISSUANCE PIPELINE</div>
            {[
              { issuer: "Rivian Automotive", size: 1500, coupon: "0.25%", conv: "$18.50", pricing: "2026-11-20", status: "PRICING" },
              { issuer: "Palantir Technologies", size: 2000, coupon: "0.00%", conv: "$35.00", pricing: "2026-11-22", status: "ROADSHOW" },
              { issuer: "Block Inc.", size: 1200, coupon: "0.50%", conv: "$95.00", pricing: "2026-11-25", status: "FILED" },
              { issuer: "Rocket Lab USA", size: 500, coupon: "1.50%", conv: "$28.00", pricing: "2026-12-01", status: "FILED" },
            ].map((n, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{n.issuer}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ background: n.status === "PRICING" ? "rgba(34,197,94,0.15)" : n.status === "ROADSHOW" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.05)",
                             color: n.status === "PRICING" ? "#22c55e" : n.status === "ROADSHOW" ? "#38bdf8" : "#94a3b8" }}>
                    {n.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono">${n.size}M</span></div>
                  <div><span style={{ color: "#64748b" }}>Coupon:</span> <span className="font-mono">{n.coupon}</span></div>
                  <div><span style={{ color: "#64748b" }}>Conv Price:</span> <span className="font-mono">{n.conv}</span></div>
                  <div><span style={{ color: "#64748b" }}>Pricing:</span> <span className="font-mono">{n.pricing}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
