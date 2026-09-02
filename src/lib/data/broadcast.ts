// NUR Finance Global Broadcast Network — Complete Character & Schedule Database

export type HairColor = "platinum-blonde" | "auburn" | "jet-black" | "chestnut" | "dark-brown" | "honey-blonde" | "copper-red" | "raven" | "ash-brown" | "golden-brown" | "midnight-black" | "walnut" | "mahogany" | "espresso" | "toffee";
export type HairStyle = "straight-long" | "wavy-long" | "sleek-bob" | "layered-long" | "chignon" | "hijab" | "low-bun" | "side-part-long" | "french-twist" | "shoulder-length";
export type SkinTone = "fair" | "light" | "medium" | "olive" | "tan" | "brown" | "deep";
export type HostStatus = "active" | "on-leave" | "training";
export type ShowFormat = "live-desk" | "panel-discussion" | "market-open" | "market-close" | "breaking-news" | "interview" | "deep-dive" | "weekend-review";

export interface NURHost {
  id: string;
  channelId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: "female";
  heightCm: number;
  eyeColor: "green";
  hairColor: HairColor;
  hairStyle: HairStyle;
  skinTone: SkinTone;
  ageRange: string;
  nationality: string;
  languages: string[];
  education: { degree: string; field: string; institution: string; year: number }[];
  certifications: string[];
  previousEmployers: string[];
  specializations: string[];
  bio: string;
  status: HostStatus;
  imagePrompt: string;
}

export interface NURGuest {
  id: string;
  channelIds: string[];
  firstName: string;
  lastName: string;
  displayName: string;
  title: string;
  gender: "male" | "female";
  ageRange: string;
  nationality: string;
  languages: string[];
  education: { degree: string; field: string; institution: string; year: number }[];
  currentPosition: string;
  institution: string;
  specializations: string[];
  publications: number;
  typicalSegmentMinutes: number;
  bio: string;
  imagePrompt: string;
}

export interface NURShow {
  id: string;
  channelId: string;
  name: string;
  nameLocal: string;
  format: ShowFormat;
  durationMinutes: number;
  hostIds: string[];
  recurringGuestIds: string[];
  schedule: { days: string[]; startUTC: string; endUTC: string };
  description: string;
  segments: string[];
}

export interface NURChannel {
  id: string;
  name: string;
  nameLocal: string;
  language: string;
  secondaryLanguages: string[];
  region: string;
  city: string;
  timezone: string;
  studioName: string;
  flag: string;
  status: "live" | "upcoming" | "pre-launch";
  launchDate: string;
  description: string;
  descriptionLocal: string;
  youtubeHandle: string;
  topics: string[];
  brandColor: string;
  accentColor: string;
}

// ═══════════════════════════════════════════════════════════════
// 15 CHANNELS
// ═══════════════════════════════════════════════════════════════

export const channels: NURChannel[] = [
  {
    id: "nur-global", name: "NUR Finance Global", nameLocal: "NUR Finance Global",
    language: "English", secondaryLanguages: [], region: "Global", city: "London",
    timezone: "Europe/London", studioName: "Studio One — Canary Wharf",
    flag: "🇬🇧", status: "live", launchDate: "2026-01-15",
    description: "24/7 flagship channel. Global markets, macro analysis, breaking news.",
    descriptionLocal: "24/7 flagship channel. Global markets, macro analysis, breaking news.",
    youtubeHandle: "@NURFinanceGlobal", topics: ["Global Markets", "Macro", "Breaking News", "Commodities"],
    brandColor: "#00d4aa", accentColor: "#00d4aa"
  },
  {
    id: "nur-usa", name: "NUR Finance US", nameLocal: "NUR Finance US",
    language: "English", secondaryLanguages: ["Spanish"], region: "North America", city: "New York",
    timezone: "America/New_York", studioName: "Studio NUR — Hudson Yards",
    flag: "🇺🇸", status: "live", launchDate: "2026-01-15",
    description: "Wall Street, US equities, Fed policy, tech sector, earnings.",
    descriptionLocal: "Wall Street, US equities, Fed policy, tech sector, earnings.",
    youtubeHandle: "@NURFinanceUS", topics: ["Wall Street", "Fed", "Tech", "Earnings"],
    brandColor: "#3b82f6", accentColor: "#f5a623"
  },
  {
    id: "nur-turkey", name: "NUR Finans Türkiye", nameLocal: "NUR Finans Türkiye",
    language: "Turkish", secondaryLanguages: ["English"], region: "Turkey", city: "Istanbul",
    timezone: "Europe/Istanbul", studioName: "Stüdyo NUR — Levent",
    flag: "🇹🇷", status: "live", launchDate: "2026-01-15",
    description: "Borsa Istanbul, Turkish economy, investment analysis, emerging markets.",
    descriptionLocal: "Borsa İstanbul, Türk ekonomisi, yatırım analizi ve gelişen piyasalar.",
    youtubeHandle: "@NURFinansTurkiye", topics: ["BIST", "TCMB", "Ekonomi", "Yatırım"],
    brandColor: "#e30a17", accentColor: "#e30a17"
  },
  {
    id: "nur-arabic", name: "NUR Finance Arabia", nameLocal: "نور المالية",
    language: "Arabic", secondaryLanguages: ["English"], region: "MENA", city: "Dubai",
    timezone: "Asia/Dubai", studioName: "استوديو نور — مركز دبي المالي",
    flag: "🇦🇪", status: "live", launchDate: "2026-02-01",
    description: "GCC markets, oil & energy, sovereign wealth, Islamic finance.",
    descriptionLocal: "أسواق الخليج، النفط والطاقة، صناديق الثروة السيادية، التمويل الإسلامي",
    youtubeHandle: "@NURFinanceArabia", topics: ["GCC", "Oil", "Sovereign Wealth", "Islamic Finance"],
    brandColor: "#e8a838", accentColor: "#e8a838"
  },
  {
    id: "nur-deutsch", name: "NUR Finanzen", nameLocal: "NUR Finanzen",
    language: "German", secondaryLanguages: ["English"], region: "DACH", city: "Frankfurt",
    timezone: "Europe/Berlin", studioName: "Studio NUR — Bankenviertel",
    flag: "🇩🇪", status: "live", launchDate: "2026-02-15",
    description: "DAX, European markets, ECB policy, industrial sector, fixed income.",
    descriptionLocal: "DAX, europäische Märkte, EZB-Politik, Industriesektor, Anleihen.",
    youtubeHandle: "@NURFinanzen", topics: ["DAX", "EZB", "Anleihen", "Industrie"],
    brandColor: "#3b82f6", accentColor: "#3b82f6"
  },
  {
    id: "nur-france", name: "NUR Finance France", nameLocal: "NUR Finance France",
    language: "French", secondaryLanguages: ["English"], region: "France/Francophone", city: "Paris",
    timezone: "Europe/Paris", studioName: "Studio NUR — La Défense",
    flag: "🇫🇷", status: "live", launchDate: "2026-03-01",
    description: "CAC 40, luxury sector, European monetary policy, francophone Africa.",
    descriptionLocal: "CAC 40, secteur du luxe, politique monétaire européenne, Afrique francophone.",
    youtubeHandle: "@NURFinanceFrance", topics: ["CAC 40", "Luxe", "BCE", "Afrique"],
    brandColor: "#a855f7", accentColor: "#a855f7"
  },
  {
    id: "nur-japan", name: "NUR Finance Japan", nameLocal: "NURファイナンス・ジャパン",
    language: "Japanese", secondaryLanguages: ["English"], region: "Japan", city: "Tokyo",
    timezone: "Asia/Tokyo", studioName: "スタジオNUR — 丸の内",
    flag: "🇯🇵", status: "live", launchDate: "2026-03-01",
    description: "Nikkei, BoJ policy, yen dynamics, semiconductor supply chain, robotics.",
    descriptionLocal: "日経平均、日銀政策、円相場、半導体サプライチェーン、ロボティクス。",
    youtubeHandle: "@NURFinanceJapan", topics: ["日経", "日銀", "半導体", "円"],
    brandColor: "#ef4444", accentColor: "#ef4444"
  },
  {
    id: "nur-china", name: "NUR Finance China", nameLocal: "光辉金融",
    language: "Mandarin", secondaryLanguages: ["Cantonese", "English"], region: "China/HK", city: "Shanghai",
    timezone: "Asia/Shanghai", studioName: "光辉演播室 — 陆家嘴",
    flag: "🇨🇳", status: "live", launchDate: "2026-03-15",
    description: "A-shares, Hong Kong markets, PBoC policy, tech giants, Belt & Road.",
    descriptionLocal: "A股市场、港股、央行政策、科技巨头、一带一路。",
    youtubeHandle: "@NURFinanceChina", topics: ["A股", "港股", "央行", "科技"],
    brandColor: "#ef4444", accentColor: "#f59e0b"
  },
  {
    id: "nur-korea", name: "NUR Finance Korea", nameLocal: "NUR 파이낸스 코리아",
    language: "Korean", secondaryLanguages: ["English"], region: "South Korea", city: "Seoul",
    timezone: "Asia/Seoul", studioName: "스튜디오 NUR — 여의도",
    flag: "🇰🇷", status: "live", launchDate: "2026-04-01",
    description: "KOSPI, semiconductor industry, K-economy, crypto, startup ecosystem.",
    descriptionLocal: "코스피, 반도체 산업, K-경제, 암호화폐, 스타트업 생태계.",
    youtubeHandle: "@NURFinanceKorea", topics: ["코스피", "반도체", "암호화폐", "스타트업"],
    brandColor: "#6366f1", accentColor: "#6366f1"
  },
  {
    id: "nur-india", name: "NUR Finance India", nameLocal: "NUR Finance India",
    language: "English", secondaryLanguages: ["Hindi"], region: "India", city: "Mumbai",
    timezone: "Asia/Kolkata", studioName: "Studio NUR — BKC, Mumbai",
    flag: "🇮🇳", status: "live", launchDate: "2026-04-15",
    description: "NSE/BSE, RBI policy, IT sector, demographics dividend, startup boom.",
    descriptionLocal: "NSE/BSE, RBI नीति, IT सेक्टर, जनसांख्यिकी लाभांश, स्टार्टअप।",
    youtubeHandle: "@NURFinanceIndia", topics: ["NSE", "BSE", "RBI", "IT Sector"],
    brandColor: "#f97316", accentColor: "#22c55e"
  },
  {
    id: "nur-brazil", name: "NUR Finance Brasil", nameLocal: "NUR Finanças Brasil",
    language: "Portuguese", secondaryLanguages: ["Spanish", "English"], region: "Brazil/LatAm", city: "São Paulo",
    timezone: "America/Sao_Paulo", studioName: "Estúdio NUR — Faria Lima",
    flag: "🇧🇷", status: "live", launchDate: "2026-05-01",
    description: "Ibovespa, Selic, commodities, agribusiness, Latin America markets.",
    descriptionLocal: "Ibovespa, Selic, commodities, agronegócio, mercados da América Latina.",
    youtubeHandle: "@NURFinanceBrasil", topics: ["Ibovespa", "Selic", "Commodities", "Agro"],
    brandColor: "#22c55e", accentColor: "#f59e0b"
  },
  {
    id: "nur-latam", name: "NUR Finanzas", nameLocal: "NUR Finanzas",
    language: "Spanish", secondaryLanguages: ["Portuguese", "English"], region: "Latin America", city: "Mexico City",
    timezone: "America/Mexico_City", studioName: "Estudio NUR — Reforma",
    flag: "🇲🇽", status: "upcoming", launchDate: "2026-06-01",
    description: "LatAm markets, nearshoring, Mexican economy, Andean region, Caribbean.",
    descriptionLocal: "Mercados de LatAm, nearshoring, economía mexicana, región andina, Caribe.",
    youtubeHandle: "@NURFinanzas", topics: ["BMV", "Nearshoring", "Commodities", "Banxico"],
    brandColor: "#10b981", accentColor: "#ef4444"
  },
  {
    id: "nur-africa", name: "NUR Finance Africa", nameLocal: "NUR Finance Africa",
    language: "English", secondaryLanguages: ["French", "Swahili"], region: "Sub-Saharan Africa", city: "Johannesburg",
    timezone: "Africa/Johannesburg", studioName: "Studio NUR — Sandton",
    flag: "🇿🇦", status: "upcoming", launchDate: "2026-07-01",
    description: "JSE, African commodities, mobile banking, pan-African trade, mining.",
    descriptionLocal: "JSE, African commodities, mobile banking, pan-African trade, mining.",
    youtubeHandle: "@NURFinanceAfrica", topics: ["JSE", "Mining", "Mobile Banking", "AfCFTA"],
    brandColor: "#f59e0b", accentColor: "#22c55e"
  },
  {
    id: "nur-sea", name: "NUR Finance Southeast Asia", nameLocal: "NUR Finance SEA",
    language: "English", secondaryLanguages: ["Malay", "Thai", "Vietnamese"], region: "Southeast Asia", city: "Singapore",
    timezone: "Asia/Singapore", studioName: "Studio NUR — Marina Bay",
    flag: "🇸🇬", status: "upcoming", launchDate: "2026-08-01",
    description: "SGX, ASEAN markets, supply chain, digital economy, palm oil.",
    descriptionLocal: "SGX, ASEAN markets, supply chain, digital economy, palm oil.",
    youtubeHandle: "@NURFinanceSEA", topics: ["SGX", "ASEAN", "Supply Chain", "Digital Economy"],
    brandColor: "#ec4899", accentColor: "#8b5cf6"
  },
  {
    id: "nur-russia", name: "NUR Finance Eurasia", nameLocal: "NUR Финансы Евразия",
    language: "Russian", secondaryLanguages: ["English", "Kazakh"], region: "CIS/Central Asia", city: "Almaty",
    timezone: "Asia/Almaty", studioName: "Студия NUR — Алматы",
    flag: "🇰🇿", status: "upcoming", launchDate: "2026-09-01",
    description: "CIS markets, energy sector, rare earths, Central Asian growth.",
    descriptionLocal: "Рынки СНГ, энергетика, редкоземельные металлы, рост Центральной Азии.",
    youtubeHandle: "@NURFinanceEurasia", topics: ["KASE", "Energy", "Rare Earths", "CIS"],
    brandColor: "#06b6d4", accentColor: "#f59e0b"
  },
];

