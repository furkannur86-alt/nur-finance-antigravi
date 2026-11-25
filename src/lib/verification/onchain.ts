// Server-side on-chain transaction verification for the wallet settlement gateway.
// Every network calls a real public block-explorer API when a key is configured.
// If no key is configured for a network, we return UNVERIFIABLE rather than
// silently treating the payment as confirmed — the UI must route that to a
// manual-review queue, never to instant VERIFIED status.

export type OnChainNetworkId = "eth-usdt" | "polygon-usdc" | "arbitrum-usdc" | "tron-usdt" | "btc-native";

export interface VerifyTxParams {
  networkId: OnChainNetworkId;
  txHash: string;
  expectedAddress: string;
  expectedMinAmount: number;
}

export type VerifyTxStatus = "CONFIRMED" | "PENDING_CONFIRMATIONS" | "NOT_FOUND" | "AMOUNT_MISMATCH" | "INVALID_FORMAT" | "UNVERIFIABLE";

export interface VerifyTxResult {
  ok: boolean;
  status: VerifyTxStatus;
  detail: string;
  confirmations?: number;
}

const HEX64 = /^(0x)?[0-9a-fA-F]{64}$/;
const BTC_TXID = /^[0-9a-fA-F]{64}$/;

function validateFormat(networkId: OnChainNetworkId, txHash: string): boolean {
  if (networkId === "btc-native") return BTC_TXID.test(txHash.trim());
  return HEX64.test(txHash.trim());
}

async function verifyBitcoin(txHash: string, expectedAddress: string, expectedMinAmount: number): Promise<VerifyTxResult> {
  // Blockstream's public Esplora API — no key required.
  const res = await fetch(`https://blockstream.info/api/tx/${txHash}`, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return { ok: false, status: "NOT_FOUND", detail: "Transaction not found on the Bitcoin network." };

  const tx = await res.json();
  const matchingOutput = (tx.vout || []).find((o: { scriptpubkey_address?: string; value: number }) => o.scriptpubkey_address === expectedAddress);
  if (!matchingOutput) {
    return { ok: false, status: "NOT_FOUND", detail: "Transaction does not contain a payment to the expected institutional address." };
  }

  const btcAmount = matchingOutput.value / 1e8;
  const statusRes = await fetch(`https://blockstream.info/api/tx/${txHash}/status`, { cache: "no-store" }).catch(() => null);
  const confirmed = statusRes && statusRes.ok ? (await statusRes.json()).confirmed : false;

  if (!confirmed) return { ok: false, status: "PENDING_CONFIRMATIONS", detail: "Transaction seen on the network but not yet confirmed.", confirmations: 0 };
  if (btcAmount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Sent amount (${btcAmount} BTC) is below the expected minimum.` };

  return { ok: true, status: "CONFIRMED", detail: "Bitcoin transaction verified on-chain.", confirmations: 3 };
}

async function verifyEvmErc20(
  txHash: string,
  expectedAddress: string,
  expectedMinAmount: number,
  explorerBase: string,
  apiKeyEnvVar: string
): Promise<VerifyTxResult> {
  const apiKey = process.env[apiKeyEnvVar];
  if (!apiKey) {
    return {
      ok: false,
      status: "UNVERIFIABLE",
      detail: `${apiKeyEnvVar} is not defined — automatic verification unavailable. Queued for manual review.`,
    };
  }

  // Look up ERC-20 token transfers to our address and check whether this txHash appears with a sufficient amount.
  const url = `${explorerBase}?module=account&action=tokentx&address=${expectedAddress}&sort=desc&apikey=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return { ok: false, status: "UNVERIFIABLE", detail: "Block explorer API request failed — manual review required." };

  const data = await res.json();
  const transfers: Array<{ hash: string; value: string; tokenDecimal: string; confirmations: string }> = data.result || [];
  const match = transfers.find((t) => t.hash.toLowerCase() === txHash.toLowerCase());
  if (!match) return { ok: false, status: "NOT_FOUND", detail: "Transaction not found among token transfers to the expected address." };

  const decimals = parseInt(match.tokenDecimal || "6", 10);
  const amount = parseInt(match.value, 10) / 10 ** decimals;
  const confirmations = parseInt(match.confirmations || "0", 10);

  if (amount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Sent amount (${amount}) is below the expected minimum.` };
  if (confirmations < 12) return { ok: false, status: "PENDING_CONFIRMATIONS", detail: `Only ${confirmations} confirmations, minimum 12 required.`, confirmations };

  return { ok: true, status: "CONFIRMED", detail: "Token transfer verified on-chain.", confirmations };
}

async function verifyTron(txHash: string, expectedAddress: string, expectedMinAmount: number): Promise<VerifyTxResult> {
  const apiKey = process.env.TRONGRID_API_KEY;
  const headers: Record<string, string> = apiKey ? { "TRON-PRO-API-KEY": apiKey } : {};

  const res = await fetch(`https://api.trongrid.io/v1/accounts/${expectedAddress}/transactions/trc20?limit=50`, {
    headers,
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return { ok: false, status: "UNVERIFIABLE", detail: "TronGrid API request failed — manual review required." };

  const data = await res.json();
  const transfers: Array<{ transaction_id: string; value: string; token_info: { decimals: number } }> = data.data || [];
  const match = transfers.find((t) => t.transaction_id === txHash);
  if (!match) return { ok: false, status: "NOT_FOUND", detail: "Transaction not found among TRC-20 transfers to the expected address." };

  const amount = parseInt(match.value, 10) / 10 ** (match.token_info?.decimals ?? 6);
  if (amount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Sent amount (${amount}) is below the expected minimum.` };

  return { ok: true, status: "CONFIRMED", detail: "TRC-20 transaction verified on-chain." };
}

export async function verifyOnChainTransaction(params: VerifyTxParams): Promise<VerifyTxResult> {
  const { networkId, txHash, expectedAddress, expectedMinAmount } = params;

  if (!validateFormat(networkId, txHash)) {
    return { ok: false, status: "INVALID_FORMAT", detail: "Invalid transaction ID (TXID) format." };
  }

  try {
    switch (networkId) {
      case "btc-native":
        return await verifyBitcoin(txHash, expectedAddress, expectedMinAmount);
      case "eth-usdt":
        return await verifyEvmErc20(txHash, expectedAddress, expectedMinAmount, "https://api.etherscan.io/api", "ETHERSCAN_API_KEY");
      case "polygon-usdc":
        return await verifyEvmErc20(txHash, expectedAddress, expectedMinAmount, "https://api.polygonscan.com/api", "POLYGONSCAN_API_KEY");
      case "arbitrum-usdc":
        return await verifyEvmErc20(txHash, expectedAddress, expectedMinAmount, "https://api.arbiscan.io/api", "ARBISCAN_API_KEY");
      case "tron-usdt":
        return await verifyTron(txHash, expectedAddress, expectedMinAmount);
      default:
        return { ok: false, status: "UNVERIFIABLE", detail: "Unsupported network." };
    }
  } catch {
    return { ok: false, status: "UNVERIFIABLE", detail: "An unexpected error occurred during verification — manual review required." };
  }
}
