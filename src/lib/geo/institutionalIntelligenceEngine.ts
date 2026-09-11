/**
 * SOVEREIGN INSTITUTIONAL INTELLIGENCE ENGINE ($8,500 / MONTH TIER)
 * Advanced Multi-Domain Decision Matrix for Armies, Central Banks, Governments & Conglomerates.
 * 
 * 7 PILLARS OF SOVEREIGN INTELLIGENCE:
 * 1. Demographics & Societal Sentiment Matrix
 * 2. Electoral Predictive Modeling & Political Risk
 * 3. Biosecurity & Pathogen Early Warning
 * 4. Central Bank & Monetary Sovereignty Matrix
 * 5. Strategic Minerals & Supply Chain Chokepoints
 * 6. C4ISR Theater Readiness & Missile Defense
 * 7. State-Sponsored Cyber Warfare & SCADA Grid Resilience
 * 
 * TELEMETRY HARMONICS: [13 • 35 • 42 • 55 • #54751113]
 */

export type InstitutionalPillarType =
  | "DEMOGRAPHICS_SOCIETAL"
  | "ELECTORAL_POLITICAL"
  | "BIOSECURITY_HEALTH"
  | "CENTRAL_BANK_MONETARY"
  | "CRITICAL_SUPPLY_CHAIN"
  | "C4ISR_MILITARY_DEFENSE"
  | "CYBER_INFRASTRUCTURE";

export interface SovereignStateDossier {
  countryCode: string;
  countryName: string;
  flag: string;
  capital: string;
  coordinates: [number, number];
  headOfState: string;
  defconLevel: 1 | 2 | 3 | 4 | 5;
  compositeSovereignRiskScore: number; // 0 - 100
  
  // Pillar 1: Demographics & Societal Sentiment
  demographics: {
    populationMillion: number;
    medianAgeYears: number;
    youthUnemploymentPercent: number;
    medianWealthUSD: number;
    societalSentimentIndex: number; // 0 - 100 (Higher = Higher domestic stability)
    healthcareCapacityIndex: number; // Beds per 1,000 & ICU buffer
    brainDrainRiskScore: number; // 0 - 100
  };

  // Pillar 2: Electoral Predictive Modeling & Political Risk
  electoral: {
    nextGeneralElection: string;
    rulingCoalitionLeadPercent: number;
    legislativeMajorityConfidence: number; // 0 - 100%
    sovereignPolicyContinuityScore: number; // 0 - 100
    geopoliticalAlignment: "NATO_WEST" | "BRICS_PLUS" | "NON_ALIGNED_STRATEGIC" | "EURASIAN_ALLIANCE" | "INDO_PACIFIC_QUAD";
    civilUnrestProbabilityPercent: number;
  };

  // Pillar 3: Biosecurity & Pathogen Early Warning
  biosecurity: {
    bsl4FacilitiesCount: number;
    outbreakEarlyWarningIndex: number; // 0 - 100 (Higher = Higher Bio-resilience)
    strategicVaccineStockpileMonths: number;
    criticalAPIPharmaceuticalDependencyPercent: number; // Active Pharmaceutical Ingredient reliance on foreign import
    activePathogenThreatLevel: "NOMINAL" | "ELEVATED_WATCH" | "RESTRICTED_BIOHAZARD" | "OUTBREAK_CONTAINED";
  };

  // Pillar 4: Central Bank & Monetary Sovereignty
  centralBank: {
    centralBankName: string;
    fxReservesBillionUSD: number;
    goldHoldingsMetricTonnes: number;
    goldShareOfReservesPercent: number;
    sovereignCDS5YSpreadBps: number;
    balanceSheetToGDPPercent: number;
    policyRatePercent: number;
    annualInflationCPIPercent: number;
    sovereignDebtToGDPPercent: number;
    currencyDevaluationRiskPercent: number;
  };

  // Pillar 5: Critical Supply Chain & Strategic Minerals
  supplyChain: {
    rareEarthAutarkyPercent: number; // 0 - 100% self-sufficiency
    semiconductorFabricationTier: "CUTTING_EDGE_2NM_3NM" | "ADVANCED_7NM_14NM" | "LEGACY_28NM_PLUS" | "IMPORT_DEPENDENT";
    energyImportDependencyPercent: number;
    grainAndFoodStockpileMonths: number;
    strategicPortChokeRisk: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  };