// ═══════════════════════════════════════════════════════════════
// HOST ANCHORS — 2 per channel (30 total)
// All female, ~185cm, green eyes, broadcast-grade appearance
// ═══════════════════════════════════════════════════════════════

export const hosts: NURHost[] = [
  // ── NUR GLOBAL (London) ──
  {
    id: "host-victoria", channelId: "nur-global",
    firstName: "Victoria", lastName: "Ashworth", displayName: "Victoria",
    gender: "female", heightCm: 186, eyeColor: "green",
    hairColor: "platinum-blonde", hairStyle: "sleek-bob", skinTone: "fair",
    ageRange: "32-36", nationality: "British",
    languages: ["English", "French", "German"],
    education: [
      { degree: "MSc", field: "Financial Economics", institution: "London School of Economics", year: 2014 },
      { degree: "BA", field: "Philosophy, Politics and Economics", institution: "University of Oxford", year: 2012 }
    ],
    certifications: ["CFA Charterholder", "FRM"],
    previousEmployers: ["BBC World Business", "Financial Times Video"],
    specializations: ["Global macro", "Central bank policy", "Geopolitics"],
    bio: "Anchor of NUR Finance Global's flagship morning show. Former BBC World Business presenter. Covers central bank decisions, G20 summits, and macro trends with sharp analytical depth.",
    status: "active",
    imagePrompt: "Professional female news anchor, 32-36 years old, 186cm tall, green eyes, platinum blonde sleek bob haircut, fair skin, wearing tailored navy suit with emerald silk blouse, standing at modern glass news desk, financial screens behind, studio lighting, Bloomberg/Reuters broadcast quality, photorealistic"
  },
  {
    id: "host-elena", channelId: "nur-global",
    firstName: "Elena", lastName: "Marchetti", displayName: "Elena",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "auburn", hairStyle: "wavy-long", skinTone: "light",
    ageRange: "29-33", nationality: "Italian-British",
    languages: ["English", "Italian", "Spanish"],
    education: [
      { degree: "MSc", field: "Quantitative Finance", institution: "Imperial College London", year: 2017 },
      { degree: "BSc", field: "Mathematics", institution: "Università Bocconi", year: 2015 }
    ],
    certifications: ["CFA Level III", "Bloomberg Market Concepts"],
    previousEmployers: ["CNBC Europe", "Refinitiv"],
    specializations: ["Derivatives", "European equities", "Earnings analysis"],
    bio: "Evening anchor for NUR Finance Global. Known for rapid-fire earnings breakdowns and live options flow analysis during volatile sessions.",
    status: "active",
    imagePrompt: "Professional female news anchor, 29-33 years old, 184cm tall, green eyes, auburn wavy long hair, light skin, wearing charcoal blazer with white silk top, seated at curved news desk, multiple monitors showing charts, warm studio lighting, photorealistic broadcast quality"
  },

  // ── NUR US (New York) ──
  {
    id: "host-sarah", channelId: "nur-usa",
    firstName: "Sarah", lastName: "Mitchell", displayName: "Sarah",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "honey-blonde", hairStyle: "layered-long", skinTone: "light",
    ageRange: "34-38", nationality: "American",
    languages: ["English", "Mandarin"],
    education: [
      { degree: "MBA", field: "Finance", institution: "Wharton School, UPenn", year: 2013 },
      { degree: "BA", field: "Economics", institution: "Yale University", year: 2010 }
    ],
    certifications: ["CFA Charterholder", "Series 7", "Series 63"],
    previousEmployers: ["Goldman Sachs (Equity Research)", "Bloomberg TV"],
    specializations: ["US equities", "Fed policy", "Tech sector valuations"],
    bio: "Lead anchor for NUR Finance US. Former Goldman Sachs equity research analyst turned broadcaster. Brings Wall Street insider perspective to every market open.",
    status: "active",
    imagePrompt: "Professional female news anchor, 34-38 years old, 185cm tall, green eyes, honey blonde layered long hair, light skin, wearing black tailored suit with teal accent scarf, standing at Wall Street-style trading floor set, LED tickers, photorealistic CNBC broadcast quality"
  },
  {
    id: "host-maya", channelId: "nur-usa",
    firstName: "Maya", lastName: "Chen-Rivera", displayName: "Maya",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "straight-long", skinTone: "medium",
    ageRange: "30-34", nationality: "American",
    languages: ["English", "Spanish", "Mandarin"],
    education: [
      { degree: "MS", field: "Data Science", institution: "MIT", year: 2016 },
      { degree: "BS", field: "Computer Science & Economics", institution: "Stanford University", year: 2014 }
    ],
    certifications: ["CFA Level II", "AWS ML Specialty"],
    previousEmployers: ["Two Sigma (Quant)", "Yahoo Finance"],
    specializations: ["AI/tech stocks", "Quantitative analysis", "Crypto markets"],
    bio: "Technology and crypto specialist anchor. Former Two Sigma quant. Breaks down complex algorithmic trading and AI sector moves for mainstream audiences.",
    status: "active",
    imagePrompt: "Professional female news anchor, 30-34 years old, 184cm tall, green eyes, jet black straight long hair, medium skin tone, wearing modern slate grey blazer with minimalist gold necklace, tech-forward studio with holographic displays, photorealistic"
  },

  // ── NUR TURKEY (Istanbul) ──
  {
    id: "host-defne", channelId: "nur-turkey",
    firstName: "Defne", lastName: "Karataş", displayName: "Defne",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "wavy-long", skinTone: "olive",
    ageRange: "31-35", nationality: "Turkish",
    languages: ["Turkish", "English", "German"],
    education: [
      { degree: "MBA", field: "International Finance", institution: "Koç Üniversitesi", year: 2015 },
      { degree: "Lisans", field: "Ekonomi", institution: "Boğaziçi Üniversitesi", year: 2013 }
    ],
    certifications: ["CFA Charterholder", "SPK Lisansı"],
    previousEmployers: ["Bloomberg HT", "Garanti BBVA (Hazine)"],
    specializations: ["BIST analizi", "TCMB politikası", "Gelişen piyasalar"],
    bio: "NUR Finans Türkiye'nin ana yüzü. Bloomberg HT'de 5 yıl deneyim. Borsa İstanbul açılış ve kapanış saatlerinde canlı yayın sunuyor.",
    status: "active",
    imagePrompt: "Professional female news anchor, 31-35 years old, 185cm tall, green eyes, dark brown wavy long hair, olive skin, wearing elegant burgundy blazer with cream silk blouse, modern Istanbul skyline visible through studio window, Bosphorus view, photorealistic Turkish broadcast quality"
  },
  {
    id: "host-zeynep", channelId: "nur-turkey",
    firstName: "Zeynep", lastName: "Aydın", displayName: "Zeynep",
    gender: "female", heightCm: 186, eyeColor: "green",
    hairColor: "chestnut", hairStyle: "shoulder-length", skinTone: "light",
    ageRange: "28-32", nationality: "Turkish",
    languages: ["Turkish", "English", "Arabic"],
    education: [
      { degree: "Yüksek Lisans", field: "Finans Mühendisliği", institution: "Sabancı Üniversitesi", year: 2018 },
      { degree: "Lisans", field: "İşletme", institution: "ODTÜ", year: 2016 }
    ],
    certifications: ["CFA Level III", "SPK İleri Düzey"],
    previousEmployers: ["CNBC-e", "İş Yatırım"],
    specializations: ["Teknik analiz", "Döviz piyasaları", "Emtia"],
    bio: "Akşam yayınları sunucusu. Teknik analiz ve döviz piyasalarında uzman. Yatırımcılara pratik stratejiler sunuyor.",
    status: "active",
    imagePrompt: "Professional female news anchor, 28-32 years old, 186cm tall, green eyes, chestnut shoulder-length hair, light skin, wearing deep navy blazer with gold button details, seated at sleek news desk with Turkish market data screens, warm lighting, photorealistic"
  },

  // ── NUR ARABIC (Dubai) ──
  {
    id: "host-fatima", channelId: "nur-arabic",
    firstName: "Fatima", lastName: "Al-Qahtani", displayName: "Fatima",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "midnight-black", hairStyle: "hijab", skinTone: "tan",
    ageRange: "33-37", nationality: "Emirati",
    languages: ["Arabic", "English", "French"],
    education: [
      { degree: "MBA", field: "Islamic Finance", institution: "London Business School", year: 2014 },
      { degree: "BSc", field: "Finance", institution: "American University of Sharjah", year: 2011 }
    ],
    certifications: ["CAIA", "Certified Islamic Finance Professional"],
    previousEmployers: ["Al Arabiya Business", "Abu Dhabi Investment Authority"],
    specializations: ["Islamic finance", "Sovereign wealth", "GCC equities"],
    bio: "Lead anchor for NUR Finance Arabia. Brings deep expertise in Islamic finance structures and GCC sovereign wealth strategy. Former ADIA analyst.",
    status: "active",
    imagePrompt: "Professional female news anchor, 33-37 years old, 185cm tall, green eyes, wearing elegant emerald hijab with matching blazer over ivory blouse, tan skin, Dubai Financial Centre studio with city skyline, gold accent lighting, Al Arabiya broadcast quality, photorealistic"
  },
  {
    id: "host-nadia", channelId: "nur-arabic",
    firstName: "Nadia", lastName: "Haddad", displayName: "Nadia",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "low-bun", skinTone: "olive",
    ageRange: "30-34", nationality: "Lebanese-Emirati",
    languages: ["Arabic", "English", "French", "Turkish"],
    education: [
      { degree: "MSc", field: "Financial Engineering", institution: "HEC Paris", year: 2016 },
      { degree: "BE", field: "Computer Engineering", institution: "American University of Beirut", year: 2014 }
    ],
    certifications: ["CFA Charterholder", "FRM"],
    previousEmployers: ["CNBC Arabia", "Emirates NBD (Quant)"],
    specializations: ["Oil markets", "MENA tech sector", "Cross-border M&A"],
    bio: "Evening anchor specializing in energy markets and MENA technology sector. Fluent in four languages, enabling cross-regional market analysis.",
    status: "active",
    imagePrompt: "Professional female news anchor, 30-34 years old, 184cm tall, green eyes, dark brown hair in elegant low bun, olive skin, wearing sophisticated black blazer with emerald accent, modern Arabic-English bilingual studio, photorealistic"
  },

  // ── NUR DEUTSCH (Frankfurt) ──
  {
    id: "host-katharina", channelId: "nur-deutsch",
    firstName: "Katharina", lastName: "Vogt", displayName: "Katharina",
    gender: "female", heightCm: 186, eyeColor: "green",
    hairColor: "ash-brown", hairStyle: "french-twist", skinTone: "fair",
    ageRange: "35-39", nationality: "German",
    languages: ["German", "English", "French"],
    education: [
      { degree: "Dr. rer. pol.", field: "Volkswirtschaftslehre", institution: "Universität Mannheim", year: 2013 },
      { degree: "Diplom", field: "Betriebswirtschaftslehre", institution: "Frankfurt School of Finance", year: 2009 }
    ],
    certifications: ["CFA Charterholder", "CIIA"],
    previousEmployers: ["n-tv Börse", "Deutsche Bundesbank (Research)"],
    specializations: ["EZB-Politik", "Anleihemärkte", "DAX-Analyse"],
    bio: "Chefmoderatorin von NUR Finanzen. Ehemalige Bundesbank-Forscherin und n-tv Börsenmoderatorin. Doktorat in Volkswirtschaftslehre.",
    status: "active",
    imagePrompt: "Professional female news anchor, 35-39 years old, 186cm tall, green eyes, ash brown hair in elegant French twist, fair skin, wearing structured dark grey blazer with pearl earrings, Frankfurt Bankenviertel studio, ECB building visible, Deutsche Börse screens, photorealistic"
  },
  {
    id: "host-lena", channelId: "nur-deutsch",
    firstName: "Lena", lastName: "Schwarz", displayName: "Lena",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "golden-brown", hairStyle: "layered-long", skinTone: "light",
    ageRange: "29-33", nationality: "Austrian-German",
    languages: ["German", "English", "Italian"],
    education: [
      { degree: "MSc", field: "Quantitative Finance", institution: "WU Wien", year: 2017 },
      { degree: "BSc", field: "Mathematik", institution: "ETH Zürich", year: 2015 }
    ],
    certifications: ["FRM", "Bloomberg Market Concepts"],
    previousEmployers: ["Handelsblatt TV", "Allianz Global Investors"],
    specializations: ["Industrieaktien", "ESG-Investments", "DACH-Märkte"],
    bio: "Abendmoderatorin bei NUR Finanzen. Quantitative Analystin mit ETH-Hintergrund. Spezialisiert auf europäische Industrieaktien und ESG.",
    status: "active",
    imagePrompt: "Professional female news anchor, 29-33 years old, 185cm tall, green eyes, golden brown layered long hair, light skin, wearing navy blazer with subtle green pocket square, modern Frankfurt studio with DAX chart wall, photorealistic German broadcast quality"
  },

  // ── NUR FRANCE (Paris) ──
  {
    id: "host-eloise", channelId: "nur-france",
    firstName: "Éloïse", lastName: "Dupont", displayName: "Éloïse",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "walnut", hairStyle: "chignon", skinTone: "fair",
    ageRange: "33-37", nationality: "French",
    languages: ["French", "English", "Arabic"],
    education: [
      { degree: "Doctorat", field: "Économie Financière", institution: "Sciences Po Paris", year: 2014 },
      { degree: "Master", field: "Finance de Marché", institution: "HEC Paris", year: 2011 }
    ],
    certifications: ["CFA Charterholder", "AMF Certification"],
    previousEmployers: ["BFM Business", "Société Générale CIB"],
    specializations: ["CAC 40", "Luxe & LVMH", "Politique monétaire BCE"],
    bio: "Présentatrice principale de NUR Finance France. Docteur en économie financière de Sciences Po. Experte reconnue du secteur du luxe européen.",
    status: "active",
    imagePrompt: "Professional female news anchor, 33-37 years old, 185cm tall, green eyes, walnut hair in elegant chignon, fair skin, wearing sophisticated midnight blue blazer with silk foulard, La Défense studio with CAC 40 displays, Parisian elegance, photorealistic"
  },
  {
    id: "host-camille", channelId: "nur-france",
    firstName: "Camille", lastName: "Renaud", displayName: "Camille",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "copper-red", hairStyle: "side-part-long", skinTone: "fair",
    ageRange: "28-32", nationality: "French-Canadian",
    languages: ["French", "English", "Spanish"],
    education: [
      { degree: "MSc", field: "Data Science & Finance", institution: "École Polytechnique", year: 2018 },
      { degree: "BSc", field: "Mathematics", institution: "McGill University", year: 2016 }
    ],
    certifications: ["CFA Level III", "Python for Finance (Certificat)"],
    previousEmployers: ["France 24 Business", "AXA Investment Managers"],
    specializations: ["Quantitative", "Fintech", "Afrique francophone"],
    bio: "Présentatrice du soir. Franco-canadienne spécialisée dans la fintech et les marchés francophones africains.",
    status: "active",
    imagePrompt: "Professional female news anchor, 28-32 years old, 184cm tall, green eyes, copper red side-part long hair, fair skin, wearing elegant charcoal blazer with emerald accent, modern Paris studio, photorealistic France 24 broadcast quality"
  },

  // ── NUR JAPAN (Tokyo) ──
  {
    id: "host-misaki", channelId: "nur-japan",
    firstName: "美咲", lastName: "田中", displayName: "美咲",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "raven", hairStyle: "straight-long", skinTone: "light",
    ageRange: "31-35", nationality: "Japanese",
    languages: ["Japanese", "English", "Korean"],
    education: [
      { degree: "MBA", field: "Finance", institution: "Keio Business School", year: 2015 },
      { degree: "BA", field: "Economics", institution: "University of Tokyo", year: 2013 }
    ],
    certifications: ["CMA (日本証券アナリスト)", "CFA Level III"],
    previousEmployers: ["Nikkei CNBC", "Nomura Securities"],
    specializations: ["日経分析", "半導体セクター", "日銀政策"],
    bio: "NURファイナンス・ジャパンのメインキャスター。野村證券の元アナリスト。東京市場の朝の顔として信頼を集める。",
    status: "active",
    imagePrompt: "Professional female news anchor, 31-35 years old, 184cm tall, green eyes, raven black straight long hair, light skin, wearing refined dark navy suit with jade accent brooch, Tokyo Marunouchi studio, Nikkei data screens, NHK broadcast quality, photorealistic"
  },
  {
    id: "host-haruka", channelId: "nur-japan",
    firstName: "遥", lastName: "佐藤", displayName: "遥",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "espresso", hairStyle: "shoulder-length", skinTone: "light",
    ageRange: "28-32", nationality: "Japanese",
    languages: ["Japanese", "English", "Mandarin"],
    education: [
      { degree: "MSc", field: "Financial Engineering", institution: "Columbia University", year: 2018 },
      { degree: "BSc", field: "Mathematics", institution: "Kyoto University", year: 2016 }
    ],
    certifications: ["CFA Charterholder", "FRM"],
    previousEmployers: ["テレビ東京 Newsモーニングサテライト", "JPMorgan (Quant)"],
    specializations: ["デリバティブ", "為替市場", "AI・ロボティクス"],
    bio: "夕方のキャスター。コロンビア大学で金融工学を学び、JPモルガンのクオンツチームを経て放送界へ。",
    status: "active",
    imagePrompt: "Professional female news anchor, 28-32 years old, 185cm tall, green eyes, espresso shoulder-length hair, light skin, wearing modern dark blazer with subtle green silk scarf, Tokyo studio with real-time derivatives data, photorealistic"
  },

  // ── NUR CHINA (Shanghai) ──
  {
    id: "host-mingyu", channelId: "nur-china",
    firstName: "明玉", lastName: "李", displayName: "明玉",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "sleek-bob", skinTone: "light",
    ageRange: "32-36", nationality: "Chinese",
    languages: ["Mandarin", "Cantonese", "English"],
    education: [
      { degree: "博士", field: "金融学", institution: "清华大学", year: 2014 },
      { degree: "学士", field: "经济学", institution: "北京大学", year: 2010 }
    ],
    certifications: ["CFA Charterholder", "中国证券从业资格"],
    previousEmployers: ["第一财经", "中金公司"],
    specializations: ["A股分析", "央行政策", "科创板"],
    bio: "光辉金融首席主播。清华大学金融学博士。前中金公司分析师，第一财经知名主持人。",
    status: "active",
    imagePrompt: "Professional female news anchor, 32-36 years old, 185cm tall, green eyes, jet black sleek bob, light skin, wearing elegant red-accent dark suit, Shanghai Lujiazui studio with Oriental Pearl Tower visible, CCTV broadcast quality, photorealistic"
  },
  {
    id: "host-yuhan", channelId: "nur-china",
    firstName: "雨涵", lastName: "张", displayName: "雨涵",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "layered-long", skinTone: "light",
    ageRange: "29-33", nationality: "Chinese",
    languages: ["Mandarin", "English", "Japanese"],
    education: [
      { degree: "MSc", field: "Financial Mathematics", institution: "LSE", year: 2017 },
      { degree: "BSc", field: "Statistics", institution: "Fudan University", year: 2015 }
    ],
    certifications: ["CFA Level III", "FRM"],
    previousEmployers: ["凤凰卫视财经", "高盛 (亚太研究)"],
    specializations: ["港股", "科技股", "中美关系"],
    bio: "晚间主播。伦敦政经学院毕业，高盛亚太研究部出身。港股和科技股分析专家。",
    status: "active",
    imagePrompt: "Professional female news anchor, 29-33 years old, 184cm tall, green eyes, dark brown layered long hair, light skin, wearing refined charcoal blazer with jade pendant, Shanghai financial district studio, photorealistic"
  },

  // ── NUR KOREA (Seoul) ──
  {
    id: "host-soyeon", channelId: "nur-korea",
    firstName: "소연", lastName: "김", displayName: "소연",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "midnight-black", hairStyle: "straight-long", skinTone: "light",
    ageRange: "30-34", nationality: "South Korean",
    languages: ["Korean", "English", "Japanese"],
    education: [
      { degree: "MBA", field: "Finance", institution: "KAIST", year: 2016 },
      { degree: "BSc", field: "Economics", institution: "Seoul National University", year: 2014 }
    ],
    certifications: ["CFA Charterholder", "한국투자분석사"],
    previousEmployers: ["SBS Biz", "삼성증권"],
    specializations: ["코스피", "반도체 산업", "암호화폐"],
    bio: "NUR 파이낸스 코리아 메인 앵커. 삼성증권 출신, SBS Biz 전 앵커. 반도체 산업 분석의 최고 전문가.",
    status: "active",
    imagePrompt: "Professional female news anchor, 30-34 years old, 185cm tall, green eyes, midnight black straight long hair, light skin, wearing elegant dark navy blazer with silver accent, Seoul Yeouido studio with KOSPI charts, Korean broadcast quality, photorealistic"
  },
  {
    id: "host-jiwon", channelId: "nur-korea",
    firstName: "지원", lastName: "박", displayName: "지원",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "wavy-long", skinTone: "light",
    ageRange: "27-31", nationality: "South Korean",
    languages: ["Korean", "English", "Mandarin"],
    education: [
      { degree: "MSc", field: "Data Science", institution: "POSTECH", year: 2019 },
      { degree: "BSc", field: "Computer Science", institution: "Yonsei University", year: 2017 }
    ],
    certifications: ["CFA Level II", "Google Cloud ML"],
    previousEmployers: ["한국경제TV", "카카오 (AI Lab)"],
    specializations: ["AI·테크", "스타트업", "디지털 자산"],
    bio: "저녁 앵커. 카카오 AI Lab 출신의 기술 전문 앵커. 스타트업 생태계와 디지털 자산 분석.",
    status: "active",
    imagePrompt: "Professional female news anchor, 27-31 years old, 184cm tall, green eyes, dark brown wavy long hair, light skin, wearing modern tech-forward blazer, Seoul studio with crypto and AI data displays, photorealistic"
  },

  // ── NUR INDIA (Mumbai) ──
  {
    id: "host-ananya", channelId: "nur-india",
    firstName: "Ananya", lastName: "Sharma", displayName: "Ananya",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "layered-long", skinTone: "medium",
    ageRange: "32-36", nationality: "Indian",
    languages: ["English", "Hindi", "Marathi"],
    education: [
      { degree: "MBA", field: "Finance", institution: "IIM Ahmedabad", year: 2014 },
      { degree: "BTech", field: "Computer Science", institution: "IIT Bombay", year: 2012 }
    ],
    certifications: ["CFA Charterholder", "NISM Series"],
    previousEmployers: ["CNBC-TV18", "Morgan Stanley (Mumbai)"],
    specializations: ["Indian equities", "RBI policy", "IT sector"],
    bio: "Lead anchor for NUR Finance India. IIT Bombay and IIM Ahmedabad alumna. Former Morgan Stanley analyst and CNBC-TV18 anchor. The voice of Indian markets.",
    status: "active",
    imagePrompt: "Professional female news anchor, 32-36 years old, 185cm tall, green eyes, jet black layered long hair, medium skin tone, wearing elegant dark blazer with gold-thread accent, Mumbai BKC studio with NSE Nifty displays, photorealistic ET Now broadcast quality"
  },
  {
    id: "host-priya", channelId: "nur-india",
    firstName: "Priya", lastName: "Iyer", displayName: "Priya",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "wavy-long", skinTone: "brown",
    ageRange: "29-33", nationality: "Indian",
    languages: ["English", "Hindi", "Tamil"],
    education: [
      { degree: "MSc", field: "Quantitative Economics", institution: "Indian Statistical Institute", year: 2017 },
      { degree: "BA", field: "Economics (Honours)", institution: "St. Stephen's College, Delhi", year: 2015 }
    ],
    certifications: ["CFA Level III", "FRM"],
    previousEmployers: ["NDTV Profit", "Goldman Sachs (Mumbai)"],
    specializations: ["Banking sector", "Startup ecosystem", "Demographics"],
    bio: "Evening anchor. Former Goldman Sachs Mumbai team. Expert on India's banking transformation and startup ecosystem.",
    status: "active",
    imagePrompt: "Professional female news anchor, 29-33 years old, 184cm tall, green eyes, dark brown wavy long hair, brown skin, wearing refined blazer with emerald silk, Mumbai studio with Sensex charts, warm golden lighting, photorealistic"
  },

  // ── NUR BRAZIL (São Paulo) ──
  {
    id: "host-isabella", channelId: "nur-brazil",
    firstName: "Isabella", lastName: "Santos", displayName: "Isabella",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "mahogany", hairStyle: "wavy-long", skinTone: "tan",
    ageRange: "31-35", nationality: "Brazilian",
    languages: ["Portuguese", "English", "Spanish"],
    education: [
      { degree: "MBA", field: "Finanças", institution: "Insper", year: 2015 },
      { degree: "Bacharelado", field: "Economia", institution: "USP", year: 2013 }
    ],
    certifications: ["CFA Charterholder", "CGA (Anbima)"],
    previousEmployers: ["InfoMoney/XP", "Itaú BBA"],
    specializations: ["Ibovespa", "Commodities", "Agronegócio"],
    bio: "Âncora principal da NUR Finanças Brasil. Ex-analista do Itaú BBA. Referência em commodities e agronegócio brasileiro.",
    status: "active",
    imagePrompt: "Professional female news anchor, 31-35 years old, 185cm tall, green eyes, mahogany wavy long hair, tan skin, wearing elegant dark blazer with green and gold accent, São Paulo Faria Lima studio with Ibovespa data, photorealistic Brazilian broadcast quality"
  },
  {
    id: "host-carolina", channelId: "nur-brazil",
    firstName: "Carolina", lastName: "Ferreira", displayName: "Carolina",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "toffee", hairStyle: "layered-long", skinTone: "medium",
    ageRange: "28-32", nationality: "Brazilian",
    languages: ["Portuguese", "English", "French"],
    education: [
      { degree: "MSc", field: "Engenharia Financeira", institution: "FGV", year: 2018 },
      { degree: "BSc", field: "Matemática Aplicada", institution: "Unicamp", year: 2016 }
    ],
    certifications: ["CFA Level III", "CEA (Anbima)"],
    previousEmployers: ["GloboNews Economia", "BTG Pactual"],
    specializations: ["Selic", "Câmbio", "Mercados emergentes"],
    bio: "Âncora noturna. Ex-BTG Pactual. Especialista em política monetária e mercados emergentes da América Latina.",
    status: "active",
    imagePrompt: "Professional female news anchor, 28-32 years old, 184cm tall, green eyes, toffee layered long hair, medium skin, wearing charcoal blazer with emerald accent, São Paulo studio, photorealistic"
  },

  // ── NUR LATAM (Mexico City) ──
  {
    id: "host-valentina", channelId: "nur-latam",
    firstName: "Valentina", lastName: "Morales", displayName: "Valentina",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "straight-long", skinTone: "olive",
    ageRange: "32-36", nationality: "Mexican",
    languages: ["Spanish", "English", "Portuguese"],
    education: [
      { degree: "MBA", field: "Finanzas", institution: "ITAM", year: 2014 },
      { degree: "Licenciatura", field: "Economía", institution: "UNAM", year: 2012 }
    ],
    certifications: ["CFA Charterholder"],
    previousEmployers: ["El Financiero Bloomberg", "BBVA México"],
    specializations: ["BMV", "Nearshoring", "Banxico"],
    bio: "Presentadora principal de NUR Finanzas. Experta en nearshoring y economía mexicana. Voz de referencia en mercados latinoamericanos.",
    status: "active",
    imagePrompt: "Professional female news anchor, 32-36, 185cm, green eyes, dark brown straight long hair, olive skin, elegant blazer, Mexico City Reforma studio, photorealistic"
  },
  {
    id: "host-lucia", channelId: "nur-latam",
    firstName: "Lucía", lastName: "Vargas", displayName: "Lucía",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "honey-blonde", hairStyle: "wavy-long", skinTone: "light",
    ageRange: "29-33", nationality: "Colombian-Mexican",
    languages: ["Spanish", "English", "Portuguese"],
    education: [
      { degree: "MSc", field: "Finance", institution: "Universidad de los Andes", year: 2017 },
      { degree: "BSc", field: "Industrial Engineering", institution: "Universidad Nacional de Colombia", year: 2015 }
    ],
    certifications: ["CFA Level III", "FRM"],
    previousEmployers: ["Bloomberg Línea", "Bancolombia"],
    specializations: ["Andean markets", "Mining", "LatAm fintech"],
    bio: "Presentadora vespertina. Colombo-mexicana. Especialista en mercados andinos y sector minero latinoamericano.",
    status: "active",
    imagePrompt: "Professional female anchor, 29-33, 184cm, green eyes, honey blonde wavy hair, light skin, modern LatAm studio, photorealistic"
  },

  // ── NUR AFRICA (Johannesburg) ──
  {
    id: "host-amara", channelId: "nur-africa",
    firstName: "Amara", lastName: "Okafor", displayName: "Amara",
    gender: "female", heightCm: 186, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "low-bun", skinTone: "deep",
    ageRange: "33-37", nationality: "Nigerian-South African",
    languages: ["English", "Yoruba", "French"],
    education: [
      { degree: "MBA", field: "Finance", institution: "University of Cape Town GSB", year: 2014 },
      { degree: "BSc", field: "Economics", institution: "University of Lagos", year: 2011 }
    ],
    certifications: ["CFA Charterholder", "SAIFM"],
    previousEmployers: ["CNBC Africa", "Standard Bank (CIB)"],
    specializations: ["JSE", "Pan-African trade", "Mobile banking", "Mining"],
    bio: "Lead anchor for NUR Finance Africa. Born in Lagos, based in Johannesburg. Former Standard Bank CIB analyst. The face of African financial markets.",
    status: "active",
    imagePrompt: "Professional female news anchor, 33-37, 186cm, green eyes, jet black hair in elegant low bun, deep skin tone, wearing tailored dark blazer with gold African-inspired accent, Sandton studio with JSE data, photorealistic"
  },
  {
    id: "host-zuri", channelId: "nur-africa",
    firstName: "Zuri", lastName: "Mwangi", displayName: "Zuri",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "shoulder-length", skinTone: "brown",
    ageRange: "28-32", nationality: "Kenyan-South African",
    languages: ["English", "Swahili", "French"],
    education: [
      { degree: "MSc", field: "Development Finance", institution: "University of Stellenbosch", year: 2018 },
      { degree: "BSc", field: "Actuarial Science", institution: "University of Nairobi", year: 2016 }
    ],
    certifications: ["CFA Level III", "FASSA"],
    previousEmployers: ["Bloomberg Africa", "M-Pesa (Safaricom)"],
    specializations: ["Fintech", "East African markets", "AfCFTA"],
    bio: "Evening anchor. Former M-Pesa strategist. Expert on African fintech revolution and East African market integration.",
    status: "active",
    imagePrompt: "Professional female anchor, 28-32, 185cm, green eyes, dark brown shoulder-length hair, brown skin, modern Johannesburg studio, photorealistic"
  },

  // ── NUR SEA (Singapore) ──
  {
    id: "host-mei", channelId: "nur-sea",
    firstName: "Mei", lastName: "Tan", displayName: "Mei",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "straight-long", skinTone: "light",
    ageRange: "31-35", nationality: "Singaporean",
    languages: ["English", "Mandarin", "Malay"],
    education: [
      { degree: "MBA", field: "Finance", institution: "INSEAD Singapore", year: 2015 },
      { degree: "BSc", field: "Economics", institution: "NUS", year: 2013 }
    ],
    certifications: ["CFA Charterholder", "CMFAS"],
    previousEmployers: ["Channel NewsAsia Business", "GIC"],
    specializations: ["SGX", "ASEAN integration", "Supply chain"],
    bio: "Lead anchor for NUR Finance SEA. Former GIC sovereign wealth analyst. Deep expertise in ASEAN economic integration.",
    status: "active",
    imagePrompt: "Professional female anchor, 31-35, 184cm, green eyes, jet black straight hair, light skin, Marina Bay studio with Singapore skyline, photorealistic CNA broadcast quality"
  },
  {
    id: "host-linh", channelId: "nur-sea",
    firstName: "Linh", lastName: "Nguyen", displayName: "Linh",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "dark-brown", hairStyle: "side-part-long", skinTone: "light",
    ageRange: "28-32", nationality: "Vietnamese-Singaporean",
    languages: ["English", "Vietnamese", "Thai"],
    education: [
      { degree: "MSc", field: "Applied Finance", institution: "SMU", year: 2018 },
      { degree: "BSc", field: "Finance", institution: "National Economics University, Hanoi", year: 2016 }
    ],
    certifications: ["CFA Level III", "FRM"],
    previousEmployers: ["Bloomberg SEA", "Temasek Holdings"],
    specializations: ["Vietnam growth story", "Digital economy", "Palm oil"],
    bio: "Evening anchor. Vietnamese-Singaporean with deep Southeast Asian market insight. Former Temasek analyst.",
    status: "active",
    imagePrompt: "Professional female anchor, 28-32, 185cm, green eyes, dark brown side-part long hair, light skin, Singapore studio, photorealistic"
  },

  // ── NUR EURASIA (Almaty) ──
  {
    id: "host-aisha", channelId: "nur-russia",
    firstName: "Аиша", lastName: "Нурланова", displayName: "Аиша",
    gender: "female", heightCm: 185, eyeColor: "green",
    hairColor: "jet-black", hairStyle: "wavy-long", skinTone: "medium",
    ageRange: "30-34", nationality: "Kazakh",
    languages: ["Russian", "Kazakh", "English", "Turkish"],
    education: [
      { degree: "MBA", field: "Finance", institution: "Nazarbayev University", year: 2016 },
      { degree: "BSc", field: "Economics", institution: "KIMEP University", year: 2014 }
    ],
    certifications: ["CFA Charterholder"],
    previousEmployers: ["Khabar TV Business", "Samruk-Kazyna"],
    specializations: ["KASE", "Energy sector", "Central Asian growth"],
    bio: "Ведущая NUR Финансы Евразия. Бывший аналитик Самрук-Қазына. Эксперт по энергетике и рынкам Центральной Азии.",
    status: "active",
    imagePrompt: "Professional female anchor, 30-34, 185cm, green eyes, jet black wavy hair, medium skin, Almaty studio with Tian Shan mountains visible, photorealistic"
  },
  {
    id: "host-diana", channelId: "nur-russia",
    firstName: "Диана", lastName: "Петрова", displayName: "Диана",
    gender: "female", heightCm: 184, eyeColor: "green",
    hairColor: "ash-brown", hairStyle: "layered-long", skinTone: "fair",
    ageRange: "29-33", nationality: "Kazakh-Russian",
    languages: ["Russian", "English", "German"],
    education: [
      { degree: "MSc", field: "Financial Economics", institution: "HSE Moscow", year: 2017 },
      { degree: "BSc", field: "Applied Mathematics", institution: "Novosibirsk State University", year: 2015 }
    ],
    certifications: ["CFA Level III", "FRM"],
    previousEmployers: ["РБК ТВ", "Сбербанк CIB"],
    specializations: ["CIS markets", "Rare earths", "Sanctions economics"],
    bio: "Вечерняя ведущая. Бывший аналитик Сбербанк CIB. Специалист по рынкам СНГ и санкционной экономике.",
    status: "active",
    imagePrompt: "Professional female anchor, 29-33, 184cm, green eyes, ash brown layered hair, fair skin, modern Almaty studio, photorealistic"
  },
];

