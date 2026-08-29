"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResearchNote } from "@/lib/content/nfs-content";

const RATING_CONFIG: Record<string, { color: string; bg: string }> = {
  buy: { color: "#22c55e", bg: "#22c55e18" },
  overweight: { color: "#00d4aa", bg: "#00d4aa18" },
  hold: { color: "#f59e0b", bg: "#f59e0b18" },
  underweight: { color: "#ef4444", bg: "#ef444418" },
  sell: { color: "#dc2626", bg: "#dc262618" },
};

export default function ResearchPage() {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterSector, setFilterSector] = useState<string>("all");

  useEffect(() => {
    const url = filterSector === "all" ? "/api/content?type=research" : `/api/content?type=research&sector=${filterSector}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setNotes(d.data || []));
  }, [filterSector]);

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const sectors = ["all", ...Array.from(new Set(notes.map((n) => n.sector)))];

  return (
    <div className="min-h-screen" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" target="_top" className="text-xs mb-1 block hover:underline" style={{ color: "var(--ag-muted)" }}>
              &larr; AntiGravi IDE
            </Link>
            <h1 className="text-xl font-bold" style={{ color: "var(--ag-accent2)" }}>NFS Equity Research</h1>
            <p className="text-xs mt-1" style={{ color: "var(--ag-muted)" }}>Nur Financial Services — Analyst coverage & ratings</p>
          </div>
          <div className="flex items-center gap-1.5">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setFilterSector(sec)}
                className="px-2.5 py-1 text-[11px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filterSector === sec ? "rgba(99,102,241,0.15)" : "transparent",
                  color: filterSector === sec ? "var(--ag-accent2)" : "var(--ag-muted)",
                  border: `1px solid ${filterSector === sec ? "var(--ag-accent2)" : "var(--ag-border)"}`,
                }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-3">
          {notes.map((note) => {
            const rat = RATING_CONFIG[note.rating] || RATING_CONFIG.hold;
            return (
              <article
                key={note.id}
                className="rounded-lg border p-4 cursor-pointer transition-colors"
                style={{ background: "var(--ag-surface)", borderColor: expanded === note.id ? "var(--ag-accent2)" : "var(--ag-border)" }}
                onClick={() => setExpanded(expanded === note.id ? null : note.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center" style={{ minWidth: 72 }}>
                    <div
                      className="text-xs font-bold uppercase px-2 py-1 rounded mb-1"
                      style={{ background: rat.bg, color: rat.color }}
                    >
                      {note.rating}
                    </div>
                    {note.targetPrice && (
                      <div className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>
                        TP ${note.targetPrice}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--ag-accent2)" }}>
                        {note.sector}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{timeAgo(note.publishedAt)}</span>
                      <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{note.author}</span>
                    </div>
                    <h2 className="text-sm font-semibold mb-1">{note.title}</h2>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--ag-muted)" }}>{note.abstract}</p>

                    {expanded === note.id && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--ag-border)" }}>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ag-text)" }}>{note.body}</p>
                        <div className="flex gap-1.5">
                          {note.tickers.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--ag-surface2)", color: "var(--ag-accent)" }}>
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
      </main>
    </div>
  );
}
