"use client";
import { useState } from "react";

/* ── Bloomberg-tier Structured Products & Securitization ──────── */

interface Tranche {
  cusip: string;
  deal: string;
  type: "RMBS" | "CMBS" | "ABS-Auto" | "ABS-Card" | "ABS-Student" | "CLO";
  tranche: string;
  coupon: number;
  wal: number;
  cpr: number;
  cdr: number;
  rating: string;
  price: number;
  spread: number;
  factor: number;
  origBal: string;
}

const TRANCHES: Tranche[] = [
  { cusip: "38378KAA3", deal: "GNMA 2024-12", type: "RMBS", tranche: "A1", coupon: 5.50, wal: 3.2, cpr: 18.4, cdr: 0.8, rating: "AAA", price: 101.24, spread: 42, factor: 0.84, origBal: "$500M" },
  { cusip: "38378KAB1", deal: "GNMA 2024-12", type: "RMBS", tranche: "A2", coupon: 5.75, wal: 7.4, cpr: 14.2, cdr: 1.2, rating: "AAA", price: 100.86, spread: 58, factor: 0.91, origBal: "$350M" },
  { cusip: "38378KAC9", deal: "GNMA 2024-12", type: "RMBS", tranche: "M1", coupon: 6.25, wal: 12.8, cpr: 12.1, cdr: 2.4, rating: "AA", price: 98.42, spread: 142, factor: 0.96, origBal: "$120M" },
  { cusip: "12345ABC6", deal: "JPMMT 2024-3", type: "CMBS", tranche: "A-S", coupon: 5.10, wal: 4.8, cpr: 0, cdr: 0.4, rating: "AAA", price: 100.12, spread: 68, factor: 1.0, origBal: "$800M" },
  { cusip: "12345ABD4", deal: "JPMMT 2024-3", type: "CMBS", tranche: "B", coupon: 5.85, wal: 8.2, cpr: 0, cdr: 1.8, rating: "AA-", price: 97.56, spread: 185, factor: 1.0, origBal: "$200M" },
  { cusip: "12345ABE2", deal: "JPMMT 2024-3", type: "CMBS", tranche: "C", coupon: 6.40, wal: 9.8, cpr: 0, cdr: 3.2, rating: "A", price: 94.28, spread: 312, factor: 1.0, origBal: "$80M" },
  { cusip: "78901XYZ1", deal: "FORDO 2024-A", type: "ABS-Auto", tranche: "A3", coupon: 4.85, wal: 1.8, cpr: 1.4, cdr: 0.6, rating: "AAA", price: 100.42, spread: 28, factor: 0.72, origBal: "$620M" },
  { cusip: "78901XYZ2", deal: "FORDO 2024-A", type: "ABS-Auto", tranche: "B", coupon: 5.20, wal: 2.4, cpr: 1.4, cdr: 1.2, rating: "AA", price: 99.86, spread: 65, factor: 0.78, origBal: "$140M" },
  { cusip: "45678DEF3", deal: "CAALT 2024-2", type: "ABS-Card", tranche: "A", coupon: 5.05, wal: 2.1, cpr: 22.8, cdr: 3.4, rating: "AAA", price: 100.18, spread: 32, factor: 0.68, origBal: "$450M" },
  { cusip: "45678DEF4", deal: "CAALT 2024-2", type: "ABS-Card", tranche: "B", coupon: 5.60, wal: 3.8, cpr: 22.8, cdr: 4.8, rating: "A+", price: 98.92, spread: 124, factor: 0.74, origBal: "$100M" },
  { cusip: "23456GHI5", deal: "SLM 2024-1", type: "ABS-Student", tranche: "A", coupon: 5.35, wal: 5.2, cpr: 8.4, cdr: 2.1, rating: "AAA", price: 100.56, spread: 48, factor: 0.88, origBal: "$380M" },
  { cusip: "23456GHI6", deal: "SLM 2024-1", type: "ABS-Student", tranche: "B", coupon: 6.10, wal: 8.6, cpr: 8.4, cdr: 4.2, rating: "BBB+", price: 96.24, spread: 248, factor: 0.92, origBal: "$60M" },
  { cusip: "67890JKL7", deal: "BSABS 2024-1", type: "RMBS", tranche: "IO", coupon: 1.20, wal: 4.4, cpr: 24.6, cdr: 1.4, rating: "NR", price: 8.42, spread: 0, factor: 0.0, origBal: "$1.2B" },
  { cusip: "34567MNO8", deal: "WFRBS 2024-C", type: "CMBS", tranche: "D", coupon: 7.10, wal: 10.0, cpr: 0, cdr: 5.4, rating: "BBB-", price: 88.64, spread: 482, factor: 1.0, origBal: "$45M" },
];

