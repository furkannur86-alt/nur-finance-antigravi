"use client";
import { useState } from "react";

/* ── Bloomberg REIT-tier Real Estate & REIT Analytics ──────────── */

interface REITData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  chg1d: number;
  divYield: number;
  ffo: number;
  pFfo: number;
  navPremDisc: number;
  occupancy: number;
  marketCap: string;
  ytd: number;
}

const REITS: REITData[] = [
  { ticker: "PLD", name: "Prologis Inc", sector: "Industrial", price: 128.42, chg1d: 0.84, divYield: 2.72, ffo: 5.58, pFfo: 23.0, navPremDisc: 8.4, occupancy: 97.2, marketCap: "$118.4B", ytd: 12.4 },
  { ticker: "AMT", name: "American Tower", sector: "Data Center", price: 214.56, chg1d: -0.32, divYield: 2.98, ffo: 10.42, pFfo: 20.6, navPremDisc: 4.2, occupancy: 99.1, marketCap: "$98.2B", ytd: -4.8 },
  { ticker: "EQIX", name: "Equinix Inc", sector: "Data Center", price: 842.18, chg1d: 1.24, divYield: 1.92, ffo: 34.28, pFfo: 24.6, navPremDisc: 12.8, occupancy: 94.8, marketCap: "$78.4B", ytd: 18.2 },
  { ticker: "SPG", name: "Simon Property Group", sector: "Retail", price: 148.92, chg1d: -0.56, divYield: 5.12, ffo: 12.18, pFfo: 12.2, navPremDisc: -6.4, occupancy: 95.8, marketCap: "$48.6B", ytd: -2.1 },
  { ticker: "O", name: "Realty Income Corp", sector: "Retail", price: 54.28, chg1d: 0.42, divYield: 5.68, ffo: 4.08, pFfo: 13.3, navPremDisc: -8.2, occupancy: 98.8, marketCap: "$46.2B", ytd: -8.4 },
  { ticker: "WELL", name: "Welltower Inc", sector: "Healthcare", price: 98.42, chg1d: 1.08, divYield: 2.52, ffo: 3.92, pFfo: 25.1, navPremDisc: 14.2, occupancy: 84.2, marketCap: "$54.8B", ytd: 28.4 },
  { ticker: "DLR", name: "Digital Realty Trust", sector: "Data Center", price: 142.56, chg1d: 0.68, divYield: 3.42, ffo: 6.84, pFfo: 20.8, navPremDisc: 2.4, occupancy: 87.4, marketCap: "$42.1B", ytd: 8.9 },
  { ticker: "AVB", name: "AvalonBay Communities", sector: "Residential", price: 192.84, chg1d: 0.24, divYield: 3.42, ffo: 10.56, pFfo: 18.3, navPremDisc: -2.8, occupancy: 96.4, marketCap: "$27.8B", ytd: 4.2 },
  { ticker: "EQR", name: "Equity Residential", sector: "Residential", price: 64.28, chg1d: -0.18, divYield: 3.98, ffo: 3.78, pFfo: 17.0, navPremDisc: -4.1, occupancy: 96.1, marketCap: "$24.6B", ytd: 2.8 },
  { ticker: "VTR", name: "Ventas Inc", sector: "Healthcare", price: 48.92, chg1d: 0.92, divYield: 3.68, ffo: 3.12, pFfo: 15.7, navPremDisc: -1.2, occupancy: 82.4, marketCap: "$20.4B", ytd: 14.2 },
  { ticker: "BXP", name: "Boston Properties", sector: "Office", price: 68.42, chg1d: -1.24, divYield: 5.78, ffo: 7.24, pFfo: 9.5, navPremDisc: -28.4, occupancy: 88.2, marketCap: "$11.2B", ytd: -12.8 },
  { ticker: "SLG", name: "SL Green Realty", sector: "Office", price: 48.56, chg1d: -0.84, divYield: 6.24, ffo: 6.42, pFfo: 7.6, navPremDisc: -42.1, occupancy: 92.1, marketCap: "$3.2B", ytd: -18.4 },
  { ticker: "ARE", name: "Alexandria Real Estate", sector: "Office", price: 118.42, chg1d: 0.42, divYield: 4.18, ffo: 8.92, pFfo: 13.3, navPremDisc: -18.2, occupancy: 94.8, marketCap: "$18.9B", ytd: -6.2 },
  { ticker: "INVH", name: "Invitation Homes", sector: "Residential", price: 34.28, chg1d: 0.56, divYield: 2.92, ffo: 1.82, pFfo: 18.8, navPremDisc: 2.8, occupancy: 97.8, marketCap: "$21.4B", ytd: 6.8 },
  { ticker: "CUBE", name: "CubeSmart", sector: "Industrial", price: 44.56, chg1d: -0.28, divYield: 4.42, ffo: 2.68, pFfo: 16.6, navPremDisc: -5.4, occupancy: 91.2, marketCap: "$9.8B", ytd: -4.2 },
  { ticker: "HST", name: "Host Hotels & Resorts", sector: "Lodging", price: 18.24, chg1d: -0.42, divYield: 4.38, ffo: 1.92, pFfo: 9.5, navPremDisc: -14.8, occupancy: 72.4, marketCap: "$12.8B", ytd: -8.9 },
  { ticker: "PEAK", name: "Healthpeak Properties", sector: "Healthcare", price: 18.92, chg1d: 0.34, divYield: 6.12, ffo: 1.68, pFfo: 11.3, navPremDisc: -12.4, occupancy: 88.4, marketCap: "$10.4B", ytd: -2.4 },
];

