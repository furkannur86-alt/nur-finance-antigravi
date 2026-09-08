"use client";

import { useState, useEffect, useCallback } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

const QUERIES = [
  { id: "markets", label: "Markets", q: "stock market S&P nasdaq" },
  { id: "crypto", label: "Crypto", q: "bitcoin ethereum crypto" },
  { id: "forex", label: "Forex", q: "forex currency exchange rates" },
  { id: "commodities", label: "Commodities", q: "gold oil commodities" },
  { id: "economy", label: "Economy", q: "economy GDP inflation interest rates" },
  { id: "tech", label: "Tech", q: "technology AI semiconductor" },
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsFeedPanel() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeQuery, setActiveQuery] = useState("markets");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const fetchNews = useCallback(async (queryId: string) => {
    setLoading(true);
    setError("");
    const query = QUERIES.find((q) => q.id === queryId);
    try {
      const res = await fetch(`/api/news-feed?q=${encodeURIComponent(query?.q || "finance")}&limit=30`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(activeQuery); }, [activeQuery, fetchNews]);

  useEffect(() => {
    const interval = setInterval(() => fetchNews(activeQuery), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeQuery, fetchNews]);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ag-accent)" strokeWidth="2">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>Live News Feed</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded animate-pulse" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-1 ml-2">
          {QUERIES.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveQuery(q.id)}
              className="px-2.5 py-1 text-[10px] rounded transition-colors"
              style={{
                background: activeQuery === q.id ? "rgba(0,212,170,0.15)" : "transparent",
                color: activeQuery === q.id ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <button onClick={() => fetchNews(activeQuery)} disabled={loading}
          className="px-2.5 py-1 text-[10px] rounded"
          style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* Article list */}
        <div className="flex-1 overflow-y-auto border-r" style={{ borderColor: "var(--ag-border)" }}>
          {error && (
            <div className="text-xs p-3 m-2 rounded border" style={{ borderColor: "var(--ag-error)", color: "var(--ag-error)" }}>
              {error}
            </div>
          )}

          {loading && articles.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-xs animate-pulse" style={{ color: "var(--ag-muted)" }}>Loading news...</div>
            </div>
          )}

          {articles.map((article, i) => (
            <button
              key={`${article.url}-${i}`}
              onClick={() => setSelectedArticle(article)}
              className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-white/[0.02]"
              style={{
                borderColor: "rgba(255,255,255,0.03)",
                background: selectedArticle?.url === article.url ? "rgba(0,212,170,0.05)" : "transparent",
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium line-clamp-2 mb-1" style={{ color: "var(--ag-text)" }}>
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--ag-muted)" }}>
                    <span className="font-medium" style={{ color: "var(--ag-accent)" }}>{article.source}</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Article detail */}
        <div className="w-[380px] overflow-y-auto p-4 hidden md:block">
          {selectedArticle ? (
            <div>
              <h2 className="text-sm font-bold mb-2" style={{ color: "var(--ag-text)" }}>
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-[10px] mb-3" style={{ color: "var(--ag-muted)" }}>
                <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
                  {selectedArticle.source}
                </span>
                <span>{new Date(selectedArticle.publishedAt).toLocaleString()}</span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ag-text)" }}>
                {selectedArticle.description}
              </p>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] px-3 py-1.5 rounded"
                style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
              >
                Read Full Article
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 3h7v7M13 3L6 10" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ag-border)" strokeWidth="1.5">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              </svg>
              <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>Select an article to read</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
