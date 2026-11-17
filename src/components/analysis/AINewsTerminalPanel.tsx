"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const NEWS_FEED = [
  { time: "14:32", headline: "Fed signals potential rate pause amid cooling inflation data", source: "NUR Wire", sentiment: "BULLISH" as const, impact: 9, tickers: ["SPY", "TLT", "GLD"] },
  { time: "14:18", headline: "NVIDIA Blackwell Ultra shipments exceed Q4 guidance by 22%", source: "NUR Intel", sentiment: "BULLISH" as const, impact: 8, tickers: ["NVDA", "TSM", "AVGO"] },
  { time: "13:55", headline: "Deutsche Bank faces $2.1B exposure to distressed CRE loans", source: "Reuters", sentiment: "BEARISH" as const, impact: 7, tickers: ["DB", "EWG", "XLF"] },
  { time: "13:41", headline: "China PMI contracts for third consecutive month at 48.2", source: "NUR Macro", sentiment: "BEARISH" as const, impact: 8, tickers: ["FXI", "EEM", "BABA"] },
  { time: "13:22", headline: "Apple Vision Pro 2 pre-orders surge 340% vs first generation", source: "Bloomberg", sentiment: "BULLISH" as const, impact: 6, tickers: ["AAPL", "QCOM", "SONY"] },
  { time: "12:58", headline: "US 10Y yield breaks below 4.0% for first time since March", source: "NUR Rates", sentiment: "BULLISH" as const, impact: 9, tickers: ["TLT", "IEF", "XLU"] },
  { time: "12:34", headline: "Pfizer halts Phase 3 trial for obesity drug candidate", source: "NUR Pharma", sentiment: "BEARISH" as const, impact: 7, tickers: ["PFE", "LLY", "NVO"] },
  { time: "12:11", headline: "Saudi Aramco announces $50B green hydrogen expansion", source: "NUR Energy", sentiment: "NEUTRAL" as const, impact: 5, tickers: ["2222.SR", "PLUG", "BE"] },
  { time: "11:48", headline: "EU approves Digital Euro framework with 2028 rollout timeline", source: "ECB Press", sentiment: "NEUTRAL" as const, impact: 6, tickers: ["EURUSD", "SAN", "BNP"] },
  { time: "11:22", headline: "Tesla Robotaxi fleet reaches 10,000 vehicles in Austin pilot", source: "NUR Auto", sentiment: "BULLISH" as const, impact: 7, tickers: ["TSLA", "UBER", "LYFT"] },
];

const RESEARCH_BRIEFS = [
  {
    title: "Fed Rate Decision Impact Analysis",
    date: "Nov 17, 2026",
    summary: "The Federal Reserve's dovish pivot signals a potential 50bp cut in December, marking the beginning of an easing cycle. Our models project 150bp of total cuts through 2027.",
    findings: [
      "Core PCE at 2.3% — within striking distance of 2% target",
      "Labor market cooling: NFP 3-month avg at 142K vs 215K prior year",
      "Housing starts declining 8% QoQ — rate-sensitive sectors under pressure",
      "Market pricing 72% probability of 50bp December cut (vs 45% last month)",
    ],
    sectors: ["Financials", "Real Estate", "Utilities", "Technology"],
    risk: "MEDIUM",
    riskColor: "#fbbf24",
  },
  {
    title: "AI Semiconductor Supply Chain Disruption",
    date: "Nov 16, 2026",
    summary: "TSMC's Arizona fab delays and new US-China export controls are reshaping the AI chip landscape. We identify winners and losers in the evolving supply chain.",
    findings: [
      "TSMC Arizona Fab 2 delayed to Q3 2028 — 9 months behind schedule",
      "New export controls target CoWoS advanced packaging technology",
      "Samsung gaining share in HBM4 — now 28% of NVIDIA supply",
      "Domestic foundry investment up 180% YoY — CHIPS Act spending accelerates",
    ],
    sectors: ["Semiconductors", "AI Infrastructure", "Defense Tech"],
    risk: "HIGH",
    riskColor: "#ef4444",
  },
  {
    title: "European Banking Stress Monitor",
    date: "Nov 15, 2026",
    summary: "CRE exposure across European banks exceeds €1.8T with rising delinquencies. Our stress test shows 4 banks at risk of capital shortfalls under adverse scenario.",
    findings: [
      "CRE vacancy rates: Germany 14.2%, France 11.8%, UK 9.5%",
      "Tier 1 capital ratios declining — median down 40bp in Q3",
      "ECB supervisory stress test results due December 12",
      "Subordinated debt spreads widening — CoCo index +85bp in 30 days",
    ],
    sectors: ["Banks", "Insurance", "Real Estate"],
    risk: "HIGH",
    riskColor: "#ef4444",
  },
];

