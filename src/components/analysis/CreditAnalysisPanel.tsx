"use client";
import { useState } from "react";

/* ── Bloomberg CRDT / RATC-style Credit Analysis Terminal ────── */

type Tab = "ratings" | "spreads" | "distress" | "migration" | "issuance";

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const txtDim = "#94a3b8";
const red = "#ff4d6a";
const green = "#00e5a0";
const yellow = "#fbbf24";
const orange = "#f97316";
const teal = "#2dd4bf";
const blue = "#38bdf8";

function ratingColor(r: string): string {
  if (r.startsWith("Aaa") || r.startsWith("AAA")) return green;
  if (r.startsWith("Aa") || r.startsWith("AA")) return teal;
  if (r.startsWith("A") && !r.startsWith("Aa") && !r.startsWith("AA")) return blue;
  if (r.startsWith("Baa") || r.startsWith("BBB")) return yellow;
  if (r.startsWith("Ba") || r.startsWith("BB")) return orange;
  return red;
}

function outlookColor(o: string): string {
  if (o === "Positive") return green;
  if (o === "Negative") return red;
  if (o === "Watch") return orange;
  return txtDim;
}

interface Issuer {
  entity: string;
  type: "Sovereign" | "Corporate";
  sector: string;
  moodys: string;
  sp: string;
  fitch: string;
  outlook: string;
  lastAction: string;
}

const ISSUERS: Issuer[] = [
  { entity: "United States", type: "Sovereign", sector: "Government", moodys: "Aaa", sp: "AA+", fitch: "AA+", outlook: "Stable", lastAction: "2023-08-01" },
  { entity: "Germany", type: "Sovereign", sector: "Government", moodys: "Aaa", sp: "AAA", fitch: "AAA", outlook: "Stable", lastAction: "2023-05-12" },
  { entity: "United Kingdom", type: "Sovereign", sector: "Government", moodys: "Aa3", sp: "AA", fitch: "AA-", outlook: "Stable", lastAction: "2023-10-20" },
  { entity: "Japan", type: "Sovereign", sector: "Government", moodys: "A1", sp: "A+", fitch: "A", outlook: "Stable", lastAction: "2023-03-15" },
  { entity: "China", type: "Sovereign", sector: "Government", moodys: "A1", sp: "A+", fitch: "A+", outlook: "Negative", lastAction: "2023-12-05" },
  { entity: "Italy", type: "Sovereign", sector: "Government", moodys: "Baa3", sp: "BBB", fitch: "BBB", outlook: "Stable", lastAction: "2023-11-17" },
  { entity: "Turkey", type: "Sovereign", sector: "Government", moodys: "B3", sp: "B", fitch: "B+", outlook: "Positive", lastAction: "2024-03-08" },
  { entity: "Brazil", type: "Sovereign", sector: "Government", moodys: "Ba2", sp: "BB", fitch: "BB", outlook: "Stable", lastAction: "2023-12-20" },
  { entity: "Apple Inc", type: "Corporate", sector: "Technology", moodys: "Aaa", sp: "AA+", fitch: "AA+", outlook: "Stable", lastAction: "2023-01-10" },
  { entity: "Microsoft Corp", type: "Corporate", sector: "Technology", moodys: "Aaa", sp: "AAA", fitch: "AAA", outlook: "Stable", lastAction: "2023-02-14" },
  { entity: "JPMorgan Chase", type: "Corporate", sector: "Financials", moodys: "Aa2", sp: "A+", fitch: "AA-", outlook: "Stable", lastAction: "2023-09-22" },
  { entity: "Goldman Sachs", type: "Corporate", sector: "Financials", moodys: "A1", sp: "BBB+", fitch: "A", outlook: "Stable", lastAction: "2023-07-18" },
  { entity: "AT&T Inc", type: "Corporate", sector: "Telecom", moodys: "Baa2", sp: "BBB", fitch: "BBB+", outlook: "Stable", lastAction: "2023-06-30" },
  { entity: "Ford Motor Co", type: "Corporate", sector: "Industrials", moodys: "Ba2", sp: "BB+", fitch: "BB+", outlook: "Positive", lastAction: "2024-01-15" },
  { entity: "Tesla Inc", type: "Corporate", sector: "Consumer", moodys: "Baa3", sp: "BBB-", fitch: "BBB-", outlook: "Watch", lastAction: "2024-02-28" },
  { entity: "Boeing Co", type: "Corporate", sector: "Industrials", moodys: "Baa2", sp: "BBB-", fitch: "BBB-", outlook: "Negative", lastAction: "2024-01-22" },
  { entity: "ExxonMobil", type: "Corporate", sector: "Energy", moodys: "Aa1", sp: "AA-", fitch: "AA-", outlook: "Stable", lastAction: "2023-04-05" },
  { entity: "Pfizer Inc", type: "Corporate", sector: "Healthcare", moodys: "A2", sp: "A+", fitch: "A", outlook: "Stable", lastAction: "2023-08-11" },
  { entity: "Amazon.com", type: "Corporate", sector: "Consumer", moodys: "A1", sp: "AA", fitch: "AA-", outlook: "Stable", lastAction: "2023-05-20" },
  { entity: "Meta Platforms", type: "Corporate", sector: "Technology", moodys: "Aa3", sp: "AA-", fitch: "A+", outlook: "Positive", lastAction: "2024-03-01" },
];

