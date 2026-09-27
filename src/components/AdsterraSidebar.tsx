'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export type AdPlacement = 'sidebar' | 'sidebar-stack' | 'mobile' | 'rectangle' | 'leaderboard' | 'download-banner';

const inlineUnits = {
  mobile: { key: 'e38f2eb225dc7b388c95229b924021ae', width: 320, height: 50 },
  rectangle: { key: 'db577e1e1923cb961ba383c563b67ca0', width: 300, height: 250 },
  banner: { key: '31e6a10533838c0d6eb12ad0ddba95c7', width: 468, height: 60 },
  leaderboard: { key: '144aab28723bcc0b9866fc7bbe23e955', width: 728, height: 90 },
};
type InlineUnit = typeof inlineUnits.mobile;

type AdsterraUnit = Pick<InlineUnit, 'key' | 'width' | 'height'>;

declare global {
  interface Window {
    __guizzAdsterraSignals?: {
      attempted: number;
      loaded: number;
      failed: number;
    };
  }
}

// Adsterra regenerated the publisher snippets after Anti-Adblock approval.
// Keep the provider origin in one place so every active format uses the same
// approved script instead of mixing the previous and current code domains.
const ADSTERRA_SCRIPT_ORIGIN = 'https://canvassanymorephotography.com';

// The official snippet uses one global `window.atOptions`. Serialize dynamic
// mounts so a slow network response cannot read the configuration of another
// slot that was inserted immediately after it.
let adsterraQueue: Promise<void> = Promise.resolve();
let adsterraMountSequence = 0;

function recordAdsterraSignal(signal: 'attempted' | 'loaded' | 'failed') {
  const current = window.__guizzAdsterraSignals ?? { attempted: 0, loaded: 0, failed: 0 };
  window.__guizzAdsterraSignals = { ...current, [signal]: current[signal] + 1 };
}

function setAdsterraState(container: HTMLDivElement, state: 'loading' | 'loaded' | 'failed' | 'timeout') {
  if (container.dataset) container.dataset.adsterraScriptState = state;
}
/**
 * Mount the official Adsterra snippet in the page document.
 *
 * Adsterra's invoke.js checks that it is running in the top-level window. The
 * previous srcDoc/sandbox iframe made that check fail before a creative could
 * be requested. Keeping the two official script tags in a real page element
 * lets the provider create its own ad iframe with the correct context.
 */
function mountAdsterra(container: HTMLDivElement, unit: AdsterraUnit) {
  let cancelled = false;
  const mountId = ++adsterraMountSequence;
  const mount = async () => {
    if (cancelled) return;
    recordAdsterraSignal('attempted');
    setAdsterraState(container, 'loading');

    const config = document.createElement('script');
    config.type = 'text/javascript';
    config.textContent = `window.atOptions=${JSON.stringify({
      key: unit.key,
      format: 'iframe',
      height: unit.height,
      width: unit.width,
      params: {},
    })};`;

    const invoke = document.createElement('script');
    invoke.type = 'text/javascript';
    // A new user-driven stage must execute a fresh provider request instead
    // of reusing the browser-cached invoke script from the previous stage.
    invoke.src = `${ADSTERRA_SCRIPT_ORIGIN}/${unit.key}/invoke.js?guizz_mount=${mountId}`;
    invoke.async = false;
    invoke.referrerPolicy = 'strict-origin-when-cross-origin';
    // Keep the vendor snippet intact if the domain is later placed behind
    // Cloudflare Rocket Loader.
    invoke.dataset.cfasync = 'false';

    await new Promise<void>(resolve => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      };
      invoke.onload = () => {
        recordAdsterraSignal('loaded');
        setAdsterraState(container, 'loaded');
        settle();
      };
      invoke.onerror = () => {
        recordAdsterraSignal('failed');
        setAdsterraState(container, 'failed');
        if (typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('guizz:adsterra-script-error', { detail: { key: unit.key } }));
        }
        settle();
      };
      // A blocked request should not prevent another visible slot from
      // loading forever. The provider normally resolves much sooner.
      const timeout = window.setTimeout(() => {
        setAdsterraState(container, 'timeout');
        settle();
      }, 10000);
      container.replaceChildren(config, invoke);
    });
  };

  const job = adsterraQueue.then(mount, mount);
  adsterraQueue = job.then(() => undefined, () => undefined);
  return () => {
    cancelled = true;
    container.replaceChildren();
  };
}

