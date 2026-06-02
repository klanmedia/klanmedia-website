import { cache } from 'react'
import { supabaseAdmin } from './supabase-server'

export type Demo = {
  id: string
  industry: string
  description: string
  icon: string
  color: string
  tags: string[]
  url: string | null
  is_available: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
}

// Für die public /demos page — nur sichtbare, sortiert
export const getPublicDemos = cache(async (): Promise<Demo[]> => {
  const { data } = await supabaseAdmin
    .from('demos')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
})

// Für den Admin — alle
export async function getAllDemos(): Promise<Demo[]> {
  const { data } = await supabaseAdmin
    .from('demos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}
