export interface WalletInfo {
  address: string;
  balance: number;
}

const STORAGE_KEY = "nur-wallet";

export function getStoredSovereignWallet(): WalletInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function generateSovereignWallet(): Promise<WalletInfo> {
  const wallet: WalletInfo = {
    address: "NUR-" + Math.random().toString(36).slice(2, 14).toUpperCase(),
    balance: 0,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  }
  return wallet;
}

export function updateSovereignWallet(updates: Partial<WalletInfo>): WalletInfo | null {
  const existing = getStoredSovereignWallet();
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
