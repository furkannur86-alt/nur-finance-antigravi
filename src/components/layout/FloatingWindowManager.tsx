"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useIDEStore } from "@/stores/useIDEStore";
import FloatingWindow from "./FloatingWindow";
import { PanelView } from "@/types";

// Dynamic imports matching exact app routes
const NurEarth3DGlobe = dynamic(() => import("@/components/geopolitics/NurEarth3DGlobe"), { ssr: false });
const GeopoliticsPanel = dynamic(() => import("@/components/geopolitics/GeopoliticsPanel"), { ssr: false });
const GeophysicsResourcesPanel = dynamic(() => import("@/components/geophysics/GeophysicsResourcesPanel"), { ssr: false });
const ResourceIntelligencePanel = dynamic(() => import("@/components/resources/ResourceIntelligencePanel"), { ssr: false });
const InstitutionalSuitePanel = dynamic(() => import("@/components/institutional/InstitutionalSuitePanel"), { ssr: false });
const OrbitalTelemetryPanel = dynamic(() => import("@/components/orbital/OrbitalTelemetryPanel"), { ssr: false });
const ProfessionalAIHubPanel = dynamic(() => import("@/components/professional/ProfessionalAIHubPanel"), { ssr: false });
const FinancialSocialPanel = dynamic(() => import("@/components/social/FinancialSocialPanel"), { ssr: false });
const UserProfilePanel = dynamic(() => import("@/components/social/UserProfilePanel"), { ssr: false });
const ProfessionHubPanel = dynamic(() => import("@/components/social/ProfessionHubPanel"), { ssr: false });
const WISHFrameworkPanel = dynamic(() => import("@/components/trading/WISHFrameworkPanel"), { ssr: false });
const BroadcastStudioPanel = dynamic(() => import("@/components/media/BroadcastStudioPanel"), { ssr: false });
const UmayBossTerminal = dynamic(() => import("@/components/umay/UmayBossTerminal"), { ssr: false });
const HoldingEcosystemPanel = dynamic(() => import("@/components/holding/HoldingEcosystemPanel"), { ssr: false });
const TatarFinansPanel = dynamic(() => import("@/components/tatar/TatarFinansPanel"), { ssr: false });
const NurKidsPanel = dynamic(() => import("@/components/kids/NurKidsPanel"), { ssr: false });
const NurEducationPanel = dynamic(() => import("@/components/education/NurEducationPanel"), { ssr: false });
const ComputeForAccessPanel = dynamic(() => import("@/components/compute/ComputeForAccessPanel"), { ssr: false });
const PricingPanel = dynamic(() => import("@/components/pricing/PricingPanel"), { ssr: false });
const VerificationPanel = dynamic(() => import("@/components/pricing/VerificationPanel"), { ssr: false });
const EncyclopediaPanel = dynamic(() => import("@/components/encyclopedia/EncyclopediaPanel"), { ssr: false });
const NewsFeedPanel = dynamic(() => import("@/components/news/NewsFeedPanel"), { ssr: false });
const MarketBriefsPanel = dynamic(() => import("@/components/nfs/MarketBriefsPanel"), { ssr: false });
const RiskAlertsPanel = dynamic(() => import("@/components/nfs/RiskAlertsPanel"), { ssr: false });
const ResearchPanel = dynamic(() => import("@/components/nfs/ResearchPanel"), { ssr: false });
const LiveBroadcast = dynamic(() => import("@/components/media/LiveBroadcast"), { ssr: false });
const MediaPanel = dynamic(() => import("@/components/media/MediaPanel"), { ssr: false });
const ChartsPanel = dynamic(() => import("@/components/dashboard/ChartsPanel"), { ssr: false });
const OMSEMSPanel = dynamic(() => import("@/components/trading/OMSEMSPanel"), { ssr: false });
const AIQuantCopilot = dynamic(() => import("@/components/ai/AIQuantCopilot"), { ssr: false });
const DigitalWalletGateway = dynamic(() => import("@/components/trading/DigitalWalletGateway"), { ssr: false });
const NurCoinEcosystemPanel = dynamic(() => import("@/components/crypto/NurCoinEcosystemPanel"), { ssr: false });
const TerminalPanel = dynamic(() => import("@/components/terminal/TerminalPanel"), { ssr: false });
const NURTerminalPanel = dynamic(() => import("@/components/terminal/NURTerminalPanel"), { ssr: false });
const GlobalMarketsPanel = dynamic(() => import("@/components/markets/GlobalMarketsPanel"), { ssr: false });
const EconomicDataPanel = dynamic(() => import("@/components/markets/EconomicDataPanel"), { ssr: false });
const FundamentalsPanel = dynamic(() => import("@/components/fundamentals/FundamentalsPanel"), { ssr: false });
const ScreenerPanel = dynamic(() => import("@/components/screener/ScreenerPanel"), { ssr: false });
const MacroRiskPanel = dynamic(() => import("@/components/macro/MacroRiskPanel"), { ssr: false });
const DashboardPanel = dynamic(() => import("@/components/dashboard/DashboardPanel"), { ssr: false });
const PortfolioManager = dynamic(() => import("@/components/portfolio/PortfolioManager"), { ssr: false });
const BacktestPanel = dynamic(() => import("@/components/backtest/BacktestPanel"), { ssr: false });
const OptionsPanel = dynamic(() => import("@/components/derivatives/OptionsPanel"), { ssr: false });
const AIToolsPanel = dynamic(() => import("@/components/ai/AIToolsPanel"), { ssr: false });

