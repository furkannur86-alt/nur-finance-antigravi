"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";
import GlobeWidget from "@/components/ui/GlobeWidget";

const TABS = [
  { id: "threat-intel", label: "Threat Intel", icon: "🛡️" },
  { id: "breach-tracker", label: "Breach Tracker", icon: "🔓" },
  { id: "cve-monitor", label: "CVE Monitor", icon: "🐛" },
  { id: "sector-scores", label: "Sector Scores", icon: "📊" },
];

const APT_GROUPS = [
  { name: "APT29 (Cozy Bear)", origin: "Russia", target: "Gov / Defense", vector: "Spear-phishing", level: "CRITICAL", active: true },
  { name: "APT41 (Winnti)", origin: "China", target: "Tech / Telecom", vector: "Supply chain", level: "HIGH", active: true },
  { name: "Lazarus Group", origin: "DPRK", target: "Finance / Crypto", vector: "Trojanized apps", level: "CRITICAL", active: true },
  { name: "APT28 (Fancy Bear)", origin: "Russia", target: "NATO / Energy", vector: "Zero-day exploits", level: "HIGH", active: true },
  { name: "Sandworm", origin: "Russia", target: "Infrastructure", vector: "Wiper malware", level: "CRITICAL", active: true },
  { name: "Charming Kitten", origin: "Iran", target: "Research / Media", vector: "Credential harvest", level: "MEDIUM", active: false },
  { name: "Turla", origin: "Russia", target: "Gov / Diplomatic", vector: "Watering hole", level: "HIGH", active: true },
  { name: "Kimsuky", origin: "DPRK", target: "Think tanks", vector: "Social engineering", level: "MEDIUM", active: true },
];

const BREACHES = [
  { company: "MegaCorp Health", records: 23_400_000, type: "Healthcare PII", date: "2026-11-18", severity: "CRITICAL" },
  { company: "CloudStack Inc", records: 8_900_000, type: "API Keys / Tokens", date: "2026-11-12", severity: "HIGH" },
  { company: "RetailX Global", records: 45_000_000, type: "Payment Cards", date: "2026-11-05", severity: "CRITICAL" },
  { company: "EduNet Systems", records: 3_200_000, type: "Student PII", date: "2026-10-28", severity: "MEDIUM" },
  { company: "TransCo Logistics", records: 12_000_000, type: "Employee Data", date: "2026-10-20", severity: "HIGH" },
  { company: "FinServ Partners", records: 1_800_000, type: "Account Creds", date: "2026-10-15", severity: "HIGH" },
  { company: "GovPortal.eu", records: 6_700_000, type: "Citizen IDs", date: "2026-10-08", severity: "CRITICAL" },
];

const CVES = [
  { id: "CVE-2026-44128", product: "Linux Kernel 6.x", cvss: 9.8, type: "RCE", exploited: true, patch: true },
  { id: "CVE-2026-38901", product: "Apache Struts 7.1", cvss: 9.1, type: "RCE", exploited: true, patch: false },
  { id: "CVE-2026-41200", product: "Windows Server 2025", cvss: 8.8, type: "Privilege Escalation", exploited: false, patch: true },
  { id: "CVE-2026-39445", product: "OpenSSL 3.4.x", cvss: 8.6, type: "Buffer Overflow", exploited: false, patch: true },
  { id: "CVE-2026-42001", product: "Cisco IOS XE 17.x", cvss: 9.6, type: "Auth Bypass", exploited: true, patch: false },
  { id: "CVE-2026-37800", product: "VMware vCenter 8.x", cvss: 8.4, type: "SSRF", exploited: false, patch: true },
  { id: "CVE-2026-43300", product: "Fortinet FortiOS 7.6", cvss: 9.3, type: "RCE", exploited: true, patch: true },
];

const SECTORS = [
  { sector: "Financial Services", score: 87, trend: 2.1, incidents: 142, budget: "$18.4B" },
  { sector: "Healthcare", score: 61, trend: -3.4, incidents: 289, budget: "$8.2B" },
  { sector: "Energy & Utilities", score: 68, trend: 1.8, incidents: 87, budget: "$6.1B" },
  { sector: "Government", score: 72, trend: 0.5, incidents: 198, budget: "$14.8B" },
  { sector: "Technology", score: 91, trend: 3.2, incidents: 64, budget: "$22.6B" },
  { sector: "Manufacturing", score: 54, trend: -1.2, incidents: 156, budget: "$4.3B" },
  { sector: "Telecommunications", score: 78, trend: 1.5, incidents: 93, budget: "$9.7B" },
  { sector: "Retail / E-Commerce", score: 65, trend: -0.8, incidents: 211, budget: "$5.5B" },
  { sector: "Transportation", score: 59, trend: 0.3, incidents: 72, budget: "$3.1B" },
  { sector: "Education", score: 48, trend: -2.1, incidents: 184, budget: "$1.8B" },
];

function levelColor(level: string) {
  return level === "CRITICAL" ? "#ef4444" : level === "HIGH" ? "#f59e0b" : level === "MEDIUM" ? "#3b82f6" : "#22c55e";
}

function scoreColor(score: number) {
  return score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
}

