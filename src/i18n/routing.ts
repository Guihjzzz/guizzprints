import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'id', 'hi', 'ja', 'ko', 'vi', 'th'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'en';

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && locales.includes(value as AppLocale);
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  // New visitors use their saved next-intl preference or the browser's
  // Accept-Language header. Explicit locale URLs always take precedence.
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
