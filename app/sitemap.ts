import type { MetadataRoute } from 'next'

const BASE_URL = 'https://klanmedia.de'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    { url: '/',                        priority: 1.0,  changeFrequency: 'monthly' as const },
    { url: '/services',                priority: 0.9,  changeFrequency: 'monthly' as const },
    { url: '/services/webentwicklung', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/services/content',        priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/services/google',         priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/services/bundles',        priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/services/hosting',         priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/preise',                  priority: 0.8,  changeFrequency: 'monthly' as const },
    { url: '/demos',                   priority: 0.7,  changeFrequency: 'monthly' as const },
    { url: '/projekte',                priority: 0.7,  changeFrequency: 'monthly' as const },
    { url: '/konfigurator',            priority: 0.65, changeFrequency: 'monthly' as const },
    { url: '/ueber-uns',               priority: 0.6,  changeFrequency: 'yearly'  as const },
    { url: '/kontakt',                 priority: 0.8,  changeFrequency: 'yearly'  as const },
  ]

  return routes.map(route => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