// ═══════════════════════════════════════════════════════════════
// RECURRING GUEST EXPERTS — Professors, Doctors, Analysts
// Short first names, somewhat anonymous, 20-30 min segments
// ═══════════════════════════════════════════════════════════════

export const guests: NURGuest[] = [
  // ── GLOBAL GUESTS (appear across channels) ──
  {
    id: "guest-jim", channelIds: ["nur-global", "nur-usa"],
    firstName: "Jim", lastName: "H.", displayName: "Prof. Jim",
    title: "Prof. Dr.", gender: "male", ageRange: "62-68", nationality: "American",
    languages: ["English"],
    education: [
      { degree: "PhD", field: "Monetary Economics", institution: "University of Chicago", year: 1988 },
      { degree: "MA", field: "Economics", institution: "Princeton University", year: 1984 }
    ],
    currentPosition: "Professor Emeritus of Economics",
    institution: "Independent Research Fellow",
    specializations: ["Central bank policy", "Inflation dynamics", "Bond markets"],
    publications: 147,
    typicalSegmentMinutes: 25,
    bio: "Former Fed advisor. 35+ years analyzing monetary policy. Appears weekly to dissect central bank decisions and their market implications.",
    imagePrompt: "Distinguished older male professor, 62-68, silver hair, glasses, tweed jacket with elbow patches, warm office with bookshelves, academic but approachable, photorealistic"
  },
  {
    id: "guest-rob", channelIds: ["nur-global", "nur-usa", "nur-deutsch"],
    firstName: "Rob", lastName: "K.", displayName: "Dr. Rob",
    title: "Dr.", gender: "male", ageRange: "55-61", nationality: "British",
    languages: ["English", "German"],
    education: [
      { degree: "DPhil", field: "Financial Economics", institution: "University of Oxford", year: 1995 },
      { degree: "MSc", field: "Economics", institution: "LSE", year: 1991 }
    ],
    currentPosition: "Senior Research Fellow",
    institution: "Independent Economic Advisory",
    specializations: ["Geopolitics & markets", "Commodities", "Sanctions impact"],
    publications: 89,
    typicalSegmentMinutes: 20,
    bio: "Geopolitical risk specialist. Maps global conflict and policy shifts to commodity and equity market moves. Oxford DPhil.",
    imagePrompt: "Professional older male, 55-61, salt-and-pepper hair, clean-shaven, dark suit, speaking from modern home office with world map, photorealistic"
  },
  {
    id: "guest-hans", channelIds: ["nur-deutsch", "nur-global"],
    firstName: "Hans", lastName: "M.", displayName: "Prof. Hans",
    title: "Prof. Dr.", gender: "male", ageRange: "64-70", nationality: "German",
    languages: ["German", "English"],
    education: [
      { degree: "Dr. rer. pol.", field: "Volkswirtschaftslehre", institution: "Universität Bonn", year: 1986 },
      { degree: "Habilitation", field: "Geldtheorie", institution: "LMU München", year: 1992 }
    ],
    currentPosition: "Professor Emeritus",
    institution: "Independent Monetary Research",
    specializations: ["EZB-Politik", "Eurozone-Krise", "Geldpolitik"],
    publications: 212,
    typicalSegmentMinutes: 25,
    bio: "Ehemaliger Berater der Bundesbank. Führender Experte für EZB-Politik und Eurozone-Stabilität. Habilitiert an der LMU.",
    imagePrompt: "Distinguished German professor, 64-70, white hair, round glasses, formal dark suit, academic setting, photorealistic"
  },
  {
    id: "guest-yuki", channelIds: ["nur-japan", "nur-china"],
    firstName: "裕紀", lastName: "W.", displayName: "渡辺教授",
    title: "教授", gender: "male", ageRange: "58-64", nationality: "Japanese",
    languages: ["Japanese", "English", "Mandarin"],
    education: [
      { degree: "PhD", field: "Economics", institution: "MIT", year: 1992 },
      { degree: "BA", field: "Economics", institution: "University of Tokyo", year: 1988 }
    ],
    currentPosition: "名誉教授",
    institution: "Independent Asian Markets Research",
    specializations: ["日銀政策", "円相場", "アジア経済統合"],
    publications: 134,
    typicalSegmentMinutes: 20,
    bio: "MIT博士。元日銀政策委員会アドバイザー。アジア経済統合の第一人者。",
    imagePrompt: "Distinguished Japanese professor, 58-64, silver-streaked hair, thin-frame glasses, dark suit, academic library setting, photorealistic"
  },
  {
    id: "guest-ali", channelIds: ["nur-arabic", "nur-turkey"],
    firstName: "Ali", lastName: "R.", displayName: "Dr. Ali",
    title: "Dr.", gender: "male", ageRange: "52-58", nationality: "Emirati",
    languages: ["Arabic", "English", "Urdu"],
    education: [
      { degree: "PhD", field: "Islamic Finance", institution: "Durham University", year: 2000 },
      { degree: "MSc", field: "Banking", institution: "Cass Business School", year: 1996 }
    ],
    currentPosition: "Senior Advisor",
    institution: "Independent Islamic Finance Advisory",
    specializations: ["Islamic finance structures", "Sukuk markets", "Shariah compliance"],
    publications: 78,
    typicalSegmentMinutes: 25,
    bio: "Leading authority on Islamic finance. Advises sovereign wealth funds on Shariah-compliant investment structures. Regular segment on sukuk market developments.",
    imagePrompt: "Distinguished Middle Eastern man, 52-58, well-groomed grey beard, traditional white kandura or dark suit, professional setting, photorealistic"
  },
  {
    id: "guest-mei-prof", channelIds: ["nur-china", "nur-korea"],
    firstName: "梅", lastName: "C.", displayName: "陈教授",
    title: "教授", gender: "female", ageRange: "56-62", nationality: "Chinese",
    languages: ["Mandarin", "English", "Korean"],
    education: [
      { degree: "PhD", field: "Finance", institution: "Wharton School", year: 1994 },
      { degree: "BSc", field: "Mathematics", institution: "Peking University", year: 1990 }
    ],
    currentPosition: "Distinguished Professor",
    institution: "Independent Financial Research",
    specializations: ["中国资本市场改革", "人民币国际化", "亚洲金融一体化"],
    publications: 168,
    typicalSegmentMinutes: 25,
    bio: "沃顿商学院博士。中国资本市场改革和人民币国际化研究的权威学者。",
    imagePrompt: "Distinguished Chinese female professor, 56-62, elegant grey-streaked hair, professional attire, academic office setting, photorealistic"
  },
  {
    id: "guest-raj", channelIds: ["nur-india", "nur-global"],
    firstName: "Raj", lastName: "P.", displayName: "Prof. Raj",
    title: "Prof.", gender: "male", ageRange: "60-66", nationality: "Indian",
    languages: ["English", "Hindi", "Tamil"],
    education: [
      { degree: "PhD", field: "Development Economics", institution: "Cambridge University", year: 1990 },
      { degree: "MA", field: "Economics", institution: "JNU", year: 1986 }
    ],
    currentPosition: "Distinguished Fellow",
    institution: "Independent Economic Policy Research",
    specializations: ["Indian economic reform", "Demographics dividend", "RBI policy"],
    publications: 156,
    typicalSegmentMinutes: 25,
    bio: "Cambridge PhD. Former RBI advisory council member. India's leading voice on demographic dividend and structural economic reform.",
    imagePrompt: "Distinguished Indian professor, 60-66, grey hair, rimless glasses, dark blazer, warm academic setting, photorealistic"
  },
  {
    id: "guest-carlos", channelIds: ["nur-brazil", "nur-latam"],
    firstName: "Carlos", lastName: "M.", displayName: "Prof. Carlos",
    title: "Prof. Dr.", gender: "male", ageRange: "57-63", nationality: "Brazilian",
    languages: ["Portuguese", "Spanish", "English"],
    education: [
      { degree: "PhD", field: "Economics", institution: "MIT", year: 1993 },
      { degree: "MSc", field: "Economia", institution: "PUC-Rio", year: 1989 }
    ],
    currentPosition: "Professor Titular",
    institution: "Independent LatAm Research",
    specializations: ["Selic & monetary policy", "LatAm integration", "Commodities cycles"],
    publications: 121,
    typicalSegmentMinutes: 25,
    bio: "MIT PhD. Former Banco Central do Brasil advisor. Leading expert on LatAm monetary policy and commodity super-cycles.",
    imagePrompt: "Distinguished Brazilian professor, 57-63, salt-and-pepper hair, reading glasses, formal suit, São Paulo office, photorealistic"
  },
  {
    id: "guest-kwame", channelIds: ["nur-africa"],
    firstName: "Kwame", lastName: "A.", displayName: "Prof. Kwame",
    title: "Prof.", gender: "male", ageRange: "55-61", nationality: "Ghanaian-South African",
    languages: ["English", "French", "Twi"],
    education: [
      { degree: "PhD", field: "Development Finance", institution: "SOAS, University of London", year: 1998 },
      { degree: "MSc", field: "Economics", institution: "University of Ghana", year: 1994 }
    ],
    currentPosition: "Senior Research Professor",
    institution: "Independent African Development Research",
    specializations: ["AfCFTA", "African fintech", "Resource economics"],
    publications: 93,
    typicalSegmentMinutes: 20,
    bio: "SOAS PhD. Expert on African Continental Free Trade Area and resource economics. Regular commentator on pan-African market development.",
    imagePrompt: "Distinguished Ghanaian professor, 55-61, close-cropped grey hair, glasses, dark suit with kente accent pocket square, professional setting, photorealistic"
  },
  {
    id: "guest-osman", channelIds: ["nur-turkey", "nur-arabic"],
    firstName: "Osman", lastName: "T.", displayName: "Prof. Osman",
    title: "Prof. Dr.", gender: "male", ageRange: "59-65", nationality: "Turkish",
    languages: ["Turkish", "English", "Arabic"],
    education: [
      { degree: "Doktora", field: "İktisat", institution: "Bilkent Üniversitesi", year: 1993 },
      { degree: "Yüksek Lisans", field: "Ekonomi", institution: "London School of Economics", year: 1989 }
    ],
    currentPosition: "Emeritus Professor",
    institution: "Independent Economic Research",
    specializations: ["TCMB politikası", "Enflasyon", "Gelişen piyasalar"],
    publications: 108,
    typicalSegmentMinutes: 25,
    bio: "Bilkent doktorası. Eski TCMB danışmanı. Türk ekonomisi ve gelişen piyasalar konusunda referans isim.",
    imagePrompt: "Distinguished Turkish professor, 59-65, grey hair and mustache, glasses, formal dark suit, Istanbul office with Bosphorus view, photorealistic"
  },
  {
    id: "guest-park", channelIds: ["nur-korea", "nur-japan"],
    firstName: "동혁", lastName: "P.", displayName: "박 교수",
    title: "교수", gender: "male", ageRange: "54-60", nationality: "South Korean",
    languages: ["Korean", "English", "Japanese"],
    education: [
      { degree: "PhD", field: "Electrical Engineering & Economics", institution: "Stanford University", year: 1996 },
      { degree: "BSc", field: "Electronics", institution: "KAIST", year: 1992 }
    ],
    currentPosition: "석좌교수",
    institution: "Independent Technology Research",
    specializations: ["반도체 산업", "AI 경제학", "한일 기술 경쟁"],
    publications: 142,
    typicalSegmentMinutes: 20,
    bio: "스탠포드 박사. 반도체 산업의 최고 권위자. 삼성-TSMC 경쟁과 AI 칩 시장 분석.",
    imagePrompt: "Distinguished Korean professor, 54-60, grey-streaked hair, thin glasses, dark suit, tech-forward Seoul office, photorealistic"
  },
  {
    id: "guest-elena-cis", channelIds: ["nur-russia"],
    firstName: "Елена", lastName: "В.", displayName: "Проф. Елена",
    title: "Проф.", gender: "female", ageRange: "53-59", nationality: "Kazakh-Russian",
    languages: ["Russian", "English", "Kazakh"],
    education: [
      { degree: "PhD", field: "Energy Economics", institution: "Moscow State University", year: 1998 },
      { degree: "MSc", field: "Applied Mathematics", institution: "Novosibirsk State University", year: 1994 }
    ],
    currentPosition: "Ведущий научный сотрудник",
    institution: "Independent Energy Research",
    specializations: ["Энергетическая политика", "Редкоземельные металлы", "Центральная Азия"],
    publications: 87,
    typicalSegmentMinutes: 25,
    bio: "МГУ доктор наук. Эксперт по энергетической политике и рынкам редкоземельных металлов Центральной Азии.",
    imagePrompt: "Distinguished Kazakh-Russian female professor, 53-59, elegant silver hair, professional dark attire, academic office, photorealistic"
  },
  {
    id: "guest-jean", channelIds: ["nur-france", "nur-africa"],
    firstName: "Jean", lastName: "L.", displayName: "Prof. Jean",
    title: "Prof.", gender: "male", ageRange: "61-67", nationality: "French",
    languages: ["French", "English", "Arabic"],
    education: [
      { degree: "Doctorat", field: "Sciences Économiques", institution: "Université Paris-Dauphine", year: 1989 },
      { degree: "Agrégation", field: "Sciences Économiques et Sociales", institution: "ENS", year: 1985 }
    ],
    currentPosition: "Professeur Émérite",
    institution: "Independent European Research",
    specializations: ["Politique monétaire européenne", "Zone franc", "Marchés du luxe"],
    publications: 178,
    typicalSegmentMinutes: 25,
    bio: "Agrégé et docteur de Dauphine. Ancien conseiller de la Banque de France. Expert en politique monétaire de la BCE et marchés francophones.",
    imagePrompt: "Distinguished French professor, 61-67, silver hair, well-groomed, dark suit with subtle pocket square, Parisian office, photorealistic"
  },
  {
    id: "guest-siri", channelIds: ["nur-sea"],
    firstName: "Siri", lastName: "T.", displayName: "Dr. Siri",
    title: "Dr.", gender: "male", ageRange: "50-56", nationality: "Thai-Singaporean",
    languages: ["English", "Thai", "Mandarin", "Malay"],
    education: [
      { degree: "PhD", field: "International Economics", institution: "Yale University", year: 2002 },
      { degree: "MSc", field: "Economics", institution: "NUS", year: 1998 }
    ],
    currentPosition: "Senior Fellow",
    institution: "Independent ASEAN Research",
    specializations: ["ASEAN integration", "Supply chain economics", "Digital economy"],
    publications: 64,
    typicalSegmentMinutes: 20,
    bio: "Yale PhD. Expert on ASEAN economic integration and regional supply chain dynamics. Former MAS advisor.",
    imagePrompt: "Distinguished Thai-Singaporean man, 50-56, neat dark hair with grey streaks, glasses, professional suit, Singapore office, photorealistic"
  },
];

