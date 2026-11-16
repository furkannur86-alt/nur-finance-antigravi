import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WatchlistManagerPanel from "../WatchlistManagerPanel";

describe("WatchlistManagerPanel", () => {
  it("renders the panel header", () => {
    render(<WatchlistManagerPanel />);
    expect(screen.getByText("WATCHLIST MANAGER")).toBeTruthy();
  });

  it("shows default watchlist names", () => {
    render(<WatchlistManagerPanel />);
    expect(screen.getByText("Tech Mega Cap")).toBeTruthy();
    expect(screen.getByText("My Portfolio")).toBeTruthy();
  });

  it("renders ticker items in active list", () => {
    render(<WatchlistManagerPanel />);
    expect(screen.getByText("AAPL")).toBeTruthy();
  });

  it("shows search input", () => {
    render(<WatchlistManagerPanel />);
    expect(screen.getByPlaceholderText("Search & add ticker...")).toBeTruthy();
  });

  it("shows CSV export button", () => {
    render(<WatchlistManagerPanel />);
    expect(screen.getByText("↓ CSV")).toBeTruthy();
  });
});
