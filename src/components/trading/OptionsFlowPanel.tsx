"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "unusual" | "flow" | "gamma" | "skew";

export default function OptionsFlowPanel() {
  const [tab, setTab] = useState<Tab>("unusual");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>OPTIONS FLOW</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg OMON</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["unusual", "flow", "gamma", "skew"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "unusual" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UNUSUAL OPTIONS ACTIVITY</div>
            {[
              { time: "14:32", ticker: "NVDA", strike: "$145C", exp: "Dec 20", vol: 85200, oi: 12500, ratio: 6.8, prem: "$18.5M", side: "BUY", sentiment: "Bullish" },
              { time: "14:28", ticker: "AAPL", strike: "$195P", exp: "Jan 17", vol: 42000, oi: 8200, ratio: 5.1, prem: "$8.2M", side: "BUY", sentiment: "Bearish" },
              { time: "14:15", ticker: "TSLA", strike: "$350C", exp: "Dec 27", vol: 65000, oi: 15800, ratio: 4.1, prem: "$22.5M", side: "BUY", sentiment: "Bullish" },
              { time: "14:08", ticker: "SPY", strike: "$600C", exp: "Dec 20", vol: 125000, oi: 45000, ratio: 2.8, prem: "$42M", side: "SELL", sentiment: "Neutral" },
              { time: "13:55", ticker: "META", strike: "$580P", exp: "Dec 20", vol: 28500, oi: 3200, ratio: 8.9, prem: "$12.8M", side: "BUY", sentiment: "Bearish" },
              { time: "13:42", ticker: "AMD", strike: "$160C", exp: "Jan 17", vol: 55000, oi: 22000, ratio: 2.5, prem: "$15.2M", side: "BUY", sentiment: "Bullish" },
            ].map((o, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{o.time}</span>
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{o.ticker}</span>
                    <span className="font-mono" style={{ color: o.strike.includes("C") ? "#22c55e" : "#ef4444" }}>{o.strike}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{o.exp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{o.prem}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: o.sentiment === "Bullish" ? "rgba(34,197,94,0.15)" : o.sentiment === "Bearish" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.1)",
                      color: o.sentiment === "Bullish" ? "#22c55e" : o.sentiment === "Bearish" ? "#ef4444" : "#64748b",
                    }}>{o.sentiment}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{o.vol.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>OI:</span> <span className="font-mono">{o.oi.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>V/OI:</span> <span className="font-mono" style={{ color: o.ratio > 5 ? "#ef4444" : "#fbbf24" }}>{o.ratio}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Side:</span> <span className="font-mono" style={{ color: o.side === "BUY" ? "#22c55e" : "#ef4444" }}>{o.side}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "flow" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NET OPTIONS FLOW — TODAY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Premium", val: "$8.5B", color: "#00e5a0" },
                { label: "Call Premium", val: "$5.2B", color: "#22c55e" },
                { label: "Put Premium", val: "$3.3B", color: "#ef4444" },
                { label: "P/C Ratio", val: "0.63", color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LARGEST NET FLOWS BY TICKER</div>
            {[
              { ticker: "NVDA", callFlow: 285, putFlow: -120, net: 165, bias: "Bullish" },
              { ticker: "TSLA", callFlow: 220, putFlow: -180, net: 40, bias: "Bullish" },
              { ticker: "SPY", callFlow: 450, putFlow: -380, net: 70, bias: "Bullish" },
              { ticker: "AAPL", callFlow: 95, putFlow: -145, net: -50, bias: "Bearish" },
              { ticker: "QQQ", callFlow: 180, putFlow: -125, net: 55, bias: "Bullish" },
              { ticker: "META", callFlow: 65, putFlow: -110, net: -45, bias: "Bearish" },
            ].map(f => (
              <div key={f.ticker} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-12" style={{ color: "#00e5a0" }}>{f.ticker}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#22c55e" }}>+${f.callFlow}M</span>
                <span className="font-mono w-16 text-right" style={{ color: "#ef4444" }}>-${Math.abs(f.putFlow)}M</span>
                <span className="font-mono w-16 text-right font-bold" style={{ color: f.net >= 0 ? "#22c55e" : "#ef4444" }}>{f.net >= 0 ? "+" : ""}{f.net}M</span>
                <span className="text-[8px] ml-auto px-1 py-0.5 rounded" style={{
                  background: f.bias === "Bullish" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: f.bias === "Bullish" ? "#22c55e" : "#ef4444",
                }}>{f.bias}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "gamma" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SPX GAMMA EXPOSURE (GEX)</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: "Total GEX", val: "$4.2B", color: "#00e5a0" },
                { label: "Gamma Flip", val: "5,850", color: "#fbbf24" },
                { label: "Max Gamma", val: "6,000", color: "#a78bfa" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <svg viewBox="0 0 400 100" className="w-full">
              {[5700, 5750, 5800, 5850, 5900, 5950, 6000, 6050, 6100].map((strike, i) => {
                const gex = [-1.2, -0.5, 0.2, 0.0, 1.5, 2.8, 4.2, 2.5, 1.0];
                const h = Math.abs(gex[i]) * 15;
                return (
                  <g key={strike}>
                    <rect x={15 + i * 42} y={gex[i] >= 0 ? 50 - h : 50} width={28} height={h} rx={2}
                      fill={gex[i] >= 0 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}
                      stroke={gex[i] >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={0.5} />
                    <text x={29 + i * 42} y={gex[i] >= 0 ? 48 - h : 56 + h} textAnchor="middle" fill={gex[i] >= 0 ? "#22c55e" : "#ef4444"} fontSize="5">{gex[i]}B</text>
                    <text x={29 + i * 42} y="98" textAnchor="middle" fill="#64748b" fontSize="5">{strike}</text>
                  </g>
                );
              })}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#64748b" strokeWidth={0.5} strokeDasharray="2,2" />
              <text x="200" y="93" textAnchor="middle" fill="#64748b" fontSize="6">SPX Strike</text>
            </svg>
          </div>
        )}

        {tab === "skew" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VOLATILITY SKEW — SPX</div>
            {[
              { delta: "10P", iv: 28.5, chg: 1.2 },
              { delta: "25P", iv: 22.8, chg: 0.8 },
              { delta: "ATM", iv: 16.5, chg: 0.2 },
              { delta: "25C", iv: 14.8, chg: -0.1 },
              { delta: "10C", iv: 15.5, chg: 0.3 },
            ].map(s => (
              <div key={s.delta} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-12 font-bold">{s.delta}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#00e5a0" }}>{s.iv}%</span>
                <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.iv / 30) * 100}%`, background: "rgba(244,63,94,0.4)" }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: s.chg >= 0 ? "#ef4444" : "#22c55e" }}>{s.chg >= 0 ? "+" : ""}{s.chg}pt</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TERM STRUCTURE</div>
            {[
              { expiry: "1W", vix: 14.2, rv: 12.5 },
              { expiry: "1M", vix: 16.5, rv: 14.8 },
              { expiry: "3M", vix: 18.2, rv: 15.5 },
              { expiry: "6M", vix: 19.5, rv: 16.2 },
              { expiry: "1Y", vix: 20.8, rv: 17.0 },
            ].map(t => (
              <div key={t.expiry} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-10 font-bold">{t.expiry}</span>
                <span className="font-mono w-14" style={{ color: "#f43f5e" }}>IV: {t.vix}</span>
                <span className="font-mono w-14" style={{ color: "#38bdf8" }}>RV: {t.rv}</span>
                <span className="font-mono w-16 ml-auto" style={{ color: t.vix > t.rv ? "#fbbf24" : "#22c55e" }}>
                  {(t.vix - t.rv).toFixed(1)}pt {t.vix > t.rv ? "rich" : "cheap"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
