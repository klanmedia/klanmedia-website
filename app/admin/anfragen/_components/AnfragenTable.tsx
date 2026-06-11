'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
  status: 'neu' | 'gelesen' | 'beantwortet'
  created_at: string
}

const statusOptions = [
  { value: 'neu',         label: 'Neu',          style: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'gelesen',     label: 'Gelesen',       style: 'bg-gray-100 text-gray-600 border-gray-200' },
  { value: 'beantwortet', label: 'Beantwortet',   style: 'bg-green-50 text-green-700 border-green-200' },
]

function StatusBadge({ status }: { status: string }) {
  const opt = statusOptions.find(o => o.value === status) ?? statusOptions[1]
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${opt.style}`}>
      {opt.label}
    </span>
  )
}

function KonfigBadge({ lead }: { lead: Lead }) {
  const hasKonfig = lead.konfig_paket || lead.konfig_hosting || lead.konfig_features?.length
  if (!hasKonfig) return null
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-brand/5 text-brand border-brand/20">
      Konfig
    </span>
  )
}

export default function AnfragenTable({ anfragen }: { anfragen: Lead[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [updating, setUpdating] = useState(false)

  async function updateStatus(id: string, status: string) {
    setUpdating(true)
    await fetch('/api/admin/anfragen/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setUpdating(false)
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Lead['status'] } : null)
    router.refresh()
  }

  if (anfragen.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center text-gray-400 text-sm">
        Noch keine Anfragen eingegangen.
      </div>
    )
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Table */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'E-Mail', 'Konfig', 'Status', 'Datum'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {anfragen.map(lead => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${selected?.id === lead.id ? 'bg-blue-50' : ''}`}
              >
                <td className="px-5 py-3.5 font-medium text-gray-900">{lead.name}</td>
                <td className="px-5 py-3.5 text-gray-500">{lead.email}</td>
                <td className="px-5 py-3.5"><KonfigBadge lead={lead} /></td>
                <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                <td className="px-5 py-3.5 text-gray-400">
                  {new Date(lead.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-80 shrink-0 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{selected.name}</h3>
              <p className="text-sm text-gray-500">{selected.email}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>

          {selected.tel && (
            <p className="text-sm text-gray-600">{selected.tel}</p>
          )}

          {selected.nachricht && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Nachricht</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.nachricht}</p>
            </div>
          )}

          {/* Strukturierte Konfig-Anzeige */}
          {(selected.konfig_paket || selected.konfig_hosting || selected.konfig_features?.length) && (
            <div className="bg-brand/5 rounded-xl p-4 border border-brand/10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand mb-3">Konfigurator-Auswahl</p>
              <div className="flex flex-col gap-1.5 text-sm text-gray-700">
                {selected.konfig_paket && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paket</span>
                    <span className="font-semibold capitalize">{selected.konfig_paket}</span>
                  </div>
                )}
                {selected.konfig_hosting && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hosting</span>
                    <span className="font-semibold capitalize">{selected.konfig_hosting}</span>
                  </div>
                )}
                {selected.konfig_features?.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-brand">+</span>
                    <span>{f}</span>
                  </div>
                ))}
                {(selected.konfig_preis_einmalig != null || selected.konfig_preis_monatlich != null) && (
                  <div className="border-t border-brand/10 mt-2 pt-2 flex flex-col gap-1">
                    {selected.konfig_preis_einmalig != null && (
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Einmalig</span>
                        <span>{selected.konfig_preis_einmalig.toLocaleString('de-DE')} €</span>
                      </div>
                    )}
                    {selected.konfig_preis_monatlich != null && (
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Monatlich</span>
                        <span>{selected.konfig_preis_monatlich.toLocaleString('de-DE')} €/Mo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Status ändern</p>
            <div className="flex flex-col gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  disabled={updating || selected.status === opt.value}
                  onClick={() => updateStatus(selected.id, opt.value)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                    selected.status === opt.value
                      ? opt.style + ' font-semibold'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Eingegangen: {new Date(selected.created_at).toLocaleString('de-DE')}
          </p>
        </div>
      )}
    </div>
  )
}