export default function FloatingWindowManager() {
  const { floatingWindows, closeFloatingWindow, focusFloatingWindow } = useIDEStore();

  if (floatingWindows.length === 0) return null;

  const renderModule = (view: PanelView) => {
    switch (view) {
      case "geopolitics":
        return <NurEarth3DGlobe />;
      case "geophysics-resources":
        return <GeophysicsResourcesPanel />;
      case "resource-intelligence":
        return <ResourceIntelligencePanel />;
      case "institutional-suite":
        return <InstitutionalSuitePanel />;
      case "orbital-telemetry":
        return <OrbitalTelemetryPanel />;
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
      case "broadcast-studio":
        return <BroadcastStudioPanel />;
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
      case "pricing":
        return <PricingPanel />;
      case "verification-portal":
        return <VerificationPanel />;
      case "encyclopedia":
        return <EncyclopediaPanel />;
      case "news-feed":
        return <NewsFeedPanel />;
      case "news":
        return <MarketBriefsPanel />;
      case "alerts":
        return <RiskAlertsPanel />;
      case "research":
        return <ResearchPanel />;
      case "live-tv":
        return <LiveBroadcast />;
      case "media":
        return <MediaPanel />;
      case "charts":
        return <ChartsPanel />;
      case "oms-ems":
        return <OMSEMSPanel />;
      case "quant-copilot":
        return <AIQuantCopilot />;
      case "wallet-gateway":
        return <DigitalWalletGateway />;
      case "nur-coin":
        return <NurCoinEcosystemPanel />;
      case "terminal":
        return <NURTerminalPanel />;
      case "global-markets":
        return <GlobalMarketsPanel />;
      case "economic-data":
        return <EconomicDataPanel />;
      case "fundamentals":
        return <FundamentalsPanel />;
      case "screener":
        return <ScreenerPanel />;
      case "macro-risk":
        return <MacroRiskPanel />;
      case "portfolio":
        return <PortfolioManager />;
      case "backtest":
        return <BacktestPanel />;
      case "options":
        return <OptionsPanel />;
      case "ai-tools":
        return <AIToolsPanel />;
      case "dashboard":
      default:
        return <DashboardPanel />;
    }
  };

  const minimizedWindows = floatingWindows.filter((w) => w.isMinimized);

  return (
    <>
      {/* Active Floating & Resizable Windows */}
      {floatingWindows.map((win) => (
        <FloatingWindow key={win.id} config={win}>
          {renderModule(win.view)}
        </FloatingWindow>
      ))}

      {/* Floating Taskbar Dock for Minimized Windows */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-cyan-500/50 shadow-2xl shadow-cyan-950 font-mono text-xs">
          <span className="text-[10px] text-cyan-400 font-bold px-2 flex items-center gap-1.5 border-r border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>MODULAR DOCK ({minimizedWindows.length})</span>
          </span>
          {minimizedWindows.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group"
              onClick={() => focusFloatingWindow(w.id)}
            >
              <span className="text-white font-bold text-[11px] group-hover:text-cyan-300">
                {w.title.split(" ")[0]} {w.title.split(" ")[1] || ""}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFloatingWindow(w.id);
                }}
                className="text-slate-500 hover:text-red-400 text-[10px] font-bold ml-1"
                title="Close"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
