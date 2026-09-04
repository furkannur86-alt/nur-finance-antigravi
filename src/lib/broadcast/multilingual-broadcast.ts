// NUR Finance Multilingual Broadcast & Voice Engine
// Provides 100% pure, native, non-pidgin financial scripts and high-definition speech synthesis.

export interface LanguageBroadcastProfile {
  id: string;
  name: string;
  nativeName: string;
  langCode: string;
  flag: string;
  city: string;
  defaultAnchorName: string;
  anchorAvatar: string;
  scripts: {
    opening: string;
    macro: string;
    quant: string;
    breaking: string;
    closing: string;
  };
  headlines: string[];
}

export const BROADCAST_LANGUAGES: LanguageBroadcastProfile[] = [
  {
    id: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    langCode: "tr-TR",
    flag: "🇹🇷",
    city: "İstanbul / Londra",
    defaultAnchorName: "Elif Nur & Emre Kaya",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `İyi günler sayın seyirciler. Nur Finans Küresel Piyasa Masası'ndan canlı yayınımız başlıyor. Ben Elif Nur. Bugün dünya borsalarında teknoloji hisselerinin öncülüğünde güçlü bir yükseliş dalgası izleniyor. BIST-100 endeksi ve Türkiye Cumhuriyet Merkez Bankası para politikası kararları masamızın ana gündem maddesi.`,
      macro: `Makroekonomik cephede küresel hizmet sektörü aktivite endeksi elli dört virgül sekiz seviyesine yükselerek güçlü büyümeyi teyit etti. Enflasyon beklentilerindeki ılımlı seyir, merkez bankalarının faiz indirim döngüsünü destekliyor. Hürmüz Boğazı ve Kızıldeniz tanker hatlarında emtia lojistiği analistlerimiz tarafından anlık olarak taranmaktadır.`,
      quant: `Kantitatif modellerimiz teknoloji ve finansal hizmetler sektörlerinde pozitif momentum sinyalleri üretiyor. Risk motorumuz VIX korku endeksinin on yedi seviyesinin altında dengelendiğini ve piyasa nötr arbitraj stratejilerimizin yıllık yüzde otuz sekiz getiri oranını koruduğunu gösteriyor.`,
      breaking: `SON DAKİKA GELİŞMESİ: Küresel enerji koridorlarında ham petrol arz güvenliği teyit edildi. Brent petrol seksen iki dolar bandında dengelenirken vadeli piyasalarda likidite akışı hızlandı.`,
      closing: `Nur Finans canlı bültenimizin sonuna geldik. Kesintisiz veri akışı ve algoritmik emir yönlendirmeleri için Nur Terminal ekranlarını takip etmeyi sürdürün. Hepinize bol kazançlı ve disiplinli bir seans dilerim.`,
    },
    headlines: [
      "BIST 100 Endeksi teknoloji ve sanayi hisseleri öncülüğünde güç kazanıyor",
      "TCMB Para Politikası Kurulu piyasa likidite dengesini korumaya devam ediyor",
      "Brent Petrol 82.40 Dolar seviyesinde dengelenirken tanker rotaları izleniyor",
      "S&P 500 ve Nasdaq vadeli kontratlarında teknoloji ve yarı iletken rallisi sürüyor",
      "Altın ons fiyatı 2,418 Dolar ile güvenli liman talebini muhafaza ediyor",
    ],
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    langCode: "de-DE",
    flag: "🇩🇪",
    city: "Frankfurt / Zürich",
    defaultAnchorName: "Hanna Nur & Klaus Weber",
    anchorAvatar: "/images/studio/anchor-male.jpg",
    scripts: {
      opening: `Guten Tag und herzlich willkommen bei Nur Finans Deutschland. Ich bin Klaus Weber und berichte live aus unserem Frankfurter Handelszentrum. Die europäischen Märkte eröffnen heute mit spürbaren Kursgewinnen im DAX 40 und EuroStoxx 50.`,
      macro: `Im Fokus steht die jüngste Zinsentscheidung der Europäischen Zentralbank. Das ifo-Geschäftsklima signalisiert erste Anzeichen einer Erholung in der verarbeitenden Industrie, während die Kerninflation im Dienstleistungssektor aufmerksam beobachtet wird.`,
      quant: `Unsere quantitativen Algorithmen verzeichnen eine signifikante Sektorrotation von defensiven Werten hin zu Industrie- und Halbleiteraktien. Die erwartete Sharpe-Ratio unseres Portfolios liegt stabil bei drei Komma zwei.`,
      breaking: `EILMELDUNG: Starke Nachfrage nach europäischen Staatsanleihen stabilisiert die Renditen der zehnjährigen Bundesanleihe bei zwei Komma drei Prozent.`,
      closing: `Das war unser aktueller Marktüberblick für den deutschsprachigen Raum. Sämtliche Orderbücher und quantitativen Analysen stehen Ihnen im Nur Terminal rund um die Uhr zur Verfügung. Einen erfolgreichen Handelstag.`,
    },
    headlines: [
      "DAX 40 klettert über 18.890 Punkte — SAP und Halbleiterwerte führen die Rally an",
      "EZB hält Leitzins stabil — Fokus richtet sich auf die Pressekonferenz",
      "Ifo-Geschäftsklimaindex steigt überraschend auf 87,2 Punkte",
      "EUR/USD notiert fest bei 1,0892 vor Veröffentlichung der US-Arbeitsmarktdaten",
      "Goldpreis festigt Gewinne oberhalb der Marke von 2.400 US-Dollar",
    ],
  },
  {
    id: "en",
    name: "English",
    nativeName: "English (US/UK)",
    langCode: "en-US",
    flag: "🇺🇸",
    city: "New York / London",
    defaultAnchorName: "Alexander Croft & Sarah Jenkins",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Good morning and welcome to the Nur Finance Global Macro Desk. I am Alexander Croft broadcasting live from New York. Global equity futures are advancing firmly this morning, led by institutional demand in artificial intelligence and enterprise software.`,
      macro: `On the macroeconomic front, the US ISM Services Index printed at 54.8, comfortably outpacing consensus estimates. Consumer sentiment indices remain robust, dampening recession probabilities while preserving Federal Reserve policy flexibility.`,
      quant: `Our cross-asset quantitative models indicate a market-neutral posture with an optimal Kelly allocation. Sector rotation remains heavily tilted towards Technology and Financials, while defensive sectors continue to underperform.`,
      breaking: `BREAKING NEWS: Institutional dark pool volume exceeds fifteen billion dollars in morning trading, confirming institutional accumulation across mega-cap equities.`,
      closing: `Thank you for tuning in to Nur Finance Global. For real-time execution algorithms and live geopolitical radar intelligence, access your Nur Terminal. Stay disciplined and trade well.`,
    },
    headlines: [
      "S&P 500 Futures rise 0.4% as mega-cap tech earnings outperform expectations",
      "US ISM Services PMI accelerates to 54.8, beating economic consensus",
      "10-Year Treasury yield eases to 4.22% amid strong auction demand",
      "Crude Oil steadies at $82.40/bbl as maritime chokepoints maintain normal flow",
      "Bitcoin consolidates near $67,500 following sustained ETF net inflows",
    ],
  },
  {
    id: "ru",
    name: "Russian",
    nativeName: "Русский",
    langCode: "ru-RU",
    flag: "🇷🇺",
    city: "Москва / Дубай",
    defaultAnchorName: "Виктория Смирнова",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Здравствуйте, уважаемые инвесторы. В эфире главный выпуск новостей Nur Finance. С вами Виктория Смирнова. Сегодня на мировых финансовых рынках преобладает оптимизм на фоне устойчивого роста сырьевых и технологических активов.`,
      macro: `Макроэкономические индикаторы указывают на стабильный баланс ликвидности. Рынки энергоносителей демонстрируют умеренный рост, в то время как спрос на защитные активы остается на стабильно высоком уровне.`,
      quant: `Наши квантовые торговые модели фиксируют повышенный приток институционального капитала в высокотехнологичные сектора с ожидаемым коэффициентом Шарпа свыше трех.`,
      breaking: `СРОЧНАЯ НОВОСТЬ: Международные торговые потоки сырой нефти и СПГ в Персидском заливе функционируют в штатном режиме под постоянным спутниковым мониторингом.`,
      closing: `На этом наш информационный выпуск завершен. Актуальные котировки и алгоритмические стратегии доступны в вашем терминале Nur Finance. Успешных торгов.`,
    },
    headlines: [
      "Мировые фондовые индексы продолжают уверенный рост на фоне сильных корпоративных отчетов",
      "Нефть марки Brent торгуется на уровне 82.40 долларов за баррель",
      "Золото сохраняет позиции выше 2400 долларов за тройскую унцию",
      "Институциональные притоки в цифровые активы обновляют исторические максимумы",
    ],
  },
  {
    id: "ar",
    name: "Arabic",
    nativeName: "العربية",
    langCode: "ar-SA",
    flag: "🇦🇪",
    city: "دبي / الرياض",
    defaultAnchorName: "زيد المنصور",
    anchorAvatar: "/images/studio/anchor-male.jpg",
    scripts: {
      opening: `أهلاً ومرحباً بكم في نشرة نور فاينانس الاقتصادية المباشرة من دبي. معكم زيد المنصور. تشهد الأسواق المالية العالمية اليوم أداءً إيجابياً قوياً مدعوماً بمكاسب قطاعي التكنولوجيا والطاقة.`,
      macro: `تؤكد البيانات الاقتصادية الكلية قوة تدفقات رؤوس الأموال الاستثمارية في أسواق الخليج والشرق الأوسط، مع استقرار أسعار الطاقة العالمية ومسارات الملاحة البحرية.`,
      quant: `تسجل خوارزمياتنا الكمية نمواً ملحوظاً في العوائد المعدلة حسب المخاطر، مع تدفقات سيولة قياسية في أسواق الأسهم والسلع الاستراتيجية.`,
      breaking: `خبر عاجل: استقرار كامل لحركة ناقلات النفط عبر مضيق هرمز مع استمرار المراقبة اللحظية عبر رادار نور الأرض ثلاثي الأبعاد.`,
      closing: `شكراً لمتابعتكم نشرة نور فاينانس. لمتابعة أحدث التحليلات وتنفيذ الصفقات المؤسسية، تفضلوا بزيارة منصة نور فاينانس. نتمنى لكم تداولات ناجحة.`,
    },
    headlines: [
      "أسواق الشرق الأوسط تسجل مكاسب قوية بدعم من قطاع الطاقة والاستثمار المؤسسي",
      "أسعار النفط تستقر فوق 82 دولاراً للبرميل وسط تدفقات تجارية منتظمة",
      "صناديق الاستثمار السيادية تعزز استثماراتها في التكنولوجيا المالية والذكاء الاصطناعي",
    ],
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    langCode: "fr-FR",
    flag: "🇫🇷",
    city: "Paris / Genève",
    defaultAnchorName: "Camille Dubois",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Bonjour à tous et bienvenue sur Nur Finance. Je suis Camille Dubois en direct de Paris. Les places financières européennes évoluent en hausse ce matin, portées par les valeurs technologiques et le secteur du luxe.`,
      macro: `Sur le plan macroéconomique, la publication des indices d'activité confirme la solidité de la demande mondiale. La Banque Centrale Européenne maintient une politique prudente, favorisant la stabilité monétaire de l'Eurozone.`,
      quant: `Nos modèles quantitatifs appliquent une stratégie neutre au marché, optimisant l'allocation d'actifs avec un ratio de Sharpe exceptionnel de trois virgule deux.`,
      breaking: `FLASH INFO : Les rendements obligataires souverains se détendent après des adjudications très largement souscrites par les investisseurs institutionnels.`,
      closing: `C'est la fin de notre point de marché. Retrouvez l'ensemble des analyses et flux d'ordres en direct sur votre terminal Nur Finance. Excellente journée de trading.`,
    },
    headlines: [
      "Le CAC 40 progresse de 0,6 % grâce aux valeurs technologiques et industrielles",
      "L'inflation en zone euro poursuit sa décélération conforme aux prévisions",
      "L'or reste solidement ancré au-dessus des 2 400 dollars l'once",
    ],
  },
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    langCode: "es-ES",
    flag: "🇪🇸",
    city: "Madrid / Ciudad de México",
    defaultAnchorName: "Mateo Rodríguez",
    anchorAvatar: "/images/studio/anchor-male.jpg",
    scripts: {
      opening: `Buenos días y bienvenidos a Nur Finance. Les saluda Mateo Rodríguez desde nuestro centro de operaciones. Los mercados globales cotizan con tono positivo impulsados por el sólido desempeño del sector tecnológico.`,
      macro: `En el ámbito macroeconómico, los datos de actividad confirman un crecimiento sostenido, mientras que los bancos centrales mantienen una postura de equilibrio en sus políticas monetarias.`,
      quant: `Nuestros algoritmos cuantitativos detectan oportunidades de arbitraje con bajo riesgo sistémico y un posicionamiento óptimo en renta variable internacional.`,
      breaking: `ÚLTIMA HORA: Los flujos de capital institucional registran un fuerte incremento en los mercados de materias primas y tecnología.`,
      closing: `Gracias por acompañarnos en este resumen financiero de Nur Finance. Toda la información y ejecución en tiempo real está disponible en su terminal. Que tengan una excelente jornada.`,
    },
    headlines: [
      "El IBEX 35 avanza con paso firme impulsado por el sector bancario y energético",
      "Wall Street abre al alza tras resultados empresariales favorables",
      "El petróleo Brent cotiza en 82,40 dólares con estabilidad en el suministro global",
    ],
  },
];

// Native Web Speech Engine Synthesizer
export class HighDefinitionVoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const prefix = langCode.split("-")[0].toLowerCase();

    // Prioritize natural / neural / premium browser voices
    const exactMatches = voices.filter(
      (v) => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.toLowerCase().startsWith(prefix)
    );

    if (exactMatches.length === 0) return null;

    const premiumKeywords = ["natural", "neural", "google", "premium", "microsoft", "siri", "pro", "enhanced"];
    for (const kw of premiumKeywords) {
      const match = exactMatches.find((v) => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }

    return exactMatches[0];
  }

  public speak(
    text: string,
    langCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.synth) {
      if (onError) onError(new Error("Speech synthesis not supported on this browser"));
      return;
    }

    // Stop current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.96; // Broadcast anchor professional cadence
    utterance.pitch = 1.0;

    const bestVoice = this.getBestVoiceForLanguage(langCode);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (onError) onError(e);
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const hdVoiceEngine = new HighDefinitionVoiceSynthesizer();
