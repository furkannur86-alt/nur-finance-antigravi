"use client";

import { useState, useMemo } from "react";
import DemoBadge from "../ui/DemoBadge";

/* ── types ──────────────────────────────────────────────────── */

interface Commodity {
  symbol: string;
  name: string;
  sector: "Energy" | "Metals" | "Agriculture";
  spot: number;
  unit: string;
  d1: number;
  w1: number;
  m1: number;
  ytd: number;
  curve: number[];       // 13 points: spot + 12 months forward
  seasonal: number[];    // 12 monthly avg returns
  cotComm: number;       // commercial net
  cotNonComm: number;    // non-commercial net
  cotSpec: number;       // speculative
  invCurrent: number;
  invPrev: number;
  invUnit: string;
}

/* ── demo data ──────────────────────────────────────────────── */

const COMMODITIES: Commodity[] = [
  {
    symbol: "CL", name: "WTI Crude", sector: "Energy",
    spot: 78.40, unit: "$/bbl", d1: 1.8, w1: 3.2, m1: -2.1, ytd: 8.5,
    curve: [78.40, 78.10, 77.60, 76.90, 76.20, 75.50, 74.80, 74.20, 73.70, 73.30, 72.90, 72.60, 72.30],
    seasonal: [2.1, 1.8, -0.5, 3.2, 1.1, -1.9, 2.4, 0.3, -3.1, 1.6, 0.8, 1.2],
    cotComm: -285400, cotNonComm: 198200, cotSpec: 87200,
    invCurrent: 439.8, invPrev: 445.2, invUnit: "M bbl",
  },
  {
    symbol: "BRN", name: "Brent Crude", sector: "Energy",
    spot: 82.30, unit: "$/bbl", d1: 1.5, w1: 2.8, m1: -1.4, ytd: 7.2,
    curve: [82.30, 82.00, 81.50, 80.80, 80.10, 79.40, 78.80, 78.30, 77.90, 77.50, 77.20, 76.90, 76.60],
    seasonal: [2.4, 1.5, -0.8, 3.5, 0.9, -2.1, 2.8, 0.1, -2.9, 1.8, 0.5, 1.4],
    cotComm: -312000, cotNonComm: 221000, cotSpec: 91000,
    invCurrent: 1245.0, invPrev: 1260.0, invUnit: "M bbl",
  },
  {
    symbol: "NG", name: "Natural Gas", sector: "Energy",
    spot: 2.84, unit: "$/MMBtu", d1: -3.2, w1: -5.1, m1: 12.4, ytd: -18.2,
    curve: [2.84, 2.92, 3.10, 3.35, 3.52, 3.68, 3.80, 3.72, 3.55, 3.40, 3.25, 3.15, 3.05],
    seasonal: [-8.2, -5.1, -3.4, -6.2, -2.1, 1.5, 3.8, 2.1, 0.5, 4.2, 8.5, 6.2],
    cotComm: -145600, cotNonComm: 95200, cotSpec: 50400,
    invCurrent: 3245, invPrev: 3312, invUnit: "Bcf",
  },
  {
    symbol: "GC", name: "Gold", sector: "Metals",
    spot: 2345.60, unit: "$/oz", d1: 0.4, w1: 1.2, m1: 2.8, ytd: 14.2,
    curve: [2345.60, 2348.20, 2351.80, 2356.40, 2362.00, 2368.50, 2375.80, 2383.40, 2391.20, 2399.80, 2408.60, 2417.80, 2427.20],
    seasonal: [3.2, -0.5, 0.8, 1.5, -1.2, 0.3, 2.1, -0.8, 1.8, -0.2, 1.4, 0.6],
    cotComm: -380000, cotNonComm: 285000, cotSpec: 95000,
    invCurrent: 25.8, invPrev: 26.1, invUnit: "M oz",
  },
  {
    symbol: "SI", name: "Silver", sector: "Metals",
    spot: 27.85, unit: "$/oz", d1: 1.2, w1: 3.5, m1: 5.1, ytd: 22.4,
    curve: [27.85, 27.92, 28.05, 28.20, 28.38, 28.58, 28.80, 29.04, 29.30, 29.58, 29.88, 30.20, 30.54],
    seasonal: [4.1, -1.2, 1.5, 2.8, -0.8, -1.5, 3.2, 1.0, 2.4, -0.5, 1.8, 0.2],
    cotComm: -68500, cotNonComm: 48200, cotSpec: 20300,
    invCurrent: 282.5, invPrev: 290.1, invUnit: "M oz",
  },
  {
    symbol: "HG", name: "Copper", sector: "Metals",
    spot: 4.28, unit: "$/lb", d1: 0.8, w1: 2.1, m1: 4.5, ytd: 16.8,
    curve: [4.28, 4.27, 4.25, 4.22, 4.19, 4.16, 4.13, 4.10, 4.07, 4.04, 4.01, 3.98, 3.95],
    seasonal: [2.8, 1.5, 0.3, 3.1, -1.5, -2.2, 1.8, 0.5, -1.0, 2.0, 1.2, -0.3],
    cotComm: -52400, cotNonComm: 38100, cotSpec: 14300,
    invCurrent: 118.5, invPrev: 125.2, invUnit: "kt",
  },
  {
    symbol: "W", name: "Wheat", sector: "Agriculture",
    spot: 5.92, unit: "$/bu", d1: -0.5, w1: -1.8, m1: -4.2, ytd: -12.5,
    curve: [5.92, 6.02, 6.15, 6.28, 6.38, 6.45, 6.50, 6.52, 6.48, 6.42, 6.35, 6.28, 6.20],
    seasonal: [-1.5, 0.8, 2.5, 1.2, -3.8, -4.2, 5.1, -2.5, 1.0, 0.5, -0.8, 1.2],
    cotComm: -92300, cotNonComm: 62100, cotSpec: 30200,
    invCurrent: 580, invPrev: 612, invUnit: "M bu",
  },
  {
    symbol: "S", name: "Soybeans", sector: "Agriculture",
    spot: 11.45, unit: "$/bu", d1: 0.3, w1: -0.8, m1: 1.2, ytd: -5.8,
    curve: [11.45, 11.52, 11.60, 11.68, 11.72, 11.75, 11.70, 11.62, 11.55, 11.48, 11.42, 11.38, 11.35],
    seasonal: [1.2, -0.8, 2.1, 0.5, 3.5, 4.2, -2.8, -1.5, -3.2, 0.8, 1.5, -0.2],
    cotComm: -78500, cotNonComm: 55200, cotSpec: 23300,
    invCurrent: 315, invPrev: 340, invUnit: "M bu",
  },
  {
    symbol: "KC", name: "Coffee", sector: "Agriculture",
    spot: 185.40, unit: "¢/lb", d1: 2.5, w1: 5.8, m1: 12.2, ytd: 38.5,
    curve: [185.40, 184.80, 183.50, 182.00, 180.80, 179.90, 179.20, 178.60, 178.20, 177.90, 177.60, 177.40, 177.20],
    seasonal: [5.2, -2.1, 3.8, -1.5, 0.8, 2.4, 6.5, 1.2, -3.5, 2.8, -0.5, 1.8],
    cotComm: -48200, cotNonComm: 35800, cotSpec: 12400,
    invCurrent: 0.82, invPrev: 0.91, invUnit: "M bags",
  },
  {
    symbol: "CC", name: "Cocoa", sector: "Agriculture",
    spot: 8420, unit: "$/mt", d1: 3.8, w1: 8.2, m1: 15.5, ytd: 95.2,
    curve: [8420, 8380, 8290, 8180, 8050, 7920, 7800, 7690, 7600, 7530, 7470, 7420, 7380],
    seasonal: [8.5, 4.2, -2.1, 5.8, -3.2, -5.5, 2.1, 1.5, 3.8, 6.2, -1.0, 2.5],
    cotComm: -32100, cotNonComm: 24500, cotSpec: 7600,
    invCurrent: 1.52, invPrev: 1.68, invUnit: "M mt",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURVE_LABELS = ["Spot", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
const SECTORS = ["All", "Energy", "Metals", "Agriculture"] as const;

type Tab = "curve" | "seasonal" | "cot" | "inventory";

/* ── helpers ────────────────────────────────────────────────── */

function fmt(n: number, dec = 2): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(dec);
}

function chg(v: number): React.CSSProperties {
  return { color: v > 0 ? "#00e5a0" : v < 0 ? "#ef4444" : "#94a3b8" };
}

function sign(v: number): string {
  return v > 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`;
}

/* ── SVG: Futures Curve ─────────────────────────────────────── */

function FuturesCurveChart({ commodity }: { commodity: Commodity }) {
  const W = 700, H = 260, PAD = { t: 20, r: 20, b: 35, l: 65 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const vals = commodity.curve;
  const mn = Math.min(...vals) * 0.998;
  const mx = Math.max(...vals) * 1.002;

  const toX = (i: number) => PAD.l + (i / (vals.length - 1)) * iW;
  const toY = (v: number) => PAD.t + (1 - (v - mn) / (mx - mn)) * iH;

  const spotY = toY(vals[0]);
  const pts = vals.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const isBackwardation = vals[vals.length - 1] < vals[0];
  const fillColor = isBackwardation ? "rgba(239,68,68,0.12)" : "rgba(0,229,160,0.12)";
  const lineColor = isBackwardation ? "#ef4444" : "#00e5a0";
  const label = isBackwardation ? "BACKWARDATION" : "CONTANGO";

  const fillPath = `M${toX(0)},${spotY} L${pts.split(" ").map(p => p).join(" L")} L${toX(vals.length - 1)},${spotY} Z`;

  const ticks = 5;
  const step = (mx - mn) / (ticks - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* grid lines */}
      {Array.from({ length: ticks }, (_, i) => {
        const v = mn + step * i;
        const y = toY(v);
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize={10} fontFamily="monospace">
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* spot reference line */}
      <line x1={PAD.l} x2={W - PAD.r} y1={spotY} y2={spotY}
        stroke="#475569" strokeWidth={1} strokeDasharray="4,3" />

      {/* shaded area between spot line and curve */}
      <path d={fillPath} fill={fillColor} />

      {/* curve line */}
      <polyline points={pts} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinejoin="round" />

      {/* data points */}
      {vals.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={lineColor} stroke="#0a0e17" strokeWidth={1.5} />
      ))}

      {/* x-axis labels */}
      {CURVE_LABELS.map((l, i) => (
        <text key={i} x={toX(i)} y={H - 5} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">
          {l}
        </text>
      ))}

      {/* contango/backwardation label */}
      <text x={W - PAD.r} y={PAD.t + 14} textAnchor="end" fill={lineColor}
        fontSize={11} fontWeight="bold" fontFamily="monospace">
        {label}
      </text>

      {/* spread annotation */}
      <text x={PAD.l + 4} y={PAD.t + 14} fill="#94a3b8" fontSize={10} fontFamily="monospace">
        Spread: {(vals[vals.length - 1] - vals[0]).toFixed(2)} {commodity.unit}
      </text>
    </svg>
  );
}

/* ── SVG: Seasonal Bar Chart ────────────────────────────────── */

function SeasonalChart({ seasonal }: { seasonal: number[] }) {
  const W = 700, H = 180, PAD = { t: 15, r: 15, b: 25, l: 45 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const absMax = Math.max(...seasonal.map(Math.abs), 1);
  const barW = iW / 12 - 4;
  const zeroY = PAD.t + iH / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <line x1={PAD.l} x2={W - PAD.r} y1={zeroY} y2={zeroY} stroke="#475569" strokeWidth={1} />
      {/* axis labels */}
      <text x={PAD.l - 8} y={PAD.t + 10} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="monospace">
        +{absMax.toFixed(0)}%
      </text>
      <text x={PAD.l - 8} y={H - PAD.b} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="monospace">
        -{absMax.toFixed(0)}%
      </text>

      {seasonal.map((v, i) => {
        const x = PAD.l + (i / 12) * iW + 2;
        const barH = (Math.abs(v) / absMax) * (iH / 2);
        const y = v >= 0 ? zeroY - barH : zeroY;
        const color = v >= 0 ? "#00e5a0" : "#ef4444";
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} opacity={0.75} rx={2} />
            <text x={x + barW / 2} y={v >= 0 ? y - 3 : y + barH + 11}
              textAnchor="middle" fill={color} fontSize={8} fontFamily="monospace">
              {v > 0 ? "+" : ""}{v.toFixed(1)}
            </text>
            <text x={x + barW / 2} y={H - 5} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">
              {MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── SVG: COT Positioning ───────────────────────────────────── */

function COTChart({ commodity }: { commodity: Commodity }) {
  const W = 700, H = 160, PAD = { t: 20, r: 15, b: 20, l: 100 };
  const iW = W - PAD.l - PAD.r;

  const values = [
    { label: "Commercial", val: commodity.cotComm, color: "#3b82f6" },
    { label: "Non-Commercial", val: commodity.cotNonComm, color: "#00e5a0" },
    { label: "Speculative", val: commodity.cotSpec, color: "#f59e0b" },
  ];

  const absMax = Math.max(...values.map(v => Math.abs(v.val)));
  const barH = 28;
  const gap = 12;
  const startY = PAD.t;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* zero line */}
      <line x1={PAD.l + iW / 2} x2={PAD.l + iW / 2} y1={PAD.t - 5} y2={H - PAD.b}
        stroke="#475569" strokeWidth={1} strokeDasharray="3,3" />
      <text x={PAD.l + iW / 2} y={H - 4} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="monospace">0</text>

      {values.map((item, i) => {
        const y = startY + i * (barH + gap);
        const center = PAD.l + iW / 2;
        const barPixels = (item.val / absMax) * (iW / 2);
        const x = item.val >= 0 ? center : center + barPixels;
        const w = Math.abs(barPixels);

        return (
          <g key={i}>
            <text x={PAD.l - 5} y={y + barH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              {item.label}
            </text>
            <rect x={x} y={y} width={w} height={barH} fill={item.color} opacity={0.8} rx={3} />
            <text x={item.val >= 0 ? x + w + 5 : x - 5} y={y + barH / 2 + 4}
              textAnchor={item.val >= 0 ? "start" : "end"} fill={item.color} fontSize={10} fontWeight="bold" fontFamily="monospace">
              {fmt(item.val, 0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── main component ─────────────────────────────────────────── */

export default function CommodityFuturesPanel() {
  const [selected, setSelected] = useState(0);
  const [sector, setSector] = useState<typeof SECTORS[number]>("All");
  const [tab, setTab] = useState<Tab>("curve");
  const [sortKey, setSortKey] = useState<"d1" | "ytd" | "name">("ytd");

  const filtered = useMemo(() => {
    const list = sector === "All" ? COMMODITIES : COMMODITIES.filter(c => c.sector === sector);
    return [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return Math.abs(b[sortKey]) - Math.abs(a[sortKey]);
    });
  }, [sector, sortKey]);

  const sel = filtered[selected] ?? COMMODITIES[0];

  const tabs: { key: Tab; label: string }[] = [
    { key: "curve", label: "FORWARD CURVE" },
    { key: "seasonal", label: "SEASONAL" },
    { key: "cot", label: "COT POSITIONING" },
    { key: "inventory", label: "INVENTORY" },
  ];

  const invChg = sel.invCurrent - sel.invPrev;
  const invPct = ((invChg / sel.invPrev) * 100);

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "var(--ag-bg, #0a0e17)", color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12,
      overflow: "hidden",
    }}>
      <DemoBadge />

      {/* ── header ─────────────────────────────────────────── */}
      <div style={{
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 16,
        borderBottom: "1px solid #1e293b", flexShrink: 0,
      }}>
        <span style={{ color: "#00e5a0", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>
          COMMODITY FUTURES & CCRV
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => { setSector(s); setSelected(0); }}
              style={{
                padding: "3px 10px", borderRadius: 3, border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 600, fontFamily: "inherit", letterSpacing: 0.5,
                background: sector === s ? "#00e5a0" : "#1e293b",
                color: sector === s ? "#0a0e17" : "#94a3b8",
              }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: 10 }}>SORT</span>
          {(["d1", "ytd", "name"] as const).map(k => (
            <button key={k} onClick={() => setSortKey(k)}
              style={{
                padding: "2px 8px", borderRadius: 2, border: "none", cursor: "pointer",
                fontSize: 9, fontFamily: "inherit",
                background: sortKey === k ? "#334155" : "transparent",
                color: sortKey === k ? "#e2e8f0" : "#64748b",
              }}>
              {k === "d1" ? "1D" : k === "ytd" ? "YTD" : "NAME"}
            </button>
          ))}
        </div>
      </div>

      {/* ── body ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── left: commodity grid ─────────────────────────── */}
        <div style={{
          width: 420, flexShrink: 0, overflowY: "auto", borderRight: "1px solid #1e293b",
          padding: 8,
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
          }}>
            {filtered.map((c, i) => {
              const isSel = i === selected;
              return (
                <div key={c.symbol} onClick={() => setSelected(i)}
                  style={{
                    padding: "10px 12px", borderRadius: 6, cursor: "pointer",
                    border: isSel ? "1px solid #00e5a0" : "1px solid #1e293b",
                    background: isSel ? "rgba(0,229,160,0.06)" : "var(--ag-surface, #111827)",
                    transition: "all 0.15s",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: isSel ? "#00e5a0" : "#e2e8f0", fontSize: 11 }}>
                      {c.symbol}
                    </span>
                    <span style={{ fontSize: 9, color: "#64748b" }}>{c.sector}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>{c.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                      {c.spot.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, ...chg(c.d1) }}>
                      {sign(c.d1)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 9, fontVariantNumeric: "tabular-nums" }}>
                    <span style={chg(c.w1)}>1W {sign(c.w1)}</span>
                    <span style={chg(c.m1)}>1M {sign(c.m1)}</span>
                    <span style={chg(c.ytd)}>YTD {sign(c.ytd)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── right: detail panel ──────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* selected commodity header */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #1e293b",
            display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#00e5a0" }}>{sel.symbol}</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{sel.name}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
              {sel.spot.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{sel.unit}</span>
            <span style={{ fontSize: 13, fontWeight: 600, ...chg(sel.d1) }}>{sign(sel.d1)}</span>
          </div>

          {/* tabs */}
          <div style={{
            display: "flex", gap: 0, borderBottom: "1px solid #1e293b", flexShrink: 0,
          }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  padding: "8px 18px", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
                  borderBottom: tab === t.key ? "2px solid #00e5a0" : "2px solid transparent",
                  background: "transparent",
                  color: tab === t.key ? "#00e5a0" : "#64748b",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

            {tab === "curve" && (
              <div>
                <FuturesCurveChart commodity={sel} />
                <div style={{
                  marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6,
                }}>
                  {sel.curve.map((v, i) => (
                    <div key={i} style={{
                      padding: "6px 10px", borderRadius: 4,
                      background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                      display: "flex", justifyContent: "space-between",
                    }}>
                      <span style={{ color: "#64748b", fontSize: 10 }}>{CURVE_LABELS[i]}</span>
                      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 11,
                        color: i === 0 ? "#00e5a0" : "#e2e8f0" }}>
                        {v.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "seasonal" && (
              <div>
                <div style={{ marginBottom: 8, color: "#64748b", fontSize: 11 }}>
                  Average Monthly Returns — {sel.name} (5yr avg)
                </div>
                <SeasonalChart seasonal={sel.seasonal} />
                <div style={{
                  marginTop: 12, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6,
                }}>
                  {sel.seasonal.map((v, i) => (
                    <div key={i} style={{
                      padding: "8px 6px", borderRadius: 4, textAlign: "center",
                      background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                    }}>
                      <div style={{ color: "#64748b", fontSize: 9, marginBottom: 2 }}>{MONTHS[i]}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, ...chg(v) }}>{sign(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "cot" && (
              <div>
                <div style={{ marginBottom: 8, color: "#64748b", fontSize: 11 }}>
                  CFTC Commitments of Traders — Net Positioning — {sel.name}
                </div>
                <COTChart commodity={sel} />
                <div style={{
                  marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
                }}>
                  {[
                    { label: "Commercial", val: sel.cotComm, color: "#3b82f6", desc: "Hedgers / Producers" },
                    { label: "Non-Commercial", val: sel.cotNonComm, color: "#00e5a0", desc: "Large Speculators" },
                    { label: "Speculative", val: sel.cotSpec, color: "#f59e0b", desc: "Managed Money" },
                  ].map(item => (
                    <div key={item.label} style={{
                      padding: 12, borderRadius: 6,
                      background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8" }}>{item.label}</span>
                      </div>
                      <div style={{
                        fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                        color: item.val >= 0 ? item.color : "#ef4444",
                      }}>
                        {item.val >= 0 ? "+" : ""}{fmt(item.val, 0)}
                      </div>
                      <div style={{ fontSize: 9, color: "#475569", marginTop: 4 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "inventory" && (
              <div>
                <div style={{ marginBottom: 12, color: "#64748b", fontSize: 11 }}>
                  Storage & Inventory Levels — {sel.name}
                </div>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16,
                }}>
                  <div style={{
                    padding: 16, borderRadius: 6,
                    background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                  }}>
                    <div style={{ color: "#64748b", fontSize: 10, marginBottom: 6 }}>CURRENT</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                      {sel.invCurrent.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{sel.invUnit}</div>
                  </div>
                  <div style={{
                    padding: 16, borderRadius: 6,
                    background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                  }}>
                    <div style={{ color: "#64748b", fontSize: 10, marginBottom: 6 }}>PREVIOUS</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
                      {sel.invPrev.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{sel.invUnit}</div>
                  </div>
                  <div style={{
                    padding: 16, borderRadius: 6,
                    background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                  }}>
                    <div style={{ color: "#64748b", fontSize: 10, marginBottom: 6 }}>CHANGE</div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", ...chg(invChg) }}>
                      {invChg > 0 ? "+" : ""}{invChg.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 10, ...chg(invPct) }}>{sign(invPct)}</div>
                  </div>
                </div>

                {/* inventory bar visualization */}
                <div style={{
                  padding: 16, borderRadius: 6,
                  background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#64748b" }}>UTILIZATION</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>
                      {((sel.invCurrent / (sel.invPrev * 1.15)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{
                    height: 16, borderRadius: 8, background: "#1e293b", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 8,
                      width: `${Math.min((sel.invCurrent / (sel.invPrev * 1.15)) * 100, 100)}%`,
                      background: invChg < 0
                        ? "linear-gradient(90deg, #00e5a0, #10b981)"
                        : "linear-gradient(90deg, #f59e0b, #ef4444)",
                      transition: "width 0.3s",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#475569" }}>
                    <span>0</span>
                    <span>5yr Avg: {(sel.invPrev * 1.02).toFixed(1)} {sel.invUnit}</span>
                    <span>Capacity Est.</span>
                  </div>
                </div>

                {/* key stats */}
                <div style={{
                  marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                }}>
                  {[
                    { label: "Days of Supply", value: (sel.invCurrent / (sel.spot * 0.12)).toFixed(1), unit: "days" },
                    { label: "Draw Rate (weekly)", value: invChg < 0 ? Math.abs(invChg).toFixed(1) : "Build", unit: invChg < 0 ? sel.invUnit : "" },
                    { label: "5yr Avg Inventory", value: (sel.invPrev * 1.02).toFixed(1), unit: sel.invUnit },
                    { label: "vs 5yr Avg", value: sign(((sel.invCurrent / (sel.invPrev * 1.02)) - 1) * 100), unit: "" },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      padding: "10px 12px", borderRadius: 4,
                      background: "var(--ag-surface, #111827)", border: "1px solid #1e293b",
                    }}>
                      <div style={{ fontSize: 9, color: "#64748b", marginBottom: 4 }}>{stat.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                        {stat.value} <span style={{ fontSize: 9, color: "#64748b", fontWeight: 400 }}>{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
