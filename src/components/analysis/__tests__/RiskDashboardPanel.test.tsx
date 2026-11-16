import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RiskDashboardPanel from "../RiskDashboardPanel";

describe("RiskDashboardPanel", () => {
  it("renders the panel header", () => {
    render(<RiskDashboardPanel />);
    expect(screen.getByText("RISK DASHBOARD")).toBeTruthy();
  });

  it("shows VaR metric cards", () => {
    render(<RiskDashboardPanel />);
    expect(screen.getByText("VaR 95% (1D)")).toBeTruthy();
    expect(screen.getByText("VaR 99% (1D)")).toBeTruthy();
  });

  it("shows tab navigation", () => {
    render(<RiskDashboardPanel />);
    expect(screen.getByText("OVERVIEW")).toBeTruthy();
    expect(screen.getByText("STRESS")).toBeTruthy();
    expect(screen.getByText("MONTE CARLO")).toBeTruthy();
    expect(screen.getByText("CORRELATION")).toBeTruthy();
  });

  it("shows Sharpe and Sortino ratios", () => {
    render(<RiskDashboardPanel />);
    expect(screen.getByText("Sharpe Ratio")).toBeTruthy();
    expect(screen.getByText("Sortino Ratio")).toBeTruthy();
  });
});
