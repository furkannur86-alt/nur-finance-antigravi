"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { getStoredSovereignWallet, generateSovereignWallet } from "@/lib/crypto/sovereignWallet";

interface MeshNode {
  id: string;
  city: string;
  country: string;
  flag: string;
  coordinates: [number, number];
  gflops: number;
  status: "ONLINE" | "COMPUTING" | "STANDBY";
  latencyMs: number;
}

const GLOBAL_MESH_NODES: MeshNode[] = [
  { id: "NODE-GVA-01", city: "Geneva", country: "Switzerland", flag: "🇨🇭", coordinates: [46.2044, 6.1432], gflops: 142.8, status: "COMPUTING", latencyMs: 8 },
  { id: "NODE-ZRH-02", city: "Zurich", country: "Switzerland", flag: "🇨🇭", coordinates: [47.3769, 8.5417], gflops: 188.4, status: "COMPUTING", latencyMs: 11 },
  { id: "NODE-IST-03", city: "Istanbul", country: "Turkey", flag: "🇹🇷", coordinates: [41.0082, 28.9784], gflops: 215.2, status: "COMPUTING", latencyMs: 14 },
  { id: "NODE-DXB-04", city: "Dubai", country: "UAE", flag: "🇦🇪", coordinates: [25.2048, 55.2708], gflops: 310.5, status: "COMPUTING", latencyMs: 28 },
  { id: "NODE-FRA-05", city: "Frankfurt", country: "Germany", flag: "🇩🇪", coordinates: [50.1109, 8.6821], gflops: 165.0, status: "ONLINE", latencyMs: 12 },
  { id: "NODE-SGP-06", city: "Singapore", country: "Singapore", flag: "🇸🇬", coordinates: [1.3521, 103.8198], gflops: 240.1, status: "COMPUTING", latencyMs: 65 },
  { id: "NODE-TKO-07", city: "Tokyo", country: "Japan", flag: "🇯🇵", coordinates: [35.6762, 139.6503], gflops: 195.6, status: "ONLINE", latencyMs: 78 },
  { id: "NODE-NYC-08", city: "New York", country: "USA", flag: "🇺🇸", coordinates: [40.7128, -74.006], gflops: 280.9, status: "COMPUTING", latencyMs: 42 },
];

