"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const PE_FUNDS = [
  { name: "Blackstone Capital Partners IX", firm: "Blackstone", vintage: 2024, size: "$30.4B", strategy: "Buyout", irr: 18.2, moic: 1.8, dpi: 0.4, status: "INVESTING" },
  { name: "KKR Americas Fund XIII", firm: "KKR", vintage: 2023, size: "$18.5B", strategy: "Buyout", irr: 22.5, moic: 2.1, dpi: 0.6, status: "INVESTING" },
  { name: "Apollo Investment Fund X", firm: "Apollo", vintage: 2024, size: "$24.8B", strategy: "Buyout", irr: 16.8, moic: 1.6, dpi: 0.3, status: "INVESTING" },
  { name: "Warburg Pincus XIV", firm: "Warburg Pincus", vintage: 2023, size: "$16.2B", strategy: "Growth", irr: 24.2, moic: 2.4, dpi: 0.8, status: "HARVESTING" },
  { name: "Silver Lake Partners VII", firm: "Silver Lake", vintage: 2024, size: "$20.5B", strategy: "Tech Buyout", irr: 28.4, moic: 2.8, dpi: 0.5, status: "INVESTING" },
  { name: "Thoma Bravo Fund XVI", firm: "Thoma Bravo", vintage: 2023, size: "$14.8B", strategy: "Software", irr: 26.1, moic: 2.6, dpi: 0.7, status: "HARVESTING" },
];

const MA_DEALS = [
  { target: "Figma", acquirer: "Adobe", value: "$20.0B", sector: "Software", status: "COMPLETED", premium: 42.5, date: "Nov 18" },
  { target: "Hess Corp", acquirer: "Chevron", value: "$53.0B", sector: "Energy", status: "PENDING", premium: 28.8, date: "Nov 12" },
  { target: "iRobot", acquirer: "Amazon", value: "$1.7B", sector: "Consumer Tech", status: "WITHDRAWN", premium: 22.0, date: "Nov 05" },
  { target: "Juniper Networks", acquirer: "HPE", value: "$14.0B", sector: "Networking", status: "REGULATORY", premium: 32.4, date: "Oct 28" },
  { target: "US Steel", acquirer: "Nippon Steel", value: "$14.9B", sector: "Materials", status: "REGULATORY", premium: 40.2, date: "Oct 22" },
  { target: "Albertsons", acquirer: "Kroger", value: "$24.6B", sector: "Retail", status: "PENDING", premium: 32.8, date: "Oct 15" },
];

type Tab = "funds" | "deals" | "fundraising" | "exits";

