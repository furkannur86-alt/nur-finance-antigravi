/**
 * NUR EARTH — Global Critical Mineral & Strategic Resource Reserves
 * Lithium, Cobalt, Rare Earth Elements (REE), Uranium, Nickel, Titanium and Copper deposits.
 */

export interface MineralDeposit {
  id: string;
  name: string;
  element: "LITHIUM" | "URANIUM" | "RARE_EARTHS" | "COBALT" | "NICKEL" | "TITANIUM" | "GOLD" | "BORON_THORIUM";
  country: string;
  lat: number;
  lon: number;
  estimatedReserveTons: string;
  globalSharePct: number;
  strategicImportance: "CRITICAL" | "HIGH" | "STRATEGIC";
  geopoliticalRisk: "HIGH_CONFLICT" | "RESTRICTED_EXPORT" | "SECURE";
  details: string;
}

export const STRATEGIC_MINERAL_RESERVES: MineralDeposit[] = [
  {
    id: "min-lithium-triangle",
    name: "Salar de Atacama & Uyuni (Lithium Triangle)",
    element: "LITHIUM",
    country: "Chile / Bolivia / Argentina",
    lat: -23.5,
    lon: -68.2,
    estimatedReserveTons: "35,000,000 Tons",
    globalSharePct: 54,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "RESTRICTED_EXPORT",
    details: "World's richest brine lithium reserves. Vital for EV battery gigafactories and grid storage.",
  },
  {
    id: "min-congo-cobalt",
    name: "Katanga Copper-Cobalt Belt (Kolwezi)",
    element: "COBALT",
    country: "DR Congo",
    lat: -10.72,
    lon: 25.47,
    estimatedReserveTons: "4,000,000 Tons",
    globalSharePct: 70,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "HIGH_CONFLICT",
    details: "Produces 70% of world's cobalt. Chinese state mining concessions control major supply routes.",
  },
  {
    id: "min-bayan-obo",
    name: "Bayan Obo REE Complex (Inner Mongolia)",
    element: "RARE_EARTHS",
    country: "China",
    lat: 41.77,
    lon: 109.96,
    estimatedReserveTons: "40,000,000 Tons",
    globalSharePct: 42,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "RESTRICTED_EXPORT",
    details: "World's largest Neodymium, Dysprosium & REE mine. Essential for missile guidance, radar & EV motors.",
  },
  {
    id: "min-beylikova",
    name: "Beylikova Rare Earth & Thorium Deposit (Eskisehir)",
    element: "BORON_THORIUM",
    country: "Turkey",
    lat: 39.75,
    lon: 31.15,
    estimatedReserveTons: "694,000,000 Tons Ore",
    globalSharePct: 18,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "SECURE",
    details: "World's 2nd largest rare earth elements deposit after Bayan Obo. High concentration of Thorium clean nuclear fuel.",
  },
  {
    id: "min-kazakh-uranium",
    name: "Tortkuduk & Inkai In-Situ Uranium Basin",
    element: "URANIUM",
    country: "Kazakhstan",
    lat: 44.50,
    lon: 67.50,
    estimatedReserveTons: "800,000 Tons U3O8",
    globalSharePct: 43,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "RESTRICTED_EXPORT",
    details: "Kazatomprom ISR extraction basin. Supplies 43% of global commercial nuclear reactor fuel.",
  },
  {
    id: "min-donbas-lithium",
    name: "Shevchenkivske & Kruta Balka Deposits (Donbas/Zaporizhzhia)",
    element: "LITHIUM",
    country: "Ukraine (Conflict Zone)",
    lat: 47.95,
    lon: 36.90,
    estimatedReserveTons: "500,000 Tons Li2O",
    globalSharePct: 6,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "HIGH_CONFLICT",
    details: "Massive hard-rock spodumene lithium & titanium deposits situated directly beneath the active frontline.",
  },
  {
    id: "min-norilsk",
    name: "Norilsk-Talnakh Nickel & Palladium Supercluster",
    element: "NICKEL",
    country: "Russia (Arctic Siberia)",
    lat: 69.35,
    lon: 88.20,
    estimatedReserveTons: "18,000,000 Tons Ni",
    globalSharePct: 38,
    strategicImportance: "CRITICAL",
    geopoliticalRisk: "RESTRICTED_EXPORT",
    details: "Supplies 40% of global palladium and 20% of class-1 nickel. Arctic strategic extraction bastion.",
  },
];
