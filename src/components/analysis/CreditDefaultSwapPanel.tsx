"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "indices" | "singlename" | "basis" | "events";

const CDS_INDICES = [
  { index: "CDX NA IG", series: "S42", spread: 52.5, change: -1.2, roll: "Mar 27", maturity: "5Y", notional: "$285B" },
  { index: "CDX NA HY", series: "S42", spread: 342.0, change: 5.8, roll: "Mar 27", maturity: "5Y", notional: "$48B" },
  { index: "iTraxx Europe", series: "S41", spread: 58.2, change: -0.8, roll: "Mar 27", maturity: "5Y", notional: "€195B" },
  { index: "iTraxx Xover", series: "S41", spread: 312.5, change: 4.2, roll: "Mar 27", maturity: "5Y", notional: "€42B" },
  { index: "CDX EM", series: "S41", spread: 185.0, change: 2.5, roll: "Mar 27", maturity: "5Y", notional: "$18B" },
  { index: "iTraxx Asia ex-JP", series: "S41", spread: 92.4, change: 1.8, roll: "Mar 27", maturity: "5Y", notional: "$12B" },
];

const SINGLE_NAMES = [
  { name: "Ford Motor Co", ticker: "F", spread5y: 185, change: -8, rating: "BB+", sector: "Auto", recovery: 40 },
  { name: "Boeing Co", ticker: "BA", spread5y: 142, change: 12, rating: "BBB-", sector: "Aero", recovery: 40 },
  { name: "Deutsche Bank", ticker: "DB", spread5y: 78, change: -3, rating: "A-", sector: "Banks", recovery: 40 },
  { name: "Tesla Inc", ticker: "TSLA", spread5y: 125, change: 5, rating: "BBB-", sector: "Auto", recovery: 40 },
  { name: "Meta Platforms", ticker: "META", spread5y: 42, change: -2, rating: "AA-", sector: "Tech", recovery: 40 },
  { name: "AT&T Inc", ticker: "T", spread5y: 92, change: 1, rating: "BBB", sector: "Telecom", recovery: 40 },
  { name: "Petrobras", ticker: "PBR", spread5y: 165, change: -5, rating: "BB-", sector: "Energy", recovery: 35 },
  { name: "Credit Suisse", ticker: "CS", spread5y: 450, change: 25, rating: "BBB-", sector: "Banks", recovery: 25 },
  { name: "Turkiye Gov't", ticker: "TURKEY", spread5y: 285, change: -12, rating: "B+", sector: "Sovereign", recovery: 25 },
  { name: "Argentina Gov't", ticker: "ARGENT", spread5y: 1250, change: -45, rating: "CCC+", sector: "Sovereign", recovery: 25 },
];

