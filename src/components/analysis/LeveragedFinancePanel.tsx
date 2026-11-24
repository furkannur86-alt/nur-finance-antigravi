"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "loans" | "highyield" | "new-issue" | "distressed";

export default function LeveragedFinancePanel() {
  const [tab, setTab] = useState<Tab>("loans");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏗️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>LEVERAGED FINANCE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg LEVF</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["loans", "highyield", "new-issue", "distressed"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "highyield" ? "HY" : t === "new-issue" ? "NEW ISSUE" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "loans" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LEVERAGED LOAN INDEX — LSTA/LLI</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "LLI Level", value: "97.85", chg: "+0.12" },
                { label: "Avg Spread", value: "S+385", chg: "-8bp" },
                { label: "Default Rate", value: "1.8%", chg: "+0.2%" },
                { label: "YTD Return", value: "+8.2%", chg: "" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5">{s.value}</div>
                  {s.chg && <div className="font-mono text-[8px]" style={{ color: s.chg.startsWith("+") && !s.label.includes("Default") ? "#22c55e" : "#ef4444" }}>{s.chg}</div>}
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP LEVERAGED LOANS</div>
            {[
              { issuer: "Caesars Entertainment", spread: "S+325", floor: "0.75%", price: 99.25, rating: "B+", sector: "Gaming", covenant: "Cov-lite" },
              { issuer: "Medline Industries", spread: "S+300", floor: "0.50%", price: 99.50, rating: "B", sector: "Healthcare", covenant: "Cov-lite" },
              { issuer: "Citrix Systems", spread: "S+450", floor: "0.50%", price: 95.75, rating: "B-", sector: "Tech", covenant: "Cov-lite" },
              { issuer: "Bausch Health", spread: "S+525", floor: "0.75%", price: 92.50, rating: "CCC+", sector: "Pharma", covenant: "Maintenance" },
              { issuer: "Asurion", spread: "S+375", floor: "0.75%", price: 98.25, rating: "B", sector: "Insurance", covenant: "Cov-lite" },
              { issuer: "Finastra", spread: "S+700", floor: "1.00%", price: 88.50, rating: "CCC", sector: "Fintech", covenant: "Springing" },
              { issuer: "Epicor Software", spread: "S+350", floor: "0.50%", price: 99.00, rating: "B", sector: "Tech", covenant: "Cov-lite" },
            ].map(l => (
              <div key={l.issuer} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{l.issuer}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{l.sector}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{l.covenant}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: l.price >= 99 ? "#22c55e" : l.price >= 95 ? "#fbbf24" : "#ef4444" }}>{l.price.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Spread:</span> <span className="font-mono">{l.spread}</span></div>
                  <div><span style={{ color: "#64748b" }}>Floor:</span> <span className="font-mono">{l.floor}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rating:</span> <span className="font-mono" style={{
                    color: l.rating.startsWith("B+") || l.rating === "B" ? "#fbbf24" : "#ef4444"
                  }}>{l.rating}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "highyield" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HIGH YIELD BOND INDEX — ICE BofA</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "HY OAS", value: "345bp", color: "#fbbf24" },
                { label: "BB Spread", value: "215bp", color: "#22c55e" },
                { label: "CCC Spread", value: "825bp", color: "#ef4444" },
                { label: "YTD Return", value: "+9.8%", color: "#22c55e" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>HY SPREAD BY RATING</div>
            {[
              { rating: "BB", spread: 215, pctile: 28, bonds: 1245, default: 0.4 },
              { rating: "B", spread: 385, pctile: 35, bonds: 892, default: 1.8 },
              { rating: "CCC", spread: 825, pctile: 42, bonds: 345, default: 8.5 },
              { rating: "CC/C", spread: 2800, pctile: 65, bonds: 48, default: 32.5 },
            ].map(r => (
              <div key={r.rating} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-12" style={{ color: r.rating === "BB" ? "#22c55e" : r.rating === "B" ? "#fbbf24" : "#ef4444" }}>{r.rating}</span>
                    <span className="font-mono" style={{ color: "#fbbf24" }}>{r.spread}bp</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.pctile}th percentile (10yr)</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: r.default > 5 ? "#ef4444" : r.default > 1 ? "#fbbf24" : "#22c55e" }}>Def: {r.default}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pctile}%`, background: r.rating === "BB" ? "#22c55e" : r.rating === "B" ? "#fbbf24" : "#ef4444", opacity: 0.5 }} />
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR SPREADS</div>
            {[
              { sector: "Energy", spread: 285, chg: -15 },
              { sector: "Healthcare", spread: 365, chg: 8 },
              { sector: "Technology", spread: 325, chg: -12 },
              { sector: "Telecom", spread: 410, chg: 5 },
              { sector: "Retail", spread: 485, chg: 22 },
              { sector: "Real Estate", spread: 525, chg: -8 },
            ].map(s => (
              <div key={s.sector} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-24">{s.sector}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.spread / 600) * 100}%`, background: s.spread > 450 ? "#ef4444" : s.spread > 350 ? "#fbbf24" : "#22c55e", opacity: 0.5 }} />
                </div>
                <span className="font-mono w-16 text-right">{s.spread}bp</span>
                <span className="font-mono w-14 text-right" style={{ color: s.chg <= 0 ? "#22c55e" : "#ef4444" }}>{s.chg >= 0 ? "+" : ""}{s.chg}bp</span>
              </div>
            ))}
          </div>
        )}

        {tab === "new-issue" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NEW ISSUE PIPELINE — LEVERAGED</div>
            {[
              { issuer: "Cloud Software Group", type: "TL B", size: "$4.2B", spread: "S+375", rating: "B", status: "PRICED", use: "Refi" },
              { issuer: "Endeavor Group", type: "HY Bond", size: "$1.5B", spread: "7.25%", rating: "B+", status: "LAUNCHED", use: "M&A" },
              { issuer: "Trugreen LP", type: "TL B + HY", size: "$2.8B", spread: "S+425/8.5%", rating: "B-", status: "MARKETED", use: "LBO" },
              { issuer: "Dun & Bradstreet", type: "TL B", size: "$3.1B", spread: "S+300", rating: "BB-", status: "PRICED", use: "Refi" },
              { issuer: "RealPage Inc", type: "TL B", size: "$5.5B", spread: "S+350", rating: "B", status: "FLEX", use: "LBO" },
              { issuer: "Global Medical", type: "HY Bond", size: "$800M", spread: "8.75%", rating: "CCC+", status: "MARKETED", use: "Recap" },
            ].map(d => (
              <div key={d.issuer} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{d.issuer}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{d.type}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: d.status === "PRICED" ? "rgba(34,197,94,0.15)" : d.status === "LAUNCHED" ? "rgba(56,189,248,0.15)" : d.status === "FLEX" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: d.status === "PRICED" ? "#22c55e" : d.status === "LAUNCHED" ? "#38bdf8" : d.status === "FLEX" ? "#ef4444" : "#fbbf24",
                  }}>{d.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono">{d.size}</span></div>
                  <div><span style={{ color: "#64748b" }}>Spread:</span> <span className="font-mono">{d.spread}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rating:</span> <span className="font-mono">{d.rating}</span></div>
                  <div><span style={{ color: "#64748b" }}>Use:</span> <span>{d.use}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WEEKLY ISSUANCE ($B)</div>
            <svg viewBox="0 0 400 80" className="w-full">
              {["W-8", "W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "This"].map((w, i) => {
                const loans = [8.2, 5.5, 12.8, 6.4, 9.2, 15.5, 7.8, 11.2, 4.5];
                const bonds = [3.5, 2.8, 5.2, 4.1, 3.8, 6.2, 2.5, 4.8, 1.8];
                const lh = loans[i] * 3;
                const bh = bonds[i] * 3;
                return (
                  <g key={w}>
                    <rect x={15 + i * 42} y={68 - lh - bh} width={18} height={lh} rx={1} fill="rgba(0,229,160,0.4)" stroke="#00e5a0" strokeWidth={0.5} />
                    <rect x={15 + i * 42} y={68 - bh} width={18} height={bh} rx={1} fill="rgba(168,85,247,0.4)" stroke="#a855f7" strokeWidth={0.5} />
                    <text x={24 + i * 42} y="78" textAnchor="middle" fill="#64748b" fontSize="6">{w}</text>
                  </g>
                );
              })}
              <text x="385" y="10" fill="#00e5a0" fontSize="7" textAnchor="end">Loans</text>
              <text x="385" y="20" fill="#a855f7" fontSize="7" textAnchor="end">Bonds</text>
            </svg>
          </div>
        )}

        {tab === "distressed" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DISTRESSED & DEFAULT MONITOR</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Distressed Ratio", val: "4.2%", desc: "% of HY index >1000bp", color: "#ef4444" },
                { label: "LTM Default Rate", val: "1.8%", desc: "Par-weighted", color: "#fbbf24" },
                { label: "Recovery Rate", val: "42%", desc: "1st lien avg", color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT DEFAULTS & RESTRUCTURINGS</div>
            {[
              { company: "Envision Healthcare", date: "Nov 2026", type: "Ch.11", debt: "$7.0B", recovery: "35%", sector: "Healthcare" },
              { company: "Rite Aid Corp", date: "Oct 2026", type: "Ch.11", debt: "$3.4B", recovery: "28%", sector: "Retail" },
              { company: "Party City", date: "Oct 2026", type: "Ch.7", debt: "$1.8B", recovery: "12%", sector: "Retail" },
              { company: "Carvana Co", date: "Sep 2026", type: "Exchange", debt: "$5.7B", recovery: "65%", sector: "Auto" },
              { company: "WeWork Inc", date: "Aug 2026", type: "Ch.11", debt: "$4.2B", recovery: "18%", sector: "Real Estate" },
            ].map(d => (
              <div key={d.company} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${d.type === "Ch.7" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{d.company}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{d.date}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: d.type === "Ch.7" ? "rgba(239,68,68,0.2)" : d.type === "Ch.11" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                    color: d.type === "Ch.7" ? "#ef4444" : d.type === "Ch.11" ? "#fbbf24" : "#38bdf8",
                  }}>{d.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Debt:</span> <span className="font-mono">{d.debt}</span></div>
                  <div><span style={{ color: "#64748b" }}>Recovery:</span> <span className="font-mono" style={{ color: parseInt(d.recovery) > 40 ? "#22c55e" : parseInt(d.recovery) > 25 ? "#fbbf24" : "#ef4444" }}>{d.recovery}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sector:</span> <span>{d.sector}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
