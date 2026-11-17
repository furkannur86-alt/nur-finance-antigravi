"use client";
import { useState, useMemo } from "react";

/* ── Bloomberg MA<GO> / DEAL — Private Equity & M&A Monitor ──── */

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const txt2 = "#94a3b8";
const green = "#00e5a0";
const red = "#ff4d6a";
const amber = "#fbbf24";

type Tab = "deals" | "arb" | "pe" | "league";

interface Deal {
  acquirer: string;
  target: string;
  value: number;
  premium: number;
  type: "Merger" | "Acquisition" | "LBO" | "SPAC";
  status: "Pending" | "Completed" | "Withdrawn";
  closeDate: string;
  payment: "Cash" | "Stock" | "Mixed";
  sector: string;
}

const DEALS: Deal[] = [
  { acquirer: "Broadcom Inc", target: "VMware Inc", value: 69.0, premium: 44.2, type: "Acquisition", status: "Completed", closeDate: "2024-11-22", payment: "Mixed", sector: "Technology" },
  { acquirer: "Microsoft Corp", target: "Activision Blizzard", value: 68.7, premium: 45.0, type: "Acquisition", status: "Completed", closeDate: "2024-10-13", payment: "Cash", sector: "Technology" },
  { acquirer: "Exxon Mobil", target: "Pioneer Natural", value: 59.5, premium: 18.4, type: "Merger", status: "Completed", closeDate: "2024-05-03", payment: "Stock", sector: "Energy" },
  { acquirer: "Capital One", target: "Discover Financial", value: 35.3, premium: 26.6, type: "Merger", status: "Pending", closeDate: "2025-Q1", payment: "Stock", sector: "Financials" },
  { acquirer: "Synopsys Inc", target: "Ansys Inc", value: 35.0, premium: 29.1, type: "Acquisition", status: "Pending", closeDate: "2025-H1", payment: "Mixed", sector: "Technology" },
  { acquirer: "Apollo / Silver Lake", target: "Endeavor Group", value: 13.0, premium: 52.8, type: "LBO", status: "Completed", closeDate: "2024-10-28", payment: "Cash", sector: "Media" },
  { acquirer: "Blackstone", target: "Tropical Smoothie", value: 2.0, premium: 32.0, type: "LBO", status: "Pending", closeDate: "2025-Q2", payment: "Cash", sector: "Consumer" },
  { acquirer: "Mars Inc", target: "Kellanova", value: 35.9, premium: 33.0, type: "Acquisition", status: "Pending", closeDate: "2025-H1", payment: "Cash", sector: "Consumer" },
  { acquirer: "Nippon Steel", target: "US Steel", value: 14.9, premium: 40.1, type: "Acquisition", status: "Pending", closeDate: "2025-Q2", payment: "Cash", sector: "Materials" },
  { acquirer: "CoStar Group", target: "Matterport Inc", value: 5.8, premium: 212.0, type: "Acquisition", status: "Completed", closeDate: "2024-04-22", payment: "Stock", sector: "Technology" },
  { acquirer: "Churchill Capital VII", target: "Ares Management SPAC", value: 3.4, premium: 15.0, type: "SPAC", status: "Pending", closeDate: "2025-Q1", payment: "Mixed", sector: "Financials" },
  { acquirer: "KKR & Co", target: "April Group (France)", value: 4.7, premium: 24.5, type: "LBO", status: "Completed", closeDate: "2024-09-15", payment: "Cash", sector: "Insurance" },
];

interface ArbSpread {
  target: string;
  ticker: string;
  current: number;
  dealPrice: number;
  spread: number;
  annualized: number;
  daysToClose: number;
  risk: "Low" | "Medium" | "High";
}