// ═══════════════════════════════════════════════════════════════
// SHOW SCHEDULES — Per channel
// ═══════════════════════════════════════════════════════════════

export const shows: NURShow[] = [
  // ── NUR GLOBAL ──
  { id: "show-gmo", channelId: "nur-global", name: "Global Market Open", nameLocal: "Global Market Open",
    format: "market-open", durationMinutes: 120, hostIds: ["host-victoria"], recurringGuestIds: ["guest-jim", "guest-rob"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "07:00", endUTC: "09:00" },
    description: "Live coverage of European market open with pre-market analysis and Asian session recap.",
    segments: ["Pre-Market Pulse", "Asia Overnight Recap", "European Open Live", "Sector Spotlight", "Guest Analysis"] },
  { id: "show-gmc", channelId: "nur-global", name: "Global Market Close", nameLocal: "Global Market Close",
    format: "market-close", durationMinutes: 90, hostIds: ["host-elena"], recurringGuestIds: ["guest-rob"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "20:30", endUTC: "22:00" },
    description: "US market close wrap-up, after-hours earnings, overnight outlook.",
    segments: ["US Close Recap", "After-Hours Movers", "Earnings Breakdown", "Tomorrow's Setup"] },
  { id: "show-gwk", channelId: "nur-global", name: "The Week Ahead", nameLocal: "The Week Ahead",
    format: "weekend-review", durationMinutes: 60, hostIds: ["host-victoria", "host-elena"], recurringGuestIds: ["guest-jim", "guest-rob"],
    schedule: { days: ["Sun"], startUTC: "18:00", endUTC: "19:00" },
    description: "Sunday evening preview of the week's key events, data releases, and earnings.",
    segments: ["Central Bank Calendar", "Earnings Preview", "Geopolitical Watch", "Trade Ideas"] },

  // ── NUR USA ──
  { id: "show-wsmo", channelId: "nur-usa", name: "Wall Street Morning", nameLocal: "Wall Street Morning",
    format: "market-open", durationMinutes: 150, hostIds: ["host-sarah"], recurringGuestIds: ["guest-jim"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "12:00", endUTC: "14:30" },
    description: "Pre-market through first 90 minutes of NYSE trading. Futures, earnings, Fed speak.",
    segments: ["Futures & Pre-Market", "Opening Bell Live", "Earnings Flash", "Fed Watch", "Guest Insight"] },
  { id: "show-tc", channelId: "nur-usa", name: "Tech & Crypto Close", nameLocal: "Tech & Crypto Close",
    format: "market-close", durationMinutes: 90, hostIds: ["host-maya"], recurringGuestIds: [],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "20:00", endUTC: "21:30" },
    description: "Nasdaq close, FAANG analysis, crypto markets, AI sector moves.",
    segments: ["Nasdaq Wrap", "FAANG Scorecard", "Crypto Pulse", "AI Sector", "After-Hours"] },

  // ── NUR TURKEY ──
  { id: "show-bist-ac", channelId: "nur-turkey", name: "Borsa Sabah", nameLocal: "Borsa Sabah",
    format: "market-open", durationMinutes: 120, hostIds: ["host-defne"], recurringGuestIds: ["guest-osman"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "06:30", endUTC: "08:30" },
    description: "BIST açılış öncesi analiz, döviz kurları, TCMB takibi.",
    segments: ["Piyasa Nabzı", "Döviz & Altın", "BIST Açılış", "TCMB İzleme", "Konuk Analiz"] },
  { id: "show-bist-kp", channelId: "nur-turkey", name: "Kapanış Analizi", nameLocal: "Kapanış Analizi",
    format: "market-close", durationMinutes: 90, hostIds: ["host-zeynep"], recurringGuestIds: ["guest-osman"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "15:00", endUTC: "16:30" },
    description: "BIST kapanış, günün özeti, teknik analiz, yarına bakış.",
    segments: ["BIST Kapanış", "Günün Hisseleri", "Teknik Analiz", "Döviz Kapanış", "Yarının Ajandası"] },

  // ── NUR ARABIC ──
  { id: "show-gulf-open", channelId: "nur-arabic", name: "Gulf Markets Open", nameLocal: "افتتاح أسواق الخليج",
    format: "market-open", durationMinutes: 120, hostIds: ["host-fatima"], recurringGuestIds: ["guest-ali"],
    schedule: { days: ["Sun","Mon","Tue","Wed","Thu"], startUTC: "06:00", endUTC: "08:00" },
    description: "تغطية افتتاح أسواق الخليج، أسعار النفط، تحركات الصناديق السيادية",
    segments: ["نبض الأسواق", "النفط والطاقة", "الافتتاح المباشر", "تحليل ضيف", "صكوك وتمويل إسلامي"] },
  { id: "show-mena-close", channelId: "nur-arabic", name: "MENA Market Close", nameLocal: "إغلاق أسواق المنطقة",
    format: "market-close", durationMinutes: 90, hostIds: ["host-nadia"], recurringGuestIds: ["guest-ali"],
    schedule: { days: ["Sun","Mon","Tue","Wed","Thu"], startUTC: "11:00", endUTC: "12:30" },
    description: "ملخص إغلاق الأسواق، تحليل القطاعات، نظرة مستقبلية",
    segments: ["ملخص الإغلاق", "تحليل القطاعات", "العملات والسلع", "النظرة المستقبلية"] },

  // ── NUR DEUTSCH ──
  { id: "show-dax-mo", channelId: "nur-deutsch", name: "DAX Morgen", nameLocal: "DAX Morgen",
    format: "market-open", durationMinutes: 120, hostIds: ["host-katharina"], recurringGuestIds: ["guest-hans"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "06:30", endUTC: "08:30" },
    description: "Vorbörse, DAX-Eröffnung, EZB-Kommentar, Anleihenanalyse.",
    segments: ["Vorbörse", "DAX-Eröffnung", "EZB-Monitor", "Anleihen & FX", "Gastanalyse"] },

  // ── NUR FRANCE ──
  { id: "show-cac-mat", channelId: "nur-france", name: "Ouverture CAC", nameLocal: "Ouverture CAC",
    format: "market-open", durationMinutes: 120, hostIds: ["host-eloise"], recurringGuestIds: ["guest-jean"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "07:00", endUTC: "09:00" },
    description: "Pré-ouverture, CAC 40 en direct, analyse sectorielle, luxe et industrie.",
    segments: ["Pré-ouverture", "CAC 40 Live", "Secteur Luxe", "Analyse Invité", "Perspectives"] },

  // ── NUR JAPAN ──
  { id: "show-nky-mo", channelId: "nur-japan", name: "日経モーニング", nameLocal: "日経モーニング",
    format: "market-open", durationMinutes: 120, hostIds: ["host-misaki"], recurringGuestIds: ["guest-yuki"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "23:30", endUTC: "01:30" },
    description: "東京市場の朝。日経先物、為替、半導体セクター分析。",
    segments: ["先物チェック", "為替動向", "日経オープン", "半導体セクター", "ゲスト分析"] },

  // ── NUR CHINA ──
  { id: "show-shg-mo", channelId: "nur-china", name: "沪市早间", nameLocal: "沪市早间",
    format: "market-open", durationMinutes: 120, hostIds: ["host-mingyu"], recurringGuestIds: ["guest-mei-prof"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "01:00", endUTC: "03:00" },
    description: "上证指数开盘分析、政策解读、行业研究。",
    segments: ["盘前分析", "政策解读", "开盘直播", "行业聚焦", "专家观点"] },

  // ── NUR KOREA ──
  { id: "show-ksp-mo", channelId: "nur-korea", name: "코스피 모닝", nameLocal: "코스피 모닝",
    format: "market-open", durationMinutes: 120, hostIds: ["host-soyeon"], recurringGuestIds: ["guest-park"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "00:00", endUTC: "02:00" },
    description: "코스피 개장 전 분석, 반도체 섹터, 원/달러 환율.",
    segments: ["선물 체크", "원/달러 동향", "코스피 개장", "반도체 섹터", "게스트 분석"] },

  // ── NUR INDIA ──
  { id: "show-nse-mo", channelId: "nur-india", name: "NSE Morning Bell", nameLocal: "NSE Morning Bell",
    format: "market-open", durationMinutes: 120, hostIds: ["host-ananya"], recurringGuestIds: ["guest-raj"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "03:15", endUTC: "05:15" },
    description: "Pre-market analysis, Nifty 50 open, RBI watch, IT and banking sectors.",
    segments: ["Pre-Market Scan", "Nifty Open", "RBI Monitor", "Sector Focus", "Guest View"] },

  // ── NUR BRAZIL ──
  { id: "show-ibov-mo", channelId: "nur-brazil", name: "Ibovespa Manhã", nameLocal: "Ibovespa Manhã",
    format: "market-open", durationMinutes: 120, hostIds: ["host-isabella"], recurringGuestIds: ["guest-carlos"],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri"], startUTC: "12:30", endUTC: "14:30" },
    description: "Pré-abertura, Ibovespa ao vivo, análise de commodities, Selic e câmbio.",
    segments: ["Pré-Abertura", "Ibovespa Live", "Commodities", "Selic & Câmbio", "Convidado"] },

  // ── BREAKING NEWS (all channels) ──
  { id: "show-breaking", channelId: "nur-global", name: "NUR Breaking News", nameLocal: "NUR Breaking News",
    format: "breaking-news", durationMinutes: 0, hostIds: ["host-victoria", "host-sarah"],
    recurringGuestIds: [],
    schedule: { days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], startUTC: "00:00", endUTC: "23:59" },
    description: "24/7 breaking financial news. Flash crashes, central bank surprises, geopolitical events, earnings shocks.",
    segments: ["Breaking Alert", "Market Impact", "Expert Reaction", "Viewer Q&A"] },
];

