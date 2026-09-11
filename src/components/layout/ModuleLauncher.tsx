"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";
import { cyberSound } from "@/lib/audio/sound-synth";

interface Module {
  id: PanelView;
  label: string;
  icon: string;
  desc: string;
  color: string;
  group: string;
  adminOnly?: boolean;
}

const MODULES: Module[] = [
  // CORE
  { id: "dashboard",         label: "Dashboard",        icon: "📊", desc: "Live markets overview",       color: "#00d4aa", group: "CORE" },
  { id: "portfolio",         label: "Portfolio",         icon: "💼", desc: "Positions & P&L tracker",     color: "#00d4aa", group: "CORE" },
  { id: "charts",            label: "Charts",            icon: "📈", desc: "Interactive price charts",    color: "#00d4aa", group: "CORE" },
  { id: "backtest",          label: "Backtest",          icon: "⏪", desc: "Strategy backtesting engine", color: "#00d4aa", group: "CORE" },

  // MARKETS
  { id: "global-markets",    label: "Global Markets",   icon: "🌍", desc: "World indices & FX",          color: "#38bdf8", group: "MARKETS" },
  { id: "economic-data",     label: "Macro",            icon: "🏦", desc: "FRED macroeconomic data",     color: "#38bdf8", group: "MARKETS" },
  { id: "fundamentals",      label: "Fundamentals",     icon: "📋", desc: "Company financials",          color: "#38bdf8", group: "MARKETS" },
  { id: "screener",          label: "Screener",         icon: "🔍", desc: "Stock & ETF screening",       color: "#38bdf8", group: "MARKETS" },
  { id: "news-feed",         label: "Live News",        icon: "📡", desc: "Real-time news stream",       color: "#38bdf8", group: "MARKETS" },
  { id: "options",           label: "Options",          icon: "⚙️", desc: "Options chain & Greeks",      color: "#38bdf8", group: "MARKETS" },

  // TRADING
  { id: "oms-ems",           label: "OMS / EMS",        icon: "⚡", desc: "Order management system",    color: "#a78bfa", group: "TRADING" },
  { id: "nur-coin",          label: "$NUR Coin",        icon: "🪙", desc: "Sovereign blockchain token",  color: "#a78bfa", group: "TRADING" },
  { id: "wallet-gateway",    label: "Web3 Wallet",      icon: "🔐", desc: "Multi-chain wallet gateway",  color: "#a78bfa", group: "TRADING" },

  // ANALYSIS
  { id: "quant-copilot",     label: "Quant Strategist", icon: "🤖", desc: "AI-powered quant signals",   color: "#f59e0b", group: "ANALYSIS" },
  { id: "macro-risk",        label: "Macro Risk",       icon: "⚠️", desc: "Systemic risk dashboard",    color: "#f59e0b", group: "ANALYSIS" },
  { id: "ai-tools",          label: "Quant Models",     icon: "🧮", desc: "ML & quantitative models",   color: "#f59e0b", group: "ANALYSIS" },
  { id: "geopolitics",       label: "NUR Earth 3D",     icon: "🌐", desc: "Geopolitical risk globe",    color: "#f59e0b", group: "ANALYSIS" },
  { id: "geophysics-resources", label: "Geophysics & Mining", icon: "⛏️", desc: "3D Geophysics natural resources map", color: "#f59e0b", group: "ANALYSIS" },
  { id: "institutional-suite", label: "Institutional ($8.5K)", icon: "🏛️", desc: "7-Pillar Sovereign Intelligence Matrix", color: "#06b6d4", group: "ANALYSIS" },
  { id: "orbital-telemetry", label: "Orbital Telemetry", icon: "🛰️", desc: "Downlink & RF Spectrum Telemetry (13·35·42·55·54751113)", color: "#00f0ff", group: "ANALYSIS" },
  { id: "professional-ai",   label: "Professional AI",  icon: "🩺", desc: "Medical, engineering, legal & education AI", color: "#10b981", group: "ANALYSIS" },
  { id: "data-ingest",       label: "Data Ingest",      icon: "📥", desc: "Pipeline & data ingestion",  color: "#f59e0b", group: "ANALYSIS" },
  { id: "encyclopedia",      label: "Wiki",             icon: "📚", desc: "Financial encyclopedia",     color: "#f59e0b", group: "ANALYSIS" },

  // MEDIA & NFS
  { id: "live-tv",           label: "NUR TV",           icon: "📺", desc: "24/7 broadcast channel",     color: "#e879f9", group: "MEDIA" },
  { id: "broadcast-studio",  label: "Studio",           icon: "🎬", desc: "AI video production studio", color: "#e879f9", group: "MEDIA" },
  { id: "terminal",          label: "NUR Terminal",     icon: "💻", desc: "Sovereign CLI terminal",     color: "#e879f9", group: "MEDIA" },
  { id: "news",              label: "Briefs",           icon: "📰", desc: "Market intelligence briefs", color: "#e879f9", group: "MEDIA" },
  { id: "alerts",            label: "Alerts",           icon: "🔔", desc: "HUD risk alert system",      color: "#e879f9", group: "MEDIA" },
  { id: "research",          label: "Research",         icon: "🔬", desc: "Deep-dive research reports", color: "#e879f9", group: "MEDIA" },
  { id: "pricing",           label: "Plans",            icon: "💎", desc: "Subscription tiers",         color: "#e879f9", group: "MEDIA" },
  { id: "verification-portal", label: "VIP Verify",    icon: "✅", desc: "On-chain payment verify",    color: "#e879f9", group: "MEDIA" },

  // SOCIAL / EDUCATION
  { id: "professional-social", label: "Sovereign Social", icon: "👥", desc: "Closed-loop professional financial network", color: "#a855f7", group: "SOCIAL" },
  { id: "nur-education",     label: "Education",        icon: "🎓", desc: "Financial education hub",    color: "#34d399", group: "SOCIAL" },
  { id: "nur-kids",          label: "Nur Kids",         icon: "👨‍👩‍👧", desc: "Family finance platform",   color: "#34d399", group: "SOCIAL" },
  { id: "compute-access",    label: "Free Access",      icon: "⛏️", desc: "Compute-for-access mining",  color: "#34d399", group: "SOCIAL" },

  // SOVEREIGN (admin only)
  { id: "umay-boss",         label: "Umay Gül Nur",     icon: "👑", desc: "Sovereign boss terminal",    color: "#fbbf24", group: "SOVEREIGN", adminOnly: true },
  { id: "holding-ecosystem", label: "7 Büyüme Kolu",    icon: "🏛️", desc: "Holding ecosystem panel",    color: "#fbbf24", group: "SOVEREIGN", adminOnly: true },
  { id: "tatar-finans",      label: "Tatar Finans",     icon: "🛡️", desc: "Tatar financial network",    color: "#fbbf24", group: "SOVEREIGN", adminOnly: true },
];

