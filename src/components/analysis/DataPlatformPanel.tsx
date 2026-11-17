"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const PROVIDERS = [
  { name: "EODHD", category: "Market Data", endpoints: 42, status: "LIVE", lastSync: "2s ago", latency: 45, color: "#22c55e" },
  { name: "FRED", category: "Macro", endpoints: 87, status: "LIVE", lastSync: "5m ago", latency: 120, color: "#38bdf8" },
  { name: "SEC Edgar", category: "Filings", endpoints: 28, status: "LIVE", lastSync: "1m ago", latency: 85, color: "#fbbf24" },
  { name: "Yahoo Finance", category: "Market Data", endpoints: 35, status: "LIVE", lastSync: "10s ago", latency: 62, color: "#a855f7" },
  { name: "Polygon.io", category: "Market Data", endpoints: 56, status: "LIVE", lastSync: "1s ago", latency: 32, color: "#06b6d4" },
  { name: "Alpha Vantage", category: "Market Data", endpoints: 31, status: "DEGRADED", lastSync: "15m ago", latency: 450, color: "#f97316" },
  { name: "Quandl", category: "Alt Data", endpoints: 24, status: "LIVE", lastSync: "30m ago", latency: 180, color: "#10b981" },
  { name: "IEX Cloud", category: "Market Data", endpoints: 48, status: "LIVE", lastSync: "3s ago", latency: 28, color: "#e879f9" },
  { name: "Finnhub", category: "Market Data", endpoints: 39, status: "LIVE", lastSync: "5s ago", latency: 55, color: "#22d3ee" },
  { name: "CoinGecko", category: "Crypto", endpoints: 22, status: "RATE_LIMIT", lastSync: "2m ago", latency: 320, color: "#f59e0b" },
  { name: "OpenFIGI", category: "Reference", endpoints: 8, status: "LIVE", lastSync: "1h ago", latency: 95, color: "#94a3b8" },
  { name: "World Bank", category: "Macro", endpoints: 15, status: "LIVE", lastSync: "6h ago", latency: 210, color: "#34d399" },
];

const PIPELINES = [
  { name: "EOD Price Sync", provider: "EODHD", schedule: "Daily 18:00 UTC", lastRun: "2026-11-17 18:00", status: "SUCCESS", records: 12480, duration: "2m 14s" },
  { name: "FRED Macro Update", provider: "FRED", schedule: "Daily 14:30 UTC", lastRun: "2026-11-17 14:30", status: "SUCCESS", records: 342, duration: "45s" },
  { name: "SEC Filing Crawler", provider: "SEC Edgar", schedule: "Every 15m", lastRun: "2026-11-17 19:45", status: "RUNNING", records: 89, duration: "—" },
  { name: "Crypto Market Data", provider: "CoinGecko", schedule: "Every 5m", lastRun: "2026-11-17 19:40", status: "FAILED", records: 0, duration: "12s" },
  { name: "FX Rates Snapshot", provider: "Polygon.io", schedule: "Every 1m", lastRun: "2026-11-17 19:49", status: "SUCCESS", records: 156, duration: "3s" },
];