export default function CreditDefaultSwapPanel() {
  const [tab, setTab] = useState<Tab>("indices");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛡️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CREDIT DEFAULT SWAPS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Bloomberg CDSW</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["indices", "singlename", "basis", "events"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "singlename" ? "SINGLE" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "CDX IG", value: "52.5bp", chg: "-1.2", color: "#22c55e" },
          { label: "CDX HY", value: "342bp", chg: "+5.8", color: "#ef4444" },
          { label: "iTRAXX EUR", value: "58.2bp", chg: "-0.8", color: "#22c55e" },
          { label: "XOVER", value: "312bp", chg: "+4.2", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold" style={{ color: "#e2e8f0" }}>{s.value}</span>
              <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.chg}bp</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "indices" && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>CDS INDEX MONITOR</div>
            {CDS_INDICES.map(idx => (
              <div key={idx.index} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{idx.index}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{idx.series}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{idx.spread.toFixed(1)}bp</span>
                    <span className="font-mono text-[9px]" style={{ color: idx.change < 0 ? "#22c55e" : "#ef4444" }}>
                      {idx.change > 0 ? "+" : ""}{idx.change.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Maturity:</span> <span className="font-mono">{idx.maturity}</span></div>
                  <div><span style={{ color: "#64748b" }}>Roll:</span> <span className="font-mono">{idx.roll}</span></div>
                  <div><span style={{ color: "#64748b" }}>Notional:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{idx.notional}</span></div>
                  <div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min(idx.spread / 400 * 100, 100)}%`,
                        background: idx.spread > 200 ? "#ef4444" : idx.spread > 100 ? "#fbbf24" : "#22c55e"
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>CDX IG TERM STRUCTURE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 80" className="w-full">
                {[30, 50, 70, 90].map(v => (
                  <g key={v}>
                    <line x1="40" y1={70 - (v - 20) * 0.8} x2="380" y2={70 - (v - 20) * 0.8} stroke="rgba(255,255,255,0.05)" />
                    <text x="35" y={73 - (v - 20) * 0.8} textAnchor="end" fill="#64748b" fontSize="7">{v}</text>
                  </g>
                ))}
                <polyline
                  points="80,52 150,46 220,38 290,32 360,28"
                  fill="none" stroke="#38bdf8" strokeWidth="2" />
                {["1Y", "3Y", "5Y", "7Y", "10Y"].map((l, i) => (
                  <g key={l}>
                    <circle cx={80 + i * 70} cy={[52, 46, 38, 32, 28][i]} r="3" fill="#38bdf8" />
                    <text x={80 + i * 70} y="78" textAnchor="middle" fill="#64748b" fontSize="7">{l}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {tab === "singlename" && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>SINGLE-NAME CDS (5Y)</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Name</th>
                    <th className="text-center px-2 py-1.5" style={{ color: "#64748b" }}>Rating</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>5Y Spread</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Chg</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Recovery</th>
                    <th className="text-center px-2 py-1.5" style={{ color: "#64748b" }}>Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {SINGLE_NAMES.sort((a, b) => b.spread5y - a.spread5y).map(s => (
                    <tr key={s.ticker} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5">
                        <span className="font-bold" style={{ color: "#38bdf8" }}>{s.ticker}</span>
                        <span className="ml-1 text-[8px]" style={{ color: "#64748b" }}>{s.name}</span>
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                          background: s.rating.startsWith("A") ? "rgba(34,197,94,0.15)" : s.rating.startsWith("BBB") ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                          color: s.rating.startsWith("A") ? "#22c55e" : s.rating.startsWith("BBB") ? "#fbbf24" : "#ef4444"
                        }}>{s.rating}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold" style={{
                        color: s.spread5y > 300 ? "#ef4444" : s.spread5y > 150 ? "#fbbf24" : "#e2e8f0"
                      }}>{s.spread5y}bp</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: s.change > 0 ? "#ef4444" : "#22c55e" }}>
                        {s.change > 0 ? "+" : ""}{s.change}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono">{s.recovery}%</td>
                      <td className="px-2 py-1.5 text-center text-[8px]" style={{ color: "#64748b" }}>{s.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "basis" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CDS-BOND BASIS (CDS SPREAD vs BOND Z-SPREAD)</div>
            {[
              { name: "Ford Motor", basis: -25, cds: 185, bond: 210, signal: "CDS cheap — positive basis trade" },
              { name: "Boeing", basis: 12, cds: 142, bond: 130, signal: "CDS expensive — negative basis trade" },
              { name: "Deutsche Bank", basis: -8, cds: 78, bond: 86, signal: "Near fair value" },
              { name: "AT&T", basis: 15, cds: 92, bond: 77, signal: "CDS wider than bonds — credit concern" },
              { name: "Petrobras", basis: -32, cds: 165, bond: 197, signal: "CDS significantly cheap — opportunity" },
              { name: "Credit Suisse", basis: 85, cds: 450, bond: 365, signal: "CDS signaling higher default risk than bonds" },
            ].map(b => (
              <div key={b.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{b.name}</span>
                  <span className="font-mono font-bold" style={{ color: b.basis < 0 ? "#22c55e" : "#ef4444" }}>
                    Basis: {b.basis > 0 ? "+" : ""}{b.basis}bp
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] mb-1">
                  <div><span style={{ color: "#64748b" }}>CDS:</span> <span className="font-mono">{b.cds}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Bond Z:</span> <span className="font-mono">{b.bond}bp</span></div>
                </div>
                <div className="text-[9px]" style={{ color: b.basis < -20 ? "#22c55e" : b.basis > 20 ? "#ef4444" : "#94a3b8" }}>{b.signal}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "events" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CREDIT EVENTS & DETERMINATIONS</div>
            {[
              { entity: "SVB Financial Group", date: "Mar 2026", event: "Bankruptcy", recovery: 32.5, payout: 67.5, status: "SETTLED", notional: "$4.2B" },
              { entity: "Evergrande Group", date: "Feb 2026", event: "Failure to Pay", recovery: 2.8, payout: 97.2, status: "SETTLED", notional: "$1.8B" },
              { entity: "Rite Aid Corp", date: "Oct 2026", event: "Bankruptcy", recovery: 18.5, payout: 81.5, status: "AUCTION PENDING", notional: "$0.8B" },
              { entity: "Yellow Corp", date: "Aug 2026", event: "Bankruptcy", recovery: 12.0, payout: 88.0, status: "SETTLED", notional: "$0.5B" },
            ].map(e => (
              <div key={e.entity} className="p-2.5 rounded" style={{
                background: "rgba(239,68,68,0.03)",
                border: "1px solid rgba(239,68,68,0.15)"
              }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#ef4444" }}>{e.entity}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: e.status === "SETTLED" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                      color: e.status === "SETTLED" ? "#22c55e" : "#fbbf24"
                    }}>{e.status}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.date}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Event:</span> <span style={{ color: "#ef4444" }}>{e.event}</span></div>
                  <div><span style={{ color: "#64748b" }}>Recovery:</span> <span className="font-mono">{e.recovery}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Payout:</span> <span className="font-mono font-bold" style={{ color: "#ef4444" }}>{e.payout}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Notional:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{e.notional}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>WATCHLIST — ELEVATED DEFAULT RISK</div>
            {[
              { entity: "Argentina Sovereign", spread: 1250, implied: 18.5, trigger: "Restructuring risk on USD bonds" },
              { entity: "Credit Suisse", spread: 450, implied: 8.2, trigger: "Capital adequacy concerns, deposit flight" },
              { entity: "BYND (Beyond Meat)", spread: 680, implied: 12.4, trigger: "Cash burn, revenue decline, covenant risk" },
              { entity: "Carvana Co", spread: 520, implied: 9.8, trigger: "High leverage, used car market softening" },
            ].map(w => (
              <div key={w.entity} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <span className="font-bold" style={{ color: "#ef4444" }}>{w.entity}</span>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{w.trigger}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold" style={{ color: "#ef4444" }}>{w.spread}bp</div>
                  <div className="text-[8px]"><span style={{ color: "#64748b" }}>Implied PD:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{w.implied}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
