"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { getMyProfile } from "@/lib/auth/supabase-auth";
import AccountAuthModal from "@/components/auth/AccountAuthModal";
import ModuleLauncher from "@/components/layout/ModuleLauncher";

const VIEW_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  dashboard:            { label: "Dashboard",         icon: "📊", color: "#00d4aa" },
  portfolio:            { label: "Portfolio",          icon: "💼", color: "#00d4aa" },
  charts:               { label: "Charts",             icon: "📈", color: "#00d4aa" },
  backtest:             { label: "Backtest",           icon: "⏪", color: "#00d4aa" },
  "global-markets":     { label: "Global Markets",    icon: "🌍", color: "#38bdf8" },
  "economic-data":      { label: "Macro",              icon: "🏦", color: "#38bdf8" },
  fundamentals:         { label: "Fundamentals",       icon: "📋", color: "#38bdf8" },
  screener:             { label: "Screener",           icon: "🔍", color: "#38bdf8" },
  "news-feed":          { label: "Live News",          icon: "📡", color: "#38bdf8" },
  options:              { label: "Options",            icon: "⚙️", color: "#38bdf8" },
  "oms-ems":            { label: "OMS / EMS",          icon: "⚡", color: "#a78bfa" },
  "nur-coin":           { label: "$NUR Coin",          icon: "🪙", color: "#a78bfa" },
  "wallet-gateway":     { label: "Web3 Wallet",        icon: "🔐", color: "#a78bfa" },
  "quant-copilot":      { label: "Quant Strategist",   icon: "🤖", color: "#f59e0b" },
  "macro-risk":         { label: "Macro Risk",         icon: "⚠️", color: "#f59e0b" },
  "ai-tools":           { label: "Quant Models",       icon: "🧮", color: "#f59e0b" },
  geopolitics:          { label: "NUR Earth 3D",       icon: "🌐", color: "#f59e0b" },
  "data-ingest":        { label: "Data Ingest",        icon: "📥", color: "#f59e0b" },
  encyclopedia:         { label: "Wiki",               icon: "📚", color: "#f59e0b" },
  "live-tv":            { label: "NUR TV",             icon: "📺", color: "#e879f9" },
  "broadcast-studio":   { label: "Studio",             icon: "🎬", color: "#e879f9" },
  terminal:             { label: "NUR Terminal",       icon: "💻", color: "#e879f9" },
  news:                 { label: "Briefs",             icon: "📰", color: "#e879f9" },
  alerts:               { label: "Alerts",             icon: "🔔", color: "#e879f9" },
  research:             { label: "Research",           icon: "🔬", color: "#e879f9" },
  pricing:              { label: "Plans",              icon: "💎", color: "#e879f9" },
  "verification-portal":{ label: "VIP Verify",         icon: "✅", color: "#e879f9" },
  media:                { label: "Media Network",      icon: "📡", color: "#e879f9" },
  "nur-education":      { label: "Education",          icon: "🎓", color: "#34d399" },
  "nur-kids":           { label: "Nur Kids",           icon: "👨‍👩‍👧", color: "#34d399" },
  "compute-access":     { label: "Free Access",        icon: "⛏️", color: "#34d399" },
  "umay-boss":          { label: "Umay Gül Nur",       icon: "👑", color: "#fbbf24" },
  "holding-ecosystem":  { label: "7 Growth Arms",      icon: "🏛️", color: "#fbbf24" },
  "tatar-finans":       { label: "Tatar Finans",       icon: "🛡️", color: "#fbbf24" },
  "resource-intelligence": { label: "Resource Intel",   icon: "⛏️", color: "#f59e0b" },
  "institutional-suite":  { label: "Institutional Suite", icon: "🏛", color: "#a78bfa" },
  "user-profile":         { label: "My Profile",          icon: "👤", color: "#00d4aa" },
  "profession-hub":       { label: "Profession Hub",      icon: "🎯", color: "#34d399" },
  editor:               { label: "Code Editor",        icon: "⌨️", color: "#6b7280" },
};

