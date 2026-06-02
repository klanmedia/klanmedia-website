import type { Metadata } from 'next'
import PageHero from '../_components/PageHero'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — klanmedia',
  description: 'Datenschutzerklärung von klanmedia gemäß DSGVO.',
  robots: { index: false, follow: false },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[15px] font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-2">{children}</div>
    </div>
  )
}

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title={<>Datenschutz&shy;erklärung</>}
        subtitle="Gemäß DSGVO und BDSG"
      />

      <section className="max-w-2xl mx-auto px-6 py-20">

        <Section title="1. Verantwortlicher">
          <p>Verantwortlicher im Sinne der DSGVO ist:</p>
          <p className="font-semibold text-gray-900">Benno Klan · klanmedia</p>
          <p>Am Gaißbichl 1, 83135 Schechen</p>
          <p>E-Mail: <a href="mailto:klanmediadev@gmail.com" className="text-brand hover:underline">klanmediadev@gmail.com</a></p>
        </Section>

        <Section title="2. Erhebung und Verarbeitung personenbezogener Daten">
          <p>
            Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen einer Kontaktanfrage freiwillig
            mitteilen (Name, E-Mail-Adresse, Telefonnummer, Nachricht). Diese Daten verwenden wir ausschließlich
            zur Bearbeitung Ihrer Anfrage.
          </p>
          <p>
            Eine Weitergabe an Dritte findet nicht statt. Eine Nutzung für Werbezwecke ohne Ihre ausdrückliche
            Einwilligung erfolgt nicht.
          </p>
        </Section>

        <Section title="3. Kontaktformular">
          <p>
            Wenn Sie uns über das Kontaktformular eine Nachricht senden, werden die angegebenen Daten (Name,
            E-Mail-Adresse, ggf. Telefonnummer und Nachrichteninhalt) zur Bearbeitung der Anfrage gespeichert.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der Bearbeitung von Anfragen).
          </p>
          <p>
            Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet wurde und keine gesetzliche
            Aufbewahrungspflicht entgegensteht.
          </p>
        </Section>

        <Section title="4. Hosting">
          <p>
            Diese Website wird bei{' '}
            <span className="font-medium text-gray-900">Vercel Inc.</span>, 340 Pine Street, Suite 701, San Francisco,
            CA 94104, USA gehostet. Beim Aufruf der Website werden automatisch Verbindungsdaten (IP-Adresse,
            Browsertyp, Betriebssystem, Uhrzeit) in Server-Logfiles gespeichert. Diese Daten sind technisch
            erforderlich und werden nicht mit anderen Daten zusammengeführt.
          </p>
          <p>
            Vercel verfügt über eine EU-Standardvertragsklausel und ist nach dem EU-US Data Privacy Framework
            zertifiziert. Mehr dazu unter{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              vercel.com/legal/privacy-policy
            </a>
            .
          </p>
        </Section>

        <Section title="5. Datenbankdienstleister">
          <p>
            Die über das Kontaktformular eingesendeten Daten (Name, E-Mail-Adresse, Nachricht) werden in einer
            Datenbank bei <span className="font-medium text-gray-900">Supabase Inc.</span> gespeichert.
            Supabase betreibt die Datenbank in der Region <span className="font-medium text-gray-900">eu-central-1
            (Frankfurt, Deutschland)</span> auf der Infrastruktur von Amazon Web Services (AWS). Die Daten
            verlassen damit nicht den Europäischen Wirtschaftsraum.
          </p>
          <p>
            Supabase handelt als Auftragsverarbeiter gemäß Art. 28 DSGVO. Mehr Informationen unter{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              supabase.com/privacy
            </a>
            .
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>
            Diese Website verwendet keine Tracking-Cookies und setzt keine Marketing- oder Analyse-Tools ein.
            Es werden ausschließlich technisch notwendige Cookies verwendet, sofern Ihr Browser diese für den
            Betrieb der Seite benötigt.
          </p>
        </Section>

        <Section title="8. Google Fonts / Externe Ressourcen">
          <p>
            Diese Website lädt Schriftarten über den Dienst <span className="font-medium text-gray-900">Google Fonts</span>.
            Dabei wird eine Verbindung zu Google-Servern hergestellt, bei der Ihre IP-Adresse übertragen werden
            kann. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der optisch
            einheitlichen Darstellung der Website).
          </p>
          <p>
            Hinweis: Next.js lädt Google Fonts standardmäßig beim Build-Prozess herunter und hostet sie lokal —
            in diesem Fall findet keine Verbindung zu Google-Servern statt.
          </p>
        </Section>

        <Section title="9. Ihre Rechte">
          <p>Sie haben gemäß DSGVO folgende Rechte gegenüber uns:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 mt-1">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-2">
            Zur Ausübung Ihrer Rechte wenden Sie sich an:{' '}
            <a href="mailto:klanmediadev@gmail.com" className="text-brand hover:underline">klanmediadev@gmail.com</a>
          </p>
          <p>
            Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die
            zuständige Behörde richtet sich nach Ihrem Wohnort.
          </p>
        </Section>

        <Section title="10. Aktualität dieser Datenschutzerklärung">
          <p>
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Mai 2026. Sie kann angepasst werden,
            wenn sich die Website oder die rechtlichen Anforderungen ändern.
          </p>
        </Section>

      </section>
    </>
  )
}
