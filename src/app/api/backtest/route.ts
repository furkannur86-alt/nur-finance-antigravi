import { NextRequest, NextResponse } from "next/server";
import { runStrategy, STRATEGIES } from "@/lib/strategies";
import { fetchHistory } from "@/lib/market/yahoo-finance";
import { fetchEODHDHistory } from "@/lib/market/eodhd";
import { generatePriceHistory } from "@/lib/data/mockMarketData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get("symbol") || "AAPL";
    const strategyId = searchParams.get("strategy") || "sma_crossover";
    const range = searchParams.get("range") || "1y";
    const exchange = searchParams.get("exchange");

    const config = STRATEGIES.find((s) => s.id === strategyId);
    if (!config) {
      return NextResponse.json(
        { error: "Unknown strategy", available: STRATEGIES.map((s) => s.id) },
        { status: 400 },
      );
    }

    const params: Record<string, number> = {};
    for (const [key, meta] of Object.entries(config.params)) {
      const val = searchParams.get(key);
      params[key] = val ? parseFloat(val) : meta.default;
    }

    let closes: number[] = [];
    let highs: number[] = [];
    let lows: number[] = [];
    let volumes: number[] = [];
    let source = "live";

    if (exchange) {
      const eodhSymbol = `${symbol}.${exchange}`;
      const days = range === "6mo" ? 180 : range === "2y" ? 730 : 365;
      const from = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
      const bars = await fetchEODHDHistory(eodhSymbol, from);
      if (bars.length > 0) {
        closes = bars.map((b) => b.close);
        highs = bars.map((b) => b.high);
        lows = bars.map((b) => b.low);
        volumes = bars.map((b) => b.volume);
        source = "eodhd";
      }
    }

    if (closes.length === 0) {
      const bars = await fetchHistory(symbol, range);
      if (bars.length > 0) {
        const valid = bars.filter((b) => b.close > 0);
        closes = valid.map((b) => b.close);
        highs = valid.map((b) => b.high);
        lows = valid.map((b) => b.low);
        volumes = valid.map((b) => b.volume);
        source = "yahoo";
      }
    }

    if (closes.length === 0) {
      source = "mock";
      const baseMap: Record<string, number> = {
        AAPL: 198, MSFT: 425, GOOGL: 176, NVDA: 875, TSLA: 248,
      };
      const days = range === "6mo" ? 180 : range === "2y" ? 500 : 365;
      const mock = generatePriceHistory(symbol, days, baseMap[symbol] || 100);
      closes = mock.map((d) => d.value);
      highs = mock.map((d) => d.value * 1.01);
      lows = mock.map((d) => d.value * 0.99);
      volumes = mock.map(() => Math.floor(Math.random() * 10_000_000));
    }

    if (closes.length < 30) {
      return NextResponse.json({ error: "Not enough data for backtest" }, { status: 400 });
    }

    const result = runStrategy(strategyId, closes, highs, lows, volumes, params, symbol);
    const buyHoldReturn = Math.round(((closes[closes.length - 1] - closes[0]) / closes[0]) * 10000) / 100;

    return NextResponse.json({
      source,
      result,
      benchmark: { strategy: "Buy & Hold", totalReturn: buyHoldReturn },
      strategyInfo: { id: config.id, name: config.name, category: config.category, description: config.description },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Backtest failed", detail: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
