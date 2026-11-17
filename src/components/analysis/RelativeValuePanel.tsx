"use client";
import { useState } from "react";

/* ── Bloomberg RV-tier Cross-Asset Relative Value ────────────── */

interface RVPair {
  pair: string;
  asset1: string;
  asset2: string;
  spread: number;
  zScore: number;
  mean: number;
  stdDev: number;
  percentile: number;
  signal: "CHEAP" | "RICH" | "FAIR";
  category: string;
}

const RV_DATA: RVPair[] = [
  { pair: "SPX vs NDX", asset1: "S&P 500", asset2: "Nasdaq 100", spread: -24.2, zScore: -1.84, mean: -8.4, stdDev: 8.6, percentile: 8, signal: "CHEAP", category: "Equity" },
  { pair: "SPX vs RTY", asset1: "S&P 500", asset2: "Russell 2000", spread: 14.2, zScore: 1.42, mean: 4.2, stdDev: 7.0, percentile: 88, signal: "RICH", category: "Equity" },
  { pair: "EEM vs EFA", asset1: "EM Equity", asset2: "DM ex-US", spread: -7.7, zScore: -0.92, mean: -2.4, stdDev: 5.8, percentile: 22, signal: "FAIR", category: "Equity" },
  { pair: "US 2s10s", asset1: "UST 2Y", asset2: "UST 10Y", spread: -42, zScore: -2.14, mean: 82, stdDev: 58, percentile: 4, signal: "CHEAP", category: "Rates" },
  { pair: "US 5s30s", asset1: "UST 5Y", asset2: "UST 30Y", spread: 18, zScore: -0.84, mean: 42, stdDev: 28, percentile: 18, signal: "FAIR", category: "Rates" },
  { pair: "Bund-BTP", asset1: "Germany 10Y", asset2: "Italy 10Y", spread: 170, zScore: 0.42, mean: 148, stdDev: 52, percentile: 62, signal: "FAIR", category: "Rates" },
  { pair: "IG vs HY", asset1: "IG OAS", asset2: "HY OAS", spread: 248, zScore: -0.68, mean: 312, stdDev: 94, percentile: 28, signal: "FAIR", category: "Credit" },
  { pair: "CDX IG vs iTraxx", asset1: "CDX NA IG", asset2: "iTraxx Main", spread: 12, zScore: 1.24, mean: 4, stdDev: 6.4, percentile: 82, signal: "RICH", category: "Credit" },
  { pair: "Gold vs Silver", asset1: "XAU", asset2: "XAG", spread: 82.4, zScore: 1.68, mean: 68, stdDev: 8.6, percentile: 92, signal: "RICH", category: "Commodity" },
  { pair: "WTI vs Brent", asset1: "CL1", asset2: "CO1", spread: -4.2, zScore: 0.28, mean: -3.8, stdDev: 1.4, percentile: 54, signal: "FAIR", category: "Commodity" },
  { pair: "Copper vs Gold", asset1: "HG1", asset2: "GC1", spread: -0.42, zScore: -1.42, mean: -0.18, stdDev: 0.17, percentile: 12, signal: "CHEAP", category: "Commodity" },
  { pair: "EURUSD vs GBPUSD", asset1: "EUR/USD", asset2: "GBP/USD", spread: -0.18, zScore: -0.52, mean: -0.12, stdDev: 0.12, percentile: 32, signal: "FAIR", category: "FX" },
  { pair: "USDJPY vs DXY", asset1: "USD/JPY", asset2: "DXY", spread: 48.2, zScore: 2.04, mean: 38, stdDev: 5.0, percentile: 96, signal: "RICH", category: "FX" },
  { pair: "ERP (SPX)", asset1: "S&P E/P", asset2: "UST 10Y", spread: 1.2, zScore: -1.92, mean: 3.4, stdDev: 1.14, percentile: 6, signal: "CHEAP", category: "Cross-Asset" },
  { pair: "Stocks vs Bonds 60/40", asset1: "SPX YTD", asset2: "AGG YTD", spread: 26.8, zScore: 1.84, mean: 8.4, stdDev: 10, percentile: 94, signal: "RICH", category: "Cross-Asset" },
];

