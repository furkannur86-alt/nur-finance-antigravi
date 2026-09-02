"use client";

import { useEffect, useState } from "react";
import type { ResearchNote } from "@/lib/content/nfs-content";

const RATING_CONFIG: Record<string, { color: string; bg: string }> = {
  buy: { color: "#22c55e", bg: "#22c55e18" },
  overweight: { color: "#00d4aa", bg: "#00d4aa18" },
  hold: { color: "#f59e0b", bg: "#f59e0b18" },
  underweight: { color: "#ef4444", bg: "#ef444418" },
  sell: { color: "#dc2626", bg: "#dc262618" },
};

export default function ResearchPanel() {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterSector, setFilterSector] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    const url = filterSector === "all" ? "/api/content?type=research" : `/api/content?type=research&sector=${filterSector}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setNotes(d.data || []); });
    return () => { cancelled = true; };
  }, [filterSector]);

  const [now] = useState(() => Date.now());
  function timeAgo(iso: string): string {
    const diff = now - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const sectors = ["all", ...Array.from(new Set(notes.map((n) => n.sector)))];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <header className="sticky top-0 z-10 border-b px-6 py-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--ag-accent2)" }}>Equity Research</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--ag-muted)" }}>Analyst coverage &amp; ratings</p>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setFilterSector(sec)}
                className="px-2 py-1 text-[10px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filterSector === sec ? "rgba(99,102,241,0.15)" : "transparent",
                  color: filterSector === sec ? "var(--ag-accent2)" : "var(--ag-muted)",
                }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-2">
        {notes.length === 0 && (
          <div className="text-center py-12 text-xs" style={{ color: "var(--ag-muted)" }}>
            Loading research notes...
          </div>
        )}
        {notes.map((note) => {
          const rat = RATING_CONFIG[note.rating] || RATING_CONFIG.hold;
          return (
            <article
              key={note.id}
              className="rounded border p-3 cursor-pointer transition-colors"
              style={{ background: "var(--ag-surface)", borderColor: expanded === note.id ? "var(--ag-accent2)" : "var(--ag-border)" }}
              onClick={() => setExpanded(expanded === note.id ? null : note.id)}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 text-center" style={{ minWidth: 60 }}>
                  <div
                    className="text-[10px] font-bold uppercase px-2 py-1 rounded mb-0.5"
                    style={{ background: rat.bg, color: rat.color }}
                  >
                    {note.rating}
                  </div>
                  {note.targetPrice && (
                    <div className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>
                      TP ${note.targetPrice}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "var(--ag-accent2)" }}>
                      {note.sector}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{timeAgo(note.publishedAt)}</span>
                    <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{note.author}</span>
                  </div>
                  <h2 className="text-xs font-semibold mb-0.5">{note.title}</h2>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--ag-muted)" }}>{note.abstract}</p>

                  {expanded === note.id && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--ag-border)" }}>
                      <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--ag-text)" }}>{note.body}</p>
                      <div className="flex gap-1">
                        {note.tickers.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
