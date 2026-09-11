"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import EagleCrest from "@/components/ui/EagleCrest";

export interface GeoEntity {
  id: string;
  type: "FLIGHT" | "TANKER" | "HOTSPOT" | "CHOKEPOINT" | "FIBER" | "NUCLEAR";
  name: string;
  code: string;
  lat: number;
  lon: number;
  targetLat?: number;
  targetLon?: number;
  altitudeKm?: number;
  speed?: string;
  cargo?: string;
  cargoValueUSD?: string;
  origin?: string;
  destination?: string;
  riskScore?: number;
  riskLevel?: "CRITICAL" | "HIGH" | "ELEVATED" | "STABLE";
  details: string;
  correlatedAssets: string[];
}

// Tile coordinate math for Esri World Imagery (free, no API key)
function latLonToTile(lat: number, lon: number, z: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, z));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, z)
  );
  return { x: Math.max(0, x), y: Math.max(0, y), z };
}

function esriTileUrl(z: number, y: number, x: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

// Comprehensive Global Flight Corridors
const LIVE_FLIGHTS: GeoEntity[] = [
  {
    id: "fl-1",
    type: "FLIGHT",
    name: "NUR Sovereign Trans-Atlantic Global",
    code: "NF-001 (LHR ➔ JFK)",
    lat: 51.5,
    lon: -0.12,
    targetLat: 40.71,
    targetLon: -74.0,
    altitudeKm: 11.5,
    speed: "Mach 0.85 (920 km/h)",
    origin: "London Heathrow (LHR)",
    destination: "New York (JFK)",
    details: "Kuzey Atlantik Ana Uçuş Koridoru. Kurumsal Finans & Diplomatik Transit Rotası.",
    correlatedAssets: ["BA", "DAL", "LHR=F"],
  },
  {
    id: "fl-2",
    type: "FLIGHT",
    name: "Pacific Tech Skyway Express",
    code: "TG-882 (HND ➔ SFO)",
    lat: 35.67,
    lon: 139.65,
    targetLat: 37.77,
    targetLon: -122.41,
    altitudeKm: 12.0,
    speed: "Mach 0.86 (940 km/h)",
    origin: "Tokyo Haneda (HND)",
    destination: "San Francisco (SFO)",
    details: "Asya-Silikon Vadisi yarı iletken ve yüksek teknoloji kargo uçağı.",
    correlatedAssets: ["NVDA", "TSM", "AAPL"],
  },
  {
    id: "fl-3",
    type: "FLIGHT",
    name: "Eurasia Silk Route Shuttle",
    code: "TK-009 (IST ➔ SIN)",
    lat: 41.0,
    lon: 28.97,
    targetLat: 1.35,
    targetLon: 103.81,
    altitudeKm: 11.8,
    speed: "Mach 0.84 (905 km/h)",
    origin: "Istanbul (IST)",
    destination: "Singapore Changi (SIN)",
    details: "Avrasya-Güneydoğu Asya finansal köprü hattı. Körfez hava sahası optimizasyonu.",
    correlatedAssets: ["THYAO", "SIA", "BIST100"],
  },
  {
    id: "fl-4",
    type: "FLIGHT",
    name: "Gulf-Europe Energy Executive",
    code: "EK-045 (DXB ➔ FRA)",
    lat: 25.2,
    lon: 55.27,
    targetLat: 50.11,
    targetLon: 8.68,
    altitudeKm: 11.2,
    speed: "Mach 0.83 (890 km/h)",
    origin: "Dubai Intl (DXB)",
    destination: "Frankfurt Main (FRA)",
    details: "Körfez sermaye fonları ve Avrupa Merkez Bankası eksenli finansal uçuş.",
    correlatedAssets: ["DAX", "EZB", "DUB=F"],
  },
  {
    id: "fl-5",
    type: "FLIGHT",
    name: "South Atlantic Trade Express",
    code: "LA-809 (GRU ➔ LIS)",
    lat: -23.55,
    lon: -46.63,
    targetLat: 38.72,
    targetLon: -9.13,
    altitudeKm: 12.2,
    speed: "Mach 0.84 (915 km/h)",
    origin: "São Paulo (GRU)",
    destination: "Lisbon (LIS)",
    details: "Güney Amerika - Avrupa tarım ve emtia ticaret heyeti hava köprüsü.",
    correlatedAssets: ["EWZ", "BRL=X", "VALE"],
  },
];

// Strategic Maritime Oil Tankers & LNG Carriers
const LIVE_TANKERS: GeoEntity[] = [
  {
    id: "tk-1",
    type: "TANKER",
    name: "VLCC Al-NUR Sovereign Supertanker",
    code: "IMO: 9874521 · VLCC",
    lat: 26.5,
    lon: 56.4,
    targetLat: 29.8,
    targetLon: 121.5,
    speed: "14.2 knots (26 km/h)",
    cargo: "2,100,000 Varil Arab Light Ham Petrol",
    cargoValueUSD: "$164,640,000 USD",
    origin: "Ras Tanura Terminal (Suudi Arabistan)",
    destination: "Ningbo Port (Çin)",
    riskScore: 78,
    riskLevel: "HIGH",
    details: "Hürmüz Boğazı çıkışında. Hürmüz'den geçen günlük 21 milyon varillik kritik petrol koridorunda seyrediyor.",
    correlatedAssets: ["BZ=F (Brent Petrol)", "CL=F (WTI)", "ZIM", "FRO"],
  },
  {
    id: "tk-2",
    type: "TANKER",
    name: "LNG Carrier Arctic Sovereign",
    code: "IMO: 9942100 · LNG Q-Flex",
    lat: 12.5,
    lon: 43.3,
    targetLat: 51.9,
    targetLon: 4.4,
    speed: "17.8 knots (33 km/h)",
    cargo: "174,000 m³ Sıvılaştırılmış Doğal Gaz (LNG)",
    cargoValueUSD: "$88,200,000 USD",
    origin: "Ras Laffan (Katar)",
    destination: "Rotterdam Energy Hub (Hollanda)",
    riskScore: 92,
    riskLevel: "CRITICAL",
    details: "Babülmendep Boğazı ve Kızıldeniz geçişinde askeri fırkateyn refakatinde intikal halinde.",
    correlatedAssets: ["NG=F (Doğalgaz)", "TTF=F (Avrupa Gaz)", "SHEL", "TTE"],
  },
  {
    id: "tk-3",
    type: "TANKER",
    name: "Malacca Strait Mega Crude Carrier",
    code: "IMO: 9781203 · ULCC",
    lat: 1.4,
    lon: 102.8,
    targetLat: 35.4,
    targetLon: 139.7,
    speed: "13.5 knots (25 km/h)",
    cargo: "3,000,000 Varil Brent Ham Petrol",
    cargoValueUSD: "$235,500,000 USD",
    origin: "Basra Port (Irak)",
    destination: "Yokohama (Japonya)",
    riskScore: 45,
    riskLevel: "ELEVATED",
    details: "Malakka Boğazı dar geçişinde. Doğu Asya'nın enerji arzının %80'inin aktığı hatta.",
    correlatedAssets: ["BZ=F", "NIKKEI225", "JPY=X"],
  },
  {
    id: "tk-4",
    type: "TANKER",
    name: "Aframax Black Sea Energy Carrier",
    code: "IMO: 9632145 · Aframax",
    lat: 41.2,
    lon: 29.1,
    targetLat: 36.8,
    targetLon: 34.6,
    speed: "10.0 knots (18 km/h)",
    cargo: "750,000 Varil Ham Petrol & Akaryakıt",
    cargoValueUSD: "$58,500,000 USD",
    origin: "Novorossiysk (Karadeniz)",
    destination: "Ceyhan / Akdeniz Rafinerileri",
    riskScore: 84,
    riskLevel: "HIGH",
    details: "İstanbul ve Çanakkale Boğazları geçişinde. Karadeniz jeopolitik mayın ve seyrüsefer risk zonunda.",
    correlatedAssets: ["BIST100", "TUPRS", "BZ=F"],
  },
];

// Strategic Chokepoints
const CHOKEPOINTS: GeoEntity[] = [
  {
    id: "cp-1",
    type: "CHOKEPOINT",
    name: "Hürmüz Boğazı (Strait of Hormuz)",
    code: "GLOBAL CHOKEPOINT #1",
    lat: 26.56,
    lon: 56.25,
    details: "Dünya petrol tüketiminin %21'i (günlük 21M varil) bu boğazdan geçer. Basra Körfezi'nin tek çıkış kapısı.",
    riskScore: 88,
    riskLevel: "HIGH",
    correlatedAssets: ["BZ=F (+%40 Sıçrama Riski)", "XAU/USD", "USO"],
  },
  {
    id: "cp-2",
    type: "CHOKEPOINT",
    name: "Babülmendep & Kızıldeniz (Bab-el-Mandeb)",
    code: "GLOBAL CHOKEPOINT #2",
    lat: 12.58,
    lon: 43.33,
    details: "Süveyş Kanalı'nın güney kilidi. Asya-Avrupa konteyner ticaretinin %12'si ve LNG sevkiyat rotası.",
    riskScore: 94,
    riskLevel: "CRITICAL",
    correlatedAssets: ["Konteyner Navlun (FBX)", "ZIM", "MAERSK", "BRENT"],
  },
  {
    id: "cp-3",
    type: "CHOKEPOINT",
    name: "Malakka Boğazı (Strait of Malacca)",
    code: "GLOBAL CHOKEPOINT #3",
    lat: 2.5,
    lon: 101.5,
    details: "Çin, Japonya ve G. Kore'nin petrol ithalatının %80'inin geçtiği dünyanın en yoğun deniz koridoru.",
    riskScore: 65,
    riskLevel: "ELEVATED",
    correlatedAssets: ["HANG SENG", "SHANGHAI COMPOSITE", "BRENT"],
  },
  {
    id: "cp-4",
    type: "CHOKEPOINT",
    name: "Süveyş Kanalı (Suez Canal)",
    code: "GLOBAL CHOKEPOINT #4",
    lat: 30.5,
    lon: 32.3,
    details: "Akdeniz ile Kızıldeniz'i bağlayan küresel ticaret omurgası. Yılda 22.000 gemi geçişi.",
    riskScore: 82,
    riskLevel: "HIGH",
    correlatedAssets: ["EGP=X", "BRENT", "GLOBAL FREIGHT INDEX"],
  },
];

// Geopolitical Defense Hotspots
const DEFENSE_HOTSPOTS: GeoEntity[] = [
  {
    id: "hs-1",
    type: "HOTSPOT",
    name: "Tayvan Boğazı & Doğu Asya Radarı",
    code: "DEFENSE ZONE: TAIWAN STRAIT",
    lat: 24.0,
    lon: 119.5,
    riskScore: 89,
    riskLevel: "CRITICAL",
    details: "Yarı iletken fabrikaları (TSMC), askeri deniz tatbikatları ve küresel çip tedarik zinciri kesinti riski.",
    correlatedAssets: ["TSM (-%25 Risk)", "NVDA", "SOXX", "USD/TWD"],
  },
  {
    id: "hs-2",
    type: "HOTSPOT",
    name: "Karadeniz & Doğu Avrupa Koridoru",
    code: "DEFENSE ZONE: BLACK SEA",
    lat: 44.5,
    lon: 35.0,
    riskScore: 95,
    riskLevel: "CRITICAL",
    details: "Tahıl koridoru, liman güvenliği, amonyak boru hatları ve bölgesel hava sahası kapama alanları.",
    correlatedAssets: ["WHEAT=F (Buğday)", "CORN=F", "EUR/USD", "BRENT"],
  },
  {
    id: "hs-3",
    type: "HOTSPOT",
    name: "Basra Körfezi & Hürmüz Askeri Zonu",
    code: "DEFENSE ZONE: PERSIAN GULF",
    lat: 27.0,
    lon: 51.5,
    riskScore: 86,
    riskLevel: "HIGH",
    details: "Tanker tacizleri, insansız deniz araçları ve hava savunma radarları kapsama alanı.",
    correlatedAssets: ["BZ=F", "GC=F (Altın)", "LMT (Lockheed Martin)"],
  },
];

// Global Nuclear Sites & Risk Zones
const NUCLEAR_ZONES: GeoEntity[] = [
  {
    id: "nz-1",
    type: "NUCLEAR",
    name: "Yongbyon Nükleer Araştırma Merkezi",
    code: "DPRK · YONGBYON COMPLEX",
    lat: 39.8,
    lon: 125.75,
    riskScore: 99,
    riskLevel: "CRITICAL",
    details: "Kuzey Kore'nin nükleer silah programının kalbi. 5MW reaktör aktif, plütonyum üretimi devam ediyor. IAEA denetimi yok.",
    correlatedAssets: ["KOSPI", "JPY=X", "KRW=X", "XAU/USD"],
  },
  {
    id: "nz-2",
    type: "NUCLEAR",
    name: "Natanz Uranyum Zenginleştirme Kompleksi",
    code: "IRAN · NATANZ UNDERGROUND",
    lat: 33.72,
    lon: 51.73,
    riskScore: 96,
    riskLevel: "CRITICAL",
    details: "İran'ın gizli yeraltı uranyum zenginleştirme kompleksi. %60+ zenginleştirme kapasitesi. İsrail & ABD hedef listesinde.",
    correlatedAssets: ["BZ=F", "XAU/USD", "TASE", "USD/ILS"],
  },
  {
    id: "nz-3",
    type: "NUCLEAR",
    name: "Bushehr Nükleer Santrali",
    code: "IRAN · BUSHEHR NPP",
    lat: 28.83,
    lon: 50.88,
    riskScore: 91,
    riskLevel: "CRITICAL",
    details: "İran'ın tek işletmedeki nükleer reaktörü. İsrail, ABD ve Suudi Arabistan'ın birincil hedef listesinde. Körfez krizine doğrudan bağlantı.",
    correlatedAssets: ["BZ=F", "XAU/USD", "GC=F", "USD/SAR"],
  },
  {
    id: "nz-4",
    type: "NUCLEAR",
    name: "Severodvinsk Nükleer Denizaltı Tersanesi",
    code: "RUSSIA · SEVERODVINSK NAVAL",
    lat: 64.55,
    lon: 39.83,
    riskScore: 88,
    riskLevel: "HIGH",
    details: "Rusya'nın en büyük nükleer denizaltı üretim ve bakım tesisi. 30+ stratejik nükleer denizaltı barındırıyor. Bulava ICBM test sahası.",
    correlatedAssets: ["RTS", "BRENT", "XAU/USD", "RUBUSD"],
  },
  {
    id: "nz-5",
    type: "NUCLEAR",
    name: "Sarov Federal Nükleer Silah Merkezi",
    code: "RUSSIA · SAROV CLOSED CITY",
    lat: 54.93,
    lon: 43.33,
    riskScore: 85,
    riskLevel: "HIGH",
    details: "Rusya'nın kapalı nükleer şehri 'Arzamas-16'. Sovyet döneminden kalma tüm nükleer başlık tasarım ve üretim merkezi.",
    correlatedAssets: ["RTS", "RUBUSD", "XAU/USD", "NG=F"],
  },
  {
    id: "nz-6",
    type: "NUCLEAR",
    name: "Dimona Nükleer Araştırma Merkezi",
    code: "ISRAEL · NEGEV NUCLEAR",
    lat: 30.97,
    lon: 35.14,
    riskScore: 82,
    riskLevel: "HIGH",
    details: "İsrail'in resmi olarak kabul etmediği nükleer silah programı merkezi. Tahmin: 90-400 nükleer başlık. 'Belirsizlik politikası' aktif.",
    correlatedAssets: ["TASE", "USD/ILS", "XAU/USD", "BZ=F"],
  },
  {
    id: "nz-7",
    type: "NUCLEAR",
    name: "Lop Nor Nükleer Test Sahası",
    code: "CHINA · LOP NOR XINJIANG",
    lat: 40.77,
    lon: 89.55,
    riskScore: 78,
    riskLevel: "HIGH",
    details: "Çin'in nükleer test ve silah geliştirme bölgesi. 300+ nükleer başlık. DF-41 ICBM tünel depolarına yakın. Sürekli modernizasyon.",
    correlatedAssets: ["CSI300", "CNY=X", "SHCOMP", "XAU/USD"],
  },
  {
    id: "nz-8",
    type: "NUCLEAR",
    name: "Kahuta Nükleer Araştırma Laboratuvarı",
    code: "PAKISTAN · KAHUTA KRL",
    lat: 33.68,
    lon: 73.38,
    riskScore: 88,
    riskLevel: "HIGH",
    details: "Pakistan'ın nükleer silah programı merkezi. Yaklaşık 165 nükleer başlık. Hindistan ile nükleer gerilim bölgesi. En yüksek proliferasyon riski.",
    correlatedAssets: ["EPI", "INR=X", "PKR=X", "XAU/USD"],
  },
  {
    id: "nz-9",
    type: "NUCLEAR",
    name: "Trombay Bhabha Atom Araştırma Merkezi",
    code: "INDIA · BARC MUMBAI",
    lat: 19.02,
    lon: 72.92,
    riskScore: 72,
    riskLevel: "HIGH",
    details: "Hindistan'ın nükleer silah araştırma merkezi. Pakistan ve Çin sınırındaki nükleer denge. 160+ başlık. MIRV geliştirme programı aktif.",
    correlatedAssets: ["SENSEX", "INR=X", "NIFTY50", "XAU/USD"],
  },
  {
    id: "nz-10",
    type: "NUCLEAR",
    name: "Pantex Nükleer Silah Montaj Kompleksi",
    code: "USA · PANTEX TEXAS",
    lat: 35.27,
    lon: -101.5,
    riskScore: 65,
    riskLevel: "ELEVATED",
    details: "ABD'nin birincil nükleer silah montaj ve bakım tesisi. Tüm ABD nükleer başlıklarının depolama ve modernizasyon merkezi.",
    correlatedAssets: ["LMT", "RTX", "NOC", "DXY"],
  },
  {
    id: "nz-11",
    type: "NUCLEAR",
    name: "Aldermaston AWE Silah Araştırma Üssü",
    code: "UK · ALDERMASTON AWE",
    lat: 51.38,
    lon: -1.28,
    riskScore: 60,
    riskLevel: "ELEVATED",
    details: "Birleşik Krallık'ın nükleer silah araştırma ve üretim merkezi. Trident nükleer caydırıcı programının kalbi. 225 aktif başlık.",
    correlatedAssets: ["FTSE100", "GBP/USD", "BAE.L", "XAU/USD"],
  },
  {
    id: "nz-12",
    type: "NUCLEAR",
    name: "CESTA CEA Nükleer Silah Merkezi",
    code: "FRANCE · CESTA LE BARP",
    lat: 44.65,
    lon: -0.83,
    riskScore: 58,
    riskLevel: "ELEVATED",
    details: "Fransa'nın nükleer silah araştırma merkezi. 290 nükleer başlık ile NATO'nun en büyük bağımsız nükleer gücü. ASMP-A füze programı.",
    correlatedAssets: ["CAC40", "EUR/USD", "AIR.PA", "XAU/USD"],
  },
];

// Continents wireframe polygons
const CONTINENTS: Array<Array<[number, number]>> = [
  [
    [70, -160], [72, -130], [60, -85], [55, -55], [45, -60], [30, -80], [25, -80], [18, -95], [10, -80],
    [8, -77], [15, -92], [22, -105], [32, -117], [48, -125], [60, -140], [65, -168], [70, -160],
  ],
  [
    [10, -75], [5, -52], [-5, -35], [-22, -40], [-35, -55], [-55, -68], [-50, -75], [-20, -70], [-5, -80], [10, -75],
  ],
  [
    [70, 25], [60, 30], [55, 20], [50, 10], [44, -1], [36, -6], [37, 0], [43, 5], [40, 18], [38, 24],
    [41, 29], [46, 30], [55, 38], [65, 40], [70, 25],
  ],
  [[58, -5], [51, 1], [50, -5], [58, -5]],
  [
    [36, -5], [37, 10], [32, 32], [28, 34], [12, 44], [-5, 40], [-25, 33], [-34, 18], [-22, 14], [0, 9],
    [5, 1], [15, -17], [30, -10], [36, -5],
  ],
  [
    [75, 40], [72, 80], [70, 130], [65, 175], [55, 160], [40, 140], [35, 120], [22, 115], [10, 105], [1, 104],
    [15, 100], [22, 88], [8, 77], [22, 70], [25, 60], [30, 48], [40, 40], [55, 40], [75, 40],
  ],
  [[-12, 130], [-15, 145], [-28, 153], [-38, 145], [-35, 115], [-20, 115], [-12, 130]],
  [[45, 142], [35, 140], [32, 130], [40, 140], [45, 142]],
];

// All event-driven zones (hotspots + nuclear) — auto-cycled every 8s
const AUTO_EVENT_ZONES = [...DEFENSE_HOTSPOTS, ...NUCLEAR_ZONES];

export default function NurEarth3DGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<GeoEntity | null>(DEFENSE_HOTSPOTS[1]);
  const [activeLayers, setActiveLayers] = useState({
    flights: true,
    tankers: true,
    hotspots: true,
    chokepoints: true,
    nuclear: true,
    grid: true,
  });
  const [autoEventMode, setAutoEventMode] = useState(true);
  const [eventIndex, setEventIndex] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(1.8);

  // Animation refs — all rendering goes through these, never state directly
  const yawRef = useRef(-1.2);
  const pitchRef = useRef(0.5);
  const zoomLiveRef = useRef(1.8);
  const targetYawRef = useRef(-1.2);
  const targetPitchRef = useRef(0.5);
  const targetZoomRef = useRef(1.8);

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const autoEventRef = useRef(autoEventMode);
  autoEventRef.current = autoEventMode;

  // 3D Spherical Math Helper
  const latLonTo3D = useCallback((lat: number, lon: number, radius: number, yaw: number, pitch: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
    const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
    return { x: x1, y: y2, z: z2, isVisible: z2 > -radius * 0.15 };
  }, []);

  // Compute exact target rotation to center globe on a lat/lon point
  const computeTargetRotation = useCallback((lat: number, lon: number) => {
    const theta = (lon + 180) * (Math.PI / 180);
    const targetYaw = Math.atan2(-Math.cos(theta), Math.sin(theta));
    const targetPitch = lat * (Math.PI / 180);
    return { targetYaw, targetPitch };
  }, []);

  // Focus globe on an entity with smooth zoom
  const focusOnEntity = useCallback(
    (entity: GeoEntity) => {
      const { targetYaw, targetPitch } = computeTargetRotation(entity.lat, entity.lon);
      // Shortest-path yaw wrap
      let dy = targetYaw - targetYawRef.current;
      while (dy > Math.PI) dy -= 2 * Math.PI;
      while (dy < -Math.PI) dy += 2 * Math.PI;
      targetYawRef.current = targetYawRef.current + dy;
      targetPitchRef.current = targetPitch;
      targetZoomRef.current = 1.85;
      setSelectedEntity(entity);
    },
    [computeTargetRotation]
  );

  // Event auto-cycle — replaces idle rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoEventRef.current) return;
      setEventIndex((prev) => {
        const next = (prev + 1) % AUTO_EVENT_ZONES.length;
        focusOnEntity(AUTO_EVENT_ZONES[next]);
        return next;
      });
    }, 8000);

    // Focus on first zone immediately
    focusOnEntity(AUTO_EVENT_ZONES[0]);

    return () => clearInterval(interval);
  }, [focusOnEntity]);

  // Mouse / Touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setAutoEventMode(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    targetYawRef.current += dx * 0.008;
    targetPitchRef.current = Math.max(-1.3, Math.min(1.3, targetPitchRef.current - dy * 0.008));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetZoomRef.current = Math.max(0.65, Math.min(3.0, targetZoomRef.current - e.deltaY * 0.001));
  };

  // Main 3D Render Loop — lerps toward targets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function render() {
      if (!canvas || !ctx) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      timeRef.current += 0.015;

      // Smooth lerp animation toward targets
      const lerpSpeed = 0.038;
      let dy = targetYawRef.current - yawRef.current;
      while (dy > Math.PI) dy -= 2 * Math.PI;
      while (dy < -Math.PI) dy += 2 * Math.PI;
      yawRef.current += dy * lerpSpeed;
      pitchRef.current += (targetPitchRef.current - pitchRef.current) * lerpSpeed;
      zoomLiveRef.current += (targetZoomRef.current - zoomLiveRef.current) * lerpSpeed;

      const localYaw = yawRef.current;
      const localPitch = pitchRef.current;
      const effectiveZoom = zoomLiveRef.current;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.38 * effectiveZoom;

      // Atmospheric glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, globeRadius * 1.35);
      glowGrad.addColorStop(0, "rgba(0, 212, 170, 0.12)");
      glowGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.06)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Ocean sphere
      const oceanGrad = ctx.createRadialGradient(cx - globeRadius * 0.3, cy - globeRadius * 0.3, 10, cx, cy, globeRadius);
      oceanGrad.addColorStop(0, "#0e1a2f");
      oceanGrad.addColorStop(0.6, "#060d18");
      oceanGrad.addColorStop(1, "#020409");
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Grid lines
      if (activeLayers.grid) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
        ctx.lineWidth = 0.6;
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let first = true;
          for (let lon = -180; lon <= 180; lon += 10) {
            const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
            if (p.isVisible) {
              if (first) { ctx.moveTo(cx + p.x, cy + p.y); first = false; }
              else ctx.lineTo(cx + p.x, cy + p.y);
            } else { first = true; }
          }
          ctx.stroke();
        }
        for (let lon = -180; lon < 180; lon += 45) {
          ctx.beginPath();
          let first = true;
          for (let lat = -80; lat <= 80; lat += 10) {
            const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
            if (p.isVisible) {
              if (first) { ctx.moveTo(cx + p.x, cy + p.y); first = false; }
              else ctx.lineTo(cx + p.x, cy + p.y);
            } else { first = true; }
          }
          ctx.stroke();
        }
      }

      // Continents
      ctx.fillStyle = "rgba(0, 212, 170, 0.09)";
      ctx.strokeStyle = "rgba(0, 212, 170, 0.4)";
      ctx.lineWidth = 1.2;
      CONTINENTS.forEach((polygon) => {
        ctx.beginPath();
        let anyVisible = false;
        let first = true;
        polygon.forEach(([lat, lon]) => {
          const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
          if (p.isVisible) {
            anyVisible = true;
            if (first) { ctx.moveTo(cx + p.x, cy + p.y); first = false; }
            else ctx.lineTo(cx + p.x, cy + p.y);
          }
        });
        if (anyVisible) { ctx.closePath(); ctx.fill(); ctx.stroke(); }
      });

      // Flight corridors
      if (activeLayers.flights) {
        LIVE_FLIGHTS.forEach((fl, idx) => {
          if (fl.targetLat === undefined || fl.targetLon === undefined) return;
          const arcPoints = 24;
          const progress = (timeRef.current * 0.15 + idx * 0.2) % 1;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 4]);
          let planePos: { x: number; y: number; z: number; isVisible: boolean } | null = null;
          for (let i = 0; i <= arcPoints; i++) {
            const t = i / arcPoints;
            const curLat = fl.lat + (fl.targetLat - fl.lat) * t;
            const curLon = fl.lon + (fl.targetLon - fl.lon) * t;
            const elevation = Math.sin(t * Math.PI) * globeRadius * 0.14;
            const p = latLonTo3D(curLat, curLon, globeRadius + elevation, localYaw, localPitch);
            if (p.isVisible) {
              if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
              else ctx.lineTo(cx + p.x, cy + p.y);
            }
            if (Math.abs(t - progress) < 0.05 && !planePos) planePos = p;
          }
          ctx.stroke();
          ctx.setLineDash([]);
          if (planePos && planePos.isVisible) {
            const px = cx + planePos.x;
            const py = cy + planePos.y;
            ctx.fillStyle = "#38bdf8";
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#e0f2fe";
            ctx.font = "bold 9px monospace";
            ctx.fillText(`✈ ${fl.code.split(" ")[0]}`, px + 6, py - 4);
          }
        });
      }

      // Tankers
      if (activeLayers.tankers) {
        LIVE_TANKERS.forEach((tk, idx) => {
          const p = latLonTo3D(tk.lat, tk.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 3 + idx) + 1) * 0.5;
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.3 + pulse * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 5 + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fde68a";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`🚢 ${tk.name.split(" ")[0]}`, px + 7, py + 3);
        });
      }

      // Defense Hotspots
      if (activeLayers.hotspots) {
        DEFENSE_HOTSPOTS.forEach((hs, idx) => {
          const p = latLonTo3D(hs.lat, hs.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 4 + idx) + 1) * 0.5;
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, 7 + pulse * 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fca5a5";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`⚔ ${hs.name.split(" ")[0]}`, px + 8, py - 6);
        });
      }

      // Chokepoints
      if (activeLayers.chokepoints) {
        CHOKEPOINTS.forEach((cp) => {
          const p = latLonTo3D(cp.lat, cp.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          ctx.fillStyle = "#a855f7";
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
          ctx.strokeRect(px - 4, py - 4, 8, 8);
          ctx.fillStyle = "#e9d5ff";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`🛢 ${cp.name.split(" ")[0]}`, px + 7, py + 9);
        });
      }

      // Nuclear Zones — radioactive marker with fallout ring
      if (activeLayers.nuclear) {
        NUCLEAR_ZONES.forEach((nz, idx) => {
          const p = latLonTo3D(nz.lat, nz.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 2.5 + idx * 0.7) + 1) * 0.5;
          const isSelected = selectedEntity?.id === nz.id;

          // Outer fallout ring
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.2 + pulse * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 10 + pulse * 7, 0, Math.PI * 2);
          ctx.stroke();

          // Inner warning circle
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.5 + pulse * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 5 + pulse * 2, 0, Math.PI * 2);
          ctx.stroke();

          // Core dot
          const coreColor = nz.riskLevel === "CRITICAL" ? "#f97316" : "#facc15";
          ctx.fillStyle = isSelected ? "#fff" : coreColor;
          ctx.shadowColor = coreColor;
          ctx.shadowBlur = isSelected ? 16 : 6;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label
          ctx.fillStyle = "#fef08a";
          ctx.font = `bold ${isSelected ? 10 : 8}px monospace`;
          ctx.fillText(`☢ ${nz.code.split("·")[0].trim()}`, px + 8, py - 4);
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeLayers, latLonTo3D, selectedEntity]);

  // Satellite tile grid for selected entity
  const satelliteTiles = selectedEntity
    ? (() => {
        const z = 9;
        const center = latLonToTile(selectedEntity.lat, selectedEntity.lon, z);
        const tiles = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            tiles.push({ x: center.x + dx, y: center.y + dy, z });
          }
        }
        return tiles;
      })()
    : [];

  const currentZone = AUTO_EVENT_ZONES[eventIndex];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black text-white relative select-none">
      {/* Top HUD */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b shrink-0 z-10"
        style={{ background: "rgba(11, 15, 23, 0.95)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-serif text-cyan-300 tracking-wide">
                NUR EARTH 3D — UYDU & JEOPOLİTİK RADAR
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                LIVE ORBIT
              </span>
              {autoEventMode && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 animate-pulse">
                  ⚡ AUTO-EVENT
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--ag-muted)]">
              Uydu Görüntüleri &bull; Nükleer Bölgeler &bull; Çatışma Zonları &bull; Petrol Tankerleri &bull; Boğaz Geçişleri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap justify-end max-w-2xl">
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, flights: !l.flights }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.flights
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ✈️ Uçuşlar ({LIVE_FLIGHTS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, tankers: !l.tankers }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.tankers
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            🚢 Tankerler ({LIVE_TANKERS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, hotspots: !l.hotspots }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.hotspots
                ? "bg-red-500/20 border-red-400 text-red-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ⚔️ Çatışma ({DEFENSE_HOTSPOTS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, chokepoints: !l.chokepoints }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.chokepoints
                ? "bg-purple-500/20 border-purple-400 text-purple-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            🛢️ Boğazlar ({CHOKEPOINTS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, nuclear: !l.nuclear }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.nuclear
                ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ☢️ Nükleer ({NUCLEAR_ZONES.length})
          </button>
          <button
            onClick={() => {
              setAutoEventMode((v) => {
                if (!v) focusOnEntity(AUTO_EVENT_ZONES[eventIndex]);
                return !v;
              });
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
              autoEventMode
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            {autoEventMode ? "⚡ OTO-EVENT" : "⏸ MANUEL"}
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Control hint */}
        <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono text-slate-400 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded border border-white/10 space-y-0.5">
          <div>🌐 <strong>Sürükle:</strong> 3D Küreyi Döndür</div>
          <div>🔍 <strong>Tekerlek:</strong> Yakınlaş / Uzaklaş</div>
          <div>⚡ <strong>Auto-Event:</strong> Her 8s yeni zone</div>
        </div>

        {/* Auto-event ticker strip */}
        {autoEventMode && (
          <div className="absolute bottom-16 left-4 right-4 z-10 flex items-center gap-3 bg-black/80 border border-yellow-500/30 rounded-lg px-4 py-2 backdrop-blur-sm pointer-events-none">
            <span className="text-[9px] font-mono font-bold text-yellow-400 uppercase tracking-widest shrink-0">
              ⚡ CANLI OLAY
            </span>
            <span className="text-[11px] font-bold text-white truncate">{currentZone?.name}</span>
            <span
              className={`ml-auto text-[9px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                currentZone?.riskLevel === "CRITICAL"
                  ? "bg-red-500/30 text-red-300 border border-red-500/40"
                  : currentZone?.riskLevel === "HIGH"
                  ? "bg-orange-500/30 text-orange-300 border border-orange-500/40"
                  : "bg-yellow-500/30 text-yellow-300 border border-yellow-500/40"
              }`}
            >
              {currentZone?.riskLevel}
            </span>
            <span className="text-[9px] font-mono text-slate-400 shrink-0">
              {eventIndex + 1}/{AUTO_EVENT_ZONES.length}
            </span>
          </div>
        )}

        {/* Quick entity selectors */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-1.5 max-w-xl overflow-x-auto no-scrollbar pb-1">
          {[...LIVE_TANKERS, ...DEFENSE_HOTSPOTS, ...NUCLEAR_ZONES.slice(0, 4)].map((ent) => (
            <button
              key={ent.id}
              onClick={() => {
                setAutoEventMode(false);
                focusOnEntity(ent);
              }}
              className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold shrink-0 border backdrop-blur-md transition-all ${
                selectedEntity?.id === ent.id
                  ? "bg-cyan-500/30 border-cyan-400 text-white shadow-lg"
                  : "bg-black/70 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {ent.type === "FLIGHT" ? "✈ " : ent.type === "TANKER" ? "🚢 " : ent.type === "NUCLEAR" ? "☢ " : "⚔ "}
              {ent.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Telemetry + Satellite Imagery Drawer */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 bottom-4 w-96 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-black/95 backdrop-blur-md p-5 shadow-2xl flex flex-col gap-4 overflow-y-auto z-20">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3 shrink-0">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  {selectedEntity.type === "NUCLEAR" ? "☢ NÜKLEER RİSK RADARI" : `${selectedEntity.type} TELEMETRİ`}
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedEntity.name}</h3>
                <p className="text-[11px] font-mono text-amber-300">{selectedEntity.code}</p>
              </div>
              {selectedEntity.riskLevel && (
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                    selectedEntity.riskLevel === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : selectedEntity.riskLevel === "HIGH"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {selectedEntity.riskLevel}
                </span>
              )}
            </div>

            {/* Satellite Imagery */}
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-wider">
                  🛰 ESRI UYDU GÖRÜNTÜLERİ
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {selectedEntity.lat.toFixed(2)}°, {selectedEntity.lon.toFixed(2)}°
                </span>
              </div>
              <div
                className="grid gap-0.5 rounded overflow-hidden border border-white/10"
                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
              >
                {satelliteTiles.map((tile, i) => (
                  <img
                    key={i}
                    src={esriTileUrl(tile.z, tile.y, tile.x)}
                    alt=""
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    style={{ imageRendering: "pixelated" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.background = "#0a1220";
                    }}
                  />
                ))}
              </div>
              <p className="text-[9px] font-mono text-slate-500 mt-1 text-center">
                Esri World Imagery · Zoom {satelliteTiles[0]?.z} · 3×3 Tile Grid
              </p>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-2 text-xs shrink-0">
              <div className="p-2.5 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">KONUM:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {selectedEntity.lat.toFixed(2)}°, {selectedEntity.lon.toFixed(2)}°
                </span>
              </div>
              {selectedEntity.speed && (
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-mono">HIZ:</span>
                  <span className="font-mono font-bold text-emerald-300">{selectedEntity.speed}</span>
                </div>
              )}
              {selectedEntity.riskScore && (
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-mono">RİSK SKORU:</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      selectedEntity.riskScore >= 90
                        ? "text-red-400"
                        : selectedEntity.riskScore >= 75
                        ? "text-orange-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedEntity.riskScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Cargo */}
            {selectedEntity.cargo && (
              <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 space-y-1 shrink-0">
                <span className="text-[10px] text-amber-400 block font-bold uppercase">Kargo:</span>
                <p className="text-xs text-white font-semibold">{selectedEntity.cargo}</p>
                {selectedEntity.cargoValueUSD && (
                  <p className="text-xs font-mono font-bold text-emerald-400">{selectedEntity.cargoValueUSD}</p>
                )}
              </div>
            )}

            {/* Route */}
            {selectedEntity.origin && selectedEntity.destination && (
              <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1.5 text-xs shrink-0">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kalkış:</span>
                  <span className="font-bold text-white">{selectedEntity.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Varış:</span>
                  <span className="font-bold text-cyan-300">{selectedEntity.destination}</span>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="space-y-1 text-xs shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {selectedEntity.type === "NUCLEAR" ? "Nükleer İstihbarat:" : "Stratejik İstihbarat:"}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] bg-white/5 p-2.5 rounded border border-white/5">
                {selectedEntity.details}
              </p>
            </div>

            {/* Correlated assets */}
            <div className="space-y-1.5 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Etkilenen Varlıklar:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEntity.correlatedAssets.map((ast, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                  >
                    {ast}
                  </span>
                ))}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setSelectedEntity(null)}
              className="mt-auto w-full py-2 rounded text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            >
              ✕ PANEL KAPAT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
