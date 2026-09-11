import type { MarketQuote } from "@/types";
import type { HistoricalBar } from "./yahoo-finance";

const BASE = "https://eodhd.com/api";

// EODHD uses symbol.EXCHANGE notation — US stocks need .US suffix
function toEODHD(symbol: string): string {
  if (symbol.includes(".")) return symbol; // already qualified
  if (symbol === "BTC-USD") return "BTC-USD.CC";
  if (symbol === "ETH-USD") return "ETH-USD.CC";
  if (symbol.endsWith("-USD")) return symbol.replace("-USD", "-USD.CC");
  return `${symbol}.US`;
}

interface EODHDRealTime {
  code: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  change: number;
  change_p: number;
}

export async function fetchEODHDQuotes(
  symbols: string[],
  apiKey: string
): Promise<MarketQuote[]> {
  if (!symbols.length || !apiKey) return [];

  // EODHD bulk real-time: primary symbol + extra via &s=
  const [first, ...rest] = symbols.map(toEODHD);
  const extra = rest.length ? `&s=${rest.join(",")}` : "";
  const url = `${BASE}/real-time/${first}?api_token=${apiKey}&fmt=json${extra}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`EODHD ${res.status}`);
    const raw = await res.json();

    // Single symbol → object; multiple → array
    const items: EODHDRealTime[] = Array.isArray(raw) ? raw : [raw];

    return items.map((q, i) => {
      const originalSymbol = symbols[i] ?? q.code.split(".")[0];
      return {
        symbol: originalSymbol,
        name: originalSymbol,
        price: q.close ?? 0,
        change: q.change ?? 0,
        changePercent: q.change_p ?? 0,
        previousClose: q.previousClose ?? 0,
        open: q.open ?? 0,
        dayHigh: q.high ?? 0,
        dayLow: q.low ?? 0,
        volume: q.volume ?? 0,
      };
    });
  } catch {
    return [];
  }
}

export async function fetchEODHDHistory(
  symbol: string,
  range: string,
  apiKey: string
): Promise<HistoricalBar[]> {
  const eodSymbol = toEODHD(symbol);
  const to = new Date().toISOString().split("T")[0];
  const days = range === "1mo" ? 30 : range === "6mo" ? 180 : range === "1y" ? 365 : 90;
  const fromDate = new Date(Date.now() - days * 86400_000);
  const from = fromDate.toISOString().split("T")[0];

  const url = `${BASE}/eod/${eodSymbol}?api_token=${apiKey}&fmt=json&from=${from}&to=${to}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`EODHD history ${res.status}`);
    const data: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> = await res.json();
    return data.map((b) => ({
      date: b.date,
      open: b.open,
      high: b.high,
      low: b.low,
      close: b.close,
      volume: b.volume,
    }));
  } catch {
    return [];
  }
}
