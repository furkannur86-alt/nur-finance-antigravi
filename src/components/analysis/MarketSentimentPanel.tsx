"use client";
import { useState } from "react";

/* ── Bloomberg-tier Market Sentiment & Positioning Panel ─────── */

const accent = "#00e5a0";
const bg = "#0a0e17";
const surface = "#111827";
const border = "#1e293b";
const txt = "#e2e8f0";
const txtDim = "#94a3b8";

/* ── helpers ──────────────────────────────────────────────────── */

function zoneColor(v: number): string {
  if (v < 20) return "#ef4444";
  if (v < 40) return "#f97316";
  if (v < 60) return "#6b7280";
  if (v < 80) return "#22c55e";
  return "#00e5a0";
}
function zoneLabel(v: number): string {
  if (v < 20) return "EXTREME FEAR";
  if (v < 40) return "FEAR";
  if (v < 60) return "NEUTRAL";
  if (v < 80) return "GREED";
  return "EXTREME GREED";
}
function signalColor(s: string) {
  if (s === "Bullish") return accent;
  if (s === "Bearish") return "#ef4444";
  return txtDim;
}

/* ── SVG arc gauge (0-100) ───────────────────────────────────── */
function ArcGauge({ value, size = 220 }: { value: number; size?: number }) {
  const cx = size / 2, cy = size / 2 + 10;
  const r = size / 2 - 20;
  const startAngle = -210 * (Math.PI / 180);
  const endAngle = 30 * (Math.PI / 180);
  const sweep = endAngle - startAngle;
  const valAngle = startAngle + sweep * (value / 100);

  const arcPath = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from), y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to), y2 = cy + r * Math.sin(to);
    const large = to - from > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  // gradient stops
  const zones = [
    { pct: 0.2, color: "#ef4444" },
    { pct: 0.4, color: "#f97316" },
    { pct: 0.6, color: "#6b7280" },
    { pct: 0.8, color: "#22c55e" },
    { pct: 1.0, color: "#00e5a0" },
  ];

  const needleX = cx + (r - 10) * Math.cos(valAngle);
  const needleY = cy + (r - 10) * Math.sin(valAngle);

  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      {/* track */}
      {zones.map((z, i) => {
        const prev = i === 0 ? 0 : zones[i - 1].pct;
        const from = startAngle + sweep * prev;
        const to = startAngle + sweep * z.pct;
        return (
          <path key={i} d={arcPath(from, to)} fill="none" stroke={z.color} strokeWidth={14} strokeLinecap="round" opacity={0.25} />
        );
      })}
      {/* filled arc */}
      <path d={arcPath(startAngle, valAngle)} fill="none" stroke={zoneColor(value)} strokeWidth={14} strokeLinecap="round" />
      {/* needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={txt} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill={surface} stroke={zoneColor(value)} strokeWidth={2} />
      {/* value text */}
      <text x={cx} y={cy - 24} textAnchor="middle" fill={zoneColor(value)} fontSize={42} fontWeight={800} fontFamily="'JetBrains Mono', monospace">{value}</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill={txt} fontSize={12} fontWeight={700} fontFamily="'JetBrains Mono', monospace">{zoneLabel(value)}</text>
    </svg>
  );
}

