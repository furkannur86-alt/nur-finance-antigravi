"use client";

import { useState, useEffect, useRef } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

const CHANNELS = [
  { id: "nur-turkey", name: "NUR Turkey (TR)", anchor: "Elif Nur & Emre Kaya", lang: "Turkish", topic: "BIST-100 & CBRT Policy" },
  { id: "nur-usa", name: "NUR USA (EN)", anchor: "Sarah Jenkins & Mark Vance", lang: "English", topic: "Wall St, Fed & ISM Rotation" },
  { id: "nur-deutsch", name: "NUR Deutschland (DE)", anchor: "Hanna Nur & Klaus Weber", lang: "German", topic: "DAX 40 & ECB Liquidity" },
  { id: "nur-france", name: "NUR France (FR)", anchor: "Camille Dubois & Luc Moreau", lang: "French", topic: "CAC 40 & Eurozone Bonds" },
  { id: "nur-global", name: "NUR Global Macro (EN)", anchor: "Alexander Croft", lang: "English", topic: "Cross-Asset Geopolitics & ACLED" },
  { id: "nur-japan", name: "NUR Japan (JA)", anchor: "Misaki Tanaka", lang: "Japanese", topic: "Nikkei 225 & BOJ Yield Curve" },
  { id: "nur-china", name: "NUR China (ZH)", anchor: "Yuhan Chen", lang: "Mandarin", topic: "CSI 300 & PBOC Monetary Easing" },
  { id: "nur-brazil", name: "NUR Brasil (PT)", anchor: "Valentina Silva", lang: "Portuguese", topic: "Ibovespa & Commodities" },
  { id: "nur-india", name: "NUR India (HI)", anchor: "Priya Sharma", lang: "Hindi/English", topic: "NIFTY 50 & Tech Growth" },
  { id: "nur-arabic", name: "NUR Middle East (AR)", anchor: "Zayd Al-Mansoor", lang: "Arabic", topic: "MENA Energy & Sovereign Wealth" },
  { id: "nur-korea", name: "NUR Korea (KO)", anchor: "Soyeon Park", lang: "Korean", topic: "KOSPI & Semiconductor Cycle" },
  { id: "nur-latam", name: "NUR Latin America (ES)", anchor: "Mateo Rodriguez", lang: "Spanish", topic: "LatAm FX & Copper / Lithium" },
];

