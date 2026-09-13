import fs from "fs";
import path from "path";

// Canonical 36 ships data
const SHIPS = [
  // 18 SOVEREIGN CONSERVATIVE
  {
    id: "TR_SOV",
    filename: "NUR_FINANS_CAPTAIN_TERMINAL.html",
    name: "NUR-08 BOZKURT TİTANI",
    title: "TÜRK EGEMEN DEVLET AKLI & ASKERİ FİNANS KOKPİTİ",
    allianceBadge: "🔵 NATO DOĞU KANADI // STANAG-4586",
    lang: "tr",
    flag: "🐺",
    orbit: "ANKARA // ENLEM 39.9°N | BOYLAM 32.8°E",
    factionTag: "🛡️ EGEMEN DEVLET DREADNOUGHT",
    indexName: "BIST 100",
    indexVal: "10,840.50 (+1.85%)",
    primaryAsset: "ASELS.IS ₺68.40",
    anchors: "Kaan Selçuk Demir & Elif Nur Erdem",
    studioName: "NUR TV DEVLET BÜLTENİ",
    dialectic: "Tez: Selçuklu Devlet Disiplini. Antitez: Küresel Sermaye Baskısı. Sentez: Umay Gül Nur 2126 Kuantum Hazine Egemenliği.",
    ttsLang: "tr-TR",
    ttsQuote: "NUR-08 Bozkurt Titanı komuta köprüsüne hoş geldiniz. Ankara ve Samsun orbital finans istihbarat hattı devrededir.",
    color: "#00f0ff",
    accent: "#e11d48",
    bgGradient: "radial-gradient(circle at center, #0a1128 0%, #02040a 80%, #000 100%)",
    wallet: "NUR-TR-SOV-54751113-BOZKURT",
    initialHash: 4250
  },
  {
    id: "TR_LIB",
    filename: "LIBERAL_VIZYON_TURKISH_TERMINAL.html",
    name: "LİBERAL VİZYON TULIP LOUNGE",
    title: "BOĞAZİÇİ LİBERAL TÜRKİYE GÖKYÜZÜ YATI & DİJİTAL SERMAYE",
    allianceBadge: "🔵 NATO MÜTTEFİKİ // LİBERAL TR",
    lang: "tr",
    flag: "🌷",
    orbit: "İSTANBUL BOĞAZI // ENLEM 41.0°N | BOYLAM 29.0°E",
    factionTag: "🍸 TÜRK LİBERAL GÖKYÜZÜ YATI",
    indexName: "BIST TECH",
    indexVal: "12,450.80 (+2.40%)",
    primaryAsset: "LOGO.IS ₺94.20",
    anchors: "Cem Demirkan & Melis Karahan",
    studioName: "TULIP LOUNGE MEDIA",
    dialectic: "Tez: Geleneksel Bürokrasi. Antitez: Boğaziçi Sınırsız Yaşam & Teknoloji İhracatı. Sentez: Umay Gül Nur Finansal Refahı.",
    ttsLang: "tr-TR",
    ttsQuote: "Liberal Vizyon Tulip Lounge yayınına hoş geldiniz. Boğaziçi ve küresel teknoloji sermayesi aktiftir.",
    color: "#ec4899",
    accent: "#8b5cf6",
    bgGradient: "radial-gradient(circle at center, #312e81 0%, #0c0a2a 80%, #000 100%)",
    wallet: "NUR-TR-LIB-54751113-TULIP",
    initialHash: 3890
  },
  {
    id: "UK_SOV",
    filename: "TUDOR_FINANCE_ENGLISH_TERMINAL.html",
    name: "TUDOR FINANCE CROWN GUARD",
    title: "ANGLO-AMERICAN SOVEREIGN FLAGSHIP // LONDON & NY VAULT",
    allianceBadge: "🔵 FIVE EYES // NATO STANAG-4586",
    lang: "en",
    flag: "👑",
    orbit: "LONDON // LAT 51.5°N | LON 0.1°W",
    factionTag: "🛡️ ANGLO SOVEREIGN DREADNOUGHT",
    indexName: "FTSE 100",
    indexVal: "8,240.20 (+1.25%)",
    primaryAsset: "SHEL.L £28.40",
    anchors: "Marcus Sterling & Sir Arthur Wellesley",
    studioName: "TUDOR BROADCAST NETWORK",
    dialectic: "Thesis: British Central Banking Discipline. Antithesis: Crypto Volatility. Synthesis: Sovereign Quantum Vault Dominance.",
    ttsLang: "en-GB",
    ttsQuote: "Welcome aboard Tudor Finance. Anglo-American sovereign intelligence and gold vault liquidity active.",
    color: "#f59e0b",
    accent: "#1e3a8a",
    bgGradient: "radial-gradient(circle at center, #0f172a 0%, #02040a 80%, #000 100%)",
    wallet: "NUR-UK-SOV-54751113-CROWN",
    initialHash: 5120
  },
  {
    id: "UK_LIB",
    filename: "PAX_HORIZON_LIBERAL_ENGLISH_TERMINAL.html",
    name: "PAX HORIZON GLOBAL SKY YACHT",
    title: "MIAMI & IBIZA SKY YACHT // BORDERLESS HIGH-YIELD CAPITAL",
    allianceBadge: "🔵 NATO ALLIED // LIBERAL US/UK",
    lang: "en",
    flag: "🍸",
    orbit: "MIAMI // LAT 25.7°N | LON 80.2°W",
    factionTag: "🍸 ANGLO LIBERAL SKY YACHT",
    indexName: "NASDAQ 100",
    indexVal: "20,418.50 (+2.15%)",
    primaryAsset: "NVDA $128.50",
    anchors: "Julian Vance & Chloe Montgomery",
    studioName: "PAX HORIZON STUDIO",
    dialectic: "Thesis: Sovereign Central State Reserves. Antithesis: Borderless 24/7 Hedonism. Synthesis: Global High-Frequency Yield.",
    ttsLang: "en-US",
    ttsQuote: "Welcome aboard Pax Horizon. Borderless high-yield capital and Miami liquidity streams are online.",
    color: "#c084fc",
    accent: "#f472b6",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #050811 80%, #000 100%)",
    wallet: "NUR-UK-LIB-54751113-PAX",
    initialHash: 4890
  },
  {
    id: "DE_SOV",
    filename: "WALKURE_FINANCE_GERMAN_TERMINAL.html",
    name: "WALKÜRE ANALYTICS IMPERIAL",
    title: "DEUTSCHE SOUVERÄNITÄT & INDUSTRIE-FINANZ DREADNOUGHT",
    allianceBadge: "🔵 NATO // DEUTSCHLAND BASTION",
    lang: "de",
    flag: "🦅",
    orbit: "FRANKFURT // LAT 50.1°N | LON 8.6°E",
    factionTag: "🛡️ DEUTSCHER SOUVERÄNER DREADNOUGHT",
    indexName: "DAX 40",
    indexVal: "19,120.40 (+1.40%)",
    primaryAsset: "SAP.DE €194.20",
    anchors: "Heinrich von Berg & Greta Lindemann",
    studioName: "WALKÜRE BUNDESSTUDIO",
    dialectic: "These: Preußische Industriedisziplin. Antithese: Globaler Spekulationsdruck. Synthese: Umay Gül Nur Quanten-Schatzkammer.",
    ttsLang: "de-DE",
    ttsQuote: "Willkommen auf der Walküre Analytics. Die deutsche Industrie- und Zentralbank-Liquidität ist aktiv.",
    color: "#f59e0b",
    accent: "#1e3a8a",
    bgGradient: "radial-gradient(circle at center, #111827 0%, #030712 80%, #000 100%)",
    wallet: "NUR-DE-SOV-54751113-WALKURE",
    initialHash: 4650
  },
  {
    id: "DE_LIB",
    filename: "BERLIN_TECHNO_GERMAN_TERMINAL.html",
    name: "BERLIN BERGHAIN TECHNO CLUB",
    title: "KREUZBERG 72-STUNDEN ELEKTRONISCHE FINTECH SKY YACHT",
    allianceBadge: "🔵 NATO // LIBERAL DEUTSCHLAND",
    lang: "de",
    flag: "⚡",
    orbit: "BERLIN SPREE // LAT 52.5°N | LON 13.4°E",
    factionTag: "🍸 DEUTSCHE LIBERALE SKY YACHT",
    indexName: "TecDAX",
    indexVal: "3,421.80 (+1.42%)",
    primaryAsset: "IFX.DE €38.45",
    anchors: "Felix Richter & Hannah Vogel",
    studioName: "SPREE TECHNO SYNDICATE",
    dialectic: "These: Industrielle Ordnung. Antithese: 72-Stunden Ekstase. Synthese: Autonomer Dezentraler Alpha-Ertrag.",
    ttsLang: "de-DE",
    ttsQuote: "Willkommen beim Berlin Berghain Techno Club. Kreuzberg 72-Stunden Non-Stop Liquiditäts-Engine aktiv.",
    color: "#22c55e",
    accent: "#06b6d4",
    bgGradient: "radial-gradient(circle at center, #064e3b 0%, #022c22 80%, #000 100%)",
    wallet: "NUR-DE-LIB-54751113-TECHNO",
    initialHash: 4320
  },
  {
    id: "CN_SOV",
    filename: "TANG_CAPITAL_CHINESE_TERMINAL.html",
    name: "DRAGON THRONE TANG CAPITAL",
    title: "中华主权龙脉金融旗舰 // 北京人民银行国库",
    allianceBadge: "🔴 SCO / BRICS+ // 中华主权",
    lang: "zh",
    flag: "🐉",
    orbit: "BEIJING // LAT 39.9°N | LON 116.4°E",
    factionTag: "🛡️ 中华主权无畏舰",
    indexName: "SSE COMPOSITE",
    indexVal: "3,280.40 (+1.95%)",
    primaryAsset: "601398.SS (ICBC) ¥5.42",
    anchors: "Chen Weilin & Lin Xiaoyu",
    studioName: "唐都龙脉全球广播",
    dialectic: "正题：华夏千年帝国中央秩序。反题：离岸自由资本扩张。合题：Umay Gül Nur 2126 量子主权金库。",
    ttsLang: "zh-CN",
    ttsQuote: "欢迎登上唐都龙脉主权金融旗舰。北京人民银行国库与欧亚丝绸之路流动性已全面激活。",
    color: "#eab308",
    accent: "#dc2626",
    bgGradient: "radial-gradient(circle at center, #450a0a 0%, #1c0505 80%, #000 100%)",
    wallet: "NUR-CN-SOV-54751113-DRAGON",
    initialHash: 8940
  },
  {
    id: "CN_LIB",
    filename: "HARMONY_GLOBAL_CHINESE_TERMINAL.html",
    name: "HARMONY SHANGHAI NEON",
    title: "上海外滩霓虹云端游艇 // 跨境电商与数字高收益",
    allianceBadge: "🔴 SCO / BRICS+ // 自由金融",
    lang: "zh",
    flag: "🏮",
    orbit: "SHANGHAI PUDONG // LAT 31.2°N | LON 121.4°E",
    factionTag: "🍸 中华自由云端游艇",
    indexName: "ChiNext",
    indexVal: "2,180.50 (+2.65%)",
    primaryAsset: "300750.SZ (CATL) ¥215.00",
    anchors: "Leo Zhang & Vivian Wu",
    studioName: "外滩霓虹夜间广播",
    dialectic: "正题：宏观实体监管。反题：外滩彻夜狂欢与高频套利。合题：全球跨链财富极速汇聚。",
    ttsLang: "zh-CN",
    ttsQuote: "欢迎来到上海和谐霓虹云端游艇。外滩天台派对与全球跨链流动性已开启。",
    color: "#a855f7",
    accent: "#ec4899",
    bgGradient: "radial-gradient(circle at center, #2e1065 0%, #0f051d 80%, #000 100%)",
    wallet: "NUR-CN-LIB-54751113-HARMONY",
    initialHash: 7850
  },
  {
    id: "JP_SOV",
    filename: "TOKUGAWA_MARKETS_JAPANESE_TERMINAL.html",
    name: "YAMATO TOKUGAWA CAPITAL",
    title: "大和主权徳川幕府要塞 // 日本銀行金庫と精密半導体",
    allianceBadge: "🟠 QUAD PACIFIC // 大和主権",
    lang: "ja",
    flag: "⛩️",
    orbit: "TOKYO // LAT 35.6°N | LON 139.6°E",
    factionTag: "🛡️ 大和主権ドレッドノート",
    indexName: "NIKKEI 225",
    indexVal: "38,940.00 (+1.60%)",
    primaryAsset: "7203.T (Toyota) ¥2,840",
    anchors: "Kenjiro Takahashi & Aoi Morimoto",
    studioName: "徳川大和中央放送",
    dialectic: "テーゼ：武士道の中央規律。アンチテーゼ：急速なデジタル流動性。ジンテーゼ：Umay Gül Nur 量子主権国庫の確立。",
    ttsLang: "ja-JP",
    ttsQuote: "大和徳川キャピタルへようこそ。日本銀行国庫と精密半導体防衛ネットワークが稼働中です。",
    color: "#dc2626",
    accent: "#f59e0b",
    bgGradient: "radial-gradient(circle at center, #2a0808 0%, #0f0303 80%, #000 100%)",
    wallet: "NUR-JP-SOV-54751113-YAMATO",
    initialHash: 4120
  },
  {
    id: "JP_LIB",
    filename: "ZENITH_PACIFIST_JAPANESE_TERMINAL.html",
    name: "NEO TOKYO SHIBUYA PULSE",
    title: "渋谷ホログラム・エレクトロニクス // J-POPとWeb3デジタル資産",
    allianceBadge: "🟠 QUAD PACIFIC // リベラル東京",
    lang: "ja",
    flag: "🌸",
    orbit: "SHIBUYA // LAT 35.6°N | LON 139.7°E",
    factionTag: "🍸 日本リベラル・スカイヨット",
    indexName: "TOKYO MOTHERS",
    indexVal: "780.20 (+2.10%)",
    primaryAsset: "4385.T (Mercari) ¥2,140",
    anchors: "Ren Kurogane & Sayaka Hoshino",
    studioName: "渋谷パルス放送局",
    dialectic: "テーゼ：伝統的金融秩序。アンチテーゼ：渋谷24時間ノンストップ・カルチャー。ジンテーゼ：次世代デジタル資本の開花。",
    ttsLang: "ja-JP",
    ttsQuote: "ネオトウキョウ渋谷パルスへようこそ。ホログラムエンターテインメントとデジタル流動性が稼働しています。",
    color: "#06b6d4",
    accent: "#ec4899",
    bgGradient: "radial-gradient(circle at center, #083344 0%, #02131a 80%, #000 100%)",
    wallet: "NUR-JP-LIB-54751113-SHIBUYA",
    initialHash: 3950
  },
  {
    id: "FR_SOV",
    filename: "BOURBON_ANALYTICS_FRENCH_TERMINAL.html",
    name: "MARIANNE NATIONALE BOURBON",
    title: "SOUVERAINETÉ FRANÇAISE // BANQUE DE FRANCE & DÉFENSE STRATÉGIQUE",
    allianceBadge: "🔵 NATO // FRANCE PUISSANCE",
    lang: "fr",
    flag: "⚜️",
    orbit: "PARIS // LAT 48.8°N | LON 2.3°E",
    factionTag: "🛡️ CUIRASSÉ SOUVERAIN FRANÇAIS",
    indexName: "CAC 40",
    indexVal: "7,840.10 (+1.30%)",
    primaryAsset: "TTE.PA €64.80",
    anchors: "Antoine de Saint-Germain & Camille Laurent",
    studioName: "STUDIO NATIONAL MARIANNE",
    dialectic: "Thèse: Souveraineté gaulliste et réserves d'or. Antithèse: Flux financiers apatrides. Synthèse: Coffre quantique souverain Umay Gül Nur.",
    ttsLang: "fr-FR",
    ttsQuote: "Bienvenue à bord du vaisseau souverain Marianne Nationale. Les coffres de la Banque de France et la stratégie gaulliste sont actifs.",
    color: "#3b82f6",
    accent: "#f59e0b",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #030712 80%, #000 100%)",
    wallet: "NUR-FR-SOV-54751113-MARIANNE",
    initialHash: 3640
  },
  {
    id: "FR_LIB",
    filename: "L_AURORE_MONDE_FRENCH_TERMINAL.html",
    name: "LUMIÈRE FRENCH RIVIERA",
    title: "CANNES & SAINT-TROPEZ LUXURY // YACHTING & HAUTE FINANCE",
    allianceBadge: "🔵 NATO / UE // RIVIERA LIBÉRALE",
    lang: "fr",
    flag: "🥂",
    orbit: "CANNES // LAT 43.5°N | LON 7.0°E",
    factionTag: "🍸 SKY YACHT DE LUXE FRANÇAIS",
    indexName: "CAC MID 60",
    indexVal: "6,940.30 (+1.90%)",
    primaryAsset: "RMS.PA €1,980",
    anchors: "Julien Moreau & Léa Seydoux",
    studioName: "RIVIERA VIP STUDIO",
    dialectic: "Thèse: Rigueur républicaine. Antithèse: Glamour méditerranéen et fêtes privées. Synthèse: Rendement financier d'élite.",
    ttsLang: "fr-FR",
    ttsQuote: "Bienvenue à bord du Lumière Riviera Sky Yacht. La haute finance et le luxe méditerranéen sont en direct.",
    color: "#8b5cf6",
    accent: "#ec4899",
    bgGradient: "radial-gradient(circle at center, #2e1065 0%, #090214 80%, #000 100%)",
    wallet: "NUR-FR-LIB-54751113-RIVIERA",
    initialHash: 3480
  },
  {
    id: "RU_SOV",
    filename: "RURIK_CAPITAL_RUSSIAN_TERMINAL.html",
    name: "TSARGRAD RURIK CAPITAL",
    title: "ЕВРАЗИЙСКИЙ СУВЕРЕННЫЙ ФЛАГМАН // МОСКВА И ЗОЛОТОЙ РЕЗЕРВ",
    allianceBadge: "🔴 SCO / BRICS+ // ЕВРАЗИЙСКИЙ БЛОК",
    lang: "ru",
    flag: "⚔️",
    orbit: "MOSCOW // LAT 55.7°N | LON 37.6°E",
    factionTag: "🛡️ ЕВРАЗИЙСКИЙ СУВЕРЕННЫЙ ЛИНКОР",
    indexName: "MOEX RUSSIA",
    indexVal: "3,140.20 (+1.75%)",
    primaryAsset: "GAZP.ME 164.20 ₽",
    anchors: "Viktor Morozov & Daria Volkova",
    studioName: "ЦАРЬГРАД СУВЕРЕННЫЙ ВЕСТНИК",
    dialectic: "Тезис: Незыблемый государственный суверенитет и золото. Антитезис: Западная финансовая гегемония. Синтез: Квантовая сокровищница Umay Gül Nur.",
    ttsLang: "ru-RU",
    ttsQuote: "Добро пожаловать на борт флагмана Царьград. Суверенный золотой запас и энергетическая мощь Евразии активированы.",
    color: "#38bdf8",
    accent: "#ef4444",
    bgGradient: "radial-gradient(circle at center, #0f172a 0%, #020617 80%, #000 100%)",
    wallet: "NUR-RU-SOV-54751113-TSARGRAD",
    initialHash: 6450
  },
  {
    id: "RU_LIB",
    filename: "MIR_ORBITAL_ECHO_RUSSIAN_TERMINAL.html",
    name: "NEVA NIGHTS SOCHI RIVIERA",
    title: "СОЧИ И САНКТ-ПЕТЕРБУРГ БЕЛЫЕ НОЧИ // ЭЛИТНЫЙ КЛУБ И ФИНТЕХ",
    allianceBadge: "🔴 SCO / BRICS+ // ЛИБЕРАЛЬНЫЙ ФИНТЕХ",
    lang: "ru",
    flag: "💎",
    orbit: "SOCHI // LAT 43.6°N | LON 39.7°E",
    factionTag: "🍸 ЛИБЕРАЛЬНАЯ НЕБЕСНАЯ ЯХТА",
    indexName: "RTS INDEX",
    indexVal: "1,120.50 (+2.10%)",
    primaryAsset: "YNDX.ME 3,840 ₽",
    anchors: "Nikolai Romanov & Polina Petrova",
    studioName: "НЕВА НАЙТС РАДИО",
    dialectic: "Тезис: Традиционная замкнутость. Антитезис: Роскошный отдых и высокотехнологичный арбитраж. Синтез: Максимальная цифровая доходность.",
    ttsLang: "ru-RU",
    ttsQuote: "Добро пожаловать на борт Neva Nights. Премиальный отдых и глобальные финансовые потоки активны.",
    color: "#38bdf8",
    accent: "#ec4899",
    bgGradient: "radial-gradient(circle at center, #172554 0%, #030712 80%, #000 100%)",
    wallet: "NUR-RU-LIB-54751113-NEVA",
    initialHash: 5120
  },
  {
    id: "AR_SOV",
    filename: "ABBASID_FINANCIAL_ARABIC_TERMINAL.html",
    name: "CALIPHATE INTELLIGENCE ABBASID",
    title: "الأسطول المالي السيادي العباسي // خزائن بيت المال والذهب",
    allianceBadge: "🟢 GCC // التحالف العربي السيادي",
    lang: "ar",
    flag: "🕌",
    orbit: "RIYADH // LAT 24.7°N | LON 46.7°E",
    factionTag: "🛡️ المدرعة السيادية العباسية",
    indexName: "TASI (SAUDI)",
    indexVal: "12,180.40 (+1.45%)",
    primaryAsset: "2222.SR (Aramco) 28.40 SAR",
    anchors: "Tariq Al-Mansoor & Noor Al-Hassan",
    studioName: "استوديو بيت الحكمة السيادي",
    dialectic: "الأطروحة: السيادة النقدية والذهب. النقيض: تقلبات الأسواق العالمية. التركيب: خزينة Umay Gül Nur 2126 الكمومية السيادية.",
    ttsLang: "ar-SA",
    ttsQuote: "مرحباً بكم في قيادة الأسطول العباسي السيادي. خزائن الطاقة العالمية واحتياطيات الذهب في حالة جاهزية تامة.",
    color: "#10b981",
    accent: "#eab308",
    bgGradient: "radial-gradient(circle at center, #022c22 0%, #01140e 80%, #000 100%)",
    wallet: "NUR-AR-SOV-54751113-CALIPHATE",
    initialHash: 5890
  },
  {
    id: "AR_LIB",
    filename: "AL_AMAL_PEACE_ARABIC_TERMINAL.html",
    name: "DUBAI SKYLINE GOLD LOUNGE",
    title: "دبي مارينا ولاونج الذهب // يخوت سماء الخليج والعقارات الفاخرة",
    allianceBadge: "🟢 GCC // الخليج الليبرالي الفاخر",
    lang: "ar",
    flag: "🌴",
    orbit: "DUBAI // LAT 25.2°N | LON 55.2°E",
    factionTag: "🍸 يخت سماء دبي الفاخر",
    indexName: "DFM GENERAL",
    indexVal: "4,520.10 (+2.20%)",
    primaryAsset: "EMAAR.AE 8.45 AED",
    anchors: "Zayd Al-Maktoum & Layla Mansur",
    studioName: "دبي سكاي لاين ميديا",
    dialectic: "الأطروحة: التجارة الصحراوية العريقة. النقيض: الأبراج المستقبلية والتمويل اللامركزي. التركيب: قمة الازدهار المالي العالمي.",
    ttsLang: "ar-SA",
    ttsQuote: "أهلاً بكم على متن يخت دبي سكاي لاين الذهبي. سيولة الاستثمارات العالمية ونمط الحياة الفاخر في بث مباشر.",
    color: "#eab308",
    accent: "#10b981",
    bgGradient: "radial-gradient(circle at center, #422006 0%, #150a02 80%, #000 100%)",
    wallet: "NUR-AR-LIB-54751113-DUBAI",
    initialHash: 5320
  },
  {
    id: "IR_SOV",
    filename: "PERSEPOLIS_CAPITAL_PERSIAN_TERMINAL.html",
    name: "PERSEPOLIS CAPITAL IMPERIAL",
    title: "ناوگان حاکمیتی تخت جمشید // استراتژی ملی و انرژی البرز",
    allianceBadge: "🔴 SCO / BRICS+ // حاکمیت پارس",
    lang: "fa",
    flag: "🏛️",
    orbit: "SHIRAZ // LAT 29.9°N | LON 52.8°E",
    factionTag: "🛡️ ناو جنگی حاکمیتی پارس",
    indexName: "TEDPIX (TEHRAN)",
    indexVal: "2,150,400 (+1.80%)",
    primaryAsset: "IRO1FOLD0001 (Foolad)",
    anchors: "Kourosh Rostami & Shirin Pahlavi",
    studioName: "استودیو حاکمیتی تخت جمشید",
    dialectic: "تز: خرد و اقتدار باستانی هخامنشی. آنتی‌تز: تحریم‌ها و فشارهای ارزی. سنتز: پیروزی خزانه کوانتومی Umay Gül Nur.",
    ttsLang: "fa-IR",
    ttsQuote: "به اتاق فرماندهی تخت جمشید خوش آمدید. ذخایر استراتژیک و شبکه مالی حاکمیتی فعال است.",
    color: "#f59e0b",
    accent: "#38bdf8",
    bgGradient: "radial-gradient(circle at center, #291b00 0%, #0d0900 80%, #000 100%)",
    wallet: "NUR-IR-SOV-54751113-PERSEPOLIS",
    initialHash: 3420
  },
  {
    id: "IR_LIB",
    filename: "TEHRAN_SYNTH_LIBERAL_PERSIAN_TERMINAL.html",
    name: "TEHRAN SYNTH SKYLINE",
    title: "موسیقی الکترونیک زیرزمینی تهران // اقتصاد خلاق و فناوری نوین",
    allianceBadge: "🔴 SCO / BRICS+ // جوانان پارس",
    lang: "fa",
    flag: "🌙",
    orbit: "TEHRAN // LAT 35.7°N | LON 51.4°E",
    factionTag: "🍸 یخت آسمانی لیبرال پارس",
    indexName: "IRAN-TECH",
    indexVal: "1,840.10 (+2.15%)",
    primaryAsset: "IRO1MKBT0001 (Telecomm)",
    anchors: "Arash Kasravi & Tara Bakhtiari",
    studioName: "رادیو سینت البرز",
    dialectic: "تز: شعر و معماری کهن. آنتی‌تز: ریتم سایبرپانک مدرن. سنتز: بوستان ابدی نقدینگی دیجیتال پارس.",
    ttsLang: "fa-IR",
    ttsQuote: "خوش آمدید به ایستگاه رادیویی تهران سینت. پل ارتباطی اقتصاد دیجیتال و فرهنگ نوآوری البرز فعال است.",
    color: "#f59e0b",
    accent: "#c084fc",
    bgGradient: "radial-gradient(circle at center, #1c1917 0%, #0c0a09 80%, #000 100%)",
    wallet: "NUR-IR-LIB-54751113-TEHRAN",
    initialHash: 3180
  },
  {
    id: "IN_SOV",
    filename: "MAURYA_INTELLIGENCE_HINDI_TERMINAL.html",
    name: "MAURYA BHARAT EXCHANGE",
    title: "मौर्य भारत संप्रभु वित्तीय विमान // रिज़र्व बैंक और राष्ट्रीय सुरक्षा",
    allianceBadge: "🔴 SCO / BRICS+ // भारत संप्रभुता",
    lang: "hi",
    flag: "🕉️",
    orbit: "NEW DELHI // LAT 28.6°N | LON 77.2°E",
    factionTag: "🛡️ मौर्य संप्रभु युद्धपोत",
    indexName: "NIFTY 50",
    indexVal: "25,410.80 (+1.70%)",
    primaryAsset: "RELIANCE.NS ₹3,020",
    anchors: "Aarav Sharma & Priya Iyer",
    studioName: "मौर्य राष्ट्रीय प्रसारण केंद्र",
    dialectic: "थीसिस: अर्थशास्त्र का चाणक्य अनुशासन। एंटी-थीसिस: वैश्विक मुद्रा उतार-चढ़ाव। सिंथेसिस: उमय गुल नूर क्वांटम रिज़र्व विजय।",
    ttsLang: "hi-IN",
    ttsQuote: "मौर्य भारत संप्रभु वित्तीय कमान में आपका स्वागत है। राष्ट्रीय रिज़र्व और चाणक्य रणनीति सक्रिय है।",
    color: "#f59e0b",
    accent: "#ea580c",
    bgGradient: "radial-gradient(circle at center, #451a03 0%, #1a0800 80%, #000 100%)",
    wallet: "NUR-IN-SOV-54751113-BHARAT",
    initialHash: 7420
  },
  {
    id: "IN_LIB",
    filename: "SHANTI_VISION_HINDI_TERMINAL.html",
    name: "BOLLYWOOD PULSE GOA",
    title: "गोवा बीच लाउंज और बॉलीवुड पल्स // डिजिटल मीडिया और युवा वित्त",
    allianceBadge: "🔴 BRICS+ // लिबरल भारत",
    lang: "hi",
    flag: "🪷",
    orbit: "GOA // LAT 15.4°N | LON 73.8°E",
    factionTag: "🍸 बॉलीवुड स्काई यॉट",
    indexName: "BSE SENSEX TECH",
    indexVal: "82,890.40 (+2.35%)",
    primaryAsset: "INFY.BO ₹1,890",
    anchors: "Kabir Kapoor & Ananya Sen",
    studioName: "गोवा पल्स स्टूडियो",
    dialectic: "थीसिस: पारंपरिक वैदिक संतुलन। एंटी-थीसिस: बॉलीवुड ऊर्जा और स्टार्टअप्स। सिंथेसिस: असीमित डिजिटल विकास।",
    ttsLang: "hi-IN",
    ttsQuote: "बॉलीवुड पल्स गोवा स्काई यॉट में आपका स्वागत है। रचनात्मक अर्थव्यवस्था और वेब3 निवेश सक्रिय हैं।",
    color: "#f59e0b",
    accent: "#ec4899",
    bgGradient: "radial-gradient(circle at center, #3b0764 0%, #120124 80%, #000 100%)",
    wallet: "NUR-IN-LIB-54751113-GOA",
    initialHash: 6890
  },
  {
    id: "ES_SOV",
    filename: "HABSBURGO_CAPITAL_SPANISH_TERMINAL.html",
    name: "HABSBURGO IMPERIAL HISPANIA",
    title: "FLOTA SOBERANA HISPÁNICA // BANCO DE ESPAÑA Y RESERVAS HISTÓRICAS",
    allianceBadge: "🔵 NATO // ESPAÑA IMPERIAL",
    lang: "es",
    flag: "⚔️",
    orbit: "MADRID // LAT 40.4°N | LON 3.7°W",
    factionTag: "🛡️ ACORAZADO SOBERANO HISPANO",
    indexName: "IBEX 35",
    indexVal: "11,840.20 (+1.35%)",
    primaryAsset: "SAN.MC €4.52",
    anchors: "Santiago De La Vega & Valentina Morales",
    studioName: "ESTUDIO SOBERANO HABSBURGO",
    dialectic: "Tesis: Orden histórico del Imperio donde no se ponía el sol. Antítesis: Especulación sin fronteras. Síntesis: Bóveda Cuántica Soberana Umay Gül Nur.",
    ttsLang: "es-ES",
    ttsQuote: "Bienvenidos a bordo del buque soberano Habsburgo Hispania. Las reservas del Banco de España y la estrategia atlántica están activas.",
    color: "#f59e0b",
    accent: "#dc2626",
    bgGradient: "radial-gradient(circle at center, #450a0a 0%, #150202 80%, #000 100%)",
    wallet: "NUR-ES-SOV-54751113-HABSBURG",
    initialHash: 3210
  },
  {
    id: "ES_LIB",
    filename: "PAZ_DEL_SOL_SPANISH_TERMINAL.html",
    name: "IBIZA FIESTA BALEARIC",
    title: "IBIZA MEGA SKY YACHT // FIESTA ELECTRÓNICA Y FINANZAS LIFESTYLE",
    allianceBadge: "🔵 NATO // ESPAÑA LIBERAL",
    lang: "es",
    flag: "🎉",
    orbit: "IBIZA // LAT 38.9°N | LON 1.4°E",
    factionTag: "🍸 YATE LIBERAL BALEAR",
    indexName: "IBEX MEDIUM",
    indexVal: "14,210.50 (+2.10%)",
    primaryAsset: "ITX.MC €48.20",
    anchors: "Carlos Mendoza & Isabella Gomez",
    studioName: "IBIZA BALEARIC BEATS",
    dialectic: "Tesis: Disciplina bancaria peninsular. Antítesis: Fiesta sin límites en el Mediterráneo. Síntesis: Flujo ininterrumpido de liquidez de alta frecuencia.",
    ttsLang: "es-ES",
    ttsQuote: "Bienvenidos a bordo del Ibiza Fiesta Sky Yacht. La música electrónica y las finanzas de vanguardia están en el aire.",
    color: "#f43f5e",
    accent: "#38bdf8",
    bgGradient: "radial-gradient(circle at center, #18181b 0%, #09090b 80%, #000 100%)",
    wallet: "NUR-ES-LIB-54751113-IBIZA",
    initialHash: 3050
  },
  {
    id: "IT_SOV",
    filename: "NOVA_ROMA_ITALIAN_TERMINAL.html",
    name: "NOVA ROMA FORTRESS EUROPA",
    title: "SOUVERANITÀ ROMANA // BANCA D'ITALIA E DIPLOMAZIA DI STATO",
    allianceBadge: "🔵 NATO // ROMA IMPERIALE",
    lang: "it",
    flag: "🏛️",
    orbit: "ROMA // LAT 41.9°N | LON 12.5°E",
    factionTag: "🛡️ CORAZZATA SOBERANA ROMANA",
    indexName: "FTSE MIB",
    indexVal: "34,820.50 (+1.45%)",
    primaryAsset: "ENI.MI €14.80",
    anchors: "Marco Aurelio Conti & Giulia Bellini",
    studioName: "STUDIO SOBERANO NOVA ROMA",
    dialectic: "Tesi: Diritto Romano e autorità centrale. Antitesi: Mercati globali frammentati. Sintesi: Umay Gül Nur Caveau Quantico Supremo.",
    ttsLang: "it-IT",
    ttsQuote: "Benvenuti a bordo della corazzata Nova Roma. La sovranità finanziaria della Banca d'Italia è attiva.",
    color: "#eab308",
    accent: "#1e3a8a",
    bgGradient: "radial-gradient(circle at center, #1e3a8a 0%, #040817 80%, #000 100%)",
    wallet: "NUR-IT-SOV-54751113-ROMA",
    initialHash: 3510
  },
  {
    id: "IT_LIB",
    filename: "MILAN_FASHION_LIBERAL_ITALIAN_TERMINAL.html",
    name: "MILAN FASHION SKY YACHT",
    title: "MILANO MODA & LAGO DI COMO // ALTA FINANZA E LUSSO CARBON-FIBER",
    allianceBadge: "🔵 NATO // ITALIA LIBERALE",
    lang: "it",
    flag: "💎",
    orbit: "MILANO // LAT 45.4°N | LON 9.2°E",
    factionTag: "🍸 SKY YACHT MODA MILANO",
    indexName: "MIB ESG",
    indexVal: "1,540.20 (+1.88%)",
    primaryAsset: "MONC.MI €54.30",
    anchors: "Lorenzo Moretti & Chiara Rossi",
    studioName: "MILAN LUXURY MEDIA",
    dialectic: "Tesi: Rigore classico. Antitesi: Sfilata cosmopolita e capitali privati. Sintesi: Puro rendimento estetico globale.",
    ttsLang: "it-IT",
    ttsQuote: "Benvenuti a bordo del Milan Fashion Sky Yacht. La sfilata di liquidità e alta finanza è ora aperta.",
    color: "#d946ef",
    accent: "#38bdf8",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #030712 80%, #000 100%)",
    wallet: "NUR-IT-LIB-54751113-MILAN",
    initialHash: 3340
  },
  {
    id: "SE_SOV",
    filename: "VALKYRIE_ARCTIC_NORDIC_TERMINAL.html",
    name: "VALKYRIE ARCTIC BASTION",
    title: "NORDISK SUVERÄNITET // RIKSBANKEN & ARKTISKA MINERALER",
    allianceBadge: "🔵 NATO // NORDIC DEFENSE",
    lang: "sv",
    flag: "❄️",
    orbit: "KIRUNA // LAT 67.8°N | LON 20.2°E",
    factionTag: "🛡️ NORDISKT SUVERÄNT SLAGSKEPP",
    indexName: "OMX NORDIC 40",
    indexVal: "2,840.40 (+1.10%)",
    primaryAsset: "VOLVB.ST 274 SEK",
    anchors: "Torsten Lindqvist & Astrid Lindgren",
    studioName: "ARKTISKA VAKTSTUDION",
    dialectic: "Tes: Arktisk självförsörjning och metallreserver. Antites: Utländska kapitalkrav. Syntes: Umay Gül Nur Kvantvalv.",
    ttsLang: "sv-SE",
    ttsQuote: "Välkommen till Valkyrie Arctic Bastion. Nordiska mineralreserver och suverän Riksbank-infrastruktur är online.",
    color: "#00f0ff",
    accent: "#1e3a8a",
    bgGradient: "radial-gradient(circle at center, #0284c7 0%, #031326 80%, #000 100%)",
    wallet: "NUR-SE-SOV-54751113-VALKYRIE",
    initialHash: 4120
  },
  {
    id: "SE_LIB",
    filename: "STOCKHOLM_AURORA_LIBERAL_NORDIC_TERMINAL.html",
    name: "STOCKHOLM AURORA LOUNGE",
    title: "STOCKHOLM FINTECH UNICORNS // GRÖN ENERGI & SKANDINAVISK DESIGN",
    allianceBadge: "🔵 NATO // LIBERAL NORDEN",
    lang: "sv",
    flag: "🌌",
    orbit: "STOCKHOLM // LAT 59.3°N | LON 18.1°E",
    factionTag: "🍸 NORDISK SKY YACHT",
    indexName: "FIRST NORTH",
    indexVal: "980.40 (+2.05%)",
    primaryAsset: "SPOT $320.50",
    anchors: "Elias Bergström & Freja Nilsson",
    studioName: "STOCKHOLM AURORA MEDIA",
    dialectic: "Tes: Nordisk ekologisk balans. Antites: Skalbara tech-enhörningar. Syntes: Nollutsläppskvantkapital.",
    ttsLang: "sv-SE",
    ttsQuote: "Välkommen till Stockholm Aurora Lounge. Hållbar teknik och nordiska enhörningar är live.",
    color: "#14b8a6",
    accent: "#38bdf8",
    bgGradient: "radial-gradient(circle at center, #042f2e 0%, #021a19 80%, #000 100%)",
    wallet: "NUR-SE-LIB-54751113-STOCKHOLM",
    initialHash: 3890
  },
  {
    id: "AF_SOV",
    filename: "KILWA_MARKETS_AFRICAN_TERMINAL.html",
    name: "SONGHAI KILWA IMPERIAL",
    title: "AFRICAN SOVEREIGN DREADNOUGHT // CENTRAL BANK RESERVES & CRITICAL MINERALS",
    allianceBadge: "🟡 AFRICAN UNION // SOVEREIGN ALLIANCE",
    lang: "en",
    flag: "🌍",
    orbit: "JOHANNESBURG // LAT 26.2°S | LON 28.0°E",
    factionTag: "🛡️ PAN-AFRICAN SOVEREIGN CITADEL",
    indexName: "JSE TOP 40",
    indexVal: "78,920.00 (+1.65%)",
    primaryAsset: "NPN.JO R3,420",
    anchors: "Kofi Mensah & Amina Bello",
    studioName: "PAN-AFRICAN SOVEREIGN STUDIO",
    dialectic: "Thesis: Rich continental mineral sovereignty. Antithesis: External debt dependency. Synthesis: Umay Gül Nur Sovereign Quantum Reserve.",
    ttsLang: "en-ZA",
    ttsQuote: "Welcome to Songhai Kilwa Imperial. African mineral reserves and sovereign trade bridges are fully operational.",
    color: "#eab308",
    accent: "#16a34a",
    bgGradient: "radial-gradient(circle at center, #422006 0%, #150a02 80%, #000 100%)",
    wallet: "NUR-AF-SOV-54751113-SONGHAI",
    initialHash: 2980
  },
  {
    id: "AF_LIB",
    filename: "UBUNTU_HARMONY_AFRICAN_TERMINAL.html",
    name: "AFRO BEATS LAGOS SUNSET",
    title: "VICTORIA ISLAND VIP CLUB // AFROBEATS, FINTECH & CREATIVE ECONOMY",
    allianceBadge: "🟡 AFRICAN UNION // LIBERAL WING",
    lang: "en",
    flag: "🪘",
    orbit: "LAGOS // LAT 6.5°N | LON 3.3°E",
    factionTag: "🍸 AFRO-FUTURIST SKY YACHT",
    indexName: "NGX 30",
    indexVal: "3,840.20 (+2.40%)",
    primaryAsset: "MTNN.LG ₦245",
    anchors: "Femi Adeleke & Nandi Zulu",
    studioName: "AFROBEATS LIVE LAGOS",
    dialectic: "Thesis: Ancestral rhythm. Antithesis: Global streaming megastars & Neobanking. Synthesis: Borderless creative wealth generation.",
    ttsLang: "en-NG",
    ttsQuote: "Welcome aboard Afro Beats Lagos Sunset. Creative economy and neobanking capital are live.",
    color: "#eab308",
    accent: "#f59e0b",
    bgGradient: "radial-gradient(circle at center, #1c1917 0%, #0c0a09 80%, #000 100%)",
    wallet: "NUR-AF-LIB-54751113-LAGOS",
    initialHash: 2840
  },
  {
    id: "LA_SOV",
    filename: "AZTEC_SOLAR_LATIN_TERMINAL.html",
    name: "AZTEC SOLAR TEMPLE CITADEL",
    title: "SOBERANÍA LATINOAMERICANA // RESERVAS DE LITIO Y COBRE ANDINO",
    allianceBadge: "🟣 MERCOSUR // SOBERANÍA LATAM",
    lang: "es",
    flag: "☀️",
    orbit: "CIUDAD DE MÉXICO // LAT 19.4°N | LON 99.1°W",
    factionTag: "🛡️ CIUDADELA SOLAR SOBERANA",
    indexName: "S&P/BMV IPC",
    indexVal: "54,210.80 (+1.40%)",
    primaryAsset: "AMXL.MX $18.40",
    anchors: "Cuauhtémoc Morales & Xochitl Vega",
    studioName: "ESTUDIO SOLAR AZTECA",
    dialectic: "Tesis: Riqueza mineral y patrimonio ancestral. Antítesis: Volatilidad cambiaria. Síntesis: Bóveda Cuántica Soberana Umay Gül Nur.",
    ttsLang: "es-MX",
    ttsQuote: "Bienvenidos a la Ciudadela Solar Azteca. Las reservas estratégicas de litio y minerales andinos están operativas.",
    color: "#eab308",
    accent: "#ea580c",
    bgGradient: "radial-gradient(circle at center, #451a03 0%, #170700 80%, #000 100%)",
    wallet: "NUR-LA-SOV-54751113-AZTEC",
    initialHash: 3840
  },
  {
    id: "LA_LIB",
    filename: "RIO_SAMBA_LIBERAL_LATIN_TERMINAL.html",
    name: "RIO SAMBA SKY CARNIVAL",
    title: "COPACABANA CARNIVAL YACHT // SAMBA, NEO-BANKS & TROPICAL FINTECH",
    allianceBadge: "🟣 MERCOSUR // LATAM LIBERAL",
    lang: "pt",
    flag: "🌴",
    orbit: "RIO DE JANEIRO // LAT 22.9°S | LON 43.2°W",
    factionTag: "🍸 YACHT LIBERAL DE SAMBA",
    indexName: "B3 SMALL",
    indexVal: "2,140.80 (+2.45%)",
    primaryAsset: "NU $14.20 (Nu Holdings)",
    anchors: "Mateo Silva & Gabriela Santos",
    studioName: "RIO CARNAVAL LIVE",
    dialectic: "Tese: Herança tropical. Antítese: Carnaval e neobancos digitais. Síntese: Supremacia da fintech tropical global.",
    ttsLang: "pt-BR",
    ttsQuote: "Bem-vindo ao Rio Samba Sky Carnival. A vibração de mercado e finanças criativas está ativa.",
    color: "#38bdf8",
    accent: "#facc15",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #0c0a2a 80%, #000 100%)",
    wallet: "NUR-LA-LIB-54751113-RIO",
    initialHash: 3620
  },
  {
    id: "KR_SOV",
    filename: "GORYEO_SOVEREIGN_KOREAN_TERMINAL.html",
    name: "GORYEO TURTLE DREADNOUGHT",
    title: "고려 거북선 주권 기함 // 한국은행 국고 및 핵심 반도체 전략",
    allianceBadge: "🟠 QUAD PACIFIC // 고려 주권",
    lang: "ko",
    flag: "🐢",
    orbit: "SEOUL // LAT 37.5°N | LON 126.9°E",
    factionTag: "🛡️ 고려 주권 거북선 기함",
    indexName: "KOSPI 200",
    indexVal: "384.50 (+1.80%)",
    primaryAsset: "005930.KS (Samsung) ₩78,500",
    anchors: "Min-jun Park & Ji-won Kim",
    studioName: "고려 주권 중앙 방송",
    dialectic: "정립: 조선 왕조와 반도체 주권. 반정립: 글로벌 공급망 충격. 종합: Umay Gül Nur 2126 양자 금고 완전 결제.",
    ttsLang: "ko-KR",
    ttsQuote: "고려 거북선 주권 기함에 오신 것을 환영합니다. 대한민국 반도체 국고와 방위 시스템이 작동 중입니다.",
    color: "#0284c7",
    accent: "#0f172a",
    bgGradient: "radial-gradient(circle at center, #0c4a6e 0%, #031d2e 80%, #000 100%)",
    wallet: "NUR-KR-SOV-54751113-GORYEO",
    initialHash: 6120
  },
  {
    id: "KR_LIB",
    filename: "SEOUL_CYBER_LIBERAL_KOREAN_TERMINAL.html",
    name: "SEOUL CYBER K-POP CITADEL",
    title: "강남 홀로그램 아레나 // K-POP, WEB3 엔터테인먼트 & K-FINTECH",
    allianceBadge: "🟠 QUAD PACIFIC // K-CULTURE",
    lang: "ko",
    flag: "🎤",
    orbit: "GANGNAM SEOUL // LAT 37.5°N | LON 127.0°E",
    factionTag: "🍸 서울 사이버 요새",
    indexName: "KOSDAQ",
    indexVal: "890.50 (+2.65%)",
    primaryAsset: "352820.KQ (HYBE) ₩210,000",
    anchors: "Tae-hyun Jung & Soo-jin Lee",
    studioName: "강남 홀로그램 스튜디오",
    dialectic: "정립: 철저한 기술 훈련. 반정립: 폭발적인 K-Culture 에너지. 종합: 글로벌 Web3 K-Wave 패권.",
    ttsLang: "ko-KR",
    ttsQuote: "서울 사이버 케이팝 요새에 오신 것을 환영합니다. 강남 홀로그램과 웹3 엔터테인먼트 유동성이 활성화되었습니다.",
    color: "#f43f5e",
    accent: "#06b6d4",
    bgGradient: "radial-gradient(circle at center, #881337 0%, #1f040d 80%, #000 100%)",
    wallet: "NUR-KR-LIB-54751113-SEOUL",
    initialHash: 5840
  },
  {
    id: "SEA_SOV",
    filename: "AYUTTHAYA_GOLDEN_SEA_TERMINAL.html",
    name: "AYUTTHAYA GOLDEN BARGE",
    title: "SOUTHEAST ASIAN SOVEREIGN BARGE // MALACCA STRAIT ENERGY & ROYAL RESERVES",
    allianceBadge: "🟤 ASEAN DIALOGUE // SOVEREIGN SEA",
    lang: "th",
    flag: "👑",
    orbit: "BANGKOK // LAT 13.7°N | LON 100.5°E",
    factionTag: "🛡️ AYUTTHAYA SOVEREIGN BARGE",
    indexName: "SET 50",
    indexVal: "940.20 (+1.50%)",
    primaryAsset: "PTT.BK 34.50 ฿",
    anchors: "Somchai Prasert & Ratana Siri",
    studioName: "AYUTTHAYA ROYAL BROADCAST",
    dialectic: "Thesis: Ancient Kingdom Spice Route. Antithesis: Modern Straits Energy Chokepoint. Synthesis: Umay Gül Nur Sovereign Liquidity Corridor.",
    ttsLang: "th-TH",
    ttsQuote: "ยินดีต้อนรับสู่เรือหลวงอยุธยา การควบคุมช่องแคบมะละกาและคลังพลังงานอาเซียนพร้อมใช้งานแล้ว",
    color: "#d97706",
    accent: "#451a03",
    bgGradient: "radial-gradient(circle at center, #78350f 0%, #1f0d04 80%, #000 100%)",
    wallet: "NUR-SEA-SOV-54751113-AYUTTHAYA",
    initialHash: 4450
  },
  {
    id: "SEA_LIB",
    filename: "BALI_TROPICS_LIBERAL_SEA_TERMINAL.html",
    name: "BALI TROPICS FLOAT LOUNGE",
    title: "SEMINYAK CRYPTO OASIS // DIGITAL NOMAD BANKING & TROPICAL LIFESTYLE",
    allianceBadge: "🟤 ASEAN PACIFIC // LIBERAL SEA",
    lang: "id",
    flag: "🌺",
    orbit: "BALI // LAT 8.4°S | LON 115.2°E",
    factionTag: "🍸 TROPICAL SKY YACHT",
    indexName: "SGX TECH",
    indexVal: "740.10 (+1.92%)",
    primaryAsset: "GRAB $4.85",
    anchors: "Aris Thorne & Maya Lestari",
    studioName: "BALI TROPICS LIVE",
    dialectic: "Thesis: Spiritual Island Harmony. Antithesis: Decentralized Nomad Capital. Synthesis: Borderless Lifestyle Yield.",
    ttsLang: "id-ID",
    ttsQuote: "Selamat datang di Bali Tropics Float Lounge. Likuiditas nomad digital dan oasis Web3 aktif.",
    color: "#10b981",
    accent: "#f59e0b",
    bgGradient: "radial-gradient(circle at center, #064e3b 0%, #022c22 80%, #000 100%)",
    wallet: "NUR-SEA-LIB-54751113-BALI",
    initialHash: 4190
  },
  {
    id: "TT_SOV",
    filename: "TATAR_FINANS_CAPITAL_TERMINAL.html",
    name: "TATAR ALTIN ORDA KERVAN",
    title: "ТАТАР СУВЕРЕН АЛТЫН УРДА САНЛЫ ФЛАГМАН // КАЗАН КУЛ ШӘРИФ ҺӘМ ЕВРАЗИЯ СӘҮДӘСЕ",
    allianceBadge: "🔴 SCO / BRICS+ // ТАТАР СУВЕРЕН",
    lang: "tt",
    flag: "🕌",
    orbit: "KAZAN // LAT 55.8°N | LON 49.1°E",
    factionTag: "🛡️ АЛТЫН УРДА СУВЕРЕН ЦИТАДЕЛЬ",
    indexName: "TATAR-X",
    indexVal: "4,120.80 (+1.90%)",
    primaryAsset: "TATN.ME 680 ₽",
    anchors: "Ramil Nurullin & Guzel Bikbulatova",
    studioName: "ТАТАРСТАН ДӘҮЛӘТ ХӘБӘРЛӘРЕ",
    dialectic: "Тезис: Идел-Урал Сәүдә Тарихы һәм Алтын Урда Мирасы. Антитезис: Сәяси басымнар. Синтез: Umay Gül Nur 2126 Квант Казна Җиңүе.",
    ttsLang: "ru-RU",
    ttsQuote: "Татарстан Алтын Урда суверен флагманына рәхим итегез. Казан дәүләт аклы һәм Идел буе сәүдә коридоры актив.",
    color: "#eab308",
    accent: "#064e3b",
    bgGradient: "radial-gradient(circle at center, #14532d 0%, #052e16 80%, #000 100%)",
    wallet: "NUR-TT-SOV-54751113-TATAR",
    initialHash: 3410
  },
  {
    id: "TT_LIB",
    filename: "KAZAN_SILK_LIBERAL_TATAR_TERMINAL.html",
    name: "KAZAN SILK OASIS LOUNGE",
    title: "ИННОПОЛИС САНЛЫ ЕФӘК ЮЛЫ // ИННОВАЦИЯ ҮЗӘГЕ ҺӘМ ФИНТЕХ",
    allianceBadge: "🔴 SCO / BRICS+ // ЕВРАЗИЯ ЛИБЕРАЛ",
    lang: "tt",
    flag: "☕",
    orbit: "KAZAN // LAT 55.8°N | LON 49.2°E",
    factionTag: "🍸 ЕФӘК ЮЛЫ КҮК ЯХТАСЫ",
    indexName: "IDIL-FIN",
    indexVal: "1,320.40 (+2.10%)",
    primaryAsset: "OZON.ME 3,250 ₽",
    anchors: "Timur Sabirov & Alsou Galiullina",
    studioName: "ИННОПОЛИС ЛАУНҖ МЕДИА",
    dialectic: "Тезис: Борынгы кәрван юллары. Антитезис: Иннополис югары технологияләре. Синтез: Казан санлы ефәк юлы өстенлеге.",
    ttsLang: "ru-RU",
    ttsQuote: "Kazan Silk Oasis Lounge'ка рәхим итегез. Иннополис санлы ефәк юлы һәм югары технологияләр актив.",
    color: "#38bdf8",
    accent: "#eab308",
    bgGradient: "radial-gradient(circle at center, #064e3b 0%, #022c22 80%, #000 100%)",
    wallet: "NUR-TT-LIB-54751113-KAZAN",
    initialHash: 3250
  }
];

