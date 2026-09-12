"use client";

import { useEffect, useState } from "react";
import type { RiskAlert } from "@/lib/content/nfs-content";
import { cyberSound } from "@/lib/audio/sound-synth";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "#ef4444", bg: "#ef444418", label: "CRITICAL" },
  high: { color: "#f59e0b", bg: "#f59e0b18", label: "HIGH" },
  medium: { color: "#6366f1", bg: "#6366f118", label: "MEDIUM" },
  low: { color: "#64748b", bg: "#64748b18", label: "LOW" },
};

const CATEGORY_ICON: Record<string, string> = {
  geopolitical: "🌍",
  market: "📈",
  credit: "💳",
  operational: "⚙️",
  cyber: "🛡️",
};

interface StressPreset {
  id: string;
  name: string;
  category: "market" | "geopolitical" | "credit" | "operational" | "cyber";
  severity: "critical" | "high" | "medium" | "low";
  vixDelta: number;
  crudeDelta: number;
  ratesDeltaBps: number;
  assets: string[];
  description: string;
  impactPortfolioPct: number;
}

const STRESS_PRESETS: StressPreset[] = [
  {
    id: "vix_spike",
    name: "⚡ Global Volatility Shock (VIX > 38.5)",
    category: "market",
    severity: "critical",
    vixDelta: 18.5,
    crudeDelta: -4.2,
    ratesDeltaBps: -45,
    assets: ["SPY", "QQQ", "VIX", "UVXY"],
    description: "Systemic equity sell-off triggered by synthetic option gamma squeeze. Cross-asset dispersion reaches 99.8th percentile.",
    impactPortfolioPct: -6.4,
  },
  {
    id: "hormuz_blockade",
    name: "⚓ Strait of Hormuz Maritime Closure",
    category: "geopolitical",
    severity: "critical",
    vixDelta: 12.0,
    crudeDelta: 24.5,
    ratesDeltaBps: 35,
    assets: ["BRENT", "WTI", "LNG", "XLE"],
    description: "Critical choke point trade corridor halted. Tanker insurance premiums skyrocket 850%. Crude futures limit-up.",
    impactPortfolioPct: -4.8,
  },
  {
    id: "flash_crash",
    name: "📉 Flash Liquidity Cascade (EUR/USD -3.8%)",
    category: "market",
    severity: "high",
    vixDelta: 9.5,
    crudeDelta: -1.8,
    ratesDeltaBps: -20,
    assets: ["EUR/USD", "USD/JPY", "Sovereign Bond Basket"],
    description: "Automated HFT order book vacuum drained top-tier FX liquidity in Frankfurt/London cross sessions.",
    impactPortfolioPct: -3.2,
  },
  {
    id: "quantum_breach",
    name: "🛡️ SWIFT Zero-Trust Quantum Anomaly",
    category: "cyber",
    severity: "critical",
    vixDelta: 14.2,
    crudeDelta: 0.0,
    ratesDeltaBps: 0,
    assets: ["BTC", "NUR", "Interbank Clearing"],
    description: "Algorithmic anomaly detected in post-quantum key exchange layer. All nodes failover to Sovereign Nur Lattice Hash.",
    impactPortfolioPct: -2.1,
  },
];

