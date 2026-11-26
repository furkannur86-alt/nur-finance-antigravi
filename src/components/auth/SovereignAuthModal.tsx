"use client";

import { useIDEStore } from "@/stores/useIDEStore";

export default function SovereignAuthModal() {
  const { sovereignAuthModalOpen, setSovereignAuthModalOpen, setSovereignAdmin } = useIDEStore();

  if (!sovereignAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSovereignAuthModalOpen(false)}>
      <div
        className="w-full max-w-sm rounded-xl border p-6 shadow-2xl space-y-4"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Admin Authentication</h2>
          <p className="text-xs" style={{ color: "var(--ag-muted)" }}>Enter your admin passkey to access restricted panels.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSovereignAdmin(true);
            setSovereignAuthModalOpen(false);
          }}
          className="space-y-3"
        >
          <input
            type="password"
            placeholder="Admin passkey"
            className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent outline-none"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-xs font-bold transition-colors"
            style={{ background: "var(--ag-accent)", color: "#000" }}
          >
            Authenticate
          </button>
        </form>
        <button
          onClick={() => setSovereignAuthModalOpen(false)}
          className="w-full py-1.5 text-xs rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: "var(--ag-muted)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
