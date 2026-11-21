"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "prices" | "usda" | "weather" | "trade";

const COMMODITIES = [
  { name: "Corn (CBOT)", ticker: "ZC", price: 485.25, change: 1.8, unit: "¢/bu", contract: "Mar27" },
  { name: "Wheat (CBOT)", ticker: "ZW", price: 612.50, change: -2.4, unit: "¢/bu", contract: "Mar27" },
  { name: "Soybeans (CBOT)", ticker: "ZS", price: 1142.75, change: 0.8, unit: "¢/bu", contract: "Mar27" },
  { name: "Soybean Oil", ticker: "ZL", price: 42.85, change: 2.2, unit: "¢/lb", contract: "Mar27" },
  { name: "Soybean Meal", ticker: "ZM", price: 318.40, change: -0.6, unit: "$/ton", contract: "Mar27" },
  { name: "Cotton #2", ticker: "CT", price: 78.45, change: -1.5, unit: "¢/lb", contract: "Mar27" },
  { name: "Sugar #11", ticker: "SB", price: 22.85, change: 3.4, unit: "¢/lb", contract: "Mar27" },
  { name: "Coffee C", ticker: "KC", price: 248.50, change: 4.2, unit: "¢/lb", contract: "Mar27" },
  { name: "Cocoa", ticker: "CC", price: 8450, change: -5.8, unit: "$/mt", contract: "Mar27" },
  { name: "Rice (Rough)", ticker: "ZR", price: 15.82, change: 1.2, unit: "$/cwt", contract: "Mar27" },
  { name: "Palm Oil (BMD)", ticker: "FCPO", price: 4285, change: 2.8, unit: "MYR/mt", contract: "Feb27" },
  { name: "Live Cattle", ticker: "LE", price: 192.45, change: 0.4, unit: "¢/lb", contract: "Feb27" },
];

