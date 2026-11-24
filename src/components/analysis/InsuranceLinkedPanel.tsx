"use client";
import { useState } from "react";

const TABS = ["Cat Bonds", "ILS Market", "Peril Analysis", "Reinsurance"] as const;

const CAT_BONDS = [
  { name: "Citrus Re 2024-1", sponsor: "Florida Citizens", peril: "US Hurricane", size: 400, coupon: 8.75, spread: 625, eloss: 2.84, maturity: "2027-06", rating: "BB" },
  { name: "Sakura Re 2024-2", sponsor: "Zenkyoren", peril: "JP Earthquake", size: 300, coupon: 4.25, spread: 275, eloss: 1.12, maturity: "2028-04", rating: "BB+" },
  { name: "Alamo Re 2024-1", sponsor: "USAA", peril: "US Multi-Peril", size: 500, coupon: 6.50, spread: 500, eloss: 2.15, maturity: "2027-01", rating: "BB" },
  { name: "Kibou Re 2024-1", sponsor: "Tokio Marine", peril: "JP Typhoon", size: 200, coupon: 3.75, spread: 225, eloss: 0.88, maturity: "2028-07", rating: "BBB-" },
  { name: "Golden State 2024", sponsor: "CEA", peril: "CA Earthquake", size: 350, coupon: 5.80, spread: 430, eloss: 1.95, maturity: "2027-12", rating: "BB" },
  { name: "Windmill Re III", sponsor: "Achmea", peril: "EU Wind", size: 250, coupon: 3.25, spread: 175, eloss: 0.65, maturity: "2028-03", rating: "BBB" },
];

const MARKET_STATS = { outstanding: "$47.2B", newIssuanceYTD: "$16.8B", avgSpread: "485bp", returnYTD: "14.2%" };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ background: color + "22", color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

function DemoBadge() {
  return <span style={{ background: "#f59e0b22", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, position: "absolute", top: 8, right: 8 }}>DEMO</span>;
}

