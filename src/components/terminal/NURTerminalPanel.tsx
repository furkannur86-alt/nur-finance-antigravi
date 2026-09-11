"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import type { PanelView } from "@/types";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

interface NewsItem {
  id: string;
  tag: string;
  tagColor: string;
  text: string;
  time: string;
}

interface Commentary {
  id: string;
  time: string;
  text: string;
}

const TICKERS: TickerItem[] = [
  { symbol: "SX5E", price: "5,234.50", change: "+0.11%", positive: true },
  { symbol: "DAX", price: "18,542", change: "-0.18%", positive: false },
  { symbol: "CAC", price: "7,845", change: "-0.16%", positive: false },
  { symbol: "FTSE", price: "8,321", change: "-0.13%", positive: false },
  { symbol: "EUR/USD", price: "1.0842", change: "-0.15%", positive: false },
  { symbol: "USD/JPY", price: "154.32", change: "+0.03%", positive: true },
  { symbol: "BTC", price: "$67,420", change: "+1.24%", positive: true },
  { symbol: "ETH", price: "$3,520", change: "-0.16%", positive: false },
  { symbol: "GOLD", price: "$2,341", change: "+0.14%", positive: true },
  { symbol: "OIL", price: "$78.90", change: "-0.12%", positive: false },
  { symbol: "VIX", price: "14.2", change: "-0.13%", positive: false },
  { symbol: "US10Y", price: "4.18%", change: "+0.04%", positive: true },
  { symbol: "URA", price: "$32.14", change: "+2.87%", positive: true },
  { symbol: "CCJ", price: "$54.20", change: "+3.12%", positive: true },
  { symbol: "XAU/USD", price: "$2,418", change: "+0.92%", positive: true },
  { symbol: "GPR-IDX", price: "187.4", change: "+14.2", positive: false },
  { symbol: "BRENT", price: "$84.50", change: "+1.43%", positive: true },
];

const NEWS_TAGS = [
  { tag: "EQUITY", color: "#00d4aa" },
  { tag: "COMMOD", color: "#ef4444" },
  { tag: "RATES", color: "#6366f1" },
  { tag: "TECH", color: "#a855f7" },
  { tag: "CRYPTO", color: "#f59e0b" },
  { tag: "FX", color: "#22d3ee" },
  { tag: "FED", color: "#64748b" },
  { tag: "ECB", color: "#64748b" },
  { tag: "MACRO", color: "#6366f1" },
  { tag: "GEOPOL", color: "#ef4444" },
  { tag: "CREDIT", color: "#a855f7" },
  { tag: "NUCLEAR", color: "#facc15" },
  { tag: "SATIMG", color: "#38bdf8" },
  { tag: "ENERGY", color: "#fb923c" },
];

