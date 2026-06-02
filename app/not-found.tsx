import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="relative bg-dark min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      <div className="relative text-center">
        <div className="text-[clamp(80px,15vw,160px)] font-extrabold text-white/[0.04] leading-none tracking-tighter select-none mb-6">
          404
        </div>
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand mb-4">Seite nicht gefunden</div>
        <h1 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight text-white mb-4">
          Diese Seite existiert nicht.
        </h1>
        <p className="text-white/45 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          Vielleicht wurde sie verschoben oder Sie haben sich vertippt.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-brand text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
            style={{ boxShadow: '0 0 40px rgba(37,99,235,0.35)' }}
          >
            Zur Startseite
          </Link>
          <Link
            href="/kontakt"
            className="bg-white/5 border border-white/10 text-white/75 font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </section>
  )
}
