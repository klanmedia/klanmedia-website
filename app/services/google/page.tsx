import Link from 'next/link'
import { redirect } from 'next/navigation'
import PageHero from '../../_components/PageHero'
import HeroTitle from '../../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google Business — klanmedia',
  description: 'Google Business Profil einrichten & optimieren — mehr lokale Sichtbarkeit auf Google Maps und in der Suche.',
}

export default async function GooglePage() {
  const [flags, heroText] = await Promise.all([getFlags(), getHeroText('google')])
  if (!flag(flags, 'service_google_visible')) redirect('/services')
  const showReviews = flag(flags, 'review_management_visible')

  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Lokale Sichtbarkeit'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Mehr Kunden durch<br /><em className="not-italic text-brand">Google.</em></>}
        subtitle={heroText?.subtitle || 'Google Business Profil professionell eingerichtet und optimiert — sichtbar wo Ihre Kunden suchen.'}
      />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className={showReviews ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'max-w-xl mx-auto'}>
          {/* Google Business */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="text-3xl mb-4">📍</div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-brand mb-2">Einmalig</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Google Business Profil</h2>
            <div className="text-2xl font-extrabold text-gray-900 mb-1">100–200 €</div>
            <div className="text-sm text-gray-400 mb-5">einmalig</div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Einrichtung und vollständige Optimierung Ihres Google Business Profils — Öffnungszeiten, Fotos, Beschreibung, Kategorien. Mehr Sichtbarkeit in der lokalen Suche und auf Google Maps.
            </p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {['Profil-Einrichtung & Verifikation', 'Vollständige Optimierung', 'Kategorien & Keywords', 'Fotoupload & Beschreibung', 'Google Maps Optimierung'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="text-brand font-bold shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/kontakt" className="block text-center border border-gray-200 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:border-brand hover:text-brand transition-colors">
              Anfragen
            </Link>
          </div>

          {/* Review Management — nur wenn Flag aktiv */}
          {showReviews && (
            <div className="bg-dark border border-white/10 rounded-2xl p-8">
              <div className="text-3xl mb-4">⭐</div>
              <div className="self-start inline-block text-[10px] font-bold uppercase tracking-widest bg-brand/20 text-brand px-2.5 py-1 rounded-full mb-2">
                Add-on
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Review Management</h2>
              <div className="text-2xl font-extrabold text-white mb-1">+20–50 €</div>
              <div className="text-sm text-white/35 mb-5">pro Monat</div>
              <p className="text-sm text-white/55 leading-relaxed mb-6">
                Zufriedene Kunden nach abgeschlossenen Aufträgen gezielt mit einem Direktlink zur Google-Bewertung ansprechen — über WhatsApp, E-Mail oder Rechnung. Seriös, diskret, wirksam.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {['Direktlink zur Google-Bewertung', 'WhatsApp & E-Mail Versand', 'Einbindung in Rechnung möglich', 'Seriöser, diskreter Ansatz', 'Monatlich kündbar'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/65">
                    <span className="text-brand font-bold shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/kontakt" className="block text-center bg-brand text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 25px rgba(37,99,235,0.3)' }}>
                Anfragen
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-4">Bereit für mehr lokale Sichtbarkeit?</h2>
        <p className="text-lg text-gray-500 mb-8">Kostenloses Erstgespräch — wir schauen was für Ihr Unternehmen sinnvoll ist.</p>
        <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
          Erstgespräch vereinbaren
        </Link>
      </section>
    </>
  )
}
