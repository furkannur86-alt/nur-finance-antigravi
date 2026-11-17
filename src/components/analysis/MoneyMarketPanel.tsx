"use client";
import { useState } from "react";

/* ── Bloomberg MMK-tier Money Market & Liquidity Monitor ─────── */

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const txt2 = "#94a3b8";
const red = "#ff4d6a";
const green = accent;
const yellow = "#fbbf24";

/* ── 1. Overnight Rates ──────────────────────────────────────── */
interface OvernightRate {
  name: string;
  code: string;
  region: string;
  current: number;
  prior: number;
  avg30d: number;
  low1y: number;
  high1y: number;
}

const OVERNIGHT: OvernightRate[] = [
  { name: "Fed Funds Effective", code: "FEDL01", region: "US", current: 5.33, prior: 5.33, avg30d: 5.33, low1y: 4.58, high1y: 5.33 },
  { name: "SOFR", code: "SOFRRATE", region: "US", current: 5.31, prior: 5.30, avg30d: 5.31, low1y: 4.55, high1y: 5.40 },
  { name: "SONIA", code: "SABORIM", region: "UK", current: 5.19, prior: 5.19, avg30d: 5.19, low1y: 4.18, high1y: 5.19 },
  { name: "€STR", code: "ESTRON", region: "EU", current: 3.90, prior: 3.90, avg30d: 3.90, low1y: 2.90, high1y: 3.91 },
  { name: "TONA", code: "MUTKCALM", region: "JP", current: 0.078, prior: 0.074, avg30d: 0.072, low1y: -0.02, high1y: 0.10 },
  { name: "SARON", code: "SRFXON", region: "CH", current: 1.70, prior: 1.70, avg30d: 1.70, low1y: 1.50, high1y: 1.75 },
];

/* ── 2. Repo Market ──────────────────────────────────────────── */
interface RepoRow { label: string; overnight: number; oneW: number; oneM: number; threeM: number; }
const REPO_DATA: RepoRow[] = [
  { label: "Treasury GC", overnight: 5.30, oneW: 5.31, oneM: 5.33, threeM: 5.35 },
  { label: "MBS Repo", overnight: 5.32, oneW: 5.34, oneM: 5.36, threeM: 5.38 },
  { label: "Agency Repo", overnight: 5.29, oneW: 5.30, oneM: 5.32, threeM: 5.34 },
  { label: "Corp Repo (IG)", overnight: 5.38, oneW: 5.40, oneM: 5.44, threeM: 5.48 },
];

const REPO_STATS = [
  { label: "RRP Facility Usage", value: "$1,842B", chg: "-$24B" },
  { label: "Tri-Party Volume", value: "$4,218B", chg: "+$56B" },
  { label: "Delivery Fails (Tsy)", value: "$38.4B", chg: "+$4.2B" },
  { label: "DTCC GCF Volume", value: "$298B", chg: "-$12B" },
];

/* ── 3. LIBOR/SOFR Transition ────────────────────────────────── */
interface TransRow { old: string; newBM: string; notionalOld: string; pctDone: number; deadline: string; }
const TRANSITION: TransRow[] = [
  { old: "USD LIBOR", newBM: "SOFR", notionalOld: "$8.2T", pctDone: 97.4, deadline: "Jun 2023 (done)" },
  { old: "GBP LIBOR", newBM: "SONIA", notionalOld: "£0.4T", pctDone: 99.1, deadline: "Dec 2021 (done)" },
  { old: "JPY LIBOR", newBM: "TONA", notionalOld: "¥2.1T", pctDone: 95.8, deadline: "Dec 2024" },
  { old: "CHF LIBOR", newBM: "SARON", notionalOld: "CHF 0.3T", pctDone: 98.6, deadline: "Dec 2021 (done)" },
  { old: "EUR LIBOR", newBM: "€STR", notionalOld: "€1.8T", pctDone: 96.2, deadline: "Jun 2023 (done)" },
  { old: "EURIBOR", newBM: "€STR (fallback)", notionalOld: "€24.5T", pctDone: 42.0, deadline: "Ongoing" },
];

