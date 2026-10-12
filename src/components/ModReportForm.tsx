'use client';

import { useState, type FormEvent } from 'react';
import { Flag, Loader2, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getClientAuthToken } from '@/lib/client-auth';

type ReportReason = 'download_broken' | 'wrong_file' | 'wrong_images' | 'wrong_description' | 'wrong_edition_or_version' | 'other';

export function ModReportForm({ modId, title, edition, isDemo = false }: {
  modId: string;
  title: string;
  edition: 'bedrock' | 'java';
  isDemo?: boolean;
}) {
  const t = useTranslations('Report');
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('download_broken');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | 'limit' | null>(null);

  if (isDemo) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      // Attach the account token when one is readily available, but reporting
      // remains available to guests and never waits on sign-in.
      const token = await Promise.race([
        getClientAuthToken().catch(() => null),
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 350)),
      ]);
      const headers = new Headers({ 'Content-Type': 'application/json' });
      if (token) headers.set('Authorization', `Bearer ${token}`);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers,
        body: JSON.stringify({ modId, edition, reason, details }),
        cache: 'no-store',
      });
      if (response.status === 429) {
        setFeedback('limit');
        return;
      }
      if (!response.ok) throw new Error('report_failed');
      setFeedback('success');
      setReason('download_broken');
      setDetails('');
    } catch {
      setFeedback('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 shadow-xl sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <Flag size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-black text-white">{t('title')}</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {t('description', { edition: t(edition === 'java' ? 'java' : 'bedrock') })}
          </p>
        </div>
      </div>

      {!open ? (
        <button type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="mod-report-form"
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[.07] px-4 py-2.5 text-sm font-black text-amber-100 transition hover:border-amber-300/60 hover:bg-amber-400/15">
          <Flag size={15} aria-hidden="true" /> {t('openForm')}
        </button>
      ) : (
        <form id="mod-report-form" onSubmit={submit} className="mt-4 space-y-3 border-t border-[#252c3a] pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-zinc-300">{t('itemEdition', { title, edition: t(edition === 'java' ? 'java' : 'bedrock') })}</p>
            <button type="button" onClick={() => setOpen(false)} aria-expanded={true} aria-controls="mod-report-form" className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white" aria-label={t('close')}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <label className="block space-y-1.5 text-xs font-bold text-zinc-300">
            <span>{t('reasonLabel')}</span>
            <select required value={reason} onChange={(event) => setReason(event.target.value as ReportReason)}
              className="min-h-10 w-full rounded-xl border border-[#283244] bg-[#07090D] px-3 py-2 text-sm font-medium text-white outline-none focus:border-amber-400">
              <option value="download_broken">{t('reasons.downloadBroken')}</option>
              <option value="wrong_file">{t('reasons.wrongFile')}</option>
              <option value="wrong_images">{t('reasons.wrongImages')}</option>
              <option value="wrong_description">{t('reasons.wrongDescription')}</option>
              <option value="wrong_edition_or_version">{t('reasons.wrongEdition')}</option>
              <option value="other">{t('reasons.other')}</option>
            </select>
          </label>

          <label className="block space-y-1.5 text-xs font-bold text-zinc-300">
            <span>{t('detailsLabel')}</span>
            <textarea value={details} onChange={(event) => setDetails(event.target.value.slice(0, 1500))}
              maxLength={1500} rows={3} placeholder={t('detailsPlaceholder')}
              className="w-full resize-y rounded-xl border border-[#283244] bg-[#07090D] px-3 py-2.5 text-sm font-medium text-white outline-none placeholder:text-zinc-600 focus:border-amber-400" />
            <span className="block text-right font-normal text-zinc-600">{details.length}/1500</span>
          </label>

          {feedback === 'success' && <p role="status" className="rounded-lg border border-emerald-400/20 bg-emerald-400/[.07] px-3 py-2 text-xs leading-5 text-emerald-200">{t('success')}</p>}
          {feedback === 'limit' && <p role="alert" className="rounded-lg border border-amber-400/20 bg-amber-400/[.07] px-3 py-2 text-xs leading-5 text-amber-100">{t('rateLimit')}</p>}
          {feedback === 'error' && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-200">{t('submitError')}</p>}

          <p className="text-[11px] leading-4 text-zinc-500">{t('privacy')}</p>
          <button type="submit" disabled={submitting}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60">
            {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
            {submitting ? t('sending') : t('send')}
          </button>
        </form>
      )}
    </section>
  );
}
