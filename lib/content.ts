import { cache } from 'react'
import { supabaseAdmin } from './supabase-server'

export type HeroText = {
  id: string
  page_key: string
  variant_name: string
  eyebrow: string
  title: string
  subtitle: string
  is_active: boolean
  created_at: string
}

// Cached per Request — holt den aktiven Hero-Text für eine Page
export const getHeroText = cache(async (pageKey: string): Promise<HeroText | null> => {
  const { data } = await supabaseAdmin
    .from('page_hero_texts')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .maybeSingle()
  return data ?? null
})

// Holt alle Varianten für alle Pages (für Admin)
export async function getAllHeroTexts(): Promise<HeroText[]> {
  const { data } = await supabaseAdmin
    .from('page_hero_texts')
    .select('*')
    .order('page_key')
    .order('created_at')
  return data ?? []
}
