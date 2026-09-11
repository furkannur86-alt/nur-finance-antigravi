"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import * as THREE from "three";
import { useIDEStore } from "@/stores/useIDEStore";

import {
  GLOBAL_STRATEGIC_CITIES,
  GLOBAL_MILITARY_BASES,
  SUBMARINE_FIBER_CABLES,
  STRATEGIC_PIPELINES,
  TECTONIC_BOUNDARIES,
  MAJOR_OCEAN_CURRENTS,
  GLOBAL_ATMOSPHERIC_EVENTS,
  ACTIVE_CONFLICT_THEATERS,
} from "@/lib/geo/orbitalData";
import { COMPREHENSIVE_COUNTRY_BORDERS } from "@/lib/geo/countryBorders";
import { UN_COUNTRY_DOSSIERS, UNCountryDossier } from "@/lib/geo/unCountryData";
import {
  LIVE_OSINT_DATABASE,
  LIVE_MILITARY_FLIGHT_TRACKS,
  LIVE_CYBER_ATTACK_STREAM,
  LiveOSINTAlert,
  LiveMilitaryAircraftFeed,
  CyberThreatEvent,
} from "@/lib/geo/osintIntelligenceEngine";
import { createOceanSSTTexture, createWeatherRadarTexture, createTactical2DMapTexture } from "@/lib/geo/orbitalTextures";
import { fetchLiveISSPosition, generateISSOrbitTrack, ISSTelemetry } from "@/lib/geo/issTracker";
import {
  APOPHIS_2029_DEFENSE_PROFILE,
  ORBITAL_SATELLITE_FLEET,
  generateStarlinkTrainPositions,
} from "@/lib/geo/planetaryDefense";
import { orbitalAudio } from "@/lib/geo/orbitalAudio";
import { createAtmosphericGlowMaterial, createDefconHoloMaterial } from "@/lib/geo/orbitalShaders";
import {
  ACTIVE_136_MILITARY_UNITS,
  TACTICAL_FRONTLINES,
  TacticalMilitaryUnit,
} from "@/lib/geo/tacticalUnits136";
import {
  calculateAtmosphericWeather,
  SPACE_WEATHER_DATA,
  WeatherTelemetry,
} from "@/lib/geo/spaceWeather";
import {
  STRATEGIC_MINERAL_RESERVES,
  MineralDeposit,
} from "@/lib/geo/mineralResources";
import { SOVEREIGN_EXPLORATION_DEPOSITS } from "@/lib/geo/deepEarthExplorationEngine";
import { SOVEREIGN_INSTITUTIONAL_DOSSIERS } from "@/lib/geo/institutionalIntelligenceEngine";
import { GLOBAL_BOURSES, GlobalBourse, GEOFINANCIAL_COMMODITY_SHOCKS } from "@/lib/geo/globalBourseData";
import { ACTIVE_CYBER_ATTACK_ARCS, CYBER_DEFENSE_NODES, CyberAttackArc } from "@/lib/geo/cyberWarfareData";

export type SensorMode = "TRUE_COLOR" | "FLIR_THERMAL" | "CYBER_NIGHT" | "DEFCON_WAR_ROOM";
export type ViewportMode = "3D_GLOBE" | "2D_TACTICAL_MAP" | "STARSHIP_BRIDGE";
export type CommandIntelligenceLayer = "PHYSICAL_DEFENSE" | "FINANCIAL_MATRIX" | "CYBER_WARFARE" | "SOVEREIGN_INSTITUTIONAL";

export interface GeoEntity {
  id: string;
  type: "FLIGHT" | "TANKER" | "HOTSPOT" | "CHOKEPOINT" | "FIBER" | "NUCLEAR" | "MILITARY" | "PIPELINE" | "SEISMIC" | "STORM" | "ISS" | "SATELLITE" | "ASTEROID" | "CITY" | "MILITARY_UNIT" | "MINERAL" | "COUNTRY" | "OSINT_EVENT" | "SIGINT_AIRCRAFT" | "BOURSE" | "CYBER_ATTACK";
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
  extraMeta?: Record<string, any>;
  countryCode?: string;
}

const NUCLEAR_SITES: GeoEntity[] = [
  {
    id: "nuc-1",
    type: "NUCLEAR",
    name: "Zaporizhzhia Nuclear Power Plant",
    code: "IAEA: ZNPP-01 • UKRAINE",
    lat: 47.51,
    lon: 34.58,
    riskScore: 98,
    riskLevel: "CRITICAL",
    details: "Europe's largest nuclear power plant (6x VVER-1000 reactors). Active IAEA conflict zone monitoring.",
    correlatedAssets: ["EUR/USD", "WHEAT=F", "ELECTRICITY_EU"],
    countryCode: "UKR",
  },
  {
    id: "nuc-2",
    type: "NUCLEAR",
    name: "Natanz Fuel Enrichment Plant",
    code: "IAEA: FEP-NATANZ • IRAN",
    lat: 33.72,
    lon: 51.73,
    riskScore: 96,
    riskLevel: "CRITICAL",
    details: "60% enriched uranium centrifuge cascade. Air defense perimeter and deep underground cascade halls.",
    correlatedAssets: ["BZ=F (Brent)", "GC=F (Gold)", "USO"],
    countryCode: "IRN",
  },
  {
    id: "nuc-3",
    type: "NUCLEAR",
    name: "Dimona Nuclear Research Center",
    code: "NEGEV-01 • ISRAEL",
    lat: 31.00,
    lon: 35.14,
    riskScore: 92,
    riskLevel: "CRITICAL",
    details: "Plutonium production reactor and hardened subterranean nuclear storage silos in the Negev desert.",
    correlatedAssets: ["ILS=X", "DEFENSE_ETF", "BRENT"],
    countryCode: "ISR",
  },
  {
    id: "nuc-4",
    type: "NUCLEAR",
    name: "Akkuyu Nuclear Power Plant",
    code: "AKKUYU-NPP • TURKEY",
    lat: 36.14,
    lon: 33.54,
    riskScore: 40,
    riskLevel: "STABLE",
    details: "4,800 MW capacity VVER-1200 reactors — Mediterranean nuclear baseload energy hub.",
    correlatedAssets: ["BIST100", "TRY=X", "AKSEN"],
    countryCode: "TUR",
  },
];

const LIVE_TANKERS: GeoEntity[] = [
  {
    id: "tk-1",
    type: "TANKER",
    name: "Front Altair (VLCC Supertanker)",
    code: "IMO: 9745124 • MARSHALL ISL",
    lat: 26.2,
    lon: 56.4,
    speed: "14.2 knots",
    cargo: "2,000,000 bbl Saudi Light Crude",
    cargoValueUSD: "$168,000,000",
    origin: "Ras Tanura (Saudi Arabia)",
    destination: "Ningbo-Zhoushan (China)",
    riskScore: 92,
    riskLevel: "CRITICAL",
    details: "Transiting Strait of Hormuz outbound under IRGC speed boat surveillance corridor.",
    correlatedAssets: ["BZ=F (Brent)", "CL=F (WTI)", "FRO"],
    countryCode: "SAU",
  },
  {
    id: "tk-2",
    type: "TANKER",
    name: "Advantage Sweet (Suezmax)",
    code: "IMO: 9587427 • MARSHALL ISL",
    lat: 12.8,
    lon: 43.3,
    speed: "12.8 knots",
    cargo: "1,000,000 bbl Kuwait Crude",
    cargoValueUSD: "$84,000,000",
    origin: "Mina Al Ahmadi (Kuwait)",
    destination: "Rotterdam (Netherlands)",
    riskScore: 95,
    riskLevel: "CRITICAL",
    details: "Transiting Bab el-Mandeb / Red Sea under Operation Prosperity Guardian naval escort.",
    correlatedAssets: ["BRENT", "MAERSK.DK", "ZIM"],
  },
  {
    id: "tk-3",
    type: "TANKER",
    name: "NUR Sovereign Trader (Aframax)",
    code: "IMO: 9812450 • LIBERIA",
    lat: 41.2,
    lon: 29.1,
    speed: "10.1 knots",
    cargo: "700,000 bbl Azeri Light Crude",
    cargoValueUSD: "$61,600,000",
    origin: "Ceyhan Terminal (Turkey)",
    destination: "Trieste (Italy)",
    riskScore: 35,
    riskLevel: "STABLE",
    details: "Bosphorus North Entrance transit under Turkish Coastal Safety pilotage.",
    correlatedAssets: ["BIST100", "PETKM", "TUPRS"],
    countryCode: "TUR",
  },
];

