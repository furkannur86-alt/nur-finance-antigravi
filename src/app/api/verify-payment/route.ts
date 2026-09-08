import { NextRequest, NextResponse } from "next/server";
import { verifyOnChainTransaction, type OnChainNetworkId } from "@/lib/verification/onchain";

const VALID_NETWORKS: OnChainNetworkId[] = ["eth-usdt", "polygon-usdc", "arbitrum-usdc", "tron-usdt", "btc-native"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, status: "INVALID_FORMAT", detail: "Geçersiz istek gövdesi." }, { status: 400 });

  const { networkId, txHash, expectedAddress, expectedMinAmount } = body;

  if (!VALID_NETWORKS.includes(networkId) || typeof txHash !== "string" || typeof expectedAddress !== "string" || typeof expectedMinAmount !== "number") {
    return NextResponse.json({ ok: false, status: "INVALID_FORMAT", detail: "Eksik veya geçersiz parametreler." }, { status: 400 });
  }

  const result = await verifyOnChainTransaction({ networkId, txHash, expectedAddress, expectedMinAmount });
  return NextResponse.json(result);
}
