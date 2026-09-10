"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { getMyProfile } from "@/lib/auth/supabase-auth";
import AccountAuthModal from "@/components/auth/AccountAuthModal";
import ModuleLauncher from "@/components/layout/ModuleLauncher";

// Active view label lookup
const VIEW_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  dashboard:          { label: "Dashboard",        icon: "📊", color: "#00d4aa" },
  portfolio:          { label: "Portfolio",         icon: "💼", color: "#00d4aa" },
  charts:             { label: "Charts",            icon: "📈", color: "#00d4aa" },
  backtest:           { label: "Backtest",          icon: "⏪", color: "#00d4aa" },
  "global-markets":   { label: "Global Markets",   icon: "🌍", color: "#38bdf8" },
  "economic-data":    { label: "Macro",             icon: "🏦", color: "#38bdf8" },
  fundamentals:       { label: "Fundamentals",      icon: "📋", color: "#38bdf8" },
  screener:           { label: "Screener",          icon: "🔍", color: "#38bdf8" },
  "news-feed":        { label: "Live News",         icon: "📡", color: "#38bdf8" },
  options:            { label: "Options",           icon: "⚙️", color: "#38bdf8" },
  "oms-ems":          { label: "OMS / EMS",         icon: "⚡", color: "#a78bfa" },
  "nur-coin":         { label: "$NUR Coin",         icon: "🪙", color: "#a78bfa" },
  "wallet-gateway":   { label: "Web3 Wallet",       icon: "🔐", color: "#a78bfa" },
  "quant-copilot":    { label: "Quant Strategist",  icon: "🤖", color: "#f59e0b" },
  "macro-risk":       { label: "Macro Risk",        icon: "⚠️", color: "#f59e0b" },
  "ai-tools":         { label: "Quant Models",      icon: "🧮", color: "#f59e0b" },
  geopolitics:        { label: "NUR Earth 3D",      icon: "🌐", color: "#f59e0b" },
  "data-ingest":      { label: "Data Ingest",       icon: "📥", color: "#f59e0b" },
  encyclopedia:       { label: "Wiki",              icon: "📚", color: "#f59e0b" },
  "live-tv":          { label: "NUR TV",            icon: "📺", color: "#e879f9" },
  "broadcast-studio": { label: "Studio",            icon: "🎬", color: "#e879f9" },
  terminal:           { label: "NUR Terminal",      icon: "💻", color: "#e879f9" },
  news:               { label: "Briefs",            icon: "📰", color: "#e879f9" },
  alerts:             { label: "Alerts",            icon: "🔔", color: "#e879f9" },
  research:           { label: "Research",          icon: "🔬", color: "#e879f9" },
  pricing:            { label: "Plans",             icon: "💎", color: "#e879f9" },
  "verification-portal": { label: "VIP Verify",    icon: "✅", color: "#e879f9" },
  media:              { label: "Media Network",     icon: "📡", color: "#e879f9" },
  "nur-education":    { label: "Education",         icon: "🎓", color: "#34d399" },
  "nur-kids":         { label: "Nur Kids",          icon: "👨‍👩‍👧", color: "#34d399" },
  "compute-access":   { label: "Free Access",       icon: "⛏️", color: "#34d399" },
  "umay-boss":        { label: "Umay Gül Nur",      icon: "👑", color: "#fbbf24" },
  "holding-ecosystem":{ label: "7 Büyüme Kolu",    icon: "🏛️", color: "#fbbf24" },
  "tatar-finans":     { label: "Tatar Finans",      icon: "🛡️", color: "#fbbf24" },
  editor:             { label: "Code Editor",       icon: "⌨️", color: "#6b7280" },
};

