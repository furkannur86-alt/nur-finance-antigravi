"use client";
import { useState } from "react";

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

type Tab = "sovereign" | "corporate" | "curves" | "transition" | "distress";

interface SovereignCDS {
  country: string;
  cds5y: number;
  chg: number;
  moodys: string;
  sp: string;
  outlook: string;
  region: string;
}

const SOVEREIGN: SovereignCDS[] = [
  { country: "United States", cds5y: 28, chg: -2, moodys: "Aaa", sp: "AA+", outlook: "Stable", region: "NA" },
  { country: "Germany", cds5y: 12, chg: -1, moodys: "Aaa", sp: "AAA", outlook: "Stable", region: "EU" },
  { country: "United Kingdom", cds5y: 22, chg: 1, moodys: "Aa3", sp: "AA", outlook: "Stable", region: "EU" },
  { country: "France", cds5y: 32, chg: 3, moodys: "Aa2", sp: "AA-", outlook: "Negative", region: "EU" },
  { country: "Japan", cds5y: 25, chg: 0, moodys: "A1", sp: "A+", outlook: "Stable", region: "APAC" },
  { country: "China", cds5y: 68, chg: 5, moodys: "A1", sp: "A+", outlook: "Negative", region: "APAC" },
  { country: "Italy", cds5y: 85, chg: 4, moodys: "Baa3", sp: "BBB", outlook: "Stable", region: "EU" },
  { country: "Spain", cds5y: 48, chg: -2, moodys: "Baa1", sp: "A", outlook: "Positive", region: "EU" },
  { country: "South Korea", cds5y: 32, chg: 1, moodys: "Aa2", sp: "AA", outlook: "Stable", region: "APAC" },
  { country: "Brazil", cds5y: 142, chg: 8, moodys: "Ba2", sp: "BB-", outlook: "Stable", region: "LATAM" },
  { country: "Mexico", cds5y: 98, chg: 6, moodys: "Baa2", sp: "BBB", outlook: "Negative", region: "LATAM" },
  { country: "India", cds5y: 78, chg: -3, moodys: "Baa3", sp: "BBB-", outlook: "Positive", region: "APAC" },
  { country: "Turkey", cds5y: 310, chg: 15, moodys: "B3", sp: "B", outlook: "Positive", region: "EMEA" },
  { country: "South Africa", cds5y: 198, chg: 12, moodys: "Ba2", sp: "BB-", outlook: "Stable", region: "EMEA" },
  { country: "Russia", cds5y: 450, chg: 0, moodys: "Ca", sp: "SD", outlook: "N/A", region: "EMEA" },
  { country: "Argentina", cds5y: 1250, chg: -45, moodys: "Ca", sp: "CCC-", outlook: "Stable", region: "LATAM" },
  { country: "Indonesia", cds5y: 72, chg: -2, moodys: "Baa2", sp: "BBB", outlook: "Stable", region: "APAC" },
  { country: "Saudi Arabia", cds5y: 52, chg: 2, moodys: "A1", sp: "A", outlook: "Positive", region: "EMEA" },
  { country: "Poland", cds5y: 42, chg: -1, moodys: "A2", sp: "A-", outlook: "Stable", region: "EU" },
  { country: "Egypt", cds5y: 680, chg: 25, moodys: "Caa1", sp: "B-", outlook: "Stable", region: "EMEA" },
];

interface CorpBond {
  issuer: string;
  coupon: number;
  maturity: string;
  yield: number;
  spread: number;
  rating: string;
  sector: string;
}

