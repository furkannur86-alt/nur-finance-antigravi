/**
 * NUR Finance - Sovereign Multi-Wallet & Financial Reserve Infrastructure
 * Desktop App Only Config & Settlement Provider
 *
 * Safe & Restricted Access Architecture:
 * - Desktop App (This Machine): Connected directly to Furkan Sovereign Institutional Wallets & Real Exchange APIs.
 * - Customer / Web App: Connected strictly to Non-Custodial Client Settlement Gateways (User's own wallets).
 */

export interface SovereignWalletConfig {
  walletName: string;
  network: string;
  address: string;
  type: "COLD_RESERVE" | "HOT_LIQUIDITY" | "SOVEREIGN_TREASURY";
  balanceUsdtEquivalent: number;
}

export const FURKAN_SOVEREIGN_RESERVES: SovereignWalletConfig[] = [
  {
    walletName: "Furkan Sovereign Treasury Cold Reserve",
    network: "Ethereum (ERC-20)",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    type: "COLD_RESERVE",
    balanceUsdtEquivalent: 25000000,
  },
  {
    walletName: "NUR Finance Institutional Liquidity Pool",
    network: "Polygon / Arbitrum L2",
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    type: "HOT_LIQUIDITY",
    balanceUsdtEquivalent: 8500000,
  },
  {
    walletName: "Tatar Finans Shadow Reserve Vault",
    network: "Bitcoin Native (SegWit)",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    type: "SOVEREIGN_TREASURY",
    balanceUsdtEquivalent: 14200000,
  },
];

export function isDesktopApp(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.userAgent.toLowerCase().includes("electron");
}
