"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DemoBadge from "../ui/DemoBadge";

interface Stock {
  ticker: string;
  name: string;
  sector: string;
  marketCap: number;
  pe: number;
  pb: number;
  ps: number;
  evEbitda: number;
  dividendYield: number;
  roe: number;
  roa: number;
  revenueGrowth: number;
  margin: number;
}

const MOCK_STOCKS: Stock[] = [
  { ticker: "NVDA",  name: "NVIDIA Corp",          sector: "Technology",          marketCap: 2148e9,  pe: 65.4,  pb: 42.1, ps: 28.3, evEbitda: 48.2, dividendYield: 0.03, roe: 55.2, roa: 29.3, revenueGrowth: 122.4, margin: 55.0 },
  { ticker: "MSFT",  name: "Microsoft Corp",        sector: "Technology",          marketCap: 3080e9,  pe: 36.2,  pb: 12.4, ps: 13.8, evEbitda: 27.1, dividendYield: 0.74, roe: 38.8, roa: 18.9, revenueGrowth: 15.2,  margin: 43.3 },
  { ticker: "AAPL",  name: "Apple Inc",             sector: "Technology",          marketCap: 2920e9,  pe: 30.1,  pb: 48.2, ps: 8.1,  evEbitda: 24.4, dividendYield: 0.52, roe: 14.7, roa: 6.2,  revenueGrowth: 2.1,   margin: 26.4 },
  { ticker: "META",  name: "Meta Platforms",        sector: "Communication",       marketCap: 1397e9,  pe: 28.4,  pb: 7.2,  ps: 9.4,  evEbitda: 20.8, dividendYield: 0.0,  roe: 28.2, roa: 16.7, revenueGrowth: 24.1,  margin: 36.8 },
  { ticker: "GOOGL", name: "Alphabet Inc",          sector: "Communication",       marketCap: 2194e9,  pe: 24.2,  pb: 6.4,  ps: 6.2,  evEbitda: 18.4, dividendYield: 0.0,  roe: 24.8, roa: 15.1, revenueGrowth: 11.3,  margin: 27.4 },
  { ticker: "AMZN",  name: "Amazon.com Inc",        sector: "Consumer Cyclical",   marketCap: 2082e9,  pe: 44.1,  pb: 8.8,  ps: 3.1,  evEbitda: 32.1, dividendYield: 0.0,  roe: 18.4, roa: 8.2,  revenueGrowth: 11.0,  margin: 7.4  },
  { ticker: "TSLA",  name: "Tesla Inc",             sector: "Consumer Cyclical",   marketCap: 793e9,   pe: 54.2,  pb: 10.1, ps: 7.4,  evEbitda: 42.1, dividendYield: 0.0,  roe: 18.3, roa: 9.6,  revenueGrowth: 1.1,   margin: 8.2  },
  { ticker: "JPM",   name: "JPMorgan Chase",        sector: "Financials",          marketCap: 605e9,   pe: 12.4,  pb: 1.8,  ps: 3.2,  evEbitda: 11.2, dividendYield: 2.44, roe: 17.4, roa: 1.6,  revenueGrowth: 8.4,   margin: 29.8 },
  { ticker: "JNJ",   name: "Johnson & Johnson",     sector: "Healthcare",          marketCap: 365e9,   pe: 15.2,  pb: 4.1,  ps: 4.8,  evEbitda: 12.4, dividendYield: 3.08, roe: 22.1, roa: 11.2, revenueGrowth: 5.1,   margin: 24.2 },
  { ticker: "XOM",   name: "Exxon Mobil",           sector: "Energy",              marketCap: 476e9,   pe: 14.1,  pb: 1.9,  ps: 1.2,  evEbitda: 8.4,  dividendYield: 3.44, roe: 14.8, roa: 7.4,  revenueGrowth: -4.2,  margin: 10.8 },
  { ticker: "V",     name: "Visa Inc",              sector: "Financials",          marketCap: 561e9,   pe: 32.1,  pb: 14.2, ps: 15.4, evEbitda: 24.8, dividendYield: 0.78, roe: 44.2, roa: 19.4, revenueGrowth: 9.4,   margin: 54.4 },
  { ticker: "UNH",   name: "UnitedHealth Group",    sector: "Healthcare",          marketCap: 414e9,   pe: 20.4,  pb: 4.8,  ps: 1.4,  evEbitda: 14.2, dividendYield: 1.48, roe: 24.1, roa: 8.2,  revenueGrowth: 8.4,   margin: 6.8  },
  { ticker: "LIN",   name: "Linde plc",             sector: "Materials",           marketCap: 212e9,   pe: 32.4,  pb: 4.2,  ps: 6.8,  evEbitda: 22.4, dividendYield: 1.24, roe: 14.8, roa: 7.4,  revenueGrowth: 4.2,   margin: 21.4 },
  { ticker: "PG",    name: "Procter & Gamble",      sector: "Consumer Defensive",  marketCap: 388e9,   pe: 26.4,  pb: 7.2,  ps: 4.8,  evEbitda: 18.2, dividendYield: 2.44, roe: 29.4, roa: 11.4, revenueGrowth: 2.1,   margin: 20.4 },
  { ticker: "GME",   name: "GameStop Corp",         sector: "Consumer Cyclical",   marketCap: 4.3e9,   pe: 0,     pb: 1.2,  ps: 2.4,  evEbitda: 0,    dividendYield: 0.0,  roe: -2.1, roa: -0.9, revenueGrowth: -8.4,  margin: -4.1 },
];

