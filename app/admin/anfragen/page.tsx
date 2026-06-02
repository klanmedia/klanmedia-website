import { supabaseAdmin } from '@/lib/supabase-server'
import AnfragenTable from './_components/AnfragenTable'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kontaktanfragen' }

export default async function AnfragenPage() {
  const { data: anfragen } = await supabaseAdmin
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Kontaktanfragen</h1>
        <p className="text-sm text-gray-500 mt-1">{anfragen?.length ?? 0} Anfragen insgesamt</p>
      </div>
      <AnfragenTable anfragen={anfragen ?? []} />
    </div>
  )
}
