"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CIVILIZATIONAL_FLEET,
  CIVILIZATIONS_LIST,
  CivilizationalShip,
  ShipFaction,
} from "@/lib/broadcast/civilizationalShips";

interface CivilizationTerminalPanelProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function CivilizationTerminalPanel({
  onClose,
  onMinimize,
}: CivilizationTerminalPanelProps) {
  const [selectedCivilizationKey, setSelectedCivilizationKey] = useState<string>("turkish");
  const [activeFaction, setActiveFaction] = useState<ShipFaction>("conservative");
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpProgress, setWarpProgress] = useState<number>(0);
  const [inCockpitMode, setInCockpitMode] = useState<boolean>(false);
  const [marketPrice, setMarketPrice] = useState<number>(9842.5);
  const [priceChange, setPriceChange] = useState<number>(1.42);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechText, setSpeechText] = useState<string>("");
  const [hudVisible, setHudVisible] = useState<boolean>(true);

  const warpCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Find active ship based on civilization & faction
  const activeShip: CivilizationalShip =
    CIVILIZATIONAL_FLEET.find(
      (s) => s.civilizationKey === selectedCivilizationKey && s.faction === activeFaction
    ) || CIVILIZATIONAL_FLEET[0];

  // Simulated live market price ticker
  useEffect(() => {
    // Set base price depending on market index
    let base = 10000;
    if (activeShip.marketIndex.includes("BIST")) base = 9850;
    else if (activeShip.marketIndex.includes("FTSE")) base = 8240;
    else if (activeShip.marketIndex.includes("DAX")) base = 18600;
    else if (activeShip.marketIndex.includes("Nikkei")) base = 39200;
    else if (activeShip.marketIndex.includes("NASDAQ")) base = 18900;
    else if (activeShip.marketIndex.includes("SSE")) base = 3120;
    else if (activeShip.marketIndex.includes("TASI")) base = 11950;
    setMarketPrice(base);

    const interval = setInterval(() => {
      setMarketPrice((prev) => {
        const delta = (Math.random() - 0.48) * (prev * 0.0015);
        const newPrice = Number((prev + delta).toFixed(2));
        setPriceChange(Number((((newPrice - base) / base) * 100).toFixed(2)));
        return newPrice;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [activeShip.marketIndex]);

  // Set default anchor broadcast message
  useEffect(() => {
    if (activeFaction === "conservative") {
      setSpeechText(
        `[${activeShip.name} // KÖPRÜ BİLDİRİMİ]: ${activeShip.civilization} stratejik egemenlik ve ${activeShip.allianceName} protokolleri devrede. ${activeShip.marketIndex} endeksi ${marketPrice} seviyesinde kurumsal sermaye kalkanı ile korunmaktadır.`
      );
    } else {
      setSpeechText(
        `[${activeShip.name} // SKY LOUNGE]: ${activeShip.theme} partisi başladı! ${activeShip.marketIndex} likiditesi tavan yaptı, küresel fonlar ${activeShip.targetRegion} merkezine akıyor. Şampanyalar hazır!`
      );
    }
  }, [activeShip, activeFaction, marketPrice]);

  // Keyboard shortcut listener for 'H' (toggle HUD) and 'W' (Warp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h" || e.key === "H") {
        setHudVisible((prev) => !prev);
      } else if (e.key === "w" || e.key === "W") {
        if (!isWarping && !inCockpitMode) {
          triggerWarp();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWarping, inCockpitMode]);

  // Warp Canvas Animation Effect
  useEffect(() => {
    if (!isWarping) return;
    const canvas = warpCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const numStars = 600;
    const stars: { x: number; y: number; z: number; pz: number }[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
        pz: Math.random() * canvas.width,
      });
    }

    let animId: number;
    let speed = 2;

    const render = () => {
      speed += 1.8;
      ctx.fillStyle = "rgba(1, 4, 12, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
          star.z = canvas.width;
          star.pz = canvas.width;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const pk = 250 / star.pz;
          const sx = star.x * pk + cx;
          const sy = star.y * pk + cy;

          ctx.beginPath();
          ctx.strokeStyle = activeFaction === "conservative" ? "#00f0ff" : "#f43f5e";
          ctx.lineWidth = Math.min(3.5, (1 - star.z / canvas.width) * 4);
          ctx.moveTo(sx, sy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        star.pz = star.z;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isWarping, activeFaction]);

  // Warp Trigger Handler with Audio & Relativistic Acceleration
  const triggerWarp = () => {
    setIsWarping(true);
    setWarpProgress(0);

    // Play synthesized hyperspace sound if AudioContext is permitted
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 2.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {
      console.warn("Warp audio not initialized:", e);
    }

    const interval = setInterval(() => {
      setWarpProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsWarping(false);
          setInCockpitMode(true);
          return 100;
        }
        return p + 10;
      });
    }, 220);
  };

  // Text-To-Speech Playback
  const handlePlaySpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "tr-TR";
      utterance.rate = 1.05;
      utterance.pitch = activeFaction === "conservative" ? 0.95 : 1.1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız Web Speech API desteklemiyor.");
    }
  };

  const currentCiv = CIVILIZATIONS_LIST.find((c) => c.key === selectedCivilizationKey) || CIVILIZATIONS_LIST[0];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#02050e] text-white overflow-hidden select-none font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP COMMAND BAR & UNIVERSAL HUD CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="h-12 bg-[#050b18]/95 border-b border-[#00f0ff]/30 backdrop-blur-md flex items-center justify-between px-3 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        {/* Left: Title & Live Indicators */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 bg-black/60 border border-[#00f0ff]/40 px-2 py-1 rounded text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[#00f0ff] font-bold tracking-wider">CIVILIZATION TERMINAL</span>
            <span className="text-slate-500 text-[10px]">v19.4</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>18 Medeniyet</span>
            <span className="text-slate-600">/</span>
            <span>36 Mega-City Dreadnought</span>
          </div>

          {/* Alliance Badge */}
          <div
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
              activeShip.alliance === "NATO"
                ? "bg-blue-950/80 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : activeShip.alliance === "SCO_BRICS"
                ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                : activeShip.alliance === "QUAD_PACIFIC"
                ? "bg-amber-950/80 border-amber-500 text-amber-300"
                : "bg-emerald-950/80 border-emerald-500 text-emerald-300"
            }`}
          >
            {activeShip.alliance === "NATO" ? "🔵 NATO STANAG-4586" : activeShip.allianceName}
          </div>
        </div>

        {/* Center: Faction Toggle */}
        <div className="flex items-center bg-black/80 p-0.5 rounded-lg border border-slate-700/60 font-mono text-xs">
          <button
            onClick={() => {
              setActiveFaction("conservative");
              setInCockpitMode(false);
            }}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
              activeFaction === "conservative"
                ? "bg-gradient-to-r from-red-900/90 to-amber-900/90 text-amber-200 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🛡️</span>
            <span className="font-bold">Egemen / Muhafazakâr</span>
          </button>
          <button
            onClick={() => {
              setActiveFaction("liberal");
              setInCockpitMode(false);
            }}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
              activeFaction === "liberal"
                ? "bg-gradient-to-r from-purple-900/90 to-pink-900/90 text-pink-200 border border-pink-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🍸</span>
            <span className="font-bold">Liberal Skymarket</span>
          </button>
        </div>

        {/* Right: Universal HUD Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setHudVisible(!hudVisible)}
            title="HUD Panellerini Gizle/Göster [H]"
            className="text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 px-2 py-1 rounded transition"
          >
            HUD [{hudVisible ? "Açık" : "Kapalı"}]
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              title="Paneli Küçült"
              className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/20 border border-white/10 rounded text-slate-300 font-bold transition"
            >
              —
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              title="Paneli Kapat"
              className="w-7 h-7 flex items-center justify-center bg-red-950/60 hover:bg-red-600 border border-red-500/50 rounded text-red-300 hover:text-white font-bold transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 18-CIVILIZATION SELECTOR RIBBON
      ───────────────────────────────────────────────────────────── */}
      {hudVisible && !inCockpitMode && (
        <div className="h-11 bg-[#030814] border-b border-slate-800 flex items-center px-2 gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 z-20">
          {CIVILIZATIONS_LIST.map((civ) => {
            const isSelected = civ.key === selectedCivilizationKey;
            return (
              <button
                key={civ.key}
                onClick={() => {
                  setSelectedCivilizationKey(civ.key);
                  setInCockpitMode(false);
                }}
                className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? activeFaction === "conservative"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      : "bg-pink-500/20 text-pink-300 border border-pink-400 font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "bg-black/40 text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>{civ.flag}</span>
                <span>{civ.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT: COCKPIT MODE OR DUAL TERMINAL DASHBOARD
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* WARP CANVAS OVERLAY */}
        {isWarping && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <canvas ref={warpCanvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 flex flex-col items-center gap-3 bg-black/80 border border-[#00f0ff] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.4)] text-center max-w-md">
              <span className="text-3xl animate-bounce">🚀</span>
              <h2 className="text-xl font-bold font-mono text-[#00f0ff] tracking-widest uppercase">
                RELATIVISTIC HYPERSPACE WARP
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Hedef: <strong className="text-amber-300">{activeShip.name}</strong> Köşkü
              </p>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-[#00f0ff] to-amber-400 h-full transition-all duration-200"
                  style={{ width: `${warpProgress}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                Hız: 0.999c // Warp Factor {activeShip.telemetry.warpDriveTier}
              </span>
            </div>
          </div>
        )}

        {/* COCKPIT IFRAME VIEW (When warped in) */}
        {inCockpitMode ? (
          <div className="w-full h-full relative flex flex-col bg-black">
            <div className="h-9 bg-[#040914] border-b border-emerald-500/40 flex items-center justify-between px-3 z-10 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>BAĞLI KÖPRÜ: <strong>{activeShip.name}</strong></span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{activeShip.targetRegion}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInCockpitMode(false)}
                  className="px-2.5 py-0.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500 text-amber-300 rounded transition"
                >
                  ← Medeniyet Terminaline Dön
                </button>
                <a
                  href={activeShip.terminalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-0.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 rounded transition"
                >
                  ↗ Bağımsız Terminali Aç
                </a>
              </div>
            </div>
            <iframe
              src={activeShip.terminalUrl}
              title={activeShip.name}
              className="w-full flex-1 border-0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          /* STANDARD TERMINAL DASHBOARD */
          <div className="w-full h-full p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-y-auto">
            {/* ── LEFT COLUMN: SHIP OVERVIEW & HYPERDRIVE WARP (4 cols) ── */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* Ship Card */}
              <div
                className="bg-[#050a16] border rounded-xl p-4 relative overflow-hidden shadow-lg flex flex-col justify-between"
                style={{
                  borderColor: activeShip.accentColor,
                  boxShadow: `0 0 25px ${activeShip.accentColor}20`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {currentCiv.flag} {currentCiv.name}
                    </span>
                    <h2
                      className="text-lg font-bold font-mono tracking-tight mt-0.5"
                      style={{ color: activeShip.accentColor }}
                    >
                      {activeShip.name}
                    </h2>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      activeShip.faction === "conservative"
                        ? "bg-red-950/60 text-red-300 border-red-500/50"
                        : "bg-pink-950/60 text-pink-300 border-pink-500/50"
                    }`}
                  >
                    {activeShip.faction}
                  </span>
                </div>

                <div className="my-3 space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="bg-black/50 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">MİMARİ & GÖVDE</span>
                    <span className="text-slate-200">{activeShip.architecture}</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">TEMEL DOKTRİN / MİSYON</span>
                    <span className="text-amber-200">{activeShip.primaryMission}</span>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">REAKTÖR ÇEKİRDEĞİ</span>
                    <span className="text-cyan-400 font-bold">{activeShip.telemetry.reactorCore}</span>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">KALKAN MATRİSİ</span>
                    <span className="text-emerald-400 font-bold">
                      %{activeShip.telemetry.shieldStatus}
                    </span>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">YÖRÜNGE İRTİFASI</span>
                    <span className="text-amber-300">{activeShip.orbitalCoordinates.altitudeKm} km</span>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">HİPERUZAY SÜRÜŞÜ</span>
                    <span className="text-purple-300">{activeShip.telemetry.warpDriveTier}</span>
                  </div>
                </div>

                {/* WARP BUTTON */}
                <button
                  onClick={triggerWarp}
                  className="mt-4 w-full py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                  style={{
                    backgroundColor: activeShip.accentColor,
                    color: "#ffffff",
                    boxShadow: `0 0 20px ${activeShip.accentColor}60`,
                  }}
                >
                  <span className="text-sm">⚡</span>
                  <span>KÖPRÜYE BAĞLAN // WARP TO COCKPIT [W]</span>
                </button>
              </div>

              {/* Anchor Personas */}
              <div className="bg-[#050a16] border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <span>🎙️</span>
                  <span>GÖREVLİ BAŞ SPİKERLER & ANKÖRLER</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {activeShip.anchors.map((anchor, idx) => (
                    <div
                      key={idx}
                      className="bg-black/50 border border-slate-800/80 p-2 rounded flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-700 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow">
                        {anchor.charAt(0)}
                      </div>
                      <div className="text-[11px] font-mono">
                        <span className="text-white block font-bold leading-tight">{anchor}</span>
                        <span className="text-slate-500 text-[9px]">
                          {idx === 0 ? "Baş Spiker" : "Analist Ankör"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER COLUMN: CAPITAL MARKET RADAR & C4ISR TELEMETRY (5 cols) ── */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Financial Market Monitor */}
              <div className="bg-[#050a16] border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      KAPİTAL MERKEZİ // BORSA ENDEKSİ
                    </span>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                      <span>🏛️</span>
                      <span>{activeShip.marketIndexName}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                    {activeShip.marketIndex}
                  </span>
                </div>

                {/* Big Price Display */}
                <div className="flex items-baseline justify-between bg-black/60 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">ANLIK FİYAT</span>
                    <span className="text-2xl font-bold font-mono text-white tracking-tight">
                      {marketPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div
                    className={`font-mono text-sm font-bold flex items-center gap-1 ${
                      priceChange >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    <span>{priceChange >= 0 ? "▲" : "▼"}</span>
                    <span>{priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}</span>
                  </div>
                </div>

                {/* Simulated Order Book & Depth */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded">
                    <span className="text-emerald-400 text-[10px] block font-bold">
                      KURUMSAL ALIŞ DERİNLİĞİ (BID)
                    </span>
                    <div className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span>{(marketPrice - 0.5).toFixed(2)}</span>
                        <span className="text-emerald-400 font-bold">14,250 LOT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{(marketPrice - 1.2).toFixed(2)}</span>
                        <span className="text-emerald-400">28,800 LOT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{(marketPrice - 2.0).toFixed(2)}</span>
                        <span className="text-emerald-400">65,100 LOT</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-950/20 border border-red-900/40 p-2.5 rounded">
                    <span className="text-red-400 text-[10px] block font-bold">
                      SATIŞ DUVARI (ASK)
                    </span>
                    <div className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span>{(marketPrice + 0.5).toFixed(2)}</span>
                        <span className="text-red-400 font-bold">11,400 LOT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{(marketPrice + 1.1).toFixed(2)}</span>
                        <span className="text-red-400">19,500 LOT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{(marketPrice + 1.8).toFixed(2)}</span>
                        <span className="text-red-400">42,900 LOT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Asset Ticker */}
                <div className="bg-black/50 border border-slate-800 p-2.5 rounded flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">STRATEJİK AMİRAL HİSSE:</span>
                  <span className="text-amber-300 font-bold">{activeShip.primarySymbol}</span>
                  <span className="text-emerald-400 font-bold">+2.84% VOL. HIGH</span>
                </div>
              </div>

              {/* Orbital Telemetry Coordinates */}
              <div className="bg-[#050a16] border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <span>🛰️</span>
                  <span>C4ISR YÖRÜNGE KONUMU & HEDEF BÖLGE</span>
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">ENLEM (LAT)</span>
                    <span className="text-slate-200">{activeShip.orbitalCoordinates.lat}° N</span>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">BOYLAM (LON)</span>
                    <span className="text-slate-200">{activeShip.orbitalCoordinates.lon}° E</span>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">YÖRÜNGE HIZI</span>
                    <span className="text-cyan-400">7.72 km/s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: AI BROADCAST & TELEPROMPTER SPEECH (3 cols) ── */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="bg-[#050a16] border border-slate-800 rounded-xl p-4 flex flex-col gap-3 h-full justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <span>📡</span>
                      <span>AI ANKÖR TELEPROMPTER</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  </div>

                  <div className="mt-3 bg-black/70 border border-slate-800/80 p-3 rounded-lg text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                    {speechText}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handlePlaySpeech}
                    disabled={isSpeaking}
                    className={`w-full py-2 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2 transition ${
                      isSpeaking
                        ? "bg-amber-600 text-white animate-pulse"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
                    }`}
                  >
                    <span>{isSpeaking ? "🔊" : "▶️"}</span>
                    <span>{isSpeaking ? "ANKÖR YAYINDA..." : "SESLİ YAYINI DİNLE"}</span>
                  </button>

                  <a
                    href="/galactic-fleet.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>🌐</span>
                    <span>3D DÜNYA KÜRESİNDE GÖRÜNTÜLE</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
