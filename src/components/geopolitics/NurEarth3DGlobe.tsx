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

// Nuclear Plants, Facilities & Weapons Sites
const NUCLEAR_SITES: GeoEntity[] = [
  {
    id: "nuc-1",
    type: "NUCLEAR",
    name: "Zaporizhzhia Nuclear Power Plant",
    code: "IAEA: ZNPP-01 &bull; UKRAINE",
    lat: 47.51,
    lon: 34.58,
    riskScore: 98,
    riskLevel: "CRITICAL",
    details: "Avrupa'nın en büyük nükleer santrali. Aktif çatışma bölgesinde soğutma hatları ve IAEA denetimi altında.",
    correlatedAssets: ["EUR/USD", "WHEAT=F", "ELECTRICITY_EU"],
  },
  {
    id: "nuc-2",
    type: "NUCLEAR",
    name: "Natanz Fuel Enrichment Plant",
    code: "IAEA: FEP-NATANZ &bull; IRAN",
    lat: 33.72,
    lon: 51.73,
    riskScore: 96,
    riskLevel: "CRITICAL",
    details: "%60 Saflıkta Zenginleştirilmiş Uranyum üretimi. Hava savunma sistemleri ve underground sığınak kompleksi.",
    correlatedAssets: ["BZ=F (Brent)", "GC=F (Altın)", "USO"],
  },
  {
    id: "nuc-3",
    type: "NUCLEAR",
    name: "Yongbyon Nuclear Scientific Research Center",
    code: "IAEA: YNG-01 &bull; NORTH KOREA",
    lat: 39.8,
    lon: 125.75,
    riskScore: 91,
    riskLevel: "CRITICAL",
    details: "Plütonyum üretim reaktörü ve nükleer deneme tesisleri bölgesi.",
    correlatedAssets: ["KRW=X", "NIKKEI225", "USD/JPY"],
  },
  {
    id: "nuc-4",
    type: "NUCLEAR",
    name: "Akkuyu Nuclear Power Plant Construction",
    code: "AKKUYU-NPP &bull; TÜRKIYE",
    lat: 36.14,
    lon: 33.54,
    riskScore: 40,
    riskLevel: "STABLE",
    details: "4.800 MW Kapasiteli Türkiye'nin İlk Nükleer Güç Santrali. Akdeniz Enerji Arz Güvenliği Omurgası.",
    correlatedAssets: ["BIST100", "TRY=X", "AKSEN"],
  },
];

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
    code: "IMO: 9874521 &bull; VLCC",
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
    code: "IMO: 9942100 &bull; LNG Q-Flex",
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
    code: "IMO: 9781203 &bull; ULCC",
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
    code: "IMO: 9632145 &bull; Aframax",
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

// Strategic Chokepoints (Global Boğazlar & Kanallar)
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

