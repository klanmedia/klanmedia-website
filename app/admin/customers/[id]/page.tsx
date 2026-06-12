import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import CustomerEditForm from './_components/CustomerEditForm'
import CustomerDeleteButton from './_components/CustomerDeleteButton'
import CustomerProjectsManager from './_components/CustomerProjectsManager'
import ClickableRow from '../../_components/ClickableRow'
import StopPropLink from '../../_components/StopPropLink'

export const metadata: Metadata = { title: 'Kundenprofil' }

type Project = {
  id: string
  paket: string | null
  hosting: string | null
  preis_einmalig: number | null
  preis_monatlich: number | null
  status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onboarding_data: Record<string, any> | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anforderungen_data: Record<string, any> | null
  created_at: string
}

type Invoice = {
  id: string
  rechnungsnummer: string | null
  betrag_gesamt: number | null
  datum: string | null
  status: string
  created_at: string
}

const invoiceStatusConfig: Record<string, { label: string; style: string }> = {
  entwurf:      { label: 'Entwurf',    style: 'bg-gray-100 text-gray-500 border-gray-200' },
  versendet:    { label: 'Versendet',  style: 'bg-blue-50 text-blue-700 border-blue-200' },
  bezahlt:      { label: 'Bezahlt',    style: 'bg-green-50 text-green-700 border-green-200' },
  ueberfaellig: { label: 'Überfällig', style: 'bg-red-50 text-red-700 border-red-200' },
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: customer }, { data: projects }, { data: invoices }] = await Promise.all([
    supabaseAdmin.from('customers').select('*').eq('id', id).maybeSingle(),
    supabaseAdmin.from('projects').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    supabaseAdmin.from('invoices').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const projectList = (projects ?? []) as Project[]
  const invoiceList = (invoices ?? []) as Invoice[]

  const primaryProject = projectList.find(p => p.status === 'aktiv') ?? projectList[0] ?? null

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/customers" className="hover:text-gray-600">Kunden</Link>
        <span>/</span>
        <span className="text-gray-700">{customer.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Customer info (inline edit) */}
          <CustomerEditForm customer={customer} />

          {/* Projects — inline edit/delete/add */}
          <CustomerProjectsManager
            initialProjects={projectList}
            customerId={id}
          />

          {/* Invoices */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Rechnungen</h2>
              {primaryProject && (
                <Link
                  href={`/admin/invoices/new?customer=${id}&project=${primaryProject.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  + Neue Rechnung
                </Link>
              )}
            </div>
            {invoiceList.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">Noch keine Rechnung.</div>
            ) : (
              <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nummer', 'Betrag', 'Datum', 'Status', ''].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoiceList.map(inv => {
                    const cfg = invoiceStatusConfig[inv.status] ?? invoiceStatusConfig.entwurf
                    return (
                      <ClickableRow key={inv.id} href={`/admin/invoices/${inv.id}`} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-3.5 font-medium text-gray-900 font-mono">{inv.rechnungsnummer ?? '—'}</td>
                        <td className="px-5 py-3.5 text-gray-700 font-semibold">
                          {inv.betrag_gesamt ? `${inv.betrag_gesamt.toLocaleString('de-DE')} €` : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {inv.datum ? new Date(inv.datum).toLocaleDateString('de-DE') : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.style}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <StopPropLink
                            href={`/admin/invoices/${inv.id}/edit`}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Bearbeiten
                          </StopPropLink>
                        </td>
                      </ClickableRow>
                    )
                  })}
                </tbody>
              </table>
            </div>
            )}
          </div>

        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">Kontakt</h2>
            <div className="flex flex-col gap-3">
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  ✉ {customer.email}
                </a>
              )}
              {customer.tel && (
                <a href={`tel:${customer.tel}`} className="flex items-center gap-2 text-sm text-gray-600">
                  📞 {customer.tel}
                </a>
              )}
              {customer.website && (
                <a href={customer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  🌐 {customer.website}
                </a>
              )}
              {(customer.adresse || customer.ort) && (
                <div className="text-sm text-gray-500">
                  📍 {[customer.adresse, customer.plz ? `${customer.plz} ${customer.ort}` : customer.ort].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notizen && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Interne Notizen</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{customer.notizen}</p>
            </div>
          )}

          {/* Invoice action */}
          {primaryProject && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Rechnung</h2>
              <Link
                href={`/admin/invoices/new?customer=${id}&project=${primaryProject.id}`}
                className="block text-center text-sm font-bold px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                🧾 Rechnung erstellen
              </Link>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Info</h2>
            <div className="text-xs text-gray-400 flex flex-col gap-1.5">
              <div>Erstellt: {new Date(customer.created_at).toLocaleString('de-DE')}</div>
              {customer.lead_id && (
                <Link href={`/admin/leads/${customer.lead_id}`} className="text-blue-500 hover:underline">
                  Ursprünglicher Lead →
                </Link>
              )}
            </div>
          </div>

          {/* Delete customer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Kunden löschen</h2>
            <p className="text-xs text-gray-400 mb-3">Löscht den Kunden samt aller Projekte und Rechnungen. Der verknüpfte Lead bleibt erhalten.</p>
            <CustomerDeleteButton customerId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
