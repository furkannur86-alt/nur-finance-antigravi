"use client";
import { useState } from "react";

/* ── Bloomberg-tier ETF Analytics & Flow Monitor ─────────────── */

interface ETFData {
  ticker: string;
  name: string;
  price: number;
  chg1d: number;
  aum: string;
  expRatio: number;
  flow1w: number;
  flow1m: number;
  volume: string;
  premium: number;
  holdings: number;
  ytd: number;
  category: string;
}

const ETF_DATA: ETFData[] = [
  { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 456.78, chg1d: 0.82, aum: "$412.4B", expRatio: 0.09, flow1w: 3240, flow1m: 12450, volume: "78.2M", premium: 0.01, holdings: 503, ytd: 18.4, category: "US Equity" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", price: 388.42, chg1d: 1.24, aum: "$198.7B", expRatio: 0.20, flow1w: 1890, flow1m: 7820, volume: "42.1M", premium: 0.02, holdings: 101, ytd: 42.8, category: "US Equity" },
  { ticker: "IWM", name: "iShares Russell 2000", price: 194.56, chg1d: -0.34, aum: "$58.2B", expRatio: 0.19, flow1w: -420, flow1m: -1890, volume: "24.8M", premium: -0.03, holdings: 1978, ytd: 4.2, category: "US Equity" },
  { ticker: "EFA", name: "iShares MSCI EAFE", price: 74.23, chg1d: 0.45, aum: "$52.1B", expRatio: 0.32, flow1w: 890, flow1m: 3420, volume: "18.4M", premium: 0.01, holdings: 787, ytd: 9.8, category: "Intl Equity" },
  { ticker: "EEM", name: "iShares MSCI EM", price: 39.87, chg1d: -0.78, aum: "$28.4B", expRatio: 0.68, flow1w: -1240, flow1m: -4560, volume: "32.6M", premium: -0.12, holdings: 1234, ytd: 2.1, category: "Intl Equity" },
  { ticker: "TLT", name: "iShares 20+ Yr Treasury", price: 92.45, chg1d: 0.56, aum: "$38.9B", expRatio: 0.15, flow1w: 2100, flow1m: 8900, volume: "28.4M", premium: 0.00, holdings: 34, ytd: -8.4, category: "Fixed Income" },
  { ticker: "HYG", name: "iShares High Yield Corp", price: 76.12, chg1d: 0.23, aum: "$15.8B", expRatio: 0.49, flow1w: 340, flow1m: 1230, volume: "12.1M", premium: -0.05, holdings: 1245, ytd: 4.6, category: "Fixed Income" },
  { ticker: "GLD", name: "SPDR Gold Shares", price: 184.56, chg1d: 0.89, aum: "$56.7B", expRatio: 0.40, flow1w: 1560, flow1m: 5670, volume: "8.4M", premium: 0.00, holdings: 1, ytd: 11.2, category: "Commodity" },
  { ticker: "USO", name: "United States Oil Fund", price: 72.34, chg1d: -1.45, aum: "$2.4B", expRatio: 0.60, flow1w: -890, flow1m: -2340, volume: "4.2M", premium: -0.42, holdings: 1, ytd: -12.8, category: "Commodity" },
  { ticker: "VXX", name: "iPath VIX Short-Term", price: 21.45, chg1d: -2.34, aum: "$1.2B", expRatio: 0.89, flow1w: -120, flow1m: -890, volume: "18.9M", premium: -1.24, holdings: 2, ytd: -42.1, category: "Volatility" },
  { ticker: "ARKK", name: "ARK Innovation ETF", price: 46.78, chg1d: 2.89, aum: "$8.4B", expRatio: 0.75, flow1w: -340, flow1m: -1890, volume: "14.2M", premium: -0.08, holdings: 35, ytd: 32.4, category: "Thematic" },
  { ticker: "XLF", name: "Financial Select SPDR", price: 36.42, chg1d: 0.34, aum: "$32.1B", expRatio: 0.10, flow1w: 450, flow1m: 1890, volume: "42.8M", premium: 0.01, holdings: 72, ytd: 8.9, category: "Sector" },
  { ticker: "XLE", name: "Energy Select SPDR", price: 84.56, chg1d: -0.89, aum: "$34.5B", expRatio: 0.10, flow1w: -670, flow1m: -2340, volume: "16.4M", premium: 0.02, holdings: 23, ytd: -4.2, category: "Sector" },
  { ticker: "XLK", name: "Technology Select SPDR", price: 184.23, chg1d: 1.12, aum: "$48.9B", expRatio: 0.10, flow1w: 2340, flow1m: 8900, volume: "8.9M", premium: 0.01, holdings: 68, ytd: 38.9, category: "Sector" },
  { ticker: "IBIT", name: "iShares Bitcoin Trust", price: 34.56, chg1d: 3.45, aum: "$18.2B", expRatio: 0.25, flow1w: 4560, flow1m: 12340, volume: "32.1M", premium: 0.08, holdings: 1, ytd: 124.5, category: "Crypto" },
];

const CATEGORIES = ["All", "US Equity", "Intl Equity", "Fixed Income", "Commodity", "Sector", "Thematic", "Volatility", "Crypto"];

type SortKey = "ticker" | "price" | "chg1d" | "aum" | "flow1w" | "flow1m" | "ytd" | "premium";

export default function ETFAnalyticsPanel() {
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("aum");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [selectedETF, setSelectedETF] = useState<ETFData | null>(null);

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = category === "All" ? ETF_DATA : ETF_DATA.filter(e => e.category === category);
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    if (typeof av === "string" && typeof bv === "string") {
      const an = parseFloat(av.replace(/[$BMK,]/g, "")), bn = parseFloat(bv.replace(/[$BMK,]/g, ""));
      return (an - bn) * sortDir;
    }
    return ((av as number) - (bv as number)) * sortDir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortBy(key); setSortDir(-1); }
  };

  const totalFlowW = filtered.reduce((s, e) => s + e.flow1w, 0);
  const totalFlowM = filtered.reduce((s, e) => s + e.flow1m, 0);

  const flowBar = (val: number, max: number) => {
    const pct = Math.min(Math.abs(val) / max * 100, 100);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        <span style={{ color: val >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
          {val >= 0 ? "+" : ""}{(val / 1000).toFixed(1)}B
        </span>
        <div style={{ width: 60, height: 8, background: `${border}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: val >= 0 ? accent : "#ff4d6a", borderRadius: 4 }} />
        </div>
      </div>
    );
  };

  const maxFlow = Math.max(...ETF_DATA.map(e => Math.abs(e.flow1w)));

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>ETF ANALYTICS & FLOW MONITOR</span>
          <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Real-Time AUM, Flows & Premium/Discount</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
          <div>1W Net Flow: <span style={{ color: totalFlowW >= 0 ? accent : "#ff4d6a", fontWeight: 700 }}>{totalFlowW >= 0 ? "+" : ""}{(totalFlowW / 1000).toFixed(1)}B</span></div>
          <div>1M Net Flow: <span style={{ color: totalFlowM >= 0 ? accent : "#ff4d6a", fontWeight: 700 }}>{totalFlowM >= 0 ? "+" : ""}{(totalFlowM / 1000).toFixed(1)}B</span></div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
            border: `1px solid ${category === c ? accent : border}`,
            background: category === c ? `${accent}18` : "transparent",
            color: category === c ? accent : textSecondary, cursor: "pointer"
          }}>{c}</button>
        ))}
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {([
                ["ticker", "TICKER", "left"],
                ["price", "PRICE", "right"],
                ["chg1d", "1D CHG", "right"],
                ["ytd", "YTD", "right"],
                ["aum", "AUM", "right"],
                ["flow1w", "1W FLOW", "right"],
                ["flow1m", "1M FLOW", "right"],
                ["premium", "PREM/DISC", "right"],
              ] as [SortKey, string, string][]).map(([key, label, align]) => (
                <th key={key} onClick={() => toggleSort(key)} style={{
                  padding: "8px 12px", textAlign: align as "left" | "right", borderBottom: `2px solid ${sortBy === key ? accent : border}`,
                  color: sortBy === key ? accent : textSecondary, fontSize: 11, fontWeight: 700, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap"
                }}>{label} {sortBy === key ? (sortDir === 1 ? "▲" : "▼") : ""}</th>
              ))}
              <th style={{ padding: "8px 12px", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>VOL</th>
              <th style={{ padding: "8px 12px", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>EXP</th>
              <th style={{ padding: "8px 12px", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>#</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, i) => (
              <tr key={e.ticker} onClick={() => setSelectedETF(e)} style={{
                background: selectedETF?.ticker === e.ticker ? `${accent}12` : i % 2 === 0 ? "transparent" : `${surface}40`, cursor: "pointer"
              }}>
                <td style={{ padding: "7px 12px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}` }}>
                  <div>{e.ticker}</div>
                  <div style={{ fontSize: 10, color: textSecondary, fontWeight: 400 }}>{e.name.length > 22 ? e.name.slice(0, 22) + "..." : e.name}</div>
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>${e.price.toFixed(2)}</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: e.chg1d >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {e.chg1d >= 0 ? "+" : ""}{e.chg1d.toFixed(2)}%
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: e.ytd >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {e.ytd >= 0 ? "+" : ""}{e.ytd.toFixed(1)}%
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{e.aum}</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>{flowBar(e.flow1w, maxFlow)}</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: e.flow1m >= 0 ? accent : "#ff4d6a", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                  {e.flow1m >= 0 ? "+" : ""}{(e.flow1m / 1000).toFixed(1)}B
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums",
                  color: Math.abs(e.premium) < 0.05 ? textSecondary : e.premium >= 0 ? accent : "#ff4d6a", fontSize: 12
                }}>
                  {e.premium >= 0 ? "+" : ""}{e.premium.toFixed(2)}%
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{e.volume}</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{e.expRatio.toFixed(2)}%</td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{e.holdings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Strip */}
      {selectedETF && (
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", gap: 24, fontSize: 11, flexWrap: "wrap" }}>
          <div><span style={{ color: textSecondary }}>Selected:</span> <span style={{ color: "#fbbf24", fontWeight: 700 }}>{selectedETF.ticker}</span> {selectedETF.name}</div>
          <div><span style={{ color: textSecondary }}>Category:</span> <span style={{ color: accent }}>{selectedETF.category}</span></div>
          <div><span style={{ color: textSecondary }}>Holdings:</span> {selectedETF.holdings}</div>
          <div><span style={{ color: textSecondary }}>Expense:</span> {selectedETF.expRatio.toFixed(2)}%</div>
          <div style={{ marginLeft: "auto", color: textSecondary }}>DEMO MODE — Bloomberg ETF&lt;GO&gt; equivalent</div>
        </div>
      )}
    </div>
  );
}
