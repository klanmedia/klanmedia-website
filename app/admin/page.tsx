import { supabaseAdmin } from '@/lib/supabase-server'

async function getStats() {
  const [{ count: total }, { count: neu }] = await Promise.all([
    supabaseAdmin.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'neu'),
  ])
  return { total: total ?? 0, neu: neu ?? 0 }
}

async function getLatestRequests() {
  const { data } = await supabaseAdmin
    .from('contact_requests')
    .select('id, name, email, company, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    neu:          'bg-blue-50 text-blue-700 border-blue-200',
    gelesen:      'bg-gray-100 text-gray-600 border-gray-200',
    beantwortet:  'bg-green-50 text-green-700 border-green-200',
  }
  const labels: Record<string, string> = { neu: 'Neu', gelesen: 'Gelesen', beantwortet: 'Beantwortet' }
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[status] ?? styles.gelesen}`}>
      {labels[status] ?? status}
    </span>
  )
}

export default async function AdminDashboard() {
  const [stats, latest] = await Promise.all([getStats(), getLatestRequests()])

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Übersicht über Anfragen und den Status der Website.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Neue Anfragen', value: stats.neu,   accent: stats.neu > 0 },
          { label: 'Anfragen gesamt', value: stats.total, accent: false },
          { label: 'Unbeantwortet', value: stats.neu,   accent: false },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-6 ${stat.accent && stat.value > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <div className={`text-3xl font-extrabold ${stat.accent && stat.value > 0 ? 'text-blue-700' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Latest requests */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Letzte Anfragen</h2>
          <a href="/admin/anfragen" className="text-sm text-blue-600 hover:underline">Alle ansehen →</a>
        </div>
        {latest.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">Noch keine Anfragen eingegangen.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'E-Mail', 'Unternehmen', 'Status', 'Datum'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latest.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{req.name}</td>
                  <td className="px-6 py-4 text-gray-500">{req.email}</td>
                  <td className="px-6 py-4 text-gray-500">{req.company ?? '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(req.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
