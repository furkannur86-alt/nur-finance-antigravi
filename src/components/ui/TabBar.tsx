"use client";

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  color?: string;
}

export default function TabBar({ tabs, active, onChange, color = "#00d4aa" }: TabBarProps) {
  return (
    <div
      className="flex items-center gap-0.5 px-2 overflow-x-auto shrink-0"
      style={{ borderBottom: "1px solid rgba(0,212,170,0.08)" }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="px-3 py-1.5 text-[10px] font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5"
            style={{
              color: isActive ? color : "#64748b",
              borderBottom: `2px solid ${isActive ? color : "transparent"}`,
              background: isActive ? `${color}10` : "transparent",
            }}
          >
            {t.icon && <span>{t.icon}</span>}
            {t.label}
            {t.count != null && (
              <span
                className="text-[8px] px-1 py-0.5 rounded-full font-bold"
                style={{
                  background: isActive ? `${color}20` : "rgba(100,116,139,0.2)",
                  color: isActive ? color : "#64748b",
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