export function AdsterraMobileBanner() {
  return <AdsterraInlineBanner format="mobile" />;
}

export function AdsterraRectangleBanner() {
  return <AdsterraInlineBanner format="rectangle" />;
}

export function AdsterraInlineBanner({ format, refreshKey = 0 }: { format: 'mobile' | 'rectangle' | 'leaderboard' | 'download-banner'; refreshKey?: number }) {
  const t = useTranslations('Category');
  const container = useRef<HTMLDivElement>(null);
  const adHost = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState<InlineUnit | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const media = window.matchMedia('(max-width: 1279px)');
    const update = () => {
      const width = element.getBoundingClientRect().width;
      const candidates = format === 'rectangle' ? [inlineUnits.rectangle]
        : format === 'mobile' ? (media.matches ? [inlineUnits.mobile] : [])
        : format === 'leaderboard' ? [inlineUnits.leaderboard, inlineUnits.banner, inlineUnits.mobile]
        : [inlineUnits.banner, inlineUnits.mobile];
      const eligible = candidates.filter(candidate => candidate.width <= width);
      // On user-driven download stages, alternate only between the two
      // approved horizontal placements. Keep the mobile fallback last so a
      // desktop stage never unexpectedly shrinks to a 320px creative.
      const rotationSize = format === 'leaderboard' || format === 'download-banner' ? Math.min(2, eligible.length) : 0;
      const offset = rotationSize > 1 ? refreshKey % rotationSize : 0;
      const rotated = offset > 0 ? [...eligible.slice(offset, rotationSize), ...eligible.slice(0, offset), ...eligible.slice(rotationSize)] : eligible;
      setUnit(rotated[0] || null);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    media.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, [format, refreshKey]);

  useEffect(() => {
    const element = adHost.current;
    if (!element || !unit) return;
    return mountAdsterra(element, unit);
  }, [unit]);

  return (
    <div ref={container} data-ad-placement={format} className={`adsterra-inline-slot col-span-full flex w-full min-w-0 justify-center ${format === 'mobile' ? 'xl:hidden' : ''}`}>
      {unit && (
        <div aria-label={t('advertisement')} className="flex flex-col items-center gap-1 py-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400">{t('advertisement')}</span>
          <div className="adsterra-frame">
            <div
              ref={adHost}
              data-adsterra-key={unit.key}
              data-adsterra-size={`${unit.width}x${unit.height}`}
              aria-label={`${t('advertisement')} — Adsterra ${unit.width}×${unit.height}`}
              style={{ width: unit.width, height: unit.height }}
              className="adsterra-host block shrink-0 overflow-hidden rounded-[10px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function AdsterraSidebar() {
  const t = useTranslations('Category');
  const [desktop, setDesktop] = useState(false);
  const adHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = adHost.current;
    if (!element || !desktop) return;
    return mountAdsterra(element, { key: 'd498287420805f4ce1f6cf9ee43ff613', width: 160, height: 600 });
  }, [desktop]);

  // Do not request ads merely hidden with CSS on mobile. Future validated
  // ad-free entitlement must also gate mounting here, before loading scripts.
  if (!desktop) return null;

  return (
    <aside aria-label={t('advertisement')} className="hidden xl:flex sticky top-24 z-[1] shrink-0 self-start flex-col items-center gap-2 w-[clamp(176px,12vw,280px)]">
      <span className="text-[10px] uppercase tracking-widest text-zinc-400">{t('advertisement')}</span>
      <div className="adsterra-frame">
        <div
          ref={adHost}
          data-adsterra-key="d498287420805f4ce1f6cf9ee43ff613"
          data-adsterra-size="160x600"
          aria-label={`${t('advertisement')} — Adsterra 160×600`}
          style={{ width: 160, height: 600 }}
          className="adsterra-host block shrink-0 overflow-hidden rounded-[10px]"
        />
      </div>
    </aside>
  );
}
