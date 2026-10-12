import { ExternalLink, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GUIZZ_WORLDS_URL = 'https://guizz-worlds.github.io';

export function GuizzWorldsBanner({ className = 'mx-auto w-full max-w-5xl' }: { className?: string }) {
  const t = useTranslations('Mod');

  return (
    <section className={className} aria-label={t('worldsTitle')}>
      <a
        href={GUIZZ_WORLDS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full items-center gap-2.5 rounded-2xl border border-blue-500/35 bg-gradient-to-r from-[#0b1625] via-[#0b111b] to-[#090c12] p-3 shadow-lg shadow-black/20 transition hover:border-blue-400/60 hover:from-[#0e1c2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d] sm:gap-5 sm:px-5 sm:py-4"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#071521] sm:size-14" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="size-8 drop-shadow-md sm:size-12" shapeRendering="crispEdges">
            <path d="M32 5 56 18 32 32 8 18Z" fill="#63b844" stroke="#a3e678" strokeLinejoin="round" strokeWidth="2" />
            <path d="M8 18 32 32V59L8 45Z" fill="#91613a" stroke="#c18b4d" strokeLinejoin="round" strokeWidth="2" />
            <path d="M32 32 56 18V45L32 59Z" fill="#70472f" stroke="#a36b3e" strokeLinejoin="round" strokeWidth="2" />
            <path d="m13 19 5 3-4 3-5-3Zm12 7 5 3-4 3-5-3Zm-13 5 4 2v5l-4-2Zm12 8 4 2v5l-4-2Z" fill="#4b8f39" />
            <path d="m37 29 5-3v5l-5 3Zm11-6 5-3v5l-5 3ZM37 42l5-2v5l-5 2Zm10-6 5-2v5l-5 2Zm-10 13 5-2v4l-5 2Z" fill="#805230" />
            <path d="m20 38 4 2v3l-4-2Zm-7-8 3 2v3l-3-2Zm29 5 4-2v3l-4 2Z" fill="#b47a45" />
          </svg>
          <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border border-[#071521] bg-[#102337] sm:right-0.5 sm:top-0.5 sm:size-6">
            <Trophy className="size-2.5 fill-amber-300/20 text-amber-300 sm:size-3.5" />
          </span>
          <span className="absolute left-0.5 top-0 z-10 text-xs font-black leading-none text-blue-100 sm:left-1.5 sm:text-base">+</span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black tracking-tight text-white sm:text-lg">{t('worldsTitle')}</span>
          <span className="mt-0.5 line-clamp-2 block text-[11px] leading-4 text-blue-100/90 sm:mt-1 sm:text-sm sm:leading-5">{t('worldsDescription')}</span>
        </span>

        <span className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-blue-300/60 bg-[#0c1521] px-2.5 py-2 text-[11px] font-black leading-none text-white transition group-hover:bg-blue-500/15 sm:min-h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm">
          {t('worldsAction')} <ExternalLink className="size-3 shrink-0 sm:size-[15px]" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
