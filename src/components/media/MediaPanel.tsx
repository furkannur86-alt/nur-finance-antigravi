"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import EagleCrest from "@/components/ui/EagleCrest";
import { BullIcon, BearIcon } from "@/components/ui/MarketIcons";
import NFWatermark from "@/components/ui/NFWatermark";
import GlobeWidget from "@/components/ui/GlobeWidget";
import { useIDEStore } from "@/stores/useIDEStore";
import { cyberSound } from "@/lib/audio/sound-synth";
import { hdVoiceEngine, BROADCAST_LANGUAGES } from "@/lib/broadcast/multilingual-broadcast";

type MediaTab = "news-wire" | "social" | "video" | "live-broadcast" | "research";

const TABS: { id: MediaTab; label: string; icon: string }[] = [
  { id: "news-wire", label: "News Wire", icon: "📰" },
  { id: "social", label: "Social & Trending", icon: "📱" },
  { id: "video", label: "Video & YouTube", icon: "🎬" },
  { id: "live-broadcast", label: "Live Broadcast", icon: "📡" },
  { id: "research", label: "Research & Reports", icon: "🔬" },
];

interface NewsItem {
  id: string;
  source: string;
  sourceColor: string;
  headline: string;
  summary: string;
  category: string;
  time: string;
  region: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
}

const DEMO_NEWS: NewsItem[] = [
  { id: "n1", source: "Reuters", sourceColor: "#ff6600", headline: "Fed Signals Potential Rate Cut in Q1 as Inflation Cools", summary: "Federal Reserve officials indicated growing confidence that inflation is sustainably moving toward the 2% target, opening the door for monetary easing.", category: "Central Banks", time: "2 min ago", region: "US", impact: "HIGH", sentiment: "BULLISH" },
  { id: "n2", source: "Bloomberg", sourceColor: "#2800d7", headline: "ECB Holds Rates Steady, Lagarde Warns of Persistent Core Inflation", summary: "The European Central Bank maintained its benchmark rate at 3.65%, citing sticky services inflation despite weakening manufacturing data.", category: "Central Banks", time: "15 min ago", region: "EU", impact: "HIGH", sentiment: "NEUTRAL" },
  { id: "n3", source: "NUR Finance", sourceColor: "#cc0000", headline: "BIST 100 Breaks 11,000 Barrier on Foreign Inflows", summary: "Borsa Istanbul surged past the psychological 11,000 level as international fund managers increased allocations to Turkish equities.", category: "Equities", time: "28 min ago", region: "TR", impact: "MEDIUM", sentiment: "BULLISH" },
  { id: "n4", source: "FT", sourceColor: "#fcd0b0", headline: "China PBoC Injects $142B via Reverse Repo to Stabilize Yuan", summary: "People's Bank of China conducted its largest single-day open market operation this year, injecting liquidity as the yuan tested 7.15 against the dollar.", category: "FX & Rates", time: "45 min ago", region: "CN", impact: "HIGH", sentiment: "BEARISH" },
  { id: "n5", source: "Reuters", sourceColor: "#ff6600", headline: "Brent Crude Surges 3.2% on Strait of Hormuz Tensions", summary: "Oil prices jumped after reports of Iranian naval exercises near the critical shipping chokepoint, raising supply disruption fears.", category: "Commodities", time: "1 hr ago", region: "ME", impact: "HIGH", sentiment: "BULLISH" },
  { id: "n6", source: "NUR Finance", sourceColor: "#cc0000", headline: "Gold Hits Record $2,680 as Geopolitical Risk Premium Widens", summary: "Safe-haven demand pushed gold to all-time highs, with central bank buying and de-dollarization trends supporting the rally.", category: "Commodities", time: "1 hr ago", region: "GLOBAL", impact: "MEDIUM", sentiment: "BULLISH" },
  { id: "n7", source: "Bloomberg", sourceColor: "#2800d7", headline: "Nvidia Q4 Earnings Beat Estimates, Revenue Up 265% YoY", summary: "The chipmaker reported $22.1B in quarterly revenue driven by AI data center demand, surpassing analyst expectations of $20.4B.", category: "Earnings", time: "2 hr ago", region: "US", impact: "HIGH", sentiment: "BULLISH" },
  { id: "n8", source: "FT", sourceColor: "#fcd0b0", headline: "UK Autumn Budget: Reeves Announces £40B Tax Rises", summary: "Chancellor Rachel Reeves unveiled the largest tax-raising budget in a generation, targeting capital gains, employer NICs and carried interest.", category: "Fiscal Policy", time: "3 hr ago", region: "UK", impact: "MEDIUM", sentiment: "BEARISH" },
  { id: "n9", source: "Reuters", sourceColor: "#ff6600", headline: "Japan 10Y Yield Breaches 1.0% for First Time Since 2013", summary: "Bank of Japan's gradual policy normalization pushed benchmark yields higher, with implications for global bond markets.", category: "Fixed Income", time: "4 hr ago", region: "JP", impact: "HIGH", sentiment: "NEUTRAL" },
  { id: "n10", source: "NUR Finance", sourceColor: "#cc0000", headline: "Rare Earth Supply Crisis: Congo Cobalt Export Ban Rattles EV Sector", summary: "DR Congo's surprise export restrictions on cobalt sent battery metal prices surging and EV manufacturers scrambling for alternatives.", category: "Resources", time: "5 hr ago", region: "AF", impact: "HIGH", sentiment: "BEARISH" },
];

