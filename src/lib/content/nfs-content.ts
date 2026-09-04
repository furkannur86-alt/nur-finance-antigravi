export interface MarketBrief {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: "macro" | "equity" | "fx" | "crypto" | "commodities";
  tickers: string[];
  sentiment: "bullish" | "bearish" | "neutral";
  publishedAt: string;
  author: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  region: string;
  category: "geopolitical" | "market" | "credit" | "operational" | "cyber";
  affectedAssets: string[];
  publishedAt: string;
  active: boolean;
}

export interface ResearchNote {
  id: string;
  title: string;
  abstract: string;
  body: string;
  sector: string;
  rating: "buy" | "hold" | "sell" | "overweight" | "underweight";
  targetPrice?: number;
  tickers: string[];
  author: string;
  publishedAt: string;
}

const now = new Date();
function ago(hours: number): string {
  return new Date(now.getTime() - hours * 3600000).toISOString();
}

export const MARKET_BRIEFS: MarketBrief[] = [
  {
    id: "mb-001",
    title: "Fed Holds Rates Steady, Signals September Cut",
    summary: "Federal Reserve maintains target range at 5.25-5.50%, Powell hints at potential easing cycle beginning Q3.",
    body: "The Federal Open Market Committee voted unanimously to keep the federal funds rate unchanged at 5.25-5.50% for the eighth consecutive meeting. Chair Powell noted that inflation has made 'considerable progress' toward the 2% target, with core PCE declining to 2.6% year-over-year. The dot plot now shows a median projection of two cuts in 2025, down from three in the March projections. Treasury yields fell sharply on the dovish tone, with the 2-year dropping 12bps to 4.71%. Equity futures rallied in after-hours trading, with ES +0.8% and NQ +1.2%. The USD weakened against major pairs, with EUR/USD rising to 1.0890.",
    category: "macro",
    tickers: ["SPY", "TLT", "EUR/USD", "GLD"],
    sentiment: "bullish",
    publishedAt: ago(2),
    author: "NFS Macro Desk",
  },
  {
    id: "mb-002",
    title: "NVDA Surges Past $1T on AI Datacenter Demand",
    summary: "NVIDIA reports Q2 revenue of $30.04B, beating estimates by 18%. Datacenter segment up 154% YoY.",
    body: "NVIDIA Corporation reported fiscal Q2 2025 revenue of $30.04 billion, crushing consensus estimates of $25.5 billion. The Datacenter segment generated $26.3 billion in revenue, up 154% year-over-year, driven by unprecedented demand for H100 and H200 GPU accelerators. CEO Jensen Huang announced the Blackwell Ultra architecture roadmap, with B200 chips already in volume production. Gross margins expanded to 78.4%, above the 75% guidance. The company raised Q3 revenue guidance to $32.5 billion +/- 2%. Shares surged 12% in extended trading, pushing market cap above $3.2 trillion.",
    category: "equity",
    tickers: ["NVDA", "AMD", "AVGO", "TSM"],
    sentiment: "bullish",
    publishedAt: ago(5),
    author: "NFS Tech Analyst",
  },
  {
    id: "mb-003",
    title: "BOJ Signals Further Tightening, Yen Strengthens",
    summary: "Bank of Japan raises policy rate to 0.50%, Governor Ueda hints at additional hikes if wage growth sustains.",
    body: "The Bank of Japan raised its short-term policy rate by 25 basis points to 0.50%, the highest level since 2008. Governor Ueda stated that the virtuous cycle between wages and prices is 'firmly taking hold,' with spring wage negotiations yielding a 5.1% average increase. USD/JPY dropped 280 pips to 148.20 on the hawkish guidance. Japanese 10-year JGB yields rose to 1.15%. The move triggered a broad unwinding of carry trades, with AUD/JPY and NZD/JPY falling sharply. Nikkei 225 futures declined 1.8% on concerns about corporate earnings impact from the stronger yen.",
    category: "fx",
    tickers: ["USD/JPY", "EUR/JPY", "EWJ", "FXY"],
    sentiment: "bearish",
    publishedAt: ago(8),
    author: "NFS FX Desk",
  },
  {
    id: "mb-004",
    title: "Bitcoin Breaks $75K on ETF Inflows",
    summary: "Spot Bitcoin ETFs see record $2.1B single-day inflow. BTC reaches new ATH at $75,420.",
    body: "Bitcoin surged to a new all-time high of $75,420, driven by massive institutional inflows into spot ETFs. BlackRock's IBIT led with $890M in daily inflows, followed by Fidelity's FBTC at $445M. Total assets under management across all spot Bitcoin ETFs now exceed $80 billion. On-chain metrics show declining exchange reserves, suggesting strong accumulation. The options market is pricing in significant upside, with $100K December calls seeing heavy volume. Ethereum also benefited, rising 8% to $3,850, while Solana gained 12% on renewed DeFi activity.",
    category: "crypto",
    tickers: ["BTC-USD", "ETH-USD", "IBIT", "FBTC"],
    sentiment: "bullish",
    publishedAt: ago(12),
    author: "NFS Digital Assets",
  },
  {
    id: "mb-005",
    title: "Brent Crude Spikes on OPEC+ Extension",
    summary: "OPEC+ extends production cuts through Q1 2025. Saudi Arabia announces additional voluntary 1M bpd reduction.",
    body: "Brent crude oil surged 4.2% to $86.50 per barrel after OPEC+ agreed to extend current production cuts of 3.66 million barrels per day through March 2025. Saudi Arabia announced an additional voluntary cut of 1 million bpd, bringing its production to approximately 8 million bpd. The decision came despite pressure from the US to increase output. Energy stocks rallied, with XLE up 3.1% and OIH up 4.5%. Natural gas also gained 2.8% on seasonal demand expectations. Goldman Sachs raised its Q4 Brent forecast to $95 per barrel from $85.",
    category: "commodities",
    tickers: ["CL=F", "BZ=F", "XLE", "OIH"],
    sentiment: "bullish",
    publishedAt: ago(18),
    author: "NFS Commodities",
  },
];

