import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

type Params = { params: Promise<{ id: string }> }

export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('id, paket, hosting, preis_einmalig, preis_monatlich, status, onboarding_data')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json({ project: data })
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params
  const body = await req.json()

  const allowed = ['paket', 'hosting', 'preis_einmalig', 'preis_monatlich', 'status']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] ?? null
  }

  const { error } = await supabaseAdmin.from('projects').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { id } = await params

  // Check for linked invoices first so we can give a useful error
  const { data: linkedInvoices } = await supabaseAdmin
    .from('invoices')
    .select('rechnungsnummer')
    .eq('project_id', id)

  if (linkedInvoices && linkedInvoices.length > 0) {
    const nummern = linkedInvoices.map(i => i.rechnungsnummer ?? 'ohne Nummer').join(', ')
    return NextResponse.json({
      error: `Dieses Projekt kann nicht gelöscht werden, da noch ${linkedInvoices.length === 1 ? 'eine Rechnung' : 'Rechnungen'} damit verknüpft ${linkedInvoices.length === 1 ? 'ist' : 'sind'}: ${nummern}. Bitte zuerst die Rechnung(en) löschen.`,
    }, { status: 409 })
  }

  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Löschen fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
