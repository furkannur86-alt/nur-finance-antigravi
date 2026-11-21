"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const RATES = [
  { name: "SOFR", rate: 5.31, change: 0.00, volume: "$2.1T", type: "Overnight" },
  { name: "Fed Funds Effective", rate: 5.33, change: 0.00, volume: "$98B", type: "Overnight" },
  { name: "SOFR 30-Day Avg", rate: 5.32, change: -0.01, volume: "—", type: "Term" },
  { name: "SOFR 90-Day Avg", rate: 5.33, change: 0.00, volume: "—", type: "Term" },
  { name: "GC Repo (TSY)", rate: 5.28, change: -0.02, volume: "$1.4T", type: "Overnight" },
  { name: "GC Repo (Agency)", rate: 5.30, change: -0.01, volume: "$380B", type: "Overnight" },
  { name: "GC Repo (MBS)", rate: 5.32, change: 0.00, volume: "$285B", type: "Overnight" },
  { name: "DTCC GCF (TSY)", rate: 5.29, change: -0.01, volume: "$210B", type: "Overnight" },
  { name: "OBFR", rate: 5.32, change: 0.00, volume: "$165B", type: "Overnight" },
  { name: "€STR", rate: 3.65, change: 0.00, volume: "€42B", type: "Overnight" },
  { name: "SONIA", rate: 5.20, change: 0.00, volume: "£52B", type: "Overnight" },
  { name: "TONAR", rate: 0.07, change: 0.01, volume: "¥8.5T", type: "Overnight" },
];

type Tab = "rates" | "tbills" | "cp" | "reserves";

