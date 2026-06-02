import Link from 'next/link'
import PageHero from '../_components/PageHero'
import HeroTitle from '../_components/HeroTitle'
import { getHeroText } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns — klanmedia',
  description: 'klanmedia ist Ihre Anlaufstelle für professionelle Webentwicklung und Hosting — persönlich, schnell und zuverlässig.',
}

const values = [
  {
    icon: '🎯',
    title: 'Klare Kommunikation',
    text: 'Wir geben ehrliche Einschätzungen — auch wenn das bedeutet, von etwas abzuraten. Keine leeren Versprechen, keine versteckten Kosten.',
  },
  {
    icon: '⚡',
    title: 'Schnell & zuverlässig',
    text: 'Kurze Abstimmungswege, strukturierte Umsetzung. Sie wissen jederzeit wo Ihr Projekt steht — keine wochenlangen Funkstille.',
  },
  {
    icon: '🔧',
    title: 'Moderner Tech-Stack',
    text: 'Wir setzen auf Technologien, die skalieren und langfristig tragfähig sind — kein veraltetes WordPress, keine Page-Builder.',
  },
  {
    icon: '🤝',
    title: 'Langfristige Partnerschaft',
    text: 'Wir sind nicht nach dem Launch weg. Als dauerhafter Ansprechpartner begleiten wir Ihr Unternehmen auch nach der Fertigstellung.',
  },
]

const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Docker']

export default async function UeberUnsPage() {
  const heroText = await getHeroText('ueber-uns')
  return (
    <>
      <PageHero
        eyebrow={heroText?.eyebrow || 'Über klanmedia'}
        title={heroText ? <HeroTitle text={heroText.title} /> : <>Regional verankert.<br /><em className="not-italic text-brand">Digital stark.</em></>}
        subtitle={heroText?.subtitle || 'klanmedia steht für professionelle Webentwicklung und zuverlässiges Hosting — persönlich, transparent und auf Augenhöhe.'}
      />

      {/* About */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Wer wir sind</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900 mb-6">
              Webentwicklung für lokale Unternehmen.
            </h2>
            <div className="flex flex-col gap-5 text-[16px] text-gray-500 leading-relaxed">
              <p>
                klanmedia ist eine spezialisierte Webagentur mit Fokus auf lokale und regionale Unternehmen — gegründet mit dem Anspruch, professionelle digitale Auftritte zugänglich zu machen, die wirklich performen.
              </p>
              <p>
                Wir entwickeln individuelle Websites und Webapplikationen mit modernem Tech-Stack. Jedes Projekt entsteht sauber entwickelt, mobiloptimiert und auf langfristige Wartbarkeit ausgelegt — ohne unnötige Kompromisse.
              </p>
              <p>
                Auf Wunsch übernehmen wir auch das komplette Hosting und die laufende Pflege. Persönlicher Support, direkter Kontakt, monatlich kündbar.
              </p>
            </div>
          </div>

          {/* Stack */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-5">Tech-Stack</div>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {stack.map(tech => (
                <span key={tech} className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3.5 py-1.5 rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">Schwerpunkte</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  'Unternehmenswebsites & Landingpages',
                  'Webapps & individuelle Software',
                  'Managed Hosting & laufender Betrieb',
                  'Performance & SEO-Optimierung',
                  'Google Business Profil & lokale Sichtbarkeit',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="text-brand font-bold shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-12">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Unsere Arbeitsweise</div>
            <h2 className="text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-tight text-gray-900">
              Worauf es uns ankommt.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-200 p-7">
                <div className="text-2xl mb-3">{v.icon}</div>
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight text-gray-900 mb-4">
          Bereit für Ihren nächsten Schritt?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Kostenloses Erstgespräch — wir schauen gemeinsam, welche Lösung zu Ihrem Unternehmen passt.
        </p>
        <Link href="/kontakt" className="inline-block bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3)' }}>
          Gespräch vereinbaren
        </Link>
      </section>
    </>
  )
}
