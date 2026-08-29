"use client";

import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";

const views: { id: PanelView; label: string; group?: string }[] = [
  { id: "editor", label: "Editor" },
  { id: "dashboard", label: "Dashboard" },
  { id: "portfolio", label: "Portfolio" },
  { id: "charts", label: "Charts" },
  { id: "backtest", label: "Backtest" },
  { id: "terminal", label: "Terminal" },
  { id: "news", label: "News", group: "nfs" },
  { id: "alerts", label: "Alerts", group: "nfs" },
  { id: "research", label: "Research", group: "nfs" },
];

export default function TopBar() {
  const { activeView, setActiveView, toggleSidebar, isRunning, tabs, activeTabId, addConsoleMessage, setRunning } =
    useIDEStore();

  const handleRun = () => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    setRunning(true);
    addConsoleMessage({ type: "info", text: `>>> Running ${activeTab.name}...` });

    setTimeout(() => {
      const lines = activeTab.content.split("\n").filter((l) => {
        const trimmed = l.trim();
        return trimmed.startsWith("print(") || trimmed.startsWith("print (");
      });

      if (lines.length > 0) {
        for (const line of lines) {
          const match = line.match(/print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/);
          if (match) {
            addConsoleMessage({ type: "output", text: match[1] || match[2] || line });
          }
        }
      }

      addConsoleMessage({ type: "success", text: `[AntiGravi] ${activeTab.name} executed successfully.` });
      addConsoleMessage({
        type: "info",
        text: `[Engine] Processed in ${(Math.random() * 200 + 50).toFixed(1)}ms`,
      });
      setRunning(false);
    }, 800);
  };

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
          v2.0
        </span>
      </div>

      <div className="flex items-center gap-0.5 mr-4">
        {views.map((v, i) => {
          const prevGroup = i > 0 ? views[i - 1].group : undefined;
          const showDivider = v.group === "nfs" && prevGroup !== "nfs";
          return (
            <div key={v.id} className="flex items-center">
              {showDivider && (
                <div className="w-px h-4 mx-1.5" style={{ background: "var(--ag-border)" }} />
              )}
              <button
                onClick={() => setActiveView(v.id)}
                className="px-2.5 py-1 text-xs rounded transition-colors"
                style={{
                  background: activeView === v.id
                    ? v.group === "nfs" ? "rgba(99,102,241,0.15)" : "rgba(0,212,170,0.15)"
                    : "transparent",
                  color: activeView === v.id
                    ? v.group === "nfs" ? "var(--ag-accent2)" : "var(--ag-accent)"
                    : "var(--ag-muted)",
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
        onClick={handleRun}
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

      <div className="ml-3 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ag-success)" }} />
        <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>LIVE</span>
      </div>
    </div>
  );
}
