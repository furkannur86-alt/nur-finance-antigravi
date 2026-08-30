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

export type PanelView = "editor" | "dashboard" | "portfolio" | "terminal" | "charts" | "backtest" | "news" | "alerts" | "research" | "global-markets" | "economic-data";

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
