"use client";

import { useState } from "react";

type Pillar =
  | "demographics"
  | "elections"
  | "biosurveillance"
  | "centralbank"
  | "supplychains"
  | "c4isr"
  | "cyberwarfare";

// ── Demographics & Health Intelligence ──────────────────────────────────────
const DEMO_NATIONS = [
  { nation: "USA",    pop: 340.1,  gdpPc: 80412, lifeExp: 77.5, fertRate: 1.62, medAge: 38.5, urbanPct: 83, migrantNet: "+1,100K", laborForce: 168.2, risk: "LOW"    },
  { nation: "China",  pop: 1409.7, gdpPc: 12720, lifeExp: 78.6, fertRate: 1.09, medAge: 39.0, urbanPct: 65, migrantNet: "-400K",   laborForce: 780.0, risk: "HIGH"   },
  { nation: "EU-27",  pop: 446.8,  gdpPc: 38600, lifeExp: 81.0, fertRate: 1.46, medAge: 44.5, urbanPct: 75, migrantNet: "+800K",   laborForce: 200.5, risk: "MOD"    },
  { nation: "India",  pop: 1428.6, gdpPc: 2389,  lifeExp: 70.8, fertRate: 2.01, medAge: 28.4, urbanPct: 36, migrantNet: "-500K",   laborForce: 535.0, risk: "MOD"    },
  { nation: "Russia", pop: 143.8,  gdpPc: 13120, lifeExp: 72.0, fertRate: 1.50, medAge: 41.2, urbanPct: 74, migrantNet: "+70K",    laborForce:  71.5, risk: "HIGH"   },
  { nation: "Turkey", pop:  85.3,  gdpPc: 10674, lifeExp: 77.7, fertRate: 1.76, medAge: 32.5, urbanPct: 77, migrantNet: "+400K",   laborForce:  33.6, risk: "MOD"    },
  { nation: "Brazil", pop: 215.3,  gdpPc: 8917,  lifeExp: 73.4, fertRate: 1.65, medAge: 35.0, urbanPct: 88, migrantNet: "+20K",    laborForce: 108.4, risk: "LOW"    },
];

// ── Election & Political Risk Intelligence ───────────────────────────────────
const ELECTION_EVENTS = [
  { id: "e1",  nation: "USA",        date: "Nov 2028", type: "Presidential", riskScore: 72, scenario: "Populist reversal risk: trade tariffs ≥25%, Fed independence threat. Market impact: USD -8%, S&P500 -12%", incumbent: "Democrat", challenger: "GOP-Trump wing", polarity: "HIGH" },
  { id: "e2",  nation: "Germany",    date: "Sep 2025", type: "Parliamentary", riskScore: 45, scenario: "AfD surge to 22%+ fragmenting coalition. CDU/CSU likely lead. Fiscal brake reform stalled. DAX neutral.", incumbent: "SPD-led coalition", challenger: "CDU/CSU", polarity: "MOD" },
  { id: "e3",  nation: "France",     date: "Apr 2027", type: "Presidential",  riskScore: 60, scenario: "Le Pen path if Macron successor fails. Euro-skeptic risk, NATO ambiguity. EUR/USD -4% downside.", incumbent: "Macron bloc", challenger: "RN Marine Le Pen", polarity: "HIGH" },
  { id: "e4",  nation: "Brazil",     date: "Oct 2026", type: "Presidential",  riskScore: 38, scenario: "Lula re-election probable. Fiscal responsibility tension. BRL stable ±5%.", incumbent: "Lula (PT)", challenger: "Bolsonaro coalition", polarity: "MOD" },
  { id: "e5",  nation: "India",      date: "May 2029", type: "General",       riskScore: 30, scenario: "Modi/BJP dominant. Hindu-nationalist trajectory continues. INR stable, FDI risk low.", incumbent: "BJP-NDA", challenger: "INDIA bloc", polarity: "LOW" },
  { id: "e6",  nation: "Turkey",     date: "Jun 2028", type: "Presidential",  riskScore: 65, scenario: "Erdoğan successor risk. Constitutional ambiguity. TRY hyperinflation tail risk persists.", incumbent: "AKP-Erdoğan", challenger: "CHP-opposition", polarity: "HIGH" },
  { id: "e7",  nation: "South Korea", date: "Mar 2027", type: "Presidential", riskScore: 42, scenario: "DPRK nuclear trigger volatility. Chaebols reform cycle. KRW ±6% election sensitivity.", incumbent: "PPP", challenger: "DP opposition", polarity: "MOD" },
];