const SECTORS = ["All", "Data Center", "Industrial", "Retail", "Residential", "Healthcare", "Office", "Lodging"];

interface SectorPerf {
  sector: string;
  totalReturn1y: number;
  avgCapRate: number;
  avgOccupancy: number;
  avgDivYield: number;
  supply: string;
  demand: string;
  color: string;
}

const SECTOR_PERF: SectorPerf[] = [
  { sector: "Data Center", totalReturn1y: 18.4, avgCapRate: 4.8, avgOccupancy: 93.8, avgDivYield: 2.77, supply: "High", demand: "Very High", color: "#38bdf8" },
  { sector: "Industrial", totalReturn1y: 8.2, avgCapRate: 5.2, avgOccupancy: 94.2, avgDivYield: 3.57, supply: "Moderate", demand: "High", color: "#f59e0b" },
  { sector: "Residential", totalReturn1y: 4.6, avgCapRate: 5.4, avgOccupancy: 96.8, avgDivYield: 3.44, supply: "Low", demand: "High", color: "#a855f7" },
  { sector: "Healthcare", totalReturn1y: 12.4, avgCapRate: 6.2, avgOccupancy: 85.0, avgDivYield: 4.11, supply: "Low", demand: "Moderate", color: "#10b981" },
  { sector: "Retail", totalReturn1y: -4.2, avgCapRate: 6.8, avgOccupancy: 97.3, avgDivYield: 5.40, supply: "Low", demand: "Low", color: "#ef4444" },
  { sector: "Office", totalReturn1y: -12.4, avgCapRate: 7.4, avgOccupancy: 91.7, avgDivYield: 5.40, supply: "Moderate", demand: "Very Low", color: "#64748b" },
  { sector: "Lodging", totalReturn1y: -8.9, avgCapRate: 7.8, avgOccupancy: 72.4, avgDivYield: 4.38, supply: "Low", demand: "Moderate", color: "#fbbf24" },
];

interface CapRateEntry {
  sector: string;
  current: number;
  priorYear: number;
  fiveYrAvg: number;
  color: string;
}

const CAP_RATES: CapRateEntry[] = [
  { sector: "Data Center", current: 4.8, priorYear: 4.2, fiveYrAvg: 5.1, color: "#38bdf8" },
  { sector: "Industrial", current: 5.2, priorYear: 4.4, fiveYrAvg: 5.6, color: "#f59e0b" },
  { sector: "Multifamily", current: 5.4, priorYear: 4.6, fiveYrAvg: 5.2, color: "#a855f7" },
  { sector: "Healthcare", current: 6.2, priorYear: 5.8, fiveYrAvg: 6.4, color: "#10b981" },
  { sector: "Retail", current: 6.8, priorYear: 6.2, fiveYrAvg: 6.6, color: "#ef4444" },
  { sector: "Office", current: 7.4, priorYear: 6.0, fiveYrAvg: 5.8, color: "#64748b" },
  { sector: "Lodging", current: 7.8, priorYear: 7.2, fiveYrAvg: 7.4, color: "#fbbf24" },
];

