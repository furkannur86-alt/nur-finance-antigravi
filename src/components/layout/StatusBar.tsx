"use client";

import { useIDEStore } from "@/stores/useIDEStore";

export default function StatusBar() {
  const { tabs, activeTabId, isRunning } = useIDEStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div
      className="flex items-center h-6 px-3 text-[10px] border-t select-none"
      style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: isRunning ? "var(--ag-warning)" : "var(--ag-success)" }} />
          {isRunning ? "Running" : "Ready"}
        </span>
        <span>|</span>
        <span>AntiGravi Engine v2.0</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {activeTab && (
          <>
            <span>{activeTab.language.toUpperCase()}</span>
            <span>{activeTab.modified ? "Modified" : "Saved"}</span>
          </>
        )}
        <span>UTF-8</span>
        <span>Spaces: 4</span>
      </div>
    </div>
  );
}
