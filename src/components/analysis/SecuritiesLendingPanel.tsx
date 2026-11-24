"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "inventory" | "rates" | "shorts" | "recalls";

export default function SecuritiesLendingPanel() {
  const [tab, setTab] = useState<Tab>("inventory");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔄</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SECURITIES LENDING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg SL</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["inventory", "rates", "shorts", "recalls"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "inventory" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LENDABLE INVENTORY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Lendable", value: "$2.8T" },
                { label: "On Loan", value: "$485B" },
                { label: "Utilization", value: "17.3%" },
                { label: "Revenue (MTD)", value: "$1.2B" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP BORROWED SECURITIES</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Ticker", "On Loan", "Util %", "Fee (bps)", "Days", "Special"].map(h => (
                      <th key={h} className="px-2 py-1.5 text-right first:text-left" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ticker: "TSLA", onLoan: "$18.5B", util: 42.5, fee: 85, days: 12, special: true },
                    { ticker: "GME", onLoan: "$4.2B", util: 78.2, fee: 1250, days: 8, special: true },
                    { ticker: "AMC", onLoan: "$2.1B", util: 65.8, fee: 850, days: 15, special: true },
                    { ticker: "AAPL", onLoan: "$22.8B", util: 8.2, fee: 15, days: 25, special: false },
                    { ticker: "NVDA", onLoan: "$15.2B", util: 12.5, fee: 25, days: 18, special: false },
                    { ticker: "RIVN", onLoan: "$3.8B", util: 55.2, fee: 420, days: 10, special: true },
                    { ticker: "MSTR", onLoan: "$5.5B", util: 48.8, fee: 350, days: 7, special: true },
                    { ticker: "MSFT", onLoan: "$18.2B", util: 5.8, fee: 10, days: 30, special: false },
                  ].map(s => (
                    <tr key={s.ticker} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{s.ticker}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{s.onLoan}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: s.util > 50 ? "#ef4444" : s.util > 20 ? "#fbbf24" : "#22c55e" }}>{s.util}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: s.fee > 100 ? "#ef4444" : "#e2e8f0" }}>{s.fee}</td>
                      <td className="px-2 py-1.5 text-right font-mono">{s.days}</td>
                      <td className="px-2 py-1.5 text-right">
                        {s.special && <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>SPECIAL</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "rates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LENDING RATE DISTRIBUTION</div>
            {[
              { bucket: "GC (< 50bps)", count: 2850, pct: 72, revenue: "$285M" },
              { bucket: "Warm (50-200bps)", count: 420, pct: 15, revenue: "$180M" },
              { bucket: "Special (200-1000bps)", count: 185, pct: 8, revenue: "$420M" },
              { bucket: "Hard-to-Borrow (>1000bps)", count: 65, pct: 5, revenue: "$315M" },
            ].map(b => (
              <div key={b.bucket} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{b.bucket}</span>
                  <span className="font-mono" style={{ color: "#00e5a0" }}>{b.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.pct > 50 ? "#22c55e" : b.pct > 10 ? "#fbbf24" : "#ef4444" }} />
                  </div>
                  <span className="font-mono text-[9px] w-16 text-right">{b.count} names</span>
                  <span className="font-mono text-[9px] w-10 text-right">{b.pct}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REBATE RATE MONITOR</div>
            {[
              { maturity: "Overnight", gc: 4.28, warm: 3.85, special: 1.50, htb: -2.50 },
              { maturity: "1 Week", gc: 4.25, warm: 3.78, special: 1.25, htb: -3.00 },
              { maturity: "1 Month", gc: 4.22, warm: 3.65, special: 0.85, htb: -4.50 },
              { maturity: "3 Month", gc: 4.18, warm: 3.52, special: 0.50, htb: -6.00 },
            ].map(r => (
              <div key={r.maturity} className="flex items-center gap-2 p-2 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-bold">{r.maturity}</span>
                <span className="font-mono flex-1 text-center" style={{ color: "#22c55e" }}>{r.gc.toFixed(2)}%</span>
                <span className="font-mono flex-1 text-center" style={{ color: "#fbbf24" }}>{r.warm.toFixed(2)}%</span>
                <span className="font-mono flex-1 text-center" style={{ color: "#ef4444" }}>{r.special.toFixed(2)}%</span>
                <span className="font-mono flex-1 text-center" style={{ color: "#ef4444" }}>{r.htb.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "shorts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SHORT INTEREST — HIGHEST CONVICTION</div>
            {[
              { ticker: "GME", si: 24.5, daysToCovert: 4.2, chg: 2.8, cost: 1250, squeeze: 85 },
              { ticker: "AMC", si: 18.2, daysToCovert: 3.5, chg: 1.5, cost: 850, squeeze: 72 },
              { ticker: "RIVN", si: 15.8, daysToCovert: 2.8, chg: -0.5, cost: 420, squeeze: 55 },
              { ticker: "MSTR", si: 12.5, daysToCovert: 1.8, chg: 3.2, cost: 350, squeeze: 62 },
              { ticker: "CVNA", si: 28.2, daysToCovert: 5.5, chg: -2.1, cost: 180, squeeze: 78 },
              { ticker: "BYND", si: 35.5, daysToCovert: 8.2, chg: 0.8, cost: 650, squeeze: 82 },
              { ticker: "LCID", si: 22.8, daysToCovert: 3.2, chg: -1.2, cost: 280, squeeze: 48 },
            ].map(s => (
              <div key={s.ticker} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{s.ticker}</span>
                    <span className="font-mono text-[8px]" style={{ color: "#ef4444" }}>SI: {s.si}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>Squeeze Risk:</span>
                    <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.squeeze}%`, background: s.squeeze > 70 ? "#ef4444" : s.squeeze > 40 ? "#fbbf24" : "#22c55e" }} />
                    </div>
                    <span className="font-mono text-[8px]">{s.squeeze}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>DTC:</span> <span className="font-mono">{s.daysToCovert}</span></div>
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: s.chg >= 0 ? "#ef4444" : "#22c55e" }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Cost:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{s.cost}bps</span></div>
                  <div><span style={{ color: "#64748b" }}>CTB Rate:</span> <span className="font-mono">{(s.cost / 100).toFixed(1)}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recalls" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE RECALL NOTICES</div>
            {[
              { ticker: "TSLA", shares: "1.2M", reason: "Corporate Action — Stock Split", deadline: "Dec 15", urgency: "HIGH" },
              { ticker: "GME", shares: "850K", reason: "Annual Meeting — Proxy Vote", deadline: "Dec 8", urgency: "CRITICAL" },
              { ticker: "NVDA", shares: "2.5M", reason: "Dividend Record Date", deadline: "Dec 12", urgency: "MEDIUM" },
              { ticker: "AAPL", shares: "3.8M", reason: "Beneficial Owner Inquiry", deadline: "Dec 20", urgency: "LOW" },
              { ticker: "AMC", shares: "1.5M", reason: "Lender Rebalance", deadline: "Dec 5", urgency: "HIGH" },
            ].map(r => (
              <div key={r.ticker} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${r.urgency === "CRITICAL" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: r.urgency === "CRITICAL" ? "rgba(239,68,68,0.15)" : r.urgency === "HIGH" ? "rgba(251,191,36,0.15)" : r.urgency === "MEDIUM" ? "rgba(56,189,248,0.15)" : "rgba(100,116,139,0.15)",
                      color: r.urgency === "CRITICAL" ? "#ef4444" : r.urgency === "HIGH" ? "#fbbf24" : r.urgency === "MEDIUM" ? "#38bdf8" : "#64748b",
                    }}>{r.urgency}</span>
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{r.ticker}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Due: {r.deadline}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{r.reason}</span>
                  <span className="font-mono">{r.shares} shares</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>FAIL-TO-DELIVER WATCHLIST</div>
            {[
              { ticker: "GME", ftd: 2850000, value: "$85.5M", age: 8, threshold: true },
              { ticker: "RIVN", ftd: 1250000, value: "$22.5M", age: 5, threshold: true },
              { ticker: "LCID", ftd: 3200000, value: "$9.6M", age: 3, threshold: false },
              { ticker: "MSTR", ftd: 450000, value: "$178.2M", age: 12, threshold: true },
            ].map(f => (
              <div key={f.ticker} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-12" style={{ color: "#38bdf8" }}>{f.ticker}</span>
                <span className="font-mono w-20">{(f.ftd / 1e6).toFixed(1)}M shares</span>
                <span className="font-mono w-16" style={{ color: "#fbbf24" }}>{f.value}</span>
                <span className="text-[9px] w-16">{f.age} days old</span>
                {f.threshold && <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>REG SHO</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
