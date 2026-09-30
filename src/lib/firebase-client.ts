'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, type Auth, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
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
    persistencePromise = setPersistence(auth, browserLocalPersistence).catch(() => undefined);
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
  // Auth state is normally delivered immediately. If browser storage or a
  // provider is unavailable, resolve as signed out instead of making headers,
  // navigation, and the admin check wait forever.
  return new Promise((resolve) => {
    let settled = false;
    let stop: () => void = () => undefined;
    let timeout: number | null = null;
    const finish = (user: User | null) => {
      if (settled) return;
      settled = true;
      if (timeout !== null) window.clearTimeout(timeout);
      stop();
      resolve(user);
    };
    timeout = window.setTimeout(() => finish(null), 3000);
    stop = onAuthStateChanged(auth, (user) => {
      finish(user);
    });
    if (settled) stop();
  });
}

export async function getFirebaseIdToken(): Promise<string | null> {
  const user = await getFirebaseUser();
  return user ? user.getIdToken() : null;
}
