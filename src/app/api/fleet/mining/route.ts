import { NextRequest, NextResponse } from "next/server";

// Sovereign Fleet Mining Telemetry & Master Treasury Aggregator
// Vault ID: #54751113 // Master Treasury: $840.40B + Live Mining Rewards

interface MiningNodeReport {
  shipId: string;
  civilizationKey: string;
  faction: "conservative" | "liberal";
  workerId: string;
  hashrateMhs: number;
  blocksMined: number;
  sharesSubmitted: number;
  unclaimedTokens: number;
  walletAddress: string;
}

// In-memory telemetry cache (aggregated across all 36 ships / 18 civilizations)
const fleetMiningState: Record<string, {
  hashrateMhs: number;
  activeWorkers: number;
  totalBlocksMined: number;
  unclaimedTokens: number;
  walletAddress: string;
  lastPing: number;
}> = {
  TR_SOV: { hashrateMhs: 4250, activeWorkers: 1420, totalBlocksMined: 840, unclaimedTokens: 14200.5, walletAddress: "NUR-TR-SOV-54751113-BOZKURT", lastPing: Date.now() },
  TR_LIB: { hashrateMhs: 3890, activeWorkers: 1210, totalBlocksMined: 720, unclaimedTokens: 11840.0, walletAddress: "NUR-TR-LIB-54751113-TULIP", lastPing: Date.now() },
  UK_SOV: { hashrateMhs: 5120, activeWorkers: 1890, totalBlocksMined: 1150, unclaimedTokens: 19450.2, walletAddress: "NUR-UK-SOV-54751113-CROWN", lastPing: Date.now() },
  UK_LIB: { hashrateMhs: 4890, activeWorkers: 1650, totalBlocksMined: 980, unclaimedTokens: 16200.8, walletAddress: "NUR-UK-LIB-54751113-PAX", lastPing: Date.now() },
  DE_SOV: { hashrateMhs: 4650, activeWorkers: 1540, totalBlocksMined: 920, unclaimedTokens: 15320.4, walletAddress: "NUR-DE-SOV-54751113-WALKURE", lastPing: Date.now() },
  DE_LIB: { hashrateMhs: 4320, activeWorkers: 1380, totalBlocksMined: 860, unclaimedTokens: 13900.1, walletAddress: "NUR-DE-LIB-54751113-TECHNO", lastPing: Date.now() },
  CN_SOV: { hashrateMhs: 8940, activeWorkers: 3450, totalBlocksMined: 2140, unclaimedTokens: 34800.9, walletAddress: "NUR-CN-SOV-54751113-DRAGON", lastPing: Date.now() },
  CN_LIB: { hashrateMhs: 7850, activeWorkers: 2980, totalBlocksMined: 1870, unclaimedTokens: 29400.3, walletAddress: "NUR-CN-LIB-54751113-HARMONY", lastPing: Date.now() },
  JP_SOV: { hashrateMhs: 4120, activeWorkers: 1410, totalBlocksMined: 810, unclaimedTokens: 13450.6, walletAddress: "NUR-JP-SOV-54751113-YAMATO", lastPing: Date.now() },
  JP_LIB: { hashrateMhs: 3950, activeWorkers: 1320, totalBlocksMined: 760, unclaimedTokens: 12100.2, walletAddress: "NUR-JP-LIB-54751113-SHIBUYA", lastPing: Date.now() },
  FR_SOV: { hashrateMhs: 3640, activeWorkers: 1120, totalBlocksMined: 690, unclaimedTokens: 11200.0, walletAddress: "NUR-FR-SOV-54751113-MARIANNE", lastPing: Date.now() },
  FR_LIB: { hashrateMhs: 3480, activeWorkers: 1040, totalBlocksMined: 640, unclaimedTokens: 10450.7, walletAddress: "NUR-FR-LIB-54751113-RIVIERA", lastPing: Date.now() },
  RU_SOV: { hashrateMhs: 6450, activeWorkers: 2210, totalBlocksMined: 1420, unclaimedTokens: 24100.8, walletAddress: "NUR-RU-SOV-54751113-TSARGRAD", lastPing: Date.now() },
  RU_LIB: { hashrateMhs: 5120, activeWorkers: 1760, totalBlocksMined: 1110, unclaimedTokens: 18200.4, walletAddress: "NUR-RU-LIB-54751113-NEVA", lastPing: Date.now() },
  AR_SOV: { hashrateMhs: 5890, activeWorkers: 1980, totalBlocksMined: 1290, unclaimedTokens: 21400.5, walletAddress: "NUR-AR-SOV-54751113-CALIPHATE", lastPing: Date.now() },
  AR_LIB: { hashrateMhs: 5320, activeWorkers: 1790, totalBlocksMined: 1180, unclaimedTokens: 19800.2, walletAddress: "NUR-AR-LIB-54751113-DUBAI", lastPing: Date.now() },
  IR_SOV: { hashrateMhs: 3420, activeWorkers: 1080, totalBlocksMined: 620, unclaimedTokens: 9800.0, walletAddress: "NUR-IR-SOV-54751113-PERSEPOLIS", lastPing: Date.now() },
  IR_LIB: { hashrateMhs: 3180, activeWorkers: 990, totalBlocksMined: 580, unclaimedTokens: 8900.5, walletAddress: "NUR-IR-LIB-54751113-TEHRAN", lastPing: Date.now() },
  IN_SOV: { hashrateMhs: 7420, activeWorkers: 2840, totalBlocksMined: 1750, unclaimedTokens: 28400.6, walletAddress: "NUR-IN-SOV-54751113-BHARAT", lastPing: Date.now() },
  IN_LIB: { hashrateMhs: 6890, activeWorkers: 2510, totalBlocksMined: 1590, unclaimedTokens: 25100.1, walletAddress: "NUR-IN-LIB-54751113-GOA", lastPing: Date.now() },
  ES_SOV: { hashrateMhs: 3210, activeWorkers: 980, totalBlocksMined: 540, unclaimedTokens: 8700.3, walletAddress: "NUR-ES-SOV-54751113-HABSBURG", lastPing: Date.now() },
  ES_LIB: { hashrateMhs: 3050, activeWorkers: 910, totalBlocksMined: 510, unclaimedTokens: 8100.9, walletAddress: "NUR-ES-LIB-54751113-IBIZA", lastPing: Date.now() },
  IT_SOV: { hashrateMhs: 3510, activeWorkers: 1100, totalBlocksMined: 610, unclaimedTokens: 9900.4, walletAddress: "NUR-IT-SOV-54751113-ROMA", lastPing: Date.now() },
  IT_LIB: { hashrateMhs: 3340, activeWorkers: 1020, totalBlocksMined: 570, unclaimedTokens: 9200.7, walletAddress: "NUR-IT-LIB-54751113-MILAN", lastPing: Date.now() },
  SE_SOV: { hashrateMhs: 4120, activeWorkers: 1350, totalBlocksMined: 780, unclaimedTokens: 12900.2, walletAddress: "NUR-SE-SOV-54751113-VALKYRIE", lastPing: Date.now() },
  SE_LIB: { hashrateMhs: 3890, activeWorkers: 1240, totalBlocksMined: 720, unclaimedTokens: 11700.8, walletAddress: "NUR-SE-LIB-54751113-STOCKHOLM", lastPing: Date.now() },
  AF_SOV: { hashrateMhs: 2980, activeWorkers: 870, totalBlocksMined: 480, unclaimedTokens: 7600.5, walletAddress: "NUR-AF-SOV-54751113-SONGHAI", lastPing: Date.now() },
  AF_LIB: { hashrateMhs: 2840, activeWorkers: 810, totalBlocksMined: 440, unclaimedTokens: 7100.0, walletAddress: "NUR-AF-LIB-54751113-LAGOS", lastPing: Date.now() },
  LA_SOV: { hashrateMhs: 3840, activeWorkers: 1210, totalBlocksMined: 710, unclaimedTokens: 11400.3, walletAddress: "NUR-LA-SOV-54751113-AZTEC", lastPing: Date.now() },
  LA_LIB: { hashrateMhs: 3620, activeWorkers: 1140, totalBlocksMined: 660, unclaimedTokens: 10600.9, walletAddress: "NUR-LA-LIB-54751113-RIO", lastPing: Date.now() },
  KR_SOV: { hashrateMhs: 6120, activeWorkers: 2150, totalBlocksMined: 1380, unclaimedTokens: 22800.7, walletAddress: "NUR-KR-SOV-54751113-GORYEO", lastPing: Date.now() },
  KR_LIB: { hashrateMhs: 5840, activeWorkers: 1980, totalBlocksMined: 1290, unclaimedTokens: 21200.4, walletAddress: "NUR-KR-LIB-54751113-SEOUL", lastPing: Date.now() },
  SEA_SOV: { hashrateMhs: 4450, activeWorkers: 1480, totalBlocksMined: 890, unclaimedTokens: 14600.0, walletAddress: "NUR-SEA-SOV-54751113-AYUTTHAYA", lastPing: Date.now() },
  SEA_LIB: { hashrateMhs: 4190, activeWorkers: 1360, totalBlocksMined: 810, unclaimedTokens: 13200.6, walletAddress: "NUR-SEA-LIB-54751113-BALI", lastPing: Date.now() },
  TT_SOV: { hashrateMhs: 3410, activeWorkers: 1050, totalBlocksMined: 600, unclaimedTokens: 9600.2, walletAddress: "NUR-TT-SOV-54751113-TATAR", lastPing: Date.now() },
  TT_LIB: { hashrateMhs: 3250, activeWorkers: 990, totalBlocksMined: 560, unclaimedTokens: 9050.8, walletAddress: "NUR-TT-LIB-54751113-KAZAN", lastPing: Date.now() }
};

