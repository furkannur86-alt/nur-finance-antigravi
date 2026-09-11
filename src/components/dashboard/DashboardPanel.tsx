"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePortfolioData } from "@/hooks/useMarketData";
import PortfolioChart from "./PortfolioChart";
import PriceChart from "./PriceChart";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import { ChartDataPoint, MarketQuote } from "@/types";

// ─── Sector heat map data (refreshed from market-data API) ───────────────────
const SECTORS = [
  { label: "Technology",    etf: "XLK",  base: 2.4  },
  { label: "Financials",    etf: "XLF",  base: 0.85 },
  { label: "Healthcare",    etf: "XLV",  base:-0.3  },
  { label: "Energy",        etf: "XLE",  base: 1.2  },
  { label: "Industrials",   etf: "XLI",  base: 0.6  },
  { label: "Consumer Disc", etf: "XLY",  base:-0.9  },
  { label: "Materials",     etf: "XLB",  base: 1.7  },
  { label: "Utilities",     etf: "XLU",  base:-0.4  },
  { label: "Comm. Svcs",   etf: "XLC",  base: 1.5  },
  { label: "Real Estate",   etf: "XLRE", base:-1.1  },
  { label: "Cons. Staples", etf: "XLP",  base: 0.2  },
  { label: "Crypto",        etf: "BTCUSDT", base: 2.84 },
];

function heatColor(pct: number): string {
  if (pct > 2)   return "rgba(0,212,170,0.28)";
  if (pct > 0.5) return "rgba(0,212,170,0.14)";
  if (pct > 0)   return "rgba(0,212,170,0.06)";
  if (pct > -0.5)return "rgba(239,68,68,0.06)";
  if (pct > -2)  return "rgba(239,68,68,0.14)";
  return "rgba(239,68,68,0.28)";
}
function heatText(pct: number): string {
  if (pct > 0) return "var(--ag-success)";
  if (pct < 0) return "var(--ag-danger)";
  return "var(--ag-muted)";
}

// ─── Inline sparkline via canvas ─────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || data.length < 2) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.offsetWidth; const h = c.offsetHeight;
    c.width = w; c.height = h;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - ((v - min) / range) * h * 0.8 - h * 0.1 }));
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    // endpoint dot
    const last = pts[pts.length - 1];
    ctx.beginPath(); ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  }, [data, color]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Metric tile with mini sparkline ─────────────────────────────────────────
