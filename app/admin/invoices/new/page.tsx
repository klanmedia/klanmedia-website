'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

type PositionTyp = 'einmalig' | 'monatlich'

type Position = {
  beschreibung: string
  menge: number
  einzelpreis: number
  typ: PositionTyp
}

type Customer = {
  id: string
  name: string
  firma: string | null
  email: string | null
  adresse: string | null
  plz: string | null
  ort: string | null
}

type Project = {
  id: string
  paket: string | null
  hosting: string | null
  preis_einmalig: number | null
  preis_monatlich: number | null
  status: string
}

function emptyPosition(typ: PositionTyp = 'einmalig'): Position {
  return { beschreibung: '', menge: 1, einzelpreis: 0, typ }
}

function positionsFromProject(p: Project): Position[] {
  const out: Position[] = []
  if (p.preis_einmalig) {
    const label = p.paket
      ? `Website ${p.paket.charAt(0).toUpperCase() + p.paket.slice(1)} – Einmalige Entwicklung`
      : 'Website-Erstellung – Einmalig'
    out.push({ beschreibung: label, menge: 1, einzelpreis: p.preis_einmalig, typ: 'einmalig' })
  }
  if (p.preis_monatlich) {
    const label = p.hosting
      ? `Hosting & Pflege ${p.hosting.charAt(0).toUpperCase() + p.hosting.slice(1)} – Monatlich`
      : 'Hosting & Pflege – Monatlich'
    out.push({ beschreibung: label, menge: 1, einzelpreis: p.preis_monatlich, typ: 'monatlich' })
  }
  return out
}

function InvoiceForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const customerId      = searchParams.get('customer')
  const initialProjectId = searchParams.get('project')

  const [customer, setCustomer]         = useState<Customer | null>(null)
  const [projects, setProjects]         = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId ?? '')
  const [rechnungsnummer, setNummer]    = useState('')
  const [datum, setDatum]               = useState(new Date().toISOString().split('T')[0])
  const [faelligAm, setFaelligAm]       = useState('')
  const [positionen, setPositionen]     = useState<Position[]>([emptyPosition('einmalig')])
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [projectsLoaded, setProjectsLoaded] = useState(false)

  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    setFaelligAm(d.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    fetch('/api/admin/invoices/next-number')
      .then(r => r.json())
      .then(d => setNummer(d.nummer ?? ''))

    if (customerId) {
      fetch(`/api/admin/customers/${customerId}`)
        .then(r => r.json())
        .then(d => setCustomer(d.customer ?? null))

      // Load all projects for this customer
      fetch(`/api/admin/customers/${customerId}/projects`)
        .then(r => r.json())
        .then(d => {
          const list: Project[] = d.projects ?? []
          setProjects(list)
          setProjectsLoaded(true)
        })
    }
  }, [customerId])

  const applyProject = useCallback((projectId: string, allProjects: Project[]) => {
    const p = allProjects.find(x => x.id === projectId)
    if (!p) return
    const prefilled = positionsFromProject(p)
    if (prefilled.length > 0) setPositionen(prefilled)
  }, [])

  // Apply initial project once projects are loaded
  useEffect(() => {
    if (!projectsLoaded || !initialProjectId) return
    applyProject(initialProjectId, projects)
  }, [projectsLoaded, initialProjectId, projects, applyProject])

  function handleProjectChange(projectId: string) {
    setSelectedProjectId(projectId)
    if (projectId) applyProject(projectId, projects)
  }

  function updatePosition(idx: number, field: keyof Position, value: string | number) {
    setPositionen(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  function addPosition(typ: PositionTyp) {
    setPositionen(prev => [...prev, emptyPosition(typ)])
  }

  function removePosition(idx: number) {
    setPositionen(prev => prev.filter((_, i) => i !== idx))
  }

  const einmaligPositionen  = positionen.filter(p => p.typ === 'einmalig')
  const monatlichPositionen = positionen.filter(p => p.typ === 'monatlich')
  const einmaligGesamt  = einmaligPositionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const monatlichGesamt = monatlichPositionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const nettoGesamt     = positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customerId) { setError('Kein Kunde ausgewählt.'); return }
    if (positionen.some(p => !p.beschreibung.trim())) { setError('Alle Positionen brauchen eine Beschreibung.'); return }

    setSaving(true)
    setError(null)

    const res = await fetch('/api/admin/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id:   customerId,
        project_id:    selectedProjectId || null,
        rechnungsnummer,
        datum,
        faellig_am:    faelligAm,
        positionen,
        betrag_gesamt: Math.round(nettoGesamt),
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error ?? 'Fehler beim Erstellen.'); return }

    router.push(`/admin/invoices/${data.id}`)
  }

  function PositionRow({ pos, idx }: { pos: Position; idx: number }) {
    return (
      <div className="grid grid-cols-[1fr_72px_108px_88px_28px] gap-2.5 items-center">
        <input
          value={pos.beschreibung}
          onChange={e => updatePosition(idx, 'beschreibung', e.target.value)}
          placeholder="Leistungsbeschreibung"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <input
          type="number" min="0.01" step="0.01"
          value={pos.menge}
          onChange={e => updatePosition(idx, 'menge', parseFloat(e.target.value) || 0)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-right focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="relative">
          <input
            type="number" min="0" step="0.01"
            value={pos.einzelpreis}
            onChange={e => updatePosition(idx, 'einzelpreis', parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-7 text-sm text-right focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
        </div>
        <div className="text-sm font-semibold text-gray-900 text-right">
          {(pos.menge * pos.einzelpreis).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
        </div>
        <button
          type="button"
          onClick={() => removePosition(idx)}
          disabled={positionen.length === 1}
          className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30 text-xl leading-none"
        >×</button>
      </div>
    )
  }

  const colHeader = (
    <div className="grid grid-cols-[1fr_72px_108px_88px_28px] gap-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-0.5 mb-2">
      <span>Beschreibung</span>
      <span className="text-right">Menge</span>
      <span className="text-right">Einzelpreis</span>
      <span className="text-right">Gesamt</span>
      <span />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/invoices" className="hover:text-gray-600">Rechnungen</Link>
        <span>/</span>
        <span className="text-gray-700">Neue Rechnung</span>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Neue Rechnung</h1>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-col gap-5">
        {/* Meta */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">Rechnungsdetails</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Rechnungsnummer</label>
              <input
                value={rechnungsnummer}
                onChange={e => setNummer(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Datum</label>
              <input
                type="date" value={datum}
                onChange={e => setDatum(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Fällig am</label>
              <input
                type="date" value={faelligAm}
                onChange={e => setFaelligAm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Customer + project */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">Rechnungsempfänger</h2>
          {customer ? (
            <div className="text-sm text-gray-700 mb-4">
              <div className="font-semibold">{customer.firma ?? customer.name}</div>
              {customer.firma && <div className="text-gray-500">{customer.name}</div>}
              {customer.adresse && <div className="text-gray-500 mt-1">{customer.adresse}</div>}
              {(customer.plz || customer.ort) && (
                <div className="text-gray-500">{[customer.plz, customer.ort].filter(Boolean).join(' ')}</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400 mb-4">
              {customerId ? 'Lädt…' : (
                <span>Kein Kunde verknüpft. <Link href="/admin/customers" className="text-blue-600 hover:underline">Kunde auswählen →</Link></span>
              )}
            </div>
          )}

          {/* Project selector — shown when customer has projects */}
          {projects.length > 0 && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Projekt <span className="font-normal text-gray-400 normal-case">(Positionen werden automatisch vorgefüllt)</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={e => handleProjectChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
              >
                <option value="">— Kein Projekt (manuell)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {[
                      p.paket ? p.paket.charAt(0).toUpperCase() + p.paket.slice(1) : null,
                      p.hosting ? `Hosting ${p.hosting}` : null,
                      p.preis_einmalig ? `${p.preis_einmalig.toLocaleString('de-DE')} € einmalig` : null,
                      p.preis_monatlich ? `${p.preis_monatlich.toLocaleString('de-DE')} €/Mo` : null,
                    ].filter(Boolean).join(' · ') || 'Projekt ohne Details'}
                    {' '}({p.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Positions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-5">Leistungspositionen</h2>

          {/* Einmalig */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Einmalig</span>
            </div>
            {colHeader}
            <div className="flex flex-col gap-2.5">
              {positionen.map((pos, idx) => pos.typ === 'einmalig' && (
                <PositionRow key={idx} pos={pos} idx={idx} />
              ))}
            </div>
            <button type="button" onClick={() => addPosition('einmalig')}
              className="mt-3 text-sm text-blue-600 hover:underline w-fit">
              + Einmalige Position
            </button>
          </div>

          {/* Monatlich */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Monatlich</span>
            </div>
            {colHeader}
            <div className="flex flex-col gap-2.5">
              {positionen.map((pos, idx) => pos.typ === 'monatlich' && (
                <PositionRow key={idx} pos={pos} idx={idx} />
              ))}
            </div>
            <button type="button" onClick={() => addPosition('monatlich')}
              className="mt-3 text-sm text-blue-600 hover:underline w-fit">
              + Monatliche Position
            </button>
          </div>

          {/* Summen */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-end gap-1.5">
            {einmaligGesamt > 0 && (
              <div className="flex justify-between gap-8 text-sm w-64">
                <span className="text-gray-500">Einmalig</span>
                <span className="font-semibold text-gray-900">{einmaligGesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
              </div>
            )}
            {monatlichGesamt > 0 && (
              <div className="flex justify-between gap-8 text-sm w-64">
                <span className="text-gray-500">Monatlich</span>
                <span className="font-semibold text-gray-900">{monatlichGesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €/Mo</span>
              </div>
            )}
            <div className="flex justify-between gap-8 text-sm w-64 pt-1 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Gesamt (netto)</span>
              <span className="font-extrabold text-gray-900 text-base">{nettoGesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen.</div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            disabled={saving || !customerId}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Wird erstellt…' : '🧾 Rechnung erstellen'}
          </button>
          <Link
            href={customerId ? `/admin/customers/${customerId}` : '/admin/invoices'}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </div>
    </form>
  )
}

export default function NewInvoicePage() {
  return (
    <div className="p-8">
      <Suspense fallback={<div className="text-gray-400 text-sm">Lädt…</div>}>
        <InvoiceForm />
      </Suspense>
    </div>
  )
}
