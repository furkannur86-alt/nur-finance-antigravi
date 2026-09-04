import { create } from "zustand";
import {
  Tab,
  ConsoleMessage,
  FileNode,
  PanelView,
  SimulatedOrder,
  SimulatedPosition,
  ExecutionFillLog,
  HUDNotification,
  AlertRule,
  VIPVerificationStatus,
} from "@/types";
import { sampleFiles } from "@/lib/sample-files";

const INITIAL_ORDERS: SimulatedOrder[] = [
  {
    id: "ord-101",
    symbol: "NVDA",
    side: "BUY",
    type: "LIMIT",
    quantity: 100,
    filledQuantity: 100,
    price: 118.5,
    avgFillPrice: 118.48,
    timeInForce: "GTC",
    status: "FILLED",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3590000).toISOString(),
    slippageEstimated: 0.02,
    feeEstimated: 1.18,
  },
  {
    id: "ord-102",
    symbol: "AAPL",
    side: "BUY",
    type: "ICEBERG",
    quantity: 500,
    filledQuantity: 300,
    price: 224.0,
    avgFillPrice: 224.05,
    icebergDisplaySize: 100,
    timeInForce: "GTC",
    status: "WORKING",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    slippageEstimated: 0.05,
    feeEstimated: 3.36,
  },
  {
    id: "ord-103",
    symbol: "SPY",
    side: "SELL",
    type: "TRAILING_STOP",
    quantity: 50,
    filledQuantity: 0,
    stopPrice: 550.0,
    timeInForce: "DAY",
    status: "WORKING",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    slippageEstimated: 0.01,
    feeEstimated: 0.55,
  },
];

const INITIAL_POSITIONS: SimulatedPosition[] = [
  {
    symbol: "NVDA",
    side: "LONG",
    quantity: 100,
    avgEntryPrice: 118.48,
    currentPrice: 122.35,
    unrealizedPnl: 387.0,
    unrealizedPnlPercent: 3.27,
    realizedPnl: 145.2,
    marginUsed: 4078.33,
    liquidationPrice: 88.5,
    kellySizeSuggested: 125,
    atrStopSuggested: 114.2,
  },
  {
    symbol: "AAPL",
    side: "LONG",
    quantity: 300,
    avgEntryPrice: 224.05,
    currentPrice: 226.8,
    unrealizedPnl: 825.0,
    unrealizedPnlPercent: 1.23,
    realizedPnl: 0,
    marginUsed: 22680.0,
    liquidationPrice: 168.0,
    kellySizeSuggested: 280,
    atrStopSuggested: 218.4,
  },
  {
    symbol: "QQQ",
    side: "SHORT",
    quantity: 60,
    avgEntryPrice: 482.5,
    currentPrice: 479.1,
    unrealizedPnl: 204.0,
    unrealizedPnlPercent: 0.7,
    realizedPnl: 310.5,
    marginUsed: 9582.0,
    liquidationPrice: 535.0,
    kellySizeSuggested: 50,
    atrStopSuggested: 491.0,
  },
];

const INITIAL_NOTIFICATIONS: HUDNotification[] = [
  {
    id: "hud-1",
    title: "VIX Regime Gatekeeper",
    message: "VIX currently at 17.82 (<30). Normal quantitative trading & sector rotation regime is active.",
    severity: "SUCCESS",
    category: "REGIME",
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    read: false,
  },
  {
    id: "hud-2",
    title: "ISM Composite Signal",
    message: "Services Business Activity composite +1.4 std dev. Tech & Industrials basket rotation triggered.",
    severity: "INFO",
    category: "QUANT_SIGNAL",
    timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
    read: false,
  },
  {
    id: "hud-3",
    title: "ACLED Geo-Risk Warning",
    message: "Heightened conflict index in Red Sea maritime corridor. Energy & Shipping transport volatility elevated.",
    severity: "WARNING",
    category: "GEOPOLITICS",
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
    read: true,
  },
];

interface IDEState {
  files: FileNode[];
  tabs: Tab[];
  activeTabId: string | null;
  consoleMessages: ConsoleMessage[];
  isRunning: boolean;
  activeView: PanelView;
  sidebarOpen: boolean;
  hudDrawerOpen: boolean;
  breakingNewsTicker: string;
  orders: SimulatedOrder[];
  positions: SimulatedPosition[];
  fillLogs: ExecutionFillLog[];
  notifications: HUDNotification[];
  alertRules: AlertRule[];
  verification: VIPVerificationStatus;

  // Actions
  openFile: (node: FileNode) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  addConsoleMessage: (msg: Omit<ConsoleMessage, "id" | "timestamp">) => void;
  clearConsole: () => void;
  setRunning: (running: boolean) => void;
  setActiveView: (view: PanelView) => void;
  toggleSidebar: () => void;
  toggleHUDDrawer: () => void;
  setBreakingNewsTicker: (headline: string) => void;
  runActiveFile: () => void;

