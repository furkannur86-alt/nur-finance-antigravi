"use client";

import { useState } from "react";
import DemoBadge from "../ui/DemoBadge";

/* ── Types ─────────────────────────────────────────────────────── */
type Tab = "filings" | "insider" | "holdings" | "earnings" | "ipo";

interface Filing {
  company: string; ticker: string; type: string; date: string;
  description: string; size: string;
}
interface InsiderTrade {
  insider: string; title: string; company: string; ticker: string;
  txType: "Buy" | "Sell"; shares: number; price: number; value: number; date: string;
}
interface Holding {
  holder: string; shares: number; value: number; pctPortfolio: number;
  changeQoQ: number; filingDate: string;
}
interface EarningsEntry {
  company: string; ticker: string; date: string; time: "BMO" | "AMC";
  estEPS: number; prevEPS: number; surprise: number | null;
}
interface IPOEntry {
  company: string; ticker: string; date: string; priceRange: string;
  dealSize: string; exchange: string; underwriters: string;
}

/* ── Demo Data ─────────────────────────────────────────────────── */
const FILINGS: Filing[] = [
  { company: "NVIDIA Corp", ticker: "NVDA", type: "10-K", date: "2026-11-14", description: "Annual report for fiscal year ended Oct 2026", size: "14.2 MB" },
  { company: "Apple Inc", ticker: "AAPL", type: "10-Q", date: "2026-11-13", description: "Quarterly report for Q4 2026", size: "8.7 MB" },
  { company: "Tesla Inc", ticker: "TSLA", type: "8-K", date: "2026-11-13", description: "Current report — CEO succession plan announcement", size: "0.3 MB" },
  { company: "JPMorgan Chase", ticker: "JPM", type: "DEF 14A", date: "2026-11-12", description: "Definitive proxy statement — annual meeting", size: "5.1 MB" },
  { company: "Berkshire Hathaway", ticker: "BRK.A", type: "13F", date: "2026-11-11", description: "Institutional holdings report Q3 2026", size: "1.8 MB" },
  { company: "Microsoft Corp", ticker: "MSFT", type: "10-Q", date: "2026-11-11", description: "Quarterly report for Q1 FY2027", size: "9.4 MB" },
  { company: "Amazon.com Inc", ticker: "AMZN", type: "8-K", date: "2026-11-10", description: "Current report — AWS pricing restructure", size: "0.5 MB" },
  { company: "Meta Platforms", ticker: "META", type: "10-K", date: "2026-11-09", description: "Annual report for fiscal year 2026", size: "16.3 MB" },
  { company: "Alphabet Inc", ticker: "GOOGL", type: "8-K", date: "2026-11-08", description: "Current report — Waymo spin-off completion", size: "0.4 MB" },
  { company: "Goldman Sachs", ticker: "GS", type: "13F", date: "2026-11-08", description: "Institutional holdings report Q3 2026", size: "3.2 MB" },
  { company: "Palantir Technologies", ticker: "PLTR", type: "10-Q", date: "2026-11-07", description: "Quarterly report Q3 2026", size: "6.1 MB" },
  { company: "Broadcom Inc", ticker: "AVGO", type: "DEF 14A", date: "2026-11-06", description: "Definitive proxy — special shareholder meeting", size: "4.8 MB" },
  { company: "Citadel Advisors", ticker: "—", type: "13F", date: "2026-11-05", description: "Institutional holdings report Q3 2026", size: "12.7 MB" },
  { company: "Coinbase Global", ticker: "COIN", type: "8-K", date: "2026-11-04", description: "Current report — international expansion update", size: "0.6 MB" },
  { company: "UnitedHealth Group", ticker: "UNH", type: "10-K", date: "2026-11-03", description: "Annual report for fiscal year 2026", size: "18.9 MB" },
];

