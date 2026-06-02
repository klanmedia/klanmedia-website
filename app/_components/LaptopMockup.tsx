'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// ── Key helper ────────────────────────────────────────────────
function Key({ flex = 1, isFn = false }: { flex?: number; isFn?: boolean }) {
  return (
    <div style={{
      height: isFn ? '15px' : '21px',
      flex,
      background: 'linear-gradient(to bottom, #2e3040, #262838)',
      borderRadius: isFn ? '3px' : '4px',
      border: '1px solid rgba(0,0,0,0.55)',
      boxShadow: '0 1.5px 0 rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
      minWidth: 0,
    }} />
  )
}

function KeyRow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', gap: '2.5px', marginBottom: '2.5px', ...style }}>
      {children}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────
export default function LaptopMockup() {
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tilt = tiltRef.current
    if (!tilt) return

    // Initial isometric pose
    gsap.set(tilt, { rotationX: 20, rotationY: -12 })

    // Mouse tilt
    const baseX = 20, baseY = -12
    const setRotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.12, ease: 'power1.out' })
    const setRotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.12, ease: 'power1.out' })

    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 2
      const dy = (e.clientY / window.innerHeight - 0.5) * 2
      setRotX(baseX - dy * 5)
      setRotY(baseY + dx * 8)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      className="hero-visual flex items-center justify-center select-none"
      style={{ perspective: '1800px', perspectiveOrigin: '50% 44%' }}
    >
      {/* Layer 1 — mouse-controlled tilt (rotateX / rotateY) */}
      <div ref={tiltRef} style={{ transformStyle: 'preserve-3d' }}>

        {/* Layer 2 — float animation via CSS (reliable cross-device) */}
        <div style={{ transformStyle: 'preserve-3d', animation: 'laptopFloat 5.5s ease-in-out infinite' }}>

          {/* Content */}
          <div style={{ transformStyle: 'preserve-3d', position: 'relative', marginTop: '80px', width: '580px' }}>

            {/* ── Floating badges (existing) ─────────────── */}
            <div
              className="absolute z-20 rounded-[10px] backdrop-blur-md"
              style={{
                top: '55px', left: '-115px',
                background: 'rgba(8,12,20,0.88)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 14px',
                animation: 'tagFloat1 4s ease-in-out infinite',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ fontSize: '20px', lineHeight: 1 }}>🚀</div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '9px', marginBottom: '2px' }}>Fertig in</div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, letterSpacing: '-0.01em' }}>3 Wochen</div>
              </div>
            </div>

            <div
              className="absolute z-20 rounded-[10px] backdrop-blur-md"
              style={{
                bottom: '120px', right: '-115px',
                background: 'rgba(8,12,20,0.88)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 14px',
                animation: 'tagFloat2 4.5s ease-in-out infinite',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <div style={{ fontSize: '20px', lineHeight: 1 }}>📞</div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '9px', marginBottom: '2px' }}>Erstgespräch</div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, letterSpacing: '-0.01em' }}>kostenlos</div>
              </div>
            </div>

            {/* ── Screen ────────────────────────────────── */}
            <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center', position: 'relative' }}>

              {/* Aluminum bezel */}
              <div style={{
                background: 'linear-gradient(155deg, #2d2f3a 0%, #20222c 60%, #191b24 100%)',
                borderRadius: '16px 16px 3px 3px',
                padding: '13px 13px 0',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                position: 'relative',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), -10px 0 30px rgba(0,0,0,0.6), 10px 0 20px rgba(0,0,0,0.4), 0 -30px 80px rgba(0,0,0,0.45)',
              }}>
                {/* Right-edge highlight */}
                <div style={{
                  position: 'absolute', top: 0, right: '-1px', bottom: 0, width: '2.5px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.01) 100%)',
                  borderRadius: '0 16px 3px 0',
                }} />

                {/* Webcam */}
                <div style={{
                  width: '5px', height: '5px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.06) 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 10px',
                }} />

                {/* Display area */}
                <div style={{
                  background: '#0b0e18',
                  borderRadius: '5px 5px 0 0',
                  overflow: 'hidden',
                  height: '340px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  position: 'relative',
                }}>
                  {/* Glass reflection */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
                    background: 'linear-gradient(155deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.008) 30%, transparent 55%)',
                    pointerEvents: 'none', zIndex: 10,
                  }} />

                  {/* ── Autohaus Müller website ── */}

                  {/* Nav */}
                  <div style={{
                    background: '#fff', borderBottom: '1px solid #e5e7eb',
                    padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ color: '#111', fontSize: '11px', fontWeight: 800, letterSpacing: '0.02em' }}>
                      Auto<span style={{ color: '#dc2626' }}>haus</span> Müller
                    </span>
                    <div style={{ display: 'flex', gap: '14px', marginLeft: 'auto', alignItems: 'center' }}>
                      <span style={{ color: '#6b7280', fontSize: '9px' }}>Fahrzeuge</span>
                      <span style={{ color: '#6b7280', fontSize: '9px' }}>Werkstatt</span>
                      <span style={{ color: '#6b7280', fontSize: '9px' }}>Über uns</span>
                      <span style={{ background: '#dc2626', color: '#fff', fontSize: '9px', padding: '4px 10px', borderRadius: '4px' }}>Kontakt</span>
                    </div>
                  </div>

                  {/* Hero */}
                  <div style={{ background: '#f9fafb', padding: '22px 22px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ color: '#dc2626', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Ihr Autohaus in Musterstadt
                    </div>
                    <div style={{ color: '#111', fontWeight: 800, fontSize: '16px', lineHeight: 1.25, marginBottom: '7px' }}>
                      Neu- & Gebrauchtwagen.<br />
                      <span style={{ color: '#dc2626' }}>Service, dem Sie vertrauen.</span>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '8.5px', lineHeight: 1.6, marginBottom: '12px', maxWidth: '260px' }}>
                      Über 30 Jahre Erfahrung — Verkauf, Werkstatt & Reifenservice aus einer Hand.
                    </div>
                    <div style={{ display: 'flex', gap: '7px' }}>
                      <div style={{ background: '#dc2626', color: '#fff', fontSize: '8.5px', fontWeight: 600, padding: '5px 13px', borderRadius: '4px' }}>Fahrzeuge ansehen</div>
                      <div style={{ border: '1px solid #d1d5db', color: '#374151', fontSize: '8.5px', padding: '5px 13px', borderRadius: '4px' }}>Termin buchen</div>
                    </div>
                  </div>

                  {/* Featured vehicles */}
                  <div style={{ background: '#f9fafb', padding: '14px 22px' }}>
                    <div style={{ color: '#111', fontSize: '9px', fontWeight: 700, marginBottom: '10px' }}>Aktuelle Angebote</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { name: 'VW Golf 8', price: '24.900 €', km: '18.000 km', year: '2022' },
                        { name: 'BMW 3er',   price: '38.500 €', km: '12.000 km', year: '2023' },
                        { name: 'Audi A4',   price: '31.200 €', km: '22.000 km', year: '2022' },
                      ].map((car, i) => (
                        <div key={i} style={{ flex: 1, background: '#fff', borderRadius: '5px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                          <div style={{ height: '38px', background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '16px' }}>🚘</span>
                          </div>
                          <div style={{ padding: '5px 7px' }}>
                            <div style={{ color: '#111', fontSize: '7.5px', fontWeight: 700 }}>{car.name}</div>
                            <div style={{ color: '#dc2626', fontSize: '7.5px', fontWeight: 700 }}>{car.price}</div>
                            <div style={{ color: '#9ca3af', fontSize: '7px' }}>{car.year} · {car.km}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick-info row */}
                  <div style={{ background: '#fff', padding: '10px 22px', display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
                    {[
                      { icon: '🚗', label: '180+ Fahrzeuge' },
                      { icon: '🔧', label: 'Meisterbetrieb' },
                      { icon: '📍', label: 'Musterstraße 12' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '5px',
                        borderRight: i < 2 ? '1px solid #f3f4f6' : 'none',
                        paddingRight: i < 2 ? '12px' : 0,
                        marginRight: i < 2 ? '12px' : 0,
                      }}>
                        <span style={{ fontSize: '11px' }}>{item.icon}</span>
                        <span style={{ fontSize: '8px', color: '#6b7280', fontWeight: 500 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* ── Base / Keyboard ───────────────────────── */}
            <div style={{
              width: '580px', position: 'relative',
              transformOrigin: 'top center',
              transform: 'rotateX(45deg)',
              transformStyle: 'preserve-3d',
            }}>
              {/* Hinge strip */}
              <div style={{
                height: '5px',
                background: 'linear-gradient(to bottom, #111318, #0c0d12)',
                borderLeft: '1.5px solid rgba(255,255,255,0.06)',
                borderRight: '1.5px solid rgba(255,255,255,0.06)',
              }} />

              {/* Keyboard housing */}
              <div style={{
                background: 'linear-gradient(to bottom, #22242e 0%, #1c1e28 100%)',
                padding: '9px 15px 5px',
                borderLeft: '1.5px solid rgba(255,255,255,0.08)',
                borderRight: '1.5px solid rgba(255,255,255,0.08)',
                position: 'relative',
              }}>
                {/* Fn / media row */}
                <KeyRow style={{ marginBottom: '3px' }}>
                  <Key flex={1.5} isFn />
                  <Key isFn /><Key isFn /><Key isFn /><Key isFn />
                  <Key isFn /><Key isFn /><Key isFn /><Key isFn />
                  <Key isFn /><Key isFn /><Key isFn /><Key isFn />
                  <Key isFn />
                </KeyRow>

                {/* Number row */}
                <KeyRow style={{ marginTop: '3px' }}>
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key flex={2} />
                </KeyRow>

                {/* QWERTY */}
                <KeyRow>
                  <Key flex={1.5} />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key flex={1.5} />
                </KeyRow>

                {/* ASDF */}
                <KeyRow>
                  <Key flex={1.75} />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key />
                  <Key flex={2.25} />
                </KeyRow>

                {/* ZXCV */}
                <KeyRow>
                  <Key flex={2.25} />
                  <Key /><Key /><Key /><Key />
                  <Key /><Key /><Key /><Key />
                  <Key />
                  <Key flex={2.25} />
                </KeyRow>

                {/* Bottom row */}
                <KeyRow>
                  <Key flex={1.5} /><Key flex={1.5} />
                  <Key flex={1.5} /><Key flex={1.5} />
                  <Key flex={6.5} />
                  <Key flex={1.5} />
                  <Key /><Key /><Key />
                </KeyRow>

                {/* Trackpad */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '7px 0 8px' }}>
                  <div style={{
                    width: '155px', height: '17px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>

              {/* Bottom edge */}
              <div style={{
                height: '20px',
                background: 'linear-gradient(to bottom, #181a22, #111219)',
                border: '1.5px solid rgba(255,255,255,0.055)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                position: 'relative',
                boxShadow: '0 14px 48px rgba(0,0,0,0.85), -4px 0 10px rgba(0,0,0,0.4), 4px 0 10px rgba(0,0,0,0.3)',
              }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
