'use client'

import { useState } from 'react'

const STEPS = [
  { id: 'domain',       label: 'Domain & E-Mail',             icon: '🌐', desc: 'Domainname, Weiterleitung, Geschäfts-E-Mail einrichten' },
  { id: 'google',       label: 'Google Business Profil',      icon: '📍', desc: 'Profil anlegen, verifizieren, Infos eintragen' },
  { id: 'social',       label: 'Social Media Accounts',       icon: '📱', desc: 'Instagram, TikTok, Facebook — Zugänge & Handles' },
  { id: 'branding',     label: 'Branding',                    icon: '🎨', desc: 'Logo, Farben (HEX), Schriften, Brand-Kit' },
  { id: 'inhalte',      label: 'Website-Inhalte',             icon: '✍️', desc: 'Texte, Beschreibungen, USPs, Leistungen' },
  { id: 'testimonials', label: 'Testimonials & Referenzen',   icon: '⭐', desc: 'Kundenstimmen, Bewertungen, Referenzprojekte' },
  { id: 'medien',       label: 'Fotos & Videos',              icon: '📸', desc: 'Produktfotos, Team, Location — Rohmaterial' },
  { id: 'seo',          label: 'SEO-Keywords',                icon: '🔍', desc: 'Hauptkeywords, Zielregion, Mitbewerber' },
  { id: 'legal',        label: 'Datenschutz & Impressum',     icon: '📋', desc: 'Angaben für Impressum & Datenschutzerklärung' },
  { id: 'zahlung',      label: 'Zahlungsmodalitäten',         icon: '💳', desc: 'Zahlungsart, IBAN, Rechnungsadresse' },
  { id: 'launch',       label: 'Abnahme & Launch-Check',      icon: '🚀', desc: 'Finale Freigabe, Test auf allen Geräten, Go-Live' },
]

type StepStatus = 'offen' | 'in_bearbeitung' | 'erledigt'

type StepData = {
  status: StepStatus
  notizen: string
}

type OnboardingData = Record<string, StepData>

const defaultStep = (): StepData => ({ status: 'offen', notizen: '' })

const statusConfig = {
  offen:          { label: 'Offen',           style: 'bg-gray-100 text-gray-500 border-gray-200',           dot: 'bg-gray-300' },
  in_bearbeitung: { label: 'In Bearbeitung',  style: 'bg-yellow-50 text-yellow-700 border-yellow-200',      dot: 'bg-yellow-400' },
  erledigt:       { label: 'Erledigt',        style: 'bg-emerald-50 text-emerald-700 border-emerald-200',   dot: 'bg-emerald-500' },
}

export default function OnboardingTool({
  projectId,
  initialData,
}: {
  projectId: string
  // Accept loose types from DB (status is stored as plain string)
  initialData: Record<string, { status: string; notizen: string }> | null
}) {
  const [data, setData] = useState<OnboardingData>(
    STEPS.reduce((acc, s) => {
      const raw = initialData?.[s.id]
      return {
        ...acc,
        [s.id]: raw
          ? { status: raw.status as StepStatus, notizen: raw.notizen ?? '' }
          : defaultStep(),
      }
    }, {} as OnboardingData)
  )
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function setStepField(id: string, field: keyof StepData, value: string) {
    setData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
    setSaved(false)
  }

  async function saveData() {
    setSaving(true)
    await fetch(`/api/admin/customers/projects/${projectId}/onboarding`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding_data: data }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const done    = STEPS.filter(s => data[s.id]?.status === 'erledigt').length
  const running = STEPS.filter(s => data[s.id]?.status === 'in_bearbeitung').length
  const pct     = Math.round((done / STEPS.length) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-gray-900">Onboarding</h2>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-500">{done}/{STEPS.length}</span>
          </div>
          {running > 0 && (
            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
              {running} in Bearbeitung
            </span>
          )}
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
            saved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-60`}
        >
          {saving ? 'Speichert…' : saved ? '✓ Gespeichert' : 'Speichern'}
        </button>
      </div>

      {/* Step list */}
      <div className="divide-y divide-gray-100">
        {STEPS.map(step => {
          const stepData = data[step.id] ?? defaultStep()
          const cfg      = statusConfig[stepData.status]
          const isOpen   = activeStep === step.id

          return (
            <div key={step.id} className="group">
              {/* Step row */}
              <button
                onClick={() => setActiveStep(isOpen ? null : step.id)}
                className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg shrink-0">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{step.desc}</div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.style}`}>
                  {cfg.label}
                </span>
                <span className={`text-gray-300 text-sm shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                  <div className="flex gap-2 mt-4 mb-3">
                    {(['offen', 'in_bearbeitung', 'erledigt'] as StepStatus[]).map(s => {
                      const c = statusConfig[s]
                      const active = stepData.status === s
                      return (
                        <button
                          key={s}
                          onClick={() => setStepField(step.id, 'status', s)}
                          className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${
                            active ? c.style : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Notizen
                  </label>
                  <textarea
                    value={stepData.notizen}
                    onChange={e => setStepField(step.id, 'notizen', e.target.value)}
                    rows={3}
                    placeholder={`Notizen zu: ${step.label}…`}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
