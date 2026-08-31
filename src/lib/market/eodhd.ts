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
    { code: "US", name: "United States (NYSE/NASDAQ)", currency: "USD", country: "United States" },
  ],
  Europe: [
    { code: "XETRA", name: "Frankfurt (XETRA)", currency: "EUR", country: "Germany" },
    { code: "F", name: "Frankfurt (General)", currency: "EUR", country: "Germany" },
    { code: "LSE", name: "London Stock Exchange", currency: "GBP", country: "United Kingdom" },
    { code: "PA", name: "Euronext Paris", currency: "EUR", country: "France" },
    { code: "AS", name: "Euronext Amsterdam", currency: "EUR", country: "Netherlands" },
    { code: "MI", name: "Borsa Italiana", currency: "EUR", country: "Italy" },
    { code: "MC", name: "Bolsa de Madrid", currency: "EUR", country: "Spain" },
    { code: "SW", name: "SIX Swiss Exchange", currency: "CHF", country: "Switzerland" },
    { code: "VI", name: "Wiener Borse", currency: "EUR", country: "Austria" },
    { code: "ST", name: "Stockholm (OMX)", currency: "SEK", country: "Sweden" },
    { code: "OL", name: "Oslo Bors", currency: "NOK", country: "Norway" },
    { code: "CO", name: "Copenhagen (OMX)", currency: "DKK", country: "Denmark" },
    { code: "HE", name: "Helsinki (OMX)", currency: "EUR", country: "Finland" },
    { code: "IR", name: "Euronext Dublin", currency: "EUR", country: "Ireland" },
    { code: "LS", name: "Euronext Lisbon", currency: "EUR", country: "Portugal" },
    { code: "BR", name: "Euronext Brussels", currency: "EUR", country: "Belgium" },
    { code: "WAR", name: "Warsaw Stock Exchange", currency: "PLN", country: "Poland" },
    { code: "BUD", name: "Budapest Stock Exchange", currency: "HUF", country: "Hungary" },
    { code: "PR", name: "Prague Stock Exchange", currency: "CZK", country: "Czech Republic" },
    { code: "BVB", name: "Bucharest Stock Exchange", currency: "RON", country: "Romania" },
    { code: "AT", name: "Athens Stock Exchange", currency: "EUR", country: "Greece" },
    { code: "ZSE", name: "Zagreb Stock Exchange", currency: "HRK", country: "Croatia" },
    { code: "LJ", name: "Ljubljana Stock Exchange", currency: "EUR", country: "Slovenia" },
    { code: "TAL", name: "Tallinn Stock Exchange", currency: "EUR", country: "Estonia" },
    { code: "RG", name: "Riga Stock Exchange", currency: "EUR", country: "Latvia" },
    { code: "VS", name: "Vilnius Stock Exchange", currency: "EUR", country: "Lithuania" },
    { code: "BX", name: "Bulgarian Stock Exchange", currency: "BGN", country: "Bulgaria" },
    { code: "BE", name: "Belgrade Stock Exchange", currency: "RSD", country: "Serbia" },
    { code: "IC", name: "Iceland Stock Exchange", currency: "ISK", country: "Iceland" },
    { code: "IS", name: "Borsa Istanbul", currency: "TRY", country: "Turkey" },
    { code: "CY", name: "Cyprus Stock Exchange", currency: "EUR", country: "Cyprus" },
    { code: "MT", name: "Malta Stock Exchange", currency: "EUR", country: "Malta" },
  ],
  Asia: [
    { code: "TSE", name: "Tokyo Stock Exchange", currency: "JPY", country: "Japan" },
    { code: "HK", name: "Hong Kong Stock Exchange", currency: "HKD", country: "Hong Kong" },
    { code: "SHG", name: "Shanghai Stock Exchange", currency: "CNY", country: "China" },
    { code: "SHE", name: "Shenzhen Stock Exchange", currency: "CNY", country: "China" },
    { code: "KO", name: "Korea Exchange", currency: "KRW", country: "South Korea" },
    { code: "TW", name: "Taiwan Stock Exchange", currency: "TWD", country: "Taiwan" },
    { code: "BSE", name: "Bombay Stock Exchange", currency: "INR", country: "India" },
    { code: "NSE", name: "National Stock Exchange India", currency: "INR", country: "India" },
    { code: "KLS", name: "Bursa Malaysia", currency: "MYR", country: "Malaysia" },
    { code: "BK", name: "Stock Exchange of Thailand", currency: "THB", country: "Thailand" },
    { code: "JK", name: "Indonesia Stock Exchange", currency: "IDR", country: "Indonesia" },
    { code: "AU", name: "Australian Securities Exchange", currency: "AUD", country: "Australia" },
    { code: "NZ", name: "New Zealand Stock Exchange", currency: "NZD", country: "New Zealand" },
    { code: "SG", name: "Singapore Exchange", currency: "SGD", country: "Singapore" },
    { code: "PSE", name: "Philippine Stock Exchange", currency: "PHP", country: "Philippines" },
    { code: "VN", name: "Ho Chi Minh Stock Exchange", currency: "VND", country: "Vietnam" },
    { code: "BD", name: "Dhaka Stock Exchange", currency: "BDT", country: "Bangladesh" },
    { code: "KAR", name: "Pakistan Stock Exchange", currency: "PKR", country: "Pakistan" },
    { code: "CSE", name: "Colombo Stock Exchange", currency: "LKR", country: "Sri Lanka" },
  ],
  Americas: [
    { code: "TO", name: "Toronto Stock Exchange", currency: "CAD", country: "Canada" },
    { code: "V", name: "TSX Venture Exchange", currency: "CAD", country: "Canada" },
    { code: "SA", name: "B3 (Bovespa) Brazil", currency: "BRL", country: "Brazil" },
    { code: "MX", name: "Bolsa Mexicana", currency: "MXN", country: "Mexico" },
    { code: "BA", name: "Buenos Aires Stock Exchange", currency: "ARS", country: "Argentina" },
    { code: "SN", name: "Santiago Stock Exchange", currency: "CLP", country: "Chile" },
    { code: "BVC", name: "Colombia Stock Exchange", currency: "COP", country: "Colombia" },
    { code: "LIM", name: "Lima Stock Exchange", currency: "PEN", country: "Peru" },
  ],
  MiddleEast: [
    { code: "TA", name: "Tel Aviv Stock Exchange", currency: "ILS", country: "Israel" },
    { code: "SR", name: "Saudi Stock Exchange (Tadawul)", currency: "SAR", country: "Saudi Arabia" },
    { code: "QA", name: "Qatar Stock Exchange", currency: "QAR", country: "Qatar" },
    { code: "KW", name: "Kuwait Stock Exchange", currency: "KWD", country: "Kuwait" },
    { code: "DFM", name: "Dubai Financial Market", currency: "AED", country: "UAE" },
    { code: "ADX", name: "Abu Dhabi Securities Exchange", currency: "AED", country: "UAE" },
    { code: "BAH", name: "Bahrain Bourse", currency: "BHD", country: "Bahrain" },
    { code: "MSM", name: "Muscat Securities Market", currency: "OMR", country: "Oman" },
    { code: "AMMAN", name: "Amman Stock Exchange", currency: "JOD", country: "Jordan" },
  ],
  Africa: [
    { code: "JSE", name: "Johannesburg Stock Exchange", currency: "ZAR", country: "South Africa" },
    { code: "CA", name: "Egyptian Exchange", currency: "EGP", country: "Egypt" },
    { code: "NGSE", name: "Nigerian Stock Exchange", currency: "NGN", country: "Nigeria" },
    { code: "BC", name: "Casablanca Stock Exchange", currency: "MAD", country: "Morocco" },
    { code: "NBO", name: "Nairobi Securities Exchange", currency: "KES", country: "Kenya" },
    { code: "GH", name: "Ghana Stock Exchange", currency: "GHS", country: "Ghana" },
    { code: "TN", name: "Tunis Stock Exchange", currency: "TND", country: "Tunisia" },
    { code: "MU", name: "Stock Exchange of Mauritius", currency: "MUR", country: "Mauritius" },
    { code: "BW", name: "Botswana Stock Exchange", currency: "BWP", country: "Botswana" },
    { code: "ZIM", name: "Zimbabwe Stock Exchange", currency: "ZWL", country: "Zimbabwe" },
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
