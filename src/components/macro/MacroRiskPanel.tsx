"use client";

import { useState, useEffect, useCallback } from "react";

interface RiskIndicator {
  id: string;
  name: string;
  value: number;
  previous: number;
  threshold: { low: number; high: number };
  unit: string;
  category: string;
  description: string;
}

interface PredictionScenario {
  id: string;
  name: string;
  probability: number;
  impact: "positive" | "negative" | "neutral";
  description: string;
  timeframe: string;
  affectedAssets: string[];
}

interface MacroEvent {
  id: string;
  date: string;
  event: string;
  country: string;
  impact: "high" | "medium" | "low";
  forecast?: string;
  previous?: string;
  actual?: string;
}

const RISK_CATEGORIES = ["Monetary Policy", "Credit Markets", "Geopolitical", "Liquidity", "Volatility", "Growth"];

function computeCompositeRisk(indicators: RiskIndicator[]): number {
  if (indicators.length === 0) return 50;
  let total = 0;
  for (const ind of indicators) {
    const range = ind.threshold.high - ind.threshold.low;
    if (range === 0) continue;
    const normalized = Math.max(0, Math.min(100, ((ind.value - ind.threshold.low) / range) * 100));
    total += normalized;
  }
  return Math.round(total / indicators.length);
}

function riskColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 25) return "#00d4aa";
  return "#22d3ee";
}

function riskLabel(score: number): string {
  if (score >= 75) return "ELEVATED";
  if (score >= 50) return "MODERATE";
  if (score >= 25) return "LOW";
  return "MINIMAL";
}

function generateIndicators(): RiskIndicator[] {
  const now = Date.now();
  const dayPhase = (now / 86400000) % 1;

  return [
    {
      id: "vix", name: "VIX Index", category: "Volatility",
      value: +(14 + Math.sin(dayPhase * Math.PI * 2) * 8 + Math.random() * 2).toFixed(1),
      previous: 14.2,
      threshold: { low: 12, high: 35 }, unit: "", description: "CBOE Volatility Index — market fear gauge"
    },
    {
      id: "move", name: "MOVE Index", category: "Volatility",
      value: +(95 + Math.sin(dayPhase * 3.1) * 25 + Math.random() * 5).toFixed(1),
      previous: 98.5,
      threshold: { low: 60, high: 180 }, unit: "bps", description: "Merrill Lynch bond volatility — rates uncertainty"
    },
    {
      id: "hy-spread", name: "HY OAS Spread", category: "Credit Markets",
      value: +(350 + Math.cos(dayPhase * 2.7) * 80 + Math.random() * 10).toFixed(0),
      previous: 365,
      threshold: { low: 250, high: 800 }, unit: "bps", description: "High-yield credit spread — default risk proxy"
    },
    {
      id: "ig-spread", name: "IG OAS Spread", category: "Credit Markets",
      value: +(95 + Math.sin(dayPhase * 1.9) * 20 + Math.random() * 3).toFixed(0),
      previous: 98,
      threshold: { low: 60, high: 250 }, unit: "bps", description: "Investment-grade credit spread"
    },
    {
      id: "ted-spread", name: "TED Spread", category: "Liquidity",
      value: +(0.25 + Math.sin(dayPhase * 4.1) * 0.15 + Math.random() * 0.02).toFixed(2),
      previous: 0.28,
      threshold: { low: 0.1, high: 1.5 }, unit: "%", description: "T-bill vs LIBOR — interbank stress"
    },
    {
      id: "dxy", name: "Dollar Index (DXY)", category: "Monetary Policy",
      value: +(104 + Math.cos(dayPhase * 2.3) * 3 + Math.random() * 0.5).toFixed(2),
      previous: 104.5,
      threshold: { low: 95, high: 115 }, unit: "", description: "US dollar strength — global liquidity proxy"
    },
    {
      id: "yield-curve", name: "2s10s Yield Curve", category: "Monetary Policy",
      value: +(-0.1 + Math.sin(dayPhase * 1.5) * 0.4 + Math.random() * 0.05).toFixed(2),
      previous: -0.05,
      threshold: { low: -1.0, high: 2.5 }, unit: "%", description: "Treasury 2Y-10Y spread — recession predictor"
    },
    {
      id: "gpr", name: "Geopolitical Risk", category: "Geopolitical",
      value: +(120 + Math.sin(dayPhase * 5.2) * 40 + Math.random() * 8).toFixed(0),
      previous: 125,
      threshold: { low: 50, high: 300 }, unit: "", description: "Caldara-Iacoviello GPR Index"
    },
    {
      id: "pmi", name: "Global Mfg PMI", category: "Growth",
      value: +(50 + Math.cos(dayPhase * 1.8) * 3 + Math.random() * 0.5).toFixed(1),
      previous: 51.2,
      threshold: { low: 42, high: 58 }, unit: "", description: "JP Morgan Global Manufacturing PMI"
    },
    {
      id: "lei", name: "CB Leading Econ. Index", category: "Growth",
      value: +(100 + Math.sin(dayPhase * 0.9) * 5 + Math.random() * 0.5).toFixed(1),
      previous: 100.8,
      threshold: { low: 90, high: 115 }, unit: "", description: "Conference Board LEI — growth outlook"
    },
  ];
}

