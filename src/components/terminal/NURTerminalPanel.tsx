"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import EagleCrest from "@/components/ui/EagleCrest";

/* ─── Types ─────────────────────────────────────────────── */
interface TickerItem { symbol: string; price: string; change: string; positive: boolean; }
interface NewsItem { id: string; tag: string; tagColor: string; text: string; time: string; }
interface Commentary { id: string; time: string; text: string; }
interface OutputLine { id: string; type: "cmd" | "info" | "success" | "error" | "data" | "sep"; text: string; }

/* ─── Static data ────────────────────────────────────────── */
const TICKERS: TickerItem[] = [
  { symbol: "SX5E",    price: "5,234.50", change: "+0.11%", positive: true  },
  { symbol: "DAX",     price: "18,542",   change: "-0.18%", positive: false },
  { symbol: "CAC",     price: "7,845",    change: "-0.16%", positive: false },
  { symbol: "FTSE",    price: "8,321",    change: "-0.13%", positive: false },
  { symbol: "EUR/USD", price: "1.0842",   change: "-0.15%", positive: false },
  { symbol: "USD/JPY", price: "154.32",   change: "+0.03%", positive: true  },
  { symbol: "BTC",     price: "$67,420",  change: "+1.24%", positive: true  },
  { symbol: "ETH",     price: "$3,520",   change: "-0.16%", positive: false },
  { symbol: "GOLD",    price: "$2,341",   change: "+0.14%", positive: true  },
  { symbol: "OIL",     price: "$78.90",   change: "-0.12%", positive: false },
  { symbol: "VIX",     price: "14.2",     change: "-0.13%", positive: false },
  { symbol: "US10Y",   price: "4.18%",    change: "+0.04%", positive: true  },
  { symbol: "BUND10Y", price: "2.41%",    change: "-0.02%", positive: false },
  { symbol: "SPX",     price: "5,487",    change: "+0.22%", positive: true  },
  { symbol: "NKY",     price: "38,240",   change: "+0.55%", positive: true  },
];

const NEWS_TAGS = [
  { tag: "EQUITY",  color: "#00d4aa" }, { tag: "COMMOD", color: "#ef4444" },
  { tag: "RATES",   color: "#6366f1" }, { tag: "TECH",   color: "#a855f7" },
  { tag: "CRYPTO",  color: "#f59e0b" }, { tag: "FX",     color: "#22d3ee" },
  { tag: "FED",     color: "#64748b" }, { tag: "ECB",    color: "#64748b" },
  { tag: "MACRO",   color: "#6366f1" }, { tag: "GEOPOL", color: "#ef4444" },
  { tag: "CREDIT",  color: "#a855f7" }, { tag: "NUR",    color: "#00d4aa" },
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
  "Taiwan Strait tension lifts defense sector; LMT +3.4%",
  "NUR Finance B-tier live feed integration goes production",
  "Yield curve bull steepens — 2s10s spread narrows 12bps",
];

const AI_TEMPLATES = [
  "The earnings revision cycle is {adj}. Factor decomposition suggests {outcome}, with particular sensitivity to {driver}.",
  "The forward curve is {adj} — a classic signal that the market is repricing {driver}. Historically, such shifts precede {outcome}.",
  "From a monetary economics perspective, the {adj} in yields reflects {driver}. The probability-weighted path suggests {outcome}.",
  "We observe a {adj} in the {segment} segment. The term premium is adjusting to {driver}, reminiscent of the {year} episode.",
  "Analyzing cross-sectional data, the most robust inference is {outcome}. We must remain cognizant of {concern}.",
  "Crypto correlations with traditional risk assets are {adj}. In portfolio optimization context, the marginal benefit is {outcome}.",
  "This PMI print aligns with a {phase} regime. The diffusion index suggests {outcome}, though we caveat with {concern}.",
  "The real effective exchange rate is {adj}. Given the interest rate differential, the 12-month outlook is {outcome}.",
];

const FILL = {
  adj:     ["flattening","steepening","inverting","bull steepening","bear flattening","compressing"],
  outcome: ["a repricing of the equity risk premium","increased cross-asset volatility","a convergence toward fair value","a regime shift toward stagflationary dynamics","a 60-70% probability of further tightening"],
  driver:  ["safe-haven flows","growth uncertainty","liquidity conditions","fiscal dominance","inflation expectations","geopolitical risk premium"],
  segment: ["2-10 year","belly","front-end","long-end"],
  year:    ["2013","2018","2020","2022"],
  concern: ["endogeneity concerns","survivorship bias","structural breaks in the underlying process","non-linearities near the zero lower bound"],
  phase:   ["early-cycle","mid-cycle","late-cycle","contraction"],
};

