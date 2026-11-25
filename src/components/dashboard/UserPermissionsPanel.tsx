"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "roles" | "teams" | "audit" | "compliance";

export default function UserPermissionsPanel() {
  const [tab, setTab] = useState<Tab>("roles");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔐</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>USER PERMISSIONS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>NUR CORE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["roles", "teams", "audit", "compliance"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "roles" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ROLE-BASED ACCESS CONTROL</div>
            {[
              { role: "Admin", users: 3, perms: ["Full Access", "User Mgmt", "Billing", "API Keys"], color: "#ef4444" },
              { role: "Portfolio Manager", users: 12, perms: ["Trading", "Portfolio", "Analytics", "Research"], color: "#f97316" },
              { role: "Analyst", users: 28, perms: ["Read Markets", "Analytics", "Research", "Screener"], color: "#fbbf24" },
              { role: "Trader", users: 18, perms: ["Trading", "Order Entry", "Positions", "Risk"], color: "#22c55e" },
              { role: "Compliance", users: 5, perms: ["Audit Logs", "Reports", "Restrictions", "Alerts"], color: "#06b6d4" },
              { role: "Viewer", users: 45, perms: ["Read Markets", "Dashboard", "News"], color: "#64748b" },
            ].map(r => (
              <div key={r.role} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                    <span className="font-bold">{r.role}</span>
                  </div>
                  <span className="font-mono" style={{ color: "#64748b" }}>{r.users} users</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {r.perms.map(p => (
                    <span key={p} className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(0,229,160,0.08)", color: "#00e5a0" }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "teams" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TEAM MANAGEMENT</div>
            {[
              { team: "Equity Trading Desk", lead: "M. Chen", members: 8, budget: "$500M", status: "Active" },
              { team: "Fixed Income", lead: "S. Patel", members: 6, budget: "$1.2B", status: "Active" },
              { team: "Quant Research", lead: "A. Volkov", members: 12, budget: "$200M", status: "Active" },
              { team: "Risk Management", lead: "L. Garcia", members: 5, budget: "N/A", status: "Active" },
              { team: "Macro Strategy", lead: "J. Kim", members: 4, budget: "$800M", status: "Active" },
            ].map(t => (
              <div key={t.team} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{t.team}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>{t.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Lead:</span> <span>{t.lead}</span></div>
                  <div><span style={{ color: "#64748b" }}>Members:</span> <span className="font-mono">{t.members}</span></div>
                  <div><span style={{ color: "#64748b" }}>Budget:</span> <span className="font-mono" style={{ color: "#fbbf24" }}>{t.budget}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>AUDIT LOG — RECENT ACTIONS</div>
            {[
              { time: "14:32", user: "admin@nurfinance", action: "Modified role", detail: "Added API Keys perm to PM role", level: "High" },
              { time: "14:15", user: "m.chen@desk", action: "Order placed", detail: "BUY 10,000 NVDA @ MKT", level: "Normal" },
              { time: "13:55", user: "s.patel@fi", action: "Login", detail: "New device: MacBook Pro M4", level: "Medium" },
              { time: "13:40", user: "a.volkov@quant", action: "API key created", detail: "Research API key (read-only)", level: "High" },
              { time: "13:22", user: "l.garcia@risk", action: "Alert config", detail: "Changed VaR threshold to 2.5%", level: "Medium" },
              { time: "12:58", user: "j.kim@macro", action: "Export data", detail: "Downloaded portfolio report (PDF)", level: "Normal" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono text-[9px] w-10" style={{ color: "#64748b" }}>{a.time}</span>
                <span className="w-28 truncate text-[9px]" style={{ color: "#00e5a0" }}>{a.user}</span>
                <span className="w-24">{a.action}</span>
                <span className="flex-1 truncate text-[9px]" style={{ color: "#64748b" }}>{a.detail}</span>
                <span className="text-[8px] px-1 py-0.5 rounded" style={{
                  background: a.level === "High" ? "rgba(239,68,68,0.1)" : a.level === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(100,116,139,0.1)",
                  color: a.level === "High" ? "#ef4444" : a.level === "Medium" ? "#fbbf24" : "#64748b",
                }}>{a.level}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "compliance" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>COMPLIANCE SETTINGS</div>
            {[
              { rule: "MiFID II Pre-Trade Transparency", status: "Enabled", lastReview: "Nov 1", nextReview: "Feb 1" },
              { rule: "Best Execution Monitoring", status: "Enabled", lastReview: "Oct 15", nextReview: "Jan 15" },
              { rule: "Position Limit Monitoring", status: "Enabled", lastReview: "Nov 10", nextReview: "Dec 10" },
              { rule: "Insider Trading Detection", status: "Enabled", lastReview: "Nov 20", nextReview: "Dec 20" },
              { rule: "AML/KYC Verification", status: "Enabled", lastReview: "Nov 5", nextReview: "Feb 5" },
              { rule: "Data Retention (7yr)", status: "Enabled", lastReview: "Sep 1", nextReview: "Mar 1" },
            ].map(c => (
              <div key={c.rule} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.rule}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>{c.status}</span>
                </div>
                <div className="flex gap-4 text-[9px]">
                  <span style={{ color: "#64748b" }}>Last: {c.lastReview}</span>
                  <span style={{ color: "#64748b" }}>Next: {c.nextReview}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
