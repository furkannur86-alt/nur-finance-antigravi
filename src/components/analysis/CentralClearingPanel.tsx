"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "margins" | "volumes" | "default-fund" | "counterparty";

export default function CentralClearingPanel() {
  const [tab, setTab] = useState<Tab>("margins");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏛️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>CENTRAL CLEARING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters CCP</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["margins", "volumes", "default-fund", "counterparty"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "default-fund" ? "DEF FUND" : t === "counterparty" ? "CPTY" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "margins" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CCP INITIAL MARGIN REQUIREMENTS</div>
            {[
              { ccp: "CME", product: "Interest Rate Swaps", im: "$85.2B", vm: "$1.2B", chg: 5.2 },
              { ccp: "LCH", product: "IRS / CDS", im: "$142.5B", vm: "$2.8B", chg: -1.5 },
              { ccp: "ICE Clear", product: "CDS Index", im: "$42.8B", vm: "$450M", chg: 8.5 },
              { ccp: "DTCC/NSCC", product: "US Equities", im: "$18.5B", vm: "$380M", chg: 2.1 },
              { ccp: "Eurex", product: "Euro Rates/Equity", im: "$35.2B", vm: "$850M", chg: -0.8 },
              { ccp: "JSCC", product: "JPY IRS", im: "$22.1B", vm: "$420M", chg: 3.5 },
            ].map(c => (
              <div key={c.ccp + c.product} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{c.ccp}</span>
                    <span>{c.product}</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: c.chg > 0 ? "#ef4444" : "#22c55e" }}>{c.chg > 0 ? "+" : ""}{c.chg}% WoW</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Initial Margin:</span> <span className="font-mono font-bold">{c.im}</span></div>
                  <div><span style={{ color: "#64748b" }}>Variation Margin:</span> <span className="font-mono">{c.vm}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "volumes" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CLEARED VOLUMES (DAILY AVG)</div>
            {[
              { product: "IRS (USD)", notional: "$2.8T", trades: "12,500", clearing: "98%", ccp: "LCH/CME" },
              { product: "IRS (EUR)", notional: "$1.5T", trades: "8,200", clearing: "97%", ccp: "LCH/Eurex" },
              { product: "CDS Index", notional: "$450B", trades: "3,800", clearing: "92%", ccp: "ICE" },
              { product: "CDS Single Name", notional: "$120B", trades: "1,200", clearing: "65%", ccp: "ICE" },
              { product: "FX Options", notional: "$380B", trades: "5,500", clearing: "45%", ccp: "LCH" },
              { product: "Equity Options", notional: "$1.2T", trades: "28M", clearing: "99%", ccp: "OCC" },
            ].map(v => (
              <div key={v.product} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{v.product}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#00e5a0" }}>{v.notional}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{v.trades}</span>
                <span className="font-mono w-10 text-right" style={{ color: parseInt(v.clearing) > 90 ? "#22c55e" : "#fbbf24" }}>{v.clearing}</span>
                <span className="text-[8px] ml-auto" style={{ color: "#64748b" }}>{v.ccp}</span>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Cleared Notional", val: "$6.5T", color: "#00e5a0" },
                { label: "Bilateral Outstanding", val: "$1.8T", color: "#ef4444" },
                { label: "Clearing Mandate Compliance", val: "96.5%", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "default-fund" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEFAULT FUND & WATERFALL</div>
            {[
              { ccp: "LCH SwapClear", defFund: "$8.5B", skinInGame: "$850M", cover2: "Passed", lastStress: "Nov 2026" },
              { ccp: "CME IRS", defFund: "$5.2B", skinInGame: "$520M", cover2: "Passed", lastStress: "Nov 2026" },
              { ccp: "ICE Clear Credit", defFund: "$4.8B", skinInGame: "$480M", cover2: "Passed", lastStress: "Oct 2026" },
              { ccp: "Eurex Clearing", defFund: "$3.2B", skinInGame: "$320M", cover2: "Passed", lastStress: "Oct 2026" },
              { ccp: "OCC", defFund: "$6.5B", skinInGame: "$650M", cover2: "Passed", lastStress: "Nov 2026" },
            ].map(d => (
              <div key={d.ccp} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{d.ccp}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{d.cover2}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Default Fund:</span> <span className="font-mono font-bold">{d.defFund}</span></div>
                  <div><span style={{ color: "#64748b" }}>Skin-in-Game:</span> <span className="font-mono">{d.skinInGame}</span></div>
                  <div><span style={{ color: "#64748b" }}>Last Stress:</span> <span>{d.lastStress}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "counterparty" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COUNTERPARTY EXPOSURE</div>
            {[
              { name: "JPMorgan Chase", exposure: "$42.5B", im: "$8.5B", rating: "AA-", cva: "12bp" },
              { name: "Goldman Sachs", exposure: "$38.2B", im: "$7.2B", rating: "A+", cva: "18bp" },
              { name: "Citigroup", exposure: "$35.8B", im: "$6.8B", rating: "A+", cva: "22bp" },
              { name: "Bank of America", exposure: "$32.1B", im: "$6.2B", rating: "AA-", cva: "15bp" },
              { name: "Deutsche Bank", exposure: "$28.5B", im: "$5.5B", rating: "A-", cva: "35bp" },
              { name: "Barclays", exposure: "$25.2B", im: "$4.8B", rating: "A", cva: "28bp" },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32 font-bold">{c.name}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#00e5a0" }}>{c.exposure}</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{c.im}</span>
                <span className="font-mono w-10 text-center" style={{ color: c.rating.startsWith("AA") ? "#22c55e" : "#fbbf24" }}>{c.rating}</span>
                <span className="font-mono w-12 text-right" style={{ color: parseInt(c.cva) > 25 ? "#ef4444" : "#fbbf24" }}>{c.cva}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
