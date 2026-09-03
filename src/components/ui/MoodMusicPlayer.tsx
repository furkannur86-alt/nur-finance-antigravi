"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { type MarketMood, computeMarketMood, pickTrack, getMoodDescription, getMoodColor, type MoodTrack } from "@/lib/music/mood-engine";

interface MoodMusicPlayerProps {
  portfolioChangePercent: number;
  vix?: number;
  compact?: boolean;
}

export default function MoodMusicPlayer({ portfolioChangePercent, vix, compact = false }: MoodMusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState<MoodTrack | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [mood, setMood] = useState<MarketMood>("neutral");
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newMood = computeMarketMood(portfolioChangePercent, vix);
    setMood(newMood);
  }, [portfolioChangePercent, vix]);

  const playTrack = useCallback((track: MoodTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.url);
    audio.volume = volume;
    audio.loop = true;
    audioRef.current = audio;
    setCurrentTrack(track);
    setRecentlyPlayed((prev) => [track.id, ...prev].slice(0, 20));

    audio.addEventListener("canplay", () => setAudioReady(true));
    audio.addEventListener("error", () => {
      setAudioReady(false);
    });

    audio.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      setAudioReady(false);
    });
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      const track = pickTrack(mood, recentlyPlayed);
      if (track) playTrack(track);
    }
  }, [playing, mood, recentlyPlayed, playTrack]);

  const skipTrack = useCallback(() => {
    const track = pickTrack(mood, recentlyPlayed);
    if (track) playTrack(track);
  }, [mood, recentlyPlayed, playTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const moodColor = getMoodColor(mood);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={togglePlay} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] transition-colors"
          style={{ background: moodColor + "18", color: moodColor }}>
          <span>{playing ? "||" : ">"}</span>
          <span className="font-bold">{mood.toUpperCase()}</span>
        </button>
        {playing && currentTrack && (
          <span className="text-[8px] truncate max-w-[80px]" style={{ color: "var(--ag-muted)" }}>
            {currentTrack.title}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
            style={{ background: moodColor + "22", color: moodColor }}>
            {mood === "bull" ? "B" : mood === "bear" ? "b" : mood === "volatile" ? "V" : "N"}
          </div>
          <div>
            <div className="text-[10px] font-semibold" style={{ color: "var(--ag-text)" }}>Market Mood Music</div>
            <div className="text-[9px]" style={{ color: moodColor }}>{getMoodDescription(mood)}</div>
          </div>
        </div>
        {playing && (
          <div className="flex items-center gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-0.5 rounded-full animate-pulse"
                style={{
                  height: 6 + Math.sin(Date.now() * 0.003 + i) * 4,
                  background: moodColor,
                  animationDelay: `${i * 150}ms`,
                }} />
            ))}
          </div>
        )}
      </div>

      {currentTrack && (
        <div className="text-[10px] mb-2 px-2 py-1 rounded" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
          Now: <span className="font-semibold">{currentTrack.title}</span>
          {!audioReady && <span className="ml-1" style={{ color: "var(--ag-muted)" }}>(loading...)</span>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={togglePlay}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
          style={{ background: moodColor + "22", color: moodColor }}>
          {playing ? "||" : ">"}
        </button>
        <button onClick={skipTrack} className="text-[10px] px-2 py-1 rounded transition-colors"
          style={{ background: "var(--ag-border)", color: "var(--ag-muted)" }}>
          Skip
        </button>
        <div className="flex-1 flex items-center gap-1.5">
          <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>Vol</span>
          <input
            type="range" min="0" max="100" value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="flex-1 h-1 appearance-none rounded-full"
            style={{ background: `linear-gradient(to right, ${moodColor} ${volume * 100}%, var(--ag-border) ${volume * 100}%)` }}
          />
        </div>
      </div>

      <div className="text-[8px] mt-2" style={{ color: "var(--ag-muted)" }}>
        Music changes dynamically based on portfolio performance. Add tracks to /public/audio/mood/
      </div>
    </div>
  );
}