export const RISK_ALERTS: RiskAlert[] = [
  {
    id: "ra-001",
    title: "Taiwan Strait Escalation — PLA Naval Exercises",
    description: "PLA Navy has deployed carrier strike group Shandong to waters east of Taiwan. Live-fire exercises scheduled for 72 hours. TSMC supply chain disruption risk elevated. Semiconductor stocks may face 5-15% downside in escalation scenario. Recommended hedges: long VIX calls, reduce TSM/AVGO exposure.",
    severity: "critical",
    region: "Asia-Pacific",
    category: "geopolitical",
    affectedAssets: ["TSM", "AVGO", "NVDA", "ASML", "VIX"],
    publishedAt: ago(1),
    active: true,
  },
  {
    id: "ra-002",
    title: "European Sovereign Spread Widening",
    description: "French OAT-Bund spread has widened to 85bps, highest since 2017. Italian BTP spread at 210bps. Political uncertainty in France following snap election announcement. ECB monitoring situation but unlikely to activate TPI unless spreads exceed 250bps. Euro credit funds face redemption pressure.",
    severity: "high",
    region: "Europe",
    category: "credit",
    affectedAssets: ["EUR/USD", "EWQ", "EWI", "IGLT"],
    publishedAt: ago(4),
    active: true,
  },
  {
    id: "ra-003",
    title: "China Property Developer Default Wave",
    description: "Three additional Chinese property developers missed bond payments this week, bringing total defaulted offshore debt to $42B in 2024. Contagion risk to Chinese banking sector. PBOC expected to cut RRR by 50bps. Hong Kong property stocks down 8% week-over-week.",
    severity: "high",
    region: "China",
    category: "credit",
    affectedAssets: ["FXI", "KWEB", "HKD", "HSBC"],
    publishedAt: ago(6),
    active: true,
  },
  {
    id: "ra-004",
    title: "US Regional Bank Liquidity Stress",
    description: "FDIC monitoring list has expanded to 67 banks with combined assets of $108B. Commercial real estate exposure remains primary concern. Two mid-size banks reported deposit outflows exceeding 5% in Q2. KBW Regional Banking Index down 12% from May highs.",
    severity: "medium",
    region: "North America",
    category: "market",
    affectedAssets: ["KRE", "NYCB", "PNC", "ZION"],
    publishedAt: ago(10),
    active: true,
  },
  {
    id: "ra-005",
    title: "Global Ransomware Campaign Targeting Financial Institutions",
    description: "CISA issued emergency directive regarding coordinated ransomware attacks on banking infrastructure. Three major European banks reported service disruptions. SWIFT network operating normally but under enhanced monitoring. Financial sector cybersecurity spending expected to increase 25% in H2.",
    severity: "medium",
    region: "Global",
    category: "cyber",
    affectedAssets: ["XLF", "HACK", "PANW", "CRWD"],
    publishedAt: ago(15),
    active: true,
  },
];

