"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { channels, hosts, guests, shows, type NURChannel, type NURHost, type NURGuest, type NURShow } from "@/lib/data/broadcast";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import { BROADCAST_LANGUAGES, LanguageBroadcastProfile, hdVoiceEngine } from "@/lib/broadcast/multilingual-broadcast";
import { cyberSound } from "@/lib/audio/sound-synth";
import CharacterStudioGallery from "@/components/media/CharacterStudioGallery";

const NurEarth3DGlobe = dynamic(() => import("@/components/geopolitics/NurEarth3DGlobe"), { ssr: false });

type ActiveMediaTab = "characters" | "live-studio" | "channels" | "hosts-guests" | "schedule";
type StageBackdrop = "studio-2126" | "executive-office" | "market-matrix" | "3d-globe";

const MARKET_TICKER_ITEMS = [
  { s: "BIST 100", p: "10,240.80", c: "+2.14%", up: true },
  { s: "S&P 500", p: "5,864.20", c: "+0.92%", up: true },
  { s: "NASDAQ", p: "20,418.50", c: "+1.35%", up: true },
  { s: "DAX 40", p: "19,120.40", c: "+0.64%", up: true },
  { s: "BRENT", p: "$82.40", c: "+0.85%", up: true },
  { s: "GOLD", p: "$2,648.50", c: "+1.42%", up: true },
  { s: "BITCOIN", p: "$68,450", c: "+3.15%", up: true },
];

