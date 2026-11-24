"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "rates" | "triparty" | "sec-lending" | "funding";

export default function RepoMarketsPanel() {
  const [tab, setTab] = useState<Tab>("rates");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔄</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>REPO MARKETS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg REPO</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["rates", "triparty", "sec-lending", "funding"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "sec-lending" ? "SEC LEND" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "rates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>OVERNIGHT REPO RATES</div>
            {[
              { tenor: "O/N SOFR", rate: 5.31, chg: 0.00, vol: "$2.1T", range: "5.28-5.35" },
              { tenor: "O/N Treasury GC", rate: 5.30, chg: -0.01, vol: "$1.8T", range: "5.25-5.35" },
              { tenor: "O/N Agency GC", rate: 5.28, chg: 0.01, vol: "$450B", range: "5.22-5.32" },
              { tenor: "O/N MBS GC", rate: 5.25, chg: -0.02, vol: "$320B", range: "5.18-5.30" },
              { tenor: "O/N Equity GC", rate: 5.15, chg: 0.00, vol: "$85B", range: "5.05-5.25" },
            ].map(r => (
              <div key={r.tenor} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-32 font-bold">{r.tenor}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#00e5a0" }}>{r.rate}%</span>
                <span className="font-mono w-16 text-right" style={{ color: r.chg === 0 ? "#64748b" : r.chg > 0 ? "#ef4444" : "#22c55e" }}>{r.chg >= 0 ? "+" : ""}{r.chg.toFixed(2)}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{r.vol}</span>
                <span className="font-mono text-[9px] ml-auto" style={{ color: "#64748b" }}>{r.range}</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TERM REPO CURVE</div>
            {[
              { tenor: "1 Week", rate: 5.32, spread: 1 },
              { tenor: "2 Week", rate: 5.33, spread: 2 },
              { tenor: "1 Month", rate: 5.35, spread: 4 },
              { tenor: "3 Month", rate: 5.28, spread: -3 },
              { tenor: "6 Month", rate: 5.10, spread: -21 },
              { tenor: "1 Year", rate: 4.85, spread: -46 },
            ].map(t => (
              <div key={t.tenor} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20">{t.tenor}</span>
                <span className="font-mono font-bold w-14" style={{ color: "#00e5a0" }}>{t.rate}%</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(t.rate / 5.5) * 100}%`, background: t.spread >= 0 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)" }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ color: t.spread >= 0 ? "#22c55e" : "#ef4444" }}>{t.spread >= 0 ? "+" : ""}{t.spread}bp</span>
              </div>
            ))}
          </div>
        )}

        {tab === "triparty" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TRIPARTY REPO BALANCES</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Triparty", val: "$4.8T", color: "#00e5a0" },
                { label: "Fed RRP Facility", val: "$120B", color: "#fbbf24" },
                { label: "FHLB Advances", val: "$850B", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COLLATERAL COMPOSITION</div>
            {[
              { type: "US Treasuries", pct: 62, vol: "$2.98T", haircut: "2%" },
              { type: "Agency MBS", pct: 18, vol: "$864B", haircut: "3%" },
              { type: "Agency Debt", pct: 8, vol: "$384B", haircut: "2.5%" },
              { type: "Corporate Bonds", pct: 7, vol: "$336B", haircut: "5%" },
              { type: "Equities", pct: 3, vol: "$144B", haircut: "8%" },
              { type: "Other", pct: 2, vol: "$96B", haircut: "10%" },
            ].map(c => (
              <div key={c.type} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28">{c.type}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: "rgba(99,102,241,0.5)" }} />
                </div>
                <span className="font-mono w-10 text-right">{c.pct}%</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{c.vol}</span>
                <span className="font-mono w-10 text-right" style={{ color: "#fbbf24" }}>{c.haircut}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "sec-lending" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECURITIES LENDING — HOT NAMES</div>
            {[
              { ticker: "GME", name: "GameStop", fee: 285, utilization: 98, siLoan: "$2.1B", daysToCover: 8.5 },
              { ticker: "AMC", name: "AMC Entertainment", fee: 125, utilization: 92, siLoan: "$850M", daysToCover: 4.2 },
              { ticker: "CVNA", name: "Carvana", fee: 42, utilization: 78, siLoan: "$1.5B", daysToCover: 3.8 },
              { ticker: "SMCI", name: "Super Micro", fee: 35, utilization: 85, siLoan: "$2.8B", daysToCover: 2.5 },
              { ticker: "MSTR", name: "MicroStrategy", fee: 18, utilization: 65, siLoan: "$1.2B", daysToCover: 1.8 },
              { ticker: "RIVN", name: "Rivian", fee: 12, utilization: 55, siLoan: "$980M", daysToCover: 2.1 },
            ].map(s => (
              <div key={s.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                    <span>{s.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: s.fee > 100 ? "rgba(239,68,68,0.15)" : s.fee > 30 ? "rgba(251,191,36,0.15)" : "rgba(100,116,139,0.1)",
                    color: s.fee > 100 ? "#ef4444" : s.fee > 30 ? "#fbbf24" : "#64748b",
                  }}>Fee: {s.fee}bp</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Utilization:</span> <span className="font-mono" style={{ color: s.utilization > 90 ? "#ef4444" : "#fbbf24" }}>{s.utilization}%</span></div>
                  <div><span style={{ color: "#64748b" }}>SI Loan:</span> <span className="font-mono">{s.siLoan}</span></div>
                  <div><span style={{ color: "#64748b" }}>Days to Cover:</span> <span className="font-mono">{s.daysToCover}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "funding" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MONEY MARKET FUNDING RATES</div>
            {[
              { name: "SOFR (Secured)", rate: 5.31, type: "Secured" },
              { name: "Fed Funds Effective", rate: 5.33, type: "Unsecured" },
              { name: "OBFR", rate: 5.32, type: "Broad" },
              { name: "TGCR", rate: 5.30, type: "GC Repo" },
              { name: "BGCR", rate: 5.30, type: "Broad GC" },
              { name: "EFFR Corridor", rate: 5.33, type: "Target" },
            ].map(r => (
              <div key={r.name} className="flex items-center gap-3 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-36 font-bold">{r.name}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>{r.type}</span>
                <span className="font-mono font-bold ml-auto" style={{ color: "#00e5a0" }}>{r.rate}%</span>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FED BALANCE SHEET</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total Assets", val: "$7.4T", chg: "-$42B/wk" },
                { label: "Reserves", val: "$3.2T", chg: "-$18B/wk" },
                { label: "RRP Balance", val: "$120B", chg: "-$5B/wk" },
                { label: "TGA Balance", val: "$750B", chg: "+$25B/wk" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="font-mono text-[8px]" style={{ color: s.chg.startsWith("-") ? "#ef4444" : "#22c55e" }}>{s.chg}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
