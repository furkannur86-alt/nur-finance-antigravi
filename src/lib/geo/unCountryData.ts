/**
 * UNITED NATIONS & SOVEREIGN GEOPOLITICAL INTELLIGENCE DATABASE
 * Comprehensive country dossiers: UN status, languages, capitals, defense index, nuclear posture, resources.
 */

export interface UNCountryDossier {
  code: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  unMemberSince: string;
  languages: string[];
  population: string;
  gdpNominalUSD: string;
  currency: string;
  defconRating: 1 | 2 | 3 | 4 | 5;
  nuclearStatus: {
    hasNuclearWeapons: boolean;
    estimatedWarheads?: number;
    deliveryPlatforms?: string[];
    iaeaCompliance: "COMPLIANT" | "UNDER_ENHANCED_SAFEGUARDS" | "NON_COMPLIANT" | "N/A";
  };
  defenseReadiness: {
    standingTroops: string;
    activeAircraft: number;
    navalCombatants: number;
    strategicAlliance: "NATO" | "CSTO" | "SCO" | "BILATERAL_US" | "NEUTRAL" | "NON_ALIGNED";
  };
  strategicAssets: string[];
  energyProfile: {
    oilProductionBPD: string;
    gasExportCapacity: string;
    strategicPipelines: string[];
  };
  lat: number;
  lon: number;
  zoomLevel: number;
  satelliteNotes: string;
}

