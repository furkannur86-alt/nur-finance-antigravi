"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "power" | "natgas" | "lng" | "emissions";

export default function EnergyTradingPanel() {
  const [tab, setTab] = useState<Tab>("power");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">⚡</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ENERGY TRADING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>Bloomberg ENRG</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["power", "natgas", "lng", "emissions"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "natgas" ? "NAT GAS" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "PJM DA", value: "$42.5/MWh", color: "#f97316" },
          { label: "HENRY HUB", value: "$3.85/MMBtu", color: "#22c55e" },
          { label: "JKM LNG", value: "$14.2/MMBtu", color: "#38bdf8" },
          { label: "EUA DEC26", value: "€68.5/t", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "power" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>US POWER MARKETS — DAY-AHEAD PRICES</div>
            {[
              { hub: "PJM Western Hub", da: 42.50, rt: 38.80, peak: 68.20, offPeak: 28.40, spark: 12.5 },
              { hub: "ERCOT North", da: 35.80, rt: 42.50, peak: 85.40, offPeak: 22.10, spark: 15.2 },
              { hub: "CAISO SP15", da: 48.20, rt: 45.60, peak: 72.80, offPeak: 32.50, spark: 8.4 },
              { hub: "NYISO Zone J", da: 52.40, rt: 48.90, peak: 95.20, offPeak: 35.80, spark: 18.6 },
              { hub: "MISO Indiana Hub", da: 38.50, rt: 36.20, peak: 55.40, offPeak: 25.60, spark: 10.8 },
              { hub: "ISO-NE Mass Hub", da: 45.80, rt: 42.10, peak: 78.50, offPeak: 30.20, spark: 14.2 },
            ].map(h => (
              <div key={h.hub} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#f97316" }}>{h.hub}</span>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>${h.da}/MWh</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>RT:</span> <span className="font-mono">${h.rt}</span></div>
                  <div><span style={{ color: "#64748b" }}>Peak:</span> <span className="font-mono" style={{ color: "#ef4444" }}>${h.peak}</span></div>
                  <div><span style={{ color: "#64748b" }}>Off-Pk:</span> <span className="font-mono" style={{ color: "#22c55e" }}>${h.offPeak}</span></div>
                  <div><span style={{ color: "#64748b" }}>Spark:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>${h.spark}</span></div>
                  <div><span style={{ color: "#64748b" }}>Basis:</span> <span className="font-mono" style={{ color: h.da > h.rt ? "#22c55e" : "#ef4444" }}>{h.da > h.rt ? "+" : ""}{(h.da - h.rt).toFixed(1)}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>EU POWER (€/MWh)</div>
            {[
              { market: "Germany (DE Baseload)", price: 85.40, change: -2.8 },
              { market: "France (FR Baseload)", price: 78.20, change: -1.5 },
              { market: "UK (N2EX Day-Ahead)", price: 72.50, change: 3.2 },
              { market: "Nordic (SYS)", price: 42.80, change: -5.4 },
            ].map(m => (
              <div key={m.market} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{m.market}</span>
                <div className="flex items-center gap-3 font-mono text-[9px]">
                  <span style={{ color: "#fbbf24" }}>€{m.price}</span>
                  <span style={{ color: m.change >= 0 ? "#22c55e" : "#ef4444" }}>{m.change >= 0 ? "+" : ""}{m.change}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "natgas" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NATURAL GAS BENCHMARKS</div>
            {[
              { benchmark: "Henry Hub (NYMEX)", price: 3.85, change: 4.2, unit: "$/MMBtu", contract: "Jan27" },
              { benchmark: "TTF (ICE)", price: 12.45, change: -2.8, unit: "€/MWh", contract: "Jan27" },
              { benchmark: "NBP (ICE)", price: 95.80, change: -1.5, unit: "p/therm", contract: "Jan27" },
              { benchmark: "AECO (NGX)", price: 2.15, change: 8.5, unit: "C$/GJ", contract: "Jan27" },
              { benchmark: "JKM (Platts)", price: 14.20, change: 3.4, unit: "$/MMBtu", contract: "Jan27" },
            ].map(b => (
              <div key={b.benchmark} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{b.benchmark}</div>
                  <span className="text-[8px] font-mono" style={{ color: "#64748b" }}>{b.contract} · {b.unit}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold" style={{ color: "#fbbf24" }}>{b.price}</div>
                  <span className="text-[9px]" style={{ color: b.change >= 0 ? "#22c55e" : "#ef4444" }}>{b.change >= 0 ? "+" : ""}{b.change}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>US STORAGE (EIA)</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Working Gas", value: "3,542 Bcf", sub: "-85 vs 5yr avg" },
                { label: "Weekly Change", value: "-72 Bcf", sub: "vs -68 expected" },
                { label: "Days Supply", value: "52 days", sub: "vs 48 avg" },
                { label: "Heating Degree Days", value: "185", sub: "+12 vs normal" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#f97316" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "lng" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL LNG SPOT PRICES</div>
            {[
              { region: "NE Asia (JKM)", price: 14.20, change: 3.4, cargoes: 42 },
              { region: "NW Europe (TTF)", price: 12.45, change: -2.8, cargoes: 28 },
              { region: "SW Europe (Med)", price: 12.80, change: -1.2, cargoes: 15 },
              { region: "South America", price: 13.50, change: 5.2, cargoes: 8 },
              { region: "South Asia (India)", price: 13.80, change: 2.1, cargoes: 12 },
            ].map(r => (
              <div key={r.region} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{r.region}</div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{r.cargoes} cargoes available</span>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold" style={{ color: "#38bdf8" }}>${r.price}/MMBtu</div>
                  <span className="text-[9px]" style={{ color: r.change >= 0 ? "#22c55e" : "#ef4444" }}>{r.change >= 0 ? "+" : ""}{r.change}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>LNG EXPORT TERMINALS (US)</div>
            {[
              { terminal: "Sabine Pass (LA)", capacity: 30, utilization: 95, operator: "Cheniere" },
              { terminal: "Cameron LNG (LA)", capacity: 15, utilization: 88, operator: "Sempra" },
              { terminal: "Freeport LNG (TX)", capacity: 15, utilization: 92, operator: "Freeport LNG" },
              { terminal: "Corpus Christi (TX)", capacity: 25, utilization: 97, operator: "Cheniere" },
              { terminal: "Golden Pass (TX)", capacity: 18, utilization: 0, operator: "QatarEnergy/Exxon" },
            ].map(t => (
              <div key={t.terminal} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{t.terminal}</span>
                  <span className="font-mono" style={{ color: t.utilization > 90 ? "#22c55e" : t.utilization > 0 ? "#fbbf24" : "#64748b" }}>{t.utilization}%</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${t.utilization}%`, background: t.utilization > 90 ? "#22c55e" : t.utilization > 0 ? "#fbbf24" : "#64748b" }} />
                  </div>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#64748b" }}>{t.operator}</span>
                  <span className="font-mono">{t.capacity} MTPA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "emissions" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RENEWABLE ENERGY CERTIFICATES (REC)</div>
            {[
              { market: "US National Wind", price: 2.85, change: -8.5, vintage: "2026" },
              { market: "US National Solar", price: 5.40, change: 12.2, vintage: "2026" },
              { market: "Texas Wind (ERCOT)", price: 1.20, change: -15.4, vintage: "2026" },
              { market: "PJM Solar SREC", price: 42.50, change: -4.2, vintage: "2026" },
              { market: "EU Guarantees of Origin", price: 1.85, change: 22.5, vintage: "2026" },
            ].map(r => (
              <div key={r.market} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{r.market}</div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Vintage: {r.vintage}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold" style={{ color: "#22c55e" }}>${r.price}/MWh</div>
                  <span className="text-[9px]" style={{ color: r.change >= 0 ? "#22c55e" : "#ef4444" }}>{r.change >= 0 ? "+" : ""}{r.change}%</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CAPACITY MARKETS</div>
            {[
              { auction: "PJM BRA 2026/27", price: "$48.50/MW-day", change: "+22%", status: "CLEARED" },
              { auction: "ISO-NE FCA 18", price: "$3.98/kW-mo", change: "+5%", status: "CLEARED" },
              { auction: "UK T-4 2027/28", price: "£42/kW/yr", change: "+18%", status: "PENDING" },
            ].map(a => (
              <div key={a.auction} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <span className="font-bold">{a.auction}</span>
                  <span className="ml-2 px-1 py-0.5 rounded text-[8px] font-bold" style={{
                    background: a.status === "CLEARED" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                    color: a.status === "CLEARED" ? "#22c55e" : "#fbbf24"
                  }}>{a.status}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px]">
                  <span style={{ color: "#fbbf24" }}>{a.price}</span>
                  <span style={{ color: "#22c55e" }}>{a.change}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
