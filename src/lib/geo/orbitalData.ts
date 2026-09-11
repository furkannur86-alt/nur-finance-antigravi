/**
 * NUR EARTH 3D — SOVEREIGN ORBITAL INTELLIGENCE PLATFORM
 * Comprehensive Geospatial, Geopolitical, Military, Infrastructure & Atmospheric Datasets
 */

export interface LatLon {
  lat: number;
  lon: number;
}

export interface MilitaryBase {
  id: string;
  name: string;
  faction: "NATO" | "US" | "RUSSIA" | "CHINA" | "REGIONAL";
  country: string;
  lat: number;
  lon: number;
  type: "AIR_BASE" | "NAVAL_BASE" | "RADAR_SIGINT" | "MISSILE_SILO" | "HEADQUARTERS";
  radarRangeKm: number;
  strategicRole: string;
}

export interface SubmarineCable {
  id: string;
  name: string;
  capacityTbps: number;
  landingPoints: string[];
  coordinates: [number, number][]; // [lat, lon]
}

export interface EnergyPipeline {
  id: string;
  name: string;
  type: "OIL" | "GAS" | "LNG_TERMINAL";
  capacity: string;
  operator: string;
  status: "OPERATIONAL" | "RESTRICTED" | "DISRUPTED" | "PROJECTED";
  coordinates: [number, number][]; // [lat, lon]
}

export interface TectonicBoundary {
  id: string;
  name: string;
  type: "SUBDUCTION" | "TRANSFORM" | "DIVERGENT";
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE";
  coordinates: [number, number][];
}

export interface AtmosphericEvent {
  id: string;
  name: string;
  category: "CATEGORY_5" | "CATEGORY_4" | "CATEGORY_3" | "TROPICAL_STORM" | "POLAR_VORTEX";
  windSpeedKmh: number;
  pressureHpa: number;
  lat: number;
  lon: number;
  trajectory: [number, number][];
}

export interface OceanCurrent {
  id: string;
  name: string;
  type: "WARM" | "COLD";
  tempC: number;
  velocityKnots: number;
  coordinates: [number, number][];
}

export interface StrategicCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population: string;
  importance: "SUPER_HUB" | "FINANCIAL" | "MILITARY_GOV" | "INDUSTRIAL";
  nightLightFactor: number;
}

