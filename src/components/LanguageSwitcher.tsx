'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown } from 'lucide-react';
import { isAppLocale, usePathname, useRouter } from '@/i18n/routing';
import { LANGUAGE_OPTIONS } from '@/i18n/languages';

type Props = { variant?: 'compact' | 'full'; className?: string };

// Match the language flag groups used in the provided app reference.
const LANGUAGE_FLAGS: Record<string, string[]> = {
  en: ['🇺🇸', '🇬🇧'],
  es: ['🇪🇸'],
  pt: ['🇵🇹', '🇧🇷'],
  fr: ['🇫🇷', '🇨🇦'],
  de: ['🇩🇪'],
  it: ['🇮🇹'],
  pl: ['🇵🇱'],
  id: ['🇮🇩'],
  hi: ['🇮🇳'],
  ja: ['🇯🇵'],
  ko: ['🇰🇷'],
  vi: ['🇻🇳'],
  th: ['🇹🇭'],
};

function Flags({ locale }: { locale: string }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-0.5 text-lg leading-none">
      {(LANGUAGE_FLAGS[locale] ?? []).map((flag) => <span key={flag}>{flag}</span>)}
    </span>
  );
}

export function LanguageSwitcher({ variant = 'compact', className = '' }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');
  const selectedLanguage = LANGUAGE_OPTIONS.find((option) => option.locale === locale) ?? LANGUAGE_OPTIONS[0];

  const changeLanguage = (nextLocale: string, details: HTMLDetailsElement) => {
    details.open = false;
    if (!isAppLocale(nextLocale) || nextLocale === locale) return;
    const query = typeof window === 'undefined' ? '' : window.location.search;
    const hash = typeof window === 'undefined' ? '' : window.location.hash;
    router.replace(`${pathname}${query}${hash}`, { locale: nextLocale });
  };

  return (
    <details className={`group relative shrink-0 ${className}`}>
      <summary
        aria-label={`${t('language')}: ${selectedLanguage.label}`}
        title={`${t('language')}: ${selectedLanguage.label}`}
        className={`flex cursor-pointer list-none items-center justify-center gap-1.5 rounded-lg border border-[#253047] bg-[#111318] text-zinc-300 transition hover:border-blue-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 [&::-webkit-details-marker]:hidden ${variant === 'compact' ? 'min-h-10 px-2' : 'min-h-11 w-full px-3'}`}
      >
        <Flags locale={locale} />
        <ChevronDown size={14} aria-hidden="true" className="text-blue-300 transition-transform group-open:rotate-180" />
        <span className="sr-only">{selectedLanguage.label}</span>
      </summary>
      <div
        role="group"
        aria-label={t('language')}
        className="absolute right-0 top-[calc(100%+8px)] z-50 grid grid-cols-3 gap-1.5 rounded-xl border border-[#253047] bg-[#111318] p-2 shadow-xl shadow-black/40"
      >
        {LANGUAGE_OPTIONS.map(({ locale: optionLocale, label }) => {
          const selected = optionLocale === locale;
          return (
            <button
              key={optionLocale}
              type="button"
              aria-label={label}
              aria-pressed={selected}
              title={label}
              onClick={(event) => changeLanguage(optionLocale, event.currentTarget.closest('details')!)}
              className={`relative flex size-11 items-center justify-center rounded-lg border transition hover:border-blue-500/70 hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${selected ? 'border-blue-500/70 bg-blue-500/10' : 'border-transparent'}`}
            >
              <Flags locale={optionLocale} />
              {selected && <Check size={12} aria-hidden="true" className="absolute bottom-0.5 right-0.5 text-emerald-300" />}
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
