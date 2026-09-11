import { NextRequest, NextResponse } from "next/server";
import { poolState } from "@/lib/mining/pool-state";

/**
 * GET /api/mining/rewards?userId=xxx
 * Returns all devices and cumulative earnings for a user.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const deviceId = request.nextUrl.searchParams.get("deviceId");

  if (deviceId) {
    const device = poolState.getDevice(deviceId);
    if (!device) return NextResponse.json({ ok: false, error: "Device not found" }, { status: 404 });
    return NextResponse.json({ ok: true, device });
  }

  if (userId) {
    const devices = poolState.getUserDevices(userId);
    const totalNUR = devices.reduce((s, d) => s + d.totalEarningsNUR, 0);
    return NextResponse.json({ ok: true, devices, totalNUR, deviceCount: devices.length });
  }

  return NextResponse.json({ ok: false, error: "Provide userId or deviceId query param" }, { status: 400 });
}

/**
 * POST /api/mining/rewards
 * Sovereign admin: trigger batch on-chain NUR payout for a user's accumulated rewards.
 * In production: calls NurCoin.sol batchDistributeComputeRewards via ethers.js backend wallet.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { userId, deviceId, walletAddress } = body;
  if (!userId || !walletAddress) {
    return NextResponse.json({ ok: false, error: "Missing userId or walletAddress" }, { status: 400 });
  }

  const devices = deviceId
    ? [poolState.getDevice(String(deviceId))].filter(Boolean)
    : poolState.getUserDevices(String(userId));

  if (devices.length === 0) {
    return NextResponse.json({ ok: false, error: "No devices found" }, { status: 404 });
  }

  // In production: call NurCoin.sol via ethers.js here
  // const tx = await nurCoinContract.batchDistributeComputeRewards(
  //   deviceIds.map(id => ethers.keccak256(ethers.toUtf8Bytes(id))),
  //   users,
  //   amounts
  // );
  const totalNUR = devices.reduce((s, d) => s + (d?.sessionEarningsNUR ?? 0), 0);

  return NextResponse.json({
    ok: true,
    message: "On-chain payout queued (smart contract not yet deployed — testnet pending)",
    totalNUR,
    walletAddress,
    deviceCount: devices.length,
    note: "Deploy NurCoin.sol to Polygon mainnet and fund the compute pool wallet to enable real payouts.",
    contractAddress: process.env.NUR_COIN_CONTRACT_ADDRESS || "NOT_DEPLOYED",
  });
}
