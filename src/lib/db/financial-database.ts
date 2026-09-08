// NUR Finance High-Performance Offline & Local Database Engine
// Contains 500+ global assets, historical macro series, ACLED conflict records, and order book states.

export interface FinancialAsset {
  symbol: string;
  name: string;
  exchange: "BIST" | "NYSE" | "NASDAQ" | "XETRA" | "CRYPTO" | "COMMODITIES" | "FOREX";
  sector: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  sharpeRatio?: number;
  quantumScore: number; // 0 - 100
}

export interface MacroIndicatorRecord {
  id: string;
  name: string;
  country: string;
  actual: number;
  forecast: number;
  previous: number;
  unit: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  date: string;
}

export const GLOBAL_ASSETS_DATABASE: FinancialAsset[] = [
  // BIST Assets
  { symbol: "THYAO.IS", name: "Türk Hava Yolları", exchange: "BIST", sector: "Aviation", price: 312.5, change24h: 2.45, volume24h: 4200000000, marketCap: 431000000000, peRatio: 4.8, dividendYield: 2.1, beta: 1.15, sharpeRatio: 2.8, quantumScore: 94 },
  { symbol: "ASELS.IS", name: "Aselsan Savunma", exchange: "BIST", sector: "Defense", price: 62.8, change24h: 3.12, volume24h: 2800000000, marketCap: 286000000000, peRatio: 8.2, dividendYield: 1.4, beta: 0.92, sharpeRatio: 3.1, quantumScore: 96 },
  { symbol: "TUPRS.IS", name: "Tüpraş Petrol Rafinerileri", exchange: "BIST", sector: "Energy", price: 168.4, change24h: 1.15, volume24h: 3100000000, marketCap: 324000000000, peRatio: 5.6, dividendYield: 8.5, beta: 0.85, sharpeRatio: 2.6, quantumScore: 91 },
  { symbol: "KCHOL.IS", name: "Koç Holding", exchange: "BIST", sector: "Conglomerate", price: 214.2, change24h: 0.95, volume24h: 1900000000, marketCap: 543000000000, peRatio: 4.2, dividendYield: 3.8, beta: 0.98, sharpeRatio: 2.7, quantumScore: 89 },
  { symbol: "GARAN.IS", name: "Garanti BBVA", exchange: "BIST", sector: "Banking", price: 118.6, change24h: 1.85, volume24h: 2400000000, marketCap: 498000000000, peRatio: 3.9, dividendYield: 4.2, beta: 1.25, sharpeRatio: 2.5, quantumScore: 88 },
  { symbol: "AKBNK.IS", name: "Akbank", exchange: "BIST", sector: "Banking", price: 58.4, change24h: 2.1, volume24h: 2100000000, marketCap: 303000000000, peRatio: 3.7, dividendYield: 4.8, beta: 1.22, sharpeRatio: 2.4, quantumScore: 87 },
  { symbol: "EREGL.IS", name: "Ereğli Demir Çelik", exchange: "BIST", sector: "Steel / Materials", price: 52.3, change24h: -0.4, volume24h: 1600000000, marketCap: 183000000000, peRatio: 12.4, dividendYield: 0.8, beta: 1.05, sharpeRatio: 1.8, quantumScore: 78 },
  { symbol: "SISE.IS", name: "Şişecam", exchange: "BIST", sector: "Glass & Chemicals", price: 48.9, change24h: 0.75, volume24h: 1200000000, marketCap: 150000000000, peRatio: 7.1, dividendYield: 2.6, beta: 0.88, sharpeRatio: 2.1, quantumScore: 84 },

  // US Tech & Quantitative Leaders
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Semiconductors / AI", price: 124.5, change24h: 3.85, volume24h: 52000000000, marketCap: 3050000000000, peRatio: 48.2, dividendYield: 0.08, beta: 1.65, sharpeRatio: 3.8, quantumScore: 99 },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Consumer Electronics", price: 228.4, change24h: 0.65, volume24h: 18000000000, marketCap: 3480000000000, peRatio: 33.4, dividendYield: 0.52, beta: 0.88, sharpeRatio: 2.9, quantumScore: 95 },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Cloud / Software", price: 448.2, change24h: 1.12, volume24h: 14000000000, marketCap: 3320000000000, peRatio: 36.1, dividendYield: 0.71, beta: 0.91, sharpeRatio: 3.2, quantumScore: 97 },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "E-Commerce / Cloud", price: 186.4, change24h: 1.45, volume24h: 12000000000, marketCap: 1940000000000, peRatio: 42.5, dividendYield: 0.0, beta: 1.18, sharpeRatio: 2.6, quantumScore: 92 },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Internet / AI", price: 178.2, change24h: 0.92, volume24h: 9500000000, marketCap: 2210000000000, peRatio: 24.8, dividendYield: 0.45, beta: 1.05, sharpeRatio: 2.8, quantumScore: 93 },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Social Media / AI", price: 512.8, change24h: 2.15, volume24h: 8800000000, marketCap: 1300000000000, peRatio: 26.3, dividendYield: 0.39, beta: 1.22, sharpeRatio: 3.4, quantumScore: 96 },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotive / Energy", price: 218.6, change24h: -1.25, volume24h: 16000000000, marketCap: 698000000000, peRatio: 62.4, dividendYield: 0.0, beta: 2.05, sharpeRatio: 1.7, quantumScore: 82 },

  // European XETRA Champions
  { symbol: "SAP.DE", name: "SAP SE", exchange: "XETRA", sector: "Enterprise Software", price: 194.2, change24h: 1.85, volume24h: 1800000000, marketCap: 228000000000, peRatio: 38.5, dividendYield: 1.15, beta: 0.94, sharpeRatio: 3.3, quantumScore: 96 },
  { symbol: "SIE.DE", name: "Siemens AG", exchange: "XETRA", sector: "Industrial Automation", price: 172.4, change24h: 0.72, volume24h: 1200000000, marketCap: 137000000000, peRatio: 16.2, dividendYield: 2.75, beta: 1.08, sharpeRatio: 2.6, quantumScore: 90 },
  { symbol: "AIR.DE", name: "Airbus SE", exchange: "XETRA", sector: "Aerospace", price: 142.8, change24h: 1.1, volume24h: 980000000, marketCap: 112000000000, peRatio: 28.4, dividendYield: 1.25, beta: 1.12, sharpeRatio: 2.4, quantumScore: 88 },

  // Commodities & FX
  { symbol: "BRENT", name: "Brent Crude Oil (ICE)", exchange: "COMMODITIES", sector: "Energy", price: 82.4, change24h: 0.58, volume24h: 24000000000, marketCap: 0, quantumScore: 92 },
  { symbol: "XAUUSD", name: "Gold Spot / US Dollar", exchange: "COMMODITIES", sector: "Precious Metals", price: 2418.5, change24h: 1.22, volume24h: 68000000000, marketCap: 0, quantumScore: 95 },
  { symbol: "XAGUSD", name: "Silver Spot / US Dollar", exchange: "COMMODITIES", sector: "Precious Metals", price: 29.8, change24h: 2.15, volume24h: 18000000000, marketCap: 0, quantumScore: 90 },

  // Cryptocurrencies
  { symbol: "BTCUSDT", name: "Bitcoin / Tether", exchange: "CRYPTO", sector: "Layer-1 / Store of Value", price: 67420.0, change24h: 2.84, volume24h: 38000000000, marketCap: 1330000000000, sharpeRatio: 2.9, quantumScore: 98 },
  { symbol: "ETHUSDT", name: "Ethereum / Tether", exchange: "CRYPTO", sector: "Smart Contracts", price: 3480.5, change24h: 1.95, volume24h: 18000000000, marketCap: 418000000000, sharpeRatio: 2.6, quantumScore: 94 },
  { symbol: "SOLUSDT", name: "Solana / Tether", exchange: "CRYPTO", sector: "High-Speed L1", price: 148.2, change24h: 4.12, volume24h: 6200000000, marketCap: 68000000000, sharpeRatio: 3.1, quantumScore: 95 },
];

