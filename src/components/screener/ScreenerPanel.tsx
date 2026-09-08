"use client";

import { useState, useCallback, useEffect } from "react";

interface ScreenerStock {
  code: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  dividendYield: number;
  eps: number;
  beta: number;
  "52WeekHigh": number;
  "52WeekLow": number;
  revenue: number;
}

const SECTORS = [
  "Technology", "Healthcare", "Financial Services", "Consumer Cyclical",
  "Communication Services", "Industrials", "Consumer Defensive",
  "Energy", "Basic Materials", "Real Estate", "Utilities",
];

const SECTOR_COLORS: Record<string, string> = {
  "Technology": "#00d4aa",
  "Healthcare": "#6366f1",
  "Financial Services": "#f59e0b",
  "Consumer Cyclical": "#ec4899",
  "Communication Services": "#8b5cf6",
  "Industrials": "#64748b",
  "Consumer Defensive": "#22d3ee",
  "Energy": "#ef4444",
  "Basic Materials": "#84cc16",
  "Real Estate": "#f97316",
  "Utilities": "#a78bfa",
};

function fmt(n: number): string {
  if (!n && n !== 0) return "N/A";
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
}

interface HeatmapBlock {
  sector: string;
  count: number;
  avgChange: number;
  totalMarketCap: number;
  stocks: ScreenerStock[];
}