interface SpreadData {
  name: string;
  current: number;
  chg1d: number;
  chg1w: number;
  low52: number;
  high52: number;
  zScore: number;
}

const SPREADS: SpreadData[] = [
  { name: "US Investment Grade", current: 112, chg1d: -2, chg1w: -8, low52: 98, high52: 162, zScore: -0.42 },
  { name: "US High Yield", current: 384, chg1d: 5, chg1w: -12, low52: 320, high52: 540, zScore: -0.18 },
  { name: "Euro Investment Grade", current: 128, chg1d: -1, chg1w: -5, low52: 108, high52: 185, zScore: -0.31 },
  { name: "Euro High Yield", current: 412, chg1d: 8, chg1w: 3, low52: 348, high52: 580, zScore: 0.12 },
  { name: "EM Sovereign USD", current: 298, chg1d: -4, chg1w: -18, low52: 245, high52: 420, zScore: -0.56 },
  { name: "Asia Credit", current: 156, chg1d: 2, chg1w: -6, low52: 128, high52: 234, zScore: -0.22 },
];

interface DistressedCredit {
  entity: string;
  sector: string;
  spread: number;
  cds: number;
  pd: number;
  recovery: number;
}

const DISTRESSED: DistressedCredit[] = [
  { entity: "Evergrande Group", sector: "Real Estate", spread: 8400, cds: 9200, pd: 94.2, recovery: 8 },
  { entity: "Country Garden", sector: "Real Estate", spread: 6200, cds: 7100, pd: 82.5, recovery: 12 },
  { entity: "Rite Aid Corp", sector: "Retail", spread: 4800, cds: 5400, pd: 71.8, recovery: 18 },
  { entity: "Carvana Co", sector: "Consumer", spread: 2200, cds: 2800, pd: 42.3, recovery: 28 },
  { entity: "WeWork Inc", sector: "Real Estate", spread: 5600, cds: 6400, pd: 88.1, recovery: 5 },
  { entity: "Spirit Airlines", sector: "Airlines", spread: 3400, cds: 3900, pd: 58.4, recovery: 22 },
  { entity: "Yellow Corp", sector: "Transport", spread: 4100, cds: 4600, pd: 66.2, recovery: 15 },
  { entity: "Tupperware", sector: "Consumer", spread: 3800, cds: 4200, pd: 62.7, recovery: 20 },
  { entity: "Envision Healthcare", sector: "Healthcare", spread: 2800, cds: 3200, pd: 48.9, recovery: 32 },
  { entity: "Bausch Health", sector: "Healthcare", spread: 1900, cds: 2400, pd: 35.6, recovery: 35 },
].sort((a, b) => b.pd - a.pd);

const MIGRATION_LABELS = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC/D"];
const MIGRATION: number[][] = [
  [90.81, 8.33, 0.68, 0.06, 0.12, 0.00, 0.00],
  [0.70, 90.65, 7.79, 0.64, 0.06, 0.14, 0.02],
  [0.09, 2.27, 91.05, 5.52, 0.74, 0.26, 0.07],
  [0.02, 0.33, 5.95, 86.93, 5.30, 1.17, 0.30],
  [0.03, 0.14, 0.67, 7.73, 80.53, 8.84, 2.06],
  [0.00, 0.11, 0.24, 0.43, 6.48, 83.46, 9.28],
  [0.22, 0.00, 0.22, 1.30, 2.38, 11.24, 84.64],
];

interface Issuance {
  issuer: string;
  amount: string;
  tenor: string;
  coupon: number;
  spread: number;
  rating: string;
  date: string;
  currency: string;
}

