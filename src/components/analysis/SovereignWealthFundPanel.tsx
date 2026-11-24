"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "funds" | "allocation" | "flows" | "governance";

export default function SovereignWealthFundPanel() {
  const [tab, setTab] = useState<Tab>("funds");

  const funds = [
    { name: "Norway GPFG", country: "🇳🇴", aum: "$1,580B", ytd: 12.4, strategy: "Diversified", est: 1990, equityPct: 72 },
    { name: "China CIC", country: "🇨🇳", aum: "$1,350B", ytd: 8.2, strategy: "Diversified", est: 2007, equityPct: 45 },
    { name: "Abu Dhabi ADIA", country: "🇦🇪", aum: "$993B", ytd: 10.8, strategy: "Diversified", est: 1976, equityPct: 42 },
    { name: "Kuwait KIA", country: "🇰🇼", aum: "$923B", ytd: 9.1, strategy: "Diversified", est: 1953, equityPct: 50 },
    { name: "Saudi PIF", country: "🇸🇦", aum: "$925B", ytd: 7.5, strategy: "Strategic", est: 1971, equityPct: 35 },
    { name: "Singapore GIC", country: "🇸🇬", aum: "$770B", ytd: 11.2, strategy: "Diversified", est: 1981, equityPct: 55 },
    { name: "Hong Kong HKMA", country: "🇭🇰", aum: "$587B", ytd: 6.8, strategy: "Reserve", est: 1993, equityPct: 25 },
    { name: "Qatar QIA", country: "🇶🇦", aum: "$526B", ytd: 8.9, strategy: "Strategic", est: 2005, equityPct: 48 },
    { name: "Singapore Temasek", country: "🇸🇬", aum: "$382B", ytd: 14.5, strategy: "Active", est: 1974, equityPct: 68 },
    { name: "Australia Future Fund", country: "🇦🇺", aum: "$178B", ytd: 10.1, strategy: "Diversified", est: 2006, equityPct: 38 },
  ];

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">👑</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SOVEREIGN WEALTH FUNDS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>SWF Monitor</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["funds", "allocation", "flows", "governance"] as Tab[]).map(t => (
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
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total SWF AUM", val: "$12.1T", sub: "Global" },
                { label: "YTD Avg Return", val: "+9.8%", sub: "Top 10" },
                { label: "Net Inflows YTD", val: "$285B", sub: "Oil + Fiscal" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP SOVEREIGN WEALTH FUNDS BY AUM</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Fund", "", "AUM", "YTD %", "Strategy", "Equity %"].map((h, i) => (
                      <th key={i} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {funds.map(f => (
                    <tr key={f.name} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{f.name}</td>
                      <td className="px-2 py-1">{f.country}</td>
                      <td className="px-2 py-1.5 font-mono">{f.aum}</td>
                      <td className="px-2 py-1.5 font-mono font-bold" style={{ color: f.ytd >= 10 ? "#22c55e" : "#fbbf24" }}>+{f.ytd.toFixed(1)}%</td>
                      <td className="px-2 py-1.5">{f.strategy}</td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div className="h-full rounded-full" style={{ width: `${f.equityPct}%`, background: "#22c55e" }} />
                          </div>
                          <span className="font-mono">{f.equityPct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "allocation" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AGGREGATE SWF ASSET ALLOCATION</div>
            {[
              { asset: "Public Equities", pct: 42, val: "$5.08T", trend: "Increasing", color: "#22c55e" },
              { asset: "Fixed Income", pct: 22, val: "$2.66T", trend: "Decreasing", color: "#38bdf8" },
              { asset: "Real Estate", pct: 12, val: "$1.45T", trend: "Stable", color: "#fbbf24" },
              { asset: "Private Equity", pct: 10, val: "$1.21T", trend: "Increasing", color: "#a855f7" },
              { asset: "Infrastructure", pct: 6, val: "$726B", trend: "Increasing", color: "#f97316" },
              { asset: "Hedge Funds", pct: 4, val: "$484B", trend: "Decreasing", color: "#ef4444" },
              { asset: "Cash & Other", pct: 4, val: "$484B", trend: "Stable", color: "#64748b" },
            ].map(a => (
              <div key={a.asset} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span className="font-bold">{a.asset}</span>
                  </div>
                  <span className="font-mono font-bold">{a.val}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color, opacity: 0.6 }} />
                  </div>
                  <span className="font-mono w-10 text-right">{a.pct}%</span>
                  <span className="text-[8px] w-16 text-right" style={{ color: a.trend === "Increasing" ? "#22c55e" : a.trend === "Decreasing" ? "#ef4444" : "#fbbf24" }}>{a.trend}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GEOGRAPHIC EQUITY ALLOCATION</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { region: "North America", pct: 38, val: "$1.93T" },
                { region: "Europe", pct: 25, val: "$1.27T" },
                { region: "Asia-Pacific", pct: 22, val: "$1.12T" },
                { region: "Emerging Markets", pct: 15, val: "$762B" },
              ].map(r => (
                <div key={r.region} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{r.region}</div>
                  <div className="font-mono font-bold">{r.pct}% <span style={{ color: "#64748b", fontWeight: "normal" }}>{r.val}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SWF CAPITAL DEPLOYMENT — LAST 12 MONTHS</div>
            {[
              { deal: "Neom City Phase 2", swf: "Saudi PIF", sector: "Infrastructure", size: "$12.5B", type: "Direct" },
              { deal: "OpenAI Series C", swf: "Abu Dhabi ADIA", sector: "Technology", size: "$8.0B", type: "Co-invest" },
              { deal: "Thames Water Infra", swf: "Kuwait KIA", sector: "Utilities", size: "$4.2B", type: "Direct" },
              { deal: "Grab Holdings", swf: "Singapore GIC", sector: "Technology", size: "$3.8B", type: "Public Equity" },
              { deal: "Hyundai Motor Group", swf: "Norway GPFG", sector: "Auto / EV", size: "$3.5B", type: "Public Equity" },
              { deal: "India Data Centers", swf: "Qatar QIA", sector: "Real Estate", size: "$2.8B", type: "Direct" },
              { deal: "EQT Partners Fund X", swf: "Singapore Temasek", sector: "PE Fund", size: "$2.5B", type: "Fund LP" },
              { deal: "Australian Ports", swf: "China CIC", sector: "Infrastructure", size: "$2.1B", type: "Direct" },
            ].map(d => (
              <div key={d.deal} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{d.deal}</span>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{d.size}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{d.swf} — {d.sector}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>{d.type}</span>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SECTOR ALLOCATION OF NEW DEALS</div>
            <svg viewBox="0 0 400 100" className="w-full">
              {[
                { sector: "Tech", pct: 28, color: "#22c55e" },
                { sector: "Infra", pct: 22, color: "#38bdf8" },
                { sector: "RE", pct: 18, color: "#fbbf24" },
                { sector: "Energy", pct: 12, color: "#f97316" },
                { sector: "Health", pct: 10, color: "#a855f7" },
                { sector: "Other", pct: 10, color: "#64748b" },
              ].map((s, i) => {
                const h = (s.pct / 30) * 75;
                return (
                  <g key={s.sector}>
                    <rect x={20 + i * 62} y={85 - h} width={48} height={h} rx={3} fill={s.color} opacity={0.3} stroke={s.color} strokeWidth={0.5} />
                    <text x={44 + i * 62} y={96} textAnchor="middle" fill="#64748b" fontSize={8}>{s.sector}</text>
                    <text x={44 + i * 62} y={81 - h} textAnchor="middle" fill="#94a3b8" fontSize={7}>{s.pct}%</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "governance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SANTIAGO PRINCIPLES COMPLIANCE</div>
            {[
              { fund: "Norway GPFG", score: 98, transparency: "Full", esg: "Leader", linaburg: 10 },
              { fund: "Singapore GIC", score: 85, transparency: "Partial", esg: "Strong", linaburg: 6 },
              { fund: "Singapore Temasek", score: 92, transparency: "Full", esg: "Leader", linaburg: 10 },
              { fund: "Abu Dhabi ADIA", score: 72, transparency: "Limited", esg: "Moderate", linaburg: 5 },
              { fund: "Saudi PIF", score: 68, transparency: "Limited", esg: "Developing", linaburg: 4 },
              { fund: "Kuwait KIA", score: 65, transparency: "Limited", esg: "Moderate", linaburg: 5 },
              { fund: "China CIC", score: 58, transparency: "Minimal", esg: "Developing", linaburg: 3 },
              { fund: "Qatar QIA", score: 55, transparency: "Minimal", esg: "Developing", linaburg: 3 },
            ].map(g => (
              <div key={g.fund} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{g.fund}</span>
                  <span className="font-mono font-bold" style={{ color: g.score >= 85 ? "#22c55e" : g.score >= 65 ? "#fbbf24" : "#ef4444" }}>{g.score}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Transparency:</span> <span>{g.transparency}</span></div>
                  <div><span style={{ color: "#64748b" }}>ESG:</span> <span style={{ color: g.esg === "Leader" ? "#22c55e" : g.esg === "Strong" ? "#38bdf8" : "#fbbf24" }}>{g.esg}</span></div>
                  <div><span style={{ color: "#64748b" }}>Linaburg-Maduell:</span> <span className="font-mono">{g.linaburg}/10</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
