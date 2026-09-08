export function SMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

export function EMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

export function RSI(data: number[], period = 14): number[] {
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }

  const result: number[] = [NaN];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  for (let i = period; i < changes.length; i++) {
    if (i === period) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    }
    const change = changes[i];
    avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (change < 0 ? Math.abs(change) : 0)) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }

  return result;
}

export function MACD(
  data: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const emaFast = EMA(data, fastPeriod);
  const emaSlow = EMA(data, slowPeriod);
  const macdLine = emaFast.map((f, i) => f - emaSlow[i]);
  const signalLine = EMA(macdLine, signalPeriod);
  const histogram = macdLine.map((m, i) => m - signalLine[i]);
  return { macd: macdLine, signal: signalLine, histogram };
}

export function bollingerBands(
  data: number[],
  period = 20,
  stdDevMultiplier = 2
): { upper: number[]; middle: number[]; lower: number[]; bandwidth: number[]; percentB: number[] } {
  const middle = SMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];
  const bandwidth: number[] = [];
  const percentB: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      bandwidth.push(NaN);
      percentB.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = middle[i];
      const stdDev = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
      const u = mean + stdDevMultiplier * stdDev;
      const l = mean - stdDevMultiplier * stdDev;
      upper.push(u);
      lower.push(l);
      bandwidth.push(((u - l) / mean) * 100);
      percentB.push(u !== l ? (data[i] - l) / (u - l) : 0.5);
    }
  }
  return { upper, middle, lower, bandwidth, percentB };
}

export function ATR(highs: number[], lows: number[], closes: number[], period = 14): number[] {
  const trueRanges: number[] = [highs[0] - lows[0]];
  for (let i = 1; i < highs.length; i++) {
    trueRanges.push(Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    ));
  }

  const result: number[] = [];
  for (let i = 0; i < trueRanges.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period);
    } else {
      result.push((result[i - 1] * (period - 1) + trueRanges[i]) / period);
    }
  }
  return result;
}

export function stochastic(
  highs: number[], lows: number[], closes: number[], kPeriod = 14, dPeriod = 3
): { k: number[]; d: number[] } {
  const k: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < kPeriod - 1) {
      k.push(NaN);
    } else {
      const highSlice = highs.slice(i - kPeriod + 1, i + 1);
      const lowSlice = lows.slice(i - kPeriod + 1, i + 1);
      const hh = Math.max(...highSlice);
      const ll = Math.min(...lowSlice);
      k.push(hh !== ll ? ((closes[i] - ll) / (hh - ll)) * 100 : 50);
    }
  }
  const d = SMA(k.map(v => isNaN(v) ? 0 : v), dPeriod);
  return { k, d };
}

export function ADX(highs: number[], lows: number[], closes: number[], period = 14): number[] {
  const plusDM: number[] = [0];
  const minusDM: number[] = [0];

  for (let i = 1; i < highs.length; i++) {
    const upMove = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  const atr = ATR(highs, lows, closes, period);
  const smoothPlusDM = EMA(plusDM, period);
  const smoothMinusDM = EMA(minusDM, period);

  const dx: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (isNaN(atr[i]) || atr[i] === 0) {
      dx.push(NaN);
    } else {
      const plusDI = (smoothPlusDM[i] / atr[i]) * 100;
      const minusDI = (smoothMinusDM[i] / atr[i]) * 100;
      const sum = plusDI + minusDI;
      dx.push(sum === 0 ? 0 : (Math.abs(plusDI - minusDI) / sum) * 100);
    }
  }

  return SMA(dx.map(v => isNaN(v) ? 0 : v), period);
}

export function OBV(closes: number[], volumes: number[]): number[] {
  const result: number[] = [0];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) result.push(result[i - 1] + volumes[i]);
    else if (closes[i] < closes[i - 1]) result.push(result[i - 1] - volumes[i]);
    else result.push(result[i - 1]);
  }
  return result;
}

export function williamsR(highs: number[], lows: number[], closes: number[], period = 14): number[] {
  const result: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const hh = Math.max(...highs.slice(i - period + 1, i + 1));
      const ll = Math.min(...lows.slice(i - period + 1, i + 1));
      result.push(hh !== ll ? ((hh - closes[i]) / (hh - ll)) * -100 : -50);
    }
  }
  return result;
}

