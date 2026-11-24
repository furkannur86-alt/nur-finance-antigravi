"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "sovereign" | "macro" | "political" | "contagion";

export default function CountryRiskPanel() {
  const [tab, setTab] = useState<Tab>("sovereign");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌍</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>COUNTRY RISK</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters CRSM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["sovereign", "macro", "political", "contagion"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "sovereign" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SOVEREIGN CREDIT RATINGS & CDS</div>
            {[
              { country: "🇺🇸 United States", sp: "AA+", moody: "Aaa", fitch: "AA+", cds5y: 28, outlook: "Stable", score: 95 },
              { country: "🇩🇪 Germany", sp: "AAA", moody: "Aaa", fitch: "AAA", cds5y: 18, outlook: "Stable", score: 98 },
              { country: "🇬🇧 United Kingdom", sp: "AA", moody: "Aa3", fitch: "AA-", cds5y: 32, outlook: "Stable", score: 88 },
              { country: "🇯🇵 Japan", sp: "A+", moody: "A1", fitch: "A", cds5y: 25, outlook: "Stable", score: 82 },
              { country: "🇨🇳 China", sp: "A+", moody: "A1", fitch: "A+", cds5y: 68, outlook: "Negative", score: 72 },
              { country: "🇧🇷 Brazil", sp: "BB-", moody: "Ba2", fitch: "BB", cds5y: 185, outlook: "Positive", score: 48 },
              { country: "🇹🇷 Turkey", sp: "B+", moody: "B3", fitch: "B+", cds5y: 320, outlook: "Stable", score: 35 },
              { country: "🇦🇷 Argentina", sp: "CCC+", moody: "Ca", fitch: "CC", cds5y: 1850, outlook: "Negative", score: 12 },
            ].map(c => (
              <div key={c.country} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.country}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{
                      background: c.outlook === "Positive" ? "rgba(34,197,94,0.15)" : c.outlook === "Negative" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.15)",
                      color: c.outlook === "Positive" ? "#22c55e" : c.outlook === "Negative" ? "#ef4444" : "#64748b",
                    }}>{c.outlook}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: c.cds5y > 500 ? "#ef4444" : c.cds5y > 100 ? "#fbbf24" : "#22c55e" }}>CDS: {c.cds5y}bp</span>
                    <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: c.score > 80 ? "#22c55e" : c.score > 50 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>S&P:</span> <span className="font-mono">{c.sp}</span></div>
                  <div><span style={{ color: "#64748b" }}>Moody&apos;s:</span> <span className="font-mono">{c.moody}</span></div>
                  <div><span style={{ color: "#64748b" }}>Fitch:</span> <span className="font-mono">{c.fitch}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "macro" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MACROECONOMIC INDICATORS</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    {["Country", "GDP Growth", "Inflation", "Unemployment", "Debt/GDP", "CA/GDP", "Reserves ($B)"].map(h => (
                      <th key={h} className="px-2 py-1.5 text-left font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { country: "🇺🇸 US", gdp: 2.1, inf: 3.2, unemp: 3.8, debt: 123, ca: -3.8, res: 245 },
                    { country: "🇪🇺 Eurozone", gdp: 0.8, inf: 2.4, unemp: 6.5, debt: 91, ca: 2.1, res: 820 },
                    { country: "🇨🇳 China", gdp: 4.8, inf: 0.3, unemp: 5.2, debt: 77, ca: 1.4, res: 3220 },
                    { country: "🇯🇵 Japan", gdp: 1.2, inf: 2.8, unemp: 2.5, debt: 255, ca: 3.5, res: 1250 },
                    { country: "🇮🇳 India", gdp: 6.5, inf: 5.1, unemp: 7.8, debt: 83, ca: -1.8, res: 620 },
                    { country: "🇧🇷 Brazil", gdp: 2.2, inf: 4.5, unemp: 8.2, debt: 74, ca: -2.5, res: 340 },
                    { country: "🇲🇽 Mexico", gdp: 1.8, inf: 4.2, unemp: 2.8, debt: 48, ca: -1.2, res: 210 },
                    { country: "🇿🇦 S. Africa", gdp: 0.5, inf: 5.8, unemp: 32.1, debt: 72, ca: -0.8, res: 55 },
                  ].map(r => (
                    <tr key={r.country} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold">{r.country}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.gdp > 3 ? "#22c55e" : r.gdp > 1 ? "#fbbf24" : "#ef4444" }}>{r.gdp}%</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.inf < 2.5 ? "#22c55e" : r.inf < 5 ? "#fbbf24" : "#ef4444" }}>{r.inf}%</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.unemp < 5 ? "#22c55e" : r.unemp < 10 ? "#fbbf24" : "#ef4444" }}>{r.unemp}%</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.debt > 100 ? "#ef4444" : r.debt > 60 ? "#fbbf24" : "#22c55e" }}>{r.debt}%</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: r.ca >= 0 ? "#22c55e" : "#ef4444" }}>{r.ca}%</td>
                      <td className="px-2 py-1.5 font-mono">${r.res}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TWIN DEFICITS RISK MAP</div>
            <svg viewBox="0 0 400 200" className="w-full">
              <rect x="0" y="0" width="400" height="200" fill="transparent" />
              <line x1="200" y1="10" x2="200" y2="190" stroke="#1e293b" strokeDasharray="4" />
              <line x1="10" y1="100" x2="390" y2="100" stroke="#1e293b" strokeDasharray="4" />
              <text x="200" y="8" textAnchor="middle" fill="#64748b" fontSize="7">CA Balance →</text>
              <text x="8" y="100" fill="#64748b" fontSize="7" transform="rotate(-90,8,100)">Fiscal Balance →</text>
              {[
                { label: "US", x: 120, y: 150, color: "#38bdf8" },
                { label: "DE", x: 280, y: 60, color: "#22c55e" },
                { label: "JP", x: 310, y: 170, color: "#fbbf24" },
                { label: "CN", x: 240, y: 70, color: "#ef4444" },
                { label: "BR", x: 140, y: 130, color: "#f59e0b" },
                { label: "IN", x: 160, y: 110, color: "#a855f7" },
                { label: "ZA", x: 170, y: 140, color: "#ec4899" },
              ].map(c => (
                <g key={c.label}>
                  <circle cx={c.x} cy={c.y} r="12" fill={c.color} opacity={0.3} stroke={c.color} strokeWidth={1} />
                  <text x={c.x} y={c.y + 3} textAnchor="middle" fill={c.color} fontSize="8" fontWeight="bold">{c.label}</text>
                </g>
              ))}
            </svg>
          </div>
        )}

        {tab === "political" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>POLITICAL RISK INDEX</div>
            {[
              { country: "🇺🇸 United States", stability: 72, corruption: 67, rule: 85, conflict: 90, freedom: 83, election: "Nov 2028" },
              { country: "🇩🇪 Germany", stability: 85, corruption: 80, rule: 92, conflict: 95, freedom: 94, election: "Sep 2029" },
              { country: "🇬🇧 United Kingdom", stability: 78, corruption: 77, rule: 90, conflict: 92, freedom: 91, election: "Jan 2030" },
              { country: "🇨🇳 China", stability: 65, corruption: 42, rule: 45, conflict: 60, freedom: 15, election: "N/A" },
              { country: "🇷🇺 Russia", stability: 42, corruption: 28, rule: 25, conflict: 15, freedom: 12, election: "Mar 2030" },
              { country: "🇧🇷 Brazil", stability: 55, corruption: 38, rule: 52, conflict: 65, freedom: 72, election: "Oct 2030" },
              { country: "🇹🇷 Turkey", stability: 48, corruption: 40, rule: 38, conflict: 42, freedom: 32, election: "Jun 2028" },
            ].map(c => (
              <div key={c.country} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{c.country}</span>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Election: {c.election}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { label: "Stability", val: c.stability },
                    { label: "Anti-Corrupt", val: c.corruption },
                    { label: "Rule of Law", val: c.rule },
                    { label: "Peace", val: c.conflict },
                    { label: "Freedom", val: c.freedom },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-[7px]" style={{ color: "#64748b" }}>{m.label}</div>
                      <div className="font-mono font-bold text-[10px]" style={{ color: m.val > 70 ? "#22c55e" : m.val > 40 ? "#fbbf24" : "#ef4444" }}>{m.val}</div>
                      <div className="h-1 rounded-full mx-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${m.val}%`, background: m.val > 70 ? "#22c55e" : m.val > 40 ? "#fbbf24" : "#ef4444", opacity: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "contagion" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FINANCIAL CONTAGION RISK</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Global Systemic Stress", val: "38/100", color: "#fbbf24", desc: "Moderate" },
                { label: "EM Spread Contagion", val: "42/100", color: "#fbbf24", desc: "Elevated" },
                { label: "FX Volatility Index", val: "12.5", color: "#22c55e", desc: "Low" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: s.color }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CROSS-BORDER EXPOSURE MATRIX ($B)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[8px] font-mono">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th className="px-1.5 py-1 text-left" style={{ color: "#64748b" }}>From \ To</th>
                    {["US", "EU", "UK", "JP", "CN", "EM"].map(h => (
                      <th key={h} className="px-1.5 py-1 text-right" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { from: "US", vals: [0, 2850, 1420, 580, 320, 890] },
                    { from: "EU", vals: [3200, 0, 2100, 420, 280, 1250] },
                    { from: "UK", vals: [1650, 1800, 0, 310, 180, 720] },
                    { from: "JP", vals: [1200, 580, 320, 0, 220, 480] },
                    { from: "CN", vals: [450, 280, 150, 180, 0, 620] },
                  ].map(r => (
                    <tr key={r.from} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-1.5 py-1 font-bold">{r.from}</td>
                      {r.vals.map((v, i) => (
                        <td key={i} className="px-1.5 py-1 text-right" style={{
                          color: v === 0 ? "#1e293b" : v > 2000 ? "#ef4444" : v > 1000 ? "#fbbf24" : "#64748b"
                        }}>{v === 0 ? "—" : v.toLocaleString()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ACTIVE RISK EVENTS</div>
            {[
              { event: "US-China Trade Tensions", severity: "HIGH", impact: "Global supply chains, tech sector", date: "Ongoing" },
              { event: "EU Energy Security", severity: "MODERATE", impact: "EUR, industrial output", date: "Winter 2026" },
              { event: "EM Debt Sustainability", severity: "HIGH", impact: "Sri Lanka, Ghana, Pakistan, Ethiopia", date: "Ongoing" },
              { event: "Japan JPY Intervention Risk", severity: "MODERATE", impact: "USD/JPY, carry trades", date: "Q4 2026" },
            ].map(e => (
              <div key={e.event} className="p-2 rounded flex items-start gap-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${e.severity === "HIGH" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.15)"}` }}>
                <span className="px-1 py-0.5 rounded text-[8px] font-bold mt-0.5" style={{
                  background: e.severity === "HIGH" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.15)",
                  color: e.severity === "HIGH" ? "#ef4444" : "#fbbf24",
                }}>{e.severity}</span>
                <div>
                  <div className="font-bold">{e.event}</div>
                  <div className="text-[9px]" style={{ color: "#64748b" }}>Impact: {e.impact} | {e.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
