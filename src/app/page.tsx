"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import GalacticFleetPanel from "@/components/orbital/GalacticFleetPanel";
import OrbitalCommandPanel from "@/components/orbital/OrbitalCommandPanel";
import CivilizationTerminalPanel from "@/components/orbital/CivilizationTerminalPanel";
import CivilizationArbitrageEngine from "@/components/trading/CivilizationArbitrageEngine";
import MasterFleetMiningAdminPanel from "@/components/orbital/MasterFleetMiningAdminPanel";
import UmayMasterTerminalPanel from "@/components/umay/UmayMasterTerminalPanel";
import FleetMinerPanel from "@/components/mining/FleetMinerPanel";

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
  "wallet-gateway", "nur-coin",
];

export default function Home() {
  const { activeView, setActiveView, sidebarOpen, addConsoleMessage, consoleMessages, matrixRainOpacity } = useIDEStore();
  const didInit = useRef(false);
  const [consoleHeight, setConsoleHeight] = useState(DEFAULT_CONSOLE_HEIGHT);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [isPopoutMode, setIsPopoutMode] = useState(false);
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
    }
  }, [setActiveView]);


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
        return <UmayMasterTerminalPanel />;
      case "umay-boss":
        return <UmayBossTerminal />;
      case "holding-ecosystem":
        return <HoldingEcosystemPanel />;
      case "tatar-finans":
        return <TatarFinansPanel />;
      case "nur-kids":
        return <NurKidsPanel />;
      case "nur-education":
        return <NurEducationPanel />;
      case "compute-access":
        return <ComputeForAccessPanel />;
      case "geophysics-resources":
        return <GeophysicsResourcesPanel />;
      case "resource-intelligence":
        return <ResourceIntelligencePanel />;
      case "institutional-suite":
        return <InstitutionalSuitePanel />;
      case "orbital-telemetry":
        return <OrbitalTelemetryPanel />;
      case "galactic-fleet":
        return <GalacticFleetPanel />;
      case "orbital-command":
        return <OrbitalCommandPanel />;
      case "civilization-terminals":
        return <CivilizationTerminalPanel onClose={() => setActiveView("dashboard")} />;
      case "civilization-arbitrage":
        return <CivilizationArbitrageEngine onClose={() => setActiveView("dashboard")} />;
      case "master-fleet-mining":
        return <MasterFleetMiningAdminPanel />;
      case "fleet-miner":
        return <FleetMinerPanel />;
      case "professional-ai":
        return <ProfessionalAIHubPanel />;
      case "professional-social":
        return <FinancialSocialPanel />;
      case "user-profile":
        return <UserProfilePanel />;
      case "profession-hub":
        return <ProfessionHubPanel />;
      case "wish-framework":
        return <WISHFrameworkPanel />;
      case "dashboard":
        return <DashboardPanel />;
      case "portfolio":
        return <PortfolioManager />;
      case "charts":
        return <ChartsPanel />;
      case "backtest":
        return <BacktestPanel />;
      case "oms-ems":
        return <OMSEMSPanel />;
      case "quant-copilot":
        return <AIQuantCopilot />;
      case "broadcast-studio":
        return <BroadcastStudioPanel />;
      case "verification-portal":
        return <VerificationPanel />;
      case "wallet-gateway":
        return <DigitalWalletGateway />;
      case "nur-coin":
        return <NurCoinEcosystemPanel />;
      case "global-markets":
        return <GlobalMarketsPanel />;
      case "economic-data":
        return <EconomicDataPanel />;
      case "data-ingest":
        return <DataIngestPanel />;
      case "geopolitics":
        return (
          <CockpitFrame showControls>
            <GeopoliticsPanel />
          </CockpitFrame>
        );
      case "fundamentals":
        return <FundamentalsPanel />;
      case "screener":
        return <ScreenerPanel />;
      case "news-feed":
        return <NewsFeedPanel />;
      case "encyclopedia":
        return <EncyclopediaPanel />;
      case "pricing":
        return <PricingPanel />;
      case "media":
        return <MediaPanel />;
      case "live-tv":
        return <LiveBroadcast />;
      case "options":
        return <OptionsPanel />;
      case "ai-tools":
        return <AIToolsPanel />;
      case "macro-risk":
        return <MacroRiskPanel />;
      case "news":
        return <MarketBriefsPanel />;
      case "alerts":
        return <RiskAlertsPanel />;
      case "research":
        return <ResearchPanel />;
      case "terminal":
        return <NURTerminalPanel />;
      case "editor":
      default:
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