const CONNECTORS = [
  { provider: "EODHD", connected: true, keyMask: "sk-...8f4a", addedOn: "2026-08-12", calls: 42850, limit: 100000 },
  { provider: "FRED", connected: true, keyMask: "fd-...b2e1", addedOn: "2026-07-01", calls: 18200, limit: 120000 },
  { provider: "SEC Edgar", connected: true, keyMask: "ua-...nur@", addedOn: "2026-09-15", calls: 5600, limit: null },
  { provider: "Yahoo Finance", connected: true, keyMask: "—", addedOn: "2026-06-20", calls: 95400, limit: null },
  { provider: "Polygon.io", connected: true, keyMask: "pk-...9d3f", addedOn: "2026-08-30", calls: 128000, limit: 500000 },
  { provider: "Alpha Vantage", connected: true, keyMask: "av-...c7a2", addedOn: "2026-10-05", calls: 4800, limit: 5000 },
  { provider: "Quandl", connected: false, keyMask: "—", addedOn: "—", calls: 0, limit: null },
  { provider: "IEX Cloud", connected: true, keyMask: "ix-...e1b8", addedOn: "2026-09-22", calls: 67300, limit: 200000 },
  { provider: "Finnhub", connected: true, keyMask: "fh-...4a9c", addedOn: "2026-10-15", calls: 31200, limit: 60000 },
  { provider: "CoinGecko", connected: true, keyMask: "cg-...7f2d", addedOn: "2026-11-01", calls: 9800, limit: 10000 },
  { provider: "OpenFIGI", connected: false, keyMask: "—", addedOn: "—", calls: 0, limit: null },
  { provider: "World Bank", connected: true, keyMask: "—", addedOn: "2026-06-15", calls: 2100, limit: null },
];

const SAMPLE_JSON = `{
  "symbol": "AAPL",
  "close": 245.82,
  "open": 243.50,
  "high": 247.10,
  "low": 242.80,
  "volume": 54832100,
  "date": "2026-11-17",
  "adjusted_close": 245.82,
  "exchange": "NASDAQ"
}`;

type Tab = "providers" | "explorer" | "pipelines" | "connectors";

