"use client";
import { useState } from "react";

/* ── EPFR / Bloomberg-tier Fund Flow Tracker ─────────────────── */

interface FlowData {
  fund: string;
  category: string;
  flow1w: number;
  flow1m: number;
  flow3m: number;
  flowYtd: number;
  aum: number;
  returnYtd: number;
}

const FLOW_DATA: FlowData[] = [
  { fund: "US Equity", category: "Equity", flow1w: 8420, flow1m: 32400, flow3m: 84200, flowYtd: 198400, aum: 12800000, returnYtd: 18.4 },
  { fund: "Europe Equity", category: "Equity", flow1w: -1240, flow1m: -4800, flow3m: 2400, flowYtd: -12400, aum: 2400000, returnYtd: 9.8 },
  { fund: "Japan Equity", category: "Equity", flow1w: 2140, flow1m: 8900, flow3m: 24200, flowYtd: 42000, aum: 980000, returnYtd: 22.4 },
  { fund: "EM Equity", category: "Equity", flow1w: -3420, flow1m: -12800, flow3m: -28400, flowYtd: -48200, aum: 1200000, returnYtd: 2.1 },
  { fund: "China Equity", category: "Equity", flow1w: -4800, flow1m: -18200, flow3m: -42000, flowYtd: -68400, aum: 680000, returnYtd: -8.4 },
  { fund: "US IG Credit", category: "Fixed Income", flow1w: 4200, flow1m: 18400, flow3m: 48200, flowYtd: 124000, aum: 4200000, returnYtd: 4.6 },
  { fund: "US HY Credit", category: "Fixed Income", flow1w: 1240, flow1m: 4800, flow3m: 12400, flowYtd: 28400, aum: 1800000, returnYtd: 8.2 },
  { fund: "EM Debt", category: "Fixed Income", flow1w: -890, flow1m: -2400, flow3m: -8400, flowYtd: -18200, aum: 480000, returnYtd: 1.8 },
  { fund: "Government Bond", category: "Fixed Income", flow1w: 6800, flow1m: 24200, flow3m: 68400, flowYtd: 148000, aum: 8400000, returnYtd: -2.4 },
  { fund: "Gold", category: "Commodity", flow1w: 2400, flow1m: 8400, flow3m: 24200, flowYtd: 42000, aum: 280000, returnYtd: 11.2 },
  { fund: "Crypto", category: "Alternative", flow1w: 6200, flow1m: 24800, flow3m: 68000, flowYtd: 124000, aum: 420000, returnYtd: 124.5 },
  { fund: "Real Estate", category: "Alternative", flow1w: -420, flow1m: -1800, flow3m: -4200, flowYtd: -8400, aum: 480000, returnYtd: -4.2 },
  { fund: "Money Market", category: "Cash", flow1w: 12400, flow1m: 48000, flow3m: 124000, flowYtd: 480000, aum: 6200000, returnYtd: 5.2 },
  { fund: "Leveraged Equity", category: "Alternative", flow1w: 1800, flow1m: 6400, flow3m: 18200, flowYtd: 42000, aum: 120000, returnYtd: 42.8 },
];

const CATEGORIES = ["All", "Equity", "Fixed Income", "Commodity", "Alternative", "Cash"];

function formatFlow(v: number): string {
  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}T`;
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}B`;
  return `${v.toFixed(0)}M`;
}

export default function FundFlowPanel() {
  const [category, setCategory] = useState("All");
  const [period, setPeriod] = useState<"1w" | "1m" | "3m" | "ytd">("1w");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filtered = category === "All" ? FLOW_DATA : FLOW_DATA.filter(f => f.category === category);
  const flowKey = period === "1w" ? "flow1w" : period === "1m" ? "flow1m" : period === "3m" ? "flow3m" : "flowYtd";
  const sorted = [...filtered].sort((a, b) => b[flowKey] - a[flowKey]);
  const maxFlow = Math.max(...sorted.map(f => Math.abs(f[flowKey])));
  const totalInflow = sorted.filter(f => f[flowKey] > 0).reduce((s, f) => s + f[flowKey], 0);
  const totalOutflow = sorted.filter(f => f[flowKey] < 0).reduce((s, f) => s + f[flowKey], 0);

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>GLOBAL FUND FLOW TRACKER</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>EPFR-Style Asset Class Flows</span>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            <div>Inflows: <span style={{ color: accent, fontWeight: 700 }}>${formatFlow(totalInflow)}</span></div>
            <div>Outflows: <span style={{ color: "#ff4d6a", fontWeight: 700 }}>${formatFlow(totalOutflow)}</span></div>
            <div>Net: <span style={{ color: totalInflow + totalOutflow >= 0 ? accent : "#ff4d6a", fontWeight: 700 }}>${formatFlow(totalInflow + totalOutflow)}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${category === c ? accent : border}`,
              background: category === c ? `${accent}18` : "transparent",
              color: category === c ? accent : textSecondary, cursor: "pointer"
            }}>{c}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {(["1w", "1m", "3m", "ytd"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "3px 8px", fontSize: 10, borderRadius: 4, textTransform: "uppercase",
                border: `1px solid ${period === p ? "#fbbf24" : border}`,
                background: period === p ? "#fbbf2418" : "transparent",
                color: period === p ? "#fbbf24" : textSecondary, cursor: "pointer"
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Flow Chart + Table */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {/* Horizontal bar chart */}
        <div style={{ marginBottom: 24 }}>
          {sorted.map(f => {
            const val = f[flowKey];
            const pct = (Math.abs(val) / maxFlow) * 100;
            return (
              <div key={f.fund} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 120, fontSize: 12, textAlign: "right", color: textSecondary }}>{f.fund}</div>
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  {val < 0 && (
                    <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ height: 18, width: `${pct}%`, background: "#ff4d6a", borderRadius: "4px 0 0 4px", minWidth: 4 }} />
                    </div>
                  )}
                  <div style={{ width: 2, height: 22, background: border }} />
                  {val >= 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 18, width: `${pct}%`, background: accent, borderRadius: "0 4px 4px 0", minWidth: 4 }} />
                    </div>
                  )}
                  {val < 0 && <div style={{ flex: 1 }} />}
                  {val >= 0 && <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} />}
                </div>
                <div style={{ width: 80, fontSize: 11, textAlign: "right", color: val >= 0 ? accent : "#ff4d6a", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {val >= 0 ? "+" : ""}{formatFlow(val)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["FUND", "CATEGORY", "1W FLOW", "1M FLOW", "3M FLOW", "YTD FLOW", "AUM", "YTD RTN"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: h === "FUND" || h === "CATEGORY" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, i) => (
              <tr key={f.fund} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                <td style={{ padding: "6px 10px", fontWeight: 700, borderBottom: `1px solid ${border}` }}>{f.fund}</td>
                <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 11 }}>{f.category}</td>
                {[f.flow1w, f.flow1m, f.flow3m, f.flowYtd].map((v, j) => (
                  <td key={j} style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: v >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                    {v >= 0 ? "+" : ""}{formatFlow(v)}
                  </td>
                ))}
                <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>${formatFlow(f.aum)}</td>
                <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: f.returnYtd >= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                  {f.returnYtd >= 0 ? "+" : ""}{f.returnYtd.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
