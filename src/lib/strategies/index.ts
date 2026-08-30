import {
  SMA, EMA, RSI, MACD, bollingerBands, ATR, ADX, stochastic, ichimokuCloud,
  sharpeRatio, maxDrawdown, volatility, returns, kellyFraction, positionSize,
  sortinoRatio, calmarRatio, valueAtRisk, expectedShortfall, maxDrawdownDuration,
} from "@/lib/financial/functions";
import type { BacktestResult } from "@/types";

export interface StrategyConfig {
  id: string;
  name: string;
  category: "trend" | "mean-reversion" | "momentum" | "volatility" | "composite";
  description: string;
  params: Record<string, { default: number; min: number; max: number; label: string }>;
}

export const STRATEGIES: StrategyConfig[] = [
  {
    id: "sma_crossover", name: "SMA Crossover", category: "trend",
    description: "Buy when fast SMA crosses above slow SMA, sell on cross below. Classic trend-following.",
    params: {
      fastPeriod: { default: 10, min: 3, max: 50, label: "Fast Period" },
      slowPeriod: { default: 30, min: 10, max: 200, label: "Slow Period" },
    },
  },
  {
    id: "ema_crossover", name: "EMA Crossover", category: "trend",
    description: "Same as SMA crossover but with exponential moving averages for faster signal.",
    params: {
      fastPeriod: { default: 12, min: 3, max: 50, label: "Fast Period" },
      slowPeriod: { default: 26, min: 10, max: 200, label: "Slow Period" },
    },
  },
  {
    id: "rsi_mean_reversion", name: "RSI Mean Reversion", category: "mean-reversion",
    description: "Buy when RSI drops below oversold level, sell when overbought. Wilder's classic.",
    params: {
      period: { default: 14, min: 5, max: 30, label: "RSI Period" },
      oversold: { default: 30, min: 10, max: 40, label: "Oversold Level" },
      overbought: { default: 70, min: 60, max: 90, label: "Overbought Level" },
    },
  },
  {
    id: "momentum", name: "Momentum", category: "momentum",
    description: "Buy on positive momentum threshold, sell on negative. Jegadeesh & Titman inspired.",
    params: {
      lookback: { default: 20, min: 5, max: 60, label: "Lookback Days" },
      threshold: { default: 2, min: 0.5, max: 10, label: "Threshold %" },
    },
  },
  {
    id: "macd_signal", name: "MACD Signal", category: "trend",
    description: "Buy on MACD bullish crossover, sell on bearish crossover. Appel's original system.",
    params: {
      fastPeriod: { default: 12, min: 5, max: 20, label: "Fast EMA" },
      slowPeriod: { default: 26, min: 15, max: 50, label: "Slow EMA" },
      signalPeriod: { default: 9, min: 3, max: 15, label: "Signal Period" },
    },
  },
  {
    id: "bollinger_squeeze", name: "Bollinger Squeeze", category: "volatility",
    description: "Enter after bandwidth contracts then expands. Low volatility precedes big moves.",
    params: {
      period: { default: 20, min: 10, max: 50, label: "BB Period" },
      stdDev: { default: 2, min: 1, max: 3, label: "Std Dev" },
      squeezeThreshold: { default: 4, min: 1, max: 10, label: "Squeeze Width %" },
    },
  },
  {
    id: "bollinger_bounce", name: "Bollinger Bounce", category: "mean-reversion",
    description: "Buy at lower band, sell at upper band. Band-to-band mean reversion.",
    params: {
      period: { default: 20, min: 10, max: 50, label: "BB Period" },
      stdDev: { default: 2, min: 1, max: 3, label: "Std Dev" },
    },
  },
  {
    id: "adx_trend", name: "ADX Trend Following", category: "trend",
    description: "Only trade when ADX confirms strong trend (>25). Welles Wilder's DMI system.",
    params: {
      adxPeriod: { default: 14, min: 7, max: 30, label: "ADX Period" },
      adxThreshold: { default: 25, min: 15, max: 40, label: "ADX Threshold" },
      smaPeriod: { default: 20, min: 10, max: 50, label: "SMA Period" },
    },
  },
  {
    id: "ichimoku", name: "Ichimoku Cloud", category: "composite",
    description: "Enter on cloud breakout with Tenkan-Kijun confirmation. Complete Japanese system.",
    params: {
      tenkanPeriod: { default: 9, min: 5, max: 20, label: "Tenkan Period" },
      kijunPeriod: { default: 26, min: 15, max: 52, label: "Kijun Period" },
      senkouBPeriod: { default: 52, min: 30, max: 100, label: "Senkou B Period" },
    },
  },
  {
    id: "stochastic_rsi", name: "Stochastic + RSI", category: "composite",
    description: "Combined stochastic and RSI signals. Dual confirmation reduces false signals.",
    params: {
      rsiPeriod: { default: 14, min: 5, max: 30, label: "RSI Period" },
      stochPeriod: { default: 14, min: 5, max: 30, label: "Stochastic Period" },
      oversold: { default: 20, min: 10, max: 35, label: "Oversold" },
      overbought: { default: 80, min: 65, max: 90, label: "Overbought" },
    },
  },
  {
    id: "turtle_breakout", name: "Turtle Breakout", category: "trend",
    description: "Buy on N-day high breakout, sell on N-day low. Richard Dennis' Turtle system.",
    params: {
      entryPeriod: { default: 20, min: 10, max: 55, label: "Entry Period" },
      exitPeriod: { default: 10, min: 5, max: 30, label: "Exit Period" },
    },
  },
  {
    id: "mean_reversion_zscore", name: "Z-Score Mean Reversion", category: "mean-reversion",
    description: "Trade when price deviates >N standard deviations from rolling mean.",
    params: {
      lookback: { default: 20, min: 10, max: 60, label: "Lookback" },
      entryZ: { default: 2, min: 1, max: 3, label: "Entry Z-Score" },
      exitZ: { default: 0, min: -1, max: 1, label: "Exit Z-Score" },
    },
  },
  {
    id: "dual_momentum", name: "Dual Momentum", category: "momentum",
    description: "Absolute + relative momentum. Gary Antonacci's dual momentum approach.",
    params: {
      lookback: { default: 12, min: 3, max: 24, label: "Lookback Months" },
      rebalanceDays: { default: 21, min: 5, max: 63, label: "Rebalance Period" },
    },
  },
  {
    id: "volatility_breakout", name: "Volatility Breakout", category: "volatility",
    description: "Larry Williams' volatility breakout. Enter on range expansion from open.",
    params: {
      kFactor: { default: 0.6, min: 0.2, max: 1.0, label: "K Factor" },
    },
  },
];

