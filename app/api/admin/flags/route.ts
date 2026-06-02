import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PATCH(req: NextRequest) {
  // Auth wird von der Middleware garantiert — nur den Header prüfen
  if (req.headers.get('x-admin-verified') !== '1') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const body = await req.json()
  const { key, value } = body
  if (!key || typeof value !== 'boolean') {
    return NextResponse.json({ error: 'Ungültige Anfrage.', got: body }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('feature_flags')
    .update({ value })
    .eq('key', key)

  if (error) {
    console.error('[flags PATCH]', error)
    return NextResponse.json({ error: 'Update fehlgeschlagen.', detail: error.message }, { status: 500 })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}