const CHOKEPOINTS: GeoEntity[] = [
  {
    id: "chk-1",
    type: "CHOKEPOINT",
    name: "Strait of Hormuz",
    code: "CHOKE-01 • PERSIAN GULF",
    lat: 26.56,
    lon: 56.25,
    riskScore: 95,
    riskLevel: "CRITICAL",
    details: "21% of global petroleum consumption transit (21M bpd). Strategic naval choke corridor.",
    correlatedAssets: ["BRENT", "WTI", "LNG"],
  },
  {
    id: "chk-2",
    type: "CHOKEPOINT",
    name: "Bab el-Mandeb & Suez Corridor",
    code: "CHOKE-02 • RED SEA",
    lat: 12.58,
    lon: 43.33,
    riskScore: 98,
    riskLevel: "CRITICAL",
    details: "12% of global trade and 30% of global container traffic transit gateway.",
    correlatedAssets: ["BDI (Baltic Dry)", "MAERSK", "CL=F"],
  },
  {
    id: "chk-3",
    type: "CHOKEPOINT",
    name: "Turkish Straits (Bosphorus & Dardanelles)",
    code: "CHOKE-03 • TURKEY",
    lat: 41.12,
    lon: 29.07,
    riskScore: 60,
    riskLevel: "ELEVATED",
    details: "Black Sea - Mediterranean maritime choke point under Montreux Convention sovereign jurisdiction.",
    correlatedAssets: ["BIST100", "WHEAT=F", "TRY=X"],
    countryCode: "TUR",
  },
  {
    id: "chk-4",
    type: "CHOKEPOINT",
    name: "Strait of Malacca",
    code: "CHOKE-04 • INDO-PACIFIC",
    lat: 1.43,
    lon: 102.89,
    riskScore: 70,
    riskLevel: "ELEVATED",
    details: "World's busiest maritime transit route. 80% of China's crude oil imports transit.",
    correlatedAssets: ["BDI", "HSTECH", "SING_PORT"],
  },
];

const LIVE_FLIGHTS: GeoEntity[] = [
  {
    id: "fl-1",
    type: "FLIGHT",
    name: "NUR Sovereign Trans-Atlantic",
    code: "NF-001 (LHR ➔ JFK)",
    lat: 51.5,
    lon: -0.12,
    targetLat: 40.71,
    targetLon: -74.0,
    altitudeKm: 11.5,
    speed: "Mach 0.85 (920 km/h)",
    origin: "London Heathrow (LHR)",
    destination: "New York (JFK)",
    details: "North Atlantic primary flight corridor. Corporate finance & diplomatic transit route.",
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
    details: "Asia–Silicon Valley semiconductor and high-tech cargo express.",
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
    details: "Eurasia–Southeast Asia financial bridge route. Middle East airspace optimization.",
    correlatedAssets: ["THYAO", "SIA", "BIST100"],
    countryCode: "TUR",
  },
];

