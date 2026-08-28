"use client";

interface Props {
  totalValue: number;
  totalPnL: number;
  totalReturn: number;
}

export default function MetricsCards({ totalValue, totalPnL, totalReturn }: Props) {
  const metrics = [
    {
      label: "Portfolio Value",
      value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "var(--ag-accent)",
    },
    {
      label: "Total P&L",
      value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: totalPnL >= 0 ? "var(--ag-success)" : "var(--ag-danger)",
    },
    {
      label: "Return",
      value: `${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`,
      color: totalReturn >= 0 ? "var(--ag-success)" : "var(--ag-danger)",
    },
    { label: "Sharpe Ratio", value: "1.847", color: "var(--ag-accent2)" },
    { label: "Max Drawdown", value: "-8.42%", color: "var(--ag-warning)" },
    { label: "Win Rate", value: "67.3%", color: "var(--ag-success)" },
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border p-2"
          style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>
            {m.label}
          </div>
          <div className="text-sm font-bold" style={{ color: m.color }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}
