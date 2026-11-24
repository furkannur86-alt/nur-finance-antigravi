"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "energy" | "metals" | "agriculture" | "curves";

export default function CommoditiesTradingPanel() {
  const [tab, setTab] = useState<Tab>("energy");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛢️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>COMMODITIES TRADING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg CMAT</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["energy", "metals", "agriculture", "curves"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "agriculture" ? "AGRI" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "energy" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ENERGY COMPLEX</div>
            {[
              { name: "WTI Crude (CL)", price: 78.45, chg: -0.82, unit: "$/bbl", oi: "1.85M", vol: "425K" },
              { name: "Brent Crude (CO)", price: 82.50, chg: -0.65, unit: "$/bbl", oi: "2.12M", vol: "380K" },
              { name: "Natural Gas (NG)", price: 2.85, chg: 3.25, unit: "$/MMBtu", oi: "1.42M", vol: "520K" },
              { name: "RBOB Gasoline (RB)", price: 2.28, chg: -1.15, unit: "$/gal", oi: "385K", vol: "125K" },
              { name: "Heating Oil (HO)", price: 2.65, chg: 0.42, unit: "$/gal", oi: "320K", vol: "95K" },
              { name: "TTF Dutch Gas", price: 42.50, chg: 2.85, unit: "€/MWh", oi: "850K", vol: "210K" },
            ].map(e => (
              <div key={e.name} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{e.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{e.price.toFixed(2)}</span>
                    <span className="font-mono" style={{ color: e.chg >= 0 ? "#22c55e" : "#ef4444" }}>{e.chg >= 0 ? "+" : ""}{e.chg}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Unit:</span> <span className="font-mono">{e.unit}</span></div>
                  <div><span style={{ color: "#64748b" }}>OI:</span> <span className="font-mono">{e.oi}</span></div>
                  <div><span style={{ color: "#64748b" }}>Volume:</span> <span className="font-mono">{e.vol}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "metals" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PRECIOUS & BASE METALS</div>
            {[
              { name: "Gold (GC)", price: 2650.80, chg: 0.85, unit: "$/oz", type: "Precious" },
              { name: "Silver (SI)", price: 31.25, chg: 1.42, unit: "$/oz", type: "Precious" },
              { name: "Platinum (PL)", price: 985.50, chg: -0.35, unit: "$/oz", type: "Precious" },
              { name: "Palladium (PA)", price: 1025.00, chg: -1.85, unit: "$/oz", type: "Precious" },
              { name: "Copper (HG)", price: 4.25, chg: 0.65, unit: "$/lb", type: "Base" },
              { name: "Aluminum (LME)", price: 2380, chg: 0.42, unit: "$/t", type: "Base" },
              { name: "Zinc (LME)", price: 2650, chg: -0.28, unit: "$/t", type: "Base" },
              { name: "Iron Ore (62%)", price: 128.50, chg: 2.15, unit: "$/t", type: "Bulk" },
            ].map(m => (
              <div key={m.name} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32 font-bold">{m.name}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{
                  background: m.type === "Precious" ? "rgba(251,191,36,0.1)" : m.type === "Base" ? "rgba(99,102,241,0.1)" : "rgba(239,68,68,0.1)",
                  color: m.type === "Precious" ? "#fbbf24" : m.type === "Base" ? "#6366f1" : "#ef4444",
                }}>{m.type}</span>
                <span className="font-mono font-bold ml-auto" style={{ color: "#00e5a0" }}>{m.price.toLocaleString()}</span>
                <span className="font-mono w-14 text-right" style={{ color: m.chg >= 0 ? "#22c55e" : "#ef4444" }}>{m.chg >= 0 ? "+" : ""}{m.chg}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "agriculture" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AGRICULTURAL FUTURES</div>
            {[
              { name: "Corn (ZC)", price: 4.85, chg: -0.42, unit: "$/bu", season: "Winter" },
              { name: "Soybeans (ZS)", price: 13.85, chg: 0.65, unit: "$/bu", season: "Harvest" },
              { name: "Wheat (ZW)", price: 5.95, chg: 1.25, unit: "$/bu", season: "Winter" },
              { name: "Cotton (CT)", price: 0.825, chg: -0.85, unit: "$/lb", season: "Post-harvest" },
              { name: "Coffee (KC)", price: 2.45, chg: 2.15, unit: "$/lb", season: "Off-season" },
              { name: "Sugar (SB)", price: 0.265, chg: 0.52, unit: "$/lb", season: "Crush" },
              { name: "Cocoa (CC)", price: 8250, chg: 3.85, unit: "$/t", season: "Main crop" },
              { name: "Live Cattle (LE)", price: 1.85, chg: -0.28, unit: "$/lb", season: "Fed cattle" },
            ].map(a => (
              <div key={a.name} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{a.name}</span>
                <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{a.price.toLocaleString()}</span>
                <span className="font-mono w-14 text-right" style={{ color: a.chg >= 0 ? "#22c55e" : "#ef4444" }}>{a.chg >= 0 ? "+" : ""}{a.chg}%</span>
                <span className="text-[8px] ml-auto" style={{ color: "#64748b" }}>{a.unit}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>{a.season}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "curves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CRUDE OIL FORWARD CURVE (WTI)</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {["Jan", "Mar", "Jun", "Sep", "Dec", "Mar'28", "Jun'28", "Dec'28"].map((m, i) => {
                const prices = [78.45, 77.80, 76.50, 75.20, 74.00, 72.80, 71.50, 70.00];
                const y = 10 + (80 - prices[i] + 70) * 4;
                return (
                  <g key={m}>
                    <circle cx={25 + i * 50} cy={y} r={3} fill="#f97316" />
                    <text x={25 + i * 50} y={y - 8} textAnchor="middle" fill="#f97316" fontSize="6">{prices[i]}</text>
                    <text x={25 + i * 50} y="98" textAnchor="middle" fill="#64748b" fontSize="5">{m}</text>
                  </g>
                );
              })}
              <polyline points={["Jan", "Mar", "Jun", "Sep", "Dec", "Mar'28", "Jun'28", "Dec'28"].map((_, i) => {
                const prices = [78.45, 77.80, 76.50, 75.20, 74.00, 72.80, 71.50, 70.00];
                return `${25 + i * 50},${10 + (80 - prices[i] + 70) * 4}`;
              }).join(" ")} fill="none" stroke="#f97316" strokeWidth={1.5} />
              <text x="200" y="12" textAnchor="middle" fill="#ef4444" fontSize="7">BACKWARDATION</text>
            </svg>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CALENDAR SPREADS</div>
            {[
              { spread: "CL Jan/Feb", value: 0.65, structure: "Backwardation" },
              { spread: "CL Q1/Q2", value: 1.95, structure: "Backwardation" },
              { spread: "NG Jan/Feb", value: -0.42, structure: "Contango" },
              { spread: "GC Dec/Feb", value: -2.80, structure: "Contango" },
              { spread: "HG Mar/May", value: 0.015, structure: "Backwardation" },
            ].map(s => (
              <div key={s.spread} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{s.spread}</span>
                <span className="font-mono font-bold" style={{ color: s.value >= 0 ? "#22c55e" : "#ef4444" }}>{s.value >= 0 ? "+" : ""}{s.value}</span>
                <span className="text-[8px] px-1 py-0.5 rounded ml-auto" style={{
                  background: s.structure === "Backwardation" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: s.structure === "Backwardation" ? "#22c55e" : "#ef4444",
                }}>{s.structure}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
