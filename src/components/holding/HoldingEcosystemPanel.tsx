"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

interface GrowthPillar {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  targetDemographic: string;
  hookMechanism: string;
  conversionFunnel: string;
  activeStatus: "OPERATIONAL" | "INCUBATING" | "RESERVED_SLOT";
  icon: string;
  metrics: {
    estLTV: string;
    targetReach: string;
    conversionRate: string;
  };
}

const CORE_PILLARS: GrowthPillar[] = [
  {
    id: "tatar-finans",
    name: "Tatar Finans",
    badge: "QUANTITATIVE RISK CONVERSION",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    targetDemographic: "Global Speculative Traders, Probability Gamblers & High-Stakes Risk Takers",
    hookMechanism: "Live Odds Matrix, Probability Staircase & High-Speed Crash Volatility Engine",
    conversionFunnel: "Tatar AI Guardian: Converts negative expected value (-EV) risk behavior into positive expected value (+EV) Quantitative Options & Kelly Portfolio expansion.",
    activeStatus: "OPERATIONAL",
    icon: "🎲",
    metrics: { estLTV: "$28,500", targetReach: "120M+ Global", conversionRate: "4.8%" },
  },
  {
    id: "nur-game",
    name: "NUR Game",
    badge: "YOUTH STRATEGY & CULTURE",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    targetDemographic: "Competitive Gamers, Strategy Enthusiasts and Next-Gen Quant Minds",
    hookMechanism: "Grand Empire Strategy (AoE/Mount&Blade style), Tactical Strategy & Treasury Expeditions",
    conversionFunnel: "Stealth Finance Economy: Sovereign minting, war bonds, supply-demand arbitrage, and graduation directly into NUR Finance Terminal.",
    activeStatus: "OPERATIONAL",
    icon: "🎮",
    metrics: { estLTV: "Lifetime (LTV)", targetReach: "450M+ Youth", conversionRate: "8.2%" },
  },
  {
    id: "nur-dating",
    name: "NUR Dating (Shadow Network)",
    badge: "SOCIAL CAPITAL & LIFESTYLE",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    targetDemographic: "Affluent Professionals Seeking Long-Term High-Value Partners",
    hookMechanism: "Hyper-Realistic AI Matchmaking & 1-on-1 High-Value Relationship Advisory",
    conversionFunnel: "Financial Maturity Bridge: Cultivates asset-building mindset and directs high-net-worth capital to NUR Finance wealth management.",
    activeStatus: "OPERATIONAL",
    icon: "🌹",
    metrics: { estLTV: "$15,200", targetReach: "800M+ Social", conversionRate: "3.4%" },
  },
  {
    id: "nur-ai-studio",
    name: "NUR AI Studio",
    badge: "MEDIA & VIRAL BROADCAST",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    targetDemographic: "Entrepreneurs, E-Commerce Operators, Consultants & Global Creators",
    hookMechanism: "Wall Street Glass Office AI News Anchor Video & Audio Mastering Suite",
    conversionFunnel: "Business Scaling Academy: Converts revenue generated through automated video into active capital deployed in the NUR Finance Terminal.",
    activeStatus: "OPERATIONAL",
    icon: "🎬",
    metrics: { estLTV: "$42,000", targetReach: "65M+ Businesses", conversionRate: "6.1%" },
  },
  {
    id: "nur-comm-pro",
    name: "NUR Comm Pro",
    badge: "UNIFIED ENTERPRISE COMMS",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    targetDemographic: "Corporate Executives, High-Frequency Freelancers & Global SMEs",
    hookMechanism: "Single Unified Inbox across Email, WhatsApp, Telegram with AI Executive Assistant",
    conversionFunnel: "Contextual Treasury Advisor: Automatically audits incoming cash flows and connects corporate treasury directly to NUR Finance liquidity models.",
    activeStatus: "OPERATIONAL",
    icon: "📬",
    metrics: { estLTV: "$95,000", targetReach: "200M+ Enterprises", conversionRate: "9.5%" },
  },
  {
    id: "ghostvault-cyber",
    name: "GhostVault CyberSecurity",
    badge: "CYBER DEFENSE & ZERO-TRACE",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    targetDemographic: "Privacy-Conscious High-Net-Worth Individuals & Sovereign Institutions",
    hookMechanism: "Zero-Trace Sandbox, Hardened DNS, 1-Click Nuclear Wipe + Integrated Defense Broadcast",
    conversionFunnel: "Opportunity Cost Awakening Engine: Demonstrates the power of disciplined asset allocation while securing enterprise data.",
    activeStatus: "INCUBATING",
    icon: "🛡️",
    metrics: { estLTV: "$33,000", targetReach: "1.2B+ Users", conversionRate: "2.9%" },
  },
  {
    id: "nur-legacy",
    name: "NUR Legacy",
    badge: "LEADERSHIP & NEXT-GEN ACADEMY",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    targetDemographic: "Visionary Families Raising Future Entrepreneurs & Independent Leaders",
    hookMechanism: "40 min/day Disciplined Global Enterprise & Conglomerate Management Simulation",
    conversionFunnel: "Real-World Holding Management Roadmap (Mining, Energy, Finance, Tech) replacing obsolete conventional schooling.",
    activeStatus: "OPERATIONAL",
    icon: "👑",
    metrics: { estLTV: "$36,000", targetReach: "180M+ Families", conversionRate: "7.4%" },
  },
];

