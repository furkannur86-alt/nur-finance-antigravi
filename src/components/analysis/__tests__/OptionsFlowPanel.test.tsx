import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OptionsFlowPanel from "../OptionsFlowPanel";

describe("OptionsFlowPanel", () => {
  it("renders panel header", () => {
    render(<OptionsFlowPanel />);
    expect(screen.getByText("OPTIONS FLOW")).toBeTruthy();
  });

  it("shows put/call ratio stat", () => {
    render(<OptionsFlowPanel />);
    expect(screen.getByText("PUT/CALL RATIO")).toBeTruthy();
  });

  it("displays ticker rows", () => {
    render(<OptionsFlowPanel />);
    expect(screen.getByText("NVDA")).toBeTruthy();
    expect(screen.getByText("GME")).toBeTruthy();
  });

  it("shows sector activity section", () => {
    render(<OptionsFlowPanel />);
    expect(screen.getByText("SECTOR OPTION ACTIVITY")).toBeTruthy();
  });
});
