'use client'

import { useEffect, useRef, useState } from 'react'

type LineData =
  | { type: 'cmd'; text: string }
  | { type: 'out'; text: string; cls: 'dim' | 'green' | 'blue' | 'warn' | '' }
  | { type: 'cursor' }

const LINES: LineData[] = [
  { type: 'cmd', text: 'npm run build' },
  { type: 'out', text: '▸ Compiling 24 modules...', cls: 'dim' },
  { type: 'out', text: '✓ Bundle optimized  (138 kb gzip)', cls: 'green' },
  { type: 'cmd', text: 'git push origin main' },
  { type: 'out', text: 'Enumerating objects: 18, done.', cls: 'dim' },
  { type: 'out', text: '→  main → autohaus-mueller.de', cls: 'blue' },
  { type: 'cmd', text: './deploy.sh --prod' },
  { type: 'out', text: '⚡ Deploying to production server...', cls: 'warn' },
  { type: 'out', text: '✓ SSL renewed · nginx reloaded', cls: 'green' },
  { type: 'out', text: '✓ Live → autohaus-mueller.de', cls: 'green' },
  { type: 'cursor' },
]

const DELAYS: Record<string, number> = { cmd: 900, out: 360, cursor: 2800 }

function renderLine(line: LineData, i: number) {
  const base: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: '9px', marginBottom: '6px', fontSize: '12px', lineHeight: '1.65', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }

  if (line.type === 'cursor') {
    return (
      <div key={i} style={base}>
        <span style={{ color: 'rgba(41,182,255,0.3)', flexShrink: 0 }}>❯</span>
        <span style={{ display: 'inline-block', width: '7px', height: '13px', background: '#29b6ff', borderRadius: '1px', verticalAlign: 'middle', animation: 'termBlink 1s step-end infinite' }} />
      </div>
    )
  }
  if (line.type === 'cmd') {
    return (
      <div key={i} style={base}>
        <span style={{ color: '#29b6ff', flexShrink: 0 }}>❯</span>
        <span style={{ color: '#e8eaf0' }}>{line.text}</span>
      </div>
    )
  }
  const colors: Record<string, string> = {
    '': '#3effa0',
    green: '#3effa0',
    dim: 'rgba(62,255,160,0.38)',
    blue: '#60cfff',
    warn: '#ffd060',
  }
  return (
    <div key={i} style={{ ...base, paddingLeft: '22px' }}>
      <span style={{ color: colors[line.cls] }}>{line.text}</span>
    </div>
  )
}

export default function TerminalWindow() {
  const [shown, setShown] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let idx = 0

    function next() {
      idx++
      if (idx > LINES.length) {
        // reset after a pause
        timerRef.current = setTimeout(() => {
          idx = 0
          setShown(0)
          timerRef.current = setTimeout(next, 500)
        }, 1800)
        return
      }
      setShown(idx)
      const line = LINES[idx - 1]
      const delay = line.type === 'cursor' ? DELAYS.cursor : line.type === 'cmd' ? DELAYS.cmd : DELAYS.out
      timerRef.current = setTimeout(next, delay)
    }

    timerRef.current = setTimeout(next, 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <>
      <style>{`@keyframes termBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(10,15,20,0.96)',
        border: '1px solid rgba(0,200,255,0.18)',
        borderRadius: '12px',
        boxShadow: '0 0 60px rgba(0,160,255,0.07), 0 24px 48px rgba(0,0,0,0.5)',
      }}>
        {/* Title bar */}
        <div style={{
          padding: '11px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px 12px 0 0',
        }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ marginLeft: 10, color: 'rgba(255,255,255,0.28)', fontSize: '11px', letterSpacing: '0.06em' }}>
            klanmedia — deploy.sh
          </span>
        </div>
        {/* Body */}
        <div style={{ padding: '20px 22px', minHeight: '210px' }}>
          {LINES.slice(0, shown).map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </>
  )
}
