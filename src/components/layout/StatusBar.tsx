"use client";

import Link from "next/link";
import { useIDEStore } from "@/stores/useIDEStore";
import { useEffect, useState } from "react";
import { getStatusLabel, type PanelView } from "@/panels/registry";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerruf" },
];

export default function StatusBar() {
  const { tabs, activeTabId, isRunning, activeView } = useIDEStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })
  );
  useEffect(() => {
    const t = setInterval(() =>
      setClock(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })),
    1000);
    return () => clearInterval(t);
  }, []);

  const viewLabel = getStatusLabel(activeView as PanelView);
  const statusColor = isRunning ? "#f59e0b" : "#22c55e";

  return (
    <div
      className="flex items-center h-6 px-3 shrink-0 select-none relative"
      style={{
        background: "linear-gradient(180deg, #060c18 0%, #040a14 100%)",
        borderTop: "1px solid rgba(0,212,170,0.12)",
        boxShadow: "0 -1px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      {/* Left cluster */}
      <div className="flex items-center gap-2.5 text-[9px] font-mono font-bold tracking-widest">
        {/* Status indicator */}
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 4px ${statusColor}` }}
          />
          <span style={{ color: statusColor }}>{isRunning ? "RUNNING" : "READY"}</span>
        </div>

        <span style={{ color: "rgba(0,212,170,0.2)" }}>│</span>

        <span className="flex items-center gap-1" style={{ color: "rgba(0,212,170,0.4)" }}>
          <svg width="12" height="12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
            <path d="M80 95 L60 60 L40 45 L22 30 L28 58 L15 58 L28 82 L30 90 L55 88 L65 92Z" fill="#cc0000" fillOpacity="0.7" stroke="#cc0000" strokeWidth="2"/>
            <path d="M120 95 L140 60 L160 45 L178 30 L172 58 L185 58 L172 82 L170 90 L145 88 L135 92Z" fill="#cc0000" fillOpacity="0.7" stroke="#cc0000" strokeWidth="2"/>
            <path d="M88 80 C88 70 92 62 100 60 C108 62 112 70 112 80 L112 120 C112 130 108 138 100 140 C92 138 88 130 88 120Z" fill="#cc0000" fillOpacity="0.6" stroke="#cc0000" strokeWidth="1.5"/>
          </svg>
          NUR FINANCE TERMINAL v8.2
        </span>

        <span style={{ color: "rgba(0,212,170,0.2)" }}>│</span>

        {/* Active view */}
        <span
          className="px-1.5 py-0.5 rounded-sm"
          style={{
            background: "rgba(0,212,170,0.07)",
            border: "1px solid rgba(0,212,170,0.15)",
            color: "#00d4aa",
          }}
        >
          {viewLabel}
        </span>
      </div>

      <div className="flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-2.5 text-[9px] font-mono font-bold tracking-widest">
        {/* Legal links */}
        <div className="hidden lg:flex items-center gap-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors"
              style={{ color: "rgba(78,98,128,0.8)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4aa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(78,98,128,0.8)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span style={{ color: "rgba(0,212,170,0.2)" }}>│</span>

        {activeTab && (
          <>
            <span style={{ color: "rgba(0,212,170,0.5)" }}>{activeTab.language.toUpperCase()}</span>
            <span
              style={{
                color: activeTab.modified ? "#f59e0b" : "rgba(0,212,170,0.4)",
              }}
            >
              {activeTab.modified ? "● MODIFIED" : "✓ SAVED"}
            </span>
            <span style={{ color: "rgba(0,212,170,0.2)" }}>│</span>
          </>
        )}

        <span style={{ color: "rgba(78,98,128,0.8)" }}>UTF-8</span>
        <span style={{ color: "rgba(0,212,170,0.2)" }}>│</span>

        {/* Clock */}
        <span suppressHydrationWarning style={{ color: "rgba(0,212,170,0.55)", letterSpacing: "0.1em" }}>
          {clock} UTC
        </span>
      </div>
    </div>
  );
}
