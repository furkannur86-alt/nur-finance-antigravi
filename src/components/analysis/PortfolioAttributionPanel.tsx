"use client";
import { useState } from "react";

/* ── Bloomberg PORT-tier Portfolio Attribution & Risk ─────────── */

interface Position {
  ticker: string;
  name: string;
  sector: string;
  weight: number;
  returnMtd: number;
  returnYtd: number;
  contribution: number;
  alpha: number;
  beta: number;
  sharpe: number;
  maxDrawdown: number;
}

const POSITIONS: Position[] = [
  { ticker: "AAPL", name: "Apple Inc", sector: "Technology", weight: 12.4, returnMtd: 2.8, returnYtd: 28.4, contribution: 3.52, alpha: 1.2, beta: 1.24, sharpe: 1.82, maxDrawdown: -8.4 },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", weight: 11.2, returnMtd: 3.1, returnYtd: 42.1, contribution: 4.72, alpha: 2.8, beta: 0.92, sharpe: 2.14, maxDrawdown: -6.2 },
  { ticker: "NVDA", name: "NVIDIA", sector: "Technology", weight: 8.8, returnMtd: 8.2, returnYtd: 198.4, contribution: 17.46, alpha: 12.4, beta: 1.72, sharpe: 2.89, maxDrawdown: -18.9 },
  { ticker: "GOOGL", name: "Alphabet", sector: "Technology", weight: 7.4, returnMtd: 4.2, returnYtd: 51.2, contribution: 3.79, alpha: 3.1, beta: 1.08, sharpe: 1.94, maxDrawdown: -9.1 },
  { ticker: "AMZN", name: "Amazon", sector: "Consumer", weight: 6.8, returnMtd: 5.6, returnYtd: 55.8, contribution: 3.79, alpha: 4.2, beta: 1.18, sharpe: 2.02, maxDrawdown: -12.4 },
  { ticker: "JPM", name: "JPMorgan", sector: "Financials", weight: 5.4, returnMtd: 1.2, returnYtd: 18.9, contribution: 1.02, alpha: 0.8, beta: 1.12, sharpe: 1.24, maxDrawdown: -7.8 },
  { ticker: "GS", name: "Goldman Sachs", sector: "Financials", weight: 4.2, returnMtd: 2.4, returnYtd: 12.4, contribution: 0.52, alpha: -0.4, beta: 1.38, sharpe: 0.92, maxDrawdown: -14.2 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", weight: 4.8, returnMtd: -0.8, returnYtd: -4.8, contribution: -0.23, alpha: -1.2, beta: 0.52, sharpe: 0.34, maxDrawdown: -5.6 },
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", weight: 4.2, returnMtd: -1.4, returnYtd: -5.2, contribution: -0.22, alpha: -2.1, beta: 0.84, sharpe: 0.18, maxDrawdown: -11.2 },
  { ticker: "TSLA", name: "Tesla", sector: "Consumer", weight: 5.8, returnMtd: -2.1, returnYtd: 92.1, contribution: 5.34, alpha: 8.4, beta: 2.04, sharpe: 1.56, maxDrawdown: -28.4 },
  { ticker: "TLT", name: "iShares 20+ Yr", sector: "Fixed Income", weight: 8.2, returnMtd: 0.8, returnYtd: -8.4, contribution: -0.69, alpha: 0.2, beta: -0.18, sharpe: -0.42, maxDrawdown: -14.8 },
  { ticker: "GLD", name: "SPDR Gold", sector: "Commodity", weight: 6.4, returnMtd: 1.8, returnYtd: 11.2, contribution: 0.72, alpha: 1.8, beta: 0.04, sharpe: 0.84, maxDrawdown: -6.8 },
  { ticker: "BTC-USD", name: "Bitcoin", sector: "Crypto", weight: 4.4, returnMtd: 12.4, returnYtd: 124.5, contribution: 5.48, alpha: 18.2, beta: 0.42, sharpe: 1.68, maxDrawdown: -32.4 },
  { ticker: "CASH", name: "Cash & Equiv", sector: "Cash", weight: 10.0, returnMtd: 0.4, returnYtd: 5.2, contribution: 0.52, alpha: 0.0, beta: 0.0, sharpe: 0, maxDrawdown: 0.0 },
];

interface SectorAlloc {
  sector: string;
  portfolioWeight: number;
  benchmarkWeight: number;
  overUnder: number;
  sectorReturn: number;
  color: string;
}

const SECTOR_ALLOC: SectorAlloc[] = [
  { sector: "Technology", portfolioWeight: 39.8, benchmarkWeight: 32.4, overUnder: 7.4, sectorReturn: 42.8, color: "#38bdf8" },
  { sector: "Consumer", portfolioWeight: 12.6, benchmarkWeight: 14.2, overUnder: -1.6, sectorReturn: 18.4, color: "#a855f7" },
  { sector: "Financials", portfolioWeight: 9.6, benchmarkWeight: 12.8, overUnder: -3.2, sectorReturn: 14.2, color: "#f59e0b" },
  { sector: "Healthcare", portfolioWeight: 4.8, benchmarkWeight: 13.1, overUnder: -8.3, sectorReturn: -2.4, color: "#10b981" },
  { sector: "Energy", portfolioWeight: 4.2, benchmarkWeight: 4.2, overUnder: 0.0, sectorReturn: -5.2, color: "#ef4444" },
  { sector: "Fixed Income", portfolioWeight: 8.2, benchmarkWeight: 0.0, overUnder: 8.2, sectorReturn: -8.4, color: "#64748b" },
  { sector: "Commodity", portfolioWeight: 6.4, benchmarkWeight: 0.0, overUnder: 6.4, sectorReturn: 11.2, color: "#fbbf24" },
  { sector: "Crypto", portfolioWeight: 4.4, benchmarkWeight: 0.0, overUnder: 4.4, sectorReturn: 124.5, color: "#e879f9" },
  { sector: "Cash", portfolioWeight: 10.0, benchmarkWeight: 2.0, overUnder: 8.0, sectorReturn: 5.2, color: "#94a3b8" },
];

export default function PortfolioAttributionPanel() {
  const [tab, setTab] = useState<"positions" | "attribution" | "risk">("positions");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const totalReturn = POSITIONS.reduce((s, p) => s + p.contribution, 0);
  const portfolioBeta = POSITIONS.reduce((s, p) => s + p.beta * (p.weight / 100), 0);
  const portfolioSharpe = 1.84;

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>PORTFOLIO ATTRIBUTION & RISK</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>NUR Sovereign Fund // Bloomberg PORT Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["positions", "attribution", "risk"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase"
              }}>{t}</button>
            ))}
          </div>
        </div>
        {/* KPI Strip */}
        <div style={{ display: "flex", gap: 24, marginTop: 10, fontSize: 11 }}>
          {[
            { label: "YTD Return", value: `+${totalReturn.toFixed(2)}%`, color: accent },
            { label: "Portfolio Beta", value: portfolioBeta.toFixed(2), color: "#38bdf8" },
            { label: "Sharpe Ratio", value: portfolioSharpe.toFixed(2), color: "#a855f7" },
            { label: "Positions", value: String(POSITIONS.length), color: "#fbbf24" },
            { label: "Benchmark", value: "S&P 500", color: textSecondary },
          ].map(k => (
            <div key={k.label}>
              <span style={{ color: textSecondary }}>{k.label}: </span>
              <span style={{ color: k.color, fontWeight: 700 }}>{k.value}</span>
            </div>
          ))}
        </div>
      </div>

      {tab === "positions" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["TICKER", "NAME", "SECTOR", "WEIGHT", "MTD", "YTD", "CONTRIB", "ALPHA", "BETA", "SHARPE", "MAX DD"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "TICKER" || h === "NAME" || h === "SECTOR" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map((p, i) => (
                <tr key={p.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}` }}>{p.ticker}</td>
                  <td style={{ padding: "6px 10px", fontSize: 12, borderBottom: `1px solid ${border}`, color: textSecondary }}>{p.name}</td>
                  <td style={{ padding: "6px 10px", fontSize: 11, borderBottom: `1px solid ${border}`, color: textSecondary }}>{p.sector}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{p.weight.toFixed(1)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: p.returnMtd >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{p.returnMtd >= 0 ? "+" : ""}{p.returnMtd.toFixed(1)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: p.returnYtd >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{p.returnYtd >= 0 ? "+" : ""}{p.returnYtd.toFixed(1)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: p.contribution >= 0 ? accent : "#ff4d6a", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{p.contribution >= 0 ? "+" : ""}{p.contribution.toFixed(2)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: p.alpha >= 0 ? accent : "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>{p.alpha >= 0 ? "+" : ""}{p.alpha.toFixed(1)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{p.beta.toFixed(2)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: p.sharpe > 1.5 ? accent : p.sharpe > 0.5 ? "#fbbf24" : "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>{p.sharpe.toFixed(2)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>{p.maxDrawdown.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "attribution" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>SECTOR ALLOCATION vs BENCHMARK (S&P 500)</div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["SECTOR", "PORT %", "BENCH %", "OVER/UNDER", "SECTOR RET", "SELECTION", "ALLOCATION"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "SECTOR" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTOR_ALLOC.map((s, i) => {
                const selectionEffect = (s.sectorReturn - 18.4) * (s.portfolioWeight / 100);
                const allocationEffect = s.overUnder * (s.sectorReturn - 18.4) / 100;
                return (
                  <tr key={s.sector} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: s.color, marginRight: 8, verticalAlign: "middle" }} />
                      {s.sector}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{s.portfolioWeight.toFixed(1)}%</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{s.benchmarkWeight.toFixed(1)}%</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: s.overUnder >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {s.overUnder >= 0 ? "+" : ""}{s.overUnder.toFixed(1)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: s.sectorReturn >= 0 ? accent : "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>
                      {s.sectorReturn >= 0 ? "+" : ""}{s.sectorReturn.toFixed(1)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: selectionEffect >= 0 ? accent : "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>
                      {selectionEffect >= 0 ? "+" : ""}{selectionEffect.toFixed(2)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: allocationEffect >= 0 ? accent : "#ff4d6a", fontVariantNumeric: "tabular-nums" }}>
                      {allocationEffect >= 0 ? "+" : ""}{allocationEffect.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Allocation Bar Chart */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>ALLOCATION COMPARISON</div>
          {SECTOR_ALLOC.map(s => (
            <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 100, fontSize: 11, color: textSecondary, textAlign: "right" }}>{s.sector}</div>
              <div style={{ flex: 1, display: "flex", gap: 2, alignItems: "center" }}>
                <div style={{ height: 14, width: `${s.portfolioWeight * 2}%`, background: s.color, borderRadius: 2, minWidth: 4 }} />
                <div style={{ height: 8, width: `${s.benchmarkWeight * 2}%`, background: `${s.color}50`, borderRadius: 2, minWidth: s.benchmarkWeight > 0 ? 4 : 0, border: `1px solid ${s.color}80` }} />
              </div>
              <div style={{ width: 70, fontSize: 10, color: textSecondary, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {s.portfolioWeight.toFixed(1)} / {s.benchmarkWeight.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "risk" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Portfolio VaR (95%)", value: "-2.14%", sub: "$214K on $10M", color: "#ef4444" },
              { label: "CVaR (95%)", value: "-3.42%", sub: "Expected Shortfall", color: "#f97316" },
              { label: "Portfolio Volatility", value: "18.4%", sub: "Annualized", color: "#fbbf24" },
              { label: "Tracking Error", value: "8.2%", sub: "vs S&P 500", color: "#a855f7" },
              { label: "Information Ratio", value: "1.42", sub: "Active return / TE", color: "#38bdf8" },
              { label: "Sortino Ratio", value: "2.18", sub: "Downside risk adj", color: accent },
              { label: "Max Drawdown", value: "-12.8%", sub: "Peak to trough", color: "#ef4444" },
              { label: "Calmar Ratio", value: "3.52", sub: "Return / Max DD", color: "#10b981" },
            ].map(m => (
              <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: textSecondary, fontSize: 11, marginBottom: 4 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                <div style={{ color: textSecondary, fontSize: 10, marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>POSITION RISK CONTRIBUTION</div>
          {POSITIONS.slice(0, 10).map(p => {
            const riskContrib = Math.abs(p.beta * p.weight);
            const maxRisk = Math.max(...POSITIONS.map(pp => Math.abs(pp.beta * pp.weight)));
            return (
              <div key={p.ticker} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div style={{ width: 60, fontSize: 11, color: "#fbbf24", fontWeight: 700 }}>{p.ticker}</div>
                <div style={{ flex: 1, height: 12, background: `${border}`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${(riskContrib / maxRisk) * 100}%`, height: "100%", background: p.beta > 1.5 ? "#ef4444" : p.beta > 1 ? "#fbbf24" : accent, borderRadius: 4 }} />
                </div>
                <div style={{ width: 60, fontSize: 11, textAlign: "right", color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{riskContrib.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
