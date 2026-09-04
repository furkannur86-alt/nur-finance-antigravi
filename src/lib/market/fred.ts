const FRED_BASE = "https://api.stlouisfed.org/fred";

export interface FREDObservation {
  date: string;
  value: string;
}

export interface FREDSeries {
  id: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  units: string;
  seasonal_adjustment: string;
  last_updated: string;
}

export const ECONOMIC_INDICATORS = {
  growth: [
    { id: "GDP", name: "Real GDP", frequency: "Quarterly", description: "US Real Gross Domestic Product" },
    { id: "GDPC1", name: "Real GDP (Chained)", frequency: "Quarterly", description: "Real GDP in chained 2017 dollars" },
    { id: "A191RL1Q225SBEA", name: "Real GDP Growth Rate", frequency: "Quarterly", description: "Percent change from preceding period" },
    { id: "INDPRO", name: "Industrial Production", frequency: "Monthly", description: "Industrial Production Index" },
    { id: "PAYEMS", name: "Nonfarm Payrolls", frequency: "Monthly", description: "Total nonfarm employment" },
  ],
  inflation: [
    { id: "CPIAUCSL", name: "CPI (All Items)", frequency: "Monthly", description: "Consumer Price Index for All Urban Consumers" },
    { id: "CPILFESL", name: "Core CPI", frequency: "Monthly", description: "CPI less food and energy" },
    { id: "PCEPI", name: "PCE Price Index", frequency: "Monthly", description: "Personal Consumption Expenditures Price Index" },
    { id: "PCEPILFE", name: "Core PCE", frequency: "Monthly", description: "PCE excluding food and energy" },
    { id: "T10YIE", name: "10Y Breakeven Inflation", frequency: "Daily", description: "10-Year Breakeven Inflation Rate" },
    { id: "MICH", name: "Michigan Inflation Expectations", frequency: "Monthly", description: "University of Michigan Inflation Expectation" },
  ],
  rates: [
    { id: "FEDFUNDS", name: "Fed Funds Rate", frequency: "Monthly", description: "Effective Federal Funds Rate" },
    { id: "DFF", name: "Fed Funds Daily", frequency: "Daily", description: "Daily Effective Federal Funds Rate" },
    { id: "DGS2", name: "2Y Treasury Yield", frequency: "Daily", description: "2-Year Treasury Constant Maturity Rate" },
    { id: "DGS5", name: "5Y Treasury Yield", frequency: "Daily", description: "5-Year Treasury Constant Maturity Rate" },
    { id: "DGS10", name: "10Y Treasury Yield", frequency: "Daily", description: "10-Year Treasury Constant Maturity Rate" },
    { id: "DGS30", name: "30Y Treasury Yield", frequency: "Daily", description: "30-Year Treasury Constant Maturity Rate" },
    { id: "T10Y2Y", name: "10Y-2Y Spread", frequency: "Daily", description: "10-Year minus 2-Year Treasury (yield curve)" },
    { id: "T10Y3M", name: "10Y-3M Spread", frequency: "Daily", description: "10-Year minus 3-Month Treasury" },
    { id: "MORTGAGE30US", name: "30Y Mortgage Rate", frequency: "Weekly", description: "30-Year Fixed Rate Mortgage Average" },
  ],
  labor: [
    { id: "UNRATE", name: "Unemployment Rate", frequency: "Monthly", description: "Civilian Unemployment Rate" },
    { id: "ICSA", name: "Initial Claims", frequency: "Weekly", description: "Initial jobless claims" },
    { id: "CCSA", name: "Continued Claims", frequency: "Weekly", description: "Continued jobless claims" },
    { id: "CIVPART", name: "Labor Force Participation", frequency: "Monthly", description: "Civilian Labor Force Participation Rate" },
    { id: "CES0500000003", name: "Average Hourly Earnings", frequency: "Monthly", description: "Average Hourly Earnings of All Employees" },
    { id: "JOLTS", name: "Job Openings (JOLTS)", frequency: "Monthly", description: "Job Openings: Total Nonfarm" },
  ],
  manufacturing: [
    { id: "MANEMP", name: "Manufacturing Employment", frequency: "Monthly", description: "All Employees: Manufacturing" },
    { id: "NAPM", name: "ISM Manufacturing PMI", frequency: "Monthly", description: "ISM Manufacturing: PMI Composite Index" },
    { id: "NAPMNOI", name: "ISM New Orders", frequency: "Monthly", description: "ISM Manufacturing: New Orders Index" },
    { id: "DGORDER", name: "Durable Goods Orders", frequency: "Monthly", description: "Manufacturers New Orders: Durable Goods" },
    { id: "NEWORDER", name: "New Orders (Mfg)", frequency: "Monthly", description: "Manufacturers New Orders: Total Manufacturing" },
  ],
  housing: [
    { id: "HOUST", name: "Housing Starts", frequency: "Monthly", description: "New Privately-Owned Housing Units Started" },
    { id: "PERMIT", name: "Building Permits", frequency: "Monthly", description: "New Privately-Owned Housing Units Authorized" },
    { id: "CSUSHPISA", name: "Case-Shiller Home Price", frequency: "Monthly", description: "S&P/Case-Shiller National Home Price Index" },
    { id: "EXHOSLUSM495S", name: "Existing Home Sales", frequency: "Monthly", description: "Existing Home Sales" },
  ],
  consumer: [
    { id: "UMCSENT", name: "Consumer Sentiment", frequency: "Monthly", description: "University of Michigan Consumer Sentiment" },
    { id: "RSAFS", name: "Retail Sales", frequency: "Monthly", description: "Advance Retail Sales: Retail and Food Services" },
    { id: "PCE", name: "Personal Consumption", frequency: "Monthly", description: "Personal Consumption Expenditures" },
    { id: "PSAVERT", name: "Personal Savings Rate", frequency: "Monthly", description: "Personal Saving Rate" },
  ],
  money: [
    { id: "M2SL", name: "M2 Money Supply", frequency: "Monthly", description: "M2 Money Stock" },
    { id: "WALCL", name: "Fed Balance Sheet", frequency: "Weekly", description: "Total Assets of Federal Reserve" },
    { id: "DEXUSEU", name: "USD/EUR Exchange", frequency: "Daily", description: "US Dollar to Euro Exchange Rate" },
    { id: "DTWEXBGS", name: "Trade-Weighted Dollar", frequency: "Daily", description: "Trade-Weighted US Dollar Index: Broad" },
  ],
  credit: [
    { id: "BAMLH0A0HYM2", name: "HY OAS Spread", frequency: "Daily", description: "ICE BofA US High Yield Option-Adjusted Spread" },
    { id: "BAMLC0A0CM", name: "IG OAS Spread", frequency: "Daily", description: "ICE BofA US Corporate Master OAS" },
    { id: "TEDRATE", name: "TED Spread", frequency: "Daily", description: "TED Spread (3M LIBOR minus 3M T-Bill)" },
  ],
};

