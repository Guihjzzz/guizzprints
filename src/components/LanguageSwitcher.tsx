'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown } from 'lucide-react';
import { isAppLocale, usePathname, useRouter, type AppLocale } from '@/i18n/routing';
import { LANGUAGE_OPTIONS } from '@/i18n/languages';

type Props = { variant?: 'compact' | 'full'; className?: string };
type FlagCode = 'us' | 'gb' | 'es' | 'pt' | 'br' | 'fr' | 'ca' | 'de' | 'it' | 'pl' | 'id' | 'in' | 'jp' | 'kr' | 'vn' | 'th';

const LANGUAGE_FLAGS: Record<AppLocale, FlagCode> = {
  en: 'us',
  es: 'es',
  pt: 'br',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pl: 'pl',
  id: 'id',
  hi: 'in',
  ja: 'jp',
  ko: 'kr',
  vi: 'vn',
  th: 'th',
};

function FlagArt({ code }: { code: FlagCode }) {
  switch (code) {
    case 'us':
      return (
        <>
          <rect width="24" height="16" fill="#b22234" />
          {[1.23, 3.69, 6.15, 8.61, 11.07, 13.53].map((y) => <rect key={y} y={y} width="24" height="1.23" fill="#fff" />)}
          <rect width="10.5" height="8.6" fill="#3c3b6e" />
          {Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 }, (_, col) => <circle key={`${row}-${col}`} cx={1.3 + col * 1.8} cy={1.2 + row * 1.8} r="0.35" fill="#fff" />))}
        </>
      );
    case 'gb':
      return <><rect width="24" height="16" fill="#012169" /><path d="M0 0h3.4L24 12.7V16h-3.4L0 3.3zM24 0h-3.4L0 12.7V16h3.4L24 3.3z" fill="#fff" /><path d="M0 0h1.6L24 14.1V16h-1.6L0 1.9zM24 0h-1.6L0 14.1V16h1.6L24 1.9z" fill="#c8102e" /><path d="M9 0h6v16H9zM0 5h24v6H0z" fill="#fff" /><path d="M10.3 0h3.4v16h-3.4zM0 6.3h24v3.4H0z" fill="#c8102e" /></>;
    case 'es':
      return <><rect width="24" height="16" fill="#aa151b" /><rect y="4" width="24" height="8" fill="#f1bf00" /><circle cx="7" cy="8" r="1.25" fill="#aa151b" /><path d="M6.2 6.7h1.6v2.6H6.2z" fill="#f1bf00" /></>;
    case 'pt':
      return <><rect width="24" height="16" fill="#da291c" /><path d="M0 0h9.3v16H0z" fill="#046a38" /><circle cx="9.3" cy="8" r="3" fill="#ffcd00" /><path d="M8.4 6.5h1.8v3H8.4z" fill="#da291c" /><path d="M8.7 6.8h1.2v2.3H8.7z" fill="#fff" /></>;
    case 'br':
      return <><rect width="24" height="16" fill="#009739" /><path d="M12 2 22 8 12 14 2 8z" fill="#ffdf00" /><circle cx="12" cy="8" r="3.35" fill="#002776" /><path d="M8.9 7.3c2.2-.6 4.3-.4 6.2.5" fill="none" stroke="#fff" strokeWidth=".45" /></>;
    case 'fr':
      return <><rect width="8" height="16" fill="#002395" /><rect x="8" width="8" height="16" fill="#fff" /><rect x="16" width="8" height="16" fill="#ed2939" /></>;
    case 'ca':
      return <><rect width="24" height="16" fill="#fff" /><rect width="5.5" height="16" fill="#d80621" /><rect x="18.5" width="5.5" height="16" fill="#d80621" /><path d="m12 2 1.1 2.2 1.3-.7-.5 2 2 .5-1.5 1.3.8 1.4-2-.2-.5 2.5-1.1-.8-1.1.8-.5-2.5-2 .2.8-1.4L7.3 7l2-.5-.5-2 1.3.7z" fill="#d80621" /></>;
    case 'de':
      return <><rect width="24" height="5.34" fill="#111" /><rect y="5.33" width="24" height="5.34" fill="#d00" /><rect y="10.66" width="24" height="5.34" fill="#ffce00" /></>;
    case 'it':
      return <><rect width="8" height="16" fill="#009246" /><rect x="8" width="8" height="16" fill="#fff" /><rect x="16" width="8" height="16" fill="#ce2b37" /></>;
    case 'pl':
      return <><rect width="24" height="8" fill="#fff" /><rect y="8" width="24" height="8" fill="#dc143c" /></>;
    case 'id':
      return <><rect width="24" height="8" fill="#ce1126" /><rect y="8" width="24" height="8" fill="#fff" /></>;
    case 'in':
      return <><rect width="24" height="5.34" fill="#ff9933" /><rect y="5.33" width="24" height="5.34" fill="#fff" /><rect y="10.66" width="24" height="5.34" fill="#138808" /><circle cx="12" cy="8" r="2.1" fill="none" stroke="#000080" strokeWidth=".55" /><path d="M12 5.9v4.2M9.9 8h4.2M10.5 6.5l3 3M13.5 6.5l-3 3" stroke="#000080" strokeWidth=".3" /></>;
    case 'jp':
      return <><rect width="24" height="16" fill="#fff" /><circle cx="12" cy="8" r="4" fill="#bc002d" /></>;
    case 'kr':
      return <><rect width="24" height="16" fill="#fff" /><path d="M12 4a2.6 2.6 0 0 0 0 5.2 1.3 1.3 0 0 0 0-2.6 1.3 1.3 0 0 1 0-2.6" fill="#cd2e3a" /><path d="M12 12a2.6 2.6 0 0 0 0-5.2 1.3 1.3 0 0 0 0 2.6 1.3 1.3 0 0 1 0 2.6" fill="#0047a0" /><path d="M4 3h4M4 4.2h4M16 11.8h4M16 13h4" stroke="#111" strokeWidth=".8" /></>;
    case 'vn':
      return <><rect width="24" height="16" fill="#da251d" /><path d="m12 3 1.15 3.5h3.7l-3 2.1 1.15 3.5-3-2.15-3 2.15 1.15-3.5-3-2.1h3.7z" fill="#ff0" /></>;
    case 'th':
      return <><rect width="24" height="16" fill="#a51931" /><rect y="2.67" width="24" height="2.66" fill="#f4f5f8" /><rect y="5.33" width="24" height="5.34" fill="#2d2a4a" /><rect y="10.66" width="24" height="2.67" fill="#f4f5f8" /></>;
  }
}

