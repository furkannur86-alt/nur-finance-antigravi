"use client";

import { useState, useMemo } from "react";

/* ── constants ──────────────────────────────────────────────── */
const CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","NZD","TRY","CNY"] as const;
type Ccy = (typeof CURRENCIES)[number];

const BASE_RATES: Record<Ccy, number> = {
  USD: 1, EUR: 1.0862, GBP: 1.2715, JPY: 0.006623, CHF: 1.1298,
  CAD: 0.7362, AUD: 0.6541, NZD: 0.6098, TRY: 0.0294, CNY: 0.1382,
};

const DAILY_CHG: Record<Ccy, number> = {
  USD: 0, EUR: 0.0012, GBP: -0.0008, JPY: -0.0034, CHF: 0.0019,
  CAD: -0.0015, AUD: 0.0027, NZD: 0.0009, TRY: -0.0041, CNY: -0.0006,
};

const STRENGTH: Record<Ccy, { d1: number; w1: number; m1: number }> = {
  USD: { d1: 62, w1: 71, m1: 58 }, EUR: { d1: 55, w1: 48, m1: 61 },
  GBP: { d1: 44, w1: 52, m1: 49 }, JPY: { d1: 28, w1: 31, m1: 35 },
  CHF: { d1: 68, w1: 64, m1: 70 }, CAD: { d1: 38, w1: 42, m1: 45 },
  AUD: { d1: 71, w1: 55, m1: 52 }, NZD: { d1: 51, w1: 46, m1: 40 },
  TRY: { d1: 12, w1: 15, m1: 10 }, CNY: { d1: 42, w1: 39, m1: 44 },
};

const CARRY_PAIRS: { pair: string; rate1: number; rate2: number; diff: number; dir: string }[] = [
  { pair: "TRY/JPY", rate1: 50.00, rate2: -0.10, diff: 50.10, dir: "Long TRY" },
  { pair: "MXN/JPY", rate1: 11.25, rate2: -0.10, diff: 11.35, dir: "Long MXN" },
  { pair: "BRL/CHF", rate1: 13.75, rate2: 1.75, diff: 12.00, dir: "Long BRL" },
  { pair: "ZAR/JPY", rate1: 8.25, rate2: -0.10, diff: 8.35, dir: "Long ZAR" },
  { pair: "AUD/JPY", rate1: 4.35, rate2: -0.10, diff: 4.45, dir: "Long AUD" },
  { pair: "NZD/CHF", rate1: 5.50, rate2: 1.75, diff: 3.75, dir: "Long NZD" },
  { pair: "USD/JPY", rate1: 5.50, rate2: -0.10, diff: 5.60, dir: "Long USD" },
  { pair: "GBP/CHF", rate1: 5.25, rate2: 1.75, diff: 3.50, dir: "Long GBP" },
];

const VOL_SURFACE: { pair: string; w1: number; m1: number; m3: number; m6: number; y1: number }[] = [
  { pair: "EUR/USD", w1: 6.8, m1: 7.2, m3: 7.5, m6: 7.8, y1: 8.1 },
  { pair: "GBP/USD", w1: 8.1, m1: 8.5, m3: 8.9, m6: 9.2, y1: 9.5 },
  { pair: "USD/JPY", w1: 9.4, m1: 10.1, m3: 10.5, m6: 10.8, y1: 11.2 },
  { pair: "USD/CHF", w1: 7.2, m1: 7.6, m3: 7.9, m6: 8.2, y1: 8.5 },
  { pair: "AUD/USD", w1: 10.2, m1: 10.8, m3: 11.1, m6: 11.4, y1: 11.8 },
  { pair: "USD/CAD", w1: 7.5, m1: 7.9, m3: 8.2, m6: 8.5, y1: 8.8 },
  { pair: "USD/TRY", w1: 18.4, m1: 19.2, m3: 20.1, m6: 21.5, y1: 23.0 },
  { pair: "USD/CNY", w1: 5.8, m1: 6.1, m3: 6.4, m6: 6.7, y1: 7.0 },
];

const ECON_EVENTS: { time: string; ccy: string; event: string; impact: "HIGH" | "MED"; prev: string; forecast: string }[] = [
  { time: "08:30", ccy: "USD", event: "Non-Farm Payrolls", impact: "HIGH", prev: "227K", forecast: "205K" },
  { time: "10:00", ccy: "USD", event: "ISM Manufacturing PMI", impact: "HIGH", prev: "49.3", forecast: "49.8" },
  { time: "11:45", ccy: "EUR", event: "ECB Rate Decision", impact: "HIGH", prev: "4.50%", forecast: "4.25%" },
  { time: "14:00", ccy: "GBP", event: "BoE Monetary Policy", impact: "HIGH", prev: "5.25%", forecast: "5.25%" },
  { time: "19:50", ccy: "JPY", event: "BoJ Policy Statement", impact: "HIGH", prev: "-0.10%", forecast: "-0.10%" },
];