function getApiKey(): string {
  return process.env.FRED_API_KEY || "";
}

export async function fetchFREDSeries(seriesId: string): Promise<FREDSeries | null> {
  const key = getApiKey();
  if (!key) return null;
  try {
    const res = await fetch(
      `${FRED_BASE}/series?series_id=${seriesId}&api_key=${key}&file_type=json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.seriess?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchFREDData(
  seriesId: string,
  limit = 500,
  sortOrder: "asc" | "desc" = "desc",
  observationStart?: string,
  observationEnd?: string,
): Promise<FREDObservation[]> {
  const key = getApiKey();
  if (!key) return [];
  try {
    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: key,
      file_type: "json",
      limit: String(limit),
      sort_order: sortOrder,
    });
    if (observationStart) params.set("observation_start", observationStart);
    if (observationEnd) params.set("observation_end", observationEnd);

    const res = await fetch(`${FRED_BASE}/series/observations?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.observations || []).filter((o: FREDObservation) => o.value !== ".");
  } catch {
    return [];
  }
}

export async function fetchMultipleFREDSeries(
  seriesIds: string[],
  limit = 100
): Promise<Record<string, FREDObservation[]>> {
  const results: Record<string, FREDObservation[]> = {};
  const fetches = seriesIds.map(async (id) => {
    results[id] = await fetchFREDData(id, limit, "desc");
  });
  await Promise.all(fetches);
  return results;
}

export function getYieldCurveData(rates: Record<string, FREDObservation[]>): { maturity: string; yield: number }[] {
  const maturities = [
    { id: "DGS1MO", label: "1M" },
    { id: "DGS3MO", label: "3M" },
    { id: "DGS6MO", label: "6M" },
    { id: "DGS1", label: "1Y" },
    { id: "DGS2", label: "2Y" },
    { id: "DGS3", label: "3Y" },
    { id: "DGS5", label: "5Y" },
    { id: "DGS7", label: "7Y" },
    { id: "DGS10", label: "10Y" },
    { id: "DGS20", label: "20Y" },
    { id: "DGS30", label: "30Y" },
  ];

  return maturities
    .map(m => {
      const obs = rates[m.id]?.[0];
      return obs ? { maturity: m.label, yield: parseFloat(obs.value) } : null;
    })
    .filter((d): d is { maturity: string; yield: number } => d !== null);
}
