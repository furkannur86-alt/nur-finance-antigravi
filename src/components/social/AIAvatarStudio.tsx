"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { hdVoiceEngine } from "@/lib/broadcast/multilingual-broadcast";
import { getStoredSovereignWallet } from "@/lib/crypto/sovereignWallet";

export interface AvatarProfile {
  id: string;
  name: string;
  gender: "FEMALE" | "MALE";
  title: string;
  institution: string;
  description: string;
  defaultGreeting: string;
  voiceLang: string;
  accentColor: string;
}

const AVATAR_PROFILES: AvatarProfile[] = [
  {
    id: "elena",
    name: "Elena Vance",
    gender: "FEMALE",
    title: "Executive Sovereign Private Banker & AI Strategist",
    institution: "Nur Sovereign Capital & Private Wealth",
    description: "Specialized in high-net-worth liquidity, algorithmic macro hedging, and multi-industry clinical venture syndicates.",
    defaultGreeting: "Good day. I am Elena Vance. Your sovereign compute yields and private capital allocations are actively protected under cryptographic custody. How may I structure your portfolio today?",
    voiceLang: "en-US",
    accentColor: "#00d4aa",
  },
  {
    id: "marcus",
    name: "Marcus Sterling",
    gender: "MALE",
    title: "Chief Quantitative Director & Institutional Concierge",
    institution: "Sovereign Risk Engineering & DePIN Cluster",
    description: "Specialized in real-time volatility dispersion, high-frequency order book dynamics, and distributed GPU cluster scaling.",
    defaultGreeting: "Welcome to the sovereign floor. I am Marcus Sterling. All matrix GEMM compute nodes and institutional execution pipes are operating at peak efficiency.",
    voiceLang: "en-US",
    accentColor: "#a855f7",
  },
];