interface CLODeal {
  name: string;
  manager: string;
  vintage: number;
  aum: string;
  seniorYield: number;
  mezYield: number;
  equityYield: number;
  ocSenior: number;
  ocSeniorTest: number;
  ocMez: number;
  ocMezTest: number;
  icSenior: number;
  icSeniorTest: number;
  warf: number;
  diversity: number;
  status: "Reinvesting" | "Amortizing" | "Warehouse";
}

const CLO_DEALS: CLODeal[] = [
  { name: "BLUEM 2024-1", manager: "BlueMtn Capital", vintage: 2024, aum: "$512M", seniorYield: 6.42, mezYield: 8.84, equityYield: 14.2, ocSenior: 128.4, ocSeniorTest: 120.0, ocMez: 112.8, ocMezTest: 108.0, icSenior: 142.6, icSeniorTest: 120.0, warf: 2842, diversity: 78, status: "Reinvesting" },
  { name: "CARLYL 2023-4", manager: "Carlyle Group", vintage: 2023, aum: "$480M", seniorYield: 6.18, mezYield: 8.42, equityYield: 12.8, ocSenior: 132.1, ocSeniorTest: 120.0, ocMez: 118.4, ocMezTest: 108.0, icSenior: 148.2, icSeniorTest: 120.0, warf: 2684, diversity: 84, status: "Reinvesting" },
  { name: "ARES 2024-2", manager: "Ares Management", vintage: 2024, aum: "$620M", seniorYield: 6.56, mezYield: 9.12, equityYield: 15.4, ocSenior: 126.2, ocSeniorTest: 120.0, ocMez: 110.4, ocMezTest: 108.0, icSenior: 138.8, icSeniorTest: 120.0, warf: 2924, diversity: 72, status: "Reinvesting" },
  { name: "BKLN 2022-8", manager: "Blackstone Credit", vintage: 2022, aum: "$445M", seniorYield: 5.84, mezYield: 7.92, equityYield: 11.4, ocSenior: 136.8, ocSeniorTest: 120.0, ocMez: 122.6, ocMezTest: 108.0, icSenior: 156.4, icSeniorTest: 120.0, warf: 2548, diversity: 92, status: "Amortizing" },
  { name: "OAKTREE 2024-A", manager: "Oaktree Capital", vintage: 2024, aum: "$380M", seniorYield: 6.72, mezYield: 9.48, equityYield: 16.8, ocSenior: 124.6, ocSeniorTest: 120.0, ocMez: 108.2, ocMezTest: 108.0, icSenior: 134.2, icSeniorTest: 120.0, warf: 3042, diversity: 68, status: "Warehouse" },
  { name: "KKR 2023-2", manager: "KKR Credit", vintage: 2023, aum: "$560M", seniorYield: 6.28, mezYield: 8.68, equityYield: 13.6, ocSenior: 130.4, ocSeniorTest: 120.0, ocMez: 116.8, ocMezTest: 108.0, icSenior: 144.8, icSeniorTest: 120.0, warf: 2726, diversity: 86, status: "Reinvesting" },
];

