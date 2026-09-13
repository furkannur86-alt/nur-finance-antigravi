// Umay Sovereign Vault Bridge — shared singleton state.
// Tracks auto-sweep schedule, sweep ledger, and bridge configuration.

export const VAULT_BASE_USD = 840_400_000_000; // $840.40B sovereign base
export const VAULT_SHARE    = 0.95;            // 95% to Umay vault
export const VAULT_ID       = "54751113";
export const INVARIANT      = [42, 13, 35, 55];

export type SweepTrigger = "cron" | "manual" | "api";

export interface SweepRecord {
  id: string;
  ts: string;
  trigger: SweepTrigger;
  shipCount: number;
  totalUnswept: number;
  sweptToVault: number;
  retainedRegional: number;
  newVaultBalance: number;
  durationMs: number;
}

interface BridgeState {
  enabled: boolean;
  intervalHours: number;
  clearUnclaimedOnSweep: boolean;
  lastSweepTs: string | null;
  nextSweepTs: string | null;
  totalSweptAllTime: number;
  sweepCount: number;
  history: SweepRecord[];
}

function addHours(iso: string, h: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + h);
  return d.toISOString();
}

const SEED_TS = "2026-09-13T10:00:00.000Z";

export const bridgeState: BridgeState = {
  enabled: true,
  intervalHours: 6,
  clearUnclaimedOnSweep: true,
  lastSweepTs: SEED_TS,
  nextSweepTs: addHours(SEED_TS, 6),
  totalSweptAllTime: 42_850_900,
  sweepCount: 14,
  history: [
    {
      id: "sweep-seed-014",
      ts: SEED_TS,
      trigger: "cron",
      shipCount: 36,
      totalUnswept: 450_321.42,
      sweptToVault: 427_805.35,
      retainedRegional: 22_516.07,
      newVaultBalance: VAULT_BASE_USD + 42_850_900,
      durationMs: 138,
    },
  ],
};

export function recordSweep(entry: Omit<SweepRecord, "id">): SweepRecord {
  const record: SweepRecord = { id: `sweep-${Date.now()}`, ...entry };
  bridgeState.history.unshift(record);
  if (bridgeState.history.length > 200) bridgeState.history.length = 200;
  bridgeState.totalSweptAllTime += record.sweptToVault;
  bridgeState.sweepCount += 1;
  bridgeState.lastSweepTs = record.ts;
  bridgeState.nextSweepTs = addHours(record.ts, bridgeState.intervalHours);
  return record;
}

export function validateInvariant(key: unknown): boolean {
  if (!Array.isArray(key) || key.length !== 4) return false;
  return INVARIANT.every((v, i) => v === key[i]);
}
