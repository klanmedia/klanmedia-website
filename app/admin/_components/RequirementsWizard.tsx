'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export type WizardData = {
  branche: string
  existingWebsite: string
  existingUrl: string
  pages: string
  features: string[]
  auth: string
  authDesc: string
  cms: string
  integrations: string
  integDesc: string
  design: string
  timeline: string
  budget: string
  abo: string
  notes: string
  paket: string
  preis_einmalig: number | null
  preis_monatlich: number | null
  savedAt: string
}

type Props = {
  projectId: string
  initialData: WizardData | null
  onSaved: (result: Pick<WizardData, 'paket' | 'preis_einmalig' | 'preis_monatlich'>) => void
}

// ── Package logic ──────────────────────────────────────────────────────────

function calcPackage(d: Partial<WizardData>) {
  const f = d.features ?? []
  const hasAuth = d.auth === 'Ja'     || f.includes('Nutzerkonten (Kunden-Login)')
  const hasCMS  = d.cms  === 'Ja'     || f.includes('Admin-Bereich / CMS')
  const hasAPI  = f.includes('API-Anbindungen') || d.integrations === 'Ja'
  const hasShop = f.includes('Online-Shop')
  const hasBook = f.includes('Online-Terminbuchung')
  const hasLst  = f.includes('Fahrzeug- / Produkt-Listings')
  const many    = d.pages === '10+'
  const medium  = d.pages === '6-10'

  let paket: string
  let preis_einmalig: number
  if (many || (hasAPI && hasAuth) || hasShop) {
    paket = 'enterprise'; preis_einmalig = 2500
  } else if (hasAuth || (hasAPI && !hasAuth) || hasLst) {
    paket = 'premium'; preis_einmalig = 1500
  } else if (medium || hasCMS || hasBook || f.length >= 4) {
    paket = 'business'; preis_einmalig = 800
  } else {
    paket = 'starter'; preis_einmalig = 500
  }

  let preis_monatlich: number | null = null
  if (d.abo === 'Ja') {
    preis_monatlich = (paket === 'premium' || paket === 'enterprise') ? 150 : 100
  } else if (d.abo === 'Vielleicht') {
    preis_monatlich = 50
  }

  return { paket, preis_einmalig, preis_monatlich }
}

const paketStyle: Record<string, string> = {
  starter:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  business:   'bg-blue-50 text-blue-700 border-blue-200',
  premium:    'bg-purple-50 text-purple-700 border-purple-200',
  enterprise: 'bg-red-50 text-red-700 border-red-200',
}
const paketLabel: Record<string, string> = {
  starter: 'Starter', business: 'Business', premium: 'Premium', enterprise: 'Enterprise',
}
const paketPrice: Record<string, string> = {
  starter: 'ab 500 €', business: 'ab 800 €', premium: 'ab 1.500 €', enterprise: 'ab 2.500 €',
}
const paketNote: Record<string, string> = {
  starter:    'Professionelle Infoseite, responsiv & SEO-ready',
  business:   '5–8 Seiten mit strukturierten Inhalten',
  premium:    'Nutzerkonten / Dashboard / Custom Features',
  enterprise: 'Komplexes Individualprojekt',
}

const FEATURES = [
  { value: 'Kontaktformular',                  desc: '' },
  { value: 'Google Maps / Standort',           desc: '' },
  { value: 'Bildergalerie / Portfolio',        desc: '' },
  { value: 'Blog / News',                      desc: '' },
  { value: 'Online-Terminbuchung',             desc: '→ mind. Business' },
  { value: 'Fahrzeug- / Produkt-Listings',     desc: '→ mind. Premium' },
  { value: 'Nutzerkonten (Kunden-Login)',       desc: '→ Premium / Enterprise' },
  { value: 'Admin-Bereich / CMS',              desc: '→ mind. Business' },
  { value: 'Online-Shop',                      desc: '→ Enterprise' },
  { value: 'API-Anbindungen',                  desc: '→ Premium / Enterprise' },
]

const BRANCHEN = [
  'Autohaus / KFZ', 'Handwerk / Bau', 'Dienstleistung (Beratung, Recht, Finanzen)',
  'Gastronomie / Hotel', 'Medizin / Gesundheit', 'Handel / Einzelhandel',
  'Immobilien', 'Sonstiges',
]

