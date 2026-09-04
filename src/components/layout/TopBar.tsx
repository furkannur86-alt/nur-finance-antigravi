"use client";

import { useEffect, useRef } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";

interface ViewTab {
  id: PanelView;
  label: string;
  group: "core" | "markets" | "trading" | "analysis" | "nfs";
  adminOnly?: boolean;
}

const ALL_VIEWS: ViewTab[] = [
  // Admin Only / Sovereign Gated Modules (Secret Vault Access)
  { id: "umay-boss", label: "👑 Umay Gül Nur", group: "core", adminOnly: true },
  { id: "holding-ecosystem", label: "🏛️ 7 Büyüme Kolu", group: "core", adminOnly: true },
  { id: "tatar-finans", label: "🎲 Tatar Finans", group: "trading", adminOnly: true },

  // Public 2126 Quantitative Core Modules
  { id: "geopolitics", label: "🌐 NUR Earth 3D", group: "analysis" },
  { id: "dashboard", label: "Dashboard", group: "core" },
  { id: "portfolio", label: "Portfolio", group: "core" },
  { id: "charts", label: "Charts", group: "core" },

  { id: "global-markets", label: "Markets", group: "markets" },
  { id: "economic-data", label: "Macro", group: "markets" },
  { id: "fundamentals", label: "Fundmntl", group: "markets" },
  { id: "screener", label: "Screener", group: "markets" },
  { id: "news-feed", label: "LiveNews", group: "markets" },
  { id: "options", label: "Options", group: "markets" },

  { id: "oms-ems", label: "OMS/EMS", group: "trading" },
  { id: "wallet-gateway", label: "Web3 Wallet", group: "trading" },
  { id: "backtest", label: "Backtest", group: "trading" },

  { id: "quant-copilot", label: "Quant Copilot", group: "analysis" },
  { id: "macro-risk", label: "MacroRisk", group: "analysis" },
  { id: "ai-tools", label: "AI Tools", group: "analysis" },
  { id: "data-ingest", label: "Ingest", group: "analysis" },
  { id: "encyclopedia", label: "Wiki", group: "analysis" },

  { id: "terminal", label: "NUR Terminal", group: "nfs" },
  { id: "broadcast-studio", label: "Studio", group: "nfs" },
  { id: "live-tv", label: "NUR TV", group: "nfs" },
  { id: "verification-portal", label: "VIP Verify", group: "nfs" },
  { id: "news", label: "Briefs", group: "nfs" },
  { id: "alerts", label: "Alerts", group: "nfs" },
  { id: "research", label: "Research", group: "nfs" },
  { id: "pricing", label: "Plans", group: "nfs" },
];

const GROUP_ACCENT: Record<string, string> = {
  core: "var(--ag-accent)",
  markets: "var(--ag-accent)",
  trading: "#38bdf8",
  analysis: "#00f2fe",
  nfs: "var(--ag-accent2)",
};

