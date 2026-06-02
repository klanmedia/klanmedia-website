// Server-only — nur für Server Components und API Routes
// Niemals in Client Components ('use client') importieren!
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server Client mit User-Session (liest Auth-Cookies)
export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(URL, ANON, {
    cookies: {
      getAll:  ()     => cookieStore.getAll(),
      setAll: (list)  => {
        try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
      },
    },
  })
}

// Admin Client — umgeht RLS, für Datenbankoperationen im Backend
export const supabaseAdmin = createClient(URL, SVC, {
  auth: { persistSession: false },
})
