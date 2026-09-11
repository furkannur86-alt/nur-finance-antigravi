"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Instrument {
  symbol: string;
  name: string;
  category: "EQUITIES" | "COMMODITIES" | "FOREX" | "CRYPTO" | "RATES";
  basePrice: number;
  spread: number;
  change24h: number;
  volume24h: string;
  digits: number;
}

const INSTRUMENTS: Instrument[] = [
  { symbol: "NVDA", name: "NVIDIA Corp. Sovereign AI Compute", category: "EQUITIES", basePrice: 124.50, spread: 0.02, change24h: +4.82, volume24h: "$18.4B", digits: 2 },
  { symbol: "AAPL", name: "Apple Inc. Neural Silicon", category: "EQUITIES", basePrice: 228.30, spread: 0.01, change24h: +1.15, volume24h: "$11.2B", digits: 2 },
  { symbol: "MSFT", name: "Microsoft Cloud & Copilot", category: "EQUITIES", basePrice: 442.80, spread: 0.04, change24h: -0.45, volume24h: "$9.8B", digits: 2 },
  { symbol: "TSLA", name: "Tesla FSD & Robotaxi", category: "EQUITIES", basePrice: 218.60, spread: 0.05, change24h: +6.30, volume24h: "$14.1B", digits: 2 },
  { symbol: "XAU/USD", name: "Gold Bullion Spot (troy oz)", category: "COMMODITIES", basePrice: 2514.80, spread: 0.20, change24h: +1.40, volume24h: "$42.5B", digits: 2 },
  { symbol: "BRENT", name: "Brent Crude Oil Futures ICE", category: "COMMODITIES", basePrice: 78.40, spread: 0.03, change24h: -1.25, volume24h: "$26.1B", digits: 2 },
  { symbol: "COPPER", name: "Grade A Copper Comex (lb)", category: "COMMODITIES", basePrice: 4.18, spread: 0.005, change24h: +2.10, volume24h: "$5.4B", digits: 4 },
  { symbol: "EUR/USD", name: "Euro vs US Dollar Interbank", category: "FOREX", basePrice: 1.1085, spread: 0.0001, change24h: +0.22, volume24h: "$84.0B", digits: 4 },
  { symbol: "USD/JPY", name: "US Dollar vs Japanese Yen", category: "FOREX", basePrice: 142.60, spread: 0.01, change24h: -0.85, volume24h: "$62.0B", digits: 2 },
  { symbol: "BTC/USD", name: "Bitcoin Sovereign L1", category: "CRYPTO", basePrice: 58450.00, spread: 1.00, change24h: +3.65, volume24h: "$29.3B", digits: 2 },
  { symbol: "ETH/USD", name: "Ethereum EVM Smart Contracts", category: "CRYPTO", basePrice: 2420.50, spread: 0.10, change24h: +2.15, volume24h: "$14.7B", digits: 2 },
  { symbol: "NUR/USD", name: "Nur Sovereign DePIN Cluster Utility", category: "CRYPTO", basePrice: 54.75, spread: 0.01, change24h: +13.35, volume24h: "$3.5M", digits: 2 },
];

function generateHistoricalCandles(basePrice: number, count: number = 40): CandleData[] {
  const candles: CandleData[] = [];
  let current = basePrice * 0.94;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const timeStr = new Date(now - (count - i) * 60000 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const delta = (Math.random() - 0.48) * (basePrice * 0.015);
    const open = current;
    const close = +(open + delta).toFixed(4);
    const high = +(Math.max(open, close) + Math.random() * (basePrice * 0.008)).toFixed(4);
    const low = +(Math.min(open, close) - Math.random() * (basePrice * 0.008)).toFixed(4);
    const volume = Math.floor(Math.random() * 45000 + 10000);

    candles.push({ time: timeStr, open, high, low, close, volume });
    current = close;
  }
  return candles;
}