const CORP_BONDS: CorpBond[] = [
  { issuer: "Apple Inc.", coupon: 3.25, maturity: "2029", yield: 4.12, spread: 42, rating: "AA+", sector: "Tech" },
  { issuer: "Microsoft", coupon: 3.50, maturity: "2031", yield: 4.28, spread: 48, rating: "AAA", sector: "Tech" },
  { issuer: "JPMorgan", coupon: 4.75, maturity: "2028", yield: 5.18, spread: 128, rating: "A+", sector: "Financials" },
  { issuer: "Goldman Sachs", coupon: 5.25, maturity: "2030", yield: 5.62, spread: 155, rating: "A", sector: "Financials" },
  { issuer: "Amazon", coupon: 3.15, maturity: "2032", yield: 4.42, spread: 62, rating: "AA-", sector: "Tech" },
  { issuer: "ExxonMobil", coupon: 4.10, maturity: "2029", yield: 4.85, spread: 95, rating: "AA-", sector: "Energy" },
  { issuer: "AT&T", coupon: 5.50, maturity: "2033", yield: 6.12, spread: 185, rating: "BBB", sector: "Telecom" },
  { issuer: "Ford Motor", coupon: 6.25, maturity: "2028", yield: 7.42, spread: 362, rating: "BB+", sector: "Auto" },
  { issuer: "Boeing", coupon: 5.80, maturity: "2030", yield: 6.85, spread: 275, rating: "BBB-", sector: "Industrial" },
  { issuer: "Netflix", coupon: 4.88, maturity: "2029", yield: 5.24, spread: 134, rating: "BBB", sector: "Media" },
  { issuer: "Tesla Inc.", coupon: 5.30, maturity: "2027", yield: 5.98, spread: 218, rating: "BBB-", sector: "Auto" },
  { issuer: "Pfizer", coupon: 3.40, maturity: "2031", yield: 4.52, spread: 72, rating: "A+", sector: "Pharma" },
  { issuer: "Meta Platforms", coupon: 4.45, maturity: "2032", yield: 4.82, spread: 82, rating: "AA-", sector: "Tech" },
  { issuer: "Citigroup", coupon: 5.10, maturity: "2029", yield: 5.48, spread: 158, rating: "A-", sector: "Financials" },
  { issuer: "Carnival Corp", coupon: 7.80, maturity: "2027", yield: 8.95, spread: 515, rating: "B+", sector: "Leisure" },
];

function cdsColor(cds: number): string {
  if (cds < 50) return green;
  if (cds < 100) return yellow;
  if (cds < 200) return "#f59e0b";
  if (cds < 500) return red;
  return "#dc2626";
}

function ratingColor(r: string): string {
  if (r.startsWith("AAA") || r.startsWith("Aaa")) return green;
  if (r.startsWith("AA") || r.startsWith("Aa")) return "#34d399";
  if (r.startsWith("A")) return blue;
  if (r.startsWith("BBB") || r.startsWith("Baa")) return yellow;
  if (r.startsWith("BB") || r.startsWith("Ba")) return "#f59e0b";
  if (r.startsWith("B")) return red;
  return "#dc2626";
}

const RATINGS = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "D"];
const TRANSITION: number[][] = [
  [90.81, 8.33, 0.68, 0.06, 0.12, 0.00, 0.00, 0.00],
  [0.70, 90.65, 7.79, 0.64, 0.06, 0.14, 0.02, 0.00],
  [0.09, 2.27, 91.05, 5.52, 0.74, 0.26, 0.01, 0.06],
  [0.02, 0.33, 5.95, 86.93, 5.30, 1.17, 0.12, 0.18],
  [0.03, 0.14, 0.67, 7.73, 80.53, 8.84, 1.00, 1.06],
  [0.00, 0.11, 0.24, 0.43, 6.48, 83.46, 4.07, 5.20],
  [0.22, 0.00, 0.22, 1.30, 2.38, 11.24, 64.86, 19.79],
  [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 100.0],
];

interface Distressed {
  issuer: string;
  sector: string;
  zScore: number;
  dtd: number;
  recovery: number;
  nextCoupon: string;
  spread: number;
  alert: "critical" | "warning" | "watch";
}

