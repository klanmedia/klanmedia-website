import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json({ customer: data })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const updates: Record<string, string | null> = {}
  const fields = ['name', 'firma', 'email', 'tel', 'adresse', 'plz', 'ort', 'website', 'notizen']

  for (const field of fields) {
    if (field in body) {
      updates[field] = body[field]?.trim() || null
    }
  }

  if (updates['name'] !== undefined && !updates['name']) {
    return NextResponse.json({ error: 'Name darf nicht leer sein.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('customers')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Fetch before deleting so we still have the data
  const { data: customer } = await supabaseAdmin
    .from('customers').select('lead_id').eq('id', id).maybeSingle()

  // Sequential cascade: invoices first (may reference projects via FK), then projects, then customer
  const { error: invErr } = await supabaseAdmin.from('invoices').delete().eq('customer_id', id)
  if (invErr) return NextResponse.json({ error: 'Rechnungen konnten nicht gelöscht werden.' }, { status: 500 })

  const { error: projErr } = await supabaseAdmin.from('projects').delete().eq('customer_id', id)
  if (projErr) return NextResponse.json({ error: 'Projekte konnten nicht gelöscht werden.' }, { status: 500 })

  const { error } = await supabaseAdmin.from('customers').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Löschen fehlgeschlagen.' }, { status: 500 })

  // Reset ALL leads that were converted to this customer (via customer_id FK)
  // + fall back to lead_id for any legacy leads converted before the column existed
  await supabaseAdmin
    .from('leads')
    .update({ status: 'neu', customer_id: null })
    .eq('customer_id', id)

  if (customer?.lead_id) {
    await supabaseAdmin
      .from('leads')
      .update({ status: 'neu' })
      .eq('id', customer.lead_id)
      .neq('customer_id', id) // skip if already handled above
  }

  return NextResponse.json({ success: true })
}
