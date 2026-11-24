"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "carry" | "ndf" | "basket" | "risk";

const CARRY_PAIRS = [
  { pair: "USD/JPY", funding: "JPY", rate: 0.10, invest: "USD", investRate: 4.50, carry: 4.40, spot: 148.52, fwd3m: 147.85, impliedYield: 1.82, vol3m: 9.8, sharpe: 1.85 },
  { pair: "USD/TRY", funding: "USD", rate: 4.50, invest: "TRY", investRate: 42.50, carry: 38.00, spot: 34.25, fwd3m: 37.42, impliedYield: 37.0, vol3m: 18.5, sharpe: 2.05 },
  { pair: "AUD/JPY", funding: "JPY", rate: 0.10, invest: "AUD", investRate: 4.10, carry: 4.00, spot: 97.85, fwd3m: 96.90, impliedYield: 3.88, vol3m: 11.2, sharpe: 1.42 },
  { pair: "NZD/JPY", funding: "JPY", rate: 0.10, invest: "NZD", investRate: 4.75, carry: 4.65, spot: 90.42, fwd3m: 89.35, impliedYield: 4.73, vol3m: 11.8, sharpe: 1.58 },
  { pair: "USD/MXN", funding: "USD", rate: 4.50, invest: "MXN", investRate: 10.25, carry: 5.75, spot: 17.42, fwd3m: 17.68, impliedYield: 5.96, vol3m: 12.5, sharpe: 1.84 },
  { pair: "EUR/HUF", funding: "EUR", rate: 3.25, invest: "HUF", investRate: 6.50, carry: 3.25, spot: 392.50, fwd3m: 395.80, impliedYield: 3.36, vol3m: 8.5, sharpe: 1.52 },
  { pair: "USD/ZAR", funding: "USD", rate: 4.50, invest: "ZAR", investRate: 8.00, carry: 3.50, spot: 18.85, fwd3m: 19.02, impliedYield: 3.60, vol3m: 15.2, sharpe: 0.92 },
  { pair: "USD/BRL", funding: "USD", rate: 4.50, invest: "BRL", investRate: 11.75, carry: 7.25, spot: 4.92, fwd3m: 5.01, impliedYield: 7.31, vol3m: 14.8, sharpe: 1.96 },
];

