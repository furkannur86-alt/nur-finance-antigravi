"use client";

import { useState, useEffect } from "react";
import { ChartDataPoint } from "@/types";
import PriceChart from "./PriceChart";

interface Props {
  symbol: string;
  color: string;
}

export default function LiveChart({ symbol, color }: Props) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [source, setSource] = useState<string>("loading");
  const [range, setRange] = useState("3mo");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/market-data?type=history&symbol=${symbol}&range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setData(json.chart || []);
        setSource(json.source || "unknown");
      })
      .catch(() => { if (!cancelled) setSource("error"); });
    return () => { cancelled = true; };
  }, [symbol, range]);

  const ranges = ["1mo", "3mo", "6mo", "1y"];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold" style={{ color }}>
            {symbol}
          </h3>
          <span
            className="text-[9px] px-1 py-0.5 rounded font-mono"
            style={{
              background: source === "live" ? "rgba(0,212,170,0.1)" : "rgba(251,191,36,0.1)",
              color: source === "live" ? "var(--ag-accent)" : "var(--ag-warning)",
            }}
          >
            {source === "loading" ? "..." : source.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors"
              style={{
                background: range === r ? "rgba(0,212,170,0.15)" : "transparent",
                color: range === r ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {data.length > 0 ? (
        <PriceChart data={data} />
      ) : (
        <div className="flex items-center justify-center" style={{ height: 180, color: "var(--ag-muted)" }}>
          <span className="text-xs">Loading...</span>
        </div>
      )}
    </div>
  );
}
