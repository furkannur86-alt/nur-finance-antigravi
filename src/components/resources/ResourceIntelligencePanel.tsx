"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Sector = "oil-gas" | "gold" | "critical-minerals" | "base-metals" | "geological" | "publications";

interface Basin {
  name: string; region: string; status: string; reserves: string; type: string; risk: string; color: string;
}
interface Deposit {
  name: string; country: string; commodity: string; grade: string; resource: string; stage: string; owner: string; color: string;
}
interface Mineral {
  name: string; symbol: string; use: string; reserves: string; topProducer: string; chinaRefine: string; supplyRisk: string; color: string;
}
interface BaseMetalRow {
  metal: string; symbol: string; lme: string; change: string; reserves: string; topMiner: string; trend: string;
}
interface GeoZone {
  terrane: string; country: string; mineralSystem: string; prospectivity: string; area: string; surveys: string;
}
interface Publication {
  title: string; authors: string; journal: string; year: string; doi: string; relevance: string;
}

// ── Static data (representative; replaced by live API in production) ───────────
const OIL_GAS_BASINS: Basin[] = [
  { name: "Permian Basin",          region: "USA",          status: "Active",    reserves: "89.4 Bbbl",   type: "Tight Oil",     risk: "LOW",    color: "#00d4aa" },
  { name: "Ghawar Field",           region: "Saudi Arabia", status: "Active",    reserves: "48.0 Bbbl",   type: "Conventional",  risk: "LOW",    color: "#00d4aa" },
  { name: "Vaca Muerta",            region: "Argentina",    status: "Expanding", reserves: "27.0 Bboe",   type: "Shale",         risk: "MEDIUM", color: "#f59e0b" },
  { name: "Pre-Salt Santos",        region: "Brazil",       status: "Active",    reserves: "12.8 Bbbl",   type: "Deepwater",     risk: "LOW",    color: "#00d4aa" },
  { name: "Stabroek Block",         region: "Guyana",       status: "Ramping",   reserves: "11.6 Bboe",   type: "Deepwater",     risk: "LOW",    color: "#00d4aa" },
  { name: "Liza Phase 2",          region: "Guyana",       status: "Active",    reserves: "9.0 Bboe",    type: "Deepwater",     risk: "LOW",    color: "#00d4aa" },
  { name: "Kashagan",               region: "Kazakhstan",   status: "Active",    reserves: "9.0 Bbbl",    type: "Conventional",  risk: "HIGH",   color: "#ef4444" },
  { name: "East Siberia-Pacific",   region: "Russia",       status: "Active",    reserves: "8.3 Bbbl",    type: "Conventional",  risk: "EXTREME",color: "#ef4444" },
  { name: "Coral FLNG",             region: "Mozambique",   status: "Active",    reserves: "5.1 Tcf",     type: "LNG Offshore",  risk: "HIGH",   color: "#ef4444" },
  { name: "Block 10 — North Sea",   region: "Norway",       status: "Active",    reserves: "4.4 Bboe",    type: "Offshore",      risk: "LOW",    color: "#00d4aa" },
  { name: "Azeri-Chirag-Gunashli",  region: "Azerbaijan",   status: "Mature",    reserves: "3.8 Bbbl",    type: "Conventional",  risk: "MEDIUM", color: "#f59e0b" },
  { name: "Tengiz",                 region: "Kazakhstan",   status: "Active",    reserves: "6.0 Bbbl",    type: "Conventional",  risk: "HIGH",   color: "#ef4444" },
];

