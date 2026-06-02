'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Demo } from '@/lib/demos'

const EMOJI_OPTIONS = ['🚗','🔨','🍽️','🏥','💼','🛍️','🌐','🏋️','💇','🐾','📸','🎓','🏠','⚖️','🔬','🎨','🏪','💈']
const COLOR_OPTIONS = [
  { label: 'Rot',    value: '#dc2626' },
  { label: 'Orange', value: '#d97706' },
  { label: 'Grün',   value: '#16a34a' },
  { label: 'Cyan',   value: '#0891b2' },
  { label: 'Blau',   value: '#2563eb' },
  { label: 'Lila',   value: '#7c3aed' },
  { label: 'Pink',   value: '#db2777' },
  { label: 'Grau',   value: '#4b5563' },
]

const EMPTY_FORM = {
  industry: '',
  description: '',
  icon: '🌐',
  color: '#2563eb',
  tags: '',
  url: '',
  is_available: false,
  is_visible: true,
}

function SmallToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
        checked
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-gray-50 border-gray-200 text-gray-400'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      {label}
    </button>
  )
}

function DemoForm({
  initial,
  onSave,
  onCancel,
  loading,
  error,
  submitLabel,
}: {
  initial: typeof EMPTY_FORM
  onSave: (data: typeof EMPTY_FORM) => void
  onCancel: () => void
  loading: boolean
  error: string | null
  submitLabel: string
}) {
  const [form, setForm] = useState(initial)

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Branche *</label>
          <input
            type="text"
            placeholder="z.B. Autohandel & KFZ"
            value={form.industry}
            onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tags (kommagetrennt)</label>
          <input
            type="text"
            placeholder="z.B. Business-Paket, Galerie"
            value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Demo-URL <span className="font-normal text-gray-400">(optional — wird bei "Verfügbar" verlinkt)</span></label>
        <input
          type="url"
          placeholder="https://demo-autohaus.klanmedia.de"
          value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand font-mono"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Beschreibung *</label>
        <textarea
          placeholder="Kurze Beschreibung was diese Demo zeigt..."
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Icon</label>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setForm(f => ({ ...f, icon: e }))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-colors ${
                  form.icon === e ? 'border-brand bg-brand/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Farbe</label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, color: c.value }))}
                title={c.label}
                className={`w-7 h-7 rounded-lg border-2 transition-all ${
                  form.color === c.value ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))}
          className="accent-blue-600"
        />
        <span className="text-sm text-gray-600">Demo bereits verfügbar (sonst "Demo in Kürze")</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          disabled={loading}
          onClick={() => onSave(form)}
          className="bg-brand text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird gespeichert…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-200 text-gray-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:border-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}

export default function DemoManager({ initialDemos }: { initialDemos: Demo[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [demos, setDemos] = useState<Demo[]>(initialDemos)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleToggle(demo: Demo, field: 'is_visible' | 'is_available') {
    setTogglingId(demo.id + field)
    const res = await fetch('/api/admin/demos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: demo.id, [field]: !demo[field] }),
    })
    setTogglingId(null)
    if (res.ok) {
      setDemos(prev => prev.map(d => d.id === demo.id ? { ...d, [field]: !demo[field] } : d))
      startTransition(() => router.refresh())
    }
  }

  async function handleEdit(id: string, formData: typeof EMPTY_FORM) {
    setEditLoading(true)
    setEditError(null)
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await fetch('/api/admin/demos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        industry: formData.industry,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        tags,
        url: formData.url || null,
        is_available: formData.is_available,
      }),
    })
    const json = await res.json()
    setEditLoading(false)
    if (!res.ok) {
      setEditError(json.error ?? 'Fehler beim Speichern.')
      return
    }
    setDemos(prev => prev.map(d => d.id === id
      ? { ...d, industry: formData.industry, description: formData.description, icon: formData.icon, color: formData.color, tags, url: formData.url || null, is_available: formData.is_available }
      : d
    ))
    setEditingId(null)
    startTransition(() => router.refresh())
  }

  async function handleDelete(id: string) {
    if (!confirm('Demo wirklich löschen?')) return
    setDeletingId(id)
    const res = await fetch('/api/admin/demos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    if (res.ok) {
      setDemos(prev => prev.filter(d => d.id !== id))
      startTransition(() => router.refresh())
    }
  }

  async function handleCreate(formData: typeof EMPTY_FORM) {
    setCreateLoading(true)
    setCreateError(null)
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    const res = await fetch('/api/admin/demos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, tags, url: formData.url || null }),
    })
    const json = await res.json()
    setCreateLoading(false)
    if (!res.ok) {
      setCreateError(json.error ?? 'Fehler beim Erstellen.')
      return
    }
    setDemos(prev => [...prev, json.demo])
    setShowForm(false)
    startTransition(() => router.refresh())
  }

  return (
    <div className="space-y-3">
      {demos.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
          Noch keine Demos vorhanden. Füge deinen ersten hinzu.
        </div>
      )}

      {demos.map(demo => {
        const isEditing = editingId === demo.id
        return (
          <div
            key={demo.id}
            className={`bg-white rounded-2xl border transition-opacity ${
              !demo.is_visible ? 'opacity-50 border-gray-100' : isEditing ? 'border-brand/30' : 'border-gray-200'
            }`}
          >
            {/* Header row — always visible */}
            <div className="flex items-start gap-4 p-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${demo.color}18` }}
              >
                {demo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold text-gray-900 text-[15px]">{demo.industry}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{demo.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <SmallToggle
                      checked={demo.is_visible}
                      onChange={() => togglingId ? undefined : handleToggle(demo, 'is_visible')}
                      label="Sichtbar"
                    />
                    <SmallToggle
                      checked={demo.is_available}
                      onChange={() => togglingId ? undefined : handleToggle(demo, 'is_available')}
                      label="Verfügbar"
                    />
                    <button
                      onClick={() => { setEditingId(isEditing ? null : demo.id); setEditError(null) }}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                        isEditing
                          ? 'bg-brand/10 border-brand/30 text-brand'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {isEditing ? 'Schließen' : 'Bearbeiten'}
                    </button>
                    <button
                      onClick={() => handleDelete(demo.id)}
                      disabled={deletingId === demo.id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {deletingId === demo.id ? '…' : 'Löschen'}
                    </button>
                  </div>
                </div>
                {demo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {demo.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {demo.url && (
                  <a href={demo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-brand hover:underline mt-1.5">
                    ↗ {demo.url}
                  </a>
                )}
              </div>
            </div>

            {/* Edit form — inline expandable */}
            {isEditing && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                <DemoForm
                  initial={{
                    industry: demo.industry,
                    description: demo.description,
                    icon: demo.icon,
                    color: demo.color,
                    tags: demo.tags.join(', '),
                    url: demo.url ?? '',
                    is_available: demo.is_available,
                    is_visible: demo.is_visible,
                  }}
                  onSave={(data) => handleEdit(demo.id, data)}
                  onCancel={() => { setEditingId(null); setEditError(null) }}
                  loading={editLoading}
                  error={editError}
                  submitLabel="Änderungen speichern"
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-5 text-sm font-semibold text-gray-400 hover:border-brand hover:text-brand transition-colors"
        >
          + Neuen Demo hinzufügen
        </button>
      )}

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-brand/20 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 text-[15px] mb-4">Neuer Demo-Eintrag</h3>
          <DemoForm
            initial={EMPTY_FORM}
            onSave={handleCreate}
            onCancel={() => { setShowForm(false); setCreateError(null) }}
            loading={createLoading}
            error={createError}
            submitLabel="Demo erstellen"
          />
        </div>
      )}

      <p className="text-xs text-gray-400 pt-1">
        <strong className="text-gray-500">Sichtbar</strong> = wird auf der Seite angezeigt &nbsp;·&nbsp;
        <strong className="text-gray-500">Verfügbar</strong> = Live-Demo vorhanden (sonst grauer "Demo in Kürze" Badge)
      </p>
    </div>
  )
}
