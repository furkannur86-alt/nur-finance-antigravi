"use client";
import { useState, useMemo } from "react";

/* ── Bloomberg ECO-style Economic Calendar ───────────────────── */

type Importance = "HIGH" | "MEDIUM" | "LOW";
type Country = "US" | "EU" | "UK" | "JP" | "CN" | "TR" | "DE" | "CA" | "AU" | "CH";

interface EcoEvent {
  id: number;
  day: 0 | 1 | 2 | 3 | 4; // Mon–Fri
  time: string;            // HH:MM UTC
  country: Country;
  name: string;
  importance: Importance;
  previous: string;
  consensus: string;
  actual: string | null;   // null = not yet released
}

const FLAG: Record<Country, string> = {
  US: "🇺🇸", EU: "🇪🇺", UK: "🇬🇧", JP: "🇯🇵", CN: "🇨🇳",
  TR: "🇹🇷", DE: "🇩🇪", CA: "🇨🇦", AU: "🇦🇺", CH: "🇨🇭",
};

const EVENTS: EcoEvent[] = [
  // ── Monday ──
  { id: 1,  day: 0, time: "08:30", country: "US", name: "Chicago Fed National Activity", importance: "MEDIUM", previous: "0.12", consensus: "0.08", actual: "0.15" },
  { id: 2,  day: 0, time: "09:45", country: "US", name: "S&P Global Mfg PMI (Flash)", importance: "HIGH", previous: "49.8", consensus: "50.1", actual: "50.4" },
  { id: 3,  day: 0, time: "09:00", country: "EU", name: "Eurozone Mfg PMI (Flash)", importance: "HIGH", previous: "43.4", consensus: "43.8", actual: "44.2" },
  { id: 4,  day: 0, time: "09:30", country: "UK", name: "UK Mfg PMI (Flash)", importance: "HIGH", previous: "47.2", consensus: "47.5", actual: null },
  { id: 5,  day: 0, time: "10:00", country: "US", name: "Existing Home Sales", importance: "MEDIUM", previous: "4.07M", consensus: "4.15M", actual: "4.11M" },
  { id: 6,  day: 0, time: "01:30", country: "CN", name: "PBoC 1-Year MLF Rate", importance: "HIGH", previous: "2.50%", consensus: "2.50%", actual: "2.50%" },
  // ── Tuesday ──
  { id: 7,  day: 1, time: "08:30", country: "US", name: "Durable Goods Orders MoM", importance: "HIGH", previous: "-5.2%", consensus: "1.1%", actual: null },
  { id: 8,  day: 1, time: "09:00", country: "DE", name: "Ifo Business Climate", importance: "HIGH", previous: "85.7", consensus: "86.0", actual: null },
  { id: 9,  day: 1, time: "10:00", country: "US", name: "CB Consumer Confidence", importance: "HIGH", previous: "102.0", consensus: "104.0", actual: null },
  { id: 10, day: 1, time: "10:00", country: "US", name: "New Home Sales", importance: "MEDIUM", previous: "676K", consensus: "682K", actual: null },
  { id: 11, day: 1, time: "10:00", country: "US", name: "Richmond Fed Mfg Index", importance: "LOW", previous: "-9", consensus: "-7", actual: null },
  { id: 12, day: 1, time: "14:00", country: "US", name: "FOMC Meeting Minutes", importance: "HIGH", previous: "—", consensus: "—", actual: null },
  { id: 13, day: 1, time: "10:00", country: "TR", name: "TCMB Interest Rate Decision", importance: "HIGH", previous: "50.00%", consensus: "50.00%", actual: null },
  // ── Wednesday ──
  { id: 14, day: 2, time: "07:00", country: "UK", name: "UK CPI YoY", importance: "HIGH", previous: "4.0%", consensus: "3.8%", actual: null },
  { id: 15, day: 2, time: "08:30", country: "US", name: "GDP (Q3 Final) QoQ", importance: "HIGH", previous: "2.1%", consensus: "5.2%", actual: null },
  { id: 16, day: 2, time: "08:30", country: "US", name: "Initial Jobless Claims", importance: "MEDIUM", previous: "205K", consensus: "210K", actual: null },
  { id: 17, day: 2, time: "10:00", country: "US", name: "Personal Spending MoM", importance: "MEDIUM", previous: "0.7%", consensus: "0.3%", actual: null },
  { id: 18, day: 2, time: "10:30", country: "US", name: "EIA Crude Oil Inventories", importance: "MEDIUM", previous: "-2.4M", consensus: "-1.8M", actual: null },
  { id: 19, day: 2, time: "00:50", country: "JP", name: "BoJ Monetary Policy Minutes", importance: "HIGH", previous: "—", consensus: "—", actual: null },
  { id: 20, day: 2, time: "02:30", country: "AU", name: "Australia CPI QoQ", importance: "HIGH", previous: "1.2%", consensus: "1.0%", actual: null },
  // ── Thursday ──
  { id: 21, day: 3, time: "08:30", country: "US", name: "Core PCE Price Index MoM", importance: "HIGH", previous: "0.3%", consensus: "0.2%", actual: null },
  { id: 22, day: 3, time: "08:30", country: "US", name: "Personal Income MoM", importance: "MEDIUM", previous: "0.4%", consensus: "0.4%", actual: null },
  { id: 23, day: 3, time: "10:00", country: "US", name: "U. of Michigan Sentiment (Final)", importance: "MEDIUM", previous: "61.3", consensus: "69.4", actual: null },
  { id: 24, day: 3, time: "10:00", country: "US", name: "Pending Home Sales MoM", importance: "MEDIUM", previous: "1.0%", consensus: "-0.5%", actual: null },
  { id: 25, day: 3, time: "08:00", country: "CH", name: "SNB Interest Rate Decision", importance: "HIGH", previous: "1.75%", consensus: "1.75%", actual: null },
  { id: 26, day: 3, time: "07:00", country: "UK", name: "UK GDP QoQ (Final)", importance: "HIGH", previous: "0.2%", consensus: "0.0%", actual: null },
  { id: 27, day: 3, time: "10:00", country: "CA", name: "Canada GDP MoM", importance: "HIGH", previous: "0.0%", consensus: "0.1%", actual: null },
  // ── Friday ──
  { id: 28, day: 4, time: "08:30", country: "US", name: "Nonfarm Payrolls", importance: "HIGH", previous: "150K", consensus: "185K", actual: null },
  { id: 29, day: 4, time: "08:30", country: "US", name: "Unemployment Rate", importance: "HIGH", previous: "3.9%", consensus: "3.9%", actual: null },
  { id: 30, day: 4, time: "08:30", country: "US", name: "Average Hourly Earnings MoM", importance: "HIGH", previous: "0.2%", consensus: "0.3%", actual: null },
  { id: 31, day: 4, time: "10:00", country: "US", name: "ISM Manufacturing PMI", importance: "HIGH", previous: "46.7", consensus: "47.2", actual: null },
  { id: 32, day: 4, time: "10:00", country: "US", name: "Construction Spending MoM", importance: "LOW", previous: "0.6%", consensus: "0.4%", actual: null },
  { id: 33, day: 4, time: "03:30", country: "CN", name: "Caixin Manufacturing PMI", importance: "HIGH", previous: "49.5", consensus: "49.8", actual: null },
  { id: 34, day: 4, time: "10:00", country: "EU", name: "Eurozone CPI (Flash) YoY", importance: "HIGH", previous: "2.4%", consensus: "2.3%", actual: null },
];

