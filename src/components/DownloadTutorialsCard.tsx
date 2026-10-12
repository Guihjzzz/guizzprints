import { ExternalLink, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

const DOWNLOAD_TUTORIALS_URL = 'https://guihjzzz.github.io/';

export function DownloadTutorialsCard() {
  const t = useTranslations('Download');

  return (
    <a
      href={DOWNLOAD_TUTORIALS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('tutorialsTitle')}
      className="group flex min-h-12 w-full items-center gap-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-[#0a1720] via-[#0c121a] to-[#090c12] p-3 shadow-lg shadow-black/15 transition hover:border-cyan-400/55 hover:from-[#0d1d28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300" aria-hidden="true">
        <Languages className="size-4" />
      </span>

      <span className="min-w-0 flex-1 text-sm font-black leading-tight text-white">
        {t('tutorialsTitle')}
      </span>

      <span className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/40 bg-[#0b1721] px-2.5 text-xs font-black text-cyan-100 transition group-hover:bg-cyan-500/10">
        <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
      </span>
    </a>
  );
}
