"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Lightweight candlestick chart rendered on Canvas — no CDN needed
// Uses EODHD-style OHLCV data + simulated real-time ticks

interface OHLCV {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SymbolConfig {
  symbol: string;
  label: string;
  color: string;
  basePrice: number;
  volatility: number;
  sector: string;
}

const SYMBOLS: SymbolConfig[] = [
  { symbol: "AAPL",    label: "Apple Inc.",         color: "#00d4aa", basePrice: 189.5,  volatility: 0.012, sector: "Tech" },
  { symbol: "MSFT",    label: "Microsoft",          color: "#6366f1", basePrice: 415.2,  volatility: 0.011, sector: "Tech" },
  { symbol: "NVDA",    label: "NVIDIA",             color: "#22d3ee", basePrice: 875.4,  volatility: 0.025, sector: "Semiconductors" },
  { symbol: "TSLA",    label: "Tesla",              color: "#ef4444", basePrice: 248.3,  volatility: 0.030, sector: "EV/Auto" },
  { symbol: "BTC-USD", label: "Bitcoin",            color: "#f97316", basePrice: 67800,  volatility: 0.022, sector: "Crypto" },
  { symbol: "ETH-USD", label: "Ethereum",           color: "#a78bfa", basePrice: 3480,   volatility: 0.024, sector: "Crypto" },
  { symbol: "GLD",     label: "Gold (SPDR)",        color: "#fbbf24", basePrice: 234.1,  volatility: 0.008, sector: "Commodities" },
  { symbol: "XOM",     label: "ExxonMobil",         color: "#34d399", basePrice: 115.6,  volatility: 0.014, sector: "Energy" },
];

function generateHistory(basePrice: number, volatility: number, bars: number): OHLCV[] {
  const data: OHLCV[] = [];
  let price = basePrice * (0.85 + Math.random() * 0.1);
  const now = Math.floor(Date.now() / 1000);
  const interval = 3600; // 1h candles
  for (let i = bars; i >= 0; i--) {
    const open = price;
    const move = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price * 0.5, price + move);
    const high = Math.max(open, price) * (1 + Math.random() * volatility * 0.5);
    const low  = Math.min(open, price) * (1 - Math.random() * volatility * 0.5);
    data.push({
      time: now - i * interval,
      open, high, low, close: price,
      volume: Math.floor(Math.random() * 2000000 + 500000),
    });
  }
  return data;
}

function drawChart(
  canvas: HTMLCanvasElement,
  data: OHLCV[],
  color: string,
  label: string,
  currentPrice: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const padL = 8, padR = 60, padT = 24, padB = 32;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const priceMax = Math.max(...data.map(d => d.high)) * 1.002;
  const priceMin = Math.min(...data.map(d => d.low)) * 0.998;
  const priceRange = priceMax - priceMin;

  const toX = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const toY = (p: number) => padT + (1 - (p - priceMin) / priceRange) * chartH;

  // Background
  ctx.fillStyle = "rgba(5, 10, 18, 0.95)";
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  const gridCount = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = padT + (i / gridCount) * chartH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
    const price = priceMax - (i / gridCount) * priceRange;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    const fmt = price >= 1000 ? price.toFixed(0) : price >= 100 ? price.toFixed(1) : price.toFixed(2);
    ctx.fillText(fmt, padL + chartW + 4, y + 3);
  }

  // Area fill
  ctx.beginPath();
  ctx.moveTo(toX(0), padT + chartH);
  data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.close)));
  ctx.lineTo(toX(data.length - 1), padT + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, color + "30");
  grad.addColorStop(1, color + "04");
  ctx.fillStyle = grad;
  ctx.fill();

  // Candlesticks
  const barW = Math.max(1, chartW / data.length * 0.65);
  data.forEach((d, i) => {
    const x = toX(i);
    const isGreen = d.close >= d.open;
    const candleColor = isGreen ? "#22c55e" : "#ef4444";
    // Wick
    ctx.strokeStyle = candleColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, toY(d.high));
    ctx.lineTo(x, toY(d.low));
    ctx.stroke();
    // Body
    const bodyTop = toY(Math.max(d.open, d.close));
    const bodyBot = toY(Math.min(d.open, d.close));
    const bodyH = Math.max(1, bodyBot - bodyTop);
    ctx.fillStyle = candleColor;
    ctx.fillRect(x - barW / 2, bodyTop, barW, bodyH);
  });

  // Price line (current)
  const lastY = toY(currentPrice);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(padL, lastY);
  ctx.lineTo(padL + chartW, lastY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Current price label
  ctx.fillStyle = color;
  ctx.fillRect(padL + chartW, lastY - 9, padR - 2, 18);
  ctx.fillStyle = "#000";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  const priceStr = currentPrice >= 1000 ? currentPrice.toFixed(0) : currentPrice.toFixed(2);
  ctx.fillText(priceStr, padL + chartW + (padR - 2) / 2, lastY + 3);

  // Symbol label
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 11px monospace";
  ctx.fillText(label, padL + 4, padT - 8);
}

interface ChartState {
  data: OHLCV[];
  currentPrice: number;
  pct24h: number;
}

