export type CommodityDomain = "GOLD" | "COPPER" | "LITHIUM" | "RARE_EARTH" | "OIL" | "GAS" | "URANIUM" | "ALL" | "RESEARCH" | "CALCULATOR";

export interface ScientificPublication {
  journal: string;
  year: number;
  title: string;
  doi: string;
  keyFinding: string;
  authors: string[];
}

export interface CommercialMetrics {
  npvBillionUSD: number;
  irrPercent: number;
  capexMillionUSD: number;
  opexUnit: string;
  paybackYears: number;
  breakevenCommodityPrice: string;
}

export interface DrillingTargetVectors {
  targetDepthMeters: number;
  dipAngleDegrees: number;
  azimuthDegrees: number;
  expectedInterceptWidthMeters: number;
  probabilityOfDiscoveryPercent: number;
}

export interface ExplorationDeposit {
  id: string;
  name: string;
  coordinates: [number, number];
  country: string;
  domain: string;
  basinOrTerrane: string;
  estimatedInSituValueUSD: string;
  currentOperator: string;
  licenseStatus: string;
  provenReserves: string;
  grade: string;
  cutoffGrade: string;
  primaryElements: string[];
  hostLithology: string;
  geologicalModel: string;
  structuralControl: string;
  geophysicalAnomaly: string;
  alterationZoning: string;
  spectralSignatureASTER: string;
  drillingReadinessScore: number;
  explorationTakeaway: string;
  commercialMetrics: CommercialMetrics;
  drillingTargetVectors: DrillingTargetVectors;
  recentScientificPublications: ScientificPublication[];
}

export const SOVEREIGN_EXPLORATION_DEPOSITS: ExplorationDeposit[] = [
  {
    id: "dep-001",
    name: "Grasberg Complex",
    coordinates: [-4.053, 137.116],
    country: "Indonesia",
    domain: "GOLD",
    basinOrTerrane: "Central Range Fold Belt",
    estimatedInSituValueUSD: "$245B",
    currentOperator: "Freeport-McMoRan / PT-FI",
    licenseStatus: "Active CoW",
    provenReserves: "67.4M oz Au equiv.",
    grade: "0.93 g/t Au, 0.36% Cu",
    cutoffGrade: "0.3 g/t Au",
    primaryElements: ["Au", "Cu", "Ag"],
    hostLithology: "Diorite-Monzonite Porphyry",
    geologicalModel: "Porphyry Cu-Au with High-Sulfidation Epithermal Overprint",
    structuralControl: "NW-trending fault intersections",
    geophysicalAnomaly: "Strong IP chargeability, mag-low",
    alterationZoning: "Potassic → Phyllic → Propylitic",
    spectralSignatureASTER: "Alunite + Kaolinite (SWIR 2.17 µm)",
    drillingReadinessScore: 94,
    explorationTakeaway: "World-class porphyry deposit with extensive remaining resource potential at depth.",
    commercialMetrics: {
      npvBillionUSD: 48.2,
      irrPercent: 28.5,
      capexMillionUSD: 12400,
      opexUnit: "$14.20/oz Au AISC",
      paybackYears: 4.2,
      breakevenCommodityPrice: "$1,180/oz Au",
    },
    drillingTargetVectors: {
      targetDepthMeters: 1200,
      dipAngleDegrees: 72,
      azimuthDegrees: 315,
      expectedInterceptWidthMeters: 85,
      probabilityOfDiscoveryPercent: 92,
    },
    recentScientificPublications: [
      {
        journal: "Economic Geology",
        year: 2023,
        title: "Deep Porphyry Genesis at Grasberg: Magmatic-Hydrothermal Evolution",
        doi: "10.5382/econgeo.2023.4921",
        keyFinding: "New fluid inclusion data confirms multi-stage mineralization extending to 2km depth.",
        authors: ["Leys, C.", "Cloos, M."],
      },
    ],
  },
];

export interface ScientificResearchFeed {
  id: string;
  title: string;
  journal: string;
  publicationDate: string;
  summary: string;
  domain: string;
  impactScore: number;
  explorationTakeaway: string;
  authors: string[];
}

export const SCIENTIFIC_RESEARCH_AI_FEED: ScientificResearchFeed[] = [
  {
    id: "feed-001",
    title: "Deep-Earth Mineral Prospecting via ML-Enhanced Seismic Inversion",
    journal: "Nature Geoscience",
    publicationDate: "2025-03-15",
    summary: "Novel machine learning techniques improve subsurface mineral deposit detection accuracy by 34%.",
    domain: "GOLD",
    impactScore: 8.7,
    explorationTakeaway: "ML-enhanced seismic methods can identify blind deposits below 1.5km that conventional methods miss.",
    authors: ["Zhang, W.", "Patel, R."],
  },
];
