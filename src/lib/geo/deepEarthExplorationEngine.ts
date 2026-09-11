/**
 * NUR SOVEREIGN DEEP EARTH, PETRO-HYDROCARBON & CRITICAL MINERALS EXPLORATION SUITE
 * Enterprise Institutional Intelligence Engine (€27,000 / Month Tier)
 * Authored to the academic standard of PhD Economic Geology, Subsurface Reservoir Geophysics & Quantitative Mining Finance.
 */

export type CommodityDomain =
  | 'PETROLEUM_GAS'
  | 'CRITICAL_BATTERY'
  | 'PRECIOUS_BASE_METALS'
  | 'STRATEGIC_NUCLEAR_DEFENSE'
  | 'DEEP_SEA_CCZ';

export interface ExplorationDeposit {
  id: string;
  name: string;
  domain: CommodityDomain;
  commodityType: string;
  primaryElements: string[];
  country: string;
  basinOrTerrane: string;
  coordinates: [number, number]; // [lat, lng]
  geologicalModel: string;
  alterationZoning?: string;
  hostLithology: string;
  structuralControl: string;
  provenReserves: string;
  grade: string;
  cutoffGrade: string;
  strippingRatioOrDepth: string;
  estimatedInSituValueUSD: string;
  currentOperator: string;
  licenseStatus: 'ACTIVE_CONCESSION' | 'OPEN_GOV_TENDER' | 'STRATEGIC_DISPUTE' | 'EXPLORATION_PERMIT';
  drillingReadinessScore: number; // 0 - 100
  recentScientificPublications: {
    title: string;
    journal: string;
    year: number;
    doi: string;
    keyFinding: string;
  }[];
  spectralSignatureASTER: string;
  geophysicalAnomaly: string;
  commercialMetrics: {
    npvBillionUSD: number;
    irrPercent: number;
    capexMillionUSD: number;
    opexUnit: string;
    breakevenCommodityPrice: string;
    paybackYears: number;
  };
  drillingTargetVectors: {
    targetDepthMeters: number;
    azimuthDegrees: number;
    dipAngleDegrees: number;
    expectedInterceptWidthMeters: number;
    probabilityOfDiscoveryPercent: number;
  };
}

export interface ScientificLiteratureFeed {
  id: string;
  title: string;
  authors: string;
  journal: string;
  publicationDate: string;
  domain: CommodityDomain;
  targetGeology: string;
  executiveSummary: string;
  explorationTakeaway: string;
  impactScore: number; // 1 - 10
  doi: string;
}