const INSIDER_TRADES: InsiderTrade[] = [
  { insider: "Jensen Huang", title: "CEO", company: "NVIDIA", ticker: "NVDA", txType: "Sell", shares: 120_000, price: 148.20, value: 17_784_000, date: "2026-11-14" },
  { insider: "Tim Cook", title: "CEO", company: "Apple", ticker: "AAPL", txType: "Sell", shares: 75_000, price: 234.50, value: 17_587_500, date: "2026-11-13" },
  { insider: "Satya Nadella", title: "CEO", company: "Microsoft", ticker: "MSFT", txType: "Sell", shares: 50_000, price: 445.30, value: 22_265_000, date: "2026-11-12" },
  { insider: "Jamie Dimon", title: "CEO", company: "JPMorgan", ticker: "JPM", txType: "Sell", shares: 150_000, price: 218.40, value: 32_760_000, date: "2026-11-11" },
  { insider: "Lisa Su", title: "CEO", company: "AMD", ticker: "AMD", txType: "Buy", shares: 25_000, price: 189.70, value: 4_742_500, date: "2026-11-10" },
  { insider: "Mary Barra", title: "CEO", company: "General Motors", ticker: "GM", txType: "Buy", shares: 40_000, price: 52.80, value: 2_112_000, date: "2026-11-09" },
  { insider: "Andy Jassy", title: "CEO", company: "Amazon", ticker: "AMZN", txType: "Sell", shares: 30_000, price: 210.60, value: 6_318_000, date: "2026-11-08" },
  { insider: "Elon Musk", title: "CEO", company: "Tesla", ticker: "TSLA", txType: "Sell", shares: 500_000, price: 312.90, value: 156_450_000, date: "2026-11-07" },
  { insider: "Warren Buffett", title: "CEO", company: "Berkshire", ticker: "BRK.A", txType: "Buy", shares: 200, price: 685_400, value: 137_080_000, date: "2026-11-06" },
  { insider: "Mark Zuckerberg", title: "CEO", company: "Meta", ticker: "META", txType: "Sell", shares: 200_000, price: 582.30, value: 116_460_000, date: "2026-11-05" },
  { insider: "Brian Moynihan", title: "CEO", company: "Bank of America", ticker: "BAC", txType: "Buy", shares: 60_000, price: 44.20, value: 2_652_000, date: "2026-11-04" },
  { insider: "Arvind Krishna", title: "CEO", company: "IBM", ticker: "IBM", txType: "Buy", shares: 15_000, price: 198.50, value: 2_977_500, date: "2026-11-03" },
];

const HOLDINGS: Holding[] = [
  { holder: "Vanguard Group", shares: 198_450_000, value: 29_380_000_000, pctPortfolio: 8.2, changeQoQ: 1.4, filingDate: "2026-09-30" },
  { holder: "BlackRock Inc", shares: 172_300_000, value: 25_510_000_000, pctPortfolio: 6.8, changeQoQ: -0.3, filingDate: "2026-09-30" },
  { holder: "State Street Corp", shares: 98_200_000, value: 14_540_000_000, pctPortfolio: 4.1, changeQoQ: 0.8, filingDate: "2026-09-30" },
  { holder: "Fidelity (FMR)", shares: 85_600_000, value: 12_670_000_000, pctPortfolio: 3.5, changeQoQ: 2.1, filingDate: "2026-09-30" },
  { holder: "Capital Research", shares: 72_100_000, value: 10_670_000_000, pctPortfolio: 3.0, changeQoQ: -1.2, filingDate: "2026-09-30" },
  { holder: "T. Rowe Price", shares: 58_900_000, value: 8_720_000_000, pctPortfolio: 2.4, changeQoQ: 0.5, filingDate: "2026-09-30" },
  { holder: "Geode Capital", shares: 42_300_000, value: 6_260_000_000, pctPortfolio: 1.7, changeQoQ: 1.1, filingDate: "2026-09-30" },
  { holder: "Northern Trust", shares: 35_800_000, value: 5_300_000_000, pctPortfolio: 1.5, changeQoQ: -0.6, filingDate: "2026-09-30" },
  { holder: "Citadel Advisors", shares: 31_200_000, value: 4_620_000_000, pctPortfolio: 1.3, changeQoQ: 15.8, filingDate: "2026-09-30" },
  { holder: "Bridgewater Assoc.", shares: 28_500_000, value: 4_220_000_000, pctPortfolio: 1.2, changeQoQ: -4.2, filingDate: "2026-09-30" },
];

