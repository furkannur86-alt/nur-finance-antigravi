"use client";

import { useState } from "react";

interface ProfCard {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  color: string;
  tools: { name: string; desc: string; free: boolean }[];
  freeServiceDetail: string;
}

const PROFESSION_CARDS: ProfCard[] = [
  {
    id: "doctor",
    icon: "👩‍⚕️",
    title: "Doctors & Physicians",
    tagline: "Protect your wealth. Understand healthcare stocks & pharma investments.",
    color: "#34d399",
    freeServiceDetail: "Free: Medical malpractice insurance cost tracker + pharma pipeline news feed",
    tools: [
      { name: "Pharma Pipeline Tracker",    desc: "Phase I–III FDA/EMA drug approvals, biotech M&A",               free: true  },
      { name: "Medical Practice Valuation",  desc: "Clinic & practice P/E benchmarks, acquisition multiples",        free: false },
      { name: "Healthcare Stocks Screener",  desc: "XBI, IHI, hospital REITs, MedTech watchlist",                   free: true  },
      { name: "Malpractice Insurance Rates", desc: "Specialty risk cost trends — surgery, OB, EM",                   free: true  },
      { name: "Physician Wealth Planner",    desc: "Pension, tax-deferred accounts, real estate allocation model",   free: false },
    ],
  },
  {
    id: "teacher",
    icon: "👩‍🏫",
    title: "Teachers & Educators",
    tagline: "Build long-term wealth on a teaching salary. Smart investing starts here.",
    color: "#60a5fa",
    freeServiceDetail: "Free: EdTech stock watchlist + teacher pension fund comparison tool",
    tools: [
      { name: "EdTech Stock Watchlist",      desc: "Coursera, Duolingo, Chegg, 2U — sector coverage",                free: true  },
      { name: "Pension Fund Analyzer",       desc: "State teacher pension fund returns vs S&P500 benchmark",          free: true  },
      { name: "Dollar-Cost Averaging Calc",  desc: "Monthly DCA simulator for index funds on a teacher salary",       free: true  },
      { name: "Government Bond Ladder",      desc: "US Treasury, Bund, TÜFE-linked bond laddering tool",             free: false },
      { name: "Side Income Tax Optimizer",   desc: "Freelance, tutoring, online course income — tax efficiency",      free: false },
    ],
  },
  {
    id: "lawyer",
    icon: "⚖️",
    title: "Lawyers & Jurists",
    tagline: "Legal professionals need sophisticated private wealth management.",
    color: "#a78bfa",
    freeServiceDetail: "Free: Law firm M&A deal tracker + legal sector salary benchmarks",
    tools: [
      { name: "Law Firm M&A Deal Flow",      desc: "AmLaw 200 mergers, private equity law shop acquisitions",         free: true  },
      { name: "IP & Patent Royalty Tracker", desc: "Patent licensing revenue streams for IP attorneys",               free: false },
      { name: "Tax Shelter Strategies",      desc: "Corporate structure, offshore trust legal optimization",           free: false },
      { name: "Litigation Finance Index",    desc: "Legal finance market returns: Burford, Omni Bridgeway, IMF",       free: true  },
      { name: "Law Firm Profitability",      desc: "Revenue per partner benchmarks — BigLaw vs boutique",              free: true  },
    ],
  },
  {
    id: "construction",
    icon: "👷",
    title: "Construction & Engineering",
    tagline: "Track materials, commodity prices, and infrastructure investment cycles.",
    color: "#f97316",
    freeServiceDetail: "Free: Steel, copper, cement commodity price tracker + infrastructure ETF watchlist",
    tools: [
      { name: "Commodity Price Dashboard",   desc: "Steel, copper, aluminium, cement, rebar — LME + spot",           free: true  },
      { name: "Infrastructure ETF Screen",   desc: "PAVE, IFRA, TOLL — global infrastructure thematic",              free: true  },
      { name: "Project Finance ROI Calc",    desc: "Real estate development return modelling — IRR, NPV",            free: false },
      { name: "Materials Inflation Tracker", desc: "PPI construction sub-indices: lumber, concrete, glass",           free: true  },
      { name: "Contractor Supplier Credit",  desc: "Trade credit risk rating for construction supply chain",          free: false },
    ],
  },
  {
    id: "nurse",
    icon: "🩺",
    title: "Nurses & Healthcare Workers",
    tagline: "Your care for others shouldn't come at cost to your financial wellbeing.",
    color: "#f472b6",
    freeServiceDetail: "Free: Healthcare worker student loan optimizer + shift income tax guide",
    tools: [
      { name: "Student Loan Optimizer",      desc: "PSLF, income-driven plans — nursing school debt strategy",        free: true  },
      { name: "Night Shift Tax Strategy",    desc: "Shift differential, overtime, locum agency income tax tips",       free: true  },
      { name: "Nursing Home REIT Tracker",   desc: "Sabra, CareTrust, Omega REIT sector monitor",                     free: true  },
      { name: "Union Pension Comparison",    desc: "SEIU, NNU, state pension fund performance data",                  free: false },
      { name: "Travel Nurse Income Planner", desc: "Agency pay rates by state, housing stipend optimization",          free: false },
    ],
  },
  {
    id: "military",
    icon: "🎖️",
    title: "Military & Defense Personnel",
    tagline: "Thrift Savings Plan, defense contractor stocks, and veteran benefits.",
    color: "#64748b",
    freeServiceDetail: "Free: TSP allocation optimizer + defense contractor watchlist (LMT, RTX, NOC)",
    tools: [
      { name: "TSP Allocation Optimizer",    desc: "Blended Retirement System optimization — G/C/S/I/F funds",        free: true  },
      { name: "Defense Contractor Monitor",  desc: "Lockheed, Raytheon, Northrop, BAE, Rheinmetall — EPS, orders",   free: true  },
      { name: "VA Loan & Housing",           desc: "VA mortgage rates, COLA projections, military housing market",     free: true  },
      { name: "Veteran Business Finance",    desc: "SBA VetBiz, SBIR grants, startup financing for veterans",         free: false },
      { name: "Security Clearance Jobs",     desc: "Defense sector salary benchmarks by clearance level",             free: false },
    ],
  },
  {
    id: "farmer",
    icon: "🌾",
    title: "Farmers & Agribusiness",
    tagline: "Commodity futures, crop insurance, and agribusiness investment intelligence.",
    color: "#84cc16",
    freeServiceDetail: "Free: WASDE crop report alerts + CME grain futures dashboard",
    tools: [
      { name: "CME Grain Futures",           desc: "Corn, Wheat, Soybeans — CBOT continuous contract charts",         free: true  },
      { name: "WASDE Report Analyzer",       desc: "USDA World Ag Supply & Demand estimates — instant digest",        free: true  },
      { name: "Crop Insurance Optimizer",    desc: "ARC vs PLC, crop insurance premium vs indemnity analysis",        free: false },
      { name: "Farmland REIT Screen",        desc: "FPI, LAND — farmland appreciation vs S&P500",                    free: true  },
      { name: "Input Cost Tracker",          desc: "Nitrogen, potash, diesel, seed costs — monthly index",            free: true  },
    ],
  },
  {
    id: "tech",
    icon: "👨‍💻",
    title: "Tech & Software Professionals",
    tagline: "RSUs, stock options, ESPP — maximize your tech compensation package.",
    color: "#22d3ee",
    freeServiceDetail: "Free: RSU vesting calculator + FAANG compensation benchmarks",
    tools: [
      { name: "RSU / Stock Option Tracker",  desc: "Vesting schedule, tax impact, sell-vs-hold optimizer",            free: true  },
      { name: "ESPP Return Calculator",      desc: "Employee stock purchase plan ROI including lookback provision",    free: true  },
      { name: "FAANG Comp Benchmarks",       desc: "TC by level, location, YoE — Levels.fyi-style intelligence",      free: true  },
      { name: "Startup Equity Analyzer",     desc: "409A, option pool, dilution, exit scenario modeling",             free: false },
      { name: "AI/ML Sector Deep Dive",      desc: "NVDA, TSMC, ASML, Arm — semiconductor supply chain analysis",     free: false },
    ],
  },
  {
    id: "entrepreneur",
    icon: "🚀",
    title: "Entrepreneurs & Founders",
    tagline: "Funding rounds, exit strategies, M&A benchmarks, and cap table management.",
    color: "#f59e0b",
    freeServiceDetail: "Free: VC funding round tracker + startup valuation multiples database",
    tools: [
      { name: "VC Funding Round Tracker",    desc: "Series A–D deal flow, lead investor activity, sector heat",       free: true  },
      { name: "Startup Valuation Multiples", desc: "ARR multiples by sector, stage, geography — current market",      free: true  },
      { name: "Cap Table Simulator",         desc: "Dilution modeling across funding rounds and ESOP",                free: false },
      { name: "M&A Exit Modeler",            desc: "Trade sale vs IPO scenario — EBITDA multiples, earnout analysis", free: false },
      { name: "Pitch Deck Financials AI",    desc: "AI-generated financial projections for investor decks",           free: false },
    ],
  },
];

