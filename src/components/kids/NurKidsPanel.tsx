"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";

// Deliberately parent-supervised, NOT a live AI chat agent for children — building an
// unsupervised child-facing AI without real safeguarding infra (verified parental
// consent, content moderation, data minimization) would be irresponsible for this
// audience. This is a course-progress tracker + family fund dashboard, viewed by the
// parent, with mock lesson data — same demo-scope pattern as the rest of this app.

interface Course {
  id: string;
  subject: string;
  icon: string;
  ageRange: string;
  lessonsTotal: number;
  lessonsCompleted: number;
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  courses: Course[];
}

const CATALOG_COURSES: Course[] = [
  { id: "c-en",     subject: "English",            icon: "🇬🇧", ageRange: "6–12",  lessonsTotal: 40, lessonsCompleted: 0 },
  { id: "c-de",     subject: "German",             icon: "🇩🇪", ageRange: "8–14",  lessonsTotal: 36, lessonsCompleted: 0 },
  { id: "c-tr",     subject: "Turkish",            icon: "🇹🇷", ageRange: "6–12",  lessonsTotal: 32, lessonsCompleted: 0 },
  { id: "c-math",   subject: "Financial Literacy", icon: "💰", ageRange: "8–14",  lessonsTotal: 24, lessonsCompleted: 0 },
  { id: "c-inv",    subject: "Investing 101",      icon: "📈", ageRange: "12–17", lessonsTotal: 18, lessonsCompleted: 0 },
  { id: "c-stem",   subject: "STEM Fundamentals",  icon: "🔬", ageRange: "7–13",  lessonsTotal: 30, lessonsCompleted: 0 },
  { id: "c-code",   subject: "Beginner Coding",    icon: "💻", ageRange: "9–15",  lessonsTotal: 20, lessonsCompleted: 0 },
  { id: "c-py",     subject: "Python Programming", icon: "🐍", ageRange: "11–17", lessonsTotal: 26, lessonsCompleted: 0 },
  { id: "c-hist",   subject: "World History",      icon: "📜", ageRange: "10–16", lessonsTotal: 22, lessonsCompleted: 0 },
  { id: "c-env",    subject: "Climate & Nature",   icon: "🌿", ageRange: "6–12",  lessonsTotal: 16, lessonsCompleted: 0 },
  { id: "c-music",  subject: "Music Theory",       icon: "🎵", ageRange: "6–12",  lessonsTotal: 18, lessonsCompleted: 0 },
  { id: "c-entre",  subject: "Young Entrepreneur", icon: "🚀", ageRange: "12–17", lessonsTotal: 14, lessonsCompleted: 0 },
];

const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: "child-1",
    name: "Zeynep",
    age: 9,
    courses: [
      { id: "c-en", subject: "English", icon: "🇬🇧", ageRange: "6-12", lessonsTotal: 40, lessonsCompleted: 27 },
      { id: "c-math", subject: "Financial Literacy", icon: "💰", ageRange: "8-14", lessonsTotal: 24, lessonsCompleted: 10 },
      { id: "c-stem", subject: "STEM Fundamentals", icon: "🔬", ageRange: "7-13", lessonsTotal: 30, lessonsCompleted: 18 },
      { id: "c-code", subject: "Beginner Coding", icon: "💻", ageRange: "9-15", lessonsTotal: 20, lessonsCompleted: 4 },
    ],
  },
  {
    id: "child-2",
    name: "Ege",
    age: 12,
    courses: [
      { id: "c-de", subject: "German", icon: "🇩🇪", ageRange: "10-16", lessonsTotal: 40, lessonsCompleted: 12 },
      { id: "c-hist", subject: "History", icon: "📜", ageRange: "10-16", lessonsTotal: 18, lessonsCompleted: 18 },
      { id: "c-code", subject: "Coding (Python)", icon: "💻", ageRange: "11-17", lessonsTotal: 26, lessonsCompleted: 9 },
    ],
  },
];

