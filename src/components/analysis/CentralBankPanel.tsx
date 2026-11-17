"use client";

import { useState, useMemo } from "react";
import DemoBadge from "../ui/DemoBadge";

/* ── Types ─────────────────────────────────────────────────────── */

type Stance = "hawkish" | "dovish" | "neutral";

interface CentralBank {
  code: string;
  name: string;
  country: string;
  flag: string;
  rate: number;
  prevRate: number;
  lastChangeDate: string;
  nextMeeting: string;
  probHike: number;
  probCut: number;
  probHold: number;
  stance: Stance;
  currency: string;
}

interface TimelineEvent {
  date: string;
  bank: string;
  flag: string;
  action: string;
  change: number;
  stance: Stance;
}

interface InflationRow {
  country: string;
  flag: string;
  cpi: number;
  cpiPrev: number;
  ppi: number;
  ppiPrev: number;
  core: number;
  corePrev: number;
  trend: number[];
}

interface RatePath {
  meeting: string;
  implied: number;
}

/* ── Demo Data ─────────────────────────────────────────────────── */

const BANKS: CentralBank[] = [
  { code: "FED", name: "Federal Reserve", country: "USA", flag: "🇺🇸", rate: 5.50, prevRate: 5.25, lastChangeDate: "2024-07-26", nextMeeting: "2025-01-29", probHike: 2, probCut: 68, probHold: 30, stance: "hawkish", currency: "USD" },
  { code: "ECB", name: "European Central Bank", country: "Eurozone", flag: "🇪🇺", rate: 4.50, prevRate: 4.25, lastChangeDate: "2024-09-12", nextMeeting: "2025-01-25", probHike: 5, probCut: 55, probHold: 40, stance: "neutral", currency: "EUR" },
  { code: "BOJ", name: "Bank of Japan", country: "Japan", flag: "🇯🇵", rate: 0.25, prevRate: 0.10, lastChangeDate: "2024-07-31", nextMeeting: "2025-01-24", probHike: 42, probCut: 3, probHold: 55, stance: "hawkish", currency: "JPY" },
  { code: "BOE", name: "Bank of England", country: "UK", flag: "🇬🇧", rate: 5.25, prevRate: 5.00, lastChangeDate: "2024-08-01", nextMeeting: "2025-02-06", probHike: 3, probCut: 62, probHold: 35, stance: "neutral", currency: "GBP" },
  { code: "PBOC", name: "People's Bank of China", country: "China", flag: "🇨🇳", rate: 3.45, prevRate: 3.55, lastChangeDate: "2024-08-20", nextMeeting: "2025-01-20", probHike: 1, probCut: 45, probHold: 54, stance: "dovish", currency: "CNY" },
  { code: "SNB", name: "Swiss National Bank", country: "Switzerland", flag: "🇨🇭", rate: 1.75, prevRate: 1.50, lastChangeDate: "2024-06-22", nextMeeting: "2025-03-20", probHike: 5, probCut: 60, probHold: 35, stance: "neutral", currency: "CHF" },
  { code: "RBA", name: "Reserve Bank of Australia", country: "Australia", flag: "🇦🇺", rate: 4.35, prevRate: 4.10, lastChangeDate: "2024-11-07", nextMeeting: "2025-02-18", probHike: 8, probCut: 48, probHold: 44, stance: "hawkish", currency: "AUD" },
  { code: "BOC", name: "Bank of Canada", country: "Canada", flag: "🇨🇦", rate: 5.00, prevRate: 4.75, lastChangeDate: "2024-07-12", nextMeeting: "2025-01-22", probHike: 2, probCut: 72, probHold: 26, stance: "dovish", currency: "CAD" },
  { code: "RBNZ", name: "Reserve Bank of NZ", country: "New Zealand", flag: "🇳🇿", rate: 5.50, prevRate: 5.50, lastChangeDate: "2024-05-22", nextMeeting: "2025-02-19", probHike: 4, probCut: 55, probHold: 41, stance: "neutral", currency: "NZD" },
  { code: "RIKSBANK", name: "Riksbank", country: "Sweden", flag: "🇸🇪", rate: 4.00, prevRate: 4.00, lastChangeDate: "2024-06-27", nextMeeting: "2025-01-30", probHike: 2, probCut: 65, probHold: 33, stance: "dovish", currency: "SEK" },
  { code: "NORGES", name: "Norges Bank", country: "Norway", flag: "🇳🇴", rate: 4.50, prevRate: 4.25, lastChangeDate: "2024-09-19", nextMeeting: "2025-01-23", probHike: 5, probCut: 42, probHold: 53, stance: "neutral", currency: "NOK" },
  { code: "TCMB", name: "Türkiye Cumhuriyet MB", country: "Türkiye", flag: "🇹🇷", rate: 50.00, prevRate: 45.00, lastChangeDate: "2024-03-21", nextMeeting: "2025-01-23", probHike: 8, probCut: 35, probHold: 57, stance: "hawkish", currency: "TRY" },
  { code: "RBI", name: "Reserve Bank of India", country: "India", flag: "🇮🇳", rate: 6.50, prevRate: 6.50, lastChangeDate: "2023-02-08", nextMeeting: "2025-02-07", probHike: 3, probCut: 52, probHold: 45, stance: "neutral", currency: "INR" },
  { code: "BCB", name: "Banco Central do Brasil", country: "Brazil", flag: "🇧🇷", rate: 11.75, prevRate: 12.25, lastChangeDate: "2024-11-06", nextMeeting: "2025-01-29", probHike: 15, probCut: 38, probHold: 47, stance: "hawkish", currency: "BRL" },
  { code: "BANXICO", name: "Banco de México", country: "Mexico", flag: "🇲🇽", rate: 11.25, prevRate: 11.00, lastChangeDate: "2024-08-08", nextMeeting: "2025-02-06", probHike: 5, probCut: 55, probHold: 40, stance: "neutral", currency: "MXN" },
  { code: "SARB", name: "South African Reserve Bank", country: "South Africa", flag: "🇿🇦", rate: 8.25, prevRate: 8.25, lastChangeDate: "2024-05-23", nextMeeting: "2025-01-30", probHike: 6, probCut: 48, probHold: 46, stance: "neutral", currency: "ZAR" },
];

