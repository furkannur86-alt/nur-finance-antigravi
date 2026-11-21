"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "cat-bonds" | "ils" | "reinsurance" | "loss";

const CAT_BONDS = [
  { name: "USAA Residential Re 2026-1", peril: "US Hurricane", spread: 625, expectedLoss: 2.85, coupon: "SOFR+625bp", size: "$400M", rating: "BB", maturity: "Jun 2029" },
  { name: "Flatiron Re 2026-1", peril: "US EQ", spread: 450, expectedLoss: 1.92, coupon: "SOFR+450bp", size: "$350M", rating: "BB+", maturity: "Mar 2029" },
  { name: "Nakama Re 2026-1", peril: "Japan Typhoon", spread: 575, expectedLoss: 2.48, coupon: "SOFR+575bp", size: "$200M", rating: "BB", maturity: "Apr 2029" },
  { name: "Citrus Re 2026-1", peril: "FL Hurricane", spread: 850, expectedLoss: 4.12, coupon: "SOFR+850bp", size: "$250M", rating: "B+", maturity: "Jun 2029" },
  { name: "Golden State Re 2026-1", peril: "CA Wildfire", spread: 725, expectedLoss: 3.45, coupon: "SOFR+725bp", size: "$300M", rating: "BB-", maturity: "Dec 2028" },
  { name: "Euro Wind Re 2026-1", peril: "EU Windstorm", spread: 380, expectedLoss: 1.65, coupon: "SOFR+380bp", size: "$450M", rating: "BBB-", maturity: "Mar 2029" },
];

