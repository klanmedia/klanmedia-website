import { supabaseAdmin } from '@/lib/supabase-server'
import FeatureToggles from './_components/FeatureToggles'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Einstellungen' }

export default async function EinstellungenPage() {
  const { data: flags } = await supabaseAdmin
    .from('feature_flags')
    .select('*')
    .order('key')

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-gray-900">Seiten & Features</h1>
        <p className="text-sm text-gray-500 mt-1">
          Steuere welche Bereiche auf der Website sichtbar sind — Änderungen greifen sofort.
        </p>
      </div>
      <FeatureToggles flags={flags ?? []} />
    </div>
  )
}
