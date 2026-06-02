import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

function unauthorized() {
  return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const body = await req.json()
  const { title, category, description, icon, color, tags, url, is_live, is_visible, sort_order } = body
  if (!title || !description) {
    return NextResponse.json({ error: 'Titel und Beschreibung sind Pflichtfelder.' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('projekte')
    .insert({ title, category: category || 'Webentwicklung', description, icon: icon || '🖥️', color: color || '#2563eb', tags: tags || [], url: url || null, is_live: is_live ?? true, is_visible: is_visible ?? true, sort_order: sort_order ?? 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/projekte')
  return NextResponse.json({ projekt: data })
}

export async function PATCH(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })
  const { error } = await supabaseAdmin.from('projekte').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/projekte')
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })
  const { error } = await supabaseAdmin.from('projekte').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/projekte')
  return NextResponse.json({ success: true })
}
