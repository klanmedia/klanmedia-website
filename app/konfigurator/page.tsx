import PageHero from '../_components/PageHero'
import { getFlags, flag } from '@/lib/flags'
import type { Metadata } from 'next'
import KonfiguratorClient from './_components/KonfiguratorClient'

export const metadata: Metadata = {
  title: 'Paket-Konfigurator — klanmedia',
  description: 'Stellen Sie Ihr Paket frei zusammen — Website, Hosting, Content Creation und Add-ons.',
}

export default async function KonfiguratorPage() {
  const flags = await getFlags()

  return (
    <>
      <PageHero
        eyebrow="Paket-Konfigurator"
        title={<>Stellen Sie Ihr Paket<br /><em className="not-italic text-brand">frei zusammen.</em></>}
        subtitle="Wählen Sie was Sie brauchen — der Preis berechnet sich live. Danach schicken Sie die Auswahl direkt als Anfrage."
      />
      <KonfiguratorClient
        showContent={flag(flags, 'service_content_visible')}
        showBundles={flag(flags, 'service_bundles_visible')}
        showGoogle={flag(flags, 'service_google_visible')}
        showReviews={flag(flags, 'review_management_visible')}
      />
    </>
  )
}
