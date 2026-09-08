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

interface StockItem {
  code: string;
  name: string;
  type: string;
  exchange: string;
  country: string;
  fullSymbol: string;
}

interface ExchangeInfo {
  code: string;
  name: string;
  country: string;
  currency: string;
  region: string;
}

type TabId = "indices" | "commodities" | "forex" | "crypto" | "stocks";

const TABS: { id: TabId; label: string }[] = [
  { id: "indices", label: "Indices" },
  { id: "stocks", label: "Stocks" },
  { id: "commodities", label: "Commodities" },
  { id: "forex", label: "Forex" },
  { id: "crypto", label: "Crypto" },
];

const REGIONS = ["All", "US", "Europe", "Asia", "Americas", "MiddleEast", "Africa"];

export default function GlobalMarketsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("indices");
  const [region, setRegion] = useState("All");
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Stock explorer state
  const [stockRegion, setStockRegion] = useState("Europe");
  const [countries, setCountries] = useState<Record<string, string[]>>({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [exchanges, setExchanges] = useState<ExchangeInfo[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [stockMeta, setStockMeta] = useState<{ total: number; page: number; totalPages: number }>({ total: 0, page: 1, totalPages: 0 });
  const [stockPage, setStockPage] = useState(1);
  const [stockSearch, setStockSearch] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

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

  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch("/api/exchange-stocks?type=countries");
      const json = await res.json();
      setCountries(json.data || {});
    } catch {
      setCountries({});
    }
  }, []);

  const fetchExchanges = useCallback(async () => {
    try {
      const params = new URLSearchParams({ type: "exchanges", region: stockRegion });
      const res = await fetch(`/api/exchange-stocks?${params}`);
      const json = await res.json();
      setExchanges(json.data || []);
    } catch {
      setExchanges([]);
    }
  }, [stockRegion]);

  const fetchStocks = useCallback(async () => {
    if (!selectedCountry) return;
    setStockLoading(true);
    try {
      const params = new URLSearchParams({
        type: "stocks",
        country: selectedCountry,
        page: String(stockPage),
        limit: "50",
        stockType: "all",
      });
      if (stockSearch) params.set("q", stockSearch);
      const res = await fetch(`/api/exchange-stocks?${params}`);
      const json = await res.json();
      setStocks(json.data || []);
      setStockMeta(json.meta || { total: 0, page: 1, totalPages: 0 });
    } catch {
      setStocks([]);
    }
    setStockLoading(false);
  }, [selectedCountry, stockPage, stockSearch]);

  useEffect(() => {
    if (activeTab !== "stocks") fetchData();
  }, [activeTab, region, fetchData]);

  useEffect(() => {
    if (activeTab === "stocks") {
      fetchCountries();
      fetchExchanges();
    }
  }, [activeTab, fetchCountries, fetchExchanges]);

  useEffect(() => {
    if (activeTab === "stocks") fetchExchanges();
  }, [stockRegion, activeTab, fetchExchanges]);

  useEffect(() => {
    if (activeTab === "stocks" && selectedCountry) {
      setStockPage(1);
    }
  }, [selectedCountry, activeTab]);

  useEffect(() => {
    if (activeTab === "stocks" && selectedCountry) fetchStocks();
  }, [selectedCountry, stockPage, stockSearch, activeTab, fetchStocks]);

  const regionCountries = countries[stockRegion] || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Global Markets</h2>
        {activeTab !== "stocks" && (
          <button
            onClick={fetchData}
            className="text-[10px] px-2 py-0.5 rounded border"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
          >
            Refresh
          </button>
        )}
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

      {/* Stock Explorer */}
      {activeTab === "stocks" && (
        <div className="flex flex-col gap-2">
          {/* Region selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {REGIONS.filter((r) => r !== "All").map((r) => (
              <button
                key={r}
                onClick={() => { setStockRegion(r); setSelectedCountry(""); }}
                className="px-2 py-0.5 text-[10px] rounded border transition-colors"
                style={{
                  background: stockRegion === r ? "var(--ag-surface)" : "transparent",
                  borderColor: stockRegion === r ? "var(--ag-accent)" : "var(--ag-border)",
                  color: stockRegion === r ? "var(--ag-accent)" : "var(--ag-muted)",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Country selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {regionCountries.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedCountry(c); setStockSearch(""); }}
                className="px-2 py-0.5 text-[10px] rounded border transition-colors"
                style={{
                  background: selectedCountry === c ? "rgba(99,102,241,0.15)" : "transparent",
                  borderColor: selectedCountry === c ? "var(--ag-accent2)" : "var(--ag-border)",
                  color: selectedCountry === c ? "var(--ag-accent2)" : "var(--ag-muted)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Exchange info */}
          {selectedCountry && (
            <div className="flex items-center gap-2 flex-wrap">
              {exchanges.filter((e) => e.country === selectedCountry).map((e) => (
                <span key={e.code} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
                  {e.code} — {e.name} ({e.currency})
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          {selectedCountry && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={stockSearch}
                onChange={(e) => { setStockSearch(e.target.value); setStockPage(1); }}
                placeholder={`Search stocks in ${selectedCountry}...`}
                className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
              />
              <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
                {stockMeta.total.toLocaleString()} stocks
              </span>
            </div>
          )}

          {/* Stock list */}
          {stockLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-xs" style={{ color: "var(--ag-muted)" }}>Loading stocks...</div>
            </div>
          ) : selectedCountry && stocks.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: "var(--ag-muted)" }}>
                      <th className="text-left py-1.5 font-medium">Code</th>
                      <th className="text-left py-1.5 font-medium">Name</th>
                      <th className="text-left py-1.5 font-medium">Type</th>
                      <th className="text-left py-1.5 font-medium">Exchange</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((s, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--ag-border)" }}>
                        <td className="py-1 font-mono font-bold" style={{ color: "var(--ag-accent)" }}>{s.code}</td>
                        <td className="py-1" style={{ color: "var(--ag-text)" }}>{s.name}</td>
                        <td className="py-1" style={{ color: "var(--ag-muted)" }}>{s.type}</td>
                        <td className="py-1 font-mono" style={{ color: "var(--ag-muted)" }}>{s.exchange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <button
                  disabled={stockPage <= 1}
                  onClick={() => setStockPage((p) => p - 1)}
                  className="text-[10px] px-2 py-0.5 rounded border disabled:opacity-30"
                  style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
                >
                  Previous
                </button>
                <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
                  Page {stockMeta.page} of {stockMeta.totalPages}
                </span>
                <button
                  disabled={stockPage >= stockMeta.totalPages}
                  onClick={() => setStockPage((p) => p + 1)}
                  className="text-[10px] px-2 py-0.5 rounded border disabled:opacity-30"
                  style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
                >
                  Next
                </button>
              </div>
            </>
          ) : selectedCountry ? (
            <div className="text-center py-8 text-xs" style={{ color: "var(--ag-muted)" }}>
              No stocks found. Check EODHD API configuration.
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-2xl mb-2 opacity-20" style={{ color: "var(--ag-accent)" }}>&#127760;</div>
                <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
                  Select a region and country to browse stocks
                </div>
                <div className="text-[10px] mt-1" style={{ color: "var(--ag-muted)", opacity: 0.5 }}>
                  70+ exchanges across 60+ countries
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market data tables (non-stocks tabs) */}
      {activeTab !== "stocks" && (
        loading ? (
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
        )
      )}
    </div>
  );
}
