import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Basis-Response vorbereiten (Request-Headers weiterleiten)
  const requestHeaders = new Headers(request.headers)

  // Navbar/Footer im Root-Layout ausblenden (nur für UI-Routen, nicht API)
  if (pathname.startsWith('/admin')) {
    requestHeaders.set('x-is-admin', '1')
  }

  // Login-Seite ist immer zugänglich (aber nav trotzdem ausblenden)
  if (pathname === '/admin/login') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Session prüfen (für beide: /admin/* und /api/admin/*)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()     => request.cookies.getAll(),
        setAll: (list) => list.forEach(({ name, value }) => request.cookies.set(name, value)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // API-Routen → JSON 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
    }
    // UI-Routen → Redirect zum Login
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Admin-Status prüfen
  const { data: adminRecord } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminRecord) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // ✓ Authentifiziert & Admin — vertrauenswürdigen Header setzen
  requestHeaders.set('x-admin-verified', '1')

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Schützt sowohl die Admin-UI als auch die Admin-API-Routen
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
