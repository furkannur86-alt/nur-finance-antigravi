"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";

interface Props {
  label: string;
  children: React.ReactNode;
}

// ── Floating / draggable window ────────────────────────────────────────────────
function FloatingWindow({ label, children, onClose }: { label: string; children: React.ReactNode; onClose: () => void }) {
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [size, setSize] = useState({ w: window.innerWidth * 0.72, h: window.innerHeight * 0.72 });
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, w: 0, h: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (dragging.current) {
        setPos({ x: dragStart.current.px + e.clientX - dragStart.current.mx, y: dragStart.current.py + e.clientY - dragStart.current.my });
      }
      if (resizing.current) {
        setSize({
          w: Math.max(360, resizeStart.current.w + e.clientX - resizeStart.current.mx),
          h: Math.max(240, resizeStart.current.h + e.clientY - resizeStart.current.my),
        });
      }
    }
    function onUp() { dragging.current = false; resizing.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x, top: pos.y,
        width: size.w, height: size.h,
        zIndex: 9990,
        display: "flex", flexDirection: "column",
        background: "#040a16",
        border: "1px solid rgba(0,212,170,0.35)",
        borderRadius: 6,
        boxShadow: "0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,170,0.08)",
      }}
    >
      {/* title bar */}
      <div
        onMouseDown={(e) => {
          dragging.current = true;
          dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
        }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "5px 10px",
          background: "rgba(0,212,170,0.06)",
          borderBottom: "1px solid rgba(0,212,170,0.18)",
          borderRadius: "6px 6px 0 0",
          cursor: "move",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#00d4aa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ⧉ {label}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => useIDEStore.getState().setExpandedPanel("maximized")}
            title="Maximize"
            style={{ background: "none", border: "none", color: "rgba(0,212,170,0.6)", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
          >⛶</button>
          <button
            onClick={onClose}
            title="Close"
            style={{ background: "none", border: "none", color: "rgba(255,80,80,0.7)", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
          >✕</button>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {children}
      </div>

      {/* resize handle */}
      <div
        onMouseDown={(e) => {
          resizing.current = true;
          resizeStart.current = { mx: e.clientX, my: e.clientY, w: size.w, h: size.h };
        }}
        style={{
          position: "absolute", right: 0, bottom: 0, width: 14, height: 14,
          cursor: "nwse-resize",
          background: "linear-gradient(135deg, transparent 50%, rgba(0,212,170,0.35) 50%)",
          borderRadius: "0 0 6px 0",
        }}
      />
    </div>
  );
}

// ── Maximized overlay ──────────────────────────────────────────────────────────
function MaximizedOverlay({ label, children, onClose }: { label: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9995,
        background: "#040a16",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 14px",
        background: "rgba(0,212,170,0.06)",
        borderBottom: "1px solid rgba(0,212,170,0.2)",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#00d4aa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ⛶ {label} — Full Screen
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(0,212,170,0.35)" }}>ESC to close</span>
          <button
            onClick={() => useIDEStore.getState().setExpandedPanel("floating")}
            title="Float"
            style={{ background: "none", border: "none", color: "rgba(0,212,170,0.6)", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
          >⧉</button>
          <button
            onClick={onClose}
            title="Close"
            style={{ background: "none", border: "none", color: "rgba(255,80,80,0.7)", cursor: "pointer", fontSize: 12, padding: "0 2px" }}
          >✕</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

// ── Main wrapper ───────────────────────────────────────────────────────────────
export default function PanelExpander({ label, children }: Props) {
  const { expandedPanel, setExpandedPanel } = useIDEStore();

  if (expandedPanel === "maximized") {
    return (
      <>
        {/* Original slot kept but invisible so layout doesn't collapse */}
        <div style={{ flex: 1, minHeight: 0, visibility: "hidden" }} aria-hidden />
        <MaximizedOverlay label={label} onClose={() => setExpandedPanel(null)}>
          {children}
        </MaximizedOverlay>
      </>
    );
  }

  if (expandedPanel === "floating") {
    return (
      <>
        {/* Dimmed original in place */}
        <div style={{ flex: 1, minHeight: 0, opacity: 0.15, pointerEvents: "none" }} aria-hidden>{children}</div>
        <FloatingWindow label={label} onClose={() => setExpandedPanel(null)}>
          {children}
        </FloatingWindow>
      </>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Expand / float buttons — top-right corner */}
      <div
        style={{
          position: "absolute", top: 6, right: 8, zIndex: 60,
          display: "flex", gap: 4,
        }}
      >
        <button
          onClick={() => setExpandedPanel("floating")}
          title="Float panel"
          style={{
            background: "rgba(4,10,22,0.85)",
            border: "1px solid rgba(0,212,170,0.22)",
            borderRadius: 3,
            color: "rgba(0,212,170,0.55)",
            fontSize: 11,
            padding: "1px 5px",
            cursor: "pointer",
            fontFamily: "monospace",
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.55)")}
        >
          ⧉
        </button>
        <button
          onClick={() => setExpandedPanel("maximized")}
          title="Maximize panel"
          style={{
            background: "rgba(4,10,22,0.85)",
            border: "1px solid rgba(0,212,170,0.22)",
            borderRadius: 3,
            color: "rgba(0,212,170,0.55)",
            fontSize: 11,
            padding: "1px 5px",
            cursor: "pointer",
            fontFamily: "monospace",
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.55)")}
        >
          ⛶
        </button>
      </div>
      {children}
    </div>
  );
}
