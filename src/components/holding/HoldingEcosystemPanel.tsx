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
    badge: "BETTING & RISK CONVERSION",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    targetDemographic: "Individuals with Global Betting, Sports Wagering and Gambling Habits",
    hookMechanism: "Familiar Live Betting, Odds Ladder & High-Speed Crash UI",
    conversionFunnel: "Tatar AI Guardian: Converts -EV (House Advantage) bankruptcy simulation to +EV Quant Options and Kelly Portfolio growth.",
    activeStatus: "OPERATIONAL",
    icon: "🎲",
    metrics: { estLTV: "$28,500", targetReach: "120M+ Global", conversionRate: "4.8%" },
  },
  {
    id: "nur-game",
    name: "NUR Game",
    badge: "YOUTH & CULTURAL STRATEGY",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    targetDemographic: "Ages 16–17 Youth, Gamers and Competitive Players",
    hookMechanism: "Ottoman Conquest Strategy (AoE/Mount&Blade style), Tactical FPS and Treasury Campaigns",
    conversionFunnel: "Stealth Finance Economy: Mint, war bonds, supply-demand arbitrage and promotion from Treasury to NUR Finance.",
    activeStatus: "OPERATIONAL",
    icon: "🎮",
    metrics: { estLTV: "Lifetime (LTV)", targetReach: "450M+ Youth", conversionRate: "8.2%" },
  },
  {
    id: "nur-dating",
    name: "NUR Dating (Shadow Network)",
    badge: "SOCIAL MEDIA & LIFESTYLE",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    targetDemographic: "Audience Seeking Dating, Marriage and the Right Partner on Social Media",
    hookMechanism: "Hyper-Realistic AI Female/Male Influencer Network & One-on-One DM Relationship Counseling",
    conversionFunnel: "Relationship + Financial Maturity Bridge: Directing to NUR Finance by instilling 'A partner who manages assets instead of gambling is attractive.'",
    activeStatus: "OPERATIONAL",
    icon: "🌹",
    metrics: { estLTV: "$15,200", targetReach: "800M+ Social", conversionRate: "3.4%" },
  },
  {
    id: "nur-ai-studio",
    name: "NUR AI Studio",
    badge: "MEDIA & VIRAL CONTENT",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    targetDemographic: "Merchants, E-Commerce Operators, Consultants and Content Creators",
    hookMechanism: "News Anchor Avatar Video in Luxury Wall Street Glass Office + Audio Mastering (3–5 Free Daily)",
    conversionFunnel: "Business Growth Academy: Entrepreneur growing their business and revenue with videos brings their expanding capital to the NUR Finance Terminal.",
    activeStatus: "OPERATIONAL",
    icon: "🎬",
    metrics: { estLTV: "$42,000", targetReach: "65M+ Business Owners", conversionRate: "6.1%" },
  },
  {
    id: "nur-comm-pro",
    name: "NUR Comm Pro",
    badge: "UNIFIED COMMUNICATIONS",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    targetDemographic: "Corporate Executives, Freelancers and SMEs",
    hookMechanism: "Email, WhatsApp, Telegram, Messenger in One Unified Inbox + AI Smart Secretary",
    conversionFunnel: "Contextual Treasury Advisor: Connects the company's cash flow to NUR Finance treasury models while reading incoming invoices and collections.",
    activeStatus: "OPERATIONAL",
    icon: "📬",
    metrics: { estLTV: "$95,000", targetReach: "200M+ Companies", conversionRate: "9.5%" },
  },
  {
    id: "ghostvault-cyber",
    name: "GhostVault CyberSecurity",
    badge: "CYBERSECURITY & PRIVACY",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    targetDemographic: "Privacy-focused High-income Users Seeking Zero Digital Footprint",
    hookMechanism: "Zero-Trace Sandbox, Secure DNS, One-Click Nuclear Wipe + Integrated TV Station",
    conversionFunnel: "Opportunity Cost (15-sec Wake): Natural promotion via 3D display — 'If you had bought AAPL 2 years ago instead of spending time here, your vault would be $18K.'",
    activeStatus: "INCUBATING",
    icon: "🛡️",
    metrics: { estLTV: "$33,000", targetReach: "1.2B+ Users", conversionRate: "2.9%" },
  },
  {
    id: "nur-legacy",
    name: "NUR Legacy",
    badge: "LEADERSHIP & YOUTH MANAGEMENT",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    targetDemographic: "Families Raising Future Entrepreneurs and Independent Young Leaders",
    hookMechanism: "40-Min Daily Disciplined Play & Global Company Management Simulation",
    conversionFunnel: "Real Company/Holding Management & Career Roadmap (Mining, Energy, Finance, Technology) for €255/mo instead of traditional education.",
    activeStatus: "OPERATIONAL",
    icon: "👑",
    metrics: { estLTV: "$36,000", targetReach: "180M+ Families", conversionRate: "7.4%" },
  },
];