const TIMELINE: TimelineEvent[] = [
  { date: "2024-11-07", bank: "RBA", flag: "🇦🇺", action: "Hold at 4.35%", change: 0, stance: "hawkish" },
  { date: "2024-11-06", bank: "BCB", flag: "🇧🇷", action: "Cut -50bp to 11.75%", change: -0.50, stance: "dovish" },
  { date: "2024-09-19", bank: "NORGES", flag: "🇳🇴", action: "Hike +25bp to 4.50%", change: 0.25, stance: "hawkish" },
  { date: "2024-09-12", bank: "ECB", flag: "🇪🇺", action: "Hike +25bp to 4.50%", change: 0.25, stance: "hawkish" },
  { date: "2024-08-20", bank: "PBOC", flag: "🇨🇳", action: "Cut -10bp to 3.45%", change: -0.10, stance: "dovish" },
  { date: "2024-08-08", bank: "BANXICO", flag: "🇲🇽", action: "Hike +25bp to 11.25%", change: 0.25, stance: "hawkish" },
  { date: "2024-08-01", bank: "BOE", flag: "🇬🇧", action: "Hike +25bp to 5.25%", change: 0.25, stance: "hawkish" },
  { date: "2024-07-31", bank: "BOJ", flag: "🇯🇵", action: "Hike +15bp to 0.25%", change: 0.15, stance: "hawkish" },
  { date: "2024-07-26", bank: "FED", flag: "🇺🇸", action: "Hike +25bp to 5.50%", change: 0.25, stance: "hawkish" },
  { date: "2024-07-12", bank: "BOC", flag: "🇨🇦", action: "Hike +25bp to 5.00%", change: 0.25, stance: "hawkish" },
  { date: "2024-06-27", bank: "RIKSBANK", flag: "🇸🇪", action: "Hold at 4.00%", change: 0, stance: "neutral" },
  { date: "2024-06-22", bank: "SNB", flag: "🇨🇭", action: "Hike +25bp to 1.75%", change: 0.25, stance: "hawkish" },
  { date: "2024-05-23", bank: "SARB", flag: "🇿🇦", action: "Hold at 8.25%", change: 0, stance: "neutral" },
  { date: "2024-05-22", bank: "RBNZ", flag: "🇳🇿", action: "Hold at 5.50%", change: 0, stance: "neutral" },
  { date: "2024-03-21", bank: "TCMB", flag: "🇹🇷", action: "Hike +500bp to 50.00%", change: 5.00, stance: "hawkish" },
];

