"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <div className="text-center max-w-md px-6">
        <div className="text-5xl mb-4 font-mono" style={{ color: "var(--ag-danger)", opacity: 0.6 }}>!</div>
        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--ag-danger)" }}>Something went wrong</h1>
        <p className="text-sm mb-6" style={{ color: "var(--ag-muted)" }}>{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
