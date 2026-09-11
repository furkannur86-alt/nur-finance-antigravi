"use client";

import { useEffect, useState, useRef } from "react";
import {
  BROADCAST_LANGUAGES,
  LanguageBroadcastProfile,
  hdVoiceEngine,
} from "@/lib/broadcast/multilingual-broadcast";
import { cyberSound } from "@/lib/audio/sound-synth";

// High quality financial video streams
const LIVE_CHANNELS = [
  {
    id: "bloomberg",
    name: "Bloomberg TV Live",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    fallbackPoster: "/images/studio/anchor-female.jpg",
    category: "GLOBAL MACRO",
    badge: "LIVE 4K",
  },
  {
    id: "cnbc",
    name: "CNBC Finance Terminal",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    fallbackPoster: "/images/studio/anchor-male.jpg",
    category: "QUANT & EQUITIES",
    badge: "LIVE HD",
  },
  {
    id: "nur_global",
    name: "NUR TV Executive Studio",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    fallbackPoster: "/images/studio/executive-office.jpg",
    category: "SOVEREIGN VAULT",
    badge: "EXCLUSIVE STREAM",
  },
];

const MARKET_DATA = [
  { symbol: "BIST 100", price: "9,840.50", change: "+1.42%", up: true },
  { symbol: "S&P 500", price: "5,742.80", change: "+0.85%", up: true },
  { symbol: "NASDAQ", price: "18,120.30", change: "+1.15%", up: true },
  { symbol: "DAX 40", price: "18,890.10", change: "+0.52%", up: true },
  { symbol: "Brent Crude", price: "$82.40", change: "+0.58%", up: true },
  { symbol: "Gold / Oz", price: "$2,418.50", change: "+1.22%", up: true },
  { symbol: "Bitcoin", price: "$67,420", change: "+2.84%", up: true },
  { symbol: "VIX Fear", price: "14.20", change: "-3.40%", up: false },
];

export default function LiveBroadcast() {
  const [currentTime, setCurrentTime] = useState<Date | null>(() => new Date());
  const [selectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[0]);
  const [selectedChannel, setSelectedChannel] = useState(LIVE_CHANNELS[0]);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % selectedLang.headlines.length);
    }, 7000);
    return () => clearInterval(cycleTimer);
  }, [selectedLang.headlines.length]);

  const togglePlay = () => {
    cyberSound.playClick();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    cyberSound.playClick();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeech = () => {
    cyberSound.playClick();
    if (isSpeaking) {
      hdVoiceEngine.stop();
      setIsSpeaking(false);
    } else {
      const fullSpeechText = `${selectedLang.scripts.opening} ${selectedLang.scripts.macro} ${selectedLang.scripts.quant}`;
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
    <div className="relative w-full h-full bg-black overflow-hidden select-none font-sans text-white flex flex-col justify-between group">
      {/* Real Live Video Feed */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={selectedChannel.videoUrl}
          poster={selectedChannel.fallbackPoster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        {/* Cinematic TV Studio Vignette & Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </div>

      {/* Top Header Bar - Broadcast Control Room */}
      <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Logo & Channel Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 font-serif">
              NUR TV
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              ULTRA HD STREAM
            </span>
          </div>

          {/* LIVE Pulsing Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE BROADCAST</span>
          </div>

          {/* Channel Selector */}
          <button
            onClick={() => setShowChannelPicker(!showChannelPicker)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-2"
          >
            <span className="text-amber-400">📺 {selectedChannel.name}</span>
            <span className="text-slate-400">▾</span>
          </button>
        </div>

        {/* Clocks & Voice Commentary */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 ${
              isSpeaking
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-red-600/50"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black"
            }`}
          >
            {isSpeaking ? (
              <>
                <span>⏹️ STOP VOICE ANCHOR</span>
              </>
            ) : (
              <>
                <span>🎙️ AI ANCHOR VOICE ({selectedLang.flag})</span>
              </>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-4 text-slate-300 bg-black/50 px-3 py-1 rounded-lg border border-white/10">
            <span>IST: <strong className="text-amber-400">{formatTime(currentTime, "Europe/Istanbul")}</strong></span>
            <span>LON: <strong className="text-cyan-400">{formatTime(currentTime, "Europe/London")}</strong></span>
            <span>NYC: <strong className="text-emerald-400">{formatTime(currentTime, "America/New_York")}</strong></span>
          </div>
        </div>
      </div>

      {/* Channel Picker Dropdown */}
      {showChannelPicker && (
        <div className="absolute top-16 left-4 z-50 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl space-y-2 w-80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">GLOBAL FINANCE BROADCAST CHANNELS</div>
          {LIVE_CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                cyberSound.playClick();
                setSelectedChannel(ch);
                setShowChannelPicker(false);
              }}
              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                selectedChannel.id === ch.id
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/50 text-white font-bold"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent"
              }`}
            >
              <div>
                <div className="font-bold">{ch.name}</div>
                <div className="text-[10px] text-slate-400">{ch.category}</div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                {ch.badge}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Center Studio Overlay Information */}
      <div className="relative z-10 flex-1 flex items-end justify-between p-6 pointer-events-none">
        {/* Left Side: Active Anchor Card */}
        <div className="space-y-2 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-extrabold text-sm uppercase tracking-wide shadow-lg">
            {selectedLang.defaultAnchorName}
          </div>
          <div className="p-4 rounded-b-2xl rounded-r-2xl bg-black/85 backdrop-blur-xl border border-amber-500/30 text-xs font-mono text-slate-200 max-w-md space-y-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-amber-300 font-bold tracking-wider">GLOBAL MACRO & QUANT DESK</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{selectedLang.city}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedLang.headlines[headlineIdx]}
            </p>
            {isSpeaking && (
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold animate-pulse pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>LIVE ACOUSTIC VOICE SYNTHESIZER ACTIVE...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Market Depth Board */}
        <div className="w-64 p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-xs font-mono space-y-3 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">LIVE MARKET METRICS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="space-y-2">
            {MARKET_DATA.map((m) => (
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

      {/* Bottom Live Broadcast Ticker & Video Control Bar */}
      <div className="relative z-10 space-y-1">
        {/* Breaking News Red Ticker */}
        <div className="flex items-center h-9 bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-4 text-xs font-bold text-white tracking-wider shadow-lg">
          <span className="px-2.5 py-0.5 rounded bg-white text-red-700 font-extrabold text-[10px] mr-3 shrink-0 uppercase tracking-widest shadow">
            BREAKING
          </span>
          <span className="truncate font-sans font-semibold text-slate-100">
            {selectedLang.headlines[headlineIdx] || selectedLang.headlines[0]}
          </span>
        </div>

        {/* Global Finance Scrolling News Ticker & Player Controls */}
        <div className="flex items-center justify-between h-10 bg-black/95 backdrop-blur-md border-t border-cyan-500/30 px-4 text-xs font-mono">
          {/* Video Player Buttons (Play/Pause, Sound) */}
          <div className="flex items-center gap-3 shrink-0 border-r border-white/15 pr-4">
            <button
              onClick={togglePlay}
              className="hover:text-amber-400 transition-colors text-sm"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <button
              onClick={toggleMute}
              className="hover:text-amber-400 transition-colors text-sm"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇 MUTED" : "🔊 SOUND ON"}
            </button>
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