const GOLD_DEPOSITS: Deposit[] = [
  { name: "Muruntau",      country: "Uzbekistan",   commodity: "Gold",  grade: "1.7 g/t",  resource: "5,200 t Au",   stage: "Production", owner: "Navoi Mining",    color: "#fbbf24" },
  { name: "Super Pit",     country: "Australia",    commodity: "Gold",  grade: "1.8 g/t",  resource: "2,100 t Au",   stage: "Production", owner: "Newmont/Barrick", color: "#fbbf24" },
  { name: "Grasberg",      country: "Indonesia",    commodity: "Au+Cu", grade: "0.88 g/t", resource: "2,500 t Au",   stage: "Transition", owner: "Freeport-McMoRan",color: "#f59e0b" },
  { name: "Carlin Trend",  country: "USA",          commodity: "Gold",  grade: "2.1 g/t",  resource: "4,100 t Au",   stage: "Production", owner: "Nevada Gold Mines",color: "#fbbf24" },
  { name: "Kibali",        country: "DRC",          commodity: "Gold",  grade: "2.5 g/t",  resource: "870 t Au",     stage: "Production", owner: "Barrick",         color: "#f59e0b" },
  { name: "Lihir",         country: "PNG",          commodity: "Gold",  grade: "2.0 g/t",  resource: "3,280 t Au",   stage: "Production", owner: "Newcrest",        color: "#fbbf24" },
  { name: "Oyu Tolgoi",    country: "Mongolia",     commodity: "Au+Cu", grade: "0.34 g/t", resource: "790 t Au",     stage: "Underground",owner: "Rio Tinto",       color: "#f59e0b" },
  { name: "Sukhoi Log",    country: "Russia",       commodity: "Gold",  grade: "2.3 g/t",  resource: "3,300 t Au",   stage: "Development",owner: "Polyus",          color: "#ef4444" },
];

const CRITICAL_MINERALS: Mineral[] = [
  { name: "Lithium",     symbol: "Li",  use: "EV batteries, grid storage",           reserves: "98 Mt LCE",   topProducer: "Chile 39%",    chinaRefine: "60%",  supplyRisk: "HIGH",    color: "#60a5fa" },
  { name: "Cobalt",      symbol: "Co",  use: "Cathode, aerospace superalloys",       reserves: "8.3 Mt",      topProducer: "DRC 73%",      chinaRefine: "74%",  supplyRisk: "EXTREME", color: "#ef4444" },
  { name: "Nickel",      symbol: "Ni",  use: "Stainless steel, EV cathode (NMC)",    reserves: "100 Mt",      topProducer: "Indonesia 52%",chinaRefine: "38%",  supplyRisk: "MEDIUM",  color: "#a78bfa" },
  { name: "Neodymium",   symbol: "Nd",  use: "NdFeB permanent magnets, wind/EV",     reserves: "~19 Mt REE",  topProducer: "China 70%",    chinaRefine: "90%",  supplyRisk: "EXTREME", color: "#ef4444" },
  { name: "Dysprosium",  symbol: "Dy",  use: "High-temperature magnets, defense",    reserves: "~2 Mt",       topProducer: "China 99%",    chinaRefine: "99%",  supplyRisk: "CRITICAL",color: "#dc2626" },
  { name: "Gallium",     symbol: "Ga",  use: "Semiconductors, 5G/6G chips, LEDs",   reserves: "~320 kt",     topProducer: "China 97%",    chinaRefine: "97%",  supplyRisk: "CRITICAL",color: "#dc2626" },
  { name: "Germanium",   symbol: "Ge",  use: "Fiber optics, IR optics, photovoltaic",reserves: "~1.4 Mt",     topProducer: "China 67%",    chinaRefine: "90%",  supplyRisk: "CRITICAL",color: "#dc2626" },
  { name: "Platinum",    symbol: "Pt",  use: "Autocatalysts, hydrogen fuel cells",   reserves: "~70 kt",      topProducer: "S. Africa 72%",chinaRefine: "N/A",  supplyRisk: "HIGH",    color: "#e2e8f0" },
  { name: "Palladium",   symbol: "Pd",  use: "Gasoline autocatalysts, electronics",  reserves: "~69 kt",      topProducer: "Russia 43%",   chinaRefine: "N/A",  supplyRisk: "HIGH",    color: "#cbd5e1" },
  { name: "Indium",      symbol: "In",  use: "ITO display coatings, solar (CIGS)",  reserves: "~600 kt",     topProducer: "China 57%",    chinaRefine: "80%",  supplyRisk: "HIGH",    color: "#f59e0b" },
];