function generateScenarios(riskScore: number): PredictionScenario[] {
  const scenarios: PredictionScenario[] = [
    {
      id: "soft-landing", name: "Soft Landing",
      probability: riskScore < 40 ? 55 : riskScore < 60 ? 35 : 15,
      impact: "positive", timeframe: "6-12 months",
      description: "Inflation normalizes without recession. Central banks begin easing cycle.",
      affectedAssets: ["Equities +12-18%", "IG Credit tighten 30bps", "Gold stable"]
    },
    {
      id: "stagflation", name: "Stagflation Risk",
      probability: riskScore < 40 ? 10 : riskScore < 60 ? 25 : 40,
      impact: "negative", timeframe: "12-18 months",
      description: "Growth stalls while inflation remains sticky above target.",
      affectedAssets: ["Equities -15-25%", "Commodities +20%", "TIPS outperform"]
    },
    {
      id: "credit-event", name: "Credit Event",
      probability: riskScore < 40 ? 5 : riskScore < 60 ? 15 : 30,
      impact: "negative", timeframe: "3-6 months",
      description: "Major credit stress emerges in commercial real estate or shadow banking.",
      affectedAssets: ["HY spreads +200bps", "Banks -20%", "UST rally"]
    },
    {
      id: "goldilocks", name: "Goldilocks Continuation",
      probability: riskScore < 40 ? 30 : riskScore < 60 ? 20 : 10,
      impact: "positive", timeframe: "3-6 months",
      description: "Growth accelerates, productivity gains from AI adoption lift margins.",
      affectedAssets: ["Tech +20%", "USD stable", "Rates range-bound"]
    },
    {
      id: "geopolitical-shock", name: "Geopolitical Escalation",
      probability: riskScore < 40 ? 8 : riskScore < 60 ? 18 : 28,
      impact: "negative", timeframe: "1-3 months",
      description: "Major geopolitical escalation disrupts energy supply or trade routes.",
      affectedAssets: ["Oil +30%", "VIX >30", "Safe havens rally", "EM currencies -10%"]
    },
  ];
  return scenarios.sort((a, b) => b.probability - a.probability);
}