const EARNINGS: EarningsEntry[] = [
  { company: "Walmart Inc", ticker: "WMT", date: "2026-11-18", time: "BMO", estEPS: 1.82, prevEPS: 1.67, surprise: 4.2 },
  { company: "Home Depot", ticker: "HD", date: "2026-11-18", time: "BMO", estEPS: 3.65, prevEPS: 3.81, surprise: -1.1 },
  { company: "Deere & Co", ticker: "DE", date: "2026-11-19", time: "BMO", estEPS: 7.44, prevEPS: 8.26, surprise: null },
  { company: "Palo Alto Networks", ticker: "PANW", date: "2026-11-19", time: "AMC", estEPS: 1.56, prevEPS: 1.44, surprise: 3.8 },
  { company: "Target Corp", ticker: "TGT", date: "2026-11-20", time: "BMO", estEPS: 2.30, prevEPS: 2.10, surprise: -2.3 },
  { company: "Snowflake Inc", ticker: "SNOW", date: "2026-11-20", time: "AMC", estEPS: 0.18, prevEPS: 0.14, surprise: 12.5 },
  { company: "Baidu Inc", ticker: "BIDU", date: "2026-11-21", time: "BMO", estEPS: 2.81, prevEPS: 2.65, surprise: null },
  { company: "Intuit Inc", ticker: "INTU", date: "2026-11-21", time: "AMC", estEPS: 2.35, prevEPS: 2.47, surprise: 1.9 },
  { company: "Zoom Video", ticker: "ZM", date: "2026-11-24", time: "AMC", estEPS: 1.30, prevEPS: 1.22, surprise: 5.1 },
  { company: "CrowdStrike", ticker: "CRWD", date: "2026-11-25", time: "AMC", estEPS: 0.82, prevEPS: 0.76, surprise: 6.2 },
  { company: "Dell Technologies", ticker: "DELL", date: "2026-11-25", time: "AMC", estEPS: 1.95, prevEPS: 1.88, surprise: null },
  { company: "Autodesk Inc", ticker: "ADSK", date: "2026-11-26", time: "AMC", estEPS: 2.10, prevEPS: 1.98, surprise: 2.4 },
  { company: "Workday Inc", ticker: "WDAY", date: "2026-11-26", time: "AMC", estEPS: 1.65, prevEPS: 1.55, surprise: null },
  { company: "Marvell Tech", ticker: "MRVL", date: "2026-11-27", time: "AMC", estEPS: 0.56, prevEPS: 0.46, surprise: 8.7 },
];

const IPOS: IPOEntry[] = [
  { company: "Stripe Inc", ticker: "STRP", date: "2026-11-20", priceRange: "$65 – $72", dealSize: "$8.4B", exchange: "NYSE", underwriters: "Goldman Sachs, JPMorgan, Morgan Stanley" },
  { company: "Databricks Inc", ticker: "DBR", date: "2026-11-22", priceRange: "$42 – $48", dealSize: "$4.2B", exchange: "NASDAQ", underwriters: "Morgan Stanley, Goldman Sachs" },
  { company: "Shein Group", ticker: "SHEI", date: "2026-11-25", priceRange: "$52 – $58", dealSize: "$6.6B", exchange: "NYSE", underwriters: "Goldman Sachs, JPMorgan, UBS" },
  { company: "Klarna Bank", ticker: "KLAR", date: "2026-11-27", priceRange: "$38 – $44", dealSize: "$2.8B", exchange: "NYSE", underwriters: "Goldman Sachs, Morgan Stanley" },
  { company: "Discord Inc", ticker: "DSCD", date: "2026-12-01", priceRange: "$28 – $34", dealSize: "$1.9B", exchange: "NASDAQ", underwriters: "JPMorgan, BofA Securities" },
  { company: "Revolut Ltd", ticker: "RVLT", date: "2026-12-04", priceRange: "$44 – $50", dealSize: "$3.5B", exchange: "NYSE", underwriters: "Goldman Sachs, Barclays, Citi" },
  { company: "Plaid Inc", ticker: "PLAI", date: "2026-12-08", priceRange: "$22 – $26", dealSize: "$1.4B", exchange: "NASDAQ", underwriters: "Morgan Stanley, Goldman Sachs" },
];

