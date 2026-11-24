"use client";
import { useState } from "react";

const TABS = ["Markets", "Compliance", "Voluntary", "Analytics"] as const;

const MARKETS = [
  { name: "EU ETS (EUA)", price: 68.42, change: 1.24, volume: "24.3M", ytd: 12.8, type: "Compliance" },
  { name: "UK ETS (UKA)", price: 42.15, change: -0.87, volume: "3.1M", ytd: -5.2, type: "Compliance" },
  { name: "California CCA", price: 35.80, change: 0.45, volume: "8.7M", ytd: 8.4, type: "Compliance" },
  { name: "RGGI (US NE)", price: 14.20, change: 0.12, volume: "2.8M", ytd: 3.1, type: "Compliance" },
  { name: "China ETS", price: 9.85, change: 0.32, volume: "15.2M", ytd: 22.5, type: "Compliance" },
  { name: "Verra VCS", price: 8.50, change: -0.15, volume: "1.2M", ytd: -18.4, type: "Voluntary" },
  { name: "Gold Standard", price: 12.30, change: 0.08, volume: "0.8M", ytd: -12.1, type: "Voluntary" },
  { name: "ACCU (Australia)", price: 28.90, change: -0.65, volume: "1.5M", ytd: 6.2, type: "Compliance" },
];

const SECTORS = [
  { sector: "Power Generation", coverage: 85, allocated: 1200, used: 1080, surplus: 120 },
  { sector: "Industrial", coverage: 72, allocated: 800, used: 720, surplus: 80 },
  { sector: "Aviation", coverage: 45, allocated: 350, used: 380, surplus: -30 },
  { sector: "Shipping", coverage: 30, allocated: 200, used: 165, surplus: 35 },
  { sector: "Agriculture", coverage: 15, allocated: 100, used: 88, surplus: 12 },
];

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ background: color + "22", color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

function DemoBadge() {
  return <span style={{ background: "#f59e0b22", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, position: "absolute", top: 8, right: 8 }}>DEMO</span>;
}

export default function CarbonCreditPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Markets");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ag-bg, #0a0e17)", color: "var(--ag-text, #e2e8f0)", fontFamily: "monospace", fontSize: 12, position: "relative", overflow: "hidden" }}>
      <DemoBadge />
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b", padding: "0 8px" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e293b" : "transparent", color: tab === t ? "#00e5a0" : "#64748b", border: "none", padding: "8px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "monospace", borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent" }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color="#22c55e">CARBON</Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {tab === "Markets" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Market", "Price (€)", "Change", "Volume", "YTD", "Type"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARKETS.map((m, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: "6px 8px" }}>€{m.price.toFixed(2)}</td>
                  <td style={{ padding: "6px 8px", color: m.change >= 0 ? "#00e5a0" : "#ef4444" }}>{m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}</td>
                  <td style={{ padding: "6px 8px", color: "#94a3b8" }}>{m.volume} tCO₂</td>
                  <td style={{ padding: "6px 8px", color: m.ytd >= 0 ? "#00e5a0" : "#ef4444" }}>{m.ytd >= 0 ? "+" : ""}{m.ytd.toFixed(1)}%</td>
                  <td style={{ padding: "6px 8px" }}><Badge color={m.type === "Compliance" ? "#6366f1" : "#f59e0b"}>{m.type}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Compliance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>EU ETS Price History (€/tCO₂)</div>
              <svg viewBox="0 0 400 150" style={{ width: "100%", height: 140 }}>
                {[20, 40, 60, 80].map((v, i) => (<g key={i}><line x1="30" y1={140 - v * 1.5} x2="390" y2={140 - v * 1.5} stroke="#1e293b" /><text x="26" y={144 - v * 1.5} fill="#64748b" fontSize="8" textAnchor="end">{v}</text></g>))}
                <polyline points="30,110 60,105 90,98 120,88 150,75 180,68 210,72 240,65 270,58 300,52 330,48 360,42 390,38" fill="none" stroke="#22c55e" strokeWidth="2" />
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D", ""].map((m, i) => (<text key={i} x={30 + i * 30} y="155" fill="#64748b" fontSize="7" textAnchor="middle">{m}</text>))}
              </svg>
            </div>
            {SECTORS.map((s, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{s.sector}</div>
                  <Badge color={s.surplus >= 0 ? "#00e5a0" : "#ef4444"}>{s.surplus >= 0 ? `+${s.surplus}` : s.surplus} MtCO₂</Badge>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 10, color: "#94a3b8" }}>
                  <span>Coverage: {s.coverage}%</span>
                  <span>Allocated: {s.allocated} MtCO₂</span>
                  <span>Used: {s.used} MtCO₂</span>
                </div>
                <div style={{ marginTop: 6, height: 4, background: "#1e293b", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${Math.min((s.used / s.allocated) * 100, 100)}%`, background: s.surplus >= 0 ? "#22c55e" : "#ef4444", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Voluntary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { project: "Amazon Rainforest REDD+", type: "Avoided Deforestation", vintage: 2023, credits: "2.4M", price: 8.50, registry: "Verra", rating: "A" },
              { project: "India Wind Farm", type: "Renewable Energy", vintage: 2024, credits: "850K", price: 6.20, registry: "Gold Standard", rating: "AA" },
              { project: "Kenya Cookstoves", type: "Energy Efficiency", vintage: 2023, credits: "320K", price: 14.80, registry: "Gold Standard", rating: "AAA" },
              { project: "Mangrove Restoration", type: "Blue Carbon", vintage: 2024, credits: "180K", price: 22.40, registry: "Verra", rating: "AA" },
              { project: "US Landfill Methane", type: "Methane Capture", vintage: 2023, credits: "1.1M", price: 5.90, registry: "ACR", rating: "A" },
            ].map((p, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.project}</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>{p.type} | Vintage {p.vintage} | {p.registry}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#00e5a0", fontWeight: 700 }}>${p.price.toFixed(2)}/tCO₂</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>{p.credits} issued</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge color="#22c55e">{p.rating}</Badge>
                  <Badge color="#6366f1">{p.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[{ label: "Global Carbon Market", value: "$909B", color: "#00e5a0" }, { label: "EUA 2030 Forecast", value: "€120–150", color: "#6366f1" }, { label: "Voluntary Market", value: "$2.1B", color: "#f59e0b" }].map((s) => (
                <div key={s.label} style={{ background: "#111827", borderRadius: 6, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>Global ETS Coverage by Region</div>
              {[
                { region: "EU", coverage: 40, color: "#6366f1" },
                { region: "China", coverage: 30, color: "#ef4444" },
                { region: "North America", coverage: 25, color: "#00e5a0" },
                { region: "Asia-Pacific", coverage: 15, color: "#f59e0b" },
                { region: "Rest of World", coverage: 8, color: "#94a3b8" },
              ].map((r) => (
                <div key={r.region} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 100, fontSize: 10, color: "#94a3b8" }}>{r.region}</div>
                  <div style={{ flex: 1, height: 12, background: "#1e293b", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${r.coverage}%`, background: r.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 35, textAlign: "right", fontSize: 10, color: r.color }}>{r.coverage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
