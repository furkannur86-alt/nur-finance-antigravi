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
          &larr; Zurück zur Startseite
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 32 }}>
          Widerrufsbelehrung
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Widerrufsrecht</h2>
          <div style={card}>
            <p>
              Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gründen
              diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag
              des Vertragsschlusses.
            </p>
            <p style={{ marginTop: 12 }}>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <div style={{ ...innerCard, marginTop: 8 }}>
              <p><strong>NUR Finance GmbH (i.Gr.)</strong></p>
              <p>[PLACEHOLDER Straße und Hausnummer]</p>
              <p>60311 Frankfurt am Main</p>
              <p>E-Mail: info@nur.finance</p>
            </div>
            <p style={{ marginTop: 12 }}>
              mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder
              E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
              dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
              vorgeschrieben ist.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Frist</h2>
          <div style={card}>
            <p>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
              Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Folgen des Widerrufs</h2>
          <div style={card}>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
              Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
              Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von
              uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
              über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p style={{ marginTop: 12 }}>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
              ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
              Rückzahlung Entgelte berechnet.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>Besondere Hinweise für digitale Inhalte</h2>
          <div style={card}>
            <p style={{ fontWeight: 600, color: "var(--ag-warning)", marginBottom: 8 }}>
              Vorzeitiges Erlöschen des Widerrufsrechts
            </p>
            <p>
              Das Widerrufsrecht erlischt vorzeitig, wenn der Anbieter mit der Ausführung des
              Vertrags begonnen hat, nachdem der Nutzer
            </p>
            <ul style={list}>
              <li>ausdrücklich zugestimmt hat, dass der Anbieter mit der Ausführung des Vertrags
                  vor Ablauf der Widerrufsfrist beginnt, und</li>
              <li>seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn
                  der Ausführung des Vertrags sein Widerrufsrecht verliert.</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Dies gilt gemäß § 356 Abs. 5 BGB für Verträge über die Bereitstellung
              digitaler Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitle}>Muster-Widerrufsformular</h2>
          <div style={card}>
            <p style={{ color: "var(--ag-muted)", marginBottom: 12 }}>
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus
              und senden Sie es zurück)
            </p>
            <div style={innerCard}>
              <p>An: NUR Finance GmbH (i.Gr.)</p>
              <p>[PLACEHOLDER Adresse]</p>
              <p>E-Mail: info@nur.finance</p>
              <br />
              <p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
                 über die Erbringung der folgenden Dienstleistung:</p>
              <br />
              <p>_______________________________________</p>
              <br />
              <p>Bestellt am (*) / erhalten am (*):</p>
              <p>Name des/der Verbraucher(s):</p>
              <p>Anschrift des/der Verbraucher(s):</p>
              <br />
              <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
              <p>Datum:</p>
              <br />
              <p style={{ color: "var(--ag-muted)", fontSize: 13 }}>(*) Unzutreffendes streichen.</p>
            </div>
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

const innerCard: React.CSSProperties = {
  background: "var(--ag-bg)",
  border: "1px solid var(--ag-border)",
  borderRadius: 6,
  padding: 16,
  lineHeight: 1.7,
};

const list: React.CSSProperties = {
  marginTop: 8,
  paddingLeft: 20,
  listStyleType: "disc",
  lineHeight: 2,
};
