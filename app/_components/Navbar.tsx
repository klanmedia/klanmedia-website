'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Flags } from '@/lib/flags'

// Welche Links immer sichtbar sind, welche an einem Flag hängen
const allLinks = [
  { href: '/services',   label: 'Services',  flag: null             },
  { href: '/preise',     label: 'Preise',    flag: null             },
  { href: '/demos',          label: 'Demos',          flag: 'demos_visible'         },
  { href: '/produkte',       label: 'Produkte',       flag: 'produkte_visible'      },
  { href: '/projekte',       label: 'Projekte',       flag: 'projekte_visible'      },
  { href: '/konfigurator',   label: 'Konfigurator',   flag: 'konfigurator_visible'  },
  { href: '/ueber-uns',      label: 'Über uns',       flag: null                    },
]

export default function Navbar({ flags = {} }: { flags?: Flags }) {
  const path = usePathname()

  const links = allLinks.filter(l => !l.flag || flags[l.flag] !== false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-10 bg-[#06060A]/60 backdrop-blur-xl border-b border-white/[0.07]">
      <Link href="/" className="text-[18px] font-extrabold tracking-tight text-white shrink-0">
        klan<span className="text-brand">media</span>
      </Link>

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

      <Link
        href="/kontakt"
        className="shrink-0 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Kontakt aufnehmen
      </Link>
    </header>
  )
}
