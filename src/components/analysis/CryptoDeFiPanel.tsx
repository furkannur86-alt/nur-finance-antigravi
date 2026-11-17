"use client";
import { useState } from "react";

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const dim = "#94a3b8";

interface Coin { rank: number; ticker: string; name: string; price: number; chg24h: number; chg7d: number; mcap: string; vol24h: string; supply: string; cat: string; spark: number[] }
const COINS: Coin[] = [
  { rank: 1, ticker: "BTC", name: "Bitcoin", price: 68420, chg24h: 2.4, chg7d: 8.2, mcap: "$1.34T", vol24h: "$42.8B", supply: "19.6M", cat: "Layer 1", spark: [62, 64, 63, 65, 67, 66, 68] },
  { rank: 2, ticker: "ETH", name: "Ethereum", price: 3842, chg24h: 1.8, chg7d: 12.4, mcap: "$462B", vol24h: "$18.4B", supply: "120.2M", cat: "Layer 1", spark: [34, 35, 34, 36, 37, 38, 38] },
  { rank: 3, ticker: "BNB", name: "BNB", price: 584, chg24h: 0.4, chg7d: 3.2, mcap: "$86.4B", vol24h: "$1.8B", supply: "147.6M", cat: "Layer 1", spark: [56, 57, 56, 57, 58, 58, 58] },
  { rank: 4, ticker: "SOL", name: "Solana", price: 148.2, chg24h: 4.8, chg7d: 18.4, mcap: "$65.2B", vol24h: "$4.2B", supply: "440M", cat: "Layer 1", spark: [120, 125, 128, 132, 138, 142, 148] },
  { rank: 5, ticker: "XRP", name: "XRP", price: 0.624, chg24h: -0.8, chg7d: 2.1, mcap: "$34.2B", vol24h: "$1.2B", supply: "54.8B", cat: "Layer 1", spark: [0.62, 0.63, 0.61, 0.62, 0.63, 0.62, 0.62] },
  { rank: 6, ticker: "ADA", name: "Cardano", price: 0.482, chg24h: 1.2, chg7d: 5.8, mcap: "$17.1B", vol24h: "$480M", supply: "35.5B", cat: "Layer 1", spark: [0.44, 0.45, 0.46, 0.46, 0.47, 0.48, 0.48] },
  { rank: 7, ticker: "AVAX", name: "Avalanche", price: 38.4, chg24h: 3.2, chg7d: 14.2, mcap: "$14.8B", vol24h: "$620M", supply: "386M", cat: "Layer 1", spark: [32, 33, 34, 35, 36, 37, 38] },
  { rank: 8, ticker: "LINK", name: "Chainlink", price: 18.42, chg24h: 2.8, chg7d: 8.6, mcap: "$10.8B", vol24h: "$840M", supply: "587M", cat: "DeFi", spark: [16, 16, 17, 17, 18, 18, 18] },
  { rank: 9, ticker: "UNI", name: "Uniswap", price: 12.84, chg24h: 1.4, chg7d: 6.2, mcap: "$7.7B", vol24h: "$320M", supply: "600M", cat: "DeFi", spark: [11, 11, 12, 12, 12, 13, 13] },
  { rank: 10, ticker: "DOGE", name: "Dogecoin", price: 0.142, chg24h: -2.4, chg7d: -4.8, mcap: "$20.1B", vol24h: "$1.4B", supply: "142B", cat: "Meme", spark: [0.16, 0.15, 0.15, 0.14, 0.14, 0.14, 0.14] },
  { rank: 11, ticker: "MATIC", name: "Polygon", price: 0.924, chg24h: 2.1, chg7d: 9.4, mcap: "$9.2B", vol24h: "$480M", supply: "10B", cat: "Layer 1", spark: [0.82, 0.84, 0.86, 0.88, 0.90, 0.91, 0.92] },
  { rank: 12, ticker: "SHIB", name: "Shiba Inu", price: 0.0000248, chg24h: -1.8, chg7d: -6.2, mcap: "$14.6B", vol24h: "$680M", supply: "589T", cat: "Meme", spark: [28, 27, 26, 26, 25, 25, 25] },
  { rank: 13, ticker: "AAVE", name: "Aave", price: 124.8, chg24h: 3.4, chg7d: 11.2, mcap: "$1.9B", vol24h: "$240M", supply: "15M", cat: "DeFi", spark: [108, 112, 115, 118, 120, 122, 125] },
  { rank: 14, ticker: "FET", name: "Fetch.ai", price: 2.42, chg24h: 5.8, chg7d: 22.4, mcap: "$2.4B", vol24h: "$320M", supply: "1B", cat: "AI", spark: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4] },
  { rank: 15, ticker: "RNDR", name: "Render", price: 8.42, chg24h: 4.2, chg7d: 16.8, mcap: "$3.2B", vol24h: "$280M", supply: "380M", cat: "AI", spark: [6.8, 7.0, 7.2, 7.5, 7.8, 8.1, 8.4] },
];

