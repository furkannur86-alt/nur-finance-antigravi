import type { ComponentType } from "react";

export type DataMode = "demo" | "delayed" | "live";
export type PlanTier = "free" | "pro" | "quant" | "team" | "r" | "b";

export interface PanelEntry {
  label: string;
  statusLabel: string;
  group: string;
  icon: string;
  color: string;
  desc: string;
  minPlan: PlanTier;
  dataMode: DataMode;
  adminOnly?: boolean;
  load: () => Promise<{ default: ComponentType }>;
}

export const PANELS = {
  // ── CORE ──────────────────────────────────────────────────────
  "editor": {
    label: "Editor", statusLabel: "EDITOR", group: "CORE",
    icon: "✏️", color: "#00d4aa", desc: "Code editor",
    minPlan: "free", dataMode: "live", adminOnly: false,
    load: () => import("@/components/dashboard/DashboardPanel"),
  },
  "ai-assistant": {
    label: "AI Assistant", statusLabel: "NUR AI", group: "CORE",
    icon: "🤖", color: "#00d4aa", desc: "AI-powered terminal guide and workflow assistant",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/ai/NurAIAssistant"),
  },
  "dashboard": {
    label: "Dashboard", statusLabel: "DASHBOARD", group: "CORE",
    icon: "📊", color: "#00d4aa", desc: "Live markets overview",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/dashboard/DashboardPanel"),
  },
  "portfolio": {
    label: "Portfolio", statusLabel: "PORTFOLIO", group: "CORE",
    icon: "💼", color: "#00d4aa", desc: "Positions & P&L tracker",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/portfolio/PortfolioManager"),
  },
  "charts": {
    label: "Charts", statusLabel: "CHARTS", group: "CORE",
    icon: "📈", color: "#00d4aa", desc: "Interactive price charts",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/dashboard/ChartsPanel"),
  },
  "backtest": {
    label: "Backtest", statusLabel: "BACKTEST", group: "CORE",
    icon: "⏪", color: "#00d4aa", desc: "Strategy backtesting engine",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/backtest/BacktestPanel"),
  },

  // ── MARKETS ───────────────────────────────────────────────────
  "global-markets": {
    label: "Global Markets", statusLabel: "GLOBAL MARKETS", group: "MARKETS",
    icon: "🌍", color: "#38bdf8", desc: "World indices & FX",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/markets/GlobalMarketsPanel"),
  },
  "economic-data": {
    label: "Macro", statusLabel: "ECONOMIC DATA", group: "MARKETS",
    icon: "🏦", color: "#38bdf8", desc: "FRED macroeconomic data",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/markets/EconomicDataPanel"),
  },
  "fundamentals": {
    label: "Fundamentals", statusLabel: "FUNDAMENTALS", group: "MARKETS",
    icon: "📋", color: "#38bdf8", desc: "Company financials",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/fundamentals/FundamentalsPanel"),
  },
  "screener": {
    label: "Screener", statusLabel: "SCREENER", group: "MARKETS",
    icon: "🔍", color: "#38bdf8", desc: "Stock & ETF screening",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/screener/ScreenerPanel"),
  },
  "news-feed": {
    label: "Live News", statusLabel: "LIVE NEWS", group: "MARKETS",
    icon: "📡", color: "#38bdf8", desc: "Real-time news stream",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/news/NewsFeedPanel"),
  },
  "options": {
    label: "Options", statusLabel: "OPTIONS", group: "MARKETS",
    icon: "⚙️", color: "#38bdf8", desc: "Options chain & Greeks",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/derivatives/OptionsPanel"),
  },

  // ── TRADING ───────────────────────────────────────────────────
  "oms-ems": {
    label: "OMS / EMS", statusLabel: "OMS / EMS", group: "TRADING",
    icon: "⚡", color: "#a78bfa", desc: "Order management system",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/trading/OMSEMSPanel"),
  },
  "nur-coin": {
    label: "$NUR Coin", statusLabel: "NUR COIN", group: "TRADING",
    icon: "🪙", color: "#a78bfa", desc: "Sovereign blockchain token",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/crypto/NurCoinEcosystemPanel"),
  },
  "wallet-gateway": {
    label: "Web3 Wallet", statusLabel: "WALLET GATEWAY", group: "TRADING",
    icon: "🔐", color: "#a78bfa", desc: "Multi-chain wallet gateway",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/trading/DigitalWalletGateway"),
  },

  // ── ANALYSIS ──────────────────────────────────────────────────
  "quant-copilot": {
    label: "Quant Strategist", statusLabel: "QUANT STRATEGIST", group: "ANALYSIS",
    icon: "🤖", color: "#f59e0b", desc: "AI-powered quant signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/ai/AIQuantCopilot"),
  },
  "macro-risk": {
    label: "Macro Risk", statusLabel: "MACRO RISK", group: "RISK",
    icon: "⚠️", color: "#f59e0b", desc: "Systemic risk dashboard",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/macro/MacroRiskPanel"),
  },
  "ai-tools": {
    label: "Quant Models", statusLabel: "QUANT MODELS", group: "ANALYSIS",
    icon: "🧮", color: "#f59e0b", desc: "ML & quantitative models",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/ai/AIToolsPanel"),
  },
  "geopolitics": {
    label: "NUR Earth 3D", statusLabel: "GEO INTEL", group: "ANALYSIS",
    icon: "🌐", color: "#f59e0b", desc: "3D financial intelligence globe",
    minPlan: "pro", dataMode: "live",
    load: () => import("@/components/geopolitics/NurEarth3DGlobe"),
  },
  "geophysics-resources": {
    label: "Geophysics & Mining", statusLabel: "GEOPHYSICS", group: "ANALYSIS",
    icon: "⛏️", color: "#f59e0b", desc: "3D Geophysics natural resources map",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/geophysics/GeophysicsResourcesPanel"),
  },
  "resource-intelligence": {
    label: "Resource Engine", statusLabel: "RESOURCE INTEL", group: "ANALYSIS",
    icon: "💎", color: "#f59e0b", desc: "Institutional Resource Intelligence",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/resources/ResourceIntelligencePanel"),
  },
  "institutional-suite": {
    label: "Institutional ($8.5K)", statusLabel: "INSTITUTIONAL", group: "ANALYSIS",
    icon: "🏛️", color: "#06b6d4", desc: "7-Pillar Sovereign Intelligence Matrix",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/institutional/InstitutionalSuitePanel"),
  },
  "orbital-telemetry": {
    label: "Orbital Telemetry", statusLabel: "ORBITAL TELEMETRY", group: "ANALYSIS",
    icon: "🛰️", color: "#00f0ff", desc: "Downlink & RF Spectrum Telemetry",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/OrbitalTelemetryPanel"),
  },
  "professional-ai": {
    label: "Professional AI", statusLabel: "PROFESSIONAL AI", group: "ANALYSIS",
    icon: "🩺", color: "#10b981", desc: "Medical, engineering, legal & education AI",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/professional/ProfessionalAIHubPanel"),
  },
  "wish-framework": {
    label: "W.I.S.H. Engine", statusLabel: "WISH ENGINE", group: "ANALYSIS",
    icon: "🎯", color: "#10b981", desc: "Worldview, Indicators, Setup, Discipline",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/trading/WISHFrameworkPanel"),
  },
  "data-ingest": {
    label: "Data Ingest", statusLabel: "DATA INGEST", group: "ANALYSIS",
    icon: "📥", color: "#f59e0b", desc: "Pipeline & data ingestion",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/ingest/DataIngestPanel"),
  },
  "encyclopedia": {
    label: "Wiki", statusLabel: "ENCYCLOPEDIA", group: "ANALYSIS",
    icon: "📚", color: "#f59e0b", desc: "Financial encyclopedia",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/encyclopedia/EncyclopediaPanel"),
  },
  "dark-pool-flow": {
    label: "Dark Pool Flow", statusLabel: "DARK POOL FLOW", group: "ANALYSIS",
    icon: "🌊", color: "#00c8ff", desc: "FINRA ATS dark pool volume & unusual signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/DarkPoolFlowPanel"),
  },
  "financial-health": {
    label: "Financial Health", statusLabel: "FINANCIAL HEALTH", group: "ANALYSIS",
    icon: "💊", color: "#10b981", desc: "Piotroski · Altman Z · Beneish M-Score",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/FinancialHealthPanel"),
  },
  "options-flow": {
    label: "Options Flow", statusLabel: "OPTIONS FLOW", group: "ANALYSIS",
    icon: "📊", color: "#a855f7", desc: "Unusual options activity & put/call ratio",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/OptionsFlowPanel"),
  },
  "watchlist-manager": {
    label: "Watchlists", statusLabel: "WATCHLISTS", group: "ANALYSIS",
    icon: "📌", color: "#38bdf8", desc: "Multi-list watchlist with CSV export",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/analysis/WatchlistManagerPanel"),
  },
  "risk-dashboard": {
    label: "Risk Dashboard", statusLabel: "RISK DASHBOARD", group: "RISK",
    icon: "🛡", color: "#ef4444", desc: "VaR · CVaR · Monte Carlo · Stress Tests",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/RiskDashboardPanel"),
  },
  "scatter-screener": {
    label: "Scatter Screener", statusLabel: "SCATTER SCREENER", group: "ANALYSIS",
    icon: "🔭", color: "#f59e0b", desc: "Bubble scatter: valuation vs. quality",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/ScatterScreenerPanel"),
  },
  "central-bank": {
    label: "Central Bank Monitor", statusLabel: "CENTRAL BANK", group: "ANALYSIS",
    icon: "🏛️", color: "#00e5a0", desc: "Global rates, Taylor Rule, inflation & monetary policy tracker",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CentralBankPanel"),
  },
  "fixed-income": {
    label: "Fixed Income", statusLabel: "FIXED INCOME", group: "ANALYSIS",
    icon: "🏦", color: "#00e5a0", desc: "Bond analytics, yield curves & CDS spreads",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/FixedIncomePanel"),
  },
  "sec-filings": {
    label: "SEC Edgar", statusLabel: "SEC EDGAR", group: "ANALYSIS",
    icon: "📄", color: "#00e5a0", desc: "SEC filings, insider trades, 13F, earnings & IPO calendar",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/SECFilingPanel"),
  },
  "commodity-futures": {
    label: "Commodities CCRV", statusLabel: "COMMODITY FUTURES", group: "ANALYSIS",
    icon: "🛢️", color: "#f59e0b", desc: "Forward curves, COT, seasonal & inventory",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CommodityFuturesPanel"),
  },
  "fx-cross-rate": {
    label: "FX Matrix", statusLabel: "FX CROSS RATE", group: "ANALYSIS",
    icon: "💱", color: "#38bdf8", desc: "NxN FX cross-rate matrix, carry & vol surface",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/FXCrossRatePanel"),
  },
  "correlation-matrix": {
    label: "Correlation", statusLabel: "CORRELATION", group: "ANALYSIS",
    icon: "🔥", color: "#ef4444", desc: "Asset correlation heatmap, sector treemap & regime detection",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CorrelationMatrixPanel"),
  },
  "economic-calendar": {
    label: "Eco Calendar", statusLabel: "ECO CALENDAR", group: "ANALYSIS",
    icon: "📅", color: "#f59e0b", desc: "Economic calendar, surprise index & event tracker",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/analysis/EconomicCalendarPanel"),
  },
  "data-query": {
    label: "NQL Terminal", statusLabel: "DATA QUERY", group: "ANALYSIS",
    icon: "⌨️", color: "#fbbf24", desc: "BQL-style data query language terminal",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/DataQueryTerminal"),
  },
  "etf-analytics": {
    label: "ETF Analytics", statusLabel: "ETF ANALYTICS", group: "ANALYSIS",
    icon: "📦", color: "#a855f7", desc: "ETF flows, AUM, premium/discount & screening",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/ETFAnalyticsPanel"),
  },
  "credit-analysis": {
    label: "Credit Analysis", statusLabel: "CREDIT ANALYSIS", group: "ANALYSIS",
    icon: "💳", color: "#ef4444", desc: "Ratings, spreads, distress, migration & new issuance",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CreditAnalysisPanel"),
  },
  "volatility-surface": {
    label: "Vol Surface", statusLabel: "VOL SURFACE", group: "ANALYSIS",
    icon: "🌋", color: "#a855f7", desc: "Implied vol surface, skew, term structure & Greeks",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/VolatilitySurfacePanel"),
  },
  "technical-analysis": {
    label: "Technical Scanner", statusLabel: "TECH ANALYSIS", group: "ANALYSIS",
    icon: "📐", color: "#38bdf8", desc: "RSI, MACD, patterns, S/R levels & momentum",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/TechnicalAnalysisPanel"),
  },
  "market-sentiment": {
    label: "Sentiment Engine", statusLabel: "MARKET SENTIMENT", group: "ANALYSIS",
    icon: "😱", color: "#fbbf24", desc: "Fear & Greed, social sentiment, options flow & positioning",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/MarketSentimentPanel"),
  },
  "sovereign-debt": {
    label: "Sovereign Debt", statusLabel: "SOVEREIGN DEBT", group: "ANALYSIS",
    icon: "🏳️", color: "#ef4444", desc: "Global sovereign bond yields, CDS & fiscal health",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/SovereignDebtPanel"),
  },
  "pe-and-ma": {
    label: "PE & M&A", statusLabel: "PE & M&A", group: "ANALYSIS",
    icon: "🤝", color: "#a855f7", desc: "Private equity deals, M&A pipeline & LBO analysis",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PEAndMAPanel"),
  },
  "money-market": {
    label: "Money Market", statusLabel: "MONEY MARKET", group: "ANALYSIS",
    icon: "💵", color: "#22c55e", desc: "SOFR, repo rates, commercial paper & liquidity",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/MoneyMarketPanel"),
  },
  "portfolio-attribution": {
    label: "Attribution", statusLabel: "ATTRIBUTION", group: "ANALYSIS",
    icon: "🎯", color: "#06b6d4", desc: "Portfolio performance attribution & factor decomposition",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PortfolioAttributionPanel"),
  },
  "market-microstructure": {
    label: "Microstructure", statusLabel: "MICROSTRUCTURE", group: "ANALYSIS",
    icon: "🔬", color: "#38bdf8", desc: "Order book depth, LOB analytics & market maker signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/MarketMicrostructurePanel"),
  },
  "esg-scoring": {
    label: "ESG & Climate", statusLabel: "ESG SCORING", group: "ANALYSIS",
    icon: "🌱", color: "#10b981", desc: "ESG pillar scores, carbon metrics, green bonds & controversies",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/ESGScoringPanel"),
  },
  "repo-swap": {
    label: "Repo & Swaps", statusLabel: "REPO & SWAPS", group: "ANALYSIS",
    icon: "🔄", color: "#10b981", desc: "IRS curves, repo rates, basis swaps & swap calculator",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/RepoSwapPanel"),
  },
  "trade-blotter": {
    label: "Trade Blotter", statusLabel: "TRADE BLOTTER", group: "ANALYSIS",
    icon: "📋", color: "#fbbf24", desc: "Live blotter, order entry, execution quality & algo monitor",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/TradeBlotterPanel"),
  },
  "structured-products": {
    label: "Structured", statusLabel: "STRUCTURED", group: "ANALYSIS",
    icon: "🧱", color: "#a78bfa", desc: "ABS/MBS, CLO, prepayment, structured notes & waterfall",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/StructuredProductsPanel"),
  },
  "relative-value": {
    label: "Relative Value", statusLabel: "RELATIVE VALUE", group: "ANALYSIS",
    icon: "⚖️", color: "#38bdf8", desc: "Cross-asset RV, z-scores, percentile ranks & trade signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/RelativeValuePanel"),
  },
  "fund-flow": {
    label: "Fund Flows", statusLabel: "FUND FLOWS", group: "ANALYSIS",
    icon: "🌊", color: "#06b6d4", desc: "EPFR-style global fund flow tracker by asset class",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/FundFlowPanel"),
  },
  "real-estate": {
    label: "Real Estate", statusLabel: "REAL ESTATE", group: "ANALYSIS",
    icon: "🏢", color: "#f97316", desc: "REIT analytics, cap rates, mortgage rates & CMBS monitor",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/RealEstatePanel"),
  },
  "credit-risk": {
    label: "Credit Risk", statusLabel: "CREDIT RISK", group: "RISK",
    icon: "⚠️", color: "#ef4444", desc: "CDS curves, default probability, recovery & transition matrices",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CreditRiskPanel"),
  },
  "crypto-defi": {
    label: "Crypto & DeFi", statusLabel: "CRYPTO DEFI", group: "ANALYSIS",
    icon: "🪙", color: "#e879f9", desc: "DeFi protocols, TVL, yield farming & on-chain analytics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CryptoDeFiPanel"),
  },
  "commodities": {
    label: "Commodities", statusLabel: "COMMODITIES", group: "ANALYSIS",
    icon: "🛢️", color: "#f59e0b", desc: "Bloomberg CMDTY-style commodity prices, forward curves, spreads & seasonality",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CommoditiesPanel"),
  },
  "esg-analytics": {
    label: "ESG Analytics", statusLabel: "ESG ANALYTICS", group: "ANALYSIS",
    icon: "🌱", color: "#10b981", desc: "ESG scores, screening, carbon footprint & sustainability analysis",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/ESGPanel"),
  },
  "ipo-center": {
    label: "IPO Center", statusLabel: "IPO CENTER", group: "ANALYSIS",
    icon: "🔔", color: "#a855f7", desc: "Bloomberg ECM-style IPO tracker, pipeline, pricing & performance",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/IPOPanel"),
  },
  "fx-options": {
    label: "FX Options", statusLabel: "FX OPTIONS", group: "ANALYSIS",
    icon: "💱", color: "#06b6d4", desc: "Bloomberg OVML-style vol board, surface, pricer & option flows",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/FXOptionsPanel"),
  },
  "repo-money-market": {
    label: "Repo & Money Mkt", statusLabel: "REPO/MONEY MKT", group: "ANALYSIS",
    icon: "🏧", color: "#38bdf8", desc: "Bloomberg BTMM-style repo rates, T-bills, CP & Fed reserves",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/RepoMoneyMarketPanel"),
  },
  "private-equity": {
    label: "PE & M&A", statusLabel: "PE & M&A", group: "ANALYSIS",
    icon: "🏦", color: "#a855f7", desc: "PE fund performance, M&A deals, fundraising & exit activity",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PrivateEquityPanel"),
  },
  "geopolitical-risk": {
    label: "Geopolitical Risk", statusLabel: "GEOPOLITICAL", group: "RISK",
    icon: "🌍", color: "#ef4444", desc: "GPR index, sanctions, elections, tail risk scenario analysis",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/GeopoliticalRiskPanel"),
  },
  "insurance-ils": {
    label: "ILS & Insurance", statusLabel: "ILS/INSURANCE", group: "ANALYSIS",
    icon: "🛡️", color: "#f97316", desc: "Cat bonds, ILS market, reinsurance pricing & catastrophe losses",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/InsurancePanel"),
  },

  "earnings-analysis": {
    label: "Earnings", statusLabel: "EARNINGS", group: "ANALYSIS",
    icon: "📊", color: "#22c55e", desc: "EPS estimates, revisions, calendar & history",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/EarningsAnalysisPanel"),
  },
  "insider-trading": {
    label: "Insider Trading", statusLabel: "INSIDER TRADING", group: "ANALYSIS",
    icon: "🕵️", color: "#ef4444", desc: "SEC Form 4 filings, cluster detection & sector stats",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/InsiderTradingPanel"),
  },
  "supply-chain": {
    label: "Supply Chain", statusLabel: "SUPPLY CHAIN", group: "ANALYSIS",
    icon: "🔗", color: "#06b6d4", desc: "SPLC-style supply chain intelligence & disruptions",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/SupplyChainPanel"),
  },
  "alternative-data": {
    label: "Alt Data", statusLabel: "ALT DATA", group: "ANALYSIS",
    icon: "🛰️", color: "#a855f7", desc: "Satellite, web traffic, app, social & credit card signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/AlternativeDataPanel"),
  },
  "index-builder": {
    label: "Index Builder", statusLabel: "INDEX BUILDER", group: "ANALYSIS",
    icon: "🏗️", color: "#fbbf24", desc: "Custom index construction, backtesting & MEMB analytics",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/IndexBuilderPanel"),
  },
  "asset-allocation": {
    label: "Asset Allocation", statusLabel: "ASSET ALLOC", group: "ANALYSIS",
    icon: "🎯", color: "#06b6d4", desc: "PORT-style multi-asset allocation & optimizer",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/AssetAllocationPanel"),
  },
  "trade-ideas": {
    label: "Trade Ideas", statusLabel: "TRADE IDEAS", group: "ANALYSIS",
    icon: "💡", color: "#fbbf24", desc: "IDEA-style systematic trade idea generator",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/TradeIdeaPanel"),
  },
  "private-credit": {
    label: "Private Credit", statusLabel: "PRIVATE CREDIT", group: "ANALYSIS",
    icon: "🏦", color: "#a855f7", desc: "Direct lending pipeline, portfolio & market analytics",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PrivateCreditPanel"),
  },
  "convertible-bonds": {
    label: "Convertibles", statusLabel: "CONVERTIBLES", group: "ANALYSIS",
    icon: "🔀", color: "#06b6d4", desc: "CNVT-style convertible bond analytics & greeks",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/ConvertibleBondPanel"),
  },
  "municipal-bonds": {
    label: "Muni Bonds", statusLabel: "MUNI BONDS", group: "ANALYSIS",
    icon: "🏛️", color: "#22c55e", desc: "Municipal bond market, tax-equivalent yields & curves",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/MunicipalBondPanel"),
  },

  "ai-trading-agent": {
    label: "AI Trading Agent", statusLabel: "AI TRADING", group: "ANALYSIS",
    icon: "🤖", color: "#00e5a0", desc: "Vibe-Trading style multi-agent AI trading system",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/AITradingAgentPanel"),
  },
  "data-platform": {
    label: "Data Platform", statusLabel: "DATA PLATFORM", group: "ANALYSIS",
    icon: "🔌", color: "#38bdf8", desc: "OpenBB-style data provider hub & pipeline manager",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/DataPlatformPanel"),
  },
  "quant-lab": {
    label: "Quant Lab", statusLabel: "QUANT LAB", group: "ANALYSIS",
    icon: "🧪", color: "#a855f7", desc: "QuantLib-style derivatives pricer, yield curves & risk models",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/QuantLabPanel"),
  },
  "ai-news-terminal": {
    label: "AI News", statusLabel: "AI NEWS", group: "ANALYSIS",
    icon: "📡", color: "#fbbf24", desc: "ASKB-style AI-curated news, research briefs & smart alerts",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/AINewsTerminalPanel"),
  },
  "portfolio-intelligence": {
    label: "Portfolio Intel", statusLabel: "PORT INTEL", group: "ANALYSIS",
    icon: "🧠", color: "#06b6d4", desc: "AI portfolio insights, scenario analysis & optimization",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PortfolioIntelligencePanel"),
  },
  "market-regime": {
    label: "Market Regime", statusLabel: "MARKET REGIME", group: "ANALYSIS",
    icon: "🔄", color: "#22c55e", desc: "Regime detection, signal history & strategy playbook",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/MarketRegimePanel"),
  },
  "shipping-freight": {
    label: "Shipping & Freight", statusLabel: "SHIPPING/FREIGHT", group: "ANALYSIS",
    icon: "🚢", color: "#06b6d4", desc: "Baltic indices, tanker/container rates, trade routes & port congestion",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/ShippingFreightPanel"),
  },
  "volatility-lab": {
    label: "Volatility Lab", statusLabel: "VOL LAB", group: "ANALYSIS",
    icon: "📈", color: "#ef4444", desc: "VIX term structure, vol surface, skew analytics & variance risk premium",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/VolatilitySurfacePanel"),
  },
  "trade-finance": {
    label: "Trade Finance", statusLabel: "TRADE FINANCE", group: "ANALYSIS",
    icon: "📦", color: "#10b981", desc: "L/C pricing, supply chain finance, factoring & trade corridors",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/TradeFinancePanel"),
  },
  "emerging-markets": {
    label: "Emerging Markets", statusLabel: "EM MARKETS", group: "ANALYSIS",
    icon: "🌏", color: "#a855f7", desc: "EM sovereign spreads, FX, capital flows & carry trade monitor",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/EmergingMarketsPanel"),
  },
  "carbon-emissions": {
    label: "Carbon & Emissions", statusLabel: "CARBON/ETS", group: "ANALYSIS",
    icon: "🌱", color: "#22c55e", desc: "EU ETS, voluntary carbon market, offsets & regulation tracker",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CarbonEmissionsPanel"),
  },
  "agriculture": {
    label: "Agriculture", statusLabel: "AGRICULTURE", group: "ANALYSIS",
    icon: "🌾", color: "#eab308", desc: "Crop prices, USDA WASDE, weather impact & global trade flows",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/AgriculturePanel"),
  },
  "distressed-debt": {
    label: "Distressed Debt", statusLabel: "DISTRESSED DEBT", group: "ANALYSIS",
    icon: "💀", color: "#ef4444", desc: "Bond watchlist, bankruptcies, recovery rates & CDS spreads",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/DistressedDebtPanel"),
  },
  "wealth-management": {
    label: "Wealth Management", statusLabel: "WEALTH MGMT", group: "ANALYSIS",
    icon: "💎", color: "#fbbf24", desc: "Client portfolios, model allocation, tax-loss harvesting & estate planning",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/WealthManagementPanel"),
  },
  "infrastructure": {
    label: "Infrastructure", statusLabel: "INFRASTRUCTURE", group: "ANALYSIS",
    icon: "🏗️", color: "#38bdf8", desc: "Infra funds, mega-projects, PPP deals & energy transition",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/InfrastructurePanel"),
  },
  "energy-trading": {
    label: "Energy Trading", statusLabel: "ENERGY TRADING", group: "ANALYSIS",
    icon: "⚡", color: "#f97316", desc: "Power markets, natural gas, LNG terminals & renewable certificates",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/EnergyTradingPanel"),
  },
  "securitization": {
    label: "Securitization", statusLabel: "SECURITIZATION", group: "ANALYSIS",
    icon: "📦", color: "#38bdf8", desc: "CLO tranches, ABS sectors, agency MBS & new issuance pipeline",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/SecuritizationPanel"),
  },
  "precious-metals": {
    label: "Precious Metals", statusLabel: "PRECIOUS METALS", group: "ANALYSIS",
    icon: "🥇", color: "#eab308", desc: "Gold/silver/platinum spot & futures, physical premiums, miners & ETF flows",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PreciousMetalsPanel"),
  },
  "macro-dashboard": {
    label: "Macro Dashboard", statusLabel: "MACRO", group: "ANALYSIS",
    icon: "🌍", color: "#a855f7", desc: "Global GDP forecasts, economic indicators, trade balances & labor market",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/MacroDashboardPanel"),
  },
  "hedge-fund-monitor": {
    label: "Hedge Fund Monitor", statusLabel: "HEDGE FUNDS", group: "ANALYSIS",
    icon: "🦈", color: "#a855f7", desc: "Top funds by AUM, strategy performance, 13F filings & HFRI indices",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/HedgeFundMonitorPanel"),
  },
  "derivatives-swaps": {
    label: "Derivatives & Swaps", statusLabel: "DERIVATIVES", group: "ANALYSIS",
    icon: "🔄", color: "#ef4444", desc: "IRS curves, CDS indices, swaption vol surface & structured products",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/DerivativesSwapsPanel"),
  },
  "cross-asset-correlation": {
    label: "Cross-Asset Correlation", statusLabel: "CORRELATION", group: "ANALYSIS",
    icon: "🔗", color: "#38bdf8", desc: "Correlation matrix, rolling windows, regime analysis & trading signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CrossAssetCorrelationPanel"),
  },

  "yield-curve": {
    label: "Yield Curve", statusLabel: "YIELD CURVE", group: "ANALYSIS",
    icon: "📐", color: "#38bdf8", desc: "Treasury yield curves, global spreads, history & implied forwards",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/YieldCurvePanel"),
  },
  "blockchain-analytics": {
    label: "Blockchain Analytics", statusLabel: "BLOCKCHAIN", group: "ANALYSIS",
    icon: "⛓️", color: "#38bdf8", desc: "On-chain metrics, DeFi TVL, whale alerts & NFT market",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/BlockchainAnalyticsPanel"),
  },
  "factor-investing": {
    label: "Factor Investing", statusLabel: "FACTORS", group: "ANALYSIS",
    icon: "🧮", color: "#38bdf8", desc: "MSCI Barra factor performance, exposure, backtest & signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/FactorInvestingPanel"),
  },
  "securities-lending": {
    label: "Securities Lending", statusLabel: "SEC LENDING", group: "ANALYSIS",
    icon: "🔄", color: "#38bdf8", desc: "Lendable inventory, borrow rates, short interest & recalls",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/SecuritiesLendingPanel"),
  },
  "weather-derivatives": {
    label: "Weather Derivatives", statusLabel: "WEATHER", group: "ANALYSIS",
    icon: "🌦️", color: "#38bdf8", desc: "HDD/CDD contracts, temperature forecasts & weather hedging",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/WeatherDerivativesPanel"),
  },
  "pension-fund": {
    label: "Pension Fund Analytics", statusLabel: "PENSION", group: "ANALYSIS",
    icon: "🏛️", color: "#38bdf8", desc: "Funded status, liability structure, allocation & stress tests",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PensionFundPanel"),
  },
  "regulatory-compliance": {
    label: "Regulatory Compliance", statusLabel: "COMPLIANCE", group: "ANALYSIS",
    icon: "⚖️", color: "#38bdf8", desc: "MiFID II, Dodd-Frank, Basel III compliance dashboard & alerts",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/RegulatoryCompliancePanel"),
  },

  // ── MEDIA & NFS ───────────────────────────────────────────────
  "live-tv": {
    label: "NUR TV", statusLabel: "NUR TV LIVE", group: "MEDIA",
    icon: "📺", color: "#e879f9", desc: "24/7 broadcast channel",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/media/LiveBroadcast"),
  },
  "broadcast-studio": {
    label: "Studio", statusLabel: "BROADCAST STUDIO", group: "MEDIA",
    icon: "🎬", color: "#e879f9", desc: "AI video production studio",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/media/BroadcastStudioPanel"),
  },
  "terminal": {
    label: "NUR Terminal", statusLabel: "NFS TERMINAL", group: "MEDIA",
    icon: "💻", color: "#e879f9", desc: "Sovereign CLI terminal",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/terminal/NURTerminalPanel"),
  },
  "news": {
    label: "Briefs", statusLabel: "NFS BRIEFS", group: "MEDIA",
    icon: "📰", color: "#e879f9", desc: "Market intelligence briefs",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/nfs/MarketBriefsPanel"),
  },
  "alerts": {
    label: "Alerts", statusLabel: "NFS ALERTS", group: "MEDIA",
    icon: "🔔", color: "#e879f9", desc: "HUD risk alert system",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/nfs/RiskAlertsPanel"),
  },
  "research": {
    label: "Research", statusLabel: "NFS RESEARCH", group: "MEDIA",
    icon: "🔬", color: "#e879f9", desc: "Deep-dive research reports",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/nfs/ResearchPanel"),
  },
  "media": {
    label: "NFS Media", statusLabel: "NFS MEDIA", group: "MEDIA",
    icon: "🎥", color: "#e879f9", desc: "Media production hub",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/media/MediaPanel"),
  },
  "pricing": {
    label: "Plans", statusLabel: "PLANS", group: "MEDIA",
    icon: "💎", color: "#e879f9", desc: "Subscription tiers",
    minPlan: "free", dataMode: "live",
    load: () => import("@/components/pricing/PricingPanel"),
  },
  "verification-portal": {
    label: "VIP Verify", statusLabel: "VERIFICATION", group: "MEDIA",
    icon: "✅", color: "#e879f9", desc: "On-chain payment verify",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/pricing/VerificationPanel"),
  },

  // ── SOCIAL / EDUCATION ────────────────────────────────────────
  "professional-social": {
    label: "Sovereign Social", statusLabel: "SOVEREIGN SOCIAL", group: "SOCIAL",
    icon: "👥", color: "#a855f7", desc: "Closed-loop professional financial network",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/social/FinancialSocialPanel"),
  },
  "user-profile": {
    label: "User Profile", statusLabel: "USER PROFILE", group: "SOCIAL",
    icon: "👤", color: "#a855f7", desc: "Sovereign identity & credentials",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/social/UserProfilePanel"),
  },
  "profession-hub": {
    label: "Profession Hub", statusLabel: "PROFESSION HUB", group: "SOCIAL",
    icon: "🌐", color: "#a855f7", desc: "Cross-disciplinary verification hub",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/social/ProfessionHubPanel"),
  },
  "nur-education": {
    label: "Education", statusLabel: "NUR EDUCATION", group: "SOCIAL",
    icon: "🎓", color: "#34d399", desc: "Financial education hub",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/education/NurEducationPanel"),
  },
  "nur-kids": {
    label: "Nur Kids", statusLabel: "NUR KIDS", group: "SOCIAL",
    icon: "👨‍👩‍👧", color: "#34d399", desc: "Family finance platform",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/kids/NurKidsPanel"),
  },
  "compute-access": {
    label: "Free Access", statusLabel: "COMPUTE ACCESS", group: "SOCIAL",
    icon: "⛏️", color: "#34d399", desc: "Compute-for-access mining",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/compute/ComputeForAccessPanel"),
  },

  // ── GALACTIC ──────────────────────────────────────────────────
  "galactic-fleet": {
    label: "Galactic Fleet", statusLabel: "GALACTIC FLEET", group: "GALACTIC",
    icon: "🚀", color: "#2E8B57", desc: "3D C4ISR Globe & 36 Ships",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/GalacticFleetPanel"),
  },
  "orbital-command": {
    label: "Orbital Command", statusLabel: "ORBITAL COMMAND", group: "GALACTIC",
    icon: "🛸", color: "#eab308", desc: "Starship Cockpit & Bridge",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/OrbitalCommandPanel"),
  },
  "civilization-terminals": {
    label: "Civilization Terminals", statusLabel: "CIVILIZATION TERMINALS", group: "GALACTIC",
    icon: "🏛️", color: "#00f0ff", desc: "18 Civilization panels & Warp Cockpit",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/CivilizationTerminalPanel"),
  },
  "civilization-arbitrage": {
    label: "Fleet Arbitrage & OMS", statusLabel: "CIVILIZATION ARBITRAGE", group: "GALACTIC",
    icon: "⚡", color: "#10b981", desc: "Cross-currency & high-frequency trading",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/trading/CivilizationArbitrageEngine"),
  },
  "master-fleet-mining": {
    label: "Master Fleet Mining", statusLabel: "MASTER FLEET MINING", group: "GALACTIC",
    icon: "⛏️", color: "#f59e0b", desc: "36-ship crypto mining & treasury pool",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/MasterFleetMiningAdminPanel"),
  },
  "fleet-miner": {
    label: "Fleet Miner", statusLabel: "FLEET MINER", group: "GALACTIC",
    icon: "⛏", color: "#00e5ff", desc: "Browser & Python mining bot",
    minPlan: "free", dataMode: "demo",
    load: () => import("@/components/mining/FleetMinerPanel"),
  },

  // ── SOVEREIGN (admin only) ────────────────────────────────────
  "umay-master": {
    label: "Umay Master Terminal", statusLabel: "UMAY MASTER", group: "SOVEREIGN",
    icon: "👑", color: "#ffd700", desc: "Root sovereign fleet bridge",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/umay/UmayMasterTerminalPanel"),
  },
  "umay-boss": {
    label: "Umay Gül Nur", statusLabel: "UMAY GÜL NUR", group: "SOVEREIGN",
    icon: "👑", color: "#fbbf24", desc: "Sovereign boss terminal",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/umay/UmayBossTerminal"),
  },
  "holding-ecosystem": {
    label: "7 Growth Arms", statusLabel: "7 GROWTH ARMS", group: "SOVEREIGN",
    icon: "🏛️", color: "#fbbf24", desc: "Holding ecosystem panel",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/holding/HoldingEcosystemPanel"),
  },
  "tatar-finans": {
    label: "Tatar Finance", statusLabel: "TATAR FINANCE", group: "SOVEREIGN",
    icon: "🛡️", color: "#fbbf24", desc: "Tatar financial network",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/tatar/TatarFinansPanel"),
  },

  // ── FIXED INCOME & RATES ────────────────────────────────────
  "treasury-auctions": {
    label: "Treasury Auctions", statusLabel: "AUCTIONS", group: "ANALYSIS",
    icon: "🏛️", color: "#38bdf8", desc: "Government bond auction schedule, results & demand",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/TreasuryAuctionPanel"),
  },
  "credit-default-swaps": {
    label: "Credit Default Swaps", statusLabel: "CDS", group: "ANALYSIS",
    icon: "🛡️", color: "#ef4444", desc: "CDS indices, single-name spreads & credit events",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CreditDefaultSwapPanel"),
  },

  // ── EQUITY & CORPORATE ──────────────────────────────────────
  "merger-arbitrage": {
    label: "Merger Arbitrage", statusLabel: "M&A ARB", group: "ANALYSIS",
    icon: "🔀", color: "#a855f7", desc: "M&A deal spreads, timelines & break risk analysis",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/MergerArbitragePanel"),
  },
  "dividend-analysis": {
    label: "Dividend Analysis", statusLabel: "DIVIDENDS", group: "ANALYSIS",
    icon: "💰", color: "#22c55e", desc: "Dividend calendar, aristocrats, estimates & screens",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/DividendAnalysisPanel"),
  },
  "short-interest": {
    label: "Short Interest", statusLabel: "SHORT INT", group: "ANALYSIS",
    icon: "📉", color: "#ef4444", desc: "Short interest, squeeze signals & borrow rates",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/ShortInterestPanel"),
  },

  // ── FX ──────────────────────────────────────────────────────
  "fx-carry-trade": {
    label: "FX Carry Trade", statusLabel: "FX CARRY", group: "ANALYSIS",
    icon: "💱", color: "#00e5a0", desc: "FX carry trade opportunities, NDF pricing & risk",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/FXCarryTradePanel"),
  },
  "clo-analytics": {
    label: "CLO Analytics", statusLabel: "CLO ANALYTICS", group: "ANALYSIS",
    icon: "📊", color: "#6366f1", desc: "Collateralized loan obligation tranches, waterfall & stress tests",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CLOAnalyticsPanel"),
  },
  "central-counterparty": {
    label: "Central Counterparty", statusLabel: "CCP CLEARING", group: "TRADING",
    icon: "🏛", color: "#8b5cf6", desc: "CCP margin, default fund & clearing member exposure",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CentralCounterpartyPanel"),
  },
  "commodity-options": {
    label: "Commodity Options", statusLabel: "COMMODITY OPTIONS", group: "MARKETS",
    icon: "🛢", color: "#f59e0b", desc: "Commodity option chains, vol surface & Greeks",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CommodityOptionsPanel"),
  },
  "ir-swap-curve": {
    label: "IR Swap Curve", statusLabel: "IR SWAP CURVE", group: "ANALYSIS",
    icon: "📈", color: "#14b8a6", desc: "Interest rate swap curves, basis spreads & forward rates",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/IRSwapCurvePanel"),
  },
  "sovereign-wealth-fund": {
    label: "Sovereign Wealth Fund", statusLabel: "SOVEREIGN WEALTH", group: "SOVEREIGN",
    icon: "🏦", color: "#eab308", desc: "Sovereign wealth fund holdings, allocations & mandate tracking",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/SovereignWealthFundPanel"),
  },
  "systematic-strategy": {
    label: "Systematic Strategy", statusLabel: "SYSTEMATIC STRATEGY", group: "TRADING",
    icon: "🤖", color: "#ec4899", desc: "Systematic & quantitative strategy backtesting framework",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/SystematicStrategyPanel"),
  },
  "tax-optimization": {
    label: "Tax Optimization", statusLabel: "TAX OPTIMIZATION", group: "ANALYSIS",
    icon: "📋", color: "#84cc16", desc: "Tax-loss harvesting, wash sale tracking & optimization",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/TaxOptimizationPanel"),
  },
  "venture-capital": {
    label: "Venture Capital", statusLabel: "VENTURE CAPITAL", group: "ANALYSIS",
    icon: "🚀", color: "#f97316", desc: "VC deal flow, portfolio company metrics & fund performance",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/VentureCapitalPanel"),
  },
  "carbon-credit": {
    label: "Carbon Credits", statusLabel: "CARBON CREDITS", group: "MARKETS",
    icon: "🌱", color: "#22c55e", desc: "EU ETS, voluntary carbon markets, compliance & project analytics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CarbonCreditPanel"),
  },
  "insurance-linked": {
    label: "Insurance-Linked Securities", statusLabel: "ILS / CAT BONDS", group: "ANALYSIS",
    icon: "🌪", color: "#ef4444", desc: "Cat bonds, ILS market, peril analysis & reinsurance metrics",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/InsuranceLinkedPanel"),
  },
  "mortgage-backed": {
    label: "MBS Analytics", statusLabel: "MBS / RMBS / CMBS", group: "ANALYSIS",
    icon: "🏠", color: "#6366f1", desc: "Agency MBS pools, prepayment models, non-agency RMBS/CMBS & TBA market",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/MortgageBackedPanel"),
  },
  "inflation-trading": {
    label: "Inflation Trading", statusLabel: "INFLATION / TIPS", group: "TRADING",
    icon: "📈", color: "#f97316", desc: "Breakeven rates, TIPS analytics, inflation swaps & global CPI dashboard",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/InflationTradingPanel"),
  },
  "leveraged-finance": {
    label: "Leveraged Finance", statusLabel: "LEVERAGED FINANCE", group: "MARKETS",
    icon: "🏗️", color: "#a855f7", desc: "Leveraged loans, high yield bonds, new issue pipeline & distressed debt",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/LeveragedFinancePanel"),
  },
  "country-risk": {
    label: "Country Risk", statusLabel: "COUNTRY RISK", group: "RISK",
    icon: "🌍", color: "#ef4444", desc: "Sovereign credit, macro indicators, political risk & contagion analysis",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CountryRiskPanel"),
  },
  "crypto-derivatives": {
    label: "Crypto Derivatives", statusLabel: "CRYPTO DERIVATIVES", group: "TRADING",
    icon: "₿", color: "#f7931a", desc: "Crypto futures, options, perpetual swaps & on-chain analytics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CryptoDerivativesPanel"),
  },
  "fx-volatility": {
    label: "FX Volatility", statusLabel: "FX VOLATILITY", group: "TRADING",
    icon: "💱", color: "#38bdf8", desc: "FX implied vol surface, risk reversals, options strategies & EM vol",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/FXVolatilityPanel"),
  },
  "asian-markets": {
    label: "Asian Markets", statusLabel: "ASIAN MARKETS", group: "MARKETS",
    icon: "🏯", color: "#ef4444", desc: "Asia-Pacific equities, bonds, FX rates & foreign fund flows",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/AsianMarketsPanel"),
  },
  "green-bond": {
    label: "Green / ESG Bonds", statusLabel: "GREEN / ESG BONDS", group: "MARKETS",
    icon: "🌿", color: "#22c55e", desc: "Green bond issuance, EU taxonomy, impact metrics & greenium analysis",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/GreenBondPanel"),
  },
  "latam-markets": {
    label: "Latin America", statusLabel: "LATAM MARKETS", group: "MARKETS",
    icon: "🌎", color: "#f97316", desc: "LatAm equities, rates, FX & commodity exposure",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/LatAmMarketsPanel"),
  },
  "quantitative-models": {
    label: "Quantitative Models", statusLabel: "QUANT MODELS", group: "ANALYSIS",
    icon: "🧮", color: "#6366f1", desc: "Option pricing models, risk decomposition, backtesting & live signals",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/QuantitativeModelsPanel"),
  },
  "global-macro": {
    label: "Global Macro Strategy", statusLabel: "GLOBAL MACRO", group: "ANALYSIS",
    icon: "🌐", color: "#38bdf8", desc: "Macro scorecard, cross-asset performance, themes & trade ideas",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/GlobalMacroPanel"),
  },
  "portfolio-construction": {
    label: "Portfolio Construction", statusLabel: "PORTFOLIO CONSTRUCTION", group: "ANALYSIS",
    icon: "📊", color: "#6366f1", desc: "Asset allocation, mean-variance optimization, rebalancing & analytics",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/PortfolioConstructionPanel"),
  },
  "repo-markets": {
    label: "Repo Markets", statusLabel: "REPO / SECURED FINANCE", group: "MARKETS",
    icon: "🔄", color: "#a855f7", desc: "Repo rates, triparty collateral, securities lending & funding markets",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/RepoMarketsPanel"),
  },
  "algorithmic-trading": {
    label: "Algorithmic Trading", statusLabel: "ALGO TRADING", group: "TRADING",
    icon: "🤖", color: "#22c55e", desc: "Algo strategies, execution analytics, smart order routing & latency metrics",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/AlgorithmicTradingPanel"),
  },
  "central-clearing": {
    label: "Central Clearing", statusLabel: "CCP / CLEARING", group: "TRADING",
    icon: "🏛️", color: "#fbbf24", desc: "CCP margins, clearing volumes, default fund & counterparty risk",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CentralClearingPanel"),
  },
  "commodities-trading": {
    label: "Commodities Trading", statusLabel: "COMMODITIES TRADING", group: "TRADING",
    icon: "🛢️", color: "#f97316", desc: "Energy, metals, agriculture — futures curves, spreads & physical markets",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/CommoditiesTradingPanel"),
  },
  "sovereign-debt-auctions": {
    label: "Sovereign Debt Auctions", statusLabel: "SOVEREIGN AUCTIONS", group: "SOVEREIGN",
    icon: "🏦", color: "#38bdf8", desc: "Government bond auctions, bid-to-cover ratios, tail & issuance calendar",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/analysis/SovereignDebtAuctionsPanel"),
  },
  "credit-portfolio": {
    label: "Credit Portfolio", statusLabel: "CREDIT PORTFOLIO", group: "ANALYSIS",
    icon: "💳", color: "#ec4899", desc: "Credit portfolio analytics, migration matrices, default probabilities & recovery",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/analysis/CreditPortfolioPanel"),
  },
  // ── NEW BATCH: MARKETS / TRADING / SOVEREIGN / MEDIA / SOCIAL ──
  "etf-flows": {
    label: "ETF Flows & Analytics", statusLabel: "ETF FLOWS", group: "MARKETS",
    icon: "📈", color: "#06b6d4", desc: "ETF fund flows, creation/redemption, premium/discount & sector rotation",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/markets/ETFFlowsPanel"),
  },
  "dark-pool": {
    label: "Dark Pool Monitor", statusLabel: "DARK POOLS", group: "TRADING",
    icon: "🌑", color: "#8b5cf6", desc: "Dark pool prints, block trades, ATS volume & short volume analysis",
    minPlan: "quant", dataMode: "demo",
    load: () => import("@/components/trading/DarkPoolPanel"),
  },
  "financial-news-wire": {
    label: "Financial News Wire", statusLabel: "NEWS WIRE", group: "MEDIA",
    icon: "📰", color: "#f59e0b", desc: "Real-time financial news feed, breaking alerts, sector headlines & sentiment",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/media/FinancialNewsWirePanel"),
  },
  "social-sentiment": {
    label: "Social Sentiment", statusLabel: "SOCIAL SENT", group: "SOCIAL",
    icon: "💬", color: "#06b6d4", desc: "Social media sentiment analysis, trending tickers, Reddit/X mentions & viral alerts",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/social/SocialSentimentPanel"),
  },
  "institutional-ownership": {
    label: "Institutional Ownership", statusLabel: "INST OWN", group: "MARKETS",
    icon: "🏛️", color: "#8b5cf6", desc: "13F filings, institutional holders, activist positions & insider transactions",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/markets/InstitutionalOwnershipPanel"),
  },
  "forex-monitor": {
    label: "FX Monitor", statusLabel: "FX MONITOR", group: "TRADING",
    icon: "💱", color: "#22c55e", desc: "Major & EM currency pairs, cross rates, central bank watch & carry trade monitor",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/trading/ForexMonitorPanel"),
  },
  "earnings-calendar": {
    label: "Earnings Calendar", statusLabel: "EARNINGS", group: "MARKETS",
    icon: "📅", color: "#f97316", desc: "Upcoming earnings, estimates consensus, surprise history & guidance tracker",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/markets/EarningsCalendarPanel"),
  },
  "climate-risk": {
    label: "Climate Risk", statusLabel: "CLIMATE", group: "RISK",
    icon: "🌡️", color: "#10b981", desc: "Climate risk scores, carbon exposure, transition risk & physical risk metrics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/sovereign/ClimateRiskPanel"),
  },
  "podcast-research": {
    label: "Podcast & Research", statusLabel: "PODCAST", group: "MEDIA",
    icon: "🎙️", color: "#a855f7", desc: "Financial podcasts, research notes, analyst calls & transcript search",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/media/PodcastResearchPanel"),
  },
  "space-weather": {
    label: "Space Weather", statusLabel: "SPACE WX", group: "GALACTIC",
    icon: "☀️", color: "#f59e0b", desc: "Solar flare alerts, geomagnetic storms, satellite risk & space debris tracking",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/orbital/SpaceWeatherPanel"),
  },
  "asteroid-mining": {
    label: "Asteroid Mining", statusLabel: "ASTEROID", group: "GALACTIC",
    icon: "☄️", color: "#8b5cf6", desc: "Near-earth object valuations, mining feasibility scores & resource extraction estimates",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/orbital/AsteroidMiningPanel"),
  },
  "system-health": {
    label: "System Health", statusLabel: "SYS HEALTH", group: "CORE",
    icon: "🖥️", color: "#06b6d4", desc: "Platform uptime, API latency, data feed status & system diagnostics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/dashboard/SystemHealthPanel"),
  },
  "user-permissions": {
    label: "User Permissions", statusLabel: "PERMISSIONS", group: "CORE",
    icon: "🔐", color: "#ef4444", desc: "Role-based access control, team management, audit logs & compliance settings",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/dashboard/UserPermissionsPanel"),
  },
  "influencer-tracker": {
    label: "Influencer Tracker", statusLabel: "INFLUENCER", group: "SOCIAL",
    icon: "👤", color: "#ec4899", desc: "Top fintwit accounts, prediction accuracy scores, following changes & call tracking",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/social/InfluencerTrackerPanel"),
  },
  "prime-brokerage": {
    label: "Prime Brokerage", statusLabel: "PRIME BROK", group: "TRADING",
    icon: "🏦", color: "#0ea5e9", desc: "Margin balances, securities lending, locate availability & financing rates",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/trading/PrimeBrokeragePanel"),
  },
  // ── NEW RISK PANELS ──────────────────────────────────────────
  "financial-risk": {
    label: "Financial Risk", statusLabel: "FIN RISK", group: "RISK",
    icon: "💰", color: "#ef4444", desc: "Systemic risk indicators, contagion maps, liquidity stress & financial stability metrics",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/risk/FinancialRiskPanel"),
  },
  "cyber-risk": {
    label: "Cyber Risk", statusLabel: "CYBER", group: "RISK",
    icon: "🔒", color: "#ef4444", desc: "Cyber threat intelligence, breach tracking, ransomware activity & infrastructure vulnerability",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/risk/CyberRiskPanel"),
  },
  "nuclear-risk": {
    label: "Nuclear Risk", statusLabel: "NUCLEAR", group: "RISK",
    icon: "☢️", color: "#ef4444", desc: "Nuclear threat levels, reactor incidents, proliferation tracking & fallout modeling",
    minPlan: "r", dataMode: "demo",
    load: () => import("@/components/risk/NuclearRiskPanel"),
  },
  "military-risk": {
    label: "Military Risk", statusLabel: "MILITARY", group: "RISK",
    icon: "🎖️", color: "#ef4444", desc: "Global conflict zones, troop movements, defense spending & arms trade flows",
    minPlan: "r", dataMode: "demo",
    load: () => import("@/components/risk/MilitaryRiskPanel"),
  },
  "galactic-risk": {
    label: "Galactic Risk", statusLabel: "GALACTIC RISK", group: "RISK",
    icon: "☄️", color: "#ef4444", desc: "NASA NEO data, asteroid close approaches, solar storm impact & space debris threat levels",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/risk/GalacticRiskPanel"),
  },
  "political-risk": {
    label: "Political Risk", statusLabel: "POLITICAL", group: "RISK",
    icon: "🏛️", color: "#ef4444", desc: "Election risk, regime stability, sanctions tracking, policy change impact & sovereign default probability",
    minPlan: "pro", dataMode: "demo",
    load: () => import("@/components/risk/PoliticalRiskPanel"),
  },
} as const satisfies Record<string, PanelEntry>;

export type PanelView = keyof typeof PANELS;

export const GROUP_ORDER = ["CORE", "MARKETS", "TRADING", "ANALYSIS", "RISK", "MEDIA", "SOCIAL", "GALACTIC", "SOVEREIGN"] as const;

export function getPanelsByGroup(filterAdmin: boolean = false) {
  const entries = Object.entries(PANELS) as [PanelView, PanelEntry][];
  return GROUP_ORDER.map((group) => ({
    group,
    panels: entries
      .filter(([, p]) => p.group === group && (!filterAdmin || !p.adminOnly))
      .map(([id, panel]) => ({ id, ...panel })),
  })).filter((g) => g.panels.length > 0);
}

export function getStatusLabel(view: PanelView): string {
  return PANELS[view]?.statusLabel ?? view.toUpperCase();
}
