"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PANELS, GROUP_ORDER, type PanelView, type PanelEntry } from "@/panels/registry";
import { cyberSound } from "@/lib/audio/sound-synth";

interface Module {
  id: PanelView;
  label: string;
  icon: string;
  desc: string;
  color: string;
  group: string;
  adminOnly?: boolean;
}

const MODULES: Module[] = (Object.entries(PANELS) as [PanelView, PanelEntry][]).map(
  ([id, p]) => ({ id, label: p.label, icon: p.icon, desc: p.desc, color: p.color, group: p.group, adminOnly: p.adminOnly })
);

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModuleLauncher({ open, onClose }: Props) {
  const { setActiveView, isSovereignAdmin } = useIDEStore();
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = MODULES.filter((m) => {
    if (m.adminOnly && !isSovereignAdmin) return false;
    if (!search) return true;
    return (
      m.label.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()) ||
      m.group.toLowerCase().includes(search.toLowerCase())
    );
  });

  const groupedModules = GROUP_ORDER.map((g) => ({
    group: g,
    modules: filtered.filter((m) => m.group === g),
  })).filter((g) => g.modules.length > 0);

  const handleSelect = (id: PanelView) => {
    cyberSound.playClick();
    setActiveView(id);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(10,18,30,0.98) 0%, rgba(14,22,36,0.98) 100%)",
          border: "1px solid rgba(0,212,170,0.2)",
          boxShadow: "0 0 60px rgba(0,212,170,0.08), 0 40px 80px rgba(0,0,0,0.6)",
          maxHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Search Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "rgba(0,212,170,0.15)" }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="rgba(0,212,170,0.6)" strokeWidth="2">
            <circle cx="9" cy="9" r="7" />
            <path d="m15 15 3 3" />
          </svg>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Modul ara...  (Esc ile kapat)"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "rgba(255,255,255,0.9)", caretColor: "#00d4aa" }}
          />
          <span className="text-[10px] px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
            {filtered.length} modul
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            X
          </button>
        </div>

        {/* Module Grid */}
        <div className="overflow-y-auto p-5 space-y-5" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {groupedModules.map(({ group, modules }) => (
            <div key={group}>
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(to right, ${modules[0]?.color}30, transparent)` }}
                />
                <span
                  className="text-[9px] font-bold tracking-[0.2em] px-2"
                  style={{ color: modules[0]?.color + "aa" }}
                >
                  {group}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(to left, ${modules[0]?.color}30, transparent)` }}
                />
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {modules.map((m) => {
                  const isHovered = hovered === m.id;
                  return (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleSelect(m.id);
                      }}
                      onMouseEnter={() => setHovered(m.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-150 cursor-pointer select-none"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${m.color}18, ${m.color}08)`
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isHovered ? m.color + "50" : "rgba(255,255,255,0.06)"}`,
                        transform: isHovered ? "translateY(-2px) scale(1.03)" : "none",
                        boxShadow: isHovered ? `0 8px 24px ${m.color}18` : "none",
                      }}
                    >
                      <span className="text-2xl leading-none" style={{ filter: isHovered ? "drop-shadow(0 0 6px currentColor)" : "none" }}>
                        {m.icon}
                      </span>
                      <div className="w-full">
                        <div
                          className="text-[11px] font-semibold leading-tight truncate"
                          style={{ color: isHovered ? m.color : "rgba(255,255,255,0.8)" }}
                        >
                          {m.label}
                        </div>
                        <div
                          className="text-[9px] mt-0.5 leading-tight truncate"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {m.desc}
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-[8px] text-slate-500">{m.group}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            useIDEStore.getState().openFloatingWindow(m.id, m.label);
                            onClose();
                          }}
                          className="px-1 py-0.2 rounded bg-cyan-500/20 hover:bg-cyan-500/50 text-cyan-300 text-[8px] font-mono border border-cyan-500/30"
                          title="Open as Floating Window"
                        >
                          FLOATING
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}


        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-3 text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>Navigate</kbd></span>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>Enter</kbd> Open</span>
            <span><kbd className="px-1 py-0.5 rounded text-[8px]" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>Esc</kbd> Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa" }} />
            <span className="text-[9px]" style={{ color: "rgba(0,212,170,0.6)" }}>NUR Finance · {MODULES.filter(m => !m.adminOnly).length} Modul Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
