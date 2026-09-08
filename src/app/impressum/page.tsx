"use client";

import Link from "next/link";

export default function ImpressumPage() {
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
          Legal & Protocol Governance Notice
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>1. Protocol & Architecture Specification</h2>
          <div style={card}>
            <p><strong>NUR Finance Sovereign Network</strong></p>
            <p><em>Dominus Orientis et Occidentis</em></p>
            <p>Decentralized Quantitative Computing Protocol & Sovereign Cloud Node</p>
            <p>Domain: <code>nurfinans.com</code></p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>2. Settlement & Payment Infrastructure</h2>
          <div style={card}>
            <p>
              NUR Finance accepts transactions exclusively through decentralized, zero-PII multi-chain 
              cryptographic settlement (USDT / USDC on Polygon, Arbitrum, Ethereum, TRON, and Bitcoin).
            </p>
            <p style={{ marginTop: 8 }}>
              No centralized fiat banking rails, no personal data harvesting, and no custodial identity storage.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>3. Governance & Protocol Desk</h2>
          <div style={card}>
            <p>PGP Verified Protocol Contact: <code>ops@nurfinans.com</code></p>
            <p>Decentralized Mesh Node: <code>NUR-SOVEREIGN-NET-001</code></p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>4. Disclaimer & Risk Acknowledgment</h2>
          <div style={card}>
            <p>
              The algorithmic modules, quantitative indicators, and market models provided within the NUR Finance Terminal 
              are for advanced quantitative analysis, institutional research, and automated workflow optimization. 
              They do not constitute bespoke investment or fiduciary advice.
            </p>
            <p style={{ marginTop: 8 }}>
              Users operate under sovereign self-custody and algorithmic verification.
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

