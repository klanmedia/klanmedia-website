'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusOptions = [
  { value: 'entwurf',      label: 'Entwurf' },
  { value: 'versendet',    label: 'Versendet' },
  { value: 'bezahlt',      label: 'Bezahlt' },
  { value: 'ueberfaellig', label: 'Überfällig' },
]

const statusStyle: Record<string, string> = {
  entwurf:      'bg-gray-100 text-gray-600 border-gray-200',
  versendet:    'bg-blue-50 text-blue-700 border-blue-200',
  bezahlt:      'bg-green-50 text-green-700 border-green-200',
  ueberfaellig: 'bg-red-50 text-red-700 border-red-200',
}

export default function InvoiceActions({
  invoiceId,
  currentStatus,
  docxFilename,
}: {
  invoiceId: string
  currentStatus: string
  docxFilename: string
}) {
  const router = useRouter()
  const [status, setStatus]               = useState(currentStatus)
  const [saving, setSaving]               = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleStatusChange(newStatus: string) {
    setSaving(true)
    await fetch(`/api/admin/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setSaving(false)
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/invoices/${invoiceId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/invoices')
    } else {
      setDeleting(false)
      setConfirmDelete(false)
      alert('Löschen fehlgeschlagen.')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Status</h2>
        <div className="flex flex-col gap-1.5">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={saving}
              className={`text-left text-sm font-semibold px-3 py-2 rounded-lg border transition-all ${
                status === opt.value
                  ? statusStyle[opt.value]
                  : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
              }`}
            >
              {status === opt.value && <span className="mr-1.5">✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-2.5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Aktionen</h2>

        {/* Edit */}
        <Link
          href={`/admin/invoices/${invoiceId}/edit`}
          className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ✏️ Bearbeiten
        </Link>

        {/* Preview */}
        <a
          href={`/api/admin/invoices/${invoiceId}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
        >
          👁 Vorschau
        </a>

        {/* Save as PDF */}
        <a
          href={`/api/admin/invoices/${invoiceId}/preview?print=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          🖨️ Als PDF speichern
        </a>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="block w-full text-center text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 transition-colors"
          >
            Rechnung löschen
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 text-sm font-bold px-3 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {deleting ? 'Löscht…' : 'Wirklich löschen'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 text-sm font-medium px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
