"use client";
import { useState } from "react";

/* ── Bloomberg TOMS-tier Trade Blotter & Execution ─────────────── */

type TradeStatus = "FILLED" | "PARTIAL" | "WORKING" | "REJECTED" | "CANCELLED";
type Side = "BUY" | "SELL";

interface Trade {
  id: string;
  time: string;
  ticker: string;
  side: Side;
  qty: number;
  filled: number;
  price: number;
  avgPx: number;
  venue: string;
  status: TradeStatus;
  orderType: string;
  slippage: number;
}

const VENUES = ["ARCA", "BATS", "NYSE", "NSDQ", "EDGX", "IEX", "MEMX", "LTSE", "DARK", "SIGMA"];

const TRADES: Trade[] = [
  { id: "T001", time: "09:30:02", ticker: "AAPL", side: "BUY", qty: 5000, filled: 5000, price: 189.42, avgPx: 189.44, venue: "ARCA", status: "FILLED", orderType: "LIMIT", slippage: 0.02 },
  { id: "T002", time: "09:30:05", ticker: "MSFT", side: "BUY", qty: 3000, filled: 3000, price: 378.20, avgPx: 378.18, venue: "NSDQ", status: "FILLED", orderType: "MARKET", slippage: -0.02 },
  { id: "T003", time: "09:30:12", ticker: "NVDA", side: "SELL", qty: 2000, filled: 1400, price: 482.50, avgPx: 482.38, venue: "BATS", status: "PARTIAL", orderType: "LIMIT", slippage: -0.12 },
  { id: "T004", time: "09:30:18", ticker: "TSLA", side: "BUY", qty: 1500, filled: 1500, price: 242.80, avgPx: 242.92, venue: "NYSE", status: "FILLED", orderType: "LIMIT", slippage: 0.12 },
  { id: "T005", time: "09:30:24", ticker: "AMZN", side: "SELL", qty: 2500, filled: 0, price: 148.60, avgPx: 0, venue: "EDGX", status: "WORKING", orderType: "LIMIT", slippage: 0 },
  { id: "T006", time: "09:30:31", ticker: "META", side: "BUY", qty: 4000, filled: 4000, price: 328.40, avgPx: 328.52, venue: "IEX", status: "FILLED", orderType: "MARKET", slippage: 0.12 },
  { id: "T007", time: "09:30:38", ticker: "GOOGL", side: "SELL", qty: 1800, filled: 1800, price: 138.92, avgPx: 138.88, venue: "NSDQ", status: "FILLED", orderType: "LIMIT", slippage: -0.04 },
  { id: "T008", time: "09:30:45", ticker: "JPM", side: "BUY", qty: 6000, filled: 3200, price: 172.30, avgPx: 172.34, venue: "NYSE", status: "PARTIAL", orderType: "VWAP", slippage: 0.04 },
  { id: "T009", time: "09:30:52", ticker: "V", side: "SELL", qty: 2200, filled: 0, price: 258.40, avgPx: 0, venue: "ARCA", status: "REJECTED", orderType: "LIMIT", slippage: 0 },
  { id: "T010", time: "09:31:01", ticker: "BAC", side: "BUY", qty: 10000, filled: 10000, price: 32.84, avgPx: 32.86, venue: "BATS", status: "FILLED", orderType: "MARKET", slippage: 0.02 },
  { id: "T011", time: "09:31:08", ticker: "WMT", side: "SELL", qty: 3500, filled: 3500, price: 162.18, avgPx: 162.14, venue: "EDGX", status: "FILLED", orderType: "LIMIT", slippage: -0.04 },
  { id: "T012", time: "09:31:15", ticker: "HD", side: "BUY", qty: 1200, filled: 800, price: 342.60, avgPx: 342.68, venue: "MEMX", status: "PARTIAL", orderType: "TWAP", slippage: 0.08 },
  { id: "T013", time: "09:31:22", ticker: "DIS", side: "SELL", qty: 5000, filled: 5000, price: 92.34, avgPx: 92.30, venue: "NYSE", status: "FILLED", orderType: "MARKET", slippage: -0.04 },
  { id: "T014", time: "09:31:28", ticker: "NFLX", side: "BUY", qty: 800, filled: 800, price: 468.90, avgPx: 469.02, venue: "NSDQ", status: "FILLED", orderType: "LIMIT", slippage: 0.12 },
  { id: "T015", time: "09:31:35", ticker: "CRM", side: "SELL", qty: 2800, filled: 0, price: 218.40, avgPx: 0, venue: "DARK", status: "WORKING", orderType: "LIMIT", slippage: 0 },
  { id: "T016", time: "09:31:42", ticker: "ADBE", side: "BUY", qty: 1500, filled: 1500, price: 548.20, avgPx: 548.34, venue: "IEX", status: "FILLED", orderType: "LIMIT", slippage: 0.14 },
  { id: "T017", time: "09:31:48", ticker: "INTC", side: "SELL", qty: 8000, filled: 8000, price: 42.18, avgPx: 42.16, venue: "BATS", status: "FILLED", orderType: "MARKET", slippage: -0.02 },
  { id: "T018", time: "09:31:55", ticker: "AMD", side: "BUY", qty: 3000, filled: 2100, price: 124.80, avgPx: 124.86, venue: "ARCA", status: "PARTIAL", orderType: "VWAP", slippage: 0.06 },
  { id: "T019", time: "09:32:02", ticker: "GS", side: "SELL", qty: 1000, filled: 0, price: 388.40, avgPx: 0, venue: "NYSE", status: "CANCELLED", orderType: "LIMIT", slippage: 0 },
  { id: "T020", time: "09:32:08", ticker: "MS", side: "BUY", qty: 4500, filled: 4500, price: 86.72, avgPx: 86.74, venue: "EDGX", status: "FILLED", orderType: "MARKET", slippage: 0.02 },
  { id: "T021", time: "09:32:15", ticker: "PFE", side: "SELL", qty: 7000, filled: 7000, price: 28.42, avgPx: 28.40, venue: "NSDQ", status: "FILLED", orderType: "LIMIT", slippage: -0.02 },
  { id: "T022", time: "09:32:22", ticker: "UNH", side: "BUY", qty: 600, filled: 600, price: 524.80, avgPx: 524.96, venue: "NYSE", status: "FILLED", orderType: "LIMIT", slippage: 0.16 },
  { id: "T023", time: "09:32:28", ticker: "XOM", side: "SELL", qty: 5500, filled: 3800, price: 108.42, avgPx: 108.38, venue: "BATS", status: "PARTIAL", orderType: "TWAP", slippage: -0.04 },
  { id: "T024", time: "09:32:35", ticker: "COST", side: "BUY", qty: 900, filled: 0, price: 582.40, avgPx: 0, venue: "MEMX", status: "WORKING", orderType: "LIMIT", slippage: 0 },
  { id: "T025", time: "09:32:42", ticker: "LLY", side: "BUY", qty: 1200, filled: 1200, price: 592.80, avgPx: 592.94, venue: "IEX", status: "FILLED", orderType: "MARKET", slippage: 0.14 },
  { id: "T026", time: "09:32:48", ticker: "AVGO", side: "SELL", qty: 1800, filled: 1800, price: 884.20, avgPx: 884.08, venue: "NSDQ", status: "FILLED", orderType: "LIMIT", slippage: -0.12 },
  { id: "T027", time: "09:32:55", ticker: "MRK", side: "BUY", qty: 4200, filled: 4200, price: 108.60, avgPx: 108.64, venue: "NYSE", status: "FILLED", orderType: "MARKET", slippage: 0.04 },
];