const DISTRESSED: Distressed[] = [
  { issuer: "Rite Aid Corp", sector: "Retail", zScore: -2.4, dtd: 0.8, recovery: 15, nextCoupon: "Dec 15", spread: 2850, alert: "critical" },
  { issuer: "Tupperware", sector: "Consumer", zScore: -1.8, dtd: 1.2, recovery: 22, nextCoupon: "Jan 15", spread: 2200, alert: "critical" },
  { issuer: "Bed Bath", sector: "Retail", zScore: -3.1, dtd: 0.4, recovery: 8, nextCoupon: "Nov 30", spread: 4500, alert: "critical" },
  { issuer: "WeWork", sector: "Real Estate", zScore: -2.8, dtd: 0.6, recovery: 12, nextCoupon: "Dec 01", spread: 3800, alert: "critical" },
  { issuer: "AMC Entmt", sector: "Leisure", zScore: -0.8, dtd: 2.4, recovery: 35, nextCoupon: "Mar 15", spread: 1450, alert: "warning" },
  { issuer: "Carvana", sector: "Auto", zScore: -0.5, dtd: 2.8, recovery: 38, nextCoupon: "Feb 01", spread: 1200, alert: "warning" },
  { issuer: "Spirit Airlines", sector: "Airlines", zScore: -1.2, dtd: 1.8, recovery: 28, nextCoupon: "Jan 15", spread: 1800, alert: "warning" },
  { issuer: "Macy's", sector: "Retail", zScore: 0.2, dtd: 3.5, recovery: 42, nextCoupon: "Apr 01", spread: 580, alert: "watch" },
  { issuer: "Gap Inc.", sector: "Retail", zScore: 0.5, dtd: 3.8, recovery: 45, nextCoupon: "Mar 15", spread: 420, alert: "watch" },
  { issuer: "Lumen Tech", sector: "Telecom", zScore: -0.3, dtd: 3.0, recovery: 32, nextCoupon: "Dec 15", spread: 980, alert: "watch" },
];