export default function DataPlatformPanel() {
  const [tab, setTab] = useState<Tab>("providers");
  const [selProvider, setSelProvider] = useState("EODHD");
  const [selCategory, setSelCategory] = useState("eod");
  const [selEndpoint, setSelEndpoint] = useState("/eod/{symbol}");

  const liveCount = PROVIDERS.filter(p => p.status === "LIVE").length;
  const totalEndpoints = PROVIDERS.reduce((s, p) => s + p.endpoints, 0);
  const connectedCount = CONNECTORS.filter(c => c.connected).length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🔌</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>DATA PLATFORM</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>OpenBB-Style ODP</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["providers", "explorer", "pipelines", "connectors"] as Tab[]).map(t => (
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
          { label: "PROVIDERS", value: `${liveCount}/${PROVIDERS.length} live`, color: "#22c55e" },
          { label: "ENDPOINTS", value: totalEndpoints.toString(), color: "#38bdf8" },
          { label: "CONNECTED", value: `${connectedCount} keys`, color: "#fbbf24" },
          { label: "PIPELINES", value: `${PIPELINES.filter(p => p.status === "SUCCESS" || p.status === "RUNNING").length}/${PIPELINES.length} ok`, color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "providers" && (
          <div className="grid grid-cols-3 gap-2">
            {PROVIDERS.map(p => (
              <div key={p.name} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === "LIVE" ? "#22c55e" : p.status === "DEGRADED" ? "#fbbf24" : "#ef4444" }} />
                    <span className="font-bold text-[10px]" style={{ color: p.color }}>{p.name}</span>
                  </div>
                  <span className="text-[7px] px-1 py-0.5 rounded font-bold"
                    style={{
                      background: p.status === "LIVE" ? "rgba(34,197,94,0.1)" : p.status === "DEGRADED" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)",
                      color: p.status === "LIVE" ? "#22c55e" : p.status === "DEGRADED" ? "#fbbf24" : "#ef4444"
                    }}>
                    {p.status}
                  </span>
                </div>
                <div className="text-[8px]" style={{ color: "#64748b" }}>{p.category}</div>
                <div className="flex justify-between mt-1 text-[8px]">
                  <span style={{ color: "#94a3b8" }}>{p.endpoints} endpoints</span>
                  <span style={{ color: "#64748b" }}>{p.lastSync}</span>
                </div>
                <div className="mt-1.5">
                  <div className="flex justify-between text-[7px] mb-0.5">
                    <span style={{ color: "#64748b" }}>Latency</span>
                    <span className="font-mono" style={{ color: p.latency < 100 ? "#22c55e" : p.latency < 300 ? "#fbbf24" : "#ef4444" }}>{p.latency}ms</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(p.latency / 5, 100)}%`, background: p.latency < 100 ? "#22c55e" : p.latency < 300 ? "#fbbf24" : "#ef4444" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "explorer" && (
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>DATA QUERY BUILDER</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-[8px] block mb-1" style={{ color: "#64748b" }}>Provider</label>
                  <select value={selProvider} onChange={e => setSelProvider(e.target.value)}
                    className="w-full px-2 py-1 rounded text-[10px]"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {PROVIDERS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[8px] block mb-1" style={{ color: "#64748b" }}>Category</label>
                  <select value={selCategory} onChange={e => setSelCategory(e.target.value)}
                    className="w-full px-2 py-1 rounded text-[10px]"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <option value="eod">End of Day</option>
                    <option value="intraday">Intraday</option>
                    <option value="fundamentals">Fundamentals</option>
                    <option value="options">Options</option>
                    <option value="macro">Macroeconomic</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] block mb-1" style={{ color: "#64748b" }}>Endpoint</label>
                  <select value={selEndpoint} onChange={e => setSelEndpoint(e.target.value)}
                    className="w-full px-2 py-1 rounded text-[10px]"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <option value="/eod/{symbol}">/eod/&#123;symbol&#125;</option>
                    <option value="/eod/bulk">/eod/bulk</option>
                    <option value="/real-time/{symbol}">/real-time/&#123;symbol&#125;</option>
                    <option value="/fundamentals/{symbol}">/fundamentals/&#123;symbol&#125;</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 px-2 py-1 rounded font-mono text-[9px]" style={{ background: "rgba(0,0,0,0.3)", color: "#00e5a0" }}>
                  GET https://api.{selProvider.toLowerCase().replace(/\s/g, "")}.com{selEndpoint.replace("{symbol}", "AAPL")}
                </div>
                <button className="px-3 py-1 rounded text-[9px] font-bold" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0" }}>
                  RUN
                </button>
              </div>
            </div>

            <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RESPONSE</span>
                <div className="flex gap-2 text-[8px]">
                  <span style={{ color: "#22c55e" }}>200 OK</span>
                  <span style={{ color: "#64748b" }}>45ms</span>
                  <span style={{ color: "#64748b" }}>JSON</span>
                </div>
              </div>
              <pre className="font-mono text-[9px] p-2 rounded overflow-auto" style={{ background: "rgba(0,0,0,0.3)", color: "#e2e8f0", maxHeight: 200 }}>
                {SAMPLE_JSON}
              </pre>
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT QUERIES</div>
            {[
              { query: "GET /eod/AAPL", time: "2m ago", status: 200, latency: "45ms" },
              { query: "GET /fundamentals/MSFT", time: "8m ago", status: 200, latency: "120ms" },
              { query: "GET /real-time/TSLA", time: "12m ago", status: 200, latency: "32ms" },
              { query: "GET /macro/GDP", time: "25m ago", status: 200, latency: "95ms" },
              { query: "GET /eod/bulk?exchange=US", time: "1h ago", status: 429, latency: "—" },
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono" style={{ color: "#00e5a0" }}>{q.query}</span>
                <div className="flex gap-3">
                  <span style={{ color: q.status === 200 ? "#22c55e" : "#ef4444" }}>{q.status}</span>
                  <span style={{ color: "#64748b" }}>{q.latency}</span>
                  <span style={{ color: "#64748b" }}>{q.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "pipelines" && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>SCHEDULED DATA PIPELINES</div>
            {PIPELINES.map((p, i) => (
              <div key={i} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: p.status === "SUCCESS" ? "#22c55e" : p.status === "RUNNING" ? "#38bdf8" : "#ef4444",
                      animation: p.status === "RUNNING" ? "pulse 1.5s infinite" : "none"
                    }} />
                    <span className="font-bold" style={{ color: "#00e5a0" }}>{p.name}</span>
                    <span className="text-[9px]" style={{ color: "#64748b" }}>via {p.provider}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{
                      background: p.status === "SUCCESS" ? "rgba(34,197,94,0.15)" : p.status === "RUNNING" ? "rgba(56,189,248,0.15)" : "rgba(239,68,68,0.15)",
                      color: p.status === "SUCCESS" ? "#22c55e" : p.status === "RUNNING" ? "#38bdf8" : "#ef4444"
                    }}>
                    {p.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Schedule:</span> <span style={{ color: "#e2e8f0" }}>{p.schedule}</span></div>
                  <div><span style={{ color: "#64748b" }}>Last Run:</span> <span className="font-mono" style={{ color: "#94a3b8" }}>{p.lastRun}</span></div>
                  <div><span style={{ color: "#64748b" }}>Records:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{p.records.toLocaleString()}</span></div>
                  <div><span style={{ color: "#64748b" }}>Duration:</span> <span className="font-mono" style={{ color: "#e2e8f0" }}>{p.duration}</span></div>
                </div>
              </div>
            ))}

            <div className="mt-3 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,229,160,0.1)" }}>
              <div className="text-[9px] font-bold mb-2" style={{ color: "#fbbf24" }}>PIPELINE HEALTH (24h)</div>
              <div className="flex gap-1" style={{ height: 40 }}>
                {Array.from({ length: 24 }, (_, h) => {
                  const success = Math.random() > 0.15;
                  return (
                    <div key={h} className="flex-1 rounded-sm" title={`${h}:00 — ${success ? "OK" : "FAIL"}`}
                      style={{ background: success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }} />
                  );
                })}
              </div>
              <div className="flex justify-between text-[7px] mt-1" style={{ color: "#64748b" }}>
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span>
              </div>
            </div>
          </div>
        )}

        {tab === "connectors" && (
          <div className="space-y-2">
            <div className="text-[9px] font-bold mb-1" style={{ color: "#fbbf24" }}>API KEY MANAGEMENT</div>
            {CONNECTORS.map((c, i) => {
              const usagePct = c.limit ? (c.calls / c.limit) * 100 : null;
              return (
                <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.connected ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: c.connected ? "#22c55e" : "#ef4444" }} />
                      <span className="font-bold" style={{ color: c.connected ? "#00e5a0" : "#ef4444" }}>{c.provider}</span>
                    </div>
                    {c.connected ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>CONNECTED</span>
                    ) : (
                      <button className="px-2 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
                        + ADD KEY
                      </button>
                    )}
                  </div>
                  {c.connected && (
                    <div className="grid grid-cols-4 gap-2 text-[9px]">
                      <div><span style={{ color: "#64748b" }}>Key:</span> <span className="font-mono" style={{ color: "#94a3b8" }}>{c.keyMask}</span></div>
                      <div><span style={{ color: "#64748b" }}>Added:</span> <span style={{ color: "#94a3b8" }}>{c.addedOn}</span></div>
                      <div><span style={{ color: "#64748b" }}>Calls:</span> <span className="font-mono" style={{ color: "#38bdf8" }}>{c.calls.toLocaleString()}</span></div>
                      <div>
                        {c.limit ? (
                          <span style={{ color: "#64748b" }}>Limit: <span className="font-mono" style={{ color: usagePct! > 90 ? "#ef4444" : usagePct! > 70 ? "#fbbf24" : "#e2e8f0" }}>{usagePct!.toFixed(0)}%</span></span>
                        ) : (
                          <span style={{ color: "#64748b" }}>Limit: <span style={{ color: "#22c55e" }}>Unlimited</span></span>
                        )}
                      </div>
                    </div>
                  )}
                  {c.connected && c.limit && (
                    <div className="mt-1.5 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${usagePct}%`, background: usagePct! > 90 ? "#ef4444" : usagePct! > 70 ? "#fbbf24" : "#22c55e" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
