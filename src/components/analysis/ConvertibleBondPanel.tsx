"use client";
import { useState } from "react";

const TABS = ["Overview", "Pricing", "Greeks", "Screening"] as const;

const BONDS = [
  { issuer: "Tesla Inc", coupon: 2.0, maturity: "2027-05-15", convPrice: 285.0, parity: 92.4, premium: 18.2, delta: 0.54, gamma: 0.012, yield: 3.1, rating: "BB+", outstanding: 1800 },
  { issuer: "Airbnb Inc", coupon: 0.0, maturity: "2026-03-15", convPrice: 198.5, parity: 105.3, premium: 8.4, delta: 0.72, gamma: 0.008, yield: 1.2, rating: "BBB-", outstanding: 2000 },
  { issuer: "Shopify Inc", coupon: 0.125, maturity: "2025-11-01", convPrice: 155.0, parity: 88.7, premium: 22.6, delta: 0.41, gamma: 0.015, yield: 4.5, rating: "BB", outstanding: 950 },
  { issuer: "MicroStrategy", coupon: 0.75, maturity: "2028-12-15", convPrice: 630.0, parity: 72.1, premium: 38.9, delta: 0.28, gamma: 0.006, yield: 6.8, rating: "B+", outstanding: 3400 },
  { issuer: "Palo Alto Networks", coupon: 0.375, maturity: "2025-06-01", convPrice: 345.0, parity: 97.8, premium: 12.1, delta: 0.65, gamma: 0.010, yield: 2.0, rating: "BBB", outstanding: 1500 },
  { issuer: "Lam Research", coupon: 1.25, maturity: "2029-03-15", convPrice: 710.0, parity: 84.2, premium: 25.4, delta: 0.38, gamma: 0.009, yield: 3.9, rating: "A-", outstanding: 800 },
  { issuer: "ON Semiconductor", coupon: 0.5, maturity: "2027-09-01", convPrice: 92.0, parity: 110.5, premium: 5.2, delta: 0.82, gamma: 0.005, yield: 0.8, rating: "BBB-", outstanding: 1200 },
  { issuer: "Western Digital", coupon: 3.0, maturity: "2028-06-15", convPrice: 58.0, parity: 76.3, premium: 31.1, delta: 0.33, gamma: 0.014, yield: 5.6, rating: "B", outstanding: 1100 },
];

const MARKET_STATS = { totalOutstanding: "$298B", newIssuanceYTD: "$42.1B", avgPremium: "21.3%", avgDelta: "0.48" };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ background: color + "22", color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

function DemoBadge() {
  return <span style={{ background: "#f59e0b22", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, position: "absolute", top: 8, right: 8 }}>DEMO</span>;
}

export default function ConvertibleBondPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ag-bg, #0a0e17)", color: "var(--ag-text, #e2e8f0)", fontFamily: "monospace", fontSize: 12, position: "relative", overflow: "hidden" }}>
      <DemoBadge />
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b", padding: "0 8px" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e293b" : "transparent", color: tab === t ? "#00e5a0" : "#64748b", border: "none", padding: "8px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "monospace", borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent" }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color="#6366f1">CONVERTIBLES</Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {tab === "Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {Object.entries(MARKET_STATS).map(([k, v]) => (
                <div key={k} style={{ background: "#111827", borderRadius: 6, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", marginBottom: 4 }}>{k.replace(/([A-Z])/g, " $1")}</div>
                  <div style={{ color: "#00e5a0", fontSize: 18, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>Premium vs Delta Scatter</div>
              <svg viewBox="0 0 400 200" style={{ width: "100%", height: 180 }}>
                <rect x="40" y="10" width="350" height="170" fill="#0a0e17" rx="4" />
                {[0, 25, 50].map((v, i) => (<g key={i}><line x1="40" y1={180 - v * 3.4} x2="390" y2={180 - v * 3.4} stroke="#1e293b" /><text x="35" y={184 - v * 3.4} fill="#64748b" fontSize="9" textAnchor="end">{v}%</text></g>))}
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (<text key={i} x={40 + v * 350} y="196" fill="#64748b" fontSize="9" textAnchor="middle">{v.toFixed(2)}</text>))}
                {BONDS.map((b, i) => (<circle key={i} cx={40 + b.delta * 350} cy={180 - b.premium * 3.4} r={Math.sqrt(b.outstanding / 100)} fill="#6366f1" fillOpacity="0.7"><title>{b.issuer}: Delta={b.delta}, Premium={b.premium}%</title></circle>))}
                <text x="215" y="10" fill="#64748b" fontSize="9" textAnchor="middle">Delta</text>
              </svg>
            </div>
          </div>
        )}

        {tab === "Pricing" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Issuer", "Coupon", "Maturity", "Conv Px", "Parity", "Premium", "Yield", "Rating"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BONDS.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{b.issuer}</td>
                  <td style={{ padding: "6px 8px" }}>{b.coupon.toFixed(3)}%</td>
                  <td style={{ padding: "6px 8px", color: "#94a3b8" }}>{b.maturity}</td>
                  <td style={{ padding: "6px 8px" }}>${b.convPrice.toFixed(2)}</td>
                  <td style={{ padding: "6px 8px", color: b.parity >= 100 ? "#00e5a0" : "#f59e0b" }}>{b.parity.toFixed(1)}</td>
                  <td style={{ padding: "6px 8px" }}>{b.premium.toFixed(1)}%</td>
                  <td style={{ padding: "6px 8px", color: b.yield > 5 ? "#ef4444" : "#00e5a0" }}>{b.yield.toFixed(2)}%</td>
                  <td style={{ padding: "6px 8px" }}><Badge color={b.rating.startsWith("A") ? "#00e5a0" : b.rating.startsWith("BB") ? "#f59e0b" : "#ef4444"}>{b.rating}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Greeks" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Issuer", "Delta", "Gamma", "Vega", "Theta", "Rho"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BONDS.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{b.issuer}</td>
                  <td style={{ padding: "6px 8px", color: b.delta > 0.6 ? "#00e5a0" : "#f59e0b" }}>{b.delta.toFixed(3)}</td>
                  <td style={{ padding: "6px 8px" }}>{b.gamma.toFixed(4)}</td>
                  <td style={{ padding: "6px 8px" }}>{(b.gamma * 1200 + 5).toFixed(1)}</td>
                  <td style={{ padding: "6px 8px", color: "#ef4444" }}>-{(b.coupon * 0.8 + 0.02).toFixed(3)}</td>
                  <td style={{ padding: "6px 8px" }}>{(b.delta * 0.15).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Screening" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>Busted Converts (Parity &lt; 80%)</div>
            {BONDS.filter((b) => b.parity < 80).map((b, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.issuer}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>Parity: {b.parity.toFixed(1)} | Yield: {b.yield.toFixed(2)}% | Rating: {b.rating}</div>
                </div>
                <Badge color="#ef4444">BUSTED</Badge>
              </div>
            ))}
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 8 }}>In-the-Money (Parity &gt; 100%)</div>
            {BONDS.filter((b) => b.parity >= 100).map((b, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.issuer}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>Parity: {b.parity.toFixed(1)} | Delta: {b.delta.toFixed(2)} | Premium: {b.premium.toFixed(1)}%</div>
                </div>
                <Badge color="#00e5a0">ITM</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
