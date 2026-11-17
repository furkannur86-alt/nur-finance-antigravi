"use client";
import { useState, useEffect } from "react";

/* ── Bloomberg-tier Market Microstructure & Order Book ────────── */

interface OrderLevel {
  price: number;
  size: number;
  orders: number;
  cumSize: number;
}

interface TradeData {
  time: string;
  price: number;
  size: number;
  side: "BUY" | "SELL";
  venue: string;
  aggressor: "BID" | "ASK";
}

function generateBook(mid: number, spread: number, levels: number): { bids: OrderLevel[]; asks: OrderLevel[] } {
  const bids: OrderLevel[] = [];
  const asks: OrderLevel[] = [];
  let cumBid = 0, cumAsk = 0;
  for (let i = 0; i < levels; i++) {
    const bSize = Math.round(100 + Math.random() * 2000);
    const aSize = Math.round(100 + Math.random() * 2000);
    cumBid += bSize;
    cumAsk += aSize;
    bids.push({ price: +(mid - spread / 2 - i * 0.01).toFixed(2), size: bSize, orders: Math.ceil(Math.random() * 12), cumSize: cumBid });
    asks.push({ price: +(mid + spread / 2 + i * 0.01).toFixed(2), size: aSize, orders: Math.ceil(Math.random() * 12), cumSize: cumAsk });
  }
  return { bids, asks };
}

const TICKERS = [
  { ticker: "AAPL", mid: 189.42, spread: 0.01 },
  { ticker: "MSFT", mid: 378.56, spread: 0.01 },
  { ticker: "NVDA", mid: 482.12, spread: 0.02 },
  { ticker: "TSLA", mid: 242.80, spread: 0.03 },
  { ticker: "SPY", mid: 456.78, spread: 0.01 },
  { ticker: "QQQ", mid: 388.42, spread: 0.01 },
];

const VENUES = ["NYSE", "NASDAQ", "ARCA", "BATS", "IEX", "EDGX", "DARK"];

