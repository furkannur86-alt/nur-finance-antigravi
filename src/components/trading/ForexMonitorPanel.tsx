"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "majors" | "cross" | "central-bank" | "carry";

export default function ForexMonitorPanel() {
  const [tab, setTab] = useState<Tab>("majors");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FX MONITOR</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters FX</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["majors", "cross", "central-bank", "carry"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "central-bank" ? "CB WATCH" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "majors" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>G10 CURRENCY PAIRS</div>
            {[
              { pair: "EUR/USD", bid: 1.0542, ask: 1.0544, chg: -0.32, high: 1.0588, low: 1.0515, vol: "High" },
              { pair: "GBP/USD", bid: 1.2585, ask: 1.2588, chg: 0.15, high: 1.2612, low: 1.2550, vol: "Med" },
              { pair: "USD/JPY", bid: 154.85, ask: 154.88, chg: 0.42, high: 155.20, low: 154.15, vol: "High" },
              { pair: "USD/CHF", bid: 0.8865, ask: 0.8868, chg: 0.18, high: 0.8892, low: 0.8842, vol: "Low" },
              { pair: "AUD/USD", bid: 0.6512, ask: 0.6515, chg: -0.55, high: 0.6565, low: 0.6498, vol: "Med" },
              { pair: "USD/CAD", bid: 1.3985, ask: 1.3988, chg: 0.28, high: 1.4015, low: 1.3952, vol: "Med" },
              { pair: "NZD/USD", bid: 0.5892, ask: 0.5895, chg: -0.68, high: 0.5942, low: 0.5878, vol: "Low" },
            ].map(p => (
              <div key={p.pair} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-16" style={{ color: "#00e5a0" }}>{p.pair}</span>
                <span className="font-mono w-16 text-right">{p.bid.toFixed(4)}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{p.ask.toFixed(4)}</span>
                <span className="font-mono w-14 text-right" style={{ color: p.chg >= 0 ? "#22c55e" : "#ef4444" }}>{p.chg >= 0 ? "+" : ""}{p.chg}%</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>H:{p.high}</span>
                <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#64748b" }}>L:{p.low}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EM CURRENCIES vs USD</div>
            {[
              { pair: "USD/CNY", rate: 7.2485, chg: 0.12 },
              { pair: "USD/INR", rate: 84.35, chg: 0.08 },
              { pair: "USD/BRL", rate: 5.82, chg: 1.25 },
              { pair: "USD/TRY", rate: 34.52, chg: 0.35 },
              { pair: "USD/ZAR", rate: 17.85, chg: -0.42 },
            ].map(e => (
              <div key={e.pair} className="flex items-center gap-2 p-1 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono font-bold w-16" style={{ color: "#fbbf24" }}>{e.pair}</span>
                <span className="font-mono w-16">{e.rate}</span>
                <span className="font-mono" style={{ color: e.chg >= 0 ? "#ef4444" : "#22c55e" }}>{e.chg >= 0 ? "+" : ""}{e.chg}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "cross" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CROSS RATES MATRIX</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px] font-mono">
                <thead>
                  <tr>
                    <th className="text-left p-1" style={{ color: "#64748b" }}></th>
                    {["USD", "EUR", "GBP", "JPY", "CHF"].map(c => (
                      <th key={c} className="p-1 text-right" style={{ color: "#00e5a0" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cur: "USD", rates: [1.0, 0.9485, 0.7946, 154.85, 0.8865] },
                    { cur: "EUR", rates: [1.0542, 1.0, 0.8378, 163.33, 0.9348] },
                    { cur: "GBP", rates: [1.2585, 1.1935, 1.0, 194.88, 1.1158] },
                    { cur: "JPY", rates: [0.00646, 0.00612, 0.00513, 1.0, 0.00572] },
                    { cur: "CHF", rates: [1.1281, 1.0697, 0.8962, 174.72, 1.0] },
                  ].map(r => (
                    <tr key={r.cur}>
                      <td className="p-1 font-bold" style={{ color: "#fbbf24" }}>{r.cur}</td>
                      {r.rates.map((rate, i) => (
                        <td key={i} className="p-1 text-right" style={{ color: rate === 1.0 ? "#64748b" : "#e2e8f0" }}>
                          {rate === 1.0 ? "—" : rate < 1 ? rate.toFixed(5) : rate.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "central-bank" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CENTRAL BANK POLICY RATES</div>
            {[
              { bank: "Federal Reserve", rate: 4.75, next: "Dec 18", exp: -25, prob: 72, bias: "Dovish" },
              { bank: "ECB", rate: 3.40, next: "Dec 12", exp: -25, prob: 85, bias: "Dovish" },
              { bank: "Bank of England", rate: 4.75, next: "Dec 19", exp: 0, prob: 88, bias: "Neutral" },
              { bank: "Bank of Japan", rate: 0.25, next: "Dec 19", exp: 0, prob: 65, bias: "Hawkish" },
              { bank: "SNB", rate: 1.00, next: "Dec 12", exp: -25, prob: 60, bias: "Dovish" },
              { bank: "RBA", rate: 4.35, next: "Dec 10", exp: 0, prob: 92, bias: "Neutral" },
            ].map(b => (
              <div key={b.bank} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{b.bank}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{b.rate}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Next:</span> <span>{b.next}</span></div>
                  <div><span style={{ color: "#64748b" }}>Exp:</span> <span className="font-mono" style={{ color: b.exp < 0 ? "#22c55e" : b.exp > 0 ? "#ef4444" : "#64748b" }}>{b.exp >= 0 ? "+" : ""}{b.exp}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>Prob:</span> <span className="font-mono">{b.prob}%</span></div>
                  <div><span className="px-1 py-0.5 rounded text-[8px]" style={{
                    background: b.bias === "Dovish" ? "rgba(34,197,94,0.1)" : b.bias === "Hawkish" ? "rgba(239,68,68,0.1)" : "rgba(100,116,139,0.1)",
                    color: b.bias === "Dovish" ? "#22c55e" : b.bias === "Hawkish" ? "#ef4444" : "#64748b",
                  }}>{b.bias}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "carry" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CARRY TRADE MONITOR</div>
            {[
              { pair: "Long MXN/Short JPY", carry: 10.50, spot: -2.1, total: 8.40, sharpe: 1.85, risk: "Medium" },
              { pair: "Long BRL/Short CHF", carry: 11.75, spot: -5.2, total: 6.55, sharpe: 1.22, risk: "High" },
              { pair: "Long AUD/Short JPY", carry: 4.10, spot: -1.8, total: 2.30, sharpe: 0.95, risk: "Medium" },
              { pair: "Long NZD/Short CHF", carry: 4.75, spot: -2.5, total: 2.25, sharpe: 0.88, risk: "Medium" },
              { pair: "Long INR/Short EUR", carry: 3.20, spot: 0.5, total: 3.70, sharpe: 1.45, risk: "Low" },
            ].map(c => (
              <div key={c.pair} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.pair}</span>
                  <span className="font-mono font-bold" style={{ color: c.total > 5 ? "#22c55e" : "#fbbf24" }}>{c.total}% total</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Carry:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{c.carry}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Spot:</span> <span className="font-mono" style={{ color: c.spot >= 0 ? "#22c55e" : "#ef4444" }}>{c.spot}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Sharpe:</span> <span className="font-mono">{c.sharpe}</span></div>
                  <div><span className="px-1 py-0.5 rounded text-[8px]" style={{
                    background: c.risk === "High" ? "rgba(239,68,68,0.1)" : c.risk === "Low" ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.1)",
                    color: c.risk === "High" ? "#ef4444" : c.risk === "Low" ? "#22c55e" : "#fbbf24",
                  }}>{c.risk}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