function MiniChart({ sym }: { sym: SymbolConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<ChartState>(() => {
    const data = generateHistory(sym.basePrice, sym.volatility, 72);
    const first = data[0].close;
    const last  = data[data.length - 1].close;
    return { data, currentPrice: last, pct24h: ((last - first) / first) * 100 };
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const redraw = useCallback(() => {
    if (canvasRef.current) {
      drawChart(canvasRef.current, state.data, sym.color, sym.symbol, state.currentPrice);
    }
  }, [state, sym]);

  useEffect(() => {
    redraw();
    const ro = new ResizeObserver(redraw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [redraw]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const last = prev.data[prev.data.length - 1];
        const move = (Math.random() - 0.49) * sym.volatility * last.close;
        const newPrice = Math.max(last.close * 0.5, last.close + move);
        const newHigh = Math.max(last.high, newPrice);
        const newLow  = Math.min(last.low, newPrice);
        const updated = [...prev.data.slice(0, -1), { ...last, close: newPrice, high: newHigh, low: newLow }];
        const pct = ((newPrice - updated[0].close) / updated[0].close) * 100;
        return { data: updated, currentPrice: newPrice, pct24h: pct };
      });
    }, 2500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sym]);

  const positive = state.pct24h >= 0;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ background: "rgba(5,10,18,0.9)", border: `1px solid ${sym.color}25` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: sym.color }} />
          <span className="text-[11px] font-bold font-mono text-white">{sym.symbol}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>{sym.sector}</span>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold font-mono" style={{ color: sym.color }}>
            ${state.currentPrice >= 1000
              ? state.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : state.currentPrice.toFixed(2)}
          </div>
          <div className="text-[9px] font-mono" style={{ color: positive ? "#22c55e" : "#ef4444" }}>
            {positive ? "▲" : "▼"} {Math.abs(state.pct24h).toFixed(2)}%
          </div>
        </div>
      </div>
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full" style={{ height: 140 }} />
      {/* Footer stats */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
          O: ${state.data[state.data.length-1].open.toFixed(2)} · H: ${state.data[state.data.length-1].high.toFixed(2)} · L: ${state.data[state.data.length-1].low.toFixed(2)}
        </span>
        <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>72h · 1H</span>
      </div>
    </div>
  );
}

type Timeframe = "1D" | "1W" | "1M" | "3M";
const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M", "3M"];

export default function ChartsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const fullRef = useRef<HTMLCanvasElement>(null);
  const [fullState, setFullState] = useState<ChartState | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedSym = SYMBOLS.find(s => s.symbol === selected);

  useEffect(() => {
    if (!selectedSym) { setFullState(null); return; }
    const bars = timeframe === "1D" ? 24 : timeframe === "1W" ? 168 : timeframe === "1M" ? 720 : 2160;
    const data = generateHistory(selectedSym.basePrice, selectedSym.volatility, bars);
    const last = data[data.length - 1];
    setFullState({ data, currentPrice: last.close, pct24h: ((last.close - data[0].close) / data[0].close) * 100 });
  }, [selected, timeframe, selectedSym]);

  useEffect(() => {
    if (!fullState || !selectedSym) return;
    const draw = () => {
      if (fullRef.current && fullState) {
        drawChart(fullRef.current, fullState.data, selectedSym.color, `${selectedSym.symbol} — ${selectedSym.label}`, fullState.currentPrice);
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    if (fullRef.current) ro.observe(fullRef.current);
    return () => ro.disconnect();
  }, [fullState, selectedSym]);

  useEffect(() => {
    if (!selectedSym || !fullState) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setFullState(prev => {
        if (!prev || !selectedSym) return prev;
        const last = prev.data[prev.data.length - 1];
        const move = (Math.random() - 0.49) * selectedSym.volatility * last.close;
        const newPrice = Math.max(last.close * 0.5, last.close + move);
        const updated = [...prev.data.slice(0, -1), { ...last, close: newPrice, high: Math.max(last.high, newPrice), low: Math.min(last.low, newPrice) }];
        return { data: updated, currentPrice: newPrice, pct24h: ((newPrice - updated[0].close) / updated[0].close) * 100 };
      });
    }, 2000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, timeframe]);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg, #030810)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ background: "rgba(11,15,23,0.98)", borderColor: "var(--ag-border, rgba(255,255,255,0.08))" }}>
        <div>
          <span className="text-xs font-bold font-serif tracking-wide text-cyan-300">NUR CHARTS — LIVE MARKET CANDLESTICKS</span>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Real-time ticks · 72h history · 8 instruments · Click to expand</p>
        </div>
        {selected && (
          <div className="flex items-center gap-1.5">
            {TIMEFRAMES.map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className="px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border"
                style={{ background: timeframe === tf ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.04)", borderColor: timeframe === tf ? "#00d4aa" : "rgba(255,255,255,0.1)", color: timeframe === tf ? "#00d4aa" : "rgba(255,255,255,0.4)" }}
              >{tf}</button>
            ))}
            <button onClick={() => setSelected(null)} className="px-2.5 py-1 rounded text-[10px] border ml-2" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>✕ Grid</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selected && selectedSym && fullState ? (
          /* Full-panel chart */
          <div className="rounded-xl overflow-hidden h-full" style={{ minHeight: 420, border: `1px solid ${selectedSym.color}30` }}>
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: selectedSym.color }} />
                <span className="text-sm font-bold font-mono text-white">{selectedSym.symbol}</span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{selectedSym.label} · {selectedSym.sector}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-white font-bold">
                  ${fullState.currentPrice >= 1000
                    ? fullState.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : fullState.currentPrice.toFixed(2)}
                </span>
                <span style={{ color: fullState.pct24h >= 0 ? "#22c55e" : "#ef4444" }}>
                  {fullState.pct24h >= 0 ? "▲" : "▼"} {Math.abs(fullState.pct24h).toFixed(2)}%
                </span>
              </div>
            </div>
            <canvas ref={fullRef} className="w-full" style={{ height: "calc(100% - 48px)", display: "block" }} />
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SYMBOLS.map(sym => (
              <div key={sym.symbol} onClick={() => setSelected(sym.symbol)} className="cursor-pointer hover:scale-[1.02] transition-transform">
                <MiniChart sym={sym} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
