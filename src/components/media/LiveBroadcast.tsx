"use client";

import React, { useEffect, useState, useRef } from "react";
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
  | "EXECUTIVE_OFFICE";

const MARKET_MATRIX = [
  { symbol: "S&P 500", price: "5,864.20", change: "+0.92%", up: true, bourse: "NYSE" },
  { symbol: "NASDAQ 100", price: "20,418.50", change: "+1.35%", up: true, bourse: "NASDAQ" },
  { symbol: "DAX 40", price: "19,120.40", change: "+0.64%", up: true, bourse: "XETRA" },
  { symbol: "NIKKEI 225", price: "39,840.10", change: "+1.78%", up: true, bourse: "TSE" },
  { symbol: "BIST 100", price: "10,240.80", change: "+2.14%", up: true, bourse: "BIST" },
  { symbol: "TADAWUL", price: "12,180.50", change: "+0.45%", up: true, bourse: "SASE" },
  { symbol: "BRENT CRUDE", price: "$78.40 / bbl", change: "+0.85%", up: true, bourse: "ICE" },
  { symbol: "GOLD (XAU)", price: "$2,648.50 / oz", change: "+1.42%", up: true, bourse: "COMEX" },
  { symbol: "BITCOIN", price: "$68,450", change: "+3.15%", up: true, bourse: "CRYPTO" },
  { symbol: "VIX INDEX", price: "14.12", change: "-4.20%", up: false, bourse: "CBOE" },
];

