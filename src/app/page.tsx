"use client";

import { useEffect } from "react";
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

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

export default function Home() {
  const { activeView, sidebarOpen, addConsoleMessage, consoleMessages } = useIDEStore();

  useEffect(() => {
    if (consoleMessages.length === 0) {
      addConsoleMessage({ type: "info", text: "AntiGravi IDE v2.1 - Nur Finance Quantitative Engine" });
      addConsoleMessage({ type: "success", text: "Engine initialized. Ready for development." });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPanel />;
      case "portfolio":
        return <PortfolioManager />;
      case "charts":
        return <ChartsPanel />;
      case "backtest":
        return <BacktestPanel />;
      case "terminal":
        return (
          <iframe
            src="/terminal.html"
            className="w-full h-full border-0"
            title="NUR Finance Terminal"
          />
        );
      case "news":
        return (
          <iframe
            src="/news"
            className="w-full h-full border-0"
            title="NFS Market Briefs"
          />
        );
      case "alerts":
        return (
          <iframe
            src="/alerts"
            className="w-full h-full border-0"
            title="NFS Risk Alerts"
          />
        );
      case "research":
        return (
          <iframe
            src="/research"
            className="w-full h-full border-0"
            title="NFS Equity Research"
          />
        );
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

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--ag-bg)" }}>
      <TopBar />
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && <Sidebar />}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 min-h-0">{renderMainContent()}</div>
          {!["terminal", "news", "alerts", "research"].includes(activeView) && (
            <div style={{ height: 200 }}>
              <TerminalPanel />
            </div>
          )}
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