  // Pillar 6: C4ISR & Theater Military Defense
  militaryDefense: {
    activeDutyPersonnelThousands: number;
    defenseBudgetBillionUSD: number;
    hypersonicAirDefenseBatteries: number;
    stealthAirCombatAirframes: number;
    nuclearWarheadStockpile?: number;
    navalDisplacementTotalTons: number;
    c4isrOrbitalDownlinkReady: boolean;
  };

  // Pillar 7: Cyber Warfare & Infrastructure Resilience
  cyberWarfare: {
    nationalCyberDefenseReadinessScore: number; // 0 - 100
    criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM" | "HARDENED_ENCRYPTED" | "INTERCONNECTED_VULNERABLE";
    activeStateAPTAffiliations: string[];
    zeroDayExploitExposureIndex: number; // 0 - 100
    underseaFiberLendingSovereigntyScore: number;
  };
}

export const SOVEREIGN_INSTITUTIONAL_DOSSIERS: SovereignStateDossier[] = [
  {
    countryCode: "USA",
    countryName: "United States of America",
    flag: "🇺🇸",
    capital: "Washington, D.C.",
    coordinates: [38.8951, -77.0364],
    headOfState: "Executive President & Commander-in-Chief",
    defconLevel: 2,
    compositeSovereignRiskScore: 32,
    demographics: {
      populationMillion: 335.8,
      medianAgeYears: 38.9,
      youthUnemploymentPercent: 8.8,
      medianWealthUSD: 107000,
      societalSentimentIndex: 68,
      healthcareCapacityIndex: 88,
      brainDrainRiskScore: 12,
    },
    electoral: {
      nextGeneralElection: "2028-11-07",
      rulingCoalitionLeadPercent: 51.4,
      legislativeMajorityConfidence: 74,
      sovereignPolicyContinuityScore: 82,
      geopoliticalAlignment: "NATO_WEST",
      civilUnrestProbabilityPercent: 24,
    },
    biosecurity: {
      bsl4FacilitiesCount: 8,
      outbreakEarlyWarningIndex: 94,
      strategicVaccineStockpileMonths: 18,
      criticalAPIPharmaceuticalDependencyPercent: 62,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Federal Reserve System (Fed)",
      fxReservesBillionUSD: 242.8,
      goldHoldingsMetricTonnes: 8133.5,
      goldShareOfReservesPercent: 71.2,
      sovereignCDS5YSpreadBps: 34,
      balanceSheetToGDPPercent: 25.4,
      policyRatePercent: 5.25,
      annualInflationCPIPercent: 2.8,
      sovereignDebtToGDPPercent: 122.4,
      currencyDevaluationRiskPercent: 8,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 22,
      semiconductorFabricationTier: "CUTTING_EDGE_2NM_3NM",
      energyImportDependencyPercent: 0, // Net exporter
      grainAndFoodStockpileMonths: 36,
      strategicPortChokeRisk: "LOW",
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 1328,
      defenseBudgetBillionUSD: 886.0,
      hypersonicAirDefenseBatteries: 48,
      stealthAirCombatAirframes: 650,
      nuclearWarheadStockpile: 5244,
      navalDisplacementTotalTons: 3500000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 98,
      criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM",
      activeStateAPTAffiliations: ["US-CYBERCOM", "NSA TAO"],
      zeroDayExploitExposureIndex: 18,
      underseaFiberLendingSovereigntyScore: 95,
    },
  },
  {
    countryCode: "CHN",
    countryName: "People's Republic of China",
    flag: "🇨🇳",
    capital: "Beijing",
    coordinates: [39.9042, 116.4074],
    headOfState: "President & General Secretary",
    defconLevel: 2,
    compositeSovereignRiskScore: 48,
    demographics: {
      populationMillion: 1409.6,
      medianAgeYears: 39.8,
      youthUnemploymentPercent: 18.2,
      medianWealthUSD: 31200,
      societalSentimentIndex: 72,
      healthcareCapacityIndex: 76,
      brainDrainRiskScore: 28,
    },
    electoral: {
      nextGeneralElection: "2027-10-15",
      rulingCoalitionLeadPercent: 99.0,
      legislativeMajorityConfidence: 100,
      sovereignPolicyContinuityScore: 95,
      geopoliticalAlignment: "BRICS_PLUS",
      civilUnrestProbabilityPercent: 16,
    },
    biosecurity: {
      bsl4FacilitiesCount: 4,
      outbreakEarlyWarningIndex: 86,
      strategicVaccineStockpileMonths: 24,
      criticalAPIPharmaceuticalDependencyPercent: 8,
      activePathogenThreatLevel: "ELEVATED_WATCH",
    },
    centralBank: {
      centralBankName: "People's Bank of China (PBoC)",
      fxReservesBillionUSD: 3245.0,
      goldHoldingsMetricTonnes: 2264.3,
      goldShareOfReservesPercent: 4.9,
      sovereignCDS5YSpreadBps: 58,
      balanceSheetToGDPPercent: 34.8,
      policyRatePercent: 3.35,
      annualInflationCPIPercent: 0.6,
      sovereignDebtToGDPPercent: 83.6,
      currencyDevaluationRiskPercent: 28,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 92,
      semiconductorFabricationTier: "ADVANCED_7NM_14NM",
      energyImportDependencyPercent: 72,
      grainAndFoodStockpileMonths: 18,
      strategicPortChokeRisk: "HIGH", // Malacca Strait dependency
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 2035,
      defenseBudgetBillionUSD: 296.0,
      hypersonicAirDefenseBatteries: 62,
      stealthAirCombatAirframes: 220,
      nuclearWarheadStockpile: 500,
      navalDisplacementTotalTons: 2400000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 95,
      criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM",
      activeStateAPTAffiliations: ["APT41 (Wicked Panda)", "Volt Typhoon", "APT10 (Stone Panda)"],
      zeroDayExploitExposureIndex: 22,
      underseaFiberLendingSovereigntyScore: 88,
    },
  },
  {
    countryCode: "TUR",
    countryName: "Republic of Türkiye",
    flag: "🇹🇷",
    capital: "Ankara",
    coordinates: [39.9334, 32.8597],
    headOfState: "President of the Republic",
    defconLevel: 3,
    compositeSovereignRiskScore: 52,
    demographics: {
      populationMillion: 85.8,
      medianAgeYears: 33.5,
      youthUnemploymentPercent: 16.8,
      medianWealthUSD: 18500,
      societalSentimentIndex: 65,
      healthcareCapacityIndex: 82,
      brainDrainRiskScore: 42,
    },
    electoral: {
      nextGeneralElection: "2028-05-14",
      rulingCoalitionLeadPercent: 48.6,
      legislativeMajorityConfidence: 68,
      sovereignPolicyContinuityScore: 78,
      geopoliticalAlignment: "NON_ALIGNED_STRATEGIC",
      civilUnrestProbabilityPercent: 28,
    },
    biosecurity: {
      bsl4FacilitiesCount: 1,
      outbreakEarlyWarningIndex: 80,
      strategicVaccineStockpileMonths: 12,
      criticalAPIPharmaceuticalDependencyPercent: 68,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Central Bank of the Republic of Türkiye (CBRT)",
      fxReservesBillionUSD: 154.2,
      goldHoldingsMetricTonnes: 780.4,
      goldShareOfReservesPercent: 38.5,
      sovereignCDS5YSpreadBps: 265,
      balanceSheetToGDPPercent: 18.2,
      policyRatePercent: 50.0,
      annualInflationCPIPercent: 49.3,
      sovereignDebtToGDPPercent: 29.5,
      currencyDevaluationRiskPercent: 35,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 65, // Beylikova world 2nd deposit
      semiconductorFabricationTier: "LEGACY_28NM_PLUS",
      energyImportDependencyPercent: 74,
      grainAndFoodStockpileMonths: 24,
      strategicPortChokeRisk: "LOW", // Controls Turkish Straits
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 425,
      defenseBudgetBillionUSD: 40.0,
      hypersonicAirDefenseBatteries: 16, // S-400 + SIPER
      stealthAirCombatAirframes: 24, // KAAN Prototypes + UCAVs (KIZILELMA, ANKA-3)
      nuclearWarheadStockpile: 0, // NATO nuclear sharing host (Incirlik)
      navalDisplacementTotalTons: 320000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 88,
      criticalSCADAIsolationLevel: "HARDENED_ENCRYPTED",
      activeStateAPTAffiliations: ["USOM Cyber Shield", "Sovereign Blue Team"],
      zeroDayExploitExposureIndex: 32,
      underseaFiberLendingSovereigntyScore: 80,
    },
  },
  {
    countryCode: "SAU",
    countryName: "Kingdom of Saudi Arabia",
    flag: "🇸🇦",
    capital: "Riyadh",
    coordinates: [24.7136, 46.6753],
    headOfState: "Custodian of the Two Holy Mosques & Crown Prince",
    defconLevel: 3,
    compositeSovereignRiskScore: 36,
    demographics: {
      populationMillion: 36.4,
      medianAgeYears: 31.8,
      youthUnemploymentPercent: 13.2,
      medianWealthUSD: 54000,
      societalSentimentIndex: 84,
      healthcareCapacityIndex: 85,
      brainDrainRiskScore: 16,
    },
    electoral: {
      nextGeneralElection: "MONARCHY_SOVEREIGN",
      rulingCoalitionLeadPercent: 100.0,
      legislativeMajorityConfidence: 100,
      sovereignPolicyContinuityScore: 98,
      geopoliticalAlignment: "NON_ALIGNED_STRATEGIC",
      civilUnrestProbabilityPercent: 8,
    },
    biosecurity: {
      bsl4FacilitiesCount: 1,
      outbreakEarlyWarningIndex: 84,
      strategicVaccineStockpileMonths: 20,
      criticalAPIPharmaceuticalDependencyPercent: 78,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Saudi Central Bank (SAMA)",
      fxReservesBillionUSD: 456.0,
      goldHoldingsMetricTonnes: 323.1,
      goldShareOfReservesPercent: 4.8,
      sovereignCDS5YSpreadBps: 52,
      balanceSheetToGDPPercent: 28.5,
      policyRatePercent: 5.50,
      annualInflationCPIPercent: 1.6,
      sovereignDebtToGDPPercent: 26.2,
      currencyDevaluationRiskPercent: 5,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 40,
      semiconductorFabricationTier: "IMPORT_DEPENDENT",
      energyImportDependencyPercent: 0,
      grainAndFoodStockpileMonths: 30,
      strategicPortChokeRisk: "HIGH", // Strait of Hormuz + Bab el-Mandeb
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 257,
      defenseBudgetBillionUSD: 75.8,
      hypersonicAirDefenseBatteries: 34, // Patriot PAC-3 + THAAD
      stealthAirCombatAirframes: 84, // F-15SA / Typhoon
      nuclearWarheadStockpile: 0,
      navalDisplacementTotalTons: 110000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 92,
      criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM",
      activeStateAPTAffiliations: ["NCA Cyber Defense Shield"],
      zeroDayExploitExposureIndex: 25,
      underseaFiberLendingSovereigntyScore: 84,
    },
  },
  {
    countryCode: "DEU",
    countryName: "Federal Republic of Germany",
    flag: "🇩🇪",
    capital: "Berlin",
    coordinates: [52.52, 13.405],
    headOfState: "Federal Chancellor",
    defconLevel: 3,
    compositeSovereignRiskScore: 30,
    demographics: {
      populationMillion: 84.4,
      medianAgeYears: 45.9,
      youthUnemploymentPercent: 6.2,
      medianWealthUSD: 98000,
      societalSentimentIndex: 62,
      healthcareCapacityIndex: 94,
      brainDrainRiskScore: 18,
    },
    electoral: {
      nextGeneralElection: "2025-09-28",
      rulingCoalitionLeadPercent: 34.0,
      legislativeMajorityConfidence: 58,
      sovereignPolicyContinuityScore: 72,
      geopoliticalAlignment: "NATO_WEST",
      civilUnrestProbabilityPercent: 20,
    },
    biosecurity: {
      bsl4FacilitiesCount: 4,
      outbreakEarlyWarningIndex: 92,
      strategicVaccineStockpileMonths: 16,
      criticalAPIPharmaceuticalDependencyPercent: 55,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Deutsche Bundesbank / ECB",
      fxReservesBillionUSD: 312.0,
      goldHoldingsMetricTonnes: 3352.6,
      goldShareOfReservesPercent: 74.5,
      sovereignCDS5YSpreadBps: 12,
      balanceSheetToGDPPercent: 48.2,
      policyRatePercent: 3.65,
      annualInflationCPIPercent: 2.1,
      sovereignDebtToGDPPercent: 63.8,
      currencyDevaluationRiskPercent: 6,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 5,
      semiconductorFabricationTier: "ADVANCED_7NM_14NM", // Silicon Saxony & ESMC
      energyImportDependencyPercent: 68,
      grainAndFoodStockpileMonths: 18,
      strategicPortChokeRisk: "LOW",
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 181,
      defenseBudgetBillionUSD: 85.0,
      hypersonicAirDefenseBatteries: 18, // Arrow-3 + IRIS-T SLM
      stealthAirCombatAirframes: 35, // F-35A on order
      nuclearWarheadStockpile: 0,
      navalDisplacementTotalTons: 220000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 91,
      criticalSCADAIsolationLevel: "HARDENED_ENCRYPTED",
      activeStateAPTAffiliations: ["BSI Cyber Command"],
      zeroDayExploitExposureIndex: 26,
      underseaFiberLendingSovereigntyScore: 89,
    },
  },
  {
    countryCode: "RUS",
    countryName: "Russian Federation",
    flag: "🇷🇺",
    capital: "Moscow",
    coordinates: [55.7558, 37.6173],
    headOfState: "President of the Russian Federation",
    defconLevel: 2,
    compositeSovereignRiskScore: 78,
    demographics: {
      populationMillion: 144.2,
      medianAgeYears: 40.5,
      youthUnemploymentPercent: 12.4,
      medianWealthUSD: 16500,
      societalSentimentIndex: 58,
      healthcareCapacityIndex: 72,
      brainDrainRiskScore: 68,
    },
    electoral: {
      nextGeneralElection: "2030-03-17",
      rulingCoalitionLeadPercent: 88.0,
      legislativeMajorityConfidence: 96,
      sovereignPolicyContinuityScore: 88,
      geopoliticalAlignment: "EURASIAN_ALLIANCE",
      civilUnrestProbabilityPercent: 32,
    },
    biosecurity: {
      bsl4FacilitiesCount: 3,
      outbreakEarlyWarningIndex: 75,
      strategicVaccineStockpileMonths: 14,
      criticalAPIPharmaceuticalDependencyPercent: 74,
      activePathogenThreatLevel: "ELEVATED_WATCH",
    },
    centralBank: {
      centralBankName: "Bank of Russia (CBR)",
      fxReservesBillionUSD: 602.0, // Significant portion frozen
      goldHoldingsMetricTonnes: 2332.7,
      goldShareOfReservesPercent: 30.5,
      sovereignCDS5YSpreadBps: 680,
      balanceSheetToGDPPercent: 22.4,
      policyRatePercent: 19.0,
      annualInflationCPIPercent: 8.9,
      sovereignDebtToGDPPercent: 17.5,
      currencyDevaluationRiskPercent: 55,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 78,
      semiconductorFabricationTier: "LEGACY_28NM_PLUS",
      energyImportDependencyPercent: 0,
      grainAndFoodStockpileMonths: 36,
      strategicPortChokeRisk: "HIGH", // Baltic & Black Sea chokepoints
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 1320,
      defenseBudgetBillionUSD: 140.0,
      hypersonicAirDefenseBatteries: 74, // S-400, S-500, Kinzhal
      stealthAirCombatAirframes: 32, // Su-57
      nuclearWarheadStockpile: 5580,
      navalDisplacementTotalTons: 1900000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 96,
      criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM",
      activeStateAPTAffiliations: ["APT28 (Fancy Bear)", "APT29 (Cozy Bear)", "Sandworm"],
      zeroDayExploitExposureIndex: 19,
      underseaFiberLendingSovereigntyScore: 82,
    },
  },
  {
    countryCode: "GBR",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    capital: "London",
    coordinates: [51.5074, -0.1278],
    headOfState: "Prime Minister & Sovereign King",
    defconLevel: 3,
    compositeSovereignRiskScore: 32,
    demographics: {
      populationMillion: 68.2,
      medianAgeYears: 40.7,
      youthUnemploymentPercent: 11.8,
      medianWealthUSD: 125000,
      societalSentimentIndex: 64,
      healthcareCapacityIndex: 88,
      brainDrainRiskScore: 22,
    },
    electoral: {
      nextGeneralElection: "2029-06-15",
      rulingCoalitionLeadPercent: 42.0,
      legislativeMajorityConfidence: 84,
      sovereignPolicyContinuityScore: 80,
      geopoliticalAlignment: "NATO_WEST",
      civilUnrestProbabilityPercent: 22,
    },
    biosecurity: {
      bsl4FacilitiesCount: 3,
      outbreakEarlyWarningIndex: 94,
      strategicVaccineStockpileMonths: 18,
      criticalAPIPharmaceuticalDependencyPercent: 62,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Bank of England (BoE)",
      fxReservesBillionUSD: 185.0,
      goldHoldingsMetricTonnes: 310.3,
      goldShareOfReservesPercent: 12.4,
      sovereignCDS5YSpreadBps: 24,
      balanceSheetToGDPPercent: 38.0,
      policyRatePercent: 5.0,
      annualInflationCPIPercent: 2.2,
      sovereignDebtToGDPPercent: 98.4,
      currencyDevaluationRiskPercent: 14,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 10,
      semiconductorFabricationTier: "ADVANCED_7NM_14NM", // ARM IP Leader
      energyImportDependencyPercent: 42,
      grainAndFoodStockpileMonths: 14,
      strategicPortChokeRisk: "LOW",
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 148,
      defenseBudgetBillionUSD: 72.0,
      hypersonicAirDefenseBatteries: 12,
      stealthAirCombatAirframes: 38, // F-35B Lightning II
      nuclearWarheadStockpile: 225, // Trident D5
      navalDisplacementTotalTons: 480000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 97,
      criticalSCADAIsolationLevel: "AIR_GAPPED_QUANTUM",
      activeStateAPTAffiliations: ["GCHQ NCSC", "National Cyber Force"],
      zeroDayExploitExposureIndex: 16,
      underseaFiberLendingSovereigntyScore: 94,
    },
  },
  {
    countryCode: "IND",
    countryName: "Republic of India",
    flag: "🇮🇳",
    capital: "New Delhi",
    coordinates: [28.6139, 77.209],
    headOfState: "Prime Minister of India",
    defconLevel: 3,
    compositeSovereignRiskScore: 42,
    demographics: {
      populationMillion: 1428.6,
      medianAgeYears: 28.7,
      youthUnemploymentPercent: 14.5,
      medianWealthUSD: 15400,
      societalSentimentIndex: 78,
      healthcareCapacityIndex: 68,
      brainDrainRiskScore: 35,
    },
    electoral: {
      nextGeneralElection: "2029-05-10",
      rulingCoalitionLeadPercent: 44.2,
      legislativeMajorityConfidence: 76,
      sovereignPolicyContinuityScore: 84,
      geopoliticalAlignment: "INDO_PACIFIC_QUAD",
      civilUnrestProbabilityPercent: 25,
    },
    biosecurity: {
      bsl4FacilitiesCount: 2,
      outbreakEarlyWarningIndex: 82,
      strategicVaccineStockpileMonths: 24, // World's pharmacy (Serum Institute)
      criticalAPIPharmaceuticalDependencyPercent: 45,
      activePathogenThreatLevel: "NOMINAL",
    },
    centralBank: {
      centralBankName: "Reserve Bank of India (RBI)",
      fxReservesBillionUSD: 684.0,
      goldHoldingsMetricTonnes: 840.8,
      goldShareOfReservesPercent: 9.2,
      sovereignCDS5YSpreadBps: 84,
      balanceSheetToGDPPercent: 24.5,
      policyRatePercent: 6.50,
      annualInflationCPIPercent: 3.65,
      sovereignDebtToGDPPercent: 82.5,
      currencyDevaluationRiskPercent: 18,
    },
    supplyChain: {
      rareEarthAutarkyPercent: 48,
      semiconductorFabricationTier: "ADVANCED_7NM_14NM", // Tata & Micron Fabs
      energyImportDependencyPercent: 84,
      grainAndFoodStockpileMonths: 32,
      strategicPortChokeRisk: "MODERATE", // Indian Ocean Sea Lanes
    },
    militaryDefense: {
      activeDutyPersonnelThousands: 1450,
      defenseBudgetBillionUSD: 83.5,
      hypersonicAirDefenseBatteries: 28, // S-400 + MR-SAM + Akash Prime
      stealthAirCombatAirframes: 36, // Rafale + AMCA Program
      nuclearWarheadStockpile: 172,
      navalDisplacementTotalTons: 550000,
      c4isrOrbitalDownlinkReady: true,
    },
    cyberWarfare: {
      nationalCyberDefenseReadinessScore: 89,
      criticalSCADAIsolationLevel: "HARDENED_ENCRYPTED",
      activeStateAPTAffiliations: ["CERT-In", "Defence Cyber Agency"],
      zeroDayExploitExposureIndex: 28,
      underseaFiberLendingSovereigntyScore: 86,
    },
  },
];

