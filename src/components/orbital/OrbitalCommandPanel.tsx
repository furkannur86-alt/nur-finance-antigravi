"use client";

import { useState } from "react";

export default function OrbitalCommandPanel() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#000206] text-white overflow-hidden">
      {/* Top Bar Controls */}
      <div className="h-10 bg-[#040814] border-b border-[#2E8B57]/50 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            NUR ORBITAL COMMAND & STARSHIP BRIDGE v19.0
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Kaptan Köşkü Giriş Portalı & 20 Mega-City Dreadnought</span>
          <span className="bg-amber-900/40 text-amber-200 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px]">
            #54751113 QUANTUM VAULT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/orbital-command.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono bg-cyan-950/60 border border-cyan-500 text-cyan-300 px-2 py-1 rounded hover:bg-cyan-900/60 transition"
          >
            ↗ Yeni Sekmede Aç
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-[11px] font-mono bg-white/10 border border-white/20 text-white px-2 py-1 rounded hover:bg-white/20 transition"
          >
            {isFullscreen ? "Küçült" : "Tam Ekran"}
          </button>
        </div>
      </div>

      {/* Embedded 3D Cockpit Bridge Iframe */}
      <div className="flex-1 relative w-full h-full">
        <iframe
          src="/orbital-command.html"
          title="NUR Starship Bridge & Orbital Command"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