export default function RiskAlertsPanel() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [simActive, setSimActive] = useState<StressPreset | null>(null);
  const [vixSlider, setVixSlider] = useState<number>(18.5);
  const [stressMultiplier, setStressMultiplier] = useState<number>(1.0);

  useEffect(() => {
    let cancelled = false;
    const url = filterSeverity === "all" ? "/api/content?type=alerts" : `/api/content?type=alerts&severity=${filterSeverity}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAlerts(d.data || []); });
    return () => { cancelled = true; };
  }, [filterSeverity]);

  const [now] = useState(() => Date.now());
  function timeAgo(iso: string): string {
    const diff = now - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const triggerStressPreset = (preset: StressPreset) => {
    cyberSound.playAlert();
    setSimActive(preset);
    setVixSlider(preset.vixDelta + 16.5);

    // Inject simulated alert to the top of active alerts list
    const newSimAlert: RiskAlert = {
      id: `sim-${Date.now()}`,
      title: `[SIMULATION] ${preset.name}`,
      description: preset.description,
      severity: preset.severity,
      category: preset.category,
      region: "Global Sovereign Grid",
      affectedAssets: preset.assets,
      publishedAt: new Date().toISOString(),
      active: true,
    };

    setAlerts((prev) => [newSimAlert, ...prev.filter((a) => !a.id.startsWith("sim-"))]);
  };

  const clearSimulation = () => {
    cyberSound.playRadarPing();
    setSimActive(null);
    setAlerts((prev) => prev.filter((a) => !a.id.startsWith("sim-")));
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  // Real-time calculated Value-at-Risk (99% 1-Day Parametric)
  const baseVaR = 4.25; // %
  const currentVaR = simActive
    ? (baseVaR + Math.abs(simActive.impactPortfolioPct) * stressMultiplier * 0.7).toFixed(2)
    : (baseVaR * (vixSlider / 16.5)).toFixed(2);

  const estimatedDrawdown = simActive
    ? (simActive.impactPortfolioPct * stressMultiplier).toFixed(2)
    : (-(vixSlider - 16.5) * 0.28).toFixed(2);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-md" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h1 className="text-lg font-bold tracking-wide" style={{ color: "var(--ag-danger)" }}>Sovereign Risk HUD & Stress Terminal</h1>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--ag-muted)" }}>
              Active Grid: <span style={{ color: "var(--ag-danger)" }}>{criticalCount} critical</span>,{" "}
              <span style={{ color: "var(--ag-warning)" }}>{highCount} high</span> &bull; 99% 1-Day VaR: <span className="font-mono text-emerald-400 font-bold">{currentVaR}%</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => {
                  cyberSound.playClick();
                  setFilterSeverity(sev);
                }}
                className="px-2.5 py-1 text-[10px] rounded font-medium uppercase tracking-wide transition-colors"
                style={{
                  background: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.bg || "rgba(0,212,170,0.15)") : "transparent",
                  color: filterSeverity === sev ? (SEVERITY_CONFIG[sev]?.color || "var(--ag-accent)") : "var(--ag-muted)",
                  border: filterSeverity === sev ? `1px solid ${SEVERITY_CONFIG[sev]?.color || "var(--ag-accent)"}` : "1px solid transparent",
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Real-time Interactive Stress Simulation Bar */}
      <section className="p-4 mx-4 mt-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-red-950/30 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎛️</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Real-Time Risk & Monte Carlo Stress Simulator</h2>
          </div>
          {simActive && (
            <button
              onClick={clearSimulation}
              className="text-[10px] px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all font-mono"
            >
              RESET SCENARIO
            </button>
          )}
        </div>

        {/* Trigger Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {STRESS_PRESETS.map((p) => {
            const isSelected = simActive?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => triggerStressPreset(p)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? "border-red-400 bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                    : "border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-800/80"
                }`}
              >
                <div className="text-[11px] font-bold truncate text-slate-100">{p.name}</div>
                <div className="flex items-center justify-between text-[9px] mt-1 text-slate-400 font-mono">
                  <span>Delta: {p.impactPortfolioPct}%</span>
                  <span className="text-red-400 font-semibold">{p.severity.toUpperCase()}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Metrics HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">SIMULATED VIX INDEX</span>
            <span className="text-amber-400 font-bold text-xs">{vixSlider.toFixed(1)} pts</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">EST. PORTFOLIO DRAWDOWN</span>
            <span className={`font-bold text-xs ${Number(estimatedDrawdown) < 0 ? "text-red-400" : "text-emerald-400"}`}>
              {estimatedDrawdown}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">99% CONFIDENCE 1D VaR</span>
            <span className="text-rose-400 font-bold text-xs">{currentVaR}%</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">SOVEREIGN PROTOCOL</span>
            <span className="text-emerald-400 font-bold text-xs">ACTIVE (NUR-54751113)</span>
          </div>
        </div>

        {/* Stress Multiplier Slider */}
        <div className="mt-3 flex items-center gap-4 text-[10px]">
          <span className="text-slate-400 shrink-0">Shock Intensity:</span>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={stressMultiplier}
            onChange={(e) => {
              setStressMultiplier(parseFloat(e.target.value));
              cyberSound.playClick();
            }}
            className="flex-1 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono font-bold text-cyan-300 shrink-0">{stressMultiplier.toFixed(1)}x</span>
        </div>
      </section>

      {/* Alerts Feed */}
      <div className="p-4 flex flex-col gap-2">
        {alerts.length === 0 && (
          <div className="text-center py-12 text-xs" style={{ color: "var(--ag-muted)" }}>
            Loading risk telemetry grid...
          </div>
        )}
        {alerts.map((alert) => {
          const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;
          const isSim = alert.id.startsWith("sim-");
          return (
            <article
              key={alert.id}
              className={`rounded-xl border p-3.5 transition-all ${
                isSim ? "shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/50" : ""
              }`}
              style={{ background: "var(--ag-surface)", borderColor: isSim ? "#ef4444" : sev.color + "40" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 shadow-inner"
                  style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.color}60` }}
                >
                  {CATEGORY_ICON[alert.category] || "⚠️"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: sev.bg, color: sev.color }}
                    >
                      {sev.label}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "var(--ag-muted)" }}>
                      {alert.category}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{alert.region}</span>
                    <span className="text-[9px] font-mono text-cyan-400">{timeAgo(alert.publishedAt)}</span>
                    {isSim && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                        LIVE SIMULATION
                      </span>
                    )}
                  </div>
                  <h2 className="text-xs font-semibold mb-1 text-slate-100">{alert.title}</h2>
                  <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--ag-muted)" }}>
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Affected Assets:</span>
                    {alert.affectedAssets.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold"
                        style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.color}30` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
