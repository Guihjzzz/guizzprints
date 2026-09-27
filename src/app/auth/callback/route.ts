import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { getAuthCallbackReturnPath, getAuthCallbackFailurePath, getSafeReturnPath } from '@/lib/auth-return';
import { logServerFailure } from '@/lib/server-observability';

const emailTypes = new Set(['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email']);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const code = searchParams.get('code');
  const rawType = searchParams.get('type');
  const type = rawType && emailTypes.has(rawType) ? rawType as EmailOtpType : null;
  const nextParam = searchParams.get('next');
  const localeParam = searchParams.get('locale');
  const locale = localeParam && ['en', 'pt', 'es'].includes(localeParam)
    ? localeParam : /^\/(en|pt|es)(?:\/|$)/.exec(nextParam ?? '')?.[1] ?? 'en';
  const recovery = type === 'recovery' || ['en', 'pt', 'es'].some(language => nextParam === `/${language}/login/update-password`);
  let next = getAuthCallbackReturnPath(nextParam, type, locale);
  const returnTo = getSafeReturnPath(searchParams.get('returnTo'));
  if (recovery && returnTo) next += `?next=${encodeURIComponent(returnTo)}`;
  const failure = getAuthCallbackFailurePath(returnTo ?? nextParam, locale, recovery);
  const redirect = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin));
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (searchParams.has('error') || !(code || (tokenHash && type)) || !url || !key) return redirect(failure);
  try {
    const store = await cookies();
    const client = createServerClient(url, key, { cookies: {
      getAll: () => store.getAll(),
      setAll: values => { values.forEach(({ name, value, options }) => store.set(name, value, options)); },
    } });
    const { error } = code ? await client.auth.exchangeCodeForSession(code)
      : await client.auth.verifyOtp({ type: type!, token_hash: tokenHash! });
    return redirect(error ? failure : next);
  } catch {
    logServerFailure('auth-callback', 'session-exchange', 'unexpected');
    return redirect(failure);
  }
}
