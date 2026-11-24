"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "contracts" | "forecast" | "hedging" | "analytics";

export default function WeatherDerivativesPanel() {
  const [tab, setTab] = useState<Tab>("contracts");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌦️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>WEATHER DERIVATIVES</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>CME Weather</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["contracts", "forecast", "hedging", "analytics"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "contracts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE WEATHER CONTRACTS</div>
            {[
              { type: "HDD", city: "New York", month: "Dec 2026", strike: 850, last: 872, chg: 12, notional: "$20K/HDD" },
              { type: "HDD", city: "Chicago", month: "Dec 2026", strike: 1050, last: 1085, chg: -8, notional: "$20K/HDD" },
              { type: "CDD", city: "Houston", month: "Jul 2027", strike: 450, last: 468, chg: 5, notional: "$20K/CDD" },
              { type: "HDD", city: "London", month: "Jan 2027", strike: 320, last: 335, chg: 8, notional: "£10K/HDD" },
              { type: "CDD", city: "Tokyo", month: "Aug 2027", strike: 280, last: 292, chg: 3, notional: "¥2M/CDD" },
              { type: "RAIN", city: "Mumbai", month: "Jul 2027", strike: 850, last: 820, chg: -15, notional: "$5K/mm" },
            ].map((c, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: c.type === "HDD" ? "rgba(56,189,248,0.15)" : c.type === "CDD" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                      color: c.type === "HDD" ? "#38bdf8" : c.type === "CDD" ? "#ef4444" : "#22c55e",
                    }}>{c.type}</span>
                    <span className="font-bold">{c.city}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{c.month}</span>
                  </div>
                  <span className="font-mono font-bold">{c.last}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Strike:</span> <span className="font-mono">{c.strike}</span></div>
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: c.chg >= 0 ? "#22c55e" : "#ef4444" }}>{c.chg >= 0 ? "+" : ""}{c.chg}</span></div>
                  <div><span style={{ color: "#64748b" }}>Notional:</span> <span className="font-mono">{c.notional}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "forecast" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TEMPERATURE ANOMALY FORECAST — KEY CITIES</div>
            {[
              { city: "New York", current: -2.5, week1: -3.1, week2: -1.8, month: -2.2, impact: "Heating demand ↑ 12% above normal" },
              { city: "Chicago", current: -4.2, week1: -5.5, week2: -3.8, month: -4.1, impact: "Nat gas demand surge — HDD premium rising" },
              { city: "Houston", current: 1.8, week1: 0.5, week2: 1.2, month: 1.0, impact: "Mild winter — energy bulls cautious" },
              { city: "London", current: -1.5, week1: -2.8, week2: -1.2, month: -1.5, impact: "Cold snap boosting NBP gas prices" },
              { city: "Tokyo", current: 0.8, week1: 1.2, week2: 0.5, month: 0.8, impact: "Normal range — LNG demand stable" },
              { city: "Frankfurt", current: -3.5, week1: -4.2, week2: -2.5, month: -3.0, impact: "Cold wave across Central Europe" },
            ].map(f => (
              <div key={f.city} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.city}</span>
                  <span className="font-mono font-bold" style={{ color: f.current < 0 ? "#38bdf8" : "#ef4444" }}>
                    {f.current >= 0 ? "+" : ""}{f.current}°C
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] mb-1">
                  <div><span style={{ color: "#64748b" }}>Wk1:</span> <span className="font-mono" style={{ color: f.week1 < 0 ? "#38bdf8" : "#ef4444" }}>{f.week1 >= 0 ? "+" : ""}{f.week1}°</span></div>
                  <div><span style={{ color: "#64748b" }}>Wk2:</span> <span className="font-mono" style={{ color: f.week2 < 0 ? "#38bdf8" : "#ef4444" }}>{f.week2 >= 0 ? "+" : ""}{f.week2}°</span></div>
                  <div><span style={{ color: "#64748b" }}>Mo:</span> <span className="font-mono" style={{ color: f.month < 0 ? "#38bdf8" : "#ef4444" }}>{f.month >= 0 ? "+" : ""}{f.month}°</span></div>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{f.impact}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "hedging" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WEATHER HEDGE STRATEGIES</div>
            {[
              { strategy: "Winter HDD Collar — NYC", type: "Collar", cost: "$125K", maxPayout: "$2.5M", protection: "Above 900 HDD", status: "ACTIVE" },
              { strategy: "Summer CDD Put — Houston", type: "Put", cost: "$85K", maxPayout: "$1.8M", protection: "Below 400 CDD", status: "PENDING" },
              { strategy: "Rainfall Swap — Mumbai Monsoon", type: "Swap", cost: "$200K", maxPayout: "$5.0M", protection: "Below 750mm rainfall", status: "ACTIVE" },
              { strategy: "Wind Power Hedge — North Sea", type: "Call Spread", cost: "$150K", maxPayout: "$3.2M", protection: "Wind < 15 knots avg", status: "ACTIVE" },
              { strategy: "Frost Days Cover — Florida Citrus", type: "Binary", cost: "$50K", maxPayout: "$500K", protection: "Any day below 0°C", status: "MONITORING" },
            ].map(h => (
              <div key={h.strategy} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: h.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : h.status === "PENDING" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                      color: h.status === "ACTIVE" ? "#22c55e" : h.status === "PENDING" ? "#fbbf24" : "#38bdf8",
                    }}>{h.status}</span>
                    <span className="font-bold">{h.strategy}</span>
                  </div>
                  <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{h.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Premium:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{h.cost}</span></div>
                  <div><span style={{ color: "#64748b" }}>Max Payout:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{h.maxPayout}</span></div>
                  <div><span style={{ color: "#64748b" }}>Trigger:</span> <span className="font-mono">{h.protection}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SEASONAL ENERGY DEMAND CORRELATION</div>
            {[
              { metric: "HDD vs Nat Gas Price", corr: 0.85, pValue: 0.001, r2: 0.72 },
              { metric: "CDD vs Power Demand", corr: 0.92, pValue: 0.001, r2: 0.85 },
              { metric: "Rainfall vs Crop Yield", corr: 0.68, pValue: 0.005, r2: 0.46 },
              { metric: "Wind Speed vs Wind Farm Rev", corr: 0.78, pValue: 0.001, r2: 0.61 },
              { metric: "Snow Cover vs Ski Resort Rev", corr: 0.88, pValue: 0.001, r2: 0.77 },
            ].map(m => (
              <div key={m.metric} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="flex-1 font-bold">{m.metric}</span>
                <div className="w-20 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${m.corr * 100}%`, background: m.corr > 0.8 ? "#22c55e" : m.corr > 0.6 ? "#fbbf24" : "#ef4444" }} />
                </div>
                <span className="font-mono w-10 text-right" style={{ color: m.corr > 0.8 ? "#22c55e" : "#fbbf24" }}>{m.corr.toFixed(2)}</span>
                <span className="font-mono w-12 text-right text-[9px]" style={{ color: "#64748b" }}>R²={m.r2.toFixed(2)}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>EL NINO / LA NINA IMPACT</div>
            <div className="p-3 rounded" style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: "#38bdf8" }}>CURRENT: WEAK LA NINA</span>
                <span className="font-mono text-[8px]" style={{ color: "#64748b" }}>ONI: -0.8°C</span>
              </div>
              <div className="space-y-1 text-[9px]">
                {[
                  { region: "US Midwest", impact: "Colder than normal winter", severity: "HIGH" },
                  { region: "Southeast Asia", impact: "Above-normal rainfall", severity: "MEDIUM" },
                  { region: "South America", impact: "Drought risk — soy/corn", severity: "HIGH" },
                  { region: "Australia", impact: "Flooding risk — east coast", severity: "MEDIUM" },
                ].map(e => (
                  <div key={e.region} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: e.severity === "HIGH" ? "#ef4444" : "#fbbf24" }} />
                    <span className="w-28" style={{ color: "#e2e8f0" }}>{e.region}</span>
                    <span style={{ color: "#94a3b8" }}>{e.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
