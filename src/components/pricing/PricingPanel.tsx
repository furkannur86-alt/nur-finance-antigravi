"use client";

import { useState } from "react";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  color: string;
}

const tiers: PricingTier[] = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    period: "",
    description: "Access public market data, basic charts, and the financial encyclopedia.",
    features: [
      "Real-time market overview",
      "Basic charting tools",
      "Financial encyclopedia access",
      "Global news feed",
      "5 stock screener queries/day",
      "Community forums",
    ],
    color: "#6b7280",
  },
  {
    id: "analyst",
    name: "Analyst",
    price: "€255",
    period: "/month",
    description: "Full platform access with advanced analytics and per-stock AI reports.",
    features: [
      "Everything in Explorer",
      "Advanced technical indicators (50+)",
      "Fundamental analysis tools",
      "AI-powered stock reports (10/month)",
      "Portfolio tracking & analytics",
      "Backtesting engine (basic strategies)",
      "Economic data dashboard",
      "Geopolitical risk monitor",
      "Email alerts & notifications",
      "Export data (CSV/PDF)",
    ],
    highlight: true,
    badge: "Most Popular",
    color: "#00d4aa",
  },
  {
    id: "professional",
    name: "Professional",
    price: "€1,500",
    period: "/month",
    description: "Institutional-grade tools for professional traders and fund managers.",
    features: [
      "Everything in Analyst",
      "Unlimited AI stock reports",
      "Advanced backtesting (custom strategies)",
      "Options & derivatives analytics",
      "Real-time data feeds (all exchanges)",
      "API access (100K calls/month)",
      "Multi-asset portfolio optimization",
      "Risk management suite (VaR, CVaR)",
      "Sector heatmaps & flow analysis",
      "Priority support (4h response)",
      "Custom watchlists (unlimited)",
      "Satellite & supply chain data",
    ],
    color: "#6366f1",
  },
  {
    id: "terminal",
    name: "NUR Terminal",
    price: "€8,500",
    period: "/month",
    description: "The ultimate financial workstation. Bloomberg + Reuters combined, and then some.",
    features: [
      "Everything in Professional",
      "NUR Terminal full access",
      "All global exchanges real-time",
      "Dedicated computing resources",
      "AI trading signals & strategies",
      "Custom algorithm deployment",
      "Direct market access (DMA)",
      "FIX protocol connectivity",
      "White-glove onboarding",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom integrations & API",
      "NUR Media live channels access",
      "Compliance & audit tools",
    ],
    badge: "Enterprise",
    color: "#f59e0b",
  },
];

const performanceTiers = [
  {
    id: "starter-fund",
    name: "Managed Portfolio - Starter",
    minInvestment: "€3,000",
    description: "AI-guided investment for smaller portfolios with curated high-conviction picks.",
    profitShare: "25%",
    features: ["AI-selected stock picks", "Risk-adjusted position sizing", "Monthly rebalancing", "Performance dashboard"],
  },
  {
    id: "growth-fund",
    name: "Managed Portfolio - Growth",
    minInvestment: "€10,000",
    description: "Diversified portfolio with sector rotation and momentum strategies.",
    profitShare: "20%",
    features: ["Multi-strategy allocation", "Weekly rebalancing", "Options hedging", "Dedicated analyst", "Tax-loss harvesting"],
  },
  {
    id: "premium-fund",
    name: "Managed Portfolio - Premium",
    minInvestment: "€100,000",
    description: "Full institutional strategy suite with global macro and quantitative alpha.",
    profitShare: "15%",
    features: ["Global macro strategies", "Quantitative alpha generation", "Daily rebalancing", "Direct fund manager access", "Custom risk parameters", "Private research reports"],
  },
];

export default function PricingPanel() {
  const [tab, setTab] = useState<"subscriptions" | "managed">("subscriptions");

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)" }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ag-text)" }}>
            Nur Finance Plans
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--ag-muted)" }}>
            From free market data to the most powerful financial terminal on the planet.
            Choose the plan that fits your ambition.
          </p>
        </div>

        <div className="flex justify-center gap-1 mb-8 p-1 rounded-lg w-fit mx-auto" style={{ background: "var(--ag-surface)" }}>
          {(["subscriptions", "managed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded text-xs font-medium transition-colors capitalize"
              style={{
                background: tab === t ? "var(--ag-accent)" : "transparent",
                color: tab === t ? "var(--ag-bg)" : "var(--ag-muted)",
              }}
            >
              {t === "subscriptions" ? "Platform Subscriptions" : "Managed Portfolios"}
            </button>
          ))}
        </div>

        {tab === "subscriptions" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="relative flex flex-col rounded-xl border p-5 transition-all hover:scale-[1.02]"
                style={{
                  borderColor: tier.highlight ? tier.color : "var(--ag-border)",
                  background: "var(--ag-surface)",
                  boxShadow: tier.highlight ? `0 0 24px ${tier.color}15` : "none",
                }}
              >
                {tier.badge && (
                  <span
                    className="absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: tier.color, color: "#000" }}
                  >
                    {tier.badge}
                  </span>
                )}
                <div className="mb-4">
                  <h2 className="text-sm font-bold mb-1" style={{ color: tier.color }}>{tier.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ color: "var(--ag-text)" }}>{tier.price}</span>
                    {tier.period && <span className="text-xs" style={{ color: "var(--ag-muted)" }}>{tier.period}</span>}
                  </div>
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--ag-muted)" }}>{tier.description}</p>
                </div>

                <ul className="flex-1 space-y-2 mb-4">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16" fill={tier.color}>
                        <path d="M13.5 4.5l-7 7L3 8" fill="none" stroke={tier.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{
                    background: tier.highlight ? tier.color : "transparent",
                    color: tier.highlight ? "#000" : tier.color,
                    border: tier.highlight ? "none" : `1px solid ${tier.color}`,
                  }}
                >
                  {tier.price === "Free" ? "Get Started" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-xl border p-5"
                style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
              >
                <h2 className="text-sm font-bold mb-1" style={{ color: "var(--ag-accent)" }}>{tier.name}</h2>
                <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--ag-muted)" }}>{tier.description}</p>

                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg" style={{ background: "var(--ag-bg)" }}>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Min. Investment</div>
                    <div className="text-lg font-bold" style={{ color: "var(--ag-text)" }}>{tier.minInvestment}</div>
                  </div>
                  <div className="w-px h-8" style={{ background: "var(--ag-border)" }} />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Profit Share</div>
                    <div className="text-lg font-bold" style={{ color: "var(--ag-accent)" }}>{tier.profitShare}</div>
                  </div>
                </div>

                <ul className="flex-1 space-y-2 mb-4">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16" fill="var(--ag-accent)">
                        <path d="M13.5 4.5l-7 7L3 8" fill="none" stroke="var(--ag-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
                  style={{ borderColor: "var(--ag-accent)", color: "var(--ag-accent)" }}
                >
                  Start Investing
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 rounded-xl border text-center" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "var(--ag-text)" }}>
            NUR Terminal Enterprise
          </h3>
          <p className="text-[11px] mb-3 max-w-lg mx-auto" style={{ color: "var(--ag-muted)" }}>
            Dedicated hardware, custom deployment, satellite imagery, media channels, and white-label solutions.
            Starting from &euro;95,000/year with dedicated infrastructure.
          </p>
          <button
            className="px-6 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
