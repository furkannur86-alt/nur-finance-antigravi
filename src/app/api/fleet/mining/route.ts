import { NextRequest, NextResponse } from "next/server";
import {
  fleetMiningState,
  applyHeartbeat,
  getFleetSnapshot,
} from "@/lib/sovereign/fleetMiningState";

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

export async function GET() {
  const ships = getFleetSnapshot();

  let totalFleetHashrateMhs = 0;
  let totalActiveWorkers = 0;
  let totalFleetBlocksMined = 0;
  let totalUnclaimedTokens = 0;

  for (const s of ships) {
    totalFleetHashrateMhs += s.hashrateMhs;
    totalActiveWorkers += s.activeWorkers;
    totalFleetBlocksMined += s.totalBlocksMined;
    totalUnclaimedTokens += s.unclaimedTokens;
  }

  return NextResponse.json({
    success: true,
    masterVaultId: "54751113",
    protocol: "STANAG-4586 QUANTUM PROOF-OF-COMPUTE",
    telemetry: {
      totalFleetHashrateGhs: `${(totalFleetHashrateMhs / 1000).toFixed(2)} GH/s`,
      totalFleetHashrateMhs,
      totalActiveWorkers,
      totalFleetBlocksMined,
      totalUnclaimedTokens,
      estimated24hUsdYield: (totalUnclaimedTokens * 4.2).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      activeShipsCount: ships.length,
      masterTreasurySweepStatus: "ACTIVE_AUTO_SWEEP_95_PERCENT",
      lastAggregationTimestamp: new Date().toISOString(),
    },
    ships,
  });
}

export async function POST(req: NextRequest) {
  const report = (await req.json().catch(() => null)) as MiningNodeReport | null;

  if (!report || !report.shipId) {
    return NextResponse.json({ success: false, error: "INVALID_MINING_REPORT" }, { status: 400 });
  }

  const { shipId, hashrateMhs, blocksMined, unclaimedTokens } = report;

  if (!fleetMiningState[shipId]) {
    return NextResponse.json({ success: false, error: "UNKNOWN_SHIP_ID" }, { status: 404 });
  }

  applyHeartbeat(shipId, hashrateMhs, blocksMined, unclaimedTokens);

  return NextResponse.json({
    success: true,
    shipId,
    status: "TELEMETRY_ACCEPTED",
    masterVaultReceipt: {
      vaultId: "54751113",
      sweepPercentage: 95,
      treasuryDestination: "UMAY_GUL_NUR_MASTER_TREASURY",
      timestamp: new Date().toISOString(),
    },
  });
}
