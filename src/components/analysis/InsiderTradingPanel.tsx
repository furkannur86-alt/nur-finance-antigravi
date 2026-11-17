"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const INSIDER_TRADES = [
  { date: "2026-11-15", ticker: "NVDA", insider: "Jensen Huang", title: "CEO", type: "SELL" as const, shares: 120000, price: 142.50, value: 17100000, ownership: "0.03%", filing: "Form 4" },
  { date: "2026-11-14", ticker: "AAPL", insider: "Tim Cook", title: "CEO", type: "SELL" as const, shares: 50000, price: 234.80, value: 11740000, ownership: "0.01%", filing: "Form 4" },
  { date: "2026-11-14", ticker: "JPM", insider: "Jamie Dimon", title: "CEO", type: "SELL" as const, shares: 33000, price: 215.40, value: 7108200, ownership: "0.02%", filing: "Form 4" },
  { date: "2026-11-13", ticker: "MSFT", insider: "Satya Nadella", title: "CEO", type: "SELL" as const, shares: 20000, price: 420.30, value: 8406000, ownership: "0.00%", filing: "Form 4" },
  { date: "2026-11-12", ticker: "CRWD", insider: "George Kurtz", title: "CEO", type: "BUY" as const, shares: 15000, price: 385.20, value: 5778000, ownership: "1.2%", filing: "Form 4" },
  { date: "2026-11-12", ticker: "PLTR", insider: "Alex Karp", title: "CEO", type: "SELL" as const, shares: 2000000, price: 28.40, value: 56800000, ownership: "2.1%", filing: "Form 4" },
  { date: "2026-11-11", ticker: "BRK.B", insider: "Warren Buffett", title: "CEO", type: "BUY" as const, shares: 100000, price: 412.60, value: 41260000, ownership: "0.01%", filing: "Form 4" },
  { date: "2026-11-10", ticker: "COIN", insider: "Brian Armstrong", title: "CEO", type: "SELL" as const, shares: 50000, price: 268.90, value: 13445000, ownership: "0.8%", filing: "Form 4" },
  { date: "2026-11-10", ticker: "UBER", insider: "Dara Khosrowshahi", title: "CEO", type: "BUY" as const, shares: 25000, price: 72.30, value: 1807500, ownership: "0.01%", filing: "Form 4" },
  { date: "2026-11-09", ticker: "SNOW", insider: "Sridhar Ramaswamy", title: "CEO", type: "SELL" as const, shares: 40000, price: 185.60, value: 7424000, ownership: "0.3%", filing: "Form 4" },
];

const CLUSTER_DATA = [
  { ticker: "NVDA", buys: 2, sells: 8, netShares: -580000, netValue: -82400000, signal: "HEAVY SELL" },
  { ticker: "AAPL", buys: 1, sells: 5, netShares: -210000, netValue: -49200000, signal: "SELL" },
  { ticker: "BRK.B", buys: 4, sells: 0, netShares: 250000, netValue: 103000000, signal: "CLUSTER BUY" },
  { ticker: "CRWD", buys: 3, sells: 0, netShares: 45000, netValue: 17300000, signal: "CLUSTER BUY" },
  { ticker: "UBER", buys: 2, sells: 0, netShares: 55000, netValue: 3976500, signal: "BUY" },
  { ticker: "PLTR", buys: 0, sells: 6, netShares: -8500000, netValue: -241400000, signal: "HEAVY SELL" },
];

type Tab = "filings" | "clusters" | "stats";

