"use client";

import { useMemo } from "react";
import { generatePriceHistory } from "@/lib/data/mockMarketData";
import PriceChart from "./PriceChart";

const symbols = [
  { symbol: "AAPL", base: 198, color: "#00d4aa" },
  { symbol: "MSFT", base: 425, color: "#6366f1" },
  { symbol: "GOOGL", base: 176, color: "#f59e0b" },
  { symbol: "NVDA", base: 875, color: "#3b82f6" },
  { symbol: "TSLA", base: 248, color: "#ef4444" },
  { symbol: "BTC", base: 67500, color: "#f97316" },
];

export default function ChartsPanel() {
  const chartDataMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof generatePriceHistory>> = {};
    for (const s of symbols) {
      map[s.symbol] = generatePriceHistory(s.symbol, 60, s.base);
    }
    return map;
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>
        Market Charts
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {symbols.map((s) => (
          <div
            key={s.symbol}
            className="rounded-lg border p-3"
            style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold" style={{ color: s.color }}>
                {s.symbol}
              </h3>
              <span className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>
                60D
              </span>
            </div>
            <PriceChart data={chartDataMap[s.symbol]} />
          </div>
        ))}
      </div>
    </div>
  );
}