const ARB_SPREADS: ArbSpread[] = [
  { target: "Discover Financial", ticker: "DFS", current: 138.42, dealPrice: 148.26, spread: 7.11, annualized: 14.2, daysToClose: 183, risk: "Medium" },
  { target: "Ansys Inc", ticker: "ANSS", current: 342.18, dealPrice: 390.00, spread: 13.98, annualized: 22.4, daysToClose: 228, risk: "Medium" },
  { target: "US Steel", ticker: "X", current: 38.72, dealPrice: 55.00, spread: 42.04, annualized: 68.9, daysToClose: 223, risk: "High" },
  { target: "Kellanova", ticker: "K", current: 78.56, dealPrice: 83.50, spread: 6.29, annualized: 15.7, daysToClose: 146, risk: "Low" },
  { target: "Tropical Smoothie", ticker: "PRIV", current: 0, dealPrice: 0, spread: 0, annualized: 0, daysToClose: 210, risk: "Low" },
  { target: "Ares SPAC Target", ticker: "CVII", current: 10.12, dealPrice: 10.50, spread: 3.75, annualized: 9.1, daysToClose: 150, risk: "Medium" },
].filter(a => a.current > 0);

interface PEFund {
  name: string;
  vintage: number;
  size: number;
  irr: number;
  moic: number;
  dpi: number;
  tvpi: number;
  strategy: "Buyout" | "Growth" | "VC" | "Infra" | "Credit";
}

const PE_FUNDS: PEFund[] = [
  { name: "Blackstone Capital Partners IX", vintage: 2023, size: 30.4, irr: 18.2, moic: 1.42, dpi: 0.12, tvpi: 1.42, strategy: "Buyout" },
  { name: "KKR Americas Fund XIII", vintage: 2022, size: 18.5, irr: 22.4, moic: 1.68, dpi: 0.34, tvpi: 1.68, strategy: "Buyout" },
  { name: "Apollo Investment Fund X", vintage: 2022, size: 20.0, irr: 16.8, moic: 1.52, dpi: 0.28, tvpi: 1.52, strategy: "Buyout" },
  { name: "Thoma Bravo Fund XVI", vintage: 2023, size: 24.3, irr: 24.1, moic: 1.38, dpi: 0.08, tvpi: 1.38, strategy: "Growth" },
  { name: "Warburg Pincus XIV", vintage: 2022, size: 16.2, irr: 19.6, moic: 1.74, dpi: 0.42, tvpi: 1.74, strategy: "Growth" },
  { name: "Andreessen Horowitz Fund VII", vintage: 2023, size: 4.5, irr: 28.4, moic: 1.24, dpi: 0.02, tvpi: 1.24, strategy: "VC" },
  { name: "Sequoia Capital Fund XXII", vintage: 2022, size: 2.8, irr: 32.1, moic: 2.14, dpi: 0.56, tvpi: 2.14, strategy: "VC" },
  { name: "Brookfield Infra Fund V", vintage: 2023, size: 28.0, irr: 14.2, moic: 1.18, dpi: 0.06, tvpi: 1.18, strategy: "Infra" },
  { name: "Ares Capital Corp VI", vintage: 2022, size: 10.2, irr: 12.8, moic: 1.34, dpi: 0.48, tvpi: 1.34, strategy: "Credit" },
  { name: "Carlyle Partners VIII", vintage: 2022, size: 22.0, irr: 17.4, moic: 1.56, dpi: 0.32, tvpi: 1.56, strategy: "Buyout" },
];

interface LeagueRow {
  rank: number;
  bank: string;
  deals: number;
  value: number;
  share: number;
}

const LEAGUE: LeagueRow[] = [
  { rank: 1, bank: "Goldman Sachs", deals: 284, value: 892.4, share: 18.2 },
  { rank: 2, bank: "JPMorgan Chase", deals: 268, value: 845.1, share: 17.2 },
  { rank: 3, bank: "Morgan Stanley", deals: 241, value: 724.8, share: 14.8 },
  { rank: 4, bank: "Bank of America", deals: 198, value: 598.2, share: 12.2 },
  { rank: 5, bank: "Citigroup", deals: 176, value: 489.6, share: 10.0 },
  { rank: 6, bank: "Barclays", deals: 142, value: 378.4, share: 7.7 },
  { rank: 7, bank: "Deutsche Bank", deals: 118, value: 312.8, share: 6.4 },
  { rank: 8, bank: "UBS", deals: 104, value: 278.9, share: 5.7 },
  { rank: 9, bank: "Lazard", deals: 156, value: 198.4, share: 4.0 },
  { rank: 10, bank: "Evercore", deals: 128, value: 182.6, share: 3.7 },
];

