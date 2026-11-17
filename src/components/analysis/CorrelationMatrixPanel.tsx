"use client";
import { useState, useMemo } from "react";

/* ── DEMO DATA ───────────────────────────────────────────────── */
const ASSETS = ["SPY","QQQ","IWM","EFA","EEM","TLT","GLD","USO","DXY","BTC","VIX","HYG"] as const;
type Asset = (typeof ASSETS)[number];

// Realistic correlation matrix (symmetric, diag = 1)
const RAW: number[][] = [
  [ 1.00, 0.93, 0.90, 0.82, 0.74,-0.42,-0.05, 0.48,-0.12, 0.52,-0.81, 0.68],
  [ 0.93, 1.00, 0.84, 0.76, 0.68,-0.38,-0.10, 0.40,-0.08, 0.60,-0.78, 0.60],
  [ 0.90, 0.84, 1.00, 0.78, 0.72,-0.35,-0.02, 0.52,-0.15, 0.48,-0.75, 0.72],
  [ 0.82, 0.76, 0.78, 1.00, 0.88,-0.30, 0.10, 0.45,-0.32, 0.40,-0.65, 0.62],
  [ 0.74, 0.68, 0.72, 0.88, 1.00,-0.25, 0.15, 0.50,-0.38, 0.42,-0.58, 0.55],
  [-0.42,-0.38,-0.35,-0.30,-0.25, 1.00, 0.35,-0.28, 0.20,-0.15, 0.48,-0.10],
  [-0.05,-0.10,-0.02, 0.10, 0.15, 0.35, 1.00, 0.22,-0.45, 0.30, 0.12, 0.08],
  [ 0.48, 0.40, 0.52, 0.45, 0.50,-0.28, 0.22, 1.00,-0.30, 0.25,-0.40, 0.42],
  [-0.12,-0.08,-0.15,-0.32,-0.38, 0.20,-0.45,-0.30, 1.00,-0.22, 0.18,-0.25],
  [ 0.52, 0.60, 0.48, 0.40, 0.42,-0.15, 0.30, 0.25,-0.22, 1.00,-0.45, 0.35],
  [-0.81,-0.78,-0.75,-0.65,-0.58, 0.48, 0.12,-0.40, 0.18,-0.45, 1.00,-0.62],
  [ 0.68, 0.60, 0.72, 0.62, 0.55,-0.10, 0.08, 0.42,-0.25, 0.35,-0.62, 1.00],
];

const SECTORS = [
  { name: "Technology",       weight: 31.5, perf:  1.24 },
  { name: "Healthcare",       weight: 12.8, perf: -0.38 },
  { name: "Financials",       weight: 12.5, perf:  0.72 },
  { name: "Consumer Disc",    weight: 10.2, perf:  0.95 },
  { name: "Industrials",      weight:  8.6, perf:  0.41 },
  { name: "Consumer Staples", weight:  6.1, perf: -0.18 },
  { name: "Energy",           weight:  4.2, perf: -1.10 },
  { name: "Communication",    weight:  4.0, perf:  0.55 },
  { name: "Materials",        weight:  2.8, perf:  0.32 },
  { name: "Utilities",        weight:  2.6, perf: -0.05 },
  { name: "Real Estate",      weight:  2.4, perf: -0.62 },
];

const BETA_DATA = [
  { ticker: "QQQ",  beta: 1.08, r2: 0.87, alpha: 0.032, te: 5.2 },
  { ticker: "IWM",  beta: 1.15, r2: 0.82, alpha:-0.018, te: 7.8 },
  { ticker: "EFA",  beta: 0.88, r2: 0.68, alpha:-0.005, te: 9.1 },
  { ticker: "EEM",  beta: 0.95, r2: 0.55, alpha: 0.012, te: 12.4 },
  { ticker: "TLT",  beta:-0.42, r2: 0.18, alpha: 0.028, te: 14.2 },
  { ticker: "GLD",  beta:-0.05, r2: 0.00, alpha: 0.045, te: 15.8 },
  { ticker: "HYG",  beta: 0.38, r2: 0.46, alpha: 0.015, te: 6.3 },
  { ticker: "BTC",  beta: 0.72, r2: 0.27, alpha: 0.085, te: 42.1 },
];

