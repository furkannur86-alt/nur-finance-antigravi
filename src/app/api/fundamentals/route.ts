import { NextRequest, NextResponse } from "next/server";

const EODHD_BASE = "https://eodhd.com/api";

function getApiToken(): string {
  return process.env.EODHD_API_TOKEN || "";
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }

  const token = getApiToken();
  if (!token) {
    return NextResponse.json({ error: "API token not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${EODHD_BASE}/fundamentals/${symbol}?api_token=${token}&fmt=json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: `EODHD returned ${res.status}` }, { status: 502 });
    }
    const data = await res.json();

    const result = {
      general: {
        code: data.General?.Code || symbol.split(".")[0],
        name: data.General?.Name || symbol,
        exchange: data.General?.Exchange || "",
        currency: data.General?.CurrencyCode || "USD",
        sector: data.General?.Sector || "N/A",
        industry: data.General?.Industry || "N/A",
        description: data.General?.Description || "",
        isin: data.General?.ISIN || "",
        logo: data.General?.LogoURL || "",
        webURL: data.General?.WebURL || "",
        fullTimeEmployees: data.General?.FullTimeEmployees || 0,
        ipoDate: data.General?.IPODate || "",
      },
      highlights: {
        marketCap: data.Highlights?.MarketCapitalization || 0,
        ebitda: data.Highlights?.EBITDA || 0,
        peRatio: data.Highlights?.PERatio || 0,
        pegRatio: data.Highlights?.PEGRatio || 0,
        dividendYield: data.Highlights?.DividendYield || 0,
        eps: data.Highlights?.EarningsShare || 0,
        bookValue: data.Highlights?.BookValue || 0,
        profitMargin: data.Highlights?.ProfitMargin || 0,
        operatingMargin: data.Highlights?.OperatingMarginTTM || 0,
        roe: data.Highlights?.ReturnOnEquityTTM || 0,
        roa: data.Highlights?.ReturnOnAssetsTTM || 0,
        revenue: data.Highlights?.RevenueTTM || 0,
        revenuePerShare: data.Highlights?.RevenuePerShareTTM || 0,
        revenueGrowth: data.Highlights?.QuarterlyRevenueGrowthYOY || 0,
        grossProfit: data.Highlights?.GrossProfitTTM || 0,
        dilutedEps: data.Highlights?.DilutedEpsTTM || 0,
        earningsGrowth: data.Highlights?.QuarterlyEarningsGrowthYOY || 0,
        wallStreetTarget: data.Highlights?.WallStreetTargetPrice || 0,
        beta: data.Highlights?.Beta || 0,
        "52WeekHigh": data.Highlights?.["52WeekHigh"] || 0,
        "52WeekLow": data.Highlights?.["52WeekLow"] || 0,
        "50DayMA": data.Highlights?.["50DayMA"] || 0,
        "200DayMA": data.Highlights?.["200DayMA"] || 0,
        sharesOutstanding: data.Highlights?.SharesOutstanding || 0,
        sharesFloat: data.Highlights?.SharesFloat || 0,
        sharesShort: data.Highlights?.SharesShort || 0,
        shortRatio: data.Highlights?.ShortRatio || 0,
      },
      valuation: {
        trailingPE: data.Valuation?.TrailingPE || 0,
        forwardPE: data.Valuation?.ForwardPE || 0,
        priceSales: data.Valuation?.PriceSalesTTM || 0,
        priceBook: data.Valuation?.PriceBookMRQ || 0,
        enterpriseValue: data.Valuation?.EnterpriseValue || 0,
        evRevenue: data.Valuation?.EnterpriseValueRevenue || 0,
        evEbitda: data.Valuation?.EnterpriseValueEbitda || 0,
      },
      dividends: data.SplitsDividends ? {
        forwardDividendRate: data.SplitsDividends.ForwardAnnualDividendRate || 0,
        forwardDividendYield: data.SplitsDividends.ForwardAnnualDividendYield || 0,
        payoutRatio: data.SplitsDividends.PayoutRatio || 0,
        exDividendDate: data.SplitsDividends.ExDividendDate || "",
      } : null,
      technicals: data.Technicals ? {
        beta: data.Technicals.Beta || 0,
        "52WeekHigh": data.Technicals["52WeekHigh"] || 0,
        "52WeekLow": data.Technicals["52WeekLow"] || 0,
        "50DayMA": data.Technicals["50DayMA"] || 0,
        "200DayMA": data.Technicals["200DayMA"] || 0,
        shortRatio: data.Technicals.ShortRatio || 0,
        sharesShort: data.Technicals.SharesShort || 0,
      } : null,
    };

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