const EXPANSION_SLOTS = [
  { slotNumber: 7, codeName: "EXP-SLOT-07", category: "Cultural & Regional Growth Engine", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 8, codeName: "EXP-SLOT-08", category: "Autonomous B2B Supplier & Arbitrage Network", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 9, codeName: "EXP-SLOT-09", category: "Algorithmic Micro-Learning & Children's Academy", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 10, codeName: "EXP-SLOT-10", category: "Global Energy & Commodity Community Hub", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 11, codeName: "EXP-SLOT-11", category: "AI Real Estate & Rental Yield Converter", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 12, codeName: "EXP-SLOT-12", category: "Global Travel & Luxury Asset Network", status: "RESERVED / READY FOR SPEC" },
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
              All Works, Intellectual Property and Client Acquisition Subsidiaries are the Property of Umay Gül Nur.
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
            🏛️ 7 Growth Arms
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
            ⚡ Future Module Slots (+N)
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
                <div className="text-[11px] text-[var(--ag-muted)]">Total Potential Audience Reach</div>
                <div className="text-xl font-bold font-mono text-[var(--ag-accent)] mt-1">2.8 Billion+</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">7 Independent Growth Engines</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">NUR Finance Ultimate Conversion</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">Elite Portfolio Pool</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">Discipline & +EV Filtered</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Intellectual Property & Patents</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">10 Registered Inventions</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">PATENTS_AND_IP.md</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Holding Asset Owner</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">Umay Gül Nur</div>
                <div className="text-[10px] text-cyan-400/80 mt-0.5">Perpetual Ownership Declaration</div>
              </div>
            </div>

            {/* Growth Pillars Grid */}
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
                    <span>🎲 Tatar Finans — Global Risk, Casino & Exchange Conversion Arena</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold">
                      100% INTERNAL TREASURY RECONCILIATION
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Crash, Roulette, 21, Plinko and betting engine. House earnings are transferred to the stock portfolio; users are directed to +EV stock positions.
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
                    <span>🎬 NUR AI Studio — Luxury Wall Street News Anchor & Audio Mastering</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      3–5 FREE VIDEOS DAILY
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Users upload their videos, converted to luxury office anchor news videos and grow their business.
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
                    <span>🚀 NUR Finance AntiGravi Terminal & Quantitative Management</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      LIVE & OPERATIONAL
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    OMS/EMS L2 DOM Ladder, AI Quant Copilot (WISH), Live HUD Risk Drawer and Anonymous Web3 Wallet Gateway active.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("oms-ems")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black shrink-0 transition-all shadow-md shadow-[rgba(0,212,170,0.2)]"
                >
                  Switch to Institutional Terminal &rarr;
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
                    <p className="text-xs text-[var(--ag-muted)]">Live Market Analysis with 12 Regional Studios & 30 AI Anchors</p>
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
                    <span className="text-[10px] text-red-400 font-mono font-bold">&bull; LIVE</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-3 py-1 rounded border border-white/10">
                    <span className="text-[var(--ag-muted)]">STUDIO:</span>
                    <span className="text-white font-bold">MANHATTAN HQ & ISTANBUL DESK</span>
                  </div>
                </div>

                {/* Central Broadcast Anchor Hologram Frame */}
                <div className="self-center text-center z-10 my-auto">
                  <EagleCrest size={64} className="mx-auto mb-3 opacity-90" />
                  <h3 className="text-lg font-bold text-white tracking-wider">NUR FINANCE BROADCAST NETWORK</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-1">Global Interest Rates, Macro Liquidity and Exchange Opening Brief</p>
                  <div className="mt-4 max-w-md mx-auto">
                    <AudioSpectrumVisualizer isPlaying={true} barColor="var(--ag-accent)" height={28} />
                  </div>
                </div>

                {/* Breaking Chyron Ticker Bar */}
                <div className="z-10 bg-black/80 backdrop-blur border border-red-500/40 rounded p-2.5 flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0 animate-pulse">
                    BREAKING
                  </span>
                  <div className="text-xs font-mono text-white overflow-hidden whitespace-nowrap">
                    FED RATE EXPECTATIONS HELD STEADY &bull; SPX 500 HITS NEW HIGH &bull; BIST 100 STRONG BUYING &bull; GOLD AND COMMODITY ARBITRAGE REGIME ACTIVE &bull; NUR FINANCE V3.0 PRO LIVE
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveView("broadcast-studio")}
                  className="px-4 py-2 rounded text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Go to Teleprompter & Studio Panel &rarr;
                </button>
                <button
                  onClick={() => setActiveView("live-tv")}
                  className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/30"
                >
                  Open Live Broadcast Screen &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "slots" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-lg border bg-amber-950/20 border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                <span>⚡ Future Growth & Client Acquisition Module Slots</span>
              </h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                The NUR Finance Holding architecture has an open and modular slot structure that can immediately plug in and run the hundreds of new client acquisition techniques and subsidiary models you add.
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
                      Will be plugged into this slot as soon as a new client acquisition strategy and AI agent is defined.
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
