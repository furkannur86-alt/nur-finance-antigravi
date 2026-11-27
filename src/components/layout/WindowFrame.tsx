"use client";

import React, { useState, useRef, useCallback } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PANELS, type PanelView } from "@/panels/registry";

interface WindowFrameProps {
  view: PanelView;
  children: React.ReactNode;
}

export default function WindowFrame({ view, children }: WindowFrameProps) {
  const { setActiveView, openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const [isMaximized, setIsMaximized] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 });

  const entry = PANELS[view as keyof typeof PANELS];
  const title = entry?.label || view;
  const icon = entry?.icon || "📊";
  const group = entry?.group || "";

  const handleRestore = useCallback(() => {
    if (isMaximized) {
      const parentEl = containerRef.current?.parentElement;
      const pw = parentEl?.clientWidth || 800;
      const ph = parentEl?.clientHeight || 600;
      setSize({ w: Math.round(pw * 0.75), h: Math.round(ph * 0.75) });
      setPos({ x: Math.round(pw * 0.125), y: Math.round(ph * 0.125) });
      setIsMaximized(false);
    } else {
      setIsMaximized(true);
    }
  }, [isMaximized]);

  const handleDetach = useCallback(() => {
    openFloatingWindow(view, `${icon} ${title}`);
    setActiveView("dashboard");
  }, [view, icon, title, openFloatingWindow, setActiveView]);

  const handleHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({
        x: Math.max(0, ev.clientX - dragOffset.current.x),
        y: Math.max(0, ev.clientY - dragOffset.current.y),
      });
    };
    const onUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isMaximized, pos]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    if (isMaximized) return;
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h, px: pos.x, py: pos.y };
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = ev.clientX - resizeStart.current.x;
      const dy = ev.clientY - resizeStart.current.y;
      let nw = resizeStart.current.w, nh = resizeStart.current.h;
      let nx = resizeStart.current.px, ny = resizeStart.current.py;
      if (dir.includes("e")) nw = Math.max(400, resizeStart.current.w + dx);
      if (dir.includes("s")) nh = Math.max(300, resizeStart.current.h + dy);
      if (dir.includes("w")) {
        const pw = Math.max(400, resizeStart.current.w - dx);
        if (pw > 400) { nw = pw; nx = resizeStart.current.px + dx; }
      }
      if (dir.includes("n")) {
        const ph = Math.max(300, resizeStart.current.h - dy);
        if (ph > 300) { nh = ph; ny = resizeStart.current.py + dy; }
      }
      setSize({ w: nw, h: nh });
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isMaximized, size, pos]);

  if (isMinimized) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "#0a0e17" }}>
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-white/[0.03] hover:bg-cyan-500/5 transition-all"
        >
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-mono font-bold text-white">{title}</span>
          <span className="text-[10px] font-mono text-cyan-400 ml-2">CLICK TO RESTORE</span>
        </button>
      </div>
    );
  }

  const frameStyle: React.CSSProperties = isMaximized
    ? { position: "relative" as const, width: "100%", height: "100%" }
    : {
        position: "absolute" as const,
        top: pos.y,
        left: pos.x,
        width: size.w,
        height: size.h,
        zIndex: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      };

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ background: "#0a0e17" }}>
      <div
        style={frameStyle}
        className={`flex flex-col overflow-hidden ${!isMaximized ? "rounded-lg border border-cyan-500/30" : ""}`}
      >
        {/* Title bar */}
        <div
          onMouseDown={handleHeaderMouseDown}
          onDoubleClick={handleRestore}
          className="flex items-center h-8 px-2 shrink-0 select-none"
          style={{
            background: "linear-gradient(to right, #0d1117, #161b22, #0d1117)",
            borderBottom: "1px solid rgba(0,229,160,0.12)",
            cursor: isMaximized ? "default" : "move",
          }}
        >
          <span className="text-xs mr-1.5">{icon}</span>
          <span className="text-[11px] font-mono font-bold text-white/90 truncate max-w-[260px]">{title}</span>
          {group && (
            <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">
              {group}
            </span>
          )}
          <div className="flex-1" />

          <div className="flex items-center gap-0.5">
            <button onClick={handleDetach} title="Detach as floating window"
              className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-white/40 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
              ⧉
            </button>
            <button onClick={() => popoutToNativeWindow(view)} title="Open in new browser window (multi-monitor)"
              className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-white/40 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
              ↗
            </button>
            <button onClick={() => setIsMinimized(true)} title="Minimize"
              className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-white/40 hover:text-amber-300 hover:bg-amber-500/10 transition-colors">
              ─
            </button>
            <button onClick={handleRestore} title={isMaximized ? "Restore to windowed" : "Maximize"}
              className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-white/40 hover:text-green-300 hover:bg-green-500/10 transition-colors">
              {isMaximized ? "❐" : "⤢"}
            </button>
            <button onClick={() => setActiveView("dashboard")} title="Close"
              className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.03, zIndex: 0 }}>
            <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M80 95 L60 60 L50 65 L40 45 L35 55 L22 30 L28 58 L18 42 L26 68 L15 58 L28 82 L35 78 L30 90 L45 82 L55 88 L65 92Z" fill="#cc0000"/>
              <path d="M120 95 L140 60 L150 65 L160 45 L165 55 L178 30 L172 58 L182 42 L174 68 L185 58 L172 82 L165 78 L170 90 L155 82 L145 88 L135 92Z" fill="#cc0000"/>
              <path d="M88 80 C88 70 92 62 100 60 C108 62 112 70 112 80 L112 120 C112 130 108 138 100 140 C92 138 88 130 88 120Z" fill="#cc0000"/>
              <path d="M80 62 C74 56 70 48 72 42 C74 38 78 36 82 38 C86 40 88 46 88 52 C88 56 86 60 82 64Z" fill="#cc0000"/>
              <path d="M120 62 C126 56 130 48 128 42 C126 38 122 36 118 38 C114 40 112 46 112 52 C112 56 114 60 118 64Z" fill="#cc0000"/>
              <polygon points="84,36 88,22 93,30 97,18 100,14 103,18 107,30 112,22 116,36" fill="#cc0000"/>
              <circle cx="100" cy="105" r="14" fill="#0a0a0a" stroke="#cc0000" strokeWidth="1.5"/>
              <text x="100" y="107" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontFamily="Georgia,serif" fontWeight="bold" fontSize="12">NF</text>
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 1 }}>{children}</div>
        </div>

        {/* Resize handles when not maximized */}
        {!isMaximized && (
          <>
            <div onMouseDown={(e) => handleResizeMouseDown(e, "e")} className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize hover:bg-cyan-500/20" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "s")} className="absolute bottom-0 left-0 h-1.5 w-full cursor-ns-resize hover:bg-cyan-500/20" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "se")} className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize hover:bg-cyan-500/30" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "w")} className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize hover:bg-cyan-500/20" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "n")} className="absolute top-0 left-0 h-1.5 w-full cursor-ns-resize hover:bg-cyan-500/20" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "nw")} className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize hover:bg-cyan-500/30" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "ne")} className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize hover:bg-cyan-500/30" />
            <div onMouseDown={(e) => handleResizeMouseDown(e, "sw")} className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize hover:bg-cyan-500/30" />
          </>
        )}
      </div>
    </div>
  );
}
