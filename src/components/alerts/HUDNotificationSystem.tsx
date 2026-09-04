"use client";

import { useIDEStore } from "@/stores/useIDEStore";
import { AudioAlertSynthesizer } from "@/lib/alerts/alert-engine";

export default function HUDNotificationSystem() {
  const {
    hudDrawerOpen,
    toggleHUDDrawer,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    alertRules,
    toggleAlertRule,
    addNotification,
  } = useIDEStore();

  if (!hudDrawerOpen) return null;

  const handleTestChime = () => {
    AudioAlertSynthesizer.playChime("SUCCESS");
    addNotification({
      title: "Audio Chime Test",
      message: "HUD Web Audio chime tested successfully.",
      severity: "SUCCESS",
      category: "SYSTEM",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={toggleHUDDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto transition-opacity"
      />

      {/* Drawer */}
      <div
        className="relative w-96 h-full border-l shadow-2xl flex flex-col pointer-events-auto select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--ag-border)", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-ping bg-[var(--ag-accent)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              HUD Risk & Alert Center
            </span>
          </div>
          <button
            onClick={toggleHUDDrawer}
            className="p-1 rounded text-[var(--ag-muted)] hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>

        {/* Controls & Quick Actions */}
        <div className="p-3 border-b flex items-center justify-between text-xs" style={{ borderColor: "var(--ag-border)" }}>
          <button
            onClick={handleTestChime}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[var(--ag-accent)] font-mono text-[11px] transition-colors border border-[var(--ag-border)]"
          >
            &bull; Test Audio Chime
          </button>
          <button
            onClick={clearAllNotifications}
            className="text-[11px] text-[var(--ag-muted)] hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Active Notifications */}
          <div>
            <div className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase tracking-wider mb-2">
              Recent Events ({notifications.filter((n) => !n.read).length} unread)
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 rounded border text-center text-xs text-[var(--ag-muted)]" style={{ borderColor: "var(--ag-border)" }}>
                No active notifications.
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => {
                  const borderColor =
                    n.severity === "CRITICAL"
                      ? "border-red-500/50 bg-red-950/20"
                      : n.severity === "WARNING"
                      ? "border-amber-500/50 bg-amber-950/20"
                      : n.severity === "SUCCESS"
                      ? "border-emerald-500/50 bg-emerald-950/20"
                      : "border-[var(--ag-border)] bg-black/30";

                  const badgeColor =
                    n.severity === "CRITICAL"
                      ? "text-red-400"
                      : n.severity === "WARNING"
                      ? "text-amber-400"
                      : n.severity === "SUCCESS"
                      ? "text-emerald-400"
                      : "text-[var(--ag-accent)]";

                  return (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded border text-xs cursor-pointer transition-all ${borderColor} ${
                        !n.read ? "ring-1 ring-white/10" : "opacity-75"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${badgeColor}`}>{n.title}</span>
                        <span className="text-[10px] text-[var(--ag-muted)] font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[var(--ag-text)] leading-relaxed">{n.message}</p>
                      <div className="mt-1.5 flex justify-between items-center text-[9px] text-[var(--ag-muted)]">
                        <span className="uppercase font-mono">{n.category}</span>
                        {!n.read && <span className="text-[var(--ag-accent)] font-bold">&bull; UNREAD</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Alert Rules Section */}
          <div>
            <div className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase tracking-wider mb-2">
              Rule Triggers & Thresholds
            </div>
            <div className="space-y-2">
              {alertRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-2.5 rounded border bg-black/20 flex items-center justify-between text-xs"
                  style={{ borderColor: "var(--ag-border)" }}
                >
                  <div>
                    <div className="font-semibold text-white text-[11px]">{rule.name}</div>
                    <div className="text-[10px] text-[var(--ag-muted)] font-mono">
                      {rule.category} &bull; Threshold: {rule.threshold}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAlertRule(rule.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-colors ${
                      rule.enabled
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/5 text-[var(--ag-muted)] border border-white/5"
                    }`}
                  >
                    {rule.enabled ? "ACTIVE" : "OFF"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
