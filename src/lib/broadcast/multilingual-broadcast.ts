export interface LanguageBroadcastProfile {
  id: string;
  name: string;
  nativeName: string;
  langCode: string;
  defaultAnchorName: string;
  flag: string;
  city: string;
  anchorAvatar: string;
  headlines: string[];
  scripts: Record<string, string>;
}

export const BROADCAST_LANGUAGES: LanguageBroadcastProfile[] = [
  {
    id: "en",
    name: "English",
    nativeName: "English",
    langCode: "en-US",
    defaultAnchorName: "NUR Finance Anchor",
    flag: "🇺🇸",
    city: "New York",
    anchorAvatar: "👤",
    headlines: [
      "Markets rally on strong earnings data",
      "Fed holds rates steady amid inflation concerns",
      "Oil prices surge on OPEC+ supply cuts",
      "Tech sector leads global equities higher",
      "Gold hits record highs on safe-haven demand",
    ],
    scripts: {
      opening: "Good morning and welcome to NUR Finance Live. I'm bringing you the latest from global financial markets. Let's start with today's market overview.",
      macro: "Turning to the macro picture. Central banks continue to navigate the balance between inflation and economic growth. The Federal Reserve is expected to signal rate cuts in the coming quarters.",
      quant: "Our quantitative models are showing interesting signals across multiple asset classes today. The risk-reward profile has improved notably in emerging market equities.",
      breaking: "We have breaking news coming in from the markets. Stay with us for live updates.",
      closing: "That concludes today's broadcast. Thank you for watching NUR Finance Live. We'll be back with the next session.",
    },
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    langCode: "de-DE",
    defaultAnchorName: "NUR Finance Frankfurt",
    flag: "🇩🇪",
    city: "Frankfurt",
    anchorAvatar: "👤",
    headlines: [
      "DAX erreicht neues Allzeithoch nach EZB-Entscheidung",
      "Bundesanleihen steigen auf Inflationsdaten",
      "Deutsche Industrieproduktion uebertrifft Erwartungen",
      "Euro staerkt sich gegenueber Dollar",
    ],
    scripts: {
      opening: "Guten Morgen und willkommen bei NUR Finance Live aus Frankfurt. Hier sind die neuesten Entwicklungen an den globalen Finanzmaerkten.",
      macro: "Zur makrooekonomischen Lage. Die Europaeische Zentralbank behaelt ihren Kurs bei und beobachtet die Kerninflation genau.",
      quant: "Unsere quantitativen Modelle zeigen heute interessante Signale in mehreren Anlageklassen.",
      breaking: "Eilmeldung von den Maerkten. Bleiben Sie bei uns fuer Live-Updates.",
      closing: "Das war unsere heutige Sendung. Vielen Dank fuers Zusehen bei NUR Finance Live.",
    },
  },
  {
    id: "tr",
    name: "Turkish",
    nativeName: "Turkce",
    langCode: "tr-TR",
    defaultAnchorName: "NUR Finance Istanbul",
    flag: "🇹🇷",
    city: "Istanbul",
    anchorAvatar: "👤",
    headlines: [
      "BIST 100 yabanci girislerle rekor kirdi",
      "Merkez Bankasi faiz kararini acikladi",
      "Altin fiyatlari tarihi zirvede",
      "Turkiye CDS risk primi geriledi",
    ],
    scripts: {
      opening: "Gunaydin, NUR Finance canli yayinina hos geldiniz. Global finansal piyasalardan son gelismeler ile birlikteyiz.",
      macro: "Makro ekonomik goruntude, Merkez Bankasi enflasyon ile buyume arasindaki dengeyi korumaya devam ediyor.",
      quant: "Kantitatif modellerimiz bugun birden fazla varlik sinifinda dikkat cekici sinyaller gosteriyor.",
      breaking: "Piyasalardan son dakika haberi. Canli guncellemeler icin bizimle kalin.",
      closing: "Bugunun yayini sona erdi. NUR Finance Live izlediginiz icin tesekkur ederiz.",
    },
  },
  {
    id: "ar",
    name: "Arabic",
    nativeName: "Arabic",
    langCode: "ar-SA",
    defaultAnchorName: "NUR Finance Riyadh",
    flag: "🇸🇦",
    city: "Riyadh",
    anchorAvatar: "👤",
    headlines: [
      "TADAWUL index rises on Vision 2030 progress",
      "Oil markets stabilize amid OPEC decisions",
      "GCC sovereign bonds see strong demand",
      "Saudi Aramco quarterly earnings beat expectations",
    ],
    scripts: {
      opening: "Welcome to NUR Finance Live from the Middle East desk. Here are the latest developments in regional and global markets.",
      macro: "Looking at the macro environment, oil prices and regional monetary policy remain key drivers for MENA markets.",
      quant: "Our models highlight attractive opportunities in GCC fixed income and select equity sectors.",
      breaking: "Breaking news from the energy markets. We'll bring you the details.",
      closing: "Thank you for watching NUR Finance Live Middle East edition.",
    },
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "Chinese",
    langCode: "zh-CN",
    defaultAnchorName: "NUR Finance Shanghai",
    flag: "🇨🇳",
    city: "Shanghai",
    anchorAvatar: "👤",
    headlines: [
      "Shanghai Composite rallies on PBoC stimulus",
      "China PMI signals manufacturing recovery",
      "Tech shares surge on AI policy support",
      "Yuan stabilizes after central bank intervention",
    ],
    scripts: {
      opening: "Welcome to NUR Finance Live from the Asia-Pacific desk covering China and regional markets.",
      macro: "The People's Bank of China continues supportive monetary policy as the economy shows signs of stabilization.",
      quant: "Quantitative signals in Asian markets point to rotation into value sectors.",
      breaking: "Breaking: Major policy announcement from Chinese authorities.",
      closing: "Thank you for watching NUR Finance Asia-Pacific coverage.",
    },
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "Japanese",
    langCode: "ja-JP",
    defaultAnchorName: "NUR Finance Tokyo",
    flag: "🇯🇵",
    city: "Tokyo",
    anchorAvatar: "👤",
    headlines: [
      "Nikkei 225 breaks above 40,000 level",
      "Bank of Japan signals policy normalization",
      "Yen weakens past 155 against dollar",
      "Japanese corporate earnings exceed forecasts",
    ],
    scripts: {
      opening: "Welcome to NUR Finance Live from the Tokyo desk. Let's review the latest in Japanese and Asian markets.",
      macro: "The Bank of Japan's gradual shift away from ultra-loose policy continues to shape market dynamics.",
      quant: "Our models indicate interesting opportunities in Japanese equities and JGB trading.",
      breaking: "Breaking news from the Tokyo Stock Exchange.",
      closing: "Thank you for watching NUR Finance Tokyo coverage.",
    },
  },
];

