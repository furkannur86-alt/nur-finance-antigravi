"use client";
import { useState, useCallback, useRef, useEffect } from "react";

/* ── Bloomberg BQL / FLDS-style Data Query Terminal ──────────── */

interface QueryResult {
  ticker: string;
  name: string;
  values: Record<string, string | number>;
}

interface QueryHistory {
  query: string;
  timestamp: string;
  results: number;
}

const FIELD_CATALOG: Record<string, { label: string; desc: string; example: string }> = {
  PX_LAST: { label: "Last Price", desc: "Last traded price", example: "AAPL US Equity" },
  PX_OPEN: { label: "Open Price", desc: "Session open price", example: "185.42" },
  PX_HIGH: { label: "Day High", desc: "Intraday high", example: "187.90" },
  PX_LOW: { label: "Day Low", desc: "Intraday low", example: "184.50" },
  PX_VOLUME: { label: "Volume", desc: "Daily volume traded", example: "52.3M" },
  CHG_PCT_1D: { label: "1D Change %", desc: "One-day percentage change", example: "+1.24%" },
  CHG_PCT_1W: { label: "1W Change %", desc: "One-week change", example: "+3.18%" },
  CHG_PCT_1M: { label: "1M Change %", desc: "One-month change", example: "-2.45%" },
  CHG_PCT_YTD: { label: "YTD Change %", desc: "Year-to-date change", example: "+28.4%" },
  CUR_MKT_CAP: { label: "Market Cap", desc: "Current market capitalization", example: "$2.87T" },
  PE_RATIO: { label: "P/E Ratio", desc: "Price-to-earnings ratio", example: "29.4" },
  PX_TO_BOOK: { label: "P/B Ratio", desc: "Price-to-book ratio", example: "45.2" },
  DIVIDEND_YLD: { label: "Div Yield", desc: "Dividend yield %", example: "0.55%" },
  EPS: { label: "EPS", desc: "Earnings per share (TTM)", example: "6.42" },
  BETA: { label: "Beta", desc: "Beta vs benchmark", example: "1.24" },
  RSI_14D: { label: "RSI (14)", desc: "14-day Relative Strength Index", example: "62.3" },
  VOLATILITY_30D: { label: "30D Vol", desc: "30-day realized volatility", example: "22.4%" },
  SHORT_INT: { label: "Short Interest", desc: "Short interest ratio", example: "1.2%" },
  AVG_VOL_20D: { label: "20D Avg Vol", desc: "20-day average volume", example: "48.1M" },
  REVENUE_TTM: { label: "Revenue (TTM)", desc: "Trailing 12-month revenue", example: "$383.3B" },
};

