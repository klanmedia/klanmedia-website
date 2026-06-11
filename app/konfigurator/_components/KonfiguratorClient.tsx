'use client'

import { useState } from 'react'
import Link from 'next/link'

const websiteOptions = [
  { id: 'web-starter',    label: 'Starter',    detail: 'Landingpage + Über uns + Kontakt',                  price: 500,  priceDisplay: '500–800 €',     priceNote: 'einmalig', once: true },
  { id: 'web-business',   label: 'Business',   detail: '5–8 Seiten, Formular, Google Maps',                 price: 800,  priceDisplay: '800–1.500 €',   priceNote: 'einmalig', once: true },
  { id: 'web-premium',    label: 'Premium',    detail: 'Dashboard, Nutzerverwaltung, individuelle Features', price: 1500, priceDisplay: '1.500–2.500 €', priceNote: 'einmalig', once: true },
  { id: 'web-enterprise', label: 'Enterprise', detail: 'Webapps, API-Anbindungen, Individualprojekte',       price: 2500, priceDisplay: 'ab 2.500 €',    priceNote: 'einmalig', once: true },
]

const hostingOptions = [
  { id: 'host-basic',    label: 'Hosting Basic',    detail: 'Hosting, SSL, Backup, Monitoring',           price: 50,  priceNote: '/Mo', once: false },
  { id: 'host-standard', label: 'Hosting Standard', detail: '+ 2 Std. Anpassungen/Mo, SEO-Pflege',        price: 100, priceNote: '/Mo', once: false },
  { id: 'host-premium',  label: 'Hosting Premium',  detail: '+ 4 Std./Mo, Analytics, Prioritäts-Support', price: 150, priceNote: '/Mo', once: false },
]

const contentOptions = [
  { id: 'cc-starter',  label: 'Content Starter',  detail: '4 Reels/Mo · TikTok + Instagram',      price: 300,  priceNote: '/Mo', once: false },
  { id: 'cc-standard', label: 'Content Standard', detail: '8 Reels/Mo + Analyse & Reporting',     price: 600,  priceNote: '/Mo', once: false },
  { id: 'cc-premium',  label: 'Content Premium',  detail: 'Mehr Reels/Mo + YouTube Add-on mögl.', price: 1100, priceNote: '/Mo', once: false },
]

// Bundle discount matrix — grows with both hosting AND content tier, max 100 €
const bundleDiscountMatrix: Record<string, Record<string, number>> = {
  'host-basic':    { 'cc-starter': 20, 'cc-standard': 30, 'cc-premium':  40 },
  'host-standard': { 'cc-starter': 30, 'cc-standard': 50, 'cc-premium':  70 },
  'host-premium':  { 'cc-starter': 40, 'cc-standard': 70, 'cc-premium': 100 },
}

const addonOptions = [
  { id: 'gbp',    label: 'Google Business Profil', detail: 'Einrichtung & Optimierung',                          price: 150, priceNote: 'einmalig', once: true  },
  { id: 'review', label: 'Review Management',      detail: 'WhatsApp/E-Mail Direktlinks zu Google-Bewertungen', price: 35,  priceNote: '/Mo',      once: false },
]

type Option = { id: string; label: string; detail: string; price: number; priceDisplay?: string; priceNote: string; once: boolean }