function generateCalendar(): MacroEvent[] {
  const today = new Date();
  const events: MacroEvent[] = [];
  const templates = [
    { event: "FOMC Rate Decision", country: "US", impact: "high" as const },
    { event: "ECB Rate Decision", country: "EU", impact: "high" as const },
    { event: "US CPI (YoY)", country: "US", impact: "high" as const },
    { event: "US Non-Farm Payrolls", country: "US", impact: "high" as const },
    { event: "Eurozone CPI Flash", country: "EU", impact: "medium" as const },
    { event: "China GDP (QoQ)", country: "CN", impact: "high" as const },
    { event: "BOJ Policy Decision", country: "JP", impact: "high" as const },
    { event: "UK GDP (MoM)", country: "GB", impact: "medium" as const },
    { event: "US ISM Manufacturing", country: "US", impact: "medium" as const },
    { event: "US Initial Jobless Claims", country: "US", impact: "low" as const },
    { event: "Germany IFO Business Climate", country: "DE", impact: "medium" as const },
    { event: "US Retail Sales (MoM)", country: "US", impact: "medium" as const },
  ];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const dayEvents = templates.filter(() => Math.random() < 0.25);
    for (const tmpl of dayEvents) {
      events.push({
        id: `ev-${i}-${tmpl.event}`,
        date: d.toISOString().split("T")[0],
        event: tmpl.event,
        country: tmpl.country,
        impact: tmpl.impact,
        forecast: (Math.random() * 5 - 1).toFixed(1) + "%",
        previous: (Math.random() * 5 - 1).toFixed(1) + "%",
      });
    }
  }
  return events.slice(0, 15);
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: "US", EU: "EU", CN: "CN", JP: "JP", GB: "GB", DE: "DE"
};

