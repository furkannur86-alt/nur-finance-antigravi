"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "calendar" | "results" | "wir" | "demand";

export default function TreasuryAuctionPanel() {
  const [tab, setTab] = useState<Tab>("calendar");

  const upcoming = [
    { date: "Nov 25", security: "2-Year Note", cusip: "91282CKL5", size: "$42B", type: "New Issue", when: "1:00 PM ET" },
    { date: "Nov 26", security: "5-Year Note", cusip: "91282CKM3", size: "$43B", type: "New Issue", when: "1:00 PM ET" },
    { date: "Nov 27", security: "7-Year Note", cusip: "91282CKN1", size: "$39B", type: "New Issue", when: "1:00 PM ET" },
    { date: "Dec 2", security: "13-Week Bill", cusip: "912797KP8", size: "$75B", type: "Reopening", when: "11:30 AM ET" },
    { date: "Dec 2", security: "26-Week Bill", cusip: "912797KQ6", size: "$68B", type: "Reopening", when: "11:30 AM ET" },
    { date: "Dec 3", security: "52-Week Bill", cusip: "912797KR4", size: "$46B", type: "New Issue", when: "11:30 AM ET" },
    { date: "Dec 9", security: "3-Year Note", cusip: "91282CKS0", size: "$56B", type: "New Issue", when: "1:00 PM ET" },
    { date: "Dec 10", security: "10-Year Note", cusip: "91282CKT8", size: "$39B", type: "Reopening", when: "1:00 PM ET" },
    { date: "Dec 11", security: "30-Year Bond", cusip: "912810TZ8", size: "$22B", type: "Reopening", when: "1:00 PM ET" },
  ];

  const results = [
    { date: "Nov 20", security: "10-Year TIPS", size: "$16B", highYield: "1.845%", bidCover: 2.52, tailBps: -0.3, indirects: 73.2, directs: 18.1, dealers: 8.7, grade: "A" },
    { date: "Nov 19", security: "20-Year Bond", size: "$16B", highYield: "4.780%", bidCover: 2.38, tailBps: 1.2, indirects: 67.5, directs: 21.3, dealers: 11.2, grade: "B+" },
    { date: "Nov 18", security: "2-Year FRN", size: "$28B", highYield: "0.169%", bidCover: 2.95, tailBps: 0.0, indirects: 55.8, directs: 25.4, dealers: 18.8, grade: "A-" },
    { date: "Nov 14", security: "30-Year Bond", size: "$25B", highYield: "4.912%", bidCover: 2.21, tailBps: 2.5, indirects: 65.1, directs: 15.8, dealers: 19.1, grade: "C+" },
    { date: "Nov 13", security: "10-Year Note", size: "$39B", highYield: "4.347%", bidCover: 2.58, tailBps: -0.8, indirects: 71.4, directs: 19.2, dealers: 9.4, grade: "A+" },
    { date: "Nov 12", security: "3-Year Note", size: "$58B", highYield: "4.117%", bidCover: 2.72, tailBps: 0.1, indirects: 68.9, directs: 20.7, dealers: 10.4, grade: "A" },
  ];

  const wirData = [
    { tenor: "4-Week", issued: "$80B", outstanding: "$468B", rate: "4.620%", chg: -0.015 },
    { tenor: "8-Week", issued: "$70B", outstanding: "$412B", rate: "4.605%", chg: -0.010 },
    { tenor: "13-Week", issued: "$75B", outstanding: "$625B", rate: "4.540%", chg: -0.025 },
    { tenor: "26-Week", issued: "$68B", outstanding: "$580B", rate: "4.420%", chg: -0.030 },
    { tenor: "52-Week", issued: "$46B", outstanding: "$320B", rate: "4.280%", chg: -0.045 },
    { tenor: "2-Year", issued: "$42B", outstanding: "$3.2T", rate: "4.350%", chg: 0.020 },
    { tenor: "3-Year", issued: "$56B", outstanding: "$1.8T", rate: "4.120%", chg: 0.015 },
    { tenor: "5-Year", issued: "$43B", outstanding: "$2.5T", rate: "4.180%", chg: 0.025 },
    { tenor: "7-Year", issued: "$39B", outstanding: "$2.1T", rate: "4.250%", chg: 0.030 },
    { tenor: "10-Year", issued: "$39B", outstanding: "$4.1T", rate: "4.350%", chg: 0.035 },
    { tenor: "20-Year", issued: "$16B", outstanding: "$1.2T", rate: "4.780%", chg: 0.040 },
    { tenor: "30-Year", issued: "$22B", outstanding: "$2.8T", rate: "4.550%", chg: 0.045 },
  ];

  const gradeColor = (g: string) => {
    if (g.startsWith("A")) return "#22c55e";
    if (g.startsWith("B")) return "#fbbf24";
    return "#ef4444";
  };

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>TREASURY AUCTIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg AAU</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["calendar", "results", "wir", "demand"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t === "wir" ? "WI/RATES" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "calendar" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING US TREASURY AUCTIONS</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Date", "Security", "CUSIP", "Size", "Type", "Time"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((a, i) => (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-mono">{a.date}</td>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{a.security}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: "#64748b" }}>{a.cusip}</td>
                      <td className="px-2 py-1.5 font-mono font-bold">{a.size}</td>
                      <td className="px-2 py-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[8px]" style={{
                          background: a.type === "New Issue" ? "rgba(34,197,94,0.15)" : "rgba(56,189,248,0.15)",
                          color: a.type === "New Issue" ? "#22c55e" : "#38bdf8"
                        }}>{a.type}</span>
                      </td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: "#94a3b8" }}>{a.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Nov Supply", val: "$288B", sub: "Coupons + Bills" },
                { label: "Net New Issuance", val: "$142B", sub: "+8% vs Oct" },
                { label: "Avg Bid-Cover (Nov)", val: "2.56x", sub: "vs 2.48x Oct" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: "#00e5a0" }}>{s.val}</div>
                  <div className="text-[8px]" style={{ color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "results" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT AUCTION RESULTS</div>
            {results.map((r, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{r.security}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.date} | {r.size}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `rgba(${gradeColor(r.grade) === "#22c55e" ? "34,197,94" : gradeColor(r.grade) === "#fbbf24" ? "251,191,36" : "239,68,68"},0.15)`, color: gradeColor(r.grade) }}>{r.grade}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div>
                    <div style={{ color: "#64748b" }}>High Yield</div>
                    <div className="font-mono font-bold">{r.highYield}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b" }}>Bid/Cover</div>
                    <div className="font-mono font-bold" style={{ color: r.bidCover >= 2.5 ? "#22c55e" : r.bidCover >= 2.3 ? "#fbbf24" : "#ef4444" }}>{r.bidCover.toFixed(2)}x</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b" }}>Tail (bps)</div>
                    <div className="font-mono font-bold" style={{ color: r.tailBps <= 0 ? "#22c55e" : r.tailBps <= 1 ? "#fbbf24" : "#ef4444" }}>{r.tailBps > 0 ? "+" : ""}{r.tailBps.toFixed(1)}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b" }}>Indirects</div>
                    <div className="font-mono font-bold">{r.indirects.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b" }}>Dealers</div>
                    <div className="font-mono font-bold" style={{ color: r.dealers <= 10 ? "#22c55e" : r.dealers <= 15 ? "#fbbf24" : "#ef4444" }}>{r.dealers.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full flex overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ width: `${r.indirects}%`, background: "#22c55e" }} />
                  <div style={{ width: `${r.directs}%`, background: "#38bdf8" }} />
                  <div style={{ width: `${r.dealers}%`, background: "#ef4444" }} />
                </div>
                <div className="flex gap-3 mt-1 text-[8px]" style={{ color: "#64748b" }}>
                  <span><span style={{ color: "#22c55e" }}>●</span> Indirect {r.indirects}%</span>
                  <span><span style={{ color: "#38bdf8" }}>●</span> Direct {r.directs}%</span>
                  <span><span style={{ color: "#ef4444" }}>●</span> Dealer {r.dealers}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "wir" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WHEN-ISSUED RATES & OUTSTANDING</div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Tenor", "Last Issued", "Outstanding", "WI Rate", "Chg"].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 font-bold" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wirData.map(w => (
                    <tr key={w.tenor} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-2 py-1.5 font-bold" style={{ color: "#38bdf8" }}>{w.tenor}</td>
                      <td className="px-2 py-1.5 font-mono">{w.issued}</td>
                      <td className="px-2 py-1.5 font-mono">{w.outstanding}</td>
                      <td className="px-2 py-1.5 font-mono font-bold">{w.rate}</td>
                      <td className="px-2 py-1.5 font-mono" style={{ color: w.chg >= 0 ? "#ef4444" : "#22c55e" }}>{w.chg >= 0 ? "+" : ""}{(w.chg * 100).toFixed(1)}bp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MATURITY PROFILE — NEXT 12 MONTHS</div>
            <svg viewBox="0 0 400 120" className="w-full">
              {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => {
                const vals = [280, 310, 245, 295, 260, 320, 275, 290, 250, 305, 270, 285];
                const h = (vals[i] / 320) * 90;
                return (
                  <g key={m}>
                    <rect x={10 + i * 32} y={100 - h} width={24} height={h} rx={2} fill="rgba(56,189,248,0.3)" stroke="#38bdf8" strokeWidth={0.5} />
                    <text x={22 + i * 32} y={112} textAnchor="middle" fill="#64748b" fontSize={7}>{m}</text>
                    <text x={22 + i * 32} y={96 - h} textAnchor="middle" fill="#94a3b8" fontSize={6}>${vals[i]}B</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {tab === "demand" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AUCTION DEMAND TRENDS</div>
            {[
              { tenor: "2-Year", bidCover3m: 2.68, bidCover6m: 2.62, bidCover1y: 2.55, indirect3m: 72.5, trend: "Improving" },
              { tenor: "5-Year", bidCover3m: 2.45, bidCover6m: 2.40, bidCover1y: 2.38, indirect3m: 68.2, trend: "Stable" },
              { tenor: "10-Year", bidCover3m: 2.52, bidCover6m: 2.48, bidCover1y: 2.42, indirect3m: 70.8, trend: "Improving" },
              { tenor: "30-Year", bidCover3m: 2.28, bidCover6m: 2.32, bidCover1y: 2.35, indirect3m: 64.5, trend: "Weakening" },
              { tenor: "2-Year FRN", bidCover3m: 2.92, bidCover6m: 2.88, bidCover1y: 2.80, indirect3m: 55.1, trend: "Strong" },
              { tenor: "TIPS (10Y)", bidCover3m: 2.55, bidCover6m: 2.50, bidCover1y: 2.45, indirect3m: 73.0, trend: "Stable" },
            ].map(d => (
              <div key={d.tenor} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{ color: "#38bdf8" }}>{d.tenor}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: d.trend === "Improving" || d.trend === "Strong" ? "rgba(34,197,94,0.15)" : d.trend === "Weakening" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: d.trend === "Improving" || d.trend === "Strong" ? "#22c55e" : d.trend === "Weakening" ? "#ef4444" : "#fbbf24"
                  }}>{d.trend}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>3M B/C:</span> <span className="font-mono font-bold">{d.bidCover3m.toFixed(2)}x</span></div>
                  <div><span style={{ color: "#64748b" }}>6M B/C:</span> <span className="font-mono">{d.bidCover6m.toFixed(2)}x</span></div>
                  <div><span style={{ color: "#64748b" }}>1Y B/C:</span> <span className="font-mono">{d.bidCover1y.toFixed(2)}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Indirect:</span> <span className="font-mono">{d.indirect3m.toFixed(1)}%</span></div>
                </div>
                <div className="mt-1.5 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.bidCover3m / 3.5) * 100}%`, background: d.bidCover3m >= 2.5 ? "#22c55e" : d.bidCover3m >= 2.3 ? "#fbbf24" : "#ef4444" }} />
                </div>
              </div>
            ))}

            <div className="p-2.5 rounded" style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-1" style={{ color: "#00e5a0" }}>FOREIGN HOLDINGS SNAPSHOT</div>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <div><span style={{ color: "#64748b" }}>Japan:</span> <span className="font-mono">$1.09T</span></div>
                <div><span style={{ color: "#64748b" }}>China:</span> <span className="font-mono">$769B</span></div>
                <div><span style={{ color: "#64748b" }}>UK:</span> <span className="font-mono">$723B</span></div>
                <div><span style={{ color: "#64748b" }}>Belgium:</span> <span className="font-mono">$332B</span></div>
                <div><span style={{ color: "#64748b" }}>Luxembourg:</span> <span className="font-mono">$318B</span></div>
                <div><span style={{ color: "#64748b" }}>Total Foreign:</span> <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>$8.1T</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
