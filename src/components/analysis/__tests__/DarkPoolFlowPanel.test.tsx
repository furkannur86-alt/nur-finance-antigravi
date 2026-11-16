import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DarkPoolFlowPanel from "../DarkPoolFlowPanel";

describe("DarkPoolFlowPanel", () => {
  it("renders the panel header", () => {
    render(<DarkPoolFlowPanel />);
    expect(screen.getByText("DARK POOL FLOW")).toBeTruthy();
  });

  it("shows stats for FINRA ATS data", () => {
    render(<DarkPoolFlowPanel />);
    expect(screen.getByText("TOTAL ATS VOL")).toBeTruthy();
    expect(screen.getByText("AVG DARK SHARE")).toBeTruthy();
  });

  it("renders ticker rows", () => {
    render(<DarkPoolFlowPanel />);
    expect(screen.getByText("NVDA")).toBeTruthy();
    expect(screen.getByText("TSLA")).toBeTruthy();
  });

  it("shows unusual alert count", () => {
    render(<DarkPoolFlowPanel />);
    expect(screen.getByText("UNUSUAL ALERTS")).toBeTruthy();
  });
});
