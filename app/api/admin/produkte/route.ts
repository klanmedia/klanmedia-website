import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

function unauthorized() {
  return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const body = await req.json()
  const { name, description, icon, color, tags, url, price, is_available, is_visible, sort_order } = body
  if (!name || !description) {
    return NextResponse.json({ error: 'Name und Beschreibung sind Pflichtfelder.' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('produkte')
    .insert({ name, description, icon: icon || '📦', color: color || '#2563eb', tags: tags || [], url: url || null, price: price || null, is_available: is_available ?? false, is_visible: is_visible ?? true, sort_order: sort_order ?? 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/produkte')
  return NextResponse.json({ produkt: data })
}

export async function PATCH(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })
  const { error } = await supabaseAdmin.from('produkte').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/produkte')
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (req.headers.get('x-admin-verified') !== '1') return unauthorized()
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })
  const { error } = await supabaseAdmin.from('produkte').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/produkte')
  return NextResponse.json({ success: true })
}
