import { NextRequest, NextResponse } from "next/server";
import { poolState } from "@/lib/mining/pool-state";

/**
 * GET /api/mining/pool
 * Returns aggregate pool statistics for the frontend dashboard.
 */
export async function GET() {
  const stats = poolState.getStats();
  return NextResponse.json({
    ok: true,
    stats,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/mining/pool
 * Body: { action: "register" | "heartbeat" | "disconnect", ...payload }
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  // ── REGISTER ──────────────────────────────────────────────────────────────
  if (action === "register") {
    const { deviceId, userId, walletAddress, os, gpuModel, gpuVramGB, ramGB, hashRateMHs, region, electricityCapEur } = body;
    if (!deviceId || !userId || !os || !gpuModel) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    if ((gpuVramGB as number) < 4) {
      return NextResponse.json({ ok: false, error: "Minimum 4 GB VRAM required for DePIN mining" }, { status: 422 });
    }

    const device = poolState.register({
      deviceId: String(deviceId),
      userId: String(userId),
      walletAddress: walletAddress ? String(walletAddress) : undefined,
      os: os as "windows" | "mac" | "linux",
      gpuModel: String(gpuModel),
      gpuVramGB: Number(gpuVramGB) || 0,
      ramGB: Number(ramGB) || 8,
      hashRateMHs: Number(hashRateMHs) || 0,
      region: String(region || "GLOBAL"),
      electricityCapEur: electricityCapEur ? Number(electricityCapEur) : undefined,
    });

    return NextResponse.json({
      ok: true,
      device,
      message: `Device registered. Mining ${device.region === "DE" ? "smart schedule (14h/day off-peak)" : "maximum intensity"}.`,
    });
  }

  // ── HEARTBEAT ─────────────────────────────────────────────────────────────
  if (action === "heartbeat") {
    const { deviceId, userId, hashRateMHs, gpuTempC, powerWatts, sessionSeconds, region } = body;
    if (!deviceId || !userId) {
      return NextResponse.json({ ok: false, error: "Missing deviceId or userId" }, { status: 400 });
    }

    const result = poolState.heartbeat({
      deviceId: String(deviceId),
      userId: String(userId),
      hashRateMHs: Number(hashRateMHs) || 0,
      gpuTempC: Number(gpuTempC) || 0,
      powerWatts: Number(powerWatts) || 0,
      sessionSeconds: Number(sessionSeconds) || 0,
      region: String(region || "GLOBAL"),
    });

    if (!result.device) {
      return NextResponse.json({ ok: false, error: "Device not registered. Call register first." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      earnedThisTick: result.earnedThisTick,
      sessionTotal: result.device.sessionEarningsNUR,
      allTimeTotal: result.device.totalEarningsNUR,
      status: result.device.status,
    });
  }

  // ── DISCONNECT ────────────────────────────────────────────────────────────
  if (action === "disconnect") {
    const { deviceId } = body;
    if (!deviceId) return NextResponse.json({ ok: false, error: "Missing deviceId" }, { status: 400 });
    poolState.markOffline(String(deviceId));
    return NextResponse.json({ ok: true, message: "Device marked offline." });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