interface StructuredNote {
  isin: string;
  issuer: string;
  type: "Autocallable" | "Barrier Rev Conv" | "Range Accrual" | "Capital Protected" | "Leveraged";
  underlying: string;
  maturity: string;
  coupon: number;
  barrier: number;
  strikeLevel: number;
  currentSpot: number;
  bidPrice: number;
  status: "Live" | "Called" | "Breached" | "Matured";
}

const STRUCTURED_NOTES: StructuredNote[] = [
  { isin: "XS1234567890", issuer: "JPMorgan", type: "Autocallable", underlying: "SX5E", maturity: "2025-06-15", coupon: 8.5, barrier: 60, strikeLevel: 100, currentSpot: 92.4, bidPrice: 96.8, status: "Live" },
  { isin: "XS2345678901", issuer: "Goldman Sachs", type: "Barrier Rev Conv", underlying: "TSLA", maturity: "2025-03-20", coupon: 12.4, barrier: 55, strikeLevel: 100, currentSpot: 78.2, bidPrice: 88.4, status: "Live" },
  { isin: "XS3456789012", issuer: "Barclays", type: "Range Accrual", underlying: "EURUSD", maturity: "2025-09-30", coupon: 6.8, barrier: 0, strikeLevel: 0, currentSpot: 0, bidPrice: 101.2, status: "Live" },
  { isin: "XS4567890123", issuer: "Morgan Stanley", type: "Autocallable", underlying: "SPX", maturity: "2025-12-15", coupon: 7.2, barrier: 65, strikeLevel: 100, currentSpot: 104.8, bidPrice: 102.4, status: "Live" },
  { isin: "XS5678901234", issuer: "UBS", type: "Capital Protected", underlying: "Gold", maturity: "2026-03-30", coupon: 3.4, barrier: 0, strikeLevel: 100, currentSpot: 108.2, bidPrice: 100.8, status: "Live" },
  { isin: "XS6789012345", issuer: "BNP Paribas", type: "Autocallable", underlying: "NKY", maturity: "2024-11-15", coupon: 9.8, barrier: 70, strikeLevel: 100, currentSpot: 112.4, bidPrice: 100.0, status: "Called" },
  { isin: "XS7890123456", issuer: "Citi", type: "Barrier Rev Conv", underlying: "NVDA", maturity: "2025-01-20", coupon: 15.2, barrier: 50, strikeLevel: 100, currentSpot: 42.8, bidPrice: 62.4, status: "Breached" },
  { isin: "XS8901234567", issuer: "Deutsche Bank", type: "Leveraged", underlying: "DAX", maturity: "2025-06-30", coupon: 0, barrier: 75, strikeLevel: 100, currentSpot: 106.4, bidPrice: 112.8, status: "Live" },
];

function ratingColor(r: string): string {
  if (r === "NR") return "#64748b";
  if (r.startsWith("AAA")) return "#00e5a0";
  if (r.startsWith("AA")) return "#38bdf8";
  if (r.startsWith("A") && !r.startsWith("AA")) return "#a78bfa";
  if (r.startsWith("BBB")) return "#fbbf24";
  if (r.startsWith("BB")) return "#f97316";
  return "#ef4444";
}

function statusColor(s: string): string {
  if (s === "Live" || s === "Reinvesting") return "#00e5a0";
  if (s === "Called" || s === "Amortizing") return "#38bdf8";
  if (s === "Warehouse") return "#fbbf24";
  if (s === "Breached") return "#ef4444";
  if (s === "Matured") return "#64748b";
  return "#94a3b8";
}

type Tab = "abs-mbs" | "clo" | "prepay" | "notes" | "waterfall";

