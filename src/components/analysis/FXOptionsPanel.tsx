"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const FX_VOLS = [
  { pair: "EUR/USD", spot: 1.0892, atm1m: 7.2, atm3m: 7.8, atm1y: 8.4, rr25d1m: -0.45, bf25d1m: 0.22, impliedMove1m: 1.82 },
  { pair: "USD/JPY", spot: 149.85, atm1m: 9.4, atm3m: 10.2, atm1y: 10.8, rr25d1m: 1.85, bf25d1m: 0.45, impliedMove1m: 3.84 },
  { pair: "GBP/USD", spot: 1.2645, atm1m: 7.8, atm3m: 8.2, atm1y: 8.8, rr25d1m: -0.62, bf25d1m: 0.28, impliedMove1m: 1.95 },
  { pair: "USD/CHF", spot: 0.8742, atm1m: 7.0, atm3m: 7.5, atm1y: 8.0, rr25d1m: 0.35, bf25d1m: 0.18, impliedMove1m: 1.72 },
  { pair: "AUD/USD", spot: 0.6538, atm1m: 9.8, atm3m: 10.4, atm1y: 11.2, rr25d1m: -1.25, bf25d1m: 0.42, impliedMove1m: 2.52 },
  { pair: "USD/CAD", spot: 1.3645, atm1m: 6.8, atm3m: 7.2, atm1y: 7.8, rr25d1m: 0.55, bf25d1m: 0.20, impliedMove1m: 1.68 },
  { pair: "NZD/USD", spot: 0.5985, atm1m: 10.5, atm3m: 11.0, atm1y: 11.8, rr25d1m: -1.45, bf25d1m: 0.52, impliedMove1m: 2.72 },
  { pair: "USD/TRY", spot: 34.25, atm1m: 18.2, atm3m: 22.5, atm1y: 28.4, rr25d1m: 8.50, bf25d1m: 2.80, impliedMove1m: 8.42 },
];

type Tab = "volboard" | "surface" | "pricer" | "flows";

