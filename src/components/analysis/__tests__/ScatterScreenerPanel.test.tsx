import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScatterScreenerPanel from "../ScatterScreenerPanel";

describe("ScatterScreenerPanel", () => {
  it("renders panel header", () => {
    render(<ScatterScreenerPanel />);
    expect(screen.getByText("SCATTER SCREENER")).toBeTruthy();
  });

  it("shows axis selectors", () => {
    render(<ScatterScreenerPanel />);
    expect(screen.getByText("X-AXIS:")).toBeTruthy();
    expect(screen.getByText("Y-AXIS:")).toBeTruthy();
  });

  it("renders an SVG chart element", () => {
    const { container } = render(<ScatterScreenerPanel />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("shows bubble size legend hint", () => {
    render(<ScatterScreenerPanel />);
    expect(screen.getByText("Bubble size = Market Cap")).toBeTruthy();
  });
});