const INFLATION: InflationRow[] = [
  { country: "USA",       flag: "🇺🇸", cpi: 3.2,  cpiPrev: 3.4, ppi: 1.6, ppiPrev: 2.0, core: 3.9, corePrev: 4.0, trend: [6.5, 6.0, 5.0, 4.9, 4.0, 3.7, 3.4, 3.2] },
  { country: "Eurozone",  flag: "🇪🇺", cpi: 2.9,  cpiPrev: 3.1, ppi: -0.4, ppiPrev: 0.2, core: 3.4, corePrev: 3.6, trend: [8.6, 8.1, 6.9, 5.3, 4.3, 3.1, 2.9, 2.9] },
  { country: "UK",        flag: "🇬🇧", cpi: 4.0,  cpiPrev: 4.6, ppi: -0.6, ppiPrev: -0.2, core: 5.1, corePrev: 5.7, trend: [10.1, 8.7, 6.7, 6.3, 4.6, 4.6, 4.0, 4.0] },
  { country: "Japan",     flag: "🇯🇵", cpi: 2.8,  cpiPrev: 3.0, ppi: 0.3, ppiPrev: 0.8, core: 2.3, corePrev: 2.5, trend: [4.3, 3.3, 3.2, 3.0, 2.8, 2.8, 2.8, 2.8] },
  { country: "China",     flag: "🇨🇳", cpi: -0.3, cpiPrev: -0.2, ppi: -2.6, ppiPrev: -2.8, core: 0.6, corePrev: 0.4, trend: [2.1, 0.7, 0.2, -0.3, 0.0, -0.3, -0.3, -0.3] },
  { country: "Türkiye",   flag: "🇹🇷", cpi: 61.5, cpiPrev: 65.0, ppi: 55.0, ppiPrev: 58.0, core: 70.0, corePrev: 72.0, trend: [85.5, 72.3, 61.5, 58.9, 50.5, 55.0, 61.5, 61.5] },
  { country: "India",     flag: "🇮🇳", cpi: 5.5,  cpiPrev: 5.0, ppi: 0.4, ppiPrev: 0.8, core: 4.2, corePrev: 4.3, trend: [6.5, 5.7, 4.8, 5.0, 5.5, 5.5, 5.5, 5.5] },
  { country: "Brazil",    flag: "🇧🇷", cpi: 4.7,  cpiPrev: 4.6, ppi: -1.0, ppiPrev: -0.5, core: 3.9, corePrev: 3.8, trend: [5.8, 5.0, 4.6, 3.2, 3.9, 4.6, 4.7, 4.7] },
];

const RATE_PATH: RatePath[] = [
  { meeting: "Jan 29", implied: 5.50 },
  { meeting: "Mar 19", implied: 5.35 },
  { meeting: "May 7",  implied: 5.15 },
  { meeting: "Jun 18", implied: 4.95 },
  { meeting: "Jul 30", implied: 4.80 },
  { meeting: "Sep 17", implied: 4.65 },
  { meeting: "Nov 5",  implied: 4.50 },
  { meeting: "Dec 17", implied: 4.35 },
];

/* ── Helpers ───────────────────────────────────────────────────── */

type Tab = "rates" | "path" | "taylor" | "timeline" | "inflation";

const stanceColor = (s: Stance) =>
  s === "hawkish" ? "#ef4444" : s === "dovish" ? "#22c55e" : "#94a3b8";

const stanceLabel = (s: Stance) =>
  s === "hawkish" ? "HAWKISH" : s === "dovish" ? "DOVISH" : "NEUTRAL";

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86_400_000));
}