export default function InsurancePanel() {
  const [tab, setTab] = useState<Tab>("cat-bonds");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛡️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ILS & INSURANCE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>Bloomberg ILS</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["cat-bonds", "ils", "reinsurance", "loss"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "cat-bonds" ? "CAT BONDS" : t === "ils" ? "ILS MKT" : t === "reinsurance" ? "REINS" : "LOSSES"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "CAT BOND INDEX", value: "+8.4%", color: "#22c55e" },
          { label: "ILS AUM", value: "$48.2B", color: "#38bdf8" },
          { label: "INSURED LOSSES", value: "$128B", color: "#ef4444" },
          { label: "RoL INDEX", value: "7.2%", color: "#fbbf24" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "cat-bonds" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>CATASTROPHE BOND ISSUANCE</div>
            {CAT_BONDS.map((b, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{b.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>{b.peril}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{b.rating}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Spread:</span> <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{b.spread}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Exp Loss:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{b.expectedLoss}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{b.size}</span></div>
                  <div><span style={{ color: "#64748b" }}>Coupon:</span> <span className="font-mono">{b.coupon}</span></div>
                  <div><span style={{ color: "#64748b" }}>Maturity:</span> <span className="font-mono">{b.maturity}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "ils" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ILS MARKET OVERVIEW</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Outstanding", value: "$48.2B", sub: "+12% YoY" },
                { label: "2026 Issuance", value: "$18.4B", sub: "Record pace" },
                { label: "Avg Spread", value: "585bp", sub: "vs 650bp 2025" },
                { label: "Avg Exp Loss", value: "2.8%", sub: "vs 3.2% 2025" },
                { label: "Coupon Return", value: "+8.4%", sub: "YTD total" },
                { label: "Default Rate", value: "0.4%", sub: "Hist avg: 1.2%" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#f97316" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>ISSUANCE BY PERIL</div>
            {[
              { peril: "US Hurricane", volume: "$6.8B", pct: 37, color: "#ef4444" },
              { peril: "US Earthquake", volume: "$3.2B", pct: 17, color: "#f97316" },
              { peril: "Multi-Peril", volume: "$4.5B", pct: 24, color: "#fbbf24" },
              { peril: "EU Windstorm", volume: "$2.1B", pct: 11, color: "#38bdf8" },
              { peril: "Japan Typhoon/EQ", volume: "$1.8B", pct: 10, color: "#a855f7" },
            ].map(p => (
              <div key={p.peril} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="w-32">{p.peril}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct * 2.5}%`, background: p.color, opacity: 0.6 }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: p.color }}>{p.volume}</span>
                <span className="font-mono text-[9px] w-8 text-right" style={{ color: "#64748b" }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "reinsurance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL REINSURANCE PRICING (1/1 RENEWAL)</div>
            {[
              { line: "US Property Cat", rolChange: 12, rol: 8.5, retentionChange: 15, outlook: "HARD" },
              { line: "International Cat", rolChange: 8, rol: 5.2, retentionChange: 10, outlook: "FIRMING" },
              { line: "US Casualty", rolChange: 5, rol: 4.8, retentionChange: 8, outlook: "FIRMING" },
              { line: "Marine & Aviation", rolChange: 15, rol: 6.2, retentionChange: 20, outlook: "HARD" },
              { line: "Cyber", rolChange: 22, rol: 12.5, retentionChange: 25, outlook: "HARD" },
              { line: "Specialty Lines", rolChange: 4, rol: 3.8, retentionChange: 5, outlook: "STABLE" },
            ].map(l => (
              <div key={l.line} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{l.line}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: l.outlook === "HARD" ? "rgba(239,68,68,0.15)" : l.outlook === "FIRMING" ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.15)",
                    color: l.outlook === "HARD" ? "#ef4444" : l.outlook === "FIRMING" ? "#fbbf24" : "#94a3b8"
                  }}>{l.outlook}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>RoL:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{l.rol}%</span></div>
                  <div><span style={{ color: "#64748b" }}>RoL Chg:</span> <span className="font-mono" style={{ color: "#ef4444" }}>+{l.rolChange}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Retention ↑:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>+{l.retentionChange}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "loss" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>2026 INSURED CATASTROPHE LOSSES</div>
            {[
              { event: "Hurricane Milton (FL)", date: "Oct 2026", insuredLoss: "$42B", economicLoss: "$65B", peril: "Hurricane", region: "US" },
              { event: "Tohoku Earthquake (JP)", date: "Aug 2026", insuredLoss: "$18B", economicLoss: "$45B", peril: "Earthquake", region: "Japan" },
              { event: "European Floods", date: "Jun 2026", insuredLoss: "$12B", economicLoss: "$28B", peril: "Flood", region: "Europe" },
              { event: "Texas Hailstorm", date: "Apr 2026", insuredLoss: "$8.5B", economicLoss: "$12B", peril: "Severe Convective", region: "US" },
              { event: "LA Wildfire Season", date: "Sep 2026", insuredLoss: "$15B", economicLoss: "$22B", peril: "Wildfire", region: "US" },
            ].map((e, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#ef4444" }}>{e.event}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{e.peril}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Insured:</span> <span className="font-mono font-bold" style={{ color: "#ef4444" }}>{e.insuredLoss}</span></div>
                  <div><span style={{ color: "#64748b" }}>Economic:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{e.economicLoss}</span></div>
                  <div><span style={{ color: "#64748b" }}>Region:</span> <span>{e.region}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CUMULATIVE LOSSES vs HISTORICAL</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-end gap-1" style={{ height: 70 }}>
                {[
                  { y: "2020", v: 82 }, { y: "2021", v: 105 }, { y: "2022", v: 125 },
                  { y: "2023", v: 108 }, { y: "2024", v: 142 }, { y: "2025", v: 118 }, { y: "2026", v: 128 },
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full rounded-t" style={{
                      height: `${(d.v / 150) * 55}px`,
                      background: d.y === "2026" ? "#ef4444" : "#f97316",
                      opacity: d.y === "2026" ? 0.8 : 0.4
                    }} />
                    <span className="text-[7px] mt-1" style={{ color: "#64748b" }}>{d.y}</span>
                    <span className="text-[7px] font-mono" style={{ color: d.y === "2026" ? "#ef4444" : "#94a3b8" }}>${d.v}B</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
