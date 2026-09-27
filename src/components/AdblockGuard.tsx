'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Best-effort ad-block detection for the visitor-facing ad surface.
 *
 * This is deliberately only a UX signal: the download API still enforces its
 * signed server session and timer, so a client-side detector can never unlock
 * an external file on its own. VIP visitors never mount this component because
 * AdPlaceholder wraps it inside VipAdGate.
 */
export default function AdblockGuard({ children }: { children: ReactNode }) {
  const t = useTranslations('Category');
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  const check = useCallback(() => {
    const bait = document.createElement('div');
    bait.className = 'adsbox ad-banner ad-placement text-ad';
    bait.setAttribute('aria-hidden', 'true');
    bait.textContent = 'ad';
    Object.assign(bait.style, {
      position: 'absolute',
      left: '-10000px',
      top: '-10000px',
      width: '1px',
      height: '1px',
      pointerEvents: 'none',
      opacity: '0.01',
    });
    document.body.appendChild(bait);
    const timer = window.setTimeout(() => {
      const style = window.getComputedStyle(bait);
      const hidden = style.display === 'none' || style.visibility === 'hidden'
        || bait.offsetWidth === 0 || bait.offsetHeight === 0;
      bait.remove();
      setBlocked(hidden);
      setChecking(false);
    }, 120);
    return () => { window.clearTimeout(timer); bait.remove(); };
  }, []);

  useEffect(() => check(), [check]);
  const retry = () => { setChecking(true); check(); };

  if (checking || !blocked) return <>{children}</>;

  return (
    <div role="status" aria-live="polite" className="flex min-h-[92px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-4 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-200">{t('adBlockTitle')}</p>
      <p className="max-w-md text-xs leading-relaxed text-zinc-400">{t('adBlockDescription')}</p>
      <button type="button" onClick={retry} className="rounded-lg border border-amber-300/40 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
        {t('adBlockRetry')}
      </button>
    </div>
  );
}
