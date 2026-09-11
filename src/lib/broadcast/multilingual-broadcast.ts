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
      "Bitcoin ETF'lerine haftalık 890 milyon Dolar kurumsal girişi — yılın rekoru",
      "Türk ihracatı çeyreklik bazda 28 milyar Dolar ile tarihi zirveye ulaştı",
      "TCMB döviz rezervleri 148 milyar Dolar ile yeniden tüm zamanların en yüksek seviyesinde",
      "MSCI Türkiye endeksi yabancı yatırımcı alımlarıyla son bir yılın en büyük artışını kaydetti",
      "Anadolu Efes ve Türk Hava Yolları kurumsal gelir büyümesinde rekor kırdı",
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
      "DAX 40 klettert über 19.200 Punkte — SAP und Halbleiterwerte führen die Rally an",
      "EZB senkt Leitzins zum dritten Mal in Folge — Bund-Rendite fällt auf 2,05 Prozent",
      "Ifo-Geschäftsklimaindex steigt überraschend auf 87,2 Punkte — Stimmung dreht",
      "EUR/USD notiert fest bei 1,0920 vor Veröffentlichung der US-Arbeitsmarktdaten",
      "Goldpreis festigt Gewinne bei 2.450 US-Dollar — Zentralbankkäufe beschleunigen",
      "ASML-Rekordauftragsbuch von 42 Milliarden Euro katapultiert TecDAX nach oben",
      "Volkswagen Transformationsplan: 10 Milliarden Euro in KI-Fertigung investiert",
      "Deutsche Bundesanleihen verzeichnen stärkste Nachfrage seit zwei Jahren — Rendite fällt",
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
      "S&P 500 Futures rise 0.6% as mega-cap tech earnings beat by double-digit margins",
      "US ISM Services PMI accelerates to 54.8, beating economic consensus for fourth straight month",
      "10-Year Treasury yield eases to 4.18% — largest single-session demand at auction since 2021",
      "Crude Oil steadies at $82.40/bbl as Strait of Hormuz and Red Sea routes fully operational",
      "Bitcoin ETF cumulative inflows surpass $50 billion — institutional adoption milestone",
      "Nvidia market cap crosses $4 trillion — AI infrastructure spending shows no deceleration",
      "Federal Reserve signals data-dependent approach, two rate cuts priced by year-end",
      "Global sovereign wealth funds increase equity allocations to 60% — highest since 2019",
      "Dark pool institutional volume hits $18 billion intraday — largest accumulation event of 2025",
      "Gold breaks $2,500/oz as central banks accelerate de-dollarization reserve strategy",
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
      "Нефть марки Brent торгуется на уровне 82.40 долларов при полной стабильности поставок",
      "Золото сохраняет позиции выше 2450 долларов — центральные банки наращивают покупки",
      "Институциональные притоки в цифровые активы обновляют исторические максимумы",
      "Дубайский рынок недвижимости фиксирует приток капитала на уровне 18 млрд долларов",
      "Суверенные фонды Ближнего Востока увеличивают доли в технологических компаниях",
      "Рубль стабилизируется — нефтяные доходы поддерживают резервные позиции",
      "Криптовалютный рынок восстанавливается: Bitcoin снова у отметки 67,500 долларов",
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
      "أسعار النفط تستقر فوق 82 دولاراً للبرميل وسط تدفقات تجارية منتظمة عبر مضيق هرمز",
      "صناديق الاستثمار السيادية تعزز استثماراتها في التكنولوجيا المالية والذكاء الاصطناعي",
      "صندوق الاستثمارات العامة السعودي يضخ 20 مليار دولار في قطاع الطاقة المتجددة",
      "الذهب يتخطى 2450 دولاراً للأوقية مع تسارع وتيرة الشراء المصرفي المركزي العالمي",
      "سوق دبي للأوراق المالية يصل إلى قياس تاريخي جديد مع توسع قوي في قطاع التكنولوجيا",
      "إصدارات الصكوك الإسلامية تسجل مستويات قياسية مع تنامي الطلب العالمي على التمويل الإسلامي",
      "درهم إماراتي يحافظ على استقراره مع استمرار تدفقات الاستثمار الأجنبي المباشر",
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
      "Le CAC 40 progresse de 0,8 % — LVMH et les valeurs du luxe mènent la danse",
      "L'inflation en zone euro poursuit sa décélération : 2,1 % en rythme annuel",
      "L'or reste solidement ancré au-dessus des 2 450 dollars l'once — demande des banques centrales",
      "La BCE annonce un troisième assouplissement consécutif — taux de dépôt à 3,25 %",
      "TotalEnergies investit 8 milliards d'euros dans la transition énergétique africaine",
      "L'OAT française bénéficie d'une demande record à l'adjudication — spread face au Bund stable",
      "BNP Paribas et Société Générale publient des profits records grâce aux marges d'intérêt",
      "LVMH, Hermès et Kering : le luxe européen réalise le meilleur trimestre depuis 2022",
    ],
  },
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    langCode: "es-ES",
    flag: "🇪🇸",
    city: "Madrid / Ciudad de México",
    defaultAnchorName: "Mateo Rodríguez & Valeria Cruz",
    anchorAvatar: "/images/studio/anchor-male.jpg",
    scripts: {
      opening: `Buenos días y bienvenidos a Nur Finance. Les saluda Mateo Rodríguez desde nuestro centro de operaciones global. Los mercados internacionales abren con sesgo alcista, impulsados por el sólido desempeño del sector tecnológico, la estabilización de los precios energéticos y el fortalecimiento del consumo privado en economías avanzadas.`,
      macro: `En el ámbito macroeconómico, los indicadores de actividad confirman una expansión sostenida. El índice PMI compuesto de la zona euro alcanzó 52,4 puntos, superando el umbral de crecimiento por cuarto mes consecutivo. Por su parte, la Reserva Federal mantiene un tono prudente ante la rigidez residual en el mercado laboral, mientras el Banco Central Europeo señala que el ciclo de bajas de tipos está plenamente en marcha. En América Latina, los flujos de inversión extranjera directa hacia Brasil y México alcanzan máximos históricos trimestrales.`,
      quant: `Nuestros algoritmos cuantitativos detectan confluencia de señales alcistas en semiconductores, inteligencia artificial y energías renovables. La ratio de Sharpe ajustada de nuestra cartera multiactivo se mantiene en 3,18, con una exposición neta larga en renta variable tecnológica del 42 por ciento. El sistema de control de riesgo WISH Framework registra un regime de tendencia activo con una puntuación compuesta de 71 sobre 100.`,
      breaking: `ÚLTIMA HORA: Los flujos de capital institucional globales superan los veinte mil millones de dólares en fondos cotizados de inteligencia artificial durante la sesión matinal. El mercado de bonos soberanos europeos se estabiliza tras una subasta del Tesoro alemán con ratio de cobertura de 2,8 veces.`,
      closing: `Gracias por acompañarnos en este resumen financiero de Nur Finance. Toda la información analítica, ejecución de órdenes en tiempo real y estrategias cuantitativas avanzadas están disponibles en su terminal Nur Finance. Que tengan una jornada de trading exitosa y disciplinada.`,
    },
    headlines: [
      "El IBEX 35 supera los 11.200 puntos liderado por banca y tecnología",
      "Wall Street abre con máximos históricos en Nasdaq tras resultados récord del sector IA",
      "El petróleo Brent cotiza en 82,40 dólares con plena estabilidad en rutas marítimas",
      "El Banco Central Europeo recorta tipos 25 puntos básicos — euro se fortalece",
      "Inversión directa en México bate récords: 42.000 millones de dólares en el semestre",
      "El oro consolida por encima de 2.450 dólares en un contexto de diversificación soberana",
      "Los bonos del Tesoro de EEUU atraen la mayor demanda institucional del año",
      "Bitcoin mantiene soporte en 67.000 dólares con ETF acumulando posiciones largas",
    ],
  },

  // ── NUEVAS LENGUAS / NEW LANGUAGES ─────────────────────────────────────────

  {
    id: "zh",
    name: "Chinese (Mandarin)",
    nativeName: "中文（普通话）",
    langCode: "zh-CN",
    flag: "🇨🇳",
    city: "上海 / 香港",
    defaultAnchorName: "林静雯 & 张伟",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `各位投资者，大家好。欢迎收看NUR金融全球市场直播。我是主播林静雯，正在为您从上海和伦敦两地进行同步报道。今日全球资本市场延续强劲势头，人工智能、半导体及新能源板块引领科技股全面上涨。亚太主要指数普涨，沪深300指数突破关键阻力位，外资净买入规模创今年新高。`,
      macro: `宏观层面，国家统计局最新数据显示，中国制造业PMI回升至51.2，创下十八个月来新高，服务业活动指数亦攀升至52.8，内需回暖信号明显。与此同时，美联储货币政策立场趋于宽松，十年期美债收益率回落至4.2%附近，有效支撑全球股市估值扩张。中国人民银行持续实施适度宽松政策，流动性充裕为市场提供坚实支撑。中国国家主权财富基金持续增持高科技制造业资产，进一步强化市场信心。`,
      quant: `我们的量化模型显示，A股科技板块动量因子得分达到82分（满分100），属于强趋势区间。波动率指数VIX维持在14以下的低位，表明市场情绪稳健。我们的WISH框架综合信号分数为73，远超65的入场阈值，当前维持净多头配置。港股科技指数与A股半导体板块的跨市场套利机会已被我们的算法捕获，预期年化超额收益为18%。`,
      breaking: `突发快讯：全球领先半导体制造商宣布在华投资规模扩大至120亿美元，同比增长65%。中美贸易对话取得实质性进展，MSCI中国指数期货大幅跳涨2.3%。`,
      closing: `感谢您收看NUR金融全球市场直播。请登录您的NUR终端，获取最新量化策略报告、实时订单执行和全球宏观雷达数据。祝各位投资者交易顺利、收益丰厚。`,
    },
    headlines: [
      "沪深300指数大涨1.8%，外资单日净买入创今年最高纪录",
      "中国PMI连续三个月扩张，制造业复苏确立内需主导驱动力",
      "人民币对美元升破7.10，美联储宽松预期推动资金流入新兴市场",
      "港股科技板块领涨亚太，腾讯、阿里等互联网巨头全面走强",
      "中国新能源汽车出口量再破纪录——比亚迪单月销量超越特斯拉",
      "国内稀土储备战略调整，全球供应链重塑引发半导体板块大幅波动",
      "北京推出万亿级财政刺激计划，基础设施和人工智能双轮驱动",
      "上海原油期货与布伦特价差收窄，亚洲定价权逐步提升",
    ],
  },

  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    langCode: "ja-JP",
    flag: "🇯🇵",
    city: "東京 / 大阪",
    defaultAnchorName: "山田真理子 & 佐藤健一",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `皆さま、おはようございます。NURファイナンス・グローバルマーケット・デスクのライブ放送をお届けします。キャスターの山田真理子です。本日の東京市場は、日経225指数が力強く上昇して始まりました。半導体や人工知能関連株が相場をけん引する中、為替市場では円安基調が継続しており、輸出関連株の追い風となっています。`,
      macro: `マクロ経済面では、日本銀行が予想に反して追加利上げを決定し、政策金利を0.5%に引き上げました。これは1990年代以来最も積極的な金融正常化の一歩です。コアCPIは前年比2.8%と日銀の目標を上回る水準で推移しており、持続的なインフレ環境への移行を示唆しています。米国との金利差縮小により、ドル円相場は150円台での攻防が続いています。一方、企業業績は過去最高水準を更新する勢いで、自己株買いと増配を発表する企業が相次いでいます。`,
      quant: `私どもの量化モデルは、日本の金融・エネルギー・テクノロジーセクターで明確な買いシグナルを検出しています。WISH複合スコアは72ポイントで、トレンド相場レジームが確認されています。コーポレートガバナンス改革の継続により、ROE改善を伴う銘柄への機関投資家の資金流入が加速しています。`,
      breaking: `速報：日本政府が総額10兆円規模の次世代半導体産業支援パッケージを発表。TSMC第二工場の建設が正式に確定し、熊本県への外国直接投資として過去最大規模となります。`,
      closing: `NURファイナンスのマーケット速報をご視聴いただき、ありがとうございました。リアルタイムの注文執行、量化ストラテジー、グローバルリスクレーダーは、NURターミナルにてご利用いただけます。本日も充実した取引セッションをお過ごしください。`,
    },
    headlines: [
      "日経225が40,200円を回復——半導体・AI関連株が相場をリード",
      "日銀の追加利上げ観測で円が対ドルで147円台に上昇",
      "TSMCの熊本第2工場建設決定——日本の半導体産業に歴史的転換点",
      "東証プライムの自己株買い額が過去最高を更新——コーポレートガバナンス改革の成果",
      "トヨタの電気自動車戦略加速で自動車株が軒並み急騰",
      "日本国債の外国人投資家保有比率が過去最高に——イールドカーブ正常化が進む",
      "ソフトバンクのAIファンドが新興企業への投資を大幅拡大",
      "原油の円建て価格が下落——日本のエネルギーコスト改善でコア物価に好影響",
    ],
  },

  {
    id: "pt",
    name: "Portuguese (Brazil)",
    nativeName: "Português (Brasil)",
    langCode: "pt-BR",
    flag: "🇧🇷",
    city: "São Paulo / Lisboa",
    defaultAnchorName: "Fernanda Costa & Rafael Mendes",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Bom dia, investidores. Bem-vindos à transmissão ao vivo da Nur Finance. Sou Fernanda Costa, ao vivo de São Paulo. Os mercados globais operam em território positivo nesta manhã, com destaque para os ativos brasileiros, que se beneficiam do fluxo intenso de capital estrangeiro e dos dados sólidos de atividade doméstica. O Ibovespa futuro aponta alta superior a 1%, puxado por commodities, bancos e tecnologia.`,
      macro: `No cenário macroeconômico, o Brasil apresenta resiliência notável: o PIB cresceu 3,2% no último trimestre, superando as projeções do mercado. A inflação continua em trajetória de convergência para o centro da meta do Banco Central. A taxa Selic foi mantida em 10,5% ao ano, com sinalização de possível início de ciclo de afrouxamento no próximo trimestre. O real se fortalece frente ao dólar, com o câmbio recuando para R$ 4,85 impulsionado pelo diferencial de juros e pelo superávit comercial recorde. As exportações de minério de ferro, petróleo e soja permanecem em níveis recordes, sustentadas pela demanda chinesa robusta.`,
      quant: `Nossos modelos quantitativos identificam oportunidades de alfa no setor financeiro brasileiro, em mineração e no mercado de crédito privado. O framework WISH registra score composto de 69, com regime de tendência ativo. A Sharpe Ratio anualizada da carteira Brasil está em 2,94, com drawdown máximo controlado abaixo de 8%. O fluxo de arbitragem entre o Ibovespa e o S&P 500 permanece favorável para posições compradas em ativos brasileiros.`,
      breaking: `URGENTE: A Petrobras anuncia descoberta de nova reserva pré-sal com estimativa de 2,8 bilhões de barris de óleo equivalente na Bacia de Santos. Ações da estatal disparam 4,7% no pré-mercado. O Conselho Nacional de Política Energética confirma expansão do programa de biocombustíveis com investimentos de R$ 50 bilhões até 2030.`,
      closing: `Isso encerra nosso boletim de mercado da Nur Finance. Para acesso a análises quantitativas, execução de ordens em tempo real e monitoramento de risco geopolítico, acesse seu terminal Nur Finance. Desejamos a todos uma excelente sessão de negócios e muito sucesso nos investimentos.`,
    },
    headlines: [
      "Ibovespa supera 135.000 pontos puxado por commodities, bancos e setor de tecnologia",
      "Real se valoriza para R$ 4,85 com superávit comercial recorde e juros elevados",
      "Petrobras anuncia nova descoberta pré-sal de 2,8 bilhões de barris na Bacia de Santos",
      "Banco Central mantém Selic em 10,5% e sinaliza início de afrouxamento monetário",
      "Exportações brasileiras de soja, minério e petróleo batem recordes históricos",
      "BNDES anuncia programa de R$ 200 bilhões para transição energética e IA no Brasil",
      "Bovespa Future registra fluxo estrangeiro líquido comprador de R$ 3,2 bilhões na semana",
      "Bitcoin ultrapassa R$ 340.000 — corretoras brasileiras registram volume diário recorde",
    ],
  },

  {
    id: "it",
    name: "Italian",
    nativeName: "Italiano",
    langCode: "it-IT",
    flag: "🇮🇹",
    city: "Milano / Roma",
    defaultAnchorName: "Giulia Ferretti & Marco Rossi",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Buongiorno e benvenuti su Nur Finance. Sono Giulia Ferretti, in diretta dalla nostra sede di Milano. I mercati europei aprono con un tono costruttivo questa mattina, con Piazza Affari in rialzo grazie alle performance brillanti del settore bancario, delle utilities rinnovabili e del comparto lusso, vero fiore all'occhiello dell'economia italiana a livello globale.`,
      macro: `Sul fronte macroeconomico europeo, la BCE ha confermato la sua traiettoria di riduzione progressiva dei tassi di interesse, con due ulteriori tagli previsti entro fine anno. Il differenziale BTP-Bund si comprime a 140 punti base, segnalando un miglioramento della percezione del rischio sovrano italiano. Il PIL italiano cresce dell'1,4% su base annua, trainato da export manifatturiero, turismo internazionale e investimenti nel PNRR. La produzione industriale nel settore meccanica di precisione e moda-lusso tocca nuovi massimi storici.`,
      quant: `I nostri modelli quantitativi evidenziano una rotazione settoriale verso banche, energia pulita e titoli export-driven in Italia e nel resto d'Europa. Il framework WISH mostra un punteggio composito di 68 con regime di tendenza dominante. La Sharpe ratio del portafoglio europeo calibrato è di 3,01, con volatilità storica al 12% su base annua. Il carry trade sull'EUR/USD offre opportunità strutturali in questo contesto di divergenza di politica monetaria.`,
      breaking: `FLASH: Eni annuncia un'alleanza strategica con tre major africane del GNL per la fornitura di 15 miliardi di metri cubi aggiuntivi di gas naturale liquefatto all'Europa entro il 2026. Il progetto — da 18 miliardi di euro — è il più grande investimento energetico nella storia del gruppo. Le azioni Eni guadagnano il 3,2% in apertura.`,
      closing: `Con questo si conclude il nostro aggiornamento di mercato. Per analisi avanzate, execution algoritmica in tempo reale e il radar geopolitico globale, accedete al vostro terminale Nur Finance. Vi auguriamo una giornata di trading proficua e disciplinata.`,
    },
    headlines: [
      "FTSE MIB guadagna l'1,3% — banche e lusso trainano la performance italiana",
      "BTP decennale: rendimento scende al 3,85% con spread BTP-Bund a 140 punti base",
      "Eni sigla accordo GNL da 18 miliardi con partner africani per sicurezza energetica europea",
      "Ferrari batte le stime: ricavi +22% e utile per azione ai massimi storici",
      "L'export italiano del manifatturiero tocca quota 620 miliardi — primato storico",
      "La BCE taglia i tassi di 25 punti base — quarta riduzione consecutiva dell'anno",
      "Il settore lusso globale registra un rimbalzo: LVMH e Moncler guidano la ripresa",
      "Euro/Dollaro consolida a 1,0920 prima dei dati sull'occupazione statunitense",
    ],
  },

  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    langCode: "ko-KR",
    flag: "🇰🇷",
    city: "서울 / 부산",
    defaultAnchorName: "김지수 & 박준영",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `안녕하세요, 시청자 여러분. NUR파이낸스 글로벌 마켓 라이브에 오신 것을 환영합니다. 저는 김지수입니다. 오늘 코스피와 코스닥이 강세로 출발했습니다. 반도체, 인공지능, 이차전지 섹터가 시장을 선도하는 가운데 외국인 순매수세가 집중되고 있습니다. 삼성전자와 SK하이닉스의 HBM 메모리 수주 확대 소식이 시장 전반에 긍정적인 영향을 주고 있습니다.`,
      macro: `거시경제 측면에서 한국 수출은 전년 동월 대비 18.4% 증가하며 무역수지 흑자폭이 확대됐습니다. 특히 반도체 수출이 62억 달러를 기록하며 전체 수출의 성장을 주도했습니다. 한국은행은 기준금리를 현 수준에서 동결했으나, 하반기 중 인하 사이클 개시 가능성을 열어뒀습니다. 원달러 환율은 1,310원대에서 안정적인 흐름을 보이고 있으며, 외환보유고는 4,200억 달러를 웃돌고 있습니다.`,
      quant: `NUR의 퀀트 모델은 한국 반도체, 이차전지, 바이오 섹터에서 강한 매수 신호를 포착했습니다. WISH 프레임워크 복합 점수는 74점으로, 명확한 추세 레짐을 확인하고 있습니다. KOSPI200 선물과 미국 필라델피아 반도체 지수 간 스프레드는 역사적 고점에서 수렴 중이며, 이는 한국 반도체 종목의 상대적 저평가를 시사합니다.`,
      breaking: `속보: 삼성전자가 엔비디아와 차세대 HBM4 메모리 독점 공급 계약을 체결했습니다. 계약 규모는 총 85억 달러에 달하며, 이는 삼성전자 역사상 단일 메모리 계약 중 최대 규모입니다. 삼성전자 주가가 시간외 거래에서 4.8% 급등했습니다.`,
      closing: `NUR파이낸스 글로벌 마켓 라이브를 시청해 주셔서 감사합니다. 실시간 알고리즘 매매 시스템과 글로벌 리스크 레이더는 NUR 터미널에서 이용하실 수 있습니다. 성공적이고 수익성 높은 거래 세션이 되시길 바랍니다.`,
    },
    headlines: [
      "코스피 2,880 돌파 — 삼성전자·SK하이닉스 외국인 순매수 집중",
      "삼성전자-엔비디아 HBM4 독점 공급 계약 85억 달러 체결",
      "한국 반도체 수출 62억 달러 — 18개월 연속 두 자릿수 성장",
      "한국은행 기준금리 동결, 하반기 인하 사이클 시사",
      "코스닥 이차전지 지수 2.4% 급등 — 전기차 배터리 수주 확대",
      "원달러 환율 1,310원대 안정 — 경상수지 흑자 유지",
      "현대자동차 글로벌 전기차 판매 30만 대 돌파 — 유럽 점유율 사상 최고",
      "KRX 야간 선물 시장 거래량 급증 — 개인 투자자 레버리지 포지션 확대",
    ],
  },

  {
    id: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    langCode: "nl-NL",
    flag: "🇳🇱",
    city: "Amsterdam / Brussel",
    defaultAnchorName: "Sophie van den Berg & Pieter Janssen",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `Goedemorgen en welkom bij Nur Finance. Ik ben Sophie van den Berg, live vanuit ons handelsknooppunt in Amsterdam. De Europese aandelenmarkten openen vandaag krachtig hoger, met de AEX op het hoogste niveau in maanden. ASML en andere halfgeleiderbedrijven leiden de opmars, terwijl de Europese bankensector steun vindt in verbeterde nettorentemarge verwachtingen.`,
      macro: `Macroeconomisch gezien bevestigen de jongste PMI-cijfers een duurzame expansie in de eurozone. De Nederlandse economie groeit met 2,1 procent op jaarbasis, gesterkt door een uitzonderlijk sterke exportprestatie in hightech machines en chemische producten. De Europese Centrale Bank heeft haar derde renteverlaging van het jaar doorgevoerd, met verdere verlagingen in het vooruitzicht. De obligatiemarkten reageren positief, met dalende rendementen op tienjarige Bunds richting twee procent.`,
      quant: `Onze kwantitatieve modellen signaleren significante institutionele vraag naar Europese technologie- en industriële aandelen. Het WISH Framework toont een samengestelde score van 70 punten, wat een duidelijk trendregime bevestigt. De AEX versus S&P 500 spread is teruggekeerd naar historisch gemiddeld niveau, wat een potentieel voor verdere outperformance van Europese aandelen inhoudt. De Sharpe Ratio van onze Europese multiasset portefeuille staat op 2,87.`,
      breaking: `BREAKING: ASML kondigt een record orderportefeuille aan van 42 miljard euro voor geavanceerde EUV-lithografiemachines, met bezorgingsplannen tot en met 2028. Dit vertegenwoordigt de sterkste vraag naar chip productieapparatuur in de bedrijfsgeschiedenis. Het aandeel stijgt ruim 5 procent bij opening.`,
      closing: `Dit besluit onze marktupdate van Nur Finance. Voor geavanceerde kwantitatieve analyses, real-time orderuitvoering en geopolitieke risicomonitoring, opent u uw Nur Terminal. Wij wensen u een succesvolle en gedisciplineerde handelssessie.`,
    },
    headlines: [
      "AEX klimt naar hoogste punt in drie maanden — ASML en chipbedrijven leiden de rally",
      "ASML rapporteert recordorderboek van 42 miljard euro voor EUV-machines",
      "ECB verlaagt rente voor derde maal dit jaar — Bund-rendement daalt naar 2,1%",
      "Nederlandse export bereikt kwartaalrecord — hightech en chemie stuwen groei",
      "ING Groep en ABN AMRO boeken recordwinsten op hogere rentemarges",
      "Renewi en andere groene infra-aandelen winnen terrein na EU klimaatinvesterings­pakket",
      "EUR/USD stabiliseert op 1,0920 vóór publicatie Amerikaans arbeidsmarktrapport",
      "Bitcoin ETF instromen in Europa bereiken wekelijks record van 2,3 miljard dollar",
    ],
  },

  {
    id: "fa",
    name: "Persian (Farsi)",
    nativeName: "فارسی",
    langCode: "fa-IR",
    flag: "🇮🇷",
    city: "دبی / استانبول",
    defaultAnchorName: "سارا رضایی & کاوه محمدی",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `به گزارش‌های زنده بازارهای جهانی نور فاینانس خوش آمدید. من سارا رضایی هستم و این گزارش را از دوبی برای شما ارائه می‌دهم. امروز بازارهای مالی جهانی با رشد قابل توجهی در بخش‌های فناوری، انرژی و فلزات گرانبها آغاز به کار کردند. قیمت نفت خام در بالاترین سطح سه ماهه قرار دارد و طلا همچنان جایگاه محکمی به عنوان دارایی امن حفظ می‌کند.`,
      macro: `در بعد اقتصاد کلان، شاخص‌های فعالیت جهانی نشانه‌های مثبتی از بهبود تقاضا در اقتصادهای بازارهای نوظهور ارائه می‌دهند. خلیج فارس به عنوان یکی از مهم‌ترین مراکز لجستیک انرژی جهان، جریان پایدار و بی‌وقفه تجارت نفت و گاز طبیعی مایع را حفظ می‌کند. صندوق‌های ثروت ملی کشورهای خلیج فارس سرمایه‌گذاری‌های راهبردی خود را در بخش فناوری و زیرساخت دیجیتال تسریع می‌بخشند.`,
      quant: `مدل‌های کمی ما سیگنال‌های خرید قوی را در بخش‌های فلزات گرانبها، انرژی پاک و فناوری بازارهای نوظهور شناسایی کرده‌اند. چارچوب WISH نمره ترکیبی ۶۸ را نشان می‌دهد که نشان‌دهنده رژیم روند فعال است. نسبت شارپ سبد دارایی‌های خاورمیانه و کشورهای در حال توسعه در سطح ۲.۷۵ قرار دارد.`,
      breaking: `خبر فوری: بانک مرکزی امارات متحده عربی ذخایر طلای خود را ۱۵ درصد افزایش داد. این تصمیم در راستای استراتژی تنوع‌بخشی به ذخایر ارزی و کاهش وابستگی به دلار آمریکا اتخاذ شده است. قیمت طلا در معاملات آنی با رشد ۰.۸ درصدی به ۲۴۵۰ دلار رسید.`,
      closing: `از این که با بخش زنده بازارهای جهانی نور فاینانس همراه بودید، سپاسگزاریم. برای دسترسی به تحلیل‌های پیشرفته کمی، اجرای سفارش در زمان واقعی و رادار ریسک ژئوپلیتیک، به پایانه نور فاینانس خود مراجعه کنید. برای شما آرزوی موفقیت و سود فراوان داریم.`,
    },
    headlines: [
      "بازارهای خاورمیانه با رهبری بخش انرژی و فناوری رشد قوی ثبت کردند",
      "قیمت نفت خام برنت در ۸۲ دلار تثبیت شد — مسیرهای دریایی کاملاً باز است",
      "صندوق ثروت ملی امارات سرمایه‌گذاری در هوش مصنوعی را ۴۰ درصد افزایش داد",
      "طلا بالاتر از ۲۴۵۰ دلار تثبیت شد — خرید بانک‌های مرکزی به اوج رسید",
      "دلار آمریکا با کاهش انتظارات نرخ بهره تضعیف شد",
      "بازار کریپتو در منطقه خلیج فارس با افزایش معاملات نهادی رونق گرفت",
      "اوراق قرضه دولتی عربستان سعودی با بیشترین اشتراک سال مواجه شد",
      "سرمایه‌گذاری مستقیم خارجی در امارات به رکورد ۳۲ میلیارد دلار رسید",
    ],
  },

  {
    id: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    langCode: "hi-IN",
    flag: "🇮🇳",
    city: "मुंबई / दिल्ली",
    defaultAnchorName: "प्रिया शर्मा & अर्जुन मेहता",
    anchorAvatar: "/images/studio/anchor-female.jpg",
    scripts: {
      opening: `नमस्ते और नूर फाइनेंस ग्लोबल मार्केट्स लाइव में आपका स्वागत है। मैं हूँ प्रिया शर्मा, मुंबई से सीधे प्रसारण कर रही हूँ। आज सेंसेक्स और निफ्टी 50 मजबूत बढ़त के साथ खुले हैं। सूचना प्रौद्योगिकी, बैंकिंग और नवीकरणीय ऊर्जा क्षेत्रों में विदेशी संस्थागत निवेशकों की खरीदारी जारी है। भारतीय बाजार एशिया में सबसे तेज बढ़ने वाले प्रमुख बाजारों में से एक बने हुए हैं।`,
      macro: `व्यापक आर्थिक मोर्चे पर, भारत की GDP वृद्धि दर 7.8 प्रतिशत पर बनी हुई है, जो दुनिया की प्रमुख अर्थव्यवस्थाओं में सबसे तेज विस्तार दर्शाती है। भारतीय रिजर्व बैंक ने रेपो दर को 6.5 प्रतिशत पर स्थिर रखा है, जबकि मुद्रास्फीति 4.2 प्रतिशत पर है जो लक्ष्य सीमा के भीतर है। प्रत्यक्ष विदेशी निवेश प्रवाह 85 अरब डॉलर के नए वार्षिक रिकॉर्ड पर पहुंच गए हैं। PLI योजनाएं इलेक्ट्रॉनिक्स, अर्धचालक और नवीकरणीय ऊर्जा में विनिर्माण को गति दे रही हैं।`,
      quant: `हमारे क्वांटिटेटिव मॉडल्स भारतीय आईटी, वित्तीय सेवाओं और बुनियादी ढांचे के क्षेत्रों में मजबूत संकेत दे रहे हैं। WISH फ्रेमवर्क का समग्र स्कोर 71 है जो सक्रिय ट्रेंड रिजीम की पुष्टि करता है। निफ्टी 50 और MSCI उभरते बाजार सूचकांक के बीच स्प्रेड भारत में अल्फा उत्पन्न करने की ऐतिहासिक क्षमता का संकेत दे रहा है।`,
      breaking: `अत्यावश्यक सूचना: टाटा इलेक्ट्रॉनिक्स ने एपल के लिए iPhone निर्माण में 35 प्रतिशत वृद्धि की घोषणा की है। यह भारत को वैश्विक स्मार्टफोन आपूर्ति श्रृंखला में चीन के बाद दूसरा सबसे बड़ा उत्पादन केंद्र बनाएगा। BSE IT इंडेक्स 2.4 प्रतिशत की बढ़त के साथ कारोबार कर रहा है।`,
      closing: `नूर फाइनेंस के बाजार बुलेटिन के लिए आपका धन्यवाद। रियल-टाइम एल्गोरिदमिक ट्रेडिंग, क्वांटिटेटिव रणनीतियों और भू-राजनीतिक जोखिम रडार के लिए अपने नूर टर्मिनल से जुड़ें। आप सभी को शुभ और लाभदायक कारोबारी सत्र की शुभकामनाएं।`,
    },
    headlines: [
      "सेंसेक्स 82,000 के पार — IT और बैंकिंग शेयरों में विदेशी संस्थागत खरीदारी",
      "भारतीय GDP वृद्धि 7.8% — दुनिया की प्रमुख अर्थव्यवस्थाओं में सबसे तेज",
      "RBI रेपो दर 6.5% पर स्थिर, मुद्रास्फीति लक्ष्य दायरे में",
      "टाटा-Apple डील: iPhone उत्पादन 35% बढ़ाने पर सहमति",
      "विदेशी प्रत्यक्ष निवेश 85 अरब डॉलर के वार्षिक रिकॉर्ड पर",
      "निफ्टी 50 ने 25,000 अंक पार किया — बाजार पूंजीकरण 4 ट्रिलियन डॉलर",
      "भारतीय रुपया मजबूत — डॉलर के मुकाबले 83.20 पर स्थिर",
      "Zomato और Paytm ने तिमाही आय में मजबूत वृद्धि दर्ज की",
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
    onError?: (err: Error | SpeechSynthesisErrorEvent) => void
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
