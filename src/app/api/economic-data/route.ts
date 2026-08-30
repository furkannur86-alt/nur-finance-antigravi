import { NextRequest, NextResponse } from "next/server";
import {
  fetchFREDData, fetchFREDSeries, fetchMultipleFREDSeries,
  getYieldCurveData, ECONOMIC_INDICATORS,
} from "@/lib/market/fred";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "categories";
  const seriesId = searchParams.get("series");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "100");

  try {
    if (type === "categories") {
      const categories = Object.entries(ECONOMIC_INDICATORS).map(([key, indicators]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        indicators: indicators.map((ind) => ({
          id: ind.id,
          name: ind.name,
          frequency: ind.frequency,
          description: ind.description,
        })),
      }));
      return NextResponse.json({ data: categories });
    }

    if (type === "series" && seriesId) {
      const [meta, observations] = await Promise.all([
        fetchFREDSeries(seriesId),
        fetchFREDData(seriesId, limit, "desc"),
      ]);
      return NextResponse.json({ meta, data: observations.reverse() });
    }

    if (type === "category" && category) {
      const cat = ECONOMIC_INDICATORS[category as keyof typeof ECONOMIC_INDICATORS];
      if (!cat) {
        return NextResponse.json(
          { error: "Unknown category", available: Object.keys(ECONOMIC_INDICATORS) },
          { status: 400 },
        );
      }
      const ids = cat.map((ind) => ind.id);
      const data = await fetchMultipleFREDSeries(ids, 10);
      const result = cat.map((ind) => ({
        ...ind,
        latest: data[ind.id]?.[0] || null,
        recent: (data[ind.id] || []).slice(0, 5),
      }));
      return NextResponse.json({ category, data: result });
    }

    if (type === "yield-curve") {
      const yieldIds = [
        "DGS1MO", "DGS3MO", "DGS6MO", "DGS1", "DGS2", "DGS3",
        "DGS5", "DGS7", "DGS10", "DGS20", "DGS30",
      ];
      const rates = await fetchMultipleFREDSeries(yieldIds, 1);
      const curve = getYieldCurveData(rates);
      return NextResponse.json({ data: curve });
    }

    if (type === "dashboard") {
      const dashboardIds = [
        "DFF", "UNRATE", "CPIAUCSL", "GDP", "T10Y2Y",
        "DGS10", "DGS2", "BAMLH0A0HYM2", "INDPRO", "UMCSENT",
      ];
      const data = await fetchMultipleFREDSeries(dashboardIds, 5);
      const indicators = ECONOMIC_INDICATORS;
      const allIndicators = Object.values(indicators).flat();
      const result = dashboardIds.map((id) => {
        const meta = allIndicators.find((ind) => ind.id === id);
        return {
          id,
          name: meta?.name || id,
          description: meta?.description || "",
          latest: data[id]?.[0] || null,
          trend: data[id] || [],
        };
      });
      return NextResponse.json({ data: result });
    }

    return NextResponse.json({
      error: "Invalid request",
      types: ["categories", "series", "category", "yield-curve", "dashboard"],
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Economic data fetch failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
