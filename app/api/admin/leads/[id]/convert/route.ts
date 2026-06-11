import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Lead laden
  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Lead nicht gefunden.' }, { status: 404 })
  }

  // 2. Prüfen ob Kunde mit gleicher E-Mail schon existiert (Duplikat-Check)
  let customerId: string
  let merged = false

  if (lead.email) {
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', lead.email)
      .maybeSingle()

    if (existingCustomer) {
      // Kunde existiert bereits — Lead damit verknüpfen, keinen Duplikaten anlegen
      customerId = existingCustomer.id
      merged = true
    } else {
      customerId = await createCustomer(lead)
    }
  } else {
    customerId = await createCustomer(lead)
  }

  // 3. Projekt erstellen (wenn Konfig vorhanden)
  if (lead.konfig_paket || lead.konfig_hosting || lead.konfig_features?.length) {
    await supabaseAdmin.from('projects').insert({
      customer_id:     customerId,
      paket:           lead.konfig_paket           ?? null,
      hosting:         lead.konfig_hosting          ?? null,
      features:        lead.konfig_features?.length ? lead.konfig_features : null,
      preis_einmalig:  lead.konfig_preis_einmalig   ?? null,
      preis_monatlich: lead.konfig_preis_monatlich  ?? null,
      status:          'angebot',
    })
  }

  // 4. Lead-Status auf konvertiert setzen + customer_id verknüpfen
  await supabaseAdmin
    .from('leads')
    .update({ status: 'konvertiert', customer_id: customerId })
    .eq('id', id)

  return NextResponse.json({ success: true, customerId, merged })
}

async function createCustomer(lead: Record<string, unknown>): Promise<string> {
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .insert({
      name:    lead.name,
      email:   lead.email,
      tel:     lead.tel ?? null,
      lead_id: lead.id,
    })
    .select('id')
    .single()

  if (!customer) throw new Error('Kunde konnte nicht erstellt werden.')
  return customer.id
}
