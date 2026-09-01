"use client";

import { useState, useCallback } from "react";

interface FundamentalsData {
  general: {
    code: string;
    name: string;
    exchange: string;
    currency: string;
    sector: string;
    industry: string;
    description: string;
    isin: string;
    webURL: string;
    fullTimeEmployees: number;
    ipoDate: string;
  };
  highlights: {
    marketCap: number;
    ebitda: number;
    peRatio: number;
    pegRatio: number;
    dividendYield: number;
    eps: number;
    bookValue: number;
    profitMargin: number;
    operatingMargin: number;
    roe: number;
    roa: number;
    revenue: number;
    revenuePerShare: number;
    revenueGrowth: number;
    grossProfit: number;
    dilutedEps: number;
    earningsGrowth: number;
    wallStreetTarget: number;
    beta: number;
    "52WeekHigh": number;
    "52WeekLow": number;
    "50DayMA": number;
    "200DayMA": number;
    sharesOutstanding: number;
    sharesFloat: number;
    sharesShort: number;
    shortRatio: number;
  };
  valuation: {
    trailingPE: number;
    forwardPE: number;
    priceSales: number;
    priceBook: number;
    enterpriseValue: number;
    evRevenue: number;
    evEbitda: number;
  };
  dividends: {
    forwardDividendRate: number;
    forwardDividendYield: number;
    payoutRatio: number;
    exDividendDate: string;
  } | null;
  technicals: {
    beta: number;
    "52WeekHigh": number;
    "52WeekLow": number;
    "50DayMA": number;
    "200DayMA": number;
    shortRatio: number;
    sharesShort: number;
  } | null;
}

function fmt(n: number, decimals = 2): string {
  if (!n && n !== 0) return "N/A";
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(decimals)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

function pct(n: number): string {
  if (!n && n !== 0) return "N/A";
  return `${(n * 100).toFixed(2)}%`;
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-3 py-2.5 rounded border" style={{ borderColor: "var(--ag-border)", background: "rgba(0,0,0,0.15)" }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>{label}</div>
      <div className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>{value}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>{sub}</div>}
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <span className="text-xs" style={{ color: "var(--ag-muted)" }}>{label}</span>
      <span className="text-xs font-medium" style={{ color: color || "var(--ag-text)" }}>{value}</span>
    </div>
  );
}

function GaugeBar({ value, min, max, label }: { value: number; min: number; max: number; label: string }) {
  const pctVal = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] mb-1">
        <span style={{ color: "var(--ag-muted)" }}>{label}</span>
        <span style={{ color: "var(--ag-text)" }}>{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all" style={{
          width: `${pctVal}%`,
          background: pctVal > 70 ? "var(--ag-error)" : pctVal > 40 ? "var(--ag-warning)" : "var(--ag-accent)"
        }} />
      </div>
    </div>
  );
}

const POPULAR = [
  { symbol: "AAPL.US", label: "Apple" },
  { symbol: "MSFT.US", label: "Microsoft" },
  { symbol: "GOOGL.US", label: "Alphabet" },
  { symbol: "AMZN.US", label: "Amazon" },
  { symbol: "NVDA.US", label: "NVIDIA" },
  { symbol: "TSLA.US", label: "Tesla" },
  { symbol: "META.US", label: "Meta" },
  { symbol: "JPM.US", label: "JPMorgan" },
  { symbol: "V.US", label: "Visa" },
  { symbol: "JNJ.US", label: "Johnson & J." },
];

