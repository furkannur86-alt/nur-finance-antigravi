"use client";

import { useEffect, useRef, useState, useCallback, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { useIDEStore } from "@/stores/useIDEStore";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import StatusBar from "@/components/layout/StatusBar";
import EditorTabs from "@/components/editor/EditorTabs";
import TerminalPanel from "@/components/terminal/TerminalPanel";
import PortfolioManager from "@/components/portfolio/PortfolioManager";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import ChartsPanel from "@/components/dashboard/ChartsPanel";
import BacktestPanel from "@/components/backtest/BacktestPanel";
import GlobalMarketsPanel from "@/components/markets/GlobalMarketsPanel";
import EconomicDataPanel from "@/components/markets/EconomicDataPanel";
import DataIngestPanel from "@/components/ingest/DataIngestPanel";
import GeopoliticsPanel from "@/components/geopolitics/GeopoliticsPanel";
import FundamentalsPanel from "@/components/fundamentals/FundamentalsPanel";
import ScreenerPanel from "@/components/screener/ScreenerPanel";
import NewsFeedPanel from "@/components/news/NewsFeedPanel";
import EncyclopediaPanel from "@/components/encyclopedia/EncyclopediaPanel";
import PricingPanel from "@/components/pricing/PricingPanel";
import MediaPanel from "@/components/media/MediaPanel";
import LiveBroadcast from "@/components/media/LiveBroadcast";
import OptionsPanel from "@/components/derivatives/OptionsPanel";
import AIToolsPanel from "@/components/ai/AIToolsPanel";
import MacroRiskPanel from "@/components/macro/MacroRiskPanel";
import MarketBriefsPanel from "@/components/nfs/MarketBriefsPanel";
import RiskAlertsPanel from "@/components/nfs/RiskAlertsPanel";
import ResearchPanel from "@/components/nfs/ResearchPanel";
import NURTerminalPanel from "@/components/terminal/NURTerminalPanel";
import CommandPalette from "@/components/layout/CommandPalette";
import OMSEMSPanel from "@/components/trading/OMSEMSPanel";
import AIQuantCopilot from "@/components/ai/AIQuantCopilot";
import BroadcastStudioPanel from "@/components/media/BroadcastStudioPanel";
import VerificationPanel from "@/components/pricing/VerificationPanel";
import HUDNotificationSystem from "@/components/alerts/HUDNotificationSystem";
import DigitalWalletGateway from "@/components/trading/DigitalWalletGateway";
import NurCoinEcosystemPanel from "@/components/crypto/NurCoinEcosystemPanel";
import HoldingEcosystemPanel from "@/components/holding/HoldingEcosystemPanel";
import UmayBossTerminal from "@/components/umay/UmayBossTerminal";
import TatarFinansPanel from "@/components/tatar/TatarFinansPanel";
import NurKidsPanel from "@/components/kids/NurKidsPanel";
import NurEducationPanel from "@/components/education/NurEducationPanel";
import ComputeForAccessPanel from "@/components/compute/ComputeForAccessPanel";
import GeophysicsResourcesPanel from "@/components/geophysics/GeophysicsResourcesPanel";
import InstitutionalSuitePanel from "@/components/institutional/InstitutionalSuitePanel";
import OrbitalTelemetryPanel from "@/components/orbital/OrbitalTelemetryPanel";
import ProfessionalAIHubPanel from "@/components/professional/ProfessionalAIHubPanel";
import FinancialSocialPanel from "@/components/social/FinancialSocialPanel";
import ResourceIntelligencePanel from "@/components/resources/ResourceIntelligencePanel";
import ProfessionHubPanel from "@/components/social/ProfessionHubPanel";
import UserProfilePanel from "@/components/social/UserProfilePanel";
import WISHFrameworkPanel from "@/components/trading/WISHFrameworkPanel";
import SovereignAuthModal from "@/components/auth/SovereignAuthModal";
import Quantum2126Ticker from "@/components/layout/Quantum2126Ticker";
import FinancialMatrixRain from "@/components/ui/FinancialMatrixRain";
import CockpitFrame from "@/components/cockpit/CockpitFrame";
import FloatingWindowManager from "@/components/layout/FloatingWindowManager";
import { PANELS } from "@/panels/registry";
import GalacticFleetPanel from "@/components/orbital/GalacticFleetPanel";
import OrbitalCommandPanel from "@/components/orbital/OrbitalCommandPanel";
import CivilizationTerminalPanel from "@/components/orbital/CivilizationTerminalPanel";
import CivilizationArbitrageEngine from "@/components/trading/CivilizationArbitrageEngine";
import MasterFleetMiningAdminPanel from "@/components/orbital/MasterFleetMiningAdminPanel";
import UmayMasterTerminalPanel from "@/components/umay/UmayMasterTerminalPanel";
import FleetMinerPanel from "@/components/mining/FleetMinerPanel";
import WindowFrame from "@/components/layout/WindowFrame";
import NurAIAssistant from "@/components/ai/NurAIAssistant";
import BackgroundGlobe from "@/components/ui/BackgroundGlobe";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

const MIN_CONSOLE_HEIGHT = 80;
const MAX_CONSOLE_HEIGHT = 500;
const DEFAULT_CONSOLE_HEIGHT = 200;

const FULLSCREEN_VIEWS = [
  "umay-master",
  "umay-boss",
  "holding-ecosystem",
  "tatar-finans",
  "nur-kids",
  "nur-education",
  "compute-access",
  "geophysics-resources",
  "resource-intelligence",
  "institutional-suite",
  "orbital-telemetry",
  "galactic-fleet",
  "orbital-command",
  "civilization-terminals",
  "civilization-arbitrage",
  "master-fleet-mining",
  "fleet-miner",
  "professional-ai",
  "professional-social",
  "user-profile",
  "profession-hub",
  "wish-framework",
  "global-markets", "economic-data", "data-ingest", "geopolitics",
  "fundamentals", "screener", "news-feed", "encyclopedia", "pricing",
  "media", "options", "ai-tools", "news", "alerts", "research", "terminal", "live-tv",
  "macro-risk", "oms-ems", "quant-copilot", "broadcast-studio", "verification-portal",
  "wallet-gateway", "nur-coin", "cyber-risk", "nuclear-risk", "military-risk",
  "galactic-risk", "political-risk", "financial-risk", "ai-assistant",
];

export default function Home() {
  const { activeView, setActiveView, sidebarOpen, addConsoleMessage, consoleMessages, matrixRainOpacity, setDemoPlan } = useIDEStore();
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
      if (plan && ["free", "pro", "quant", "team", "r", "b"].includes(plan)) {
        setDemoPlan(plan as any);
      }
    }
  }, [setActiveView, setDemoPlan]);

  useEffect(() => {
    if (activeView === "editor") { setDynamicPanel(null); return; }
    const entry = PANELS[activeView as keyof typeof PANELS];
    if (!entry) { setDynamicPanel(null); return; }
    const inSwitch = [
      "umay-master","umay-boss","holding-ecosystem","tatar-finans","nur-kids","nur-education",
      "compute-access","geophysics-resources","resource-intelligence","institutional-suite",
      "orbital-telemetry","galactic-fleet","orbital-command","civilization-terminals",
      "civilization-arbitrage","master-fleet-mining","fleet-miner","professional-ai",
      "professional-social","user-profile","profession-hub","wish-framework",
      "dashboard","portfolio","charts","backtest","oms-ems","quant-copilot",
      "broadcast-studio","verification-portal","wallet-gateway","nur-coin",
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
      addConsoleMessage({ type: "info", text: "AntiGravi IDE v3.0 PRO - Nur Finance Quantitative Engine" });
      addConsoleMessage({ type: "success", text: "Faz 3 Engine initialized: OMS/EMS, AI Quant Copilot, HUD Alerts & Broadcast Studio active." });
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
      case "umay-master":
        return <WindowFrame view="umay-master"><UmayMasterTerminalPanel /></WindowFrame>;
      case "umay-boss":
        return <WindowFrame view="umay-boss"><UmayBossTerminal /></WindowFrame>;
      case "holding-ecosystem":
        return <WindowFrame view="holding-ecosystem"><HoldingEcosystemPanel /></WindowFrame>;
      case "tatar-finans":
        return <WindowFrame view="tatar-finans"><TatarFinansPanel /></WindowFrame>;
      case "nur-kids":
        return <WindowFrame view="nur-kids"><NurKidsPanel /></WindowFrame>;
      case "nur-education":
        return <WindowFrame view="nur-education"><NurEducationPanel /></WindowFrame>;
      case "compute-access":
        return <WindowFrame view="compute-access"><ComputeForAccessPanel /></WindowFrame>;
      case "geophysics-resources":
        return <WindowFrame view="geophysics-resources"><GeophysicsResourcesPanel /></WindowFrame>;
      case "resource-intelligence":
        return <WindowFrame view="resource-intelligence"><ResourceIntelligencePanel /></WindowFrame>;
      case "institutional-suite":
        return <WindowFrame view="institutional-suite"><InstitutionalSuitePanel /></WindowFrame>;
      case "orbital-telemetry":
        return <WindowFrame view="orbital-telemetry"><OrbitalTelemetryPanel /></WindowFrame>;
      case "galactic-fleet":
        return <WindowFrame view="galactic-fleet"><GalacticFleetPanel /></WindowFrame>;
      case "orbital-command":
        return <WindowFrame view="orbital-command"><OrbitalCommandPanel /></WindowFrame>;
      case "civilization-terminals":
        return <WindowFrame view="civilization-terminals"><CivilizationTerminalPanel onClose={() => setActiveView("dashboard")} /></WindowFrame>;
      case "civilization-arbitrage":
        return <WindowFrame view="civilization-arbitrage"><CivilizationArbitrageEngine onClose={() => setActiveView("dashboard")} /></WindowFrame>;
      case "master-fleet-mining":
        return <WindowFrame view="master-fleet-mining"><MasterFleetMiningAdminPanel /></WindowFrame>;
      case "fleet-miner":
        return <WindowFrame view="fleet-miner"><FleetMinerPanel /></WindowFrame>;
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
      case "wallet-gateway":
        return <WindowFrame view="wallet-gateway"><DigitalWalletGateway /></WindowFrame>;
      case "nur-coin":
        return <WindowFrame view="nur-coin"><NurCoinEcosystemPanel /></WindowFrame>;
      case "global-markets":
        return <WindowFrame view="global-markets"><GlobalMarketsPanel /></WindowFrame>;
      case "economic-data":
        return <WindowFrame view="economic-data"><EconomicDataPanel /></WindowFrame>;
      case "data-ingest":
        return <WindowFrame view="data-ingest"><DataIngestPanel /></WindowFrame>;
      case "geopolitics":
        return (
          <WindowFrame view="geopolitics">
            <CockpitFrame showControls>
              <GeopoliticsPanel />
            </CockpitFrame>
          </WindowFrame>
        );
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
      {matrixRainOpacity > 0 && <FinancialMatrixRain opacity={matrixRainOpacity} />}
      <BackgroundGlobe opacity={0.06} />
      <CommandPalette />
      <HUDNotificationSystem />
      <SovereignAuthModal />
      <Quantum2126Ticker />
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