const NEWS_HEADLINES = [
  "European banks lead Stoxx 600 higher on net interest margin optimism",
  "Copper rises on China stimulus hopes; LME inventory drops 4%",
  "10Y Bund yield falls 6bps on flight-to-safety flows",
  "Semiconductor equipment orders up 18% YoY — ASML beats on book-to-bill",
  "Bitcoin ETF sees $890M weekly inflow — largest since launch",
  "Dollar index slides to 3-week low; EUR/USD breaks 1.10",
  "Fed Chair signals patience on rate cuts amid labor market strength",
  "Energy corridor risk premium widens; Brent tests $85/bbl",
  "Eurozone PMI expands to 52.1, beating consensus of 51.2",
  "ECB holds rates steady; President cites data-dependent approach",
  "IG CDS indices tighten as recession odds fall below 35%",
  "Gold hits new high as central bank buying accelerates",
  "Japan core CPI rises 2.8%, reinforcing BOJ tightening path",
  "S&P 500 earnings growth at 11.2% — strongest in 6 quarters",
  // Nuclear & geopolitical headlines
  "IAEA satellite imagery confirms new centrifuge hall at Natanz — 60% enrichment capacity up 40%",
  "Yongbyon reactor thermal signature elevated; CSIS estimates 8kg plutonium production per year",
  "Uranium spot price surges to $98/lb on Kazakh supply disruption fears — CCJ +9%",
  "Israel conducts electronic warfare drills simulating multi-front nuclear scenario — XAU/USD +1.2%",
  "Kahuta facility intercept: Pakistan tests MIRVed Ababeel MRBM — India defence stocks surge",
  "Bushehr NPP power output anomaly detected via Esri satellite imagery — Brent +$3.20",
  "US STRATCOM raises DEFCON preparedness following DPRK ICBM launch over Sea of Japan",
  "Russia deploys three Borei-class nuclear submarines to Atlantic amid NATO exercises — Gold +0.8%",
  "IAEA Board votes on Iran safeguards breach; USD/IRR volatility spikes 18%",
  "China tests DF-41 ICBM MIRVed warhead delivery — Taiwan Strait risk premium widening",
  "Global nuclear proliferation index at 38-year high; URA ETF sees record $420M weekly inflow",
  "Satellite imagery: North Korea Yongbyon reprocessing plant steam plume confirms active operation",
  "France test-fires ASMP-A air-launched nuclear cruise missile; CAC40 defence stocks +4%",
  "India-Pakistan Line of Control — artillery exchange triggers nuclear crisis watch protocol",
  "NUR Earth 3D: 12 nuclear sites monitored live via Esri World Imagery satellite feed",
];

const AI_TEMPLATES = [
  "The earnings revision cycle is {adj}. Factor decomposition suggests {outcome}, with particular sensitivity to {driver}.",
  "The forward curve is {adj} — a classic signal that the market is repricing {driver}. Historically, such shifts precede {outcome}.",
  "From a monetary economics perspective, the {adj} in yields reflects {driver}. The probability-weighted path suggests {outcome}.",
  "We observe a {adj} in the {segment} segment. The term premium is adjusting to {driver}, reminiscent of the {year} episode.",
  "Analyzing the cross-sectional data, the most robust inference is {outcome}. We must remain cognizant of {concern}.",
  "Crypto correlations with traditional risk assets are {adj}. In a portfolio optimization context, the marginal benefit is {outcome}.",
  "This PMI print aligns with a {phase} regime. The diffusion index suggests {outcome}, though we should caveat with {concern}.",
  "NUR Earth 3D satellite feed confirms {adj} activity at the {nuclearSite} complex. Proliferation risk index has shifted {outcome}. Uranium spot and gold are the primary hedges here.",
  "Geopolitical risk index (GPR) is now at {gprLevel}. The market has historically underpriced nuclear tail risk; the correct framework assigns {outcome} to non-linear escalation scenarios.",
  "Esri satellite imagery of {nuclearSite} shows {adj} thermal signature. This is consistent with {driver}. The financial transmission channel runs through {outcome}.",
  "The nuclear proliferation premium in energy markets is {adj}. Brent's risk premium embeds approximately $8-12/bbl for Middle East nuclear escalation. {outcome}.",
  "The real effective exchange rate is {adj}. Given the interest rate differential, the 12-month outlook is {outcome}.",
];