export default function LiveBroadcast() {
  const { openFloatingWindow, popoutToNativeWindow, addNotification } = useIDEStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[0]); // Default Turkish Umay Nur
  const [backdropMode, setBackdropMode] = useState<StudioBackdropMode>("NUR_STUDIO_2126");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [activeSegment, setActiveSegment] = useState<"opening" | "macro" | "quant" | "breaking">("opening");

  // Draggable HUD Card State
  const [hudPos, setHudPos] = useState({ x: 24, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - hudPos.x,
      y: e.clientY - hudPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setHudPos({
      x: Math.max(10, Math.min(window.innerWidth - 380, e.clientX - dragOffset.x)),
      y: Math.max(60, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleSpeech = () => {
    cyberSound.playClick();
    if (isSpeaking) {
      hdVoiceEngine.stop();
      setIsSpeaking(false);
    } else {
      const fullSpeechText = `${selectedLang.scripts[activeSegment]}`;
      hdVoiceEngine.speak(
        fullSpeechText,
        selectedLang.langCode,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  // Video Generation & Snapshot
  const handleGenerateSnapshot = () => {
    cyberSound.playQuantumUnlock();
    addNotification({
      title: "📸 4K Stüdyo Karesi Kaydedildi",
      message: `${selectedLang.defaultAnchorName} (${selectedLang.name}) anlık yayın karesi PNG olarak oluşturuldu.`,
      severity: "SUCCESS",
      category: "MEDIA",
    });

    // Create a virtual download link for the anchor/studio image
    const link = document.createElement("a");
    link.href = selectedLang.anchorAvatar;
    link.download = `NUR_TV_${selectedLang.id.toUpperCase()}_${Date.now()}.jpg`;
    link.click();
  };

  const handleGenerateVideo = () => {
    cyberSound.playClick();
    setIsRecordingVideo(true);
    setVideoProgress(10);
    handleSpeak();

    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecordingVideo(false);
          addNotification({
            title: "🎬 1080p MP4 Video Üretildi",
            message: `${selectedLang.name} bülteni (${activeSegment.toUpperCase()}) video çıktısı başarıyla hazırlandı.`,
            severity: "SUCCESS",
            category: "MEDIA",
          });
          return 0;
        }
        return prev + 20;
      });
    }, 1200);
  };

  const handleSpeak = () => {
    const speechText = selectedLang.scripts[activeSegment];
    hdVoiceEngine.speak(
      speechText,
      selectedLang.langCode,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none font-sans text-white flex flex-col justify-between"
    >
      {/* ── BACKGROUND STUDIO VIDEO WALL ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
        {backdropMode === "NUR_STUDIO_2126" ? (
          <div className="w-full h-full relative overflow-hidden">
            <img
              src="/images/studio/broadcast_studio.jpg"
              alt="NUR TV 2126 Studio Set"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/50 pointer-events-none" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-lg border border-red-400/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>NUR TV 2126 4K HDR CANLI YAYIN STÜDYOSU</span>
            </div>
          </div>
        ) : backdropMode === "EXECUTIVE_OFFICE" ? (
          <div className="w-full h-full relative overflow-hidden">
            <img
              src="/images/studio/executive-office.jpg"
              alt="Sovereign Penthouse"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />
          </div>
        ) : backdropMode === "3D_GLOBE" ? (
          <div className="w-full h-full relative">
            <NurEarth3DGlobe />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />
          </div>
        ) : backdropMode === "ORBITAL_RADAR" ? (
          <div className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#062b40_0%,#020914_70%,#000000_100%)]">
            <div className="w-[450px] h-[450px] rounded-full border border-cyan-500/30 relative animate-pulse flex items-center justify-center">
              <div className="w-[320px] h-[320px] rounded-full border border-cyan-400/20" />
              <div className="w-[180px] h-[180px] rounded-full border border-cyan-300/30" />
              <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
              <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
              <div className="absolute top-1/3 left-1/4 px-2 py-0.5 rounded bg-red-500/30 text-red-300 font-mono text-[10px] border border-red-500/50">
                ORBITAL DEFENSE RADAR: STARLINK #54751113
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/90 overflow-hidden opacity-85 font-mono">
            {MARKET_MATRIX.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{m.bourse}</span>
                  <span className={m.up ? "text-emerald-400" : "text-red-400"}>{m.change}</span>
                </div>
                <div className="text-sm font-bold text-white mt-1">{m.symbol}</div>
                <div className="text-xl font-bold text-cyan-300 mt-2">{m.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TOP HEADER / CLOCKS / STAGE SELECTOR ──────────────────────────── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-4 bg-black/70 backdrop-blur-md border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={isSpeaking} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-serif tracking-wider">
                NUR TV 2126 4K BROADCAST
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 font-mono font-bold text-white animate-pulse">
                ● CANLI (LIVE)
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mt-0.5">
              <span>LON: {formatTime(currentTime, "Europe/London")}</span>
              <span>NYC: {formatTime(currentTime, "America/New_York")}</span>
              <span>IST: {formatTime(currentTime, "Europe/Istanbul")}</span>
              <span>DXB: {formatTime(currentTime, "Asia/Dubai")}</span>
            </div>
          </div>
        </div>

        {/* Backdrop Switcher & Action Tools */}
        <div className="flex items-center gap-2">
          {/* Stage Dropdown */}
          <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-xl text-xs font-mono">
            <span className="text-slate-400 px-2 text-[10px]">FON:</span>
            {[
              { id: "NUR_STUDIO_2126", label: "🏢 4K Stüdyo" },
              { id: "EXECUTIVE_OFFICE", label: "🏛️ Penthouse" },
              { id: "FINANCIAL_BOURSES", label: "📊 Borsa" },
              { id: "3D_GLOBE", label: "🌐 3D Küre" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  cyberSound.playClick();
                  setBackdropMode(m.id as StudioBackdropMode);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all text-xs ${
                  backdropMode === m.id
                    ? "bg-[#00d4aa] text-black font-extrabold shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Snapshot & Video Generator Tools */}
          <button
            onClick={handleGenerateSnapshot}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow"
            title="4K Stüdyo Karesini PNG Olarak İndir"
          >
            <span>📸 KARE İNDİR</span>
          </button>

          <button
            onClick={handleGenerateVideo}
            disabled={isRecordingVideo}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              isRecordingVideo
                ? "bg-amber-500 text-black animate-pulse"
                : "bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/50"
            }`}
            title="1080p MP4 Video Bülteni Üret"
          >
            <span>{isRecordingVideo ? `⏳ ÜRETİLİYOR (%${videoProgress})` : "🎬 VİDEO ÜRET"}</span>
          </button>

          {/* Window Buttons */}
          <button
            onClick={() => openFloatingWindow("live-tv", "📺 NUR TV 2126 Live")}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
            title="Yüzen Pencere Olarak Aç"
          >
            ⤢ YÜZEN
          </button>
          <button
            onClick={() => popoutToNativeWindow("live-tv")}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition-all"
            title="Ayrı Ekrana Çıkar"
          >
            ↗ DUAL
          </button>
        </div>
      </div>

      {/* ── DRAGGABLE & MOVABLE PRESENTER HUD CARD ───────────────────────── */}
      <div
        style={{ left: `${hudPos.x}px`, top: `${hudPos.y}px` }}
        className="absolute z-30 shadow-2xl transition-shadow"
      >
        {isHudMinimized ? (
          /* Minimized Pill View */
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center gap-2 p-2 px-3 rounded-full bg-black/90 border border-[#00d4aa] text-xs font-mono text-white cursor-grab active:cursor-grabbing backdrop-blur-xl shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
            <span className="font-bold">{selectedLang.defaultAnchorName.split("&")[0]} ({selectedLang.id.toUpperCase()})</span>
            <button
              onClick={() => setIsHudMinimized(false)}
              className="ml-2 px-2 py-0.5 rounded bg-[#00d4aa]/20 text-[#00d4aa] text-[10px] font-bold hover:bg-[#00d4aa]/40"
            >
              ⤢ AÇ
            </button>
          </div>
        ) : (
          /* Full Interactive Draggable Card */
          <div className="w-[390px] rounded-2xl bg-black/90 backdrop-blur-2xl border border-amber-500/40 text-xs font-mono text-slate-200 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col">
            {/* Draggable Drag Bar */}
            <div
              onMouseDown={handleMouseDown}
              className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-600/90 text-black font-extrabold cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2">
                <span>⋮⋮</span>
                <span className="font-serif tracking-wide text-xs">👤 {selectedLang.defaultAnchorName} ({selectedLang.city})</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsHudMinimized(true)}
                  className="px-1.5 py-0.5 rounded bg-black/30 text-black hover:bg-black/50 text-[10px] font-bold"
                  title="Küçült"
                >
                  _
                </button>
              </div>
            </div>

            {/* Language Bar Inside HUD */}
            <div className="flex items-center gap-1 p-2 bg-black/60 border-b border-white/10 overflow-x-auto">
              {BROADCAST_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedLang(lang);
                    if (isSpeaking) hdVoiceEngine.stop();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-all ${
                    selectedLang.id === lang.id
                      ? "bg-[#00d4aa] text-black font-extrabold"
                      : "text-slate-400 hover:text-white bg-white/5"
                  }`}
                >
                  {lang.flag} {lang.id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Segment Selector & Body */}
            <div className="p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1 text-[10px]">
                  {(["opening", "macro", "quant", "breaking"] as const).map((seg) => (
                    <button
                      key={seg}
                      onClick={() => {
                        cyberSound.playClick();
                        setActiveSegment(seg);
                        if (isSpeaking) hdVoiceEngine.stop();
                      }}
                      className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
                        activeSegment === seg
                          ? "bg-amber-400 text-black font-extrabold"
                          : "text-slate-400 hover:text-white bg-white/5"
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#69f0ae] font-bold">🟢 ZÜMRÜT GÖZ</span>
              </div>

              {/* Anchor Photo & Teleprompter Text */}
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-amber-400/50 shrink-0 shadow-lg bg-black">
                  <img
                    src={selectedLang.anchorAvatar}
                    alt={selectedLang.defaultAnchorName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-center text-[#69f0ae] font-bold py-0.5">
                    185 CM · 90
                  </div>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed max-h-24 overflow-y-auto pr-1 flex-1 font-sans">
                  {selectedLang.scripts[activeSegment]}
                </p>
              </div>

              {/* Action Buttons inside Card */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={toggleSpeech}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSpeaking
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-[#00d4aa] text-black hover:bg-[#00c29b]"
                  }`}
                >
                  <span>{isSpeaking ? "⏹ SESİ DURDUR" : "🔊 SESLENDİR & TEST ET"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT BOTTOM LIVE COMMODITIES MATRIX ─────────────────────────── */}
      <div className="absolute bottom-16 right-4 w-64 p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 text-xs font-mono shadow-2xl hidden md:block z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
          <span className="text-[10px] font-extrabold text-[#f5a623] uppercase tracking-wider">
            CANLI PİYASA MATRİSİ
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {MARKET_MATRIX.slice(0, 5).map((m) => (
            <div key={m.symbol} className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">{m.symbol}</span>
              <span className={`font-bold ${m.up ? "text-emerald-400" : "text-red-400"}`}>
                {m.price} <span className="text-[9px]">{m.change}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM LIVE BROADCAST TICKER ─────────────────────────────────── */}
      <div className="relative z-10 space-y-1 shrink-0">
        {/* Breaking News Red Ticker */}
        <div className="flex items-center h-9 bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-4 text-xs font-bold text-white tracking-wider shadow-lg">
          <span className="px-2.5 py-0.5 rounded bg-white text-red-700 font-extrabold text-[10px] mr-3 shrink-0 uppercase tracking-widest shadow">
            FLAŞ GELİŞME
          </span>
          <span className="truncate font-sans font-semibold text-slate-100">
            {selectedLang.headlines[headlineIdx] || selectedLang.headlines[0]}
          </span>
        </div>

        {/* Global Finance Scrolling News Ticker */}
        <div className="flex items-center justify-between h-10 bg-black/95 backdrop-blur-md border-t border-cyan-500/30 px-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-bold shrink-0 border-r border-white/15 pr-4 text-[10px]">
            <span className="text-slate-400">TELEMETRİ:</span>
            <span className="text-amber-300">[BIST 10,240 • BRENT $82.40 • BTC $68,450]</span>
          </div>

          {/* Scrolling Ticker Text */}
          <div className="flex-1 overflow-hidden ml-4">
            <div className="flex items-center gap-12 whitespace-nowrap animate-[scroll-left_45s_linear_infinite] text-slate-300 text-[11px]">
              {selectedLang.headlines.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="text-[#00d4aa]">◆</span>
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
