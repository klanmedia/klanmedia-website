'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Flag = {
  id: string
  key: string
  value: boolean
  label: string
  description: string | null
}

// Statische Struktur aller Features/Seiten
const CATEGORIES = [
  {
    id: 'services',
    label: 'Services',
    icon: '🛠️',
    description: 'Steuert Sichtbarkeit auf Landing Page, Services-Seite und Preise.',
    flags: [
      {
        key: 'service_content_visible',
        label: 'Content Creation',
        description: 'TikTok & Instagram Reels — Pakete ab 4 Videos/Monat.',
        route: '/services/content',
      },
      {
        key: 'service_bundles_visible',
        label: 'Bundle-Pakete',
        description: 'Web-Abo + Content Creation kombiniert, günstiger als einzeln.',
        route: '/services/bundles',
      },
      {
        key: 'service_google_visible',
        label: 'Google Business & Reviews',
        description: 'Google Business Einrichtung und Review Management.',
        route: '/services/google',
      },
      {
        key: 'review_management_visible',
        label: 'Review Management (Add-on)',
        description: 'Zeigt Review Management als zweite Karte auf /services/google und als Add-on bei Bundles.',
        route: '/services/google',
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation & Seiten',
    icon: '🧭',
    description: 'Steuert welche Links in der Navbar angezeigt werden.',
    flags: [
      {
        key: 'demos_visible',
        label: 'Demos',
        description: 'Showcase-Seite mit Demo-Websites.',
        route: '/demos',
        comingSoon: false,
      },
      {
        key: 'produkte_visible',
        label: 'Produkte',
        description: 'Digitale Produkte & Templates.',
        route: '/produkte',
        comingSoon: false,
      },
      {
        key: 'projekte_visible',
        label: 'Projekte',
        description: 'Referenzprojekte & abgeschlossene Arbeiten.',
        route: '/projekte',
        comingSoon: false,
      },
      {
        key: 'konfigurator_visible',
        label: 'Konfigurator',
        description: 'Interaktiver Preis-Konfigurator. Seite noch nicht fertig.',
        route: '/konfigurator',
        comingSoon: true,
      },
    ],
  },
]

const STATIC_PAGES = [
  { label: 'Homepage', route: '/', description: 'Startseite mit Hero, Services und Pricing.' },
  { label: 'Services', route: '/services', description: 'Übersicht aller angebotenen Leistungen.' },
  { label: 'Webentwicklung', route: '/services/webentwicklung', description: 'Detail-Seite für Website-Erstellung.' },
  { label: 'Hosting & Pflege', route: '/services/hosting', description: 'Detail-Seite für Hosting-Pakete.' },
  { label: 'Preise', route: '/preise', description: 'Vollständige Preisübersicht aller Pakete.' },
  { label: 'Über uns', route: '/ueber-uns', description: 'Über klanmedia.' },
  { label: 'Kontakt', route: '/kontakt', description: 'Kontaktformular & Anfragen.' },
  { label: 'Impressum', route: '/impressum', description: '§ 5 TMG — rechtlich pflicht.' },
  { label: 'Datenschutz', route: '/datenschutz', description: 'DSGVO Datenschutzerklärung.' },
]

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 shrink-0 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  )
}

export default function FeatureToggles({ flags }: { flags: Flag[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [lastSuccess, setLastSuccess] = useState<string | null>(null)

  const flagMap = Object.fromEntries(flags.map(f => [f.key, f]))

  async function toggle(flagKey: string) {
    const f = flagMap[flagKey]
    if (!f) {
      setLastError(`Kein Flag-Eintrag für Key: ${flagKey}`)
      return
    }
    setBusy(flagKey)
    setLastError(null)
    setLastSuccess(null)
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: f.key, value: !f.value }),
      })
      // Robustes Parsen — API könnte auch HTML zurückgeben bei Crashs
      const text = await res.text()
      let json: Record<string, unknown> = {}
      try { json = JSON.parse(text) } catch { /* non-JSON response */ }

      if (!res.ok) {
        setLastError(`HTTP ${res.status}: ${(json.error as string) ?? text.slice(0, 200)}`)
      } else {
        setLastSuccess(`"${f.key}" → ${!f.value ? 'AN' : 'AUS'}`)
        router.refresh()
      }
    } catch (e) {
      setLastError(`Netzwerkfehler: ${e}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-10">
      {/* Feedback Banner */}
      {lastError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700 font-medium">
          ❌ {lastError}
        </div>
      )}
      {lastSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm text-emerald-700 font-medium">
          ✓ Gespeichert: {lastSuccess}
        </div>
      )}

      {/* Feature Flag Categories */}
      {CATEGORIES.map(cat => (
        <div key={cat.id}>
          <div className="flex items-center gap-2 mb-1">
            <span>{cat.icon}</span>
            <h2 className="text-[15px] font-bold text-gray-900">{cat.label}</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">{cat.description}</p>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {cat.flags.map(item => {
              const f = flagMap[item.key]
              const isOn = f ? f.value : false
              return (
                <div key={item.key} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-[14px]">{item.label}</p>
                      {'comingSoon' in item && item.comingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          In Entwicklung
                        </span>
                      )}
                      {isOn && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[10px] text-gray-300">{item.key}</code>
                      {isOn && (
                        <Link href={item.route} target="_blank" className="text-[10px] text-brand hover:underline">
                          {item.route} ↗
                        </Link>
                      )}
                    </div>
                  </div>
                  {f ? (
                    <Toggle
                      checked={f.value}
                      onChange={() => toggle(item.key)}
                      disabled={busy === item.key}
                    />
                  ) : (
                    <span className="text-[11px] text-gray-300">Kein Flag</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Static pages — always on */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span>📄</span>
          <h2 className="text-[15px] font-bold text-gray-900">Statische Seiten</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">Immer aktiv — nicht deaktivierbar.</p>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {STATIC_PAGES.map(page => (
            <div key={page.route} className="flex items-center justify-between px-6 py-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-[14px]">{page.label}</p>
                  <Link href={page.route} target="_blank" className="text-[10px] text-brand hover:underline">
                    {page.route} ↗
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{page.description}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Aktiv
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
