"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const PREDEFINED_INDICES = [
  { name: "NUR Mega Cap Tech", ticker: "NUR-MTECH", constituents: 8, ytd: 34.2, sharpe: 1.82, vol: 18.5,
    holdings: [
      { ticker: "AAPL", weight: 18.5, return1y: 28.4 }, { ticker: "MSFT", weight: 17.2, return1y: 32.1 },
      { ticker: "NVDA", weight: 15.8, return1y: 85.3 }, { ticker: "GOOGL", weight: 13.4, return1y: 24.8 },
      { ticker: "AMZN", weight: 12.1, return1y: 42.5 }, { ticker: "META", weight: 10.5, return1y: 55.2 },
      { ticker: "TSLA", weight: 7.2, return1y: -12.4 }, { ticker: "AVGO", weight: 5.3, return1y: 68.1 },
    ]},
  { name: "NUR Dividend Aristocrats", ticker: "NUR-DVAR", constituents: 12, ytd: 12.8, sharpe: 1.24, vol: 11.2,
    holdings: [
      { ticker: "JNJ", weight: 12.0, return1y: 8.4 }, { ticker: "PG", weight: 11.5, return1y: 11.2 },
      { ticker: "KO", weight: 10.8, return1y: 9.5 }, { ticker: "PEP", weight: 10.2, return1y: 7.8 },
      { ticker: "MMM", weight: 8.5, return1y: -4.2 }, { ticker: "IBM", weight: 8.0, return1y: 18.5 },
    ]},
  { name: "NUR AI & Robotics", ticker: "NUR-AIRO", constituents: 10, ytd: 52.4, sharpe: 1.95, vol: 28.4,
    holdings: [
      { ticker: "NVDA", weight: 22.0, return1y: 85.3 }, { ticker: "MSFT", weight: 15.0, return1y: 32.1 },
      { ticker: "GOOGL", weight: 12.0, return1y: 24.8 }, { ticker: "PLTR", weight: 10.0, return1y: 145.2 },
      { ticker: "ARM", weight: 9.0, return1y: 95.1 }, { ticker: "SMCI", weight: 8.0, return1y: 112.8 },
    ]},
  { name: "NUR Clean Energy", ticker: "NUR-CLEN", constituents: 8, ytd: -8.5, sharpe: 0.42, vol: 32.1,
    holdings: [
      { ticker: "ENPH", weight: 18.0, return1y: -22.5 }, { ticker: "SEDG", weight: 15.0, return1y: -35.8 },
      { ticker: "FSLR", weight: 14.0, return1y: 12.4 }, { ticker: "NEE", weight: 12.0, return1y: 8.2 },
    ]},
];

type Tab = "indices" | "builder" | "backtest";

