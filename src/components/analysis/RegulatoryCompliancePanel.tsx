"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "dashboard" | "rules" | "filings" | "alerts";

export default function RegulatoryCompliancePanel() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">⚖️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>REGULATORY COMPLIANCE</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Bloomberg REGN</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["dashboard", "rules", "filings", "alerts"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "dashboard" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMPLIANCE SCORECARD</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Overall Score", value: "94/100", color: "#22c55e" },
                { label: "Open Issues", value: "12", color: "#fbbf24" },
                { label: "Critical Findings", value: "2", color: "#ef4444" },
                { label: "Upcoming Deadlines", value: "8", color: "#38bdf8" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>REGULATORY FRAMEWORK STATUS</div>
            {[
              { framework: "MiFID II", jurisdiction: "EU", status: "COMPLIANT", score: 96, nextReview: "Q1 2027" },
              { framework: "Dodd-Frank", jurisdiction: "US", status: "COMPLIANT", score: 92, nextReview: "Q2 2027" },
              { framework: "Basel III/IV", jurisdiction: "Global", status: "IN PROGRESS", score: 85, nextReview: "Dec 2026" },
              { framework: "GDPR", jurisdiction: "EU", status: "COMPLIANT", score: 98, nextReview: "Mar 2027" },
              { framework: "SOX", jurisdiction: "US", status: "COMPLIANT", score: 94, nextReview: "Apr 2027" },
              { framework: "SFDR", jurisdiction: "EU", status: "REMEDIATION", score: 78, nextReview: "Jan 2027" },
              { framework: "EMIR", jurisdiction: "EU", status: "COMPLIANT", score: 91, nextReview: "Q2 2027" },
              { framework: "AML/KYC", jurisdiction: "Global", status: "COMPLIANT", score: 95, nextReview: "Feb 2027" },
            ].map(f => (
              <div key={f.framework} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{f.framework}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{f.jurisdiction}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: f.status === "COMPLIANT" ? "rgba(34,197,94,0.15)" : f.status === "REMEDIATION" ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                    color: f.status === "COMPLIANT" ? "#22c55e" : f.status === "REMEDIATION" ? "#ef4444" : "#fbbf24",
                  }}>{f.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${f.score}%`,
                      background: f.score >= 90 ? "#22c55e" : f.score >= 80 ? "#fbbf24" : "#ef4444",
                    }} />
                  </div>
                  <span className="font-mono text-[9px] w-10">{f.score}%</span>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Review: {f.nextReview}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rules" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT REGULATORY CHANGES</div>
            {[
              { date: "Nov 15, 2026", rule: "SEC Climate Disclosure Rule", status: "FINAL", impact: "HIGH", desc: "Mandatory Scope 1-3 emissions reporting for public companies" },
              { date: "Nov 8, 2026", rule: "EU AI Act — Financial Services", status: "DRAFT", impact: "HIGH", desc: "AI model governance for trading algorithms and credit decisions" },
              { date: "Oct 28, 2026", rule: "Basel 3.1 Endgame", status: "FINAL", impact: "CRITICAL", desc: "Revised capital requirements — trading book and CVA risk" },
              { date: "Oct 15, 2026", rule: "ESMA Short Selling Update", status: "CONSULTATION", impact: "MEDIUM", desc: "New reporting thresholds for net short positions" },
              { date: "Sep 30, 2026", rule: "CFTC Digital Asset Framework", status: "PROPOSED", impact: "HIGH", desc: "Spot crypto trading under CFTC jurisdiction" },
              { date: "Sep 15, 2026", rule: "FCA Consumer Duty Extension", status: "FINAL", impact: "MEDIUM", desc: "Extended to closed book products" },
            ].map(r => (
              <div key={r.rule} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{r.date}</span>
                    <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                      background: r.status === "FINAL" ? "rgba(34,197,94,0.15)" : r.status === "DRAFT" ? "rgba(56,189,248,0.15)" : "rgba(251,191,36,0.15)",
                      color: r.status === "FINAL" ? "#22c55e" : r.status === "DRAFT" ? "#38bdf8" : "#fbbf24",
                    }}>{r.status}</span>
                    <span className="px-1 py-0.5 rounded text-[7px] font-bold" style={{
                      background: r.impact === "CRITICAL" ? "rgba(239,68,68,0.2)" : r.impact === "HIGH" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                      color: r.impact === "CRITICAL" ? "#ef4444" : r.impact === "HIGH" ? "#f87171" : "#fbbf24",
                    }}>{r.impact}</span>
                  </div>
                </div>
                <div className="font-bold mb-0.5">{r.rule}</div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "filings" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>UPCOMING REGULATORY FILINGS</div>
            {[
              { filing: "Form PF — Large Hedge Fund", regulator: "SEC", due: "Dec 1, 2026", status: "IN PROGRESS", daysLeft: 7, pct: 72 },
              { filing: "EMIR Trade Reporting", regulator: "ESMA", due: "Dec 15, 2026", status: "PENDING", daysLeft: 21, pct: 45 },
              { filing: "Basel III Pillar 3 Disclosure", regulator: "BIS", due: "Dec 31, 2026", status: "PENDING", daysLeft: 37, pct: 25 },
              { filing: "SFTR Transaction Reporting", regulator: "ESMA", due: "Jan 15, 2027", status: "NOT STARTED", daysLeft: 52, pct: 0 },
              { filing: "MiFID II Best Execution Report", regulator: "FCA", due: "Jan 31, 2027", status: "NOT STARTED", daysLeft: 68, pct: 0 },
              { filing: "SAR Filing — Q4", regulator: "FinCEN", due: "Feb 14, 2027", status: "COLLECTING", daysLeft: 82, pct: 15 },
            ].map(f => (
              <div key={f.filing} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${f.daysLeft < 14 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{f.filing}</span>
                  <span className="text-[8px]" style={{ color: f.daysLeft < 14 ? "#ef4444" : "#64748b" }}>{f.daysLeft}d left</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${f.pct}%`,
                      background: f.pct > 60 ? "#22c55e" : f.pct > 20 ? "#fbbf24" : "#ef4444",
                    }} />
                  </div>
                  <span className="font-mono text-[8px] w-8">{f.pct}%</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#94a3b8" }}>{f.regulator} — Due: {f.due}</span>
                  <span className="px-1 py-0.5 rounded text-[7px]" style={{
                    background: "rgba(255,255,255,0.05)",
                    color: f.status === "IN PROGRESS" ? "#22c55e" : f.status === "PENDING" ? "#fbbf24" : f.status === "COLLECTING" ? "#38bdf8" : "#64748b",
                  }}>{f.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMPLIANCE ALERTS</div>
            {[
              { severity: "CRITICAL", title: "Position Limit Breach — Crude Oil", desc: "NYMEX CL position exceeds CFTC speculative limit by 2,500 contracts", time: "2 hours ago", action: "Immediate reduction required" },
              { severity: "HIGH", title: "Late Trade Report — MiFID II", desc: "12 OTC derivative trades not reported within T+1 deadline", time: "5 hours ago", action: "Submit to DTCC within 24hr" },
              { severity: "MEDIUM", title: "Chinese Wall Breach Alert", desc: "Analyst accessed restricted list security information during quiet period", time: "1 day ago", action: "Compliance review initiated" },
              { severity: "LOW", title: "KYC Refresh Overdue", desc: "15 counterparty profiles due for annual EDD refresh", time: "3 days ago", action: "Schedule EDD reviews" },
              { severity: "HIGH", title: "Sanctions Match — OFAC", desc: "Wire transfer to entity with 85% name match to SDN list", time: "4 hours ago", action: "Hold payment — manual review" },
              { severity: "MEDIUM", title: "Market Abuse Surveillance", desc: "Pattern detected: 3 instances of potential layering in EUR/USD", time: "6 hours ago", action: "Review with trading desk" },
            ].map((a, i) => (
              <div key={i} className="p-2.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${a.severity === "CRITICAL" ? "rgba(239,68,68,0.3)" : a.severity === "HIGH" ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.05)"}`,
              }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                      background: a.severity === "CRITICAL" ? "rgba(239,68,68,0.15)" : a.severity === "HIGH" ? "rgba(251,191,36,0.15)" : a.severity === "MEDIUM" ? "rgba(56,189,248,0.15)" : "rgba(100,116,139,0.15)",
                      color: a.severity === "CRITICAL" ? "#ef4444" : a.severity === "HIGH" ? "#fbbf24" : a.severity === "MEDIUM" ? "#38bdf8" : "#64748b",
                    }}>{a.severity}</span>
                    <span className="font-bold">{a.title}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{a.time}</span>
                </div>
                <div className="text-[9px] mb-1" style={{ color: "#94a3b8" }}>{a.desc}</div>
                <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>Action: {a.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
