"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "matrix" | "rolling" | "regime" | "signals";

export default function CrossAssetCorrelationPanel() {
  const [tab, setTab] = useState<Tab>("matrix");

  const assets = ["SPX", "UST10Y", "Gold", "USD/EUR", "Oil", "VIX"];
  const corrMatrix = [
    [1.00, -0.42, -0.15, 0.28, 0.35, -0.82],
    [-0.42, 1.00, 0.32, -0.18, -0.22, 0.45],
    [-0.15, 0.32, 1.00, -0.52, 0.18, 0.12],
    [0.28, -0.18, -0.52, 1.00, 0.08, -0.25],
    [0.35, -0.22, 0.18, 0.08, 1.00, -0.28],
    [-0.82, 0.45, 0.12, -0.25, -0.28, 1.00],
  ];

  const corrColor = (v: number) => {
    if (v >= 0.6) return "#22c55e";
    if (v >= 0.3) return "rgba(34,197,94,0.5)";
    if (v > -0.3) return "#64748b";
    if (v > -0.6) return "rgba(239,68,68,0.5)";
    return "#ef4444";
  };

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔗</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CROSS-ASSET CORRELATION</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg CORR</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["matrix", "rolling", "regime", "signals"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "matrix" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>90-DAY CORRELATION MATRIX</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}></th>
                    {assets.map(a => <th key={a} className="text-center px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a, i) => (
                    <tr key={a} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{a}</td>
                      {corrMatrix[i].map((v, j) => (
                        <td key={j} className="text-center px-2 py-1.5 font-mono" style={{
                          color: i === j ? "#64748b" : corrColor(v),
                          background: i === j ? "transparent" : `rgba(${v > 0 ? "34,197,94" : "239,68,68"}, ${Math.abs(v) * 0.08})`
                        }}>
                          {v.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NOTABLE PAIRS</div>
            {[
              { pair: "SPX / VIX", corr: -0.82, change: 0.03, label: "Strong inverse — weakening slightly" },
              { pair: "Gold / USD/EUR", corr: -0.52, change: -0.08, label: "Dollar-gold inverse strengthening" },
              { pair: "SPX / UST 10Y", corr: -0.42, change: 0.15, label: "Stock-bond: less negative (risk-on)" },
              { pair: "Oil / SPX", corr: 0.35, change: -0.12, label: "Energy decoupling from equities" },
            ].map(p => (
              <div key={p.pair} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{p.pair}</span>
                  <span className="font-mono font-bold" style={{ color: corrColor(p.corr) }}>{p.corr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{p.label}</span>
                  <span className="font-mono" style={{ color: p.change >= 0 ? "#22c55e" : "#ef4444" }}>Δ90d: {p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rolling" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ROLLING CORRELATION — SPX vs UST 10Y</div>
            {[
              { window: "30 Day", corr: -0.35, change: 0.12 },
              { window: "60 Day", corr: -0.40, change: 0.08 },
              { window: "90 Day", corr: -0.42, change: 0.05 },
              { window: "180 Day", corr: -0.38, change: -0.02 },
              { window: "1 Year", corr: -0.32, change: -0.08 },
              { window: "3 Year", corr: -0.28, change: 0.05 },
            ].map(w => (
              <div key={w.window} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-bold">{w.window}</span>
                <div className="flex-1 relative h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <div className="absolute top-0.5 bottom-0.5 rounded" style={{
                    left: w.corr < 0 ? `${50 + w.corr * 50}%` : "50%",
                    width: `${Math.abs(w.corr) * 50}%`,
                    background: w.corr < 0 ? "#ef4444" : "#22c55e",
                    opacity: 0.5
                  }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: corrColor(w.corr) }}>{w.corr.toFixed(2)}</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: w.change >= 0 ? "#22c55e" : "#ef4444" }}>{w.change >= 0 ? "+" : ""}{w.change.toFixed(2)}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>ROLLING CORRELATION — GOLD vs DXY</div>
            {[
              { window: "30 Day", corr: -0.65, change: -0.12 },
              { window: "60 Day", corr: -0.58, change: -0.08 },
              { window: "90 Day", corr: -0.52, change: -0.05 },
              { window: "180 Day", corr: -0.48, change: 0.02 },
              { window: "1 Year", corr: -0.45, change: 0.08 },
            ].map(w => (
              <div key={w.window} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-16 font-bold">{w.window}</span>
                <div className="flex-1 relative h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <div className="absolute top-0.5 bottom-0.5 rounded" style={{
                    left: `${50 + w.corr * 50}%`,
                    width: `${Math.abs(w.corr) * 50}%`,
                    background: "#ef4444",
                    opacity: 0.5
                  }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: corrColor(w.corr) }}>{w.corr.toFixed(2)}</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: w.change >= 0 ? "#22c55e" : "#ef4444" }}>{w.change >= 0 ? "+" : ""}{w.change.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "regime" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CORRELATION REGIME ANALYSIS</div>
            <div className="p-3 rounded" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: "#22c55e" }}>CURRENT REGIME: RISK-ON DISPERSION</span>
                <span className="text-[8px] px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>SINCE OCT 2026</span>
              </div>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>Cross-asset correlations below long-term averages. Equities and bonds showing reduced co-movement. Diversification benefits elevated.</div>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HISTORICAL REGIME COMPARISON</div>
            {[
              { regime: "Risk-Off Crisis", period: "Mar 2020", spxBond: 0.65, spxGold: 0.45, spxVix: -0.95, duration: "3 months" },
              { regime: "Inflation Shock", period: "2022", spxBond: 0.52, spxGold: -0.28, spxVix: -0.88, duration: "12 months" },
              { regime: "Goldilocks", period: "2017", spxBond: -0.35, spxGold: -0.22, spxVix: -0.78, duration: "14 months" },
              { regime: "Taper Tantrum", period: "May 2013", spxBond: 0.42, spxGold: -0.55, spxVix: -0.85, duration: "4 months" },
              { regime: "Current", period: "Now", spxBond: -0.42, spxGold: -0.15, spxVix: -0.82, duration: "2 months" },
            ].map(r => (
              <div key={r.regime} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: r.regime === "Current" ? "#00e5a0" : "#e2e8f0" }}>{r.regime}</span>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{r.period} ({r.duration})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>SPX/Bond:</span> <span className="font-mono" style={{ color: corrColor(r.spxBond) }}>{r.spxBond.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>SPX/Gold:</span> <span className="font-mono" style={{ color: corrColor(r.spxGold) }}>{r.spxGold.toFixed(2)}</span></div>
                  <div><span style={{ color: "#64748b" }}>SPX/VIX:</span> <span className="font-mono" style={{ color: corrColor(r.spxVix) }}>{r.spxVix.toFixed(2)}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "signals" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CORRELATION-BASED TRADING SIGNALS</div>
            {[
              { signal: "Stock-Bond Decorrelation", status: "ACTIVE", direction: "Long both — diversification works", confidence: 78, since: "Oct 15" },
              { signal: "Gold-Dollar Divergence", status: "ACTIVE", direction: "Gold rallying despite stable USD — unusual", confidence: 65, since: "Nov 2" },
              { signal: "Oil-Equity Decoupling", status: "WATCH", direction: "Energy sector may underperform broader market", confidence: 55, since: "Nov 10" },
              { signal: "VIX Term Structure", status: "ACTIVE", direction: "Contango steep — sell vol carry favorable", confidence: 82, since: "Oct 28" },
              { signal: "EM-DM Correlation Spike", status: "WARNING", direction: "EM stocks tracking DM closely — contagion risk", confidence: 72, since: "Nov 18" },
            ].map(s => (
              <div key={s.signal} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : s.status === "WARNING" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                      color: s.status === "ACTIVE" ? "#22c55e" : s.status === "WARNING" ? "#ef4444" : "#fbbf24"
                    }}>{s.status}</span>
                    <span className="font-bold">{s.signal}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Since {s.since}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px]" style={{ color: "#94a3b8" }}>{s.direction}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.confidence}%`, background: s.confidence > 70 ? "#22c55e" : "#fbbf24" }} />
                    </div>
                    <span className="font-mono text-[8px]">{s.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