export async function GET() {
  let totalFleetHashrateMhs = 0;
  let totalActiveWorkers = 0;
  let totalFleetBlocksMined = 0;
  let totalUnclaimedTokens = 0;

  const shipList = Object.entries(fleetMiningState).map(([shipId, data]) => {
    totalFleetHashrateMhs += data.hashrateMhs;
    totalActiveWorkers += data.activeWorkers;
    totalFleetBlocksMined += data.totalBlocksMined;
    totalUnclaimedTokens += data.unclaimedTokens;
    return {
      shipId,
      ...data
    };
  });

  const totalFleetHashrateGhs = (totalFleetHashrateMhs / 1000).toFixed(2);
  const estimated24hUsdYield = (totalUnclaimedTokens * 4.2).toLocaleString("en-US", { style: "currency", currency: "USD" });

  return NextResponse.json({
    success: true,
    masterVaultId: "54751113",
    protocol: "STANAG-4586 QUANTUM PROOF-OF-COMPUTE",
    telemetry: {
      totalFleetHashrateGhs: `${totalFleetHashrateGhs} GH/s`,
      totalFleetHashrateMhs,
      totalActiveWorkers,
      totalFleetBlocksMined,
      totalUnclaimedTokens,
      estimated24hUsdYield,
      activeShipsCount: shipList.length,
      masterTreasurySweepStatus: "ACTIVE_AUTO_SWEEP_95_PERCENT",
      lastAggregationTimestamp: new Date().toISOString()
    },
    ships: shipList
  });
}

export async function POST(req: NextRequest) {
  const report = (await req.json().catch(() => null)) as MiningNodeReport | null;

  if (!report || !report.shipId) {
    return NextResponse.json({ success: false, error: "INVALID_MINING_REPORT" }, { status: 400 });
  }

  const { shipId, hashrateMhs, blocksMined, unclaimedTokens } = report;

  if (fleetMiningState[shipId]) {
    fleetMiningState[shipId].hashrateMhs = Math.max(fleetMiningState[shipId].hashrateMhs, hashrateMhs || 0);
    fleetMiningState[shipId].totalBlocksMined += blocksMined || 0;
    fleetMiningState[shipId].unclaimedTokens += unclaimedTokens || 0;
    fleetMiningState[shipId].lastPing = Date.now();
  }

  return NextResponse.json({
    success: true,
    shipId,
    status: "TELEMETRY_ACCEPTED",
    masterVaultReceipt: {
      vaultId: "54751113",
      sweepPercentage: 95,
      treasuryDestination: "UMAY_GUL_NUR_MASTER_TREASURY",
      timestamp: new Date().toISOString()
    }
  });
}
