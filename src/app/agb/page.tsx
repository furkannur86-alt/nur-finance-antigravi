"use client";

import Link from "next/link";

export default function AGBPage() {
  return (
    <div style={{ background: "var(--ag-bg)", color: "var(--ag-text)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <Link
          href="/"
          style={{ color: "var(--ag-accent)", textDecoration: "none", fontSize: 14 }}
        >
          &larr; Return to Terminal
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Terms of Service
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 1 Scope</h2>
          <div style={card}>
            <p>
              These Terms govern access to the <strong>NUR Finance</strong> platform,
              the AntiGravi Terminal, algorithmic OMS/EMS execution engines, and all associated financial data services.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 2 Service Tiers</h2>
          <div style={card}>
            <p>NUR Finance offers tiered access:</p>
            <ul style={list}>
              <li><strong>Retail</strong> &mdash; Free (limited) or &euro;29&ndash;&euro;49/month. Delayed data feeds, watchlists, news, basic charts, portfolio tracker.</li>
              <li><strong>Professional</strong> &mdash; &euro;199/month. Real-time Level 1 &amp; Level 2 data, 60 FPS interactive charts, full options chain with Greeks, AI copilot, unlimited layouts.</li>
              <li><strong>Institutional</strong> &mdash; &euro;999+/month. Everything in Professional plus multi-seat team administration, FIX Protocol DMA, compliance audit logs, dedicated war room view, custom API access.</li>
            </ul>
            <p style={{ marginTop: 8 }}>
              No prerequisites, no invitation system. All tiers are available via instant checkout (credit card, SEPA, wire transfer, or enterprise invoice).
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 3 Payments &amp; Billing</h2>
          <div style={card}>
            <p>
              Subscription fees are processed through standard institutional payment gateways (Stripe, SEPA direct debit, or wire transfer for enterprise accounts).
              All prices are in EUR unless otherwise stated. Subscriptions renew automatically unless cancelled before the billing cycle ends.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 4 Disclaimer &mdash; No Investment Advice</h2>
          <div style={card}>
            <p style={{ fontWeight: 600, color: "var(--ag-warning)", marginBottom: 8 }}>
              IMPORTANT NOTICE
            </p>
            <p>
              NUR Finance provides computational quantitative analytics, algorithmic order simulation, and macro data feeds.
              The platform does not act as a custodial broker, fiduciary wealth manager, or registered investment advisor.
              Execution and portfolio allocations are performed at the sole discretion and risk of the user.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 5 Intellectual Property &amp; Privacy</h2>
          <div style={card}>
            <p>
              All quantitative algorithms, mathematical formulas, and interface designs are protected under registered intellectual property claims.
              User data is handled in accordance with applicable data protection regulations (GDPR). Client data and algorithmic scripts remain local to the user&apos;s runtime environment.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>&sect; 6 Data Usage &amp; Market Data</h2>
          <div style={card}>
            <p>
              Market data provided through the platform is sourced from licensed data providers.
              Redistribution of real-time data feeds without authorization is prohibited.
              Delayed data (15-minute) is available on the free tier; real-time data requires a Professional or Institutional subscription.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>&sect; 7 Governing Law</h2>
          <div style={card}>
            <p>
              These terms are governed by the laws of the Federal Republic of Germany. Any disputes arising from the use of NUR Finance services shall be subject to the jurisdiction of the courts in Frankfurt am Main.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
  color: "var(--ag-accent)",
};

const card: React.CSSProperties = {
  background: "var(--ag-surface)",
  border: "1px solid var(--ag-border)",
  borderRadius: 8,
  padding: 20,
  lineHeight: 1.7,
};

const list: React.CSSProperties = {
  marginTop: 8,
  paddingLeft: 20,
  listStyleType: "disc",
  lineHeight: 2,
};
