'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase'

type NavItem = { href: string; label: string; icon: string }
type NavGroup = { group: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    group: '',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '▦' },
    ],
  },
  {
    group: 'CRM',
    items: [
      { href: '/admin/leads',     label: 'Leads',    icon: '📥' },
      { href: '/admin/customers', label: 'Kunden',   icon: '👥' },
    ],
  },
  {
    group: 'Abrechnung',
    items: [
      { href: '/admin/invoices', label: 'Rechnungen', icon: '🧾' },
    ],
  },
  {
    group: 'Website',
    items: [
      { href: '/admin/anfragen',      label: 'Anfragen',      icon: '✉'  },
      { href: '/admin/inhalte',       label: 'Hero-Texte',    icon: '✏'  },
      { href: '/admin/demos',         label: 'Demos',         icon: '🎬' },
      { href: '/admin/projekte',      label: 'Projekte',      icon: '🖥️' },
      { href: '/admin/produkte',      label: 'Produkte',      icon: '📦' },
      { href: '/admin/einstellungen', label: 'Einstellungen', icon: '⚙'  },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
        <Link href="/admin" onClick={onClose} className="text-[17px] font-extrabold tracking-tight text-white">
          klan<span className="text-[#2563EB]">media</span>
          <span className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mt-0.5">Admin</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.07] transition-colors"
            aria-label="Menü schließen"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navGroups.map(({ group, items }) => (
          <div key={group} className={group ? 'mt-4' : ''}>
            {group && (
              <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-white/20">{group}</p>
            )}
            {items.map(item => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2563EB]/15 text-[#2563EB]'
                      : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] flex flex-col gap-1 shrink-0">
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
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname()
  const [open, setOpen] = useState(false)

  // Login page — no chrome at all
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-[#06060A] border-r border-white/[0.07] shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#06060A]
          border-r border-white/[0.07] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Menü öffnen"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="4" x2="16" y2="4" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="14" x2="16" y2="14" />
            </svg>
          </button>
          <Link href="/admin" className="text-[15px] font-extrabold tracking-tight text-gray-900">
            klan<span className="text-[#2563EB]">media</span>
          </Link>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">Admin</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
