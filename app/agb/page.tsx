import type { Metadata } from 'next'
import PageHero from '../_components/PageHero'

export const metadata: Metadata = {
  title: 'AGB — klanmedia',
  description: 'Allgemeine Geschäftsbedingungen von klanmedia.',
  robots: { index: false, follow: false },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[15px] font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-3">{children}</div>
    </div>
  )
}

export default function AgbPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title={<>Allgemeine Geschäfts&shy;bedingungen</>}
        subtitle="Stand: Juni 2026"
      />

      <section className="max-w-2xl mx-auto px-6 py-20">

        <Section title="§ 1 Geltungsbereich">
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Benno Klan · klanmedia,
            Am Gaißbichl 1, 83135 Schechen (nachfolgend „Auftragnehmer") und seinen Kunden (nachfolgend
            „Auftraggeber") über die Erbringung von Webentwicklungs-, Hosting- und damit verbundenen
            Dienstleistungen.
          </p>
          <p>
            Abweichende Bedingungen des Auftraggebers werden nicht anerkannt, es sei denn, der Auftragnehmer
            stimmt ihrer Geltung ausdrücklich schriftlich zu.
          </p>
        </Section>

        <Section title="§ 2 Vertragsschluss">
          <p>
            Angebote des Auftragnehmers sind freibleibend und unverbindlich. Ein Vertrag kommt erst durch die
            schriftliche Auftragsbestätigung des Auftragnehmers (E-Mail genügt) oder durch Beginn der
            Leistungserbringung zustande.
          </p>
          <p>
            Für wiederkehrende Leistungen (z. B. Hosting & Pflege) gilt der Vertrag als geschlossen, sobald
            der Auftraggeber das Angebot schriftlich annimmt oder die erste Zahlung geleistet hat.
          </p>
        </Section>

        <Section title="§ 3 Leistungsumfang">
          <p>
            Der Umfang der zu erbringenden Leistungen ergibt sich aus der individuellen Leistungsbeschreibung
            bzw. dem jeweiligen Angebot. Nachträgliche Änderungs- oder Erweiterungswünsche bedürfen einer
            gesonderten Vereinbarung und können zu einer Anpassung von Preis und Lieferzeit führen.
          </p>
          <p>
            Der Auftragnehmer ist berechtigt, Teilleistungen an qualifizierte Dritte (Subunternehmer) zu
            vergeben, soweit dies zur ordnungsgemäßen Leistungserbringung erforderlich ist.
          </p>
        </Section>

        <Section title="§ 4 Mitwirkungspflichten des Auftraggebers">
          <p>
            Der Auftraggeber stellt alle für die Auftragserfüllung erforderlichen Unterlagen, Inhalte
            (Texte, Bilder, Logos) und Informationen rechtzeitig und vollständig zur Verfügung. Verzögerungen,
            die aus unvollständigen oder verspäteten Zulieferungen entstehen, gehen nicht zu Lasten des
            Auftragnehmers.
          </p>
          <p>
            Der Auftraggeber stellt sicher, dass er über die erforderlichen Rechte an den überlassenen
            Materialien verfügt und der Auftragnehmer durch deren Nutzung keine Rechte Dritter verletzt.
          </p>
        </Section>

        <Section title="§ 5 Preise und Zahlungsbedingungen">
          <p>
            Alle genannten Preise verstehen sich als Nettopreise zuzüglich der gesetzlichen Umsatzsteuer,
            sofern der Auftragnehmer umsatzsteuerpflichtig ist. Für Kleinunternehmer gemäß § 19 UStG wird
            keine Umsatzsteuer berechnet.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Einmalige Leistungen (z. B. Website-Erstellung):</span>{' '}
            Es wird eine Anzahlung von 30 % des vereinbarten Gesamtpreises bei Auftragserteilung fällig.
            Die verbleibenden 70 % sind bei Übergabe des fertigen Projekts zur Zahlung fällig.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Wiederkehrende Leistungen (z. B. Hosting & Pflege):</span>{' '}
            Die monatliche Vergütung ist jeweils zum Ersten des Monats im Voraus fällig.
          </p>
          <p>
            Rechnungen sind innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zu begleichen.
            Bei Zahlungsverzug ist der Auftragnehmer berechtigt, Verzugszinsen in gesetzlicher Höhe
            zu berechnen und die Leistungserbringung bis zum Ausgleich der offenen Forderungen
            auszusetzen.
          </p>
        </Section>

        <Section title="§ 6 Nutzungsrechte und Urheberrecht">
          <p>
            Mit vollständiger Bezahlung räumt der Auftragnehmer dem Auftraggeber das einfache,
            zeitlich und räumlich unbeschränkte Nutzungsrecht an den erstellten Werken (Website,
            Grafiken, Code) ein, soweit nicht ausdrücklich anders vereinbart.
          </p>
          <p>
            Verwendete Open-Source-Komponenten und Drittanbieter-Bibliotheken unterliegen den
            jeweiligen Lizenzbedingungen der Rechteinhaber. Der Auftragnehmer informiert auf
            Anfrage über eingesetzte Drittkomponenten.
          </p>
          <p>
            Der Auftragnehmer behält das Recht, das erstellte Werk in seinem Portfolio und zu
            Referenzzwecken zu nennen, sofern der Auftraggeber nicht ausdrücklich widerspricht.
          </p>
        </Section>

        <Section title="§ 7 Gewährleistung und Haftung">
          <p>
            Der Auftragnehmer gewährleistet, dass die erstellten Leistungen zum Zeitpunkt der
            Übergabe frei von wesentlichen Mängeln sind. Mängel sind vom Auftraggeber unverzüglich,
            spätestens innerhalb von 14 Tagen nach Übergabe, schriftlich zu melden.
          </p>
          <p>
            Die Haftung des Auftragnehmers für Schäden — gleich aus welchem Rechtsgrund — ist
            auf den Betrag des jeweiligen Auftragswertes begrenzt, sofern keine Vorsatz oder grobe
            Fahrlässigkeit vorliegt. Die Haftung für entgangenen Gewinn, mittelbare Schäden und
            Folgeschäden ist ausgeschlossen.
          </p>
          <p>
            Für Ausfälle oder Einschränkungen von Drittdienstleistungen (z. B. Hosting-Infrastruktur,
            Supabase, Vercel) übernimmt der Auftragnehmer keine Haftung, soweit diese außerhalb
            seines Einflussbereichs liegen.
          </p>
        </Section>

        <Section title="§ 8 Laufzeit und Kündigung">
          <p>
            <span className="font-semibold text-gray-900">Einmalige Leistungen</span> enden mit
            vollständiger Übergabe des Projekts.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Monatlich wiederkehrende Leistungen</span>{' '}
            laufen auf unbestimmte Zeit und können von beiden Seiten mit einer Frist von
            4 Wochen zum Monatsende schriftlich (E-Mail genügt) gekündigt werden.
          </p>
          <p>
            Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            Ein wichtiger Grund liegt insbesondere vor, wenn der Auftraggeber trotz Mahnung
            mit Zahlungen in Verzug gerät.
          </p>
        </Section>

        <Section title="§ 9 Datenschutz">
          <p>
            Die im Rahmen der Vertragsabwicklung erhobenen personenbezogenen Daten werden
            ausschließlich zur Erfüllung des Vertrags verwendet und nicht an Dritte weitergegeben.
            Näheres regelt die{' '}
            <a href="/datenschutz" className="text-brand hover:underline">Datenschutzerklärung</a>.
          </p>
        </Section>

        <Section title="§ 10 Schlussbestimmungen">
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich
            zulässig, der Sitz des Auftragnehmers.
          </p>
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die
            Wirksamkeit der übrigen Bestimmungen nicht. Die unwirksame Bestimmung gilt als durch
            eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen am nächsten kommt.
          </p>
          <p>
            Änderungen oder Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für
            die Aufhebung des Schriftformerfordernisses.
          </p>
        </Section>

      </section>
    </>
  )
}
