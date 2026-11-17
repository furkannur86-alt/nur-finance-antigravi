"use client";
import { useState } from "react";

/* ── Reuters-tier Global Sovereign Debt Monitor ──────────────── */

interface SovereignData {
  country: string;
  flag: string;
  rating: string;
  yield10y: number;
  chg1d: number;
  spread: number;
  debtGdp: number;
  deficit: number;
  cds5y: number;
  inflation: number;
  region: string;
}

const SOVEREIGN_DATA: SovereignData[] = [
  { country: "United States", flag: "🇺🇸", rating: "AA+", yield10y: 4.42, chg1d: -0.03, spread: 0, debtGdp: 123.4, deficit: -6.3, cds5y: 28, inflation: 3.2, region: "Americas" },
  { country: "Germany", flag: "🇩🇪", rating: "AAA", yield10y: 2.58, chg1d: 0.02, spread: -184, debtGdp: 64.8, deficit: -2.6, cds5y: 12, inflation: 2.9, region: "Europe" },
  { country: "United Kingdom", flag: "🇬🇧", rating: "AA-", yield10y: 4.18, chg1d: -0.01, spread: -24, debtGdp: 101.2, deficit: -5.1, cds5y: 22, inflation: 4.6, region: "Europe" },
  { country: "Japan", flag: "🇯🇵", rating: "A+", yield10y: 0.72, chg1d: 0.01, spread: -370, debtGdp: 263.9, deficit: -6.8, cds5y: 18, inflation: 3.3, region: "Asia" },
  { country: "France", flag: "🇫🇷", rating: "AA-", yield10y: 3.12, chg1d: 0.03, spread: -130, debtGdp: 111.8, deficit: -4.7, cds5y: 24, inflation: 4.9, region: "Europe" },
  { country: "Italy", flag: "🇮🇹", rating: "BBB", yield10y: 4.28, chg1d: 0.05, spread: -14, debtGdp: 142.4, deficit: -5.3, cds5y: 78, inflation: 5.9, region: "Europe" },
  { country: "Spain", flag: "🇪🇸", rating: "A", yield10y: 3.56, chg1d: 0.02, spread: -86, debtGdp: 113.2, deficit: -3.6, cds5y: 42, inflation: 3.4, region: "Europe" },
  { country: "China", flag: "🇨🇳", rating: "A+", yield10y: 2.68, chg1d: -0.02, spread: -174, debtGdp: 77.1, deficit: -7.1, cds5y: 56, inflation: -0.3, region: "Asia" },
  { country: "India", flag: "🇮🇳", rating: "BBB-", yield10y: 7.18, chg1d: 0.01, spread: 276, debtGdp: 83.2, deficit: -5.9, cds5y: 92, inflation: 5.1, region: "Asia" },
  { country: "Brazil", flag: "🇧🇷", rating: "BB-", yield10y: 11.42, chg1d: 0.08, spread: 700, debtGdp: 73.5, deficit: -4.6, cds5y: 168, inflation: 4.5, region: "Americas" },
  { country: "Turkey", flag: "🇹🇷", rating: "B+", yield10y: 24.56, chg1d: -0.12, spread: 2014, debtGdp: 31.7, deficit: -5.4, cds5y: 342, inflation: 61.4, region: "Europe" },
  { country: "South Korea", flag: "🇰🇷", rating: "AA-", yield10y: 3.78, chg1d: 0.00, spread: -64, debtGdp: 54.3, deficit: -2.1, cds5y: 28, inflation: 3.7, region: "Asia" },
  { country: "Australia", flag: "🇦🇺", rating: "AAA", yield10y: 4.32, chg1d: -0.02, spread: -10, debtGdp: 36.5, deficit: -1.4, cds5y: 15, inflation: 5.4, region: "Asia" },
  { country: "Canada", flag: "🇨🇦", rating: "AAA", yield10y: 3.62, chg1d: 0.01, spread: -80, debtGdp: 106.4, deficit: -1.3, cds5y: 18, inflation: 3.8, region: "Americas" },
  { country: "Mexico", flag: "🇲🇽", rating: "BBB", yield10y: 9.24, chg1d: 0.04, spread: 482, debtGdp: 46.8, deficit: -3.9, cds5y: 112, inflation: 4.3, region: "Americas" },
  { country: "South Africa", flag: "🇿🇦", rating: "BB-", yield10y: 10.82, chg1d: 0.06, spread: 640, debtGdp: 73.8, deficit: -4.8, cds5y: 198, inflation: 5.9, region: "Africa" },
  { country: "Indonesia", flag: "🇮🇩", rating: "BBB", yield10y: 6.78, chg1d: -0.03, spread: 236, debtGdp: 39.2, deficit: -2.3, cds5y: 68, inflation: 2.6, region: "Asia" },
  { country: "Poland", flag: "🇵🇱", rating: "A-", yield10y: 5.42, chg1d: 0.02, spread: 100, debtGdp: 49.3, deficit: -3.4, cds5y: 48, inflation: 10.1, region: "Europe" },
  { country: "Saudi Arabia", flag: "🇸🇦", rating: "A", yield10y: 4.62, chg1d: 0.01, spread: 20, debtGdp: 26.2, deficit: -2.8, cds5y: 42, inflation: 1.6, region: "MENA" },
  { country: "Greece", flag: "🇬🇷", rating: "BBB-", yield10y: 3.78, chg1d: 0.04, spread: -64, debtGdp: 171.3, deficit: -1.6, cds5y: 86, inflation: 2.4, region: "Europe" },
];

