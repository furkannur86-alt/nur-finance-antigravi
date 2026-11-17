"use client";
import { useState } from "react";

const bg = "#0a0e17", surface = "#111827", border = "#1e293b", accent = "#00e5a0";
const txt = "#e2e8f0", txtDim = "#94a3b8", red = "#ff4d6a", green = "#00e5a0";
const yellow = "#fbbf24", blue = "#38bdf8", purple = "#a855f7", teal = "#2dd4bf";

type Tab = "surface" | "skew" | "term" | "greeks" | "history";

const STRIKES = [80, 85, 90, 95, 97.5, 100, 102.5, 105, 110, 115, 120];
const TENORS = ["1W", "1M", "2M", "3M", "6M", "1Y", "2Y"];
const SURFACE: number[][] = [
  [42, 38, 33, 28, 25, 22, 21, 22, 25, 30, 36],
  [38, 34, 29, 24, 22, 19, 18, 19, 22, 27, 33],
  [36, 32, 27, 22, 20, 17, 16, 17, 20, 25, 31],
  [34, 30, 25, 21, 19, 16, 15, 16, 19, 24, 29],
  [32, 28, 24, 20, 18, 15, 14, 15, 18, 22, 27],
  [30, 27, 23, 19, 17, 15, 14, 15, 17, 21, 25],
  [28, 25, 22, 18, 16, 14, 14, 14, 16, 20, 24],
];

function volColor(v: number): string {
  if (v < 16) return `${green}60`;
  if (v < 20) return `${teal}50`;
  if (v < 25) return `${blue}40`;
  if (v < 30) return `${yellow}50`;
  if (v < 35) return "#f9731650";
  return `${red}50`;
}

const SKEW_DATA = {
  "1M": STRIKES.map((s, i) => ({ strike: s, iv: [38, 34, 29, 24, 22, 19, 18, 19, 22, 27, 33][i] })),
  "3M": STRIKES.map((s, i) => ({ strike: s, iv: [34, 30, 25, 21, 19, 16, 15, 16, 19, 24, 29][i] })),
  "6M": STRIKES.map((s, i) => ({ strike: s, iv: [32, 28, 24, 20, 18, 15, 14, 15, 18, 22, 27][i] })),
};

const TERM_DATA: { name: string; color: string; vols: number[] }[] = [
  { name: "SPX", color: accent, vols: [22, 19, 17, 16, 15, 15, 14] },
  { name: "NDX", color: blue, vols: [26, 23, 21, 19, 18, 17, 16] },
  { name: "RUT", color: yellow, vols: [28, 25, 23, 21, 20, 19, 18] },
  { name: "VIX", color: red, vols: [85, 72, 65, 58, 52, 48, 45] },
  { name: "VSTOXX", color: purple, vols: [24, 21, 19, 18, 17, 16, 15] },
];

const GREEKS_STRIKES = [95, 97.5, 100, 102.5, 105];
const GREEKS_EXPIRIES = ["1W", "1M", "3M", "6M"];
const GREEKS: Record<string, number[][]> = {
  delta: [[0.82, 0.68, 0.50, 0.32, 0.18], [0.74, 0.62, 0.50, 0.38, 0.26], [0.68, 0.58, 0.50, 0.42, 0.32], [0.64, 0.56, 0.50, 0.44, 0.36]],
  gamma: [[0.08, 0.12, 0.15, 0.12, 0.08], [0.04, 0.06, 0.08, 0.06, 0.04], [0.02, 0.03, 0.04, 0.03, 0.02], [0.01, 0.02, 0.03, 0.02, 0.01]],
  vega: [[0.04, 0.06, 0.08, 0.06, 0.04], [0.08, 0.12, 0.15, 0.12, 0.08], [0.14, 0.18, 0.22, 0.18, 0.14], [0.18, 0.24, 0.28, 0.24, 0.18]],
  theta: [[-0.12, -0.18, -0.22, -0.18, -0.12], [-0.06, -0.08, -0.10, -0.08, -0.06], [-0.03, -0.04, -0.05, -0.04, -0.03], [-0.02, -0.02, -0.03, -0.02, -0.02]],
};

