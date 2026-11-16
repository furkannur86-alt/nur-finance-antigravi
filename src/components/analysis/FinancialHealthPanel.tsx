"use client";

import { useState } from "react";
import DemoBadge from "../ui/DemoBadge";

interface HealthMetrics {
  ticker: string;
  name: string;
  sector: string;
  piotroski: number;
  altmanZ: number;
  beneishM: number;
  debtToEquity: number;
  currentRatio: number;
  fcfToNetDebt: number;
  roe: number;
  roa: number;
  grossMargin: number;
}

const MOCK_STOCKS: HealthMetrics[] = [
  { ticker: "AAPL", name: "Apple Inc", sector: "Technology", piotroski: 7, altmanZ: 8.42, beneishM: -2.84, debtToEquity: 1.73, currentRatio: 0.94, fcfToNetDebt: 0.52, roe: 0.147, roa: 0.062, grossMargin: 0.433 },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", piotroski: 8, altmanZ: 11.2, beneishM: -2.91, debtToEquity: 0.33, currentRatio: 1.77, fcfToNetDebt: 0.98, roe: 0.388, roa: 0.189, grossMargin: 0.699 },
  { ticker: "TSLA", name: "Tesla Inc", sector: "Consumer Cyclical", piotroski: 5, altmanZ: 4.18, beneishM: -2.12, debtToEquity: 0.08, currentRatio: 1.73, fcfToNetDebt: 0.31, roe: 0.183, roa: 0.096, grossMargin: 0.183 },
  { ticker: "META", name: "Meta Platforms", sector: "Communication", piotroski: 7, altmanZ: 9.74, beneishM: -2.76, debtToEquity: 0.11, currentRatio: 2.67, fcfToNetDebt: 1.44, roe: 0.282, roa: 0.167, grossMargin: 0.806 },
  { ticker: "GME",  name: "GameStop", sector: "Consumer Cyclical", piotroski: 2, altmanZ: 1.23, beneishM: -1.44, debtToEquity: 0.08, currentRatio: 1.12, fcfToNetDebt: -0.4, roe: -0.021, roa: -0.009, grossMargin: 0.218 },
  { ticker: "NVDA", name: "NVIDIA Corp", sector: "Technology", piotroski: 9, altmanZ: 15.3, beneishM: -2.95, debtToEquity: 0.42, currentRatio: 4.17, fcfToNetDebt: 2.1, roe: 0.552, roa: 0.293, grossMargin: 0.745 },
];

function piotroskiColor(score: number): string {
  if (score >= 7) return "#10b981";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

function piotroskiLabel(score: number): string {
  if (score >= 7) return "STRONG";
  if (score >= 4) return "MODERATE";
  return "WEAK";
}

function altmanColor(z: number): string {
  if (z > 2.99) return "#10b981";
  if (z > 1.81) return "#f59e0b";
  return "#ef4444";
}

function altmanLabel(z: number): string {
  if (z > 2.99) return "SAFE";
  if (z > 1.81) return "GREY ZONE";
  return "DISTRESS";
}

function beneishColor(m: number): string {
  if (m < -2.22) return "#10b981";
  if (m < -1.78) return "#f59e0b";
  return "#ef4444";
}

function beneishLabel(m: number): string {
  if (m < -2.22) return "CLEAN";
  if (m < -1.78) return "CAUTION";
  return "LIKELY MANIPULATOR";
}

function trafficLight(value: number, good: number, warn: number, invert = false): string {
  const v = invert ? -value : value;
  const g = invert ? -good : good;
  const w = invert ? -warn : warn;
  if (v >= g) return "#10b981";
  if (v >= w) return "#f59e0b";
  return "#ef4444";
}

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm border border-white/10 transition-colors"
            style={{ backgroundColor: i < score ? color : "rgba(255,255,255,0.05)" }}
          />
        ))}
      </div>
      <span className="font-bold tabular-nums" style={{ color }}>{score}/{max}</span>
    </div>
  );
}

