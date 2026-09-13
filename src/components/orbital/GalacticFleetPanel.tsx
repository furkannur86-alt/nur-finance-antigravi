"use client";

import { useState } from "react";
import { getFleetStats } from "@/lib/broadcast/civilizationalShips";

interface GalacticFleetPanelProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function GalacticFleetPanel({
  onClose,
  onMinimize,
}: GalacticFleetPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stats = getFleetStats();

  return (
    <div className="relative w-full h-full flex flex-col bg-[#01040a] text-white overflow-hidden font-sans">
      {/* Dynamic Canonical Fleet Stats Top Bar */}
      <div className="h-11 bg-[#060c18]/95 border-b border-[#2E8B57]/40 flex items-center justify-between px-3 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2 md:gap-3 font-mono text-xs overflow-x-auto">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            GALACTIC FLEET 3D C4ISR
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Dynamic Stat Badges */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="bg-black/60 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
              AKTİF GEMİ: <strong className="text-emerald-400">{stats.totalShips}</strong>
            </span>
            <span className="bg-red-950/40 border border-red-500/40 px-2 py-0.5 rounded text-red-300 hidden md:inline">
              MUHAFAZAKÂR: <strong className="text-red-400">{stats.conservativeShips}</strong>
            </span>
            <span className="bg-pink-950/40 border border-pink-500/40 px-2 py-0.5 rounded text-pink-300 hidden md:inline">
              LİBERAL: <strong className="text-pink-400">{stats.liberalShips}</strong>
            </span>
            <span className="bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300 hidden lg:inline">
              MEDENİYET: <strong className="text-amber-400">{stats.civilizations}</strong>
            </span>
            <span className="bg-blue-900/40 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px]">
              🔵 NATO STANAG-4586 ({stats.alliances.nato})
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <a
            href="/galactic-fleet.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono bg-[#2E8B57]/20 border border-[#2E8B57] text-emerald-300 px-2 py-1 rounded hover:bg-[#2E8B57]/40 transition hidden sm:inline"
          >
            ↗ Yeni Sekmede Aç
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-[11px] font-mono bg-white/10 border border-white/20 text-white px-2 py-1 rounded hover:bg-white/20 transition"
          >
            {isFullscreen ? "Küçült" : "Tam Ekran"}
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/20 border border-white/10 rounded text-slate-300 font-bold transition"
            >
              —
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center bg-red-950/60 hover:bg-red-600 border border-red-500/50 rounded text-red-300 hover:text-white font-bold transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Embedded 3D C4ISR Globe Iframe */}
      <div className="flex-1 relative w-full h-full">
        <iframe
          src="/galactic-fleet.html"
          title="Galactic Fleet 3D Tactical Terminal"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
