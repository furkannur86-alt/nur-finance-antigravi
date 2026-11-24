"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "agency" | "prepayment" | "nonagency" | "market";

export default function MortgageBackedPanel() {
  const [tab, setTab] = useState<Tab>("agency");

  const agencyPools = [
    { cusip: "FN MA5120", coupon: 5.5, wac: 6.12, wam: 348, cpr: 8.2, price: 102.45, spread: 85, type: "FNMA 30Y" },
    { cusip: "GN MA8842", coupon: 5.0, wac: 5.65, wam: 352, cpr: 6.5, price: 101.28, spread: 92, type: "GNMA 30Y" },
    { cusip: "FH QD2415", coupon: 4.5, wac: 5.08, wam: 325, cpr: 12.8, price: 98.75, spread: 108, type: "FHLMC 30Y" },
    { cusip: "FN BT8920", coupon: 6.0, wac: 6.55, wam: 355, cpr: 5.1, price: 104.12, spread: 72, type: "FNMA 30Y" },
    { cusip: "FN CI4580", coupon: 3.5, wac: 4.02, wam: 288, cpr: 18.5, price: 93.42, spread: 142, type: "FNMA 30Y" },
    { cusip: "GN MA9105", coupon: 4.0, wac: 4.58, wam: 340, cpr: 14.2, price: 96.85, spread: 118, type: "GNMA 30Y" },
    { cusip: "FH SD3215", coupon: 5.5, wac: 6.05, wam: 350, cpr: 7.8, price: 102.18, spread: 88, type: "FHLMC 30Y" },
  ];

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏠</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MBS ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg MTGE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["agency", "prepayment", "nonagency", "market"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "agency" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AGENCY MBS POOL DATA</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "FNMA 30Y 5.5", value: "102-14+", chg: "+0-02" },
                { label: "GNMA 30Y 5.0", value: "101-09", chg: "-0-04" },
                { label: "FHLMC 30Y 5.5", value: "102-06", chg: "+0-01" },
                { label: "UMBS 6.0 TBA", value: "104-04+", chg: "+0-03" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5">{s.value}</div>
                  <div className="font-mono text-[8px]" style={{ color: s.chg.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.chg}</div>
                </div>
              ))}
            </div>

            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["CUSIP", "Type", "Cpn", "WAC", "WAM", "CPR", "Price", "OAS"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agencyPools.map(p => (
                    <tr key={p.cusip} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{p.cusip}</td>
                      <td className="px-2 py-1.5 text-[8px]">{p.type}</td>
                      <td className="px-2 py-1.5 font-mono">{p.coupon}%</td>
                      <td className="px-2 py-1.5 font-mono">{p.wac}%</td>
                      <td className="px-2 py-1.5 font-mono">{p.wam}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: p.cpr > 12 ? "#ef4444" : p.cpr > 8 ? "#fbbf24" : "#22c55e" }}>{p.cpr}%</td>
                      <td className="px-2 py-1.5 font-mono font-bold">{p.price.toFixed(2)}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: p.spread > 120 ? "#ef4444" : "#fbbf24" }}>{p.spread}bp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "prepayment" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PREPAYMENT MODEL — CPR FORECAST</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "30D CPR", value: "8.2%", color: "#22c55e" },
                { label: "60D CPR", value: "9.1%", color: "#fbbf24" },
                { label: "Lifetime CPR", value: "12.5%", color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CPR BY COUPON & VINTAGE</div>
            <svg viewBox="0 0 400 120" className="w-full">
              {[0, 5, 10, 15, 20].map(v => (
                <g key={v}>
                  <line x1="40" y1={105 - v * 5} x2="380" y2={105 - v * 5} stroke="rgba(255,255,255,0.05)" />
                  <text x="35" y={108 - v * 5} textAnchor="end" fill="#64748b" fontSize="7">{v}%</text>
                </g>
              ))}
              {[3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5].map((cpn, i) => {
                const cpr = cpn <= 4.0 ? 15 + (4.0 - cpn) * 5 : 8 - (cpn - 4.5) * 1.5;
                const h = Math.max(cpr, 2) * 5;
                return (
                  <g key={cpn}>
                    <rect x={50 + i * 42} y={105 - h} width={30} height={h} rx={2} fill={cpr > 12 ? "rgba(239,68,68,0.4)" : cpr > 8 ? "rgba(251,191,36,0.4)" : "rgba(34,197,94,0.4)"} stroke={cpr > 12 ? "#ef4444" : cpr > 8 ? "#fbbf24" : "#22c55e"} strokeWidth={0.5} />
                    <text x={65 + i * 42} y="115" textAnchor="middle" fill="#64748b" fontSize="7">{cpn}%</text>
                    <text x={65 + i * 42} y={100 - h} textAnchor="middle" fill="#94a3b8" fontSize="6">{cpr.toFixed(1)}</text>
                  </g>
                );
              })}
            </svg>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PREPAYMENT DRIVERS</div>
            {[
              { driver: "Refinancing Incentive", impact: "HIGH", detail: "30Y rate at 6.1% — pools with WAC > 6.5% at risk", color: "#ef4444" },
              { driver: "Seasonality", impact: "MODERATE", detail: "November — lower seasonal turnover vs. summer", color: "#fbbf24" },
              { driver: "Housing Turnover", impact: "LOW", detail: "Existing home sales at 4.1M SAAR — below trend", color: "#22c55e" },
              { driver: "Burnout Effect", impact: "MODERATE", detail: "2020-2021 vintages showing refi exhaustion", color: "#fbbf24" },
              { driver: "Credit Cure", impact: "LOW", detail: "Delinquency cure prepays stable at 1.2% CPR", color: "#22c55e" },
            ].map(d => (
              <div key={d.driver} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="px-1.5 py-0.5 rounded text-[7px] font-bold" style={{ background: `${d.color}22`, color: d.color }}>{d.impact}</span>
                <span className="font-bold w-36">{d.driver}</span>
                <span className="text-[9px]" style={{ color: "#94a3b8" }}>{d.detail}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "nonagency" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NON-AGENCY RMBS / CMBS</div>
            {[
              { name: "JPMMT 2024-5 A1", type: "Prime Jumbo", rating: "AAA", price: 100.85, spread: 65, cdr: 0.2, severity: 25, delinq: 1.2 },
              { name: "WFCM 2024-C63 A1", type: "CMBS Conduit", rating: "AAA", price: 99.95, spread: 82, cdr: 0.5, severity: 35, delinq: 2.8 },
              { name: "CIM 2024-R2 M1", type: "CRT (Mezzanine)", rating: "BBB", price: 96.50, spread: 285, cdr: 2.1, severity: 42, delinq: 5.5 },
              { name: "STACR 2024-DNA5 B1", type: "CRT (Sub)", rating: "BB", price: 92.25, spread: 425, cdr: 3.5, severity: 48, delinq: 7.2 },
              { name: "BBCMS 2024-C28 AS", type: "CMBS (A-S)", rating: "AA", price: 98.75, spread: 125, cdr: 0.8, severity: 38, delinq: 3.5 },
              { name: "NPL 2024-1 A1", type: "Non-Performing", rating: "NR", price: 85.50, spread: 650, cdr: 12.5, severity: 55, delinq: 100.0 },
            ].map(b => (
              <div key={b.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{b.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{b.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: b.rating === "AAA" ? "rgba(34,197,94,0.15)" : b.rating === "AA" ? "rgba(34,197,94,0.1)" : b.rating === "BBB" ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                      color: b.rating === "AAA" ? "#22c55e" : b.rating === "AA" ? "#22c55e" : b.rating === "BBB" ? "#fbbf24" : "#ef4444",
                    }}>{b.rating}</span>
                    <span className="font-mono font-bold">{b.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>OAS:</span> <span className="font-mono">{b.spread}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>CDR:</span> <span className="font-mono" style={{ color: b.cdr > 3 ? "#ef4444" : b.cdr > 1 ? "#fbbf24" : "#22c55e" }}>{b.cdr}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Severity:</span> <span className="font-mono">{b.severity}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Delinq:</span> <span className="font-mono" style={{ color: b.delinq > 5 ? "#ef4444" : b.delinq > 2 ? "#fbbf24" : "#22c55e" }}>{b.delinq}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MBS MARKET OVERVIEW</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Agency MBS Outstanding", val: "$9.2T", chg: "+2.1% YoY" },
                { label: "Fed MBS Holdings", val: "$2.3T", chg: "-$35B/mo" },
                { label: "MBS Net Issuance YTD", val: "$285B", chg: "+18% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#94a3b8" }}>{s.chg}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CURRENT COUPON OAS HISTORY</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {[40, 60, 80, 100, 120].map(v => (
                <g key={v}>
                  <line x1="40" y1={90 - (v - 40) * 0.9} x2="380" y2={90 - (v - 40) * 0.9} stroke="rgba(255,255,255,0.05)" />
                  <text x="35" y={93 - (v - 40) * 0.9} textAnchor="end" fill="#64748b" fontSize="7">{v}bp</text>
                </g>
              ))}
              <polyline points="40,54 70,50 100,45 130,36 160,32 190,38 220,42 250,48 280,52 310,55 340,50 370,47" fill="none" stroke="#00e5a0" strokeWidth="2" />
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <text key={m} x={40 + i * 30} y="98" textAnchor="middle" fill="#64748b" fontSize="7">{m}</text>
              ))}
            </svg>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ROLL ANALYSIS — TBA</div>
            {[
              { tba: "FNMA 5.5 Dec/Jan", drop: "0-05+", bev: 2.8, implied: 4.85, verdict: "ROLL" },
              { tba: "FNMA 6.0 Dec/Jan", drop: "0-07", bev: 3.2, implied: 4.52, verdict: "ROLL" },
              { tba: "GNMA 5.0 Dec/Jan", drop: "0-04", bev: 2.1, implied: 5.12, verdict: "HOLD" },
              { tba: "FHLMC 5.5 Dec/Jan", drop: "0-05", bev: 2.5, implied: 4.92, verdict: "ROLL" },
            ].map(r => (
              <div key={r.tba} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-40">{r.tba}</span>
                <span className="font-mono w-16">Drop: {r.drop}</span>
                <span className="font-mono w-20" style={{ color: "#fbbf24" }}>BEV: {r.bev}%</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                  background: r.verdict === "ROLL" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                  color: r.verdict === "ROLL" ? "#22c55e" : "#fbbf24",
                }}>{r.verdict}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
