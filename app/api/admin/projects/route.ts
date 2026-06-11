import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { customer_id, paket, hosting, preis_einmalig, preis_monatlich, status } = body
  if (!customer_id) return NextResponse.json({ error: 'customer_id fehlt.' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      customer_id,
      paket:           paket           ?? null,
      hosting:         hosting         ?? null,
      preis_einmalig:  preis_einmalig  ?? null,
      preis_monatlich: preis_monatlich ?? null,
      status:          status          ?? 'angebot',
    })
    .select()
    .single()

  if (error || !data) return NextResponse.json({ error: 'Erstellen fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ project: data })
}