export default function MacroRiskPanel() {
  const [indicators, setIndicators] = useState<RiskIndicator[]>([]);
  const [scenarios, setScenarios] = useState<PredictionScenario[]>([]);
  const [calendar, setCalendar] = useState<MacroEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "scenarios" | "calendar">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const ind = generateIndicators();
    setIndicators(ind);
    setScenarios(generateScenarios(computeCompositeRisk(ind)));
    setCalendar(generateCalendar());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const compositeRisk = computeCompositeRisk(indicators);
  const filteredIndicators = selectedCategory
    ? indicators.filter((i) => i.category === selectedCategory)
    : indicators;

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
              style={{ background: riskColor(compositeRisk) + "22", color: riskColor(compositeRisk) }}>
              R
            </div>
            <h1 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Macro Risk Monitor</h1>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold"
              style={{ background: riskColor(compositeRisk) + "22", color: riskColor(compositeRisk) }}>
              {riskLabel(compositeRisk)}
            </span>
          </div>
          <button onClick={refresh} className="text-[10px] px-2 py-1 rounded border transition-colors hover:border-[var(--ag-accent)]"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {(["dashboard", "scenarios", "calendar"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="text-[10px] px-3 py-1.5 rounded transition-colors capitalize"
              style={{
                background: activeTab === tab ? "rgba(0,212,170,0.15)" : "transparent",
                color: activeTab === tab ? "var(--ag-accent)" : "var(--ag-muted)",
              }}>
              {tab === "dashboard" ? "Risk Dashboard" : tab === "scenarios" ? "Prediction Scenarios" : "Economic Calendar"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Composite Risk Gauge */}
            <div className="rounded-lg border p-4" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: "var(--ag-text)" }}>Composite Risk Score</span>
                <span className="text-2xl font-bold font-mono" style={{ color: riskColor(compositeRisk) }}>
                  {compositeRisk}
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--ag-border)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${compositeRisk}%`, background: `linear-gradient(90deg, #22d3ee, #00d4aa, #f59e0b, #ef4444)` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px]" style={{ color: "#22d3ee" }}>MINIMAL</span>
                <span className="text-[9px]" style={{ color: "#00d4aa" }}>LOW</span>
                <span className="text-[9px]" style={{ color: "#f59e0b" }}>MODERATE</span>
                <span className="text-[9px]" style={{ color: "#ef4444" }}>ELEVATED</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setSelectedCategory(null)}
                className="text-[10px] px-2 py-1 rounded transition-colors"
                style={{
                  background: !selectedCategory ? "rgba(0,212,170,0.15)" : "transparent",
                  color: !selectedCategory ? "var(--ag-accent)" : "var(--ag-muted)",
                }}>
                All
              </button>
              {RISK_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className="text-[10px] px-2 py-1 rounded transition-colors"
                  style={{
                    background: selectedCategory === cat ? "rgba(0,212,170,0.15)" : "transparent",
                    color: selectedCategory === cat ? "var(--ag-accent)" : "var(--ag-muted)",
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
              {filteredIndicators.map((ind) => {
                const range = ind.threshold.high - ind.threshold.low;
                const pct = range > 0 ? Math.max(0, Math.min(100, ((ind.value - ind.threshold.low) / range) * 100)) : 50;
                const delta = ind.value - ind.previous;
                return (
                  <div key={ind.id} className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold" style={{ color: "var(--ag-text)" }}>{ind.name}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded"
                        style={{ background: riskColor(pct) + "18", color: riskColor(pct) }}>
                        {ind.category}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-lg font-bold font-mono" style={{ color: "var(--ag-text)" }}>
                        {ind.value}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{ind.unit}</span>
                      <span className="text-[10px] font-mono"
                        style={{ color: delta > 0 ? "#ef4444" : delta < 0 ? "#00d4aa" : "var(--ag-muted)" }}>
                        {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "var(--ag-border)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: riskColor(pct) }} />
                    </div>
                    <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{ind.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-3">
            <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ag-muted)" }}>
                Scenario Analysis
              </div>
              <div className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
                Probability-weighted macro scenarios based on current risk indicators. Updated every 30 seconds.
              </div>
            </div>

            {scenarios.map((s) => {
              const impactColor = s.impact === "positive" ? "#00d4aa" : s.impact === "negative" ? "#ef4444" : "#f59e0b";
              return (
                <div key={s.id} className="rounded-lg border p-4" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: "var(--ag-text)" }}>{s.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                        style={{ background: impactColor + "18", color: impactColor }}>
                        {s.impact}
                      </span>
                    </div>
                    <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{s.timeframe}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold font-mono" style={{ color: impactColor }}>
                      {s.probability}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-2 rounded-full" style={{ background: "var(--ag-border)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.probability}%`, background: impactColor }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] mb-3" style={{ color: "var(--ag-muted)" }}>{s.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {s.affectedAssets.map((a, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                        style={{
                          background: a.includes("+") ? "rgba(0,212,170,0.1)" : a.includes("-") ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)",
                          color: a.includes("+") ? "#00d4aa" : a.includes("-") ? "#ef4444" : "var(--ag-muted)",
                        }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-1">
            <div className="rounded-lg border overflow-hidden" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Country</th>
                    <th className="text-left p-2 font-medium">Event</th>
                    <th className="text-center p-2 font-medium">Impact</th>
                    <th className="text-right p-2 font-medium">Forecast</th>
                    <th className="text-right p-2 font-medium">Previous</th>
                    <th className="text-right p-2 font-medium">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {calendar.map((ev) => {
                    const impColor = ev.impact === "high" ? "#ef4444" : ev.impact === "medium" ? "#f59e0b" : "#64748b";
                    return (
                      <tr key={ev.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "var(--ag-border)" }}>
                        <td className="p-2 font-mono" style={{ color: "var(--ag-muted)" }}>{ev.date}</td>
                        <td className="p-2">
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: "var(--ag-border)", color: "var(--ag-text)" }}>
                            {COUNTRY_FLAGS[ev.country] || ev.country}
                          </span>
                        </td>
                        <td className="p-2 font-semibold" style={{ color: "var(--ag-text)" }}>{ev.event}</td>
                        <td className="p-2 text-center">
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{ background: impColor + "18", color: impColor }}>
                            {ev.impact}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>{ev.forecast || "—"}</td>
                        <td className="p-2 text-right font-mono" style={{ color: "var(--ag-muted)" }}>{ev.previous || "—"}</td>
                        <td className="p-2 text-right font-mono" style={{ color: ev.actual ? "var(--ag-accent)" : "var(--ag-muted)" }}>
                          {ev.actual || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
