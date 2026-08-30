const EODHD_BASE = "https://eodhd.com/api";

export interface EODHDQuote {
  code: string;
  timestamp: number;
  gmtoffset: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
  change: number;
  change_p: number;
}

export interface EODHDHistorical {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface EODHDFundamental {
  General: {
    Code: string;
    Name: string;
    Exchange: string;
    CurrencyCode: string;
    Sector: string;
    Industry: string;
    Description: string;
    MarketCapitalization: number;
    ISIN: string;
  };
  Highlights: {
    MarketCapitalization: number;
    EBITDA: number;
    PERatio: number;
    PEGRatio: number;
    DividendYield: number;
    EarningsShare: number;
    BookValue: number;
    ProfitMargin: number;
    OperatingMarginTTM: number;
    ReturnOnEquityTTM: number;
    RevenueTTM: number;
    RevenuePerShareTTM: number;
    QuarterlyRevenueGrowthYOY: number;
    GrossProfitTTM: number;
    DilutedEpsTTM: number;
  };
  Valuation: {
    TrailingPE: number;
    ForwardPE: number;
    PriceSalesTTM: number;
    PriceBookMRQ: number;
    EnterpriseValue: number;
    EnterpriseValueRevenue: number;
    EnterpriseValueEbitda: number;
  };
}

function getApiToken(): string {
  return process.env.EODHD_API_TOKEN || "";
}

export const GLOBAL_EXCHANGES = {
  US: [
    { code: "US", name: "United States (NYSE/NASDAQ)", currency: "USD" },
  ],
  Europe: [
    { code: "XETRA", name: "Frankfurt (XETRA)", currency: "EUR" },
    { code: "LSE", name: "London Stock Exchange", currency: "GBP" },
    { code: "PA", name: "Euronext Paris", currency: "EUR" },
    { code: "AS", name: "Euronext Amsterdam", currency: "EUR" },
    { code: "MI", name: "Borsa Italiana", currency: "EUR" },
    { code: "MC", name: "Bolsa de Madrid", currency: "EUR" },
    { code: "SW", name: "SIX Swiss Exchange", currency: "CHF" },
    { code: "VI", name: "Wiener Borse", currency: "EUR" },
    { code: "ST", name: "Stockholm (OMX)", currency: "SEK" },
    { code: "OL", name: "Oslo Bors", currency: "NOK" },
    { code: "CO", name: "Copenhagen (OMX)", currency: "DKK" },
    { code: "HE", name: "Helsinki (OMX)", currency: "EUR" },
    { code: "IR", name: "Euronext Dublin", currency: "EUR" },
    { code: "WAR", name: "Warsaw Stock Exchange", currency: "PLN" },
    { code: "IS", name: "Borsa Istanbul", currency: "TRY" },
  ],
  Asia: [
    { code: "TSE", name: "Tokyo Stock Exchange", currency: "JPY" },
    { code: "HK", name: "Hong Kong Stock Exchange", currency: "HKD" },
    { code: "SHG", name: "Shanghai Stock Exchange", currency: "CNY" },
    { code: "SHE", name: "Shenzhen Stock Exchange", currency: "CNY" },
    { code: "KO", name: "Korea Exchange", currency: "KRW" },
    { code: "TW", name: "Taiwan Stock Exchange", currency: "TWD" },
    { code: "BSE", name: "Bombay Stock Exchange", currency: "INR" },
    { code: "NSE", name: "National Stock Exchange India", currency: "INR" },
    { code: "KLS", name: "Bursa Malaysia", currency: "MYR" },
    { code: "BK", name: "Stock Exchange of Thailand", currency: "THB" },
    { code: "JK", name: "Indonesia Stock Exchange", currency: "IDR" },
    { code: "AU", name: "Australian Securities Exchange", currency: "AUD" },
    { code: "NZ", name: "New Zealand Stock Exchange", currency: "NZD" },
  ],
  Americas: [
    { code: "TO", name: "Toronto Stock Exchange", currency: "CAD" },
    { code: "SA", name: "B3 (Bovespa) Brazil", currency: "BRL" },
    { code: "MX", name: "Bolsa Mexicana", currency: "MXN" },
    { code: "BA", name: "Buenos Aires Stock Exchange", currency: "ARS" },
    { code: "SN", name: "Santiago Stock Exchange", currency: "CLP" },
  ],
  MiddleEast: [
    { code: "TA", name: "Tel Aviv Stock Exchange", currency: "ILS" },
    { code: "SR", name: "Saudi Stock Exchange (Tadawul)", currency: "SAR" },
    { code: "QA", name: "Qatar Stock Exchange", currency: "QAR" },
    { code: "KW", name: "Kuwait Stock Exchange", currency: "KWD" },
  ],
  Africa: [
    { code: "JSE", name: "Johannesburg Stock Exchange", currency: "ZAR" },
    { code: "CA", name: "Egyptian Exchange", currency: "EGP" },
  ],
} as const;

export const MAJOR_INDICES = [
  { symbol: "GSPC.INDX", name: "S&P 500", region: "US" },
  { symbol: "DJI.INDX", name: "Dow Jones Industrial", region: "US" },
  { symbol: "NDX.INDX", name: "NASDAQ 100", region: "US" },
  { symbol: "RUT.INDX", name: "Russell 2000", region: "US" },
  { symbol: "VIX.INDX", name: "VIX Volatility", region: "US" },
  { symbol: "GDAXI.INDX", name: "DAX 40", region: "Europe" },
  { symbol: "FTSE.INDX", name: "FTSE 100", region: "Europe" },
  { symbol: "FCHI.INDX", name: "CAC 40", region: "Europe" },
  { symbol: "STOXX50E.INDX", name: "Euro Stoxx 50", region: "Europe" },
  { symbol: "N225.INDX", name: "Nikkei 225", region: "Asia" },
  { symbol: "HSI.INDX", name: "Hang Seng", region: "Asia" },
  { symbol: "000001.INDX", name: "Shanghai Composite", region: "Asia" },
  { symbol: "KOSPI.INDX", name: "KOSPI", region: "Asia" },
  { symbol: "SENSEX.INDX", name: "BSE Sensex", region: "Asia" },
  { symbol: "AXJO.INDX", name: "ASX 200", region: "Asia" },
  { symbol: "BVSP.INDX", name: "Bovespa", region: "Americas" },
  { symbol: "MXX.INDX", name: "IPC Mexico", region: "Americas" },
  { symbol: "GSPTSE.INDX", name: "S&P/TSX Composite", region: "Americas" },
];

export const FOREX_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD", "USD/CAD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "EUR/CHF", "USD/TRY", "USD/ZAR",
  "USD/BRL", "USD/MXN", "USD/INR", "USD/CNY", "USD/KRW", "EUR/TRY",
];

