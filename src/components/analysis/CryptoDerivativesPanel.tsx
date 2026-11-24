"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "futures" | "options" | "perps" | "analytics";

export default function CryptoDerivativesPanel() {
  const [tab, setTab] = useState<Tab>("futures");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">₿</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CRYPTO DERIVATIVES</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(247,147,26,0.15)", color: "#f7931a" }}>Bloomberg CRYP</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["futures", "options", "perps", "analytics"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "futures" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CME BITCOIN FUTURES</div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { label: "BTC Spot", value: "$97,420", chg: "+2.1%" },
                { label: "Front Month", value: "$97,850", chg: "+2.3%" },
                { label: "Basis (Ann.)", value: "8.2%", chg: "" },
                { label: "Open Interest", value: "$18.5B", chg: "+$420M" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.value}</div>
                  {s.chg && <div className="text-[8px] font-mono" style={{ color: "#22c55e" }}>{s.chg}</div>}
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FUTURES TERM STRUCTURE</div>
            {[
              { expiry: "Dec 2026", price: 97850, oi: 12400, vol24h: 2850, basis: 0.44, annBasis: 8.2 },
              { expiry: "Jan 2027", price: 98420, oi: 8200, vol24h: 1520, basis: 1.03, annBasis: 7.8 },
              { expiry: "Mar 2027", price: 99800, oi: 15600, vol24h: 3200, basis: 2.44, annBasis: 7.5 },
              { expiry: "Jun 2027", price: 102100, oi: 6800, vol24h: 980, basis: 4.80, annBasis: 7.1 },
              { expiry: "Sep 2027", price: 104200, oi: 3200, vol24h: 450, basis: 6.96, annBasis: 6.8 },
            ].map(f => (
              <div key={f.expiry} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{f.expiry}</span>
                <span className="font-mono w-20 text-right" style={{ color: "#00e5a0" }}>${f.price.toLocaleString()}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>OI: {(f.oi).toLocaleString()}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>Vol: {f.vol24h}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#fbbf24" }}>+{f.basis}%</span>
                <span className="font-mono w-20 text-right" style={{ color: "#38bdf8" }}>Ann: {f.annBasis}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ETH FUTURES</div>
            {[
              { expiry: "Dec 2026", price: 3850, oi: 8500, basis: 0.52, annBasis: 9.1 },
              { expiry: "Mar 2027", price: 3980, oi: 5200, basis: 3.90, annBasis: 8.4 },
              { expiry: "Jun 2027", price: 4120, oi: 2800, basis: 7.53, annBasis: 7.8 },
            ].map(f => (
              <div key={f.expiry} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{f.expiry}</span>
                <span className="font-mono w-20 text-right" style={{ color: "#a855f7" }}>${f.price.toLocaleString()}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>OI: {f.oi.toLocaleString()}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#fbbf24" }}>+{f.basis}%</span>
                <span className="font-mono w-20 text-right" style={{ color: "#38bdf8" }}>Ann: {f.annBasis}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "options" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>BTC OPTIONS — DERIBIT</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total OI", value: "$22.4B", color: "#00e5a0" },
                { label: "24h Volume", value: "$3.8B", color: "#38bdf8" },
                { label: "Put/Call Ratio", value: "0.62", color: "#fbbf24" },
                { label: "Max Pain", value: "$95,000", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VOLATILITY SURFACE — DEC 27 EXPIRY</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[8px] font-mono">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th className="px-2 py-1 text-left" style={{ color: "#64748b" }}>Strike</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Call Bid</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Call Ask</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>IV</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Put Bid</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>Put Ask</th>
                    <th className="px-2 py-1 text-right" style={{ color: "#64748b" }}>IV</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { strike: "80K", cb: 18200, ca: 18450, civ: 72, pb: 420, pa: 480, piv: 78 },
                    { strike: "85K", cb: 13800, ca: 14050, civ: 65, pb: 850, pa: 920, piv: 72 },
                    { strike: "90K", cb: 9650, ca: 9850, civ: 58, pb: 1680, pa: 1780, piv: 65 },
                    { strike: "95K", cb: 5920, ca: 6080, civ: 52, pb: 3450, pa: 3580, piv: 58 },
                    { strike: "100K", cb: 3200, ca: 3350, civ: 48, pb: 6250, pa: 6420, piv: 52 },
                    { strike: "110K", cb: 850, ca: 950, civ: 55, pb: 13500, pa: 13720, piv: 48 },
                    { strike: "120K", cb: 220, ca: 290, civ: 62, pb: 22800, pa: 23050, piv: 52 },
                  ].map(r => (
                    <tr key={r.strike} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: r.strike === "95K" || r.strike === "100K" ? "rgba(0,229,160,0.03)" : "transparent" }}>
                      <td className="px-2 py-1 font-bold">${r.strike}</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#22c55e" }}>${r.cb.toLocaleString()}</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#22c55e" }}>${r.ca.toLocaleString()}</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#fbbf24" }}>{r.civ}%</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#ef4444" }}>${r.pb.toLocaleString()}</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#ef4444" }}>${r.pa.toLocaleString()}</td>
                      <td className="px-2 py-1 text-right" style={{ color: "#fbbf24" }}>{r.piv}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>IV TERM STRUCTURE</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {["1D", "7D", "14D", "30D", "60D", "90D", "180D"].map((t, i) => {
                const ivs = [85, 68, 58, 52, 50, 48, 46];
                const y = 70 - ivs[i] * 0.75;
                return (
                  <g key={t}>
                    <circle cx={30 + i * 55} cy={y} r={3} fill="#f7931a" />
                    <text x={30 + i * 55} y={y - 8} textAnchor="middle" fill="#f7931a" fontSize="7">{ivs[i]}%</text>
                    <text x={30 + i * 55} y={78} textAnchor="middle" fill="#64748b" fontSize="6">{t}</text>
                    {i > 0 && <line x1={30 + (i - 1) * 55} y1={70 - ivs[i - 1] * 0.75} x2={30 + i * 55} y2={y} stroke="#f7931a" strokeWidth={1.5} />}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "perps" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PERPETUAL SWAPS — TOP EXCHANGES</div>
            {[
              { pair: "BTC-PERP", exchange: "Binance", price: 97425, funding: 0.0085, oi: 8.2, vol24h: 32.5, liqRisk: "Low" },
              { pair: "BTC-PERP", exchange: "Bybit", price: 97418, funding: 0.0092, oi: 4.8, vol24h: 18.2, liqRisk: "Low" },
              { pair: "BTC-PERP", exchange: "OKX", price: 97430, funding: 0.0078, oi: 3.5, vol24h: 12.8, liqRisk: "Low" },
              { pair: "ETH-PERP", exchange: "Binance", price: 3842, funding: 0.0120, oi: 4.2, vol24h: 15.5, liqRisk: "Medium" },
              { pair: "ETH-PERP", exchange: "Bybit", price: 3840, funding: 0.0135, oi: 2.8, vol24h: 8.2, liqRisk: "Medium" },
              { pair: "SOL-PERP", exchange: "Binance", price: 245.80, funding: 0.0250, oi: 1.8, vol24h: 5.2, liqRisk: "High" },
              { pair: "SOL-PERP", exchange: "Bybit", price: 245.65, funding: 0.0280, oi: 1.2, vol24h: 3.5, liqRisk: "High" },
            ].map((p, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{p.pair}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{p.exchange}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: p.liqRisk === "High" ? "rgba(239,68,68,0.15)" : p.liqRisk === "Medium" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                    color: p.liqRisk === "High" ? "#ef4444" : p.liqRisk === "Medium" ? "#fbbf24" : "#22c55e",
                  }}>{p.liqRisk} Liq Risk</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Price:</span> <span className="font-mono" style={{ color: "#00e5a0" }}>${p.price.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Funding:</span> <span className="font-mono" style={{ color: p.funding > 0.015 ? "#ef4444" : "#22c55e" }}>{p.funding.toFixed(4)}%</span></div>
                  <div><span style={{ color: "#64748b" }}>OI:</span> <span className="font-mono">${p.oi}B</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol 24h:</span> <span className="font-mono">${p.vol24h}B</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AGGREGATED FUNDING RATES (8H)</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {["BTC", "ETH", "SOL", "AVAX", "DOGE", "LINK", "ARB", "OP"].map((t, i) => {
                const rates = [0.008, 0.012, 0.025, 0.018, 0.035, 0.015, 0.022, 0.020];
                const h = Math.min(rates[i] * 2000, 60);
                return (
                  <g key={t}>
                    <rect x={15 + i * 48} y={65 - h} width={30} height={h} rx={2} fill={rates[i] > 0.02 ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"} stroke={rates[i] > 0.02 ? "#ef4444" : "#22c55e"} strokeWidth={0.5} />
                    <text x={30 + i * 48} y={60 - h} textAnchor="middle" fill={rates[i] > 0.02 ? "#ef4444" : "#22c55e"} fontSize="6">{(rates[i] * 100).toFixed(2)}%</text>
                    <text x={30 + i * 48} y={78} textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MARKET ANALYTICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Crypto Fear & Greed", val: "72", desc: "Greed", color: "#22c55e" },
                { label: "BTC Dominance", val: "54.2%", desc: "+0.8% MTD", color: "#f7931a" },
                { label: "Total Crypto Mkt Cap", val: "$3.42T", desc: "+$85B 7D", color: "#00e5a0" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: s.color }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LIQUIDATION HEATMAP (24H)</div>
            {[
              { range: "$94K–95K", longs: 0, shorts: 285, net: 285 },
              { range: "$95K–96K", longs: 12, shorts: 180, net: 168 },
              { range: "$96K–97K", longs: 45, shorts: 95, net: 50 },
              { range: "$97K–98K", longs: 120, shorts: 35, net: -85 },
              { range: "$98K–99K", longs: 250, shorts: 8, net: -242 },
              { range: "$99K–100K", longs: 420, shorts: 2, net: -418 },
            ].map(l => (
              <div key={l.range} className="flex items-center gap-2 p-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="w-20 font-mono text-[9px]">{l.range}</span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-3 rounded-sm" style={{ background: "rgba(239,68,68,0.1)" }}>
                    <div className="h-full rounded-sm" style={{ width: `${Math.min(l.longs / 4.2, 100)}%`, background: "rgba(239,68,68,0.5)" }} />
                  </div>
                  <span className="font-mono text-[8px] w-12 text-right" style={{ color: "#ef4444" }}>${l.longs}M</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-3 rounded-sm" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <div className="h-full rounded-sm" style={{ width: `${Math.min(l.shorts / 2.85, 100)}%`, background: "rgba(34,197,94,0.5)" }} />
                  </div>
                  <span className="font-mono text-[8px] w-12 text-right" style={{ color: "#22c55e" }}>${l.shorts}M</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXCHANGE FLOWS (7D NET)</div>
            {[
              { exchange: "Binance", btcFlow: -12500, ethFlow: -45000, usdtFlow: 850 },
              { exchange: "Coinbase", btcFlow: -8200, ethFlow: -22000, usdtFlow: -120 },
              { exchange: "Kraken", btcFlow: -3500, ethFlow: -8500, usdtFlow: 280 },
              { exchange: "OKX", btcFlow: 2200, ethFlow: 15000, usdtFlow: 450 },
            ].map(e => (
              <div key={e.exchange} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{e.exchange}</span>
                <div className="flex-1 grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>BTC:</span> <span className="font-mono" style={{ color: e.btcFlow < 0 ? "#22c55e" : "#ef4444" }}>{e.btcFlow > 0 ? "+" : ""}{e.btcFlow.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>ETH:</span> <span className="font-mono" style={{ color: e.ethFlow < 0 ? "#22c55e" : "#ef4444" }}>{e.ethFlow > 0 ? "+" : ""}{e.ethFlow.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>USDT:</span> <span className="font-mono" style={{ color: e.usdtFlow > 0 ? "#22c55e" : "#ef4444" }}>{e.usdtFlow > 0 ? "+" : ""}${e.usdtFlow}M</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
