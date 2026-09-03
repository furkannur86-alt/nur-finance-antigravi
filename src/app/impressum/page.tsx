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
          &larr; Zurück zur Startseite
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Impressum
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Angaben gemäß § 5 TMG</h2>
          <div style={card}>
            <p><strong>NUR Finance GmbH (i.Gr.)</strong></p>
            <p>[PLACEHOLDER Straße und Hausnummer]</p>
            <p>60311 Frankfurt am Main</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Handelsregister</h2>
          <div style={card}>
            <p>Registergericht: Amtsgericht Frankfurt am Main</p>
            <p>Registernummer: [PLACEHOLDER HRB-Nummer]</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Geschäftsführung</h2>
          <div style={card}>
            <p>[PLACEHOLDER Name des Geschäftsführers]</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Kontakt</h2>
          <div style={card}>
            <p>E-Mail: info@nur.finance</p>
            <p>Telefon: [PLACEHOLDER Telefonnummer]</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Umsatzsteuer-ID</h2>
          <div style={card}>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</p>
            <p>[PLACEHOLDER USt-IdNr. DE...]</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div style={card}>
            <p>[PLACEHOLDER Name]</p>
            <p>[PLACEHOLDER Anschrift]</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Streitschlichtung</h2>
          <div style={card}>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit: <span style={{ color: "var(--ag-accent)" }}>https://ec.europa.eu/consumers/odr</span>
            </p>
            <p style={{ marginTop: 8 }}>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>Haftungsausschluss</h2>
          <div style={card}>
            <p>
              Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Der Anbieter
              übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der
              bereitgestellten Inhalte. Die Nutzung der Inhalte der Website erfolgt auf eigene Gefahr.
            </p>
            <p style={{ marginTop: 8 }}>
              NUR Finance bietet ausschließlich Finanzinformationen und -daten an.
              Es handelt sich ausdrücklich <strong>nicht</strong> um Anlageberatung.
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
