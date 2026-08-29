import { NextRequest, NextResponse } from "next/server";
import { SMA, EMA, RSI, returns, sharpeRatio, maxDrawdown, volatility, cumulativeReturns } from "@/lib/financial/functions";
import { fetchHistory } from "@/lib/market/yahoo-finance";
import { generatePriceHistory } from "@/lib/data/mockMarketData";

type Strategy = "sma_crossover" | "rsi_mean_reversion" | "momentum";

interface BacktestResult {
  strategy: string;
  symbol: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  trades: number;
  winRate: number;
  equity: number[];
  signals: Array<{ index: number; type: "buy" | "sell"; price: number }>;
}

function runSMACrossover(closes: number[], fastPeriod: number, slowPeriod: number): BacktestResult {
  const fast = SMA(closes, fastPeriod);
  const slow = SMA(closes, slowPeriod);
  let position = 0;
  let cash = 10000;
  let shares = 0;
  const equity: number[] = [];
  const signals: BacktestResult["signals"] = [];
  let wins = 0;
  let trades = 0;
  let entryPrice = 0;

  for (let i = 0; i < closes.length; i++) {
    if (!isNaN(fast[i]) && !isNaN(slow[i])) {
      if (fast[i] > slow[i] && position === 0) {
        shares = Math.floor(cash / closes[i]);
        cash -= shares * closes[i];
        position = 1;
        entryPrice = closes[i];
        signals.push({ index: i, type: "buy", price: closes[i] });
      } else if (fast[i] < slow[i] && position === 1) {
        cash += shares * closes[i];
        if (closes[i] > entryPrice) wins++;
        trades++;
        shares = 0;
        position = 0;
        signals.push({ index: i, type: "sell", price: closes[i] });
      }
    }
    equity.push(cash + shares * closes[i]);
  }

  if (position === 1) {
    cash += shares * closes[closes.length - 1];
    if (closes[closes.length - 1] > entryPrice) wins++;
    trades++;
  }

  const equityReturns = returns(equity);
  return {
    strategy: `SMA Crossover (${fastPeriod}/${slowPeriod})`,
    symbol: "",
    totalReturn: Math.round(((cash - 10000) / 10000) * 10000) / 100,
    sharpeRatio: Math.round(sharpeRatio(equityReturns) * 1000) / 1000,
    maxDrawdown: Math.round(maxDrawdown(equity) * 10000) / 100,
    volatility: Math.round(volatility(equityReturns) * 10000) / 100,
    trades,
    winRate: trades > 0 ? Math.round((wins / trades) * 10000) / 100 : 0,
    equity,
    signals,
  };
}

function runRSIMeanReversion(closes: number[], period: number, oversold: number, overbought: number): BacktestResult {
  const rsi = RSI(closes, period);
  let cash = 10000;
  let shares = 0;
  let position = 0;
  const equity: number[] = [];
  const signals: BacktestResult["signals"] = [];
  let wins = 0;
  let trades = 0;
  let entryPrice = 0;

  for (let i = 0; i < closes.length; i++) {
    if (!isNaN(rsi[i])) {
      if (rsi[i] < oversold && position === 0) {
        shares = Math.floor(cash / closes[i]);
        cash -= shares * closes[i];
        position = 1;
        entryPrice = closes[i];
        signals.push({ index: i, type: "buy", price: closes[i] });
      } else if (rsi[i] > overbought && position === 1) {
        cash += shares * closes[i];
        if (closes[i] > entryPrice) wins++;
        trades++;
        shares = 0;
        position = 0;
        signals.push({ index: i, type: "sell", price: closes[i] });
      }
    }
    equity.push(cash + shares * closes[i]);
  }

  if (position === 1) {
    cash += shares * closes[closes.length - 1];
    if (closes[closes.length - 1] > entryPrice) wins++;
    trades++;
  }

  const equityReturns = returns(equity);
  return {
    strategy: `RSI Mean Reversion (${period}, ${oversold}/${overbought})`,
    symbol: "",
    totalReturn: Math.round(((cash - 10000) / 10000) * 10000) / 100,
    sharpeRatio: Math.round(sharpeRatio(equityReturns) * 1000) / 1000,
    maxDrawdown: Math.round(maxDrawdown(equity) * 10000) / 100,
    volatility: Math.round(volatility(equityReturns) * 10000) / 100,
    trades,
    winRate: trades > 0 ? Math.round((wins / trades) * 10000) / 100 : 0,
    equity,
    signals,
  };
}