interface AlgoOrder {
  id: string;
  ticker: string;
  side: Side;
  totalQty: number;
  filledQty: number;
  algo: string;
  participation: number;
  benchmark: string;
  benchPx: number;
  avgPx: number;
  startTime: string;
  eta: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETE";
}

const ALGO_ORDERS: AlgoOrder[] = [
  { id: "A001", ticker: "AAPL", side: "BUY", totalQty: 50000, filledQty: 32400, algo: "VWAP", participation: 12.4, benchmark: "VWAP", benchPx: 189.48, avgPx: 189.44, startTime: "09:30:00", eta: "11:00:00", status: "ACTIVE" },
  { id: "A002", ticker: "MSFT", side: "SELL", totalQty: 25000, filledQty: 18200, algo: "TWAP", participation: 8.2, benchmark: "TWAP", benchPx: 378.14, avgPx: 378.18, startTime: "09:30:00", eta: "12:00:00", status: "ACTIVE" },
  { id: "A003", ticker: "NVDA", side: "BUY", totalQty: 15000, filledQty: 15000, algo: "IS", participation: 22.1, benchmark: "Arrival", benchPx: 481.90, avgPx: 482.12, startTime: "09:30:00", eta: "10:30:00", status: "COMPLETE" },
  { id: "A004", ticker: "JPM", side: "BUY", totalQty: 40000, filledQty: 8400, algo: "POV", participation: 15.0, benchmark: "VWAP", benchPx: 172.28, avgPx: 172.34, startTime: "09:45:00", eta: "14:00:00", status: "ACTIVE" },
  { id: "A005", ticker: "AMZN", side: "SELL", totalQty: 30000, filledQty: 12600, algo: "Iceberg", participation: 6.8, benchmark: "TWAP", benchPx: 148.52, avgPx: 148.56, startTime: "09:30:00", eta: "15:00:00", status: "PAUSED" },
];

