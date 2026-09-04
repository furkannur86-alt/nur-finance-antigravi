"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import EagleCrest from "@/components/ui/EagleCrest";

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
];

const AI_TEMPLATES = [
  "The earnings revision cycle is {adj}. Factor decomposition suggests {outcome}, with particular sensitivity to {driver}.",
  "The forward curve is {adj} — a classic signal that the market is repricing {driver}. Historically, such shifts precede {outcome}.",
  "From a monetary economics perspective, the {adj} in yields reflects {driver}. The probability-weighted path suggests {outcome}.",
  "We observe a {adj} in the {segment} segment. The term premium is adjusting to {driver}, reminiscent of the {year} episode.",
  "Analyzing the cross-sectional data, the most robust inference is {outcome}. We must remain cognizant of {concern}.",
  "Crypto correlations with traditional risk assets are {adj}. In a portfolio optimization context, the marginal benefit is {outcome}.",
  "This PMI print aligns with a {phase} regime. The diffusion index suggests {outcome}, though we should caveat with {concern}.",
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

export default function NURTerminalPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [chartTimeframe, setChartTimeframe] = useState<"1H" | "1D" | "1W">("1D");
  const [cmdInput, setCmdInput] = useState("");
  const newsRef = useRef<HTMLDivElement>(null);
  const commentaryRef = useRef<HTMLDivElement>(null);

  const addNews = useCallback(() => {
    const tagInfo = pick(NEWS_TAGS);
    const item: NewsItem = {
      id: `n-${Date.now()}-${Math.random()}`,
      tag: tagInfo.tag,
      tagColor: tagInfo.color,
      text: pick(NEWS_HEADLINES),
      time: `${Math.floor(Math.random() * 30)} min ago`,
    };
    setNews((prev) => [item, ...prev].slice(0, 50));
  }, []);

  const addCommentary = useCallback(() => {
    const c: Commentary = {
      id: `c-${Date.now()}`,
      time: formatTime(new Date()),
      text: generateCommentary(),
    };
    setCommentaries((prev) => [c, ...prev].slice(0, 30));
  }, []);

  useEffect(() => {
    for (let i = 0; i < 15; i++) addNews();
    for (let i = 0; i < 5; i++) addCommentary();

    const newsInterval = setInterval(addNews, 4000 + Math.random() * 6000);
    const commentaryInterval = setInterval(addCommentary, 12000 + Math.random() * 18000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(commentaryInterval);
    };
  }, [addNews, addCommentary]);

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

      {/* Command Bar */}
      <div className="flex items-center h-8 px-3 border-t shrink-0" style={{ borderColor: "#1e293b", background: "#0f1420" }}>
        <span className="text-[10px] mr-2" style={{ color: "#00d4aa" }}>&#10095;</span>
        <input
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && cmdInput.trim()) {
              setCmdInput("");
            }
          }}
          placeholder="Type a command..."
          className="flex-1 bg-transparent outline-none text-[11px] font-mono"
          style={{ color: "#e2e8f0" }}
          spellCheck={false}
        />
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
