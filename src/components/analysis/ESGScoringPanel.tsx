"use client";
import { useState } from "react";

/* ── Bloomberg ESG-tier Scoring & Sustainability Panel ────────── */

interface ESGCompany {
  ticker: string;
  name: string;
  sector: string;
  eScore: number;
  sScore: number;
  gScore: number;
  overall: number;
  controversy: 0 | 1 | 2 | 3;
  msci: string;
  sp: number;
  sustainalytics: number;
  scope1: number;
  scope2: number;
  scope3: number;
  intensity: number;
  netZero: string;
}

const DATA: ESGCompany[] = [
  { ticker: "AAPL", name: "Apple Inc", sector: "Technology", eScore: 82, sScore: 74, gScore: 88, overall: 81, controversy: 0, msci: "AA", sp: 78, sustainalytics: 14.2, scope1: 52, scope2: 1120, scope3: 23400, intensity: 4.2, netZero: "2030" },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", eScore: 91, sScore: 82, gScore: 90, overall: 88, controversy: 0, msci: "AAA", sp: 86, sustainalytics: 11.8, scope1: 125, scope2: 2840, scope3: 12800, intensity: 3.1, netZero: "2030" },
  { ticker: "GOOGL", name: "Alphabet", sector: "Technology", eScore: 78, sScore: 62, gScore: 72, overall: 71, controversy: 1, msci: "BBB", sp: 62, sustainalytics: 22.4, scope1: 14200, scope2: 5600, scope3: 8400, intensity: 8.4, netZero: "2030" },
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", eScore: 32, sScore: 44, gScore: 58, overall: 42, controversy: 3, msci: "CCC", sp: 28, sustainalytics: 42.8, scope1: 68000, scope2: 12400, scope3: 540000, intensity: 284.2, netZero: "2050" },
  { ticker: "CVX", name: "Chevron", sector: "Energy", eScore: 38, sScore: 48, gScore: 62, overall: 48, controversy: 2, msci: "B", sp: 34, sustainalytics: 38.4, scope1: 52000, scope2: 8400, scope3: 480000, intensity: 248.1, netZero: "2050" },
  { ticker: "JPM", name: "JPMorgan", sector: "Financials", eScore: 68, sScore: 72, gScore: 78, overall: 72, controversy: 1, msci: "A", sp: 68, sustainalytics: 24.8, scope1: 42, scope2: 1240, scope3: 42000, intensity: 12.4, netZero: "2050" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", eScore: 72, sScore: 54, gScore: 82, overall: 68, controversy: 2, msci: "A", sp: 64, sustainalytics: 26.2, scope1: 1420, scope2: 840, scope3: 8400, intensity: 18.2, netZero: "2045" },
  { ticker: "UNH", name: "UnitedHealth", sector: "Healthcare", eScore: 58, sScore: 68, gScore: 74, overall: 66, controversy: 1, msci: "BBB", sp: 58, sustainalytics: 28.4, scope1: 240, scope2: 620, scope3: 4200, intensity: 8.8, netZero: "2050" },
  { ticker: "TSLA", name: "Tesla", sector: "Consumer", eScore: 88, sScore: 42, gScore: 38, overall: 56, controversy: 2, msci: "B", sp: 42, sustainalytics: 32.4, scope1: 180, scope2: 1840, scope3: 18400, intensity: 6.8, netZero: "2030" },
  { ticker: "NKE", name: "Nike Inc", sector: "Consumer", eScore: 74, sScore: 62, gScore: 76, overall: 70, controversy: 1, msci: "A", sp: 66, sustainalytics: 22.8, scope1: 140, scope2: 420, scope3: 12400, intensity: 14.2, netZero: "2040" },
  { ticker: "NEE", name: "NextEra Energy", sector: "Utilities", eScore: 86, sScore: 72, gScore: 80, overall: 80, controversy: 0, msci: "AA", sp: 82, sustainalytics: 16.4, scope1: 24000, scope2: 1200, scope3: 4800, intensity: 42.8, netZero: "2045" },
  { ticker: "SO", name: "Southern Co", sector: "Utilities", eScore: 52, sScore: 64, gScore: 72, overall: 62, controversy: 1, msci: "BBB", sp: 54, sustainalytics: 30.2, scope1: 48000, scope2: 2400, scope3: 6800, intensity: 128.4, netZero: "2050" },
  { ticker: "CAT", name: "Caterpillar", sector: "Industrials", eScore: 62, sScore: 68, gScore: 74, overall: 68, controversy: 1, msci: "A", sp: 62, sustainalytics: 24.2, scope1: 2400, scope2: 840, scope3: 42000, intensity: 32.4, netZero: "2050" },
  { ticker: "BA", name: "Boeing", sector: "Industrials", eScore: 48, sScore: 42, gScore: 52, overall: 47, controversy: 3, msci: "CCC", sp: 32, sustainalytics: 38.8, scope1: 1800, scope2: 1240, scope3: 68000, intensity: 48.2, netZero: "None" },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumer", eScore: 76, sScore: 78, gScore: 84, overall: 79, controversy: 0, msci: "AA", sp: 76, sustainalytics: 18.4, scope1: 2800, scope2: 1200, scope3: 24000, intensity: 22.8, netZero: "2040" },
  { ticker: "RIO", name: "Rio Tinto", sector: "Materials", eScore: 44, sScore: 38, gScore: 68, overall: 48, controversy: 3, msci: "B", sp: 38, sustainalytics: 36.4, scope1: 32000, scope2: 8400, scope3: 240000, intensity: 182.4, netZero: "2050" },
];

interface GreenBond {
  issuer: string;
  type: "Green" | "Social" | "Sustainability" | "SLB";
  size: string;
  coupon: number;
  maturity: string;
  use: string;
  rating: string;
  greenium: number;
}

const GREEN_BONDS: GreenBond[] = [
  { issuer: "European Union", type: "Green", size: "€12.0B", coupon: 2.75, maturity: "2037", use: "Clean Energy & Transport", rating: "AAA", greenium: -4 },
  { issuer: "Germany", type: "Green", size: "€6.5B", coupon: 2.30, maturity: "2033", use: "Energy Efficiency", rating: "AAA", greenium: -3 },
  { issuer: "France OAT", type: "Green", size: "€8.0B", coupon: 2.50, maturity: "2039", use: "Biodiversity & Climate", rating: "AA-", greenium: -5 },
  { issuer: "Apple Inc", type: "Green", size: "$2.2B", coupon: 3.45, maturity: "2030", use: "Recycled Materials", rating: "AA+", greenium: -2 },
  { issuer: "Microsoft", type: "Sustainability", size: "$1.5B", coupon: 3.20, maturity: "2032", use: "Carbon Removal", rating: "AAA", greenium: -3 },
  { issuer: "JPMorgan", type: "Social", size: "$1.0B", coupon: 4.10, maturity: "2028", use: "Affordable Housing", rating: "A+", greenium: -1 },
  { issuer: "Enel SpA", type: "SLB", size: "€1.8B", coupon: 3.80, maturity: "2034", use: "Emissions KPI Target", rating: "BBB+", greenium: 0 },
  { issuer: "World Bank", type: "Green", size: "$3.0B", coupon: 2.90, maturity: "2031", use: "Climate Adaptation", rating: "AAA", greenium: -6 },
  { issuer: "Toyota", type: "Green", size: "¥50B", coupon: 0.45, maturity: "2029", use: "EV Manufacturing", rating: "A+", greenium: -2 },
  { issuer: "Iberdrola", type: "Green", size: "€1.2B", coupon: 3.60, maturity: "2035", use: "Wind & Solar", rating: "BBB+", greenium: -4 },
];

interface Controversy {
  company: string;
  ticker: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  headline: string;
  date: string;
  impact: string;
}

const CONTROVERSIES: Controversy[] = [
  { company: "Exxon Mobil", ticker: "XOM", severity: "Critical", category: "Environment", headline: "Class-action over climate disclosures; greenwashing allegations", date: "2024-11-14", impact: "ESG score -8pts" },
  { company: "Boeing", ticker: "BA", severity: "Critical", category: "Safety", headline: "NTSB investigation; quality control failures across 737 MAX line", date: "2024-11-12", impact: "ESG score -12pts" },
  { company: "Rio Tinto", ticker: "RIO", severity: "Critical", category: "Social", headline: "Indigenous heritage site destruction; compensation dispute ongoing", date: "2024-11-10", impact: "ESG score -10pts" },
  { company: "Tesla", ticker: "TSLA", severity: "High", category: "Governance", headline: "Board independence questioned; executive compensation controversy", date: "2024-11-08", impact: "G score -6pts" },
  { company: "Chevron", ticker: "CVX", severity: "High", category: "Environment", headline: "Ecuador contamination lawsuit; pipeline spill in California", date: "2024-11-06", impact: "E score -5pts" },
  { company: "Johnson & Johnson", ticker: "JNJ", severity: "High", category: "Product Safety", headline: "Talc litigation ongoing; $8.9B settlement proposal", date: "2024-11-04", impact: "S score -7pts" },
  { company: "Alphabet", ticker: "GOOGL", severity: "Medium", category: "Data Privacy", headline: "EU GDPR fine €1.2B; ad-tracking consent violations", date: "2024-11-02", impact: "S score -3pts" },
  { company: "UnitedHealth", ticker: "UNH", severity: "Medium", category: "Social", headline: "Claims denial rate scrutiny; Congressional hearing scheduled", date: "2024-10-28", impact: "S score -4pts" },
  { company: "Nike", ticker: "NKE", severity: "Low", category: "Supply Chain", headline: "Vietnam factory audit flags minor labor hour violations", date: "2024-10-24", impact: "S score -1pt" },
  { company: "Southern Co", ticker: "SO", severity: "Medium", category: "Environment", headline: "Coal ash pond remediation delays; EPA enforcement action", date: "2024-10-20", impact: "E score -4pts" },
];

const SECTORS = ["All", "Technology", "Energy", "Financials", "Healthcare", "Consumer", "Utilities", "Industrials", "Materials"];

function scoreColor(v: number): string {
  if (v >= 80) return "#00e5a0";
  if (v >= 65) return "#38bdf8";
  if (v >= 50) return "#fbbf24";
  if (v >= 35) return "#f97316";
  return "#ef4444";
}

function controversyBadge(level: 0 | 1 | 2 | 3): { label: string; color: string } {
  if (level === 0) return { label: "NONE", color: "#00e5a0" };
  if (level === 1) return { label: "LOW", color: "#fbbf24" };
  if (level === 2) return { label: "HIGH", color: "#f97316" };
  return { label: "SEVERE", color: "#ef4444" };
}

function severityColor(s: string): string {
  if (s === "Critical") return "#ef4444";
  if (s === "High") return "#f97316";
  if (s === "Medium") return "#fbbf24";
  return "#94a3b8";
}

function bondTypeColor(t: string): string {
  if (t === "Green") return "#00e5a0";
  if (t === "Social") return "#38bdf8";
  if (t === "Sustainability") return "#a855f7";
  return "#fbbf24";
}

type SortKey = "ticker" | "overall" | "eScore" | "sScore" | "gScore" | "sustainalytics";

export default function ESGScoringPanel() {
  const [tab, setTab] = useState<"scores" | "carbon" | "ratings" | "controversy" | "green-bonds">("scores");
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("overall");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const accent = "#00e5a0";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = sector === "All" ? DATA : DATA.filter(d => d.sector === sector);
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    if (typeof av === "string") return (av as string).localeCompare(bv as string) * sortDir;
    return ((av as number) - (bv as number)) * sortDir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortBy(key); setSortDir(-1); }
  };

  const avgE = Math.round(filtered.reduce((s, d) => s + d.eScore, 0) / filtered.length);
  const avgS = Math.round(filtered.reduce((s, d) => s + d.sScore, 0) / filtered.length);
  const avgG = Math.round(filtered.reduce((s, d) => s + d.gScore, 0) / filtered.length);

  const tabs = [
    { id: "scores" as const, label: "ESG SCORES" },
    { id: "carbon" as const, label: "CARBON" },
    { id: "ratings" as const, label: "RATINGS COMPARE" },
    { id: "controversy" as const, label: "CONTROVERSIES" },
    { id: "green-bonds" as const, label: "GREEN BONDS" },
  ];

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>ESG SCORING & SUSTAINABILITY</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Bloomberg BESG Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            <div>Avg E: <span style={{ color: scoreColor(avgE), fontWeight: 700 }}>{avgE}</span></div>
            <div>Avg S: <span style={{ color: scoreColor(avgS), fontWeight: 700 }}>{avgS}</span></div>
            <div>Avg G: <span style={{ color: scoreColor(avgG), fontWeight: 700 }}>{avgG}</span></div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${tab === t.id ? accent : border}`,
              background: tab === t.id ? `${accent}18` : "transparent",
              color: tab === t.id ? accent : textSecondary, cursor: "pointer"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Sector Filter (scores, carbon, ratings) */}
      {(tab === "scores" || tab === "carbon" || tab === "ratings") && (
        <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${sector === s ? accent : border}`,
              background: sector === s ? `${accent}18` : "transparent",
              color: sector === s ? accent : textSecondary, cursor: "pointer"
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* TAB: ESG SCORES */}
      {tab === "scores" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {([
                  ["ticker", "TICKER", "left"],
                  ["overall", "OVERALL", "right"],
                  ["eScore", "E SCORE", "right"],
                  ["sScore", "S SCORE", "right"],
                  ["gScore", "G SCORE", "right"],
                  ["sustainalytics", "SUST. RISK", "right"],
                ] as [SortKey, string, string][]).map(([key, label, align]) => (
                  <th key={key} onClick={() => toggleSort(key)} style={{
                    padding: "8px 10px", textAlign: align as "left" | "right",
                    borderBottom: `2px solid ${sortBy === key ? accent : border}`,
                    color: sortBy === key ? accent : textSecondary, fontSize: 11, fontWeight: 700,
                    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap"
                  }}>{label} {sortBy === key ? (sortDir === 1 ? "▲" : "▼") : ""}</th>
                ))}
                <th style={{ padding: "8px 10px", textAlign: "center", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>CONTR.</th>
                <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>SECTOR</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const cb = controversyBadge(d.controversy);
                return (
                  <tr key={d.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 700 }}>
                      <span style={{ color: "#fbbf24" }}>{d.ticker}</span>
                      <div style={{ fontSize: 10, color: textSecondary, fontWeight: 400 }}>{d.name}</div>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: scoreColor(d.overall), fontSize: 15 }}>{d.overall}</span>
                    </td>
                    {([d.eScore, d.sScore, d.gScore] as number[]).map((v, j) => (
                      <td key={j} style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                          <div style={{ width: 40, height: 6, background: border, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${v}%`, height: "100%", background: scoreColor(v), borderRadius: 3 }} />
                          </div>
                          <span style={{ color: scoreColor(v), fontWeight: 600, minWidth: 24 }}>{v}</span>
                        </div>
                      </td>
                    ))}
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.sustainalytics < 20 ? accent : d.sustainalytics < 30 ? "#fbbf24" : "#ef4444", fontWeight: 600 }}>
                        {d.sustainalytics.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: `${cb.color}18`, color: cb.color, border: `1px solid ${cb.color}40`
                      }}>{cb.label}</span>
                    </td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{d.sector}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: CARBON METRICS */}
      {tab === "carbon" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["COMPANY", "SCOPE 1", "SCOPE 2", "SCOPE 3", "INTENSITY", "NET ZERO"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "COMPANY" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const totalEmissions = d.scope1 + d.scope2 + d.scope3;
                const maxEmissions = Math.max(...filtered.map(f => f.scope1 + f.scope2 + f.scope3));
                return (
                  <tr key={d.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ color: "#fbbf24", fontWeight: 700 }}>{d.ticker}</span>
                      <span style={{ color: textSecondary, fontSize: 11, marginLeft: 8 }}>{d.name}</span>
                      <div style={{ marginTop: 4, height: 4, background: border, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${(totalEmissions / maxEmissions) * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${accent}, #fbbf24, #ef4444)` }} />
                      </div>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.scope1 > 10000 ? "#ef4444" : d.scope1 > 1000 ? "#fbbf24" : accent }}>{d.scope1.toLocaleString()}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}> tCO2e</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.scope2 > 5000 ? "#ef4444" : d.scope2 > 1000 ? "#fbbf24" : accent }}>{d.scope2.toLocaleString()}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}> tCO2e</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.scope3 > 100000 ? "#ef4444" : d.scope3 > 20000 ? "#fbbf24" : accent }}>{d.scope3.toLocaleString()}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}> tCO2e</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.intensity > 100 ? "#ef4444" : d.intensity > 30 ? "#fbbf24" : accent, fontWeight: 700 }}>{d.intensity.toFixed(1)}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}> tCO2/$M</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: d.netZero === "None" ? `#ef444418` : d.netZero === "2030" ? `${accent}18` : `#fbbf2418`,
                        color: d.netZero === "None" ? "#ef4444" : d.netZero === "2030" ? accent : "#fbbf24",
                        border: `1px solid ${d.netZero === "None" ? "#ef444440" : d.netZero === "2030" ? `${accent}40` : "#fbbf2440"}`
                      }}>{d.netZero}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: RATINGS COMPARE */}
      {tab === "ratings" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["COMPANY", "MSCI ESG", "S&P CSA", "SUSTAINALYTICS", "INTERNAL", "AGREEMENT"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "COMPANY" ? "left" : "center", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const msciNum = d.msci === "AAA" ? 95 : d.msci === "AA" ? 82 : d.msci === "A" ? 68 : d.msci === "BBB" ? 55 : d.msci === "BB" ? 42 : d.msci === "B" ? 30 : 18;
                const sustInv = 100 - d.sustainalytics * 2;
                const scores = [msciNum, d.sp, sustInv, d.overall];
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                const spread = Math.max(...scores) - Math.min(...scores);
                return (
                  <tr key={d.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ color: "#fbbf24", fontWeight: 700 }}>{d.ticker}</span>
                      <span style={{ color: textSecondary, fontSize: 11, marginLeft: 8 }}>{d.name}</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700,
                        background: `${scoreColor(msciNum)}18`, color: scoreColor(msciNum),
                        border: `1px solid ${scoreColor(msciNum)}40`
                      }}>{d.msci}</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: scoreColor(d.sp) }}>{d.sp}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}>/100</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: d.sustainalytics < 20 ? accent : d.sustainalytics < 30 ? "#fbbf24" : "#ef4444", fontWeight: 700 }}>{d.sustainalytics.toFixed(1)}</span>
                      <span style={{ color: textSecondary, fontSize: 10 }}> risk</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: scoreColor(d.overall) }}>{d.overall}</span>
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: spread < 15 ? `${accent}18` : spread < 30 ? "#fbbf2418" : "#ef444418",
                        color: spread < 15 ? accent : spread < 30 ? "#fbbf24" : "#ef4444"
                      }}>{spread < 15 ? "ALIGNED" : spread < 30 ? "MODERATE" : "DIVERGENT"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: CONTROVERSIES */}
      {tab === "controversy" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Critical", count: CONTROVERSIES.filter(c => c.severity === "Critical").length, color: "#ef4444" },
              { label: "High", count: CONTROVERSIES.filter(c => c.severity === "High").length, color: "#f97316" },
              { label: "Medium", count: CONTROVERSIES.filter(c => c.severity === "Medium").length, color: "#fbbf24" },
              { label: "Low", count: CONTROVERSIES.filter(c => c.severity === "Low").length, color: "#94a3b8" },
            ].map(s => (
              <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 16px", flex: 1, textAlign: "center" }}>
                <div style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.count}</div>
                <div style={{ color: textSecondary, fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {CONTROVERSIES.map((c, i) => (
            <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>{c.ticker}</span>
                  <span style={{ color: textSecondary, marginLeft: 8, fontSize: 12 }}>{c.company}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: `${severityColor(c.severity)}18`, color: severityColor(c.severity),
                    border: `1px solid ${severityColor(c.severity)}40`
                  }}>{c.severity.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: textSecondary }}>{c.date}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 4 }}>{c.headline}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: textSecondary }}>Category: <span style={{ color: "#38bdf8" }}>{c.category}</span></span>
                <span style={{ color: "#ef4444", fontWeight: 600 }}>{c.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: GREEN BONDS */}
      {tab === "green-bonds" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ display: "flex", gap: 12, padding: 16 }}>
            {[
              { label: "Green", count: GREEN_BONDS.filter(b => b.type === "Green").length, color: "#00e5a0" },
              { label: "Social", count: GREEN_BONDS.filter(b => b.type === "Social").length, color: "#38bdf8" },
              { label: "Sustainability", count: GREEN_BONDS.filter(b => b.type === "Sustainability").length, color: "#a855f7" },
              { label: "SLB", count: GREEN_BONDS.filter(b => b.type === "SLB").length, color: "#fbbf24" },
            ].map(s => (
              <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 16px", flex: 1, textAlign: "center" }}>
                <div style={{ color: s.color, fontSize: 20, fontWeight: 700 }}>{s.count}</div>
                <div style={{ color: textSecondary, fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ISSUER", "TYPE", "SIZE", "COUPON", "MATURITY", "USE OF PROCEEDS", "RATING", "GREENIUM"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "ISSUER" || h === "USE OF PROCEEDS" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GREEN_BONDS.map((b, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>{b.issuer}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: `${bondTypeColor(b.type)}18`, color: bondTypeColor(b.type),
                      border: `1px solid ${bondTypeColor(b.type)}40`
                    }}>{b.type}</span>
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{b.size}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{b.coupon.toFixed(2)}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary }}>{b.maturity}</td>
                  <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{b.use}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>{b.rating}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ color: b.greenium < 0 ? accent : "#fbbf24", fontWeight: 600 }}>{b.greenium} bps</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>{filtered.length} companies | {CONTROVERSIES.length} controversies | {GREEN_BONDS.length} green bonds</span>
        <span>DEMO MODE — Bloomberg BESG equivalent</span>
      </div>
    </div>
  );
}
