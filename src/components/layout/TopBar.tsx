"use client";

import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";

interface ViewTab {
  id: PanelView;
  label: string;
  group: "core" | "markets" | "trading" | "analysis" | "nfs";
}

const views: ViewTab[] = [
  { id: "holding-ecosystem", label: "👑 Umay Gül Nur", group: "core" },
  { id: "editor", label: "Editor", group: "core" },
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
  { id: "geopolitics", label: "GeoRisk", group: "analysis" },
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
  analysis: "var(--ag-accent)",
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
  } = useIDEStore();

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="flex items-center h-10 px-3 border-b select-none"
      style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
    >
      <button onClick={toggleSidebar} className="mr-3 p-1 rounded hover:bg-white/5 text-sm" title="Toggle Sidebar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="3" width="12" height="1.5" rx="0.5" />
          <rect x="2" y="7" width="12" height="1.5" rx="0.5" />
          <rect x="2" y="11" width="12" height="1.5" rx="0.5" />
        </svg>
      </button>

      <div className="flex items-center gap-1 mr-4">
        <span className="text-sm font-bold" style={{ color: "var(--ag-accent)" }}>
          AntiGravi
        </span>
        <span className="text-xs" style={{ color: "var(--ag-muted)" }}>
          IDE
        </span>
        <span
          className="text-[10px] ml-1 px-1.5 py-0.5 rounded font-mono font-bold"
          style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}
        >
          v3.0 PRO
        </span>
      </div>

      <div className="flex items-center gap-0.5 mr-4 overflow-x-auto">
        {views.map((v, i) => {
          const showDivider = i > 0 && views[i - 1].group !== v.group;
          const accent = GROUP_ACCENT[v.group];
          const isActive = activeView === v.id;

          return (
            <div key={v.id} className="flex items-center shrink-0">
              {showDivider && (
                <div className="w-px h-4 mx-1" style={{ background: "var(--ag-border)" }} />
              )}
              <button
                onClick={() => setActiveView(v.id)}
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
                }}
              >
                {v.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* HUD Alerts Drawer Trigger */}
      <button
        onClick={toggleHUDDrawer}
        className="relative p-1.5 mr-2 rounded hover:bg-white/5 text-[var(--ag-muted)] hover:text-white transition-colors flex items-center gap-1"
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
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all disabled:opacity-40"
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
        className="ml-3 text-[9px] px-1.5 py-0.5 rounded border cursor-pointer hover:border-[var(--ag-accent)] transition-colors"
        style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
        title="Command Palette"
      >
        Ctrl+K
      </kbd>

      <div className="ml-2 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ag-success)" }} />
        <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>LIVE</span>
      </div>
    </div>
  );
}