const HIST_DATA = [
  { asset: "S&P 500", rv1m: 14.2, iv1m: 19.0, rv3m: 15.8, iv3m: 16.5, rv1y: 17.1, iv1y: 14.8 },
  { asset: "NASDAQ", rv1m: 18.4, iv1m: 23.0, rv3m: 19.2, iv3m: 21.0, rv1y: 21.3, iv1y: 18.2 },
  { asset: "Russell 2000", rv1m: 20.1, iv1m: 25.0, rv3m: 21.8, iv3m: 23.0, rv1y: 23.6, iv1y: 20.0 },
  { asset: "EUR/USD", rv1m: 6.8, iv1m: 8.2, rv3m: 7.2, iv3m: 7.8, rv1y: 7.8, iv1y: 7.0 },
  { asset: "Gold", rv1m: 12.4, iv1m: 15.0, rv3m: 13.1, iv3m: 14.2, rv1y: 14.2, iv1y: 13.0 },
  { asset: "Crude Oil", rv1m: 28.4, iv1m: 32.0, rv3m: 30.2, iv3m: 31.5, rv1y: 32.5, iv1y: 29.5 },
  { asset: "10Y Treasury", rv1m: 5.2, iv1m: 6.8, rv3m: 5.8, iv3m: 6.2, rv1y: 6.4, iv1y: 5.5 },
  { asset: "Bitcoin", rv1m: 48.2, iv1m: 55.0, rv3m: 52.4, iv3m: 54.0, rv1y: 58.2, iv1y: 50.0 },
];

