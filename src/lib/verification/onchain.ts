export type OnChainNetworkId = "eth-usdt" | "polygon-usdc" | "arbitrum-usdc" | "tron-usdt" | "btc-native";

export interface VerificationResult {
  ok: boolean;
  status: string;
  detail?: string;
}

export async function verifyOnChainTransaction(
  _networkId: OnChainNetworkId,
  _txHash: string,
  _expectedAddress: string,
  _expectedMinAmount: number,
): Promise<VerificationResult> {
  return { ok: false, status: "NOT_IMPLEMENTED", detail: "On-chain verification is not available." };
}