function SectorHeatmap({ stocks }: { stocks: ScreenerStock[] }) {
  const sectorMap = new Map<string, HeatmapBlock>();

  for (const s of stocks) {
    const sector = s.sector || "Other";
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, { sector, count: 0, avgChange: 0, totalMarketCap: 0, stocks: [] });
    }
    const block = sectorMap.get(sector)!;
    block.count++;
    block.avgChange += s.changePercent || 0;
    block.totalMarketCap += s.marketCap || 0;
    block.stocks.push(s);
  }

  const blocks = Array.from(sectorMap.values())
    .map((b) => ({ ...b, avgChange: b.count > 0 ? b.avgChange / b.count : 0 }))
    .sort((a, b) => b.totalMarketCap - a.totalMarketCap);

  const totalMcap = blocks.reduce((sum, b) => sum + b.totalMarketCap, 0);

  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs" style={{ color: "var(--ag-muted)" }}>
        No data for heatmap
      </div>
    );
  }

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
      {blocks.map((b) => {
        const weight = totalMcap > 0 ? (b.totalMarketCap / totalMcap) * 100 : 0;
        const color = SECTOR_COLORS[b.sector] || "var(--ag-muted)";
        const changeColor = b.avgChange > 0 ? "var(--ag-success)" : b.avgChange < 0 ? "var(--ag-error)" : "var(--ag-muted)";

        return (
          <div
            key={b.sector}
            className="rounded p-2.5 border transition-transform hover:scale-[1.02]"
            style={{
              borderColor: color,
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              minHeight: Math.max(70, weight * 2),
            }}
          >
            <div className="text-[10px] font-semibold truncate" style={{ color }}>{b.sector}</div>
            <div className="text-xs font-bold mt-1" style={{ color: changeColor }}>
              {b.avgChange > 0 ? "+" : ""}{b.avgChange.toFixed(2)}%
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: "var(--ag-muted)" }}>
              {b.count} stocks | ${fmt(b.totalMarketCap)}
            </div>
            <div className="flex flex-wrap gap-0.5 mt-1.5">
              {b.stocks.slice(0, 4).map((s) => (
                <span key={s.code} className="text-[8px] px-1 py-0.5 rounded" style={{
                  background: (s.changePercent || 0) > 0 ? "rgba(34,197,94,0.15)" : (s.changePercent || 0) < 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                  color: (s.changePercent || 0) > 0 ? "var(--ag-success)" : (s.changePercent || 0) < 0 ? "var(--ag-error)" : "var(--ag-muted)",
                }}>
                  {s.code}
                </span>
              ))}
              {b.stocks.length > 4 && (
                <span className="text-[8px] px-1 py-0.5" style={{ color: "var(--ag-muted)" }}>+{b.stocks.length - 4}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StockTable({ stocks, sortCol, sortDir, onSort }: {
  stocks: ScreenerStock[];
  sortCol: string;
  sortDir: "asc" | "desc";
  onSort: (col: string) => void;
}) {
  const cols = [
    { key: "code", label: "Symbol", align: "left" as const },
    { key: "name", label: "Name", align: "left" as const },
    { key: "price", label: "Price", align: "right" as const },
    { key: "changePercent", label: "Chg%", align: "right" as const },
    { key: "marketCap", label: "Mkt Cap", align: "right" as const },
    { key: "peRatio", label: "P/E", align: "right" as const },
    { key: "volume", label: "Volume", align: "right" as const },
    { key: "sector", label: "Sector", align: "left" as const },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ color: "var(--ag-text)" }}>
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--ag-border)" }}>
            {cols.map((c) => (
              <th
                key={c.key}
                className={`py-2 px-2 font-medium cursor-pointer hover:text-[var(--ag-accent)] transition-colors ${c.align === "right" ? "text-right" : "text-left"}`}
                style={{ color: sortCol === c.key ? "var(--ag-accent)" : "var(--ag-muted)" }}
                onClick={() => onSort(c.key)}
              >
                {c.label}
                {sortCol === c.key && <span className="ml-0.5">{sortDir === "asc" ? "▲" : "▼"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={`${s.code}-${s.exchange}`} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
              <td className="py-1.5 px-2 font-medium" style={{ color: "var(--ag-accent)" }}>{s.code}</td>
              <td className="py-1.5 px-2 max-w-[160px] truncate">{s.name}</td>
              <td className="py-1.5 px-2 text-right font-mono">${s.price.toFixed(2)}</td>
              <td className="py-1.5 px-2 text-right font-mono" style={{
                color: s.changePercent > 0 ? "var(--ag-success)" : s.changePercent < 0 ? "var(--ag-error)" : "var(--ag-muted)"
              }}>
                {s.changePercent > 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
              </td>
              <td className="py-1.5 px-2 text-right font-mono">${fmt(s.marketCap)}</td>
              <td className="py-1.5 px-2 text-right font-mono">{s.peRatio ? s.peRatio.toFixed(1) : "N/A"}</td>
              <td className="py-1.5 px-2 text-right font-mono">{fmt(s.volume)}</td>
              <td className="py-1.5 px-2">
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
                  background: `${SECTOR_COLORS[s.sector] || "var(--ag-muted)"}20`,
                  color: SECTOR_COLORS[s.sector] || "var(--ag-muted)",
                }}>
                  {s.sector}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ScreenerPanel() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"table" | "heatmap">("heatmap");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [sortCol, setSortCol] = useState("marketCap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchScreener = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/screener?exchange=US&limit=100&sort=market_capitalization&order=d`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStocks(data.stocks || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchScreener(); }, [fetchScreener]);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };

  const filtered = sectorFilter === "all" ? stocks : stocks.filter((s) => s.sector === sectorFilter);

  const sorted = [...filtered].sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortCol];
    const bVal = (b as unknown as Record<string, unknown>)[sortCol];
    const aNum = typeof aVal === "number" ? aVal : typeof aVal === "string" ? aVal.toLowerCase() : 0;
    const bNum = typeof bVal === "number" ? bVal : typeof bVal === "string" ? bVal.toLowerCase() : 0;
    if (aNum < bNum) return sortDir === "asc" ? -1 : 1;
    if (aNum > bNum) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ag-accent)" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>Stock Screener</span>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => setView("heatmap")}
            className="px-2.5 py-1 text-[10px] rounded transition-colors"
            style={{
              background: view === "heatmap" ? "rgba(0,212,170,0.15)" : "transparent",
              color: view === "heatmap" ? "var(--ag-accent)" : "var(--ag-muted)",
            }}
          >
            Heatmap
          </button>
          <button
            onClick={() => setView("table")}
            className="px-2.5 py-1 text-[10px] rounded transition-colors"
            style={{
              background: view === "table" ? "rgba(0,212,170,0.15)" : "transparent",
              color: view === "table" ? "var(--ag-accent)" : "var(--ag-muted)",
            }}
          >
            Table
          </button>
        </div>

        <div className="flex-1" />

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="px-2 py-1 text-[10px] rounded border bg-transparent outline-none"
          style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
        >
          <option value="all">All Sectors</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button onClick={fetchScreener} disabled={loading}
          className="px-2.5 py-1 text-[10px] rounded font-medium"
          style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}>
          {loading ? "..." : "Refresh"}
        </button>

        <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
          {filtered.length} stocks
        </div>
      </div>

      {/* Sector pills */}
      <div className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
        {SECTORS.map((s) => {
          const count = stocks.filter((st) => st.sector === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setSectorFilter(sectorFilter === s ? "all" : s)}
              className="px-2 py-0.5 text-[9px] rounded-full border whitespace-nowrap transition-colors"
              style={{
                borderColor: sectorFilter === s ? SECTOR_COLORS[s] : "var(--ag-border)",
                background: sectorFilter === s ? `${SECTOR_COLORS[s]}20` : "transparent",
                color: sectorFilter === s ? SECTOR_COLORS[s] : "var(--ag-muted)",
              }}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-xs p-3 rounded border" style={{ borderColor: "var(--ag-error)", color: "var(--ag-error)" }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-xs animate-pulse" style={{ color: "var(--ag-muted)" }}>Loading screener data...</div>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          view === "heatmap" ? <SectorHeatmap stocks={sorted} /> : <StockTable stocks={sorted} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        )}

        {!loading && sorted.length === 0 && !error && (
          <div className="text-xs text-center py-20" style={{ color: "var(--ag-muted)" }}>
            No stocks found
          </div>
        )}
      </div>
    </div>
  );
}
