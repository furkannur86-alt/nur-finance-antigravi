"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "mostshorted" | "squeezes" | "borrow" | "changes";

const SHORT_DATA = [
  { ticker: "CVNA", name: "Carvana Co", si: 32.5, siShares: "42.8M", dtc: 8.2, borrowRate: 28.5, utilization: 98, change1w: 2.4, squeeze: "HIGH" },
  { ticker: "BBBY", name: "Bed Bath Beyond", si: 45.2, siShares: "35.2M", dtc: 12.5, borrowRate: 85.0, utilization: 100, change1w: -3.8, squeeze: "EXTREME" },
  { ticker: "GME", name: "GameStop Corp", si: 18.5, siShares: "52.4M", dtc: 4.2, borrowRate: 8.5, utilization: 72, change1w: 1.2, squeeze: "MODERATE" },
  { ticker: "AMC", name: "AMC Entertainment", si: 22.8, siShares: "118.5M", dtc: 3.8, borrowRate: 12.4, utilization: 85, change1w: -0.8, squeeze: "MODERATE" },
  { ticker: "RIVN", name: "Rivian Automotive", si: 15.2, siShares: "28.5M", dtc: 5.4, borrowRate: 4.2, utilization: 42, change1w: 3.5, squeeze: "LOW" },
  { ticker: "LCID", name: "Lucid Group", si: 12.8, siShares: "22.1M", dtc: 4.8, borrowRate: 3.8, utilization: 38, change1w: 0.5, squeeze: "LOW" },
  { ticker: "BYND", name: "Beyond Meat", si: 38.5, siShares: "24.2M", dtc: 9.5, borrowRate: 42.0, utilization: 95, change1w: -1.2, squeeze: "HIGH" },
  { ticker: "UPST", name: "Upstart Holdings", si: 28.4, siShares: "22.8M", dtc: 6.8, borrowRate: 18.5, utilization: 88, change1w: 4.2, squeeze: "HIGH" },
  { ticker: "NKLA", name: "Nikola Corp", si: 25.5, siShares: "82.4M", dtc: 7.2, borrowRate: 15.8, utilization: 78, change1w: -2.1, squeeze: "MODERATE" },
  { ticker: "SPCE", name: "Virgin Galactic", si: 20.2, siShares: "48.5M", dtc: 5.5, borrowRate: 8.2, utilization: 65, change1w: 1.8, squeeze: "MODERATE" },
];