interface TradeEngine {
  cash: number;
  shares: number;
  position: 0 | 1;
  equity: number[];
  signals: BacktestResult["signals"];
  wins: number;
  losses: number;
  entryPrice: number;
}

function createEngine(initialCash = 10000): TradeEngine {
  return { cash: initialCash, shares: 0, position: 0, equity: [], signals: [], wins: 0, losses: 0, entryPrice: 0 };
}

function buy(engine: TradeEngine, price: number, index: number) {
  if (engine.position === 1) return;
  engine.shares = Math.floor(engine.cash / price);
  engine.cash -= engine.shares * price;
  engine.position = 1;
  engine.entryPrice = price;
  engine.signals.push({ index, type: "buy", price });
}

function sell(engine: TradeEngine, price: number, index: number) {
  if (engine.position === 0) return;
  engine.cash += engine.shares * price;
  if (price > engine.entryPrice) engine.wins++;
  else engine.losses++;
  engine.shares = 0;
  engine.position = 0;
  engine.signals.push({ index, type: "sell", price });
}

function recordEquity(engine: TradeEngine, price: number) {
  engine.equity.push(engine.cash + engine.shares * price);
}

function closePosition(engine: TradeEngine, price: number, index: number) {
  if (engine.position === 1) sell(engine, price, index);
}

