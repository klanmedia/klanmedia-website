import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import InvoiceActions from './_components/InvoiceActions'

export const metadata: Metadata = { title: 'Rechnung' }

type Position = {
  beschreibung: string
  menge: number
  einzelpreis: number
  typ?: 'einmalig' | 'monatlich'
}

function eur(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

const statusStyle: Record<string, string> = {
  entwurf:      'bg-gray-100 text-gray-600 border-gray-200',
  versendet:    'bg-blue-50 text-blue-700 border-blue-200',
  bezahlt:      'bg-green-50 text-green-700 border-green-200',
  ueberfaellig: 'bg-red-50 text-red-700 border-red-200',
}
const statusLabel: Record<string, string> = {
  entwurf: 'Entwurf', versendet: 'Versendet', bezahlt: 'Bezahlt', ueberfaellig: 'Überfällig',
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: invoice } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(name, firma, adresse, plz, ort, email)`)
    .eq('id', id)
    .maybeSingle()

  if (!invoice) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customer = (Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers) as any
  const positionen = (invoice.positionen ?? []) as Position[]

  const einmaligPos  = positionen.filter(p => !p.typ || p.typ === 'einmalig')
  const monatlichPos = positionen.filter(p => p.typ === 'monatlich')
  const einmaligSum  = einmaligPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const monatlichSum = monatlichPos.reduce((s, p) => s + p.menge * p.einzelpreis, 0)
  const nettoGesamt  = positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0)

  const docxFilename = `${invoice.rechnungsnummer ?? 'Rechnung'}.docx`

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/invoices" className="hover:text-gray-600">Rechnungen</Link>
        <span>/</span>
        <span className="text-gray-700 font-mono">{invoice.rechnungsnummer ?? id}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-mono">{invoice.rechnungsnummer}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle[invoice.status] ?? statusStyle.entwurf}`}>
              {statusLabel[invoice.status] ?? invoice.status}
            </span>
            {invoice.datum && (
              <span className="text-sm text-gray-400">{new Date(invoice.datum).toLocaleDateString('de-DE')}</span>
            )}
            {invoice.faellig_am && (
              <span className="text-sm text-gray-400">Fällig: {new Date(invoice.faellig_am).toLocaleDateString('de-DE')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Left: invoice content */}
        <div className="flex flex-col gap-5">
          {/* Recipient */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Rechnungsempfänger</h2>
            {customer ? (
              <div className="text-sm text-gray-700">
                <div className="font-semibold">{customer.firma ?? customer.name}</div>
                {customer.firma && <div className="text-gray-500">{customer.name}</div>}
                {customer.adresse && <div className="text-gray-500 mt-1">{customer.adresse}</div>}
                {(customer.plz || customer.ort) && (
                  <div className="text-gray-500">{[customer.plz, customer.ort].filter(Boolean).join(' ')}</div>
                )}
                {customer.email && (
                  <a href={`mailto:${customer.email}`} className="text-blue-500 hover:underline mt-1 block">{customer.email}</a>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400">Kein Kunde verknüpft.</div>
            )}
          </div>

          {/* Positions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-5">Leistungspositionen</h2>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_60px_110px_100px] gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 px-1">
              <span>Beschreibung</span>
              <span className="text-right">Menge</span>
              <span className="text-right">Einzelpreis</span>
              <span className="text-right">Gesamt</span>
            </div>

            {einmaligPos.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2">Einmalig</div>
                <div className="flex flex-col divide-y divide-gray-50">
                  {einmaligPos.map((p, i) => (
                    <div key={i} className="grid grid-cols-[1fr_60px_110px_100px] gap-3 py-2.5 text-sm">
                      <span className="text-gray-800">{p.beschreibung}</span>
                      <span className="text-right text-gray-500">{p.menge}</span>
                      <span className="text-right text-gray-500">{eur(p.einzelpreis)}</span>
                      <span className="text-right font-semibold text-gray-900">{eur(p.menge * p.einzelpreis)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {monatlichPos.length > 0 && (
              <div className={einmaligPos.length > 0 ? 'pt-3 border-t border-dashed border-gray-200' : ''}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2 mt-3">Monatlich</div>
                <div className="flex flex-col divide-y divide-gray-50">
                  {monatlichPos.map((p, i) => (
                    <div key={i} className="grid grid-cols-[1fr_60px_110px_100px] gap-3 py-2.5 text-sm">
                      <span className="text-gray-800">{p.beschreibung}</span>
                      <span className="text-right text-gray-500">{p.menge}</span>
                      <span className="text-right text-gray-500">{eur(p.einzelpreis)}</span>
                      <span className="text-right font-semibold text-gray-900">{eur(p.menge * p.einzelpreis)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col items-end gap-1.5">
              {einmaligSum > 0 && monatlichSum > 0 && (
                <>
                  <div className="flex justify-between gap-8 text-sm w-56">
                    <span className="text-gray-500">Einmalig</span>
                    <span className="font-semibold text-gray-900">{eur(einmaligSum)}</span>
                  </div>
                  <div className="flex justify-between gap-8 text-sm w-56">
                    <span className="text-gray-500">Monatlich</span>
                    <span className="font-semibold text-gray-900">{eur(monatlichSum)}/Mo</span>
                  </div>
                </>
              )}
              <div className="flex justify-between gap-8 text-sm w-56 pt-1">
                <span className="text-gray-700 font-medium">Nettobetrag</span>
                <span className="font-extrabold text-gray-900 text-base">{eur(nettoGesamt)}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen.</div>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div>
          <InvoiceActions
            invoiceId={id}
            currentStatus={invoice.status}
            docxFilename={docxFilename}
          />

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mt-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Info</h2>
            <div className="text-xs text-gray-400 flex flex-col gap-1.5">
              <div>Erstellt: {new Date(invoice.created_at).toLocaleString('de-DE')}</div>
              {invoice.customer_id && (
                <Link href={`/admin/customers/${invoice.customer_id}`} className="text-blue-500 hover:underline">
                  Zum Kundenprofil →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
