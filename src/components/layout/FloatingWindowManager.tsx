"use client";

import React, { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { useIDEStore } from "@/stores/useIDEStore";
import FloatingWindow from "./FloatingWindow";
import { PANELS, type PanelView } from "@/panels/registry";

const panelComponents = Object.fromEntries(
  Object.entries(PANELS).map(([id, entry]) => [
    id,
    dynamic(entry.load as () => Promise<{ default: React.ComponentType }>, { ssr: false }),
  ])
) as Record<PanelView, React.ComponentType>;

export default function FloatingWindowManager() {
  const { floatingWindows, closeFloatingWindow, focusFloatingWindow } = useIDEStore();

  if (floatingWindows.length === 0) return null;

  const renderModule = (view: PanelView) => {
    const Component = panelComponents[view] ?? panelComponents["dashboard"];
    return <Component />;
  };

  const minimizedWindows = floatingWindows.filter((w) => w.isMinimized);

  return (
    <>
      {/* Active Floating & Resizable Windows */}
      {floatingWindows.map((win) => (
        <FloatingWindow key={win.id} config={win}>
          {renderModule(win.view)}
        </FloatingWindow>
      ))}

      {/* Floating Taskbar Dock for Minimized Windows */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-cyan-500/50 shadow-2xl shadow-cyan-950 font-mono text-xs">
          <span className="text-[10px] text-cyan-400 font-bold px-2 flex items-center gap-1.5 border-r border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>MODULAR DOCK ({minimizedWindows.length})</span>
          </span>
          {minimizedWindows.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group"
              onClick={() => focusFloatingWindow(w.id)}
            >
              <span className="text-white font-bold text-[11px] group-hover:text-cyan-300">
                {w.title.split(" ")[0]} {w.title.split(" ")[1] || ""}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFloatingWindow(w.id);
                }}
                className="text-slate-500 hover:text-red-400 text-[10px] font-bold ml-1"
                title="Close"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
