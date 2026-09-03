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
          &larr; Zurück zur Startseite
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Datenschutzerklärung
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>1. Verantwortlicher</h2>
          <div style={card}>
            <p><strong>NUR Finance GmbH (i.Gr.)</strong></p>
            <p>[PLACEHOLDER Straße und Hausnummer]</p>
            <p>60311 Frankfurt am Main, Deutschland</p>
            <p>E-Mail: info@nur.finance</p>
            <p style={{ marginTop: 8 }}>
              Datenschutzbeauftragter: [PLACEHOLDER Name und Kontaktdaten]
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <div style={card}>
            <p>Wir erheben und verarbeiten personenbezogene Daten in folgenden Fällen:</p>
            <ul style={list}>
              <li>Bei der Registrierung und Nutzung unseres Dienstes (Name, E-Mail-Adresse, Unternehmenszugehörigkeit)</li>
              <li>Bei der Verifizierung der Bloomberg-/Reuters-Nutzungshistorie</li>
              <li>Bei der Abwicklung von Zahlungen (Zahlungsdaten werden durch unseren Zahlungsdienstleister verarbeitet)</li>
              <li>Beim Besuch unserer Website (technische Daten wie IP-Adresse, Browsertyp, Zugriffszeit)</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Rechtsgrundlage: Art. 6 Abs. 1 lit. a, b und f DSGVO.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>3. Cookies</h2>
          <div style={card}>
            <p>
              Unsere Website verwendet Cookies. Technisch notwendige Cookies werden auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO eingesetzt. Für alle anderen Cookies holen wir Ihre
              Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO ein.
            </p>
            <ul style={list}>
              <li><strong>Notwendige Cookies:</strong> Session-Management, Authentifizierung</li>
              <li><strong>Funktionale Cookies:</strong> Benutzereinstellungen, Layout-Präferenzen</li>
              <li><strong>Analyse-Cookies:</strong> [PLACEHOLDER — z.B. Plausible, Matomo]</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>4. Analysedienste</h2>
          <div style={card}>
            <p>
              [PLACEHOLDER — Beschreibung der eingesetzten Analysedienste, z.B. Plausible Analytics,
              Matomo oder vergleichbare DSGVO-konforme Dienste.]
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>5. Drittanbieter-Dienste</h2>
          <div style={card}>
            <h3 style={subTitle}>EODHD (Marktdaten)</h3>
            <p>
              Wir nutzen die API von EODHD (EOD Historical Data) zur Bereitstellung von
              Finanzmarktdaten. Dabei werden technische Verbindungsdaten an EODHD-Server übertragen.
              Weitere Informationen: <span style={{ color: "var(--ag-accent)" }}>https://eodhd.com/privacy-policy</span>
            </p>

            <h3 style={{ ...subTitle, marginTop: 16 }}>Supabase (Datenbank)</h3>
            <p>
              Wir verwenden Supabase als Datenbankdienst. Personenbezogene Daten werden auf
              Supabase-Servern gespeichert. Supabase bietet Hosting in der EU an.
              Weitere Informationen: <span style={{ color: "var(--ag-accent)" }}>https://supabase.com/privacy</span>
            </p>

            <h3 style={{ ...subTitle, marginTop: 16 }}>FRED (Wirtschaftsdaten)</h3>
            <p>
              Zur Anzeige volkswirtschaftlicher Daten nutzen wir die API der Federal Reserve Bank of
              St. Louis (FRED). Es werden keine personenbezogenen Daten an FRED übermittelt.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>6. Datenweitergabe</h2>
          <div style={card}>
            <p>
              Eine Weitergabe personenbezogener Daten an Dritte erfolgt nur, soweit dies zur
              Vertragserfüllung erforderlich ist oder Sie ausdrücklich eingewilligt haben.
              Eine Übermittlung in Drittstaaten findet nur unter Einhaltung der Voraussetzungen
              der Art. 44 ff. DSGVO statt.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>7. Speicherdauer</h2>
          <div style={card}>
            <p>
              Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.
              Für vertragliche Daten gelten die gesetzlichen Aufbewahrungsfristen (6 bzw. 10 Jahre
              gemäß HGB und AO).
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>8. Ihre Rechte</h2>
          <div style={card}>
            <p>Sie haben gemäß DSGVO folgende Rechte:</p>
            <ul style={list}>
              <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
              <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
              <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
              <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
              <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
              <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
              <li><strong>Recht auf Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO)</li>
              <li><strong>Beschwerderecht bei einer Aufsichtsbehörde</strong> (Art. 77 DSGVO)</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Zuständige Aufsichtsbehörde: Der Hessische Beauftragte für Datenschutz und
              Informationsfreiheit, Postfach 3163, 65021 Wiesbaden.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>9. Änderungen</h2>
          <div style={card}>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
              aktuellen rechtlichen Anforderungen entspricht.
            </p>
            <p style={{ marginTop: 8, color: "var(--ag-muted)" }}>
              Stand: [PLACEHOLDER Datum]
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

const subTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 4,
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