// ── Biosurveillance Intelligence ─────────────────────────────────────────────
const BIO_ALERTS = [
  { id: "b1",  pathogen: "H5N1 Avian Influenza A",  region: "USA / Asia Pacific", threat: "CRITICAL", r0est: "2.1–2.8 (human-human unconfirmed)", cfr: "~52% (historical)", cases: "887 human 2024",  status: "ACTIVE SURVEILLANCE", impact: "Food supply disruption, poultry export bans, pandemic preparedness trigger" },
  { id: "b2",  pathogen: "Mpox Clade Ib",            region: "DRC / East Africa",  threat: "HIGH",     r0est: "1.4–2.2",                          cfr: "~3.6%",             cases: "42K+ 2024",       status: "WHO PHEIC DECLARED",   impact: "African Union border friction, vaccine equity tensions, travel advisory cascade" },
  { id: "b3",  pathogen: "Oropouche Virus",          region: "Latin America",      threat: "ELEVATED", r0est: "1.2–1.8",                          cfr: "<0.1% (suspected)", cases: "8K+ 2024",        status: "EMERGING",             impact: "Amazon labor disruption, Brazil agri-sector exposure, WHO monitoring" },
  { id: "b4",  pathogen: "XEC COVID Variant",        region: "Global",             threat: "MODERATE", r0est: "3.5–5.2",                          cfr: "<0.3%",             cases: "Rising globally", status: "TREND WATCH",          impact: "Seasonal hospitalization surge, supply chain caution, no lockdown expectation" },
  { id: "b5",  pathogen: "Cholera O1 El Tor",        region: "Sub-Saharan Africa", threat: "HIGH",     r0est: "1.0–2.0 (endemic)",               cfr: "0.5–1.5%",          cases: "700K+ 2023-24",   status: "ENDEMIC SURGE",        impact: "Humanitarian aid flows, UNHCR funding, regional instability amplifier" },
];

// ── Central Bank & Monetary Sovereignty Intelligence ─────────────────────────
const CENTRAL_BANK_DATA = [
  { cb: "Federal Reserve",     country: "USA",     rate: 5.25, balSheet: 7.2,   inflation: 3.4, gdpGrowth: 2.5,  goldRes: 8133,  forexRes: 245,   nextDecision: "Jan 2025",  bias: "CUT", stance: "HAWKISH-NEUTRAL" },
  { cb: "ECB",                 country: "EU",      rate: 3.50, balSheet: 6.9,   inflation: 2.4, gdpGrowth: 0.8,  goldRes: 10773, forexRes: 1100,  nextDecision: "Dec 2024",  bias: "CUT", stance: "DOVISH" },
  { cb: "PBoC",                country: "China",   rate: 3.45, balSheet: 54.3,  inflation: 0.3, gdpGrowth: 4.8,  goldRes: 2264,  forexRes: 3200,  nextDecision: "Dec 2024",  bias: "CUT", stance: "EASING" },
  { cb: "Bank of Japan",       country: "Japan",   rate: 0.25, balSheet: 126.3, inflation: 2.5, gdpGrowth: 0.8,  goldRes: 846,   forexRes: 1280,  nextDecision: "Jan 2025",  bias: "HIKE", stance: "HAWKISH" },
  { cb: "Bank of England",     country: "UK",      rate: 4.75, balSheet: 0.9,   inflation: 2.3, gdpGrowth: 0.9,  goldRes: 310,   forexRes: 176,   nextDecision: "Dec 2024",  bias: "CUT", stance: "NEUTRAL" },
  { cb: "CBRT Turkey",         country: "Turkey",  rate: 50.0, balSheet: 6.4,   inflation: 47.1, gdpGrowth: 3.8, goldRes: 598,   forexRes: 98,    nextDecision: "Dec 2024",  bias: "CUT", stance: "EMERGENCY-TIGHT" },
  { cb: "Central Bank Russia", country: "Russia",  rate: 21.0, balSheet: 35.8,  inflation: 8.5, gdpGrowth: 3.6,  goldRes: 2335,  forexRes: 616,   nextDecision: "Dec 2024",  bias: "HIKE", stance: "WAR-ECONOMY" },
  { cb: "Reserve Bank India",  country: "India",   rate: 6.50, balSheet: 46.7,  inflation: 5.5, gdpGrowth: 7.0,  goldRes: 854,   forexRes: 701,   nextDecision: "Dec 2024",  bias: "CUT", stance: "NEUTRAL" },
];