const CATS = ["All", "Layer 1", "DeFi", "Meme", "AI"];

interface DeFiProto { name: string; chain: string; tvl: string; chg24h: number; fees7d: string; users: string }
const DEFI: DeFiProto[] = [
  { name: "Lido", chain: "Ethereum", tvl: "$28.4B", chg24h: 0.8, fees7d: "$12.4M", users: "248K" },
  { name: "AAVE", chain: "Multi", tvl: "$12.8B", chg24h: 2.4, fees7d: "$8.2M", users: "184K" },
  { name: "MakerDAO", chain: "Ethereum", tvl: "$8.4B", chg24h: 1.2, fees7d: "$4.8M", users: "42K" },
  { name: "Uniswap", chain: "Multi", tvl: "$6.2B", chg24h: 3.8, fees7d: "$18.4M", users: "420K" },
  { name: "Curve", chain: "Multi", tvl: "$4.8B", chg24h: -0.4, fees7d: "$2.4M", users: "86K" },
  { name: "Compound", chain: "Ethereum", tvl: "$3.2B", chg24h: 1.8, fees7d: "$1.8M", users: "28K" },
  { name: "Eigenlayer", chain: "Ethereum", tvl: "$14.2B", chg24h: 4.2, fees7d: "$0.8M", users: "124K" },
  { name: "Rocket Pool", chain: "Ethereum", tvl: "$4.2B", chg24h: 0.6, fees7d: "$1.2M", users: "18K" },
];

const LENDING = [
  { asset: "ETH", aaveSup: 2.4, aaveBor: 3.8, compSup: 2.1, compBor: 4.2, util: 72 },
  { asset: "USDC", aaveSup: 4.8, aaveBor: 6.2, compSup: 4.2, compBor: 5.8, util: 84 },
  { asset: "USDT", aaveSup: 4.2, aaveBor: 5.8, compSup: 3.8, compBor: 5.4, util: 78 },
  { asset: "WBTC", aaveSup: 0.8, aaveBor: 2.4, compSup: 0.6, compBor: 2.8, util: 42 },
  { asset: "DAI", aaveSup: 5.2, aaveBor: 6.8, compSup: 4.8, compBor: 6.2, util: 82 },
];

const ONCHAIN = [
  { metric: "Active Addresses", btc: "1.04M", eth: "584K" },
  { metric: "Tx Count (24h)", btc: "342K", eth: "1.2M" },
  { metric: "Avg Fee", btc: "$4.82", eth: "$2.14" },
  { metric: "Hash Rate / Gas", btc: "584 EH/s", eth: "28.4 Gwei" },
  { metric: "Exchange Inflow", btc: "12,400 BTC", eth: "84,200 ETH" },
  { metric: "Exchange Outflow", btc: "14,800 BTC", eth: "92,400 ETH" },
  { metric: "Whale Txns (>$1M)", btc: "842", eth: "1,284" },
  { metric: "MVRV Ratio", btc: "2.42", eth: "1.84" },
  { metric: "NVT Ratio", btc: "68.4", eth: "42.8" },
  { metric: "Realized Cap", btc: "$428B", eth: "$284B" },
];

const STABLES = [
  { name: "USDT (Tether)", peg: "$1.00", mcap: "$98.4B", vol: "$48.2B", dev: "+0.0002", backing: "Cash/T-Bills", audit: "Quarterly" },
  { name: "USDC (Circle)", peg: "$1.00", mcap: "$32.4B", vol: "$8.4B", dev: "+0.0001", backing: "Cash/T-Bills", audit: "Monthly" },
  { name: "DAI (Maker)", peg: "$1.00", mcap: "$5.4B", vol: "$420M", dev: "-0.0004", backing: "Crypto+RWA", audit: "On-chain" },
  { name: "FDUSD", peg: "$1.00", mcap: "$3.8B", vol: "$6.8B", dev: "+0.0001", backing: "Cash", audit: "Monthly" },
  { name: "TUSD", peg: "$1.00", mcap: "$2.1B", vol: "$240M", dev: "-0.0008", backing: "Cash", audit: "Real-time" },
  { name: "FRAX", peg: "$1.00", mcap: "$1.4B", vol: "$84M", dev: "+0.0003", backing: "Algo+Collateral", audit: "On-chain" },
];

