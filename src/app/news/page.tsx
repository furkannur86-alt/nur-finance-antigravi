"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MarketBrief } from "@/lib/content/nfs-content";

const CATEGORY_COLORS: Record<string, string> = {
  macro: "#6366f1",
  equity: "#00d4aa",
  fx: "#f59e0b",
  crypto: "#a855f7",
  commodities: "#ef4444",
};

const SENTIMENT_ICON: Record<string, string> = {
  bullish: "▲",
  bearish: "▼",
  neutral: "●",
};

export default function NewsPage() {
  const [briefs, setBriefs] = useState<MarketBrief[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = filter === "all" ? "/api/content?type=briefs" : `/api/content?type=briefs&category=${filter}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setBriefs(d.data || []); });
    return () => { cancelled = true; };
  }, [filter]);

  const [now] = useState(() => Date.now());
  function timeAgo(iso: string): string {
    const diff = now - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" target="_top" className="text-xs mb-1 block hover:underline" style={{ color: "var(--ag-muted)" }}>
              &larr; AntiGravi IDE
            </Link>
            <h1 className="text-xl font-bold" style={{ color: "var(--ag-accent)" }}>NFS Market Briefs</h1>
            <p className="text-xs mt-1" style={{ color: "var(--ag-muted)" }}>Nur Financial Services — Real-time market intelligence</p>
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "macro", "equity", "fx", "crypto", "commodities"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-2.5 py-1 text-[11px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filter === cat ? "rgba(0,212,170,0.15)" : "transparent",
                  color: filter === cat ? "var(--ag-accent)" : "var(--ag-muted)",
                  border: `1px solid ${filter === cat ? "var(--ag-accent)" : "var(--ag-border)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-3">
          {briefs.map((brief) => (
            <article
              key={brief.id}
              className="rounded-lg border p-4 transition-colors cursor-pointer"
              style={{ background: "var(--ag-surface)", borderColor: expanded === brief.id ? "var(--ag-accent)" : "var(--ag-border)" }}
              onClick={() => setExpanded(expanded === brief.id ? null : brief.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[brief.category] || "var(--ag-muted)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: `${CATEGORY_COLORS[brief.category]}22`, color: CATEGORY_COLORS[brief.category] }}
                    >
                      {brief.category}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: brief.sentiment === "bullish" ? "var(--ag-success)" : brief.sentiment === "bearish" ? "var(--ag-danger)" : "var(--ag-muted)" }}
                    >
                      {SENTIMENT_ICON[brief.sentiment]} {brief.sentiment.toUpperCase()}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{timeAgo(brief.publishedAt)}</span>
                    <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{brief.author}</span>
                  </div>
                  <h2 className="text-sm font-semibold mb-1">{brief.title}</h2>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--ag-muted)" }}>{brief.summary}</p>

                  {expanded === brief.id && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--ag-border)" }}>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ag-text)" }}>{brief.body}</p>
                      <div className="flex gap-1.5">
                        {brief.tickers.map((t) => (
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
          ))}
        </div>
      </main>
    </div>
  );
}
