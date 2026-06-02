import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-[16px] font-extrabold tracking-tight text-white">
          klan<span className="text-brand">media</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/services" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            Services
          </Link>
          <Link href="/kontakt" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            Kontakt
          </Link>
          <Link href="/impressum" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            Datenschutz
          </Link>
          <Link href="/agb" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            AGB
          </Link>
        </nav>

        <p className="text-sm text-white/30">
          © {new Date().getFullYear()} klanmedia
        </p>
      </div>
    </footer>
  )
}
