"use client";

import { useEffect, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";

export default function Quantum2126Ticker() {
  const { breakingNewsTicker, isSovereignAdmin, setSovereignAuthModalOpen } = useIDEStore();
  const [quantumMetrics, setQuantumMetrics] = useState({
    latency: "0.0012 ms",
    darkPoolFlow: "$14.8M",
    neuralLoad: "99.8%",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumMetrics({
        latency: (0.001 + Math.random() * 0.0008).toFixed(4) + " ms",
        darkPoolFlow: "$" + (14.5 + Math.random() * 1.2).toFixed(1) + "M",
        neuralLoad: (99.4 + Math.random() * 0.5).toFixed(1) + "%",
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center h-6 px-3 border-b text-[10px] font-mono select-none overflow-hidden shrink-0 relative bg-black/90 text-cyan-400"
      style={{ borderColor: "rgba(0, 242, 254, 0.15)" }}
    >
      {/* 2126 Epoch Badge */}
      <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-bold text-cyan-300 tracking-wider">YEAR 2126 QUANTUM HUD</span>
      </div>

      {/* Scrolling Live Stream */}
      <div className="flex-1 overflow-hidden whitespace-nowrap mx-3">
        <div className="inline-flex items-center gap-6 animate-[scroll-left_35s_linear_infinite]">
          <span className="text-white font-medium">⚡ {breakingNewsTicker}</span>
          <span className="text-amber-300">🛢️ BRENT CRUDE OIL: $78.40 ▲ +1.8% (Hürmüz Boğazı Tanker Trafiği İzleniyor)</span>
          <span className="text-emerald-400">📈 S&P 500 QUANTUM ARB: 5,742.8 ▲ +0.85%</span>
          <span className="text-purple-300">📊 QUANT ROTATION DESK: Sharpe 3.42 &bull; 100% Piyasa Nötr Emtia ve Hisse Arbitrajı</span>
          <span className="text-cyan-300">🌐 NUR EARTH 3D: Canlı Uçuş ve Petrol Tanker Radarı Aktif</span>
        </div>
      </div>

      {/* Live Quantum Diagnostics Telemetry */}
      <div className="flex items-center gap-3 shrink-0 pl-3 border-l border-white/10 text-[9px]">
        <span className="text-slate-400">
          GECİKME: <strong className="text-emerald-400">{quantumMetrics.latency}</strong>
        </span>
        <span className="text-slate-400">
          AKIŞ: <strong className="text-cyan-300">{quantumMetrics.darkPoolFlow}</strong>
        </span>

        {/* Sovereign Lock Status Indicator */}
        {isSovereignAdmin ? (
          <button
            onClick={() => setSovereignAuthModalOpen(true)}
            className="px-2 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
            title="Sovereign Executive Mode Active (Click to manage)"
          >
            👑 SOVEREIGN AKTİF
          </button>
        ) : (
          <button
            onClick={() => setSovereignAuthModalOpen(true)}
            className="px-2 py-0.2 rounded text-slate-500 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-colors"
            title="Sovereign Vault Key Access (Ctrl+Shift+S)"
          >
            🔒 STEALTH
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
