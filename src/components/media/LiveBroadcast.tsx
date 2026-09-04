"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BROADCAST_LANGUAGES,
  LanguageBroadcastProfile,
  hdVoiceEngine,
} from "@/lib/broadcast/multilingual-broadcast";
import { cyberSound } from "@/lib/audio/sound-synth";

const STUDIO_SCENES = [
  { id: "female", label: "Stüdyo A (Kadın Spiker)", image: "/images/studio/anchor-female.jpg" },
  { id: "male", label: "Stüdyo B (Erkek Analist)", image: "/images/studio/anchor-male.jpg" },
  { id: "office", label: "Yönetici Masası (Gökdelen)", image: "/images/studio/executive-office.jpg" },
];

const MARKET_DATA = [
  { symbol: "BIST 100", price: "9,840.50", change: "+1.42%", up: true },
  { symbol: "S&P 500", price: "5,742.80", change: "+0.85%", up: true },
  { symbol: "NASDAQ", price: "18,120.30", change: "+1.15%", up: true },
  { symbol: "DAX 40", price: "18,890.10", change: "+0.52%", up: true },
  { symbol: "Brent Petrol", price: "$82.40", change: "+0.58%", up: true },
  { symbol: "Altın / Ons", price: "$2,418.50", change: "+1.22%", up: true },
  { symbol: "Bitcoin", price: "$67,420", change: "+2.84%", up: true },
  { symbol: "VIX Korku", price: "14.20", change: "-3.40%", up: false },
];

export default function LiveBroadcast() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLang, setSelectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[0]);
  const [selectedScene, setSelectedScene] = useState(STUDIO_SCENES[0]);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);

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

  const formatTime = (d: Date, tz: string) => {
    try {
      return d.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none font-sans text-white flex flex-col justify-between">
      {/* Background Image of Real Anchor & Luxury Office */}
      <div className="absolute inset-0 z-0">
        <Image
          src={selectedScene.image}
          alt={selectedScene.label}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-amber-300 font-serif">
              NUR TV
            </span>
            <span className="text-xs text-slate-300 font-mono">GLOBAL LIVE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>● CANLI YAYIN</span>
          </div>

          {/* Language Selector Dropdown Trigger */}
          <button
            onClick={() => setShowChannelPicker(!showChannelPicker)}
            className="px-3 py-1 rounded-lg bg-black/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
          >
            <span>{selectedLang.flag} {selectedLang.nativeName} ({selectedLang.city})</span>
            <span>▾</span>
          </button>

          {/* Camera Studio Angle Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
            {STUDIO_SCENES.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  cyberSound.playClick();
                  setSelectedScene(sc);
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedScene.id === sc.id
                    ? "bg-amber-500 text-black font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clocks & Voice Audio Trigger */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1 rounded-lg font-bold transition-all shadow-lg flex items-center gap-1.5 ${
              isSpeaking
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-400 text-black"
            }`}
          >
            {isSpeaking ? (
              <>
                <span>⏹️ SPİKERİ SUSTUR</span>
              </>
            ) : (
              <>
                <span>🔊 SPİKERİ SESLİ DİNLE ({selectedLang.flag})</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3 text-slate-300">
            <span>İST: {formatTime(currentTime, "Europe/Istanbul")}</span>
            <span>LON: {formatTime(currentTime, "Europe/London")}</span>
            <span>NYC: {formatTime(currentTime, "America/New_York")}</span>
          </div>
        </div>
      </div>

      {/* Language Picker Modal Popup */}
      {showChannelPicker && (
        <div className="absolute top-16 left-4 z-40 p-3 rounded-xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg">
          {BROADCAST_LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                cyberSound.playClick();
                setSelectedLang(l);
                setShowChannelPicker(false);
                if (isSpeaking) hdVoiceEngine.stop();
              }}
              className={`p-2 rounded-lg text-left text-xs font-mono transition-all flex items-center gap-2 ${
                selectedLang.id === l.id
                  ? "bg-cyan-500/30 border border-cyan-400 text-white font-bold"
                  : "bg-black/40 hover:bg-white/10 text-slate-300 border border-transparent"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <div>
                <div>{l.nativeName}</div>
                <div className="text-[9px] text-slate-500">{l.city}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Studio View Center Overlay */}
      <div className="relative z-10 flex-1 flex items-center justify-between p-6 pointer-events-none">
        {/* Left Side: Host Details */}
        <div className="space-y-2 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-lg bg-amber-500 text-black font-serif font-bold text-sm uppercase tracking-wide">
            {selectedLang.defaultAnchorName}
          </div>
          <div className="p-3 rounded-b-lg rounded-r-lg bg-black/80 backdrop-blur border border-amber-500/40 text-xs font-mono text-slate-200 max-w-sm space-y-1">
            <div className="text-amber-300 font-bold">NUR FİNANS KÜRESEL ANALİZ MASASI</div>
            <div className="text-[11px] text-slate-400">
              Yapay Zeka Destekli 7/24 Gerçek Zamanlı Kantitatif Bülten &bull; {selectedLang.city}
            </div>
            {isSpeaking && (
              <div className="text-emerald-400 text-[10px] font-bold animate-pulse">
                ● DOĞAL DİL SPİKER SESİ AKTİF...
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Market Depth Sidebar */}
        <div className="w-56 p-3 rounded-xl bg-black/70 backdrop-blur border border-white/10 text-xs font-mono space-y-2 pointer-events-auto">
          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest border-b border-white/10 pb-1">
            CANLI PİYASA TAHTASI
          </div>
          <div className="space-y-1.5">
            {MARKET_DATA.map((m) => (
              <div key={m.symbol} className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300">{m.symbol}</span>
                <span className={m.up ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {m.price} {m.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom News Ticker & Live Breaking Banner */}
      <div className="relative z-10 space-y-1">
        {/* Breaking Banner */}
        <div className="flex items-center h-8 bg-red-600 px-4 text-xs font-bold text-white tracking-wider">
          <span className="px-2 py-0.5 rounded bg-white text-red-600 text-[10px] mr-3 shrink-0 uppercase">
            SON DAKİKA
          </span>
          <span className="truncate font-sans font-semibold">
            {selectedLang.headlines[headlineIdx] || selectedLang.headlines[0]}
          </span>
        </div>

        {/* Scrolling Global Ticker */}
        <div className="flex items-center h-8 bg-black/90 border-t border-cyan-500/20 px-3 text-xs font-mono overflow-hidden">
          <div className="flex items-center gap-8 whitespace-nowrap animate-[scroll-left_45s_linear_infinite] text-slate-300">
            {selectedLang.headlines.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="text-cyan-400">◆</span>
                <span>{h}</span>
              </span>
            ))}
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
