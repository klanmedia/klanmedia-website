import { cache } from 'react'
import { supabaseAdmin } from './supabase-server'

export type Flags = Record<string, boolean>

// cache() = wird pro Server-Request nur EINMAL aufgerufen,
// egal wie viele Komponenten getFlags() importieren.
export const getFlags = cache(async (): Promise<Flags> => {
  const { data, error } = await supabaseAdmin
    .from('feature_flags')
    .select('key, value')

  if (error || !data) return {}
  return Object.fromEntries(data.map(f => [f.key, f.value]))
})

// Hilfsfunktion: Flag auslesen mit Fallback (wenn Flag nicht existiert → true)
export function flag(flags: Flags, key: string): boolean {
  return flags[key] !== false
}
