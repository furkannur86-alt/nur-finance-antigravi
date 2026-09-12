"use client";

import React, { useState } from "react";
import Image from "next/image";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { hdVoiceEngine } from "@/lib/broadcast/multilingual-broadcast";

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  location: string;
  age: number;
  heightCm: number;
  eyeColor: string;
  eyeHex: string;
  physique: string;
  wardrobe: string;
  voiceName: string;
  voiceSample: string;
  imagePath: string;
  bio: string;
}

const CHARACTERS: CharacterProfile[] = [
  {
    id: "elena_vance",
    name: "Elena Vance",
    role: "Senior Global Macro & Sovereign Wealth Strategist",
    location: "Genève Private Suite / Zurich",
    age: 30,
    heightCm: 185,
    eyeColor: "Luminous Emerald Green",
    eyeHex: "#00C853",
    physique: "Hourglass silhouette, elegant posture, captivating screen presence",
    wardrobe: "Emerald-green tailored designer blazer with subtle neckline & pencil skirt",
    voiceName: "Google Journey-F (Genève Institutional)",
    voiceSample: "Good morning. From the Geneva sovereign wealth desk, global central bank reserves and liquidity channels remain robust with continuous surveillance.",
    imagePath: "/images/characters/elena_vance.jpg",
    bio: "Chief strategist for sovereign institutional accounts. Manages macroeconomic allocation forecasts and cross-border currency reserves."
  },
  {
    id: "umay_nur",
    name: "Umay Nur",
    role: "Lead Anchor & Chief Financial Presenter",
    location: "Istanbul Bosphorus Desk / London",
    age: 29,
    heightCm: 185,
    eyeColor: "Luminous Emerald Green",
    eyeHex: "#00C853",
    physique: "Striking feminine curves, poised aristocratic features",
    wardrobe: "Tailored cream-white double-breasted blazer with tasteful decollete & mini skirt",
    voiceName: "Google Wavenet-B (TR-Istanbul Direct)",
    voiceSample: "İyi günler. Nur Finans Küresel Piyasa Masası'ndan canlı yayınımız başlıyor. BIST-100 ve küresel sermaye hareketlerini aktarıyoruz.",
    imagePath: "/images/characters/umay_nur.jpg",
    bio: "Head presenter for Turkish and Mediterranean financial coverage. Known for lightning-fast earnings breakdown and macroeconomic depth."
  },
  {
    id: "marcus_sterling",
    name: "Marcus Sterling",
    role: "Director of Quantitative Strategies & DePIN Compute",
    location: "Wall Street Hudson Yards / London",
    age: 28,
    heightCm: 193,
    eyeColor: "Luminous Emerald Green",
    eyeHex: "#00C853",
    physique: "Muscular athletic build, broad shoulders, chiseled sharp jawline",
    wardrobe: "Savile Row bespoke 3-piece navy suit with silk tie and smart cufflinks",
    voiceName: "Google Journey-D (Deep Authoritative Baritone)",
    voiceSample: "The quantitative arbitrage engine has confirmed high-frequency dark pool volume with institutional Kelly allocations locked.",
    imagePath: "/images/characters/marcus_sterling.jpg",
    bio: "Wall Street quantitative strategist overseeing high-frequency market-neutral algorithmic execution and distributed WebGPU mining clusters."
  }
];

