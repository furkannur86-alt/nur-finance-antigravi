"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "aum" | "strategies" | "filings" | "performance";

export default function HedgeFundMonitorPanel() {
  const [tab, setTab] = useState<Tab>("aum");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🦈</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>HEDGE FUND MONITOR</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg HEDG</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["aum", "strategies", "filings", "performance"] as Tab[]).map(t => (
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
          { label: "INDUSTRY AUM", value: "$4.5T", color: "#a855f7" },
          { label: "NET FLOWS (Q3)", value: "+$28B", color: "#22c55e" },
          { label: "AVG RETURN YTD", value: "+8.4%", color: "#fbbf24" },
          { label: "FUND LAUNCHES", value: "142", color: "#38bdf8" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "aum" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>TOP HEDGE FUNDS BY AUM</div>
            {[
              { name: "Bridgewater Associates", aum: "$124B", strategy: "Global Macro", ytd: 5.2, flagship: "Pure Alpha", location: "Westport, CT" },
              { name: "Man Group", aum: "$151B", strategy: "Quant/Systematic", ytd: 9.8, flagship: "AHL Alpha", location: "London" },
              { name: "Citadel", aum: "$63B", strategy: "Multi-Strategy", ytd: 15.2, flagship: "Wellington", location: "Miami" },
              { name: "D.E. Shaw", aum: "$60B", strategy: "Quant/Systematic", ytd: 12.4, flagship: "Composite", location: "New York" },
              { name: "Two Sigma", aum: "$58B", strategy: "Quant/Systematic", ytd: 10.8, flagship: "Spectrum", location: "New York" },
              { name: "Millennium Mgmt", aum: "$62B", strategy: "Multi-Strategy", ytd: 11.5, flagship: "Intl", location: "New York" },
              { name: "Elliott Management", aum: "$65B", strategy: "Activist/Event", ytd: 8.2, flagship: "Intl Ltd", location: "West Palm Beach" },
              { name: "Renaissance Tech", aum: "$50B", strategy: "Quant/Systematic", ytd: 24.5, flagship: "Medallion", location: "East Setauket" },
            ].map(f => (
              <div key={f.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="font-bold" style={{ color: "#a855f7" }}>{f.name}</span>
                    <span className="ml-2 text-[8px]" style={{ color: "#64748b" }}>{f.location}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{f.aum}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Strategy:</span> <span>{f.strategy}</span></div>
                  <div><span style={{ color: "#64748b" }}>Flagship:</span> <span className="font-mono">{f.flagship}</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: f.ytd >= 10 ? "#22c55e" : f.ytd >= 5 ? "#fbbf24" : "#ef4444" }}>+{f.ytd}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "strategies" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>STRATEGY PERFORMANCE (YTD)</div>
            {[
              { strategy: "Equity Long/Short", return: 8.5, aum: "$850B", sharpe: 1.2, maxDD: -4.5, flows: 12.5 },
              { strategy: "Global Macro", return: 4.2, aum: "$420B", sharpe: 0.8, maxDD: -6.2, flows: -8.5 },
              { strategy: "Multi-Strategy", return: 12.8, aum: "$680B", sharpe: 2.1, maxDD: -2.8, flows: 42.5 },
              { strategy: "Quant/Systematic", return: 11.2, aum: "$520B", sharpe: 1.8, maxDD: -3.5, flows: 28.4 },
              { strategy: "Event-Driven", return: 6.8, aum: "$380B", sharpe: 1.0, maxDD: -5.8, flows: 5.2 },
              { strategy: "Credit/Distressed", return: 9.5, aum: "$290B", sharpe: 1.4, maxDD: -4.2, flows: 15.8 },
              { strategy: "Activist", return: 14.2, aum: "$180B", sharpe: 1.5, maxDD: -8.5, flows: 8.2 },
              { strategy: "Managed Futures (CTA)", return: 2.8, aum: "$350B", sharpe: 0.5, maxDD: -8.8, flows: -15.2 },
            ].map(s => (
              <div key={s.strategy} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.strategy}</span>
                  <span className="font-mono font-bold" style={{ color: s.return >= 10 ? "#22c55e" : s.return >= 5 ? "#fbbf24" : "#ef4444" }}>+{s.return}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>AUM:</span> <span className="font-mono">{s.aum}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sharpe:</span> <span className="font-mono" style={{ color: s.sharpe >= 1.5 ? "#22c55e" : s.sharpe >= 1 ? "#fbbf24" : "#ef4444" }}>{s.sharpe}</span></div>
                  <div><span style={{ color: "#64748b" }}>MaxDD:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{s.maxDD}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Flows:</span> <span className="font-mono" style={{ color: s.flows >= 0 ? "#22c55e" : "#ef4444" }}>{s.flows >= 0 ? "+" : ""}${s.flows}B</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "filings" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT 13F FILINGS — TOP POSITION CHANGES</div>
            {[
              { fund: "Citadel", action: "NEW", stock: "NVDA", shares: "12.5M", value: "$1.8B", pctPort: 2.8 },
              { fund: "Bridgewater", action: "SOLD", stock: "SPY", shares: "8.2M", value: "$3.8B", pctPort: -3.1 },
              { fund: "Millennium", action: "ADDED", stock: "TSLA", shares: "4.5M", value: "$1.2B", pctPort: 1.9 },
              { fund: "D.E. Shaw", action: "NEW", stock: "META", shares: "3.8M", value: "$2.1B", pctPort: 3.5 },
              { fund: "Two Sigma", action: "REDUCED", stock: "AAPL", shares: "-5.2M", value: "-$1.1B", pctPort: -1.8 },
              { fund: "Elliott", action: "ACTIVIST", stock: "SMCI", shares: "15M", value: "$580M", pctPort: 0.9 },
              { fund: "Renaissance", action: "ADDED", stock: "AMZN", shares: "2.8M", value: "$560M", pctPort: 1.1 },
            ].map(f => (
              <div key={`${f.fund}-${f.stock}`} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: f.action === "NEW" || f.action === "ADDED" ? "rgba(34,197,94,0.15)" : f.action === "SOLD" || f.action === "REDUCED" ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.15)",
                    color: f.action === "NEW" || f.action === "ADDED" ? "#22c55e" : f.action === "SOLD" || f.action === "REDUCED" ? "#ef4444" : "#a855f7"
                  }}>{f.action}</span>
                  <span className="font-bold">{f.fund}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#38bdf8" }}>{f.stock}</span>
                  <span>{f.shares} shr</span>
                  <span style={{ color: "#fbbf24" }}>{f.value}</span>
                  <span style={{ color: f.pctPort >= 0 ? "#22c55e" : "#ef4444" }}>{f.pctPort >= 0 ? "+" : ""}{f.pctPort}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "performance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HFRI INDEX PERFORMANCE</div>
            {[
              { index: "HFRI Fund Weighted Composite", mtd: 1.2, qtd: 3.5, ytd: 8.4, ann3y: 7.2, vol: 5.8 },
              { index: "HFRI Equity Hedge", mtd: 1.5, qtd: 4.2, ytd: 9.8, ann3y: 8.5, vol: 7.2 },
              { index: "HFRI Event-Driven", mtd: 0.8, qtd: 2.5, ytd: 6.8, ann3y: 6.2, vol: 5.2 },
              { index: "HFRI Macro/CTA", mtd: -0.5, qtd: 0.8, ytd: 2.8, ann3y: 4.5, vol: 8.5 },
              { index: "HFRI Relative Value", mtd: 0.6, qtd: 2.2, ytd: 7.5, ann3y: 6.8, vol: 3.8 },
            ].map(i => (
              <div key={i.index} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="font-bold mb-1" style={{ color: "#a855f7" }}>{i.index}</div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>MTD:</span> <span className="font-mono" style={{ color: i.mtd >= 0 ? "#22c55e" : "#ef4444" }}>{i.mtd >= 0 ? "+" : ""}{i.mtd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>QTD:</span> <span className="font-mono" style={{ color: i.qtd >= 0 ? "#22c55e" : "#ef4444" }}>{i.qtd >= 0 ? "+" : ""}{i.qtd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: i.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{i.ytd >= 0 ? "+" : ""}{i.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>3Y Ann:</span> <span className="font-mono">{i.ann3y}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{i.vol}%</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>vs BENCHMARKS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "HFRI vs S&P 500", hf: 8.4, bench: 22.5 },
                { label: "HFRI vs 60/40", hf: 8.4, bench: 14.2 },
                { label: "HFRI Sharpe", value: "1.45" },
                { label: "S&P 500 Sharpe", value: "1.82" },
              ].map(b => (
                <div key={b.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{b.label}</div>
                  {"value" in b ? (
                    <div className="font-mono font-bold text-sm mt-1" style={{ color: "#a855f7" }}>{b.value}</div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-bold" style={{ color: "#a855f7" }}>{b.hf}%</span>
                      <span className="text-[8px]" style={{ color: "#64748b" }}>vs</span>
                      <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>{b.bench}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
