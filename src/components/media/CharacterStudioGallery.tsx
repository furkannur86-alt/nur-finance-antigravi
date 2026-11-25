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
  bustSize: string;
  eyeColor: string;
  eyeHex: string;
  physique: string;
  wardrobe: string;
  decolletePolicy: string;
  watchModel: string;
  voiceName: string;
  voiceSample: string;
  imagePath: string;
  bio: string;
}

const CHARACTERS: CharacterProfile[] = [
  {
    id: "boss_nur",
    name: "Boss Nur (The Boss)",
    role: "Channel Empire Owner & Founding Patriarch",
    location: "Global / All Studios",
    age: 61,
    heightCm: 163,
    bustSize: "Portly Build · Jolly Hedonist",
    eyeColor: "Sparkling Emerald Green",
    eyeHex: "#00C853",
    physique: "1.63 m · Lovable portly belly, fatherly demeanor, smiling face, hearty laugh",
    wardrobe: "Luxury Italian cashmere cardigan, open-collar white silk shirt or velvet jacket",
    decolletePolicy: "Patriarch Comfort (No Tie & Open Collar)",
    watchModel: "Solid Yellow Gold Patek Philippe Grandmaster Chime",
    voiceName: "Microsoft AhmetNeural (Fatherly & Jovial)",
    voiceSample: "Hahahahaha! Son, what are you talking about with all this quant stuff, I don't understand any of it! My mind wanders elsewhere! Bring me some pistachio baklava!",
    imagePath: "/images/characters/boss_nur.jpg",
    bio: "The true owner of the channel empire. He provided the capital, his sons built it. He crashes live broadcasts, eats food, and roars with laughter. Everyone shows him boundless respect. His greatest weakness: he is incredibly afraid of his wife, whose name is kept secret!"
  },
  {
    id: "elena_vance",
    name: "Elena Vance",
    role: "Senior Global Macro & Sovereign Wealth Strategist",
    location: "Genève Private Suite / Zurich",
    age: 30,
    heightCm: 185,
    bustSize: "90D (Feminine Hourglass)",
    eyeColor: "Sparkling Emerald Green",
    eyeHex: "#00C853",
    physique: "185 cm · Prominent feminine curves · Attractive on-screen presence",
    wardrobe: "Milan-designed emerald green luxury double-breasted blazer and pencil skirt",
    decolletePolicy: "Elegant & within broadcast standards aesthetic neckline",
    watchModel: "Swiss Haute Horlogerie Rose Gold Royal Chronograph",
    voiceName: "Google Journey-F (Genève Institutional)",
    voiceSample: "Good morning. From the Geneva sovereign wealth desk, global central bank reserves and liquidity channels remain robust with continuous surveillance.",
    imagePath: "/images/characters/elena_vance.jpg",
    bio: "Presents global macroeconomic decisions, interest rate policies and central bank reserves from a private banking suite overlooking Lake Geneva and the Alps. Reflects wealth with elegant broadcast attire and luxury Swiss timepiece."
  },
  {
    id: "umay_nur",
    name: "Umay Nur",
    role: "Chief Economist & Live Broadcast Desk Lead",
    location: "Istanbul Bosphorus Desk / London",
    age: 29,
    heightCm: 185,
    bustSize: "90 (Elegant & Noble)",
    eyeColor: "Sparkling Emerald Green",
    eyeHex: "#00C853",
    physique: "185 cm · Noble, dignified, extremely serious aristocratic finance leader",
    wardrobe: "High-Neck cream-white luxury double-breasted suit",
    decolletePolicy: "ZERO NECKLINE · ZERO MINI SKIRT (Fully Covered & Formal)",
    watchModel: "Classic Swiss Yellow Gold Nautilus Perpetual Calendar",
    voiceName: "Google Wavenet-B (TR-Istanbul)",
    voiceSample: "Good day. Our live broadcast from the NUR Finance Global Markets Desk is now starting. We are reporting on global capital movements and market indices.",
    imagePath: "/images/characters/umay_nur.jpg",
    bio: "The channel's most respected and authoritative leader. Displays full gravitas and institutional weight in her high-neck noble cream-white suit. Never wears revealing necklines or mini skirts; her elegance lies in her nobility."
  },
  {
    id: "marcus_sterling",
    name: "Marcus Sterling",
    role: "Director of Quantitative Strategies & DePIN Compute",
    location: "Wall Street Hudson Yards / London",
    age: 28,
    heightCm: 193,
    bustSize: "Broad Shoulders / Athletic Chest",
    eyeColor: "Sparkling Emerald Green",
    eyeHex: "#00C853",
    physique: "193 cm · Muscular athletic build, broad shoulders, sharp jawline",
    wardrobe: "Savile Row bespoke 3-piece navy suit and silk tie",
    decolletePolicy: "Masculine Power & Athletic Stance",
    watchModel: "Skeleton Titanium Tourbillon Chronograph",
    voiceName: "Google Journey-D (Deep Authoritative Baritone)",
    voiceSample: "The quantitative arbitrage engine has confirmed high-frequency dark pool volume with institutional Kelly allocations locked.",
    imagePath: "/images/characters/marcus_sterling.jpg",
    bio: "Manages high-frequency quantitative algorithms, Black-Scholes option surfaces and DePIN hardware hashrate telemetry across Wall Street and London financial centers."
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
      <div className="flex flex-wrap items-center justify-between border-b border-[#00d4aa]/20 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <EagleCrest size={40} />
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#00d4aa] uppercase">
              Sovereign Production Roster & Luxury Styling
            </div>
            <h2 className="text-2xl font-bold tracking-wider text-white font-serif">
              SOVEREIGN CHARACTER & LUXURY DIRECTORY
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/characters_showcase.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#00d4aa]/10 border border-[#00d4aa] text-[#00d4aa] rounded-lg text-xs font-mono hover:bg-[#00d4aa]/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,170,0.15)]"
          >
            <span>🔗</span> Full Screen Showcase (HTML)
          </a>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-[#00C853]/10 border border-[#00C853]/30 rounded-xl text-xs font-mono text-[#b9f6ca] mb-6">
        <div className="flex items-center gap-2">
          <span>👁️</span> <strong>Eyes:</strong> 100% Emerald Green (#00C853)
        </div>
        <div className="flex items-center gap-2">
          <span>⌚</span> <strong>Watches:</strong> Swiss Haute Horlogerie
        </div>
        <div className="flex items-center gap-2">
          <span>👗</span> <strong>Umay Nur:</strong> ZERO Neckline · Most Formal Stance
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
                  <div className="text-xs font-medium text-[#00d4aa] mb-3">{char.role}</div>

                  <div className="space-y-2 bg-black/30 p-3 rounded-xl border border-white/5 text-[11px] mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#8899a6]">Physique & Build:</span>
                      <span className="text-white font-medium">{char.bustSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8899a6]">Dress Code Policy:</span>
                      <span className={`font-semibold ${char.id === "umay_nur" ? "text-amber-400" : "text-[#69f0ae]"}`}>
                        {char.decolletePolicy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8899a6]">Luxury Timepiece:</span>
                      <span className="text-[#ffd54f] font-mono line-clamp-1">{char.watchModel}</span>
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
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                      isPlayingVoice && selectedChar.id === char.id
                        ? "bg-red-600/20 border border-red-500 text-red-400 animate-pulse"
                        : "bg-[#00d4aa]/15 border border-[#00d4aa]/60 text-[#00d4aa] hover:bg-[#00d4aa]/25"
                    }`}
                  >
                    <span>{isPlayingVoice && selectedChar.id === char.id ? "⏹ Stop" : "🔊 Listen to HD Voice Sample"}</span>
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
            BROADCAST STUDIOS & SOVEREIGN HEADQUARTERS
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
              <h4 className="text-sm font-bold text-white mb-1">NUR TV 2126 4K Ultra-Futuristic Studio</h4>
              <p className="text-xs text-[#8899a6] mb-3">
                Curved massive LED walls, 3D Geopolitical Hologram Globe, live candlestick chart feed and double-headed golden eagle crest.
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
                Black marble conference table with panoramic Geneva and London views, transparent liquidity panels and private banking suite.
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