// Ultra-Detailed Coastlines & Continents 3D Polygons (Latitude, Longitude)
const CONTINENTS: Array<{ name: string; labelLat: number; labelLon: number; points: Array<[number, number]> }> = [
  // EUROPE
  {
    name: "EUROPE",
    labelLat: 54,
    labelLon: 15,
    points: [
      [71, 28], [70, 20], [62, 5], [58, 6], [54, 9], [53, 6], [50, 2], [48, -4], [43, -9], [37, -9],
      [36, -5], [37, 3], [43, 4], [44, 8], [38, 16], [40, 18], [37, 22], [41, 28], [45, 29], [46, 37],
      [55, 38], [60, 30], [65, 35], [70, 30], [71, 28]
    ]
  },
  // UNITED KINGDOM & IRELAND
  {
    name: "UK & IRELAND",
    labelLat: 54,
    labelLon: -2,
    points: [
      [58, -5], [58, -3], [54, 0], [51, 1], [50, -5], [52, -10], [55, -8], [58, -5]
    ]
  },
  // TÜRKIYE & MIDDLE EAST
  {
    name: "TÜRKIYE",
    labelLat: 39,
    labelLon: 35,
    points: [
      [42, 26], [41, 29], [41, 38], [41, 41], [37, 44], [37, 36], [36, 33], [36, 30], [38, 26], [40, 26], [42, 26]
    ]
  },
  // NORTH AMERICA
  {
    name: "NORTH AMERICA",
    labelLat: 45,
    labelLon: -100,
    points: [
      [72, -165], [71, -130], [68, -110], [60, -85], [55, -60], [47, -53], [44, -66], [35, -75], [25, -80],
      [25, -97], [18, -95], [15, -92], [16, -98], [22, -105], [32, -117], [34, -119], [48, -125], [60, -140],
      [65, -168], [72, -165]
    ]
  },
  // GREENLAND
  {
    name: "GREENLAND",
    labelLat: 72,
    labelLon: -40,
    points: [
      [78, -70], [82, -30], [75, -20], [60, -43], [65, -53], [78, -70]
    ]
  },
  // SOUTH AMERICA
  {
    name: "SOUTH AMERICA",
    labelLat: -15,
    labelLon: -60,
    points: [
      [12, -73], [10, -62], [7, -50], [-5, -35], [-12, -37], [-23, -43], [-34, -53], [-42, -64], [-55, -67],
      [-53, -74], [-40, -73], [-18, -70], [-5, -80], [4, -77], [12, -73]
    ]
  },
  // AFRICA
  {
    name: "AFRICA",
    labelLat: 5,
    labelLon: 20,
    points: [
      [36, -5], [37, 11], [33, 33], [28, 34], [15, 39], [12, 44], [10, 51], [2, 45], [-11, 40], [-25, 33],
      [-34, 26], [-34, 18], [-22, 14], [-12, 13], [-6, 12], [4, 9], [5, -3], [15, -17], [21, -17], [30, -10], [36, -5]
    ]
  },
  // ASIA (MAINLAND & SIBERIA)
  {
    name: "ASIA",
    labelLat: 48,
    labelLon: 85,
    points: [
      [73, 42], [73, 80], [71, 130], [66, 170], [60, 163], [55, 160], [44, 145], [40, 120], [22, 114],
      [10, 105], [1, 104], [10, 98], [22, 89], [8, 77], [22, 70], [25, 61], [30, 50], [40, 48], [42, 45],
      [55, 48], [65, 55], [73, 42]
    ]
  },
  // INDIA
  {
    name: "INDIA",
    labelLat: 20,
    labelLon: 78,
    points: [
      [25, 68], [24, 70], [15, 74], [8, 77], [13, 80], [20, 85], [26, 88], [28, 78], [25, 68]
    ]
  },
  // JAPAN
  {
    name: "JAPAN",
    labelLat: 36,
    labelLon: 138,
    points: [
      [45, 142], [40, 140], [35, 136], [32, 130], [34, 132], [41, 141], [45, 142]
    ]
  },
  // AUSTRALIA & NEW ZEALAND
  {
    name: "AUSTRALIA",
    labelLat: -25,
    labelLon: 135,
    points: [
      [-12, 130], [-12, 142], [-24, 153], [-37, 150], [-38, 140], [-35, 117], [-22, 114], [-12, 130]
    ]
  }
];

