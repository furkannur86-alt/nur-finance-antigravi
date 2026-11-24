"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "onchain" | "defi" | "whale" | "nft";

export default function BlockchainAnalyticsPanel() {
  const [tab, setTab] = useState<Tab>("onchain");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">⛓️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>BLOCKCHAIN ANALYTICS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>Chainalysis</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["onchain", "defi", "whale", "nft"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "onchain" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>ON-CHAIN METRICS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "BTC Active Addresses", value: "1.02M", chg: "+3.2%", color: "#22c55e" },
                { label: "ETH Gas (Gwei)", value: "24.5", chg: "-12.8%", color: "#22c55e" },
                { label: "BTC Hash Rate", value: "642 EH/s", chg: "+1.8%", color: "#22c55e" },
                { label: "Exchange Outflow", value: "$2.4B", chg: "+18.5%", color: "#22c55e" },
                { label: "Stablecoin Supply", value: "$178B", chg: "+2.1%", color: "#22c55e" },
                { label: "NVT Ratio", value: "68.2", chg: "+5.4%", color: "#fbbf24" },
              ].map(m => (
                <div key={m.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                  <div className="font-mono font-bold mt-0.5">{m.value}</div>
                  <div className="font-mono text-[8px]" style={{ color: m.color }}>{m.chg}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EXCHANGE FLOW — 24H</div>
            {[
              { exchange: "Binance", inflow: 12450, outflow: 15820, net: -3370, btc: true },
              { exchange: "Coinbase", inflow: 8920, outflow: 11240, net: -2320, btc: true },
              { exchange: "Kraken", inflow: 3450, outflow: 4120, net: -670, btc: true },
              { exchange: "Bitfinex", inflow: 2180, outflow: 1890, net: 290, btc: true },
              { exchange: "OKX", inflow: 5620, outflow: 6340, net: -720, btc: true },
            ].map(e => (
              <div key={e.exchange} className="flex items-center gap-2 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-20 font-bold">{e.exchange}</span>
                <span className="font-mono text-[9px] w-20" style={{ color: "#ef4444" }}>↓{e.inflow.toLocaleString()} BTC</span>
                <span className="font-mono text-[9px] w-20" style={{ color: "#22c55e" }}>↑{e.outflow.toLocaleString()} BTC</span>
                <div className="flex-1 relative h-3 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <div className="absolute top-0 bottom-0 rounded" style={{
                    left: e.net < 0 ? `${50 + (e.net / 5000) * 50}%` : "50%",
                    width: `${Math.abs(e.net / 5000) * 50}%`,
                    background: e.net < 0 ? "#22c55e" : "#ef4444",
                    opacity: 0.6,
                  }} />
                </div>
                <span className="font-mono w-20 text-right" style={{ color: e.net < 0 ? "#22c55e" : "#ef4444" }}>
                  {e.net > 0 ? "+" : ""}{e.net.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "defi" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DEFI PROTOCOL TVL</div>
            {[
              { protocol: "Lido", tvl: 32.8, chg: 2.1, chain: "Ethereum", category: "Liquid Staking" },
              { protocol: "Aave V3", tvl: 18.5, chg: -1.2, chain: "Multi-chain", category: "Lending" },
              { protocol: "MakerDAO", tvl: 12.4, chg: 0.8, chain: "Ethereum", category: "CDP" },
              { protocol: "Uniswap V3", tvl: 8.2, chg: -0.5, chain: "Multi-chain", category: "DEX" },
              { protocol: "EigenLayer", tvl: 15.2, chg: 5.4, chain: "Ethereum", category: "Restaking" },
              { protocol: "Rocket Pool", tvl: 4.8, chg: 1.2, chain: "Ethereum", category: "Liquid Staking" },
              { protocol: "Curve", tvl: 3.9, chg: -2.1, chain: "Multi-chain", category: "DEX" },
              { protocol: "Compound V3", tvl: 3.2, chg: 0.4, chain: "Ethereum", category: "Lending" },
            ].map(p => (
              <div key={p.protocol} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{p.protocol}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{p.category}</span>
                  </div>
                  <span className="font-mono font-bold">${p.tvl.toFixed(1)}B</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#64748b" }}>{p.chain}</span>
                  <span className="font-mono" style={{ color: p.chg >= 0 ? "#22c55e" : "#ef4444" }}>{p.chg >= 0 ? "+" : ""}{p.chg.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "whale" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>WHALE ALERTS — LAST 24H</div>
            {[
              { time: "14:32", asset: "BTC", amount: "2,500", value: "$242.5M", from: "Binance", to: "Unknown Wallet", type: "Withdrawal" },
              { time: "13:18", asset: "ETH", amount: "45,000", value: "$162.0M", from: "Unknown", to: "Coinbase", type: "Deposit" },
              { time: "12:05", asset: "USDT", amount: "500M", value: "$500.0M", from: "Treasury", to: "Binance", type: "Mint" },
              { time: "11:42", asset: "BTC", amount: "1,800", value: "$174.6M", from: "Coinbase", to: "MicroStrategy", type: "Purchase" },
              { time: "10:15", asset: "ETH", amount: "32,000", value: "$115.2M", from: "Unknown", to: "Lido", type: "Staking" },
              { time: "09:28", asset: "SOL", amount: "850,000", value: "$178.5M", from: "FTX Estate", to: "Various", type: "Distribution" },
              { time: "08:55", asset: "BTC", amount: "950", value: "$92.2M", from: "Satoshi Era", to: "Unknown", type: "Dormant Move" },
            ].map((w, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${w.type === "Dormant Move" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono" style={{ color: "#64748b" }}>{w.time}</span>
                    <span className="font-bold" style={{ color: "#38bdf8" }}>{w.asset}</span>
                    <span className="font-mono">{w.amount}</span>
                    <span className="px-1 py-0.5 rounded text-[8px]" style={{
                      background: w.type === "Dormant Move" ? "rgba(239,68,68,0.15)" : w.type === "Mint" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.1)",
                      color: w.type === "Dormant Move" ? "#ef4444" : w.type === "Mint" ? "#fbbf24" : "#22c55e",
                    }}>{w.type}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{w.value}</span>
                </div>
                <div className="text-[9px]" style={{ color: "#94a3b8" }}>{w.from} → {w.to}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "nft" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>NFT MARKET OVERVIEW</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "24H Volume", value: "$42.8M", chg: "+15.2%" },
                { label: "Unique Buyers", value: "12,480", chg: "+8.4%" },
                { label: "Avg Sale Price", value: "0.42 ETH", chg: "-3.1%" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{s.label}</div>
                  <div className="font-mono font-bold mt-0.5">{s.value}</div>
                  <div className="text-[8px] font-mono" style={{ color: s.chg.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.chg}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP COLLECTIONS — 24H</div>
            {[
              { name: "CryptoPunks", floor: 48.5, vol24: 8.2, chg: 2.5, sales: 42 },
              { name: "Bored Ape YC", floor: 22.8, vol24: 5.4, chg: -1.8, sales: 68 },
              { name: "Pudgy Penguins", floor: 12.4, vol24: 4.8, chg: 8.2, sales: 124 },
              { name: "Azuki", floor: 5.2, vol24: 2.1, chg: -4.5, sales: 85 },
              { name: "Doodles", floor: 2.8, vol24: 1.4, chg: 12.5, sales: 156 },
              { name: "Milady", floor: 4.5, vol24: 3.2, chg: 15.8, sales: 210 },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-3 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-28 font-bold">{c.name}</span>
                <div className="flex-1 grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Floor:</span> <span className="font-mono">{c.floor} ETH</span></div>
                  <div><span style={{ color: "#64748b" }}>Vol:</span> <span className="font-mono">{c.vol24.toFixed(1)}K ETH</span></div>
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: c.chg >= 0 ? "#22c55e" : "#ef4444" }}>{c.chg >= 0 ? "+" : ""}{c.chg}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Sales:</span> <span className="font-mono">{c.sales}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