export default function FinancialHealthPanel() {
  const [selected, setSelected] = useState<string>("NVDA");

  const stock = MOCK_STOCKS.find(s => s.ticker === selected) || MOCK_STOCKS[0];

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <div className="flex items-center gap-2">
          <span className="text-[#00c8ff] font-bold text-sm">FINANCIAL HEALTH SCORES</span>
          <DemoBadge />
        </div>
        <span className="text-[10px] text-slate-500">Piotroski · Altman · Beneish</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Stock list */}
        <div className="w-36 border-r border-white/10 overflow-y-auto flex-shrink-0">
          {MOCK_STOCKS.map(s => (
            <div
              key={s.ticker}
              onClick={() => setSelected(s.ticker)}
              className={`px-3 py-2.5 cursor-pointer border-b border-white/5 transition-colors ${selected === s.ticker ? "bg-[#1a1f2e] border-l-2 border-l-[#00c8ff]" : "hover:bg-[#12151c]"}`}
            >
              <div className="font-bold text-[#00c8ff]">{s.ticker}</div>
              <div className="text-[10px] text-slate-500 truncate">{s.sector}</div>
              <div className="mt-1 flex gap-1">
                <span style={{ color: piotroskiColor(s.piotroski) }} className="text-[9px] font-bold">F:{s.piotroski}</span>
                <span style={{ color: altmanColor(s.altmanZ) }} className="text-[9px] font-bold">Z:{s.altmanZ.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-white">{stock.ticker}</span>
            <span className="text-slate-400">{stock.name}</span>
            <span className="text-[10px] text-slate-600 border border-white/10 px-1.5 py-0.5 rounded">{stock.sector}</span>
          </div>

          {/* Three score cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* Piotroski */}
            <div className="bg-[#12151c] rounded-lg border border-white/10 p-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Piotroski F-Score</div>
              <div className="text-3xl font-bold mb-1" style={{ color: piotroskiColor(stock.piotroski) }}>{stock.piotroski}</div>
              <div className="text-[10px] font-bold mb-2" style={{ color: piotroskiColor(stock.piotroski) }}>{piotroskiLabel(stock.piotroski)}</div>
              <ScoreBar score={stock.piotroski} max={9} color={piotroskiColor(stock.piotroski)} />
              <div className="mt-2 text-[9px] text-slate-600">0-2 weak · 3-6 moderate · 7-9 strong</div>
            </div>
            {/* Altman Z */}
            <div className="bg-[#12151c] rounded-lg border border-white/10 p-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Altman Z-Score</div>
              <div className="text-3xl font-bold mb-1" style={{ color: altmanColor(stock.altmanZ) }}>{stock.altmanZ.toFixed(2)}</div>
              <div className="text-[10px] font-bold mb-2" style={{ color: altmanColor(stock.altmanZ) }}>{altmanLabel(stock.altmanZ)}</div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(stock.altmanZ / 20 * 100, 100)}%`, backgroundColor: altmanColor(stock.altmanZ) }} />
              </div>
              <div className="mt-2 text-[9px] text-slate-600">&lt;1.81 distress · 1.81–2.99 grey · &gt;2.99 safe</div>
            </div>
            {/* Beneish M */}
            <div className="bg-[#12151c] rounded-lg border border-white/10 p-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Beneish M-Score</div>
              <div className="text-3xl font-bold mb-1" style={{ color: beneishColor(stock.beneishM) }}>{stock.beneishM.toFixed(2)}</div>
              <div className="text-[10px] font-bold mb-2" style={{ color: beneishColor(stock.beneishM) }}>{beneishLabel(stock.beneishM)}</div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min((-stock.beneishM / 4) * 100, 100))}%`, backgroundColor: beneishColor(stock.beneishM) }} />
              </div>
              <div className="mt-2 text-[9px] text-slate-600">&gt;-1.78 likely manipulator · &lt;-2.22 clean</div>
            </div>
          </div>

          {/* Key ratios */}
          <div className="bg-[#12151c] rounded-lg border border-white/10 p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">KEY FINANCIAL RATIOS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Debt / Equity", value: stock.debtToEquity.toFixed(2), color: trafficLight(stock.debtToEquity, 0.5, 1.5, true), suffix: "x" },
                { label: "Current Ratio", value: stock.currentRatio.toFixed(2), color: trafficLight(stock.currentRatio, 1.5, 1.0), suffix: "x" },
                { label: "FCF / Net Debt", value: stock.fcfToNetDebt.toFixed(2), color: trafficLight(stock.fcfToNetDebt, 0.5, 0.0), suffix: "x" },
                { label: "Return on Equity", value: `${(stock.roe * 100).toFixed(1)}`, color: trafficLight(stock.roe, 0.15, 0.05), suffix: "%" },
                { label: "Return on Assets", value: `${(stock.roa * 100).toFixed(1)}`, color: trafficLight(stock.roa, 0.08, 0.02), suffix: "%" },
                { label: "Gross Margin", value: `${(stock.grossMargin * 100).toFixed(1)}`, color: trafficLight(stock.grossMargin, 0.4, 0.2), suffix: "%" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-slate-400">{r.label}</span>
                  </div>
                  <span className="font-bold tabular-nums" style={{ color: r.color }}>{r.value}{r.suffix}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-white/10 text-[9px] text-slate-600">
        MOCK FUNDAMENTAL DATA · NOT INVESTMENT ADVICE
      </div>
    </div>
  );
}