const GLOBE_HEADLINES: Record<string, string[]> = {
  "threat-intel": [
    "APT29 targets NATO defense networks via spear-phishing",
    "Lazarus Group deploys trojanized DeFi apps in APAC",
    "Sandworm wiper campaign hits EU energy infrastructure",
    "APT41 supply-chain attack compromises US telecom",
    "Turla watering-hole targets diplomatic networks",
  ],
  "breach-tracker": [
    "MegaCorp Health: 23.4M patient records exposed",
    "RetailX Global: 45M payment cards compromised",
    "GovPortal.eu: 6.7M citizen IDs breached",
    "CloudStack Inc: 8.9M API keys leaked",
    "TransCo Logistics: 12M employee records stolen",
  ],
  "cve-monitor": [
    "CVE-2026-44128: Linux Kernel RCE actively exploited",
    "CVE-2026-42001: Cisco IOS XE auth bypass — no patch",
    "CVE-2026-43300: Fortinet RCE under mass exploitation",
    "CVE-2026-38901: Apache Struts 7.1 RCE unpatched",
    "OpenSSL 3.4.x buffer overflow patched — upgrade urged",
  ],
  "sector-scores": [
    "Healthcare cyber score drops to 61 — third straight decline",
    "Financial services leads at 87 — $18.4B budget",
    "Manufacturing sector most vulnerable at score 54",
    "Education sector breaches surge — 184 incidents",
    "Tech sector resilient at 91 with $22.6B investment",
  ],
};

export default function CyberRiskPanel() {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">🛡️</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#ef4444" }}>CYBER RISK</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>RISK · CYBER</span>
      </div>

      <div className="flex gap-0.5 px-3 py-1 border-b border-white/[0.04]" style={{ background: "rgba(0,0,0,0.15)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1 text-[10px] font-mono font-medium rounded transition-all"
            style={{ background: tab === t.id ? "rgba(239,68,68,0.1)" : "transparent", color: tab === t.id ? "#ef4444" : "#64748b", borderBottom: tab === t.id ? "2px solid #ef4444" : "2px solid transparent" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-3 h-full">
        <div className="flex-1 min-w-0 overflow-y-auto">
        {tab === "threat-intel" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_120px_140px_80px_60px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>APT Group</span><span>Origin</span><span>Target</span><span>Attack Vector</span><span>Level</span><span>Active</span>
            </div>
            {APT_GROUPS.map((g, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_120px_140px_80px_60px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{g.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{g.origin}</span>
                <span className="text-[10px] font-mono text-slate-400">{g.target}</span>
                <span className="text-[10px] font-mono text-cyan-400">{g.vector}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: levelColor(g.level), background: `${levelColor(g.level)}15` }}>{g.level}</span>
                <span className="text-[10px]">{g.active ? "🟢" : "⚪"}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "breach-tracker" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_100px_120px_90px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Organization</span><span>Records</span><span>Data Type</span><span>Date</span><span>Severity</span>
            </div>
            {BREACHES.map((b, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_120px_90px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{b.company}</span>
                <span className="text-[10px] font-mono text-amber-400" style={{ fontVariantNumeric: "tabular-nums" }}>{b.records.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-slate-400">{b.type}</span>
                <span className="text-[10px] font-mono text-slate-500">{b.date}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: levelColor(b.severity), background: `${levelColor(b.severity)}15` }}>{b.severity}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "cve-monitor" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[120px_1fr_60px_120px_70px_60px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>CVE ID</span><span>Product</span><span>CVSS</span><span>Type</span><span>Exploited</span><span>Patch</span>
            </div>
            {CVES.map((c, i) => (
              <div key={i} className="grid grid-cols-[120px_1fr_60px_120px_70px_60px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[10px] font-mono text-cyan-400">{c.id}</span>
                <span className="text-[10px] font-mono text-slate-300">{c.product}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: c.cvss >= 9 ? "#ef4444" : c.cvss >= 8 ? "#f59e0b" : "#3b82f6", fontVariantNumeric: "tabular-nums" }}>{c.cvss.toFixed(1)}</span>
                <span className="text-[10px] font-mono text-slate-400">{c.type}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: c.exploited ? "#ef4444" : "#10b981" }}>{c.exploited ? "YES" : "NO"}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: c.patch ? "#10b981" : "#ef4444" }}>{c.patch ? "YES" : "NO"}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "sector-scores" && (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "#64748b" }}>
              <span>Sector</span><span className="text-right">Score</span><span className="text-right">Trend</span><span className="text-right">Incidents</span><span className="text-right">Budget</span>
            </div>
            {SECTORS.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] transition-colors">
                <span className="text-[11px] font-mono text-slate-200">{s.sector}</span>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: scoreColor(s.score) }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: scoreColor(s.score), fontVariantNumeric: "tabular-nums" }}>{s.score}</span>
                </div>
                <span className="text-[10px] font-mono text-right" style={{ color: s.trend >= 0 ? "#10b981" : "#ef4444", fontVariantNumeric: "tabular-nums" }}>{s.trend >= 0 ? "+" : ""}{s.trend.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-right text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>{s.incidents}</span>
                <span className="text-[10px] font-mono text-right text-slate-400">{s.budget}</span>
              </div>
            ))}
          </div>
        )}
        </div>
        <div className="shrink-0 w-[260px] hidden lg:block" style={{ borderLeft: "1px solid rgba(239,68,68,0.1)" }}>
          <GlobeWidget width={260} height={320} title="CYBER THREAT MAP" headlines={GLOBE_HEADLINES[tab] || GLOBE_HEADLINES["threat-intel"]} />
        </div>
        </div>
      </div>
    </div>
  );
}
