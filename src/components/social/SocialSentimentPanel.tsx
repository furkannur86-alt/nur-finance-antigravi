"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "trending" | "mentions" | "reddit" | "alerts";

export default function SocialSentimentPanel() {
  const [tab, setTab] = useState<Tab>("trending");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💬</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SOCIAL SENTIMENT</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters Social</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["trending", "mentions", "reddit", "alerts"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "trending" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TRENDING TICKERS — SOCIAL VOLUME</div>
            {[
              { rank: 1, ticker: "NVDA", mentions: 42500, chg: 85, sentiment: 0.78, momentum: "Surging" },
              { rank: 2, ticker: "TSLA", mentions: 38200, chg: 42, sentiment: 0.55, momentum: "Rising" },
              { rank: 3, ticker: "BTC", mentions: 65000, chg: 120, sentiment: 0.82, momentum: "Surging" },
              { rank: 4, ticker: "GME", mentions: 15800, chg: 350, sentiment: 0.45, momentum: "Viral" },
              { rank: 5, ticker: "AAPL", mentions: 22100, chg: -15, sentiment: 0.35, momentum: "Fading" },
              { rank: 6, ticker: "AMD", mentions: 18500, chg: 28, sentiment: 0.65, momentum: "Rising" },
              { rank: 7, ticker: "PLTR", mentions: 12800, chg: 55, sentiment: 0.72, momentum: "Rising" },
              { rank: 8, ticker: "SPY", mentions: 28500, chg: 5, sentiment: 0.48, momentum: "Stable" },
            ].map(t => (
              <div key={t.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono w-6 text-right" style={{ color: "#64748b" }}>#{t.rank}</span>
                <span className="font-mono font-bold w-10" style={{ color: "#00e5a0" }}>{t.ticker}</span>
                <span className="font-mono w-16 text-right">{t.mentions.toLocaleString()}</span>
                <span className="font-mono w-14 text-right" style={{ color: t.chg > 50 ? "#ef4444" : t.chg > 0 ? "#22c55e" : "#64748b" }}>+{t.chg}%</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${t.sentiment * 100}%`,
                    background: t.sentiment > 0.6 ? "rgba(34,197,94,0.5)" : t.sentiment > 0.4 ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.5)",
                  }} />
                </div>
                <span className="text-[8px] w-14 text-right px-1 py-0.5 rounded" style={{
                  background: t.momentum === "Surging" || t.momentum === "Viral" ? "rgba(239,68,68,0.1)" : t.momentum === "Rising" ? "rgba(34,197,94,0.1)" : "rgba(100,116,139,0.1)",
                  color: t.momentum === "Surging" || t.momentum === "Viral" ? "#ef4444" : t.momentum === "Rising" ? "#22c55e" : "#64748b",
                }}>{t.momentum}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "mentions" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PLATFORM BREAKDOWN — 24H</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { platform: "X/Twitter", count: "2.8M", color: "#38bdf8" },
                { platform: "Reddit", count: "850K", color: "#f97316" },
                { platform: "StockTwits", count: "420K", color: "#22c55e" },
                { platform: "Discord", count: "380K", color: "#a855f7" },
              ].map(p => (
                <div key={p.platform} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{p.platform}</div>
                  <div className="font-mono font-bold" style={{ color: p.color }}>{p.count}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP MENTIONS BY PLATFORM</div>
            {[
              { ticker: "NVDA", x: 18500, reddit: 8200, stocktwits: 4500, discord: 3200, total: 34400 },
              { ticker: "TSLA", x: 15200, reddit: 6800, stocktwits: 3800, discord: 2800, total: 28600 },
              { ticker: "BTC", x: 28000, reddit: 12500, stocktwits: 8500, discord: 5500, total: 54500 },
              { ticker: "AAPL", x: 9500, reddit: 4200, stocktwits: 2800, discord: 1500, total: 18000 },
            ].map(m => (
              <div key={m.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{m.ticker}</span>
                  <span className="font-mono" style={{ color: "#64748b" }}>{m.total.toLocaleString()} total</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px]">
                  <div className="text-center"><span className="font-mono" style={{ color: "#38bdf8" }}>{(m.x / 1000).toFixed(1)}K</span></div>
                  <div className="text-center"><span className="font-mono" style={{ color: "#f97316" }}>{(m.reddit / 1000).toFixed(1)}K</span></div>
                  <div className="text-center"><span className="font-mono" style={{ color: "#22c55e" }}>{(m.stocktwits / 1000).toFixed(1)}K</span></div>
                  <div className="text-center"><span className="font-mono" style={{ color: "#a855f7" }}>{(m.discord / 1000).toFixed(1)}K</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "reddit" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REDDIT — HOT POSTS (r/wallstreetbets)</div>
            {[
              { title: "NVDA earnings play — loading up on Dec calls", upvotes: 8500, comments: 1250, awards: 12, sentiment: "Bullish", time: "2h" },
              { title: "GME short interest just spiked to 68% — here we go again", upvotes: 12800, comments: 3200, awards: 28, sentiment: "Bullish", time: "4h" },
              { title: "Why I'm bearish on META heading into 2025", upvotes: 2200, comments: 850, awards: 3, sentiment: "Bearish", time: "6h" },
              { title: "BTC $100K — called it 6 months ago, proof inside", upvotes: 15200, comments: 4500, awards: 45, sentiment: "Bullish", time: "8h" },
              { title: "TSLA bear case nobody talks about", upvotes: 5500, comments: 2100, awards: 8, sentiment: "Bearish", time: "10h" },
            ].map((p, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center pt-1">
                    <span className="text-[9px]" style={{ color: "#f97316" }}>▲</span>
                    <span className="font-mono text-[9px] font-bold" style={{ color: "#f97316" }}>{(p.upvotes / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[10px] mb-1">{p.title}</div>
                    <div className="flex items-center gap-3 text-[8px]" style={{ color: "#64748b" }}>
                      <span>{p.time} ago</span>
                      <span>{p.comments.toLocaleString()} comments</span>
                      <span>{p.awards} awards</span>
                      <span className="px-1 py-0.5 rounded" style={{
                        background: p.sentiment === "Bullish" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: p.sentiment === "Bullish" ? "#22c55e" : "#ef4444",
                      }}>{p.sentiment}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>VIRAL ALERTS — UNUSUAL SOCIAL ACTIVITY</div>
            {[
              { time: "14:30", ticker: "GME", type: "Volume Spike", detail: "Social mentions up 350% in 1hr", severity: "Critical" },
              { time: "14:15", ticker: "BTC", type: "Sentiment Shift", detail: "Sentiment flipped from 0.4 to 0.82 in 2hrs", severity: "High" },
              { time: "13:45", ticker: "SMCI", type: "New Trend", detail: "Trending #1 on StockTwits for first time", severity: "High" },
              { time: "13:20", ticker: "PLTR", type: "Influencer", detail: "Major fintwit account posted bull thesis (500K followers)", severity: "Medium" },
            ].map((a, i) => (
              <div key={i} className="p-2 rounded" style={{
                background: a.severity === "Critical" ? "rgba(239,68,68,0.08)" : a.severity === "High" ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${a.severity === "Critical" ? "rgba(239,68,68,0.3)" : a.severity === "High" ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)"}`,
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.time}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{a.ticker}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: a.severity === "Critical" ? "rgba(239,68,68,0.15)" : a.severity === "High" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                    color: a.severity === "Critical" ? "#ef4444" : a.severity === "High" ? "#fbbf24" : "#38bdf8",
                  }}>{a.severity}</span>
                  <span className="text-[8px] ml-auto" style={{ color: "#64748b" }}>{a.type}</span>
                </div>
                <div className="text-[10px]">{a.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
