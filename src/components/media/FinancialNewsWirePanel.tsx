"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "feed" | "breaking" | "sectors" | "sentiment";

export default function FinancialNewsWirePanel() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📰</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FINANCIAL NEWS WIRE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters NEWS</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["feed", "breaking", "sectors", "sentiment"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "feed" && (
          <div className="space-y-2">
            {[
              { time: "14:35", source: "Reuters", headline: "Fed's Waller signals openness to December rate cut if data supports", tickers: ["SPY", "TLT"], impact: "High" },
              { time: "14:28", source: "BBG", headline: "NVIDIA Q4 guidance beats estimates; data center revenue surges 85%", tickers: ["NVDA", "SMH"], impact: "High" },
              { time: "14:15", source: "DJ", headline: "US existing home sales rise 3.5% in October, beating forecasts", tickers: ["XHB", "ITB"], impact: "Medium" },
              { time: "14:02", source: "Reuters", headline: "ECB's Lagarde warns of downside risks to eurozone growth outlook", tickers: ["EWQ", "FXE"], impact: "Medium" },
              { time: "13:48", source: "BBG", headline: "China PBOC holds 1-year MLF rate steady at 2.50% as expected", tickers: ["FXI", "KWEB"], impact: "Low" },
              { time: "13:35", source: "Reuters", headline: "Oil prices slip as OPEC+ output concerns weigh on market", tickers: ["USO", "XLE"], impact: "Medium" },
              { time: "13:22", source: "DJ", headline: "US initial jobless claims fall to 209K, lowest since October", tickers: ["SPY", "DIA"], impact: "Medium" },
              { time: "13:08", source: "BBG", headline: "Bitcoin surpasses $100K for first time on ETF inflow surge", tickers: ["IBIT", "MSTR"], impact: "High" },
              { time: "12:55", source: "Reuters", headline: "German Ifo business climate index falls to 85.7 in November", tickers: ["EWG", "DAX"], impact: "Low" },
              { time: "12:42", source: "DJ", headline: "US 10-year Treasury yield rises to 4.42% ahead of auction", tickers: ["TLT", "IEF"], impact: "Medium" },
            ].map((n, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", borderLeft: `2px solid ${n.impact === "High" ? "#ef4444" : n.impact === "Medium" ? "#fbbf24" : "#64748b"}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{n.time}</span>
                  <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{
                    background: n.source === "Reuters" ? "rgba(239,68,68,0.1)" : n.source === "BBG" ? "rgba(56,189,248,0.1)" : "rgba(100,116,139,0.1)",
                    color: n.source === "Reuters" ? "#ef4444" : n.source === "BBG" ? "#38bdf8" : "#64748b",
                  }}>{n.source}</span>
                  <div className="flex gap-1 ml-auto">
                    {n.tickers.map(t => (
                      <span key={t} className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="font-bold text-[10px]">{n.headline}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "breaking" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>BREAKING / FLASH ALERTS</div>
            {[
              { time: "14:35", headline: "FED'S WALLER: INCLINED TO SUPPORT DECEMBER RATE CUT", priority: "FLASH", tickers: ["SPY", "TLT", "GLD"] },
              { time: "14:28", headline: "NVIDIA Q4 REV GUIDANCE $37.5B vs $37.1B EST", priority: "URGENT", tickers: ["NVDA", "SMH"] },
              { time: "13:08", headline: "BITCOIN CROSSES $100,000 FOR FIRST TIME", priority: "FLASH", tickers: ["IBIT", "MSTR", "COIN"] },
            ].map((a, i) => (
              <div key={i} className="p-3 rounded" style={{
                background: a.priority === "FLASH" ? "rgba(239,68,68,0.08)" : "rgba(251,191,36,0.08)",
                border: `1px solid ${a.priority === "FLASH" ? "rgba(239,68,68,0.3)" : "rgba(251,191,36,0.3)"}`,
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold animate-pulse" style={{
                    background: a.priority === "FLASH" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)",
                    color: a.priority === "FLASH" ? "#ef4444" : "#fbbf24",
                  }}>{a.priority}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.time}</span>
                </div>
                <div className="font-bold text-xs mb-1" style={{ color: a.priority === "FLASH" ? "#ef4444" : "#fbbf24" }}>{a.headline}</div>
                <div className="flex gap-1">
                  {a.tickers.map(t => (
                    <span key={t} className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sectors" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR NEWS VOLUME — 24H</div>
            {[
              { sector: "Technology", articles: 342, sentiment: 0.65, trending: "AI chips, cloud earnings" },
              { sector: "Financials", articles: 285, sentiment: 0.42, trending: "Fed rates, bank earnings" },
              { sector: "Energy", articles: 198, sentiment: -0.15, trending: "OPEC+, clean energy" },
              { sector: "Healthcare", articles: 165, sentiment: 0.28, trending: "Drug approvals, GLP-1" },
              { sector: "Real Estate", articles: 95, sentiment: -0.35, trending: "Rates impact, CRE stress" },
              { sector: "Crypto/Digital", articles: 420, sentiment: 0.85, trending: "BTC $100K, ETF flows" },
            ].map(s => (
              <div key={s.sector} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.sector}</span>
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{s.articles} articles</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: s.sentiment > 0.3 ? "#22c55e" : s.sentiment > 0 ? "#fbbf24" : "#ef4444" }}>
                    {s.sentiment > 0 ? "+" : ""}{(s.sentiment * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-[9px]" style={{ color: "#64748b" }}>Trending: <span style={{ color: "#38bdf8" }}>{s.trending}</span></div>
              </div>
            ))}
          </div>
        )}

        {tab === "sentiment" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NEWS SENTIMENT INDICATORS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Overall Market", val: "+0.42", color: "#22c55e", status: "Positive" },
                { label: "Fear & Greed", val: "72", color: "#22c55e", status: "Greed" },
                { label: "News Velocity", val: "1.8x", color: "#fbbf24", status: "Above Avg" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: s.color }}>{s.status}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TICKER SENTIMENT SCORES (NLP)</div>
            {[
              { ticker: "NVDA", score: 0.85, articles: 85, trend: "up" },
              { ticker: "AAPL", score: 0.35, articles: 62, trend: "flat" },
              { ticker: "TSLA", score: 0.55, articles: 78, trend: "up" },
              { ticker: "META", score: -0.12, articles: 42, trend: "down" },
              { ticker: "GOOG", score: 0.22, articles: 38, trend: "flat" },
              { ticker: "AMZN", score: 0.48, articles: 45, trend: "up" },
            ].map(t => (
              <div key={t.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-12" style={{ color: "#00e5a0" }}>{t.ticker}</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(t.score + 1) * 50}%`,
                    background: t.score > 0.3 ? "rgba(34,197,94,0.5)" : t.score > 0 ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.5)",
                  }} />
                </div>
                <span className="font-mono w-12 text-right font-bold" style={{
                  color: t.score > 0.3 ? "#22c55e" : t.score > 0 ? "#fbbf24" : "#ef4444",
                }}>{t.score > 0 ? "+" : ""}{t.score.toFixed(2)}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{t.articles}</span>
                <span style={{ color: t.trend === "up" ? "#22c55e" : t.trend === "down" ? "#ef4444" : "#64748b" }}>
                  {t.trend === "up" ? "▲" : t.trend === "down" ? "▼" : "●"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
