'use client';

import React, { useCallback, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, LogIn, UserPlus, ArrowLeft, Loader2, AtSign, KeyRound } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { defaultLocale, isAppLocale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getSafeReturnPath } from '@/lib/auth-return';
import { googleAuthUrl, resendConfirmation, submitEmailAuth, type AuthMode, type AuthOutcome } from '@/lib/auth-actions';
import { isFirebaseConfigured } from '@/lib/firebase-client';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { getRedirectResult } from 'firebase/auth';
import { resendFirebaseConfirmation, signInWithFirebaseGoogle, submitFirebaseEmailAuth } from '@/lib/firebase-auth-actions';
import AuthCaptcha from '@/components/AuthCaptcha';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const fieldClass = 'w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white disabled:opacity-50';

export default function LoginPage() {
  return <React.Suspense fallback={<div className="min-h-screen bg-[#07090D]"/>}><LoginForm/></React.Suspense>;
}

function LoginForm() {
  const params = useParams();
  const locale = isAppLocale(params.locale) ? params.locale : defaultLocale;
  const t = useTranslations('Auth');
  const query = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(query.get('mode') === 'reset' ? 'reset' : 'login');
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(query.has('error') ? { success: false, text: t('invalidLink') } : null);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const focusEmailRef = useRef(false);
  const [confirmation, setConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [clock, setClock] = useState(0);
  const cooldowns = useRef(new Map<string, number>());
  const [cooldownView, setCooldownView] = useState<Record<string, number>>({});
  const firebaseEnabled = isFirebaseConfigured();
  const captchaEnabled = Boolean(siteKey && !firebaseEnabled);
  const onToken = useCallback((token: string) => setCaptchaToken(token), []);
  const email = form.email.trim().toLowerCase();
  const wait = Math.max(0, Math.ceil(((cooldownView[email] ?? 0) - clock) / 1000));
  const emailAction = mode !== 'login';

  // Keep the Google action visible on every non-reset auth screen. The public
  // `/auth/v1/settings` endpoint can report a false negative on Vercel Preview
  // origins even when Google is enabled in Supabase. `signInWithOAuth` remains
  // the source of truth and returns a safe generic message if configuration is
  // ever disabled.
  const googleEnabled = mode !== 'reset';

  React.useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!firebaseEnabled) return;
    const auth = getFirebaseAuth();
    if (!auth) return;
    let active = true;
    void getRedirectResult(auth).then((result) => {
      if (!active || !result?.user) return;
      window.location.assign(next() ?? `/${locale}`);
    }).catch((error: unknown) => {
      if (!active) return;
      const code = (error as { code?: string } | null)?.code || '';
      setMessage({ success: false, text: code === 'auth/unauthorized-domain'
        ? 'Este domínio ainda não está autorizado no Firebase.'
        : t('googleUnavailable') });
    });
    return () => { active = false; };
  }, [firebaseEnabled, locale, t]);

  React.useEffect(() => {
    if (!focusEmailRef.current) return;
    emailInputRef.current?.focus();
    focusEmailRef.current = false;
  }, [mode]);

  const next = () => getSafeReturnPath(new URLSearchParams(window.location.search).get('next'));
  const changeMode = (value: AuthMode) => {
    if (busy.current) return;
    setMode(value); focusEmailRef.current = true; setConfirmation(false); setShowPassword(false); setMessage(null); setCaptchaToken(''); setCaptchaReset(value => value + 1);
    setForm(value => ({ ...value, password: '' }));
  };
  const applyOutcome = (outcome: AuthOutcome) => {
    if ('redirect' in outcome) { window.location.assign(outcome.redirect); return; }
    setMessage({ success: outcome.success, text: t(outcome.key) });
    if (outcome.confirmation) setConfirmation(true);
  };
  const run = async (action: 'submit' | 'resend') => {
    if (busy.current) return;
    const sendsEmail = action === 'resend' || mode !== 'login';
    if (!email || (action === 'submit' && mode !== 'reset' && (!form.password || (mode === 'register' && !form.username.trim())))) {
      setMessage({ success: false, text: t('fieldsRequired') }); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage({ success: false, text: t('emailInvalid') }); return; }
    if (action === 'submit' && mode === 'register' && form.password.length < 8) {
      setMessage({ success: false, text: t('passwordTooShort') }); return;
    }
    if (sendsEmail && (cooldowns.current.get(email) ?? 0) > Date.now()) return;
    if (captchaEnabled && !captchaToken) { setMessage({ success: false, text: t('captchaRequired') }); return; }
    busy.current = true; setLoading(true); setMessage(null);
    // UX cooldown only. Supabase rate limits and CAPTCHA enforce protection on the server.
    if (sendsEmail) {
      const until = Date.now() + 60000;
      cooldowns.current.set(email, until); setCooldownView(value => ({ ...value, [email]: until })); setClock(Date.now());
    }
    let navigating = false;
    try {
      const input = { ...form, locale, origin: window.location.origin, next: next(), captchaToken: captchaToken || undefined };
      let outcome = action === 'resend'
        ? firebaseEnabled ? await resendFirebaseConfirmation(input) : await resendConfirmation(supabase.auth, input)
        : firebaseEnabled ? await submitFirebaseEmailAuth({ ...input, mode }) : await submitEmailAuth(supabase.auth, { ...input, mode });
      // Existing Guizzprints accounts were created in Supabase before Firebase
      // was enabled. Keep those accounts usable while users migrate.
      if (firebaseEnabled && action === 'submit' && mode !== 'reset' && !('redirect' in outcome)) {
        outcome = await submitEmailAuth(supabase.auth, { ...input, mode });
      }
      navigating = 'redirect' in outcome;
      applyOutcome(outcome);
    } catch { setMessage({ success: false, text: t('authUnavailable') }); }
    finally {
      if (!navigating) { busy.current = false; setLoading(false); }
      setCaptchaToken(''); setCaptchaReset(value => value + 1);
    }
  };
  const google = async () => {
    if (busy.current) return;
    busy.current = true; setLoading(true); setMessage(null);
    let navigating = false;
    try {
      if (firebaseEnabled) {
        const outcome = await signInWithFirebaseGoogle({ locale, next: next() });
        if ('redirect' in outcome) { navigating = true; applyOutcome(outcome); return; }
        // Firebase is the configured production identity provider. Never
        // fall back to Supabase Google here: that provider is intentionally
        // disabled and would hide a Firebase configuration error.
        applyOutcome(outcome);
        return;
      }
      const url = await googleAuthUrl(supabase.auth, { origin: window.location.origin, locale, next: next(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL! });
      if (url) { navigating = true; window.location.assign(url); return; }
      setMessage({ success: false, text: t('googleUnavailable') });
    } catch { setMessage({ success: false, text: t('googleUnavailable') }); }
    finally { if (!navigating) { busy.current = false; setLoading(false); } }
  };
  const blocked = loading || Boolean(captchaEnabled && !captchaToken) || (emailAction && wait > 0);
  return <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#111318] border border-[#1D2433] rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-6 border-b border-[#1D2433] pb-6">
        <button type="button" aria-label={t('back')} disabled={loading} onClick={() => mode !== 'login'
          ? changeMode('login') : window.location.assign(next() ?? `/${locale}`)}
          className="p-2 bg-[#07090D] border border-[#1D2433] rounded-xl text-zinc-400 hover:text-white transition cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <div><h1 className="text-2xl font-black uppercase tracking-tight text-white"><span className="text-blue-500">Guizz</span> Auth</h1>
          <p aria-live="polite" className="text-xs text-zinc-400 mt-1">{t(`${mode}Subtitle`)}</p></div>
      </div>
      {message && <div role={message.success ? 'status' : 'alert'} className={`p-4 rounded-xl border text-sm text-center mb-6 ${
        message.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
        {message.text}
      </div>}
      {googleEnabled && <div className="mb-6">
        <button type="button" disabled={loading} onClick={google}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-900 disabled:opacity-50 font-bold py-3 rounded-xl transition flex items-center justify-center gap-3">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c2-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6a6.1 6.1 0 0 1-9-3.2H3v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.5H3a10 10 0 0 0 0 9l3.4-2.7Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9 5.5l3.4 2.7A6 6 0 0 1 12 6Z"/></svg>
          {t('continueWithGoogle')}
        </button>
        <p className="text-xs text-zinc-500 text-center mt-4">{t('orEmail')}</p>
      </div>}
      <form onSubmit={event => { event.preventDefault(); void run('submit'); }} className="space-y-4" aria-busy={loading}>
        {mode === 'register' && <div className="space-y-2">
          <label htmlFor="auth-username" className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2"><AtSign size={14}/>{t('username')}</label>
          <input id="auth-username" name="username" autoComplete="username" required maxLength={60} value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} placeholder={t('usernamePlaceholder')} disabled={loading} className={fieldClass}/>
        </div>}
        <div className="space-y-2">
          <label htmlFor="auth-email" className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2"><Mail size={14}/>{t('email')}</label>
          <input ref={emailInputRef} id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setConfirmation(false); }} placeholder="you@example.com" disabled={loading} className={fieldClass}/>
        </div>
        {mode !== 'reset' && <div className="space-y-2">
          <div className="flex justify-between items-center gap-3">
            <label htmlFor="auth-password" className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2"><Lock size={14}/>{t('password')}</label>
            {mode === 'login' && <button type="button" disabled={loading} onClick={() => changeMode('reset')}
              className="text-xs text-zinc-400 hover:text-blue-400 transition">{t('forgotPassword')}</button>}
          </div>
          <div className="relative">
            <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required
              minLength={mode === 'register' ? 8 : undefined} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" disabled={loading} className={`${fieldClass} pr-24`}/>
            <button type="button" aria-controls="auth-password" aria-pressed={showPassword} disabled={loading}
              onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-2 my-1 rounded-lg px-2 text-xs font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50">
              {showPassword ? t('hidePassword') : t('showPassword')}
            </button>
          </div>
          {mode === 'register' && <p className="text-xs text-zinc-500">{t('passwordHint')}</p>}
        </div>}
        {captchaEnabled && <AuthCaptcha siteKey={siteKey} locale={locale} resetKey={captchaReset} onToken={onToken}
          unavailable={t('captchaUnavailable')} retry={t('retry')}/>}
        <button type="submit" disabled={blocked} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed">
          {loading ? <><Loader2 className="animate-spin" size={18}/>{t('working')}</> : emailAction && wait > 0 ? t('resendIn', { seconds: wait })
            : mode === 'login' ? <><LogIn size={18}/>{t('signIn')}</> : mode === 'register' ? <><UserPlus size={18}/>{t('register')}</>
            : <><KeyRound size={18}/>{t('sendResetLink')}</>}
        </button>
        {confirmation && mode !== 'reset' && <button type="button" disabled={loading || wait > 0 || Boolean(captchaEnabled && !captchaToken)}
          onClick={() => void run('resend')} className="w-full bg-[#1A2230] border border-[#334155] text-zinc-200 py-3 rounded-xl text-sm disabled:opacity-50">
          {wait > 0 ? t('resendIn', { seconds: wait }) : t('resendConfirmation')}
        </button>}
      </form>
      <div className="mt-6 pt-6 border-t border-[#1D2433] text-center">
        <button type="button" disabled={loading} onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
          className="text-sm text-zinc-400 hover:text-blue-400 transition font-medium">{mode === 'login' ? t('needAccount') : t('haveAccount')}</button>
      </div>
    </div>
  </div>;
}