/* ── 4. MMF Flows ────────────────────────────────────────────── */
const MMF_WEEKS = 26;
const mmfGov: number[] = [12, 8, -4, 15, 22, 18, -8, 24, 32, 14, -6, 10, 28, -2, 8, 18, 34, 12, -10, 20, 16, 8, -4, 22, 14, 26];
const mmfPrime: number[] = [4, -2, 6, -8, 2, 10, -4, 6, 8, -6, 4, -2, 12, 4, -4, 8, 6, -2, 4, -8, 6, 2, -6, 8, 4, 10];

/* ── 5. Liquidity Stress ─────────────────────────────────────── */
interface StressInd { label: string; value: number; unit: string; threshYellow: number; threshRed: number; hist5yAvg: number; desc: string; }
const STRESS: StressInd[] = [
  { label: "TED Spread", value: 18, unit: "bps", threshYellow: 35, threshRed: 50, hist5yAvg: 22, desc: "3M T-Bill vs 3M LIBOR" },
  { label: "SOFR-OIS Spread", value: 4, unit: "bps", threshYellow: 15, threshRed: 30, hist5yAvg: 6, desc: "SOFR vs OIS rate" },
  { label: "CP Rate (A1/P1)", value: 5.42, unit: "%", threshYellow: 5.60, threshRed: 6.00, hist5yAvg: 3.80, desc: "Top-tier commercial paper" },
  { label: "CP Rate (A2/P2)", value: 5.68, unit: "%", threshYellow: 5.90, threshRed: 6.50, hist5yAvg: 4.10, desc: "2nd-tier commercial paper" },
  { label: "FRA-OIS Spread", value: 8, unit: "bps", threshYellow: 25, threshRed: 50, hist5yAvg: 12, desc: "Forward rate agreement vs OIS" },
  { label: "Cross-Ccy Basis (EUR)", value: -12, unit: "bps", threshYellow: -30, threshRed: -50, hist5yAvg: -8, desc: "EUR/USD basis swap" },
];

/* ── 6. Fed Balance Sheet ────────────────────────────────────── */
interface FedItem { label: string; value: number; prior: number; unit: string; }
const FED_BS: FedItem[] = [
  { label: "Total Assets", value: 7840, prior: 7892, unit: "B" },
  { label: "UST Holdings", value: 4780, prior: 4812, unit: "B" },
  { label: "MBS Holdings", value: 2420, prior: 2438, unit: "B" },
  { label: "Reverse Repo (RRP)", value: 1842, prior: 1866, unit: "B" },
  { label: "TGA Balance", value: 742, prior: 718, unit: "B" },
  { label: "Bank Reserves", value: 3240, prior: 3198, unit: "B" },
];

type Tab = "rates" | "repo" | "transition" | "mmf" | "stress" | "fed";

function RangeBar({ low, high, current, avg }: { low: number; high: number; current: number; avg: number }) {
  const range = high - low || 1;
  const curPct = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const avgPct = Math.max(0, Math.min(100, ((avg - low) / range) * 100));
  return (
    <div style={{ position: "relative", height: 10, background: border, borderRadius: 5, width: "100%" }}>
      <div style={{ position: "absolute", left: `${avgPct}%`, top: 0, width: 2, height: 10, background: yellow, borderRadius: 1, transform: "translateX(-1px)" }} />
      <div style={{ position: "absolute", left: `${curPct}%`, top: -1, width: 12, height: 12, background: accent, borderRadius: "50%", transform: "translateX(-6px)", border: `2px solid ${bg}` }} />
    </div>
  );
}

