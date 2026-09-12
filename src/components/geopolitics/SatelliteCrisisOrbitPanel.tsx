"use client";

import { useState, useEffect, useRef } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";

interface CrisisChokepoint {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "NORMAL";
  dailyVolume: string;
  threatDescription: string;
  sensorAlert: string;
  aisVesselCount: number;
  oilFlowMbd: number;
}

const STRATEGIC_CHOKEPOINTS: CrisisChokepoint[] = [
  {
    id: "CP-HORMUZ",
    name: "Strait of Hormuz",
    region: "Middle East / Persian Gulf",
    lat: 26.56,
    lng: 56.25,
    severity: "CRITICAL",
    dailyVolume: "21.0 Million Barrels/Day (21% of Global Petroleum)",
    threatDescription: "Anti-ship missile battery telemetry detected on coastal cliffs. Tanker escort protocols active.",
    sensorAlert: "SAR RADAR: 4 Fast Attack Craft Loitering near Traffic Separation Scheme",
    aisVesselCount: 142,
    oilFlowMbd: 20.8,
  },
  {
    id: "CP-MANDAB",
    name: "Bab-el-Mandeb & Red Sea",
    region: "Horn of Africa / Yemen",
    lat: 12.58,
    lng: 43.33,
    severity: "CRITICAL",
    dailyVolume: "8.8 Million Barrels/Day + 12% Global Containerized Trade",
    threatDescription: "Unmanned surface vessel (USV) drone swarm activity. Container freight rerouting via Cape of Good Hope (+14 days).",
    sensorAlert: "FLIR THERMAL: Kinetic Exhaust Plumes Tracked in Hodeidah Littoral Sector",
    aisVesselCount: 68,
    oilFlowMbd: 8.4,
  },
  {
    id: "CP-TAIWAN",
    name: "Taiwan Strait & Bashi Channel",
    region: "East Asia / Indo-Pacific",
    lat: 24.28,
    lng: 119.54,
    severity: "HIGH",
    dailyVolume: "48% of Global Container Fleet + 90% Advanced Semiconductor Logistics",
    threatDescription: "Joint naval-air encirclement patrols crossing Median Line. GPS jamming reported across northern shipping lanes.",
    sensorAlert: "MULTI-SPECTRAL: Naval Surface Action Group 18nm Off Penghu Archipelago",
    aisVesselCount: 312,
    oilFlowMbd: 14.2,
  },
  {
    id: "CP-BOSPHORUS",
    name: "Bosphorus & Dardanelles",
    region: "Eurasia / Black Sea",
    lat: 41.11,
    lng: 29.06,
    severity: "ELEVATED",
    dailyVolume: "3.2 Million Barrels/Day + 24% Global Wheat & Grain Export",
    threatDescription: "Drifting naval mine detection sweeps. Montreux Convention strict passage control enforced by Turkish Navy.",
    sensorAlert: "SONAR / OPTICAL: Bulk Carrier Convoy Cleared under Coast Guard Guidance",
    aisVesselCount: 89,
    oilFlowMbd: 3.1,
  },
  {
    id: "CP-MALACCA",
    name: "Strait of Malacca & Singapore",
    region: "Southeast Asia",
    lat: 1.43,
    lng: 102.89,
    severity: "NORMAL",
    dailyVolume: "16.5 Million Barrels/Day + 84,000 Ships/Year",
    threatDescription: "High-density maritime traffic choke point. Routine multi-lateral patrol operations.",
    sensorAlert: "AIS TELEMETRY: Nominal Transit Speeds (14.2 knots average)",
    aisVesselCount: 450,
    oilFlowMbd: 16.2,
  },
];

type SensorFilter = "SAR_RADAR" | "FLIR_THERMAL" | "MULTI_SPECTRAL" | "TRUE_COLOR";

export default function SatelliteCrisisOrbitPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<CrisisChokepoint>(STRATEGIC_CHOKEPOINTS[0]);
  const [activeFilter, setActiveFilter] = useState<SensorFilter>("SAR_RADAR");
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Radar Sweep Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const draw = () => {
      angle = (angle + 0.03) % (Math.PI * 2);
      setRadarSweepAngle(angle);

      const W = (canvas.width = canvas.offsetWidth);
      const H = (canvas.height = canvas.offsetHeight);

      ctx.clearRect(0, 0, W, H);

      // Radar CRT Background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
      if (activeFilter === "SAR_RADAR") {
        bg.addColorStop(0, "#011c14");
        bg.addColorStop(1, "#000806");
      } else if (activeFilter === "FLIR_THERMAL") {
        bg.addColorStop(0, "#2a0404");
        bg.addColorStop(1, "#0d0101");
      } else {
        bg.addColorStop(0, "#020f26");
        bg.addColorStop(1, "#01050f");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Concentric Range Rings
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.min(W, H) * 0.42;

      ctx.strokeStyle = activeFilter === "FLIR_THERMAL" ? "rgba(239, 68, 68, 0.25)" : "rgba(0, 212, 170, 0.25)";
      ctx.lineWidth = 1;

      for (let r = maxR / 3; r <= maxR; r += maxR / 3) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Rotating Sweep Beam
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      const sweepColor = activeFilter === "FLIR_THERMAL" ? "rgba(239, 68, 68, " : "rgba(0, 212, 170, ";
      sweepGrad.addColorStop(0, `${sweepColor}0.4)`);
      sweepGrad.addColorStop(1, `${sweepColor}0.0)`);

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle - 0.35, angle);
      ctx.closePath();
      ctx.fill();

      // Simulated Target Blips (AIS Vessels & Defense Nodes)
      const blips = [
        { r: maxR * 0.35, a: 0.8, name: "TANKER-ALPHA (VLCC)" },
        { r: maxR * 0.65, a: 2.1, name: "CORVETTE-55" },
        { r: maxR * 0.52, a: 3.7, name: "LNG-CARRIER-09" },
        { r: maxR * 0.82, a: 5.2, name: "COASTAL-BATTERY" },
      ];

      blips.forEach((b) => {
        const bx = cx + Math.cos(b.a) * b.r;
        const by = cy + Math.sin(b.a) * b.r;

        ctx.fillStyle = activeFilter === "FLIR_THERMAL" ? "#f87171" : "#00d4aa";
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "9px monospace";
        ctx.fillText(b.name, bx + 6, by - 4);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [activeFilter]);

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none font-sans" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b px-5 py-3 backdrop-blur-md shrink-0" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EagleCrest size={28} animate={true} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white font-serif">Satellite Crisis Orbit &amp; Maritime Reconnaissance Panel</h1>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  DEFCON 2 &bull; LIVE SAR TELEMETRY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Synthetic Aperture Radar (SAR), FLIR thermal tracking, and AIS vessel density for global economic choke points.
              </p>
            </div>
          </div>

          {/* Sensor Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(
              [
                { id: "SAR_RADAR" as const, label: "📡 SAR Radar" },
                { id: "FLIR_THERMAL" as const, label: "🔥 FLIR Thermal" },
                { id: "MULTI_SPECTRAL" as const, label: "🌈 Multi-Spectral" },
                { id: "TRUE_COLOR" as const, label: "🛰️ True Optical" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  cyberSound.playClick();
                  setActiveFilter(f.id);
                }}
                className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                  activeFilter === f.id ? "bg-cyan-500 text-black shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-5 space-y-5 max-w-6xl mx-auto w-full">
        {/* Chokepoint Selector Pills */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Target Strategic Maritime Corridor:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {STRATEGIC_CHOKEPOINTS.map((cp) => {
              const isSelected = selectedPoint.id === cp.id;
              return (
                <button
                  key={cp.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedPoint(cp);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-800 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-slate-900/60 border-white/5 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{cp.name}</div>
                  <div className="flex justify-between items-center text-[9px] font-mono mt-1">
                    <span className="text-slate-400">{cp.lat.toFixed(1)}°N, {cp.lng.toFixed(1)}°E</span>
                    <span className={`font-bold ${cp.severity === "CRITICAL" ? "text-red-400" : cp.severity === "HIGH" ? "text-amber-400" : "text-emerald-400"}`}>
                      {cp.severity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Radar Screen & Detailed Tactical Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Radar Screen Canvas */}
          <div className="lg:col-span-6 rounded-2xl border border-cyan-500/20 bg-slate-950 p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {activeFilter} Live Tactical Scan &bull; {selectedPoint.name}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">RANGE: 50 NM</span>
            </div>
            <div className="flex-1 min-h-[300px] rounded-xl overflow-hidden relative">
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400 bg-black/70 px-2 py-1 rounded border border-emerald-500/30">
                LAT: {selectedPoint.lat}°N &bull; LNG: {selectedPoint.lng}°E
              </div>
            </div>
          </div>

          {/* Chokepoint Dossier Card */}
          <div className="lg:col-span-6 p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{selectedPoint.region}</span>
                  <h2 className="text-base font-bold text-white font-serif">{selectedPoint.name}</h2>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    selectedPoint.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {selectedPoint.severity} THREAT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[9px] text-slate-400 block">DAILY PETROLEUM FLOW</span>
                  <span className="text-amber-400 font-bold text-sm">{selectedPoint.oilFlowMbd} MBD</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[9px] text-slate-400 block">ACTIVE AIS VESSELS</span>
                  <span className="text-cyan-300 font-bold text-sm">{selectedPoint.aisVesselCount} SHIPS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">
                  🛰️ REAL-TIME SENSOR TELEMETRY ALERT
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">
                  {selectedPoint.sensorAlert}
                </p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong>Strategic Impact:</strong> {selectedPoint.threatDescription}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 border-t border-white/10 pt-2 flex justify-between">
              <span>SATELLITE ORBIT: SENTINEL-1A SAR &bull; RESOLUTION: 1.0M</span>
              <span>SOVEREIGN INTELLIGENCE PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