function OptionCard({ option, selected, onToggle }: { option: Option; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        selected ? 'border-brand bg-brand/5 ring-1 ring-brand/30' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
            selected ? 'border-brand bg-brand' : 'border-gray-300'
          }`}>
            {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div>
            <div className="text-[14px] font-bold text-gray-900">{option.label}</div>
            <div className="text-[12px] text-gray-400 mt-0.5">{option.detail}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[14px] font-extrabold text-gray-900">{option.priceDisplay ?? `${option.price.toLocaleString('de-DE')} €`}</div>
          <div className="text-[11px] text-gray-400">{option.priceNote}</div>
        </div>
      </div>
    </button>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

type Props = {
  showContent: boolean
  showBundles: boolean
  showGoogle: boolean
  showReviews: boolean
}

export default function KonfiguratorClient({ showContent, showBundles, showGoogle, showReviews }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const visibleAddonOptions = addonOptions.filter(o => {
    if (o.id === 'gbp' && !showGoogle) return false
    if (o.id === 'review' && !showReviews) return false
    return true
  })

  function toggle(id: string, group?: Option[]) {
    setSelected(prev => {
      const next = new Set(prev)
      if (group) group.forEach(o => next.delete(o.id))
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const allOptions: Option[] = [...websiteOptions, ...hostingOptions, ...contentOptions, ...addonOptions]
  const selectedOptions = allOptions.filter(o => selected.has(o.id))

  const selectedHosting = hostingOptions.find(o => selected.has(o.id))
  const selectedContent = contentOptions.find(o => selected.has(o.id))
  const bundleDiscount  = showBundles && selectedHosting && selectedContent
    ? (bundleDiscountMatrix[selectedHosting.id]?.[selectedContent.id] ?? 0)
    : 0

  const onceCost  = selectedOptions.filter(o => o.once ).reduce((s, o) => s + o.price, 0)
  const monthCost = selectedOptions.filter(o => !o.once).reduce((s, o) => s + o.price, 0) - bundleDiscount

  const selectedWebsite = websiteOptions.find(o => selected.has(o.id))
  const featureOptions  = [...(showContent ? contentOptions : []), ...visibleAddonOptions].filter(o => selected.has(o.id))

  const konfig = selectedOptions.length > 0 ? {
    paket:           selectedWebsite ? selectedWebsite.id.replace('web-', '') : null,
    hosting:         selectedHosting  ? selectedHosting.id.replace('host-', '') : null,
    features:        featureOptions.map(o => o.label),
    bundle_rabatt:   bundleDiscount || null,
    preis_einmalig:  onceCost  || null,
    preis_monatlich: monthCost || null,
  } : null

  const contactHref = konfig
    ? `/kontakt?konfig=${encodeURIComponent(JSON.stringify(konfig))}`
    : '/kontakt'

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

        {/* Left: options */}
        <div>
          <Section title="Website-Erstellung" icon="🖥️">
            <p className="text-xs text-gray-400 mb-1 -mt-1">Einmalig — wählen Sie genau eine Option oder überspringen Sie diesen Schritt</p>
            {websiteOptions.map(o => (
              <OptionCard key={o.id} option={o} selected={selected.has(o.id)} onToggle={() => toggle(o.id, websiteOptions)} />
            ))}
          </Section>

          <Section title="Hosting & Pflege" icon="🌐">
            <p className="text-xs text-gray-400 mb-1 -mt-1">Monatlich kündbar — wählen Sie ein Paket</p>
            {hostingOptions.map(o => (
              <OptionCard key={o.id} option={o} selected={selected.has(o.id)} onToggle={() => toggle(o.id, hostingOptions)} />
            ))}
          </Section>

          {showContent && (
            <Section title="Content Creation" icon="🎬">
              <p className="text-xs text-gray-400 mb-1 -mt-1">
                Monatlich — TikTok & Instagram Reels
                {showBundles && <span className="ml-2 text-brand font-semibold">· Kombiniert mit Hosting: Bundle-Rabatt inklusive</span>}
              </p>
              {contentOptions.map(o => (
                <OptionCard key={o.id} option={o} selected={selected.has(o.id)} onToggle={() => toggle(o.id, contentOptions)} />
              ))}
            </Section>
          )}

          {visibleAddonOptions.length > 0 && (
            <Section title="Add-ons" icon="⭐">
              {visibleAddonOptions.map(o => (
                <OptionCard key={o.id} option={o} selected={selected.has(o.id)} onToggle={() => toggle(o.id)} />
              ))}
            </Section>
          )}
        </div>

        {/* Right: sticky summary */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-gray-900 mb-5">Ihre Auswahl</h3>

            {selectedOptions.length === 0 ? (
              <p className="text-sm text-gray-400 mb-6">Noch nichts ausgewählt.</p>
            ) : (
              <ul className="flex flex-col gap-3 mb-4">
                {selectedOptions.map(o => (
                  <li key={o.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-700 leading-tight">{o.label}</span>
                    <span className="text-gray-900 font-semibold shrink-0">
                      {o.priceDisplay ?? `${o.price.toLocaleString('de-DE')} €`} {o.priceNote}
                    </span>
                  </li>
                ))}
                {bundleDiscount > 0 && (
                  <li className="flex items-start justify-between gap-3 text-sm border-t border-dashed border-gray-100 pt-3">
                    <span className="text-green-600 font-semibold leading-tight">Bundle-Rabatt 🎉</span>
                    <span className="text-green-600 font-bold shrink-0">−{bundleDiscount.toLocaleString('de-DE')} €/Mo</span>
                  </li>
                )}
              </ul>
            )}

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 mb-6">
              {onceCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Einmalig</span>
                  <span className="font-bold text-gray-900">
                    {selectedWebsite?.priceDisplay ? `ab ${onceCost.toLocaleString('de-DE')} €` : `${onceCost.toLocaleString('de-DE')} €`}
                  </span>
                </div>
              )}
              {monthCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monatlich</span>
                  <span className="font-bold text-gray-900">{monthCost.toLocaleString('de-DE')} €/Mo</span>
                </div>
              )}
              {onceCost === 0 && monthCost === 0 && selectedOptions.length === 0 && (
                <div className="text-sm text-gray-400">— —</div>
              )}
            </div>

            <Link
              href={contactHref}
              className={`block text-center font-bold text-sm px-6 py-3.5 rounded-lg transition-colors ${
                selectedOptions.length
                  ? 'bg-brand text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 pointer-events-none'
              }`}
              style={selectedOptions.length ? { boxShadow: '0 0 30px rgba(37,99,235,0.3)' } : {}}
            >
              Auswahl anfragen →
            </Link>

            <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
              Kein Kauf — Ihre Auswahl wird als Anfrage geschickt. Wir melden uns persönlich.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
