import { NextRequest, NextResponse } from "next/server";
import { fetchQuotes, fetchHistory, historyToChartData } from "@/lib/market/yahoo-finance";
import { generateWatchlistPrices, generatePriceHistory } from "@/lib/data/mockMarketData";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BTC-USD", "ETH-USD", "SPY"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "quotes";
  const symbolsParam = searchParams.get("symbols");
  const symbol = searchParams.get("symbol");
  const range = searchParams.get("range") || "3mo";

  try {
    if (type === "quotes") {
      const symbols = symbolsParam ? symbolsParam.split(",") : DEFAULT_SYMBOLS;
      const quotes = await fetchQuotes(symbols);

      if (quotes.length > 0) {
        return NextResponse.json({ source: "live", data: quotes });
      }

      const mock = generateWatchlistPrices();
      const fallback = Object.entries(mock).map(([sym, info]) => ({
        symbol: sym,
        name: sym,
        price: info.price,
        change: info.change * info.price / 100,
        changePercent: info.change,
        previousClose: info.price - (info.change * info.price / 100),
        open: info.price,
        dayHigh: info.price * 1.01,
        dayLow: info.price * 0.99,
        volume: Math.floor(Math.random() * 50000000),
      }));
      return NextResponse.json({ source: "mock", data: fallback });
    }

    if (type === "history" && symbol) {
      const bars = await fetchHistory(symbol, range);

      if (bars.length > 0) {
        return NextResponse.json({
          source: "live",
          symbol,
          bars,
          chart: historyToChartData(bars),
        });
      }

      const baseMap: Record<string, number> = {
        AAPL: 198, MSFT: 425, GOOGL: 176, NVDA: 875, TSLA: 248, META: 505,
        "BTC-USD": 67500, "ETH-USD": 3450, SPY: 525,
      };
      const days = range === "1mo" ? 30 : range === "6mo" ? 180 : range === "1y" ? 365 : 90;
      const mockChart = generatePriceHistory(symbol, days, baseMap[symbol] || 100);
      return NextResponse.json({
        source: "mock",
        symbol,
        bars: [],
        chart: mockChart,
      });
    }

    return NextResponse.json({ error: "Invalid request. Use type=quotes or type=history&symbol=AAPL" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