interface ExecMetric {
  ticker: string;
  side: Side;
  totalQty: number;
  avgPx: number;
  vwap: number;
  twap: number;
  arrivalPx: number;
  slippageBps: number;
  fillRate: number;
  avgLatency: number;
}

const EXEC_METRICS: ExecMetric[] = [
  { ticker: "AAPL", side: "BUY", totalQty: 55000, avgPx: 189.44, vwap: 189.48, twap: 189.52, arrivalPx: 189.38, slippageBps: -2.1, fillRate: 94.2, avgLatency: 0.42 },
  { ticker: "MSFT", side: "SELL", totalQty: 28000, avgPx: 378.18, vwap: 378.14, twap: 378.08, arrivalPx: 378.22, slippageBps: 1.1, fillRate: 88.4, avgLatency: 0.38 },
  { ticker: "NVDA", side: "BUY", totalQty: 17000, avgPx: 482.12, vwap: 482.28, twap: 482.34, arrivalPx: 481.90, slippageBps: -3.3, fillRate: 100.0, avgLatency: 0.56 },
  { ticker: "TSLA", side: "BUY", totalQty: 1500, avgPx: 242.92, vwap: 242.88, twap: 242.94, arrivalPx: 242.80, slippageBps: 4.9, fillRate: 100.0, avgLatency: 0.28 },
  { ticker: "META", side: "BUY", totalQty: 4000, avgPx: 328.52, vwap: 328.46, twap: 328.50, arrivalPx: 328.40, slippageBps: 3.7, fillRate: 100.0, avgLatency: 0.34 },
  { ticker: "GOOGL", side: "SELL", totalQty: 1800, avgPx: 138.88, vwap: 138.90, twap: 138.86, arrivalPx: 138.92, slippageBps: 2.9, fillRate: 100.0, avgLatency: 0.44 },
  { ticker: "JPM", side: "BUY", totalQty: 46000, avgPx: 172.34, vwap: 172.28, twap: 172.32, arrivalPx: 172.30, slippageBps: 2.3, fillRate: 72.1, avgLatency: 0.52 },
  { ticker: "BAC", side: "BUY", totalQty: 10000, avgPx: 32.86, vwap: 32.84, twap: 32.86, arrivalPx: 32.84, slippageBps: 6.1, fillRate: 100.0, avgLatency: 0.22 },
];

const statusColor: Record<TradeStatus, string> = {
  FILLED: "#00e5a0",
  PARTIAL: "#fbbf24",
  WORKING: "#38bdf8",
  REJECTED: "#ef4444",
  CANCELLED: "#94a3b8",
};

