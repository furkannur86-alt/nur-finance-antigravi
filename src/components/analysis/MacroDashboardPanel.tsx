"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "overview" | "indicators" | "trade" | "labor";

export default function MacroDashboardPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌍</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>MACRO DASHBOARD</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg ECOD</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "indicators", "trade", "labor"] as Tab[]).map(t => (
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
          { label: "US GDP (Q3)", value: "+2.8%", color: "#22c55e" },
          { label: "US CPI", value: "2.8%", color: "#fbbf24" },
          { label: "US UNEMP", value: "4.1%", color: "#38bdf8" },
          { label: "ISM MFG", value: "49.8", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>GLOBAL GDP GROWTH FORECASTS (IMF)</div>
            {[
              { country: "🇺🇸 United States", gdp2026: 2.1, gdp2027: 1.8, cpi: 2.8, debt: 124.5, currentAcct: -3.2 },
              { country: "🇪🇺 Euro Area", gdp2026: 1.2, gdp2027: 1.5, cpi: 2.4, debt: 88.5, currentAcct: 2.8 },
              { country: "🇨🇳 China", gdp2026: 4.5, gdp2027: 4.2, cpi: 0.4, debt: 83.6, currentAcct: 1.5 },
              { country: "🇯🇵 Japan", gdp2026: 1.0, gdp2027: 0.8, cpi: 2.8, debt: 252.4, currentAcct: 3.2 },
              { country: "🇬🇧 United Kingdom", gdp2026: 1.5, gdp2027: 1.4, cpi: 2.6, debt: 98.5, currentAcct: -3.8 },
              { country: "🇮🇳 India", gdp2026: 6.8, gdp2027: 6.5, cpi: 5.2, debt: 82.4, currentAcct: -1.8 },
              { country: "🇧🇷 Brazil", gdp2026: 2.2, gdp2027: 2.5, cpi: 4.8, debt: 78.5, currentAcct: -2.5 },
              { country: "🇩🇪 Germany", gdp2026: 0.8, gdp2027: 1.2, cpi: 2.2, debt: 62.8, currentAcct: 6.5 },
            ].map(c => (
              <div key={c.country} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.country}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold" style={{ color: c.gdp2027 >= 2 ? "#22c55e" : c.gdp2027 >= 1 ? "#fbbf24" : "#ef4444" }}>2027: {c.gdp2027}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>2026:</span> <span className="font-mono" style={{ color: c.gdp2026 >= 2 ? "#22c55e" : c.gdp2026 >= 1 ? "#fbbf24" : "#ef4444" }}>{c.gdp2026}%</span></div>
                  <div><span style={{ color: "#64748b" }}>CPI:</span> <span className="font-mono" style={{ color: c.cpi > 4 ? "#ef4444" : c.cpi > 2.5 ? "#fbbf24" : "#22c55e" }}>{c.cpi}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Debt:</span> <span className="font-mono" style={{ color: c.debt > 100 ? "#ef4444" : c.debt > 80 ? "#fbbf24" : "#22c55e" }}>{c.debt}%</span></div>
                  <div><span style={{ color: "#64748b" }}>C/A:</span> <span className="font-mono" style={{ color: c.currentAcct >= 0 ? "#22c55e" : "#ef4444" }}>{c.currentAcct}%</span></div>
                  <div className="flex items-center">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(c.gdp2027 * 15, 100)}%`, background: c.gdp2027 >= 2 ? "#22c55e" : c.gdp2027 >= 1 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "indicators" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US ECONOMIC INDICATORS</div>
            {[
              { name: "GDP Growth (Q3 SAAR)", value: "2.8%", prior: "3.0%", consensus: "2.5%", surprise: "BEAT" },
              { name: "CPI YoY", value: "2.8%", prior: "2.6%", consensus: "2.7%", surprise: "MISS" },
              { name: "Core PCE YoY", value: "2.8%", prior: "2.7%", consensus: "2.8%", surprise: "INLINE" },
              { name: "NFP (Nov)", value: "+227K", prior: "+36K", consensus: "+200K", surprise: "BEAT" },
              { name: "Unemployment Rate", value: "4.1%", prior: "4.1%", consensus: "4.1%", surprise: "INLINE" },
              { name: "ISM Manufacturing", value: "49.8", prior: "48.4", consensus: "49.5", surprise: "BEAT" },
              { name: "ISM Services", value: "56.5", prior: "55.5", consensus: "55.8", surprise: "BEAT" },
              { name: "Retail Sales MoM", value: "+0.7%", prior: "+0.5%", consensus: "+0.4%", surprise: "BEAT" },
              { name: "Housing Starts", value: "1.42M", prior: "1.35M", consensus: "1.38M", surprise: "BEAT" },
              { name: "Consumer Confidence", value: "111.7", prior: "109.6", consensus: "108.5", surprise: "BEAT" },
            ].map(i => (
              <div key={i.name} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold flex-1">{i.name}</span>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span className="font-bold w-14 text-right">{i.value}</span>
                  <span className="w-14 text-right" style={{ color: "#64748b" }}>E: {i.consensus}</span>
                  <span className="w-14 text-right" style={{ color: "#64748b" }}>P: {i.prior}</span>
                  <span className="px-1 py-0.5 rounded text-[8px] font-bold w-14 text-center" style={{
                    background: i.surprise === "BEAT" ? "rgba(34,197,94,0.15)" : i.surprise === "MISS" ? "rgba(239,68,68,0.15)" : "rgba(56,189,248,0.15)",
                    color: i.surprise === "BEAT" ? "#22c55e" : i.surprise === "MISS" ? "#ef4444" : "#38bdf8"
                  }}>{i.surprise}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "trade" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL TRADE BALANCE ($B, Monthly)</div>
            {[
              { country: "🇨🇳 China", exports: 310.5, imports: 228.4, balance: 82.1, change: 5.2 },
              { country: "🇩🇪 Germany", exports: 142.8, imports: 118.5, balance: 24.3, change: -2.5 },
              { country: "🇺🇸 United States", exports: 268.5, imports: 342.8, balance: -74.3, change: -8.5 },
              { country: "🇯🇵 Japan", exports: 78.5, imports: 82.4, balance: -3.9, change: 12.5 },
              { country: "🇰🇷 South Korea", exports: 58.2, imports: 52.4, balance: 5.8, change: 18.4 },
              { country: "🇸🇦 Saudi Arabia", exports: 28.5, imports: 18.2, balance: 10.3, change: -15.2 },
            ].map(t => (
              <div key={t.country} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{t.country}</span>
                  <span className="font-mono font-bold" style={{ color: t.balance >= 0 ? "#22c55e" : "#ef4444" }}>{t.balance >= 0 ? "+" : ""}{t.balance}B</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Exports:</span> <span className="font-mono" style={{ color: "#22c55e" }}>${t.exports}B</span></div>
                  <div><span style={{ color: "#64748b" }}>Imports:</span> <span className="font-mono" style={{ color: "#ef4444" }}>${t.imports}B</span></div>
                  <div><span style={{ color: "#64748b" }}>YoY:</span> <span className="font-mono" style={{ color: t.change >= 0 ? "#22c55e" : "#ef4444" }}>{t.change >= 0 ? "+" : ""}{t.change}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "labor" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US LABOR MARKET DASHBOARD</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "NFP (Nov)", value: "+227K", sub: "vs +200K exp" },
                { label: "Unemployment", value: "4.1%", sub: "U-6: 7.8%" },
                { label: "Participation", value: "62.5%", sub: "Prime: 83.5%" },
                { label: "Avg Hourly Earn", value: "+4.0%", sub: "YoY" },
                { label: "JOLTS Openings", value: "7.74M", sub: "vs 8.0M exp" },
                { label: "Quits Rate", value: "2.1%", sub: "Pre-COVID: 2.3%" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#38bdf8" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>NFP BY SECTOR (Last 3 Months Avg)</div>
            {[
              { sector: "Healthcare", jobs: 54, trend: "UP" },
              { sector: "Government", jobs: 42, trend: "UP" },
              { sector: "Leisure & Hospitality", jobs: 28, trend: "FLAT" },
              { sector: "Professional Services", jobs: 22, trend: "UP" },
              { sector: "Construction", jobs: 18, trend: "UP" },
              { sector: "Manufacturing", jobs: -12, trend: "DOWN" },
              { sector: "Retail Trade", jobs: -8, trend: "DOWN" },
              { sector: "Information", jobs: -5, trend: "DOWN" },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36">{s.sector}</span>
                <div className="flex-1 flex items-center">
                  {s.jobs >= 0 ? (
                    <div className="h-2 rounded-full" style={{ width: `${Math.min(s.jobs * 1.5, 100)}%`, background: "#22c55e", opacity: 0.5 }} />
                  ) : (
                    <div className="h-2 rounded-full" style={{ width: `${Math.min(Math.abs(s.jobs) * 2, 100)}%`, background: "#ef4444", opacity: 0.5 }} />
                  )}
                </div>
                <span className="font-mono w-12 text-right" style={{ color: s.jobs >= 0 ? "#22c55e" : "#ef4444" }}>{s.jobs >= 0 ? "+" : ""}{s.jobs}K</span>
                <span className="text-[8px] w-10 text-right" style={{ color: s.trend === "UP" ? "#22c55e" : s.trend === "DOWN" ? "#ef4444" : "#fbbf24" }}>{s.trend}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