const MONTHLY_VOL = [42.3, 38.7, 56.2, 48.9, 62.1, 44.8, 71.4, 58.2, 65.8, 52.4, 48.1, 39.6];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatusBadge({ status }: { status: Deal["status"] }) {
  const c = status === "Completed" ? green : status === "Pending" ? amber : red;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: `${c}18`, color: c, border: `1px solid ${c}40`, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: Deal["type"] }) {
  const colors: Record<string, string> = { Merger: "#38bdf8", Acquisition: "#a78bfa", LBO: "#f59e0b", SPAC: "#e879f9" };
  const c = colors[type] ?? txt2;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: `${c}14`, color: c, border: `1px solid ${c}30` }}>
      {type}
    </span>
  );
}

function RiskBadge({ risk }: { risk: ArbSpread["risk"] }) {
  const c = risk === "Low" ? green : risk === "Medium" ? amber : red;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: `${c}18`, color: c, border: `1px solid ${c}40` }}>
      {risk}
    </span>
  );
}

function StratBadge({ s }: { s: PEFund["strategy"] }) {
  const colors: Record<string, string> = { Buyout: "#38bdf8", Growth: green, VC: "#e879f9", Infra: "#f59e0b", Credit: "#a78bfa" };
  const c = colors[s] ?? txt2;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: `${c}14`, color: c, border: `1px solid ${c}30` }}>
      {s}
    </span>
  );
}

function KPITile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "14px 16px", flex: "1 1 0" }}>
      <div style={{ fontSize: 10, color: txt2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: txt2, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MonthlyVolumeChart() {
  const max = Math.max(...MONTHLY_VOL);
  const w = 480, h = 140, pad = { t: 10, b: 20, l: 40, r: 10 };
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
  const bw = cw / MONTHLY_VOL.length - 4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 140 }}>
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = pad.t + ch * (1 - f);
        return <g key={f}>
          <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke={border} strokeWidth={0.5} />
          <text x={pad.l - 4} y={y + 3} fill={txt2} fontSize={9} textAnchor="end" fontFamily="monospace">{(max * f).toFixed(0)}</text>
        </g>;
      })}
      {MONTHLY_VOL.map((v, i) => {
        const x = pad.l + (cw / MONTHLY_VOL.length) * i + 2;
        const bh = (v / max) * ch;
        const y = pad.t + ch - bh;
        return <g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx={2} fill={accent} opacity={0.7} />
          <text x={x + bw / 2} y={h - 4} fill={txt2} fontSize={8} textAnchor="middle" fontFamily="monospace">{MONTHS[i]}</text>
        </g>;
      })}
    </svg>
  );
}

