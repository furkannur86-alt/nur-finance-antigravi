"use client";

import { useState, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Cockpit HUD corner bracket — four corners with angular markers
// ─────────────────────────────────────────────────────────────────────────────
function HUDCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const isTop = pos[0] === "t";
  const isLeft = pos[1] === "l";

  const x1 = isLeft ? 3 : 61, y1 = isTop ? 3 : 61;
  const x2 = isLeft ? 3 : 61, y2 = isTop ? 28 : 36;
  const x3 = isLeft ? 28 : 36, y3 = isTop ? 3 : 61;

  return (
    <div
      className="absolute z-40 pointer-events-none"
      style={{
        width: 64, height: 64,
        top: isTop ? 0 : "auto",
        bottom: isTop ? "auto" : 0,
        left: isLeft ? 0 : "auto",
        right: isLeft ? "auto" : 0,
      }}
    >
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
        {/* L-bracket */}
        <path
          d={`M${x2} ${y2} L${x1} ${y1} L${x3} ${y3}`}
          stroke="rgba(0,212,170,0.65)"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        {/* Corner dot */}
        <circle cx={x1} cy={y1} r="2" fill="#00d4aa" opacity="0.9" />
        {/* Short tick marks */}
        {isLeft ? (
          <line x1={x1 + 6} y1={y1} x2={x1 + 10} y2={y1} stroke="rgba(0,212,170,0.3)" strokeWidth="1" />
        ) : (
          <line x1={x1 - 6} y1={y1} x2={x1 - 10} y2={y1} stroke="rgba(0,212,170,0.3)" strokeWidth="1" />
        )}
        {isTop ? (
          <line x1={x1} y1={y1 + 6} x2={x1} y2={y1 + 10} stroke="rgba(0,212,170,0.3)" strokeWidth="1" />
        ) : (
          <line x1={x1} y1={y1 - 6} x2={x1} y2={y1 - 10} stroke="rgba(0,212,170,0.3)" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Zoom control pill
// ─────────────────────────────────────────────────────────────────────────────
function ZoomControls({
  zoom,
  onIn,
  onOut,
  onReset,
}: {
  zoom: number;
  onIn: () => void;
  onOut: () => void;
  onReset: () => void;
}) {
  return (
    <div
      className="absolute z-50 flex items-center gap-0.5 select-none"
      style={{
        bottom: 28,
        right: 12,
        background: "rgba(4,10,22,0.92)",
        border: "1px solid rgba(0,212,170,0.25)",
        borderRadius: 6,
        boxShadow: "0 0 12px rgba(0,212,170,0.08)",
        padding: "2px 4px",
      }}
    >
      <button
        onClick={onOut}
        className="w-5 h-5 flex items-center justify-center text-[11px] font-mono font-bold transition-colors rounded"
        style={{ color: "rgba(0,212,170,0.7)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.7)")}
        title="Zoom out (Ctrl+−)"
      >
        −
      </button>
      <button
        onClick={onReset}
        className="px-1.5 h-5 flex items-center justify-center text-[9px] font-mono font-bold transition-colors rounded"
        style={{ color: "rgba(0,212,170,0.5)", minWidth: 32 }}
        onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.5)")}
        title="Reset zoom (Ctrl+0)"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={onIn}
        className="w-5 h-5 flex items-center justify-center text-[11px] font-mono font-bold transition-colors rounded"
        style={{ color: "rgba(0,212,170,0.7)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.7)")}
        title="Zoom in (Ctrl+=)"
      >
        +
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main cockpit frame
// ─────────────────────────────────────────────────────────────────────────────
export default function CockpitFrame({ children }: { children: React.ReactNode }) {
  const [zoom, setZoom] = useState(1.0);

  const zoomIn  = useCallback(() => setZoom(z => Math.min(1.5, parseFloat((z + 0.1).toFixed(1)))), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(0.5, parseFloat((z - 0.1).toFixed(1)))), []);
  const zoomReset = useCallback(() => setZoom(1.0), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      if (e.key === "=" || e.key === "+") { e.preventDefault(); zoomIn(); }
      if (e.key === "-")                  { e.preventDefault(); zoomOut(); }
      if (e.key === "0")                  { e.preventDefault(); zoomReset(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomIn, zoomOut, zoomReset]);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ background: "var(--ag-bg)" }}
    >
      {/* ── Deep space atmosphere ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 35% at 50% 0%, rgba(0,90,160,0.07) 0%, transparent 100%),
            radial-gradient(ellipse 35% 60% at 0% 60%, rgba(0,180,130,0.045) 0%, transparent 100%),
            radial-gradient(ellipse 35% 60% at 100% 60%, rgba(99,102,241,0.04) 0%, transparent 100%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,50,100,0.06) 0%, transparent 100%)
          `,
        }}
      />

      {/* ── Scaled content ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>

      {/* ── Screen vignette ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 55%, rgba(1,4,12,0.82) 100%)",
        }}
      />

      {/* ── Scan line overlay ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)",
        }}
      />

      {/* ── Edge accent lines ─────────────────────────────────────────────── */}
      {/* Top */}
      <div
        className="absolute top-0 left-16 right-16 pointer-events-none z-40"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.22) 30%, rgba(0,212,170,0.22) 70%, transparent)" }}
      />
      {/* Bottom */}
      <div
        className="absolute bottom-0 left-16 right-16 pointer-events-none z-40"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.12) 30%, rgba(0,212,170,0.12) 70%, transparent)" }}
      />

      {/* ── Corner HUD brackets ──────────────────────────────────────────── */}
      <HUDCorner pos="tl" />
      <HUDCorner pos="tr" />
      <HUDCorner pos="bl" />
      <HUDCorner pos="br" />

      {/* ── Zoom controls ────────────────────────────────────────────────── */}
      <ZoomControls zoom={zoom} onIn={zoomIn} onOut={zoomOut} onReset={zoomReset} />
    </div>
  );
}