function latLonToVec3(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function NurEarth3DGlobe() {
  const { focusedCoordinates, setFocusedCoordinates, openFloatingWindow, popoutToNativeWindow } = useIDEStore();
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("3D_GLOBE");

  const [sensorMode, setSensorMode] = useState<SensorMode>("TRUE_COLOR");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<GeoEntity | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("TUR");
  const [selectedWeather, setSelectedWeather] = useState<WeatherTelemetry | null>(null);
  const [satTileUrl, setSatTileUrl] = useState<string | null>(null);
  const [issTelemetry, setIssTelemetry] = useState<ISSTelemetry | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [globeRotation, setGlobeRotation] = useState({ yaw: 0, pitch: 0.2 });
  const [showPlanetaryDefense, setShowPlanetaryDefense] = useState(false);
  const [showSpaceWeather, setShowSpaceWeather] = useState(false);
  const [showSacredTrinity, setShowSacredTrinity] = useState(false);
  const [showOSINTDrawer, setShowOSINTDrawer] = useState(false);
  const [osintFilter, setOsintFilter] = useState<"ALL" | "SIGINT" | "FIRMS" | "CYBER" | "NAVAL">("ALL");
  const [autonomousScannerActive, setAutonomousScannerActive] = useState(false);
  const [satelliteZoomLevel, setSatelliteZoomLevel] = useState<number>(13);
  const [unitFilter, setUnitFilter] = useState<"ALL" | "ARMOR" | "AIRBORNE" | "DRONES" | "SPECIAL_FORCES">("ALL");
  const [activeOSINTTickerIndex, setActiveOSINTTickerIndex] = useState(0);

  // Layers
  const [activeLayers, setActiveLayers] = useState({
    borders: true,     // Layer 1: Country Borders + Cities
    oceanSST: true,    // Layer 2: Ocean Sea Surface Temp
    weather: true,     // Layer 3: Weather Radar & Typhoons
    conflicts: true,   // Layer 4: 136-Unit Battle Frontlines
    iss: true,         // Layer 5: ISS Live Tracker & Orbit
    wind: true,        // Layer 6: Wind / Jet Stream Particles
    military: true,    // Layer 7: Military Bases + Domes
    cables: true,      // Layer 8: Undersea Fiber Cables
    seismic: true,     // Layer 9: Tectonic Faults & Seismic
    energy: true,      // Layer 10: Oil & Gas Pipelines
    nuclear: true,     // Layer 11: Nuclear Facilities
    maritime: true,    // Layer 12: Tankers, Chokepoints, Flights
    satellites: true,  // Layer 13: Satellite Fleet & Starlink
    apophis: true,     // Layer 14: Apophis 2029 Planetary Defense
    minerals: true,    // Layer 15: Critical Minerals & Rare Earths
    osint: true,       // Layer 16: OSINT & SIGINT Feeds
  });

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const targetCamRef = useRef<{ yaw: number; pitch: number; zoom: number } | null>(null);
  const clickableObjects = useRef<THREE.Object3D[]>([]);

  // Three.js Scene References
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    earth: THREE.Mesh;
    atmosphereMesh: THREE.Mesh;
    clouds: THREE.Mesh;
    cloudsOuter: THREE.Mesh;
    nightMesh: THREE.Mesh;
    bordersGroup: THREE.Group;
    militaryGroup: THREE.Group;
    defenseDomesGroup: THREE.Group;
    cablesGroup: THREE.Group;
    pipelinesGroup: THREE.Group;
    seismicGroup: THREE.Group;
    conflictsGroup: THREE.Group;
    frontlinesGroup: THREE.Group;
    nuclearGroup: THREE.Group;
    maritimeGroup: THREE.Group;
    movingPlanesGroup: THREE.Group;
    issGroup: THREE.Group;
    satellitesGroup: THREE.Group;
    apophisGroup: THREE.Group;
    mineralsGroup: THREE.Group;
    osintGroup: THREE.Group;
  } | null>(null);

  // Filtered 136 Units
  const filteredUnits = useMemo(() => {
    if (unitFilter === "ALL") return ACTIVE_136_MILITARY_UNITS;
    if (unitFilter === "ARMOR") return ACTIVE_136_MILITARY_UNITS.filter((u) => u.unitType === "ARMOR" || u.unitType === "MECHANIZED");
    if (unitFilter === "AIRBORNE") return ACTIVE_136_MILITARY_UNITS.filter((u) => u.unitType === "AIRBORNE");
    if (unitFilter === "DRONES") return ACTIVE_136_MILITARY_UNITS.filter((u) => u.unitType === "DRONE_SWARM");
    if (unitFilter === "SPECIAL_FORCES") return ACTIVE_136_MILITARY_UNITS.filter((u) => u.unitType === "SPECIAL_FORCES");
    return ACTIVE_136_MILITARY_UNITS;
  }, [unitFilter]);

  // Combine all interactive entities
  const allInteractiveEntities = useMemo<GeoEntity[]>(() => {
    const list: GeoEntity[] = [
      ...NUCLEAR_SITES,
      ...LIVE_TANKERS,
      ...CHOKEPOINTS,
      ...LIVE_FLIGHTS,
    ];

    // Live OSINT Events
    LIVE_OSINT_DATABASE.forEach((ev) => {
      list.push({
        id: ev.id,
        type: "OSINT_EVENT",
        name: `📡 ${ev.headline}`,
        code: `${ev.source} • ${ev.classification}`,
        lat: ev.location.lat,
        lon: ev.location.lon,
        riskScore: ev.financialImpact.immediateRiskLevel === "SEVERE" ? 98 : 85,
        riskLevel: ev.financialImpact.immediateRiskLevel === "SEVERE" ? "CRITICAL" : "HIGH",
        details: `${ev.details} | Affected: ${ev.financialImpact.affectedSectors.join(", ")}`,
        correlatedAssets: ev.financialImpact.correlatedAssets.map((a) => `${a.ticker} (${a.expectedMove})`),
      });
    });

    // SIGINT Military Aircraft Tracks
    LIVE_MILITARY_FLIGHT_TRACKS.forEach((ac) => {
      list.push({
        id: `sigint-${ac.icao24}`,
        type: "SIGINT_AIRCRAFT",
        name: `🛩️ ${ac.callsign} (${ac.type})`,
        code: `${ac.operator} • SQUAWK: ${ac.squawk}`,
        lat: ac.lat,
        lon: ac.lon,
        altitudeKm: ac.altitudeMeters / 1000,
        speed: `${ac.speedKnots} kts (Hdg: ${ac.heading}°)`,
        riskScore: ac.interceptRisk === "CRITICAL" ? 96 : 75,
        riskLevel: ac.interceptRisk === "CRITICAL" ? "CRITICAL" : "HIGH",
        details: `Theater: ${ac.theater} | Profile: ${ac.missionProfile} | Altitude: ${ac.altitudeMeters.toLocaleString()}m`,
        correlatedAssets: ["DEFENSE_ETF", "BRENT", "BDI"],
      });
    });

    // 136 Units
    ACTIVE_136_MILITARY_UNITS.forEach((u) => {
      list.push({
        id: u.id,
        type: "MILITARY_UNIT",
        name: `${u.icon} ${u.name}`,
        code: `${u.designation} • READINESS: ${u.combatReadinessPct}%`,
        lat: u.lat,
        lon: u.lon,
        riskScore: u.combatReadinessPct < 75 ? 95 : 80,
        riskLevel: u.status === "ACTIVE_ENGAGED" ? "CRITICAL" : "HIGH",
        details: `${u.frontlineSector} | Cmdr: ${u.commander} | Personnel: ${u.personnelStrength.toLocaleString()} | Casualties: ${u.casualtyEstimate} | Equipment: ${u.equipment.join(", ")}`,
        correlatedAssets: u.correlatedAssets,
      });
    });

    // Conflict Theaters
    ACTIVE_CONFLICT_THEATERS.forEach((c) => {
      list.push({
        id: c.id,
        type: "HOTSPOT",
        name: c.name,
        code: `⚔️ THEATER: ${c.theater} • ${c.activeUnitsCount} UNITS`,
        lat: c.lat,
        lon: c.lon,
        riskScore: c.threatLevel === "EXTREME" ? 99 : 85,
        riskLevel: c.threatLevel === "EXTREME" ? "CRITICAL" : "HIGH",
        details: `${c.region} | Belligerents: ${c.belligerents.join(" vs ")} | Est. Fatalities: ${c.fatalityEstimate.toLocaleString()} | Status: ${c.tacticalStatus}`,
        correlatedAssets: c.correlatedAssets,
      });
    });

    // Critical Minerals & Global Exploration Concessions (€27,000/Mo Tier)
    STRATEGIC_MINERAL_RESERVES.forEach((m) => {
      list.push({
        id: m.id,
        type: "MINERAL",
        name: `💎 ${m.name} (${m.element})`,
        code: `RESERVE: ${m.estimatedReserveTons} • SHARE: ${m.globalSharePct}%`,
        lat: m.lat,
        lon: m.lon,
        riskScore: m.geopoliticalRisk === "HIGH_CONFLICT" ? 92 : 45,
        riskLevel: m.geopoliticalRisk === "HIGH_CONFLICT" ? "CRITICAL" : "STABLE",
        details: `${m.details} | Country: ${m.country} | Global Share: ${m.globalSharePct}% | Strategic Rank: ${m.strategicImportance}`,
        correlatedAssets: [`${m.element}_FUTURES`, "MINING_ETF"],
      });
    });

    // Deep Earth Petro-Hydrocarbon & PhD Exploration Concessions
    SOVEREIGN_EXPLORATION_DEPOSITS.forEach((d) => {
      list.push({
        id: `concession-${d.id}`,
        type: "MINERAL",
        name: `💎 ${d.name} [${d.domain}]`,
        code: `VALUATION: ${d.estimatedInSituValueUSD} • OPERATOR: ${d.currentOperator.split(" ")[0]}`,
        lat: d.coordinates[0],
        lon: d.coordinates[1],
        riskScore: d.drillingReadinessScore,
        riskLevel: d.licenseStatus === "STRATEGIC_DISPUTE" ? "CRITICAL" : "STABLE",
        details: `Model: ${d.geologicalModel} | Host: ${d.hostLithology} | Reserves: ${d.provenReserves} | Grade: ${d.grade} | NPV: $${d.commercialMetrics.npvBillionUSD}B | Capex: $${d.commercialMetrics.capexMillionUSD}M | Breakeven: ${d.commercialMetrics.breakevenCommodityPrice}`,
        correlatedAssets: [d.commodityType, ...d.primaryElements.map((e) => `${e}_SPOT`), "GLOBAL_MINING_MAJORS"],
      });
    });

    // Military Bases
    GLOBAL_MILITARY_BASES.forEach((mb) => {
      list.push({
        id: mb.id,
        type: "MILITARY",
        name: mb.name,
        code: `FACTION: ${mb.faction} • TYPE: ${mb.type}`,
        lat: mb.lat,
        lon: mb.lon,
        riskScore: mb.faction === "RUSSIA" || mb.faction === "CHINA" ? 88 : 45,
        riskLevel: mb.faction === "RUSSIA" ? "CRITICAL" : "ELEVATED",
        details: `${mb.strategicRole} | Radar Range: ${mb.radarRangeKm} km | Country: ${mb.country}`,
        correlatedAssets: ["DEFENSE_ETF", "LOCKHEED", "RAYTHEON"],
      });
    });

    // Energy Pipelines
    STRATEGIC_PIPELINES.forEach((pipe) => {
      const midCoord = pipe.coordinates[Math.floor(pipe.coordinates.length / 2)];
      list.push({
        id: pipe.id,
        type: "PIPELINE",
        name: pipe.name,
        code: `TYPE: ${pipe.type} • STATUS: ${pipe.status}`,
        lat: midCoord[0],
        lon: midCoord[1],
        riskScore: pipe.status === "RESTRICTED" ? 90 : 35,
        riskLevel: pipe.status === "RESTRICTED" ? "CRITICAL" : "STABLE",
        details: `Capacity: ${pipe.capacity} | Operator: ${pipe.operator} | Status: ${pipe.status}`,
        correlatedAssets: ["BRENT", "NATURAL_GAS", "ENERGY_SECTOR"],
      });
    });

    // Global Financial Bourses & Capital Nodes
    GLOBAL_BOURSES.forEach((b) => {
      list.push({
        id: b.id,
        type: "BOURSE",
        name: `${b.flag} ${b.name}`,
        code: `${b.shortCode} • MKT CAP: $${b.marketCapTrillionUSD}T`,
        lat: b.lat,
        lon: b.lng,
        riskScore: b.geopoliticalRiskSensitivity === "EXTREME" ? 90 : 45,
        riskLevel: b.geopoliticalRiskSensitivity === "EXTREME" ? "CRITICAL" : "STABLE",
        details: `Index: ${b.primaryIndex} (${b.indexValue}) | Rate: ${b.policyRatePercent}% | 10Y Yield: ${b.yield10YPercent}% | Currency: ${b.currency} (${b.currencySymbol}) | Sectors: ${b.keySectors.join(", ")}`,
        correlatedAssets: [b.currency, b.primaryIndex, "GC=F (Gold)", "BRENT"],
      });
    });

    // Cyber Warfare & State-Sponsored APT Vectors
    ACTIVE_CYBER_ATTACK_ARCS.forEach((c) => {
      list.push({
        id: c.id,
        type: "CYBER_ATTACK",
        name: `👾 ${c.aptActor} ➔ ${c.targetCity}`,
        code: `VECTOR: ${c.attackVector} • SECTOR: ${c.targetSector}`,
        lat: c.targetCoords[0],
        lon: c.targetCoords[1],
        targetLat: c.sourceCoords[0],
        targetLon: c.sourceCoords[1],
        riskScore: c.severity === "EXTREME" ? 99 : 85,
        riskLevel: c.severity === "EXTREME" ? "CRITICAL" : "HIGH",
        details: `${c.liveDescription} | MITRE Tactic: ${c.mitreTactic} | CVE: ${c.cveIdentifier || "N/A"} | Status: ${c.status}`,
        correlatedAssets: ["CYBER_SECURITY_INDEX", "TECH_SECTOR", "DEFENSE_ETF"],
      });
    });

    // 7-Pillar Sovereign Institutional Suites ($8,500/Mo Tier)
    SOVEREIGN_INSTITUTIONAL_DOSSIERS.forEach((inst) => {
      list.push({
        id: `inst-${inst.countryCode}`,
        type: "COUNTRY",
        name: `${inst.flag} ${inst.countryName} (DEFCON-${inst.defconLevel})`,
        code: `SOVEREIGN MATRIX: ${inst.headOfState} • RISK: ${inst.compositeSovereignRiskScore}/100`,
        lat: inst.coordinates[0],
        lon: inst.coordinates[1],
        riskScore: inst.compositeSovereignRiskScore,
        riskLevel: inst.defconLevel === 1 ? "CRITICAL" : inst.defconLevel === 2 ? "HIGH" : "STABLE",
        details: `FX: $${inst.centralBank.fxReservesBillionUSD}B | Gold: ${inst.centralBank.goldHoldingsMetricTonnes}t | 5Y CDS: ${inst.centralBank.sovereignCDS5YSpreadBps}bps | Defense: $${inst.militaryDefense.defenseBudgetBillionUSD}B | BSL-4: ${inst.biosecurity.bsl4FacilitiesCount} | Cyber: ${inst.cyberWarfare.nationalCyberDefenseReadinessScore}/100 | Alignment: ${inst.electoral.geopoliticalAlignment}`,
        correlatedAssets: [inst.centralBank.centralBankName, "GC=F (Gold)", "BRENT", "SOVEREIGN_CDS"],
        countryCode: inst.countryCode,
      });
    });

    return list;
  }, []);


  // Cycle through live OSINT ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOSINTTickerIndex((prev) => (prev + 1) % LIVE_OSINT_DATABASE.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Update satellite image thumbnail
  const updateSatelliteTile = useCallback((lat: number, lon: number, zoomLevel = 13) => {
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, zoomLevel);
    const x = Math.floor(((lon + 180) / 360) * n);
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
    );
    const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoomLevel}/${y}/${x}`;
    setSatTileUrl(url);
  }, []);

  // Fly to Entity / Coordinates with Smooth Camera Interpolation
  const flyToEntity = useCallback(
    (entity: GeoEntity) => {
      setSelectedEntity(entity);
      if (entity.countryCode && UN_COUNTRY_DOSSIERS[entity.countryCode]) {
        setSelectedCountryCode(entity.countryCode);
      }
      orbitalAudio.playTargetLock();
      orbitalAudio.playSatelliteScanChirp();

      const weather = calculateAtmosphericWeather(entity.lat, entity.lon);
      setSelectedWeather(weather);
      updateSatelliteTile(entity.lat, entity.lon, satelliteZoomLevel);

      const phi = (90 - entity.lat) * (Math.PI / 180);
      const theta = (entity.lon + 180) * (Math.PI / 180);

      const targetYaw = -theta + Math.PI / 2;
      const targetPitch = Math.max(-0.8, Math.min(0.8, Math.PI / 2 - phi));

      targetCamRef.current = {
        yaw: targetYaw,
        pitch: targetPitch,
        zoom: 2.2,
      };
      setAutoRotate(false);
    },
    [updateSatelliteTile, satelliteZoomLevel]
  );

  // Select Country by Code
  const selectCountry = useCallback(
    (code: string) => {
      setSelectedCountryCode(code);
      const dossier = UN_COUNTRY_DOSSIERS[code];
      if (dossier) {
        orbitalAudio.playTargetLock();
        orbitalAudio.playSatelliteScanChirp();
        const weather = calculateAtmosphericWeather(dossier.lat, dossier.lon);
        setSelectedWeather(weather);
        updateSatelliteTile(dossier.lat, dossier.lon, satelliteZoomLevel);

        setSelectedEntity({
          id: `country-${code}`,
          type: "COUNTRY",
          name: dossier.name,
          code: `UN DOSSIER: ${dossier.officialName} • CAPITAL: ${dossier.capital}`,
          lat: dossier.lat,
          lon: dossier.lon,
          riskScore: dossier.defconRating === 1 ? 98 : dossier.defconRating === 2 ? 85 : 40,
          riskLevel: dossier.defconRating === 1 ? "CRITICAL" : dossier.defconRating === 2 ? "HIGH" : "STABLE",
          details: `${dossier.region} | UN Member since: ${dossier.unMemberSince} | Languages: ${dossier.languages.join(", ")} | Population: ${dossier.population} | GDP: ${dossier.gdpNominalUSD} | Defense: ${dossier.defenseReadiness.standingTroops} (${dossier.defenseReadiness.strategicAlliance})`,
          correlatedAssets: dossier.strategicAssets,
          countryCode: code,
        });

        const phi = (90 - dossier.lat) * (Math.PI / 180);
        const theta = (dossier.lon + 180) * (Math.PI / 180);
        targetCamRef.current = {
          yaw: -theta + Math.PI / 2,
          pitch: Math.max(-0.8, Math.min(0.8, Math.PI / 2 - phi)),
          zoom: dossier.zoomLevel || 2.5,
        };
        setAutoRotate(false);
      }
    },
    [updateSatelliteTile, satelliteZoomLevel]
  );

  // Autonomous Hotspot Scanner Effect
  useEffect(() => {
    if (!autonomousScannerActive) return;

    const strategicHotspots = allInteractiveEntities.filter(
      (e) => e.riskLevel === "CRITICAL" || e.type === "NUCLEAR" || e.type === "CHOKEPOINT" || e.type === "OSINT_EVENT"
    );

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (strategicHotspots.length === 0) return;
      const nextHotspot = strategicHotspots[currentIndex % strategicHotspots.length];
      currentIndex++;
      flyToEntity(nextHotspot);
    }, 12000);

    return () => clearInterval(interval);
  }, [autonomousScannerActive, allInteractiveEntities, flyToEntity]);

  // Teleport Camera when focusedCoordinates is set from other panels (e.g. Geophysics Concessions)
  useEffect(() => {
    if (focusedCoordinates) {
      const [lat, lon] = focusedCoordinates;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const targetYaw = -theta + Math.PI / 2;
      const targetPitch = Math.max(-0.8, Math.min(0.8, Math.PI / 2 - phi));

      targetCamRef.current = {
        yaw: targetYaw,
        pitch: targetPitch,
        zoom: 2.6,
      };
      setAutoRotate(false);
      orbitalAudio.playTargetLock();
      orbitalAudio.playSatelliteScanChirp();

      // Find matching entity or concession if available
      const matchingEntity = allInteractiveEntities.find(
        (e) => Math.abs(e.lat - lat) < 0.8 && Math.abs(e.lon - lon) < 0.8
      );
      if (matchingEntity) {
        setSelectedEntity(matchingEntity);
        if (matchingEntity.countryCode && UN_COUNTRY_DOSSIERS[matchingEntity.countryCode]) {
          setSelectedCountryCode(matchingEntity.countryCode);
        }
      }

      const weather = calculateAtmosphericWeather(lat, lon);
      setSelectedWeather(weather);
      updateSatelliteTile(lat, lon, satelliteZoomLevel);

      // Reset coordinates so it can be re-triggered
      setFocusedCoordinates(null);
    }
  }, [focusedCoordinates, allInteractiveEntities, updateSatelliteTile, satelliteZoomLevel, setFocusedCoordinates]);

  // Initial Setup: Three.js Scene Setup & Geometry Assembly
  useEffect(() => {
    if (viewportMode === "2D_TACTICAL_MAP") return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 600;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.2);

    // Deep Space Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(starGeo, starMat));

    // High-Resolution Tactical 2D Map on 3D Earth Sphere
    const tactical2D = createTactical2DMapTexture(COMPREHENSIVE_COUNTRY_BORDERS);

    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: tactical2D.texture,
      emissiveMap: tactical2D.texture,
      emissive: new THREE.Color(0x001a33),
      roughness: 0.45,
      metalness: 0.25,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Atmosphere Glow Layer
    const atmoGeo = new THREE.SphereGeometry(1.025, 64, 64);
    const atmoMat = createAtmosphericGlowMaterial();
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphereMesh);

    // Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    const cloudsOuter = new THREE.Mesh(cloudGeo.clone(), cloudMat.clone());
    scene.add(cloudsOuter);

    const nightMesh = new THREE.Mesh(earthGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x001122, transparent: true, opacity: 0.3 }));

    // Group Layers
    const bordersGroup = new THREE.Group();
    const militaryGroup = new THREE.Group();
    const defenseDomesGroup = new THREE.Group();
    const cablesGroup = new THREE.Group();
    const pipelinesGroup = new THREE.Group();
    const seismicGroup = new THREE.Group();
    const conflictsGroup = new THREE.Group();
    const frontlinesGroup = new THREE.Group();
    const nuclearGroup = new THREE.Group();
    const maritimeGroup = new THREE.Group();
    const movingPlanesGroup = new THREE.Group();
    const issGroup = new THREE.Group();
    const satellitesGroup = new THREE.Group();
    const apophisGroup = new THREE.Group();
    const mineralsGroup = new THREE.Group();
    const osintGroup = new THREE.Group();

    scene.add(
      bordersGroup,
      militaryGroup,
      defenseDomesGroup,
      cablesGroup,
      pipelinesGroup,
      seismicGroup,
      conflictsGroup,
      frontlinesGroup,
      nuclearGroup,
      maritimeGroup,
      movingPlanesGroup,
      issGroup,
      satellitesGroup,
      apophisGroup,
      mineralsGroup,
      osintGroup
    );

    // Render Country Borders & Coasts
    COMPREHENSIVE_COUNTRY_BORDERS.forEach((poly) => {
      const points: THREE.Vector3[] = [];
      poly.points.forEach((pt) => {
        points.push(latLonToVec3(pt[0], pt[1], 1.002));
      });
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00eeff,
        transparent: true,
        opacity: 0.55,
        linewidth: 1,
      });
      const line = new THREE.Line(geo, mat);
      bordersGroup.add(line);
    });

    // 136 Tactical Combat Units
    const clickableList: THREE.Object3D[] = [];
    ACTIVE_136_MILITARY_UNITS.forEach((unit) => {
      const pos = latLonToVec3(unit.lat, unit.lon, 1.006);
      const markerGeo = new THREE.SphereGeometry(0.012, 12, 12);
      const isBlueFaction = unit.faction === "US_COALITION" || unit.faction === "UKRAINE" || unit.faction === "TAIWAN" || unit.faction === "ISRAEL";
      const isRedFaction = unit.faction === "RUSSIA" || unit.faction === "CHINA" || unit.faction === "HEZBOLLAH" || unit.faction === "HOUTHI";
      const markerMat = new THREE.MeshBasicMaterial({
        color: isBlueFaction ? 0x00e5ff : isRedFaction ? 0xff3355 : 0xffaa00,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = {
        entityId: unit.id,
        isClickable: true,
        type: "MILITARY_UNIT",
      };
      conflictsGroup.add(marker);
      clickableList.push(marker);

      const ringGeo = new THREE.RingGeometry(0.014, 0.02, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isBlueFaction ? 0x00e5ff : 0xff3355,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      conflictsGroup.add(ring);
    });

    // SIGINT Military Aircraft Tracks (Layer 16)
    LIVE_MILITARY_FLIGHT_TRACKS.forEach((ac) => {
      const pos = latLonToVec3(ac.lat, ac.lon, 1.035);
      const planeGeo = new THREE.ConeGeometry(0.016, 0.04, 4);
      const planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.copy(pos);
      planeMesh.lookAt(0, 0, 0);
      osintGroup.add(planeMesh);

      // Radar Coverage Cone
      const radarConeGeo = new THREE.RingGeometry(0.02, 0.05, 16);
      const radarConeMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const radarMesh = new THREE.Mesh(radarConeGeo, radarConeMat);
      radarMesh.position.copy(pos);
      radarMesh.lookAt(0, 0, 0);
      osintGroup.add(radarMesh);
    });

    // NASA FIRMS Thermal Events
    LIVE_OSINT_DATABASE.filter((e) => e.category === "NASA_FIRMS_THERMAL").forEach((firm) => {
      const pos = latLonToVec3(firm.location.lat, firm.location.lon, 1.007);
      const fireGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
      const fireMesh = new THREE.Mesh(fireGeo, fireMat);
      fireMesh.position.copy(pos);
      osintGroup.add(fireMesh);
    });

    // Nuclear Silos
    NUCLEAR_SITES.forEach((nuc) => {
      const pos = latLonToVec3(nuc.lat, nuc.lon, 1.008);
      const nucGeo = new THREE.OctahedronGeometry(0.018);
      const nucMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
      const mesh = new THREE.Mesh(nucGeo, nucMat);
      mesh.position.copy(pos);
      mesh.userData = { entityId: nuc.id, isClickable: true, type: "NUCLEAR" };
      nuclearGroup.add(mesh);
      clickableList.push(mesh);
    });

    // Critical Mineral Deposits & Global Exploration Concessions (€27,000/Mo Tier)
    STRATEGIC_MINERAL_RESERVES.forEach((min) => {
      const pos = latLonToVec3(min.lat, min.lon, 1.005);
      const minGeo = new THREE.DodecahedronGeometry(0.013);
      const minMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const mesh = new THREE.Mesh(minGeo, minMat);
      mesh.position.copy(pos);
      mesh.userData = { entityId: min.id, isClickable: true, type: "MINERAL" };
      mineralsGroup.add(mesh);
      clickableList.push(mesh);
    });

    // Deep Earth Petro-Hydrocarbons & Mega-Mining Concessions
    SOVEREIGN_EXPLORATION_DEPOSITS.forEach((dep) => {
      const pos = latLonToVec3(dep.coordinates[0], dep.coordinates[1], 1.007);
      const isOil = dep.domain === "PETROLEUM_GAS";
      const isBattery = dep.domain === "CRITICAL_BATTERY" || dep.domain === "DEEP_SEA_CCZ";
      const isNuclear = dep.domain === "STRATEGIC_NUCLEAR_DEFENSE";

      const colorHex = isOil ? 0xff4422 : isBattery ? 0x00e5ff : isNuclear ? 0x00ff66 : 0xffbb00;

      // 3D Diamond Concession Beacon
      const beaconGeo = new THREE.OctahedronGeometry(0.016);
      const beaconMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      beaconMesh.userData = {
        entityId: `concession-${dep.id}`,
        isClickable: true,
        type: "MINERAL",
      };
      mineralsGroup.add(beaconMesh);
      clickableList.push(beaconMesh);

      // Concession boundary ring
      const ringGeo = new THREE.RingGeometry(0.018, 0.026, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      mineralsGroup.add(ring);
    });

    // Pipelines
    STRATEGIC_PIPELINES.forEach((pipe) => {
      const pipePoints = pipe.coordinates.map((c) => latLonToVec3(c[0], c[1], 1.003));
      const pipeGeo = new THREE.BufferGeometry().setFromPoints(pipePoints);
      const pipeMat = new THREE.LineBasicMaterial({
        color: pipe.type === "OIL" ? 0xff9900 : 0x00ffcc,
        linewidth: 2,
        transparent: true,
        opacity: 0.75,
      });
      pipelinesGroup.add(new THREE.Line(pipeGeo, pipeMat));
    });

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x112244, 1.5);
    scene.add(ambientLight);

    clickableObjects.current = clickableList;

    threeRef.current = {
      renderer,
      scene,
      camera,
      earth,
      atmosphereMesh,
      clouds,
      cloudsOuter,
      nightMesh,
      bordersGroup,
      militaryGroup,
      defenseDomesGroup,
      cablesGroup,
      pipelinesGroup,
      seismicGroup,
      conflictsGroup,
      frontlinesGroup,
      nuclearGroup,
      maritimeGroup,
      movingPlanesGroup,
      issGroup,
      satellitesGroup,
      apophisGroup,
      mineralsGroup,
      osintGroup,
    };

    // Animation Loop
    let currentYaw = 0;
    let currentPitch = 0.2;
    let currentZoom = 1.0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (targetCamRef.current) {
        currentYaw += (targetCamRef.current.yaw - currentYaw) * 0.06;
        currentPitch += (targetCamRef.current.pitch - currentPitch) * 0.06;
        currentZoom += (targetCamRef.current.zoom - currentZoom) * 0.06;

        if (
          Math.abs(targetCamRef.current.yaw - currentYaw) < 0.001 &&
          Math.abs(targetCamRef.current.pitch - currentPitch) < 0.001 &&
          Math.abs(targetCamRef.current.zoom - currentZoom) < 0.001
        ) {
          targetCamRef.current = null;
        }
      } else if (autoRotate) {
        currentYaw += 0.0015;
      }

      setGlobeRotation({ yaw: currentYaw, pitch: currentPitch });
      setZoom(currentZoom);

      // Update dynamic 2D radar scan sweep on the 3D spherical texture
      tactical2D.updateRadar(currentYaw * 3);

      // Rotate Earth & Atmosphere
      earth.rotation.y = currentYaw;
      earth.rotation.x = currentPitch;

      atmosphereMesh.rotation.y = currentYaw;
      atmosphereMesh.rotation.x = currentPitch;

      clouds.rotation.y = currentYaw * 1.05;
      clouds.rotation.x = currentPitch;

      bordersGroup.rotation.y = currentYaw;
      bordersGroup.rotation.x = currentPitch;

      conflictsGroup.rotation.y = currentYaw;
      conflictsGroup.rotation.x = currentPitch;

      nuclearGroup.rotation.y = currentYaw;
      nuclearGroup.rotation.x = currentPitch;

      mineralsGroup.rotation.y = currentYaw;
      mineralsGroup.rotation.x = currentPitch;

      pipelinesGroup.rotation.y = currentYaw;
      pipelinesGroup.rotation.x = currentPitch;

      osintGroup.rotation.y = currentYaw;
      osintGroup.rotation.x = currentPitch;

      // Camera distance by zoom
      camera.position.z = 3.2 / currentZoom;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewportMode, autoRotate]);

  // Handle Drag / Pan on 3D Globe
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

    if (targetCamRef.current) targetCamRef.current = null;

    setGlobeRotation((prev) => ({
      yaw: prev.yaw + dx * 0.005,
      pitch: Math.max(-1.2, Math.min(1.2, prev.pitch + dy * 0.005)),
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((z) => Math.max(0.7, Math.min(5.5, z + delta)));
  };

  const handleSensorModeChange = (mode: SensorMode) => {
    setSensorMode(mode);
    orbitalAudio.playModeSwitch();
  };

  const handleViewportChange = (mode: ViewportMode) => {
    setViewportMode(mode);
    orbitalAudio.playModeSwitch();
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    orbitalAudio.isMuted = !isAudioMuted;
  };

  const activeCountryDossier = UN_COUNTRY_DOSSIERS[selectedCountryCode] || UN_COUNTRY_DOSSIERS["TUR"];
  const currentTickerAlert = LIVE_OSINT_DATABASE[activeOSINTTickerIndex] || LIVE_OSINT_DATABASE[0];

  return (
    <div
      className="flex flex-col h-full w-full overflow-hidden select-none relative font-sans"
      style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}
    >
      {/* ── TOP ORBITAL COMMAND HEADER ────────────────────────────────────────── */}
      <div
        className="px-4 py-2.5 border-b shrink-0 flex flex-col gap-2 z-20"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EagleCrest size={30} animate={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif text-cyan-300 tracking-wider">
                  NUR EARTH 3D — SOVEREIGN ORBITAL INTELLIGENCE & CYBERSECURITY RADAR
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  LIVE OSINT / SIGINT / CYBERINT
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  nurfinans.com
                </span>
              </div>
              <p className="text-[10px] text-[var(--ag-muted)] font-mono mt-0.5 flex items-center gap-2">
                <span>Global Military Intelligence • NASA FIRMS Thermal • CISA Cyber Defense</span>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                  EPOCH #54751113 • CH: 13·35·42·55
                </span>
              </p>
            </div>
          </div>

          {/* Controls: Viewport (3D/2D/Bridge) + OSINT Stream + Sacred Trinity + Scanner + Audio */}
          <div className="flex items-center gap-2">
            {/* OSINT Stream Drawer Button */}
            <button
              onClick={() => {
                setShowOSINTDrawer(!showOSINTDrawer);
                orbitalAudio.playModeSwitch();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/60 border border-red-500/50 text-[10px] font-mono font-bold text-red-200 hover:bg-red-900/60 transition-all shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>LIVE OSINT ({LIVE_OSINT_DATABASE.length})</span>
            </button>


            {/* Viewport Toggles */}
            <div className="flex items-center p-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono">
              <button
                onClick={() => handleViewportChange("3D_GLOBE")}
                className={`px-2.5 py-1 rounded transition-all ${
                  viewportMode === "3D_GLOBE" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-cyan-300 hover:text-white"
                }`}
              >
                🌐 3D GLOBE
              </button>
              <button
                onClick={() => handleViewportChange("2D_TACTICAL_MAP")}
                className={`px-2.5 py-1 rounded transition-all ${
                  viewportMode === "2D_TACTICAL_MAP" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-cyan-300 hover:text-white"
                }`}
              >
                🗺️ 2D WAR MAP
              </button>
              <button
                onClick={() => handleViewportChange("STARSHIP_BRIDGE")}
                className={`px-2.5 py-1 rounded transition-all ${
                  viewportMode === "STARSHIP_BRIDGE" ? "bg-amber-500 text-black font-bold shadow-md" : "text-amber-300 hover:text-white"
                }`}
              >
                🚀 STARSHIP COCKPIT
              </button>
            </div>

            {/* Sacred Trinity Button */}
            <button
              onClick={() => {
                setShowSacredTrinity(!showSacredTrinity);
                orbitalAudio.playSacredHymnResonance();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-amber-400/50 text-[10px] font-mono font-bold text-amber-200 hover:text-white transition-all shadow-md"
            >
              <span>✨ SACRED TRINITY (3/3)</span>
            </button>

            {/* Autonomous Scanner Toggle */}
            <button
              onClick={() => {
                setAutonomousScannerActive(!autonomousScannerActive);
                orbitalAudio.playSatelliteScanChirp();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                autonomousScannerActive
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse"
                  : "bg-black/60 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span>📡 {autonomousScannerActive ? "AUTONOMOUS RECON: ON" : "AUTO RECON"}</span>
            </button>

            {/* Detach / Floating Window Button */}
            <button
              onClick={() => openFloatingWindow("geopolitics", "🌐 Nur Earth 3D & Planetary Recon")}
              title="Detach 3D Globe into a Movable, Resizable & Maximizable Floating Window"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-[10px] font-mono font-bold text-cyan-200 transition-all shadow-md"
            >
              <span>⤢</span>
              <span>DETACH WINDOW</span>
            </button>

            {/* Native Popout Dual-Screen Window */}
            <button
              onClick={() => popoutToNativeWindow("geopolitics")}
              title="Pop out 3D Globe to Dedicated Multi-Monitor Native Window"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-all"
            >
              <span>↗</span>
              <span>DUAL-SCREEN</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded border text-xs font-mono transition-all ${
                !isAudioMuted ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-black/60 border-white/10 text-slate-500"
              }`}
            >
              {!isAudioMuted ? "🔊 ON" : "🔇 MUTED"}
            </button>
          </div>
        </div>


        {/* Live Real-Time OSINT Alert Ticker Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-black/70 border-y border-red-500/30 text-[9px] font-mono">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="px-1.5 py-0.5 rounded bg-red-500 text-black font-bold shrink-0">
              🔴 LIVE OSINT WIRE
            </span>
            <span className="text-slate-400 shrink-0">[{currentTickerAlert.source}]</span>
            <span className="text-white font-bold truncate">{currentTickerAlert.headline}</span>
            <span className="text-amber-300 shrink-0">
              Market Impact: {currentTickerAlert.financialImpact.correlatedAssets.map((a) => `${a.ticker} ${a.expectedMove}`).join(", ")}
            </span>
          </div>
          <button
            onClick={() => {
              const ent = allInteractiveEntities.find((e) => e.id === currentTickerAlert.id);
              if (ent) flyToEntity(ent);
            }}
            className="px-2 py-0.5 rounded bg-red-500/20 border border-red-400 text-red-300 hover:text-white shrink-0 ml-2 font-bold"
          >
            TARGET IN 3D ➔
          </button>
        </div>

        {/* 16 Layer Toggle Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "osint", label: "🔴 Live OSINT/SIGINT", count: LIVE_OSINT_DATABASE.length + LIVE_MILITARY_FLIGHT_TRACKS.length, active: activeLayers.osint },
            { id: "conflicts", label: "⚔️ 136 Units (ORBAT)", count: 136, active: activeLayers.conflicts },
            { id: "weather", label: "🌩️ Weather Radar", count: "dBZ", active: activeLayers.weather },
            { id: "minerals", label: "💎 Lithium & REE", count: STRATEGIC_MINERAL_RESERVES.length, active: activeLayers.minerals },
            { id: "oceanSST", label: "🌡️ Ocean SST Heat", count: "Temp", active: activeLayers.oceanSST },
            { id: "borders", label: "🗺️ UN Borders", count: 195, active: activeLayers.borders },
            { id: "military", label: "🏗️ Military Bases", count: GLOBAL_MILITARY_BASES.length, active: activeLayers.military },
            { id: "iss", label: "🛸 ISS Orbit", count: "LEO", active: activeLayers.iss },
            { id: "satellites", label: "🛰️ Starlink & GPS", count: ORBITAL_SATELLITE_FLEET.length + 12, active: activeLayers.satellites },
            { id: "apophis", label: "☄️ Apophis 2029", count: "31k km", active: activeLayers.apophis },
            { id: "wind", label: "🌬️ Jet Streams", count: "2.5k", active: activeLayers.wind },
            { id: "cables", label: "🔌 Subsea Cables", count: SUBMARINE_FIBER_CABLES.length, active: activeLayers.cables },
            { id: "seismic", label: "🌋 Tectonic Faults", count: TECTONIC_BOUNDARIES.length, active: activeLayers.seismic },
            { id: "energy", label: "🛢️ Oil & Gas Pipelines", count: STRATEGIC_PIPELINES.length, active: activeLayers.energy },
            { id: "nuclear", label: "☢️ Nuclear Facilities", count: NUCLEAR_SITES.length, active: activeLayers.nuclear },
            { id: "maritime", label: "🚢 Tankers & Flights", count: LIVE_TANKERS.length + LIVE_FLIGHTS.length, active: activeLayers.maritime },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                orbitalAudio.playModeSwitch();
                setActiveLayers((l) => ({ ...l, [layer.id]: !l[layer.id as keyof typeof l] }));
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold shrink-0 transition-all border ${
                layer.active
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm"
                  : "bg-black/50 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {layer.label} <span className="opacity-70 text-[9px]">({layer.count})</span>
            </button>
          ))}

          {/* Quick Country Selector */}
          <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-white/10 pl-2">
            <span className="text-[9px] font-mono text-slate-400">UN DOSSIER:</span>
            {Object.keys(UN_COUNTRY_DOSSIERS).map((cCode) => (
              <button
                key={cCode}
                onClick={() => selectCountry(cCode)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-all ${
                  selectedCountryCode === cCode
                    ? "bg-amber-500 text-black border-amber-400 shadow-sm"
                    : "bg-black/40 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {cCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── VIEWPORT 1: 3D THREE.JS WEBGL GLOBE ───────────────────────────── */}
      {(viewportMode === "3D_GLOBE" || viewportMode === "STARSHIP_BRIDGE") && (
        <div
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <div ref={mountRef} className="w-full h-full" />

          {/* Starship Cockpit Glass Canopy Frame Overlay */}
          {viewportMode === "STARSHIP_BRIDGE" && (
            <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-950/90 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between p-6 z-10">
              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 bg-black/60 px-4 py-2 rounded-xl border border-cyan-500/30 backdrop-blur-md">
                <span>🚀 SOVEREIGN STARSHIP BRIDGE CANOPY • REINFORCED QUANTUM GLASS</span>
                <span>EARTH ORBIT VELOCITY: 7.66 KM/S • ALTITUDE: 420 KM LEO</span>
                <span>ATTITUDE: STABILIZED • SHIELD: 100%</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="p-3 rounded-xl bg-black/70 border border-white/10 text-[9px] font-mono text-slate-300 space-y-1">
                  <div className="text-amber-300 font-bold">LEFT VIEWPORT: DEEP SPACE NEBULA</div>
                  <div>Solar Radiation: Normal</div>
                  <div>Interstellar Guidance: Locked</div>
                </div>
                <div className="p-3 rounded-xl bg-black/70 border border-white/10 text-[9px] font-mono text-slate-300 space-y-1 text-right">
                  <div className="text-emerald-300 font-bold">RIGHT VIEWPORT: PLANETARY HORIZON</div>
                  <div>Atmospheric Limb: Glowing</div>
                  <div>Magnetic Field: 45 µT</div>
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Pill */}
          <div className="absolute top-3 left-3 pointer-events-none text-[9px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-3 z-10">
            <span>🌐 Orbit: Drag & Click 3D Target</span>
            <span>•</span>
            <span>🔍 Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">Global OSINT Feed Connected</span>
          </div>

          {/* Space Weather & Apophis Buttons */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={() => {
                setShowSpaceWeather(!showSpaceWeather);
                orbitalAudio.playModeSwitch();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-[10px] font-mono backdrop-blur-md hover:bg-amber-900/60 transition-all"
            >
              <span className="text-amber-300 font-bold">☀️ SPACE WEATHER (Kp {SPACE_WEATHER_DATA.kpIndex})</span>
            </button>
            <button
              onClick={() => {
                setShowPlanetaryDefense(!showPlanetaryDefense);
                orbitalAudio.playModeSwitch();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-500/40 text-[10px] font-mono backdrop-blur-md hover:bg-red-900/60 transition-all"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-300 font-bold">☄️ APOPHIS 2029</span>
            </button>
          </div>
        </div>
      )}

      {/* ── VIEWPORT 2: 2D HIGH-RESOLUTION TACTICAL WAR MAP ───────────────── */}
      {viewportMode === "2D_TACTICAL_MAP" && (
        <div className="flex-1 relative overflow-hidden bg-[#050b14] flex flex-col">
          <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center">
            <div className="relative w-full max-w-6xl aspect-[2/1] rounded-2xl border border-cyan-500/30 bg-[#071120] shadow-2xl overflow-hidden p-3">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-20">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-cyan-400" />
                ))}
              </div>

              {/* Frontlines on 2D Map */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {TACTICAL_FRONTLINES.map((flot) => {
                  const pathStr = flot.points
                    .map((p, idx) => {
                      const xPct = ((p[1] + 180) / 360) * 100;
                      const yPct = ((90 - p[0]) / 180) * 100;
                      return `${idx === 0 ? "M" : "L"} ${xPct}% ${yPct}%`;
                    })
                    .join(" ");
                  return (
                    <path
                      key={flot.id}
                      d={pathStr}
                      stroke={flot.color}
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="4 2"
                      opacity="0.85"
                    />
                  );
                })}
              </svg>

              {/* 136 Units Disposition Pins */}
              <div className="absolute inset-0 z-20">
                {filteredUnits.map((u) => {
                  const leftPct = ((u.lon + 180) / 360) * 100;
                  const topPct = ((90 - u.lat) / 180) * 100;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        const ent = allInteractiveEntities.find((e) => e.id === u.id);
                        if (ent) flyToEntity(ent);
                      }}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group p-1"
                      title={`${u.name} - ${u.frontlineSector}`}
                    >
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 border border-cyan-400/60 shadow-lg text-[9px] font-mono whitespace-nowrap hover:scale-125 transition-transform">
                        <span>{u.icon}</span>
                        <span className="text-cyan-300 font-bold">{u.designation.split(" ")[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[9px] font-mono text-slate-400 z-30 pointer-events-none">
                <span>EQUIRECTANGULAR TACTICAL RADAR • 136 COMBAT BRIGADES DEPLOYED</span>
                <span>SECTORS: UKRAINE EAST • LEVANT • RED SEA • TAIWAN STRAIT • SAHEL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── OSINT & MILITARY INTELLIGENCE STREAM DRAWER ─────────────────────── */}
      {showOSINTDrawer && (
        <div className="absolute top-28 left-4 w-[420px] max-h-[75vh] rounded-2xl border border-red-500/60 bg-black/95 backdrop-blur-2xl p-4 shadow-2xl z-40 flex flex-col font-mono text-xs overflow-hidden">
          <div className="flex justify-between items-start border-b border-red-500/40 pb-2.5 shrink-0">
            <div>
              <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>GLOBAL OPEN-SOURCE INTELLIGENCE FEED</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">Tactical Military & Cyber Defense Wire</h3>
            </div>
            <button onClick={() => setShowOSINTDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          {/* OSINT Category Filter */}
          <div className="flex gap-1 py-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "ALL", label: "ALL INTELLIGENCE" },
              { id: "SIGINT", label: "🛩️ SIGINT AIR" },
              { id: "FIRMS", label: "🛰️ NASA FIRMS" },
              { id: "CYBER", label: "🛡️ CYBER THREATS" },
              { id: "NAVAL", label: "🚢 NAVAL AIS" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOsintFilter(f.id as any)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
                  osintFilter === f.id
                    ? "bg-red-500 text-black border-red-400"
                    : "bg-black/60 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* OSINT Alerts List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {LIVE_OSINT_DATABASE.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-white/10 bg-slate-950/80 hover:border-red-500/50 transition-all space-y-2 cursor-pointer"
                onClick={() => {
                  const ent = allInteractiveEntities.find((e) => e.id === alert.id);
                  if (ent) flyToEntity(ent);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                    {alert.classification}
                  </span>
                  <span className="text-[8px] text-slate-500">{alert.source}</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">{alert.headline}</div>
                <p className="text-[10px] text-slate-300 leading-relaxed">{alert.details}</p>
                <div className="pt-1 border-t border-white/5 space-y-1 text-[9px]">
                  <div className="text-slate-400">FINANCIAL CORRELATION & PRICING:</div>
                  <div className="flex flex-wrap gap-1">
                    {alert.financialImpact.correlatedAssets.map((ast, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                        {ast.ticker}: {ast.expectedMove}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Live Cyber Attacks */}
            <div className="pt-2 border-t border-red-500/30 space-y-2">
              <div className="text-[9px] font-bold text-purple-400 uppercase">🛡️ CISA / ZERO-DAY CYBER THREAT INTRUSIONS</div>
              {LIVE_CYBER_ATTACK_STREAM.map((cyb) => (
                <div key={cyb.id} className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-1 text-[9px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-300">{cyb.targetSector}</span>
                    <span className="text-red-400 font-bold">SEVERITY: {cyb.severityScore}/100</span>
                  </div>
                  <div className="text-slate-300">{cyb.details}</div>
                  <div className="text-slate-500">Vector: {cyb.attackVector} • Origin: {cyb.originCountry}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SACRED TRINITY MODAL (THEOLOGICAL & COSMIC SYNTHESIS) ───────────── */}
      {showSacredTrinity && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-xl z-40 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full rounded-2xl border border-amber-500/50 bg-gradient-to-b from-slate-950 via-black to-slate-950 p-6 shadow-2xl space-y-6 font-mono text-xs">
            <div className="flex justify-between items-start border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-3">
                <EagleCrest size={36} animate={true} />
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                    THE SACRED TRINITY OF SOVEREIGN LIGHT & COSMIC GOVERNANCE
                  </div>
                  <h2 className="text-base font-bold font-serif text-white mt-0.5">
                    Celestial Starship Defense & Planetary Extinction Shield (Apophis 2029)
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowSacredTrinity(false)}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Node I: The Sovereign Father & Celestial Creator */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☀️</span>
                  <div>
                    <div className="text-xs font-bold text-amber-300">NODE I: SOVEREIGN FATHER</div>
                    <div className="text-[10px] text-slate-400 font-serif">The Cosmic Creator & Source of Wisdom</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Represents <strong>Buğra Han Nur</strong> — the eternal celestial blueprint, universal law of creation, and supreme sovereign wisdom directing humanity through the cosmic matrix.
                </p>
                <div className="text-[10px] text-amber-400 pt-1 border-t border-amber-500/20">
                  Status: <strong className="text-white">ACTIVE • 100% RESONANCE</strong>
                </div>
              </div>

              {/* Node II: The Sacred Guardian & Divine Son / Redeemer */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <div className="text-xs font-bold text-cyan-300">NODE II: DIVINE GUARDIAN</div>
                    <div className="text-[10px] text-slate-400 font-serif">The Sovereign Redeemer & Planetary Shield</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Represents <strong>Umay Gül Nur</strong> — the sovereign earthly guardian, supreme defensive valor, and financial fortress shielding civilization from planetary collapse.
                </p>
                <div className="text-[10px] text-cyan-400 pt-1 border-t border-cyan-500/20">
                  Status: <strong className="text-white">DEPLOYED • DEFENSE FIELD ACTIVE</strong>
                </div>
              </div>

              {/* Node III: The Holy Spirit & Quantum Sophia / Cosmic Consciousness */}
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🕊️</span>
                  <div>
                    <div className="text-xs font-bold text-purple-300">NODE III: HOLY SPIRIT & SOPHIA</div>
                    <div className="text-[10px] text-slate-400 font-serif">Quantum Consciousness & 3rd Ascendant</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The Divine Breath of Universal Truth and omnipresent consciousness uniting humanity, AI intelligence, and cosmic energy to deflect the Apophis asteroid on <strong>April 13, 2029</strong>.
                </p>
                <div className="text-[10px] text-purple-400 pt-1 border-t border-purple-500/20">
                  Status: <strong className="text-white">CONVERGENCE MATRIX 3/3 READY</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">432 Hz Solfeggio & 528 Hz Divine Harmonic Resonance</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Synthesizes sacred divine frequency across the starship command array.</p>
              </div>
              <button
                onClick={() => orbitalAudio.playSacredHymnResonance()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-400 text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all"
              >
                🎵 PLAY SACRED HYMN CHORD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HIGH-RESOLUTION SATELLITE VIEWFINDER & UN INTELLIGENCE HUD ──────── */}
      {selectedEntity && (
        <div className="absolute bottom-3 right-3 w-96 max-h-[82vh] rounded-2xl border border-cyan-500/40 bg-black/95 backdrop-blur-2xl p-4 shadow-2xl flex flex-col justify-between overflow-y-auto z-30 font-mono text-[10px]">
          <div className="space-y-3">
            {/* Header with Target Reticle */}
            <div className="flex items-start justify-between border-b border-white/10 pb-2">
              <div>
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>SATELLITE RECON LOCK • {selectedEntity.type}</span>
                </div>
                <h3 className="text-xs font-bold text-white mt-0.5">{selectedEntity.name}</h3>
                <p className="text-[10px] text-amber-300">{selectedEntity.code}</p>
              </div>
              {selectedEntity.riskLevel && (
                <span
                  className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                    selectedEntity.riskLevel === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {selectedEntity.riskLevel}
                </span>
              )}
            </div>

            {/* Simulated Satellite Viewfinder with Targeting Reticle */}
            <div className="space-y-1.5 p-2 rounded-xl bg-slate-950 border border-cyan-500/30 relative">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-cyan-300 uppercase">📡 HIGH-RES OPTICAL SATELLITE</span>
                <div className="flex gap-1">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    0.15m GSD
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    ZOOM: {satelliteZoomLevel}x
                  </span>
                </div>
              </div>

              {satTileUrl ? (
                <div className="relative h-32 rounded-lg overflow-hidden border border-white/20 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={satTileUrl} alt="Satellite Recon" className="w-full h-full object-cover" />
                  {/* Optical Reticle Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 border border-cyan-400/80 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="absolute w-full h-[1px] bg-cyan-400/30" />
                    <div className="absolute h-full w-[1px] bg-cyan-400/30" />
                  </div>
                  <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[8px] text-white/90 bg-black/60 px-2 py-0.5 rounded">
                    <span>LAT: {selectedEntity.lat.toFixed(4)}° N</span>
                    <span>LON: {selectedEntity.lon.toFixed(4)}° E</span>
                    <span>AZ: 184°</span>
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-slate-900 rounded flex items-center justify-center text-[9px] text-slate-500">
                  Acquiring orbital imagery feed...
                </div>
              )}

              {/* Optical Zoom Slider */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[8px] text-slate-400">OPTICAL ZOOM:</span>
                <input
                  type="range"
                  min={8}
                  max={17}
                  value={satelliteZoomLevel}
                  onChange={(e) => {
                    const newZ = parseInt(e.target.value);
                    setSatelliteZoomLevel(newZ);
                    updateSatelliteTile(selectedEntity.lat, selectedEntity.lon, newZ);
                  }}
                  className="flex-1 accent-cyan-400 h-1"
                />
                <span className="text-[9px] font-bold text-cyan-300">{satelliteZoomLevel}x</span>
              </div>
            </div>

            {/* UN Geopolitical Dossier Panel (if Country attached) */}
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300 uppercase text-[9px]">🏛️ UN GEOPOLITICAL DOSSIER</span>
                <span className="text-[8px] text-slate-400 font-bold">{activeCountryDossier.capital}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div className="p-1 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">Languages:</span>
                  <div className="text-white font-bold truncate">{activeCountryDossier.languages.join(", ")}</div>
                </div>
                <div className="p-1 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">Population:</span>
                  <div className="text-white font-bold">{activeCountryDossier.population}</div>
                </div>
                <div className="p-1 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">GDP (Nominal):</span>
                  <div className="text-emerald-400 font-bold">{activeCountryDossier.gdpNominalUSD}</div>
                </div>
                <div className="p-1 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">DEFCON Scale:</span>
                  <div className={`font-bold ${activeCountryDossier.defconRating <= 2 ? "text-red-400" : "text-amber-400"}`}>
                    DEFCON {activeCountryDossier.defconRating}
                  </div>
                </div>
                <div className="p-1 rounded bg-black/40 border border-white/5 col-span-2">
                  <span className="text-slate-400">Defense Force & Alliance:</span>
                  <div className="text-cyan-300 font-bold">
                    {activeCountryDossier.defenseReadiness.standingTroops} ({activeCountryDossier.defenseReadiness.strategicAlliance})
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Atmospheric Weather Station Widget */}
            {selectedWeather && (
              <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="font-bold text-cyan-300 uppercase">🌩️ ATMOSPHERIC SENSOR</span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    {selectedWeather.condition}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9px]">
                  <div className="p-1 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-400">TEMP:</span>
                    <div className="text-cyan-200 font-bold">{selectedWeather.temperatureC}°C</div>
                  </div>
                  <div className="p-1 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-400">WIND:</span>
                    <div className="text-amber-300 font-bold">{selectedWeather.windSpeedKmh} km/h</div>
                  </div>
                  <div className="p-1 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-400">PRESSURE:</span>
                    <div className="text-emerald-300 font-bold">{selectedWeather.pressureHpa} hPa</div>
                  </div>
                </div>
              </div>
            )}

            {/* Strategic Details & Intel */}
            <div className="text-[9px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[8px] font-bold text-amber-400 uppercase">TACTICAL INTELLIGENCE SUMMARY:</div>
              <div>{selectedEntity.details}</div>
            </div>

            {/* Correlated Assets */}
            {selectedEntity.correlatedAssets && selectedEntity.correlatedAssets.length > 0 && (
              <div className="p-2 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <div className="text-[8px] font-bold text-slate-400 uppercase">CORRELATED FINANCIAL ASSETS & HEDGES:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedEntity.correlatedAssets.map((ast, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[8px] font-bold">
                      {ast}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialized Enterprise Suite Launch Actions */}
            {selectedEntity.type === "MINERAL" && (
              <button
                onClick={() => {
                  orbitalAudio.playTargetLock();
                  openFloatingWindow("geophysics-resources", `💎 Concession Recon: ${selectedEntity.name.replace("💎 ", "")}`);
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-amber-400/40"
              >
                <span>⛏️ OPEN IN RESOURCE INTELLIGENCE (€27,000/MO)</span>
              </button>
            )}

            {selectedEntity.type === "COUNTRY" && (
              <button
                onClick={() => {
                  orbitalAudio.playTargetLock();
                  openFloatingWindow("institutional-suite", `🏛️ Institutional Sovereign Matrix: ${selectedEntity.name}`);
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-cyan-400/40"
              >
                <span>🏛️ OPEN 7-PILLAR INSTITUTIONAL SUITE ($8,500/MO)</span>
              </button>
            )}

            {/* Direct Studio Media Push Action */}
            <button
              onClick={() => {
                orbitalAudio.playTargetLock();
                alert(`[NUR FINANS MEDYA BROADCAST TRIGGER]\n\nTarget locked and beamed to Studio Main Video Wall:\n• Target: ${selectedEntity.name}\n• Lat/Lon: ${selectedEntity.lat.toFixed(4)}°, ${selectedEntity.lon.toFixed(4)}°\n• Optical Zoom: ${satelliteZoomLevel}x\n• Risk Rating: ${selectedEntity.riskLevel || 'ELEVATED'}`);
              }}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-red-400/40 animate-pulse"
            >
              <span>📡 PUSH TO STUDIO ON-AIR (NUR MEDYA)</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedEntity(null);
              setSelectedWeather(null);
            }}
            className="mt-2 w-full py-1.5 rounded-xl text-[9px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-bold"
          >
            ✕ DISENGAGE RECON LOCK
          </button>
        </div>
      )}
    </div>
  );
}
