/**
 * NUR Finance GPU Mining Worker — Node.js child process
 *
 * Spawned by electron/main.ts via child_process.fork().
 * Runs independently of the renderer: survives window close/hide.
 *
 * What it does:
 *   1. Registers this device with the NUR Finance mining pool API
 *   2. Sends heartbeats every HEARTBEAT_INTERVAL_MS
 *   3. Reports earnings back to main process via IPC messages
 *   4. Gracefully stops when it receives a { type: "stop" } message
 *
 * GPU detection uses the 'gpu-info' npm package (optional).
 * Hash-rate estimation is based on VRAM tier (see VRAM_HASHRATE table).
 *
 * In production, replace the simulated hashrate with actual GPU compute:
 *   - OpenCL via 'node-opencl' (cross-platform)
 *   - CUDA via native addon (NVIDIA)
 *   - Metal via native addon (Apple Silicon)
 */

import https from "https";
import os from "os";
import { createHash } from "crypto";

// ─── Config ───────────────────────────────────────────────────────────────────

const POOL_API_URL        = process.env.NUR_POOL_URL  || "https://nur.finance/api/mining/pool";
const USER_ID             = process.env.MINING_USER_ID || "anonymous";
const WALLET_ADDR         = process.env.MINING_WALLET_ADDR || "";
const HEARTBEAT_INTERVAL  = 30_000;    // 30s
const REGION              = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[0].toUpperCase() || "GLOBAL";

// ─── GPU Detection ────────────────────────────────────────────────────────────

interface GpuInfo {
  model:     string;
  vramGB:    number;
  hashRateMHs: number;
}

// VRAM → estimated ETH-equivalent MH/s (conservative)
const VRAM_HASHRATE: [number, number][] = [
  [24, 95],   // RTX 4090 / A5000
  [16, 60],   // RTX 3090 / RTX 4080
  [12, 40],   // RTX 3080 12GB
  [10, 30],   // RTX 3080 10GB / RX 6800 XT
  [8,  20],   // RTX 3070 / RX 6700 XT / M2 Pro (est.)
  [6,  14],   // RTX 3060 / RX 6600 XT
  [4,   8],   // GTX 1660 / RX 580 4GB
  [0,   4],   // Minimum / integrated
];

function estimateHashRate(vramGB: number): number {
  for (const [minVram, rate] of VRAM_HASHRATE) {
    if (vramGB >= minVram) return rate;
  }
  return 4;
}

function detectGpu(): GpuInfo {
  // Try to read from environment (Electron passes GPU info from app.getGPUInfo)
  const envModel = process.env.GPU_MODEL;
  const envVram  = parseFloat(process.env.GPU_VRAM_GB || "0");

  if (envModel && envVram > 0) {
    return { model: envModel, vramGB: envVram, hashRateMHs: estimateHashRate(envVram) };
  }

  // Fallback: use total RAM as a rough proxy (Apple Silicon unified memory)
  const ramGB = os.totalmem() / 1024 ** 3;
  const vramGB = Math.min(Math.floor(ramGB / 4), 8);  // assume up to 8GB GPU

  return {
    model: `${os.arch()} (detected)`,
    vramGB,
    hashRateMHs: estimateHashRate(vramGB),
  };
}

// ─── Device fingerprint ───────────────────────────────────────────────────────