const TREASURY_10Y = 4.42;

interface MortgageRate {
  type: string;
  current: number;
  weekAgo: number;
  monthAgo: number;
  yearAgo: number;
  fiveYrAvg: number;
  color: string;
}

const MORTGAGE_RATES: MortgageRate[] = [
  { type: "30-Year Fixed", current: 7.12, weekAgo: 7.08, monthAgo: 6.92, yearAgo: 7.44, fiveYrAvg: 5.42, color: "#38bdf8" },
  { type: "15-Year Fixed", current: 6.48, weekAgo: 6.42, monthAgo: 6.28, yearAgo: 6.84, fiveYrAvg: 4.68, color: "#a855f7" },
  { type: "5/1 ARM", current: 6.24, weekAgo: 6.18, monthAgo: 6.08, yearAgo: 6.52, fiveYrAvg: 4.12, color: "#f59e0b" },
  { type: "Jumbo 30-Year", current: 7.28, weekAgo: 7.22, monthAgo: 7.04, yearAgo: 7.56, fiveYrAvg: 5.58, color: "#ef4444" },
  { type: "Commercial (5yr)", current: 6.84, weekAgo: 6.78, monthAgo: 6.62, yearAgo: 7.12, fiveYrAvg: 4.92, color: "#10b981" },
  { type: "Commercial (10yr)", current: 7.02, weekAgo: 6.98, monthAgo: 6.82, yearAgo: 7.28, fiveYrAvg: 5.14, color: "#fbbf24" },
];

interface CMBSVintage {
  vintage: string;
  outstanding: string;
  delinquency: number;
  specialService: number;
  lossSeverity: number;
  avgCoupon: number;
  color: string;
}

const CMBS_DATA: CMBSVintage[] = [
  { vintage: "2024", outstanding: "$48.2B", delinquency: 1.2, specialService: 2.4, lossSeverity: 8.4, avgCoupon: 6.42, color: "#38bdf8" },
  { vintage: "2023", outstanding: "$62.4B", delinquency: 2.8, specialService: 4.2, lossSeverity: 12.8, avgCoupon: 5.84, color: "#a855f7" },
  { vintage: "2022", outstanding: "$78.1B", delinquency: 4.2, specialService: 6.8, lossSeverity: 18.4, avgCoupon: 4.92, color: "#f59e0b" },
  { vintage: "2021", outstanding: "$84.6B", delinquency: 5.8, specialService: 8.4, lossSeverity: 22.1, avgCoupon: 3.48, color: "#10b981" },
  { vintage: "2020", outstanding: "$42.8B", delinquency: 8.4, specialService: 12.8, lossSeverity: 28.4, avgCoupon: 3.12, color: "#ef4444" },
  { vintage: "2019", outstanding: "$68.4B", delinquency: 6.2, specialService: 9.8, lossSeverity: 24.2, avgCoupon: 3.84, color: "#fbbf24" },
  { vintage: "2018", outstanding: "$54.2B", delinquency: 4.8, specialService: 7.2, lossSeverity: 19.8, avgCoupon: 4.28, color: "#64748b" },
  { vintage: "Pre-2018", outstanding: "$124.8B", delinquency: 3.4, specialService: 5.4, lossSeverity: 32.4, avgCoupon: 4.56, color: "#94a3b8" },
];

type SortKey = "ticker" | "price" | "divYield" | "pFfo" | "navPremDisc" | "occupancy" | "ytd";
type Tab = "dashboard" | "sectors" | "caprates" | "mortgage" | "cmbs";