const DEMO_TICKERS: Record<string, { name: string; sector: string; data: Record<string, string | number> }> = {
  "AAPL": { name: "Apple Inc", sector: "Technology", data: { PX_LAST: 191.24, PX_OPEN: 189.50, PX_HIGH: 192.80, PX_LOW: 188.90, PX_VOLUME: "52.3M", CHG_PCT_1D: 1.24, CHG_PCT_1W: 3.18, CHG_PCT_1M: -2.45, CHG_PCT_YTD: 28.4, CUR_MKT_CAP: "$2.87T", PE_RATIO: 29.4, PX_TO_BOOK: 45.2, DIVIDEND_YLD: 0.55, EPS: 6.42, BETA: 1.24, RSI_14D: 62.3, VOLATILITY_30D: 22.4, SHORT_INT: 1.2, AVG_VOL_20D: "48.1M", REVENUE_TTM: "$383.3B" }},
  "MSFT": { name: "Microsoft Corp", sector: "Technology", data: { PX_LAST: 378.91, PX_OPEN: 375.20, PX_HIGH: 380.50, PX_LOW: 374.80, PX_VOLUME: "21.8M", CHG_PCT_1D: 0.87, CHG_PCT_1W: 2.44, CHG_PCT_1M: 4.12, CHG_PCT_YTD: 42.1, CUR_MKT_CAP: "$2.81T", PE_RATIO: 35.2, PX_TO_BOOK: 12.8, DIVIDEND_YLD: 0.72, EPS: 10.76, BETA: 0.92, RSI_14D: 58.7, VOLATILITY_30D: 19.8, SHORT_INT: 0.8, AVG_VOL_20D: "22.4M", REVENUE_TTM: "$227.6B" }},
  "GOOGL": { name: "Alphabet Inc", sector: "Technology", data: { PX_LAST: 141.56, PX_OPEN: 139.80, PX_HIGH: 142.30, PX_LOW: 139.10, PX_VOLUME: "24.5M", CHG_PCT_1D: 1.56, CHG_PCT_1W: 4.23, CHG_PCT_1M: 7.89, CHG_PCT_YTD: 51.2, CUR_MKT_CAP: "$1.74T", PE_RATIO: 24.1, PX_TO_BOOK: 6.4, DIVIDEND_YLD: 0.0, EPS: 5.80, BETA: 1.08, RSI_14D: 67.4, VOLATILITY_30D: 25.1, SHORT_INT: 1.1, AVG_VOL_20D: "25.8M", REVENUE_TTM: "$307.4B" }},
  "AMZN": { name: "Amazon.com Inc", sector: "Consumer", data: { PX_LAST: 153.42, PX_OPEN: 151.20, PX_HIGH: 154.80, PX_LOW: 150.90, PX_VOLUME: "45.2M", CHG_PCT_1D: 2.12, CHG_PCT_1W: 5.67, CHG_PCT_1M: 8.34, CHG_PCT_YTD: 55.8, CUR_MKT_CAP: "$1.58T", PE_RATIO: 62.4, PX_TO_BOOK: 8.9, DIVIDEND_YLD: 0.0, EPS: 2.46, BETA: 1.18, RSI_14D: 71.2, VOLATILITY_30D: 28.3, SHORT_INT: 1.4, AVG_VOL_20D: "47.9M", REVENUE_TTM: "$574.8B" }},
  "NVDA": { name: "NVIDIA Corp", sector: "Technology", data: { PX_LAST: 495.22, PX_OPEN: 488.50, PX_HIGH: 498.90, PX_LOW: 486.20, PX_VOLUME: "38.7M", CHG_PCT_1D: 3.45, CHG_PCT_1W: 8.92, CHG_PCT_1M: 15.67, CHG_PCT_YTD: 198.4, CUR_MKT_CAP: "$1.22T", PE_RATIO: 65.8, PX_TO_BOOK: 42.1, DIVIDEND_YLD: 0.04, EPS: 7.52, BETA: 1.72, RSI_14D: 74.8, VOLATILITY_30D: 42.6, SHORT_INT: 2.1, AVG_VOL_20D: "41.2M", REVENUE_TTM: "$44.9B" }},
  "TSLA": { name: "Tesla Inc", sector: "Consumer", data: { PX_LAST: 238.45, PX_OPEN: 234.80, PX_HIGH: 241.20, PX_LOW: 233.50, PX_VOLUME: "98.4M", CHG_PCT_1D: 2.89, CHG_PCT_1W: -1.24, CHG_PCT_1M: -8.90, CHG_PCT_YTD: 92.1, CUR_MKT_CAP: "$754B", PE_RATIO: 72.5, PX_TO_BOOK: 15.6, DIVIDEND_YLD: 0.0, EPS: 3.29, BETA: 2.04, RSI_14D: 48.9, VOLATILITY_30D: 52.8, SHORT_INT: 3.4, AVG_VOL_20D: "101.5M", REVENUE_TTM: "$96.8B" }},
  "JPM": { name: "JPMorgan Chase", sector: "Financials", data: { PX_LAST: 158.72, PX_OPEN: 157.40, PX_HIGH: 159.80, PX_LOW: 156.90, PX_VOLUME: "8.9M", CHG_PCT_1D: 0.45, CHG_PCT_1W: 1.88, CHG_PCT_1M: 3.42, CHG_PCT_YTD: 18.9, CUR_MKT_CAP: "$462B", PE_RATIO: 11.2, PX_TO_BOOK: 1.8, DIVIDEND_YLD: 2.52, EPS: 14.17, BETA: 1.12, RSI_14D: 55.4, VOLATILITY_30D: 18.9, SHORT_INT: 0.9, AVG_VOL_20D: "9.4M", REVENUE_TTM: "$154.8B" }},
  "GS": { name: "Goldman Sachs", sector: "Financials", data: { PX_LAST: 362.18, PX_OPEN: 358.90, PX_HIGH: 364.50, PX_LOW: 357.20, PX_VOLUME: "2.4M", CHG_PCT_1D: 0.78, CHG_PCT_1W: 2.56, CHG_PCT_1M: 5.12, CHG_PCT_YTD: 12.4, CUR_MKT_CAP: "$124B", PE_RATIO: 14.8, PX_TO_BOOK: 1.3, DIVIDEND_YLD: 2.78, EPS: 24.47, BETA: 1.38, RSI_14D: 61.2, VOLATILITY_30D: 24.5, SHORT_INT: 1.6, AVG_VOL_20D: "2.8M", REVENUE_TTM: "$46.3B" }},
  "XOM": { name: "Exxon Mobil", sector: "Energy", data: { PX_LAST: 104.56, PX_OPEN: 103.80, PX_HIGH: 105.20, PX_LOW: 103.10, PX_VOLUME: "14.2M", CHG_PCT_1D: -0.34, CHG_PCT_1W: -1.89, CHG_PCT_1M: -4.56, CHG_PCT_YTD: -5.2, CUR_MKT_CAP: "$424B", PE_RATIO: 11.8, PX_TO_BOOK: 2.1, DIVIDEND_YLD: 3.52, EPS: 8.86, BETA: 0.84, RSI_14D: 42.1, VOLATILITY_30D: 21.3, SHORT_INT: 0.7, AVG_VOL_20D: "15.8M", REVENUE_TTM: "$344.6B" }},
  "JNJ": { name: "Johnson & Johnson", sector: "Healthcare", data: { PX_LAST: 156.89, PX_OPEN: 157.20, PX_HIGH: 158.40, PX_LOW: 155.80, PX_VOLUME: "6.8M", CHG_PCT_1D: -0.12, CHG_PCT_1W: 0.45, CHG_PCT_1M: -1.23, CHG_PCT_YTD: -4.8, CUR_MKT_CAP: "$378B", PE_RATIO: 24.6, PX_TO_BOOK: 5.8, DIVIDEND_YLD: 3.01, EPS: 6.38, BETA: 0.52, RSI_14D: 45.8, VOLATILITY_30D: 14.2, SHORT_INT: 0.5, AVG_VOL_20D: "7.2M", REVENUE_TTM: "$85.2B" }},
};

