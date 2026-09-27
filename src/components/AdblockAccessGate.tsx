'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Crown, RefreshCw, ShieldAlert, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type VipStatusPayload = { vip?: unknown; expiresAt?: unknown };

const ADSTERRA_ERROR_EVENT = 'guizz:adsterra-script-error';
// A script that is still loading is not evidence of a blocker: mobile and
// privacy-focused networks can take several seconds before Adsterra settles.
// AdsterraSidebar marks a silent request as `timeout` after 10 seconds, so the
// page gate waits just beyond that point before classifying every slot as
// suppressed. Explicit script errors still use the fast event path below.
const ADSTERRA_SIGNAL_GRACE_MS = 11_000;

function isVipActive(payload: VipStatusPayload | null) {
  const expiresAt = typeof payload?.expiresAt === 'string' ? Date.parse(payload.expiresAt) : NaN;
  return payload?.vip === true && Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function isAccessExempt(pathname: string) {
  return /\/(login|vip|about|privacy|terms|contact)(?:\/|$)/.test(pathname);
}

function detectCosmeticBlocking(): Promise<boolean> {
  if (typeof document === 'undefined' || !document.body) return Promise.resolve(false);

  const probes = [
    { id: 'adblock-test', className: 'ad adsbox ad-banner ad-placement advert advertisement text-ad sponsored-content' },
    { id: 'adblock-test-google', className: 'adsbygoogle ad-unit ad-container' },
  ].map(({ id, className }) => {
    const bait = document.createElement('div');
    bait.id = id;
    bait.className = className;
    bait.setAttribute('aria-hidden', 'true');
    Object.assign(bait.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      display: 'block',
      visibility: 'visible',
      width: '10px',
      height: '10px',
      minWidth: '10px',
      minHeight: '10px',
      pointerEvents: 'none',
      opacity: '0.01',
      zIndex: '-1',
    });
    document.body.appendChild(bait);
    return bait;
  });

  return new Promise(resolve => {
    window.setTimeout(() => {
      const blocked = probes.some(bait => {
        const style = window.getComputedStyle(bait);
        return style.display === 'none'
          || style.visibility === 'hidden'
          || style.opacity === '0'
          || bait.offsetWidth < 2
          || bait.offsetHeight < 2;
      });
      probes.forEach(bait => bait.remove());
      resolve(blocked);
    }, 650);
  });
}

function hasSuppressedAdsterraSlots() {
  const hosts = [...document.querySelectorAll<HTMLElement>('[data-adsterra-key]')];
  if (hosts.length === 0) return false;
  const everyScriptAttempted = hosts.every(host => host.querySelector('script[src*="canvassanymorephotography.com"]'));
  const everyCreativeMissing = hosts.every(host => !host.querySelector('iframe, object, embed'));
  const everyScriptSettledWithoutCreative = hosts.every(host =>
    host.dataset.adsterraScriptState === 'failed' || host.dataset.adsterraScriptState === 'timeout');
  return everyScriptAttempted && everyCreativeMissing && everyScriptSettledWithoutCreative;
}

function waitForAdsterraSignal(): Promise<boolean> {
  return new Promise(resolve => {
    window.setTimeout(() => {
      const signals = window.__guizzAdsterraSignals;
      // A provider-side network error is only treated as an adblock signal
      // when every attempted placement failed. An empty campaign/no-fill is
      // not enough to lock out a visitor.
      const everyAttemptFailed = Boolean(signals?.attempted && signals.failed >= signals.attempted && signals.loaded === 0);
      resolve(everyAttemptFailed || hasSuppressedAdsterraSlots());
    }, ADSTERRA_SIGNAL_GRACE_MS);
  });
}

/**
 * Page-level adblock wall for public catalog routes.
 *
 * This is a client UX gate only. It cannot replace server-side download
 * authorization, and the login/VIP/legal routes remain reachable so a visitor
 * can resolve the block or subscribe.
 */
