"use client";

import { useIDEStore } from "@/stores/useIDEStore";

export default function EditorTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useIDEStore();

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center h-8 overflow-x-auto border-b"
      style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="flex items-center gap-1.5 px-3 h-full text-xs cursor-pointer border-r group"
          style={{
            background: activeTabId === tab.id ? "var(--ag-surface)" : "transparent",
            borderColor: "var(--ag-border)",
            color: activeTabId === tab.id ? "var(--ag-text)" : "var(--ag-muted)",
            borderBottom: activeTabId === tab.id ? "2px solid var(--ag-accent)" : "2px solid transparent",
          }}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.modified && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ag-accent)" }} />
          )}
          <span className="truncate max-w-[120px]">{tab.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
            className="opacity-0 group-hover:opacity-100 ml-1 rounded hover:bg-white/10 p-0.5 transition-opacity"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