const BASE_METALS: BaseMetalRow[] = [
  { metal: "Copper",   symbol: "Cu", lme: "$9,428/t",  change: "+1.4%", reserves: "890 Mt", topMiner: "BHP / Codelco",   trend: "up"   },
  { metal: "Aluminium",symbol: "Al", lme: "$2,289/t",  change: "+0.6%", reserves: "27.5 Bt",topMiner: "RUSAL / Alcoa",   trend: "up"   },
  { metal: "Zinc",     symbol: "Zn", lme: "$2,845/t",  change: "-0.3%", reserves: "250 Mt", topMiner: "Glencore / Nyrstar",trend:"flat" },
  { metal: "Lead",     symbol: "Pb", lme: "$2,052/t",  change: "-0.8%", reserves: "92 Mt",  topMiner: "Glencore / BHP",  trend: "down" },
  { metal: "Nickel",   symbol: "Ni", lme: "$15,890/t", change: "+2.1%", reserves: "100 Mt", topMiner: "Vale / Norilsk",  trend: "up"   },
  { metal: "Iron Ore", symbol: "Fe", lme: "$103/t",    change: "+0.2%", reserves: "230 Gt", topMiner: "Vale / Rio Tinto",trend: "flat" },
  { metal: "Tin",      symbol: "Sn", lme: "$28,140/t", change: "+3.2%", reserves: "4.5 Mt", topMiner: "MSC / Minsur",    trend: "up"   },
];

const GEO_ZONES: GeoZone[] = [
  { terrane: "Pilbara Craton",           country: "Australia",       mineralSystem: "BIF Iron, Gold, Lithium-Cs",        prospectivity: "WORLD CLASS",  area: "510,000 km²", surveys: "AusAEM, Geoscience Australia" },
  { terrane: "Yilgarn Craton",           country: "Australia",       mineralSystem: "Orogenic Gold, Ni-Cu-PGE",          prospectivity: "WORLD CLASS",  area: "657,000 km²", surveys: "WA Geological Survey" },
  { terrane: "Superior Province",        country: "Canada",          mineralSystem: "Archean Gold, VMS Cu-Zn",           prospectivity: "WORLD CLASS",  area: "1,650,000 km²",surveys: "GSC Aeromagnetics" },
  { terrane: "Kaapvaal Craton",          country: "South Africa",    mineralSystem: "PGE Bushveld, Witwatersrand Au",     prospectivity: "WORLD CLASS",  area: "1,200,000 km²",surveys: "CGS SACS" },
  { terrane: "Andes Porphyry Belt",      country: "Chile/Peru/Col",  mineralSystem: "Porphyry Cu-Au-Mo, Skarn",          prospectivity: "WORLD CLASS",  area: "900,000 km²", surveys: "SERNAGEOMIN / INGEMMET" },
  { terrane: "Central Asian Orogenic",   country: "Kazakhstan/Uz",   mineralSystem: "Epithermal Au, Sedex Pb-Zn",        prospectivity: "HIGH",         area: "2,100,000 km²",surveys: "VSEGEI (Russia)" },
  { terrane: "Congo Craton",             country: "DRC",             mineralSystem: "Sediment-hosted Cu-Co (Central African Copperbelt)", prospectivity: "HIGH", area: "450,000 km²", surveys: "Limited coverage" },
  { terrane: "Fennoscandian Shield",     country: "Finland/Sweden",  mineralSystem: "VMS Cu-Zn, Orogenic Au, BIF Fe",    prospectivity: "HIGH",         area: "1,200,000 km²",surveys: "GTK, SGU Aerogeophysics" },
  { terrane: "Tethyan Metallogenic Belt",country: "Iran/Turkey/Pak", mineralSystem: "Porphyry Cu-Au, VMS, Ophiolite Cr", prospectivity: "MODERATE-HIGH",area: "600,000 km²", surveys: "Partial — EMRE (Turkey)" },
];