  // OMS / Trading Actions
  placeOrder: (order: Omit<SimulatedOrder, "id" | "filledQuantity" | "status" | "createdAt" | "updatedAt" | "slippageEstimated" | "feeEstimated">) => void;
  cancelOrder: (id: string) => void;
  liquidateAllPositions: () => void;
  addPosition: (pos: SimulatedPosition) => void;

  // Notification & Alert Actions
  addNotification: (notif: Omit<HUDNotification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  toggleAlertRule: (id: string) => void;

  // Verification Actions
  updateVerification: (updates: Partial<VIPVerificationStatus>) => void;
}

export const useIDEStore = create<IDEState>((set, get) => ({
  files: sampleFiles,
  tabs: [],
  activeTabId: null,
  consoleMessages: [],
  isRunning: false,
  activeView: "holding-ecosystem",
  sidebarOpen: true,
  hudDrawerOpen: false,
  breakingNewsTicker: "NUR TV GLOBAL: U.S. ISM Services PMI reaches 54.8; Quant Rotation active across Tech and Financials.",
  orders: INITIAL_ORDERS,
  positions: INITIAL_POSITIONS,
  fillLogs: [],
  notifications: INITIAL_NOTIFICATIONS,
  alertRules: [
    { id: "rule-1", name: "S&P 500 Spike > 5,700", category: "PRICE", targetSymbol: "SPY", condition: "GREATER_THAN", threshold: 570, enabled: true, soundEnabled: true },
    { id: "rule-2", name: "VIX Fear Shock > 30", category: "VIX_REGIME", condition: "CROSS_ABOVE", threshold: 30, enabled: true, soundEnabled: true },
    { id: "rule-3", name: "ACLED Conflict Severity > 75", category: "ACLED_CONFLICT", condition: "GREATER_THAN", threshold: 75, enabled: true, soundEnabled: false },
    { id: "rule-4", name: "Fed Rate Decision Countdown", category: "MACRO_SURPRISE", condition: "LESS_THAN", threshold: 24, enabled: true, soundEnabled: true },
  ],
  verification: {
    tier: "NUR_FINANCE_R",
    reutersUsageMonths: 14,
    bloombergUsageMonths: 0,
    invitationCode: "",
    invitationVerified: false,
    emailConfirmed: false,
    documentUploaded: false,
    overallStatus: "NOT_STARTED",
  },

  openFile: (node) => {
    if (node.type !== "file") return;
    const existing = get().tabs.find((t) => t.path === node.path);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    const tab: Tab = {
      id: node.path,
      name: node.name,
      path: node.path,
      content: node.content || "",
      language: node.language || "plaintext",
      modified: false,
    };
    set((s) => ({ tabs: [...s.tabs, tab], activeTabId: tab.id }));
  },

  closeTab: (id) => {
    set((s) => {
      const newTabs = s.tabs.filter((t) => t.id !== id);
      let newActive = s.activeTabId;
      if (s.activeTabId === id) {
        const idx = s.tabs.findIndex((t) => t.id === id);
        newActive = newTabs[Math.min(idx, newTabs.length - 1)]?.id || null;
      }
      return { tabs: newTabs, activeTabId: newActive };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabContent: (id, content) => {
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, content, modified: true } : t)),
    }));
  },

  addConsoleMessage: (msg) => {
    const message: ConsoleMessage = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set((s) => ({ consoleMessages: [...s.consoleMessages, message] }));
  },