function genRollingCorr(a1: number, a2: number): number[] {
  const base = RAW[a1][a2];
  const pts: number[] = [];
  for (let i = 0; i < 120; i++) {
    const noise = (Math.sin(i * 0.15) * 0.15) + (Math.cos(i * 0.08) * 0.1) + (Math.sin(i * 0.3) * 0.05);
    pts.push(Math.max(-1, Math.min(1, base + noise)));
  }
  return pts;
}

/* ── COLOR HELPERS ───────────────────────────────────────────── */
function corrColor(v: number): string {
  if (v >= 0) {
    const t = v;
    const r = Math.round(255 - t * 215);
    const g = Math.round(255 - t * 26);
    const b = Math.round(255 - t * 215);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = -v;
    const r = Math.round(255 - t * 26);
    const g = Math.round(255 - t * 195);
    const b = Math.round(255 - t * 195);
    return `rgb(${r},${g},${b})`;
  }
}

function perfColor(v: number): string {
  if (v >= 0) {
    const t = Math.min(v / 1.5, 1);
    return `rgb(${Math.round(20 + t * 10)},${Math.round(80 + t * 150)},${Math.round(60 + t * 80)})`;
  }
  const t = Math.min(-v / 1.5, 1);
  return `rgb(${Math.round(180 + t * 60)},${Math.round(40 + t * 10)},${Math.round(40 + t * 10)})`;
}

function corrTextColor(v: number): string {
  return Math.abs(v) > 0.6 ? "#fff" : "#c0c8d8";
}

/* ── TREEMAP LAYOUT (squarified simple) ──────────────────────── */
interface TreeRect { name: string; weight: number; perf: number; x: number; y: number; w: number; h: number }

function layoutTreemap(sectors: typeof SECTORS, W: number, H: number): TreeRect[] {
  const total = sectors.reduce((s, d) => s + d.weight, 0);
  const sorted = [...sectors].sort((a, b) => b.weight - a.weight);
  const rects: TreeRect[] = [];
  let x = 0, y = 0, remW = W, remH = H, remArea = W * H;

  let i = 0;
  while (i < sorted.length) {
    const horiz = remW >= remH;
    const side = horiz ? remH : remW;
    let rowArea = 0;
    const row: typeof sorted = [];
    let bestAspect = Infinity;

    for (let j = i; j < sorted.length; j++) {
      const area = (sorted[j].weight / total) * W * H;
      const testArea = rowArea + area;
      const testLen = testArea / side;
      const last = area / testLen;
      const aspect = Math.max(testLen / last, last / testLen);
      if (aspect > bestAspect && row.length > 0) break;
      bestAspect = aspect;
      row.push(sorted[j]);
      rowArea = testArea;
    }

    const rowLen = rowArea / side;
    let offset = 0;
    for (const item of row) {
      const itemArea = (item.weight / total) * W * H;
      const itemLen = itemArea / rowLen;
      if (horiz) {
        rects.push({ ...item, x: x, y: y + offset, w: rowLen, h: itemLen });
      } else {
        rects.push({ ...item, x: x + offset, y: y, w: itemLen, h: rowLen });
      }
      offset += itemLen;
    }

    if (horiz) { x += rowLen; remW -= rowLen; }
    else { y += rowLen; remH -= rowLen; }
    remArea -= rowArea;
    i += row.length;
  }
  return rects;
}