/* ── helpers ─────────────────────────────────────────────────── */
function crossRate(base: Ccy, quote: Ccy): number {
  if (base === quote) return 1;
  return BASE_RATES[base] / BASE_RATES[quote];
}

function crossChg(base: Ccy, quote: Ccy): number {
  return DAILY_CHG[base] - DAILY_CHG[quote];
}

function fmt(n: number, d: number = 4): string {
  if (n >= 100) return n.toFixed(2);
  if (n >= 10) return n.toFixed(3);
  return n.toFixed(d);
}

function chgColor(v: number): string {
  if (v > 0.001) return "#00e5a0";
  if (v < -0.001) return "#ef4444";
  return "#6b7280";
}

function strengthColor(v: number): string {
  if (v >= 65) return "#00e5a0";
  if (v >= 45) return "#fbbf24";
  if (v >= 30) return "#f97316";
  return "#ef4444";
}

/* ── styles ──────────────────────────────────────────────────── */
const S = {
  root: { background: "var(--ag-bg, #0a0e17)", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", fontSize: 11, minHeight: "100vh", padding: "12px 16px", lineHeight: 1.4 } as React.CSSProperties,
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10, borderBottom: "1px solid #1e293b", paddingBottom: 8 } as React.CSSProperties,
  title: { fontSize: 14, fontWeight: 700, color: "#00e5a0", letterSpacing: 1.5, textTransform: "uppercase" as const },
  badge: { background: "#00e5a01a", border: "1px solid #00e5a044", color: "#00e5a0", padding: "2px 8px", fontSize: 9, letterSpacing: 1, borderRadius: 2 },
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 10 } as React.CSSProperties,
  section: { background: "var(--ag-surface, #111827)", border: "1px solid #1e293b", borderRadius: 4, padding: 10, marginBottom: 10 } as React.CSSProperties,
  sectionTitle: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 8 },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 10 },
  th: { padding: "4px 6px", textAlign: "center" as const, color: "#64748b", fontWeight: 600, fontSize: 9, letterSpacing: 0.5, borderBottom: "1px solid #1e293b" },
  td: { padding: "3px 5px", textAlign: "center" as const, borderBottom: "1px solid #0f172a" },
  tabRow: { display: "flex", gap: 4, marginBottom: 8 } as React.CSSProperties,
  tab: (active: boolean) => ({ padding: "3px 10px", fontSize: 9, fontWeight: 600, letterSpacing: 1, cursor: "pointer", border: "1px solid " + (active ? "#00e5a0" : "#1e293b"), background: active ? "#00e5a018" : "transparent", color: active ? "#00e5a0" : "#64748b", borderRadius: 2 }),
};

