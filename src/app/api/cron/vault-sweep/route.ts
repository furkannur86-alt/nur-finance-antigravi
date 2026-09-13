import { NextResponse } from "next/server";
import {
  bridgeState,
  recordSweep,
  validateInvariant,
  VAULT_BASE_USD,
  VAULT_SHARE,
  VAULT_ID,
  SweepTrigger,
} from "@/lib/sovereign/vaultBridgeState";
import {
  getFleetSnapshot,
  clearUnclaimedAfterSweep,
} from "@/lib/sovereign/fleetMiningState";

export const dynamic = "force-dynamic";

// Called by Vercel Cron (GET) or the bridge control panel (POST with invariant).
// Vercel Cron sends: GET /api/cron/vault-sweep with Authorization: Bearer $CRON_SECRET.

function runSweep(trigger: SweepTrigger) {
  const t0 = Date.now();
  const snapshot = getFleetSnapshot();
  const totalUnswept = snapshot.reduce((acc, s) => acc + s.unclaimedTokens, 0);
  const sweptToVault = parseFloat((totalUnswept * VAULT_SHARE).toFixed(2));
  const retainedRegional = parseFloat((totalUnswept * (1 - VAULT_SHARE)).toFixed(2));

  if (bridgeState.clearUnclaimedOnSweep) {
    clearUnclaimedAfterSweep();
  }

  const newVaultBalance = VAULT_BASE_USD + bridgeState.totalSweptAllTime + sweptToVault;
  const record = recordSweep({
    ts: new Date().toISOString(),
    trigger,
    shipCount: snapshot.length,
    totalUnswept,
    sweptToVault,
    retainedRegional,
    newVaultBalance,
    durationMs: Date.now() - t0,
  });

  return { record, newVaultBalance };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  const expected = process.env.CRON_SECRET;

  if (expected && token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!bridgeState.enabled) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "auto-sweep disabled",
      nextAttempt: bridgeState.nextSweepTs,
    });
  }

  const { record, newVaultBalance } = runSweep("cron");

  return NextResponse.json({
    success: true,
    vaultId: VAULT_ID,
    receipt: record,
    vaultBalanceUSD: newVaultBalance,
    nextSweepTs: bridgeState.nextSweepTs,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { invariantKey } = body as { invariantKey?: unknown };

    if (!validateInvariant(invariantKey)) {
      return NextResponse.json(
        { error: "INVARIANT_BREACH: Required [42, 13, 35, 55]" },
        { status: 403 },
      );
    }

    const { record, newVaultBalance } = runSweep("manual");

    return NextResponse.json({
      success: true,
      vaultId: VAULT_ID,
      receipt: record,
      vaultBalanceUSD: newVaultBalance,
      nextSweepTs: bridgeState.nextSweepTs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