export default function CreditRiskPanel() {
  const [tab, setTab] = useState<Tab>("sovereign");
  const [corpSort, setCorpSort] = useState<keyof CorpBond>("spread");
  const [corpDir, setCorpDir] = useState<1 | -1>(-1);

  const tabs: { key: Tab; label: string }[] = [
    { key: "sovereign", label: "SOVEREIGN CDS" },
    { key: "corporate", label: "CORPORATE" },
    { key: "curves", label: "CDS CURVES" },
    { key: "transition", label: "TRANSITION" },
    { key: "distress", label: "DISTRESS" },
  ];

  const toggleCorpSort = (k: keyof CorpBond) => {
    if (corpSort === k) setCorpDir(d => d === 1 ? -1 : 1);
    else { setCorpSort(k); setCorpDir(-1); }
  };

  const sortedCorp = [...CORP_BONDS].sort((a, b) => {
    const av = a[corpSort], bv = b[corpSort];
    if (typeof av === "string") return (av as string).localeCompare(bv as string) * corpDir;
    return ((av as number) - (bv as number)) * corpDir;
  });

  const maxCds = Math.max(...SOVEREIGN.map(s => s.cds5y));

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>CREDIT RISK & SOVEREIGN ANALYTICS</span>
          <span style={{ color: txt2, fontSize: 11 }}>CDS • Ratings • Distress Monitor</span>
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
        {/* SOVEREIGN CDS */}
        {tab === "sovereign" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["COUNTRY", "5Y CDS (bps)", "CHG", "MOODY'S", "S&P", "OUTLOOK", "RISK BAR"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", textAlign: h === "COUNTRY" ? "left" : "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...SOVEREIGN].sort((a, b) => a.cds5y - b.cds5y).map((s, i) => (
                <tr key={s.country} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>
                    <span style={{ color: txt }}>{s.country}</span>
                    <span style={{ color: txt2, fontSize: 10, marginLeft: 6 }}>{s.region}</span>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: cdsColor(s.cds5y), fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.cds5y}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: s.chg > 0 ? red : s.chg < 0 ? green : txt2, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {s.chg > 0 ? "+" : ""}{s.chg}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: ratingColor(s.moodys), fontWeight: 700 }}>{s.moodys}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: ratingColor(s.sp), fontWeight: 700 }}>{s.sp}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: s.outlook === "Positive" ? green : s.outlook === "Negative" ? red : txt2, fontSize: 11 }}>{s.outlook}</td>
                  <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}` }}>
                    <div style={{ width: "100%", height: 8, background: border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min((s.cds5y / maxCds) * 100, 100)}%`, height: "100%", background: cdsColor(s.cds5y), borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* CORPORATE CREDIT */}
        {tab === "corporate" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {(["issuer", "coupon", "maturity", "yield", "spread", "rating", "sector"] as (keyof CorpBond)[]).map(k => {
                  const labels: Record<string, string> = { issuer: "ISSUER", coupon: "COUPON", maturity: "MATURITY", yield: "YIELD", spread: "SPREAD (bps)", rating: "RATING", sector: "SECTOR" };
                  return (
                    <th key={k} onClick={() => toggleCorpSort(k)} style={{
                      padding: "7px 10px", textAlign: k === "issuer" ? "left" : "center",
                      borderBottom: `2px solid ${corpSort === k ? accent : border}`, color: corpSort === k ? accent : txt2,
                      fontSize: 10, fontWeight: 700, cursor: "pointer", userSelect: "none",
                    }}>{labels[k]} {corpSort === k ? (corpDir === 1 ? "▲" : "▼") : ""}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedCorp.map((b, i) => (
                <tr key={b.issuer} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: yellow, borderBottom: `1px solid ${border}` }}>{b.issuer}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{b.coupon.toFixed(2)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: txt2 }}>{b.maturity}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{b.yield.toFixed(2)}%</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: b.spread > 300 ? red : b.spread > 150 ? yellow : green, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{b.spread}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: ratingColor(b.rating), fontWeight: 700 }}>{b.rating}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: txt2 }}>{b.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* CDS CURVES */}
        {tab === "curves" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: txt2, marginBottom: 12 }}>CDS Term Structure — Selected: Italy, Turkey, Brazil</div>
            <svg viewBox="0 0 700 300" style={{ width: "100%", maxHeight: 300 }}>
              <rect width="700" height="300" fill={surface} rx="6" />
              {[0, 1, 2, 3, 4].map(i => {
                const y = 25 + i * 60;
                const bps = 500 - i * 125;
                return (
                  <g key={i}>
                    <line x1="60" y1={y} x2="680" y2={y} stroke={border} strokeDasharray="4,4" />
                    <text x="50" y={y + 4} fill={txt2} fontSize="10" textAnchor="end">{bps}</text>
                  </g>
                );
              })}
              {["1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "15Y", "20Y", "30Y"].map((t, i) => (
                <text key={t} x={80 + i * 68} y="290" fill={txt2} fontSize="10" textAnchor="middle">{t}</text>
              ))}
              {[
                { label: "Turkey", base: 280, slope: 10, color: red },
                { label: "Brazil", base: 120, slope: 8, color: yellow },
                { label: "Italy", base: 65, slope: 6, color: blue },
              ].map(c => {
                const pts = Array.from({ length: 9 }, (_, i) => {
                  const bps = c.base + i * c.slope + Math.sin(i * 0.8) * 15;
                  const x = 80 + i * 68;
                  const y = 25 + (500 - bps) * 0.48;
                  return `${x},${y}`;
                });
                return (
                  <g key={c.label}>
                    <polyline points={pts.join(" ")} fill="none" stroke={c.color} strokeWidth="2" />
                    {pts.map((p, i) => {
                      const [cx, cy] = p.split(",").map(Number);
                      return <circle key={i} cx={cx} cy={cy} r="3" fill={c.color} />;
                    })}
                  </g>
                );
              })}
              <circle cx="100" cy="15" r="4" fill={red} /><text x="112" y="18" fill={red} fontSize="10">Turkey</text>
              <circle cx="190" cy="15" r="4" fill={yellow} /><text x="202" y="18" fill={yellow} fontSize="10">Brazil</text>
              <circle cx="270" cy="15" r="4" fill={blue} /><text x="282" y="18" fill={blue} fontSize="10">Italy</text>
            </svg>
          </div>
        )}

        {/* TRANSITION MATRIX */}
        {tab === "transition" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: txt2, marginBottom: 12 }}>1-Year Rating Transition Probability Matrix (%)</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "6px 10px", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, textAlign: "left" }}>FROM ▸</th>
                    {RATINGS.map(r => (
                      <th key={r} style={{ padding: "6px 10px", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, textAlign: "center" }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATINGS.map((r, ri) => (
                    <tr key={r}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, color: ratingColor(r), borderBottom: `1px solid ${border}` }}>{r}</td>
                      {TRANSITION[ri].map((v, ci) => {
                        const isStay = ri === ci;
                        const isDown = ci > ri && ci < 7;
                        const isDefault = ci === 7 && v > 0;
                        let cellColor = txt2;
                        let cellBg = "transparent";
                        if (isStay) { cellColor = green; cellBg = `${green}12`; }
                        else if (isDefault && v > 1) { cellColor = red; cellBg = `${red}15`; }
                        else if (isDown && v > 5) { cellColor = yellow; cellBg = `${yellow}10`; }
                        else if (v === 0) { cellColor = `${txt2}60`; }
                        return (
                          <td key={ci} style={{
                            padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${border}`,
                            fontVariantNumeric: "tabular-nums", fontSize: 11, fontWeight: isStay ? 700 : 400,
                            color: cellColor, background: cellBg,
                          }}>{v === 0 ? "—" : v.toFixed(v < 1 ? 2 : 1)}</td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DISTRESS MONITOR */}
        {tab === "distress" && (
          <div style={{ padding: 0 }}>
            <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
              <div>Critical: <span style={{ color: red, fontWeight: 700 }}>{DISTRESSED.filter(d => d.alert === "critical").length}</span></div>
              <div>Warning: <span style={{ color: yellow, fontWeight: 700 }}>{DISTRESSED.filter(d => d.alert === "warning").length}</span></div>
              <div>Watch: <span style={{ color: blue, fontWeight: 700 }}>{DISTRESSED.filter(d => d.alert === "watch").length}</span></div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ALERT", "ISSUER", "SECTOR", "Z-SCORE", "DIST-TO-DEFAULT", "RECOVERY EST", "SPREAD (bps)", "NEXT COUPON"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "ISSUER" || h === "SECTOR" ? "left" : "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 10, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRESSED.map((d, i) => {
                  const alertColor = d.alert === "critical" ? red : d.alert === "warning" ? yellow : blue;
                  return (
                    <tr key={d.issuer} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${alertColor}20`, color: alertColor }}>{d.alert.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "6px 10px", fontWeight: 700, color: yellow, borderBottom: `1px solid ${border}` }}>{d.issuer}</td>
                      <td style={{ padding: "6px 10px", color: txt2, borderBottom: `1px solid ${border}` }}>{d.sector}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: d.zScore < -1 ? red : d.zScore < 0 ? yellow : green, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.zScore.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: d.dtd < 1 ? red : d.dtd < 2 ? yellow : txt, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.dtd.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{d.recovery}%</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: d.spread > 2000 ? red : d.spread > 1000 ? yellow : txt, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.spread.toLocaleString()}</td>
                      <td style={{ padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`, color: txt2 }}>{d.nextCoupon}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: txt2 }}>Sovereigns: <span style={{ color: accent }}>{SOVEREIGN.length}</span> | Corporates: <span style={{ color: accent }}>{CORP_BONDS.length}</span> | Distressed: <span style={{ color: accent }}>{DISTRESSED.length}</span></span>
        <span style={{ color: txt2 }}>DEMO MODE — Bloomberg CDSW&lt;GO&gt; equivalent</span>
      </div>
    </div>
  );
}
