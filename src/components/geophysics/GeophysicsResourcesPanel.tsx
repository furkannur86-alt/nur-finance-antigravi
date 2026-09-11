"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import {
  SOVEREIGN_EXPLORATION_DEPOSITS,
  SCIENTIFIC_RESEARCH_AI_FEED,
  ExplorationDeposit,
  CommodityDomain,
} from "@/lib/geo/deepEarthExplorationEngine";
import { useIDEStore } from "@/stores/useIDEStore";

/* ── Subsurface Waveform & Alteration Canvas ─────────────── */
function SubsurfaceSeismicCanvas({
  deposit,
  boreholeDepth,
  boreholeDip,
}: {
  deposit: ExplorationDeposit;
  boreholeDepth: number;
  boreholeDip: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep earth stratigraphy gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#020914");
      bg.addColorStop(0.3, "#041525");
      bg.addColorStop(0.7, "#0c1b24");
      bg.addColorStop(1, "#180e04");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stratigraphic horizon layers
      const layers = 6;
      for (let i = 1; i <= layers; i++) {
        const y = (H / (layers + 1)) * i;
        ctx.strokeStyle = "rgba(0, 229, 255, 0.14)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 20) {
          const dip = Math.sin(x * 0.015 + i) * 6 + Math.cos(x * 0.008) * 4;
          ctx.lineTo(x, y + dip);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Hydrothermal / Subsurface Reservoir Anomaly Core
      const cx = W * 0.52;
      const cy = H * 0.58;
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 95);
      const isOil = deposit.domain === "PETROLEUM_GAS";
      const isBattery = deposit.domain === "CRITICAL_BATTERY" || deposit.domain === "DEEP_SEA_CCZ";
      const isNuclear = deposit.domain === "STRATEGIC_NUCLEAR_DEFENSE";

      if (isOil) {
        coreGrad.addColorStop(0, "rgba(239, 68, 68, 0.90)"); // Hydrocarbon AVO Bright Spot
        coreGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.50)");
        coreGrad.addColorStop(1, "transparent");
      } else if (isBattery) {
        coreGrad.addColorStop(0, "rgba(6, 182, 212, 0.90)"); // Lithium / REE Ion Anomaly
        coreGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.50)");
        coreGrad.addColorStop(1, "transparent");
      } else if (isNuclear) {
        coreGrad.addColorStop(0, "rgba(16, 185, 129, 0.95)"); // Uranium Gamma Radiometric Peak
        coreGrad.addColorStop(0.5, "rgba(5, 150, 105, 0.45)");
        coreGrad.addColorStop(1, "transparent");
      } else {
        coreGrad.addColorStop(0, "rgba(245, 158, 11, 0.90)"); // Gold / Copper Porphyry Stockwork
        coreGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.45)");
        coreGrad.addColorStop(1, "transparent");
      }

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 115, 48, (Math.PI / 180) * 12, 0, Math.PI * 2);
      ctx.fill();

      // Simulated 3D Seismic Trace Wiggle Waveforms (AVO Inversion)
      ctx.strokeStyle = isOil ? "#ef4444" : isBattery ? "#06b6d4" : isNuclear ? "#10b981" : "#fbbf24";
      ctx.lineWidth = 1.8;
      const traces = 14;
      for (let tr = 0; tr < traces; tr++) {
        const tx = (W / (traces + 1)) * (tr + 1);
        ctx.beginPath();
        for (let y = 15; y < H - 15; y += 4) {
          const depthFactor = Math.exp(-Math.pow((y - cy) / 38, 2));
          const wiggle = Math.sin(y * 0.12 - t * 2 + tr) * (14 * depthFactor + 2);
          if (y === 15) ctx.moveTo(tx + wiggle, y);
          else ctx.lineTo(tx + wiggle, y);
        }
        ctx.stroke();
      }

      // Dynamic Borehole Drill Path Vector (Controlled by Sliders)
      const rad = (boreholeDip * Math.PI) / 180;
      const drillLength = (boreholeDepth / 6500) * (H * 0.85);
      const startX = W * 0.22;
      const startY = 0;
      const endX = startX + Math.cos(rad) * drillLength * 1.4;
      const endY = startY + Math.sin(rad) * drillLength;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + 40, endY * 0.5, endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Drill target reticle
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(endX, endY, 9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ff0055";
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Labels on canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "bold 9px monospace";
      ctx.fillText("SUBSURFACE AVO WAVEFORM & VELOCITY MODEL INVERSION", 12, 18);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`TARGET HORIZON: ${deposit.hostLithology.slice(0, 48)}...`, 12, 32);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`DRILL DEPTH: ${boreholeDepth}m TVD | DIP: ${boreholeDip}° | PROBABILITY: ${deposit.drillingTargetVectors.probabilityOfDiscoveryPercent}%`, 12, 46);

      t += 0.025;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [deposit, boreholeDepth, boreholeDip]);

  return <canvas ref={ref} className="w-full h-full rounded-xl bg-black border border-cyan-500/30" />;
}

