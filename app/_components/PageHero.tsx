import ParticlesBg from './ParticlesBg'

interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  children?: React.ReactNode
}

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative bg-[#03050a] pt-32 pb-20 px-6 overflow-hidden">
      <ParticlesBg />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-brand/35 bg-brand/10 text-brand-muted text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
          {eyebrow}
        </div>
        <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.05] tracking-[-2px] text-white mb-6">
          {title}
        </h1>
        <p className="text-lg text-white/45 leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
        {children}
      </div>
    </section>
  )
}
