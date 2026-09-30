'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from './supabase';
import { getFirebaseAuth } from './firebase-client';

let adminLookup: Promise<string | null> | null = null;
let cachedAdminToken: string | null = null;
let cachedAdminCheckedAt = 0;
const ADMIN_CACHE_MS = 2500;

function clearAdminLookup() {
  cachedAdminToken = null;
  cachedAdminCheckedAt = 0;
}

export async function getClientAuthToken() {
  const firebaseToken = await getFirebaseAuth()?.currentUser?.getIdToken() ?? null;
  if (firebaseToken) return firebaseToken;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function getClientAdminAuthToken() {
  if (Date.now() - cachedAdminCheckedAt < ADMIN_CACHE_MS) return cachedAdminToken;
  if (adminLookup) return adminLookup;

  adminLookup = (async () => {
  const [firebaseToken, supabaseSession] = await Promise.all([
    getFirebaseAuth()?.currentUser?.getIdToken() ?? null,
    supabase.auth.getSession(),
  ]);
  const candidates = [...new Set([
    firebaseToken,
    supabaseSession.data.session?.access_token ?? null,
  ].filter((token): token is string => Boolean(token)))];

  for (const token of candidates) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    try {
      const response = await fetch('/api/admin/status', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (response.ok) return token;
    } catch {
      // Try the other authenticated provider when one session is stale.
    } finally {
      window.clearTimeout(timeout);
    }
  }
  return null;
  })();

  try {
    cachedAdminToken = await adminLookup;
    cachedAdminCheckedAt = Date.now();
    return cachedAdminToken;
  } finally {
    adminLookup = null;
  }
}

export async function getClientAuthUser() {
  const firebaseUser = getFirebaseAuth()?.currentUser;
  if (firebaseUser) return { id: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email ?? null, displayName: session.user.user_metadata?.username ?? null };
}

export function listenToClientAuth(callback: () => void) {
  const firebaseAuth = getFirebaseAuth();
  const notify = () => { clearAdminLookup(); callback(); };
  const unsubscribeFirebase = firebaseAuth ? onAuthStateChanged(firebaseAuth, notify) : () => undefined;
  const { data: subscription } = supabase.auth.onAuthStateChange(notify);
  return () => { unsubscribeFirebase(); subscription.subscription.unsubscribe(); };
}