export function AdblockAccessGate({ locale, children }: { locale: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Category');
  const [blocked, setBlocked] = useState(false);
  const [vip, setVip] = useState(false);
  const [checking, setChecking] = useState(true);
  const exempt = isAccessExempt(pathname);
  const vipRef = useRef(vip);

  useEffect(() => {
    vipRef.current = vip;
  }, [vip]);

  const resolve = useCallback(async () => {
    if (exempt) {
      setBlocked(false);
      setVip(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    let activeVip = false;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        const response = await fetch('/api/vip/status', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const payload = await response.json().catch(() => null) as VipStatusPayload | null;
        activeVip = isVipActive(payload);
      }
    } catch {
      activeVip = false;
    }
    if (activeVip) {
      vipRef.current = true;
      setVip(true);
      setBlocked(false);
      setChecking(false);
      return;
    }
    const [cosmeticBlocked, providerBlocked] = await Promise.all([
      detectCosmeticBlocking(),
      waitForAdsterraSignal(),
    ]);
    vipRef.current = false;
    setVip(activeVip);
    setBlocked(cosmeticBlocked || providerBlocked);
    setChecking(false);
  }, [exempt]);

  useEffect(() => {
    let cancelled = false;
    let delayedErrorCheck: number | null = null;
    const handleScriptError = () => {
      if (delayedErrorCheck !== null) window.clearTimeout(delayedErrorCheck);
      delayedErrorCheck = window.setTimeout(() => {
        const signals = window.__guizzAdsterraSignals;
        const everyAttemptFailed = Boolean(signals?.attempted && signals.failed >= signals.attempted && signals.loaded === 0);
        if (!cancelled && !exempt && !vipRef.current && everyAttemptFailed) {
          setBlocked(true);
          setChecking(false);
        }
      }, 500);
    };
    window.addEventListener(ADSTERRA_ERROR_EVENT, handleScriptError);
    const initialCheck = window.setTimeout(() => { void resolve(); }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(initialCheck);
      if (delayedErrorCheck !== null) window.clearTimeout(delayedErrorCheck);
      window.removeEventListener(ADSTERRA_ERROR_EVENT, handleScriptError);
    };
  }, [exempt, resolve]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void resolve(); });
    return () => subscription.unsubscribe();
  }, [resolve]);

  if (exempt || vip || checking || !blocked) return <>{children}</>;

  return (
    <div className="adblock-wall" role="presentation">
      <div className="adblock-wall-glow adblock-wall-glow-blue" aria-hidden="true" />
      <div className="adblock-wall-glow adblock-wall-glow-gold" aria-hidden="true" />
      <section role="dialog" aria-modal="true" aria-labelledby="adblock-wall-title" aria-describedby="adblock-wall-description" className="adblock-card">
        <button
          type="button"
          onClick={() => { setBlocked(false); void resolve(); }}
          className="adblock-close"
          aria-label={t('adBlockRetry')}
        >
          <X size={17} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <div className="adblock-icon-wrap" aria-hidden="true">
          <ShieldAlert size={30} strokeWidth={1.7} />
        </div>
        <p className="adblock-eyebrow">{t('adBlockEyebrow')}</p>
        <h1 id="adblock-wall-title" className="adblock-title">{t('adBlockTitle')}</h1>
        <p id="adblock-wall-description" className="adblock-description">{t('adBlockDescription')}</p>
        <div className="adblock-actions">
          <Link href={`/${locale}/vip`} className="adblock-vip-button">
            <Crown size={17} strokeWidth={2} aria-hidden="true" />
            <span>{t('adBlockVip')}</span>
            <span className="adblock-button-arrow" aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={() => { setBlocked(false); void resolve(); }}
            className="adblock-reload-button"
          >
            <RefreshCw size={15} strokeWidth={2} aria-hidden="true" />
            <span>{t('adBlockRetry')}</span>
          </button>
        </div>
        <Link href={`/${locale}/login`} className="adblock-login-link">{t('adBlockSignIn')}</Link>
      </section>
    </div>
  );
}
