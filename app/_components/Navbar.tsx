'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { Flags } from '@/lib/flags'

const allLinks = [
  { href: '/services',     label: 'Services',      flag: null                   },
  { href: '/preise',       label: 'Preise',         flag: null                   },
  { href: '/demos',        label: 'Demos',          flag: 'demos_visible'        },
  { href: '/produkte',     label: 'Produkte',       flag: 'produkte_visible'     },
  { href: '/projekte',     label: 'Projekte',       flag: 'projekte_visible'     },
  { href: '/konfigurator', label: 'Konfigurator',   flag: 'konfigurator_visible' },
  { href: '/ueber-uns',    label: 'Über uns',       flag: null                   },
]

export default function Navbar({ flags = {} }: { flags?: Flags }) {
  const path = usePathname()
  const links = allLinks.filter(l => !l.flag || flags[l.flag] !== false)

  // Close drawer on client-side navigation (layout stays mounted between routes)
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle') as HTMLInputElement | null
    if (toggle) toggle.checked = false
  }, [path])

  return (
    <>
      {/*
        ── CSS-only hamburger toggle ─────────────────────────────────────────────
        The hidden checkbox drives the drawer + backdrop via Tailwind peer-checked:.
        No JavaScript needed to open/close — works even before React hydrates.
        The useEffect above closes it after client-side navigation (needs JS,
        but that's progressive enhancement — core toggle is CSS-only).
      */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="peer sr-only"
        aria-hidden="true"
      />

      {/* ── Top bar ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-5 sm:px-10 bg-[#06060A]/60 backdrop-blur-xl border-b border-white/[0.07]">
        <Link href="/" className="text-[18px] font-extrabold tracking-tight text-white shrink-0">
          klan<span className="text-brand">media</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(({ href, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/kontakt"
            className="hidden sm:block shrink-0 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Kontakt aufnehmen
          </Link>

          {/* Hamburger — <label> toggles the checkbox, no JS needed */}
          <label
            htmlFor="nav-toggle"
            className="lg:hidden w-11 h-11 flex items-center justify-center cursor-pointer text-white/70 hover:text-white select-none"
            style={{ touchAction: 'manipulation' }}
            aria-label="Menü öffnen"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </label>
        </div>
      </header>

      {/*
        ── Backdrop + Drawer ────────────────────────────────────────────────────
        Both are siblings of <input class="peer">, so peer-checked: works.
        The wrapper uses overflow:hidden to clip the off-screen drawer —
        fixes horizontal scroll without needing overflow-x:hidden tricks.
        pointer-events are only active when checkbox is checked.
      */}

      {/* Backdrop: tap to close */}
      <label
        htmlFor="nav-toggle"
        className="
          lg:hidden fixed inset-0 z-30
          opacity-0 pointer-events-none
          peer-checked:opacity-100 peer-checked:pointer-events-auto
          transition-opacity duration-300
        "
        style={{ background: 'rgba(0,0,0,0.45)', cursor: 'default', touchAction: 'manipulation' }}
        aria-hidden="true"
      />

      {/* Drawer: slides in from right */}
      <div
        className="
          lg:hidden fixed top-0 right-0 bottom-0 z-40
          flex flex-col
          translate-x-full opacity-0 pointer-events-none
          peer-checked:translate-x-0 peer-checked:opacity-100 peer-checked:pointer-events-auto
          transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        "
        style={{
          width: 'min(78vw, 300px)',
          background: '#07080f',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '72px',
          paddingBottom: '32px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* X button */}
        <label
          htmlFor="nav-toggle"
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center cursor-pointer text-white/40 hover:text-white transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-label="Menü schließen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </label>

        <nav className="flex flex-col flex-1">
          {links.map(({ href, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`text-[15px] font-medium py-4 border-b border-white/[0.06] transition-colors ${
                  active ? 'text-white' : 'text-white/50 hover:text-white'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/kontakt"
          className="mt-5 bg-brand text-white text-sm font-bold px-5 py-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          style={{ touchAction: 'manipulation' }}
        >
          Kontakt aufnehmen
        </Link>
      </div>
    </>
  )
}