// ── Helpers ────────────────────────────────────────────────────────────────

const empty = (): WizardData => ({
  branche: '', existingWebsite: '', existingUrl: '', pages: '', features: [],
  auth: '', authDesc: '', cms: '', integrations: '', integDesc: '',
  design: '', timeline: '', budget: '', abo: '', notes: '',
  paket: '', preis_einmalig: null, preis_monatlich: null, savedAt: '',
})

function Radio({ value, selected, onClick, label, desc }: {
  value: string; selected: boolean; onClick: () => void; label: string; desc?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
        selected
          ? 'border-blue-400 bg-blue-50 text-blue-900'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-blue-500 block" />}
      </span>
      <span>
        <span className="font-medium">{label}</span>
        {desc && <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>}
      </span>
    </button>
  )
}

function Check({ value, checked, onChange, label, desc }: {
  value: string; checked: boolean; onChange: (v: string, on: boolean) => void; label: string; desc?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !checked)}
      className={`w-full text-left flex items-start gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
        checked
          ? 'border-blue-400 bg-blue-50 text-blue-900'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
        checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
      }`}>
        {checked && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
      </span>
      <span>
        <span className="font-medium">{label}</span>
        {desc && <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>}
      </span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function RequirementsWizard({ projectId, initialData, onSaved }: Props) {
  const [mode, setMode]   = useState<'summary' | 1 | 2 | 3 | 4 | 'result'>('summary')
  const [data, setData]   = useState<WizardData>(initialData ?? empty())
  const [saving, setSaving] = useState(false)

  function set<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }
  function toggleFeature(v: string, on: boolean) {
    setData(prev => ({
      ...prev,
      features: on ? [...prev.features, v] : prev.features.filter(f => f !== v),
    }))
  }

  async function save() {
    setSaving(true)
    const pkg = calcPackage(data)
    const payload: WizardData = { ...data, ...pkg, savedAt: new Date().toISOString() }

    await fetch(`/api/admin/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paket:              pkg.paket,
        preis_einmalig:     pkg.preis_einmalig,
        preis_monatlich:    pkg.preis_monatlich,
        anforderungen_data: payload,
      }),
    })

    setData(payload)
    setSaving(false)
    onSaved(pkg)
    setMode('summary')
  }

  const pkg = calcPackage(data)

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  if (mode === 'summary') {
    if (!data.savedAt) {
      return (
        <div className="px-4 py-5 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-400">Noch keine Anforderungen erfasst.</p>
          <button
            onClick={() => { setData(empty()); setMode(1) }}
            className="text-sm font-bold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            📋 Anforderungen erfassen
          </button>
        </div>
      )
    }

    const savedPkg = calcPackage(data)
    const style = paketStyle[savedPkg.paket] ?? paketStyle.starter

    return (
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style}`}>
            {paketLabel[savedPkg.paket] ?? savedPkg.paket}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{savedPkg.preis_einmalig ? `${savedPkg.preis_einmalig.toLocaleString('de-DE')} € einmalig` : ''}</span>
            {savedPkg.preis_monatlich ? <span>· {savedPkg.preis_monatlich} €/Mo</span> : null}
          </div>
          <button
            onClick={() => setMode(1)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Bearbeiten
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {data.branche      && <div><span className="text-gray-400">Branche: </span><span className="text-gray-700">{data.branche}</span></div>}
          {data.pages        && <div><span className="text-gray-400">Seiten: </span><span className="text-gray-700">{data.pages}</span></div>}
          {data.auth         && data.auth !== '—' && <div><span className="text-gray-400">Login: </span><span className="text-gray-700">{data.auth}</span></div>}
          {data.cms          && data.cms  !== '—' && <div><span className="text-gray-400">CMS: </span><span className="text-gray-700">{data.cms}</span></div>}
          {data.timeline     && <div><span className="text-gray-400">Go-Live: </span><span className="text-gray-700">{data.timeline}</span></div>}
          {data.budget       && <div><span className="text-gray-400">Budget: </span><span className="text-gray-700">{data.budget}</span></div>}
        </div>

        {data.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.features.map(f => (
              <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">{f}</span>
            ))}
          </div>
        )}

        {data.notes && (
          <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">{data.notes}</p>
        )}

        {data.savedAt && (
          <p className="text-[10px] text-gray-300">
            Erfasst: {new Date(data.savedAt).toLocaleDateString('de-DE')}
          </p>
        )}
      </div>
    )
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (mode === 'result') {
    const style = paketStyle[pkg.paket] ?? paketStyle.starter
    return (
      <div className="px-4 py-5 flex flex-col gap-4">
        <div className={`rounded-xl border p-4 ${style.replace('text-', 'border-').replace('bg-', 'border-')}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${style.split(' ')[1]}`}>
            Paketempfehlung
          </div>
          <div className={`text-lg font-extrabold ${style.split(' ')[1]}`}>
            {paketLabel[pkg.paket]}
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">
            {paketPrice[pkg.paket]}
            {pkg.preis_monatlich ? <span className="text-sm font-normal text-gray-500 ml-2">+ {pkg.preis_monatlich} €/Mo</span> : null}
          </div>
          <div className="text-xs text-gray-500 mt-1">{paketNote[pkg.paket]}</div>
        </div>

        {data.features.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Gewünschte Funktionen</p>
            <div className="flex flex-wrap gap-1">
              {data.features.map(f => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{f}</span>
              ))}
            </div>
          </div>
        )}

        {data.notes && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Anmerkungen</p>
            <p className="text-sm text-gray-600 leading-relaxed">{data.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 font-bold text-sm py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Speichert…' : '💾 Speichern & Projekt aktualisieren'}
          </button>
          <button
            onClick={() => setMode(4)}
            className="text-sm px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ← Zurück
          </button>
        </div>
      </div>
    )
  }

  // ── WIZARD STEPS ───────────────────────────────────────────────────────────

  const stepTitles = ['', 'Website & Branche', 'Funktionen', 'Technisches', 'Zeitplan & Budget']
  const progressPct = (Number(mode) / 4) * 100

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">Schritt {mode} / 4 — {stepTitles[Number(mode)]}</span>
          <button onClick={() => setMode('summary')} className="text-xs text-gray-400 hover:text-gray-600">Abbrechen</button>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* ── Step 1 ── */}
      {mode === 1 && (
        <div className="flex flex-col gap-4">
          <Field label="Branche">
            <select
              value={data.branche}
              onChange={e => set('branche', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700"
            >
              <option value="">— Bitte wählen —</option>
              {BRANCHEN.map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="Bestehende Website?">
            <div className="flex gap-2">
              {['Ja', 'Nein'].map(v => (
                <Radio key={v} value={v} label={v} selected={data.existingWebsite === v}
                  onClick={() => set('existingWebsite', v)} />
              ))}
            </div>
            {data.existingWebsite === 'Ja' && (
              <input
                type="text"
                placeholder="www.beispiel.de"
                value={data.existingUrl}
                onChange={e => set('existingUrl', e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </Field>
        </div>
      )}

      {/* ── Step 2 ── */}
      {mode === 2 && (
        <div className="flex flex-col gap-4">
          <Field label="Wie viele Seiten / Bereiche?">
            <div className="flex flex-col gap-2">
              {[
                { v: '1-2', l: '1–2 Seiten', d: 'Landingpage oder Single-Page' },
                { v: '3-5', l: '3–5 Seiten', d: 'Startseite, Leistungen, Über uns, Kontakt …' },
                { v: '6-10', l: '6–10 Seiten', d: 'Mehrere Leistungen, Bereiche oder Standorte' },
                { v: '10+', l: 'Mehr als 10 Seiten', d: 'Großes Projekt, Portal, Plattform' },
              ].map(({ v, l, d }) => (
                <Radio key={v} value={v} label={l} desc={d} selected={data.pages === v} onClick={() => set('pages', v)} />
              ))}
            </div>
          </Field>

          <Field label="Gewünschte Funktionen">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURES.map(f => (
                <Check
                  key={f.value} value={f.value} label={f.value} desc={f.desc}
                  checked={data.features.includes(f.value)}
                  onChange={toggleFeature}
                />
              ))}
            </div>
          </Field>
        </div>
      )}

      {/* ── Step 3 ── */}
      {mode === 3 && (
        <div className="flex flex-col gap-4">
          <Field label="Kunden-Login / Nutzerkonten?">
            <div className="flex flex-col gap-2">
              {[
                { v: 'Ja', d: 'Kunden haben eigene Konten, können sich anmelden' },
                { v: 'Nein', d: 'Öffentliche Website ohne Login' },
                { v: 'Unsicher', d: '' },
              ].map(({ v, d }) => (
                <Radio key={v} value={v} label={v} desc={d} selected={data.auth === v} onClick={() => set('auth', v)} />
              ))}
            </div>
            {data.auth === 'Ja' && (
              <textarea
                rows={2}
                placeholder="Was sollen eingeloggte Nutzer tun können?"
                value={data.authDesc}
                onChange={e => set('authDesc', e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            )}
          </Field>

          <Field label="Adminbereich / CMS (Inhalte selbst pflegen)?">
            <div className="flex gap-2 flex-wrap">
              {['Ja', 'Nein', 'Unsicher'].map(v => (
                <Radio key={v} value={v} label={v} selected={data.cms === v} onClick={() => set('cms', v)} />
              ))}
            </div>
          </Field>

          <Field label="Bestehende Systeme anbinden? (Warenwirtschaft, CRM …)">
            <div className="flex gap-2 flex-wrap">
              {['Ja', 'Nein'].map(v => (
                <Radio key={v} value={v} label={v} selected={data.integrations === v} onClick={() => set('integrations', v)} />
              ))}
            </div>
            {data.integrations === 'Ja' && (
              <input
                type="text"
                placeholder="z.B. Warenwirtschaft, Kassensystem, CRM …"
                value={data.integDesc}
                onChange={e => set('integDesc', e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </Field>

          <Field label="Design-Vorstellungen (optional)">
            <textarea
              rows={2}
              placeholder="z.B. modern und dunkel, ähnlich wie …, Farben: blau/weiß …"
              value={data.design}
              onChange={e => set('design', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </Field>
        </div>
      )}

      {/* ── Step 4 ── */}
      {mode === 4 && (
        <div className="flex flex-col gap-4">
          <Field label="Wann soll die Website live gehen?">
            <div className="flex flex-col gap-2">
              {['So schnell wie möglich', '1–3 Monate', '3–6 Monate', 'Kein fester Termin'].map(v => (
                <Radio key={v} value={v} label={v} selected={data.timeline === v} onClick={() => set('timeline', v)} />
              ))}
            </div>
          </Field>

          <Field label="Budget-Vorstellung">
            <div className="flex flex-col gap-2">
              {['Unter 500 €', '500 – 1.500 €', '1.500 – 3.000 €', 'Über 3.000 €', 'Noch nicht festgelegt'].map(v => (
                <Radio key={v} value={v} label={v} selected={data.budget === v} onClick={() => set('budget', v)} />
              ))}
            </div>
          </Field>

          <Field label="Interesse an monatlicher Betreuung & Hosting?">
            <div className="flex flex-col gap-2">
              {[
                { v: 'Ja', d: 'Hosting, Updates, Anpassungen — alles sorglos' },
                { v: 'Vielleicht', d: 'Klingt interessant, mehr Infos' },
                { v: 'Nein', d: 'Ich kümmere mich selbst' },
              ].map(({ v, d }) => (
                <Radio key={v} value={v} label={v} desc={d} selected={data.abo === v} onClick={() => set('abo', v)} />
              ))}
            </div>
          </Field>

          <Field label="Weitere Anmerkungen (optional)">
            <textarea
              rows={3}
              placeholder="Alles was noch wichtig sein könnte …"
              value={data.notes}
              onChange={e => set('notes', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </Field>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 pt-1">
        {mode > 1 ? (
          <button
            onClick={() => setMode(prev => (Number(prev) - 1) as 1 | 2 | 3 | 4)}
            className="text-sm px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ← Zurück
          </button>
        ) : <div />}

        {mode < 4 ? (
          <button
            onClick={() => setMode(prev => (Number(prev) + 1) as 2 | 3 | 4)}
            className="ml-auto text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Weiter →
          </button>
        ) : (
          <button
            onClick={() => setMode('result')}
            className="ml-auto text-sm font-bold px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Auswertung anzeigen ✓
          </button>
        )}
      </div>
    </div>
  )
}