export default function IndexBuilderPanel() {
  const [tab, setTab] = useState<Tab>("indices");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [builderName, setBuilderName] = useState("My Custom Index");
  const [weighting, setWeighting] = useState<"equal" | "mcap" | "custom">("equal");

  const selected = PREDEFINED_INDICES[selectedIdx];

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INDEX BUILDER</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Bloomberg MEMB</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["indices", "builder", "backtest"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "indices" && (
          <div className="space-y-2">
            {PREDEFINED_INDICES.map((idx, i) => (
              <div key={i} className="p-3 rounded cursor-pointer"
                onClick={() => setSelectedIdx(i)}
                style={{ background: selectedIdx === i ? "rgba(0,229,160,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedIdx === i ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{idx.name}</span>
                    <span className="ml-2 text-[9px] font-mono" style={{ color: "#64748b" }}>{idx.ticker}</span>
                  </div>
                  <div className="flex gap-3 text-[9px]">
                    <span style={{ color: "#64748b" }}>{idx.constituents} holdings</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>YTD</div>
                    <div className="font-mono font-bold" style={{ color: idx.ytd > 0 ? "#22c55e" : "#ef4444" }}>
                      {idx.ytd > 0 ? "+" : ""}{idx.ytd}%
                    </div>
                  </div>
                  <div className="p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>SHARPE</div>
                    <div className="font-mono font-bold" style={{ color: idx.sharpe > 1.5 ? "#22c55e" : idx.sharpe > 1 ? "#fbbf24" : "#ef4444" }}>
                      {idx.sharpe.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>VOL</div>
                    <div className="font-mono font-bold" style={{ color: "#38bdf8" }}>{idx.vol}%</div>
                  </div>
                </div>

                {selectedIdx === i && (
                  <div className="mt-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="text-[8px] font-bold mb-1" style={{ color: "#fbbf24" }}>HOLDINGS</div>
                    {idx.holdings.map(h => (
                      <div key={h.ticker} className="flex items-center gap-2 py-1">
                        <span className="font-bold w-12" style={{ color: "#00e5a0" }}>{h.ticker}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full" style={{ width: `${h.weight * 4}%`, background: "#06b6d4" }} />
                        </div>
                        <span className="font-mono w-12 text-right" style={{ color: "#94a3b8" }}>{h.weight}%</span>
                        <span className="font-mono w-14 text-right" style={{ color: h.return1y > 0 ? "#22c55e" : "#ef4444" }}>
                          {h.return1y > 0 ? "+" : ""}{h.return1y}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "builder" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>INDEX CONFIGURATION</div>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px]" style={{ color: "#64748b" }}>Index Name</label>
                  <input value={builderName} onChange={e => setBuilderName(e.target.value)}
                    className="w-full mt-0.5 p-1.5 rounded text-[11px] bg-transparent outline-none"
                    style={{ border: "1px solid rgba(0,229,160,0.2)", color: "#e2e8f0" }} />
                </div>
                <div>
                  <label className="text-[9px]" style={{ color: "#64748b" }}>Weighting Method</label>
                  <div className="flex gap-1 mt-0.5">
                    {(["equal", "mcap", "custom"] as const).map(w => (
                      <button key={w} onClick={() => setWeighting(w)}
                        className="px-3 py-1 rounded text-[9px] font-bold uppercase"
                        style={{ background: weighting === w ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.03)", color: weighting === w ? "#00e5a0" : "#64748b" }}>
                        {w === "mcap" ? "Market Cap" : w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>UNIVERSE FILTERS</div>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                {[
                  { label: "Min Market Cap", value: "$10B" },
                  { label: "Max Market Cap", value: "No Limit" },
                  { label: "Sector", value: "All Sectors" },
                  { label: "Country", value: "US Only" },
                  { label: "Min Avg Volume", value: "$50M/day" },
                  { label: "Rebalance", value: "Quarterly" },
                ].map(f => (
                  <div key={f.label} className="flex justify-between p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span style={{ color: "#64748b" }}>{f.label}</span>
                    <span style={{ color: "#38bdf8" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2 rounded text-[10px] font-bold" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
              BUILD INDEX
            </button>
          </div>
        )}

        {tab === "backtest" && (
          <div className="space-y-3">
            <div className="text-[9px]" style={{ color: "#64748b" }}>Hypothetical backtest results for NUR Mega Cap Tech index</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Return", value: "+182.4%", color: "#22c55e" },
                { label: "Annualized", value: "+24.8%", color: "#22c55e" },
                { label: "Max Drawdown", value: "-28.5%", color: "#ef4444" },
                { label: "Sharpe Ratio", value: "1.82", color: "#fbbf24" },
                { label: "Sortino", value: "2.45", color: "#22c55e" },
                { label: "Calmar", value: "0.87", color: "#38bdf8" },
                { label: "Win Rate", value: "58.2%", color: "#22c55e" },
                { label: "Beta vs SPX", value: "1.24", color: "#a855f7" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>ANNUAL RETURNS</div>
              {[
                { year: "2026 YTD", ret: 34.2, spx: 22.1 },
                { year: "2025", ret: 42.8, spx: 24.5 },
                { year: "2024", ret: 55.2, spx: 23.3 },
                { year: "2023", ret: 68.4, spx: 24.2 },
                { year: "2022", ret: -32.5, spx: -19.4 },
              ].map(y => (
                <div key={y.year} className="flex items-center gap-2 py-1 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <span className="w-16 font-mono" style={{ color: "#94a3b8" }}>{y.year}</span>
                  <div className="flex-1 flex gap-1 items-center">
                    <div className="flex-1 h-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="h-full rounded" style={{ width: `${Math.min(Math.abs(y.ret), 100)}%`, background: y.ret > 0 ? "#22c55e" : "#ef4444" }} />
                    </div>
                    <span className="font-mono w-14 text-right" style={{ color: y.ret > 0 ? "#22c55e" : "#ef4444" }}>
                      {y.ret > 0 ? "+" : ""}{y.ret}%
                    </span>
                  </div>
                  <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>
                    SPX {y.spx > 0 ? "+" : ""}{y.spx}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
