'use client'

// Desktop-only (hidden xl:flex). Fades out as soon as the hero section
// leaves the viewport — so it never floats over non-dark sections.
import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const hero = document.querySelector('.hero-section') as Element | null
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  return (
    <a
      href="#after-hero"
      aria-label="Nach unten scrollen"
      className="hidden xl:flex flex-col items-center gap-1.5"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        textDecoration: 'none',
        padding: '8px 14px',
        touchAction: 'manipulation',
        color: 'rgba(255,255,255,0.38)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}
    >
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        Mehr entdecken
      </span>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </a>
  )
}
