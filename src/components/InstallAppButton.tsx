'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Download, MoreVertical, Share, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { installCopy } from '@/lib/install-copy';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallAppButton({ className, label }: { className?: string; label?: string }) {
  const locale = useLocale();
  const copy = installCopy[locale as keyof typeof installCopy] ?? installCopy.en;
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'accepted' | 'unavailable' | null>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setPrompt(null); setStatus(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const open = () => {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    setInstalled(window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true || installed);
    setStatus(null);
    dialog.current?.showModal();
  };

  const install = async () => {
    if (!prompt || busy) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setStatus(choice.outcome === 'accepted' ? 'accepted' : null);
    } catch {
      setStatus('unavailable');
    } finally {
      setPrompt(null);
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={open} className={className ?? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#334155] px-4 py-3 font-semibold text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400'}>
        <Download size={18} aria-hidden="true" />{label ?? copy.button}
      </button>
      <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-[#334155] bg-[#111318] p-6 text-[#E2E8F0] shadow-2xl backdrop:bg-black/75"
        onClick={(event) => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
        <button type="button" onClick={() => dialog.current?.close()} aria-label={copy.close} className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-400"><X size={20} aria-hidden="true" /></button>
        <Download className="mx-auto mb-4 mt-4 text-blue-400" size={34} aria-hidden="true" />
        <h2 id={titleId} className="text-center text-xl font-bold text-white">{copy.title}</h2>
        <p id={descriptionId} className="mt-3 text-center text-sm leading-6 text-slate-400">{copy.description}</p>
        {installed ? <p role="status" className="mt-6 rounded-xl bg-blue-500/10 p-4 text-sm text-blue-200">{copy.installed}</p> : (
          <div className="mt-6 space-y-3">
            {prompt && <button type="button" disabled={busy} onClick={install} className="min-h-12 w-full rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60">{copy.install}</button>}
            <section className="flex gap-3 rounded-xl bg-white/5 p-4"><MoreVertical className="mt-1 shrink-0 text-blue-400" size={20} aria-hidden="true" /><div><h3 className="text-sm font-bold text-white">{copy.android}</h3><p className="mt-1 text-sm leading-6">{copy.androidSteps}</p></div></section>
            <section className="flex gap-3 rounded-xl bg-white/5 p-4"><Share className="mt-1 shrink-0 text-blue-400" size={20} aria-hidden="true" /><div><h3 className="text-sm font-bold text-white">{copy.iphone}</h3><p className="mt-1 text-sm leading-6">{copy.iphoneSteps}</p></div></section>
            <p className="text-xs leading-5 text-slate-400">{copy.desktop}</p>
          </div>
        )}
        {status && !installed && <p role="status" className="mt-4 text-sm leading-6 text-blue-200">{copy[status]}</p>}
        <button type="button" onClick={() => dialog.current?.close()} className="mt-4 min-h-11 w-full rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5">{installed ? copy.close : copy.later}</button>
      </dialog>
    </>
  );
}