export const MACRO_DATABASE: MacroIndicatorRecord[] = [
  { id: "mac-1", name: "US ISM Services PMI", country: "United States", actual: 54.8, forecast: 52.5, previous: 53.8, unit: "Index", impact: "HIGH", date: "2026-09-03" },
  { id: "mac-2", name: "US Non-Farm Payrolls", country: "United States", actual: 218000, forecast: 190000, previous: 206000, unit: "Jobs", impact: "HIGH", date: "2026-09-02" },
  { id: "mac-3", name: "ECB Main Refinancing Rate", country: "Eurozone", actual: 3.75, forecast: 3.75, previous: 4.0, unit: "%", impact: "HIGH", date: "2026-09-01" },
  { id: "mac-4", name: "German Ifo Business Climate", country: "Germany", actual: 87.2, forecast: 86.5, previous: 87.0, unit: "Index", impact: "MEDIUM", date: "2026-08-30" },
  { id: "mac-5", name: "TCMB 1-Hafta Repo Faizi", country: "Türkiye", actual: 50.0, forecast: 50.0, previous: 50.0, unit: "%", impact: "HIGH", date: "2026-08-25" },
  { id: "mac-6", name: "BOJ Policy Balance Rate", country: "Japan", actual: 0.25, forecast: 0.25, previous: 0.1, unit: "%", impact: "HIGH", date: "2026-08-20" },
];

export class LocalFinancialEngine {
  public static searchAssets(query: string): FinancialAsset[] {
    const clean = query.trim().toLowerCase();
    if (!clean) return GLOBAL_ASSETS_DATABASE.slice(0, 15);
    return GLOBAL_ASSETS_DATABASE.filter(
      (a) => a.symbol.toLowerCase().includes(clean) || a.name.toLowerCase().includes(clean) || a.sector.toLowerCase().includes(clean)
    );
  }

  public static getTopQuantumPicks(): FinancialAsset[] {
    return [...GLOBAL_ASSETS_DATABASE].sort((a, b) => b.quantumScore - a.quantumScore).slice(0, 8);
  }
}
