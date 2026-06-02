'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHero from '../_components/PageHero'

function KontaktForm() {
  const searchParams = useSearchParams()
  const configParam = searchParams.get('config')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: configParam ? `Meine Auswahl aus dem Konfigurator:\n${decodeURIComponent(configParam)}\n\n` : '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        config: configParam ?? undefined,
      }),
    })
    setLoading(false)
    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      alert(data.error ?? 'Fehler beim Senden. Bitte versuche es erneut.')
    }
  }

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-6">✅</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Nachricht gesendet!</h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
          Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen — meistens deutlich schneller.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {configParam && (
        <div className="bg-brand/5 border border-brand/20 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-brand font-bold text-lg mt-0.5 shrink-0">✓</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Konfiguration übernommen</p>
            <p className="text-xs text-gray-500 leading-relaxed">Ihre Auswahl aus dem Konfigurator wurde in die Nachricht eingetragen — Sie können sie unten noch anpassen.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Name *</label>
          <input
            required
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Max Mustermann"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">E-Mail *</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="max@beispiel.de"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Telefon</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+49 123 456789"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Unternehmen</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Musterfirma GmbH"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nachricht *</label>
        <textarea
          required
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={6}
          placeholder="Was kann ich für Sie tun? Beschreiben Sie kurz Ihr Projekt oder Ihre Anfrage..."
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-brand text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}
      >
        {loading ? 'Wird gesendet…' : 'Nachricht senden →'}
      </button>

      <p className="text-xs text-gray-400">
        Mit dem Absenden stimmen Sie zu, dass wir Ihre Daten zur Bearbeitung Ihrer Anfrage verwenden dürfen. Mehr dazu in unserer{' '}
        <a href="/datenschutz" className="text-brand hover:underline">Datenschutzerklärung</a>.
      </p>
    </form>
  )
}

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={<>Schreiben Sie uns.<br /><em className="not-italic text-brand">Wir antworten schnell.</em></>}
        subtitle="Kostenloses Erstgespräch, kein Druck. Einfach kurz beschreiben was Sie brauchen — wir melden uns."
      />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-start">

          {/* Form */}
          <div>
            <Suspense fallback={<div className="h-96 rounded-2xl bg-gray-50 animate-pulse" />}>
              <KontaktForm />
            </Suspense>
          </div>

          {/* Info sidebar */}
          <div className="flex flex-col gap-5">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
              <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">Direktkontakt</div>
              <div className="flex flex-col gap-4">
                <a href="mailto:Benno-Klan@gmx.de" className="flex items-center gap-3 group">
                  <span className="text-xl">✉️</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">E-Mail</div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">Benno-Klan@gmx.de</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
              <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">Was danach passiert</div>
              <ol className="flex flex-col gap-4">
                {[
                  { step: '01', text: 'Wir lesen Ihre Anfrage und melden uns in der Regel noch am selben Tag.' },
                  { step: '02', text: 'Kurzes kostenloses Erstgespräch — Ihre Ziele, Ihr Budget, Ihr Zeitplan.' },
                  { step: '03', text: 'Sie bekommen ein konkretes Angebot. Ohne Verpflichtung.' },
                ].map(item => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="text-[11px] font-bold text-brand tracking-widest shrink-0 mt-0.5">{item.step}</span>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
              <div className="text-brand font-bold text-lg mb-2">⚡</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Keine Warteschleife.</span> Kein Ticket-System. Direkter Kontakt — persönlich und schnell.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
