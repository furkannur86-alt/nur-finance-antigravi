"use client";

import { useState, useMemo } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PANELS, GROUP_ORDER, type PanelView, type PanelEntry } from "@/panels/registry";

const GROUP_COLORS: Record<string, string> = {
  CORE: "#00d4aa",
  MARKETS: "#38bdf8",
  TRADING: "#a78bfa",
  ANALYSIS: "#f59e0b",
  RISK: "#ef4444",
  MEDIA: "#e879f9",
  SOCIAL: "#ec4899",
  GALACTIC: "#00f0ff",
  SOVEREIGN: "#fbbf24",
};

const GROUP_ICONS: Record<string, string> = {
  CORE: "⚙️",
  MARKETS: "📊",
  TRADING: "⚡",
  ANALYSIS: "🔬",
  RISK: "⚠️",
  MEDIA: "📡",
  SOCIAL: "👥",
  GALACTIC: "🚀",
  SOVEREIGN: "👑",
};

type GroupedPanel = { id: PanelView; label: string; icon: string; color: string; desc: string };

function getGroupedPanels() {
  const entries = Object.entries(PANELS) as [PanelView, PanelEntry][];
  return GROUP_ORDER.map((group) => ({
    group,
    color: GROUP_COLORS[group] || "#00d4aa",
    icon: GROUP_ICONS[group] || "📁",
    panels: entries
      .filter(([, p]) => p.group === group)
      .map(([id, p]) => ({ id, label: p.label, icon: p.icon, color: p.color, desc: p.desc })),
  })).filter((g) => g.panels.length > 0);
}

export default function Sidebar() {
  const { activeView, setActiveView } = useIDEStore();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => getGroupedPanels(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        panels: g.panels.filter(
          (p) => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.panels.length > 0);
  }, [groups, search]);

  const toggleGroup = (group: string) => {
    setCollapsed((c) => ({ ...c, [group]: !c[group] }));
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden shrink-0"
      style={{
        width: 220,
        background: "linear-gradient(180deg, #070d1b 0%, #05091500 100%), #060c18",
        borderRight: "1px solid rgba(0,212,170,0.1)",
        boxShadow: "inset -4px 0 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center gap-2 shrink-0"
        style={{
          borderBottom: "1px solid rgba(0,212,170,0.08)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(0,212,170,0.5)">
          <rect x="0" y="0" width="4" height="4" rx="0.5" />
          <rect x="6" y="0" width="4" height="4" rx="0.5" />
          <rect x="0" y="6" width="4" height="4" rx="0.5" />
          <rect x="6" y="6" width="4" height="4" rx="0.5" />
        </svg>
        <span
          className="text-[9px] font-mono font-black tracking-[0.18em] uppercase"
          style={{ color: "rgba(0,212,170,0.45)" }}
        >
          MODULES
        </span>
        <span
          className="ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,212,170,0.1)", color: "rgba(0,212,170,0.5)" }}
        >
          {Object.keys(PANELS).length}
        </span>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 shrink-0" style={{ borderBottom: "1px solid rgba(0,212,170,0.05)" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules..."
          className="w-full px-2 py-1 rounded text-[10px] font-mono outline-none"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(0,212,170,0.1)",
            color: "#e2e8f0",
          }}
        />
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((g) => {
          const isCollapsed = collapsed[g.group] && !search;
          return (
            <div key={g.group}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(g.group)}
                className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left hover:bg-white/[0.03] transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              >
                <svg
                  width="6" height="6" viewBox="0 0 6 6"
                  fill={g.color}
                  className={`transition-transform flex-shrink-0 ${isCollapsed ? "" : "rotate-90"}`}
                  style={{ opacity: 0.7 }}
                >
                  <path d="M1 0 L5 3 L1 6 Z" />
                </svg>
                <span className="text-[10px]">{g.icon}</span>
                <span
                  className="text-[9px] font-mono font-bold tracking-[0.12em] uppercase"
                  style={{ color: g.color, opacity: 0.8 }}
                >
                  {g.group}
                </span>
                <span
                  className="ml-auto text-[8px] font-mono"
                  style={{ color: "rgba(148,163,184,0.5)" }}
                >
                  {g.panels.length}
                </span>
              </button>

              {/* Panel items */}
              {!isCollapsed && g.panels.map((p) => {
                const isActive = activeView === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveView(p.id)}
                    className="w-full flex items-center gap-1.5 px-3 py-[4px] text-left transition-all"
                    style={{
                      paddingLeft: 20,
                      background: isActive ? `${p.color}12` : "transparent",
                      borderLeft: isActive ? `2px solid ${p.color}` : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                    title={p.desc}
                  >
                    <span className="text-[11px] flex-shrink-0">{p.icon}</span>
                    <span
                      className="text-[10px] font-mono truncate"
                      style={{ color: isActive ? p.color : "#8fa3bc" }}
                    >
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-3 py-4 text-center text-[10px] font-mono" style={{ color: "rgba(148,163,184,0.4)" }}>
            No modules found
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderTop: "1px solid rgba(0,212,170,0.07)" }}
      >
        <div
          className="text-[8px] font-mono tracking-wider"
          style={{ color: "rgba(78,98,128,0.6)" }}
        >
          NUR FINANCE © 2024–2126
        </div>
      </div>
    </div>
  );
}
