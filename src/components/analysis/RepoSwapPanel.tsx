"use client";
import { useState } from "react";

/* ── Bloomberg SWPM-tier Repo & Swap Monitor ─────────────────── */

type Tab = "irs" | "curve" | "repo" | "basis" | "calc";

interface SwapRate {
  tenor: string;
  usd: { mid: number; bid: number; ask: number; chg: number };
  eur: { mid: number; bid: number; ask: number; chg: number };
  gbp: { mid: number; bid: number; ask: number; chg: number };
  jpy: { mid: number; bid: number; ask: number; chg: number };
}

const SWAP_RATES: SwapRate[] = [
  { tenor: "1Y", usd: { mid: 4.82, bid: 4.81, ask: 4.83, chg: -0.02 }, eur: { mid: 3.42, bid: 3.41, ask: 3.43, chg: 0.01 }, gbp: { mid: 4.92, bid: 4.91, ask: 4.93, chg: -0.01 }, jpy: { mid: 0.18, bid: 0.17, ask: 0.19, chg: 0.00 } },
  { tenor: "2Y", usd: { mid: 4.58, bid: 4.57, ask: 4.59, chg: -0.03 }, eur: { mid: 3.18, bid: 3.17, ask: 3.19, chg: 0.02 }, gbp: { mid: 4.64, bid: 4.63, ask: 4.65, chg: -0.02 }, jpy: { mid: 0.28, bid: 0.27, ask: 0.29, chg: 0.01 } },
  { tenor: "3Y", usd: { mid: 4.36, bid: 4.35, ask: 4.37, chg: -0.02 }, eur: { mid: 3.02, bid: 3.01, ask: 3.03, chg: 0.01 }, gbp: { mid: 4.42, bid: 4.41, ask: 4.43, chg: -0.01 }, jpy: { mid: 0.38, bid: 0.37, ask: 0.39, chg: 0.01 } },
  { tenor: "5Y", usd: { mid: 4.18, bid: 4.17, ask: 4.19, chg: -0.01 }, eur: { mid: 2.88, bid: 2.87, ask: 2.89, chg: 0.00 }, gbp: { mid: 4.24, bid: 4.23, ask: 4.25, chg: 0.01 }, jpy: { mid: 0.56, bid: 0.55, ask: 0.57, chg: 0.02 } },
  { tenor: "7Y", usd: { mid: 4.22, bid: 4.21, ask: 4.23, chg: 0.01 }, eur: { mid: 2.82, bid: 2.81, ask: 2.83, chg: -0.01 }, gbp: { mid: 4.28, bid: 4.27, ask: 4.29, chg: 0.02 }, jpy: { mid: 0.72, bid: 0.71, ask: 0.73, chg: 0.02 } },
  { tenor: "10Y", usd: { mid: 4.32, bid: 4.31, ask: 4.33, chg: 0.02 }, eur: { mid: 2.78, bid: 2.77, ask: 2.79, chg: -0.02 }, gbp: { mid: 4.36, bid: 4.35, ask: 4.37, chg: 0.03 }, jpy: { mid: 0.92, bid: 0.91, ask: 0.93, chg: 0.03 } },
  { tenor: "15Y", usd: { mid: 4.44, bid: 4.43, ask: 4.45, chg: 0.03 }, eur: { mid: 2.74, bid: 2.73, ask: 2.75, chg: -0.01 }, gbp: { mid: 4.42, bid: 4.41, ask: 4.43, chg: 0.02 }, jpy: { mid: 1.12, bid: 1.11, ask: 1.13, chg: 0.02 } },
  { tenor: "20Y", usd: { mid: 4.52, bid: 4.51, ask: 4.53, chg: 0.02 }, eur: { mid: 2.68, bid: 2.67, ask: 2.69, chg: -0.02 }, gbp: { mid: 4.46, bid: 4.45, ask: 4.47, chg: 0.01 }, jpy: { mid: 1.32, bid: 1.31, ask: 1.33, chg: 0.03 } },
  { tenor: "30Y", usd: { mid: 4.48, bid: 4.47, ask: 4.49, chg: 0.01 }, eur: { mid: 2.56, bid: 2.55, ask: 2.57, chg: -0.03 }, gbp: { mid: 4.38, bid: 4.37, ask: 4.39, chg: 0.00 }, jpy: { mid: 1.52, bid: 1.51, ask: 1.53, chg: 0.04 } },
];