export default function RepoMoneyMarketPanel() {
  const [tab, setTab] = useState<Tab>("rates");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏧</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>REPO & MONEY MARKETS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg BTMM</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["rates", "tbills", "cp", "reserves"] as Tab[]).map(t => (
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
          { label: "SOFR", value: "5.31%", color: "#38bdf8" },
          { label: "FED FUNDS", value: "5.33%", color: "#22c55e" },
          { label: "RRP USAGE", value: "$142B", color: "#fbbf24" },
          { label: "RESERVES", value: "$3.28T", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "rates" && (
          <div className="space-y-1">
            <div className="grid grid-cols-5 gap-2 text-[8px] font-bold px-2 py-1" style={{ color: "#64748b" }}>
              <span>BENCHMARK</span><span className="text-right">RATE</span><span className="text-right">CHG</span>
              <span className="text-right">VOLUME</span><span>TYPE</span>
            </div>
            {RATES.map((r, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 px-2 py-1.5 rounded items-center"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="font-bold" style={{ color: "#00e5a0" }}>{r.name}</span>
                <span className="font-mono text-right font-bold" style={{ color: "#38bdf8" }}>{r.rate.toFixed(2)}%</span>
                <span className="font-mono text-right" style={{ color: r.change === 0 ? "#64748b" : r.change > 0 ? "#22c55e" : "#ef4444" }}>
                  {r.change === 0 ? "unch" : `${r.change > 0 ? "+" : ""}${r.change.toFixed(2)}`}
                </span>
                <span className="font-mono text-right text-[9px]" style={{ color: "#94a3b8" }}>{r.volume}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{r.type}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "tbills" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>US T-BILL RATES</div>
            {[
              { maturity: "4-Week", cusip: "912797...", yield: 5.28, discount: 5.20, price: 99.60, issued: "$80B", date: "Nov 19" },
              { maturity: "8-Week", cusip: "912797...", yield: 5.30, discount: 5.19, price: 99.20, issued: "$75B", date: "Nov 19" },
              { maturity: "13-Week", cusip: "912797...", yield: 5.26, discount: 5.10, price: 98.72, issued: "$85B", date: "Nov 18" },
              { maturity: "17-Week", cusip: "912797...", yield: 5.24, discount: 5.06, price: 98.35, issued: "$60B", date: "Nov 18" },
              { maturity: "26-Week", cusip: "912797...", yield: 5.18, discount: 4.95, price: 97.52, issued: "$70B", date: "Nov 18" },
              { maturity: "52-Week", cusip: "912797...", yield: 4.95, discount: 4.68, price: 95.32, issued: "$50B", date: "Nov 14" },
            ].map((t, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="grid grid-cols-7 gap-2 text-[9px] items-center">
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{t.maturity}</span>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>{t.yield.toFixed(2)}%</span>
                  <span className="font-mono" style={{ color: "#94a3b8" }}>Disc: {t.discount.toFixed(2)}%</span>
                  <span className="font-mono">{t.price.toFixed(2)}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{t.issued}</span>
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{t.date}</span>
                  <span className="font-mono text-[8px]" style={{ color: "#64748b" }}>{t.cusip}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>UPCOMING AUCTIONS</div>
            {[
              { date: "Nov 21", maturity: "4-Week", amount: "$80B", time: "11:30 AM" },
              { date: "Nov 21", maturity: "8-Week", amount: "$75B", time: "11:30 AM" },
              { date: "Nov 25", maturity: "13-Week", amount: "$85B", time: "11:30 AM" },
              { date: "Nov 25", maturity: "26-Week", amount: "$70B", time: "11:30 AM" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.date}</span>
                  <span className="font-bold">{a.maturity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{a.amount}</span>
                  <span className="text-[9px]" style={{ color: "#64748b" }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "cp" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMMERCIAL PAPER RATES</div>
            {[
              { issuer: "AA Financial CP", tenor: "1M", rate: 5.35, spread: 4 },
              { issuer: "AA Financial CP", tenor: "3M", rate: 5.38, spread: 5 },
              { issuer: "AA Non-Financial CP", tenor: "1M", rate: 5.32, spread: 1 },
              { issuer: "AA Non-Financial CP", tenor: "3M", rate: 5.34, spread: 1 },
              { issuer: "A2/P2 Non-Financial", tenor: "1M", rate: 5.55, spread: 24 },
              { issuer: "A2/P2 Non-Financial", tenor: "3M", rate: 5.62, spread: 29 },
              { issuer: "ABCP (AA)", tenor: "1M", rate: 5.38, spread: 7 },
              { issuer: "ABCP (AA)", tenor: "3M", rate: 5.42, spread: 9 },
            ].map((c, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 p-2 rounded items-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ color: "#e2e8f0" }}>{c.issuer}</span>
                <span className="font-mono text-center">{c.tenor}</span>
                <span className="font-mono text-right" style={{ color: "#38bdf8" }}>{c.rate.toFixed(2)}%</span>
                <span className="font-mono text-right text-[9px]" style={{ color: c.spread > 10 ? "#fbbf24" : "#64748b" }}>+{c.spread}bp vs SOFR</span>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>MONEY MARKET FUND FLOWS (WEEKLY)</div>
            {[
              { type: "Prime MMF", aum: "$1.28T", flow: "+$8.4B", yield: "5.28%" },
              { type: "Government MMF", aum: "$4.52T", flow: "+$22.1B", yield: "5.24%" },
              { type: "Tax-Exempt MMF", aum: "$118B", flow: "-$1.2B", yield: "3.42%" },
            ].map(f => (
              <div key={f.type} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-bold">{f.type}</span>
                <div className="flex items-center gap-4 text-[9px] font-mono">
                  <span style={{ color: "#94a3b8" }}>AUM: {f.aum}</span>
                  <span style={{ color: f.flow.startsWith("+") ? "#22c55e" : "#ef4444" }}>{f.flow}</span>
                  <span style={{ color: "#38bdf8" }}>{f.yield}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "reserves" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FED BALANCE SHEET & RESERVES</div>
            {[
              { label: "Total Assets", value: "$7.42T", change: "-$18B/wk" },
              { label: "Bank Reserves", value: "$3.28T", change: "-$12B/wk" },
              { label: "RRP Facility", value: "$142B", change: "-$8B/wk" },
              { label: "TGA Balance", value: "$785B", change: "+$42B/wk" },
              { label: "BTFP Outstanding", value: "$0B", change: "Closed Mar 2025" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ color: "#e2e8f0" }}>{r.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold" style={{ color: "#38bdf8" }}>{r.value}</span>
                  <span className="font-mono text-[9px]" style={{ color: r.change.includes("+") ? "#22c55e" : r.change.includes("-") ? "#ef4444" : "#64748b" }}>
                    {r.change}
                  </span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>RESERVES ADEQUACY GAUGE</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-4 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #22c55e, #fbbf24, #ef4444)" }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: "65%" }} />
                </div>
              </div>
              <div className="flex justify-between text-[8px]" style={{ color: "#64748b" }}>
                <span>$2.5T (Scarce)</span>
                <span style={{ color: "#fbbf24" }}>$3.28T (Current)</span>
                <span>$4.5T (Ample)</span>
              </div>
              <div className="text-[9px] mt-2 text-center" style={{ color: "#fbbf24" }}>
                Reserves trending toward &quot;ample-to-adequate&quot; boundary — QT pace may need adjustment
              </div>
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>GLOBAL CENTRAL BANK RATES</div>
            {[
              { bank: "🇺🇸 Fed", rate: "5.25-5.50%", next: "Dec 18", expectation: "-25bp (68%)" },
              { bank: "🇪🇺 ECB", rate: "4.00%", next: "Dec 12", expectation: "-25bp (82%)" },
              { bank: "🇬🇧 BoE", rate: "5.25%", next: "Dec 19", expectation: "Hold (75%)" },
              { bank: "🇯🇵 BoJ", rate: "0.10%", next: "Dec 19", expectation: "+10bp (45%)" },
              { bank: "🇨🇳 PBoC", rate: "3.45%", next: "Dec 20", expectation: "-10bp (55%)" },
            ].map(b => (
              <div key={b.bank} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{b.bank}</span>
                <div className="flex items-center gap-4 text-[9px] font-mono">
                  <span style={{ color: "#38bdf8" }}>{b.rate}</span>
                  <span style={{ color: "#64748b" }}>Next: {b.next}</span>
                  <span style={{ color: "#fbbf24" }}>{b.expectation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
