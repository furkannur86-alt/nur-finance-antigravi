"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "overview" | "liabilities" | "allocation" | "risk";

export default function PensionFundPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏛️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PENSION FUND ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg PFA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "liabilities", "allocation", "risk"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "overview" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FUND SUMMARY</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total Assets", value: "$245.8B", color: "#00e5a0" },
                { label: "Total Liabilities", value: "$228.5B", color: "#fbbf24" },
                { label: "Funded Ratio", value: "107.6%", color: "#22c55e" },
                { label: "Surplus", value: "$17.3B", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP PENSION FUNDS — FUNDED STATUS</div>
            {[
              { name: "CalPERS", assets: 502, liabilities: 538, funded: 93.3, returnYtd: 8.5, benchmark: 7.0 },
              { name: "CalSTRS", assets: 328, liabilities: 352, funded: 93.2, returnYtd: 9.2, benchmark: 7.0 },
              { name: "NY State CRF", assets: 268, liabilities: 245, funded: 109.4, returnYtd: 7.8, benchmark: 6.8 },
              { name: "Florida SBA", assets: 225, liabilities: 198, funded: 113.6, returnYtd: 10.2, benchmark: 7.2 },
              { name: "Texas Teachers", assets: 198, liabilities: 215, funded: 92.1, returnYtd: 6.5, benchmark: 7.5 },
              { name: "GPIF (Japan)", assets: 1580, liabilities: 1420, funded: 111.3, returnYtd: 5.8, benchmark: 4.5 },
              { name: "Norway GPFG", assets: 1620, liabilities: 0, funded: 999, returnYtd: 12.5, benchmark: 8.0 },
              { name: "ABP (Netherlands)", assets: 580, liabilities: 545, funded: 106.4, returnYtd: 7.2, benchmark: 6.5 },
            ].map(f => (
              <div key={f.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>${f.assets}B</span>
                    <span className="font-mono font-bold" style={{ color: f.funded >= 100 ? "#22c55e" : f.funded >= 90 ? "#fbbf24" : "#ef4444" }}>
                      {f.funded === 999 ? "SWF" : `${f.funded.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-[9px]">
                  <div className="flex gap-3">
                    <span><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{f.returnYtd}%</span></span>
                    <span><span style={{ color: "#64748b" }}>Target:</span> <span className="font-mono">{f.benchmark}%</span></span>
                  </div>
                  <span className="font-mono" style={{ color: f.returnYtd > f.benchmark ? "#22c55e" : "#ef4444" }}>
                    α: {f.returnYtd > f.benchmark ? "+" : ""}{(f.returnYtd - f.benchmark).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "liabilities" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LIABILITY STRUCTURE</div>
            {[
              { bucket: "Active Members", pbo: 85.2, pct: 37, duration: 18.5, growth: 3.2 },
              { bucket: "Deferred Vested", pbo: 42.8, pct: 19, duration: 15.2, growth: 2.8 },
              { bucket: "Retirees — Current", pbo: 78.5, pct: 34, duration: 10.5, growth: 2.5 },
              { bucket: "Beneficiaries", pbo: 22.0, pct: 10, duration: 8.2, growth: 1.8 },
            ].map(l => (
              <div key={l.bucket} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold">{l.bucket}</span>
                  <span className="font-mono font-bold">${l.pbo.toFixed(1)}B</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${l.pct}%`, background: "#38bdf8", opacity: 0.6 }} />
                  </div>
                  <span className="font-mono text-[9px] w-10 text-right">{l.pct}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Duration:</span> <span className="font-mono">{l.duration}yr</span></div>
                  <div><span style={{ color: "#64748b" }}>Growth:</span> <span className="font-mono">{l.growth}%/yr</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DISCOUNT RATE SENSITIVITY</div>
            {[
              { scenario: "-100bp", liab: 258.5, funded: 95.1, surplus: -12.7 },
              { scenario: "-50bp", liab: 242.8, funded: 101.2, surplus: 2.9 },
              { scenario: "Base", liab: 228.5, funded: 107.6, surplus: 17.3 },
              { scenario: "+50bp", liab: 215.8, funded: 113.9, surplus: 30.0 },
              { scenario: "+100bp", liab: 204.2, funded: 120.4, surplus: 41.6 },
            ].map(s => (
              <div key={s.scenario} className="flex items-center gap-3 p-2 rounded" style={{ background: s.scenario === "Base" ? "rgba(0,229,160,0.05)" : "rgba(255,255,255,0.03)" }}>
                <span className="font-bold w-14" style={{ color: s.scenario === "Base" ? "#00e5a0" : "#e2e8f0" }}>{s.scenario}</span>
                <span className="font-mono w-16">${s.liab.toFixed(1)}B</span>
                <span className="font-mono w-14" style={{ color: s.funded >= 100 ? "#22c55e" : "#ef4444" }}>{s.funded.toFixed(1)}%</span>
                <span className="font-mono flex-1 text-right" style={{ color: s.surplus >= 0 ? "#22c55e" : "#ef4444" }}>
                  {s.surplus >= 0 ? "+" : ""}${s.surplus.toFixed(1)}B
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "allocation" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRATEGIC ASSET ALLOCATION</div>
            {[
              { asset: "Public Equities", target: 35, actual: 37.2, range: "30-40", returnYtd: 15.2 },
              { asset: "Fixed Income", target: 25, actual: 23.8, range: "20-30", returnYtd: 4.5 },
              { asset: "Private Equity", target: 15, actual: 14.5, range: "10-18", returnYtd: 12.8 },
              { asset: "Real Assets", target: 10, actual: 10.8, range: "8-14", returnYtd: 6.2 },
              { asset: "Hedge Funds", target: 8, actual: 7.2, range: "5-12", returnYtd: 8.5 },
              { asset: "Infrastructure", target: 5, actual: 4.8, range: "3-8", returnYtd: 7.8 },
              { asset: "Cash/Other", target: 2, actual: 1.7, range: "0-5", returnYtd: 4.2 },
            ].map(a => (
              <div key={a.asset} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{a.asset}</span>
                <div className="flex-1 relative h-4 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 rounded" style={{
                    left: 0, width: `${a.actual}%`,
                    background: "rgba(0,229,160,0.3)",
                  }} />
                  <div className="absolute top-0 bottom-0 w-px" style={{ left: `${a.target}%`, background: "#fbbf24" }} />
                </div>
                <span className="font-mono w-12 text-right">{a.actual}%</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{a.target}%</span>
                <span className="font-mono w-14 text-right" style={{ color: a.returnYtd >= 0 ? "#22c55e" : "#ef4444" }}>+{a.returnYtd}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RISK METRICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Tracking Error", value: "2.8%", status: "OK" },
                { label: "VaR (99%, 1D)", value: "$1.2B", status: "OK" },
                { label: "Liability Beta", value: "0.92", status: "WATCH" },
                { label: "Interest Rate DV01", value: "$85M", status: "OK" },
                { label: "Credit Spread DV01", value: "$42M", status: "WATCH" },
                { label: "Illiquidity Ratio", value: "28%", status: "OK" },
              ].map(r => (
                <div key={r.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.status === "OK" ? "#22c55e" : "#fbbf24" }} />
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.label}</span>
                  </div>
                  <div className="font-mono font-bold mt-0.5">{r.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>STRESS SCENARIOS</div>
            {[
              { scenario: "2008 GFC Replay", assetImpact: -28.5, liabImpact: -15.2, fundedAfter: 92.5, surplus: -18.2 },
              { scenario: "2020 COVID Crash", assetImpact: -18.5, liabImpact: -8.5, fundedAfter: 98.2, surplus: -4.5 },
              { scenario: "Rising Rates +300bp", assetImpact: -12.5, liabImpact: -22.8, fundedAfter: 118.5, surplus: 38.2 },
              { scenario: "Stagflation", assetImpact: -15.2, liabImpact: 5.5, fundedAfter: 88.5, surplus: -28.5 },
              { scenario: "Tech Bubble Burst", assetImpact: -22.8, liabImpact: -5.2, fundedAfter: 95.8, surplus: -10.2 },
            ].map(s => (
              <div key={s.scenario} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.scenario}</span>
                  <span className="font-mono font-bold" style={{ color: s.fundedAfter >= 100 ? "#22c55e" : "#ef4444" }}>{s.fundedAfter}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Assets:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{s.assetImpact}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Liab:</span> <span className="font-mono" style={{ color: s.liabImpact < 0 ? "#22c55e" : "#ef4444" }}>{s.liabImpact >= 0 ? "+" : ""}{s.liabImpact}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Surplus:</span> <span className="font-mono" style={{ color: s.surplus >= 0 ? "#22c55e" : "#ef4444" }}>{s.surplus >= 0 ? "+" : ""}${s.surplus.toFixed(1)}B</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