export default function TopBar() {
  const {
    activeView,
    setActiveView,
    isRunning,
    activeTabId,
    runActiveFile,
    toggleHUDDrawer,
    notifications,
    matrixRainOpacity,
    cycleMatrixRainOpacity,
    isSovereignAdmin,
    setSovereignAuthModalOpen,
    updateVerification,
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

  // Ctrl+Shift+S → Sovereign, Space → Launcher (only when not in an input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        setSovereignAuthModalOpen(true);
      }
      // Press backtick ` to open launcher (not in inputs)
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
      crestClickTimer.current = setTimeout(() => {
        crestClickCount.current = 0;
      }, 1200);
    }
  };

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const matrixStatusLabel =
    matrixRainOpacity === 0 ? "Kapalı"
    : matrixRainOpacity <= 0.05 ? "Hafif"
    : matrixRainOpacity <= 0.08 ? "Rönesans"
    : matrixRainOpacity <= 0.15 ? "Derin"
    : "Yüksek";

  const currentView = VIEW_LABELS[activeView] ?? { label: "Editor", icon: "⌨️", color: "#6b7280" };

  // Quick-access: 5 recently used or most important modules shown as pills
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
        className="flex items-center h-11 px-3 gap-3 border-b select-none shrink-0"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        {/* Logo */}
        <div
          onClick={handleCrestClick}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          title="NUR Finance · 3 kez tıkla: Egemen Girişi"
        >
          <EagleCrest size={26} animate />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-amber-300 font-serif leading-none">NUR FİNANS</span>
            <span className="text-[7px] font-mono text-slate-500 tracking-wide">nurfinans.com</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 shrink-0" style={{ background: "var(--ag-border)" }} />

        {/* ⊞ Module Launcher Button — BIG, clearly visible */}
        <button
          onClick={() => setLauncherOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:scale-[1.02] shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.06))",
            border: "1px solid rgba(0,212,170,0.3)",
            color: "#00d4aa",
            boxShadow: "0 0 12px rgba(0,212,170,0.08)",
          }}
          title="Tüm modülleri aç (` tuşu)"
        >
          {/* Grid icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="0" y="0" width="5.5" height="5.5" rx="1" />
            <rect x="8.5" y="0" width="5.5" height="5.5" rx="1" />
            <rect x="0" y="8.5" width="5.5" height="5.5" rx="1" />
            <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
          </svg>
          Modüller
          <span
            className="text-[8px] px-1 py-0.5 rounded"
            style={{ background: "rgba(0,212,170,0.15)", color: "rgba(0,212,170,0.7)" }}
          >
            `
          </span>
        </button>

        {/* Current Active View Breadcrumb */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md shrink-0"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-sm leading-none">{currentView.icon}</span>
          <span className="text-[11px] font-semibold" style={{ color: currentView.color }}>
            {currentView.label}
          </span>
        </div>

        {/* Quick-access pills */}
        <div className="flex items-center gap-1 shrink-0">
          {QUICK.map((q) => {
            const isActive = activeView === q.id;
            return (
              <button
                key={q.id}
                onClick={() => { cyberSound.playClick(); setActiveView(q.id); }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all hover:scale-110"
                title={VIEW_LABELS[q.id]?.label}
                style={{
                  background: isActive
                    ? (VIEW_LABELS[q.id]?.color ?? "#00d4aa") + "20"
                    : "transparent",
                  border: `1px solid ${isActive ? (VIEW_LABELS[q.id]?.color ?? "#00d4aa") + "50" : "transparent"}`,
                }}
              >
                {q.icon}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Account */}
        <button
          onClick={() => setAccountModalOpen(true)}
          className="px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 hover:bg-white/5 border border-white/10 text-slate-300 transition-colors shrink-0"
          title="Hesap"
        >
          <span className={user ? "text-emerald-400" : "text-slate-400"}>👤</span>
          <span className="font-bold">{user ? user.email?.split("@")[0] : "Giriş"}</span>
        </button>

        {/* Matrix */}
        <button
          onClick={cycleMatrixRainOpacity}
          className="px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 transition-colors shrink-0"
          title="Matriks Şelalesi"
        >
          <span className="text-emerald-400">💧</span>
          <span className="font-bold text-amber-300">{matrixStatusLabel}</span>
        </button>

        {/* Alerts */}
        <button
          onClick={toggleHUDDrawer}
          className="relative p-1.5 rounded hover:bg-white/5 text-[var(--ag-muted)] hover:text-white transition-colors flex items-center gap-1 shrink-0"
          title="HUD Alert Center"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
          {unreadAlertsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Run */}
        <button
          onClick={runActiveFile}
          disabled={isRunning || !activeTabId}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all disabled:opacity-40 shrink-0"
          style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
        >
          {isRunning ? (
            <><span className="animate-spin">&#9696;</span> Running...</>
          ) : (
            <><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0 L10 6 L0 12 Z" /></svg> Run</>
          )}
        </button>

        {/* Live indicator */}
        <div className="ml-1 flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ag-success)" }} />
          <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>LIVE</span>
        </div>
      </div>

      <ModuleLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
      <AccountAuthModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)} />
    </>
  );
}