export default function PEAndMAPanel() {
  const [tab, setTab] = useState<Tab>("deals");
  const [dealFilter, setDealFilter] = useState<"All" | Deal["status"]>("All");
  const [peStrat, setPeStrat] = useState<"All" | PEFund["strategy"]>("All");

  const filteredDeals = useMemo(() =>
    dealFilter === "All" ? DEALS : DEALS.filter(d => d.status === dealFilter)
  , [dealFilter]);

  const filteredPE = useMemo(() =>
    peStrat === "All" ? PE_FUNDS : PE_FUNDS.filter(f => f.strategy === peStrat)
  , [peStrat]);

  const totalVol = DEALS.reduce((s, d) => s + d.value, 0);
  const avgPremium = DEALS.reduce((s, d) => s + d.premium, 0) / DEALS.length;
  const avgSize = totalVol / DEALS.length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "deals", label: "M&A DEALS" },
    { key: "arb", label: "MERGER ARB" },
    { key: "pe", label: "PE FUNDS" },
    { key: "league", label: "LEAGUE TABLES" },
  ];

  const thStyle = (align: "left" | "right" | "center" = "left"): React.CSSProperties => ({
    padding: "8px 10px", textAlign: align, borderBottom: `2px solid ${accent}`, color: accent,
    fontSize: 10, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap", textTransform: "uppercase",
  });
  const tdStyle = (align: "left" | "right" | "center" = "left"): React.CSSProperties => ({
    padding: "7px 10px", textAlign: align, borderBottom: `1px solid ${border}`, fontSize: 12,
    fontVariantNumeric: "tabular-nums",
  });

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>M&A / PRIVATE EQUITY MONITOR</span>
          <span style={{ color: txt2, fontSize: 11 }}>MA&lt;GO&gt; // DEAL&lt;GO&gt;</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "4px 12px", fontSize: 10, fontWeight: 700, borderRadius: 4,
              border: `1px solid ${tab === t.key ? accent : border}`,
              background: tab === t.key ? `${accent}18` : "transparent",
              color: tab === t.key ? accent : txt2, cursor: "pointer", letterSpacing: 0.5,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── DEALS TAB ── */}
      {tab === "deals" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* KPIs + Chart */}
          <div style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 10, flex: "1 1 50%", minWidth: 300 }}>
              <KPITile label="Total Deal Volume YTD" value={`$${totalVol.toFixed(1)}B`} sub={`${DEALS.length} transactions`} />
              <KPITile label="# Deals Tracked" value={String(DEALS.length)} sub="Global M&A" />
              <KPITile label="Avg Premium" value={`${avgPremium.toFixed(1)}%`} sub="to undisturbed price" />
              <KPITile label="Avg Deal Size" value={`$${avgSize.toFixed(1)}B`} />
            </div>
            <div style={{ flex: "1 1 40%", minWidth: 300, background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ fontSize: 10, color: txt2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Monthly Deal Volume ($B)</div>
              <MonthlyVolumeChart />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}` }}>
            {(["All", "Pending", "Completed", "Withdrawn"] as const).map(f => (
              <button key={f} onClick={() => setDealFilter(f)} style={{
                padding: "3px 10px", fontSize: 10, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${dealFilter === f ? accent : border}`,
                background: dealFilter === f ? `${accent}18` : "transparent",
                color: dealFilter === f ? accent : txt2, cursor: "pointer",
              }}>{f}</button>
            ))}
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={thStyle()}>Acquirer</th>
                  <th style={thStyle()}>Target</th>
                  <th style={thStyle("right")}>Value</th>
                  <th style={thStyle("right")}>Premium</th>
                  <th style={thStyle("center")}>Type</th>
                  <th style={thStyle("center")}>Status</th>
                  <th style={thStyle("center")}>Payment</th>
                  <th style={thStyle()}>Close</th>
                  <th style={thStyle()}>Sector</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((d, i) => (
                  <tr key={i} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                    <td style={{ ...tdStyle(), fontWeight: 600, color: txt }}>{d.acquirer}</td>
                    <td style={{ ...tdStyle(), color: amber }}>{d.target}</td>
                    <td style={{ ...tdStyle("right"), fontWeight: 700 }}>${d.value.toFixed(1)}B</td>
                    <td style={{ ...tdStyle("right"), color: d.premium > 30 ? green : txt }}>{d.premium.toFixed(1)}%</td>
                    <td style={{ ...tdStyle("center") }}><TypeBadge type={d.type} /></td>
                    <td style={{ ...tdStyle("center") }}><StatusBadge status={d.status} /></td>
                    <td style={{ ...tdStyle("center"), color: txt2, fontSize: 11 }}>{d.payment}</td>
                    <td style={{ ...tdStyle(), color: txt2, fontSize: 11 }}>{d.closeDate}</td>
                    <td style={{ ...tdStyle(), color: txt2, fontSize: 11 }}>{d.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MERGER ARB TAB ── */}
      {tab === "arb" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>MERGER ARBITRAGE SPREAD MONITOR</div>
          <div style={{ color: txt2, fontSize: 11, marginBottom: 16 }}>Pending deals — spread vs deal price, annualized return, risk assessment</div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle()}>Target</th>
                <th style={thStyle("center")}>Ticker</th>
                <th style={thStyle("right")}>Current</th>
                <th style={thStyle("right")}>Deal Price</th>
                <th style={thStyle("right")}>Spread</th>
                <th style={thStyle("right")}>Ann. Return</th>
                <th style={thStyle("right")}>Days</th>
                <th style={thStyle("center")}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {ARB_SPREADS.map((a, i) => (
                <tr key={i} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                  <td style={{ ...tdStyle(), fontWeight: 600 }}>{a.target}</td>
                  <td style={{ ...tdStyle("center"), color: amber, fontWeight: 700 }}>{a.ticker}</td>
                  <td style={tdStyle("right")}>${a.current.toFixed(2)}</td>
                  <td style={tdStyle("right")}>${a.dealPrice.toFixed(2)}</td>
                  <td style={{ ...tdStyle("right"), color: green, fontWeight: 700 }}>{a.spread.toFixed(2)}%</td>
                  <td style={{ ...tdStyle("right"), color: a.annualized > 20 ? amber : green, fontWeight: 700 }}>{a.annualized.toFixed(1)}%</td>
                  <td style={{ ...tdStyle("right"), color: txt2 }}>{a.daysToClose}</td>
                  <td style={{ ...tdStyle("center") }}><RiskBadge risk={a.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary strip */}
          <div style={{ display: "flex", gap: 16, marginTop: 16, padding: "10px 14px", background: surface, border: `1px solid ${border}`, borderRadius: 6, fontSize: 11 }}>
            <div><span style={{ color: txt2 }}>Avg Spread:</span> <span style={{ color: green, fontWeight: 700 }}>{(ARB_SPREADS.reduce((s, a) => s + a.spread, 0) / ARB_SPREADS.length).toFixed(2)}%</span></div>
            <div><span style={{ color: txt2 }}>Avg Ann. Return:</span> <span style={{ color: green, fontWeight: 700 }}>{(ARB_SPREADS.reduce((s, a) => s + a.annualized, 0) / ARB_SPREADS.length).toFixed(1)}%</span></div>
            <div><span style={{ color: txt2 }}>Deals Tracked:</span> <span style={{ color: accent }}>{ARB_SPREADS.length}</span></div>
            <div style={{ marginLeft: "auto", color: txt2 }}>DEMO — Live merger arb requires NUR Finance B</div>
          </div>
        </div>
      )}

      {/* ── PE FUNDS TAB ── */}
      {tab === "pe" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ color: accent, fontWeight: 700, fontSize: 14 }}>PRIVATE EQUITY FUND PERFORMANCE</div>
              <div style={{ color: txt2, fontSize: 11 }}>Net IRR, MOIC, DPI & TVPI across strategies</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["All", "Buyout", "Growth", "VC", "Infra", "Credit"] as const).map(s => (
                <button key={s} onClick={() => setPeStrat(s)} style={{
                  padding: "3px 10px", fontSize: 10, fontWeight: 600, borderRadius: 4,
                  border: `1px solid ${peStrat === s ? accent : border}`,
                  background: peStrat === s ? `${accent}18` : "transparent",
                  color: peStrat === s ? accent : txt2, cursor: "pointer",
                }}>{s}</button>
              ))}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle()}>Fund Name</th>
                <th style={thStyle("center")}>Vintage</th>
                <th style={thStyle("right")}>Size ($B)</th>
                <th style={thStyle("right")}>Net IRR</th>
                <th style={thStyle("right")}>MOIC</th>
                <th style={thStyle("right")}>DPI</th>
                <th style={thStyle("right")}>TVPI</th>
                <th style={thStyle("center")}>Strategy</th>
              </tr>
            </thead>
            <tbody>
              {filteredPE.map((f, i) => (
                <tr key={i} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                  <td style={{ ...tdStyle(), fontWeight: 600, fontSize: 11 }}>{f.name}</td>
                  <td style={{ ...tdStyle("center"), color: txt2 }}>{f.vintage}</td>
                  <td style={tdStyle("right")}>${f.size.toFixed(1)}B</td>
                  <td style={{ ...tdStyle("right"), color: f.irr > 20 ? green : f.irr > 15 ? amber : txt, fontWeight: 700 }}>{f.irr.toFixed(1)}%</td>
                  <td style={{ ...tdStyle("right"), color: f.moic > 1.5 ? green : txt, fontWeight: 600 }}>{f.moic.toFixed(2)}x</td>
                  <td style={{ ...tdStyle("right"), color: txt2 }}>{f.dpi.toFixed(2)}x</td>
                  <td style={{ ...tdStyle("right"), fontWeight: 600 }}>{f.tvpi.toFixed(2)}x</td>
                  <td style={{ ...tdStyle("center") }}><StratBadge s={f.strategy} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── LEAGUE TABLES TAB ── */}
      {tab === "league" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>GLOBAL M&A ADVISORY LEAGUE TABLES</div>
          <div style={{ color: txt2, fontSize: 11, marginBottom: 16 }}>YTD rankings by announced deal value — All sectors, worldwide</div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle("center")}>#</th>
                <th style={thStyle()}>Bank</th>
                <th style={thStyle("right")}># Deals</th>
                <th style={thStyle("right")}>Total Value ($B)</th>
                <th style={thStyle("right")}>Mkt Share</th>
                <th style={{ ...thStyle(), width: "30%" }}>Share Bar</th>
              </tr>
            </thead>
            <tbody>
              {LEAGUE.map((l, i) => {
                const maxShare = LEAGUE[0].share;
                return (
                  <tr key={i} style={{ background: i % 2 ? `${surface}50` : "transparent" }}>
                    <td style={{ ...tdStyle("center"), fontWeight: 700, color: i < 3 ? amber : txt2 }}>{l.rank}</td>
                    <td style={{ ...tdStyle(), fontWeight: 700, color: i < 3 ? txt : txt2 }}>{l.bank}</td>
                    <td style={tdStyle("right")}>{l.deals}</td>
                    <td style={{ ...tdStyle("right"), fontWeight: 700 }}>${l.value.toFixed(1)}B</td>
                    <td style={{ ...tdStyle("right"), color: green, fontWeight: 700 }}>{l.share.toFixed(1)}%</td>
                    <td style={tdStyle()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 10, background: `${border}`, borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ width: `${(l.share / maxShare) * 100}%`, height: "100%", background: i < 3 ? accent : `${accent}80`, borderRadius: 5, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <KPITile label="Total Advised Value" value={`$${(LEAGUE.reduce((s, l) => s + l.value, 0) / 1000).toFixed(2)}T`} sub="Top 10 banks" />
            <KPITile label="Total Transactions" value={String(LEAGUE.reduce((s, l) => s + l.deals, 0))} sub="YTD advisory mandates" />
            <KPITile label="Top 3 Concentration" value={`${(LEAGUE.slice(0, 3).reduce((s, l) => s + l.share, 0)).toFixed(1)}%`} sub="GS + JPM + MS" />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 10, color: txt2 }}>
        <span>Source: NUR FINANCE SOVEREIGN INTELLIGENCE | DEMO MODE</span>
        <span>Bloomberg MA&lt;GO&gt; / DEAL&lt;GO&gt; equivalent — Requires NUR Finance B</span>
      </div>
    </div>
  );
}
