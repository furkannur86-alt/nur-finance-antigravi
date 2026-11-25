"use client";

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
  format?: "number" | "currency" | "percent" | "change";
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  compact?: boolean;
}

function formatValue(val: unknown, format?: string): string {
  if (val == null) return "—";
  const n = Number(val);
  if (isNaN(n)) return String(val);
  switch (format) {
    case "currency": return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percent": return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
    case "change": return `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;
    case "number": return n.toLocaleString();
    default: return String(val);
  }
}

function changeColor(val: unknown): string {
  const n = Number(val);
  if (isNaN(n)) return "#e2e8f0";
  return n > 0 ? "#10b981" : n < 0 ? "#ef4444" : "#64748b";
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, compact }: DataTableProps<T>) {
  const py = compact ? "py-[3px]" : "py-1.5";
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px] font-mono" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${py} px-2 text-[9px] font-bold uppercase tracking-wider sticky top-0`}
                style={{
                  textAlign: col.align ?? "left",
                  color: "rgba(148,163,184,0.6)",
                  background: "rgba(0,0,0,0.4)",
                  borderBottom: "1px solid rgba(0,212,170,0.1)",
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className="transition-colors"
              style={{ cursor: onRowClick ? "pointer" : "default" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,170,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((col) => {
                const val = row[col.key];
                const isChange = col.format === "change" || col.format === "percent";
                return (
                  <td
                    key={col.key}
                    className={`${py} px-2`}
                    style={{
                      textAlign: col.align ?? "left",
                      color: isChange ? changeColor(val) : "#e2e8f0",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {col.render ? col.render(val, row) : formatValue(val, col.format)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
