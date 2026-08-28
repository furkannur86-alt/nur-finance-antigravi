"use client";

interface Props {
  data: Record<string, { price: number; change: number }>;
}

export default function WatchList({ data }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ color: "var(--ag-muted)" }}>
            <th className="text-left py-1 font-medium">Symbol</th>
            <th className="text-right py-1 font-medium">Price</th>
            <th className="text-right py-1 font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([symbol, info]) => (
            <tr key={symbol} className="border-t" style={{ borderColor: "var(--ag-border)" }}>
              <td className="py-1.5 font-medium" style={{ color: "var(--ag-text)" }}>
                {symbol}
              </td>
              <td className="text-right py-1.5 font-mono" style={{ color: "var(--ag-text)" }}>
                ${info.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td
                className="text-right py-1.5 font-mono"
                style={{ color: info.change >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}
              >
                {info.change >= 0 ? "+" : ""}
                {info.change.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
