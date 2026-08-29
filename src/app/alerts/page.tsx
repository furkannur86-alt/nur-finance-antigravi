"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RiskAlert } from "@/lib/content/nfs-content";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "#ef4444", bg: "#ef444418", label: "CRITICAL" },
  high: { color: "#f59e0b", bg: "#f59e0b18", label: "HIGH" },
  medium: { color: "#6366f1", bg: "#6366f118", label: "MEDIUM" },
  low: { color: "#64748b", bg: "#64748b18", label: "LOW" },
};

const CATEGORY_ICON: Record<string, string> = {
  geopolitical: "🌍",
  market: "📊",
  credit: "💳",
  operational: "⚙️",
  cyber: "🔒",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    const url = filterSeverity === "all" ? "/api/content?type=alerts" : `/api/content?type=alerts&severity=${filterSeverity}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setAlerts(d.data || []));
  }, [filterSeverity]);

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <div className="min-h-screen" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs mb-1 block hover:underline" style={{ color: "var(--ag-muted)" }}>
              &larr; AntiGravi IDE
            </Link>
            <h1 className="text-xl font-bold" style={{ color: "var(--ag-danger)" }}>NFS Risk Alerts</h1>
            <p className="text-xs mt-1" style={{ color: "var(--ag-muted)" }}>
              Active threats: <span style={{ color: "var(--ag-danger)" }}>{criticalCount} critical</span>,{" "}
              <span style={{ color: "var(--ag-warning)" }}>{highCount} high</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className="px-2.5 py-1 text-[11px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.bg || "rgba(0,212,170,0.15)") : "transparent",
                  color: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.color || "var(--ag-accent)") : "var(--ag-muted)",
                  border: `1px solid ${filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.color || "var(--ag-accent)") : "var(--ag-border)"}`,
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => {
            const sev = SEVERITY_CONFIG[alert.severity];
            return (
              <article
                key={alert.id}
                className="rounded-lg border p-4"
                style={{ background: "var(--ag-surface)", borderColor: sev.color + "40" }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl shrink-0 mt-0.5">{CATEGORY_ICON[alert.category] || "⚠️"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: sev.bg, color: sev.color }}
                      >
                        {sev.label}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--ag-muted)" }}>
                        {alert.category}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{alert.region}</span>
                      <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{timeAgo(alert.publishedAt)}</span>
                    </div>
                    <h2 className="text-sm font-semibold mb-2">{alert.title}</h2>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ag-muted)" }}>
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium uppercase" style={{ color: "var(--ag-muted)" }}>
                        Affected:
                      </span>
                      {alert.affectedAssets.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: sev.bg, color: sev.color }}>
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
      </main>
    </div>
  );
}