const CATEGORIES = ["All", "Equity", "Rates", "Credit", "Commodity", "FX", "Cross-Asset"];

function zScoreColor(z: number): string {
  if (z >= 2) return "#ef4444";
  if (z >= 1) return "#f97316";
  if (z > -1) return "#94a3b8";
  if (z > -2) return "#38bdf8";
  return "#00e5a0";
}

function signalBadge(s: "CHEAP" | "RICH" | "FAIR") {
  const colors = { CHEAP: "#00e5a0", RICH: "#ef4444", FAIR: "#94a3b8" };
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${colors[s]}18`, color: colors[s], border: `1px solid ${colors[s]}40` }}>{s}</span>
  );
}

export default function RelativeValuePanel() {
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"zScore" | "percentile" | "spread">("zScore");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = category === "All" ? RV_DATA : RV_DATA.filter(r => r.category === category);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "zScore") return Math.abs(b.zScore) - Math.abs(a.zScore);
    if (sortBy === "percentile") return Math.abs(b.percentile - 50) - Math.abs(a.percentile - 50);
    return Math.abs(b.spread) - Math.abs(a.spread);
  });

  const cheapCount = filtered.filter(r => r.signal === "CHEAP").length;
  const richCount = filtered.filter(r => r.signal === "RICH").length;

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>CROSS-ASSET RELATIVE VALUE</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Z-Score & Percentile Rank Monitor</span>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            <div>Cheap Signals: <span style={{ color: accent, fontWeight: 700 }}>{cheapCount}</span></div>
            <div>Rich Signals: <span style={{ color: "#ef4444", fontWeight: 700 }}>{richCount}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${category === c ? accent : border}`,
              background: category === c ? `${accent}18` : "transparent",
              color: category === c ? accent : textSecondary, cursor: "pointer"
            }}>{c}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {(["zScore", "percentile", "spread"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: "3px 8px", fontSize: 10, borderRadius: 4,
                border: `1px solid ${sortBy === s ? "#fbbf24" : border}`,
                background: sortBy === s ? "#fbbf2418" : "transparent",
                color: sortBy === s ? "#fbbf24" : textSecondary, cursor: "pointer"
              }}>SORT: {s.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["PAIR", "ASSET 1", "ASSET 2", "SPREAD", "Z-SCORE", "MEAN", "PERCENTILE", "SIGNAL"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: h === "PAIR" || h === "ASSET 1" || h === "ASSET 2" || h === "SIGNAL" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.pair} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                <td style={{ padding: "7px 12px", fontWeight: 700, borderBottom: `1px solid ${border}`, color: "#fbbf24" }}>{r.pair}</td>
                <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{r.asset1}</td>
                <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{r.asset2}</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {r.spread >= 0 ? "+" : ""}{typeof r.spread === "number" && Math.abs(r.spread) > 10 ? r.spread.toFixed(0) : r.spread.toFixed(2)}
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: zScoreColor(r.zScore) }}>
                  {r.zScore >= 0 ? "+" : ""}{r.zScore.toFixed(2)}
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                  {typeof r.mean === "number" && Math.abs(r.mean) > 10 ? r.mean.toFixed(0) : r.mean.toFixed(2)}
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <div style={{ width: 60, height: 8, background: border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${r.percentile}%`, height: "100%", borderRadius: 4, background: r.percentile > 80 ? "#ef4444" : r.percentile < 20 ? accent : "#fbbf24" }} />
                    </div>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: r.percentile > 80 || r.percentile < 20 ? "#fbbf24" : textSecondary, fontWeight: 600, fontSize: 12, minWidth: 30, textAlign: "right" }}>{r.percentile}%</span>
                  </div>
                </td>
                <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}` }}>{signalBadge(r.signal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Z-Score Distribution */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 11 }}>
          <span style={{ color: textSecondary }}>Z-SCORE DISTRIBUTION:</span>
          {sorted.map(r => (
            <div key={r.pair} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: zScoreColor(r.zScore) }} />
              <span style={{ color: textSecondary, fontSize: 10 }}>{r.pair.split(" vs ")[0]}</span>
              <span style={{ color: zScoreColor(r.zScore), fontWeight: 700, fontSize: 10, fontVariantNumeric: "tabular-nums" }}>{r.zScore.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
