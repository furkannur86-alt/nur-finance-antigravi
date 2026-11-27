"use client";

import { useEffect, useRef, useState, useCallback, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { useIDEStore } from "@/stores/useIDEStore";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import StatusBar from "@/components/layout/StatusBar";
import EditorTabs from "@/components/editor/EditorTabs";
import CommandPalette from "@/components/layout/CommandPalette";
import FloatingWindowManager from "@/components/layout/FloatingWindowManager";
import WindowFrame from "@/components/layout/WindowFrame";
import { PANELS } from "@/panels/registry";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });
const TerminalPanel = dynamic(() => import("@/components/terminal/TerminalPanel"), { ssr: false });
const PortfolioManager = dynamic(() => import("@/components/portfolio/PortfolioManager"), { ssr: false });
const DashboardPanel = dynamic(() => import("@/components/dashboard/DashboardPanel"), { ssr: false });
const ChartsPanel = dynamic(() => import("@/components/dashboard/ChartsPanel"), { ssr: false });
const BacktestPanel = dynamic(() => import("@/components/backtest/BacktestPanel"), { ssr: false });
const GlobalMarketsPanel = dynamic(() => import("@/components/markets/GlobalMarketsPanel"), { ssr: false });
const EconomicDataPanel = dynamic(() => import("@/components/markets/EconomicDataPanel"), { ssr: false });
const DataIngestPanel = dynamic(() => import("@/components/ingest/DataIngestPanel"), { ssr: false });
const GeopoliticsPanel = dynamic(() => import("@/components/geopolitics/GeopoliticsPanel"), { ssr: false });
const FundamentalsPanel = dynamic(() => import("@/components/fundamentals/FundamentalsPanel"), { ssr: false });
const ScreenerPanel = dynamic(() => import("@/components/screener/ScreenerPanel"), { ssr: false });
const NewsFeedPanel = dynamic(() => import("@/components/news/NewsFeedPanel"), { ssr: false });
const EncyclopediaPanel = dynamic(() => import("@/components/encyclopedia/EncyclopediaPanel"), { ssr: false });
const PricingPanel = dynamic(() => import("@/components/pricing/PricingPanel"), { ssr: false });
const MediaPanel = dynamic(() => import("@/components/media/MediaPanel"), { ssr: false });
const LiveBroadcast = dynamic(() => import("@/components/media/LiveBroadcast"), { ssr: false });
const OptionsPanel = dynamic(() => import("@/components/derivatives/OptionsPanel"), { ssr: false });
const AIToolsPanel = dynamic(() => import("@/components/ai/AIToolsPanel"), { ssr: false });
const MacroRiskPanel = dynamic(() => import("@/components/macro/MacroRiskPanel"), { ssr: false });
const MarketBriefsPanel = dynamic(() => import("@/components/nfs/MarketBriefsPanel"), { ssr: false });
const RiskAlertsPanel = dynamic(() => import("@/components/nfs/RiskAlertsPanel"), { ssr: false });
const ResearchPanel = dynamic(() => import("@/components/nfs/ResearchPanel"), { ssr: false });
const NURTerminalPanel = dynamic(() => import("@/components/terminal/NURTerminalPanel"), { ssr: false });
const OMSEMSPanel = dynamic(() => import("@/components/trading/OMSEMSPanel"), { ssr: false });
const AIQuantCopilot = dynamic(() => import("@/components/ai/AIQuantCopilot"), { ssr: false });
const BroadcastStudioPanel = dynamic(() => import("@/components/media/BroadcastStudioPanel"), { ssr: false });
const VerificationPanel = dynamic(() => import("@/components/pricing/VerificationPanel"), { ssr: false });
const HUDNotificationSystem = dynamic(() => import("@/components/alerts/HUDNotificationSystem"), { ssr: false });
const GeophysicsResourcesPanel = dynamic(() => import("@/components/geophysics/GeophysicsResourcesPanel"), { ssr: false });
const ProfessionalAIHubPanel = dynamic(() => import("@/components/professional/ProfessionalAIHubPanel"), { ssr: false });
const NurEducationPanel = dynamic(() => import("@/components/education/NurEducationPanel"), { ssr: false });
const FinancialSocialPanel = dynamic(() => import("@/components/social/FinancialSocialPanel"), { ssr: false });
const ResourceIntelligencePanel = dynamic(() => import("@/components/resources/ResourceIntelligencePanel"), { ssr: false });
const ProfessionHubPanel = dynamic(() => import("@/components/social/ProfessionHubPanel"), { ssr: false });
const UserProfilePanel = dynamic(() => import("@/components/social/UserProfilePanel"), { ssr: false });
const WISHFrameworkPanel = dynamic(() => import("@/components/trading/WISHFrameworkPanel"), { ssr: false });
const SovereignAuthModal = dynamic(() => import("@/components/auth/SovereignAuthModal"), { ssr: false });
const NurAIAssistant = dynamic(() => import("@/components/ai/NurAIAssistant"), { ssr: false });

