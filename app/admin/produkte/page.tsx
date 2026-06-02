import { getAllProdukte } from '@/lib/produkte'
import ProduktManager from './_components/ProduktManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Produkte verwalten — Admin' }

export default async function AdminProduktePage() {
  const produkte = await getAllProdukte()
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Produkte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verwalte eigene Produkte & SaaS-Apps auf der /produkte Seite. Verfügbar = live, sonst "Coming soon".
        </p>
      </div>
      <ProduktManager initialProdukte={produkte} />
    </div>
  )
}
