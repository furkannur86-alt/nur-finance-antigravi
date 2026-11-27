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
          <svg width="10" height="10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 8 C68 8 82 22 82 42 C82 65 68 85 50 94 C32 85 18 65 18 42 C18 22 32 8 50 8Z" fill="#d4af37" fillOpacity="0.5"/>
            <path d="M38 44 C28 32 14 22 16 42 C18 55 28 58 38 52Z" fill="#d4af37" fillOpacity="0.6"/>
            <path d="M62 44 C72 32 86 22 84 42 C82 55 72 58 62 52Z" fill="#d4af37" fillOpacity="0.6"/>
          </svg>
          NUR FINANCE TERMINAL v3.0
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