const FILL = {
  adj: ["flattening", "steepening", "inverting", "bull steepening", "bear flattening"],
  outcome: ["a repricing of the equity risk premium", "increased cross-asset volatility", "a convergence toward fair value", "a regime shift toward stagflationary dynamics", "a 60-70% probability of further tightening"],
  driver: ["safe-haven flows", "growth uncertainty", "liquidity conditions", "fiscal dominance", "inflation expectations"],
  segment: ["2-10 year", "belly", "front-end", "long-end"],
  year: ["2013", "2018", "2020", "2022"],
  concern: ["endogeneity concerns", "survivorship bias in the dataset", "structural breaks in the underlying process"],
  phase: ["early-cycle", "mid-cycle", "late-cycle"],
  nuclearSite: ["Natanz", "Yongbyon", "Bushehr", "Kahuta", "Dimona", "Lop Nor", "Severodvinsk"],
  gprLevel: ["187 — an 18-month high", "210 — approaching 2022 Ukraine-shock levels", "145 — elevated but contained", "240 — maximum alert territory"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCommentary(): string {
  const template = pick(AI_TEMPLATES);
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const opts = FILL[key as keyof typeof FILL];
    return opts ? pick(opts) : key;
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function generateNewsItem(): NewsItem {
  const tagInfo = pick(NEWS_TAGS);
  return {
    id: `n-${Date.now()}-${Math.random()}`,
    tag: tagInfo.tag,
    tagColor: tagInfo.color,
    text: pick(NEWS_HEADLINES),
    time: `${Math.floor(Math.random() * 30)} min ago`,
  };
}

function generateCommentaryItem(): Commentary {
  return {
    id: `c-${Date.now()}-${Math.random()}`,
    time: formatTime(new Date()),
    text: generateCommentary(),
  };
}

// ── Bloomberg-style command registry ─────────────────────────────────────────
interface NurCommand {
  aliases: string[];
  view?: string;
  description: string;
  category: string;
  output?: string[];
}

const NUR_COMMANDS: NurCommand[] = [
  // Market Intelligence
  { aliases: ["DASH", "HOME"], view: "dashboard", description: "Main dashboard — live market overview", category: "MARKET" },
  { aliases: ["CHART", "GP", "GPC"], view: "charts", description: "Interactive charting — equity, FX, commodities", category: "MARKET" },
  { aliases: ["SCR", "SCRN", "EQS"], view: "screener", description: "Equity & asset screener with quant filters", category: "MARKET" },
  { aliases: ["GLB", "WEI", "GMKT"], view: "global-markets", description: "Global markets — indices, FX, bonds, commodities", category: "MARKET" },
  { aliases: ["ECO", "ECON", "WECO"], view: "economic-data", description: "Economic indicators — GDP, CPI, PMI, NFP", category: "MACRO" },
  { aliases: ["RSK", "RISK", "MRSK"], view: "macro-risk", description: "Macro risk monitor — geopolitical, credit, vol", category: "MACRO" },
  { aliases: ["GEO", "GEOP", "GPOL"], view: "geopolitics", description: "Geopolitical intelligence — nuclear, sanctions, conflicts", category: "MACRO" },
  { aliases: ["FUND", "FA", "CFS"], view: "fundamentals", description: "Company fundamentals — P/E, EV/EBITDA, DCF", category: "EQUITY" },
  // Trading & Portfolio
  { aliases: ["PORT", "PRTU", "PRTF"], view: "portfolio", description: "Portfolio manager — positions, P&L, attribution", category: "PORTFOLIO" },
  { aliases: ["OMS", "EMS", "OEMS"], view: "oms-ems", description: "Order & execution management — trade blotter", category: "TRADING" },
  { aliases: ["OPT", "OMON", "OVDV"], view: "options", description: "Options analytics — vol surface, Greeks, strats", category: "DERIVATIVES" },
  { aliases: ["BT", "BACK", "BTST"], view: "backtest", description: "Strategy backtesting engine — Sharpe, drawdown", category: "QUANT" },
  { aliases: ["WISH"], view: "wish-framework", description: "WISH Framework — NUR's core trading strategy", category: "QUANT" },
  // AI & Research
  { aliases: ["AI", "QUANT", "QC", "COPILOT"], view: "quant-copilot", description: "AI Quant Strategist — alpha signals, factor models", category: "AI" },
  { aliases: ["AITOOLS", "MODELS"], view: "ai-tools", description: "Quantitative model library", category: "AI" },
  { aliases: ["RES", "RESEARCH", "BI"], view: "research", description: "NFS Research — analyst reports, deep dives", category: "RESEARCH" },
  { aliases: ["NI", "NEWS", "BRIEF", "TOP"], view: "news", description: "Market briefs — breaking financial news", category: "NEWS" },
  { aliases: ["NF", "FEED", "NFEED"], view: "news-feed", description: "Live news feed — multi-source stream", category: "NEWS" },
  { aliases: ["ALRT", "ALERTS", "RMW"], view: "alerts", description: "Risk alerts — threshold monitoring, signals", category: "ALERTS" },
  { aliases: ["INGEST", "DATA", "DI"], view: "data-ingest", description: "Data ingest — connect APIs, feeds, databases", category: "DATA" },
  // Media & Broadcast
  { aliases: ["TV", "LIVE", "NTV"], view: "live-tv", description: "NUR TV Live — 24/7 financial broadcast", category: "MEDIA" },
  { aliases: ["MEDIA", "MED"], view: "media", description: "NFS Media hub — video library, podcasts", category: "MEDIA" },
  { aliases: ["STUDIO", "BCAST", "BRDC"], view: "broadcast-studio", description: "Broadcast Studio — produce & stream live content", category: "MEDIA" },
  // Platform
  { aliases: ["PLANS", "PRICE", "SUB"], view: "pricing", description: "Subscription plans — NUR Finance B & R tiers", category: "PLATFORM" },
  { aliases: ["VERIFY", "KYC", "VER"], view: "verification-portal", description: "Identity & accreditation verification", category: "PLATFORM" },
  { aliases: ["WALLET", "PAY", "DWG"], view: "wallet-gateway", description: "Digital wallet & payment gateway", category: "PLATFORM" },
  { aliases: ["COIN", "NRC", "NURC"], view: "nur-coin", description: "NUR Coin ecosystem — tokenomics, staking", category: "CRYPTO" },
  { aliases: ["COMPUTE", "GPU", "CFA"], view: "compute-access", description: "Compute for access — GPU mining participation", category: "PLATFORM" },
  { aliases: ["EDU", "LEARN", "NURED"], view: "nur-education", description: "NUR Education — quant curriculum, courses", category: "EDUCATION" },
  { aliases: ["KIDS", "NURK"], view: "nur-kids", description: "NUR Kids — financial literacy for youth", category: "EDUCATION" },
  { aliases: ["HOLD", "ECOSYSTEM", "7ARM"], view: "holding-ecosystem", description: "7 Growth Arms — NUR holding ecosystem overview", category: "CORPORATE" },
  { aliases: ["TATAR", "TATFIN"], view: "tatar-finans", description: "Tatar Finans — regional finance division", category: "CORPORATE" },
  { aliases: ["UMAY", "BOSS", "CEO"], view: "umay-boss", description: "Umay Gül Nur — executive terminal", category: "CORPORATE" },
  { aliases: ["ENCY", "WIKI", "ENC"], view: "encyclopedia", description: "Financial encyclopedia — glossary, concepts", category: "REFERENCE" },
  // Terminal itself
  { aliases: ["TERM", "NFS", "NFST", "CLI"], view: "terminal", description: "NFS Terminal — this screen", category: "SYSTEM" },
  { aliases: ["EDITOR", "CODE", "IDE"], view: "editor", description: "Code editor — strategy IDE", category: "SYSTEM" },
  // Special output-only commands
  {
    aliases: ["HEAT", "HEATMAP", "HEATUP"],
    description: "Sector heat map — real-time color-coded performance matrix",
    category: "MARKET",
    output: [
      "━━━━━━━━━━━━━━━━ SECTOR HEAT MAP ━━━━━━━━━━━━━━━━",
      "  TECHNOLOGY    ████████░░  +2.4%  ▲ OUTPERFORM",
      "  ENERGY        ██████░░░░  +1.8%  ▲ OUTPERFORM",
      "  FINANCIALS    █████░░░░░  +1.1%  ▲ NEUTRAL",
      "  HEALTHCARE    ███░░░░░░░  +0.6%  ▲ NEUTRAL",
      "  UTILITIES     ░░░░░░░░░░  -0.2%  ▼ UNDERPERFORM",
      "  REAL ESTATE   ░░░░░░░░░░  -0.8%  ▼ UNDERPERFORM",
      "  MATERIALS     ░░░░░░░░░░  -1.4%  ▼ UNDERPERFORM",
      "─────────────────────────────────────────────────",
      "  Source: NUR Quant · Updated: " + new Date().toUTCString(),
    ],
  },
];

function matchCommand(input: string): NurCommand | null {
  const token = input.trim().toUpperCase().split(/\s+/)[0];
  return NUR_COMMANDS.find(cmd => cmd.aliases.includes(token)) ?? null;
}

interface CmdLine {
  id: string;
  type: "input" | "output" | "error" | "info";
  text: string;
  time: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function NURTerminalPanel() {
  const { setActiveView } = useIDEStore();
  const [news, setNews] = useState<NewsItem[]>(() => Array.from({ length: 15 }, generateNewsItem));
  const [commentaries, setCommentaries] = useState<Commentary[]>(() => Array.from({ length: 5 }, generateCommentaryItem));
  const [chartTimeframe, setChartTimeframe] = useState<"1H" | "1D" | "1W">("1D");
  const [cmdInput, setCmdInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cmdLines, setCmdLines] = useState<CmdLine[]>([
    { id: "boot-0", type: "info", text: "NUR Finance System Terminal v3.0  ·  Type HELP <GO> for command list", time: formatTime(new Date()) },
    { id: "boot-1", type: "info", text: "Sovereign Quantitative Engine active  ·  Ctrl+↑/↓ for history", time: formatTime(new Date()) },
  ]);
  const newsRef = useRef<HTMLDivElement>(null);
  const commentaryRef = useRef<HTMLDivElement>(null);
  const cmdLinesRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  const pushLine = useCallback((line: Omit<CmdLine, "id">) => {
    setCmdLines(prev => [...prev, { ...line, id: `l-${Date.now()}-${Math.random()}` }].slice(-200));
  }, []);

  const executeCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    pushLine({ type: "input", text: `> ${trimmed} <GO>`, time: formatTime(new Date()) });
    setCmdHistory(prev => [trimmed, ...prev].slice(0, 50));
    setHistoryIdx(-1);

    const upper = trimmed.toUpperCase();

    // HELP command
    if (upper === "HELP" || upper === "?") {
      const categories = [...new Set(NUR_COMMANDS.map(c => c.category))];
      pushLine({ type: "info", text: "━━━━━━━━━━━━━━━━━━ NUR FINANCE COMMAND REFERENCE ━━━━━━━━━━━━━━━━━━", time: formatTime(new Date()) });
      for (const cat of categories) {
        pushLine({ type: "info", text: `\n  ── ${cat} ──`, time: formatTime(new Date()) });
        NUR_COMMANDS.filter(c => c.category === cat).forEach(cmd => {
          pushLine({ type: "output", text: `  ${cmd.aliases.join(" · ").padEnd(24)} ${cmd.description}`, time: formatTime(new Date()) });
        });
      }
      pushLine({ type: "info", text: "\n  Press Enter or type <GO> after any command to execute.", time: formatTime(new Date()) });
      return;
    }

    const matched = matchCommand(trimmed);

    if (matched) {
      if (matched.output) {
        matched.output.forEach(line =>
          pushLine({ type: "output", text: line, time: formatTime(new Date()) })
        );
      }
      if (matched.view) {
        pushLine({ type: "info", text: `→ Navigating to ${matched.aliases[0]}…`, time: formatTime(new Date()) });
        setTimeout(() => setActiveView(matched.view as PanelView), 300);
      }
    } else {
      pushLine({ type: "error", text: `Unknown command: "${trimmed.split(/\s+/)[0].toUpperCase()}"  ·  Type HELP for available commands`, time: formatTime(new Date()) });
    }
  }, [pushLine, setActiveView]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = cmdInput.replace(/<GO>/gi, "").trim();
      if (val) executeCommand(val);
      setCmdInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(idx);
      setCmdInput(cmdHistory[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setCmdInput(idx === -1 ? "" : cmdHistory[idx] ?? "");
    }
  }, [cmdInput, cmdHistory, historyIdx, executeCommand]);

  // Auto-scroll command output
  useEffect(() => {
    if (cmdLinesRef.current) {
      cmdLinesRef.current.scrollTop = cmdLinesRef.current.scrollHeight;
    }
  }, [cmdLines]);

  useEffect(() => {
    const newsInterval = setInterval(
      () => setNews((prev) => [generateNewsItem(), ...prev].slice(0, 50)),
      4000 + Math.random() * 6000
    );
    const commentaryInterval = setInterval(
      () => setCommentaries((prev) => [generateCommentaryItem(), ...prev].slice(0, 30)),
      12000 + Math.random() * 18000
    );
    return () => {
      clearInterval(newsInterval);
      clearInterval(commentaryInterval);
    };
  }, []);

  const chartPoints = generateChartData(chartTimeframe);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      {/* Ticker Bar */}
      <div className="flex items-center h-8 border-b overflow-hidden shrink-0" style={{ borderColor: "#1e293b", background: "#0f1420" }}>
        <div className="flex items-center gap-6 animate-scroll-left px-4">
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <div key={`${t.symbol}-${i}`} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>{t.symbol}</span>
              <span className="text-[10px] font-mono">{t.price}</span>
              <span className="text-[10px] font-mono" style={{ color: t.positive ? "#00d4aa" : "#ef4444" }}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Chart */}
        <div className="flex-1 flex flex-col min-w-0 border-r" style={{ borderColor: "#1e293b" }}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "#1e293b" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#00d4aa" }}>Interactive Chart</span>
              <span className="text-[10px] font-mono" style={{ color: "#94a3b8" }}>SX5E</span>
            </div>
            <div className="flex items-center gap-1">
              {(["1H", "1D", "1W"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className="px-2 py-0.5 text-[10px] rounded transition-colors"
                  style={{
                    background: chartTimeframe === tf ? "rgba(0,212,170,0.15)" : "transparent",
                    color: chartTimeframe === tf ? "#00d4aa" : "#64748b",
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4 min-h-0">
            <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeWidth="0.5" />
              ))}
              <path d={`${chartPoints.area}`} fill="url(#chartGrad)" />
              <path d={`${chartPoints.line}`} fill="none" stroke="#00d4aa" strokeWidth="1.5" />
              <circle cx={chartPoints.lastX} cy={chartPoints.lastY} r="3" fill="#00d4aa" />
            </svg>
          </div>
        </div>

        {/* Center: Live News */}
        <div className="flex flex-col border-r" style={{ width: 360, borderColor: "#1e293b" }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "#1e293b" }}>
            <span className="text-xs font-semibold">Live News Feed</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
              <span className="text-[9px] font-bold" style={{ color: "#ef4444" }}>LIVE</span>
            </div>
          </div>
          <div ref={newsRef} className="flex-1 overflow-y-auto">
            {news.map((item) => (
              <div key={item.id} className="flex gap-2 px-3 py-1.5 border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "#1e293b22" }}>
                <span
                  className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded self-start mt-0.5 shrink-0"
                  style={{ background: `${item.tagColor}18`, color: item.tagColor, minWidth: 48, textAlign: "center" }}
                >
                  {item.tag}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] leading-tight block" style={{ color: "#cbd5e1" }}>{item.text}</span>
                  <span className="text-[9px]" style={{ color: "#475569" }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Anchor */}
        <div className="flex flex-col" style={{ width: 340 }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "#1e293b" }}>
            <span className="text-xs font-semibold">AI Anchor</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa" }} />
              <span className="text-[9px] font-bold" style={{ color: "#00d4aa" }}>LIVE</span>
            </div>
          </div>

          {/* AI Avatar + Eagle Crest */}
          <div className="flex items-center gap-3 px-3 py-3 border-b" style={{ borderColor: "#1e293b", background: "#0f1420" }}>
            <EagleCrest size={48} animate />
            <div>
              <div className="text-xs font-bold">Dr. Nur</div>
              <div className="text-[10px]" style={{ color: "#94a3b8" }}>Ph.D. Financial Economics</div>
            </div>
          </div>

          {/* Commentary Feed */}
          <div ref={commentaryRef} className="flex-1 overflow-y-auto">
            {commentaries.map((c) => (
              <div key={c.id} className="px-3 py-2.5 border-b" style={{ borderColor: "#1e293b22" }}>
                <div className="text-[9px] mb-1" style={{ color: "#475569" }}>
                  Dr. Nur · {c.time}
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: "#94a3b8" }}>
                  &ldquo;{c.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Command Output Log */}
      <div
        ref={cmdLinesRef}
        onClick={() => cmdInputRef.current?.focus()}
        className="border-t overflow-y-auto cursor-text"
        style={{
          height: 110,
          borderColor: "#1e293b",
          background: "#070b12",
          padding: "6px 12px",
        }}
      >
        {cmdLines.map(line => (
          <div key={line.id} className="flex gap-2 font-mono text-[10px] leading-relaxed">
            <span style={{ color: "rgba(78,98,128,0.5)", flexShrink: 0 }}>{line.time}</span>
            <span style={{
              color: line.type === "input" ? "#fbbf24"
                : line.type === "error" ? "#ef4444"
                : line.type === "info" ? "#22d3ee"
                : "#94a3b8",
              whiteSpace: "pre",
            }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Bloomberg-style Command Bar */}
      <div
        className="flex items-center shrink-0 border-t"
        style={{
          borderColor: "rgba(251,191,36,0.25)",
          background: "linear-gradient(90deg, #0f1008 0%, #13110a 100%)",
          boxShadow: "0 -1px 0 rgba(251,191,36,0.08)",
          height: 32,
          paddingLeft: 12,
          paddingRight: 12,
          gap: 8,
        }}
      >
        {/* Amber command-mode indicator */}
        <span
          className="text-[9px] font-mono font-black tracking-[0.12em] shrink-0 px-1.5 py-0.5 rounded-sm"
          style={{
            background: "rgba(251,191,36,0.15)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24",
          }}
        >
          NFS&#62;
        </span>

        <input
          ref={cmdInputRef}
          value={cmdInput}
          onChange={e => setCmdInput(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="TYPE COMMAND + ENTER  (e.g. RSK · HEAT · HELP · DASH)"
          className="flex-1 bg-transparent outline-none text-[11px] font-mono tracking-wider"
          style={{ color: "#fbbf24" }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="characters"
        />

        <button
          onClick={() => { const v = cmdInput.replace(/<GO>/gi, "").trim(); if (v) executeCommand(v); setCmdInput(""); }}
          className="shrink-0 px-2.5 py-0.5 rounded-sm font-black text-[9px] tracking-widest transition-all"
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.35)",
            color: "#22c55e",
          }}
        >
          &#60;GO&#62;
        </button>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function generateChartData(timeframe: "1H" | "1D" | "1W") {
  const points = timeframe === "1H" ? 60 : timeframe === "1D" ? 100 : 150;
  const seed = timeframe === "1H" ? 42 : timeframe === "1D" ? 137 : 256;
  const values: number[] = [125];

  for (let i = 1; i < points; i++) {
    const noise = Math.sin(seed + i * 0.3) * 3 + Math.cos(seed * i * 0.01) * 2;
    const trend = i * 0.05;
    values.push(values[i - 1] + noise * 0.4 + trend * 0.1);
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = values.map((v, i) => ({
    x: (i / (points - 1)) * 600,
    y: 230 - ((v - min) / range) * 200,
  }));

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L600,250 L0,250 Z`;

  return { line, area, lastX: coords[coords.length - 1].x, lastY: coords[coords.length - 1].y };
}