function TrafficLight({ value, threshY, threshR, invert }: { value: number; threshY: number; threshR: number; invert?: boolean }) {
  let color = green;
  if (invert) {
    if (value <= threshR) color = red;
    else if (value <= threshY) color = yellow;
  } else {
    if (value >= threshR) color = red;
    else if (value >= threshY) color = yellow;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}60` }} />
      <span style={{ color, fontWeight: 700, fontSize: 12 }}>{color === green ? "NORMAL" : color === yellow ? "ELEVATED" : "STRESSED"}</span>
    </div>
  );
}

export default function MoneyMarketPanel() {
  const [tab, setTab] = useState<Tab>("rates");

  const tabs: { key: Tab; label: string }[] = [
    { key: "rates", label: "O/N RATES" },
    { key: "repo", label: "REPO" },
    { key: "transition", label: "BENCHMARK" },
    { key: "mmf", label: "MMF FLOWS" },
    { key: "stress", label: "LIQUIDITY" },
    { key: "fed", label: "FED B/S" },
  ];

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>MONEY MARKET & LIQUIDITY MONITOR</span>
          <span style={{ color: txt2, fontSize: 11 }}>MMK // Bloomberg Equivalent</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
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

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

        {/* ── TAB 1: Overnight Rates ─────────────────────────────── */}
        {tab === "rates" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
              {OVERNIGHT.map(r => {
                const chg = r.current - r.prior;
                return (
                  <div key={r.code} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                        <div style={{ color: txt2, fontSize: 11 }}>{r.code} · {r.region}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: accent }}>{r.current.toFixed(r.current < 1 ? 3 : 2)}%</div>
                        <div style={{ fontSize: 11, color: chg >= 0 ? green : red, fontWeight: 600 }}>
                          {chg >= 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(3)}% vs prior
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: txt2, marginBottom: 8 }}>
                      <span>30D Avg: <span style={{ color: txt }}>{r.avg30d.toFixed(r.avg30d < 1 ? 3 : 2)}%</span></span>
                      <span>1Y Range: {r.low1y.toFixed(2)}% — {r.high1y.toFixed(2)}%</span>
                    </div>
                    <RangeBar low={r.low1y} high={r.high1y} current={r.current} avg={r.avg30d} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: Repo Market ─────────────────────────────────── */}
        {tab === "repo" && (
          <div>
            <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {REPO_STATS.map(s => (
                <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                  <div style={{ color: txt2, fontSize: 11, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.chg.startsWith("+") ? green : red, fontWeight: 600 }}>{s.chg} vs prior</div>
                </div>
              ))}
            </div>
            <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>REPO RATE TERM STRUCTURE</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Collateral", "O/N", "1 Week", "1 Month", "3 Month", "Spread (3M-ON)"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: h === "Collateral" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REPO_DATA.map((r, i) => {
                  const spread = ((r.threeM - r.overnight) * 100).toFixed(1);
                  return (
                    <tr key={r.label} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                      <td style={{ padding: "8px 12px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{r.label}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{r.overnight.toFixed(2)}%</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{r.oneW.toFixed(2)}%</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{r.oneM.toFixed(2)}%</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{r.threeM.toFixed(2)}%</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: yellow }}>{spread} bps</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 3: LIBOR/SOFR Transition ───────────────────────── */}
        {tab === "transition" && (
          <div>
            <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>IBOR → RFR BENCHMARK TRANSITION TRACKER</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Legacy Benchmark", "New Benchmark", "Outstanding (Old)", "% Transitioned", "Deadline", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: h === "Legacy Benchmark" || h === "New Benchmark" || h === "Status" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSITION.map((r, i) => (
                  <tr key={r.old} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, borderBottom: `1px solid ${border}`, color: red }}>{r.old}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, borderBottom: `1px solid ${border}`, color: green }}>{r.newBM}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{r.notionalOld}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <div style={{ width: 80, height: 8, background: border, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${r.pctDone}%`, height: "100%", background: r.pctDone > 95 ? green : r.pctDone > 80 ? yellow : red, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: r.pctDone > 95 ? green : yellow }}>{r.pctDone.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: txt2, fontSize: 12 }}>{r.deadline}</td>
                    <td style={{ padding: "8px 12px", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: r.pctDone > 95 ? `${green}20` : `${yellow}20`,
                        color: r.pctDone > 95 ? green : yellow,
                        border: `1px solid ${r.pctDone > 95 ? green : yellow}40`
                      }}>{r.pctDone > 95 ? "COMPLETE" : "IN PROGRESS"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 4: MMF Flows ───────────────────────────────────── */}
        {tab === "mmf" && (() => {
          const allVals = [...mmfGov, ...mmfPrime];
          const maxV = Math.max(...allVals.map(Math.abs), 1);
          const svgW = 700;
          const svgH = 260;
          const padL = 50;
          const padR = 20;
          const padT = 20;
          const padB = 30;
          const plotW = svgW - padL - padR;
          const plotH = svgH - padT - padB;
          const mid = padT + plotH / 2;
          const barW = plotW / MMF_WEEKS / 2 - 2;

          const govCum = mmfGov.reduce((a, v, i) => { a.push((a[i - 1] ?? 0) + v); return a; }, [] as number[]);
          const primeCum = mmfPrime.reduce((a, v, i) => { a.push((a[i - 1] ?? 0) + v); return a; }, [] as number[]);
          const totalGov = govCum[govCum.length - 1];
          const totalPrime = primeCum[primeCum.length - 1];

          return (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12, flex: 1 }}>
                  <div style={{ color: txt2, fontSize: 11 }}>Govt MMF — 26W Cumulative</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: totalGov >= 0 ? green : red }}>{totalGov >= 0 ? "+" : ""}${totalGov}B</div>
                </div>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12, flex: 1 }}>
                  <div style={{ color: txt2, fontSize: 11 }}>Prime MMF — 26W Cumulative</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: totalPrime >= 0 ? green : red }}>{totalPrime >= 0 ? "+" : ""}${totalPrime}B</div>
                </div>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12, flex: 1 }}>
                  <div style={{ color: txt2, fontSize: 11 }}>Total Net 26W</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: (totalGov + totalPrime) >= 0 ? green : red }}>{(totalGov + totalPrime) >= 0 ? "+" : ""}${totalGov + totalPrime}B</div>
                </div>
              </div>
              <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>WEEKLY FUND FLOWS ($B)</div>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: 800, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
                {/* grid */}
                <line x1={padL} y1={mid} x2={svgW - padR} y2={mid} stroke={border} strokeWidth={1} />
                {[-maxV, -maxV / 2, maxV / 2, maxV].map((v, i) => {
                  const y = mid - (v / maxV) * (plotH / 2);
                  return <g key={i}><line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke={border} strokeWidth={0.5} strokeDasharray="4,4" /><text x={padL - 4} y={y + 4} fill={txt2} fontSize={9} textAnchor="end">{v > 0 ? "+" : ""}{Math.round(v)}</text></g>;
                })}
                <text x={padL - 4} y={mid + 4} fill={txt2} fontSize={9} textAnchor="end">0</text>
                {/* bars */}
                {mmfGov.map((v, i) => {
                  const x = padL + (i / MMF_WEEKS) * plotW;
                  const h = Math.abs(v) / maxV * (plotH / 2);
                  const y = v >= 0 ? mid - h : mid;
                  return <rect key={`g${i}`} x={x} y={y} width={barW} height={h} fill={v >= 0 ? green : red} opacity={0.7} rx={2} />;
                })}
                {mmfPrime.map((v, i) => {
                  const x = padL + (i / MMF_WEEKS) * plotW + barW + 2;
                  const h = Math.abs(v) / maxV * (plotH / 2);
                  const y = v >= 0 ? mid - h : mid;
                  return <rect key={`p${i}`} x={x} y={y} width={barW} height={h} fill={v >= 0 ? "#a855f7" : "#ef4444"} opacity={0.7} rx={2} />;
                })}
                {/* x labels */}
                {[0, 6, 12, 18, 25].map(i => (
                  <text key={i} x={padL + (i / MMF_WEEKS) * plotW + barW} y={svgH - 8} fill={txt2} fontSize={9} textAnchor="middle">W{i + 1}</text>
                ))}
                {/* legend */}
                <rect x={svgW - 180} y={8} width={10} height={10} fill={green} rx={2} />
                <text x={svgW - 166} y={17} fill={txt} fontSize={10}>Govt MMF</text>
                <rect x={svgW - 100} y={8} width={10} height={10} fill="#a855f7" rx={2} />
                <text x={svgW - 86} y={17} fill={txt} fontSize={10}>Prime MMF</text>
              </svg>
            </div>
          );
        })()}

        {/* ── TAB 5: Liquidity Stress ────────────────────────────── */}
        {tab === "stress" && (
          <div>
            <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>SYSTEMIC LIQUIDITY STRESS INDICATORS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {STRESS.map(s => {
                const isNeg = s.label.includes("Basis");
                return (
                  <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                        <div style={{ color: txt2, fontSize: 11 }}>{s.desc}</div>
                      </div>
                      <TrafficLight value={s.value} threshY={s.threshYellow} threshR={s.threshRed} invert={isNeg} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {typeof s.value === "number" && s.unit === "bps" ? `${s.value} bps` : `${s.value}${s.unit}`}
                      </div>
                      <div style={{ textAlign: "right", fontSize: 11 }}>
                        <div style={{ color: txt2 }}>5Y Avg: <span style={{ color: txt }}>{s.hist5yAvg}{s.unit === "bps" ? " bps" : s.unit}</span></div>
                        <div style={{ color: txt2 }}>Warn: <span style={{ color: yellow }}>{s.threshYellow}</span> / Alert: <span style={{ color: red }}>{s.threshRed}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 6: Fed Balance Sheet ───────────────────────────── */}
        {tab === "fed" && (() => {
          const maxBs = Math.max(...FED_BS.map(f => f.value));
          return (
            <div>
              <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>FEDERAL RESERVE BALANCE SHEET (Billions USD)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
                {FED_BS.map(f => {
                  const chg = f.value - f.prior;
                  return (
                    <div key={f.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                      <div style={{ color: txt2, fontSize: 11, marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>${f.value.toLocaleString()}{f.unit}</div>
                      <div style={{ fontSize: 11, color: chg >= 0 ? green : red, fontWeight: 600 }}>
                        {chg >= 0 ? "+" : ""}{chg.toLocaleString()}{f.unit} vs prior week
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ color: accent, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>COMPOSITION CHART</div>
              <svg viewBox="0 0 600 220" style={{ width: "100%", maxWidth: 700, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
                {FED_BS.map((f, i) => {
                  const barH = 24;
                  const y = 20 + i * 32;
                  const w = (f.value / maxBs) * 400;
                  const colors = [accent, "#38bdf8", "#a855f7", "#fbbf24", "#ef4444", "#10b981"];
                  return (
                    <g key={f.label}>
                      <text x={10} y={y + 16} fill={txt2} fontSize={10}>{f.label.length > 16 ? f.label.slice(0, 16) + "…" : f.label}</text>
                      <rect x={150} y={y} width={w} height={barH} fill={colors[i % colors.length]} rx={4} opacity={0.8} />
                      <text x={155 + w} y={y + 16} fill={txt} fontSize={11} fontWeight="700">${f.value.toLocaleString()}B</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: txt2 }}>Tab: <span style={{ color: accent }}>{tabs.find(t => t.key === tab)?.label}</span> | 6 Modules Active</span>
        <span style={{ color: txt2 }}>DEMO MODE — Live feeds require NUR Finance B/R subscription</span>
      </div>
    </div>
  );
}
