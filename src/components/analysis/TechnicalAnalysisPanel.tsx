"use client";
import { useState } from "react";

/* ── Bloomberg-tier Technical Analysis Scanner ───────────────── */

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const txt2 = "#94a3b8";
const green = "#00e5a0";
const red = "#ff4d6a";
const yellow = "#fbbf24";
const blue = "#38bdf8";
const purple = "#a855f7";

type Tab = "signals" | "patterns" | "sr" | "momentum" | "macloud";

interface StockTA {
  ticker: string;
  name: string;
  price: number;
  chg: number;
  rsi: number;
  macd: "bullish" | "bearish" | "neutral";
  bbPos: "upper" | "mid" | "lower";
  maCross: "golden" | "death" | "none";
  stochK: number;
  adx: number;
  volTrend: "rising" | "falling" | "flat";
  ma50: number;
  ma100: number;
  ma200: number;
  support: number[];
  resistance: number[];
}

const STOCKS: StockTA[] = [
  { ticker: "AAPL", name: "Apple", price: 191.24, chg: 1.24, rsi: 62.3, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 71.4, adx: 28.5, volTrend: "rising", ma50: 185.40, ma100: 180.20, ma200: 172.60, support: [185.00, 180.50, 175.20], resistance: [195.00, 200.00, 208.50] },
  { ticker: "MSFT", name: "Microsoft", price: 378.91, chg: 0.87, rsi: 58.7, macd: "bullish", bbPos: "mid", maCross: "golden", stochK: 55.2, adx: 22.1, volTrend: "flat", ma50: 370.80, ma100: 362.40, ma200: 345.20, support: [370.00, 362.00, 350.00], resistance: [385.00, 395.00, 405.00] },
  { ticker: "GOOGL", name: "Alphabet", price: 141.56, chg: 1.56, rsi: 67.4, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 78.9, adx: 32.4, volTrend: "rising", ma50: 135.20, ma100: 130.80, ma200: 122.40, support: [135.00, 130.00, 125.50], resistance: [145.00, 150.00, 155.00] },
  { ticker: "AMZN", name: "Amazon", price: 153.42, chg: 2.12, rsi: 71.2, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 82.1, adx: 35.8, volTrend: "rising", ma50: 145.60, ma100: 138.20, ma200: 125.80, support: [145.00, 140.00, 135.00], resistance: [158.00, 165.00, 172.00] },
  { ticker: "NVDA", name: "NVIDIA", price: 495.22, chg: 3.45, rsi: 74.8, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 88.4, adx: 42.6, volTrend: "rising", ma50: 460.40, ma100: 420.80, ma200: 365.00, support: [475.00, 460.00, 440.00], resistance: [510.00, 530.00, 550.00] },
  { ticker: "TSLA", name: "Tesla", price: 238.45, chg: 2.89, rsi: 48.9, macd: "bearish", bbPos: "mid", maCross: "none", stochK: 42.3, adx: 18.4, volTrend: "falling", ma50: 242.80, ma100: 248.60, ma200: 234.20, support: [230.00, 222.00, 210.00], resistance: [245.00, 255.00, 270.00] },
  { ticker: "META", name: "Meta Platforms", price: 326.78, chg: 1.78, rsi: 64.1, macd: "bullish", bbPos: "mid", maCross: "golden", stochK: 62.8, adx: 26.3, volTrend: "flat", ma50: 318.40, ma100: 305.60, ma200: 278.80, support: [318.00, 310.00, 300.00], resistance: [335.00, 345.00, 358.00] },
  { ticker: "JPM", name: "JPMorgan", price: 158.72, chg: 0.45, rsi: 55.4, macd: "neutral", bbPos: "mid", maCross: "none", stochK: 48.6, adx: 15.2, volTrend: "flat", ma50: 155.20, ma100: 152.40, ma200: 148.60, support: [155.00, 150.00, 145.00], resistance: [162.00, 168.00, 175.00] },
  { ticker: "V", name: "Visa", price: 262.34, chg: 0.56, rsi: 59.8, macd: "bullish", bbPos: "mid", maCross: "golden", stochK: 58.1, adx: 20.4, volTrend: "flat", ma50: 258.60, ma100: 254.20, ma200: 245.80, support: [258.00, 252.00, 245.00], resistance: [268.00, 275.00, 282.00] },
  { ticker: "XOM", name: "Exxon Mobil", price: 104.56, chg: -0.34, rsi: 42.1, macd: "bearish", bbPos: "lower", maCross: "death", stochK: 28.4, adx: 24.8, volTrend: "rising", ma50: 108.40, ma100: 112.60, ma200: 106.80, support: [102.00, 98.00, 95.00], resistance: [108.00, 112.00, 118.00] },
  { ticker: "UNH", name: "UnitedHealth", price: 524.18, chg: -0.89, rsi: 38.2, macd: "bearish", bbPos: "lower", maCross: "death", stochK: 22.6, adx: 30.1, volTrend: "rising", ma50: 535.40, ma100: 542.80, ma200: 528.60, support: [515.00, 505.00, 490.00], resistance: [535.00, 545.00, 555.00] },
  { ticker: "MA", name: "Mastercard", price: 412.56, chg: 0.68, rsi: 61.4, macd: "bullish", bbPos: "mid", maCross: "golden", stochK: 64.2, adx: 21.8, volTrend: "flat", ma50: 405.80, ma100: 398.40, ma200: 382.60, support: [405.00, 398.00, 390.00], resistance: [420.00, 428.00, 435.00] },
  { ticker: "BAC", name: "Bank of America", price: 32.45, chg: -0.56, rsi: 44.6, macd: "bearish", bbPos: "lower", maCross: "none", stochK: 35.8, adx: 16.4, volTrend: "falling", ma50: 33.20, ma100: 33.80, ma200: 32.60, support: [31.50, 30.80, 29.50], resistance: [33.20, 34.00, 35.00] },
  { ticker: "AVGO", name: "Broadcom", price: 892.34, chg: 2.34, rsi: 69.8, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 76.4, adx: 34.2, volTrend: "rising", ma50: 865.20, ma100: 835.40, ma200: 785.60, support: [865.00, 840.00, 810.00], resistance: [910.00, 935.00, 960.00] },
  { ticker: "LLY", name: "Eli Lilly", price: 598.42, chg: 1.12, rsi: 72.4, macd: "bullish", bbPos: "upper", maCross: "golden", stochK: 84.2, adx: 38.6, volTrend: "rising", ma50: 575.80, ma100: 555.20, ma200: 510.40, support: [575.00, 560.00, 545.00], resistance: [610.00, 625.00, 650.00] },
];

