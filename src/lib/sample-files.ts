import { FileNode } from "@/types";

export const sampleFiles: FileNode[] = [
  {
    name: "strategies",
    path: "/strategies",
    type: "folder",
    children: [
      {
        name: "ism_wish_rotation.py",
        path: "/strategies/ism_wish_rotation.py",
        type: "file",
        language: "python",
        content: `# NUR Finance - WISH Framework Systematic Rotation
# James Simons / Quantitative Rigorous Engine
# Sharpe ~0.78, t=2.73, Zero Equity Correlation

import numpy as np

class WISHRotationEngine:
    def __init__(self, vix_threshold=30.0, leverage=3.5):
        self.vix_threshold = vix_threshold
        self.leverage = leverage
        self.ruin_barrier = 17.0
        
    def evaluate_worldview(self, ism_srv: float, ism_mfg: float, michigan: float) -> str:
        """Michigan >= 85 signals historical ~3.2% GDP expansion."""
        composite = (ism_srv * 0.6) + (ism_mfg * 0.4)
        if composite > 50.0 and michigan >= 85.0:
            return "EXPANSION_LONG_BIAS"
        elif composite < 50.0:
            return "CONTRACTION_DEFENSIVE"
        return "NEUTRAL"

    def gatekeeper_check(self, vix: float) -> bool:
        """VIX < 30 allows long/short stock-pooling. VIX >= 30 invokes cash or 3x contrarian long."""
        return vix < self.vix_threshold

    def calculate_kelly_size(self, mean_ret: float, variance: float) -> float:
        """Continuous Gaussian Kelly: f* = mu / sigma^2."""
        f_star = mean_ret / variance if variance > 0 else 1.0
        return min(f_star, self.leverage)

print(">>> [NUR Quantitative Engine] Initializing WISH Systematic Strategy...")
print(">>> [WISH Matrix] Worldview: ISM Services (54.8), Michigan (88.4 >= 85) -> EXPANSION")
print(">>> [Setup Gate] VIX = 17.82 (< 30) -> PASS (Trading Enabled)")
print(">>> [Discipline] Operating Leverage: 3.5x | Kelly Sizing f* = 13.7x | Ruin Barrier = 17.0x")
print(">>> [Execution] Signal Month X -> Entry Month X+1 Day 5 -> Exit Month X+2 Day 5")
print(">>> [Status] Market-Neutral Pairs Active: Long [NVDA, MSFT, CAT] / Short [NEE, DUK, PLD]")
`,
      },
      {
        name: "momentum.py",
        path: "/strategies/momentum.py",
        type: "file",
        language: "python",
        content: `# AntiGravi Momentum Strategy
# Nur Finance - Quantitative Trading Engine

import numpy as np
from antigravi import Strategy, Portfolio, Signal

class MomentumStrategy(Strategy):
    """
    Dual momentum strategy combining absolute and relative momentum.
    Uses AntiGravi's proprietary signal processing engine.
    """

    def __init__(self, lookback=20, threshold=0.02):
        super().__init__(name="AntiGravi Momentum")
        self.lookback = lookback
        self.threshold = threshold
        self.portfolio = Portfolio(initial_capital=100_000)

    def calculate_momentum(self, prices: np.ndarray) -> float:
        """Calculate rate of change momentum indicator."""
        if len(prices) < self.lookback:
            return 0.0
        return (prices[-1] / prices[-self.lookback] - 1.0)

    def generate_signals(self, data: dict) -> list[Signal]:
        signals = []
        for symbol, prices in data.items():
            mom = self.calculate_momentum(prices)

            if mom > self.threshold:
                signals.append(Signal(
                    symbol=symbol,
                    action="BUY",
                    strength=min(mom / self.threshold, 3.0),
                    reason=f"Momentum: {mom:.4f} > {self.threshold}"
                ))
            elif mom < -self.threshold:
                signals.append(Signal(
                    symbol=symbol,
                    action="SELL",
                    strength=min(abs(mom) / self.threshold, 3.0),
                    reason=f"Momentum: {mom:.4f} < -{self.threshold}"
                ))

        return signals

    def backtest(self, historical_data: dict, start_date: str, end_date: str):
        """Run backtest on historical data."""
        results = self.portfolio.simulate(
            strategy=self,
            data=historical_data,
            start=start_date,
            end=end_date
        )

        print(f"\\n{'='*50}")
        print(f"AntiGravi Backtest Results")
        print(f"{'='*50}")
        print(f"Total Return: {results.total_return:.2%}")
        print(f"Sharpe Ratio: {results.sharpe_ratio:.4f}")
        print(f"Max Drawdown: {results.max_drawdown:.2%}")
        print(f"Win Rate:     {results.win_rate:.2%}")
        print(f"{'='*50}")

        return results


if __name__ == "__main__":
    strategy = MomentumStrategy(lookback=20, threshold=0.015)
    strategy.run(symbols=["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"])
`,
      },
      {
        name: "mean_reversion.py",
        path: "/strategies/mean_reversion.py",
        type: "file",
        language: "python",
        content: `# AntiGravi Mean Reversion Strategy
# Nur Finance - Statistical Arbitrage Module

import numpy as np
from antigravi import Strategy, Signal
from antigravi.indicators import BollingerBands, RSI, ZScore

class MeanReversionStrategy(Strategy):
    """
    Statistical mean reversion using Bollinger Bands and Z-Score.
    Optimized for high-frequency intraday trading.
    """

    def __init__(self, window=20, num_std=2.0, zscore_threshold=2.0):
        super().__init__(name="AntiGravi Mean Reversion")
        self.window = window
        self.num_std = num_std
        self.zscore_threshold = zscore_threshold

    def analyze(self, prices: np.ndarray) -> dict:
        bb = BollingerBands(prices, self.window, self.num_std)
        rsi = RSI(prices, period=14)
        zscore = ZScore(prices, self.window)

        return {
            "upper_band": bb.upper,
            "lower_band": bb.lower,
            "middle_band": bb.middle,
            "rsi": rsi.value,
            "zscore": zscore.value,
            "is_oversold": zscore.value < -self.zscore_threshold,
            "is_overbought": zscore.value > self.zscore_threshold,
        }

    def generate_signals(self, data: dict) -> list[Signal]:
        signals = []
        for symbol, prices in data.items():
            analysis = self.analyze(prices)

            if analysis["is_oversold"] and analysis["rsi"] < 30:
                signals.append(Signal(
                    symbol=symbol,
                    action="BUY",
                    strength=abs(analysis["zscore"]),
                    reason=f"Oversold: Z={analysis['zscore']:.2f}, RSI={analysis['rsi']:.1f}"
                ))
            elif analysis["is_overbought"] and analysis["rsi"] > 70:
                signals.append(Signal(
                    symbol=symbol,
                    action="SELL",
                    strength=abs(analysis["zscore"]),
                    reason=f"Overbought: Z={analysis['zscore']:.2f}, RSI={analysis['rsi']:.1f}"
                ))

        return signals
`,
      },
      {
        name: "antigravi_core.py",
        path: "/strategies/antigravi_core.py",
        type: "file",
        language: "python",
        content: `# AntiGravi Core Engine
# Nur Finance - Gravity-Defying Market Analysis

import numpy as np
from dataclasses import dataclass
from typing import Optional

@dataclass
class MarketGravity:
    """Measures the 'gravitational pull' of market forces."""
    trend_force: float      # Directional momentum
    volatility_mass: float  # Implied volatility weight
    volume_density: float   # Volume-weighted density
    antigrav_score: float   # Net anti-gravity score

class AntiGraviEngine:
    """
    The AntiGravi engine identifies moments when price action
    defies normal market gravity - breakouts, trend reversals,
    and anomalous movements that defy statistical norms.
    """

    def __init__(self, sensitivity=1.5, lookback=50):
        self.sensitivity = sensitivity
        self.lookback = lookback
        self._calibrated = False

    def calibrate(self, historical_prices: np.ndarray):
        """Calibrate engine against historical price distribution."""
        self.mean = np.mean(historical_prices)
        self.std = np.std(historical_prices)
        self.skew = self._calculate_skew(historical_prices)
        self.kurtosis = self._calculate_kurtosis(historical_prices)
        self._calibrated = True
        print(f"[AntiGravi] Calibrated: μ={self.mean:.4f}, σ={self.std:.4f}")

    def measure_gravity(self, prices: np.ndarray, volume: np.ndarray) -> MarketGravity:
        """Measure current market gravity forces."""
        if not self._calibrated:
            self.calibrate(prices)

        trend_force = self._trend_momentum(prices)
        vol_mass = self._volatility_mass(prices)
        vol_density = self._volume_density(volume)

        antigrav = (trend_force * self.sensitivity) / (vol_mass * vol_density + 1e-8)

        return MarketGravity(
            trend_force=trend_force,
            volatility_mass=vol_mass,
            volume_density=vol_density,
            antigrav_score=antigrav
        )

    def detect_anomaly(self, gravity: MarketGravity) -> Optional[str]:
        """Detect anti-gravity anomalies in market behavior."""
        if abs(gravity.antigrav_score) > 3.0:
            direction = "BULLISH" if gravity.antigrav_score > 0 else "BEARISH"
            return f"ANOMALY DETECTED: {direction} anti-gravity event (score: {gravity.antigrav_score:.2f})"
        return None

    def _trend_momentum(self, prices: np.ndarray) -> float:
        returns = np.diff(prices) / prices[:-1]
        weights = np.exp(np.linspace(-1, 0, len(returns)))
        return np.sum(returns * weights) / np.sum(weights)

    def _volatility_mass(self, prices: np.ndarray) -> float:
        returns = np.diff(np.log(prices))
        return np.std(returns) * np.sqrt(252)

    def _volume_density(self, volume: np.ndarray) -> float:
        return np.mean(volume[-5:]) / (np.mean(volume) + 1e-8)

    @staticmethod
    def _calculate_skew(data: np.ndarray) -> float:
        n = len(data)
        mean = np.mean(data)
        std = np.std(data)
        return (n / ((n-1)*(n-2))) * np.sum(((data - mean) / std) ** 3)

    @staticmethod
    def _calculate_kurtosis(data: np.ndarray) -> float:
        n = len(data)
        mean = np.mean(data)
        std = np.std(data)
        return np.mean(((data - mean) / std) ** 4) - 3
`,
      },
    ],
  },
  {
    name: "config",
    path: "/config",
    type: "folder",
    children: [
      {
        name: "settings.json",
        path: "/config/settings.json",
        type: "file",
        language: "json",
        content: `{
  "engine": {
    "name": "AntiGravi",
    "version": "2.1.0",
    "mode": "production"
  },
  "trading": {
    "max_position_size": 0.1,
    "stop_loss": 0.02,
    "take_profit": 0.05,
    "max_daily_trades": 50,
    "slippage_model": "realistic"
  },
  "data": {
    "provider": "antigravi-feed",
    "symbols": ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA"],
    "timeframes": ["1m", "5m", "15m", "1h", "1d"],
    "history_days": 365
  },
  "risk": {
    "max_drawdown": 0.15,
    "var_confidence": 0.95,
    "position_sizing": "kelly",
    "correlation_limit": 0.7
  },
  "api": {
    "host": "0.0.0.0",
    "port": 8080,
    "websocket": true,
    "auth_required": true
  }
}`,
      },
    ],
  },
  {
    name: "README.md",
    path: "/README.md",
    type: "file",
    language: "markdown",
    content: `# AntiGravi IDE - Nur Finance

> Gravity-defying quantitative finance development environment

## Overview
AntiGravi IDE is a web-based development environment designed for
quantitative finance research, algorithmic trading strategy development,
and real-time market analysis.

## Features
- Monaco-powered code editor with financial syntax highlighting
- Real-time portfolio dashboard
- Interactive charting with technical indicators
- Strategy backtesting engine
- Risk management analytics
- Built-in terminal with Python execution

## Quick Start
\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## Architecture
Built with Next.js, TypeScript, and Tailwind CSS.
Powered by the AntiGravi quantitative engine.

---
*Nur Finance © 2024-2026*
`,
  },
  {
    name: "main.py",
    path: "/main.py",
    type: "file",
    language: "python",
    content: `#!/usr/bin/env python3
"""AntiGravi - Nur Finance Main Entry Point"""

from antigravi_core import AntiGraviEngine
from strategies.momentum import MomentumStrategy
from strategies.mean_reversion import MeanReversionStrategy

def main():
    print("=" * 60)
    print("  AntiGravi v2.0 - Nur Finance Quantitative Engine")
    print("  Gravity-defying market analysis powered by AI")
    print("=" * 60)

    engine = AntiGraviEngine(sensitivity=1.5, lookback=50)

    strategies = [
        MomentumStrategy(lookback=20, threshold=0.015),
        MeanReversionStrategy(window=20, num_std=2.0),
    ]

    for strategy in strategies:
        print(f"\\n[+] Loading strategy: {strategy.name}")
        strategy.initialize(engine)

    print("\\n[AntiGravi] All systems nominal. Engine running.")
    print("[AntiGravi] Monitoring 7 symbols across 5 timeframes.")
    print("[AntiGravi] Risk management: ACTIVE")
    print("[AntiGravi] WebSocket feed: CONNECTED")

if __name__ == "__main__":
    main()
`,
  },
];

