'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from './supabase';
import { getFirebaseAuth, getFirebaseIdToken, getFirebaseUser } from './firebase-client';

export async function getClientAuthToken() {
  const firebaseToken = await getFirebaseIdToken();
  if (firebaseToken) return firebaseToken;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function getClientAuthUser() {
  const firebaseUser = await getFirebaseUser();
  if (firebaseUser) return { id: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email ?? null, displayName: session.user.user_metadata?.username ?? null };
}

export function listenToClientAuth(callback: () => void) {
  const firebaseAuth = getFirebaseAuth();
  const unsubscribeFirebase = firebaseAuth ? onAuthStateChanged(firebaseAuth, callback) : () => undefined;
  const { data: subscription } = supabase.auth.onAuthStateChange(callback);
  return () => { unsubscribeFirebase(); subscription.subscription.unsubscribe(); };
}
