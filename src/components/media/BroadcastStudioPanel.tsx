"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import NurEarth3DGlobe from "@/components/geopolitics/NurEarth3DGlobe";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";
import {
  BROADCAST_LANGUAGES,
  LanguageBroadcastProfile,
  hdVoiceEngine,
} from "@/lib/broadcast/multilingual-broadcast";
import { cyberSound } from "@/lib/audio/sound-synth";

export type StudioStageType =
  | "3d-globe"
  | "orbital-radar"
  | "financial-bourses"
  | "anchor-female"
  | "anchor-male"
  | "executive-office";

const STUDIO_STAGES: { id: StudioStageType; name: string; path?: string }[] = [
  { id: "3d-globe", name: "🌐 3D Planetary Earth & Geopolitical Globe" },
  { id: "orbital-radar", name: "📡 Starship Orbital Radar & Space Telemetry" },
  { id: "financial-bourses", name: "📊 Global Financial Bourses Matrix" },
  { id: "anchor-female", name: "Studio A — Global Anchor Stage", path: "/images/studio/anchor-female.jpg" },
  { id: "anchor-male", name: "Studio B — Senior Geopolitical Strategist", path: "/images/studio/anchor-male.jpg" },
  { id: "executive-office", name: "Studio C — Sovereign Executive Suite", path: "/images/studio/executive-office.jpg" },
];

