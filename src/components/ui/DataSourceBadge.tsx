"use client";

export default function DataSourceBadge({ source }: { source: "live" | "demo" }) {
  const isLive = source === "live";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: isLive ? "rgba(0,212,170,0.15)" : "rgba(255,170,0,0.15)",
        color: isLive ? "var(--ag-success, #00d4aa)" : "var(--ag-warning, #ffaa00)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: isLive ? "var(--ag-success, #00d4aa)" : "var(--ag-warning, #ffaa00)",
          animation: isLive ? "pulse 2s infinite" : "none",
        }}
      />
      {isLive ? "LIVE" : "DEMO"}
    </span>
  );
}
