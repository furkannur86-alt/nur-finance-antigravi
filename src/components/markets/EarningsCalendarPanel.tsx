"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "upcoming" | "estimates" | "surprises" | "guidance";

export default function EarningsCalendarPanel() {
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>EARNINGS CALENDAR</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg EA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["upcoming", "estimates", "surprises", "guidance"] as Tab[]).map(t => (
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
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>THIS WEEK — EARNINGS REPORTS</div>
            {[
              { date: "Mon Nov 25", reports: [
                { ticker: "ZM", name: "Zoom Video", time: "AMC", epsEst: "$1.31", revEst: "$1.16B" },
                { ticker: "BURL", name: "Burlington Stores", time: "BMO", epsEst: "$1.55", revEst: "$2.56B" },
              ]},
              { date: "Tue Nov 26", reports: [
                { ticker: "CRM", name: "Salesforce", time: "AMC", epsEst: "$2.44", revEst: "$9.86B" },
                { ticker: "DELL", name: "Dell Technologies", time: "AMC", epsEst: "$2.06", revEst: "$24.7B" },
                { ticker: "CRWD", name: "CrowdStrike", time: "AMC", epsEst: "$0.81", revEst: "$982M" },
              ]},
              { date: "Wed Nov 27", reports: [
                { ticker: "SNOW", name: "Snowflake", time: "AMC", epsEst: "$0.15", revEst: "$897M" },
                { ticker: "WDAY", name: "Workday", time: "AMC", epsEst: "$1.76", revEst: "$2.13B" },
              ]},
            ].map(d => (
              <div key={d.date}>
                <div className="text-[9px] font-bold mb-1" style={{ color: "#38bdf8" }}>{d.date}</div>
                {d.reports.map(r => (
                  <div key={r.ticker} className="flex items-center gap-2 p-1.5 mb-1 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="font-mono font-bold w-12" style={{ color: "#00e5a0" }}>{r.ticker}</span>
                    <span className="w-32 truncate">{r.name}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{
                      background: r.time === "BMO" ? "rgba(251,191,36,0.1)" : "rgba(139,92,246,0.1)",
                      color: r.time === "BMO" ? "#fbbf24" : "#a855f7",
                    }}>{r.time}</span>
                    <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>E: {r.epsEst}</span>
                    <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>R: {r.revEst}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "estimates" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>CONSENSUS ESTIMATES — KEY NAMES</div>
            {[
              { ticker: "CRM", eps: "$2.44", rev: "$9.86B", epsHigh: "$2.55", epsLow: "$2.32", analysts: 42, revisions: "+3" },
              { ticker: "DELL", eps: "$2.06", rev: "$24.7B", epsHigh: "$2.25", epsLow: "$1.88", analysts: 18, revisions: "+5" },
              { ticker: "CRWD", eps: "$0.81", rev: "$982M", epsHigh: "$0.88", epsLow: "$0.75", analysts: 38, revisions: "+8" },
              { ticker: "SNOW", eps: "$0.15", rev: "$897M", epsHigh: "$0.19", epsLow: "$0.11", analysts: 35, revisions: "-2" },
              { ticker: "WDAY", eps: "$1.76", rev: "$2.13B", epsHigh: "$1.82", epsLow: "$1.68", analysts: 28, revisions: "+1" },
            ].map(e => (
              <div key={e.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{e.ticker}</span>
                  <span className="font-mono" style={{ color: "#64748b" }}>{e.analysts} analysts</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>EPS:</span> <span className="font-mono font-bold">{e.eps}</span></div>
                  <div><span style={{ color: "#64748b" }}>High:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{e.epsHigh}</span></div>
                  <div><span style={{ color: "#64748b" }}>Low:</span> <span className="font-mono" style={{ color: "#ef4444" }}>{e.epsLow}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rev:</span> <span className="font-mono">{e.rev}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rev:</span> <span className="font-mono" style={{ color: e.revisions.startsWith("+") ? "#22c55e" : "#ef4444" }}>{e.revisions}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "surprises" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT EARNINGS SURPRISES</div>
            {[
              { ticker: "NVDA", epsAct: "$0.81", epsEst: "$0.75", surprise: 8.0, revAct: "$35.1B", revEst: "$33.2B", move: "+3.5%" },
              { ticker: "WMT", epsAct: "$0.58", epsEst: "$0.53", surprise: 9.4, revAct: "$169.6B", revEst: "$167.5B", move: "+5.2%" },
              { ticker: "TGT", epsAct: "$1.85", epsEst: "$2.30", surprise: -19.6, revAct: "$25.2B", revEst: "$25.9B", move: "-21.4%" },
              { ticker: "LOW", epsAct: "$2.89", epsEst: "$2.82", surprise: 2.5, revAct: "$20.2B", revEst: "$19.9B", move: "+1.8%" },
              { ticker: "PANW", epsAct: "$0.77", epsEst: "$0.73", surprise: 5.5, revAct: "$2.14B", revEst: "$2.12B", move: "-4.5%" },
            ].map(s => (
              <div key={s.ticker} className="p-2 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                borderLeft: `2px solid ${s.surprise > 0 ? "#22c55e" : "#ef4444"}`,
              }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: s.surprise > 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: s.surprise > 0 ? "#22c55e" : "#ef4444",
                    }}>{s.surprise > 0 ? "BEAT" : "MISS"} {Math.abs(s.surprise).toFixed(1)}%</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: s.move.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.move}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>EPS Act:</span> <span className="font-mono">{s.epsAct}</span></div>
                  <div><span style={{ color: "#64748b" }}>EPS Est:</span> <span className="font-mono">{s.epsEst}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rev Act:</span> <span className="font-mono">{s.revAct}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rev Est:</span> <span className="font-mono">{s.revEst}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "guidance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GUIDANCE TRACKER — RECENT</div>
            {[
              { ticker: "NVDA", quarter: "Q4 FY25", epsGuide: "$0.89", revGuide: "$37.5B", vs: "Above", detail: "Data center strength" },
              { ticker: "WMT", quarter: "FY25", epsGuide: "$2.42-2.47", revGuide: "4.8-5.1% growth", vs: "Raised", detail: "Raised full-year" },
              { ticker: "TGT", quarter: "Q4 FY25", epsGuide: "$1.85-2.45", revGuide: "Flat YoY", vs: "Below", detail: "Cautious consumer" },
              { ticker: "CRM", quarter: "Q4 FY25", epsGuide: "TBD", revGuide: "TBD", vs: "Pending", detail: "Reports Nov 26" },
            ].map(g => (
              <div key={g.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{g.ticker}</span>
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{g.quarter}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: g.vs === "Above" || g.vs === "Raised" ? "rgba(34,197,94,0.15)" : g.vs === "Below" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.1)",
                    color: g.vs === "Above" || g.vs === "Raised" ? "#22c55e" : g.vs === "Below" ? "#ef4444" : "#64748b",
                  }}>{g.vs}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>EPS:</span> <span className="font-mono">{g.epsGuide}</span></div>
                  <div><span style={{ color: "#64748b" }}>Rev:</span> <span className="font-mono">{g.revGuide}</span></div>
                  <div><span style={{ color: "#fbbf24" }}>{g.detail}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