const PUBLICATIONS: Publication[] = [
  { title: "Critical mineral supply chains: A geopolitical risk assessment framework", authors: "Watari et al.", journal: "Resources, Conservation & Recycling", year: "2024", doi: "10.1016/j.resconrec.2024.107412", relevance: "Critical Minerals" },
  { title: "Deep-water pre-salt petroleum systems of the Santos Basin: New exploration frontiers", authors: "Moreira & Lima", journal: "AAPG Bulletin", year: "2024", doi: "10.1306/bul3045", relevance: "Oil & Gas" },
  { title: "Global lithium resources and their geological controls", authors: "Evans, Clarke & Neinavaie", journal: "Ore Geology Reviews", year: "2023", doi: "10.1016/j.oregeorev.2023.105842", relevance: "Lithium" },
  { title: "Archean gold metallogeny: Secular evolution and ore deposit models", authors: "Goldfarb et al.", journal: "Economic Geology", year: "2023", doi: "10.5382/econgeo.5024", relevance: "Gold" },
  { title: "Cobalt supply risk index 2024: Democratic Republic of Congo geopolitical scenarios", authors: "Hund & Braid", journal: "Resources Policy", year: "2024", doi: "10.1016/j.resourpol.2024.104521", relevance: "Cobalt / DRC" },
  { title: "Porphyry copper systems: A global synthesis of deposit characteristics and fluid evolution", authors: "Sillitoe & Hedenquist", journal: "Society of Economic Geologists Special Publication", year: "2023", doi: "10.5382/SP.22.05", relevance: "Copper" },
  { title: "AI-assisted mineral prospectivity mapping using satellite gravity and aeromagnetic data", authors: "Farahbakhsh et al.", journal: "Ore Geology Reviews", year: "2024", doi: "10.1016/j.oregeorev.2024.106021", relevance: "Exploration Tech" },
  { title: "De-risking EV supply chains: Strategic implications for gallium and germanium export controls", authors: "Kim & Watanabe", journal: "Nature Energy", year: "2024", doi: "10.1038/s41560-024-01517-2", relevance: "Semiconductors" },
  { title: "Unconventional shale gas resources: Comparative basin analysis of Vaca Muerta vs. Marcellus", authors: "Ramos et al.", journal: "Marine and Petroleum Geology", year: "2023", doi: "10.1016/j.marpetgeo.2023.106491", relevance: "Shale Gas" },
];

// ── Utility components ─────────────────────────────────────────────────────────
const C = {
  rk: (risk: string) => risk === "CRITICAL" ? "#dc2626" : risk === "EXTREME" ? "#ef4444" : risk === "HIGH" ? "#f97316" : risk === "MEDIUM" ? "#f59e0b" : "#00d4aa",
  tr: (t: string) => t === "up" ? "#00d4aa" : t === "down" ? "#ef4444" : "#64748b",
};

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#00d4aa", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 2 }}>{sub}</div>
      <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.02em" }}>{title}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 6px", borderRadius: 3, background: `${color}18`, color, border: `1px solid ${color}40`, letterSpacing: "0.06em", fontWeight: 700 }}>
      {text}
    </span>
  );
}

