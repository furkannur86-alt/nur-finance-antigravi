"use client";

import { useState, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import {
  SOVEREIGN_INSTITUTIONAL_DOSSIERS,
  SovereignStateDossier,
  InstitutionalPillarType,
  simulateElectoralTrajectory,
  calculateCentralBankStressTest,
} from "@/lib/geo/institutionalIntelligenceEngine";

const PILLAR_TABS: { id: InstitutionalPillarType | "ALL" | "MONTE_CARLO" | "STRESS_TEST"; label: string; icon: string }[] = [
  { id: "ALL", label: "ALL 7 PILLARS", icon: "🌐" },
  { id: "DEMOGRAPHICS_SOCIETAL", label: "DEMOGRAPHICS & HEALTH", icon: "👥" },
  { id: "ELECTORAL_POLITICAL", label: "ELECTORAL & POLITICAL RISK", icon: "🗳️" },
  { id: "BIOSECURITY_HEALTH", label: "BIOSECURITY & PATHOGENS", icon: "🧬" },
  { id: "CENTRAL_BANK_MONETARY", label: "CENTRAL BANK & MONETARY", icon: "🏦" },
  { id: "CRITICAL_SUPPLY_CHAIN", label: "STRATEGIC CHOKEPOINTS", icon: "⛓️" },
  { id: "C4ISR_MILITARY_DEFENSE", label: "C4ISR THEATER DEFENSE", icon: "⚔️" },
  { id: "CYBER_INFRASTRUCTURE", label: "SCADA & CYBER WARFARE", icon: "👾" },
  { id: "MONTE_CARLO", label: "ELECTORAL MONTE CARLO", icon: "🎲" },
  { id: "STRESS_TEST", label: "CENTRAL BANK STRESS TEST", icon: "⚡" },
];

export default function InstitutionalSuitePanel() {
  const { setActiveView, setFocusedCoordinates, openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const [selectedPillar, setSelectedPillar] = useState<InstitutionalPillarType | "ALL" | "MONTE_CARLO" | "STRESS_TEST">("ALL");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(SOVEREIGN_INSTITUTIONAL_DOSSIERS[0].countryCode);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClassifiedMemo, setShowClassifiedMemo] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Monte Carlo Simulator State
  const [econShock, setEconShock] = useState(2.5);
  const [inflationSurge, setInflationSurge] = useState(3.0);

  // Central Bank Stress Test State
  const [rateHikeBps, setRateHikeBps] = useState(150);
  const [fxDepreciation, setFxDepreciation] = useState(12);

  const selectedDossier = useMemo(() => {
    return (
      SOVEREIGN_INSTITUTIONAL_DOSSIERS.find((d) => d.countryCode === selectedCountryCode) ||
      SOVEREIGN_INSTITUTIONAL_DOSSIERS[0]
    );
  }, [selectedCountryCode]);

  const filteredDossiers = useMemo(() => {
    return SOVEREIGN_INSTITUTIONAL_DOSSIERS.filter((d) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.countryName.toLowerCase().includes(q) ||
        d.countryCode.toLowerCase().includes(q) ||
        d.capital.toLowerCase().includes(q) ||
        d.centralBank.centralBankName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Monte Carlo Calculation
  const monteCarloResult = useMemo(() => {
    return simulateElectoralTrajectory(selectedDossier, econShock, inflationSurge, 1000);
  }, [selectedDossier, econShock, inflationSurge]);

  // Central Bank Stress Calculation
  const stressTestResult = useMemo(() => {
    return calculateCentralBankStressTest(selectedDossier, rateHikeBps, fxDepreciation);
  }, [selectedDossier, rateHikeBps, fxDepreciation]);

  const exportClassifiedCSV = () => {
    const headers = [
      "Country_Code", "Country_Name", "DEFCON", "Risk_Score",
      "Population_M", "Median_Wealth_USD", "Next_Election", "Ruling_Lead_Pct",
      "BSL4_Count", "Central_Bank", "FX_Reserves_B_USD", "Gold_Tonnes", "CDS_5Y_Bps",
      "Defense_Budget_B_USD", "Cyber_Readiness_Score"
    ];
    const rows = SOVEREIGN_INSTITUTIONAL_DOSSIERS.map((d) => [
      `"${d.countryCode}"`,
      `"${d.countryName}"`,
      d.defconLevel,
      d.compositeSovereignRiskScore,
      d.demographics.populationMillion,
      d.demographics.medianWealthUSD,
      `"${d.electoral.nextGeneralElection}"`,
      d.electoral.rulingCoalitionLeadPercent,
      d.biosecurity.bsl4FacilitiesCount,
      `"${d.centralBank.centralBankName}"`,
      d.centralBank.fxReservesBillionUSD,
      d.centralBank.goldHoldingsMetricTonnes,
      d.centralBank.sovereignCDS5YSpreadBps,
      d.militaryDefense.defenseBudgetBillionUSD,
      d.cyberWarfare.nationalCyberDefenseReadinessScore,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NUR_CLASSIFIED_INSTITUTIONAL_MATRIX_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportClassifiedJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SOVEREIGN_INSTITUTIONAL_DOSSIERS, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `NUR_CLASSIFIED_INSTITUTIONAL_MATRIX_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyDossier = () => {
    const text = `
================================================================================
SOVEREIGN CLASSIFIED INSTITUTIONAL DOSSIER • TOP SECRET CLEARANCE ($8,500/MO TIER)
TELEMETRY HARMONICS: [13 • 35 • 42 • 55 • #54751113]
================================================================================
COUNTRY: ${selectedDossier.flag} ${selectedDossier.countryName} (${selectedDossier.countryCode})
CAPITAL & REGIME: ${selectedDossier.capital} | DEFCON RATING: DEFCON-${selectedDossier.defconLevel}
COMPOSITE SOVEREIGN RISK SCORE: ${selectedDossier.compositeSovereignRiskScore} / 100
LEADERSHIP: ${selectedDossier.headOfState}

[1. DEMOGRAPHICS & HEALTH]
- Population: ${selectedDossier.demographics.populationMillion}M | Median Age: ${selectedDossier.demographics.medianAgeYears} Yrs
- Youth Unemployment: ${selectedDossier.demographics.youthUnemploymentPercent}% | Median Wealth: $${selectedDossier.demographics.medianWealthUSD.toLocaleString()}
- Societal Sentiment Index: ${selectedDossier.demographics.societalSentimentIndex}/100

[2. ELECTORAL & POLITICAL STABILITY]
- Next General Election: ${selectedDossier.electoral.nextGeneralElection}
- Ruling Coalition Lead: ${selectedDossier.electoral.rulingCoalitionLeadPercent}% (Confidence: ${selectedDossier.electoral.legislativeMajorityConfidence}%)
- Geopolitical Alignment: ${selectedDossier.electoral.geopoliticalAlignment}

[3. BIOSECURITY & PATHOGEN EARLY WARNING]
- BSL-4 High-Containment Labs: ${selectedDossier.biosecurity.bsl4FacilitiesCount}
- Strategic Vaccine Stockpile: ${selectedDossier.biosecurity.strategicVaccineStockpileMonths} Months
- Threat Level: ${selectedDossier.biosecurity.activePathogenThreatLevel}

[4. CENTRAL BANK & MONETARY SOVEREIGNTY]
- Central Bank: ${selectedDossier.centralBank.centralBankName}
- FX Reserves: $${selectedDossier.centralBank.fxReservesBillionUSD}B | Gold Reserves: ${selectedDossier.centralBank.goldHoldingsMetricTonnes} Tonnes
- 5-Year Sovereign CDS Spread: ${selectedDossier.centralBank.sovereignCDS5YSpreadBps} bps | Policy Rate: ${selectedDossier.centralBank.policyRatePercent}%
- Debt-to-GDP: ${selectedDossier.centralBank.sovereignDebtToGDPPercent}% | Annual CPI Inflation: ${selectedDossier.centralBank.annualInflationCPIPercent}%

[5. CRITICAL SUPPLY CHAIN]
- Rare Earth Autarky: ${selectedDossier.supplyChain.rareEarthAutarkyPercent}% | Semi Tier: ${selectedDossier.supplyChain.semiconductorFabricationTier}
- Strategic Port Choke Risk: ${selectedDossier.supplyChain.strategicPortChokeRisk}

[6. C4ISR THEATER DEFENSE]
- Active Personnel: ${selectedDossier.militaryDefense.activeDutyPersonnelThousands}K | Defense Budget: $${selectedDossier.militaryDefense.defenseBudgetBillionUSD}B
- Hypersonic Air Defense: ${selectedDossier.militaryDefense.hypersonicAirDefenseBatteries} Units | Stealth Combat Airframes: ${selectedDossier.militaryDefense.stealthAirCombatAirframes}
- Nuclear Warheads: ${selectedDossier.militaryDefense.nuclearWarheadStockpile ?? "N/A (Non-Nuclear/Host)"}

[7. CYBER WARFARE & SCADA GRID]
- National Cyber Defense Readiness: ${selectedDossier.cyberWarfare.nationalCyberDefenseReadinessScore}/100
- SCADA Grid Isolation: ${selectedDossier.cyberWarfare.criticalSCADAIsolationLevel}
- Known Threat Vectors: ${selectedDossier.cyberWarfare.activeStateAPTAffiliations.join(", ")}
================================================================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP INSTITUTIONAL HEADER BAR ($8,500 / MO TIER) ───────────────── */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <EagleCrest size={34} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wider font-serif">
                SOVEREIGN INSTITUTIONAL INTELLIGENCE SUITE
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm animate-pulse">
                GOVERNMENT, CENTRAL BANK & MILITARY TIER ($8,500 / MO)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              7-Pillar Geopolitical Matrix • Central Bank FX & Gold Reserves • C4ISR Theater Defense • Electoral Monte Carlo • Biosecurity BSL-4
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportClassifiedCSV}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow flex items-center gap-1"
            title="Download Sovereign Intelligence as CSV"
          >
            <span>📊</span>
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={exportClassifiedJSON}
            className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shadow flex items-center gap-1"
            title="Download Full Dossier Model as JSON"
          >
            <span>💾</span>
            <span>JSON</span>
          </button>

          <button
            onClick={() => setShowClassifiedMemo(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-black font-extrabold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>📑</span>
            <span>CLASSIFIED BRIEFING</span>
          </button>

          <button
            onClick={() => openFloatingWindow("institutional-suite", "🏛️ Institutional Sovereign Suite ($8.5K)")}
            title="Detach into Draggable Floating Window"
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 text-xs font-bold transition-all shadow"
          >
            ⤢ DETACH WINDOW
          </button>

          <button
            onClick={() => popoutToNativeWindow("institutional-suite")}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── FILTER TOOLBAR & PILLAR SELECTOR ────────────────────────────────── */}
      <div className="px-5 py-2.5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {PILLAR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPillar(tab.id)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all border shrink-0 flex items-center gap-1.5 text-[11px] ${
                selectedPillar === tab.id
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-md scale-102"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search state, capital, central bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Sovereign State Directory */}
        <div className="w-[360px] border-r border-white/10 bg-slate-950/60 flex flex-col shrink-0 overflow-hidden font-mono">
          <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400">
            <span>SOVEREIGN STATES ({filteredDossiers.length})</span>
            <span>TELEMETRY: [13·35·42·55]</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredDossiers.map((d) => {
              const isSelected = d.countryCode === selectedDossier.countryCode;
              return (
                <div
                  key={d.countryCode}
                  onClick={() => setSelectedCountryCode(d.countryCode)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40"
                      : "bg-slate-900/40 border-white/10 hover:border-white/30 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{d.flag}</span>
                      <div>
                        <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wide">
                          {d.countryCode} • {d.capital}
                        </div>
                        <h4 className="text-xs font-bold text-white mt-0.5">{d.countryName}</h4>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                        d.defconLevel === 1
                          ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                          : d.defconLevel === 2
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      DEFCON-{d.defconLevel}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-300 leading-snug">
                    Central Bank: <strong className="text-cyan-300">{d.centralBank.centralBankName.split("(")[0]}</strong>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                    <span>FX: <strong className="text-white">${d.centralBank.fxReservesBillionUSD}B</strong></span>
                    <span>Gold: <strong className="text-amber-300">{d.centralBank.goldHoldingsMetricTonnes}t</strong></span>
                    <span>CDS: <strong className="text-purple-300">{d.centralBank.sovereignCDS5YSpreadBps} bps</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Workspaces */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 font-mono text-xs">
          {/* SPECIAL VIEW 1: Electoral Monte Carlo Simulation */}
          {selectedPillar === "MONTE_CARLO" && (
            <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                    🎲 SOVEREIGN ELECTORAL & POLICY CONTINUITY MONTE CARLO ENGINE
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    1,000 Iterations simulating macro inflation shocks, voter turnout elasticity, and legislative majority survival.
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  {selectedDossier.countryName}
                </span>
              </div>

              {/* Stress Input Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Macro GDP Shock (% Contraction):</span>
                    <span className="text-cyan-300 font-bold">{econShock}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={econShock}
                    onChange={(e) => setEconShock(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">CPI Inflation Surge Spike (%):</span>
                    <span className="text-amber-300 font-bold">+{inflationSurge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={inflationSurge}
                    onChange={(e) => setInflationSurge(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Monte Carlo Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ruling Majority Win Probability:</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{monteCarloResult.winProbabilityPercent}%</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Based on 1,000 algorithmic stress runs</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Projected Mean Vote Share:</span>
                  <div className="text-2xl font-bold text-cyan-300 mt-1">{monteCarloResult.avgProjectedVote}%</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Baseline: {selectedDossier.electoral.rulingCoalitionLeadPercent}%</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Policy Continuity Score:</span>
                  <div className="text-2xl font-bold text-purple-300 mt-1">
                    {Math.max(10, selectedDossier.electoral.sovereignPolicyContinuityScore - (econShock * 3 + inflationSurge * 2)).toFixed(0)} / 100
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Civil unrest probability: {selectedDossier.electoral.civilUnrestProbabilityPercent}%</p>
                </div>
              </div>
            </div>
          )}

          {/* SPECIAL VIEW 2: Central Bank Stress Test */}
          {selectedPillar === "STRESS_TEST" && (
            <div className="p-5 rounded-2xl bg-black/80 border border-amber-500/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                    🏦 CENTRAL BANK LIQUIDITY & SOVEREIGN CDS STRESS TEST
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Assessing 5-Year Sovereign CDS spread blowout, debt service surges, and reserve depletion.
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  {selectedDossier.centralBank.centralBankName}
                </span>
              </div>

              {/* Stress Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Emergency Policy Rate Hike:</span>
                    <span className="text-amber-300 font-bold">+{rateHikeBps} bps</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={rateHikeBps}
                    onChange={(e) => setRateHikeBps(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Currency FX Depreciation Shock:</span>
                    <span className="text-red-400 font-bold">-{fxDepreciation}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={fxDepreciation}
                    onChange={(e) => setFxDepreciation(Number(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Stress Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/60 to-slate-900 border border-red-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Simulated 5Y Sovereign CDS:</span>
                  <div className="text-2xl font-bold text-red-400 mt-1">{stressTestResult.simulatedCDS} bps</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Spread expansion: +{stressTestResult.cdsDelta} bps</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Debt Service Increase:</span>
                  <div className="text-2xl font-bold text-amber-300 mt-1">${stressTestResult.interestPaymentIncreaseBillionUSD}B</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Annualized debt refinancing surcharge</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">FX Reserve Depletion:</span>
                  <div className="text-2xl font-bold text-purple-300 mt-1">${stressTestResult.reserveDepletionBillionUSD}B</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Intervention defense cost</p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Sovereign Header & 3D Globe Projection */}
          <div className="p-4 rounded-2xl bg-black/80 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedDossier.flag}</span>
                <div>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>SOVEREIGN DOSSIER • {selectedDossier.countryCode} • DEFCON-{selectedDossier.defconLevel}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1 font-serif">{selectedDossier.countryName}</h2>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Capital: {selectedDossier.capital} | Leadership: {selectedDossier.headOfState} | Coordinates: {selectedDossier.coordinates[0]}° N, {selectedDossier.coordinates[1]}° E
                  </div>
                </div>
              </div>

              {/* Action: Beam to 3D Globe */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClassifiedMemo(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <span>📋 C-SUITE MEMO</span>
                </button>

                <button
                  onClick={() => {
                    setFocusedCoordinates(selectedDossier.coordinates);
                    setActiveView("geopolitics");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>🌐 PROJECT ON 3D GLOBE</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-[10px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">FX Reserves:</span>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">${selectedDossier.centralBank.fxReservesBillionUSD}B</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Gold Reserves:</span>
                <div className="text-amber-300 font-bold text-xs mt-0.5">{selectedDossier.centralBank.goldHoldingsMetricTonnes} Tonnes</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">5Y CDS Spread:</span>
                <div className="text-purple-300 font-bold text-xs mt-0.5">{selectedDossier.centralBank.sovereignCDS5YSpreadBps} bps</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Defense Budget:</span>
                <div className="text-cyan-300 font-bold text-xs mt-0.5">${selectedDossier.militaryDefense.defenseBudgetBillionUSD}B</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Population:</span>
                <div className="text-white font-bold text-xs mt-0.5">{selectedDossier.demographics.populationMillion}M</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Cyber Readiness:</span>
                <div className="text-emerald-300 font-bold text-xs mt-0.5">{selectedDossier.cyberWarfare.nationalCyberDefenseReadinessScore}/100</div>
              </div>
            </div>
          </div>

          {/* 7 Core Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1: Demographics & Health */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400 uppercase">
                <span>👥 1. Demographics & Societal Sentiment</span>
                <span className="text-white">{selectedDossier.demographics.societalSentimentIndex}/100 Stability</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Median Age:</span> <strong>{selectedDossier.demographics.medianAgeYears} Years</strong></div>
                <div className="flex justify-between"><span>Youth Unemployment:</span> <strong className="text-amber-300">{selectedDossier.demographics.youthUnemploymentPercent}%</strong></div>
                <div className="flex justify-between"><span>Median Wealth:</span> <strong>${selectedDossier.demographics.medianWealthUSD.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Healthcare Capacity Index:</span> <strong className="text-emerald-400">{selectedDossier.demographics.healthcareCapacityIndex}/100</strong></div>
                <div className="flex justify-between"><span>Brain Drain Risk Score:</span> <strong className="text-purple-300">{selectedDossier.demographics.brainDrainRiskScore}/100</strong></div>
              </div>
            </div>

            {/* Pillar 2: Electoral & Political Risk */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400 uppercase">
                <span>🗳️ 2. Electoral & Political Risk</span>
                <span className="text-white">{selectedDossier.electoral.geopoliticalAlignment}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Next General Election:</span> <strong>{selectedDossier.electoral.nextGeneralElection}</strong></div>
                <div className="flex justify-between"><span>Ruling Coalition Lead:</span> <strong className="text-emerald-300">{selectedDossier.electoral.rulingCoalitionLeadPercent}%</strong></div>
                <div className="flex justify-between"><span>Majority Confidence:</span> <strong>{selectedDossier.electoral.legislativeMajorityConfidence}%</strong></div>
                <div className="flex justify-between"><span>Policy Continuity Score:</span> <strong className="text-cyan-300">{selectedDossier.electoral.sovereignPolicyContinuityScore}/100</strong></div>
                <div className="flex justify-between"><span>Civil Unrest Probability:</span> <strong className="text-red-400">{selectedDossier.electoral.civilUnrestProbabilityPercent}%</strong></div>
              </div>
            </div>

            {/* Pillar 3: Biosecurity & Pathogens */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-amber-400 uppercase">
                <span>🧬 3. Biosecurity & Pathogen Surveillance</span>
                <span className="text-amber-300">{selectedDossier.biosecurity.activePathogenThreatLevel}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>BSL-4 Facilities Count:</span> <strong>{selectedDossier.biosecurity.bsl4FacilitiesCount} Sites</strong></div>
                <div className="flex justify-between"><span>Outbreak Early Warning Index:</span> <strong className="text-emerald-400">{selectedDossier.biosecurity.outbreakEarlyWarningIndex}/100</strong></div>
                <div className="flex justify-between"><span>Strategic Vaccine Stockpile:</span> <strong>{selectedDossier.biosecurity.strategicVaccineStockpileMonths} Months</strong></div>
                <div className="flex justify-between"><span>Foreign API Pharma Reliance:</span> <strong className="text-purple-300">{selectedDossier.biosecurity.criticalAPIPharmaceuticalDependencyPercent}%</strong></div>
              </div>
            </div>

            {/* Pillar 4: Central Bank & Monetary Sovereignty */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-purple-400 uppercase">
                <span>🏦 4. Central Bank & Monetary Matrix</span>
                <span className="text-cyan-300">Policy Rate: {selectedDossier.centralBank.policyRatePercent}%</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Central Bank:</span> <strong>{selectedDossier.centralBank.centralBankName}</strong></div>
                <div className="flex justify-between"><span>Balance Sheet / GDP:</span> <strong>{selectedDossier.centralBank.balanceSheetToGDPPercent}%</strong></div>
                <div className="flex justify-between"><span>Annual CPI Inflation:</span> <strong className="text-amber-300">{selectedDossier.centralBank.annualInflationCPIPercent}%</strong></div>
                <div className="flex justify-between"><span>Sovereign Debt / GDP:</span> <strong>{selectedDossier.centralBank.sovereignDebtToGDPPercent}%</strong></div>
                <div className="flex justify-between"><span>Currency Devaluation Risk:</span> <strong className="text-red-400">{selectedDossier.centralBank.currencyDevaluationRiskPercent}%</strong></div>
              </div>
            </div>

            {/* Pillar 5: Critical Minerals & Supply Chains */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400 uppercase">
                <span>⛓️ 5. Strategic Minerals & Chokepoints</span>
                <span className="text-amber-300">Choke Risk: {selectedDossier.supplyChain.strategicPortChokeRisk}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Rare Earth Autarky:</span> <strong className="text-emerald-400">{selectedDossier.supplyChain.rareEarthAutarkyPercent}%</strong></div>
                <div className="flex justify-between"><span>Semiconductor Fab Tier:</span> <strong className="text-cyan-300">{selectedDossier.supplyChain.semiconductorFabricationTier}</strong></div>
                <div className="flex justify-between"><span>Energy Import Dependency:</span> <strong>{selectedDossier.supplyChain.energyImportDependencyPercent}%</strong></div>
                <div className="flex justify-between"><span>Grain/Food Stockpiles:</span> <strong>{selectedDossier.supplyChain.grainAndFoodStockpileMonths} Months</strong></div>
              </div>
            </div>

            {/* Pillar 6: C4ISR & Military Defense */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-red-400 uppercase">
                <span>⚔️ 6. C4ISR Theater Defense</span>
                <span className="text-white">Active: {selectedDossier.militaryDefense.activeDutyPersonnelThousands}K</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between"><span>Defense Budget:</span> <strong className="text-emerald-400">${selectedDossier.militaryDefense.defenseBudgetBillionUSD}B</strong></div>
                <div className="flex justify-between"><span>Hypersonic Air Defense:</span> <strong>{selectedDossier.militaryDefense.hypersonicAirDefenseBatteries} Batteries</strong></div>
                <div className="flex justify-between"><span>Stealth 5th-Gen Airframes:</span> <strong>{selectedDossier.militaryDefense.stealthAirCombatAirframes} Aircraft</strong></div>
                <div className="flex justify-between"><span>Nuclear Warhead Stockpile:</span> <strong className="text-red-400">{selectedDossier.militaryDefense.nuclearWarheadStockpile ?? "N/A"}</strong></div>
                <div className="flex justify-between"><span>Naval Total Tonnage:</span> <strong>{selectedDossier.militaryDefense.navalDisplacementTotalTons.toLocaleString()} Tons</strong></div>
              </div>
            </div>
          </div>

          {/* Pillar 7: Full Width Cyber Warfare & SCADA Grid */}
          <div className="p-4 rounded-2xl bg-black/80 border border-red-500/40 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-red-400 uppercase">
              <span>👾 7. State-Sponsored Cyber Warfare & SCADA Grid Resilience</span>
              <span className="text-emerald-400">Readiness: {selectedDossier.cyberWarfare.nationalCyberDefenseReadinessScore}/100</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">SCADA Grid Isolation:</span>
                <div className="text-cyan-300 font-bold mt-0.5">{selectedDossier.cyberWarfare.criticalSCADAIsolationLevel}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Zero-Day Exposure Score:</span>
                <div className="text-amber-300 font-bold mt-0.5">{selectedDossier.cyberWarfare.zeroDayExploitExposureIndex}/100</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Undersea Fiber Sovereignty:</span>
                <div className="text-emerald-400 font-bold mt-0.5">{selectedDossier.cyberWarfare.underseaFiberLendingSovereigntyScore}/100</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-400">Tracked APT Adversary Signatures:</span>{" "}
              <strong className="text-red-300">{selectedDossier.cyberWarfare.activeStateAPTAffiliations.join(" • ")}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: Classified Executive Briefing Dossier ─────────────────────── */}
      {showClassifiedMemo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedDossier.flag}</span>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-serif">
                    CLASSIFIED SOVEREIGN INTELLIGENCE BRIEFING ($8,500/MO)
                  </h3>
                  <p className="text-[10px] text-cyan-400">
                    Sovereign Target: {selectedDossier.countryName} ({selectedDossier.countryCode}) • DEFCON-{selectedDossier.defconLevel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowClassifiedMemo(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-200 leading-relaxed text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-cyan-500/30 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase">
                  Executive Sovereign Target: {selectedDossier.countryName} ({selectedDossier.countryCode})
                </div>
                <div className="text-[11px] text-slate-300">
                  <strong>Capital:</strong> {selectedDossier.capital} | <strong>Leadership:</strong> {selectedDossier.headOfState} | <strong>Composite Risk Score:</strong> {selectedDossier.compositeSovereignRiskScore}/100
                </div>
              </div>

              {/* 7 Pillars Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-cyan-300 text-[11px]">1. DEMOGRAPHICS & HEALTH</div>
                  <div>Population: {selectedDossier.demographics.populationMillion}M | Median Wealth: ${selectedDossier.demographics.medianWealthUSD.toLocaleString()}</div>
                  <div>Youth Unemployment: {selectedDossier.demographics.youthUnemploymentPercent}% | Health Capacity: {selectedDossier.demographics.healthcareCapacityIndex}/100</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-emerald-300 text-[11px]">2. ELECTORAL STABILITY</div>
                  <div>Next Election: {selectedDossier.electoral.nextGeneralElection}</div>
                  <div>Ruling Lead: {selectedDossier.electoral.rulingCoalitionLeadPercent}% | Geopolitics: {selectedDossier.electoral.geopoliticalAlignment}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-amber-300 text-[11px]">3. BIOSECURITY THREAT</div>
                  <div>BSL-4 Sites: {selectedDossier.biosecurity.bsl4FacilitiesCount} | Threat Level: {selectedDossier.biosecurity.activePathogenThreatLevel}</div>
                  <div>Strategic Vaccines: {selectedDossier.biosecurity.strategicVaccineStockpileMonths} Months</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-purple-300 text-[11px]">4. CENTRAL BANK SOVEREIGNTY</div>
                  <div>FX Reserves: ${selectedDossier.centralBank.fxReservesBillionUSD}B | Gold: {selectedDossier.centralBank.goldHoldingsMetricTonnes}t</div>
                  <div>5Y CDS: {selectedDossier.centralBank.sovereignCDS5YSpreadBps} bps | Policy Rate: {selectedDossier.centralBank.policyRatePercent}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-cyan-300 text-[11px]">5. CRITICAL SUPPLY CHAIN</div>
                  <div>Rare Earth Autarky: {selectedDossier.supplyChain.rareEarthAutarkyPercent}% | Semi Tier: {selectedDossier.supplyChain.semiconductorFabricationTier}</div>
                  <div>Port Choke Risk: {selectedDossier.supplyChain.strategicPortChokeRisk}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="font-bold text-red-300 text-[11px]">6. C4ISR DEFENSE THEATER</div>
                  <div>Active Personnel: {selectedDossier.militaryDefense.activeDutyPersonnelThousands}K | Budget: ${selectedDossier.militaryDefense.defenseBudgetBillionUSD}B</div>
                  <div>Hypersonic Defense: {selectedDossier.militaryDefense.hypersonicAirDefenseBatteries} | Stealth: {selectedDossier.militaryDefense.stealthAirCombatAirframes}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 space-y-1">
                <div className="font-bold text-red-400 text-[11px]">7. SCADA & CYBER WARFARE SIGNATURES</div>
                <div>Readiness Score: {selectedDossier.cyberWarfare.nationalCyberDefenseReadinessScore}/100 | SCADA Isolation: {selectedDossier.cyberWarfare.criticalSCADAIsolationLevel}</div>
                <div>Active Threat Entities: {selectedDossier.cyberWarfare.activeStateAPTAffiliations.join(", ")}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                {copiedNotification ? (
                  <span className="text-emerald-400 font-bold">✓ CLASSIFIED DOSSIER COPIED TO CLIPBOARD</span>
                ) : (
                  <span>TOP SECRET • INSTITUTIONAL CLEARANCE ONLY</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyDossier}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 font-bold transition-all"
                >
                  📋 COPY BRIEFING DOSSIER
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-extrabold hover:brightness-110 transition-all"
                >
                  🖨️ PRINT CLASSIFIED MEMO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