interface RepoRate {
  name: string;
  type: string;
  rate: number;
  chg: number;
  volume: string;
  collateral: string;
}

const REPO_RATES: RepoRate[] = [
  { name: "SOFR", type: "O/N", rate: 5.31, chg: 0.00, volume: "$1.98T", collateral: "UST" },
  { name: "EFFR", type: "O/N", rate: 5.33, chg: 0.00, volume: "$98B", collateral: "UST/Agency" },
  { name: "OBFR", type: "O/N", rate: 5.32, chg: -0.01, volume: "$248B", collateral: "Mixed" },
  { name: "TGCR", type: "O/N", rate: 5.30, chg: 0.00, volume: "$762B", collateral: "UST Tri-Party" },
  { name: "BGCR", type: "O/N", rate: 5.30, chg: 0.00, volume: "$882B", collateral: "UST/Agency TP" },
  { name: "GCF Repo", type: "O/N", rate: 5.32, chg: 0.01, volume: "$48B", collateral: "UST GCF" },
  { name: "Term SOFR 1M", type: "1M", rate: 5.34, chg: -0.01, volume: "—", collateral: "UST" },
  { name: "Term SOFR 3M", type: "3M", rate: 5.36, chg: -0.02, volume: "—", collateral: "UST" },
  { name: "Term SOFR 6M", type: "6M", rate: 5.28, chg: -0.04, volume: "—", collateral: "UST" },
  { name: "Term SOFR 12M", type: "12M", rate: 5.08, chg: -0.08, volume: "—", collateral: "UST" },
  { name: "Bilateral Repo", type: "O/N", rate: 5.35, chg: 0.02, volume: "$320B", collateral: "Bilateral" },
  { name: "RRP Facility", type: "O/N", rate: 5.30, chg: 0.00, volume: "$124B", collateral: "Fed RRP" },
];

interface BasisSwap {
  pair: string;
  tenor3m: number;
  tenor6m: number;
  tenor1y: number;
  tenor5y: number;
  tenor10y: number;
  chg3m: number;
  chg10y: number;
}

const BASIS_SWAPS: BasisSwap[] = [
  { pair: "EUR/USD", tenor3m: -12.4, tenor6m: -14.2, tenor1y: -18.6, tenor5y: -22.4, tenor10y: -26.8, chg3m: 0.4, chg10y: -0.8 },
  { pair: "GBP/USD", tenor3m: -4.2, tenor6m: -6.8, tenor1y: -8.4, tenor5y: -12.2, tenor10y: -14.6, chg3m: 0.2, chg10y: -0.4 },
  { pair: "JPY/USD", tenor3m: -42.8, tenor6m: -48.2, tenor1y: -56.4, tenor5y: -62.8, tenor10y: -68.4, chg3m: 1.2, chg10y: -1.8 },
  { pair: "CHF/USD", tenor3m: -18.6, tenor6m: -22.4, tenor1y: -26.2, tenor5y: -32.4, tenor10y: -36.8, chg3m: 0.6, chg10y: -1.2 },
  { pair: "AUD/USD", tenor3m: 8.4, tenor6m: 6.2, tenor1y: 4.8, tenor5y: 2.4, tenor10y: -1.2, chg3m: -0.4, chg10y: 0.2 },
  { pair: "CAD/USD", tenor3m: -2.8, tenor6m: -4.6, tenor1y: -6.2, tenor5y: -8.4, tenor10y: -10.2, chg3m: 0.2, chg10y: -0.6 },
  { pair: "SEK/USD", tenor3m: -24.2, tenor6m: -28.6, tenor1y: -32.4, tenor5y: -38.2, tenor10y: -42.6, chg3m: 0.8, chg10y: -1.4 },
];

const CCYS: (keyof Pick<SwapRate, "usd" | "eur" | "gbp" | "jpy">)[] = ["usd", "eur", "gbp", "jpy"];
const CCY_LABELS: Record<string, string> = { usd: "USD", eur: "EUR", gbp: "GBP", jpy: "JPY" };
const CCY_COLORS: Record<string, string> = { usd: "#38bdf8", eur: "#00e5a0", gbp: "#a855f7", jpy: "#f59e0b" };

