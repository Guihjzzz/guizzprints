'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe2 } from 'lucide-react';
import { isAppLocale, usePathname, useRouter } from '@/i18n/routing';
import { LANGUAGE_OPTIONS } from '@/i18n/languages';

type Props = { variant?: 'compact' | 'full'; className?: string };

export function LanguageSwitcher({ variant = 'compact', className = '' }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');

  const changeLanguage = (nextLocale: string) => {
    if (!isAppLocale(nextLocale) || nextLocale === locale) return;
    const query = typeof window === 'undefined' ? '' : window.location.search;
    const hash = typeof window === 'undefined' ? '' : window.location.hash;
    router.replace(`${pathname}${query}${hash}`, { locale: nextLocale });
  };

  return (
    <label className={`inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-[#253047] bg-[#111318] px-2 text-zinc-300 transition hover:border-blue-500/60 focus-within:border-blue-500 ${className}`}>
      <Globe2 size={variant === 'compact' ? 14 : 16} aria-hidden="true" className="shrink-0 text-blue-300" />
      <select
        aria-label={t('language')}
        value={locale}
        onChange={(event) => changeLanguage(event.target.value)}
        className={`min-w-0 cursor-pointer bg-transparent py-2 text-xs font-semibold text-white outline-none ${variant === 'compact' ? 'w-9 sm:w-auto' : 'w-full text-sm'}`}
      >
        {LANGUAGE_OPTIONS.map(({ locale: optionLocale, label, compact }) => (
          <option key={optionLocale} value={optionLocale} className="bg-[#111318] text-white">
            {variant === 'compact' ? compact : label}
          </option>
        ))}
      </select>
    </label>
  );
}
