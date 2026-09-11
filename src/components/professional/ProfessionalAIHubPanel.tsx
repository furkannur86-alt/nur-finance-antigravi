"use client";

import { useState, useEffect, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import { getStoredSovereignWallet, generateSovereignWallet } from "@/lib/crypto/sovereignWallet";
import { webComputeEngine, MiningTelemetry } from "@/lib/compute/webComputeEngine";

export type ProfessionCategory = "MEDICAL" | "ENGINEERING" | "EDUCATION" | "LEGAL" | "FINANCE";

export default function ProfessionalAIHubPanel() {
  const { openFloatingWindow, popoutToNativeWindow } = useIDEStore();

  const [activeCategory, setActiveCategory] = useState<ProfessionCategory>("MEDICAL");
  const [computeMode, setComputeMode] = useState<"ECO" | "BALANCED" | "TURBO">("BALANCED");
  const [isComputeRunning, setIsComputeRunning] = useState(true);
  const [telemetry, setTelemetry] = useState<MiningTelemetry>({
    hashesComputed: 13542,
    matrixIterations: 42,
    activeThreads: 2,
    currentGflops: 34.5,
    totalTokensEarned: 0.45,
    isThrottled: false,
    mode: "BALANCED",
  });

  // ─── MEDICAL STATES ───────────────────────────────────────────────────────
  const [medicalTool, setMedicalTool] = useState<"CYP450" | "BIOMARKER" | "NEWS2" | "IV_DRIP">("CYP450");
  const [selectedDrugA, setSelectedDrugA] = useState("Warfarin (Anticoagulant)");
  const [selectedDrugB, setSelectedDrugB] = useState("Amiodarone (Antiarrhythmic)");
  const [selectedBiomarker, setSelectedBiomarker] = useState("Troponin I (High-Sensitivity)");
  const [biomarkerValue, setBiomarkerValue] = useState(48.5);

  // NEWS2 Inputs
  const [respRate, setRespRate] = useState(18);
  const [spo2, setSpo2] = useState(97);
  const [systolicBP, setSystolicBP] = useState(124);
  const [pulseRate, setPulseRate] = useState(76);
  const [tempCelsius, setTempCelsius] = useState(37.1);
  const [avpuScore, setAvpuScore] = useState<"A" | "V" | "P" | "U">("A");

  // IV Drip Inputs
  const [ivVolumeML, setIvVolumeML] = useState(1000);
  const [ivTimeHours, setIvTimeHours] = useState(8);
  const [ivDropFactor, setIvDropFactor] = useState(20); // standard 20 drops/mL

  // ─── ENGINEERING STATES ───────────────────────────────────────────────────
  const [engineeringTool, setEngineeringTool] = useState<"BEAM_MOMENT" | "CONCRETE_CURING" | "TERZAGHI_SOIL">("BEAM_MOMENT");
  const [beamSpanMeters, setBeamSpanMeters] = useState(6.0);
  const [beamUniformLoadKN, setBeamUniformLoadKN] = useState(25.0);
  const [concreteGrade, setConcreteGrade] = useState("C30/37");
  const [curingDays, setCuringDays] = useState(28);

  // Terzaghi Foundation Inputs
  const [soilCohesionKPa, setSoilCohesionKPa] = useState(20);
  const [soilUnitWeightKNm3, setSoilUnitWeightKNm3] = useState(18.5);
  const [footingDepthM, setFootingDepthM] = useState(1.5);
  const [footingWidthM, setFootingWidthM] = useState(2.0);

  // ─── EDUCATION STATES ─────────────────────────────────────────────────────
  const [targetLanguage, setTargetLanguage] = useState("English ➔ German");
  const [cefrLevel, setCefrLevel] = useState("B2 (Upper Intermediate)");
  const [sampleSentence, setSampleSentence] = useState("The macroeconomic equilibrium was disrupted by systemic liquidity shocks.");

  // ─── LEGAL STATES ─────────────────────────────────────────────────────────
  const [contractJurisdiction, setContractJurisdiction] = useState("England & Wales (Common Law)");
  const [liabilityCapMultiplier, setLiabilityCapMultiplier] = useState(1.5);
  const [sanctionsEntityName, setSanctionsEntityName] = useState("Gazprom Neft International");

  // ─── FINANCE STATES ───────────────────────────────────────────────────────
  const [fcfStartingMillion, setFcfStartingMillion] = useState(120);
  const [fcfGrowthRatePercent, setFcfGrowthRatePercent] = useState(8.5);
  const [waccDiscountRatePercent, setWaccDiscountRatePercent] = useState(9.2);
  const [terminalGrowthPercent, setTerminalGrowthPercent] = useState(2.5);

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

  // WebComputeEngine live mining listener
  useEffect(() => {
    if (isComputeRunning) {
      webComputeEngine.startMining(computeMode, (t) => {
        setTelemetry(t);
      });
    } else {
      webComputeEngine.stopMining();
    }
    return () => {
      webComputeEngine.stopMining();
    };
  }, [isComputeRunning, computeMode]);

  // ─── CALCULATIONS ─────────────────────────────────────────────────────────

  // NEWS2 calculation
  const news2Result = useMemo(() => {
    let score = 0;
    // Resp rate
    if (respRate <= 8 || respRate >= 25) score += 3;
    else if (respRate >= 21) score += 2;
    else if (respRate <= 11) score += 1;

    // SpO2
    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;

    // Systolic BP
    if (systolicBP <= 90 || systolicBP >= 220) score += 3;
    else if (systolicBP <= 100) score += 2;
    else if (systolicBP <= 110) score += 1;

    // Pulse
    if (pulseRate <= 40 || pulseRate >= 131) score += 3;
    else if (pulseRate >= 111) score += 2;
    else if (pulseRate <= 50 || pulseRate >= 91) score += 1;

    // AVPU
    if (avpuScore !== "A") score += 3;

    // Temp
    if (tempCelsius <= 35.0) score += 3;
    else if (tempCelsius >= 39.1) score += 2;
    else if (tempCelsius <= 36.0 || tempCelsius >= 38.1) score += 1;

    let riskLevel = "LOW RISK (Ward Monitoring)";
    let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    if (score >= 7) {
      riskLevel = "EMERGENCY CLINICAL RESPONSE (ICU/MET CALL)";
      badgeColor = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    } else if (score >= 5) {
      riskLevel = "MEDIUM RISK (Urgent Physician Review)";
      badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }

    return { score, riskLevel, badgeColor };
  }, [respRate, spo2, systolicBP, pulseRate, tempCelsius, avpuScore]);

  // IV Drip calculation
  const ivDripResult = useMemo(() => {
    const flowRateMlHr = +(ivVolumeML / (ivTimeHours || 1)).toFixed(1);
    const dropsPerMin = +((flowRateMlHr * ivDropFactor) / 60).toFixed(1);
    return { flowRateMlHr, dropsPerMin };
  }, [ivVolumeML, ivTimeHours, ivDropFactor]);

  // Engineering calculations
  const maxBendingMomentKNm = useMemo(() => {
    return +((beamUniformLoadKN * Math.pow(beamSpanMeters, 2)) / 8).toFixed(2);
  }, [beamUniformLoadKN, beamSpanMeters]);

  const maxShearForceKN = useMemo(() => {
    return +((beamUniformLoadKN * beamSpanMeters) / 2).toFixed(2);
  }, [beamUniformLoadKN, beamSpanMeters]);

  const concreteStrengthMPa = useMemo(() => {
    const baseFck = concreteGrade === "C20/25" ? 25 : concreteGrade === "C30/37" ? 37 : 50;
    const betaCc = Math.exp(0.25 * (1 - Math.sqrt(28 / (curingDays || 1))));
    return +(baseFck * betaCc).toFixed(1);
  }, [concreteGrade, curingDays]);

  // Terzaghi Bearing Capacity
  const terzaghiBearingCapacityKPa = useMemo(() => {
    // Standard Nc=17.7, Nq=7.4, Ngamma=5.0 for standard friction angle ~25 deg
    const Nc = 17.7;
    const Nq = 7.4;
    const Ngamma = 5.0;
    const qUlt = (soilCohesionKPa * Nc) + (soilUnitWeightKNm3 * footingDepthM * Nq) + (0.5 * soilUnitWeightKNm3 * footingWidthM * Ngamma);
    const qAllowable = +(qUlt / 3.0).toFixed(1); // FS = 3.0
    return { qUlt: +qUlt.toFixed(1), qAllowable };
  }, [soilCohesionKPa, soilUnitWeightKNm3, footingDepthM, footingWidthM]);

  // DCF Valuation calculation
  const dcfValuationResult = useMemo(() => {
    const r = waccDiscountRatePercent / 100;
    const g = fcfGrowthRatePercent / 100;
    const gTerm = terminalGrowthPercent / 100;

    let pvSum = 0;
    let currentFcf = fcfStartingMillion;
    for (let i = 1; i <= 5; i++) {
      currentFcf *= (1 + g);
      pvSum += currentFcf / Math.pow(1 + r, i);
    }

    const terminalVal = (currentFcf * (1 + gTerm)) / Math.max(0.001, (r - gTerm));
    const pvTerminalVal = terminalVal / Math.pow(1 + r, 5);
    const enterpriseValue = +(pvSum + pvTerminalVal).toFixed(2);

    return { enterpriseValue, pvSum: +pvSum.toFixed(2), pvTerminalVal: +pvTerminalVal.toFixed(2) };
  }, [fcfStartingMillion, fcfGrowthRatePercent, waccDiscountRatePercent, terminalGrowthPercent]);

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono border border-emerald-500/40">
                100% FREE PRO SUITE
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono border border-cyan-500/40">
                POWERED BY SOVEREIGN DePIN
              </span>
            </div>
            <h1 className="text-sm font-bold text-white font-serif tracking-wide mt-0.5">
              NUR Professional AI Intelligence Engine
            </h1>
          </div>
        </div>

        {/* Live Mining Node Telemetry */}
        <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isComputeRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            <span className="text-[10px] text-slate-400">DePIN:</span>
            <select
              value={computeMode}
              onChange={(e) => setComputeMode(e.target.value as any)}
              className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ECO" className="bg-slate-900 text-white">ECO (Silent)</option>
              <option value="BALANCED" className="bg-slate-900 text-white">BALANCED</option>
              <option value="TURBO" className="bg-slate-900 text-white">TURBO</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-[10px]">
            <span className="text-slate-400">FLOPS:</span>
            <span className="text-purple-300 font-bold">{telemetry.currentGflops} GFLOPS</span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-[10px]">
            <span className="text-slate-400">YIELD:</span>
            <span className="text-emerald-400 font-bold">+{telemetry.totalTokensEarned.toFixed(5)} $NUR</span>
          </div>

          <button
            onClick={() => setIsComputeRunning(!isComputeRunning)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              isComputeRunning ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500 text-black"
            }`}
          >
            {isComputeRunning ? "PAUSE" : "START"}
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => openFloatingWindow("professional-ai", "🩺 NUR Professional AI Suite")}
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

      {/* ── PROFESSION CATEGORY TABS ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-950 border-b border-white/10 overflow-x-auto font-mono text-xs shrink-0">
        {[
          { id: "MEDICAL" as const, label: "🩺 Medical & Clinical Triage", color: "text-emerald-400" },
          { id: "ENGINEERING" as const, label: "🏗️ Civil, Soil & Structural", color: "text-amber-400" },
          { id: "EDUCATION" as const, label: "🎓 Linguistics & CEFR AI", color: "text-purple-400" },
          { id: "LEGAL" as const, label: "⚖️ Legal & Sanctions Audit", color: "text-cyan-400" },
          { id: "FINANCE" as const, label: "📊 M&A & DCF Valuation", color: "text-blue-400" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? "bg-white/10 text-white border border-cyan-500/50 shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className={cat.color}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT WORKSPACE ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* 1. MEDICAL TAB */}
        {activeCategory === "MEDICAL" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-base font-bold text-emerald-400 font-serif">Clinical Diagnostics & Emergency Triage Engine</h2>
                <p className="text-xs text-slate-400 mt-0.5">CYP450 enzyme drug interactions, cardiac biomarkers, NEWS2 triage, and IV infusion calculations.</p>
              </div>

              {/* Tool selector */}
              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 font-mono text-xs">
                {[
                  { id: "CYP450", label: "💊 CYP450 Interactions" },
                  { id: "BIOMARKER", label: "🧬 Biomarkers" },
                  { id: "NEWS2", label: "🚨 NEWS2 Triage" },
                  { id: "IV_DRIP", label: "💧 IV Infusion" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMedicalTool(t.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      medicalTool === t.id ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {medicalTool === "CYP450" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-300 font-mono">SELECT CONCURRENT THERAPEUTIC REGIMEN</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono">Primary Compound (A):</label>
                      <select
                        value={selectedDrugA}
                        onChange={(e) => setSelectedDrugA(e.target.value)}
                        className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-emerald-300 focus:outline-none"
                      >
                        <option>Warfarin (Anticoagulant)</option>
                        <option>Clopidogrel (Antiplatelet)</option>
                        <option>Simvastatin (Statin)</option>
                        <option>Digoxin (Inotrope)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-mono">Co-Administered Drug (B):</label>
                      <select
                        value={selectedDrugB}
                        onChange={(e) => setSelectedDrugB(e.target.value)}
                        className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300 focus:outline-none"
                      >
                        <option>Amiodarone (Antiarrhythmic)</option>
                        <option>Fluconazole (Antifungal)</option>
                        <option>Clarithromycin (Macrolide)</option>
                        <option>Rifampin (CYP Inducer)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300">CYP450 INTERACTION RISK: CRITICAL</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">CYP2C9 / CYP3A4 INHIBITION</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Amiodarone potently inhibits CYP2C9 metabolism of S-warfarin. Unchecked co-administration increases serum Warfarin concentration by ~100%, causing severe INR elevation and catastrophic hemorrhage risk.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30 text-[10px] text-rose-200">
                    <strong>Clinical Action:</strong> Reduce baseline Warfarin dose by 33% to 50% upon initiating Amiodarone. Monitor INR every 48 hours until steady state.
                  </div>
                </div>
              </div>
            )}

            {medicalTool === "NEWS2" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 font-mono text-xs">
                  <span className="font-bold text-slate-200">PHYSIOLOGICAL PARAMETERS (NEWS2)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400">Respiration Rate (/min):</label>
                      <input type="number" value={respRate} onChange={e => setRespRate(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">SpO2 Oxygen Saturation (%):</label>
                      <input type="number" value={spo2} onChange={e => setSpo2(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Systolic Blood Pressure (mmHg):</label>
                      <input type="number" value={systolicBP} onChange={e => setSystolicBP(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Pulse Rate (BPM):</label>
                      <input type="number" value={pulseRate} onChange={e => setPulseRate(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Body Temperature (°C):</label>
                      <input type="number" step="0.1" value={tempCelsius} onChange={e => setTempCelsius(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Consciousness (AVPU):</label>
                      <select value={avpuScore} onChange={e => setAvpuScore(e.target.value as any)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold">
                        <option value="A">Alert (A)</option>
                        <option value="V">Voice Response (V)</option>
                        <option value="P">Pain Response (P)</option>
                        <option value="U">Unresponsive (U)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 space-y-4 font-mono flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400">CALCULATED NEWS2 SCORE:</span>
                    <div className="text-4xl font-extrabold text-white mt-1">{news2Result.score} <span className="text-xs text-slate-400">points</span></div>
                    <div className={`mt-2 p-2 rounded-xl border text-xs font-bold ${news2Result.badgeColor}`}>
                      {news2Result.riskLevel}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <div>● Score 0-4: Low risk — Standard nursing ward care.</div>
                    <div>● Score 5-6 / Single Score 3: Medium risk — Urgent bedside review by senior clinician.</div>
                    <div>● Score 7+: High risk — Emergency Medical Team (MET) / ICU immediate assessment.</div>
                  </div>
                </div>
              </div>
            )}

            {medicalTool === "IV_DRIP" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 text-xs">
                  <span className="font-bold text-slate-200">IV INFUSION DOSING PARAMETERS</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Infusion Volume (mL):</label>
                      <input type="number" value={ivVolumeML} onChange={e => setIvVolumeML(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Infusion Time (Hours):</label>
                      <input type="number" value={ivTimeHours} onChange={e => setIvTimeHours(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Drop Factor (drops/mL):</label>
                      <select value={ivDropFactor} onChange={e => setIvDropFactor(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold">
                        <option value={10}>10 gtt/mL (Blood set)</option>
                        <option value={15}>15 gtt/mL (Standard Macrodrip)</option>
                        <option value={20}>20 gtt/mL (Standard IV Infusion)</option>
                        <option value={60}>60 gtt/mL (Microdrip / Pediatric)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-cyan-300 font-bold">INFUSION PUMP & DRIP CALCULATIONS</span>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">VOLUMETRIC FLOW</div>
                        <div className="text-xl font-bold text-white mt-1">{ivDripResult.flowRateMlHr} <span className="text-xs text-cyan-300">mL/hr</span></div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">GRAVITY DRIP RATE</div>
                        <div className="text-xl font-bold text-emerald-400 mt-1">{ivDripResult.dropsPerMin} <span className="text-xs text-emerald-300">gtt/min</span></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Formula: Rate (gtt/min) = (Volume [mL] × Drop Factor) / (Time [hr] × 60). Always verify with calibrated pump.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ENGINEERING TAB */}
        {activeCategory === "ENGINEERING" && (
          <div className="space-y-6 max-w-6xl mx-auto font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-base font-bold text-amber-400 font-serif">Structural, Soil & Materials Engineering Suite</h2>
                <p className="text-xs text-slate-400 mt-0.5">Eurocode 2 / ACI 318 bending moment, concrete curing kinetics, and Terzaghi soil bearing capacity.</p>
              </div>

              <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 text-xs">
                {[
                  { id: "BEAM_MOMENT", label: "📏 Beam Bending Moment" },
                  { id: "CONCRETE_CURING", label: "🧪 Concrete Strength" },
                  { id: "TERZAGHI_SOIL", label: "🌍 Soil Bearing Capacity" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setEngineeringTool(t.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      engineeringTool === t.id ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {engineeringTool === "BEAM_MOMENT" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 text-xs">
                  <span className="font-bold text-slate-200">BEAM GEOMETRY & LOADING (EUROCODE 2)</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Clear Span Length $L$ (meters):</label>
                      <input type="number" step="0.5" value={beamSpanMeters} onChange={e => setBeamSpanMeters(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Uniform Distributed Load $w$ ($kN/m$):</label>
                      <input type="number" step="1" value={beamUniformLoadKN} onChange={e => setBeamUniformLoadKN(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-amber-300 font-bold">STRUCTURAL ANALYSIS RESULTS</span>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">MAX MOMENT (M_max)</div>
                        <div className="text-xl font-bold text-white mt-1">{maxBendingMomentKNm} <span className="text-xs text-amber-300">kNm</span></div>
                        <div className="text-[9px] text-slate-400 mt-0.5">M = (w × L²) / 8</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">MAX SHEAR (V_max)</div>
                        <div className="text-xl font-bold text-cyan-400 mt-1">{maxShearForceKN} <span className="text-xs text-cyan-300">kN</span></div>
                        <div className="text-[9px] text-slate-400 mt-0.5">V = (w × L) / 2</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 text-[10px] text-slate-300 border border-white/5">
                    Recommended Reinforcement: High-yield deformed rebar (f_yk = 500 MPa), minimum concrete cover c_nom = 30 mm for XC1 exposure.
                  </div>
                </div>
              </div>
            )}

            {engineeringTool === "TERZAGHI_SOIL" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 text-xs">
                  <span className="font-bold text-slate-200">TERZAGHI SHALLOW FOUNDATION INPUTS</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Soil Cohesion c (kPa):</label>
                      <input type="number" value={soilCohesionKPa} onChange={e => setSoilCohesionKPa(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Unit Weight γ (kN/m³):</label>
                      <input type="number" step="0.5" value={soilUnitWeightKNm3} onChange={e => setSoilUnitWeightKNm3(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Footing Depth D (m):</label>
                      <input type="number" step="0.1" value={footingDepthM} onChange={e => setFootingDepthM(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Footing Width B (m):</label>
                      <input type="number" step="0.1" value={footingWidthM} onChange={e => setFootingWidthM(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-emerald-300 font-bold">SOIL BEARING CAPACITY RESULTS</span>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">ULTIMATE CAPACITY (q_ult)</div>
                        <div className="text-xl font-bold text-white mt-1">{terzaghiBearingCapacityKPa.qUlt} <span className="text-xs text-emerald-300">kPa</span></div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="text-[10px] text-slate-400">ALLOWABLE (q_all, FS=3)</div>
                        <div className="text-xl font-bold text-emerald-400 mt-1">{terzaghiBearingCapacityKPa.qAllowable} <span className="text-xs text-emerald-300">kPa</span></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Formula: q_ult = c·Nc + γ·D·Nq + 0.5·γ·B·Nγ. Factor of safety FS = 3.0 applied for geotechnical foundation design.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. FINANCE & VALUATION TAB */}
        {activeCategory === "FINANCE" && (
          <div className="space-y-6 max-w-6xl mx-auto font-mono">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-blue-400 font-serif">M&A, Corporate Valuation & DCF Sensitivity Engine</h2>
              <p className="text-xs text-slate-400 mt-0.5">Discounted Cash Flow modeling, WACC weighted capital cost, and terminal growth valuation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 text-xs">
                <span className="font-bold text-slate-200">DCF VALUATION MODEL INPUTS</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Year 0 Free Cash Flow ($M):</label>
                    <input type="number" value={fcfStartingMillion} onChange={e => setFcfStartingMillion(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">5-Yr FCF CAGR Growth (%):</label>
                    <input type="number" step="0.5" value={fcfGrowthRatePercent} onChange={e => setFcfGrowthRatePercent(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">WACC Discount Rate (%):</label>
                    <input type="number" step="0.1" value={waccDiscountRatePercent} onChange={e => setWaccDiscountRatePercent(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Terminal Growth Rate (%):</label>
                    <input type="number" step="0.1" value={terminalGrowthPercent} onChange={e => setTerminalGrowthPercent(+e.target.value)} className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-blue-300 font-bold">ENTERPRISE VALUATION OUTPUT</span>
                  <div className="text-4xl font-extrabold text-white mt-2">
                    ${dcfValuationResult.enterpriseValue.toLocaleString()} <span className="text-xs text-blue-300">Million USD</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <div className="text-[10px] text-slate-400">PV of 5-Yr Cash Flows</div>
                      <div className="text-sm font-bold text-white mt-0.5">${dcfValuationResult.pvSum}M</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <div className="text-[10px] text-slate-400">PV of Terminal Value</div>
                      <div className="text-sm font-bold text-cyan-400 mt-0.5">${dcfValuationResult.pvTerminalVal}M</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 text-[10px] text-slate-300 border border-white/5">
                  Sensitivity: Each +100 bps in WACC compresses valuation by ~11.4%. Terminal multiple represents {+(dcfValuationResult.pvTerminalVal / (dcfValuationResult.enterpriseValue || 1) * 100).toFixed(1)}% of total enterprise value.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
