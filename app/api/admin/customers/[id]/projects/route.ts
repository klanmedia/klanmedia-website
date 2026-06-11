import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('id, paket, hosting, preis_einmalig, preis_monatlich, status')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Fehler.' }, { status: 500 })
  return NextResponse.json({ projects: data ?? [] })
}
