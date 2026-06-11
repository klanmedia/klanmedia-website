import Link from 'next/link'
import * as si from 'simple-icons'
import ScrollAnimations from './_components/ScrollAnimations'
import ScrollIndicator from './_components/ScrollIndicator'
import Faq from './_components/Faq'
import LaptopMockup from './_components/LaptopMockup'
import TerminalWindow from './_components/TerminalWindow'
import ParticlesBg from './_components/ParticlesBg'
import { getFlags, flag } from '@/lib/flags'
import { ctaHref, ctaLabel } from '@/lib/cta'

function getSimpleIcon(slug: string): string {
  const key = ('si' + slug.charAt(0).toUpperCase() + slug.slice(1)) as keyof typeof si
  const icon = si[key] as { svg: string } | undefined
  return icon?.svg ?? ''
}

// ─── Prozess-Schritte ─────────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    title: 'Erstgespräch',
    description: 'Kostenlos & unverbindlich. Wir besprechen was Sie brauchen und was sinnvoll ist.',
  },
  {
    number: '02',
    title: 'Konzept & Umsetzung',
    description: 'Individuell entwickelt, in enger Abstimmung mit Ihnen — Sie wissen immer wo es steht.',
  },
  {
    number: '03',
    title: 'Launch & Betreuung',
    description: 'Sie gehen live. Wir bleiben als langfristiger Partner an Ihrer Seite.',
  },
]

// ─── Services ─────────────────────────────────────────────────────────────────
const services = [
  {
    icon: '🖥️',
    title: 'Website-Erstellung',
    description: 'Individuelle Websites & Webapps — von der einfachen Landingpage bis zur komplexen Webanwendung mit Admin-Dashboard.',
    active: true,
    href: '/services/webentwicklung',
  },
  {
    icon: '🌐',
    title: 'Hosting & Pflege',
    description: 'Managed Hosting, monatliche Anpassungen, SEO-Pflege und persönlicher Support — alles in einem Paket, monatlich kündbar.',
    active: true,
    href: '/services/hosting',
  },
  {
    icon: '🎬',
    title: 'Content Creation',
    description: 'Professionelle Reels für TikTok & Instagram — geplant, produziert und ausgewertet. Pakete ab 4 Videos/Monat.',
    active: true,
    href: '/services/content',
    flagKey: 'service_content_visible',
  },
  { icon: '📦', title: 'Bundle-Pakete', description: 'Website-Abo & Content Creation kombiniert — bis zu 100 € günstiger als einzeln gebucht, alles aus einer Hand.', active: false, href: '/services/bundles', flagKey: 'service_bundles_visible' },
  { icon: '📍', title: 'Google Business', description: 'Google Business Profil professionell eingerichtet & optimiert — mehr lokale Sichtbarkeit auf Google Maps und in der Suche.', active: false, href: '/services/google', flagKey: 'service_google_visible' },
]

// ─── Was ist enthalten ────────────────────────────────────────────────────────
const webFeatures = [
  'Responsives Design (Mobile, Tablet, Desktop)',
  'SEO-Grundoptimierung',
  'Kontaktformular & Anfrageverwaltung',
  'DSGVO-konform & rechtssicher',
  'SSL & HTTPS inklusive',
  'Optimiert für schnelle Ladezeiten',
  'Google Analytics Integration möglich',
  'CMS-Anbindung auf Wunsch',
]

const hostingFeatures = [
  '99,9 % Uptime-Garantie',
  'SSL-Zertifikat inklusive',
  'Tägliche automatische Backups',
  '24/7 Server-Monitoring',
  'Schneller persönlicher Support',
  'Skalierbar bei Unternehmenswachstum',
  'Deutsche Server (DSGVO-konform)',
  'Monatlich kündbar',
]

const contentFeatures = [
  'Konzept & Skript inklusive',
  'Professioneller Schnitt & Ton',
  'Captions, Hashtags & Posting',
  'TikTok + Instagram Reels',
  'Analyse & Reporting',
  'Strategische Content-Planung',
  'Pakete ab 4 Videos/Monat',
  'Monatlich kündbar',
]

const bundleFeatures = [
  'Hosting & Content aus einer Hand',
  'Abgestimmt auf Ihr Unternehmen',
  'Bis zu 100 € günstiger als einzeln',
  'Ein Ansprechpartner für alles',
  'Flexible Kombination möglich',
  'Monatlich kündbar',
]

