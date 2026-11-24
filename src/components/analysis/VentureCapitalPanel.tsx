"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "deals" | "funds" | "exits" | "sectors";

export default function VentureCapitalPanel() {
  const [tab, setTab] = useState<Tab>("deals");

  const deals = [
    { company: "Anthropic", round: "Series D", amount: "$8.0B", valuation: "$60B", lead: "Google / Lightspeed", sector: "AI", stage: "Late" },
    { company: "Databricks", round: "Series J", amount: "$5.2B", valuation: "$62B", lead: "Thrive Capital", sector: "Data/AI", stage: "Late" },
    { company: "Anduril", round: "Series F", amount: "$3.5B", valuation: "$28B", lead: "Founders Fund", sector: "Defense Tech", stage: "Late" },
    { company: "Wiz", round: "Series D", amount: "$1.0B", valuation: "$12B", lead: "Andreessen Horowitz", sector: "Cybersecurity", stage: "Late" },
    { company: "Varda Space", round: "Series B", amount: "$450M", valuation: "$3.5B", lead: "Khosla Ventures", sector: "Space", stage: "Growth" },
    { company: "Cohere", round: "Series D", amount: "$500M", valuation: "$5.5B", lead: "PSP Investments", sector: "AI", stage: "Growth" },
    { company: "Wayve", round: "Series C", amount: "$1.05B", valuation: "$4.2B", lead: "SoftBank", sector: "Autonomous", stage: "Growth" },
    { company: "Saronic", round: "Series B", amount: "$600M", valuation: "$4.0B", lead: "a16z", sector: "Defense Tech", stage: "Growth" },
    { company: "ElevenLabs", round: "Series C", amount: "$250M", valuation: "$3.3B", lead: "ICONIQ Growth", sector: "AI", stage: "Growth" },
    { company: "Cursor", round: "Series B", amount: "$105M", valuation: "$2.5B", lead: "Thrive Capital", sector: "Dev Tools", stage: "Early" },
  ];

  const topFunds = [
    { name: "Andreessen Horowitz", aum: "$42.4B", vintage: "Fund VIII", irr: 28.5, deployed: 65 },
    { name: "Sequoia Capital", aum: "$38.0B", vintage: "Global XVI", irr: 32.1, deployed: 58 },
    { name: "Founders Fund", aum: "$22.0B", vintage: "Fund IX", irr: 35.2, deployed: 42 },
    { name: "Lightspeed", aum: "$18.5B", vintage: "Fund V", irr: 24.8, deployed: 72 },
    { name: "Khosla Ventures", aum: "$15.2B", vintage: "KV VIII", irr: 22.5, deployed: 55 },
    { name: "General Catalyst", aum: "$14.8B", vintage: "Fund XIV", irr: 20.1, deployed: 68 },
    { name: "Accel Partners", aum: "$12.5B", vintage: "XV Growth", irr: 26.3, deployed: 60 },
    { name: "Thrive Capital", aum: "$10.0B", vintage: "Fund VII", irr: 38.5, deployed: 48 },
  ];

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🚀</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>VENTURE CAPITAL</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>PitchBook VC</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["deals", "funds", "exits", "sectors"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "deals" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "2024 VC Funding", val: "$285B", sub: "+22% YoY" },
                { label: "Mega Rounds ($500M+)", val: "48", sub: "AI-dominated" },
                { label: "Avg Pre-Money (Late)", val: "$8.2B", sub: "+35% YoY" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#22c55e" }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NOTABLE RECENT ROUNDS</div>
            {deals.map(d => (
              <div key={d.company} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{d.company}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{d.round}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{d.amount}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>Val: {d.valuation} | {d.lead}</span>
                  <div className="flex gap-2">
                    <span className="px-1 py-0.5 rounded text-[8px]" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{d.sector}</span>
                    <span className="px-1 py-0.5 rounded text-[8px]" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>{d.stage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "funds" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP VC FIRMS — LATEST FUND</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Firm", "AUM", "Fund", "IRR", "Deployed"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topFunds.map(f => (
                    <tr key={f.name} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{f.name}</td>
                      <td className="px-2 py-1.5 font-mono">{f.aum}</td>
                      <td className="px-2 py-1.5">{f.vintage}</td>
                      <td className="px-2 py-1.5 font-mono font-bold" style={{ color: f.irr >= 30 ? "#22c55e" : f.irr >= 20 ? "#fbbf24" : "#94a3b8" }}>{f.irr.toFixed(1)}%</td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div className="h-full rounded-full" style={{ width: `${f.deployed}%`, background: "#00e5a0" }} />
                          </div>
                          <span className="font-mono">{f.deployed}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FUNDRAISING ENVIRONMENT</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "2024 VC Fundraising", val: "$118B", chg: "+15% YoY" },
                { label: "Avg Fund Size", val: "$425M", chg: "+28% YoY" },
                { label: "Dry Powder", val: "$312B", chg: "Record high" },
                { label: "Time to Close", val: "14 months", chg: "-2 months" },
              ].map(m => (
                <div key={m.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="font-mono font-bold">{m.val}</div>
                  <div className="text-[8px]" style={{ color: "#22c55e" }}>{m.chg}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "exits" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VC-BACKED EXITS — 2024</div>
            {[
              { company: "Reddit", type: "IPO", value: "$8.6B", multiple: "12.5x", investors: "Sequoia, a16z, Fidelity" },
              { company: "Rubrik", type: "IPO", value: "$5.6B", multiple: "8.2x", investors: "Lightspeed, Khosla, Greylock" },
              { company: "Astera Labs", type: "IPO", value: "$5.2B", multiple: "15.0x", investors: "Sutter Hill, Fidelity" },
              { company: "Hashicorp", type: "M&A (IBM)", value: "$6.4B", multiple: "6.5x", investors: "GGV, Mayfield, IVP" },
              { company: "Juniper Networks", type: "M&A (HPE)", value: "$14.0B", multiple: "4.2x", investors: "New Enterprise, Ericsson" },
              { company: "Figma", type: "IPO Expected", value: "$12.5B est.", multiple: "25.0x", investors: "Index, a16z, Sequoia" },
            ].map(e => (
              <div key={e.company} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{e.company}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px]" style={{
                      background: e.type === "IPO" ? "rgba(34,197,94,0.15)" : e.type.startsWith("M&A") ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                      color: e.type === "IPO" ? "#22c55e" : e.type.startsWith("M&A") ? "#38bdf8" : "#fbbf24"
                    }}>{e.type}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{e.value}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{e.investors}</span>
                  <span className="font-mono font-bold" style={{ color: "#a855f7" }}>{e.multiple}</span>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "IPO Count", val: "32", sub: "+85% YoY" },
                { label: "M&A Count", val: "1,245", sub: "+12% YoY" },
                { label: "Avg Exit Multiple", val: "8.5x", sub: "vs 6.2x 2023" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#22c55e" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "sectors" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>VC FUNDING BY SECTOR — 2024</div>
            {[
              { sector: "Artificial Intelligence", funding: "$98B", deals: 1250, share: 34.4, growth: "+185%" },
              { sector: "Fintech", funding: "$38B", deals: 820, share: 13.3, growth: "+12%" },
              { sector: "Cybersecurity", funding: "$22B", deals: 410, share: 7.7, growth: "+28%" },
              { sector: "Defense Tech", funding: "$18B", deals: 185, share: 6.3, growth: "+95%" },
              { sector: "Climate / Energy", funding: "$16B", deals: 350, share: 5.6, growth: "+8%" },
              { sector: "Biotech / Health", funding: "$15B", deals: 480, share: 5.3, growth: "-5%" },
              { sector: "Space Tech", funding: "$12B", deals: 95, share: 4.2, growth: "+42%" },
              { sector: "Dev Tools / Infra", funding: "$10B", deals: 320, share: 3.5, growth: "+55%" },
            ].map(s => (
              <div key={s.sector} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{s.sector}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.funding}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.share * 2.5}%`, background: "#00e5a0", opacity: 0.4 }} />
                  </div>
                  <span className="font-mono w-10 text-right text-[9px]">{s.share}%</span>
                  <span className="font-mono w-14 text-right text-[9px]" style={{ color: s.growth.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.growth}</span>
                  <span className="text-[8px] w-16 text-right" style={{ color: "#64748b" }}>{s.deals} deals</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
