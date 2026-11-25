"use client";

import { type ReactNode, useState } from "react";
import DemoBadge from "./DemoBadge";

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface PanelShellProps {
  title: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  children: ReactNode;
  showDemo?: boolean;
  headerRight?: ReactNode;
}

export default function PanelShell({
  title, icon, badge, badgeColor = "#00d4aa", tabs, activeTab, onTabChange, children, showDemo = true, headerRight,
}: PanelShellProps) {
  const [internalTab, setInternalTab] = useState(tabs?.[0]?.id ?? "");
  const currentTab = activeTab ?? internalTab;
  const handleTab = onTabChange ?? setInternalTab;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg, #0a0e17)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,212,170,0.1)", background: "rgba(0,0,0,0.3)" }}
      >
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-xs font-bold font-mono tracking-wider uppercase" style={{ color: badgeColor }}>
          {title}
        </span>
        {badge && (
          <span
            className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}
          >
            {badge}
          </span>
        )}
        {showDemo && <DemoBadge />}
        <div className="flex-1" />
        {headerRight}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div
          className="flex items-center gap-0.5 px-3 py-1 shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(0,212,170,0.06)", background: "rgba(0,0,0,0.15)" }}
        >
          {tabs.map((t) => {
            const active = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTab(t.id)}
                className="px-3 py-1 rounded text-[10px] font-mono font-medium transition-all whitespace-nowrap"
                style={{
                  background: active ? "rgba(0,212,170,0.1)" : "transparent",
                  color: active ? "#00d4aa" : "#64748b",
                  borderBottom: active ? "2px solid #00d4aa" : "2px solid transparent",
                }}
              >
                {t.icon && <span className="mr-1">{t.icon}</span>}
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}