/* ── mini gauge for components ───────────────────────────────── */
function MiniGauge({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(value / max * 100, 100);
  return (
    <div style={{ width: "100%", height: 6, background: `${border}`, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
    </div>
  );
}

/* ── data ─────────────────────────────────────────────────────── */
const FEAR_GREED = 62;
const FEAR_GREED_PREV = 55;

interface SentComponent {
  name: string;
  value: string;
  score: number;
  signal: "Bullish" | "Neutral" | "Bearish";
  detail: string;
}
const COMPONENTS: SentComponent[] = [
  { name: "VIX Level", value: "16.42", score: 68, signal: "Bullish", detail: "Below 20 — low fear" },
  { name: "Put/Call Ratio", value: "0.72", score: 58, signal: "Neutral", detail: "Slightly below avg (0.80)" },
  { name: "Market Breadth", value: "1.84", score: 72, signal: "Bullish", detail: "Advance/Decline ratio strong" },
  { name: "Price Strength", value: "68.4%", score: 68, signal: "Bullish", detail: "% stocks above 125d MA" },
  { name: "Price Breadth", value: "+142", score: 65, signal: "Bullish", detail: "New highs minus new lows" },
  { name: "Safe Haven", value: "-1.24%", score: 60, signal: "Neutral", detail: "Bond vs stock relative return" },
  { name: "Junk Bond Demand", value: "3.82%", score: 55, signal: "Neutral", detail: "HY-IG yield spread (avg 4.2%)" },
];

interface SocialTicker {
  ticker: string;
  name: string;
  volume: number;
  sentiment: number;
  chg24h: number;
  buzz: boolean;
}
const SOCIAL: SocialTicker[] = [
  { ticker: "NVDA", name: "NVIDIA", volume: 184200, sentiment: 78, chg24h: 12.4, buzz: true },
  { ticker: "TSLA", name: "Tesla", volume: 156800, sentiment: -24, chg24h: -8.2, buzz: true },
  { ticker: "AAPL", name: "Apple", volume: 98400, sentiment: 42, chg24h: 2.1, buzz: false },
  { ticker: "GME", name: "GameStop", volume: 87600, sentiment: 65, chg24h: 34.8, buzz: true },
  { ticker: "AMD", name: "AMD", volume: 72100, sentiment: 56, chg24h: 5.4, buzz: false },
  { ticker: "AMZN", name: "Amazon", volume: 65400, sentiment: 38, chg24h: -1.2, buzz: false },
  { ticker: "PLTR", name: "Palantir", volume: 58900, sentiment: 71, chg24h: 18.9, buzz: true },
  { ticker: "META", name: "Meta", volume: 52300, sentiment: 44, chg24h: 3.8, buzz: false },
  { ticker: "MSFT", name: "Microsoft", volume: 48700, sentiment: 52, chg24h: 1.4, buzz: false },
  { ticker: "COIN", name: "Coinbase", volume: 44200, sentiment: 61, chg24h: 22.1, buzz: true },
];

// Put/Call ratio 20-day history
const PC_HISTORY = [0.92, 0.88, 0.95, 0.84, 0.78, 0.82, 0.74, 0.79, 0.85, 0.90, 0.87, 0.76, 0.72, 0.68, 0.75, 0.80, 0.78, 0.74, 0.70, 0.72];
const SKEW_VAL = 132.4;
const VOL_TERM: { tenor: string; spy: number; qqq: number; iwm: number }[] = [
  { tenor: "1W", spy: 12.4, qqq: 15.8, iwm: 18.2 },
  { tenor: "1M", spy: 14.8, qqq: 18.2, iwm: 21.4 },
  { tenor: "3M", spy: 16.2, qqq: 20.1, iwm: 23.8 },
  { tenor: "6M", spy: 17.8, qqq: 21.4, iwm: 25.2 },
  { tenor: "1Y", spy: 18.4, qqq: 22.8, iwm: 26.4 },
];

interface PositionRow {
  label: string;
  bullish: number;
  bearish: number;
  neutral: number;
  source: string;
}
const POSITIONING: PositionRow[] = [
  { label: "AAII Investor Sentiment", bullish: 42.8, bearish: 28.4, neutral: 28.8, source: "AAII Survey" },
  { label: "Fund Manager Survey", bullish: 38.0, bearish: 24.0, neutral: 38.0, source: "BofA FMS" },
  { label: "NAAIM Exposure Index", bullish: 72.4, bearish: 0, neutral: 27.6, source: "NAAIM" },
];
const SPEC_POS: { asset: string; net: number; chg: number }[] = [
  { asset: "S&P 500 E-mini", net: 142800, chg: 12400 },
  { asset: "10Y Treasury", net: -284500, chg: -18200 },
  { asset: "EUR/USD", net: 68400, chg: 5800 },
  { asset: "Gold", net: 198200, chg: 8400 },
  { asset: "Crude Oil", net: -42800, chg: -12800 },
  { asset: "Bitcoin CME", net: 24800, chg: 4200 },
];

type Tab = "overview" | "social" | "options" | "positioning";

export default function MarketSentimentPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "FEAR & GREED" },
    { key: "social", label: "SOCIAL SENTIMENT" },
    { key: "options", label: "OPTIONS FLOW" },
    { key: "positioning", label: "POSITIONING" },
  ];

  return (
    <div style={{ background: bg, color: txt, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      {/* header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>MARKET SENTIMENT ENGINE</span>
          <span style={{ fontSize: 11, color: txtDim }}>Real-Time Fear, Greed & Flow Analytics</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "4px 12px", fontSize: 11, fontWeight: 600, borderRadius: 4,
              border: `1px solid ${tab === t.key ? accent : border}`,
              background: tab === t.key ? `${accent}18` : "transparent",
              color: tab === t.key ? accent : txtDim, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {/* ── OVERVIEW ──────────────────────────────────────────── */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* top row: gauge + summary */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: surface, borderRadius: 8, border: `1px solid ${border}`, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 260 }}>
                <div style={{ fontSize: 11, color: txtDim, marginBottom: 4 }}>FEAR & GREED INDEX</div>
                <ArcGauge value={FEAR_GREED} />
                <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11 }}>
                  <div>Previous: <span style={{ color: zoneColor(FEAR_GREED_PREV), fontWeight: 700 }}>{FEAR_GREED_PREV}</span></div>
                  <div>1W Ago: <span style={{ color: zoneColor(48), fontWeight: 700 }}>48</span></div>
                  <div>1M Ago: <span style={{ color: zoneColor(35), fontWeight: 700 }}>35</span></div>
                </div>
              </div>

              {/* quick stats */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {[
                  { label: "VIX", value: "16.42", chg: -1.24, color: "#22c55e" },
                  { label: "Put/Call", value: "0.72", chg: -0.04, color: accent },
                  { label: "SKEW", value: "132.4", chg: 2.8, color: "#f97316" },
                  { label: "Breadth", value: "1.84:1", chg: 0.12, color: "#22c55e" },
                  { label: "New Hi/Lo", value: "+142", chg: 28, color: accent },
                  { label: "AAII Bull", value: "42.8%", chg: 4.2, color: "#22c55e" },
                ].map(s => (
                  <div key={s.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: txtDim, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: s.chg >= 0 ? accent : "#ef4444", marginTop: 2 }}>{s.chg >= 0 ? "+" : ""}{s.chg}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* components grid */}
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 4 }}>SENTIMENT COMPONENTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {COMPONENTS.map(c => (
                <div key={c.name} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: signalColor(c.signal), padding: "1px 6px", borderRadius: 3, border: `1px solid ${signalColor(c.signal)}40` }}>{c.signal}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: signalColor(c.signal), fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
                  <MiniGauge value={c.score} color={signalColor(c.signal)} />
                  <div style={{ fontSize: 10, color: txtDim, marginTop: 6 }}>{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOCIAL SENTIMENT ─────────────────────────────────── */}
        {tab === "social" && (
          <div>
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginBottom: 12 }}>SOCIAL SENTIMENT TRACKER — Top Trending Tickers</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["#", "TICKER", "COMPANY", "SOCIAL VOL", "SENTIMENT", "24H CHG", "BUZZ"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: h === "TICKER" || h === "COMPANY" || h === "#" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOCIAL.map((s, i) => (
                  <tr key={s.ticker} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, color: txtDim, fontSize: 11 }}>{i + 1}</td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, fontWeight: 700, color: "#fbbf24" }}>{s.ticker}</td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, color: txtDim, fontSize: 12 }}>{s.name}</td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(s.volume / 1000).toFixed(1)}K</td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <div style={{ width: 60, height: 8, background: border, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                          <div style={{
                            position: "absolute", top: 0, height: "100%", borderRadius: 4,
                            left: s.sentiment >= 0 ? "50%" : `${50 + s.sentiment / 2}%`,
                            width: `${Math.abs(s.sentiment) / 2}%`,
                            background: s.sentiment >= 0 ? accent : "#ef4444",
                          }} />
                        </div>
                        <span style={{ color: s.sentiment >= 0 ? accent : "#ef4444", fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>
                          {s.sentiment > 0 ? "+" : ""}{s.sentiment}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, textAlign: "right", color: s.chg24h >= 0 ? accent : "#ef4444", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {s.chg24h >= 0 ? "+" : ""}{s.chg24h.toFixed(1)}%
                    </td>
                    <td style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, textAlign: "right" }}>
                      {s.buzz ? <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: 11 }}>SPIKE</span> : <span style={{ color: txtDim, fontSize: 11 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* sentiment distribution summary */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {[
                { label: "Avg Sentiment", value: (SOCIAL.reduce((a, s) => a + s.sentiment, 0) / SOCIAL.length).toFixed(1), color: accent },
                { label: "Buzz Spikes", value: SOCIAL.filter(s => s.buzz).length.toString(), color: "#fbbf24" },
                { label: "Total Social Vol", value: `${(SOCIAL.reduce((a, s) => a + s.volume, 0) / 1000).toFixed(0)}K`, color: txt },
              ].map(m => (
                <div key={m.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 16px", flex: 1 }}>
                  <div style={{ fontSize: 10, color: txtDim }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── OPTIONS FLOW ─────────────────────────────────────── */}
        {tab === "options" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {/* Put/Call chart */}
              <div style={{ flex: 2, minWidth: 300, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginBottom: 12 }}>PUT/CALL RATIO — 20 Day History</div>
                <svg width="100%" height={160} viewBox="0 0 400 160">
                  {/* grid */}
                  {[0.6, 0.7, 0.8, 0.9, 1.0].map(v => {
                    const y = 150 - ((v - 0.5) / 0.6) * 140;
                    return <g key={v}><line x1={30} y1={y} x2={390} y2={y} stroke={border} strokeWidth={0.5} /><text x={4} y={y + 4} fill={txtDim} fontSize={9} fontFamily="monospace">{v.toFixed(1)}</text></g>;
                  })}
                  {/* mean line */}
                  {(() => { const y = 150 - ((0.80 - 0.5) / 0.6) * 140; return <line x1={30} y1={y} x2={390} y2={y} stroke="#f97316" strokeWidth={1} strokeDasharray="4 2" />; })()}
                  {/* bars */}
                  {PC_HISTORY.map((v, i) => {
                    const x = 35 + i * 18;
                    const h = ((v - 0.5) / 0.6) * 140;
                    const y = 150 - h;
                    return <rect key={i} x={x} y={y} width={12} height={h} rx={2} fill={v > 0.85 ? "#ef4444" : v < 0.75 ? accent : "#6b7280"} opacity={0.8} />;
                  })}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: txtDim, marginTop: 4 }}>
                  <span>20 days ago</span>
                  <span style={{ color: "#f97316" }}>— Avg (0.80)</span>
                  <span>Today</span>
                </div>
              </div>

              {/* SKEW + Vol term structure */}
              <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 10, color: txtDim }}>CBOE SKEW INDEX</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: SKEW_VAL > 130 ? "#f97316" : accent, fontVariantNumeric: "tabular-nums" }}>{SKEW_VAL}</div>
                  <MiniGauge value={SKEW_VAL - 100} max={60} color={SKEW_VAL > 130 ? "#f97316" : accent} />
                  <div style={{ fontSize: 10, color: txtDim, marginTop: 4 }}>Elevated tail risk (avg 120)</div>
                </div>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16, flex: 1 }}>
                  <div style={{ fontSize: 10, color: txtDim, marginBottom: 8 }}>IMPLIED VOL TERM STRUCTURE</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["TENOR", "SPY", "QQQ", "IWM"].map(h => (
                          <th key={h} style={{ padding: "3px 6px", fontSize: 10, color: accent, fontWeight: 700, textAlign: h === "TENOR" ? "left" : "right", borderBottom: `1px solid ${border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {VOL_TERM.map(r => (
                        <tr key={r.tenor}>
                          <td style={{ padding: "3px 6px", fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{r.tenor}</td>
                          <td style={{ padding: "3px 6px", fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums", borderBottom: `1px solid ${border}` }}>{r.spy}%</td>
                          <td style={{ padding: "3px 6px", fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums", borderBottom: `1px solid ${border}` }}>{r.qqq}%</td>
                          <td style={{ padding: "3px 6px", fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums", borderBottom: `1px solid ${border}` }}>{r.iwm}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* options flow summary tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {[
                { label: "Total Options Volume", value: "42.8M", color: txt },
                { label: "Call Volume", value: "24.2M", color: accent },
                { label: "Put Volume", value: "18.6M", color: "#ef4444" },
                { label: "P/C Ratio", value: "0.72", color: "#fbbf24" },
                { label: "0DTE Share", value: "42.8%", color: "#a855f7" },
                { label: "SPX Gamma (Bn)", value: "$4.2B", color: "#38bdf8" },
              ].map(t => (
                <div key={t.label} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: txtDim }}>{t.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: t.color, fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POSITIONING ──────────────────────────────────────── */}
        {tab === "positioning" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Surveys */}
            <div style={{ fontSize: 12, color: accent, fontWeight: 700 }}>INSTITUTIONAL SURVEYS</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {POSITIONING.map(p => (
                <div key={p.label} style={{ flex: 1, minWidth: 240, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: txtDim, marginBottom: 10 }}>Source: {p.source}</div>
                  {/* stacked bar */}
                  <div style={{ display: "flex", height: 20, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: `${p.bullish}%`, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: bg }}>{p.bullish.toFixed(1)}%</div>
                    {p.neutral > 0 && <div style={{ width: `${p.neutral}%`, background: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: txt }}>{p.neutral.toFixed(1)}%</div>}
                    {p.bearish > 0 && <div style={{ width: `${p.bearish}%`, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: txt }}>{p.bearish.toFixed(1)}%</div>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: txtDim }}>
                    <span style={{ color: accent }}>Bullish</span>
                    <span>Neutral</span>
                    <span style={{ color: "#ef4444" }}>Bearish</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Speculative Positioning */}
            <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginTop: 4 }}>NET SPECULATIVE POSITIONING (CFTC COT)</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ASSET", "NET CONTRACTS", "WEEKLY CHG", "SIGNAL", "POSITIONING BAR"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: h === "ASSET" ? "left" : "right", borderBottom: `2px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_POS.map((s, i) => {
                  const maxAbs = Math.max(...SPEC_POS.map(p => Math.abs(p.net)));
                  const pct = (Math.abs(s.net) / maxAbs) * 100;
                  return (
                    <tr key={s.asset} style={{ background: i % 2 === 0 ? "transparent" : `${surface}60` }}>
                      <td style={{ padding: "7px 12px", fontWeight: 600, borderBottom: `1px solid ${border}` }}>{s.asset}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: s.net >= 0 ? accent : "#ef4444", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {s.net >= 0 ? "+" : ""}{(s.net / 1000).toFixed(1)}K
                      </td>
                      <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}`, color: s.chg >= 0 ? accent : "#ef4444", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                        {s.chg >= 0 ? "+" : ""}{(s.chg / 1000).toFixed(1)}K
                      </td>
                      <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                        <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, fontWeight: 700, color: s.net >= 0 ? accent : "#ef4444", border: `1px solid ${s.net >= 0 ? accent : "#ef4444"}40` }}>
                          {s.net >= 0 ? "NET LONG" : "NET SHORT"}
                        </span>
                      </td>
                      <td style={{ padding: "7px 12px", textAlign: "right", borderBottom: `1px solid ${border}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                          <div style={{ width: 80, height: 8, background: border, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: s.net >= 0 ? accent : "#ef4444", borderRadius: 4 }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, fontSize: 11, color: txtDim, display: "flex", justifyContent: "space-between" }}>
        <span>DEMO MODE — Sentiment data refreshes every 15 min in live mode</span>
        <span>NUR Finance Sentiment Engine v3.0</span>
      </div>
    </div>
  );
}
