"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "overview" | "models" | "tax" | "estate";

export default function WealthManagementPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💎</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>WEALTH MANAGEMENT</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Bloomberg WLTH</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "models", "tax", "estate"] as Tab[]).map(t => (
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
          { label: "TOTAL AUM", value: "$248M", color: "#fbbf24" },
          { label: "YTD RETURN", value: "+12.4%", color: "#22c55e" },
          { label: "CLIENTS", value: "42", color: "#38bdf8" },
          { label: "TAX ALPHA", value: "1.8%", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLIENT PORTFOLIO TIERS</div>
            {[
              { tier: "Ultra HNW ($50M+)", clients: 5, aum: "$142M", avgReturn: 14.2, allocation: "40E/25FI/15Alt/10PE/10Cash" },
              { tier: "HNW ($10-50M)", clients: 12, aum: "$68M", avgReturn: 12.8, allocation: "50E/30FI/10Alt/5RE/5Cash" },
              { tier: "Affluent ($1-10M)", clients: 25, aum: "$38M", avgReturn: 11.5, allocation: "60E/25FI/10Alt/5Cash" },
            ].map(t => (
              <div key={t.tier} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#fbbf24" }}>{t.tier}</span>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>+{t.avgReturn}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Clients:</span> <span className="font-mono">{t.clients}</span></div>
                  <div><span style={{ color: "#64748b" }}>AUM:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{t.aum}</span></div>
                  <div><span style={{ color: "#64748b" }}>Alloc:</span> <span className="font-mono text-[8px]">{t.allocation}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>PERFORMANCE vs BENCHMARKS (YTD)</div>
            {[
              { name: "Composite Portfolio", return: 12.4, benchmark: "60/40", bmReturn: 10.2, alpha: 2.2 },
              { name: "Equity Sleeve", return: 18.5, benchmark: "S&P 500", bmReturn: 16.8, alpha: 1.7 },
              { name: "Fixed Income", return: 4.8, benchmark: "Agg Bond", bmReturn: 3.5, alpha: 1.3 },
              { name: "Alternatives", return: 8.2, benchmark: "HFRI", bmReturn: 6.5, alpha: 1.7 },
            ].map(p => (
              <div key={p.name} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{p.name}</span>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span style={{ color: "#22c55e" }}>+{p.return}%</span>
                  <span style={{ color: "#64748b" }}>vs {p.benchmark}: +{p.bmReturn}%</span>
                  <span className="font-bold" style={{ color: p.alpha > 0 ? "#00e5a0" : "#ef4444" }}>α: +{p.alpha}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "models" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MODEL PORTFOLIOS</div>
            {[
              { name: "Conservative Income", risk: "LOW", target: "4-6%", equity: 25, fi: 55, alt: 10, cash: 10, sharpe: 0.85, maxDD: -8.5 },
              { name: "Balanced Growth", risk: "MODERATE", target: "6-8%", equity: 50, fi: 30, alt: 15, cash: 5, sharpe: 1.12, maxDD: -14.2 },
              { name: "Aggressive Growth", risk: "HIGH", target: "8-12%", equity: 70, fi: 10, alt: 15, cash: 5, sharpe: 0.95, maxDD: -22.5 },
              { name: "All-Weather", risk: "MODERATE", target: "5-7%", equity: 30, fi: 40, alt: 25, cash: 5, sharpe: 1.35, maxDD: -10.8 },
              { name: "Tax-Managed Growth", risk: "MODERATE", target: "7-9%", equity: 55, fi: 20, alt: 15, cash: 10, sharpe: 1.08, maxDD: -16.4 },
            ].map(m => (
              <div key={m.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{m.name}</span>
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                      background: m.risk === "HIGH" ? "rgba(239,68,68,0.15)" : m.risk === "MODERATE" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                      color: m.risk === "HIGH" ? "#ef4444" : m.risk === "MODERATE" ? "#fbbf24" : "#22c55e"
                    }}>{m.risk}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>Target: {m.target}</span>
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="flex-1 flex h-3 rounded-full overflow-hidden">
                    <div style={{ width: `${m.equity}%`, background: "#22c55e" }} />
                    <div style={{ width: `${m.fi}%`, background: "#38bdf8" }} />
                    <div style={{ width: `${m.alt}%`, background: "#a855f7" }} />
                    <div style={{ width: `${m.cash}%`, background: "#64748b" }} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#22c55e" }}>Eq:{m.equity}%</span></div>
                  <div><span style={{ color: "#38bdf8" }}>FI:{m.fi}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Sharpe:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{m.sharpe}</span></div>
                  <div><span style={{ color: "#64748b" }}>MaxDD:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{m.maxDD}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tax" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TAX-LOSS HARVESTING OPPORTUNITIES</div>
            {[
              { holding: "Meta Platforms (Lot 3)", unrealizedLoss: -18500, daysHeld: 45, washSaleRisk: "LOW", taxSaving: "$6,845" },
              { holding: "Tesla Inc (Lot 2)", unrealizedLoss: -32400, daysHeld: 128, washSaleRisk: "NONE", taxSaving: "$11,988" },
              { holding: "Nike Inc (Lot 1)", unrealizedLoss: -8200, daysHeld: 85, washSaleRisk: "MEDIUM", taxSaving: "$3,034" },
              { holding: "Intel Corp (All lots)", unrealizedLoss: -45800, daysHeld: 220, washSaleRisk: "NONE", taxSaving: "$16,946" },
              { holding: "Pfizer Inc (Lot 2)", unrealizedLoss: -12500, daysHeld: 165, washSaleRisk: "LOW", taxSaving: "$4,625" },
            ].map(h => (
              <div key={h.holding} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{h.holding}</span>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{h.taxSaving}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Loss:</span> <span className="font-mono" style={{ color: "#ef4444" }}>${Math.abs(h.unrealizedLoss).toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Held:</span> <span className="font-mono">{h.daysHeld}d</span></div>
                  <div><span style={{ color: "#64748b" }}>Wash Sale:</span> <span style={{ color: h.washSaleRisk === "NONE" ? "#22c55e" : h.washSaleRisk === "LOW" ? "#fbbf24" : "#ef4444" }}>{h.washSaleRisk}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>ANNUAL TAX SUMMARY</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "ST Capital Gains", value: "$85,400", color: "#ef4444" },
                { label: "LT Capital Gains", value: "$142,800", color: "#fbbf24" },
                { label: "Losses Harvested", value: "$68,500", color: "#22c55e" },
                { label: "Net Tax Savings", value: "$43,420", color: "#00e5a0" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "estate" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ESTATE PLANNING DASHBOARD</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Gross Estate", value: "$48.5M", sub: "All assets" },
                { label: "Federal Exemption", value: "$13.6M", sub: "2026 (sunsets 2026)" },
                { label: "Taxable Estate", value: "$34.9M", sub: "40% rate" },
                { label: "Est. Estate Tax", value: "$13.96M", sub: "Without planning" },
                { label: "After Planning", value: "$4.2M", sub: "With structures" },
                { label: "Tax Savings", value: "$9.76M", sub: "70% reduction" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: s.label.includes("Savings") ? "#22c55e" : s.label.includes("Tax") && !s.label.includes("Savings") ? "#ef4444" : "#fbbf24" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>TRUST & STRUCTURE STATUS</div>
            {[
              { structure: "Irrevocable Life Insurance Trust", value: "$8.5M", status: "ACTIVE", funded: "100%" },
              { structure: "Grantor Retained Annuity Trust", value: "$12.4M", status: "ACTIVE", funded: "85%" },
              { structure: "Family Limited Partnership", value: "$18.2M", status: "ACTIVE", funded: "92%" },
              { structure: "Charitable Remainder Trust", value: "$4.8M", status: "ACTIVE", funded: "100%" },
              { structure: "529 Education Plans (5)", value: "$1.2M", status: "ACTIVE", funded: "60%" },
            ].map(t => (
              <div key={t.structure} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{t.structure}</div>
                  <div className="text-[9px] mt-0.5"><span style={{ color: "#64748b" }}>Funded:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{t.funded}</span></div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold" style={{ color: "#fbbf24" }}>{t.value}</div>
                  <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
