'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

/** Supabase validates this single-use token; the secret must never enter the browser. */
export default function AuthCaptcha({ siteKey, locale, resetKey, onToken, unavailable, retry }: {
  siteKey: string; locale: string; resetKey: number; onToken: (token: string) => void;
  unavailable: string; retry: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loaded = useCallback(() => { setReady(true); setFailed(false); }, []);
  useEffect(() => {
    onToken('');
    const api = window.turnstile;
    const element = container.current;
    if (!ready || !api || !element) return;
    let live = true;
    let id: string | undefined;
    try {
      id = api.render(element, {
        sitekey: siteKey, theme: 'dark', language: locale,
        size: element.clientWidth < 300 ? 'compact' : 'normal',
        callback: (token: string) => { if (live) onToken(token); },
        'expired-callback': () => { if (live) onToken(''); },
        'error-callback': () => { if (live) { onToken(''); setFailed(true); } },
      });
    } catch { queueMicrotask(() => { if (live) setFailed(true); }); }
    return () => { live = false; onToken(''); if (id) { try { api.remove(id); } catch { /* Already removed by vendor. */ } } };
  }, [ready, siteKey, locale, resetKey, attempt, onToken]);
  return <div className="space-y-2">
    <Script id="auth-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive" onReady={loaded} onError={() => { setFailed(true); onToken(''); }} />
    <div ref={container} className="flex justify-center min-h-16" />
    {failed && <div role="alert" className="text-xs text-amber-300 text-center">
      <p>{unavailable}</p>
      <button type="button" className="mt-2 underline" onClick={() => {
        if (window.turnstile) { setFailed(false); setReady(true); setAttempt(value => value + 1); }
        else window.location.reload();
      }}>{retry}</button>
    </div>}
  </div>;
}
