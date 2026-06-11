'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Project = {
  id: string
  paket: string | null
  hosting: string | null
  preis_einmalig: number | null
  preis_monatlich: number | null
  status: string
  created_at: string
}

const statusOptions = ['angebot', 'aktiv', 'abgeschlossen', 'pausiert']
const statusConfig: Record<string, { label: string; style: string }> = {
  angebot:        { label: 'Angebot',       style: 'bg-blue-50 text-blue-700 border-blue-200' },
  aktiv:          { label: 'Aktiv',         style: 'bg-green-50 text-green-700 border-green-200' },
  abgeschlossen:  { label: 'Abgeschlossen', style: 'bg-gray-100 text-gray-500 border-gray-200' },
  pausiert:       { label: 'Pausiert',      style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
}

type EditForm = {
  paket: string
  hosting: string
  preis_einmalig: string
  preis_monatlich: string
  status: string
}

function eur(n: number | null) {
  if (!n) return '—'
  return n.toLocaleString('de-DE') + ' €'
}

export default function CustomerProjectsManager({
  initialProjects,
  customerId,
}: {
  initialProjects: Project[]
  customerId: string
}) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError]         = useState<string | null>(null)
  const [form, setForm] = useState<EditForm>({ paket: '', hosting: '', preis_einmalig: '', preis_monatlich: '', status: 'angebot' })
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<EditForm>({ paket: '', hosting: '', preis_einmalig: '', preis_monatlich: '', status: 'angebot' })
  const [adding, setAdding] = useState(false)

  function startEdit(p: Project) {
    setEditingId(p.id)
    setForm({
      paket:           p.paket           ?? '',
      hosting:         p.hosting         ?? '',
      preis_einmalig:  p.preis_einmalig  != null ? String(p.preis_einmalig)  : '',
      preis_monatlich: p.preis_monatlich != null ? String(p.preis_monatlich) : '',
      status:          p.status,
    })
  }

  async function handleSave(id: string) {
    setSaving(true)
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paket:           form.paket           || null,
        hosting:         form.hosting         || null,
        preis_einmalig:  form.preis_einmalig  ? Number(form.preis_einmalig)  : null,
        preis_monatlich: form.preis_monatlich ? Number(form.preis_monatlich) : null,
        status:          form.status,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setProjects(prev => prev.map(p => p.id === id ? {
        ...p,
        paket:           form.paket           || null,
        hosting:         form.hosting         || null,
        preis_einmalig:  form.preis_einmalig  ? Number(form.preis_einmalig)  : null,
        preis_monatlich: form.preis_monatlich ? Number(form.preis_monatlich) : null,
        status:          form.status,
      } : p))
      setEditingId(null)
      router.refresh()
    } else {
      alert('Fehler beim Speichern.')
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setDeleteError(null)
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id))
      setConfirmDeleteId(null)
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setDeleteError(d.error ?? 'Löschen fehlgeschlagen.')
      setConfirmDeleteId(null)
    }
  }

  async function handleAdd() {
    setAdding(true)
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id:     customerId,
        paket:           addForm.paket           || null,
        hosting:         addForm.hosting         || null,
        preis_einmalig:  addForm.preis_einmalig  ? Number(addForm.preis_einmalig)  : null,
        preis_monatlich: addForm.preis_monatlich ? Number(addForm.preis_monatlich) : null,
        status:          addForm.status,
      }),
    })
    setAdding(false)
    if (res.ok) {
      const data = await res.json()
      setProjects(prev => [data.project, ...prev])
      setShowAdd(false)
      setAddForm({ paket: '', hosting: '', preis_einmalig: '', preis_monatlich: '', status: 'angebot' })
      router.refresh()
    } else {
      alert('Fehler beim Erstellen.')
    }
  }

  const inputCls = 'border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Projekte</h2>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          + Neues Projekt
        </button>
      </div>

      {showAdd && (
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500 mb-3">Neues Projekt</p>
          <ProjectFormFields form={addForm} setForm={setAddForm} inputCls={inputCls} />
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} disabled={adding}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
              {adding ? 'Erstellt…' : 'Erstellen'}
            </button>
            <button onClick={() => setShowAdd(false)}
              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start justify-between gap-2">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">×</button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">Noch kein Projekt.</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {projects.map(p => {
            const cfg = statusConfig[p.status] ?? statusConfig.angebot
            const isEditing = editingId === p.id
            const isConfirmingDelete = confirmDeleteId === p.id

            return (
              <div key={p.id}>
                <div className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 capitalize">{p.paket ?? '—'}</span>
                      {p.hosting && <span className="text-xs text-gray-400">· {p.hosting}</span>}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.style}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {p.preis_einmalig ? eur(p.preis_einmalig) + ' einmalig' : ''}
                      {p.preis_einmalig && p.preis_monatlich ? ' · ' : ''}
                      {p.preis_monatlich ? eur(p.preis_monatlich) + '/Mo' : ''}
                      {!p.preis_einmalig && !p.preis_monatlich ? 'Kein Preis' : ''}
                      {' · '}{new Date(p.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/invoices/new?customer=${customerId}&project=${p.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                      title="Rechnung erstellen"
                    >
                      🧾
                    </Link>
                    <button
                      onClick={() => isEditing ? setEditingId(null) : startEdit(p)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        isEditing ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {isEditing ? 'Schließen' : 'Bearbeiten'}
                    </button>
                    {!isConfirmingDelete ? (
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        Löschen
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {deletingId === p.id ? '…' : 'Ja, löschen'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                          Abbrechen
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="px-6 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                    <ProjectFormFields form={form} setForm={setForm} inputCls={inputCls} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleSave(p.id)} disabled={saving}
                        className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                        {saving ? 'Speichert…' : 'Speichern'}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProjectFormFields({
  form, setForm, inputCls,
}: {
  form: EditForm
  setForm: React.Dispatch<React.SetStateAction<EditForm>>
  inputCls: string
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Paket</label>
        <input value={form.paket} onChange={e => setForm(f => ({ ...f, paket: e.target.value }))}
          placeholder="z. B. business" className={inputCls} />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Hosting</label>
        <input value={form.hosting} onChange={e => setForm(f => ({ ...f, hosting: e.target.value }))}
          placeholder="z. B. standard" className={inputCls} />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Status</label>
        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          className={inputCls}>
          {statusOptions.map(s => <option key={s} value={s}>{statusConfig[s]?.label ?? s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Preis einmalig (€)</label>
        <input type="number" min={0} value={form.preis_einmalig}
          onChange={e => setForm(f => ({ ...f, preis_einmalig: e.target.value }))}
          placeholder="0" className={inputCls} />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Preis monatlich (€)</label>
        <input type="number" min={0} value={form.preis_monatlich}
          onChange={e => setForm(f => ({ ...f, preis_monatlich: e.target.value }))}
          placeholder="0" className={inputCls} />
      </div>
    </div>
  )
}