// High-Density Metropolitan City Night Lights (Spaceship Orbital Night Constellations)
const GLOBAL_CITIES = [
  // Europe
  { name: "LONDON", lat: 51.5, lon: -0.12, intensity: 1.0 },
  { name: "PARIS", lat: 48.85, lon: 2.35, intensity: 1.0 },
  { name: "BERLIN", lat: 52.52, lon: 13.4, intensity: 0.9 },
  { name: "ISTANBUL", lat: 41.0, lon: 28.97, intensity: 1.0 },
  { name: "ANKARA", lat: 39.93, lon: 32.85, intensity: 0.8 },
  { name: "MOSCOW", lat: 55.75, lon: 37.61, intensity: 1.0 },
  { name: "ROME", lat: 41.9, lon: 12.49, intensity: 0.9 },
  { name: "MADRID", lat: 40.41, lon: -3.7, intensity: 0.9 },

  // Americas
  { name: "NEW YORK", lat: 40.71, lon: -74.0, intensity: 1.0 },
  { name: "WASHINGTON", lat: 38.9, lon: -77.03, intensity: 0.9 },
  { name: "CHICAGO", lat: 41.87, lon: -87.62, intensity: 0.9 },
  { name: "LOS ANGELES", lat: 34.05, lon: -118.24, intensity: 1.0 },
  { name: "SÃO PAULO", lat: -23.55, lon: -46.63, intensity: 0.9 },
  { name: "TORONTO", lat: 43.65, lon: -79.38, intensity: 0.8 },

  // Middle East & Asia
  { name: "DUBAI", lat: 25.2, lon: 55.27, intensity: 1.0 },
  { name: "RIYADH", lat: 24.71, lon: 46.67, intensity: 0.9 },
  { name: "TOKYO", lat: 35.67, lon: 139.65, intensity: 1.0 },
  { name: "SHANGHAI", lat: 31.23, lon: 121.47, intensity: 1.0 },
  { name: "BEIJING", lat: 39.9, lon: 116.4, intensity: 1.0 },
  { name: "SINGAPORE", lat: 1.35, lon: 103.81, intensity: 0.9 },
  { name: "MUMBAI", lat: 19.07, lon: 72.87, intensity: 0.9 },
  { name: "HONG KONG", lat: 22.31, lon: 114.16, intensity: 1.0 },
  { name: "SYDNEY", lat: -33.86, lon: 151.2, intensity: 0.8 },
];