const TRENDING_TOPICS = [
  { tag: "#FedRateCut", volume: "142K posts", sentiment: "bullish" as const, change: "+340%" },
  { tag: "#NvidiaEarnings", volume: "98K posts", sentiment: "bullish" as const, change: "+890%" },
  { tag: "#GoldATH", volume: "67K posts", sentiment: "bullish" as const, change: "+210%" },
  { tag: "#OilCrisis", volume: "54K posts", sentiment: "bearish" as const, change: "+560%" },
  { tag: "#BIST100", volume: "31K posts", sentiment: "bullish" as const, change: "+180%" },
  { tag: "#UKBudget", volume: "28K posts", sentiment: "bearish" as const, change: "+420%" },
  { tag: "#ChinaStimulus", volume: "25K posts", sentiment: "neutral" as const, change: "+150%" },
  { tag: "#CryptoETF", volume: "22K posts", sentiment: "bullish" as const, change: "+95%" },
];

const DEMO_VIDEOS = [
  { id: "v1", title: "Morning Market Briefing — Global Macro Overview", channel: "NUR Finance", duration: "12:34", views: "24K", time: "2 hr ago", category: "Macro" },
  { id: "v2", title: "Fed Rate Decision Analysis: What It Means for Markets", channel: "NUR Finance", duration: "18:22", views: "56K", time: "5 hr ago", category: "Central Banks" },
  { id: "v3", title: "Technical Analysis: S&P 500 Breakout Levels", channel: "NUR Finance", duration: "8:45", views: "18K", time: "8 hr ago", category: "Technical" },
  { id: "v4", title: "Nvidia Earnings Deep Dive — AI Capex Cycle", channel: "NUR Finance", duration: "22:10", views: "89K", time: "12 hr ago", category: "Earnings" },
  { id: "v5", title: "Commodities Weekly: Oil, Gold & Rare Earths", channel: "NUR Finance", duration: "15:08", views: "12K", time: "1 day ago", category: "Commodities" },
  { id: "v6", title: "BIST 100 & Turkish Markets — Foreign Flow Analysis", channel: "NUR Finance", duration: "14:20", views: "9K", time: "1 day ago", category: "Equities" },
  { id: "v7", title: "FX Strategy: EUR/USD, USD/TRY, GBP/USD Outlook", channel: "NUR Finance", duration: "11:55", views: "15K", time: "2 days ago", category: "FX" },
  { id: "v8", title: "Geopolitical Risk Monitor — Middle East & Energy", channel: "NUR Finance", duration: "19:30", views: "31K", time: "2 days ago", category: "Geopolitics" },
];

