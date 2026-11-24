"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "upcoming" | "results" | "issuance" | "calendar";

export default function SovereignDebtAuctionsPanel() {
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏦</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SOVEREIGN DEBT AUCTIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Reuters AUCT</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["upcoming", "results", "issuance", "calendar"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "upcoming" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING AUCTIONS</div>
            {[
              { date: "Nov 25", time: "13:00", country: "🇺🇸", security: "2Y UST Note", size: "$63B", wi: "4.42%", prev: "4.38%" },
              { date: "Nov 25", time: "13:00", country: "🇺🇸", security: "5Y UST Note", size: "$70B", wi: "4.28%", prev: "4.22%" },
              { date: "Nov 26", time: "13:00", country: "🇺🇸", security: "7Y UST Note", size: "$44B", wi: "4.35%", prev: "4.30%" },
              { date: "Nov 26", time: "10:30", country: "🇩🇪", security: "10Y Bund", size: "€5B", wi: "2.35%", prev: "2.28%" },
              { date: "Nov 27", time: "10:00", country: "🇮🇹", security: "10Y BTP", size: "€6B", wi: "3.85%", prev: "3.78%" },
              { date: "Nov 28", time: "10:30", country: "🇯🇵", security: "20Y JGB", size: "¥1.2T", wi: "1.75%", prev: "1.68%" },
            ].map((a, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{a.date} {a.time}</span>
                    <span>{a.country}</span>
                    <span className="font-bold">{a.security}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{a.size}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>WI Yield:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{a.wi}</span></div>
                  <div><span style={{ color: "#64748b" }}>Prev Auction:</span> <span className="font-mono">{a.prev}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "results" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT AUCTION RESULTS</div>
            {[
              { date: "Nov 21", country: "🇺🇸", security: "10Y TIPS", size: "$16B", highYield: "1.82%", btc: 2.52, tail: 0.3, alloc: "52% Direct" },
              { date: "Nov 20", country: "🇺🇸", security: "20Y Bond", size: "$16B", highYield: "4.78%", btc: 2.35, tail: 1.5, alloc: "18% Direct" },
              { date: "Nov 19", country: "🇩🇪", security: "2Y Schatz", size: "€5B", highYield: "2.15%", btc: 1.85, tail: 0.0, alloc: "—" },
              { date: "Nov 18", country: "🇬🇧", security: "10Y Gilt", size: "£4B", highYield: "4.52%", btc: 2.45, tail: 0.5, alloc: "—" },
              { date: "Nov 15", country: "🇫🇷", security: "10Y OAT", size: "€8B", highYield: "3.12%", btc: 1.65, tail: 0.8, alloc: "—" },
            ].map((r, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{r.date}</span>
                    <span>{r.country}</span>
                    <span className="font-bold">{r.security}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#00e5a0" }}>{r.size}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>High:</span> <span className="font-mono font-bold">{r.highYield}</span></div>
                  <div><span style={{ color: "#64748b" }}>BTC:</span> <span className="font-mono" style={{ color: r.btc > 2.3 ? "#22c55e" : r.btc > 2.0 ? "#fbbf24" : "#ef4444" }}>{r.btc}x</span></div>
                  <div><span style={{ color: "#64748b" }}>Tail:</span> <span className="font-mono" style={{ color: r.tail > 1.0 ? "#ef4444" : r.tail > 0.5 ? "#fbbf24" : "#22c55e" }}>{r.tail}bp</span></div>
                  <div><span style={{ color: "#64748b" }}>{r.alloc}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "issuance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>2026 NET ISSUANCE TRACKER</div>
            {[
              { country: "🇺🇸 US Treasury", gross: "$10.2T", net: "$2.1T", pctGDP: "7.5%", remaining: "$4.8T" },
              { country: "🇩🇪 Germany", gross: "€380B", net: "€85B", pctGDP: "2.1%", remaining: "€180B" },
              { country: "🇫🇷 France", gross: "€320B", net: "€155B", pctGDP: "5.8%", remaining: "€150B" },
              { country: "🇮🇹 Italy", gross: "€380B", net: "€110B", pctGDP: "5.2%", remaining: "€175B" },
              { country: "🇬🇧 UK", gross: "£240B", net: "£125B", pctGDP: "4.8%", remaining: "£110B" },
              { country: "🇯🇵 Japan", gross: "¥210T", net: "¥48T", pctGDP: "8.5%", remaining: "¥95T" },
            ].map(i => (
              <div key={i.country} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="font-bold mb-1">{i.country}</div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Gross:</span> <span className="font-mono">{i.gross}</span></div>
                  <div><span style={{ color: "#64748b" }}>Net:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{i.net}</span></div>
                  <div><span style={{ color: "#64748b" }}>%GDP:</span> <span className="font-mono" style={{ color: parseFloat(i.pctGDP) > 5 ? "#ef4444" : "#fbbf24" }}>{i.pctGDP}</span></div>
                  <div><span style={{ color: "#64748b" }}>Left:</span> <span className="font-mono">{i.remaining}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calendar" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WEEKLY ISSUANCE CALENDAR</div>
            {["Mon Nov 25", "Tue Nov 26", "Wed Nov 27", "Thu Nov 28", "Fri Nov 29"].map(day => {
              const events: Record<string, { country: string; security: string; size: string }[]> = {
                "Mon Nov 25": [
                  { country: "🇺🇸", security: "2Y Note", size: "$63B" },
                  { country: "🇺🇸", security: "5Y Note", size: "$70B" },
                ],
                "Tue Nov 26": [
                  { country: "🇺🇸", security: "7Y Note", size: "$44B" },
                  { country: "🇩🇪", security: "10Y Bund", size: "€5B" },
                ],
                "Wed Nov 27": [
                  { country: "🇮🇹", security: "10Y BTP", size: "€6B" },
                  { country: "🇪🇸", security: "5Y Bonos", size: "€4B" },
                ],
                "Thu Nov 28": [
                  { country: "🇯🇵", security: "20Y JGB", size: "¥1.2T" },
                ],
                "Fri Nov 29": [
                  { country: "🇬🇧", security: "5Y Gilt", size: "£4.5B" },
                ],
              };
              return (
                <div key={day}>
                  <div className="text-[9px] font-bold mb-1" style={{ color: "#38bdf8" }}>{day}</div>
                  {events[day]?.map((e, j) => (
                    <div key={j} className="flex items-center gap-2 p-1.5 ml-2 rounded" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <span>{e.country}</span>
                      <span className="font-bold">{e.security}</span>
                      <span className="font-mono ml-auto" style={{ color: "#00e5a0" }}>{e.size}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