interface Pattern {
  pattern: string;
  ticker: string;
  timeframe: string;
  confidence: number;
  completion: number;
  direction: "bullish" | "bearish";
}

const PATTERNS: Pattern[] = [
  { pattern: "Cup & Handle", ticker: "GOOGL", timeframe: "Daily", confidence: 87, completion: 92, direction: "bullish" },
  { pattern: "Bull Flag", ticker: "NVDA", timeframe: "4H", confidence: 82, completion: 78, direction: "bullish" },
  { pattern: "Double Bottom", ticker: "BAC", timeframe: "Daily", confidence: 74, completion: 85, direction: "bullish" },
  { pattern: "Head & Shoulders", ticker: "UNH", timeframe: "Weekly", confidence: 79, completion: 68, direction: "bearish" },
  { pattern: "Ascending Triangle", ticker: "MSFT", timeframe: "Daily", confidence: 71, completion: 72, direction: "bullish" },
  { pattern: "Rising Wedge", ticker: "LLY", timeframe: "Daily", confidence: 65, completion: 55, direction: "bearish" },
  { pattern: "Inverse H&S", ticker: "TSLA", timeframe: "4H", confidence: 68, completion: 62, direction: "bullish" },
  { pattern: "Descending Triangle", ticker: "XOM", timeframe: "Daily", confidence: 76, completion: 81, direction: "bearish" },
];

