'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin',               label: 'Dashboard',         icon: '▦' },
  { href: '/admin/anfragen',      label: 'Kontaktanfragen',   icon: '✉' },
  { href: '/admin/inhalte',       label: 'Hero-Texte',        icon: '✏' },
  { href: '/admin/demos',         label: 'Demos',             icon: '🎬' },
  { href: '/admin/projekte',      label: 'Projekte',          icon: '🖥️' },
  { href: '/admin/produkte',      label: 'Produkte',          icon: '📦' },
  { href: '/admin/einstellungen', label: 'Einstellungen',     icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-[#06060A] border-r border-white/[0.07] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.07]">
        <Link href="/admin" className="text-[17px] font-extrabold tracking-tight text-white">
          klan<span className="text-[#2563EB]">media</span>
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2563EB]/15 text-[#2563EB]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] flex flex-col gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <span>↗</span> Website ansehen
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-red-400 transition-colors text-left"
        >
          <span>→</span> Abmelden
        </button>
      </div>
    </aside>
  )
}
