"use client";

import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";

interface ViewTab {
  id: PanelView;
  label: string;
  group: "core" | "markets" | "analysis" | "nfs";
}

const views: ViewTab[] = [
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

  { id: "backtest", label: "Backtest", group: "analysis" },
  { id: "geopolitics", label: "GeoRisk", group: "analysis" },
  { id: "ai-tools", label: "AI Tools", group: "analysis" },
  { id: "data-ingest", label: "Ingest", group: "analysis" },
  { id: "encyclopedia", label: "Wiki", group: "analysis" },

  { id: "terminal", label: "NUR Terminal", group: "nfs" },
  { id: "news", label: "Briefs", group: "nfs" },
  { id: "alerts", label: "Alerts", group: "nfs" },
  { id: "research", label: "Research", group: "nfs" },
  { id: "live-tv", label: "NUR TV", group: "nfs" },
  { id: "media", label: "Media", group: "nfs" },
  { id: "pricing", label: "Plans", group: "nfs" },
];

const GROUP_ACCENT: Record<string, string> = {
  core: "var(--ag-accent)",
  markets: "var(--ag-accent)",
  analysis: "var(--ag-accent)",
  nfs: "var(--ag-accent2)",
};

export default function TopBar() {
  const { activeView, setActiveView, toggleSidebar, isRunning, activeTabId, runActiveFile } =
    useIDEStore();

  let lastGroup = "";

  return (
    <div className="flex items-center h-10 px-3 border-b select-none"
      style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
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
        <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
          v2.1
        </span>
      </div>

      <div className="flex items-center gap-0.5 mr-4 overflow-x-auto">
        {views.map((v) => {
          const showDivider = v.group !== lastGroup && lastGroup !== "";
          lastGroup = v.group;
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
                    ? v.group === "nfs" ? "rgba(99,102,241,0.15)" : "rgba(0,212,170,0.15)"
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