const DEMO_QUERIES: Record<string, { desc: string; tickers: string[]; fields: string[] }> = {
  "BQL: get(px_last, chg_pct_1d, pe_ratio) for('AAPL','MSFT','GOOGL','NVDA')": {
    desc: "Mega-cap tech pricing",
    tickers: ["AAPL", "MSFT", "GOOGL", "NVDA"],
    fields: ["PX_LAST", "CHG_PCT_1D", "PE_RATIO"],
  },
  "FLDS: TOP_20_HOLDINGS for('SPY US Equity')": {
    desc: "S&P 500 ETF top holdings",
    tickers: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"],
    fields: ["PX_LAST", "CUR_MKT_CAP", "CHG_PCT_YTD"],
  },
  "BQL: get(pe_ratio, px_to_book, dividend_yld, beta) for('JPM','GS','XOM','JNJ')": {
    desc: "Value screen fundamentals",
    tickers: ["JPM", "GS", "XOM", "JNJ"],
    fields: ["PE_RATIO", "PX_TO_BOOK", "DIVIDEND_YLD", "BETA"],
  },
  "FLDS: EARNINGS for('TSLA','NVDA','AMZN')": {
    desc: "Earnings data for selected stocks",
    tickers: ["TSLA", "NVDA", "AMZN"],
    fields: ["EPS", "PE_RATIO", "REVENUE_TTM", "CHG_PCT_YTD"],
  },
};

