"use client";

import { useEffect, useState, useRef } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import NurEarth3DGlobe from "@/components/geopolitics/NurEarth3DGlobe";
import {
  BROADCAST_LANGUAGES,
  LanguageBroadcastProfile,
  hdVoiceEngine,
} from "@/lib/broadcast/multilingual-broadcast";
import { cyberSound } from "@/lib/audio/sound-synth";
import { useIDEStore } from "@/stores/useIDEStore";

export type StudioBackdropMode =
  | "NUR_STUDIO_2126"
  | "3D_GLOBE"
  | "ORBITAL_RADAR"
  | "FINANCIAL_BOURSES"
  | "DEEP_EARTH_EXPLORATION"
  | "CYBER_WARFARE";

const MARKET_MATRIX = [
  { symbol: "S&P 500", price: "5,864.20", change: "+0.92%", up: true, bourse: "NYSE" },
  { symbol: "NASDAQ 100", price: "20,418.50", change: "+1.35%", up: true, bourse: "NASDAQ" },
  { symbol: "DAX 40", price: "19,120.40", change: "+0.64%", up: true, bourse: "XETRA" },
  { symbol: "NIKKEI 225", price: "39,840.10", change: "+1.78%", up: true, bourse: "TSE" },
  { symbol: "BIST 100", price: "10,240.80", change: "+2.14%", up: true, bourse: "BIST" },
  { symbol: "TADAWUL", price: "12,180.50", change: "+0.45%", up: true, bourse: "SASE" },
  { symbol: "BRENT CRUDE", price: "$78.40 / bbl", change: "+0.85%", up: true, bourse: "ICE" },
  { symbol: "GOLD (XAU)", price: "$2,648.50 / oz", change: "+1.42%", up: true, bourse: "COMEX" },
  { symbol: "URANIUM (U3O8)", price: "$84.50 / lb", change: "+3.20%", up: true, bourse: "NYMEX" },
  { symbol: "LITHIUM (SC6)", price: "$920 / t", change: "+4.10%", up: true, bourse: "SMM" },
  { symbol: "BITCOIN", price: "$68,450", change: "+3.15%", up: true, bourse: "CRYPTO" },
  { symbol: "VIX INDEX", price: "14.12", change: "-4.20%", up: false, bourse: "CBOE" },
];