const RESEARCH_REPORTS = [
  { id: "r1", title: "Global Macro Outlook Q1 2027", author: "NUR Research", date: "Nov 2026", pages: 48, category: "Macro", access: "Professional" },
  { id: "r2", title: "Turkey Equity Strategy: BIST 100 Fair Value Model", author: "NUR Research", date: "Nov 2026", pages: 32, category: "Equities", access: "Professional" },
  { id: "r3", title: "Critical Minerals Supply Chain Risk Assessment", author: "NUR Intelligence", date: "Oct 2026", pages: 56, category: "Resources", access: "Institutional" },
  { id: "r4", title: "Central Bank Policy Tracker — G20 Rate Monitor", author: "NUR Research", date: "Nov 2026", pages: 24, category: "Fixed Income", access: "Retail" },
  { id: "r5", title: "AI & Semiconductor Sector Deep Dive", author: "NUR Research", date: "Oct 2026", pages: 40, category: "Technology", access: "Professional" },
  { id: "r6", title: "Sovereign Debt Risk Monitor — EM Focus", author: "NUR Intelligence", date: "Oct 2026", pages: 36, category: "Credit", access: "Institutional" },
];

const GLOBE_HEADLINES_BY_TAB: Record<MediaTab, string[]> = {
  "news-wire": [
    "FED: Rate cut signals boost equities",
    "BRENT: Strait of Hormuz tensions +3.2%",
    "GOLD: Record $2,680 on safe-haven demand",
    "BIST: Foreign inflows push past 11,000",
    "CONGO: Cobalt export ban hits EV sector",
  ],
  social: [
    "#FedRateCut trending: 142K posts",
    "#NvidiaEarnings beats estimates +265% YoY",
    "#GoldATH safe-haven demand surges",
    "#OilCrisis Hormuz tensions escalate",
    "#BIST100 foreign investor flows +180%",
  ],
  video: [
    "NUR TV: Morning Market Briefing LIVE",
    "Fed Decision Analysis — 56K views",
    "Nvidia AI Capex Deep Dive trending",
    "Commodities Weekly: Oil, Gold, REE",
    "BIST & Turkish Markets flow analysis",
  ],
  "live-broadcast": [
    "LIVE: Global Markets Opening Bell",
    "LIVE: Asia-Pacific Session Wrap",
    "LIVE: European Trading Desk",
    "LIVE: NY Session Pre-Market Brief",
    "LIVE: Closing Bell & After Hours",
  ],
  research: [
    "NEW: Global Macro Outlook Q1 2027",
    "Turkey Equity Strategy published",
    "Critical Minerals risk assessment",
    "G20 Rate Monitor updated",
    "Sovereign Debt EM Focus released",
  ],
};

function ImpactBadge({ impact }: { impact: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors = { HIGH: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" }, MEDIUM: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" }, LOW: { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" } };
  const c = colors[impact];
  return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: c.bg, color: c.text }}>{impact}</span>;
}

function SentimentIcon({ sentiment }: { sentiment: "BULLISH" | "BEARISH" | "NEUTRAL" }) {
  if (sentiment === "BULLISH") return <BullIcon size={12} />;
  if (sentiment === "BEARISH") return <BearIcon size={12} />;
  return <span className="text-[10px] text-slate-400">—</span>;
}

