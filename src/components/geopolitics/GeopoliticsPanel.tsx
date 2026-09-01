"use client";

import { useEffect, useState, useCallback } from "react";

interface ConflictEvent {
  id: string;
  event_date: string;
  event_type: string;
  sub_event_type: string;
  country: string;
  region: string;
  location: string;
  latitude: number;
  longitude: number;
  fatalities: number;
  source: string;
  notes: string;
  actor1: string;
  actor2: string;
  risk_score: number;
}

interface AssetImpact {
  symbol: string;
  name: string;
  direction: "up" | "down" | "neutral";
  impact: number;
  reason: string;
}

interface Hotspot {
  country: string;
  events: number;
  fatalities: number;
  riskLevel: string;
}

interface ConflictSummary {
  totalEvents: number;
  totalFatalities: number;
  hotspots: Hotspot[];
  recentEvents: ConflictEvent[];
  assetImpacts: AssetImpact[];
  lastUpdated: string;
}

const RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  elevated: "#eab308",
  moderate: "#3b82f6",
};

const EVENT_ICONS: Record<string, string> = {
  "Battles": "⚔",
  "Explosions/Remote violence": "💥",
  "Violence against civilians": "⚠",
  "Riots": "🔥",
  "Protests": "✊",
  "Strategic developments": "🎯",
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg p-3 border" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>{label}</div>
      <div className="text-xl font-bold tabular-nums" style={{ color: color || "var(--ag-text)" }}>{value}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>{sub}</div>}
    </div>
  );
}

function RiskMeter({ score }: { score: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f97316" : score >= 40 ? "#eab308" : "#22c55e";
  const label = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 40 ? "ELEVATED" : "LOW";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--ag-border)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums" style={{ color, minWidth: 60, textAlign: "right" }}>
        {score} {label}
      </span>
    </div>
  );
}

function HotspotRow({ spot }: { spot: Hotspot }) {
  const color = RISK_COLORS[spot.riskLevel] || RISK_COLORS.moderate;
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-xs flex-1 truncate" style={{ color: "var(--ag-text)" }}>{spot.country}</span>
      <span className="text-[10px] tabular-nums" style={{ color: "var(--ag-muted)" }}>{spot.events} events</span>
      {spot.fatalities > 0 && (
        <span className="text-[10px] tabular-nums font-medium" style={{ color: "#ef4444" }}>{spot.fatalities} KIA</span>
      )}
      <span
        className="text-[9px] px-1.5 py-0.5 rounded font-medium uppercase"
        style={{ background: `${color}20`, color }}
      >
        {spot.riskLevel}
      </span>
    </div>
  );
}