export default function StructuredProductsPanel() {
  const [tab, setTab] = useState<Tab>("abs-mbs");
  const [typeFilter, setTypeFilter] = useState("All");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const types = ["All", "RMBS", "CMBS", "ABS-Auto", "ABS-Card", "ABS-Student"];
  const filteredTranches = typeFilter === "All" ? TRANCHES : TRANCHES.filter(t => t.type === typeFilter);

  // Prepayment CPR SVG data
  const cprMonths = Array.from({ length: 24 }, (_, i) => {
    const psa100 = Math.min(0.2 + (i * 0.2), 6.0);
    const psa150 = Math.min(0.3 + (i * 0.3), 9.0);
    const psa200 = Math.min(0.4 + (i * 0.4), 12.0);
    const actual = psa150 + (Math.random() - 0.5) * 2;
    return { month: i + 1, psa100, psa150, psa200, actual: Math.max(0.5, actual) };
  });

  // Waterfall data
  const waterfallItems = [
    { label: "Gross Collections", amount: 4850000, cumulative: 4850000, color: "#38bdf8" },
    { label: "– Servicing Fee (0.25%)", amount: -125000, cumulative: 4725000, color: "#ef4444" },
    { label: "– Trustee Fee", amount: -18000, cumulative: 4707000, color: "#ef4444" },
    { label: "= Net Available", amount: 4707000, cumulative: 4707000, color: "#fbbf24" },
    { label: "→ Senior A1 Interest", amount: -1425000, cumulative: 3282000, color: "#00e5a0" },
    { label: "→ Senior A2 Interest", amount: -1048000, cumulative: 2234000, color: "#00e5a0" },
    { label: "→ Senior Principal", amount: -842000, cumulative: 1392000, color: "#38bdf8" },
    { label: "OC Test: Senior", amount: 0, cumulative: 0, color: "#00e5a0" },
    { label: "→ Mezzanine Interest", amount: -388000, cumulative: 1004000, color: "#a78bfa" },
    { label: "→ Mezzanine Principal", amount: -224000, cumulative: 780000, color: "#a78bfa" },
    { label: "OC Test: Mezzanine", amount: 0, cumulative: 0, color: "#fbbf24" },
    { label: "→ Subordinate Interest", amount: -186000, cumulative: 594000, color: "#f97316" },
    { label: "→ Excess Spread / Equity", amount: -594000, cumulative: 0, color: "#e879f9" },
  ];

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>STRUCTURED PRODUCTS & SECURITIZATION</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Bloomberg STRUC / MTGE Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["abs-mbs", "clo", "prepay", "notes", "waterfall"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase"
              }}>{t === "abs-mbs" ? "ABS/MBS" : t === "clo" ? "CLO" : t === "prepay" ? "PREPAY" : t === "notes" ? "STRUCT NOTES" : "WATERFALL"}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ABS/MBS Monitor Tab */}
      {tab === "abs-mbs" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} style={{
                padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${typeFilter === t ? accent : border}`,
                background: typeFilter === t ? `${accent}18` : "transparent",
                color: typeFilter === t ? accent : textSecondary, cursor: "pointer"
              }}>{t}</button>
            ))}
            <span style={{ marginLeft: "auto", color: textSecondary, fontSize: 11, alignSelf: "center" }}>{filteredTranches.length} tranches</span>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["CUSIP", "DEAL", "TYPE", "TRANCHE", "CPN", "WAL", "CPR", "CDR", "RATING", "PRICE", "SPREAD", "FACTOR"].map(h => (
                    <th key={h} style={{ padding: "7px 8px", textAlign: h === "CUSIP" || h === "DEAL" || h === "TYPE" || h === "TRANCHE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTranches.map((t, i) => (
                  <tr key={t.cusip} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>{t.cusip}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11, fontWeight: 600 }}>{t.deal}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
                      <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }}>{t.type}</span>
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>{t.tranche}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{t.coupon.toFixed(2)}%</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{t.wal.toFixed(1)}y</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: t.cpr > 20 ? "#fbbf24" : textPrimary }}>{t.cpr.toFixed(1)}%</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: t.cdr > 3 ? "#ef4444" : t.cdr > 1.5 ? "#fbbf24" : textPrimary }}>{t.cdr.toFixed(1)}%</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right" }}>
                      <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: `${ratingColor(t.rating)}18`, color: ratingColor(t.rating), border: `1px solid ${ratingColor(t.rating)}40` }}>{t.rating}</span>
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{t.price.toFixed(2)}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: textSecondary }}>+{t.spread}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: textSecondary }}>{t.factor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLO Tracker Tab */}
      {tab === "clo" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
            {CLO_DEALS.map(d => (
              <div key={d.name} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>{d.name}</span>
                    <div style={{ color: textSecondary, fontSize: 11 }}>{d.manager} | {d.vintage} | {d.aum}</div>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${statusColor(d.status)}18`, color: statusColor(d.status), border: `1px solid ${statusColor(d.status)}40` }}>{d.status}</span>
                </div>

                {/* Tranche Yields */}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {[
                    { label: "SENIOR", yield: d.seniorYield, color: "#00e5a0" },
                    { label: "MEZZ", yield: d.mezYield, color: "#fbbf24" },
                    { label: "EQUITY", yield: d.equityYield, color: "#e879f9" },
                  ].map(t => (
                    <div key={t.label} style={{ flex: 1, background: `${t.color}08`, border: `1px solid ${t.color}30`, borderRadius: 4, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: textSecondary }}>{t.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: t.color, fontVariantNumeric: "tabular-nums" }}>{t.yield.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>

                {/* OC/IC Tests */}
                <div style={{ fontSize: 11 }}>
                  {[
                    { label: "OC Senior", actual: d.ocSenior, test: d.ocSeniorTest },
                    { label: "OC Mezz", actual: d.ocMez, test: d.ocMezTest },
                    { label: "IC Senior", actual: d.icSenior, test: d.icSeniorTest },
                  ].map(test => {
                    const pass = test.actual >= test.test;
                    const cushion = test.actual - test.test;
                    return (
                      <div key={test.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${border}` }}>
                        <span style={{ color: textSecondary }}>{test.label}</span>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>{test.actual.toFixed(1)}%</span>
                          <span style={{ color: textSecondary }}>/ {test.test.toFixed(1)}%</span>
                          <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: pass ? `${accent}18` : "#ef444418", color: pass ? accent : "#ef4444" }}>
                            {pass ? "PASS" : "FAIL"} {cushion >= 0 ? "+" : ""}{cushion.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: textSecondary }}>
                  <span>WARF: <span style={{ color: d.warf > 2900 ? "#fbbf24" : textPrimary, fontWeight: 600 }}>{d.warf}</span></span>
                  <span>Diversity: <span style={{ color: d.diversity < 75 ? "#fbbf24" : accent, fontWeight: 600 }}>{d.diversity}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prepayment Analysis Tab */}
      {tab === "prepay" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>CPR vs PSA SPEED CURVES (24-Mo)</div>
          <svg viewBox="0 0 700 280" style={{ width: "100%", maxWidth: 700, display: "block", marginBottom: 24 }}>
            <rect x={0} y={0} width={700} height={280} fill="transparent" />
            {/* Grid */}
            {[0, 3, 6, 9, 12].map((v, i) => {
              const y = 250 - (v / 12) * 220;
              return <g key={i}><line x1={50} y1={y} x2={680} y2={y} stroke={border} strokeWidth={1} /><text x={44} y={y + 4} fill={textSecondary} fontSize={10} textAnchor="end">{v}%</text></g>;
            })}
            {/* PSA curves */}
            {[
              { data: cprMonths.map(d => d.psa100), color: "#64748b", label: "100 PSA", dash: "4 2" },
              { data: cprMonths.map(d => d.psa150), color: "#fbbf24", label: "150 PSA", dash: "4 2" },
              { data: cprMonths.map(d => d.psa200), color: "#ef4444", label: "200 PSA", dash: "4 2" },
              { data: cprMonths.map(d => d.actual), color: accent, label: "Actual CPR", dash: "0" },
            ].map((curve, ci) => {
              const pts = curve.data.map((v, i) => `${50 + (i / 23) * 630},${250 - (v / 12) * 220}`).join(" ");
              return <polyline key={ci} points={pts} fill="none" stroke={curve.color} strokeWidth={ci === 3 ? 2.5 : 1.5} strokeDasharray={curve.dash} />;
            })}
            {/* Legend */}
            {[
              { label: "100 PSA", color: "#64748b", x: 80 },
              { label: "150 PSA", color: "#fbbf24", x: 200 },
              { label: "200 PSA", color: "#ef4444", x: 320 },
              { label: "Actual CPR", color: accent, x: 440 },
            ].map(l => (
              <g key={l.label}><line x1={l.x} y1={16} x2={l.x + 20} y2={16} stroke={l.color} strokeWidth={2} /><text x={l.x + 26} y={20} fill={l.color} fontSize={11}>{l.label}</text></g>
            ))}
            {/* X axis labels */}
            {[1, 6, 12, 18, 24].map(m => (
              <text key={m} x={50 + ((m - 1) / 23) * 630} y={270} fill={textSecondary} fontSize={10} textAnchor="middle">Mo {m}</text>
            ))}
          </svg>

          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>BURNOUT & PREPAYMENT METRICS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            {[
              { label: "1-Mo CPR", value: "18.4%", color: "#fbbf24" },
              { label: "3-Mo CPR", value: "16.2%", color: "#fbbf24" },
              { label: "6-Mo CPR", value: "14.8%", color: "#fbbf24" },
              { label: "Life CPR", value: "12.4%", color: accent },
              { label: "Current PSA", value: "168", color: "#38bdf8" },
              { label: "Burnout Factor", value: "0.72", sub: "High refinance exhaustion", color: "#ef4444" },
              { label: "Media WAC", value: "5.82%", color: textPrimary },
              { label: "Turnover Rate", value: "8.4%", color: "#a78bfa" },
              { label: "Curtailment", value: "2.1%", color: textSecondary },
              { label: "Full Payoff", value: "14.8%", color: "#f97316" },
            ].map(m => (
              <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: 10 }}>
                <div style={{ color: textSecondary, fontSize: 11 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                {"sub" in m && <div style={{ color: textSecondary, fontSize: 10 }}>{m.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Notes Tab */}
      {tab === "notes" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ISIN", "ISSUER", "TYPE", "UNDL", "MATURITY", "CPN", "BARRIER", "SPOT", "BID", "STATUS"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "ISIN" || h === "ISSUER" || h === "TYPE" || h === "UNDL" || h === "MATURITY" || h === "STATUS" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRUCTURED_NOTES.map((n, i) => {
                const nearBarrier = n.barrier > 0 && n.currentSpot > 0 && n.currentSpot <= n.barrier * 1.15;
                return (
                  <tr key={n.isin} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>{n.isin}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, fontSize: 12 }}>{n.issuer}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, background: `#a78bfa18`, color: "#a78bfa", border: "1px solid #a78bfa40" }}>{n.type}</span>
                    </td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>{n.underlying}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 11 }}>{n.maturity}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontWeight: 600, color: accent, fontVariantNumeric: "tabular-nums" }}>{n.coupon > 0 ? `${n.coupon.toFixed(1)}%` : "—"}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: nearBarrier ? "#ef4444" : textSecondary }}>{n.barrier > 0 ? `${n.barrier}%` : "—"}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: n.currentSpot > 0 ? (nearBarrier ? "#ef4444" : textPrimary) : textSecondary }}>{n.currentSpot > 0 ? `${n.currentSpot.toFixed(1)}%` : "—"}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{n.bidPrice.toFixed(1)}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: `${statusColor(n.status)}18`, color: statusColor(n.status), border: `1px solid ${statusColor(n.status)}40` }}>{n.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Waterfall Model Tab */}
      {tab === "waterfall" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {/* Tranche Hierarchy Visualization */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>TRANCHE HIERARCHY — PRIORITY OF PAYMENTS</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { label: "SENIOR AAA", pct: 72, color: "#00e5a0", coupon: "5.50%", bal: "$850M" },
              { label: "MEZZANINE AA/A", pct: 16, color: "#fbbf24", coupon: "6.25%", bal: "$190M" },
              { label: "SUBORDINATE BBB", pct: 8, color: "#f97316", coupon: "7.10%", bal: "$95M" },
              { label: "EQUITY / RESIDUAL", pct: 4, color: "#e879f9", coupon: "Excess", bal: "$47M" },
            ].map((tr, i) => (
              <div key={tr.label} style={{ flex: tr.pct, background: `${tr.color}12`, border: `1px solid ${tr.color}40`, borderRadius: 6, padding: 10, minWidth: 100 }}>
                <div style={{ fontSize: 10, color: tr.color, fontWeight: 700, marginBottom: 4 }}>{tr.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary, fontVariantNumeric: "tabular-nums" }}>{tr.pct}%</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>Cpn: {tr.coupon}</div>
                <div style={{ fontSize: 11, color: textSecondary }}>Bal: {tr.bal}</div>
                {i < 3 && (
                  <div style={{ fontSize: 10, color: tr.color, marginTop: 4, opacity: 0.8 }}>Priority #{i + 1}</div>
                )}
              </div>
            ))}
          </div>

          {/* Cash Flow Waterfall */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>MONTHLY CASH FLOW WATERFALL</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["STEP", "DESCRIPTION", "AMOUNT", "REMAINING"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "STEP" || h === "DESCRIPTION" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {waterfallItems.map((w, i) => {
                const isTest = w.label.startsWith("OC Test");
                const running = waterfallItems.slice(0, i + 1).reduce((s, item) => {
                  if (item.label.startsWith("OC Test") || item.label.startsWith("= ")) return s;
                  return item.amount > 0 && i === 0 ? item.amount : s + (item.amount < 0 ? item.amount : 0);
                }, 0);
                return (
                  <tr key={i} style={{ background: isTest ? `${accent}08` : i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "5px 10px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{isTest ? "✓" : `${i + 1 - waterfallItems.slice(0, i).filter(x => x.label.startsWith("OC")).length}`}</td>
                    <td style={{ padding: "5px 10px", borderBottom: `1px solid ${border}`, fontWeight: isTest ? 700 : 400, color: isTest ? accent : textPrimary }}>{w.label}</td>
                    <td style={{ padding: "5px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: isTest ? accent : w.amount >= 0 ? accent : w.color }}>
                      {isTest ? "PASS" : w.amount >= 0 ? `$${(w.amount / 1000).toFixed(0)}K` : `($${(Math.abs(w.amount) / 1000).toFixed(0)}K)`}
                    </td>
                    <td style={{ padding: "5px 10px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums", color: textSecondary }}>
                      {isTest ? "—" : w.cumulative >= 0 ? `$${(w.cumulative / 1000).toFixed(0)}K` : "$0K"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Credit Enhancement Bars */}
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginTop: 20, marginBottom: 12 }}>CREDIT ENHANCEMENT</div>
          {[
            { label: "Senior A1", ce: 28.0, color: "#00e5a0" },
            { label: "Senior A2", ce: 22.4, color: "#00e5a0" },
            { label: "Mezzanine", ce: 12.0, color: "#fbbf24" },
            { label: "Subordinate", ce: 4.0, color: "#f97316" },
          ].map(ce => (
            <div key={ce.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 100, fontSize: 11, color: textSecondary, textAlign: "right" }}>{ce.label}</div>
              <div style={{ flex: 1, height: 16, background: border, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${ce.ce / 30 * 100}%`, height: "100%", background: ce.color, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: bg }}>{ce.ce.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>{tab === "abs-mbs" ? `${filteredTranches.length} tranches` : tab === "clo" ? `${CLO_DEALS.length} CLO deals` : tab === "notes" ? `${STRUCTURED_NOTES.length} notes` : tab === "prepay" ? "PSA Speed Analysis" : "Priority of Payments"}</span>
        <span>DEMO MODE — Bloomberg STRUC/MTGE equivalent</span>
      </div>
    </div>
  );
}
