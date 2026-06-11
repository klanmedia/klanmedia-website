import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(*)`)
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json({ invoice: data })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()

  const allowed = ['status', 'datum', 'faellig_am', 'positionen', 'betrag_gesamt', 'rechnungsnummer', 'customer_id', 'leistungsdatum', 'projektbezeichnung']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const { error } = await supabaseAdmin.from('invoices').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('invoices').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Löschen fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