export default function AgriculturePanel() {
  const [tab, setTab] = useState<Tab>("prices");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌾</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>AGRICULTURE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>Bloomberg AGRI</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["prices", "usda", "weather", "trade"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "BCOM AGRI", value: "142.8", change: "+1.2%", color: "#22c55e" },
          { label: "CORN", value: "485¢", change: "+1.8%", color: "#22c55e" },
          { label: "WHEAT", value: "612¢", change: "-2.4%", color: "#ef4444" },
          { label: "SOYBEANS", value: "1142¢", change: "+0.8%", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold" style={{ color: "#e2e8f0" }}>{s.value}</span>
              <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "prices" && (
          <div className="space-y-1">
            <div className="grid grid-cols-6 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>COMMODITY</span><span>TICKER</span><span className="text-right">PRICE</span>
              <span className="text-right">UNIT</span><span className="text-right">CHG%</span><span>CONTRACT</span>
            </div>
            {COMMODITIES.map((c, i) => (
              <div key={c.ticker} className="grid grid-cols-6 gap-2 px-2 py-1.5 rounded items-center"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="font-bold truncate" style={{ color: "#eab308" }}>{c.name}</span>
                <span className="font-mono" style={{ color: "#38bdf8" }}>{c.ticker}</span>
                <span className="font-mono text-right font-bold">{c.price.toLocaleString()}</span>
                <span className="text-right text-[9px]" style={{ color: "#64748b" }}>{c.unit}</span>
                <span className="font-mono text-right" style={{ color: c.change >= 0 ? "#22c55e" : "#ef4444" }}>
                  {c.change >= 0 ? "+" : ""}{c.change}%
                </span>
                <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{c.contract}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "usda" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>USDA WASDE — GLOBAL SUPPLY & DEMAND (2026/27)</div>
            {[
              { crop: "Corn", production: 1225, consumption: 1210, endStocks: 312, stocksToUse: 25.8, revision: "+2.5M mt" },
              { crop: "Wheat", production: 795, consumption: 802, endStocks: 258, stocksToUse: 32.2, revision: "-1.8M mt" },
              { crop: "Soybeans", production: 418, consumption: 405, endStocks: 128, stocksToUse: 31.6, revision: "+3.2M mt" },
              { crop: "Rice", production: 525, consumption: 520, endStocks: 172, stocksToUse: 33.1, revision: "+0.5M mt" },
              { crop: "Cotton", production: 118, consumption: 122, endStocks: 78, stocksToUse: 63.9, revision: "-0.8M bales" },
            ].map(c => (
              <div key={c.crop} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#eab308" }}>{c.crop}</span>
                  <span className="text-[9px]" style={{ color: c.revision.startsWith("+") ? "#22c55e" : "#ef4444" }}>
                    Rev: {c.revision}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Prod:</span> <span className="font-mono">{c.production}M mt</span></div>
                  <div><span style={{ color: "#64748b" }}>Cons:</span> <span className="font-mono">{c.consumption}M mt</span></div>
                  <div><span style={{ color: "#64748b" }}>End Stk:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{c.endStocks}M mt</span></div>
                  <div><span style={{ color: "#64748b" }}>S/U:</span> <span className="font-mono font-bold" style={{ color: c.stocksToUse < 30 ? "#ef4444" : c.stocksToUse < 35 ? "#fbbf24" : "#22c55e" }}>{c.stocksToUse}%</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>KEY CROP CALENDAR</div>
            {[
              { event: "USDA WASDE Report", date: "Dec 10", impact: "HIGH" },
              { event: "CONAB Brazil Crop Estimate", date: "Dec 12", impact: "HIGH" },
              { event: "US Export Sales (Weekly)", date: "Every Thu", impact: "MEDIUM" },
              { event: "CFTC COT Report", date: "Every Fri", impact: "MEDIUM" },
              { event: "Argentina Crop Tour", date: "Jan 15-25", impact: "HIGH" },
            ].map(e => (
              <div key={e.event} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span>{e.event}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.date}</span>
                  <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                    background: e.impact === "HIGH" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: e.impact === "HIGH" ? "#ef4444" : "#fbbf24"
                  }}>{e.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "weather" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CROP WEATHER IMPACT MONITOR</div>
            {[
              { region: "US Midwest (Corn Belt)", condition: "FAVORABLE", precip: "Normal", temp: "+1°C above avg", soilMoisture: "Adequate", cropImpact: "Corn/Soy yields on track" },
              { region: "Brazil (Mato Grosso)", condition: "WATCH", precip: "Below normal", temp: "+2°C above avg", soilMoisture: "Declining", cropImpact: "Soy planting delayed 2wk" },
              { region: "Argentina (Pampas)", condition: "CONCERN", precip: "Drought risk", temp: "+3°C above avg", soilMoisture: "Low", cropImpact: "Corn/Soy stress risk" },
              { region: "EU (France/Germany)", condition: "FAVORABLE", precip: "Above normal", temp: "Normal", soilMoisture: "Good", cropImpact: "Winter wheat established" },
              { region: "India (Punjab)", condition: "FAVORABLE", precip: "Normal", temp: "Normal", soilMoisture: "Adequate", cropImpact: "Rabi season on track" },
              { region: "Australia (NSW/QLD)", condition: "WATCH", precip: "Below normal", temp: "+1.5°C", soilMoisture: "Moderate", cropImpact: "Wheat harvest completing" },
            ].map(w => (
              <div key={w.region} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${w.condition === "CONCERN" ? "rgba(239,68,68,0.2)" : w.condition === "WATCH" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)"}`
              }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{w.region}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: w.condition === "CONCERN" ? "rgba(239,68,68,0.15)" : w.condition === "WATCH" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                    color: w.condition === "CONCERN" ? "#ef4444" : w.condition === "WATCH" ? "#fbbf24" : "#22c55e"
                  }}>{w.condition}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Precip:</span> <span>{w.precip}</span></div>
                  <div><span style={{ color: "#64748b" }}>Temp:</span> <span>{w.temp}</span></div>
                  <div><span style={{ color: "#64748b" }}>Soil:</span> <span style={{ color: w.soilMoisture === "Low" ? "#ef4444" : w.soilMoisture === "Declining" ? "#fbbf24" : "#22c55e" }}>{w.soilMoisture}</span></div>
                  <div><span style={{ color: "#64748b" }}>Impact:</span> <span style={{ color: "#94a3b8" }}>{w.cropImpact}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "trade" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL AGRICULTURAL TRADE FLOWS</div>
            {[
              { commodity: "Soybeans", exporter: "Brazil", importer: "China", volume: "98M mt", share: "72%", status: "ACTIVE" },
              { commodity: "Corn", exporter: "USA", importer: "Mexico", volume: "18M mt", share: "24%", status: "ACTIVE" },
              { commodity: "Wheat", exporter: "Russia", importer: "Egypt", volume: "12M mt", share: "15%", status: "DISRUPTED" },
              { commodity: "Rice", exporter: "India", importer: "Africa", volume: "15M mt", share: "40%", status: "RESTRICTED" },
              { commodity: "Palm Oil", exporter: "Indonesia", importer: "India", volume: "8M mt", share: "55%", status: "ACTIVE" },
              { commodity: "Coffee", exporter: "Brazil", importer: "EU", volume: "22M bags", share: "35%", status: "ACTIVE" },
            ].map(t => (
              <div key={`${t.commodity}-${t.exporter}`} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold" style={{ color: "#eab308" }}>{t.commodity}</span>
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                      background: t.status === "DISRUPTED" ? "rgba(239,68,68,0.15)" : t.status === "RESTRICTED" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                      color: t.status === "DISRUPTED" ? "#ef4444" : t.status === "RESTRICTED" ? "#fbbf24" : "#22c55e"
                    }}>{t.status}</span>
                  </div>
                  <div className="text-[9px]">
                    <span style={{ color: "#00e5a0" }}>{t.exporter}</span>
                    <span style={{ color: "#64748b" }}> → </span>
                    <span style={{ color: "#38bdf8" }}>{t.importer}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold" style={{ color: "#fbbf24" }}>{t.volume}</div>
                  <div className="text-[9px]" style={{ color: "#64748b" }}>Mkt Share: {t.share}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
