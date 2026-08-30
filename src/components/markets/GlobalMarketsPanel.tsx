"use client";

import { useState, useEffect, useCallback } from "react";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  region?: string;
  unit?: string;
  pair?: string;
}

type TabId = "indices" | "commodities" | "forex" | "crypto";

const TABS: { id: TabId; label: string }[] = [
  { id: "indices", label: "Indices" },
  { id: "commodities", label: "Commodities" },
  { id: "forex", label: "Forex" },
  { id: "crypto", label: "Crypto" },
];

const REGIONS = ["All", "US", "Europe", "Asia", "Americas"];

export default function GlobalMarketsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("indices");
  const [region, setRegion] = useState("All");
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: activeTab });
      if (activeTab === "indices" && region !== "All") params.set("region", region);
      const res = await fetch(`/api/global-markets?${params}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  }, [activeTab, region]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Global Markets</h2>
        <button
          onClick={fetchData}
          className="text-[10px] px-2 py-0.5 rounded border"
          style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-2.5 py-1 text-xs rounded transition-colors"
            style={{
              background: activeTab === t.id ? "rgba(0,212,170,0.15)" : "transparent",
              color: activeTab === t.id ? "var(--ag-accent)" : "var(--ag-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "indices" && (
        <div className="flex items-center gap-1">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className="px-2 py-0.5 text-[10px] rounded border transition-colors"
              style={{
                background: region === r ? "var(--ag-surface)" : "transparent",
                borderColor: region === r ? "var(--ag-accent)" : "var(--ag-border)",
                color: region === r ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs" style={{ color: "var(--ag-muted)" }}>Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: "var(--ag-muted)" }}>
                <th className="text-left py-1.5 font-medium">Name</th>
                {activeTab === "indices" && <th className="text-left py-1.5 font-medium">Region</th>}
                <th className="text-right py-1.5 font-medium">Price</th>
                <th className="text-right py-1.5 font-medium">Change</th>
                <th className="text-right py-1.5 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const name = item.name || item.pair || item.symbol;
                const positive = item.changePercent >= 0;
                return (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--ag-border)" }}>
                    <td className="py-1.5 font-medium" style={{ color: "var(--ag-text)" }}>{name}</td>
                    {activeTab === "indices" && (
                      <td className="py-1.5" style={{ color: "var(--ag-muted)" }}>{item.region}</td>
                    )}
                    <td className="text-right py-1.5 font-mono" style={{ color: "var(--ag-text)" }}>
                      {item.price > 0 ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                    </td>
                    <td className="text-right py-1.5 font-mono" style={{ color: positive ? "var(--ag-success)" : "var(--ag-danger)" }}>
                      {item.change !== 0 ? `${positive ? "+" : ""}${item.change.toFixed(2)}` : "—"}
                    </td>
                    <td className="text-right py-1.5 font-mono font-bold" style={{ color: positive ? "var(--ag-success)" : "var(--ag-danger)" }}>
                      {item.changePercent !== 0 ? `${positive ? "+" : ""}${item.changePercent.toFixed(2)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: "var(--ag-muted)" }}>
              No data available. Check EODHD API configuration.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