export default function PrivateEquityPanel() {
  const [tab, setTab] = useState<Tab>("funds");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PE & M&A</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Bloomberg PE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["funds", "deals", "fundraising", "exits"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "funds" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>PE FUND PERFORMANCE</div>
            {PE_FUNDS.map((f, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{f.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{f.strategy}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: f.status === "INVESTING" ? "rgba(34,197,94,0.15)" : "rgba(251,191,36,0.15)",
                    color: f.status === "INVESTING" ? "#22c55e" : "#fbbf24"
                  }}>{f.status}</span>
                </div>
                <div className="grid grid-cols-6 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Size:</span> <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{f.size}</span></div>
                  <div><span style={{ color: "#64748b" }}>Vintage:</span> <span className="font-mono">{f.vintage}</span></div>
                  <div><span style={{ color: "#64748b" }}>Net IRR:</span> <span className="font-mono font-bold" style={{ color: "#22c55e" }}>{f.irr}%</span></div>
                  <div><span style={{ color: "#64748b" }}>MOIC:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{f.moic}x</span></div>
                  <div><span style={{ color: "#64748b" }}>DPI:</span> <span className="font-mono">{f.dpi}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Firm:</span> <span>{f.firm}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "deals" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>NOTABLE M&A TRANSACTIONS</div>
            {MA_DEALS.map((d, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{d.target}</span>
                    <span style={{ color: "#64748b" }}>←</span>
                    <span style={{ color: "#38bdf8" }}>{d.acquirer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{d.date}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: d.status === "COMPLETED" ? "rgba(34,197,94,0.15)" : d.status === "WITHDRAWN" ? "rgba(239,68,68,0.15)" : d.status === "REGULATORY" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.15)",
                      color: d.status === "COMPLETED" ? "#22c55e" : d.status === "WITHDRAWN" ? "#ef4444" : d.status === "REGULATORY" ? "#fbbf24" : "#38bdf8"
                    }}>{d.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Value:</span> <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{d.value}</span></div>
                  <div><span style={{ color: "#64748b" }}>Sector:</span> <span>{d.sector}</span></div>
                  <div><span style={{ color: "#64748b" }}>Premium:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{d.premium}%</span></div>
                  <div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "fundraising" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GLOBAL PE FUNDRAISING 2026</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Raised", value: "$685B", sub: "-8% YoY" },
                { label: "Funds Closed", value: "842", sub: "-12% YoY" },
                { label: "Avg Fund Size", value: "$814M", sub: "+5% YoY" },
                { label: "Dry Powder", value: "$2.8T", sub: "All-time high" },
                { label: "Buyout Share", value: "42%", sub: "of total" },
                { label: "Time to Close", value: "18.5 mo", sub: "+2.4 mo YoY" },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm mt-1" style={{ color: "#a855f7" }}>{s.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>BY STRATEGY</div>
            {[
              { strategy: "Buyout", raised: "$288B", funds: 185, color: "#a855f7" },
              { strategy: "Growth Equity", raised: "$142B", funds: 220, color: "#22c55e" },
              { strategy: "Venture Capital", raised: "$118B", funds: 285, color: "#38bdf8" },
              { strategy: "Secondaries", raised: "$65B", funds: 48, color: "#f97316" },
              { strategy: "Infra / Real Assets", raised: "$72B", funds: 104, color: "#fbbf24" },
            ].map(s => (
              <div key={s.strategy} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="w-32">{s.strategy}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(parseInt(s.raised.replace(/[^0-9]/g, "")) / 288) * 100}%`, background: s.color, opacity: 0.6 }} />
                </div>
                <span className="font-mono w-16 text-right" style={{ color: s.color }}>{s.raised}</span>
                <span className="font-mono text-[9px] w-14 text-right" style={{ color: "#64748b" }}>{s.funds} funds</span>
              </div>
            ))}
          </div>
        )}

        {tab === "exits" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PE EXIT ACTIVITY</div>
            {[
              { company: "Medline Industries", sponsor: "Blackstone/Carlyle", entryYear: 2021, exitType: "Secondary", exitValue: "$34B", moic: 1.8, holdPeriod: "5 yr" },
              { company: "Endeavor", sponsor: "Silver Lake", entryYear: 2019, exitType: "IPO", exitValue: "$18B", moic: 3.2, holdPeriod: "7 yr" },
              { company: "Worldpay", sponsor: "GTCR/Apollo", entryYear: 2023, exitType: "Trade Sale", exitValue: "$22B", moic: 2.1, holdPeriod: "3 yr" },
              { company: "Cloudera", sponsor: "CD&R/KKR", entryYear: 2021, exitType: "Trade Sale", exitValue: "$8.8B", moic: 1.6, holdPeriod: "5 yr" },
              { company: "Citrix", sponsor: "Vista/Evergreen Coast", entryYear: 2022, exitType: "Secondary", exitValue: "$16.5B", moic: 1.4, holdPeriod: "4 yr" },
            ].map((e, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{e.company}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>{e.exitType}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{e.exitValue}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Sponsor:</span> <span>{e.sponsor}</span></div>
                  <div><span style={{ color: "#64748b" }}>MOIC:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{e.moic}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Hold:</span> <span className="font-mono">{e.holdPeriod}</span></div>
                  <div><span style={{ color: "#64748b" }}>Entry:</span> <span className="font-mono">{e.entryYear}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>EXIT VOLUME BY TYPE (2026 YTD)</div>
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              {[
                { type: "Trade Sale", pct: 42, value: "$285B" },
                { type: "Secondary / GP-led", pct: 28, value: "$190B" },
                { type: "IPO", pct: 18, value: "$122B" },
                { type: "Recapitalization", pct: 12, value: "$82B" },
              ].map(e => (
                <div key={e.type} className="flex items-center gap-2 mb-2">
                  <span className="w-36 text-[9px]">{e.type}</span>
                  <div className="flex-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: "#a855f7", opacity: 0.6 }} />
                  </div>
                  <span className="font-mono w-14 text-right text-[9px]" style={{ color: "#a855f7" }}>{e.value}</span>
                  <span className="font-mono w-10 text-right text-[9px]" style={{ color: "#64748b" }}>{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