const X_OPTIONS = [
  { key: "pe", label: "P/E Ratio" },
  { key: "pb", label: "P/B Ratio" },
  { key: "ps", label: "P/S Ratio" },
  { key: "evEbitda", label: "EV/EBITDA" },
  { key: "dividendYield", label: "Dividend Yield %" },
];

const Y_OPTIONS = [
  { key: "roe", label: "ROE %" },
  { key: "roa", label: "ROA %" },
  { key: "revenueGrowth", label: "Revenue Growth %" },
  { key: "margin", label: "Net Margin %" },
];

const SECTOR_COLORS: Record<string, string> = {
  "Technology": "#3b82f6",
  "Communication": "#a855f7",
  "Consumer Cyclical": "#f59e0b",
  "Financials": "#22d3ee",
  "Healthcare": "#10b981",
  "Energy": "#ef4444",
  "Materials": "#84cc16",
  "Consumer Defensive": "#f97316",
};

function getVal(s: Stock, key: string): number {
  return (s as Record<string, number | string>)[key] as number;
}

export default function ScatterScreenerPanel() {
  const [xKey, setXKey] = useState("pe");
  const [yKey, setYKey] = useState("roe");
  const [hovered, setHovered] = useState<Stock | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 560, H = 360;
  const PAD = { top: 24, right: 24, bottom: 40, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const xLabel = X_OPTIONS.find(o => o.key === xKey)?.label || xKey;
  const yLabel = Y_OPTIONS.find(o => o.key === yKey)?.label || yKey;

  const validStocks = MOCK_STOCKS.filter(s => {
    const x = getVal(s, xKey), y = getVal(s, yKey);
    return x > 0 && isFinite(x) && isFinite(y);
  });

  const xs = validStocks.map(s => getVal(s, xKey));
  const ys = validStocks.map(s => getVal(s, yKey));
  const xMin = Math.min(...xs) * 0.9, xMax = Math.max(...xs) * 1.1;
  const yMin = Math.min(...ys) * (Math.min(...ys) < 0 ? 1.2 : 0.8);
  const yMax = Math.max(...ys) * 1.15;

  const toSvgX = (v: number) => PAD.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  const maxMcap = Math.max(...validStocks.map(s => s.marketCap));
  const bubbleR = (mcap: number) => 4 + (mcap / maxMcap) * 18;

  const xTicks = 5;
  const yTicks = 5;

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <div className="flex items-center gap-2">
          <span className="text-[#00c8ff] font-bold text-sm">SCATTER SCREENER</span>
          <DemoBadge />
        </div>
        <span className="text-[10px] text-slate-500">Bubble size = Market Cap</span>
      </div>

      {/* Axis selectors */}
      <div className="flex gap-4 px-4 py-2 border-b border-white/10 items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">X-AXIS:</span>
          <select
            value={xKey}
            onChange={e => setXKey(e.target.value)}
            className="bg-[#12151c] border border-white/20 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-[#00c8ff]"
          >
            {X_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Y-AXIS:</span>
          <select
            value={yKey}
            onChange={e => setYKey(e.target.value)}
            className="bg-[#12151c] border border-white/20 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-[#00c8ff]"
          >
            {Y_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex-1" />
        {/* Legend */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
            <span key={sector} className="flex items-center gap-1 text-[9px] text-slate-400">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              {sector.substring(0, 6)}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative overflow-hidden p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          onMouseMove={e => {
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect) return;
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {/* Grid lines */}
          {Array.from({ length: xTicks + 1 }).map((_, i) => {
            const v = xMin + (i / xTicks) * (xMax - xMin);
            const x = toSvgX(v);
            return (
              <g key={i}>
                <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + plotH} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                <text x={x} y={PAD.top + plotH + 14} textAnchor="middle" fill="#475569" fontSize={9}>{v.toFixed(1)}</text>
              </g>
            );
          })}
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const v = yMin + (i / yTicks) * (yMax - yMin);
            const y = toSvgY(v);
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={PAD.left + plotW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                <text x={PAD.left - 6} y={y + 3} textAnchor="end" fill="#475569" fontSize={9}>{v.toFixed(1)}</text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text x={PAD.left + plotW / 2} y={H - 4} textAnchor="middle" fill="#64748b" fontSize={10}>{xLabel}</text>
          <text x={12} y={PAD.top + plotH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90, 12, ${PAD.top + plotH / 2})`}>{yLabel}</text>

          {/* Zero line */}
          {yMin < 0 && yMax > 0 && (
            <line x1={PAD.left} y1={toSvgY(0)} x2={PAD.left + plotW} y2={toSvgY(0)} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4,3" />
          )}

          {/* Bubbles */}
          {validStocks.map(s => {
            const x = toSvgX(getVal(s, xKey));
            const y = toSvgY(getVal(s, yKey));
            const r = bubbleR(s.marketCap);
            const color = SECTOR_COLORS[s.sector] || "#94a3b8";
            const isHov = hovered?.ticker === s.ticker;
            return (
              <g key={s.ticker} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <circle
                  cx={x} cy={y} r={r}
                  fill={color}
                  fillOpacity={isHov ? 0.9 : 0.5}
                  stroke={color}
                  strokeWidth={isHov ? 2 : 1}
                  strokeOpacity={0.8}
                />
                {(r > 10 || isHov) && (
                  <text x={x} y={y + 3.5} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold" fontFamily="monospace">
                    {s.ticker}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none bg-[#1a1f2e] border border-[#00c8ff]/30 rounded-lg p-3 z-10 shadow-xl text-[11px] min-w-[160px]"
            style={{ left: Math.min(tooltipPos.x + 12, (svgRef.current?.clientWidth || 500) - 180), top: Math.max(tooltipPos.y - 60, 4) }}
          >
            <div className="font-bold text-[#00c8ff] text-sm">{hovered.ticker}</div>
            <div className="text-slate-400 mb-2">{hovered.name}</div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">{xLabel}:</span>
              <span className="font-bold text-white">{getVal(hovered, xKey).toFixed(1)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">{yLabel}:</span>
              <span className="font-bold text-white">{getVal(hovered, yKey).toFixed(1)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Mkt Cap:</span>
              <span className="font-bold text-[#f59e0b]">
                {hovered.marketCap >= 1e12 ? `$${(hovered.marketCap/1e12).toFixed(1)}T` : `$${(hovered.marketCap/1e9).toFixed(0)}B`}
              </span>
            </div>
            <div className="mt-1 text-[9px] font-bold" style={{ color: SECTOR_COLORS[hovered.sector] || "#94a3b8" }}>
              {hovered.sector}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
