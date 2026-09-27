'use client';

import { useState } from 'react';
import { Download, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface DownloadFlowProps {
  modId: string;
  modTitle?: string;
  modImage?: string;
  onModalStateChange?: (isOpen: boolean) => void;
}

/** One-click download with the original server-side validation and counter. */
export default function DownloadFlow({ modId }: DownloadFlowProps) {
  const t = useTranslations('Download');
  const router = useRouter();
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    if (isPreparing) return;
    setIsPreparing(true);
    setError(null);
    try {
      const response = await fetch('/api/download/session', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modId }),
      });
      if (!response.ok) throw new Error('download-session');
      router.push(`/api/download/open?mod=${encodeURIComponent(modId)}`);
    } catch {
      setError(t('sessionError'));
      setIsPreparing(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-blue-400/20 bg-[#111827] p-5 shadow-xl">
      <div className="mb-4 flex items-start gap-3 text-left">
        <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400"><ShieldCheck size={20} /></span>
        <div>
          <p className="font-bold text-white">Download direto e gratuito</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">Sem anúncios, contagem regressiva ou página intermediária.</p>
        </div>
      </div>
      <button type="button" disabled={isPreparing} onClick={download}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-4 font-bold text-white shadow-[0_6px_28px_#2563eb35] transition hover:bg-blue-500 active:translate-y-px disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
        {isPreparing ? <Loader2 size={19} className="motion-safe:animate-spin" /> : <Download size={19} />}
        {isPreparing ? t('preparing') : t('download')}
      </button>
      {error && <p role="alert" className="mt-3 text-center text-sm text-red-400">{error}</p>}
    </div>
  );
}