const REGIONS = ["All", "Americas", "Europe", "Asia", "MENA", "Africa"];

function ratingColor(r: string): string {
  if (r.startsWith("AAA")) return "#00e5a0";
  if (r.startsWith("AA")) return "#38bdf8";
  if (r.startsWith("A") && !r.startsWith("AA")) return "#a78bfa";
  if (r.startsWith("BBB")) return "#fbbf24";
  if (r.startsWith("BB")) return "#f97316";
  return "#ef4444";
}

function debtGdpColor(v: number): string {
  if (v < 60) return "#00e5a0";
  if (v < 90) return "#fbbf24";
  if (v < 120) return "#f97316";
  return "#ef4444";
}

type SortKey = "country" | "yield10y" | "spread" | "debtGdp" | "cds5y" | "inflation" | "deficit";

export default function SovereignDebtPanel() {
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("yield10y");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = region === "All" ? SOVEREIGN_DATA : SOVEREIGN_DATA.filter(s => s.region === region);
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    if (typeof av === "string") return (av as string).localeCompare(bv as string) * sortDir;
    return ((av as number) - (bv as number)) * sortDir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortBy(key); setSortDir(-1); }
  };

  const avgYield = (filtered.reduce((s, d) => s + d.yield10y, 0) / filtered.length).toFixed(2);
  const avgDebt = (filtered.reduce((s, d) => s + d.debtGdp, 0) / filtered.length).toFixed(1);
  const avgCDS = Math.round(filtered.reduce((s, d) => s + d.cds5y, 0) / filtered.length);

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>GLOBAL SOVEREIGN DEBT MONITOR</span>
          <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>20 Sovereigns | Yields, Spreads, CDS & Fiscal</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
          <div>Avg 10Y: <span style={{ color: accent, fontWeight: 700 }}>{avgYield}%</span></div>
          <div>Avg Debt/GDP: <span style={{ color: "#fbbf24", fontWeight: 700 }}>{avgDebt}%</span></div>
          <div>Avg CDS: <span style={{ color: "#f97316", fontWeight: 700 }}>{avgCDS} bps</span></div>
        </div>
      </div>

      {/* Region Filters */}
      <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
        {REGIONS.map(r => (
          <button key={r} onClick={() => setRegion(r)} style={{
            padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
            border: `1px solid ${region === r ? accent : border}`,
            background: region === r ? `${accent}18` : "transparent",
            color: region === r ? accent : textSecondary, cursor: "pointer"
          }}>{r}</button>
        ))}
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {([
                ["country", "SOVEREIGN", "left"],
                ["yield10y", "10Y YIELD", "right"],
                ["spread", "SPREAD vs US", "right"],
                ["debtGdp", "DEBT/GDP", "right"],
                ["deficit", "DEFICIT/GDP", "right"],
                ["cds5y", "CDS 5Y", "right"],
                ["inflation", "CPI YoY", "right"],
              ] as [SortKey, string, string][]).map(([key, label, align]) => (
                <th key={key} onClick={() => toggleSort(key)} style={{
                  padding: "8px 12px", textAlign: align as "left" | "right", borderBottom: `2px solid ${sortBy === key ? accent : border}`,
                  color: sortBy === key ? accent : textSecondary, fontSize: 11, fontWeight: 700, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap"
                }}>{label} {sortBy === key ? (sortDir === 1 ? "▲" : "▼") : ""}</th>
              ))}
              <th style={{ padding: "8px 12px", textAlign: "center", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>RATING</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.country} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>
                  <span style={{ marginRight: 8 }}>{s.flag}</span>{s.country}
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {s.yield10y.toFixed(2)}%
                  <span style={{ color: s.chg1d >= 0 ? "#ff4d6a" : accent, fontSize: 10, marginLeft: 6 }}>
                    {s.chg1d >= 0 ? "▲" : "▼"}{Math.abs(s.chg1d).toFixed(2)}
                  </span>
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums",
                  color: s.spread > 200 ? "#ef4444" : s.spread > 0 ? "#fbbf24" : accent
                }}>
                  {s.spread > 0 ? "+" : ""}{s.spread} bps
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ color: debtGdpColor(s.debtGdp) }}>{s.debtGdp.toFixed(1)}%</span>
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums",
                  color: s.deficit < -5 ? "#ef4444" : s.deficit < -3 ? "#fbbf24" : accent
                }}>
                  {s.deficit.toFixed(1)}%
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ color: s.cds5y > 150 ? "#ef4444" : s.cds5y > 50 ? "#fbbf24" : accent }}>{s.cds5y}</span>
                  <span style={{ color: textSecondary, fontSize: 10 }}> bps</span>
                </td>
                <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums",
                  color: s.inflation > 5 ? "#ef4444" : s.inflation > 3 ? "#fbbf24" : accent
                }}>
                  {s.inflation.toFixed(1)}%
                </td>
                <td style={{ padding: "7px 12px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                    background: `${ratingColor(s.rating)}18`, color: ratingColor(s.rating),
                    border: `1px solid ${ratingColor(s.rating)}40`
                  }}>{s.rating}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>{filtered.length} sovereigns | Sorted by {sortBy}</span>
        <span>DEMO MODE — Reuters GOVD equivalent</span>
      </div>
    </div>
  );
}