function ToolRow({ tool }: { tool: ProfCard["tools"][0] }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white">{tool.name}</span>
          {tool.free && (
            <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>FREE</span>
          )}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{tool.desc}</div>
      </div>
      <button className="ml-3 px-2.5 py-1 rounded text-[10px] font-bold shrink-0 transition-all" style={{ background: tool.free ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)", border: `1px solid ${tool.free ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, color: tool.free ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
        {tool.free ? "Open" : "↗ Upgrade"}
      </button>
    </div>
  );
}

export default function ProfessionHubPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const card = PROFESSION_CARDS.find(c => c.id === selected);

  const filtered = PROFESSION_CARDS.filter(c =>
    !search ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden text-white" style={{ background: "var(--ag-bg, #030810)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ background: "rgba(11,15,23,0.98)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <span className="text-xs font-bold font-serif tracking-wide" style={{ color: "#00d4aa" }}>NUR PROFESSION HUB — FINANCE FOR EVERY CAREER</span>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Tailored financial intelligence for your profession · Free tools for everyone who downloads</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
            {PROFESSION_CARDS.reduce((sum, c) => sum + c.tools.filter(t => t.free).length, 0)} FREE TOOLS
          </span>
          <span className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {PROFESSION_CARDS.length} Professions
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-white/30">🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search professions…"
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/20"
                />
              </div>
            </div>

            {/* Free download pitch */}
            <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.08), rgba(56,189,248,0.08))", border: "1px solid rgba(0,212,170,0.2)" }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⬇️</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: "#00d4aa" }}>Download Free — Access Your Profession&apos;s Tools</div>
                  <p className="text-[10px] mt-1 text-white/60 leading-relaxed">
                    Install NUR Finance on your laptop or desktop to access free tools tailored to your career.
                    When your computer is idle, your GPU/CPU contributes to NUR&apos;s network — you earn $NUR Coin rewards.
                    More powerful hardware = more earnings. Zero disruption to your work (non-aggressive mode default).
                  </p>
                  <button className="mt-2 px-4 py-1.5 rounded-lg text-[11px] font-bold" style={{ background: "#00d4aa", color: "#000" }}>
                    ⬇️ Download NUR Finance Desktop
                  </button>
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="text-left rounded-xl p-4 transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c.color}25` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-[11px] font-bold text-white leading-tight">{c.title}</span>
                  </div>
                  <p className="text-[10px] mb-3 leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>{c.tagline}</p>
                  <div className="text-[9px] px-2 py-1 rounded font-semibold" style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}>
                    {c.tools.filter(t => t.free).length} free tools · {c.tools.length} total
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : card && (
          <div className="p-4">
            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-[11px] mb-4 hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
              ← All Professions
            </button>

            {/* Card header */}
            <div className="rounded-xl p-5 mb-4" style={{ background: `${card.color}0a`, border: `1px solid ${card.color}30` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{card.icon}</span>
                <div>
                  <div className="text-lg font-bold text-white">{card.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{card.tagline}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] px-3 py-2 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>
                <span>🎁</span>
                <span>{card.freeServiceDetail}</span>
              </div>
            </div>

            {/* Compute download pitch */}
            <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)" }}>
              <div className="text-[10px] font-bold mb-1" style={{ color: "#00d4aa" }}>🖥 Earn $NUR While Your Computer Idles</div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Download the NUR Finance desktop app. When you&apos;re not using your computer, it contributes GPU/CPU compute to NUR&apos;s AI network.
                Your earnings in $NUR Coin scale with your hardware score. Withdraw to bank via KYC-verified account.
              </p>
            </div>

            {/* Tools */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Available Tools</div>
              {card.tools.map(t => <ToolRow key={t.name} tool={t} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
