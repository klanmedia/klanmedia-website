// Native anchor link — works without JavaScript (same as "Projekt starten")
// smooth scroll is handled by CSS scroll-behavior:smooth in globals.css

export default function ScrollIndicator() {
  return (
    <a
      href="#after-hero"
      aria-label="Nach unten scrollen"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        padding: '8px 14px',
        touchAction: 'manipulation',
        color: 'rgba(255,255,255,0.38)',
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
