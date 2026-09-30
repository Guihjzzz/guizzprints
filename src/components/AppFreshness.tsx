'use client';

import { useEffect } from 'react';

const APP_WORKER_VERSION = '2026-09-covers-v2';

/**
 * Keeps the installed Guizzprints app attached to the current website.
 * The worker deliberately uses a network-first shell and only removes cache
 * names created by older Guizzprints/Next-PWA builds. Guide 3D assets and
 * browser HTTP cache entries are left untouched.
 */
export function AppFreshness() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          `/sw.js?v=${APP_WORKER_VERSION}`,
          { scope: '/', updateViaCache: 'none' },
        );
        await registration.update();
      } catch {
        // The website remains fully functional when installation APIs are
        // unavailable (private browsing, local policies or older browsers).
      }
    };

    void register();
  }, []);

  return null;
}
