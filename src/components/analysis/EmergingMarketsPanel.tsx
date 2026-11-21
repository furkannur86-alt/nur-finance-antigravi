"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "overview" | "sovereign" | "flows" | "fx";

const EM_COUNTRIES = [
  { name: "Brazil", ticker: "EWZ", spread: 185, fxRate: "4.92", fxChg: -0.4, cds: 142, equityYtd: 8.5, bondYtd: 4.2 },
  { name: "Mexico", ticker: "EWW", spread: 165, fxRate: "17.42", fxChg: 1.2, cds: 128, equityYtd: 12.4, bondYtd: 5.8 },
  { name: "South Africa", ticker: "EZA", spread: 285, fxRate: "18.65", fxChg: -2.1, cds: 215, equityYtd: -2.4, bondYtd: 1.5 },
  { name: "Turkey", ticker: "TUR", spread: 320, fxRate: "38.50", fxChg: -8.5, cds: 285, equityYtd: 15.8, bondYtd: -2.4 },
  { name: "India", ticker: "INDA", spread: 95, fxRate: "84.20", fxChg: -1.8, cds: 72, equityYtd: 14.2, bondYtd: 6.5 },
  { name: "Indonesia", ticker: "EIDO", spread: 125, fxRate: "15850", fxChg: -0.8, cds: 92, equityYtd: 5.4, bondYtd: 3.8 },
  { name: "Poland", ticker: "EPOL", spread: 85, fxRate: "3.98", fxChg: 2.4, cds: 58, equityYtd: 18.5, bondYtd: 7.2 },
  { name: "Chile", ticker: "ECH", spread: 115, fxRate: "895", fxChg: -1.5, cds: 82, equityYtd: 4.8, bondYtd: 3.2 },
];

