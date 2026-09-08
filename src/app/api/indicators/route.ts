import { NextRequest, NextResponse } from "next/server";
import {
  SMA, EMA, RSI, MACD, bollingerBands, ATR, stochastic, ADX, OBV,
  williamsR, ichimokuCloud, fibonacciLevels,
  sharpeRatio, maxDrawdown, volatility, returns,
  sortinoRatio, calmarRatio, valueAtRisk, expectedShortfall,
} from "@/lib/financial/functions";
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

    let closes: number[] = [];
    let highs: number[] = [];
    let lows: number[] = [];
    let volumes: number[] = [];

    const bars = await fetchHistory(symbol, range);
    if (bars.length > 0) {
      const valid = bars.filter((b) => b.close > 0);
      closes = valid.map((b) => b.close);
      highs = valid.map((b) => b.high);
      lows = valid.map((b) => b.low);
      volumes = valid.map((b) => b.volume);
    } else {
      const baseMap: Record<string, number> = {
        AAPL: 198, MSFT: 425, GOOGL: 176, NVDA: 875, TSLA: 248,
      };
      const mock = generatePriceHistory(symbol, 180, baseMap[symbol] || 100);
      closes = mock.map((d) => d.value);
      highs = mock.map((d) => d.value * 1.01);
      lows = mock.map((d) => d.value * 0.99);
      volumes = mock.map(() => Math.floor(Math.random() * 10_000_000));
    }

    if (closes.length < 2) {
      return NextResponse.json({ error: "Not enough data" }, { status: 400 });
    }

    const rets = returns(closes);
    const result: Record<string, unknown> = { symbol, dataPoints: closes.length };
    const all = indicator === "all";

    if (all || indicator === "sma") result.sma = SMA(closes, period);
    if (all || indicator === "ema") result.ema = EMA(closes, period);
    if (all || indicator === "rsi") result.rsi = RSI(closes, period);
    if (all || indicator === "macd") result.macd = MACD(closes);
    if (all || indicator === "bollinger") result.bollinger = bollingerBands(closes, period);
    if (all || indicator === "atr") result.atr = ATR(highs, lows, closes, period);
    if (all || indicator === "stochastic") result.stochastic = stochastic(highs, lows, closes, period);
    if (all || indicator === "adx") result.adx = ADX(highs, lows, closes, period);
    if (all || indicator === "obv") result.obv = OBV(closes, volumes);
    if (all || indicator === "williams") result.williams = williamsR(highs, lows, closes, period);
    if (all || indicator === "ichimoku") result.ichimoku = ichimokuCloud(highs, lows, closes);
    if (all || indicator === "fibonacci") {
      const high = Math.max(...closes);
      const low = Math.min(...closes);
      result.fibonacci = fibonacciLevels(high, low);
    }
    if (all || indicator === "stats") {
      result.stats = {
        sharpeRatio: Math.round(sharpeRatio(rets) * 1000) / 1000,
        sortinoRatio: Math.round(sortinoRatio(rets) * 1000) / 1000,
        calmarRatio: Math.round(calmarRatio(rets, closes) * 1000) / 1000,
        maxDrawdown: Math.round(maxDrawdown(closes) * 10000) / 100,
        volatility: Math.round(volatility(rets) * 10000) / 100,
        totalReturn: Math.round(((closes[closes.length - 1] - closes[0]) / closes[0]) * 10000) / 100,
        valueAtRisk95: Math.round(valueAtRisk(rets, 0.95) * 10000) / 10000,
        expectedShortfall95: Math.round(expectedShortfall(rets, 0.95) * 10000) / 10000,
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Indicator computation failed", detail: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
