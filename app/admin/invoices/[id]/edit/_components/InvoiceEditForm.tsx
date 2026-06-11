'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type PositionTyp = 'einmalig' | 'monatlich'
type Position = { beschreibung: string; menge: number; einzelpreis: number; typ: PositionTyp }

type Customer = { id: string; name: string; firma: string | null }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InvoiceEditForm({ invoice, customers }: { invoice: any; customers: Customer[] }) {
  const router = useRouter()
  const invoiceId: string = invoice.id

  const [rechnungsnummer, setRechnungsnummer] = useState<string>(invoice.rechnungsnummer ?? '')
  const [customerId, setCustomerId]           = useState<string>(invoice.customer_id ?? '')
  const [datum, setDatum]                     = useState<string>(invoice.datum?.slice(0, 10) ?? '')
  const [faelligAm, setFaelligAm]             = useState<string>(invoice.faellig_am?.slice(0, 10) ?? '')
  const [leistungsdatum, setLeistungsdatum]   = useState<string>(invoice.leistungsdatum?.slice(0, 10) ?? '')
  const [projektbezeichnung, setProjektbezeichnung] = useState<string>(invoice.projektbezeichnung ?? '')
  const [status, setStatus]                   = useState<string>(invoice.status ?? 'entwurf')
  const [positionen, setPositionen]           = useState<Position[]>(() => {
    const raw = (invoice.positionen ?? []) as { beschreibung?: string; menge?: number; einzelpreis?: number; typ?: string }[]
    return raw.map(p => ({
      beschreibung: p.beschreibung ?? '',
      menge: p.menge ?? 1,
      einzelpreis: p.einzelpreis ?? 0,
      typ: (p.typ === 'monatlich' ? 'monatlich' : 'einmalig') as PositionTyp,
    }))
  })

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  function updatePosition(index: number, field: keyof Position, value: string | number) {
    setPositionen(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  function addPosition(typ: PositionTyp) {
    setPositionen(prev => [...prev, { beschreibung: '', menge: 1, einzelpreis: 0, typ }])
  }

  function removePosition(index: number) {
    setPositionen(prev => prev.filter((_, i) => i !== index))
  }

  const einmaligPos  = positionen.filter(p => p.typ === 'einmalig')
  const monatlichPos = positionen.filter(p => p.typ === 'monatlich')
  const einmaligSum  = einmaligPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const monatlichSum = monatlichPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const nettoGesamt  = positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)

  function eur(n: number) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rechnungsnummer,
        customer_id: customerId || null,
        datum: datum || null,
        faellig_am: faelligAm || null,
        leistungsdatum: leistungsdatum || null,
        projektbezeichnung: projektbezeichnung || null,
        status,
        positionen,
        betrag_gesamt: nettoGesamt,
      }),
    })
    setSaving(false)
    if (res.ok) {
      router.push(`/admin/invoices/${invoiceId}`)
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? 'Speichern fehlgeschlagen.')
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/invoices" className="hover:text-gray-600">Rechnungen</Link>
        <span>/</span>
        <Link href={`/admin/invoices/${invoiceId}`} className="hover:text-gray-600 font-mono">{invoice.rechnungsnummer ?? invoiceId}</Link>
        <span>/</span>
        <span className="text-gray-700">Bearbeiten</span>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Rechnung bearbeiten</h1>

      <div className="flex flex-col gap-6">
        {/* Meta */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-5">Rechnungsdaten</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rechnungsnummer</label>
              <input
                value={rechnungsnummer}
                onChange={e => setRechnungsnummer(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entwurf">Entwurf</option>
                <option value="versendet">Versendet</option>
                <option value="bezahlt">Bezahlt</option>
                <option value="ueberfaellig">Überfällig</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rechnungsdatum</label>
              <input type="date" value={datum} onChange={e => setDatum(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Fällig am</label>
              <input type="date" value={faelligAm} onChange={e => setFaelligAm(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Leistungsdatum</label>
              <input type="date" value={leistungsdatum} onChange={e => setLeistungsdatum(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kunde</label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— kein Kunde —</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.firma ? `${c.firma} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Projektbezeichnung</label>
              <input
                value={projektbezeichnung}
                onChange={e => setProjektbezeichnung(e.target.value)}
                placeholder="z. B. Website-Entwicklung für Max Mustermann"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Positions — Einmalig */}
        <PositionSection
          title="Einmalige Positionen"
          accentClass="text-blue-600"
          positions={positionen}
          filter="einmalig"
          onUpdate={updatePosition}
          onRemove={removePosition}
          onAdd={() => addPosition('einmalig')}
        />

        {/* Positions — Monatlich */}
        <PositionSection
          title="Monatliche Positionen"
          accentClass="text-emerald-600"
          positions={positionen}
          filter="monatlich"
          onUpdate={updatePosition}
          onRemove={removePosition}
          onAdd={() => addPosition('monatlich')}
        />

        {/* Totals */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">Zusammenfassung</h2>
          <div className="flex flex-col items-end gap-1.5">
            {einmaligSum > 0 && monatlichSum > 0 && (
              <>
                <div className="flex justify-between gap-12 text-sm w-64">
                  <span className="text-gray-500">Einmalig</span>
                  <span className="font-semibold">{eur(einmaligSum)}</span>
                </div>
                <div className="flex justify-between gap-12 text-sm w-64">
                  <span className="text-gray-500">Monatlich</span>
                  <span className="font-semibold">{eur(monatlichSum)}/Mo</span>
                </div>
                <div className="w-64 border-t border-gray-200 my-1" />
              </>
            )}
            <div className="flex justify-between gap-12 text-sm w-64">
              <span className="font-bold text-gray-800">Nettobetrag</span>
              <span className="font-extrabold text-gray-900 text-base">{eur(nettoGesamt)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Save / Cancel */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Speichert…' : 'Speichern'}
          </button>
          <Link
            href={`/admin/invoices/${invoiceId}`}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </div>
    </div>
  )
}

function PositionSection({
  title, accentClass, positions, filter, onUpdate, onRemove, onAdd,
}: {
  title: string
  accentClass: string
  positions: Position[]
  filter: PositionTyp
  onUpdate: (index: number, field: keyof Position, value: string | number) => void
  onRemove: (index: number) => void
  onAdd: () => void
}) {
  const filtered = positions
    .map((p, i) => ({ pos: p, globalIndex: i }))
    .filter(({ pos }) => pos.typ === filter)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-[11px] font-bold uppercase tracking-wider ${accentClass}`}>{title}</h2>
        <button
          onClick={onAdd}
          className="text-xs font-bold text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          + Position
        </button>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">Keine Positionen. Klicke „+ Position" um eine hinzuzufügen.</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map(({ pos, globalIndex }) => (
          <div key={globalIndex} className="grid grid-cols-[1fr_80px_110px_36px] gap-2 items-center">
            <input
              value={pos.beschreibung}
              onChange={e => onUpdate(globalIndex, 'beschreibung', e.target.value)}
              placeholder="Beschreibung"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={pos.menge}
              min={1}
              onChange={e => onUpdate(globalIndex, 'menge', Number(e.target.value))}
              placeholder="Menge"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={pos.einzelpreis}
              min={0}
              step={0.01}
              onChange={e => onUpdate(globalIndex, 'einzelpreis', Number(e.target.value))}
              placeholder="Einzelpreis"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onRemove(globalIndex)}
              className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors"
              title="Position entfernen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
