'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {

      // ── Hero: Text-Inhalt bewegt sich beim Scrollen nach oben ──
      gsap.to('.hero-content', {
        y: -70,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '55% top',
          scrub: true,
        },
      })

      // ── Hero: Laptop gleitet beim Scrollen nach rechts raus ──
      gsap.to('.hero-visual', {
        x: 100,
        rotationY: 15,
        opacity: 0,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '45% top',
          scrub: 1.5,
        },
      })

      // ── Hero Einblendung beim Laden ──
      // Set initial state via GSAP (not inline styles) so revert() restores visibility
      gsap.set('.hero-badge',  { opacity: 0, y: 20 })
      gsap.set('.hero-title',  { opacity: 0, y: 40 })
      gsap.set('.hero-sub',    { opacity: 0, y: 30 })
      gsap.set('.hero-btns',   { opacity: 0, y: 20 })
      gsap.set('.hero-visual', { opacity: 0, x: 60 })

      gsap.to('.hero-badge',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 })
      gsap.to('.hero-title',  { opacity: 1, y: 0, duration: 1,   ease: 'power3.out', delay: 0.3 })
      gsap.to('.hero-sub',    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.55 })
      gsap.to('.hero-btns',   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.75 })
      gsap.to('.hero-visual', { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.5 })

      // ── Fade-up beim Scrollen ──
      gsap.utils.toArray<Element>('[data-animate="fade-up"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Stagger: Kinder-Elemente nacheinander einblenden ──
      gsap.utils.toArray<Element>('[data-animate="stagger"]').forEach((container) => {
        gsap.fromTo(
          Array.from(container.children),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            stagger: 0.13,
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Feature-Items: von rechts einblenden ──
      gsap.utils.toArray<Element>('.feature-item').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 87%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
