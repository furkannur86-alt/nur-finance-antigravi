"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "deals" | "tranches" | "managers" | "market";

export default function CLOAnalyticsPanel() {
  const [tab, setTab] = useState<Tab>("deals");

  const deals = [
    { name: "Dryden 112 CLO", manager: "PGIM", vintage: "2024", size: "$500M", wal: "5.2yr", navDisc: "+0.8%", status: "Reinvesting" },
    { name: "Octagon 68 CLO", manager: "Octagon", vintage: "2024", size: "$450M", wal: "4.8yr", navDisc: "-0.3%", status: "Reinvesting" },
    { name: "OZLM XXIV", manager: "Sculptor", vintage: "2023", size: "$525M", wal: "3.1yr", navDisc: "+1.2%", status: "Amortizing" },
    { name: "Carlyle US 2024-3", manager: "Carlyle", vintage: "2024", size: "$600M", wal: "5.5yr", navDisc: "+0.5%", status: "Reinvesting" },
    { name: "BSSP 2023-7", manager: "Blackstone", vintage: "2023", size: "$475M", wal: "3.8yr", navDisc: "+0.9%", status: "Reinvesting" },
    { name: "Ares LXVII CLO", manager: "Ares", vintage: "2024", size: "$550M", wal: "5.0yr", navDisc: "-0.1%", status: "Ramp-Up" },
    { name: "KKR 42 CLO", manager: "KKR", vintage: "2024", size: "$650M", wal: "5.3yr", navDisc: "+0.4%", status: "Reinvesting" },
    { name: "Apollo Credit 2024-2", manager: "Apollo", vintage: "2024", size: "$425M", wal: "5.1yr", navDisc: "+0.6%", status: "Ramp-Up" },
  ];

  const tranches = [
    { rating: "AAA", spread: "S+135", dm: 138, price: 99.85, wal: "4.8yr", factor: 1.00, bid: "Tight" },
    { rating: "AA", spread: "S+185", dm: 192, price: 99.52, wal: "5.1yr", factor: 1.00, bid: "Fair" },
    { rating: "A", spread: "S+230", dm: 245, price: 98.90, wal: "5.3yr", factor: 1.00, bid: "Fair" },
    { rating: "BBB", spread: "S+335", dm: 358, price: 97.25, wal: "5.5yr", factor: 1.00, bid: "Wide" },
    { rating: "BB", spread: "S+625", dm: 680, price: 93.50, wal: "5.8yr", factor: 0.98, bid: "Wide" },
    { rating: "B", spread: "S+950", dm: 1050, price: 88.75, wal: "6.1yr", factor: 0.95, bid: "Very Wide" },
    { rating: "Equity", spread: "N/A", dm: 0, price: 72.50, wal: "7.2yr", factor: 0.82, bid: "Illiquid" },
  ];

  const managers = [
    { name: "Blackstone", aum: "$48.2B", deals: 42, default: "0.8%", recovery: "72%", jr_oc: 112.5 },
    { name: "PGIM", aum: "$38.5B", deals: 35, default: "0.6%", recovery: "75%", jr_oc: 115.2 },
    { name: "Carlyle", aum: "$34.8B", deals: 30, default: "0.9%", recovery: "70%", jr_oc: 110.8 },
    { name: "Apollo", aum: "$31.2B", deals: 28, default: "0.7%", recovery: "73%", jr_oc: 113.5 },
    { name: "Ares", aum: "$29.5B", deals: 26, default: "0.5%", recovery: "78%", jr_oc: 118.1 },
    { name: "KKR", aum: "$27.8B", deals: 24, default: "0.8%", recovery: "71%", jr_oc: 111.2 },
    { name: "Octagon", aum: "$22.1B", deals: 20, default: "0.4%", recovery: "80%", jr_oc: 120.3 },
    { name: "Sculptor", aum: "$18.5B", deals: 16, default: "1.1%", recovery: "68%", jr_oc: 108.5 },
  ];

  const ratingColor = (r: string) => {
    if (r === "AAA" || r === "AA") return "#22c55e";
    if (r === "A" || r === "BBB") return "#fbbf24";
    if (r === "BB" || r === "B") return "#ef4444";
    return "#a855f7";
  };

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏗️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CLO ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg CLOA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["deals", "tranches", "managers", "market"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "deals" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US BSL CLO DEAL UNIVERSE</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Deal", "Manager", "Size", "WAL", "NAV Disc", "Status"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map(d => (
                    <tr key={d.name} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{d.name}</td>
                      <td className="px-2 py-1.5">{d.manager}</td>
                      <td className="px-2 py-1.5 font-mono">{d.size}</td>
                      <td className="px-2 py-1.5 font-mono">{d.wal}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: d.navDisc.startsWith("+") ? "#22c55e" : "#ef4444" }}>{d.navDisc}</td>
                      <td className="px-2 py-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[8px]" style={{
                          background: d.status === "Reinvesting" ? "rgba(34,197,94,0.15)" : d.status === "Ramp-Up" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                          color: d.status === "Reinvesting" ? "#22c55e" : d.status === "Ramp-Up" ? "#38bdf8" : "#fbbf24"
                        }}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "tranches" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLO TRANCHE PRICING — GENERIC NEW ISSUE</div>
            {tranches.map(t => (
              <div key={t.rating} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `rgba(${ratingColor(t.rating).slice(1)},0.15)`.replace(/([0-9a-f]{2})/gi, (_, h) => parseInt(h, 16) + ",").slice(0, -1).replace("rgba(", `rgba(`) + ",0.15)", color: ratingColor(t.rating) }}>{t.rating}</span>
                    <span className="font-bold">{t.spread}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: t.price >= 99 ? "#22c55e" : t.price >= 95 ? "#fbbf24" : "#ef4444" }}>{t.price.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>DM:</span> <span className="font-mono">{t.dm || "—"}</span></div>
                  <div><span style={{ color: "#64748b" }}>WAL:</span> <span className="font-mono">{t.wal}</span></div>
                  <div><span style={{ color: "#64748b" }}>Factor:</span> <span className="font-mono">{t.factor.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>Bid:</span> <span style={{ color: t.bid === "Tight" ? "#22c55e" : t.bid === "Fair" ? "#fbbf24" : "#ef4444" }}>{t.bid}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "managers" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP CLO MANAGERS BY AUM</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Manager", "AUM", "Deals", "Default Rate", "Recovery", "Jr OC Test"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {managers.map(m => (
                    <tr key={m.name} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{m.name}</td>
                      <td className="px-2 py-1.5 font-mono">{m.aum}</td>
                      <td className="px-2 py-1.5 font-mono">{m.deals}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: parseFloat(m.default) <= 0.6 ? "#22c55e" : parseFloat(m.default) <= 0.9 ? "#fbbf24" : "#ef4444" }}>{m.default}</td>
                      <td className="px-2 py-1.5 font-mono">{m.recovery}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: m.jr_oc >= 115 ? "#22c55e" : m.jr_oc >= 110 ? "#fbbf24" : "#ef4444" }}>{m.jr_oc.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "market" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLO MARKET OVERVIEW — 2024 YTD</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "New Issuance", val: "$148B", chg: "+32% YoY" },
                { label: "Refi/Reset", val: "$85B", chg: "+58% YoY" },
                { label: "Total Outstanding", val: "$1.05T", chg: "+8% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#22c55e" }}>{s.chg}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LOAN MARKET HEALTH</div>
            {[
              { metric: "LLI Default Rate (12M)", val: "1.8%", threshold: 2.0, good: true },
              { metric: "Loan Recovery Rate", val: "62%", threshold: 60, good: true },
              { metric: "CCC Bucket (Avg)", val: "4.2%", threshold: 7.5, good: true },
              { metric: "Jr OC Cushion (Avg)", val: "3.8%", threshold: 2.0, good: true },
              { metric: "WARF (Avg)", val: "2820", threshold: 3000, good: true },
              { metric: "Diversity Score (Avg)", val: "78", threshold: 60, good: true },
            ].map(m => (
              <div key={m.metric} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span>{m.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{m.val}</span>
                  <span className="text-[8px]" style={{ color: m.good ? "#22c55e" : "#ef4444" }}>{m.good ? "PASS" : "WATCH"}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ISSUANCE BY MONTH (2024)</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => {
                const vals = [12.5, 14.2, 15.8, 13.1, 16.5, 14.8, 11.2, 9.5, 15.2, 13.8, 11.5];
                const h = (vals[i] / 17) * 75;
                return (
                  <g key={m}>
                    <rect x={8 + i * 35} y={85 - h} width={28} height={h} rx={2} fill="rgba(0,229,160,0.3)" stroke="#00e5a0" strokeWidth={0.5} />
                    <text x={22 + i * 35} y={96} textAnchor="middle" fill="#64748b" fontSize={7}>{m}</text>
                    <text x={22 + i * 35} y={81 - h} textAnchor="middle" fill="#94a3b8" fontSize={6}>${vals[i]}B</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
