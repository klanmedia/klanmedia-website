import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(name, firma)`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 })
  return NextResponse.json({ invoices: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    customer_id,
    project_id,
    rechnungsnummer,
    datum,
    faellig_am,
    positionen,
    betrag_gesamt,
  } = body

  if (!customer_id || !rechnungsnummer || !positionen?.length) {
    return NextResponse.json({ error: 'Fehlende Pflichtfelder.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('invoices')
    .insert({
      customer_id,
      project_id:      project_id  ?? null,
      rechnungsnummer,
      datum:           datum        ?? new Date().toISOString().split('T')[0],
      faellig_am:      faellig_am  ?? null,
      positionen,
      betrag_gesamt:   betrag_gesamt ?? null,
      status:          'entwurf',
    })
    .select('id')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Erstellen fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