export const RESEARCH_NOTES: ResearchNote[] = [
  {
    id: "rn-001",
    title: "AAPL — Services Flywheel Accelerates",
    abstract: "Apple's services segment is becoming the dominant earnings driver, with 25% margins and 18% YoY growth. We raise our target to $220.",
    body: "Apple Inc. continues its strategic pivot toward services, which now represent 26% of total revenue but 43% of gross profit. App Store revenue grew 16% YoY, Apple Music subscribers surpassed 110 million, and Apple TV+ content spending is yielding awards recognition and subscriber growth. The new Apple Vision Pro, while niche, opens a new spatial computing platform for developer ecosystem expansion. We model services reaching $120B in annual revenue by FY2026, implying a 45x P/E on the services segment alone is justified given the recurring nature and margin profile. Hardware replacement cycles remain stable at 4.2 years for iPhone. Greater China revenue stabilized after Huawei-driven share loss in Q1. We raise our 12-month price target to $220 from $195, reflecting a blended 30x forward P/E.",
    sector: "Technology",
    rating: "buy",
    targetPrice: 220,
    tickers: ["AAPL"],
    author: "NFS Equity Research",
    publishedAt: ago(3),
  },
  {
    id: "rn-002",
    title: "XOM — Peak Margins, Transition Risk Rising",
    abstract: "ExxonMobil faces margin compression as refining cracks normalize. ESG headwinds and capex cycle create downside risk. Downgrade to Hold.",
    body: "ExxonMobil reported Q2 EPS of $2.14, in line with estimates, but underlying trends concern us. Refining margins have declined 35% from 2023 peaks as global capacity additions (4.2M bpd through 2025) weigh on crack spreads. The Pioneer Natural Resources acquisition adds Permian scale but at a significant premium ($253/acre vs. industry average of $45K). We estimate the acquisition adds $2/boe to finding costs. Management's $20B low-carbon investment plan through 2027 is necessary for long-term positioning but dilutive to near-term returns. Dividend coverage remains comfortable at 2.3x but could compress to 1.5x if Brent falls below $65. We downgrade to HOLD from Buy with a $105 target, reflecting 11x our 2025E EPS of $9.50.",
    sector: "Energy",
    rating: "hold",
    targetPrice: 105,
    tickers: ["XOM"],
    author: "NFS Energy Research",
    publishedAt: ago(24),
  },
  {
    id: "rn-003",
    title: "AMZN — AWS Re-Acceleration Thesis Intact",
    abstract: "Amazon Web Services growth re-accelerating to 19% as enterprise AI workloads ramp. Retail margins expanding. Overweight with $210 target.",
    body: "Amazon reported Q2 revenue of $148.8B (+11% YoY) with operating income of $14.7B, nearly tripling year-ago levels. AWS revenue grew 19% to $26.3B, accelerating from 17% in Q1, driven by generative AI workloads. Management noted that AI services within AWS are on a multi-billion-dollar annualized revenue run rate, growing triple digits. North America retail margins expanded to 5.3%, up from 3.9% a year ago, reflecting efficiency gains from regionalized fulfillment. International losses narrowed to $90M from $900M. Advertising revenue grew 24% to $12.8B, now the third-largest digital ad platform globally. We raise our AWS revenue estimate for 2025 to $115B (22% growth) and increase our target to $210, reflecting 35x 2025E FCF of $55B.",
    sector: "Technology",
    rating: "overweight",
    targetPrice: 210,
    tickers: ["AMZN"],
    author: "NFS Internet Research",
    publishedAt: ago(48),
  },
  {
    id: "rn-004",
    title: "JPM — Fortress Balance Sheet in Uncertain Times",
    abstract: "JPMorgan's dominant market position and excess capital provide resilience. NII tailwinds from higher-for-longer rates. Maintain Buy, $215 target.",
    body: "JPMorgan Chase reported Q2 net income of $18.1B, or $6.12 per share, driven by record NII of $23.1B. The CET1 ratio stands at 15.3%, well above the 12.5% regulatory minimum, providing $35B in excess capital. CEO Dimon cautioned about geopolitical risks and persistent inflation, but fundamentals remain robust. Investment banking fees rose 46% as M&A and ECM activity recovered. Trading revenue of $7.8B (+12%) demonstrated continued market share gains. Credit quality remains solid with NCO rate at 0.72%, though CRE reserves were increased by $500M. We expect buybacks of $12B in H2 2024. Our $215 target reflects 12.5x our 2025E EPS of $17.20.",
    sector: "Financials",
    rating: "buy",
    targetPrice: 215,
    tickers: ["JPM"],
    author: "NFS Financials Research",
    publishedAt: ago(72),
  },
];

export function getMarketBriefs(category?: string, limit = 10): MarketBrief[] {
  let results = MARKET_BRIEFS;
  if (category) results = results.filter((b) => b.category === category);
  return results.slice(0, limit);
}

export function getRiskAlerts(severity?: string, active = true): RiskAlert[] {
  let results = RISK_ALERTS.filter((a) => a.active === active);
  if (severity) results = results.filter((a) => a.severity === severity);
  return results;
}

export function getResearchNotes(sector?: string, limit = 10): ResearchNote[] {
  let results = RESEARCH_NOTES;
  if (sector) results = results.filter((n) => n.sector.toLowerCase() === sector.toLowerCase());
  return results.slice(0, limit);
}
