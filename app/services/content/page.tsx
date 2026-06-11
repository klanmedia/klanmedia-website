import Link from 'next/link'
import { redirect } from 'next/navigation'
import PageHero from '../../_components/PageHero'
import HeroTitle from '../../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { ctaHref, ctaLabel } from '@/lib/cta'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Creation — klanmedia',
  description: 'Professionelle Reels für TikTok & Instagram — geplant, produziert, ausgewertet. Pakete ab 4 Videos pro Monat.',
}

const packages = [
  {
    name: 'Starter',
    price: '300 €',
    sub: 'pro Monat',
    desc: 'Regelmäßige Präsenz auf TikTok & Instagram.',
    features: ['4 Reels/Monat', 'TikTok + Instagram', 'Konzept & Skript', 'Schnitt, Caption & Hashtags'],
    highlight: false,
  },
  {
    name: 'Standard',
    price: '600 €',
    sub: 'pro Monat',
    desc: 'Mehr Reichweite mit Strategie und Analyse.',
    features: ['8 Reels/Monat', 'TikTok + Instagram', 'Konzept & Skript', 'Analyse & Reporting', 'Strategische Content-Planung', 'Posting-Management'],
    highlight: true,
  },
  {
    name: 'Premium',
    price: '1.100 €',
    sub: 'pro Monat',
    desc: 'Maximale Reichweite, exklusive Betreuung.',
    features: ['Mehr Reels/Monat', 'TikTok + Instagram', 'YouTube Add-on möglich', 'Vollständiges Reporting', 'Strategische Betreuung', 'Exklusiv — ein Betrieb pro Branche'],
    highlight: false,
  },
]

const howItWorks = [
  { step: '01', title: 'Briefing', text: 'Wir besprechen Ihre Zielgruppe, Tonalität und Ziele. Was soll die Community über Sie denken?' },
  { step: '02', title: 'Konzept & Produktion', text: 'Wir planen die Videos, drehen und schneiden — Sie müssen nichts vorbereiten.' },
  { step: '03', title: 'Veröffentlichung', text: 'Die fertigen Reels werden zum optimalen Zeitpunkt auf TikTok & Instagram gepostet.' },
  { step: '04', title: 'Analyse & Optimierung', text: 'Ab Standard: monatliches Reporting was funktioniert — und Anpassung der Strategie.' },
]

export default async function ContentPage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('content')])
  if (!flag(flags, 'service_content_visible')) redirect('/services')
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Content Creation'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Reels die<br /><em className="not-italic text-brand">Kunden bringen.</em></>}
        subtitle={heroText?.subtitle || 'Professionell produzierte TikTok & Instagram Reels — von der Idee bis zum Post. Keine Einzelvideos, nur Pakete.'}
      />

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">So läuft es ab</div>
          <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">Von der Idee zum fertigen Reel.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(item => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-[13px] font-bold text-brand tracking-widest">{item.step}</span>
              <h3 className="text-[17px] font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Pakete</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">Wählen Sie Ihr Paket.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div key={pkg.name} className={`rounded-2xl p-8 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                {pkg.highlight && (
                  <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-3">
                    Empfohlen
                  </div>
                )}
                <div className={`text-[12px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-white/50' : 'text-gray-400'}`}>{pkg.name}</div>
                <div className={`text-[28px] font-extrabold tracking-tight mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                <div className={`text-xs mb-3 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
                <p className={`text-xs leading-relaxed mb-5 ${pkg.highlight ? 'text-white/45' : 'text-gray-400'}`}>{pkg.desc}</p>
                <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                  {pkg.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                      <span className="text-brand font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={ctaHref(flags)} className={`text-center font-semibold text-sm px-4 py-3 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                  style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                  {ctaLabel(flags)}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Keine Einzelvideos — nur Pakete · Monatlich kündbar</p>
        </div>
      </section>

      {/* Bundle hint */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900 mb-1">Auch Hosting dabei?</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              Kombinieren Sie Content Creation mit Hosting & Pflege im Bundle — bis zu 50 € günstiger pro Monat.
            </p>
          </div>
          <Link href="/services/bundles" className="shrink-0 text-sm font-semibold text-brand border border-brand/30 px-6 py-3 rounded-lg hover:bg-brand hover:text-white transition-colors whitespace-nowrap">
            Bundle ansehen →
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-4">Bereit für mehr Reichweite?</h2>
        <p className="text-lg text-gray-500 mb-8">Kostenloses Erstgespräch — wir schauen gemeinsam was Sinn macht.</p>
        <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
          Erstgespräch vereinbaren
        </Link>
      </section>
    </>
  )
}
