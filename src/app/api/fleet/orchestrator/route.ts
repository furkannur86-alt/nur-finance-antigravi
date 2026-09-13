import { NextRequest, NextResponse } from "next/server";

// Master Fleet Remote Orchestrator & Configuration Engine
// Allows the Central Umay Gül Nur Master Bridge to configure regional ships and terminals remotely.

interface FleetRemoteConfig {
  globalMiningEnabled: boolean;
  masterVaultSweepRatio: number; // e.g. 0.95 = 95% to master vault, 5% local worker incentive
  hftArbitrageEnabled: boolean;
  neuralSpeechEnabled: boolean;
  breakingNewsOverride: string | null;
  shipsConfig: Record<string, {
    miningActive: boolean;
    orderRoutingActive: boolean;
    customTickerAlert: string | null;
    difficultyMultiplier: number;
  }>;
}

let activeFleetConfig: FleetRemoteConfig = {
  globalMiningEnabled: true,
  masterVaultSweepRatio: 0.95,
  hftArbitrageEnabled: true,
  neuralSpeechEnabled: true,
  breakingNewsOverride: "NUR 2126: $840.4B SOVEREIGN TREASURY SYNCHRONIZATION ACTIVE ACROSS ALL 18 CIVILIZATIONS",
  shipsConfig: {}
};

export async function GET() {
  return NextResponse.json({
    success: true,
    masterAuthority: "UMAY_GUL_NUR_ROOT_CONSOLE",
    vaultTarget: "54751113",
    config: activeFleetConfig,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ success: false, error: "CONFIG_PAYLOAD_REQUIRED" }, { status: 400 });
  }

  // Update in-memory configuration
  if (typeof body.globalMiningEnabled === "boolean") activeFleetConfig.globalMiningEnabled = body.globalMiningEnabled;
  if (typeof body.masterVaultSweepRatio === "number") activeFleetConfig.masterVaultSweepRatio = body.masterVaultSweepRatio;
  if (typeof body.hftArbitrageEnabled === "boolean") activeFleetConfig.hftArbitrageEnabled = body.hftArbitrageEnabled;
  if (typeof body.neuralSpeechEnabled === "boolean") activeFleetConfig.neuralSpeechEnabled = body.neuralSpeechEnabled;
  if (typeof body.breakingNewsOverride === "string" || body.breakingNewsOverride === null) {
    activeFleetConfig.breakingNewsOverride = body.breakingNewsOverride;
  }

  if (body.shipUpdate && body.shipUpdate.shipId) {
    const sId = body.shipUpdate.shipId;
    activeFleetConfig.shipsConfig[sId] = {
      ...(activeFleetConfig.shipsConfig[sId] || { miningActive: true, orderRoutingActive: true, customTickerAlert: null, difficultyMultiplier: 1.0 }),
      ...body.shipUpdate
    };
  }

  return NextResponse.json({
    success: true,
    message: "FLEET_REMOTE_CONFIG_PROPAGATED",
    config: activeFleetConfig,
    affectedShips: 36,
    propagatedAt: new Date().toISOString()
  });
}
