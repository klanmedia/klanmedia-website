import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, company, message, konfig } = body

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: 'Name und E-Mail sind erforderlich.' },
      { status: 400 }
    )
  }

  // company landet im Freitext (leads hat keine eigene company-Spalte)
  const nachricht = [
    company?.trim() ? `Unternehmen: ${company.trim()}` : null,
    message?.trim() || null,
  ].filter(Boolean).join('\n\n') || null

  const { error } = await supabaseAdmin.from('leads').insert({
    name:                  name.trim(),
    email:                 email.trim(),
    tel:                   phone?.trim()  || null,
    nachricht,
    konfig_paket:          konfig?.paket           ?? null,
    konfig_hosting:        konfig?.hosting          ?? null,
    konfig_features:       konfig?.features?.length ? konfig.features : null,
    konfig_preis_einmalig: konfig?.preis_einmalig   ?? null,
    konfig_preis_monatlich:konfig?.preis_monatlich  ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Speichern fehlgeschlagen.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
