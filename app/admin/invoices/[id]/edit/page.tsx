import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import InvoiceEditForm from './_components/InvoiceEditForm'

export const metadata: Metadata = { title: 'Rechnung bearbeiten' }

export default async function InvoiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: invoice } = await supabaseAdmin
    .from('invoices')
    .select(`*, customers(id, name, firma)`)
    .eq('id', id)
    .maybeSingle()

  if (!invoice) notFound()

  const { data: customers } = await supabaseAdmin
    .from('customers')
    .select('id, name, firma')
    .order('name')

  return (
    <InvoiceEditForm
      invoice={invoice}
      customers={customers ?? []}
    />
  )
}