const GROUP_ORDER = ["CORE", "MARKETS", "TRADING", "ANALYSIS", "MEDIA", "SOCIAL", "SOVEREIGN"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModuleLauncher({ open, onClose }: Props) {
  const { setActiveView, isSovereignAdmin } = useIDEStore();
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = MODULES.filter((m) => {
    if (m.adminOnly && !isSovereignAdmin) return false;
    if (!search) return true;
    return (
      m.label.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()) ||
      m.group.toLowerCase().includes(search.toLowerCase())
    );
  });

  const groupedModules = GROUP_ORDER.map((g) => ({
    group: g,
    modules: filtered.filter((m) => m.group === g),
  })).filter((g) => g.modules.length > 0);

  const handleSelect = (id: PanelView) => {
    cyberSound.playClick();
    setActiveView(id);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(10,18,30,0.98) 0%, rgba(14,22,36,0.98) 100%)",
          border: "1px solid rgba(0,212,170,0.2)",
          boxShadow: "0 0 60px rgba(0,212,170,0.08), 0 40px 80px rgba(0,0,0,0.6)",
          maxHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Search Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "rgba(0,212,170,0.15)" }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="rgba(0,212,170,0.6)" strokeWidth="2">
            <circle cx="9" cy="9" r="7" />
            <path d="m15 15 3 3" />
          </svg>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Modül ara…  (Esc ile kapat)"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "rgba(255,255,255,0.9)", caretColor: "#00d4aa" }}
          />
          <span className="text-[10px] px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
            {filtered.length} modül
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            ✕
          </button>
        </div>

        {/* Module Grid */}
        <div className="overflow-y-auto p-5 space-y-5" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {groupedModules.map(({ group, modules }) => (
            <div key={group}>
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(to right, ${modules[0]?.color}30, transparent)` }}
                />
                <span
                  className="text-[9px] font-bold tracking-[0.2em] px-2"
                  style={{ color: modules[0]?.color + "aa" }}
                >
                  {group}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(to left, ${modules[0]?.color}30, transparent)` }}
                />
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {modules.map((m) => {
                  const isHovered = hovered === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m.id)}
                      onMouseEnter={() => setHovered(m.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-150"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${m.color}18, ${m.color}08)`
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isHovered ? m.color + "50" : "rgba(255,255,255,0.06)"}`,
                        transform: isHovered ? "translateY(-2px) scale(1.03)" : "none",
                        boxShadow: isHovered ? `0 8px 24px ${m.color}18` : "none",
                      }}
                    >
                      <span className="text-2xl leading-none" style={{ filter: isHovered ? "drop-shadow(0 0 6px currentColor)" : "none" }}>
                        {m.icon}
                      </span>
                      <div className="w-full">
                        <div
                          className="text-[11px] font-semibold leading-tight truncate"
                          style={{ color: isHovered ? m.color : "rgba(255,255,255,0.8)" }}
                        >
                          {m.label}
                        </div>
                        <div
                          className="text-[9px] mt-0.5 leading-tight truncate"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {m.desc}
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-[8px] text-slate-500">{m.group}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            useIDEStore.getState().openFloatingWindow(m.id, m.label);
                            onClose();
                          }}
                          className="px-1 py-0.2 rounded bg-cyan-500/20 hover:bg-cyan-500/50 text-cyan-300 text-[8px] font-mono border border-cyan-500/30"
                          title="Open as Floating Window"
                        >
                          ⤢ FLOATING
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}


        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-3 text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>↵</kbd> Open Full View</span>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>Esc</kbd> Close</span>
          </div>
          <div className="flex items-center gap-1.5">

            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa" }} />
            <span className="text-[9px]" style={{ color: "rgba(0,212,170,0.6)" }}>NUR Finance · {MODULES.filter(m => !m.adminOnly).length} Modül Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
