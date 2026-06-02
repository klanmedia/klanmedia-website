'use client'

import { useEffect, useRef } from 'react'

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    const mouse = { x: 0.5, y: 0.5 }

    function resize() {
      W = canvas!.width = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)

    const N = 80
    const particles = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.4 + 0.08,
      hue: 210 + Math.random() * 50,
    }))

    let t = 0
    let raf: number

    function draw() {
      raf = requestAnimationFrame(draw)
      t += 0.004
      ctx!.clearRect(0, 0, W, H)

      // Animated orbs
      const orbs = [
        { x: 0.3 + Math.sin(t * 0.7) * 0.12 + mouse.x * 0.08, y: 0.4 + Math.cos(t * 0.5) * 0.1 + mouse.y * 0.06, r: W * 0.42, c: [37, 99, 235, 0.2] },
        { x: 0.72 + Math.cos(t * 0.6) * 0.1 - mouse.x * 0.06, y: 0.55 + Math.sin(t * 0.8) * 0.09, r: W * 0.35, c: [96, 165, 250, 0.12] },
        { x: 0.5 + Math.sin(t * 0.4) * 0.07, y: 0.2 + Math.cos(t * 0.9) * 0.07, r: W * 0.28, c: [167, 139, 250, 0.08] },
      ]
      orbs.forEach(o => {
        const gx = o.x * W, gy = o.y * H
        const g = ctx!.createRadialGradient(gx, gy, 0, gx, gy, o.r)
        g.addColorStop(0, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},${o.c[3]})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, W, H)
      })

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue},80%,70%,${p.a})`
        ctx!.fill()
      })

      // Connection lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = (particles[i].x - particles[j].x) * W
          const dy = (particles[i].y - particles[j].y) * H
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x * W, particles[i].y * H)
            ctx!.lineTo(particles[j].x * W, particles[j].y * H)
            ctx!.strokeStyle = `rgba(96,165,250,${(1 - dist / 90) * 0.1})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