type Tab = "markets" | "defi" | "onchain" | "stables";

export default function CryptoDeFiPanel() {
  const [tab, setTab] = useState<Tab>("markets");
  const [cat, setCat] = useState("All");

  const tabs: { key: Tab; label: string }[] = [
    { key: "markets", label: "CRYPTO MARKETS" },
    { key: "defi", label: "DeFi DASHBOARD" },
    { key: "onchain", label: "ON-CHAIN" },
    { key: "stables", label: "STABLECOINS" },
  ];

  const filtered = cat === "All" ? COINS : COINS.filter(c => c.cat === cat);

  function sparkline(data: number[], w: number, h: number): string {
    const mn = Math.min(...data), mx = Math.max(...data);
    const range = mx - mn || 1;
    return data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / range) * h}`).join(" ");
  }

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>CRYPTO & DeFi ANALYTICS</span>
          <span style={{ fontSize: 11, color: dim }}>Digital Assets Intelligence</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${tab === t.key ? accent : border}`,
              background: tab === t.key ? `${accent}18` : "transparent",
              color: tab === t.key ? accent : dim, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {tab === "markets" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              {[{ l: "Total MCap", v: "$2.48T" }, { l: "24h Volume", v: "$124.8B" }, { l: "BTC Dom", v: "54.2%" }, { l: "Fear/Greed", v: "72", c: accent }].map(s => (
                <div key={s.l} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "8px 14px" }}>
                  <div style={{ fontSize: 10, color: dim }}>{s.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.c || txt }}>{s.v}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {CATS.map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                    border: `1px solid ${cat === c ? accent : border}`,
                    background: cat === c ? `${accent}18` : "transparent",
                    color: cat === c ? accent : dim, cursor: "pointer",
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["#", "COIN", "PRICE", "24H", "7D", "MCAP", "VOLUME", "7D CHART"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "#" || h === "COIN" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, color: dim, fontSize: 11 }}>{c.rank}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}` }}>
                      <span style={{ fontWeight: 700, color: "#fbbf24" }}>{c.ticker}</span>
                      <span style={{ color: dim, fontSize: 11, marginLeft: 8 }}>{c.name}</span>
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      ${c.price >= 1 ? c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : c.price.toString()}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: c.chg24h >= 0 ? accent : "#ef4444", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {c.chg24h >= 0 ? "+" : ""}{c.chg24h.toFixed(1)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: c.chg7d >= 0 ? accent : "#ef4444", fontVariantNumeric: "tabular-nums" }}>
                      {c.chg7d >= 0 ? "+" : ""}{c.chg7d.toFixed(1)}%
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{c.mcap}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: dim, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{c.vol24h}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                      <svg width={60} height={20} viewBox={`0 0 60 20`}>
                        <polyline fill="none" stroke={c.chg7d >= 0 ? accent : "#ef4444"} strokeWidth={1.5} points={sparkline(c.spark, 60, 18)} />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "defi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ l: "Total TVL", v: "$82.4B", c: accent }, { l: "24h DEX Vol", v: "$4.8B", c: "#a855f7" }, { l: "Avg Yield", v: "4.2%", c: "#fbbf24" }].map(s => (
                <div key={s.l} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 16px", flex: 1 }}>
                  <div style={{ fontSize: 10, color: dim }}>{s.l}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>TOP DeFi PROTOCOLS</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["PROTOCOL", "CHAIN", "TVL", "24H CHG", "7D FEES", "USERS"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "PROTOCOL" || h === "CHAIN" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEFI.map((d, i) => (
                  <tr key={d.name} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "6px 10px", fontWeight: 700, borderBottom: `1px solid ${border}` }}>{d.name}</td>
                    <td style={{ padding: "6px 10px", borderBottom: `1px solid ${border}`, color: dim, fontSize: 12 }}>{d.chain}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.tvl}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: d.chg24h >= 0 ? accent : "#ef4444", fontVariantNumeric: "tabular-nums" }}>{d.chg24h >= 0 ? "+" : ""}{d.chg24h.toFixed(1)}%</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{d.fees7d}</td>
                    <td style={{ padding: "6px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: dim, fontVariantNumeric: "tabular-nums" }}>{d.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 4 }}>LENDING RATES</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ASSET", "AAVE SUP", "AAVE BOR", "COMP SUP", "COMP BOR", "UTIL"].map(h => (
                    <th key={h} style={{ padding: "6px 10px", textAlign: h === "ASSET" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LENDING.map((l, i) => (
                  <tr key={l.asset} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "5px 10px", fontWeight: 700, borderBottom: `1px solid ${border}`, color: "#fbbf24" }}>{l.asset}</td>
                    <td style={{ padding: "5px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: accent }}>{l.aaveSup.toFixed(1)}%</td>
                    <td style={{ padding: "5px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: "#ef4444" }}>{l.aaveBor.toFixed(1)}%</td>
                    <td style={{ padding: "5px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: accent }}>{l.compSup.toFixed(1)}%</td>
                    <td style={{ padding: "5px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: "#ef4444" }}>{l.compBor.toFixed(1)}%</td>
                    <td style={{ padding: "5px 10px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <div style={{ width: 50, height: 6, background: border, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${l.util}%`, height: "100%", background: l.util > 80 ? "#f97316" : accent, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}>{l.util}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "onchain" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ l: "NUPL (BTC)", v: "0.58", c: accent, s: "Belief" }, { l: "MVRV (BTC)", v: "2.42", c: "#fbbf24", s: "Overvalued zone" }].map(s => (
                <div key={s.l} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "12px 16px", flex: 1 }}>
                  <div style={{ fontSize: 10, color: dim }}>{s.l}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: dim, marginTop: 2 }}>{s.s}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>ON-CHAIN METRICS</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["METRIC", "BITCOIN", "ETHEREUM"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: h === "METRIC" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ONCHAIN.map((r, i) => (
                  <tr key={r.metric} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "7px 12px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{r.metric}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: "#fbbf24" }}>{r.btc}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums", color: "#a855f7" }}>{r.eth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 4 }}>EXCHANGE NET FLOW (10D)</div>
            <svg width="100%" height={120} viewBox="0 0 400 120">
              {[-2, -1, 0, 1, 2].map(v => {
                const y = 60 - v * 25;
                return <g key={v}><line x1={30} y1={y} x2={380} y2={y} stroke={border} strokeWidth={0.5} /><text x={2} y={y + 4} fill={dim} fontSize={9} fontFamily="monospace">{v > 0 ? "+" : ""}{v}K</text></g>;
              })}
              {[-1.2, 0.8, -0.4, 1.4, -2.1, 0.6, -0.8, 1.8, -1.4, -2.4].map((v, i) => {
                const x = 40 + i * 34;
                const h = Math.abs(v) * 25;
                const y = v >= 0 ? 60 - h : 60;
                return <rect key={i} x={x} y={y} width={24} height={h} rx={2} fill={v >= 0 ? "#ef4444" : accent} opacity={0.8} />;
              })}
            </svg>
            <div style={{ display: "flex", gap: 12, fontSize: 10, color: dim }}>
              <span><span style={{ color: accent }}>■</span> Outflow (Bullish)</span>
              <span><span style={{ color: "#ef4444" }}>■</span> Inflow (Bearish)</span>
            </div>
          </div>
        )}

        {tab === "stables" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              {[{ l: "Total Supply", v: "$142.8B", c: accent }, { l: "24h Volume", v: "$68.4B", c: txt }, { l: "Dominant", v: "USDT (68.9%)", c: "#fbbf24" }].map(s => (
                <div key={s.l} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 16px", flex: 1 }}>
                  <div style={{ fontSize: 10, color: dim }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["STABLECOIN", "PEG", "MCAP", "24H VOL", "PEG DEV", "BACKING", "AUDIT"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", textAlign: h === "STABLECOIN" || h === "BACKING" || h === "AUDIT" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STABLES.map((s, i) => (
                  <tr key={s.name} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "7px 10px", fontWeight: 700, borderBottom: `1px solid ${border}` }}>{s.name}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{s.peg}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{s.mcap}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, fontVariantNumeric: "tabular-nums" }}>{s.vol}</td>
                    <td style={{ padding: "7px 10px", textAlign: "right", borderBottom: `1px solid ${border}`, color: Math.abs(parseFloat(s.dev)) > 0.0005 ? "#f97316" : accent, fontVariantNumeric: "tabular-nums" }}>{s.dev}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, color: dim, fontSize: 12 }}>{s.backing}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }}>{s.audit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: dim, display: "flex", justifyContent: "space-between" }}>
        <span>DEMO MODE — Bloomberg CRYP&lt;GO&gt; equivalent</span>
        <span>NUR Finance Digital Assets v3.0</span>
      </div>
    </div>
  );
}