export default function FundamentalsPanel() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState<FundamentalsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "valuation" | "financials" | "technicals">("overview");

  const search = useCallback(async (sym: string) => {
    const q = sym.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/fundamentals?symbol=${encodeURIComponent(q)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "valuation" as const, label: "Valuation" },
    { id: "financials" as const, label: "Financials" },
    { id: "technicals" as const, label: "Technicals" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ag-accent)" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>Company Fundamentals</span>
        </div>

        <form className="flex items-center gap-2 flex-1 max-w-md" onSubmit={(e) => { e.preventDefault(); search(symbol); }}>
          <div className="flex-1 relative">
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="AAPL.US, MSFT.US, TSLA.US..."
              className="w-full px-3 py-1.5 text-xs rounded border bg-transparent outline-none focus:border-[var(--ag-accent)]"
              style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 text-xs rounded font-medium"
            style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
          >
            {loading ? "..." : "Analyze"}
          </button>
        </form>
      </div>

      {/* Quick picks */}
      <div className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
        <span className="text-[10px] mr-1" style={{ color: "var(--ag-muted)" }}>Quick:</span>
        {POPULAR.map((p) => (
          <button
            key={p.symbol}
            onClick={() => { setSymbol(p.symbol); search(p.symbol); }}
            className="px-2 py-0.5 text-[10px] rounded border whitespace-nowrap hover:border-[var(--ag-accent)] transition-colors"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-xs p-3 rounded border" style={{ borderColor: "var(--ag-error)", color: "var(--ag-error)", background: "rgba(239,68,68,0.05)" }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-xs animate-pulse" style={{ color: "var(--ag-muted)" }}>Loading fundamentals data...</div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ag-border)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
              Enter a symbol (e.g. AAPL.US) to view company fundamentals
            </div>
          </div>
        )}

        {data && (
          <div>
            {/* Company header */}
            <div className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--ag-text)" }}>{data.general.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
                      {data.general.code}
                    </span>
                    <span className="text-xs" style={{ color: "var(--ag-muted)" }}>{data.general.exchange}</span>
                    <span className="text-xs" style={{ color: "var(--ag-muted)" }}>{data.general.sector}</span>
                    <span className="text-xs" style={{ color: "var(--ag-muted)" }}>{data.general.industry}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: "var(--ag-muted)" }}>Market Cap</div>
                  <div className="text-sm font-bold" style={{ color: "var(--ag-accent)" }}>${fmt(data.highlights.marketCap)}</div>
                </div>
              </div>
              {data.general.description && (
                <p className="text-[11px] mt-2 line-clamp-3" style={{ color: "var(--ag-muted)" }}>
                  {data.general.description}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "var(--ag-border)" }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="px-3 py-1.5 text-xs transition-colors"
                  style={{
                    color: tab === t.id ? "var(--ag-accent)" : "var(--ag-muted)",
                    borderBottom: tab === t.id ? "2px solid var(--ag-accent)" : "2px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <MetricCard label="P/E Ratio" value={data.highlights.peRatio ? data.highlights.peRatio.toFixed(2) : "N/A"} sub="TTM" />
                  <MetricCard label="EPS" value={`$${data.highlights.eps.toFixed(2)}`} sub="Diluted TTM" />
                  <MetricCard label="Revenue" value={`$${fmt(data.highlights.revenue)}`} sub="TTM" />
                  <MetricCard label="EBITDA" value={`$${fmt(data.highlights.ebitda)}`} />
                  <MetricCard label="Profit Margin" value={pct(data.highlights.profitMargin)} />
                  <MetricCard label="ROE" value={pct(data.highlights.roe)} />
                  <MetricCard label="Dividend Yield" value={data.highlights.dividendYield ? pct(data.highlights.dividendYield) : "N/A"} />
                  <MetricCard label="Beta" value={data.highlights.beta.toFixed(2)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                    <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Key Metrics</h3>
                    <MetricRow label="Market Cap" value={`$${fmt(data.highlights.marketCap)}`} />
                    <MetricRow label="Enterprise Value" value={`$${fmt(data.valuation.enterpriseValue)}`} />
                    <MetricRow label="Revenue (TTM)" value={`$${fmt(data.highlights.revenue)}`} />
                    <MetricRow label="Gross Profit (TTM)" value={`$${fmt(data.highlights.grossProfit)}`} />
                    <MetricRow label="Revenue Growth (YoY)" value={pct(data.highlights.revenueGrowth)}
                      color={data.highlights.revenueGrowth > 0 ? "var(--ag-success)" : "var(--ag-error)"} />
                    <MetricRow label="Earnings Growth (YoY)" value={pct(data.highlights.earningsGrowth)}
                      color={data.highlights.earningsGrowth > 0 ? "var(--ag-success)" : "var(--ag-error)"} />
                  </div>

                  <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                    <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Profitability</h3>
                    <GaugeBar label="Profit Margin" value={data.highlights.profitMargin * 100} min={-20} max={60} />
                    <GaugeBar label="Operating Margin" value={data.highlights.operatingMargin * 100} min={-20} max={60} />
                    <GaugeBar label="ROE" value={data.highlights.roe * 100} min={-10} max={50} />
                    <GaugeBar label="ROA" value={data.highlights.roa * 100} min={-5} max={30} />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Company Info</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <div style={{ color: "var(--ag-muted)" }}>Sector</div>
                      <div style={{ color: "var(--ag-text)" }}>{data.general.sector}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ag-muted)" }}>Industry</div>
                      <div style={{ color: "var(--ag-text)" }}>{data.general.industry}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ag-muted)" }}>Employees</div>
                      <div style={{ color: "var(--ag-text)" }}>{data.general.fullTimeEmployees.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--ag-muted)" }}>IPO Date</div>
                      <div style={{ color: "var(--ag-text)" }}>{data.general.ipoDate || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "valuation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Valuation Multiples</h3>
                  <MetricRow label="Trailing P/E" value={data.valuation.trailingPE ? data.valuation.trailingPE.toFixed(2) : "N/A"} />
                  <MetricRow label="Forward P/E" value={data.valuation.forwardPE ? data.valuation.forwardPE.toFixed(2) : "N/A"} />
                  <MetricRow label="PEG Ratio" value={data.highlights.pegRatio ? data.highlights.pegRatio.toFixed(2) : "N/A"} />
                  <MetricRow label="Price/Sales" value={data.valuation.priceSales ? data.valuation.priceSales.toFixed(2) : "N/A"} />
                  <MetricRow label="Price/Book" value={data.valuation.priceBook ? data.valuation.priceBook.toFixed(2) : "N/A"} />
                  <MetricRow label="EV/Revenue" value={data.valuation.evRevenue ? data.valuation.evRevenue.toFixed(2) : "N/A"} />
                  <MetricRow label="EV/EBITDA" value={data.valuation.evEbitda ? data.valuation.evEbitda.toFixed(2) : "N/A"} />
                </div>
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Enterprise Value</h3>
                  <MetricRow label="Enterprise Value" value={`$${fmt(data.valuation.enterpriseValue)}`} />
                  <MetricRow label="Market Cap" value={`$${fmt(data.highlights.marketCap)}`} />
                  <MetricRow label="Wall St. Target" value={data.highlights.wallStreetTarget ? `$${data.highlights.wallStreetTarget.toFixed(2)}` : "N/A"} />
                  <MetricRow label="Shares Outstanding" value={fmt(data.highlights.sharesOutstanding, 0)} />
                  <MetricRow label="Shares Float" value={fmt(data.highlights.sharesFloat, 0)} />

                  {data.dividends && (
                    <>
                      <div className="mt-3 mb-1 text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-accent)" }}>Dividends</div>
                      <MetricRow label="Forward Dividend" value={`$${data.dividends.forwardDividendRate.toFixed(2)}`} />
                      <MetricRow label="Dividend Yield" value={pct(data.dividends.forwardDividendYield)} />
                      <MetricRow label="Payout Ratio" value={pct(data.dividends.payoutRatio)} />
                      <MetricRow label="Ex-Dividend Date" value={data.dividends.exDividendDate || "N/A"} />
                    </>
                  )}
                </div>
              </div>
            )}

            {tab === "financials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Income Statement</h3>
                  <MetricRow label="Revenue (TTM)" value={`$${fmt(data.highlights.revenue)}`} />
                  <MetricRow label="Revenue/Share" value={`$${data.highlights.revenuePerShare.toFixed(2)}`} />
                  <MetricRow label="Gross Profit (TTM)" value={`$${fmt(data.highlights.grossProfit)}`} />
                  <MetricRow label="EBITDA" value={`$${fmt(data.highlights.ebitda)}`} />
                  <MetricRow label="EPS (Diluted)" value={`$${data.highlights.dilutedEps.toFixed(2)}`} />
                  <MetricRow label="Revenue Growth (YoY)" value={pct(data.highlights.revenueGrowth)}
                    color={data.highlights.revenueGrowth > 0 ? "var(--ag-success)" : "var(--ag-error)"} />
                  <MetricRow label="Earnings Growth (YoY)" value={pct(data.highlights.earningsGrowth)}
                    color={data.highlights.earningsGrowth > 0 ? "var(--ag-success)" : "var(--ag-error)"} />
                </div>
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Margins & Returns</h3>
                  <MetricRow label="Profit Margin" value={pct(data.highlights.profitMargin)} />
                  <MetricRow label="Operating Margin" value={pct(data.highlights.operatingMargin)} />
                  <MetricRow label="Return on Equity" value={pct(data.highlights.roe)} />
                  <MetricRow label="Return on Assets" value={pct(data.highlights.roa)} />
                  <MetricRow label="Book Value/Share" value={`$${data.highlights.bookValue.toFixed(2)}`} />
                </div>
              </div>
            )}

            {tab === "technicals" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Price Range</h3>
                  <MetricRow label="52-Week High" value={`$${data.highlights["52WeekHigh"].toFixed(2)}`} />
                  <MetricRow label="52-Week Low" value={`$${data.highlights["52WeekLow"].toFixed(2)}`} />
                  <MetricRow label="50-Day MA" value={`$${data.highlights["50DayMA"].toFixed(2)}`} />
                  <MetricRow label="200-Day MA" value={`$${data.highlights["200DayMA"].toFixed(2)}`} />
                  <MetricRow label="Beta" value={data.highlights.beta.toFixed(2)} />
                </div>
                <div className="p-3 rounded border" style={{ borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>Short Interest</h3>
                  <MetricRow label="Shares Short" value={fmt(data.highlights.sharesShort, 0)} />
                  <MetricRow label="Short Ratio" value={data.highlights.shortRatio.toFixed(2)} />
                  <MetricRow label="Shares Outstanding" value={fmt(data.highlights.sharesOutstanding, 0)} />
                  <MetricRow label="Shares Float" value={fmt(data.highlights.sharesFloat, 0)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