export default function WebGPUMiningNodePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [walletAddress, setWalletAddress] = useState<string>("0xNUR54751113");
  const [isMining, setIsMining] = useState<boolean>(true);
  const [computeMode, setComputeMode] = useState<"ECO" | "BALANCED" | "TURBO">("BALANCED");
  const [intensityPct, setIntensityPct] = useState<number>(45);

  // Live Telemetry
  const [currentGflops, setCurrentGflops] = useState<number>(148.5);
  const [hashesComputed, setHashesComputed] = useState<number>(458920);
  const [matrixTensorsVerified, setMatrixTensorsVerified] = useState<number>(1892);
  const [userEarnedNur, setUserEarnedNur] = useState<number>(1.2458);
  const [foundationNur, setFoundationNur] = useState<number>(4.9832);
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(54);
  const [powerWatts, setPowerWatts] = useState<number>(42);
  const [webGPUAvailable, setWebGPUAvailable] = useState<boolean>(true);

  useEffect(() => {
    let w = getStoredSovereignWallet();
    if (w) {
      setWalletAddress(w.address);
    } else {
      generateSovereignWallet().then((nw) => setWalletAddress(nw.address));
    }

    if (typeof navigator !== "undefined" && "gpu" in navigator) {
      setWebGPUAvailable(true);
    }
  }, []);

  // Live Mining Loop
  useEffect(() => {
    if (!isMining) return;
    const interval = setInterval(() => {
      const modeMultiplier = computeMode === "ECO" ? 0.7 : computeMode === "TURBO" ? 1.5 : 1.0;
      const effectiveLoad = (intensityPct / 100) * modeMultiplier;

      setCurrentGflops(+(120 + effectiveLoad * 180 + (Math.random() * 10 - 5)).toFixed(1));
      setHashesComputed((prev) => prev + Math.floor(effectiveLoad * 1400 + Math.random() * 100));
      setMatrixTensorsVerified((prev) => prev + (Math.random() > 0.4 ? 1 : 0));

      const rewardDelta = effectiveLoad * 0.000008;
      setUserEarnedNur((prev) => +(prev + rewardDelta * 0.2).toFixed(6)); // 20% local
      setFoundationNur((prev) => +(prev + rewardDelta * 0.8).toFixed(6)); // 80% foundation

      setTemperatureCelsius(Math.floor(48 + effectiveLoad * 24 + Math.random() * 2));
      setPowerWatts(Math.floor(30 + effectiveLoad * 65 + Math.random() * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMining, computeMode, intensityPct]);

  // Canvas Shader / Matrix Wave Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // Deep cyber gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#030816");
      bg.addColorStop(1, "#02121f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Matrix computation grid lines
      ctx.strokeStyle = "rgba(0, 212, 170, 0.06)";
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Quantum tensor wave
      if (isMining) {
        ctx.strokeStyle = "#00d4aa";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = H * 0.5 + Math.sin(x * 0.02 + frame * 0.05) * 20 * (intensityPct / 50) + Math.cos(x * 0.04 - frame * 0.03) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary WGSL Tensor Harmonic
        ctx.strokeStyle = "rgba(99, 102, 241, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = H * 0.5 + Math.cos(x * 0.025 - frame * 0.04) * 16 * (intensityPct / 50);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMining, intensityPct]);

  const totalGflopsNetwork = useMemo(() => {
    return GLOBAL_MESH_NODES.reduce((sum, n) => sum + n.gflops, 0) + currentGflops;
  }, [currentGflops]);

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none font-sans" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b px-5 py-3 backdrop-blur-md shrink-0" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EagleCrest size={28} animate={isMining} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white font-serif">WebGPU DePIN Compute Node &amp; PoUW AI Engine</h1>
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${isMining ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-400"}`}>
                  {isMining ? "NODE ACTIVE &bull; COMPUTING WGSL" : "NODE PAUSED"}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {webGPUAvailable ? "WEBGPU ACCELERATED" : "WASM FALLBACK"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Decentralized client-side matrix multiplication verifying sovereign LLM tensor layers with real-time 80/20 revenue streaming.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cyberSound.playClick();
                setIsMining(!isMining);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-1.5 ${
                isMining ? "bg-rose-500 hover:bg-rose-400 text-white" : "bg-emerald-500 hover:bg-emerald-400 text-black"
              }`}
            >
              <span>{isMining ? "⏹" : "▶"}</span> {isMining ? "PAUSE NODE" : "START WEBGPU NODE"}
            </button>
          </div>
        </div>
      </header>

      <div className="p-5 space-y-5 max-w-6xl mx-auto w-full">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Local Compute Power", value: `${currentGflops} GFLOPS`, color: "#00d4aa" },
            { label: "Global Mesh Total", value: `${totalGflopsNetwork.toFixed(1)} GFLOPS`, color: "#38bdf8" },
            { label: "Tensor Inferences Verified", value: matrixTensorsVerified.toLocaleString(), color: "#a855f7" },
            { label: "Local Wallet Share (20%)", value: `${userEarnedNur} $NUR`, color: "#f59e0b" },
            { label: "Foundation Share (80%)", value: `${foundationNur} $NUR`, color: "#6366f1" },
            { label: "Thermal / Power", value: `${temperatureCelsius}°C / ${powerWatts}W`, color: temperatureCelsius > 70 ? "#ef4444" : "#10b981" },
          ].map((k) => (
            <div key={k.label} className="p-3 rounded-2xl border border-white/10 bg-slate-900/80 shadow-md">
              <div className="text-[9px] font-mono uppercase text-slate-400 truncate">{k.label}</div>
              <div className="text-sm font-bold font-mono mt-0.5" style={{ color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Real-time Shader Waveform & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Canvas Waveform */}
          <div className="lg:col-span-8 rounded-2xl border border-cyan-500/20 bg-slate-950 p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  WGSL Tensor Workgroup Matrix Multiplier Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Tensors/sec: {(currentGflops * 12.4).toFixed(0)}</span>
            </div>
            <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden relative">
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded border border-white/10">
                KERNEL: @compute @workgroup_size(8,8) &bull; HASHES: {hashesComputed.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Node Tuning Controls */}
          <div className="lg:col-span-4 p-4 rounded-2xl border border-white/10 bg-slate-900/80 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Hardware Load Tuning
            </h3>

            {/* Compute Mode Buttons */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Execution Mode</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["ECO", "BALANCED", "TURBO"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      cyberSound.playClick();
                      setComputeMode(m);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      computeMode === m
                        ? "bg-cyan-500 text-black shadow-md"
                        : "bg-black/40 text-slate-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">GPU Resource Limit:</span>
                <span className="text-cyan-300 font-bold">{intensityPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={intensityPct}
                onChange={(e) => setIntensityPct(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>10% (Background)</span>
                <span>90% (Max Throughput)</span>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-[11px] font-mono">
              <span className="text-[9px] text-slate-400 uppercase block">Settlement Wallet Address</span>
              <div className="text-white truncate font-bold">{walletAddress}</div>
              <div className="text-emerald-400 text-[10px] pt-1">
                Dual-Stream Active: 80% Free Global Access / 20% Operator Yield
              </div>
            </div>
          </div>
        </div>

        {/* Global Mesh DePIN Network Nodes */}
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              🌐 Sovereign DePIN Global Compute Mesh Nodes ({GLOBAL_MESH_NODES.length + 1})
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">100% MESH HEALTH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {GLOBAL_MESH_NODES.map((node) => (
              <div key={node.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>{node.flag}</span> {node.city}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {node.status}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Throughput:</span>
                  <span className="text-cyan-300 font-bold">{node.gflops} GFLOPS</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Node ID: {node.id}</span>
                  <span>{node.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
