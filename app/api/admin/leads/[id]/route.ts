import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

const ALLOWED_STATUS = ['neu', 'in_bearbeitung', 'konvertiert', 'abgelehnt', 'gelesen', 'beantwortet']

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !lead) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json({ lead })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await req.json()

  if (!status || !ALLOWED_STATUS.includes(status)) {
    return NextResponse.json({ error: 'Ungültiger Status.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Nullify lead_id on linked customers so FK doesn't block deletion
  await supabaseAdmin
    .from('customers')
    .update({ lead_id: null })
    .eq('lead_id', id)

  const { error } = await supabaseAdmin.from('leads').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Löschen fehlgeschlagen. ' + error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
