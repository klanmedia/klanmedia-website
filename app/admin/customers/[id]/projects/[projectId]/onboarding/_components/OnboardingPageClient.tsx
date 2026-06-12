'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ── Design tokens ──────────────────────────────────────────────────────────
const D = {
  bg:       '#0d0f1a',
  surface:  '#13162a',
  surface2: '#1a1e35',
  border:   '#2a2f52',
  acc:      '#4f8ef7',
  acc2:     '#7aaaff',
  text:     '#e0e6f8',
  muted:    '#7a88b0',
  green:    '#48bb78',
}

// ── Types ──────────────────────────────────────────────────────────────────

type WizardData = {
  branche: string; existingWebsite: string; existingUrl: string
  pages: string; features: string[]
  auth: string; authDesc: string; cms: string
  integrations: string; integDesc: string; design: string
  timeline: string; budget: string; abo: string; notes: string
  paket: string; preis_einmalig: number | null; preis_monatlich: number | null
  savedAt: string
}

type Project = {
  id: string; paket: string | null
  preis_einmalig: number | null; preis_monatlich: number | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anforderungen_data: Record<string, any> | null
}

// ── Features & options ─────────────────────────────────────────────────────

const FEATURES = [
  { v: 'Kontaktformular',              d: '' },
  { v: 'Google Maps / Standort',       d: '' },
  { v: 'Bildergalerie / Portfolio',    d: '' },
  { v: 'Blog / News',                  d: '' },
  { v: 'Online-Terminbuchung',         d: '→ mind. Business' },
  { v: 'Fahrzeug- / Produkt-Listings', d: '→ mind. Premium' },
  { v: 'Nutzerkonten (Kunden-Login)',   d: '→ Premium / Enterprise' },
  { v: 'Admin-Bereich / CMS',          d: '→ mind. Business' },
  { v: 'Online-Shop',                  d: '→ Enterprise' },
  { v: 'API-Anbindungen',              d: '→ Premium / Enterprise' },
]

const BRANCHEN = [
  'Autohaus / KFZ', 'Handwerk / Bau', 'Dienstleistung (Beratung, Recht, Finanzen)',
  'Gastronomie / Hotel', 'Medizin / Gesundheit', 'Handel / Einzelhandel',
  'Immobilien', 'Sonstiges',
]

// ── Package logic ──────────────────────────────────────────────────────────

function calcPkg(d: Partial<WizardData>) {
  const f = d.features ?? []
  const hasAuth = d.auth === 'Ja'  || f.includes('Nutzerkonten (Kunden-Login)')
  const hasCMS  = d.cms  === 'Ja'  || f.includes('Admin-Bereich / CMS')
  const hasAPI  = f.includes('API-Anbindungen') || d.integrations === 'Ja'
  const hasShop = f.includes('Online-Shop')
  const hasBook = f.includes('Online-Terminbuchung')
  const hasLst  = f.includes('Fahrzeug- / Produkt-Listings')
  const many    = d.pages === '10+'; const medium = d.pages === '6-10'

  let paket: string; let preis_einmalig: number
  if (many || (hasAPI && hasAuth) || hasShop)            { paket = 'Enterprise'; preis_einmalig = 2500 }
  else if (hasAuth || (hasAPI && !hasAuth) || hasLst)    { paket = 'Premium';    preis_einmalig = 1500 }
  else if (medium || hasCMS || hasBook || f.length >= 4) { paket = 'Business';   preis_einmalig = 800 }
  else                                                   { paket = 'Starter';    preis_einmalig = 500 }

  let preis_monatlich: number | null = null
  if (d.abo === 'Ja')             preis_monatlich = (paket === 'Premium' || paket === 'Enterprise') ? 150 : 100
  else if (d.abo === 'Vielleicht') preis_monatlich = 50

  return { paket, preis_einmalig, preis_monatlich }
}

const PKG_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Starter:    { bg: '#0f2d1f', border: '#2d6a4f', text: D.green },
  Business:   { bg: '#0f1e3d', border: '#1d4ed8', text: '#60a5fa' },
  Premium:    { bg: '#1e0f3d', border: '#6d28d9', text: '#c084fc' },
  Enterprise: { bg: '#3d0f0f', border: '#b91c1c', text: '#f87171' },
}