// ═══════════════════════════════════════════════════════════════
// BREAKING NEWS TEMPLATES
// ═══════════════════════════════════════════════════════════════

export interface BreakingNewsTemplate {
  id: string;
  category: string;
  titleTemplate: string;
  urgencyLevel: "flash" | "urgent" | "developing";
  autoInterrupt: boolean;
  graphicsPackage: string;
}

export const breakingNewsTemplates: BreakingNewsTemplate[] = [
  { id: "bn-fed", category: "Central Bank", titleTemplate: "BREAKING: Federal Reserve {action} — rates {direction}", urgencyLevel: "flash", autoInterrupt: true, graphicsPackage: "fed-decision" },
  { id: "bn-ecb", category: "Central Bank", titleTemplate: "BREAKING: ECB {action} — {detail}", urgencyLevel: "flash", autoInterrupt: true, graphicsPackage: "ecb-decision" },
  { id: "bn-crash", category: "Market Event", titleTemplate: "BREAKING: {index} {direction} {percent}% — circuit breakers {status}", urgencyLevel: "flash", autoInterrupt: true, graphicsPackage: "market-crash" },
  { id: "bn-earnings", category: "Earnings", titleTemplate: "BREAKING: {company} reports {result} — stock {direction} {percent}% AH", urgencyLevel: "urgent", autoInterrupt: false, graphicsPackage: "earnings-flash" },
  { id: "bn-merger", category: "M&A", titleTemplate: "BREAKING: {acquirer} to acquire {target} for ${amount}", urgencyLevel: "urgent", autoInterrupt: true, graphicsPackage: "ma-deal" },
  { id: "bn-geo", category: "Geopolitical", titleTemplate: "DEVELOPING: {event} — markets react", urgencyLevel: "developing", autoInterrupt: false, graphicsPackage: "geopolitical" },
  { id: "bn-commodity", category: "Commodities", titleTemplate: "BREAKING: {commodity} {direction} {percent}% on {reason}", urgencyLevel: "urgent", autoInterrupt: false, graphicsPackage: "commodity-spike" },
  { id: "bn-crypto", category: "Crypto", titleTemplate: "BREAKING: Bitcoin {direction} ${price} — {reason}", urgencyLevel: "urgent", autoInterrupt: false, graphicsPackage: "crypto-move" },
];