function CountryFlag({ code }: { code: FlagCode }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 16" className="block h-4 w-[22px] shrink-0 overflow-hidden rounded-[3px] border border-white/20 shadow-sm">
      <FlagArt code={code} />
    </svg>
  );
}

function getMenuPosition(container: HTMLElement, trigger: HTMLElement) {
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const width = Math.min(350, Math.max(224, viewportWidth - 48), viewportWidth - 16);
  const containerRect = container.getBoundingClientRect();
  const triggerRect = trigger.getBoundingClientRect();
  const maxLeft = Math.max(8, viewportWidth - width - 8);
  const pageLeft = Math.min(Math.max(triggerRect.right - width, 8), maxLeft);

  return { left: pageLeft - containerRect.left, width };
}

export function LanguageSwitcher({ variant = 'compact', className = '' }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');
  const switcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 8, width: 224 });
  const selectedLanguage = LANGUAGE_OPTIONS.find((option) => option.locale === locale) ?? LANGUAGE_OPTIONS[2];
  const selectedLocale = selectedLanguage.locale;

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const container = switcherRef.current;
    const trigger = triggerRef.current;
    if (container && trigger) setMenuPosition(getMenuPosition(container, trigger));
    setMenuOpen(true);
  };

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const container = switcherRef.current;
      if (menuOpen && container && event.target instanceof Node && !container.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menuOpen) return;
      setMenuOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const reposition = () => {
      const container = switcherRef.current;
      const trigger = triggerRef.current;
      if (container && trigger) setMenuPosition(getMenuPosition(container, trigger));
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [menuOpen]);

  const changeLanguage = (nextLocale: string) => {
    setMenuOpen(false);
    if (!isAppLocale(nextLocale) || nextLocale === locale) return;
    const query = typeof window === 'undefined' ? '' : window.location.search;
    const hash = typeof window === 'undefined' ? '' : window.location.hash;
    router.replace(`${pathname}${query}${hash}`, { locale: nextLocale });
  };

  return (
    <div ref={switcherRef} className={`group relative shrink-0 ${menuOpen ? 'z-50' : 'z-0'} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${t('language')}: ${selectedLanguage.label}`}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        title={`${t('language')}: ${selectedLanguage.label}`}
        onClick={toggleMenu}
        className={`flex cursor-pointer select-none items-center justify-center gap-1.5 rounded-lg border border-[#253047] bg-[#111318] text-zinc-300 transition hover:border-blue-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${variant === 'compact' ? 'min-h-10 px-2' : 'min-h-11 w-full px-3'}`}
      >
        <CountryFlag code={LANGUAGE_FLAGS[selectedLocale]} />
        <ChevronDown size={14} aria-hidden="true" className={`text-blue-300 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        <span className="sr-only">{selectedLanguage.label}</span>
      </button>
      {menuOpen && (
        <div
          id={menuId}
          role="group"
          aria-label={t('language')}
          style={menuPosition}
          className="absolute top-[calc(100%+8px)] z-[60] grid max-h-[70dvh] grid-cols-1 gap-1.5 overflow-y-auto overscroll-contain rounded-xl border border-[#253047] bg-[#111318] p-2 shadow-xl shadow-black/50 sm:grid-cols-2"
        >
          {LANGUAGE_OPTIONS.map(({ locale: optionLocale, label }) => {
            const selected = optionLocale === selectedLocale;
            return (
              <button
                key={optionLocale}
                type="button"
                aria-label={label}
                aria-pressed={selected}
                title={label}
                onClick={() => changeLanguage(optionLocale)}
                className={`relative flex h-10 w-full items-center justify-start gap-2 rounded-lg border px-2 pr-5 text-left transition hover:border-blue-500/70 hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${selected ? 'border-blue-500/70 bg-blue-500/10' : 'border-transparent'}`}
              >
                <CountryFlag code={LANGUAGE_FLAGS[optionLocale]} />
                <span className="min-w-0 flex-1 truncate text-left text-xs font-medium text-zinc-200">{label}</span>
                {selected && <Check size={14} aria-hidden="true" className="absolute right-2 rounded-full text-emerald-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
