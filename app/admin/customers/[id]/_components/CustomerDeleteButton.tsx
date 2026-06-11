'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomerDeleteButton({ customerId }: { customerId: string }) {
  const router = useRouter()
  const [step, setStep]       = useState<'idle' | 'warn' | 'confirm'>('idle')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/customers/${customerId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/customers')
    } else {
      const d = await res.json().catch(() => ({}))
      setDeleting(false)
      setStep('idle')
      alert(d.error ?? 'Löschen fehlgeschlagen.')
    }
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('warn')}
        className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
      >
        Löschen
      </button>
    )
  }

  if (step === 'warn') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex flex-col gap-2.5">
        <p className="font-semibold">⚠️ Unwiderrufliche Aktion</p>
        <p className="text-red-600 leading-relaxed">
          Alle Projekte und Rechnungen dieses Kunden werden mitgelöscht und können nicht wiederhergestellt werden.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('confirm')}
            className="flex-1 font-bold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Ja, ich verstehe — weiter
          </button>
          <button
            onClick={() => setStep('idle')}
            className="flex-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  // step === 'confirm'
  return (
    <div className="rounded-xl border border-red-300 bg-red-100 p-3 text-xs flex flex-col gap-2.5">
      <p className="font-bold text-red-800">Wirklich endgültig löschen?</p>
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {deleting ? 'Wird gelöscht…' : 'Endgültig löschen'}
        </button>
        <button
          onClick={() => setStep('idle')}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}