export default function TopBar() {
  const {
    activeView, setActiveView, isRunning, activeTabId,
    runActiveFile, toggleHUDDrawer, notifications,
    matrixRainOpacity, cycleMatrixRainOpacity,
    setSovereignAuthModalOpen, updateVerification,
  } = useIDEStore();

  const crestClickCount = useRef(0);
  const crestClickTimer = useRef<NodeJS.Timeout | null>(null);
  const { user } = useSupabaseAuth();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMyProfile().then((profile) => {
      if (profile && (profile.tier === "NUR_FINANCE_R" || profile.tier === "NUR_FINANCE_B")) {
        updateVerification({ tier: profile.tier, overallStatus: "VERIFIED" });
      }
    });
  }, [user, updateVerification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        setSovereignAuthModalOpen(true);
      }
      if (e.key === "`" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setLauncherOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSovereignAuthModalOpen]);

  const handleCrestClick = () => {
    crestClickCount.current += 1;
    if (crestClickTimer.current) clearTimeout(crestClickTimer.current);
    if (crestClickCount.current >= 3) {
      crestClickCount.current = 0;
      setSovereignAuthModalOpen(true);
    } else {
      crestClickTimer.current = setTimeout(() => { crestClickCount.current = 0; }, 1200);
    }
  };

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const matrixStatusLabel =
    matrixRainOpacity === 0 ? "Off"
    : matrixRainOpacity <= 0.05 ? "Light"
    : matrixRainOpacity <= 0.08 ? "Renaissance"
    : matrixRainOpacity <= 0.15 ? "Deep"
    : "High";

  const currentView = VIEW_LABELS[activeView] ?? { label: "Editor", icon: "⌨️", color: "#6b7280" };

  const QUICK = [
    { id: "dashboard" as const, icon: "📊" },
    { id: "portfolio" as const, icon: "💼" },
    { id: "global-markets" as const, icon: "🌍" },
    { id: "oms-ems" as const, icon: "⚡" },
    { id: "live-tv" as const, icon: "📺" },
    { id: "quant-copilot" as const, icon: "🤖" },
    { id: "nur-coin" as const, icon: "🪙" },
  ];

  return (
    <>
      <div
        className="flex items-center h-12 px-3 gap-3 select-none shrink-0 relative"
        style={{
          background: "linear-gradient(180deg, #0c1828 0%, #070e1a 100%)",
          borderBottom: "1px solid rgba(0,212,170,0.18)",
          boxShadow: "0 1px 0 rgba(0,212,170,0.06), 0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Subtle top accent line */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.15) 20%, rgba(0,212,170,0.15) 80%, transparent)" }}
        />

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div
          onClick={handleCrestClick}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer"
          title="NUR Finance · Triple-click: Sovereign Entry"
        >
          <div style={{ filter: "drop-shadow(0 0 6px rgba(251,191,36,0.45))" }}>
            <EagleCrest size={28} animate />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[11px] font-black tracking-[0.2em] font-serif"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              NUR FINANCE
            </span>
            <span className="text-[7px] font-mono tracking-widest" style={{ color: "rgba(0,212,170,0.5)" }}>
              nurfinans.com
            </span>
          </div>
        </div>

        {/* Cockpit divider */}
        <div className="shrink-0 w-px h-6" style={{ background: "linear-gradient(180deg, transparent, rgba(0,212,170,0.2), transparent)" }} />

        {/* ── Module launcher ───────────────────────────────────────────── */}
        <button
          onClick={() => setLauncherOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 shrink-0 text-xs font-mono font-semibold transition-all hover:scale-[1.02] tracking-wider"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.04))",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 4,
            color: "#00d4aa",
            boxShadow: "0 0 12px rgba(0,212,170,0.06), inset 0 1px 0 rgba(0,212,170,0.08)",
            letterSpacing: "0.08em",
          }}
          title="All modules (backtick)"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="0" y="0" width="4.5" height="4.5" rx="0.5" />
            <rect x="7.5" y="0" width="4.5" height="4.5" rx="0.5" />
            <rect x="0" y="7.5" width="4.5" height="4.5" rx="0.5" />
            <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="0.5" />
          </svg>
          MODULES
          <span
            className="text-[8px] px-1 py-0.5 font-mono font-bold rounded-sm"
            style={{ background: "rgba(0,212,170,0.12)", color: "rgba(0,212,170,0.6)" }}
          >
            `
          </span>
        </button>

        {/* ── Active view readout ───────────────────────────────────────── */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 shrink-0"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            borderLeft: `2px solid ${currentView.color}`,
            boxShadow: `inset 0 0 12px rgba(0,0,0,0.3)`,
          }}
        >
          <span className="text-sm leading-none">{currentView.icon}</span>
          <span className="text-[11px] font-mono font-bold tracking-wide" style={{ color: currentView.color }}>
            {currentView.label.toUpperCase()}
          </span>
        </div>

        {/* ── Quick-access pills ────────────────────────────────────────── */}
        <div className="flex items-center gap-0.5 shrink-0">
          {QUICK.map((q) => {
            const isActive = activeView === q.id;
            const color = VIEW_LABELS[q.id]?.color ?? "#00d4aa";
            return (
              <button
                key={q.id}
                onClick={() => { cyberSound.playClick(); setActiveView(q.id); }}
                className="w-7 h-7 rounded flex items-center justify-center text-sm transition-all hover:scale-110"
                title={VIEW_LABELS[q.id]?.label}
                style={{
                  background: isActive ? `${color}18` : "transparent",
                  border: `1px solid ${isActive ? `${color}45` : "transparent"}`,
                  boxShadow: isActive ? `0 0 8px ${color}20` : "none",
                }}
              >
                {q.icon}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* ── Right controls ────────────────────────────────────────────── */}

        {/* Account */}
        <button
          onClick={() => setAccountModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wide transition-all hover:scale-[1.02] shrink-0"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            color: user ? "#22c55e" : "#64748b",
          }}
          title="Account"
        >
          <span>{user ? "●" : "○"}</span>
          <span>{user ? user.email?.split("@")[0] : "SIGN IN"}</span>
        </button>

        {/* Matrix rain */}
        <button
          onClick={cycleMatrixRainOpacity}
          className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono font-bold tracking-widest transition-all hover:scale-[1.02] shrink-0"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 4,
            color: matrixRainOpacity > 0 ? "#34d399" : "#4e6280",
          }}
          title="Matrix waterfall"
        >
          <span style={{ opacity: matrixRainOpacity > 0 ? 1 : 0.5 }}>💧</span>
          <span>{matrixStatusLabel.toUpperCase()}</span>
        </button>

        {/* Alerts */}
        <button
          onClick={toggleHUDDrawer}
          className="relative flex items-center gap-1 px-2 py-1 shrink-0 transition-all hover:scale-[1.02]"
          style={{
            background: unreadAlertsCount > 0 ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.3)",
            border: `1px solid ${unreadAlertsCount > 0 ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 4,
            color: unreadAlertsCount > 0 ? "#ef4444" : "#4e6280",
          }}
          title="HUD Alert Center"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
          {unreadAlertsCount > 0 && (
            <span
              className="px-1 py-0.5 rounded text-[8px] font-black animate-pulse"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Run */}
        <button
          onClick={runActiveFile}
          disabled={isRunning || !activeTabId}
          className="flex items-center gap-1.5 px-3 py-1.5 shrink-0 text-[10px] font-mono font-black tracking-widest transition-all disabled:opacity-30 hover:scale-[1.02]"
          style={{
            background: isRunning
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "linear-gradient(135deg, #00d4aa, #00b890)",
            borderRadius: 4,
            color: "#020810",
            boxShadow: isRunning
              ? "0 0 16px rgba(245,158,11,0.35)"
              : "0 0 16px rgba(0,212,170,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {isRunning ? (
            <><span className="animate-spin">◌</span> RUNNING</>
          ) : (
            <><svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor"><path d="M0 0 L8 5 L0 10 Z" /></svg> RUN</>
          )}
        </button>

        {/* Live pulse */}
        <div className="flex items-center gap-1.5 ml-1 shrink-0">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.7)" }}
          />
          <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: "#22c55e" }}>
            LIVE
          </span>
        </div>
      </div>

      <ModuleLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
      <AccountAuthModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
    </>
  );
}
