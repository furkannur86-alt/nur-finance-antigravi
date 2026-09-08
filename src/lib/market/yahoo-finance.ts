import { ChartDataPoint, MarketQuote } from "@/types";

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance";

interface YFQuoteResult {
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  shortName?: string;
  symbol?: string;
}

export interface HistoricalBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function fetchQuotes(symbols: string[]): Promise<MarketQuote[]> {
  const url = `${YF_BASE}/finance/quote?symbols=${symbols.join(",")}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Yahoo Finance API error: ${res.status}`);
    const data = await res.json();
    const results: YFQuoteResult[] = data?.quoteResponse?.result || [];
    return results.map((q) => ({
      symbol: q.symbol || "",
      name: q.shortName || q.symbol || "",
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0,
      previousClose: q.regularMarketPreviousClose || 0,
      open: q.regularMarketOpen || 0,
      dayHigh: q.regularMarketDayHigh || 0,
      dayLow: q.regularMarketDayLow || 0,
      volume: q.regularMarketVolume || 0,
    }));
  } catch {
    return [];
  }
}

export async function fetchHistory(
  symbol: string,
  range: string = "3mo",
  interval: string = "1d"
): Promise<HistoricalBar[]> {
  const url = `${YF_BASE}/finance/chart/${symbol}?range=${range}&interval=${interval}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Yahoo Finance chart error: ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return [];
    const timestamps: number[] = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    return timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      open: quote.open?.[i] || 0,
      high: quote.high?.[i] || 0,
      low: quote.low?.[i] || 0,
      close: quote.close?.[i] || 0,
      volume: quote.volume?.[i] || 0,
    }));
  } catch {
    return [];
  }
}

export function historyToChartData(bars: HistoricalBar[]): ChartDataPoint[] {
  return bars
    .filter((b) => b.close > 0)
    .map((b) => ({
      label: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(b.close * 100) / 100,
    }));
}
