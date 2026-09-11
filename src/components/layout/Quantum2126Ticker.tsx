"use client";

import { useEffect, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";

export default function Quantum2126Ticker() {
  const { breakingNewsTicker, isSovereignAdmin, setSovereignAuthModalOpen } = useIDEStore();
  const [quantumMetrics, setQuantumMetrics] = useState({
    latency: "0.0012 ms",
    darkPoolFlow: "$14.8M",
    stealth: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumMetrics({
        latency: (0.001 + Math.random() * 0.0008).toFixed(4) + " ms",
        darkPoolFlow: "$" + (14.5 + Math.random() * 1.2).toFixed(1) + "M",
        stealth: !isSovereignAdmin,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isSovereignAdmin]);

  return (
    <div
      className="flex items-center h-[22px] px-3 select-none overflow-hidden shrink-0 relative"
      style={{
        background: "linear-gradient(90deg, #010508 0%, #020a12 50%, #010508 100%)",
        borderBottom: "1px solid rgba(0,220,255,0.12)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── Year badge ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-cyan-500/10">
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ background: "#22d3ee", boxShadow: "0 0 4px rgba(34,211,238,0.8)" }}
        />
        <span
          className="text-[9px] font-mono font-black tracking-[0.15em]"
          style={{ color: "#67e8f9" }}
        >
          YEAR 2126 · QUANTUM HUD
        </span>
      </div>

      {/* ── Live scrolling ticker ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden whitespace-nowrap mx-3">
        <div
          className="inline-flex items-center gap-8 text-[9px] font-mono font-semibold tracking-wider"
          style={{ animation: "ticker-scroll 35s linear infinite" }}
        >
          <span className="text-white font-bold">⚡ {breakingNewsTicker}</span>
          <span style={{ color: "#fbbf24" }}>🛢️ BRENT CRUDE: $78.40 ▲ +1.8% · HORMUZ TANKER TRAFFIC MONITORED</span>
          <span style={{ color: "#34d399" }}>📈 S&P 500 QUANT ARB: 5,742.8 ▲ +0.85%</span>
          <span style={{ color: "#c4b5fd" }}>📊 SHARPE 3.42 · 100% MARKET-NEUTRAL COMMODITY & EQUITY ARB</span>
          <span style={{ color: "#67e8f9" }}>🌐 NUR EARTH 3D: LIVE FLIGHT & OIL TANKER RADAR ACTIVE</span>
        </div>
      </div>

      {/* ── Telemetry block ───────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 shrink-0 pl-3 border-l border-cyan-500/10 text-[9px] font-mono font-bold"
        style={{ letterSpacing: "0.08em" }}
      >
        <span style={{ color: "rgba(100,120,150,0.8)" }}>
          LATENCY: <strong style={{ color: "#34d399" }}>{quantumMetrics.latency}</strong>
        </span>
        <span style={{ color: "rgba(100,120,150,0.8)" }}>
          FLOW: <strong style={{ color: "#67e8f9" }}>{quantumMetrics.darkPoolFlow}</strong>
        </span>

        {isSovereignAdmin ? (
          <button
            onClick={() => setSovereignAuthModalOpen(true)}
            className="px-2 py-0.5 rounded-sm font-black text-[9px] tracking-widest transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.35)",
              color: "#fbbf24",
              boxShadow: "0 0 8px rgba(251,191,36,0.15)",
            }}
            title="Sovereign Executive Mode Active"
          >
            👑 SOVEREIGN
          </button>
        ) : (
          <button
            onClick={() => setSovereignAuthModalOpen(true)}
            className="px-2 py-0.5 rounded-sm font-black text-[9px] tracking-widest transition-all hover:text-cyan-300"
            style={{
              color: "rgba(78,98,128,0.7)",
              border: "1px solid transparent",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#67e8f9";
              e.currentTarget.style.borderColor = "rgba(103,232,249,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(78,98,128,0.7)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            title="Sovereign Vault (Ctrl+Shift+S)"
          >
            🔒 STEALTH
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