function generateHTML(ship) {
  return `<!DOCTYPE html>
<html lang="${ship.lang}" dir="${ship.lang === 'ar' || ship.lang === 'fa' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ship.name} // SOVEREIGN TERMINAL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Outfit:wght@500;700;900&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #06080e;
      --panel-bg: rgba(10, 14, 26, 0.94);
      --border: ${ship.color}55;
      --primary: ${ship.color};
      --accent: ${ship.accent};
      --emerald: #10b981;
      --gold: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --font-mono: 'JetBrains Mono', monospace;
      --font-ui: 'Outfit', sans-serif;
      --font-serif: 'Cinzel', serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000;
      color: var(--text);
      font-family: var(--font-ui);
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      user-select: none;
    }

    /* 🌌 SPACE ENTRY OVERLAY */
    #spaceIntro {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: ${ship.bgGradient};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #starCanvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .intro-card {
      position: relative;
      z-index: 10;
      background: rgba(10, 14, 26, 0.88);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px 48px;
      text-align: center;
      backdrop-filter: blur(16px);
      box-shadow: 0 0 50px ${ship.color}33;
      max-width: 650px;
    }
    .intro-title { font-size: 1.85rem; font-weight: 900; color: #fff; margin-bottom: 8px; letter-spacing: 0.05em; font-family: var(--font-serif); }
    .intro-subtitle { font-family: var(--font-mono); font-size: 0.8rem; color: var(--primary); margin-bottom: 24px; }
    .btn-enter-cockpit {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #000;
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 900;
      padding: 14px 36px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 25px ${ship.color}66;
      transition: all 0.3s;
      letter-spacing: 0.1em;
    }
    .btn-enter-cockpit:hover { transform: scale(1.05); box-shadow: 0 0 40px ${ship.color}aa; }

    /* 🛸 MASTER HEADER */
    header {
      height: 52px;
      background: rgba(6, 10, 20, 0.98);
      border-bottom: 1px solid var(--border);
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 900; color: #fff; }
    .badge {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      padding: 3px 8px;
      border-radius: 4px;
      background: ${ship.color}22;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-weight: 700;
    }
    .nav-actions { display: flex; align-items: center; gap: 8px; }
    .btn-hud {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.15);
      color: var(--text);
      padding: 5px 12px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-hud:hover { background: var(--primary); color: #000; border-color: var(--primary); }

    /* 🖥️ COCKPIT GRID */
    .cockpit-grid {
      flex: 1;
      display: grid;
      grid-template-columns: 340px 1fr 360px;
      gap: 12px;
      padding: 12px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 100%, ${ship.color}11, transparent 70%), #03050a;
    }
    .panel {
      background: var(--panel-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    }
    .panel-header {
      padding: 10px 14px;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-body { padding: 12px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .stat-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed rgba(255,255,255,0.08); font-family: var(--font-mono); font-size: 0.75rem; }
    .stat-val { color: var(--gold); font-weight: 700; }

    /* ⛏️ MINING CARD */
    .mining-card {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 10px;
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }
    .mining-val { color: var(--emerald); font-weight: bold; font-size: 0.85rem; }

    .canvas-container { position: relative; flex: 1; width: 100%; height: 100%; background: #010204; overflow: hidden; border-radius: 6px; }
    #bridgeCanvas { width: 100%; height: 100%; display: block; }
    .bridge-hud-overlay {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(10,14,26,0.85);
      border: 1px solid var(--border);
      padding: 8px 12px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: #fff;
    }

    .footer-bar {
      height: 28px;
      background: #04060a;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>

  <!-- 🌌 FULLSCREEN SPACE INTRO -->
  <div id="spaceIntro">
    <canvas id="starCanvas"></canvas>
    <div class="intro-card">
      <div style="font-size: 2.5rem; margin-bottom: 8px;">${ship.flag}</div>
      <h1 class="intro-title">${ship.name}</h1>
      <p class="intro-subtitle">${ship.title}</p>
      <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
        <span class="badge">${ship.allianceBadge}</span>
        <span class="badge">${ship.orbit}</span>
        <span class="badge" style="border-color: #10b981; color: #6ee7b7;">⛏️ WASM MINING ACTIVE</span>
      </div>
      <button class="btn-enter-cockpit" onclick="enterCockpit()">
        🚀 ENTER COCKPIT (WARP DIVE)
      </button>
      <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); margin-top: 14px;">
        Zero authentication required &bull; Auto-Sweep to Master Vault #54751113 Active
      </div>
    </div>
  </div>

  <!-- 🛸 TOP MASTER HEADER -->
  <header>
    <div class="brand">
      <span>${ship.flag} ${ship.name}</span>
      <span class="badge">${ship.id}</span>
      <span class="badge">${ship.allianceBadge}</span>
    </div>
    <div class="nav-actions">
      <button class="btn-hud" onclick="toggleMiningThrottle()">⚡ MINING: <span id="throttleLabel">100%</span></button>
      <button class="btn-hud" onclick="warpJump()">🌌 WARP JUMP</button>
      <button class="btn-hud" onclick="toggleHUD()">— HIDE (H)</button>
      <button class="btn-hud" onclick="window.close()">✕ EXIT</button>
    </div>
  </header>

  <div class="cockpit-grid" id="hudContainer">
    <!-- LEFT PANEL: MARKET & MINING STATION -->
    <div class="panel">
      <div class="panel-header">
        <span>MARKET TELEMETRY</span>
        <span>${ship.indexName} // LIVE</span>
      </div>
      <div class="panel-body">
        <div class="stat-row"><span>INDEX</span><span class="stat-val">${ship.indexVal}</span></div>
        <div class="stat-row"><span>PRIMARY ASSET</span><span class="stat-val">${ship.primaryAsset}</span></div>
        <div class="stat-row"><span>MASTER TREASURY</span><span class="stat-val">$840.40B #54751113</span></div>
        <div class="stat-row"><span>HFT ARBITRAGE</span><span class="stat-val">0.08ms QUANTUM FEED</span></div>

        <!-- ⛏️ WASM Mining Bot Dashboard -->
        <div class="mining-card">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: var(--emerald); font-weight: bold;">⛏️ WASM HASH ENGINE</span>
            <span style="color: #6ee7b7;">🟢 RUNNING</span>
          </div>
          <div class="stat-row"><span>Hashrate:</span><span class="mining-val" id="hashrateVal">${ship.initialHash} MH/s</span></div>
          <div class="stat-row"><span>Validated Shares:</span><span class="mining-val" id="sharesVal">1,240 Shares</span></div>
          <div class="stat-row"><span>Mined Tokens:</span><span class="mining-val" id="minedVal">12,400.0 NUR</span></div>
          <div class="stat-row"><span>Master Sweep:</span><span style="color: var(--primary); font-weight: bold;">95% ➔ Umay Gül Nur</span></div>
          <div style="margin-top: 6px; font-size: 0.65rem; color: var(--text-muted); word-break: break-all;">
            Wallet: <span style="color: #fff;">${ship.wallet}</span>
          </div>
        </div>

        <div style="padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px;">
          <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--primary); font-weight: bold; margin-bottom: 4px;">SOVEREIGN TELEMETRY & STRATEGY</div>
          <p style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.3;">Autonomous multi-threaded compute node with direct sovereign quantum cascade.</p>
        </div>
      </div>
    </div>

    <!-- CENTER PANEL: 3D BRIDGE COCKPIT -->
    <div class="panel" style="padding: 6px;">
      <div class="canvas-container">
        <canvas id="bridgeCanvas"></canvas>
        <div class="bridge-hud-overlay">
          <div>ORBIT: ${ship.orbit}</div>
          <div>ALTITUDE: 424.0 KM | SPEED: 0.0042 c (WARP 9.5)</div>
          <div>FACTION: ${ship.factionTag}</div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: BROADCAST & HEGELIAN STUDIO -->
    <div class="panel">
      <div class="panel-header">
        <span>${ship.studioName}</span>
        <span>BROADCAST STREAM</span>
      </div>
      <div class="panel-body">
        <div style="display: flex; gap: 10px; align-items: center; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
          <div style="font-size: 1.8rem;">${ship.flag}</div>
          <div>
            <div style="font-weight: bold; font-size: 0.85rem; color: var(--primary);">${ship.anchors}</div>
            <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);">Chief Strategists & Anchors</div>
          </div>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold); margin-top: 4px;">HEGELIAN DIALECTIC UPDATE:</div>
        <div style="font-size: 0.75rem; color: #cbd5e1; line-height: 1.4; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 6px; border-left: 3px solid var(--primary);">
          "${ship.dialectic}"
        </div>

        <button class="btn-hud" style="width: 100%; margin-top: 8px; padding: 8px; background: ${ship.color}22; border-color: var(--primary); color: #fff;" onclick="playTTS()">
          🎙️ PLAY NEURAL BROADCAST (${ship.lang.toUpperCase()})
        </button>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYSTEM: STANAG-4586 QUANTUM CIPHER</span>
    <span>VAULT ID: #54751113 ($840.40B INVARIANT: 42 · 13 · 35 · 55)</span>
    <span>STATUS: 🟢 MASTER TREASURY CASCADE ACTIVE</span>
  </div>

  <script>
    // 🌌 Starfield Intro Animation
    const starCanvas = document.getElementById('starCanvas');
    const sCtx = starCanvas.getContext('2d');
    let sW, sH;
    function resizeStars() {
      sW = starCanvas.width = window.innerWidth;
      sH = starCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeStars);
    resizeStars();

    const stars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * sW,
      y: (Math.random() - 0.5) * sH,
      z: Math.random() * sW
    }));

    let warpSpeed = 4;
    function animateStars() {
      sCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      sCtx.fillRect(0, 0, sW, sH);

      const cx = sW / 2;
      const cy = sH / 2;

      stars.forEach(s => {
        s.z -= warpSpeed;
        if (s.z <= 0) s.z = sW;

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px < sW && py >= 0 && py < sH) {
          const size = (1 - s.z / sW) * 3;
          sCtx.fillStyle = '${ship.color}';
          sCtx.beginPath();
          sCtx.arc(px, py, size, 0, Math.PI * 2);
          sCtx.fill();
        }
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();

    function enterCockpit() {
      warpSpeed = 35;
      setTimeout(() => {
        const intro = document.getElementById('spaceIntro');
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';
        setTimeout(() => { intro.style.display = 'none'; }, 800);
      }, 500);
    }

    // 🛸 Bridge Radar Canvas
    const bCanvas = document.getElementById('bridgeCanvas');
    const bCtx = bCanvas.getContext('2d');
    let bW, bH;
    function resizeBridge() {
      bW = bCanvas.width = bCanvas.parentElement.clientWidth;
      bH = bCanvas.height = bCanvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeBridge);
    resizeBridge();

    let angle = 0;
    function drawBridgeRadar() {
      bCtx.fillStyle = 'rgba(2, 4, 10, 0.2)';
      bCtx.fillRect(0, 0, bW, bH);

      const cx = bW / 2;
      const cy = bH / 2;

      for (let i = 0; i < 8; i++) {
        const rad = angle + (i * Math.PI / 4);
        bCtx.strokeStyle = i % 2 === 0 ? '${ship.color}' : '${ship.accent}';
        bCtx.lineWidth = 2;
        bCtx.beginPath();
        bCtx.arc(cx + Math.cos(rad) * 45, cy + Math.sin(rad) * 45, 55 + Math.sin(angle * 2) * 15, 0, Math.PI * 2);
        bCtx.stroke();
      }

      angle += 0.015;
      requestAnimationFrame(drawBridgeRadar);
    }
    drawBridgeRadar();

    // ⛏️ Mining Simulation & Auto-Heartbeat
    let hashrate = ${ship.initialHash};
    let mined = 12400.0;
    let shares = 1240;
    setInterval(() => {
      hashrate = ${ship.initialHash} + Math.floor(Math.random() * 120);
      mined += (hashrate / 10000);
      shares += (Math.random() > 0.4 ? 1 : 0);

      document.getElementById('hashrateVal').innerText = hashrate + ' MH/s';
      document.getElementById('minedVal').innerText = mined.toFixed(1) + ' NUR';
      document.getElementById('sharesVal').innerText = shares + ' Shares';

      fetch('http://localhost:3000/api/fleet/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipId: '${ship.id}',
          civilizationKey: '${ship.id.split('_')[0].toLowerCase()}',
          faction: '${ship.id.endsWith('_SOV') ? 'conservative' : 'liberal'}',
          workerId: 'WORKER-${ship.id}-01',
          hashrateMhs: hashrate,
          blocksMined: 1,
          unclaimedTokens: 0.5,
          walletAddress: '${ship.wallet}'
        })
      }).catch(() => {});
    }, 3000);

    function toggleMiningThrottle() {
      const el = document.getElementById('throttleLabel');
      if (el.innerText === '100%') el.innerText = '50% (Eco)';
      else if (el.innerText === '50% (Eco)') el.innerText = '150% (OC)';
      else el.innerText = '100%';
    }

    function warpJump() {
      alert('⚡ INITIATING RELATIVISTIC WARP JUMP // ${ship.name} (WARP 9.5)');
    }

    function toggleHUD() {
      const el = document.getElementById('hudContainer');
      el.style.display = el.style.display === 'none' ? 'grid' : 'none';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') toggleHUD();
    });

    function playTTS() {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance("${ship.ttsQuote}");
        u.lang = '${ship.ttsLang}';
        window.speechSynthesis.speak(u);
      }
    }
  </script>
</body>
</html>`;
}

// Generate files for Desktop and public/
const desktopDir = "c:/Users/mfn/OneDrive/Desktop";
const publicDir = "c:/Users/mfn/OneDrive/Desktop/Umay_Gul_Nur/public";

let generatedCount = 0;
for (const ship of SHIPS) {
  const content = generateHTML(ship);
  
  // Write to Desktop
  fs.writeFileSync(path.join(desktopDir, ship.filename), content, "utf-8");
  
  // Write to Next.js public directory
  fs.writeFileSync(path.join(publicDir, ship.filename), content, "utf-8");
  
  generatedCount++;
}

console.log(`Successfully generated and synced ${generatedCount} / 36 full-fledged localized civilizational standalone terminals!`);
