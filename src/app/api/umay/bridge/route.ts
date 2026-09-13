import { NextResponse } from "next/server";
import {
  bridgeState,
  validateInvariant,
  VAULT_BASE_USD,
  VAULT_ID,
  VAULT_SHARE,
} from "@/lib/sovereign/vaultBridgeState";
import { getFleetSnapshot } from "@/lib/sovereign/fleetMiningState";

export const dynamic = "force-dynamic";

// GET — bridge status, configuration, and sweep history.
export async function GET() {
  const snapshot = getFleetSnapshot();
  const totalPending = snapshot.reduce((acc, s) => acc + s.unclaimedTokens, 0);

  return NextResponse.json({
    success: true,
    vaultId: VAULT_ID,
    bridge: {
      enabled: bridgeState.enabled,
      intervalHours: bridgeState.intervalHours,
      clearUnclaimedOnSweep: bridgeState.clearUnclaimedOnSweep,
      vaultSharePercent: VAULT_SHARE * 100,
      lastSweepTs: bridgeState.lastSweepTs,
      nextSweepTs: bridgeState.nextSweepTs,
      sweepCount: bridgeState.sweepCount,
      totalSweptAllTimeUSD: bridgeState.totalSweptAllTime,
      currentVaultBalanceUSD: VAULT_BASE_USD + bridgeState.totalSweptAllTime,
    },
    pending: {
      totalUnclaimedUSD: parseFloat(totalPending.toFixed(2)),
      projectedVaultReceipt: parseFloat((totalPending * VAULT_SHARE).toFixed(2)),
      projectedRegionalRetention: parseFloat((totalPending * (1 - VAULT_SHARE)).toFixed(2)),
      shipCount: snapshot.length,
    },
    history: bridgeState.history.slice(0, 50),
    cronEndpoint: "/api/cron/vault-sweep",
    cronSchedule: `every ${bridgeState.intervalHours}h`,
  });
}

// POST — update bridge configuration. Requires invariant key.
// Body: { invariantKey: [42,13,35,55], action: "enable"|"disable"|"configure",
//         intervalHours?: number, clearUnclaimedOnSweep?: boolean }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as {
      invariantKey?: unknown;
      action?: string;
      intervalHours?: number;
      clearUnclaimedOnSweep?: boolean;
    };

    if (!validateInvariant(body.invariantKey)) {
      return NextResponse.json(
        { error: "INVARIANT_BREACH: Required [42, 13, 35, 55]" },
        { status: 403 },
      );
    }

    const changed: string[] = [];

    if (body.action === "enable") {
      bridgeState.enabled = true;
      changed.push("enabled=true");
    } else if (body.action === "disable") {
      bridgeState.enabled = false;
      changed.push("enabled=false");
    }

    if (typeof body.intervalHours === "number" && body.intervalHours >= 1) {
      bridgeState.intervalHours = body.intervalHours;
      changed.push(`intervalHours=${body.intervalHours}`);
    }

    if (typeof body.clearUnclaimedOnSweep === "boolean") {
      bridgeState.clearUnclaimedOnSweep = body.clearUnclaimedOnSweep;
      changed.push(`clearUnclaimedOnSweep=${body.clearUnclaimedOnSweep}`);
    }

    return NextResponse.json({
      success: true,
      changed,
      bridge: {
        enabled: bridgeState.enabled,
        intervalHours: bridgeState.intervalHours,
        clearUnclaimedOnSweep: bridgeState.clearUnclaimedOnSweep,
        nextSweepTs: bridgeState.nextSweepTs,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
