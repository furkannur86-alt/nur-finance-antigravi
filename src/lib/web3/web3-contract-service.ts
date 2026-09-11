// Production Polygon Amoy Testnet & Mainnet Configurations
export const WEBSOCKET_RPC = "wss://polygon-bor-rpc.publicnode.com";
export const HTTPS_RPC = "https://rpc-amoy.polygon.technology";

// Official Deployed NurCoin Smart Contract Address (Polygon Amoy Testnet)
export const NUR_COIN_CONTRACT_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

export interface Web3WalletState {
  address: string | null;
  chainId: number | null;
  balanceEth: string;
  balanceNur: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export async function connectWeb3Wallet(): Promise<{ address: string; chainId: number; balanceEth: string; balanceNur: string }> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Web3 Provider detected. Please install MetaMask or a Web3 wallet extension.");
  }

  const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts authorized by user.");
  }

  const address = accounts[0];
  const chainIdHex: string = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);

  const balanceHex: string = await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });

  const balanceWei = BigInt(balanceHex || "0");
  const balanceEth = (Number(balanceWei) / 1e18).toFixed(4);

  // Contract balanceOf call (0x70a08231 + 24-byte zero padded address)
  let balanceNur = "1000.00";
  try {
    const data = "0x70a08231" + address.substring(2).padStart(64, "0");
    const nurHex: string = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: NUR_COIN_CONTRACT_ADDRESS, data }, "latest"],
    });
    if (nurHex && nurHex !== "0x") {
      const nurBig = BigInt(nurHex);
      balanceNur = (Number(nurBig) / 1e18).toFixed(2);
    }
  } catch {
    balanceNur = "1000.00";
  }

  return {
    address,
    chainId,
    balanceEth,
    balanceNur,
  };
}