function MetricTile({ label, value, sub, color, spark }: {
  label: string; value: string; sub?: string; color: string; spark?: number[];
}) {
  return (
    <div
      className="rounded-lg border p-2.5 flex flex-col gap-0.5 overflow-hidden relative"
      style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
    >
      {spark && spark.length > 1 && (
        <div className="absolute inset-0 opacity-25">
          <Sparkline data={spark} color={color} />
        </div>
      )}
      <div className="relative text-[9px] uppercase tracking-widest" style={{ color: "var(--ag-muted)" }}>{label}</div>
      <div className="relative text-sm font-bold font-mono" style={{ color }}>{value}</div>
      {sub && <div className="relative text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>{sub}</div>}
    </div>
  );
}

// ─── Sector heat map grid ─────────────────────────────────────────────────────
function SectorHeatMap({ values }: { values: Record<string, number> }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {SECTORS.map((s) => {
        const pct = values[s.etf] ?? s.base;
        return (
          <div
            key={s.etf}
            className="rounded p-1.5 text-center"
            style={{ background: heatColor(pct), border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>{s.label}</div>
            <div className="text-[11px] font-bold font-mono" style={{ color: heatText(pct) }}>
              {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
            </div>
            <div className="text-[7px]" style={{ color: "var(--ag-muted)" }}>{s.etf}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main dashboard ──────────────────────────────────────────────────────────
const CHART_SYMBOLS = [
  { symbol: "SPY",     label: "S&P 500",  color: "#00d4aa" },
  { symbol: "NVDA",    label: "NVIDIA",   color: "#6366f1" },
  { symbol: "AAPL",   label: "Apple",    color: "#3b82f6" },
  { symbol: "BTC-USD", label: "Bitcoin",  color: "#f59e0b" },
  { symbol: "GLD",     label: "Gold",     color: "#fbbf24" },
];

export default function DashboardPanel() {
  const { portfolio, source } = usePortfolioData();

  const totalValue  = portfolio.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalCost   = portfolio.reduce((s, p) => s + p.avgPrice * p.quantity, 0);
  const totalPnL    = totalValue - totalCost;
  const totalReturn = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // Chart state
  const [chartIdx, setChartIdx] = useState(0);
  const [chartRange, setChartRange] = useState("3mo");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartSrc, setChartSrc] = useState("loading");

  // Watchlist
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [wlSource, setWlSource] = useState("loading");
  const [lastUpdate, setLastUpdate] = useState("");

  // Sector values
  const [sectorValues, setSectorValues] = useState<Record<string, number>>({});

  // Quant stats
  const [stats, setStats] = useState<{ sharpeRatio: number; maxDrawdown: number; volatility: number } | null>(null);

  const didInit = useRef(false);
  const fetchChart = useCallback(() => {
    const sym = CHART_SYMBOLS[chartIdx].symbol;
    setChartSrc("loading");
    fetch(`/api/market-data?type=history&symbol=${sym}&range=${chartRange}`)
      .then(r => r.json())
      .then(j => { setChartData(j.chart || []); setChartSrc(j.source || "mock"); })
      .catch(() => setChartSrc("error"));
  }, [chartIdx, chartRange]);

  useEffect(() => { fetchChart(); }, [fetchChart]);

  useEffect(() => {
    let cancelled = false;
    function fetchWL() {
      fetch("/api/market-data?type=quotes")
        .then(r => r.json())
        .then(d => {
          if (cancelled) return;
          setQuotes(d.data || []);
          setWlSource(d.source || "mock");
          setLastUpdate(new Date().toLocaleTimeString("en-US", { hour12: false }));
          // extract sector-like values
          const sv: Record<string, number> = {};
          (d.data || []).forEach((q: MarketQuote) => { sv[q.symbol] = q.changePercent; });
          setSectorValues(sv);
        })
        .catch(() => { if (!cancelled) setWlSource("error"); });
    }
    fetchWL();
    const id = setInterval(fetchWL, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetch("/api/indicators?symbol=SPY&indicator=stats&range=1y")
      .then(r => r.json())
      .then(d => { if (d.stats) setStats(d.stats); })
      .catch(() => {});
  }, []);

  const sym = CHART_SYMBOLS[chartIdx];
  const topChartItem = portfolio.length > 0
    ? portfolio.reduce((b, p) => p.changePercent > b.changePercent ? p : b)
    : null;
  const worstChartItem = portfolio.length > 0
    ? portfolio.reduce((w, p) => p.changePercent < w.changePercent ? p : w)
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--ag-accent)" }}>
            COMMAND DASHBOARD
          </span>
          <DataSourceBadge source={source} />
        </div>
        <span className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>
          {lastUpdate ? `↻ ${lastUpdate}` : ""}
        </span>
      </div>

      {/* Metric tiles — row 1 */}
      <div className="grid grid-cols-6 gap-2">
        <MetricTile label="Portfolio Value" value={`$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} color="var(--ag-accent)" />
        <MetricTile label="Total P&L" value={`${totalPnL >= 0 ? "+" : ""}$${Math.abs(totalPnL).toFixed(0)}`} color={totalPnL >= 0 ? "var(--ag-success)" : "var(--ag-danger)"} />
        <MetricTile label="Return" value={`${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`} color={totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)"} />
        <MetricTile label="Sharpe (SPY)" value={stats ? stats.sharpeRatio.toFixed(2) : "—"} color="var(--ag-accent2)" />
        <MetricTile label="Max Drawdown" value={stats ? `-${stats.maxDrawdown.toFixed(1)}%` : "—"} color="var(--ag-warning)" />
        <MetricTile label="Volatility" value={stats ? `${stats.volatility.toFixed(1)}%` : "—"} color="var(--ag-accent)" />
      </div>

      {/* Row 2: chart + sector heatmap */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 280px" }}>

        {/* Live chart */}
        <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          {/* symbol switcher */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {CHART_SYMBOLS.map((s, i) => (
                <button
                  key={s.symbol}
                  onClick={() => setChartIdx(i)}
                  className="text-[9px] px-2 py-0.5 rounded font-mono font-bold transition-all"
                  style={{
                    background: chartIdx === i ? s.color + "22" : "transparent",
                    color: chartIdx === i ? s.color : "var(--ag-muted)",
                    border: chartIdx === i ? `1px solid ${s.color}55` : "1px solid transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                background: chartSrc === "live" ? "rgba(0,212,170,0.12)" : "rgba(251,191,36,0.12)",
                color: chartSrc === "live" ? "var(--ag-accent)" : "var(--ag-warning)",
              }}>{chartSrc === "loading" ? "…" : chartSrc.toUpperCase()}</span>
              <div className="flex gap-0.5">
                {["1mo","3mo","6mo","1y"].map(r => (
                  <button key={r} onClick={() => setChartRange(r)}
                    className="text-[8px] px-1 py-0.5 rounded font-mono transition-colors"
                    style={{ color: chartRange === r ? sym.color : "var(--ag-muted)", background: chartRange === r ? sym.color + "18" : "transparent" }}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {chartData.length > 0
            ? <PriceChart data={chartData} />
            : <div className="flex items-center justify-center" style={{ height: 180, color: "var(--ag-muted)" }}>
                <span className="text-xs animate-pulse">Loading {sym.label}…</span>
              </div>
          }
        </div>

        {/* Sector heat map */}
        <div className="rounded-lg border p-3 flex flex-col gap-2" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "var(--ag-muted)" }}>Sector Heat Map</span>
            <span className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>1D %</span>
          </div>
          <SectorHeatMap values={sectorValues} />
        </div>
      </div>

      {/* Row 3: portfolio donut + watchlist */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "200px 1fr" }}>

        {/* Allocation donut */}
        <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--ag-muted)" }}>
            PORTFOLIO ALLOCATION
          </div>
          {portfolio.length > 0
            ? <PortfolioChart portfolio={portfolio} />
            : <div className="text-xs text-center py-8" style={{ color: "var(--ag-muted)" }}>No positions</div>
          }
          {topChartItem && (
            <div className="mt-2 grid grid-cols-2 gap-1 text-[9px]">
              <div className="rounded p-1" style={{ background: "rgba(0,212,170,0.08)" }}>
                <div style={{ color: "var(--ag-muted)" }}>Best</div>
                <div className="font-bold" style={{ color: "var(--ag-success)" }}>{topChartItem.symbol} +{topChartItem.changePercent.toFixed(2)}%</div>
              </div>
              {worstChartItem && (
                <div className="rounded p-1" style={{ background: "rgba(239,68,68,0.08)" }}>
                  <div style={{ color: "var(--ag-muted)" }}>Worst</div>
                  <div className="font-bold" style={{ color: "var(--ag-danger)" }}>{worstChartItem.symbol} {worstChartItem.changePercent.toFixed(2)}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced watchlist */}
        <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--ag-muted)" }}>WATCHLIST</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{
                background: wlSource === "live" ? "rgba(0,212,170,0.12)" : "rgba(251,191,36,0.12)",
                color: wlSource === "live" ? "var(--ag-accent)" : "var(--ag-warning)",
              }}>
                {wlSource === "loading" ? "…" : wlSource === "live" ? "LIVE" : "MOCK"}
              </span>
            </div>
            {lastUpdate && <span className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>{lastUpdate}</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {["Symbol","Name","Price","Chg","% 24h","Volume"].map(h => (
                    <th key={h} className={`py-1 font-medium text-[9px] uppercase tracking-wide ${h==="Symbol"||h==="Name" ? "text-left" : "text-right"}`}
                      style={{ color: "var(--ag-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => {
                  const mag = Math.abs(q.changePercent);
                  const rowBg = q.changePercent > 0
                    ? `rgba(0,212,170,${Math.min(mag * 0.015, 0.06)})`
                    : q.changePercent < 0
                    ? `rgba(239,68,68,${Math.min(mag * 0.015, 0.06)})`
                    : "transparent";
                  return (
                    <tr key={q.symbol} className="border-t transition-colors"
                      style={{ borderColor: "var(--ag-border)", background: i % 2 === 0 ? rowBg : "transparent" }}>
                      <td className="py-1.5 font-bold font-mono text-[10px]" style={{ color: "var(--ag-accent)" }}>{q.symbol}</td>
                      <td className="py-1.5 font-mono" style={{ color: "var(--ag-text)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {q.name.length > 18 ? q.name.slice(0, 18) + "…" : q.name}
                      </td>
                      <td className="text-right py-1.5 font-mono" style={{ color: "var(--ag-text)" }}>
                        ${q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-right py-1.5 font-mono text-[10px]" style={{ color: q.change >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                        {q.change >= 0 ? "+" : ""}{q.change.toFixed(2)}
                      </td>
                      <td className="text-right py-1.5 font-mono font-bold text-[10px]" style={{ color: q.changePercent >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                        {q.changePercent >= 0 ? "+" : ""}{q.changePercent.toFixed(2)}%
                      </td>
                      <td className="text-right py-1.5 font-mono text-[9px]" style={{ color: "var(--ag-muted)" }}>
                        {q.volume > 1e9 ? (q.volume / 1e9).toFixed(1) + "B"
                          : q.volume > 1e6 ? (q.volume / 1e6).toFixed(1) + "M"
                          : q.volume > 1e3 ? (q.volume / 1e3).toFixed(0) + "K"
                          : q.volume.toString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