export default function VolatilitySurfacePanel() {
  const [tab, setTab] = useState<Tab>("surface");
  const [greekType, setGreekType] = useState("delta");

  const tabs: { id: Tab; label: string }[] = [
    { id: "surface", label: "SURFACE" }, { id: "skew", label: "SKEW" },
    { id: "term", label: "TERM STRUCT" }, { id: "greeks", label: "GREEKS" }, { id: "history", label: "HISTORY" },
  ];

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>VOLATILITY SURFACE</span>
          <span style={{ color: txtDim, fontSize: 11 }}>OVDV // SKEW // VCURVE</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
          <span>VIX <span style={{ color: yellow, fontWeight: 700 }}>19.42</span></span>
          <span>VVIX <span style={{ color: blue, fontWeight: 700 }}>92.8</span></span>
          <span>Skew <span style={{ color: red, fontWeight: 700 }}>-4.2</span></span>
          <span>VRP <span style={{ color: green, fontWeight: 700 }}>+3.8</span></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "8px 16px", borderBottom: `1px solid ${border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 600, borderRadius: 4,
            border: `1px solid ${tab === t.id ? accent : border}`,
            background: tab === t.id ? `${accent}18` : "transparent",
            color: tab === t.id ? accent : txtDim, cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {tab === "surface" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 4 }}>IMPLIED VOLATILITY SURFACE — SPX</div>
            <div style={{ fontSize: 10, color: txtDim, marginBottom: 12 }}>Strike Moneyness (%) x Tenor | Values in % annualized</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "6px 10px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>TENOR ↓ / STRIKE →</th>
                    {STRIKES.map(s => (
                      <th key={s} style={{ padding: "6px 10px", textAlign: "center", borderBottom: `2px solid ${accent}`, color: s === 100 ? yellow : accent, fontSize: 11, fontWeight: s === 100 ? 800 : 600 }}>{s}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TENORS.map((t, ri) => (
                    <tr key={t}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, color: blue, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{t}</td>
                      {SURFACE[ri].map((v, ci) => (
                        <td key={ci} style={{
                          padding: "6px 10px", textAlign: "center", borderBottom: `1px solid ${border}`,
                          background: volColor(v), color: txt, fontWeight: ci === 5 ? 700 : 400, fontSize: 12,
                          fontVariantNumeric: "tabular-nums",
                        }}>{v.toFixed(1)}%</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, fontSize: 10, color: txtDim }}>
              <span style={{ padding: "2px 8px", background: `${green}60`, borderRadius: 3 }}>&lt;16%</span>
              <span style={{ padding: "2px 8px", background: `${teal}50`, borderRadius: 3 }}>16-20%</span>
              <span style={{ padding: "2px 8px", background: `${blue}40`, borderRadius: 3 }}>20-25%</span>
              <span style={{ padding: "2px 8px", background: `${yellow}50`, borderRadius: 3 }}>25-30%</span>
              <span style={{ padding: "2px 8px", background: `${red}50`, borderRadius: 3 }}>&gt;30%</span>
            </div>
          </>
        )}

        {tab === "skew" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 12 }}>VOLATILITY SKEW — SPX</div>
            <svg viewBox="0 0 600 300" style={{ width: "100%", maxWidth: 700, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
              <line x1="60" y1="20" x2="60" y2="260" stroke={border} />
              <line x1="60" y1="260" x2="580" y2="260" stroke={border} />
              {[10, 15, 20, 25, 30, 35, 40].map(v => (
                <g key={v}>
                  <line x1="55" y1={260 - ((v - 10) / 30) * 240} x2="580" y2={260 - ((v - 10) / 30) * 240} stroke={border} strokeDasharray="3,3" />
                  <text x="50" y={264 - ((v - 10) / 30) * 240} fill={txtDim} fontSize="10" textAnchor="end">{v}%</text>
                </g>
              ))}
              {STRIKES.map((s, i) => (
                <text key={s} x={60 + (i / (STRIKES.length - 1)) * 520} y="278" fill={txtDim} fontSize="9" textAnchor="middle">{s}%</text>
              ))}
              {(Object.entries(SKEW_DATA) as [string, { strike: number; iv: number }[]][]).map(([label, data], li) => {
                const colors = [blue, yellow, red];
                const pts = data.map((d, i) => `${60 + (i / (data.length - 1)) * 520},${260 - ((d.iv - 10) / 30) * 240}`).join(" ");
                return (
                  <g key={label}>
                    <polyline points={pts} fill="none" stroke={colors[li]} strokeWidth="2" />
                    {data.map((d, i) => (
                      <circle key={i} cx={60 + (i / (data.length - 1)) * 520} cy={260 - ((d.iv - 10) / 30) * 240} r="3" fill={colors[li]} />
                    ))}
                    <text x="540" y={260 - ((data[data.length - 1].iv - 10) / 30) * 240 - 6} fill={colors[li]} fontSize="10" fontWeight="600">{label}</text>
                  </g>
                );
              })}
            </svg>
          </>
        )}

        {tab === "term" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 12 }}>ATM VOL TERM STRUCTURE</div>
            <svg viewBox="0 0 600 300" style={{ width: "100%", maxWidth: 700, background: surface, borderRadius: 8, border: `1px solid ${border}` }}>
              <line x1="60" y1="20" x2="60" y2="260" stroke={border} />
              <line x1="60" y1="260" x2="580" y2="260" stroke={border} />
              {TENORS.map((t, i) => (
                <text key={t} x={60 + (i / (TENORS.length - 1)) * 520} y="278" fill={txtDim} fontSize="9" textAnchor="middle">{t}</text>
              ))}
              {TERM_DATA.filter(d => d.name !== "VIX").map(d => {
                const pts = d.vols.map((v, i) => `${60 + (i / (TENORS.length - 1)) * 520},${260 - ((v - 12) / 20) * 240}`).join(" ");
                return (
                  <g key={d.name}>
                    <polyline points={pts} fill="none" stroke={d.color} strokeWidth="2" />
                    <text x="545" y={260 - ((d.vols[d.vols.length - 1] - 12) / 20) * 240 + 4} fill={d.color} fontSize="10" fontWeight="600">{d.name}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {TERM_DATA.map(d => (
                <div key={d.name} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "8px 12px" }}>
                  <div style={{ fontSize: 11, color: d.color, fontWeight: 700 }}>{d.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
                    <span style={{ color: txtDim }}>1M ATM</span>
                    <span style={{ fontWeight: 600 }}>{d.vols[1]}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                    <span style={{ color: txtDim }}>Slope</span>
                    <span style={{ color: d.vols[6] < d.vols[0] ? green : red, fontWeight: 600 }}>
                      {d.vols[6] < d.vols[0] ? "Inverted" : "Contango"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "greeks" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>GREEKS HEATMAP — SPX CALL</span>
              <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
                {["delta", "gamma", "vega", "theta"].map(g => (
                  <button key={g} onClick={() => setGreekType(g)} style={{
                    padding: "3px 10px", fontSize: 11, borderRadius: 4, textTransform: "uppercase",
                    border: `1px solid ${greekType === g ? accent : border}`,
                    background: greekType === g ? `${accent}18` : "transparent",
                    color: greekType === g ? accent : txtDim, cursor: "pointer", fontWeight: 600,
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 10px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>EXPIRY ↓ / STRIKE →</th>
                  {GREEKS_STRIKES.map(s => (
                    <th key={s} style={{ padding: "6px 10px", textAlign: "center", borderBottom: `2px solid ${accent}`, color: s === 100 ? yellow : accent, fontSize: 11 }}>{s}%</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GREEKS_EXPIRIES.map((e, ri) => (
                  <tr key={e}>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: blue, borderBottom: `1px solid ${border}` }}>{e}</td>
                    {GREEKS[greekType][ri].map((v, ci) => {
                      const absV = Math.abs(v);
                      const maxV = greekType === "delta" ? 1 : greekType === "gamma" ? 0.15 : greekType === "vega" ? 0.3 : 0.25;
                      const intensity = Math.min(absV / maxV, 1);
                      const c = greekType === "theta" ? red : accent;
                      return (
                        <td key={ci} style={{
                          padding: "8px 10px", textAlign: "center", borderBottom: `1px solid ${border}`,
                          background: `${c}${Math.round(intensity * 40).toString(16).padStart(2, "0")}`,
                          fontVariantNumeric: "tabular-nums", fontSize: 13, fontWeight: 600,
                          color: intensity > 0.5 ? txt : txtDim,
                        }}>{v.toFixed(greekType === "delta" ? 2 : 3)}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "history" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 4 }}>HISTORICAL vs IMPLIED VOLATILITY</div>
            <div style={{ fontSize: 10, color: txtDim, marginBottom: 12 }}>RV = Realized | IV = Implied | VRP = Vol Risk Premium (IV - RV)</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 10px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>ASSET</th>
                  {["1M RV", "1M IV", "VRP", "3M RV", "3M IV", "VRP", "1Y RV", "1Y IV", "VRP"].map(h => (
                    <th key={h} style={{ padding: "6px 10px", textAlign: "right", borderBottom: `2px solid ${accent}`, color: h === "VRP" ? yellow : accent, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HIST_DATA.map((d, i) => {
                  const vrp1m = d.iv1m - d.rv1m;
                  const vrp3m = d.iv3m - d.rv3m;
                  const vrp1y = d.iv1y - d.rv1y;
                  return (
                    <tr key={d.asset} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                      <td style={{ padding: "6px 10px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{d.asset}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.rv1m.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.iv1m.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: vrp1m > 0 ? green : red, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                        {vrp1m > 0 ? "+" : ""}{vrp1m.toFixed(1)}
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.rv3m.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.iv3m.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: vrp3m > 0 ? green : red, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                        {vrp3m > 0 ? "+" : ""}{vrp3m.toFixed(1)}
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.rv1y.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{d.iv1y.toFixed(1)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: vrp1y > 0 ? green : red, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                        {vrp1y > 0 ? "+" : ""}{vrp1y.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 10, color: txtDim }}>
        <span>NUR VOL TERMINAL v2.0 — {tab.toUpperCase()}</span>
        <span>DEMO MODE — Live data requires NUR Finance B subscription</span>
      </div>
    </div>
  );
}
