'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Download, FileArchive, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type DownloadFormat = {
  id: string;
  label: string;
  family: 'Bedrock' | 'Java';
  url?: string | null;
  fileName?: string;
  available?: boolean;
};

interface DownloadFlowProps {
  modId: string;
  directUrl?: string;
  fileName?: string;
  formats?: readonly DownloadFormat[];
  availableFormatIds?: readonly string[] | null;
}

// Keep .schem and .schematic as distinct Java download options.
const STANDARD_FORMATS: ReadonlyArray<Omit<DownloadFormat, 'url'>> = [
  { id: 'holoprint', label: 'Holoprint', family: 'Bedrock' },
  { id: 'mcstructure', label: '.mcstructure', family: 'Bedrock' },
  { id: 'mcaddon', label: '.mcaddon', family: 'Bedrock' },
  { id: 'mcworld', label: '.mcworld', family: 'Bedrock' },
  { id: 'litematic', label: '.litematic', family: 'Java' },
  { id: 'schem', label: '.schem', family: 'Java' },
  { id: 'schematic', label: '.schematic', family: 'Java' },
  { id: 'world', label: 'World', family: 'Java' },
  { id: 'mcfunction', label: '.mcfunction', family: 'Java' },
];

function inferFormatId(url?: string, fileName?: string) {
  const source = `${url || ''} ${fileName || ''}`.toLowerCase();
  if (source.includes('.mcstructure')) return 'mcstructure';
  if (source.includes('.mcaddon')) return 'mcaddon';
  if (source.includes('.mcworld')) return 'mcworld';
  if (source.includes('.litematic')) return 'litematic';
  if (source.includes('.schematic')) return 'schematic';
  if (source.includes('.schem')) return 'schem';
  if (source.includes('.mcfunction')) return 'mcfunction';
  if (source.includes('holoprint')) return 'holoprint';
  if (source.includes('world')) return 'world';
  return undefined;
}

/** Clear, edition-specific direct downloads. */
export default function DownloadFlow({ modId, directUrl, fileName, formats, availableFormatIds }: DownloadFlowProps) {
  const t = useTranslations('Download');
  const [isPreparing, setIsPreparing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableFormats = useMemo<DownloadFormat[]>(() => {
    if (formats?.length) {
      // Older catalog rows only store `{ id, url }`. Enrich those records from
      // the same format catalog used by the publisher so public buttons never
      // render an empty label or an incorrect edition badge.
      return formats.map((format) => {
        const standard = STANDARD_FORMATS.find((item) => item.id === format.id);
        return {
          ...standard,
          ...format,
          label: format.label || standard?.label || format.id,
          family: format.family || standard?.family || 'Bedrock',
          available: Boolean(format.available || format.url),
        };
      });
    }

    const directFormat = inferFormatId(directUrl, fileName);
    return STANDARD_FORMATS.map((format) => ({
      ...format,
      url: format.id === directFormat ? directUrl : undefined,
      fileName: format.id === directFormat ? fileName : undefined,
      available: Boolean(availableFormatIds?.includes(format.id)),
    }));
  }, [availableFormatIds, directUrl, fileName, formats]);

  // Every public entry represents one edition. Showing only its published
  // formats avoids mixing Bedrock and Java downloads in the same card.
  const visibleFormats = availableFormats.filter((format) => Boolean(format.url || format.available));
  const selectedFormat = visibleFormats.find((format) => format.id === selectedId)
    || visibleFormats[0]
    || availableFormats[0];
  const family = selectedFormat?.family || visibleFormats[0]?.family;

  async function openProtectedDownload(formatId: string) {
    if (isPreparing) return;
    setIsPreparing(true);
    setError(null);
    try {
      const response = await fetch('/api/download/session', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modId, format: formatId }),
      });
      if (!response.ok) throw new Error('download-session');
      window.location.assign(`/api/download/open?mod=${encodeURIComponent(modId)}&format=${encodeURIComponent(formatId)}`);
    } catch {
      setError(t('sessionError'));
      setIsPreparing(false);
    }
  }

  return (
    <section className="w-full rounded-2xl border border-blue-400/25 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.17),transparent_52%),#111827] p-4 shadow-xl sm:p-5">
      <header className="flex items-start gap-3 text-left">
        <span className="rounded-xl border border-emerald-400/15 bg-emerald-500/10 p-2.5 text-emerald-300">
          <ShieldCheck size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-black text-white">{t('title')}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">{t('description')}</p>
        </div>
      </header>

      {visibleFormats.length > 0 ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{t('formatAvailable')}</p>
            {family && (
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${family === 'Bedrock' ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300' : 'border-orange-400/25 bg-orange-500/10 text-orange-300'}`}>
                {family}
              </span>
            )}
          </div>
          <div className={`grid gap-2 ${visibleFormats.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`} role="radiogroup" aria-label={t('formatAvailable')}>
            {visibleFormats.map((format) => {
              const isSelected = selectedFormat?.id === format.id;
              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setSelectedId(format.id)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${isSelected ? 'border-blue-400 bg-blue-500/15 text-white shadow-[0_8px_20px_-16px_rgba(59,130,246,.95)]' : 'border-[#2A3448] bg-[#090d15] text-zinc-300 hover:border-zinc-500 hover:bg-white/[0.04]'}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <FileArchive size={17} className={`shrink-0 ${isSelected ? 'text-blue-200' : 'text-zinc-500'}`} aria-hidden="true" />
                    <span className="truncate text-sm font-bold">{format.label}</span>
                  </span>
                  <CheckCircle2 size={17} className={`shrink-0 ${isSelected ? 'text-emerald-300' : 'text-zinc-700'}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        {selectedFormat?.url ? (
          <a href={selectedFormat.url} download={selectedFormat.fileName} className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3.5 font-black text-white shadow-[0_10px_28px_-14px_rgba(37,99,235,.95)] transition hover:bg-blue-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
            <Download size={19} aria-hidden="true" /> {t('downloadFormat', { format: selectedFormat.label })}
          </a>
        ) : selectedFormat?.available ? (
          <button type="button" disabled={isPreparing} onClick={() => void openProtectedDownload(selectedFormat.id)} className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3.5 font-black text-white shadow-[0_10px_28px_-14px_rgba(37,99,235,.95)] transition hover:bg-blue-500 active:translate-y-px disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
            {isPreparing ? <Loader2 size={19} className="motion-safe:animate-spin" aria-hidden="true" /> : <Download size={19} aria-hidden="true" />}
            {isPreparing ? t('preparing') : t('downloadFormat', { format: selectedFormat.label })}
          </button>
        ) : (
          <button type="button" disabled className="flex min-h-13 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-zinc-800 px-4 py-3.5 font-bold text-zinc-500">
            <Download size={19} aria-hidden="true" /> {t('formatInPreparation')}
          </button>
        )}
      </div>
      {!selectedFormat?.url && !selectedFormat?.available && <p className="mt-3 text-center text-xs leading-5 text-zinc-500">{t('formatUnavailable')}</p>}
      {error && <p role="alert" className="mt-3 text-center text-sm text-red-400">{error}</p>}
    </section>
  );
}
