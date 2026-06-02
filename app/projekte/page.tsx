import Link from 'next/link'
import { redirect } from 'next/navigation'
import PageHero from '../_components/PageHero'
import HeroTitle from '../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import { getPublicProjekte } from '@/lib/projekte'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projekte — klanmedia',
  description: 'Referenzprojekte von klanmedia — Webentwicklung & Hosting für lokale Unternehmen.',
}

export default async function ProjektePage() {
  const [flags, heroText, projekte] = await Promise.all([
    getFlags(),
    getHeroText('projekte'),
    getPublicProjekte(),
  ])
  if (!flag(flags, 'projekte_visible')) redirect('/')

  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Referenzen'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Projekte, die<br /><em className="not-italic text-brand">wirklich funktionieren.</em></>}
        subtitle={heroText?.subtitle || 'Ausgewählte abgeschlossene Projekte — von der kleinen Unternehmenswebsite bis zur individuellen Webanwendung.'}
      />

      <section className="max-w-5xl mx-auto px-6 py-24">
        {projekte.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projekte.map(projekt => {
              const isLive = projekt.is_live && !!projekt.url
              const Card = (
                <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all h-full">
                  <div className="h-44 flex flex-col items-center justify-center gap-3" style={{ background: `${projekt.color}10` }}>
                    <span className="text-5xl">{projekt.icon}</span>
                    {!projekt.is_live && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
                        In Bearbeitung
                      </span>
                    )}
                    {isLive && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-white border border-emerald-200 px-3 py-1 rounded-full">
                        Live ansehen ↗
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{projekt.category}</div>
                    <h3 className="text-[17px] font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">{projekt.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{projekt.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {projekt.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
              return isLive ? (
                <a key={projekt.id} href={projekt.url!} target="_blank" rel="noopener noreferrer" className="block">
                  {Card}
                </a>
              ) : (
                <div key={projekt.id}>{Card}</div>
              )
            })}
          </div>
        )}

        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Ihr Projekt könnte hier stehen.</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-7">
            Wir bauen Ihnen eine Website, die Ergebnisse liefert — und betreiben sie zuverlässig. Kostenloses Erstgespräch, kein Kleingedrucktes.
          </p>
          <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Projekt besprechen
          </Link>
        </div>
      </section>
    </>
  )
}
