export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "var(--ag-bg)" }}>
      <div className="text-center">
        <div className="text-sm font-mono animate-pulse" style={{ color: "var(--ag-accent)" }}>
          Loading...
        </div>
      </div>
    </div>
  );
}
