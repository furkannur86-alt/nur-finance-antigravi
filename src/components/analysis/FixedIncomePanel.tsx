"use client";

import { useState, useMemo } from "react";

/* ── DEMO DATA ───────────────────────────────────────────────── */

const TENORS = ["1M","3M","6M","1Y","2Y","3Y","5Y","7Y","10Y","20Y","30Y"] as const;
const TENOR_X = [0, 2, 5, 10, 20, 30, 50, 70, 100, 140, 170]; // SVG x positions

const YIELD_CURVES = {
  current:  [5.53, 5.48, 5.39, 5.08, 4.72, 4.52, 4.38, 4.42, 4.44, 4.68, 4.58],
  week:     [5.54, 5.50, 5.42, 5.12, 4.78, 4.58, 4.45, 4.48, 4.50, 4.72, 4.62],
  month:    [5.56, 5.53, 5.47, 5.20, 4.88, 4.68, 4.55, 4.56, 4.58, 4.78, 4.70],
};

type CurveKey = keyof typeof YIELD_CURVES;

const SPREAD_DATA = [
  { label: "US IG OAS", value: 92, chg: -3, unit: "bps" },
  { label: "US HY OAS", value: 341, chg: +8, unit: "bps" },
  { label: "IG Z-Spread", value: 98, chg: -2, unit: "bps" },
  { label: "HY Z-Spread", value: 365, chg: +11, unit: "bps" },
  { label: "EM Sov Spread", value: 274, chg: -5, unit: "bps" },
  { label: "10Y-2Y Spread", value: -28, chg: +4, unit: "bps" },
  { label: "10Y-3M Spread", value: -104, chg: +6, unit: "bps" },
  { label: "5Y Breakeven", value: 2.31, chg: -0.02, unit: "%" },
];

const CDS_DATA = [
  { name: "USA 5Y", spread: 32, chg: -1 },
  { name: "Germany 5Y", spread: 18, chg: 0 },
  { name: "UK 5Y", spread: 28, chg: +2 },
  { name: "Japan 5Y", spread: 24, chg: -1 },
  { name: "France 5Y", spread: 34, chg: +3 },
  { name: "Italy 5Y", spread: 82, chg: -4 },
  { name: "China 5Y", spread: 68, chg: +5 },
  { name: "Turkey 5Y", spread: 265, chg: -12 },
  { name: "Brazil 5Y", spread: 142, chg: +3 },
  { name: "JPM 5Y", spread: 52, chg: -2 },
  { name: "GS 5Y", spread: 61, chg: +1 },
  { name: "HSBC 5Y", spread: 44, chg: 0 },
];

const CB_RATES = [
  { bank: "Federal Reserve", abbr: "FED", rate: 5.50, next: "Dec 18", exp: "HOLD", prob: 92 },
  { bank: "European Central Bank", abbr: "ECB", rate: 4.50, next: "Dec 14", exp: "-25bp", prob: 68 },
  { bank: "Bank of England", abbr: "BOE", rate: 5.25, next: "Dec 14", exp: "HOLD", prob: 85 },
  { bank: "Bank of Japan", abbr: "BOJ", rate: -0.10, next: "Dec 19", exp: "HOLD", prob: 78 },
  { bank: "People's Bank of China", abbr: "PBOC", rate: 3.45, next: "Dec 20", exp: "-10bp", prob: 55 },
  { bank: "Swiss National Bank", abbr: "SNB", rate: 1.75, next: "Dec 14", exp: "HOLD", prob: 90 },
];

/* ── STYLES ──────────────────────────────────────────────────── */