export function VWAP(highs: number[], lows: number[], closes: number[], volumes: number[]): number[] {
  const result: number[] = [];
  let cumVolPrice = 0;
  let cumVol = 0;
  for (let i = 0; i < closes.length; i++) {
    const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
    cumVolPrice += typicalPrice * volumes[i];
    cumVol += volumes[i];
    result.push(cumVol > 0 ? cumVolPrice / cumVol : closes[i]);
  }
  return result;
}

export function ichimokuCloud(highs: number[], lows: number[], closes: number[], tenkanPeriod = 9, kijunPeriod = 26, senkouBPeriod = 52): {
  tenkan: number[]; kijun: number[]; senkouA: number[]; senkouB: number[]; chikou: number[];
} {
  function midline(h: number[], l: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < h.length; i++) {
      if (i < period - 1) { result.push(NaN); continue; }
      const hh = Math.max(...h.slice(i - period + 1, i + 1));
      const ll = Math.min(...l.slice(i - period + 1, i + 1));
      result.push((hh + ll) / 2);
    }
    return result;
  }

  const tenkan = midline(highs, lows, tenkanPeriod);
  const kijun = midline(highs, lows, kijunPeriod);
  const senkouA: number[] = tenkan.map((t, i) => (t + kijun[i]) / 2);
  const senkouB = midline(highs, lows, senkouBPeriod);
  const chikou = [...closes.slice(kijunPeriod), ...Array(kijunPeriod).fill(NaN)];

  return { tenkan, kijun, senkouA, senkouB, chikou };
}

export function fibonacciLevels(high: number, low: number): { level: number; price: number; label: string }[] {
  const diff = high - low;
  return [
    { level: 0, price: low, label: "0%" },
    { level: 0.236, price: low + diff * 0.236, label: "23.6%" },
    { level: 0.382, price: low + diff * 0.382, label: "38.2%" },
    { level: 0.5, price: low + diff * 0.5, label: "50%" },
    { level: 0.618, price: low + diff * 0.618, label: "61.8%" },
    { level: 0.786, price: low + diff * 0.786, label: "78.6%" },
    { level: 1, price: high, label: "100%" },
    { level: 1.272, price: low + diff * 1.272, label: "127.2%" },
    { level: 1.618, price: low + diff * 1.618, label: "161.8%" },
  ];
}

