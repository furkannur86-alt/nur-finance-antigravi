"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "equities" | "rates" | "fx" | "commodities";

export default function LatAmMarketsPanel() {
  const [tab, setTab] = useState<Tab>("equities");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌎</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>LATIN AMERICA</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters LATAM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["equities", "rates", "fx", "commodities"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "equities" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATAM EQUITY INDICES</div>
            {[
              { index: "Bovespa", country: "🇧🇷", value: 128500, chg: 0.8, ytd: 12.5, pe: 8.2, mktCap: "$920B" },
              { index: "IPC Mexico", country: "🇲🇽", value: 56200, chg: -0.3, ytd: 8.8, pe: 15.2, mktCap: "$485B" },
              { index: "IPSA Chile", country: "🇨🇱", value: 6420, chg: 0.5, ytd: 15.2, pe: 12.8, mktCap: "$185B" },
              { index: "Colcap", country: "🇨🇴", value: 1380, chg: 1.2, ytd: 22.5, pe: 9.5, mktCap: "$105B" },
              { index: "Merval", country: "🇦🇷", value: 1850000, chg: 2.5, ytd: 185.0, pe: 5.2, mktCap: "$42B" },
              { index: "Lima General", country: "🇵🇪", value: 22800, chg: 0.4, ytd: 9.2, pe: 11.2, mktCap: "$85B" },
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
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{i.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>P/E:</span> <span className="font-mono">{i.pe}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Mkt Cap:</span> <span className="font-mono">{i.mktCap}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP MOVERS — BRAZIL ADRs</div>
            {[
              { name: "Vale SA", ticker: "VALE", price: 14.85, chg: 2.8, sector: "Mining" },
              { name: "Petrobras", ticker: "PBR", price: 15.20, chg: 1.5, sector: "Energy" },
              { name: "Nu Holdings", ticker: "NU", price: 12.45, chg: -1.2, sector: "Fintech" },
              { name: "Itau Unibanco", ticker: "ITUB", price: 6.85, chg: 0.8, sector: "Banking" },
              { name: "WEG SA", ticker: "WEGZY", price: 42.50, chg: 3.2, sector: "Industrials" },
            ].map(s => (
              <div key={s.ticker} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{s.name}</span>
                <span className="font-mono w-14" style={{ color: "#64748b" }}>{s.ticker}</span>
                <span className="font-mono w-16 text-right">${s.price}</span>
                <span className="font-mono w-14 text-right" style={{ color: s.chg >= 0 ? "#22c55e" : "#ef4444" }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</span>
                <span className="text-[8px] px-1 py-0.5 rounded ml-auto" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{s.sector}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "rates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CENTRAL BANK POLICY RATES</div>
            {[
              { country: "🇧🇷 Brazil (BCB)", rate: 11.75, prev: 12.25, next: "Dec 10", dir: "Cutting", realRate: 7.25 },
              { country: "🇲🇽 Mexico (Banxico)", rate: 10.25, prev: 10.50, next: "Dec 14", dir: "Cutting", realRate: 6.05 },
              { country: "🇨🇱 Chile (BCCh)", rate: 5.75, prev: 6.00, next: "Jan 28", dir: "Cutting", realRate: 1.95 },
              { country: "🇨🇴 Colombia (BanRep)", rate: 9.50, prev: 10.00, next: "Dec 20", dir: "Cutting", realRate: 5.00 },
              { country: "🇵🇪 Peru (BCRP)", rate: 5.25, prev: 5.50, next: "Jan 09", dir: "Cutting", realRate: 2.05 },
              { country: "🇦🇷 Argentina (BCRA)", rate: 40.00, prev: 60.00, next: "Continuous", dir: "Cutting", realRate: -105.0 },
            ].map(c => (
              <div key={c.country} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.country}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{c.rate}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Prev:</span> <span className="font-mono">{c.prev}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Next:</span> <span>{c.next}</span></div>
                  <div><span style={{ color: "#64748b" }}>Bias:</span> <span style={{ color: c.dir === "Cutting" ? "#22c55e" : "#ef4444" }}>{c.dir}</span></div>
                  <div><span style={{ color: "#64748b" }}>Real:</span> <span className="font-mono" style={{ color: c.realRate > 0 ? "#22c55e" : "#ef4444" }}>{c.realRate}%</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LOCAL BOND YIELDS (10Y GOV)</div>
            {[
              { country: "Brazil NTN-B", yield: 6.25, real: true, chg: -0.08 },
              { country: "Mexico Mbono", yield: 9.85, real: false, chg: 0.05 },
              { country: "Chile BTP", yield: 5.42, real: false, chg: -0.03 },
              { country: "Colombia TES", yield: 10.15, real: false, chg: 0.12 },
            ].map(b => (
              <div key={b.country} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32">{b.country}</span>
                {b.real && <span className="text-[7px] px-1 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>REAL</span>}
                <span className="font-mono font-bold ml-auto">{b.yield}%</span>
                <span className="font-mono w-14 text-right" style={{ color: b.chg <= 0 ? "#22c55e" : "#ef4444" }}>{b.chg >= 0 ? "+" : ""}{b.chg.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "fx" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATAM FX vs USD</div>
            {[
              { pair: "USD/BRL", rate: "5.15", chg: -0.42, ytd: -5.8, carry: "11.5%", vol1m: 14.8, ndf: "5.18" },
              { pair: "USD/MXN", rate: "17.25", chg: -0.15, ytd: -8.2, carry: "9.8%", vol1m: 12.5, ndf: "17.32" },
              { pair: "USD/CLP", rate: "920", chg: 0.35, ytd: 4.5, carry: "5.5%", vol1m: 11.8, ndf: "925" },
              { pair: "USD/COP", rate: "4,050", chg: -0.28, ytd: -12.5, carry: "9.2%", vol1m: 13.2, ndf: "4,075" },
              { pair: "USD/PEN", rate: "3.72", chg: -0.08, ytd: -2.8, carry: "5.0%", vol1m: 5.5, ndf: "3.73" },
              { pair: "USD/ARS", rate: "890", chg: 0.85, ytd: 145.0, carry: "-105%", vol1m: 42.0, ndf: "1,250" },
            ].map(r => (
              <div key={r.pair} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{r.pair}</span>
                    <span className="font-mono font-bold">{r.rate}</span>
                  </div>
                  <span className="font-mono" style={{ color: r.chg <= 0 ? "#22c55e" : "#ef4444" }}>{r.chg >= 0 ? "+" : ""}{r.chg}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: r.ytd <= 0 ? "#22c55e" : "#ef4444" }}>{r.ytd >= 0 ? "+" : ""}{r.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Carry:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{r.carry}</span></div>
                  <div><span style={{ color: "#64748b" }}>1M Vol:</span> <span className="font-mono">{r.vol1m}%</span></div>
                  <div><span style={{ color: "#64748b" }}>NDF 1M:</span> <span className="font-mono">{r.ndf}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "commodities" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATAM COMMODITY EXPOSURE</div>
            {[
              { commodity: "Iron Ore (62% Fe)", price: "$128/t", chg: 2.1, top: "🇧🇷 Vale, CSN" },
              { commodity: "Copper", price: "$4.25/lb", chg: 0.8, top: "🇨🇱 Codelco, 🇵🇪 Southern" },
              { commodity: "Soybeans", price: "$13.85/bu", chg: -0.5, top: "🇧🇷 Brazil, 🇦🇷 Argentina" },
              { commodity: "Coffee (Arabica)", price: "$2.45/lb", chg: 1.5, top: "🇧🇷 Brazil, 🇨🇴 Colombia" },
              { commodity: "Crude Oil (Brent)", price: "$82.50/bbl", chg: -0.3, top: "🇧🇷 Petrobras, 🇲🇽 Pemex" },
              { commodity: "Lithium Carbonate", price: "$15,200/t", chg: -2.5, top: "🇨🇱 SQM, 🇦🇷 Livent" },
              { commodity: "Sugar #11", price: "$0.265/lb", chg: 0.8, top: "🇧🇷 Raizen, Copersucar" },
            ].map(c => (
              <div key={c.commodity} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.commodity}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{c.price}</span>
                    <span className="font-mono" style={{ color: c.chg >= 0 ? "#22c55e" : "#ef4444" }}>{c.chg >= 0 ? "+" : ""}{c.chg}%</span>
                  </div>
                </div>
                <div className="text-[9px]" style={{ color: "#64748b" }}>Key producers: {c.top}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
