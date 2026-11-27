"use client";

import { useState } from "react";
import MetallicGlobe from "./MetallicGlobe";

interface GlobeWidgetProps {
  width?: number;
  height?: number;
  headlines?: string[];
  title?: string;
}

export default function GlobeWidget({
  width = 300,
  height = 300,
  headlines = [],
  title = "GLOBAL MARKETS",
}: GlobeWidgetProps) {
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all hover:scale-105"
        style={{
          background: "rgba(200,0,0,0.1)",
          border: "1px solid rgba(200,0,0,0.3)",
          color: "#cc4444",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        Open Globe
      </button>
    );
  }

  const containerStyle = maximized
    ? { position: "fixed" as const, inset: 0, zIndex: 50, background: "#020810" }
    : {};

  return (
    <div style={containerStyle} className="flex flex-col">
      {/* Title bar with window controls */}
      <div
        className="flex items-center h-7 px-2 shrink-0 select-none"
        style={{
          background: "linear-gradient(to right, #0a0e17, #111827, #0a0e17)",
          borderBottom: "1px solid rgba(200,0,0,0.15)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cc4444" strokeWidth="2" className="mr-1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
        </svg>
        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">{title}</span>
        <div className="flex-1" />

        {/* Window controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setMinimized(!minimized)}
            title={minimized ? "Restore" : "Minimize"}
            className="w-5 h-4 flex items-center justify-center rounded text-[9px] text-white/40 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            ─
          </button>
          <button
            onClick={() => setMaximized(!maximized)}
            title={maximized ? "Restore" : "Maximize"}
            className="w-5 h-4 flex items-center justify-center rounded text-[9px] text-white/40 hover:text-green-300 hover:bg-green-500/10 transition-colors"
          >
            {maximized ? "❐" : "⤢"}
          </button>
          <button
            onClick={() => { setVisible(false); setMaximized(false); }}
            title="Close"
            className="w-5 h-4 flex items-center justify-center rounded text-[9px] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Globe content */}
      {!minimized && (
        <div className="flex items-center justify-center" style={{ background: "#020810" }}>
          <MetallicGlobe
            width={maximized ? (typeof window !== "undefined" ? window.innerWidth : 800) : width}
            height={maximized ? (typeof window !== "undefined" ? window.innerHeight - 28 : 600) : height}
            headlines={headlines}
            rotationSpeed={0.06}
          />
        </div>
      )}
    </div>
  );
}
