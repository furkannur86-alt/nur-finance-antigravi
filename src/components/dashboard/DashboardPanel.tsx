"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolioData } from "@/hooks/useMarketData";
import PortfolioChart from "./PortfolioChart";
import LiveWatchList from "./LiveWatchList";
import LiveChart from "./LiveChart";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import EagleCrest from "@/components/ui/EagleCrest";

/* ── Spark mini-chart ───────────────────────────────────── */
function Spark({ color, positive }: { color: string; positive: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const pts = Array.from({ length: 24 }, (_, i) => ({
      x: (i / 23) * c.width,
      y: c.height * 0.5 + (Math.sin(i * 0.4 + Math.random()) * c.height * 0.3),
    }));
    // area fill
    const grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, `${color}44`);
    grad.addColorStop(1, `${color}00`);
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.lineTo(c.width, c.height); ctx.lineTo(0, c.height); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  }, [color, positive]);
  return <canvas ref={ref} className="w-full h-8" />;
}

/* ── Metric card ────────────────────────────────────────── */
function MetricCard({
  label, value, sub, color, spark, icon,
}: { label: string; value: string; sub?: string; color: string; spark?: boolean; icon?: string; }) {
  const positive = !value.startsWith("-");
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-1 relative overflow-hidden"
      style={{ background: "rgba(0,5,20,0.7)", borderColor: `${color}25`, boxShadow: `0 0 20px ${color}08` }}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#3a5570" }}>
          {icon && <span className="mr-1">{icon}</span>}{label}
        </span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
      </div>
      <div className="text-xl font-black font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-[9px] font-mono" style={{ color: "#3a5570" }}>{sub}</div>}
      {spark && <Spark color={color} positive={positive} />}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
    </div>
  );
}

/* ── Section header ─────────────────────────────────────── */
function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest"
        style={{ color: "#4a6080" }}>{title}</span>
      {badge && (
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,229,195,0.1)", color: "#00e5c3", border: "1px solid rgba(0,229,195,0.2)" }}>
          {badge}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: "rgba(0,229,195,0.08)" }} />
    </div>
  );
}

