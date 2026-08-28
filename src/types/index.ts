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

export type PanelView = "editor" | "dashboard" | "portfolio" | "terminal" | "charts";