/* ─── Helpers ────────────────────────────────────────────── */
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function fmt(d: Date) { return d.toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}); }
function generateCommentary() {
  return pick(AI_TEMPLATES).replace(/\{(\w+)\}/g,(_,k)=>{ const o=FILL[k as keyof typeof FILL]; return o?pick(o):k; });
}
function generateNewsItem(): NewsItem {
  const t = pick(NEWS_TAGS);
  return { id:`n-${Date.now()}-${Math.random()}`, tag:t.tag, tagColor:t.color, text:pick(NEWS_HEADLINES), time:`${Math.floor(Math.random()*30)} min ago` };
}
function generateCommentaryItem(): Commentary {
  return { id:`c-${Date.now()}-${Math.random()}`, time:fmt(new Date()), text:generateCommentary() };
}
let _oid = 0;
function line(type: OutputLine["type"], text: string): OutputLine {
  return { id: `o-${++_oid}`, type, text };
}

/* ─── Command Engine ─────────────────────────────────────── */
const COMMANDS: Record<string, { desc: string; category: string; fn: (args: string[]) => OutputLine[]; }> = {
  HELP: {
    desc: "Show all available commands",
    category: "SYSTEM",
    fn: () => {
      const cats: Record<string,string[]> = {};
      Object.entries(COMMANDS).forEach(([cmd,v])=>{ (cats[v.category]??=[]).push(cmd); });
      const out: OutputLine[] = [
        line("sep",  "╔══════════════════════════════════════════════════════════════╗"),
        line("info", "║          NUR FINANCE TERMINAL — COMMAND REFERENCE            ║"),
        line("sep",  "╠══════════════════════════════════════════════════════════════╣"),
      ];
      Object.entries(cats).forEach(([cat,cmds])=>{
        out.push(line("data",  `║  ▸ ${cat.padEnd(58)}║`));
        cmds.forEach(c=>{ out.push(line("info",`║    ${c.padEnd(18)}${COMMANDS[c].desc.substring(0,42).padEnd(42)}║`)); });
        out.push(line("sep",   "║                                                              ║"));
      });
      out.push(line("sep",  "╠══════════════════════════════════════════════════════════════╣"));
      out.push(line("info", "║  SHORTCUTS: ↑↓ history  |  TAB autocomplete  |  Ctrl+L clear ║"));
      out.push(line("sep",  "╚══════════════════════════════════════════════════════════════╝"));
      return out;
    }
  },
  CLEAR: { desc:"Clear terminal output", category:"SYSTEM", fn:()=>[line("info","__CLEAR__")] },
  CLS:   { desc:"Clear terminal output (alias)", category:"SYSTEM", fn:()=>[line("info","__CLEAR__")] },
  VER:   { desc:"Show system version", category:"SYSTEM", fn:()=>[
    line("info","NUR Finance Quantitative Terminal  v3.0.0-PRO"),
    line("data","Build: 2026.09.11 · Engine: AntiGravi IDE · Node: 22.x"),
    line("data","Licensed: NUR Sovereign Institutional — All rights reserved"),
  ]},
  STATUS: { desc:"System health ping", category:"SYSTEM", fn:()=>[
    line("success","◉ SYSTEM STATUS: ALL SYSTEMS NOMINAL"),
    line("data",   `  Market Data   : ● LIVE       (EODHD primary / Yahoo fallback)`),
    line("data",   `  Geopolitics   : ● LIVE       (ACLED + UCDP feed)`),
    line("data",   `  AI Engine     : ● ACTIVE     (Gemini 2.0 Flash)`),
    line("data",   `  Blockchain    : ● CONNECTED  (Ethereum mainnet)`),
    line("data",   `  Uptime        : 99.97%       (30d SLA)`),
  ]},

  // MARKET
  QT: { desc:"Quote <SYMBOL>  — e.g. QT AAPL", category:"MARKET", fn:([sym])=>{
    const s=sym?.toUpperCase()||"AAPL";
    const p=(45+Math.random()*200).toFixed(2);
    const ch=((Math.random()-0.48)*4).toFixed(2);
    const pos=parseFloat(ch)>=0;
    return [
      line("data",  `  ${s.padEnd(10)}  Last: $${p}`),
      line(pos?"success":"error", `  Change: ${pos?"+":""}${ch}%   Vol: ${(Math.random()*50+1).toFixed(1)}M   Bid/Ask: $${(+p-0.01).toFixed(2)} / $${(+p+0.01).toFixed(2)}`),
      line("data",  `  52W Hi: $${(+p*1.35).toFixed(2)}   52W Lo: $${(+p*0.62).toFixed(2)}   Mkt Cap: $${(+p*2.8).toFixed(1)}B`),
    ];
  }},
  MRKT: { desc:"Global index snapshot", category:"MARKET", fn:()=>[
    line("data",   "  INDEX          LAST         CHG      CHG%"),
    line("sep",    "  " + "─".repeat(50)),
    line("success","  S&P 500        5,487.21     +12.3    +0.22%"),
    line("success","  NASDAQ         17,842.53    +45.1    +0.25%"),
    line("error",  "  DAX            18,541.90    -33.4    -0.18%"),
    line("error",  "  FTSE 100       8,321.10     -10.8    -0.13%"),
    line("success","  NIKKEI 225     38,240.15    +209.5   +0.55%"),
    line("success","  HANG SENG      18,104.22    +88.7    +0.49%"),
    line("error",  "  SHANGHAI COMP  3,021.33     -15.2    -0.50%"),
    line("data",   "  MSCI EM        1,098.44     +3.1     +0.28%"),
  ]},
  VIX: { desc:"VIX volatility surface", category:"MARKET", fn:()=>[
    line("data",    "  VIX SPOT & TERM STRUCTURE"),
    line("sep",     "  " + "─".repeat(40)),
    line("success", "  SPOT VIX   :  14.2   (1M avg: 15.8)"),
    line("data",    "  VIX1M      :  15.4"),
    line("data",    "  VIX3M      :  17.1"),
    line("data",    "  VIX6M      :  18.8"),
    line("data",    "  VVIX       :  92.3   (vol of vol)"),
    line("info",    "  SKEW Index :  138    (tail-risk elevated)"),
    line("data",    "  Put/Call   :  0.82   (balanced)"),
  ]},
  CURVE: { desc:"US yield curve snapshot", category:"RATES", fn:()=>[
    line("data",  "  US TREASURY YIELD CURVE"),
    line("sep",   "  " + "─".repeat(40)),
    line("data",  "  3M  :  5.28%  ████████████████"),
    line("data",  "  2Y  :  4.72%  ██████████████"),
    line("data",  "  5Y  :  4.35%  █████████████"),
    line("data",  "  10Y :  4.18%  ████████████"),
    line("data",  "  20Y :  4.42%  █████████████"),
    line("data",  "  30Y :  4.31%  █████████████"),
    line("info",  "  2s10s spread: -54bps (INVERTED)"),
    line("error", "  Inversion since: 2022-07-05 — Recession signal active"),
  ]},
  DXY: { desc:"Dollar index & FX majors", category:"FX", fn:()=>[
    line("data",   "  DXY DOLLAR INDEX: 104.32  (-0.18%)"),
    line("sep",    "  " + "─".repeat(40)),
    line("data",   "  EUR/USD  :  1.0842  (-0.15%)"),
    line("data",   "  GBP/USD  :  1.2634  (-0.08%)"),
    line("success","  USD/JPY  :  154.32  (+0.03%)"),
    line("data",   "  USD/CHF  :  0.8971  (-0.11%)"),
    line("data",   "  AUD/USD  :  0.6521  (+0.09%)"),
    line("data",   "  USD/TRY  :  32.14   (+0.22%)"),
    line("data",   "  USD/CNY  :  7.2441  (-0.05%)"),
  ]},
  CREDIT: { desc:"CDS spreads & IG/HY indices", category:"RATES", fn:()=>[
    line("data",   "  CREDIT MARKET SNAPSHOT"),
    line("sep",    "  " + "─".repeat(40)),
    line("success","  CDX.NA.IG  :  54bps   (-2bps)"),
    line("success","  iTraxx EUR  :  58bps   (-1bps)"),
    line("data",   "  CDX.NA.HY  :  312bps  (+4bps)"),
    line("data",   "  iTraxx X-O :  298bps  (+3bps)"),
    line("data",   "  US IG OAS  :  91bps"),
    line("data",   "  US HY OAS  :  312bps"),
    line("info",   "  IG/HY ratio: 0.29  (risk appetite: NEUTRAL)"),
  ]},
  NFP: { desc:"Next NFP & macro calendar", category:"MACRO", fn:()=>[
    line("data",   "  UPCOMING HIGH-IMPACT RELEASES"),
    line("sep",    "  " + "─".repeat(50)),
    line("info",   "  Oct 04  ● US NFP            exp: +185K   prev: +142K"),
    line("data",   "  Oct 04  ● US Unemployment   exp: 3.8%    prev: 3.8%"),
    line("data",   "  Oct 09  ● FOMC Minutes"),
    line("data",   "  Oct 10  ● US CPI            exp: +0.2%   prev: +0.3%"),
    line("data",   "  Oct 17  ● ECB Rate Decision  exp: HOLD"),
    line("data",   "  Oct 24  ● Eurozone PMI Flash"),
    line("data",   "  Oct 30  ● BoJ Policy Review"),
    line("data",   "  Oct 31  ● EU GDP Flash       exp: +0.3% QoQ"),
  ]},
  ECAL: { desc:"Full economic calendar (7 days)", category:"MACRO", fn:()=>[
    line("data",   "  ECONOMIC CALENDAR — NEXT 7 DAYS"),
    line("sep",    "  " + "─".repeat(58)),
    line("error",  "  Mon  ●●● US ISM Manufacturing PMI       exp: 49.5"),
    line("data",   "  Mon  ●   EU Sentix Investor Confidence"),
    line("data",   "  Tue  ●   German Factory Orders           exp: -0.8%"),
    line("data",   "  Wed  ●●● US ADP Employment              exp: +150K"),
    line("info",   "  Wed  ●●● US ISM Services PMI            exp: 51.7"),
    line("data",   "  Thu  ●   ECB Accounts"),
    line("data",   "  Thu  ●   US Jobless Claims               exp: 225K"),
    line("error",  "  Fri  ●●● US NFP                         exp: +185K"),
    line("error",  "  Fri  ●●● US Unemployment Rate           exp: 3.8%"),
    line("data",   "  ●=LOW  ●●=MED  ●●●=HIGH impact"),
  ]},

  // EQUITY
  SCREEN: { desc:"Top movers screener", category:"EQUITY", fn:()=>[
    line("data",   "  TOP MOVERS  (Last 24h)"),
    line("sep",    "  " + "─".repeat(50)),
    line("success","  NVDA   +4.21%   $875.40    AI chip demand surge"),
    line("success","  META   +2.88%   $512.30    Ad revenue beat"),
    line("error",  "  INTC   -3.14%   $21.80     Data center miss"),
    line("error",  "  BIDU   -2.77%   $88.10     China regulatory risk"),
    line("success","  TSLA   +2.11%   $248.50    Delivery beat"),
    line("success","  AMZN   +1.88%   $191.20    AWS margin expansion"),
    line("error",  "  BABA   -1.54%   $72.40     Geopolitical headwinds"),
  ]},
  PE: { desc:"Global P/E ratio comparison", category:"EQUITY", fn:()=>[
    line("data",   "  GLOBAL EQUITY VALUATIONS  (Forward P/E)"),
    line("sep",    "  " + "─".repeat(40)),
    line("data",   "  S&P 500 :    21.4x   (10Y avg: 18.1x)  EXPENSIVE"),
    line("data",   "  NASDAQ  :    28.8x   (10Y avg: 24.2x)  EXPENSIVE"),
    line("data",   "  Stoxx50 :    13.9x   (10Y avg: 14.2x)  FAIR"),
    line("success","  FTSE100 :    11.2x   (10Y avg: 13.8x)  CHEAP"),
    line("success","  Nikkei  :    16.4x   (10Y avg: 17.1x)  FAIR"),
    line("success","  MSCI EM :     11.8x  (10Y avg: 12.4x)  FAIR-CHEAP"),
  ]},
  EPS: { desc:"S&P 500 earnings tracker", category:"EQUITY", fn:()=>[
    line("info","  S&P 500 Q3 2026 EARNINGS — 68% reported"),
    line("data","  Beat rate : 74%  (10Y avg: 67%)"),
    line("data","  EPS growth: +11.2% YoY  (est. +8.4%)"),
    line("data","  Rev growth: +5.8% YoY   (est. +4.1%)"),
    line("success","  Best sector: Tech (+22.4%)"),
    line("error", "  Worst sector: Real Estate (-8.1%)"),
  ]},

  // QUANT
  SHARPE: { desc:"Portfolio Sharpe calculator", category:"QUANT", fn:()=>[
    line("info","  PORTFOLIO RISK METRICS  (trailing 1Y)"),
    line("data","  Sharpe Ratio  :  1.42"),
    line("data","  Sortino Ratio :  1.87"),
    line("data","  Max Drawdown  :  -8.4%"),
    line("data","  Calmar Ratio  :  2.11"),
    line("data","  Beta (vs SPX) :  0.78"),
    line("data","  Alpha (ann.)  :  +3.2%"),
    line("data","  VaR 95% (1d)  :  -1.8%"),
    line("data","  CVaR 95%      :  -2.6%"),
  ]},
  CORR: { desc:"Cross-asset correlation matrix", category:"QUANT", fn:()=>[
    line("data","  CORRELATION MATRIX  (60d rolling)"),
    line("sep", "  " + "─".repeat(52)),
    line("data","           SPX    BTC    GOLD   OIL    BONDS"),
    line("data","  SPX    [1.00]  0.41   -0.22  0.18   -0.65"),
    line("data","  BTC    [0.41]  1.00   -0.08  0.11   -0.31"),
    line("data","  GOLD   [-0.22]-0.08  [1.00]  0.02    0.44"),
    line("data","  OIL    [0.18]  0.11   0.02  [1.00]  -0.28"),
    line("data","  BONDS  [-0.65]-0.31   0.44  -0.28   [1.00]"),
  ]},
  FACTOR: { desc:"Factor exposure decomposition", category:"QUANT", fn:()=>[
    line("data",   "  FACTOR DECOMPOSITION  (Barra-style)"),
    line("sep",    "  " + "─".repeat(45)),
    line("success","  Momentum     +0.84  (strong positive tilt)"),
    line("success","  Quality      +0.61"),
    line("data",   "  Low Vol      +0.22"),
    line("error",  "  Value        -0.31  (growth bias)"),
    line("data",   "  Size         -0.08  (large cap)"),
    line("data",   "  R² vs model : 0.82"),
  ]},

  // CRYPTO
  BTC: { desc:"Bitcoin dashboard", category:"CRYPTO", fn:()=>{
    const p=(60000+Math.random()*15000).toFixed(0);
    return [
      line("data",   `  BITCOIN (BTC/USD)   $${Number(p).toLocaleString()}`),
      line("sep",    "  " + "─".repeat(40)),
      line("data",   "  24h Vol:   $42.8B      Dominance: 52.1%"),
      line("data",   "  Mkt Cap:   $1.31T      Fear&Greed: 68 (Greed)"),
      line("success","  ETF Flow (7d): +$2.1B  (BlackRock: +$890M)"),
      line("data",   "  Hash Rate:  680 EH/s   Mempool: 42K tx"),
      line("data",   "  Next Halving: ~2028-04  Block: 851,234"),
    ];
  }},
  NUR: { desc:"$NUR Coin ecosystem status", category:"CRYPTO", fn:()=>[
    line("info",   "  $NUR SOVEREIGN TOKEN  ——  v1.0 Genesis"),
    line("sep",    "  " + "─".repeat(45)),
    line("data",   "  Network     : Ethereum Mainnet (ERC-20)"),
    line("data",   "  Symbol      : NUR"),
    line("data",   "  Supply      : 21,000,000 (hard cap, à la BTC)"),
    line("success","  Staking APY : 8.4%  (NUR Finance B holders)"),
    line("data",   "  Utility     : Access · Governance · Yield"),
    line("data",   "  Contract    : 0xNUR...SOVEREIGN"),
    line("info",   "  Phase       : Testnet → Mainnet Q1 2027"),
  ]},
  DEFI: { desc:"DeFi protocol overview", category:"CRYPTO", fn:()=>[
    line("data",   "  TOP DEFI PROTOCOLS  (TVL)"),
    line("sep",    "  " + "─".repeat(42)),
    line("data",   "  Lido         $34.1B   (stETH yield: 3.9%)"),
    line("data",   "  Aave         $18.2B   (USDC supply: 4.8%)"),
    line("data",   "  Uniswap      $7.8B    (7d vol: $12.4B)"),
    line("data",   "  MakerDAO     $9.1B    (DSR: 5.0%)"),
    line("data",   "  Curve        $4.2B"),
    line("success","  Total DeFi TVL: $102.4B  (+12% MoM)"),
  ]},

  // TRADING
  OMS: { desc:"Open orders & OMS status", category:"TRADING", fn:()=>[
    line("info",   "  OMS/EMS — ORDER MANAGEMENT SYSTEM"),
    line("sep",    "  " + "─".repeat(50)),
    line("success","  ● CONNECTED  to NUR Sovereign Broker Gateway"),
    line("data",   "  Open orders  :  0   |  Filled today: 0"),
    line("data",   "  Buying power :  $0  (Paper mode — connect wallet)"),
    line("info",   "  → Use WALLET command to connect MetaMask"),
  ]},
  WALLET: { desc:"Wallet connection status", category:"TRADING", fn:()=>[
    line("info",   "  DIGITAL WALLET GATEWAY"),
    line("data",   "  Status     : Not connected"),
    line("data",   "  Network    : Ethereum Mainnet"),
    line("info",   "  → Open the Wallet Gateway panel (sidebar) to connect MetaMask"),
    line("data",   "  Supported  : MetaMask · WalletConnect · Ledger · Trezor"),
  ]},
  RISK: { desc:"Real-time portfolio risk", category:"TRADING", fn:()=>[
    line("data",   "  PORTFOLIO RISK MONITOR"),
    line("sep",    "  " + "─".repeat(40)),
    line("success","  Overall Risk :  LOW"),
    line("data",   "  Gross Exp.   :  $0    (no positions)"),
    line("data",   "  Net Exp.     :  $0"),
    line("data",   "  Delta        :  0.00"),
    line("data",   "  Theta        :  0.00"),
    line("info",   "  → Connect wallet and add positions to see live risk"),
  ]},

  // AI
  ANALYZE: { desc:"AI signal on <SYMBOL>", category:"AI", fn:([sym])=>{
    const s=sym?.toUpperCase()||"SPY";
    const signals=["BULLISH","BEARISH","NEUTRAL"];
    const sig=pick(signals);
    const conf=(65+Math.random()*30).toFixed(0);
    return [
      line("info",   `  AI SIGNAL ANALYSIS — ${s}`),
      line(sig==="BULLISH"?"success":sig==="BEARISH"?"error":"data",
           `  Signal     : ${sig}   Confidence: ${conf}%`),
      line("data",   `  Timeframe  : 5-day forward window`),
      line("data",   `  Key driver : ${pick(FILL.driver)}`),
      line("data",   `  Risk note  : ${pick(FILL.concern)}`),
      line("info",   `  Commentary : "${generateCommentary()}"`),
    ];
  }},
  BRIEF: { desc:"AI market brief", category:"AI", fn:()=>[
    line("info","  AI MORNING BRIEF  — " + new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})),
    line("sep", "  " + "─".repeat(55)),
    line("data","  " + generateCommentary()),
    line("data","  " + generateCommentary()),
    line("data","  " + generateCommentary()),
  ]},
  SENTIMENT: { desc:"Market sentiment indicators", category:"AI", fn:()=>[
    line("data",   "  SENTIMENT DASHBOARD"),
    line("sep",    "  " + "─".repeat(45)),
    line("success","  CNN Fear&Greed  :  68  GREED"),
    line("data",   "  AAII Bull/Bear  :  44% / 31%  (Bull-bias)"),
    line("success","  Put/Call Ratio  :  0.82  (moderate optimism)"),
    line("data",   "  Short Interest  :  2.1% of float (S&P avg)"),
    line("data",   "  Margin Debt (YoY): +8.4%  (risk appetite rising)"),
    line("info",   "  NUR AI Composite: RISK-ON  (score: 0.62/1.0)"),
  ]},

  // SYSTEM
  PING: { desc:"Ping data providers", category:"SYSTEM", fn:()=>[
    line("success","  ● EODHD API       12ms  OK"),
    line("success","  ● Yahoo Finance   38ms  OK (fallback)"),
    line("success","  ● ACLED Conflicts 88ms  OK"),
    line("success","  ● Ethereum RPC    24ms  OK"),
    line("success","  ● NUR Auth Server 15ms  OK"),
  ]},
  TIME: { desc:"Server & market times", category:"SYSTEM", fn:()=>{
    const now=new Date();
    const nyOff=-4; const lonOff=1; const tokyOff=9;
    const tz=(h:number)=>`${((now.getUTCHours()+h+24)%24).toString().padStart(2,"0")}:${now.getUTCMinutes().toString().padStart(2,"0")}`;
    return [
      line("data",`  UTC        :  ${now.toUTCString().slice(17,25)}`),
      line("data",`  New York   :  ${tz(nyOff)}  (NYSE ${tz(nyOff)>="09:30"&&tz(nyOff)<="16:00"?"● OPEN":"○ CLOSED"})`),
      line("data",`  London     :  ${tz(lonOff)}  (LSE ${tz(lonOff)>="08:00"&&tz(lonOff)<="16:30"?"● OPEN":"○ CLOSED"})`),
      line("data",`  Tokyo      :  ${tz(tokyOff)}  (TSE ${tz(tokyOff)>="09:00"&&tz(tokyOff)<="15:30"?"● OPEN":"○ CLOSED"})`),
    ];
  }},
};

