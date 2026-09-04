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
          &larr; Zurück zum Terminal
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Protocol Terms of Service & Quantitative License Agreement
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 1 Scope & Architecture</h2>
          <div style={card}>
            <p>
              These Terms govern the decentralized access to the <strong>NUR Finance Sovereign Network</strong> (<em>Dominus Orientis et Occidentis</em>), 
              the AntiGravi Terminal v3.0, algorithmic OMS/EMS execution engines, and multi-chain settlement gateways.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 2 Institutional Tier Access</h2>
          <div style={card}>
            <p>The protocol provides tiered quantitative access levels:</p>
            <ul style={list}>
              <li><strong>Explorer</strong> — Quantitative research and public macro indicators.</li>
              <li><strong>Analyst</strong> — Advanced screening, multi-factor risk engines, and WISH matrix tools.</li>
              <li><strong>Tier-R Corporate Sovereign</strong> — High-throughput institutional terminal for accredited trading desks.</li>
              <li><strong>Tier-B Enterprise Sovereign</strong> — VIP institutional tier with dedicated neural copilot channels and priority latency routes.</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 3 Decentralized Settlement & Payments</h2>
          <div style={card}>
            <p>
              All licenses, fees, and access keys are settled strictly on-chain through the 
              <strong>Zero-PII Multi-Chain Crypto Settlement Gateway</strong> (USDT/USDC on Polygon, Arbitrum, Ethereum, TRON, or BTC).
            </p>
            <p style={{ marginTop: 8 }}>
              Payments are irreversibly verified on-chain via transaction hash (TXID) without requiring fiat bank KYC, personal identity disclosure, or custodial intermediaries.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 4 Algorithmic Disclaimer — No Fiduciary Advice</h2>
          <div style={card}>
            <p style={{ fontWeight: 600, color: "var(--ag-warning)", marginBottom: 8 }}>
              CRITICAL NOTICE
            </p>
            <p>
              NUR Finance provides computational quantitative analytics, algorithmic order simulation, and macro feeds. 
              The system does not act as a custodial broker, fiduciary wealth manager, or registered investment advisor. 
              Execution and portfolio allocations are performed at the sole discretion and sovereign risk of the operator.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 5 Intellectual Property & Zero-PII Privacy</h2>
          <div style={card}>
            <p>
              All quantitative algorithms, mathematical formulas, and interface designs are protected under registered intellectual property claims. 
              Client data and algorithmic scripts remain local to the user&apos;s runtime environment.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>§ 6 Governing Protocol</h2>
          <div style={card}>
            <p>
              This protocol is governed by sovereign cryptographic code execution and decentralized autonomous consensus.
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

