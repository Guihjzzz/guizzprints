'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

type Runtime = 'server' | 'browser' | 'android-app';

function getRuntime(): Runtime {
  if (typeof window === 'undefined') return 'server';

  const nativeWindow = window as Window & { GuizzPrintsApp?: unknown };
  const isAndroidApp = Boolean(nativeWindow.GuizzPrintsApp)
    || /GuizzPrintsAndroid\/1\.0/i.test(navigator.userAgent);

  return isAndroidApp ? 'android-app' : 'browser';
}

function subscribeToRuntime() {
  return () => {};
}

function getServerRuntime(): Runtime {
  return 'server';
}

/** Keeps the site-install promotion available in browsers, but not in the Android app shell. */
export function BrowserOnlyInstallPromotion({ children }: { children: ReactNode }) {
  const runtime = useSyncExternalStore(subscribeToRuntime, getRuntime, getServerRuntime);

  // Wait until the shell is known so the promotion never flashes inside the app.
  return runtime === 'browser' ? children : null;
}
