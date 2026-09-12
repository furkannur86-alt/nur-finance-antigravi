"use client";

import { useState, useEffect } from "react";
import { cyberSound } from "@/lib/audio/sound-synth";

type EdTab = "courses" | "classroom" | "games" | "compute" | "terms";

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
  { id: "lang-tr", title: "Comparative Linguistics & Composition", subject: "language", level: "Secondary", lessons: 18, enrolled: 2400, icon: "🌐" },
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

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which financial metric measures risk-adjusted return relative to risk-free rate?",
    options: ["Sortino Ratio", "Sharpe Ratio", "Beta Coefficient", "Treynor Measure"],
    correct: 1,
    explanation: "Sharpe Ratio = (Rp - Rf) / σp measures excess return per unit of total risk (volatility).",
  },
  {
    id: 2,
    question: "What is the primary governing standard for reinforced concrete structural design in Europe?",
    options: ["Eurocode 1", "Eurocode 2", "Eurocode 7", "Eurocode 8"],
    correct: 1,
    explanation: "EN 1992 (Eurocode 2) specifically applies to the design of concrete, reinforced concrete, and prestressed concrete structures.",
  },
  {
    id: 3,
    question: "Under standard DCF Gordon Growth Model, what happens when discount rate (r) approaches terminal growth (g)?",
    options: ["Valuation approaches zero", "Valuation approaches infinity", "Valuation stays constant", "WACC inverts"],
    correct: 1,
    explanation: "As (r - g) approaches 0 from above, the denominator in P = CF / (r - g) approaches 0, sending valuation to infinity.",
  },
  {
    id: 4,
    question: "In clinical patient triage, a NEWS2 Aggregate Score of 7 or higher triggers which response?",
    options: ["Routine 12-hour review", "Low-level ward monitoring", "Emergency clinical team / ICU escalation", "Discharge order"],
    correct: 2,
    explanation: "NEWS2 score of 7+ indicates critical emergency threshold requiring immediate medical team escalation.",
  },
  {
    id: 5,
    question: "What is the maximum mathematical circulating supply of $NUR Sovereign Token?",
    options: ["21,000,000", "54,751,113", "100,000,000", "1,000,000,000"],
    correct: 1,
    explanation: "The invariant supply of $NUR is strictly governed at 54,751,113 NUR based on sovereign numerology.",
  },
];

