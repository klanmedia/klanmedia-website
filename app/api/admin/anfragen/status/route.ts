import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest) {
  // Auth wird von der Middleware garantiert
  if (req.headers.get('x-admin-verified') !== '1') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id, status } = await req.json()
  const allowed = ['neu', 'gelesen', 'beantwortet']
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('contact_requests').update({ status }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
