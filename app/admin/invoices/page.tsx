import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'
import ClickableRow from '../_components/ClickableRow'

export const metadata: Metadata = { title: 'Rechnungen' }

const statusConfig: Record<string, { label: string; style: string }> = {
  entwurf:      { label: 'Entwurf',    style: 'bg-gray-100 text-gray-500 border-gray-200' },
  versendet:    { label: 'Versendet',  style: 'bg-blue-50 text-blue-700 border-blue-200' },
  bezahlt:      { label: 'Bezahlt',    style: 'bg-green-50 text-green-700 border-green-200' },
  ueberfaellig: { label: 'Überfällig', style: 'bg-red-50 text-red-700 border-red-200' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.entwurf
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.style}`}>
      {cfg.label}
    </span>
  )
}

export default async function InvoicesPage() {
  const { data: invoices } = await supabaseAdmin
    .from('invoices')
    .select(`id, rechnungsnummer, betrag_gesamt, datum, faellig_am, status, created_at, customers(name, firma)`)
    .order('created_at', { ascending: false })

  const list = invoices ?? []

  const totalOpen = list.filter(i => ['entwurf', 'versendet'].includes(i.status)).length
  const totalPaid = list.filter(i => i.status === 'bezahlt').length
  const sumOpen   = list
    .filter(i => ['entwurf', 'versendet'].includes(i.status))
    .reduce((s: number, i: { betrag_gesamt: number | null }) => s + (i.betrag_gesamt ?? 0), 0)

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Rechnungen</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} Rechnungen insgesamt</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          + Neue Rechnung
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="text-2xl font-extrabold text-gray-900">{totalOpen}</div>
          <div className="text-sm text-gray-500 mt-1">Offen</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="text-2xl font-extrabold text-gray-900">{sumOpen.toLocaleString('de-DE')} €</div>
          <div className="text-sm text-gray-500 mt-1">Offener Betrag</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="text-2xl font-extrabold text-emerald-600">{totalPaid}</div>
          <div className="text-sm text-gray-500 mt-1">Bezahlt</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center text-gray-400 text-sm">
          Noch keine Rechnungen vorhanden.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50">
              <tr>
                {['Nummer', 'Kunde', 'Betrag', 'Datum', 'Fällig', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {list.map((inv: any) => {
                const cust = Array.isArray(inv.customers) ? inv.customers[0] : inv.customers
                return (
                  <ClickableRow key={inv.id} href={`/admin/invoices/${inv.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-gray-900">{inv.rechnungsnummer ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-700">{cust?.firma ?? cust?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      {inv.betrag_gesamt != null ? `${inv.betrag_gesamt.toLocaleString('de-DE')} €` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {inv.datum ? new Date(inv.datum).toLocaleDateString('de-DE') : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {inv.faellig_am ? new Date(inv.faellig_am).toLocaleDateString('de-DE') : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                  </ClickableRow>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