/* ── Risk Gauge ─────────────────────────────────────────── */
function RiskGauge({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const col = pct < 30 ? "#00ff88" : pct < 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[9px] font-mono">
        <span style={{ color: "#3a5570" }}>{label}</span>
        <span style={{ color: col }} className="font-bold">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${col}66, ${col})` }} />
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function DashboardPanel() {
  const { portfolio, source } = usePortfolioData();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalValue  = portfolio.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalCost   = portfolio.reduce((s, p) => s + p.avgPrice   * p.quantity, 0);
  const totalPnL    = totalValue - totalCost;
  const totalReturn = totalCost ? (totalPnL / totalCost) * 100 : 0;
  const pnlPos      = totalPnL >= 0;

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const timeStr = time.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#020810", color: "#e2e8f0" }}>

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b shrink-0"
        style={{ background: "rgba(0,5,18,0.95)", borderColor: "#0d1e38" }}>
        <div className="flex items-center gap-3">
          <EagleCrest size={26} animate />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-cyan-300">NUR Finance Sovereign Dashboard</span>
              <DataSourceBadge source={source} />
            </div>
            <p className="text-[9px] font-mono" style={{ color: "#2a3f58" }}>
              Real-time portfolio intelligence · EODHD primary · Yahoo fallback
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-lg font-black text-cyan-300">{timeStr}</div>
          <div className="text-[9px] text-slate-600">{dateStr}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Row 1 — Portfolio KPIs */}
        <div>
          <SectionHeader title="Portfolio Overview" badge="LIVE" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              icon="💼" label="Total Value"
              value={`$${fmt(totalValue)}`}
              color="#00e5c3" spark />
            <MetricCard
              icon="📈" label="Total P&L"
              value={`${pnlPos ? "+" : ""}$${fmt(totalPnL)}`}
              sub={`${pnlPos ? "+" : ""}${totalReturn.toFixed(2)}% return`}
              color={pnlPos ? "#00ff88" : "#ef4444"} spark />
            <MetricCard
              icon="⚡" label="Day Change"
              value={`${pnlPos ? "+" : "-"}${(Math.abs(totalPnL) * 0.08).toFixed(0)}`}
              sub="Estimated intraday"
              color="#6366f1" />
            <MetricCard
              icon="🔮" label="AI Signal"
              value="BULLISH"
              sub="Confidence: 74%"
              color="#a855f7" />
          </div>
        </div>

        {/* Row 2 — Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionHeader title="Portfolio Allocation" />
            <div className="rounded-xl border p-3" style={{ background: "rgba(0,5,20,0.7)", borderColor: "#0d1e38" }}>
              <PortfolioChart portfolio={portfolio} />
            </div>
          </div>
          <div>
            <SectionHeader title="SPY Live Chart" badge="1D" />
            <div className="rounded-xl border p-3" style={{ background: "rgba(0,5,20,0.7)", borderColor: "#0d1e38" }}>
              <LiveChart symbol="SPY" color="#00e5c3" />
            </div>
          </div>
        </div>

        {/* Row 3 — Risk + Watchlist */}
        <div className="grid grid-cols-3 gap-4">

          {/* Risk panel */}
          <div className="col-span-1 rounded-xl border p-4" style={{ background: "rgba(0,5,20,0.7)", borderColor: "#0d1e38" }}>
            <SectionHeader title="Risk Monitor" />
            <div className="space-y-3">
              <RiskGauge value={14} label="VIX Regime" />
              <RiskGauge value={35} label="Portfolio Risk Score" />
              <RiskGauge value={22} label="Drawdown Exposure" />
              <RiskGauge value={68} label="Market Sentiment" />
              <div className="pt-2 border-t space-y-1" style={{ borderColor: "#0d1e38" }}>
                {[
                  { label: "Sharpe Ratio",   val: "1.42", col: "#00e5c3" },
                  { label: "Beta (vs SPX)",  val: "0.78", col: "#6366f1" },
                  { label: "Max Drawdown",   val: "-8.4%",col: "#ef4444" },
                  { label: "Calmar Ratio",   val: "2.11", col: "#00ff88" },
                ].map(m => (
                  <div key={m.label} className="flex justify-between text-[9px] font-mono">
                    <span style={{ color: "#3a5570" }}>{m.label}</span>
                    <span style={{ color: m.col }} className="font-bold">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Watchlist */}
          <div className="col-span-2 rounded-xl border p-4" style={{ background: "rgba(0,5,20,0.7)", borderColor: "#0d1e38" }}>
            <SectionHeader title="Live Watchlist" badge="EODHD" />
            <LiveWatchList />
          </div>
        </div>

        {/* Row 4 — Market pulse */}
        <div>
          <SectionHeader title="Global Market Pulse" />
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { s: "SPX",   p: "+0.22%", pos: true  },
              { s: "NDX",   p: "+0.25%", pos: true  },
              { s: "DAX",   p: "-0.18%", pos: false },
              { s: "NKY",   p: "+0.55%", pos: true  },
              { s: "BTC",   p: "+1.24%", pos: true  },
              { s: "GOLD",  p: "+0.14%", pos: true  },
              { s: "BRENT", p: "-0.12%", pos: false },
              { s: "VIX",   p: "-0.13%", pos: false },
            ].map(m => (
              <div key={m.s} className="rounded-lg border p-2 text-center"
                style={{
                  background: m.pos ? "rgba(0,255,136,0.04)" : "rgba(239,68,68,0.04)",
                  borderColor: m.pos ? "rgba(0,255,136,0.15)" : "rgba(239,68,68,0.15)",
                }}>
                <div className="text-[9px] font-mono text-slate-500">{m.s}</div>
                <div className="text-xs font-bold font-mono"
                  style={{ color: m.pos ? "#00ff88" : "#ef4444" }}>{m.p}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
