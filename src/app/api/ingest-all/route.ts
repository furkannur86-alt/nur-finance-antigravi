import { NextRequest } from "next/server";
import {
  seedExchanges,
  syncExchangeStocks,
  downloadStockHistory,
} from "@/lib/db/ingest";
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/db/supabase";
import { GLOBAL_EXCHANGES } from "@/lib/market/eodhd";

const allExchanges = Object.entries(GLOBAL_EXCHANGES).flatMap(([region, exchanges]) =>
  exchanges.map((ex) => ({ ...ex, region })),
);

function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // defaults
  }

  const fromDate = (body.fromDate as string) || "1990-01-01";
  const stockType = (body.stockType as string) || "Common Stock";
  const limitPerExchange = (body.limit as number) || 0;
  const selectedExchanges = (body.exchanges as string[]) || [];
  const selectedRegions = (body.regions as string[]) || [];

  let targetExchanges = allExchanges;
  if (selectedExchanges.length > 0) {
    targetExchanges = allExchanges.filter((e) => selectedExchanges.includes(e.code));
  } else if (selectedRegions.length > 0) {
    targetExchanges = allExchanges.filter((e) => selectedRegions.includes(e.region));
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      try {
        send({ type: "start", totalExchanges: targetExchanges.length, fromDate, stockType });

        send({ type: "phase", phase: "seeding-exchanges" });
        const seeded = await seedExchanges();
        send({ type: "seeded", count: seeded });

        let totalProcessed = 0;
        let totalFailed = 0;
        let totalStocks = 0;

        for (let ei = 0; ei < targetExchanges.length; ei++) {
          const ex = targetExchanges[ei];
          send({
            type: "exchange-start",
            exchange: ex.code,
            name: ex.name,
            country: ex.country,
            region: ex.region,
            index: ei + 1,
            total: targetExchanges.length,
          });

          try {
            await syncExchangeStocks(ex.code);
            send({ type: "stocks-synced", exchange: ex.code });

            let query = getSupabaseAdmin()
              .from("stocks")
              .select("id, code, exchange")
              .eq("exchange", ex.code)
              .eq("is_active", true);

            if (stockType !== "all") query = query.eq("type", stockType);
            if (limitPerExchange > 0) query = query.limit(limitPerExchange);

            const { data: stocks, error: stockErr } = await query;
            if (stockErr || !stocks || stocks.length === 0) {
              send({ type: "exchange-skip", exchange: ex.code, reason: stockErr?.message || "no stocks" });
              continue;
            }

            totalStocks += stocks.length;
            send({ type: "downloading", exchange: ex.code, stockCount: stocks.length });

            let exProcessed = 0;
            let exFailed = 0;

            for (let si = 0; si < stocks.length; si++) {
              const stock = stocks[si];
              try {
                const count = await downloadStockHistory(stock.id, `${stock.code}.${stock.exchange}`, fromDate);
                exProcessed++;
                if ((si + 1) % 5 === 0 || si === stocks.length - 1) {
                  send({
                    type: "progress",
                    exchange: ex.code,
                    current: si + 1,
                    total: stocks.length,
                    processed: exProcessed,
                    failed: exFailed,
                    lastStock: stock.code,
                    records: count,
                  });
                }
              } catch {
                exFailed++;
              }
            }

            totalProcessed += exProcessed;
            totalFailed += exFailed;

            send({
              type: "exchange-done",
              exchange: ex.code,
              processed: exProcessed,
              failed: exFailed,
              totalStocks: stocks.length,
            });
          } catch (err) {
            send({
              type: "exchange-error",
              exchange: ex.code,
              error: err instanceof Error ? err.message : "Unknown",
            });
          }
        }

        send({
          type: "complete",
          totalExchanges: targetExchanges.length,
          totalStocks,
          totalProcessed,
          totalFailed,
        });
      } catch (err) {
        send({ type: "error", error: err instanceof Error ? err.message : "Unknown" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const regions: Record<string, { exchanges: Array<{ code: string; name: string; country: string }>; countries: string[] }> = {};
  for (const [region, exchanges] of Object.entries(GLOBAL_EXCHANGES)) {
    const countries = [...new Set(exchanges.map((e) => e.country))].sort();
    regions[region] = {
      exchanges: exchanges.map((e) => ({ code: e.code, name: e.name, country: e.country })),
      countries,
    };
  }

  return new Response(JSON.stringify({
    regions,
    totalExchanges: allExchanges.length,
    totalCountries: [...new Set(allExchanges.map((e) => e.country))].length,
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
