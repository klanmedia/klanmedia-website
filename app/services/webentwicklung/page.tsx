import Link from 'next/link'
import PageHero from '../../_components/PageHero'
import HeroTitle from '../../_components/HeroTitle'
import { getFlags } from '@/lib/flags'
import { ctaHref, ctaLabel } from '@/lib/cta'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website-Erstellung — klanmedia',
  description: 'Individuelle Websites & Webapps — von der Landingpage bis zur komplexen Webanwendung. Sauber entwickelt, keine Templates.',
}

const packages = [
  {
    name: 'Starter',
    price: '500–800 €',
    sub: 'einmalig',
    desc: 'Der schnelle Einstieg für kleine Unternehmen.',
    features: ['Landingpage + Über uns + Kontakt', 'Responsiv & mobiloptimiert', 'SEO-Grundoptimierung', 'DSGVO-konform', 'SSL inklusive'],
    highlight: false,
  },
  {
    name: 'Business',
    price: '800–1.500 €',
    sub: 'einmalig',
    desc: 'Der Standard für professionelle Online-Auftritte.',
    features: ['5–8 Unterseiten', 'Kontaktformular', 'Google Maps Integration', 'Inhaltsstruktur & Beratung', 'SEO-Grundoptimierung'],
    highlight: true,
  },
  {
    name: 'Premium',
    price: '1.500–2.500 €',
    sub: 'einmalig',
    desc: 'Für Unternehmen mit erweiterten Anforderungen.',
    features: ['Nutzerverwaltung & Login', 'Admin-Dashboard', 'Individuelle Funktionen', 'Erweiterte Animationen', 'Technische Beratung'],
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'ab 2.500 €',
    sub: 'individuelles Angebot',
    desc: 'Komplexe Webapps und Individualprojekte.',
    features: ['Webapps & SaaS-Lösungen', 'REST API-Anbindungen', 'Datenbankintegration', 'Docker & DevOps', 'Langfristige Betreuung'],
    highlight: false,
  },
]

const alwaysIncluded = [
  'Responsives Design (Mobile, Tablet, Desktop)',
  'SEO-Grundoptimierung inklusive',
  'DSGVO-konform & rechtssicher',
  'SSL & HTTPS inklusive',
  'Optimiert für schnelle Ladezeiten (Core Web Vitals)',
  'Moderner Tech-Stack (Next.js, React, Tailwind CSS)',
  'Sauberer, wartbarer Code — kein Page-Builder',
  '30 Tage Support nach Launch',
]

export default async function WebentwicklungPage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('webentwicklung')])
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Website-Erstellung'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Websites die<br /><em className="not-italic text-brand">wirklich performen.</em></>}
        subtitle={heroText?.subtitle || 'Individuell entwickelt mit modernem Tech-Stack — keine Templates, kein WordPress-Einheitsbrei. Schnell, sicher und skalierbar.'}
      />

      {/* Visuals placeholder — wird später mit echten Demos/Animationen gefüllt */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Blitzschnell', text: 'Next.js mit serverseitigem Rendering — Ladezeiten unter 1 Sekunde, optimale Core Web Vitals.' },
              { icon: '📱', title: 'Mobil-first', text: 'Jede Website wird von Grund auf für alle Bildschirmgrößen entwickelt — kein nachträgliches Anpassen.' },
              { icon: '🔍', title: 'SEO-ready', text: 'Technische SEO-Optimierung ist von Anfang an eingebaut — kein Plugin-Chaos, saubere Struktur.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Always included */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">In jedem Paket</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-4">
              Was immer dabei ist.
            </h2>
            <p className="text-gray-500 text-[16px] leading-relaxed">
              Egal welches Paket — diese Qualitätsstandards gelten für jedes Projekt.
            </p>
          </div>
          <ul className="flex flex-col gap-3.5">
            {alwaysIncluded.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Pakete</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">
              Wählen Sie Ihr Paket.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map(pkg => (
              <div key={pkg.name} className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                {pkg.highlight && (
                  <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-3">
                    Empfohlen
                  </div>
                )}
                <div className={`text-[12px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-white/50' : 'text-gray-400'}`}>{pkg.name}</div>
                <div className={`text-[22px] font-extrabold tracking-tight mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                <div className={`text-xs mb-3 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
                <p className={`text-xs leading-relaxed mb-5 ${pkg.highlight ? 'text-white/45' : 'text-gray-400'}`}>{pkg.desc}</p>
                <ul className="flex flex-col gap-2 flex-1 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-[12px] ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                      <span className="text-brand font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={ctaHref(flags)} className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                  style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                  {ctaLabel(flags)}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">30 % Anzahlung bei Auftragserteilung · 70 % nach Abnahme</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-4">
          Bereit für Ihre neue Website?
        </h2>
        <p className="text-lg text-gray-500 mb-8">Kostenloses Erstgespräch — wir besprechen was Sie brauchen.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
            Erstgespräch vereinbaren
          </Link>
          <Link href="/demos" className="inline-block border border-gray-200 text-gray-700 font-semibold text-base px-10 py-4 rounded-lg hover:border-brand hover:text-brand transition-colors">
            Demos ansehen
          </Link>
        </div>
      </section>
    </>
  )
}
