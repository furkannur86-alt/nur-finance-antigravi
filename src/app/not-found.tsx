import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-4 font-mono" style={{ color: "var(--ag-accent)", opacity: 0.3 }}>404</div>
        <h1 className="text-lg font-bold mb-2">Page not found</h1>
        <p className="text-sm mb-6" style={{ color: "var(--ag-muted)" }}>
          The route you requested does not exist in the AntiGravi IDE.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded text-sm font-medium"
          style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
        >
          Back to IDE
        </Link>
      </div>
    </div>
  );
}
