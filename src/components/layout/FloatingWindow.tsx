"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FloatingWindowConfig, PanelView } from "@/types";
import { useIDEStore } from "@/stores/useIDEStore";

interface FloatingWindowProps {
  config: FloatingWindowConfig;
  children: React.ReactNode;
}

export default function FloatingWindow({ config, children }: FloatingWindowProps) {
  const {
    closeFloatingWindow,
    updateFloatingWindow,
    toggleMaximizeFloatingWindow,
    toggleMinimizeFloatingWindow,
    focusFloatingWindow,
    popoutToNativeWindow,
  } = useIDEStore();

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const isResizing = useRef(false);
  const resizeDir = useRef<string | null>(null);
  const initialResize = useRef({ x: 0, y: 0, w: 0, h: 0, posX: 0, posY: 0 });

  const [opacity, setOpacity] = useState(config.opacity || 1.0);

  // Dragging logic
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (config.isMaximized) return;
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - config.x,
      y: e.clientY - config.y,
    };
    focusFloatingWindow(config.id);
    document.body.style.userSelect = "none";
  };

  // Resize start logic
  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    if (config.isMaximized) return;
    isResizing.current = true;
    resizeDir.current = dir;
    initialResize.current = {
      x: e.clientX,
      y: e.clientY,
      w: config.width,
      h: config.height,
      posX: config.x,
      posY: config.y,
    };
    focusFloatingWindow(config.id);
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const nextX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x));
        const nextY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.current.y));
        updateFloatingWindow(config.id, { x: nextX, y: nextY });
      } else if (isResizing.current && resizeDir.current) {
        const dx = e.clientX - initialResize.current.x;
        const dy = e.clientY - initialResize.current.y;
        const dir = resizeDir.current;

        let newW = initialResize.current.w;
        let newH = initialResize.current.h;
        let newX = initialResize.current.posX;
        let newY = initialResize.current.posY;

        if (dir.includes("e")) newW = Math.max(360, initialResize.current.w + dx);
        if (dir.includes("s")) newH = Math.max(240, initialResize.current.h + dy);
        if (dir.includes("w")) {
          const possibleW = Math.max(360, initialResize.current.w - dx);
          if (possibleW > 360) {
            newW = possibleW;
            newX = initialResize.current.posX + dx;
          }
        }
        if (dir.includes("n")) {
          const possibleH = Math.max(240, initialResize.current.h - dy);
          if (possibleH > 240) {
            newH = possibleH;
            newY = initialResize.current.posY + dy;
          }
        }

        updateFloatingWindow(config.id, { width: newW, height: newH, x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
      resizeDir.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [config.id, config.isMaximized, updateFloatingWindow]);

  if (config.isMinimized) {
    return null; // Rendered in floating taskbar pill instead
  }

  const windowStyle: React.CSSProperties = config.isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: config.zIndex,
        opacity,
      }
    : {
        position: "fixed",
        top: `${config.y}px`,
        left: `${config.x}px`,
        width: `${config.width}px`,
        height: `${config.height}px`,
        zIndex: config.zIndex,
        opacity,
      };

  return (
    <div
      style={windowStyle}
      onMouseDown={() => focusFloatingWindow(config.id)}
      className="flex flex-col rounded-2xl bg-black/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 overflow-hidden select-none transition-shadow"
    >
      {/* Window Titlebar & Drag Handle */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="h-10 px-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between cursor-move shrink-0"
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm animate-pulse" />
          <span className="font-mono font-bold text-xs text-white tracking-wide truncate max-w-[280px]">
            {config.title}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            DETACHED MODULAR VIEW
          </span>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Opacity Slider */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-slate-400">
            <span>OPAC:</span>
            <input
              type="range"
              min={0.3}
              max={1.0}
              step={0.05}
              value={opacity}
              onChange={(e) => {
                const op = parseFloat(e.target.value);
                setOpacity(op);
                updateFloatingWindow(config.id, { opacity: op });
              }}
              className="w-12 h-1 accent-cyan-400 cursor-pointer"
              title="Adjust Window Transparency"
            />
          </div>

          {/* Native Popout Multi-Monitor */}
          <button
            onClick={() => popoutToNativeWindow(config.view)}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2 py-1 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-[10px] font-mono font-bold transition-colors"
          >
            ↗ DUAL-SCREEN
          </button>

          {/* Minimize */}
          <button
            onClick={() => toggleMinimizeFloatingWindow(config.id)}
            title="Minimize to Floating Bar"
            className="w-6 h-6 rounded bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 flex items-center justify-center text-xs font-bold transition-colors"
          >
            －
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => toggleMaximizeFloatingWindow(config.id)}
            title={config.isMaximized ? "Restore Window Size" : "Maximize to Fullscreen"}
            className="w-6 h-6 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 flex items-center justify-center text-xs font-bold transition-colors"
          >
            {config.isMaximized ? "❐" : "⤢"}
          </button>

          {/* Close / Dock Back */}
          <button
            onClick={() => closeFloatingWindow(config.id)}
            title="Close & Dock Back to Workspace"
            className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body / Interactive Content */}
      <div className="flex-1 relative overflow-auto bg-slate-950/90 text-slate-100 select-text">
        {children}
      </div>

      {/* Resize Handles (Only if not maximized) */}
      {!config.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-cyan-400/30"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize hover:bg-cyan-400/30"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-cyan-400/60"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "w")}
            className="absolute top-0 left-0 w-2 h-full cursor-ew-resize hover:bg-cyan-400/30"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize hover:bg-cyan-400/60"
          />
        </>
      )}
    </div>
  );
}
