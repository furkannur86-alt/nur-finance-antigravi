"use client";

import { useState, useEffect } from "react";
import { MarketQuote } from "@/types";

export default function LiveWatchList() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [source, setSource] = useState<string>("loading");
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    function fetchData() {
      fetch("/api/market-data?type=quotes")
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          setQuotes(data.data || []);
          setSource(data.source || "unknown");
          setLastUpdate(new Date().toLocaleTimeString("en-US", { hour12: false }));
        })
        .catch(() => { if (!cancelled) setSource("error"); });
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>
            Watchlist
          </h3>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-mono"
            style={{
              background: source === "live" ? "rgba(0,212,170,0.15)" : "rgba(251,191,36,0.15)",
              color: source === "live" ? "var(--ag-accent)" : "var(--ag-warning)",
            }}
          >
            {source === "loading" ? "..." : source === "live" ? "LIVE" : "MOCK"}
          </span>
        </div>
        {lastUpdate && (
          <span className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>
            {lastUpdate}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: "var(--ag-muted)" }}>
              <th className="text-left py-1 font-medium">Symbol</th>
              <th className="text-left py-1 font-medium">Name</th>
              <th className="text-right py-1 font-medium">Price</th>
              <th className="text-right py-1 font-medium">Change</th>
              <th className="text-right py-1 font-medium">%</th>
              <th className="text-right py-1 font-medium">Volume</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.symbol} className="border-t" style={{ borderColor: "var(--ag-border)" }}>
                <td className="py-1.5 font-bold" style={{ color: "var(--ag-accent)" }}>
                  {q.symbol}
                </td>
                <td className="py-1.5" style={{ color: "var(--ag-text)" }}>
                  {q.name.length > 20 ? q.name.slice(0, 20) + "..." : q.name}
                </td>
                <td className="text-right py-1.5 font-mono" style={{ color: "var(--ag-text)" }}>
                  ${q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td
                  className="text-right py-1.5 font-mono"
                  style={{ color: q.change >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}
                >
                  {q.change >= 0 ? "+" : ""}
                  {q.change.toFixed(2)}
                </td>
                <td
                  className="text-right py-1.5 font-mono"
                  style={{ color: q.changePercent >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}
                >
                  {q.changePercent >= 0 ? "+" : ""}
                  {q.changePercent.toFixed(2)}%
                </td>
                <td className="text-right py-1.5 font-mono" style={{ color: "var(--ag-muted)" }}>
                  {q.volume > 1000000
                    ? (q.volume / 1000000).toFixed(1) + "M"
                    : q.volume > 1000
                      ? (q.volume / 1000).toFixed(0) + "K"
                      : q.volume.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
