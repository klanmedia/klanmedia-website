import Link from 'next/link'
import { redirect } from 'next/navigation'
import PageHero from '../_components/PageHero'
import HeroTitle from '../_components/HeroTitle'
import { getFlags, flag } from '@/lib/flags'
import { getHeroText } from '@/lib/content'
import { getPublicDemos } from '@/lib/demos'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demos — klanmedia',
  description: 'Beispiel-Websites für verschiedene Branchen — so könnte Ihr digitaler Auftritt aussehen.',
}

export default async function DemosPage() {
  const [flags, heroText, demos] = await Promise.all([
    getFlags(),
    getHeroText('demos'),
    getPublicDemos(),
  ])
  if (!flag(flags, 'demos_visible')) redirect('/')

  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Beispiel-Websites'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>So könnte Ihre<br /><em className="not-italic text-brand">Website aussehen.</em></>}
        subtitle={heroText?.subtitle || 'Keine Referenzen — sondern Demos. Zeigt was für Ihre Branche möglich ist, bevor Sie sich entscheiden.'}
      />

      {/* Explanation */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-4">
        <div className="bg-brand/5 border border-brand/20 rounded-xl px-6 py-4 flex items-start gap-3">
          <span className="text-brand font-bold text-lg mt-0.5 shrink-0">ℹ</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-900">Was sind Demos?</span> Branchenspezifische Beispiel-Websites — keine echten Kundenprojekte. Sie zeigen Ihnen, was für Ihren Bereich möglich ist. Echte abgeschlossene Projekte finden Sie unter <Link href="/projekte" className="text-brand font-semibold hover:underline">Projekte</Link>.
          </p>
        </div>
      </section>

      {/* Demo grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {demos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map(demo => {
              const isLive = demo.is_available && !!demo.url
              const Card = (
                <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all h-full">
                  {/* Preview area */}
                  <div
                    className="h-44 flex flex-col items-center justify-center gap-3 relative"
                    style={{ background: `${demo.color}10` }}
                  >
                    <span className="text-5xl">{demo.icon}</span>
                    {!demo.is_available ? (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
                        Demo in Kürze
                      </span>
                    ) : isLive ? (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-white border border-emerald-200 px-3 py-1 rounded-full">
                        Demo ansehen ↗
                      </span>
                    ) : null}
                  </div>
                  <div className="p-7">
                    <h3 className="text-[18px] font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">{demo.industry}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{demo.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {demo.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
              return isLive ? (
                <a key={demo.id} href={demo.url!} target="_blank" rel="noopener noreferrer" className="block">
                  {Card}
                </a>
              ) : (
                <div key={demo.id}>{Card}</div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">Demos werden bald verfügbar sein.</div>
        )}

        <div className="mt-10 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm mb-2 font-medium">Ihre Branche nicht dabei?</p>
          <p className="text-gray-400 text-sm mb-6">Wir entwickeln für jeden Bereich — sprechen Sie uns einfach an.</p>
          <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Demo anfragen
          </Link>
        </div>
      </section>
    </>
  )
}
