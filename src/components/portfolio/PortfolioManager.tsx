"use client";

import { useMemo } from "react";
import { generatePortfolio } from "@/lib/data/mockMarketData";

export default function PortfolioManager() {
  const portfolio = useMemo(() => generatePortfolio(), []);
  const totalValue = portfolio.reduce((s, p) => s + p.currentPrice * p.quantity, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>
          Portfolio Manager
        </h2>
        <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
          Total: ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
              <th className="text-left p-2 font-medium">Symbol</th>
              <th className="text-left p-2 font-medium">Name</th>
              <th className="text-right p-2 font-medium">Qty</th>
              <th className="text-right p-2 font-medium">Avg Price</th>
              <th className="text-right p-2 font-medium">Current</th>
              <th className="text-right p-2 font-medium">P&L</th>
              <th className="text-right p-2 font-medium">Return</th>
              <th className="text-right p-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => {
              const value = item.currentPrice * item.quantity;
              const pnl = item.change * item.quantity;
              return (
                <tr key={item.symbol} className="border-b hover:bg-white/[0.02]"
                  style={{ borderColor: "var(--ag-border)" }}>
                  <td className="p-2 font-bold" style={{ color: "var(--ag-accent)" }}>{item.symbol}</td>
                  <td className="p-2" style={{ color: "var(--ag-text)" }}>{item.name}</td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>{item.quantity}</td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>
                    ${item.avgPrice.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>
                    ${item.currentPrice.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-mono"
                    style={{ color: pnl >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                    {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-mono"
                    style={{ color: item.changePercent >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                    {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                  </td>
                  <td className="p-2 text-right font-mono font-bold" style={{ color: "var(--ag-text)" }}>
                    ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {[
          { label: "Positions", value: portfolio.length.toString() },
          { label: "Avg Return", value: `${(portfolio.reduce((s, p) => s + p.changePercent, 0) / portfolio.length).toFixed(2)}%` },
          { label: "Best", value: portfolio.reduce((b, p) => p.changePercent > b.changePercent ? p : b).symbol },
          { label: "Worst", value: portfolio.reduce((w, p) => p.changePercent < w.changePercent ? p : w).symbol },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border p-2 text-center"
            style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
            <div className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>{m.label}</div>
            <div className="text-sm font-bold" style={{ color: "var(--ag-accent)" }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