function formatMoney(v: number) {
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export default function InsiderTradingPanel() {
  const [tab, setTab] = useState<Tab>("filings");
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL">("ALL");

  const filtered = filter === "ALL" ? INSIDER_TRADES : INSIDER_TRADES.filter(t => t.type === filter);

  const totalBuys = INSIDER_TRADES.filter(t => t.type === "BUY").reduce((s, t) => s + t.value, 0);
  const totalSells = INSIDER_TRADES.filter(t => t.type === "SELL").reduce((s, t) => s + t.value, 0);

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🕵️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INSIDER TRADING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>SEC Form 4</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["filings", "clusters", "stats"] as Tab[]).map(t => (
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
          { label: "NET BUY VALUE (30d)", value: formatMoney(totalBuys), color: "#22c55e" },
          { label: "NET SELL VALUE (30d)", value: formatMoney(totalSells), color: "#ef4444" },
          { label: "BUY/SELL RATIO", value: `${(totalBuys / totalSells).toFixed(2)}`, color: totalBuys > totalSells ? "#22c55e" : "#ef4444" },
          { label: "CLUSTER BUYS", value: CLUSTER_DATA.filter(c => c.signal.includes("BUY")).length.toString(), color: "#fbbf24" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "filings" && (
          <>
            <div className="flex gap-1 mb-2">
              {(["ALL", "BUY", "SELL"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-2 py-0.5 rounded text-[9px] font-bold"
                  style={{ background: filter === f ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.03)", color: filter === f ? "#00e5a0" : "#64748b" }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {filtered.map((t, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="font-mono text-[9px] w-20" style={{ color: "#64748b" }}>{t.date}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold w-10 text-center"
                    style={{ background: t.type === "BUY" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: t.type === "BUY" ? "#22c55e" : "#ef4444" }}>
                    {t.type}
                  </span>
                  <span className="font-bold w-14" style={{ color: "#00e5a0" }}>{t.ticker}</span>
                  <span className="flex-1" style={{ color: "#94a3b8" }}>{t.insider} <span style={{ color: "#475569" }}>({t.title})</span></span>
                  <span className="font-mono text-right w-20" style={{ color: "#e2e8f0" }}>{t.shares.toLocaleString()}</span>
                  <span className="font-mono text-right w-16" style={{ color: "#38bdf8" }}>${t.price.toFixed(2)}</span>
                  <span className="font-mono text-right w-16 font-bold" style={{ color: t.type === "BUY" ? "#22c55e" : "#ef4444" }}>
                    {formatMoney(t.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "clusters" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-2" style={{ color: "#64748b" }}>Cluster buying/selling = 3+ insiders trading same direction within 30 days</div>
            {CLUSTER_DATA.map(c => (
              <div key={c.ticker} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.signal.includes("BUY") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold"
                    style={{ background: c.signal.includes("BUY") ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: c.signal.includes("BUY") ? "#22c55e" : "#ef4444" }}>
                    {c.signal}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Buys:</span> <span style={{ color: "#22c55e" }}>{c.buys}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sells:</span> <span style={{ color: "#ef4444" }}>{c.sells}</span></div>
                  <div><span style={{ color: "#64748b" }}>Net Shares:</span> <span style={{ color: c.netShares > 0 ? "#22c55e" : "#ef4444" }}>{c.netShares.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Net Value:</span> <span style={{ color: c.netValue > 0 ? "#22c55e" : "#ef4444" }}>{formatMoney(c.netValue)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "stats" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>SECTOR INSIDER ACTIVITY (30d)</div>
              {[
                { sector: "Technology", buys: 5, sells: 22, net: -184000000 },
                { sector: "Financials", buys: 8, sells: 6, net: 42000000 },
                { sector: "Healthcare", buys: 12, sells: 4, net: 28000000 },
                { sector: "Consumer Disc.", buys: 3, sells: 15, net: -95000000 },
                { sector: "Energy", buys: 7, sells: 3, net: 18000000 },
              ].map(s => (
                <div key={s.sector} className="flex items-center gap-2 py-1 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <span className="w-28" style={{ color: "#94a3b8" }}>{s.sector}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div style={{ width: `${(s.buys / (s.buys + s.sells)) * 100}%`, background: "#22c55e" }} />
                    <div style={{ width: `${(s.sells / (s.buys + s.sells)) * 100}%`, background: "#ef4444" }} />
                  </div>
                  <span className="font-mono text-[9px] w-20 text-right" style={{ color: s.net > 0 ? "#22c55e" : "#ef4444" }}>
                    {formatMoney(s.net)}
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
