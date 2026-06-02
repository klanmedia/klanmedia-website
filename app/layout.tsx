import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import NavbarWrapper from './_components/NavbarWrapper'
import Footer from './_components/Footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const BASE_URL = 'https://klanmedia.de'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'klanmedia — Webentwicklung & Hosting für lokale Unternehmen',
    template: '%s | klanmedia',
  },
  description:
    'Professionelle Websites und Managed Hosting für lokale Unternehmen — persönlich, schnell, zuverlässig.',
  keywords: [
    'Webentwicklung',
    'Webdesign',
    'Hosting',
    'Next.js',
    'lokale Unternehmen',
    'Website erstellen',
    'Google Business',
    'SEO',
  ],
  authors: [{ name: 'Benno Klan', url: BASE_URL }],
  creator: 'klanmedia',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: BASE_URL,
    siteName: 'klanmedia',
    title: 'klanmedia — Webentwicklung & Hosting für lokale Unternehmen',
    description:
      'Professionelle Websites und Managed Hosting für lokale Unternehmen — persönlich, schnell, zuverlässig.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'klanmedia — Webentwicklung & Hosting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'klanmedia — Webentwicklung & Hosting für lokale Unternehmen',
    description:
      'Professionelle Websites und Managed Hosting für lokale Unternehmen.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const heads = await headers()
  const isAdmin = heads.get('x-is-admin') === '1'

  return (
    <html lang="de" className={geist.variable}>
      <body className={isAdmin ? 'bg-gray-50' : 'min-h-screen flex flex-col'}>
        {isAdmin ? (
          children
        ) : (
          <>
            <NavbarWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
