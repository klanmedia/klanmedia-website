import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'
import ClickableRow from '../_components/ClickableRow'

export const metadata: Metadata = { title: 'Kunden' }

export default async function CustomersPage() {
  const { data: customers } = await supabaseAdmin
    .from('customers')
    .select('id, name, email, tel, firma, created_at, projects(count)')
    .order('created_at', { ascending: false })

  const list = customers ?? []

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Kunden</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} Kunden insgesamt</p>
        </div>
        <Link
          href="/admin/customers/new"
          className="text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          + Neuer Kunde
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center text-gray-400 text-sm">
          Noch keine Kunden vorhanden.{' '}
          <Link href="/admin/leads" className="text-blue-600 hover:underline">Lead konvertieren →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Firma', 'E-Mail', 'Projekte', 'Erstellt'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(list as {
                id: string; name: string; email: string | null; tel: string | null;
                firma: string | null; created_at: string;
                projects: { count: number }[] | null
              }[]).map(c => (
                <ClickableRow key={c.id} href={`/admin/customers/${c.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.firma ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.email ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {Array.isArray(c.projects) ? (c.projects[0]?.count ?? 0) : 0}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
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
