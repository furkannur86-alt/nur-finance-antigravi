"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "equities" | "bonds" | "fx-rates" | "flows";

export default function AsianMarketsPanel() {
  const [tab, setTab] = useState<Tab>("equities");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏯</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>ASIAN MARKETS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters ASIA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["equities", "bonds", "fx-rates", "flows"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "fx-rates" ? "FX" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "equities" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ASIA-PACIFIC EQUITY INDICES</div>
            {[
              { index: "Nikkei 225", country: "🇯🇵", value: 38420, chg: 1.2, ytd: 18.5, pe: 22.1, vol: "High" },
              { index: "Shanghai Composite", country: "🇨🇳", value: 3085, chg: -0.4, ytd: 2.8, pe: 12.4, vol: "Med" },
              { index: "Hang Seng", country: "🇭🇰", value: 17850, chg: 0.8, ytd: -5.2, pe: 9.8, vol: "High" },
              { index: "KOSPI", country: "🇰🇷", value: 2580, chg: 0.5, ytd: 8.2, pe: 14.2, vol: "Med" },
              { index: "TWSE", country: "🇹🇼", value: 21450, chg: 1.5, ytd: 28.5, pe: 18.5, vol: "High" },
              { index: "Sensex", country: "🇮🇳", value: 72800, chg: 0.3, ytd: 12.8, pe: 24.5, vol: "Med" },
              { index: "ASX 200", country: "🇦🇺", value: 7920, chg: 0.6, ytd: 9.5, pe: 17.8, vol: "Low" },
              { index: "STI", country: "🇸🇬", value: 3280, chg: 0.2, ytd: 5.2, pe: 11.5, vol: "Low" },
            ].map(i => (
              <div key={i.index} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{i.country}</span>
                    <span className="font-bold">{i.index}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{i.value.toLocaleString()}</span>
                    <span className="font-mono w-14 text-right" style={{ color: i.chg >= 0 ? "#22c55e" : "#ef4444" }}>{i.chg >= 0 ? "+" : ""}{i.chg}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: i.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{i.ytd >= 0 ? "+" : ""}{i.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>P/E:</span> <span className="font-mono">{i.pe}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span style={{ color: i.vol === "High" ? "#ef4444" : i.vol === "Med" ? "#fbbf24" : "#22c55e" }}>{i.vol}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "bonds" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ASIAN GOVERNMENT BOND YIELDS</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    {["Country", "2Y", "5Y", "10Y", "30Y", "10Y Chg", "Spread vs UST"].map(h => (
                      <th key={h} className="px-2 py-1.5 text-right first:text-left font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { country: "🇯🇵 Japan", y2: 0.08, y5: 0.42, y10: 0.88, y30: 1.82, chg: 0.03, spread: -342 },
                    { country: "🇨🇳 China", y2: 2.15, y5: 2.42, y10: 2.68, y30: 2.95, chg: -0.02, spread: -162 },
                    { country: "🇰🇷 Korea", y2: 3.25, y5: 3.42, y10: 3.58, y30: 3.42, chg: 0.05, spread: -72 },
                    { country: "🇮🇳 India", y2: 6.85, y5: 7.02, y10: 7.18, y30: 7.35, chg: -0.03, spread: 288 },
                    { country: "🇮🇩 Indonesia", y2: 6.42, y5: 6.68, y10: 6.85, y30: 7.05, chg: 0.08, spread: 255 },
                    { country: "🇹🇭 Thailand", y2: 2.15, y5: 2.42, y10: 2.72, y30: 3.05, chg: -0.01, spread: -158 },
                    { country: "🇦🇺 Australia", y2: 3.95, y5: 4.08, y10: 4.25, y30: 4.42, chg: 0.04, spread: -5 },
                  ].map(r => (
                    <tr key={r.country} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold">{r.country}</td>
                      {[r.y2, r.y5, r.y10, r.y30].map((v, i) => (
                        <td key={i} className="px-2 py-1.5 text-right font-mono">{v.toFixed(2)}%</td>
                      ))}
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: r.chg >= 0 ? "#ef4444" : "#22c55e" }}>{r.chg >= 0 ? "+" : ""}{r.chg.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: r.spread > 0 ? "#ef4444" : "#22c55e" }}>{r.spread > 0 ? "+" : ""}{r.spread}bp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ASIAN CREDIT SPREADS (OAS bp)</div>
            {[
              { name: "Asia IG Corp", spread: 95, chg: -3, ytd: -18 },
              { name: "Asia HY Corp", spread: 485, chg: 8, ytd: -55 },
              { name: "China IG", spread: 125, chg: -2, ytd: -25 },
              { name: "China HY Property", spread: 1250, chg: 35, ytd: -320 },
              { name: "India Corp IG", spread: 85, chg: -1, ytd: -12 },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36">{c.name}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(c.spread / 15, 100)}%`, background: c.spread > 500 ? "#ef4444" : c.spread > 200 ? "#fbbf24" : "#22c55e", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-14 text-right">{c.spread}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: c.chg <= 0 ? "#22c55e" : "#ef4444" }}>{c.chg >= 0 ? "+" : ""}{c.chg}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "fx-rates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ASIAN FX vs USD</div>
            {[
              { pair: "USD/JPY", rate: "154.20", chg: 0.35, ytd: 9.2, ndf1m: "—", intervention: true },
              { pair: "USD/CNY", rate: "7.2450", chg: 0.08, ytd: 2.8, ndf1m: "7.2680", intervention: false },
              { pair: "USD/CNH", rate: "7.2800", chg: 0.12, ytd: 3.2, ndf1m: "7.2950", intervention: false },
              { pair: "USD/KRW", rate: "1,342", chg: -0.15, ytd: 5.5, ndf1m: "1,340", intervention: false },
              { pair: "USD/INR", rate: "83.42", chg: 0.02, ytd: 0.8, ndf1m: "83.55", intervention: false },
              { pair: "USD/SGD", rate: "1.3420", chg: -0.08, ytd: -1.2, ndf1m: "—", intervention: false },
              { pair: "USD/TWD", rate: "31.85", chg: -0.22, ytd: 3.8, ndf1m: "31.92", intervention: false },
              { pair: "USD/IDR", rate: "15,680", chg: 0.18, ytd: 2.5, ndf1m: "15,720", intervention: false },
              { pair: "USD/THB", rate: "35.42", chg: -0.05, ytd: 4.2, ndf1m: "35.50", intervention: false },
              { pair: "USD/PHP", rate: "56.85", chg: 0.10, ytd: 3.8, ndf1m: "56.95", intervention: false },
            ].map(r => (
              <div key={r.pair} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold" style={{ color: "#00e5a0" }}>{r.pair}</span>
                <span className="font-mono w-16 text-right font-bold">{r.rate}</span>
                <span className="font-mono w-14 text-right" style={{ color: r.chg >= 0 ? "#ef4444" : "#22c55e" }}>{r.chg >= 0 ? "+" : ""}{r.chg}%</span>
                <span className="font-mono w-14 text-right" style={{ color: r.ytd >= 0 ? "#ef4444" : "#22c55e" }}>YTD {r.ytd >= 0 ? "+" : ""}{r.ytd}%</span>
                <span className="font-mono w-16 text-right text-[9px]" style={{ color: "#64748b" }}>{r.ndf1m}</span>
                {r.intervention && <span className="text-[7px] px-1 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>INT. RISK</span>}
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ASIA DOLLAR INDEX (ADXY)</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {["Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
                const vals = [104.2, 103.8, 103.2, 102.5, 102.8];
                const y = 70 - (vals[i] - 101) * 18;
                return (
                  <g key={m}>
                    <circle cx={40 + i * 85} cy={y} r={3} fill="#00e5a0" />
                    <text x={40 + i * 85} y={y - 8} textAnchor="middle" fill="#00e5a0" fontSize="7">{vals[i]}</text>
                    <text x={40 + i * 85} y={78} textAnchor="middle" fill="#64748b" fontSize="7">{m}</text>
                    {i > 0 && <line x1={40 + (i - 1) * 85} y1={70 - (vals[i - 1] - 101) * 18} x2={40 + i * 85} y2={y} stroke="#00e5a0" strokeWidth={1.5} />}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FOREIGN FUND FLOWS — ASIA (USD M, 7D NET)</div>
            {[
              { market: "🇯🇵 Japan Equity", flow: 2850, mtd: 8500, ytd: 42000 },
              { market: "🇮🇳 India Equity", flow: 1200, mtd: -2800, ytd: 18500 },
              { market: "🇰🇷 Korea Equity", flow: -850, mtd: -4200, ytd: -12000 },
              { market: "🇹🇼 Taiwan Equity", flow: 1850, mtd: 5200, ytd: 28500 },
              { market: "🇨🇳 China A-shares", flow: -2200, mtd: -8500, ytd: -35000 },
              { market: "🇮🇩 Indonesia Equity", flow: -420, mtd: -1500, ytd: -4200 },
              { market: "🇹🇭 Thailand Equity", flow: -280, mtd: -850, ytd: -6500 },
              { market: "🇻🇳 Vietnam Equity", flow: 120, mtd: 350, ytd: 1800 },
            ].map(f => (
              <div key={f.market} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36">{f.market}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] w-6" style={{ color: "#64748b" }}>7D</span>
                    <div className="flex-1 h-2 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                      {f.flow !== 0 && (
                        <div className="absolute h-full rounded-full" style={{
                          left: f.flow < 0 ? `${50 - Math.min(Math.abs(f.flow) / 60, 50)}%` : "50%",
                          width: `${Math.min(Math.abs(f.flow) / 60, 50)}%`,
                          background: f.flow > 0 ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)",
                        }} />
                      )}
                    </div>
                    <span className="font-mono w-16 text-right" style={{ color: f.flow >= 0 ? "#22c55e" : "#ef4444" }}>{f.flow >= 0 ? "+" : ""}{f.flow.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-mono w-16 text-right text-[9px]" style={{ color: f.ytd >= 0 ? "#22c55e" : "#ef4444" }}>YTD {f.ytd > 0 ? "+" : ""}{(f.ytd / 1000).toFixed(1)}B</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NORTHBOUND CONNECT FLOWS (CHINA, $M)</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Today", val: -520, color: "#ef4444" },
                { label: "This Week", val: -2800, color: "#ef4444" },
                { label: "MTD", val: -8500, color: "#ef4444" },
                { label: "YTD", val: -35200, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>${(s.val / 1000).toFixed(1)}B</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
