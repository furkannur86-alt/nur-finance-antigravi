"use client";

import { useState } from "react";

type Tab = "platform" | "terminals" | "managed";

interface PlatformTier {
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

const platformTiers: PlatformTier[] = [
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
];

const managedTiers = [
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
  const [tab, setTab] = useState<Tab>("platform");

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)" }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ag-text)" }}>
            Nur Finance Plans
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--ag-muted)" }}>
            From free market data to the most powerful financial terminals on the planet.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-1 mb-8 p-1 rounded-lg w-fit mx-auto" style={{ background: "var(--ag-surface)" }}>
          {([
            { key: "platform" as Tab, label: "Platform" },
            { key: "terminals" as Tab, label: "NUR Terminals" },
            { key: "managed" as Tab, label: "Managed Portfolios" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                background: tab === t.key ? "var(--ag-accent)" : "transparent",
                color: tab === t.key ? "var(--ag-bg)" : "var(--ag-muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Platform Subscriptions */}
        {tab === "platform" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformTiers.map((tier) => (
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
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16">
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
        )}

        {/* NUR Finance Terminals — B and R */}
        {tab === "terminals" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* NUR Finance R */}
              <div className="rounded-xl border p-6" style={{ borderColor: "#3b82f6", background: "var(--ag-surface)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: "#3b82f620", color: "#3b82f6" }}>
                    R
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#3b82f6" }}>NUR Finance R</h2>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Reuters-Tier Terminal</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold" style={{ color: "var(--ag-text)" }}>~€95,000</span>
                  <span className="text-xs" style={{ color: "var(--ag-muted)" }}>/year</span>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--ag-muted)" }}>
                  Surpasses Reuters Eikon. Real-time news, research, media channels, and institutional-grade data feeds across all global markets.
                </p>

                {/* Access Requirements */}
                <div className="rounded-lg p-3 mb-4" style={{ background: "#3b82f608", border: "1px solid #3b82f620" }}>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#3b82f6" }}>
                    Access Requirements
                  </h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: "#3b82f6" }}>1.</span>
                      <span><strong>Minimum 1 year of active Reuters usage</strong> — verified through documentation or system integration</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: "#3b82f6" }}>2.</span>
                      <span>No invitation required — open to all qualified applicants</span>
                    </li>
                  </ul>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    "All Professional platform features",
                    "Real-time data: all global exchanges",
                    "NUR Media live channels (8 languages)",
                    "AI-powered market intelligence",
                    "Research & analysis engine",
                    "Geopolitical risk monitoring",
                    "Custom API integrations",
                    "Dedicated account manager",
                    "24/7 priority support",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16">
                        <path d="M13.5 4.5l-7 7L3 8" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: "#3b82f6", color: "#fff" }}
                >
                  Apply for NUR Finance R
                </button>
              </div>

              {/* NUR Finance B */}
              <div className="rounded-xl border p-6 relative" style={{ borderColor: "#f59e0b", background: "var(--ag-surface)", boxShadow: "0 0 32px rgba(245,158,11,0.08)" }}>
                <span className="absolute -top-2.5 right-4 text-[10px] px-2.5 py-0.5 rounded-full font-bold" style={{ background: "#f59e0b", color: "#000" }}>
                  Invitation Only
                </span>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: "#f59e0b20", color: "#f59e0b" }}>
                    B
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#f59e0b" }}>NUR Finance B</h2>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Bloomberg-Tier Terminal</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold" style={{ color: "var(--ag-text)" }}>~€100,000</span>
                  <span className="text-xs" style={{ color: "var(--ag-muted)" }}>/year</span>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--ag-muted)" }}>
                  Surpasses Bloomberg Terminal. The most powerful financial workstation ever built. Direct market access, algorithmic trading, FIX connectivity, and every data feed on the planet.
                </p>

                {/* Access Requirements */}
                <div className="rounded-lg p-3 mb-4" style={{ background: "#f59e0b08", border: "1px solid #f59e0b20" }}>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#f59e0b" }}>
                    Access Requirements
                  </h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: "#f59e0b" }}>1.</span>
                      <span><strong>Minimum 1 year of active Bloomberg usage</strong> — verified through documentation</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: "#f59e0b" }}>2.</span>
                      <span><strong>Confirmed invitation</strong> from NUR Finance-approved personnel via secure email verification</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: "#f59e0b" }}>3.</span>
                      <span>Bloomberg history is necessary but <strong>not sufficient</strong> — invitation required</span>
                    </li>
                  </ul>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    "Everything in NUR Finance R",
                    "Direct Market Access (DMA)",
                    "FIX protocol connectivity",
                    "Custom algorithm deployment",
                    "AI trading signals & strategies",
                    "Dedicated computing resources",
                    "Compliance & audit tools",
                    "White-glove onboarding",
                    "White-label solutions available",
                    "Dedicated infrastructure",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16">
                        <path d="M13.5 4.5l-7 7L3 8" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: "#f59e0b", color: "#000" }}
                >
                  Request Invitation
                </button>
              </div>
            </div>

            {/* Transition Rules */}
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--ag-text)" }}>
                Terminal Transition Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg p-3" style={{ background: "var(--ag-bg)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>ALLOWED</span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <strong>Bloomberg user</strong> &rarr; NUR Finance B <span style={{ color: "var(--ag-muted)" }}>(with 1yr history + invitation)</span>
                    </li>
                    <li className="text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <strong>Reuters user</strong> &rarr; NUR Finance R <span style={{ color: "var(--ag-muted)" }}>(with 1yr history)</span>
                    </li>
                    <li className="text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <strong>NUR Finance B</strong> &rarr; NUR Finance R <span style={{ color: "var(--ag-muted)" }}>(free transition, anytime)</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg p-3" style={{ background: "var(--ag-bg)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: "#ef444418", color: "#ef4444" }}>RESTRICTED</span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <strong>NUR Finance R</strong> &rarr; NUR Finance B:
                    </li>
                    <li className="text-[11px] pl-3" style={{ color: "var(--ag-muted)" }}>
                      1. Purchase Bloomberg subscription
                    </li>
                    <li className="text-[11px] pl-3" style={{ color: "var(--ag-muted)" }}>
                      2. Use Bloomberg for 1 full year (keep NUR R active)
                    </li>
                    <li className="text-[11px] pl-3" style={{ color: "var(--ag-muted)" }}>
                      3. Close Bloomberg, switch to NUR Finance B (+ invitation)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg p-3" style={{ background: "#ef444408", border: "1px solid #ef444420" }}>
                <div className="flex items-start gap-2">
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 16 16">
                    <path d="M8 1l7 14H1L8 1z" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="8" y1="6" x2="8" y2="9.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="12" r="0.8" fill="#ef4444" />
                  </svg>
                  <p className="text-[11px]" style={{ color: "#ef4444" }}>
                    <strong>Warning:</strong> If a NUR Finance R user closes both their Bloomberg subscription AND NUR Finance R during the transition process, they will <strong>permanently</strong> lose access to NUR Finance R. No reinstatement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Managed Portfolios */}
        {tab === "managed" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managedTiers.map((tier) => (
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
                      <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16">
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
      </div>
    </div>
  );
}