function buildResult(engine: TradeEngine, strategyName: string, symbol: string): BacktestResult {
  const trades = engine.wins + engine.losses;
  const equityReturns = returns(engine.equity);
  const finalEquity = engine.equity[engine.equity.length - 1] || 10000;
  const sr = sharpeRatio(equityReturns);
  const sortino = sortinoRatio(equityReturns);
  const calmar = calmarRatio(equityReturns, engine.equity);
  const mdd = maxDrawdown(engine.equity);
  const mddDuration = maxDrawdownDuration(engine.equity);
  const vol = volatility(equityReturns);
  const winRate = trades > 0 ? (engine.wins / trades) * 100 : 0;
  const var95 = valueAtRisk(equityReturns, 0.95);
  const es95 = expectedShortfall(equityReturns, 0.95);

  const avgWin = engine.wins > 0 ? (finalEquity - 10000) / engine.wins : 0;
  const avgLoss = engine.losses > 0 ? (10000 - finalEquity) / engine.losses : 0;
  const kelly = kellyFraction(winRate / 100, Math.abs(avgWin) || 1, Math.abs(avgLoss) || 1);

  return {
    strategy: strategyName,
    symbol,
    totalReturn: Math.round(((finalEquity - 10000) / 10000) * 10000) / 100,
    sharpeRatio: Math.round(sr * 1000) / 1000,
    maxDrawdown: Math.round(mdd * 10000) / 100,
    volatility: Math.round(vol * 10000) / 100,
    trades,
    winRate: Math.round(winRate * 100) / 100,
    equity: engine.equity,
    signals: engine.signals,
    sortinoRatio: Math.round(sortino * 1000) / 1000,
    calmarRatio: Math.round(calmar * 1000) / 1000,
    maxDrawdownDuration: mddDuration,
    valueAtRisk: Math.round(var95 * 10000) / 10000,
    expectedShortfall: Math.round(es95 * 10000) / 10000,
    kellyFraction: Math.round(kelly * 1000) / 1000,
  };
}