// Open Modular Expansion Slots (Ready for the next hundreds of client acquisition systems)
const EXPANSION_SLOTS = [
  { slotNumber: 7, codeName: "EXP-SLOT-07", category: "Cultural & Regional Growth Engine", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 8, codeName: "EXP-SLOT-08", category: "Autonomous B2B Supplier & Arbitrage Network", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 9, codeName: "EXP-SLOT-09", category: "Algorithmic Micro-Learning & Youth Academy", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 10, codeName: "EXP-SLOT-10", category: "Global Energy & Commodities Community Hub", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 11, codeName: "EXP-SLOT-11", category: "AI Real Estate & Rental Yield Converter", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 12, codeName: "EXP-SLOT-12", category: "Global Travel & Luxury Asset Syndicate", status: "RESERVED / READY FOR SPEC" },
];

export default function HoldingEcosystemPanel() {
  const { setActiveView } = useIDEStore();
  const [selectedPillar, setSelectedPillar] = useState<GrowthPillar>(CORE_PILLARS[0]);
  const [activeTab, setActiveTab] = useState<"holding" | "tv-network" | "slots">("holding");

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Master Holding Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={34} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--ag-accent)" }}>
                UMAY GÜL NUR — NUR FINANCE HOLDING
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MASTER TRUST & IP HOLDING
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              All Intellectual Property, Patents, and Client Acquisition Subsidiaries are the Perpetual Property of Umay Gül Nur.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("holding")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "holding"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            🏛️ 7 Sovereign Pillars
          </button>
          <button
            onClick={() => setActiveTab("tv-network")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "tv-network"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            📡 NUR TV Global Network
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "slots"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            ⚡ Modular Expansion Slots (+N)
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "holding" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Top Metrics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Total Reach Potential</div>
                <div className="text-xl font-bold font-mono text-[var(--ag-accent)] mt-1">2.8 Billion+</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">7 Autonomous Growth Engines</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">NUR Finance Terminal Funnel</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">Elite Capital Pool</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">Disciplined & +EV Filtered</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">IP & Patents Registered</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">10 Registered Inventions</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">PATENTS_AND_IP.md</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Holding Asset Owner</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">Umay Gül Nur</div>
                <div className="text-[10px] text-cyan-400/80 mt-0.5">Perpetual Sovereign Ownership</div>
              </div>
            </div>

            {/* 7 Core Growth Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CORE_PILLARS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPillar(p)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPillar.id === p.id
                      ? "bg-[rgba(0,212,170,0.08)] border-[var(--ag-accent)] shadow-lg shadow-[rgba(0,212,170,0.1)]"
                      : "bg-black/30 border-[var(--ag-border)] opacity-85 hover:opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{p.icon}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-[var(--ag-muted)] mb-3 leading-relaxed">{p.targetDemographic}</p>
                    <div className="text-[11px] font-medium text-emerald-400 mb-2">
                      <strong>Hook:</strong> {p.hookMechanism}
                    </div>
                    <div className="text-[11px] text-[var(--ag-text)] opacity-90 leading-relaxed">
                      <strong>Funnel:</strong> {p.conversionFunnel}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--ag-border)] flex items-center justify-between text-[10px] font-mono text-[var(--ag-muted)]">
                    <span>Reach: {p.metrics.targetReach}</span>
                    <span className="text-[var(--ag-accent)] font-bold">Est LTV: {p.metrics.estLTV}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Pillar Interactive Launcher */}
            {selectedPillar.id === "tatar-finans" ? (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-red-950/40 via-amber-950/20 to-black border-red-500/40 flex items-center justify-between gap-4 shadow-lg shadow-red-500/10">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span>🎲 Tatar Finans — Global Risk, Casino & Capital Market Arena</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold">
                      100% VAULT RECONCILIATION
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Crash, Roulette, Blackjack, Plinko and Probability Engine. Converts house edge into sovereign equity and directs players to +EV capital assets.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("tatar-finans")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white shrink-0 transition-all shadow-md shadow-red-600/30"
                >
                  Open Tatar Arena &rarr;
                </button>
              </div>
            ) : selectedPillar.id === "nur-ai-studio" ? (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-cyan-950/40 to-black border-cyan-500/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <span>🎬 NUR AI Studio — Wall Street Glass Office News Anchor & Audio Suite</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      DAILY FREE ALLOCATION
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Transform raw ideas and scripts into ultra-high definition broadcast news anchor video presentations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("broadcast-studio")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shrink-0 transition-all"
                >
                  Open AI Studio &rarr;
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border-[var(--ag-accent)]/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[var(--ag-accent)] flex items-center gap-2">
                    <span>🚀 NUR Finance AntiGravi Terminal & Quantitative Execution</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      LIVE & OPERATIONAL
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    OMS/EMS L2 DOM Ladder, AI Quant Copilot (WISH), Live HUD Risk Matrix, and Zero-PII Web3 Gateway active.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("oms-ems")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black shrink-0 transition-all shadow-md shadow-[rgba(0,212,170,0.2)]"
                >
                  Launch Institutional Terminal &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "tv-network" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-lg border bg-black/40 border-[var(--ag-border)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--ag-border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <div>
                    <h2 className="text-base font-bold text-white">NUR TV Global 24/7 Financial Broadcast Network</h2>
                    <p className="text-xs text-[var(--ag-muted)]">12 Regional Media Hubs & 30 AI Presenters with Real-Time Planetary Video Walls</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  LIVE SATELLITE FEED
                </span>
              </div>

              {/* TV Screen Mockup & Audio Spectrum */}
              <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-black border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/60 backdrop-blur border border-white/10">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">NUR TV GLOBAL HD</span>
                    <span className="text-[10px] text-red-400 font-mono font-bold">&bull; ON-AIR</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-3 py-1 rounded border border-white/10">
                    <span className="text-[var(--ag-muted)]">STUDIO:</span>
                    <span className="text-white font-bold">MANHATTAN HQ & LONDON DESK</span>
                  </div>
                </div>

                {/* Central Broadcast Anchor Hologram Frame */}
                <div className="self-center text-center z-10 my-auto">
                  <EagleCrest size={64} className="mx-auto mb-3 opacity-90" />
                  <h3 className="text-lg font-bold text-white tracking-wider">NUR FINANCE BROADCAST NETWORK</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-1">Global Central Banks, Macro Liquidity & Planetary Geopolitics Briefing</p>
                  <div className="mt-4 max-w-md mx-auto">
                    <AudioSpectrumVisualizer isPlaying={true} barColor="var(--ag-accent)" height={28} />
                  </div>
                </div>

                {/* Breaking Chyron Ticker Bar */}
                <div className="z-10 bg-black/80 backdrop-blur border border-red-500/40 rounded p-2.5 flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0 animate-pulse">
                    BREAKING INTEL
                  </span>
                  <div className="text-xs font-mono text-white overflow-hidden whitespace-nowrap">
                    FED POLICY RATE STEADY &bull; S&P 500 AT ALL-TIME HIGH &bull; BIST 100 SURGES &bull; GOLD & COMMODITY ARBITRAGE ACTIVE &bull; NUR FINANCE V3.0 PRO ON-AIR LIVE
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveView("broadcast-studio")}
                  className="px-4 py-2 rounded text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Teleprompter & Studio Console &rarr;
                </button>
                <button
                  onClick={() => setActiveView("live-tv")}
                  className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/30"
                >
                  Open Live Broadcast &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "slots" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-lg border bg-amber-950/20 border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                <span>⚡ Modular Growth & Client Acquisition Expansion Slots</span>
              </h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                The NUR Finance Holding architecture features an open and pluggable modular slot design, allowing hundreds of specialized customer acquisition and venture subsidiaries to be attached seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXPANSION_SLOTS.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="p-5 rounded-lg border border-dashed border-white/20 bg-black/20 flex flex-col justify-between hover:border-[var(--ag-accent)]/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{slot.codeName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--ag-muted)]">
                        SLOT #{slot.slotNumber}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{slot.category}</h4>
                    <p className="text-xs text-[var(--ag-muted)]">
                      Autonomous client acquisition strategy and AI agent will be plugged into this slot upon initialization.
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-white/10 text-[10px] font-mono text-emerald-400/80">
                    &bull; {slot.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
