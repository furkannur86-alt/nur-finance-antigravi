"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "uptime" | "latency" | "feeds" | "diagnostics";

export default function SystemHealthPanel() {
  const [tab, setTab] = useState<Tab>("uptime");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🖥️</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>SYSTEM HEALTH</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>NUR CORE</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["uptime", "latency", "feeds", "diagnostics"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "uptime" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SERVICE UPTIME — 30 DAY</div>
            {[
              { service: "API Gateway", uptime: 99.98, incidents: 1, lastDown: "Nov 12, 3min" },
              { service: "Market Data Feed", uptime: 99.95, incidents: 2, lastDown: "Nov 18, 5min" },
              { service: "Order Execution", uptime: 99.99, incidents: 0, lastDown: "None" },
              { service: "Authentication", uptime: 100.0, incidents: 0, lastDown: "None" },
              { service: "WebSocket Server", uptime: 99.92, incidents: 3, lastDown: "Nov 20, 8min" },
              { service: "Database Cluster", uptime: 99.99, incidents: 0, lastDown: "None" },
              { service: "Search Engine", uptime: 99.96, incidents: 1, lastDown: "Nov 15, 4min" },
            ].map(s => (
              <div key={s.service} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: s.uptime >= 99.99 ? "#22c55e" : s.uptime >= 99.95 ? "#fbbf24" : "#ef4444" }} />
                <span className="w-32">{s.service}</span>
                <span className="font-mono font-bold w-16 text-right" style={{
                  color: s.uptime >= 99.99 ? "#22c55e" : s.uptime >= 99.95 ? "#fbbf24" : "#ef4444",
                }}>{s.uptime}%</span>
                <span className="font-mono w-14 text-right" style={{ color: "#64748b" }}>{s.incidents} inc</span>
                <span className="text-[9px] ml-auto" style={{ color: "#64748b" }}>{s.lastDown}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "latency" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>API LATENCY — P50 / P95 / P99</div>
            {[
              { endpoint: "/api/quotes", p50: 12, p95: 45, p99: 120, rps: "15,200" },
              { endpoint: "/api/orders", p50: 8, p95: 25, p99: 85, rps: "2,400" },
              { endpoint: "/api/portfolio", p50: 35, p95: 95, p99: 250, rps: "8,500" },
              { endpoint: "/api/search", p50: 85, p95: 220, p99: 450, rps: "3,200" },
              { endpoint: "/ws/stream", p50: 2, p95: 8, p99: 15, rps: "45,000" },
              { endpoint: "/api/analytics", p50: 150, p95: 380, p99: 850, rps: "1,800" },
            ].map(e => (
              <div key={e.endpoint} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{e.endpoint}</span>
                  <span className="font-mono text-[9px]" style={{ color: "#64748b" }}>{e.rps} rps</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "P50", val: e.p50, thresh: 50 },
                    { label: "P95", val: e.p95, thresh: 200 },
                    { label: "P99", val: e.p99, thresh: 500 },
                  ].map(p => (
                    <div key={p.label} className="text-center">
                      <div className="text-[8px]" style={{ color: "#64748b" }}>{p.label}</div>
                      <div className="font-mono font-bold" style={{ color: p.val < p.thresh ? "#22c55e" : "#ef4444" }}>{p.val}ms</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "feeds" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>DATA FEED STATUS</div>
            {[
              { feed: "EODHD Equities", status: "Connected", delay: "< 1s", msgs: "12.5K/s", since: "72h ago" },
              { feed: "EODHD Forex", status: "Connected", delay: "< 1s", msgs: "8.2K/s", since: "72h ago" },
              { feed: "Crypto WebSocket", status: "Connected", delay: "50ms", msgs: "25K/s", since: "48h ago" },
              { feed: "News Wire (NLP)", status: "Connected", delay: "2s", msgs: "450/s", since: "24h ago" },
              { feed: "Economic Calendar", status: "Connected", delay: "5m", msgs: "12/h", since: "72h ago" },
              { feed: "Social Sentiment", status: "Degraded", delay: "15s", msgs: "2.1K/s", since: "2h ago" },
              { feed: "Options Flow", status: "Connected", delay: "< 1s", msgs: "5.5K/s", since: "72h ago" },
            ].map(f => (
              <div key={f.feed} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: f.status === "Connected" ? "#22c55e" : f.status === "Degraded" ? "#fbbf24" : "#ef4444" }} />
                <span className="w-32">{f.feed}</span>
                <span className="px-1 py-0.5 rounded text-[8px]" style={{
                  background: f.status === "Connected" ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.1)",
                  color: f.status === "Connected" ? "#22c55e" : "#fbbf24",
                }}>{f.status}</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{f.delay}</span>
                <span className="font-mono w-16 text-right" style={{ color: "#64748b" }}>{f.msgs}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "diagnostics" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>SYSTEM RESOURCES</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "CPU", value: "42%", color: "#22c55e" },
                { label: "Memory", value: "68%", color: "#fbbf24" },
                { label: "Disk I/O", value: "23%", color: "#22c55e" },
                { label: "Network", value: "55%", color: "#fbbf24" },
              ].map(r => (
                <div key={r.label} className="p-2 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[8px]" style={{ color: "#64748b" }}>{r.label}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: r.color }}>{r.value}</div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>RECENT ERRORS</div>
            {[
              { time: "14:28", level: "WARN", service: "WS Server", msg: "Client reconnect storm: 450 reconnects in 10s" },
              { time: "14:15", level: "ERROR", service: "Social Feed", msg: "Rate limit exceeded on X API endpoint" },
              { time: "13:50", level: "WARN", service: "DB Cluster", msg: "Slow query detected: portfolio aggregation (850ms)" },
              { time: "13:22", level: "INFO", service: "Cache", msg: "Redis failover completed: secondary promoted" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono text-[9px] w-10" style={{ color: "#64748b" }}>{e.time}</span>
                <span className="font-mono text-[8px] w-12 text-center px-1 py-0.5 rounded" style={{
                  background: e.level === "ERROR" ? "rgba(239,68,68,0.15)" : e.level === "WARN" ? "rgba(251,191,36,0.15)" : "rgba(56,189,248,0.1)",
                  color: e.level === "ERROR" ? "#ef4444" : e.level === "WARN" ? "#fbbf24" : "#38bdf8",
                }}>{e.level}</span>
                <span className="text-[9px] w-20" style={{ color: "#00e5a0" }}>{e.service}</span>
                <span className="text-[9px] flex-1 truncate">{e.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
