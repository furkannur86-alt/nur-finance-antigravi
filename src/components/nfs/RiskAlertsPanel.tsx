"use client";

import { useEffect, useState } from "react";
import type { RiskAlert } from "@/lib/content/nfs-content";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "#ef4444", bg: "#ef444418", label: "CRITICAL" },
  high: { color: "#f59e0b", bg: "#f59e0b18", label: "HIGH" },
  medium: { color: "#6366f1", bg: "#6366f118", label: "MEDIUM" },
  low: { color: "#64748b", bg: "#64748b18", label: "LOW" },
};

const CATEGORY_ICON: Record<string, string> = {
  geopolitical: "G",
  market: "M",
  credit: "C",
  operational: "O",
  cyber: "S",
};

export default function RiskAlertsPanel() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    const url = filterSeverity === "all" ? "/api/content?type=alerts" : `/api/content?type=alerts&severity=${filterSeverity}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAlerts(d.data || []); });
    return () => { cancelled = true; };
  }, [filterSeverity]);

  const [now] = useState(() => Date.now());
  function timeAgo(iso: string): string {
    const diff = now - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <header className="sticky top-0 z-10 border-b px-6 py-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--ag-danger)" }}>Risk Alerts</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--ag-muted)" }}>
              Active: <span style={{ color: "var(--ag-danger)" }}>{criticalCount} critical</span>,{" "}
              <span style={{ color: "var(--ag-warning)" }}>{highCount} high</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className="px-2 py-1 text-[10px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.bg || "rgba(0,212,170,0.15)") : "transparent",
                  color: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.color || "var(--ag-accent)") : "var(--ag-muted)",
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-2">
        {alerts.length === 0 && (
          <div className="text-center py-12 text-xs" style={{ color: "var(--ag-muted)" }}>
            Loading risk alerts...
          </div>
        )}
        {alerts.map((alert) => {
          const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;
          return (
            <article
              key={alert.id}
              className="rounded border p-3"
              style={{ background: "var(--ag-surface)", borderColor: sev.color + "40" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0"
                  style={{ background: sev.bg, color: sev.color }}
                >
                  {CATEGORY_ICON[alert.category] || "!"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: sev.bg, color: sev.color }}
                    >
                      {sev.label}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "var(--ag-muted)" }}>
                      {alert.category}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{alert.region}</span>
                    <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{timeAgo(alert.publishedAt)}</span>
                  </div>
                  <h2 className="text-xs font-semibold mb-1">{alert.title}</h2>
                  <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--ag-muted)" }}>
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-1">
                    {alert.affectedAssets.map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: sev.bg, color: sev.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
