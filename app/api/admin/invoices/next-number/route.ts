import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const year = new Date().getFullYear()

  // Find the highest sequence number for this year
  const { data } = await supabaseAdmin
    .from('invoices')
    .select('rechnungsnummer')
    .like('rechnungsnummer', `RE-${year}-%`)
    .order('rechnungsnummer', { ascending: false })
    .limit(1)

  let nextSeq = 1
  if (data && data.length > 0 && data[0].rechnungsnummer) {
    const parts = data[0].rechnungsnummer.split('-')
    const lastNum = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastNum)) nextSeq = lastNum + 1
  }

  const nummer = `RE-${year}-${String(nextSeq).padStart(3, '0')}`
  return NextResponse.json({ nummer })
}
