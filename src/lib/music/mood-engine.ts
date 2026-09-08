export type MarketMood = "bull" | "bear" | "neutral" | "volatile";

export interface MoodTrack {
  id: string;
  title: string;
  mood: MarketMood;
  url: string;
  duration: number;
  bpm?: number;
}

const MOOD_TRACKS: MoodTrack[] = [
  // Bull / Kazanç — energetic, upbeat
  { id: "bull-1", title: "Rising Tide", mood: "bull", url: "/audio/mood/bull-1.mp3", duration: 180, bpm: 120 },
  { id: "bull-2", title: "Golden Hour", mood: "bull", url: "/audio/mood/bull-2.mp3", duration: 180, bpm: 115 },
  { id: "bull-3", title: "Momentum", mood: "bull", url: "/audio/mood/bull-3.mp3", duration: 180, bpm: 125 },
  // Bear / Kayıp — melancholic, reflective
  { id: "bear-1", title: "Deep Cave", mood: "bear", url: "/audio/mood/bear-1.mp3", duration: 180, bpm: 70 },
  { id: "bear-2", title: "Winter March", mood: "bear", url: "/audio/mood/bear-2.mp3", duration: 180, bpm: 65 },
  { id: "bear-3", title: "Patience", mood: "bear", url: "/audio/mood/bear-3.mp3", duration: 180, bpm: 75 },
  // Neutral / Bekleme — smooth, lounge
  { id: "neutral-1", title: "Steady Flow", mood: "neutral", url: "/audio/mood/neutral-1.mp3", duration: 180, bpm: 90 },
  { id: "neutral-2", title: "Market Calm", mood: "neutral", url: "/audio/mood/neutral-2.mp3", duration: 180, bpm: 85 },
  { id: "neutral-3", title: "Equilibrium", mood: "neutral", url: "/audio/mood/neutral-3.mp3", duration: 180, bpm: 88 },
  // Volatile / Dalgalı — dramatic, tense
  { id: "volatile-1", title: "Storm Warning", mood: "volatile", url: "/audio/mood/volatile-1.mp3", duration: 180, bpm: 140 },
  { id: "volatile-2", title: "Flash Crash", mood: "volatile", url: "/audio/mood/volatile-2.mp3", duration: 180, bpm: 145 },
  { id: "volatile-3", title: "Turbulence", mood: "volatile", url: "/audio/mood/volatile-3.mp3", duration: 180, bpm: 135 },
];

export function computeMarketMood(changePercent: number, vix?: number): MarketMood {
  if (vix && vix > 30) return "volatile";
  if (Math.abs(changePercent) > 3) return "volatile";
  if (changePercent > 1) return "bull";
  if (changePercent < -1) return "bear";
  return "neutral";
}

export function getMoodTracks(mood: MarketMood): MoodTrack[] {
  return MOOD_TRACKS.filter((t) => t.mood === mood);
}

export function pickTrack(mood: MarketMood, recentlyPlayed: string[]): MoodTrack | null {
  const available = MOOD_TRACKS.filter((t) => t.mood === mood && !recentlyPlayed.includes(t.id));
  if (available.length === 0) {
    const all = MOOD_TRACKS.filter((t) => t.mood === mood);
    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function getMoodDescription(mood: MarketMood): string {
  switch (mood) {
    case "bull": return "Markets rising — upbeat energy";
    case "bear": return "Markets declining — reflective calm";
    case "volatile": return "High volatility — dramatic tension";
    case "neutral": return "Markets steady — smooth ambience";
  }
}

export function getMoodColor(mood: MarketMood): string {
  switch (mood) {
    case "bull": return "#00d4aa";
    case "bear": return "#ef4444";
    case "volatile": return "#f59e0b";
    case "neutral": return "#6366f1";
  }
}
