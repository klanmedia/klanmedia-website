import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, company, message, config } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('contact_requests')
    .insert({ name, email, phone: phone || null, company: company || null, message, config: config || null })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Speichern fehlgeschlagen.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