const MOMENTUM_TICKERS = [
  { t: "AAPL", rsi: 62.3 }, { t: "MSFT", rsi: 58.7 }, { t: "GOOGL", rsi: 67.4 }, { t: "AMZN", rsi: 71.2 },
  { t: "NVDA", rsi: 74.8 }, { t: "TSLA", rsi: 48.9 }, { t: "META", rsi: 64.1 }, { t: "JPM", rsi: 55.4 },
  { t: "V", rsi: 59.8 }, { t: "XOM", rsi: 42.1 }, { t: "UNH", rsi: 38.2 }, { t: "MA", rsi: 61.4 },
  { t: "BAC", rsi: 44.6 }, { t: "AVGO", rsi: 69.8 }, { t: "LLY", rsi: 72.4 }, { t: "COST", rsi: 56.2 },
  { t: "HD", rsi: 51.8 }, { t: "CRM", rsi: 63.5 }, { t: "NFLX", rsi: 68.9 }, { t: "AMD", rsi: 52.4 },
];

function rsiColor(rsi: number): string {
  if (rsi >= 70) return red;
  if (rsi >= 60) return "#ff8c42";
  if (rsi >= 40) return txt2;
  if (rsi >= 30) return "#42a5f5";
  return blue;
}

function rsiBg(rsi: number): string {
  if (rsi >= 70) return "rgba(255,77,106,0.25)";
  if (rsi >= 60) return "rgba(255,140,66,0.15)";
  if (rsi >= 40) return "rgba(148,163,184,0.10)";
  if (rsi >= 30) return "rgba(66,165,245,0.15)";
  return "rgba(56,189,248,0.25)";
}

function macdBadge(signal: "bullish" | "bearish" | "neutral") {
  const c = signal === "bullish" ? green : signal === "bearish" ? red : yellow;
  return <span style={{ color: c, fontWeight: 700, fontSize: 11 }}>{signal === "bullish" ? "▲ BUY" : signal === "bearish" ? "▼ SELL" : "— HOLD"}</span>;
}

function bbBadge(pos: "upper" | "mid" | "lower") {
  const c = pos === "upper" ? red : pos === "lower" ? blue : txt2;
  const label = pos === "upper" ? "UPPER" : pos === "lower" ? "LOWER" : "MID";
  return <span style={{ color: c, fontWeight: 600, fontSize: 11 }}>{label}</span>;
}

function maCrossBadge(cross: "golden" | "death" | "none") {
  if (cross === "golden") return <span style={{ color: yellow, fontWeight: 700, fontSize: 11 }}>★ GOLDEN</span>;
  if (cross === "death") return <span style={{ color: red, fontWeight: 700, fontSize: 11 }}>✝ DEATH</span>;
  return <span style={{ color: txt2, fontSize: 11 }}>—</span>;
}

function volBadge(trend: "rising" | "falling" | "flat") {
  const c = trend === "rising" ? green : trend === "falling" ? red : txt2;
  const icon = trend === "rising" ? "▲" : trend === "falling" ? "▼" : "—";
  return <span style={{ color: c, fontSize: 11 }}>{icon}</span>;
}

