import { getAllProjekte } from '@/lib/projekte'
import ProjekteManager from './_components/ProjekteManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projekte verwalten — Admin' }

export default async function AdminProjektePage() {
  const projekte = await getAllProjekte()
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Projekte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verwalte Referenzprojekte auf der /projekte Seite. Abgeschlossen = Projekt ist fertig, sonst "In Bearbeitung".
        </p>
      </div>
      <ProjekteManager initialProjekte={projekte} />
    </div>
  )
}
