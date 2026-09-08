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
  if (!res || !res.ok) return { ok: false, status: "NOT_FOUND", detail: "İşlem Bitcoin ağında bulunamadı." };

  const tx = await res.json();
  const matchingOutput = (tx.vout || []).find((o: { scriptpubkey_address?: string; value: number }) => o.scriptpubkey_address === expectedAddress);
  if (!matchingOutput) {
    return { ok: false, status: "NOT_FOUND", detail: "İşlem, beklenen kurumsal adrese ödeme içermiyor." };
  }

  const btcAmount = matchingOutput.value / 1e8;
  const statusRes = await fetch(`https://blockstream.info/api/tx/${txHash}/status`, { cache: "no-store" }).catch(() => null);
  const confirmed = statusRes && statusRes.ok ? (await statusRes.json()).confirmed : false;

  if (!confirmed) return { ok: false, status: "PENDING_CONFIRMATIONS", detail: "İşlem ağda görüldü ancak henüz onaylanmadı.", confirmations: 0 };
  if (btcAmount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Gönderilen tutar (${btcAmount} BTC) beklenen minimumun altında.` };

  return { ok: true, status: "CONFIRMED", detail: "Bitcoin işlemi zincir üzerinde doğrulandı.", confirmations: 3 };
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
      detail: `${apiKeyEnvVar} tanımlı değil — otomatik doğrulama yapılamıyor. Manuel inceleme kuyruğuna alındı.`,
    };
  }

  // Look up ERC-20 token transfers to our address and check whether this txHash appears with a sufficient amount.
  const url = `${explorerBase}?module=account&action=tokentx&address=${expectedAddress}&sort=desc&apikey=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return { ok: false, status: "UNVERIFIABLE", detail: "Blok gezgini API isteği başarısız oldu — manuel inceleme gerekli." };

  const data = await res.json();
  const transfers: Array<{ hash: string; value: string; tokenDecimal: string; confirmations: string }> = data.result || [];
  const match = transfers.find((t) => t.hash.toLowerCase() === txHash.toLowerCase());
  if (!match) return { ok: false, status: "NOT_FOUND", detail: "İşlem, beklenen adrese yapılan token transferleri arasında bulunamadı." };

  const decimals = parseInt(match.tokenDecimal || "6", 10);
  const amount = parseInt(match.value, 10) / 10 ** decimals;
  const confirmations = parseInt(match.confirmations || "0", 10);

  if (amount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Gönderilen tutar (${amount}) beklenen minimumun altında.` };
  if (confirmations < 12) return { ok: false, status: "PENDING_CONFIRMATIONS", detail: `Yalnızca ${confirmations} onay var, en az 12 gerekli.`, confirmations };

  return { ok: true, status: "CONFIRMED", detail: "Token transferi zincir üzerinde doğrulandı.", confirmations };
}

async function verifyTron(txHash: string, expectedAddress: string, expectedMinAmount: number): Promise<VerifyTxResult> {
  const apiKey = process.env.TRONGRID_API_KEY;
  const headers: Record<string, string> = apiKey ? { "TRON-PRO-API-KEY": apiKey } : {};

  const res = await fetch(`https://api.trongrid.io/v1/accounts/${expectedAddress}/transactions/trc20?limit=50`, {
    headers,
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return { ok: false, status: "UNVERIFIABLE", detail: "TronGrid API isteği başarısız oldu — manuel inceleme gerekli." };

  const data = await res.json();
  const transfers: Array<{ transaction_id: string; value: string; token_info: { decimals: number } }> = data.data || [];
  const match = transfers.find((t) => t.transaction_id === txHash);
  if (!match) return { ok: false, status: "NOT_FOUND", detail: "İşlem, beklenen adrese yapılan TRC-20 transferleri arasında bulunamadı." };

  const amount = parseInt(match.value, 10) / 10 ** (match.token_info?.decimals ?? 6);
  if (amount < expectedMinAmount) return { ok: false, status: "AMOUNT_MISMATCH", detail: `Gönderilen tutar (${amount}) beklenen minimumun altında.` };

  return { ok: true, status: "CONFIRMED", detail: "TRC-20 işlemi zincir üzerinde doğrulandı." };
}

export async function verifyOnChainTransaction(params: VerifyTxParams): Promise<VerifyTxResult> {
  const { networkId, txHash, expectedAddress, expectedMinAmount } = params;

  if (!validateFormat(networkId, txHash)) {
    return { ok: false, status: "INVALID_FORMAT", detail: "İşlem kodu (TXID) formatı geçersiz." };
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
        return { ok: false, status: "UNVERIFIABLE", detail: "Desteklenmeyen ağ." };
    }
  } catch {
    return { ok: false, status: "UNVERIFIABLE", detail: "Doğrulama sırasında beklenmeyen bir hata oluştu — manuel inceleme gerekli." };
  }
}
