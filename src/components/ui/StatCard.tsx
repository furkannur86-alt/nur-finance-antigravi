"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ label, value, change, icon, color = "#00d4aa", subtitle }: StatCardProps) {
  const changeColor = change != null ? (change >= 0 ? "#10b981" : "#ef4444") : undefined;
  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-1"
      style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-xs">{icon}</span>}
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.6)" }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold font-mono" style={{ color, fontVariantNumeric: "tabular-nums" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {change != null && (
          <span className="text-[10px] font-mono font-bold" style={{ color: changeColor }}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.5)" }}>{subtitle}</span>
      )}
    </div>
  );
}
