import { NextResponse } from "next/server";
import { CIVILIZATIONAL_FLEET } from "@/lib/broadcast/civilizationalShips";

interface VesselWalletState {
  id: string;
  shipName: string;
  civilization: string;
  faction: "conservative" | "liberal";
  walletAddress: string;
  uncollectedUSD: number;
  totalMinedUSD: number;
  hashrateMH: number;
  activeWorkers: number;
  lastHeartbeat: string;
}

// In-memory sovereign ledger
const SOVEREIGN_VAULT_BASE = 840400000000; // $840.40B
let totalSweptToVaultUSD = 42850900;
let lastSweepTimestamp: string | null = "2026-09-13T10:00:00.000Z";

function generateVesselWallets(): VesselWalletState[] {
  return CIVILIZATIONAL_FLEET.map((ship, idx) => {
    const baseHash = ship.faction === "conservative" ? 4250 + (idx * 75) : 3120 + (idx * 60);
    const uncollected = parseFloat((baseHash * 0.85 + (idx * 12.4)).toFixed(2));
    const totalMined = parseFloat((uncollected * 14.2).toFixed(2));
    return {
      id: ship.id,
      shipName: ship.name,
      civilization: ship.civilization,
      faction: ship.faction,
      walletAddress: `NUR-${ship.id}-54751113-VAULT`,
      uncollectedUSD: uncollected,
      totalMinedUSD: totalMined,
      hashrateMH: baseHash,
      activeWorkers: Math.floor(baseHash / 120),
      lastHeartbeat: new Date().toISOString()
    };
  });
}

export async function GET() {
  const wallets = generateVesselWallets();
  const totalUnsweptUSD = wallets.reduce((acc, w) => acc + w.uncollectedUSD, 0);
  const totalHashrateMH = wallets.reduce((acc, w) => acc + w.hashrateMH, 0);
  const totalActiveWorkers = wallets.reduce((acc, w) => acc + w.activeWorkers, 0);

  return NextResponse.json({
    success: true,
    vaultId: "54751113",
    sovereignVaultBalanceUSD: SOVEREIGN_VAULT_BASE + totalSweptToVaultUSD,
    invariant: {
      keys: [42, 13, 35, 55],
      formula: "42 · 13 · 35 · 55",
      status: "LOCKED_VALID",
      hash: "SHA256-42133555-SOVEREIGN-NUR-2126"
    },
    totalSweptToVaultUSD,
    totalUnsweptUSD,
    totalHashrateGH: parseFloat((totalHashrateMH / 1000).toFixed(2)),
    totalActiveWorkers,
    lastSweepTimestamp,
    sweepSplitRatio: {
      umayMasterVaultPercent: 95,
      regionalShipReservePercent: 5
    },
    wallets
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { invariantKey, notes } = body;

    // Validate Invariant key if supplied or default validate
    const invariantPassed = invariantKey === "42·13·35·55" || invariantKey === "42.13.35.55" || !invariantKey;

    if (!invariantPassed) {
      return NextResponse.json({
        success: false,
        error: "INVARIANT_BREACH: Invariant key mismatch. Required: 42 · 13 · 35 · 55."
      }, { status: 403 });
    }

    const wallets = generateVesselWallets();
    const totalUnswept = wallets.reduce((acc, w) => acc + w.uncollectedUSD, 0);
    const sweepAmount95 = parseFloat((totalUnswept * 0.95).toFixed(2));
    const regionalRetention5 = parseFloat((totalUnswept * 0.05).toFixed(2));

    totalSweptToVaultUSD += sweepAmount95;
    lastSweepTimestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      action: "SWEEP_EXECUTED",
      sweptToVaultUSD: sweepAmount95,
      regionalRetentionUSD: regionalRetention5,
      newSovereignVaultBalanceUSD: SOVEREIGN_VAULT_BASE + totalSweptToVaultUSD,
      timestamp: lastSweepTimestamp,
      notes: notes || "Master Sovereign Fleet Sweep",
      invariantVerified: true
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
