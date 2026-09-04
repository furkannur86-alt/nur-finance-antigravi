"use client";

import Link from "next/link";

export default function WiderrufPage() {
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
          On-Chain Settlement & Cancellation Policy
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>1. Cryptographic Settlement Finality</h2>
          <div style={card}>
            <p>
              All license activations, quantitative compute time, and institutional API keys are provisioned 
              immediately upon cryptographic transaction confirmation on-chain.
            </p>
            <p style={{ marginTop: 12 }}>
              Because digital computational resources and live market feeds are provisioned instantly without custodial intermediary holding, 
              on-chain transactions are irreversible once broadcast to the decentralized network.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>2. Subscription Management & Key Revocation</h2>
          <div style={card}>
            <p>
              Users may discontinue renewal at any time by halting further on-chain subscription transfers. 
              Access will remain active until the conclusion of the paid cryptographic billing epoch.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>3. Inquiries</h2>
          <div style={card}>
            <p>For protocol inquiries or technical assistance: <code>ops@nurfinans.com</code></p>
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