export default function TopBar() {
  const {
    activeView,
    setActiveView,
    toggleSidebar,
    isRunning,
    activeTabId,
    runActiveFile,
    toggleHUDDrawer,
    notifications,
    matrixRainOpacity,
    cycleMatrixRainOpacity,
    isSovereignAdmin,
    setSovereignAuthModalOpen,
  } = useIDEStore();

  const crestClickCount = useRef(0);
  const crestClickTimer = useRef<NodeJS.Timeout | null>(null);

  // Global Shortcut: Ctrl + Shift + S for Sovereign Vault Auth
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        setSovereignAuthModalOpen(true);
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

  const visibleViews = ALL_VIEWS.filter((v) => !v.adminOnly || isSovereignAdmin);

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const matrixStatusLabel =
    matrixRainOpacity === 0
      ? "Kapalı"
      : matrixRainOpacity <= 0.05
      ? "Hafif"
      : matrixRainOpacity <= 0.08
      ? "Rönesans"
      : matrixRainOpacity <= 0.15
      ? "Derin"
      : "Yüksek";

  return (
    <div
      className="flex items-center h-10 px-3 border-b select-none shrink-0"
      style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
    >
      <button onClick={toggleSidebar} className="mr-2 p-1 rounded hover:bg-white/5 text-sm" title="Toggle Sidebar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="3" width="12" height="1.5" rx="0.5" />
          <rect x="2" y="7" width="12" height="1.5" rx="0.5" />
          <rect x="2" y="11" width="12" height="1.5" rx="0.5" />
        </svg>
      </button>

      {/* Brand Identity with Eagle Crest & Triple-Click Secret Sovereign Trigger */}
      <div
        onClick={handleCrestClick}
        className="flex items-center gap-2 mr-4 shrink-0 cursor-pointer group"
        title="NUR Finance Sovereign Network &bull; Dominus Orientis et Occidentis (3 kez tıkla: Egemen Girişi)"
      >
        <EagleCrest size={26} animate={true} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider text-amber-300 font-serif">
              NUR FİNANS
            </span>
            <span
              className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30"
              title="Official Master Holding Domain: nurfinans.com"
            >
              nurfinans.com
            </span>
          </div>
          <span className="text-[8px] font-serif italic text-slate-400 tracking-wide">
            Dominus Orientis et Occidentis
          </span>
        </div>
      </div>

      {/* Tabs Filtered by Sovereign Authorization */}
      <div className="flex items-center gap-0.5 mr-3 overflow-x-auto no-scrollbar">
        {visibleViews.map((v, i) => {
          const showDivider = i > 0 && visibleViews[i - 1].group !== v.group;
          const accent = GROUP_ACCENT[v.group];
          const isActive = activeView === v.id;

          return (
            <div key={v.id} className="flex items-center shrink-0">
              {showDivider && (
                <div className="w-px h-4 mx-1" style={{ background: "var(--ag-border)" }} />
              )}
              <button
                onClick={() => {
                  cyberSound.playClick();
                  setActiveView(v.id);
                }}
                className="px-2 py-1 text-[11px] rounded transition-colors whitespace-nowrap"
                style={{
                  background: isActive
                    ? v.group === "nfs"
                      ? "rgba(99,102,241,0.15)"
                      : v.group === "trading"
                      ? "rgba(56,189,248,0.15)"
                      : "rgba(0,212,170,0.15)"
                    : "transparent",
                  color: isActive ? accent : "var(--ag-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {v.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Matrix Waterfall Controller */}
      <button
        onClick={cycleMatrixRainOpacity}
        className="px-2 py-1 mr-2 rounded text-[10px] font-mono flex items-center gap-1 bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 transition-colors shrink-0"
        title="Finansal Matriks Şelalesi Yoğunluğunu Değiştir (Tıkla)"
      >
        <span className="text-emerald-400">💧 Matriks:</span>
        <span className="font-bold text-amber-300">{matrixStatusLabel}</span>
      </button>

      {/* HUD Alerts Drawer Trigger */}
      <button
        onClick={toggleHUDDrawer}
        className="relative p-1.5 mr-2 rounded hover:bg-white/5 text-[var(--ag-muted)] hover:text-white transition-colors flex items-center gap-1 shrink-0"
        title="Toggle HUD Alert Center"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
        </svg>
        {unreadAlertsCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-500 text-white animate-pulse">
            {unreadAlertsCount}
          </span>
        )}
      </button>

      <button
        onClick={runActiveFile}
        disabled={isRunning || !activeTabId}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all disabled:opacity-40 shrink-0"
        style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
      >
        {isRunning ? (
          <>
            <span className="animate-spin">&#9696;</span> Running...
          </>
        ) : (
          <>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <path d="M0 0 L10 6 L0 12 Z" />
            </svg>
            Run
          </>
        )}
      </button>

      <kbd
        className="ml-2 text-[9px] px-1.5 py-0.5 rounded border cursor-pointer hover:border-[var(--ag-accent)] transition-colors shrink-0"
        style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
        title="Command Palette"
      >
        Ctrl+K
      </kbd>

      <div className="ml-2 flex items-center gap-1.5 shrink-0">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ag-success)" }} />
        <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>LIVE</span>
      </div>
    </div>
  );
}