// ── Dark UI primitives ─────────────────────────────────────────────────────

function DRadio({ value, selected, onClick, label, desc }: {
  value: string; selected: boolean; onClick: () => void; label: string; desc?: string
}) {
  return (
    <button type="button" onClick={onClick} style={{
      background: selected ? '#1a2a50' : D.surface, border: `1px solid ${selected ? D.acc : D.border}`,
      color: D.text, borderRadius: 8, padding: '10px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
      textAlign: 'left', transition: 'all 0.15s', width: '100%',
    }}>
      <span style={{ marginTop: 2, width: 16, height: 16, borderRadius: '50%', border: `2px solid ${selected ? D.acc : D.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: D.acc, display: 'block' }} />}
      </span>
      <span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
        {desc && <span style={{ display: 'block', fontSize: 12, color: D.muted, marginTop: 2 }}>{desc}</span>}
      </span>
    </button>
  )
}

function DCheck({ value, checked, onChange, label, desc }: {
  value: string; checked: boolean; onChange: (v: string, on: boolean) => void; label: string; desc?: string
}) {
  return (
    <button type="button" onClick={() => onChange(value, !checked)} style={{
      background: checked ? '#1a2a50' : D.surface, border: `1px solid ${checked ? D.acc : D.border}`,
      color: D.text, borderRadius: 8, padding: '10px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
      textAlign: 'left', transition: 'all 0.15s', width: '100%',
    }}>
      <span style={{ marginTop: 2, width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked ? D.acc : D.muted}`, background: checked ? D.acc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {checked && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </span>
      <span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
        {desc && <span style={{ display: 'block', fontSize: 12, color: D.muted, marginTop: 2 }}>{desc}</span>}
      </span>
    </button>
  )
}

function DInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', background: D.surface, border: `1px solid ${D.border}`, color: D.text, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
      onFocus={e => { e.target.style.borderColor = D.acc }}
      onBlur={e => { e.target.style.borderColor = D.border }}
    />
  )
}

function DTextarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: '100%', background: D.surface, border: `1px solid ${D.border}`, color: D.text, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
      onFocus={e => { e.target.style.borderColor = D.acc }}
      onBlur={e => { e.target.style.borderColor = D.border }}
    />
  )
}

function DSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: D.surface, border: `1px solid ${D.border}`, color: value ? D.text : D.muted, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
      <option value="" style={{ background: D.surface2 }}>— Bitte wählen —</option>
      {options.map(o => <option key={o} value={o} style={{ background: D.surface2 }}>{o}</option>)}
    </select>
  )
}

function DField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.acc2, marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────

function emptyWizard(): WizardData {
  return {
    branche: '', existingWebsite: '', existingUrl: '', pages: '', features: [],
    auth: '', authDesc: '', cms: '', integrations: '', integDesc: '',
    design: '', timeline: '', budget: '', abo: '', notes: '',
    paket: '', preis_einmalig: null, preis_monatlich: null, savedAt: '',
  }
}

// ── Main component ─────────────────────────────────────────────────────────