export default function FXOptionsPanel() {
  const [tab, setTab] = useState<Tab>("volboard");
  const [selectedPair, setSelectedPair] = useState("EUR/USD");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💱</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>FX OPTIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Bloomberg OVML</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["volboard", "surface", "pricer", "flows"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "volboard" && (
          <div className="space-y-1">
            <div className="grid grid-cols-9 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>PAIR</span><span className="text-right">SPOT</span><span className="text-right">ATM 1M</span><span className="text-right">ATM 3M</span>
              <span className="text-right">ATM 1Y</span><span className="text-right">25D RR</span><span className="text-right">25D BF</span>
              <span className="text-right">1M MOVE</span><span></span>
            </div>
            {FX_VOLS.map((v, i) => (
              <div key={i} className="grid grid-cols-9 gap-2 px-2 py-1.5 rounded items-center cursor-pointer"
                onClick={() => setSelectedPair(v.pair)}
                style={{
                  background: selectedPair === v.pair ? "rgba(0,229,160,0.08)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  border: selectedPair === v.pair ? "1px solid rgba(0,229,160,0.2)" : "1px solid transparent"
                }}>
                <span className="font-bold" style={{ color: "#00e5a0" }}>{v.pair}</span>
                <span className="font-mono text-right">{v.spot.toFixed(v.spot > 100 ? 2 : 4)}</span>
                <span className="font-mono text-right" style={{ color: "#38bdf8" }}>{v.atm1m.toFixed(1)}</span>
                <span className="font-mono text-right">{v.atm3m.toFixed(1)}</span>
                <span className="font-mono text-right">{v.atm1y.toFixed(1)}</span>
                <span className="font-mono text-right" style={{ color: v.rr25d1m > 0 ? "#22c55e" : "#ef4444" }}>
                  {v.rr25d1m > 0 ? "+" : ""}{v.rr25d1m.toFixed(2)}
                </span>
                <span className="font-mono text-right" style={{ color: "#94a3b8" }}>{v.bf25d1m.toFixed(2)}</span>
                <span className="font-mono text-right" style={{ color: v.impliedMove1m > 3 ? "#ef4444" : "#fbbf24" }}>
                  ±{v.impliedMove1m.toFixed(2)}%
                </span>
                <span className="text-[8px]" style={{ color: v.atm1m > v.atm3m ? "#ef4444" : "#22c55e" }}>
                  {v.atm1m > v.atm3m ? "INV" : "NRM"}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "surface" && (() => {
          const sel = FX_VOLS.find(v => v.pair === selectedPair) ?? FX_VOLS[0];
          const tenors = ["1W", "2W", "1M", "2M", "3M", "6M", "1Y"];
          const deltas = ["10D Put", "25D Put", "ATM", "25D Call", "10D Call"];
          const baseVol = sel.atm1m;
          const surface = tenors.map((_, ti) => deltas.map((_, di) => {
            const tenorAdj = ti * 0.3;
            const smileAdj = Math.abs(di - 2) * 0.8 + (di < 2 ? sel.rr25d1m * (2 - di) * 0.15 : di > 2 ? -sel.rr25d1m * (di - 2) * 0.15 : 0);
            return Math.max(1, baseVol + tenorAdj + smileAdj + sel.bf25d1m * Math.abs(di - 2));
          }));

          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VOLATILITY SURFACE — {selectedPair}</span>
                <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>Spot: {sel.spot}</span>
              </div>
              <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${deltas.length}, 1fr)` }}>
                  <div className="p-1.5 text-[8px] font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>TENOR</div>
                  {deltas.map(d => (
                    <div key={d} className="p-1.5 text-[8px] font-bold text-center" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{d}</div>
                  ))}
                  {tenors.map((tenor, ti) => (
                    <>
                      <div key={tenor} className="p-1.5 font-mono text-[9px]" style={{ background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>{tenor}</div>
                      {surface[ti].map((vol, di) => {
                        const intensity = Math.min((vol - 5) / 20, 1);
                        return (
                          <div key={di} className="p-1.5 font-mono text-[9px] text-center"
                            style={{ background: `rgba(${vol > 12 ? "239,68,68" : vol > 9 ? "251,191,36" : "34,197,94"}, ${intensity * 0.3})`, color: "#e2e8f0" }}>
                            {vol.toFixed(1)}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "pricer" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VANILLA OPTION PRICER — {selectedPair}</div>
            {(() => {
              const sel = FX_VOLS.find(v => v.pair === selectedPair) ?? FX_VOLS[0];
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <div className="text-[9px] font-bold mb-2" style={{ color: "#22c55e" }}>CALL (1M ATM)</div>
                    {[
                      { label: "Strike", value: sel.spot.toFixed(sel.spot > 100 ? 2 : 4) },
                      { label: "Premium (pips)", value: (sel.spot * sel.atm1m / 100 * Math.sqrt(30 / 365) * 100).toFixed(1) },
                      { label: "Delta", value: "50.0%" },
                      { label: "Gamma", value: (0.08 / sel.atm1m * 10).toFixed(3) },
                      { label: "Vega", value: (sel.spot * Math.sqrt(30 / 365) / 100).toFixed(4) },
                      { label: "Theta", value: `-${(sel.spot * sel.atm1m / 100 / (2 * Math.sqrt(365 / 30)) / 365 * 10000).toFixed(2)} pips/d` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-0.5 text-[9px]">
                        <span style={{ color: "#64748b" }}>{r.label}</span>
                        <span className="font-mono">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div className="text-[9px] font-bold mb-2" style={{ color: "#ef4444" }}>PUT (1M ATM)</div>
                    {[
                      { label: "Strike", value: sel.spot.toFixed(sel.spot > 100 ? 2 : 4) },
                      { label: "Premium (pips)", value: (sel.spot * sel.atm1m / 100 * Math.sqrt(30 / 365) * 100).toFixed(1) },
                      { label: "Delta", value: "-50.0%" },
                      { label: "Gamma", value: (0.08 / sel.atm1m * 10).toFixed(3) },
                      { label: "Vega", value: (sel.spot * Math.sqrt(30 / 365) / 100).toFixed(4) },
                      { label: "Theta", value: `-${(sel.spot * sel.atm1m / 100 / (2 * Math.sqrt(365 / 30)) / 365 * 10000).toFixed(2)} pips/d` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-0.5 text-[9px]">
                        <span style={{ color: "#64748b" }}>{r.label}</span>
                        <span className="font-mono">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>COMMON STRUCTURES</div>
            {[
              { name: "1M Straddle", cost: "1.82%", breakevens: "±1.82% from spot", maxLoss: "Premium paid" },
              { name: "1M 25D Risk Reversal", cost: "0.08%", breakevens: "Varies by delta", maxLoss: "Unlimited on short side" },
              { name: "1M Butterfly", cost: "0.22%", breakevens: "±0.75% from ATM", maxLoss: "Premium paid" },
              { name: "3M Seagull", cost: "Zero cost", breakevens: "1.5% upside / 2.0% downside", maxLoss: "Capped both sides" },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold" style={{ color: "#06b6d4" }}>{s.name}</span>
                <div className="flex items-center gap-4 text-[9px]">
                  <span><span style={{ color: "#64748b" }}>Cost:</span> <span className="font-mono">{s.cost}</span></span>
                  <span><span style={{ color: "#64748b" }}>BE:</span> <span className="font-mono">{s.breakevens}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NOTABLE FX OPTION FLOWS</div>
            {[
              { time: "14:28", pair: "EUR/USD", type: "1M 1.10 Call", notional: "$2.5B", premium: "$18.2M", dealer: "Street", direction: "BUY" },
              { time: "13:55", pair: "USD/JPY", type: "3M 155 Call", notional: "¥180B", premium: "¥1.2B", dealer: "Real Money", direction: "BUY" },
              { time: "13:22", pair: "GBP/USD", type: "1M 1.25/1.28 Strangle", notional: "£850M", premium: "£8.5M", dealer: "Hedge Fund", direction: "SELL" },
              { time: "12:48", pair: "AUD/USD", type: "6M 0.65 Put", notional: "A$3.2B", premium: "A$42M", dealer: "Corporate", direction: "BUY" },
              { time: "12:15", pair: "USD/TRY", type: "1M 35.50 Call", notional: "$500M", premium: "$8.8M", dealer: "Sovereign", direction: "BUY" },
              { time: "11:42", pair: "EUR/USD", type: "1Y 1.15 Call", notional: "$5B", premium: "$125M", dealer: "Central Bank", direction: "BUY" },
            ].map((f, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{f.time}</span>
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{f.pair}</span>
                    <span style={{ color: "#38bdf8" }}>{f.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: f.direction === "BUY" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: f.direction === "BUY" ? "#22c55e" : "#ef4444"
                    }}>{f.direction}</span>
                    <span className="font-mono" style={{ color: "#fbbf24" }}>{f.notional}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 text-[9px]">
                  <span><span style={{ color: "#64748b" }}>Premium:</span> <span className="font-mono">{f.premium}</span></span>
                  <span><span style={{ color: "#64748b" }}>Dealer:</span> <span style={{ color: "#94a3b8" }}>{f.dealer}</span></span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>EXPIRY CLUSTERS (Notional at Strike)</div>
            {[
              { pair: "EUR/USD", level: "1.0800", notional: "$8.2B", expiry: "Nov 22", significance: "HIGH" },
              { pair: "EUR/USD", level: "1.1000", notional: "$12.5B", expiry: "Nov 29", significance: "MEGA" },
              { pair: "USD/JPY", level: "150.00", notional: "¥1.8T", expiry: "Nov 25", significance: "MEGA" },
              { pair: "USD/JPY", level: "148.00", notional: "¥650B", expiry: "Nov 22", significance: "HIGH" },
              { pair: "GBP/USD", level: "1.2700", notional: "£2.4B", expiry: "Nov 29", significance: "HIGH" },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{e.pair}</span>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>{e.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{e.notional}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.expiry}</span>
                  <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                    background: e.significance === "MEGA" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: e.significance === "MEGA" ? "#ef4444" : "#fbbf24"
                  }}>{e.significance}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
