'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { HeroText } from '@/lib/content'

type Page = { key: string; label: string; route: string }

type Props = {
  pages: Page[]
  initialTexts: HeroText[]
}

type FormState = {
  variant_name: string
  eyebrow: string
  title: string
  subtitle: string
}

const emptyForm: FormState = { variant_name: '', eyebrow: '', title: '', subtitle: '' }

export default function HeroTextManager({ pages, initialTexts }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [openPage, setOpenPage] = useState<string | null>(pages[0]?.key ?? null)
  const [forms, setForms] = useState<Record<string, FormState>>({})
  const [showForm, setShowForm] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const getVariants = (pageKey: string) => initialTexts.filter(t => t.page_key === pageKey)

  function updateForm(pageKey: string, field: keyof FormState, value: string) {
    setForms(prev => ({ ...prev, [pageKey]: { ...(prev[pageKey] ?? emptyForm), [field]: value } }))
  }

  async function callApi(method: string, body: object) {
    const res = await fetch('/api/admin/hero-texts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let json: Record<string, unknown> = {}
    try { json = JSON.parse(text) } catch {}
    if (!res.ok) throw new Error((json.error as string) ?? text.slice(0, 200))
  }

  async function activate(id: string, page_key: string) {
    setError(null)
    setBusyId(id)
    try {
      await callApi('PATCH', { id, page_key })
      startTransition(() => router.refresh())
    } catch (e) {
      setError(`Fehler: ${e}`)
    } finally {
      setBusyId(null)
    }
  }

  async function deleteVariant(id: string) {
    if (!confirm('Variante wirklich löschen?')) return
    setError(null)
    setBusyId(id)
    try {
      await callApi('DELETE', { id })
      startTransition(() => router.refresh())
    } catch (e) {
      setError(`Fehler: ${e}`)
    } finally {
      setBusyId(null)
    }
  }

  async function createVariant(page_key: string) {
    const form = forms[page_key] ?? emptyForm
    if (!form.variant_name.trim() || !form.title.trim()) {
      setError('Variantenname und Titel sind Pflicht.')
      return
    }
    setError(null)
    setBusyId(`new-${page_key}`)
    try {
      await callApi('POST', { page_key, ...form })
      setForms(prev => ({ ...prev, [page_key]: emptyForm }))
      setShowForm(prev => ({ ...prev, [page_key]: false }))
      startTransition(() => router.refresh())
    } catch (e) {
      setError(`Fehler: ${e}`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {pages.map(page => {
        const variants = getVariants(page.key)
        const active = variants.find(v => v.is_active)
        const isOpen = openPage === page.key
        const form = forms[page.key] ?? emptyForm
        const formVisible = showForm[page.key] ?? false

        return (
          <div key={page.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setOpenPage(isOpen ? null : page.key)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 text-[15px]">{page.label}</span>
                <code className="text-[10px] text-gray-400">{page.route}</code>
              </div>
              <div className="flex items-center gap-3">
                {active ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {active.variant_name}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">Standard (Code)</span>
                )}
                <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Body */}
            {isOpen && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                {/* Existing variants */}
                {variants.length === 0 ? (
                  <p className="text-sm text-gray-400">Noch keine Varianten. Erstelle die erste unten.</p>
                ) : (
                  <div className="space-y-2">
                    {variants.map(v => (
                      <div
                        key={v.id}
                        className={`rounded-xl border px-4 py-3 ${v.is_active ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[13px] font-semibold text-gray-900">{v.variant_name}</span>
                              {v.is_active && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">AKTIV</span>
                              )}
                            </div>
                            {v.eyebrow && <p className="text-[11px] text-gray-400 mb-0.5">Eyebrow: {v.eyebrow}</p>}
                            <p className="text-[12px] text-gray-600 whitespace-pre-wrap break-words leading-relaxed">{v.title}</p>
                            {v.subtitle && <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{v.subtitle}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!v.is_active && (
                              <button
                                onClick={() => activate(v.id, v.page_key)}
                                disabled={busyId === v.id || isPending}
                                className="text-[12px] font-semibold text-brand border border-brand/30 px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors disabled:opacity-40"
                              >
                                Aktivieren
                              </button>
                            )}
                            <button
                              onClick={() => deleteVariant(v.id)}
                              disabled={busyId === v.id || isPending}
                              className="text-[12px] font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create form */}
                {!formVisible ? (
                  <button
                    onClick={() => setShowForm(prev => ({ ...prev, [page.key]: true }))}
                    className="text-[13px] font-semibold text-brand hover:text-blue-700 transition-colors"
                  >
                    + Neue Variante
                  </button>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Neue Variante</p>
                    <input
                      type="text"
                      placeholder="Variantenname (z. B. Standard)"
                      value={form.variant_name}
                      onChange={e => updateForm(page.key, 'variant_name', e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                    <input
                      type="text"
                      placeholder="Eyebrow (z. B. Alle Services)"
                      value={form.eyebrow}
                      onChange={e => updateForm(page.key, 'eyebrow', e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                    <textarea
                      placeholder={"Titel — Zeilenumbruch mit \\n, Farbe mit [blue]...[/blue]\nBeispiel: Was wir für Sie\\n[blue]umsetzen können.[/blue]"}
                      value={form.title}
                      onChange={e => updateForm(page.key, 'title', e.target.value)}
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 font-mono"
                    />
                    <textarea
                      placeholder="Subtitle (optional)"
                      value={form.subtitle}
                      onChange={e => updateForm(page.key, 'subtitle', e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => createVariant(page.key)}
                        disabled={busyId === `new-${page.key}` || isPending}
                        className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
                      >
                        {busyId === `new-${page.key}` ? 'Speichert…' : 'Speichern'}
                      </button>
                      <button
                        onClick={() => setShowForm(prev => ({ ...prev, [page.key]: false }))}
                        className="text-sm font-semibold text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