const MIN_CONSOLE_HEIGHT = 80;
const MAX_CONSOLE_HEIGHT = 500;
const DEFAULT_CONSOLE_HEIGHT = 200;

const FULLSCREEN_VIEWS = [
  "nur-education",
  "geophysics-resources",
  "professional-ai",
  "professional-social",
  "user-profile",
  "profession-hub",
  "wish-framework",
  "global-markets", "economic-data", "data-ingest", "geopolitics",
  "fundamentals", "screener", "news-feed", "encyclopedia", "pricing",
  "media", "options", "ai-tools", "news", "alerts", "research", "terminal", "live-tv",
  "macro-risk", "oms-ems", "quant-copilot", "broadcast-studio", "verification-portal",
  "cyber-risk", "nuclear-risk", "military-risk",
  "political-risk", "financial-risk", "ai-assistant",
];

export default function Home() {
  const { activeView, setActiveView, sidebarOpen, addConsoleMessage, consoleMessages, setDemoPlan } = useIDEStore();
  const didInit = useRef(false);
  const [consoleHeight, setConsoleHeight] = useState(DEFAULT_CONSOLE_HEIGHT);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [isPopoutMode, setIsPopoutMode] = useState(false);
  const [DynamicPanel, setDynamicPanel] = useState<ComponentType | null>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const popout = urlParams.get("popout");
      if (popout) {
        setActiveView(popout as any);
        setIsPopoutMode(true);
      }
      const plan = urlParams.get("plan");
      if (plan && ["free", "pro", "quant", "team", "professional", "institutional"].includes(plan)) {
        setDemoPlan(plan as any);
      }
    }
  }, [setActiveView, setDemoPlan]);

  useEffect(() => {
    if (activeView === "editor") { setDynamicPanel(null); return; }
    const entry = PANELS[activeView as keyof typeof PANELS];
    if (!entry) { setDynamicPanel(null); return; }
    const inSwitch = [
      "nur-education","geophysics-resources","professional-ai",
      "professional-social","user-profile","profession-hub","wish-framework",
      "dashboard","portfolio","charts","backtest","oms-ems","quant-copilot",
      "broadcast-studio","verification-portal",
      "global-markets","economic-data","data-ingest","geopolitics","fundamentals",
      "screener","news-feed","encyclopedia","pricing","media","live-tv","options",
      "ai-tools","macro-risk","news","alerts","research","terminal","ai-assistant"
    ];
    if (inSwitch.includes(activeView)) { setDynamicPanel(null); return; }
    let cancelled = false;
    entry.load().then((mod) => { if (!cancelled) setDynamicPanel(() => mod.default); });
    return () => { cancelled = true; };
  }, [activeView]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (consoleMessages.length === 0) {
      addConsoleMessage({ type: "info", text: "NUR Finance Terminal v3.0 — Institutional Analytics Engine" });
      addConsoleMessage({ type: "success", text: "Systems online: OMS/EMS, AI Quant Copilot, Risk Alerts & Broadcast Studio." });
    }
  }, [addConsoleMessage, consoleMessages.length]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startY.current = e.clientY;
    startHeight.current = consoleHeight;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";

    function onMove(ev: MouseEvent) {
      if (!dragging.current) return;
      const delta = startY.current - ev.clientY;
      const next = Math.max(MIN_CONSOLE_HEIGHT, Math.min(MAX_CONSOLE_HEIGHT, startHeight.current + delta));
      setConsoleHeight(next);
    }
    function onUp() {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [consoleHeight]);

  const showConsole = !FULLSCREEN_VIEWS.includes(activeView);

  const renderMainContent = () => {
    switch (activeView) {
      case "nur-education":
        return <WindowFrame view="nur-education"><NurEducationPanel /></WindowFrame>;
      case "geophysics-resources":
        return <WindowFrame view="geophysics-resources"><GeophysicsResourcesPanel /></WindowFrame>;
      case "professional-ai":
        return <WindowFrame view="professional-ai"><ProfessionalAIHubPanel /></WindowFrame>;
      case "professional-social":
        return <WindowFrame view="professional-social"><FinancialSocialPanel /></WindowFrame>;
      case "user-profile":
        return <WindowFrame view="user-profile"><UserProfilePanel /></WindowFrame>;
      case "profession-hub":
        return <WindowFrame view="profession-hub"><ProfessionHubPanel /></WindowFrame>;
      case "wish-framework":
        return <WindowFrame view="wish-framework"><WISHFrameworkPanel /></WindowFrame>;
      case "dashboard":
        return <DashboardPanel />;
      case "portfolio":
        return <WindowFrame view="portfolio"><PortfolioManager /></WindowFrame>;
      case "charts":
        return <WindowFrame view="charts"><ChartsPanel /></WindowFrame>;
      case "backtest":
        return <WindowFrame view="backtest"><BacktestPanel /></WindowFrame>;
      case "oms-ems":
        return <WindowFrame view="oms-ems"><OMSEMSPanel /></WindowFrame>;
      case "quant-copilot":
        return <WindowFrame view="quant-copilot"><AIQuantCopilot /></WindowFrame>;
      case "broadcast-studio":
        return <WindowFrame view="broadcast-studio"><BroadcastStudioPanel /></WindowFrame>;
      case "verification-portal":
        return <WindowFrame view="verification-portal"><VerificationPanel /></WindowFrame>;
      case "global-markets":
        return <WindowFrame view="global-markets"><GlobalMarketsPanel /></WindowFrame>;
      case "economic-data":
        return <WindowFrame view="economic-data"><EconomicDataPanel /></WindowFrame>;
      case "data-ingest":
        return <WindowFrame view="data-ingest"><DataIngestPanel /></WindowFrame>;
      case "geopolitics":
        return <WindowFrame view="geopolitics"><GeopoliticsPanel /></WindowFrame>;
      case "fundamentals":
        return <WindowFrame view="fundamentals"><FundamentalsPanel /></WindowFrame>;
      case "screener":
        return <WindowFrame view="screener"><ScreenerPanel /></WindowFrame>;
      case "news-feed":
        return <WindowFrame view="news-feed"><NewsFeedPanel /></WindowFrame>;
      case "encyclopedia":
        return <WindowFrame view="encyclopedia"><EncyclopediaPanel /></WindowFrame>;
      case "pricing":
        return <WindowFrame view="pricing"><PricingPanel /></WindowFrame>;
      case "media":
        return <WindowFrame view="media"><MediaPanel /></WindowFrame>;
      case "live-tv":
        return <WindowFrame view="live-tv"><LiveBroadcast /></WindowFrame>;
      case "options":
        return <WindowFrame view="options"><OptionsPanel /></WindowFrame>;
      case "ai-tools":
        return <WindowFrame view="ai-tools"><AIToolsPanel /></WindowFrame>;
      case "macro-risk":
        return <WindowFrame view="macro-risk"><MacroRiskPanel /></WindowFrame>;
      case "news":
        return <WindowFrame view="news"><MarketBriefsPanel /></WindowFrame>;
      case "alerts":
        return <WindowFrame view="alerts"><RiskAlertsPanel /></WindowFrame>;
      case "research":
        return <WindowFrame view="research"><ResearchPanel /></WindowFrame>;
      case "terminal":
        return <WindowFrame view="terminal"><NURTerminalPanel /></WindowFrame>;
      case "ai-assistant":
        return <WindowFrame view="ai-assistant"><NurAIAssistant /></WindowFrame>;
      case "editor":
        return (
          <div className="flex flex-col flex-1 min-h-0">
            <EditorTabs />
            <div className="flex-1 min-h-0">
              <CodeEditor />
            </div>
          </div>
        );
      default:
        if (DynamicPanel) return (
          <WindowFrame view={activeView as any}>
            <DynamicPanel />
          </WindowFrame>
        );
        return (
          <div className="flex flex-col flex-1 min-h-0">
            <EditorTabs />
            <div className="flex-1 min-h-0">
              <CodeEditor />
            </div>
          </div>
        );
    }
  };

  if (isPopoutMode) {
    return (
      <div className="w-screen h-screen bg-black overflow-auto select-text font-sans">
        {renderMainContent()}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden cockpit-app-root" style={{ background: "var(--ag-bg)" }}>
      <CommandPalette />
      <HUDNotificationSystem />
      <SovereignAuthModal />
      <TopBar />
      <FloatingWindowManager />
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && <Sidebar />}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 min-h-0">{renderMainContent()}</div>
          {showConsole && (
            <>
              <div
                onMouseDown={onDragStart}
                onDoubleClick={() => setConsoleCollapsed((c) => !c)}
                className="h-1 cursor-ns-resize hover:bg-[var(--ag-accent)] transition-colors flex-shrink-0"
                style={{ background: "var(--ag-border)" }}
                title="Drag to resize, double-click to toggle"
              />
              <div style={{ height: consoleCollapsed ? 0 : consoleHeight, overflow: "hidden" }}>
                <TerminalPanel />
              </div>
            </>
          )}
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
