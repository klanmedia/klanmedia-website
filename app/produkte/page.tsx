import Link from 'next/link'
import PageHero from '../_components/PageHero'
import { getFlags, flag } from '@/lib/flags'
import { redirect } from 'next/navigation'
import { getPublicProdukte } from '@/lib/produkte'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produkte — klanmedia',
  description: 'Eigene SaaS-Produkte und Webapps von klanmedia.',
}

export default async function ProdektePage() {
  const [flags, produkte] = await Promise.all([getFlags(), getPublicProdukte()])
  if (!flag(flags, 'produkte_visible')) redirect('/')

  return (
    <>
      <PageHero
        eyebrow="Eigene Produkte"
        title={<>Software,<br /><em className="not-italic text-brand">die wir selbst bauen.</em></>}
        subtitle="Neben Kundenprojekten entwickeln wir eigene SaaS-Produkte, Webapps und digitale Services."
      />

      <section className="max-w-5xl mx-auto px-6 py-24">
        {produkte.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {produkte.map(produkt => {
              const isLive = produkt.is_available && !!produkt.url
              const Card = (
                <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all h-full">
                  <div className="h-40 flex flex-col items-center justify-center gap-3" style={{ background: `${produkt.color}10` }}>
                    <span className="text-5xl">{produkt.icon}</span>
                    {!produkt.is_available ? (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 bg-white border border-amber-200 px-3 py-1 rounded-full">
                        Coming soon
                      </span>
                    ) : isLive ? (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-white border border-emerald-200 px-3 py-1 rounded-full">
                        Jetzt testen ↗
                      </span>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-brand transition-colors">{produkt.name}</h3>
                      {produkt.price && <span className="text-sm font-bold text-brand shrink-0">{produkt.price}</span>}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{produkt.description}</p>
                    {produkt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {produkt.tags.map(tag => (
                          <span key={tag} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
              return isLive ? (
                <a key={produkt.id} href={produkt.url!} target="_blank" rel="noopener noreferrer" className="block">
                  {Card}
                </a>
              ) : (
                <div key={produkt.id}>{Card}</div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center mb-8">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Produkte in Entwicklung</h2>
            <p className="text-gray-500 text-[16px] leading-relaxed max-w-md mx-auto mb-8">
              Unsere ersten eigenen Produkte sind in Planung. Tragen Sie sich ein und werden Sie als Erstes informiert.
            </p>
            <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Updates erhalten
            </Link>
          </div>
        )}

        {produkte.length > 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-2 font-medium">Interesse an Updates?</p>
            <p className="text-gray-400 text-sm mb-6">Tragen Sie sich ein und erfahren Sie als Erstes von neuen Produkten.</p>
            <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Updates erhalten
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
