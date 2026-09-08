import { NextRequest, NextResponse } from "next/server";
import { fetchExchangeSymbols, GLOBAL_EXCHANGES } from "@/lib/market/eodhd";

const allExchanges = Object.entries(GLOBAL_EXCHANGES).flatMap(([region, exchanges]) =>
  exchanges.map((ex) => ({ ...ex, region })),
);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "exchanges";
  const exchange = searchParams.get("exchange");
  const country = searchParams.get("country");
  const region = searchParams.get("region");
  const stockType = searchParams.get("stockType") || "Common Stock";
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    if (type === "exchanges") {
      let filtered = allExchanges;
      if (region) filtered = filtered.filter((e) => e.region === region);
      if (country) filtered = filtered.filter((e) => e.country === country);

      const countries = [...new Set(filtered.map((e) => e.country))].sort();
      const regions = [...new Set(allExchanges.map((e) => e.region))];

      return NextResponse.json({
        data: filtered.map((e) => ({
          code: e.code,
          name: e.name,
          country: e.country,
          currency: e.currency,
          region: e.region,
        })),
        meta: {
          totalExchanges: filtered.length,
          countries,
          regions,
        },
      });
    }

    if (type === "countries") {
      const byRegion: Record<string, string[]> = {};
      for (const ex of allExchanges) {
        if (!byRegion[ex.region]) byRegion[ex.region] = [];
        if (!byRegion[ex.region].includes(ex.country)) {
          byRegion[ex.region].push(ex.country);
        }
      }
      for (const r of Object.keys(byRegion)) {
        byRegion[r].sort();
      }
      return NextResponse.json({ data: byRegion });
    }

    if (type === "stocks" && (exchange || country)) {
      let exchangeCodes: string[] = [];

      if (exchange) {
        exchangeCodes = [exchange];
      } else if (country) {
        exchangeCodes = allExchanges
          .filter((e) => e.country === country)
          .map((e) => e.code);
      }

      if (exchangeCodes.length === 0) {
        return NextResponse.json({ error: "No exchange found for given parameters" }, { status: 400 });
      }

      const allSymbols: Array<{
        code: string;
        name: string;
        type: string;
        exchange: string;
        country: string;
        fullSymbol: string;
      }> = [];

      for (const exCode of exchangeCodes) {
        const symbols = await fetchExchangeSymbols(exCode);
        const exMeta = allExchanges.find((e) => e.code === exCode);
        for (const sym of symbols) {
          if (stockType === "all" || sym.Type === stockType) {
            allSymbols.push({
              code: sym.Code,
              name: sym.Name,
              type: sym.Type,
              exchange: exCode,
              country: exMeta?.country || "",
              fullSymbol: `${sym.Code}.${exCode}`,
            });
          }
        }
      }

      let filtered = allSymbols;
      if (search) {
        const q = search.toLowerCase();
        filtered = allSymbols.filter(
          (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
        );
      }

      filtered.sort((a, b) => a.code.localeCompare(b.code));

      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return NextResponse.json({
        data: paged,
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
          exchange: exchange || undefined,
          country: country || undefined,
          stockType,
        },
      });
    }

    if (type === "summary") {
      const summary: Record<string, { exchanges: string[]; exchangeCount: number }> = {};
      for (const [region, exchanges] of Object.entries(GLOBAL_EXCHANGES)) {
        const countries: Record<string, string[]> = {};
        for (const ex of exchanges) {
          if (!countries[ex.country]) countries[ex.country] = [];
          countries[ex.country].push(ex.code);
        }
        for (const [ctry, codes] of Object.entries(countries)) {
          summary[ctry] = { exchanges: codes, exchangeCount: codes.length };
        }
        void region;
      }
      return NextResponse.json({
        data: summary,
        meta: { totalCountries: Object.keys(summary).length, totalExchanges: allExchanges.length },
      });
    }

    return NextResponse.json({
      error: "Invalid type",
      types: ["exchanges", "countries", "stocks", "summary"],
      example: "?type=stocks&country=Germany&page=1&limit=50",
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Exchange stocks fetch failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
