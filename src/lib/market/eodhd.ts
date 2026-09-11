import type { MarketQuote } from "@/types";
import type { HistoricalBar } from "./yahoo-finance";

const BASE = "https://eodhd.com/api";

// ─── Static market universe ───────────────────────────────────────────────────
export const MAJOR_INDICES = [
  { symbol: "GSPC.INDX",  name: "S&P 500",         region: "US"      },
  { symbol: "DJI.INDX",   name: "Dow Jones",        region: "US"      },
  { symbol: "IXIC.INDX",  name: "NASDAQ Composite", region: "US"      },
  { symbol: "RUT.INDX",   name: "Russell 2000",     region: "US"      },
  { symbol: "FTSE.INDX",  name: "FTSE 100",         region: "Europe"  },
  { symbol: "GDAXI.INDX", name: "DAX",              region: "Europe"  },
  { symbol: "FCHI.INDX",  name: "CAC 40",           region: "Europe"  },
  { symbol: "N225.INDX",  name: "Nikkei 225",       region: "Asia"    },
  { symbol: "HSI.INDX",   name: "Hang Seng",        region: "Asia"    },
  { symbol: "000001.SHG", name: "Shanghai Comp.",   region: "Asia"    },
  { symbol: "BIST100.INDX",name:"BIST 100",         region: "Europe"  },
  { symbol: "MERVAL.INDX",name: "Merval",           region: "Americas"},
  { symbol: "BVSP.INDX",  name: "Bovespa",          region: "Americas"},
];

export const COMMODITIES = [
  { symbol: "GC.COMM",  name: "Gold",          unit: "USD/oz"  },
  { symbol: "SI.COMM",  name: "Silver",        unit: "USD/oz"  },
  { symbol: "CL.COMM",  name: "WTI Crude Oil", unit: "USD/bbl" },
  { symbol: "BZ.COMM",  name: "Brent Crude",   unit: "USD/bbl" },
  { symbol: "NG.COMM",  name: "Natural Gas",   unit: "USD/MMBtu"},
  { symbol: "ZW.COMM",  name: "Wheat",         unit: "USc/bu"  },
  { symbol: "ZC.COMM",  name: "Corn",          unit: "USc/bu"  },
];

export const CRYPTO_PAIRS = ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "MATIC-USD"];
export const FOREX_PAIRS  = ["EUR/USD", "USD/JPY", "GBP/USD", "USD/TRY", "USD/CHF", "AUD/USD"];

// ─── Low-level EODHD raw response ─────────────────────────────────────────────
interface EODHDRaw {
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

async function eodhdBatch(symbols: string[], apiKey: string): Promise<EODHDRaw[]> {
  if (!symbols.length || !apiKey) return [];
  const [first, ...rest] = symbols;
  const extra = rest.length ? `&s=${rest.join(",")}` : "";
  try {
    const res = await fetch(`${BASE}/real-time/${first}?api_token=${apiKey}&fmt=json${extra}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const raw = await res.json();
    return Array.isArray(raw) ? raw : [raw];
  } catch { return []; }
}

// ─── Aliased exports used by older API routes ──────────────────────────────────
export async function fetchEODHDRealtime(symbol: string, apiKey?: string): Promise<EODHDRaw | null> {
  const key = apiKey || process.env.EODHD_API_TOKEN || process.env.EODHD_API_KEY || "";
  const results = await eodhdBatch([symbol], key);
  return results[0] ?? null;
}

export async function fetchEODHDBatchQuotes(symbols: string[], apiKey?: string): Promise<EODHDRaw[]> {
  const key = apiKey || process.env.EODHD_API_TOKEN || process.env.EODHD_API_KEY || "";
  return eodhdBatch(symbols, key);
}

export async function fetchEODHDFundamentals(symbol: string, apiKey?: string): Promise<unknown> {
  const key = apiKey || process.env.EODHD_API_TOKEN || process.env.EODHD_API_KEY || "";
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}/fundamentals/${symbol}?api_token=${key}&fmt=json`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function searchEODHDSymbols(query: string, exchange?: string, apiKey?: string): Promise<unknown[]> {
  const key = apiKey || process.env.EODHD_API_TOKEN || process.env.EODHD_API_KEY || "";
  if (!key) return [];
  try {
    const ex = exchange ? `&exchange=${exchange}` : "";
    const res = await fetch(`${BASE}/search/${encodeURIComponent(query)}?api_token=${key}&fmt=json${ex}`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export const GLOBAL_EXCHANGES = [
  { code: "US",  name: "NYSE/NASDAQ", country: "United States", currency: "USD", region: "Americas" },
  { code: "LSE", name: "London SE",   country: "United Kingdom",currency: "GBP", region: "Europe"   },
  { code: "XETRA",name:"XETRA",      country: "Germany",        currency: "EUR", region: "Europe"   },
  { code: "TSE", name: "Tokyo SE",    country: "Japan",          currency: "JPY", region: "Asia"     },
  { code: "BIST",name: "Borsa Istanbul",country:"Turkey",        currency: "TRY", region: "Europe"   },
  { code: "CC",  name: "Crypto",      country: "Global",         currency: "USD", region: "Global"   },
];

export async function fetchExchangeSymbols(exchange: string, apiKey?: string): Promise<unknown[]> {
  const key = apiKey || process.env.EODHD_API_TOKEN || process.env.EODHD_API_KEY || "";
  if (!key) return [];
  try {
    const res = await fetch(`${BASE}/exchange-symbol-list/${exchange}?api_token=${key}&fmt=json`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

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
