"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "solar" | "geomagnetic" | "satellites" | "debris";

export default function SpaceWeatherPanel() {
  const [tab, setTab] = useState<Tab>("solar");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">☀️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SPACE WEATHER</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>NUR GALACTIC</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["solar", "geomagnetic", "satellites", "debris"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "solar" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SOLAR ACTIVITY MONITOR</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Solar Flux", value: "148", unit: "SFU", status: "Elevated" },
                { label: "Sunspot #", value: "185", unit: "", status: "High" },
                { label: "X-Ray Flux", value: "C4.2", unit: "", status: "Moderate" },
                { label: "Proton Flux", value: "12.5", unit: "pfu", status: "Normal" },
              ].map(m => (
                <div key={m.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#f59e0b" }}>{m.value}<span className="text-[8px] ml-0.5" style={{ color: "#64748b" }}>{m.unit}</span></div>
                  <div className="text-[8px]" style={{ color: m.status === "High" || m.status === "Elevated" ? "#ef4444" : "#22c55e" }}>{m.status}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT SOLAR FLARES</div>
            {[
              { time: "14:32 UTC", class: "M2.8", region: "AR3842", duration: "22 min", cme: "Yes", impact: "High" },
              { time: "11:15 UTC", class: "C6.1", region: "AR3840", duration: "15 min", cme: "No", impact: "Low" },
              { time: "08:45 UTC", class: "M1.2", region: "AR3842", duration: "18 min", cme: "Partial", impact: "Medium" },
              { time: "03:20 UTC", class: "C3.5", region: "AR3838", duration: "12 min", cme: "No", impact: "Low" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono w-16" style={{ color: "#64748b" }}>{f.time}</span>
                <span className="font-mono font-bold w-10" style={{ color: f.class.startsWith("M") ? "#ef4444" : "#fbbf24" }}>{f.class}</span>
                <span className="font-mono w-16">{f.region}</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{f.duration}</span>
                <span className="text-[8px] w-12 text-center" style={{ color: f.cme === "Yes" ? "#ef4444" : f.cme === "Partial" ? "#fbbf24" : "#64748b" }}>CME: {f.cme}</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: f.impact === "High" ? "rgba(239,68,68,0.1)" : f.impact === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(100,116,139,0.1)",
                  color: f.impact === "High" ? "#ef4444" : f.impact === "Medium" ? "#fbbf24" : "#64748b",
                }}>{f.impact}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "geomagnetic" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GEOMAGNETIC STORM INDEX</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Kp Index", value: "5", max: 9, color: "#fbbf24" },
                { label: "Dst Index", value: "-85 nT", max: 0, color: "#ef4444" },
                { label: "Bz Component", value: "-8.2 nT", max: 0, color: "#ef4444" },
              ].map(g => (
                <div key={g.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{g.label}</div>
                  <div className="font-mono font-bold text-lg" style={{ color: g.color }}>{g.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STORM SCALE — NOAA G-SCALE</div>
            {[
              { level: "G5", label: "Extreme", prob: "2%", impact: "Power grid collapse, satellite loss" },
              { level: "G4", label: "Severe", prob: "5%", impact: "Widespread voltage issues" },
              { level: "G3", label: "Strong", prob: "15%", impact: "HF radio blackout, GPS errors" },
              { level: "G2", label: "Moderate", prob: "35%", impact: "Power grid fluctuations" },
              { level: "G1", label: "Minor", prob: "43%", impact: "Weak power grid effects" },
            ].map(s => (
              <div key={s.level} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-8" style={{
                  color: s.level === "G5" ? "#ef4444" : s.level === "G4" ? "#f97316" : s.level === "G3" ? "#fbbf24" : "#22c55e",
                }}>{s.level}</span>
                <span className="w-16">{s.label}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#64748b" }}>{s.prob}</span>
                <span className="text-[9px] ml-2" style={{ color: "#64748b" }}>{s.impact}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "satellites" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SATELLITE RISK ASSESSMENT</div>
            {[
              { constellation: "Starlink", operator: "SpaceX", count: 6200, risk: "Medium", issue: "Drag increase from storm" },
              { constellation: "GPS III", operator: "USSF", count: 31, risk: "Low", issue: "Nominal operations" },
              { constellation: "OneWeb", operator: "Eutelsat", count: 648, risk: "Medium", issue: "SEU rate elevated" },
              { constellation: "Iridium NEXT", operator: "Iridium", count: 66, risk: "Low", issue: "Nominal" },
              { constellation: "GOES", operator: "NOAA", count: 4, risk: "High", issue: "Particle bombardment" },
            ].map(s => (
              <div key={s.constellation} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{s.constellation}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{s.operator}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: s.risk === "High" ? "rgba(239,68,68,0.15)" : s.risk === "Medium" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                    color: s.risk === "High" ? "#ef4444" : s.risk === "Medium" ? "#fbbf24" : "#22c55e",
                  }}>{s.risk}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="font-mono">{s.count.toLocaleString()} sats</span>
                  <span style={{ color: "#64748b" }}>{s.issue}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "debris" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SPACE DEBRIS TRACKING</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: "Tracked Objects", value: "36,500+", color: "#00e5a0" },
                { label: "Close Approaches (24h)", value: "142", color: "#fbbf24" },
                { label: "Collision Prob > 1e-4", value: "3", color: "#ef4444" },
              ].map(d => (
                <div key={d.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{d.label}</div>
                  <div className="font-mono font-bold" style={{ color: d.color }}>{d.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#ef4444" }}>HIGH-RISK CONJUNCTION ALERTS</div>
            {[
              { time: "16:45 UTC", obj1: "Starlink-5842", obj2: "Cosmos debris", dist: "85m", prob: "2.3e-3", action: "Maneuver planned" },
              { time: "22:15 UTC", obj1: "ISS", obj2: "CZ-3B R/B", dist: "1.2km", prob: "5.1e-4", action: "Monitoring" },
              { time: "03:30 UTC+1", obj1: "OneWeb-0245", obj2: "Fengyun debris", dist: "250m", prob: "1.8e-4", action: "Evaluating" },
            ].map((a, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.time}</span>
                  <span className="font-mono font-bold" style={{ color: "#ef4444" }}>P={a.prob}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span><span style={{ color: "#00e5a0" }}>{a.obj1}</span> vs <span style={{ color: "#fbbf24" }}>{a.obj2}</span></span>
                  <span className="font-mono">{a.dist}</span>
                </div>
                <div className="text-[8px] mt-1" style={{ color: "#38bdf8" }}>{a.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