export default function CharacterStudioGallery() {
  const [selectedChar, setSelectedChar] = useState<CharacterProfile>(CHARACTERS[0]);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handlePlayVoice = (char: CharacterProfile) => {
    cyberSound.playClick();
    if (isPlayingVoice) {
      hdVoiceEngine.stop();
      setIsPlayingVoice(false);
      return;
    }

    const langCode = char.id === "umay_nur" ? "tr-TR" : "en-US";
    hdVoiceEngine.speak(
      char.voiceSample,
      langCode,
      () => setIsPlayingVoice(true),
      () => setIsPlayingVoice(false),
      () => setIsPlayingVoice(false)
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#070b12] text-[#f0f4f8] overflow-y-auto p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00d4aa]/20 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <EagleCrest size={40} />
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#00d4aa] uppercase">
              Sovereign Production Roster
            </div>
            <h2 className="text-2xl font-bold tracking-wider text-white font-serif">
              CHARACTER & STUDIO ROSTER
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/characters_showcase.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#00d4aa]/10 border border-[#00d4aa] text-[#00d4aa] rounded-lg text-xs font-mono hover:bg-[#00d4aa]/20 transition-all flex items-center gap-2"
          >
            <span>🔗</span> Tam Ekran Vitrin (HTML)
          </a>
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {CHARACTERS.map((char) => {
          const isSelected = selectedChar.id === char.id;
          return (
            <div
              key={char.id}
              onClick={() => {
                cyberSound.playClick();
                setSelectedChar(char);
              }}
              className={`flex flex-col bg-[#0d1420]/90 rounded-2xl border transition-all cursor-pointer overflow-hidden backdrop-blur-md shadow-xl ${
                isSelected
                  ? "border-[#00d4aa] shadow-[0_0_25px_rgba(0,212,170,0.3)] scale-[1.01]"
                  : "border-white/10 hover:border-[#00d4aa]/50"
              }`}
            >
              {/* Image Banner */}
              <div className="relative w-full h-80 bg-black/40 overflow-hidden">
                <Image
                  src={char.imagePath}
                  alt={char.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-[#00d4aa]/40 text-[#00d4aa] text-[10px] font-mono px-2.5 py-1 rounded">
                  {char.location.split("/")[0]}
                </div>
                <div className="absolute bottom-3 left-3 bg-[#00C853]/20 backdrop-blur-md border border-[#00C853] text-[#69f0ae] text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00C853] shadow-[0_0_8px_#00C853]" />
                  {char.eyeColor}
                </div>
              </div>

              {/* Character Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold font-serif text-white">{char.name}</h3>
                    <span className="text-xs font-mono text-[#f5a623]">{char.heightCm} cm</span>
                  </div>
                  <div className="text-xs font-medium text-[#00d4aa] mb-4">{char.role}</div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/30 p-3 rounded-lg border border-white/5 mb-4">
                    <div>
                      <span className="text-[#8899a6] block text-[9px] uppercase tracking-wider">Yaş / Fizik</span>
                      <span className="text-white font-medium">{char.age} · {char.physique.split(",")[0]}</span>
                    </div>
                    <div>
                      <span className="text-[#8899a6] block text-[9px] uppercase tracking-wider">Kıyafet</span>
                      <span className="text-white font-medium line-clamp-1">{char.wardrobe.split("&")[0]}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#b0bec5] leading-relaxed mb-4">{char.bio}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice(char);
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                      isPlayingVoice && selectedChar.id === char.id
                        ? "bg-red-500/20 border border-red-500 text-red-400 animate-pulse"
                        : "bg-[#00d4aa]/15 border border-[#00d4aa]/60 text-[#00d4aa] hover:bg-[#00d4aa]/25"
                    }`}
                  >
                    <span>{isPlayingVoice && selectedChar.id === char.id ? "⏹ Durdur" : "🔊 HD Ses Örneğini Dinle"}</span>
                  </button>

                  <div className="text-[10px] font-mono text-[#607d8b] bg-black/50 p-2 rounded border border-white/5 truncate">
                    📁 {char.imagePath}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio & Headquarters Environments */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-lg">🏛️</span>
          <h3 className="text-lg font-bold font-serif text-[#f5a623] tracking-wide">
            YAYIN STÜDYOLARI & EGEMEN MERKEZLER
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d1420]/80 rounded-xl border border-white/10 overflow-hidden flex flex-col">
            <div className="relative w-full h-56 bg-black/40">
              <Image
                src="/images/studio/broadcast_studio.jpg"
                alt="NUR TV 2126 Studio"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-[#00d4aa]/40 text-[#00d4aa] text-[10px] font-mono px-2 py-0.5 rounded">
                MAIN STAGE 2126
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-white mb-1">NUR TV 2126 4K Ultra-Futuristik Stüdyo</h4>
              <p className="text-xs text-[#8899a6] mb-3">
                Kavisli devasa LED duvarlar, 3D Geopolitik Hologram Dünya, canlı mum grafik akışı ve çift başlı altın kartal arması.
              </p>
              <div className="text-[10px] font-mono text-[#00d4aa]/70 bg-black/40 p-2 rounded">
                public/images/studio/broadcast_studio.jpg
              </div>
            </div>
          </div>

          <div className="bg-[#0d1420]/80 rounded-xl border border-white/10 overflow-hidden flex flex-col">
            <div className="relative w-full h-56 bg-black/40">
              <Image
                src="/images/studio/executive-office.jpg"
                alt="Executive Boardroom"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-[#f5a623]/40 text-[#f5a623] text-[10px] font-mono px-2 py-0.5 rounded">
                SOVEREIGN PENTHOUSE
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-white mb-1">Sovereign Executive Penthouse Boardroom</h4>
              <p className="text-xs text-[#8899a6] mb-3">
                Cenevre ve Londra panoramik manzaralı siyah mermer toplantı masası, şeffaf likidite panelleri ve özel bankacılık süiti.
              </p>
              <div className="text-[10px] font-mono text-[#00d4aa]/70 bg-black/40 p-2 rounded">
                public/images/studio/executive-office.jpg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