export function runStrategy(
  strategyId: string,
  closes: number[],
  highs: number[],
  lows: number[],
  volumes: number[],
  params: Record<string, number>,
  symbol: string,
): BacktestResult {
  const e = createEngine();

  switch (strategyId) {
    case "sma_crossover": {
      const fast = SMA(closes, params.fastPeriod || 10);
      const slow = SMA(closes, params.slowPeriod || 30);
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(fast[i]) && !isNaN(slow[i])) {
          if (fast[i] > slow[i]) buy(e, closes[i], i);
          else sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "ema_crossover": {
      const fast = EMA(closes, params.fastPeriod || 12);
      const slow = EMA(closes, params.slowPeriod || 26);
      for (let i = 0; i < closes.length; i++) {
        if (fast[i] > slow[i]) buy(e, closes[i], i);
        else sell(e, closes[i], i);
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "rsi_mean_reversion": {
      const rsi = RSI(closes, params.period || 14);
      const oversold = params.oversold || 30;
      const overbought = params.overbought || 70;
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(rsi[i])) {
          if (rsi[i] < oversold) buy(e, closes[i], i);
          else if (rsi[i] > overbought) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "momentum": {
      const lookback = params.lookback || 20;
      const threshold = (params.threshold || 2) / 100;
      for (let i = 0; i < closes.length; i++) {
        if (i >= lookback) {
          const mom = (closes[i] - closes[i - lookback]) / closes[i - lookback];
          if (mom > threshold) buy(e, closes[i], i);
          else if (mom < -threshold) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "macd_signal": {
      const macd = MACD(closes, params.fastPeriod || 12, params.slowPeriod || 26, params.signalPeriod || 9);
      for (let i = 1; i < closes.length; i++) {
        if (macd.histogram[i] > 0 && macd.histogram[i - 1] <= 0) buy(e, closes[i], i);
        else if (macd.histogram[i] < 0 && macd.histogram[i - 1] >= 0) sell(e, closes[i], i);
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "bollinger_squeeze": {
      const bb = bollingerBands(closes, params.period || 20, params.stdDev || 2);
      const squeezeThreshold = params.squeezeThreshold || 4;
      let inSqueeze = false;
      for (let i = 1; i < closes.length; i++) {
        if (!isNaN(bb.bandwidth[i])) {
          if (bb.bandwidth[i] < squeezeThreshold) inSqueeze = true;
          if (inSqueeze && bb.bandwidth[i] > squeezeThreshold) {
            inSqueeze = false;
            if (closes[i] > bb.middle[i]) buy(e, closes[i], i);
            else sell(e, closes[i], i);
          }
          if (e.position === 1 && closes[i] < bb.middle[i]) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "bollinger_bounce": {
      const bb = bollingerBands(closes, params.period || 20, params.stdDev || 2);
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(bb.lower[i])) {
          if (closes[i] <= bb.lower[i]) buy(e, closes[i], i);
          else if (closes[i] >= bb.upper[i]) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "adx_trend": {
      const adx = ADX(highs, lows, closes, params.adxPeriod || 14);
      const sma = SMA(closes, params.smaPeriod || 20);
      const threshold = params.adxThreshold || 25;
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(adx[i]) && !isNaN(sma[i])) {
          if (adx[i] > threshold && closes[i] > sma[i]) buy(e, closes[i], i);
          else if (adx[i] > threshold && closes[i] < sma[i]) sell(e, closes[i], i);
          else if (adx[i] < threshold && e.position === 1) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "ichimoku": {
      const ich = ichimokuCloud(highs, lows, closes, params.tenkanPeriod || 9, params.kijunPeriod || 26, params.senkouBPeriod || 52);
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(ich.tenkan[i]) && !isNaN(ich.kijun[i]) && !isNaN(ich.senkouA[i]) && !isNaN(ich.senkouB[i])) {
          const cloudTop = Math.max(ich.senkouA[i], ich.senkouB[i]);
          const cloudBottom = Math.min(ich.senkouA[i], ich.senkouB[i]);
          if (closes[i] > cloudTop && ich.tenkan[i] > ich.kijun[i]) buy(e, closes[i], i);
          else if (closes[i] < cloudBottom || ich.tenkan[i] < ich.kijun[i]) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "stochastic_rsi": {
      const rsi = RSI(closes, params.rsiPeriod || 14);
      const stoch = stochastic(highs, lows, closes, params.stochPeriod || 14, 3);
      const oversold = params.oversold || 20;
      const overbought = params.overbought || 80;
      for (let i = 0; i < closes.length; i++) {
        if (!isNaN(rsi[i]) && !isNaN(stoch.k[i])) {
          if (rsi[i] < oversold + 10 && stoch.k[i] < oversold) buy(e, closes[i], i);
          else if (rsi[i] > overbought - 10 && stoch.k[i] > overbought) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "turtle_breakout": {
      const entryP = params.entryPeriod || 20;
      const exitP = params.exitPeriod || 10;
      for (let i = 0; i < closes.length; i++) {
        if (i >= entryP) {
          const entryHigh = Math.max(...highs.slice(i - entryP, i));
          const exitLow = Math.min(...lows.slice(i - exitP, i));
          if (closes[i] > entryHigh) buy(e, closes[i], i);
          else if (closes[i] < exitLow) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "mean_reversion_zscore": {
      const lookback = params.lookback || 20;
      const entryZ = params.entryZ || 2;
      const exitZ = params.exitZ || 0;
      for (let i = 0; i < closes.length; i++) {
        if (i >= lookback) {
          const slice = closes.slice(i - lookback, i);
          const mean = slice.reduce((a, b) => a + b, 0) / lookback;
          const std = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / lookback);
          const z = std > 0 ? (closes[i] - mean) / std : 0;
          if (z < -entryZ) buy(e, closes[i], i);
          else if (z > entryZ) sell(e, closes[i], i);
          else if (e.position === 1 && Math.abs(z) < exitZ + 0.5) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "dual_momentum": {
      const lookback = params.lookback || 12;
      const rebalance = params.rebalanceDays || 21;
      for (let i = 0; i < closes.length; i++) {
        if (i >= lookback * 21 && i % rebalance === 0) {
          const absReturn = (closes[i] - closes[i - lookback * 21]) / closes[i - lookback * 21];
          if (absReturn > 0) buy(e, closes[i], i);
          else sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    case "volatility_breakout": {
      const k = params.kFactor || 0.6;
      for (let i = 1; i < closes.length; i++) {
        const prevRange = highs[i - 1] - lows[i - 1];
        const target = closes[i - 1] + prevRange * k;
        if (closes[i] > target) buy(e, closes[i], i);
        if (e.position === 1 && i > 0) {
          // exit at "close" of day
          if (closes[i] < closes[i - 1]) sell(e, closes[i], i);
        }
        recordEquity(e, closes[i]);
      }
      break;
    }
    default: {
      for (let i = 0; i < closes.length; i++) recordEquity(e, closes[i]);
    }
  }

  closePosition(e, closes[closes.length - 1], closes.length - 1);
  const config = STRATEGIES.find(s => s.id === strategyId);
  return buildResult(e, config?.name || strategyId, symbol);
}
