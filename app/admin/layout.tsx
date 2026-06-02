import type { Metadata } from 'next'
import AdminSidebar from './_components/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