export default function BroadcastStudioPanel() {
  const { setBreakingNewsTicker, addNotification, openFloatingWindow, popoutToNativeWindow } = useIDEStore();

  const [selectedLang, setSelectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[2]); // Default English
  const [selectedStudio, setSelectedStudio] = useState(STUDIO_STAGES[0]);
  const [activeSegment, setActiveSegment] = useState<"opening" | "macro" | "quant" | "breaking" | "closing">("opening");
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2);
  const [isPrompting, setIsPrompting] = useState(true);
  const [customHeadline, setCustomHeadline] = useState("");
  const [isLiveBroadcasting, setIsLiveBroadcasting] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [youtubeStreamKey, setYoutubeStreamKey] = useState("nur-live-stream-key-2126-xyz");
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);

  const prompterRef = useRef<HTMLDivElement>(null);

  // Auto-scroll teleprompter
  useEffect(() => {
    if (!isPrompting) return;
    const interval = setInterval(() => {
      if (prompterRef.current) {
        prompterRef.current.scrollTop += teleprompterSpeed;
        if (prompterRef.current.scrollTop >= prompterRef.current.scrollHeight - prompterRef.current.clientHeight) {
          prompterRef.current.scrollTop = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPrompting, teleprompterSpeed]);

  const handleInjectBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim()) return;
    const fullBanner = `[${selectedLang.name.toUpperCase()} TV] BREAKING INTEL: ${customHeadline.trim()}`;
    setBreakingNewsTicker(fullBanner);
    addNotification({
      title: "Broadcast Lower-Third Updated",
      message: `Breaking alert pushed to global terminals: "${customHeadline}"`,
      severity: "INFO",
      category: "NUR_TV",
    });
    setCustomHeadline("");
  };

  const currentScript = selectedLang.scripts[activeSegment];

  const handleSpeakScript = () => {
    cyberSound.playClick();
    if (isVoiceSpeaking) {
      hdVoiceEngine.stop();
      setIsVoiceSpeaking(false);
      return;
    }

    hdVoiceEngine.speak(
      currentScript,
      selectedLang.langCode,
      () => setIsVoiceSpeaking(true),
      () => setIsVoiceSpeaking(false),
      () => setIsVoiceSpeaking(false)
    );
  };

  const toggleLiveBroadcast = () => {
    cyberSound.playClick();
    if (!isLiveBroadcasting) {
      setIsLiveBroadcasting(true);
      setIsPrompting(true);
      handleSpeakScript();
      addNotification({
        title: "🔴 YouTube & NUR TV Broadcast Live",
        message: `${selectedLang.nativeName} live quantum intelligence stream transmitted to on-air video wall.`,
        severity: "SUCCESS",
        category: "NUR_TV",
      });
    } else {
      setIsLiveBroadcasting(false);
      hdVoiceEngine.stop();
      setIsVoiceSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Studio Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 font-mono shadow-md"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={isLiveBroadcasting} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">NUR TV 2126 Broadcast Studio & Planetary Media Hub</span>
              {isLiveBroadcasting ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-600 text-white animate-pulse">
                  ● ON-AIR (LIVE)
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-400">
                  STANDBY
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--ag-muted)]">
              AI Sovereign Presenters &bull; Multi-Language Voice Synthesis &bull; 3D Planetary Video Wall &bull; YouTube RTMP
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowYoutubeModal(true)}
            className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 transition-colors flex items-center gap-1.5"
          >
            <span>📺 YouTube RTMP</span>
          </button>

          <button
            onClick={() => openFloatingWindow("broadcast-studio", "🎙️ NUR TV Broadcast Studio")}
            title="Detach into Draggable Floating Window"
            className="px-2.5 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 text-xs font-bold transition-all shadow"
          >
            ⤢ DETACH
          </button>

          <button
            onClick={() => popoutToNativeWindow("broadcast-studio")}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
          >
            ↗ DUAL-SCREEN
          </button>

          <button
            onClick={toggleLiveBroadcast}
            className={`px-4 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all shadow-lg flex items-center gap-2 ${
              isLiveBroadcasting
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
                : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-cyan-500/20 font-extrabold"
            }`}
          >
            {isLiveBroadcasting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>STOP BROADCAST</span>
              </>
            ) : (
              <>
                <span>🔴 GO LIVE ON-AIR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Language & Studio Switcher */}
        <div
          className="w-64 flex flex-col border-r overflow-y-auto p-3 gap-4 shrink-0"
          style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
        >
          {/* Language Selector */}
          <div>
            <div className="text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              Broadcast Language ({BROADCAST_LANGUAGES.length})
            </div>
            <div className="space-y-1">
              {BROADCAST_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedLang(lang);
                    if (isVoiceSpeaking) hdVoiceEngine.stop();
                  }}
                  className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLang.id === lang.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white font-bold"
                      : "border-transparent bg-black/20 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="text-xs">{lang.nativeName}</div>
                      <div className="text-[9px] text-slate-500">{lang.city}</div>
                    </div>
                  </div>
                  {selectedLang.id === lang.id && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Studio Camera & Video Wall Switcher */}
          <div>
            <div className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider mb-2">
              Studio Stage & Video Wall View
            </div>
            <div className="space-y-1.5">
              {STUDIO_STAGES.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedStudio(bg);
                  }}
                  className={`w-full text-left p-2 rounded-lg border transition-all ${
                    selectedStudio.id === bg.id
                      ? "bg-amber-500/20 border-amber-400 text-white font-bold"
                      : "border-transparent bg-black/20 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs">{bg.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Studio Video Stage & Teleprompter */}
        <div className="flex-1 flex flex-col min-w-0 border-r" style={{ borderColor: "var(--ag-border)" }}>
          {/* Video Preview Box */}
          <div className="relative aspect-video w-full max-h-[50%] bg-black overflow-hidden border-b shrink-0 flex items-center justify-center" style={{ borderColor: "var(--ag-border)" }}>
            {selectedStudio.id === "3d-globe" ? (
              <div className="w-full h-full relative">
                <NurEarth3DGlobe />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
              </div>
            ) : selectedStudio.id === "orbital-radar" ? (
              <div className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#062b40_0%,#020914_70%,#000000_100%)]">
                <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/30 relative animate-pulse flex items-center justify-center">
                  <div className="w-[200px] h-[200px] rounded-full border border-cyan-400/20" />
                  <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
                  <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
                  <div className="absolute top-1/4 left-1/4 px-2 py-0.5 rounded bg-red-500/30 text-red-300 font-mono text-[9px]">
                    RADAR: PASS #54751113
                  </div>
                </div>
              </div>
            ) : selectedStudio.id === "financial-bourses" ? (
              <div className="w-full h-full p-4 grid grid-cols-3 gap-2 bg-slate-950/90 font-mono text-[10px]">
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">NYSE:</span>
                  <div className="text-emerald-400 font-bold text-sm">5,864.20</div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">NASDAQ:</span>
                  <div className="text-emerald-400 font-bold text-sm">20,418.50</div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">DAX 40:</span>
                  <div className="text-emerald-400 font-bold text-sm">19,120.40</div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">BRENT:</span>
                  <div className="text-amber-300 font-bold text-sm">$78.40</div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">GOLD:</span>
                  <div className="text-amber-400 font-bold text-sm">$2,648.50</div>
                </div>
                <div className="p-2 rounded bg-black/60 border border-white/10">
                  <span className="text-slate-400">BITCOIN:</span>
                  <div className="text-cyan-300 font-bold text-sm">$68,450</div>
                </div>
              </div>
            ) : selectedStudio.path ? (
              <Image
                src={selectedStudio.path}
                alt={selectedStudio.name}
                fill
                className="object-cover"
                priority
              />
            ) : null}

            {/* Overlaid TV Broadcast HUD */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Live Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>NUR TV LIVE</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                {selectedLang.flag} {selectedLang.nativeName}
              </span>
            </div>

            {/* Lower Third Anchor Name */}
            <div className="absolute bottom-3 left-3 z-10">
              <div className="bg-amber-500 text-black font-bold px-3 py-1 text-xs uppercase tracking-wider inline-block rounded-t">
                {selectedLang.defaultAnchorName}
              </div>
              <div className="bg-black/80 backdrop-blur border border-amber-500/40 text-white px-3 py-1 text-[11px] font-mono rounded-b rounded-r">
                Chief Geopolitical & Macro Strategist &bull; {selectedLang.city}
              </div>
            </div>

            {/* Voice Audio Playing Badge */}
            {isVoiceSpeaking && (
              <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>VOICE SYNTHESIS ACTIVE...</span>
              </div>
            )}
          </div>

          {/* Teleprompter Segment Header & Controls */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b select-none shrink-0"
            style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
          >
            <div className="flex items-center gap-1">
              {(
                [
                  { id: "opening", label: "Opening" },
                  { id: "macro", label: "Macro" },
                  { id: "quant", label: "Quant" },
                  { id: "breaking", label: "Breaking" },
                  { id: "closing", label: "Closing" },
                ] as const
              ).map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setActiveSegment(seg.id);
                  }}
                  className={`px-3 py-1 text-xs rounded uppercase font-bold transition-colors ${
                    activeSegment === seg.id
                      ? "bg-cyan-500 text-black"
                      : "text-slate-400 hover:text-white bg-white/5"
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSpeakScript}
                className={`px-3 py-1 rounded font-bold font-mono text-[11px] flex items-center gap-1.5 ${
                  isVoiceSpeaking
                    ? "bg-red-500/30 text-red-300 border border-red-500"
                    : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                }`}
              >
                {isVoiceSpeaking ? "⏹️ STOP AUDIO" : "🔊 TEST VOICE SYNTH"}
              </button>

              <button
                onClick={() => setIsPrompting(!isPrompting)}
                className={`px-2.5 py-1 rounded font-bold font-mono text-[11px] ${
                  isPrompting ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isPrompting ? "PAUSE" : "SCROLL"}
              </button>

              <div className="flex items-center gap-1 text-[var(--ag-muted)]">
                <span className="text-[10px]">Speed:</span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={teleprompterSpeed}
                  onChange={(e) => setTeleprompterSpeed(parseInt(e.target.value))}
                  className="w-14 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Teleprompter Text Display */}
          <div
            ref={prompterRef}
            className="flex-1 overflow-y-auto p-6 font-mono text-base leading-loose bg-black/60 text-emerald-300 select-text"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="max-w-2xl mx-auto whitespace-pre-line py-4">
              {currentScript}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Spectrum, Breaking Injector & YouTube Specs */}
        <div
          className="w-80 flex flex-col overflow-y-auto p-4 gap-4 shrink-0"
          style={{ background: "var(--ag-surface)" }}
        >
          {/* Audio Spectrum Visualizer */}
          <div>
            <div className="text-[10px] font-bold text-cyan-400 font-mono uppercase mb-1.5 flex justify-between">
              <span>Voice Spectrum Analysis</span>
              <span className="text-emerald-400 font-mono">48.0 kHz HD</span>
            </div>
            <AudioSpectrumVisualizer height={54} isPlaying={isVoiceSpeaking || isLiveBroadcasting} />
          </div>

          {/* Breaking News Injector Form */}
          <div className="p-3.5 rounded-xl border bg-black/40 space-y-2.5" style={{ borderColor: "var(--ag-border)" }}>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Broadcast Live Lower-Third Alert</span>
            </div>
            <form onSubmit={handleInjectBanner} className="space-y-2">
              <textarea
                rows={2}
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder="Type breaking military/financial news ticker for live stream..."
                className="w-full p-2 rounded-lg text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-red-500"
                style={{ borderColor: "var(--ag-border)" }}
              />
              <button
                type="submit"
                disabled={!customHeadline.trim()}
                className="w-full py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white uppercase tracking-wider transition-colors disabled:opacity-40"
              >
                PUSH TO ON-AIR SCREEN
              </button>
            </form>
          </div>

          {/* YouTube Streaming Broadcast Specs */}
          <div className="p-3.5 rounded-xl border bg-black/30 text-xs font-mono space-y-2" style={{ borderColor: "var(--ag-border)" }}>
            <div className="text-[10px] text-amber-300 font-bold uppercase">Broadcast Telemetry</div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stream Protocol:</span>
              <span className="text-white font-bold">RTMP / WebRTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Canvas:</span>
              <span className="text-cyan-300 font-bold">1080p60 (4K Ready)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Wall Mode:</span>
              <span className="text-emerald-400 font-bold">Starship + 3D Tactical</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Broadcast Status:</span>
              <span className={isLiveBroadcasting ? "text-red-400 font-bold" : "text-slate-500"}>
                {isLiveBroadcasting ? "🔴 ON-AIR ACTIVE" : "⚪ STANDBY"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Stream Settings Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-red-500/40 bg-slate-950 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <span>📺 YouTube Live RTMP Encoder Parameters</span>
              </h3>
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Server URL (RTMP Server):</label>
                <input
                  type="text"
                  readOnly
                  value="rtmp://a.rtmp.youtube.com/live2"
                  className="w-full p-2.5 rounded-lg bg-black/60 border border-white/20 font-mono text-cyan-300 select-all"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Stream Key:</label>
                <input
                  type="password"
                  value={youtubeStreamKey}
                  onChange={(e) => setYoutubeStreamKey(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-black/60 border border-white/20 font-mono text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-[11px] text-slate-300 leading-relaxed">
                Connect OBS or hardware encoder to stream 24/7 autonomous Nur Finans geopolitical market intelligence broadcasts to YouTube Live.
              </div>
            </div>

            <button
              onClick={() => {
                setShowYoutubeModal(false);
                addNotification({
                  title: "Stream Key Saved",
                  message: "Broadcast encoder parameters updated.",
                  severity: "SUCCESS",
                  category: "NUR_TV",
                });
              }}
              className="w-full py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white text-xs font-mono transition-colors"
            >
              SAVE PARAMETERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
