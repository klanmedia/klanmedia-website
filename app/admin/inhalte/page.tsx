import { getAllHeroTexts } from '@/lib/content'
import HeroTextManager from './_components/HeroTextManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inhalte' }

// Alle Pages die Hero-Texte haben können
export const MANAGED_PAGES = [
  { key: 'services',       label: 'Services',           route: '/services' },
  { key: 'webentwicklung', label: 'Webentwicklung',     route: '/services/webentwicklung' },
  { key: 'hosting',        label: 'Hosting & Pflege',   route: '/services/hosting' },
  { key: 'content',        label: 'Content Creation',   route: '/services/content' },
  { key: 'bundles',        label: 'Bundle-Pakete',      route: '/services/bundles' },
  { key: 'google',         label: 'Google Business',    route: '/services/google' },
  { key: 'preise',         label: 'Preise',             route: '/preise' },
  { key: 'demos',          label: 'Demos',              route: '/demos' },
  { key: 'projekte',       label: 'Projekte',           route: '/projekte' },
  { key: 'ueber-uns',      label: 'Über uns',           route: '/ueber-uns' },
  { key: 'kontakt',        label: 'Kontakt',            route: '/kontakt' },
]

export default async function InhaltePage() {
  const allTexts = await getAllHeroTexts()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-gray-900">Hero-Texte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Erstelle Textvarianten für jede Page und schalte sie aktiv. Änderungen greifen sofort.
        </p>
        <div className="mt-3 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 leading-relaxed">
          <strong className="text-gray-600">Formatierung:</strong>{' '}
          <code className="bg-white border border-gray-200 rounded px-1">\n</code> = neue Zeile &nbsp;·&nbsp;
          <code className="bg-white border border-gray-200 rounded px-1">[blue]Wort[/blue]</code> = Markenfarbe (blau)
          <br />
          <span className="text-gray-400">Beispiel: <code className="bg-white border border-gray-200 rounded px-1">Was wir für Sie\n[blue]umsetzen können.[/blue]</code></span>
        </div>
      </div>

      <HeroTextManager pages={MANAGED_PAGES} initialTexts={allTexts} />
    </div>
  )
}