export default function LiveBroadcast() {
  const { openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[0]); // Default Turkish Umay Nur
  const [backdropMode, setBackdropMode] = useState<StudioBackdropMode>("NUR_STUDIO_2126");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [activeSegment, setActiveSegment] = useState<"opening" | "macro" | "quant" | "breaking">("opening");

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % selectedLang.headlines.length);
    }, 7000);
    return () => clearInterval(cycleTimer);
  }, [selectedLang.headlines.length]);

  const toggleSpeech = () => {
    cyberSound.playClick();
    if (isSpeaking) {
      hdVoiceEngine.stop();
      setIsSpeaking(false);
    } else {
      const fullSpeechText = `${selectedLang.scripts[activeSegment]} ${selectedLang.scripts.breaking}`;
      hdVoiceEngine.speak(
        fullSpeechText,
        selectedLang.langCode,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const formatTime = (d: Date | null, tz: string) => {
    if (!d) return "--:--:--";
    try {
      return d.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none font-sans text-white flex flex-col justify-between">
      {/* ── BACKGROUND STUDIO VIDEO WALL ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
        {backdropMode === "NUR_STUDIO_2126" ? (
          <div className="w-full h-full relative overflow-hidden">
            <img
              src="/images/studio/broadcast_studio.jpg"
              alt="NUR TV 2126 Studio Set"
              className="w-full h-full object-cover opacity-90 scale-105 transform animate-pulse duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60 pointer-events-none" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/80 text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-lg border border-red-400/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>NUR TV 2126 4K HDR BROADCAST HUB</span>
            </div>
          </div>
        ) : backdropMode === "3D_GLOBE" ? (
          <div className="w-full h-full relative">
            <NurEarth3DGlobe />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />
          </div>
        ) : backdropMode === "ORBITAL_RADAR" ? (
          <div className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#062b40_0%,#020914_70%,#000000_100%)]">
            <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/30 relative animate-pulse flex items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-full border border-cyan-400/20" />
              <div className="w-[220px] h-[220px] rounded-full border border-cyan-300/30" />
              <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
              <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
              <div className="absolute top-1/3 left-1/4 px-2 py-0.5 rounded bg-red-500/30 text-red-300 font-mono text-[10px] border border-red-500/50">
                DEFENSE TRACKER: NORAD SATELLITE PASS #54751113
              </div>
              <div className="absolute bottom-1/4 right-1/3 px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono text-[10px] border border-emerald-500/50">
                ORBITAL HARMONICS: [13 • 35 • 42 • 55]
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none" />
          </div>
        ) : backdropMode === "FINANCIAL_BOURSES" ? (
          <div className="w-full h-full p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/90 overflow-hidden opacity-80">
            {MARKET_MATRIX.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between font-mono">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{m.bourse}</span>
                  <span className={m.up ? "text-emerald-400" : "text-red-400"}>{m.change}</span>
                </div>
                <div className="text-sm font-bold text-white mt-1">{m.symbol}</div>
                <div className="text-xl font-bold text-cyan-300 mt-2">{m.price}</div>
              </div>
            ))}
          </div>
        ) : backdropMode === "DEEP_EARTH_EXPLORATION" ? (
          <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-gradient-to-b from-amber-950/40 via-slate-950 to-black font-mono">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                DEEP EARTH & HYDROCARBON CONCESSION INTELLIGENCE
              </span>
              <h2 className="text-2xl font-bold text-white font-serif">
                GLOBAL OIL SUPERMAJORS & CRITICAL MINERAL CONGLOMERATES
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                Real-time AVO seismic inversion, Santos Basin pre-salt petroleum trapping, and Greenbushes lithium pegmatite reserves.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-red-950/20 font-mono">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest animate-pulse">
                APT THREAT TELEMETRY & ZERO-DAY EXPLOIT RADAR
              </span>
              <h2 className="text-2xl font-bold text-white font-serif">
                STATE-SPONSORED CYBER WARFARE OPERATIONS
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                Real-time packet telemetry, BGP routing anomalies, and critical infrastructure SCADA attack vectors.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── TOP HEADER BAR - SOVEREIGN BROADCAST CONTROL ROOM ───────────────── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl border-b border-amber-500/30 shrink-0 font-mono shadow-xl">
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 font-serif">
                NUR TV SOVEREIGN BROADCAST
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold animate-pulse shadow">
                ● ON-AIR (LIVE 4K)
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Global Media Video Wall • Quantum AI Presenters • Multilingual Speech Synthesis • 3D Planetary Backdrop
            </p>
          </div>
        </div>

        {/* Backdrop Switcher & Popout Controls */}
        <div className="flex items-center gap-2">
          {/* Studio Video Wall Selector */}
          <div className="hidden md:flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px]">
            {[
              { id: "NUR_STUDIO_2126", label: "📺 NUR 2126 STUDIO" },
              { id: "3D_GLOBE", label: "🌐 3D GLOBE" },
              { id: "ORBITAL_RADAR", label: "📡 ORBIT RADAR" },
              { id: "FINANCIAL_BOURSES", label: "📊 BOURSES" },
              { id: "DEEP_EARTH_EXPLORATION", label: "🛢️ DEEP EARTH" },
              { id: "CYBER_WARFARE", label: "⚔️ CYBER MAP" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  cyberSound.playClick();
                  setBackdropMode(mode.id as StudioBackdropMode);
                }}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  backdropMode === mode.id
                    ? "bg-amber-500 text-black shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* AI Voice Commentary Button */}
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center gap-2 ${
              isSpeaking
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-red-600/50"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold"
            }`}
          >
            {isSpeaking ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>STOP AI ANCHOR</span>
              </>
            ) : (
              <>
                <span>🎙️ AI ANCHOR VOICE ({selectedLang.flag})</span>
              </>
            )}
          </button>

          {/* Popout Controls */}
          <button
            onClick={() => openFloatingWindow("live-tv", "📺 NUR TV Sovereign Live Broadcast")}
            title="Detach into Draggable Floating Window"
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 text-xs font-bold transition-all shadow"
          >
            ⤢ DETACH
          </button>

          <button
            onClick={() => popoutToNativeWindow("live-tv")}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── CENTER STUDIO OVERLAY INFORMATION ───────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-6 pointer-events-none">
        {/* Global World Clocks Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[10px] font-mono text-slate-300">
            <span>NYC: <strong className="text-emerald-400">{formatTime(currentTime, "America/New_York")}</strong></span>
            <span className="text-slate-600">|</span>
            <span>LON: <strong className="text-cyan-400">{formatTime(currentTime, "Europe/London")}</strong></span>
            <span className="text-slate-600">|</span>
            <span>FRA: <strong className="text-amber-400">{formatTime(currentTime, "Europe/Berlin")}</strong></span>
            <span className="text-slate-600">|</span>
            <span>IST: <strong className="text-purple-400">{formatTime(currentTime, "Europe/Istanbul")}</strong></span>
            <span className="text-slate-600">|</span>
            <span>TYO: <strong className="text-pink-400">{formatTime(currentTime, "Asia/Tokyo")}</strong></span>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/15 text-xs font-mono">
            {BROADCAST_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  cyberSound.playClick();
                  setSelectedLang(lang);
                  if (isSpeaking) hdVoiceEngine.stop();
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  selectedLang.id === lang.id
                    ? "bg-amber-500 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
                title={lang.name}
              >
                {lang.flag} {lang.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Lower Left & Right HUD Cards */}
        <div className="flex flex-wrap items-end justify-between gap-4 pointer-events-auto">
          {/* Active Presenter Desk Card */}
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-extrabold text-sm uppercase tracking-wide shadow-lg">
              <span>👤 {selectedLang.defaultAnchorName}</span>
              <span className="text-[10px] font-mono font-normal opacity-80">({selectedLang.city})</span>
            </div>

            <div className="p-4 rounded-b-2xl rounded-r-2xl bg-black/85 backdrop-blur-xl border border-amber-500/30 text-xs font-mono text-slate-200 space-y-2.5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-300 font-bold tracking-wider uppercase text-[11px]">
                  GLOBAL MACRO & SOVEREIGN INTELLIGENCE DESK
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  ORBIT: #54751113
                </span>
              </div>

              {/* Segment Switcher */}
              <div className="flex items-center gap-1 text-[10px]">
                {(["opening", "macro", "quant", "breaking"] as const).map((seg) => (
                  <button
                    key={seg}
                    onClick={() => {
                      cyberSound.playClick();
                      setActiveSegment(seg);
                    }}
                    className={`px-2 py-0.5 rounded-lg uppercase font-bold transition-all ${
                      activeSegment === seg
                        ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50"
                        : "text-slate-400 hover:text-white bg-white/5"
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              {/* Anchor Photo & Script */}
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-amber-400/50 shrink-0 shadow-md">
                  <img
                    src={
                      selectedLang.id === "tr"
                        ? "/images/characters/umay_nur.jpg"
                        : selectedLang.id === "en"
                        ? "/images/characters/marcus_sterling.jpg"
                        : "/images/characters/elena_vance.jpg"
                    }
                    alt={selectedLang.defaultAnchorName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-[#69f0ae] font-bold">
                    🟢 GREEN EYES
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto flex-1">
                  {selectedLang.scripts[activeSegment]}
                </p>
              </div>

              {isSpeaking && (
                <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold animate-pulse pt-1 border-t border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>AI NEURAL VOICE SYNTHESIS ACTIVE • TELEMETRY ENCODED...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Live Market Depth Matrix */}
          <div className="w-72 p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-xs font-mono space-y-2.5 shadow-2xl hidden sm:block">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                LIVE COMMODITIES & BOURSES
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {MARKET_MATRIX.slice(0, 7).map((m) => (
                <div key={m.symbol} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 font-medium">{m.symbol}</span>
                  <span className={`font-bold font-mono ${m.up ? "text-emerald-400" : "text-red-400"}`}>
                    {m.price} <span className="text-[10px] ml-1">{m.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM LIVE BROADCAST TICKER & CONTROL BAR ──────────────────────── */}
      <div className="relative z-10 space-y-1 shrink-0">
        {/* Breaking News Red Ticker */}
        <div className="flex items-center h-9 bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-4 text-xs font-bold text-white tracking-wider shadow-lg">
          <span className="px-2.5 py-0.5 rounded bg-white text-red-700 font-extrabold text-[10px] mr-3 shrink-0 uppercase tracking-widest shadow">
            BREAKING SOVEREIGN INTEL
          </span>
          <span className="truncate font-sans font-semibold text-slate-100">
            {selectedLang.headlines[headlineIdx] || selectedLang.headlines[0]}
          </span>
        </div>

        {/* Global Finance Scrolling News Ticker */}
        <div className="flex items-center justify-between h-10 bg-black/95 backdrop-blur-md border-t border-cyan-500/30 px-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-bold shrink-0 border-r border-white/15 pr-4 text-[10px]">
            <span className="text-slate-400">ORBITAL HARMONICS:</span>
            <span className="text-amber-300">[13 • 35 • 42 • 55 • #54751113]</span>
          </div>

          {/* Scrolling Ticker Text */}
          <div className="flex-1 overflow-hidden ml-4">
            <div className="flex items-center gap-12 whitespace-nowrap animate-[scroll-left_45s_linear_infinite] text-slate-300 text-[11px]">
              {selectedLang.headlines.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="text-cyan-400">◆</span>
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

