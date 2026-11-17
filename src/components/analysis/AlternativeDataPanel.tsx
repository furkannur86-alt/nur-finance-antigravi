"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const ALT_DATA = {
  satellite: [
    { ticker: "WMT", metric: "Parking Lot Fill Rate", value: 87, change: 4.2, period: "Nov W2", signal: "BULLISH" },
    { ticker: "TGT", metric: "Parking Lot Fill Rate", value: 72, change: -3.1, period: "Nov W2", signal: "BEARISH" },
    { ticker: "HD", metric: "Parking Lot Fill Rate", value: 68, change: 1.8, period: "Nov W2", signal: "NEUTRAL" },
    { ticker: "COST", metric: "Parking Lot Fill Rate", value: 91, change: 6.5, period: "Nov W2", signal: "BULLISH" },
  ],
  webTraffic: [
    { ticker: "AMZN", metric: "Web Visits (M)", value: 2840, change: 12.3, period: "30d", signal: "BULLISH" },
    { ticker: "SHOP", metric: "Web Visits (M)", value: 185, change: -5.7, period: "30d", signal: "BEARISH" },
    { ticker: "NFLX", metric: "Web Visits (M)", value: 1120, change: 8.1, period: "30d", signal: "BULLISH" },
    { ticker: "DIS", metric: "Disney+ Visits (M)", value: 340, change: -2.4, period: "30d", signal: "BEARISH" },
  ],
  appUsage: [
    { ticker: "META", app: "Instagram", dau: 2100, change: 3.8, downloads: 42, rank: 1 },
    { ticker: "SNAP", app: "Snapchat", dau: 410, change: -1.2, downloads: 18, rank: 5 },
    { ticker: "PINS", app: "Pinterest", dau: 95, change: 5.4, downloads: 8, rank: 12 },
    { ticker: "SPOT", app: "Spotify", dau: 580, change: 2.1, downloads: 28, rank: 3 },
    { ticker: "UBER", app: "Uber", dau: 320, change: 4.5, downloads: 22, rank: 4 },
  ],
  sentiment: [
    { ticker: "TSLA", source: "Twitter/X", mentions: 284000, sentiment: 0.42, change: -0.15, trending: true },
    { ticker: "GME", source: "Reddit", mentions: 92000, sentiment: 0.78, change: 0.32, trending: true },
    { ticker: "NVDA", source: "StockTwits", mentions: 156000, sentiment: 0.65, change: 0.08, trending: false },
    { ticker: "PLTR", source: "Reddit", mentions: 68000, sentiment: 0.55, change: 0.12, trending: true },
    { ticker: "AAPL", source: "Twitter/X", mentions: 198000, sentiment: 0.52, change: -0.05, trending: false },
  ],
  credit: [
    { ticker: "AAPL", metric: "Credit Card Spend", value: 8.2, unit: "B", change: 5.1, period: "Oct vs Sep" },
    { ticker: "AMZN", metric: "Credit Card Spend", value: 12.4, unit: "B", change: 8.7, period: "Oct vs Sep" },
    { ticker: "SBUX", metric: "Transaction Count", value: 142, unit: "M", change: -2.3, period: "Oct vs Sep" },
    { ticker: "MCD", metric: "Transaction Count", value: 215, unit: "M", change: 1.8, period: "Oct vs Sep" },
  ],
};

type Tab = "satellite" | "web" | "apps" | "social" | "credit";

