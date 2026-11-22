"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "prices" | "physical" | "miners" | "flows";

export default function PreciousMetalsPanel() {
  const [tab, setTab] = useState<Tab>("prices");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🥇</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>PRECIOUS METALS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>Bloomberg BPMA</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["prices", "physical", "miners", "flows"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "GOLD", value: "$2,685", color: "#eab308" },
          { label: "SILVER", value: "$31.42", color: "#94a3b8" },
          { label: "PLATINUM", value: "$985", color: "#e2e8f0" },
          { label: "PALLADIUM", value: "$1,042", color: "#38bdf8" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "prices" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>SPOT & FUTURES</div>
            {[
              { metal: "Gold (XAU)", spot: 2685.40, futures: 2698.20, contract: "GCG7", change: 1.2, ytd: 28.5, ratio: "—" },
              { metal: "Silver (XAG)", spot: 31.42, futures: 31.85, contract: "SIH7", change: 2.4, ytd: 35.2, ratio: "85.5x" },
              { metal: "Platinum (XPT)", spot: 985.00, futures: 992.40, contract: "PLF7", change: -0.8, ytd: 8.4, ratio: "2.73x" },
              { metal: "Palladium (XPD)", spot: 1042.00, futures: 1048.80, contract: "PAH7", change: 1.5, ytd: -12.5, ratio: "2.58x" },
              { metal: "Rhodium", spot: 4850.00, futures: 0, contract: "OTC", change: -2.2, ytd: -18.4, ratio: "0.55x" },
              { metal: "Iridium", spot: 4200.00, futures: 0, contract: "OTC", change: 0.0, ytd: -5.8, ratio: "0.64x" },
            ].map(m => (
              <div key={m.metal} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: m.metal.includes("Gold") ? "#eab308" : m.metal.includes("Silver") ? "#94a3b8" : "#e2e8f0" }}>{m.metal}</span>
                  <span className="font-mono font-bold" style={{ color: "#fbbf24" }}>${m.spot.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Fut:</span> <span className="font-mono">{m.futures > 0 ? `$${m.futures}` : "—"}</span></div>
                  <div><span style={{ color: "#64748b" }}>{m.contract}</span></div>
                  <div><span style={{ color: "#64748b" }}>Chg:</span> <span className="font-mono" style={{ color: m.change >= 0 ? "#22c55e" : "#ef4444" }}>{m.change >= 0 ? "+" : ""}{m.change}%</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: m.ytd >= 0 ? "#22c55e" : "#ef4444" }}>{m.ytd >= 0 ? "+" : ""}{m.ytd}%</span></div>
                  <div><span style={{ color: "#64748b" }}>Au/X:</span> <span className="font-mono">{m.ratio}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>KEY RATIOS</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Gold/Silver", value: "85.5x", avg: "80x (20yr)" },
                { label: "Gold/Platinum", value: "2.73x", avg: "1.5x (20yr)" },
                { label: "Gold/Oil", value: "38.2x", avg: "25x (20yr)" },
              ].map(r => (
                <div key={r.label} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{r.label}</div>
                  <div className="font-mono font-bold mt-1" style={{ color: "#eab308" }}>{r.value}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: "#94a3b8" }}>{r.avg}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "physical" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PHYSICAL MARKET PREMIUMS</div>
            {[
              { product: "Gold Bar (1oz LBMA)", premium: 1.8, bid: 2680.50, ask: 2690.30 },
              { product: "Gold Coin (Eagle 1oz)", premium: 4.5, bid: 2795.00, ask: 2810.00 },
              { product: "Silver Bar (100oz)", premium: 3.2, bid: 3178.00, ask: 3195.00 },
              { product: "Silver Coin (Eagle 1oz)", premium: 8.5, bid: 33.80, ask: 34.10 },
              { product: "Platinum Bar (1oz)", premium: 2.5, bid: 1005.00, ask: 1012.00 },
              { product: "Gold Bar (1kg LBMA)", premium: 0.8, bid: 86250.00, ask: 86480.00 },
            ].map(p => (
              <div key={p.product} className="flex items-center justify-between p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div className="font-bold">{p.product}</div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>Premium: <span className="font-mono" style={{ color: p.premium > 5 ? "#ef4444" : "#22c55e" }}>+{p.premium}%</span></span>
                </div>
                <div className="text-right font-mono text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Bid:</span> <span style={{ color: "#22c55e" }}>${p.bid.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Ask:</span> <span style={{ color: "#ef4444" }}>${p.ask.toLocaleString()}</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>COMEX VAULT INVENTORY</div>
            {[
              { vault: "Gold Registered", amount: "8.2M oz", change: "-125K oz", value: "$22.0B" },
              { vault: "Gold Eligible", amount: "17.8M oz", change: "+85K oz", value: "$47.8B" },
              { vault: "Silver Registered", amount: "32.5M oz", change: "-2.1M oz", value: "$1.02B" },
              { vault: "Silver Eligible", amount: "268M oz", change: "+4.5M oz", value: "$8.42B" },
            ].map(v => (
              <div key={v.vault} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <span className="font-bold">{v.vault}</span>
                  <span className="ml-2 font-mono text-[9px]" style={{ color: v.change.startsWith("-") ? "#ef4444" : "#22c55e" }}>{v.change}</span>
                </div>
                <div className="font-mono text-[9px]">
                  <span style={{ color: "#fbbf24" }}>{v.amount}</span>
                  <span className="ml-2" style={{ color: "#64748b" }}>{v.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "miners" && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>GOLD MINERS (GDX COMPONENTS)</div>
            {[
              { name: "Newmont Corp", ticker: "NEM", price: 48.50, change: 2.8, aisc: 1285, production: "5.8M oz", pe: 18.5 },
              { name: "Barrick Gold", ticker: "GOLD", price: 22.80, change: 1.5, aisc: 1320, production: "4.2M oz", pe: 15.2 },
              { name: "Agnico Eagle", ticker: "AEM", price: 85.20, change: 3.2, aisc: 1240, production: "3.5M oz", pe: 22.4 },
              { name: "Franco-Nevada", ticker: "FNV", price: 148.50, change: 0.8, aisc: 0, production: "Royalty", pe: 42.5 },
              { name: "Wheaton PM", ticker: "WPM", price: 62.40, change: 1.2, aisc: 0, production: "Stream", pe: 38.2 },
              { name: "Pan American Silver", ticker: "PAAS", price: 24.80, change: 4.5, aisc: 18.50, production: "21M oz Ag", pe: 25.8 },
            ].map(m => (
              <div key={m.ticker} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "#eab308" }}>{m.name}</span>
                    <span className="font-mono text-[8px]" style={{ color: "#38bdf8" }}>{m.ticker}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold">${m.price}</span>
                    <span style={{ color: m.change >= 0 ? "#22c55e" : "#ef4444" }}>+{m.change}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>AISC:</span> <span className="font-mono">{m.aisc > 0 ? `$${m.aisc}/oz` : "N/A"}</span></div>
                  <div><span style={{ color: "#64748b" }}>Prod:</span> <span className="font-mono">{m.production}</span></div>
                  <div><span style={{ color: "#64748b" }}>P/E:</span> <span className="font-mono">{m.pe}x</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "flows" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>GOLD ETF FLOWS</div>
            {[
              { etf: "SPDR Gold (GLD)", aum: "$68.5B", holdings: "838 tonnes", flow1w: 1.2, flow1m: 4.5, flowYtd: 12.8 },
              { etf: "iShares Gold (IAU)", aum: "$32.4B", holdings: "395 tonnes", flow1w: 0.8, flow1m: 2.8, flowYtd: 8.5 },
              { etf: "SPDR Gold Mini (GLDM)", aum: "$8.2B", holdings: "100 tonnes", flow1w: 0.5, flow1m: 1.5, flowYtd: 15.2 },
              { etf: "Aberdeen Physical Gold", aum: "$4.8B", holdings: "58 tonnes", flow1w: 0.2, flow1m: 0.8, flowYtd: 5.4 },
            ].map(e => (
              <div key={e.etf} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold" style={{ color: "#eab308" }}>{e.etf}</span>
                  <span className="font-mono" style={{ color: "#fbbf24" }}>{e.aum}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Holdings:</span> <span className="font-mono">{e.holdings}</span></div>
                  <div><span style={{ color: "#64748b" }}>1W:</span> <span className="font-mono" style={{ color: e.flow1w >= 0 ? "#22c55e" : "#ef4444" }}>+{e.flow1w}%</span></div>
                  <div><span style={{ color: "#64748b" }}>1M:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{e.flow1m}%</span></div>
                  <div><span style={{ color: "#64748b" }}>YTD:</span> <span className="font-mono" style={{ color: "#22c55e" }}>+{e.flowYtd}%</span></div>
                </div>
              </div>
            ))}

            <div className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>CENTRAL BANK GOLD RESERVES (Top Buyers)</div>
            {[
              { country: "🇨🇳 China (PBoC)", reserves: "2,264 tonnes", bought: "+225t (2024)", share: 5.2 },
              { country: "🇵🇱 Poland (NBP)", reserves: "420 tonnes", bought: "+130t (2024)", share: 15.8 },
              { country: "🇮🇳 India (RBI)", reserves: "876 tonnes", bought: "+72t (2024)", share: 10.5 },
              { country: "🇹🇷 Turkey (CBRT)", reserves: "585 tonnes", bought: "+45t (2024)", share: 32.4 },
              { country: "🇸🇬 Singapore (MAS)", reserves: "242 tonnes", bought: "+28t (2024)", share: 4.8 },
            ].map(c => (
              <div key={c.country} className="flex items-center justify-between p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <span className="font-bold">{c.country}</span>
                  <div className="text-[8px] mt-0.5" style={{ color: "#22c55e" }}>{c.bought}</div>
                </div>
                <div className="text-right font-mono text-[9px]">
                  <div style={{ color: "#eab308" }}>{c.reserves}</div>
                  <div style={{ color: "#64748b" }}>{c.share}% of reserves</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
