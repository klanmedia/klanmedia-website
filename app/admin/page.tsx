import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'

async function getStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const mondayISO = monday.toISOString()

  const [
    { count: leadsHeute },
    { count: leadsWoche },
    { count: aktiveProjekte },
    { count: offeneRechnungen },
  ] = await Promise.all([
    supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', mondayISO),
    supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'aktiv'),
    supabaseAdmin.from('invoices').select('*', { count: 'exact', head: true }).in('status', ['entwurf', 'versendet']),
  ])

  return {
    leadsHeute:       leadsHeute       ?? 0,
    leadsWoche:       leadsWoche       ?? 0,
    aktiveProjekte:   aktiveProjekte   ?? 0,
    offeneRechnungen: offeneRechnungen ?? 0,
  }
}

async function getLatestLeads() {
  const { data } = await supabaseAdmin
    .from('leads')
    .select('id, name, email, konfig_paket, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

const statusStyles: Record<string, string> = {
  neu:            'bg-blue-50 text-blue-700 border-blue-200',
  gelesen:        'bg-gray-100 text-gray-600 border-gray-200',
  beantwortet:    'bg-green-50 text-green-700 border-green-200',
  in_bearbeitung: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  konvertiert:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  abgelehnt:      'bg-gray-100 text-gray-500 border-gray-200',
}
const statusLabels: Record<string, string> = {
  neu: 'Neu', gelesen: 'Gelesen', beantwortet: 'Beantwortet',
  in_bearbeitung: 'In Bearbeitung', konvertiert: 'Konvertiert', abgelehnt: 'Abgelehnt',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[status] ?? statusStyles.gelesen}`}>
      {statusLabels[status] ?? status}
    </span>
  )
}

export default async function AdminDashboard() {
  const [stats, leads] = await Promise.all([getStats(), getLatestLeads()])

  const statCards = [
    { label: 'Neue Leads heute',   value: stats.leadsHeute,       accent: stats.leadsHeute > 0,       href: '/admin/leads' },
    { label: 'Leads diese Woche',  value: stats.leadsWoche,       accent: false,                       href: '/admin/leads' },
    { label: 'Aktive Projekte',    value: stats.aktiveProjekte,   accent: stats.aktiveProjekte > 0,    href: '/admin/customers' },
    { label: 'Offene Rechnungen',  value: stats.offeneRechnungen, accent: stats.offeneRechnungen > 0,  href: '/admin/invoices' },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Übersicht über Leads, Projekte und Rechnungen.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {statCards.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-2xl border p-6 transition-colors hover:shadow-sm ${
              stat.accent && stat.value > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`text-3xl font-extrabold ${stat.accent && stat.value > 0 ? 'text-blue-700' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Latest leads */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Letzte Leads</h2>
          <Link href="/admin/leads" className="text-sm text-blue-600 hover:underline">Alle ansehen →</Link>
        </div>
        {leads.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">Noch keine Leads eingegangen.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'E-Mail', 'Paket', 'Status', 'Datum'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link href={`/admin/leads/${lead.id}`} className="hover:text-blue-600">{lead.name}</Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4 text-gray-500 capitalize">{lead.konfig_paket ?? '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