export const UN_COUNTRY_DOSSIERS: Record<string, UNCountryDossier> = {
  TUR: {
    code: "TUR",
    name: "Turkey",
    officialName: "Republic of Türkiye",
    capital: "Ankara",
    region: "Eurasia / Middle East",
    subregion: "Southern Europe / Western Asia",
    unMemberSince: "October 24, 1945 (Founding Member)",
    languages: ["Turkish (Official)", "Kurdish", "Arabic", "English (Diplomatic/Trade)"],
    population: "85.8 Million",
    gdpNominalUSD: "$1.15 Trillion",
    currency: "Turkish Lira (TRY) / Sovereign $NUR",
    defconRating: 3,
    nuclearStatus: {
      hasNuclearWeapons: false,
      deliveryPlatforms: ["NATO Nuclear Sharing (B61 at Incirlik AB)"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "425,000 Active (2nd Largest in NATO)",
      activeAircraft: 1065,
      navalCombatants: 154,
      strategicAlliance: "NATO",
    },
    strategicAssets: ["Bosphorus & Dardanelles Straits", "Incirlik Air Base", "Beylikova Rare Earth Elements", "Akkuyu NPP", "TANAP / BTC Hub"],
    energyProfile: {
      oilProductionBPD: "100,000 bpd (Domestic) + 1.2M bpd (Transit)",
      gasExportCapacity: "31.5 BCM/yr (TurkStream / TANAP)",
      strategicPipelines: ["Baku-Tbilisi-Ceyhan (BTC)", "TANAP", "TurkStream", "Blue Stream"],
    },
    lat: 39.93,
    lon: 32.85,
    zoomLevel: 4.8,
    satelliteNotes: "Full multispectral satellite coverage. Continuous electro-optical surveillance across Turkish Straits maritime chokepoints and Incirlik NATO air base perimeter.",
  },
  USA: {
    code: "USA",
    name: "United States",
    officialName: "United States of America",
    capital: "Washington, D.C.",
    region: "Americas",
    subregion: "North America",
    unMemberSince: "October 24, 1945 (Permanent Security Council Member)",
    languages: ["English (De facto Official)", "Spanish"],
    population: "341.5 Million",
    gdpNominalUSD: "$28.78 Trillion",
    currency: "United States Dollar (USD)",
    defconRating: 3,
    nuclearStatus: {
      hasNuclearWeapons: true,
      estimatedWarheads: 5244,
      deliveryPlatforms: ["Nuclear Triad (Minuteman III ICBMs, Ohio-class SSBNs, B-2/B-21/B-52 Strategic Bombers)"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "1,328,000 Active",
      activeAircraft: 13200,
      navalCombatants: 484,
      strategicAlliance: "NATO",
    },
    strategicAssets: ["NORAD Peterson SFB", "Pentagon", "Malmstrom ICBM Silos", "Guam Andersen AFB", "Persian Gulf 5th Fleet"],
    energyProfile: {
      oilProductionBPD: "13.4 Million bpd (World #1)",
      gasExportCapacity: "115 BCM/yr (LNG Export Hub)",
      strategicPipelines: ["Colonial Pipeline", "Keystone Pipeline", "Trans-Alaska Pipeline (TAPS)"],
    },
    lat: 38.90,
    lon: -77.03,
    zoomLevel: 3.5,
    satelliteNotes: "Global GPS III, SBIRS missile warning satellite constellations, and Starlink mesh integration active.",
  },
  RUS: {
    code: "RUS",
    name: "Russia",
    officialName: "Russian Federation",
    capital: "Moscow",
    region: "Eurasia",
    subregion: "Eastern Europe / Northern Asia",
    unMemberSince: "October 24, 1945 (Permanent Security Council Member)",
    languages: ["Russian (Official)", "Tatar", "Chechen", "Bashkir"],
    population: "144.2 Million",
    gdpNominalUSD: "$2.05 Trillion",
    currency: "Russian Ruble (RUB)",
    defconRating: 2,
    nuclearStatus: {
      hasNuclearWeapons: true,
      estimatedWarheads: 5580,
      deliveryPlatforms: ["RS-28 Sarmat", "Yars ICBMs", "Borei-class SSBNs (Bulava)", "Tu-160M / Tu-95MS Bombers", "Kinzhal Hypersonic"],
      iaeaCompliance: "UNDER_ENHANCED_SAFEGUARDS",
    },
    defenseReadiness: {
      standingTroops: "1,150,000 Active",
      activeAircraft: 4200,
      navalCombatants: 598,
      strategicAlliance: "CSTO",
    },
    strategicAssets: ["Plesetsk Cosmodrome", "Engels-2 Strategic Airbase", "Severomorsk Northern Fleet HQ", "Sevastopol Naval Base"],
    energyProfile: {
      oilProductionBPD: "9.5 Million bpd",
      gasExportCapacity: "200 BCM/yr (Pipeline & LNG)",
      strategicPipelines: ["Druzhba Oil Pipeline", "Power of Siberia 1 & 2", "TurkStream"],
    },
    lat: 55.75,
    lon: 37.61,
    zoomLevel: 3.2,
    satelliteNotes: "Continuous synthetic aperture radar (SAR) monitoring on strategic bomber bases, ICBM mobile regiments, and Baltic/Black Sea naval ports.",
  },
  CHN: {
    code: "CHN",
    name: "China",
    officialName: "People's Republic of China",
    capital: "Beijing",
    region: "Asia",
    subregion: "Eastern Asia",
    unMemberSince: "October 24, 1945 (Permanent Security Council Member)",
    languages: ["Standard Mandarin (Official)", "Cantonese", "Wu", "Tibetan", "Uyghur"],
    population: "1.41 Billion",
    gdpNominalUSD: "$18.53 Trillion",
    currency: "Renminbi Yuan (CNY)",
    defconRating: 3,
    nuclearStatus: {
      hasNuclearWeapons: true,
      estimatedWarheads: 500,
      deliveryPlatforms: ["DF-41 / DF-31AG Road-Mobile ICBMs", "Type 094 SSBN (JL-3 SLBMs)", "H-6N Air-Launched Ballistic Missiles"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "2,035,000 Active (World #1)",
      activeAircraft: 3300,
      navalCombatants: 730,
      strategicAlliance: "SCO",
    },
    strategicAssets: ["Yulin Submarine Base (Hainan)", "Jiuquan Satellite Launch Center", "Taiwan Strait ADIZ", "Bayan Obo Rare Earth Mines"],
    energyProfile: {
      oilProductionBPD: "4.2 Million bpd (Domestic) + 11.5M bpd (Imports)",
      gasExportCapacity: "Strategic LNG Ingestion Network (110 MMTPA)",
      strategicPipelines: ["Central Asia-China Gas Pipeline", "East Siberia-Pacific Ocean (ESPO) Pipeline"],
    },
    lat: 39.90,
    lon: 116.40,
    zoomLevel: 3.6,
    satelliteNotes: "Orbital optical sweep tracking South China Sea artificial island fortifications and Taiwan Strait naval carrier battle groups.",
  },
  UKR: {
    code: "UKR",
    name: "Ukraine",
    officialName: "Ukraine",
    capital: "Kyiv",
    region: "Europe",
    subregion: "Eastern Europe",
    unMemberSince: "October 24, 1945 (Founding Member)",
    languages: ["Ukrainian (Official)", "Russian", "English"],
    population: "38.0 Million",
    gdpNominalUSD: "$178 Billion",
    currency: "Ukrainian Hryvnia (UAH)",
    defconRating: 1,
    nuclearStatus: {
      hasNuclearWeapons: false,
      deliveryPlatforms: ["None (Denuclearized under 1994 Budapest Memorandum)"],
      iaeaCompliance: "UNDER_ENHANCED_SAFEGUARDS",
    },
    defenseReadiness: {
      standingTroops: "800,000 Active Defense Personnel",
      activeAircraft: 190,
      navalCombatants: 38,
      strategicAlliance: "NON_ALIGNED",
    },
    strategicAssets: ["Zaporizhzhia Nuclear Power Plant", "Odesa Deepwater Port", "Dnipro Industrial Axis", "Donbas Mineral Basin"],
    energyProfile: {
      oilProductionBPD: "35,000 bpd",
      gasExportCapacity: "Historic Druzhba / Urengoy Transit Corridor",
      strategicPipelines: ["Druzhba Pipeline Transit Corridor"],
    },
    lat: 50.45,
    lon: 30.52,
    zoomLevel: 5.2,
    satelliteNotes: "Active war theater. 24/7 multispectral thermal drone/satellite telemetry tracking Dnipro river crossings and frontline trench lines.",
  },
  DEU: {
    code: "DEU",
    name: "Germany",
    officialName: "Federal Republic of Germany",
    capital: "Berlin",
    region: "Europe",
    subregion: "Western Europe",
    unMemberSince: "September 18, 1973",
    languages: ["German (Official)", "English"],
    population: "84.4 Million",
    gdpNominalUSD: "$4.59 Trillion (Europe #1)",
    currency: "Euro (EUR)",
    defconRating: 4,
    nuclearStatus: {
      hasNuclearWeapons: false,
      deliveryPlatforms: ["NATO Nuclear Sharing (B61 at Büchel Air Base)"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "183,000 Active",
      activeAircraft: 618,
      navalCombatants: 80,
      strategicAlliance: "NATO",
    },
    strategicAssets: ["Ramstein US Air Base HQ", "Frankfurt Financial Core", "Port of Hamburg", "Rhine Logistics Corridor"],
    energyProfile: {
      oilProductionBPD: "35,000 bpd",
      gasExportCapacity: "Wilhelmshaven & Lubmin LNG Terminals (35 BCM/yr)",
      strategicPipelines: ["NEL / OPAL Grid", "Trans-European Gas Interconnectors"],
    },
    lat: 52.52,
    lon: 13.40,
    zoomLevel: 5.0,
    satelliteNotes: "NATO Central Europe command node. Ramstein Air Base high-altitude transport corridor surveillance.",
  },
  IRN: {
    code: "IRN",
    name: "Iran",
    officialName: "Islamic Republic of Iran",
    capital: "Tehran",
    region: "Middle East",
    subregion: "Western Asia / Persian Gulf",
    unMemberSince: "October 24, 1945 (Founding Member)",
    languages: ["Persian/Farsi (Official)", "Azeri", "Kurdish", "Arabic"],
    population: "89.2 Million",
    gdpNominalUSD: "$413 Billion",
    currency: "Iranian Rial (IRR)",
    defconRating: 2,
    nuclearStatus: {
      hasNuclearWeapons: false,
      estimatedWarheads: 0,
      deliveryPlatforms: ["Khorramshahr-4 / Sejjil MRBMs", "Fattah Hypersonic Missile", "Shahed Loitering Munitions"],
      iaeaCompliance: "UNDER_ENHANCED_SAFEGUARDS",
    },
    defenseReadiness: {
      standingTroops: "610,000 Active (IRGC + Regular Armed Forces)",
      activeAircraft: 550,
      navalCombatants: 101,
      strategicAlliance: "SCO",
    },
    strategicAssets: ["Natanz Uranium Enrichment Facility", "Fordow Underground Nuclear Site", "Bandar Abbas Naval Base", "Kharg Island Oil Terminal"],
    energyProfile: {
      oilProductionBPD: "3.2 Million bpd",
      gasExportCapacity: "South Pars Gas Field (World's Largest Gas Reserve)",
      strategicPipelines: ["IGAT Pipeline", "Goreh-Jask Oil Pipeline"],
    },
    lat: 35.68,
    lon: 51.38,
    zoomLevel: 4.6,
    satelliteNotes: "Direct infrared and radar scanning over Strait of Hormuz chokepoint and Natanz / Fordow underground centrifuge complexes.",
  },
  ISR: {
    code: "ISR",
    name: "Israel",
    officialName: "State of Israel",
    capital: "Jerusalem",
    region: "Middle East",
    subregion: "Levant",
    unMemberSince: "May 11, 1949",
    languages: ["Hebrew (Official)", "Arabic", "English"],
    population: "9.8 Million",
    gdpNominalUSD: "$530 Billion",
    currency: "Israeli New Shekel (ILS)",
    defconRating: 1,
    nuclearStatus: {
      hasNuclearWeapons: true,
      estimatedWarheads: 90,
      deliveryPlatforms: ["Jericho III ICBMs", "Dolphin-class Submarines (Popeye Turbo SLCM)", "F-35I Adir Stealth Fighters"],
      iaeaCompliance: "N/A",
    },
    defenseReadiness: {
      standingTroops: "170,000 Active + 465,000 Mobilized Reserves",
      activeAircraft: 612,
      navalCombatants: 67,
      strategicAlliance: "BILATERAL_US",
    },
    strategicAssets: ["Dimona Nuclear Research Center", "Nevatim Airbase (F-35 Wing)", "Port of Haifa", "Leviathan Offshore Gas Platform"],
    energyProfile: {
      oilProductionBPD: "N/A",
      gasExportCapacity: "Leviathan & Tamar Fields (21 BCM/yr to Egypt & Jordan)",
      strategicPipelines: ["EMG Gas Pipeline", "Eilat-Ashkelon Pipeline (EAPC)"],
    },
    lat: 31.76,
    lon: 35.21,
    zoomLevel: 6.2,
    satelliteNotes: "Iron Dome / Arrow-3 missile defense radar tracks synchronized with sovereign orbital sensors.",
  },
  GBR: {
    code: "GBR",
    name: "United Kingdom",
    officialName: "United Kingdom of Great Britain and Northern Ireland",
    capital: "London",
    region: "Europe",
    subregion: "Northern Europe",
    unMemberSince: "October 24, 1945 (Permanent Security Council Member)",
    languages: ["English (Official)", "Welsh", "Scottish Gaelic"],
    population: "67.8 Million",
    gdpNominalUSD: "$3.34 Trillion",
    currency: "Pound Sterling (GBP)",
    defconRating: 4,
    nuclearStatus: {
      hasNuclearWeapons: true,
      estimatedWarheads: 225,
      deliveryPlatforms: ["Vanguard-class SSBNs (Trident II D5 SLBMs)"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "148,000 Active",
      activeAircraft: 664,
      navalCombatants: 117,
      strategicAlliance: "NATO",
    },
    strategicAssets: ["HMNB Clyde (Faslane Submarine Base)", "RAF Akrotiri (Cyprus)", "London Financial City", "Portsmouth Naval Base"],
    energyProfile: {
      oilProductionBPD: "750,000 bpd (North Sea)",
      gasExportCapacity: "Isle of Grain & South Hook LNG Hubs",
      strategicPipelines: ["Forties Pipeline System", "Langeled Pipeline"],
    },
    lat: 51.50,
    lon: -0.12,
    zoomLevel: 5.0,
    satelliteNotes: "North Sea energy infrastructure and GIUK gap maritime patrol radar active.",
  },
  SAU: {
    code: "SAU",
    name: "Saudi Arabia",
    officialName: "Kingdom of Saudi Arabia",
    capital: "Riyadh",
    region: "Middle East",
    subregion: "Arabian Peninsula",
    unMemberSince: "October 24, 1945 (Founding Member)",
    languages: ["Arabic (Official)", "English"],
    population: "36.9 Million",
    gdpNominalUSD: "$1.11 Trillion",
    currency: "Saudi Riyal (SAR)",
    defconRating: 3,
    nuclearStatus: {
      hasNuclearWeapons: false,
      deliveryPlatforms: ["DF-21 / DF-3 Ballistic Missiles (Conventional)"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "257,000 Active",
      activeAircraft: 897,
      navalCombatants: 55,
      strategicAlliance: "BILATERAL_US",
    },
    strategicAssets: ["Ras Tanura Oil Terminal (World's Largest)", "Abqaiq Processing Facility", "King Abdulaziz AB", "NEOM Project Corridor"],
    energyProfile: {
      oilProductionBPD: "9.0 Million bpd (Capacity: 12.0M bpd)",
      gasExportCapacity: "Domestic Master Gas System (11.5 BCF/d)",
      strategicPipelines: ["East-West Petroline (5.0M bpd from Persian Gulf to Red Sea)"],
    },
    lat: 24.71,
    lon: 46.67,
    zoomLevel: 4.5,
    satelliteNotes: "Continuous thermal infrared monitoring over Ras Tanura and East-West crude pipeline manifold.",
  },
  JPN: {
    code: "JPN",
    name: "Japan",
    officialName: "State of Japan",
    capital: "Tokyo",
    region: "Asia",
    subregion: "Eastern Asia",
    unMemberSince: "December 18, 1956",
    languages: ["Japanese (Official)", "English"],
    population: "124.5 Million",
    gdpNominalUSD: "$4.11 Trillion",
    currency: "Japanese Yen (JPY)",
    defconRating: 4,
    nuclearStatus: {
      hasNuclearWeapons: false,
      deliveryPlatforms: ["US Extended Deterrence Umbrella"],
      iaeaCompliance: "COMPLIANT",
    },
    defenseReadiness: {
      standingTroops: "247,000 Active (Japan Self-Defense Forces)",
      activeAircraft: 1450,
      navalCombatants: 155,
      strategicAlliance: "BILATERAL_US",
    },
    strategicAssets: ["Yokosuka US 7th Fleet Base", "Okinawa Kadena Air Base", "Tokyo-Yokohama Industrial Megalopolis", "Tsushima Strait"],
    energyProfile: {
      oilProductionBPD: "N/A (World's #4 Crude Importer)",
      gasExportCapacity: "Global Top LNG Importer (66 MMTPA)",
      strategicPipelines: ["Domestic Coastal LNG Grids"],
    },
    lat: 35.67,
    lon: 139.65,
    zoomLevel: 4.8,
    satelliteNotes: "Sea of Japan ballistic missile early-warning radar tied into sovereign orbital space net.",
  },
};