/**
 * Monte Carlo Simulation for Sovereign Electoral & Political Stability Outcome
 */
export function simulateElectoralTrajectory(
  dossier: SovereignStateDossier,
  economicShockPercent: number,
  inflationSurgePercent: number,
  simulationsCount = 1000
) {
  let rulingWins = 0;
  let coalitionFails = 0;
  const results: number[] = [];

  const baseLead = dossier.electoral.rulingCoalitionLeadPercent;
  const sensitivity = (economicShockPercent * 1.5 + inflationSurgePercent * 2.0);

  for (let i = 0; i < simulationsCount; i++) {
    // Normal distribution variance
    const u1 = Math.random();
    const u2 = Math.random();
    const randStd = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);

    const projectedVote = Math.max(
      15,
      Math.min(85, baseLead - sensitivity + randStd * 4.2)
    );

    results.push(projectedVote);
    if (projectedVote >= 50.0) {
      rulingWins++;
    } else {
      coalitionFails++;
    }
  }

  const winProbabilityPercent = ((rulingWins / simulationsCount) * 100).toFixed(1);
  const avgProjectedVote = (results.reduce((a, b) => a + b, 0) / simulationsCount).toFixed(1);

  return {
    winProbabilityPercent: Number(winProbabilityPercent),
    avgProjectedVote: Number(avgProjectedVote),
    rulingWins,
    coalitionFails,
    simulationsCount,
  };
}

