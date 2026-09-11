"use client";

import { useState, useEffect, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import { getStoredSovereignWallet, generateSovereignWallet, updateSovereignWallet, addWalletTransaction } from "@/lib/crypto/sovereignWallet";

export type ProfessionCategory = "MEDICAL" | "ENGINEERING" | "EDUCATION" | "LEGAL" | "FINANCE";

export default function ProfessionalAIHubPanel() {
  const { openFloatingWindow, popoutToNativeWindow } = useIDEStore();

  const [activeCategory, setActiveCategory] = useState<ProfessionCategory>("MEDICAL");
  const [computeMode, setComputeMode] = useState<"ECO" | "BALANCED" | "TURBO">("BALANCED");
  const [isComputeRunning, setIsComputeRunning] = useState(true);
  const [sessionHashCount, setSessionHashCount] = useState(13542);
  const [earnedTokens, setEarnedTokens] = useState(0.45);

  // Medical state
  const [selectedDrugA, setSelectedDrugA] = useState("Warfarin (Anticoagulant)");
  const [selectedDrugB, setSelectedDrugB] = useState("Amiodarone (Antiarrhythmic)");
  const [selectedBiomarker, setSelectedBiomarker] = useState("Troponin I (High-Sensitivity)");
  const [biomarkerValue, setBiomarkerValue] = useState(48.5);

  // Engineering state
  const [beamSpanMeters, setBeamSpanMeters] = useState(6.0);
  const [beamUniformLoadKN, setBeamUniformLoadKN] = useState(25.0);
  const [concreteGrade, setConcreteGrade] = useState("C30/37");
  const [curingDays, setCuringDays] = useState(28);

  // Education state
  const [targetLanguage, setTargetLanguage] = useState("English ➔ German");
  const [cefrLevel, setCefrLevel] = useState("B2 (Upper Intermediate)");
  const [sampleSentence, setSampleSentence] = useState("The macroeconomic equilibrium was disrupted by systemic liquidity shocks.");

  // Legal state
  const [contractJurisdiction, setContractJurisdiction] = useState("England & Wales (Common Law)");
  const [liabilityCapMultiplier, setLiabilityCapMultiplier] = useState(1.5);
  const [sanctionsEntityName, setSanctionsEntityName] = useState("Gazprom Neft International");

  // Load wallet
  const [walletAddress, setWalletAddress] = useState<string>("0xNUR...");

  useEffect(() => {
    let w = getStoredSovereignWallet();
    if (!w) {
      generateSovereignWallet().then((nw) => setWalletAddress(nw.address));
    } else {
      setWalletAddress(w.address);
    }
  }, []);

  // Background Compute Simulation Tick
  useEffect(() => {
    if (!isComputeRunning) return;
    const interval = setInterval(() => {
      const increment = computeMode === "ECO" ? 18 : computeMode === "BALANCED" ? 42 : 110;
      setSessionHashCount((h) => h + increment);
      setEarnedTokens((t) => +(t + (increment * 0.00002)).toFixed(5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isComputeRunning, computeMode]);

  // Engineering calculations
  const maxBendingMomentKNm = useMemo(() => {
    // M = w * L^2 / 8
    return +((beamUniformLoadKN * Math.pow(beamSpanMeters, 2)) / 8).toFixed(2);
  }, [beamUniformLoadKN, beamSpanMeters]);

  const maxShearForceKN = useMemo(() => {
    // V = w * L / 2
    return +((beamUniformLoadKN * beamSpanMeters) / 2).toFixed(2);
  }, [beamUniformLoadKN, beamSpanMeters]);

  // Concrete strength curve
  const concreteStrengthMPa = useMemo(() => {
    const baseFck = concreteGrade === "C20/25" ? 25 : concreteGrade === "C30/37" ? 37 : 50;
    const betaCc = Math.exp(0.25 * (1 - Math.sqrt(28 / curingDays)));
    return +(baseFck * betaCc).toFixed(1);
  }, [concreteGrade, curingDays]);

  return (
    <div className="flex flex-col h-full bg-[#030914] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP HEADER & COMPUTE CLUSTER STATUS ────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono border border-emerald-500/40">
                100% FREE PROFESSIONAL AI SUITE
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono border border-cyan-500/40">
                POWERED BY SOVEREIGN DePIN COMPUTE
              </span>
            </div>
            <h1 className="text-sm font-bold text-white font-serif tracking-wide mt-0.5">
              Multi-Profession AI Workstation & Distributed GPU Cluster
            </h1>
          </div>
        </div>

        {/* Compute Throttle & Reward Pill */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Real-time Mining Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">HASHES:</span>
            <span className="text-white font-bold">{sessionHashCount.toLocaleString()} H/s</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">EARNED:</span>
            <span className="text-cyan-300 font-bold">+{earnedTokens} $NUR</span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/10 text-[10px]">
            {(["ECO", "BALANCED", "TURBO"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setComputeMode(m)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  computeMode === m
                    ? "bg-cyan-500 text-black shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => openFloatingWindow("compute-access", "⚡ Compute-for-Access Sovereign DePIN")}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 text-xs font-bold"
          >
            🔐 WALLET: {walletAddress.substring(0, 8)}...
          </button>

          {/* Float & Popout */}
          <button
            onClick={() => openFloatingWindow("professional-ai", "🩺 Professional AI Hub & DePIN Cluster")}
            className="px-2 py-1.5 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
            title="Open in floating window"
          >
            ⤢ FLOAT
          </button>
          <button
            onClick={() => popoutToNativeWindow("professional-ai")}
            className="px-2 py-1.5 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
            title="Pop out to separate window"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── PROFESSION TABS ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#040e20] border-b border-cyan-500/20 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: "MEDICAL", label: "🩺 Medical & Clinical AI", desc: "Doctors, Surgeons & Nurses" },
          { id: "ENGINEERING", label: "🏗️ Civil & Structural Engineering", desc: "Civil Engineers, Architects & Builders" },
          { id: "EDUCATION", label: "🎓 Language & Education AI", desc: "Language Teachers & Academics" },
          { id: "LEGAL", label: "⚖️ Legal & Regulatory Compliance", desc: "Corporate Counsel & Compliance Officers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as ProfessionCategory)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 text-left ${
              activeCategory === tab.id
                ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-lg"
                : "bg-black/40 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-[9px] font-normal opacity-70 mt-0.5">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* ── MAIN WORKBENCH CONTENT ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ── TAB 1: MEDICAL & CLINICAL DIAGNOSTIC AI ─────────────────────── */}
        {activeCategory === "MEDICAL" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card 1: Drug-Drug Interaction Matrix */}
            <div className="rounded-2xl border border-red-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">💊 CYP450 DRUG-DRUG INTERACTION ANALYZER</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                  CRITICAL CONTRAINDICATION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PRIMARY MEDICATION (DRUG A):</label>
                  <select
                    value={selectedDrugA}
                    onChange={(e) => setSelectedDrugA(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  >
                    <option>Warfarin (Anticoagulant)</option>
                    <option>Clopidogrel (Antiplatelet)</option>
                    <option>Simvastatin (Statin)</option>
                    <option>Metformin (Biguanide)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CONCOMITANT MEDICATION (DRUG B):</label>
                  <select
                    value={selectedDrugB}
                    onChange={(e) => setSelectedDrugB(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  >
                    <option>Amiodarone (Antiarrhythmic)</option>
                    <option>Fluconazole (Antifungal)</option>
                    <option>Omeprazole (PPI)</option>
                    <option>Ciprofloxacin (Fluoroquinolone)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs space-y-1.5">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <span>⚠️ Severe Interaction Detected: CYP2C9 & CYP3A4 Inhibition</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Amiodarone potentates Warfarin anticoagulant effect by inhibiting CYP2C9 metabolism. 
                  International Normalized Ratio (INR) may surge above <strong>4.5</strong>, creating acute hemorrhage risk.
                </p>
                <div className="text-[10px] text-amber-300 pt-1 border-t border-red-500/20">
                  Recommendation: Reduce Warfarin dose by <strong>33% to 50%</strong> upon Amiodarone initiation and monitor INR at 72-hour intervals.
                </div>
              </div>
            </div>

            {/* Card 2: Lab Biomarker & Blood Panel Diagnostic */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-bold">🧪 BIOMARKER & ACUTE LAB PANEL INTERPRETER</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  ICD-11: I21.0
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">BIOMARKER ASSAY:</label>
                  <select
                    value={selectedBiomarker}
                    onChange={(e) => setSelectedBiomarker(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  >
                    <option>Troponin I (High-Sensitivity)</option>
                    <option>HbA1c (Glycated Hemoglobin)</option>
                    <option>eGFR (CKD-EPI Formula)</option>
                    <option>Serum Ferritin & CRP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PATIENT MEASURED VALUE (ng/L):</label>
                  <input
                    type="number"
                    value={biomarkerValue}
                    onChange={(e) => setBiomarkerValue(+e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-cyan-300 font-bold">
                  <span>CLINICAL INTERPRETATION:</span>
                  <span className="text-red-400 font-mono">99th PERCENTILE UPPER REFERENCE EXCEEDED</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  High-sensitivity Troponin I at <strong>{biomarkerValue} ng/L</strong> (Normal threshold: &lt; 14.0 ng/L in females, &lt; 26.0 ng/L in males) indicates acute myocardial injury.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/20 text-[10px]">
                  <div>ICD-11 Code: <strong>BA40 (Acute Myocardial Infarction)</strong></div>
                  <div>Urgency Score: <strong className="text-red-400">EMERGENCY STAT</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CIVIL & STRUCTURAL ENGINEERING ───────────────────────── */}
        {activeCategory === "ENGINEERING" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card 1: Structural Beam Loading Calculator */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-amber-300 font-bold">📐 EUROCODE 2 / ACI 318 BEAM BENDING MOMENT</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  SIMPLY SUPPORTED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">BEAM CLEAR SPAN (L, meters):</label>
                  <input
                    type="range"
                    min={2}
                    max={18}
                    step={0.5}
                    value={beamSpanMeters}
                    onChange={(e) => setBeamSpanMeters(+e.target.value)}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-amber-300 font-bold text-xs mt-1">{beamSpanMeters} meters</div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">UNIFORM DEAD + LIVE LOAD (w, kN/m):</label>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={beamUniformLoadKN}
                    onChange={(e) => setBeamUniformLoadKN(+e.target.value)}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-amber-300 font-bold text-xs mt-1">{beamUniformLoadKN} kN/m</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20">
                  <div className="text-slate-400 text-[10px]">MAX BENDING MOMENT (M_max)</div>
                  <div className="text-lg font-bold text-amber-300">{maxBendingMomentKNm} kN·m</div>
                  <div className="text-[9px] text-slate-500">M = (w · L²) / 8</div>
                </div>
                <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20">
                  <div className="text-slate-400 text-[10px]">MAX SHEAR FORCE (V_max)</div>
                  <div className="text-lg font-bold text-cyan-300">{maxShearForceKN} kN</div>
                  <div className="text-[9px] text-slate-500">V = (w · L) / 2</div>
                </div>
              </div>
            </div>

            {/* Card 2: Concrete Curing & Compressive Strength Curve */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="text-emerald-300 font-bold">🏗️ CONCRETE HYDRATION & CURING KINETICS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  EN 1992-1-1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CONCRETE CLASS:</label>
                  <select
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  >
                    <option>C20/25 (Foundations)</option>
                    <option>C30/37 (Structural Slabs & Columns)</option>
                    <option>C40/50 (High-Rise Pre-Stressed)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CURING AGE ({curingDays} Days):</label>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={curingDays}
                    onChange={(e) => setCuringDays(+e.target.value)}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300">COMPRESSIVE STRENGTH AT DAY {curingDays}:</span>
                  <span className="text-emerald-300 font-mono text-base">{concreteStrengthMPa} MPa</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (concreteStrengthMPa / 37) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Formwork Stripping: {curingDays >= 7 ? "✅ SAFE TO STRIP (>70%)" : "❌ HOLD (Curing Incomplete)"}</span>
                  <span>Target 28-day: 37.0 MPa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: LANGUAGE & EDUCATION AI ACADEMY ──────────────────────── */}
        {activeCategory === "EDUCATION" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-purple-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                <span className="text-purple-300 font-bold">🎓 CEFR LINGUISTIC PARSER & SYNTAX GRADER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  {cefrLevel}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">LANGUAGE PAIR & CEFR TARGET:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                    >
                      <option>English ➔ German</option>
                      <option>English ➔ Turkish</option>
                      <option>English ➔ Mandarin</option>
                      <option>English ➔ Arabic</option>
                    </select>
                    <select
                      value={cefrLevel}
                      onChange={(e) => setCefrLevel(e.target.value)}
                      className="p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                    >
                      <option>A2 (Elementary)</option>
                      <option>B1 (Intermediate)</option>
                      <option>B2 (Upper Intermediate)</option>
                      <option>C1 (Advanced Academic)</option>
                      <option>C2 (Mastery / Native)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">SAMPLE STUDENT TEXT TO EVALUATE:</label>
                  <textarea
                    rows={3}
                    value={sampleSentence}
                    onChange={(e) => setSampleSentence(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
                <div className="font-bold text-purple-300">AUTOMATED LINGUISTIC BREAKDOWN:</div>
                <div className="text-[11px] text-slate-300">
                  • Lexical Density: <strong>78.4%</strong> (Sophisticated academic register)
                  <br />• Morphosyntax: Passive construction (<em>&ldquo;was disrupted by&rdquo;</em>) properly aligns with <strong>C1 Academic</strong> competence.
                </div>
              </div>
            </div>

            {/* Phonetic Pronunciation Scorer */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-300 font-bold">🎙️ REAL-TIME PHONETIC PROSODICS & FORMANT ANALYZER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  IPA ACCURACY: 94.2%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center space-y-3 font-mono">
                <div className="text-xs text-slate-400">INTERNATIONAL PHONETIC ALPHABET (IPA):</div>
                <div className="text-base text-cyan-300 font-bold tracking-widest">
                  /ˌmækroʊˌiːkəˈnɒmɪk ˌiːkwɪˈlɪbriəm/
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 pt-2 border-t border-white/10">
                  <div className="p-2 rounded bg-slate-900 border border-white/5">
                    <div>PITCH VARIANCE</div>
                    <div className="text-emerald-400 font-bold mt-0.5">142 Hz (Natural)</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-white/5">
                    <div>FORMANT F1/F2</div>
                    <div className="text-cyan-400 font-bold mt-0.5">520 / 1840 Hz</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-white/5">
                    <div>STRESS ACCURACY</div>
                    <div className="text-purple-400 font-bold mt-0.5">98.5% Exact</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: LEGAL & REGULATORY COMPLIANCE ────────────────────────── */}
        {activeCategory === "LEGAL" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-amber-300 font-bold">⚖️ CONTRACTUAL INDEMNITY & LIABILITY RISK RATING</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  HIGH EXPOSURE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">GOVERNING JURISDICTION:</label>
                  <select
                    value={contractJurisdiction}
                    onChange={(e) => setContractJurisdiction(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  >
                    <option>England & Wales (Common Law)</option>
                    <option>State of New York (Delaware / NY)</option>
                    <option>Switzerland (Zurich Chamber of Commerce)</option>
                    <option>Singapore International Arbitration Centre (SIAC)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">AGGREGATE LIABILITY CAP (× Contract Value):</label>
                  <input
                    type="number"
                    step={0.5}
                    value={liabilityCapMultiplier}
                    onChange={(e) => setLiabilityCapMultiplier(+e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
                <div className="font-bold text-amber-300">ARBITRATION & INDEMNIFICATION SUMMARY:</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Under <strong>{contractJurisdiction}</strong>, consequential and indirect damage exclusions must be explicitly severable from direct breach covenants.
                  A <strong>{liabilityCapMultiplier}×</strong> cap provides reasonable risk shielding for the service provider.
                </p>
              </div>
            </div>

            {/* Sanctions & AML Screening */}
            <div className="rounded-2xl border border-red-500/30 bg-slate-950/80 p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                <span className="text-red-400 font-bold">🚫 OFAC / EU / UN GLOBAL SANCTIONS & PEP MATRIX</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                  SDN WATCHLIST MATCH
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">TARGET ENTITY / VESSEL / UBO NAME:</label>
                  <input
                    type="text"
                    value={sanctionsEntityName}
                    onChange={(e) => setSanctionsEntityName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-red-300 font-bold">
                  <span>SANCTION SCREENING RESULT:</span>
                  <span className="text-red-400 font-mono">SECTORAL SANCTIONS IDENTIFICATION (SSI)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Entity is designated under <strong>OFAC SSI Directive 2 & EU Regulation No 833/2014</strong>. 
                  Prohibits extending debt or capital finance exceeding 30-day maturity. Secondary sanctions risk applies to foreign financial institutions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