const ISSUANCES: Issuance[] = [
  { issuer: "Apple Inc", amount: "$5.0B", tenor: "10Y", coupon: 4.421, spread: 55, rating: "AA+", date: "2024-03-12", currency: "USD" },
  { issuer: "JPMorgan Chase", amount: "$4.0B", tenor: "5Y", coupon: 4.850, spread: 85, rating: "A+", date: "2024-03-11", currency: "USD" },
  { issuer: "Germany (Bund)", amount: "€4.0B", tenor: "10Y", coupon: 2.500, spread: 0, rating: "AAA", date: "2024-03-10", currency: "EUR" },
  { issuer: "Microsoft Corp", amount: "$3.5B", tenor: "30Y", coupon: 4.950, spread: 72, rating: "AAA", date: "2024-03-09", currency: "USD" },
  { issuer: "Goldman Sachs", amount: "$3.0B", tenor: "7Y", coupon: 5.150, spread: 108, rating: "BBB+", date: "2024-03-08", currency: "USD" },
  { issuer: "Toyota Motor", amount: "¥200B", tenor: "5Y", coupon: 0.850, spread: 22, rating: "A+", date: "2024-03-07", currency: "JPY" },
  { issuer: "Amazon.com", amount: "$2.5B", tenor: "10Y", coupon: 4.550, spread: 60, rating: "AA", date: "2024-03-06", currency: "USD" },
  { issuer: "ExxonMobil", amount: "$2.0B", tenor: "20Y", coupon: 4.780, spread: 68, rating: "AA-", date: "2024-03-05", currency: "USD" },
  { issuer: "UK Gilt", amount: "£3.5B", tenor: "10Y", coupon: 4.125, spread: 0, rating: "AA", date: "2024-03-04", currency: "GBP" },
  { issuer: "Verizon Comms", amount: "$2.0B", tenor: "10Y", coupon: 5.250, spread: 125, rating: "BBB+", date: "2024-03-03", currency: "USD" },
  { issuer: "Samsung Elec", amount: "$1.5B", tenor: "5Y", coupon: 4.950, spread: 92, rating: "AA-", date: "2024-03-02", currency: "USD" },
  { issuer: "Nestle SA", amount: "€1.5B", tenor: "8Y", coupon: 3.250, spread: 48, rating: "AA", date: "2024-03-01", currency: "EUR" },
];

function Badge({ text, color: c }: { text: string; color: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11,
      fontWeight: 700, background: `${c}18`, color: c, border: `1px solid ${c}40`,
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5,
    }}>{text}</span>
  );
}

function RangeBar({ current, low, high }: { current: number; low: number; high: number }) {
  const range = high - low || 1;
  const pct = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 10, color: txtDim, width: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{low}</span>
      <div style={{ flex: 1, height: 8, background: border, borderRadius: 4, position: "relative", minWidth: 60 }}>
        <div style={{
          position: "absolute", left: `${pct}%`, top: -1, width: 10, height: 10,
          background: accent, borderRadius: "50%", transform: "translateX(-50%)",
          boxShadow: `0 0 6px ${accent}80`,
        }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: `${pct}%`, height: "100%", background: `${accent}30`, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 10, color: txtDim, width: 28, fontVariantNumeric: "tabular-nums" }}>{high}</span>
    </div>
  );
}