export default function OnboardingPageClient({
  customerId, customerName, project,
}: {
  customerId: string
  customerName: string
  project: Project
}) {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'result'>(
    (project.anforderungen_data as WizardData | null)?.savedAt ? 'result' : 1
  )
  const [data, setData] = useState<WizardData>(
    (project.anforderungen_data as WizardData | null) ?? emptyWizard()
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(!!(project.anforderungen_data as WizardData | null)?.savedAt)

  function set<K extends keyof WizardData>(k: K, v: WizardData[K]) {
    setData(prev => ({ ...prev, [k]: v }))
    setSaved(false)
  }
  function toggleFeature(v: string, on: boolean) {
    setData(prev => ({ ...prev, features: on ? [...prev.features, v] : prev.features.filter(f => f !== v) }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const pkg = calcPkg(data)
    const payload: WizardData = { ...data, ...pkg, savedAt: new Date().toISOString() }
    await fetch(`/api/admin/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paket: pkg.paket.toLowerCase(), preis_einmalig: pkg.preis_einmalig, preis_monatlich: pkg.preis_monatlich, anforderungen_data: payload }),
    })
    setData(payload)
    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  const livePkg  = calcPkg(data)
  const pkgStyle = PKG_STYLE[livePkg.paket] ?? PKG_STYLE.Starter

  const STEPS = ['Basisinfos', 'Funktionen', 'Technisches', 'Zeitplan']

  return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.text, fontFamily: 'inherit' }}>

      {/* Header */}
      <header style={{ background: '#080b14', borderBottom: `1px solid ${D.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href={`/admin/customers/${customerId}`} style={{ color: D.muted, fontSize: 13, textDecoration: 'none' }}>
          ← Zurück
        </Link>
        <div style={{ width: 1, height: 20, background: D.border }} />
        <div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
            KLAN<span style={{ color: D.acc }}>MEDIA</span>
          </span>
          <span style={{ fontSize: 12, color: D.muted, marginLeft: 10 }}>Anforderungen</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: D.muted, background: D.surface2, border: `1px solid ${D.border}`, padding: '3px 10px', borderRadius: 20 }}>
            {customerName}
          </span>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Wizard */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Progress */}
          {step !== 'result' && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                {STEPS.map((l, i) => (
                  <span key={l} style={{ fontSize: 11, color: step === i + 1 ? D.acc : D.muted, fontWeight: step === i + 1 ? 700 : 400 }}>{l}</span>
                ))}
              </div>
              <div style={{ height: 4, background: D.surface2, borderRadius: 2 }}>
                <div style={{ height: 4, background: D.acc, borderRadius: 2, width: `${(Number(step) / 4) * 100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          {/* Step 1 — Basisinfos */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Über das Unternehmen</h2>
              <p style={{ color: D.muted, fontSize: 14, marginBottom: 24 }}>Grundlegende Infos zur aktuellen Situation.</p>

              <DField label="Branche">
                <DSelect value={data.branche} onChange={v => set('branche', v)} options={BRANCHEN} />
              </DField>

              <DField label="Bestehende Website?">
                <div style={{ display: 'flex', gap: 8, marginBottom: data.existingWebsite === 'Ja' ? 10 : 0 }}>
                  {['Ja', 'Nein'].map(v => (
                    <DRadio key={v} value={v} label={v} selected={data.existingWebsite === v} onClick={() => set('existingWebsite', v)} />
                  ))}
                </div>
                {data.existingWebsite === 'Ja' && (
                  <DInput value={data.existingUrl} onChange={v => set('existingUrl', v)} placeholder="www.beispiel.de" />
                )}
              </DField>
            </div>
          )}

          {/* Step 2 — Funktionen */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Was soll die Website können?</h2>
              <p style={{ color: D.muted, fontSize: 14, marginBottom: 24 }}>Umfang und gewünschte Funktionen.</p>

              <DField label="Wie viele Seiten / Bereiche?">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { v: '1-2',  l: '1–2 Seiten',        d: 'Landingpage oder Single-Page' },
                    { v: '3-5',  l: '3–5 Seiten',        d: 'Startseite, Leistungen, Über uns, Kontakt …' },
                    { v: '6-10', l: '6–10 Seiten',        d: 'Mehrere Leistungen, Bereiche oder Standorte' },
                    { v: '10+',  l: 'Mehr als 10 Seiten', d: 'Großes Projekt, Portal, Plattform' },
                  ].map(({ v, l, d }) => (
                    <DRadio key={v} value={v} label={l} desc={d} selected={data.pages === v} onClick={() => set('pages', v)} />
                  ))}
                </div>
              </DField>

              <DField label="Gewünschte Funktionen">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {FEATURES.map(f => (
                    <DCheck key={f.v} value={f.v} label={f.v} desc={f.d}
                      checked={data.features.includes(f.v)} onChange={toggleFeature} />
                  ))}
                </div>
              </DField>
            </div>
          )}

          {/* Step 3 — Technisches */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Technische Details</h2>
              <p style={{ color: D.muted, fontSize: 14, marginBottom: 24 }}>Für die richtige Paketempfehlung.</p>

              <DField label="Kunden-Login / Nutzerkonten?">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: data.auth === 'Ja' ? 10 : 0 }}>
                  {[
                    { v: 'Ja',       d: 'Kunden haben eigene Konten, können sich anmelden' },
                    { v: 'Nein',     d: 'Öffentliche Website ohne Login' },
                    { v: 'Unsicher', d: '' },
                  ].map(({ v, d }) => (
                    <DRadio key={v} value={v} label={v} desc={d} selected={data.auth === v} onClick={() => set('auth', v)} />
                  ))}
                </div>
                {data.auth === 'Ja' && (
                  <DTextarea value={data.authDesc} onChange={v => set('authDesc', v)}
                    placeholder="Was sollen eingeloggte Nutzer tun können?" rows={2} />
                )}
              </DField>

              <DField label="Adminbereich / CMS (Inhalte selbst pflegen)?">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {['Ja', 'Nein', 'Unsicher'].map(v => (
                    <div key={v} style={{ flex: 1, minWidth: 80 }}>
                      <DRadio value={v} label={v} selected={data.cms === v} onClick={() => set('cms', v)} />
                    </div>
                  ))}
                </div>
              </DField>

              <DField label="Bestehende Systeme anbinden? (Warenwirtschaft, CRM …)">
                <div style={{ display: 'flex', gap: 8, marginBottom: data.integrations === 'Ja' ? 10 : 0 }}>
                  {['Ja', 'Nein'].map(v => (
                    <DRadio key={v} value={v} label={v} selected={data.integrations === v} onClick={() => set('integrations', v)} />
                  ))}
                </div>
                {data.integrations === 'Ja' && (
                  <DInput value={data.integDesc} onChange={v => set('integDesc', v)}
                    placeholder="z.B. Warenwirtschaft, Kassensystem, CRM …" />
                )}
              </DField>

              <DField label="Design-Vorstellungen (optional)">
                <DTextarea value={data.design} onChange={v => set('design', v)}
                  placeholder="z.B. modern und dunkel, ähnlich wie …, Farben: blau/weiß …" rows={2} />
              </DField>
            </div>
          )}

          {/* Step 4 — Zeitplan */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Zeitplan & Betreuung</h2>
              <p style={{ color: D.muted, fontSize: 14, marginBottom: 24 }}>Letzter Schritt — dann kommt die Paketempfehlung.</p>

              <DField label="Wann soll die Website live gehen?">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['So schnell wie möglich', '1–3 Monate', '3–6 Monate', 'Kein fester Termin'].map(v => (
                    <DRadio key={v} value={v} label={v} selected={data.timeline === v} onClick={() => set('timeline', v)} />
                  ))}
                </div>
              </DField>

              <DField label="Budget-Vorstellung">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Unter 500 €', '500 – 1.500 €', '1.500 – 3.000 €', 'Über 3.000 €', 'Noch nicht festgelegt'].map(v => (
                    <DRadio key={v} value={v} label={v} selected={data.budget === v} onClick={() => set('budget', v)} />
                  ))}
                </div>
              </DField>

              <DField label="Interesse an monatlicher Betreuung & Hosting?">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { v: 'Ja',         d: 'Hosting, Updates, Anpassungen — alles sorglos' },
                    { v: 'Vielleicht', d: 'Klingt interessant, mehr Infos' },
                    { v: 'Nein',       d: 'Ich kümmere mich selbst' },
                  ].map(({ v, d }) => (
                    <DRadio key={v} value={v} label={v} desc={d} selected={data.abo === v} onClick={() => set('abo', v)} />
                  ))}
                </div>
              </DField>

              <DField label="Weitere Anmerkungen (optional)">
                <DTextarea value={data.notes} onChange={v => set('notes', v)}
                  placeholder="Alles was noch wichtig sein könnte …" rows={3} />
              </DField>
            </div>
          )}

          {/* Result */}
          {step === 'result' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Paketempfehlung</h2>
                {data.savedAt && (
                  <p style={{ color: D.muted, fontSize: 13 }}>
                    Gespeichert am {new Date(data.savedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: pkgStyle.bg, border: `1px solid ${pkgStyle.border}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 6 }}>Website-Erstellung</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: pkgStyle.text, marginBottom: 4 }}>{livePkg.paket}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>ab {livePkg.preis_einmalig?.toLocaleString('de-DE')} €</div>
                </div>
                <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 6 }}>Monatliche Betreuung</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: D.acc2, marginBottom: 4 }}>
                    {livePkg.preis_monatlich ? (livePkg.preis_monatlich >= 150 ? 'Premium' : livePkg.preis_monatlich >= 100 ? 'Standard' : 'Basic') : 'Kein Abo'}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
                    {livePkg.preis_monatlich ? `${livePkg.preis_monatlich} €/Mo` : '—'}
                  </div>
                </div>
              </div>

              <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 14 }}>Zusammenfassung</h3>
                {([
                  ['Branche',           data.branche],
                  ['Bestehende Website', data.existingWebsite === 'Ja' ? `Ja — ${data.existingUrl || 'keine URL'}` : data.existingWebsite],
                  ['Seitenumfang',      data.pages],
                  ['Nutzer-Login',      data.auth],
                  ['Admin-Bereich',     data.cms],
                  ['Anbindungen',       data.integrations === 'Ja' ? `Ja — ${data.integDesc}` : data.integrations],
                  ['Go-Live',           data.timeline],
                  ['Budget',            data.budget],
                ] as [string, string][]).filter(([, v]) => v && v !== '—').map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${D.border}`, fontSize: 13 }}>
                    <span style={{ color: D.muted }}>{l}</span>
                    <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{v}</span>
                  </div>
                ))}
              </div>

              {data.features.length > 0 && (
                <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 12 }}>Gewünschte Funktionen</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {data.features.map(f => (
                      <span key={f} style={{ background: D.surface2, border: `1px solid ${D.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: D.acc2 }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.notes && (
                <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 8 }}>Anmerkungen</h3>
                  <p style={{ fontSize: 13, color: D.text, lineHeight: 1.6 }}>{data.notes}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{ background: D.surface2, border: `1px solid ${D.border}`, color: D.text, borderRadius: 8, padding: '12px 24px', cursor: 'pointer', fontSize: 14 }}>
                  ✏️ Bearbeiten
                </button>
                <button onClick={save} disabled={saving}
                  style={{ background: saved ? '#1a3d2a' : D.acc, border: `1px solid ${saved ? D.green : D.acc}`, color: '#fff', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Speichert…' : saved ? '✓ Gespeichert' : '💾 Speichern & Projekt aktualisieren'}
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step !== 'result' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
              {step > 1 ? (
                <button onClick={() => setStep(prev => (Number(prev) - 1) as 1|2|3|4)}
                  style={{ background: D.surface2, border: `1px solid ${D.border}`, color: D.muted, borderRadius: 8, padding: '12px 24px', cursor: 'pointer', fontSize: 14 }}>
                  ← Zurück
                </button>
              ) : <div />}

              {step < 4 ? (
                <button onClick={() => setStep(prev => (Number(prev) + 1) as 2|3|4)}
                  style={{ background: D.acc, border: 'none', color: '#fff', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  Weiter →
                </button>
              ) : (
                <button onClick={() => setStep('result')}
                  style={{ background: D.green, border: 'none', color: '#fff', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  Auswertung anzeigen ✓
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary panel */}
        <div style={{ width: 190, flexShrink: 0, position: 'sticky', top: 80, background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 14, fontSize: 12 }}>
          <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: D.muted, marginBottom: 10 }}>Aktuelle Auswahl</h4>
          <div style={{ background: pkgStyle.border, color: '#fff', borderRadius: 6, padding: '6px 10px', fontWeight: 700, fontSize: 13, marginBottom: 10, textAlign: 'center' as const }}>
            → {livePkg.paket}
          </div>
          {([
            ['Seiten',    data.pages     || '—'],
            ['Login',     data.auth      || '—'],
            ['CMS',       data.cms       || '—'],
            ['Betreuung', data.abo       || '—'],
            ['Budget',    data.budget    || '—'],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${D.border}`, gap: 6 }}>
              <span style={{ color: D.muted, flexShrink: 0 }}>{l}</span>
              <span style={{ color: D.text, fontWeight: 500, textAlign: 'right' as const, fontSize: 11 }}>{v}</span>
            </div>
          ))}
          {data.features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 8 }}>
              {data.features.map(f => {
                const short = f.replace(' (Kunden-Login)', '').replace(' / Standort', '').replace(' / Portfolio', '').replace(' / Produkt-Listings', '')
                return <span key={f} style={{ background: D.surface2, border: `1px solid ${D.border}`, borderRadius: 10, padding: '2px 7px', fontSize: 10, color: D.acc2 }}>{short}</span>
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
