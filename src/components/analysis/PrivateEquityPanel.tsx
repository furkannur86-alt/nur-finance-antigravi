"use client";
import { useState } from "react";

const TABS = ["Fund Overview", "Deal Pipeline", "Portfolio", "Performance"] as const;

const FUNDS = [
  { name: "NUR Growth Equity I", vintage: 2021, size: 850, invested: 72, irr: 28.4, tvpi: 1.82, dpi: 0.34, strategy: "Growth", sector: "Tech" },
  { name: "NUR Buyout III", vintage: 2020, size: 2200, invested: 91, irr: 18.7, tvpi: 1.65, dpi: 0.72, strategy: "Buyout", sector: "Multi" },
  { name: "NUR Infra Fund II", vintage: 2022, size: 1500, invested: 48, irr: 14.2, tvpi: 1.28, dpi: 0.12, strategy: "Infra", sector: "Energy" },
  { name: "NUR Secondaries I", vintage: 2023, size: 600, invested: 25, irr: 22.1, tvpi: 1.15, dpi: 0.0, strategy: "Secondary", sector: "Multi" },
];

const DEALS = [
  { company: "QuantumAI Labs", stage: "Due Diligence", amount: 45, ev: 320, sector: "AI/ML", lead: "NUR Growth", status: "active" },
  { company: "GreenHydro Corp", stage: "Term Sheet", amount: 80, ev: 540, sector: "CleanTech", lead: "NUR Infra", status: "active" },
  { company: "FinSecure Inc", stage: "Closed", amount: 35, ev: 180, sector: "FinTech", lead: "NUR Growth", status: "closed" },
  { company: "DataMesh Systems", stage: "Screening", amount: 25, ev: 150, sector: "Enterprise", lead: "NUR Buyout", status: "pipeline" },
  { company: "BioSync Health", stage: "IC Review", amount: 60, ev: 400, sector: "HealthTech", lead: "NUR Growth", status: "active" },
  { company: "LogiChain AI", stage: "Closed", amount: 40, ev: 220, sector: "Supply Chain", lead: "NUR Buyout", status: "closed" },
];

const PORTFOLIO = [
  { company: "Nebula Cloud", invested: 30, currentVal: 85, moic: 2.83, sector: "Cloud", year: 2021, status: "Growing" },
  { company: "CyberVault", invested: 25, currentVal: 62, moic: 2.48, sector: "Security", year: 2022, status: "Growing" },
  { company: "MedAI Diagnostics", invested: 40, currentVal: 44, moic: 1.10, sector: "HealthTech", year: 2023, status: "Flat" },
  { company: "TerraScale Energy", invested: 55, currentVal: 120, moic: 2.18, sector: "Energy", year: 2020, status: "Exiting" },
  { company: "PayFlow", invested: 20, currentVal: 8, moic: 0.40, sector: "Payments", year: 2022, status: "Write-down" },
  { company: "RoboFarm", invested: 35, currentVal: 78, moic: 2.23, sector: "AgTech", year: 2021, status: "Growing" },
];

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ background: color + "22", color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{children}</span>;
}

function DemoBadge() {
  return <span style={{ background: "#f59e0b22", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, position: "absolute", top: 8, right: 8 }}>DEMO</span>;
}

export default function PrivateEquityPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Fund Overview");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ag-bg, #0a0e17)", color: "var(--ag-text, #e2e8f0)", fontFamily: "monospace", fontSize: 12, position: "relative", overflow: "hidden" }}>
      <DemoBadge />
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b", padding: "0 8px" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e293b" : "transparent", color: tab === t ? "#00e5a0" : "#64748b", border: "none", padding: "8px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "monospace", borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent" }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color="#a855f7">PRIVATE EQUITY</Badge>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {tab === "Fund Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FUNDS.map((f, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{f.name}</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>Vintage {f.vintage} | {f.strategy} | {f.sector}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#00e5a0", fontWeight: 700, fontSize: 16 }}>{f.irr.toFixed(1)}%</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>Net IRR</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  <div><span style={{ color: "#64748b", fontSize: 10 }}>Size</span><br /><span style={{ fontWeight: 600 }}>${f.size}M</span></div>
                  <div><span style={{ color: "#64748b", fontSize: 10 }}>Invested</span><br /><span style={{ fontWeight: 600 }}>{f.invested}%</span></div>
                  <div><span style={{ color: "#64748b", fontSize: 10 }}>TVPI</span><br /><span style={{ fontWeight: 600, color: f.tvpi > 1.5 ? "#00e5a0" : "#f59e0b" }}>{f.tvpi.toFixed(2)}x</span></div>
                  <div><span style={{ color: "#64748b", fontSize: 10 }}>DPI</span><br /><span style={{ fontWeight: 600 }}>{f.dpi.toFixed(2)}x</span></div>
                </div>
                <div style={{ marginTop: 8, height: 6, background: "#1e293b", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${f.invested}%`, background: "linear-gradient(90deg, #6366f1, #00e5a0)", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Deal Pipeline" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Company", "Stage", "Amount", "EV", "Sector", "Lead", "Status"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEALS.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{d.company}</td>
                  <td style={{ padding: "6px 8px" }}>{d.stage}</td>
                  <td style={{ padding: "6px 8px" }}>${d.amount}M</td>
                  <td style={{ padding: "6px 8px" }}>${d.ev}M</td>
                  <td style={{ padding: "6px 8px" }}><Badge color="#38bdf8">{d.sector}</Badge></td>
                  <td style={{ padding: "6px 8px", color: "#94a3b8" }}>{d.lead}</td>
                  <td style={{ padding: "6px 8px" }}>
                    <Badge color={d.status === "closed" ? "#00e5a0" : d.status === "active" ? "#f59e0b" : "#64748b"}>
                      {d.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Portfolio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PORTFOLIO.map((p, i) => (
              <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.company} <span style={{ color: "#64748b", fontSize: 10 }}>({p.sector}, {p.year})</span></div>
                  <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Invested: ${p.invested}M → Current: ${p.currentVal}M</div>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ color: p.moic >= 2 ? "#00e5a0" : p.moic >= 1 ? "#f59e0b" : "#ef4444", fontWeight: 700, fontSize: 16 }}>{p.moic.toFixed(2)}x</div>
                    <div style={{ color: "#64748b", fontSize: 10 }}>MOIC</div>
                  </div>
                  <Badge color={p.status === "Growing" ? "#00e5a0" : p.status === "Exiting" ? "#6366f1" : p.status === "Write-down" ? "#ef4444" : "#64748b"}>
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Performance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#111827", borderRadius: 6, padding: 12 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>J-Curve (Net Cash Flow)</div>
              <svg viewBox="0 0 400 180" style={{ width: "100%", height: 160 }}>
                <line x1="40" y1="90" x2="380" y2="90" stroke="#1e293b" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((y) => (<text key={y} x={40 + y * 48} y="175" fill="#64748b" fontSize="8" textAnchor="middle">Y{y}</text>))}
                <polyline points="40,90 88,120 136,140 184,145 232,130 280,100 328,70 376,45" fill="none" stroke="#6366f1" strokeWidth="2" />
                <text x="40" y="12" fill="#64748b" fontSize="9">+</text>
                <text x="40" y="168" fill="#64748b" fontSize="9">-</text>
              </svg>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[{ label: "Pooled IRR", value: "21.3%", color: "#00e5a0" }, { label: "Avg TVPI", value: "1.48x", color: "#6366f1" }, { label: "Total Committed", value: "$5.15B", color: "#f59e0b" }].map((s) => (
                <div key={s.label} style={{ background: "#111827", borderRadius: 6, padding: 12, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
