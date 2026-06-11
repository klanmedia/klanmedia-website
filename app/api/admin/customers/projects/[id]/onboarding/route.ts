import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { onboarding_data } = await req.json()

  if (!onboarding_data || typeof onboarding_data !== 'object') {
    return NextResponse.json({ error: 'Ungültige Daten.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('projects')
    .update({ onboarding_data })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