export default function MediaPanel() {
  const { openFloatingWindow, popoutToNativeWindow, setBreakingNewsTicker, addNotification } = useIDEStore();

  const [activeTab, setActiveTab] = useState<ActiveMediaTab>("characters");
  const [selectedLang, setSelectedLang] = useState<LanguageBroadcastProfile>(BROADCAST_LANGUAGES[0]); // Default Turkish Umay Nur
  const [selectedChannel, setSelectedChannel] = useState<NURChannel>(channels[2]); // Default Turkey
  const [stageBackdrop, setStageBackdrop] = useState<StageBackdrop>("studio-2126");
  const [activeSegment, setActiveSegment] = useState<"opening" | "macro" | "quant" | "breaking" | "closing">("opening");
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isLiveOnAir, setIsLiveOnAir] = useState(false);
  const [customHeadline, setCustomHeadline] = useState("");
  const [hostSearch, setHostSearch] = useState("");

  const handleSpeak = (text?: string) => {
    cyberSound.playClick();
    if (isVoiceSpeaking) {
      hdVoiceEngine.stop();
      setIsVoiceSpeaking(false);
      return;
    }
    const textToSpeak = text || selectedLang.scripts[activeSegment];
    hdVoiceEngine.speak(
      textToSpeak,
      selectedLang.langCode,
      () => setIsVoiceSpeaking(true),
      () => setIsVoiceSpeaking(false),
      () => setIsVoiceSpeaking(false)
    );
  };

  const handleToggleLive = () => {
    cyberSound.playClick();
    if (isLiveOnAir) {
      setIsLiveOnAir(false);
      hdVoiceEngine.stop();
      setIsVoiceSpeaking(false);
    } else {
      setIsLiveOnAir(true);
      handleSpeak();
      addNotification({
        title: "🔴 NUR TV Canlı Yayında (On-Air)",
        message: `${selectedLang.nativeName} Masası (${selectedLang.defaultAnchorName}) yayını başlattı.`,
        severity: "SUCCESS",
        category: "NUR_TV",
      });
    }
  };

  const handlePushBreaking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim()) return;
    const banner = `[${selectedLang.name.toUpperCase()} TV] SON DAKİKA: ${customHeadline.trim()}`;
    setBreakingNewsTicker(banner);
    addNotification({
      title: "Altyazı Güncellendi",
      message: `Bülten bandına eklendi: "${customHeadline}"`,
      severity: "INFO",
      category: "NUR_TV",
    });
    setCustomHeadline("");
  };

  const filteredHosts = hosts.filter(
    (h) =>
      h.displayName.toLowerCase().includes(hostSearch.toLowerCase()) ||
      h.nationality.toLowerCase().includes(hostSearch.toLowerCase()) ||
      h.specializations.some((s) => s.toLowerCase().includes(hostSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-[#070b12] text-[#f0f4f8] overflow-hidden font-sans select-none">
      {/* ── TOP NAVIGATION BAR ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-[#00d4aa]/20 bg-[#0c121d] shrink-0 gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={isLiveOnAir} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-serif text-white tracking-wide">
                NUR MEDIA & BROADCAST HUB
              </h1>
              {isLiveOnAir ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                  ● CANLI YAYIN (LIVE)
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                  HAZIR (STANDBY)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8899a6]">
              24/7 Çok Dilli Küresel Finans Televizyonu & Egemen Yapay Zeka Sunucuları
            </p>
          </div>
        </div>

        {/* Action & Window Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openFloatingWindow("media", "📡 NUR Media & TV Studio")}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-semibold border border-white/10 transition-all"
            title="Yüzen Pencere Olarak Aç"
          >
            ⤢ YÜZEN PENCERE
          </button>
          <button
            onClick={() => popoutToNativeWindow("media")}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-semibold border border-white/10 transition-all"
            title="Ayrı Ekrana Çıkar"
          >
            ↗ ÇİFT EKRAN
          </button>
          <button
            onClick={handleToggleLive}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 ${
              isLiveOnAir
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 animate-pulse"
                : "bg-gradient-to-r from-[#00d4aa] to-emerald-500 hover:from-[#00c29b] hover:to-emerald-400 text-black font-extrabold shadow-[0_0_15px_rgba(0,212,170,0.3)]"
            }`}
          >
            <span>{isLiveOnAir ? "⏹ YAYINI DURDUR" : "🔴 CANLI YAYINI BAŞLAT"}</span>
          </button>
        </div>
      </div>

      {/* ── SUB-HEADER TAB SWITCHER ───────────────────────────────── */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#090e17] border-b border-white/5 shrink-0 overflow-x-auto">
        {[
          { id: "characters", label: "🌟 Karakterler & Stüdyo Vitrini", badge: "3 Ana Karakter" },
          { id: "live-studio", label: "🎙️ Canlı Yayın & Seslendirme Testi", badge: "HD Studio" },
          { id: "channels", label: "🌍 15 Küresel TV Kanalı", badge: `${channels.length} Kanal` },
          { id: "hosts-guests", label: "👥 Sunucular & Konuklar", badge: `${hosts.length + guests.length} Kişi` },
          { id: "schedule", label: "📅 Yayın Akışı & Programlar", badge: `${shows.length} Program` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                cyberSound.playClick();
                setActiveTab(tab.id as ActiveMediaTab);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-[#00d4aa]/15 border border-[#00d4aa] text-[#00d4aa] font-semibold shadow-[0_0_10px_rgba(0,212,170,0.2)]"
                  : "bg-white/5 border border-white/5 text-[#8899a6] hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-[#00d4aa]/20 text-[#00d4aa]" : "bg-black/30 text-slate-400"}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT (SCROLLABLE & RESPONSIVE) ─────────────────── */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* 1. CHARACTERS & STUDIO GALLERY */}
        {activeTab === "characters" && <CharacterStudioGallery />}

        {/* 2. LIVE STUDIO & PROMPTER WORKSPACE */}
        {activeTab === "live-studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1500px] mx-auto">
            {/* Left: 16:9 Studio Monitor Viewport (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#0d1420] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Viewport Top Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8899a6]">STÜDYO FONU:</span>
                    <select
                      value={stageBackdrop}
                      onChange={(e) => setStageBackdrop(e.target.value as StageBackdrop)}
                      className="bg-black/80 border border-white/10 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-[#00d4aa]"
                    >
                      <option value="studio-2126">NUR TV 2126 Holografik Stüdyo Seti</option>
                      <option value="executive-office">Cenevre Sovereign Penthouse</option>
                      <option value="market-matrix">Küresel Borsa Likidite Matrisi</option>
                      <option value="3d-globe">3D Geopolitik Gezegen Modeli</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak()}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        isVoiceSpeaking
                          ? "bg-red-600 text-white animate-pulse"
                          : "bg-[#00d4aa]/20 border border-[#00d4aa]/60 text-[#00d4aa] hover:bg-[#00d4aa]/30"
                      }`}
                    >
                      <span>{isVoiceSpeaking ? "⏹ DURDUR" : "🔊 METNİ SESLENDİR"}</span>
                    </button>
                  </div>
                </div>

                {/* 16:9 Stage Area */}
                <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                  {stageBackdrop === "studio-2126" && (
                    <Image
                      src="/images/studio/broadcast_studio.jpg"
                      alt="NUR TV 2126 Studio"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  {stageBackdrop === "executive-office" && (
                    <Image
                      src="/images/studio/executive-office.jpg"
                      alt="Executive Office"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  {stageBackdrop === "market-matrix" && (
                    <div className="w-full h-full p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#0a0f18] overflow-y-auto">
                      {MARKET_TICKER_ITEMS.map((item, idx) => (
                        <div key={idx} className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col justify-between font-mono">
                          <span className="text-xs text-slate-400">{item.s}</span>
                          <span className="text-lg font-bold text-cyan-300 mt-1">{item.p}</span>
                          <span className="text-xs text-emerald-400 font-semibold mt-1">{item.c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {stageBackdrop === "3d-globe" && (
                    <div className="w-full h-full relative">
                      <NurEarth3DGlobe />
                    </div>
                  )}

                  {/* On-Screen Anchor Avatar Picture-in-Picture (Bottom Right) */}
                  <div className="absolute bottom-12 right-4 w-36 h-48 rounded-xl border-2 border-[#00d4aa] overflow-hidden shadow-2xl bg-black/80 backdrop-blur-md">
                    <Image
                      src={selectedLang.anchorAvatar}
                      alt={selectedLang.defaultAnchorName}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] text-center font-mono py-1 text-[#00d4aa] font-bold">
                      {selectedLang.defaultAnchorName.split("&")[0]}
                    </div>
                  </div>

                  {/* Live Lower-Third News Ticker */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/90 border-t border-[#00d4aa]/40 p-2.5 flex items-center gap-3 backdrop-blur-md z-10 font-mono">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold shrink-0 animate-pulse">
                      FLAŞ HABER
                    </span>
                    <div className="text-xs text-[#69f0ae] truncate font-medium">
                      {selectedLang.headlines[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower-Third Custom Headline Form */}
              <form onSubmit={handlePushBreaking} className="flex gap-2">
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder="Canlı yayın alt bandına anlık altyazı / haber metni gönder..."
                  className="flex-1 bg-[#0d1420] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00d4aa]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#00d4aa]/15 border border-[#00d4aa] text-[#00d4aa] rounded-xl text-xs font-mono font-bold hover:bg-[#00d4aa]/25 transition-all shrink-0"
                >
                  BANDA YANSIT
                </button>
              </form>
            </div>

            {/* Right: Teleprompter, Script & Language Control (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Language Selector */}
              <div className="bg-[#0d1420] border border-white/10 rounded-2xl p-4 shadow-xl">
                <div className="text-xs font-mono font-bold text-[#00d4aa] mb-2.5 uppercase tracking-wider">
                  Yayın Dili ve Masası Seçimi
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BROADCAST_LANGUAGES.map((lang) => {
                    const isSelected = selectedLang.id === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          cyberSound.playClick();
                          setSelectedLang(lang);
                          if (isVoiceSpeaking) hdVoiceEngine.stop();
                        }}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-[#00d4aa]/20 border-[#00d4aa] text-white font-bold shadow-[0_0_12px_rgba(0,212,170,0.2)]"
                            : "bg-black/30 border-white/5 text-[#8899a6] hover:text-white hover:bg-black/50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sm">
                          <span>{lang.flag}</span>
                          <span className="text-xs truncate">{lang.nativeName}</span>
                        </div>
                        <div className="text-[9px] text-[#8899a6] truncate mt-0.5">{lang.defaultAnchorName.split("&")[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Segment Selector & Teleprompter Text */}
              <div className="bg-[#0d1420] border border-white/10 rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-mono font-bold text-[#f5a623] uppercase tracking-wider">
                      Teleprompter Metni ({activeSegment.toUpperCase()})
                    </div>
                    <div className="flex gap-1">
                      {(["opening", "macro", "quant", "breaking", "closing"] as const).map((seg) => (
                        <button
                          key={seg}
                          onClick={() => {
                            cyberSound.playClick();
                            setActiveSegment(seg);
                            if (isVoiceSpeaking) hdVoiceEngine.stop();
                          }}
                          className={`text-[10px] font-mono px-2 py-1 rounded transition-all ${
                            activeSegment === seg
                              ? "bg-[#f5a623] text-black font-bold"
                              : "bg-black/40 text-slate-400 hover:text-white"
                          }`}
                        >
                          {seg.slice(0, 4).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-sm leading-relaxed text-slate-200 font-sans min-h-[160px] max-h-[260px] overflow-y-auto">
                    {selectedLang.scripts[activeSegment]}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#8899a6]">
                    Spiker: <span className="text-white font-semibold">{selectedLang.defaultAnchorName}</span> ({selectedLang.city})
                  </div>
                  <button
                    onClick={() => handleSpeak()}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                      isVoiceSpeaking
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-[#00d4aa] text-black hover:bg-[#00c29b]"
                    }`}
                  >
                    <span>{isVoiceSpeaking ? "⏹ Durdur" : "▶ Dinle & Test Et"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CHANNELS LIST & DETAILS */}
        {activeTab === "channels" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1500px] mx-auto">
            {/* Channel List (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0d1420] border border-white/10 rounded-2xl p-4 shadow-xl max-h-[700px] overflow-y-auto space-y-2">
              <div className="text-xs font-mono font-bold text-[#00d4aa] uppercase tracking-wider mb-3">
                15 Küresel TV Ağı Kanalı
              </div>
              {channels.map((chan) => {
                const isSelected = selectedChannel.id === chan.id;
                return (
                  <div
                    key={chan.id}
                    onClick={() => {
                      cyberSound.playClick();
                      setSelectedChannel(chan);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#00d4aa]/15 border-[#00d4aa] text-white shadow-md"
                        : "bg-black/30 border-white/5 text-[#8899a6] hover:bg-black/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{chan.flag}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{chan.nameLocal}</div>
                        <div className="text-[11px] text-[#8899a6]">{chan.city} · {chan.language}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      {chan.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Channel Info & Programs (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0d1420] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedChannel.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white font-serif">{selectedChannel.name}</h3>
                      <div className="text-xs text-[#00d4aa] font-mono">{selectedChannel.studioName} ({selectedChannel.timezone})</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSpeak(`This is NUR Finance ${selectedChannel.nameLocal} live from ${selectedChannel.city}.`)}
                    className="px-3 py-1.5 bg-[#00d4aa]/15 border border-[#00d4aa] text-[#00d4aa] rounded-lg text-xs font-mono font-bold hover:bg-[#00d4aa]/25 transition-all"
                  >
                    🔊 Kanal Tanıtımını Dinle
                  </button>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-5">{selectedChannel.description}</p>

                <div className="text-xs font-mono font-bold text-[#f5a623] uppercase tracking-wider mb-3">
                  Kanalın Programları & Yayın Akışı
                </div>
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
                  {shows
                    .filter((s) => s.channelId === selectedChannel.id)
                    .map((s) => (
                      <div key={s.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{s.nameLocal}</span>
                          <span className="text-[10px] font-mono text-[#00d4aa]">{s.schedule.startUTC}–{s.schedule.endUTC} UTC</span>
                        </div>
                        <p className="text-xs text-slate-400">{s.description}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-5 text-[11px] font-mono text-[#8899a6] flex items-center justify-between">
                <span>YouTube: {selectedChannel.youtubeHandle}</span>
                <span>Konular: {selectedChannel.topics.join(" · ")}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. HOSTS & GUESTS DIRECTORY */}
        {activeTab === "hosts-guests" && (
          <div className="max-w-[1500px] mx-auto space-y-5">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={hostSearch}
                onChange={(e) => setHostSearch(e.target.value)}
                placeholder="Sunucu, ülke, uzmanlık veya dil ara..."
                className="w-full max-w-md bg-[#0d1420] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00d4aa]"
              />
              <div className="text-xs font-mono text-[#8899a6]">
                Toplam {filteredHosts.length} Sunucu
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHosts.map((h) => (
                <div key={h.id} className="bg-[#0d1420] border border-white/10 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{h.displayName} {h.lastName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00C853]/20 border border-[#00C853] text-[#69f0ae]">
                        Zümrüt Yeşil
                      </span>
                    </div>
                    <div className="text-xs text-[#00d4aa] mb-2">{h.nationality} · {h.heightCm} cm · {h.ageRange} Yaş</div>
                    <p className="text-xs text-slate-300 line-clamp-3 mb-3">{h.bio}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                    Diller: {h.languages.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SCHEDULE TIMETABLE */}
        {activeTab === "schedule" && (
          <div className="max-w-[1500px] mx-auto bg-[#0d1420] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif mb-4">Küresel 24/7 Yayın Programı</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shows.slice(0, 10).map((show) => (
                <div key={show.id} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{show.nameLocal}</span>
                    <span className="text-xs font-mono text-[#f5a623]">{show.schedule.startUTC}–{show.schedule.endUTC} UTC</span>
                  </div>
                  <div className="text-xs text-[#00d4aa] mb-2">{show.format.toUpperCase()} · {show.schedule.days.join(", ")}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{show.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
