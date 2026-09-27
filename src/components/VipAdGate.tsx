'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type VipStatusResult = { showAds: boolean; expiresAt: number | null };
type SharedStatusRequest = { token: string; promise: Promise<VipStatusResult> };
let sharedStatusRequest: SharedStatusRequest | null = null;

/** Share one entitlement lookup when several ad slots mount together. */
function requestVipStatus(accessToken: string): Promise<VipStatusResult> {
  if (sharedStatusRequest?.token === accessToken) return sharedStatusRequest.promise;

  const promise = fetch('/api/vip/status', {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'same-origin', cache: 'no-store',
  }).then(async response => {
    const payload = await response.json().catch(() => null) as { vip?: unknown; expiresAt?: unknown } | null;
    const expiresAt = typeof payload?.expiresAt === 'string' ? Date.parse(payload.expiresAt) : NaN;
    const active = payload?.vip === true && Number.isFinite(expiresAt) && expiresAt > Date.now();
    return { showAds: !active, expiresAt: active ? expiresAt : null };
  }).catch(() => ({ showAds: true, expiresAt: null })).finally(() => {
    if (sharedStatusRequest?.promise === promise) sharedStatusRequest = null;
  });
  sharedStatusRequest = { token: accessToken, promise };
  return promise;
}

/** Resolve entitlement before mounting any third-party ad iframe. */
export function VipAdGate({ children }: { children: ReactNode }) {
  const [showAds, setShowAds] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;
    let expiryTimer: number | null = null;
    const clearExpiryTimer = () => {
      if (expiryTimer === null) return;
      window.clearTimeout(expiryTimer);
      expiryTimer = null;
    };
    const scheduleExpiryRefresh = (accessToken: string, expiresAt: number) => {
      clearExpiryTimer();
      expiryTimer = window.setTimeout(() => {
        expiryTimer = null;
        void resolveAds(accessToken);
      }, Math.max(0, expiresAt - Date.now() + 100));
    };
    const resolveAds = async (accessToken?: string) => {
      const currentRequest = ++requestId;
      clearExpiryTimer();
      // Hide the third-party iframe while a new session is being resolved.
      // This prevents a just-signed-in VIP from seeing a stale ad during the
      // entitlement request, while failures still fail open to the ad surface.
      if (!cancelled) {
        setChecking(true);
        setShowAds(false);
      }
      if (!accessToken) {
        if (!cancelled && currentRequest === requestId) {
          setShowAds(true);
          setChecking(false);
        }
        return;
      }
      try {
        const status = await requestVipStatus(accessToken);
        if (!cancelled && currentRequest === requestId) {
          setShowAds(status.showAds);
          if (!status.showAds && status.expiresAt) scheduleExpiryRefresh(accessToken, status.expiresAt);
        }
      } catch {
        // Ad delivery is fail-open; entitlement is always enforced by the server.
        if (!cancelled && currentRequest === requestId) setShowAds(true);
      } finally {
        if (!cancelled && currentRequest === requestId) setChecking(false);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolveAds(session?.access_token);
    });
    supabase.auth.getSession()
      .then(({ data }) => resolveAds(data.session?.access_token))
      .catch(() => resolveAds(undefined));
    return () => { cancelled = true; requestId += 1; clearExpiryTimer(); subscription.unsubscribe(); };
  }, []);

  return !checking && showAds ? <>{children}</> : null;
}