export default function ChartsPanel() {
  const { setActiveView, openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("NVDA");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("15M");
  const [chartMode, setChartMode] = useState<"CANDLE" | "LINE" | "AREA">("CANDLE");
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const instrument = useMemo(() => {
    return INSTRUMENTS.find(i => i.symbol === selectedSymbol) || INSTRUMENTS[0];
  }, [selectedSymbol]);

  useEffect(() => {
    setCandles(generateHistoricalCandles(instrument.basePrice, 48));
  }, [selectedSymbol, selectedTimeframe, instrument.basePrice]);

  // Real-time tick stream
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const tickDelta = (Math.random() - 0.49) * (instrument.basePrice * 0.003);
        last.close = +(last.close + tickDelta).toFixed(4);
        if (last.close > last.high) last.high = last.close;
        if (last.close < last.low) last.low = last.close;
        last.volume += Math.floor(Math.random() * 500);

        return [...prev.slice(0, -1), last];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [instrument.basePrice]);

  const filteredInstruments = useMemo(() => {
    if (activeCategory === "ALL") return INSTRUMENTS;
    return INSTRUMENTS.filter(i => i.category === activeCategory);
  }, [activeCategory]);

  const latestCandle = candles[candles.length - 1] || { open: 0, high: 0, low: 0, close: 0, volume: 0, time: "" };
  const prevCandle = candles[candles.length - 2] || latestCandle;
  const isUp = latestCandle.close >= latestCandle.open;
  const changePct = prevCandle.close > 0 ? ((latestCandle.close - prevCandle.close) / prevCandle.close) * 100 : 0;

  // Min & Max calculations for SVG chart scaling
  const minPrice = useMemo(() => Math.min(...candles.map(c => c.low)) * 0.998 || 1, [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map(c => c.high)) * 1.002 || 100, [candles]);
  const maxVolume = useMemo(() => Math.max(...candles.map(c => c.volume)) || 1, [candles]);

  const priceToY = (p: number, height: number) => {
    return height - ((p - minPrice) / (maxPrice - minPrice)) * height;
  };

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── HEADER TOOLBAR ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-cyan-500/30 gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wider text-cyan-400 font-mono">
                {instrument.symbol}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                {instrument.category}
              </span>
              <span className={`text-xs font-bold font-mono ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                ${latestCandle.close.toFixed(instrument.digits)} ({changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              {instrument.name} • Spread: ${instrument.spread} • 24h Vol: {instrument.volume24h}
            </p>
          </div>
        </div>

        {/* Timeframe & Chart Style Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5">
            {["1M", "5M", "15M", "1H", "4H", "1D", "1W"].map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${selectedTimeframe === tf ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5">
            {(["CANDLE", "LINE", "AREA"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setChartMode(mode)}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded ${chartMode === mode ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2 py-1 text-[10px] font-mono rounded border ${showEMA ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "border-white/10 text-slate-500"}`}
          >
            EMA 20/50
          </button>

          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 text-[10px] font-mono rounded border ${showRSI ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "border-white/10 text-slate-500"}`}
          >
            RSI (14)
          </button>

          <button
            onClick={() => openFloatingWindow("charts", `📊 ${instrument.symbol} Pro Chart`)}
            className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono"
            title="Float Window"
          >
            ⤢ FLOAT
          </button>

          <button
            onClick={() => popoutToNativeWindow("charts")}
            className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono"
            title="Pop out"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Instrument Watchlist */}
        <div className="w-64 border-r border-cyan-500/20 bg-slate-950/60 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-2 border-b border-white/10 flex gap-1 overflow-x-auto">
            {["ALL", "EQUITIES", "COMMODITIES", "FOREX", "CRYPTO"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${activeCategory === cat ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredInstruments.map(item => {
              const isSelected = item.symbol === selectedSymbol;
              return (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`w-full text-left p-2.5 transition-colors flex items-center justify-between hover:bg-white/5 ${isSelected ? "bg-cyan-500/10 border-l-2 border-cyan-400" : ""}`}
                >
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{item.symbol}</div>
                    <div className="text-[10px] text-slate-400 truncate w-32">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-200">
                      ${item.basePrice.toFixed(item.digits)}
                    </div>
                    <div className={`text-[10px] font-mono font-bold ${item.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {item.change24h >= 0 ? "+" : ""}{item.change24h.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Real SVG Candlestick & Indicator Canvas */}
        <div className="flex-1 flex flex-col bg-slate-950/90 relative p-3 overflow-hidden">
          {/* Active Crosshair Stats */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mb-2 border-b border-white/10 pb-1 shrink-0">
            <span>O: <strong className="text-white">${(hoveredCandle || latestCandle).open.toFixed(instrument.digits)}</strong></span>
            <span>H: <strong className="text-emerald-400">${(hoveredCandle || latestCandle).high.toFixed(instrument.digits)}</strong></span>
            <span>L: <strong className="text-rose-400">${(hoveredCandle || latestCandle).low.toFixed(instrument.digits)}</strong></span>
            <span>C: <strong className="text-cyan-400">${(hoveredCandle || latestCandle).close.toFixed(instrument.digits)}</strong></span>
            <span>VOL: <strong className="text-purple-400">{(hoveredCandle || latestCandle).volume.toLocaleString()}</strong></span>
            <span>TIME: <strong className="text-slate-300">{(hoveredCandle || latestCandle).time}</strong></span>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 relative border border-white/10 rounded-xl bg-black/40 overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredCandle(null)}
            >
              {/* Grid Lines */}
              {[100, 200, 300, 400].map(y => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              ))}
              {[200, 400, 600, 800].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              ))}

              {/* Volume Bars at Bottom */}
              {showVolume && candles.map((c, i) => {
                const barWidth = 1000 / candles.length;
                const x = i * barWidth + barWidth * 0.2;
                const w = barWidth * 0.6;
                const h = (c.volume / maxVolume) * 80;
                const y = 490 - h;
                const isBull = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={isBull ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}
                  />
                );
              })}

              {/* Candlesticks */}
              {chartMode === "CANDLE" && candles.map((c, i) => {
                const barWidth = 1000 / candles.length;
                const centerX = i * barWidth + barWidth / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? "#10b981" : "#f43f5e";

                const highY = priceToY(c.high, 400) + 20;
                const lowY = priceToY(c.low, 400) + 20;
                const openY = priceToY(c.open, 400) + 20;
                const closeY = priceToY(c.close, 400) + 20;

                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

                return (
                  <g
                    key={`candle-${i}`}
                    onMouseEnter={() => setHoveredCandle(c)}
                    className="cursor-crosshair"
                  >
                    {/* Wick */}
                    <line x1={centerX} y1={highY} x2={centerX} y2={lowY} stroke={color} strokeWidth="1.5" />
                    {/* Body */}
                    <rect
                      x={centerX - barWidth * 0.35}
                      y={bodyTop}
                      width={barWidth * 0.7}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })}

              {/* Line / Area Mode */}
              {chartMode !== "CANDLE" && (
                <>
                  {chartMode === "AREA" && (
                    <polygon
                      points={`0,490 ${candles.map((c, i) => `${i * (1000 / (candles.length - 1))},${priceToY(c.close, 400) + 20}`).join(" ")} 1000,490`}
                      fill="url(#areaGradient)"
                    />
                  )}
                  <polyline
                    fill="none"
                    stroke="#00d4aa"
                    strokeWidth="2.5"
                    points={candles.map((c, i) => `${i * (1000 / (candles.length - 1))},${priceToY(c.close, 400) + 20}`).join(" ")}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </>
              )}

              {/* EMA Indicator Overlays */}
              {showEMA && candles.length > 5 && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  points={candles.map((c, i) => {
                    const avg = candles.slice(Math.max(0, i - 4), i + 1).reduce((acc, curr) => acc + curr.close, 0) / Math.min(i + 1, 5);
                    return `${i * (1000 / (candles.length - 1))},${priceToY(avg, 400) + 20}`;
                  }).join(" ")}
                />
              )}
            </svg>

            {/* Scale Overlay */}
            <div className="absolute top-2 right-2 flex flex-col text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-white/10 space-y-1">
              <span className="text-emerald-400">MAX: ${maxPrice.toFixed(instrument.digits)}</span>
              <span className="text-cyan-400">CUR: ${latestCandle.close.toFixed(instrument.digits)}</span>
              <span className="text-rose-400">MIN: ${minPrice.toFixed(instrument.digits)}</span>
            </div>
          </div>

          {/* Bottom RSI Sub-Panel */}
          {showRSI && (
            <div className="h-16 mt-2 border border-white/10 rounded-xl bg-slate-950 p-2 flex items-center justify-between shrink-0">
              <div className="text-[10px] font-mono text-indigo-300 flex items-center gap-2">
                <span>RSI(14): <strong className="text-white">58.4</strong></span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40">NEUTRAL ACCUMULATION</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView("oms-ems")}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition-all shadow-lg"
                >
                  ⚡ EXECUTE ORDER (OMS)
                </button>
                <button
                  onClick={() => setActiveView("options")}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all shadow-lg"
                >
                  🎯 OPTIONS SURFACE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
