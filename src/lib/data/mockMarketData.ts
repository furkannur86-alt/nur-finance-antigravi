import { PortfolioItem, ChartDataPoint } from "@/types";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generatePriceHistory(
  symbol: string,
  days: number,
  basePrice: number
): ChartDataPoint[] {
  const rand = seededRandom(symbol.charCodeAt(0) * 137 + symbol.length);
  const data: ChartDataPoint[] = [];
  let price = basePrice;

  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (rand() - 0.48) * basePrice * 0.03;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(price * 100) / 100,
    });
  }
  return data;
}

export function generatePortfolio(): PortfolioItem[] {
  const stocks: Array<{ symbol: string; name: string; base: number }> = [
    { symbol: "AAPL", name: "Apple Inc.", base: 198 },
    { symbol: "MSFT", name: "Microsoft Corp.", base: 425 },
    { symbol: "GOOGL", name: "Alphabet Inc.", base: 176 },
    { symbol: "AMZN", name: "Amazon.com Inc.", base: 185 },
    { symbol: "NVDA", name: "NVIDIA Corp.", base: 875 },
    { symbol: "TSLA", name: "Tesla Inc.", base: 248 },
    { symbol: "META", name: "Meta Platforms", base: 505 },
  ];

  const rand = seededRandom(42);

  return stocks.map((s) => {
    const qty = Math.floor(rand() * 50) + 5;
    const avgPrice = s.base * (0.9 + rand() * 0.2);
    const currentPrice = s.base * (0.95 + rand() * 0.15);
    const change = currentPrice - avgPrice;
    const changePercent = (change / avgPrice) * 100;
    return {
      symbol: s.symbol,
      name: s.name,
      quantity: qty,
      avgPrice: Math.round(avgPrice * 100) / 100,
      currentPrice: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  });
}

export function generateWatchlistPrices(): Record<string, { price: number; change: number }> {
  const rand = seededRandom(Date.now() % 10000);
  const symbols: Record<string, number> = {
    AAPL: 198,
    MSFT: 425,
    GOOGL: 176,
    AMZN: 185,
    NVDA: 875,
    TSLA: 248,
    META: 505,
    "BTC-USD": 67500,
    "ETH-USD": 3450,
    "SPY": 525,
  };

  const result: Record<string, { price: number; change: number }> = {};
  for (const [sym, base] of Object.entries(symbols)) {
    const change = (rand() - 0.5) * base * 0.04;
    result[sym] = {
      price: Math.round((base + change) * 100) / 100,
      change: Math.round((change / base) * 10000) / 100,
    };
  }
  return result;
}
