import type { Flags } from './flags'

/**
 * Returns '/konfigurator' when the flag is active, '/kontakt' otherwise.
 * Use for pricing card CTAs and hero primary button.
 */
export function ctaHref(flags: Flags): string {
  return flags['konfigurator_visible'] ? '/konfigurator' : '/kontakt'
}

/** Label for the primary CTA that might point to the configurator. */
export function ctaLabel(flags: Flags, labelKonfig = 'Paket konfigurieren', labelKontakt = 'Anfragen'): string {
  return flags['konfigurator_visible'] ? labelKonfig : labelKontakt
}
