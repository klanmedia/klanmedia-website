import Link from 'next/link'
import { redirect } from 'next/navigation'
import PageHero from '../../_components/PageHero'
import HeroTitle from '../../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bundle-Pakete — klanmedia',
  description: 'Website-Abo und Content Creation kombiniert — günstiger als einzeln, alles aus einer Hand.',
}

const bundles = [
  {
    name: 'Basic Bundle',
    price: '320 €',
    saving: 'statt 350 €',
    savingAmount: '30 € sparen',
    includes: [
      { label: 'Content Creation', detail: 'Starter — 4 Reels/Mo', icon: '🎬' },
      { label: 'Hosting & Pflege', detail: 'Basic — Hosting, SSL, Backup', icon: '🌐' },
    ],
    features: [
      '4 Reels/Monat (TikTok + Instagram)',
      'Hosting auf deutschen Servern',
      'SSL-Zertifikat & tägliche Backups',
      '24/7 Server-Monitoring',
      'Sicherheitsupdates',
    ],
    highlight: false,
    cta: 'Anfragen',
  },
  {
    name: 'Growth Bundle',
    price: '650 €',
    saving: 'statt 700 €',
    savingAmount: '50 € sparen',
    includes: [
      { label: 'Content Creation', detail: 'Standard — 8 Reels/Mo', icon: '🎬' },
      { label: 'Hosting & Pflege', detail: 'Standard — 2 Std. Anpassungen', icon: '🌐' },
    ],
    features: [
      '8 Reels/Monat (TikTok + Instagram)',
      'Analyse & Reporting',
      'Strategische Content-Planung',
      '2 Stunden Website-Anpassungen/Mo',
      'SEO-Pflege & Monitoring',
      'Support in 24–48 h',
    ],
    highlight: true,
    cta: 'Anfragen',
  },
  {
    name: 'Premium Bundle',
    price: '1.150 €',
    saving: 'statt 1.250 €',
    savingAmount: '100 € sparen',
    includes: [
      { label: 'Content Creation', detail: 'Premium — mehr Reels/Mo', icon: '🎬' },
      { label: 'Hosting & Pflege', detail: 'Premium — 4 Std. Anpassungen', icon: '🌐' },
    ],
    features: [
      'Mehr Reels/Monat',
      'YouTube Add-on möglich',
      'Vollständiges Analytics-Reporting',
      '4 Stunden Website-Anpassungen/Mo',
      'Prioritäts-Support',
      'Proaktive Optimierungen',
      'Exklusive Einzelbetreuung',
    ],
    highlight: false,
    cta: 'Anfragen',
  },
]

const whyBundle = [
  {
    icon: '💰',
    title: 'Günstiger als einzeln',
    text: 'Bis zu 100 € pro Monat sparen gegenüber der Einzelbuchung — bei identischer Leistung.',
  },
  {
    icon: '🤝',
    title: 'Ein Ansprechpartner',
    text: 'Website, Hosting und Content — alles bei einer Person. Kein Koordinationsaufwand zwischen verschiedenen Dienstleistern.',
  },
  {
    icon: '📊',
    title: 'Abgestimmte Strategie',
    text: 'Website und Content Creation werden gemeinsam gedacht — gleiche Sprache, gleiche Ziele, konsistenter Auftritt.',
  },
  {
    icon: '🔄',
    title: 'Monatlich kündbar',
    text: 'Kein Jahresvertrag, kein Risiko. Pakete können jederzeit einzeln angepasst oder gekündigt werden.',
  },
]

