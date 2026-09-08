"use client";

import LiveChart from "./LiveChart";

const symbols = [
  { symbol: "AAPL", color: "#00d4aa" },
  { symbol: "MSFT", color: "#6366f1" },
  { symbol: "GOOGL", color: "#f59e0b" },
  { symbol: "NVDA", color: "#3b82f6" },
  { symbol: "TSLA", color: "#ef4444" },
  { symbol: "BTC-USD", color: "#f97316" },
];

export default function ChartsPanel() {
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
            <LiveChart symbol={s.symbol} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