/* ── Formatting ────────────────────────────────────────────────── */
function fmtMoney(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtShares(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString();
}

/* ── Styles ────────────────────────────────────────────────────── */
const TYPE_COLORS: Record<string, string> = {
  "10-K": "#00e5a0", "10-Q": "#38bdf8", "8-K": "#f59e0b",
  "DEF 14A": "#a855f7", "13F": "#e879f9",
};

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "filings", label: "SEC FILINGS", icon: "📄" },
  { key: "insider", label: "INSIDER TRADES", icon: "🕵️" },
  { key: "holdings", label: "13F HOLDINGS", icon: "🏛️" },
  { key: "earnings", label: "EARNINGS CAL", icon: "📅" },
  { key: "ipo", label: "IPO PIPELINE", icon: "🚀" },
];

/* ── Component ─────────────────────────────────────────────────── */
export default function SECFilingPanel() {
  const [tab, setTab] = useState<Tab>("filings");
  const [filingFilter, setFilingFilter] = useState<string>("ALL");
  const [holdingsTicker] = useState("NVDA");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0a0c10", color: "#e2e8f0", fontFamily: "monospace", fontSize: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#12151c" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#00e5a0", fontWeight: 700, fontSize: 14 }}>SEC EDGAR TERMINAL</span>
          <DemoBadge />
          <span style={{ fontSize: 10, color: "#64748b" }}>EDGAR · FORM 4 · 13F · IPO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10 }}>
          <span style={{ color: "#64748b" }}>FILINGS TODAY: <span style={{ color: "#00e5a0", fontWeight: 700 }}>247</span></span>
          <span style={{ color: "#64748b" }}>8-K ALERTS: <span style={{ color: "#f59e0b", fontWeight: 700 }}>18</span></span>
          <span style={{ color: "#64748b" }}>IPO WEEK: <span style={{ color: "#e879f9", fontWeight: 700 }}>3</span></span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0d1017" }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 16px", cursor: "pointer", border: "none", background: "transparent",
              color: tab === t.key ? "#00e5a0" : "#64748b",
              borderBottom: tab === t.key ? "2px solid #00e5a0" : "2px solid transparent",
              fontFamily: "monospace", fontSize: 11, fontWeight: tab === t.key ? 700 : 400,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 0 }}>
        {tab === "filings" && <FilingsTab filter={filingFilter} setFilter={setFilingFilter} />}
        {tab === "insider" && <InsiderTab />}
        {tab === "holdings" && <HoldingsTab ticker={holdingsTicker} />}
        {tab === "earnings" && <EarningsTab />}
        {tab === "ipo" && <IPOTab />}
      </div>
    </div>
  );
}

