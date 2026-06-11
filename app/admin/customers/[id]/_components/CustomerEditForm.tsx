'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Customer = {
  id: string
  name: string
  email: string | null
  tel: string | null
  firma: string | null
  adresse: string | null
  plz: string | null
  ort: string | null
  website: string | null
  notizen: string | null
}

export default function CustomerEditForm({ customer }: { customer: Customer }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:    customer.name    ?? '',
    firma:   customer.firma   ?? '',
    email:   customer.email   ?? '',
    tel:     customer.tel     ?? '',
    adresse: customer.adresse ?? '',
    plz:     customer.plz     ?? '',
    ort:     customer.ort     ?? '',
    website: customer.website ?? '',
    notizen: customer.notizen ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setEditing(false)
      router.refresh()
    } else {
      alert('Fehler beim Speichern.')
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  const readCls  = 'text-sm text-gray-700'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{customer.name}</h1>
          {customer.firma && <p className="text-sm text-gray-500 mt-0.5">{customer.firma}</p>}
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Bearbeiten
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setForm({ name: customer.name ?? '', firma: customer.firma ?? '', email: customer.email ?? '', tel: customer.tel ?? '', adresse: customer.adresse ?? '', plz: customer.plz ?? '', ort: customer.ort ?? '', website: customer.website ?? '', notizen: customer.notizen ?? '' }) }}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Speichert…' : 'Speichern'}
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Name *</label>
            <input required name="name" value={form.name} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Firma</label>
            <input name="firma" value={form.firma} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">E-Mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Telefon</label>
            <input type="tel" name="tel" value={form.tel} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Website</label>
            <input name="website" value={form.website} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Straße & Nr.</label>
            <input name="adresse" value={form.adresse} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">PLZ</label>
            <input name="plz" value={form.plz} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ort</label>
            <input name="ort" value={form.ort} onChange={handleChange} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Interne Notizen</label>
            <textarea name="notizen" value={form.notizen} onChange={handleChange} rows={3}
              className={inputCls + ' resize-none'} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
          {[
            { l: 'E-Mail',   v: customer.email },
            { l: 'Telefon',  v: customer.tel },
            { l: 'Website',  v: customer.website },
            { l: 'Adresse',  v: [customer.adresse, customer.plz && customer.ort ? `${customer.plz} ${customer.ort}` : customer.ort].filter(Boolean).join(', ') || null },
          ].map(({ l, v }) => v ? (
            <div key={l}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{l}</span>
              <div className={readCls}>{v}</div>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  )
}
