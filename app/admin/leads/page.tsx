import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'
import ClickableRow from '../_components/ClickableRow'

export const metadata: Metadata = { title: 'Leads' }

type Lead = {
  id: string
  name: string
  email: string
  tel: string | null
  konfig_paket: string | null
  konfig_preis_einmalig: number | null
  konfig_preis_monatlich: number | null
  status: string
  created_at: string
}

const statusConfig: Record<string, { label: string; style: string }> = {
  neu:            { label: 'Neu',            style: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_bearbeitung: { label: 'In Bearbeitung', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  konvertiert:    { label: 'Konvertiert',    style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  abgelehnt:      { label: 'Abgelehnt',      style: 'bg-gray-100 text-gray-500 border-gray-200' },
  gelesen:        { label: 'Gelesen',        style: 'bg-gray-100 text-gray-600 border-gray-200' },
  beantwortet:    { label: 'Beantwortet',    style: 'bg-green-50 text-green-700 border-green-200' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.gelesen
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.style}`}>
      {cfg.label}
    </span>
  )
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: filterStatus } = await searchParams

  let query = supabaseAdmin
    .from('leads')
    .select('id, name, email, tel, konfig_paket, konfig_preis_einmalig, konfig_preis_monatlich, status, created_at')
    .order('created_at', { ascending: false })

  if (filterStatus) query = query.eq('status', filterStatus)

  const { data: leads } = await query
  const allLeads = (leads ?? []) as Lead[]

  const { data: counts } = await supabaseAdmin.from('leads').select('status')
  const statusCounts = (counts ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  const total = (counts ?? []).length

  const tabs = [
    { key: '',             label: 'Alle',          count: total },
    { key: 'neu',          label: 'Neu',            count: statusCounts['neu']            ?? 0 },
    { key: 'in_bearbeitung',label: 'In Bearbeitung',count: statusCounts['in_bearbeitung'] ?? 0 },
    { key: 'konvertiert',  label: 'Konvertiert',    count: statusCounts['konvertiert']    ?? 0 },
    { key: 'abgelehnt',    label: 'Abgelehnt',      count: statusCounts['abgelehnt']      ?? 0 },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{total} Leads insgesamt</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => {
          const active = (filterStatus ?? '') === tab.key
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/admin/leads?status=${tab.key}` : '/admin/leads'}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </Link>
          )
        })}
      </div>

      {allLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center text-gray-400 text-sm">
          Keine Leads gefunden.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'E-Mail', 'Paket', 'Preis', 'Status', 'Datum'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allLeads.map(lead => (
                <ClickableRow key={lead.id} href={`/admin/leads/${lead.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{lead.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 capitalize">{lead.konfig_paket ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {lead.konfig_preis_einmalig ? `${lead.konfig_preis_einmalig.toLocaleString('de-DE')} €` : ''}
                    {lead.konfig_preis_einmalig && lead.konfig_preis_monatlich ? ' + ' : ''}
                    {lead.konfig_preis_monatlich ? `${lead.konfig_preis_monatlich.toLocaleString('de-DE')} €/Mo` : ''}
                    {!lead.konfig_preis_einmalig && !lead.konfig_preis_monatlich ? '—' : ''}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                </ClickableRow>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
