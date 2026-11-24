"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "overview" | "margins" | "defaults" | "waterfall";

export default function CentralCounterpartyPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CCP RISK MONITOR</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>DTCC/LCH</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["overview", "margins", "defaults", "waterfall"] as Tab[]).map(t => (
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
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL CCP OVERVIEW</div>
            {[
              { name: "LCH Ltd (SwapClear)", notional: "$350T", margin: "$185B", members: 55, rating: "AA+", status: "NORMAL" },
              { name: "CME Clearing", notional: "$1,200T", margin: "$142B", members: 48, rating: "AA+", status: "NORMAL" },
              { name: "ICE Clear Europe", notional: "$85T", margin: "$72B", members: 38, rating: "AA", status: "NORMAL" },
              { name: "DTCC/NSCC", notional: "$2,800T", margin: "$18B", members: 180, rating: "AA+", status: "ELEVATED" },
              { name: "Eurex Clearing", notional: "$28T", margin: "$58B", members: 42, rating: "AA", status: "NORMAL" },
              { name: "JSCC", notional: "$120T", margin: "$22B", members: 35, rating: "AA-", status: "NORMAL" },
            ].map(c => (
              <div key={c.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.name}</span>
                    <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                      background: c.status === "NORMAL" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                      color: c.status === "NORMAL" ? "#22c55e" : "#fbbf24",
                    }}>{c.status}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{c.rating}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Notional:</span> <span className="font-mono">{c.notional}</span></div>
                  <div><span style={{ color: "#64748b" }}>Margin:</span> <span className="font-mono">{c.margin}</span></div>
                  <div><span style={{ color: "#64748b" }}>Members:</span> <span className="font-mono">{c.members}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "margins" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>INITIAL MARGIN REQUIREMENTS</div>
            {[
              { product: "IRS (USD)", im: 2.5, vm: 0.8, addon: 0.3, total: 3.6, chg: 0.2 },
              { product: "IRS (EUR)", im: 2.2, vm: 0.6, addon: 0.2, total: 3.0, chg: -0.1 },
              { product: "CDS Index", im: 8.5, vm: 2.2, addon: 1.5, total: 12.2, chg: 1.5 },
              { product: "Equity Options", im: 12.0, vm: 3.5, addon: 2.0, total: 17.5, chg: 0.8 },
              { product: "FX Forwards", im: 1.8, vm: 0.5, addon: 0.2, total: 2.5, chg: 0.1 },
              { product: "Commodity Futures", im: 8.0, vm: 2.8, addon: 1.2, total: 12.0, chg: -0.5 },
            ].map(p => (
              <div key={p.product} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{p.product}</span>
                <span className="font-mono w-12 text-right">IM:{p.im}%</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>VM:{p.vm}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#fbbf24" }}>Tot:{p.total}%</span>
                <span className="font-mono w-14 text-right" style={{ color: p.chg >= 0 ? "#ef4444" : "#22c55e" }}>{p.chg >= 0 ? "+" : ""}{p.chg}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MARGIN CALL HISTORY — 30D</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Calls", value: "2,450", color: "#e2e8f0" },
                { label: "Avg Call Size", value: "$85M", color: "#fbbf24" },
                { label: "Max Call", value: "$2.1B", color: "#ef4444" },
                { label: "Intraday Calls", value: "128", color: "#ef4444" },
                { label: "Cover 2 Breaches", value: "0", color: "#22c55e" },
                { label: "Avg Cover Time", value: "2.5hr", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "defaults" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEFAULT FUND ADEQUACY</div>
            {[
              { ccp: "LCH SwapClear", fund: 8.5, cover1: 12.2, cover2: 8.8, stressed: 6.5, adequate: true },
              { ccp: "CME Clearing", fund: 12.2, cover1: 15.8, cover2: 11.5, stressed: 8.2, adequate: true },
              { ccp: "ICE Clear EU", fund: 5.8, cover1: 8.5, cover2: 6.2, stressed: 4.5, adequate: true },
              { ccp: "DTCC/NSCC", fund: 3.5, cover1: 5.2, cover2: 3.8, stressed: 2.8, adequate: false },
            ].map(d => (
              <div key={d.ccp} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${d.adequate ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.2)"}`,
              }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{d.ccp}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: d.adequate ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    color: d.adequate ? "#22c55e" : "#ef4444",
                  }}>{d.adequate ? "ADEQUATE" : "WATCH"}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Fund:</span> <span className="font-mono">${d.fund}B</span></div>
                  <div><span style={{ color: "#64748b" }}>Cover-1:</span> <span className="font-mono">{d.cover1}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Cover-2:</span> <span className="font-mono" style={{ color: d.cover2 >= 5 ? "#22c55e" : "#fbbf24" }}>{d.cover2}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Stressed:</span> <span className="font-mono" style={{ color: d.stressed >= 5 ? "#22c55e" : "#ef4444" }}>{d.stressed}x</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HISTORICAL DEFAULTS</div>
            {[
              { year: "2023", member: "Unnamed HF", ccp: "LCH", loss: 0, contained: true, desc: "Orderly wind-down, no loss to default fund" },
              { year: "2018", member: "Nasdaq Clearing", ccp: "Nasdaq", loss: 0.12, contained: true, desc: "Power trader default — €114M loss to default fund" },
              { year: "2011", member: "MF Global", ccp: "CME", loss: 0, contained: true, desc: "Positions transferred, no CCP loss" },
            ].map(d => (
              <div key={d.year} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold">{d.year} — {d.member}</span>
                  <span className="font-mono text-[9px]" style={{ color: d.loss > 0 ? "#ef4444" : "#22c55e" }}>
                    {d.loss > 0 ? `$${d.loss}B loss` : "No loss"}
                  </span>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{d.desc}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "waterfall" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEFAULT WATERFALL STRUCTURE</div>
            {[
              { layer: "1. Defaulter's Initial Margin", amount: "$2.5B", pct: 100, color: "#22c55e" },
              { layer: "2. Defaulter's Default Fund Contribution", amount: "$850M", pct: 100, color: "#22c55e" },
              { layer: "3. CCP's Own Resources (Skin-in-the-Game)", amount: "$500M", pct: 100, color: "#38bdf8" },
              { layer: "4. Non-defaulting Members' Default Fund", amount: "$8.5B", pct: 85, color: "#fbbf24" },
              { layer: "5. CCP's Additional Resources", amount: "$1.2B", pct: 0, color: "#64748b" },
              { layer: "6. Assessment Powers (Cash Calls)", amount: "$4.0B", pct: 0, color: "#64748b" },
              { layer: "7. Resolution / Government Backstop", amount: "Unlimited", pct: 0, color: "#ef4444" },
            ].map(l => (
              <div key={l.layer} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[10px]">{l.layer}</span>
                  <span className="font-mono" style={{ color: l.color }}>{l.amount}</span>
                </div>
                {l.pct > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${l.pct}%`, background: l.color, opacity: 0.5 }} />
                    </div>
                    <span className="font-mono text-[8px]" style={{ color: l.color }}>{l.pct}% utilized</span>
                  </div>
                )}
              </div>
            ))}

            <div className="p-2.5 rounded" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="text-[9px] font-bold mb-1" style={{ color: "#22c55e" }}>CURRENT STATUS: HEALTHY</div>
              <div className="text-[9px]" style={{ color: "#94a3b8" }}>All major CCPs meeting CPMI-IOSCO Cover-2 requirement. No active default management processes.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
