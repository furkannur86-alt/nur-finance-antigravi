import { create } from "zustand";
import { Tab, ConsoleMessage, FileNode, PanelView } from "@/types";
import { sampleFiles } from "@/lib/sample-files";

interface IDEState {
  files: FileNode[];
  tabs: Tab[];
  activeTabId: string | null;
  consoleMessages: ConsoleMessage[];
  isRunning: boolean;
  activeView: PanelView;
  sidebarOpen: boolean;
  openFile: (node: FileNode) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  addConsoleMessage: (msg: Omit<ConsoleMessage, "id" | "timestamp">) => void;
  clearConsole: () => void;
  setRunning: (running: boolean) => void;
  setActiveView: (view: PanelView) => void;
  toggleSidebar: () => void;
  runActiveFile: () => void;
}

export const useIDEStore = create<IDEState>((set, get) => ({
  files: sampleFiles,
  tabs: [],
  activeTabId: null,
  consoleMessages: [],
  isRunning: false,
  activeView: "editor",
  sidebarOpen: true,

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