/**
 * NUR Finance HD Voice Engine
 * Uses /api/ai/tts for Neural HD voices (Microsoft Edge / ElevenLabs)
 * Falls back to browser speechSynthesis if API is unavailable
 */
export const hdVoiceEngine = {
  currentAudio: null as HTMLAudioElement | null,
  isPlaying: false,

  async speak(
    text: string,
    langCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
    options?: { isMale?: boolean; rate?: string },
  ) {
    this.stop();

    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          langCode,
          isMale: options?.isMale || false,
          rate: options?.rate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          this.currentAudio = audio;
          this.isPlaying = true;

          audio.onplay = () => onStart?.();
          audio.onended = () => {
            this.isPlaying = false;
            this.currentAudio = null;
            onEnd?.();
          };
          audio.onerror = () => {
            this.isPlaying = false;
            this.currentAudio = null;
            this._fallbackSpeak(text, langCode, onStart, onEnd, onError);
          };

          await audio.play();
          return;
        }
      }

      this._fallbackSpeak(text, langCode, onStart, onEnd, onError);
    } catch {
      this._fallbackSpeak(text, langCode, onStart, onEnd, onError);
    }
  },

  _fallbackSpeak(
    text: string,
    langCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
  ) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onError?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 1.1;
    utterance.onstart = () => { this.isPlaying = true; onStart?.(); };
    utterance.onend = () => { this.isPlaying = false; onEnd?.(); };
    utterance.onerror = () => { this.isPlaying = false; onError?.(); };
    window.speechSynthesis.speak(utterance);
  },

  stop() {
    this.isPlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
};