export interface ConflictUnitCluster {
  id: string;
  name: string;
  region: string;
  theater: "EASTERN_EUROPE" | "MIDDLE_EAST" | "RED_SEA" | "INDO_PACIFIC" | "AFRICA" | "LATIN_AMERICA" | "CENTRAL_ASIA";
  lat: number;
  lon: number;
  activeUnitsCount: number;
  belligerents: string[];
  fatalityEstimate: number;
  threatLevel: "EXTREME" | "SEVERE" | "ELEVATED" | "GUARDED";
  details?: string;
  tacticalStatus: string;
  correlatedAssets: string[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. GLOBAL STRATEGIC CITIES & CAPITAL HUBS (100+ METROPOLITAN CONSTELLATIONS)
   ───────────────────────────────────────────────────────────────────────────── */
export const GLOBAL_STRATEGIC_CITIES: StrategicCity[] = [
  // Europe
  { name: "LONDON", country: "United Kingdom", lat: 51.5074, lon: -0.1278, population: "9.0M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "PARIS", country: "France", lat: 48.8566, lon: 2.3522, population: "11.0M", importance: "SUPER_HUB", nightLightFactor: 0.95 },
  { name: "FRANKFURT", country: "Germany", lat: 50.1109, lon: 8.6821, population: "0.8M", importance: "FINANCIAL", nightLightFactor: 0.9 },
  { name: "BERLIN", country: "Germany", lat: 52.5200, lon: 13.4050, population: "3.7M", importance: "MILITARY_GOV", nightLightFactor: 0.85 },
  { name: "ISTANBUL", country: "Turkey", lat: 41.0082, lon: 28.9784, population: "16.0M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "ANKARA", country: "Turkey", lat: 39.9334, lon: 32.8597, population: "5.8M", importance: "MILITARY_GOV", nightLightFactor: 0.8 },
  { name: "GENEVA", country: "Switzerland", lat: 46.2044, lon: 6.1432, population: "0.5M", importance: "FINANCIAL", nightLightFactor: 0.8 },
  { name: "ZURICH", country: "Switzerland", lat: 47.3769, lon: 8.5417, population: "0.4M", importance: "FINANCIAL", nightLightFactor: 0.85 },
  { name: "MOSCOW", country: "Russia", lat: 55.7558, lon: 37.6173, population: "13.0M", importance: "MILITARY_GOV", nightLightFactor: 0.95 },
  { name: "KYIV", country: "Ukraine", lat: 50.4501, lon: 30.5234, population: "3.0M", importance: "MILITARY_GOV", nightLightFactor: 0.6 },
  { name: "ROME", country: "Italy", lat: 41.9028, lon: 12.4964, population: "4.3M", importance: "MILITARY_GOV", nightLightFactor: 0.85 },
  { name: "MADRID", country: "Spain", lat: 40.4168, lon: -3.7038, population: "6.7M", importance: "SUPER_HUB", nightLightFactor: 0.9 },
  { name: "AMSTERDAM", country: "Netherlands", lat: 52.3676, lon: 4.9041, population: "1.1M", importance: "FINANCIAL", nightLightFactor: 0.9 },
  { name: "VIENNA", country: "Austria", lat: 48.2082, lon: 16.3738, population: "1.9M", importance: "FINANCIAL", nightLightFactor: 0.8 },
  { name: "STOCKHOLM", country: "Sweden", lat: 59.3293, lon: 18.0686, population: "1.6M", importance: "INDUSTRIAL", nightLightFactor: 0.75 },
  { name: "WARSAW", country: "Poland", lat: 52.2297, lon: 21.0122, population: "1.8M", importance: "MILITARY_GOV", nightLightFactor: 0.8 },
  
  // North America
  { name: "NEW YORK", country: "USA", lat: 40.7128, lon: -74.0060, population: "19.5M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "WASHINGTON D.C.", country: "USA", lat: 38.9072, lon: -77.0369, population: "6.3M", importance: "MILITARY_GOV", nightLightFactor: 0.95 },
  { name: "CHICAGO", country: "USA", lat: 41.8781, lon: -87.6298, population: "9.5M", importance: "FINANCIAL", nightLightFactor: 0.9 },
  { name: "SAN FRANCISCO", country: "USA", lat: 37.7749, lon: -122.4194, population: "4.7M", importance: "INDUSTRIAL", nightLightFactor: 0.9 },
  { name: "LOS ANGELES", country: "USA", lat: 34.0522, lon: -118.2437, population: "12.8M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "HOUSTON", country: "USA", lat: 29.7604, lon: -95.3698, population: "7.1M", importance: "INDUSTRIAL", nightLightFactor: 0.9 },
  { name: "TORONTO", country: "Canada", lat: 43.6532, lon: -79.3832, population: "6.2M", importance: "FINANCIAL", nightLightFactor: 0.85 },
  { name: "VANCOUVER", country: "Canada", lat: 49.2827, lon: -123.1207, population: "2.6M", importance: "INDUSTRIAL", nightLightFactor: 0.8 },
  { name: "MEXICO CITY", country: "Mexico", lat: 19.4326, lon: -99.1332, population: "22.0M", importance: "SUPER_HUB", nightLightFactor: 0.95 },

  // Asia & Pacific
  { name: "TOKYO", country: "Japan", lat: 35.6762, lon: 139.6503, population: "37.4M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "BEIJING", country: "China", lat: 39.9042, lon: 116.4074, population: "21.8M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "SHANGHAI", country: "China", lat: 31.2304, lon: 121.4737, population: "27.8M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "SHENZHEN", country: "China", lat: 22.5431, lon: 114.0579, population: "17.6M", importance: "INDUSTRIAL", nightLightFactor: 0.95 },
  { name: "HONG KONG", country: "China", lat: 22.3193, lon: 114.1694, population: "7.5M", importance: "FINANCIAL", nightLightFactor: 1.0 },
  { name: "TAIPEI", country: "Taiwan", lat: 25.0330, lon: 121.5654, population: "7.0M", importance: "INDUSTRIAL", nightLightFactor: 0.95 },
  { name: "SEOUL", country: "South Korea", lat: 37.5665, lon: 126.9780, population: "25.6M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "SINGAPORE", country: "Singapore", lat: 1.3521, lon: 103.8198, population: "5.9M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "MUMBAI", country: "India", lat: 19.0760, lon: 72.8777, population: "21.0M", importance: "FINANCIAL", nightLightFactor: 0.9 },
  { name: "NEW DELHI", country: "India", lat: 28.6139, lon: 77.2090, population: "33.0M", importance: "SUPER_HUB", nightLightFactor: 0.95 },
  { name: "SYDNEY", country: "Australia", lat: -33.8688, lon: 151.2093, population: "5.3M", importance: "FINANCIAL", nightLightFactor: 0.85 },
  { name: "JAKARTA", country: "Indonesia", lat: -6.2088, lon: 106.8456, population: "34.0M", importance: "SUPER_HUB", nightLightFactor: 0.9 },
  { name: "BANGKOK", country: "Thailand", lat: 13.7563, lon: 100.5018, population: "10.8M", importance: "INDUSTRIAL", nightLightFactor: 0.85 },

  // Middle East & Africa
  { name: "DUBAI", country: "UAE", lat: 25.2048, lon: 55.2708, population: "3.5M", importance: "SUPER_HUB", nightLightFactor: 1.0 },
  { name: "RIYADH", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753, population: "7.5M", importance: "SUPER_HUB", nightLightFactor: 0.95 },
  { name: "DOHA", country: "Qatar", lat: 25.2854, lon: 51.5310, population: "2.4M", importance: "FINANCIAL", nightLightFactor: 0.9 },
  { name: "TEL AVIV", country: "Israel", lat: 32.0853, lon: 34.7818, population: "4.2M", importance: "INDUSTRIAL", nightLightFactor: 0.9 },
  { name: "TEHRAN", country: "Iran", lat: 35.6892, lon: 51.3890, population: "9.3M", importance: "MILITARY_GOV", nightLightFactor: 0.85 },
  { name: "CAIRO", country: "Egypt", lat: 30.0444, lon: 31.2357, population: "22.0M", importance: "SUPER_HUB", nightLightFactor: 0.9 },
  { name: "JOHANNESBURG", country: "South Africa", lat: -26.2041, lon: 28.0473, population: "5.8M", importance: "FINANCIAL", nightLightFactor: 0.8 },
  { name: "LAGOS", country: "Nigeria", lat: 6.5244, lon: 3.3792, population: "16.0M", importance: "INDUSTRIAL", nightLightFactor: 0.75 },
  { name: "NAIROBI", country: "Kenya", lat: -1.2921, lon: 36.8219, population: "4.9M", importance: "FINANCIAL", nightLightFactor: 0.7 },

  // South America
  { name: "SÃO PAULO", country: "Brazil", lat: -23.5505, lon: -46.6333, population: "22.4M", importance: "SUPER_HUB", nightLightFactor: 0.95 },
  { name: "BUENOS AIRES", country: "Argentina", lat: -34.6037, lon: -58.3816, population: "15.3M", importance: "FINANCIAL", nightLightFactor: 0.85 },
  { name: "BOGOTÁ", country: "Colombia", lat: 4.7110, lon: -74.0721, population: "11.3M", importance: "MILITARY_GOV", nightLightFactor: 0.8 },
  { name: "SANTIAGO", country: "Chile", lat: -33.4489, lon: -70.6693, population: "6.8M", importance: "INDUSTRIAL", nightLightFactor: 0.8 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   2. GLOBAL MILITARY BASES & RADAR INTERCEPT SITES
   ───────────────────────────────────────────────────────────────────────────── */
export const GLOBAL_MILITARY_BASES: MilitaryBase[] = [
  // US & NATO Key Bases
  { id: "mb-incirlik", name: "Incirlik Air Base (NATO/USAF B61 Nuclear)", faction: "NATO", country: "Turkey", lat: 37.0019, lon: 35.4258, type: "AIR_BASE", radarRangeKm: 650, strategicRole: "Forward NATO Nuclear Strike & Levant Reconnaissance" },
  { id: "mb-ramstein", name: "Ramstein Air Base (USAF HQ Europe)", faction: "US", country: "Germany", lat: 49.4369, lon: 7.6003, type: "HEADQUARTERS", radarRangeKm: 800, strategicRole: "Air Operations Command Center Europe & Africa" },
  { id: "mb-diego-garcia", name: "Diego Garcia Joint Strategic Base", faction: "US", country: "BIOT / Indian Ocean", lat: -7.3195, lon: 72.4229, type: "AIR_BASE", radarRangeKm: 1200, strategicRole: "B-2/B-52 Strategic Bomber & SSBN Submarine Station" },
  { id: "mb-guam", name: "Andersen AFB & Naval Base Guam", faction: "US", country: "Guam (US)", lat: 13.5841, lon: 144.9244, type: "AIR_BASE", radarRangeKm: 1500, strategicRole: "Pacific 2nd Island Chain Strategic Deterrence" },
  { id: "mb-yokosuka", name: "Yokosuka US 7th Fleet Naval Base", faction: "US", country: "Japan", lat: 35.2931, lon: 139.6644, type: "NAVAL_BASE", radarRangeKm: 900, strategicRole: "Forward Deployed Aircraft Carrier Strike Group" },
  { id: "mb-kadena", name: "Kadena Air Base (Okinawa)", faction: "US", country: "Japan", lat: 26.3556, lon: 127.7675, type: "AIR_BASE", radarRangeKm: 750, strategicRole: "East China Sea & Taiwan Strait Air Superiority" },
  { id: "mb-al-udeid", name: "Al Udeid Air Base (CENTCOM Forward HQ)", faction: "US", country: "Qatar", lat: 25.1174, lon: 51.3150, type: "HEADQUARTERS", radarRangeKm: 950, strategicRole: "Middle East Air Operations & Reconnaissance Hub" },
  { id: "mb-al-dhafra", name: "Al Dhafra Air Base", faction: "US", country: "UAE", lat: 24.2482, lon: 54.5477, type: "AIR_BASE", radarRangeKm: 600, strategicRole: "Persian Gulf Early Warning & Drone Command" },
  { id: "mb-pine-gap", name: "Pine Gap Joint Defence Facility", faction: "US", country: "Australia", lat: -23.7989, lon: 133.7372, type: "RADAR_SIGINT", radarRangeKm: 3000, strategicRole: "Global CIA/NSA Satellite Intercept & GEO Early Warning" },
  { id: "mb-thule", name: "Pituffik Space Base (Thule, Greenland)", faction: "US", country: "Greenland", lat: 76.5312, lon: -68.7032, type: "RADAR_SIGINT", radarRangeKm: 2500, strategicRole: "BMEWS Ballistic Missile Early Warning Radar" },
  { id: "mb-rota", name: "Naval Station Rota (Aegis BMD)", faction: "NATO", country: "Spain", lat: 36.6433, lon: -6.3494, type: "NAVAL_BASE", radarRangeKm: 850, strategicRole: "Strait of Gibraltar & Mediterranean Missile Shield" },
  { id: "mb-souda", name: "Souda Bay Naval Support Activity", faction: "NATO", country: "Greece", lat: 35.4886, lon: 24.1481, type: "NAVAL_BASE", radarRangeKm: 700, strategicRole: "Eastern Mediterranean Deep Water Nuclear Submarine Berth" },
  { id: "mb-camp-lemonnier", name: "Camp Lemonnier", faction: "US", country: "Djibouti", lat: 11.5458, lon: 43.1497, type: "AIR_BASE", radarRangeKm: 750, strategicRole: "Bab el-Mandeb & Horn of Africa Counter-Terrorism" },

  // Russia Key Bases
  { id: "mb-tartus", name: "Tartus Naval & Khmeimim Air Base", faction: "RUSSIA", country: "Syria", lat: 34.8890, lon: 35.8866, type: "NAVAL_BASE", radarRangeKm: 800, strategicRole: "Mediterranean Permanent Strategic Outpost" },
  { id: "mb-sevastopol", name: "Sevastopol Black Sea Fleet HQ", faction: "RUSSIA", country: "Crimea (Disputed)", lat: 44.6166, lon: 33.5254, type: "NAVAL_BASE", radarRangeKm: 650, strategicRole: "Black Sea Fleet Headquarters" },
  { id: "mb-kaliningrad", name: "Kaliningrad / Baltiysk Naval Base (Iskander-M)", faction: "RUSSIA", country: "Russia", lat: 54.7104, lon: 20.4522, type: "MISSILE_SILO", radarRangeKm: 700, strategicRole: "Baltic Enclave Nuclear-Capable Hypersonic Strike" },
  { id: "mb-gadzhievo", name: "Gadzhievo Northern Fleet SSBN Base", faction: "RUSSIA", country: "Russia", lat: 69.2556, lon: 33.3283, type: "NAVAL_BASE", radarRangeKm: 1200, strategicRole: "Borei-class Nuclear Ballistic Submarine Bastion" },
  { id: "mb-engels", name: "Engels-2 Strategic Bomber Base (Tu-160/95)", faction: "RUSSIA", country: "Russia", lat: 51.4828, lon: 46.2131, type: "AIR_BASE", radarRangeKm: 1100, strategicRole: "Long-Range Nuclear Triad Aviation" },
  { id: "mb-plesetsk", name: "Plesetsk Cosmodrome & ICBM Site", faction: "RUSSIA", country: "Russia", lat: 62.9271, lon: 40.5761, type: "MISSILE_SILO", radarRangeKm: 1800, strategicRole: "Military Space Launch & Heavy ICBM Silos" },

  // China Key Bases
  { id: "mb-yulin", name: "Yulin Underground Submarine Base (Hainan)", faction: "CHINA", country: "China", lat: 18.2197, lon: 109.5664, type: "NAVAL_BASE", radarRangeKm: 900, strategicRole: "South China Sea Deep Water SSBN Submarine Tunnel" },
  { id: "mb-djibouti-cn", name: "PLA Support Base Djibouti", faction: "CHINA", country: "Djibouti", lat: 11.5947, lon: 43.0617, type: "NAVAL_BASE", radarRangeKm: 600, strategicRole: "China 1st Overseas Military Base & Red Sea Security" },
  { id: "mb-fiery-cross", name: "Fiery Cross Reef Military Fortress", faction: "CHINA", country: "Spratly Islands", lat: 9.5500, lon: 112.8833, type: "AIR_BASE", radarRangeKm: 700, strategicRole: "South China Sea Runway & HQ-9 SAM Battery" },
  { id: "mb-ream", name: "Ream Naval Base Expansion", faction: "CHINA", country: "Cambodia", lat: 10.5186, lon: 103.6264, type: "NAVAL_BASE", radarRangeKm: 500, strategicRole: "Gulf of Thailand & Malacca Flank Access" },
  { id: "mb-subi-reef", name: "Subi Reef Forward Air Station", faction: "CHINA", country: "Spratly Islands", lat: 10.9167, lon: 114.0833, type: "AIR_BASE", radarRangeKm: 650, strategicRole: "Deep Air Patrol South China Sea" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   3. SUBMARINE FIBER OPTIC CABLES (GLOBAL DATA SPINE)
   ───────────────────────────────────────────────────────────────────────────── */
export const SUBMARINE_FIBER_CABLES: SubmarineCable[] = [
  {
    id: "cable-marea",
    name: "MAREA (Virginia Beach ➔ Bilbao)",
    capacityTbps: 200,
    landingPoints: ["Virginia Beach (USA)", "Bilbao (Spain)"],
    coordinates: [[36.85, -75.97], [40.0, -60.0], [42.5, -40.0], [43.5, -20.0], [43.34, -2.93]],
  },
  {
    id: "cable-dunant",
    name: "Dunant Transatlantic (Google)",
    capacityTbps: 250,
    landingPoints: ["Virginia Beach (USA)", "Saint-Hilaire-de-Riez (France)"],
    coordinates: [[36.85, -75.97], [41.0, -55.0], [44.0, -35.0], [46.7, -1.94]],
  },
  {
    id: "cable-grace-hopper",
    name: "Grace Hopper (New York ➔ Bude ➔ Bilbao)",
    capacityTbps: 350,
    landingPoints: ["New York (USA)", "Bude (UK)", "Bilbao (Spain)"],
    coordinates: [[40.71, -74.0], [45.0, -45.0], [50.83, -4.54], [43.34, -2.93]],
  },
  {
    id: "cable-faster",
    name: "FASTER Trans-Pacific (Oregon ➔ Chiba/Mie)",
    capacityTbps: 60,
    landingPoints: ["Bandon (USA)", "Chikura (Japan)", "Shima (Japan)"],
    coordinates: [[43.12, -124.41], [48.0, -160.0], [45.0, 175.0], [35.0, 140.0]],
  },
  {
    id: "cable-unity",
    name: "Unity / EAC-Pacific (Los Angeles ➔ Chikura)",
    capacityTbps: 7.68,
    landingPoints: ["Hermosa Beach (USA)", "Chikura (Japan)"],
    coordinates: [[33.86, -118.40], [38.0, -150.0], [37.0, 170.0], [34.96, 139.95]],
  },
  {
    id: "cable-smw5",
    name: "SEA-ME-WE 5 (Singapore ➔ Marseille)",
    capacityTbps: 24,
    landingPoints: ["Singapore", "Colombo", "Djibouti", "Suez", "Marseille"],
    coordinates: [
      [1.35, 103.82], [5.5, 95.0], [6.92, 79.86], [11.59, 43.15],
      [27.8, 34.3], [31.2, 32.3], [36.0, 15.0], [43.29, 5.37]
    ],
  },
  {
    id: "cable-aae1",
    name: "Asia-Africa-Europe 1 (AAE-1)",
    capacityTbps: 40,
    landingPoints: ["Hong Kong", "Vietnam", "Thailand", "India", "Egypt", "Marseille"],
    coordinates: [
      [22.3, 114.2], [12.0, 109.0], [7.0, 100.0], [18.9, 72.8],
      [12.5, 45.0], [27.0, 34.0], [31.5, 32.0], [38.0, 18.0], [43.29, 5.37]
    ],
  },
  {
    id: "cable-peace",
    name: "PEACE Cable (Pakistan ➔ Djibouti ➔ France)",
    capacityTbps: 96,
    landingPoints: ["Gwadar (Pakistan)", "Djibouti", "Marseille (France)"],
    coordinates: [
      [25.12, 62.32], [22.0, 60.0], [11.59, 43.15], [26.0, 35.0],
      [31.2, 32.3], [37.5, 14.0], [43.29, 5.37]
    ],
  },
  {
    id: "cable-ellalink",
    name: "EllaLink (Fortaleza ➔ Sines/Lisbon)",
    capacityTbps: 100,
    landingPoints: ["Fortaleza (Brazil)", "Praia (Cabo Verde)", "Sines (Portugal)"],
    coordinates: [[-3.73, -38.52], [14.9, -23.5], [28.0, -16.0], [37.95, -8.86]],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   4. MAJOR STRATEGIC OIL & GAS PIPELINES
   ───────────────────────────────────────────────────────────────────────────── */
export const STRATEGIC_PIPELINES: EnergyPipeline[] = [
  {
    id: "pipe-btc",
    name: "Baku-Tbilisi-Ceyhan (BTC) Crude Pipeline",
    type: "OIL",
    capacity: "1.2 Million bbl/day",
    operator: "BP / BOTAS / SOCAR",
    status: "OPERATIONAL",
    coordinates: [
      [40.4093, 49.8671], // Baku
      [41.7151, 44.8271], // Tbilisi
      [41.0000, 42.5000], // Erzurum
      [36.8833, 35.8167], // Ceyhan Marine Terminal
    ],
  },
  {
    id: "pipe-tanap",
    name: "TANAP & TAP (Southern Gas Corridor to Italy)",
    type: "GAS",
    capacity: "16 Billion m3/year",
    operator: "SOCAR / BOTAS / Snam",
    status: "OPERATIONAL",
    coordinates: [
      [40.40, 49.86], // Sangachal Baku
      [41.38, 43.48], // Georgia
      [41.50, 42.00], // Posof
      [39.75, 37.00], // Sivas
      [40.18, 29.06], // Bursa
      [40.85, 26.10], // Ipsala / Greece Border
      [40.64, 22.94], // Thessaloniki
      [40.50, 18.00], // Melendugno (Italy)
    ],
  },
  {
    id: "pipe-druzhba",
    name: "Druzhba Pipeline (Friendship Pipeline)",
    type: "OIL",
    capacity: "1.4 Million bbl/day",
    operator: "Transneft",
    status: "RESTRICTED",
    coordinates: [
      [53.20, 50.15], // Samara
      [52.96, 36.06], // Orel
      [52.42, 31.00], // Mozyr (Belarus)
      [52.23, 21.01], // Plock (Poland)
      [53.05, 14.28], // Schwedt (Germany)
    ],
  },
  {
    id: "pipe-power-siberia",
    name: "Power of Siberia (Chayanda ➔ Heihe ➔ Shanghai)",
    type: "GAS",
    capacity: "38 Billion m3/year",
    operator: "Gazprom / CNPC",
    status: "OPERATIONAL",
    coordinates: [
      [60.30, 113.00], // Chayandinskoye
      [53.75, 127.30], // Blagoveshchensk
      [50.24, 127.52], // Heihe
      [45.75, 126.65], // Harbin
      [39.90, 116.40], // Beijing
      [31.23, 121.47], // Shanghai
    ],
  },
  {
    id: "pipe-east-west-saudi",
    name: "Petroline (East-West Crude Pipeline, Abqaiq ➔ Yanbu)",
    type: "OIL",
    capacity: "5.0 Million bbl/day",
    operator: "Saudi Aramco",
    status: "OPERATIONAL",
    coordinates: [
      [25.93, 49.66], // Abqaiq
      [24.71, 46.67], // Riyadh
      [24.08, 38.06], // Yanbu Red Sea Terminal
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   5. TECTONIC PLATES, FAULT LINES & SEISMIC HOTSPOTS
   ───────────────────────────────────────────────────────────────────────────── */
export const TECTONIC_BOUNDARIES: TectonicBoundary[] = [
  {
    id: "fault-ring-of-fire-west",
    name: "Pacific Subduction Trench (Mariana & Japan Trench)",
    type: "SUBDUCTION",
    riskLevel: "CRITICAL",
    coordinates: [
      [55.0, 162.0], [45.0, 150.0], [35.0, 142.0], [25.0, 143.0],
      [15.0, 145.0], [5.0, 140.0], [-10.0, 150.0], [-25.0, 178.0], [-45.0, 170.0]
    ],
  },
  {
    id: "fault-san-andreas",
    name: "San Andreas Transform Fault",
    type: "TRANSFORM",
    riskLevel: "HIGH",
    coordinates: [
      [40.0, -124.5], [38.0, -123.0], [36.0, -121.0], [34.0, -118.0], [32.0, -115.5]
    ],
  },
  {
    id: "fault-anatolia",
    name: "North & East Anatolian Fault System",
    type: "TRANSFORM",
    riskLevel: "CRITICAL",
    coordinates: [
      [40.8, 28.0], [40.7, 30.0], [40.8, 33.5], [40.0, 39.0], [39.0, 41.0],
      [37.5, 37.0], [36.2, 36.1]
    ],
  },
  {
    id: "fault-mid-atlantic",
    name: "Mid-Atlantic Ridge Spreading Center",
    type: "DIVERGENT",
    riskLevel: "MODERATE",
    coordinates: [
      [70.0, -15.0], [64.0, -20.0], [45.0, -28.0], [30.0, -42.0],
      [15.0, -45.0], [0.0, -20.0], [-20.0, -12.0], [-45.0, -15.0], [-55.0, -5.0]
    ],
  },
  {
    id: "fault-himalayan",
    name: "Main Himalayan Thrust (Indian-Eurasian Collision)",
    type: "SUBDUCTION",
    riskLevel: "CRITICAL",
    coordinates: [
      [34.0, 74.0], [31.0, 78.0], [28.5, 84.0], [27.5, 90.0], [26.0, 95.0]
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   6. MAJOR OCEAN CURRENTS & SEA SURFACE TEMPERATURE VECTORS
   ───────────────────────────────────────────────────────────────────────────── */
export const MAJOR_OCEAN_CURRENTS: OceanCurrent[] = [
  {
    id: "curr-gulf-stream",
    name: "Gulf Stream & North Atlantic Drift (Thermal Conveyor)",
    type: "WARM",
    tempC: 26.5,
    velocityKnots: 4.8,
    coordinates: [
      [24.0, -80.0], [30.0, -78.0], [36.0, -74.0], [40.0, -60.0],
      [45.0, -40.0], [52.0, -25.0], [60.0, -5.0], [68.0, 10.0]
    ],
  },
  {
    id: "curr-kuroshio",
    name: "Kuroshio Current (Pacific Warm Stream)",
    type: "WARM",
    tempC: 25.0,
    velocityKnots: 4.2,
    coordinates: [
      [18.0, 122.0], [24.0, 124.0], [30.0, 130.0], [35.0, 140.0], [40.0, 155.0]
    ],
  },
  {
    id: "curr-humboldt",
    name: "Humboldt (Peru) Cold Current",
    type: "COLD",
    tempC: 14.0,
    velocityKnots: 2.1,
    coordinates: [
      [-45.0, -75.0], [-35.0, -73.0], [-20.0, -72.0], [-5.0, -82.0]
    ],
  },
  {
    id: "curr-agulhas",
    name: "Agulhas Current (Cape of Good Hope Retroflection)",
    type: "WARM",
    tempC: 23.0,
    velocityKnots: 3.9,
    coordinates: [
      [-25.0, 35.0], [-30.0, 32.0], [-35.0, 24.0], [-38.0, 18.0]
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   7. ATMOSPHERIC STORM SYSTEMS & CYCLONIC CYCLES
   ───────────────────────────────────────────────────────────────────────────── */
export const GLOBAL_ATMOSPHERIC_EVENTS: AtmosphericEvent[] = [
  {
    id: "storm-typhoon-pacific",
    name: "Super Typhoon GAEMI / Active Pacific Vortex",
    category: "CATEGORY_5",
    windSpeedKmh: 260,
    pressureHpa: 915,
    lat: 21.4,
    lon: 125.8,
    trajectory: [[17.0, 130.0], [19.5, 128.0], [21.4, 125.8], [24.5, 122.0], [27.0, 118.5]],
  },
  {
    id: "storm-atlantic-hurricane",
    name: "Atlantic Major Hurricane Vector",
    category: "CATEGORY_4",
    windSpeedKmh: 220,
    pressureHpa: 940,
    lat: 26.5,
    lon: -73.2,
    trajectory: [[18.0, -60.0], [22.0, -68.0], [26.5, -73.2], [31.0, -78.0], [35.0, -75.0]],
  },
  {
    id: "storm-polar-vortex",
    name: "Circumpolar Jet Stream Dip / Polar Vortex",
    category: "POLAR_VORTEX",
    windSpeedKmh: 310,
    pressureHpa: 975,
    lat: 61.2,
    lon: 45.0,
    trajectory: [[65.0, 10.0], [63.0, 30.0], [61.2, 45.0], [58.0, 65.0], [62.0, 85.0]],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   8. ACTIVE CONFLICT DISPOSITIONS & 136-UNIT BATTLE MAP
   ───────────────────────────────────────────────────────────────────────────── */
export const ACTIVE_CONFLICT_THEATERS: ConflictUnitCluster[] = [
  {
    id: "conf-donbas-pokrovsk",
    name: "Pokrovsk–Toretsk–Kupiansk Axis (Eastern Front)",
    region: "Donetsk Oblast, Ukraine",
    theater: "EASTERN_EUROPE",
    lat: 48.28,
    lon: 37.18,
    activeUnitsCount: 42,
    belligerents: ["Armed Forces of Ukraine", "Russian Ground Forces / 2nd Combined Arms Army"],
    fatalityEstimate: 45000,
    threatLevel: "EXTREME",
    tacticalStatus: "High intensity artillery duel, mechanized assaults, FPV drone swarms.",
    correlatedAssets: ["WHEAT=F", "EUR/USD", "ELECTRICITY_EU"],
  },
  {
    id: "conf-kursk-salient",
    name: "Kursk Oblast Border Offensive Zone",
    region: "Sudzha–Korenevo, Russia",
    theater: "EASTERN_EUROPE",
    lat: 51.20,
    lon: 35.27,
    activeUnitsCount: 28,
    belligerents: ["AFU Airborne & Mechanized Brigades", "Russian Airborne (VDV) & Marines"],
    fatalityEstimate: 12000,
    threatLevel: "EXTREME",
    tacticalStatus: "Mobile encirclements, cross-border logistics interdiction, gas transit node control.",
    correlatedAssets: ["NG.US", "RUB=X", "BRENT"],
  },
  {
    id: "conf-southern-lebanon",
    name: "Southern Lebanon / Blue Line Escalation",
    region: "Nabatieh–Metula Border",
    theater: "MIDDLE_EAST",
    lat: 33.25,
    lon: 35.40,
    activeUnitsCount: 22,
    belligerents: ["IDF Northern Command (98th/36th Div)", "Hezbollah Radwan Special Forces"],
    fatalityEstimate: 8500,
    threatLevel: "EXTREME",
    tacticalStatus: "Precision air strikes, anti-tank missile ambushes, underground bunker complexes.",
    correlatedAssets: ["CL.US", "GC=F (Gold)", "TA35"],
  },
  {
    id: "conf-red-sea-houthi",
    name: "Bab el-Mandeb / Southern Red Sea Chokepoint",
    region: "Yemen Coast & Gulf of Aden",
    theater: "RED_SEA",
    lat: 12.58,
    lon: 43.34,
    activeUnitsCount: 16,
    belligerents: ["Ansar Allah (Houthi Forces)", "US/UK Operation Prosperity Guardian Task Force"],
    fatalityEstimate: 1800,
    threatLevel: "SEVERE",
    tacticalStatus: "Anti-ship ballistic missiles, drone boats (USV), maritime blockade enforcement.",
    correlatedAssets: ["BDI (Baltic Dry)", "BRENT", "MAERSK.DK"],
  },
  {
    id: "conf-taiwan-strait",
    name: "Taiwan Strait Median Line & ADIZ Encirclement",
    region: "Taiwan Strait",
    theater: "INDO_PACIFIC",
    lat: 24.15,
    lon: 119.80,
    activeUnitsCount: 14,
    belligerents: ["PLA Eastern Theater Command Navy/Air", "ROCM Defense Forces & US 7th Fleet Monitors"],
    fatalityEstimate: 0,
    threatLevel: "SEVERE",
    tacticalStatus: "Joint Sword naval blockade exercises, submarine patrols, grey-zone incursions.",
    correlatedAssets: ["TSM", "SOXX", "USD/TWD"],
  },
  {
    id: "conf-sudan-khartoum",
    name: "Khartoum–El Fasher Axis (Sudan Civil War)",
    region: "Sudan (Darfur & Capital)",
    theater: "AFRICA",
    lat: 15.50,
    lon: 32.55,
    activeUnitsCount: 14,
    belligerents: ["Sudanese Armed Forces (SAF)", "Rapid Support Forces (RSF)"],
    fatalityEstimate: 24000,
    threatLevel: "EXTREME",
    tacticalStatus: "Urban siege, drone strikes, displacement corridor disruption.",
    correlatedAssets: ["GC.US", "OIL_ARABIC"],
  },
];
