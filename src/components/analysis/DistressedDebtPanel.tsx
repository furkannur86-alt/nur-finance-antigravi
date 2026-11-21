"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "watchlist" | "bankruptcies" | "recovery" | "cds";

export default function DistressedDebtPanel() {
  const [tab, setTab] = useState<Tab>("watchlist");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">💀</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>DISTRESSED DEBT</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Bloomberg DDIS</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["watchlist", "bankruptcies", "recovery", "cds"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "cds" ? "CDS" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "HY DISTRESSED", value: "$42.8B", color: "#ef4444" },
          { label: "DEFAULT RATE", value: "3.2%", color: "#fbbf24" },
          { label: "RECOVERY AVG", value: "38.5¢", color: "#38bdf8" },
          { label: "CH.11 FILINGS", value: "142 YTD", color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "watchlist" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>DISTRESSED BOND WATCHLIST (Trading below 80¢)</div>
            {[
              { issuer: "Rite Aid Corp", bond: "7.5% 2027", price: 12.5, ytw: 85.4, rating: "D", status: "CH.11", sector: "Retail" },
              { issuer: "Envision Healthcare", bond: "8.75% 2026", price: 28.0, ytw: 42.8, rating: "D", status: "CH.11", sector: "Healthcare" },
              { issuer: "Carvana Co", bond: "5.625% 2028", price: 68.5, ytw: 14.2, rating: "CCC+", status: "STRESSED", sector: "Auto" },
              { issuer: "WeWork Inc", bond: "7.875% 2027", price: 5.2, ytw: 0, rating: "D", status: "LIQUIDATING", sector: "Real Estate" },
              { issuer: "Bausch Health", bond: "6.125% 2029", price: 42.0, ytw: 22.5, rating: "CCC", status: "STRESSED", sector: "Pharma" },
              { issuer: "Lumen Technologies", bond: "5.625% 2028", price: 55.0, ytw: 18.4, rating: "CCC-", status: "DISTRESSED", sector: "Telecom" },
              { issuer: "Spirit Airlines", bond: "8.0% 2027", price: 22.5, ytw: 48.2, rating: "D", status: "CH.11", sector: "Airlines" },
              { issuer: "Tupperware", bond: "4.75% 2026", price: 8.0, ytw: 0, rating: "D", status: "LIQUIDATING", sector: "Consumer" },
            ].map((b, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${b.status === "CH.11" || b.status === "LIQUIDATING" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.1)"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: b.price < 20 ? "#ef4444" : "#fbbf24" }}>{b.issuer}</span>
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{b.rating}</span>
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                      background: b.status === "LIQUIDATING" ? "rgba(239,68,68,0.2)" : b.status === "CH.11" ? "rgba(239,68,68,0.15)" : b.status === "DISTRESSED" ? "rgba(251,191,36,0.15)" : "rgba(249,115,22,0.15)",
                      color: b.status === "LIQUIDATING" ? "#ef4444" : b.status === "CH.11" ? "#ef4444" : b.status === "DISTRESSED" ? "#fbbf24" : "#f97316"
                    }}>{b.status}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{b.sector}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Bond:</span> <span className="font-mono">{b.bond}</span></div>
                  <div><span style={{ color: "#64748b" }}>Price:</span> <span className="font-mono font-bold" style={{ color: b.price < 20 ? "#ef4444" : "#fbbf24" }}>{b.price}¢</span></div>
                  <div><span style={{ color: "#64748b" }}>YTW:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{b.ytw > 0 ? `${b.ytw}%` : "N/A"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "bankruptcies" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT CHAPTER 11 FILINGS</div>
            {[
              { company: "Spirit Airlines", filingDate: "Nov 2024", liabilities: "$7.8B", assets: "$5.2B", debtor: "Yes", judge: "S.D. Texas", status: "Plan Confirmed" },
              { company: "Rite Aid", filingDate: "Oct 2023", liabilities: "$8.6B", assets: "$4.1B", debtor: "No", judge: "D.N.J.", status: "Emerged" },
              { company: "Yellow Corp", filingDate: "Aug 2023", liabilities: "$2.5B", assets: "$1.8B", debtor: "No", judge: "D. Del.", status: "Liquidating" },
              { company: "Bed Bath & Beyond", filingDate: "Apr 2023", liabilities: "$5.2B", assets: "$1.5B", debtor: "No", judge: "D.N.J.", status: "Wound Down" },
              { company: "SVB Financial", filingDate: "Mar 2023", liabilities: "$3.4B", assets: "$2.1B", debtor: "No", judge: "S.D.N.Y.", status: "Plan Confirmed" },
            ].map(c => (
              <div key={c.company} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#ef4444" }}>{c.company}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: c.status === "Emerged" ? "rgba(34,197,94,0.15)" : c.status === "Plan Confirmed" ? "rgba(56,189,248,0.15)" : "rgba(239,68,68,0.15)",
                    color: c.status === "Emerged" ? "#22c55e" : c.status === "Plan Confirmed" ? "#38bdf8" : "#ef4444"
                  }}>{c.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Filed:</span> <span className="font-mono">{c.filingDate}</span></div>
                  <div><span style={{ color: "#64748b" }}>Liab:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{c.liabilities}</span></div>
                  <div><span style={{ color: "#64748b" }}>Assets:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{c.assets}</span></div>
                  <div><span style={{ color: "#64748b" }}>Court:</span> <span className="font-mono">{c.judge}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recovery" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECOVERY RATE ANALYSIS</div>
            {[
              { seniority: "1st Lien Secured", avgRecovery: 68.5, median: 72.0, range: "45-95", count: 85 },
              { seniority: "2nd Lien Secured", avgRecovery: 42.8, median: 38.5, range: "15-72", count: 42 },
              { seniority: "Senior Unsecured", avgRecovery: 38.2, median: 35.0, range: "8-65", count: 128 },
              { seniority: "Subordinated", avgRecovery: 22.5, median: 18.0, range: "0-48", count: 65 },
              { seniority: "Equity", avgRecovery: 4.2, median: 0, range: "0-25", count: 148 },
            ].map(r => (
              <div key={r.seniority} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{r.seniority}</span>
                  <span className="font-mono font-bold" style={{ color: r.avgRecovery > 50 ? "#22c55e" : r.avgRecovery > 30 ? "#fbbf24" : "#ef4444" }}>{r.avgRecovery}¢</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex-1 h-3 rounded-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="absolute h-full rounded-full" style={{ left: 0, width: `${r.avgRecovery}%`, background: r.avgRecovery > 50 ? "#22c55e" : r.avgRecovery > 30 ? "#fbbf24" : "#ef4444", opacity: 0.5 }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Median:</span> <span className="font-mono">{r.median}¢</span></div>
                  <div><span style={{ color: "#64748b" }}>Range:</span> <span className="font-mono">{r.range}¢</span></div>
                  <div><span style={{ color: "#64748b" }}>Sample:</span> <span className="font-mono">{r.count}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "cds" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MOST WIDENING CDS (5Y)</div>
            {[
              { entity: "Lumen Technologies", spread: 2850, change: 420, sector: "Telecom" },
              { entity: "Bausch Health", spread: 1850, change: 185, sector: "Pharma" },
              { entity: "Carvana Co", spread: 580, change: 125, sector: "Auto Retail" },
              { entity: "AMC Entertainment", spread: 1420, change: 95, sector: "Entertainment" },
              { entity: "Dish Network", spread: 2200, change: 280, sector: "Media" },
              { entity: "Community Health", spread: 1680, change: 145, sector: "Healthcare" },
            ].map(c => (
              <div key={c.entity} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.entity}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{c.sector}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span style={{ color: "#ef4444" }}>{c.spread}bp</span>
                  <span style={{ color: "#ef4444" }}>+{c.change}bp</span>
                  <span className="text-[8px]" style={{ color: c.spread > 2000 ? "#ef4444" : c.spread > 1000 ? "#fbbf24" : "#f97316" }}>
                    {c.spread > 2000 ? "DISTRESSED" : c.spread > 1000 ? "STRESSED" : "WATCH"}
                  </span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CDX HY & ITRAXX XOVER</div>
            {[
              { index: "CDX HY 5Y", spread: 385, change: -12, basis: "+15bp vs intrinsic" },
              { index: "CDX HY 3Y", spread: 245, change: -8, basis: "+8bp vs intrinsic" },
              { index: "iTraxx Xover 5Y", spread: 342, change: -18, basis: "+12bp vs intrinsic" },
              { index: "CDX EM 5Y", spread: 185, change: 5, basis: "-5bp vs intrinsic" },
            ].map(i => (
              <div key={i.index} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-bold">{i.index}</span>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span style={{ color: "#fbbf24" }}>{i.spread}bp</span>
                  <span style={{ color: i.change >= 0 ? "#ef4444" : "#22c55e" }}>{i.change >= 0 ? "+" : ""}{i.change}bp</span>
                  <span style={{ color: "#64748b" }}>{i.basis}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
