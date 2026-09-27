import type { SupabaseClient } from '@supabase/supabase-js';
import { getSafeReturnPath } from './auth-return';

export type AuthMode = 'login' | 'register' | 'reset';
export type AuthMessageKey = 'invalidCredentials' | 'emailNotConfirmed' | 'tooManyAttempts' |
  'captchaRequired' | 'authUnavailable' | 'passwordTooShort' | 'passwordUnchanged' |
  'emailInvalid' | 'usernameInvalid' | 'confirmationSent' | 'resetLinkSent' | 'googleUnavailable';
type AuthApi = Pick<SupabaseClient['auth'], 'signInWithPassword' | 'signUp' | 'resetPasswordForEmail' | 'resend' | 'signInWithOAuth'>;
type AuthInput = { mode: AuthMode; email: string; password: string; username: string;
  locale: string; origin: string; next: string | null; captchaToken?: string };
export type AuthOutcome = { redirect: string } | {
  key: AuthMessageKey; success: boolean; confirmation?: boolean; emailAttempt?: boolean;
};
const safeLocale = (locale: string) => ['en', 'pt', 'es'].includes(locale) ? locale : 'en';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_USERNAME_LENGTH = 60;

/** Normalize user-controlled identifiers before any Auth provider request. */
export function normalizeAuthEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email) ? email : null;
}

export function normalizeAuthUsername(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const username = value.trim();
  return username.length > 0 && username.length <= MAX_USERNAME_LENGTH && !/[\u0000-\u001f\u007f]/u.test(username)
    ? username : null;
}

/** Never display upstream messages or disclose whether an email is registered. */
export function authErrorKey(error: unknown): AuthMessageKey {
  const { code, status } = (error ?? {}) as { code?: string; status?: number };
  if (status === 429 || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(code ?? '')) return 'tooManyAttempts';
  if (code === 'invalid_credentials') return 'invalidCredentials';
  if (code === 'email_not_confirmed') return 'emailNotConfirmed';
  if (code === 'captcha_failed') return 'captchaRequired';
  if (code === 'weak_password') return 'passwordTooShort';
  if (code === 'same_password') return 'passwordUnchanged';
  if (code === 'email_address_invalid') return 'emailInvalid';
  return 'authUnavailable';
}

export function authCallbackUrl(origin: string, locale: string, next: string | null, recovery = false): string {
  const language = safeLocale(locale);
  const safeReturn = getSafeReturnPath(next);
  const url = new URL('/auth/callback', origin);
  url.searchParams.set('locale', language);
  url.searchParams.set('next', recovery ? `/${language}/login/update-password` : safeReturn ?? `/${language}`);
  if (recovery && safeReturn) url.searchParams.set('returnTo', safeReturn);
  return url.toString();
}

export async function submitEmailAuth(auth: AuthApi, input: AuthInput): Promise<AuthOutcome> {
  const email = normalizeAuthEmail(input.email);
  const locale = safeLocale(input.locale);
  const captchaToken = input.captchaToken;
  if (!email) return { key: 'emailInvalid', success: false };
  const username = input.mode === 'register' ? normalizeAuthUsername(input.username) : null;
  if (input.mode === 'register' && !username) return { key: 'usernameInvalid', success: false };
  if (input.mode === 'reset') {
    const { error } = await auth.resetPasswordForEmail(email, {
      redirectTo: authCallbackUrl(input.origin, locale, input.next, true), captchaToken,
    });
    return error ? { key: authErrorKey(error), success: false, emailAttempt: true }
      : { key: 'resetLinkSent', success: true, emailAttempt: true };
  }
  if (input.mode === 'login') {
    const { error } = await auth.signInWithPassword({ email, password: input.password, options: { captchaToken } });
    return error ? { key: authErrorKey(error), success: false, confirmation: error.code === 'email_not_confirmed' }
      : { redirect: getSafeReturnPath(input.next) ?? `/${locale}` };
  }
  const { data, error } = await auth.signUp({ email, password: input.password, options: {
    data: { username, locale }, captchaToken,
    emailRedirectTo: authCallbackUrl(input.origin, locale, input.next),
  } });
  if (error && error.code !== 'user_already_exists') return { key: authErrorKey(error), success: false, emailAttempt: true };
  if (data?.session) return { redirect: getSafeReturnPath(input.next) ?? `/${locale}` };
  return { key: 'confirmationSent', success: true, confirmation: true, emailAttempt: true };
}

export async function resendConfirmation(auth: AuthApi, input: Omit<AuthInput, 'mode' | 'password' | 'username'>): Promise<AuthOutcome> {
  const email = normalizeAuthEmail(input.email);
  if (!email) return { key: 'emailInvalid', success: false };
  const { error } = await auth.resend({ type: 'signup', email, options: {
    captchaToken: input.captchaToken,
    emailRedirectTo: authCallbackUrl(input.origin, input.locale, input.next),
  } });
  return error && error.code !== 'user_not_found'
    ? { key: authErrorKey(error), success: false, emailAttempt: true }
    : { key: 'confirmationSent', success: true, confirmation: true, emailAttempt: true };
}

export async function googleAuthUrl(auth: AuthApi, input: {
  origin: string; locale: string; next: string | null; supabaseUrl: string;
}): Promise<string | null> {
  const { data, error } = await auth.signInWithOAuth({ provider: 'google', options: {
    redirectTo: authCallbackUrl(input.origin, input.locale, input.next),
    skipBrowserRedirect: true, queryParams: { prompt: 'select_account' },
  } });
  if (error || !data.url) return null;
  try {
    const url = new URL(data.url);
    if (url.username || url.password || url.origin !== new URL(input.supabaseUrl).origin || url.pathname !== '/auth/v1/authorize' ||
      url.searchParams.get('provider') !== 'google') return null;
    return url.toString();
  } catch { return null; }
}