const ALERTS = [
  { name: "Earnings Miss >5%", status: "TRIGGERED", lastTriggered: "14:22 today", action: "Flagged PFE (-6.2% EPS miss)", color: "#ef4444" },
  { name: "Insider Cluster Buy", status: "ACTIVE", lastTriggered: "Yesterday 09:15", action: "CRWD — 4 insiders bought $12M in 7 days", color: "#22c55e" },
  { name: "VIX Spike >25", status: "WATCHING", lastTriggered: "Nov 12", action: "VIX at 22.4 — approaching threshold", color: "#fbbf24" },
  { name: "Central Bank Surprise", status: "TRIGGERED", lastTriggered: "13:00 today", action: "Fed dot plot shifted dovish vs consensus", color: "#ef4444" },
  { name: "Dark Pool Volume >3x Avg", status: "ACTIVE", lastTriggered: "12:45 today", action: "TSLA dark pool 3.2x avg — large block activity", color: "#22c55e" },
  { name: "Credit Spread Blow-out", status: "WATCHING", lastTriggered: "Nov 14", action: "HY OAS at 385bp — 15bp from trigger level", color: "#fbbf24" },
  { name: "Sector Rotation Signal", status: "TRIGGERED", lastTriggered: "11:30 today", action: "Momentum shift: Tech→Healthcare in 5-day flow", color: "#ef4444" },
  { name: "Sovereign CDS Spike >20%", status: "QUIET", lastTriggered: "Oct 28", action: "No triggers — monitoring 42 sovereigns", color: "#64748b" },
];

const QA_PAIRS = [
  {
    q: "What's driving the tech selloff this week?",
    a: "Three converging factors: (1) TSMC Arizona delays raised supply chain concerns, pushing SOX index down 3.2%. (2) China's new data localization rules affect cloud revenue estimates for MSFT, AMZN, GOOG — consensus cuts of 2-4% for FY27 China revenue. (3) Rotation into rate-sensitive sectors ahead of expected Fed cut is pulling capital from growth. Our models show this is a 2-3 week tactical rotation, not a structural shift. Key level: SOX 4,800 support.",
  },
  {
    q: "Is the European banking sector safe to invest in?",
    a: "Mixed outlook. Top-tier banks (UBS, BNP, Santander) maintain strong capital buffers with CET1 >13%. However, mid-tier German and Italian banks face CRE stress — we flag Deutsche Pfandbriefbank and Commerzbank as vulnerable. Our base case: no systemic crisis, but expect 10-15% earnings downgrades for exposed names. Wait for ECB stress test results on Dec 12 before adding exposure. Prefer Nordic banks (Nordea, SEB) for quality.",
  },
  {
    q: "How should I position for the Fed rate cut cycle?",
    a: "Our recommended playbook: (1) OVERWEIGHT duration — extend bond portfolio to 7-10Y, TLT/IEF as proxies. (2) ADD rate-sensitive equities — REITs (VNQ), utilities (XLU), small caps (IWM) historically outperform by 8-12% in first 6 months of easing. (3) REDUCE cash allocation from 5% to 2% — opportunity cost rises as front-end rates fall. (4) HEDGE via put spreads on HYG — credit tends to lag in late-cycle easing. Expected portfolio impact: +180bp alpha vs 60/40 benchmark over 12 months.",
  },
];

type Tab = "feed" | "analysis" | "alerts" | "ask";