export default function ShortInterestPanel() {
  const [tab, setTab] = useState<Tab>("mostshorted");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📉</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SHORT INTEREST</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Bloomberg SI</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["mostshorted", "squeezes", "borrow", "changes"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "mostshorted" ? "TOP SI" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "AVG SI (S&P 500)", value: "2.8%", color: "#fbbf24" },
          { label: "HARD-TO-BORROW", value: "342", color: "#ef4444" },
          { label: "SQUEEZE ALERTS", value: "5", color: "#a855f7" },
          { label: "SI TREND", value: "RISING", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "mostshorted" && (
          <div className="space-y-1">
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Ticker</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>SI%</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>DTC</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Borrow</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Util%</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>1W Chg</th>
                    <th className="text-center px-2 py-1.5" style={{ color: "#64748b" }}>Squeeze</th>
                  </tr>
                </thead>
                <tbody>
                  {SHORT_DATA.sort((a, b) => b.si - a.si).map(d => (
                    <tr key={d.ticker} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5">
                        <span className="font-bold" style={{ color: "#ef4444" }}>{d.ticker}</span>
                        <span className="ml-1 text-[8px]" style={{ color: "#64748b" }}>{d.name}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold" style={{ color: d.si > 30 ? "#ef4444" : d.si > 20 ? "#fbbf24" : "#e2e8f0" }}>{d.si}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: d.dtc > 7 ? "#ef4444" : "#e2e8f0" }}>{d.dtc}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: d.borrowRate > 20 ? "#ef4444" : d.borrowRate > 10 ? "#fbbf24" : "#22c55e" }}>{d.borrowRate}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: d.utilization > 90 ? "#ef4444" : d.utilization > 70 ? "#fbbf24" : "#22c55e" }}>{d.utilization}%</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: d.change1w > 0 ? "#ef4444" : "#22c55e" }}>
                        {d.change1w > 0 ? "+" : ""}{d.change1w}%
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                          background: d.squeeze === "EXTREME" ? "rgba(239,68,68,0.2)" : d.squeeze === "HIGH" ? "rgba(251,191,36,0.15)" : d.squeeze === "MODERATE" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.05)",
                          color: d.squeeze === "EXTREME" ? "#ef4444" : d.squeeze === "HIGH" ? "#fbbf24" : d.squeeze === "MODERATE" ? "#38bdf8" : "#64748b"
                        }}>{d.squeeze}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "squeezes" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SHORT SQUEEZE INDICATORS</div>
            {SHORT_DATA.filter(d => d.squeeze === "EXTREME" || d.squeeze === "HIGH").map(d => (
              <div key={d.ticker} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${d.squeeze === "EXTREME" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.15)"}`
              }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#ef4444" }}>{d.ticker}</span>
                    <span>{d.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold animate-pulse" style={{
                    background: d.squeeze === "EXTREME" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.15)",
                    color: d.squeeze === "EXTREME" ? "#ef4444" : "#fbbf24"
                  }}>{d.squeeze} SQUEEZE RISK</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "Short Interest", value: `${d.si}%`, threshold: "30%", met: d.si > 30, weight: d.si / 50 * 100 },
                    { label: "Days to Cover", value: `${d.dtc}`, threshold: ">7 days", met: d.dtc > 7, weight: Math.min(d.dtc / 15 * 100, 100) },
                    { label: "Borrow Rate", value: `${d.borrowRate}%`, threshold: ">20%", met: d.borrowRate > 20, weight: Math.min(d.borrowRate / 100 * 100, 100) },
                    { label: "Utilization", value: `${d.utilization}%`, threshold: ">90%", met: d.utilization > 90, weight: d.utilization },
                  ].map(ind => (
                    <div key={ind.label} className="flex items-center gap-2 text-[9px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: ind.met ? "#ef4444" : "#64748b" }} />
                      <span className="w-24">{ind.label}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${ind.weight}%`, background: ind.met ? "#ef4444" : "#fbbf24" }} />
                      </div>
                      <span className="font-mono w-14 text-right" style={{ color: ind.met ? "#ef4444" : "#e2e8f0" }}>{ind.value}</span>
                      <span className="text-[8px] w-14" style={{ color: "#64748b" }}>{ind.threshold}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "borrow" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECURITIES LENDING & BORROW RATES</div>
            {SHORT_DATA.sort((a, b) => b.borrowRate - a.borrowRate).map(d => (
              <div key={d.ticker} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-20">
                  <span className="font-bold" style={{ color: "#ef4444" }}>{d.ticker}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>Borrow Rate:</span>
                    <span className="font-mono font-bold" style={{ color: d.borrowRate > 20 ? "#ef4444" : d.borrowRate > 10 ? "#fbbf24" : "#22c55e" }}>{d.borrowRate}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${Math.min(d.borrowRate, 100)}%`,
                      background: d.borrowRate > 50 ? "#ef4444" : d.borrowRate > 20 ? "#fbbf24" : "#22c55e"
                    }} />
                  </div>
                </div>
                <div className="text-right text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Util:</span> <span className="font-mono">{d.utilization}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Avail:</span> <span className="font-mono" style={{ color: d.utilization > 90 ? "#ef4444" : "#22c55e" }}>{d.utilization > 90 ? "SCARCE" : d.utilization > 70 ? "LIMITED" : "AVAILABLE"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "changes" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BIGGEST SI CHANGES (1 WEEK)</div>
            <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>INCREASING SHORT INTEREST</div>
            {SHORT_DATA.filter(d => d.change1w > 0).sort((a, b) => b.change1w - a.change1w).map(d => (
              <div key={d.ticker} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "#ef4444" }}>{d.ticker}</span>
                  <span className="text-[9px]">{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">{d.si}% SI</span>
                  <span className="font-mono font-bold" style={{ color: "#ef4444" }}>+{d.change1w}%</span>
                  <span className="text-[8px]" style={{ color: "#94a3b8" }}>Bears adding</span>
                </div>
              </div>
            ))}
            <div className="text-[9px] font-bold mt-2" style={{ color: "#22c55e" }}>DECREASING SHORT INTEREST</div>
            {SHORT_DATA.filter(d => d.change1w < 0).sort((a, b) => a.change1w - b.change1w).map(d => (
              <div key={d.ticker} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.1)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "#22c55e" }}>{d.ticker}</span>
                  <span className="text-[9px]">{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">{d.si}% SI</span>
                  <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{d.change1w}%</span>
                  <span className="text-[8px]" style={{ color: "#94a3b8" }}>Bears covering</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