/* ─── Main Component ─────────────────────────────────────── */
export default function NURTerminalPanel() {
  const [news, setNews]         = useState<NewsItem[]>(() => Array.from({length:15},generateNewsItem));
  const [commentaries, setCom]  = useState<Commentary[]>(() => Array.from({length:5},generateCommentaryItem));
  const [chartTF, setChartTF]   = useState<"1H"|"1D"|"1W">("1D");
  const [cmdInput, setCmdInput] = useState("");
  const [output, setOutput]     = useState<OutputLine[]>(() => [
    line("info",   "╔══════════════════════════════════════════════════════╗"),
    line("info",   "║    NUR FINANCE QUANTITATIVE TERMINAL  v3.0-PRO      ║"),
    line("info",   "║    AntiGravi IDE · Sovereign Command Station         ║"),
    line("sep",    "╚══════════════════════════════════════════════════════╝"),
    line("data",   "  Type HELP to see all commands  |  TAB to autocomplete"),
  ]);
  const [history, setHistory]   = useState<string[]>([]);
  const [histIdx, setHistIdx]   = useState(-1);
  const [suggestions, setSugg]  = useState<string[]>([]);

  const newsRef    = useRef<HTMLDivElement>(null);
  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const addNews = useCallback(() => setNews(p=>[generateNewsItem(),...p].slice(0,50)),[]);
  const addCom  = useCallback(() => setCom(p=>[generateCommentaryItem(),...p].slice(0,30)),[]);

  useEffect(()=>{
    const n=setInterval(addNews,4000+Math.random()*6000);
    const c=setInterval(addCom,12000+Math.random()*18000);
    return ()=>{ clearInterval(n); clearInterval(c); };
  },[addNews,addCom]);

  useEffect(()=>{ if(outputRef.current) outputRef.current.scrollTop=outputRef.current.scrollHeight; },[output]);

  const runCommand = useCallback((raw: string)=>{
    const trimmed = raw.trim().toUpperCase();
    const [cmd,...args] = trimmed.split(/\s+/);
    if(!cmd) return;

    const newLines: OutputLine[] = [line("cmd",`▸ ${raw.trim()}`)];

    if(cmd in COMMANDS){
      const result = COMMANDS[cmd].fn(args);
      if(result.length===1 && result[0].text==="__CLEAR__"){
        setOutput([line("data","  Terminal cleared.")]);
        return;
      }
      newLines.push(...result);
    } else {
      newLines.push(line("error",`  Unknown command: '${cmd}'. Type HELP for reference.`));
    }

    setOutput(p=>[...p,...newLines].slice(-200));
    setHistory(h=>[raw.trim(),...h].slice(0,50));
    setHistIdx(-1);
  },[]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"){
      if(suggestions.length>0){ setCmdInput(suggestions[0]); setSugg([]); return; }
      runCommand(cmdInput);
      setCmdInput("");
      setSugg([]);
    } else if(e.key==="ArrowUp"){
      e.preventDefault();
      const idx=Math.min(histIdx+1,history.length-1);
      setHistIdx(idx);
      if(history[idx]) setCmdInput(history[idx]);
    } else if(e.key==="ArrowDown"){
      e.preventDefault();
      const idx=Math.max(histIdx-1,-1);
      setHistIdx(idx);
      setCmdInput(idx===-1?"":history[idx]||"");
    } else if(e.key==="Tab"){
      e.preventDefault();
      if(suggestions.length>0){ setCmdInput(suggestions[0]); setSugg([]); }
    } else if(e.ctrlKey&&e.key==="l"){
      e.preventDefault();
      setOutput([line("data","  Terminal cleared.")]);
    }
  };

  const handleInputChange = (v: string)=>{
    setCmdInput(v);
    const up=v.trim().toUpperCase();
    if(up.length>=1){
      const s=Object.keys(COMMANDS).filter(c=>c.startsWith(up)&&c!==up);
      setSugg(s.slice(0,4));
    } else { setSugg([]); }
  };

  const chartPoints = generateChartData(chartTF);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{background:"#050d1a",color:"#e2e8f0"}}>

      {/* Ticker Bar */}
      <div className="flex items-center h-7 border-b overflow-hidden shrink-0" style={{borderColor:"#0d1e38",background:"#040c18"}}>
        <div className="flex items-center gap-6 px-4" style={{animation:"scroll-left 40s linear infinite"}}>
          {[...TICKERS,...TICKERS].map((t,i)=>(
            <div key={`${t.symbol}-${i}`} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[9px] font-medium" style={{color:"#4a6080"}}>{t.symbol}</span>
              <span className="text-[9px] font-mono" style={{color:"#b8d0ee"}}>{t.price}</span>
              <span className="text-[9px] font-mono" style={{color:t.positive?"#00e5c3":"#ff3d5a"}}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex min-h-0">

        {/* Left: Chart */}
        <div className="flex-1 flex flex-col min-w-0 border-r" style={{borderColor:"#0d1e38"}}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{borderColor:"#0d1e38"}}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{color:"#00e5c3"}}>Interactive Chart</span>
              <span className="text-[10px] font-mono" style={{color:"#4a6080"}}>SX5E · Euro Stoxx 50</span>
            </div>
            <div className="flex items-center gap-1">
              {(["1H","1D","1W"] as const).map(tf=>(
                <button key={tf} onClick={()=>setChartTF(tf)}
                  className="px-2 py-0.5 text-[10px] rounded transition-colors"
                  style={{background:chartTF===tf?"rgba(0,229,195,0.12)":"transparent",color:chartTF===tf?"#00e5c3":"#3a5570"}}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-3 min-h-0">
            <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5c3" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#00e5c3" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[50,100,150,200].map(y=>(
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#0d1e38" strokeWidth="0.6"/>
              ))}
              <path d={chartPoints.area} fill="url(#chartGrad2)"/>
              <path d={chartPoints.line} fill="none" stroke="#00e5c3" strokeWidth="1.5"/>
              <circle cx={chartPoints.lastX} cy={chartPoints.lastY} r="3" fill="#00e5c3"/>
            </svg>
          </div>
        </div>

        {/* Center: News */}
        <div className="flex flex-col border-r" style={{width:320,borderColor:"#0d1e38"}}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{borderColor:"#0d1e38"}}>
            <span className="text-xs font-semibold" style={{color:"#b8d0ee"}}>Live News Feed</span>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#ff3d5a"}}/>
              <span className="text-[9px] font-bold" style={{color:"#ff3d5a"}}>LIVE</span>
            </div>
          </div>
          <div ref={newsRef} className="flex-1 overflow-y-auto">
            {news.map(item=>(
              <div key={item.id} className="flex gap-2 px-3 py-1.5 border-b hover:bg-white/[0.02] transition-colors" style={{borderColor:"#0d1e3822"}}>
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded self-start mt-0.5 shrink-0"
                  style={{background:`${item.tagColor}15`,color:item.tagColor,minWidth:48,textAlign:"center"}}>
                  {item.tag}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] leading-tight block" style={{color:"#8ca0ba"}}>{item.text}</span>
                  <span className="text-[9px]" style={{color:"#2a3f58"}}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Command output */}
        <div className="flex flex-col" style={{width:320}}>
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{borderColor:"#0d1e38"}}>
            <EagleCrest size={16} />
            <span className="text-xs font-semibold font-mono" style={{color:"#00e5c3"}}>NUR Terminal</span>
            <span className="text-[8px] ml-auto" style={{color:"#2a3f58"}}>TAB · ↑↓ · Ctrl+L</span>
          </div>
          <div ref={outputRef} className="flex-1 overflow-y-auto p-2 font-mono text-[10px] space-y-0.5">
            {output.map(o=>(
              <div key={o.id} style={{color:
                o.type==="cmd"?"#00e5c3":
                o.type==="success"?"#00ff88":
                o.type==="error"?"#ff3d5a":
                o.type==="sep"?"#1a3050":
                o.type==="info"?"#7c9cbc":
                "#6a8aaa"
              }} className="whitespace-pre leading-relaxed">{o.text}</div>
            ))}
          </div>

          {/* Autocomplete suggestions */}
          {suggestions.length>0&&(
            <div className="px-3 py-1 border-t border-b" style={{borderColor:"#0d1e38",background:"#04080f"}}>
              <div className="flex gap-2 flex-wrap">
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>{setCmdInput(s);setSugg([]);inputRef.current?.focus();}}
                    className="text-[9px] font-mono px-2 py-0.5 rounded"
                    style={{background:"rgba(0,229,195,0.1)",color:"#00e5c3",border:"1px solid rgba(0,229,195,0.2)"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Command Input */}
          <div className="flex items-center h-8 px-3 border-t shrink-0" style={{borderColor:"#0d1e38",background:"#04080f"}}>
            <span className="text-[11px] mr-2 font-mono" style={{color:"#00e5c3"}}>▸</span>
            <input ref={inputRef} value={cmdInput}
              onChange={e=>handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command… (HELP for list)"
              className="flex-1 bg-transparent outline-none text-[11px] font-mono"
              style={{color:"#e2e8f0",caretColor:"#00e5c3"}}
              spellCheck={false} autoComplete="off"/>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function generateChartData(tf:"1H"|"1D"|"1W"){
  const pts=tf==="1H"?60:tf==="1D"?100:150;
  const seed=tf==="1H"?42:tf==="1D"?137:256;
  const vals=[125];
  for(let i=1;i<pts;i++){
    const n=Math.sin(seed+i*0.3)*3+Math.cos(seed*i*0.01)*2;
    vals.push(vals[i-1]+n*0.4+(i*0.05*0.1));
  }
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const coords=vals.map((v,i)=>({x:(i/(pts-1))*600,y:230-((v-mn)/rng)*200}));
  const lne=coords.map((c,i)=>`${i===0?"M":"L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  return{line:lne,area:`${lne} L600,250 L0,250 Z`,lastX:coords[coords.length-1].x,lastY:coords[coords.length-1].y};
}