export default function AINewsTerminalPanel() {
  const [tab, setTab] = useState<Tab>("feed");

  const bullish = NEWS_FEED.filter(n => n.sentiment === "BULLISH").length;
  const bearish = NEWS_FEED.filter(n => n.sentiment === "BEARISH").length;
  const triggered = ALERTS.filter(a => a.status === "TRIGGERED").length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>AI NEWS TERMINAL</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>NUR ASKB</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["feed", "analysis", "alerts", "ask"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "ask" ? "ASK AI" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "SENTIMENT", value: `${bullish}B / ${bearish}Be`, color: bullish > bearish ? "#22c55e" : "#ef4444" },
          { label: "AVG IMPACT", value: (NEWS_FEED.reduce((s, n) => s + n.impact, 0) / NEWS_FEED.length).toFixed(1), color: "#fbbf24" },
          { label: "ALERTS FIRED", value: `${triggered}/${ALERTS.length}`, color: triggered > 2 ? "#ef4444" : "#fbbf24" },
          { label: "AI CONFIDENCE", value: "94.2%", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "feed" && (
          <div className="space-y-1.5">
            {NEWS_FEED.map((n, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[9px] mt-0.5 shrink-0" style={{ color: "#64748b" }}>{n.time}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold leading-tight mb-1" style={{ color: "#e2e8f0" }}>{n.headline}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[8px]" style={{ color: "#64748b" }}>{n.source}</span>
                      <span className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                        style={{
                          background: n.sentiment === "BULLISH" ? "rgba(34,197,94,0.15)" : n.sentiment === "BEARISH" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                          color: n.sentiment === "BULLISH" ? "#22c55e" : n.sentiment === "BEARISH" ? "#ef4444" : "#94a3b8",
                        }}>
                        {n.sentiment}
                      </span>
                      <span className="text-[8px]" style={{ color: "#fbbf24" }}>Impact: {n.impact}/10</span>
                      <div className="flex gap-1">
                        {n.tickers.map(t => (
                          <span key={t} className="px-1 py-0.5 rounded text-[7px] font-mono" style={{ background: "rgba(0,229,160,0.08)", color: "#00e5a0" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analysis" && (
          <div className="space-y-3">
            {RESEARCH_BRIEFS.map((brief, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-xs" style={{ color: "#00e5a0" }}>{brief.title}</div>
                    <div className="text-[9px]" style={{ color: "#64748b" }}>{brief.date}</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${brief.riskColor}20`, color: brief.riskColor }}>
                    RISK: {brief.risk}
                  </span>
                </div>
                <div className="text-[10px] mb-2 leading-relaxed" style={{ color: "#94a3b8" }}>{brief.summary}</div>
                <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>KEY FINDINGS</div>
                <div className="space-y-1 mb-2">
                  {brief.findings.map((f, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-[9px]">
                      <span style={{ color: "#00e5a0" }}>▸</span>
                      <span style={{ color: "#e2e8f0" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[8px]" style={{ color: "#64748b" }}>SECTORS:</span>
                  {brief.sectors.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[7px]" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-1.5">
            <div className="text-[9px] mb-2" style={{ color: "#64748b" }}>Smart alerts monitor 200+ signals across markets, filings, flows and macro indicators</div>
            {ALERTS.map((a, i) => (
              <div key={i} className="p-2.5 rounded flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${a.status === "TRIGGERED" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color, boxShadow: a.status === "TRIGGERED" ? `0 0 6px ${a.color}` : "none" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold" style={{ color: "#e2e8f0" }}>{a.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                      style={{
                        background: a.status === "TRIGGERED" ? "rgba(239,68,68,0.15)" : a.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : a.status === "WATCHING" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
                        color: a.color,
                      }}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-[9px]" style={{ color: "#94a3b8" }}>{a.action}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#64748b" }}>Last: {a.lastTriggered}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "ask" && (
          <div className="space-y-3">
            <div className="p-2 rounded flex items-center gap-2" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <span className="text-sm">🤖</span>
              <span className="text-[10px]" style={{ color: "#00e5a0" }}>NUR AI Analyst — Ask anything about markets, macro, or your portfolio</span>
            </div>
            {QA_PAIRS.map((qa, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Q</span>
                  <div className="p-2.5 rounded flex-1" style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.1)" }}>
                    <span className="font-bold text-[10px]" style={{ color: "#38bdf8" }}>{qa.q}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: "rgba(0,229,160,0.15)", color: "#00e5a0" }}>A</span>
                  <div className="p-2.5 rounded flex-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[10px] leading-relaxed" style={{ color: "#e2e8f0" }}>{qa.a}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="Ask NUR AI about any market topic..."
                className="flex-1 px-3 py-2 rounded text-[10px] outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                readOnly />
              <button className="px-3 py-2 rounded text-[9px] font-bold" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
                ASK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