function buildDeviceId(): string {
  const hostname = os.hostname();
  const cpus     = os.cpus()[0]?.model ?? "unknown";
  const mac      = Object.values(os.networkInterfaces())
    .flat()
    .find(n => n && !n.internal && n.mac !== "00:00:00:00:00:00")?.mac ?? "no-mac";

  return createHash("sha256")
    .update(`${USER_ID}:${hostname}:${cpus}:${mac}`)
    .digest("hex")
    .slice(0, 32);
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function apiPost(path: string, body: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const url = new URL(path, POOL_API_URL.replace(/\/api\/mining\/pool$/, ""));
    const opts = {
      hostname: url.hostname,
      path:     url.pathname + url.search,
      method:   "POST",
      headers:  {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "User-Agent": "NURFinanceDesktop/1.0",
      },
    };

    const req = https.request(opts, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Invalid JSON from API: ${data.slice(0, 200)}`)); }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ─── Worker state ─────────────────────────────────────────────────────────────

interface MiningState {
  deviceId:          string;
  sessionStartMs:    number;
  sessionEarningsNUR: number;
  totalEarningsNUR:  number;
  hashRateMHs:       number;
  ticks:             number;
  registered:        boolean;
  stopped:           boolean;
}

const state: MiningState = {
  deviceId:           buildDeviceId(),
  sessionStartMs:     Date.now(),
  sessionEarningsNUR: 0,
  totalEarningsNUR:   0,
  hashRateMHs:        0,
  ticks:              0,
  registered:         false,
  stopped:            false,
};

function send(type: string, payload: unknown) {
  if (process.send) {
    process.send({ type, ...payload });
  }
}

// ─── Registration ─────────────────────────────────────────────────────────────

async function register(gpu: GpuInfo): Promise<boolean> {
  const osName = process.platform === "win32" ? "windows"
    : process.platform === "darwin" ? "mac" : "linux";

  try {
    const resp = await apiPost("/api/mining/pool", {
      action:       "register",
      deviceId:     state.deviceId,
      userId:       USER_ID,
      walletAddress: WALLET_ADDR || undefined,
      os:           osName,
      gpuModel:     gpu.model,
      gpuVramGB:    gpu.vramGB,
      ramGB:        Math.round(os.totalmem() / 1024 ** 3),
      hashRateMHs:  gpu.hashRateMHs,
      region:       REGION,
    }) as { ok: boolean; device?: { region: string } };

    if (resp.ok) {
      console.log(`[GPU-WORKER] Registered device ${state.deviceId.slice(0, 8)}... region=${resp.device?.region ?? REGION}`);
      return true;
    }
    console.warn("[GPU-WORKER] Registration failed:", JSON.stringify(resp));
    return false;
  } catch (err) {
    console.error("[GPU-WORKER] Registration error:", (err as Error).message);
    return false;
  }
}

// ─── Heartbeat ────────────────────────────────────────────────────────────────

async function heartbeat(gpu: GpuInfo): Promise<void> {
  const sessionSeconds = Math.round((Date.now() - state.sessionStartMs) / 1000);

  // Simulate GPU temperature and power draw (replace with native GPU APIs)
  const gpuTempC  = 55 + Math.random() * 20;        // 55–75°C
  const powerWatts = gpu.hashRateMHs * 5 + Math.random() * 20; // rough estimate

  try {
    const resp = await apiPost("/api/mining/pool", {
      action:        "heartbeat",
      deviceId:      state.deviceId,
      userId:        USER_ID,
      hashRateMHs:   gpu.hashRateMHs,
      gpuTempC,
      powerWatts,
      sessionSeconds,
      region:        REGION,
    }) as {
      ok: boolean;
      earnedThisTick?: number;
      sessionTotal?: number;
      allTimeTotal?: number;
    };

    if (resp.ok) {
      const earned = resp.earnedThisTick ?? 0;
      state.sessionEarningsNUR += earned;
      state.totalEarningsNUR    = resp.allTimeTotal ?? state.totalEarningsNUR + earned;
      state.ticks++;

      send("tick", {
        earnedThisTick:     earned,
        sessionEarningsNUR: resp.sessionTotal ?? state.sessionEarningsNUR,
        totalEarningsNUR:   state.totalEarningsNUR,
        hashRateMHs:        gpu.hashRateMHs,
        gpuTempC:           Math.round(gpuTempC),
        powerWatts:         Math.round(powerWatts),
        sessionSeconds,
        ticks:              state.ticks,
        deviceId:           state.deviceId,
      });
    }
  } catch (err) {
    console.warn("[GPU-WORKER] Heartbeat error:", (err as Error).message);
  }
}

// ─── Stop signal ─────────────────────────────────────────────────────────────

process.on("message", async (msg: unknown) => {
  const m = msg as { type: string };
  if (m.type === "stop") {
    state.stopped = true;
    try {
      await apiPost("/api/mining/pool", { action: "disconnect", deviceId: state.deviceId });
    } catch { /* noop */ }
    console.log("[GPU-WORKER] Gracefully stopped");
    process.exit(0);
  }
});

// ─── Main loop ────────────────────────────────────────────────────────────────

async function main() {
  console.log("[GPU-WORKER] Starting NUR Finance DePIN mining worker");
  console.log(`[GPU-WORKER] User: ${USER_ID}`);
  console.log(`[GPU-WORKER] Device: ${state.deviceId.slice(0, 8)}...`);
  console.log(`[GPU-WORKER] Region: ${REGION}`);
  console.log(`[GPU-WORKER] Heartbeat: every ${HEARTBEAT_INTERVAL / 1000}s`);

  const gpu = detectGpu();
  console.log(`[GPU-WORKER] GPU: ${gpu.model} (${gpu.vramGB}GB VRAM, ~${gpu.hashRateMHs}MH/s)`);

  state.hashRateMHs = gpu.hashRateMHs;

  if (gpu.vramGB < 4) {
    console.warn("[GPU-WORKER] WARNING: GPU has < 4GB VRAM — pool requires minimum 4GB");
    send("mining-error", { message: "Minimum 4GB VRAM required for DePIN mining" });
    process.exit(1);
  }

  // Register with pool
  state.registered = await register(gpu);

  // Send initial stats
  send("stats", {
    deviceId:    state.deviceId,
    gpuModel:    gpu.model,
    gpuVramGB:   gpu.vramGB,
    hashRateMHs: gpu.hashRateMHs,
    region:      REGION,
    registered:  state.registered,
    nurPerHour:  gpu.hashRateMHs * 6.614e-5 * 3600,  // estimate
  });

  // Heartbeat loop
  while (!state.stopped) {
    await new Promise(r => setTimeout(r, HEARTBEAT_INTERVAL));
    if (state.stopped) break;
    await heartbeat(gpu);
  }
}

main().catch(err => {
  console.error("[GPU-WORKER] Fatal:", err.message);
  process.exit(1);
});