export default function TradeBlotterPanel() {
  const [tab, setTab] = useState<"blotter" | "entry" | "quality" | "algos">("blotter");
  const [statusFilter, setStatusFilter] = useState<TradeStatus | "ALL">("ALL");
  const [orderSide, setOrderSide] = useState<Side>("BUY");
  const [orderType, setOrderType] = useState("LIMIT");

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const filteredTrades = statusFilter === "ALL" ? TRADES : TRADES.filter(t => t.status === statusFilter);
  const filledTrades = TRADES.filter(t => t.status === "FILLED" || t.status === "PARTIAL");
  const totalVolume = filledTrades.reduce((s, t) => s + t.filled, 0);
  const totalOrdered = TRADES.reduce((s, t) => s + t.qty, 0);
  const fillRate = ((totalVolume / totalOrdered) * 100).toFixed(1);
  const avgSlippage = (filledTrades.filter(t => t.slippage !== 0).reduce((s, t) => s + t.slippage, 0) / filledTrades.filter(t => t.slippage !== 0).length).toFixed(3);

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>TRADE BLOTTER & EXECUTION</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>NUR OMS // Bloomberg TOMS Equivalent</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["blotter", "entry", "quality", "algos"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase",
              }}>{t === "quality" ? "EXEC QUALITY" : t === "algos" ? "ALGO MONITOR" : t === "entry" ? "ORDER ENTRY" : "LIVE BLOTTER"}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 10, fontSize: 11 }}>
          {[
            { label: "Total Volume", value: totalVolume.toLocaleString(), color: accent },
            { label: "Orders", value: String(TRADES.length), color: "#38bdf8" },
            { label: "Fill Rate", value: `${fillRate}%`, color: "#fbbf24" },
            { label: "Avg Slippage", value: `${avgSlippage} bps`, color: "#a855f7" },
            { label: "Working", value: String(TRADES.filter(t => t.status === "WORKING").length), color: "#38bdf8" },
          ].map(k => (
            <div key={k.label}>
              <span style={{ color: textSecondary }}>{k.label}: </span>
              <span style={{ color: k.color, fontWeight: 700 }}>{k.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ LIVE BLOTTER ═══ */}
      {tab === "blotter" && (
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {/* Status filter row */}
          <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}` }}>
            {(["ALL", "FILLED", "PARTIAL", "WORKING", "REJECTED", "CANCELLED"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${statusFilter === s ? accent : border}`,
                background: statusFilter === s ? `${accent}18` : "transparent",
                color: statusFilter === s ? accent : textSecondary, cursor: "pointer",
              }}>{s} {s !== "ALL" ? `(${TRADES.filter(t => t.status === s).length})` : `(${TRADES.length})`}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["TIME", "ID", "TICKER", "SIDE", "QTY", "FILLED", "PRICE", "AVG PX", "SLIP", "VENUE", "TYPE", "STATUS"].map(h => (
                    <th key={h} style={{ padding: "7px 8px", textAlign: h === "TICKER" || h === "ID" || h === "TIME" || h === "SIDE" || h === "VENUE" || h === "TYPE" || h === "STATUS" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", position: "sticky", top: 0, background: surface }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((t, i) => (
                  <tr key={t.id} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{t.time}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{t.id}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontWeight: 700, color: "#fbbf24" }}>{t.ticker}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: t.side === "BUY" ? `${accent}20` : "#ff4d6a20", color: t.side === "BUY" ? accent : "#ff4d6a" }}>{t.side}</span>
                    </td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{t.qty.toLocaleString()}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: t.filled === t.qty ? accent : t.filled > 0 ? "#fbbf24" : textSecondary }}>{t.filled.toLocaleString()}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>${t.price.toFixed(2)}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{t.avgPx > 0 ? `$${t.avgPx.toFixed(2)}` : "—"}</td>
                    <td style={{ padding: "5px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: t.slippage > 0 ? "#ff4d6a" : t.slippage < 0 ? accent : textSecondary, fontSize: 12 }}>
                      {t.slippage !== 0 ? `${t.slippage > 0 ? "+" : ""}${t.slippage.toFixed(2)}` : "—"}
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{t.venue}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>{t.orderType}</td>
                    <td style={{ padding: "5px 8px", borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: `${statusColor[t.status]}18`, color: statusColor[t.status],
                        border: `1px solid ${statusColor[t.status]}40`,
                      }}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ ORDER ENTRY ═══ */}
      {tab === "entry" && (
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>NEW ORDER ENTRY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Ticker */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>TICKER</label>
                <input defaultValue="AAPL" style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", color: textPrimary, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              {/* Side */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>SIDE</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["BUY", "SELL"] as Side[]).map(s => (
                    <button key={s} onClick={() => setOrderSide(s)} style={{
                      flex: 1, padding: "8px 12px", fontWeight: 700, fontSize: 13, borderRadius: 4,
                      border: `1px solid ${orderSide === s ? (s === "BUY" ? accent : "#ff4d6a") : border}`,
                      background: orderSide === s ? (s === "BUY" ? `${accent}20` : "#ff4d6a20") : surface,
                      color: orderSide === s ? (s === "BUY" ? accent : "#ff4d6a") : textSecondary,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              {/* Quantity */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>QUANTITY</label>
                <input type="number" defaultValue={1000} style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", color: textPrimary, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              {/* Order Type */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>ORDER TYPE</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {["LIMIT", "MARKET", "STOP", "STOP LMT"].map(t => (
                    <button key={t} onClick={() => setOrderType(t)} style={{
                      padding: "6px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                      border: `1px solid ${orderType === t ? accent : border}`,
                      background: orderType === t ? `${accent}18` : surface,
                      color: orderType === t ? accent : textSecondary, cursor: "pointer", fontFamily: "inherit",
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Limit Price */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>LIMIT PRICE</label>
                <input type="number" step="0.01" defaultValue={189.50} disabled={orderType === "MARKET"} style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", color: orderType === "MARKET" ? textSecondary : textPrimary, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box", opacity: orderType === "MARKET" ? 0.4 : 1 }} />
              </div>
              {/* TIF */}
              <div>
                <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>TIME IN FORCE</label>
                <select defaultValue="DAY" style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", color: textPrimary, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }}>
                  <option value="DAY">DAY</option>
                  <option value="GTC">GTC</option>
                  <option value="IOC">IOC</option>
                  <option value="FOK">FOK</option>
                  <option value="GTD">GTD</option>
                </select>
              </div>
            </div>
            {/* Algo options */}
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", color: textSecondary, fontSize: 11, marginBottom: 4, fontWeight: 600 }}>EXECUTION ALGO (OPTIONAL)</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["None", "VWAP", "TWAP", "IS", "POV", "Iceberg", "Sniper"].map(a => (
                  <button key={a} style={{
                    padding: "6px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    border: `1px solid ${border}`, background: surface,
                    color: textSecondary, cursor: "pointer", fontFamily: "inherit",
                  }}>{a}</button>
                ))}
              </div>
            </div>
            {/* Submit */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={{
                flex: 1, padding: "12px 24px", fontSize: 14, fontWeight: 700, borderRadius: 6,
                border: "none", background: orderSide === "BUY" ? accent : "#ff4d6a",
                color: bg, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
              }}>SEND {orderSide} ORDER</button>
              <button style={{
                padding: "12px 24px", fontSize: 14, fontWeight: 600, borderRadius: 6,
                border: `1px solid ${border}`, background: surface,
                color: textSecondary, cursor: "pointer", fontFamily: "inherit",
              }}>CLEAR</button>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: surface, borderRadius: 6, border: `1px solid ${border}`, fontSize: 11, color: textSecondary }}>
              DEMO MODE — Orders are not executed. This is a simulation of Bloomberg TOMS order entry.
            </div>
          </div>
        </div>
      )}

      {/* ═══ EXECUTION QUALITY ═══ */}
      {tab === "quality" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, padding: 16 }}>
            {[
              { label: "Avg Slippage", value: "1.2 bps", color: accent },
              { label: "VWAP Beat Rate", value: "62.5%", color: "#38bdf8" },
              { label: "Fill Rate", value: `${fillRate}%`, color: "#fbbf24" },
              { label: "Avg Latency", value: "0.39ms", color: "#a855f7" },
              { label: "Positive Alpha", value: "5 / 8", color: accent },
            ].map(m => (
              <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ color: textSecondary, fontSize: 11, marginBottom: 2 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
              </div>
            ))}
          </div>
          {/* Per-ticker table */}
          <div style={{ padding: "0 16px 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["TICKER", "SIDE", "TOTAL QTY", "AVG PX", "VWAP", "vs VWAP", "TWAP", "ARRIVAL", "SLIP (bps)", "FILL%", "LATENCY"].map(h => (
                    <th key={h} style={{ padding: "7px 8px", textAlign: h === "TICKER" || h === "SIDE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXEC_METRICS.map((m, i) => {
                  const vsVwap = m.side === "BUY" ? m.avgPx - m.vwap : m.vwap - m.avgPx;
                  return (
                    <tr key={m.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                      <td style={{ padding: "6px 8px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}` }}>{m.ticker}</td>
                      <td style={{ padding: "6px 8px", borderBottom: `1px solid ${border}` }}>
                        <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: m.side === "BUY" ? `${accent}20` : "#ff4d6a20", color: m.side === "BUY" ? accent : "#ff4d6a" }}>{m.side}</span>
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{m.totalQty.toLocaleString()}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>${m.avgPx.toFixed(2)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: textSecondary }}>${m.vwap.toFixed(2)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: vsVwap <= 0 ? accent : "#ff4d6a", fontWeight: 600 }}>
                        {vsVwap <= 0 ? "" : "+"}{vsVwap.toFixed(2)}
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: textSecondary }}>${m.twap.toFixed(2)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: textSecondary }}>${m.arrivalPx.toFixed(2)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: m.slippageBps <= 0 ? accent : "#ff4d6a", fontWeight: 600 }}>
                        {m.slippageBps > 0 ? "+" : ""}{m.slippageBps.toFixed(1)}
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: m.fillRate === 100 ? accent : "#fbbf24" }}>{m.fillRate.toFixed(1)}%</td>
                      <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: textSecondary }}>{m.avgLatency.toFixed(2)}ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ ALGO MONITOR ═══ */}
      {tab === "algos" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>ACTIVE ALGORITHMIC ORDERS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ALGO_ORDERS.map(a => {
              const pct = (a.filledQty / a.totalQty) * 100;
              const vsB = a.side === "BUY" ? a.avgPx - a.benchPx : a.benchPx - a.avgPx;
              const statusClr = a.status === "ACTIVE" ? accent : a.status === "COMPLETE" ? "#38bdf8" : "#fbbf24";
              return (
                <div key={a.id} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 700, color: "#fbbf24" }}>{a.ticker}</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, background: a.side === "BUY" ? `${accent}20` : "#ff4d6a20", color: a.side === "BUY" ? accent : "#ff4d6a" }}>{a.side}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${statusClr}18`, color: statusClr, border: `1px solid ${statusClr}40` }}>{a.status}</span>
                      <span style={{ color: textSecondary, fontSize: 11 }}>{a.algo}</span>
                      <span style={{ color: textSecondary, fontSize: 11 }}>ID: {a.id}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                      <span style={{ color: textSecondary }}>Start: <span style={{ color: textPrimary }}>{a.startTime}</span></span>
                      <span style={{ color: textSecondary }}>ETA: <span style={{ color: textPrimary }}>{a.eta}</span></span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 18, background: `${border}`, borderRadius: 6, overflow: "hidden", position: "relative" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${accent}80, ${accent})`, borderRadius: 6, transition: "width 0.5s" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: textPrimary }}>
                        {a.filledQty.toLocaleString()} / {a.totalQty.toLocaleString()} ({pct.toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  {/* Metrics strip */}
                  <div style={{ display: "flex", gap: 24, fontSize: 11, flexWrap: "wrap" }}>
                    <div><span style={{ color: textSecondary }}>Participation: </span><span style={{ color: accent, fontWeight: 600 }}>{a.participation}%</span></div>
                    <div><span style={{ color: textSecondary }}>Avg Px: </span><span style={{ color: textPrimary, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>${a.avgPx.toFixed(2)}</span></div>
                    <div><span style={{ color: textSecondary }}>{a.benchmark}: </span><span style={{ color: textSecondary, fontVariantNumeric: "tabular-nums" }}>${a.benchPx.toFixed(2)}</span></div>
                    <div><span style={{ color: textSecondary }}>vs Bench: </span><span style={{ color: vsB <= 0 ? accent : "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{vsB > 0 ? "+" : ""}{vsB.toFixed(2)} ({((vsB / a.benchPx) * 10000).toFixed(1)} bps)</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: textSecondary, display: "flex", justifyContent: "space-between" }}>
        <span>{TRADES.length} orders | {ALGO_ORDERS.filter(a => a.status === "ACTIVE").length} algos active | Venues: {VENUES.length}</span>
        <span>DEMO MODE — Bloomberg TOMS Equivalent</span>
      </div>
    </div>
  );
}
