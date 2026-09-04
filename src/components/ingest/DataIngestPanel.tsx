"use client";

import { useState, useRef, useCallback } from "react";

interface ExchangeProgress {
  code: string;
  name: string;
  country: string;
  region: string;
  status: "pending" | "syncing" | "downloading" | "done" | "error" | "skipped";
  stockCount?: number;
  processed?: number;
  failed?: number;
  current?: number;
  lastStock?: string;
  error?: string;
}

interface IngestLog {
  time: string;
  type: "info" | "success" | "error" | "warn";
  text: string;
}

const REGIONS = ["US", "Europe", "Asia", "Americas", "MiddleEast", "Africa"];
const REGION_LABELS: Record<string, string> = {
  US: "United States",
  Europe: "Europe",
  Asia: "Asia-Pacific",
  Americas: "Americas",
  MiddleEast: "Middle East",
  Africa: "Africa",
};

export default function DataIngestPanel() {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("1990-01-01");
  const [stockType, setStockType] = useState("Common Stock");
  const [limitPerExchange, setLimitPerExchange] = useState(0);
  const [exchanges, setExchanges] = useState<Map<string, ExchangeProgress>>(new Map());
  const [logs, setLogs] = useState<IngestLog[]>([]);
  const [stats, setStats] = useState({ totalExchanges: 0, totalStocks: 0, processed: 0, failed: 0 });
  const [currentExchange, setCurrentExchange] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const addLog = useCallback((type: IngestLog["type"], text: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { time, type, text }]);
  }, []);

  const toggleRegion = (r: string) => {
    setSelectedRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  };

  const selectAll = () => setSelectedRegions([...REGIONS]);
  const selectNone = () => setSelectedRegions([]);

  const startIngest = async () => {
    setRunning(true);
    setCompleted(false);
    setExchanges(new Map());
    setLogs([]);
    setStats({ totalExchanges: 0, totalStocks: 0, processed: 0, failed: 0 });
    setCurrentExchange(null);

    const controller = new AbortController();
    abortRef.current = controller;

    addLog("info", "Starting global data ingestion...");

    try {
      const res = await fetch("/api/ingest-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromDate,
          stockType,
          limit: limitPerExchange || undefined,
          regions: selectedRegions.length > 0 ? selectedRegions : undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        addLog("error", `Failed to start: ${res.statusText}`);
        setRunning(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            handleEvent(event);
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        addLog("error", `Connection error: ${(err as Error).message}`);
      }
    }

    setRunning(false);
    setCompleted(true);
  };

  const handleEvent = (event: Record<string, unknown>) => {
    switch (event.type) {
      case "start":
        setStats((s) => ({ ...s, totalExchanges: event.totalExchanges as number }));
        addLog("info", `Target: ${event.totalExchanges} exchanges from ${event.fromDate}`);
        break;

      case "seeded":
        addLog("success", `Exchange definitions seeded: ${event.count}`);
        break;

      case "exchange-start": {
        const code = event.exchange as string;
        setCurrentExchange(code);
        setExchanges((prev) => {
          const next = new Map(prev);
          next.set(code, {
            code,
            name: event.name as string,
            country: event.country as string,
            region: event.region as string,
            status: "syncing",
          });
          return next;
        });
        addLog("info", `[${event.index}/${event.total}] ${event.name} (${event.country})`);
        break;
      }

      case "stocks-synced":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) ex.status = "downloading";
          return next;
        });
        break;

      case "downloading":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) {
            ex.stockCount = event.stockCount as number;
            ex.status = "downloading";
          }
          return next;
        });
        setStats((s) => ({ ...s, totalStocks: s.totalStocks + (event.stockCount as number) }));
        addLog("info", `  Downloading ${event.stockCount} stocks...`);
        break;

      case "progress":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) {
            ex.current = event.current as number;
            ex.processed = event.processed as number;
            ex.failed = event.failed as number;
            ex.lastStock = event.lastStock as string;
          }
          return next;
        });
        break;

      case "exchange-done":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) {
            ex.status = "done";
            ex.processed = event.processed as number;
            ex.failed = event.failed as number;
          }
          return next;
        });
        setStats((s) => ({
          ...s,
          processed: s.processed + (event.processed as number),
          failed: s.failed + (event.failed as number),
        }));
        addLog("success", `  Done: ${event.processed} OK, ${event.failed} failed`);
        break;

      case "exchange-skip":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) ex.status = "skipped";
          return next;
        });
        addLog("warn", `  Skipped: ${event.reason}`);
        break;

      case "exchange-error":
        setExchanges((prev) => {
          const next = new Map(prev);
          const ex = next.get(event.exchange as string);
          if (ex) {
            ex.status = "error";
            ex.error = event.error as string;
          }
          return next;
        });
        addLog("error", `  Error: ${event.error}`);
        break;

      case "complete":
        addLog("success", `Complete! ${event.totalProcessed} stocks processed, ${event.totalFailed} failed across ${event.totalExchanges} exchanges`);
        setCurrentExchange(null);
        break;

      case "error":
        addLog("error", `Fatal: ${event.error}`);
        break;
    }
  };

  const stopIngest = () => {
    abortRef.current?.abort();
    addLog("warn", "Ingestion stopped by user");
  };

  const doneCount = Array.from(exchanges.values()).filter((e) => e.status === "done" || e.status === "error" || e.status === "skipped").length;
  const progressPct = stats.totalExchanges > 0 ? Math.round((doneCount / stats.totalExchanges) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(0,212,170,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ag-accent)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>
              Global Data Ingestion
            </h2>
            <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
              Download historical stock data from all world exchanges back to 1990
            </p>
          </div>
        </div>
        {running && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--ag-warning)" }} />
            <span className="text-xs" style={{ color: "var(--ag-warning)" }}>Running</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Controls + Exchange Status */}
        <div className="w-80 flex-shrink-0 border-r overflow-y-auto" style={{ borderColor: "var(--ag-border)" }}>
          {/* Region Selection */}
          <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--ag-text)" }}>Regions</span>
              <div className="flex gap-1">
                <button onClick={selectAll} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: "var(--ag-accent)" }}>All</button>
                <button onClick={selectNone} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: "var(--ag-muted)" }}>None</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRegion(r)}
                  disabled={running}
                  className="px-2 py-1 text-[11px] rounded transition-colors"
                  style={{
                    background: selectedRegions.includes(r) ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.03)",
                    color: selectedRegions.includes(r) ? "var(--ag-accent)" : "var(--ag-muted)",
                    border: `1px solid ${selectedRegions.includes(r) ? "rgba(0,212,170,0.3)" : "var(--ag-border)"}`,
                  }}
                >
                  {REGION_LABELS[r]}
                </button>
              ))}
            </div>
            {selectedRegions.length === 0 && (
              <p className="text-[10px] mt-1.5" style={{ color: "var(--ag-muted)" }}>
                No selection = ALL regions
              </p>
            )}
          </div>

          {/* Options */}
          <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
            <span className="text-xs font-medium block mb-2" style={{ color: "var(--ag-text)" }}>Options</span>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] block mb-0.5" style={{ color: "var(--ag-muted)" }}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={running}
                  className="w-full px-2 py-1 rounded text-xs border outline-none"
                  style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
                />
              </div>
              <div>
                <label className="text-[10px] block mb-0.5" style={{ color: "var(--ag-muted)" }}>Stock Type</label>
                <select
                  value={stockType}
                  onChange={(e) => setStockType(e.target.value)}
                  disabled={running}
                  className="w-full px-2 py-1 rounded text-xs border outline-none"
                  style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
                >
                  <option value="Common Stock">Common Stock</option>
                  <option value="ETF">ETF</option>
                  <option value="all">All Types</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] block mb-0.5" style={{ color: "var(--ag-muted)" }}>
                  Limit per Exchange (0 = all)
                </label>
                <input
                  type="number"
                  value={limitPerExchange}
                  onChange={(e) => setLimitPerExchange(parseInt(e.target.value) || 0)}
                  disabled={running}
                  min={0}
                  className="w-full px-2 py-1 rounded text-xs border outline-none"
                  style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
            {!running ? (
              <button
                onClick={startIngest}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
              >
                Start Full Ingestion
              </button>
            ) : (
              <button
                onClick={stopIngest}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: "var(--ag-error)", color: "#fff" }}
              >
                Stop Ingestion
              </button>
            )}
          </div>

          {/* Overall Progress */}
          {(running || completed) && (
            <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px]" style={{ color: "var(--ag-muted)" }}>Overall Progress</span>
                <span className="text-[11px] font-mono" style={{ color: "var(--ag-text)" }}>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%`, background: "var(--ag-accent)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-center p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-sm font-mono font-bold" style={{ color: "var(--ag-accent)" }}>{stats.processed}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>Processed</div>
                </div>
                <div className="text-center p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-sm font-mono font-bold" style={{ color: stats.failed > 0 ? "var(--ag-error)" : "var(--ag-muted)" }}>{stats.failed}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>Failed</div>
                </div>
                <div className="text-center p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-sm font-mono font-bold" style={{ color: "var(--ag-text)" }}>{doneCount}/{stats.totalExchanges}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>Exchanges</div>
                </div>
                <div className="text-center p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-sm font-mono font-bold" style={{ color: "var(--ag-text)" }}>{stats.totalStocks}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>Total Stocks</div>
                </div>
              </div>
            </div>
          )}

          {/* Exchange Status List */}
          {exchanges.size > 0 && (
            <div className="p-3">
              <span className="text-xs font-medium block mb-2" style={{ color: "var(--ag-text)" }}>Exchange Status</span>
              <div className="space-y-1">
                {Array.from(exchanges.values()).map((ex) => (
                  <div
                    key={ex.code}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px]"
                    style={{
                      background: currentExchange === ex.code ? "rgba(0,212,170,0.08)" : "transparent",
                    }}
                  >
                    <StatusDot status={ex.status} />
                    <span className="flex-1 truncate" style={{ color: "var(--ag-text)" }}>
                      {ex.code}
                    </span>
                    <span className="truncate" style={{ color: "var(--ag-muted)", maxWidth: 100 }}>
                      {ex.country}
                    </span>
                    {ex.status === "downloading" && ex.stockCount && (
                      <span className="font-mono" style={{ color: "var(--ag-accent)" }}>
                        {ex.current || 0}/{ex.stockCount}
                      </span>
                    )}
                    {ex.status === "done" && (
                      <span className="font-mono" style={{ color: "var(--ag-success)" }}>
                        {ex.processed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Log Output */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "var(--ag-border)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--ag-text)" }}>Ingestion Log</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>{logs.length} entries</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-0.5" style={{ background: "var(--ag-bg)" }}>
            {logs.length === 0 && (
              <div className="text-center py-12" style={{ color: "var(--ag-muted)" }}>
                <p className="text-sm mb-1">Ready to ingest</p>
                <p className="text-[11px]">Select regions and click &quot;Start Full Ingestion&quot;</p>
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 leading-5">
                <span style={{ color: "var(--ag-muted)" }}>{log.time}</span>
                <span style={{
                  color: log.type === "error" ? "var(--ag-error)"
                    : log.type === "success" ? "var(--ag-success)"
                    : log.type === "warn" ? "var(--ag-warning)"
                    : "var(--ag-text)",
                }}>
                  {log.text}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: ExchangeProgress["status"] }) {
  const colors: Record<string, string> = {
    pending: "var(--ag-muted)",
    syncing: "var(--ag-warning)",
    downloading: "var(--ag-accent)",
    done: "var(--ag-success)",
    error: "var(--ag-error)",
    skipped: "var(--ag-muted)",
  };
  const animate = status === "syncing" || status === "downloading";
  return (
    <div
      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${animate ? "animate-pulse" : ""}`}
      style={{ background: colors[status] }}
    />
  );
}