export default function NurEducationPanel() {
  const [tab, setTab] = useState<EdTab>("courses");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [computeConsented, setComputeConsented] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [cpuPercent, setCpuPercent] = useState(30);
  const [computeActive, setComputeActive] = useState(false);
  const [earnedTotal, setEarnedTotal] = useState(0);
  const [sessionHashRate, setSessionHashRate] = useState(0);

  // Gamification: Portfolio Simulator State
  const [allocNur, setAllocNur] = useState(35);
  const [allocBtc, setAllocBtc] = useState(25);
  const [allocGold, setAllocGold] = useState(20);
  const [allocSpy, setAllocSpy] = useState(20);
  const [simYear, setSimYear] = useState(1);
  const [simPortfolioValue, setSimPortfolioValue] = useState(100000);
  const [simHistory, setSimHistory] = useState<{ year: number; value: number }[]>([{ year: 0, value: 100000 }]);
  const [claimedReward, setClaimedReward] = useState(false);

  // Gamification: Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (!computeActive) return;
    const iv = setInterval(() => {
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
    { id: "games", label: "🎮 Financial STEM Games" },
    { id: "compute", label: "⚡ Compute" },
    { id: "terms", label: "📋 Agreement" },
  ];

  // Portfolio Simulation Runner
  const runNextSimYear = () => {
    cyberSound.playClick();
    const nurReturn = 0.18 + (Math.random() * 0.2 - 0.05); // high growth
    const btcReturn = 0.12 + (Math.random() * 0.4 - 0.18); // volatile
    const goldReturn = 0.07 + (Math.random() * 0.1 - 0.03); // defensive
    const spyReturn = 0.09 + (Math.random() * 0.16 - 0.06); // equity

    const weightedReturn =
      (allocNur / 100) * nurReturn +
      (allocBtc / 100) * btcReturn +
      (allocGold / 100) * goldReturn +
      (allocSpy / 100) * spyReturn;

    const newValue = Math.round(simPortfolioValue * (1 + weightedReturn));
    const nextYear = simYear + 1;

    setSimYear(nextYear);
    setSimPortfolioValue(newValue);
    setSimHistory(prev => [...prev, { year: nextYear - 1, value: newValue }]);
  };

  const resetSim = () => {
    cyberSound.playRadarPing();
    setSimYear(1);
    setSimPortfolioValue(100000);
    setSimHistory([{ year: 0, value: 100000 }]);
    setClaimedReward(false);
  };

  // Quiz Option Selector
  const handleSelectQuizOption = (idx: number) => {
    if (selectedOption !== null) return;
    cyberSound.playClick();
    setSelectedOption(idx);
    if (idx === QUIZ_QUESTIONS[currentQIndex].correct) {
      setScore(s => s + 20);
      cyberSound.playQuantumUnlock();
    }
  };

  const handleNextQuestion = () => {
    cyberSound.playClick();
    if (currentQIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      cyberSound.playQuantumUnlock();
    }
  };

  const resetQuiz = () => {
    cyberSound.playClick();
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-wide" style={{ color: "#6366f1" }}>NUR Education & Academy</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
            SOVEREIGN STEM &amp; FINANCE
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
      <div className="flex items-center gap-1 px-3 py-2 border-b overflow-x-auto shrink-0" style={{ borderColor: "var(--ag-border)" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              cyberSound.playClick();
              setTab(t.id);
            }}
            className="px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap"
            style={{
              background: tab === t.id ? "rgba(99,102,241,0.2)" : "transparent",
              color: tab === t.id ? "#818cf8" : "var(--ag-muted)",
              fontWeight: tab === t.id ? 600 : 400,
              border: tab === t.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
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
                  onClick={() => {
                    cyberSound.playClick();
                    setSubjectFilter(s);
                  }}
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
                  className="p-4 rounded-xl border transition-all hover:border-opacity-80"
                  style={{ background: "var(--ag-surface)", borderColor: `${SUBJECT_COLORS[c.subject]}30`, borderWidth: 1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold"
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
          </div>
        )}

        {/* 🎮 Financial STEM Games & Quiz Simulator */}
        {tab === "games" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Game 1: Sovereign Portfolio Simulator */}
            <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/70 to-slate-950 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💼</span>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-300">Sovereign Wealth Asset Allocator Game</h3>
                    <p className="text-[11px] text-slate-400">Allocate $100,000 institutional treasury across sovereign asset classes &amp; survive macro cycles.</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block">CURRENT VALUE</span>
                  <span className={`text-base font-bold ${simPortfolioValue >= 100000 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${simPortfolioValue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3 rounded-xl border border-white/5 mb-4 text-[11px]">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400 font-bold">$NUR Token</span>
                    <span className="font-mono text-white">{allocNur}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocNur}
                    onChange={(e) => setAllocNur(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-400 font-bold">Bitcoin</span>
                    <span className="font-mono text-white">{allocBtc}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocBtc}
                    onChange={(e) => setAllocBtc(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-yellow-300 font-bold">Physical Gold</span>
                    <span className="font-mono text-white">{allocGold}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocGold}
                    onChange={(e) => setAllocGold(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">S&amp;P 500</span>
                    <span className="font-mono text-white">{allocSpy}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocSpy}
                    onChange={(e) => setAllocSpy(Number(e.target.value))}
                    className="w-full accent-blue-400"
                  />
                </div>
              </div>

              {/* Action buttons & simulation progression */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={runNextSimYear}
                    className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
                  >
                    ⏩ SIMULATE YEAR {simYear}
                  </button>
                  <button
                    onClick={resetSim}
                    className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white border border-slate-700"
                  >
                    RESET
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Total Return: <span className={simPortfolioValue >= 100000 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {(((simPortfolioValue - 100000) / 100000) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Game 2: Financial & STEM Knowledge Blitz Quiz */}
            <div className="p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300">Quantitative STEM &amp; Financial Literacy Blitz</h3>
                    <p className="text-[11px] text-slate-400">Test your mastery of multi-disciplinary valuation, engineering, and sovereign metrics.</p>
                  </div>
                </div>
                <div className="font-mono text-xs text-right">
                  <span className="text-slate-500 block text-[10px]">CURRENT SCORE</span>
                  <span className="text-emerald-400 font-bold text-sm">{score} / 100 PTS</span>
                </div>
              </div>

              {!quizFinished ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span className="text-cyan-400 font-bold">+20 PTS</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    {QUIZ_QUESTIONS[currentQIndex].question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].correct;
                      let btnStyle = "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/80";
                      if (selectedOption !== null) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold";
                        } else if (isSelected) {
                          btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300 font-bold";
                        }
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx)}
                          className={`text-left p-3 rounded-xl border text-xs transition-all ${btnStyle}`}
                        >
                          <span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOption !== null && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-[11px] leading-relaxed">
                      <span className="font-bold text-cyan-400 block mb-1">Explanation:</span>
                      <p className="text-slate-300">{QUIZ_QUESTIONS[currentQIndex].explanation}</p>
                      <button
                        onClick={handleNextQuestion}
                        className="mt-3 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                      >
                        {currentQIndex + 1 < QUIZ_QUESTIONS.length ? "NEXT QUESTION →" : "FINISH QUIZ 🏆"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-4xl">🏆</span>
                  <h4 className="text-base font-bold text-white font-serif">Assessment Completed!</h4>
                  <p className="text-xs text-slate-300">
                    You scored <span className="text-emerald-400 font-mono font-bold text-sm">{score}</span> out of 100 points.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      RETAKE QUIZ
                    </button>
                    {!claimedReward ? (
                      <button
                        onClick={() => {
                          cyberSound.playQuantumUnlock();
                          setClaimedReward(true);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
                      >
                        🎁 CLAIM 50 $NUR TOKENS
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        ✅ REWARD CLAIMED (NUR-54751113)
                      </span>
                    )}
                  </div>
                </div>
              )}
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
                      Teacher-controlled broadcast with interactive Q&amp;A overlay
                    </p>
                    <p className="text-[10px] font-mono" style={{ color: "#00d4aa" }}>
                      Stream loads when broadcast is active
                    </p>
                  </div>
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
                  onClick={() => {
                    cyberSound.playClick();
                    setTab("terms");
                  }}
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
                      onClick={() => {
                        cyberSound.playClick();
                        setComputeActive(!computeActive);
                      }}
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
                    for distributed computing.</p>
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
                    I have read and understood this agreement. I consent to CPU compute-sharing while using NUR Education.
                  </span>
                </label>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    disabled={!termsRead}
                    onClick={() => {
                      cyberSound.playQuantumUnlock();
                      setComputeConsented(true);
                      setTab("compute");
                    }}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-30"
                    style={{ background: termsRead ? "#6366f1" : "#333", color: "white" }}
                  >
                    Accept &amp; Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