// ── Critical Supply Chain Chokepoints ────────────────────────────────────────
const SUPPLY_CHAIN_NODES = [
  { id: "sc1",  node: "Strait of Hormuz",          lat: 26.6, lon: 56.4,  category: "ENERGY",    dailyThroughput: "21 Mbbl/d oil", chokePct: "20% world oil",   riskScore: 78, threat: "Iran closure threat, IRGC interdiction, mine deployment", assetImpact: ["BZ=F +40%","XOM","Saudi Aramco lockup"] },
  { id: "sc2",  node: "Strait of Malacca",         lat:  2.5, lon: 101.5, category: "TRADE",     dailyThroughput: "90K ships/yr",  chokePct: "25% world trade", riskScore: 52, threat: "Piracy, China-India friction, port disruption Singapore", assetImpact: ["Shipping +30%","SGD","Container rates"] },
  { id: "sc3",  node: "Taiwan Semiconductor Belt", lat: 24.0, lon: 121.0, category: "TECH",      dailyThroughput: "92% adv. chips", chokePct: "92% ≤5nm logic",  riskScore: 85, threat: "PRC blockade, TSMC disruption, NATO Article 5 analogues", assetImpact: ["TSMC -60%","NVDA -40%","ASML -55%"] },
  { id: "sc4",  node: "Congo Cobalt Corridor",     lat: -10.5, lon: 25.5, category: "MINERALS",  dailyThroughput: "170 Kt Co/yr",  chokePct: "70% world cobalt", riskScore: 80, threat: "DRC instability, M23, Rwanda-DRC conflict, artisanal collapse", assetImpact: ["EV battery costs +35%","GLEN.L","IVN.TO"] },
  { id: "sc5",  node: "Panama Canal",              lat:  9.0, lon: -79.5, category: "TRADE",     dailyThroughput: "14K ships/yr",  chokePct: "5% world trade",  riskScore: 45, threat: "Drought-induced draught limits, US political sovereignty claim", assetImpact: ["Container +15%","LNG re-routing","Grain FFA"] },
  { id: "sc6",  node: "Suez Canal",                lat: 30.5, lon: 32.3,  category: "TRADE",     dailyThroughput: "19K ships/yr",  chokePct: "13% world trade", riskScore: 68, threat: "Houthi interdiction (active), rerouting +$1M/vessel via Cape", assetImpact: ["Freight +60%","Oil tanker premium","EUR exports"] },
  { id: "sc7",  node: "Black Sea Grain Corridor",  lat: 45.0, lon: 32.0,  category: "FOOD",      dailyThroughput: "3.5 Mt grain/mo", chokePct: "30% world wheat", riskScore: 75, threat: "Russia grain deal collapse, naval blockade, Black Sea mining", assetImpact: ["Wheat +25%","Corn","Food inflation EM"] },
];

