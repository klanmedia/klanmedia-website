import { cache } from 'react'
import { supabaseAdmin } from './supabase-server'

export type Projekt = {
  id: string
  title: string
  category: string
  description: string
  icon: string
  color: string
  tags: string[]
  url: string | null
  is_live: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
}

export const getPublicProjekte = cache(async (): Promise<Projekt[]> => {
  const { data } = await supabaseAdmin
    .from('projekte')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
})

export async function getAllProjekte(): Promise<Projekt[]> {
  const { data } = await supabaseAdmin
    .from('projekte')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}
