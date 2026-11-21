"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const COMMODITIES = [
  { name: "WTI Crude", symbol: "CL", price: 72.84, change: -1.42, pctChange: -1.91, volume: "1.2M", oi: "2.1M", contract: "CLF7", expiry: "Jan 20", category: "Energy" },
  { name: "Brent Crude", symbol: "BZ", price: 76.52, change: -1.18, pctChange: -1.52, volume: "890K", oi: "1.8M", contract: "BZG7", expiry: "Feb 28", category: "Energy" },
  { name: "Natural Gas", symbol: "NG", price: 3.284, change: 0.156, pctChange: 4.98, volume: "680K", oi: "1.4M", contract: "NGF7", expiry: "Jan 29", category: "Energy" },
  { name: "Gold", symbol: "GC", price: 2685.40, change: 18.60, pctChange: 0.70, volume: "425K", oi: "580K", contract: "GCG7", expiry: "Feb 26", category: "Metals" },
  { name: "Silver", symbol: "SI", price: 31.42, change: 0.68, pctChange: 2.21, volume: "185K", oi: "210K", contract: "SIH7", expiry: "Mar 27", category: "Metals" },
  { name: "Copper", symbol: "HG", price: 4.182, change: -0.034, pctChange: -0.81, volume: "142K", oi: "280K", contract: "HGH7", expiry: "Mar 27", category: "Metals" },
  { name: "Corn", symbol: "ZC", price: 442.50, change: 3.25, pctChange: 0.74, volume: "340K", oi: "1.5M", contract: "ZCH7", expiry: "Mar 14", category: "Grains" },
  { name: "Soybeans", symbol: "ZS", price: 982.75, change: -8.50, pctChange: -0.86, volume: "215K", oi: "820K", contract: "ZSF7", expiry: "Jan 14", category: "Grains" },
  { name: "Wheat", symbol: "ZW", price: 548.25, change: 6.75, pctChange: 1.25, volume: "178K", oi: "420K", contract: "ZWH7", expiry: "Mar 14", category: "Grains" },
  { name: "Coffee", symbol: "KC", price: 258.40, change: 12.85, pctChange: 5.23, volume: "95K", oi: "180K", contract: "KCH7", expiry: "Mar 20", category: "Softs" },
  { name: "Cocoa", symbol: "CC", price: 8420.00, change: -185.00, pctChange: -2.15, volume: "52K", oi: "105K", contract: "CCH7", expiry: "Mar 14", category: "Softs" },
  { name: "Platinum", symbol: "PL", price: 942.80, change: 11.20, pctChange: 1.20, volume: "42K", oi: "68K", contract: "PLF7", expiry: "Jan 29", category: "Metals" },
];

type Tab = "prices" | "curves" | "spreads" | "seasonality";

const CATEGORIES = ["All", "Energy", "Metals", "Grains", "Softs"];

