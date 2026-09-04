"use client";

import Link from "next/link";

export default function DatenschutzPage() {
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
          Zero-PII Sovereign Privacy Policy
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>1. Zero Personally Identifiable Information (Zero-PII) Standard</h2>
          <div style={card}>
            <p>
              <strong>NUR Finance operates on a cryptographic Zero-PII (Zero Personally Identifiable Information) standard.</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              We do not collect names, personal identity documents, government IDs, physical addresses, or phone numbers. 
              All terminal activations, quantitative data access, and protocol interactions occur via decentralized wallet addresses 
              and cryptographic public keys.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>2. Multi-Chain Cryptographic Settlement</h2>
          <div style={card}>
            <p>
              Subscriptions and institutional terminal licenses are settled exclusively on-chain via multi-chain smart contracts 
              and transaction hashes (TXID) on Polygon, Arbitrum, Ethereum, TRON, or Bitcoin networks.
            </p>
            <p style={{ marginTop: 8 }}>
              No centralized credit card processors, payment intermediaries, or custodial identity databases are used.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>3. Local-First Client Execution</h2>
          <div style={card}>
            <p>
              Your algorithms, order execution parameters, simulated portfolios, and custom Python quant scripts run 
              locally inside your browser engine and local sandboxes.
            </p>
            <p style={{ marginTop: 8 }}>
              NUR Finance does not harvest proprietary trade signals, strategy alpha, or client execution logs.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>4. Protocol Contact</h2>
          <div style={card}>
            <p>Cryptographic Communications: <code>ops@nurfinans.com</code></p>
            <p>Sovereign Protocol Hash: <code>NUR-ZERO-PII-2026</code></p>
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