/* ── component ───────────────────────────────────────────────── */
export default function FXCrossRatePanel() {
  const [strengthPeriod, setStrengthPeriod] = useState<"d1" | "w1" | "m1">("d1");
  const [highlightCcy, setHighlightCcy] = useState<Ccy | null>(null);

  const sortedCarry = useMemo(() => [...CARRY_PAIRS].sort((a, b) => b.diff - a.diff), []);

  return (
    <div style={S.root}>
      {/* header */}
      <div style={S.header}>
        <span style={S.title}>FXCM — FX Cross Rate Matrix</span>
        <span style={S.badge}>REAL-TIME</span>
        <span style={{ marginLeft: "auto", color: "#64748b", fontSize: 10 }}>
          10×10 · {CURRENCIES.length} CCY · DEMO
        </span>
      </div>

      <div style={S.grid}>
        {/* ── LEFT COLUMN ──────────────────────────────── */}
        <div>
          {/* Cross Rate Matrix */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Cross Rate Matrix — Daily Δ</div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, textAlign: "left", width: 44 }}>BASE\QTE</th>
                    {CURRENCIES.map(c => (
                      <th key={c} style={{ ...S.th, color: highlightCcy === c ? "#00e5a0" : "#64748b", cursor: "pointer" }}
                          onMouseEnter={() => setHighlightCcy(c)} onMouseLeave={() => setHighlightCcy(null)}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CURRENCIES.map(base => (
                    <tr key={base} onMouseEnter={() => setHighlightCcy(base)} onMouseLeave={() => setHighlightCcy(null)}>
                      <td style={{ ...S.td, textAlign: "left", fontWeight: 700, color: highlightCcy === base ? "#00e5a0" : "#e2e8f0", fontSize: 10 }}>
                        {base}
                      </td>
                      {CURRENCIES.map(quote => {
                        if (base === quote) {
                          return <td key={quote} style={{ ...S.td, color: "#334155", fontSize: 9 }}>—</td>;
                        }
                        const rate = crossRate(base, quote);
                        const chg = crossChg(base, quote);
                        const hl = highlightCcy === base || highlightCcy === quote;
                        return (
                          <td key={quote} style={{
                            ...S.td,
                            background: hl ? "#1e293b44" : "transparent",
                            color: chgColor(chg),
                            fontVariantNumeric: "tabular-nums",
                          }}>
                            <div style={{ lineHeight: 1.2 }}>{fmt(rate)}</div>
                            <div style={{ fontSize: 8, opacity: 0.7 }}>
                              {chg >= 0 ? "+" : ""}{(chg * 100).toFixed(2)}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Economic Calendar Strip */}
          <div style={S.section}>
            <div style={S.sectionTitle}>High-Impact Economic Calendar</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, textAlign: "left" }}>TIME (ET)</th>
                  <th style={S.th}>CCY</th>
                  <th style={{ ...S.th, textAlign: "left" }}>EVENT</th>
                  <th style={S.th}>IMPACT</th>
                  <th style={S.th}>PREV</th>
                  <th style={S.th}>F&apos;CAST</th>
                </tr>
              </thead>
              <tbody>
                {ECON_EVENTS.map((e, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, textAlign: "left", color: "#fbbf24", fontWeight: 600 }}>{e.time}</td>
                    <td style={{ ...S.td, fontWeight: 700 }}>
                      <span style={{ background: "#1e293b", padding: "1px 6px", borderRadius: 2 }}>{e.ccy}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: "left", color: "#e2e8f0" }}>{e.event}</td>
                    <td style={S.td}>
                      <span style={{
                        background: e.impact === "HIGH" ? "#ef44441a" : "#fbbf241a",
                        color: e.impact === "HIGH" ? "#ef4444" : "#fbbf24",
                        padding: "1px 6px", borderRadius: 2, fontSize: 9, fontWeight: 700,
                      }}>{e.impact}</span>
                    </td>
                    <td style={{ ...S.td, color: "#94a3b8" }}>{e.prev}</td>
                    <td style={{ ...S.td, color: "#e2e8f0", fontWeight: 600 }}>{e.forecast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div>
          {/* Currency Strength Meter */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Currency Strength Index</div>
            <div style={S.tabRow}>
              {(["d1", "w1", "m1"] as const).map(p => (
                <span key={p} style={S.tab(strengthPeriod === p)} onClick={() => setStrengthPeriod(p)}>
                  {p === "d1" ? "1D" : p === "w1" ? "1W" : "1M"}
                </span>
              ))}
            </div>
            {[...CURRENCIES]
              .sort((a, b) => STRENGTH[b][strengthPeriod] - STRENGTH[a][strengthPeriod])
              .map(ccy => {
                const v = STRENGTH[ccy][strengthPeriod];
                return (
                  <div key={ccy} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 32, fontWeight: 700, fontSize: 10, color: "#e2e8f0" }}>{ccy}</span>
                    <div style={{ flex: 1, height: 12, background: "#0f172a", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        width: `${v}%`, height: "100%",
                        background: `linear-gradient(90deg, ${strengthColor(v)}88, ${strengthColor(v)})`,
                        borderRadius: 2, transition: "width 0.3s",
                      }} />
                    </div>
                    <span style={{ width: 24, textAlign: "right", fontWeight: 600, color: strengthColor(v), fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  </div>
                );
              })}
          </div>

          {/* Carry Trade Monitor */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Carry Trade Monitor</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, textAlign: "left" }}>PAIR</th>
                  <th style={S.th}>LONG</th>
                  <th style={S.th}>SHORT</th>
                  <th style={S.th}>DIFF</th>
                  <th style={{ ...S.th, textAlign: "left" }}>DIR</th>
                </tr>
              </thead>
              <tbody>
                {sortedCarry.map((c, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, textAlign: "left", fontWeight: 700, color: "#e2e8f0" }}>{c.pair}</td>
                    <td style={{ ...S.td, color: "#00e5a0", fontVariantNumeric: "tabular-nums" }}>{c.rate1.toFixed(2)}%</td>
                    <td style={{ ...S.td, color: "#ef4444", fontVariantNumeric: "tabular-nums" }}>{c.rate2.toFixed(2)}%</td>
                    <td style={{ ...S.td, fontWeight: 700, color: "#fbbf24", fontVariantNumeric: "tabular-nums" }}>
                      +{c.diff.toFixed(2)}%
                    </td>
                    <td style={{ ...S.td, textAlign: "left", color: "#94a3b8", fontSize: 9 }}>{c.dir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FX Volatility Surface */}
          <div style={S.section}>
            <div style={S.sectionTitle}>Implied Volatility Surface (%)</div>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, textAlign: "left" }}>PAIR</th>
                  <th style={S.th}>1W</th>
                  <th style={S.th}>1M</th>
                  <th style={S.th}>3M</th>
                  <th style={S.th}>6M</th>
                  <th style={S.th}>1Y</th>
                </tr>
              </thead>
              <tbody>
                {VOL_SURFACE.map((v, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, textAlign: "left", fontWeight: 700, color: "#e2e8f0" }}>{v.pair}</td>
                    {[v.w1, v.m1, v.m3, v.m6, v.y1].map((val, j) => (
                      <td key={j} style={{
                        ...S.td,
                        fontVariantNumeric: "tabular-nums",
                        color: val >= 15 ? "#ef4444" : val >= 10 ? "#fbbf24" : "#00e5a0",
                        background: val >= 15 ? "#ef44440a" : "transparent",
                      }}>
                        {val.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