export default function AIAvatarStudio() {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("elena");
  const [mood, setMood] = useState<"EXECUTIVE" | "ALPHA_HUNTER" | "RISK_AUDIT" | "DIPLOMATIC">("EXECUTIVE");
  const [attire, setAttire] = useState<"MIDNIGHT_SAVILE" | "GENEVA_PRIVATE" | "CYBER_SOVEREIGN">("MIDNIGHT_SAVILE");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customText, setCustomText] = useState("");
  const [wallet] = useState(() => getStoredSovereignWallet() || {
    address: "0xNUR8492A74E9B01DF8C2B3E12",
    publicKeyHex: "",
    mnemonicPhrase: "",
    createdAt: new Date().toISOString(),
    balanceNUR: 54.75,
    balanceUSD: 2997.56,
    totalComputeHours: 13.5,
    totalFlopsContributed: "420.5 TFLOPS",
    kycStatus: "TIER_2_BANK_READY" as const,
  });
  const [audioLevel, setAudioLevel] = useState(0);

  const profile = useMemo(() => {
    return AVATAR_PROFILES.find(p => p.id === selectedAvatarId) || AVATAR_PROFILES[0];
  }, [selectedAvatarId]);

  useEffect(() => {
    setCustomText(profile.defaultGreeting);
  }, [profile]);

  // Audio waveform pulse simulation during speaking
  useEffect(() => {
    let animId: any;
    if (isSpeaking) {
      const updateLevel = () => {
        setAudioLevel(0.3 + Math.random() * 0.7);
        animId = requestAnimationFrame(updateLevel);
      };
      animId = requestAnimationFrame(updateLevel);
    } else {
      setAudioLevel(0);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking]);

  const handleSpeak = (textToSpeak: string) => {
    if (isSpeaking) {
      hdVoiceEngine.stop();
      setIsSpeaking(false);
      return;
    }

    hdVoiceEngine.speak(
      textToSpeak || profile.defaultGreeting,
      profile.voiceLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wider text-cyan-400 font-mono">
                AI CONCIERGE & AVATAR STUDIO
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                GENDER-ADAPTIVE EXECUTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Interactive high-fidelity executive avatars powered by Sovereign HD Voice & real-time compute telemetry
            </p>
          </div>
        </div>

        {/* Character Switcher */}
        <div className="flex items-center gap-2">
          {AVATAR_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedAvatarId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 border ${
                selectedAvatarId === p.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span>{p.gender === "FEMALE" ? "👩‍💼" : "👨‍💼"}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN BODY ──────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Col: Interactive Portrait & Reactive Waveform */}
        <div className="lg:col-span-6 bg-gradient-to-b from-slate-950 via-[#030d24] to-slate-950 p-6 flex flex-col items-center justify-between relative border-r border-white/10 overflow-y-auto">
          {/* Status Badge */}
          <div className="w-full flex items-center justify-between text-xs font-mono mb-4">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-emerald-400 animate-ping" : "bg-emerald-500"}`} />
              {isSpeaking ? "ACTIVE VOICE STREAM (60 FPS)" : "READY • IDLE TELEMETRY"}
            </span>

            <span className="text-slate-400 text-[10px]">
              NODE: <strong className="text-white">{wallet.address.slice(0, 10)}...</strong>
            </span>
          </div>

          {/* Dynamic SVG / Canvas Portrait */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl bg-slate-900/80 border-2 border-cyan-500/40 p-4 flex flex-col items-center justify-center shadow-2xl shadow-cyan-500/10 overflow-hidden">
            {/* Ambient Background Aura */}
            <div
              className="absolute inset-0 opacity-20 blur-2xl transition-all duration-700"
              style={{
                background: isSpeaking ? profile.accentColor : "radial-gradient(circle, #3b82f6, transparent)",
                transform: `scale(${1 + audioLevel * 0.4})`,
              }}
            />

            {/* Avatar Graphics */}
            <div className="relative z-10 text-7xl md:text-8xl mb-3 filter drop-shadow-2xl transition-transform duration-200"
              style={{
                transform: isSpeaking ? `scale(${1 + audioLevel * 0.08}) translateY(${-audioLevel * 4}px)` : "scale(1)",
              }}
            >
              {profile.gender === "FEMALE" ? "👩‍💼" : "👨‍💼"}
            </div>

            <div className="relative z-10 text-center space-y-1">
              <h3 className="text-base font-extrabold text-white tracking-wide">{profile.name}</h3>
              <p className="text-[10px] text-cyan-300 font-mono">{profile.title}</p>
              <p className="text-[9px] text-slate-400">{profile.institution}</p>
            </div>

            {/* Speaking Waveform Bars */}
            {isSpeaking && (
              <div className="absolute bottom-3 inset-x-8 flex items-end justify-center gap-1.5 h-6">
                {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-cyan-400 transition-all duration-75"
                    style={{
                      height: `${Math.max(15, h * audioLevel)}%`,
                      opacity: 0.7 + audioLevel * 0.3,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Voice Triggers */}
          <div className="w-full mt-6 space-y-2">
            <button
              onClick={() => handleSpeak(customText)}
              className={`w-full py-3 rounded-2xl font-bold font-mono text-xs transition-all shadow-xl flex items-center justify-center gap-2 ${
                isSpeaking
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
              }`}
            >
              <span>{isSpeaking ? "⏹ STOP SPEECH" : "🎙️ EXECUTE CONCIERGE VOICE BRIEF"}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Persona Customizer & Briefing Composer */}
        <div className="lg:col-span-6 p-6 space-y-5 overflow-y-auto bg-slate-950/60 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Personality Mood Selector */}
            <div>
              <label className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider block mb-2">
                Executive Mood & Advisory Demeanor
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "EXECUTIVE", label: "🏛️ Sovereign Executive", desc: "Formal, ultra-high-net-worth, authoritative" },
                  { id: "ALPHA_HUNTER", label: "⚡ Alpha Hunter", desc: "Aggressive market positioning & arbitrage" },
                  { id: "RISK_AUDIT", label: "🛡️ Risk Audit", desc: "Defensive capital preservation & compliance" },
                  { id: "DIPLOMATIC", label: "🤝 Diplomatic Institutional", desc: "Balanced, cross-border syndicate focus" },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      mood === m.id
                        ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md"
                        : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{m.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Attire & Visual Lighting */}
            <div>
              <label className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider block mb-2">
                Wardrobe & Visual Presentation Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "MIDNIGHT_SAVILE", label: "Savile Row Dark", icon: "👔" },
                  { id: "GENEVA_PRIVATE", label: "Geneva Silk", icon: "💼" },
                  { id: "CYBER_SOVEREIGN", label: "Cyber Sovereign", icon: "🛰️" },
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAttire(a.id as any)}
                    className={`p-2 rounded-xl text-center border text-xs font-mono font-bold transition-all ${
                      attire === a.id
                        ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                        : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div>{a.icon}</div>
                    <div className="text-[10px] mt-1">{a.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Speech Teleprompter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider">
                  Live Executive Speech Teleprompter
                </label>
                <button
                  onClick={() => setCustomText(profile.defaultGreeting)}
                  className="text-[10px] text-cyan-400 hover:underline font-mono"
                >
                  Reset to Default Greeting
                </button>
              </div>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-slate-900 border border-white/10 p-3 text-xs text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none resize-none"
                placeholder="Enter custom speech script for the AI concierge..."
              />
            </div>
          </div>

          {/* Footer Info Box */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-[10px] text-cyan-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-cyan-300">
              <span>💎</span>
              <span>Sovereign Identity Protocol</span>
            </div>
            <p className="text-slate-400">
              Avatars are dynamically initialized based on the client's verified national KYC record and financial profile credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
