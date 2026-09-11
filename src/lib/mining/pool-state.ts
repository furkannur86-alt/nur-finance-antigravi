/**
 * NUR Finance DePIN Mining Pool State
 * In-memory coordinator for compute-for-access.
 * Production: replace with Redis + PostgreSQL.
 */

export type DeviceOS = "windows" | "mac" | "linux";
export type MiningStatus = "active" | "idle" | "offline" | "suspended";

export interface RegisteredDevice {
  deviceId: string;           // SHA-256(hardwareFingerprint + userId)
  userId: string;             // Supabase user UUID
  walletAddress?: string;     // EVM wallet for on-chain NUR payouts
  os: DeviceOS;
  gpuModel: string;
  gpuVramGB: number;
  ramGB: number;
  hashRateMHs: number;        // Estimated ETH-equivalent MH/s
  registeredAt: number;
  lastHeartbeat: number;
  status: MiningStatus;
  region: string;             // DE, TR, US, GB, GLOBAL
  sessionEarningsNUR: number; // This session, in NUR (1e18 decimals omitted — stored as float)
  totalEarningsNUR: number;
  totalSessionSeconds: number;
  electricityCapEur?: number; // For DE smart-cap
}

export interface HeartbeatPayload {
  deviceId: string;
  userId: string;
  hashRateMHs: number;
  gpuTempC: number;
  powerWatts: number;
  sessionSeconds: number;
  region: string;
}

export interface PoolStats {
  activeDevices: number;
  totalHashRateMHs: number;
  totalEarningsNUR: number;
  totalDevicesAllTime: number;
  regionBreakdown: Record<string, number>;
  rewardsDistributed24h: number;
}

// ─── In-memory store (replace with Redis in production) ──────────────────────

const devices = new Map<string, RegisteredDevice>();

// NUR rewards per MH/s per second
// At 14 MH/s for 14h/day → ~€10/month → if NUR = €0.10 → 100 NUR/month
// 100 NUR / (14 * 3600 * 30) = ~6.6e-5 NUR/s per MH/s unit
const NUR_PER_MHS_PER_SEC = 6.614e-5;

export const poolState = {
  devices,

  register(device: Omit<RegisteredDevice, "registeredAt" | "lastHeartbeat" | "status" | "sessionEarningsNUR" | "totalEarningsNUR" | "totalSessionSeconds">): RegisteredDevice {
    const existing = devices.get(device.deviceId);
    const now = Date.now();
    const record: RegisteredDevice = {
      ...device,
      registeredAt: existing?.registeredAt ?? now,
      lastHeartbeat: now,
      status: "active",
      sessionEarningsNUR: 0,
      totalEarningsNUR: existing?.totalEarningsNUR ?? 0,
      totalSessionSeconds: existing?.totalSessionSeconds ?? 0,
    };
    devices.set(device.deviceId, record);
    return record;
  },

  heartbeat(payload: HeartbeatPayload): { earnedThisTick: number; device: RegisteredDevice | null } {
    const device = devices.get(payload.deviceId);
    if (!device) return { earnedThisTick: 0, device: null };

    const now = Date.now();
    const tickSeconds = Math.min((now - device.lastHeartbeat) / 1000, 60); // cap at 60s
    const earnedThisTick = payload.hashRateMHs * NUR_PER_MHS_PER_SEC * tickSeconds;

    device.lastHeartbeat = now;
    device.status = "active";
    device.hashRateMHs = payload.hashRateMHs;
    device.sessionEarningsNUR += earnedThisTick;
    device.totalEarningsNUR += earnedThisTick;
    device.totalSessionSeconds += tickSeconds;
    device.region = payload.region;

    return { earnedThisTick, device };
  },

  getStats(): PoolStats {
    const now = Date.now();
    const ONLINE_THRESHOLD = 120_000; // 2 minutes
    let activeDevices = 0;
    let totalHashRateMHs = 0;
    let totalEarningsNUR = 0;
    const regionBreakdown: Record<string, number> = {};

    for (const d of devices.values()) {
      totalEarningsNUR += d.totalEarningsNUR;
      if (now - d.lastHeartbeat < ONLINE_THRESHOLD) {
        activeDevices++;
        totalHashRateMHs += d.hashRateMHs;
        regionBreakdown[d.region] = (regionBreakdown[d.region] ?? 0) + 1;
      }
    }

    return {
      activeDevices,
      totalHashRateMHs,
      totalEarningsNUR,
      totalDevicesAllTime: devices.size,
      regionBreakdown,
      rewardsDistributed24h: totalEarningsNUR * 0.1, // approximation
    };
  },

  getDevice(deviceId: string): RegisteredDevice | undefined {
    return devices.get(deviceId);
  },

  getUserDevices(userId: string): RegisteredDevice[] {
    return [...devices.values()].filter(d => d.userId === userId);
  },

  markOffline(deviceId: string) {
    const d = devices.get(deviceId);
    if (d) d.status = "offline";
  },

  // Prune devices offline > 24h from active memory
  prune() {
    const cutoff = Date.now() - 86_400_000;
    for (const [id, d] of devices.entries()) {
      if (d.lastHeartbeat < cutoff && d.status === "offline") {
        devices.delete(id);
      }
    }
  },
};