export default function CommoditiesPanel() {
  const [tab, setTab] = useState<Tab>("prices");
  const [category, setCategory] = useState("All");

  const filtered = category === "All" ? COMMODITIES : COMMODITIES.filter(c => c.category === category);

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🛢️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>COMMODITIES</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Bloomberg CMDTY</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["prices", "curves", "spreads", "seasonality"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "prices" && (
        <div className="flex gap-1 px-3 py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-2 py-0.5 rounded text-[9px]"
              style={{ background: category === c ? "rgba(0,229,160,0.15)" : "transparent", color: category === c ? "#00e5a0" : "#64748b" }}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "prices" && (
          <div className="space-y-1">
            <div className="grid grid-cols-8 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>NAME</span><span>SYMBOL</span><span className="text-right">PRICE</span><span className="text-right">CHG</span>
              <span className="text-right">%CHG</span><span className="text-right">VOLUME</span><span className="text-right">OI</span><span>CONTRACT</span>
            </div>
            {filtered.map((c, i) => (
              <div key={i} className="grid grid-cols-8 gap-2 px-2 py-1.5 rounded items-center"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="font-bold" style={{ color: "#e2e8f0" }}>{c.name}</span>
                <span className="font-mono text-[9px]" style={{ color: "#00e5a0" }}>{c.symbol}</span>
                <span className="font-mono text-right">{c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="font-mono text-right" style={{ color: c.change >= 0 ? "#22c55e" : "#ef4444" }}>
                  {c.change >= 0 ? "+" : ""}{c.change.toFixed(2)}
                </span>
                <span className="font-mono text-right" style={{ color: c.pctChange >= 0 ? "#22c55e" : "#ef4444" }}>
                  {c.pctChange >= 0 ? "+" : ""}{c.pctChange.toFixed(2)}%
                </span>
                <span className="font-mono text-right text-[9px]" style={{ color: "#94a3b8" }}>{c.volume}</span>
                <span className="font-mono text-right text-[9px]" style={{ color: "#94a3b8" }}>{c.oi}</span>
                <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{c.contract}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "curves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WTI CRUDE OIL FORWARD CURVE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 150" className="w-full">
                {[
                  { m: "Jan", p: 72.84 }, { m: "Feb", p: 72.20 }, { m: "Mar", p: 71.65 },
                  { m: "Apr", p: 71.15 }, { m: "May", p: 70.72 }, { m: "Jun", p: 70.35 },
                  { m: "Jul", p: 69.98 }, { m: "Aug", p: 69.65 }, { m: "Sep", p: 69.38 },
                  { m: "Oct", p: 69.12 }, { m: "Nov", p: 68.90 }, { m: "Dec", p: 68.72 },
                ].map((pt, i, arr) => {
                  const x = 30 + i * 32;
                  const minP = 68; const maxP = 73;
                  const y = 130 - ((pt.p - minP) / (maxP - minP)) * 110;
                  const nextPt = arr[i + 1];
                  return (
                    <g key={i}>
                      {nextPt && (
                        <line x1={x} y1={y} x2={x + 32} y2={130 - ((nextPt.p - minP) / (maxP - minP)) * 110}
                          stroke="#f59e0b" strokeWidth="2" />
                      )}
                      <circle cx={x} cy={y} r="3" fill="#f59e0b" />
                      <text x={x} y={145} textAnchor="middle" fill="#64748b" fontSize="7">{pt.m}</text>
                      {i % 2 === 0 && <text x={x} y={y - 8} textAnchor="middle" fill="#94a3b8" fontSize="7">${pt.p}</text>}
                    </g>
                  );
                })}
                <text x="5" y="10" fill="#94a3b8" fontSize="8">$/bbl</text>
                <text x="200" y="12" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">BACKWARDATION</text>
              </svg>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GOLD FORWARD CURVE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <svg viewBox="0 0 400 150" className="w-full">
                {[
                  { m: "Jan", p: 2685 }, { m: "Feb", p: 2692 }, { m: "Mar", p: 2700 },
                  { m: "Apr", p: 2708 }, { m: "May", p: 2716 }, { m: "Jun", p: 2724 },
                  { m: "Jul", p: 2732 }, { m: "Aug", p: 2741 }, { m: "Sep", p: 2750 },
                  { m: "Oct", p: 2759 }, { m: "Nov", p: 2768 }, { m: "Dec", p: 2778 },
                ].map((pt, i, arr) => {
                  const x = 30 + i * 32;
                  const minP = 2680; const maxP = 2785;
                  const y = 130 - ((pt.p - minP) / (maxP - minP)) * 110;
                  const nextPt = arr[i + 1];
                  return (
                    <g key={i}>
                      {nextPt && (
                        <line x1={x} y1={y} x2={x + 32} y2={130 - ((nextPt.p - minP) / (maxP - minP)) * 110}
                          stroke="#fbbf24" strokeWidth="2" />
                      )}
                      <circle cx={x} cy={y} r="3" fill="#fbbf24" />
                      <text x={x} y={145} textAnchor="middle" fill="#64748b" fontSize="7">{pt.m}</text>
                    </g>
                  );
                })}
                <text x="5" y="10" fill="#94a3b8" fontSize="8">$/oz</text>
                <text x="200" y="12" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">CONTANGO</text>
              </svg>
            </div>
          </div>
        )}

        {tab === "spreads" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>INTER-COMMODITY SPREADS</div>
            {[
              { name: "Crack Spread (3-2-1)", value: 28.45, change: -1.82, desc: "3 bbl crude → 2 bbl gasoline + 1 bbl diesel", color: "#f59e0b" },
              { name: "Gold/Silver Ratio", value: 85.4, change: -1.2, desc: "Oz gold / Oz silver — historically mean-reverts to 65", color: "#fbbf24" },
              { name: "Brent-WTI Spread", value: 3.68, change: 0.24, desc: "International vs domestic crude differential", color: "#38bdf8" },
              { name: "Corn/Wheat Ratio", value: 0.807, change: 0.012, desc: "Feed substitution economics indicator", color: "#22c55e" },
              { name: "Nat Gas/Crude Ratio", value: 4.5, change: 0.8, desc: "BTU-equivalent ratio (10:1 = parity)", color: "#ef4444" },
              { name: "Platinum/Gold Ratio", value: 0.351, change: 0.004, desc: "Historically >1.0, now at multi-decade lows", color: "#a855f7" },
            ].map(s => (
              <div key={s.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: s.color }}>{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{s.value}</span>
                    <span className="font-mono text-[9px]" style={{ color: s.change >= 0 ? "#22c55e" : "#ef4444" }}>
                      {s.change >= 0 ? "+" : ""}{s.change}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] mt-1" style={{ color: "#64748b" }}>{s.desc}</div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-3" style={{ color: "#fbbf24" }}>CALENDAR SPREADS</div>
            {[
              { name: "CL M1-M2", spread: 0.64, structure: "Backwardation" },
              { name: "CL M1-M6", spread: 2.49, structure: "Backwardation" },
              { name: "GC M1-M6", spread: -38.60, structure: "Contango" },
              { name: "NG M1-M4", spread: -0.42, structure: "Contango" },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono" style={{ color: "#e2e8f0" }}>{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: s.spread >= 0 ? "#22c55e" : "#ef4444" }}>
                    {s.spread >= 0 ? "+" : ""}{s.spread.toFixed(2)}
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded" style={{
                    background: s.structure === "Backwardation" ? "rgba(249,115,22,0.15)" : "rgba(56,189,248,0.15)",
                    color: s.structure === "Backwardation" ? "#f97316" : "#38bdf8"
                  }}>{s.structure}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "seasonality" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SEASONAL PATTERNS (20-YEAR AVG MONTHLY RETURNS)</div>
            {[
              { commodity: "Crude Oil (CL)", data: [2.1, 1.8, -0.5, 3.2, 1.4, -2.8, 0.6, -1.2, -3.4, 2.8, -1.5, 1.2] },
              { commodity: "Gold (GC)", data: [3.2, 0.8, -0.4, 1.1, -0.2, 1.8, 0.5, 2.4, 3.1, -0.6, 0.2, -0.8] },
              { commodity: "Natural Gas (NG)", data: [-5.2, -4.8, -2.1, -3.5, 1.2, 2.8, 4.5, 1.8, 3.2, 5.8, 8.2, -1.4] },
              { commodity: "Corn (ZC)", data: [-1.2, 0.5, 2.8, 1.5, 3.2, 5.8, 2.1, -2.4, -3.8, -1.2, 0.4, -0.8] },
            ].map(item => (
              <div key={item.commodity} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-[9px] font-bold mb-2" style={{ color: "#e2e8f0" }}>{item.commodity}</div>
                <div className="flex items-end gap-1" style={{ height: 50 }}>
                  {item.data.map((v, i) => {
                    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
                    const absMax = Math.max(...item.data.map(Math.abs));
                    const h = Math.abs(v) / absMax * 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center" style={{ height: 40, justifyContent: v >= 0 ? "flex-end" : "flex-start" }}>
                          {v >= 0 ? (
                            <div className="w-full rounded-t" style={{ height: h, background: "#22c55e", opacity: 0.7 }} />
                          ) : (
                            <div className="w-full rounded-b" style={{ height: h, background: "#ef4444", opacity: 0.7, marginTop: 20 - h }} />
                          )}
                        </div>
                        <span className="text-[7px] mt-0.5" style={{ color: "#64748b" }}>{months[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CURRENT SEASONAL SIGNALS</div>
            {[
              { commodity: "Natural Gas", signal: "BULLISH", reason: "Winter heating demand peak — Nov historically +8.2%", confidence: 82 },
              { commodity: "Corn", signal: "BEARISH", reason: "Post-harvest supply pressure — Nov/Dec seasonally weak", confidence: 68 },
              { commodity: "Gold", signal: "NEUTRAL", reason: "December mixed — jewelry demand vs tax-loss selling", confidence: 45 },
              { commodity: "Coffee", signal: "BULLISH", reason: "Brazilian frost risk season approaching — supply fears", confidence: 71 },
            ].map(s => (
              <div key={s.commodity} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold" style={{ color: "#e2e8f0" }}>{s.commodity}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{
                  background: s.signal === "BULLISH" ? "rgba(34,197,94,0.15)" : s.signal === "BEARISH" ? "rgba(239,68,68,0.15)" : "rgba(148,163,184,0.15)",
                  color: s.signal === "BULLISH" ? "#22c55e" : s.signal === "BEARISH" ? "#ef4444" : "#94a3b8"
                }}>{s.signal}</span>
                <span className="flex-1 text-[9px]" style={{ color: "#94a3b8" }}>{s.reason}</span>
                <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{s.confidence}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