export default function EmergingMarketsPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌏</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>EMERGING MARKETS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg EM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "sovereign", "flows", "fx"] as Tab[]).map(t => (
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
          { label: "EMBI+ SPREAD", value: "342bp", change: "-8bp", color: "#22c55e" },
          { label: "EM EQUITY YTD", value: "+6.8%", change: "", color: "#22c55e" },
          { label: "EM BOND YTD", value: "+3.4%", change: "", color: "#22c55e" },
          { label: "DXY", value: "104.2", change: "+0.3%", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
              {s.change && <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>{s.change}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <div className="space-y-1">
            <div className="grid grid-cols-8 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>COUNTRY</span><span>TICKER</span><span className="text-right">SPREAD</span>
              <span className="text-right">CDS</span><span className="text-right">FX RATE</span>
              <span className="text-right">FX YTD</span><span className="text-right">EQ YTD</span><span className="text-right">BOND YTD</span>
            </div>
            {EM_COUNTRIES.map((c, i) => (
              <div key={c.name} className="grid grid-cols-8 gap-2 px-2 py-1.5 rounded items-center"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="font-bold" style={{ color: "#00e5a0" }}>{c.name}</span>
                <span className="font-mono" style={{ color: "#38bdf8" }}>{c.ticker}</span>
                <span className="font-mono text-right" style={{ color: c.spread > 250 ? "#ef4444" : c.spread > 150 ? "#fbbf24" : "#22c55e" }}>{c.spread}bp</span>
                <span className="font-mono text-right" style={{ color: "#64748b" }}>{c.cds}</span>
                <span className="font-mono text-right">{c.fxRate}</span>
                <span className="font-mono text-right" style={{ color: c.fxChg >= 0 ? "#22c55e" : "#ef4444" }}>{c.fxChg >= 0 ? "+" : ""}{c.fxChg}%</span>
                <span className="font-mono text-right" style={{ color: c.equityYtd >= 0 ? "#22c55e" : "#ef4444" }}>{c.equityYtd >= 0 ? "+" : ""}{c.equityYtd}%</span>
                <span className="font-mono text-right" style={{ color: c.bondYtd >= 0 ? "#22c55e" : "#ef4444" }}>{c.bondYtd >= 0 ? "+" : ""}{c.bondYtd}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "sovereign" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SOVEREIGN BOND YIELDS (10Y LOCAL CURRENCY)</div>
            {[
              { country: "Brazil", yield10y: 11.85, real: 7.42, change: -0.12, rating: "BB", outlook: "Stable" },
              { country: "Mexico", yield10y: 9.45, real: 5.85, change: -0.08, rating: "BBB", outlook: "Stable" },
              { country: "South Africa", yield10y: 10.25, real: 5.15, change: 0.15, rating: "BB-", outlook: "Stable" },
              { country: "Turkey", yield10y: 28.50, real: -12.50, change: -0.45, rating: "B", outlook: "Positive" },
              { country: "India", yield10y: 7.12, real: 2.68, change: -0.05, rating: "BBB-", outlook: "Stable" },
              { country: "Indonesia", yield10y: 6.85, real: 3.42, change: 0.08, rating: "BBB", outlook: "Stable" },
              { country: "Poland", yield10y: 5.45, real: 1.85, change: -0.15, rating: "A-", outlook: "Stable" },
            ].map(b => (
              <div key={b.country} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-3">
                  <span className="w-24 font-bold">{b.country}</span>
                  <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{b.rating} ({b.outlook})</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono">
                  <span style={{ color: "#fbbf24" }}>{b.yield10y.toFixed(2)}%</span>
                  <span style={{ color: b.real >= 0 ? "#22c55e" : "#ef4444" }}>Real: {b.real >= 0 ? "+" : ""}{b.real.toFixed(2)}%</span>
                  <span style={{ color: b.change >= 0 ? "#ef4444" : "#22c55e" }}>{b.change >= 0 ? "+" : ""}{b.change.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CAPITAL FLOWS — WEEKLY (USD B)</div>
            {[
              { type: "EM Equity Funds", flow: 2.4, ytd: 18.5, streak: "3W inflow" },
              { type: "EM Bond Funds", flow: -0.8, ytd: 12.2, streak: "1W outflow" },
              { type: "EM Local Currency", flow: 1.2, ytd: 8.4, streak: "5W inflow" },
              { type: "EM Hard Currency", flow: -1.5, ytd: 3.8, streak: "2W outflow" },
              { type: "Frontier Markets", flow: 0.4, ytd: 2.1, streak: "4W inflow" },
            ].map(f => (
              <div key={f.type} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.type}</span>
                  <span className="text-[9px]" style={{ color: f.streak.includes("inflow") ? "#22c55e" : "#ef4444" }}>{f.streak}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]" style={{ color: "#64748b" }}>Weekly:</span>
                    <span className="font-mono font-bold" style={{ color: f.flow >= 0 ? "#22c55e" : "#ef4444" }}>
                      {f.flow >= 0 ? "+" : ""}{f.flow.toFixed(1)}B
                    </span>
                  </div>
                  <div className="flex-1 h-3 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="absolute top-0 h-full rounded-full" style={{
                      left: f.flow >= 0 ? "50%" : `${50 + f.flow * 8}%`,
                      width: `${Math.abs(f.flow) * 8}%`,
                      background: f.flow >= 0 ? "#22c55e" : "#ef4444",
                      opacity: 0.6
                    }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]" style={{ color: "#64748b" }}>YTD:</span>
                    <span className="font-mono" style={{ color: "#38bdf8" }}>{f.ytd >= 0 ? "+" : ""}{f.ytd.toFixed(1)}B</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>POSITIONING — CFTC EM FX (NET SPEC)</div>
            {[
              { pair: "BRL", position: 28500, change: 4200, pctile: 72 },
              { pair: "MXN", position: -15200, change: -8400, pctile: 32 },
              { pair: "ZAR", position: -22800, change: -2100, pctile: 18 },
              { pair: "TRY", position: -8500, change: 1200, pctile: 42 },
            ].map(p => (
              <div key={p.pair} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-10 font-bold" style={{ color: "#00e5a0" }}>{p.pair}</span>
                <span className="w-20 font-mono text-right" style={{ color: p.position >= 0 ? "#22c55e" : "#ef4444" }}>
                  {p.position >= 0 ? "+" : ""}{(p.position / 1000).toFixed(1)}K
                </span>
                <span className="w-16 font-mono text-right text-[9px]" style={{ color: p.change >= 0 ? "#22c55e" : "#ef4444" }}>
                  Chg: {p.change >= 0 ? "+" : ""}{(p.change / 1000).toFixed(1)}K
                </span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pctile}%`, background: p.pctile > 60 ? "#22c55e" : p.pctile < 30 ? "#ef4444" : "#fbbf24" }} />
                </div>
                <span className="font-mono text-[9px] w-10 text-right">{p.pctile}th</span>
              </div>
            ))}
          </div>
        )}

        {tab === "fx" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EM FX PERFORMANCE MAP</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { pair: "USD/BRL", rate: "4.92", ytd: -0.4, vol: 12.8 },
                { pair: "USD/MXN", rate: "17.42", ytd: 1.2, vol: 10.5 },
                { pair: "USD/ZAR", rate: "18.65", ytd: -2.1, vol: 15.4 },
                { pair: "USD/TRY", rate: "38.50", ytd: -8.5, vol: 18.2 },
                { pair: "USD/INR", rate: "84.20", ytd: -1.8, vol: 4.5 },
                { pair: "USD/IDR", rate: "15850", ytd: -0.8, vol: 6.8 },
                { pair: "EUR/PLN", rate: "3.98", ytd: 2.4, vol: 8.2 },
                { pair: "USD/CLP", rate: "895", ytd: -1.5, vol: 11.5 },
              ].map(c => (
                <div key={c.pair} className="p-2.5 rounded" style={{
                  background: `rgba(${c.ytd >= 0 ? "34,197,94" : "239,68,68"}, 0.08)`,
                  border: `1px solid rgba(${c.ytd >= 0 ? "34,197,94" : "239,68,68"}, 0.15)`
                }}>
                  <div className="text-[9px] font-bold" style={{ color: "#00e5a0" }}>{c.pair}</div>
                  <div className="font-mono font-bold text-sm mt-0.5" style={{ color: "#e2e8f0" }}>{c.rate}</div>
                  <div className="flex justify-between mt-1 text-[9px]">
                    <span className="font-mono" style={{ color: c.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{c.ytd >= 0 ? "+" : ""}{c.ytd}%</span>
                    <span style={{ color: "#64748b" }}>Vol: {c.vol}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CARRY TRADE MONITOR</div>
            {[
              { strategy: "Long BRL / Short USD", carry: "6.8%", totalReturn: "+8.2%", sharpe: 1.42 },
              { strategy: "Long MXN / Short USD", carry: "5.2%", totalReturn: "+6.8%", sharpe: 1.28 },
              { strategy: "Long IDR / Short JPY", carry: "4.5%", totalReturn: "+5.4%", sharpe: 0.95 },
              { strategy: "Long ZAR / Short EUR", carry: "4.8%", totalReturn: "-1.2%", sharpe: -0.22 },
            ].map(s => (
              <div key={s.strategy} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{s.strategy}</span>
                <div className="flex items-center gap-4 text-[9px] font-mono">
                  <span style={{ color: "#fbbf24" }}>Carry: {s.carry}</span>
                  <span style={{ color: s.totalReturn.startsWith("+") ? "#22c55e" : "#ef4444" }}>TR: {s.totalReturn}</span>
                  <span style={{ color: s.sharpe >= 1 ? "#22c55e" : s.sharpe >= 0 ? "#fbbf24" : "#ef4444" }}>SR: {s.sharpe.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
