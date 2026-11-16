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
