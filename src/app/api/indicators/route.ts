import { NextRequest, NextResponse } from "next/server";
import { SMA, EMA, RSI, MACD, sharpeRatio, maxDrawdown, volatility, returns } from "@/lib/financial/functions";
import { fetchHistory } from "@/lib/market/yahoo-finance";
import { generatePriceHistory } from "@/lib/data/mockMarketData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get("symbol");
    const indicator = searchParams.get("indicator") || "all";
    const period = parseInt(searchParams.get("period") || "14");
    const range = searchParams.get("range") || "6mo";

    if (!symbol) {
      return NextResponse.json({ error: "symbol parameter required" }, { status: 400 });
    }

    let closes: number[];

    const bars = await fetchHistory(symbol, range);
    if (bars.length > 0) {
      closes = bars.filter((b) => b.close > 0).map((b) => b.close);
    } else {
      const baseMap: Record<string, number> = {
        AAPL: 198, MSFT: 425, GOOGL: 176, NVDA: 875, TSLA: 248,
      };
      const mock = generatePriceHistory(symbol, 180, baseMap[symbol] || 100);
      closes = mock.map((d) => d.value);
    }

    if (closes.length < 2) {
      return NextResponse.json({ error: "Not enough data" }, { status: 400 });
    }

    const rets = returns(closes);

    const result: Record<string, unknown> = { symbol, dataPoints: closes.length };

    if (indicator === "all" || indicator === "sma") {
      result.sma = SMA(closes, period);
    }
    if (indicator === "all" || indicator === "ema") {
      result.ema = EMA(closes, period);
    }
    if (indicator === "all" || indicator === "rsi") {
      result.rsi = RSI(closes, period);
    }
    if (indicator === "all" || indicator === "macd") {
      result.macd = MACD(closes);
    }
    if (indicator === "all" || indicator === "stats") {
      result.stats = {
        sharpeRatio: Math.round(sharpeRatio(rets) * 1000) / 1000,
        maxDrawdown: Math.round(maxDrawdown(closes) * 10000) / 100,
        volatility: Math.round(volatility(rets) * 10000) / 100,
        totalReturn: Math.round(((closes[closes.length - 1] - closes[0]) / closes[0]) * 10000) / 100,
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Indicator computation failed", detail: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