function parseQuery(raw: string): { tickers: string[]; fields: string[] } {
  const upper = raw.toUpperCase();
  const tickers = Object.keys(DEMO_TICKERS).filter(t => upper.includes(t));
  const fields = Object.keys(FIELD_CATALOG).filter(f => upper.includes(f));
  if (tickers.length === 0) {
    return { tickers: Object.keys(DEMO_TICKERS).slice(0, 5), fields: fields.length ? fields : ["PX_LAST", "CHG_PCT_1D", "CUR_MKT_CAP"] };
  }
  return { tickers, fields: fields.length ? fields : ["PX_LAST", "CHG_PCT_1D", "PE_RATIO", "CUR_MKT_CAP"] };
}

function fmtVal(v: string | number, field: string): string {
  if (typeof v === "string") return v;
  if (field.includes("CHG_PCT")) return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  if (field.includes("YLD") || field.includes("SHORT_INT")) return `${v.toFixed(2)}%`;
  if (field.includes("VOLATILITY")) return `${v.toFixed(1)}%`;
  if (field === "PX_LAST" || field === "PX_OPEN" || field === "PX_HIGH" || field === "PX_LOW") return `$${v.toFixed(2)}`;
  return v.toFixed(2);
}

function chgColor(v: string | number): string {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (isNaN(n)) return "#c9d1d9";
  return n > 0 ? "#00e5a0" : n < 0 ? "#ff4d6a" : "#c9d1d9";
}