const googleBaseFeatures = [
  'Google Business Profil Einrichtung',
  'Profiloptimierung für lokale Suche',
  'Google Maps Sichtbarkeit verbessern',
  'Fotos, Öffnungszeiten, Beschreibung',
  'Mehr Sichtbarkeit in der lokalen Suche',
]

const googleReviewFeatures = [
  'Review Management via WhatsApp',
  'Kunden diskret nach Auftrag ansprechen',
  'Mehr Bewertungen — seriös & wirksam',
]

// ─── Technologien ─────────────────────────────────────────────────────────────
const technologies = [
  { name: 'Next.js',      slug: 'nextdotjs',      category: 'Frontend'  },
  { name: 'React',        slug: 'react',           category: 'Frontend'  },
  { name: 'TypeScript',   slug: 'typescript',      category: 'Frontend'  },
  { name: 'Tailwind CSS', slug: 'tailwindcss',     category: 'Frontend'  },
  { name: 'Node.js',      slug: 'nodedotjs',       category: 'Backend'   },
  { name: 'Python',       slug: 'python',           category: 'Backend'   },
  { name: 'PostgreSQL',   slug: 'postgresql',      category: 'Datenbank' },
  { name: 'Supabase',     slug: 'supabase',        category: 'Backend'   },
  { name: 'Docker',       slug: 'docker',           category: 'DevOps'    },
  { name: 'Vercel',       slug: 'vercel',           category: 'Hosting'   },
]

