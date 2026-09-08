"use client";

import { useState, useEffect } from "react";

type EdTab = "courses" | "classroom" | "compute" | "terms";

interface Course {
  id: string;
  title: string;
  subject: "math" | "language" | "finance" | "science";
  level: string;
  lessons: number;
  enrolled: number;
  icon: string;
}

const COURSES: Course[] = [
  { id: "math-alg1", title: "Algebra I — Foundations", subject: "math", level: "Secondary", lessons: 24, enrolled: 1840, icon: "📐" },
  { id: "math-calc", title: "Calculus & Differential Equations", subject: "math", level: "University", lessons: 36, enrolled: 920, icon: "∫" },
  { id: "math-stat", title: "Probability & Statistics", subject: "math", level: "University", lessons: 30, enrolled: 1120, icon: "📊" },
  { id: "lang-en", title: "English — Academic Writing", subject: "language", level: "Secondary", lessons: 20, enrolled: 3200, icon: "🇬🇧" },
  { id: "lang-de", title: "German — B1 Intensive", subject: "language", level: "All Levels", lessons: 28, enrolled: 1560, icon: "🇩🇪" },
  { id: "lang-tr", title: "Türkçe — Yazılı Anlatım", subject: "language", level: "Secondary", lessons: 18, enrolled: 2400, icon: "🇹🇷" },
  { id: "fin-lit", title: "Financial Literacy — Budgeting & Saving", subject: "finance", level: "Secondary", lessons: 16, enrolled: 890, icon: "💰" },
  { id: "fin-mkt", title: "Introduction to Capital Markets", subject: "finance", level: "University", lessons: 22, enrolled: 670, icon: "📈" },
  { id: "sci-phy", title: "Physics — Mechanics & Waves", subject: "science", level: "Secondary", lessons: 32, enrolled: 1450, icon: "⚛️" },
  { id: "sci-chem", title: "Chemistry — Organic Compounds", subject: "science", level: "University", lessons: 26, enrolled: 780, icon: "🧪" },
];

const SUBJECT_COLORS: Record<string, string> = {
  math: "#6366f1",
  language: "#00d4aa",
  finance: "#f59e0b",
  science: "#ec4899",
};

const SUBJECT_LABELS: Record<string, string> = {
  math: "Mathematics",
  language: "Languages",
  finance: "Finance",
  science: "Science",
};