export default function InsuranceLinkedPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Cat Bonds");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ag-bg, #0a0e17)", color: "var(--ag-text, #e2e8f0)", fontFamily: "monospace", fontSize: 12, position: "relative", overflow: "hidden" }}>
      <DemoBadge />
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b", padding: "0 8px" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e293b" : "transparent", color: tab === t ? "#00e5a0" : "#64748b", border: "none", padding: "8px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "monospace", borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent" }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color="#ef4444">ILS</Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {tab === "Cat Bonds" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {Object.entries(MARKET_STATS).map(([k, v]) => (
                <div key={k} style={{ background: "#111827", borderRadius: 6, padding: 10, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase" }}>{k.replace(/([A-Z])/g, " $1")}</div>
                  <div style={{ color: "#00e5a0", fontSize: 16, fontWeight: 700, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  {["Bond", "Peril", "Size ($M)", "Coupon", "Spread", "E(Loss)", "Rating"].map((h) => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAT_BONDS.map((b, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                    <td style={{ padding: "6px 8px" }}>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div style={{ color: "#64748b", fontSize: 10 }}>{b.sponsor}</div>
                    </td>
                    <td style={{ padding: "6px 8px" }}><Badge color={b.peril.includes("Hurricane") ? "#ef4444" : b.peril.includes("Earthquake") ? "#f59e0b" : "#38bdf8"}>{b.peril}</Badge></td>
                    <td style={{ padding: "6px 8px" }}>{b.size}</td>
                    <td style={{ padding: "6px 8px" }}>{b.coupon.toFixed(2)}%</td>
                    <td style={{ padding: "6px 8px" }}>{b.spread}bp</td>
                    <td style={{ padding: "6px 8px", color: b.eloss > 2 ? "#ef4444" : "#f59e0b" }}>{b.eloss.toFixed(2)}%</td>
                    <td style={{ padding: "6px 8px" }}><Badge color={b.rating.startsWith("BBB") ? "#00e5a0" : "#f59e0b"}>{b.rating}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "ILS Market" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>ILS Market Growth ($B Outstanding)</div>
              <svg viewBox="0 0 400 150" style={{ width: "100%", height: 140 }}>
                {[10, 20, 30, 40, 50].map((v, i) => (<g key={i}><line x1="30" y1={140 - v * 2.6} x2="380" y2={140 - v * 2.6} stroke="#1e293b" /><text x="26" y={144 - v * 2.6} fill="#64748b" fontSize="8" textAnchor="end">{v}</text></g>))}
                {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map((y, i) => (<text key={i} x={50 + i * 50} y="155" fill="#64748b" fontSize="8" textAnchor="middle">{y}</text>))}
                {[28, 32, 30, 35, 38, 42, 47].map((v, i) => (<rect key={i} x={40 + i * 50} y={140 - v * 2.6} width="20" height={v * 2.6} fill="#6366f1" fillOpacity="0.7" rx="2" />))}
              </svg>
            </div>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>Issuance by Peril Type</div>
              {[
                { peril: "US Hurricane", pct: 42, color: "#ef4444" },
                { peril: "US Earthquake", pct: 18, color: "#f59e0b" },
                { peril: "JP Earthquake", pct: 14, color: "#38bdf8" },
                { peril: "EU Windstorm", pct: 10, color: "#22c55e" },
                { peril: "Multi-Peril", pct: 12, color: "#a855f7" },
                { peril: "Other", pct: 4, color: "#64748b" },
              ].map((p) => (
                <div key={p.peril} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 100, fontSize: 10, color: "#94a3b8" }}>{p.peril}</div>
                  <div style={{ flex: 1, height: 10, background: "#1e293b", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 30, textAlign: "right", fontSize: 10, color: p.color }}>{p.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Peril Analysis" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { peril: "US Named Storm", aal: 42.5, oep250: 285, pml500: 380, season: "Jun-Nov", trend: "Increasing" },
              { peril: "JP Earthquake", aal: 18.2, oep250: 165, pml500: 240, season: "Any", trend: "Stable" },
              { peril: "CA Earthquake", aal: 12.8, oep250: 120, pml500: 195, season: "Any", trend: "Stable" },
              { peril: "EU Windstorm", aal: 8.4, oep250: 65, pml500: 95, season: "Oct-Mar", trend: "Increasing" },
              { peril: "AU Cyclone", aal: 3.2, oep250: 28, pml500: 42, season: "Nov-Apr", trend: "Stable" },
            ].map((p, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{p.peril}</div>
                  <Badge color={p.trend === "Increasing" ? "#ef4444" : "#00e5a0"}>{p.trend}</Badge>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 10 }}>
                  <div><span style={{ color: "#64748b" }}>AAL</span><br /><span style={{ fontWeight: 600 }}>${p.aal}B</span></div>
                  <div><span style={{ color: "#64748b" }}>OEP 1/250</span><br /><span style={{ fontWeight: 600, color: "#f59e0b" }}>${p.oep250}B</span></div>
                  <div><span style={{ color: "#64748b" }}>PML 1/500</span><br /><span style={{ fontWeight: 600, color: "#ef4444" }}>${p.pml500}B</span></div>
                  <div><span style={{ color: "#64748b" }}>Season</span><br /><span style={{ fontWeight: 600 }}>{p.season}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Reinsurance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[{ label: "Global Reinsurance Capital", value: "$695B", color: "#00e5a0" }, { label: "1/1 ROL Change", value: "+22%", color: "#ef4444" }, { label: "Combined Ratio", value: "95.4%", color: "#f59e0b" }].map((s) => (
                <div key={s.label} style={{ background: "#111827", borderRadius: 6, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
            {[
              { company: "Munich Re", premium: 42.8, combined: 94.2, reserve: 185, rating: "AA-" },
              { company: "Swiss Re", premium: 38.5, combined: 96.1, reserve: 162, rating: "AA-" },
              { company: "Hannover Re", premium: 28.4, combined: 93.8, reserve: 95, rating: "AA-" },
              { company: "SCOR", premium: 18.2, combined: 97.5, reserve: 48, rating: "A+" },
              { company: "RenaissanceRe", premium: 8.9, combined: 88.4, reserve: 32, rating: "A+" },
            ].map((c, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.company}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>GWP: ${c.premium}B | Reserves: ${c.reserve}B</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: c.combined < 95 ? "#00e5a0" : "#f59e0b", fontWeight: 700 }}>{c.combined}%</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>Combined</div>
                  </div>
                  <Badge color="#6366f1">{c.rating}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