function MigrationHeatmap() {
  const max = 95;
  const cellColor = (v: number, isDiag: boolean): string => {
    if (isDiag) return `${accent}25`;
    if (v >= 5) return `${yellow}${Math.min(99, Math.round(v * 1.5)).toString(16).padStart(2, "0")}`;
    if (v >= 1) return `${orange}${Math.min(60, Math.round(v * 15)).toString(16).padStart(2, "0")}`;
    if (v >= 0.1) return `${red}18`;
    return "transparent";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 8px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>FROM ↓ / TO →</th>
            {MIGRATION_LABELS.map(l => (
              <th key={l} style={{ padding: "6px 8px", textAlign: "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MIGRATION.map((row, ri) => (
            <tr key={ri}>
              <td style={{ padding: "6px 8px", fontWeight: 700, color: ratingColor(MIGRATION_LABELS[ri]), borderBottom: `1px solid ${border}`, fontSize: 12 }}>
                {MIGRATION_LABELS[ri]}
              </td>
              {row.map((v, ci) => (
                <td key={ci} style={{
                  padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${border}`,
                  background: cellColor(v, ri === ci),
                  color: ri === ci ? accent : v >= 5 ? txt : v >= 0.1 ? txtDim : `${txtDim}60`,
                  fontWeight: ri === ci ? 700 : 400, fontSize: 11, fontVariantNumeric: "tabular-nums",
                }}>
                  {v.toFixed(2)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 10, color: txtDim }}>
        Source: S&P Global Ratings — 1-Year Transition Probabilities (Historical Average) | Diagonal = probability of staying at same rating
      </div>
    </div>
  );
}

export default function CreditAnalysisPanel() {
  const [tab, setTab] = useState<Tab>("ratings");
  const [ratingFilter, setRatingFilter] = useState<"All" | "Sovereign" | "Corporate">("All");

  const tabs: { id: Tab; label: string }[] = [
    { id: "ratings", label: "RATINGS" },
    { id: "spreads", label: "SPREADS" },
    { id: "distress", label: "DISTRESS" },
    { id: "migration", label: "MIGRATION" },
    { id: "issuance", label: "NEW ISSUE" },
  ];

  const filteredIssuers = ratingFilter === "All" ? ISSUERS : ISSUERS.filter(i => i.type === ratingFilter);

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>CREDIT ANALYSIS TERMINAL</span>
          <span style={{ color: txtDim, fontSize: 11 }}>CRDT // RATC // CDSW</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "5px 14px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${tab === t.id ? accent : border}`,
              background: tab === t.id ? `${accent}18` : "transparent",
              color: tab === t.id ? accent : txtDim, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {/* ── RATINGS TAB ── */}
        {tab === "ratings" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {(["All", "Sovereign", "Corporate"] as const).map(f => (
                <button key={f} onClick={() => setRatingFilter(f)} style={{
                  padding: "3px 10px", fontSize: 11, borderRadius: 4,
                  border: `1px solid ${ratingFilter === f ? accent : border}`,
                  background: ratingFilter === f ? `${accent}18` : "transparent",
                  color: ratingFilter === f ? accent : txtDim, cursor: "pointer", fontWeight: 600,
                }}>{f}</button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 11, color: txtDim }}>{filteredIssuers.length} issuers</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ENTITY", "TYPE", "SECTOR", "MOODY'S", "S&P", "FITCH", "OUTLOOK", "LAST ACTION"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIssuers.map((iss, i) => (
                  <tr key={iss.entity} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "7px 10px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{iss.entity}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
                      <Badge text={iss.type === "Sovereign" ? "SOV" : "CORP"} color={iss.type === "Sovereign" ? blue : yellow} />
                    </td>
                    <td style={{ padding: "7px 10px", color: txtDim, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{iss.sector}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}><Badge text={iss.moodys} color={ratingColor(iss.moodys)} /></td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}><Badge text={iss.sp} color={ratingColor(iss.sp)} /></td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}><Badge text={iss.fitch} color={ratingColor(iss.fitch)} /></td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ color: outlookColor(iss.outlook), fontWeight: 600, fontSize: 12 }}>{iss.outlook}</span>
                    </td>
                    <td style={{ padding: "7px 10px", color: txtDim, borderBottom: `1px solid ${border}`, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>{iss.lastAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── SPREADS TAB ── */}
        {tab === "spreads" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
              {SPREADS.map(s => (
                <div key={s.name} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</span>
                    <span style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 3,
                      background: s.zScore > 1 ? `${red}20` : s.zScore < -1 ? `${green}20` : `${txtDim}15`,
                      color: s.zScore > 1 ? red : s.zScore < -1 ? green : txtDim,
                    }}>Z: {s.zScore > 0 ? "+" : ""}{s.zScore.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: txtDim }}>CURRENT</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums" }}>{s.current}<span style={{ fontSize: 12, fontWeight: 400 }}> bps</span></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: txtDim }}>1D CHG</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: s.chg1d <= 0 ? green : red, fontVariantNumeric: "tabular-nums" }}>
                        {s.chg1d > 0 ? "+" : ""}{s.chg1d}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: txtDim }}>1W CHG</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: s.chg1w <= 0 ? green : red, fontVariantNumeric: "tabular-nums" }}>
                        {s.chg1w > 0 ? "+" : ""}{s.chg1w}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: txtDim, marginBottom: 4 }}>52-WEEK RANGE</div>
                  <RangeBar current={s.current} low={s.low52} high={s.high52} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 8 }}>SPREAD SUMMARY</div>
              <div style={{ display: "flex", gap: 24, fontSize: 12, flexWrap: "wrap" }}>
                <div>IG vs HY Spread: <span style={{ color: yellow, fontWeight: 600 }}>{SPREADS[1].current - SPREADS[0].current} bps</span></div>
                <div>IG Compression: <span style={{ color: green, fontWeight: 600 }}>{SPREADS[0].chg1w}bps (1W)</span></div>
                <div>EM Premium: <span style={{ color: txt, fontWeight: 600 }}>{SPREADS[4].current - SPREADS[0].current} bps vs US IG</span></div>
                <div>HY Distress Ratio: <span style={{ color: orange, fontWeight: 600 }}>4.8%</span></div>
              </div>
            </div>
          </>
        )}

        {/* ── DISTRESS TAB ── */}
        {tab === "distress" && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "DISTRESSED CREDITS", value: DISTRESSED.length.toString(), color: red },
                { label: "AVG PD", value: `${(DISTRESSED.reduce((s, d) => s + d.pd, 0) / DISTRESSED.length).toFixed(1)}%`, color: orange },
                { label: "AVG SPREAD", value: `${Math.round(DISTRESSED.reduce((s, d) => s + d.spread, 0) / DISTRESSED.length)} bps`, color: yellow },
                { label: "AVG RECOVERY", value: `${Math.round(DISTRESSED.reduce((s, d) => s + d.recovery, 0) / DISTRESSED.length)}%`, color: green },
              ].map(m => (
                <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 16px", minWidth: 140 }}>
                  <div style={{ fontSize: 10, color: txtDim }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ENTITY", "SECTOR", "SPREAD (bps)", "CDS (bps)", "PROB DEFAULT", "RECOVERY EST", "RISK"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "ENTITY" || h === "SECTOR" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRESSED.map((d, i) => {
                  const riskColor = d.pd > 80 ? red : d.pd > 50 ? orange : yellow;
                  return (
                    <tr key={d.entity} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                      <td style={{ padding: "7px 10px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{d.entity}</td>
                      <td style={{ padding: "7px 10px", color: txtDim, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{d.sector}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: red, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.spread.toLocaleString()}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: red, fontVariantNumeric: "tabular-nums" }}>{d.cds.toLocaleString()}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        <span style={{ color: riskColor }}>{d.pd.toFixed(1)}%</span>
                      </td>
                      <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: green, fontVariantNumeric: "tabular-nums" }}>{d.recovery}%</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                        <div style={{ width: 60, height: 8, background: border, borderRadius: 4, overflow: "hidden", marginLeft: "auto" }}>
                          <div style={{ width: `${d.pd}%`, height: "100%", background: riskColor, borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {/* ── MIGRATION TAB ── */}
        {tab === "migration" && (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 4 }}>RATING TRANSITION MATRIX</div>
            <div style={{ fontSize: 11, color: txtDim, marginBottom: 16 }}>1-Year Rating Migration Probabilities (%) — S&P Global Historical Averages</div>
            <MigrationHeatmap />
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { label: "Avg IG Stability", value: "89.9%", desc: "AAA→BBB diagonal avg", color: green },
                { label: "Avg HY Stability", value: "82.9%", desc: "BB→CCC diagonal avg", color: yellow },
                { label: "Fallen Angel Rate", value: "5.30%", desc: "BBB→BB transition", color: orange },
                { label: "Rising Star Rate", value: "7.73%", desc: "BB→BBB transition", color: teal },
              ].map(c => (
                <div key={c.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: txtDim }}>{c.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: c.color, fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
                  <div style={{ fontSize: 10, color: txtDim }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ISSUANCE TAB ── */}
        {tab === "issuance" && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "TOTAL ISSUANCE (2W)", value: "$32.5B", color: accent },
                { label: "AVG SPREAD", value: "68 bps", color: yellow },
                { label: "AVG COUPON", value: "4.21%", color: blue },
                { label: "IG / HY RATIO", value: "85% / 15%", color: teal },
              ].map(m => (
                <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 16px", minWidth: 140 }}>
                  <div style={{ fontSize: 10, color: txtDim }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["DATE", "ISSUER", "CCY", "AMOUNT", "TENOR", "COUPON", "SPREAD", "RATING"].map(h => (
                    <th key={h} style={{
                      padding: "7px 10px", textAlign: h === "ISSUER" ? "left" : "right",
                      borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ISSUANCES.map((iss, i) => (
                  <tr key={`${iss.issuer}-${iss.date}`} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: txtDim, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>{iss.date}</td>
                    <td style={{ padding: "7px 10px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{iss.issuer}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
                      <Badge text={iss.currency} color={iss.currency === "USD" ? green : iss.currency === "EUR" ? blue : yellow} />
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{iss.amount}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: txtDim, fontVariantNumeric: "tabular-nums" }}>{iss.tenor}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: yellow, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{iss.coupon.toFixed(3)}%</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>
                      {iss.spread > 0 ? `+${iss.spread}` : "BM"}
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                      <Badge text={iss.rating} color={ratingColor(iss.rating)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 10, color: txtDim }}>
        <span>NUR CREDIT TERMINAL v2.1 — {tab.toUpperCase()} VIEW</span>
        <span>DEMO MODE — Live data requires NUR Finance B subscription</span>
      </div>
    </div>
  );
}