export default function BroadcastStudioPanel() {
  const { breakingNewsTicker, setBreakingNewsTicker, addNotification } = useIDEStore();

  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(3);
  const [isPrompting, setIsPrompting] = useState(true);
  const [customHeadline, setCustomHeadline] = useState("");
  const [activeSegment, setActiveSegment] = useState<"opening" | "macro" | "quant" | "closing">("macro");

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
    const fullBanner = `[${selectedChannel.name.toUpperCase()}] BREAKING: ${customHeadline.trim()}`;
    setBreakingNewsTicker(fullBanner);
    addNotification({
      title: "Breaking News Injected",
      message: `Studio banner broadcasted: "${customHeadline}"`,
      severity: "INFO",
      category: "NUR_TV",
    });
    setCustomHeadline("");
  };

  const scripts = {
    opening: `Good morning and welcome to ${selectedChannel.name}. I am ${selectedChannel.anchor}, broadcasting live from the NUR Finance Digital Newsroom.\n\nGlobal quantitative indicators are highlighting significant volatility dispersion across major market centers. Let us examine the latest ISM sector composite data.`,
    macro: `In today's macroeconomic landscape, the ISM Services index printed at 54.8, confirming sustained momentum in business activity. Michigan Consumer Sentiment holds firmly above the 85 threshold, indicating robust forward GDP trajectory.\n\nOur cross-asset risk engine indicates low systemic contagion risk with the VIX maintaining its safe corridor under 30.`,
    quant: `From our proprietary long/short sector rotation model: Technology and Financial sectors lead with composite scores exceeding +1.0. Defensive proxies, including Utilities and Real Estate, lag at -1.0.\n\nThe system remains market-neutral with an expected Sharpe ratio of 0.78 and 3.5x continuous Kelly leverage sizing.`,
    closing: `That concludes our quantitative market briefing for ${selectedChannel.name}. For continuous updates and live order routing, consult the NUR Terminal.\n\nI am ${selectedChannel.anchor}. Stay disciplined, stay quantitative.`,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Studio Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ag-accent)]">NUR TV Interactive Broadcast Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-red-500/20 text-red-400 animate-pulse">
                LIVE ON-AIR &bull; 12 CHANNELS
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Automated AI Teleprompter &bull; Breaking Banner Injector &bull; Real-time Audio Spectrum
            </p>
          </div>
        </div>

        {/* Global Breaking News Ticker in Header */}
        <div className="max-w-md truncate text-xs font-mono px-3 py-1 rounded bg-black/40 border border-red-500/30 text-red-300">
          <span className="font-bold text-red-400 mr-2">&bull; TICKER:</span>
          {breakingNewsTicker}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: 12 Channel Selector */}
        <div
          className="w-72 flex flex-col border-r overflow-y-auto p-3"
          style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
        >
          <div className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase mb-2">
            Global Channels ({CHANNELS.length})
          </div>
          <div className="space-y-1.5">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={`w-full text-left p-2.5 rounded border transition-all ${
                  selectedChannel.id === ch.id
                    ? "bg-[rgba(0,212,170,0.15)] border-[var(--ag-accent)] text-white"
                    : "border-[var(--ag-border)] bg-black/20 text-[var(--ag-muted)] hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>{ch.name}</span>
                  <span className="text-[9px] font-mono text-[var(--ag-accent)]">{ch.lang}</span>
                </div>
                <div className="text-[11px] text-[var(--ag-text)] mt-1 truncate">Host: {ch.anchor}</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5 truncate">{ch.topic}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Live Studio Teleprompter */}
        <div className="flex-1 flex flex-col min-w-0 border-r" style={{ borderColor: "var(--ag-border)" }}>
          {/* Segment Selector & Controls */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b select-none"
            style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
          >
            <div className="flex items-center gap-1.5">
              {(["opening", "macro", "quant", "closing"] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setActiveSegment(seg)}
                  className={`px-3 py-1 text-xs rounded uppercase font-bold transition-colors ${
                    activeSegment === seg
                      ? "bg-[var(--ag-accent)] text-black"
                      : "text-[var(--ag-muted)] hover:text-white bg-white/5"
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsPrompting(!isPrompting)}
                className={`px-3 py-1 rounded font-bold font-mono text-[11px] ${
                  isPrompting ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isPrompting ? "PAUSE PROMPTER" : "RESUME PROMPTER"}
              </button>
              <div className="flex items-center gap-1 text-[var(--ag-muted)]">
                <span>Speed:</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={teleprompterSpeed}
                  onChange={(e) => setTeleprompterSpeed(parseInt(e.target.value))}
                  className="w-16 accent-[var(--ag-accent)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Teleprompter Display */}
          <div
            ref={prompterRef}
            className="flex-1 overflow-y-auto p-6 font-mono text-base leading-loose bg-black/60 text-emerald-300"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="max-w-2xl mx-auto whitespace-pre-line py-8">
              {scripts[activeSegment]}
            </div>
          </div>
        </div>

        {/* Right Column: Studio Controls, Banner Injector & Audio Spectrum */}
        <div
          className="w-80 flex flex-col overflow-y-auto p-4 gap-4"
          style={{ background: "var(--ag-surface)" }}
        >
          {/* Audio Spectrum Visualizer */}
          <div>
            <div className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase mb-1.5 flex justify-between">
              <span>On-Air Audio Spectrum</span>
              <span className="text-[var(--ag-accent)] font-mono font-bold">48.0 kHz</span>
            </div>
            <AudioSpectrumVisualizer height={54} isPlaying={true} />
          </div>

          {/* Breaking News Injector Form */}
          <div className="p-3.5 rounded border bg-black/30" style={{ borderColor: "var(--ag-border)" }}>
            <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Broadcast Breaking Banner</span>
            </div>
            <form onSubmit={handleInjectBanner} className="space-y-2">
              <textarea
                rows={3}
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder="Enter urgent headline to broadcast live to all global terminals..."
                className="w-full p-2.5 rounded text-xs bg-black/50 border text-white font-mono focus:outline-none focus:border-red-500"
                style={{ borderColor: "var(--ag-border)" }}
              />
              <button
                type="submit"
                disabled={!customHeadline.trim()}
                className="w-full py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white uppercase tracking-wider transition-colors disabled:opacity-40"
              >
                INJECT ON-AIR BANNER
              </button>
            </form>
          </div>

          {/* Channel Metadata Box */}
          <div className="p-3.5 rounded border bg-black/20 text-xs font-mono space-y-1.5" style={{ borderColor: "var(--ag-border)" }}>
            <div className="text-[10px] text-[var(--ag-muted)] uppercase font-sans">Active Stream Specs</div>
            <div className="flex justify-between">
              <span className="text-[var(--ag-muted)]">Encoding:</span>
              <span className="text-white font-bold">H.264 / AAC (1080p60)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ag-muted)]">TTS Engine:</span>
              <span className="text-[var(--ag-accent)] font-bold">Piper &bull; Studio HD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ag-muted)]">Bitrate:</span>
              <span className="text-white">6,500 kbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ag-muted)]">Latency:</span>
              <span className="text-emerald-400">142 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