/* ── SEC Filings Tab ───────────────────────────────────────────── */
function FilingsTab({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const types = ["ALL", "10-K", "10-Q", "8-K", "DEF 14A", "13F"];
  const data = filter === "ALL" ? FILINGS : FILINGS.filter(f => f.type === filter);

  return (
    <div style={{ padding: 0 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 10, color: "#64748b", marginRight: 4 }}>FORM TYPE:</span>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "3px 10px", borderRadius: 3, border: "1px solid",
              borderColor: filter === t ? "#00e5a0" : "rgba(255,255,255,0.1)",
              background: filter === t ? "rgba(0,229,160,0.12)" : "transparent",
              color: filter === t ? "#00e5a0" : "#94a3b8",
              fontSize: 10, fontFamily: "monospace", cursor: "pointer", fontWeight: filter === t ? 700 : 400,
            }}
          >
            {t}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#475569" }}>{data.length} filing{data.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "72px 56px 1fr 100px 64px", gap: 0, padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        <span style={thStyle}>DATE</span>
        <span style={thStyle}>TYPE</span>
        <span style={thStyle}>COMPANY / DESCRIPTION</span>
        <span style={{ ...thStyle, textAlign: "right" }}>TICKER</span>
        <span style={{ ...thStyle, textAlign: "right" }}>SIZE</span>
      </div>

      {data.map((f, i) => (
        <div
          key={i}
          style={{
            display: "grid", gridTemplateColumns: "72px 56px 1fr 100px 64px",
            padding: "7px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            cursor: "pointer", transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,229,160,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ color: "#94a3b8", fontSize: 11 }}>{f.date.slice(5)}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 2,
            background: `${TYPE_COLORS[f.type] || "#64748b"}22`,
            color: TYPE_COLORS[f.type] || "#64748b",
            display: "inline-block", textAlign: "center", lineHeight: "16px",
          }}>
            {f.type}
          </span>
          <div>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{f.company}</span>
            <div style={{ color: "#64748b", fontSize: 10, marginTop: 1, lineHeight: 1.3 }}>{f.description}</div>
          </div>
          <span style={{ color: "#00e5a0", fontWeight: 700, textAlign: "right" }}>{f.ticker}</span>
          <span style={{ color: "#64748b", textAlign: "right" }}>{f.size}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Insider Trading Tab ───────────────────────────────────────── */
function InsiderTab() {
  const totalBuys = INSIDER_TRADES.filter(t => t.txType === "Buy").reduce((s, t) => s + t.value, 0);
  const totalSells = INSIDER_TRADES.filter(t => t.txType === "Sell").reduce((s, t) => s + t.value, 0);

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        {[
          { label: "NET INSIDER BUYS", value: fmtMoney(totalBuys), color: "#00e5a0" },
          { label: "NET INSIDER SELLS", value: fmtMoney(totalSells), color: "#ef4444" },
          { label: "BUY / SELL RATIO", value: `${(totalBuys / totalSells).toFixed(2)}`, color: totalBuys > totalSells ? "#00e5a0" : "#ef4444" },
          { label: "UNIQUE INSIDERS", value: String(INSIDER_TRADES.length), color: "#38bdf8" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 12px", background: "#111827", borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "72px 160px 56px 48px 80px 72px 100px", gap: 0, padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        <span style={thStyle}>DATE</span>
        <span style={thStyle}>INSIDER</span>
        <span style={thStyle}>TICKER</span>
        <span style={thStyle}>TYPE</span>
        <span style={{ ...thStyle, textAlign: "right" }}>SHARES</span>
        <span style={{ ...thStyle, textAlign: "right" }}>PRICE</span>
        <span style={{ ...thStyle, textAlign: "right" }}>VALUE</span>
      </div>

      {INSIDER_TRADES.map((t, i) => (
        <div
          key={i}
          style={{
            display: "grid", gridTemplateColumns: "72px 160px 56px 48px 80px 72px 100px",
            padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: t.txType === "Buy" ? "rgba(0,229,160,0.03)" : "rgba(239,68,68,0.03)",
          }}
        >
          <span style={{ color: "#94a3b8" }}>{t.date.slice(5)}</span>
          <div>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{t.insider}</span>
            <span style={{ color: "#64748b", fontSize: 10, marginLeft: 6 }}>{t.title}</span>
          </div>
          <span style={{ color: "#00e5a0", fontWeight: 700 }}>{t.ticker}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 2,
            background: t.txType === "Buy" ? "rgba(0,229,160,0.15)" : "rgba(239,68,68,0.15)",
            color: t.txType === "Buy" ? "#00e5a0" : "#ef4444",
          }}>
            {t.txType.toUpperCase()}
          </span>
          <span style={{ textAlign: "right", color: "#cbd5e1" }}>{fmtShares(t.shares)}</span>
          <span style={{ textAlign: "right", color: "#94a3b8" }}>${t.price.toLocaleString()}</span>
          <span style={{ textAlign: "right", color: t.txType === "Buy" ? "#00e5a0" : "#ef4444", fontWeight: 600 }}>{fmtMoney(t.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 13F Holdings Tab ──────────────────────────────────────────── */
function HoldingsTab({ ticker }: { ticker: string }) {
  const totalShares = HOLDINGS.reduce((s, h) => s + h.shares, 0);
  const totalValue = HOLDINGS.reduce((s, h) => s + h.value, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        <div>
          <span style={{ color: "#00e5a0", fontWeight: 700, fontSize: 14 }}>{ticker}</span>
          <span style={{ color: "#64748b", fontSize: 11, marginLeft: 10 }}>INSTITUTIONAL OWNERSHIP · 13F FILINGS · Q3 2026</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
          <span style={{ color: "#64748b" }}>TOTAL INST. SHARES: <span style={{ color: "#38bdf8", fontWeight: 700 }}>{fmtShares(totalShares)}</span></span>
          <span style={{ color: "#64748b" }}>TOTAL VALUE: <span style={{ color: "#00e5a0", fontWeight: 700 }}>{fmtMoney(totalValue)}</span></span>
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 100px 100px 80px 80px 80px", gap: 0, padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        <span style={thStyle}>#</span>
        <span style={thStyle}>HOLDER</span>
        <span style={{ ...thStyle, textAlign: "right" }}>SHARES</span>
        <span style={{ ...thStyle, textAlign: "right" }}>MKT VALUE</span>
        <span style={{ ...thStyle, textAlign: "right" }}>% PORT</span>
        <span style={{ ...thStyle, textAlign: "right" }}>CHG QoQ</span>
        <span style={{ ...thStyle, textAlign: "right" }}>FILED</span>
      </div>

      {HOLDINGS.map((h, i) => {
        const pctOfTotal = ((h.shares / totalShares) * 100).toFixed(1);
        return (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "32px 1fr 100px 100px 80px 80px 80px",
              padding: "7px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,229,160,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ color: "#475569" }}>{i + 1}</span>
            <div>
              <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{h.holder}</span>
              {/* ownership bar */}
              <div style={{ marginTop: 3, height: 3, background: "#1e293b", borderRadius: 2, width: 120 }}>
                <div style={{ height: 3, borderRadius: 2, background: "#00e5a0", width: `${parseFloat(pctOfTotal) * 2}%`, maxWidth: "100%" }} />
              </div>
            </div>
            <span style={{ textAlign: "right", color: "#cbd5e1" }}>{fmtShares(h.shares)}</span>
            <span style={{ textAlign: "right", color: "#38bdf8" }}>{fmtMoney(h.value)}</span>
            <span style={{ textAlign: "right", color: "#94a3b8" }}>{h.pctPortfolio}%</span>
            <span style={{ textAlign: "right", color: h.changeQoQ >= 0 ? "#00e5a0" : "#ef4444", fontWeight: 600 }}>
              {h.changeQoQ >= 0 ? "+" : ""}{h.changeQoQ}%
            </span>
            <span style={{ textAlign: "right", color: "#64748b" }}>{h.filingDate.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Earnings Calendar Tab ─────────────────────────────────────── */
function EarningsTab() {
  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        {[
          { label: "THIS WEEK", value: "8", color: "#00e5a0" },
          { label: "NEXT WEEK", value: "6", color: "#38bdf8" },
          { label: "AVG SURPRISE", value: "+3.9%", color: "#f59e0b" },
          { label: "BEAT RATE", value: "72%", color: "#a855f7" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 12px", background: "#111827", borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "80px 56px 1fr 44px 72px 72px 72px", gap: 0, padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        <span style={thStyle}>DATE</span>
        <span style={thStyle}>TICKER</span>
        <span style={thStyle}>COMPANY</span>
        <span style={{ ...thStyle, textAlign: "center" }}>TIME</span>
        <span style={{ ...thStyle, textAlign: "right" }}>EST EPS</span>
        <span style={{ ...thStyle, textAlign: "right" }}>PREV EPS</span>
        <span style={{ ...thStyle, textAlign: "right" }}>SURPRISE</span>
      </div>

      {EARNINGS.map((e, i) => {
        const dayName = new Date(e.date + "T12:00:00Z").toLocaleDateString("en", { weekday: "short" });
        return (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "80px 56px 1fr 44px 72px 72px 72px",
              padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
            onMouseEnter={ev => (ev.currentTarget.style.background = "rgba(0,229,160,0.04)")}
            onMouseLeave={ev => (ev.currentTarget.style.background = "transparent")}
          >
            <span style={{ color: "#94a3b8" }}>{dayName} {e.date.slice(5)}</span>
            <span style={{ color: "#00e5a0", fontWeight: 700 }}>{e.ticker}</span>
            <span style={{ color: "#e2e8f0" }}>{e.company}</span>
            <span style={{
              textAlign: "center", fontSize: 9, padding: "1px 4px", borderRadius: 2,
              background: e.time === "BMO" ? "rgba(251,191,36,0.12)" : "rgba(99,102,241,0.12)",
              color: e.time === "BMO" ? "#fbbf24" : "#818cf8",
            }}>
              {e.time}
            </span>
            <span style={{ textAlign: "right", color: "#cbd5e1" }}>${e.estEPS.toFixed(2)}</span>
            <span style={{ textAlign: "right", color: "#94a3b8" }}>${e.prevEPS.toFixed(2)}</span>
            <span style={{
              textAlign: "right", fontWeight: 600,
              color: e.surprise === null ? "#475569" : e.surprise >= 0 ? "#00e5a0" : "#ef4444",
            }}>
              {e.surprise === null ? "—" : `${e.surprise >= 0 ? "+" : ""}${e.surprise}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── IPO Pipeline Tab ──────────────────────────────────────────── */
function IPOTab() {
  const totalDeal = IPOS.reduce((s, ipo) => {
    const n = parseFloat(ipo.dealSize.replace(/[$B,]/g, ""));
    return s + n;
  }, 0);

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d1017" }}>
        {[
          { label: "UPCOMING IPOs", value: String(IPOS.length), color: "#e879f9" },
          { label: "TOTAL DEAL SIZE", value: `$${totalDeal.toFixed(1)}B`, color: "#00e5a0" },
          { label: "THIS MONTH", value: "4", color: "#38bdf8" },
          { label: "AVG RANGE MID", value: "$44.3", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 12px", background: "#111827", borderRadius: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* IPO Cards */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
        {IPOS.map((ipo, i) => {
          const dayName = new Date(ipo.date + "T12:00:00Z").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
          return (
            <div key={i} style={{
              background: "#111827", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)",
              padding: 14, display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13 }}>{ipo.company}</span>
                  <span style={{ color: "#00e5a0", fontWeight: 700, marginLeft: 8, fontSize: 12 }}>{ipo.ticker}</span>
                </div>
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 3,
                  background: "rgba(232,121,249,0.12)", color: "#e879f9", fontWeight: 700,
                }}>
                  {ipo.exchange}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 10 }}>
                <div>
                  <div style={{ color: "#64748b" }}>DATE</div>
                  <div style={{ color: "#38bdf8", fontWeight: 600, marginTop: 2 }}>{dayName}</div>
                </div>
                <div>
                  <div style={{ color: "#64748b" }}>RANGE</div>
                  <div style={{ color: "#f59e0b", fontWeight: 600, marginTop: 2 }}>{ipo.priceRange}</div>
                </div>
                <div>
                  <div style={{ color: "#64748b" }}>DEAL SIZE</div>
                  <div style={{ color: "#00e5a0", fontWeight: 700, marginTop: 2 }}>{ipo.dealSize}</div>
                </div>
              </div>

              <div style={{ fontSize: 10, color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6 }}>
                <span style={{ color: "#94a3b8" }}>UW:</span> {ipo.underwriters}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Shared ─────────────────────────────────────────────────────── */
const thStyle: React.CSSProperties = {
  fontSize: 9, color: "#475569", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
};
