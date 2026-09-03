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
          &larr; Zurück zur Startseite
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 1 Geltungsbereich</h2>
          <div style={card}>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der
              NUR Finance GmbH (i.Gr.), Frankfurt am Main (nachfolgend &quot;Anbieter&quot;) und dem Kunden
              (nachfolgend &quot;Nutzer&quot;) über die Nutzung des NUR Finance AntiGravi IDE
              Finanzterminals und zugehöriger Dienste.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 2 Leistungsbeschreibung</h2>
          <div style={card}>
            <p>
              Der Anbieter stellt eine webbasierte Finanzinformations- und Analyseplattform
              bereit. Die verfügbaren Leistungsstufen sind:
            </p>
            <ul style={list}>
              <li><strong>Explorer</strong> — Basisversion mit eingeschränktem Datenzugang</li>
              <li><strong>Analyst</strong> — Erweiterte Analyse- und Screening-Tools</li>
              <li><strong>NUR Finance R</strong> — Reuters-Klasse-Terminal (~100.000 €/Jahr). Voraussetzung: Mindestens 1 Jahr aktive Reuters-Nutzungshistorie</li>
              <li><strong>NUR Finance B</strong> — Bloomberg-Klasse-Terminal (~100.000 €/Jahr). Voraussetzung: Mindestens 1 Jahr aktive Bloomberg-Nutzungshistorie UND eine bestätigte Einladung durch von der Geschäftsführung ausgewählte Personen</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 3 Zugangsvoraussetzungen NUR Finance R und NUR Finance B</h2>
          <div style={card}>
            <p><strong>NUR Finance R:</strong></p>
            <ul style={list}>
              <li>Der Nutzer muss eine nachgewiesene, mindestens einjährige aktive Reuters-Nutzungshistorie vorweisen.</li>
              <li>Keine Einladung erforderlich.</li>
            </ul>
            <p style={{ marginTop: 12 }}><strong>NUR Finance B:</strong></p>
            <ul style={list}>
              <li>Der Nutzer muss eine nachgewiesene, mindestens einjährige aktive Bloomberg-Nutzungshistorie vorweisen.</li>
              <li>Zusätzlich ist eine bestätigte Einladung durch von der Geschäftsführung autorisierte Personen erforderlich.</li>
              <li>Die Identitätsbestätigung erfolgt per E-Mail-Verifizierung.</li>
            </ul>
            <p style={{ marginTop: 12 }}><strong>Wechsel von NUR Finance R zu NUR Finance B:</strong></p>
            <ul style={list}>
              <li>Der Nutzer muss ein Bloomberg-Abonnement erwerben und Bloomberg mindestens ein volles Jahr aktiv nutzen (bei fortlaufendem NUR Finance R-Vertrag).</li>
              <li>Ein Wechsel ist erst nach Ablauf dieses Jahres und mit Einladungsbestätigung möglich.</li>
              <li>Bei gleichzeitiger Kündigung von Bloomberg und NUR Finance R während des Übergangsprozesses erlischt der Zugang zu NUR Finance R dauerhaft.</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 4 Vertragsschluss und Laufzeit</h2>
          <div style={card}>
            <p>
              Der Vertrag kommt durch Registrierung und Bestätigung der Bestellung zustande.
              Die Vertragslaufzeit richtet sich nach dem gewählten Abrechnungszeitraum
              (monatlich oder jährlich). [PLACEHOLDER — genaue Laufzeitbedingungen]
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 5 Preise und Zahlung</h2>
          <div style={card}>
            <p>
              Die aktuellen Preise sind auf der Pricing-Seite der Plattform einsehbar.
              Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer.
              Die Zahlung erfolgt im Voraus per [PLACEHOLDER Zahlungsmethoden].
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 6 Haftungsausschluss — Keine Anlageberatung</h2>
          <div style={card}>
            <p style={{ fontWeight: 600, color: "var(--ag-warning)", marginBottom: 8 }}>
              WICHTIGER HINWEIS
            </p>
            <p>
              NUR Finance stellt ausschließlich Finanzinformationen, -daten und Analysetools bereit.
              Die auf der Plattform angezeigten Daten, Analysen, Bewertungen und Signale stellen
              <strong> keine Anlageberatung</strong>, keine Empfehlung zum Kauf oder Verkauf von
              Finanzinstrumenten und keine Aufforderung zum Handeln dar.
            </p>
            <p style={{ marginTop: 12 }}>
              Jede Investitionsentscheidung liegt ausschließlich in der Verantwortung des Nutzers.
              Der Anbieter haftet nicht für Verluste, die aus Anlageentscheidungen resultieren,
              die auf Grundlage der bereitgestellten Informationen getroffen wurden.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 7 Regulatorischer Hinweis (§ 32 KWG)</h2>
          <div style={card}>
            <p>
              NUR Finance betreibt <strong>keine Finanzportfolioverwaltung</strong> und erbringt
              <strong> keine erlaubnispflichtigen Finanzdienstleistungen</strong> im Sinne des
              Kreditwesengesetzes (KWG). Die Plattform verwaltet keine Kundengelder und nimmt keine
              Wertpapierorders entgegen.
            </p>
            <p style={{ marginTop: 12 }}>
              NUR Finance unterliegt daher nicht der Erlaubnispflicht gemäß § 32 KWG.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 8 Verfügbarkeit</h2>
          <div style={card}>
            <p>
              Der Anbieter bemüht sich um eine Verfügbarkeit der Plattform von 99,5 % im
              Jahresmittel. Wartungsarbeiten werden nach Möglichkeit angekündigt. Ein Anspruch
              auf ununterbrochene Verfügbarkeit besteht nicht.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 9 Geistiges Eigentum</h2>
          <div style={card}>
            <p>
              Alle Inhalte, Software, Analysen und Designs der Plattform sind urheberrechtlich
              geschützt. Eine Vervielfältigung, Verbreitung oder Weiterverwendung ist ohne
              ausdrückliche Genehmigung nicht gestattet.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 10 Kündigung</h2>
          <div style={card}>
            <p>
              Die Kündigung ist zum Ende des jeweiligen Abrechnungszeitraums möglich.
              Das Widerrufsrecht für Verbraucher bleibt hiervon unberührt
              (siehe <Link href="/widerruf" style={{ color: "var(--ag-accent)" }}>Widerrufsbelehrung</Link>).
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>§ 11 Datenschutz</h2>
          <div style={card}>
            <p>
              Details zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <Link href="/datenschutz" style={{ color: "var(--ag-accent)" }}>Datenschutzerklärung</Link>.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>§ 12 Schlussbestimmungen</h2>
          <div style={card}>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Frankfurt am Main,
              soweit gesetzlich zulässig. Sollten einzelne Bestimmungen dieser AGB unwirksam sein,
              bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
            <p style={{ marginTop: 12, color: "var(--ag-muted)" }}>
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
