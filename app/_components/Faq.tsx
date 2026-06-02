'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Was kostet eine Website?',
    a: 'Das hängt vom Umfang ab — eine professionelle Unternehmenswebsite startet bei ca. 1.500 €. Nach einem Erstgespräch erhalten Sie ein klares, detailliertes Angebot.',
  },
  {
    q: 'Wie lange dauert die Entwicklung?',
    a: 'Eine Standard-Unternehmenswebsite ist in der Regel in 2–4 Wochen fertig. Bei komplexeren Projekten (z.B. individuelle Software, Buchungssysteme) planen wir gemeinsam einen realistischen Zeitrahmen.',
  },
  {
    q: 'Kann ich die Website später selbst bearbeiten?',
    a: 'Ja — auf Wunsch integrieren wir ein Content-Management-System (CMS), mit dem Sie Texte, Bilder und Inhalte selbst pflegen können, ohne technisches Know-how.',
  },
  {
    q: 'Was passiert, wenn meine Website nicht erreichbar ist?',
    a: 'Wir überwachen Ihre Website rund um die Uhr. Bei Problemen werden wir automatisch benachrichtigt und kümmern uns sofort darum — oft bevor Sie es selbst bemerken.',
  },
  {
    q: 'Muss ich einen langfristigen Vertrag abschließen?',
    a: 'Hosting-Verträge sind monatlich kündbar. Kein Mindestvertrag, keine automatischen Verlängerungen.',
  },
  {
    q: 'Ich habe bereits eine Website — können Sie die übernehmen?',
    a: 'Ja, wir können bestehende Websites übernehmen, modernisieren oder auf unser Hosting umziehen. Sprechen Sie uns einfach an.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between py-5 text-left gap-8 group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-[16px] font-semibold text-gray-900 group-hover:text-brand transition-colors">
              {faq.q}
            </span>
            <span className="text-gray-400 shrink-0 text-xl leading-none transition-transform duration-300" style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
              +
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? '200px' : '0px', opacity: open === i ? 1 : 0 }}
          >
            <p className="text-sm text-gray-500 leading-relaxed pb-5 max-w-2xl">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