// ─── Warum klanmedia ──────────────────────────────────────────────────────────
const features = [
  {
    icon: '🤝',
    title: 'Persönlicher Ansprechpartner',
    description:
      'Sie haben immer einen direkten Ansprechpartner — keine Warteschlangen, direkte Kommunikation, schnelle Antworten.',
  },
  {
    icon: '🚀',
    title: 'Schnelle Umsetzung',
    description:
      'Von der ersten Anfrage zur fertigen Website in wenigen Wochen. Kein monatelanges Warten auf Agenturen.',
  },
  {
    icon: '🔧',
    title: 'Alles aus einer Hand',
    description:
      'Website, Software, Hosting — ein Ansprechpartner, der den ganzen Überblick hat und zusammenhängend denkt.',
  },
  {
    icon: '💡',
    title: 'Zukunftssicher & modern',
    description:
      'Wir setzen auf Technologien, die skalieren — damit Ihr digitaler Auftritt auch in fünf Jahren noch state of the art ist.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const flags = await getFlags()
  const visibleServices = services.filter(s => !s.flagKey || flag(flags, s.flagKey))
  const showContentPricing = flag(flags, 'service_content_visible') || flag(flags, 'service_bundles_visible')
  const showContent = flag(flags, 'service_content_visible')
  const showBundles = flag(flags, 'service_bundles_visible')
  const showGoogle = flag(flags, 'service_google_visible')
  const showReviews = flag(flags, 'review_management_visible')
  const googleFeatures = showReviews ? [...googleBaseFeatures, ...googleReviewFeatures] : googleBaseFeatures
  return (
    <>
      <ScrollAnimations />

      {/* HERO */}
      <section className="hero-section relative bg-[#03050a] min-h-screen flex items-center px-6 overflow-hidden pt-16">
        {/* Particles canvas */}
        <ParticlesBg />

        {/*
          Grid: xl:grid-cols-2 (not lg:) so the two-column layout only kicks in at 1280px+.
          At 1280px, each column is (1280-48-64)/2 ≈ 584px — the laptop (580px) just fits.
          At lg (1024px), a column would be only ~456px — laptop would overflow → iPad issue.
          Single column on everything below xl: laptop sits below text, properly scaled.
        */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16 items-center py-16 xl:py-20">
          {/* Left: Text */}
          <div className="hero-content flex flex-col items-start">
            <div className="hero-badge inline-flex items-center gap-2 border border-brand/35 bg-brand/10 text-brand-muted text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-9">
              Webentwicklung · Hosting · Support
            </div>
            <h1 className="hero-title text-[clamp(32px,5vw,62px)] font-extrabold leading-[1.05] tracking-[-2px] text-white max-w-2xl mb-6">
              Ihre professionelle Website —{' '}
              <em className="not-italic text-brand">entwickelt & betrieben</em>{' '}
              aus einer Hand.
            </h1>
            <p className="hero-sub text-lg text-white/45 leading-relaxed max-w-md mb-11">
              Wir entwickeln Ihre Website und kümmern uns um den gesamten Betrieb — damit Sie sich auf Ihr Unternehmen konzentrieren können.
            </p>
            <div className="hero-btns flex flex-wrap items-center gap-3">
              <Link
                href={ctaHref(flags)}
                className="bg-brand text-white font-bold text-[15px] px-7 py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ boxShadow: '0 0 40px rgba(37,99,235,0.35)' }}
              >
                {ctaLabel(flags, 'Paket konfigurieren', 'Projekt starten')}
              </Link>
              <Link
                href="/services"
                className="bg-white/5 border border-white/10 text-white/75 font-semibold text-[15px] px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Services ansehen
              </Link>
            </div>

          </div>

          {/*
            Laptop scale ladder (absolute-positioned in fixed-height container to keep it out of flow):
              <640   → 0.36 → h-[215px]
              640    → 0.48 → h-[290px]
              768    → 0.62 → h-[375px]
              1024   → 0.80 → h-[480px]
              1280   → 0.75 → h-[454px]  xl: two-column, scale-75 fits in 584px col, badges stay in viewport
              1536+  → 1.00 → static/auto 2xl: enough space for full-size laptop
            Heights ≈ laptop_layout_height (~605px) × scale
          */}
          <div className="relative flex justify-center overflow-hidden
            h-[215px] sm:h-[290px] md:h-[375px] lg:h-[480px] xl:h-[454px]
            xl:overflow-visible 2xl:h-auto">
            <div className="
              absolute top-0 left-1/2 -translate-x-1/2 origin-top
              scale-[0.36] sm:scale-[0.48] md:scale-[0.62] lg:scale-[0.80] xl:scale-[0.75]
              2xl:static 2xl:translate-x-0 2xl:scale-100
            ">
              <LaptopMockup />
            </div>
          </div>
        </div>

      </section>

      {/* Scroll indicator — fixed to viewport bottom, anchor link (no JS needed) */}
      <ScrollIndicator />

      {/* SO LÄUFT'S AB */}
      <section id="after-hero" className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10" data-animate="stagger">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-brand tracking-widest">{step.number}</span>
                {i < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-gray-200" />
                )}
              </div>
              <h3 className="text-[17px] font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div data-animate="fade-up">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Was wir machen</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
            Alles was Sie brauchen,<br className="hidden md:block" /> um online erfolgreich zu sein.
          </h2>
          <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl mb-14">
            Wir übernehmen Ihre digitale Präsenz vollständig — von der Entwicklung bis zum laufenden Betrieb.
          </p>
        </div>

        {/* All services — horizontal rows */}
        <div className="flex flex-col gap-4" data-animate="stagger">
          {visibleServices.map((service) => (
            <div key={service.title} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-center border border-gray-200 rounded-2xl p-8 bg-white hover:shadow-lg hover:border-gray-300 transition-all">
              {/* Icon + title */}
              <div className="flex items-center gap-5 md:w-64">
                <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {service.icon}
                </div>
                <h3 className="text-[17px] font-bold text-gray-900">{service.title}</h3>
              </div>
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              {/* CTA */}
              <Link href={service.href} className="shrink-0 text-sm font-semibold text-brand border border-brand/30 px-5 py-2.5 rounded-lg hover:bg-brand hover:text-white transition-colors whitespace-nowrap">
                Mehr erfahren →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PREISE */}
      <section className="bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div data-animate="fade-up" className="mb-16">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Transparente Preise</div>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
              Klare Preise,<br className="hidden md:block" /> klare Leistung.
            </h2>
            <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl">
              Alle Pakete sind modular kombinierbar. Nach dem Erstgespräch erhalten Sie ein konkretes Angebot.
            </p>
          </div>

          {/* Website-Erstellung */}
          <div className="mb-10" data-animate="fade-up">
            <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-5">🖥️ Website-Erstellung — einmalig</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Starter', price: '500–800 €', features: ['Landingpage + Über uns + Kontakt', 'Responsiv & SEO-optimiert', 'DSGVO-konform', 'SSL inklusive'], highlight: false },
                { name: 'Business', price: '800–1.500 €', features: ['5–8 Seiten', 'Kontaktformular', 'Google Maps Integration', 'Inhaltsstruktur & Beratung'], highlight: true },
                { name: 'Premium', price: '1.500–2.500 €', features: ['Nutzerverwaltung', 'Admin-Dashboard', 'Individuelle Funktionen', 'Erweiterte Animationen'], highlight: false },
                { name: 'Enterprise', price: 'ab 2.500 €', features: ['Komplexe Webapps', 'API-Anbindungen', 'Individualprojekte', 'Langfristige Betreuung'], highlight: false },
              ].map(pkg => (
                <div key={pkg.name} className={`rounded-xl p-6 flex flex-col ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                  <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-brand' : 'text-gray-400'}`}>{pkg.name}</div>
                  <div className={`text-[22px] font-extrabold tracking-tight mb-4 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {pkg.features.map(f => (
                      <li key={f} className={`flex items-start gap-2 text-[12px] leading-relaxed ${pkg.highlight ? 'text-white/60' : 'text-gray-500'}`}>
                        <span className="text-brand font-bold shrink-0 mt-px">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Hosting & Pflege */}
          <div className="mb-6" data-animate="fade-up">
            <div className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-5">🌐 Hosting & Pflege — monatlich kündbar</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Basic', price: '50 €/Mo', features: ['Hosting, SSL, Backup', 'Sicherheitsupdates', '24/7 Monitoring'] },
                { name: 'Standard', price: '100 €/Mo', features: ['Basic +', '2 Std. Anpassungen/Mo', 'SEO-Pflege', 'Support 24–48 h'], highlight: true },
                { name: 'Premium', price: '150 €/Mo', features: ['Standard +', '4 Std./Mo', 'Analytics-Reporting', 'Prioritäts-Support'] },
              ].map(pkg => (
                <div key={pkg.name} className={`rounded-xl p-6 flex flex-col ${pkg.highlight ? 'bg-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
                  <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-brand' : 'text-gray-400'}`}>{pkg.name}</div>
                  <div className={`text-[22px] font-extrabold tracking-tight mb-4 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {pkg.features.map(f => (
                      <li key={f} className={`flex items-start gap-2 text-[12px] leading-relaxed ${pkg.highlight ? 'text-white/60' : 'text-gray-500'}`}>
                        <span className="text-brand font-bold shrink-0 mt-px">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Full pricing CTA */}
          {showContentPricing && (
            <div data-animate="fade-up" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">Content Creation & Bundle-Pakete</span> — bis zu 20 % günstiger wenn Web-Abo & Content kombiniert werden.
              </p>
              <Link href="/preise#content-creation" className="shrink-0 text-sm font-semibold text-brand border border-brand/30 px-5 py-2.5 rounded-lg hover:bg-brand hover:text-white transition-colors whitespace-nowrap">
                Alle Pakete ansehen →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* WAS IST ENTHALTEN */}
      <section className="bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div data-animate="fade-up" className="mb-16">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Leistungsumfang</div>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
              Was steckt drin?
            </h2>
            <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl">
              {(showContent || showBundles)
                ? 'Was in jedem unserer Services steckt — standardmäßig, ohne Aufpreis.'
                : 'Was in jeder Website und jedem Hosting-Paket bei uns steckt.'}
            </p>
          </div>

          <div className={`grid grid-cols-1 gap-6 ${(showContent || showBundles) ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2'}`} data-animate="stagger">
            {/* Webentwicklung */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-brand-light rounded-lg flex items-center justify-center text-lg">🖥️</div>
                <h3 className="text-[18px] font-bold text-gray-900">Webentwicklung</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {webFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hosting */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-brand-light rounded-lg flex items-center justify-center text-lg">🌐</div>
                <h3 className="text-[18px] font-bold text-gray-900">Hosting & Betrieb</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {hostingFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Creation — nur wenn aktiv */}
            {showContent && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-brand-light rounded-lg flex items-center justify-center text-lg">🎬</div>
                  <h3 className="text-[18px] font-bold text-gray-900">Content Creation</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {contentFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bundle-Pakete — nur wenn aktiv */}
            {showBundles && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-brand-light rounded-lg flex items-center justify-center text-lg">📦</div>
                  <h3 className="text-[18px] font-bold text-gray-900">Bundle-Pakete</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {bundleFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Google Business — nur wenn aktiv */}
            {showGoogle && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-brand-light rounded-lg flex items-center justify-center text-lg">📍</div>
                  <h3 className="text-[18px] font-bold text-gray-900">Google Business</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {googleFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIEN */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div data-animate="fade-up" className="mb-14">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Womit wir arbeiten</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
            Moderne Technologien,<br className="hidden md:block" /> die wirklich performen.
          </h2>
          <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl">
            Wir wählen die Technologie nach Ihrem Projekt — kein One-size-fits-all, sondern das richtige Werkzeug für die richtige Aufgabe.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" data-animate="stagger">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-gray-300 hover:shadow-md transition-all text-center"
            >
              <div
                className="w-9 h-9 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-gray-700"
                dangerouslySetInnerHTML={{ __html: getSimpleIcon(tech.slug) }}
                aria-label={tech.name}
              />
              <div>
                <div className="text-[13px] font-bold text-gray-900 leading-tight">{tech.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{tech.category}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TERMINAL SHOWCASE */}
      <section className="relative bg-dark overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)',
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text */}
            <div data-animate="fade-up">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Professioneller Prozess</div>
              <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-white mb-6">
                Von der Idee zur<br />
                <em className="not-italic text-brand">fertigen Website</em><br />
                in wenigen Wochen.
              </h2>
              <p className="text-[17px] text-white/45 leading-relaxed mb-8 max-w-md">
                Moderner Entwicklungsprozess mit automatisiertem Deployment, SSL, Monitoring und schnellen Ladezeiten — alles inklusive.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: '⚡', text: 'Automatisiertes Deployment — Ihre Website ist nach Änderungen in Sekunden live.' },
                  { icon: '🔒', text: 'SSL-Verschlüsselung & HTTPS — Standard, keine Option.' },
                  { icon: '📊', text: '24/7-Monitoring — Wir wissen von Problemen bevor Sie es tun.' },
                ].map(item => (
                  <li key={item.icon} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <span className="text-sm text-white/55 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Terminal */}
            <div className="flex justify-center lg:justify-end" data-animate="fade-up">
              <TerminalWindow />
            </div>
          </div>
        </div>
      </section>

      {/* WARUM KLANMEDIA */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div className="md:sticky md:top-32" data-animate="fade-up">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">Warum klanmedia</div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-6">
                Alles aus einer Hand.<br />Persönlich &<br />zuverlässig.
              </h2>
              <p className="text-[17px] text-gray-500 leading-relaxed">
                Wir sind nicht nur ein Dienstleister — wir sind Ihr digitaler Partner. Vom ersten Gespräch bis zum laufenden Betrieb.
              </p>
            </div>
            <div className="flex flex-col gap-12 pt-2">
              {features.map((feature) => (
                <div key={feature.title} className="feature-item flex gap-5 items-start">
                  <div className="w-11 h-11 bg-brand-light rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-28">
        <div data-animate="fade-up" className="mb-12">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-3">FAQ</div>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
            Häufige Fragen.
          </h2>
          <p className="text-[17px] text-gray-500 leading-relaxed max-w-lg">
            Noch Fragen offen? Hier sind die häufigsten — oder schreiben Sie uns direkt an.
          </p>
        </div>
        <div data-animate="fade-up">
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#03050a] overflow-hidden">
        <ParticlesBg />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 text-center" data-animate="fade-up">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-6">Jetzt starten</div>
          <h2 className="text-[clamp(28px,4vw,50px)] font-extrabold tracking-tight leading-tight text-white mb-5">
            Bereit für Ihren<br />professionellen Auftritt?
          </h2>
          <p className="text-lg text-white/45 mb-10 max-w-md mx-auto leading-relaxed">
            Kostenloses Erstgespräch — wir schauen gemeinsam, was für Sie sinnvoll ist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/kontakt"
              className="bg-brand text-white font-bold text-base px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors"
              style={{ boxShadow: '0 0 50px rgba(37,99,235,0.45)' }}
            >
              Projekt besprechen
            </Link>
            <Link
              href="/services"
              className="bg-white/5 border border-white/10 text-white/70 font-semibold text-base px-10 py-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              Services ansehen
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
