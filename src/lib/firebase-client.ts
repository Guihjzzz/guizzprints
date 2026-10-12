'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { browserLocalPersistence, browserSessionPersistence, getAuth, setPersistence, type Auth, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // Keep redirect sign-in first-party on the canonical production domain.
  // Preview/local hosts must keep Firebase's configured domain because they
  // are not registered as Google OAuth callback origins.
  authDomain: typeof window !== 'undefined' && window.location.hostname === 'guizzprints.xyz'
    ? 'guizzprints.xyz'
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let persistenceStarted = false;
let persistencePromise: Promise<void> | null = null;

function preparePersistence(auth: Auth) {
  if (!persistenceStarted && typeof window !== 'undefined') {
    persistenceStarted = true;
    // A redirect must not begin before Firebase knows where to restore the
    // session. Keep the failure non-fatal: Firebase's default persistence is
    // still safer than leaving the login screen blocked forever.
    persistencePromise = setPersistence(auth, browserLocalPersistence)
      // Private/mobile browsers may reject localStorage while still allowing
      // sessionStorage, which is enough to survive the same-tab OAuth return.
      .catch(() => setPersistence(auth, browserSessionPersistence))
      .catch(() => undefined);
  }
  return persistencePromise ?? Promise.resolve();
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  const auth = getAuth(app);
  void preparePersistence(auth);
  return auth;
}

/** Ensures browser persistence is ready before an interactive sign-in starts. */
export async function getPreparedFirebaseAuth(): Promise<Auth | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  await preparePersistence(auth);
  return auth;
}

export async function getFirebaseUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  if (typeof window === 'undefined') {
    await auth.authStateReady();
    return auth.currentUser;
  }
  // Mobile browsers can take longer to restore IndexedDB/session persistence
  // after an OAuth redirect. Wait for Firebase's initial auth state instead of
  // treating the temporary null currentUser as a signed-out account.
  let timeout: number | null = null;
  try {
    await Promise.race([
      Promise.all([preparePersistence(auth), auth.authStateReady()]),
      new Promise<void>((resolve) => {
        timeout = window.setTimeout(resolve, 10000);
      }),
    ]);
  } finally {
    if (timeout !== null) window.clearTimeout(timeout);
  }
  return auth.currentUser;
}

export async function getFirebaseIdToken(): Promise<string | null> {
  const user = await getFirebaseUser();
  return user ? user.getIdToken() : null;
}