function AssetImpactRow({ asset }: { asset: AssetImpact }) {
  const color = asset.direction === "up" ? "#22c55e" : asset.direction === "down" ? "#ef4444" : "var(--ag-muted)";
  const arrow = asset.direction === "up" ? "▲" : asset.direction === "down" ? "▼" : "◆";
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
      <span className="text-sm" style={{ color }}>{arrow}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--ag-text)" }}>{asset.name}</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>{asset.symbol}</span>
        </div>
        <div className="text-[10px] truncate" style={{ color: "var(--ag-muted)" }}>{asset.reason}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-bold tabular-nums" style={{ color }}>
          {asset.direction === "up" ? "+" : asset.direction === "down" ? "-" : ""}{asset.impact}%
        </div>
        <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>impact</div>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: ConflictEvent }) {
  const icon = EVENT_ICONS[event.event_type] || "📍";
  const riskColor = event.risk_score >= 80 ? "#ef4444" : event.risk_score >= 60 ? "#f97316" : event.risk_score >= 40 ? "#eab308" : "#3b82f6";
  return (
    <div className="py-2 px-2 border-b hover:bg-white/5 transition-colors" style={{ borderColor: "var(--ag-border)" }}>
      <div className="flex items-start gap-2">
        <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium" style={{ color: "var(--ag-text)" }}>
              {event.country} — {event.location}
            </span>
            <span
              className="text-[9px] px-1 py-0.5 rounded"
              style={{ background: `${riskColor}20`, color: riskColor }}
            >
              {event.risk_score}
            </span>
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>
            {event.event_type}{event.sub_event_type ? ` — ${event.sub_event_type}` : ""}
          </div>
          {event.notes && (
            <div className="text-[10px] mt-1 leading-relaxed" style={{ color: "var(--ag-muted)" }}>
              {event.notes}
            </div>
          )}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{event.event_date}</span>
            {event.fatalities > 0 && (
              <span className="text-[9px] font-medium" style={{ color: "#ef4444" }}>{event.fatalities} fatalities</span>
            )}
            <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{event.actor1}</span>
            <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>src: {event.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldHeatMap({ hotspots }: { hotspots: Hotspot[] }) {
  const countryPositions: Record<string, { x: number; y: number }> = {
    "Ukraine": { x: 57, y: 28 },
    "Russia": { x: 68, y: 22 },
    "Syria": { x: 58, y: 35 },
    "Israel": { x: 56, y: 37 },
    "Palestine": { x: 56, y: 37.5 },
    "Iran": { x: 62, y: 35 },
    "Iraq": { x: 60, y: 35 },
    "Yemen": { x: 60, y: 43 },
    "Sudan": { x: 55, y: 43 },
    "South Sudan": { x: 55, y: 47 },
    "Nigeria": { x: 46, y: 47 },
    "Somalia": { x: 60, y: 48 },
    "Ethiopia": { x: 58, y: 47 },
    "DR Congo": { x: 52, y: 52 },
    "Democratic Republic of Congo": { x: 52, y: 52 },
    "Mali": { x: 42, y: 42 },
    "Burkina Faso": { x: 42, y: 44 },
    "Niger": { x: 46, y: 42 },
    "Mozambique": { x: 58, y: 58 },
    "Myanmar": { x: 75, y: 40 },
    "Afghanistan": { x: 66, y: 34 },
    "Pakistan": { x: 67, y: 36 },
    "India": { x: 70, y: 40 },
    "Colombia": { x: 26, y: 48 },
    "Mexico": { x: 20, y: 40 },
    "Haiti": { x: 26, y: 42 },
    "Libya": { x: 50, y: 36 },
    "Turkey": { x: 56, y: 32 },
    "Lebanon": { x: 57, y: 35 },
    "Taiwan": { x: 82, y: 38 },
    "China": { x: 78, y: 34 },
    "Philippines": { x: 82, y: 44 },
    "South Africa": { x: 52, y: 64 },
    "Kenya": { x: 58, y: 50 },
    "Cameroon": { x: 48, y: 48 },
    "Chad": { x: 50, y: 42 },
  };

  return (
    <div className="relative rounded-lg overflow-hidden border" style={{ background: "#0a1628", borderColor: "var(--ag-border)", height: 220 }}>
      <svg viewBox="0 0 100 75" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="glow-critical">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-high">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-elevated">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="100" height="75" fill="#0a1628" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />
        <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />
        <line x1="25" y1="0" x2="25" y2="75" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />
        <line x1="50" y1="0" x2="50" y2="75" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />
        <line x1="75" y1="0" x2="75" y2="75" stroke="#1a2a44" strokeWidth="0.15" strokeDasharray="1,2" />

        {hotspots.map((spot) => {
          const pos = countryPositions[spot.country];
          if (!pos) return null;
          const color = RISK_COLORS[spot.riskLevel] || RISK_COLORS.moderate;
          const r = Math.min(4, 1.2 + spot.events * 0.15);
          const glowR = r * 3;
          const glowId = spot.riskLevel === "critical" ? "glow-critical" : spot.riskLevel === "high" ? "glow-high" : "glow-elevated";
          return (
            <g key={spot.country}>
              <circle cx={pos.x} cy={pos.y} r={glowR} fill={`url(#${glowId})`}>
                <animate attributeName="r" values={`${glowR};${glowR * 1.3};${glowR}`} dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={pos.x} cy={pos.y} r={r} fill={color} fillOpacity="0.8" stroke={color} strokeWidth="0.3">
                <animate attributeName="fillOpacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={pos.x} y={pos.y - r - 1} textAnchor="middle" fill="#94a3b8" fontSize="2" fontFamily="monospace">
                {spot.country}
              </text>
            </g>
          );
        })}

        <text x="2" y="4" fill="#334155" fontSize="2.5" fontFamily="monospace">GEOPOLITICAL RISK MAP</text>
        <text x="2" y="72" fill="#334155" fontSize="1.8" fontFamily="monospace">ACLED + UCDP Live Feed</text>
      </svg>

      <div className="absolute bottom-2 right-2 flex items-center gap-3">
        {["critical", "high", "elevated", "moderate"].map((level) => (
          <div key={level} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_COLORS[level] }} />
            <span className="text-[8px] uppercase" style={{ color: "#64748b" }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GeopoliticsPanel() {
  const [data, setData] = useState<ConflictSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "assets">("overview");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/conflicts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const globalRiskScore = data
    ? Math.min(100, Math.round(data.hotspots.reduce((sum, h) =>
        sum + (h.riskLevel === "critical" ? 25 : h.riskLevel === "high" ? 15 : h.riskLevel === "elevated" ? 8 : 3), 0)))
    : 0;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--ag-bg)" }}>
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">{"🌍"}</div>
          <div className="text-xs" style={{ color: "var(--ag-muted)" }}>Loading conflict data...</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--ag-bg)" }}>
        <div className="text-center">
          <div className="text-2xl mb-2">{"⚠️"}</div>
          <div className="text-xs mb-2" style={{ color: "#ef4444" }}>{error}</div>
          <button onClick={fetchData} className="text-xs px-3 py-1 rounded" style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Geopolitical Risk Monitor</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
            LIVE
          </span>
          <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>
            {data.totalEvents} events
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(["overview", "events", "assets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-2.5 py-1 text-[10px] rounded transition-colors capitalize"
              style={{
                background: activeTab === tab ? "rgba(0,212,170,0.15)" : "transparent",
                color: activeTab === tab ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="ml-2 p-1 rounded hover:bg-white/5 transition-colors"
            title="Refresh"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--ag-muted)">
              <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Global Risk" value={globalRiskScore} sub="composite score" color={globalRiskScore >= 70 ? "#ef4444" : globalRiskScore >= 50 ? "#f97316" : "#eab308"} />
              <StatCard label="Active Conflicts" value={data.totalEvents} sub="last 30 days" />
              <StatCard label="Fatalities" value={data.totalFatalities.toLocaleString()} sub="reported" color="#ef4444" />
              <StatCard label="Hotspots" value={data.hotspots.filter((h) => h.riskLevel === "critical" || h.riskLevel === "high").length} sub="critical + high" color="#f97316" />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: "var(--ag-muted)" }}>
                Global Risk Level
              </div>
              <RiskMeter score={globalRiskScore} />
            </div>

            <WorldHeatMap hotspots={data.hotspots} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: "var(--ag-muted)" }}>
                  Risk Hotspots ({data.hotspots.length})
                </div>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  {data.hotspots.map((spot) => (
                    <HotspotRow key={spot.country} spot={spot} />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider mb-2 px-1" style={{ color: "var(--ag-muted)" }}>
                  Asset Impact Correlation ({data.assetImpacts.length})
                </div>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  {data.assetImpacts.length === 0 ? (
                    <div className="p-4 text-center text-[10px]" style={{ color: "var(--ag-muted)" }}>
                      No direct asset impacts detected
                    </div>
                  ) : (
                    data.assetImpacts.map((asset) => (
                      <AssetImpactRow key={asset.symbol} asset={asset} />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-right" style={{ color: "var(--ag-muted)" }}>
              Last updated: {new Date(data.lastUpdated).toLocaleString()} | Source: ACLED / UCDP
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--ag-border)" }}>
              <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
                Showing {data.recentEvents.length} most recent events
              </span>
            </div>
            {data.recentEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}

        {activeTab === "assets" && (
          <div className="p-4 space-y-4">
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ag-muted)" }}>
              Conflict-Correlated Asset Impacts
            </div>
            <div className="text-[10px] mb-3" style={{ color: "var(--ag-muted)" }}>
              Based on active conflict zones and their historically correlated financial instruments.
              Impact scores reflect event frequency and severity.
            </div>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
              {data.assetImpacts.length === 0 ? (
                <div className="p-8 text-center text-xs" style={{ color: "var(--ag-muted)" }}>
                  No asset impacts currently detected from conflict data
                </div>
              ) : (
                data.assetImpacts.map((asset) => (
                  <div key={asset.symbol} className="py-3 px-3 border-b hover:bg-white/5" style={{ borderColor: "var(--ag-border)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: asset.direction === "up" ? "#22c55e" : "#ef4444" }}>
                          {asset.direction === "up" ? "▲" : "▼"}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "var(--ag-text)" }}>{asset.name}</span>
                        <span className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>{asset.symbol}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums" style={{ color: asset.direction === "up" ? "#22c55e" : "#ef4444" }}>
                        {asset.direction === "up" ? "+" : "-"}{asset.impact}%
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "var(--ag-border)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${asset.impact}%`,
                            background: asset.direction === "up" ? "#22c55e" : "#ef4444",
                          }}
                        />
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{asset.reason}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