/* ── REGIME DETECTION ────────────────────────────────────────── */
function detectRegime(): { label: string; color: string; score: number; indicators: { name: string; signal: string }[] } {
  const vix = 18.5;
  const spread = 3.8;
  const breadth = 68;
  const momentum = 1.2;

  const score = (vix < 20 ? 25 : vix < 30 ? 10 : -15)
    + (spread < 4.5 ? 20 : spread < 6 ? 5 : -15)
    + (breadth > 60 ? 25 : breadth > 40 ? 10 : -15)
    + (momentum > 0 ? 20 : -10);

  const label = score >= 60 ? "RISK-ON" : score >= 20 ? "TRANSITION" : "RISK-OFF";
  const color = score >= 60 ? "#00e5a0" : score >= 20 ? "#f59e0b" : "#ef4444";

  return {
    label, color, score,
    indicators: [
      { name: "VIX", signal: vix < 20 ? "LOW" : vix < 30 ? "ELEVATED" : "HIGH" },
      { name: "Credit Spread", signal: spread < 4.5 ? "TIGHT" : "WIDENING" },
      { name: "Market Breadth", signal: breadth > 60 ? "STRONG" : "WEAK" },
      { name: "Price Momentum", signal: momentum > 0 ? "POSITIVE" : "NEGATIVE" },
    ],
  };
}

/* ── COMPONENT ───────────────────────────────────────────────── */
type Tab = "matrix" | "treemap" | "rolling" | "beta" | "regime";

