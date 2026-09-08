import { NextRequest, NextResponse } from "next/server";

const EODHD_BASE = "https://eodhd.com/api";

function getApiToken(): string {
  return process.env.EODHD_API_TOKEN || "";
}

export async function GET(req: NextRequest) {
  const exchange = req.nextUrl.searchParams.get("exchange") || "US";
  const sortBy = req.nextUrl.searchParams.get("sort") || "market_capitalization";
  const order = req.nextUrl.searchParams.get("order") || "d";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50"), 100);

  const token = getApiToken();
  if (!token) {
    return NextResponse.json({ error: "API token not configured" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      api_token: token,
      fmt: "json",
      sort: `${sortBy}.${order}`,
      limit: String(limit),
    });

    const filters = req.nextUrl.searchParams.get("filters");
    if (filters) {
      const parsed = JSON.parse(filters);
      for (const [key, value] of Object.entries(parsed)) {
        if (value && typeof value === "string") {
          params.set(key, value);
        }
      }
    }

    const res = await fetch(
      `${EODHD_BASE}/screener?${params}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `EODHD screener returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    const stocks = (data.data || []).map((s: Record<string, unknown>) => ({
      code: s.code || "",
      name: s.name || "",
      exchange: s.exchange || exchange,
      sector: s.sector || "N/A",
      industry: s.industry || "N/A",
      marketCap: s.market_capitalization || 0,
      peRatio: s.earnings_share && Number(s.earnings_share) !== 0
        ? Number(s.close) / Number(s.earnings_share)
        : 0,
      price: s.close || 0,
      change: s.change || 0,
      changePercent: s.change_p || 0,
      volume: s.volume || 0,
      dividendYield: s.dividend_yield || 0,
      eps: s.earnings_share || 0,
      beta: s.beta || 0,
      "52WeekHigh": s["52_week_high"] || 0,
      "52WeekLow": s["52_week_low"] || 0,
      revenue: s.revenue || 0,
    }));

    return NextResponse.json({
      stocks,
      total: data.count || stocks.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
