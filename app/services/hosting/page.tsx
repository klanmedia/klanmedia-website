import Link from 'next/link'
import PageHero from '../../_components/PageHero'
import HeroTitle from '../../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { ctaHref, ctaLabel } from '@/lib/cta'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hosting & Pflege — klanmedia',
  description: 'Managed Hosting mit 24/7-Monitoring, täglichen Backups, monatlichen Anpassungen und persönlichem Support. Monatlich kündbar.',
}

const plans = [
  {
    name: 'Basic',
    price: '50 €',
    note: 'pro Monat',
    description: 'Solide Basis für kleine Unternehmenswebsites.',
    features: [
      'Hosting auf deutschen Servern',
      'SSL-Zertifikat inklusive',
      'Tägliche automatische Backups',
      'Sicherheitsupdates',
      '24/7 Server-Monitoring',
      'Monatlich kündbar',
    ],
    highlighted: false,
    badge: null,
  },
  {
    name: 'Standard',
    price: '100 €',
    note: 'pro Monat',
    description: 'Der Klassiker für Unternehmen, die regelmäßig Anpassungen brauchen.',
    features: [
      'Alles aus Basic',
      '2 Stunden Anpassungen/Monat',
      'SEO-Pflege & Monitoring',
      'Support in 24–48 h',
      'Monatliches Status-Update',
      'Monatlich kündbar',
    ],
    highlighted: true,
    badge: 'Empfohlen',
  },
  {
    name: 'Premium',
    price: '150 €',
    note: 'pro Monat',
    description: 'Maximale Betreuung — für Betriebe die mehr brauchen.',
    features: [
      'Alles aus Standard',
      '4 Stunden Anpassungen/Monat',
      'Analytics & Reporting',
      'Prioritäts-Support',
      'Proaktive Optimierungen',
      'Monatlich kündbar',
    ],
    highlighted: false,
    badge: null,
  },
]

const included = [
  { icon: '🔒', title: 'SSL inklusive', text: 'Automatisch erneuerte SSL-Zertifikate für HTTPS — kein manuelles Nachfassen.' },
  { icon: '💾', title: 'Tägliche Backups', text: 'Ihre Daten werden täglich gesichert. Im Notfall können wir schnell wiederherstellen.' },
  { icon: '📡', title: '24/7 Monitoring', text: 'Server und Website werden rund um die Uhr überwacht. Probleme werden bemerkt, bevor sie zum Problem werden.' },
  { icon: '🤝', title: 'Persönlicher Support', text: 'Kein Ticket-System, kein Call-Center. Direkter Kontakt, schnelle Antworten.' },
  { icon: '📈', title: 'Skalierbar', text: 'Wächst Ihr Unternehmen, wächst Ihr Hosting mit. Ohne Neuverhandlung, einfach anfragen.' },
  { icon: '🇩🇪', title: 'DSGVO-konform', text: 'Infrastruktur auf europäischen Servern, konform mit aktueller Datenschutzgesetzgebung.' },
]

export default async function HostingPage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('hosting')])
  const showBundles = flag(flags, 'service_bundles_visible')
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Hosting & Pflege'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Ihre Website läuft.<br /><em className="not-italic text-brand">Immer.</em></>}
        subtitle={heroText?.subtitle || 'Managed Hosting mit persönlichem Support — kein Ticket-System, kein Warten. Monatliche Anpassungsstunden inklusive, monatlich kündbar.'}
      />

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col relative overflow-hidden ${
                plan.highlighted
                  ? 'bg-dark border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-4">
                  {plan.badge}
                </div>
              )}
              <div className={`text-[13px] font-bold uppercase tracking-widest mb-2 ${plan.highlighted ? 'text-brand' : 'text-gray-400'}`}>
                {plan.name}
              </div>
              <div className={`text-[32px] font-extrabold tracking-tight mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-3 ${plan.highlighted ? 'text-white/35' : 'text-gray-400'}`}>{plan.note}</div>
              <p className={`text-sm leading-relaxed mb-7 ${plan.highlighted ? 'text-white/50' : 'text-gray-500'}`}>{plan.description}</p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlighted ? 'text-white/70' : 'text-gray-600'}`}>
                    <span className="text-brand font-bold shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href={ctaHref(flags)}
                className={`text-center font-semibold text-sm px-6 py-3 rounded-lg transition-colors ${
                  plan.highlighted
                    ? 'bg-brand text-white hover:bg-blue-700'
                    : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                }`}
                style={plan.highlighted ? { boxShadow: '0 0 30px rgba(37,99,235,0.35)' } : {}}
              >
                {ctaLabel(flags)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-12">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Immer dabei</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">
              Was jedes Paket enthält.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle hint — nur wenn Bundles aktiv */}
      {showBundles && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-1">Auch Content Creation dabei?</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Kombinieren Sie Hosting & Pflege mit Content Creation im Bundle — bis zu 50 € günstiger pro Monat.
              </p>
            </div>
            <Link href="/services/bundles" className="shrink-0 text-sm font-semibold text-brand border border-brand/30 px-6 py-3 rounded-lg hover:bg-brand hover:text-white transition-colors whitespace-nowrap">
              Bundle ansehen →
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight text-gray-900 mb-4">
          Bereit für zuverlässiges Hosting?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Kostenloses Erstgespräch — wir finden das passende Paket für Sie.
        </p>
        <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
          Jetzt anfragen
        </Link>
      </section>
    </>
  )
}