export default function CorrelationMatrixPanel() {
  const [tab, setTab] = useState<Tab>("matrix");
  const [asset1, setAsset1] = useState(0);
  const [asset2, setAsset2] = useState(1);
  const [period, setPeriod] = useState<"30d" | "60d" | "90d" | "1y">("60d");

  const regime = useMemo(detectRegime, []);
  const rollingData = useMemo(() => genRollingCorr(asset1, asset2), [asset1, asset2]);
  const treemapRects = useMemo(() => layoutTreemap(SECTORS, 680, 320), []);

  const CELL = 46;
  const LABEL_W = 42;
  const matrixW = LABEL_W + ASSETS.length * CELL;
  const matrixH = 28 + ASSETS.length * CELL;

  const tabs: { id: Tab; label: string }[] = [
    { id: "matrix", label: "CORR MATRIX" },
    { id: "treemap", label: "SECTOR MAP" },
    { id: "rolling", label: "ROLLING ρ" },
    { id: "beta", label: "BETA / RISK" },
    { id: "regime", label: "REGIME" },
  ];

  return (
    <div style={{ background: "#0a0e17", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'SF Mono', monospace", height: "100%", overflow: "auto", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#00e5a0", letterSpacing: 1.5 }}>
            CORRELATION MATRIX & SECTOR ANALYTICS
          </h2>
          <span style={{ fontSize: 11, color: "#64748b" }}>Cross-Asset Correlation · Sector Heatmap · Regime Detection</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, padding: "3px 8px", background: "#111827", border: "1px solid #1e293b", borderRadius: 4, color: "#94a3b8" }}>DEMO</span>
          <span style={{ fontSize: 10, padding: "3px 8px", background: regime.color + "18", border: `1px solid ${regime.color}44`, borderRadius: 4, color: regime.color, fontWeight: 700 }}>
            {regime.label}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 14, borderBottom: "1px solid #1e293b", paddingBottom: 8 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#00e5a018" : "transparent",
              border: tab === t.id ? "1px solid #00e5a044" : "1px solid transparent",
              color: tab === t.id ? "#00e5a0" : "#64748b",
              fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: 0.8,
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* ── TAB: CORRELATION MATRIX ──────────────────────────────── */}
      {tab === "matrix" && (
        <div style={{ overflowX: "auto" }}>
          <svg width={matrixW + 8} height={matrixH + 8} style={{ display: "block" }}>
            {/* Column labels */}
            {ASSETS.map((a, i) => (
              <text key={`cl-${i}`} x={LABEL_W + i * CELL + CELL / 2} y={16} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="inherit" fontWeight={600}>{a}</text>
            ))}
            {/* Rows */}
            {ASSETS.map((rowAsset, ri) => (
              <g key={`r-${ri}`}>
                <text x={LABEL_W - 4} y={28 + ri * CELL + CELL / 2 + 3} textAnchor="end" fontSize={9} fill="#94a3b8" fontFamily="inherit" fontWeight={600}>{rowAsset}</text>
                {ASSETS.map((_, ci) => {
                  const v = RAW[ri][ci];
                  const bg = corrColor(v);
                  const isDiag = ri === ci;
                  return (
                    <g key={`c-${ri}-${ci}`}>
                      <rect
                        x={LABEL_W + ci * CELL + 1}
                        y={28 + ri * CELL + 1}
                        width={CELL - 2}
                        height={CELL - 2}
                        rx={3}
                        fill={bg}
                        opacity={isDiag ? 0.5 : 0.85}
                        stroke={isDiag ? "#00e5a0" : "none"}
                        strokeWidth={isDiag ? 1.5 : 0}
                      />
                      <text
                        x={LABEL_W + ci * CELL + CELL / 2}
                        y={28 + ri * CELL + CELL / 2 + 4}
                        textAnchor="middle"
                        fontSize={isDiag ? 10 : 9}
                        fontWeight={isDiag ? 700 : 500}
                        fill={corrTextColor(v)}
                        fontFamily="inherit"
                      >
                        {v.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "#64748b" }}>
            <span>-1.0</span>
            <div style={{ width: 200, height: 10, borderRadius: 5, background: "linear-gradient(90deg, rgb(229,60,60), rgb(255,255,255), rgb(40,229,160))" }} />
            <span>+1.0</span>
            <span style={{ marginLeft: 12 }}>Period: {period}</span>
            {(["30d","60d","90d","1y"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                background: period === p ? "#00e5a020" : "transparent",
                border: period === p ? "1px solid #00e5a044" : "1px solid #1e293b",
                color: period === p ? "#00e5a0" : "#64748b",
                fontSize: 9, padding: "2px 6px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
              }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SECTOR TREEMAP ──────────────────────────────────── */}
      {tab === "treemap" && (
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>S&P 500 Sector Performance Treemap — Size = Market Cap Weight, Color = Daily Return</div>
          <svg width={680} height={320} style={{ display: "block", borderRadius: 6 }}>
            {treemapRects.map((r, i) => (
              <g key={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={perfColor(r.perf)} stroke="#0a0e17" strokeWidth={2} rx={2} />
                {r.w > 55 && r.h > 30 && (
                  <>
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 6} textAnchor="middle" fontSize={r.w > 100 ? 11 : 9} fill="#fff" fontFamily="inherit" fontWeight={700}>
                      {r.name}
                    </text>
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 8} textAnchor="middle" fontSize={r.w > 100 ? 11 : 9} fill="#fff" fontFamily="inherit" fontWeight={500} opacity={0.8}>
                      {r.perf >= 0 ? "+" : ""}{r.perf.toFixed(2)}%
                    </text>
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} textAnchor="middle" fontSize={8} fill="#fff" fontFamily="inherit" opacity={0.5}>
                      {r.weight}%
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {SECTORS.map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94a3b8" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: perfColor(s.perf) }} />
                {s.name}: <span style={{ color: s.perf >= 0 ? "#00e5a0" : "#ef4444", fontWeight: 600 }}>{s.perf >= 0 ? "+" : ""}{s.perf.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ROLLING CORRELATION ─────────────────────────────── */}
      {tab === "rolling" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#64748b" }}>Asset A:</span>
            <select value={asset1} onChange={e => setAsset1(+e.target.value)} style={{ background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0", fontSize: 11, padding: "3px 8px", borderRadius: 4, fontFamily: "inherit" }}>
              {ASSETS.map((a, i) => <option key={i} value={i}>{a}</option>)}
            </select>
            <span style={{ fontSize: 10, color: "#64748b" }}>Asset B:</span>
            <select value={asset2} onChange={e => setAsset2(+e.target.value)} style={{ background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0", fontSize: 11, padding: "3px 8px", borderRadius: 4, fontFamily: "inherit" }}>
              {ASSETS.map((a, i) => <option key={i} value={i}>{a}</option>)}
            </select>
            <span style={{ fontSize: 11, color: "#00e5a0", fontWeight: 700 }}>
              ρ = {RAW[asset1][asset2].toFixed(2)}
            </span>
          </div>

          <svg width={680} height={260} style={{ display: "block" }}>
            {/* Grid */}
            {[-1, -0.5, 0, 0.5, 1].map(v => {
              const y = 20 + (1 - v) * 110;
              return (
                <g key={v}>
                  <line x1={40} y1={y} x2={670} y2={y} stroke="#1e293b" strokeWidth={1} />
                  <text x={36} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="inherit">{v.toFixed(1)}</text>
                </g>
              );
            })}
            {/* Zero line */}
            <line x1={40} y1={130} x2={670} y2={130} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />

            {/* Line */}
            <polyline
              fill="none"
              stroke="#00e5a0"
              strokeWidth={2}
              points={rollingData.map((v, i) => `${40 + i * (630 / 119)},${20 + (1 - v) * 110}`).join(" ")}
            />
            {/* Area fill */}
            <polygon
              fill="url(#corrGrad)"
              opacity={0.15}
              points={`40,130 ${rollingData.map((v, i) => `${40 + i * (630 / 119)},${20 + (1 - v) * 110}`).join(" ")} 670,130`}
            />
            <defs>
              <linearGradient id="corrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5a0" />
                <stop offset="100%" stopColor="#0a0e17" />
              </linearGradient>
            </defs>
            {/* X axis labels */}
            {[0, 30, 60, 90, 119].map(i => (
              <text key={i} x={40 + i * (630 / 119)} y={250} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="inherit">
                {i === 0 ? "120d" : i === 30 ? "90d" : i === 60 ? "60d" : i === 90 ? "30d" : "Now"}
              </text>
            ))}
            {/* Title */}
            <text x={355} y={255} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="inherit">
              60-Day Rolling Correlation: {ASSETS[asset1]} vs {ASSETS[asset2]}
            </text>
          </svg>
        </div>
      )}

      {/* ── TAB: BETA & RISK DECOMPOSITION ───────────────────────── */}
      {tab === "beta" && (
        <div style={{ overflowX: "auto" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>Risk Decomposition vs SPY Benchmark</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "inherit" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["ETF", "Beta (β)", "R²", "Alpha (α)", "Tracking Error", "Info Ratio", "Classification"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BETA_DATA.map(d => {
                const ir = d.te > 0 ? (d.alpha / (d.te / 100)) : 0;
                const cls = Math.abs(d.beta) > 1 ? "Aggressive" : Math.abs(d.beta) > 0.5 ? "Moderate" : d.beta < 0 ? "Defensive" : "Low-Beta";
                const clsColor = cls === "Aggressive" ? "#ef4444" : cls === "Moderate" ? "#f59e0b" : "#00e5a0";
                return (
                  <tr key={d.ticker} style={{ borderBottom: "1px solid #111827" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#e2e8f0" }}>{d.ticker}</td>
                    <td style={{ padding: "8px 10px", color: d.beta > 0 ? "#00e5a0" : "#ef4444", fontWeight: 600 }}>{d.beta.toFixed(2)}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 50, height: 5, background: "#1e293b", borderRadius: 3 }}>
                          <div style={{ width: `${d.r2 * 100}%`, height: "100%", background: "#00e5a0", borderRadius: 3 }} />
                        </div>
                        <span>{d.r2.toFixed(2)}</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", color: d.alpha >= 0 ? "#00e5a0" : "#ef4444" }}>
                      {d.alpha >= 0 ? "+" : ""}{(d.alpha * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: "8px 10px" }}>{d.te.toFixed(1)}%</td>
                    <td style={{ padding: "8px 10px", color: ir > 0.5 ? "#00e5a0" : ir > 0 ? "#f59e0b" : "#ef4444" }}>{ir.toFixed(2)}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700, background: clsColor + "18", color: clsColor, border: `1px solid ${clsColor}33` }}>
                        {cls}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
            {[
              { label: "Portfolio Beta", value: "0.92", sub: "vs S&P 500", color: "#00e5a0" },
              { label: "Avg Correlation", value: "0.48", sub: "Cross-asset", color: "#38bdf8" },
              { label: "Diversification Ratio", value: "1.34", sub: "σ_weighted / σ_port", color: "#a78bfa" },
              { label: "Max Drawdown", value: "-12.4%", sub: "Rolling 1Y", color: "#ef4444" },
            ].map(m => (
              <div key={m.label} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 0.5, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: REGIME DETECTION ────────────────────────────────── */}
      {tab === "regime" && (
        <div>
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            {/* Score gauge */}
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: 20, flex: "0 0 200px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>REGIME SCORE</div>
              <svg width={140} height={80} viewBox="0 0 140 80">
                <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#1e293b" strokeWidth={10} strokeLinecap="round" />
                <path
                  d="M 10 70 A 60 60 0 0 1 130 70"
                  fill="none"
                  stroke={regime.color}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={`${(regime.score / 100) * 188} 188`}
                />
                <text x={70} y={58} textAnchor="middle" fontSize={22} fontWeight={700} fill={regime.color} fontFamily="inherit">{regime.score}</text>
                <text x={70} y={72} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="inherit">/100</text>
              </svg>
              <div style={{ fontSize: 14, fontWeight: 700, color: regime.color, letterSpacing: 2, marginTop: 6 }}>{regime.label}</div>
            </div>

            {/* Indicators */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, fontWeight: 600 }}>REGIME INDICATORS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {regime.indicators.map(ind => {
                  const isGood = ind.signal === "LOW" || ind.signal === "TIGHT" || ind.signal === "STRONG" || ind.signal === "POSITIVE";
                  return (
                    <div key={ind.name} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#e2e8f0" }}>{ind.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10,
                        background: isGood ? "#00e5a018" : "#ef444418",
                        color: isGood ? "#00e5a0" : "#ef4444",
                        border: `1px solid ${isGood ? "#00e5a033" : "#ef444433"}`,
                      }}>{ind.signal}</span>
                    </div>
                  );
                })}
              </div>

              {/* Regime history */}
              <div style={{ marginTop: 14, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>REGIME HISTORY (12M)</div>
              <svg width={440} height={50} style={{ display: "block", marginTop: 6 }}>
                {[
                  { x: 0, w: 80, label: "Risk-On", color: "#00e5a0" },
                  { x: 80, w: 30, label: "Trans.", color: "#f59e0b" },
                  { x: 110, w: 60, label: "Risk-Off", color: "#ef4444" },
                  { x: 170, w: 20, label: "Trans.", color: "#f59e0b" },
                  { x: 190, w: 120, label: "Risk-On", color: "#00e5a0" },
                  { x: 310, w: 40, label: "Trans.", color: "#f59e0b" },
                  { x: 350, w: 90, label: "Risk-On", color: "#00e5a0" },
                ].map((seg, i) => (
                  <g key={i}>
                    <rect x={seg.x} y={5} width={seg.w} height={24} fill={seg.color + "33"} stroke={seg.color} strokeWidth={1} rx={3} />
                    {seg.w > 40 && (
                      <text x={seg.x + seg.w / 2} y={20} textAnchor="middle" fontSize={8} fill={seg.color} fontFamily="inherit" fontWeight={600}>{seg.label}</text>
                    )}
                  </g>
                ))}
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                  <text key={m} x={i * (440 / 12) + 18} y={46} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="inherit">{m}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Cross-asset signals */}
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600 }}>CROSS-ASSET REGIME SIGNALS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { pair: "SPY/TLT", ratio: 2.84, trend: "Rising", signal: "Risk-On" },
              { pair: "HYG/TLT", ratio: 0.52, trend: "Stable", signal: "Neutral" },
              { pair: "GLD/SPY", ratio: 0.42, trend: "Falling", signal: "Risk-On" },
              { pair: "VIX Term", ratio: 0.88, trend: "Contango", signal: "Risk-On" },
            ].map(s => (
              <div key={s.pair} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px" }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{s.pair}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{s.ratio}</div>
                <div style={{ fontSize: 9, color: s.signal === "Risk-On" ? "#00e5a0" : s.signal === "Neutral" ? "#f59e0b" : "#ef4444" }}>
                  {s.trend} · {s.signal}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