  clearConsole: () => set({ consoleMessages: [] }),
  setRunning: (isRunning) => set({ isRunning }),
  setActiveView: (activeView) => set({ activeView }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleHUDDrawer: () => set((s) => ({ hudDrawerOpen: !s.hudDrawerOpen })),
  setBreakingNewsTicker: (breakingNewsTicker) => set({ breakingNewsTicker }),

  placeOrder: (orderData) => {
    const id = `ord-${Date.now().toString().slice(-4)}`;
    const price = orderData.price || 150.0;
    const slippageEstimated = Number((Math.random() * 0.04 + 0.01).toFixed(2));
    const feeEstimated = Number(((orderData.quantity * price) * 0.0001).toFixed(2));

    const newOrder: SimulatedOrder = {
      ...orderData,
      id,
      filledQuantity: orderData.type === "MARKET" ? orderData.quantity : 0,
      avgFillPrice: orderData.type === "MARKET" ? price + (orderData.side === "BUY" ? slippageEstimated : -slippageEstimated) : undefined,
      status: orderData.type === "MARKET" ? "FILLED" : "WORKING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slippageEstimated,
      feeEstimated,
    };

    set((state) => {
      const updatedOrders = [newOrder, ...state.orders];
      const updatedNotifications: HUDNotification[] = [
        {
          id: `hud-${Date.now()}`,
          title: `Order Submitted: ${newOrder.side} ${newOrder.quantity} ${newOrder.symbol}`,
          message: `${newOrder.type} order placed at ${price ? `$${price}` : "MKT"}. Status: ${newOrder.status}.`,
          severity: "INFO",
          category: "OMS",
          timestamp: new Date().toLocaleTimeString(),
          read: false,
        },
        ...state.notifications,
      ];

      // If market order, immediately update positions
      let updatedPositions = [...state.positions];
      if (newOrder.status === "FILLED") {
        const fillPrice = newOrder.avgFillPrice || price;
        const existingIdx = updatedPositions.findIndex((p) => p.symbol === newOrder.symbol);
        if (existingIdx >= 0) {
          const existing = updatedPositions[existingIdx];
          const newQty = newOrder.side === "BUY" ? existing.quantity + newOrder.quantity : existing.quantity - newOrder.quantity;
          if (newQty <= 0) {
            updatedPositions = updatedPositions.filter((_, idx) => idx !== existingIdx);
          } else {
            updatedPositions[existingIdx] = {
              ...existing,
              quantity: newQty,
              currentPrice: fillPrice,
              unrealizedPnl: (fillPrice - existing.avgEntryPrice) * newQty,
            };
          }
        } else {
          updatedPositions.push({
            symbol: newOrder.symbol,
            side: newOrder.side === "BUY" ? "LONG" : "SHORT",
            quantity: newOrder.quantity,
            avgEntryPrice: fillPrice,
            currentPrice: fillPrice,
            unrealizedPnl: 0,
            unrealizedPnlPercent: 0,
            realizedPnl: 0,
            marginUsed: (newOrder.quantity * fillPrice) / 3,
            liquidationPrice: fillPrice * 0.7,
            kellySizeSuggested: Math.round(newOrder.quantity * 1.1),
            atrStopSuggested: fillPrice * 0.96,
          });
        }
      }

      return { orders: updatedOrders, notifications: updatedNotifications, positions: updatedPositions };
    });
  },

  cancelOrder: (id) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status: "CANCELLED", updatedAt: new Date().toISOString() } : o)),
      notifications: [
        {
          id: `hud-${Date.now()}`,
          title: `Order Cancelled: #${id}`,
          message: `Order #${id} has been cancelled by operator.`,
          severity: "WARNING",
          category: "OMS",
          timestamp: new Date().toLocaleTimeString(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },

  liquidateAllPositions: () => {
    set((state) => ({
      positions: [],
      orders: state.orders.map((o) => (o.status === "WORKING" ? { ...o, status: "CANCELLED" } : o)),
      notifications: [
        {
          id: `hud-${Date.now()}`,
          title: "EMERGENCY LIQUIDATION EXECUTED",
          message: "All positions liquidated to cash. Working orders cancelled. Margin freed.",
          severity: "CRITICAL",
          category: "KILL_SWITCH",
          timestamp: new Date().toLocaleTimeString(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },

  addPosition: (pos) => set((s) => ({ positions: [...s.positions, pos] })),

  addNotification: (notif) => {
    const newNotif: HUDNotification = {
      ...notif,
      id: `hud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
    };
    set((s) => ({ notifications: [newNotif, ...s.notifications] }));
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  clearAllNotifications: () => set({ notifications: [] }),

  toggleAlertRule: (id) => {
    set((s) => ({
      alertRules: s.alertRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    }));
  },

  updateVerification: (updates) => {
    set((s) => ({
      verification: { ...s.verification, ...updates },
    }));
  },

  runActiveFile: () => {
    const { tabs, activeTabId, isRunning } = get();
    if (isRunning) return;
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    set({ isRunning: true });
    const addMsg = (msg: Omit<ConsoleMessage, "id" | "timestamp">) => {
      const message: ConsoleMessage = { ...msg, id: crypto.randomUUID(), timestamp: new Date() };
      set((s) => ({ consoleMessages: [...s.consoleMessages, message] }));
    };

    addMsg({ type: "info", text: `>>> Running ${activeTab.name}...` });

    setTimeout(() => {
      const lines = activeTab.content.split("\n").filter((l) => {
        const trimmed = l.trim();
        return trimmed.startsWith("print(") || trimmed.startsWith("print (");
      });

      for (const line of lines) {
        const match = line.match(/print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/);
        if (match) {
          addMsg({ type: "output", text: match[1] || match[2] || line });
        }
      }

      addMsg({ type: "success", text: `[AntiGravi] ${activeTab.name} executed successfully.` });
      addMsg({ type: "info", text: `[Engine] Processed in ${(Math.random() * 200 + 50).toFixed(1)}ms` });
      set({ isRunning: false });
    }, 800);
  },
}));

