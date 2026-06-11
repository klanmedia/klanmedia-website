import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 })
  return NextResponse.json({ customers: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, firma, email, tel, adresse, plz, ort, website, notizen } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name ist erforderlich.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert({
      name:    name.trim(),
      firma:   firma?.trim()   || null,
      email:   email?.trim()   || null,
      tel:     tel?.trim()     || null,
      adresse: adresse?.trim() || null,
      plz:     plz?.trim()     || null,
      ort:     ort?.trim()     || null,
      website: website?.trim() || null,
      notizen: notizen?.trim() || null,
    })
    .select('id')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Erstellen fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