export default function RepoSwapPanel() {
  const [tab, setTab] = useState<Tab>("irs");
  const [ccyFilter, setCcyFilter] = useState<string>("all");

  // calculator state
  const [calcNotional, setCalcNotional] = useState("100000000");
  const [calcFixed, setCalcFixed] = useState("4.32");
  const [calcFloat, setCalcFloat] = useState("SOFR");
  const [calcTenor, setCalcTenor] = useState("10Y");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const chgColor = (v: number) => v > 0 ? "#ff4d6a" : v < 0 ? accent : textSecondary;
  const fmtChg = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`;

  // swap calc
  const notional = parseFloat(calcNotional) || 0;
  const fixedRate = parseFloat(calcFixed) || 0;
  const floatingRate = tab === "calc" ? (calcFloat === "SOFR" ? 5.31 : calcFloat === "EURIBOR" ? 3.86 : calcFloat === "SONIA" ? 5.19 : 0.08) : 0;
  const tenorYears = parseInt(calcTenor) || 10;
  const dv01 = notional * 0.0001 * tenorYears * 0.95;
  const fixedLeg = notional * (fixedRate / 100) * tenorYears;
  const floatLeg = notional * (floatingRate / 100) * tenorYears;
  const npv = floatLeg - fixedLeg;

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>REPO & SWAP MONITOR</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Bloomberg SWPM/SOFR Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {([["irs", "IRS RATES"], ["curve", "SWAP CURVE"], ["repo", "REPO RATES"], ["basis", "BASIS SWAPS"], ["calc", "CALCULATOR"]] as [Tab, string][]).map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer"
              }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 11 }}>
          {[
            { label: "SOFR O/N", value: "5.31%", color: accent },
            { label: "USD 10Y Swap", value: "4.32%", chg: "+0.02", color: "#ff4d6a" },
            { label: "EUR 10Y Swap", value: "2.78%", chg: "-0.02", color: accent },
            { label: "RRP Usage", value: "$124B", color: "#fbbf24" },
          ].map(k => (
            <div key={k.label}>
              <span style={{ color: textSecondary }}>{k.label}: </span>
              <span style={{ color: k.color, fontWeight: 700 }}>{k.value}</span>
              {k.chg && <span style={{ color: k.color, fontSize: 10, marginLeft: 4 }}>{k.chg}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── IRS RATES TAB ── */}
      {tab === "irs" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}` }}>
            {["all", ...CCYS].map(c => (
              <button key={c} onClick={() => setCcyFilter(c)} style={{
                padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${ccyFilter === c ? accent : border}`,
                background: ccyFilter === c ? `${accent}18` : "transparent",
                color: ccyFilter === c ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase"
              }}>{c === "all" ? "ALL" : CCY_LABELS[c]}</button>
            ))}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>TENOR</th>
                {(ccyFilter === "all" ? CCYS : [ccyFilter as keyof Pick<SwapRate, "usd" | "eur" | "gbp" | "jpy">]).map(c => (
                  [
                    <th key={`${c}-mid`} style={{ padding: "8px 6px", textAlign: "right", borderBottom: `2px solid ${border}`, color: CCY_COLORS[c], fontSize: 11, fontWeight: 700 }}>{CCY_LABELS[c]} MID</th>,
                    ...(ccyFilter !== "all" ? [
                      <th key={`${c}-bid`} style={{ padding: "8px 6px", textAlign: "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>BID</th>,
                      <th key={`${c}-ask`} style={{ padding: "8px 6px", textAlign: "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>ASK</th>,
                      <th key={`${c}-sprd`} style={{ padding: "8px 6px", textAlign: "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>SPRD</th>,
                    ] : []),
                    <th key={`${c}-chg`} style={{ padding: "8px 6px", textAlign: "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>CHG</th>,
                  ]
                )).flat()}
              </tr>
            </thead>
            <tbody>
              {SWAP_RATES.map((r, i) => (
                <tr key={r.tenor} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "6px 12px", borderBottom: `1px solid ${border}`, fontWeight: 700, color: "#fbbf24" }}>{r.tenor}</td>
                  {(ccyFilter === "all" ? CCYS : [ccyFilter as keyof Pick<SwapRate, "usd" | "eur" | "gbp" | "jpy">]).map(c => {
                    const d = r[c];
                    return [
                      <td key={`${c}-mid`} style={{ padding: "6px 6px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.mid.toFixed(2)}%</td>,
                      ...(ccyFilter !== "all" ? [
                        <td key={`${c}-bid`} style={{ padding: "6px 6px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{d.bid.toFixed(2)}</td>,
                        <td key={`${c}-ask`} style={{ padding: "6px 6px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{d.ask.toFixed(2)}</td>,
                        <td key={`${c}-sprd`} style={{ padding: "6px 6px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{((d.ask - d.bid) * 100).toFixed(1)}</td>,
                      ] : []),
                      <td key={`${c}-chg`} style={{ padding: "6px 6px", textAlign: "right", borderBottom: `1px solid ${border}`, color: chgColor(d.chg), fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtChg(d.chg)}</td>,
                    ];
                  }).flat()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── SWAP CURVE SVG TAB ── */}
      {tab === "curve" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>IRS SWAP CURVES — USD / EUR / GBP / JPY</div>
          <svg viewBox="0 0 700 340" style={{ width: "100%", maxWidth: 800, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
            {/* grid */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const y = 30 + i * 54;
              const rate = (6 - i).toFixed(0);
              return (
                <g key={i}>
                  <line x1={60} y1={y} x2={670} y2={y} stroke={border} strokeWidth={1} />
                  <text x={52} y={y + 4} fill={textSecondary} fontSize={10} textAnchor="end" fontFamily="monospace">{rate}%</text>
                </g>
              );
            })}
            {/* x-axis labels */}
            {SWAP_RATES.map((r, idx) => {
              const x = 80 + idx * 72;
              return <text key={r.tenor} x={x} y={325} fill={textSecondary} fontSize={10} textAnchor="middle" fontFamily="monospace">{r.tenor}</text>;
            })}
            {/* curves */}
            {CCYS.map(ccy => {
              const col = CCY_COLORS[ccy];
              const points = SWAP_RATES.map((r, idx) => {
                const x = 80 + idx * 72;
                const rate = r[ccy].mid;
                const y = 30 + (6 - rate) * 54;
                return `${x},${y}`;
              }).join(" ");
              return (
                <g key={ccy}>
                  <polyline points={points} fill="none" stroke={col} strokeWidth={2.5} strokeLinejoin="round" />
                  {SWAP_RATES.map((r, idx) => {
                    const x = 80 + idx * 72;
                    const rate = r[ccy].mid;
                    const y = 30 + (6 - rate) * 54;
                    return <circle key={idx} cx={x} cy={y} r={3} fill={col} />;
                  })}
                </g>
              );
            })}
            {/* legend */}
            {CCYS.map((c, i) => (
              <g key={c}>
                <rect x={80 + i * 100} y={8} width={12} height={4} rx={2} fill={CCY_COLORS[c]} />
                <text x={96 + i * 100} y={14} fill={textPrimary} fontSize={11} fontFamily="monospace" fontWeight={600}>{CCY_LABELS[c]}</text>
              </g>
            ))}
          </svg>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {CCYS.map(c => {
              const r10 = SWAP_RATES.find(r => r.tenor === "10Y")![c];
              const r2 = SWAP_RATES.find(r => r.tenor === "2Y")![c];
              const slope = r10.mid - r2.mid;
              return (
                <div key={c} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: CCY_COLORS[c] }} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{CCY_LABELS[c]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary }}>2s10s: <span style={{ color: slope >= 0 ? accent : "#ff4d6a", fontWeight: 700 }}>{slope >= 0 ? "+" : ""}{(slope * 100).toFixed(0)} bps</span></div>
                  <div style={{ fontSize: 11, color: textSecondary }}>10Y: <span style={{ fontWeight: 700 }}>{r10.mid.toFixed(2)}%</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REPO RATES TAB ── */}
      {tab === "repo" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["INSTRUMENT", "TERM", "RATE", "CHG", "VOLUME", "COLLATERAL"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "INSTRUMENT" || h === "COLLATERAL" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REPO_RATES.map((r, i) => (
                <tr key={r.name} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: r.type === "O/N" ? `${accent}18` : `#38bdf818`, color: r.type === "O/N" ? accent : "#38bdf8", border: `1px solid ${r.type === "O/N" ? accent : "#38bdf8"}30` }}>{r.type}</span>
                  </td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>{r.rate.toFixed(2)}%</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: chgColor(r.chg), fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtChg(r.chg)}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{r.volume}</td>
                  <td style={{ padding: "7px 12px", textAlign: "left", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12 }}>{r.collateral}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: 16 }}>
            <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>REPO RATE CORRIDOR</div>
            <svg viewBox="0 0 600 120" style={{ width: "100%", maxWidth: 700, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
              {/* corridor visualization */}
              <rect x={60} y={25} width={500} height={70} fill={`${accent}08`} stroke={border} rx={4} />
              <line x1={60} y1={60} x2={560} y2={60} stroke={border} strokeWidth={1} strokeDasharray="4,4" />
              {/* rate markers */}
              {[
                { label: "IORB", rate: 5.40, color: "#ef4444" },
                { label: "EFFR", rate: 5.33, color: "#fbbf24" },
                { label: "SOFR", rate: 5.31, color: accent },
                { label: "RRP", rate: 5.30, color: "#38bdf8" },
                { label: "DISC", rate: 5.50, color: "#a855f7" },
              ].map((m, idx) => {
                const minR = 5.25, maxR = 5.55;
                const x = 60 + ((m.rate - minR) / (maxR - minR)) * 500;
                return (
                  <g key={m.label}>
                    <line x1={x} y1={25} x2={x} y2={95} stroke={m.color} strokeWidth={2} />
                    <circle cx={x} cy={60} r={5} fill={m.color} />
                    <text x={x} y={18} fill={m.color} fontSize={9} textAnchor="middle" fontFamily="monospace" fontWeight={700}>{m.label}</text>
                    <text x={x} y={110} fill={textSecondary} fontSize={9} textAnchor="middle" fontFamily="monospace">{m.rate.toFixed(2)}%</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ── BASIS SWAPS TAB ── */}
      {tab === "basis" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>
            Cross-Currency Basis Swap Spreads (bps) — negative = USD funding premium
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["PAIR", "3M", "6M", "1Y", "5Y", "10Y", "3M CHG", "10Y CHG"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "PAIR" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BASIS_SWAPS.map((b, i) => (
                <tr key={b.pair} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, fontWeight: 700, color: "#fbbf24" }}>{b.pair}</td>
                  {[b.tenor3m, b.tenor6m, b.tenor1y, b.tenor5y, b.tenor10y].map((v, j) => (
                    <td key={j} style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums",
                      color: v > 0 ? accent : v < -40 ? "#ef4444" : v < -20 ? "#fbbf24" : textPrimary
                    }}>
                      {v > 0 ? "+" : ""}{v.toFixed(1)}
                    </td>
                  ))}
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: chgColor(b.chg3m), fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtChg(b.chg3m)}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: chgColor(b.chg10y), fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtChg(b.chg10y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Basis term structure mini chart */}
          <div style={{ padding: 16 }}>
            <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>BASIS TERM STRUCTURE</div>
            <svg viewBox="0 0 600 200" style={{ width: "100%", maxWidth: 700, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
              {/* grid */}
              {[-80, -60, -40, -20, 0, 20].map((v, i) => {
                const y = 20 + i * 32;
                return (
                  <g key={v}>
                    <line x1={60} y1={y} x2={560} y2={y} stroke={v === 0 ? textSecondary : border} strokeWidth={v === 0 ? 1.5 : 1} />
                    <text x={52} y={y + 4} fill={textSecondary} fontSize={9} textAnchor="end" fontFamily="monospace">{v}</text>
                  </g>
                );
              })}
              {/* x labels */}
              {["3M", "6M", "1Y", "5Y", "10Y"].map((t, i) => (
                <text key={t} x={80 + i * 120} y={195} fill={textSecondary} fontSize={10} textAnchor="middle" fontFamily="monospace">{t}</text>
              ))}
              {/* lines per pair */}
              {BASIS_SWAPS.slice(0, 4).map((b, bi) => {
                const cols = ["#38bdf8", "#00e5a0", "#f59e0b", "#a855f7"];
                const vals = [b.tenor3m, b.tenor6m, b.tenor1y, b.tenor5y, b.tenor10y];
                const pts = vals.map((v, j) => {
                  const x = 80 + j * 120;
                  const y = 20 + ((0 - v) + 80) / 100 * 160;
                  return `${x},${Math.max(20, Math.min(180, y))}`;
                }).join(" ");
                return (
                  <g key={b.pair}>
                    <polyline points={pts} fill="none" stroke={cols[bi]} strokeWidth={2} strokeLinejoin="round" />
                    <text x={565} y={parseFloat(pts.split(" ").pop()!.split(",")[1]) + 4} fill={cols[bi]} fontSize={9} fontFamily="monospace" fontWeight={700}>{b.pair}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ── SWAP CALCULATOR TAB ── */}
      {tab === "calc" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>INTEREST RATE SWAP CALCULATOR</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
            {/* Input fields */}
            {[
              { label: "Notional (USD)", value: calcNotional, setter: setCalcNotional, type: "text" },
              { label: "Fixed Rate (%)", value: calcFixed, setter: setCalcFixed, type: "text" },
            ].map(f => (
              <div key={f.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ color: textSecondary, fontSize: 11, marginBottom: 6 }}>{f.label}</div>
                <input value={f.value} onChange={e => f.setter(e.target.value)} style={{
                  width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: 4,
                  padding: "6px 10px", color: textPrimary, fontFamily: "monospace", fontSize: 14, fontWeight: 700, outline: "none"
                }} />
              </div>
            ))}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ color: textSecondary, fontSize: 11, marginBottom: 6 }}>Floating Index</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["SOFR", "EURIBOR", "SONIA", "TONA"].map(idx => (
                  <button key={idx} onClick={() => setCalcFloat(idx)} style={{
                    padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    border: `1px solid ${calcFloat === idx ? accent : border}`,
                    background: calcFloat === idx ? `${accent}18` : "transparent",
                    color: calcFloat === idx ? accent : textSecondary, cursor: "pointer"
                  }}>{idx}</button>
                ))}
              </div>
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ color: textSecondary, fontSize: 11, marginBottom: 6 }}>Tenor</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["2Y", "3Y", "5Y", "7Y", "10Y", "15Y", "20Y", "30Y"].map(t => (
                  <button key={t} onClick={() => setCalcTenor(t)} style={{
                    padding: "4px 8px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    border: `1px solid ${calcTenor === t ? accent : border}`,
                    background: calcTenor === t ? `${accent}18` : "transparent",
                    color: calcTenor === t ? accent : textSecondary, cursor: "pointer"
                  }}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Notional", value: `$${(notional / 1e6).toFixed(0)}M`, color: textPrimary },
              { label: "Fixed Leg Rate", value: `${fixedRate.toFixed(2)}%`, color: "#fbbf24" },
              { label: `Floating (${calcFloat})`, value: `${floatingRate.toFixed(2)}%`, color: "#38bdf8" },
              { label: "Tenor", value: calcTenor, color: textPrimary },
              { label: "DV01", value: `$${(dv01 / 1000).toFixed(1)}K`, color: "#a855f7" },
              { label: "Fixed Leg PV", value: `$${(fixedLeg / 1e6).toFixed(2)}M`, color: "#fbbf24" },
              { label: "Float Leg PV", value: `$${(floatLeg / 1e6).toFixed(2)}M`, color: "#38bdf8" },
              { label: "NPV (Payer)", value: `${npv >= 0 ? "+" : ""}$${(npv / 1e6).toFixed(2)}M`, color: npv >= 0 ? accent : "#ff4d6a" },
            ].map(m => (
              <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: textSecondary, fontSize: 11, marginBottom: 4 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14, fontSize: 11, color: textSecondary }}>
            <div style={{ fontWeight: 700, color: accent, marginBottom: 6 }}>SWAP STRUCTURE</div>
            <div>Payer Swap: Pay {fixedRate.toFixed(2)}% Fixed — Receive {calcFloat} Floating ({floatingRate.toFixed(2)}%)</div>
            <div>Payment Frequency: Semi-Annual (Fixed) / Quarterly (Float) | Day Count: 30/360 (Fixed) / ACT/360 (Float)</div>
            <div>Net Annual Cash Flow: <span style={{ color: npv >= 0 ? accent : "#ff4d6a", fontWeight: 700 }}>{npv >= 0 ? "+" : ""}${((floatingRate - fixedRate) / 100 * notional / 1e6).toFixed(3)}M</span></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>SOFR: Federal Reserve Bank of NY | Swap Rates: ISDA/ICE</span>
        <span>DEMO MODE — Bloomberg SWPM Equivalent</span>
      </div>
    </div>
  );
}