const S = {
  root: {
    background: "var(--ag-bg, #0a0e17)",
    color: "#e2e8f0",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
    fontSize: 12,
    minHeight: "100%",
    padding: 16,
    overflow: "auto",
  },
  header: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    borderBottom: "1px solid #1e293b",
    paddingBottom: 10,
    marginBottom: 14,
  },
  title: {
    color: "#00e5a0",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1.5,
  },
  badge: {
    background: "#1e293b",
    color: "#94a3b8",
    padding: "2px 8px",
    borderRadius: 3,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  grid: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  gridTriple: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  card: {
    background: "var(--ag-surface, #111827)",
    border: "1px solid #1e293b",
    borderRadius: 4,
    padding: 12,
  },
  cardTitle: {
    color: "#00e5a0",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: "uppercase" as const,
  },
  row: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    padding: "3px 0",
    borderBottom: "1px solid #1e293b22",
  },
  labelDim: { color: "#64748b", fontSize: 11 },
  val: { color: "#e2e8f0", fontWeight: 600, fontSize: 11, fontVariantNumeric: "tabular-nums" as const },
  green: { color: "#00e5a0" },
  red: { color: "#ef4444" },
  yellow: { color: "#fbbf24" },
  inputGroup: {
    display: "flex" as const,
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap" as const,
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#e2e8f0",
    padding: "4px 8px",
    borderRadius: 3,
    fontSize: 11,
    width: 90,
    fontFamily: "inherit",
  },
  btn: {
    background: "#00e5a0",
    color: "#0a0e17",
    border: "none",
    padding: "4px 14px",
    borderRadius: 3,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  resultGrid: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
    marginTop: 8,
  },
  resultBox: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 3,
    padding: "6px 10px",
    textAlign: "center" as const,
  },
  resultLabel: { color: "#64748b", fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" as const },
  resultVal: { color: "#00e5a0", fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums" as const },
  legendDot: (c: string) => ({
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: c,
    marginRight: 4,
  }),
} as const;

function chgColor(v: number) {
  if (v > 0) return S.green;
  if (v < 0) return S.red;
  return { color: "#64748b" };
}

function fmtChg(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v}`;
}

/* ── YIELD CURVE SVG ─────────────────────────────────────────── */

function YieldCurveChart({ curves, active }: { curves: CurveKey[]; active: CurveKey[] }) {
  const W = 200, H = 100;
  const yMin = 3.8, yMax = 5.8;

  function toY(val: number) {
    return H - ((val - yMin) / (yMax - yMin)) * H;
  }

  function path(key: CurveKey) {
    const pts = YIELD_CURVES[key];
    return pts.map((v, i) => `${i === 0 ? "M" : "L"}${TENOR_X[i]},${toY(v)}`).join(" ");
  }

  const colors: Record<CurveKey, string> = {
    current: "#00e5a0",
    week: "#38bdf8",
    month: "#a855f7",
  };

  const yTicks = [4.0, 4.5, 5.0, 5.5];

  return (
    <svg viewBox={`-25 -10 ${W + 35} ${H + 30}`} style={{ width: "100%", height: 180 }}>
      {/* grid */}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={0} y1={toY(t)} x2={W} y2={toY(t)} stroke="#1e293b" strokeWidth={0.5} />
          <text x={-4} y={toY(t) + 3} fill="#64748b" fontSize={7} textAnchor="end">
            {t.toFixed(1)}%
          </text>
        </g>
      ))}
      {/* x labels */}
      {TENORS.map((t, i) => (
        <text key={t} x={TENOR_X[i]} y={H + 12} fill="#64748b" fontSize={6} textAnchor="middle">
          {t}
        </text>
      ))}
      {/* curves */}
      {active.map((key) => (
        <g key={key}>
          <path d={path(key)} fill="none" stroke={colors[key]} strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"
            opacity={active.includes(key) ? 1 : 0.2} />
          {YIELD_CURVES[key].map((v, i) => (
            <circle key={i} cx={TENOR_X[i]} cy={toY(v)} r={2} fill={colors[key]} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ── BOND CALCULATOR ─────────────────────────────────────────── */

function BondCalculator() {
  const [coupon, setCoupon] = useState(4.5);
  const [ytm, setYtm] = useState(4.8);
  const [maturity, setMaturity] = useState(10);
  const [faceVal, setFaceVal] = useState(1000);

  const calc = useMemo(() => {
    const c = (coupon / 100) * faceVal;
    const y = ytm / 100;
    const n = maturity;
    let price = 0;
    let duration = 0;
    let convexity = 0;

    for (let t = 1; t <= n; t++) {
      const pv = c / Math.pow(1 + y, t);
      price += pv;
      duration += (t * pv);
      convexity += (t * (t + 1) * pv);
    }
    const fvPV = faceVal / Math.pow(1 + y, n);
    price += fvPV;
    duration += n * fvPV;
    convexity += n * (n + 1) * fvPV;

    duration /= price;
    convexity /= (price * Math.pow(1 + y, 2));
    const modDuration = duration / (1 + y);

    return {
      price: price.toFixed(2),
      macDuration: duration.toFixed(3),
      modDuration: modDuration.toFixed(3),
      convexity: convexity.toFixed(3),
      currentYield: ((c / price) * 100).toFixed(3),
      dv01: ((modDuration * price) / 10000).toFixed(4),
    };
  }, [coupon, ytm, maturity, faceVal]);

  return (
    <div>
      <div style={S.inputGroup}>
        <label style={{ color: "#64748b", fontSize: 10 }}>
          Coupon %
          <input type="number" step={0.1} value={coupon}
            onChange={(e) => setCoupon(+e.target.value)} style={S.input} />
        </label>
        <label style={{ color: "#64748b", fontSize: 10 }}>
          YTM %
          <input type="number" step={0.1} value={ytm}
            onChange={(e) => setYtm(+e.target.value)} style={S.input} />
        </label>
        <label style={{ color: "#64748b", fontSize: 10 }}>
          Maturity (Y)
          <input type="number" step={1} value={maturity}
            onChange={(e) => setMaturity(+e.target.value)} style={S.input} />
        </label>
        <label style={{ color: "#64748b", fontSize: 10 }}>
          Face Value
          <input type="number" step={100} value={faceVal}
            onChange={(e) => setFaceVal(+e.target.value)} style={S.input} />
        </label>
      </div>
      <div style={S.resultGrid}>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>Clean Price</div>
          <div style={S.resultVal}>{calc.price}</div>
        </div>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>Mod Duration</div>
          <div style={S.resultVal}>{calc.modDuration}</div>
        </div>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>Mac Duration</div>
          <div style={{ ...S.resultVal, color: "#38bdf8" }}>{calc.macDuration}</div>
        </div>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>Convexity</div>
          <div style={{ ...S.resultVal, color: "#a855f7" }}>{calc.convexity}</div>
        </div>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>Current Yield</div>
          <div style={{ ...S.resultVal, color: "#fbbf24" }}>{calc.currentYield}%</div>
        </div>
        <div style={S.resultBox}>
          <div style={S.resultLabel}>DV01</div>
          <div style={{ ...S.resultVal, color: "#ef4444" }}>{calc.dv01}</div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PANEL ──────────────────────────────────────────────── */

export default function FixedIncomePanel() {
  const [activeCurves, setActiveCurves] = useState<CurveKey[]>(["current", "week", "month"]);
  const [cdsFilter, setCdsFilter] = useState<"all" | "sov" | "corp">("all");

  function toggleCurve(k: CurveKey) {
    setActiveCurves((prev) =>
      prev.includes(k) ? prev.filter((c) => c !== k) : [...prev, k]
    );
  }

  const filteredCds = CDS_DATA.filter((d) => {
    if (cdsFilter === "sov") return !["JPM", "GS", "HSBC"].some((c) => d.name.includes(c));
    if (cdsFilter === "corp") return ["JPM", "GS", "HSBC"].some((c) => d.name.includes(c));
    return true;
  });

  const now = new Date();
  const ts = `${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")} UTC`;

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <span style={S.title}>FIXED INCOME ANALYTICS</span>
          <span style={{ ...S.badge, marginLeft: 10 }}>FIHD / YAS</span>
          <span style={{ ...S.badge, marginLeft: 6 }}>DEMO</span>
        </div>
        <div style={{ color: "#64748b", fontSize: 11 }}>
          {ts} &middot; Rates as of close
        </div>
      </div>

      {/* Top row: Yield Curve + Spread Analysis */}
      <div style={S.grid}>
        {/* Yield Curve */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={S.cardTitle}>US Treasury Yield Curve</div>
            <div style={{ display: "flex", gap: 10 }}>
              {(["current", "week", "month"] as CurveKey[]).map((k) => {
                const colors: Record<CurveKey, string> = { current: "#00e5a0", week: "#38bdf8", month: "#a855f7" };
                const labels: Record<CurveKey, string> = { current: "Current", week: "1W Ago", month: "1M Ago" };
                return (
                  <button key={k} onClick={() => toggleCurve(k)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      opacity: activeCurves.includes(k) ? 1 : 0.3,
                      display: "flex", alignItems: "center", gap: 3,
                      fontSize: 10, color: colors[k], fontFamily: "inherit",
                    }}>
                    <span style={S.legendDot(colors[k])} />
                    {labels[k]}
                  </button>
                );
              })}
            </div>
          </div>
          <YieldCurveChart curves={["current", "week", "month"]} active={activeCurves} />
          {/* Tenor table */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${TENORS.length}, 1fr)`, gap: 2, marginTop: 4 }}>
            {TENORS.map((t, i) => (
              <div key={t} style={{ textAlign: "center" }}>
                <div style={{ color: "#64748b", fontSize: 8 }}>{t}</div>
                <div style={{ color: "#00e5a0", fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {YIELD_CURVES.current[i].toFixed(2)}
                </div>
                <div style={{ fontSize: 8, fontVariantNumeric: "tabular-nums", ...chgColor(YIELD_CURVES.current[i] - YIELD_CURVES.week[i]) }}>
                  {fmtChg(+((YIELD_CURVES.current[i] - YIELD_CURVES.week[i]) * 100).toFixed(0))}bp
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spread Analysis */}
        <div style={S.card}>
          <div style={S.cardTitle}>Credit Spread Analysis</div>
          {SPREAD_DATA.map((s) => (
            <div key={s.label} style={S.row}>
              <span style={S.labelDim}>{s.label}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={S.val}>
                  {typeof s.value === "number" && s.unit === "bps" ? s.value : s.value}{s.unit === "%" ? "%" : ""}
                </span>
                <span style={{ ...S.val, width: 48, textAlign: "right", ...chgColor(s.chg) }}>
                  {fmtChg(s.chg)}{s.unit === "bps" ? "" : "%"}
                </span>
              </div>
            </div>
          ))}
          {/* Visual bar for IG vs HY */}
          <div style={{ marginTop: 12 }}>
            <div style={{ color: "#64748b", fontSize: 9, marginBottom: 4, letterSpacing: 0.8, textTransform: "uppercase" }}>
              IG vs HY OAS Comparison
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ flex: `0 0 ${(92 / 400) * 100}%`, height: 14, background: "#00e5a0", borderRadius: 2, position: "relative" }}>
                <span style={{ position: "absolute", right: 4, top: 1, fontSize: 9, color: "#0a0e17", fontWeight: 700 }}>92</span>
              </div>
              <span style={{ color: "#64748b", fontSize: 9 }}>IG</span>
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 3 }}>
              <div style={{ flex: `0 0 ${(341 / 400) * 100}%`, height: 14, background: "#ef4444", borderRadius: 2, position: "relative" }}>
                <span style={{ position: "absolute", right: 4, top: 1, fontSize: 9, color: "#fff", fontWeight: 700 }}>341</span>
              </div>
              <span style={{ color: "#64748b", fontSize: 9 }}>HY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle row: Bond Calculator + CDS */}
      <div style={{ ...S.grid, marginTop: 12 }}>
        {/* Bond Calculator */}
        <div style={S.card}>
          <div style={S.cardTitle}>Bond Price / Duration Calculator</div>
          <BondCalculator />
        </div>

        {/* CDS Spreads */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={S.cardTitle}>CDS Spreads (5Y)</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "sov", "corp"] as const).map((f) => (
                <button key={f} onClick={() => setCdsFilter(f)}
                  style={{
                    background: cdsFilter === f ? "#1e293b" : "transparent",
                    border: "1px solid #334155",
                    color: cdsFilter === f ? "#00e5a0" : "#64748b",
                    padding: "2px 8px", borderRadius: 3, fontSize: 9,
                    cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
                  }}>
                  {f === "all" ? "All" : f === "sov" ? "Sovereign" : "Corporate"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {filteredCds.map((d) => (
              <div key={d.name} style={{ ...S.row, padding: "4px 6px" }}>
                <span style={S.labelDim}>{d.name}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={S.val}>{d.spread}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, fontVariantNumeric: "tabular-nums", ...chgColor(d.chg) }}>
                    {fmtChg(d.chg)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* CDS bar chart */}
          <svg viewBox="0 0 200 60" style={{ width: "100%", height: 70, marginTop: 8 }}>
            {filteredCds.map((d, i) => {
              const maxSpread = 300;
              const bw = 180 / filteredCds.length - 2;
              const x = 10 + i * (bw + 2);
              const h = Math.min((d.spread / maxSpread) * 50, 50);
              const fill = d.spread > 150 ? "#ef4444" : d.spread > 60 ? "#fbbf24" : "#00e5a0";
              return (
                <g key={d.name}>
                  <rect x={x} y={50 - h} width={bw} height={h} fill={fill} rx={1} opacity={0.8} />
                  <text x={x + bw / 2} y={58} fill="#64748b" fontSize={4} textAnchor="middle">
                    {d.name.replace(" 5Y", "")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom row: Central Bank Rates */}
      <div style={{ ...S.card, marginTop: 12 }}>
        <div style={S.cardTitle}>Central Bank Policy Rates</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {CB_RATES.map((cb) => {
            const expColor = cb.exp === "HOLD" ? "#fbbf24" : cb.exp.startsWith("-") ? "#00e5a0" : "#ef4444";
            return (
              <div key={cb.abbr} style={{
                background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: 4, padding: "10px 8px", textAlign: "center",
              }}>
                <div style={{ color: "#64748b", fontSize: 9, letterSpacing: 1 }}>{cb.abbr}</div>
                <div style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 700, margin: "4px 0", fontVariantNumeric: "tabular-nums" }}>
                  {cb.rate.toFixed(2)}%
                </div>
                <div style={{ color: expColor, fontSize: 11, fontWeight: 700, margin: "2px 0" }}>
                  {cb.exp}
                </div>
                <div style={{ color: "#64748b", fontSize: 9 }}>
                  Prob: {cb.prob}%
                </div>
                <div style={{ color: "#475569", fontSize: 8, marginTop: 4 }}>
                  Next: {cb.next}
                </div>
                {/* probability bar */}
                <div style={{ marginTop: 6, background: "#1e293b", borderRadius: 2, height: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${cb.prob}%`, height: "100%",
                    background: expColor, borderRadius: 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", color: "#475569", fontSize: 9 }}>
        <span>NUR FINANCE &middot; Fixed Income Analytics v2.1 &middot; DEMO MODE</span>
        <span>Data: Simulated &middot; Not for trading decisions</span>
      </div>
    </div>
  );
}