export default async function BundlesPage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('bundles')])
  if (!flag(flags, 'service_bundles_visible')) redirect('/services')
  const showReviews = flag(flags, 'review_management_visible')
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Bundle-Pakete'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Website + Content.<br /><em className="not-italic text-brand">Alles aus einer Hand.</em></>}
        subtitle={heroText?.subtitle || 'Hosting & Pflege kombiniert mit Content Creation — günstiger als einzeln gebucht und strategisch besser aufeinander abgestimmt.'}
      />

      {/* Why bundle */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Warum ein Bundle?</div>
          <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">
            Mehr Leistung, weniger Aufwand.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whyBundle.map(item => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prerequisite note */}
      <div className="max-w-5xl mx-auto px-6 -mt-4 mb-4">
        <div className="bg-brand/8 border border-brand/20 rounded-xl px-6 py-4 flex items-start gap-3">
          <span className="text-brand font-bold text-lg mt-0.5 shrink-0">ℹ</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-900">Voraussetzung:</span> Die einmalige Website-Erstellung (ab 500 €) ist nicht im Bundle enthalten — sie wird einmalig separat berechnet. Das Bundle startet danach als monatliches Abo.
          </p>
        </div>
      </div>

      {/* Bundle pricing */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.map(bundle => (
            <div
              key={bundle.name}
              className={`rounded-2xl p-8 flex flex-col relative overflow-hidden ${
                bundle.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'
              }`}
            >

              {/* Savings badge */}
              <div className={`self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 ${
                bundle.highlight ? 'bg-brand/20 text-brand' : 'bg-green-50 text-green-600'
              }`}>
                {bundle.savingAmount}
              </div>

              <div className={`text-[13px] font-bold uppercase tracking-widest mb-2 ${bundle.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                {bundle.name}
              </div>
              <div className={`text-[32px] font-extrabold tracking-tight leading-none mb-1 ${bundle.highlight ? 'text-white' : 'text-gray-900'}`}>
                {bundle.price}
              </div>
              <div className={`text-sm mb-6 ${bundle.highlight ? 'text-white/30' : 'text-gray-400'}`}>
                pro Monat · {bundle.saving}
              </div>

              {/* Includes */}
              <div className={`flex flex-col gap-2 mb-6 p-4 rounded-xl ${bundle.highlight ? 'bg-white/5' : 'bg-gray-50'}`}>
                {bundle.includes.map(inc => (
                  <div key={inc.label} className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{inc.icon}</span>
                    <div>
                      <div className={`text-[11px] font-bold ${bundle.highlight ? 'text-white/50' : 'text-gray-400'}`}>{inc.label}</div>
                      <div className={`text-[12px] font-semibold ${bundle.highlight ? 'text-white/80' : 'text-gray-700'}`}>{inc.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                {bundle.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${bundle.highlight ? 'text-white/60' : 'text-gray-600'}`}>
                    <span className="text-brand font-bold shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>

              <Link
                href="/kontakt"
                className={`text-center font-semibold text-sm px-6 py-3 rounded-lg transition-colors ${
                  bundle.highlight
                    ? 'bg-brand text-white hover:bg-blue-700'
                    : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                }`}
                style={bundle.highlight ? { boxShadow: '0 0 30px rgba(37,99,235,0.35)' } : {}}
              >
                {bundle.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Alle Pakete modular kombinierbar · Monatlich kündbar · Keine Mindestlaufzeit</p>
      </section>

      {/* Add-on — nur wenn Review Management aktiv */}
      {showReviews && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-6">Add-on für alle Pakete</div>
            <div className="bg-white border border-gray-200 rounded-2xl p-7 max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Review Management</h3>
                  <div className="text-sm text-brand font-semibold">+20–50 €/Monat</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Zufriedene Kunden nach abgeschlossenen Aufträgen gezielt mit einem Direktlink zur Google-Bewertung ansprechen — über WhatsApp, E-Mail oder Rechnung. Seriös, diskret, wirksam.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-4">
          Welches Bundle passt zu Ihnen?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Im kostenlosen Erstgespräch finden wir gemeinsam die richtige Kombination.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
            Erstgespräch vereinbaren
          </Link>
          <Link href="/preise" className="inline-block border border-gray-200 text-gray-700 font-semibold text-base px-10 py-4 rounded-lg hover:border-brand hover:text-brand transition-colors">
            Alle Preise ansehen
          </Link>
        </div>
      </section>
    </>
  )
}
