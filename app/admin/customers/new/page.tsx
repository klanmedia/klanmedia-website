'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

// Note: metadata in client components needs to be in a parent server component
// This form handles new customer creation

type FormData = {
  name: string
  firma: string
  email: string
  tel: string
  adresse: string
  plz: string
  ort: string
  website: string
  notizen: string
}

export default function NewCustomerPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: '', firma: '', email: '', tel: '',
    adresse: '', plz: '', ort: '', website: '', notizen: '',
  })
  const [saving, setSaving] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      router.push(`/admin/customers/${data.id}`)
    } else {
      alert(data.error ?? 'Fehler beim Erstellen.')
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/customers" className="hover:text-gray-600">Kunden</Link>
        <span>/</span>
        <span className="text-gray-700">Neuer Kunde</span>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Neuer Kunde</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
        {/* Name + Firma */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Name *</label>
            <input required name="name" value={form.name} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Max Mustermann" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Firma</label>
            <input name="firma" value={form.firma} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Musterfirma GmbH" />
          </div>
        </div>

        {/* E-Mail + Tel */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">E-Mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="max@firma.de" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Telefon</label>
            <input type="tel" name="tel" value={form.tel} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="+49 123 456789" />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Website</label>
          <input name="website" value={form.website} onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://musterfirma.de" />
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Straße & Hausnr.</label>
          <input name="adresse" value={form.adresse} onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Musterstraße 1" />
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">PLZ</label>
            <input name="plz" value={form.plz} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="12345" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Ort</label>
            <input name="ort" value={form.ort} onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Musterstadt" />
          </div>
        </div>

        {/* Notizen */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Interne Notizen</label>
          <textarea name="notizen" value={form.notizen} onChange={handleChange} rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            placeholder="Besonderheiten, Hinweise…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Wird gespeichert…' : 'Kunde anlegen'}
          </button>
          <Link href="/admin/customers"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
