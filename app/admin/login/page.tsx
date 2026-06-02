'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createBrowserSupabase()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('E-Mail oder Passwort ungültig.')
      setLoading(false)
      return
    }

    router.push(from)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#06060A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            klan<span className="text-[#2563EB]">media</span>
          </span>
          <p className="text-white/35 text-sm mt-1">Admin-Bereich</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1.5">E-Mail</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" placeholder="admin@email.de"
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Passwort</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" placeholder="••••••••"
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#2563EB] text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? 'Anmelden…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  )
}
