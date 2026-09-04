export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  modified: boolean;
}

export interface ConsoleMessage {
  id: string;
  type: "info" | "error" | "success" | "warning" | "output";
  text: string;
  timestamp: Date;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
}

export interface BacktestResult {
  strategy: string;
  symbol: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  trades: number;
  winRate: number;
  equity: number[];
  signals: Array<{ index: number; type: "buy" | "sell"; price: number }>;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdownDuration: number;
  valueAtRisk: number;
  expectedShortfall: number;
  kellyFraction: number;
}

export type PanelView =
  | "editor"
  | "dashboard"
  | "portfolio"
  | "terminal"
  | "charts"
  | "backtest"
  | "news"
  | "alerts"
  | "research"
  | "global-markets"
  | "economic-data"
  | "data-ingest"
  | "geopolitics"
  | "fundamentals"
  | "screener"
  | "news-feed"
  | "encyclopedia"
  | "pricing"
  | "media"
  | "options"
  | "ai-tools"
  | "live-tv"
  | "macro-risk"
  | "oms-ems"
  | "quant-copilot"
  | "broadcast-studio"
  | "verification-portal"
  | "wallet-gateway"
  | "holding-ecosystem";

export interface GlobalMarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  region: string;
}

export interface EconomicDataPoint {
  seriesId: string;
  name: string;
  date: string;
  value: number;
  category: string;
}

// Faz 3 OMS / EMS Types
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "TRAILING_STOP" | "TWAP" | "VWAP" | "ICEBERG";
export type OrderSide = "BUY" | "SELL";
export type TimeInForce = "GTC" | "IOC" | "FOK" | "DAY";
export type OrderStatus = "PENDING" | "WORKING" | "FILLED" | "PARTIALLY_FILLED" | "CANCELLED" | "REJECTED";

export interface SimulatedOrder {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  filledQuantity: number;
  price?: number;
  stopPrice?: number;
  avgFillPrice?: number;
  timeInForce: TimeInForce;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  icebergDisplaySize?: number;
  twapIntervalSeconds?: number;
  slippageEstimated: number;
  feeEstimated: number;
}

export interface SimulatedPosition {
  symbol: string;
  side: "LONG" | "SHORT";
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  realizedPnl: number;
  marginUsed: number;
  liquidationPrice: number;
  kellySizeSuggested: number;
  atrStopSuggested: number;
}

export interface DOMOrderLevel {
  price: number;
  size: number;
  total: number;
  myOrdersCount: number;
}

export interface DOMData {
  symbol: string;
  lastPrice: number;
  spread: number;
  bids: DOMOrderLevel[];
  asks: DOMOrderLevel[];
}

export interface ExecutionFillLog {
  id: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  fee: number;
  slippage: number;
  timestamp: string;
  route: string;
}

// Faz 3 HUD & Alert Types
export interface AlertRule {
  id: string;
  name: string;
  category: "PRICE" | "VIX_REGIME" | "ACLED_CONFLICT" | "MACRO_SURPRISE";
  targetSymbol?: string;
  condition: "GREATER_THAN" | "LESS_THAN" | "CROSS_ABOVE" | "CROSS_BELOW" | "PROXIMITY_KM";
  threshold: number;
  enabled: boolean;
  soundEnabled: boolean;
  lastTriggered?: string;
}

export interface HUDNotification {
  id: string;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
  category: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Faz 3 AI WISH & Copilot Types
export interface WISHFrameworkScore {
  worldview: {
    ismManufacturing: number;
    ismServices: number;
    michiganSentiment: number;
    compositeScore: number;
    regime: "EXPANSION" | "CONTRACTION" | "NEUTRAL";
  };
  indicators: {
    topGrowingSectors: string[];
    topContractingSectors: string[];
    momentumBias: "BULLISH" | "BEARISH" | "NEUTRAL";
  };
  setup: {
    vixLevel: number;
    vixGatekeeper: "PASS_TRADING_ALLOWED" | "BLOCKED_CASH_OR_CONTRARIAN";
    dayOfCycle: number;
    entryTimingSignal: "ENTER_NOW" | "HOLD" | "EXIT_REBALANCE";
  };
  haveDiscipline: {
    continuousKelly: number;
    recommendedLeverage: number;
    ruinThreshold: number;
    maxDrawdownLimitPercent: number;
  };
}

export interface PairTradeCandidate {
  id: string;
  longSector: string;
  longTicker: string;
  shortSector: string;
  shortTicker: string;
  expectedSharpe: number;
  historicalCorrelation: number;
  kellyWeight: number;
  thesis: string;
}

// Faz 3 Verification Types
export type VerificationProductTier = "NUR_FINANCE_R" | "NUR_FINANCE_B";
export type VerificationStepStatus = "NOT_STARTED" | "IN_PROGRESS" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

export interface VIPVerificationStatus {
  tier: VerificationProductTier;
  reutersUsageMonths: number;
  bloombergUsageMonths: number;
  invitationCode: string;
  invitationVerified: boolean;
  emailConfirmed: boolean;
  documentUploaded: boolean;
  overallStatus: VerificationStepStatus;
  activatedAt?: string;
}

