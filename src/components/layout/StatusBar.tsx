"use client";

import Link from "next/link";
import { useIDEStore } from "@/stores/useIDEStore";
import { useEffect, useState } from "react";

const viewLabels: Record<string, string> = {
  editor: "EDITOR", dashboard: "DASHBOARD", portfolio: "PORTFOLIO",
  charts: "CHARTS", backtest: "BACKTEST", terminal: "NFS TERMINAL",
  news: "NFS BRIEFS", alerts: "NFS ALERTS", research: "NFS RESEARCH",
  "global-markets": "GLOBAL MARKETS", "economic-data": "ECONOMIC DATA",
  "data-ingest": "DATA INGEST", geopolitics: "GEO INTEL", fundamentals: "FUNDAMENTALS",
  screener: "SCREENER", "news-feed": "LIVE NEWS", encyclopedia: "ENCYCLOPEDIA",
  pricing: "PLANS", media: "NFS MEDIA", "live-tv": "NUR TV LIVE",
  options: "OPTIONS", "ai-tools": "QUANT MODELS", "macro-risk": "MACRO RISK",
  "oms-ems": "OMS / EMS", "quant-copilot": "QUANT STRATEGIST",
  "broadcast-studio": "BROADCAST STUDIO", "verification-portal": "VERIFICATION",
  "wallet-gateway": "WALLET GATEWAY", "nur-coin": "NUR COIN",
  "umay-boss": "UMAY GÜL NUR", "holding-ecosystem": "7 GROWTH ARMS",
  "tatar-finans": "TATAR FINANS", "nur-kids": "NUR KIDS",
  "nur-education": "NUR EDUCATION", "compute-access": "COMPUTE ACCESS",
};

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
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );
  useEffect(() => {
    const t = setInterval(() =>
      setClock(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })),
    1000);
    return () => clearInterval(t);
  }, []);

  const viewLabel = viewLabels[activeView] || activeView.toUpperCase();
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

        <span style={{ color: "rgba(0,212,170,0.4)" }}>ANTIGRAV ENGINE v3.0</span>

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
        <span style={{ color: "rgba(0,212,170,0.55)", letterSpacing: "0.1em" }}>
          {clock} UTC
        </span>
      </div>
    </div>
  );
}
