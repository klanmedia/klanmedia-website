'use client'

import Link from 'next/link'

export default function StopPropLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={className} onClick={e => e.stopPropagation()}>
      {children}
    </Link>
  )
}