export default function NurEducationPanel() {
  const [tab, setTab] = useState<EdTab>("courses");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [computeConsented, setComputeConsented] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [cpuPercent, setCpuPercent] = useState(30);
  const [computeActive, setComputeActive] = useState(false);
  const [earnedTotal, setEarnedTotal] = useState(0);
  const [sessionHashRate, setSessionHashRate] = useState(0);
  const [tickNow, setTickNow] = useState(Date.now());

  useEffect(() => {
    if (!computeActive) return;
    const iv = setInterval(() => {
      setTickNow(Date.now());
      setEarnedTotal(prev => prev + (cpuPercent / 100) * 0.0000004);
      setSessionHashRate(Math.floor(480 * (cpuPercent / 100) + (Math.random() - 0.5) * 40));
    }, 1000);
    return () => clearInterval(iv);
  }, [computeActive, cpuPercent]);

  const filteredCourses = subjectFilter === "all"
    ? COURSES
    : COURSES.filter(c => c.subject === subjectFilter);

  const tabs: { id: EdTab; label: string }[] = [
    { id: "courses", label: "📚 Courses" },
    { id: "classroom", label: "🖥️ Classroom" },
    { id: "compute", label: "⚡ Compute" },
    { id: "terms", label: "📋 Agreement" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-wide" style={{ color: "#6366f1" }}>NUR Education</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
            FREE FOR SCHOOLS
          </span>
        </div>
        <div className="flex items-center gap-2">
          {computeConsented && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1" style={{
              background: computeActive ? "rgba(0,212,170,0.15)" : "rgba(100,116,139,0.15)",
              color: computeActive ? "#00d4aa" : "#64748b",
            }}>
              <span className={`w-1.5 h-1.5 rounded-full ${computeActive ? "animate-pulse" : ""}`} style={{ background: computeActive ? "#00d4aa" : "#64748b" }} />
              {computeActive ? "COMPUTE SHARING ACTIVE" : "COMPUTE PAUSED"}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap"
            style={{
              background: tab === t.id ? "rgba(99,102,241,0.15)" : "transparent",
              color: tab === t.id ? "#6366f1" : "var(--ag-muted)",
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "courses" && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Filter:</span>
              {["all", "math", "language", "finance", "science"].map(s => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className="px-2.5 py-1 text-[11px] rounded-lg transition-colors"
                  style={{
                    background: subjectFilter === s ? (s === "all" ? "rgba(99,102,241,0.15)" : `${SUBJECT_COLORS[s]}20`) : "transparent",
                    color: subjectFilter === s ? (s === "all" ? "#6366f1" : SUBJECT_COLORS[s]) : "var(--ag-muted)",
                    border: `1px solid ${subjectFilter === s ? (s === "all" ? "rgba(99,102,241,0.3)" : `${SUBJECT_COLORS[s]}40`) : "var(--ag-border)"}`,
                  }}
                >
                  {s === "all" ? "All Subjects" : SUBJECT_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Course grid */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filteredCourses.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-lg border transition-colors hover:border-opacity-60"
                  style={{ background: "var(--ag-surface)", borderColor: `${SUBJECT_COLORS[c.subject]}30`, borderWidth: 1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${SUBJECT_COLORS[c.subject]}15`, color: SUBJECT_COLORS[c.subject] }}
                    >
                      {SUBJECT_LABELS[c.subject]}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--ag-text)" }}>{c.title}</h3>
                  <p className="text-[11px] mb-3" style={{ color: "var(--ag-muted)" }}>{c.level}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>
                    <span>{c.lessons} lessons</span>
                    <span>{c.enrolled.toLocaleString()} enrolled</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg border text-[11px] text-center" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
              NUR Education is free for schools and universities. Contact nur-education@nurfinans.com for institutional deployment.
              <br />
              <span className="font-mono" style={{ color: "#6366f1" }}>Compute-sharing agreement required — see Agreement tab.</span>
            </div>
          </div>
        )}

        {tab === "classroom" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#6366f1" }}>NUR TV — Classroom Mode</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>LIVE</span>
              </div>
              <div className="rounded-lg overflow-hidden" style={{ background: "#000", aspectRatio: "16/9" }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <span className="text-3xl">📺</span>
                    <p className="text-sm font-semibold" style={{ color: "#d4af37" }}>NUR TV Classroom Feed</p>
                    <p className="text-[11px]" style={{ color: "#64748b" }}>
                      Teacher-controlled broadcast with interactive Q&A overlay
                    </p>
                    <p className="text-[10px] font-mono" style={{ color: "#00d4aa" }}>
                      Stream loads when broadcast is active
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Students</p>
                  <p className="text-sm font-bold" style={{ color: "#00d4aa" }}>—</p>
                </div>
                <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Questions</p>
                  <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>—</p>
                </div>
                <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Duration</p>
                  <p className="text-sm font-bold" style={{ color: "#6366f1" }}>—</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <p className="text-[10px] font-mono mb-2" style={{ color: "#6366f1" }}>TEACHER TOOLS</p>
                <div className="space-y-1.5 text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  <p>• Start/pause broadcast</p>
                  <p>• Push quiz questions</p>
                  <p>• Highlight chart regions</p>
                  <p>• Mute/unmute Q&A</p>
                  <p>• Export attendance log</p>
                </div>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <p className="text-[10px] font-mono mb-2" style={{ color: "#00d4aa" }}>STUDENT VIEW</p>
                <div className="space-y-1.5 text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  <p>• Watch live feed</p>
                  <p>• Submit questions</p>
                  <p>• Answer quiz polls</p>
                  <p>• View market data (read-only)</p>
                  <p>• Access course materials</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "compute" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {!computeConsented ? (
              <div className="p-6 rounded-lg border text-center space-y-4" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <span className="text-4xl">⚡</span>
                <h3 className="text-lg font-semibold">Compute-Sharing Not Configured</h3>
                <p className="text-sm" style={{ color: "var(--ag-muted)" }}>
                  NUR Education is free because participating institutions share a portion of their
                  device CPU resources for distributed computing. Review and sign the agreement to activate.
                </p>
                <button
                  onClick={() => setTab("terms")}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  style={{ background: "#6366f1", color: "white" }}
                >
                  Review Agreement
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status */}
                <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: computeActive ? "rgba(0,212,170,0.3)" : "var(--ag-border)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Compute Sharing Status</span>
                    <button
                      onClick={() => setComputeActive(!computeActive)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                      style={{
                        background: computeActive ? "rgba(239,68,68,0.15)" : "rgba(0,212,170,0.15)",
                        color: computeActive ? "#ef4444" : "#00d4aa",
                      }}
                    >
                      {computeActive ? "⏹ PAUSE" : "▶ START"}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Hash Rate</p>
                      <p className="text-sm font-bold font-mono" style={{ color: computeActive ? "#00d4aa" : "var(--ag-muted)" }}>
                        {computeActive ? `${sessionHashRate} H/s` : "—"}
                      </p>
                    </div>
                    <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Your Earnings (20%)</p>
                      <p className="text-sm font-bold font-mono" style={{ color: "#f59e0b" }}>
                        ${(earnedTotal * 0.2).toFixed(6)}
                      </p>
                    </div>
                    <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>NUR Share (80%)</p>
                      <p className="text-sm font-bold font-mono" style={{ color: "#6366f1" }}>
                        ${(earnedTotal * 0.8).toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CPU slider */}
                <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">CPU Resource Limit</span>
                    <span className="text-sm font-bold font-mono" style={{ color: "#6366f1" }}>{cpuPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={cpuPercent}
                    onChange={e => setCpuPercent(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "#6366f1" }}
                  />
                  <div className="flex justify-between text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>
                    <span>10% (minimal)</span>
                    <span>80% (maximum)</span>
                  </div>
                </div>

                {/* Wallets */}
                <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                  <p className="text-xs font-semibold mb-3">Dual Wallet System</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded text-[11px]" style={{ background: "var(--ag-bg)" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
                        <span style={{ color: "var(--ag-muted)" }}>Your Wallet (20%)</span>
                      </div>
                      <span className="font-mono font-bold" style={{ color: "#f59e0b" }}>
                        ${(earnedTotal * 0.2).toFixed(6)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded text-[11px]" style={{ background: "var(--ag-bg)" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: "#6366f1" }} />
                        <span style={{ color: "var(--ag-muted)" }}>NUR Finance Wallet (80%)</span>
                      </div>
                      <span className="font-mono font-bold" style={{ color: "#6366f1" }}>
                        ${(earnedTotal * 0.8).toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] mt-2" style={{ color: "var(--ag-muted)" }}>
                    Revenue is split in real-time. Your 20% accumulates in your NUR wallet.
                    NUR Finance uses its 80% share to fund free educational services and platform operations.
                  </p>
                </div>

                {/* Electricity disclosure */}
                <div className="p-3 rounded-lg border-l-2" style={{ background: "rgba(239,68,68,0.05)", borderColor: "#ef4444" }}>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: "#ef4444" }}>Electricity Cost Notice</p>
                  <p className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
                    At {cpuPercent}% CPU, estimated electricity cost increase: ~${((cpuPercent / 100) * 0.08).toFixed(2)}-${((cpuPercent / 100) * 0.20).toFixed(2)}/day
                    (€{((cpuPercent / 100) * 0.08 * 30).toFixed(0)}-{((cpuPercent / 100) * 0.20 * 30).toFixed(0)}/month).
                    This cost is borne by the device owner, not NUR Finance.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "terms" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-5 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-base font-bold mb-1">NUR Education — Compute-Sharing Service Agreement</h3>
              <p className="text-[10px] font-mono mb-4" style={{ color: "var(--ag-muted)" }}>Version 1.0 — September 2026</p>

              <div className="space-y-4 text-[12px] leading-relaxed" style={{ color: "var(--ag-muted)" }}>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>1. Service Description</p>
                  <p>NUR Education provides free educational software including mathematics, language learning,
                    financial literacy courses, and NUR TV Classroom access. In exchange for free access,
                    users agree to share a configurable portion of their device&apos;s CPU processing power
                    for distributed computing (cryptocurrency mining).</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>2. Compute-Sharing Details</p>
                  <p><strong>What is shared:</strong> CPU processing power, up to a user-configurable maximum (10%-80%).<br />
                    <strong>What is computed:</strong> Cryptocurrency mining, with the optimal algorithm selected by NUR Finance systems.<br />
                    <strong>When it runs:</strong> Only while the NUR Education application is open and running.<br />
                    <strong>User control:</strong> You can pause, adjust, or stop compute-sharing at any time.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>3. Revenue Split</p>
                  <p>Mining revenue is split between two wallets:<br />
                    • <strong>80%</strong> to NUR Finance (funds free educational services and platform operations)<br />
                    • <strong>20%</strong> to your NUR wallet (your share, withdrawable)</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>4. Electricity Cost Disclosure</p>
                  <p className="p-2 rounded" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <strong style={{ color: "#ef4444" }}>IMPORTANT:</strong> Compute-sharing increases your device&apos;s electricity
                    consumption. At 30% CPU utilization, estimated additional cost: $0.02-$0.06/day ($0.60-$1.80/month).
                    At 80% CPU: $0.06-$0.16/day ($1.80-$4.80/month). This cost is borne by the device owner/operator.
                    Your 20% mining share may be less than the electricity cost increase.
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>5. Hardware Impact</p>
                  <p>CPU-bound compute-sharing produces additional heat and may reduce battery life on portable
                    devices. Mining is automatically throttled when the device is under high user load or on
                    battery power. Long-term hardware wear is minimal under normal operating conditions.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>6. Data Privacy</p>
                  <p>No personal data is collected beyond your wallet address. Compute-sharing transmits only
                    mining work units and results. No browsing data, files, or personal information leaves your device.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>7. Opt-Out Rights</p>
                  <p>You may stop compute-sharing at any time. Stopping compute-sharing revokes free access
                    to NUR Education services. Earned mining rewards in your wallet remain yours.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>8. Institutional Deployment</p>
                  <p>For school/university deployments: this agreement must be signed by an authorized
                    administrator. IT department approval is required. Mining runs only during configured
                    operating hours. Parent notification may be required by local jurisdiction.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--ag-border)" }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsRead}
                    onChange={e => setTermsRead(e.target.checked)}
                    className="mt-0.5"
                    style={{ accentColor: "#6366f1" }}
                  />
                  <span className="text-[12px]" style={{ color: "var(--ag-text)" }}>
                    I have read and understood this agreement. I acknowledge the electricity cost implications
                    and the 80/20 revenue split. I consent to CPU compute-sharing while using NUR Education.
                  </span>
                </label>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    disabled={!termsRead}
                    onClick={() => {
                      setComputeConsented(true);
                      setTab("compute");
                    }}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-30"
                    style={{ background: termsRead ? "#6366f1" : "#333", color: "white" }}
                  >
                    Accept & Activate
                  </button>
                  <span className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>
                    Digital consent — wet-ink signature required for institutional deployments
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
