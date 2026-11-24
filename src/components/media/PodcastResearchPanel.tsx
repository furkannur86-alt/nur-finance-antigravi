"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "podcasts" | "research" | "calls" | "transcripts";

export default function PodcastResearchPanel() {
  const [tab, setTab] = useState<Tab>("podcasts");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🎙️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PODCAST & RESEARCH</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters Research</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["podcasts", "research", "calls", "transcripts"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "podcasts" && (
          <div className="space-y-2">
            {[
              { title: "Fed Rate Path: December and Beyond", host: "Bloomberg Surveillance", duration: "42 min", date: "Nov 24", plays: "125K", topics: ["Fed", "Rates", "Economy"] },
              { title: "NVIDIA Earnings Deep Dive", host: "All-In Podcast", duration: "1h 15min", date: "Nov 23", plays: "580K", topics: ["NVDA", "AI", "Semis"] },
              { title: "Bitcoin at $100K — What's Next?", host: "Bankless", duration: "55 min", date: "Nov 23", plays: "320K", topics: ["BTC", "Crypto", "ETFs"] },
              { title: "China Property Crisis Update", host: "FT News Briefing", duration: "28 min", date: "Nov 22", plays: "85K", topics: ["China", "Real Estate"] },
              { title: "2025 Market Outlook", host: "Goldman Sachs Exchanges", duration: "38 min", date: "Nov 22", plays: "95K", topics: ["Outlook", "Strategy"] },
              { title: "Oil Markets: OPEC+ Decision", host: "S&P Global Platts", duration: "32 min", date: "Nov 21", plays: "45K", topics: ["Oil", "OPEC", "Energy"] },
            ].map((p, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-bold text-[10px]">{p.title}</div>
                    <div className="text-[9px]" style={{ color: "#a855f7" }}>{p.host}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px]" style={{ color: "#64748b" }}>{p.duration}</div>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>{p.plays} plays</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {p.topics.map(t => (
                    <span key={t} className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>{t}</span>
                  ))}
                  <span className="text-[8px] ml-auto" style={{ color: "#64748b" }}>{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "research" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATEST RESEARCH NOTES</div>
            {[
              { firm: "Goldman Sachs", title: "US Equity Strategy: 2025 Outlook", rating: "Overweight", target: "SPX 6,500", date: "Nov 23" },
              { firm: "JPMorgan", title: "NVIDIA: AI Capex Cycle Still Early", rating: "Overweight", target: "$175", date: "Nov 22" },
              { firm: "Morgan Stanley", title: "Global FX: USD Strength to Persist", rating: "N/A", target: "EUR/USD 1.02", date: "Nov 22" },
              { firm: "BofA Securities", title: "Crypto: Bitcoin Post-$100K Framework", rating: "N/A", target: "BTC $150K", date: "Nov 21" },
              { firm: "Citi", title: "China Macro: Stimulus Assessment", rating: "N/A", target: "GDP 4.8%", date: "Nov 21" },
              { firm: "Barclays", title: "European Banks: Underappreciated", rating: "Overweight", target: "+15% upside", date: "Nov 20" },
            ].map((r, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{r.firm}</span>
                    <span className="font-bold">{r.title}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{r.date}</span>
                </div>
                <div className="flex gap-3 text-[9px]">
                  {r.rating !== "N/A" && <span><span style={{ color: "#64748b" }}>Rating:</span> <span style={{ color: "#22c55e" }}>{r.rating}</span></span>}
                  <span><span style={{ color: "#64748b" }}>Target:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{r.target}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calls" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ANALYST / EARNINGS CALLS — UPCOMING</div>
            {[
              { company: "Salesforce", type: "Earnings", date: "Nov 26, 5:00 PM ET", ticker: "CRM", expected: "Q3 FY25 results" },
              { company: "CrowdStrike", type: "Earnings", date: "Nov 26, 5:00 PM ET", ticker: "CRWD", expected: "Q3 FY25 results" },
              { company: "Snowflake", type: "Earnings", date: "Nov 27, 5:00 PM ET", ticker: "SNOW", expected: "Q3 FY25 results" },
              { company: "Fed Chair Powell", type: "Speech", date: "Dec 4, 1:30 PM ET", ticker: "N/A", expected: "Economic outlook" },
              { company: "ECB President Lagarde", type: "Speech", date: "Dec 5, 8:00 AM ET", ticker: "N/A", expected: "Policy update" },
            ].map((c, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.company}</span>
                    {c.ticker !== "N/A" && <span className="font-mono text-[9px]" style={{ color: "#00e5a0" }}>{c.ticker}</span>}
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: c.type === "Earnings" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                    color: c.type === "Earnings" ? "#fbbf24" : "#38bdf8",
                  }}>{c.type}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="font-mono" style={{ color: "#64748b" }}>{c.date}</span>
                  <span style={{ color: "#64748b" }}>{c.expected}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "transcripts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT CALL TRANSCRIPTS</div>
            {[
              { company: "NVIDIA", ticker: "NVDA", date: "Nov 20", keyQuote: "Data center revenue up 112% YoY... we see the beginning of a new era of AI computing.", sentiment: "Very Bullish", mentions: { ai: 85, growth: 42, margin: 28 } },
              { company: "Walmart", ticker: "WMT", date: "Nov 19", keyQuote: "Consumer remains resilient... we're seeing particularly strong growth in e-commerce and advertising.", sentiment: "Bullish", mentions: { consumer: 35, ecomm: 28, margin: 22 } },
              { company: "Target", ticker: "TGT", date: "Nov 20", keyQuote: "Discretionary trends softer than expected... consumers are being more selective.", sentiment: "Cautious", mentions: { consumer: 42, inventory: 18, guidance: 15 } },
            ].map(t => (
              <div key={t.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{t.ticker}</span>
                    <span className="font-bold">{t.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{t.date}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px]" style={{
                      background: t.sentiment.includes("Bullish") ? "rgba(34,197,94,0.1)" : t.sentiment === "Cautious" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)",
                      color: t.sentiment.includes("Bullish") ? "#22c55e" : t.sentiment === "Cautious" ? "#fbbf24" : "#ef4444",
                    }}>{t.sentiment}</span>
                  </div>
                </div>
                <div className="p-1.5 rounded mb-1 italic text-[9px]" style={{ background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
                  &ldquo;{t.keyQuote}&rdquo;
                </div>
                <div className="flex gap-2 text-[8px]">
                  {Object.entries(t.mentions).map(([k, v]) => (
                    <span key={k} className="font-mono" style={{ color: "#64748b" }}>{k}: {v}x</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
