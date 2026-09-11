/**
 * WISH Framework — Weighted Indicator Signal Harmony
 * NUR Finance proprietary composite algo trading engine.
 *
 * W — Weighted Signals:   Each indicator carries a configurable weight (0–1).
 * I — Indicator Stack:    Multi-indicator confluence — RSI, MACD, EMA, ADX, Bollinger, OBV.
 * S — Signal Strength:    Composite score 0–100; trades only above the configured threshold.
 * H — Harmony Filter:     Market-regime detection (Trending / Ranging / All) gates entries.
 */

import {
  EMA, RSI, MACD, bollingerBands, ADX, OBV,
  ATR, sharpeRatio, maxDrawdown, volatility,
  returns, sortinoRatio, calmarRatio,
  valueAtRisk, expectedShortfall, maxDrawdownDuration, kellyFraction,
} from "@/lib/financial/functions";

export interface WISHWeights {
  rsi: number;       // 0–1
  macd: number;      // 0–1
  emaCross: number;  // 0–1
  adx: number;       // 0–1
  bollinger: number; // 0–1
  obv: number;       // 0–1
}

export type HarmonyMode = "all" | "trending" | "ranging";

export interface WISHParams {
  weights: WISHWeights;
  signalThreshold: number;  // 50–90 — minimum composite score to enter long
  exitThreshold: number;    // 10–50 — exit when score drops below this
  harmonyMode: HarmonyMode;
  emiFast: number;
  emiSlow: number;
  rsiPeriod: number;
  adxPeriod: number;
  adxTrendThreshold: number; // ADX above this = trending regime
  bbPeriod: number;
  bbStdDev: number;
}

export const WISH_DEFAULTS: WISHParams = {
  weights: { rsi: 0.20, macd: 0.22, emaCross: 0.20, adx: 0.15, bollinger: 0.13, obv: 0.10 },
  signalThreshold: 65,
  exitThreshold: 35,
  harmonyMode: "all",
  emiFast: 12,
  emiSlow: 26,
  rsiPeriod: 14,
  adxPeriod: 14,
  adxTrendThreshold: 22,
  bbPeriod: 20,
  bbStdDev: 2,
};

export interface WISHBarSignal {
  index: number;
  score: number;        // 0–100 composite
  regime: "trending" | "ranging" | "volatile";
  rsiScore: number;     // 0–100 per-indicator sub-score
  macdScore: number;
  emaScore: number;
  adxScore: number;
  bbScore: number;
  obvScore: number;
  action: "buy" | "sell" | "hold";
}

export interface WISHResult {
  // Backtest metrics
  strategy: string;
  symbol: string;
  totalReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  volatility: number;
  trades: number;
  winRate: number;
  valueAtRisk: number;
  expectedShortfall: number;
  kellyFraction: number;
  // WISH-specific
  equity: number[];
  signals: Array<{ index: number; type: "buy" | "sell"; price: number }>;
  wishSignals: WISHBarSignal[];
  avgScore: number;
  avgTrendingScore: number;
  avgRangingScore: number;
  params: WISHParams;
}