export default function AlternativeDataPanel() {
  const [tab, setTab] = useState<Tab>("satellite");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛰️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ALTERNATIVE DATA</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>Bloomberg ALTD</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {([
            { key: "satellite", label: "🛰 SAT" },
            { key: "web", label: "🌐 WEB" },
            { key: "apps", label: "📱 APPS" },
            { key: "social", label: "💬 SOCIAL" },
            { key: "credit", label: "💳 CREDIT" },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-2 py-1 rounded text-[9px] font-bold"
              style={{ background: tab === t.key ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t.key ? "#00e5a0" : "#64748b" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "satellite" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-2 p-2 rounded" style={{ background: "rgba(249,115,22,0.08)", color: "#f97316" }}>
              Satellite imagery analysis — parking lot occupancy as foot traffic proxy
            </div>
            {ALT_DATA.satellite.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-bold w-12" style={{ color: "#00e5a0" }}>{d.ticker}</span>
                <div className="flex-1">
                  <div style={{ color: "#94a3b8" }}>{d.metric}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.value > 80 ? "#22c55e" : d.value > 60 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: "#e2e8f0" }}>{d.value}%</span>
                  </div>
                </div>
                <span className="font-mono" style={{ color: d.change > 0 ? "#22c55e" : "#ef4444" }}>
                  {d.change > 0 ? "+" : ""}{d.change}%
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                  style={{ background: d.signal === "BULLISH" ? "rgba(34,197,94,0.15)" : d.signal === "BEARISH" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                           color: d.signal === "BULLISH" ? "#22c55e" : d.signal === "BEARISH" ? "#ef4444" : "#94a3b8" }}>
                  {d.signal}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "web" && (
          <div className="space-y-2">
            {ALT_DATA.webTraffic.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-12" style={{ color: "#00e5a0" }}>{d.ticker}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span style={{ color: "#94a3b8" }}>{d.metric}</span>
                    <span className="font-mono font-bold" style={{ color: "#e2e8f0" }}>{d.value.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-mono" style={{ color: d.change > 0 ? "#22c55e" : "#ef4444" }}>
                  {d.change > 0 ? "+" : ""}{d.change}%
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                  style={{ background: d.signal === "BULLISH" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                           color: d.signal === "BULLISH" ? "#22c55e" : "#ef4444" }}>
                  {d.signal}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "apps" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-2 p-2 rounded" style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
              Mobile app usage analytics — DAU, downloads & app store ranking
            </div>
            {ALT_DATA.appUsage.map((d, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{d.ticker}</span>
                    <span style={{ color: "#a855f7" }}>{d.app}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>
                    #{d.rank}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[9px] mt-1">
                  <div>
                    <span style={{ color: "#64748b" }}>DAU: </span>
                    <span className="font-mono" style={{ color: "#e2e8f0" }}>{d.dau}M</span>
                    <span className="ml-1" style={{ color: d.change > 0 ? "#22c55e" : "#ef4444" }}>
                      {d.change > 0 ? "+" : ""}{d.change}%
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Downloads/wk: </span>
                    <span className="font-mono" style={{ color: "#e2e8f0" }}>{d.downloads}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-2">
            {ALT_DATA.sentiment.map((d, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{d.ticker}</span>
                    <span className="text-[9px]" style={{ color: "#64748b" }}>{d.source}</span>
                    {d.trending && <span className="text-[8px] px-1 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>TRENDING</span>}
                  </div>
                  <span className="font-mono" style={{ color: "#e2e8f0" }}>{d.mentions.toLocaleString()} mentions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px]" style={{ color: "#64748b" }}>Sentiment:</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${d.sentiment * 100}%`, background: d.sentiment > 0.5 ? "#22c55e" : "#ef4444" }} />
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: d.sentiment > 0.5 ? "#22c55e" : "#ef4444" }}>{(d.sentiment * 100).toFixed(0)}%</span>
                  <span className="font-mono text-[9px]" style={{ color: d.change > 0 ? "#22c55e" : "#ef4444" }}>
                    {d.change > 0 ? "+" : ""}{(d.change * 100).toFixed(0)}pp
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "credit" && (
          <div className="space-y-2">
            <div className="text-[9px] mb-2 p-2 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>
              Anonymized credit/debit card transaction data — consumer spending signals
            </div>
            {ALT_DATA.credit.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-12" style={{ color: "#00e5a0" }}>{d.ticker}</span>
                <span className="flex-1" style={{ color: "#94a3b8" }}>{d.metric}</span>
                <span className="font-mono font-bold" style={{ color: "#e2e8f0" }}>${d.value}{d.unit}</span>
                <span className="font-mono" style={{ color: d.change > 0 ? "#22c55e" : "#ef4444" }}>
                  {d.change > 0 ? "+" : ""}{d.change}%
                </span>
                <span className="text-[9px]" style={{ color: "#64748b" }}>{d.period}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
