import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import OnboardingPageClient from './_components/OnboardingPageClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string; projectId: string }> }) {
  const { id, projectId } = await params
  const { data: project } = await supabaseAdmin
    .from('projects').select('paket').eq('id', projectId).eq('customer_id', id).maybeSingle()
  return { title: `Onboarding — ${project?.paket ?? 'Projekt'}` }
}

export default async function ProjectOnboardingPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>
}) {
  const { id: customerId, projectId } = await params

  const [{ data: customer }, { data: project }] = await Promise.all([
    supabaseAdmin.from('customers').select('id, name, firma').eq('id', customerId).maybeSingle(),
    supabaseAdmin
      .from('projects')
      .select('id, paket, hosting, preis_einmalig, preis_monatlich, status, onboarding_data, anforderungen_data')
      .eq('id', projectId)
      .eq('customer_id', customerId)
      .maybeSingle(),
  ])

  if (!customer || !project) notFound()

  return (
    <OnboardingPageClient
      customerId={customerId}
      customerName={customer.firma ?? customer.name}
      project={project}
    />
  )
}