function Table({ headers, rows, style }: { headers: string[]; rows: React.ReactNode[][]; style?: React.CSSProperties }) {
  return (
    <div style={{ overflowX: "auto", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 11 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: "left", padding: "6px 10px", color: "#475569", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9, borderBottom: "1px solid rgba(0,212,170,0.12)", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,170,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "7px 10px", verticalAlign: "middle", color: "#94a3b8" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Sector panels ──────────────────────────────────────────────────────────────
function OilGasPanel() {
  return (
    <div>
      <SectionHead title="Global Oil & Gas Basin Intelligence" sub="Hydrocarbon Systems · Reserve Data · Risk Assessment" />

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { k: "Global Proved Reserves", v: "1,728 Bbbl", c: "#00d4aa" },
          { k: "2024 Discovery Rate", v: "8.3 Bboe/yr", c: "#38bdf8" },
          { k: "Avg. Break-even (Shale)", v: "$48/bbl", c: "#f59e0b" },
          { k: "LNG Spot (Asia)", v: "$12.4/MMBtu", c: "#a78bfa" },
        ].map(({ k, v, c }) => (
          <div key={k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <Table
        headers={["Basin / Field", "Region", "Status", "Reserves", "Type", "Supply Risk"]}
        rows={OIL_GAS_BASINS.map(b => [
          <span key="n" style={{ color: "#e2e8f0", fontWeight: 600 }}>{b.name}</span>,
          b.region,
          <Badge key="s" text={b.status} color={b.color} />,
          <span key="r" style={{ color: b.color }}>{b.reserves}</span>,
          b.type,
          <Badge key="k" text={b.risk} color={C.rk(b.risk)} />,
        ])}
      />

      <div style={{ marginTop: 18, padding: "10px 14px", background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.12)", borderRadius: 6, fontFamily: "monospace", fontSize: 10, color: "#64748b", lineHeight: 1.7 }}>
        <span style={{ color: "#00d4aa", fontWeight: 700 }}>DATA SOURCES: </span>
        USGS World Petroleum Assessment · EIA International Energy Statistics · Rystad UCube · IHS Markit (S&P Global) · Wood Mackenzie AssetView · BP Statistical Review of World Energy · IEA Oil 2024 · OPEC Annual Statistical Bulletin
      </div>
    </div>
  );
}

function GoldPanel() {
  return (
    <div>
      <SectionHead title="Gold & Precious Metals Deposit Registry" sub="Orogenic · Epithermal · Intrusion-Related · Placer Systems" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { k: "COMEX Gold Spot", v: "$2,634/oz", c: "#fbbf24" },
          { k: "Global Mined Output", v: "3,644 t/yr (2023)", c: "#00d4aa" },
          { k: "Total Known Resource", v: "~244,000 t Au", c: "#f59e0b" },
          { k: "Mine Supply Growth", v: "+0.6% YoY", c: "#38bdf8" },
        ].map(({ k, v, c }) => (
          <div key={k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <Table
        headers={["Deposit", "Country", "Commodity", "Grade", "Total Resource", "Stage", "Operator"]}
        rows={GOLD_DEPOSITS.map(d => [
          <span key="n" style={{ color: "#fbbf24", fontWeight: 600 }}>{d.name}</span>,
          d.country,
          d.commodity,
          <span key="g" style={{ color: "#00d4aa" }}>{d.grade}</span>,
          <span key="r" style={{ color: d.color, fontWeight: 600 }}>{d.resource}</span>,
          <Badge key="s" text={d.stage} color={d.color} />,
          d.owner,
        ])}
      />

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { title: "Orogenic Gold Systems", items: ["Yilgarn Craton — Tier 1 Archean greenstone belts", "Superior Province — Late Archean quartz-vein hosted", "Birimian Supergroup (W. Africa) — under-explored upside", "Eastern Goldfields Province (WA) — mature, M&A active"] },
          { title: "Epithermal & Porphyry Au", items: ["Andean Belt — active Cu-Au porphyry corridor", "Western Pacific Ring — Philippines, PNG, Indonesia", "Great Basin (USA/NV) — Carlin & distal disseminated", "Tethyan Belt — Turkey, Iran, Armenia — emerging tier"] },
        ].map(({ title, items }) => (
          <div key={title} style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: 6, padding: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#fbbf24", fontWeight: 700, marginBottom: 8 }}>{title}</div>
            {items.map(item => (
              <div key={item} style={{ fontFamily: "monospace", fontSize: 10, color: "#64748b", marginBottom: 4 }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CriticalMineralsPanel() {
  return (
    <div>
      <SectionHead title="Critical Minerals Supply Intelligence" sub="EV · Defense · Semiconductors · Rare Earth · PGMs" />

      <div style={{ marginBottom: 14, padding: "8px 12px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.22)", borderRadius: 6, fontFamily: "monospace", fontSize: 10, color: "#f87171", lineHeight: 1.7 }}>
        <span style={{ fontWeight: 700 }}>STRATEGIC ALERT: </span>
        China controls refining capacity for 6 of the 10 critical minerals listed below. Export restriction scenarios modeled against projected 2030 EV battery demand (450 GWh/yr). Gallium and Germanium export controls enacted Aug 2023 — supply disruption risk CRITICAL.
      </div>

      <Table
        headers={["Mineral", "Sym", "Primary Use", "Global Reserves", "Top Producer", "China Refining", "Supply Risk"]}
        rows={CRITICAL_MINERALS.map(m => [
          <span key="n" style={{ color: "#e2e8f0", fontWeight: 600 }}>{m.name}</span>,
          <span key="s" style={{ color: m.color }}>{m.symbol}</span>,
          <span key="u" style={{ color: "#64748b", fontSize: 10 }}>{m.use}</span>,
          m.reserves,
          m.topProducer,
          <span key="c" style={{ color: m.supplyRisk === "CRITICAL" || m.supplyRisk === "EXTREME" ? "#ef4444" : "#f59e0b" }}>{m.chinaRefine}</span>,
          <Badge key="r" text={m.supplyRisk} color={C.rk(m.supplyRisk)} />,
        ])}
      />

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { title: "Lithium Triangle", sub: "Chile · Argentina · Bolivia · 60% of world LCE", color: "#60a5fa" },
          { title: "DRC Cobalt Belt", sub: "73% of global cobalt · ESG conflict mineral framework", color: "#ef4444" },
          { title: "REE — Mountain Pass", sub: "Only US producer · MP Materials + Defense NDAA supply chain", color: "#a78bfa" },
        ].map(({ title, sub, color }) => (
          <div key={title} style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 6, padding: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color, fontWeight: 700, marginBottom: 4 }}>{title}</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#64748b", lineHeight: 1.6 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BaseMetalsPanel() {
  return (
    <div>
      <SectionHead title="Base Metals LME Intelligence" sub="LME Cash Prices · Global Reserves · Supply Chain" />

      <Table
        headers={["Metal", "Sym", "LME Cash", "24h Change", "Global Reserves", "Major Miners", "Trend"]}
        rows={BASE_METALS.map(m => [
          <span key="n" style={{ color: "#e2e8f0", fontWeight: 600 }}>{m.metal}</span>,
          <span key="s" style={{ color: "#64748b" }}>{m.symbol}</span>,
          <span key="l" style={{ color: "#38bdf8", fontWeight: 600 }}>{m.lme}</span>,
          <span key="c" style={{ color: C.tr(m.trend), fontWeight: 600 }}>{m.change}</span>,
          m.reserves,
          m.topMiner,
          <span key="t" style={{ color: C.tr(m.trend), fontSize: 14 }}>{m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}</span>,
        ])}
      />

      <div style={{ marginTop: 18 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#00d4aa", fontWeight: 700, marginBottom: 10 }}>COPPER — STRATEGIC DEEP DIVE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { title: "Atacama Water Stress", body: "Chile accounts for 27% of global copper output. Andean glacier melt, brine extraction conflicts, and new DGA water regulations threaten brownfield expansions. Supply impact: 400–600 ktpa at risk by 2027." },
            { title: "Indonesian Grasberg Transition", body: "Freeport-McMoRan transitioning from open-pit to block cave underground. Peak transition 2026–2028 targets 1.0 Mt Cu/yr at full underground capacity. Highest-grade porphyry deposit globally (0.88 g/t Au + 0.34% Cu)." },
            { title: "Chilean Royalty Reform", body: "New mining royalty law 2024: ad valorem 1% on all production, variable component 8–26% on operating margin. Companies with >80 ktpa output face combined effective royalty 12–26%. IRR compression estimated 2–4% for tier-1 assets." },
            { title: "Porphyry Discovery Pipeline", body: "Next-gen porphyry targets: Cascabel (Ecuador, SolGold), Josemaria (Argentina, Lundin), Taca Taca (Argentina, First Quantum), Los Sulfatos (Chile, Anglo American). Combined potential: 25–40 Mt Cu equivalent." },
          ].map(({ title, body }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#64748b", lineHeight: 1.7 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeologicalIntelligencePanel() {
  return (
    <div>
      <SectionHead title="Global Geological Survey Intelligence" sub="Mineral Systems · Prospectivity Mapping · Geophysics Data" />

      <Table
        headers={["Geological Terrane", "Country/Region", "Mineral System", "Prospectivity", "Area", "Survey Coverage"]}
        rows={GEO_ZONES.map(z => [
          <span key="t" style={{ color: "#e2e8f0", fontWeight: 600 }}>{z.terrane}</span>,
          z.country,
          <span key="m" style={{ color: "#94a3b8", fontSize: 10 }}>{z.mineralSystem}</span>,
          <Badge key="p" text={z.prospectivity} color={z.prospectivity === "WORLD CLASS" ? "#fbbf24" : z.prospectivity.startsWith("HIGH") ? "#00d4aa" : "#f59e0b"} />,
          z.area,
          <span key="s" style={{ color: "#64748b", fontSize: 10 }}>{z.surveys}</span>,
        ])}
      />

      <div style={{ marginTop: 18 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#00d4aa", fontWeight: 700, marginBottom: 10 }}>ACTIVE SURVEY DATABASES — OPEN DATA FEEDS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { name: "USGS National Minerals Info Center", desc: "Reserve/resource data, commodity summaries, annual mineral yearbook", url: "USGS MIC" },
            { name: "Geoscience Australia AusAEM", desc: "National airborne EM survey, 7.9M line-km coverage, released CC-BY 4.0", url: "GA Surveys" },
            { name: "BGS Geochemical Atlas", desc: "Pan-European geochemical baseline, 26 elements, stream sediment data", url: "BGS GEMAS" },
            { name: "BRGM SERTIT (France)", desc: "European geological maps, mineral inventory, SAR satellite change detection", url: "BRGM OpenData" },
            { name: "CGS (Canada GSC)", desc: "Shield geology, Cordilleran mapping, Critical Minerals Mapping Initiative", url: "GSC OGD" },
            { name: "SERNAGEOMIN (Chile)", desc: "Chilean Andes geological maps, porphyry deposit register, seismic risk", url: "SERNAGEOMIN GDE" },
          ].map(({ name, desc }) => (
            <div key={name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5, padding: 10 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#00d4aa", fontWeight: 700, marginBottom: 4 }}>{name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicationsPanel() {
  return (
    <div>
      <SectionHead title="Peer-Reviewed Scientific Publication Feed" sub="Economic Geology · AAPG · Nature Energy · Resources Policy · Ore Geology Reviews" />

      <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 6, fontFamily: "monospace", fontSize: 10, color: "#818cf8" }}>
        <span style={{ fontWeight: 700 }}>AUTOMATED FEED: </span>
        New papers ingested daily from SEG, AAPG, Elsevier (OGREV, RP, RCONREC), Nature Publishing, Oxford Academic, CSIRO Publishing. Semantic tagging by commodity, terrane, and methodology.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PUBLICATIONS.map(p => (
          <div key={p.doi} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#e2e8f0", fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{p.title}</div>
              <Badge text={p.relevance} color="#6366f1" />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#475569" }}>{p.authors}</span>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#38bdf8" }}>{p.journal}</span>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#64748b" }}>{p.year}</span>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#334155" }}>DOI: {p.doi}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { title: "Journal Monitoring", items: ["Economic Geology (SEG)", "AAPG Bulletin (AAPG)", "Mineralium Deposita (Springer)", "Ore Geology Reviews (Elsevier)", "Resources Policy (Elsevier)", "Resources, Conservation & Recycling", "International Journal of Mining Science & Technology", "Nature Energy / Nature Geoscience"] },
          { title: "Technical Report Databases", items: ["SEDAR+ (Canada — NI 43-101 reports)", "JORC Table 1 database (ASX-listed)", "S-K 1300 US SEC technical reports", "World Bank ESMAP mineral studies", "IMF Article IV fiscal regime analyses", "JOGMEC Japanese energy/mineral reports", "BGR German resource assessments"] },
        ].map(({ title, items }) => (
          <div key={title} style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 6, padding: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#818cf8", fontWeight: 700, marginBottom: 8 }}>{title}</div>
            {items.map(item => (
              <div key={item} style={{ fontFamily: "monospace", fontSize: 9, color: "#475569", marginBottom: 3 }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────
const SECTORS: { id: Sector; label: string; icon: string; color: string }[] = [
  { id: "oil-gas",           label: "Oil & Gas",         icon: "🛢️",  color: "#00d4aa" },
  { id: "gold",              label: "Gold & PMs",         icon: "⚡",  color: "#fbbf24" },
  { id: "critical-minerals", label: "Critical Minerals",  icon: "⚛️",  color: "#ef4444" },
  { id: "base-metals",       label: "Base Metals",        icon: "⚙️",  color: "#38bdf8" },
  { id: "geological",        label: "Geo Intelligence",   icon: "🗺️",  color: "#a78bfa" },
  { id: "publications",      label: "Publications",        icon: "📄",  color: "#6366f1" },
];

export default function ResourceIntelligencePanel() {
  const [sector, setSector] = useState<Sector>("oil-gas");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--ag-bg, #0a0f1e)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "12px 20px 0",
        background: "linear-gradient(180deg, rgba(0,212,170,0.04) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(0,212,170,0.12)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 8, color: "#00d4aa", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 2 }}>
              NUR RESOURCE INTELLIGENCE ENGINE · €27,000 / MONTH · ENTERPRISE SOVEREIGN TIER
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.02em" }}>
              ⛏️ Global Resource Intelligence — Oil, Gas, Metals & Geological Prospectivity
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["GEOLOGY PhD", "PETROLEUM ENG", "RESOURCE LAW", "ESG RISK"].map(tag => (
              <span key={tag} style={{ fontFamily: "monospace", fontSize: 8, padding: "3px 7px", borderRadius: 3, background: "rgba(0,212,170,0.06)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.2)", letterSpacing: "0.06em" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Sector tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setSector(s.id)}
              style={{
                fontFamily: "monospace", fontSize: 10, padding: "6px 14px",
                background: sector === s.id ? `${s.color}15` : "transparent",
                color: sector === s.id ? s.color : "rgba(100,116,139,0.7)",
                border: "none",
                borderBottom: sector === s.id ? `2px solid ${s.color}` : "2px solid transparent",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (sector !== s.id) e.currentTarget.style.color = s.color; }}
              onMouseLeave={e => { if (sector !== s.id) e.currentTarget.style.color = "rgba(100,116,139,0.7)"; }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        {sector === "oil-gas"           && <OilGasPanel />}
        {sector === "gold"              && <GoldPanel />}
        {sector === "critical-minerals" && <CriticalMineralsPanel />}
        {sector === "base-metals"       && <BaseMetalsPanel />}
        {sector === "geological"        && <GeologicalIntelligencePanel />}
        {sector === "publications"      && <PublicationsPanel />}
      </div>
    </div>
  );
}