export default function GeophysicsResourcesPanel() {
  const { setActiveView, setFocusedCoordinates, openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const [activeDomain, setActiveDomain] = useState<CommodityDomain | "ALL" | "RESEARCH" | "CALCULATOR">("ALL");
  const [selectedDepositId, setSelectedDepositId] = useState<string>(SOVEREIGN_EXPLORATION_DEPOSITS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPitchDossier, setShowPitchDossier] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Drill simulator state
  const [simDepth, setSimDepth] = useState(5850);
  const [simDip, setSimDip] = useState(78);

  // Volumetric calculator state
  const [calcAreaAcres, setCalcAreaAcres] = useState(12000);
  const [calcPayThickness, setCalcPayThickness] = useState(120);
  const [calcPorosity, setCalcPorosity] = useState(0.22);
  const [calcWaterSat, setCalcWaterSat] = useState(0.25);
  const [calcRecoveryFactor, setCalcRecoveryFactor] = useState(0.38);
  const [calcOilPrice, setCalcOilPrice] = useState(78.50);

  const selectedDeposit = useMemo(() => {
    return SOVEREIGN_EXPLORATION_DEPOSITS.find((d) => d.id === selectedDepositId) || SOVEREIGN_EXPLORATION_DEPOSITS[0];
  }, [selectedDepositId]);

  // Sync simulator values when deposit changes
  useEffect(() => {
    setSimDepth(selectedDeposit.drillingTargetVectors.targetDepthMeters);
    setSimDip(selectedDeposit.drillingTargetVectors.dipAngleDegrees);
  }, [selectedDeposit]);

  const filteredDeposits = useMemo(() => {
    return SOVEREIGN_EXPLORATION_DEPOSITS.filter((d) => {
      const matchDomain =
        activeDomain === "ALL" ||
        activeDomain === "RESEARCH" ||
        activeDomain === "CALCULATOR" ||
        d.domain === activeDomain;
      const matchSearch =
        searchQuery === "" ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.primaryElements.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDomain && matchSearch;
    });
  }, [activeDomain, searchQuery]);

  // Calculated In-Situ Hydrocarbon / Mineral Volumetrics
  const volumetricResults = useMemo(() => {
    // STOIIP formula: 7758 * A * h * phi * (1 - Sw) / Boi (assume Boi = 1.25)
    const stoiipBarrels = (7758 * calcAreaAcres * calcPayThickness * calcPorosity * (1 - calcWaterSat)) / 1.25;
    const recoverableBarrels = stoiipBarrels * calcRecoveryFactor;
    const grossValuationUSD = recoverableBarrels * calcOilPrice;
    const boeMillions = stoiipBarrels / 1_000_000;
    const recoverableBoeMillions = recoverableBarrels / 1_000_000;
    const grossValuationBillionUSD = grossValuationUSD / 1_000_000_000;

    return {
      stoiipBarrels,
      recoverableBarrels,
      boeMillions,
      recoverableBoeMillions,
      grossValuationBillionUSD,
      stoiipMillionBbl: boeMillions.toFixed(1),
      recoverableMillionBbl: recoverableBoeMillions.toFixed(1),
      grossRevenueBillionUSD: grossValuationBillionUSD.toFixed(2),
    };
  }, [calcAreaAcres, calcPayThickness, calcPorosity, calcWaterSat, calcRecoveryFactor, calcOilPrice]);

  const exportConcessionsCSV = () => {
    const headers = [
      "ID", "Name", "Domain", "Country", "Basin", "Lat", "Lon", "Valuation",
      "Operator", "License_Status", "Reserves", "Grade", "NPV_B_USD", "IRR_Pct", "Capex_M_USD", "Discovery_Prob_Pct"
    ];
    const rows = SOVEREIGN_EXPLORATION_DEPOSITS.map((d) => [
      `"${d.id}"`,
      `"${d.name}"`,
      `"${d.domain}"`,
      `"${d.country}"`,
      `"${d.basinOrTerrane}"`,
      d.coordinates[0],
      d.coordinates[1],
      `"${d.estimatedInSituValueUSD}"`,
      `"${d.currentOperator}"`,
      `"${d.licenseStatus}"`,
      `"${d.provenReserves}"`,
      `"${d.grade}"`,
      d.commercialMetrics.npvBillionUSD,
      d.commercialMetrics.irrPercent,
      d.commercialMetrics.capexMillionUSD,
      d.drillingTargetVectors.probabilityOfDiscoveryPercent,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NUR_SOVEREIGN_CONCESSIONS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportConcessionsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SOVEREIGN_EXPLORATION_DEPOSITS, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `NUR_SOVEREIGN_CONCESSIONS_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyDossier = () => {
    const text = `
================================================================================
SOVEREIGN EXPLORATION & RESERVOIR AUDIT MEMO • CONFIDENTIAL (€27K TIER)
================================================================================
CONCESSION NAME: ${selectedDeposit.name}
DOMAIN: ${selectedDeposit.domain.replace(/_/g, " ")}
PRIMARY ELEMENTS: ${selectedDeposit.primaryElements.join(", ")}
COUNTRY & BASIN: ${selectedDeposit.country} (${selectedDeposit.basinOrTerrane})
COORDINATES: ${selectedDeposit.coordinates[0]}° N, ${selectedDeposit.coordinates[1]}° E
OPERATOR & STATUS: ${selectedDeposit.currentOperator} [${selectedDeposit.licenseStatus}]

AUDITED IN-SITU ASSET VALUE: ${selectedDeposit.estimatedInSituValueUSD}
PROVEN / PROBABLE RESERVES: ${selectedDeposit.provenReserves}
AVERAGE GRADE: ${selectedDeposit.grade}
CUT-OFF GRADE: ${selectedDeposit.cutoffGrade}

FINANCIAL & COMMERCIAL METRICS:
- Net Present Value (NPV @ 10%): $${selectedDeposit.commercialMetrics.npvBillionUSD} Billion
- Internal Rate of Return (IRR): ${selectedDeposit.commercialMetrics.irrPercent}%
- Development Capex: $${selectedDeposit.commercialMetrics.capexMillionUSD} Million
- Operating Cost / Opex: ${selectedDeposit.commercialMetrics.opexUnit}
- Breakeven Benchmark Price: ${selectedDeposit.commercialMetrics.breakevenCommodityPrice}
- Capital Payback Horizon: ${selectedDeposit.commercialMetrics.paybackYears} Years

GEOPHYSICAL & STRUCTURAL SIGNATURES:
- Geological Model: ${selectedDeposit.geologicalModel}
- Host Lithology: ${selectedDeposit.hostLithology}
- Structural Control: ${selectedDeposit.structuralControl}
- ASTER Hyperspectral: ${selectedDeposit.spectralSignatureASTER}
- Seismic AVO Inversion: ${selectedDeposit.geophysicalAnomaly}

OPTIMIZED DRILLING TARGET VECTORS:
- Target Depth: ${selectedDeposit.drillingTargetVectors.targetDepthMeters}m TVDSS
- Azimuth: ${selectedDeposit.drillingTargetVectors.azimuthDegrees}°
- Dip Angle: ${selectedDeposit.drillingTargetVectors.dipAngleDegrees}°
- Expected Intercept Width: ${selectedDeposit.drillingTargetVectors.expectedInterceptWidthMeters}m
- AI Probability of Discovery: ${selectedDeposit.drillingTargetVectors.probabilityOfDiscoveryPercent}%

PEER-REVIEWED RESEARCH CITATIONS:
${selectedDeposit.recentScientificPublications.map((p) => `- ${p.journal} (${p.year}): ${p.title} [DOI: ${p.doi}]\n  Key Finding: ${p.keyFinding}`).join("\n")}
================================================================================
CONFIDENTIAL INSTITUTIONAL USE ONLY • NUR DEFENSE & GEOPHYSICAL INTELLIGENCE
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP ENTERPRISE HEADER BAR (€27,000 / MO TIER) ──────────────────── */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between shrink-0 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <EagleCrest size={34} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wider font-serif">
                SOVEREIGN DEEP EARTH, PETROLEUM & CRITICAL MINERALS EXPLORATION SUITE
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                ENTERPRISE CONGLOMERATE SUITE (€27,000 / MO)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PhD Economic Geology & Reservoir Geophysics • 3D Seismic AVO Inversion • ASTER SWIR Remote Sensing • Quant Mining Finance
            </p>
          </div>
        </div>

        {/* Global Value & Window Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportConcessionsCSV}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow flex items-center gap-1"
            title="Download Concessions Dataset as CSV"
          >
            <span>📊</span>
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={exportConcessionsJSON}
            className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shadow flex items-center gap-1"
            title="Download Full Geological Model as JSON"
          >
            <span>💾</span>
            <span>JSON</span>
          </button>

          <button
            onClick={() => setShowPitchDossier(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>📑</span>
            <span>EXECUTIVE PITCH MEMO</span>
          </button>

          <button
            onClick={() => openFloatingWindow("geophysics-resources", "💎 Geophysics & Deep Earth Exploration")}
            title="Detach into Draggable Floating Window"
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 text-xs font-bold transition-all shadow"
          >
            ⤢ DETACH WINDOW
          </button>

          <button
            onClick={() => popoutToNativeWindow("geophysics-resources")}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── FILTER TOOLBAR & DOMAIN SELECTOR ────────────────────────────────── */}
      <div className="px-5 py-2.5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">
        {/* Domain Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "ALL", label: "ALL COMMODITIES", icon: "🌐" },
            { id: "PETROLEUM_GAS", label: "🛢️ OIL & GAS SUPERMAJORS", icon: "🛢️" },
            { id: "CRITICAL_BATTERY", label: "🔋 LITHIUM & RARE EARTHS", icon: "🔋" },
            { id: "PRECIOUS_BASE_METALS", label: "⛏️ COPPER & GOLD PORPHYRY", icon: "⛏️" },
            { id: "STRATEGIC_NUCLEAR_DEFENSE", label: "☢️ URANIUM (ATHABASCA)", icon: "☢️" },
            { id: "DEEP_SEA_CCZ", label: "🌊 DEEP-SEA POLYMETALLIC CCZ", icon: "🌊" },
            { id: "CALCULATOR", label: "🧮 STOIIP & ORE VOLUMETRIC ENGINE", icon: "🧮" },
            { id: "RESEARCH", label: "🔬 PEER-REVIEWED AI RESEARCH", icon: "🔬" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all border shrink-0 text-[11px] ${
                activeDomain === tab.id
                  ? "bg-amber-500 text-black border-amber-400 shadow-md scale-102"
                  : "bg-slate-900/80 text-slate-300 border-white/10 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search deposit, element, basin, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Deposit Directory & Concession Ledger */}
        <div className="w-[380px] border-r border-white/10 bg-slate-950/60 flex flex-col shrink-0 overflow-hidden font-mono">
          <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400">
            <span>CONCESSION DIRECTORY ({filteredDeposits.length})</span>
            <span>SORT: VALUATION ↓</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredDeposits.map((dep) => {
              const isSelected = dep.id === selectedDeposit.id;
              return (
                <div
                  key={dep.id}
                  onClick={() => setSelectedDepositId(dep.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500 shadow-lg shadow-amber-950/40"
                      : "bg-slate-900/40 border-white/10 hover:border-white/30 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                        {dep.country} • {dep.domain.replace(/_/g, " ")}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-0.5">{dep.name}</h4>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {dep.estimatedInSituValueUSD}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    {dep.geologicalModel}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Grade: <strong className="text-white">{dep.grade.split(" ")[0]}</strong></span>
                    <span>Operator: <strong className="text-cyan-300">{dep.currentOperator.split(" ")[0]}</strong></span>
                    <span>Readiness: <strong className="text-emerald-400">{dep.drillingReadinessScore}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Workspaces */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 font-mono text-xs">
          {/* VIEW MODE A: Volumetric STOIIP & Mining Reserve Calculator */}
          {activeDomain === "CALCULATOR" ? (
            <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                    🧮 SUBSURFACE STOIIP & NET SMELTER RETURN (NSR) VOLUMETRIC ENGINE
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Petroleum Reservoir Hydrocarbon in Place Equation: STOIIP = (7758 × A × h × Φ × (1 - Sw)) / Boi
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  SPE & CIM STANDARDS COMPLIANT
                </span>
              </div>

              {/* Editable Input Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Area (Acres):</label>
                  <input
                    type="number"
                    value={calcAreaAcres}
                    onChange={(e) => setCalcAreaAcres(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Pay Thickness h (ft):</label>
                  <input
                    type="number"
                    value={calcPayThickness}
                    onChange={(e) => setCalcPayThickness(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Porosity Φ (0-1):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcPorosity}
                    onChange={(e) => setCalcPorosity(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Water Saturation Sw:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcWaterSat}
                    onChange={(e) => setCalcWaterSat(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Recovery Factor RF:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcRecoveryFactor}
                    onChange={(e) => setCalcRecoveryFactor(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <label className="text-[10px] text-slate-400">Benchmark Price ($/bbl):</label>
                  <input
                    type="number"
                    value={calcOilPrice}
                    onChange={(e) => setCalcOilPrice(Number(e.target.value))}
                    className="w-full bg-black px-2 py-1 rounded text-white font-bold border border-white/20 focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Live Volumetric Calculation Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total In-Place (STOIIP):</span>
                  <div className="text-xl font-bold text-cyan-300 mt-1">{volumetricResults.stoiipMillionBbl} Million BOE</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Original Oil In Place prior to reservoir depletion</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Technically Recoverable Reserves:</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{volumetricResults.recoverableMillionBbl} Million BOE</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Estimated Ultimate Recovery (EUR) at {(calcRecoveryFactor * 100).toFixed(0)}% RF</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Gross Field Gross Revenue:</span>
                  <div className="text-xl font-bold text-amber-300 mt-1">${volumetricResults.grossRevenueBillionUSD} Billion</div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Undiscounted life-of-field gross commodity value</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Section 1: Deposit Title, Coordinates & 3D Globe Projection */}
          <div className="p-4 rounded-2xl bg-black/80 border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span>AUDITED GEOLOGICAL CONCESSION DOSSIER • {selectedDeposit.licenseStatus}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1 font-serif">{selectedDeposit.name}</h2>
                <div className="text-[11px] text-cyan-300 mt-0.5">
                  {selectedDeposit.basinOrTerrane} | Coordinates: {selectedDeposit.coordinates[0].toFixed(4)}° N, {selectedDeposit.coordinates[1].toFixed(4)}° E
                </div>
              </div>

              {/* Action: Beam to 3D Globe & Export Dossier */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPitchDossier(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/50 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <span>📋 C-SUITE MEMO</span>
                </button>

                <button
                  onClick={() => {
                    setFocusedCoordinates(selectedDeposit.coordinates);
                    setActiveView("geopolitics");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>🌐 PROJECT ON 3D GLOBE</span>
                </button>
              </div>
            </div>

            {/* Core Commercial & Financial Matrix (€27K Tier) */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-[10px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">NPV (Discount 10%):</span>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">${selectedDeposit.commercialMetrics.npvBillionUSD} Billion</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">IRR (Rate of Return):</span>
                <div className="text-cyan-300 font-bold text-xs mt-0.5">{selectedDeposit.commercialMetrics.irrPercent}%</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Development Capex:</span>
                <div className="text-amber-300 font-bold text-xs mt-0.5">${selectedDeposit.commercialMetrics.capexMillionUSD}M</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Lifting / Opex Unit:</span>
                <div className="text-purple-300 font-bold text-xs mt-0.5">{selectedDeposit.commercialMetrics.opexUnit}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Breakeven Price:</span>
                <div className="text-white font-bold text-xs mt-0.5">{selectedDeposit.commercialMetrics.breakevenCommodityPrice}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                <span className="text-slate-400">Payback Period:</span>
                <div className="text-emerald-300 font-bold text-xs mt-0.5">{selectedDeposit.commercialMetrics.paybackYears} Years</div>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Subsurface Waveform Canvas + Real-Time Drill Target Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Subsurface Canvas */}
            <div className="h-80 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl bg-black flex flex-col">
              <div className="flex-1">
                <SubsurfaceSeismicCanvas
                  deposit={selectedDeposit}
                  boreholeDepth={simDepth}
                  boreholeDip={simDip}
                />
              </div>

              {/* Interactive Drill Vector Sliders */}
              <div className="p-3 bg-slate-950/90 border-t border-cyan-500/30 flex items-center justify-between gap-4 text-[10px]">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-slate-400 shrink-0">DEPTH:</span>
                  <input
                    type="range"
                    min="500"
                    max="6500"
                    step="50"
                    value={simDepth}
                    onChange={(e) => setSimDepth(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-cyan-300 font-bold shrink-0">{simDepth}m</span>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-slate-400 shrink-0">DIP:</span>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="1"
                    value={simDip}
                    onChange={(e) => setSimDip(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <span className="text-amber-300 font-bold shrink-0">{simDip}°</span>
                </div>
              </div>
            </div>

            {/* Geological & Structural Mechanics */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  GEOMECHANICAL & PETROPHYSICAL GENOTYPE
                </div>
                <div className="mt-2 space-y-2 text-[11px] leading-relaxed">
                  <div>
                    <span className="text-slate-400">Host Lithology:</span>{" "}
                    <strong className="text-white">{selectedDeposit.hostLithology}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Structural Trap / Shearing:</span>{" "}
                    <strong className="text-amber-300">{selectedDeposit.structuralControl}</strong>
                  </div>
                  {selectedDeposit.alterationZoning && (
                    <div>
                      <span className="text-slate-400">Hydrothermal Alteration Halos:</span>{" "}
                      <strong className="text-purple-300">{selectedDeposit.alterationZoning}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">ASTER Hyperspectral Footprint:</span>{" "}
                    <strong className="text-cyan-200">{selectedDeposit.spectralSignatureASTER}</strong>
                  </div>
                </div>
              </div>

              {/* Drill Vectoring Box */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-[10px] space-y-1">
                <div className="flex justify-between items-center text-emerald-300 font-bold uppercase">
                  <span>AI Vector Target Intercept:</span>
                  <span className="text-emerald-400">{selectedDeposit.drillingTargetVectors.probabilityOfDiscoveryPercent}% CONFIDENCE</span>
                </div>
                <p className="text-slate-300">
                  Target Depth: <strong>{selectedDeposit.drillingTargetVectors.targetDepthMeters}m</strong> | Azimuth: <strong>{selectedDeposit.drillingTargetVectors.azimuthDegrees}°</strong> | Expected Intercept: <strong>{selectedDeposit.drillingTargetVectors.expectedInterceptWidthMeters}m</strong>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[10px]">
                <span className="text-cyan-300 font-bold uppercase">Geophysical Anomaly Profile:</span>
                <p className="text-slate-300 mt-1">{selectedDeposit.geophysicalAnomaly}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Peer-Reviewed Scientific Publications & AI Literature Ingestion */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔬</span>
                <div>
                  <div className="text-xs font-bold text-white uppercase">
                    PEER-REVIEWED SCIENTIFIC LITERATURE & AI EXPLORATION VECTOR INGESTION
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Live extraction from Nature Geoscience, SEG Economic Geology, AAPG Bulletin, and Earth & Planetary Science Letters
                  </p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                AI REASONING ACTIVE
              </span>
            </div>

            {/* Publications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {selectedDeposit.recentScientificPublications.map((pub, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-amber-300">{pub.journal} ({pub.year})</span>
                    <span className="text-slate-500 text-[9px]">DOI: {pub.doi}</span>
                  </div>
                  <div className="text-white font-bold leading-snug">{pub.title}</div>
                  <div className="text-slate-300 text-[10px] leading-relaxed pt-1 border-t border-white/5">
                    <strong className="text-emerald-400">Key Takeaway for Operators:</strong> {pub.keyFinding}
                  </div>
                </div>
              ))}

              {/* Feed from general scientific repository */}
              {SCIENTIFIC_RESEARCH_AI_FEED.map((feed) => (
                <div key={feed.id} className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-purple-300">{feed.journal} • {feed.publicationDate}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">
                      IMPACT: {feed.impactScore}/10
                    </span>
                  </div>
                  <div className="text-white font-bold leading-snug">{feed.title}</div>
                  <div className="text-slate-400 text-[9px]">{feed.authors}</div>
                  <p className="text-slate-300 leading-relaxed pt-1 border-t border-white/5">
                    <strong className="text-cyan-300">Exploration Takeaway:</strong> {feed.explorationTakeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: C-SUITE EXECUTIVE INVESTMENT PITCH MEMO (€27,000 / MO TIER) ── */}
      {showPitchDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-950 border border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-b border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EagleCrest size={32} animate={true} />
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">
                    CONFIDENTIAL INVESTMENT PITCH MEMO • C-SUITE BOARD BRIEFING
                  </div>
                  <div className="text-[10px] text-amber-400">
                    Sovereign Earth Intelligence Tier (€27,000 / Month) • Certified by PhD Economic Geologists
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPitchDossier(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-200 leading-relaxed">
              <div className="p-4 rounded-xl bg-black/80 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-300 uppercase">
                  Executive Target: {selectedDeposit.name} ({selectedDeposit.country})
                </div>
                <div className="text-[11px] text-slate-300">
                  <strong>Audited In-Situ Value:</strong> <span className="text-emerald-400 font-bold">{selectedDeposit.estimatedInSituValueUSD}</span> | <strong>Operator:</strong> {selectedDeposit.currentOperator} | <strong>Status:</strong> {selectedDeposit.licenseStatus}
                </div>
              </div>

              {/* Financial Returns Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-[10px]">Net Present Value (NPV):</span>
                  <div className="text-lg font-bold text-emerald-400">${selectedDeposit.commercialMetrics.npvBillionUSD} Billion</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-[10px]">Internal Rate of Return:</span>
                  <div className="text-lg font-bold text-cyan-300">{selectedDeposit.commercialMetrics.irrPercent}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-[10px]">Development Capex:</span>
                  <div className="text-lg font-bold text-amber-300">${selectedDeposit.commercialMetrics.capexMillionUSD}M</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-slate-400 text-[10px]">Operating Cash Cost:</span>
                  <div className="text-lg font-bold text-purple-300">{selectedDeposit.commercialMetrics.opexUnit}</div>
                </div>
              </div>

              {/* Exploration Logic & Geological Thesis */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase text-[11px] text-cyan-300">
                  1. GEOLOGICAL & TECTONIC THESIS
                </h4>
                <p className="text-slate-300">{selectedDeposit.geologicalModel}</p>
                <p className="text-slate-300">
                  <strong>Structural Trap:</strong> {selectedDeposit.structuralControl}
                </p>
                <p className="text-slate-300">
                  <strong>Host Lithology:</strong> {selectedDeposit.hostLithology}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase text-[11px] text-cyan-300">
                  2. SUB-SURFACE GEOPHYSICAL & ASTER SPECTRAL VECTORING
                </h4>
                <p className="text-slate-300">
                  <strong>Seismic / Gravity Anomaly:</strong> {selectedDeposit.geophysicalAnomaly}
                </p>
                <p className="text-slate-300">
                  <strong>ASTER Hyperspectral Footprint:</strong> {selectedDeposit.spectralSignatureASTER}
                </p>
                <p className="text-emerald-400 font-bold">
                  Target Vector: Depth {selectedDeposit.drillingTargetVectors.targetDepthMeters}m @ Dip {selectedDeposit.drillingTargetVectors.dipAngleDegrees}° ({selectedDeposit.drillingTargetVectors.probabilityOfDiscoveryPercent}% Discovery Confidence)
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase text-[11px] text-cyan-300">
                  3. ACADEMIC & PEER-REVIEWED VALIDATION
                </h4>
                {selectedDeposit.recentScientificPublications.map((pub, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/80 border border-white/10 text-[11px]">
                    <span className="text-amber-300 font-bold">{pub.journal} ({pub.year}):</span> {pub.title}
                    <div className="text-slate-400 text-[10px] mt-0.5">{pub.keyFinding}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                {copiedNotification ? (
                  <span className="text-emerald-400 font-bold">✓ DOSSIER COPIED TO CLIPBOARD</span>
                ) : (
                  <span>CONFIDENTIAL & PROPRIETARY • INSTITUTIONAL BOARD READY</span>
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
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold hover:brightness-110 transition-all"
                >
                  🖨️ PRINT EXECUTIVE MEMO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