export default function TechnicalAnalysisPanel() {
  const [tab, setTab] = useState<Tab>("signals");
  const [selectedStock, setSelectedStock] = useState<string>("AAPL");

  const tabs: { key: Tab; label: string }[] = [
    { key: "signals", label: "SIGNALS" },
    { key: "patterns", label: "PATTERNS" },
    { key: "sr", label: "S / R LEVELS" },
    { key: "momentum", label: "MOMENTUM MAP" },
    { key: "macloud", label: "MA CLOUD" },
  ];

  const selected = STOCKS.find(s => s.ticker === selectedStock) ?? STOCKS[0];

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>TECHNICAL ANALYSIS SCANNER</span>
          <span style={{ color: txt2, fontSize: 11 }}>Real-Time Pattern & Signal Detection</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${tab === t.key ? accent : border}`,
              background: tab === t.key ? `${accent}18` : "transparent",
              color: tab === t.key ? accent : txt2, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* ── SIGNALS TAB ─────────────────────────────────────────── */}
        {tab === "signals" && (
          <div style={{ padding: "0" }}>
            {/* Summary strip */}
            <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
              <div>Bullish: <span style={{ color: green, fontWeight: 700 }}>{STOCKS.filter(s => s.macd === "bullish").length}</span></div>
              <div>Bearish: <span style={{ color: red, fontWeight: 700 }}>{STOCKS.filter(s => s.macd === "bearish").length}</span></div>
              <div>Neutral: <span style={{ color: yellow, fontWeight: 700 }}>{STOCKS.filter(s => s.macd === "neutral").length}</span></div>
              <div style={{ marginLeft: "auto" }}>Overbought (RSI&gt;70): <span style={{ color: red, fontWeight: 700 }}>{STOCKS.filter(s => s.rsi > 70).length}</span></div>
              <div>Oversold (RSI&lt;30): <span style={{ color: blue, fontWeight: 700 }}>{STOCKS.filter(s => s.rsi < 30).length}</span></div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["TICKER", "PRICE", "CHG%", "RSI(14)", "MACD", "BB POS", "MA CROSS", "STOCH %K", "ADX", "VOL"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "TICKER" ? "left" : "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STOCKS.map((s, i) => (
                  <tr key={s.ticker} onClick={() => setSelectedStock(s.ticker)} style={{ background: selectedStock === s.ticker ? `${accent}10` : i % 2 ? `${surface}50` : "transparent", cursor: "pointer" }}>
                    <td style={{ padding: "6px 10px", fontWeight: 700, color: yellow, borderBottom: `1px solid ${border}` }}>
                      {s.ticker}<br /><span style={{ fontSize: 10, fontWeight: 400, color: txt2 }}>{s.name}</span>
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>${s.price.toFixed(2)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: s.chg >= 0 ? green : red, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {s.chg >= 0 ? "+" : ""}{s.chg.toFixed(2)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                      <span style={{ color: rsiColor(s.rsi), fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.rsi.toFixed(1)}</span>
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>{macdBadge(s.macd)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>{bbBadge(s.bbPos)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>{maCrossBadge(s.maCross)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: s.stochK > 80 ? red : s.stochK < 20 ? blue : txt }}>{s.stochK.toFixed(1)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: s.adx > 25 ? green : txt2 }}>{s.adx.toFixed(1)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>{volBadge(s.volTrend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PATTERNS TAB ────────────────────────────────────────── */}
        {tab === "patterns" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 11 }}>
              <div>Detected Patterns: <span style={{ color: accent, fontWeight: 700 }}>{PATTERNS.length}</span></div>
              <div>Bullish: <span style={{ color: green, fontWeight: 700 }}>{PATTERNS.filter(p => p.direction === "bullish").length}</span></div>
              <div>Bearish: <span style={{ color: red, fontWeight: 700 }}>{PATTERNS.filter(p => p.direction === "bearish").length}</span></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {PATTERNS.map((p, i) => (
                <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: 14, borderLeft: `3px solid ${p.direction === "bullish" ? green : red}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: p.direction === "bullish" ? green : red }}>{p.pattern}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: p.direction === "bullish" ? `${green}20` : `${red}20`, color: p.direction === "bullish" ? green : red }}>
                      {p.direction === "bullish" ? "▲ BULLISH" : "▼ BEARISH"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 10 }}>
                    <div><span style={{ color: txt2 }}>Ticker:</span> <span style={{ color: yellow, fontWeight: 700 }}>{p.ticker}</span></div>
                    <div><span style={{ color: txt2 }}>TF:</span> {p.timeframe}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: txt2, marginBottom: 3 }}>Confidence</div>
                      <div style={{ background: `${border}`, borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${p.confidence}%`, height: "100%", background: p.confidence >= 75 ? green : yellow, borderRadius: 4 }} />
                      </div>
                      <div style={{ textAlign: "right", fontSize: 10, color: p.confidence >= 75 ? green : yellow, fontWeight: 700, marginTop: 2 }}>{p.confidence}%</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: txt2, marginBottom: 3 }}>Completion</div>
                      <div style={{ background: `${border}`, borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${p.completion}%`, height: "100%", background: purple, borderRadius: 4 }} />
                      </div>
                      <div style={{ textAlign: "right", fontSize: 10, color: purple, fontWeight: 700, marginTop: 2 }}>{p.completion}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUPPORT / RESISTANCE TAB ────────────────────────────── */}
        {tab === "sr" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {STOCKS.map(s => (
                <button key={s.ticker} onClick={() => setSelectedStock(s.ticker)} style={{
                  padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                  border: `1px solid ${selectedStock === s.ticker ? accent : border}`,
                  background: selectedStock === s.ticker ? `${accent}18` : "transparent",
                  color: selectedStock === s.ticker ? accent : txt2, cursor: "pointer",
                }}>{s.ticker}</button>
              ))}
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <span style={{ color: yellow, fontWeight: 700, fontSize: 18 }}>{selected.ticker}</span>
                  <span style={{ color: txt2, fontSize: 13, marginLeft: 8 }}>{selected.name}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>${selected.price.toFixed(2)}</div>
              </div>

              {/* Visual price ladder */}
              <div style={{ display: "flex", gap: 24 }}>
                {/* Resistance */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>RESISTANCE LEVELS</div>
                  {selected.resistance.map((r, i) => {
                    const dist = ((r - selected.price) / selected.price * 100);
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: `1px solid ${border}`, background: i === 0 ? `${red}08` : "transparent" }}>
                        <div>
                          <span style={{ color: red, fontWeight: 700 }}>R{i + 1}</span>
                          <span style={{ marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>${r.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 80, height: 6, background: `${border}`, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(dist * 5, 100)}%`, height: "100%", background: red, borderRadius: 3 }} />
                          </div>
                          <span style={{ color: red, fontSize: 11, fontVariantNumeric: "tabular-nums", width: 50, textAlign: "right" }}>+{dist.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Price Indicator */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
                  <div style={{ width: 2, height: 40, background: `${border}` }} />
                  <div style={{ padding: "8px 16px", background: `${accent}20`, border: `2px solid ${accent}`, borderRadius: 6, fontWeight: 700, fontSize: 16, color: accent, fontVariantNumeric: "tabular-nums" }}>
                    ${selected.price.toFixed(2)}
                  </div>
                  <div style={{ width: 2, height: 40, background: `${border}` }} />
                </div>

                {/* Support */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>SUPPORT LEVELS</div>
                  {selected.support.map((s, i) => {
                    const dist = ((selected.price - s) / selected.price * 100);
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: `1px solid ${border}`, background: i === 0 ? `${green}08` : "transparent" }}>
                        <div>
                          <span style={{ color: green, fontWeight: 700 }}>S{i + 1}</span>
                          <span style={{ marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>${s.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 80, height: 6, background: `${border}`, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(dist * 5, 100)}%`, height: "100%", background: green, borderRadius: 3 }} />
                          </div>
                          <span style={{ color: green, fontSize: 11, fontVariantNumeric: "tabular-nums", width: 50, textAlign: "right" }}>-{dist.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MOMENTUM HEATMAP TAB ────────────────────────────────── */}
        {tab === "momentum" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 11 }}>
              <span style={{ color: txt2 }}>RSI (14-Day) Momentum Heatmap — 20 Stocks</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: blue, marginRight: 4, verticalAlign: "middle" }} />Oversold (&lt;30)</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: txt2, marginRight: 4, verticalAlign: "middle" }} />Neutral (30-70)</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: red, marginRight: 4, verticalAlign: "middle" }} />Overbought (&gt;70)</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {MOMENTUM_TICKERS.map(m => (
                <div key={m.t} style={{
                  background: rsiBg(m.rsi), border: `1px solid ${border}`, borderRadius: 6, padding: "14px 12px",
                  textAlign: "center", cursor: "pointer", transition: "border-color 0.2s",
                }} onMouseEnter={e => (e.currentTarget.style.borderColor = accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = border)}>
                  <div style={{ fontWeight: 700, color: yellow, fontSize: 14, marginBottom: 4 }}>{m.t}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: rsiColor(m.rsi), fontVariantNumeric: "tabular-nums" }}>{m.rsi.toFixed(1)}</div>
                  <div style={{ fontSize: 10, color: txt2, marginTop: 4 }}>
                    {m.rsi >= 70 ? "OVERBOUGHT" : m.rsi >= 60 ? "ELEVATED" : m.rsi >= 40 ? "NEUTRAL" : m.rsi >= 30 ? "WEAK" : "OVERSOLD"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MA CLOUD TAB ────────────────────────────────────────── */}
        {tab === "macloud" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 11, flexWrap: "wrap" }}>
              <div>Above ALL MAs: <span style={{ color: green, fontWeight: 700 }}>{STOCKS.filter(s => s.price > s.ma50 && s.price > s.ma100 && s.price > s.ma200).length}</span></div>
              <div>Below ALL MAs: <span style={{ color: red, fontWeight: 700 }}>{STOCKS.filter(s => s.price < s.ma50 && s.price < s.ma100 && s.price < s.ma200).length}</span></div>
              <div>Mixed: <span style={{ color: yellow, fontWeight: 700 }}>{STOCKS.filter(s => !(s.price > s.ma50 && s.price > s.ma100 && s.price > s.ma200) && !(s.price < s.ma50 && s.price < s.ma100 && s.price < s.ma200)).length}</span></div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["TICKER", "PRICE", "MA(50)", "vs 50", "MA(100)", "vs 100", "MA(200)", "vs 200", "TREND"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "TICKER" ? "left" : "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STOCKS.map((s, i) => {
                  const a50 = s.price > s.ma50;
                  const a100 = s.price > s.ma100;
                  const a200 = s.price > s.ma200;
                  const allAbove = a50 && a100 && a200;
                  const allBelow = !a50 && !a100 && !a200;
                  const trendColor = allAbove ? green : allBelow ? red : yellow;
                  const trendLabel = allAbove ? "▲ STRONG" : allBelow ? "▼ WEAK" : "— MIXED";
                  return (
                    <tr key={s.ticker} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, color: yellow, borderBottom: `1px solid ${border}` }}>{s.ticker}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>${s.price.toFixed(2)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: txt2 }}>{s.ma50.toFixed(2)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                        <span style={{ color: a50 ? green : red, fontWeight: 700, fontSize: 11 }}>{a50 ? "▲ ABOVE" : "▼ BELOW"}</span>
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: txt2 }}>{s.ma100.toFixed(2)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                        <span style={{ color: a100 ? green : red, fontWeight: 700, fontSize: 11 }}>{a100 ? "▲ ABOVE" : "▼ BELOW"}</span>
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: txt2 }}>{s.ma200.toFixed(2)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                        <span style={{ color: a200 ? green : red, fontWeight: 700, fontSize: 11 }}>{a200 ? "▲ ABOVE" : "▼ BELOW"}</span>
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                        <span style={{ color: trendColor, fontWeight: 700, fontSize: 12 }}>{trendLabel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: txt2 }}>Stocks: <span style={{ color: accent }}>{STOCKS.length}</span> | Patterns: <span style={{ color: accent }}>{PATTERNS.length}</span></span>
        <span style={{ color: txt2 }}>DEMO MODE — Bloomberg TECH&lt;GO&gt; equivalent</span>
      </div>
    </div>
  );
}