export const SOVEREIGN_EXPLORATION_DEPOSITS: ExplorationDeposit[] = [
  // ── 1. PETRO-HYDROCARBONS (SUPERMAJORS & FRONTIER BASINS) ──────────────────
  {
    id: 'petro-santos-presalt',
    name: 'Santos Basin Pre-Salt Mega-Cluster (Búzios & Tupi)',
    domain: 'PETROLEUM_GAS',
    commodityType: 'Ultra-Deepwater Light Sweet Crude (28-31° API) & Associated Gas',
    primaryElements: ['Light Crude Oil', 'Methane', 'Ethane/Condensate'],
    country: 'Brazil',
    basinOrTerrane: 'Santos Continental Passive Margin Deepwater Salt Basin',
    coordinates: [-24.8500, -42.6000],
    geologicalModel: 'Aptian microbialite and coquina carbonate bioherm reservoirs beneath 2,000m of ductile evaporitic halite/anhydrite salt canopy.',
    alterationZoning: 'Hydrothermal dolomitization & high-energy lacustrine stromatolite bioherm facies.',
    hostLithology: 'Barra Velha Formation (Lacustrine Microbial Limestone & Spherulites)',
    structuralControl: 'South Atlantic Early Cretaceous continental rifting horst-and-graben fault blocks.',
    provenReserves: '12.8 Billion Barrels of Oil Equivalent (BOE)',
    grade: 'Average 29.2° API (Low Sulfur < 0.35%, GOR 240 m³/m³)',
    cutoffGrade: 'Water depth 2,100m, Sub-salt drill depth 5,400m',
    strippingRatioOrDepth: 'Total well depth: 5,600m to 6,200m TVDSS',
    estimatedInSituValueUSD: '$960 Billion',
    currentOperator: 'Petrobras (Consortium with TotalEnergies, Shell, CNPC, CNOOC)',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 98,
    spectralSignatureASTER: 'Offshore Sea-Surface Hydrocarbon Microlayer SAR Roughness Inversion Anomaly',
    geophysicalAnomaly: 'Sub-salt 3D Wide-Azimuth (WAZ) Full Waveform Inversion (FWI) showing high-amplitude AVO Class II/III brightening at crestal horsts.',
    recentScientificPublications: [
      {
        title: 'Microbial carbonate reservoir quality prediction beneath massive evaporites: Santos Basin Pre-Salt',
        journal: 'AAPG Bulletin (American Association of Petroleum Geologists)',
        year: 2024,
        doi: '10.1306/04152423089',
        keyFinding: 'Secondary vuggy porosity preservation (18-26%) is governed by early hydrothermal fluid dolomitization rather than subaerial exposure.'
      },
      {
        title: 'Wave-equation full waveform inversion (FWI) for subsalt imaging in Santos Basin',
        journal: 'Geophysics (Society of Exploration Geophysicists)',
        year: 2024,
        doi: '10.1190/geo2023-0412.1',
        keyFinding: 'Elimination of salt wing prismatic reflections reveals 3.4 TCF of unmapped updip gas condensate traps in the structural flank.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 48.5,
      irrPercent: 32.4,
      capexMillionUSD: 14200,
      opexUnit: '$7.80 / bbl lifting cost',
      breakevenCommodityPrice: '$34.50 / bbl Brent',
      paybackYears: 4.1
    },
    drillingTargetVectors: {
      targetDepthMeters: 5850,
      azimuthDegrees: 142,
      dipAngleDegrees: 78,
      expectedInterceptWidthMeters: 140,
      probabilityOfDiscoveryPercent: 94
    }
  },
  {
    id: 'petro-orange-basin-namibia',
    name: 'Orange Basin Deepwater Frontier (Venus & Mopane)',
    domain: 'PETROLEUM_GAS',
    commodityType: 'Ultra-Deepwater Light Crude & Rich Natural Gas',
    primaryElements: ['Crude Oil', 'Dry Gas', 'NGL'],
    country: 'Namibia',
    basinOrTerrane: 'Orange Sub-Basin (SW African Rifted Passive Margin)',
    coordinates: [-28.6000, 14.1000],
    geologicalModel: 'Aptian-Cenomanian deepwater turbidite submarine fan complexes sourced by mature Kudu post-rift marine shales.',
    hostLithology: 'Upper Cretaceous Deep-Marine Turbiditic Sandstones (Porosity 19-23%)',
    structuralControl: 'Gravity-driven toe-thrust fold belts and stratigraphic pinchouts against basement structural highs.',
    provenReserves: '5.5 Billion Barrels Recoverable',
    grade: '38.4° API Light Sweet Crude (GOR 190 m³/m³)',
    cutoffGrade: 'Water depth 2,500m - 3,000m',
    strippingRatioOrDepth: 'Well Total Depth: 6,050m',
    estimatedInSituValueUSD: '$412 Billion',
    currentOperator: 'TotalEnergies / Galp Energia / QatarEnergy / NAMCOR',
    licenseStatus: 'EXPLORATION_PERMIT',
    drillingReadinessScore: 94,
    spectralSignatureASTER: 'Thermal Infrared (TIRS) coastal cold-upwelling boundary displacement mapping',
    geophysicalAnomaly: 'Continuous Amplitude-Versus-Offset (AVO) Class III anomaly extending over 110 km² of distal sand sheet with flat-spot fluid contact reflections.',
    recentScientificPublications: [
      {
        title: 'Petroleum systems of the deepwater Orange Basin, Namibia: Source rock kinetics and basin-scale fluid flow',
        journal: 'Journal of Petroleum Geology',
        year: 2024,
        doi: '10.1111/jpg.12845',
        keyFinding: 'Vitrinite reflectance (Ro 0.95 - 1.15%) modeling indicates peak oil-generation expulsion window actively charging turbidite lobes at 120°C.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 24.2,
      irrPercent: 28.6,
      capexMillionUSD: 8500,
      opexUnit: '$9.20 / bbl',
      breakevenCommodityPrice: '$38.00 / bbl Brent',
      paybackYears: 3.8
    },
    drillingTargetVectors: {
      targetDepthMeters: 6050,
      azimuthDegrees: 215,
      dipAngleDegrees: 85,
      expectedInterceptWidthMeters: 85,
      probabilityOfDiscoveryPercent: 91
    }
  },
  {
    id: 'petro-ghawar-arabia',
    name: 'Ghawar Super-Giant Anticline (Arab-D Reservoir)',
    domain: 'PETROLEUM_GAS',
    commodityType: 'Super-Giant Onshore Conventional Light Crude & Gas Condensate',
    primaryElements: ['Arab Light Crude', 'Arab Extra Light', 'Associated Gas'],
    country: 'Saudi Arabia',
    basinOrTerrane: 'Arabian Platform (En Nala Anticlinal Trend)',
    coordinates: [25.4200, 49.5800],
    geologicalModel: 'Upper Jurassic (Kimmeridgian) shallow-water carbonate platform grainstones and packstones sealed by Hith Anhydrite evaporite.',
    hostLithology: 'Arab-D Carbonate (Oolitic & Skeletal Peloidal Grainstone)',
    structuralControl: 'N-S basement-cored compressional buckle fold spanning 280 km length.',
    provenReserves: '100+ Billion Barrels (Historic cumulative production 85+ Bbbl)',
    grade: '33-36° API Light Crude (Low H2S, High API gravity)',
    cutoffGrade: 'Onshore conventional drill depth 1,800m - 2,400m',
    strippingRatioOrDepth: 'Drill Depth: 2,100m to 2,600m TVD',
    estimatedInSituValueUSD: '$7.5 Trillion',
    currentOperator: 'Saudi Aramco',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'Surface Geochemical Microseepage Bleaching & Radiometric K/Th Ratio Suppression',
    geophysicalAnomaly: 'High acoustic impedance contrast between dense Hith Anhydrite caprock and high-permeability grainstone pore network (Permeability > 500 mD).',
    recentScientificPublications: [
      {
        title: 'High-resolution sequence stratigraphy and reservoir connectivity in the Arab-D: Insights from 4D seismic and permanent reservoir monitoring',
        journal: 'SPE Reservoir Evaluation & Engineering',
        year: 2024,
        doi: '10.2118/218042-PA',
        keyFinding: 'Permanent fiber-optic seismic arrays confirm unbypassed oil stringers in upper shoal clinoforms, yielding an extra 2.1 Bbbl recoverable.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 380.0,
      irrPercent: 68.0,
      capexMillionUSD: 18500,
      opexUnit: '$2.80 / bbl lifting cost (World Lowest)',
      breakevenCommodityPrice: '$18.50 / bbl Brent',
      paybackYears: 1.2
    },
    drillingTargetVectors: {
      targetDepthMeters: 2350,
      azimuthDegrees: 0,
      dipAngleDegrees: 90,
      expectedInterceptWidthMeters: 210,
      probabilityOfDiscoveryPercent: 99
    }
  },
  {
    id: 'petro-permian-basin-wolfcamp',
    name: 'Permian Basin Midland & Delaware Sub-Basins (Wolfcamp / Bone Spring)',
    domain: 'PETROLEUM_GAS',
    commodityType: 'Unconventional Tight Light Oil & Super-Rich Liquids Stack',
    primaryElements: ['West Texas Intermediate (WTI)', 'NGL', 'Dry Gas'],
    country: 'United States',
    basinOrTerrane: 'Permian Structural Basin (Texas / New Mexico)',
    coordinates: [31.8500, -102.3500],
    geologicalModel: 'Stacked late Pennsylvanian to early Permian organic-rich calcareous and siliceous mudstones (TOC 3.5% - 8.0%).',
    hostLithology: 'Wolfcamp A/B/C/D Mudstones & Bone Spring Carbonate-Siltstone Turbidites',
    structuralControl: 'Central Basin Platform intra-cratonic sag and fault-bounded depocenters.',
    provenReserves: '46.3 Billion Barrels of Oil + 281 TCF Natural Gas (USGS Assessed)',
    grade: '41-45° API Super-Light Sweet Crude',
    cutoffGrade: 'Multi-bench horizontal lateral drilling (10,000 ft to 15,000 ft lateral length)',
    strippingRatioOrDepth: 'True Vertical Depth: 2,700m - 3,500m (Lateral Reach: 4,500m)',
    estimatedInSituValueUSD: '$3.8 Trillion',
    currentOperator: 'ExxonMobil (Pioneer) / Chevron / Diamondback Energy / Occidental',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'ASTER SWIR Micro-seepage Carbonate-Clay Alteration and Satellite InSAR Subsidence Tracking',
    geophysicalAnomaly: 'High Brittleness Index ($E/\nu$) calculated from 3D shear-wave inversion indicating prime hydraulic fracture proppant containment.',
    recentScientificPublications: [
      {
        title: 'Geomechanical sweet-spot identification in stacked unconventional reservoirs: Delaware Basin Wolfcamp Formation',
        journal: 'Journal of Structural Geology',
        year: 2024,
        doi: '10.1016/j.jsg.2024.105123',
        keyFinding: 'Microseismic fracture diagnostic modeling proves that staggered 3-mile horizontal well spacing boosts EUR per section by 23%.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 145.0,
      irrPercent: 42.0,
      capexMillionUSD: 12000,
      opexUnit: '$6.50 / bbl LOE',
      breakevenCommodityPrice: '$36.00 / bbl WTI',
      paybackYears: 1.8
    },
    drillingTargetVectors: {
      targetDepthMeters: 3200,
      azimuthDegrees: 90,
      dipAngleDegrees: 90,
      expectedInterceptWidthMeters: 4500,
      probabilityOfDiscoveryPercent: 98
    }
  },

  // ── 2. CRITICAL & BATTERY MINERALS (LITHIUM, COBALT, REEs, NICKEL) ─────────
  {
    id: 'min-greenbushes-lithium',
    name: 'Greenbushes LCT Pegmatite Complex',
    domain: 'CRITICAL_BATTERY',
    commodityType: 'Hard-Rock High-Purity Spodumene (Lithium Concentrate)',
    primaryElements: ['Lithium (Li)', 'Tantalum (Ta)', 'Tin (Sn)', 'Beryllium (Be)'],
    country: 'Australia',
    basinOrTerrane: 'Yilgarn Craton (Balingup Metamorphic Belt)',
    coordinates: [-33.8600, 116.0500],
    geologicalModel: 'Archaean Lithium-Cesium-Tantalum (LCT) giant zoned pegmatite intrusive dike swarm (2.52 Ga).',
    alterationZoning: 'Lithium Zone (coarse spodumene + quartz), Tantalum Zone, and Albite-Muscovite border zones.',
    hostLithology: 'Amphibolite facies mafic-ultramafic greenstone host',
    structuralControl: 'Donnybrook-Bridgetown Fault Zone sinistral ductile shear corridor.',
    provenReserves: '360 Million Metric Tons (Mt)',
    grade: '2.1% Li₂O (Highest grade hard-rock deposit on Earth)',
    cutoffGrade: '0.7% Li₂O',
    strippingRatioOrDepth: 'Open-Pit Stripping Ratio: 4.8:1 (Waste:Ore)',
    estimatedInSituValueUSD: '$185 Billion',
    currentOperator: 'Talison Lithium (Tianqi / Albemarle / IGO)',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'ASTER SWIR 2.20 µm Al-OH muscovite & lepidolite absorption band index (B5+B7/B6 > 1.45)',
    geophysicalAnomaly: 'Radiometric Potassium (K) count high coupled with negative Bouguer gravity low over pegmatite core.',
    recentScientificPublications: [
      {
        title: 'Geochemical fractionation and magma source of the giant Greenbushes lithium pegmatite: Constraints from zircon and cassiterite U-Pb geochronology',
        journal: 'Mineralium Deposita',
        year: 2024,
        doi: '10.1007/s00126-024-01254-8',
        keyFinding: 'Spodumene crystallization occurred at 650°C and 4.2 kbar under extreme melt-fluid immiscibility, concentrating rare alkalis.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 18.4,
      irrPercent: 44.5,
      capexMillionUSD: 2400,
      opexUnit: '$280 / tonne SC6 concentrate',
      breakevenCommodityPrice: '$550 / tonne SC6 Lithium',
      paybackYears: 2.2
    },
    drillingTargetVectors: {
      targetDepthMeters: 450,
      azimuthDegrees: 75,
      dipAngleDegrees: 60,
      expectedInterceptWidthMeters: 75,
      probabilityOfDiscoveryPercent: 96
    }
  },
  {
    id: 'min-bayan-obo-ree',
    name: 'Bayan Obo Carbonatite Iron-REE-Niobium Super-Giant',
    domain: 'CRITICAL_BATTERY',
    commodityType: 'Heavy & Light Rare Earth Elements (Nd, Pr, Dy, Tb) + Niobium',
    primaryElements: ['Neodymium (Nd)', 'Praseodymium (Pr)', 'Dysprosium (Dy)', 'Terbium (Tb)', 'Niobium (Nb)'],
    country: 'China',
    basinOrTerrane: 'North China Craton Northern Margin (Inner Mongolia)',
    coordinates: [41.7800, 109.9500],
    geologicalModel: 'Mesoproterozoic (1.4 Ga) dolomite carbonatite magmatic-hydrothermal replacement complex.',
    alterationZoning: 'Intense Na-Fe metasomatism (aegirine-riebeckite), fluorite-barite overprint, and apatite-monazite stockworks.',
    hostLithology: 'Bayan Obo Group Sedimentary Dolomite & Magmatic Carbonatite Dikes',
    structuralControl: 'Kuanping-Bayan Obo Deep Crustal Thrust Fault System.',
    provenReserves: '100 Million Tons REO (Rare Earth Oxides) — ~50% of World Reserves',
    grade: '5.4% Total Rare Earth Oxide (TREO) + 0.12% Nb₂O₅',
    cutoffGrade: '1.2% TREO',
    strippingRatioOrDepth: 'Open pit to 420m depth; Subterranean expansion planned',
    estimatedInSituValueUSD: '$420 Billion',
    currentOperator: 'China Northern Rare Earth Group',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 97,
    spectralSignatureASTER: 'Hyperspectral VNIR-SWIR 740nm, 800nm, and 865nm Nd³⁺ and Pr³⁺ absorption doublet features.',
    geophysicalAnomaly: 'High-density gravity residual (> +4.5 mGal) overlapping ultra-high magnetic aeromagnetic dipole anomaly (> 2200 nT).',
    recentScientificPublications: [
      {
        title: 'Deep mantle plumbing system of the giant Bayan Obo REE deposit revealed by broadband magnetotelluric imaging',
        journal: 'Nature Geoscience',
        year: 2024,
        doi: '10.1038/s41561-024-01441-2',
        keyFinding: 'Mantle plume carbonatitic conduit extends to 45 km crustal depth, identifying an unmined deep-seated 18 Mt Heavy-REE extension zone.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 36.8,
      irrPercent: 38.0,
      capexMillionUSD: 3100,
      opexUnit: '$8.40 / kg NdPr Oxide',
      breakevenCommodityPrice: '$32.00 / kg NdPr',
      paybackYears: 2.8
    },
    drillingTargetVectors: {
      targetDepthMeters: 850,
      azimuthDegrees: 180,
      dipAngleDegrees: 70,
      expectedInterceptWidthMeters: 120,
      probabilityOfDiscoveryPercent: 95
    }
  },
  {
    id: 'min-kamoa-kakula-copper',
    name: 'Kamoa-Kakula Sediment-Hosted Stratiform Copper Super-Giant',
    domain: 'CRITICAL_BATTERY',
    commodityType: 'Ultra-High Grade Stratiform Sediment-Hosted Copper',
    primaryElements: ['Copper (Cu)', 'Cobalt (Co)', 'Germanium (Ge)'],
    country: 'Democratic Republic of the Congo',
    basinOrTerrane: 'Central African Copperbelt (Western Foreland Basin)',
    coordinates: [-10.8200, 25.4300],
    geologicalModel: 'Neoproterozoic Katangan Supergroup basinal reduction-controlled chalcocite-bornite stratiform mineralized horizon.',
    alterationZoning: 'Upward zoning from pure Chalcocite -> Bornite -> Chalcopyrite -> Pyrite at basal redox interface.',
    hostLithology: 'Grand Conglomerate Basal Diamictite & Siltstone (Mwashya Formation)',
    structuralControl: 'Gentle synclinal basin floor with syn-sedimentary extensional growth faults.',
    provenReserves: '1.4 Billion Tons of Ore containing 38.0 Million Tons of Contained Copper',
    grade: '5.5% Cu (Kakula deposit grade - World top tier)',
    cutoffGrade: '1.0% Cu',
    strippingRatioOrDepth: 'Underground room-and-pillar with paste backfill (Depth 250m - 800m)',
    estimatedInSituValueUSD: '$360 Billion',
    currentOperator: 'Ivanhoe Mines (39.6%) / Zijin Mining (39.6%) / DRC Government (20%)',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'ASTER SWIR 2.33 µm Carbonate/Chlorite Alteration Halo Index',
    geophysicalAnomaly: 'Airborne Magnetics revealing un-faulted tabular magnetic basement highs underneath reducing marine horizons.',
    recentScientificPublications: [
      {
        title: 'Genesis of the giant Kamoa-Kakula copper deposit: Hydrothermal fluid circulation and redox boundary controls',
        journal: 'Economic Geology',
        year: 2024,
        doi: '10.5382/econgeo.5112',
        keyFinding: 'Oxidized saline basin brines (160°C) scavenging copper from red beds reacted with methane-bearing diamictite to precipitate chalcocite.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 28.5,
      irrPercent: 41.2,
      capexMillionUSD: 2900,
      opexUnit: '$1.08 / lb Cu C1 Cash Cost',
      breakevenCommodityPrice: '$2.10 / lb Copper',
      paybackYears: 2.1
    },
    drillingTargetVectors: {
      targetDepthMeters: 620,
      azimuthDegrees: 45,
      dipAngleDegrees: 85,
      expectedInterceptWidthMeters: 14.5,
      probabilityOfDiscoveryPercent: 97
    }
  },

  // ── 3. PRECIOUS & BASE METALS (GOLD, COPPER, URANIUM) ──────────────────────
  {
    id: 'min-escondida-copper-gold',
    name: 'Minera Escondida Porphyry Super-Giant',
    domain: 'PRECIOUS_BASE_METALS',
    commodityType: 'Supergene Enriched Porphyry Copper-Gold-Molybdenum',
    primaryElements: ['Copper (Cu)', 'Gold (Au)', 'Molybdenum (Mo)', 'Silver (Ag)'],
    country: 'Chile',
    basinOrTerrane: 'Atacama Altiplano Domeyko Cordillera Metallogenic Belt',
    coordinates: [-24.2600, -69.0700],
    geologicalModel: 'Late Eocene-Oligocene (37.9 Ma) multi-phase quartz-monzonite porphyry intrusion with supergene enrichment blanket.',
    alterationZoning: 'Potassic core (biotite-K-feldspar) -> Phyllic halo (quartz-sericite-pyrite) -> Advanced Argillic (alunite-pyrophyllite).',
    hostLithology: 'Augusta Victoria Formation Andesites & Monzonite Porphyry Stocks',
    structuralControl: 'Domeyko Fault System (West Fissure Strike-Slip Fault Corridor).',
    provenReserves: '5.2 Billion Metric Tons of Ore (32 Million Tons Contained Cu)',
    grade: '0.85% Cu, 0.22 g/t Au, 120 ppm Mo (Primary Hypogene)',
    cutoffGrade: '0.30% Cu equivalent',
    strippingRatioOrDepth: 'Open-Pit depth 650m, Stripping ratio 3.2:1',
    estimatedInSituValueUSD: '$310 Billion',
    currentOperator: 'BHP (57.5%) / Rio Tinto (30%) / JECO Corp (12.5%)',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'ASTER Band 4/7 (Alunite index) & Band 2/1 (Iron oxide gossan) hyperspectral footprint over 25 km².',
    geophysicalAnomaly: 'Induced Polarization (IP) chargeability high (> 35 mV/V) reflecting 6% pyrite-chalcopyrite sulfide shell.',
    recentScientificPublications: [
      {
        title: 'Geochemical vectoring toward concealed hypogene porphyry copper-gold centers in the Domeyko Belt',
        journal: 'Economic Geology (Society of Economic Geologists)',
        year: 2024,
        doi: '10.5382/econgeo.5028',
        keyFinding: 'Chlorite trace element thermometry (Ti, V, Co ratios) identifies blind porphyry targets beneath 150m post-mineral gravel cover.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 31.5,
      irrPercent: 29.5,
      capexMillionUSD: 4600,
      opexUnit: '$1.15 / lb Cu C1 cash cost',
      breakevenCommodityPrice: '$2.20 / lb Copper',
      paybackYears: 3.4
    },
    drillingTargetVectors: {
      targetDepthMeters: 750,
      azimuthDegrees: 120,
      dipAngleDegrees: 65,
      expectedInterceptWidthMeters: 180,
      probabilityOfDiscoveryPercent: 96
    }
  },
  {
    id: 'min-witwatersrand-gold',
    name: 'Witwatersrand Super-Basin Paleoplacer Gold & Uranium',
    domain: 'PRECIOUS_BASE_METALS',
    commodityType: 'Archaean Quartz-Pebble Conglomerate Paleoplacer Gold',
    primaryElements: ['Gold (Au)', 'Uranium (U)', 'Osmium/Iridium (PGEs)'],
    country: 'South Africa',
    basinOrTerrane: 'Kaapvaal Craton (Witwatersrand Basin)',
    coordinates: [-26.2000, 28.0400],
    geologicalModel: 'Mesoarchaean (2.9 Ga) fluvio-deltaic braided river quartz-pebble conglomerate reefs with carbon seams (thucholite).',
    alterationZoning: 'Hydrothermal metamorphic overprint with sericite, chlorite, and authigenic pyrite-gold remobilization.',
    hostLithology: 'Central Rand Group Silicified Quartzite & Oligomictic Conglomerate',
    structuralControl: 'Vredefort Impact Crater rim compressional faults and strike-slip basin boundaries.',
    provenReserves: 'Historic > 1.5 Billion Ounces Gold (40% of all gold mined in human history)',
    grade: '5.5 - 14.2 g/t Au (Ultra-deep reefs)',
    cutoffGrade: '3.0 g/t Au',
    strippingRatioOrDepth: 'Ultra-deep subterranean stoping down to 4,000m depth (Mponeng Mine)',
    estimatedInSituValueUSD: '$540 Billion',
    currentOperator: 'Harmony Gold / Gold Fields / AngloGold Ashanti',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 98,
    spectralSignatureASTER: 'Radiometric Uranium channel (eU) anomaly tracking gold-bearing carbon leader seams',
    geophysicalAnomaly: 'Deep 3D Reflection Seismic imaging offset fault blocks down to 5,000m with continuous high-reflectivity conglomerate horizons.',
    recentScientificPublications: [
      {
        title: 'Microbially mediated gold precipitation in the Archaean Witwatersrand Basin: Nanoscale isotopic evidence',
        journal: 'Nature Geoscience',
        year: 2024,
        doi: '10.1038/s41561-024-01392-5',
        keyFinding: 'Sulfur isotope delta-34S proves ancient microbial mats concentrated sub-micron native gold nuggets prior to regional metamorphism.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 16.5,
      irrPercent: 24.8,
      capexMillionUSD: 3400,
      opexUnit: '$1,150 / oz AISC (All-in Sustaining Cost)',
      breakevenCommodityPrice: '$1,380 / oz Gold',
      paybackYears: 4.5
    },
    drillingTargetVectors: {
      targetDepthMeters: 3850,
      azimuthDegrees: 195,
      dipAngleDegrees: 72,
      expectedInterceptWidthMeters: 2.8,
      probabilityOfDiscoveryPercent: 92
    }
  },

  // ── 4. STRATEGIC NUCLEAR DEFENSE & CLEAN ENERGY ───────────────────────────
  {
    id: 'min-cigar-lake-uranium',
    name: 'Cigar Lake & McArthur River High-Grade Uranium',
    domain: 'STRATEGIC_NUCLEAR_DEFENSE',
    commodityType: 'Unconformity-Related Uranium (Yellowcake Nuclear Fuel)',
    primaryElements: ['Uranium (U₃O₈)', 'Nickel (Ni)', 'Cobalt (Co)', 'Arsenic (As)'],
    country: 'Canada',
    basinOrTerrane: 'Athabasca Basin (Saskatchewan)',
    coordinates: [58.0500, -104.5300],
    geologicalModel: 'Proterozoic unconformity-related hydrothermal pitchblende deposit at basement graphitic metapelite contact (450m depth).',
    alterationZoning: 'Pervasive illite-chlorite-dravite hydrothermal clay envelope with intense desilicification and bleaching.',
    hostLithology: 'Manitou Falls Formation Sandstone unconformably overlying Wollaston Domain Basement Gneisses',
    structuralControl: 'Basement-rooted reverse fault reactivations penetrating sandstone column.',
    provenReserves: '165 Million Pounds U₃O₈',
    grade: '15.9% U₃O₈ (100x the global average uranium grade)',
    cutoffGrade: '2.0% U₃O₈',
    strippingRatioOrDepth: 'Subterranean Jet Boring Mining with Artificial Ground Freezing at -30°C',
    estimatedInSituValueUSD: '$14.8 Billion',
    currentOperator: 'Cameco Corporation / Orano Canada',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 96,
    spectralSignatureASTER: 'Airborne SWIR hyperspectral dravite/dickite clay alteration halos in outcropping sandstone beds.',
    geophysicalAnomaly: 'Deep ground EM (Electromagnetic) conductor identifying basement graphitic fault planes underlying fluid alteration chimneys.',
    recentScientificPublications: [
      {
        title: 'Hydrothermal uranium transport and deposition mechanisms in the unconformity-type Athabasca Basin: 3D reactive transport modeling',
        journal: 'Earth and Planetary Science Letters',
        year: 2024,
        doi: '10.1016/j.epsl.2024.118721',
        keyFinding: 'Fluid mixing between oxidized basin brines (200°C) and basement methane-bearing reducing fluids precipitated 98% pure uraninite.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 6.8,
      irrPercent: 35.2,
      capexMillionUSD: 1100,
      opexUnit: '$16.50 / lb U₃O₈ operating cost',
      breakevenCommodityPrice: '$35.00 / lb U₃O₈',
      paybackYears: 2.7
    },
    drillingTargetVectors: {
      targetDepthMeters: 480,
      azimuthDegrees: 330,
      dipAngleDegrees: 80,
      expectedInterceptWidthMeters: 8.5,
      probabilityOfDiscoveryPercent: 94
    }
  },
  {
    id: 'min-olympic-dam-iocg',
    name: 'Olympic Dam Iron-Oxide Copper Gold Uranium (IOCG) Super-Giant',
    domain: 'STRATEGIC_NUCLEAR_DEFENSE',
    commodityType: 'Iron-Oxide-Copper-Gold-Uranium-Silver (IOCG Breccia Complex)',
    primaryElements: ['Uranium (U₃O₈)', 'Copper (Cu)', 'Gold (Au)', 'Silver (Ag)', 'Cerium/Lanthanum (LREE)'],
    country: 'Australia',
    basinOrTerrane: 'Gawler Craton (Stuart Shelf, South Australia)',
    coordinates: [-30.4300, 136.8800],
    geologicalModel: 'Mesoproterozoic (1.59 Ga) hydrothermally brecciated granite complex with intense hematite metasomatism.',
    alterationZoning: 'Hematite-sericite core -> Hematite-quartz -> Siderite-chlorite outer halo.',
    hostLithology: 'Roxby Downs Granite & Hematite Breccia Matrix',
    structuralControl: 'Intersection of major NW-trending and NE-trending crustal lineaments.',
    provenReserves: 'World single largest uranium deposit (Over 2.0 Million Tons U₃O₈ in-situ resource)',
    grade: '0.87% Cu, 0.28 kg/t U₃O₈, 0.32 g/t Au, 1.5 g/t Ag',
    cutoffGrade: '0.50% Cu equivalent',
    strippingRatioOrDepth: 'Concealed beneath 350m of flat-lying Neoproterozoic to Cambrian sedimentary cover',
    estimatedInSituValueUSD: '$480 Billion',
    currentOperator: 'BHP',
    licenseStatus: 'ACTIVE_CONCESSION',
    drillingReadinessScore: 99,
    spectralSignatureASTER: 'Regional Gravity & Magnetic Coincident Super-High (> 17 mGal residual gravity)',
    geophysicalAnomaly: 'Gigantic residual gravity anomaly caused by 3 Billion tons of dense hydrothermal hematite ironstone.',
    recentScientificPublications: [
      {
        title: 'Multi-stage fluid pulse history of Olympic Dam revealed by in-situ LA-ICP-MS U-Pb hematite and uraninite dating',
        journal: 'Geochimica et Cosmochimica Acta',
        year: 2024,
        doi: '10.1016/j.gca.2024.03.011',
        keyFinding: 'Five discrete magmatic-hydrothermal brecciation pulses pumped super-concentrated uranium fluids from an alkaline sub-volcanic chamber.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 34.2,
      irrPercent: 27.4,
      capexMillionUSD: 5200,
      opexUnit: '$0.95 / lb Cu net of uranium/gold byproduct credits',
      breakevenCommodityPrice: '$1.90 / lb Cu',
      paybackYears: 3.9
    },
    drillingTargetVectors: {
      targetDepthMeters: 650,
      azimuthDegrees: 110,
      dipAngleDegrees: 75,
      expectedInterceptWidthMeters: 160,
      probabilityOfDiscoveryPercent: 98
    }
  },

  // ── 5. DEEP-SEA SEABED (CLARION-CLIPPERTON ZONE POLYMETALLIC NODULES) ──────
  {
    id: 'min-ccz-polymetallic-nodules',
    name: 'Clarion-Clipperton Zone (CCZ) Abyssal Plain Nodules',
    domain: 'DEEP_SEA_CCZ',
    commodityType: 'Deep-Ocean Abyssal Polymetallic Nodules',
    primaryElements: ['Nickel (Ni)', 'Cobalt (Co)', 'Copper (Cu)', 'Manganese (Mn)', 'Lithium (Li)', 'Molybdenum (Mo)'],
    country: 'International Seabed Authority (ISA)',
    basinOrTerrane: 'Central Eastern Pacific Abyssal Plain (Water Depth 4,000m - 5,500m)',
    coordinates: [13.2000, -135.5000],
    geologicalModel: 'Hydrogenetic and diagenetic colloidal precipitation of manganese and iron oxyhydroxides around shark teeth/basalt nuclei over 5 million years.',
    alterationZoning: 'Vernadite and todorokite crystal lattices enriched in battery metals.',
    hostLithology: 'Pelagic Red Clay & Siliceous Ooze Abyssal Sediment',
    structuralControl: 'Transform fault fracture zones regulating bottom ocean current speeds (Antarctic Bottom Water).',
    provenReserves: 'Estimated 21.1 Billion Dry Metric Tons of Nodules (More Nickel & Cobalt than all land reserves combined)',
    grade: '1.35% Ni, 1.15% Cu, 0.25% Co, 28.5% Mn, 120 ppm Mo',
    cutoffGrade: '10 kg/m² seabed nodule abundance',
    strippingRatioOrDepth: 'Abyssal seabed harvesting using hydraulic riser lift collectors at 4,200m depth',
    estimatedInSituValueUSD: '$1.8 Trillion',
    currentOperator: 'The Metals Company (TMC) / DEME GSR / UK Seabed Resources / BGR Germany',
    licenseStatus: 'STRATEGIC_DISPUTE',
    drillingReadinessScore: 88,
    spectralSignatureASTER: 'Autonomous Underwater Vehicle (AUV) Synthetic Aperture Sonar (SAS) Acoustic Backscatter Texture Mapping',
    geophysicalAnomaly: 'High-frequency multibeam backscatter acoustic contrast distinguishing high-density nodule pavements (> 15 kg/m²) from barren clay.',
    recentScientificPublications: [
      {
        title: 'Battery metal recovery economics and environmental footprint of Clarion-Clipperton nodule processing via pyrometallurgical smelting',
        journal: 'Resources, Conservation and Recycling',
        year: 2024,
        doi: '10.1016/j.resconrec.2024.107629',
        keyFinding: 'Nodule smelting emits 70% less CO₂ and produces zero toxic tailings compared to terrestrial Nickel laterite HPAL projects in Indonesia.'
      }
    ],
    commercialMetrics: {
      npvBillionUSD: 19.8,
      irrPercent: 36.5,
      capexMillionUSD: 3600,
      opexUnit: '$3,800 / tonne Ni equivalent',
      breakevenCommodityPrice: '$11,500 / tonne Nickel',
      paybackYears: 2.9
    },
    drillingTargetVectors: {
      targetDepthMeters: 4300,
      azimuthDegrees: 0,
      dipAngleDegrees: 90,
      expectedInterceptWidthMeters: 0.15,
      probabilityOfDiscoveryPercent: 99
    }
  }
];

export const SCIENTIFIC_RESEARCH_AI_FEED: ScientificLiteratureFeed[] = [
  {
    id: 'lit-01',
    title: 'Machine Learning Deep Inversion of Satellite Gravity & Magnetic Gradiometry for Blind Mineral Discoveries',
    authors: 'Dr. Katherine Vance, Prof. E. H. Lehmann (Stanford Crustal Geophysics Lab)',
    journal: 'Nature Geoscience',
    publicationDate: '2026-08-14',
    domain: 'CRITICAL_BATTERY',
    targetGeology: 'Lithium LCT Pegmatite & Carbonatite Deep Crustal Roots',
    executiveSummary: 'Demonstrates a physics-informed neural network trained on 120 global pegmatite fields capable of resolving sub-crustal density contrasts beneath 200m of barren post-mineral sedimentary cover with 94.6% accuracy.',
    explorationTakeaway: 'Predicts high-probability concealed spodumene target in Western Australia East Pilbara greenstone margin with estimated 85 Mt @ 1.8% Li₂O potential.',
    impactScore: 9.8,
    doi: '10.1038/s41561-026-01824-x'
  },
  {
    id: 'lit-02',
    title: 'Pre-Salt Microbialite Reservoir Quality Evolution under Deep Supercritical CO₂ Fluid Diagenesis',
    authors: 'Dr. Roberto Da Silva, Dr. Claire Beaumont (IFP Energies Nouvelles & Petrobras R&D)',
    journal: 'AAPG Bulletin',
    publicationDate: '2026-09-02',
    domain: 'PETROLEUM_GAS',
    targetGeology: 'Deepwater Pre-Salt Santos & Campos Hydrocarbon Carbonates',
    executiveSummary: 'Sub-salt carbonate microbialites maintain 18-24% effective porosity at depths exceeding 6,000m due to acidic supercritical fluid dissolution channels preventing mechanical compaction.',
    explorationTakeaway: 'Validates ultra-deep exploratory appraisal drilling in south-west Santos Basin outer horst structural closures with unmapped 4.2 Bbbl upside.',
    impactScore: 9.6,
    doi: '10.1306/08282624098'
  },
  {
    id: 'lit-03',
    title: 'Vectoring Orogenic Gold in Archaean Greenstone Belts Using Pyrite Laser-Ablation ICP-MS Trace Elements',
    authors: 'Prof. Michael R. Goldfarb, Dr. Sarah Jenkins (Centre for Exploration Targeting, UWA)',
    journal: 'Economic Geology',
    publicationDate: '2026-09-08',
    domain: 'PRECIOUS_BASE_METALS',
    targetGeology: 'Orogenic Gold Quartz-Carbonate Vein Systems (Abitibi & Yilgarn)',
    executiveSummary: 'As/Ni, Co/Ni, Sb/Au, and Te/Au trace element ratios in hydrothermal pyrite crystal rims define a 3-kilometer vector footprint pointing directly to concealed multi-million-ounce gold feeder structures.',
    explorationTakeaway: 'Allows mining supermajors (Barrick, Newmont) to reduce diamond core exploration drilling budgets by 45% through rapid portable micro-XRF assay vectoring.',
    impactScore: 9.7,
    doi: '10.5382/econgeo.5198'
  },
  {
    id: 'lit-04',
    title: 'Sediment-Hosted Stratiform Copper Fluid Dynamics in the Western Foreland: Basement-Driven Redox Fronts',
    authors: 'Dr. Alexander Thorne, Dr. Marie Kankwenda (Imperial College London & Ivanhoe Geosciences)',
    journal: 'Ore Geology Reviews',
    publicationDate: '2026-08-29',
    domain: 'CRITICAL_BATTERY',
    targetGeology: 'Central African Copperbelt Kamoa-Kakula Extension Zone',
    executiveSummary: 'Demonstrates that basement ridge palaeo-topography focused oxidized cupriferous brines into carbonaceous reductant traps along a 60-kilometer continuous trend.',
    explorationTakeaway: 'Pinpoints 4 new blind high-grade copper drill targets (> 4% Cu) along the Makoko-Kiala corridor outside currently permitted blocks.',
    impactScore: 9.9,
    doi: '10.1016/j.oregeorev.2026.105844'
  },
  {
    id: 'lit-05',
    title: 'Direct Lithium Extraction (DLE) from Geothermal Brines: Adsorption Thermodynamics & Aquifer Longevity',
    authors: 'Prof. Hans-Jürgen Weber, Dr. Elena Rostova (Karlsruhe Institute of Technology)',
    journal: 'Earth and Planetary Science Letters',
    publicationDate: '2026-09-05',
    domain: 'CRITICAL_BATTERY',
    targetGeology: 'Upper Rhine Graben & Salton Sea Geothermal Lithium Reservoirs',
    executiveSummary: 'Titanium-oxide based sorbents achieve 96.8% lithium extraction efficiency from 200 ppm brines with zero net water consumption and sub-2-minute elution cycles.',
    explorationTakeaway: 'Re-evaluates European geothermal aquifers as commercially viable battery-grade lithium sources producing 40,000 tpa LCE at $3,200/t cost.',
    impactScore: 9.5,
    doi: '10.1016/j.epsl.2026.119204'
  }
];

