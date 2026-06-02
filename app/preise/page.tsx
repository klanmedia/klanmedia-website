import Link from 'next/link'
import PageHero from '../_components/PageHero'
import HeroTitle from '../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preise — klanmedia',
  description: 'Alle Pakete auf einen Blick — Website-Erstellung und Hosting & Pflege für lokale Unternehmen.',
}

export default async function PreisePage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('preise')])
  const showContent = flag(flags, 'service_content_visible')
  const showBundles = flag(flags, 'service_bundles_visible')
  const showGoogle = flag(flags, 'service_google_visible')
  const showReviews = flag(flags, 'review_management_visible')
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Preisübersicht'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Alle Pakete.<br /><em className="not-italic text-brand">Ein Überblick.</em></>}
        subtitle={heroText?.subtitle || 'Alle Pakete sind modular kombinierbar. 30 % Anzahlung, 70 % nach Abnahme. Monatliche Pakete jederzeit kündbar.'}
      />

      {/* Website-Erstellung */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-8">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-2">Website-Erstellung</div>
          <h2 className="text-2xl font-extrabold text-gray-900">Einmalig — kein Abo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
          {[
            {
              name: 'Starter',
              price: '500–800 €',
              sub: 'einmalig',
              desc: 'Der schnelle Einstieg für kleine Unternehmen.',
              features: ['Landingpage, Über uns, Kontakt', 'Responsiv & mobiloptimiert', 'SEO-Grundoptimierung', 'DSGVO-konform', 'SSL inklusive'],
              highlight: false,
            },
            {
              name: 'Business',
              price: '800–1.500 €',
              sub: 'einmalig',
              desc: 'Der Standard für den professionellen Online-Auftritt.',
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
          ].map(pkg => (
            <div key={pkg.name} className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
              {pkg.highlight && (
                <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-3">
                  Empfohlen
                </div>
              )}
              <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-white/50' : 'text-gray-400'}`}>{pkg.name}</div>
              <div className={`text-[28px] font-extrabold tracking-tight leading-none mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
              <div className={`text-xs mb-3 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
              <p className={`text-xs leading-relaxed mb-5 ${pkg.highlight ? 'text-white/45' : 'text-gray-400'}`}>{pkg.desc}</p>
              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {pkg.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                    <span className="text-brand font-bold shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/kontakt" className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                Anfragen
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">30 % Anzahlung bei Auftragserteilung · 70 % nach Abnahme</p>
      </section>

      {/* Hosting & Pflege */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-2">Hosting & Pflege</div>
            <h2 className="text-2xl font-extrabold text-gray-900">Monatlich · jederzeit kündbar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
            {[
              {
                name: 'Basic',
                price: '50 €',
                sub: 'pro Monat',
                features: ['Hosting auf deutschen Servern', 'SSL-Zertifikat inklusive', 'Tägliche automatische Backups', 'Sicherheitsupdates', '24/7 Server-Monitoring'],
                highlight: false,
              },
              {
                name: 'Standard',
                price: '100 €',
                sub: 'pro Monat',
                features: ['Alles aus Basic', '2 Stunden Anpassungen/Monat', 'SEO-Pflege & Monitoring', 'Support in 24–48 h', 'Monatliches Status-Update'],
                highlight: true,
              },
              {
                name: 'Premium',
                price: '150 €',
                sub: 'pro Monat',
                features: ['Alles aus Standard', '4 Stunden Anpassungen/Monat', 'Analytics & Reporting', 'Prioritäts-Support', 'Proaktive Optimierungen'],
                highlight: false,
              },
            ].map(pkg => (
              <div key={pkg.name} className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                {pkg.highlight && (
                  <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-3">
                    Empfohlen
                  </div>
                )}
                <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-white/50' : 'text-gray-400'}`}>{pkg.name}</div>
                <div className={`text-[28px] font-extrabold tracking-tight leading-none mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                <div className={`text-xs mb-5 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                      <span className="text-brand font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/kontakt" className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                  style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                  Anfragen
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Creation */}
      {showContent && <section id="content-creation" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-8">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-2">Content Creation</div>
          <h2 className="text-2xl font-extrabold text-gray-900">TikTok & Instagram Reels · monatlich</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
          {[
            {
              name: 'Starter',
              price: '300 €',
              sub: 'pro Monat',
              features: ['4 Reels/Monat', 'TikTok + Instagram', 'Konzept & Produktion', 'Schnitt & Caption'],
              highlight: false,
            },
            {
              name: 'Standard',
              price: '600 €',
              sub: 'pro Monat',
              features: ['8 Reels/Monat', 'TikTok + Instagram', 'Analyse & Reporting', 'Strategische Planung', 'Posting-Management'],
              highlight: true,
            },
            {
              name: 'Premium',
              price: '1.100 €',
              sub: 'pro Monat',
              features: ['Mehr Reels/Monat', 'TikTok + Instagram', 'YouTube Add-on möglich', 'Vollständiges Reporting', 'Exklusive Betreuung'],
              highlight: false,
            },
          ].map(pkg => (
            <div key={pkg.name} className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
              {pkg.highlight && (
                <div className="self-start text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-3">
                  Empfohlen
                </div>
              )}
              <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-white/50' : 'text-gray-400'}`}>{pkg.name}</div>
              <div className={`text-[28px] font-extrabold tracking-tight leading-none mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
              <div className={`text-xs mb-5 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {pkg.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                    <span className="text-brand font-bold shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/kontakt" className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                Anfragen
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">Keine Einzelvideos — nur Pakete · Immer monatlich kündbar</p>
      </section>}

      {/* Bundles */}
      {showBundles && <section id="bundles" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-3">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-2">Bundle-Pakete</div>
            <h2 className="text-2xl font-extrabold text-gray-900">Web-Abo + Content Creation kombiniert</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">Nach der einmaligen Website-Erstellung — alles aus einer Hand, günstiger als einzeln.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            {[
              {
                name: 'Basic Bundle',
                price: '320 €',
                sub: 'pro Monat (statt 350 €)',
                includes: 'CC Starter + Web Basic Abo',
                features: ['4 Reels/Monat', 'Hosting, SSL, Backup', 'Monitoring & Updates'],
                highlight: false,
              },
              {
                name: 'Growth Bundle',
                price: '650 €',
                sub: 'pro Monat (statt 700 €)',
                includes: 'CC Standard + Web Standard',
                features: ['8 Reels/Monat', '2 Std. Anpassungen/Mo', 'SEO-Pflege & Reporting', 'Analyse & Strategie'],
                highlight: true,
              },
              {
                name: 'Premium Bundle',
                price: '1.150 €',
                sub: 'pro Monat (statt 1.250 €)',
                includes: 'CC Premium + Web Premium',
                features: ['Mehr Reels/Monat', '4 Std. Anpassungen/Mo', 'YouTube Add-on möglich', 'Prioritäts-Support'],
                highlight: false,
              },
            ].map(pkg => (
              <div key={pkg.name} className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${pkg.highlight ? 'text-brand' : 'text-gray-400'}`}>{pkg.name}</div>
                <div className={`text-[11px] mb-3 ${pkg.highlight ? 'text-white/40' : 'text-gray-400'}`}>{pkg.includes}</div>
                <div className={`text-[28px] font-extrabold tracking-tight leading-none mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                <div className={`text-xs mb-5 ${pkg.highlight ? 'text-white/30' : 'text-gray-400'}`}>{pkg.sub}</div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? 'text-white/65' : 'text-gray-600'}`}>
                      <span className="text-brand font-bold shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/kontakt" className={`text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${pkg.highlight ? 'bg-brand text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:border-brand hover:text-brand'}`}
                  style={pkg.highlight ? { boxShadow: '0 0 25px rgba(37,99,235,0.3)' } : {}}>
                  Anfragen
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* Add-ons */}
      {showGoogle && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-6">Add-ons</div>
          <div className={showReviews ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'max-w-lg'}>
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Google Business Profil</h3>
                  <div className="text-sm text-brand font-semibold">100–200 € einmalig</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Einrichtung und Optimierung Ihres Google Business Profils — mehr Sichtbarkeit in der lokalen Suche und auf Google Maps.
              </p>
            </div>
            {showReviews && (
              <div className="bg-white border border-gray-200 rounded-2xl p-7">
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
            )}
          </div>
        </section>
      )}

      {/* CTA block */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-dark rounded-2xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div>
            <h3 className="text-xl font-extrabold text-white mb-2">Nicht sicher welches Paket passt?</h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-md">
              Im kostenlosen Erstgespräch finden wir gemeinsam die richtige Kombination — ohne Druck, ohne Verpflichtung.
            </p>
          </div>
          <Link href="/kontakt" className="shrink-0 bg-brand text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap" style={{ boxShadow: '0 0 30px rgba(37,99,235,0.35)' }}>
            Erstgespräch vereinbaren →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight text-gray-900 mb-4">
          Noch unsicher welches Paket passt?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Im kostenlosen Erstgespräch finden wir gemeinsam die richtige Kombination.
        </p>
        <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
          Erstgespräch vereinbaren
        </Link>
      </section>
    </>
  )
}