function miniSparkline(data: number[], w: number, h: number): string {
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - mn) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function ProbBar({ hike, hold, cut }: { hike: number; hold: number; cut: number }) {
  return (
    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${hike}%`, background: "#ef4444" }} title={`Hike ${hike}%`} />
      <div style={{ width: `${hold}%`, background: "#94a3b8" }} title={`Hold ${hold}%`} />
      <div style={{ width: `${cut}%`, background: "#22c55e" }} title={`Cut ${cut}%`} />
    </div>
  );
}

/* ── Sub-Components ────────────────────────────────────────────── */

function RateDashboard() {
  const [sortKey, setSortKey] = useState<"rate" | "code" | "probCut">("rate");

  const sorted = useMemo(() => {
    const copy = [...BANKS];
    if (sortKey === "rate") copy.sort((a, b) => b.rate - a.rate);
    else if (sortKey === "probCut") copy.sort((a, b) => b.probCut - a.probCut);
    else copy.sort((a, b) => a.code.localeCompare(b.code));
    return copy;
  }, [sortKey]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>SORT:</span>
        {(["rate", "code", "probCut"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setSortKey(k)}
            style={{
              background: sortKey === k ? "#00e5a0" : "#1e293b",
              color: sortKey === k ? "#0a0e17" : "#cbd5e1",
              border: "none",
              borderRadius: 4,
              padding: "3px 10px",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: sortKey === k ? 700 : 400,
            }}
          >
            {k === "rate" ? "BY RATE" : k === "code" ? "BY NAME" : "BY CUT PROB"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {sorted.map((b) => {
          const changeDir = b.rate > b.prevRate ? "+" : b.rate < b.prevRate ? "" : "";
          const changeBps = Math.round(Math.abs(b.rate - b.prevRate) * 100);
          return (
            <div
              key={b.code}
              style={{
                background: "#111827",
                border: `1px solid ${stanceColor(b.stance)}33`,
                borderRadius: 8,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{b.flag}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{b.code}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{b.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#00e5a0", fontVariantNumeric: "tabular-nums" }}>
                    {b.rate.toFixed(2)}%
                  </div>
                  {changeBps > 0 && (
                    <div style={{ fontSize: 10, color: b.rate > b.prevRate ? "#ef4444" : "#22c55e" }}>
                      {changeDir}{changeBps}bp · {b.lastChangeDate.slice(5)}
                    </div>
                  )}
                </div>
              </div>

              <ProbBar hike={b.probHike} hold={b.probHold} cut={b.probCut} />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8" }}>
                <span>Hike {b.probHike}%</span>
                <span>Hold {b.probHold}%</span>
                <span>Cut {b.probCut}%</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginTop: 2 }}>
                <span style={{ color: "#64748b" }}>Next: {b.nextMeeting.slice(5)}</span>
                <span style={{
                  color: stanceColor(b.stance),
                  fontWeight: 700,
                  fontSize: 9,
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: `${stanceColor(b.stance)}18`,
                }}>
                  {stanceLabel(b.stance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RatePathChart() {
  const W = 700;
  const H = 260;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const vals = RATE_PATH.map((r) => r.implied);
  const mn = Math.min(...vals) - 0.2;
  const mx = Math.max(...vals) + 0.2;

  const pts = RATE_PATH.map((r, i) => {
    const x = pad.left + (i / (RATE_PATH.length - 1)) * iw;
    const y = pad.top + ih - ((r.implied - mn) / (mx - mn)) * ih;
    return { x, y, ...r };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length - 1].x},${pad.top + ih} L${pts[0].x},${pad.top + ih} Z`;

  const ticks = [mn, mn + (mx - mn) * 0.25, mn + (mx - mn) * 0.5, mn + (mx - mn) * 0.75, mx];

  return (
    <div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
        FED FUNDS FUTURES — IMPLIED RATE PATH (NEXT 8 FOMC MEETINGS)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 700, height: "auto" }}>
        <defs>
          <linearGradient id="rpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00e5a0" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => {
          const y = pad.top + ih - ((t - mn) / (mx - mn)) * ih;
          return (
            <g key={t}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#1e293b" />
              <text x={pad.left - 8} y={y + 4} fill="#64748b" fontSize={10} textAnchor="end">
                {t.toFixed(2)}%
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#rpGrad)" />
        <path d={linePath} fill="none" stroke="#00e5a0" strokeWidth={2.5} />
        {pts.map((p) => (
          <g key={p.meeting}>
            <circle cx={p.x} cy={p.y} r={5} fill="#0a0e17" stroke="#00e5a0" strokeWidth={2} />
            <text x={p.x} y={p.y - 12} fill="#e2e8f0" fontSize={10} textAnchor="middle" fontWeight={700}>
              {p.implied.toFixed(2)}%
            </text>
            <text x={p.x} y={H - 10} fill="#94a3b8" fontSize={9} textAnchor="middle">
              {p.meeting}
            </text>
          </g>
        ))}
        {/* current rate reference line */}
        {(() => {
          const cy = pad.top + ih - ((5.50 - mn) / (mx - mn)) * ih;
          return (
            <>
              <line x1={pad.left} y1={cy} x2={W - pad.right} y2={cy} stroke="#ef4444" strokeDasharray="4,3" strokeOpacity={0.6} />
              <text x={W - pad.right + 4} y={cy + 4} fill="#ef4444" fontSize={9}>CURRENT</text>
            </>
          );
        })()}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
        <span>Current: <b style={{ color: "#ef4444" }}>5.50%</b></span>
        <span>Dec &apos;25 Implied: <b style={{ color: "#00e5a0" }}>4.35%</b></span>
        <span>Total Cuts Priced: <b style={{ color: "#22c55e" }}>-115bp</b></span>
      </div>
    </div>
  );
}

function TaylorRuleCalc() {
  const [inflation, setInflation] = useState(3.2);
  const [outputGap, setOutputGap] = useState(-0.5);
  const [neutralRate, setNeutralRate] = useState(2.5);
  const [targetInflation, setTargetInflation] = useState(2.0);

  const taylorRate = neutralRate + targetInflation + 1.5 * (inflation - targetInflation) + 0.5 * outputGap;
  const actualRate = 5.50;
  const diff = actualRate - taylorRate;

  const sliderStyle = {
    width: "100%",
    accentColor: "#00e5a0",
    background: "#1e293b",
    height: 4,
  } as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: 1 }}>
          Taylor Rule Inputs
        </div>

        {[
          { label: "Current Inflation (CPI YoY)", value: inflation, set: setInflation, min: -2, max: 15, step: 0.1, suffix: "%" },
          { label: "Output Gap", value: outputGap, set: setOutputGap, min: -5, max: 5, step: 0.1, suffix: "%" },
          { label: "Neutral Real Rate (r*)", value: neutralRate, set: setNeutralRate, min: 0, max: 5, step: 0.1, suffix: "%" },
          { label: "Target Inflation", value: targetInflation, set: setTargetInflation, min: 0, max: 5, step: 0.1, suffix: "%" },
        ].map((s) => (
          <div key={s.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#cbd5e1", marginBottom: 4 }}>
              <span>{s.label}</span>
              <span style={{ color: "#00e5a0", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {s.value.toFixed(1)}{s.suffix}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </div>
        ))}

        <div style={{ fontSize: 10, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>
          Formula: r* + π* + 1.5(π − π*) + 0.5(y − y*)
          <br />
          = {neutralRate.toFixed(1)} + {targetInflation.toFixed(1)} + 1.5×({inflation.toFixed(1)} − {targetInflation.toFixed(1)}) + 0.5×({outputGap.toFixed(1)})
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          width: "100%",
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>TAYLOR RULE PRESCRIBES</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#00e5a0", fontVariantNumeric: "tabular-nums" }}>
            {taylorRate.toFixed(2)}%
          </div>
        </div>

        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          width: "100%",
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>ACTUAL FED FUNDS RATE</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
            {actualRate.toFixed(2)}%
          </div>
        </div>

        <div style={{
          background: diff > 0 ? "#ef444415" : diff < 0 ? "#22c55e15" : "#94a3b815",
          border: `1px solid ${diff > 0 ? "#ef4444" : diff < 0 ? "#22c55e" : "#94a3b8"}44`,
          borderRadius: 8,
          padding: "10px 20px",
          textAlign: "center",
          width: "100%",
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>DEVIATION</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: diff > 0 ? "#ef4444" : diff < 0 ? "#22c55e" : "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
            {diff > 0 ? "+" : ""}{diff.toFixed(2)}%
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            Policy is {diff > 0.25 ? "RESTRICTIVE" : diff < -0.25 ? "ACCOMMODATIVE" : "ALIGNED"} vs Taylor Rule
          </div>
        </div>
      </div>
    </div>
  );
}

function MonetaryTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {TIMELINE.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 12, minHeight: 52 }}>
          {/* timeline bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: stanceColor(e.stance),
              flexShrink: 0,
              marginTop: 4,
              boxShadow: `0 0 6px ${stanceColor(e.stance)}55`,
            }} />
            {i < TIMELINE.length - 1 && (
              <div style={{ width: 1, flex: 1, background: "#1e293b" }} />
            )}
          </div>

          {/* content */}
          <div style={{ flex: 1, paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{e.flag}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{e.bank}</span>
              <span style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 3,
                background: `${stanceColor(e.stance)}18`,
                color: stanceColor(e.stance),
                fontWeight: 700,
              }}>
                {stanceLabel(e.stance)}
              </span>
              <span style={{ fontSize: 10, color: "#64748b", marginLeft: "auto" }}>{e.date}</span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{e.action}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InflationDash() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e293b" }}>
            {["Country", "CPI YoY", "Prev", "PPI YoY", "Prev", "Core", "Prev", "Trend"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 10px",
                  textAlign: h === "Country" ? "left" : "right",
                  color: "#64748b",
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INFLATION.map((row) => {
            const cpiDir = row.cpi > row.cpiPrev ? "up" : row.cpi < row.cpiPrev ? "down" : "flat";
            return (
              <tr key={row.country} style={{ borderBottom: "1px solid #111827" }}>
                <td style={{ padding: "10px 10px", color: "#e2e8f0", fontWeight: 600 }}>
                  <span style={{ marginRight: 6 }}>{row.flag}</span>
                  {row.country}
                </td>
                <td style={{
                  padding: "10px 10px",
                  textAlign: "right",
                  color: row.cpi > 3 ? "#ef4444" : row.cpi > 2 ? "#f59e0b" : "#22c55e",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {row.cpi.toFixed(1)}%
                  <span style={{ fontSize: 9, marginLeft: 4 }}>
                    {cpiDir === "up" ? "▲" : cpiDir === "down" ? "▼" : "●"}
                  </span>
                </td>
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
                  {row.cpiPrev.toFixed(1)}%
                </td>
                <td style={{
                  padding: "10px 10px",
                  textAlign: "right",
                  color: row.ppi > 3 ? "#ef4444" : row.ppi > 0 ? "#f59e0b" : "#22c55e",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {row.ppi.toFixed(1)}%
                </td>
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
                  {row.ppiPrev.toFixed(1)}%
                </td>
                <td style={{
                  padding: "10px 10px",
                  textAlign: "right",
                  color: row.core > 3 ? "#ef4444" : row.core > 2 ? "#f59e0b" : "#22c55e",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {row.core.toFixed(1)}%
                </td>
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
                  {row.corePrev.toFixed(1)}%
                </td>
                <td style={{ padding: "10px 2px", textAlign: "right" }}>
                  <svg width={72} height={22} viewBox="0 0 72 22">
                    <path
                      d={miniSparkline(row.trend, 68, 18)}
                      fill="none"
                      stroke={row.trend[row.trend.length - 1] < row.trend[0] ? "#22c55e" : "#ef4444"}
                      strokeWidth={1.5}
                      transform="translate(2,2)"
                    />
                  </svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Panel ────────────────────────────────────────────────── */

export default function CentralBankPanel() {
  const [tab, setTab] = useState<Tab>("rates");

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "rates", label: "Global Rates", icon: "🏛️" },
    { key: "path", label: "Rate Path", icon: "📈" },
    { key: "taylor", label: "Taylor Rule", icon: "🧮" },
    { key: "timeline", label: "Policy Timeline", icon: "📅" },
    { key: "inflation", label: "Inflation", icon: "🔥" },
  ];

  return (
    <div style={{
      background: "#0a0e17",
      color: "#e2e8f0",
      minHeight: "100%",
      padding: 20,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <DemoBadge />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#00e5a0" }}>
          Central Bank Monitor
        </h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>
          Global monetary policy tracker — Rates, expectations & inflation
        </p>
      </div>

      {/* Summary strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 10,
        marginBottom: 16,
      }}>
        {[
          { label: "CENTRAL BANKS", value: "16", color: "#00e5a0" },
          { label: "AVG GLOBAL RATE", value: `${(BANKS.reduce((s, b) => s + b.rate, 0) / BANKS.length).toFixed(2)}%`, color: "#38bdf8" },
          { label: "HAWKISH BIAS", value: `${BANKS.filter(b => b.stance === "hawkish").length}`, color: "#ef4444" },
          { label: "DOVISH BIAS", value: `${BANKS.filter(b => b.stance === "dovish").length}`, color: "#22c55e" },
          { label: "FED IMPLIED DEC", value: "4.35%", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#111827",
            borderRadius: 8,
            padding: "10px 14px",
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 4,
        marginBottom: 16,
        borderBottom: "1px solid #1e293b",
        paddingBottom: 8,
        flexWrap: "wrap",
      }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? "#00e5a018" : "transparent",
              border: tab === t.key ? "1px solid #00e5a044" : "1px solid transparent",
              borderRadius: 6,
              padding: "6px 14px",
              color: tab === t.key ? "#00e5a0" : "#94a3b8",
              fontSize: 12,
              fontWeight: tab === t.key ? 700 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: "#0f172a", borderRadius: 10, padding: 20, border: "1px solid #1e293b" }}>
        {tab === "rates" && <RateDashboard />}
        {tab === "path" && <RatePathChart />}
        {tab === "taylor" && <TaylorRuleCalc />}
        {tab === "timeline" && <MonetaryTimeline />}
        {tab === "inflation" && <InflationDash />}
      </div>
    </div>
  );
}
