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
    ],
    scripts: {
      opening: "Good morning and welcome to NUR Finance Live. I'm your anchor bringing you the latest from global financial markets.",
      macro: "Turning to the macro picture, central banks continue to navigate the balance between inflation and growth.",
      quant: "Our quantitative models are showing interesting signals across multiple asset classes today.",
      breaking: "We have breaking news coming in from the markets.",
      closing: "That concludes today's broadcast. Thank you for watching NUR Finance Live.",
    },
  },
];

export const hdVoiceEngine = {
  speak(
    text: string,
    langCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
    _options?: Record<string, unknown>,
  ) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onError?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onError?.();
    window.speechSynthesis.speak(utterance);
  },
  stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
};