export function runWISH(
  closes: number[],
  highs: number[],
  lows: number[],
  volumes: number[],
  symbol: string,
  params: WISHParams = WISH_DEFAULTS,
): WISHResult {
  const n = closes.length;
  const { weights, signalThreshold, exitThreshold, harmonyMode } = params;

  // ── Indicator computation ──────────────────────────────────────────────────
  const emaFast   = EMA(closes, params.emiFast);
  const emaSlow   = EMA(closes, params.emiSlow);
  const rsiArr    = RSI(closes, params.rsiPeriod);
  const macdData  = MACD(closes, params.emiFast, params.emiSlow, 9);
  const adxArr    = ADX(highs, lows, closes, params.adxPeriod);
  const bbData    = bollingerBands(closes, params.bbPeriod, params.bbStdDev);
  const obvArr    = OBV(closes, volumes);
  const atrArr    = ATR(highs, lows, closes, params.adxPeriod);

  // Normalise OBV to a rolling z-score for comparability
  function obvZScore(i: number, lookback = 20): number {
    if (i < lookback) return NaN;
    const slice = obvArr.slice(i - lookback, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const std  = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / slice.length);
    return std > 0 ? (obvArr[i] - mean) / std : 0;
  }

  // ── Per-bar scoring ────────────────────────────────────────────────────────
  const wishSignals: WISHBarSignal[] = [];

  for (let i = 0; i < n; i++) {
    // ── Sub-scores (0 = full bear, 50 = neutral, 100 = full bull) ──────────
    // RSI
    const rsi = rsiArr[i];
    let rsiScore = 50;
    if (!isNaN(rsi)) {
      if (rsi <= 30) rsiScore = 85 + (30 - rsi);           // oversold → bullish
      else if (rsi >= 70) rsiScore = 15 - (rsi - 70);       // overbought → bearish
      else rsiScore = 50 + (50 - rsi);                       // linear gradient
      rsiScore = Math.max(0, Math.min(100, rsiScore));
    }

    // MACD histogram
    const hist = macdData.histogram[i];
    const prevHist = i > 0 ? macdData.histogram[i - 1] : 0;
    let macdScore = 50;
    if (!isNaN(hist)) {
      if (hist > 0 && prevHist <= 0) macdScore = 90;        // bullish cross
      else if (hist < 0 && prevHist >= 0) macdScore = 10;   // bearish cross
      else if (hist > 0) macdScore = 65 + Math.min(25, hist / (Math.abs(closes[i]) * 0.001 + 1e-8) * 10);
      else if (hist < 0) macdScore = 35 - Math.min(25, Math.abs(hist) / (Math.abs(closes[i]) * 0.001 + 1e-8) * 10);
      macdScore = Math.max(0, Math.min(100, macdScore));
    }

    // EMA cross
    const ef = emaFast[i], es = emaSlow[i];
    let emaScore = 50;
    if (!isNaN(ef) && !isNaN(es)) {
      const spread = (ef - es) / (es || 1) * 100;           // % above/below slow EMA
      emaScore = Math.max(0, Math.min(100, 50 + spread * 5));
    }

    // ADX — measures trend strength (not direction), used as a multiplier gate
    const adx = adxArr[i];
    let adxScore = 50;
    if (!isNaN(adx)) {
      // Strong trend (adx > threshold) → score pushed toward current direction
      const dir = ef >= es ? 1 : -1;
      adxScore = adx < params.adxTrendThreshold
        ? 50                                                  // weak trend → neutral
        : 50 + dir * Math.min(48, (adx - params.adxTrendThreshold) * 2);
      adxScore = Math.max(0, Math.min(100, adxScore));
    }

    // Bollinger Bands — position within band
    const bbu = bbData.upper[i], bbl = bbData.lower[i];
    let bbScore = 50;
    if (!isNaN(bbu) && !isNaN(bbl) && bbu > bbl) {
      const pos = (closes[i] - bbl) / (bbu - bbl);          // 0 = at lower, 1 = at upper
      // For trend: above mid = bullish; for reversion: near lower = buy opportunity
      bbScore = Math.max(0, Math.min(100, pos * 100));
    }

    // OBV z-score
    const z = obvZScore(i);
    let obvScore = 50;
    if (!isNaN(z)) {
      obvScore = Math.max(0, Math.min(100, 50 + z * 10));
    }

    // ── Weighted composite score ───────────────────────────────────────────
    const totalW = weights.rsi + weights.macd + weights.emaCross + weights.adx + weights.bollinger + weights.obv;
    const composite =
      (weights.rsi * rsiScore + weights.macd * macdScore + weights.emaCross * emaScore +
       weights.adx * adxScore + weights.bollinger * bbScore + weights.obv * obvScore) /
      (totalW || 1);

    // ── Regime detection ──────────────────────────────────────────────────
    let regime: WISHBarSignal["regime"] = "ranging";
    if (!isNaN(adx)) {
      if (adx >= params.adxTrendThreshold + 5) regime = "trending";
      else if (!isNaN(atrArr[i]) && atrArr[i] > (closes[i] * 0.025)) regime = "volatile";
    }

    // ── Harmony gate ──────────────────────────────────────────────────────
    let gated = false;
    if (harmonyMode === "trending" && regime !== "trending") gated = true;
    if (harmonyMode === "ranging" && regime !== "ranging") gated = true;

    wishSignals.push({
      index: i,
      score: Math.round(composite * 10) / 10,
      regime,
      rsiScore: Math.round(rsiScore),
      macdScore: Math.round(macdScore),
      emaScore: Math.round(emaScore),
      adxScore: Math.round(adxScore),
      bbScore: Math.round(bbScore),
      obvScore: Math.round(obvScore),
      action: gated ? "hold" : composite >= signalThreshold ? "buy" : composite <= exitThreshold ? "sell" : "hold",
    });
  }

  // ── Trade simulation ──────────────────────────────────────────────────────
  let cash = 10000, shares = 0, position = 0;
  let wins = 0, losses = 0, entryPrice = 0;
  const equity: number[] = [];
  const signals: WISHResult["signals"] = [];

  for (let i = 0; i < n; i++) {
    const { action } = wishSignals[i];
    const p = closes[i];

    if (action === "buy" && position === 0) {
      shares = Math.floor(cash / p);
      cash -= shares * p;
      position = 1;
      entryPrice = p;
      signals.push({ index: i, type: "buy", price: p });
    } else if (action === "sell" && position === 1) {
      cash += shares * p;
      if (p > entryPrice) wins++; else losses++;
      shares = 0;
      position = 0;
      signals.push({ index: i, type: "sell", price: p });
    }
    equity.push(cash + shares * p);
  }
  // Close open position
  if (position === 1 && n > 0) {
    cash += shares * closes[n - 1];
    if (closes[n - 1] > entryPrice) wins++; else losses++;
    signals.push({ index: n - 1, type: "sell", price: closes[n - 1] });
    equity[n - 1] = cash;
  }

  // ── Metrics ───────────────────────────────────────────────────────────────
  const rets   = returns(equity);
  const final  = equity[equity.length - 1] ?? 10000;
  const trades = wins + losses;
  const winRate = trades > 0 ? (wins / trades) * 100 : 0;
  const mdd = maxDrawdown(equity);
  const vol = volatility(rets);
  const sr  = sharpeRatio(rets);
  const sortino = sortinoRatio(rets);
  const calmar  = calmarRatio(rets, equity);
  const mddDur  = maxDrawdownDuration(equity);
  const var95   = valueAtRisk(rets, 0.95);
  const es95    = expectedShortfall(rets, 0.95);
  const avgWin  = wins > 0 ? (final - 10000) / wins : 0;
  const avgLoss = losses > 0 ? (10000 - final) / losses : 0;
  const kelly   = kellyFraction(winRate / 100, Math.abs(avgWin) || 1, Math.abs(avgLoss) || 1);

  // WISH-specific aggregates
  const validScores = wishSignals.map(s => s.score).filter(s => !isNaN(s));
  const avgScore = validScores.reduce((a, b) => a + b, 0) / (validScores.length || 1);
  const trendingScores = wishSignals.filter(s => s.regime === "trending").map(s => s.score);
  const rangingScores  = wishSignals.filter(s => s.regime === "ranging").map(s => s.score);
  const avgTrendingScore = trendingScores.reduce((a, b) => a + b, 0) / (trendingScores.length || 1);
  const avgRangingScore  = rangingScores.reduce((a, b) => a + b, 0) / (rangingScores.length || 1);

  return {
    strategy: "WISH Framework",
    symbol,
    totalReturn: Math.round(((final - 10000) / 10000) * 10000) / 100,
    sharpeRatio: Math.round(sr * 1000) / 1000,
    sortinoRatio: Math.round(sortino * 1000) / 1000,
    calmarRatio: Math.round(calmar * 1000) / 1000,
    maxDrawdown: Math.round(mdd * 10000) / 100,
    maxDrawdownDuration: mddDur,
    volatility: Math.round(vol * 10000) / 100,
    trades,
    winRate: Math.round(winRate * 100) / 100,
    valueAtRisk: Math.round(var95 * 10000) / 10000,
    expectedShortfall: Math.round(es95 * 10000) / 10000,
    kellyFraction: Math.round(kelly * 1000) / 1000,
    equity,
    signals,
    wishSignals,
    avgScore: Math.round(avgScore * 10) / 10,
    avgTrendingScore: Math.round(avgTrendingScore * 10) / 10,
    avgRangingScore: Math.round(avgRangingScore * 10) / 10,
    params,
  };
}
