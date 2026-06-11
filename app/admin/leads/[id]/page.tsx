'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

type Lead = {
  id: string
  name: string
  email: string
  tel: string | null
  nachricht: string | null
  konfig_paket: string | null
  konfig_hosting: string | null
  konfig_features: string[] | null
  konfig_preis_einmalig: number | null
  konfig_preis_monatlich: number | null
  status: string
  created_at: string
}

const statusConfig: Record<string, { label: string; style: string }> = {
  neu:            { label: 'Neu',            style: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_bearbeitung: { label: 'In Bearbeitung', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  konvertiert:    { label: 'Konvertiert',    style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  abgelehnt:      { label: 'Abgelehnt',      style: 'bg-gray-100 text-gray-500 border-gray-200' },
  gelesen:        { label: 'Gelesen',        style: 'bg-gray-100 text-gray-600 border-gray-200' },
  beantwortet:    { label: 'Beantwortet',    style: 'bg-green-50 text-green-700 border-green-200' },
}

const statusOptions = ['neu', 'in_bearbeitung', 'abgelehnt', 'konvertiert']

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [converting, setConverting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then(r => r.json())
      .then(d => { setLead(d.lead); setLoading(false) })
      .catch(() => { setError('Lead konnte nicht geladen werden.'); setLoading(false) })
  }, [id])

  async function updateStatus(status: string) {
    if (!lead) return
    // "konvertiert" triggers the full conversion flow (creates customer + project)
    if (status === 'konvertiert') {
      convertToCustomer()
      return
    }
    setUpdating(true)
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(false)
    if (res.ok) setLead(prev => prev ? { ...prev, status } : null)
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/leads')
    } else {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Löschen fehlgeschlagen.')
    }
  }

  async function convertToCustomer() {
    if (!lead) return
    setConverting(true)
    const res = await fetch(`/api/admin/leads/${id}/convert`, { method: 'POST' })
    const data = await res.json()
    setConverting(false)
    if (res.ok) {
      router.push(`/admin/customers/${data.customerId}`)
    } else {
      alert(data.error ?? 'Konvertierung fehlgeschlagen.')
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center gap-3 text-gray-400">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      Lädt…
    </div>
  )

  if (error || !lead) return (
    <div className="p-8">
      <div className="text-red-600 mb-4">{error ?? 'Lead nicht gefunden.'}</div>
      <Link href="/admin/leads" className="text-blue-600 hover:underline text-sm">← Zurück zu Leads</Link>
    </div>
  )

  const cfg = statusConfig[lead.status] ?? statusConfig.gelesen
  const hasKonfig = lead.konfig_paket || lead.konfig_hosting || lead.konfig_features?.length

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/leads" className="hover:text-gray-600">Leads</Link>
        <span>/</span>
        <span className="text-gray-700">{lead.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main */}
        <div className="flex flex-col gap-5">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{lead.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Eingegangen: {new Date(lead.created_at).toLocaleString('de-DE')}
                </p>
              </div>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cfg.style}`}>
                {cfg.label}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
              >
                ✉ {lead.email}
              </a>
              {lead.tel && (
                <a href={`tel:${lead.tel}`} className="inline-flex items-center gap-2 text-sm text-gray-600">
                  📞 {lead.tel}
                </a>
              )}
            </div>
          </div>

          {/* Nachricht */}
          {lead.nachricht && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Nachricht</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{lead.nachricht}</p>
            </div>
          )}

          {/* Konfig */}
          {hasKonfig && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-500 mb-4">Konfigurator-Auswahl</h2>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {lead.konfig_paket && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paket</span>
                    <span className="font-semibold capitalize">{lead.konfig_paket}</span>
                  </div>
                )}
                {lead.konfig_hosting && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hosting</span>
                    <span className="font-semibold capitalize">{lead.konfig_hosting}</span>
                  </div>
                )}
                {lead.konfig_features?.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-blue-500">+</span>
                    <span>{f}</span>
                  </div>
                ))}
                {(lead.konfig_preis_einmalig != null || lead.konfig_preis_monatlich != null) && (
                  <div className="border-t border-blue-200 mt-2 pt-3 flex flex-col gap-1">
                    {lead.konfig_preis_einmalig != null && (
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Einmalig</span>
                        <span>{lead.konfig_preis_einmalig.toLocaleString('de-DE')} €</span>
                      </div>
                    )}
                    {lead.konfig_preis_monatlich != null && (
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Monatlich</span>
                        <span>{lead.konfig_preis_monatlich.toLocaleString('de-DE')} €/Mo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Status</h2>
            <div className="flex flex-col gap-2">
              {statusOptions.map(s => {
                const c = statusConfig[s]
                const active = lead.status === s
                return (
                  <button
                    key={s}
                    disabled={updating || active}
                    onClick={() => updateStatus(s)}
                    className={`text-left text-sm px-3 py-2.5 rounded-xl border font-medium transition-colors disabled:opacity-50 ${
                      active ? c.style : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Aktionen */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Aktionen</h2>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${lead.email}?subject=Ihre Anfrage bei klanmedia`}
                className="text-center text-sm font-semibold px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                ✉ E-Mail schreiben
              </a>
              {lead.status !== 'konvertiert' && (
                <button
                  onClick={convertToCustomer}
                  disabled={converting}
                  className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {converting ? 'Wird konvertiert…' : '👥 Zu Kunde konvertieren'}
                </button>
              )}
              {lead.status === 'konvertiert' && (
                <Link
                  href="/admin/customers"
                  className="text-center text-sm font-semibold px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  → Zur Kundenliste
                </Link>
              )}
            </div>
          </div>

          {/* Delete */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Lead löschen</h2>
            <p className="text-xs text-gray-400 mb-3">Löscht nur diesen Lead. Ein bereits erstellter Kundeneintrag bleibt erhalten.</p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
              >
                Lead löschen
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500">Diesen Lead wirklich löschen?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 text-sm font-bold px-3 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    {deleting ? '…' : 'Ja, löschen'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