// ── C4ISR Defense Theater Intelligence ──────────────────────────────────────
const C4ISR_THEATERS = [
  { id: "t1",  theater: "Western Pacific",     threat: "CHINA", forceRatio: "PLA 3.8:1 vs USN 7th Fleet", redLines: "Taiwan blockade, ADIZ violation, Senkaku landing", nuclearStatus: "Triad: ~500 warheads, MIRV DF-41 deployed", ISRcoverage: "DF-21D/DF-26 ASBM effective radius 1,500/4,000km", risk: "CRITICAL" },
  { id: "t2",  theater: "Eastern Europe",      threat: "RUSSIA", forceRatio: "NATO 1.4:1 overall, 1:2 eastern flank", redLines: "Article 5 trigger, Suwalki Gap seizure, nuclear sub-threshold", nuclearStatus: "RS-28 Sarmat, Avangard HGV, Zircon ASM deployed", ISRcoverage: "A2/AD: S-400/500, Iskander-M 500km range", risk: "HIGH" },
  { id: "t3",  theater: "Middle East / Iran",  threat: "IRAN + PROXIES", forceRatio: "Multi-domain proxy network: Hezbollah/Hamas/Houthis/PMF", redLines: "Strait closure, JCPOA collapse, nuclear threshold 90% U-235", nuclearStatus: "Non-nuclear state: ~60kg 60%-enriched U stockpile", ISRcoverage: "Shahed-136 swarm, Qiam-1 SRBM, Persian Gulf mining", risk: "HIGH" },
  { id: "t4",  theater: "Korean Peninsula",    threat: "DPRK", forceRatio: "DPRK 1.28M active + KPA forward massing", redLines: "ICBM test over Japan, nuclear test #7, ROK artillery exchange", nuclearStatus: "~50-60 warheads, Hwasong-18 Solid-fuel ICBM, miniaturized",  ISRcoverage: "EMP threat, GPS jamming, cyber-ISR Lazarus Group", risk: "HIGH" },
  { id: "t5",  theater: "South China Sea",     threat: "CHINA / ASEAN", forceRatio: "PLAN dominance within 1st island chain", redLines: "PCA ruling defiance, Scarborough Shoal fortification, oil platform seizure", nuclearStatus: "CSS-5 regional deterrent, JL-3 SLBM Type 096 deployment", ISRcoverage: "3 carrier groups, J-20 stealth patrols, artificial island A2/AD", risk: "HIGH" },
  { id: "t6",  theater: "Sahel / Sub-Saharan", threat: "Jihadist AQ/IS / Wagner/RF", forceRatio: "French Barkhane withdrawal, RSF Sudan collapse", redLines: "Bamako/Ouagadougou capital fall, uranium/gold access", nuclearStatus: "Non-nuclear: MANPADS, IED, VBIED", ISRcoverage: "Russia drone recon in Mali, Niger, Burkina Faso", risk: "ELEVATED" },
];