export default function DataQueryTerminal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [tab, setTab] = useState<"query" | "catalog" | "saved">("query");
  const inputRef = useRef<HTMLInputElement>(null);

  const executeQuery = useCallback((q: string) => {
    const preset = DEMO_QUERIES[q];
    let tickers: string[], flds: string[];
    if (preset) {
      tickers = preset.tickers;
      flds = preset.fields;
    } else {
      const parsed = parseQuery(q);
      tickers = parsed.tickers;
      flds = parsed.fields;
    }
    const rows: QueryResult[] = tickers.map(t => {
      const d = DEMO_TICKERS[t];
      if (!d) return { ticker: t, name: t, values: {} };
      const values: Record<string, string | number> = {};
      flds.forEach(f => { if (d.data[f] !== undefined) values[f] = d.data[f]; });
      return { ticker: t, name: d.name, values };
    });
    setResults(rows);
    setFields(flds);
    setHistory(prev => [{ query: q, timestamp: new Date().toLocaleTimeString(), results: rows.length }, ...prev.slice(0, 19)]);
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const accent = "#00e5a0";
  const bg = "#0a0e17";
  const surface = "#111827";
  const border = "#1e293b";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#94a3b8";

  return (
    <div style={{ background: bg, color: textPrimary, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>NUR QUERY LANGUAGE</span>
          <span style={{ color: textSecondary, fontSize: 11 }}>v2.1 // BQL-Compatible Data Terminal</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["query", "catalog", "saved"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${tab === t ? accent : border}`,
              background: tab === t ? `${accent}18` : "transparent", color: tab === t ? accent : textSecondary, cursor: "pointer", textTransform: "uppercase"
            }}>{t === "query" ? "TERMINAL" : t === "catalog" ? "FLDS CATALOG" : "HISTORY"}</button>
          ))}
        </div>
      </div>

      {tab === "query" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Query Input */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#fbbf24", fontWeight: 700, lineHeight: "32px" }}>NQL&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && query.trim()) executeQuery(query.trim()); }}
                placeholder="BQL: get(px_last, chg_pct_1d) for('AAPL','MSFT') // or type any tickers + fields"
                style={{ flex: 1, background: `${surface}`, border: `1px solid ${border}`, color: textPrimary, padding: "6px 12px", borderRadius: 4, fontFamily: "inherit", fontSize: 13, outline: "none" }}
              />
              <button onClick={() => query.trim() && executeQuery(query.trim())} style={{
                padding: "6px 16px", background: accent, color: bg, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12
              }}>RUN</button>
            </div>
            {/* Preset queries */}
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(DEMO_QUERIES).map(([q, v]) => (
                <button key={q} onClick={() => { setQuery(q); executeQuery(q); }} style={{
                  padding: "3px 8px", fontSize: 10, background: `${accent}10`, border: `1px solid ${border}`, color: textSecondary, borderRadius: 3, cursor: "pointer", fontFamily: "inherit"
                }} title={q}>{v.desc}</button>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
            {results.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>TICKER</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>NAME</th>
                    {fields.map(f => (
                      <th key={f} style={{ padding: "8px 12px", textAlign: "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>
                        {FIELD_CATALOG[f]?.label ?? f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}` }}>{r.ticker}</td>
                      <td style={{ padding: "8px 12px", color: textSecondary, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{r.name}</td>
                      {fields.map(f => {
                        const v = r.values[f];
                        return (
                          <td key={f} style={{
                            padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, fontWeight: 600, fontVariantNumeric: "tabular-nums",
                            color: f.includes("CHG") ? chgColor(v ?? 0) : textPrimary
                          }}>
                            {v !== undefined ? fmtVal(v, f) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: textSecondary }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⌨</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}>Enter a query to begin</div>
                <div style={{ fontSize: 11 }}>
                  Syntax: <span style={{ color: accent }}>BQL: get(field1, field2) for(&apos;TICKER1&apos;,&apos;TICKER2&apos;)</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 4 }}>
                  Or simply type ticker names and field names separated by spaces
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          {results.length > 0 && (
            <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: textSecondary }}>Rows: <span style={{ color: accent }}>{results.length}</span> | Fields: <span style={{ color: accent }}>{fields.length}</span></span>
              <span style={{ color: textSecondary }}>DEMO MODE — Real-time data requires NUR Finance B subscription</span>
            </div>
          )}
        </div>
      )}

      {tab === "catalog" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>FIELD CATALOG — {Object.keys(FIELD_CATALOG).length} Fields Available</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>FIELD CODE</th>
                <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>LABEL</th>
                <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>DESCRIPTION</th>
                <th style={{ padding: "6px 12px", textAlign: "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>EXAMPLE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(FIELD_CATALOG).map(([code, f], i) => (
                <tr key={code} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60`, cursor: "pointer" }}
                    onClick={() => { setQuery(prev => prev ? `${prev}, ${code}` : code); setTab("query"); }}>
                  <td style={{ padding: "6px 12px", fontWeight: 700, color: "#fbbf24", borderBottom: `1px solid ${border}`, fontSize: 12 }}>{code}</td>
                  <td style={{ padding: "6px 12px", borderBottom: `1px solid ${border}`, fontSize: 12 }}>{f.label}</td>
                  <td style={{ padding: "6px 12px", color: textSecondary, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{f.desc}</td>
                  <td style={{ padding: "6px 12px", textAlign: "right", color: textSecondary, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{f.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "saved" && (
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>QUERY HISTORY — {history.length} entries</div>
          {history.length === 0 ? (
            <div style={{ color: textSecondary, padding: 40, textAlign: "center" }}>No queries executed yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>TIME</th>
                  <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>QUERY</th>
                  <th style={{ padding: "6px 12px", textAlign: "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>RESULTS</th>
                  <th style={{ padding: "6px 12px", textAlign: "center", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "6px 12px", color: textSecondary, borderBottom: `1px solid ${border}`, fontSize: 12 }}>{h.timestamp}</td>
                    <td style={{ padding: "6px 12px", borderBottom: `1px solid ${border}`, fontSize: 11, fontFamily: "inherit", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.query}</td>
                    <td style={{ padding: "6px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: accent }}>{h.results}</td>
                    <td style={{ padding: "6px 12px", textAlign: "center", borderBottom: `1px solid ${border}` }}>
                      <button onClick={() => { setQuery(h.query); executeQuery(h.query); setTab("query"); }} style={{
                        padding: "2px 8px", fontSize: 10, background: `${accent}18`, border: `1px solid ${border}`, color: accent, borderRadius: 3, cursor: "pointer"
                      }}>RE-RUN</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