export default function NurKidsPanel() {
  const { addNotification } = useIDEStore();

  const [children] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog">("dashboard");

  // Family compute-sharing (reuses the same opt-in, disclosed model as Nur Unix — a
  // parent's household hardware, not a child's) — earnings attributed to the fund.
  const [familyComputeSharingEnabled, setFamilyComputeSharingEnabled] = useState(false);
  const [childFundUSDT, setChildFundUSDT] = useState(1240);

  const selectedChild = children.find((c) => c.id === selectedChildId)!;

  const toggleFamilyComputeSharing = () => {
    cyberSound.playClick();
    setFamilyComputeSharingEnabled((prev) => {
      const next = !prev;
      addNotification({
        title: next ? "💻 Family Device Sharing Enabled" : "⏸️ Family Device Sharing Stopped",
        message: next
          ? "This is a browser-in-app demo. In a real product, income from the parent's own voluntarily shared home hardware is credited to the child's fund — the family home computer, not the child's device."
          : "Sharing stopped.",
        severity: "INFO",
        category: "SYSTEM",
      });
      return next;
    });
  };

  const handleAddDemoEarning = () => {
    cyberSound.playClick();
    setChildFundUSDT((v) => v + 25);
    addNotification({
      title: "🐷 Added to Fund (Demo)",
      message: `25 USDT added to ${selectedChild.name}'s future fund.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">NUR KIDS — Education & Future Fund (Parent Panel)</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PARENT SUPERVISED &bull; DEMO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              This panel is for parents only — it is not an AI chat tool that interacts directly with children.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {(
            [
              { id: "dashboard" as const, label: "👨‍👩‍👧 Parent Panel" },
              { id: "catalog" as const, label: "📚 Course Catalog" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                cyberSound.playClick();
                setActiveTab(t.id);
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                activeTab === t.id ? "bg-amber-500 text-black shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Child Selector */}
          <div className="flex gap-2">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedChildId === c.id ? "bg-amber-500 text-black" : "bg-black/40 text-slate-300 border border-white/10 hover:border-white/30"
                }`}
              >
                {c.name} ({c.age})
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Compliance Notice */}
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[11px] text-amber-200 leading-relaxed">
                ⚠️ This is a conceptual demo. A real children's fund product requires a licensed custodial account provider, parental identity
                verification, and a separate privacy/consent process for child data (GDPR-K/COPPA) — none of which has been established yet.
              </div>

              {/* Course Progress */}
              <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-3">
                <h3 className="text-sm font-bold text-white font-serif">{selectedChild.name} — Education Progress</h3>
                <div className="space-y-2">
                  {selectedChild.courses.map((c) => {
                    const pct = Math.round((c.lessonsCompleted / c.lessonsTotal) * 100);
                    return (
                      <div key={c.id} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-white font-bold">{c.icon} {c.subject}</span>
                          <span className="text-slate-400 font-mono">{c.lessonsCompleted}/{c.lessonsTotal} lessons ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Family Fund */}
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-300 font-serif">🐷 {selectedChild.name}'s Future Fund</h3>
                  <span className="text-lg font-bold font-mono text-emerald-300">{childFundUSDT.toLocaleString()} USDT</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Conceptual model: fund is held until age 18, with the parent/guardian having flexible access in emergencies. A real implementation
                  would require a licensed custodial account (e.g. a Kinderkonto-style structure in Germany).
                </p>
                <button
                  onClick={handleAddDemoEarning}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                >
                  + Add Demo Earning
                </button>
              </div>

              {/* Family Compute Sharing (parent's device, opt-in) */}
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-black/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300 font-serif">💻 Family Device Sharing (Parent's Device)</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Income from the parent's voluntarily shared home computer — not the child's device — is credited to the fund. Off by default.
                    </p>
                  </div>
                  <button
                    onClick={toggleFamilyComputeSharing}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-colors ${
                      familyComputeSharingEnabled
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    }`}
                  >
                    {familyComputeSharingEnabled ? "STOP" : "ENABLE"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-serif">Full Course Catalog</h3>
                <span className="text-[10px] text-slate-400">{CATALOG_COURSES.length} courses available</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATALOG_COURSES.map((c) => {
                  const enrolled = selectedChild.courses.find(sc => sc.id === c.id);
                  const pct = enrolled ? Math.round((enrolled.lessonsCompleted / enrolled.lessonsTotal) * 100) : 0;
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border transition-all hover:border-amber-500/30"
                      style={{
                        background: enrolled ? "rgba(251,191,36,0.04)" : "rgba(0,0,0,0.4)",
                        borderColor: enrolled ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.icon}</span>
                          <div>
                            <div className="text-[12px] font-bold text-white">{c.subject}</div>
                            <div className="text-[10px] text-slate-400">Ages {c.ageRange} · {c.lessonsTotal} lessons</div>
                          </div>
                        </div>
                        {enrolled && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                            ENROLLED
                          </span>
                        )}
                      </div>
                      {enrolled && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                            <span>{enrolled.lessonsCompleted}/{enrolled.lessonsTotal} lessons</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                      {!enrolled && (
                        <button
                          onClick={() => addNotification({ title: "Demo — Enrollment", message: `In production: enroll ${selectedChild.name} in ${c.subject}.`, severity: "INFO", category: "SYSTEM" })}
                          className="mt-2 w-full py-1 rounded-lg text-[10px] font-bold transition-colors"
                          style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
                        >
                          + Enroll {selectedChild.name}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 border-t border-white/10 pt-3">
                Course content delivered via curated third-party curricula (Khan Academy, Duolingo API, Coursera). Enrollment management is parent-controlled. Not an AI chat tool.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
