'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Projekt } from '@/lib/projekte'
import { SmallToggle, EmojiPicker, ColorPicker } from '@/app/admin/_components/ManagerShared'

const CATEGORIES = ['Webentwicklung', 'Webentwicklung & Hosting', 'Hosting', 'Content Creation', 'Webentwicklung & Content', 'Sonstiges']

const EMPTY_FORM = {
  title: '',
  category: 'Webentwicklung',
  description: '',
  icon: '🖥️',
  color: '#2563eb',
  tags: '',
  url: '',
  is_live: true,
}

function ProjektForm({ initial, onSave, onCancel, loading, error, submitLabel }: {
  initial: typeof EMPTY_FORM
  onSave: (data: typeof EMPTY_FORM) => void
  onCancel: () => void
  loading: boolean
  error: string | null
  submitLabel: string
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof EMPTY_FORM, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Projektname *</label>
          <input type="text" placeholder="z.B. Autohaus Müller" value={form.title}
            onChange={e => set('title', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Kategorie</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand bg-white">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Beschreibung *</label>
        <textarea placeholder="Kurze Projektbeschreibung..." value={form.description}
          onChange={e => set('description', e.target.value)} rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tags (kommagetrennt)</label>
          <input type="text" placeholder="z.B. Next.js, Tailwind CSS" value={form.tags}
            onChange={e => set('tags', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Link zur Website <span className="font-normal text-gray-400">(optional)</span></label>
          <input type="url" placeholder="https://kunde.de" value={form.url}
            onChange={e => set('url', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Icon</label>
          <EmojiPicker value={form.icon} onChange={v => set('icon', v)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Farbe</label>
          <ColorPicker value={form.color} onChange={v => set('color', v)} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_live} onChange={e => set('is_live', e.target.checked)} className="accent-blue-600" />
        <span className="text-sm text-gray-600">Abgeschlossen (sonst "In Bearbeitung")</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button type="button" disabled={loading} onClick={() => onSave(form)}
          className="bg-brand text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? 'Wird gespeichert…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-gray-200 text-gray-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:border-gray-300 transition-colors">
          Abbrechen
        </button>
      </div>
    </div>
  )
}

export default function ProjekteManager({ initialProjekte }: { initialProjekte: Projekt[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [items, setItems] = useState<Projekt[]>(initialProjekte)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleToggle(item: Projekt, field: 'is_visible' | 'is_live') {
    const res = await fetch('/api/admin/projekte', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, [field]: !item[field] }),
    })
    if (res.ok) {
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, [field]: !item[field] } : p))
      startTransition(() => router.refresh())
    }
  }

  async function handleEdit(id: string, formData: typeof EMPTY_FORM) {
    setEditLoading(true)
    setEditError(null)
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await fetch('/api/admin/projekte', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: formData.title, category: formData.category, description: formData.description, icon: formData.icon, color: formData.color, tags, url: formData.url || null, is_live: formData.is_live }),
    })
    const json = await res.json()
    setEditLoading(false)
    if (!res.ok) { setEditError(json.error ?? 'Fehler.'); return }
    setItems(prev => prev.map(p => p.id === id ? { ...p, title: formData.title, category: formData.category, description: formData.description, icon: formData.icon, color: formData.color, tags, url: formData.url || null, is_live: formData.is_live } : p))
    setEditingId(null)
    startTransition(() => router.refresh())
  }

  async function handleCreate(formData: typeof EMPTY_FORM) {
    setCreateLoading(true)
    setCreateError(null)
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await fetch('/api/admin/projekte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, tags, url: formData.url || null }),
    })
    const json = await res.json()
    setCreateLoading(false)
    if (!res.ok) { setCreateError(json.error ?? 'Fehler.'); return }
    setItems(prev => [...prev, json.projekt])
    setShowForm(false)
    startTransition(() => router.refresh())
  }

  async function handleDelete(id: string) {
    if (!confirm('Projekt wirklich löschen?')) return
    setDeletingId(id)
    const res = await fetch('/api/admin/projekte', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    if (res.ok) {
      setItems(prev => prev.filter(p => p.id !== id))
      startTransition(() => router.refresh())
    }
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
          Noch keine Projekte vorhanden. Füge dein erstes hinzu.
        </div>
      )}

      {items.map(item => {
        const isEditing = editingId === item.id
        return (
          <div key={item.id} className={`bg-white rounded-2xl border transition-opacity ${!item.is_visible ? 'opacity-50 border-gray-100' : isEditing ? 'border-brand/30' : 'border-gray-200'}`}>
            <div className="flex items-start gap-4 p-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${item.color}18` }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold text-gray-900 text-[15px]">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <SmallToggle checked={item.is_visible} onChange={() => handleToggle(item, 'is_visible')} label="Sichtbar" />
                    <SmallToggle checked={item.is_live} onChange={() => handleToggle(item, 'is_live')} label="Abgeschlossen" />
                    <button onClick={() => { setEditingId(isEditing ? null : item.id); setEditError(null) }}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${isEditing ? 'bg-brand/10 border-brand/30 text-brand' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {isEditing ? 'Schließen' : 'Bearbeiten'}
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      {deletingId === item.id ? '…' : 'Löschen'}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags.map(tag => <span key={tag} className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                )}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-brand hover:underline mt-1.5">↗ {item.url}</a>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                <ProjektForm
                  initial={{ title: item.title, category: item.category, description: item.description, icon: item.icon, color: item.color, tags: item.tags.join(', '), url: item.url ?? '', is_live: item.is_live }}
                  onSave={(data) => handleEdit(item.id, data)}
                  onCancel={() => { setEditingId(null); setEditError(null) }}
                  loading={editLoading} error={editError} submitLabel="Änderungen speichern"
                />
              </div>
            )}
          </div>
        )
      })}

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-5 text-sm font-semibold text-gray-400 hover:border-brand hover:text-brand transition-colors">
          + Neues Projekt hinzufügen
        </button>
      )}

      {showForm && (
        <div className="bg-white border border-brand/20 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 text-[15px] mb-4">Neues Projekt</h3>
          <ProjektForm initial={EMPTY_FORM} onSave={handleCreate} onCancel={() => { setShowForm(false); setCreateError(null) }}
            loading={createLoading} error={createError} submitLabel="Projekt erstellen" />
        </div>
      )}

      <p className="text-xs text-gray-400 pt-1">
        <strong className="text-gray-500">Sichtbar</strong> = wird angezeigt &nbsp;·&nbsp;
        <strong className="text-gray-500">Abgeschlossen</strong> = Projekt ist fertig (sonst "In Bearbeitung" Badge)
      </p>
    </div>
  )
}