// ═══════════════════════════════════════════════════════════════
// GRAPHICS & PRODUCTION PACKAGES
// ═══════════════════════════════════════════════════════════════

export interface StudioGraphics {
  channelId: string;
  lowerThirdStyle: "solid" | "gradient" | "glass";
  tickerPosition: "bottom" | "top";
  tickerSpeed: number;
  brandWatermarkPosition: "top-left" | "top-right";
  liveBadgeColor: string;
  breakingBannerColor: string;
  dataOverlayTheme: "dark" | "light" | "transparent";
  chartColorScheme: string[];
}

export const studioGraphics: StudioGraphics[] = [
  { channelId: "nur-global", lowerThirdStyle: "glass", tickerPosition: "bottom", tickerSpeed: 1.2, brandWatermarkPosition: "top-left", liveBadgeColor: "#ef4444", breakingBannerColor: "#dc2626", dataOverlayTheme: "dark", chartColorScheme: ["#00d4aa", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"] },
  { channelId: "nur-usa", lowerThirdStyle: "solid", tickerPosition: "bottom", tickerSpeed: 1.5, brandWatermarkPosition: "top-left", liveBadgeColor: "#ef4444", breakingBannerColor: "#dc2626", dataOverlayTheme: "dark", chartColorScheme: ["#3b82f6", "#00d4aa", "#f5a623", "#ef4444", "#6366f1"] },
  { channelId: "nur-turkey", lowerThirdStyle: "gradient", tickerPosition: "bottom", tickerSpeed: 1.0, brandWatermarkPosition: "top-left", liveBadgeColor: "#ef4444", breakingBannerColor: "#e30a17", dataOverlayTheme: "dark", chartColorScheme: ["#e30a17", "#00d4aa", "#f59e0b", "#3b82f6", "#a855f7"] },
  { channelId: "nur-arabic", lowerThirdStyle: "gradient", tickerPosition: "bottom", tickerSpeed: 0.8, brandWatermarkPosition: "top-right", liveBadgeColor: "#ef4444", breakingBannerColor: "#dc2626", dataOverlayTheme: "dark", chartColorScheme: ["#e8a838", "#00d4aa", "#3b82f6", "#ef4444", "#22c55e"] },
];

// ═══════════════════════════════════════════════════════════════
// MUSIC & AUDIO PACKAGES
// ═══════════════════════════════════════════════════════════════

export interface AudioPackage {
  id: string;
  name: string;
  type: "intro" | "outro" | "breaking" | "transition" | "ambient" | "bumper";
  durationSeconds: number;
  mood: string;
  bpm: number;
  description: string;
  productionNote: string;
}

export const audioPackages: AudioPackage[] = [
  { id: "audio-main-intro", name: "NUR Finance Main Theme", type: "intro", durationSeconds: 15, mood: "Confident, modern, authoritative", bpm: 120, description: "Orchestral synth with driving beat. Think Bloomberg TV meets Hans Zimmer.", productionNote: "Generate via Suno/Udio with prompt: 'Professional financial news intro, orchestral synth, confident, modern, 15 seconds, broadcast quality'" },
  { id: "audio-breaking", name: "Breaking News Sting", type: "breaking", durationSeconds: 5, mood: "Urgent, dramatic, attention-grabbing", bpm: 140, description: "Sharp brass hit with tension build. Immediate attention grab.", productionNote: "Generate via Suno: 'Breaking news alert sound, urgent brass, dramatic, 5 seconds, TV broadcast quality'" },
  { id: "audio-transition", name: "Segment Transition", type: "transition", durationSeconds: 3, mood: "Smooth, professional", bpm: 110, description: "Clean whoosh with subtle musical accent between segments.", productionNote: "Generate via Suno: 'News segment transition sound, clean, professional, 3 seconds'" },
  { id: "audio-market-open", name: "Market Open Bell", type: "bumper", durationSeconds: 8, mood: "Energetic, anticipatory", bpm: 130, description: "Building energy culminating in a bell-like chime. The market is about to open.", productionNote: "Generate via Suno: 'Stock market opening bell sequence, energetic build, electronic, 8 seconds'" },
  { id: "audio-ambient", name: "Studio Ambient Loop", type: "ambient", durationSeconds: 300, mood: "Subtle, atmospheric, non-distracting", bpm: 85, description: "Minimal ambient pad for behind-the-scenes and quiet moments.", productionNote: "Generate via Suno: 'Minimal ambient pad for news studio, atmospheric, subtle, 5 minute loop'" },
  { id: "audio-outro", name: "Show Outro", type: "outro", durationSeconds: 12, mood: "Warm, conclusive, professional", bpm: 100, description: "Reflective outro with the main theme motif winding down.", productionNote: "Generate via Suno: 'Financial news show outro, warm, professional, winding down, 12 seconds'" },
];

// ═══════════════════════════════════════════════════════════════
// VISUAL PRODUCTION PIPELINE
// ═══════════════════════════════════════════════════════════════

export interface VisualProductionTask {
  id: string;
  category: "host-portrait" | "guest-portrait" | "studio-render" | "logo-animation" | "lower-third" | "channel-bumper" | "social-template";
  targetId: string;
  tool: string;
  prompt: string;
  dimensions: { width: number; height: number };
  status: "pending" | "generated" | "approved";
}

export function generateProductionTasks(): VisualProductionTask[] {
  const tasks: VisualProductionTask[] = [];

  hosts.forEach(h => {
    tasks.push({
      id: `vpt-host-${h.id}`,
      category: "host-portrait",
      targetId: h.id,
      tool: "Midjourney / Flux / Stable Diffusion XL",
      prompt: h.imagePrompt,
      dimensions: { width: 1024, height: 1536 },
      status: "pending"
    });
  });

  guests.forEach(g => {
    tasks.push({
      id: `vpt-guest-${g.id}`,
      category: "guest-portrait",
      targetId: g.id,
      tool: "Midjourney / Flux / Stable Diffusion XL",
      prompt: g.imagePrompt,
      dimensions: { width: 1024, height: 1536 },
      status: "pending"
    });
  });

  channels.forEach(ch => {
    tasks.push({
      id: `vpt-studio-${ch.id}`,
      category: "studio-render",
      targetId: ch.id,
      tool: "Midjourney / Flux",
      prompt: `Professional TV broadcast studio for ${ch.name}, ${ch.city}. Modern glass news desk, multiple LED screens showing financial data, ${ch.brandColor} accent lighting, city skyline visible through large windows, Bloomberg/Reuters broadcast quality, photorealistic interior render`,
      dimensions: { width: 1920, height: 1080 },
      status: "pending"
    });
  });

  return tasks;
}

// ═══════════════════════════════════════════════════════════════
// VIDEO PRODUCTION PIPELINE (AI-generated anchors)
// ═══════════════════════════════════════════════════════════════

export interface VideoProductionTask {
  id: string;
  type: "anchor-intro" | "show-open" | "breaking-template" | "channel-promo";
  channelId: string;
  tool: string;
  hostId?: string;
  script: string;
  voiceTool: string;
  voiceLanguage: string;
  durationSeconds: number;
  status: "pending" | "scripted" | "voice-generated" | "video-generated" | "approved";
}

export function generateVideoTasks(): VideoProductionTask[] {
  const tasks: VideoProductionTask[] = [];

  channels.filter(ch => ch.status === "live").forEach(ch => {
    const chHosts = hosts.filter(h => h.channelId === ch.id);
    if (chHosts.length === 0) return;
    const primaryHost = chHosts[0];

    tasks.push({
      id: `vid-intro-${ch.id}`,
      type: "anchor-intro",
      channelId: ch.id,
      tool: "HeyGen / Synthesia / D-ID",
      hostId: primaryHost.id,
      script: `Good ${ch.timezone.includes("Asia") ? "morning" : "day"}, I'm ${primaryHost.displayName}. Welcome to ${ch.nameLocal}. Let's take a look at the markets.`,
      voiceTool: "ElevenLabs",
      voiceLanguage: ch.language,
      durationSeconds: 15,
      status: "pending"
    });

    tasks.push({
      id: `vid-promo-${ch.id}`,
      type: "channel-promo",
      channelId: ch.id,
      tool: "Runway ML / Kling",
      script: `${ch.nameLocal} — Your source for ${ch.topics.slice(0, 3).join(", ")}. Live from ${ch.city}. Subscribe now.`,
      voiceTool: "ElevenLabs",
      voiceLanguage: ch.language,
      durationSeconds: 30,
      status: "pending"
    });
  });

  return tasks;
}

// ═══════════════════════════════════════════════════════════════
// HELPER — Summary stats
// ═══════════════════════════════════════════════════════════════

export function getBroadcastStats() {
  return {
    totalChannels: channels.length,
    liveChannels: channels.filter(c => c.status === "live").length,
    upcomingChannels: channels.filter(c => c.status !== "live").length,
    totalHosts: hosts.length,
    totalGuests: guests.length,
    totalShows: shows.length,
    totalLanguages: [...new Set(channels.flatMap(c => [c.language, ...c.secondaryLanguages]))].length,
    totalCities: [...new Set(channels.map(c => c.city))].length,
    visualTasksPending: generateProductionTasks().filter(t => t.status === "pending").length,
    videoTasksPending: generateVideoTasks().filter(t => t.status === "pending").length,
  };
}
