import { getSupabaseAdmin, isSupabaseAdminConfigured } from "./supabase";
import { fetchExchangeSymbols, fetchEODHDHistory, GLOBAL_EXCHANGES } from "../market/eodhd";

const allExchanges = Object.entries(GLOBAL_EXCHANGES).flatMap(([region, exchanges]) =>
  exchanges.map((ex) => ({ ...ex, region })),
);

export async function seedExchanges(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const rows = allExchanges.map((ex) => ({
    code: ex.code,
    name: ex.name,
    country: ex.country,
    currency: ex.currency,
    region: ex.region,
  }));
  const { error } = await getSupabaseAdmin().from("exchanges").upsert(rows, { onConflict: "code" });
  if (error) throw new Error(`seedExchanges: ${error.message}`);
  return rows.length;
}

export async function syncExchangeStocks(exchangeCode: string): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const exMeta = allExchanges.find((e) => e.code === exchangeCode);
  if (!exMeta) throw new Error(`Unknown exchange: ${exchangeCode}`);

  const symbols = await fetchExchangeSymbols(exchangeCode);
  if (symbols.length === 0) return 0;

  const batch = symbols.map((s) => ({
    code: s.Code,
    name: s.Name || s.Code,
    exchange: exchangeCode,
    type: s.Type || "Common Stock",
    country: exMeta.country,
    currency: exMeta.currency,
  }));

  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < batch.length; i += CHUNK) {
    const chunk = batch.slice(i, i + CHUNK);
    const { error } = await getSupabaseAdmin().from("stocks").upsert(chunk, { onConflict: "code,exchange" });
    if (error) throw new Error(`syncExchangeStocks chunk ${i}: ${error.message}`);
    inserted += chunk.length;
  }

  await getSupabaseAdmin()
    .from("exchanges")
    .update({ stock_count: inserted, last_synced: new Date().toISOString() })
    .eq("code", exchangeCode);

  return inserted;
}

export async function downloadStockHistory(
  stockId: number,
  fullSymbol: string,
  fromDate = "1990-01-01",
): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;

  const bars = await fetchEODHDHistory(fullSymbol, fromDate, undefined, "d");
  if (bars.length === 0) return 0;

  const CHUNK = 1000;
  let inserted = 0;
  for (let i = 0; i < bars.length; i += CHUNK) {
    const chunk = bars.slice(i, i + CHUNK).map((b) => ({
      stock_id: stockId,
      date: b.date,
      open: b.open,
      high: b.high,
      low: b.low,
      close: b.close,
      adjusted_close: b.adjusted_close,
      volume: b.volume,
    }));
    const { error } = await getSupabaseAdmin()
      .from("daily_prices")
      .upsert(chunk, { onConflict: "stock_id,date" });
    if (error) throw new Error(`downloadStockHistory chunk ${i}: ${error.message}`);
    inserted += chunk.length;
  }

  return inserted;
}

export async function ingestExchange(
  exchangeCode: string,
  options: { fromDate?: string; stockType?: string; limit?: number; offset?: number } = {},
): Promise<{ jobId: number; processed: number; failed: number }> {
  if (!isSupabaseAdminConfigured()) throw new Error("Supabase admin not configured");

  const exMeta = allExchanges.find((e) => e.code === exchangeCode);
  if (!exMeta) throw new Error(`Unknown exchange: ${exchangeCode}`);

  const fromDate = options.fromDate || "1990-01-01";
  const stockType = options.stockType || "Common Stock";

  await syncExchangeStocks(exchangeCode);

  let query = getSupabaseAdmin()
    .from("stocks")
    .select("id, code, exchange, full_symbol")
    .eq("exchange", exchangeCode)
    .eq("is_active", true);

  if (stockType !== "all") query = query.eq("type", stockType);
  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 50) - 1);

  const { data: stockRows, error: stockErr } = await query;
  if (stockErr) throw new Error(`ingestExchange stocks query: ${stockErr.message}`);
  if (!stockRows || stockRows.length === 0) return { jobId: 0, processed: 0, failed: 0 };

  const { data: job, error: jobErr } = await getSupabaseAdmin()
    .from("ingest_jobs")
    .insert({
      exchange: exchangeCode,
      country: exMeta.country,
      status: "running",
      total_stocks: stockRows.length,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (jobErr) throw new Error(`ingestExchange job create: ${jobErr.message}`);
  const jobId = job.id;

  let processed = 0;
  let failed = 0;

  for (const stock of stockRows) {
    try {
      await downloadStockHistory(stock.id, stock.full_symbol, fromDate);
      processed++;
    } catch {
      failed++;
    }

    if ((processed + failed) % 10 === 0) {
      await getSupabaseAdmin()
        .from("ingest_jobs")
        .update({ processed_stocks: processed, failed_stocks: failed })
        .eq("id", jobId);
    }
  }

  await getSupabaseAdmin()
    .from("ingest_jobs")
    .update({
      status: failed === stockRows.length ? "failed" : "completed",
      processed_stocks: processed,
      failed_stocks: failed,
      completed_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  return { jobId, processed, failed };
}

export async function ingestCountry(
  country: string,
  options: { fromDate?: string; stockType?: string; limit?: number } = {},
): Promise<{ totalProcessed: number; totalFailed: number; exchanges: string[] }> {
  const countryExchanges = allExchanges.filter((e) => e.country === country);
  if (countryExchanges.length === 0) throw new Error(`No exchanges for country: ${country}`);

  let totalProcessed = 0;
  let totalFailed = 0;
  const exchangeCodes: string[] = [];

  for (const ex of countryExchanges) {
    const result = await ingestExchange(ex.code, options);
    totalProcessed += result.processed;
    totalFailed += result.failed;
    exchangeCodes.push(ex.code);
  }

  return { totalProcessed, totalFailed, exchanges: exchangeCodes };
}

export async function getStoredHistory(
  symbol: string,
  exchange: string,
  fromDate?: string,
  toDate?: string,
): Promise<Array<{
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}>> {
  if (!isSupabaseAdminConfigured()) return [];

  const { data: stock } = await getSupabaseAdmin()
    .from("stocks")
    .select("id")
    .eq("code", symbol)
    .eq("exchange", exchange)
    .single();

  if (!stock) return [];

  let query = getSupabaseAdmin()
    .from("daily_prices")
    .select("date, open, high, low, close, adjusted_close, volume")
    .eq("stock_id", stock.id)
    .order("date", { ascending: true });

  if (fromDate) query = query.gte("date", fromDate);
  if (toDate) query = query.lte("date", toDate);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getDataCoverage(): Promise<
  Array<{
    exchange: string;
    country: string;
    stock_count: number;
    earliest_date: string | null;
    latest_date: string | null;
    total_records: number;
  }>
> {
  if (!isSupabaseAdminConfigured()) return [];
  const { data, error } = await getSupabaseAdmin().from("data_coverage").select("*");
  if (error || !data) return [];
  return data;
}

export async function getIngestJobs(limit = 20): Promise<
  Array<{
    id: number;
    exchange: string;
    country: string;
    status: string;
    total_stocks: number;
    processed_stocks: number;
    failed_stocks: number;
    started_at: string;
    completed_at: string | null;
  }>
> {
  if (!isSupabaseAdminConfigured()) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("ingest_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data;
}
