import { NextRequest, NextResponse } from "next/server";
import {
  seedExchanges, syncExchangeStocks, ingestExchange, ingestCountry,
  getStoredHistory, getDataCoverage, getIngestJobs,
} from "@/lib/db/ingest";
import { isSupabaseAdminConfigured } from "@/lib/db/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "coverage";
  const symbol = searchParams.get("symbol");
  const exchange = searchParams.get("exchange");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      error: "Database not configured",
      help: "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY",
    }, { status: 503 });
  }

  try {
    if (type === "coverage") {
      const data = await getDataCoverage();
      return NextResponse.json({ data });
    }

    if (type === "jobs") {
      const limit = parseInt(searchParams.get("limit") || "20");
      const data = await getIngestJobs(limit);
      return NextResponse.json({ data });
    }

    if (type === "history" && symbol && exchange) {
      const data = await getStoredHistory(symbol, exchange, from || undefined, to || undefined);
      return NextResponse.json({
        symbol,
        exchange,
        fullSymbol: `${symbol}.${exchange}`,
        records: data.length,
        dateRange: data.length > 0 ? { from: data[0].date, to: data[data.length - 1].date } : null,
        data,
      });
    }

    return NextResponse.json({
      error: "Invalid request",
      types: ["coverage", "jobs", "history"],
      example: "?type=history&symbol=AAPL&exchange=US&from=1990-01-01",
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Historical data query failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      error: "Database not configured",
      help: "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY",
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "seed-exchanges") {
      const count = await seedExchanges();
      return NextResponse.json({ success: true, exchangesSeeded: count });
    }

    if (action === "sync-stocks" && body.exchange) {
      const count = await syncExchangeStocks(body.exchange);
      return NextResponse.json({ success: true, exchange: body.exchange, stocksSynced: count });
    }

    if (action === "ingest-exchange" && body.exchange) {
      const result = await ingestExchange(body.exchange, {
        fromDate: body.fromDate || "1990-01-01",
        stockType: body.stockType || "Common Stock",
        limit: body.limit,
        offset: body.offset,
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "ingest-country" && body.country) {
      const result = await ingestCountry(body.country, {
        fromDate: body.fromDate || "1990-01-01",
        stockType: body.stockType || "Common Stock",
        limit: body.limit,
      });
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({
      error: "Invalid action",
      actions: [
        { action: "seed-exchanges", description: "Insert all exchange definitions into DB" },
        { action: "sync-stocks", params: "exchange", description: "Download stock list for an exchange" },
        { action: "ingest-exchange", params: "exchange, fromDate?, stockType?, limit?, offset?", description: "Download historical data for all stocks on an exchange" },
        { action: "ingest-country", params: "country, fromDate?, stockType?, limit?", description: "Download historical data for all stocks in a country" },
      ],
      examples: [
        { action: "seed-exchanges" },
        { action: "sync-stocks", exchange: "XETRA" },
        { action: "ingest-exchange", exchange: "US", fromDate: "1990-01-01", limit: 100 },
        { action: "ingest-country", country: "Germany", fromDate: "1990-01-01" },
      ],
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Ingest action failed", detail: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
