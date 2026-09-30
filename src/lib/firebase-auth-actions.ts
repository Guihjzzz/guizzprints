import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithRedirect, updateProfile, type Auth } from 'firebase/auth';
import { getPreparedFirebaseAuth } from './firebase-client';
import { getSafeReturnPath } from './auth-return';
import { normalizeAuthEmail, normalizeAuthUsername, type AuthMessageKey, type AuthMode, type AuthOutcome } from './auth-actions';

type FirebaseAuthInput = { mode: AuthMode; email: string; password: string; username: string; locale: string; origin: string; next: string | null };

function errorKey(error: unknown): AuthMessageKey {
  const code = (error as { code?: string } | null)?.code || '';
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(code)) return 'invalidCredentials';
  if (code === 'auth/too-many-requests') return 'tooManyAttempts';
  if (code === 'auth/weak-password') return 'passwordTooShort';
  if (code === 'auth/invalid-email') return 'emailInvalid';
  return 'authUnavailable';
}

async function configuredAuth() {
  const auth = await getPreparedFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  return auth;
}

function continueTo(locale: string, next: string | null) {
  return getSafeReturnPath(next) ?? `/${locale}`;
}

function verificationUrl(origin: string, locale: string, next: string | null) {
  const url = new URL(`/${locale}/login`, origin);
  const target = getSafeReturnPath(next);
  if (target) url.searchParams.set('next', target);
  return url.toString();
}

function passwordResetUrl(origin: string, locale: string, next: string | null) {
  const url = new URL(`/${locale}/login/update-password`, origin);
  const target = getSafeReturnPath(next);
  if (target) url.searchParams.set('next', target);
  return url.toString();
}

async function waitForRedirect(operation: Promise<void>) {
  let timeout: number | null = null;
  try {
    await Promise.race([
      operation,
      new Promise<void>((_, reject) => {
        timeout = window.setTimeout(() => reject(new Error('Firebase redirect timed out.')), 12000);
      }),
    ]);
  } finally {
    if (timeout !== null) window.clearTimeout(timeout);
  }
}

export async function submitFirebaseEmailAuth(input: FirebaseAuthInput): Promise<AuthOutcome> {
  const email = normalizeAuthEmail(input.email);
  if (!email) return { key: 'emailInvalid', success: false };
  const auth = await configuredAuth();
  try {
    if (input.mode === 'reset') {
      await sendPasswordResetEmail(auth, email, { url: passwordResetUrl(input.origin, input.locale, input.next) });
      return { key: 'resetLinkSent', success: true, emailAttempt: true };
    }
    if (input.mode === 'login') {
      await signInWithEmailAndPassword(auth, email, input.password);
      return { redirect: continueTo(input.locale, input.next) };
    }
    const username = normalizeAuthUsername(input.username);
    if (!username) return { key: 'usernameInvalid', success: false };
    const result = await createUserWithEmailAndPassword(auth, email, input.password);
    await updateProfile(result.user, { displayName: username });
    await sendEmailVerification(result.user, { url: verificationUrl(input.origin, input.locale, input.next) });
    return { redirect: continueTo(input.locale, input.next) };
  } catch (error) {
    return { key: errorKey(error), success: false, emailAttempt: input.mode !== 'login' };
  }
}

export async function resendFirebaseConfirmation(input: Omit<FirebaseAuthInput, 'mode' | 'password' | 'username'>): Promise<AuthOutcome> {
  const email = normalizeAuthEmail(input.email);
  const auth = await configuredAuth();
  if (!email || auth.currentUser?.email?.toLowerCase() !== email) return { key: 'confirmationSent', success: true, confirmation: true, emailAttempt: true };
  try {
    await sendEmailVerification(auth.currentUser, { url: verificationUrl(input.origin, input.locale, input.next) });
    return { key: 'confirmationSent', success: true, confirmation: true, emailAttempt: true };
  } catch (error) {
    return { key: errorKey(error), success: false, emailAttempt: true };
  }
}

export async function signInWithFirebaseGoogle(input: Pick<FirebaseAuthInput, 'locale' | 'next'>): Promise<AuthOutcome | { redirectStarted: true }> {
  const auth = await configuredAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await waitForRedirect(signInWithRedirect(auth, provider));
    // Firebase owns the browser navigation from this point. Returning the
    // application's home URL here used to cancel the provider redirect.
    return { redirectStarted: true };
  } catch (error) {
    return { key: errorKey(error), success: false };
  }
}

export async function updateFirebasePassword(auth: Auth, password: string) {
  const { updatePassword } = await import('firebase/auth');
  if (!auth.currentUser) throw new Error('No authenticated Firebase user.');
  await updatePassword(auth.currentUser, password);
}