function VoiceButton({ text, lang = "en-US" }: { text: string; lang?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const handleClick = useCallback(() => {
    if (speaking) {
      hdVoiceEngine.stop();
      setSpeaking(false);
    } else {
      hdVoiceEngine.speak(text, lang, () => setSpeaking(true), () => setSpeaking(false), () => setSpeaking(false));
    }
  }, [text, lang, speaking]);
  return (
    <button onClick={handleClick} className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all shrink-0"
      style={{ background: speaking ? "rgba(239,68,68,0.15)" : "rgba(0,212,170,0.08)", color: speaking ? "#ef4444" : "#00d4aa", border: `1px solid ${speaking ? "rgba(239,68,68,0.3)" : "rgba(0,212,170,0.2)"}` }}>
      {speaking ? "■ STOP" : "🔊 LISTEN"}
    </button>
  );
}

export default function MediaPanel() {
  const { openFloatingWindow } = useIDEStore();
  const [activeTab, setActiveTab] = useState<MediaTab>("news-wire");
  const [newsFilter, setNewsFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [broadcastLang, setBroadcastLang] = useState(BROADCAST_LANGUAGES[0]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSegment, setBroadcastSegment] = useState<string>("opening");
  const broadcastRef = useRef<boolean>(false);

  const categories = useMemo(() => {
    const cats = new Set(DEMO_NEWS.map((n) => n.category));
    return ["ALL", ...Array.from(cats)];
  }, []);

  const filteredNews = useMemo(() => {
    return DEMO_NEWS.filter((n) => {
      if (newsFilter !== "ALL" && n.category !== newsFilter) return false;
      if (searchQuery && !n.headline.toLowerCase().includes(searchQuery.toLowerCase()) && !n.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [newsFilter, searchQuery]);

  const globeHeadlines = GLOBE_HEADLINES_BY_TAB[activeTab];

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ background: "#070b14", color: "#e2e8f0" }}>
      <NFWatermark />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style={{ borderColor: "rgba(0,212,170,0.15)", background: "#0a0f1a" }}>
        <div className="flex items-center gap-3">
          <EagleCrest size={28} />
          <div>
            <h1 className="text-sm font-bold tracking-wide" style={{ color: "#00d4aa" }}>NUR FINANCIAL MEDIA</h1>
            <p className="text-[9px] font-mono" style={{ color: "#4a6080" }}>Real-Time Financial News, Analysis & Broadcast</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
            ● LIVE FEED
          </span>
          <button
            onClick={() => openFloatingWindow("media", "NUR Financial Media")}
            className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
          >
            ⤢ DETACH
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b shrink-0 overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#090d16" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { cyberSound.playClick(); setActiveTab(tab.id); }}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-all shrink-0"
              style={{
                background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
                border: `1px solid ${isActive ? "rgba(0,212,170,0.4)" : "transparent"}`,
                color: isActive ? "#00d4aa" : "#6b7a8d",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* NEWS WIRE */}
          {activeTab === "news-wire" && (
            <div className="space-y-3 max-w-[1200px]">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="px-3 py-1.5 rounded-md text-xs bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00d4aa]/50 w-56"
                />
                <div className="flex gap-1 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewsFilter(cat)}
                      className="px-2 py-1 rounded text-[10px] font-mono transition-all"
                      style={{
                        background: newsFilter === cat ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${newsFilter === cat ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: newsFilter === cat ? "#00d4aa" : "#6b7a8d",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* News items */}
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border transition-all hover:border-[rgba(0,212,170,0.3)] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${item.sourceColor}20`, color: item.sourceColor }}>{item.source}</span>
                        <span className="text-[9px] font-mono" style={{ color: "#4a6080" }}>{item.category}</span>
                        <ImpactBadge impact={item.impact} />
                        <SentimentIcon sentiment={item.sentiment} />
                        <VoiceButton text={`${item.headline}. ${item.summary}`} />
                        <span className="text-[9px] font-mono ml-auto shrink-0" style={{ color: "#4a6080" }}>{item.time}</span>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug mb-1">{item.headline}</h3>
                      <p className="text-[11px] leading-relaxed" style={{ color: "#8899a6" }}>{item.summary}</p>
                    </div>
                    <span className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.08)", color: "#4a6080" }}>{item.region}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SOCIAL & TRENDING */}
          {activeTab === "social" && (
            <div className="space-y-4 max-w-[1200px]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "#4a6080" }}>Trending Financial Topics</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TRENDING_TOPICS.map((topic) => (
                  <div
                    key={topic.tag}
                    className="p-3 rounded-lg border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold" style={{ color: topic.sentiment === "bullish" ? "#22c55e" : topic.sentiment === "bearish" ? "#ef4444" : "#94a3b8" }}>
                        {topic.tag}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: "#00d4aa" }}>{topic.change}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono" style={{ color: "#6b7a8d" }}>{topic.volume}</span>
                      {topic.sentiment === "bullish" ? <BullIcon size={11} /> : topic.sentiment === "bearish" ? <BearIcon size={11} /> : null}
                      <span className="text-[9px] font-mono uppercase" style={{ color: topic.sentiment === "bullish" ? "#22c55e" : topic.sentiment === "bearish" ? "#ef4444" : "#94a3b8" }}>{topic.sentiment}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mt-6 mb-2" style={{ color: "#4a6080" }}>Social Media Sources</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "StockTwits", icon: "💬", followers: "2.4M", status: "Connected" },
                  { name: "X / Twitter", icon: "𝕏", followers: "890K", status: "Connected" },
                  { name: "Reddit", icon: "🔴", followers: "1.2M", status: "Connected" },
                  { name: "LinkedIn", icon: "💼", followers: "340K", status: "Pending" },
                ].map((src) => (
                  <div key={src.name} className="p-3 rounded-lg border text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-xl mb-1">{src.icon}</div>
                    <div className="text-xs font-bold text-white">{src.name}</div>
                    <div className="text-[9px] font-mono" style={{ color: "#6b7a8d" }}>{src.followers} followers</div>
                    <div className="text-[9px] font-mono mt-1" style={{ color: src.status === "Connected" ? "#22c55e" : "#f59e0b" }}>{src.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO & YOUTUBE */}
          {activeTab === "video" && (
            <div className="space-y-3 max-w-[1200px]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "#4a6080" }}>NUR Finance Video Content</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEMO_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="p-3 rounded-lg border hover:border-[rgba(0,212,170,0.3)] transition-all cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    {/* Thumbnail placeholder */}
                    <div className="aspect-video rounded-md mb-2 flex items-center justify-center relative overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(204,0,0,0.9)" }}>
                          <svg width="16" height="16" viewBox="0 0 10 12" fill="white"><path d="M0 0 L10 6 L0 12 Z" /></svg>
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white">{video.duration}</span>
                      <span className="absolute top-1 left-1 text-[8px] font-mono px-1 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.2)", color: "#00d4aa" }}>{video.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug mb-1">{video.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono" style={{ color: "#cc0000" }}>{video.channel}</span>
                      <span className="text-[9px] font-mono" style={{ color: "#6b7a8d" }}>{video.views} views · {video.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE BROADCAST */}
          {activeTab === "live-broadcast" && (
            <div className="space-y-4 max-w-[1200px]">
              {/* Language selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: "#4a6080" }}>Broadcast Language:</span>
                {BROADCAST_LANGUAGES.map((lang) => (
                  <button key={lang.id} onClick={() => { setBroadcastLang(lang); hdVoiceEngine.stop(); setIsBroadcasting(false); }}
                    className="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
                    style={{ background: broadcastLang.id === lang.id ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${broadcastLang.id === lang.id ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.06)"}`, color: broadcastLang.id === lang.id ? "#00d4aa" : "#6b7a8d" }}>
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>

              {/* Main broadcast window */}
              <div className="rounded-xl border overflow-hidden relative" style={{ background: "#000", borderColor: isBroadcasting ? "rgba(204,0,0,0.5)" : "rgba(204,0,0,0.2)" }}>
                <div className="aspect-video flex flex-col items-center justify-center gap-3 relative">
                  <EagleCrest size={48} />
                  <span className="text-sm font-bold" style={{ color: "#cc0000" }}>NUR FINANCE TV — {broadcastLang.city.toUpperCase()} DESK</span>
                  <span className="text-xs font-mono" style={{ color: "#6b7a8d" }}>
                    {isBroadcasting ? `Broadcasting: ${broadcastSegment.toUpperCase()} segment` : "Press BROADCAST to start neural voice narration"}
                  </span>

                  {/* Broadcast controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => {
                        if (isBroadcasting) {
                          hdVoiceEngine.stop();
                          setIsBroadcasting(false);
                          broadcastRef.current = false;
                        } else {
                          setIsBroadcasting(true);
                          broadcastRef.current = true;
                          const segments = ["opening", "macro", "quant", "breaking", "closing"];
                          let idx = 0;
                          const playNext = () => {
                            if (!broadcastRef.current || idx >= segments.length) {
                              setIsBroadcasting(false);
                              broadcastRef.current = false;
                              return;
                            }
                            const seg = segments[idx];
                            setBroadcastSegment(seg);
                            const script = broadcastLang.scripts[seg] || "";
                            hdVoiceEngine.speak(script, broadcastLang.langCode, undefined, () => { idx++; setTimeout(playNext, 800); }, () => { idx++; setTimeout(playNext, 800); });
                          };
                          playNext();
                        }
                      }}
                      className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: isBroadcasting ? "rgba(239,68,68,0.9)" : "rgba(204,0,0,0.9)",
                        color: "white",
                        boxShadow: isBroadcasting ? "0 0 20px rgba(239,68,68,0.3)" : "0 0 20px rgba(204,0,0,0.3)",
                      }}>
                      {isBroadcasting ? "■ STOP BROADCAST" : "● START BROADCAST"}
                    </button>
                  </div>

                  {/* Live indicator */}
                  {isBroadcasting && (
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">● LIVE</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "#00d4aa" }}>
                        {broadcastLang.flag} {broadcastLang.name} Neural HD Voice
                      </span>
                    </div>
                  )}
                </div>

                {/* Scrolling headlines ticker */}
                <div className="px-4 py-2 border-t flex items-center gap-4 overflow-hidden" style={{ borderColor: "rgba(204,0,0,0.2)", background: "rgba(204,0,0,0.05)" }}>
                  <span className="text-[9px] font-mono font-bold shrink-0" style={{ color: "#cc0000" }}>HEADLINES:</span>
                  <div className="flex items-center gap-6 text-[10px] font-mono" style={{ color: "#8899a6" }}>
                    {broadcastLang.headlines.map((h, i) => (
                      <span key={i} className="shrink-0">{h}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Segment quick-play buttons */}
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1" style={{ color: "#4a6080" }}>Quick Play Segments</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(broadcastLang.scripts).map(([key, script]) => (
                  <button key={key}
                    onClick={() => {
                      setBroadcastSegment(key);
                      hdVoiceEngine.speak(script, broadcastLang.langCode, () => setIsBroadcasting(true), () => setIsBroadcasting(false));
                    }}
                    className="p-2.5 rounded-lg border text-left transition-all hover:border-[rgba(0,212,170,0.3)]"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[10px] font-mono font-bold text-white capitalize mb-0.5">{key.replace("_", " ")}</div>
                    <div className="text-[9px] font-mono line-clamp-2" style={{ color: "#6b7a8d" }}>{script.substring(0, 80)}...</div>
                  </button>
                ))}
              </div>

              {/* Channel selector */}
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mt-4 mb-1" style={{ color: "#4a6080" }}>NUR Finance Live Channels</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: "Global Markets", lang: "EN", flag: "🌍", status: "LIVE" },
                  { name: "Europe Desk", lang: "EN/DE", flag: "🇪🇺", status: "LIVE" },
                  { name: "Asia-Pacific", lang: "EN", flag: "🌏", status: "NEXT: 02:00 UTC" },
                  { name: "Turkey & MENA", lang: "TR/AR", flag: "🇹🇷", status: "LIVE" },
                  { name: "Americas", lang: "EN/ES", flag: "🌎", status: "LIVE" },
                  { name: "Commodities", lang: "EN", flag: "🛢️", status: "NEXT: 08:00 UTC" },
                  { name: "FX & Rates", lang: "EN", flag: "💱", status: "LIVE" },
                  { name: "Tech & Innovation", lang: "EN", flag: "🔬", status: "NEXT: 14:00 UTC" },
                ].map((ch) => (
                  <button key={ch.name}
                    className="p-2.5 rounded-lg border text-left transition-all hover:border-[rgba(0,212,170,0.3)]"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{ch.flag}</span>
                      <span className="text-xs font-bold text-white">{ch.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono" style={{ color: "#6b7a8d" }}>{ch.lang}</span>
                      <span className="text-[9px] font-mono" style={{ color: ch.status === "LIVE" ? "#22c55e" : "#f59e0b" }}>{ch.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESEARCH & REPORTS */}
          {activeTab === "research" && (
            <div className="space-y-3 max-w-[1200px]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "#4a6080" }}>Institutional Research & Reports</div>
              {RESEARCH_REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg border hover:border-[rgba(0,212,170,0.3)] transition-all cursor-pointer flex items-center justify-between gap-3"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa" }}>{report.category}</span>
                      <span className="text-[9px] font-mono" style={{ color: "#6b7a8d" }}>{report.date} · {report.pages} pages</span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{report.title}</h3>
                    <span className="text-[9px] font-mono" style={{ color: "#6b7a8d" }}>by {report.author}</span>
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold px-2 py-1 rounded shrink-0"
                    style={{
                      background: report.access === "Retail" ? "rgba(34,197,94,0.1)" : report.access === "Professional" ? "rgba(245,158,11,0.1)" : "rgba(0,240,255,0.1)",
                      color: report.access === "Retail" ? "#22c55e" : report.access === "Professional" ? "#f59e0b" : "#00f0ff",
                      border: `1px solid ${report.access === "Retail" ? "rgba(34,197,94,0.3)" : report.access === "Professional" ? "rgba(245,158,11,0.3)" : "rgba(0,240,255,0.3)"}`,
                    }}
                  >
                    {report.access.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar: Globe + Market Ticker */}
        <div className="hidden lg:flex flex-col w-[280px] shrink-0 border-l p-3 gap-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          <GlobeWidget
            title="NEWS MAP"
            headlines={globeHeadlines}
          />

          {/* Live market ticker */}
          <div className="flex-1 overflow-y-auto space-y-1.5">
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: "#4a6080" }}>Market Snapshot</div>
            {[
              { s: "S&P 500", p: "5,864.20", c: "+0.92%", up: true },
              { s: "NASDAQ", p: "20,418.50", c: "+1.35%", up: true },
              { s: "BIST 100", p: "10,240.80", c: "+2.14%", up: true },
              { s: "DAX 40", p: "19,120.40", c: "+0.64%", up: true },
              { s: "Nikkei", p: "36,581.70", c: "-0.85%", up: false },
              { s: "BRENT", p: "$82.40", c: "+3.20%", up: true },
              { s: "GOLD", p: "$2,680.50", c: "+1.42%", up: true },
              { s: "EUR/USD", p: "1.1080", c: "+0.12%", up: true },
              { s: "USD/TRY", p: "34.05", c: "-0.08%", up: false },
              { s: "BTC", p: "$68,450", c: "+3.15%", up: true },
            ].map((m) => (
              <div key={m.s} className="flex items-center justify-between py-1 px-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-[10px] font-mono" style={{ color: "#8899a6" }}>{m.s}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-white">{m.p}</span>
                  <span className="text-[10px] font-mono flex items-center gap-0.5" style={{ color: m.up ? "#22c55e" : "#ef4444" }}>
                    {m.up ? <BullIcon size={9} /> : <BearIcon size={9} />}
                    {m.c}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