export default function FXCarryTradePanel() {
  const [tab, setTab] = useState<Tab>("carry");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FX CARRY TRADE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.15)", color: "#00e5a0" }}>Bloomberg FXCA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["carry", "ndf", "basket", "risk"] as Tab[]).map(t => (
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
          { label: "G10 CARRY INDEX", value: "+3.8%", sub: "YTD", color: "#22c55e" },
          { label: "EM CARRY INDEX", value: "+8.2%", sub: "YTD", color: "#22c55e" },
          { label: "JPY FUNDING COST", value: "0.10%", sub: "BOJ Rate", color: "#38bdf8" },
          { label: "VIX (RISK)", value: "14.8", sub: "Low vol = carry+", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[8px]" style={{ color: "#94a3b8" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "carry" && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>CARRY TRADE OPPORTUNITIES</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-2 py-1.5" style={{ color: "#64748b" }}>Pair</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Carry</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Spot</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>3M Vol</th>
                    <th className="text-right px-2 py-1.5" style={{ color: "#64748b" }}>Sharpe</th>
                  </tr>
                </thead>
                <tbody>
                  {CARRY_PAIRS.sort((a, b) => b.sharpe - a.sharpe).map(c => (
                    <tr key={c.pair} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5">
                        <span className="font-bold" style={{ color: "#00e5a0" }}>{c.pair}</span>
                        <div className="text-[8px]" style={{ color: "#64748b" }}>
                          Borrow {c.funding} ({c.rate}%) → Invest {c.invest} ({c.investRate}%)
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold" style={{ color: "#22c55e" }}>{c.carry.toFixed(2)}%</td>
                      <td className="px-2 py-1.5 text-right font-mono">{c.spot.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: c.vol3m > 15 ? "#ef4444" : c.vol3m > 10 ? "#fbbf24" : "#22c55e" }}>{c.vol3m}%</td>
                      <td className="px-2 py-1.5 text-right">
                        <span className="font-mono font-bold px-1.5 py-0.5 rounded" style={{
                          background: c.sharpe > 1.8 ? "rgba(34,197,94,0.15)" : c.sharpe > 1.2 ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
                          color: c.sharpe > 1.8 ? "#22c55e" : c.sharpe > 1.2 ? "#fbbf24" : "#ef4444"
                        }}>{c.sharpe.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "ndf" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NON-DELIVERABLE FORWARDS (NDF)</div>
            {[
              { pair: "USD/CNY", spot: 7.185, ndf1m: 7.192, ndf3m: 7.208, ndf6m: 7.235, ndf1y: 7.282, impliedRate: 2.72 },
              { pair: "USD/INR", spot: 83.42, ndf1m: 83.58, ndf3m: 83.95, ndf6m: 84.52, ndf1y: 85.68, impliedRate: 5.42 },
              { pair: "USD/KRW", spot: 1328.5, ndf1m: 1330.2, ndf3m: 1334.8, ndf6m: 1342.5, ndf1y: 1358.0, impliedRate: 4.44 },
              { pair: "USD/TWD", spot: 31.42, ndf1m: 31.48, ndf3m: 31.62, ndf6m: 31.85, ndf1y: 32.28, impliedRate: 5.48 },
              { pair: "USD/PHP", spot: 56.25, ndf1m: 56.42, ndf3m: 56.85, ndf6m: 57.42, ndf1y: 58.52, impliedRate: 8.08 },
            ].map(n => (
              <div key={n.pair} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{n.pair}</span>
                    <span className="font-mono" style={{ color: "#e2e8f0" }}>{n.spot.toFixed(n.spot > 100 ? 1 : 3)}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: "#fbbf24" }}>Impl: {n.impliedRate}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>1M:</span> <span className="font-mono">{n.ndf1m}</span></div>
                  <div><span style={{ color: "#64748b" }}>3M:</span> <span className="font-mono">{n.ndf3m}</span></div>
                  <div><span style={{ color: "#64748b" }}>6M:</span> <span className="font-mono">{n.ndf6m}</span></div>
                  <div><span style={{ color: "#64748b" }}>1Y:</span> <span className="font-mono">{n.ndf1y}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "basket" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MODEL CARRY BASKETS</div>
            {[
              { name: "G10 Carry Basket", long: "AUD, NZD, NOK", short: "JPY, CHF, EUR", carry: 3.2, ytd: 5.8, maxDD: -4.2, sharpe: 1.45 },
              { name: "EM High Carry", long: "BRL, MXN, ZAR", short: "USD", carry: 7.5, ytd: 12.4, maxDD: -8.5, sharpe: 1.68 },
              { name: "Asia Carry", long: "INR, IDR, PHP", short: "JPY", carry: 5.8, ytd: 8.2, maxDD: -6.2, sharpe: 1.35 },
              { name: "CEEMEA Carry", long: "HUF, PLN, ZAR", short: "EUR", carry: 4.2, ytd: 6.5, maxDD: -5.8, sharpe: 1.22 },
              { name: "Risk-Adj Optimal", long: "BRL, MXN, AUD", short: "JPY, CHF", carry: 5.5, ytd: 10.2, maxDD: -5.5, sharpe: 1.92 },
            ].map(b => (
              <div key={b.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{b.name}</span>
                  <span className="font-mono font-bold" style={{ color: b.sharpe > 1.5 ? "#22c55e" : "#fbbf24" }}>Sharpe: {b.sharpe}</span>
                </div>
                <div className="flex gap-4 text-[9px] mb-1.5">
                  <div><span style={{ color: "#22c55e" }}>Long:</span> <span className="font-mono">{b.long}</span></div>
                  <div><span style={{ color: "#ef4444" }}>Short:</span> <span className="font-mono">{b.short}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Carry:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{b.carry}%</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{b.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Max DD:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{b.maxDD}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CARRY TRADE RISK INDICATORS</div>
            {[
              { indicator: "VIX Level", value: "14.8", threshold: "<20 favorable", status: "GREEN", detail: "Low equity vol supports carry" },
              { indicator: "FX Implied Vol (G10)", value: "8.2%", threshold: "<10% favorable", status: "GREEN", detail: "Low FX vol = stable carry returns" },
              { indicator: "FX Implied Vol (EM)", value: "12.5%", threshold: "<15% favorable", status: "GREEN", detail: "EM vol contained, carry attractive" },
              { indicator: "JPY Funding Stability", value: "STABLE", threshold: "No BOJ shift", status: "GREEN", detail: "BOJ maintaining ultra-low rates" },
              { indicator: "US-JP Rate Diff", value: "440bp", threshold: ">300bp = strong carry", status: "GREEN", detail: "Wide differential supports USD/JPY carry" },
              { indicator: "Risk Reversal (USD/JPY)", value: "-0.8 vol", threshold: "<-2 = JPY demand", status: "YELLOW", detail: "Slight JPY put demand building" },
              { indicator: "EM Capital Flows", value: "+$12.5B/wk", threshold: "Positive = supportive", status: "GREEN", detail: "Strong inflows to EM fixed income" },
              { indicator: "Carry Crowding", value: "75th pctile", threshold: ">90th = danger", status: "YELLOW", detail: "Positioning moderately crowded" },
            ].map(r => (
              <div key={r.indicator} className="flex items-center gap-3 p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: r.status === "GREEN" ? "#22c55e" : r.status === "YELLOW" ? "#fbbf24" : "#ef4444" }} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{r.indicator}</span>
                    <span className="font-mono" style={{ color: r.status === "GREEN" ? "#22c55e" : r.status === "YELLOW" ? "#fbbf24" : "#ef4444" }}>{r.value}</span>
                  </div>
                  <div className="text-[9px]" style={{ color: "#94a3b8" }}>{r.detail}</div>
                </div>
              </div>
            ))}

            <div className="p-3 rounded" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="font-bold text-[10px] mb-1" style={{ color: "#22c55e" }}>CARRY ENVIRONMENT: FAVORABLE</div>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>Low global volatility, wide rate differentials, and stable EM flows support carry strategies. Watch for BOJ policy shift and crowded positioning as key risks.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
