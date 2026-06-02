import { getAllDemos } from '@/lib/demos'
import DemoManager from './_components/DemoManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Demos verwalten — Admin' }

export default async function AdminDemosPage() {
  const demos = await getAllDemos()
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Demos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verwalte die Branchenbeispiele auf der /demos Seite. Sichtbar = wird angezeigt, Verfügbar = Live-Demo vorhanden.
        </p>
      </div>
      <DemoManager initialDemos={demos} />
    </div>
  )
}
