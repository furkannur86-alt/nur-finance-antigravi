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
    label: "Macro Risk", statusLabel: "MACRO RISK", group: "ANALYSIS",
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
    icon: "🌐", color: "#f59e0b", desc: "Geopolitical risk globe",
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
    label: "Risk Dashboard", statusLabel: "RISK DASHBOARD", group: "ANALYSIS",
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
    label: "Credit Risk", statusLabel: "CREDIT RISK", group: "ANALYSIS",
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
    label: "Geopolitical Risk", statusLabel: "GEOPOLITICAL", group: "ANALYSIS",
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
    label: "Medeniyet Panelleri", statusLabel: "CIVILIZATION TERMINALS", group: "GALACTIC",
    icon: "🏛️", color: "#00f0ff", desc: "18 Medeniyet & Warp Kokpiti",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/CivilizationTerminalPanel"),
  },
  "civilization-arbitrage": {
    label: "Filo Arbitraj & OMS", statusLabel: "CIVILIZATION ARBITRAGE", group: "GALACTIC",
    icon: "⚡", color: "#10b981", desc: "Çapraz Kur & Yüksek Frekans",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/trading/CivilizationArbitrageEngine"),
  },
  "master-fleet-mining": {
    label: "Master Filo Mining", statusLabel: "MASTER FLEET MINING", group: "GALACTIC",
    icon: "⛏️", color: "#f59e0b", desc: "36 Gemi Kripto & Hazine Havuzu",
    minPlan: "team", dataMode: "demo",
    load: () => import("@/components/orbital/MasterFleetMiningAdminPanel"),
  },
  "fleet-miner": {
    label: "Fleet Miner", statusLabel: "FLEET MINER", group: "GALACTIC",
    icon: "⛏", color: "#00e5ff", desc: "Tarayıcı & Python mining botu",
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
    label: "7 Büyüme Kolu", statusLabel: "7 GROWTH ARMS", group: "SOVEREIGN",
    icon: "🏛️", color: "#fbbf24", desc: "Holding ecosystem panel",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/holding/HoldingEcosystemPanel"),
  },
  "tatar-finans": {
    label: "Tatar Finans", statusLabel: "TATAR FINANS", group: "SOVEREIGN",
    icon: "🛡️", color: "#fbbf24", desc: "Tatar financial network",
    minPlan: "b", dataMode: "demo", adminOnly: true,
    load: () => import("@/components/tatar/TatarFinansPanel"),
  },
} as const satisfies Record<string, PanelEntry>;

export type PanelView = keyof typeof PANELS;

export const GROUP_ORDER = ["GALACTIC", "CORE", "MARKETS", "TRADING", "ANALYSIS", "MEDIA", "SOCIAL", "SOVEREIGN"] as const;

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