export function sharpeRatio(returns: number[], riskFreeRate = 0.02): number {
  const n = returns.length;
  if (n === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(returns.reduce((s, r) => s + (r - mean) ** 2, 0) / n);
  if (std === 0) return 0;
  return ((mean - riskFreeRate / 252) * Math.sqrt(252)) / std;
}

export function sortinoRatio(rets: number[], riskFreeRate = 0.02): number {
  const n = rets.length;
  if (n === 0) return 0;
  const mean = rets.reduce((a, b) => a + b, 0) / n;
  const dailyRf = riskFreeRate / 252;
  const downside = rets.filter(r => r < dailyRf);
  if (downside.length === 0) return mean > dailyRf ? 99 : 0;
  const downsideDev = Math.sqrt(downside.reduce((s, r) => s + (r - dailyRf) ** 2, 0) / n);
  if (downsideDev === 0) return 0;
  return ((mean - dailyRf) * Math.sqrt(252)) / downsideDev;
}

export function calmarRatio(rets: number[], equity: number[]): number {
  const n = rets.length;
  if (n === 0) return 0;
  const annReturn = rets.reduce((a, b) => a + b, 0) / n * 252;
  const mdd = maxDrawdown(equity);
  return mdd === 0 ? 0 : annReturn / mdd;
}

export function informationRatio(portfolioReturns: number[], benchmarkReturns: number[]): number {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  if (n === 0) return 0;
  const activeReturns = portfolioReturns.slice(0, n).map((r, i) => r - benchmarkReturns[i]);
  const mean = activeReturns.reduce((a, b) => a + b, 0) / n;
  const trackingError = Math.sqrt(activeReturns.reduce((s, r) => s + (r - mean) ** 2, 0) / n) * Math.sqrt(252);
  return trackingError === 0 ? 0 : (mean * 252) / trackingError;
}

export function beta(assetReturns: number[], marketReturns: number[]): number {
  const n = Math.min(assetReturns.length, marketReturns.length);
  if (n < 2) return 1;
  const meanA = assetReturns.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanM = marketReturns.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let cov = 0, varM = 0;
  for (let i = 0; i < n; i++) {
    cov += (assetReturns[i] - meanA) * (marketReturns[i] - meanM);
    varM += (marketReturns[i] - meanM) ** 2;
  }
  return varM === 0 ? 1 : cov / varM;
}

export function valueAtRisk(rets: number[], confidence = 0.95): number {
  const sorted = [...rets].sort((a, b) => a - b);
  const idx = Math.floor((1 - confidence) * sorted.length);
  return sorted[idx] || 0;
}

export function expectedShortfall(rets: number[], confidence = 0.95): number {
  const sorted = [...rets].sort((a, b) => a - b);
  const cutoff = Math.floor((1 - confidence) * sorted.length);
  if (cutoff === 0) return sorted[0] || 0;
  const tail = sorted.slice(0, cutoff);
  return tail.reduce((a, b) => a + b, 0) / tail.length;
}

export function maxDrawdown(equity: number[]): number {
  let peak = equity[0];
  let maxDD = 0;
  for (const val of equity) {
    if (val > peak) peak = val;
    const dd = (peak - val) / peak;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

export function maxDrawdownDuration(equity: number[]): number {
  let peak = equity[0];
  let peakIdx = 0;
  let maxDuration = 0;
  for (let i = 1; i < equity.length; i++) {
    if (equity[i] > peak) {
      peak = equity[i];
      peakIdx = i;
    } else {
      maxDuration = Math.max(maxDuration, i - peakIdx);
    }
  }
  return maxDuration;
}

export function volatility(returns: number[]): number {
  const n = returns.length;
  if (n === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / n;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / n;
  return Math.sqrt(variance * 252);
}

export function returns(prices: number[]): number[] {
  const result: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    result.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return result;
}

export function logReturns(prices: number[]): number[] {
  const result: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    result.push(Math.log(prices[i] / prices[i - 1]));
  }
  return result;
}

export function cumulativeReturns(rets: number[]): number[] {
  const result: number[] = [1];
  for (const r of rets) {
    result.push(result[result.length - 1] * (1 + r));
  }
  return result;
}

export function correlation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const meanA = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanB = b.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let cov = 0, varA = 0, varB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    cov += da * db;
    varA += da * da;
    varB += db * db;
  }
  const denom = Math.sqrt(varA * varB);
  return denom === 0 ? 0 : cov / denom;
}

export function heikinAshi(opens: number[], highs: number[], lows: number[], closes: number[]): {
  haOpen: number[]; haHigh: number[]; haLow: number[]; haClose: number[];
} {
  const haClose = closes.map((c, i) => (opens[i] + highs[i] + lows[i] + c) / 4);
  const haOpen: number[] = [opens[0]];
  for (let i = 1; i < opens.length; i++) {
    haOpen.push((haOpen[i - 1] + haClose[i - 1]) / 2);
  }
  const haHigh = highs.map((h, i) => Math.max(h, haOpen[i], haClose[i]));
  const haLow = lows.map((l, i) => Math.min(l, haOpen[i], haClose[i]));
  return { haOpen, haHigh, haLow, haClose };
}

export function kellyFraction(winRate: number, avgWin: number, avgLoss: number): number {
  if (avgLoss === 0) return 0;
  const b = avgWin / avgLoss;
  return winRate - (1 - winRate) / b;
}

export function positionSize(
  accountSize: number,
  riskPercent: number,
  entryPrice: number,
  stopLoss: number
): { shares: number; riskAmount: number; positionValue: number } {
  const riskAmount = accountSize * (riskPercent / 100);
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  return { shares, riskAmount, positionValue: shares * entryPrice };
}