function runMomentum(closes: number[], lookback: number): BacktestResult {
  let cash = 10000;
  let shares = 0;
  let position = 0;
  const equity: number[] = [];
  const signals: BacktestResult["signals"] = [];
  let wins = 0;
  let trades = 0;
  let entryPrice = 0;

  for (let i = 0; i < closes.length; i++) {
    if (i >= lookback) {
      const momentum = (closes[i] - closes[i - lookback]) / closes[i - lookback];
      if (momentum > 0.02 && position === 0) {
        shares = Math.floor(cash / closes[i]);
        cash -= shares * closes[i];
        position = 1;
        entryPrice = closes[i];
        signals.push({ index: i, type: "buy", price: closes[i] });
      } else if (momentum < -0.02 && position === 1) {
        cash += shares * closes[i];
        if (closes[i] > entryPrice) wins++;
        trades++;
        shares = 0;
        position = 0;
        signals.push({ index: i, type: "sell", price: closes[i] });
      }
    }
    equity.push(cash + shares * closes[i]);
  }

  if (position === 1) {
    cash += shares * closes[closes.length - 1];
    if (closes[closes.length - 1] > entryPrice) wins++;
    trades++;
  }

  const equityReturns = returns(equity);
  return {
    strategy: `Momentum (${lookback}-day)`,
    symbol: "",
    totalReturn: Math.round(((cash - 10000) / 10000) * 10000) / 100,
    sharpeRatio: Math.round(sharpeRatio(equityReturns) * 1000) / 1000,
    maxDrawdown: Math.round(maxDrawdown(equity) * 10000) / 100,
    volatility: Math.round(volatility(equityReturns) * 10000) / 100,
    trades,
    winRate: trades > 0 ? Math.round((wins / trades) * 10000) / 100 : 0,
    equity,
    signals,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol") || "AAPL";
  const strategy = (searchParams.get("strategy") || "sma_crossover") as Strategy;
  const range = searchParams.get("range") || "1y";

  let closes: number[];
  let source = "live";

  const bars = await fetchHistory(symbol, range);
  if (bars.length > 0) {
    closes = bars.filter((b) => b.close > 0).map((b) => b.close);
  } else {
    source = "mock";
    const baseMap: Record<string, number> = {
      AAPL: 198, MSFT: 425, GOOGL: 176, NVDA: 875, TSLA: 248,
    };
    const days = range === "6mo" ? 180 : range === "2y" ? 500 : 365;
    const mock = generatePriceHistory(symbol, days, baseMap[symbol] || 100);
    closes = mock.map((d) => d.value);
  }

  if (closes.length < 30) {
    return NextResponse.json({ error: "Not enough data for backtest" }, { status: 400 });
  }

  let result: BacktestResult;
  switch (strategy) {
    case "rsi_mean_reversion":
      result = runRSIMeanReversion(closes, 14, 30, 70);
      break;
    case "momentum":
      result = runMomentum(closes, 20);
      break;
    case "sma_crossover":
    default:
      result = runSMACrossover(closes, 10, 30);
      break;
  }

  result.symbol = symbol;

  const buyHoldReturn = Math.round(((closes[closes.length - 1] - closes[0]) / closes[0]) * 10000) / 100;

  return NextResponse.json({
    source,
    result,
    benchmark: {
      strategy: "Buy & Hold",
      totalReturn: buyHoldReturn,
    },
  });
}