export const COMMODITIES = [
  { symbol: "GC.COMM", name: "Gold", unit: "oz" },
  { symbol: "SI.COMM", name: "Silver", unit: "oz" },
  { symbol: "PL.COMM", name: "Platinum", unit: "oz" },
  { symbol: "PA.COMM", name: "Palladium", unit: "oz" },
  { symbol: "CL.COMM", name: "WTI Crude Oil", unit: "barrel" },
  { symbol: "BZ.COMM", name: "Brent Crude Oil", unit: "barrel" },
  { symbol: "NG.COMM", name: "Natural Gas", unit: "MMBtu" },
  { symbol: "HG.COMM", name: "Copper", unit: "lb" },
  { symbol: "ZW.COMM", name: "Wheat", unit: "bushel" },
  { symbol: "ZC.COMM", name: "Corn", unit: "bushel" },
  { symbol: "ZS.COMM", name: "Soybeans", unit: "bushel" },
  { symbol: "CT.COMM", name: "Cotton", unit: "lb" },
  { symbol: "KC.COMM", name: "Coffee", unit: "lb" },
  { symbol: "SB.COMM", name: "Sugar", unit: "lb" },
  { symbol: "CC.COMM", name: "Cocoa", unit: "ton" },
];

export const CRYPTO_PAIRS = [
  "BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "XRP-USD", "ADA-USD",
  "AVAX-USD", "DOT-USD", "MATIC-USD", "LINK-USD", "UNI-USD", "ATOM-USD",
];

export async function fetchEODHDRealtime(symbol: string): Promise<EODHDQuote | null> {
  const token = getApiToken();
  if (!token) return null;
  try {
    const res = await fetch(`${EODHD_BASE}/real-time/${symbol}?api_token=${token}&fmt=json`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchEODHDBatchQuotes(symbols: string[]): Promise<EODHDQuote[]> {
  const token = getApiToken();
  if (!token) return [];
  try {
    const primary = symbols[0];
    const rest = symbols.slice(1).join(",");
    const url = `${EODHD_BASE}/real-time/${primary}?api_token=${token}&fmt=json&s=${rest}`;
    const res = await fetch(url, { next: { revalidate: 15 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

export async function fetchEODHDHistory(
  symbol: string,
  from?: string,
  to?: string,
  period: "d" | "w" | "m" = "d"
): Promise<EODHDHistorical[]> {
  const token = getApiToken();
  if (!token) return [];
  try {
    const params = new URLSearchParams({ api_token: token, fmt: "json", period });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`${EODHD_BASE}/eod/${symbol}?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchEODHDFundamentals(symbol: string): Promise<EODHDFundamental | null> {
  const token = getApiToken();
  if (!token) return null;
  try {
    const res = await fetch(
      `${EODHD_BASE}/fundamentals/${symbol}?api_token=${token}&fmt=json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchEODHDSymbols(query: string, exchange?: string): Promise<Array<{ Code: string; Exchange: string; Name: string; Type: string; Currency: string }>> {
  const token = getApiToken();
  if (!token) return [];
  try {
    const params = new URLSearchParams({ api_token: token, fmt: "json" });
    if (exchange) params.set("exchange", exchange);
    const res = await fetch(`${EODHD_BASE}/search/${encodeURIComponent(query)}?${params}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchExchangeSymbols(exchange: string): Promise<Array<{ Code: string; Name: string; Type: string }>> {
  const token = getApiToken();
  if (!token) return [];
  try {
    const res = await fetch(
      `${EODHD_BASE}/exchange-symbol-list/${exchange}?api_token=${token}&fmt=json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