// ── Cyber Warfare & SCADA Grid Intelligence ──────────────────────────────────
const CYBER_INCIDENTS = [
  { id: "cy1",  actor: "APT44 (Sandworm / GRU)", target: "Ukraine Power Grid",       technique: "FrostyGoop ICS malware → Lviv blackout Jan 2024. SCADA MODBUS poisoning.", impact: "CRITICAL", sector: "ENERGY-GRID",    confidence: 98, ttps: "T1486, T1485, T0809, T0880", financial: "Grid rebuild $800M+, NATO infrastructure response" },
  { id: "cy2",  actor: "APT41 (Winnti / MSS)",   target: "Taiwan Semiconductor supply", technique: "Watering hole via TSMC supplier portal, persistent access >18mo pre-positioning.", impact: "CRITICAL", sector: "TECH-SUPPLY",    confidence: 91, ttps: "T1195, T1566, T1059", financial: "IP theft est. $14B, fab blueprint exfiltration" },
  { id: "cy3",  actor: "Lazarus Group (DPRK)",    target: "Global Crypto Exchanges",  technique: "DeFi bridge exploit, phishing devs, mixing via Tornado Cash. $3B stolen 2023.", impact: "HIGH",     sector: "FINANCE-DEFI",   confidence: 95, ttps: "T1190, T1078, T1562", financial: "$3B laundered to DPRK WMD program" },
  { id: "cy4",  actor: "Volt Typhoon (PLA ISR)", target: "US Critical Infrastructure", technique: "Living-off-the-land, Cisco router compromise, Guam military pre-positioning.", impact: "CRITICAL", sector: "MULTI-SECTOR",   confidence: 89, ttps: "T1133, T1078, T0800", financial: "Pre-positioned for Taiwan contingency, no monetized yet" },
  { id: "cy5",  actor: "APT29 (Cozy Bear / SVR)", target: "Microsoft 365 / SolarWinds", technique: "OAuth token theft via legacy auth, Midnight Blizzard campaign targeting NATO govts.", impact: "HIGH",     sector: "GOV-TECH",       confidence: 97, ttps: "T1550, T1098, T1566.002", financial: "State secret exfiltration; NSA/CISA emergency directive" },
  { id: "cy6",  actor: "Cl0p (Criminal / TA505)", target: "MOVEit Transfer Global",   technique: "SQL injection zero-day, mass exploitation 2,700+ orgs, ransomware-as-extortion.", impact: "HIGH",     sector: "MULTI-SECTOR",   confidence: 99, ttps: "T1190, T1048, T1486", financial: "$75M extortion realized, 70M+ PII records" },
  { id: "cy7",  actor: "Unknown / State-Like",    target: "Gulf LNG SCADA Facilities", technique: "Triton-class safety system attack attempt on Ras Laffan (QatarEnergy) DCS.", impact: "CRITICAL", sector: "ENERGY-LNG",     confidence: 72, ttps: "T0838, T0878, T0856", financial: "LNG supply disruption est. $4B/day if successful" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const RISK_COLOR: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  ELEVATED: "#f59e0b",
  MOD: "#eab308",
  LOW: "#22c55e",
  MODERATE: "#eab308",
};

function risk(r: string) {
  return RISK_COLOR[r] ?? "#94a3b8";
}

function RiskBadge({ level }: { level: string }) {
  return (
    <span
      className="text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
      style={{ background: risk(level) + "25", color: risk(level), border: `1px solid ${risk(level)}50` }}
    >
      {level}
    </span>
  );
}

// ── Panel Sections ────────────────────────────────────────────────────────────

function DemographicsPanel() {
  return (
    <div className="space-y-4 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        ⚑ Sovereign Demographic & Health Intelligence — Key Nations
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Nation","Pop (M)","GDP/pc $","Life Exp","Fert Rate","Med Age","Urban %","Net Migr","Labor Force (M)","Risk"].map(h => (
                <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-[var(--ag-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_NATIONS.map((d, i) => (
              <tr key={d.nation} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td className="px-3 py-2 font-bold text-white">{d.nation}</td>
                <td className="px-3 py-2">{d.pop.toFixed(1)}</td>
                <td className="px-3 py-2 font-variant-numeric tabular-nums">{d.gdpPc.toLocaleString()}</td>
                <td className="px-3 py-2">{d.lifeExp}</td>
                <td className="px-3 py-2">{d.fertRate}</td>
                <td className="px-3 py-2">{d.medAge}</td>
                <td className="px-3 py-2">{d.urbanPct}%</td>
                <td className="px-3 py-2" style={{ color: d.migrantNet.startsWith("+") ? "#34d399" : "#f87171" }}>{d.migrantNet}</td>
                <td className="px-3 py-2">{d.laborForce}</td>
                <td className="px-3 py-2"><RiskBadge level={d.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Demographic Dividend", value: "India: 28.4 median age — 25yr growth runway", color: "#34d399" },
          { label: "Aging Crisis Watch", value: "China TFR 1.09 · Japan TFR 1.20 · EU TFR 1.46", color: "#f97316" },
          { label: "Labor Force Delta", value: "Sub-Saharan +15M working age/yr vs Japan -0.8M/yr", color: "#38bdf8" },
        ].map(card => (
          <div key={card.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: card.color }}>{card.label}</div>
            <div className="text-[11px] text-white/80 leading-snug">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElectionsPanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        🗳 Electoral & Political Risk — Sovereign Calendar
      </div>
      {ELECTION_EVENTS.map(e => (
        <div key={e.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${risk(e.polarity === "HIGH" ? "HIGH" : e.polarity === "MOD" ? "MODERATE" : "LOW")}30` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{e.nation}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>{e.type}</span>
                <RiskBadge level={e.polarity === "HIGH" ? "HIGH" : e.polarity === "MOD" ? "MODERATE" : "LOW"} />
              </div>
              <div className="text-[10px] text-[var(--ag-muted)] mb-2">📅 {e.date} · {e.incumbent} vs {e.challenger}</div>
              <div className="text-[11px] text-white/75 leading-snug">{e.scenario}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold font-mono" style={{ color: e.riskScore > 70 ? "#ef4444" : e.riskScore > 50 ? "#f97316" : "#eab308" }}>{e.riskScore}</div>
              <div className="text-[9px] text-[var(--ag-muted)]">Risk Score</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BiosurveillancePanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        🧬 Global Biosurveillance — Pandemic & Disease Intelligence
      </div>
      {BIO_ALERTS.map(b => (
        <div key={b.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${risk(b.threat)}30` }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{b.pathogen}</span>
                <RiskBadge level={b.threat} />
              </div>
              <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">📍 {b.region}</div>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-1 rounded shrink-0" style={{ background: risk(b.threat) + "20", color: risk(b.threat), border: `1px solid ${risk(b.threat)}40` }}>
              {b.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[["R₀ Est.", b.r0est],["CFR", b.cfr],["Cases", b.cases]].map(([k, v]) => (
              <div key={k as string} className="rounded p-2" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="text-[9px] text-[var(--ag-muted)] uppercase tracking-wider">{k}</div>
                <div className="text-[11px] font-mono text-white">{v}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-white/70 leading-snug">{b.impact}</div>
        </div>
      ))}
    </div>
  );
}

function CentralBankPanel() {
  return (
    <div className="space-y-4 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        🏦 Sovereign Central Bank & Monetary Intelligence
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Central Bank","Rate %","Bal. Sheet $T","CPI","GDP%","Gold T","Forex $B","Next","Bias","Stance"].map(h => (
                <th key={h} className="px-3 py-2 text-left text-[9px] font-bold text-[var(--ag-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CENTRAL_BANK_DATA.map((cb, i) => (
              <tr key={cb.cb} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td className="px-3 py-2 font-bold text-white whitespace-nowrap">{cb.cb}</td>
                <td className="px-3 py-2" style={{ color: cb.rate > 10 ? "#ef4444" : cb.rate > 5 ? "#f97316" : "#34d399" }}>{cb.rate.toFixed(2)}</td>
                <td className="px-3 py-2">{cb.balSheet}</td>
                <td className="px-3 py-2" style={{ color: cb.inflation > 10 ? "#ef4444" : cb.inflation > 5 ? "#f97316" : "#94a3b8" }}>{cb.inflation}%</td>
                <td className="px-3 py-2" style={{ color: cb.gdpGrowth > 5 ? "#34d399" : cb.gdpGrowth > 2 ? "#38bdf8" : "#f97316" }}>{cb.gdpGrowth}%</td>
                <td className="px-3 py-2">{cb.goldRes.toLocaleString()}</td>
                <td className="px-3 py-2">{cb.forexRes}</td>
                <td className="px-3 py-2 text-[10px] whitespace-nowrap">{cb.nextDecision}</td>
                <td className="px-3 py-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: cb.bias === "CUT" ? "#22c55e25" : "#ef444425", color: cb.bias === "CUT" ? "#22c55e" : "#ef4444", border: `1px solid ${cb.bias === "CUT" ? "#22c55e40" : "#ef444440"}` }}>
                    {cb.bias}
                  </span>
                </td>
                <td className="px-3 py-2 text-[9px] text-[var(--ag-muted)] whitespace-nowrap">{cb.stance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupplyChainsPanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        🔗 Critical Supply Chain Chokepoints — Sovereign Risk Topology
      </div>
      {SUPPLY_CHAIN_NODES.map(s => (
        <div key={s.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${risk(s.riskScore > 75 ? "CRITICAL" : s.riskScore > 60 ? "HIGH" : "MODERATE")}30` }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{s.node}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "#38bdf820", color: "#38bdf8", border: "1px solid #38bdf840" }}>{s.category}</span>
              </div>
              <div className="flex gap-4 mb-2 text-[10px] text-[var(--ag-muted)]">
                <span>📦 {s.dailyThroughput}</span>
                <span>🌍 {s.chokePct}</span>
              </div>
              <div className="text-[11px] text-white/70 leading-snug mb-2">{s.threat}</div>
              <div className="flex flex-wrap gap-1">
                {s.assetImpact.map(a => (
                  <span key={a} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "#a78bfa", border: "1px solid #a78bfa30" }}>{a}</span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold font-mono" style={{ color: s.riskScore > 75 ? "#ef4444" : s.riskScore > 60 ? "#f97316" : "#eab308" }}>{s.riskScore}</div>
              <div className="text-[9px] text-[var(--ag-muted)]">Risk</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function C4ISRPanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        ⚔ C4ISR Defense Theater Intelligence — Sovereign Command Readiness
      </div>
      {C4ISR_THEATERS.map(t => (
        <div key={t.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${risk(t.risk)}30` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{t.theater}</span>
                <RiskBadge level={t.risk} />
              </div>
              <div className="text-[10px] font-bold" style={{ color: "#f97316" }}>Primary Threat: {t.threat}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Force Ratio", t.forceRatio],
              ["Red Lines", t.redLines],
              ["Nuclear Status", t.nuclearStatus],
              ["ISR / A2AD Coverage", t.ISRcoverage],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded p-2" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="text-[9px] font-bold text-[var(--ag-muted)] uppercase tracking-wider mb-1">{k}</div>
                <div className="text-[11px] text-white/80 leading-snug">{v}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CyberWarfarePanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="text-[10px] font-mono text-[var(--ag-muted)] uppercase tracking-widest mb-2">
        🕵 Cyber Warfare & SCADA Grid Intelligence — APT Threat Matrix
      </div>
      {CYBER_INCIDENTS.map(c => (
        <div key={c.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${risk(c.impact)}30` }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: "#f97316" }}>{c.actor}</span>
                <RiskBadge level={c.impact} />
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>{c.sector}</span>
              </div>
              <div className="text-[10px] font-bold text-white mb-1">TARGET: {c.target}</div>
              <div className="text-[11px] text-white/70 leading-snug mb-2">{c.technique}</div>
              <div className="flex items-center gap-3 text-[10px] text-[var(--ag-muted)]">
                <span>MITRE: <span className="font-mono text-violet-400">{c.ttps}</span></span>
                <span>Confidence: <span className="font-bold text-white">{c.confidence}%</span></span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[11px] rounded p-2 font-mono" style={{ background: "rgba(0,0,0,0.4)", color: "#34d399" }}>
            💰 Financial Impact: {c.financial}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const PILLARS: { id: Pillar; label: string; icon: string; color: string; shortLabel: string }[] = [
  { id: "demographics",  label: "Demographics & Health",            icon: "🌍", color: "#34d399", shortLabel: "Demo" },
  { id: "elections",     label: "Elections & Political Risk",       icon: "🗳",  color: "#60a5fa", shortLabel: "Elections" },
  { id: "biosurveillance", label: "Biosurveillance",               icon: "🧬", color: "#f472b6", shortLabel: "Bio" },
  { id: "centralbank",   label: "Central Bank Intelligence",       icon: "🏦", color: "#a78bfa", shortLabel: "CB" },
  { id: "supplychains",  label: "Supply Chain Chokepoints",        icon: "🔗", color: "#fb923c", shortLabel: "Supply" },
  { id: "c4isr",         label: "C4ISR Defense Theater",           icon: "⚔",  color: "#ef4444", shortLabel: "C4ISR" },
  { id: "cyberwarfare",  label: "Cyber Warfare & SCADA",           icon: "🕵",  color: "#c084fc", shortLabel: "Cyber" },
];

export default function InstitutionalSuitePanel() {
  const [activePillar, setActivePillar] = useState<Pillar>("demographics");
  const pillar = PILLARS.find(p => p.id === activePillar)!;

  function renderContent() {
    switch (activePillar) {
      case "demographics":   return <DemographicsPanel />;
      case "elections":      return <ElectionsPanel />;
      case "biosurveillance": return <BiosurveillancePanel />;
      case "centralbank":    return <CentralBankPanel />;
      case "supplychains":   return <SupplyChainsPanel />;
      case "c4isr":          return <C4ISRPanel />;
      case "cyberwarfare":   return <CyberWarfarePanel />;
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden text-white" style={{ background: "var(--ag-bg, #030810)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ background: "rgba(11,15,23,0.98)", borderColor: "var(--ag-border, rgba(255,255,255,0.08))" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-serif tracking-wide" style={{ color: "#a78bfa" }}>
              NUR INSTITUTIONAL SUITE — 7-PILLAR SOVEREIGN INTELLIGENCE
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>
              $8,500 / MONTH
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold animate-pulse" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
              SOVEREIGN TIER
            </span>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted, rgba(255,255,255,0.4))" }}>
            Armies · Central Banks · Sovereign Wealth Funds · Intelligence Services · Holding Companies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a78bfa" }} />
          <span className="text-[10px] font-mono" style={{ color: "rgba(167,139,250,0.7)" }}>CLASSIFIED ACCESS</span>
        </div>
      </div>

      {/* Pillar Navigation */}
      <div
        className="flex items-stretch border-b shrink-0 overflow-x-auto"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.4)" }}
      >
        {PILLARS.map((p) => {
          const active = p.id === activePillar;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold whitespace-nowrap transition-all border-b-2 flex-shrink-0"
              style={{
                color: active ? p.color : "rgba(255,255,255,0.4)",
                borderBottomColor: active ? p.color : "transparent",
                background: active ? `${p.color}12` : "transparent",
              }}
            >
              <span>{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
              <span className="sm:hidden">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Pillar subtitle bar */}
      <div className="px-5 py-2 shrink-0 flex items-center gap-2" style={{ background: `${pillar.color}08`, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-lg">{pillar.icon}</span>
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: pillar.color }}>{pillar.label}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-2 border-t shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.5)" }}
      >
        <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
          NUR INSTITUTIONAL SUITE · {new Date().toISOString().split("T")[0]} · SOVEREIGN CLASSIFICATION
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span>7 Intelligence Pillars</span>
          <span>·</span>
          <span>Real-Time Monitoring</span>
          <span>·</span>
          <span>$8,500/mo Sovereign Tier</span>
        </div>
      </div>
    </div>
  );
}
