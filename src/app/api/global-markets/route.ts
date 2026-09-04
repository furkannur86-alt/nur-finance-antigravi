import { NextRequest, NextResponse } from "next/server";
import {
  fetchEODHDRealtime, fetchEODHDBatchQuotes, fetchEODHDHistory,
  fetchEODHDFundamentals, searchEODHDSymbols,
  MAJOR_INDICES, COMMODITIES, CRYPTO_PAIRS, FOREX_PAIRS,
} from "@/lib/market/eodhd";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "indices";
  const symbol = searchParams.get("symbol");
  const query = searchParams.get("q");
  const exchange = searchParams.get("exchange");
  const range = searchParams.get("range") || "3mo";

  try {
    if (type === "indices") {
      const region = searchParams.get("region");
      const filtered = region
        ? MAJOR_INDICES.filter((idx) => idx.region === region)
        : MAJOR_INDICES;
      const symbols = filtered.map((idx) => idx.symbol);
      if (symbols.length === 0) {
        return NextResponse.json({ data: [], meta: MAJOR_INDICES });
      }
      const quotes = await fetchEODHDBatchQuotes(symbols);
      const data = filtered.map((idx) => {
        const q = quotes.find((qt) => qt.code === idx.symbol.split(".")[0]);
        return {
          symbol: idx.symbol,
          name: idx.name,
          region: idx.region,
          price: q?.close ?? 0,
          change: q?.change ?? 0,
          changePercent: q?.change_p ?? 0,
        };
      });
      return NextResponse.json({ data, meta: { total: MAJOR_INDICES.length } });
    }

    if (type === "commodities") {
      const symbols = COMMODITIES.map((c) => c.symbol);
      const quotes = await fetchEODHDBatchQuotes(symbols);
      const data = COMMODITIES.map((c) => {
        const q = quotes.find((qt) => qt.code === c.symbol.split(".")[0]);
        return {
          symbol: c.symbol,
          name: c.name,
          unit: c.unit,
          price: q?.close ?? 0,
          change: q?.change ?? 0,
          changePercent: q?.change_p ?? 0,
        };
      });
      return NextResponse.json({ data });
    }

    if (type === "forex") {
      const fxSymbols = FOREX_PAIRS.map((p) => `${p.replace("/", "")}.FOREX`);
      const quotes = await fetchEODHDBatchQuotes(fxSymbols);
      const data = FOREX_PAIRS.map((pair, i) => {
        const q = quotes[i];
        return {
          pair,
          price: q?.close ?? 0,
          change: q?.change ?? 0,
          changePercent: q?.change_p ?? 0,
        };
      });
      return NextResponse.json({ data });
    }

    if (type === "crypto") {
      const cryptoSymbols = CRYPTO_PAIRS.map((p) => `${p}.CC`);
      const quotes = await fetchEODHDBatchQuotes(cryptoSymbols);
      const data = CRYPTO_PAIRS.map((pair, i) => {
        const q = quotes[i];
        return {
          pair,
          price: q?.close ?? 0,
          change: q?.change ?? 0,
          changePercent: q?.change_p ?? 0,
        };
      });
      return NextResponse.json({ data });
    }

    if (type === "quote" && symbol) {
      const s = exchange ? `${symbol}.${exchange}` : symbol;
      const quote = await fetchEODHDRealtime(s);
      return NextResponse.json({ data: quote });
    }

    if (type === "history" && symbol) {
      const s = exchange ? `${symbol}.${exchange}` : symbol;
      const days = range === "1mo" ? 30 : range === "6mo" ? 180 : range === "1y" ? 365 : 90;
      const from = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
      const bars = await fetchEODHDHistory(s, from);
      return NextResponse.json({ symbol: s, data: bars });
    }

    if (type === "fundamentals" && symbol) {
      const s = exchange ? `${symbol}.${exchange}` : `${symbol}.US`;
      const data = await fetchEODHDFundamentals(s);
      return NextResponse.json({ data });
    }

    if (type === "search" && query) {
      const results = await searchEODHDSymbols(query, exchange || undefined);
      return NextResponse.json({ data: results });
    }

    return NextResponse.json({
      error: "Invalid request",
      types: ["indices", "commodities", "forex", "crypto", "quote", "history", "fundamentals", "search"],
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Global markets fetch failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
