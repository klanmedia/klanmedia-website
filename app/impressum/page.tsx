import type { Metadata } from 'next'
import PageHero from '../_components/PageHero'

export const metadata: Metadata = {
  title: 'Impressum — klanmedia',
  description: 'Impressum und Anbieterkennzeichnung von klanmedia.',
  robots: { index: false, follow: false },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[15px] font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

export default function ImpressumPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title={<>Impressum</>}
        subtitle="Anbieterkennzeichnung gemäß § 5 TMG"
      />

      <section className="max-w-2xl mx-auto px-6 py-20">

        <Section title="Angaben gemäß § 5 TMG">
          <p className="font-semibold text-gray-900">Benno Klan</p>
          <p>klanmedia</p>
          <p>Am Gaißbichl 1</p>
          <p>83135 Schechen</p>
          <p>Deutschland</p>
        </Section>

        <Section title="Kontakt">
          <p>E-Mail: <a href="mailto:klanmediadev@gmail.com" className="text-brand hover:underline">klanmediadev@gmail.com</a></p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p>Benno Klan</p>
          <p>Am Gaißbichl 1, 83135 Schechen</p>
        </Section>

        <Section title="Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="mt-2">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
            forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mt-2">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </Section>

      </section>
    </>
  )
}