/**
 * Central Bank Rate Shock & CDS Sensitivity Matrix
 */
export function calculateCentralBankStressTest(
  dossier: SovereignStateDossier,
  rateHikeBps: number,
  fxDepreciationPercent: number
) {
  const currentCDS = dossier.centralBank.sovereignCDS5YSpreadBps;
  const debtToGDP = dossier.centralBank.sovereignDebtToGDPPercent;

  // CDS expansion formula under macro pressure
  const simulatedCDS = Math.round(
    currentCDS + (rateHikeBps / 25) * 4.5 + (fxDepreciationPercent * 6.8) * (debtToGDP / 100)
  );

  const interestPaymentIncreaseBillionUSD = (
    (dossier.centralBank.fxReservesBillionUSD * (debtToGDP / 100) * (rateHikeBps / 10000))
  ).toFixed(2);

  const reserveDepletionBillionUSD = (
    dossier.centralBank.fxReservesBillionUSD * (fxDepreciationPercent / 100) * 0.4
  ).toFixed(2);

  return {
    currentCDS,
    simulatedCDS,
    cdsDelta: simulatedCDS - currentCDS,
    interestPaymentIncreaseBillionUSD: Number(interestPaymentIncreaseBillionUSD),
    reserveDepletionBillionUSD: Number(reserveDepletionBillionUSD),
  };
}