export default function NurEarth3DGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<GeoEntity | null>(LIVE_TANKERS[0]);
  const [activeLayers, setActiveLayers] = useState({
    flights: true,
    tankers: true,
    hotspots: true,
    chokepoints: true,
    nuclear: true,
    grid: true,
  });

  const [globeRotation, setGlobeRotation] = useState({ yaw: 0.8, pitch: 0.3 });
  const [zoom, setZoom] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoZoomEvents, setAutoZoomEvents] = useState(true);

  // Satellite tile image cache
  const [satTileUrl, setSatTileUrl] = useState<string | null>(null);

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const targetCamRef = useRef<{ yaw: number; pitch: number; zoom: number } | null>(null);

  const ALL_ENTITIES = [...DEFENSE_HOTSPOTS, ...NUCLEAR_SITES, ...LIVE_TANKERS, ...CHOKEPOINTS, ...LIVE_FLIGHTS];

  // Helper to convert lat/lon to ESRI Satellite Tile URL (World Imagery)
  const updateSatelliteTile = useCallback((lat: number, lon: number) => {
    // Zoom level 11 for high resolution satellite imagery
    const zoomLevel = 11;
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, zoomLevel);
    const xtile = Math.floor(((lon + 180) / 360) * n);
    const ytile = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);

    // ESRI World Imagery Tile Service (Free, No API key needed)
    const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoomLevel}/${ytile}/${xtile}`;
    setSatTileUrl(url);
  }, []);

  // Smooth camera fly-to animation for an entity
  const flyToEntity = useCallback((ent: GeoEntity) => {
    setSelectedEntity(ent);
    updateSatelliteTile(ent.lat, ent.lon);

    // Convert entity lat/lon to target Yaw/Pitch angles
    const targetYaw = -(ent.lon + 180) * (Math.PI / 180);
    const targetPitch = (ent.lat) * (Math.PI / 180) * 0.5;

    targetCamRef.current = {
      yaw: targetYaw,
      pitch: Math.max(-1.1, Math.min(1.1, targetPitch)),
      zoom: 1.65, // Zoom in to focus on conflict/nuclear site
    };
  }, [updateSatelliteTile]);

  // Auto-event rotation timer: Cycles through high-risk hotspots every 8 seconds
  useEffect(() => {
    if (!autoZoomEvents) return;

    const criticalZones = ALL_ENTITIES.filter((e) => e.riskLevel === "CRITICAL" || e.type === "NUCLEAR");
    let index = 0;

    const interval = setInterval(() => {
      if (isDragging.current) return;
      const nextEnt = criticalZones[index % criticalZones.length];
      flyToEntity(nextEnt);
      index++;
    }, 8000);

    return () => clearInterval(interval);
  }, [autoZoomEvents, flyToEntity]);

  // 3D Spherical Math Helper
  const latLonTo3D = useCallback((lat: number, lon: number, radius: number, yaw: number, pitch: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    // Standard 3D Cartesian
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    // Rotate around Y axis (Yaw)
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);

    // Rotate around X axis (Pitch)
    const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);

    return { x: x1, y: y2, z: z2, isVisible: z2 > -radius * 0.15 };
  }, []);

  // Mouse / Drag Handlers for 3D Orbiting
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setGlobeRotation((prev) => ({
      yaw: prev.yaw + dx * 0.008,
      pitch: Math.max(-1.2, Math.min(1.2, prev.pitch - dy * 0.008)),
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.65, Math.min(2.2, z - e.deltaY * 0.001)));
  };

  // Main 3D Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localYaw = globeRotation.yaw;
    let localPitch = globeRotation.pitch;

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

      // Smooth camera interpolation towards Target Yaw/Pitch/Zoom
      if (targetCamRef.current) {
        const dest = targetCamRef.current;
        localYaw += (dest.yaw - localYaw) * 0.05;
        localPitch += (dest.pitch - localPitch) * 0.05;

        setGlobeRotation({ yaw: localYaw, pitch: localPitch });
        setZoom((prevZ) => prevZ + (dest.zoom - prevZ) * 0.05);

        if (Math.abs(dest.yaw - localYaw) < 0.01 && Math.abs(dest.pitch - localPitch) < 0.01) {
          targetCamRef.current = null;
        }
      } else if (autoRotate) {
        localYaw += 0.003;
      } else {
        localYaw = globeRotation.yaw;
        localPitch = globeRotation.pitch;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.38 * zoom;

      // 1. Starfield Space Background (Spaceship Cockpit View)
      ctx.fillStyle = "rgba(10, 15, 26, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // Star particles
      for (let i = 0; i < 80; i++) {
        const starX = ((Math.sin(i * 99 + timeRef.current * 0.05) + 1) * 0.5) * width;
        const starY = ((Math.cos(i * 33 + timeRef.current * 0.02) + 1) * 0.5) * height;
        const starSize = (i % 3) === 0 ? 1.5 : 1;
        const starAlpha = 0.3 + 0.5 * Math.sin(timeRef.current * 2 + i);
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cosmic Atmosphere & Deep Space Halo Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.8, cx, cy, globeRadius * 1.4);
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
      glowGrad.addColorStop(0.5, "rgba(0, 212, 170, 0.08)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Oceanic Base Sphere with Realistic Day/Night Sunlight Shading
      // Sun position moves slowly around the planet
      const sunAngle = timeRef.current * 0.05;
      const sunX = cx + Math.cos(sunAngle) * globeRadius * 0.6;
      const sunY = cy - Math.sin(sunAngle) * globeRadius * 0.3;

      const oceanGrad = ctx.createRadialGradient(sunX, sunY, globeRadius * 0.1, cx, cy, globeRadius);
      oceanGrad.addColorStop(0, "#1e3a8a");   // Direct Sunlight Sapphire Blue
      oceanGrad.addColorStop(0.35, "#0f2b5c"); // Ocean Mid-Depth
      oceanGrad.addColorStop(0.7, "#061329");  // Twilight Zone
      oceanGrad.addColorStop(1, "#02060f");    // Night Side Deep Black
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Limb Glow (Realistic Space Edge Effect)
      const limbGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.93, cx, cy, globeRadius);
      limbGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
      limbGrad.addColorStop(0.8, "rgba(56, 189, 248, 0.25)");
      limbGrad.addColorStop(1, "rgba(186, 230, 253, 0.6)");
      ctx.fillStyle = limbGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Globe Rim Outer Ring
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 3. Grid Lines (Lat / Lon wireframe)
      if (activeLayers.grid) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
        ctx.lineWidth = 0.6;

        // Latitude circles
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let first = true;
          for (let lon = -180; lon <= 180; lon += 10) {
            const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
            if (p.isVisible) {
              if (first) {
                ctx.moveTo(cx + p.x, cy + p.y);
                first = false;
              } else {
                ctx.lineTo(cx + p.x, cy + p.y);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }

        // Longitude meridians
        for (let lon = -180; lon < 180; lon += 45) {
          ctx.beginPath();
          let first = true;
          for (let lat = -80; lat <= 80; lat += 10) {
            const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
            if (p.isVisible) {
              if (first) {
                ctx.moveTo(cx + p.x, cy + p.y);
                first = false;
              } else {
                ctx.lineTo(cx + p.x, cy + p.y);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }
      }

      // 4. Continents & Landmass Polygons in 3D (Emerald Topography & Labels)
      CONTINENTS.forEach((cont) => {
        ctx.beginPath();
        let anyVisible = false;
        let first = true;

        cont.points.forEach(([lat, lon]) => {
          const p = latLonTo3D(lat, lon, globeRadius, localYaw, localPitch);
          if (p.isVisible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(cx + p.x, cy + p.y);
              first = false;
            } else {
              ctx.lineTo(cx + p.x, cy + p.y);
            }
          }
        });

        if (anyVisible) {
          ctx.closePath();
          ctx.fillStyle = "rgba(0, 212, 170, 0.14)";
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 212, 170, 0.55)";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // Draw Continent Name Label on 3D Globe
        const lp = latLonTo3D(cont.labelLat, cont.labelLon, globeRadius + 2, localYaw, localPitch);
        if (lp.isVisible) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "bold 10px monospace";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          ctx.fillText(cont.name, cx + lp.x - 15, cy + lp.y);
          ctx.shadowBlur = 0;
        }
      });

      // 4.5. High-Density Metropolitan Night City Lights (ISS Orbital View)
      GLOBAL_CITIES.forEach((city, idx) => {
        const cp = latLonTo3D(city.lat, city.lon, globeRadius, localYaw, localPitch);
        if (!cp.isVisible) return;

        const px = cx + cp.x;
        const py = cy + cp.y;
        const twinkle = 0.6 + 0.4 * Math.sin(timeRef.current * 3 + idx * 7);

        // Golden city light aura
        ctx.fillStyle = `rgba(251, 191, 36, ${0.7 * twinkle})`;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 2 * city.intensity, 0, Math.PI * 2);
        ctx.fill();

        // White core spark
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // City Tag Label
        ctx.fillStyle = "rgba(253, 230, 138, 0.8)";
        ctx.font = "8px monospace";
        ctx.fillText(city.name, px + 5, py + 2);
      });

      // 5. Great-Circle Flight Corridors (Curved 3D Arcs + Moving Aircraft)
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
            // Arc elevation height
            const elevation = Math.sin(t * Math.PI) * globeRadius * 0.14;
            const p = latLonTo3D(curLat, curLon, globeRadius + elevation, localYaw, localPitch);

            if (p.isVisible) {
              if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
              else ctx.lineTo(cx + p.x, cy + p.y);
            }

            // Find current plane location
            if (Math.abs(t - progress) < 0.05 && !planePos) {
              planePos = p;
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw moving Aircraft Icon & Telemetry Tag
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

            // Aircraft label
            ctx.fillStyle = "#e0f2fe";
            ctx.font = "bold 9px monospace";
            ctx.fillText(`✈ ${fl.code.split(" ")[0]}`, px + 6, py - 4);
          }
        });
      }

      // 6. Strategic Maritime Oil Tankers & Vessels
      if (activeLayers.tankers) {
        LIVE_TANKERS.forEach((tk, idx) => {
          const p = latLonTo3D(tk.lat, tk.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 3 + idx) + 1) * 0.5;

          // Water ripple
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.3 + pulse * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 5 + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();

          // Tanker dot
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();

          // Vessel Label
          ctx.fillStyle = "#fde68a";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`🚢 ${tk.name.split(" ")[0]}`, px + 7, py + 3);
        });
      }

      // 7. Geopolitical Hotspots & Radar Rings
      if (activeLayers.hotspots) {
        DEFENSE_HOTSPOTS.forEach((hs, idx) => {
          const p = latLonTo3D(hs.lat, hs.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 4 + idx) + 1) * 0.5;

          // Concentric pulsing radar warning
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

      // 8. Nuclear Facilities & Strategic Power Plants
      if (activeLayers.nuclear) {
        NUCLEAR_SITES.forEach((nuc, idx) => {
          const p = latLonTo3D(nuc.lat, nuc.lon, globeRadius, localYaw, localPitch);
          if (!p.isVisible) return;
          const px = cx + p.x;
          const py = cy + p.y;
          const pulse = (Math.sin(timeRef.current * 5 + idx) + 1) * 0.5;

          // Radiation warning ring
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.5 + pulse * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 9 + pulse * 6, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#facc15";
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`☢ ${nuc.name.split(" ")[0]}`, px + 8, py - 7);
        });
      }

      // 9. Strategic Maritime Chokepoints
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

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [globeRotation, zoom, autoRotate, activeLayers, latLonTo3D]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black text-white relative select-none">
      {/* Top HUD Control Bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b shrink-0 z-10"
        style={{ background: "rgba(11, 15, 23, 0.95)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-serif text-cyan-300 tracking-wide">
                NUR EARTH 3D — SATELLITE & GEOPOLITICAL RADAR
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                LIVE ORBIT
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                nurfinans.com
              </span>
            </div>
            <p className="text-[10px] text-[var(--ag-muted)]">
              Küresel Uçuş Hatları &bull; Canlı Petrol Tankerleri &bull; Boğaz Geçişleri &bull; Savunma & Jeopolitik Risk Radarı
            </p>
          </div>
        </div>

        {/* Layer Toggles & Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, nuclear: !l.nuclear }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.nuclear
                ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-sm"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ☢️ Nükleer Tesisler ({NUCLEAR_SITES.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, hotspots: !l.hotspots }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.hotspots
                ? "bg-red-500/20 border-red-400 text-red-300 shadow-sm"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ⚔️ Çatışma Zonu ({DEFENSE_HOTSPOTS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, tankers: !l.tankers }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.tankers
                ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            🚢 Petrol Tankerleri ({LIVE_TANKERS.length})
          </button>
          <button
            onClick={() => setActiveLayers((l) => ({ ...l, flights: !l.flights }))}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
              activeLayers.flights
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
          >
            ✈️ Uçuş Hatları ({LIVE_FLIGHTS.length})
          </button>
          <button
            onClick={() => setAutoZoomEvents((r) => !r)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
              autoZoomEvents
                ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm animate-pulse"
                : "bg-black/40 border-white/10 text-slate-400"
            }`}
            title="Sıradaki olay bölgesine otomatik dön ve zoom yap (8 saniye)"
          >
            {autoZoomEvents ? "📡 OTO ZOOM & DÖNÜŞ (8s)" : "⏸ MANUEL"}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Orbit Control Hint Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono text-slate-400 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded border border-white/10 space-y-0.5">
          <div>🌐 <strong>Fareyle Sürükle:</strong> 3D Küreyi Döndür</div>
          <div>🔍 <strong>Tekerlek:</strong> Yakınlaş / Uzaklaş ({zoom.toFixed(1)}x)</div>
          <div>⚡ <strong>Gerçek Zamanlı:</strong> 60 FPS WebGL/Canvas 3D Motoru</div>
        </div>

        {/* Quick Entity Selector Grid (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2 max-w-xl overflow-x-auto no-scrollbar pb-1">
          {[...LIVE_TANKERS, ...LIVE_FLIGHTS, ...DEFENSE_HOTSPOTS].map((ent) => (
            <button
              key={ent.id}
              onClick={() => setSelectedEntity(ent)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold shrink-0 border backdrop-blur-md transition-all ${
                selectedEntity?.id === ent.id
                  ? "bg-cyan-500/30 border-cyan-400 text-white shadow-lg"
                  : "bg-black/70 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {ent.type === "FLIGHT" ? "✈ " : ent.type === "TANKER" ? "🚢 " : "⚔ "}
              {ent.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Live Telemetry & Inspector Drawer (Right Side) */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 bottom-4 w-96 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-black/95 backdrop-blur-md p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-20">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                    {selectedEntity.type} TELEMETRİ RADARI
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedEntity.name}</h3>
                  <p className="text-[11px] font-mono text-amber-300">{selectedEntity.code}</p>
                </div>
                {selectedEntity.riskLevel && (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      selectedEntity.riskLevel === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {selectedEntity.riskLevel}
                  </span>
                )}
              </div>

              {/* Real Satellite Photo Feed (Esri World Imagery) */}
              <div className="space-y-1.5 p-3 rounded-lg bg-black/60 border border-cyan-500/30">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="font-bold text-cyan-300 uppercase flex items-center gap-1">
                    <span>📡 CANLI UYDU GÖRÜNTÜSÜ (ESRI WORLD IMAGERY)</span>
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">HIGH-RES</span>
                </div>
                {satTileUrl ? (
                  <div className="relative h-44 rounded overflow-hidden border border-white/10 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={satTileUrl}
                      alt="Uydu Görüntüsü"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded">
                      UYDU ZOOM: 11x &bull; LAT: {selectedEntity.lat.toFixed(2)}°
                    </div>
                  </div>
                ) : (
                  <div className="h-36 rounded bg-slate-900 flex items-center justify-center text-xs text-slate-500 font-mono">
                    Uydu Akışı Yükleniyor...
                  </div>
                )}
              </div>

              {/* Geo Coordinates & Speed */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-mono">KONUM:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {selectedEntity.lat.toFixed(2)}°N, {selectedEntity.lon.toFixed(2)}°E
                  </span>
                </div>
                {selectedEntity.speed && (
                  <div className="p-2.5 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">HIZ:</span>
                    <span className="font-mono font-bold text-emerald-300">{selectedEntity.speed}</span>
                  </div>
                )}
              </div>

              {/* Cargo & Value (For Tankers & Planes) */}
              {selectedEntity.cargo && (
                <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] text-amber-400 block font-bold uppercase">Kargo Manifestosu:</span>
                  <p className="text-xs text-white font-semibold">{selectedEntity.cargo}</p>
                  {selectedEntity.cargoValueUSD && (
                    <p className="text-xs font-mono font-bold text-emerald-400">
                      Tahmini Değer: {selectedEntity.cargoValueUSD}
                    </p>
                  )}
                </div>
              )}

              {/* Route: Origin & Destination */}
              {selectedEntity.origin && selectedEntity.destination && (
                <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1.5 text-xs">
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

              {/* Details & Strategic Significance */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Stratejik İstihbarat:</span>
                <p className="text-slate-300 leading-relaxed text-[11px] bg-white/5 p-2.5 rounded border border-white/5">
                  {selectedEntity.details}
                </p>
              </div>

              {/* Correlated Financial Instruments */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Etkilenen Borsa & Emtia Varlıkları:
                </span>
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
            </div>

            {/* Close Drawer Button */}
            <button
              onClick={() => setSelectedEntity(null)}
              className="mt-4 w-full py-2 rounded text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              ✕ RADAR PANELİNİ KAPAT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
