"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "clo" | "abs" | "mbs" | "issuance";

export default function SecuritizationPanel() {
  const [tab, setTab] = useState<Tab>("clo");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SECURITIZATION</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg SECZ</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["clo", "abs", "mbs", "issuance"] as Tab[]).map(t => (
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
          { label: "CLO OUTSTANDING", value: "$1.1T", color: "#38bdf8" },
          { label: "ABS ISSUANCE YTD", value: "$285B", color: "#fbbf24" },
          { label: "MBS SPREAD", value: "+142bp", color: "#22c55e" },
          { label: "NEW ISSUE", value: "$48B/mo", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "clo" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLO TRANCHE SPREADS (BSL 2.0)</div>
            {[
              { tranche: "AAA", spread: 128, change: -5, subordination: 38.5, factor: 1.0, rating: "Aaa/AAA" },
              { tranche: "AA", spread: 185, change: -8, subordination: 28.0, factor: 0.98, rating: "Aa2/AA" },
              { tranche: "A", spread: 225, change: -3, subordination: 20.5, factor: 0.95, rating: "A2/A" },
              { tranche: "BBB", spread: 325, change: 5, subordination: 13.5, factor: 0.90, rating: "Baa2/BBB" },
              { tranche: "BB", spread: 585, change: 15, subordination: 8.0, factor: 0.82, rating: "Ba2/BB" },
              { tranche: "Equity", spread: 0, change: 0, subordination: 0, factor: 0.65, rating: "NR" },
            ].map(t => (
              <div key={t.tranche} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-12" style={{ color: t.tranche === "Equity" ? "#ef4444" : t.tranche === "BB" ? "#fbbf24" : "#22c55e" }}>{t.tranche}</span>
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{t.rating}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>{t.tranche === "Equity" ? "12-15% IRR" : `S+${t.spread}bp`}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: t.change <= 0 ? "#22c55e" : "#ef4444" }}>{t.change === 0 ? "—" : `${t.change > 0 ? "+" : ""}${t.change}bp`}</span></div>
                  <div><span style={{ color: "#64748b" }}>Subord:</span> <span className="font-mono">{t.subordination > 0 ? `${t.subordination}%` : "First loss"}</span></div>
                  <div><span style={{ color: "#64748b" }}>Factor:</span> <span className="font-mono">{t.factor}x</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>TOP CLO MANAGERS (AUM)</div>
            {[
              { manager: "CSAM/Credit Suisse", aum: "$42B", deals: 85 },
              { manager: "Carlyle", aum: "$38B", deals: 72 },
              { manager: "PGIM", aum: "$35B", deals: 68 },
              { manager: "Blackstone Credit", aum: "$32B", deals: 62 },
            ].map(m => (
              <div key={m.manager} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{m.manager}</span>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#38bdf8" }}>{m.aum}</span>
                  <span style={{ color: "#64748b" }}>{m.deals} deals</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "abs" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ABS SECTOR SPREADS (AAA)</div>
            {[
              { sector: "Prime Auto", spread: 55, change: -3, volume: "$42B", delinq: 1.2 },
              { sector: "Subprime Auto", spread: 125, change: 8, volume: "$28B", delinq: 8.5 },
              { sector: "Credit Card", spread: 48, change: -2, volume: "$35B", delinq: 2.8 },
              { sector: "Student Loan (FFELP)", spread: 42, change: -1, volume: "$12B", delinq: 4.2 },
              { sector: "Student Loan (Private)", spread: 85, change: 5, volume: "$8B", delinq: 3.8 },
              { sector: "Equipment", spread: 62, change: -4, volume: "$18B", delinq: 1.5 },
              { sector: "Whole Business (Franchise)", spread: 145, change: 2, volume: "$5B", delinq: 0.8 },
            ].map(s => (
              <div key={s.sector} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.sector}</span>
                  <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>S+{s.spread}bp</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: s.change <= 0 ? "#22c55e" : "#ef4444" }}>{s.change > 0 ? "+" : ""}{s.change}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{s.volume}</span></div>
                  <div><span style={{ color: "#64748b" }}>60+ DQ:</span> <span className="font-mono" style={{ color: s.delinq > 5 ? "#ef4444" : s.delinq > 3 ? "#fbbf24" : "#22c55e" }}>{s.delinq}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "mbs" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AGENCY MBS — TBA PRICES</div>
            {[
              { coupon: "FNCL 5.0", price: 99.28, change: 0.08, oas: 42, cpr: 8.5, wal: 7.2 },
              { coupon: "FNCL 5.5", price: 100.56, change: 0.12, oas: 38, cpr: 12.5, wal: 5.8 },
              { coupon: "FNCL 6.0", price: 101.84, change: 0.15, oas: 32, cpr: 18.2, wal: 4.5 },
              { coupon: "FNCL 6.5", price: 102.92, change: 0.18, oas: 28, cpr: 25.4, wal: 3.8 },
              { coupon: "GNMA 5.0", price: 99.68, change: 0.10, oas: 52, cpr: 10.2, wal: 6.8 },
              { coupon: "GNMA 5.5", price: 100.88, change: 0.14, oas: 45, cpr: 14.8, wal: 5.4 },
            ].map(m => (
              <div key={m.coupon} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{m.coupon}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold">{m.price.toFixed(2)}</span>
                    <span style={{ color: m.change >= 0 ? "#22c55e" : "#ef4444" }}>+{m.change.toFixed(2)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>OAS:</span> <span className="font-mono">{m.oas}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>CPR:</span> <span className="font-mono" style={{ color: m.cpr > 20 ? "#ef4444" : "#22c55e" }}>{m.cpr}%</span></div>
                  <div><span style={{ color: "#64748b" }}>WAL:</span> <span className="font-mono">{m.wal}yr</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>NON-AGENCY RMBS & CMBS</div>
            {[
              { type: "CRT M2 (Freddie)", spread: 185, change: -12 },
              { type: "CMBS Conduit AAA", spread: 95, change: -5 },
              { type: "CMBS Single-Asset A", spread: 225, change: 15 },
              { type: "CRE CLO AAA", spread: 165, change: 8 },
            ].map(t => (
              <div key={t.type} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{t.type}</span>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#38bdf8" }}>S+{t.spread}bp</span>
                  <span style={{ color: t.change <= 0 ? "#22c55e" : "#ef4444" }}>{t.change > 0 ? "+" : ""}{t.change}bp</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "issuance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NEW ISSUANCE PIPELINE</div>
            {[
              { deal: "Ford Auto Owner Trust 2027-A", size: "$2.5B", sector: "Prime Auto", tranches: "A/B/C/D", pricing: "Jan 15", status: "PRICING" },
              { deal: "Citibank Credit Card Trust 2027-1", size: "$1.8B", sector: "Credit Card", tranches: "A/B/C", pricing: "Jan 18", status: "ROADSHOW" },
              { deal: "Ares CLO XLII", size: "$500M", sector: "BSL CLO", tranches: "A-E + Eq", pricing: "Jan 22", status: "MARKETING" },
              { deal: "SoFi Consumer Loan 2027-1", size: "$850M", sector: "Consumer", tranches: "A/B/C/R", pricing: "Jan 25", status: "MANDATE" },
              { deal: "Blackstone CMBS 2027-BX5", size: "$1.2B", sector: "SASB CMBS", tranches: "A/B/C/D", pricing: "Feb 1", status: "FILING" },
            ].map(d => (
              <div key={d.deal} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{d.deal}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: d.status === "PRICING" ? "rgba(34,197,94,0.15)" : d.status === "ROADSHOW" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                    color: d.status === "PRICING" ? "#22c55e" : d.status === "ROADSHOW" ? "#38bdf8" : "#fbbf24"
                  }}>{d.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{d.size}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sector:</span> <span>{d.sector}</span></div>
                  <div><span style={{ color: "#64748b" }}>Tranches:</span> <span className="font-mono">{d.tranches}</span></div>
                  <div><span style={{ color: "#64748b" }}>Pricing:</span> <span className="font-mono">{d.pricing}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>YTD ISSUANCE BY SECTOR ($B)</div>
            {[
              { sector: "CLO (BSL)", volume: 142, pct: 28 },
              { sector: "Agency MBS", volume: 285, pct: 56 },
              { sector: "Auto ABS", volume: 85, pct: 17 },
              { sector: "Credit Card ABS", volume: 48, pct: 9 },
              { sector: "CMBS", volume: 62, pct: 12 },
              { sector: "Student Loan", volume: 22, pct: 4 },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{s.sector}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(s.pct * 1.5, 100)}%`, background: "#38bdf8", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-12 text-right" style={{ color: "#38bdf8" }}>${s.volume}B</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