function genTrades(mid: number): TradeData[] {
  const trades: TradeData[] = [];
  for (let i = 0; i < 30; i++) {
    const side = Math.random() > 0.5 ? "BUY" as const : "SELL" as const;
    const offset = (Math.random() - 0.5) * 0.08;
    trades.push({
      time: `${9 + Math.floor(i / 5)}:${String(30 + (i * 2) % 60).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      price: +(mid + offset).toFixed(2),
      size: Math.round(50 + Math.random() * 5000),
      side,
      venue: VENUES[Math.floor(Math.random() * VENUES.length)],
      aggressor: side === "BUY" ? "ASK" : "BID",
    });
  }
  return trades.reverse();
}

interface VenueShare { venue: string; share: number; avgSize: number; fillRate: number; }
const VENUE_SHARES: VenueShare[] = [
  { venue: "NYSE", share: 24.2, avgSize: 342, fillRate: 94.2 },
  { venue: "NASDAQ", share: 22.8, avgSize: 289, fillRate: 95.8 },
  { venue: "ARCA", share: 12.4, avgSize: 412, fillRate: 92.1 },
  { venue: "BATS", share: 11.8, avgSize: 268, fillRate: 93.4 },
  { venue: "IEX", share: 4.2, avgSize: 524, fillRate: 96.8 },
  { venue: "EDGX", share: 8.4, avgSize: 198, fillRate: 91.2 },
  { venue: "DARK POOLS", share: 16.2, avgSize: 1842, fillRate: 88.4 },
];

export default function MarketMicrostructurePanel() {
  const [tab, setTab] = useState<"book" | "trades" | "venue" | "depth">("book");
  const [selectedTicker, setSelectedTicker] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  const tk = TICKERS[selectedTicker];
  const { bids, asks } = generateBook(tk.mid + (tick % 2) * 0.01, tk.spread, 15);
  const trades = genTrades(tk.mid);
  const maxCum = Math.max(bids[bids.length - 1]?.cumSize || 1, asks[asks.length - 1]?.cumSize || 1);

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>MARKET MICROSTRUCTURE</span>
            <span style={{ color: textSecondary, fontSize: 11, marginLeft: 12 }}>Level II Book & Execution Analytics</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["book", "trades", "venue", "depth"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                border: `1px solid ${tab === t ? accent : border}`,
                background: tab === t ? `${accent}18` : "transparent",
                color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase"
              }}>{t}</button>
            ))}
          </div>
        </div>
        {/* Ticker selector */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {TICKERS.map((t, i) => (
            <button key={t.ticker} onClick={() => setSelectedTicker(i)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: 700, borderRadius: 4,
              border: `1px solid ${selectedTicker === i ? "#fbbf24" : border}`,
              background: selectedTicker === i ? "#fbbf2418" : "transparent",
              color: selectedTicker === i ? "#fbbf24" : textSecondary, cursor: "pointer"
            }}>{t.ticker}</button>
          ))}
        </div>
        {/* Stats strip */}
        <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 11 }}>
          <div>Mid: <span style={{ color: accent, fontWeight: 700 }}>${tk.mid.toFixed(2)}</span></div>
          <div>Spread: <span style={{ color: "#fbbf24", fontWeight: 700 }}>${tk.spread.toFixed(2)}</span></div>
          <div>Bid Depth: <span style={{ color: accent }}>{bids.reduce((s, b) => s + b.size, 0).toLocaleString()}</span></div>
          <div>Ask Depth: <span style={{ color: "#ff4d6a" }}>{asks.reduce((s, a) => s + a.size, 0).toLocaleString()}</span></div>
          <div>Imbalance: <span style={{ color: "#a855f7", fontWeight: 700 }}>
            {((bids.reduce((s, b) => s + b.size, 0) / (bids.reduce((s, b) => s + b.size, 0) + asks.reduce((s, a) => s + a.size, 0)) * 100)).toFixed(1)}%
          </span></div>
        </div>
      </div>

      {tab === "book" && (
        <div style={{ flex: 1, overflow: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Bids */}
          <div>
            <div style={{ padding: "6px 12px", borderBottom: `2px solid ${accent}`, display: "grid", gridTemplateColumns: "60px 1fr 70px 70px 80px", gap: 4, fontSize: 11, color: textSecondary }}>
              <div>ORDERS</div><div>BID SIZE</div><div style={{ textAlign: "right" }}>SIZE</div><div style={{ textAlign: "right" }}>CUM</div><div style={{ textAlign: "right" }}>PRICE</div>
            </div>
            {bids.map((b, i) => (
              <div key={i} style={{ padding: "4px 12px", borderBottom: `1px solid ${border}`, display: "grid", gridTemplateColumns: "60px 1fr 70px 70px 80px", gap: 4, fontSize: 12, position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(b.cumSize / maxCum) * 100}%`, background: `${accent}08`, pointerEvents: "none" }} />
                <div style={{ color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{b.orders}</div>
                <div style={{ height: 12, background: `${accent}30`, borderRadius: 2, width: `${Math.min(b.size / 20, 100)}%`, alignSelf: "center" }} />
                <div style={{ textAlign: "right", color: accent, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{b.size.toLocaleString()}</div>
                <div style={{ textAlign: "right", color: textSecondary, fontVariantNumeric: "tabular-nums", fontSize: 11 }}>{b.cumSize.toLocaleString()}</div>
                <div style={{ textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: accent }}>{b.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          {/* Asks */}
          <div>
            <div style={{ padding: "6px 12px", borderBottom: `2px solid #ff4d6a`, display: "grid", gridTemplateColumns: "80px 70px 70px 1fr 60px", gap: 4, fontSize: 11, color: textSecondary }}>
              <div>PRICE</div><div>SIZE</div><div>CUM</div><div>ASK SIZE</div><div style={{ textAlign: "right" }}>ORDERS</div>
            </div>
            {asks.map((a, i) => (
              <div key={i} style={{ padding: "4px 12px", borderBottom: `1px solid ${border}`, display: "grid", gridTemplateColumns: "80px 70px 70px 1fr 60px", gap: 4, fontSize: 12, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(a.cumSize / maxCum) * 100}%`, background: "#ff4d6a08", pointerEvents: "none" }} />
                <div style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#ff4d6a" }}>{a.price.toFixed(2)}</div>
                <div style={{ color: "#ff4d6a", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{a.size.toLocaleString()}</div>
                <div style={{ color: textSecondary, fontVariantNumeric: "tabular-nums", fontSize: 11 }}>{a.cumSize.toLocaleString()}</div>
                <div style={{ height: 12, background: "#ff4d6a30", borderRadius: 2, width: `${Math.min(a.size / 20, 100)}%`, alignSelf: "center" }} />
                <div style={{ textAlign: "right", color: textSecondary, fontVariantNumeric: "tabular-nums" }}>{a.orders}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "trades" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["TIME", "PRICE", "SIZE", "SIDE", "VENUE", "AGGRESSOR"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "TIME" || h === "SIDE" || h === "VENUE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "5px 12px", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{t.time}</td>
                  <td style={{ padding: "5px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>${t.price.toFixed(2)}</td>
                  <td style={{ padding: "5px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: t.size > 1000 ? "#fbbf24" : textPrimary }}>{t.size.toLocaleString()}</td>
                  <td style={{ padding: "5px 12px", borderBottom: `1px solid ${border}` }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: t.side === "BUY" ? `${accent}18` : "#ff4d6a18", color: t.side === "BUY" ? accent : "#ff4d6a" }}>{t.side}</span>
                  </td>
                  <td style={{ padding: "5px 12px", borderBottom: `1px solid ${border}`, color: textSecondary, fontSize: 11 }}>{t.venue}</td>
                  <td style={{ padding: "5px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontSize: 11, color: t.aggressor === "ASK" ? accent : "#ff4d6a" }}>{t.aggressor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "venue" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>VENUE MARKET SHARE & EXECUTION QUALITY</div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr>
                {["VENUE", "SHARE %", "AVG SIZE", "FILL RATE", "MARKET SHARE"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "VENUE" || h === "MARKET SHARE" ? "left" : "right", borderBottom: `2px solid ${border}`, color: textSecondary, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VENUE_SHARES.map((v, i) => (
                <tr key={v.venue} style={{ background: i % 2 === 0 ? "transparent" : `${surface}40` }}>
                  <td style={{ padding: "7px 12px", fontWeight: 700, borderBottom: `1px solid ${border}` }}>{v.venue}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{v.share.toFixed(1)}%</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{v.avgSize.toLocaleString()}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: v.fillRate > 95 ? accent : v.fillRate > 90 ? "#fbbf24" : "#ff4d6a" }}>{v.fillRate.toFixed(1)}%</td>
                  <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}` }}>
                    <div style={{ height: 16, background: border, borderRadius: 4, overflow: "hidden", width: "100%" }}>
                      <div style={{ height: "100%", width: `${v.share * 3}%`, background: accent, borderRadius: 4, transition: "width 0.3s" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { label: "Avg Spread", value: "$0.012", color: accent },
              { label: "Quote-to-Trade", value: "2.4ms", color: "#38bdf8" },
              { label: "Cancel/Trade Ratio", value: "12.4:1", color: "#fbbf24" },
              { label: "Odd Lot %", value: "52.8%", color: "#a855f7" },
              { label: "Tick Size Constrained", value: "Yes", color: "#ef4444" },
              { label: "Reg NMS SIP Latency", value: "420µs", color: textSecondary },
            ].map(m => (
              <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ color: textSecondary, fontSize: 11, marginBottom: 4 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 18, fontWeight: 700 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "depth" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>DEPTH OF MARKET — {tk.ticker}</div>
          <svg viewBox="0 0 600 250" style={{ width: "100%", maxWidth: 700 }}>
            {/* Grid */}
            {[0, 50, 100, 150, 200].map(y => (
              <line key={y} x1={0} y1={y + 20} x2={600} y2={y + 20} stroke="#1e293b" strokeWidth={0.5} />
            ))}
            {/* Bid depth area */}
            <path d={`M ${300} 220 ` + bids.map((b, i) => `L ${300 - (i + 1) * 18} ${220 - (b.cumSize / maxCum) * 180}`).join(" ") + ` L ${300 - bids.length * 18} 220 Z`} fill={`${accent}20`} stroke={accent} strokeWidth={1.5} />
            {/* Ask depth area */}
            <path d={`M ${300} 220 ` + asks.map((a, i) => `L ${300 + (i + 1) * 18} ${220 - (a.cumSize / maxCum) * 180}`).join(" ") + ` L ${300 + asks.length * 18} 220 Z`} fill="#ff4d6a20" stroke="#ff4d6a" strokeWidth={1.5} />
            {/* Mid line */}
            <line x1={300} y1={15} x2={300} y2={225} stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 2" />
            <text x={300} y={12} textAnchor="middle" fill="#fbbf24" fontSize={10}>${tk.mid.toFixed(2)}</text>
            {/* Labels */}
            <text x={150} y={245} textAnchor="middle" fill={accent} fontSize={11}>BIDS</text>
            <text x={450} y={245} textAnchor="middle" fill="#ff4d6a" fontSize={11}>ASKS</text>
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ color: accent, fontWeight: 700, marginBottom: 8 }}>BID SIDE ANALYSIS</div>
              <div style={{ display: "grid", gap: 4, fontSize: 12 }}>
                <div>Total Depth: <span style={{ color: accent, fontWeight: 700 }}>{bids.reduce((s, b) => s + b.size, 0).toLocaleString()}</span></div>
                <div>Avg Size: <span style={{ color: textPrimary }}>{Math.round(bids.reduce((s, b) => s + b.size, 0) / bids.length).toLocaleString()}</span></div>
                <div>Total Orders: <span style={{ color: textPrimary }}>{bids.reduce((s, b) => s + b.orders, 0)}</span></div>
                <div>Depth (10 lvl): <span style={{ color: textPrimary }}>{bids.slice(0, 10).reduce((s, b) => s + b.size, 0).toLocaleString()}</span></div>
              </div>
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ color: "#ff4d6a", fontWeight: 700, marginBottom: 8 }}>ASK SIDE ANALYSIS</div>
              <div style={{ display: "grid", gap: 4, fontSize: 12 }}>
                <div>Total Depth: <span style={{ color: "#ff4d6a", fontWeight: 700 }}>{asks.reduce((s, a) => s + a.size, 0).toLocaleString()}</span></div>
                <div>Avg Size: <span style={{ color: textPrimary }}>{Math.round(asks.reduce((s, a) => s + a.size, 0) / asks.length).toLocaleString()}</span></div>
                <div>Total Orders: <span style={{ color: textPrimary }}>{asks.reduce((s, a) => s + a.orders, 0)}</span></div>
                <div>Depth (10 lvl): <span style={{ color: textPrimary }}>{asks.slice(0, 10).reduce((s, a) => s + a.size, 0).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
