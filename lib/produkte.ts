import { cache } from 'react'
import { supabaseAdmin } from './supabase-server'

export type Produkt = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tags: string[]
  url: string | null
  price: string | null
  is_available: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
}

export const getPublicProdukte = cache(async (): Promise<Produkt[]> => {
  const { data } = await supabaseAdmin
    .from('produkte')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
})

export async function getAllProdukte(): Promise<Produkt[]> {
  const { data } = await supabaseAdmin
    .from('produkte')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}
