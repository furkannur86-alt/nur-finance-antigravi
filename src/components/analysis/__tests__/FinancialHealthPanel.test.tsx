import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinancialHealthPanel from "../FinancialHealthPanel";

describe("FinancialHealthPanel", () => {
  it("renders score header", () => {
    render(<FinancialHealthPanel />);
    expect(screen.getByText("FINANCIAL HEALTH SCORES")).toBeTruthy();
  });

  it("shows all three score names", () => {
    render(<FinancialHealthPanel />);
    expect(screen.getByText("Piotroski F-Score")).toBeTruthy();
    expect(screen.getByText("Altman Z-Score")).toBeTruthy();
    expect(screen.getByText("Beneish M-Score")).toBeTruthy();
  });

  it("lists stock tickers in sidebar", () => {
    render(<FinancialHealthPanel />);
    expect(screen.getByText("NVDA")).toBeTruthy();
    expect(screen.getByText("AAPL")).toBeTruthy();
  });

  it("shows key ratio labels", () => {
    render(<FinancialHealthPanel />);
    expect(screen.getByText("Debt / Equity")).toBeTruthy();
    expect(screen.getByText("Current Ratio")).toBeTruthy();
  });
});
