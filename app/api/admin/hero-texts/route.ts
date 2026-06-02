import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-server'

// Auth via Middleware (x-admin-verified header)
function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-verified') === '1'
}

// POST — neue Variante erstellen
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  const { page_key, variant_name, eyebrow, title, subtitle } = await req.json()
  if (!page_key || !variant_name || !title) {
    return NextResponse.json({ error: 'page_key, variant_name und title sind Pflicht.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('page_hero_texts')
    .insert({ page_key, variant_name, eyebrow: eyebrow ?? '', title, subtitle: subtitle ?? '', is_active: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// PATCH — Variante aktivieren (deaktiviert alle anderen derselben Page)
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  const { id, page_key } = await req.json()
  if (!id || !page_key) return NextResponse.json({ error: 'id und page_key erforderlich.' }, { status: 400 })

  // Alle für diese Page deaktivieren
  const { error: deactivateError } = await supabaseAdmin
    .from('page_hero_texts')
    .update({ is_active: false })
    .eq('page_key', page_key)

  if (deactivateError) return NextResponse.json({ error: deactivateError.message }, { status: 500 })

  // Gewählte aktivieren
  const { error: activateError } = await supabaseAdmin
    .from('page_hero_texts')
    .update({ is_active: true })
    .eq('id', id)

  if (activateError) return NextResponse.json({ error: activateError.message }, { status: 500 })

  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}

// DELETE — Variante löschen
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id erforderlich.' }, { status: 400 })

  const { error } = await supabaseAdmin.from('page_hero_texts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/', 'layout')
  return NextResponse.json({ success: true })
}