const DAY_LABELS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

const COUNTRY_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "US",  label: "🇺🇸 US" },
  { key: "EU",  label: "🇪🇺 EU" },
  { key: "UK",  label: "🇬🇧 UK" },
  { key: "JP",  label: "🇯🇵 Japan" },
  { key: "CN",  label: "🇨🇳 China" },
  { key: "TR",  label: "🇹🇷 Turkey" },
  { key: "OTHER", label: "Other" },
] as const;

const SURPRISE_DATA: { region: string; months: number[] }[] = [
  { region: "US",    months: [ 12.4, -8.2,  18.6,   5.1,  -3.8,  14.2] },
  { region: "EU",    months: [-22.1, -14.5, -18.3,  -9.2,  -4.6,   2.8] },
  { region: "China", months: [ -8.4, -12.8,  -6.1,   3.4,  -1.2,   5.6] },
  { region: "EM",    months: [ -4.2,   1.8,  -7.4,   6.2,   3.1,   8.4] },
];
const SURPRISE_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const IMP_DOT: Record<Importance, string> = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#6b7280" };
const IMP_ORDER: Record<Importance, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

// ── Component ───────────────────────────────────────────────────

export default function EconomicCalendarPanel() {
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [impFilter, setImpFilter] = useState<Record<Importance, boolean>>({ HIGH: true, MEDIUM: true, LOW: true });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const accent  = "#00e5a0";
  const bg      = "#0a0e17";
  const surface = "#111827";
  const border  = "#1e293b";
  const txt1    = "#e2e8f0";
  const txt2    = "#94a3b8";

  const otherCountries = new Set<Country>(["DE", "CA", "AU", "CH"]);

  const filtered = useMemo(() =>
    EVENTS.filter(e => {
      if (!impFilter[e.importance]) return false;
      if (countryFilter === "ALL") return true;
      if (countryFilter === "OTHER") return otherCountries.has(e.country);
      return e.country === countryFilter;
    }).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time) || IMP_ORDER[a.importance] - IMP_ORDER[b.importance]),
  [countryFilter, impFilter]);

  const upcoming = filtered.filter(e => e.actual === null).slice(0, 5);

  const eventsByDay = (day: number) => filtered.filter(e => e.day === day);

  const toggleImp = (imp: Importance) => setImpFilter(p => ({ ...p, [imp]: !p[imp] }));

  // ── Surprise chart helpers ──
  const sMax = Math.max(...SURPRISE_DATA.flatMap(r => r.months.map(Math.abs)));
  const sH = 140, sW = 480, sPad = 50, barW = 14, gapG = 4;
  const regionColors = ["#38bdf8", "#a855f7", "#ef4444", "#f59e0b"];

  return (
    <div style={{ background: bg, color: txt1, height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13 }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: accent, fontWeight: 700, fontSize: 15 }}>ECONOMIC CALENDAR</span>
          <span style={{ color: txt2, fontSize: 11 }}>Bloomberg ECO&lt;GO&gt; // {filtered.length} events</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {(["HIGH", "MEDIUM", "LOW"] as Importance[]).map(imp => (
            <button key={imp} onClick={() => toggleImp(imp)} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", fontSize: 10, borderRadius: 4,
              border: `1px solid ${impFilter[imp] ? IMP_DOT[imp] : border}`,
              background: impFilter[imp] ? `${IMP_DOT[imp]}18` : "transparent",
              color: impFilter[imp] ? IMP_DOT[imp] : txt2, cursor: "pointer", fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: IMP_DOT[imp], opacity: impFilter[imp] ? 1 : 0.3 }} />
              {imp}
            </button>
          ))}
        </div>
      </div>

      {/* Country filters */}
      <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${border}`, flexWrap: "wrap" }}>
        {COUNTRY_FILTERS.map(c => (
          <button key={c.key} onClick={() => setCountryFilter(c.key)} style={{
            padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
            border: `1px solid ${countryFilter === c.key ? accent : border}`,
            background: countryFilter === c.key ? `${accent}18` : "transparent",
            color: countryFilter === c.key ? accent : txt2, cursor: "pointer",
          }}>{c.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Upcoming Events Strip */}
        {upcoming.length > 0 && (
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, background: `${surface}80` }}>
            <div style={{ color: accent, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>UPCOMING RELEASES</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
              {upcoming.map(e => (
                <div key={e.id} style={{
                  minWidth: 200, padding: "8px 12px", background: surface, border: `1px solid ${border}`, borderRadius: 6,
                  borderLeft: `3px solid ${IMP_DOT[e.importance]}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: txt2 }}>{FLAG[e.country]} {DAY_LABELS[e.day].slice(0, 3)} {e.time} UTC</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: IMP_DOT[e.importance] }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: txt2 }}>
                    Prev: <span style={{ color: txt1 }}>{e.previous}</span> &nbsp;|&nbsp; Cons: <span style={{ color: accent }}>{e.consensus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Calendar Grid */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {DAY_LABELS.map((dayLabel, dayIdx) => {
            const dayEvents = eventsByDay(dayIdx);
            if (dayEvents.length === 0) return null;
            const isOpen = selectedDay === null || selectedDay === dayIdx;
            return (
              <div key={dayIdx} style={{ borderBottom: `1px solid ${border}` }}>
                <div
                  onClick={() => setSelectedDay(selectedDay === dayIdx ? null : dayIdx)}
                  style={{
                    padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: `${surface}60`, cursor: "pointer", userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: accent, fontWeight: 700, fontSize: 12, width: 100 }}>{dayLabel}</span>
                    <span style={{ fontSize: 11, color: txt2 }}>{dayEvents.length} events</span>
                    <span style={{ display: "flex", gap: 3 }}>
                      {dayEvents.filter(e => e.importance === "HIGH").length > 0 && <span style={{ width: 7, height: 7, borderRadius: "50%", background: IMP_DOT.HIGH }} />}
                      {dayEvents.filter(e => e.importance === "MEDIUM").length > 0 && <span style={{ width: 7, height: 7, borderRadius: "50%", background: IMP_DOT.MEDIUM }} />}
                    </span>
                  </div>
                  <span style={{ color: txt2, fontSize: 11 }}>{isOpen ? "▾" : "▸"}</span>
                </div>
                {isOpen && (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "4px 16px", textAlign: "left", fontSize: 10, color: txt2, fontWeight: 600 }}>TIME</th>
                        <th style={{ padding: "4px 8px", textAlign: "center", fontSize: 10, color: txt2, fontWeight: 600, width: 24 }} />
                        <th style={{ padding: "4px 8px", textAlign: "left", fontSize: 10, color: txt2, fontWeight: 600 }}>EVENT</th>
                        <th style={{ padding: "4px 8px", textAlign: "center", fontSize: 10, color: txt2, fontWeight: 600, width: 24 }}>IMP</th>
                        <th style={{ padding: "4px 12px", textAlign: "right", fontSize: 10, color: txt2, fontWeight: 600 }}>PREV</th>
                        <th style={{ padding: "4px 12px", textAlign: "right", fontSize: 10, color: txt2, fontWeight: 600 }}>CONS</th>
                        <th style={{ padding: "4px 16px", textAlign: "right", fontSize: 10, color: txt2, fontWeight: 600 }}>ACTUAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEvents.map((e, i) => {
                        const beat = e.actual !== null && e.consensus !== "—" ? (() => {
                          const a = parseFloat(e.actual.replace(/[%KMB]/g, ""));
                          const c = parseFloat(e.consensus.replace(/[%KMB]/g, ""));
                          if (isNaN(a) || isNaN(c)) return null;
                          return a > c ? accent : a < c ? "#ff4d6a" : txt2;
                        })() : null;
                        return (
                          <tr key={e.id} style={{ background: i % 2 === 0 ? "transparent" : `${surface}30` }}>
                            <td style={{ padding: "6px 16px", fontSize: 12, color: txt2, borderBottom: `1px solid ${border}20`, fontVariantNumeric: "tabular-nums" }}>{e.time}</td>
                            <td style={{ padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${border}20`, fontSize: 14 }}>{FLAG[e.country]}</td>
                            <td style={{ padding: "6px 8px", fontWeight: 600, borderBottom: `1px solid ${border}20`, fontSize: 12 }}>{e.name}</td>
                            <td style={{ padding: "6px 8px", textAlign: "center", borderBottom: `1px solid ${border}20` }}>
                              <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: IMP_DOT[e.importance] }} />
                            </td>
                            <td style={{ padding: "6px 12px", textAlign: "right", borderBottom: `1px solid ${border}20`, color: txt2, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{e.previous}</td>
                            <td style={{ padding: "6px 12px", textAlign: "right", borderBottom: `1px solid ${border}20`, color: accent, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{e.consensus}</td>
                            <td style={{ padding: "6px 16px", textAlign: "right", borderBottom: `1px solid ${border}20`, fontWeight: 700, fontVariantNumeric: "tabular-nums", fontSize: 12,
                              color: e.actual === null ? txt2 : beat ?? txt1,
                            }}>
                              {e.actual ?? "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>

        {/* Economic Surprise Index Chart */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: accent, fontWeight: 700, fontSize: 12 }}>ECONOMIC SURPRISE INDEX</span>
            <div style={{ display: "flex", gap: 12 }}>
              {SURPRISE_DATA.map((r, ri) => (
                <span key={r.region} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: regionColors[ri] }} />
                  <span style={{ color: txt2 }}>{r.region}</span>
                </span>
              ))}
            </div>
          </div>
          <svg viewBox={`0 0 ${sW} ${sH}`} width="100%" height={sH} style={{ display: "block" }}>
            {/* grid */}
            <line x1={sPad} y1={sH / 2} x2={sW} y2={sH / 2} stroke={border} strokeWidth={1} strokeDasharray="4,3" />
            <text x={sPad - 4} y={14} textAnchor="end" fill={txt2} fontSize={9}>+{Math.round(sMax)}</text>
            <text x={sPad - 4} y={sH / 2 + 3} textAnchor="end" fill={txt2} fontSize={9}>0</text>
            <text x={sPad - 4} y={sH - 4} textAnchor="end" fill={txt2} fontSize={9}>{-Math.round(sMax)}</text>
            {/* bars */}
            {SURPRISE_MONTHS.map((m, mi) => {
              const groupW = SURPRISE_DATA.length * (barW + gapG);
              const gx = sPad + 10 + mi * ((sW - sPad - 10) / SURPRISE_MONTHS.length);
              return (
                <g key={m}>
                  <text x={gx + groupW / 2} y={sH - 1} textAnchor="middle" fill={txt2} fontSize={9}>{m}</text>
                  {SURPRISE_DATA.map((r, ri) => {
                    const val = r.months[mi];
                    const h = (Math.abs(val) / sMax) * (sH / 2 - 12);
                    const y = val >= 0 ? sH / 2 - h : sH / 2;
                    return (
                      <rect key={ri} x={gx + ri * (barW + gapG)} y={y} width={barW} height={h}
                        fill={regionColors[ri]} rx={2} opacity={0.85} />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${border}`, background: surface, display: "flex", justifyContent: "space-between", fontSize: 10, color: txt2 }}>
        <span>Total: {filtered.length} events | Released: {filtered.filter(e => e.actual !== null).length} | Pending: {filtered.filter(e => e.actual === null).length}</span>
        <span>DEMO MODE — Live feed requires NUR Finance R subscription</span>
      </div>
    </div>
  );
}