function yieldColor(y: number): string {
  if (y >= 6) return "#ef4444";
  if (y >= 5) return "#f97316";
  if (y >= 4) return "#fbbf24";
  if (y >= 3) return "#00e5a0";
  return "#38bdf8";
}

export default function RealEstatePanel() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("divYield");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = sector === "All" ? REITS : REITS.filter(r => r.sector === sector);
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    if (typeof av === "string") return (av as string).localeCompare(bv as string) * sortDir;
    return ((av as number) - (bv as number)) * sortDir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortBy(key); setSortDir(-1); }
  };

  const avgYield = (filtered.reduce((s, r) => s + r.divYield, 0) / filtered.length).toFixed(2);
  const avgOcc = (filtered.reduce((s, r) => s + r.occupancy, 0) / filtered.length).toFixed(1);
  const avgPffo = (filtered.reduce((s, r) => s + r.pFfo, 0) / filtered.length).toFixed(1);

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>REAL ESTATE & REIT ANALYTICS</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Bloomberg REIT&lt;GO&gt; Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["dashboard", "sectors", "caprates", "mortgage", "cmbs"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase",
              }}>{t === "caprates" ? "CAP RATES" : t}</button>
            ))}
          </div>
        </div>
        {tab === "dashboard" && (
          <div style={{ display: "flex", gap: 24, marginTop: 10, fontSize: 11 }}>
            <div><span style={{ color: textSecondary }}>Avg Div Yield: </span><span style={{ color: yieldColor(parseFloat(avgYield)), fontWeight: 700 }}>{avgYield}%</span></div>
            <div><span style={{ color: textSecondary }}>Avg Occupancy: </span><span style={{ color: parseFloat(avgOcc) > 90 ? accent : "#fbbf24", fontWeight: 700 }}>{avgOcc}%</span></div>
            <div><span style={{ color: textSecondary }}>Avg P/FFO: </span><span style={{ color: "#38bdf8", fontWeight: 700 }}>{avgPffo}x</span></div>
            <div><span style={{ color: textSecondary }}>10Y Treasury: </span><span style={{ color: "#fbbf24", fontWeight: 700 }}>{TREASURY_10Y}%</span></div>
            <div><span style={{ color: textSecondary }}>REITs: </span><span style={{ fontWeight: 700 }}>{filtered.length}</span></div>
          </div>
        )}
      </div>

      {/* Sector Filters (dashboard tab) */}
      {tab === "dashboard" && (
        <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${sector === s ? accent : border}`,
              background: sector === s ? `${accent}18` : "transparent",
              color: sector === s ? accent : textSecondary, cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* TAB: DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {([
                  ["ticker", "TICKER", "left"],
                  ["price", "PRICE", "right"],
                  ["divYield", "DIV YIELD", "right"],
                  ["pFfo", "P/FFO", "right"],
                  ["navPremDisc", "NAV PREM/DISC", "right"],
                  ["occupancy", "OCCUP %", "right"],
                  ["ytd", "YTD", "right"],
                ] as [SortKey, string, string][]).map(([key, label, align]) => (
                  <th key={key} onClick={() => toggleSort(key)} style={{
                    padding: "8px 10px", textAlign: align as "left" | "right",
                    borderBottom: `2px solid ${sortBy === key ? accent : border}`,
                    color: sortBy === key ? accent : textSecondary, fontSize: 11, fontWeight: 700,
                    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
                  }}>{label} {sortBy === key ? (sortDir === 1 ? "▲" : "▼") : ""}</th>
                ))}
                <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>MCAP</th>
                <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>SECTOR</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}` }}>
                    <div>{r.ticker}</div>
                    <div style={{ fontSize: 10, color: textSecondary, fontWeight: 400 }}>{r.name.length > 20 ? r.name.slice(0, 20) + "..." : r.name}</div>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                    ${r.price.toFixed(2)}
                    <span style={{ color: r.chg1d >= 0 ? accent : "#ff4d6a", fontSize: 10, marginLeft: 6 }}>
                      {r.chg1d >= 0 ? "+" : ""}{r.chg1d.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: yieldColor(r.divYield) }}>
                    {r.divYield.toFixed(2)}%
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: r.pFfo < 12 ? accent : r.pFfo < 20 ? textPrimary : "#fbbf24" }}>
                    {r.pFfo.toFixed(1)}x
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: r.navPremDisc >= 0 ? "#38bdf8" : "#ff4d6a", fontWeight: 600 }}>
                    {r.navPremDisc >= 0 ? "+" : ""}{r.navPremDisc.toFixed(1)}%
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ color: r.occupancy > 95 ? accent : r.occupancy > 85 ? "#fbbf24" : "#ef4444" }}>{r.occupancy.toFixed(1)}%</span>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: r.ytd >= 0 ? accent : "#ff4d6a", fontWeight: 600 }}>
                    {r.ytd >= 0 ? "+" : ""}{r.ytd.toFixed(1)}%
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{r.marketCap}</td>
                  <td style={{ padding: "6px 10px", textAlign: "left", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, background: `${SECTOR_PERF.find(s => s.sector === r.sector)?.color ?? textSecondary}18`, color: SECTOR_PERF.find(s => s.sector === r.sector)?.color ?? textSecondary, fontSize: 10, fontWeight: 600 }}>{r.sector}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: SECTORS */}
      {tab === "sectors" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>PROPERTY SECTOR PERFORMANCE & FUNDAMENTALS</div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["SECTOR", "1Y TOTAL RET", "AVG CAP RATE", "AVG OCCUP", "AVG DIV YLD", "SUPPLY", "DEMAND"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "SECTOR" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTOR_PERF.map((s, i) => (
                <tr key={s.sector} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: s.color, marginRight: 8, verticalAlign: "middle" }} />
                    {s.sector}
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: s.totalReturn1y >= 0 ? accent : "#ff4d6a", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {s.totalReturn1y >= 0 ? "+" : ""}{s.totalReturn1y.toFixed(1)}%
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{s.avgCapRate.toFixed(1)}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: s.avgOccupancy > 90 ? accent : "#fbbf24" }}>{s.avgOccupancy.toFixed(1)}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: yieldColor(s.avgDivYield), fontWeight: 600 }}>{s.avgDivYield.toFixed(2)}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontSize: 11, color: s.supply === "High" ? "#ef4444" : s.supply === "Moderate" ? "#fbbf24" : accent }}>{s.supply}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontSize: 11, color: s.demand.includes("Very High") ? accent : s.demand === "High" ? "#38bdf8" : s.demand === "Moderate" ? "#fbbf24" : "#ef4444" }}>{s.demand}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Performance Bars */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>1-YEAR TOTAL RETURN BY SECTOR</div>
          {SECTOR_PERF.map(s => {
            const maxAbs = Math.max(...SECTOR_PERF.map(x => Math.abs(x.totalReturn1y)));
            const pct = Math.abs(s.totalReturn1y) / maxAbs * 100;
            const isPos = s.totalReturn1y >= 0;
            return (
              <div key={s.sector} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 100, fontSize: 11, color: textSecondary, textAlign: "right" }}>{s.sector}</div>
                <div style={{ flex: 1, height: 18, position: "relative", background: `${border}40`, borderRadius: 4 }}>
                  <div style={{
                    position: "absolute",
                    left: isPos ? "50%" : `${50 - pct / 2}%`,
                    width: `${pct / 2}%`,
                    height: "100%",
                    background: isPos ? s.color : "#ff4d6a",
                    borderRadius: 4,
                    opacity: 0.8,
                  }} />
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: textSecondary + "40" }} />
                </div>
                <div style={{ width: 60, fontSize: 11, color: isPos ? accent : "#ff4d6a", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {isPos ? "+" : ""}{s.totalReturn1y.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: CAP RATES */}
      {tab === "caprates" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ color: accent, fontWeight: 700, fontSize: 14 }}>CAPITALIZATION RATES BY SECTOR</div>
            <div style={{ fontSize: 11, color: textSecondary }}>10Y Treasury: <span style={{ color: "#fbbf24", fontWeight: 700 }}>{TREASURY_10Y}%</span></div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["SECTOR", "CURRENT", "PRIOR YEAR", "5Y AVG", "SPREAD vs 10Y", "YoY CHG"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "SECTOR" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAP_RATES.map((c, i) => {
                const spread = c.current - TREASURY_10Y;
                const yoyChg = c.current - c.priorYear;
                return (
                  <tr key={c.sector} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: c.color, marginRight: 8, verticalAlign: "middle" }} />
                      {c.sector}
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{c.current.toFixed(1)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{c.priorYear.toFixed(1)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{c.fiveYrAvg.toFixed(1)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: spread > 2 ? accent : spread > 1 ? "#fbbf24" : "#ef4444" }}>
                      +{spread.toFixed(0)} bps
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: yoyChg > 0 ? "#ff4d6a" : accent }}>
                      {yoyChg >= 0 ? "+" : ""}{(yoyChg * 100).toFixed(0)} bps
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Spread vs Treasury SVG Chart */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>CAP RATE SPREAD vs 10Y TREASURY</div>
          <svg viewBox="0 0 600 200" style={{ width: "100%", maxWidth: 700 }}>
            <line x1="80" y1="10" x2="80" y2="175" stroke={border} strokeWidth={1} />
            <line x1="80" y1="175" x2="590" y2="175" stroke={border} strokeWidth={1} />
            {/* Y axis labels */}
            {[0, 100, 200, 300, 400].map((v, idx) => (
              <g key={v}>
                <text x="75" y={175 - idx * 40} fill={textSecondary} fontSize="10" textAnchor="end" dominantBaseline="middle">{v}</text>
                <line x1="80" y1={175 - idx * 40} x2="590" y2={175 - idx * 40} stroke={border} strokeWidth={0.5} strokeDasharray="4,4" />
              </g>
            ))}
            <text x="40" y="92" fill={textSecondary} fontSize="10" textAnchor="middle" transform="rotate(-90,40,92)">Spread (bps)</text>
            {/* Bars */}
            {CAP_RATES.map((c, i) => {
              const spread = (c.current - TREASURY_10Y) * 100;
              const barH = Math.max(spread * 0.4, 2);
              const x = 100 + i * 70;
              return (
                <g key={c.sector}>
                  <rect x={x} y={175 - barH} width={50} height={barH} rx={3} fill={c.color} opacity={0.8} />
                  <text x={x + 25} y={190} fill={textSecondary} fontSize="9" textAnchor="middle">{c.sector.slice(0, 8)}</text>
                  <text x={x + 25} y={170 - barH} fill={textPrimary} fontSize="10" textAnchor="middle" fontWeight="700">{spread.toFixed(0)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* TAB: MORTGAGE */}
      {tab === "mortgage" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>MORTGAGE RATE MONITOR</div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["TYPE", "CURRENT", "1W AGO", "1M AGO", "1Y AGO", "5Y AVG", "vs 5Y AVG"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "TYPE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MORTGAGE_RATES.map((m, i) => {
                const vs5y = m.current - m.fiveYrAvg;
                return (
                  <tr key={m.type} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: m.color, marginRight: 8, verticalAlign: "middle" }} />
                      {m.type}
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 14, fontVariantNumeric: "tabular-nums", color: m.current > 7 ? "#ef4444" : "#fbbf24" }}>{m.current.toFixed(2)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{m.weekAgo.toFixed(2)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{m.monthAgo.toFixed(2)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{m.yearAgo.toFixed(2)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{m.fiveYrAvg.toFixed(2)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: vs5y > 1.5 ? "#ef4444" : vs5y > 0 ? "#fbbf24" : accent }}>
                      +{(vs5y * 100).toFixed(0)} bps
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Rate comparison bars */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>CURRENT vs 5-YEAR AVERAGE</div>
          {MORTGAGE_RATES.map(m => (
            <div key={m.type} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 130, fontSize: 11, color: textSecondary, textAlign: "right" }}>{m.type}</div>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <div style={{ height: 16, width: `${(m.current / 8) * 100}%`, background: m.color, borderRadius: 3, minWidth: 4 }} />
                </div>
                <div style={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
                  <div style={{ height: 8, width: `${(m.fiveYrAvg / 8) * 100}%`, background: `${m.color}40`, borderRadius: 3, border: `1px solid ${m.color}60`, minWidth: 4 }} />
                </div>
              </div>
              <div style={{ width: 80, fontSize: 10, color: textSecondary, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {m.current.toFixed(2)} / {m.fiveYrAvg.toFixed(2)}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: textSecondary }}>
            <div><span style={{ display: "inline-block", width: 16, height: 10, background: "#38bdf8", borderRadius: 2, verticalAlign: "middle", marginRight: 4 }} />Current</div>
            <div><span style={{ display: "inline-block", width: 16, height: 6, background: "#38bdf840", border: "1px solid #38bdf860", borderRadius: 2, verticalAlign: "middle", marginRight: 4 }} />5Y Average</div>
          </div>
        </div>
      )}

      {/* TAB: CMBS */}
      {tab === "cmbs" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>CMBS MONITOR — Commercial Mortgage-Backed Securities</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Total Outstanding", value: "$563.5B", color: "#38bdf8" },
              { label: "Avg Delinquency", value: `${(CMBS_DATA.reduce((s, c) => s + c.delinquency, 0) / CMBS_DATA.length).toFixed(1)}%`, color: "#fbbf24" },
              { label: "Avg Loss Severity", value: `${(CMBS_DATA.reduce((s, c) => s + c.lossSeverity, 0) / CMBS_DATA.length).toFixed(1)}%`, color: "#ef4444" },
              { label: "Special Servicing", value: `${(CMBS_DATA.reduce((s, c) => s + c.specialService, 0) / CMBS_DATA.length).toFixed(1)}%`, color: "#f97316" },
            ].map(k => (
              <div key={k.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ color: textSecondary, fontSize: 10, marginBottom: 4 }}>{k.label}</div>
                <div style={{ color: k.color, fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
              </div>
            ))}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["VINTAGE", "OUTSTANDING", "DELINQ %", "SPECIAL SERV %", "LOSS SEV %", "AVG COUPON"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "VINTAGE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CMBS_DATA.map((c, i) => (
                <tr key={c.vintage} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 700, color: c.color }}>{c.vintage}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{c.outstanding}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ color: c.delinquency > 6 ? "#ef4444" : c.delinquency > 3 ? "#fbbf24" : accent }}>{c.delinquency.toFixed(1)}%</span>
                    <div style={{ marginTop: 2, height: 4, background: `${border}`, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${c.delinquency * 10}%`, height: "100%", background: c.delinquency > 6 ? "#ef4444" : c.delinquency > 3 ? "#fbbf24" : accent, borderRadius: 2 }} />
                    </div>
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: c.specialService > 10 ? "#ef4444" : c.specialService > 5 ? "#fbbf24" : textPrimary }}>
                    {c.specialService.toFixed(1)}%
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: c.lossSeverity > 25 ? "#ef4444" : c.lossSeverity > 15 ? "#fbbf24" : accent }}>
                    {c.lossSeverity.toFixed(1)}%
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: textSecondary }}>
                    {c.avgCoupon.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Delinquency by vintage bar chart */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>DELINQUENCY BY VINTAGE</div>
          {CMBS_DATA.map(c => (
            <div key={c.vintage} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ width: 70, fontSize: 11, color: c.color, fontWeight: 700 }}>{c.vintage}</div>
              <div style={{ flex: 1, height: 14, background: `${border}40`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.delinquency * 10}%`, height: "100%", background: c.delinquency > 6 ? "#ef4444" : c.delinquency > 3 ? "#fbbf24" : accent, borderRadius: 4 }} />
              </div>
              <div style={{ width: 50, fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums", color: c.delinquency > 6 ? "#ef4444" : c.delinquency > 3 ? "#fbbf24" : accent }}>{c.delinquency.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>{tab === "dashboard" ? `${filtered.length} REITs | Sorted by ${sortBy}` : tab.toUpperCase()}</span>
        <span>DEMO MODE — Bloomberg REIT&lt;GO&gt; Equivalent</span>
      </div>
    </div>
  );
}
