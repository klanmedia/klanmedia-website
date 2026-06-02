import Link from 'next/link'
import PageHero from '../_components/PageHero'
import HeroTitle from '../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — klanmedia',
  description: 'Alle Leistungen von klanmedia — Website-Erstellung, Hosting & Pflege und Google Business für lokale Unternehmen.',
}

const serviceCards = [
  {
    icon: '🖥️',
    title: 'Website-Erstellung',
    description: 'Individuelle Websites & Webapps — von der einfachen Landingpage bis zur komplexen Webanwendung mit Admin-Dashboard und Nutzerverwaltung.',
    price: 'ab 500 €',
    priceNote: 'einmalig',
    href: '/services/webentwicklung',
    tags: ['Next.js', 'React', 'TypeScript'],
    highlight: false,
  },
  {
    icon: '🌐',
    title: 'Hosting & Pflege',
    description: 'Managed Hosting mit 24/7-Monitoring, täglichen Backups, monatlichen Anpassungsstunden und persönlichem Support — monatlich kündbar.',
    price: 'ab 50 €',
    priceNote: 'pro Monat',
    href: '/services/hosting',
    tags: ['SSL', 'Backup', 'Monitoring'],
    highlight: false,
  },
  {
    icon: '🎬',
    title: 'Content Creation',
    description: 'Professionelle Reels für TikTok und Instagram — geplant, produziert und ausgewertet. Pakete mit 4 bis 8+ Videos pro Monat.',
    price: 'ab 300 €',
    priceNote: 'pro Monat',
    href: '/services/content',
    tags: ['TikTok', 'Instagram', 'Reels'],
    highlight: false,
    flagKey: 'service_content_visible',
  },
  {
    icon: '📦',
    title: 'Bundle-Pakete',
    description: 'Hosting & Pflege kombiniert mit Content Creation — bis zu 100 € günstiger als einzeln gebucht, alles aus einer Hand abgestimmt.',
    price: 'ab 320 €',
    priceNote: 'pro Monat',
    href: '/services/bundles',
    tags: ['Kombination', 'Rabatt'],
    highlight: false,
    flagKey: 'service_bundles_visible',
  },
  {
    icon: '📍',
    title: 'Google Business',
    description: 'Einrichtung & Optimierung Ihres Google Business Profils plus seriöses Review Management — mehr lokale Sichtbarkeit und mehr echte Bewertungen.',
    price: 'ab 50 €',
    priceNote: 'pro Monat',
    href: '/services/google',
    tags: ['Local SEO', 'Google Maps', 'Reviews'],
    highlight: false,
    flagKey: 'service_google_visible',
  },
]

export default async function ServicesPage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('services')])
  const visibleCards = serviceCards.filter(s => !s.flagKey || flag(flags, s.flagKey))
  const hasContent = flag(flags, 'service_content_visible')
  const hasBundles = flag(flags, 'service_bundles_visible')

  const defaultSubtitle = (hasContent || hasBundles)
    ? 'Von der ersten Website bis zum laufenden Betrieb mit Content — wählen Sie was Sie brauchen, kombinieren Sie frei.'
    : 'Professionelle Website-Erstellung und zuverlässiges Managed Hosting — persönlich, schnell, aus einer Hand.'

  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Alle Services'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Was wir für Sie<br /><em className="not-italic text-brand">umsetzen können.</em></>}
        subtitle={heroText?.subtitle || defaultSubtitle}
      />

      {/* Service cards grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-wrap justify-center gap-5">
          {visibleCards.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-2xl border border-gray-200 bg-white p-8 flex flex-col transition-all hover:shadow-lg hover:border-gray-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 bg-brand-light">
                {service.icon}
              </div>
              <h2 className="text-[18px] font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">
                {service.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {service.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[17px] font-extrabold text-gray-900">{service.price}</span>
                  <span className="text-xs ml-1 text-gray-400">{service.priceNote}</span>
                </div>
                <span className="text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
                  Mehr →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-dark rounded-2xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div>
            <h3 className="text-xl font-extrabold text-white mb-2">Nicht sicher was passt?</h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-md">
              Kostenloses Erstgespräch — wir schauen gemeinsam welche Kombination für Ihr Unternehmen sinnvoll ist.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="shrink-0 bg-brand text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            style={{ boxShadow: '0 0 30px rgba(37,99,235,0.35)' }}
          >
            Erstgespräch vereinbaren →
          </Link>
        </div>
      </section>
    </>
  )
}
